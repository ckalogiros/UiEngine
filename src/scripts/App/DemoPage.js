"use strict";

import { Callback_animations_create } from "../Engine/Animations/CallbackAnimations.js";
import { Create_widget_button, Create_widget_close_btn, Create_widget_label, Create_widget_section, Create_widget_slider } from "../Engine/Core/CreateWidget.js";
import { View_build_group_from_root_mesh } from "../Engine/Core/Views/MeshBufferViews.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos, Screen_wpos_get_y } from "../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from "../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLUEL, GREEN, GREENR, GREY, ORANGER, TRANSPARENT, WHITE, YELLOW } from "../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_set_root_in_focus } from "../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Drawables/Operations/Recursions.js";
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from "../Engine/Drawables/Widgets/ScrollerComponent.js";
import { Listeners_set_priority } from "../Engine/Events/EventListeners.js";
import { Renderqueue_set_active } from "../Engine/Renderers/Renderer/RenderQueue.js";
import { Scene_camera_scroll_add, Scene_camera_scroll_set } from "../Engine/Scenes.js";
import { Vertex_buffer_group_create_scissorbox } from "../Graphics/Buffers/VertexBuffers.js";
import { Abs } from "../Helpers/Math/MathOperations.js";
import { App_reinitialize, App_reset } from "./App.js";
import { Clbk_animations_text_create_contols, Demo_animations, Demo_animations_text, Demo_animations_with_slider_slope } from "./Demo/DemoAnimations.js";
import { Demo_chain_link } from "./Demo/DemoChainLink.js";
import { Create_comet_glow_contols, Create_comet_particles, Create_comet_noise_contols, Create_glow_particles, Create_glow_particles_controls, Create_smoke_particles, Create_smoke_particles_controls, Create_explosion_particles, Create_explosion_particles_controls, } from "./Demo/DemoParticles.js";
import { Create_elastic_collisions_controls, Elastic_collisions, Sattelite_rotation } from "./Demo/DemoPhysics.js";
import { Demo_widgets, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_dropdown, Demo_widgets_scrolled_labels, Demo_widgets_sections } from "./Demo/DemoWidgets.js";
import { Game_snake } from "./Demo/Games/Snake/Snake.js";
import { Board_rotations } from "./Demo/DemoBoardRotations.js";
import { Tetris, Tetris_reset } from "./Demo/Games/Snake/Tetris.js";





let bit = 0x1;
// const category_welcome = {name:'Widgets', id:bit};

const category_widgets = {name:'Widgets', id:bit};

const category_particles = {name:'Particles', id:bit<<=0x1};
const subcategory_comet = {name:'Comet', id:bit<<=0x1};
const subcategory_glow = {name:'Glow', id:bit<<=0x1};
const subcategory_smoke = {name:'Smoke', id:bit<<=0x1};
const subcategory_explosion = {name:'Explosion', id:bit<<=0x1};

const category_physics = {name:'Physics', id:bit<<=0x1};
const subcategory_elastic_collisions = {name:'Elastic Collisions', id:bit<<=0x1};
const subcategory_perimetric_rotation = {name:'Perimetric Rotation', id:bit<<=0x1};
const subcategory_velocity_verlet = {name:'Velocity Verlet', id:bit<<=0x1};

const category_animations = {name:'Animations', id:bit<<=0x1};
const subcategory_animations1 = {name:'Animations1', id:bit<<=0x1};
const subcategory_animations2 = {name:'Animations2', id:bit<<=0x1}; // 2048
const subcategory_animations_text = {name:'AnimationsText', id:bit<<=0x1}; // 2048
const subcategory_rotating_rects = {name:'Rotating Rectangles', id:bit<<=0x1};

const category_in_practise = {name:'In Practise', id:bit<<=0x1};
const subcategory_snake = {name:'Snake', id:bit<<=0x1};
const subcategory_tetris = {name:'Tetris', id:bit<<=0x1};
// const subcategory_rotating_rects = {name:'Rotating Rectangles', id:bit<<=0x1};







function Bind_menu_button(btn, params, any_id, id){

   btn.Bind(
      (params) => {

         const demo_id = params.params.mnemonics.demo_id;

         if((demo_id & any_id)===0){
            
            App_reset(); // Reset all 
            Scene_camera_scroll_set(_, 0);
            App_reinitialize();

            // Create new page
            Demo_page(id);
            params.params.mnemonics.demo_id = id;
         }
         return false;
      }, _, {mnemonics:params.mnemonics}, _,
   );
}






// SHADER UNIFORMS: Distance
// SHADER UNIFORMS: Brightness
// SHADER UNIFORMS: Intensity
// SHADER UNIFORMS: Particle Scale
// Gravity
// Acceleration
// Deccelerarion
// Set Emitter X Position
// Set Emitter Y Position


