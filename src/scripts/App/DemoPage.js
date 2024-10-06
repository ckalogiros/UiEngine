"use strict";

import { Callback_animations_create } from "../Engine/Animations/CallbackAnimations.js";
import { Create_widget_button, Create_widget_close_btn, Create_widget_dropdown, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from "../Engine/Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx } from "../Engine/Core/MeshBuffer.js";
import { View_build_group_from_root_mesh } from "../Engine/Core/MeshBufferViews.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos, Screen_wpos_get_y } from "../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs, Root_group_vbidx_view_view_get } from "../Engine/Core/Views/RootView.js";
import { Debug_info_ui, Debug_info_ui_static } from "../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLUEL, GREENL, GREY, WHITE, YELLOW } from "../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_get_uniform_ubidx_from_name, Mesh_set_root_in_focus } from "../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Drawables/Operations/Recursions.js";
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from "../Engine/Drawables/Widgets/ScrollerComponent.js";
import { Dropdown_roots_set_root } from "../Engine/Drawables/Widgets/Widget_Dropdown.js";
import { Slider_connect, Slider_set_listeners_priority } from "../Engine/Drawables/Widgets/WidgetSlider.js";
import { Listeners_set_priority, TEMP_LISTENERS } from "../Engine/Events/EventListeners.js";
import { Renderqueue_set_active } from "../Engine/Renderers/Renderer/RenderQueue.js";
import { Scene_camera_scroll_add, Scene_camera_scroll_set } from "../Engine/Scenes.js";
import { Vertex_buffer_group_create_scissorbox, Vertex_buffer_set_and_update_uniform } from "../Graphics/Buffers/VertexBuffers.js";
import { Gl_set_rgba } from "../Graphics/Buffers/VertexBuffersOps.js";
import { Abs, CopyArr4 } from "../Helpers/Math/MathOperations.js";
import { AppReset } from "./App.js";
import { Demo_chain_link } from "./Demo/DemoChainLink.js";
import { Create_ball_tail_glow_contols, Create_ball_tail_particles, Create_ball_tail_particles_contols, Create_glow_particles, Create_glow_particles_controls, Demo_all, Demo_ball_tail_2 } from "./Demo/DemoParticles.js";
import { Elastic_collisions, Sattelite_rotation } from "./Demo/DemoPhysics.js";
import { Demo_widgets_button, Demo_widgets_colorpicker, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_dropdown, Demo_widgets_scrolled_labels, Demo_widgets_sections } from "./Demo/DemoWidgets.js";
import { Game_snake } from "./Demo/Games/Snake/Snake.js";





const page1_text = 'Demo Widgets';
const page2_text = 'Demo Ball-Tail Particles';
const page3_text = 'Demo Glow Particles';
const page4_text = 'Demo Physics';
const page5_text = 'Demo Physics - Chain Link';
const page6_text = 'Demo - Snake';




