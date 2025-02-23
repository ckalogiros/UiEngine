"use strict";

import { Create_widget_button, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from '../../Engine/Core/CreateWidget.js';
import { View_build_group_from_root_mesh } from '../../Engine/Core/Views/MeshBufferViews.js';
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from '../../Engine/Core/MeshUniformsBuffer.js';
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from '../../Engine/Core/Views/RootView.js';
import { BLUE, BLUEL, BLUER, CYAN, GREEN, GREENL, GREENR, GREY, MAGENTA, ORANGE, ORANGEL, ORANGER, PURPLE, PURPLEB, PURPLER, RED, REDL, TRANSPARENT, WHITE, YELLOW, YELLOWL, YELLOWR } from '../../Engine/Drawables/Material/Base/Colors.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../../Engine/Drawables/Operations/Recursions.js';
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from '../../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Dropdown_roots_set_root } from '../../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Slider_connect } from '../../Engine/Drawables/Widgets/WidgetSlider.js';
import { Listeners_set_priority } from '../../Engine/Events/EventListeners.js';
import { Vertex_buffer_group_create_scissorbox } from '../../Graphics/Buffers/VertexBuffers.js';
import { Gl_set_rgba } from '../../Graphics/Buffers/VertexBuffersOps.js';
import { GetRandomColor, GetSequencedColor } from '../../Helpers/Helpers.js';
import { CopyArr4 } from '../../Helpers/Math/MathOperations.js';
import { Mesh_create_style_from_values } from '../../Engine/Drawables/Operations/MeshHelperFunctions.js';
import { Widget_msdf_text_with_scale_slider } from '../Widgets/ReadyWidgets.js';
import { Renderqueue_set_priority_by_vb } from '../../Engine/Renderers/Renderer/RenderQueue.js';




const l_pad = 10;
const t_pad = 20;
let default_font = TEXTURES.CONSOLAS_16px
// let default_font = TEXTURES.MSDF_CONSOLAS_1024 
const default_font_size = 7


// Create Per vertex coloring demo

// Create Gardient coloring demo

export function Demo_widgets_explainer_info(pos = [0, 0]) {


   const text_sample_explainer1 = `\
This page features a collection of simple widgets.
Some are interactive, allowing you to hover,
click, drag or move them with the mouse.\
   `;
   const text_sample_explainer2 = `\
The top menu bar includes a "Demos" button for
navigating to various demo pages and an "Options"
button for customizing parameters specific to the
current page. Note that some pages offer customization
options while others do not.
Below the menu bar, you'll find an FPS performance
indicator along with key application information.\
   `;
   const text_sample_explainer3 = `\
You can scroll-down any page using the mouse wheel.
If you find yourself off track, simply click the
button located in the bottom-right corner to
quickly return to the top of the page.\
   `;
   const text_sample_explainer4 = `\
Feel free to \"Pause"\ at any time by
pressing the \"p\" key on the keyboard.\
   `;







   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [pos[0] + l_pad, pos[1] + t_pad, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets');





   /** Create the info for the user */
   const s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [pos[0] + l_pad, pos[1] + t_pad, 0], [0, 0], TRANSPARENCY(GREY[1], .4));
   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   s.SetName('Demo_widgets');
   section.AddItem(s);

   const font = TEXTURES.MSDF_CONSOLAS_1024;
   // const font = TEXTURES.MSDF_COMIC_1024;
   const default_font = 10;
   const info1 = Create_widget_label(_, text_sample_explainer1, _, [0, 0, 2], default_font, GREY[4], WHITE, [10, 10], _, _, font,);
   {
      info1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info1);
   }
   const info2 = Create_widget_label(_, text_sample_explainer2, _, [0, 0, 2], default_font, TRANSPARENT, WHITE, [10, 10], _, _, font,);
   {
      info2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info2);
   }
   const info3 = Create_widget_label(_, text_sample_explainer3, _, [0, 0, 2], default_font, TRANSPARENT, WHITE, [10, 10], _, _, font,);
   {
      info3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info3);
   }
   const info4 = Create_widget_label(_, text_sample_explainer4, _, [0, 0, 2], default_font, TRANSPARENT, WHITE, [10, 10], _, _, font,);
   {
      info4.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info4);
   }






   /**************************************************************************************************************************************************/
   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();

   section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();

   section.Render()
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);



   info1.text_mesh.SetColorRGBSpecificIndex(BLUEL[9], 88, 5);
   info1.text_mesh.SetColorRGBSpecificIndex(BLUEL[9], 94, 5);
   info1.text_mesh.SetColorRGBSpecificIndex(BLUEL[9], 101, 4);
   info1.text_mesh.SetColorRGBSpecificIndex(BLUEL[9], 109, 4);

   info2.text_mesh.SetColorRGBSpecificIndex(YELLOWR[9], 28, 7);
   info2.text_mesh.SetColorRGBSpecificIndex(YELLOWR[9], 85, 10);
   info2.text_mesh.SetColorRGBSpecificIndex(GREEN[7], 261, 3);

   info3.text_mesh.SetColorRGBSpecificIndex(BLUEL[9], 8, 11);

   info4.text_mesh.SetColorRGBSpecificIndex(PURPLE[9], 48, 3);

   return section;
}