const comet_noise_slider_values = new Float32Array([0, 0, 0, .12]);
const glow_slider_values =      new Float32Array([0.36, 1, 0.12, 0.2, .48, .59, .19, 0.5, 0.4, 0.05, 0.05, 0.55]);
// const explosion_slider_values = new Float32Array([0.1,  0, 0.1, 0.02, .5,  .5,  .6,  .5,  .5, ]);
const explosion_slider_values = new Float32Array([0.1,  0, 0.1, 0.03, .5,  .2,  .5,  .5,  .5, ]);
const comet_glow_slider_values = new Float32Array([0, 0, 0.08, 0.1]);





export function Demos_welcome_menu() {


   const dim = [
      (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
      (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
   ];

   let zpos = 10;
   const r_corners = 12;
   
   // const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], .9), 'section', );
   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [20,20], [VIEWPORT.WIDTH/2, VIEWPORT.HEIGHT/2, 10], [0,0], TRANSPARENCY(GREY[3], .9), 'section', );
   menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   menu_panel.SetName('MenuLoadPanel');
   
   menu_panel.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;

   zpos++;




   /*************************************************************************************************/
   // Menu Options

   
   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH/2-10) - dim[0]);
   let log = (dif>0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (30 * log)
   
   const btn_col = TRANSPARENCY(GREEN[5], .8);
   const tr = .3;
   const col_inner = GREY[0];

   // const welcome_panel = Create_widget_section(_, _, [0,30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[5], .9), 'section', );
   const welcome_panel = Create_widget_section(_, _, [10,10], [0, 0, 10], [0,0], TRANSPARENCY(GREEN[5], .9), 'section', );
   welcome_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   welcome_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   welcome_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   menu_panel.AddItem(welcome_panel);
   
   {
      const col = BLUEL[7];
      // const welcome = Create_widget_label(_, 'Welcome,', _, _, _, TRANSPARENT, WHITE, [11, 6], _, _, TEXTURES.CONSOLAS_32px);
      const welcome = Create_widget_label(_, 'Welcome', _, _, 50, TRANSPARENT, WHITE, [11, 0], _, _, TEXTURES.MSDF_CONSOLAS_1024);
      welcome.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      welcome.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      welcome.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 31);
      welcome_panel.AddItem(welcome);
   }

   {
      const text = `to my WebGL Portfolio.
This project showcases my custom WebGL rendering engine,
designed to produce mainly 2D graphics, as well as 3D,
interactive UI widgets, simple dynamic particle system,
and simple animations.
It's a testament to my passion for graphics programming
and my dedication to performance-driven design.
Explore the demos and discover the possibilities!`;
      const col = GREY[7];
      const welcome = Create_widget_label(_, text, _, _, _, TRANSPARENCY(col, .1), WHITE, [11, 6], _, _, TEXTURES.CONSOLAS_20px);
      // const welcome = Create_widget_label(_, text, _, _, 20, TRANSPARENCY(col, .9), WHITE, [11, 6], _, _, TEXTURES.MSDF_COMIC_1024);
      welcome.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      welcome.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 3);
      welcome.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 12);
      welcome_panel.AddItem(welcome);

   }

   
   welcome_panel.options = SECTION.RESIZE_PARENT|SECTION.VERTICAL;
   // welcome_panel.options = SECTION.RESIZE_PARENT|SECTION.VERTICAL|SECTION.INHERIT|SECTION.HORIZONTAL_CENTER;
   
   
   
   
   /*******************************************************************************************/
   // Start Game button
   // const continue_btn = Create_widget_close_btn(_, menu_panel, 'Continue', [0, 0, zpos], 30, ORANGER[8], WHITE, [10, 10], _, _, TEXTURES.CONSOLAS_32px);
   const continue_btn = Create_widget_close_btn(_, menu_panel, 'Continue', [0, 0, zpos], 24, ORANGER[8], WHITE, [10, 10], _, _, TEXTURES.MSDF_COMIC_1024);
   continue_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   continue_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   continue_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   continue_btn.SetName('continue_btn');         
   menu_panel.AddItem(continue_btn);
   
   
   
   /*************************************************************************************************/
   // Render Menu 
   // menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, menu_panel.mesh_bufferidx, true);
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   menu_panel.Calc_no_gfx_update();

   menu_panel.MoveNoGfxUpdate(-menu_panel.geom.dim[0], -menu_panel.geom.dim[1]);

   // welcome_panel.MoveNoGfxUpdate( 
   //    (menu_panel.geom.pos[0]-welcome_panel.geom.pos[0]) + (menu_panel.geom.dim[0]-welcome_panel.geom.dim[0]), 
   //    (menu_panel.geom.pos[1]-welcome_panel.geom.pos[1]) + (menu_panel.geom.dim[1]*2-(welcome_panel.geom.dim[1]*2+10)), 
   // );
   menu_panel.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);
   
   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button
   const evt_clbk_params = {
      evt_clbks: ()=>{ 

         /*************************************************************************************************/
         // Create Tetris Game Loop
         const params = {
            // section: section_,
         }
         Demo_page();
      }, 
   }

   menu_panel.CreateEventCallback(evt_clbk_params);
   
}

