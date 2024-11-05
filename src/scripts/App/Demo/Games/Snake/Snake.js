import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Mesh_animations_create } from "../../../../Engine/Animations/MeshAnimations.js";
import { Android_deactivate_scrolling, MouseGetPosDifX } from "../../../../Engine/Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_close_btn, Create_widget_label, Create_widget_section, Create_widget_slider, Create_widget_switch, Create_widget_switch_simple } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_build_group_from_root_mesh } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from "../../../../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../../../../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLACK, BLUEL, GREEN, GREENL, GREY, Interpolate_rgb_to_01, ORANGEL, ORANGER, PURPLEB, PURPLER, RED, REDL, RGB, WHITE, YELLOW, YELLOWL, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_calc_pos_dif } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from "../../../../Engine/Drawables/Widgets/ScrollerComponent.js";
import { Slider_connect, Slider_set_listeners_priority } from "../../../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Switch_set_listeners_priority } from "../../../../Engine/Drawables/Widgets/WidgetSwitch.js";
import { Listeners_set_priority } from "../../../../Engine/Events/EventListeners.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { Vertex_buffer_group_create_scissorbox } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_set_attr_round_corners, Gl_set_glow_intensity, Gl_rotate_z_2d, Gl_set_attr_feather, Gl_set_dim_xy, Gl_add_dim_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomColor, GetRandomPos, GetSequencedColor } from "../../../../Helpers/Helpers.js";
import { Linear_interpolation, Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Magnitude, Max, Min } from "../../../../Helpers/Math/MathOperations.js";






// TODO: Make the head another color
// TODO: Create animation for the collectable
// TODO: Create glow effect for the snake. ?When and Where?
// TODO:
// TODO: Create a better panel for user input
// TODO:
// TODO: Pass the snake through another shader for glow
// TODO: Also on scale the glow effect should intensify








const MAX_BODY_MESHES = 100;
const INITIAL_BODY_COUNT = 40;
const collectable_scale = .52;

const SLOPE_CONSTANT = .14;
const INITIAL_SIZE = 25;
const SPEED = 4.;
const FEATHER = 3;
const MIN_SIZE = 10;
const START_NEXT_ANIM_SIZE = 3; // A size to subtract from the max scale of a body scale up animation, in order to start the next body scale up. In pixel size (half size)
const REDUCE_FACTOR = .1;
const DISTANCE_FACTOR = 1.; // The overlap between snake body meshes. The smaller, the further apart
const TIMER_STEP = .0015;
const SCALE_UP_FACTOR = 1.5;
// const SLOPE_CONSTANT = .89;
// const INITIAL_SIZE = 25;
// const SPEED = 4.;
// const FEATHER = 3;
// const MIN_SIZE = 10;
// const START_NEXT_ANIM_SIZE = 5; // A size to subtract from the max scale of a body scale up animation, in order to start the next body scale up. In pixel size (half size)
// const REDUCE_FACTOR = .1;
// const DISTANCE_FACTOR = 1.; // The overlap between snake body meshes. The smaller, the further apart
// const TIMER_STEP = .007;
// const SCALE_UP_FACTOR = 1.8;






// Snake's per body mesh properties
class Body_mesh_properties {

   constructor(_mesh = null, glow_intensity = 1) {

      if (!_mesh) alert()

      this.mesh = _mesh;
      this.idx = INT_NULL;
      this.size = INITIAL_SIZE;

      // A modifier for the calculation of the slope function that controls the next position of a snake body mesh
      this.t = 0; // Values = [0-1]
      this.prev_slope = 1.;// Stores the current calculated 't' to be used on the next snake 'Move' calculation. 
      // this.scale_factor = 1.8; // Max scale will be = 'scale_factor' times bigger to the original size

      this.in_scale_up_animation = false;
      this.in_animation = false;

      this.glow_intensity = glow_intensity;
   }
}








/**************************************************************************************************************************************************************/
// 