export function Demo_page(create_demo_id = 2) {




   
   /*********************************************************************************************************************************************/
   // Create Slider for controling the uniforms
   
   const slider_dim = [100, 12];

   const shade_menu_btn = Create_widget_dropdown(_, `Shade`, [0, 0, 0], GREENL[5], GREY[3], WHITE, [6, 4], _, _, _, _, [8, 8]);
   // Create Slider for controling the uniform 'Distance'
   const slider_distance = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Distance');
   // Create Slider for controling the uniform 'Smoothness'
   const slider_smoothness = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Smoothness');
   // Create Slider for controling the uniform 'Intensity'
   const slider_intensity = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Intensity');

   {
      shade_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      shade_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      shade_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      shade_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      shade_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      shade_menu_btn.SetName('shade_menu_btn');
      shade_menu_btn.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      Dropdown_roots_set_root(shade_menu_btn, shade_menu_btn);
      shade_menu_btn.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.PRIVATE, shade_menu_btn.mesh_bufferidx);
   
   
      
      slider_distance.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_distance.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider_distance.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
      slider_distance.SetInitialValue(.11);
      shade_menu_btn.AddToMenu(slider_distance);
      
      
      
      slider_smoothness.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_smoothness.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER,2);
      slider_smoothness.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS,1);
      slider_smoothness.SetInitialValue(.11);
      shade_menu_btn.AddToMenu(slider_smoothness);
      
      
      
      slider_intensity.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_intensity.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER,2);
      slider_intensity.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS,1);
      slider_intensity.SetInitialValue(1.);
      shade_menu_btn.AddToMenu(slider_intensity);
   }



   let ball_tail_particles_struct = null;
   let glow_particles_struct = null;







   /*********************************************************************************************************************************************/
   // Create Demos Functions

   if (create_demo_id === 1) { // Demos Widgets

      let total_height = 80; // For the debug_info ui
      const pad = 50;


      /* section/rect move */
      const sections = Demo_widgets_sections(_, [0, total_height], slider_distance, slider_smoothness, slider_intensity);
      total_height += sections.geom.dim[1] * 2 + pad;


      /* Button Switces  Slider */
      const widgets = Demo_widgets_button(_, [0, total_height,], slider_distance, slider_smoothness, slider_intensity);
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



      // Debug_info_ui_static();


      const sections_all_vbidxs = Root_group_vbidx_view_view_get(sections.root_bufferidx)
      const widgets_all_vbidxs = Root_group_vbidx_view_view_get(widgets.root_bufferidx)
      const scroller_all_vbidxs = Root_group_vbidx_view_view_get(scroller.root_bufferidx)
      const dp_all_vbidxs = Root_group_vbidx_view_view_get(dp.root_bufferidx)

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider_distance, (params, slider_val) => {

         const val_idx = 0;
         // Find the ubidx
         const sections_ubidx = Mesh_get_uniform_ubidx_from_name(sections.uniforms, 'u_rcorners');
         for(let i = 0; i <= sections_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(sections_all_vbidxs.buffer[i], sections_ubidx, slider_val, val_idx);

         const widgets_ubidx = Mesh_get_uniform_ubidx_from_name(widgets.uniforms, 'u_rcorners');
         for(let i = 0; i <= widgets_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(widgets_all_vbidxs.buffer[i], widgets_ubidx, slider_val, val_idx);

         const scroller_ubidx = Mesh_get_uniform_ubidx_from_name(scroller.uniforms, 'u_rcorners');
         for(let i = 0; i <= scroller_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(scroller_all_vbidxs.buffer[i], scroller_ubidx, slider_val, val_idx);

         const dp_ubidx = Mesh_get_uniform_ubidx_from_name(dp.uniforms, 'u_rcorners');
         for(let i = 0; i <= dp_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(dp_all_vbidxs.buffer[i], dp_ubidx, slider_val, val_idx);

      }, _);

      Slider_connect(slider_smoothness, (params, slider_val) => {

         const val_idx = 1;
         // Find the ubidx
         const sections_ubidx = Mesh_get_uniform_ubidx_from_name(sections.uniforms, 'u_rcorners');
         for(let i = 0; i <= sections_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(sections_all_vbidxs.buffer[i], sections_ubidx, slider_val, val_idx);

         const widgets_ubidx = Mesh_get_uniform_ubidx_from_name(widgets.uniforms, 'u_rcorners');
         for(let i = 0; i <= widgets_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(widgets_all_vbidxs.buffer[i], widgets_ubidx, slider_val, val_idx);

         const scroller_ubidx = Mesh_get_uniform_ubidx_from_name(scroller.uniforms, 'u_rcorners');
         for(let i = 0; i <= scroller_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(scroller_all_vbidxs.buffer[i], scroller_ubidx, slider_val, val_idx);

         const dp_ubidx = Mesh_get_uniform_ubidx_from_name(dp.uniforms, 'u_rcorners');
         for(let i = 0; i <= dp_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(dp_all_vbidxs.buffer[i], dp_ubidx, slider_val, val_idx);

      }, _);

      Slider_connect(slider_intensity, (params, slider_val) => {

         const val_idx = 2;
         // Find the ubidx
         const sections_ubidx = Mesh_get_uniform_ubidx_from_name(sections.uniforms, 'u_rcorners');
         for(let i = 0; i <= sections_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(sections_all_vbidxs.buffer[i], sections_ubidx, slider_val, val_idx);

         const widgets_ubidx = Mesh_get_uniform_ubidx_from_name(widgets.uniforms, 'u_rcorners');
         for(let i = 0; i <= widgets_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(widgets_all_vbidxs.buffer[i], widgets_ubidx, slider_val, val_idx);

         const scroller_ubidx = Mesh_get_uniform_ubidx_from_name(scroller.uniforms, 'u_rcorners');
         for(let i = 0; i <= scroller_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(scroller_all_vbidxs.buffer[i], scroller_ubidx, slider_val, val_idx);

         const dp_ubidx = Mesh_get_uniform_ubidx_from_name(dp.uniforms, 'u_rcorners');
         for(let i = 0; i <= dp_all_vbidxs.boundary; i++)
            Vertex_buffer_set_and_update_uniform(dp_all_vbidxs.buffer[i], dp_ubidx, slider_val, val_idx);

      }, _);

   }
   if (create_demo_id === 2) { // Demo Particles - Ball tail particles 

      ball_tail_particles_struct  = Create_ball_tail_particles(_, 100, _, _, _, ROOT_WIDGETS.CREATE_ROOT, false);

   }
   if (create_demo_id === 3) { // Demo Particles - Glow particles 

      glow_particles_struct  = Create_glow_particles(_, _, ROOT_WIDGETS.CREATE_ROOT, false);
      Create_glow_particles_controls(glow_particles_struct.emitter, .2, _, );

   }
   if (create_demo_id === 4) { // Demos Physics
      
      let total_height = 60; // Fo the debug_info ui

      total_height += Elastic_collisions([0, total_height]);


      Sattelite_rotation([0, total_height * 2 + 100]);

      // Debug_info_ui_static();
   }
   if (create_demo_id === 5) { // Demos Physics - Chain link
      
      let total_height = 60; // Space for the debug_info ui

      const chain = Demo_chain_link();
      // total_height += ;

      // Debug_info_ui_static();
   }
   if (create_demo_id === 6) { // Demos Physics - Chain link
      
      let total_height = 60; // Space for the debug_info ui

      Game_snake();

      // Debug_info_ui_static();
   }












   const pad = 10;

   /****************************************************************************************************************************************************/
   // Create the load demo button

   const window_menu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [pad, pad], [0, 0, 0], [VIEWPORT.WIDTH/2 - pad-1, 0], TRANSPARENCY(GREY[5], 1.),);
   window_menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   window_menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   window_menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
   window_menu.SetName('window_menu');




   /*******************************************************************************************/
   // Load menu button
   const Load_menu_btn = Create_widget_button(_, 'Load Demos', _, [0, 0, 1], 20, GREENL[5], WHITE, [8, 8], .5);
   Load_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Load_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   Load_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // Load_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, Load_menu_btn.geom.dim[1]);
   Load_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   window_menu.AddItem(Load_menu_btn);

   // Setup Load Menu Panel callback on lod button click
   const load_clbk_params = { 

      menu_panel:null, // A pointer to the future created menu panel
      mnemonics:{ demo_id:create_demo_id, }, // Remember variable values between different pages
   }; 
   
   Load_menu_btn.Bind(
      Load_menu_callback,
      _, load_clbk_params, _,
   );




   /*******************************************************************************************/
   // Options menu button
   {

      const options_menu_btn = Create_widget_button(_, 'Options', _, [0, 0, 1], 20, GREENL[5], WHITE, [8, 8], .5);
      options_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      options_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      options_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      // options_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, options_menu_btn.geom.dim[1]);
      options_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      window_menu.AddItem(options_menu_btn);
   
      // Setup Load Menu Panel callback on lod button click
      const options_clbk_params = { 
   
         menu_panel:null, // A pointer to the future created menu panel
         mnemonics:{
            demo_id:create_demo_id,
            ball_tail_parameters:new Float32Array([0, 0, 0, .12]),
            ball_glow_parameters:new Float32Array([0, 1, 0.03, 0.2]),
            glow_parameters:new Float32Array([0.36, 1, 0.12, 0.2, .48, .59, .19, 0.08, 0.4, 0.05, 0.05, 0.55]),
         }, // Remember variable values between different pages
         ball_tail_particles_struct:ball_tail_particles_struct,
         glow_particles_struct:glow_particles_struct,
      }; 
      
      options_menu_btn.Bind(
         Options_menu_callback,
         _, options_clbk_params, _,
      );
   }

   
   /*******************************************************************************************/
   // Render Menu Bar
   {
      window_menu.AddItem(shade_menu_btn);
   
      window_menu.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
      // window_menu.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, window_menu.mesh_bufferidx);
   
      window_menu.GenGfxCtx();
      window_menu.options = SECTION.HORIZONTAL|SECTION.RESIZE_PARENTY;
      window_menu.Calc_no_gfx_update();
      window_menu.Render()
      Root_group_activate_all_vbs_in_renderqueue(window_menu.root_bufferidx);
   
      window_menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, window_menu.gfx.vb.groupidx)
   
      Construct_listen_events_from_mesh_tree(window_menu)
      Construct_listen_events_relations_from_mesh_tree(window_menu);
      
   
      View_build_group_from_root_mesh(shade_menu_btn);
   }
   
   
   
   /****************************************************************************************************************************************************/
   { // Create the button for going to the top

      const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, '^', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 10], _, GREY[4], GREENL[8], [12, 7], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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


}





function Load_menu_callback(params){

   if (params.params.menu_panel !== null) return;

   const dim = [
      (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
      (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
   ];
   let zpos = 10;
   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], .9), 'section', );
   menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0]/10);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   menu_panel.SetName('MenuLoadPanel');
   
   params.params.menu_panel = menu_panel;


   zpos++;





   /*************************************************************************************************/
   // Menu Options

   const feather = 2;
   const rcorners = 8;
   const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;
   const btn_col = TRANSPARENCY(GREY[1], .8);
   const tr = .4;

   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH/2-10) - dim[0]);
   let log = (dif>0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);

   let ypos = 100;
   

   /*******************************************************************************************/
   // Load Demo Button
   const page1_btn = Create_widget_button(_, page1_text, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, [0, rcorners, 1.8], font);
   page1_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page1_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_panel.AddItem(page1_btn);

   page1_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation
               
               const demo_id = params.mnemonics.demo_id;

               if(demo_id !== 1){
                  
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(1);
                  params.mnemonics.demo_id = 1;
               }
               return false;
            },
            () => { // Stop Animation
               return false;
            },
            {mnemonics:params.params.mnemonics},
         );
      },
      _, {mnemonics:params.params.mnemonics}, _,
   );

   /*******************************************************************************************/
   // Page 2 button
   const page2_btn = Create_widget_button(_, page2_text, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, [0, rcorners, 1.8], font);
   page2_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page2_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_panel.AddItem(page2_btn);

   page2_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation
               
               const demo_id = params.mnemonics.demo_id;

               if(demo_id !== 2){
                  
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(2);
                  params.mnemonics.demo_id = 2;
               }
               return false;
            },
            () => { // Stop Animation
               return false;
            },
            {mnemonics:params.params.mnemonics},
         );
      },
      _, {mnemonics:params.params.mnemonics}, _,
   );


   /*******************************************************************************************/
   // Page 3 button
   const page3_btn = Create_widget_button(_, page3_text, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, [0, rcorners, 1.8], font);
   page3_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page3_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_panel.AddItem(page3_btn);

   page3_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation
               
               const demo_id = params.mnemonics.demo_id;

               if(demo_id !== 3){
                  
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(3);
                  params.mnemonics.demo_id = 3;
               }
               return false;
            },
            () => { // Stop Animation
               return false;
            },
            {mnemonics:params.params.mnemonics},
         );
      },
      _, {mnemonics:params.params.mnemonics}, _,
   );


   /*******************************************************************************************/
   // Page 4 button
   const page4_btn = Create_widget_button(_, page4_text, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, [0, rcorners, 1.8], font);
   page4_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page4_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page4_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page4_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_panel.AddItem(page4_btn);

   page4_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation
               
               const demo_id = params.mnemonics.demo_id;

               if(demo_id !== 4){
                  
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(4);
                  params.mnemonics.demo_id = 4;
               }
               return false;
            },
            () => { // Stop Animation
               return false;
            },
            {mnemonics:params.params.mnemonics},
         );
      },
      _, {mnemonics:params.params.mnemonics}, _,
   );


   /*******************************************************************************************/
   // Page 5 button
   const page5_btn = Create_widget_button(_, page5_text, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, [0, rcorners, 1.8], font);
   page5_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page5_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page5_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page5_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_panel.AddItem(page5_btn);

   page5_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation
               
               const demo_id = params.mnemonics.demo_id;

               if(demo_id !== 5){
                  
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(5);
                  params.mnemonics.demo_id = 5;
               }
               return false;
            },
            () => { // Stop Animation
               return false;
            },
            {mnemonics:params.params.mnemonics},
         );
      },
      _, {mnemonics:params.params.mnemonics}, _,
   );


   /*******************************************************************************************/
   // Page 6 button
   const page6_btn = Create_widget_button(_, page6_text, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, [0, rcorners, 1.8], font);
   page6_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page6_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page6_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page6_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   menu_panel.AddItem(page6_btn);

   page6_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation
               
               const demo_id = params.mnemonics.demo_id;

               if(demo_id !== 6){
                  
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(6);
                  params.mnemonics.demo_id = 6;
               }
               return false;
            },
            () => { // Stop Animation
               return false;
            },
            {mnemonics:params.params.mnemonics},
         );
      },
      _, {mnemonics:params.params.mnemonics}, _,
   );


   /*******************************************************************************************/
   // Close button
   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, btn_col, WHITE, [dim[0]/2-pad*2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.SetName('close_btn');         
   menu_panel.AddItem(close_btn);

   // Must recalculate all children meshes position offsets
   page1_btn.MoveNoGfxUpdate(dim[0] - page1_btn.geom.dim[0], ypos); ypos += page1_btn.geom.dim[1]*2 + 10;
   page2_btn.MoveNoGfxUpdate(dim[0] - page2_btn.geom.dim[0], ypos ); ypos += page2_btn.geom.dim[1]*2 + 10;
   page3_btn.MoveNoGfxUpdate(dim[0] - page3_btn.geom.dim[0], ypos ); ypos += page3_btn.geom.dim[1]*2 + 10;
   page4_btn.MoveNoGfxUpdate(dim[0] - page4_btn.geom.dim[0], ypos ); ypos += page4_btn.geom.dim[1]*2 + 10;
   page5_btn.MoveNoGfxUpdate(dim[0] - page5_btn.geom.dim[0], ypos ); ypos += page5_btn.geom.dim[1]*2 + 10;
   page6_btn.MoveNoGfxUpdate(dim[0] - page6_btn.geom.dim[0], ypos ); ypos += page6_btn.geom.dim[1]*2 + 10;
   close_btn.MoveNoGfxUpdate(dim[0] - close_btn.geom.dim[0] , dim[1]*2-close_btn.geom.dim[1]*2-pad);




   /*************************************************************************************************/
   // Render Section 
   menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC|GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx);
   menu_panel.GenGfxCtx();
   menu_panel.Render();
   

   Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(menu_panel);
   Construct_listen_events_relations_from_mesh_tree(menu_panel);
   
   
   menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);
   
   
   

   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);


   // Create event callback for when the close menu button has been pressed
   const evt_clbk_params = {
      evt_clbks: ()=>{ params.params.menu_panel = null; }, 
   }

   menu_panel.CreateEventCallback(evt_clbk_params);

}