// export function Demo_page(create_demo_id = category_widgets.id) {
export function Demo_page(create_demo_id = subcategory_snake.id) {

   let comet_particles_struct = null;
   let glow_particles_struct = null;
   let explosion_particles_struct = null;
   let smoke_particles_struct = null;
   let ellastic_collisions_struct = null;
   let animations_text_struct = null;
   let snake_struct = null;


      
   const slider_dim = [100, 12];
   // Create Slider for controling the uniform 'Distance'
   const slider_distance = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Distance');
   // Create Slider for controling the uniform 'Smoothness'
   const slider_smoothness = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Smoothness');
   // Create Slider for controling the uniform 'Intensity'
   const slider_intensity = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Intensity');









   const pad = 10;

   /****************************************************************************************************************************************************/
   // Create the load demo button

   const window_menu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [pad, pad], [0, 0, 0], [VIEWPORT.WIDTH/2 - pad-1, 0], TRANSPARENCY(GREY[5], 1.),);
   window_menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   window_menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   window_menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
   window_menu.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, true); // Create fake event so we can set the focus on any window_menu child.
   window_menu.SetName('window_menu');




   /*******************************************************************************************/
   // Load menu button
   const Load_menu_btn = Create_widget_button(_, 'Demos', _, [0, 0, 1], 20, GREEN[7], WHITE, [8, 8], .5);
   Load_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Load_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   Load_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // Load_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, Load_menu_btn.geom.dim[1]);
   Load_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   window_menu.AddItem(Load_menu_btn);

   // Setup Load Menu Panel callback on lod button click
   const load_clbk_params = { 

      menu_panel:null, // A pointer to the future created menu panel
      Create_menu_items_clbk:Create_menu_items_demos,
      mnemonics:{ demo_id:create_demo_id, }, // Remember variable values between different pages
   }; 
   
   Load_menu_btn.Bind(
      // Load_menu_callback,
      Create_menu_popup,
      _, load_clbk_params, _,
   );

   


   

   /*********************************************************************************************************************************************/
   // Create Demos Functions

   let total_height = 80; 
   const info_ui = Debug_info_ui_static(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
   total_height += info_ui.geom.dim[1] * 2 + 10; // Space for the debug_info ui

   /*****************************************************************************************************************************/
   // Widgets
   if (create_demo_id & category_widgets.id) { // Demos Widgets

      const pad = 50;

      /* section/rect move */
      const sections = Demo_widgets_sections(_, [0, total_height], slider_distance, slider_smoothness, slider_intensity);
      total_height += sections.geom.dim[1] * 2 + pad;


      /* Button Switces  Slider */
      const widgets = Demo_widgets(_, [0, total_height,], slider_distance, slider_smoothness, slider_intensity);
      total_height += widgets.geom.dim[1] * 2 + pad;


      /* scrolling */
      const scroller = Demo_widgets_scrolled_labels(_, [0, total_height], _, slider_distance, slider_smoothness, slider_intensity);
      total_height += scroller.geom.dim[1] * 2 + pad;
      
      
      /* Colorpicker */
      const colorpicker = Demo_widgets_colorpicker_demo_with_info(_, total_height);
      total_height += colorpicker.geom.dim[1] * 2 + pad;


      /* dropdown - move - hover */
      const dp = Demo_widgets_dropdown(_, [0, total_height], slider_distance, slider_smoothness, slider_intensity)
      total_height += dp.geom.dim[1] * 2 + pad;


      /* Coloring per vertex */

      /* Resizable widgets */

   }
   /*****************************************************************************************************************************/
   // Particles
   else if (create_demo_id & (category_particles.id|subcategory_comet.id)) { // Demo Particles - Ball tail particles 

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_paricles_demo, subcategory_comet.id, window_menu);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      comet_particles_struct  = Create_comet_particles(0, total_height, _, _, 1, ROOT_WIDGETS.CREATE_ROOT, false);

      comet_particles_struct.controls_section = Create_comet_noise_contols(comet_particles_struct.noise_particles_buffer, TRANSPARENCY(GREY[1], .6), comet_noise_slider_values);
      const comet_glow_contols = Create_comet_glow_contols(comet_particles_struct.glow_particles_buffer, TRANSPARENCY(GREY[1], .6), comet_glow_slider_values);
      for(let i = 0; i < comet_glow_contols.length; i++){
         comet_particles_struct.controls_section.push(comet_glow_contols[i]);
      }
      
   }
   else if (create_demo_id & subcategory_glow.id) { // Demo Particles - Glow particles 
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_paricles_demo, create_demo_id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      glow_particles_struct  = Create_glow_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false);

      glow_particles_struct.controls_section = Create_glow_particles_controls(glow_particles_struct.emitter, .2, _, glow_slider_values);


   }
   else if (create_demo_id & subcategory_explosion.id) { // Demo Particles - Glow particles 
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_paricles_demo, create_demo_id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      // explosion_particles_struct  = Create_explosion_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, 32);
      explosion_particles_struct  = Create_explosion_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, 256);

      explosion_particles_struct.controls_section = Create_explosion_particles_controls(explosion_particles_struct.emitter, .2, _, explosion_slider_values);


   }
   else if (create_demo_id & subcategory_smoke.id) { // Demos Particles - Smoke particles
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_paricles_demo, create_demo_id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      smoke_particles_struct = Create_smoke_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false);
      Create_smoke_particles_controls(smoke_particles_struct.emitter, );
   }
   /*****************************************************************************************************************************/
   // Physics
   else if (create_demo_id & (category_physics.id|subcategory_elastic_collisions.id)) { // Demos Physics
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_physics_demo, subcategory_elastic_collisions.id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      ellastic_collisions_struct = Elastic_collisions(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, false);

   }
   else if (create_demo_id & subcategory_perimetric_rotation.id) { // Demos Physics
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_physics_demo, create_demo_id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      total_height += Sattelite_rotation(0, total_height);

   }
   else if (create_demo_id & subcategory_velocity_verlet.id) { // Demos Physics - Chain link
      
            
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_physics_demo, create_demo_id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Demo_chain_link(_, total_height);

   }
   /*****************************************************************************************************************************/
   // Animations
   else if (create_demo_id & (category_animations.id|subcategory_animations1.id)) { // Demos Physics - Chain link
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_animations1.id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      total_height += Demo_animations(0, total_height);
      total_height += 20;

   }
   else if (create_demo_id & (subcategory_animations2.id)) { // Demos Physics - Chain link
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_animations2.id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Demo_animations_with_slider_slope(0, total_height);

   }
   else if (create_demo_id & (subcategory_animations_text.id)) { // Demos Physics - Chain link
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_animations_text.id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      animations_text_struct = Demo_animations_text(0, total_height, false);

   }
   else if (create_demo_id & (subcategory_rotating_rects.id)) { // Demos Physics - Snake
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_rotating_rects.id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Board_rotations(0, total_height, ROOT_WIDGETS.CREATE_ROOT);
      
      total_height += 20;

   }
   /*****************************************************************************************************************************/
   // In Practise
   else if (create_demo_id & (category_in_practise.id|subcategory_snake.id)) { // Demos Physics - Snake
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_in_practise_demo, subcategory_snake.id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      snake_struct = Game_snake(total_height, false);
      total_height += 20;

   }
   else if (create_demo_id & (subcategory_tetris.id)) { // Demos Physics - Snake
      
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_in_practise_demo, subcategory_tetris.id);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Tetris_reset();
      Tetris(ROOT_WIDGETS.CREATE_ROOT, 0, total_height, true, subcategory_tetris.id);
      
      total_height += 20;

   }



   /*******************************************************************************************/
   // Options menu button
   
   const options_menu_btn = Create_widget_button(_, 'Options', _, [0, 0, 1], 20, GREENR[7], WHITE, [8, 8], .5);
   options_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   options_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   options_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // options_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, options_menu_btn.geom.dim[1]);
   options_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   window_menu.AddItem(options_menu_btn);

   // Setup Load Menu Panel callback on load button click
   const options_clbk_params = { 

      menu_panel:null, // A pointer to the future created menu panel
      mnemonics:{
         demo_id:create_demo_id,
         comet_noise_slider_values:comet_noise_slider_values,
         comet_glow_slider_values:comet_glow_slider_values,
         glow_slider_values:glow_slider_values,
         explosion_slider_values:explosion_slider_values,
      }, // Remember variable values between different pages
      comet_particles_struct:comet_particles_struct,
      glow_particles_struct:glow_particles_struct,
      explosion_particles_struct:explosion_particles_struct,
      smoke_particles_struct:smoke_particles_struct,
      ellastic_collisions_struct:ellastic_collisions_struct,
      animations_text_struct:animations_text_struct,
      snake_struct:snake_struct,
   }; 
   
   options_menu_btn.Bind(
      Options_menu_callback,
      _, options_clbk_params, _,
   );

   // window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
   window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION;;


   /*******************************************************************************************/
   // Render Menu Bar
   {
      // window_menu.AddItem(shade_menu_btn);
   
      // window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
      // window_menu.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
      // window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
   
      window_menu.GenGfxCtx();
      window_menu.options = SECTION.HORIZONTAL|SECTION.RESIZE_PARENTY;
      window_menu.Calc_no_gfx_update();
      window_menu.Render()
      Root_group_activate_all_vbs_in_renderqueue(window_menu.root_bufferidx);
   
      window_menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, window_menu.gfx.vb.groupidx)
   
      Construct_listen_events_from_mesh_tree(window_menu)
      Construct_listen_events_relations_from_mesh_tree(window_menu);
      
   
      // View_build_group_from_root_mesh(shade_menu_btn);
   }
   
   
   
   /****************************************************************************************************************************************************/
   { // Create the button for going to the top

      const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, '^', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 10], _, GREY[4], GREEN[9], [12, 7], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, btn.geom.dim[1]);
      
      btn.Bind(
         () => {

            Callback_animations_create( // Scroll Up
               () => { // Run Animation

                  const unif_wpos = Screen_wpos_get_y();
                  if (unif_wpos < 0) {

                     const ypos = unif_wpos / 2;
                     Scene_camera_scroll_add(_, -ypos/2);
                     return true;
                  }

                  return false;
               },
               () => { // Stop Animation
                  return false;
               },
            );
         },
         _, _, _,
      );

      btn.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
      btn.GenGfxCtx();
      btn.Render()
      Root_group_activate_all_vbs_in_renderqueue(btn.root_bufferidx);

      btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx)
      
      Construct_listen_events_from_mesh_tree(btn)
      Construct_listen_events_relations_from_mesh_tree(btn);

      Listeners_set_priority(E.C, btn.listeners);
     
   }


   // Set focus
   Mesh_set_root_in_focus(info_ui.root_bufferidx);
   Mesh_set_root_in_focus(window_menu.root_bufferidx);
   // Mesh_set_root_in_focus(info_ui.root_bufferidx, info_ui.scroller_comp_idx);

}



