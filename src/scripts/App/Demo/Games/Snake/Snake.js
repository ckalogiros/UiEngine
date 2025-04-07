import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Mesh_animations_create } from "../../../../Engine/Animations/MeshAnimations.js";
import { Mouse_android_deactivate_scrolling, Mouse_get_pos_difx } from "../../../../Engine/Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_close_btn, Create_widget_label, Create_widget_slider, Create_widget_switch_simple } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_build_group_from_root_mesh } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from "../../../../Engine/Core/Views/RootView.js";
import { BLACK, BLUEL, CYAN, GREEN, GREY, Interpolate_rgb_to_01, PURPLEB, PURPLER, REDL, RGB, TRANSPARENT, WHITE, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_calc_pos_dif, Mesh_set_root_in_focus } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Events/EventFunctions.js";
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim, Scroller_component_set_listeners_priority } from "../../../../Engine/Drawables/Widgets/ScrollerComponent.js";
import { Style_button_default_properties, Style_label_default_properties, Style_rect_default_properties } from "../../../../Engine/Drawables/Widgets/WidgetReadyStyles.js";
import { Slider_connect, Slider_set_listeners_priority } from "../../../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Switch_set_listeners_priority } from "../../../../Engine/Drawables/Widgets/WidgetSwitch.js";
import { Listeners_set_priority } from "../../../../Engine/Events/EventListeners.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { Vertex_buffer_group_create_scissorbox } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_set_attr_round_corners, Gl_rotate_z_2d, Gl_set_attr_feather, Gl_set_dim_xy, Gl_add_dim_xy, Gl_add_vpos_y, Gl_add_vpos_x, Gl_set_angle } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomPos, GetSequencedColor } from "../../../../Helpers/Helpers.js";
import { Digitize, Linear_interpolation, Logarithmic_interpolation, Normalize } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Magnitude, Magnitude_2vectors } from "../../../../Helpers/Math/MathOperations.js";
import { Widget_gfx_ready_enable } from "../../../Widgets/WidgetGfxReady.js";
import { Demo_clbk_animations_create_transition_slope, Demo_clbk_animations_text_create } from "../../DemoAnimations.js";











const MAX_WIDTH = 400;
const MAX_BODY_MESHES = 100;
const INITIAL_BODY_COUNT = 20;
const collectable_apple_dim = [64 / 2, 73 / 2];
const collectable_dim = [64, 64];
const collectable_scale = .6;

const SLOPE_CONSTANT = .14;
const INITIAL_SIZE = 25;
const SPEED = 4.;
const FEATHER = 3;
const MIN_SIZE = 10;
const START_NEXT_ANIM_SIZE = 2.65; // A size to subtract from the max scale of a body scale up animation, in order to start the next body scale up. In pixel size (half size)
const REDUCE_FACTOR = .1;
const DISTANCE_FACTOR = 1.; // The overlap between snake body meshes. The smaller, the further apart
const TIMER_STEP = .0015;
const SCALE_UP_FACTOR = 1.7;

const score_font = TEXTURES.CONSOLAS_28px;
const score_size = 12;