export function Demo_widgets_scrolled_labels(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0], scroller_height = 150, control_slider_distance = null, control_slider_smoothness = null, control_slider_intensity = null) {

   const text_sample_scroller = `\
WIDGET SCROLLER\
   `;

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
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) default_font = TEXTURES.CONSOLAS_16px;
   const style = { rcorners: 10, feather: 2, border: 0 };


   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [pos[0] + l_pad, pos[1] + t_pad * 2, 0], [0, scroller_height], TRANSPARENCY(GREY[3], .4), _, style);
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // section.EnableGfxUniforms({ unif: SID.UNIF.FS_RCORNERS_VEC3, }, 'u_rcorners', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets_scrolled_labels');







   const info = Create_widget_label(_, text_sample_scroller, _, [0, 0, 0], default_font_size, GREY[4], WHITE, [10, 10], _, _, default_font,);
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   info.gfx_ctx_flags |= GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.AddItem(info);


   const scrolled_section = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .8), _, style);
   scrolled_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   scrolled_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   scrolled_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, scrolled_section.mesh_bufferidx, true);
   scrolled_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE; // Remove the PRIVATE flag so that the scrolled section will
   scrolled_section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
   scrolled_section.SetName('scrolled_section');
   section.AddItem(scrolled_section);



   const count = 100;

   var label_text_mesh = null; // Copy the vertexbuffer index of the text meshes.
   for (let i = 0; i < count; i++) {

      const label = Create_widget_label(_, `${i}`, _, [0, 0, 2], default_font, TRANSPARENCY(GetRandomColor(), 1.7), WHITE, [6, 4], _, _, TEXTURES.CONSOLAS_32px)
      label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      label.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled_section.mesh_bufferidx);
      scrolled_section.AddItem(label);
      label.SetName(`${i}`);
      label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

      label_text_mesh = label.text_mesh;
   }



   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

   section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENTX;
   // section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENTX | SECTION.FIXED_W;
   // section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENTX | SECTION.EXPAND;
   section.Calc_no_gfx_update();


   View_build_group_from_root_mesh(scrolled_section);

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   scrolled_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scrolled_section.gfx.vb.groupidx);


   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);



   const height = scroller_height - info.geom.dim[1] * 2 + 10;
   const scroller_component = Components_create_scroller_component(10, height, scrolled_section, 100);
   Scoller_component_gengfx_and_render(scroller_component, scrolled_section);
   Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(scrolled_section.root_posidx, scroller_component.root_posidx);
   Listeners_set_priority(E.C, scroller_component.listeners);
   section.AddChildScrollerIdx(scrolled_section.scroller_comp_idx);

   // scrolled_section.Calc_no_gfx_update();
   Scroller_component_calculate_handle_pos_dim(scrolled_section, scroller_component);

   // Set scissor box
   const mx = scrolled_section.mesh_bufferidx;
   const my = scroller_component.mesh_bufferidx;
   const mw = scrolled_section.mesh_bufferidx;
   const mh = scroller_component.mesh_bufferidx;
   Vertex_buffer_group_create_scissorbox(scrolled_section.gfx.vb.groupidx, mx, my, mw, mh);
   Vertex_buffer_group_create_scissorbox(scrolled_section.children.buffer[0].text_mesh.gfx.vb.groupidx, mx, my, mw, mh);


   // Unfortunately must Re-render the menu_panel for the clipping of the scroller to take place
   Root_group_reset_gfxs(scrolled_section.root_bufferidx);
   Root_group_rerender_from_root_reconstruct_listeners(scrolled_section.root_bufferidx);



   // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scroller.scrolled_section);
   // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);


   return section;
}