function Options_menu_callback(params){


   if (params.params.menu_panel !== null) return;

   const dim = [
      (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
      (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
   ];

   let zpos = 10;

   /*************************************************************************************************/
   // Menu Options

   const btn_col = TRANSPARENCY(GREY[1], .8);
   const tr = .4;
   
   // Calculate dimentions for small width device
   const dif = Abs((VIEWPORT.WIDTH/2-10) - dim[0]);
   let log = (dif>0) ? Math.log(dif) : .2;
   (log > 1) ? log = 1 : log = log;
   const pad = (20 * log);

   let ypos = 20;



   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], tr), 'section', );
   // menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0]/10);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   menu_panel.SetName('MenuOptionsPanel');
   
   params.params.menu_panel = menu_panel;
   const demo_id = params.params.mnemonics.demo_id;

   let controls_section = null;

   // Create demo pages options menu that has unique controls per page
   if(demo_id === 2)
   {

      
      const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];
      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS2,
      }
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
      
      
      /****************************************************************************************************************/
      // 
      // const controls_section  = params.params.ball_tail_particles_struct.controls_section;
      const ball_tail_glow  = params.params.ball_tail_particles_struct.glow_particles_buffer;
      const ball_tail_noise = params.params.ball_tail_particles_struct.tail_particles_buffer;
      const ball_tail_parameters = params.params.mnemonics.ball_tail_parameters;
      const ball_tail_noise_contols = Create_ball_tail_particles_contols(ball_tail_noise, TRANSPARENCY(GREY[2], tr), ball_tail_parameters);
      const ball_glow_parameters = params.params.mnemonics.ball_glow_parameters;
      
      for(let i = 0; i < ball_tail_noise_contols.length; i++){
         slider_section.AddItem(ball_tail_noise_contols[i]);
      }
      
      
      const ball_tail_glow_contols = Create_ball_tail_glow_contols(ball_tail_glow, _, ball_glow_parameters);
      for(let i = 0; i < ball_tail_glow_contols.length; i++){
         slider_section.AddItem(ball_tail_glow_contols[i]);
      }
      
      
      menu_panel.AddItem(slider_section);
      
      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC,);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW ;
      
      controls_section = slider_section;
      
   }
   if(demo_id === 3)
   {

      const emitter  = params.params.glow_particles_struct.emitter;
      const controls  = params.params.glow_particles_struct.controls_section;
      
      const u_wpos_flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS2,
      }
      
      const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];
      const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[2], tr), 'SliderSection', );
      slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      // slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      
      
      
      const scale_down = .2;
      const glow_parameters = params.params.mnemonics.glow_parameters;
      const glow_particles_contols = Create_glow_particles_controls(emitter, scale_down, _, glow_parameters);
      for(let i = 0; i < glow_particles_contols.length; i++){
         slider_section.AddItem(glow_particles_contols[i]);
      }



      menu_panel.AddItem(slider_section);

      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC,);
      slider_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE ;
      slider_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW ;


      controls_section = slider_section;

   }
   
   
   /*******************************************************************************************/
   // Close button
   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, btn_col, WHITE, [dim[0]/2-pad*2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.SetName('close_btn');         
   menu_panel.AddItem(close_btn);



   close_btn.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET,);

   
   // Must recalculate all children meshes position offsets
   close_btn.MoveNoGfxUpdate(dim[0] - close_btn.geom.dim[0] , dim[1]*2-close_btn.geom.dim[1]*2-pad);
   



   /*************************************************************************************************/
   // Render Section 
   menu_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);

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
   const needs_scroller = true; // TODO: Create scroller if needed
   if(controls_section !== null){ 


      const scroller_height = menu_panel.geom.dim[1]   - (close_btn.geom.dim[1]*2 + 10);
      // const scroller_height = 100;
      const scroller_component = Components_create_scroller_component(10, scroller_height, controls_section, 100);
      Scoller_component_gengfx_and_render(scroller_component, controls_section);
      Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(controls_section.root_posidx, scroller_component.root_posidx);
      Listeners_set_priority(E.C, scroller_component.listeners);
      menu_panel.AddChildScrollerIdx(controls_section.scroller_comp_idx);

      // controls_section.Calc_no_gfx_update();
      Scroller_component_calculate_handle_pos_dim(controls_section, scroller_component);
   
      // Set scissor box
      const mx = controls_section.mesh_bufferidx;
      const my = scroller_component.mesh_bufferidx;
      const mw = controls_section.mesh_bufferidx;
      const mh = scroller_component.mesh_bufferidx;
      Vertex_buffer_group_create_scissorbox(controls_section.gfx.vb.groupidx, mx, my, mw, mh);
      // Vertex_buffer_group_create_scissorbox(label_text_mesh.gfx.vb.groupidx, mx, my, mw, mh);
   
   
      // Unfortunately must Re-render the menu_panel for the clipping of the scroller to take place
      Root_group_reset_gfxs(controls_section.root_bufferidx);
      Root_group_rerender_from_root_reconstruct_listeners(controls_section.root_bufferidx);

      Renderqueue_set_active(scroller_component.gfx.vb.groupidx, true);
   }




   // Set menu in focus
   Mesh_set_root_in_focus(menu_panel.root_bufferidx);


   // Create event callback for the close menu button to run
   const evt_clbk_params = {
      evt_clbks: ()=>{ params.params.menu_panel = null; }, 
   }

   menu_panel.CreateEventCallback(evt_clbk_params);
}