export function Game_snake(y = 0) {


   const snake = {

      count: 0, // Number of snake body meshes

      body: New_generic_buffer(_, 'Game Snake Body Meshes'), // Where all snake's body meshes variables will be stored
      color: TRANSPARENCY(YELLOWR[9], 1.),
      style: { rcorners: INITIAL_SIZE, feather: FEATHER, border: 2 },
      
      
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
      speed_slider: { init_val: SPEED, min: 0.2, max: 8.0 },
      slope_slider: { init_val: SLOPE_CONSTANT, min: .005, max: 1. },
      next_anim_slider: { init_val: START_NEXT_ANIM_SIZE, min: 2, max: 15 },
      reduce_size_slider: { init_val: REDUCE_FACTOR, min: 0, max: 4 },
      distance_factor_slider: { init_val: DISTANCE_FACTOR, min: 0.3, max: 1.3 },
      max_scale_factor_slider: { init_val: SCALE_UP_FACTOR, min: 1.4, max: 2.2 },
      anim_step_slider: { init_val: TIMER_STEP, min: 0.001, max: 0.01 },


      // colors:[GREY[2],GREY[6], BLUEL[9]],
      colors:[GREY[2],GREY[6], GREY[9]],
      // colors:[GREY[2],GREY[6], GREY[9], BLUEL[6]],
      // colors:[GREY[2],GREY[6]],
      // colors:[ORANGEL[9],ORANGER[9]],

      // Function Pointers
      Color_set_fn: Snake_body_set_color,
      color_fn_params: {
         fn1:[],
         fn2:{},
      },
   };

   if(snake.feather_slider.init_val < snake.feather_slider.min || snake.feather_slider.init_val > snake.feather_slider.max) alert('0099887766, feather_slider')
   if(snake.speed_slider.init_val < snake.speed_slider.min || snake.speed_slider.init_val > snake.speed_slider.max)   alert('0099887766, speed_slider')
   if(snake.slope_slider.init_val < snake.slope_slider.min || snake.slope_slider.init_val > snake.slope_slider.max)   alert('0099887766, slope_slider')
   if(snake.next_anim_slider.init_val < snake.next_anim_slider.min || snake.next_anim_slider.init_val > snake.next_anim_slider.max)  alert('0099887766, next_anim_slider')
   if(snake.reduce_size_slider.init_val < snake.reduce_size_slider.min || snake.reduce_size_slider.init_val > snake.reduce_size_slider.max)   alert('0099887766, reduce_size_slider')
   if(snake.distance_factor_slider.init_val < snake.distance_factor_slider.min || snake.distance_factor_slider.init_val > snake.distance_factor_slider.max)   alert('0099887766, reduce_size_slider')
   if(snake.max_scale_factor_slider.init_val < snake.max_scale_factor_slider.min || snake.max_scale_factor_slider.init_val > snake.max_scale_factor_slider.max) alert('0099887766, max_scale_factor_slider')
   if(snake.anim_step_slider.init_val < snake.anim_step_slider.min || snake.anim_step_slider.init_val > snake.anim_step_slider.max)  alert('0099887766, anim_step_slider')

   snake.color_fn_params.fn1 = snake.colors;




   const vertical_space = 35 + y;
   let board_width = (VIEWPORT.WIDTH / 2);
   let board_height = (VIEWPORT.HEIGHT / 2) - vertical_space;
   // let board_height = 200;

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2));
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const board_pad = (20 * log);
   const style = { rcorners: snake.size, feather: 6, border: 3 };

   // TODO: If android: deactivate scrolling
   if (PLATFORM.ANY_SMARTPHONE_DEVICE) {
      Android_deactivate_scrolling();
      board_width - DEVICE.info.canvas_left + DEVICE.info.canvas_right;
      board_height - DEVICE.info.canvas_top + DEVICE.info.canvas_bot;
   }

   const board_color = TRANSPARENCY(Interpolate_rgb_to_01(16, 28, 35), 1.9);
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [board_pad, vertical_space, 0], [board_width - board_pad, board_height], board_color, 'section', style);
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);










   /*************************************************************************************************/
   // Create the Collectible mesh

   // const collectable_size = snake.size*1.4;
   const collectable_size = 40;

   const collectable = Create_widget_section(_, _, [0, 0], [300, 300, 0], [collectable_size, collectable_size], PURPLEB[9], 'section', [collectable_size, 6, 3]);

   collectable.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   collectable.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   collectable.EnableGfxUniforms({ fx: SID.FX.FS_GLOW_VEC3, }, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
   collectable.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 6);
   collectable.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, collectable_size);
   collectable.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_GLOW_INTENSITY);
   collectable.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
   collectable.SetName('collectable');
   section.AddItem(collectable);







   /*************************************************************************************************/
   // Create the snake head's nose mesh (Shows the direction of the snke)
   const nose = Create_rect_mesh(_, [0, 0, 1], [4, 8], TRANSPARENCY(PURPLER[9], .2));
   // const nose = Create_rect_mesh(_, [0, 0, 1], [10, 15], TRANSPARENCY(PURPLER[9], .2));
   nose.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // nose.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   // nose.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   nose.SetName('Nose');
   section.AddItem(nose);







   /*************************************************************************************************/
   // Create snake body meshes

   // let next_posx = snake.size;
   // let next_posy = snake.size;
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
      // const col = i === 0 ? BLUEL[9] : GetSequencedColor(9);
      const col = GetSequencedColor(9);
      // const body_mesh = Create_widget_section(_, _, [0,0], [next_posx, next_posy, MAX_BODY_MESHES-i+1], [calc_size, calc_size], snake.color, 'body_mesh', style);
      // const body_mesh = Create_widget_section(_, _, [0, 0], [next_posx, next_posy, MAX_BODY_MESHES - i + 1], [calc_size, calc_size], col, 'body_mesh', style);
      // const body_mesh = Create_widget_section(_, _, [0,0], [next_posx, next_posy, 1], [calc_size, calc_size], snake.color, 'body_mesh', style);
      const body_mesh = Create_widget_section(_, _, [0, 0], [next_posx, next_posy, 1], [calc_size, calc_size], col, 'body_mesh', style);
      body_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, style.feather);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, style.rcorners);
      // body_mesh.EnableGfxUniforms({unif: SID.UNIF.FS_GLOW_VEC3,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      // body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_GLOW_INTENSITY);
      section.AddItem(body_mesh);

      // console.log(body_mesh.geom.pos)


      const bodyidx = snake.body.Add(new Body_mesh_properties(body_mesh, snake.glow_intensity));
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

         const mouse_xdif = MouseGetPosDifX();
         if (Abs(mouse_xdif) > .5) {


            /*******************************************************************************************/
            // Nose Rotation. Just add the ammount of mouse move on the x axis

            const mod = .02;
            const snake = params.params.target_params.snake;

            snake.rotation.amt += mouse_xdif * mod;

            snake.vel[0] = Math.sin(snake.rotation.amt);
            snake.vel[1] = Math.cos(snake.rotation.amt);

         }

      },
      _,
      {target_params: {  snake:snake, } },
      MESH_STATE.IS_HOLD_CLICK
   );







   /*************************************************************************************************/
   // Render Section 
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();
   section.Render();


   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);


   // Reposition collectable at the center of the canvas
   // collectable.SetWposXY(VIEWPORT.WIDTH/2 - collectable.geom.dim[0]*2,  VIEWPORT.HEIGHT/2-collectable.geom.dim[1]*2);
   // collectable.SetWposXY(VIEWPORT.WIDTH/2 - collectable.geom.dim[0],  snake.size*2);





   /*************************************************************************************************/
   // Set Uniforms Callbacks


   collectable.GfxUniformSetAndUpdate('u_scale2', [collectable_scale, 1]);
   collectable.GfxUniformSetAndUpdate('u_glow_params', [.7, .7, 1.]);
   // Initialize shader attribute
   Gl_set_glow_intensity(collectable.gfx, 1.);

   // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, collectable, .01, .35, .75, _, .35, false)
   // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, collectable, .01, .35, .75, _, .35, false)
   // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RB, collectable, .01, .35, .75, _, .35, true)
   // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, collectable, .1, -1., 1., 0);
   // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.ROT, collectable, .5, -5., 5., 0);

   const head = snake.body.buffer[0].mesh;

   head.GfxUniformSetAndUpdate('u_scale2', [snake.glow_scale_down_factor, 1]);






   /*************************************************************************************************/
   // Nose Controls

   let total_height = VIEWPORT.HEIGHT / 2 - 30;
   const pad = 0;

   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4, 4], [0 + pad, 0 + total_height * 2, 0], [0, 0], GREY[1]);
   controls_section.SetName('Sattelite_rotation->controls_section');
   controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);








   /*******************************************************************************************/
   // Create Options Button

   // const options = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'OPTIONS', _, [0, 0, 1], 20, BLUEL[6], WHITE, [14, 8], .5);
   const options = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'OPTIONS', _, [VIEWPORT.WIDTH / 2, VIEWPORT.HEIGHT, 1], 20, BLUEL[6], WHITE, [8, 6], .5);
   options.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   options.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   options.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   options.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 3);
   options.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, options.geom.dim[1]);



   const options_clbk_params = {
      menu_panel: null,
      snake: snake,

      //    Menu sliders are created on menu activation, so there is no refference to any previous sliders.
      //    For that we need to store the changes of all sliders in 'mnemonics' variable.
      //    Also store the initial value that the slider will change.
      mnemonics: {
         feather_slider:            { slider_val: snake.feather_slider.init_val,          min: snake.feather_slider.min,            max: snake.feather_slider.max},
         speed_slider:              { slider_val: snake.speed_slider.init_val,            min: snake.speed_slider.min,              max: snake.speed_slider.max},
         slope_slider:              { slider_val: snake.slope_slider.init_val,            min: snake.slope_slider.min,              max: snake.slope_slider.max},
         next_anim_slider:          { slider_val: snake.next_anim_slider.init_val,        min: snake.next_anim_slider.min,          max: snake.next_anim_slider.max},
         reduce_size_slider:        { slider_val: snake.reduce_size_slider.init_val,      min: snake.reduce_size_slider.min,        max: snake.reduce_size_slider.max},
         distance_factor_slider:    { slider_val: snake.distance_factor_slider.init_val,  min: snake.distance_factor_slider.min,    max: snake.distance_factor_slider.max},
         max_scale_factor_slider:   { slider_val: snake.max_scale_factor_slider.init_val, min: snake.max_scale_factor_slider.min,   max: snake.max_scale_factor_slider.max},
         anim_step_slider:          { slider_val: snake.anim_step_slider.init_val,        min: snake.anim_step_slider.min,          max: snake.anim_step_slider.max},
         
         // Color options sliders
         color_slider:{
            wideness:     { val:0, slider_val: 0.0002,  min: 0,  max: 0.001},
            offset:       { val:0, slider_val: 0.47,  min: 0,  max: 4},
            brightness:   { val:0, slider_val: 1,  min: 0,  max: 1},

         },
      },

      properties:{
         style:style,
      }
   }; // Pass an object to storethe menu mesh on menu options button click

   options_clbk_params.mnemonics.feather_slider.slider_val = options_clbk_params.mnemonics.feather_slider.slider_val / (options_clbk_params.mnemonics.feather_slider.max - options_clbk_params.mnemonics.feather_slider.min);
   options_clbk_params.mnemonics.speed_slider.slider_val = options_clbk_params.mnemonics.speed_slider.slider_val / (options_clbk_params.mnemonics.speed_slider.max - options_clbk_params.mnemonics.speed_slider.min);
   options_clbk_params.mnemonics.slope_slider.slider_val = options_clbk_params.mnemonics.slope_slider.slider_val / (options_clbk_params.mnemonics.slope_slider.max - options_clbk_params.mnemonics.slope_slider.min);
   options_clbk_params.mnemonics.next_anim_slider.slider_val = options_clbk_params.mnemonics.next_anim_slider.slider_val / (options_clbk_params.mnemonics.next_anim_slider.max - options_clbk_params.mnemonics.next_anim_slider.min);
   options_clbk_params.mnemonics.reduce_size_slider.slider_val = options_clbk_params.mnemonics.reduce_size_slider.slider_val / (options_clbk_params.mnemonics.reduce_size_slider.max - options_clbk_params.mnemonics.reduce_size_slider.min);
   options_clbk_params.mnemonics.distance_factor_slider.slider_val = options_clbk_params.mnemonics.distance_factor_slider.slider_val / (options_clbk_params.mnemonics.distance_factor_slider.max - options_clbk_params.mnemonics.reduce_size_slider.min);
   options_clbk_params.mnemonics.anim_step_slider.slider_val = options_clbk_params.mnemonics.anim_step_slider.slider_val / (options_clbk_params.mnemonics.anim_step_slider.max - options_clbk_params.mnemonics.anim_step_slider.min);
   options_clbk_params.mnemonics.max_scale_factor_slider.slider_val =
      Min((options_clbk_params.mnemonics.max_scale_factor_slider.max - options_clbk_params.mnemonics.max_scale_factor_slider.min), options_clbk_params.mnemonics.max_scale_factor_slider.slider_val) /
      Max((options_clbk_params.mnemonics.max_scale_factor_slider.max - options_clbk_params.mnemonics.max_scale_factor_slider.min), options_clbk_params.mnemonics.max_scale_factor_slider.slider_val);
   // Color change options

   options.Bind(
      Options_callback,
      _, options_clbk_params, _,
   );


   // Refference slider mnemonics to the snake struct
   // TODO: If snake struct has the  '.mnemonics.color_slider', then we need not to recreate or pass them seperately to the 'options_clbk_params', it is already in the 'snake'
   snake.color_fn_params.fn2 = options_clbk_params.mnemonics.color_slider;

   options.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.ABSOLUTE_POSITION | GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
   options.GenGfxCtx();
   options.Render()

   options.SetWposXY(-options.geom.dim[0], -options.geom.dim[1] * 2 - 4);

   options.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, options.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(options)
   Construct_listen_events_relations_from_mesh_tree(options);

   Listeners_set_priority(E.C, options.listeners);






   /*************************************************************************************************/
   // Create move for body meshes
   const params = {
      section: section,
      snake: snake,
      collectable: collectable,
      nose: nose,
      rot: snake.rotation,
      controls_section: controls_section,
      options_clbk_params: options_clbk_params,
   }

   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_snake, params);

   snake.Color_set_fn(snake);


   Debug_info_ui_static();

}