export function Demo_widgets_sections(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0], control_slider_distance = null, control_slider_smoothness = null, control_slider_intensity = null) {

   const text_sample_sections = `\
WIDGET: SECTION
The Section widget serves as the foundation for all other widgets.
Its primary functionality is to align its items in a simple manner,
either horizontally or vertically.
Key features include:
- Automatically resizing child sections to accommodate other widgets,
such as buttons and labels.
- Repositioning all items based on a specified
alignment flag (VERTICAL or HORIZONTAL).
By combining vertical and horizontal alignment,
sections enable the creation of structured,
nested layouts with well-aligned items.\
   `;

   const tr = 1.;
   const min_size = [10, 10];
   const pad = 10;
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) default_font = TEXTURES.CONSOLAS_16px;

   const root_s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [pos[0] + l_pad, pos[1] + t_pad, 0], [100, 100], TRANSPARENCY(GREY[3], .4));
   root_s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   root_s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   root_s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   root_s.SetName('Demo_widgets_sections');
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) root_s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);



   const r_corners = 6;
   const feather = 1.8;


   /** Create the info for the uuser */
   const info = Create_widget_label(_, text_sample_sections, _, [0, 0, 0], default_font_size, GREY[4], WHITE, [10, 10], _, _, default_font,);
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   root_s.AddItem(info);


   const l1_s = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[1], tr));
   l1_s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;
   l1_s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   l1_s.SetName('Section l1_s');
   root_s.AddItem(l1_s);


   const l1_s1 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   l1_s.AddItem(l1_s1);
   {
      {
         const l1_s3 = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
         l1_s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l1_s1.AddItem(l1_s3);
         const red111 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOWL[9], tr));
         red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         red111.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); red111.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l1_s3.AddItem(red111);
         const yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOWR[9], tr));
         yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         yel_1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); yel_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l1_s3.AddItem(yel_1);
      }
      {
         const l4_s1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
         l4_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l4_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l1_s1.AddItem(l4_s1);
         const purp12 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLE[7], tr));
         purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l4_s1.AddItem(purp12);
         const blue13 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[9], tr));
         blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l4_s1.AddItem(blue13);
         const green14 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREEN[7], tr));
         green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         green14.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); green14.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l4_s1.AddItem(green14);
      }
      {
         const l4_s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
         l4_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l4_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l4_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l1_s1.AddItem(l4_s1);
         const purp12 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLE[7], tr));
         purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l4_s1.AddItem(purp12);
         const blue13 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[9], tr));
         blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l4_s1.AddItem(blue13);
         const green14 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREEN[7], tr));
         green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         green14.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); green14.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l4_s1.AddItem(green14);
      }
   }


   const l1_s2 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   l1_s.AddItem(l1_s2);
   {
      const l1_s3 = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
      l1_s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s2.AddItem(l1_s3);
      const purp12 = Create_widget_section(_, SECTION.HORIZONTAL, [13, 21], [0, 0, 0], min_size, TRANSPARENCY(PURPLE[7], tr));
      purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(purp12);
      const blue13 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[9], tr));
      blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(blue13);
      const red_4 = Create_widget_section(_, SECTION.VERTICAL, [30, 14], [0, 0, 0], min_size, TRANSPARENCY(PURPLER[7], tr));
      red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      red_4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); red_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(red_4);
      const green14 = Create_widget_section(_, SECTION.VERTICAL, [20, 20], [0, 0, 0], min_size, TRANSPARENCY(GREEN[7], tr));
      green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      green14.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); green14.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(green14);
      const yel_2 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOWR[8], tr));
      yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      yel_2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); yel_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(yel_2);
   }

   {
      const l1_s3 = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
      l1_s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s2.AddItem(l1_s3);
      const purp12 = Create_widget_section(_, SECTION.HORIZONTAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLE[7], tr));
      purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); purp12.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(purp12);
      const blue13 = Create_widget_section(_, SECTION.HORIZONTAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(BLUEL[9], tr));
      blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); blue13.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(blue13);
      const green14 = Create_widget_section(_, SECTION.VERTICAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(GREEN[7], tr));
      green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      green14.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); green14.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(green14);
      const yel_2 = Create_widget_section(_, SECTION.VERTICAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOWR[8], tr));
      yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      yel_2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); yel_2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(yel_2);
      const red_4 = Create_widget_section(_, SECTION.VERTICAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLER[7], tr));
      red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      red_4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); red_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(red_4);
      const yel_4 = Create_widget_section(_, SECTION.VERTICAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLEB[9], tr));
      yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      yel_4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); yel_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(yel_4);
      const ora_4 = Create_widget_section(_, SECTION.VERTICAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(ORANGEL[8], tr));
      ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      ora_4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); ora_4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(ora_4);
      const yel = Create_widget_section(_, SECTION.VERTICAL, [14, 10], [0, 0, 0], min_size, TRANSPARENCY(YELLOW[8], tr));
      yel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      yel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); yel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s3.AddItem(yel);
   }


   const l1_s3 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   l1_s.AddItem(l1_s3);
   {
      {
         const l2_s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[3], tr));
         l2_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l2_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l2_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l1_s3.AddItem(l2_s1);
         {
            {

               const gry1_1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(ORANGEL[9], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[8], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _0.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[6], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_1);
                  const _2 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_2);
               }
            }
            {

               const gry1_1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREENL[7], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[5], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _0.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[3], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_1);
                  const _2 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[1], tr));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_2);
               }
            }

         }
      }
      {
         const l2_s1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(GREY[4], tr));
         l2_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         l2_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l2_s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
         l1_s3.AddItem(l2_s1);
         {
            {

               const gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLER[8], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[9], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _0.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[7], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_1);
                  const _2 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[5], tr));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_2);
               }
            }
            {

               const gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], min_size, TRANSPARENCY(PURPLEB[9], tr));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); gry1_1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[3], tr));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _0.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _0.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_0);
                  const _1 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[6], tr));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_1);
                  const _2 = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, TRANSPARENCY(GREY[9], tr));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  _2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); _2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  gry1_1.AddItem(_2);
               }
            }

         }
      }
   }

   const l1_s4 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   l1_s.AddItem(l1_s4);
   {
      const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, RED[9]);
      r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s4.AddItem(r);
      const rg = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[9]);
      rg.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      rg.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); rg.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s4.AddItem(rg);
      const g = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, GREEN[9]);
      g.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      g.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); g.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s4.AddItem(g);
      const gb = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, CYAN[9]);
      gb.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      gb.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); gb.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s4.AddItem(gb);
      const b = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, BLUE[9]);
      b.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      b.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); b.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s4.AddItem(b);
      const br = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, MAGENTA);
      br.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      br.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); br.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
      l1_s4.AddItem(br);
   }
   const l1_s5 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], min_size, TRANSPARENCY(GREY[2], tr));
   l1_s5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s5.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); l1_s5.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
   l1_s.AddItem(l1_s5);
   {
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[0]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[1]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[2]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[3]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[4]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[5]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[6]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[7]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[8]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
      { const r = Create_widget_section(_, SECTION.VERTICAL, min_size, [0, 0, 0], min_size, YELLOW[9]); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); r.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); r.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners); l1_s5.AddItem(r); }
   }




   /***********************************************************************************************************************************************************/
   // Render
   root_s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   root_s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   root_s.options = SECTION.INHERIT | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   root_s.Calc_no_gfx_update();
   View_build_group_from_root_mesh(root_s);
   root_s.Render();
   Root_group_activate_all_vbs_in_renderqueue(root_s.root_bufferidx);

   root_s.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, root_s.gfx.vb.groupidx);


   Construct_listen_events_from_mesh_tree(root_s);
   Construct_listen_events_relations_from_mesh_tree(root_s);


   return root_s;
}





