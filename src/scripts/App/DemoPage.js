"use strict";

import { Callback_animations_create } from "../Engine/Animations/CallbackAnimations.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_close_btn, Create_widget_label, Create_widget_slider } from "../Engine/Drawables/Widgets/Helpers/CreateWidget.js";
import { View_build_group_from_root_mesh } from "../Engine/Core/Views/MeshBufferViews.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos, Screen_wpos_get_y } from "../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from "../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLUEL, GREEN, GREENR, GREY, ORANGER, REDL, TRANSPARENT, WHITE, YELLOWR } from "../Engine/Drawables/Material/Colors.js";
import { Mesh_set_root_in_focus } from "../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Events/EventFunctions.js";
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from "../Engine/Drawables/Widgets/ScrollerComponent.js";
import { Listeners_set_priority } from "../Engine/Events/EventListeners.js";
import { Renderqueue_set_active, Renderqueue_set_priority_by_vb } from "../Engine/Renderers/Renderer/RenderQueue.js";
import { Scene_camera_scroll_add, Scene_camera_scroll_set } from "../Engine/Scenes.js";
import { Vertex_buffer_group_create_scissorbox } from "../Graphics/Buffers/VertexBuffers.js";
import { Abs } from "../Helpers/Math/MathOperations.js";
import { App_reinitialize, App_reset } from "./App.js";
import { Demo_clbk_animations_text_create_contols, Demo_animations, Demo_animations_text, Demo_animations_with_slider_slope, Demo_animations_ready_button_with_panel } from "./Demo/DemoAnimations.js";
import { Demo_chain_link } from "./Demo/DemoChainLink.js";
import { Create_comet_glow_contols, Create_comet_particles, Create_comet_noise_contols, Create_glow_particles, Create_smoke_particles, Create_smoke_particles_controls, Create_explosion_particles, Create_particles_controls } from "./Demo/DemoParticles.js";
import { Create_elastic_collisions_controls, Elastic_collisions, Sattelite_rotation } from "./Demo/DemoPhysics.js";
import { Demo_widgets, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_dropdown, Demo_widgets_explainer_info, Demo_widgets_msdf_text_rendering, Demo_widgets_scrolled_labels, Demo_widgets_sections } from "./Demo/DemoWidgets.js";
import { Game_snake } from "./Demo/Games/Snake/Snake.js";
import { Board_rotations } from "./Demo/DemoBoardRotations.js";
import { Tetris, Tetris_reset } from "./Demo/Games/Tetris/Tetris.js";
import { Arkanoid_free_buffers, Arkanoid_initialize, Arkanoid_reset } from "./Demo/Games/Arkanoid/Arkanoid.js";
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_rect_default_properties, Style_slider_default_properties, Style_label_default_properties } from "../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Mesh_get_real_pos_y } from "../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_event_callback_create, Mesh_listener_create } from "../Engine/Drawables/Operations/MeshPropertiesFunctions.js";
import { Align_nested_sections_pre } from "../Engine/Drawables/Operations/AlignNestedSections.js";





let bit = 0x1;
// const category_welcome = {name:'Widgets', id:bit};

const category_widgets = { name: 'Widgets', id: bit };

const category_msdf_text = { name: 'Text Render', id: bit <<= 0x1 };

const category_particles = { name: 'Particles', id: bit <<= 0x1 };
const subcategory_comet = { name: 'Comet', id: bit <<= 0x1 };
const subcategory_glow = { name: 'Glow', id: bit <<= 0x1 };
const subcategory_smoke = { name: 'Smoke', id: bit <<= 0x1 };
const subcategory_explosion = { name: 'Explosion', id: bit <<= 0x1 };

const category_physics = { name: 'Physics', id: bit <<= 0x1 };
const subcategory_elastic_collisions = { name: 'Elastic Collisions', id: bit <<= 0x1 };
const subcategory_perimetric_rotation = { name: 'Perimetric Rotation', id: bit <<= 0x1 };
const subcategory_velocity_verlet = { name: 'Velocity Verlet', id: bit <<= 0x1 };

const category_animations = { name: 'Animations', id: bit <<= 0x1 };
const subcategory_animations_button = { name: 'Button Animations', id: bit <<= 0x1 };
const subcategory_animations1 = { name: 'Animations1', id: bit <<= 0x1 };
const subcategory_animations2 = { name: 'Animations2', id: bit <<= 0x1 }; // 2048
const subcategory_animations_text = { name: 'AnimationsText', id: bit <<= 0x1 }; // 2048
const subcategory_rotating_rects = { name: 'Rotating Rectangles', id: bit <<= 0x1 };

const category_in_practise = { name: 'In Practise', id: bit <<= 0x1 };
const subcategory_snake = { name: 'Snake', id: bit <<= 0x1 };
const subcategory_tetris = { name: 'Tetris', id: bit <<= 0x1 };
const subcategory_arkanoid = { name: 'Arkanoid', id: bit <<= 0x1 };
// const subcategory_rotating_rects = {name:'Rotating Rectangles', id:bit<<=0x1};


const close_btn_col = REDL[4];





