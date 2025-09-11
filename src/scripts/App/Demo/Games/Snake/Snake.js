import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Mouse_android_deactivate_scrolling, Mouse_get_pos_difx } from "../../../../Engine/Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_label, Create_widget_slider, Create_widget_switch_simple } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { BLACK, BLUEL, Color_hsv_to_rgb_calibrated, CYAN, GREEN, GREY, PURPLEB, PURPLER, REDL, RGB, TRANSPARENT, WHITE, YELLOWR } from "../../../../Engine/Drawables/Material/Colors.js";
import { Slider_connect, Slider_set_listeners_priority } from "../../../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Switch_set_listeners_priority } from "../../../../Engine/Drawables/Widgets/WidgetSwitch.js";
import { Listeners_set_priority } from "../../../../Engine/Events/EventListeners.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { Gl_set_attr_round_corners, Gl_rotate_z_2d, Gl_set_attr_feather, Gl_set_dim_xy, Gl_add_dim_xy, Gl_add_vpos_y, Gl_add_vpos_x, Gl_set_angle, Gl_add_vpos_xy, Gl_set_wpos_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomPos, GetSequencedColor } from "../../../../Helpers/Helpers.js";
import { Digitize, Linear_interpolation, Logarithmic_interpolation, Normalize } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Magnitude, Magnitude_2vectors } from "../../../../Helpers/Math/MathOperations.js";
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties, Style_switch_default_properties } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Demo_clbk_animations_create_transition_slope, Demo_clbk_animations_text_create } from "../../DemoAnimations.js";
import { Mesh_add_wpos_xy, Mesh_set_and_copy_wpos_xy, Mesh_set_color_rgb, Mesh_update_set_dim_xy } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_calc_pos_dif, Mesh_set_name, Mesh_set_root_in_focus } from "../../../../Engine/Drawables/Operations/MeshPropertiesFunctions.js";
import { Layout_basic_pre_render } from "../../../../Engine/Drawables/Operations/AlignNestedSections.js";
import { Widget_render } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetRender.js";
import { View_destroy_view_group_and_meshes } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Color_theme_label_auto, Color_theme_label_auto2, Color_theme_slider_auto, Color_theme_switch_auto } from "../../../../Engine/Drawables/Material/Themes.js";
import { Vertex_buffer_render_group_get_num_faces, Vertex_buffer_render_group_set_count_from_num_faces } from "../../../../Graphics/Buffers/RenderGroups.js";











const MAX_WIDTH = 400;
const MAX_BODY_MESHES = 100;
const INITIAL_BODY_COUNT = 20;
const collectable_apple_dim = [64 / 2, 73 / 2];
const collectable_dim = [64, 64];
const collectable_scale = .6;

const SLOPE_CONSTANT = .14;
const INITIAL_SIZE = 40;
const SPEED = 4.;
const FEATHER = 3;
const MIN_SIZE = 10;
const START_NEXT_ANIM_SIZE = 2.65; // A size to subtract from the max scale of a body scale up animation, in order to start the next body scale up. In pixel size (half size)
const REDUCE_FACTOR = .1;
const DISTANCE_FACTOR = 1.; // The overlap between snake body meshes. The smaller, the further apart
const TIMER_STEP = .0015;
const SCALE_UP_FACTOR = 1.7;

// const score_font = TEXTURES.MTSDF_CONSOLAS_1024;
const score_font = TEXTURES.MTSDF_COMIC_1024;
const score_size = 14;

// const def_tex_id = TEXTURES.CONSOLA_VARIANT_FONT, def_sub_tex_id = ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S10_0;
const def_tex_id = TEXTURES.MTSDF_CONSOLAS_1024, def_sub_tex_id = INT_NULL;




// Snake's per body mesh properties
/** */
class Body_Mesh_Properties {

   constructor(_mesh = null, glow_intensity = 1) {

      if (!_mesh) alert('000000000013')

      this.mesh = _mesh;
      this.idx = INT_NULL;
      this.size = INITIAL_SIZE;

      // A modifier for the calculation of the slope function that controls the next position of a snake body mesh
      this.t = 0; // Values = [0-1]
      this.prev_slope = 1.;// Stores the current calculated 't' to be used on the next snake 'Move' calculation. 

      this.in_scale_up_animation = false;
      this.in_animation = false;

      this.glow_intensity = glow_intensity;
   }
}








/**************************************************************************************************************************************************************/
// 