/**This is a generic function for creating this type of menu. The menu items are created from a callback function passed in 'params' from the caller function */
function Create_menu_popup(params){

   if (params.params.menu_panel !== null) return;

   const dim = [
      (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
      (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
   ];

   let zpos = 10;
   
   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], .9), 'section', );
   menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0]/10);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   menu_panel.SetName('MenuLoadPanel');
   
   menu_panel.options = SECTION.VERTICAL|SECTION.INHERIT|SECTION.HORIZONTAL_CENTER;
   // menu_panel.options = SECTION.VERTICAL|SECTION.INHERIT|SECTION.HORIZONTAL_CENTER|SECTION.EXPAND;
   
   params.params.menu_panel = menu_panel;


   zpos++;




   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREY[1], .8);

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH/2-10) - dim[0]);
   let log = (dif>0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log)

   // let ypos = 100;



   // Setup Load Menu Panel callback on lod button click
   const load_clbk_params = { 
      mnemonics:params.params.mnemonics, // Remember variable values between different pages
   };
   const menu_items = params.params.Create_menu_items_clbk(load_clbk_params);
   const len = menu_items.length;
   for(let i=0; i<len; i++){

      menu_panel.AddItem(menu_items[i]); 
   }


   



   /*******************************************************************************************/
   // Close button
   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, btn_col, WHITE, [dim[0]/2-pad*2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.SetName('close_btn');         
   menu_panel.AddItem(close_btn);


   
   
   /*************************************************************************************************/
   // Render Menu 
   // menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   menu_panel.Calc_no_gfx_update();
   close_btn.MoveNoGfxUpdate( 0, (dim[1]*2) - (close_btn.GetPosY()-menu_panel.GetPosY()));
   menu_panel.Render();
   

   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);
   
   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button
   const evt_clbk_params = {
      evt_clbks: ()=>{ params.params.menu_panel = null; }, 
   }

   menu_panel.CreateEventCallback(evt_clbk_params);
}