function Bind_menu_button(btn, params, any_id, id, Unload_clbk_buffer = null) {

   btn.Bind(
      (params) => {

         const demo_id = params.params.mnemonics.demo_id;

         if ((demo_id & any_id) === 0) {

            if (Unload_clbk_buffer) {

               const len = Unload_clbk_buffer.length;
               for (let i = 0; i < len; i++) {

                  const unload_clbk = Unload_clbk_buffer[i];
                  if (unload_clbk && unload_clbk !== undefined) unload_clbk();
               }
            }

            App_reset(); // Reset all 
            Scene_camera_scroll_set(_, 0);
            App_reinitialize();

            // Create new page
            Demo_page(id);
            params.params.mnemonics.demo_id = id;
         }
         return false;
      }, _, { mnemonics: params.mnemonics, Unload_clbk_buffer: Unload_clbk_buffer }, _,
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
const comet_glow_slider_values = new Float32Array([1, 0, 0.1, 0.11]);
const glow_slider_values = _;
const glow_generic_controls_parameters = [.7, 1., .12];
const explosion_slider_values = new Float32Array([0.06, .5, 1., .5, .5, .5, .05, .05, .5]);
const explosion_generic_controls_parameters = new Float32Array([.37, 0., .18]);

// Shader parameters: Distance, Brightness, Intensity, Particle, Scale 
const smoke_slider_values_shader_parameters = new Float32Array([.71, .71, .78, .5,]);
// Transform/Physics parameters: Gravity , Acceleration , Deccelerarion , Set Emitter X Position , Set Emitter Y Position , Set Emitter Y Direction Y Up , Set Emitter Y Direction Y Down , Set Emitter Direction X Left
const smoke_slider_values_transform_parameters = new Float32Array([.48, .08, .48, .0, .5]);




export function Demos_welcome_menu() {


   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;
   const r_corners = 12;

   // const menu_panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [0,30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], .9), 'section', );
   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[20, 20], pos:[VIEWPORT.WIDTH / 2, VIEWPORT.HEIGHT / 2, 10], col:TRANSPARENCY(GREY[3], .9), name:'MenuLoadPanel',}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:r_corners, listener:{type:LISTEN_EVENT_TYPES.MOVE}});
   
   zpos++;
   
   
   
   
   /*************************************************************************************************/
   // Menu Options
   
   
   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (30 * log)
   
   const btn_col = TRANSPARENCY(GREEN[5], .8);
   const tr = .3;
   const col_inner = GREY[0];
   
   // const welcome_panel = Create_rect_mesh(_, _, [0,30], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[5], .9), 'section', );
   const welcome_panel = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 10], col:TRANSPARENCY(GREEN[5], .9), name:'section',}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:r_corners, });
   menu_panel.AddItem(welcome_panel);
   
   {
      const col = BLUEL[7];
      // const welcome = Create_widget_label(_, 'Welcome,', _, _, _, TRANSPARENT, WHITE, [11, 6], _, _, TEXTURES.CONSOLAS_32px);
      const welcome = Create_widget_label(Style_label_default_properties({text:'Welcome', col:TRANSPARENT, text_pad:[11, 0], texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:50}));
      Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:31, });
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
      const welcome = Create_widget_label(Style_label_default_properties({text:text, col:TRANSPARENCY(col, .1), text_pad:[11, 0], texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:50}));
      Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:12, });
      welcome_panel.AddItem(welcome);

   }


   welcome_panel.options = SECTION.RESIZE_PARENT | SECTION.VERTICAL;
   // welcome_panel.options = SECTION.RESIZE_PARENT|SECTION.VERTICAL|SECTION.INHERIT|SECTION.HORIZONTAL_CENTER;




   /*******************************************************************************************/
   // Start Game button
   const close_btn = Create_widget_close_btn(Style_button_default_properties({text:'CLOSE', target_mesh:menu_panel, pos:[0,0,zpos], col:ORANGER[8], text_pad:[dim[0] / 2 - pad * 2, 6], font_size:24, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:close_btn, enable_sdf_rect:close_btn.geom.dim[1], listener:{type:LISTEN_EVENT_TYPES.HOVER}})
   menu_panel.AddItem(close_btn);


   /*************************************************************************************************/
   // Render Menu 
   // menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, menu_panel.mesh_bufferidx, true);
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   Align_nested_sections_pre(menu_panel);
   // menu_panel.Calc_no_gfx_update();

   // menu_panel.MoveNoGfxUpdate(-menu_panel.geom.dim[0], -menu_panel.geom.dim[1]);

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
      evt_clbks: () => {

         /*************************************************************************************************/
         // Create Tetris Game Loop
         const params = {
            // section: section_,
         }
         Demo_page();
      },
   }

   Mesh_event_callback_create(menu_panel, evt_clbk_params);

}