/** */
export function Game_snake(y = 0, controls_create = true, controls_render=true) {


   const snake = {

      count: 0, // Number of snake body meshes

      body: New_generic_buffer(_, 'Game Snake Body Meshes'), // Where all snake's body meshes variables will be stored
      color: TRANSPARENCY(YELLOWR[9], 1.),
      style: { rcorners: INITIAL_SIZE, feather: FEATHER, border: 2 },

      points_cnt: 0,

      first_body_mesh_idx: INT_NULL, // The index of the snake head mesh 


      size: INITIAL_SIZE, // Size of the snake body meshes
      speed: SPEED,
      min_size: MIN_SIZE,
      reduce_mod: REDUCE_FACTOR, // 
      init_slope: SLOPE_CONSTANT,
      glow_intensity: .35,
      glow_intensity_step: .1,
      glow_scale_down_factor: 1., // The regular rendered body mesh will be: 'glow_scale_down_factor' times bigger/smaller to the body glow effect 
      distance_factor: DISTANCE_FACTOR, // A modifier to control the distance between the snake body meshes
      start_next_anim: START_NEXT_ANIM_SIZE,
      scale_factor: SCALE_UP_FACTOR,


      rotation: { // This variable is to store the ammount of users input mouse, so that user can rotate the head mesh 
         amt: 0.0,
      },


      step: TIMER_STEP, // The step that the 'Move' function will use to advance the body meshes to the next position


      in_scale_animation: false,


      vel: [1, 0],
      accel: [0, 0],


      feather_slider: { init_val: FEATHER, min: 0, max: INITIAL_SIZE },
      // speed_slider: { init_val: SPEED, min: 0.2, max: 8.0 },
      speed_slider: { init_val: SPEED, min: 0.01, max: 8.0 },
      slope_slider: { init_val: SLOPE_CONSTANT, min: .005, max: 1. },
      next_anim_slider: { init_val: START_NEXT_ANIM_SIZE, min: 2, max: 15 },
      reduce_size_slider: { init_val: REDUCE_FACTOR, min: 0, max: .5 },
      distance_factor_slider: { init_val: DISTANCE_FACTOR, min: 0.3, max: 1.3 },
      max_scale_factor_slider: { init_val: SCALE_UP_FACTOR, min: 1.4, max: 2.2 },
      anim_step_slider: { init_val: TIMER_STEP, min: 0.001, max: 0.007 },


      colors: [GREY[2], GREY[5], GREY[9]],

      // Function Pointers
      Color_set_fn: Snake_body_set_color,
      color_fn_params: {
         fn1: [],
         fn2: {},
      },
   };

   if (snake.feather_slider.init_val < snake.feather_slider.min || snake.feather_slider.init_val > snake.feather_slider.max) alert('0099887766, feather_slider')
   if (snake.speed_slider.init_val < snake.speed_slider.min || snake.speed_slider.init_val > snake.speed_slider.max) alert('0099887766, speed_slider')
   if (snake.slope_slider.init_val < snake.slope_slider.min || snake.slope_slider.init_val > snake.slope_slider.max) alert('0099887766, slope_slider')
   if (snake.reduce_size_slider.init_val < snake.reduce_size_slider.min || snake.reduce_size_slider.init_val > snake.reduce_size_slider.max) alert('0099887766, reduce_size_slider')
   if (snake.distance_factor_slider.init_val < snake.distance_factor_slider.min || snake.distance_factor_slider.init_val > snake.distance_factor_slider.max) alert('0099887766, reduce_size_slider')
   if (snake.max_scale_factor_slider.init_val < snake.max_scale_factor_slider.min || snake.max_scale_factor_slider.init_val > snake.max_scale_factor_slider.max) alert('0099887766, max_scale_factor_slider')
   if (snake.anim_step_slider.init_val < snake.anim_step_slider.min || snake.anim_step_slider.init_val > snake.anim_step_slider.max) alert('0099887766, anim_step_slider')

   snake.color_fn_params.fn1 = snake.colors;




   const vertical_space = y;
   let board_width = ((VIEWPORT.WIDTH / 2) < MAX_WIDTH) ? (VIEWPORT.WIDTH / 2) : MAX_WIDTH;
   let board_height = (VIEWPORT.HEIGHT / 2) - vertical_space / 2 - 10;

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2));
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const board_pad = (20 * log);
   const style = { rcorners: snake.size, feather: 6, border: 3 };

   // TODO: If android: deactivate scrolling
   if (PLATFORM.ANY_SMARTPHONE_DEVICE) {
      Mouse_android_deactivate_scrolling();
      board_width - DEVICE.info.canvas_left + DEVICE.info.canvas_right;
      board_height - DEVICE.info.canvas_top + DEVICE.info.canvas_bot;
   }

   // const board_color = TRANSPARENCY(Interpolate_rgb_to_01(26, 70, 30), 1.);
   // const board_color = Color_hsv_to_rgb_calibrated(.3, .4, 1., 1, .2, .0);
   const board_color = Color_hsv_to_rgb_calibrated(0, 0, 1., 1, .7, 1);
   const section = Create_rect_mesh(Style_rect_default_properties({
      is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[10, y, 0], dim:[board_width - board_pad, board_height], col:board_color, name:'section', 
      texture_id:TEXTURES.SNAKE_BG
   }));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10, });








   /*************************************************************************************************/
   // Create the snake head's nose mesh (Shows the direction of the snke)
   const nose = Create_rect_mesh(Style_rect_default_properties({pos:[0, 0, 1], dim:[4, 8], col:TRANSPARENCY(BLUEL[9], 1.), name:'Nose'}));
   Widget_gfx_ready_enable({mesh:nose, enable_sdf_rect:10, enable_attr_angle:0, });
   section.AddItem(nose);
   


   /*************************************************************************************************/
   // Create the Collectible mesh

   const collectable = Create_rect_mesh(Style_rect_default_properties({pos:[0, 0, 0], dim:collectable_dim, col:REDL[3], name:'collectable', }));
   Widget_gfx_ready_enable({mesh:collectable, enable_sdf_rect:collectable_dim[0], enable_unif_scale:true});
   // Widget_gfx_ready_enable({mesh:collectable, enable_unif_scale:true});
   collectable.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
   section.AddItem(collectable);

   const center_applpe_pos = [
      (collectable.geom.pos[0] + collectable.geom.dim[0]) - (collectable_apple_dim[0] + 0),
      (collectable.geom.pos[1] + collectable.geom.dim[1]) - (collectable_apple_dim[1] + 6),
      1
   ];


   const collectable_apple = Create_rect_mesh(Style_rect_default_properties({pos:center_applpe_pos, dim:collectable_apple_dim, col:WHITE, texture_id:TEXTURES.TEST_APPLE, name:'collectable_apple'}));
   Widget_gfx_ready_enable({mesh:collectable_apple, enable_sdf_rect: 10, });
   section.AddItem(collectable_apple);










   /*************************************************************************************************/
   // Create snake body meshes

   let next_posx = 20;
   let next_posy = 40;
   const generic_controls_parameters = [.0, .7, .5];

   for (let i = 0; i < INITIAL_BODY_COUNT; i++) {

      // Calculate body size according to body mesh index (the greater the index the smaller the size)
      let reduce_size = i * snake.reduce_mod;
      let calc_size = snake.size - reduce_size;
      if (calc_size < snake.min_size) {
         calc_size = snake.min_size;
         reduce_size = 0;
      }

      style.rcorners = calc_size;
      style.feather = snake.style.feather;
      const col = GetSequencedColor(9);
      const body_mesh = Create_rect_mesh(Style_rect_default_properties({pad:[0, 0], pos:[0, 0, 1], dim:[calc_size, calc_size], col:col, layout:LAYOUT.VERTICAL}));
      Widget_gfx_ready_enable({mesh:body_mesh, enable_sdf_rect:style.rcorners, enable_unif_scale:true});

      // body_mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, generic_controls_parameters.length);
      // body_mesh.GfxEnableFn(SID.SHAD.FN_GLOW, { time: 0, });

      section.AddItem(body_mesh);

      const bodyidx = snake.body.Add(new Body_Mesh_Properties(body_mesh, snake.glow_intensity));
      snake.body.buffer[bodyidx].idx = bodyidx; // Store the index for convinience
      snake.body.buffer[bodyidx].size = calc_size; // Store the index for convinience
      snake.body.buffer[bodyidx].reduce_size = reduce_size;

      snake.count++;
      if (bodyidx !== i) alert('514332139908', 'snake body mesh index mismatch');
      // Name each body according to its index 
      Mesh_set_name(body_mesh, 'body-' + bodyidx);


      next_posx += reduce_size;
      next_posy += reduce_size;

   }







   /*************************************************************************************************/
   // Implement mouse controls directly to the section panel

   section.Bind(
      (params) => { // Click callback

         const mouse_xdif = Mouse_get_pos_difx();
         if (Abs(mouse_xdif) > .5) {

            /*******************************************************************************************/
            // Nose Rotation. Just add the ammount of mouse move on the x axis
            const mod = .02;
            const snake = params.params.target_params.snake;
            const nose = params.params.target_params.nose;
            const head = snake.body.buffer[0].mesh;



            if (snake.body.buffer[0].in_animation === false) 
            { // Let user been able to rotate immidiately after user input, instead of waiting the snake animation to take place 

               snake.rotation.amt += mouse_xdif * mod;

               snake.vel[0] = Math.sin(snake.rotation.amt);
               snake.vel[1] = Math.cos(snake.rotation.amt);

               const rot_amt = snake.rotation.amt;
               Gl_rotate_z_2d(nose.gfx, nose.geom.dim, rot_amt, 1);
               
               const angle = Math.atan2(snake.vel[0], snake.vel[1]);
               const normalizedAngle = angle >= 0 ? angle : (2 * Math.PI + angle); // Normalize from -π,π to 0,π
               Gl_set_angle(nose.gfx, normalizedAngle);
               
               
               // const scale = .9;
               const scale = 1.;
               
               const r = head.geom.dim[0] * scale; // Set the radius in which the sattelite will be rotating (perimetricaly)
               const cx = nose.geom.pos[0]; // Center to sattelites position
               const cy = nose.geom.pos[1]
               const a = (cx + (r * Math.sin(angle))) * scale; // The rotation is the tangent of the outer head's perimeter 
               const b = (cy + (r * Math.cos(angle))) * scale;
               
               const new_posx = head.geom.pos[0] + head.geom.dim[0] + a;
               const new_posy = head.geom.pos[1] + head.geom.dim[1] + b;
               
               Gl_set_wpos_xy(nose.gfx, new_posx, new_posy, nose.geom.num_faces);

            }
         }
      },
      _,
      { target_params: { snake: snake, nose: nose } },
      MESH_STATE_FLAGS.IS_HOLD_CLICK
   );







   /*************************************************************************************************/
   // Create the points counter

   const text_pad_x = 7, text_pad_y = 3;
   const digit_meshes_arr = [];
   // const digit1_label = Create_widget_label(Style_label_default_properties({text:'0', pos:[0, 0, 0], col:TRANSPARENCY(YELLOWR[9], 1.), text_pad:[text_pad_x, text_pad_y], font_size:score_font}));
   const digit1_label = Create_widget_label(Style_label_default_properties({
      is_root: _, 
      pos: [0,0,0], col:TRANSPARENCY(YELLOWR[9], 1.), text_pad: [text_pad_x, text_pad_y], text: '0',
      texture_id: score_font, font_size:score_size, layout: LAYOUT.VERTICAL,
      
   }));
   Widget_gfx_ready_enable({mesh:digit1_label, enable_sdf_rect:digit1_label.geom.dim[0]});
   digit1_label.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;
   section.AddItem(digit1_label);
   digit_meshes_arr.push(digit1_label);

   // Calculate score label width before creation. Works only if the font is already in use (loaded)
   // const score_label = Create_widget_label(Style_label_default_properties({text:'score', col:GREEN[7], text_pad:[text_pad_x, text_pad_y], font_size:score_font}));
   const score_label = Create_widget_label(Style_label_default_properties({
      is_root: _, 
      // text:'score', col:GREEN[7], text_pad:[text_pad_x, text_pad_y],
      text:'score', col:TRANSPARENT, text_pad:[text_pad_x, text_pad_y],
      texture_id: score_font, font_size:score_size, layout: LAYOUT.VERTICAL,
   }));
   Widget_gfx_ready_enable({mesh:score_label, enable_sdf_rect:score_label.geom.dim[1]});
   score_label.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;
   section.AddItem(score_label);

   const score_slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, .1, 10);




   const digit_pos_x = section.geom.pos[0] + section.geom.dim[0] * 2;
   digit1_label.MoveNoGfxUpdate(digit_pos_x - (digit1_label.geom.dim[0] * 2 + 10), 10);
   score_label.MoveNoGfxUpdate(digit_pos_x - (score_label.geom.dim[0] * 2 + digit1_label.geom.dim[0] * 6 + 10), 10);




   /*************************************************************************************************/
   // Render Section 
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;
   section.GenGfxCtx();
   Widget_render(section);


   // Set callback for uniform update
   // const body_0 = snake.body.buffer[0].mesh;
   // body_0.GfxUniformSetAndUpdate('u_scale2', [.5, 1,]);
   // body_0.GfxUniformSetAndUpdate('u_generic_controls', generic_controls_parameters);





   /*************************************************************************************************/
   // Set Uniforms Callbacks

   collectable.GfxUniformSetAndUpdate('u_scale2', [collectable_scale, 1]);
   // collectable.GfxUniformSetAndUpdate('u_generic_controls', [.5, .5, .9]);
   // Initialize shader attribute
   // Gl_set_glow_intensity(collectable.gfx, 1.);

   // { // Color animations
   //    Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, collectable, .005, .1, .4, 0.0, .3, true);
   //    Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.A, collectable, .005, .1, .4, 0.0, .3, true);
   // }




   /*******************************************************************************************/
   // Create Options Button

   let options = null;
   if (controls_create) {

      options = Create_widget_button(Style_button_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, text:'OPTIONS', pos:[100, 0, 1], col:CYAN[6], text_pad:[32, 6], texture_id:TEXTURES.MTSDF_CONSOLAS_1024}));
      Widget_gfx_ready_enable({mesh:options, enable_sdf_rect:options.geom.dim[1], listener:{type:LISTEN_EVENT_TYPES.MOVE|LISTEN_EVENT_TYPES.HOVER}})
   }





   const options_clbk_params = {
      menu_panel: null,
      snake: snake,
      controls_render:controls_render,

      // Menu sliders are created on menu activation, so there is no refference to any previous sliders.
      // For that we need to store the changes of all sliders in 'mnemonics' variable.
      // Also store the initial value that the slider will change.
      mnemonics: {
         feather_slider: { slider_val: snake.feather_slider.init_val, min: snake.feather_slider.min, max: snake.feather_slider.max },
         speed_slider: { slider_val: snake.speed_slider.init_val, min: snake.speed_slider.min, max: snake.speed_slider.max },
         slope_slider: { slider_val: snake.slope_slider.init_val, min: snake.slope_slider.min, max: snake.slope_slider.max },
         next_anim_slider: { slider_val: snake.next_anim_slider.init_val, min: snake.next_anim_slider.min, max: snake.next_anim_slider.max },
         reduce_size_slider: { slider_val: snake.reduce_size_slider.init_val, min: snake.reduce_size_slider.min, max: snake.reduce_size_slider.max },
         distance_factor_slider: { slider_val: snake.distance_factor_slider.init_val, min: snake.distance_factor_slider.min, max: snake.distance_factor_slider.max },
         max_scale_factor_slider: { slider_val: snake.max_scale_factor_slider.init_val, min: snake.max_scale_factor_slider.min, max: snake.max_scale_factor_slider.max },
         anim_step_slider: { slider_val: snake.anim_step_slider.init_val, min: snake.anim_step_slider.min, max: snake.anim_step_slider.max },

         // Color options sliders
         color_slider: {
            wideness: { val: 0, slider_val: 0.008, min: 0, max: 0.001 },
            offset: { val: 0, slider_val: 0.11, min: 0, max: 4 },
            brightness: { val: 1, slider_val: 1, min: 0, max: 1 },

         },
      },

      properties: {
         style: style,
      }
   }; // Pass an object to store the menu mesh on menu options button click

   // Sliders starting values
   options_clbk_params.mnemonics.feather_slider.slider_val = options_clbk_params.mnemonics.feather_slider.slider_val / (options_clbk_params.mnemonics.feather_slider.max - options_clbk_params.mnemonics.feather_slider.min);
   options_clbk_params.mnemonics.speed_slider.slider_val = options_clbk_params.mnemonics.speed_slider.slider_val / (options_clbk_params.mnemonics.speed_slider.max - options_clbk_params.mnemonics.speed_slider.min);
   options_clbk_params.mnemonics.slope_slider.slider_val = Normalize(options_clbk_params.mnemonics.slope_slider.min, options_clbk_params.mnemonics.slope_slider.max, options_clbk_params.mnemonics.slope_slider.slider_val);
   options_clbk_params.mnemonics.next_anim_slider.slider_val = Normalize(options_clbk_params.mnemonics.next_anim_slider.min, options_clbk_params.mnemonics.next_anim_slider.max, options_clbk_params.mnemonics.next_anim_slider.slider_val);
   options_clbk_params.mnemonics.reduce_size_slider.slider_val = Normalize(options_clbk_params.mnemonics.reduce_size_slider.min, options_clbk_params.mnemonics.reduce_size_slider.max, options_clbk_params.mnemonics.reduce_size_slider.slider_val);
   options_clbk_params.mnemonics.distance_factor_slider.slider_val = options_clbk_params.mnemonics.distance_factor_slider.slider_val / (options_clbk_params.mnemonics.distance_factor_slider.max - options_clbk_params.mnemonics.distance_factor_slider.min);
   options_clbk_params.mnemonics.anim_step_slider.slider_val = Normalize(options_clbk_params.mnemonics.anim_step_slider.min, options_clbk_params.mnemonics.anim_step_slider.max, options_clbk_params.mnemonics.anim_step_slider.slider_val);
   options_clbk_params.mnemonics.max_scale_factor_slider.slider_val = Normalize(options_clbk_params.mnemonics.max_scale_factor_slider.min, options_clbk_params.mnemonics.max_scale_factor_slider.max, options_clbk_params.mnemonics.max_scale_factor_slider.slider_val);

   // Refference slider mnemonics to the snake struct
   // TODO: If snake struct has the  '.mnemonics.color_slider', then we need not to recreate or pass them seperately to the 'options_clbk_params', it is already in the 'snake'
   snake.color_fn_params.fn2 = options_clbk_params.mnemonics.color_slider;

   if (controls_create) {

      options.Bind(
         Snake_options_callback,
         _, options_clbk_params, _,
      );


      options.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION;
      options.GenGfxCtx();
      Widget_render(options);

      Listeners_set_priority(E.C, options.listeners);
   }



   /*************************************************************************************************/
   // Create move for body meshes
   const params = {
      section: section,
      snake: snake,
      collectable: collectable,
      collectable_apple: collectable_apple,
      nose: nose,
      score_digit_meshes: digit_meshes_arr,
      score_slope_params_pointer: score_slope_params_pointer,
      rot: snake.rotation,
      options_clbk_params: options_clbk_params,
   }

   Snake_start_menu(params);

   snake.Color_set_fn(snake);

   return {
      // Snake_options_callback: Snake_options_callback,
      Snake_options_controls: Snake_options_controls,
      options_clbk_params: options_clbk_params,
   };

}
/** */
function Snake_start_menu(params) {


   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;
   const r_corners = 12;
   const font_size = 14;
   const tr = .75;

   // const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[20, 20], pos:[VIEWPORT.WIDTH / 2, 100, 10], col:TRANSPARENCY(GREY[3], tr), name:'StartMenuPanel', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[20, 20], pos:[100, 100, 10], col:Color_hsv_to_rgb_calibrated(0,0,1,1,.08,0), name:'StartMenuPanel', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:r_corners, listener:{type:LISTEN_EVENT_TYPES.MOVE}});


   zpos++;


   const btn_col = TRANSPARENCY(GREEN[5], .8);

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (30 * log)

   const info_text_use_options = 'Click on the \'Options\' button\nto manipulate some parameters.';

   const info_text_rot_left = `Left click on the panel,
move the mouse to the left
while holding down the left
click mouse button.`;
   // const info_text_rot_right = `Left click anywhere on the panel
   const info_text_rot_right = `Left click on the panel,
move the mouse to the right
while holding down the left
click mouse button.`;

   const left_pad = 10;

   const play_contols_info = Create_rect_mesh(Style_rect_default_properties({pad:[left_pad, 10], pos:[0, 0, 4], dim:[0, 0], col:Color_hsv_to_rgb_calibrated(0,0,1,1,.18,0), name:'play_contols_info', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:play_contols_info, enable_sdf_rect:r_corners});
   menu_panel.AddItem(play_contols_info);
   {
      const text_pad = [11, 6];


      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[0], .0), name:'Controls section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:menu_panel.geom.dim[0] / 10});
         play_contols_info.AddItem(info);

         const col = BLUEL[9];
         const ctrl = Create_widget_label(Style_label_default_properties({text:'CONTROLS', col:TRANSPARENT, text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id, font_size:18, layout:LAYOUT.VERTICAL}));
         Widget_gfx_ready_enable({mesh:ctrl, enable_sdf_rect:ctrl.geom.dim[1]});
         info.AddItem(ctrl);
      }
      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[0], .0), name:'Rotate Left section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:menu_panel.geom.dim[0] / 10});
         play_contols_info.AddItem(info);

         const col = PURPLER[9];
         const ctrl = Create_widget_label(Style_label_default_properties({theme:Color_theme_label_auto2(.2,1,.3,.2), text:'Rotate Left', col:col, text_col:GREY[3], text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id, font_size:font_size, layout:LAYOUT.VERTICAL}));
         Widget_gfx_ready_enable({mesh:ctrl, enable_sdf_rect:ctrl.geom.dim[1]});
         info.AddItem(ctrl);

         const rotate_symbol = Create_rect_mesh(Style_rect_default_properties({ pad: [20, 0], dim: [font_size*2, font_size*2], col: Color_hsv_to_rgb_calibrated(.2,1,1,.5,1,0), texture_id: TEXTURES.MTSDF_SYMBOLS, sub_texture_id:ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_left, layout:LAYOUT.HORIZONTAL }));
         Widget_gfx_ready_enable({ mesh: rotate_symbol, enable_sdf_rect: 10, })
         info.AddItem(rotate_symbol);

         const expl = Create_widget_label(Style_label_default_properties({text:info_text_rot_left, col:TRANSPARENT, text_col:Color_hsv_to_rgb_calibrated(0,0,1,.5,1,1), text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id, font_size:font_size, layout:LAYOUT.VERTICAL}));
         Widget_gfx_ready_enable({mesh:expl, enable_sdf_rect:10});
         info.AddItem(expl);
      }
      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[1], .0), name:'Rotate Right section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:menu_panel.geom.dim[0] / 10});
         play_contols_info.AddItem(info);

         const col = PURPLEB[9];
         const ctrl = Create_widget_label(Style_label_default_properties({theme:Color_theme_label_auto2(.78,1,.3,.2), text:'Rotate Right', col:col, text_col:GREY[3], text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id, font_size:font_size, layout:LAYOUT.VERTICAL}));
         Widget_gfx_ready_enable({mesh:ctrl, enable_sdf_rect:ctrl.geom.dim[1]});
         info.AddItem(ctrl);
         
         const rotate_symbol = Create_rect_mesh(Style_rect_default_properties({ pad: [20, 0], dim: [font_size*2, font_size*2], col: Color_hsv_to_rgb_calibrated(.78,1,1,.5,1,0), texture_id: TEXTURES.MTSDF_SYMBOLS, sub_texture_id:ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_right, layout:LAYOUT.HORIZONTAL }));
         Widget_gfx_ready_enable({ mesh: rotate_symbol, enable_sdf_rect: 10, })
         info.AddItem(rotate_symbol);

         const expl = Create_widget_label(Style_label_default_properties({text:info_text_rot_right, col:TRANSPARENT, text_col:Color_hsv_to_rgb_calibrated(0,0,1,.5,1,1), text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id, font_size:font_size, layout:LAYOUT.VERTICAL}));
         Widget_gfx_ready_enable({mesh:expl, enable_sdf_rect:10});
         info.AddItem(expl);
      }
      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[18, 18], pos:[0, 0, 10], col:Color_hsv_to_rgb_calibrated(0,0,1,1,.18, 0), name:'Controls section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:50});
         play_contols_info.AddItem(info);

         const col = BLACK;
         const ctrl = Create_widget_label(Style_label_default_properties({theme:Color_theme_label_auto(.2,0,.08,0), text:info_text_use_options, col:col, text_col:TRANSPARENCY(WHITE, .5), text_pad:text_pad, texture_id:def_tex_id, font_size:font_size}));
         Widget_gfx_ready_enable({mesh:ctrl, enable_sdf_rect:ctrl.geom.dim[1]-6});
         info.AddItem(ctrl);
      }
   }
   
   /*******************************************************************************************/
   // Start Game button
   const start_btn = Create_widget_button(Style_button_default_properties({ 
      target_mesh:menu_panel, 
      text:'Start', 
      pos:[0, 0, zpos], col:btn_col, 
      text_pad:[dim[0] / 2 - pad * 2, 10], 
      texture_id:def_tex_id, 
      font_size:font_size+10, 
      layout:LAYOUT.VERTICAL, 
   }));
   Widget_gfx_ready_enable({mesh:start_btn, enable_sdf_rect:start_btn.geom.dim[1], listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_panel.AddItem(start_btn);
      start_btn.Bind(
      (params) => { // Click callback
         // Destroy 'Start' panel 
         const root = params.params.params.root_mesh;
         View_destroy_view_group_and_meshes(root.group_bufferidxs[0]); 
         // Start the game loop
         Time_intervals_create(16, 'Snake', TIME_INTERVAL_REPEAT_ALWAYS, Animate_snake, params.params.params.animation_params);
      },
      _,
      {params:{animation_params:params, root_mesh:menu_panel}},
      _
   );



   /*************************************************************************************************/
   // Render Menu 
   // menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   Layout_basic_pre_render(menu_panel);
   Widget_render(menu_panel);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);
   Listeners_set_priority(E.H, menu_panel.listeners);
   Listeners_set_priority(E.C, menu_panel.listeners);

// EventClbk = null, targetBindingFunctions = _, params, click_flags
}
/** */
function Animate_snake(params) {

   const snake = params.params.snake;

   if (snake.in_scale_animation) return;

   const section = params.params.section;

   const head = snake.body.buffer[0].mesh;
   const nose = params.params.nose;
   const collectable = params.params.collectable;
   const collectable_apple = params.params.collectable_apple;
   const score_digit_meshes = params.params.score_digit_meshes;
   const score_slope_params_pointer = params.params.score_slope_params_pointer;

   // Calculate move velocity
   const x = (snake.vel[0] + snake.accel[0]) * snake.speed;
   const y = (snake.vel[1] + snake.accel[1]) * snake.speed;

   // Check panel boundary collision
   const left_bound = 0;
   const right_bound = section.geom.dim[0] * 2;
   const top_bound = 0;
   const bot_bound = (section.geom.dim[1] * 2);

   // Check boundaries
   const head_radius = snake.body.buffer[0].size;
   const head_pos = head.geom.pos;

   const head_left = head_pos[0] + x;
   const head_right = head_pos[0] + (head_radius * 2) + x;
   const head_top = head_pos[1] + y;
   const head_bot = head_pos[1] + (head_radius * 2) + y;



   let hit = false;
   let dirx = 1;
   let diry = 1;

   if (head_left < left_bound) {
      dirx = -1; // Reverse velocity
      hit = true;
   }
   else if (head_right > right_bound) {
      dirx = -1; // Reverse velocity
      hit = true;
   }
   else if (head_top < top_bound) {
      diry = -1; // Reverse velocity
      hit = true;
   }
   else if (head_bot > bot_bound) {
      diry = -1; // Reverse velocity
      hit = true;
   }

   const xx = x * dirx;
   const yy = y * diry;
   head.geom.pos[0] += xx;
   head.geom.pos[1] += yy;
   Mesh_add_wpos_xy(head, xx, yy);

   snake.vel[0] *= dirx;
   snake.vel[1] *= diry;



   // Check collision with collectable
   const dif = Mesh_calc_pos_dif(collectable, head)
   const dist1 = Magnitude(dif[0], dif[1]);


   // On collect
   // Calculate the distances without the glowing parts of the 2 meshes
   if (dist1 < (collectable.geom.dim[0] * collectable_scale) + (head.geom.dim[0] * snake.glow_scale_down_factor)) {

      let rand_posx = 0;
      let rand_posy = 0;

      let dist = 0;

      // Create new collectable in another random position
      while (dist < collectable.geom.dim[0] * 2) {

         const posx_start = section.geom.pos[0] + (collectable.geom.dim[0] * 2 + 10);
         const posx_end = (section.geom.pos[0] + section.geom.dim[0] * 2) - (collectable.geom.dim[0] * 2 + 10);
         const posy_start = section.geom.pos[1] + (collectable.geom.dim[0] * 2 + 10);
         const posy_end = (section.geom.pos[1] + section.geom.dim[1] * 2) - (collectable.geom.dim[0] * 2 + 10);

         const rand_pos = GetRandomPos([posx_start, posy_start], [posx_end, posy_end]);

         rand_posx = rand_pos[0];
         rand_posy = rand_pos[1];

         dist = Magnitude_2vectors(rand_pos, collectable.geom.pos);

      }


      Mesh_set_and_copy_wpos_xy(collectable, rand_posx, rand_posy)
      // Mesh_set_and_copy_wpos_xy(collectable_apple, rand_posx + 1, rand_posy - 7)
      Mesh_set_and_copy_wpos_xy(collectable_apple, 
         collectable.geom.pos[0] + collectable.geom.dim[0] - (collectable_apple_dim[0] + 0), 
         collectable.geom.pos[1] + collectable.geom.dim[1] - (collectable_apple_dim[1] + 6),
      )

      // Create scale animation
      const params2 = {
         section: section,
         snake: snake,
         body_mesh_idx: 0,
         nose: params.params.nose,
         slope_constant1: 1.,
      };

      snake.body.buffer[0].in_scale_up_animation = true;
      Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);




      snake.points_cnt += 1;

      const clbk_anim_flag = CLBK_ANIMATIONS.TEXT_SQUEEZE_Y;
      const digits = Digitize(snake.points_cnt);
      let k = 0; // The digits counter(in reverse order, first digit is last element)


      const digit_label = score_digit_meshes[0];
      const text_substitution = `${digits[k]}`
      k+=1;

      const limit = digit_label.text_mesh.text_width;
      Demo_clbk_animations_text_create(digit_label, score_slope_params_pointer, limit, clbk_anim_flag, score_size, 0, k, 1, text_substitution, 'SnakeScore_anim1', );
      // Demo_clbk_animations_text_create(digit_label, score_slope_params_pointer, limit, 'SnakeScore_anim1', clbk_anim_flag, text_substitution);


      const digits_len = digits.length;

      // Create new digit mesh
      const digit_meshes_len = score_digit_meshes.length;
      if (digits_len > digit_meshes_len) {

         const pad = 0;
         const pos = [0, 0, 4];

         const new_meshes_count = digits_len - digit_meshes_len;
         for (let i = 0; i < new_meshes_count; i++) {

            const last_digit_label = score_digit_meshes[score_digit_meshes.length - 1];
            pos[1] = last_digit_label.geom.pos[1];
            pos[0] = last_digit_label.geom.pos[0] - (last_digit_label.geom.dim[0] * 2) - pad;

            const digit_label = Create_widget_label(Style_label_default_properties({text:'0', pos:pos, font_size:score_size, col:TRANSPARENCY(YELLOWR[9], 1.), text_pad:[7, 3], texture_id:score_font}));
            Widget_gfx_ready_enable({mesh:digit_label, enable_sdf_rect:digit_label.geom.dim[0]});
            digit_label.SetViewGroupIndex(snake.body.buffer[0].mesh.group_bufferidxs[0]);

            section.AddItem(digit_label);
            // digit_label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC | GFX_CTX_FLAGS.FROM_PARENT_DSC, last_digit_label.gfx.vb.groupidx, last_digit_label.text_mesh.gfx.vb.groupidx);
            // digit_label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_digit_label.gfx.vb.groupidx, last_digit_label.text_mesh.gfx.vb.groupidx);
            digit_label.GenGfxCtx(GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC, );
            // digit_label.GenGfxCtx();
            digit_label.Render();

            score_digit_meshes.push(digit_label);
         }
      }

      // Update digit text with animation
      for (let i = 1; i < digits_len; i++) {

         if (digits[k] !== undefined) {

            const digit_label = score_digit_meshes[i];
            const text_substitution = `${digits[k]}`; // Create the new text from snake score counter

            // Dont update text or run animation if the digit hasn't change
            if (`${digits[k]}` !== digit_label.text_mesh.mat.char_buffer.buffer[0]) {

               const limit = digit_label.text_mesh.text_width;
               // Demo_clbk_animations_text_create(digit_label, score_slope_params_pointer, limit, 'SnakeScore_anim', clbk_anim_flag, text_substitution);
               Demo_clbk_animations_text_create(digit_label, score_slope_params_pointer, limit, clbk_anim_flag, score_size, 0, k, 1, text_substitution, 'SnakeScore_anim1', );

               digit_label.text_mesh.mat.char_buffer.buffer[0] = text_substitution;
            }
         }

         k++;
      }

   }



   /*******************************************************************************************/
   // Move rest of snake body

   if (snake.body.boundary !== 0) {

      const body = snake.body.buffer[1].mesh;


      const axis = [
         (head.geom.pos[0] + head.geom.dim[0]) - (body.geom.pos[0] + body.geom.dim[0]),
         (head.geom.pos[1] + head.geom.dim[1]) - (body.geom.pos[1] + body.geom.dim[1]),
      ];

      let dist_mod = snake.body.buffer[1].size * snake.distance_factor;
      const dist = Magnitude(axis[0], axis[1]) + dist_mod;

      // Move snake body
      if (dist > head.geom.dim[0]) {

         let prev_mesh = head;

         for (let i = 1; i <= snake.body.boundary; i++) {

            const body_mesh = snake.body.buffer[i].mesh;

            const axis2 = [
               (prev_mesh.geom.pos[0] + prev_mesh.geom.dim[0]) - (body_mesh.geom.pos[0] + body_mesh.geom.dim[0]),
               (prev_mesh.geom.pos[1] + prev_mesh.geom.dim[1]) - (body_mesh.geom.pos[1] + body_mesh.geom.dim[1]),
            ];

            dist_mod = body_mesh.geom.dim[0] * snake.distance_factor;

            const dist2 = Magnitude(axis2[0], axis2[1]) + dist_mod;

            /** Body Follows head with almost in stantly */
            const n2 = [
               axis2[0] / dist2,
               axis2[1] / dist2,
            ];

            const delta2 = dist2 - body_mesh.geom.dim[0];
            const xx2 = n2[0] * delta2;
            const yy2 = n2[1] * delta2;

            body_mesh.geom.pos[0] += xx2;
            body_mesh.geom.pos[1] += yy2;
            Mesh_add_wpos_xy(body_mesh, xx2, yy2);


            prev_mesh = body_mesh;
         }
      }


   }




   /*******************************************************************************************/
   // Move nose

   const angle = Math.atan2(x * .5, y * .5); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
   Gl_rotate_z_2d(nose.gfx, nose.geom.dim, angle, 1);

   const normalizedAngle = angle >= 0 ? angle : (2 * Math.PI + angle); // Normalize from -π,π to 0,π
   Gl_set_angle(nose.gfx, normalizedAngle);

   // const scale = snake.glow_scale_down_factor;
   // const scale = snake.distance_factor;
   // const scale = .9;
   const scale = 1.;
   
   const r = head.geom.dim[0] * scale; // Set the radius in which the sattelite will be rotating (perimetricaly)
   const cx = nose.geom.pos[0]; // Center to sattelites position
   const cy = nose.geom.pos[1]
   const a = (cx + (r * Math.sin(angle))) * scale; // The rotation is the tangent of the outer head's perimeter 
   const b = (cy + (r * Math.cos(angle))) * scale;

   const new_posx = head.geom.pos[0] + head.geom.dim[0] + a;
   const new_posy = head.geom.pos[1] + head.geom.dim[1] + b;

   Gl_set_wpos_xy(nose.gfx, new_posx, new_posy, nose.geom.num_faces);

   // Update the rotation ammount from the user input
   params.params.rot.amt = angle;

}





