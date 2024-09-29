"use strict";

import { Callback_animations_create } from "../Engine/Animations/CallbackAnimations.js";
import { Create_widget_button, Create_widget_close_btn, Create_widget_dropdown, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from "../Engine/Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx } from "../Engine/Core/MeshBuffer.js";
import { View_build_group_from_root_mesh } from "../Engine/Core/MeshBufferViews.js";
import { Mesh_unif_get_vb_root_wpos, Screen_wpos_get_y } from "../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_vbidx_view_view_get } from "../Engine/Core/Views/RootView.js";
import { Debug_info_ui, Debug_info_ui_static } from "../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLUEL, GREENL, GREY, WHITE, YELLOW } from "../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_get_uniform_ubidx_from_name } from "../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Drawables/Operations/Recursions.js";
import { Dropdown_roots_set_root } from "../Engine/Drawables/Widgets/Widget_Dropdown.js";
import { Slider_connect, Slider_set_listeners_priority } from "../Engine/Drawables/Widgets/WidgetSlider.js";
import { Listeners_set_priority } from "../Engine/Events/EventListeners.js";
import { Scene_camera_scroll_add, Scene_camera_scroll_set } from "../Engine/Scenes.js";
import { Vertex_buffer_set_and_update_uniform } from "../Graphics/Buffers/VertexBuffers.js";
import { Gl_set_rgba } from "../Graphics/Buffers/VertexBuffersOps.js";
import { Abs, CopyArr4 } from "../Helpers/Math/MathOperations.js";
import { AppReset } from "./App.js";
import { Create_ball_tail_glow_contols, Create_ball_tail_particles, Create_ball_tail_particles_contols, Demo_all, Demo_ball_tail_2 } from "./Demo/DemoParticles.js";
import { Elastic_collisions, Sattelite_rotation } from "./Demo/DemoPhysics.js";
import { Demo_widgets_button, Demo_widgets_colorpicker, Demo_widgets_dropdown, Demo_widgets_scrolled_labels, Demo_widgets_sections } from "./Demo/DemoWidgets.js";





const page1_text = 'Demo Widgets';
const page2_text = 'Demo Particles';
const page3_text = 'Demo Physics';
const page4_text = 'Demo Snake';