/**This is a generic function for creating this type of menu. The menu items are created from a callback function passed in 'params' from the caller function */
function Create_menu_horizontal_buttons(x=0, y=0, Create_menu_items_callback, demo_id, parent_menu){


   const dim = [
      (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
      (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
   ];

   let zpos = 10;
   
   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 10], [0,0], TRANSPARENCY(YELLOW[9], .9), 'section', );
   menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   menu_panel.SetName('HorizontalMenuLoadPanel');
   
   menu_panel.options = SECTION.HORIZONTAL|SECTION.INHERIT|SECTION.RESIZE_PARENT;
   
   zpos++;




   /*************************************************************************************************/
   // Menu Options

   // Setup Load Menu Panel callback on lod button click
   const params = { 

      menu_panel:menu_panel, // A pointer to the future created menu panel
      mnemonics:{ demo_id:demo_id, }, // Remember variable values between different pages
   }; 
   const menu_items = Create_menu_items_callback(params, demo_id);
   const len = menu_items.length;
   for(let i=0; i<len; i++){

      // menu_items[i].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_PARENT_DSC, parent_menu.mesh_bufferidx, true);
      menu_panel.AddItem(menu_items[i]); 
   }



   
   
   /*************************************************************************************************/
   // Render Menu 
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   menu_panel.Calc_no_gfx_update();
   menu_panel.Render();

   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);
   
   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);


   return menu_panel;
}




