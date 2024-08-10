"use strict";

import { Create_widget_button, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from '../../Engine/Core/CreateWidget.js';
import { View_build_group_from_root_mesh } from '../../Engine/Core/MeshBufferViews.js';
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from '../../Engine/Core/MeshUniformsBuffer.js';
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from '../../Engine/Core/Views/RootView.js';
import { BLUE, BLUEL, BLUER, GREEN, GREENL, GREENR, GREY, ORANGE, ORANGEL, ORANGER, PURPLE, PURPLEB, PURPLER, RED, REDL, TRANSPARENT, WHITE, YELLOW, YELLOWL, YELLOWR } from '../../Engine/Drawables/Material/Base/Colors.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../../Engine/Drawables/Operations/Recursions.js';
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from '../../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Dropdown_roots_set_root } from '../../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Slider_connect } from '../../Engine/Drawables/Widgets/WidgetSlider.js';
import { Listeners_set_priority } from '../../Engine/Events/EventListeners.js';
import { Vertex_buffer_group_create_scissorbox } from '../../Graphics/Buffers/VertexBuffers.js';
import { GetSequencedColor } from '../../Helpers/Helpers.js';




const l_pad = 10;
const t_pad = 20;




export function Demo_widgets_scrolled_labels(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0], num_items = 80, scroller_height = 150) {

   const colors = [
      RED[0], RED[1], RED[2], RED[3], RED[3], RED[4], RED[5], RED[6], RED[7], RED[8],
      REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8],
      ORANGEL[0], ORANGEL[1], ORANGEL[2], ORANGEL[3], ORANGEL[3], ORANGEL[4], ORANGEL[5], ORANGEL[6], ORANGEL[7], ORANGEL[8],
      ORANGE[0], ORANGE[1], ORANGE[2], ORANGE[3], ORANGE[3], ORANGE[4], ORANGE[5], ORANGE[6], ORANGE[7], ORANGE[8],
      ORANGER[0], ORANGER[1], ORANGER[2], ORANGER[3], ORANGER[3], ORANGER[4], ORANGER[5], ORANGER[6], ORANGER[7], ORANGER[8],
      YELLOW[0], YELLOW[1], YELLOW[2], YELLOW[3], YELLOW[3], YELLOW[4], YELLOW[5], YELLOW[6], YELLOW[7], YELLOW[8],
      YELLOWL[0], YELLOWL[1], YELLOWL[2], YELLOWL[3], YELLOWL[3], YELLOWL[4], YELLOWL[5], YELLOWL[6], YELLOWL[7], YELLOWL[8],
      GREENL[0], GREENL[1], GREENL[2], GREENL[3], GREENL[4], GREENL[5], GREENL[6], GREENL[7], GREENL[8],
      GREEN[0], GREEN[1], GREEN[2], GREEN[3], GREEN[4], GREEN[5], GREEN[6], GREEN[7], GREEN[8],
      GREENR[0], GREENR[1], GREENR[2], GREENR[3], GREENR[4], GREENR[5], GREENR[6], GREENR[7], GREENR[8],
      BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
      BLUE[0], BLUE[1], BLUE[2], BLUE[3], BLUE[4], BLUE[5], BLUE[6], BLUE[7], BLUE[8],
      BLUER[0], BLUER[1], BLUER[2], BLUER[3], BLUER[4], BLUER[5], BLUER[6], BLUER[7], BLUER[8],
      PURPLEB[0], PURPLEB[1], PURPLEB[2], PURPLEB[3], PURPLEB[4], PURPLEB[5], PURPLEB[6], PURPLEB[7], PURPLEB[8],
      PURPLE[0], PURPLE[1], PURPLE[2], PURPLE[3], PURPLE[4], PURPLE[5], PURPLE[6], PURPLE[7], PURPLE[8],
      PURPLER[0], PURPLER[1], PURPLER[2], PURPLER[3], PURPLER[4], PURPLER[5], PURPLER[6], PURPLER[7], PURPLER[8],
   ];
   const fontsize = 1;

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [pos[0] + l_pad, pos[1] + t_pad*2, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   if(!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets_scrolled_labels');
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;


   const scrolled_section = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .8));
   scrolled_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   scrolled_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
   scrolled_section.SetName('scrolled_section')
   section.AddItem(scrolled_section);


   // const count = colors.length;
   const count = 20;

   var label_text_mesh = null; // Copy the vertexbuffer index of the text meshes.
   for (let i = 0; i < count; i++) {

      const label = Create_widget_label(_, `${i}`, _, [0, 0, 2], fontsize, TRANSPARENCY(colors[i], 1.7), WHITE, [6, 4], _, _, TEXTURES.CONSOLAS_32px)
      label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
      scrolled_section.AddItem(label);
      label.SetName(`${i}`);
      label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

      label_text_mesh = label.text_mesh;
   }




   const info = Create_widget_label(_, 'This is a scrolled\nsection with labels.\nUse the handle\nto scroll.', _, [0, 0, 0], fontsize, ORANGER[4], WHITE, [10, 10], _, _, TEXTURES.CONSOLAS_12px,);
   // const info = Create_widget_label(_, 'scroll.', _, [0, 0, 0], fontsize, ORANGEL[6], WHITE, [10,10], _, _, TEXTURES.CONSOLAS_12px, );
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.AddItem(info);


   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

   section.Calc_no_gfx_update(); // Must be called here also otherwise the top margin is not calculated


   // View_build_group_from_root_mesh(section);
   View_build_group_from_root_mesh(scrolled_section);

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   scrolled_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scrolled_section.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);



   const scroller_component = Components_create_scroller_component(10, scroller_height, scrolled_section, 100);
   Scoller_component_gengfx_and_render(scroller_component, scrolled_section);
   Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(scrolled_section.root_posidx, scroller_component.root_posidx);
   Listeners_set_priority(E.C, scroller_component.listeners);
   section.AddChildScrollerIdx(scrolled_section.scroller_comp_idx);


   section.Calc_no_gfx_update();
   Scroller_component_calculate_handle_pos_dim(scrolled_section, scroller_component);

   // Set scissor box
   const mx = scrolled_section.mesh_bufferidx;
   const my = scroller_component.mesh_bufferidx;
   const mw = scrolled_section.mesh_bufferidx;
   const mh = scroller_component.mesh_bufferidx;
   Vertex_buffer_group_create_scissorbox(scrolled_section.gfx.vb.groupidx, mx, my, mw, mh);
   Vertex_buffer_group_create_scissorbox(label_text_mesh.gfx.vb.groupidx, mx, my, mw, mh);


   // Unfortunately must Re-render the section for the clipping of the scroller to take place
   Root_group_reset_gfxs(scrolled_section.root_bufferidx);
   Root_group_rerender_from_root_reconstruct_listeners(scrolled_section.root_bufferidx);


   // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scroller.scrolled_section);
   // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);


   return section;
}