const def_tex_id = TEXTURES.CONSOLA_VARIANT_FONT, def_sub_tex_id = ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S10_0;




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
export function Game_snake(y = 0, controls_create = true) {


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
   const board_color = TRANSPARENCY(Interpolate_rgb_to_01(40, 50, 46), 1.);
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[VIEWPORT.WIDTH / 2 - board_width, vertical_space, 0], dim:[board_width - board_pad, board_height], col:board_color, name:'section', }));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10, });







   /*************************************************************************************************/
   // Create the Collectible mesh

   const collectable_size = 20;

   const collectable = Create_rect_mesh(Style_rect_default_properties({pos:[300, 300, 0], dim:collectable_dim, col:REDL[3], name:'collectable', }));
   Widget_gfx_ready_enable({mesh:collectable, enable_sdf_rect:collectable_dim[0], enable_unif_scale:true});
   collectable.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
   section.AddItem(collectable);

   const center_applpe_pos = [
      (collectable.geom.pos[0] + collectable.geom.dim[0]) - (collectable_apple_dim[0] + 0),
      (collectable.geom.pos[1] + collectable.geom.dim[1]) - (collectable_apple_dim[1] + 6),
      1
   ];
   const collectable_apple = Create_rect_mesh(Style_rect_default_properties({pos:center_applpe_pos, dim:collectable_apple_dim, col:WHITE, texture_id:TEXTURES.TEST_APPLE, name:'collectable_apple'}));
   Widget_gfx_ready_enable({mesh:collectable_apple, });
   section.AddItem(collectable_apple);







   /*************************************************************************************************/
   // Create the snake head's nose mesh (Shows the direction of the snke)
   const nose = Create_rect_mesh(Style_rect_default_properties({pos:[0, 0, 1], dim:[4, 8], col:TRANSPARENCY(BLUEL[9], 1.), }));
   Widget_gfx_ready_enable({mesh:nose, enable_sdf_rect:10, enable_attr_angle:0, });
   nose.SetName('Nose');
   section.AddItem(nose);







   /*************************************************************************************************/
   // Create snake body meshes

   let next_posx = 20;
   let next_posy = 40;
   let zpos = 1;

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
      const body_mesh = Create_rect_mesh(Style_rect_default_properties({pad:[0, 0], pos:[next_posx, next_posy, 1], dim:[calc_size, calc_size], col:col, name:'body_mesh', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
      Widget_gfx_ready_enable({mesh:body_mesh, enable_sdf_rect:style.rcorners, enable_unif_scale:true});
      section.AddItem(body_mesh);

      const bodyidx = snake.body.Add(new Body_Mesh_Properties(body_mesh, snake.glow_intensity));
      snake.body.buffer[bodyidx].idx = bodyidx; // Store the index for convinience
      snake.body.buffer[bodyidx].size = calc_size; // Store the index for convinience
      snake.body.buffer[bodyidx].reduce_size = reduce_size;

      snake.count++;
      if (bodyidx !== i) alert('514332139908', 'snake body mesh should index mismatch');
      // Name each body according to its index 
      body_mesh.SetName('body-' + bodyidx);


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


            if (snake.body.buffer[0].in_animation === false) { // Let user been able to rotate immidiately after user input, instead of waiting the snake animation to take place 

               snake.rotation.amt += mouse_xdif * mod;

               snake.vel[0] = Math.sin(snake.rotation.amt);
               snake.vel[1] = Math.cos(snake.rotation.amt);

               const rot_amt = snake.rotation.amt;
               Gl_rotate_z_2d(nose.gfx, nose.geom.dim, rot_amt, 1);

               const angle = Math.atan2(snake.vel[0], snake.vel[1]);
               const normalizedAngle = angle >= 0 ? angle : (2 * Math.PI + angle); // Normalize from -π,π to 0,π
               Gl_set_angle(nose.gfx, normalizedAngle);


               // Rotate nose
               const cx = nose.geom.pos[0]; // Center to sattelites position
               const cy = nose.geom.pos[1]
               const r = head.geom.dim[0] * snake.glow_scale_down_factor + nose.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
               const a = (cx + (r * Math.sin(rot_amt))) * snake.glow_scale_down_factor; // The rotation is the tangent of the outer head's perimeter 
               const b = (cy + (r * Math.cos(rot_amt))) * snake.glow_scale_down_factor;

               const new_posx = head.geom.pos[0] + head.geom.dim[0];
               const new_posy = head.geom.pos[1] + head.geom.dim[1];

               nose.geom.SetWposXY(nose.gfx, new_posx, new_posy);
               nose.geom.AddWposXY(nose.gfx, a, b);
               // TODO: Set the round corners for styled nose mesh
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
   const digit1_label = Create_widget_label(Style_label_default_properties({text:'0', pos:[0, 0, 0], col:TRANSPARENCY(YELLOWR[9], 1.), text_pad:[text_pad_x, text_pad_y], font_size:score_font}));
   {
      digit1_label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      digit1_label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 12);
      digit1_label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, digit1_label.geom.dim[0]);

      digit1_label.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC;

      section.AddItem(digit1_label);
      digit_meshes_arr.push(digit1_label);
   }

   // Calculate score label width before creation. Works only if the font is already in use (loaded)
   const score_label = Create_widget_label(Style_label_default_properties({text:'score', col:GREEN[7], text_pad:[text_pad_x, text_pad_y], font_size:score_font}));
   {
      score_label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      score_label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 12);
      score_label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, score_label.geom.dim[1]);
      score_label.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC;
      section.AddItem(score_label);
   }

   const score_slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, .1, 10);







   /*************************************************************************************************/
   // Render Section 
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();


   const digit_pos_x = section.geom.pos[0] + section.geom.dim[0] * 2;
   digit1_label.MoveNoGfxUpdate(digit_pos_x - (digit1_label.geom.dim[0] * 2 + 10), 10);
   score_label.MoveNoGfxUpdate(digit_pos_x - (score_label.geom.dim[0] * 2 + digit1_label.geom.dim[0] * 6 + 10), 10);


   section.Render();


   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);







   /*************************************************************************************************/
   // Set Uniforms Callbacks

   collectable.GfxUniformSetAndUpdate('u_scale2', [collectable_scale, 1]);
   // collectable.GfxUniformSetAndUpdate('u_generic_controls', [.5, .5, .9]);
   // Initialize shader attribute
   // Gl_set_glow_intensity(collectable.gfx, 1.);
   alert('Replace glow intensity attribute with generic attribute\nThis means an implementation of creating generic attributes automaticaly like generic uniforms ')

   { // Color animations
      Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, collectable, .005, .1, .4, 0.0, .3, true);
      Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.A, collectable, .005, .1, .4, 0.0, .3, true);
   }

   const head = snake.body.buffer[0].mesh;
   head.GfxUniformSetAndUpdate('u_scale2', [snake.glow_scale_down_factor, 1]);






   /*******************************************************************************************/
   // Create Options Button

   let options = null;
   if (controls_create) {

      options = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'OPTIONS', _, [100, 0, 1], 20, CYAN[6], WHITE, [32, 6], .5, _, TEXTURES.CONSOLAS_24px);
      options.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      options.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      options.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      options.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 3);
      options.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, options.geom.dim[1]);
   }





   const options_clbk_params = {
      menu_panel: null,
      snake: snake,

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
            brightness: { val: 0, slider_val: 1, min: 0, max: 1 },

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


      options.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION;
      options.GenGfxCtx();
      options.Render()

      options.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, options.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(options)
      Construct_listen_events_relations_from_mesh_tree(options);

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
      Snake_options_callback: Snake_options_callback,
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

   const tr = .75;

   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[20, 20], pos:[VIEWPORT.WIDTH / 2, 100, 10], col:TRANSPARENCY(GREY[3], tr), name:'StartMenuPanel', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:r_corners});
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   menu_panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;

   zpos++;




   /*************************************************************************************************/
   // Menu Options

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
   let start_btn = null;

   const play_contols_info = Create_rect_mesh(Style_rect_default_properties({pad:[left_pad, 10], pos:[0, 0, 4], dim:[0, 0], col:TRANSPARENCY(GREY[5], tr), name:'play_contols_info', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:play_contols_info, enable_sdf_rect:r_corners});
   menu_panel.AddItem(play_contols_info);
   {
      const text_pad = [11, 6];

      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[1], .0), name:'Controls section', layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:10});
         play_contols_info.AddItem(info);

         // const col = BLUEL[9];
         const col = BLACK;
         const ctrl = Create_widget_label(Style_label_default_properties({text:info_text_use_options, col:col, text_col:TRANSPARENCY(WHITE, .5), text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S3_0}));
         Widget_gfx_ready_enable({mesh:ctrl, enable_sdf_rect:ctrl.geom.dim[1]});
         info.AddItem(ctrl);
      }
      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[0], .0), name:'Controls section', layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:menu_panel.geom.dim[0] / 10});
         play_contols_info.AddItem(info);

         const col = BLUEL[9];
         // const col = BLACK;
         const ctrl = Create_widget_label(Style_label_default_properties({text:'CONTROLS', col:TRANSPARENT, text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id}));
         ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, ctrl.geom.dim[1]);
         info.AddItem(ctrl);
      }
      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[0], .0), name:'Rotate Left section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:menu_panel.geom.dim[0] / 10});
         play_contols_info.AddItem(info);

         const col = PURPLER[9];
         const ctrl = Create_widget_label(Style_label_default_properties({text:'Rotate Left', col:col, text_col:GREY[3], text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id}));
         ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, ctrl.geom.dim[1]);
         info.AddItem(ctrl);

         const expl = Create_widget_label(Style_label_default_properties({text:info_text_rot_left, col:TRANSPARENCY(GREY[4], 0), text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id}));
         expl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         expl.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         expl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
         info.AddItem(expl);
      }
      {
         const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[1], .0), name:'Rotate Right section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
         Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:menu_panel.geom.dim[0] / 10});
         play_contols_info.AddItem(info);

         const col = PURPLEB[9];
         const ctrl = Create_widget_label(Style_label_default_properties({text:'Rotate Right', col:col, text_col:GREY[3], text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id}));
         ctrl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         ctrl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, ctrl.geom.dim[1]);
         info.AddItem(ctrl);

         const expl = Create_widget_label(Style_label_default_properties({text:info_text_rot_right, col:TRANSPARENCY(GREY[4], 0), text_pad:text_pad, texture_id:def_tex_id, sub_texture_id:def_sub_tex_id}));
         expl.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         expl.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         expl.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
         info.AddItem(expl);
      }
   }
   {
      {
         // const info = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], dim:[0, 0], col:TRANSPARENCY(GREY[1], .0), name:'Start sub section', layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF}));
         // Widget_gfx_ready_enable({mesh:info, enable_sdf_rect:menu_panel.geom.dim[0] / 10});
         // play_contols_info.AddItem(info);

         /*******************************************************************************************/
         // Start Game button
         start_btn = Create_widget_close_btn(Style_button_default_properties({ menu_panel, text:'start_btn', pos:[0, 0, zpos], col:btn_col, text_pad:[dim[0] / 2 - pad * 2, 10], texture_id:def_tex_id, sub_texture_id:def_sub_tex_id}));
         Widget_gfx_ready_enable({mesh:start_btn, enable_sdf_rect:start_btn.geom.dim[1]});
         menu_panel.AddItem(start_btn);
      }
   }




   /*************************************************************************************************/
   // Render Menu 
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   menu_panel.Calc_no_gfx_update();

   start_btn.MoveNoGfxUpdate(
      (menu_panel.geom.pos[0] - start_btn.geom.pos[0]) + (menu_panel.geom.dim[0] - start_btn.geom.dim[0]),
      (menu_panel.geom.pos[1] - start_btn.geom.pos[1]) + (menu_panel.geom.dim[1] * 2 - (start_btn.geom.dim[1] * 2 + 10)),
   );

   menu_panel.MoveNoGfxUpdate(
      -menu_panel.geom.dim[0],
      0,
   );


   menu_panel.Render();


   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);

   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button
   const evt_clbk_params = {
      evt_clbks: () => {
         Time_intervals_create(16, 'Snake', TIME_INTERVAL_REPEAT_ALWAYS, Animate_snake, params);
      },
   }

   menu_panel.CreateEventCallback(evt_clbk_params);

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
   head.geom.AddWposXY(head.gfx, xx, yy);

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


      collectable.SetWposXY(rand_posx, rand_posy)
      collectable_apple.SetWposXY(rand_posx + 1, rand_posy - 7)

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
      k++;

      const limit = digit_label.text_mesh.text_width;
      Demo_clbk_animations_text_create(digit_label, score_slope_params_pointer, limit, 'SnakeScore_anim1', clbk_anim_flag, text_substitution);


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

            const digit_label = Create_widget_label(_, '0', _, pos, score_size, TRANSPARENCY(YELLOWR[9], 1.), WHITE, [7, 3], _, _, score_font);
            // const digit_label = Create_widget_label(_, '0', _, pos, 24, TRANSPARENCY(YELLOWR[9], 1.), WHITE, [7, 3], _, _, TEXTURES.MTSDF_CONSOLAS_1024);
            digit_label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            digit_label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 12);
            digit_label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, digit_label.geom.dim[0]);

            digit_label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC | GFX_CTX_FLAGS.FROM_PARENT_DSC, last_digit_label.gfx.vb.groupidx, last_digit_label.text_mesh.gfx.vb.groupidx);
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
               Demo_clbk_animations_text_create(digit_label, score_slope_params_pointer, limit, 'SnakeScore_anim', clbk_anim_flag, text_substitution);

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
            body_mesh.geom.AddWposXY(body_mesh.gfx, xx2, yy2);


            prev_mesh = body_mesh;
         }
      }


   }




   /*******************************************************************************************/
   // Nose move

   const angle = Math.atan2(x * .5, y * .5); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
   Gl_rotate_z_2d(nose.gfx, nose.geom.dim, angle, 1);

   const normalizedAngle = angle >= 0 ? angle : (2 * Math.PI + angle); // Normalize from -π,π to 0,π
   Gl_set_angle(nose.gfx, normalizedAngle);

   const cx = nose.geom.pos[0]; // Center to sattelites position
   const cy = nose.geom.pos[1]
   const r = head.geom.dim[0] * snake.glow_scale_down_factor + nose.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
   const a = (cx + (r * Math.sin(angle))) * snake.glow_scale_down_factor; // The rotation is the tangent of the outer head's perimeter 
   const b = (cy + (r * Math.cos(angle))) * snake.glow_scale_down_factor;

   const new_posx = head.geom.pos[0] + head.geom.dim[0];
   const new_posy = head.geom.pos[1] + head.geom.dim[1];

   nose.geom.SetWposXY(nose.gfx, new_posx, new_posy);
   nose.geom.AddWposXY(nose.gfx, a, b);
   // TODO: Set the round corners for styled nose mesh

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
   body.mesh.geom.AddDimXY(body.mesh.gfx, res, res);
   Gl_add_dim_xy(body.mesh.gfx, res, res);


   body.mesh.mat.style.rcorners = body.mesh.geom.dim[0];
   Gl_set_attr_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);


   body.glow_intensity += snake.glow_intensity_step;
   // Gl_set_glow_intensity(body.mesh.gfx, body.glow_intensity);





   // Nose move with the scale
   if (bodyidx === 0) {

      const nose = params.nose;
      nose.geom.AddWposXY(nose.gfx, res * 1 * snake.vel[0], res * 1 * snake.vel[1]);
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
      body.mesh.geom.AddDimXY(body.mesh.gfx, -res, -res);
      Gl_add_dim_xy(body.mesh.gfx, -res, -res)

      body.mesh.mat.style.rcorners = body.mesh.geom.dim[0];
      Gl_set_attr_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);


      body.glow_intensity -= snake.glow_intensity_step;
      // Gl_set_glow_intensity(body.mesh.gfx, body.glow_intensity);



      // Nose move with the scale
      if (bodyidx === 0) {

         const nose = params.nose;
         nose.geom.AddWposXY(nose.gfx, (-res) * snake.vel[0] * 1., (-res) * snake.vel[1] * 1.);
      }


      return true;
   }

   else {


      // Avoid smaller than snake.min_size body meshes
      body.mesh.geom.dim[0] = body.size;
      body.mesh.geom.dim[1] = body.size;
      body.mesh.geom.SetDimXY(body.mesh.gfx, body.size, body.size);
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




      /*************************************************************************************************/
      const head = snake.body.buffer[0].mesh;
      head.GfxUniformSetAndUpdate('u_scale2', [snake.glow_scale_down_factor, 1]);


      const bodyidx = snake.body.Add(new Body_Mesh_Properties(body_mesh));
      snake.count++;
      body_mesh.SetName('body-' + bodyidx);

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
      Gl_add_vpos_y(body.mesh.gfx, pos_dif);
      Gl_add_vpos_x(body.mesh.gfx, pos_dif);

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

      body.mesh.SetColorRGB(color);

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
      body.mesh.SetColorRGB(col)
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
   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:[VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim:dim, col:TRANSPARENCY(GREY[1], .5), name:'MenuOptionsPanel',}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:menu_panel.geom.dim[0] / 10, });
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   params.params.menu_panel = menu_panel;


   zpos++;
   const tr = .4;



   const controls_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[0], .6), name:'controls_section', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:controls_section, enable_sdf_rect:10, });
   menu_panel.AddItem(controls_section);

   controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);




   /*************************************************************************************************/
   // Menu Options

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);



   const feather_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Feather',)
   feather_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   feather_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   feather_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   feather_slider.SetInitialValue(feather_slider_val);
   feather_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(feather_slider);

   const speed_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Speed',)
   speed_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   speed_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   speed_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   speed_slider.SetInitialValue(speed_slider_val);
   speed_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(speed_slider);

   const slope_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Slope',)
   slope_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slope_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   slope_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   slope_slider.SetInitialValue(slope_slider_val);
   slope_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(slope_slider);

   const next_anim_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Next Animation Start',)
   next_anim_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   next_anim_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   next_anim_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   next_anim_slider.SetInitialValue(next_anim_slider_val);
   next_anim_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(next_anim_slider);

   const reduce_size_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Reduce Size',)
   reduce_size_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   reduce_size_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   reduce_size_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   reduce_size_slider.SetInitialValue(reduce_size_slider_val);
   reduce_size_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(reduce_size_slider);

   const distance_factor_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Distance Ammount',)
   distance_factor_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   distance_factor_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   distance_factor_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   distance_factor_slider.SetInitialValue(distance_size_slider_val);
   distance_factor_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(distance_factor_slider);

   const max_scale_factor_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Scale Ammount',)
   max_scale_factor_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   max_scale_factor_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   max_scale_factor_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   max_scale_factor_slider.SetInitialValue(max_scale_factor_slider_val);
   max_scale_factor_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(max_scale_factor_slider);

   const anim_step_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Timer Step',)
   anim_step_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   anim_step_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   anim_step_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   anim_step_slider.SetInitialValue(anim_step_slider_val);
   anim_step_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(anim_step_slider);

   /*****************************************************************************************************************************************/
   // Sliders for color change
   const enable_panel = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[0], tr), name:'SwitchEnable', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:enable_panel, enable_sdf_rect:6, });
   controls_section.AddItem(enable_panel);
   {

      const label = Create_widget_label(_, 'Color Options', _, _, _, TRANSPARENCY(CYAN[6], .7), WHITE, [6, 5], _, _, TEXTURES.CONSOLAS_16px);
      label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, label.geom.dim[1]);
      enable_panel.AddItem(label);

      const color_switch = Create_widget_switch_simple(_, [0, 0, 1], 20, CYAN[7], _)
      color_switch.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      color_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      color_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS,);
      color_switch.SetName('Color Switch');
      enable_panel.AddItem(color_switch);

      // Activate: FROM_PARENT_ASC_SEARCH_ALL and ABSOLUTE_POSITION for vb pool search
      anim_step_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);

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

   const wideness_color_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Color Wideness',)
   wideness_color_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   wideness_color_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   wideness_color_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   wideness_color_slider.SetInitialValue(wideness_color_slider_val);
   wideness_color_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(wideness_color_slider);

   const offset_color_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Color Offset',)
   offset_color_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   offset_color_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   offset_color_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   offset_color_slider.SetInitialValue(offset_color_slider_val);
   offset_color_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(offset_color_slider);

   const brightness_color_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'brightness',)
   brightness_color_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   brightness_color_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   brightness_color_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   brightness_color_slider.SetInitialValue(brightness_color_slider_val);
   brightness_color_slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   controls_section.AddItem(brightness_color_slider);


   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, TRANSPARENCY(GREY[0], .8), WHITE[9], [dim[0] / 2 - pad * 2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   close_btn.SetName('close_btn');
   menu_panel.AddItem(close_btn);
   close_btn.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);


   close_btn.TEMP_recalc(dim[0] - close_btn.geom.dim[0], dim[1] * 2 - close_btn.geom.dim[1] * 2 - pad);






   /*************************************************************************************************/
   // Render Section 

   menu_panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   menu_panel.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
   menu_panel.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);


   menu_panel.GenGfxCtx();



   // controls_section.Calc_no_gfx_update();
   View_build_group_from_root_mesh(controls_section);
   controls_section.Calc_no_gfx_update();
   const center = (menu_panel.geom.dim[0] - controls_section.geom.dim[0]);
   controls_section.MoveNoGfxUpdate(center, pad); //pad += controls_section.geom.dim[1]*2 + 10;


   menu_panel.Render();



   /*************************************************************************************************************/
   // Create scroller before listeners, so that the listen events of clipped meshes will not register
   let scroller_component = null;
   const clean_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1] * 2 + 10);
   const needs_scroller = (controls_section !== null)
      ? (controls_section.geom.dim[1] > clean_height) ? true : false
      : false;
   if (needs_scroller) {


      const scroller_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1] * 2 + 10);
      scroller_component = Components_create_scroller_component(10, scroller_height, controls_section, 100);
      Scoller_component_gengfx_and_render(scroller_component, controls_section, GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(controls_section.root_posidx, scroller_component.root_posidx);
      Listeners_set_priority(E.C, scroller_component.listeners);
      menu_panel.AddChildScrollerIdx(controls_section.scroller_comp_idx);

      Scroller_component_calculate_handle_pos_dim(controls_section, scroller_component);


      /**************************************************************************************************************************/
      // Set scissor box
      const mx = controls_section.mesh_bufferidx;
      const my = scroller_component.mesh_bufferidx;
      const mw = controls_section.mesh_bufferidx;
      const mh = scroller_component.mesh_bufferidx;
      Vertex_buffer_group_create_scissorbox(controls_section.gfx.vb.groupidx, mx, my, mw, mh);
      const scrolled_section_text_mesh = controls_section.children.buffer[0].text_mesh
      Vertex_buffer_group_create_scissorbox(scrolled_section_text_mesh.gfx.vb.groupidx, mx, my, mw, mh);

      // Unfortunately must Re-render the menu_panel for the clipping of the scroller to take place
      Root_group_reset_gfxs(controls_section.root_bufferidx);
      Root_group_rerender_from_root_reconstruct_listeners(controls_section.root_bufferidx, true);

      Renderqueue_set_active(scroller_component.gfx.vb.groupidx, true);

   }


   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);


   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);
   controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);


   // Give menu items listen events priority 
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
   if (scroller_component) Scroller_component_set_listeners_priority(scroller_component);


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

            body.mesh.geom.dim[0] = calc_size;
            body.mesh.geom.dim[1] = calc_size;

            body.size = calc_size;
            body.mesh.geom.SetDimXY(body.mesh.gfx, calc_size, calc_size);
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




   params.snake_struct_controls_section = controls_section;

   // Create event callback for when the close menu button has been pressed
   const evt_clbk_params = {
      evt_clbks: () => {
         params.snake_struct_controls_section = null;
         params.params.menu_panel = null;
      },
   }

   menu_panel.CreateEventCallback(evt_clbk_params);

   return menu_panel;

}