function Animate_snake(params) {

   const snake = params.params.snake;

   if (snake.in_scale_animation) return;

   const section = params.params.section;

   const head = snake.body.buffer[0].mesh;
   const nose = params.params.nose;
   const collectable = params.params.collectable;

   // Calculate move velocity
   const x = (snake.vel[0] + snake.accel[0]) * snake.speed ;
   const y = (snake.vel[1] + snake.accel[1]) * snake.speed ;


   /*******************************************************************************************/
   // Check panel boundary collision
   const left_bound = 0;
   const right_bound = section.geom.dim[0] * 2;
   const top_bound = 0;
   const bot_bound = (section.geom.dim[1] * 2);
   
   // Check boundaries
   const head_radius = snake.body.buffer[0].size;
   const head_pos = head.geom.pos;
   
   const head_left   = head_pos[0] + x;
   const head_right  = head_pos[0] + (head_radius*2) + x;
   const head_top    = head_pos[1] + y;
   const head_bot    = head_pos[1] + (head_radius*2) + y;
   
   
   
   let hit = false;
   let dirx = 1;
   let diry = 1;
   
   if (head_left < left_bound) {
      // snake.vel[0] *= -1;
      dirx = -1; // Reverse velocity
      hit = true;
   }
   else if (head_right > right_bound) {
      // snake.vel[0] *= -1;
      dirx = -1; // Reverse velocity
      hit = true;
   }
   // else if (head_top < top_bound) {
   else if (head_top < top_bound) {
      // snake.vel[1] *= -1;
      diry = -1; // Reverse velocity
      hit = true;
   }
   else if (head_bot > bot_bound) {
      // snake.vel[1] *= -1; // Reverse velocity
      diry = -1; // Reverse velocity
      hit = true;
   }
   // else 
   {
      const xx = x*dirx;
      const yy = y*diry;
      head.geom.pos[0] += xx;
      head.geom.pos[1] += yy;
      head.geom.AddWposXY(head.gfx, xx, yy);

      snake.vel[0] *= dirx;
      snake.vel[1] *= diry;
   }
   if(hit){
      // console.log(
      //    'left', head_left, 
      //    'right', head_right,
      //    '\ntop', head_top,
      //    'bottom', head_bot,
      //    '\nhead_radius', head_radius,
      //    '\nhead_pos', head_pos,
      //    '\nx', x, 'y', y,
      //    // 'bottom', head_right,
      //    '\nsection getPos', section.GetPosX(),
      //    'pos', section.geom.pos,
      //    'dim', section.geom.dim,
      // )
      // STATE.loop.paused = true
      // snake.in_scale_animation = true
   }


   // console.log(snake.vel)


   /*******************************************************************************************/
   // Check collision with collectable

   const dif = Mesh_calc_pos_dif(collectable, head)
   const dist1 = Magnitude(dif[0], dif[1]);
   // console.log('dist1', dist1, 'dif', dif)

   const collectable_size = collectable.geom.dim[0] * collectable_scale;

   // On collect
   if (dist1 < collectable_size + (head.geom.dim[0] * snake.glow_scale_down_factor)) {

      // STATE.loop.paused = true

      // Create new collectable in another random position
      const posx_start = section.geom.pos[0] + (collectable.geom.dim[0] * 2 + 10);
      const posx_end = (section.geom.pos[0] + section.geom.dim[0] * 2) - (collectable.geom.dim[0] * 2 + 10);
      const posy_start = section.geom.pos[1] + (collectable.geom.dim[0] * 2 + 10);
      const posy_end = (section.geom.pos[1] + section.geom.dim[1] * 2) - (collectable.geom.dim[0] * 2 + 10);
      const rand_pos = GetRandomPos([posx_start, posy_start], [posx_end, posy_end]);
      collectable.SetWposXY(rand_pos[0], rand_pos[1])

      // Create scale animation
      const params2 = {
         section: section,
         snake: snake,
         body_mesh_idx: 0,
         nose: params.params.nose,
         slope_constant1: 1.,
      };

      head.in_scale_up_animation = true;
      Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
      // Callback_animations_print_size();



      // TODO: Increment score

   }



   /*******************************************************************************************/
   // Move rest of snake body

   if(snake.body.boundary !== 0){
      
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
   
            // if(dist2 > body_mesh.geom.dim[0]*2 )
            {
   
               body_mesh.geom.pos[0] += xx2;
               body_mesh.geom.pos[1] += yy2;
               body_mesh.geom.AddWposXY(body_mesh.gfx, xx2, yy2);
   
            }
   
   
            prev_mesh = body_mesh;
         }
      }
   

   }   




   /*******************************************************************************************/
   // Nose move

   const angle = Math.atan2(x * .5, y * .5); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
   // const angle = Math.atan2(x * 2., y * 2.); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
   Gl_rotate_z_2d(nose.gfx, nose.geom.dim, angle, 1);
   /* Use for rendering sattelite with GFX.ATTR_STYLE */
   // const cx = nose.geom.pos[0] - nose.geom.dim[0] 
   // const cy = nose.geom.pos[1] - nose.geom.dim[1]
   /* Use for rendering sattelite without GFX.ATTR_STYLE */
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
   // snake.rotation.amt = angle;

}