export function Demo_widgets_sections(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0],) {

   /**
    * Each section can be assigned any kind and number of widgets
    * Each section can self align, based on VERTICAL-HORIZONTAL
    * The structure is a tree structuure, where each parent section incorporates other sections as children
    * Each section can be assigned an event. The structure of the events is again a tree structure for efficient search
    * The 
    * 
    * move is happening on a uniform, that is then added to each vertex position at the shader stage
    */

   
   const tr = 1.;
   const min_size = [10, 10];
   const pad = 10;
   
   const root_s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [pos[0]+l_pad, pos[1]+t_pad, 0], [100, 100], TRANSPARENCY(GREY[3], tr));
   root_s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   root_s.SetName('Demo_widgets_sections');
   if(!PLATFORM.ANY_SMARTPHONE_DEVICE) root_s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);



   

   /** Create the info for the uuser */
   const info = Create_widget_label(_, 'This is a dropdown\nsection with labels.\nUse the handle\nto scroll.', _, [0, 0, 0], _, ORANGER[4], WHITE, [10, 10], _, _, TEXTURES.CONSOLAS_12px,);
   // const info = Create_widget_label(_, 'scroll.', _, [0, 0, 0], fontsize, ORANGEL[6], WHITE, [10,10], _, _, TEXTURES.CONSOLAS_12px, );
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   root_s.AddItem(info);



   // root_s.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [0, 4, 2] })
   // root_s.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4)


   const l1_s = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[1], tr));
   l1_s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   // l1_s.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.EXPAND;
   l1_s.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;
   root_s.AddItem(l1_s);


   const l1_s1 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s.AddItem(l1_s1);
   {

      const grey11 = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
      grey11.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s1.AddItem(grey11);
      const red111 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOWL[9], tr));
      red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      grey11.AddItem(red111);
      const yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOWR[9], tr));
      yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      grey11.AddItem(yel_1);


      {
         const l4_s1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
         l4_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l1_s1.AddItem(l4_s1);
         const purp12 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLE[7], tr));
         purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.AddItem(purp12);
         const blue13 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[9], tr));
         blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.AddItem(blue13);
         const green14 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREEN[7], tr));
         green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.AddItem(green14);
      }
      {
         const l4_s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
         l4_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l1_s1.AddItem(l4_s1);
         const purp12 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLE[7], tr));
         purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.AddItem(purp12);
         const blue13 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[9], tr));
         blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.AddItem(blue13);
         const green14 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREEN[7], tr));
         green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.AddItem(green14);
      }
   }


   const l1_s2 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s.AddItem(l1_s2);
   {
      const purp12 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLE[7], tr));
      purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(purp12);
      const blue13 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[9], tr));
      blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(blue13);
      const green14 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREEN[7], tr));
      green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(green14);
      const yel_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOWR[8], tr));
      yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(yel_2);
      const red_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLER[7], tr));
      red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(red_4);
      const yel_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLEB[9], tr));
      yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(yel_4);
      const ora_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(ORANGEL[8], tr));
      ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(ora_4);
      const yel = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOW[8], tr));
      yel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s2.AddItem(yel);
   }


   const l1_s3 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s.AddItem(l1_s3);
   {
      {
         const l2_s1 = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[3], tr));
         l2_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l1_s3.AddItem(l2_s1);
         {
            {

               const gry1_1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(ORANGEL[9], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[8], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[6], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_1);
                  // const _2 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
                  // _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  // gry1_1.AddItem(_2);
               }
            }
            {

               const gry1_1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREENL[7], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[3], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[1], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_1);
               }
            }

         }
      }
      {
         const l2_s1 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
         l2_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l1_s3.AddItem(l2_s1);
         {
            {

               const gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLER[8], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[8], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[6], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_1);
                  // const _2 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
                  // _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  // gry1_1.AddItem(_2);
               }
            }
            {

               const gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLEB[9], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[3], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[1], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  gry1_1.AddItem(_1);
               }
            }

         }
      }
   }


   const black4 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   black4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s.AddItem(black4);



   const pin_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLER[7], tr));
   pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   black4.AddItem(pin_1);
   const blu_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[7], tr));
   blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   black4.AddItem(blu_1);



   const gry2_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[9], tr));
   gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   pin_1.AddItem(gry2_1);
   const gry2_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[6], tr));
   gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   pin_1.AddItem(gry2_2);
   const gry2_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[3], tr));
   gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   blu_1.AddItem(gry2_3);
   const gry2_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   blu_1.AddItem(gry2_4);




   root_s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   root_s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   root_s.options = SECTION.INHERIT | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   root_s.Calc_no_gfx_update();
   View_build_group_from_root_mesh(root_s);
   root_s.Render();
   Root_group_activate_all_vbs_in_renderqueue(root_s.root_bufferidx);
   root_s.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, root_s.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(root_s);
   Construct_listen_events_relations_from_mesh_tree(root_s);

   // root_s.StateEnable(MESH_STATE.IS_RESIZEABLE);
   // root_s.OnResize =  function(params){

   //    const root = params.params;

   //    // NOTE: We use the same element of the mesh's interval buffer for the resize event as the move event, they cannot both exist at the same time. 
   //    if (root.StateCheck(MESH_STATE.IN_GRAB) === 0 && root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

   //       const intervalIdx = root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
   //       Time_intervals_destroy_byidx(intervalIdx);
   //       root.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

   //       return;
   //    }

   //    const mouse_pos = MouseGetPos();


   //    // Set min dimentions. // TODO: Who decides for the minimum dimentions??????
   //    const pos = root.GetPosXY();
   //    const min_sizex = pos[0] + 80;
   //    const min_sizey = pos[1] + 80;
   //    let changes_hapened = false;



   //    if (mouse_pos[0] > min_sizex) {

   //       const sizex = mouse_pos[0] - pos[0];
   //       root.geom.dim[0] = sizex / 2;
   //       changes_hapened = true;
   //    }

   //    if (mouse_pos[1] > min_sizey) {

   //       const sizey = mouse_pos[1] - pos[1];
   //       root.geom.dim[1] = sizey / 2;
   //       changes_hapened = true;
   //    }



   //    if (changes_hapened) {


   //       Root_group_reset_gfxs(root.root_bufferidx)

   //       const root_pos = root.GetPosXY();
   //       const clip_left = root_pos[0];
   //       const clip_right = root_pos[0] + root.geom.dim[0] * 2;
   //       const clip_top = root_pos[1];
   //       const clip_bottom = root_pos[1] + root.geom.dim[1] * 2;

   //       // Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
   //       // for (let i = 0; i <= root.children.boundary; i++) {

   //       //    Clipy_from_tree_recursive(root.children.buffer[i], clip_top, clip_bottom);
   //       // }
   //       Clipx_from_group(root.group_bufferidxs[0], clip_left, clip_right);
   //       Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom) 

   //       // First reset the buffer that holds all meshes(per vertex buffer), because the 'AddFromGfx' is gonna populate the buuffer with the added mesh
   //       Root_group_vbidx_view_reset_mesh_per_vb_buffer(root.root_bufferidx);

   //       // root.Recalc_no_gfx_update();


   //       // const mouse_dif = MouseGetPosDif()
   //       // const dif = { x: mouse_dif.x / 2, y: -mouse_dif.y / 2 };
   //       // Root_group_resize_and_rerender(root.root_bufferidx, dif.x, dif.y);
   //       Root_group_rerender_from_root_reconstruct_listeners(root.root_bufferidx)
   //    }
   // }

   return root_s;
}