export function Demo_widgets_dropdown(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0], control_slider_distance = null, control_slider_smoothness = null, control_slider_intensity = null) {

   const text_sample_dropdown = `\
WIDGET: DROPDOWN MENU  
The Dropdown Menu widget provides the ability to dynamically
reorganize its items based on their nested dropdown menus.
Key features include:
- Maintaining a memory of any opened nested dropdown menus,
ensuring they remain accessible when reopening a parent dropdown.\
   `;

   const dp_col = GREY[5];
   const dp_menu_col = ORANGER[8];

   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) default_font = TEXTURES.CONSOLAS_16px;

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [pos[0] + l_pad, pos[1] + t_pad, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets_dropdown')
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;





   /** Create the info for the user */
   const info = Create_widget_label(_, text_sample_dropdown, _, [0, 0, 0], default_font_size, GREY[5], WHITE, [10, 10], _, _, default_font,);
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.AddItem(info);




   const pad = [10, 4]
   const margin = [5, 5]
   const dp = Create_widget_dropdown(_, `ROOT`, [0, 0, 1], GREY[5], dp_menu_col, WHITE, pad, _, _, _, _, margin);
   dp.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

   section.AddItem(dp);

   Dropdown_roots_set_root(dp, dp);

   let zpos = 0;

   zpos++
   { // Many dps

      const sub_dp1_count = 1;
      const sub_dp2_count = 1;

      const col = GetSequencedColor();
      for (let i = 0; i < sub_dp1_count; i++) {

         const dpsub1 = Create_widget_dropdown(_, `Dropdown:${i}`, [0, 0, zpos + 1], GREY[6], PURPLEB[7], WHITE, pad, _, _, _, _, margin);
         dp.AddToMenu(dpsub1);
         dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

         const col1 = GetSequencedColor(4)
         for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(_, `Dropdown:${i}${j}`, [0, 0, zpos + 2], GREY[7], ORANGE[8], WHITE, pad, _, _, _, _, margin);
            dpsub1.AddToMenu(dpsub2);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
            dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
            dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
            // console.log()

            const col2 = GetSequencedColor(3)
            for (let k = 0; k < sub_dp2_count; k++) {

               const dpsub3 = Create_widget_dropdown(_, `Dropdown:${i}${j}0`, [0, 0, zpos + 3], GREY[8], YELLOWL[6], WHITE, pad, _, _, _, _, margin);
               dpsub2.AddToMenu(dpsub3);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
               dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
               dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

               const col3 = GetSequencedColor(3)
               for (let k = 0; k < sub_dp2_count; k++) {

                  const dpsub4 = Create_widget_dropdown(_, `Dropdown:${i}${j}01`, [0, 0, zpos + 4], GREY[9], ORANGEL[8], WHITE, pad, _, _, _, _, margin);
                  dpsub3.AddToMenu(dpsub4);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

                  const l = Create_widget_label(_, 'label', _, _, _, BLUEL[6], TRANSPARENCY(WHITE, 1.), [5, 5]);
                  l.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                  dpsub4.AddToMenu(l);


                  const r_corners = 6;
                  const feather = 1.8;
                  const s = Create_widget_section(_, SECTION.HORIZONTAL, [2, 2], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[2], .8));
                  s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.AddToMenu(s);
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], BLUEL[9], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], GREEN[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOWR[8], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLEB[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLER[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], ORANGEL[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOW[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
               }
               for (let k = 0; k < sub_dp2_count; k++) {

                  const dpsub4 = Create_widget_dropdown(_, `Dropdown:${i}${j}02`, [0, 0, zpos + 4], GREY[9], BLUEL[6], WHITE, pad, _, _, _, _, margin);
                  dpsub3.AddToMenu(dpsub4);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

                  const l = Create_widget_label(_, 'label', _, _, _, GREENR[5], TRANSPARENCY(WHITE, 1), [5, 5]);
                  l.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                  dpsub4.AddToMenu(l);


                  const r_corners = 6;
                  const feather = 1.8;
                  const s = Create_widget_section(_, SECTION.HORIZONTAL, [2, 2], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[2], .8));
                  s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.AddToMenu(s);
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], BLUEL[9], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], GREEN[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOWR[8], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLEB[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLER[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], ORANGEL[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOW[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
               }
            }
            for (let k = 0; k < sub_dp2_count; k++) {

               const dpsub3 = Create_widget_dropdown(_, `Dropdown:${i}${j}1`, [0, 0, zpos + 3], GREY[8], PURPLER[7], WHITE, pad, _, _, _, _, margin);
               dpsub2.AddToMenu(dpsub3);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
               dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
               dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

               const col3 = GetSequencedColor(3)
               for (let k = 0; k < sub_dp2_count; k++) {

                  const dpsub4 = Create_widget_dropdown(_, `Dropdown:${i}${j}11`, [0, 0, zpos + 4], GREY[9], GREENR[5], WHITE, pad, _, _, _, _, margin);
                  dpsub3.AddToMenu(dpsub4);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                  dpsub4.SetName(`Dropdown:${i}${j}${k}`);

                  const l = Create_widget_label(_, 'label', _, _, _, YELLOW[6], WHITE, [5, 5]);
                  l.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                  dpsub4.AddToMenu(l);


                  const r_corners = 6;
                  const feather = 1.8;
                  const s = Create_widget_section(_, SECTION.HORIZONTAL, [2, 2], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[2], .8));
                  s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.AddToMenu(s);
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], BLUEL[9], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], GREEN[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOWR[8], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLEB[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLER[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], ORANGEL[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOW[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
               }
               for (let k = 0; k < sub_dp2_count; k++) {

                  const dpsub4 = Create_widget_dropdown(_, `Dropdown:${i}${j}12`, [0, 0, zpos + 4], GREY[9], YELLOW[7], WHITE, pad, _, _, _, _, margin);
                  dpsub3.AddToMenu(dpsub4);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

                  const l = Create_widget_label(_, 'label', _, _, _, ORANGEL[8], WHITE, [5, 5]);
                  l.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
                  l.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
                  dpsub4.AddToMenu(l);


                  const r_corners = 6;
                  const feather = 1.8;
                  const s = Create_widget_section(_, SECTION.HORIZONTAL, [2, 2], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[2], .8));
                  s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
                  s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                  s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.AddToMenu(s);
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], BLUEL[9], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], GREEN[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOWR[8], 'sk1', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLEB[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], PURPLER[7], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], ORANGEL[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
                  {
                     const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 4], [30, 10], YELLOW[8], 'sk2', [0, 10, 1.8]);
                     s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather); s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, r_corners);
                     s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
                  }
               }
            }
         }
      }
   }


   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();

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