function Options_menu_callback(params){


   if (params.params.menu_panel !== null) return;

   const demo_id = params.params.mnemonics.demo_id;

   // HACK: Unfortunately the implementation of the snake's options need re-implementation in order to match this functions code structure.
   if((demo_id & category_in_practise.id) || (demo_id & subcategory_snake.id))
   {

      const Snake_options_callback = params.params.snake_struct.Snake_options_callback;
      const options_clbk_params = {
         params:params.params.snake_struct.options_clbk_params,
         snake_struct_controls_section:null, // A place holder for the contols section created by the snake file 
      };

      Snake_options_callback(options_clbk_params);

      return;
   
   }

   const dim = [
      (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
      (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
   ];

   let zpos = 10;



   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREY[1], .8);
   const tr = .7;
   
   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH/2-10) - dim[0]);
   let log = (dif>0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);

   let ypos = 20;



   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], tr), 'section', );
   menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0]/10);
   // menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   menu_panel.SetName('MenuOptionsPanel');
   
   params.params.menu_panel = menu_panel;
   

   let controls_section = null;


   // Create items for the menu 'options'.
   if(demo_id & subcategory_comet.id)
   {

      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS3,
      }
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
      
      
      /****************************************************************************************************************/
      // 
      const comet_glow  = params.params.comet_particles_struct.glow_particles_buffer;
      const comet_noise = params.params.comet_particles_struct.noise_particles_buffer;
      const comet_noise_slider_values = params.params.mnemonics.comet_noise_slider_values;
      const comet_glow_slider_values = params.params.mnemonics.comet_glow_slider_values;
      
      let comet_contols = params.params.comet_particles_struct.controls_section;
      
      const scale_down = .2;
      const comet_slider_values = params.params.mnemonics.glow_slider_values;

      if(comet_contols === null){
         comet_contols = Create_comet_noise_contols(comet_noise, TRANSPARENCY(GREY[1], .6), comet_noise_slider_values);
         const comet_glow_contols = Create_comet_glow_contols(comet_glow, TRANSPARENCY(GREY[1], .6), comet_glow_slider_values, scale_down);
         for(let i = 0; i < comet_glow_contols.length; i++){
            comet_contols.push(comet_glow_contols[i]);
         }
      }

      const len = comet_contols.length;
      for(let i = 0; i < len; i++){
         slider_section.AddItem(comet_contols[i]);
      }
      
      
      menu_panel.AddItem(slider_section);
      
      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW ;
      
      controls_section = slider_section;
      
   }
   if(demo_id & subcategory_glow.id)
   {

      const emitter  = params.params.glow_particles_struct.emitter;
      let glow_particles_contols  = params.params.glow_particles_struct.controls_section;
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS3,
      }
      
      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      // slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      
      
      
      const scale_down = .2;
      const glow_slider_values = params.params.mnemonics.glow_slider_values;
      if(glow_particles_contols === null){
         glow_particles_contols = Create_glow_particles_controls(emitter, scale_down, _, glow_slider_values);
      }
      for(let i = 0; i < glow_particles_contols.length; i++){
         slider_section.AddItem(glow_particles_contols[i]);
      }



      menu_panel.AddItem(slider_section);

      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


      controls_section = slider_section;

   }
   if(demo_id & subcategory_explosion.id)
   {

      const emitter  = params.params.explosion_particles_struct.emitter;
      let explosion_particles_contols  = params.params.explosion_particles_struct.controls_section;
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS3,
      }
      
      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      // slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      
      
      
      const scale_down = .2;
      const explosion_slider_values = params.params.mnemonics.explosion_slider_values;
      if(explosion_particles_contols === null){
         explosion_particles_contols = Create_explosion_particles_controls(emitter, scale_down, _, explosion_slider_values);
      }
      for(let i = 0; i < explosion_particles_contols.length; i++){
         slider_section.AddItem(explosion_particles_contols[i]);
      }



      menu_panel.AddItem(slider_section);

      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


      controls_section = slider_section;

   }
   if(demo_id & subcategory_smoke.id)
   {

      const emitter  = params.params.smoke_particles_struct.emitter;
      const controls  = params.params.smoke_particles_struct.controls_section;
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS3,
      }
      
      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      
      
      
      const scale_down = .2;
      const glow_slider_values = params.params.mnemonics.glow_slider_values;
      const glow_particles_contols = Create_smoke_particles_controls(emitter, );
      for(let i = 0; i < glow_particles_contols.length; i++){
         slider_section.AddItem(glow_particles_contols[i]);
      }



      menu_panel.AddItem(slider_section);

      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW ;


      controls_section = slider_section;

   }
   if((demo_id & subcategory_elastic_collisions.id) || demo_id & category_physics.id)
   {

      const ellastic_collisions_balls  = params.params.ellastic_collisions_struct.ellastic_collisions_balls;
      const mnemonics  = params.params.ellastic_collisions_struct.mnemonics;
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS3,
      }
      
      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      
      const ell_coll_params = {
         mnemonics: mnemonics,
      }
      const contols = Create_elastic_collisions_controls(ellastic_collisions_balls, GREY[2], [mnemonics.scale_down, .2], ell_coll_params)
      for(let i = 0; i < contols.length; i++){
         slider_section.AddItem(contols[i]);
      }



      menu_panel.AddItem(slider_section);

      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW ;


      controls_section = slider_section;

   }
   if(demo_id & subcategory_animations_text.id)
   {

      // const controls  = params.params.smoke_particles_struct.controls_section;
      const slope_params_pointer  = params.params.animations_text_struct.slope_params_pointer;
      const animation_properties  = params.params.animations_text_struct.animation_properties;
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS3,
      }
      
      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      
      
      
      const scale_down = .2;
      const glow_slider_values = params.params.mnemonics.glow_slider_values;
      const animation_text_contols = Clbk_animations_text_create_contols(slope_params_pointer, animation_properties);
      for(let i = 0; i < animation_text_contols.length; i++){
         slider_section.AddItem(animation_text_contols[i]);
      }



      menu_panel.AddItem(slider_section);

      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW ;


      controls_section = slider_section;
   
   }

   
   /*******************************************************************************************/
   // Create close button
   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, btn_col, WHITE, [dim[0]/2-pad*2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.SetName('close_btn');   
   close_btn.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   // close_btn.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC, menu_panel.mesh_bufferidx, true);
   menu_panel.AddItem(close_btn);

   // Must recalculate all children meshes position offsets
   close_btn.MoveNoGfxUpdate(dim[0] - close_btn.geom.dim[0] , dim[1]*2-close_btn.geom.dim[1]*2-pad);
   
   

   /*************************************************************************************************/
   // Render Section 
   // menu_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, false);
   menu_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, false);
   // menu_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, menu_panel.mesh_bufferidx, false);
   menu_panel.GenGfxCtx();
   
   // Build a group view of the scrolled section for the scroller
   if(controls_section !== null) {

      View_build_group_from_root_mesh(controls_section);
      controls_section.Calc_no_gfx_update();
      const center = (menu_panel.geom.dim[0] - controls_section.geom.dim[0]);
      controls_section.MoveNoGfxUpdate(center, ypos); ypos += controls_section.geom.dim[1]*2 + 10;

   }
   
   menu_panel.Render();

   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);
   
   
   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);
   if(controls_section !== null) controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);
   
   Listeners_set_priority(E.C, close_btn.listeners);
   

   // Create scroller
   const clean_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1]*2 + 10);
   const needs_scroller = (controls_section !== null) 
                        ? (controls_section.geom.dim[1] > clean_height) ? true : false 
                        : false;
   if(needs_scroller){ 


      const scroller_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1]*2 + 10);
      const scroller_component = Components_create_scroller_component(10, scroller_height, controls_section, 100);
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
   
      // Unfortunately must Re-render the menu_panel for the clipping of the scroller to take place
      Root_group_reset_gfxs(controls_section.root_bufferidx);
      Root_group_rerender_from_root_reconstruct_listeners(controls_section.root_bufferidx);

      Renderqueue_set_active(scroller_component.gfx.vb.groupidx, true);

   }




   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button to run
   const evt_clbk_params = {
      evt_clbks: ()=>{ 
         params.params.menu_panel = null; 
         if(params.params.glow_particles_struct !== null)
            params.params.glow_particles_struct.controls_section = null; 
         if(params.params.explosion_particles_struct !== null)
            params.params.explosion_particles_struct.controls_section = null; 
         if(params.params.comet_particles_struct !== null) 
            params.params.comet_particles_struct.controls_section = null; 
      }, 
   }

   menu_panel.CreateEventCallback(evt_clbk_params);
}