export function Demo_widgets_dropdown(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0],) {

   
   const dp_col = GREY[5];
   const dp_menu_col = ORANGER[8];


   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [pos[0] + l_pad, pos[1] + t_pad, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   if(!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets_dropdown')
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;



   

   /** Create the info for the uuser */
   const info = Create_widget_label(_, 'This is a dropdown\nsection with labels.\nUse the handle\nto scroll.', _, [0, 0, 0], _, ORANGER[4], WHITE, [10, 10], _, _, TEXTURES.CONSOLAS_12px,);
   // const info = Create_widget_label(_, 'scroll.', _, [0, 0, 0], fontsize, ORANGEL[6], WHITE, [10,10], _, _, TEXTURES.CONSOLAS_12px, );
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.AddItem(info);




   const pad = [10, 4]
   const margin = [5, 5]
   // const dp = Create_widget_dropdown(root_widget, `ROOT`, [pos[0] + 30, pos[1] + 30, 0], dp_col, dp_menu_col, WHITE, pad, _, _, _, _, margin);
   const dp = Create_widget_dropdown(_, `ROOT`, [0,0,1], dp_col, dp_menu_col, WHITE, pad, _, _, _, _, margin);

   section.AddItem(dp);

   Dropdown_roots_set_root(dp, dp);

   let zpos = 0;

   zpos++
   { // Many dps

      const sub_dp1_count = 1;
      const sub_dp2_count = 1;

      const col = GetSequencedColor();
      for (let i = 0; i < sub_dp1_count; i++) {

         const dpsub1 = Create_widget_dropdown(_, `Dropdown:${i}`, [0, 0, zpos + 1], dp_col, PURPLEB[7], WHITE, pad, _, _, _, _, margin);
         dp.AddToMenu(dpsub1);
         dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

         const col1 = GetSequencedColor(4)
         for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(_, `Dropdown:${i}${j}`, [0, 0, zpos + 2], dp_col, ORANGE[7], WHITE, pad, _, _, _, _, margin);
            dpsub1.AddToMenu(dpsub2);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
            // console.log()

            const col2 = GetSequencedColor(3)
            for (let k = 0; k < sub_dp2_count; k++) {

               const dpsub3 = Create_widget_dropdown(_, `Dropdown:${i}${j}${k}`, [0, 0, zpos + 3], dp_col, YELLOWL[6], WHITE, pad, _, _, _, _, margin);
               dpsub2.AddToMenu(dpsub3);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

               const col3 = GetSequencedColor(3)
               for (let k = 0; k < sub_dp2_count; k++) {

                  const dpsub4 = Create_widget_dropdown(_, `Dropdown:${i}${j}${k}`, [0, 0, zpos + 4], dp_col, GREENR[5], WHITE, pad, _, _, _, _, margin);
                  dpsub3.AddToMenu(dpsub4);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                  const l = Create_widget_label(_, 'label', _, _, _, GREY[3], _, [5, 5]);
                  l.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  dpsub4.AddToMenu(l);

                  
                  const s = Create_widget_section(_, SECTION.HORIZONTAL, [2, 2], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[2], .8));
                  // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
                  s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.AddToMenu(s);
                  // s.SetName('root section')
                  // s.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], BLUEL[9], 'sk1', [0, 10, 1.8]);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], GREEN[7], 'sk2', [0, 10, 1.8]);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOWR[8], 'sk1', [0, 10, 1.8]);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLEB[8], 'sk2', [0, 10, 1.8]);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLER[7], 'sk2', [0, 10, 1.8]);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], ORANGEL[8], 'sk2', [0, 10, 1.8]);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOW[8], 'sk2', [0, 10, 1.8]);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  
               }

            }
         }

      }
   }


   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

   // dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();

   section.Render()
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
   View_build_group_from_root_mesh(section);


   return section;
}