export function Demo_widgets(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0], control_slider_distance = null, control_slider_smoothness = null, control_slider_intensity = null) {

   const text_sample_widgets = `\
GENERIC WIDGETS\
   `;

   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) default_font = TEXTURES.CONSOLAS_16px;

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [20, 20], [pos[0] + l_pad, pos[1] + t_pad, 0], [0, 0], TRANSPARENCY(GREY[3], .6));
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets');
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;





   /** Create the info for the uuser */
   const info = Create_widget_label(_, text_sample_widgets, _, [0, 0, 0], default_font_size, GREY[4], WHITE, [10, 10], _, _, default_font,);
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // info.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   info.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
   section.AddItem(info);


   /**************************************************************************************************************************************************/


   // Create Button Widget with counter on click
   {
      const s = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
      s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER);
      s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
      s.SetName('Button panel');
      section.AddItem(s);

      const btn = Create_widget_button(_, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, BLUEL[7], WHITE, [5, 5], .5);
      // btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s.AddItem(btn);

      const label = Create_widget_label(_, '000', _, _, _, GREY[2], GREENL[9],);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
      s.AddItem(label);

      const params = { counter: 0, }

      btn.Bind(
         (params) => {
            // console.log(params.params.counter);

            params.params.counter++;
            label.text_mesh.RenderTextFromNumber(params.params.counter);
         },
         _, params, _,
      );
   }

   // Create Switch Widget
   {
      const s = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4),);
      s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      s.SetName('Switches panel');
      section.AddItem(s);

      // s.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;

      const switch_pad = 3;

      {
         const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[4], .4),);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.SetName('One Switch panel');
         s.AddItem(s1);
         const switch1 = Create_widget_switch_simple(_, [0, 0, 0], 18, YELLOWR[7], _, switch_pad, _,);
         switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
         switch1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.AddItem(switch1);
         switch1.Bind(
            () => {

               const state = (switch1.isOn & 0x1) ? 'on' : 'off';
               const color = (switch1.isOn & 0x1) ? YELLOWR[7] : GREY[5];
               label.text_mesh.RenderTextFromString(state);
               label.text_mesh.SetColorRGB(color);
            },
            _, _, _,
         );
         const label = Create_widget_label(_, 'off', _, _, _, GREY[2], GREY[5],);
         // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER,2);
         label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
         label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.AddItem(label);
      }
      {
         const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[4], .4),);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.SetName('One Switch panel');
         s.AddItem(s1);
         const switch1 = Create_widget_switch_simple(_, [0, 0, 0], 18, PURPLER[7], _, switch_pad, _,);
         switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
         switch1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.AddItem(switch1);
         switch1.Bind(
            () => {

               const state = (switch1.isOn & 0x1) ? 'on' : 'off';
               const color = (switch1.isOn & 0x1) ? PURPLER[7] : GREY[5];
               label.text_mesh.RenderTextFromString(state);
               label.text_mesh.SetColorRGB(color);
            },
            _, _, _,
         );
         const label = Create_widget_label(_, 'off', _, _, _, GREY[2], GREY[5],);
         // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER,2);
         label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
         label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.AddItem(label);
         // s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         // label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         // switch1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      }
      {
         const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[4], .4),);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
         s1.SetName('One Switch panel');
         s.AddItem(s1);
         const switch1 = Create_widget_switch_simple(_, [0, 0, 0], 18, BLUEL[7], _, switch_pad, _,);
         switch1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         switch1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
         switch1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
         s1.AddItem(switch1);
         switch1.Bind(
            () => {

               const state = (switch1.isOn & 0x1) ? 'on' : 'off';
               const color = (switch1.isOn & 0x1) ? BLUEL[7] : GREY[5];
               label.text_mesh.RenderTextFromString(state);
               label.text_mesh.SetColorRGB(color);
            },
            _, _, _,
         );
         const label = Create_widget_label(_, 'off', _, _, _, GREY[2], GREY[5],);
         // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER,2);
         label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch1.geom.dim[1]);
         label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
         s1.AddItem(label);
      }

      // .Calc_no_gfx_update();


   }


   // Create Slider Widget
   {
      const s = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
      s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
      s.SetName('Slider panel');
      section.AddItem(s);

      const slider = Create_widget_slider(_, [0, 0, 1], [100, 10], TRANSPARENCY(GREY[2], .6), _, 'Test slider',);
      slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
      slider.SetInitialValue(0);
      s.AddItem(slider);

      const label = Create_widget_label(_, 'Move slider', _, _, _, GREY[2], GREY[5],);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD)
      s.AddItem(label);

      const clbk_params = { label: label, posx: s.geom.pos[0] + label.geom.pos[0] };
      Slider_connect(slider,
         (params, slider_val) => {

            const label = params.clbk_params.label;
            if (label.gfx === null) return;

            const dist = label.geom.pos[0] + (label.geom.dim[0]) * (slider_val + 1);
            label.SetPosX(dist);
            const pad = label.StylesGetPad(STYLES.AXIS.X);
            label.text_mesh.SetPosX(dist - label.geom.dim[0] + pad * 2);
         },
         clbk_params,
      );

   }






   /**************************************************************************************************************************************************/
   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();

   // section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();

   section.Render()
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);


   return section;
}