export function Demo_page(create_demo_id = 2) {




   
   /*********************************************************************************************************************************************/
   // Create Slider for controling the uniforms

   const shade_menu_btn = Create_widget_dropdown(_, `Shade`, [0, 0, 0], GREENL[5], GREY[3], WHITE, [6, 4], _, _, _, _, [8, 8]);
   shade_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   shade_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   shade_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   shade_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   shade_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   shade_menu_btn.SetName('shade_menu_btn');
   shade_menu_btn.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   Dropdown_roots_set_root(shade_menu_btn, shade_menu_btn);
   shade_menu_btn.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, shade_menu_btn.mesh_bufferidx);


   const slider_dim = [100, 12];
   
   // Create Slider for controling the uniform 'Distance'
   const slider_distance = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Distance');
   slider_distance.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider_distance.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   slider_distance.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
   slider_distance.SetInitialValue(.11);
   shade_menu_btn.AddToMenu(slider_distance);
   
   
   
   // Create Slider for controling the uniform 'Smoothness'
   const slider_smoothness = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Smoothness');
   slider_smoothness.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider_smoothness.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER,2);
   slider_smoothness.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS,1);
   slider_smoothness.SetInitialValue(.11);
   shade_menu_btn.AddToMenu(slider_smoothness);
   
   
   
   // Create Slider for controling the uniform 'Intensity'
   const slider_intensity = Create_widget_slider(_, [0, 0, 10], slider_dim, GREY[3], _, 'Intensity');
   slider_intensity.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider_intensity.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER,2);
   slider_intensity.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS,1);
   slider_intensity.SetInitialValue(1.);
   shade_menu_btn.AddToMenu(slider_intensity);



   let particles_buffers = null;







   /*********************************************************************************************************************************************/
   // Create Demos Functions

   if (create_demo_id === 1) { // Demos Widgets

      let total_height = 80; // For the debug_info ui
      const pad = 50;


      /* section/rect move */
      /* sections - hovering (no moving so that for android devices can hover on touch) */
      const sections = Demo_widgets_sections(_, [0, total_height], slider_distance, slider_smoothness, slider_intensity);
      total_height += sections.geom.dim[1] * 2 + pad;


      /* Button Switces  Slider */
      const widgets = Demo_widgets_button(_, [0, total_height,], slider_distance, slider_smoothness, slider_intensity);
      total_height += widgets.geom.dim[1] * 2 + pad;


      /* scrolling */
      const scroller = Demo_widgets_scrolled_labels(_, [0, total_height], _, slider_distance, slider_smoothness, slider_intensity);
      total_height += scroller.geom.dim[1] * 2 + pad;


      /* dropdown - move - hover */
      const dp = Demo_widgets_dropdown(_, [0, total_height], slider_distance, slider_smoothness, slider_intensity)
      total_height += dp.geom.dim[1] * 2 + pad;


      /* Colorpicker */

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

   
   if (create_demo_id === 2) { // Demo Particles 

      // Demo_glow_particles_2();
      // Demo_smoke_2()


      particles_buffers  = Create_ball_tail_particles(_, 100, _, _, _, 0x0, false);
      // Demo_ball_tail_2();
      // Demo_all();

      // Debug_info_ui_static();

   }


   if (create_demo_id === 3) { // Demos Physics
      
      let total_height = 60; // Fo the debug_info ui

      total_height += Elastic_collisions([0, total_height]);


      Sattelite_rotation([0, total_height * 2 + 100]);

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
      mnemonics:{demo_id:create_demo_id,}, // Remember variable values between different pages
   }; 
   
   Load_menu_btn.Bind(
      Load_menu_callback,
      _, load_clbk_params, _,
   );




   /*******************************************************************************************/
   // Options menu button
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
      mnemonics:{demo_id:create_demo_id,}, // Remember variable values between different pages
      particles_buffers:particles_buffers,
      // tail_particles_buffer:particles_buffers.tail_particles_buffer,
      // glow_particles_buffer:particles_buffers.glow_particles_buffer,
   }; 
   
   options_menu_btn.Bind(
      Options_menu_callback,
      _, options_clbk_params, _,
   );

   
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
   
   // // Listeners_set_priority(E.C, window_menu.listeners);
   // // Listeners_set_priority(E.C, shade_menu_btn.listeners);
   // Listeners_set_priority(E.C, page1_btn.listeners);
   // Listeners_set_priority(E.C, page2_btn.listeners);
   // Listeners_set_priority(E.C, page3_btn.listeners);

   // Mesh_unif_set_vb_root_wpos(window_menu.root_posidx, VIEWPORT.RIGHT - window_menu.geom.dim[0]*2, window_menu.geom.pos[1]);
   // window_menu.SetWposX(VIEWPORT.RIGHT - window_menu.geom.dim[0]*2)


   

   // const info_ui = Debug_info_ui_static(_, [0, window_menu.geom.dim[1]*2 + 4]);
   // Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT); 
   // window_menu.AddItem(info_ui);
   
   


   View_build_group_from_root_mesh(shade_menu_btn);
   
   
   
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
                     console.log('ypos', ypos, 'unif_wpos', unif_wpos)
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









   /**SAVE-RENDER CONTOL SLIDERS */
   /****************************************************************************************************************************************************/
   // Render uniform control sliders
   // slider.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   // slider.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider.mesh_bufferidx);

   // slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
   // slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
   // slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
   // slider.Render();
   // Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
   // slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

   // Construct_listen_events_from_mesh_tree(slider);
   // Construct_listen_events_relations_from_mesh_tree(slider);
   // slider.AddWposY(100);



   // // Secont uniform slider
   // slider_smoothness.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   // slider_smoothness.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_smoothness.mesh_bufferidx);

   // slider_smoothness.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // slider_smoothness.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
   // slider_smoothness.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
   // slider_smoothness.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
   // slider_smoothness.Render();
   // Root_group_activate_all_vbs_in_renderqueue(slider_smoothness.root_bufferidx);
   // slider_smoothness.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_smoothness.gfx.vb.groupidx)

   // Construct_listen_events_from_mesh_tree(slider_smoothness);
   // Construct_listen_events_relations_from_mesh_tree(slider_smoothness);

   // slider_smoothness.AddWposY(155);



   // // Secont uniform slider
   // slider_intensity.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   // slider_intensity.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider_intensity.mesh_bufferidx);

   // slider_intensity.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // slider_intensity.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
   // slider_intensity.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
   // slider_intensity.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
   // slider_intensity.Render();
   // Root_group_activate_all_vbs_in_renderqueue(slider_intensity.root_bufferidx);
   // slider_intensity.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_intensity.gfx.vb.groupidx)

   // Construct_listen_events_from_mesh_tree(slider_intensity);
   // Construct_listen_events_relations_from_mesh_tree(slider_intensity);



   // Secont uniform slider
   // shade_menu_btn.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   // // shade_menu_btn.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, shade_menu_btn.mesh_bufferidx);

   // shade_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // // shade_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
   // // shade_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
   // // shade_menu_btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
   // // shade_menu_btn.Render();
   // // Root_group_activate_all_vbs_in_renderqueue(shade_menu_btn.root_bufferidx);
   // // shade_menu_btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, shade_menu_btn.gfx.vb.groupidx);
   
   // // Construct_listen_events_from_mesh_tree(shade_menu_btn);
   // // Construct_listen_events_relations_from_mesh_tree(shade_menu_btn);


   // // shade_menu_btn.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   // shade_menu_btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
   // shade_menu_btn.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   // shade_menu_btn.Calc_no_gfx_update();

   // shade_menu_btn.Render();
   
   // Root_group_activate_all_vbs_in_renderqueue(shade_menu_btn.root_bufferidx);

   // Construct_listen_events_from_mesh_tree(shade_menu_btn);
   // Construct_listen_events_relations_from_mesh_tree(shade_menu_btn);

   // shade_menu_btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, shade_menu_btn.gfx.vb.groupidx);



}