export function Demo_widgets_button(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos=[0,0], ) {


   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [pos[0] + l_pad, pos[1] + t_pad, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   if(!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets_button');
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;



   

   /** Create the info for the uuser */
   const info = Create_widget_label(_, 'This is a dropdown\nsection with labels.\nUse the handle\nto scroll.', _, [0, 0, 0], _, ORANGER[4], WHITE, [10, 10], _, _, TEXTURES.CONSOLAS_12px,);
   // const info = Create_widget_label(_, 'scroll.', _, [0, 0, 0], fontsize, ORANGEL[6], WHITE, [10,10], _, _, TEXTURES.CONSOLAS_12px, );
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.AddItem(info);


   /**************************************************************************************************************************************************/
   

   // Create Button Widget with counter on click
   {
      const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
      s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s.SetName('button panel');
      section.AddItem(s);
   
      const btn = Create_widget_button(_, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, BLUEL[7], WHITE, [5, 5], .5);
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s.AddItem(btn);
      
      const label = Create_widget_label(_, '000', _, _, _, GREY[2], GREENL[9], )
      s.AddItem(label);
      
      const params = {counter :0,}
      
      btn.Bind(
         (params)=>{
            // console.log(params.params.counter);
            
            params.params.counter++;
            label.text_mesh.RenderTextFromNumber(params.params.counter);
         }, 
         _, params, _,
      );
   }


   // Create Switch Widget
   {
      const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
      s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s.SetName('button panel');
      section.AddItem(s);
   
      const switch1 = Create_widget_switch_simple(_, [0,0,1], 20, _, _, 4);
      s.AddItem(switch1);
   
      switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
      
      const label = Create_widget_label(_, 'off', _, _, _, GREY[2], GREY[5], )
      s.AddItem(label);
      
      switch1.Bind(
         ()=>{
            
            const state = (switch1.isOn & 0x1) ? 'on' : 'off';
            const color = (switch1.isOn & 0x1) ? ORANGEL[9] : GREY[5];
            label.text_mesh.RenderTextFromString(state);
            label.text_mesh.SetColorRGB(color);
         }, 
         _, _, _,
      );
   }


   // Create Slider Widget
   {
      const s = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
      s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s.SetName('button panel');
      section.AddItem(s);
      
      // const pos = (root_widget & ROOT_WIDGETS.CREATE_ROOT) ? [200, 500, 0] : [0, 0, 0]
      const slider = Create_widget_slider(_, [0,0,1], [100, 10], TRANSPARENCY(YELLOWR[9], .6), _, 'Test slider',);
      slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider.SetInitialValue(0);
      s.AddItem(slider);

      const label = Create_widget_label(_, 'Move slider', _, _, _, GREY[2], GREY[5], )
      s.AddItem(label);

      const clbk_params = {label: label, slider:slider};

      Slider_connect(slider, 
         (params)=>{
            
            const slider = params.clbk_params.slider;
            const label = params.clbk_params.label;
            if(label.gfx === null) return;
            
            // const dist = (slider.geom.dim[0] - label.geom.dim[0]) * slider.GetValue();
            const dist = label.geom.pos[0] +( label.geom.dim[0] ) * slider.GetValue();

            if(label.gfx) label.SetPosX(dist);
         }, 
         clbk_params,
      );

   }
   


   
   
   
   /**************************************************************************************************************************************************/
   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   
   section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();
   
   section.Render()
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   
   { // Animations
      // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
      // View_build_group_from_root_mesh(section);
      
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, btn, .001, 0.6, .6, 0)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .002, 0.4, .8, .4)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, btn, .003, 0.2, .8, .8)
      
      // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .01, 0.6, 1.)
      // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGBA, btn, .01, 0.4, 1.)
      // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, btn, .01, 0.0, 1., 0)
      // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.A, btn, .01, .0, 1., .0)
      
      // // btn.text_mesh.SetColorRGB(BLUE_10_120_220);
      
      // // btn.Align(ALIGN.LEFT | ALIGN.TOP, [0, 0]);
      // // btn.Align(ALIGN.RIGHT | ALIGN.BOTTOM, [15, 5]);
      // text.text_mesh.RenderTextFromNumber(0);
   }
   
   return section;
}