export function Demo_page(create_demo_id = category_widgets.id) {
// export function Demo_page(create_demo_id = subcategory_glow.id) {
// export function Demo_page(create_demo_id = subcategory_animations1.id) {
// export function Demo_page(create_demo_id = subcategory_animations_button.id) {
// export function Demo_page(create_demo_id = subcategory_animations_text.id) {
// export function Demo_page(create_demo_id = subcategory_snake.id) {
// export function Demo_page(create_demo_id = subcategory_comet.id) {
// export function Demo_page(create_demo_id = subcategory_arkanoid.id) {

   let comet_particles_struct = null;
   let glow_particles_struct = null;
   let explosion_particles_struct = null;
   let smoke_particles_struct = null;
   let ellastic_collisions_struct = null;
   let animations_text_struct = null;
   let snake_struct = null;



   const slider_dim = [100, 12];
   // Create Slider for controling the uniform 'Distance'
   const slider_distance = Create_widget_slider(Style_slider_default_properties({pos:[0, 0, 10], dim:slider_dim, col:GREY[3], name:'Distance'}));
   Widget_gfx_ready_enable({mesh:slider_distance, enable_sdf_rect:12, });
   // Create Slider for controling the uniform 'Smoothness'
   const slider_smoothness = Create_widget_slider(Style_slider_default_properties({pos:[0, 0, 10], dim:slider_dim, col:GREY[3], name:'Smoothness'}));
   Widget_gfx_ready_enable({mesh:slider_smoothness, enable_sdf_rect:12, });
   // Create Slider for controling the uniform 'Intensity'
   const slider_intensity = Create_widget_slider(Style_slider_default_properties({pos:[0, 0, 10], dim:slider_dim, col:GREY[3], name:'Intensity'}));
   Widget_gfx_ready_enable({mesh:slider_intensity, enable_sdf_rect:12, });









   const pad = 10;
   const rcorners = 10;

   /****************************************************************************************************************************************************/
   // Create the load demo button

   const window_menu = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[pad, pad], dim:[VIEWPORT.WIDTH / 2 - pad - 1, 0], col:TRANSPARENCY(GREY[5], .94), name:'window_menu'}));
   Widget_gfx_ready_enable({mesh:window_menu, enable_sdf_rect:4, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP}})
   // window_menu.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, true); // Create fake event so we can set the focus on any window_menu child.




   /*******************************************************************************************/
   // Load menu button
   const Load_menu_btn = Create_widget_button(Style_button_default_properties({text:'Demos', pos:[0, 0, 1], col:GREEN[7], text_pad:[8, 8],}));
   Widget_gfx_ready_enable({mesh:Load_menu_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   window_menu.AddItem(Load_menu_btn);

   // Setup Load Menu Panel callback on lod button click
   const load_clbk_params = {

      menu_panel: null, // A pointer to the future created menu panel
      Create_menu_items_clbk: Create_menu_items_demos,
      mnemonics: { demo_id: create_demo_id, }, // Remember variable values between different pages
   };

   Load_menu_btn.Bind(
      // Load_menu_callback,
      Create_menu_popup,
      _, load_clbk_params, _,
   );




   let total_height = 65;
   const info_ui = Debug_info_ui_static(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
   total_height += info_ui.geom.dim[1]; // Space for the debug_info ui
   // {
   //    const info_ui2 = Debug_info_ui_static_app_generic_buffers_container(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
   //    total_height += info_ui2.geom.dim[1]; // Space for the debug_info ui
   // }   
   // {
   //    const info_ui2 = Debug_info_ui_static_app_generic_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
   //    total_height += info_ui2.geom.dim[1]; // Space for the debug_info ui
   // }   
   // {
   //    const info_ui2 = Debug_info_ui_static_app_int16_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
   //    total_height += info_ui2.geom.dim[1]; // Space for the debug_info ui
   // }   
   // {
   //    const info_ui2 = Debug_info_ui_static_app_int8_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, total_height);
   //    total_height += info_ui2.geom.dim[1]; // Space for the debug_info ui
   //    // total_height += info_ui2.geom.dim[1] * 2 + 10; // Space for the debug_info ui
   // }  


   total_height += 10; // Space for the debug_info ui


   /*********************************************************************************************************************************************/
   // Create Demos Functions

   /*****************************************************************************************************************************/
   // Widgets
   if (create_demo_id & category_widgets.id) { // Demos Widgets

      const pad = 50;

      /* section/rect move */
      // const explainer = Demo_widgets_explainer_info([0, total_height]);
      // total_height += explainer.geom.dim[1] * 2 + pad;

      // /* section/rect move */
      // const sections = Demo_widgets_sections(_, [0, total_height], slider_distance, slider_smoothness, slider_intensity);
      // total_height += sections.geom.dim[1] * 2 + pad;


      // /* Button Switces  Slider */
      // const widgets = Demo_widgets(_, [0, total_height,], slider_distance, slider_smoothness, slider_intensity);
      const widgets = Demo_widgets(_, [0, total_height,]);
      total_height += widgets.geom.dim[1] * 2 + pad;


      // /* scrolling */
      // const scroller = Demo_widgets_scrolled_labels(_, [0, total_height], _, slider_distance, slider_smoothness, slider_intensity);
      // total_height += scroller.geom.dim[1] * 2 + pad;


      // /* Colorpicker */
      // const colorpicker = Demo_widgets_colorpicker_demo_with_info(_, total_height);
      // total_height += colorpicker.geom.dim[1] * 2 + pad;


      // /* dropdown - move - hover */
      // const dp = Demo_widgets_dropdown(_, [0, total_height], slider_distance, slider_smoothness, slider_intensity)
      // total_height += dp.geom.dim[1] * 2 + pad;


      /* Coloring per vertex */

      /* Resizable widgets */

   }
   /*****************************************************************************************************************************/
   // SDF-MSDF text rendering 
   else if (create_demo_id & (category_msdf_text.id)) { // Demo Particles - Ball tail particles 


      // const msdf_text = Widget_msdf_text_with_scale_slider(_, 'The quick\nbrown fox\njumps over', TEXTURES.MTSDF_COMIC_1024, 0, 550, 20, _, _, _, true);
      Demo_widgets_msdf_text_rendering(10, total_height);

   }
   /*****************************************************************************************************************************/
   // Particles
   else if (create_demo_id & (category_particles.id | subcategory_comet.id)) { // Demo Particles - Ball tail particles 

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_particles_demo, subcategory_comet.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      comet_particles_struct = Create_comet_particles(0, total_height, _, _, 1, ROOT_WIDGETS.CREATE_ROOT, false);

      comet_particles_struct.controls_section = Create_comet_noise_contols(comet_particles_struct.noise_particles_buffer, TRANSPARENCY(GREY[1], .6), comet_noise_slider_values, _, 'u_generic_controls');
      const comet_glow_contols = Create_comet_glow_contols(comet_particles_struct.glow_particles_buffer, TRANSPARENCY(GREY[1], .6), comet_glow_slider_values);
      for (let i = 0; i < comet_glow_contols.length; i++) {
         comet_particles_struct.controls_section.push(comet_glow_contols[i]);
      }

      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);
   }
   else if (create_demo_id & subcategory_glow.id) { // Demo Particles - Glow particles 

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_particles_demo, create_demo_id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      glow_particles_struct = Create_glow_particles(0, total_height+150, ROOT_WIDGETS.CREATE_ROOT, false, 1);
      // emitter, scale_down, color = GREY[2], parameters=null, u_scale_create=false, generic_contols_parameters=null
      glow_particles_struct.controls_section = Create_particles_controls(glow_particles_struct.emitter, .2, _, glow_slider_values, true, glow_generic_controls_parameters, 'u_generic_controls');


      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);
   }
   else if (create_demo_id & subcategory_explosion.id) { // Demo Particles - Glow particles 

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_particles_demo, create_demo_id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      explosion_particles_struct = Create_explosion_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, 256);

      // explosion_particles_struct.controls_section = Create_explosion_particles_controls(explosion_particles_struct.emitter, .2, _, explosion_slider_values);
      explosion_particles_struct.controls_section = Create_particles_controls(explosion_particles_struct.emitter, .2, _, explosion_slider_values, true, explosion_generic_controls_parameters, 'u_generic_controls');


      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);
   }
   else if (create_demo_id & subcategory_smoke.id) { // Demos Particles - Smoke particles

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_particles_demo, create_demo_id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      smoke_particles_struct = Create_smoke_particles(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false);
      Create_smoke_particles_controls(smoke_particles_struct.emitter, _, smoke_slider_values_transform_parameters, _, _, 'u_generic_controls');
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);
   }
   /*****************************************************************************************************************************/
   // Physics
   else if (create_demo_id & (category_physics.id | subcategory_elastic_collisions.id)) { // Demos Physics

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_physics_demo, subcategory_elastic_collisions.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      ellastic_collisions_struct = Elastic_collisions(0, total_height, ROOT_WIDGETS.CREATE_ROOT, false, false);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & subcategory_perimetric_rotation.id) { // Demos Physics

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_physics_demo, create_demo_id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      total_height += Sattelite_rotation(0, total_height);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & subcategory_velocity_verlet.id) { // Demos Physics - Chain link


      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_physics_demo, create_demo_id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Demo_chain_link(_, total_height);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   /*****************************************************************************************************************************/
   // Animations
   else if (create_demo_id & (category_animations.id | subcategory_animations_button.id)) { // Demos Physics - Chain link

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_animations_button.id, BLUEL[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      // const panel1 = Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 20, total_height, CALLBACK_ANIMATION_TYPE_FLAGS.SCALE, 'Scale Animation');
      // const panel2 = Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 220, total_height, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY, 'Move X-Y Animation');
      // const panel3 = Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 420, total_height, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY|CALLBACK_ANIMATION_TYPE_FLAGS.SCALE,  'Scale and Move X-Y');
      // total_height += panel1.geom.dim[1];

      const panel = Demo_animations_ready_button_with_panel(ROOT_WIDGETS.CREATE_ROOT, 20, total_height);
      total_height += panel.geom.dim[1];
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & (subcategory_animations1.id)) { // Demos Physics - Chain link

      /**
       * HERE:
       * In order to destroy all meshes and their respective buffers (children generic buffers),
       * we need to call a 'destroy()' function and pass the root group,
       * so that we can destroy from root view file.
       * 
       * Instead, we call Reset from the App, that deals with all structures,
       * except from the generic,int32-16-8 buffers 
       */
      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_animations1.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      total_height += Demo_animations(0, total_height);
      total_height += 20;
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & (subcategory_animations2.id)) { // Demos Physics - Chain link

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_animations2.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Demo_animations_with_slider_slope(0, total_height);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & (subcategory_animations_text.id)) { // Demos Physics - Chain link

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_animations_text.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      animations_text_struct = Demo_animations_text(0, total_height, false);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & (subcategory_rotating_rects.id)) { // Demos Physics - Snake

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_animations_demo, subcategory_rotating_rects.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Board_rotations(0, total_height, ROOT_WIDGETS.CREATE_ROOT);

      total_height += 20;
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   /*****************************************************************************************************************************/
   // In Practise
   else if (create_demo_id & (category_in_practise.id | subcategory_snake.id)) { // Demos Physics - Snake

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_in_practise_demo, subcategory_snake.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      snake_struct = Game_snake(total_height, false);
      total_height += 20;
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & (subcategory_tetris.id)) { // Demos Physics - Snake

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_in_practise_demo, subcategory_tetris.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      Tetris_reset();
      Tetris(ROOT_WIDGETS.CREATE_ROOT, 0, total_height, true, subcategory_tetris.id);

      total_height += 20;
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }
   else if (create_demo_id & (subcategory_arkanoid.id)) { // Demos Physics - Snake

      const secondary_menu = Create_menu_horizontal_buttons(_, total_height, Create_menu_items_in_practise_demo, subcategory_arkanoid.id, YELLOWR[6]);
      total_height += secondary_menu.geom.dim[1] * 2 + 10; // Space for the debug_info ui

      // Tetris_reset();
      // (ROOT_WIDGETS.CREATE_ROOT, 0, total_height, true, subcategory_tetris.id);
      Arkanoid_reset();
      // Arkanoid_free_buffers();
      Arkanoid_initialize();

      total_height += 20;
      // Renderqueue_set_priority_by_vb(LAST, secondary_menu.gfx.vb.groupidx);
      // Renderqueue_set_priority_by_vb(LAST, secondary_menu.children.buffer[0].text_mesh.gfx.vb.groupidx);

   }



   /*******************************************************************************************/
   // Options menu button

   const options_menu_btn = Create_widget_button(Style_button_default_properties({text:'Options', pos:[0, 0, 1], col:GREENR[7], text_pad:[8, 8],}));
   Widget_gfx_ready_enable({mesh:options_menu_btn, enable_sdf_rect:10, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   window_menu.AddItem(options_menu_btn);

   // Setup Load Menu Panel callback on load button click
   const options_clbk_params = {

      menu_panel: null, // A pointer to the future created menu panel
      mnemonics: {
         demo_id: create_demo_id,
         comet_noise_slider_values: comet_noise_slider_values,
         comet_glow_slider_values: comet_glow_slider_values,
         glow_slider_values: glow_slider_values,
         glow_generic_controls_parameters: glow_generic_controls_parameters,
         explosion_slider_values: explosion_slider_values,
         explosion_generic_controls_parameters: explosion_generic_controls_parameters,
      }, // Remember variable values between different pages
      comet_particles_struct: comet_particles_struct,
      glow_particles_struct: glow_particles_struct,
      explosion_particles_struct: explosion_particles_struct,
      smoke_particles_struct: smoke_particles_struct,
      ellastic_collisions_struct: ellastic_collisions_struct,
      animations_text_struct: animations_text_struct,
      snake_struct: snake_struct,
   };

   options_menu_btn.Bind(
      Options_menu_callback,
      _, options_clbk_params, _,
   );

   // window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
   window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION;


   /*******************************************************************************************/
   // Render Menu Bar
   {
      // window_menu.AddItem(shade_menu_btn);

      // window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
      // window_menu.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
      // window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;

      Align_nested_sections_pre(window_menu);

      window_menu.GenGfxCtx();
      // window_menu.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTY;
      // window_menu.Calc_no_gfx_update();
      window_menu.Render()
      Root_group_activate_all_vbs_in_renderqueue(window_menu.root_bufferidx);

      window_menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, window_menu.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(window_menu)
      Construct_listen_events_relations_from_mesh_tree(window_menu);


      // View_build_group_from_root_mesh(shade_menu_btn);
   }



   /****************************************************************************************************************************************************/
   { // Create the button for going to the top

      const btn = Create_widget_button(Style_button_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, text:'^', pos:[VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 10], text_col:GREY[4], col:GREEN[9], text_pad:[12, 7], }));
      Widget_gfx_ready_enable({mesh:btn, enable_sdf_rect: btn.geom.dim[1], listener:{type:LISTEN_EVENT_TYPES.HOVER}});

      btn.Bind(
         () => {

            Callback_animations_create( // Scroll Up
               () => { // Run Animation

                  const unif_wpos = Screen_wpos_get_y();
                  if (unif_wpos < 0) {

                     const ypos = unif_wpos / 2;
                     Scene_camera_scroll_add(_, -ypos / 2);
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

      btn.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.ABSOLUTE_POSITION | GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
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
function Create_menu_popup(params) {

   if (params.params.menu_panel !== null) return;

   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;

   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[30, 30], pos:[VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim:dim, col:TRANSPARENCY(GREY[3], .9), name:'MenuLoadPanel',}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:menu_panel.geom.dim[0] / 10, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP}});
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) Mesh_listener_create(menu_panel, LISTEN_EVENT_TYPES.MOVE);

   params.params.menu_panel = menu_panel;

   zpos++;




   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREY[1], .8);

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log)



   // Setup Load Menu Panel callback on lod button click
   const load_clbk_params = {
      mnemonics: params.params.mnemonics, // Remember variable values between different pages
      // Unload_clbk_buffer:params.params.Unload_clbk_buffer,
   };
   const menu_items = params.params.Create_menu_items_clbk(load_clbk_params);
   const len = menu_items.length;
   for (let i = 0; i < len; i++) {

      menu_panel.AddItem(menu_items[i]);
   }






   /*******************************************************************************************/
   // Close button
   const close_btn = Create_widget_close_btn(Style_button_default_properties({text:'CLOSE', target_mesh:menu_panel, pos:[0,0,zpos], col:close_btn_col, text_pad:[dim[0] / 2 - pad * 2, 6], font_size:15, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:close_btn, enable_sdf_rect:close_btn.geom.dim[1], listener:{type:LISTEN_EVENT_TYPES.HOVER}})
   menu_panel.AddItem(close_btn);




   /*************************************************************************************************/
   // Render Menu 
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   Align_nested_sections_pre(menu_panel);
   // close_btn.MoveNoGfxUpdate(0, (dim[1] * 2) - (Mesh_get_real_pos_y(close_btn) - Mesh_get_real_pos_y(menu_panel)));
   menu_panel.Render();


   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);

   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for the close menu button
   const evt_clbk_params = {
      evt_clbks: () => { params.params.menu_panel = null; },
   }

   Mesh_event_callback_create(menu_panel, evt_clbk_params);
}



/**This is a generic function for creating this type of menu. The menu items are created from a callback function passed in 'params' from the caller function */
function Create_menu_horizontal_buttons(x = 0, y = 0, Create_menu_items_callback, demo_id, btn_col=WHITE) {


   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;

   
   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, y, 10], dim:dim, col:TRANSPARENCY(GREY[1], .6), name:'HorizontalMenuLoadPanel',}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:10, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.CLICK_UP}});

   // const menu_panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 10], [0, 0], TRANSPARENCY(GREY[1], .6), 'section',);

   zpos++;




   /*************************************************************************************************/
   // Menu Options

   // Setup Load Menu Panel callback on lod button click
   const params = {

      menu_panel: menu_panel, // A pointer to the future created menu panel
      btn_col: btn_col,
      text_col: GREY[1],
      mnemonics: { demo_id: demo_id, }, // Remember variable values between different pages
   };
   const menu_items = Create_menu_items_callback(params, demo_id);
   const len = menu_items.length;
   for (let i = 0; i < len; i++) {

      // menu_items[i].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_PARENT_DSC, parent_menu.mesh_bufferidx, true);
      menu_panel.AddItem(menu_items[i]);
   }





   /*************************************************************************************************/
   // Render Menu 
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, true);
   menu_panel.GenGfxCtx();
   Align_nested_sections_pre(menu_panel);
   menu_panel.Render();

   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);

   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);


   return menu_panel;
}