export function Demo_widgets_colorpicker_demo_with_info(root_widget = ROOT_WIDGETS.CREATE_ROOT, y) {

   const text_sample_colorpicker = `\
WIDGET: COLOR-PICKER\
   `;

   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) default_font = TEXTURES.CONSOLAS_16px;

   const section = Create_widget_section(root_widget, SECTION.HORIZONTAL, [20, 20], [l_pad, y + t_pad, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets_colorpicker')
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;

   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);




   /** Create the info for the user */
   const info = Create_widget_label(_, text_sample_colorpicker, _, [0, 0, 0], default_font_size, GREY[5], WHITE, [10, 10], _, _, default_font,);
   info.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.AddItem(info);


   const colorpicker = Demo_widgets_colorpicker(0x0, 0, 0, _, _, _, _, _, _, 0x0,);

   colorpicker.SetTransparencySliderSetInitialValue(1);
   colorpicker.SetHueSliderSetInitialValue(.2);

   const params = {
      target_mesh: info,
      mnemonics: {
         color: null,
         transparency: 1,
         hue: .2,
      },
   };
   colorpicker.AssignTargetMeshClbk((col, params) => {

      const color = col;
      const target_mesh = params.target_mesh;

      CopyArr4(target_mesh.mat.col, color);
      CopyArr4(target_mesh.mat.defCol, color);
      Gl_set_rgba(target_mesh.gfx, color, target_mesh.geom.num_faces);

      params.mnemonics.color = color;

   }, params);

   section.AddItem(colorpicker);




   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

      section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      section.Calc_no_gfx_update();

      section.Render()
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      { // Must render ontop the text meshes, in case they found an existing vb to be inserted(searching from root) that is rendered bellow the labels.
         const color_picker_text_meshes = colorpicker.label_r.text_mesh;
         Renderqueue_set_priority_by_vb(LAST, color_picker_text_meshes.gfx.vb.groupidx);
      }

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)


      Construct_listen_events_from_mesh_tree(section)
      Construct_listen_events_relations_from_mesh_tree(section);

      // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
      View_build_group_from_root_mesh(section);
   }

   return section;
}




