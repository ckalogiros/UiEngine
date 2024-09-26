"use strict";

import { Callback_animations_create } from "../Engine/Animations/CallbackAnimations.js";
import { Create_widget_button, Create_widget_section, Create_widget_slider } from "../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Screen_wpos_get_y } from "../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../Engine/Core/Views/RootView.js";
import { Debug_info_ui, Debug_info_ui_static } from "../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLUEL, GREY, YELLOW } from "../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../Engine/Drawables/Widgets/WidgetSlider.js";
import { Listeners_set_priority } from "../Engine/Events/EventListeners.js";
import { Scene_camera_scroll_add, Scene_camera_scroll_set } from "../Engine/Scenes.js";
import { AppReset } from "./App.js";
import { Create_ball_tail_particles, Demo_all, Demo_ball_tail_2 } from "./Demo/DemoParticles.js";
import { Elastic_collisions, Sattelite_rotation } from "./Demo/DemoPhysics.js";
import { Demo_widgets_button, Demo_widgets_dropdown, Demo_widgets_scrolled_labels, Demo_widgets_sections } from "./Demo/DemoWidgets.js";






export function Demo_page(create_demo_id = 1) {




   
   /*********************************************************************************************************************************************/
   // Create Slider for controling the uniform
   
   const slider_dim = [100, 12];
   // Rotation slider
   const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [VIEWPORT.RIGHT-slider_dim[0]*2 - 30, 100, 10], slider_dim, GREY[3], _, 'Inner Shadow');
   slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   slider.SetInitialValue(.4);




   
   /*********************************************************************************************************************************************/
   // Set slider callback

   Slider_connect(slider, (params, slider_val) => {
         return slider_val;
      }, null
   );



   if (create_demo_id === 1) { // Demos Widgets

      let total_height = 80; // For the debug_info ui
      const pad = 50;


      /* section/rect move */
      /* sections - hovering (no moving so that for android devices can hover on touch) */
      const sections = Demo_widgets_sections(_, [0, total_height], slider);
      total_height += sections.geom.dim[1] * 2 + pad;


      /* Button Switces  Slider */
      const btn = Demo_widgets_button(_, [0, total_height,], slider);
      total_height += btn.geom.dim[1] * 2 + pad;


      /* scrolling */
      const scroller = Demo_widgets_scrolled_labels(_, [0, total_height], _, slider);
      total_height += scroller.geom.dim[1] * 2 + pad;


      /* dropdown - move - hover */
      const dp = Demo_widgets_dropdown(_, [0, total_height], slider,)
      total_height += dp.geom.dim[1] * 2 + pad;


      /* Colorpicker */

      /* Coloring per vertex */

      /* Resizable widgets */



      // Debug_info_ui_static();

   }

   
   if (create_demo_id === 2) { // Demo Particles 

      // Demo_glow_particles_2();
      // Demo_smoke_2()


      Create_ball_tail_particles(_, 100);
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


   /****************************************************************************************************************************************************/
   // Create the reload button
   const pad = 10;
   // const load_page_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [pad, pad], [0, 0, 0], [VIEWPORT.WIDTH/2 - pad+2, 0], TRANSPARENCY(GREY[5], 1.),);
   const load_page_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [pad, pad], [0, 0, 0], [VIEWPORT.WIDTH/2 - pad-1, 0], TRANSPARENCY(GREY[5], 1.),);
   load_page_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   load_page_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   load_page_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
   load_page_panel.SetName('load_page_panel');
   
   const feather = 2;
   const rcorners = 8;
   const font = TEXTURES.CONSOLAS_12px;
   const text_col = TRANSPARENCY(GREY[3], 1.);

   /*******************************************************************************************/
   // Page 1 button
   const page1_btn = Create_widget_button(_, 'Page1', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, GREY[10], text_col, [5, 5], .5, [0, rcorners, 1.8], font);
   page1_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page1_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page1_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   load_page_panel.AddItem(page1_btn);

   page1_btn.Bind(
      () => {

         Callback_animations_create( // Scroll Up
            () => { // Run Animation

               if(create_demo_id !== 1){
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(1);
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


   /*******************************************************************************************/
   // Page 1 button
   const page2_btn = Create_widget_button(_, 'Page2', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, GREY[10], text_col, [5, 5], .5, [0, rcorners, 1.8], font);
   page2_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page2_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page2_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   load_page_panel.AddItem(page2_btn);

   page2_btn.Bind(
      () => {

         Callback_animations_create( // Scroll Up
            () => { // Run Animation

               if(create_demo_id !== 2){
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(2);
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


   /*******************************************************************************************/
   // Page 1 button
   // const page1_btn = Create_widget_button(_, 'Reload', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 140, 10, 10], _, GREY[10], text_col, [5, 5], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
   const page3_btn = Create_widget_button(_, 'Page3', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, GREY[10], text_col, [5, 5], .5, [0, rcorners, 1.8], font);
   page3_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page3_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   page3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   page3_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   load_page_panel.AddItem(page3_btn);
   
   page3_btn.Bind(
      () => {
         
         Callback_animations_create( // Scroll Up
            () => { // Run Animation
               
               if(create_demo_id !== 3){
                  AppReset(); // Reset all 
                  Scene_camera_scroll_set(_, 0);

                  // Create new page
                  Demo_page(3);
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



   load_page_panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_ROOT_WIDGET;
   load_page_panel.GenGfxCtx();
   load_page_panel.options = SECTION.HORIZONTAL|SECTION.RESIZE_PARENTY;
   load_page_panel.Calc_no_gfx_update();
   load_page_panel.Render()
   Root_group_activate_all_vbs_in_renderqueue(load_page_panel.root_bufferidx);

   load_page_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, load_page_panel.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(load_page_panel)
   Construct_listen_events_relations_from_mesh_tree(load_page_panel);
   
   // Listeners_set_priority(E.C, load_page_panel.listeners);
   Listeners_set_priority(E.C, page1_btn.listeners);
   Listeners_set_priority(E.C, page2_btn.listeners);
   Listeners_set_priority(E.C, page3_btn.listeners);

   // Mesh_unif_set_vb_root_wpos(load_page_panel.root_posidx, VIEWPORT.RIGHT - load_page_panel.geom.dim[0]*2, load_page_panel.geom.pos[1]);
   // load_page_panel.SetWposX(VIEWPORT.RIGHT - load_page_panel.geom.dim[0]*2)


   

   // const info_ui = Debug_info_ui_static(_, [0, load_page_panel.geom.dim[1]*2 + 4]);
   Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT); 
   // load_page_panel.AddItem(info_ui);
   
   
   
   
   
   /****************************************************************************************************************************************************/
   { // Create the button for going to the top

      const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Up', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 10], _, GREY[10], text_col, [5, 5], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 7);
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





   /****************************************************************************************************************************************************/
   // Render uniform control slider
   slider.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   slider.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, slider.mesh_bufferidx);

   slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
   slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
   slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
   slider.Render();
   Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
   slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(slider)
   Construct_listen_events_relations_from_mesh_tree(slider);


}