function Options_menu_callback(params) {


   if (params.params.menu_panel !== null) return;

   const demo_id = params.params.mnemonics.demo_id;

   // HACK: Unfortunately the implementation of the snake's options need re-implementation in order to match this functions code structure.
   if ((demo_id & category_in_practise.id) || (demo_id & subcategory_snake.id)) {

      const Snake_options_callback = params.params.snake_struct.Snake_options_callback;
      const options_clbk_params = {
         params: params.params.snake_struct.options_clbk_params,
         snake_struct_controls_section: null, // A place holder for the contols section created by the snake file 
      };

      Snake_options_callback(options_clbk_params);

      return;

   }

   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;



   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREY[1], .8);
   const tr = .7;

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH / 2 - 10) - dim[0]);
   let log = (dif > 0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);

   let ypos = 20;


   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:[VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim:dim, col:TRANSPARENCY(GREY[3], tr), name:'MenuOptionsPanel',}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect:menu_panel.geom.dim[0] / 10, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.CLICK_UP}});
   // const menu_panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 10], dim, TRANSPARENCY(GREY[3], tr), 'section',);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) Mesh_listener_create(menu_panel, LISTEN_EVENT_TYPES.MOVE);
   
   params.params.menu_panel = menu_panel;
   
   
   let controls_section = null;
   
   
   const rcorners = 10;
   const slider_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[2], tr), name:'SliderSection',}));
   Widget_gfx_ready_enable({mesh:slider_section, enable_sdf_rect:10, listener:{type:LISTEN_EVENT_TYPES.MOVE}});

   
      // slider_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
   
   // Create items for the menu 'options'.
   if (demo_id & subcategory_comet.id) {


      /****************************************************************************************************************/
      // 
      const comet_glow = params.params.comet_particles_struct.glow_particles_buffer;
      const comet_noise = params.params.comet_particles_struct.noise_particles_buffer;
      const comet_noise_slider_values = params.params.mnemonics.comet_noise_slider_values;
      const comet_glow_slider_values = params.params.mnemonics.comet_glow_slider_values;

      let comet_contols = params.params.comet_particles_struct.controls_section;

      const scale_down = .2;
      
      // If the options items haven't been initialized, initialize.
      if (comet_contols === null) {
         comet_contols = Create_comet_noise_contols(comet_noise, TRANSPARENCY(GREY[1], .6), comet_noise_slider_values);
         const comet_glow_contols = Create_comet_glow_contols(comet_glow, TRANSPARENCY(GREY[1], .6), comet_glow_slider_values, scale_down);
         for (let i = 0; i < comet_glow_contols.length; i++) {
            comet_contols.push(comet_glow_contols[i]);
         }
      }

      // Store all items to the current options-menu section
      const len = comet_contols.length;
      for (let i = 0; i < len; i++) {
         slider_section.AddItem(comet_contols[i]);
      }



      menu_panel.AddItem(slider_section);

      // // slider_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      // slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      // slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

      controls_section = slider_section;

   }
   if (demo_id & subcategory_glow.id) {

      const emitter = params.params.glow_particles_struct.emitter;
      let glow_particles_contols = params.params.glow_particles_struct.controls_section;


      // const slider_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[2], tr), name:'SliderSection',}));
      // Widget_gfx_ready_enable({mesh:slider_section, enable_sdf_rect:10,});


      const scale_down = .2;
      const glow_slider_values = params.params.mnemonics.glow_slider_values;
      const glow_generic_controls_parameters = params.params.mnemonics.glow_generic_controls_parameters;
      if (glow_particles_contols === null) {
         glow_particles_contols = Create_particles_controls(emitter, scale_down, _, glow_slider_values, false, glow_generic_controls_parameters, 'u_generic_controls');
      }
      for (let i = 0; i < glow_particles_contols.length; i++) {
         slider_section.AddItem(glow_particles_contols[i]);
      }



      menu_panel.AddItem(slider_section);

      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      // slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      // slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


      controls_section = slider_section;

   }
   if (demo_id & subcategory_explosion.id) {

      const emitter = params.params.explosion_particles_struct.emitter;
      let explosion_particles_contols = params.params.explosion_particles_struct.controls_section;

      // const slider_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[2], tr), name:'SliderSection',}));
      // Widget_gfx_ready_enable({mesh:slider_section, enable_sdf_rect:10,});

      const scale_down = .2;
      const explosion_slider_values = params.params.mnemonics.explosion_slider_values;
      const explosion_generic_controls_parameters = params.params.mnemonics.explosion_generic_controls_parameters;
      if (explosion_particles_contols === null) {
         // explosion_particles_contols = Create_explosion_particles_controls(emitter, scale_down, _, explosion_slider_values);
         explosion_particles_contols = Create_particles_controls(emitter, scale_down, _, explosion_slider_values, true, explosion_generic_controls_parameters, 'u_generic_controls');
      }
      for (let i = 0; i < explosion_particles_contols.length; i++) {
         slider_section.AddItem(explosion_particles_contols[i]);
      }

      menu_panel.AddItem(slider_section);

      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      // slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      // slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


      controls_section = slider_section;

   }
   if (demo_id & subcategory_smoke.id) {

      const emitter = params.params.smoke_particles_struct.emitter;

      // const slider_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[2], tr), name:'SliderSection',}));
      // Widget_gfx_ready_enable({mesh:slider_section, enable_sdf_rect:rcorners,});

      const glow_particles_contols = Create_smoke_particles_controls(emitter, _, smoke_slider_values_transform_parameters);
      for (let i = 0; i < glow_particles_contols.length; i++) {
         slider_section.AddItem(glow_particles_contols[i]);
      }

      menu_panel.AddItem(slider_section);

      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      // slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      // slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


      controls_section = slider_section;

   }
   if ((demo_id & subcategory_elastic_collisions.id) || demo_id & category_physics.id) {

      const ellastic_collisions_balls = params.params.ellastic_collisions_struct.ellastic_collisions_balls;
      const mnemonics = params.params.ellastic_collisions_struct.mnemonics;


      // const slider_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[2], tr), name:'SliderSection',}));
      // Widget_gfx_ready_enable({mesh:slider_section, enable_sdf_rect:rcorners,});

      const ell_coll_params = {
         mnemonics: mnemonics,
      }
      const contols = Create_elastic_collisions_controls(ellastic_collisions_balls, GREY[2], [mnemonics.scale_down, .2], ell_coll_params)
      for (let i = 0; i < contols.length; i++) {
         slider_section.AddItem(contols[i]);
      }



      menu_panel.AddItem(slider_section);

      // slider_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      // slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      // slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


      controls_section = slider_section;

   }
   if (demo_id & subcategory_animations_text.id) {

      const slope_params_pointer = params.params.animations_text_struct.slope_params_pointer;
      const animation_properties = params.params.animations_text_struct.animation_properties;

      // const slider_section = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:TRANSPARENCY(GREY[2], tr), name:'SliderSection',}));
      // Widget_gfx_ready_enable({mesh:slider_section, enable_sdf_rect:rcorners,});

      const animation_text_contols = Demo_clbk_animations_text_create_contols(slope_params_pointer, animation_properties);
      for (let i = 0; i < animation_text_contols.length; i++) {
         slider_section.AddItem(animation_text_contols[i]);
      }

      menu_panel.AddItem(slider_section);

      // slider_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_section.mesh_bufferidx, true);
      // // slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, slider_section.mesh_bufferidx, true);
      // slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      // slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;


      controls_section = slider_section;

   }


   /*******************************************************************************************/
   // Create close button
   const close_btn = Create_widget_close_btn(Style_button_default_properties({text:'CLOSE', target_mesh:menu_panel, pos:[0,0,zpos], col:close_btn_col, text_pad:[dim[0] / 2 - pad * 2, 6], font_size:15, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:close_btn, enable_sdf_rect:close_btn.geom.dim[1], listener:{type:LISTEN_EVENT_TYPES.HOVER}})
   menu_panel.AddItem(close_btn);

   // Must recalculate all children meshes position offsets
   // close_btn.MoveNoGfxUpdate(dim[0] - close_btn.geom.dim[0], dim[1] * 2 - close_btn.geom.dim[1] * 2 - pad);



   /*************************************************************************************************/
   // Render Section 
   menu_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx, false);
   menu_panel.GenGfxCtx();

   // Build a group view of the scrolled section for the scroller
   if (controls_section !== null) {

      View_build_group_from_root_mesh(controls_section);
      Align_nested_sections_pre(controls_section);
      const center = (menu_panel.geom.dim[0] - controls_section.geom.dim[0]);
      // controls_section.MoveNoGfxUpdate(center, ypos); ypos += controls_section.geom.dim[1] * 2 + 10;

   }

   menu_panel.Render();

   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);


   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);
   if (controls_section !== null) controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

   Listeners_set_priority(E.C, close_btn.listeners);


   // Create scroller
   const clean_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1] * 2 + 10);
   const needs_scroller = (controls_section !== null)
      ? (controls_section.geom.dim[1] > clean_height) ? true : false
      : false;
   if (needs_scroller) {

      const scroller_height = menu_panel.geom.dim[1] - (close_btn.geom.dim[1] * 2 + 10);
      const scroller_component = Components_create_scroller_component(10, scroller_height, controls_section, 100);
      Scoller_component_gengfx_and_render(scroller_component, controls_section, GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(controls_section.root_posidx, scroller_component.root_posidx);
      Listeners_set_priority(E.C, scroller_component.listeners);
      menu_panel.AddChildScrollerIdx(controls_section.scroller_comp_idx);

      Scroller_component_calculate_handle_pos_dim(scroller_component);


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
      evt_clbks: () => {
         params.params.menu_panel = null;
         if (params.params.glow_particles_struct !== null)
            params.params.glow_particles_struct.controls_section = null;
         if (params.params.explosion_particles_struct !== null)
            params.params.explosion_particles_struct.controls_section = null;
         if (params.params.comet_particles_struct !== null)
            params.params.comet_particles_struct.controls_section = null;
      },
   }

   Mesh_event_callback_create(menu_panel, evt_clbk_params);
}