function Load_menu_callback(params){

   if (params.params.menu_panel !== null) return;
   // if (STATE.loop.paused === false) STATE.loop.paused = true;
   // else STATE.loop.paused = false;


   // const create_demo_id = params.params.mnemonics.create_demo_id;




   const dim = [
      (VIEWPORT.WIDTH/2  >= 180) ? 180 : VIEWPORT.WIDTH/2 - 10, 
      (VIEWPORT.HEIGHT/2 >= 250) ? 250 : VIEWPORT.HEIGHT/2 - 10,
   ];
   let zpos = 10;
   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 10], dim, TRANSPARENCY(GREY[3], .9), 'section', );
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_panel.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
   menu_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0]/10);
   menu_panel.SetName('MenuOptionsPanel');
   
   params.params.menu_panel = menu_panel;


   zpos++;





   /*************************************************************************************************/
   // Menu Options

   const feather = 2;
   const rcorners = 8;
   const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;
   const btn_col = TRANSPARENCY(GREY[1], .8);

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
   // Close button
   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, btn_col, WHITE, [dim[0]/2-pad*2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.SetName('close_btn');         
   menu_panel.AddItem(close_btn);

   // Must recalculate all children meshes position offsets
   page1_btn.MoveNoGfxUpdate(dim[0] - page1_btn.geom.dim[0], ypos); ypos += page1_btn.geom.dim[1]*2 + 10;
   page2_btn.MoveNoGfxUpdate(dim[0] - page2_btn.geom.dim[0], ypos ); ypos += page1_btn.geom.dim[1]*2 + 10;
   page3_btn.MoveNoGfxUpdate(dim[0] - page3_btn.geom.dim[0], ypos ); ypos += page1_btn.geom.dim[1]*2 + 10;
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
   
   
   // Give menu items listen events priority 
   // Listeners_set_priority(E.C, menu_panel.listeners);



   // Create event callback for when the close menu button has been pressed
   const evt_clbk_params = {
      evt_clbks: ()=>{ params.params.menu_panel = null; }, 
   }

   menu_panel.CreateEventCallback(evt_clbk_params);

}





// function Options_menu_callback(demo_id, ball_tail_particles_buffer=null, ball_tail_glow_particles_buffer=null){
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
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
   menu_panel.SetName('MenuOptionsPanel');
   
   params.params.menu_panel = menu_panel;
   const demo_id = params.params.mnemonics.demo_id;


   if(demo_id === 2)
   {

      const glow_particles_buffer = params.params.particles_buffers.glow_particles_buffer;
      const tail_particles_buffer = params.params.particles_buffers.tail_particles_buffer;

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
      // Create the switch to create/destroy colorpicker for particles color control
      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, BLUEL[6], _);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider_section.AddItem(colorpicker_switch);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.Bind(
         (params) => {

            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
             */
            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;


            if (isOn) {
               // How should this callback know about the colorpicker, so that it can destroy it???????

               const colorpicker = Demo_widgets_colorpicker(10, dim[1] * 2, _, ROOT_WIDGETS.CREATE_ROOT);
               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;
                  // Gl_set_rgba(slider_section.gfx, color, slider_section.geom.num_faces);

                  CopyArr4(tail_particles_buffer[0].mat.col, color);
                  CopyArr4(glow_particles_buffer[0].mat.col, color);
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {

               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, null,
      );


      const ball_tail_contols = Create_ball_tail_particles_contols(tail_particles_buffer, TRANSPARENCY(GREY[2], tr));
      for(let i = 0; i < ball_tail_contols.length; i++){
         slider_section.AddItem(ball_tail_contols[i]);
      }


      const glow_contols = Create_ball_tail_glow_contols(glow_particles_buffer);
      for(let i = 0; i < glow_contols.length; i++){
         slider_section.AddItem(glow_contols[i]);
      }

      menu_panel.AddItem(slider_section);

      slider_section.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      slider_section.Calc_no_gfx_update();
      const center = (menu_panel.geom.dim[0] - slider_section.geom.dim[0]);
      slider_section.MoveNoGfxUpdate(center, ypos); ypos += slider_section.geom.dim[1]*2 + 10;

   }
   
   
   /*******************************************************************************************/
   // Close button
   const close_btn = Create_widget_close_btn(_, menu_panel, 'CLOSE', [0, 0, zpos], 30, btn_col, WHITE, [dim[0]/2-pad*2, 6], _, _, _);
   close_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   close_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, close_btn.geom.dim[1]);
   close_btn.SetName('close_btn');         
   menu_panel.AddItem(close_btn);

   
   // Must recalculate all children meshes position offsets
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
   
   
   // Give menu items listen events priority 
   // Listeners_set_priority(E.H, menu_panel.listeners);
   // Listeners_set_priority(E.C, menu_panel.listeners);


   // Create event callback for when the close menu button has been pressed
   const evt_clbk_params = {
      evt_clbks: ()=>{ params.params.menu_panel = null; }, 
   }

   menu_panel.CreateEventCallback(evt_clbk_params);
}