function Animation_scale_up_run(params) {

   const snake = params.snake;

   // if(params.body_mesh_idx === 0) snake.in_scale_animation = true;
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







   /*******************************************************************************************/
   // Nose move with the scale

   if (bodyidx === 0) {

      const nose = params.nose;
      nose.geom.AddWposXY(nose.gfx, res * .5 * snake.vel[0], res * .5 * snake.vel[1]);
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


   // const prev_body = snake.body.buffer[bodyidx-1];
   // const prev_body_has_stoped_scale_up = (prev_body===undefined) ? true : ((prev_body.in_scale_up_animation===false) ? true : false);
   // const prev_body_has_stoped_scale_up = (prev_body===undefined) ? true : ((prev_body.in_scale_up_animation===false) ? true : false);
   const prev_body_has_stoped_scale_up = true;



   // While the scaled mesh is less than the max scaled constant, continue scaling
   // if(body.mesh.geom.dim[0] < body.size * body.scale_factor) return true;
   if (prev_body_has_stoped_scale_up === false) {
      return true;
   }
   // else if (body.mesh.geom.dim[0] < body.size * body.scale_factor)
   else if (body.mesh.geom.dim[0] < body.size * snake.scale_factor)
      return true;
   else {
      body.in_scale_up_animation = false;
      // console.log('STOP:', body.idx)
      return false;
   }

}

function Animation_scale_up_stop(params) {

   const snake = params.snake;
   Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); /*Callback_animations_print_size();*/
   snake.body.buffer[params.body_mesh_idx].t = 0.0;
   snake.body.buffer[params.body_mesh_idx].prev_slope = Logarithmic_interpolation(0.0, snake.init_slope) + 1;
   // snake.body.buffer[params.body_mesh_idx].prev_slope = Logarithmic_interpolation(0.01, .1) +1;

   return false;
}