export function Demo_widgets_msdf_text_rendering(x, y) {


   const text_sample_explainer1 = `\
Text Rendering 
The engine supports two primary text rendering implementations.\
   `;
   /**   
     - Binding a new texture to the WebGL buffers is required
     for each unique texture atlas, which can impact performance
     when switching between different font sizes.
    */
   const text_sample_explainer2 = `\
1. Regular Font Textures
Each font size is represented by its own font atlas.  
Drawback:
- Dynamic scaling of text is not supported with this method,
     as each font size requires its own pre-rendered texture atlas.\
   `;
   /**  
      Pros: Dynamic scaling is fully supported, providing flexibility for various font sizes.
      Cons: Text may lose sharpness and clarity at very small font sizes, affecting readability.
   */
   const text_sample_explainer3 = `\
2. SDF and MSDF Font Textures
A single font atlas is used per font type,
powered by Signed Distance Field (SDF) and
Multi-Channel Signed Distance Field (MSDF) techniques.  
Users have the freedom to choose a font type and
adjust the size dynamically, offering scalability
without sacrificing quality.\
   `;
   const text_sample_explainer4 = `\
Explore the MSDF text rendering example below.
Adjust the font size using the slider.
   `;




   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [x + l_pad, y + t_pad, 0], [0, 0], TRANSPARENCY(GREY[3], .4));
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Msdf_text_info');





   /** Create the info for the user */
   const s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x + l_pad, y + t_pad, 0], [0, 0], TRANSPARENCY(GREY[1], .4));
   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   s.SetName('Msdf_text_info_sub_section');
   section.AddItem(s);

   const font = TEXTURES.MSDF_CONSOLAS_1024;
   const default_font = 10;
   const info1 = Create_widget_label(_, text_sample_explainer1, _, [0, 0, 0], default_font, GREY[4], WHITE, [10, 10], _, _, font,);
   {
      info1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info1);
   }
   const info2 = Create_widget_label(_, text_sample_explainer2, _, [0, 0, 0], default_font, TRANSPARENT, WHITE, [10, 10], _, _, font,);
   {
      info2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info2.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info2);
   }
   const info3 = Create_widget_label(_, text_sample_explainer3, _, [0, 0, 0], default_font, TRANSPARENT, WHITE, [10, 10], _, _, font,);
   {
      info3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info3.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info3);
   }
   const info4 = Create_widget_label(_, text_sample_explainer4, _, [0, 0, 0], default_font, TRANSPARENT, WHITE, [10, 10], _, _, font,);
   {
      info4.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info4.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      info4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      s.AddItem(info4);
   }




   /**************************************************************************************************************************************************/
   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();

   section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();

   section.Render()
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);



   info1.text_mesh.SetColorRGBSpecificIndex(YELLOWL[7], 0, 14);




   y += section.geom.dim[1] * 2 + 30;

   /********************************************************************************************************************************/
   // Msdf text and scale slider


   const text = `\
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]
The quick brown fox jumps over the lazy dog[!]\
   `;

   const ret = Widget_msdf_text_with_scale_slider(ROOT_WIDGETS.CREATE_ROOT, text, TEXTURES.MSDF_CONSOLAS_1024, x, y, 20, GREY[0], 300, _);
   const slider = ret.slider;
   const msdf_text = ret.msdf_text;


}