/** */
function Animation_scale_up_run(params) {

   const snake = params.snake;

   snake.in_scale_animation = true;

   const section = params.section;
   const bodyidx = params.body_mesh_idx;

   if (bodyidx >= snake.body.active_count) return false; // Guard against passing 'params.body_mesh_idx + 1' of the last body


   const body = snake.body.buffer[bodyidx];


   let mod = 0;

   // Update snake body meshes scale
   body.t += snake.step;
   const slope = Logarithmic_interpolation(body.t, snake.init_slope - mod) + 1;

   // Find the difference from the previous slope and the current
   const res = (slope - body.prev_slope) * 100;
   body.prev_slope = slope;
   body.mesh.geom.dim[0] += res;
   body.mesh.geom.dim[1] += res;
   Gl_add_vpos_xy(body.mesh.gfx, res, res);
   Gl_add_dim_xy(body.mesh.gfx, res, res);


   body.mesh.mat.style.rcorners = body.mesh.geom.dim[0];
   Gl_set_attr_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);


   body.glow_intensity += snake.glow_intensity_step;
   // Gl_set_glow_intensity(body.mesh.gfx, body.glow_intensity);





   // Nose move with the scale
   if (bodyidx === 0) {

      const nose = params.nose;
      Mesh_add_wpos_xy(nose, res * 1 * snake.vel[0], res * 1 * snake.vel[1]);
   }


   // Create scale up for the next body mesh
   if (bodyidx + 1 < snake.count && !body.in_animation) {

      if (body.mesh.geom.dim[0] > (body.size + snake.start_next_anim)) {

         const params2 = {
            section: section,
            snake: snake,
            nose: params.nose,
            body_mesh_idx: params.body_mesh_idx + 1,
         };
         if (bodyidx <= snake.body.boundary) {
            snake.in_scale_animation = true;
            body.in_animation = true;
            body.in_scale_up_animation = true;
            Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
         }
      }
   }


   const prev_body_has_stoped_scale_up = true;



   // While the scaled mesh is less than the max scaled constant, continue scaling
   if (prev_body_has_stoped_scale_up === false) {
      return true;
   }
   else if (body.mesh.geom.dim[0] < body.size * snake.scale_factor)
      return true;
   else {
      body.in_scale_up_animation = false;
      return false;
   }

}
/** */
function Animation_scale_up_stop(params) {

   const snake = params.snake;
   Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); /*Callback_animations_print_size();*/
   snake.body.buffer[params.body_mesh_idx].t = 0.0;
   snake.body.buffer[params.body_mesh_idx].prev_slope = Logarithmic_interpolation(0.0, snake.init_slope) + 1;

   return false;
}
/** */
function Animation_scale_down_run(params) {

   const snake = params.snake;
   const bodyidx = params.body_mesh_idx;
   const body = snake.body.buffer[bodyidx];



   // Update 
   const mod = 0;
   body.t += snake.step;
   const slope = Logarithmic_interpolation(body.t, snake.init_slope - mod) + 1;

   const res = (slope - body.prev_slope) * 100;
   body.prev_slope = slope;







   // Run scale down function until the snake body reaches the default size
   if (body.mesh.geom.dim[0] - res > body.size) {

      body.mesh.geom.dim[0] -= res;
      body.mesh.geom.dim[1] -= res;
      // console.log(-res)
      // Mesh_add_dim_xy(body.mesh, body.mesh.gfx, -res, -res);
      Gl_add_vpos_xy(body.mesh.gfx, -res, -res);
      Gl_add_dim_xy(body.mesh.gfx, -res, -res)

      body.mesh.mat.style.rcorners = body.mesh.geom.dim[0];
      // Gl_set_attr_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);


      body.glow_intensity -= snake.glow_intensity_step;
      // Gl_set_glow_intensity(body.mesh.gfx, body.glow_intensity);



      // Nose move with the scale
      if (bodyidx === 0) {

         const nose = params.nose;
         Mesh_add_wpos_xy(nose, (-res) * snake.vel[0] * 1., (-res) * snake.vel[1] * 1.);
      }


      return true;
   }

   else {


      // Avoid smaller than snake.min_size body meshes
      body.mesh.geom.dim[0] = body.size;
      body.mesh.geom.dim[1] = body.size;
      Mesh_update_set_dim_xy(body.mesh);
      Gl_set_dim_xy(body.mesh.gfx, body.size, body.size);

      body.mesh.mat.style.rcorners = body.mesh.geom.dim[0];
      Gl_set_attr_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);

      // Reset the glow intensity
      body.glow_intensity = snake.glow_intensity;
      // Gl_set_glow_intensity(body.mesh.gfx, snake.glow_intensity);

      return false;
   }

}
/** */
function Animation_scale_down_stop(params) {

   const snake = params.snake;
   if (params.body_mesh_idx === snake.body.boundary) {

      const section = params.section;
      const last_elem_idx = snake.body.boundary;
      const last_mesh = snake.body.buffer[last_elem_idx].mesh;


      // Calculate body size according to body mesh index (the greater the index the smaller the size)
      let reduce_size = (last_elem_idx + 1) * snake.reduce_mod;
      let calc_size = snake.size - reduce_size;
      if (calc_size < snake.min_size) {
         calc_size = snake.min_size;
         reduce_size = 0;
      }

      // Calc the axis vector of the 2 last body meshes, and set the position of the new body mesh to that axis
      const second_last_mesh = snake.body.buffer[last_elem_idx - 1].mesh;
      const axis = [
         last_mesh.geom.pos[0] - second_last_mesh.geom.pos[0],
         last_mesh.geom.pos[1] - second_last_mesh.geom.pos[1],
      ];

      const posx = last_mesh.geom.pos[0] + axis[0];
      const posy = last_mesh.geom.pos[1] + axis[1];


      const zpos = 2;
      const col = GetSequencedColor(9);
      const body_mesh = Create_rect_mesh(Style_rect_default_properties({pad:[0, 0], pos:[posx, posy, zpos], dim:[calc_size, calc_size], col:col, name:'body_mesh',}));
      Widget_gfx_ready_enable({mesh:body_mesh, enable_sdf_rect:body_mesh.geom.dim[1], enable_unif_scale:true, });
      section.AddItem(body_mesh);
      body_mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_mesh.gfx.vb.groupidx);
      body_mesh.Render();

      // HACK: I havn't yet implemented adding a mesh in a  vb with 2 or more rendergroups(which needs the mesh's attributes to be inserted at a specific index and the start calculation of all right rendergroup starts), so I just assume only one rendergroup existas for this vb and I increment the rg.count
      const rg_num_faces = Vertex_buffer_render_group_get_num_faces(body_mesh.gfx.vb.render_groupidx);
      Vertex_buffer_render_group_set_count_from_num_faces(body_mesh.gfx.vb.render_groupidx, rg_num_faces)





      const bodyidx = snake.body.Add(new Body_Mesh_Properties(body_mesh));
      snake.count++;
      Mesh_set_name(body_mesh, 'body-' + bodyidx);

      const body = snake.body.buffer[bodyidx];
      body.idx = bodyidx; // Store the index for convinience
      body.reduce_size = reduce_size;
      body.size = calc_size;


      snake.in_scale_animation = false;

      // INNEFFICIENCY: We only need to apply color to the new body, but we set color to all body meshes
      snake.Color_set_fn(snake);

      const pos_dif = ((last_mesh.geom.dim[0] - calc_size) * 1);
      body.mesh.geom.pos[0] += pos_dif;
      body.mesh.geom.pos[1] += pos_dif;
      Gl_add_vpos_xy(body.mesh.gfx, pos_dif, pos_dif);

   }
   

   // snake.in_scale_animation = false;
   const bodyidx = params.body_mesh_idx;
   snake.body.buffer[bodyidx].in_animation = false;
   snake.body.buffer[bodyidx].t = 0.0;
   snake.body.buffer[bodyidx].prev_slope = Logarithmic_interpolation(snake.body.buffer[bodyidx].t, snake.init_slope) + 1;

   return false;

}