function Animation_scale_down_run(params) {

   const snake = params.snake;
   const bodyidx = params.body_mesh_idx;
   const body = snake.body.buffer[bodyidx];



   // Update 
   const mod = 0;
   // body.t += snake.step*.7; // HACK: Give a little extra time to scaledown
   body.t += snake.step; 
   const slope = Logarithmic_interpolation(body.t, snake.init_slope - mod) + 1;

   // const res = (slope - body.prev_slope)*(body.mesh.idx+100); // Move faster on gerater mesh index
   // const res = (slope - body.prev_slope);
   const res = (slope - body.prev_slope) * 100;
   body.prev_slope = slope;


   // Run scale down function until the snake body reaches the default size
   if (body.mesh.geom.dim[0] - res > body.size) {
   // if (body.mesh.geom.dim[0]- res > (body.size + snake.start_next_anim)) {

      body.mesh.geom.dim[0] -= res;
      body.mesh.geom.dim[1] -= res;
      body.mesh.geom.AddDimXY(body.mesh.gfx, -res, -res);
      Gl_add_dim_xy(body.mesh.gfx, -res, -res)

      // const posx =  (calc_size-last_mesh.geom.dim[0]);


      body.mesh.mat.style.rcorners = body.mesh.geom.dim[0];
      Gl_set_attr_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);


      body.glow_intensity -= snake.glow_intensity_step;
      // Gl_set_glow_intensity(body.mesh.gfx, body.glow_intensity);


      /*******************************************************************************************/
      // Nose move with the scale
      if (bodyidx === 0) {
         const nose = params.nose;
         nose.geom.AddWposXY(nose.gfx, -res * .5 * snake.vel[0], -res * .5 * snake.vel[1]);
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

function Animation_scale_down_stop(params) {

   const snake = params.snake;
   if (params.body_mesh_idx === snake.body.boundary) {

      const section = params.section;
      const last_elem_idx = snake.body.boundary;
      const last_mesh = snake.body.buffer[last_elem_idx].mesh;


      // Calc the axis vector of the 2 last body meshes, and set the position of the new body mesh to that axis
      const second_last_mesh = snake.body.buffer[last_elem_idx - 1].mesh;
      const axis = [
         last_mesh.geom.pos[0] - second_last_mesh.geom.pos[0],
         last_mesh.geom.pos[1] - second_last_mesh.geom.pos[1],
      ];

      let posx = last_mesh.geom.pos[0] + axis[0];
      const posy = last_mesh.geom.pos[1] + axis[1];

      // Calculate body size according to body mesh index (the greater the index the smaller the size)
      let reduce_size = (snake.count - 1) * snake.reduce_mod;
      let calc_size = snake.size - reduce_size;
      if (calc_size < snake.min_size) {
         calc_size = snake.min_size;
         reduce_size = 0;
      }


      // const zpos = MAX_BODY_MESHES - snake.count;
      const zpos = 2;
      const style = { rcorners: calc_size, feather: snake.style.feather, border: snake.style.border };
      const col = GetSequencedColor(9);
      const body_mesh = Create_widget_section(_, _, [0, 0], [posx, posy, zpos], [calc_size, calc_size], col, 'body_mesh', style);
      section.AddItem(body_mesh);


      body_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, snake.style.feather);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS,);



      body_mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_mesh.gfx.vb.groupidx);
      body_mesh.Render();




      /*************************************************************************************************/
      const head = snake.body.buffer[0].mesh;
      head.GfxUniformSetAndUpdate('u_scale2', [snake.glow_scale_down_factor, 1]);


      const bodyidx = snake.body.Add(new Body_mesh_properties(body_mesh));
      snake.count++;
      body_mesh.SetName('body-' + bodyidx);

      const body = snake.body.buffer[bodyidx];
      body.idx = bodyidx; // Store the index for convinience
      body.reduce_size = reduce_size;
      body.size = calc_size;


      // STATE.loop.paused = true;
      snake.in_scale_animation = false;

      // INNEFFICIENCY: We only need to apply color to the new body, but we set color to all body meshes
      snake.Color_set_fn(snake)
   }

   // snake.in_scale_animation = false;
   const bodyidx = params.body_mesh_idx;
   snake.body.buffer[bodyidx].in_animation = false;
   snake.body.buffer[bodyidx].t = 0.0;
   snake.body.buffer[bodyidx].prev_slope = Logarithmic_interpolation(snake.body.buffer[bodyidx].t, snake.init_slope) + 1;

   return false;

}