export function Demo_widgets_colorpicker(x = 0, y = 0, render_instanced_flags = 0x0, root_widget = ROOT_WIDGETS.CREATE_ROOT) {

   const picker = Create_widget_color_picker(root_widget, SECTION.VERTICAL, [20, 20], [x, y + 40, 0], [300, 200], [GREY[0], GREY[1], GREY[0], GREY[1]], _, [0, 35, 2]);
   // const picker = Create_widget_color_picker(root_widget, SECTION.VERTICAL, [20, 20], [x, y + 40, 0], [300, 200], [TRANSPARENT, TRANSPARENT, TRANSPARENT, TRANSPARENT], _, [0, 35, 2]);
   picker.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   // picker.StateEnable(MESH_STATE.IS_RESIZEABLE);

   picker.sid.inst = render_instanced_flags;

   picker.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // picker.EnableGfxUniforms({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {



       picker.ColorpickerCreateListeners();
       // picker.StateEnable(MESH_STATE.IS_RESIZEABLE);

       picker.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

       // picker.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN;
       picker.Calc_no_gfx_update();
       picker.Render();
       Root_group_activate_all_vbs_in_renderqueue(picker.root_bufferidx);
       picker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, picker.gfx.vb.groupidx)

       Construct_listen_events_from_mesh_tree(picker);
       Construct_listen_events_relations_from_mesh_tree(picker);
   }

   return picker;

}