/**This is the callback function to create specific menu items. */
function Create_menu_items_demos(params){


   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;
   const btn_col = TRANSPARENCY(GREY[1], .8);


   /*******************************************************************************************/
   // Button 1
   const button1 = Create_widget_button(_, category_widgets.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   button1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   button1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   button1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(button1);

   Bind_menu_button(button1, params, category_widgets.id, category_widgets.id);
 


   /*******************************************************************************************/
   // Button 2
   const button2 = Create_widget_button(_, category_particles.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   button2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   button2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   button2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(button2);
   
   Bind_menu_button(button2, params, (category_particles.id|subcategory_comet.id|subcategory_glow.id|subcategory_smoke.id|subcategory_explosion.id), subcategory_glow.id);



   /*******************************************************************************************/
   // Button 3
   const button3 = Create_widget_button(_, category_physics.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   button3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   button3.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   button3.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(button3);

   Bind_menu_button(button3, params, (category_physics.id|subcategory_elastic_collisions.id|subcategory_perimetric_rotation.id|subcategory_velocity_verlet.id), category_physics.id);



   /*******************************************************************************************/
   // Button 4
   const button4 = Create_widget_button(_, category_animations.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   button4.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   button4.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   button4.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(button4);

   Bind_menu_button(button4, params, (category_animations.id|subcategory_animations1.id), category_animations.id);



   /*******************************************************************************************/
   // Button 5
   const button5 = Create_widget_button(_, category_in_practise.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   button5.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   button5.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   button5.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(button5);
   
   Bind_menu_button(button5, params, (category_in_practise.id), category_in_practise.id);



   return menu_items_array;
}


/*************************************************************************************************************************************************************/
/*************************************************************************************************************************************************************/
// Dedicated Functions For Creating Items For The Menus

function Create_menu_items_paricles_demo(params, demo_id){

   // if (params.menu_panel !== null) return;
   
   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;

   
   
   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_comet.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item1_btn = Create_widget_button(_, subcategory_comet.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c1, text_col, [15, 8], .5, _, font);
   item1_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item1_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item1_btn);

   Bind_menu_button(item1_btn, params, (subcategory_comet.id), subcategory_comet.id);



   /*******************************************************************************************/
   // Item 2 button
   const c2 = (demo_id & subcategory_glow.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item2_btn = Create_widget_button(_, subcategory_glow.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   item2_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item2_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_glow.id), subcategory_glow.id);



   /*******************************************************************************************/
   // Item 2 button
   const c3 = (demo_id & subcategory_explosion.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item3_btn = Create_widget_button(_, subcategory_explosion.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c3, text_col, [15, 8], .5, _, font);
   item3_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item3_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item3_btn);
   Bind_menu_button(item3_btn, params, (subcategory_explosion.id), subcategory_explosion.id);


   
   /*******************************************************************************************/
   //  Item 3 button
   const c4 = (demo_id & subcategory_smoke.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item4_btn = Create_widget_button(_, subcategory_smoke.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c4, text_col, [15, 8], .5, _, font);
   item4_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item4_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item4_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item4_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item4_btn);
   Bind_menu_button(item4_btn, params, (subcategory_smoke.id), subcategory_smoke.id);



   return menu_items_array;
}



function Create_menu_items_physics_demo(params, demo_id){

   // if (params.menu_panel !== null) return;
   
   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;

   
   
   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_elastic_collisions.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item1_btn = Create_widget_button(_, subcategory_elastic_collisions.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c1, text_col, [15, 8], .5, _, font);
   item1_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item1_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item1_btn);
   Bind_menu_button(item1_btn, params, (subcategory_elastic_collisions.id), subcategory_elastic_collisions.id);



   /*******************************************************************************************/
   // Item 2 button
   const c2 = (demo_id & subcategory_perimetric_rotation.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item2_btn = Create_widget_button(_, subcategory_perimetric_rotation.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   item2_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item2_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_perimetric_rotation.id), subcategory_perimetric_rotation.id);


   
   /*******************************************************************************************/
   //  Item 3 button
   const c3 = (demo_id & subcategory_velocity_verlet.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item3_btn = Create_widget_button(_, subcategory_velocity_verlet.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c3, text_col, [15, 8], .5, _, font);
   item3_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item3_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item3_btn);
   Bind_menu_button(item3_btn, params, (subcategory_velocity_verlet.id), subcategory_velocity_verlet.id);





   return menu_items_array;
}



function Create_menu_items_animations_demo(params, demo_id){

   // if (params.menu_panel !== null) return;
   
   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;

   
   
   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_animations1.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item1_btn = Create_widget_button(_, subcategory_animations1.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c1, text_col, [15, 8], .5, _, font);
   item1_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item1_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item1_btn);
   Bind_menu_button(item1_btn, params, (category_animations.id|subcategory_animations1.id), subcategory_animations1.id);
   
   
   /*******************************************************************************************/
   // Item 1 button
   const c2 = (demo_id & subcategory_animations2.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item2_btn = Create_widget_button(_, subcategory_animations2.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   item2_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item2_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_animations2.id), subcategory_animations2.id);
   
   
   /*******************************************************************************************/
   // Item 3 button
   const c3 = (demo_id & subcategory_animations_text.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item3_btn = Create_widget_button(_, subcategory_animations_text.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c3, text_col, [15, 8], .5, _, font);
   item3_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item3_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item3_btn);
   Bind_menu_button(item3_btn, params, (subcategory_animations_text.id), subcategory_animations_text.id);
   
   
   /*******************************************************************************************/
   // Item 4 button
   const c4 = (demo_id & subcategory_rotating_rects.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item4_btn = Create_widget_button(_, subcategory_rotating_rects.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c4, text_col, [15, 8], .5, _, font);
   item4_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item4_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item4_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item4_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item4_btn);
   Bind_menu_button(item4_btn, params, (subcategory_rotating_rects.id), subcategory_rotating_rects.id);







   return menu_items_array;
}



function Create_menu_items_in_practise_demo(params, demo_id){

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   // const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const font = TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;

   
   
   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_snake.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item1_btn = Create_widget_button(_, subcategory_snake.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c1, text_col, [15, 8], .5, _, font);
   item1_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item1_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item1_btn);
   Bind_menu_button(item1_btn, params, (category_in_practise.id|subcategory_snake.id), subcategory_snake.id);
   
   
   /*******************************************************************************************/
   // Item 2 button
   const c2 = (demo_id & subcategory_tetris.id) ? TRANSPARENCY(GREY[1], .4) : TRANSPARENCY(GREY[1], 1.);
   const item2_btn = Create_widget_button(_, subcategory_tetris.name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   item2_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   item2_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   item2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_tetris.id), subcategory_tetris.id);



   return menu_items_array;
}