/** */
function Snake_body_set_color(snake) {


   let colidx = 0;
   for (let i = 0; i <= snake.body.boundary; i++) {

      const body = snake.body.buffer[i];

      const color = snake.color_fn_params.fn1[colidx++];

      Mesh_set_color_rgb(body.mesh, color);

      if (colidx > snake.color_fn_params.fn1.length - 1) colidx = 0

   }
}
/** */
function Snake_body_set_color_from_color_palete(snake) {


   for (let i = 0; i <= snake.body.boundary; i++) {

      const body = snake.body.buffer[i];
      const params = snake.color_fn_params.fn2;
      const wideness = params.wideness.val, color_offset = params.offset.val, brightness = params.brightness.val;
      const col = RGB(i, wideness, color_offset, brightness)
      Mesh_set_color_rgb(body.mesh, col)
   }
}





/** */
function Snake_options_callback(params) {


   if (params.params.menu_panel !== null) return;

   const snake = params.params.snake;
   const head = snake.body.buffer[0].mesh;
   const style = params.params.properties.style

   const mn = params.params.mnemonics;
   const feather_slider_val = mn.feather_slider.slider_val;
   const speed_slider_val = mn.speed_slider.slider_val;
   const slope_slider_val = mn.slope_slider.slider_val;
   const next_anim_slider_val = mn.next_anim_slider.slider_val;
   const reduce_size_slider_val = mn.reduce_size_slider.slider_val;
   const distance_size_slider_val = mn.distance_factor_slider.slider_val;
   const max_scale_factor_slider_val = mn.max_scale_factor_slider.slider_val;
   const anim_step_slider_val = mn.anim_step_slider.slider_val;
   const wideness_color_slider_val = mn.color_slider.wideness.slider_val;
   const offset_color_slider_val = mn.color_slider.offset.slider_val;
   const brightness_color_slider_val = mn.color_slider.brightness.slider_val;




   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];
   let zpos = 10;
   const menu_panel = Create_rect_mesh(Style_rect_default_properties({
      is_root:ROOT_WIDGETS.CREATE_ROOT, 
      pad:[0, 0], 
      pos:[VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], 
      dim:dim, 
      col:Color_hsv_to_rgb_calibrated(0, 0, 1, 1., .04, 0), 
      name:'MenuOptionsPanel',
   }));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:menu_panel.geom.dim[0] / 10, listener:{type:LISTEN_EVENT_TYPES.MOVE}});

   params.params.menu_panel = menu_panel;


   zpos++;
   const tr = .4;

   const controls_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:Color_hsv_to_rgb_calibrated(0, 0, 1, 1., .1, 0), name:'controls_section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:controls_section, enable_sdf_rect:10, });
   menu_panel.AddItem(controls_section);



   /*************************************************************************************************/
   // Menu Options

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);



   const feather_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Feather', layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:feather_slider, enable_sdf_rect: 6});
   feather_slider.SetInitialValue(feather_slider_val);
   controls_section.AddItem(feather_slider);
   
   const speed_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Speed', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:speed_slider, enable_sdf_rect: 6});
   speed_slider.SetInitialValue(speed_slider_val);
   controls_section.AddItem(speed_slider);

   const slope_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Slope', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:slope_slider, enable_sdf_rect: 6});
   slope_slider.SetInitialValue(slope_slider_val);
   controls_section.AddItem(slope_slider);

   const next_anim_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Next Animation Start', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:next_anim_slider, enable_sdf_rect: 6});
   next_anim_slider.SetInitialValue(next_anim_slider_val);
   controls_section.AddItem(next_anim_slider);

   const reduce_size_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Reduce Size', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:reduce_size_slider, enable_sdf_rect: 6});
   reduce_size_slider.SetInitialValue(reduce_size_slider_val);
   controls_section.AddItem(reduce_size_slider);

   const distance_factor_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Distance Ammount', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:distance_factor_slider, enable_sdf_rect: 6});
   distance_factor_slider.SetInitialValue(distance_size_slider_val);
   controls_section.AddItem(distance_factor_slider);

   const max_scale_factor_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Scale Ammount', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:max_scale_factor_slider, enable_sdf_rect: 6});
   max_scale_factor_slider.SetInitialValue(max_scale_factor_slider_val);
   controls_section.AddItem(max_scale_factor_slider);

   const anim_step_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Timer Step', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:anim_step_slider, enable_sdf_rect: 6});
   anim_step_slider.SetInitialValue(anim_step_slider_val);
   controls_section.AddItem(anim_step_slider);

   /*****************************************************************************************************************************************/
   // Sliders for color change
   const enable_panel = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:Color_hsv_to_rgb_calibrated(0, 0, 1,1,.12, 0), name:'SwitchEnable', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:enable_panel, enable_sdf_rect:6, });
   controls_section.AddItem(enable_panel);
   {

      const label = Create_widget_label(Style_label_default_properties({text:'Color Options', theme:Color_theme_label_auto(.08,1,.18,0), text_pad:[14, 10], texture_id:TEXTURES.MTSDF_CONSOLAS_1024}));
      Widget_gfx_ready_enable({mesh:label, enable_sdf_rect:label.geom.dim[1]});
      enable_panel.AddItem(label);
      
      const color_switch = Create_widget_switch_simple(Style_switch_default_properties({pos:[0, 0, 1], size:20, theme:Color_theme_switch_auto(0,0,.18,0), name:'Color Switch'}));
      Widget_gfx_ready_enable({mesh:color_switch, enable_sdf_rect:color_switch.geom.dim[1]});
      enable_panel.AddItem(color_switch);


      const color_switch_params = {
         snake: snake,
         // mnemonics:{transparency:0.5, hue:0.5, color:null},
      };
      color_switch.Bind(
         (params) => {

            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;
            const snake = params.params.snake;


            if (snake.Color_set_fn === Snake_body_set_color) {

               snake.Color_set_fn = Snake_body_set_color_from_color_palete;
               snake.Color_set_fn(snake);
            }
            else {

               snake.Color_set_fn = Snake_body_set_color;
               snake.Color_set_fn(snake);
            }

         },
         null, color_switch_params, _,
      );
   }

   const wideness_color_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Color Wideness', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:wideness_color_slider, enable_sdf_rect: 6});
   wideness_color_slider.SetInitialValue(wideness_color_slider_val);
   controls_section.AddItem(wideness_color_slider);

   const offset_color_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Color Offset', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:offset_color_slider, enable_sdf_rect: 6});
   offset_color_slider.SetInitialValue(offset_color_slider_val);
   controls_section.AddItem(offset_color_slider);

   const brightness_color_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'brightness', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:brightness_color_slider, enable_sdf_rect: 6});
   brightness_color_slider.SetInitialValue(brightness_color_slider_val);
   controls_section.AddItem(brightness_color_slider);



   const close_btn = Create_widget_button(Style_button_default_properties({ 
      target_mesh:menu_panel, 
      theme:Color_theme_label_auto(.08,1,.18,0),
      text:'Close', 
      pos:[0, 0, zpos], 
      text_pad:[dim[0] / 2 - pad * 2, 10], 
      texture_id:def_tex_id, 
      font_size:20, 
      layout:LAYOUT.VERTICAL, 
   }));
   Widget_gfx_ready_enable({mesh:close_btn, enable_sdf_rect:close_btn.geom.dim[1], listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_panel.AddItem(close_btn);
   close_btn.Bind(
      (params) => { // Click callback
         // Destroy 'options' panel 
         const root = params.params.params.root_mesh;
         View_destroy_view_group_and_meshes(root.group_bufferidxs[0]); 

         // params.snake_struct_controls_section = null;
         params.params.menu_panel = null;
      },
      _,
      {params:{params:params.params, root_mesh:menu_panel}},
      _
   );


   /*************************************************************************************************/
   // Render Section 

   if(params.params.controls_render) {

      menu_panel.GenGfxCtx();
      Layout_basic_pre_render(menu_panel);
      Widget_render(menu_panel);
   }





   // // Give menu items listen events priority 
   Slider_set_listeners_priority(feather_slider);
   Slider_set_listeners_priority(speed_slider);
   Slider_set_listeners_priority(slope_slider);
   Slider_set_listeners_priority(next_anim_slider);
   Slider_set_listeners_priority(reduce_size_slider);
   Slider_set_listeners_priority(distance_factor_slider);
   Slider_set_listeners_priority(max_scale_factor_slider);
   Slider_set_listeners_priority(anim_step_slider);
   Switch_set_listeners_priority(enable_panel);
   Slider_set_listeners_priority(wideness_color_slider);
   Slider_set_listeners_priority(offset_color_slider);
   Slider_set_listeners_priority(brightness_color_slider);
   Listeners_set_priority(E.C, close_btn.listeners);
   // if (scroller_component) Scroller_component_set_listeners_priority(scroller_component);


   // /*************************************************************************************************/

   { // Sliders Connection 
      Slider_connect(feather_slider, (params, slider_val) => {

         const target_mesh = params.clbk_params.target_mesh;
         const snake = params.clbk_params.snake;
         const num_meshes = snake.count;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         Gl_set_attr_feather(target_mesh.gfx, val, num_meshes);


         params.clbk_params.snake.style.feather = val;
         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, target_mesh: head, mnemonics: params.params.mnemonics.feather_slider });


      Slider_connect(speed_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.speed = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.speed_slider });


      Slider_connect(slope_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.init_slope = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.slope_slider });


      Slider_connect(next_anim_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.start_next_anim = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.next_anim_slider });

      // TODO:
      // IMPORTANT: Reducing the ratio-size of body meshes should NOT take place in 'scale animation'
      Slider_connect(reduce_size_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         if (snake.in_scale_animation) return;

         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.reduce_mod = val;

         for (let i = 1; i <= snake.body.boundary; i++) {

            const body = snake.body.buffer[i];
            let reduce_size = (i) * val;
            let calc_size = snake.size - reduce_size;
            if (calc_size < snake.min_size) {
               calc_size = snake.min_size;
            }

            const pos_dif = body.mesh.geom.dim[0] - calc_size;
            body.mesh.geom.pos[0] += pos_dif;
            body.mesh.geom.pos[1] += pos_dif;
            Gl_add_vpos_y(body.mesh.gfx, pos_dif);
            Gl_add_vpos_x(body.mesh.gfx, pos_dif);

            
            body.size = calc_size;
            body.mesh.geom.dim[0] = calc_size;
            body.mesh.geom.dim[1] = calc_size;
            Mesh_update_set_dim_xy(body.mesh);
            Gl_set_dim_xy(body.mesh.gfx, calc_size, calc_size);


            body.mesh.mat.style.rcorners = calc_size;
            Gl_set_attr_round_corners(body.mesh.gfx, calc_size)
         }

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.reduce_size_slider });


      Slider_connect(distance_factor_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         if (snake.in_scale_animation) return;

         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.distance_factor = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.distance_factor_slider });


      // TODO: Set limits to slider val. below a body scale size threshold, the animation stops
      Slider_connect(max_scale_factor_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.scale_factor = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.max_scale_factor_slider });


      Slider_connect(anim_step_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.step = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.anim_step_slider });


      Slider_connect(wideness_color_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const wideness = params.clbk_params.mnemonics.wideness;
         const wideness_val = Linear_interpolation(wideness.min, wideness.max, slider_val);
         wideness.val = wideness_val;
         snake.Color_set_fn(snake);
         wideness.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });


      Slider_connect(offset_color_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const offset = params.clbk_params.mnemonics.offset;
         const offset_val = Linear_interpolation(offset.min, offset.max, slider_val);

         offset.val = offset_val;
         snake.Color_set_fn(snake);

         offset.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });


      Slider_connect(brightness_color_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const brightness = params.clbk_params.mnemonics.brightness;
         const brightness_val = Linear_interpolation(brightness.min, brightness.max, slider_val);

         brightness.val = brightness_val;
         snake.Color_set_fn(snake);

         brightness.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });

   }




   // params.snake_struct_controls_section = controls_section;



   // return menu_panel;
   // return controls_section.children.buffer;

}
/**This is a callback. It differentiates from the  'Snake_options_callback' which is used for a standalone snake game implementation*/
export function Snake_options_controls(params) {


   if (params.params.menu_panel !== null) return;

   const snake = params.params.snake;
   const head = snake.body.buffer[0].mesh;

   const mn = params.params.mnemonics;
   const feather_slider_val = mn.feather_slider.slider_val;
   const speed_slider_val = mn.speed_slider.slider_val;
   const slope_slider_val = mn.slope_slider.slider_val;
   const next_anim_slider_val = mn.next_anim_slider.slider_val;
   const reduce_size_slider_val = mn.reduce_size_slider.slider_val;
   const distance_size_slider_val = mn.distance_factor_slider.slider_val;
   const max_scale_factor_slider_val = mn.max_scale_factor_slider.slider_val;
   const anim_step_slider_val = mn.anim_step_slider.slider_val;
   const wideness_color_slider_val = mn.color_slider.wideness.slider_val;
   const offset_color_slider_val = mn.color_slider.offset.slider_val;
   const brightness_color_slider_val = mn.color_slider.brightness.slider_val;




   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];


   const controls_section =[];



   /*************************************************************************************************/
   // Menu Options

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);



   const feather_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Feather', layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:feather_slider, enable_sdf_rect: 6});
   feather_slider.SetInitialValue(feather_slider_val);
   controls_section.push(feather_slider);
   
   const speed_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Speed', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:speed_slider, enable_sdf_rect: 6});
   speed_slider.SetInitialValue(speed_slider_val);
   controls_section.push(speed_slider);

   const slope_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Slope', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:slope_slider, enable_sdf_rect: 6});
   slope_slider.SetInitialValue(slope_slider_val);
   controls_section.push(slope_slider);

   const next_anim_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Next Animation Start', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:next_anim_slider, enable_sdf_rect: 6});
   next_anim_slider.SetInitialValue(next_anim_slider_val);
   controls_section.push(next_anim_slider);

   const reduce_size_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Reduce Size', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:reduce_size_slider, enable_sdf_rect: 6});
   reduce_size_slider.SetInitialValue(reduce_size_slider_val);
   controls_section.push(reduce_size_slider);

   const distance_factor_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Distance Ammount', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:distance_factor_slider, enable_sdf_rect: 6});
   distance_factor_slider.SetInitialValue(distance_size_slider_val);
   controls_section.push(distance_factor_slider);

   const max_scale_factor_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Scale Ammount', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:max_scale_factor_slider, enable_sdf_rect: 6});
   max_scale_factor_slider.SetInitialValue(max_scale_factor_slider_val);
   controls_section.push(max_scale_factor_slider);

   const anim_step_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Timer Step', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:anim_step_slider, enable_sdf_rect: 6});
   anim_step_slider.SetInitialValue(anim_step_slider_val);
   controls_section.push(anim_step_slider);

   /*****************************************************************************************************************************************/
   // Sliders for color change
   const enable_panel = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:Color_hsv_to_rgb_calibrated(0, 0, 1,1,.12, 0), name:'SwitchEnable', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:enable_panel, enable_sdf_rect:6, });
   controls_section.push(enable_panel);
   {

      const label = Create_widget_label(Style_label_default_properties({text:'Color Options', theme:Color_theme_label_auto(.08,1,.18,0), text_pad:[14, 10], texture_id:TEXTURES.MTSDF_CONSOLAS_1024}));
      Widget_gfx_ready_enable({mesh:label, enable_sdf_rect:label.geom.dim[1]});
      enable_panel.AddItem(label);
      
      const color_switch = Create_widget_switch_simple(Style_switch_default_properties({pos:[0, 0, 1], size:20, theme:Color_theme_switch_auto(0,0,.18,0), name:'Color Switch'}));
      Widget_gfx_ready_enable({mesh:color_switch, enable_sdf_rect:color_switch.geom.dim[1]});
      enable_panel.AddItem(color_switch);


      const color_switch_params = {
         snake: snake,
         // mnemonics:{transparency:0.5, hue:0.5, color:null},
      };
      color_switch.Bind(
         (params) => {

            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;
            const snake = params.params.snake;


            if (snake.Color_set_fn === Snake_body_set_color) {

               snake.Color_set_fn = Snake_body_set_color_from_color_palete;
               snake.Color_set_fn(snake);
            }
            else {

               snake.Color_set_fn = Snake_body_set_color;
               snake.Color_set_fn(snake);
            }

         },
         null, color_switch_params, _,
      );
   }

   const wideness_color_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Color Wideness', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:wideness_color_slider, enable_sdf_rect: 6});
   wideness_color_slider.SetInitialValue(wideness_color_slider_val);
   controls_section.push(wideness_color_slider);

   const offset_color_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'Color Offset', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:offset_color_slider, enable_sdf_rect: 6});
   offset_color_slider.SetInitialValue(offset_color_slider_val);
   controls_section.push(offset_color_slider);

   const brightness_color_slider = Create_widget_slider(Style_slider_default_properties({dim:[dim[0] - pad * 2, 10], theme:Color_theme_slider_auto(0,0,.18, 0), name:'brightness', layout:LAYOUT.VERTICAL}))
   Widget_gfx_ready_enable({mesh:brightness_color_slider, enable_sdf_rect: 6});
   brightness_color_slider.SetInitialValue(brightness_color_slider_val);
   controls_section.push(brightness_color_slider);



   /*************************************************************************************************/

   { // Sliders Connection 
      Slider_connect(feather_slider, (params, slider_val) => {

         const target_mesh = params.clbk_params.target_mesh;
         const snake = params.clbk_params.snake;
         const num_meshes = snake.count;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         Gl_set_attr_feather(target_mesh.gfx, val, num_meshes);


         params.clbk_params.snake.style.feather = val;
         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, target_mesh: head, mnemonics: params.params.mnemonics.feather_slider });


      Slider_connect(speed_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.speed = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.speed_slider });


      Slider_connect(slope_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.init_slope = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.slope_slider });


      Slider_connect(next_anim_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.start_next_anim = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.next_anim_slider });

      // TODO:
      // IMPORTANT: Reducing the ratio-size of body meshes should NOT take place in 'scale animation'
      Slider_connect(reduce_size_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         if (snake.in_scale_animation) return;

         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.reduce_mod = val;

         for (let i = 1; i <= snake.body.boundary; i++) {

            const body = snake.body.buffer[i];
            let reduce_size = (i) * val;
            let calc_size = snake.size - reduce_size;
            if (calc_size < snake.min_size) {
               calc_size = snake.min_size;
            }

            const pos_dif = body.mesh.geom.dim[0] - calc_size;
            body.mesh.geom.pos[0] += pos_dif;
            body.mesh.geom.pos[1] += pos_dif;
            Gl_add_vpos_y(body.mesh.gfx, pos_dif);
            Gl_add_vpos_x(body.mesh.gfx, pos_dif);

            
            body.size = calc_size;
            body.mesh.geom.dim[0] = calc_size;
            body.mesh.geom.dim[1] = calc_size;
            Mesh_update_set_dim_xy(body.mesh);
            Gl_set_dim_xy(body.mesh.gfx, calc_size, calc_size);


            body.mesh.mat.style.rcorners = calc_size;
            Gl_set_attr_round_corners(body.mesh.gfx, calc_size)
         }

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.reduce_size_slider });


      Slider_connect(distance_factor_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         if (snake.in_scale_animation) return;

         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.distance_factor = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.distance_factor_slider });


      // TODO: Set limits to slider val. below a body scale size threshold, the animation stops
      Slider_connect(max_scale_factor_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.scale_factor = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.max_scale_factor_slider });


      Slider_connect(anim_step_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.step = val;

         params.clbk_params.mnemonics.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.anim_step_slider });


      Slider_connect(wideness_color_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const wideness = params.clbk_params.mnemonics.wideness;
         const wideness_val = Linear_interpolation(wideness.min, wideness.max, slider_val);
         wideness.val = wideness_val;
         snake.Color_set_fn(snake);
         wideness.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });


      Slider_connect(offset_color_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const offset = params.clbk_params.mnemonics.offset;
         const offset_val = Linear_interpolation(offset.min, offset.max, slider_val);

         offset.val = offset_val;
         snake.Color_set_fn(snake);

         offset.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });


      Slider_connect(brightness_color_slider, (params, slider_val) => {

         const snake = params.clbk_params.snake;

         const brightness = params.clbk_params.mnemonics.brightness;
         const brightness_val = Linear_interpolation(brightness.min, brightness.max, slider_val);

         brightness.val = brightness_val;
         snake.Color_set_fn(snake);

         brightness.slider_val = slider_val;

      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider },);

   }


   return controls_section;

}