function Snake_body_set_color(snake, params){


   let colidx = 0;
   for (let i=0; i <= snake.body.boundary; i++){

      const body = snake.body.buffer[i];

      // const color = params.colors[colidx++];
      const color = snake.color_fn_params.fn1[colidx++];

      body.mesh.SetColorRGB(color);

      // if(colidx > params.colors.length-1) colidx = 0
      if(colidx > snake.color_fn_params.fn1.length-1) colidx = 0
      
   }
}

function Snake_body_set_color_from_color_palete(snake){


   for (let i=0; i <= snake.body.boundary; i++){

      const body = snake.body.buffer[i];
      // body.mesh.SetColorRGB(color)

      const params = snake.color_fn_params.fn2;
      
      const wideness=params.wideness.val, color_offset=params.offset.val, brightness=params.brightness.val;
      const col = RGB(i, wideness, color_offset, brightness)
      body.mesh.SetColorRGB(col)
   }
}


function Options_callback(params) {

   
   if (params.params.menu_panel !== null) return;
   // if (STATE.loop.paused === false) STATE.loop.paused = true;
   // else STATE.loop.paused = false;
   
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
   const wideness_color_slider_val     = mn.color_slider.wideness.slider_val;
   const offset_color_slider_val       = mn.color_slider.offset.slider_val;
   const brightness_color_slider_val   = mn.color_slider.brightness.slider_val;




   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];
   let zpos = 10;
   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim, TRANSPARENCY(GREY[1], .5), 'section', style);
   // menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0] / 10);
   menu_panel.SetName('MenuOptionsPanel');

   params.params.menu_panel = menu_panel;


   zpos++;
   const tr = .4;


   
   const controls_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[0], .6), 'controls_section', );
   controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   menu_panel.AddItem(controls_section);

   controls_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
   controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);
   // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, controls_section.mesh_bufferidx, true);
   controls_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
   controls_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;



   /*************************************************************************************************/
   // Menu Options

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);


   // const menu_label = Create_widget_label(_, 'MENU', _, [0, 0, zpos], _, TRANSPARENCY(GREY[0], .8), WHITE, [dim[0] / 2 - pad * 2, 6], _, [10, 0, 2]);
   // // const menu_label = Create_widget_label(_, 'MENU', _, [0, 0, zpos], _, TRANSPARENCY(GREY[0], tr), WHITE, [pad, 6], _, [10, 0, 2] );
   // menu_label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // menu_label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   // menu_label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_label.geom.dim[1]);
   // menu_panel.AddItem(menu_label);


   const feather_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Feather',)
   feather_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   feather_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   feather_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   feather_slider.SetInitialValue(feather_slider_val);
   controls_section.AddItem(feather_slider);

   const speed_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Speed',)
   speed_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   speed_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   speed_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   speed_slider.SetInitialValue(speed_slider_val);
   controls_section.AddItem(speed_slider);

   const slope_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Slope',)
   slope_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slope_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   slope_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   slope_slider.SetInitialValue(slope_slider_val);
   controls_section.AddItem(slope_slider);

   const next_anim_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Next Animation Start',)
   next_anim_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   next_anim_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   next_anim_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   next_anim_slider.SetInitialValue(next_anim_slider_val);
   controls_section.AddItem(next_anim_slider);

   const reduce_size_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Reduce Size',)
   reduce_size_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   reduce_size_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   reduce_size_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   reduce_size_slider.SetInitialValue(reduce_size_slider_val);
   controls_section.AddItem(reduce_size_slider);

   const distance_factor_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Distance Ammount',)
   distance_factor_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   distance_factor_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   distance_factor_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   distance_factor_slider.SetInitialValue(distance_size_slider_val);
   controls_section.AddItem(distance_factor_slider);

   const max_scale_factor_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Scale Ammount',)
   max_scale_factor_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   max_scale_factor_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   max_scale_factor_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   max_scale_factor_slider.SetInitialValue(max_scale_factor_slider_val);
   controls_section.AddItem(max_scale_factor_slider);

   const anim_step_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Timer Step',)
   anim_step_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   anim_step_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   anim_step_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   anim_step_slider.SetInitialValue(anim_step_slider_val);
   controls_section.AddItem(anim_step_slider);

   /*****************************************************************************************************************************************/
   // Sliders for color change
   const color_switch = Create_widget_switch_simple(_, [0, 0, 1], 20, YELLOWR[8], _)
   color_switch.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   color_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   color_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 20);
   color_switch.SetName( 'Color Switch');
   controls_section.AddItem(color_switch);
   const color_switch_params = {
      snake:snake,
      // mnemonics:{transparency:0.5, hue:0.5, color:null},
   };
   color_switch.Bind(
      (params) => {

         const switch_mesh = params.target_mesh;
         const isOn = switch_mesh.isOn;
         const snake = params.params.snake;


         if(snake.Color_set_fn === Snake_body_set_color){

            snake.Color_set_fn = Snake_body_set_color_from_color_palete;
            snake.Color_set_fn(snake);
         }
         else {
            
            snake.Color_set_fn = Snake_body_set_color;
            snake.Color_set_fn(snake);
         }
         
         // if (isOn) {
            
         //    snake.Color_set_fn = Snake_body_set_color_from_color_palete;
         //    snake.Color_set_fn(snake);
         // }
         // else {
            
         //    snake.Color_set_fn = Snake_body_set_color;
         //    snake.Color_set_fn(snake);
         // }
      },
      null, color_switch_params, _,
   );

   const wideness_color_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Color Wideness',)
   wideness_color_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   wideness_color_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   wideness_color_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   wideness_color_slider.SetInitialValue(wideness_color_slider_val);
   controls_section.AddItem(wideness_color_slider);

   const offset_color_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'Color Offset',)
   offset_color_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   offset_color_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   offset_color_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   offset_color_slider.SetInitialValue(offset_color_slider_val);
   controls_section.AddItem(offset_color_slider);

   const brightness_color_slider = Create_widget_slider(_, [0, 0, 0], [dim[0] - pad * 2, zpos], TRANSPARENCY(GREY[0], tr), _, 'brightness',)
   brightness_color_slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   brightness_color_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   brightness_color_slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   brightness_color_slider.SetInitialValue(brightness_color_slider_val);
   controls_section.AddItem(brightness_color_slider);


   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, TRANSPARENCY(GREY[0], .8), WHITE[9], [dim[0] / 2 - pad * 2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   close_btn.SetName('close_btn');
   menu_panel.AddItem(close_btn);
   close_btn.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);

   // For slider must recalculate all slider children meshes position offsets
   // menu_label.TEMP_recalc(dim[0] - menu_label.geom.dim[0], pad);
   

   // controls_section.TEMP_recalc(dim[0] - controls_section.geom.dim[0], pad);
   // controls_section.geom.pos[0] = pad*2;
   // controls_section.geom.pos[1] = pad + menu_label.geom.dim[1]*2;
   
   // feather_slider.TEMP_recalc(dim[0] - feather_slider.geom.dim[0], 80);
   // speed_slider.TEMP_recalc(dim[0] - speed_slider.geom.dim[0], 140);
   // slope_slider.TEMP_recalc(dim[0] - slope_slider.geom.dim[0], 200);
   // next_anim_slider.TEMP_recalc(dim[0] - next_anim_slider.geom.dim[0], 260);
   // reduce_size_slider.TEMP_recalc(dim[0] - reduce_size_slider.geom.dim[0], 320);
   // max_scale_factor_slider.TEMP_recalc(dim[0] - max_scale_factor_slider.geom.dim[0], 380);
   // anim_step_slider.TEMP_recalc(dim[0] - anim_step_slider.geom.dim[0], 440);
   close_btn.TEMP_recalc(dim[0] - close_btn.geom.dim[0], dim[1] * 2 - close_btn.geom.dim[1] * 2 - pad);






   /*************************************************************************************************/
   // Render Section 
   // menu_panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   menu_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, false);
   menu_panel.GenGfxCtx();


   

   // controls_section.Calc_no_gfx_update();
   View_build_group_from_root_mesh(controls_section);
   controls_section.Calc_no_gfx_update();
   const center = (menu_panel.geom.dim[0] - controls_section.geom.dim[0]);
   controls_section.MoveNoGfxUpdate(center, pad); //pad += controls_section.geom.dim[1]*2 + 10;


   menu_panel.Render();

   // controls_section.AddWposXY(50, 50);
   // controls_section.TEMP_recalc(50, 50);


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
   Switch_set_listeners_priority(color_switch);
   Slider_set_listeners_priority(wideness_color_slider);
   Slider_set_listeners_priority(offset_color_slider);
   Slider_set_listeners_priority(brightness_color_slider);
   Listeners_set_priority(E.C, close_btn.listeners);


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
         console.log(val);
   
      }, { snake: snake, target_mesh: head, mnemonics: params.params.mnemonics.feather_slider });
   
   
      Slider_connect(speed_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.speed = val;
   
         params.clbk_params.mnemonics.slider_val = slider_val;
         console.log(val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.speed_slider });
   
   
      Slider_connect(slope_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.init_slope = val;
   
         params.clbk_params.mnemonics.slider_val = slider_val;
         console.log(val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.slope_slider });
   
   
      Slider_connect(next_anim_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.start_next_anim = val;
   
         params.clbk_params.mnemonics.slider_val = slider_val;
         console.log(val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.next_anim_slider });
   
   
      Slider_connect(reduce_size_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.reduce_mod = val;
   
         for (let i = 1; i <= snake.body.boundary; i++) {

            const body = snake.body.buffer[i];
            let reduce_size = (i) * val;
            let calc_size = snake.size - reduce_size;
            if(calc_size < snake.min_size) {
               calc_size = snake.min_size;
               // reduce_size = 0;
            }

            // body.mesh.geom.dim[0] = calc_size;
            // body.mesh.geom.dim[1] = calc_size;

            // body.size = calc_size;
            // body.mesh.geom.SetDimXY(body.mesh.gfx, calc_size, calc_size);
            // Gl_set_dim_xy(body.mesh.gfx, calc_size, calc_size);


            // // // body.mesh.mat.style.rcorners = calc_size;
            // Gl_set_attr_round_corners(body.mesh.gfx, calc_size)
         }
   
         params.clbk_params.mnemonics.slider_val = slider_val;
         // snake.in_scale_animation = false
         console.log(val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.reduce_size_slider });
   
   
      Slider_connect(distance_factor_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.distance_factor = val;
   
         params.clbk_params.mnemonics.slider_val = slider_val;
         // snake.in_scale_animation = false
         // console.log(val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.distance_factor_slider });
   
   
      // TODO: Set limits to slider val. below a body scale size threshold, the animation stops
      Slider_connect(max_scale_factor_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
   
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.scale_factor = val;
         console.log(val);
   
         params.clbk_params.mnemonics.slider_val = slider_val;
   
      }, { snake: snake, mnemonics: params.params.mnemonics.max_scale_factor_slider });
   
   
      Slider_connect(anim_step_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
         const val = Linear_interpolation(params.clbk_params.mnemonics.min, params.clbk_params.mnemonics.max, slider_val);
         snake.step = val;
   
         params.clbk_params.mnemonics.slider_val = slider_val;
         console.log(val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.anim_step_slider });
   
   
      Slider_connect(wideness_color_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
         
         const wideness = params.clbk_params.mnemonics.wideness;
         // const offset = params.clbk_params.mnemonics.offset;
         // const brightness = params.clbk_params.mnemonics.brightness;

         const wideness_val = Linear_interpolation(wideness.min, wideness.max, slider_val);
         // const offset_val = Linear_interpolation(offset.min, offset.max, offset.slider_val);
         // const brightness_val = Linear_interpolation(brightness.min, brightness.max, brightness.slider_val);
         
         wideness.val = wideness_val;
         // snake.color_fn_params.fn2.wideness.slider_val = wideness.slider_val

         snake.Color_set_fn(snake);
         // Snake_body_set_color_from_color_palete(snake, wideness_val, offset_val, brightness_val);
         
         wideness.slider_val = slider_val;
         console.log(wideness_val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });
   
   
      Slider_connect(offset_color_slider, (params, slider_val) => {
   
         const snake = params.clbk_params.snake;
            
         const offset = params.clbk_params.mnemonics.offset;
         const offset_val = Linear_interpolation(offset.min, offset.max, slider_val);
         
         offset.val = offset_val;
         snake.Color_set_fn(snake);
         
         offset.slider_val = slider_val;
         // console.log(offset_val);
         
      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });
      
      
      Slider_connect(brightness_color_slider, (params, slider_val) => {
         
         // const snake = params.clbk_params.snake;
         // const wideness = params.clbk_params.mnemonics.wideness;
         // const offset = params.clbk_params.mnemonics.offset;
         // const brightness = params.clbk_params.mnemonics.brightness;
         
         // const wideness_val = Linear_interpolation(wideness.min, wideness.max, wideness.slider_val);
         // const offset_val = Linear_interpolation(offset.min, offset.max, offset.slider_val);
         // const brightness_val = Linear_interpolation(brightness.min, brightness.max, slider_val);
         
         // Snake_body_set_color_from_color_palete(snake, wideness_val, offset_val, brightness_val);
         
         // brightness.slider_val = slider_val;

         const snake = params.clbk_params.snake;
            
         const brightness = params.clbk_params.mnemonics.brightness;
         const brightness_val = Linear_interpolation(brightness.min, brightness.max, slider_val);
         
         brightness.val = brightness_val;
         snake.Color_set_fn(snake);
         
         brightness.slider_val = slider_val;
         console.log(brightness_val);
   
      }, { snake: snake, mnemonics: params.params.mnemonics.color_slider });

   }





   // Create event callback for when the close menu button has been pressed
   const evt_clbk_params = {
      evt_clbks: () => { params.params.menu_panel = null; },
   }

   menu_panel.CreateEventCallback(evt_clbk_params);


   // Create scroller
   const clean_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1]*2 + 10);
   const needs_scroller = (controls_section !== null) 
                        ? (controls_section.geom.dim[1] > clean_height) ? true : false 
                        : false;
   if(needs_scroller){ 


      // const scroller_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1]*2 + 10);
      // const scroller_component = Components_create_scroller_component(10, scroller_height, controls_section, 100);
      // Scoller_component_gengfx_and_render(scroller_component, controls_section, GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      // Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(controls_section.root_posidx, scroller_component.root_posidx);
      // Listeners_set_priority(E.C, scroller_component.listeners);
      // menu_panel.AddChildScrollerIdx(controls_section.scroller_comp_idx);

      // Scroller_component_calculate_handle_pos_dim(controls_section, scroller_component);
   

      // /**************************************************************************************************************************/
      // // Set scissor box
      // const mx = controls_section.mesh_bufferidx;
      // const my = scroller_component.mesh_bufferidx;
      // const mw = controls_section.mesh_bufferidx;
      // const mh = scroller_component.mesh_bufferidx;
      // Vertex_buffer_group_create_scissorbox(controls_section.gfx.vb.groupidx, mx, my, mw, mh);
      // const scrolled_section_text_mesh = controls_section.children.buffer[0].text_mesh
      // Vertex_buffer_group_create_scissorbox(scrolled_section_text_mesh.gfx.vb.groupidx, mx, my, mw, mh);
   
      // Unfortunately must Re-render the menu_panel for the clipping of the scroller to take place
      // Root_group_reset_gfxs(controls_section.root_bufferidx);
      // Root_group_rerender_from_root_reconstruct_listeners(controls_section.root_bufferidx);

      // Renderqueue_set_active(scroller_component.gfx.vb.groupidx, true);

   }

}


