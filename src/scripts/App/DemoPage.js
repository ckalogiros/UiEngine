"use strict";

import { Callback_animations_create } from "../Engine/Animations/CallbackAnimations.js";
import { Create_widget_button, Create_widget_section } from "../Engine/Core/CreateWidget.js";
import { Widget_root_activate_all_vbs_in_renderqueue } from "../Engine/Core/MeshBuffer.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Screen_wpos_get_y, Screen_wpos_set_y } from "../Engine/Core/MeshUniformsBuffer.js";
import { Debug_info_ui_static } from "../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLUEL, GREY } from "../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Drawables/Operations/Recursions.js";
import { Listeners_set_priority } from "../Engine/Events/EventListeners.js";
import { AppReset } from "./App.js";
import { Demo_all, Demo_ball_tail_2 } from "./Demo/DemoParticles.js";
import { Elastic_collisions, Sattelite_rotation } from "./Demo/DemoPhysics.js";
import { Demo_widgets_button, Demo_widgets_dropdown, Demo_widgets_scrolled_labels, Demo_widgets_sections } from "./Demo/DemoWidgets.js";






export function Demo_page(create_demo_id = 1) {


   if (create_demo_id === 1) { // Demos Widgets

      let y = 0;
      const pad = 50;
      /* section/rect move */
      /* sections - hovering (no moving so that for android devices can hover on touch) */
      const sections = Demo_widgets_sections(_, [0, y]);
      y += sections.geom.dim[1] * 2 + pad;


      /* label - move - hover */
      /* Button - click(with counter?) */
      /* Switces */
      /* Slider */
      const btn = Demo_widgets_button(_, [0, y]);
      y += btn.geom.dim[1] * 2 + pad;


      /* scrolling */
      const scroller = Demo_widgets_scrolled_labels(_, [0, y]);
      y += scroller.geom.dim[1] * 2 + pad;


      /* dropdown - move - hover */
      const dp = Demo_widgets_dropdown(_, [0, y],)
      y += dp.geom.dim[1] * 2 + pad;


      /* Colorpicker */

      /* Coloring per vertex */

      /* Resizable widgets */



      Debug_info_ui_static();

   }

   if (create_demo_id === 2) { // Demo Particles 

      // Demo_glow_particles_2();
      // Demo_smoke_2()


      // Demo_ball_tail();
      // Demo_ball_tail_2();
      Demo_all();

      Debug_info_ui_static();

   }


   if (create_demo_id === 3) { // Demos Physics

      const total_height = Elastic_collisions()

      Sattelite_rotation([0, total_height * 2 + 100]);

      Debug_info_ui_static();
   }


   /****************************************************************************************************************************************************/
   // Create the reload button

   const load_page_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [VIEWPORT.RIGHT - 160, VIEWPORT.TOP+10, 0], [0, 0], TRANSPARENCY(GREY[5], .5));
   load_page_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   load_page_panel.SetName('load_page_panel')
   
   const round = 12;
   const font = TEXTURES.CONSOLAS_12px;

   /*******************************************************************************************/
   // Page 1 button
   const page1_btn = Create_widget_button(_, 'Page1', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, round, 1.8], font);
   page1_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page1_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   load_page_panel.AddItem(page1_btn);

   page1_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation


               if(create_demo_id !== 1){
                  AppReset(); // Reset all 
                  // Create new page
                  Demo_page(1);
                  Screen_wpos_set_y(0);
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
   const page2_btn = Create_widget_button(_, 'Page2', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, round, 1.8], font);
   page2_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page2_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   load_page_panel.AddItem(page2_btn);

   page2_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation

               if(create_demo_id !== 2){
                  AppReset(); // Reset all 
                  // Create new page
                  Demo_page(2);
                  Screen_wpos_set_y(0);
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
   // const page1_btn = Create_widget_button(_, 'Reload', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 140, 10, 10], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
   const page3_btn = Create_widget_button(_, 'Page3', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, round, 1.8], font);
   page3_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   page3_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   load_page_panel.AddItem(page3_btn);
   load_page_panel.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;

   page3_btn.Bind(
      (params) => {

         Callback_animations_create( // Scroll Up
            (params) => { // Run Animation

               if(create_demo_id !== 3){
                  AppReset(); // Reset all 
                  // Create new page
                  Demo_page(3);
                  Screen_wpos_set_y(0);
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


   load_page_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   load_page_panel.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
   load_page_panel.Calc_no_gfx_update();
   load_page_panel.Render()
   Widget_root_activate_all_vbs_in_renderqueue(load_page_panel.root_bufferidx);

   load_page_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, load_page_panel.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(load_page_panel)
   Construct_listen_events_relations_from_mesh_tree(load_page_panel);
   
   // Listeners_set_priority(E.C, load_page_panel.listeners);
   Listeners_set_priority(E.C, page1_btn.listeners);
   Listeners_set_priority(E.C, page2_btn.listeners);
   Listeners_set_priority(E.C, page3_btn.listeners);

   Mesh_unif_set_vb_root_wpos(load_page_panel.root_posidx, VIEWPORT.RIGHT - load_page_panel.geom.dim[0]*2, load_page_panel.geom.pos[1]);
   // load_page_panel.SetWposX(VIEWPORT.RIGHT - load_page_panel.geom.dim[0]*2)


   
   
   
   
   
   
   
   /****************************************************************************************************************************************************/
   { // Create the button for going to the top

      const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Up', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 10], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      btn.Bind(
         (params) => {

            Callback_animations_create( // Scroll Up
               (params) => { // Run Animation

                  const unif_wpos = Screen_wpos_get_y();
                  if (unif_wpos < 0) {

                     const ypos = unif_wpos / 2;
                     Screen_wpos_set_y(ypos);
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


      btn.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
      btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
      btn.Render()
      Widget_root_activate_all_vbs_in_renderqueue(btn.root_bufferidx);

      btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(btn)
      Construct_listen_events_relations_from_mesh_tree(btn);

      Listeners_set_priority(E.C, btn.listeners);

   }
}