/**This is the callback function to create specific menu items. */
function Create_menu_items_demos(params) {


   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   const text_col = params.text_col;
   const text_pad = [15, 8];
   const font_size = 10;
   const btn_col = params.btn_col;


   /*******************************************************************************************/
   // Button 1
   const button1 = Create_widget_button(Style_button_default_properties({text:category_widgets.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:button1, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_items_array.push(button1);
   Bind_menu_button(button1, params, category_widgets.id, category_widgets.id);



   /*******************************************************************************************/
   // Button 6
   const button6 = Create_widget_button(Style_button_default_properties({text:category_msdf_text.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:button6, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_items_array.push(button6);
   Bind_menu_button(button6, params, category_msdf_text.id, category_msdf_text.id);



   /*******************************************************************************************/
   // Button 2
   const button2 = Create_widget_button(Style_button_default_properties({text:category_particles.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:button2, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_items_array.push(button2);
   Bind_menu_button(button2, params, (category_particles.id | subcategory_comet.id | subcategory_glow.id | subcategory_smoke.id | subcategory_explosion.id), subcategory_glow.id);



   /*******************************************************************************************/
   // Button 3
   const button3 = Create_widget_button(Style_button_default_properties({text:category_physics.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:button3, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_items_array.push(button3);
   Bind_menu_button(button3, params, (category_physics.id | subcategory_elastic_collisions.id | subcategory_perimetric_rotation.id | subcategory_velocity_verlet.id), category_physics.id);



   /*******************************************************************************************/
   // Button 4
   const button4 = Create_widget_button(Style_button_default_properties({text:category_animations.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:button4, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_items_array.push(button4);
   Bind_menu_button(button4, params, (category_animations.id | subcategory_animations1.id), category_animations.id);



   /*******************************************************************************************/
   // Button 5
   const button5 = Create_widget_button(Style_button_default_properties({text:category_in_practise.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:button5, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_items_array.push(button5);
   Bind_menu_button(button5, params, (category_in_practise.id), category_in_practise.id);



   return menu_items_array;
}


/*************************************************************************************************************************************************************/
/*************************************************************************************************************************************************************/
// Dedicated Functions For Creating Items For The Menus

function Create_menu_items_particles_demo(params, demo_id) {

   // if (params.menu_panel !== null) return;

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   const text_pad = [15, 8];
   const font_size = 10;
   const text_col = params.text_col;
   const btn_col = params.btn_col;


   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_comet.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item1_btn = Create_widget_button(Style_button_default_properties({text:subcategory_comet.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c1, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item1_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   menu_items_array.push(item1_btn);

   Bind_menu_button(item1_btn, params, (subcategory_comet.id), subcategory_comet.id);



   /*******************************************************************************************/
   // Item 2 button
   const c2 = (demo_id & subcategory_glow.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item2_btn = Create_widget_button(Style_button_default_properties({text:subcategory_glow.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c2, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item2_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item2_btn = Create_widget_button(_, subcategory_glow.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_glow.id), subcategory_glow.id);



   /*******************************************************************************************/
   // Item 2 button
   const c3 = (demo_id & subcategory_explosion.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item3_btn = Create_widget_button(Style_button_default_properties({text:subcategory_explosion.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c3, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item3_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item3_btn = Create_widget_button(_, subcategory_explosion.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c3, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item3_btn);
   Bind_menu_button(item3_btn, params, (subcategory_explosion.id), subcategory_explosion.id);



   /*******************************************************************************************/
   //  Item 3 button
   const c4 = (demo_id & subcategory_smoke.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item4_btn = Create_widget_button(Style_button_default_properties({text:subcategory_smoke.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c4, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item4_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item4_btn = Create_widget_button(_, subcategory_smoke.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c4, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item4_btn);
   Bind_menu_button(item4_btn, params, (subcategory_smoke.id), subcategory_smoke.id);



   return menu_items_array;
}



function Create_menu_items_physics_demo(params, demo_id) {

   // if (params.menu_panel !== null) return;

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const rcorners = 8;
   // const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   const text_col = params.text_col;
   const btn_col = params.btn_col;
   const text_pad = [15, 8];
   const font_size = 10;


   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_elastic_collisions.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item1_btn = Create_widget_button(Style_button_default_properties({text:subcategory_elastic_collisions.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c1, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item1_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item1_btn = Create_widget_button(_, subcategory_elastic_collisions.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c1, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item1_btn);
   Bind_menu_button(item1_btn, params, (subcategory_elastic_collisions.id), subcategory_elastic_collisions.id);



   /*******************************************************************************************/
   // Item 2 button
   const c2 = (demo_id & subcategory_perimetric_rotation.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item2_btn = Create_widget_button(Style_button_default_properties({text:subcategory_glow.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c2, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item2_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item2_btn = Create_widget_button(_, subcategory_perimetric_rotation.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_perimetric_rotation.id), subcategory_perimetric_rotation.id);



   /*******************************************************************************************/
   //  Item 3 button
   const c3 = (demo_id & subcategory_velocity_verlet.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item3_btn = Create_widget_button(Style_button_default_properties({text:subcategory_velocity_verlet.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c3, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item3_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item3_btn = Create_widget_button(_, subcategory_velocity_verlet.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c3, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item3_btn);
   Bind_menu_button(item3_btn, params, (subcategory_velocity_verlet.id), subcategory_velocity_verlet.id);





   return menu_items_array;
}



function Create_menu_items_animations_demo(params, demo_id) {

   // if (params.menu_panel !== null) return;

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   // const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   // const text_col = WHITE;
   const text_col = params.text_col;
   const btn_col = params.btn_col;
   const text_pad = [15, 8];
   const font_size = 10;


   /*******************************************************************************************/
   // Item 5 button
   const c5 = (demo_id & subcategory_animations_button.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item5_btn = Create_widget_button(Style_button_default_properties({text:subcategory_animations_button.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c5, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item5_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item5_btn = Create_widget_button(_, subcategory_animations_button.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c5, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item5_btn);
   Bind_menu_button(item5_btn, params, (subcategory_animations_button.id), subcategory_animations_button.id);


   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_animations1.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item1_btn = Create_widget_button(Style_button_default_properties({text:subcategory_animations1.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c1, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item1_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item1_btn = Create_widget_button(_, subcategory_animations1.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c1, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item1_btn);
   Bind_menu_button(item1_btn, params, (category_animations.id | subcategory_animations1.id), subcategory_animations1.id);


   /*******************************************************************************************/
   // Item 1 button
   const c2 = (demo_id & subcategory_animations2.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item2_btn = Create_widget_button(Style_button_default_properties({text:subcategory_animations2.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c2, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item2_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item2_btn = Create_widget_button(_, subcategory_animations2.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_animations2.id), subcategory_animations2.id);


   /*******************************************************************************************/
   // Item 3 button
   const c3 = (demo_id & subcategory_animations_text.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item3_btn = Create_widget_button(Style_button_default_properties({text:subcategory_animations_text.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c3, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item3_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item3_btn = Create_widget_button(_, subcategory_animations_text.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c3, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item3_btn);
   Bind_menu_button(item3_btn, params, (subcategory_animations_text.id), subcategory_animations_text.id);


   /*******************************************************************************************/
   // Item 4 button
   const c4 = (demo_id & subcategory_rotating_rects.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item4_btn = Create_widget_button(Style_button_default_properties({text:subcategory_rotating_rects.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c4, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item4_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item4_btn = Create_widget_button(_, subcategory_rotating_rects.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c4, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item4_btn);
   Bind_menu_button(item4_btn, params, (subcategory_rotating_rects.id), subcategory_rotating_rects.id);








   return menu_items_array;
}



function Create_menu_items_in_practise_demo(params, demo_id) {

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items

   const feather = 2;
   const rcorners = 8;
   // const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   // const text_col = WHITE;
   const text_col = params.text_col;
   const btn_col = params.btn_col;
   const text_pad = [15, 8];
   const font_size = 10;


   /*******************************************************************************************/
   // Item 1 button
   const c1 = (demo_id & subcategory_snake.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item1_btn = Create_widget_button(Style_button_default_properties({text:subcategory_snake.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c1, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item1_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item1_btn = Create_widget_button(_, subcategory_snake.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c1, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item1_btn);
   Bind_menu_button(item1_btn, params, (category_in_practise.id | subcategory_snake.id), subcategory_snake.id);


   /*******************************************************************************************/
   // Item 2 button
   const c2 = (demo_id & subcategory_tetris.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item2_btn = Create_widget_button(Style_button_default_properties({text:subcategory_tetris.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c2, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item2_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item2_btn = Create_widget_button(_, subcategory_tetris.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c2, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item2_btn);
   Bind_menu_button(item2_btn, params, (subcategory_tetris.id), subcategory_tetris.id);


   /*******************************************************************************************/
   // Item 3 button
   const c3 = (demo_id & subcategory_arkanoid.id) ? TRANSPARENCY(btn_col, .4) : TRANSPARENCY(btn_col, 1.);
   const item3_btn = Create_widget_button(Style_button_default_properties({text:subcategory_arkanoid.name, align:TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos:[0, 0, 0], col:c3, text_col:text_col, text_pad:text_pad, texture_id:font, font_size:font_size}));
   Widget_gfx_ready_enable({mesh:item3_btn, enable_sdf_rect:rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}});
   // const item3_btn = Create_widget_button(_, subcategory_arkanoid.name, TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], _, c3, text_col, [15, 8], .5, _, font);
   menu_items_array.push(item3_btn);
   Bind_menu_button(item3_btn, params, (subcategory_arkanoid.id), subcategory_arkanoid.id, [Arkanoid_free_buffers]);



   return menu_items_array;
}