/**
 * 
 * @param {*} root_widget Create color picker and render it (to its own vertex buffer)
 * @param {*} x pos x
 * @param {*} y pos y
 * @param {*} w width
 * @param {*} h height
 * Use c1 and c2 for coloring top and bottom of clorpicker panel
 * @param {*} c1 color 1
 * @param {*} c2 color 2
 * @param {*} c3 color 3
 * @param {*} c4 color 4
 * @param {*} render_instanced_flags  Pas flags for instanced geometry
 * @returns 
 */
// TODO: Move the colorpicker widget construction to App/Widgets/ReadyWidgets
export function Demo_widgets_colorpicker(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, w = 300, h = 300, c1 = GREY[0], c2 = GREY[1], c3 = null, c4 = null, render_instanced_flags = 0x0) {

   if (c3 === null) c3 = c1;
   if (c4 === null) c4 = c2;

   const picker = Create_widget_color_picker(root_widget, SECTION.VERTICAL, [20, 20], [x, y, 0], [w, h], [c1, c2, c3, c4], _, Mesh_create_style_from_values(10, 2, 0));
   picker.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   picker.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8, 8, 6, 4, 4, 4, 4, 4);
   picker.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2, 2, 2, 2, 2, 2, 2, 2);

   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) picker.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   picker.sid.inst = render_instanced_flags;

   picker.ColorpickerCreateListeners();


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {



      // picker.StateEnable(MESH_STATE.IS_RESIZEABLE);
      // picker.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, picker.mesh_bufferidx, true);
      picker.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, picker.mesh_bufferidx, true);
      picker.GenGfxCtx();

      picker.Calc_no_gfx_update();

      picker.Render();
      Root_group_activate_all_vbs_in_renderqueue(picker.root_bufferidx);
      picker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, picker.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(picker);
      Construct_listen_events_relations_from_mesh_tree(picker);
   }

   return picker;

}