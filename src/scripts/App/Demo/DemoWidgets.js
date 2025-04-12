"use strict";

import { Create_rect_mesh, Create_widget_button, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_slider, Create_widget_switch_simple } from '../../Engine/Drawables/Widgets/Helpers/CreateWidget.js';
import { View_build_group_from_root_mesh } from '../../Engine/Core/Views/MeshBufferViews.js';
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from '../../Engine/Core/MeshUniformsBuffer.js';
import { Root_group_activate_all_vbs_in_renderqueue } from '../../Engine/Core/Views/RootView.js';
import { BLUE, BLUEL, CYAN, Get_mix_color, GREEN, GREENL, GREY, MAGENTA, ORANGE, ORANGEL, ORANGER, PURPLE, PURPLEB, PURPLER, RED, REDL, WHITE, YELLOW, YELLOWL, YELLOWR } from '../../Engine/Drawables/Material/Colors.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../../Engine/Events/EventFunctions.js';
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from '../../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Dropdown_roots_set_root } from '../../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Slider_connect } from '../../Engine/Drawables/Widgets/WidgetSlider.js';
import { Listeners_set_priority } from '../../Engine/Events/EventListeners.js';
import { Gl_set_rgba } from '../../Graphics/Buffers/VertexBuffersOps.js';
import { GetSequencedColor } from '../../Helpers/Helpers.js';
import { CopyArr4 } from '../../Helpers/Math/MathOperations.js';
import { Widget_msdf_text_with_scale_slider, Widget_ready_label, Widget_ready_rect, Widget_ready_slider, Widget_ready_switch } from '../../Engine/Drawables/Widgets/Helpers/WidgetReadyWidgets.js';
import { Renderqueue_set_priority_by_vb } from '../../Engine/Renderers/Renderer/RenderQueue.js';
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_color_picker_default_properties, Style_dropdown_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties, Style_switch_default_properties } from '../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js';
import { Mesh_set_wpos_relative_x } from '../../Engine/Drawables/Operations/MeshAttributesFunctions.js';
import { Align_nested_sections_pre, Align_expand } from '../../Engine/Drawables/Operations/AlignNestedSections.js';




const l_pad = 10;
const t_pad = 20;
// const default_font_size = 7


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


   const rcorners = 10;


   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [20, 20], pos: [pos[0] + l_pad, pos[1] + t_pad, 0], col: TRANSPARENCY(GREY[3], .4), name:'Demo_widgets'}));
   Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, });
   section.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL;
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);





   /** Create the info for the user */
   const s = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], col: TRANSPARENCY(GREY[1], .4), name:'Demo_widgets'}));
   Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, });
   s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL;
   section.AddItem(s);


   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
   const font_size = 10;

   // const info1 = Create_widget_label(_, text_sample_explainer1, _, [0, 0, 2], default_font, GREY[4], WHITE, [10, 10], _, _, font,);
   const info1 = Create_widget_label(Style_label_default_properties({ text: text_sample_explainer1, col: GREY[4], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
   Widget_gfx_ready_enable({ mesh: info1, enable_sdf_rect: rcorners, });
   info1.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info1);

   const info2 = Create_widget_label(Style_label_default_properties({ text: text_sample_explainer2, col: GREY[4], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
   Widget_gfx_ready_enable({ mesh: info2, enable_sdf_rect: rcorners, });
   info2.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info2);

   const info3 = Create_widget_label(Style_label_default_properties({ text: text_sample_explainer3, col: GREY[4], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
   Widget_gfx_ready_enable({ mesh: info3, enable_sdf_rect: rcorners, });
   info3.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info3);

   const info4 = Create_widget_label(Style_label_default_properties({ text: text_sample_explainer4, col: GREY[4], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
   Widget_gfx_ready_enable({ mesh: info4, enable_sdf_rect: rcorners, });
   info4.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info4);






   /**************************************************************************************************************************************************/
   // Render
   Align_nested_sections_pre(section);
   Align_expand(section);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();

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

   const text_sample_scroller = 'WIDGET SCROLLER';


   const rcorners = 10;
   const font_size = 10;
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
   // const text_pad = [20, 12];
   const text_pad = [20, 0];


   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: root_widget, pad: [0, 0], pos: [pos[0] + l_pad, pos[1] + t_pad * 2, 0], dim:[10, scroller_height], col: TRANSPARENCY(GREY[3], .8), name:'Demo_widgets_scrolled_labels' }));
   Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, });
   section.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL | LAYOUT.FIXED_HEIGHT;
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   section.geom.dim[1] += section.StylesGetPad(STYLES.AXIS.Y); // Adding the pad


   const info = Create_widget_label(Style_label_default_properties({ text: text_sample_scroller, col: GREY[2], text_col: GREENL[9], text_pad: text_pad, texture_id: default_font, font_size: font_size, }));
   Widget_gfx_ready_enable({ mesh: info, enable_sdf_rect: rcorners, });
   info.align.flags = LAYOUT.HORIZONTAL;
   info.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.AddItem(info);

   const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], col: TRANSPARENCY(GREY[1], .8), name:'scrolled_section' }));
   Widget_gfx_ready_enable({ mesh: scrolled_section, enable_sdf_rect: rcorners, });
   scrolled_section.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;

   scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, scrolled_section.mesh_bufferidx, true);
   scrolled_section.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE; // Remove the PRIVATE flag so that the scrolled section will
   scrolled_section.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;
   section.AddItem(scrolled_section);


   // const color_array = [RED[9], YELLOW[9], GREEN[9], CYAN[9], BLUEL[9], PURPLE[9]]
   const count = 50;

   for (let i = 0; i < count; i++) {

      const color = Get_mix_color(i, count,);

      // const label = Create_widget_label(Style_label_default_properties({text:`${i}`, pos:[0, 0, 2], col:TRANSPARENCY(GetRandomColor(), 1.), text_pad:text_pad, texture_id:default_font, font_size:font_size}));
      const label = Create_widget_label(Style_label_default_properties({ text: `${i}`, pos: [0, 0, 2], col: color, text_pad: text_pad, texture_id: default_font, font_size: font_size }));
      Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: rcorners, });
      label.align.flags = LAYOUT.VERTICAL;
      label.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled_section.mesh_bufferidx);
      scrolled_section.AddItem(label);
      label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   }



   // Render

   Align_nested_sections_pre(section);

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   View_build_group_from_root_mesh(scrolled_section);

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   scrolled_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scrolled_section.gfx.vb.groupidx);


   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);



   const height = scroller_height - info.geom.dim[1] * 2 + 10;
   const scroller_component = Components_create_scroller_component(10, height, scrolled_section, 10);
   Scoller_component_gengfx_and_render(scroller_component, scrolled_section);
   Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(scrolled_section.root_posidx, scroller_component.root_posidx);
   Listeners_set_priority(E.C, scroller_component.listeners);
   section.AddChildScrollerIdx(scrolled_section.scroller_comp_idx);

   Scroller_component_calculate_handle_pos_dim(scrolled_section, scroller_component);

   // Set scissor box
   // const mx = scrolled_section.mesh_bufferidx;
   // const my = scroller_component.mesh_bufferidx;
   // const mw = scrolled_section.mesh_bufferidx;
   // const mh = scroller_component.mesh_bufferidx;
   // Vertex_buffer_group_create_scissorbox(scrolled_section.gfx.vb.groupidx, mx, my, mw, mh);
   // Vertex_buffer_group_create_scissorbox(scrolled_section.children.buffer[0].text_mesh.gfx.vb.groupidx, mx, my, mw, mh);


   // Unfortunately must Re-render the menu_panel for the clipping of the scroller to take place
   // Root_group_reset_gfxs(scrolled_section.root_bufferidx);
   // Root_group_rerender_from_root_reconstruct_listeners(scrolled_section.root_bufferidx);



   // // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scroller.scrolled_section);
   // // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);


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
   const rcorners = 6;
   const font_size = 10;
   const text_pad = [16, 10];
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
   // if (!PLATFORM.ANY_SMARTPHONE_DEVICE) default_font = TEXTURES.CONSOLAS_16px;

   const root_s = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: SECTION.VERTICAL, pad: [15, 15], pos: [pos[0] + l_pad, pos[1] + t_pad, 0], dim: [100, 100], col: TRANSPARENCY(GREY[3], .4), name:'Demo_widgets_sections' }));
   Widget_gfx_ready_enable({ mesh: root_s, enable_sdf_rect: rcorners, })
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) root_s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   /** Create the info for the uuser */
   const info = Create_widget_label(Style_label_default_properties({ text: text_sample_sections, pos: [0, 0, 0], font_size: font_size, col: GREY[4], text_pad: [10, 10], texture_id: default_font }));
   Widget_gfx_ready_enable({ mesh: info, enable_sdf_rect: 10 });
   root_s.AddItem(info);


   const l1_s = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [15, 15], dim: min_size, col: TRANSPARENCY(GREY[1], tr), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name:'Section l1_s' }));
   l1_s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Widget_gfx_ready_enable({ mesh: l1_s, enable_sdf_rect: rcorners });
   root_s.AddItem(l1_s);


   const l1_s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [12, 12], dim: min_size, col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL }));
   Widget_gfx_ready_enable({ mesh: l1_s1, enable_sdf_rect: rcorners });
   l1_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   l1_s.AddItem(l1_s1);
   {
      {
         const a = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [12, 12], dim: min_size, col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL }));
         a.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: a, enable_sdf_rect: rcorners });
         l1_s1.AddItem(a);
         const red111 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(YELLOWL[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
         red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: red111, enable_sdf_rect: rcorners });
         a.AddItem(red111);
         const yel_1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(YELLOWR[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
         yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: yel_1, enable_sdf_rect: rcorners });
         a.AddItem(yel_1);
      }
      {
         const l4_s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL }));
         l4_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: l4_s1, enable_sdf_rect: rcorners });
         l1_s1.AddItem(l4_s1);
         const b = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(PURPLE[7], tr) }));
         b.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: b, enable_sdf_rect: rcorners });
         l4_s1.AddItem(b);
         const c = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(BLUEL[9], tr) }));
         c.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: c, enable_sdf_rect: rcorners });
         l4_s1.AddItem(c);
         const d = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(GREEN[7], tr) }));
         d.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: d, enable_sdf_rect: rcorners });
         l4_s1.AddItem(d);
      }
      {
         const l4_s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(GREY[4], tr), }));
         l4_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: l4_s1, enable_sdf_rect: rcorners });
         l1_s1.AddItem(l4_s1);
         const a = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(PURPLE[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
         a.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: a, enable_sdf_rect: rcorners });
         l4_s1.AddItem(a);
         const b = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(BLUEL[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
         b.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: b, enable_sdf_rect: rcorners });
         l4_s1.AddItem(b);
         const c = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(GREEN[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
         c.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: c, enable_sdf_rect: rcorners });
         l4_s1.AddItem(c);
      }
   }


   const l1_s2 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [12, 12], dim: min_size, col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
   l1_s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Widget_gfx_ready_enable({ mesh: l1_s2, enable_sdf_rect: rcorners });
   l1_s.AddItem(l1_s2);
   {
      const a = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [12, 12], dim: min_size, col: TRANSPARENCY(GREY[4], tr), }));
      a.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: a, enable_sdf_rect: rcorners });
      l1_s2.AddItem(a);
      const b = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [13, 21], dim: min_size, col: TRANSPARENCY(PURPLE[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      b.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: b, enable_sdf_rect: rcorners });
      a.AddItem(b);
      const c = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [15, 15], dim: min_size, col: TRANSPARENCY(BLUEL[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      c.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: c, enable_sdf_rect: rcorners });
      a.AddItem(c);
      const red_4 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [30, 14], dim: min_size, col: TRANSPARENCY(PURPLER[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: red_4, enable_sdf_rect: rcorners });
      a.AddItem(red_4);
      const d = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [20, 20], dim: min_size, col: TRANSPARENCY(GREEN[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      d.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: d, enable_sdf_rect: rcorners });
      a.AddItem(d);
      const e = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [25, 10], dim: min_size, col: TRANSPARENCY(YELLOWR[8], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      e.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: e, enable_sdf_rect: rcorners });
      a.AddItem(e);
   }

   {
      const a = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [12, 12], dim: min_size, col: TRANSPARENCY(GREY[4], tr), }));
      a.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: a, enable_sdf_rect: rcorners });
      l1_s2.AddItem(a);
      const b = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(PURPLE[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      b.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: b, enable_sdf_rect: rcorners });
      a.AddItem(b);
      const c = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(BLUEL[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      c.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: c, enable_sdf_rect: rcorners });
      a.AddItem(c);
      const d = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(GREEN[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      d.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: d, enable_sdf_rect: rcorners });
      a.AddItem(d);
      const e = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(YELLOWR[8], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      e.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: e, enable_sdf_rect: rcorners });
      a.AddItem(e);
      const red_4 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(PURPLER[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: red_4, enable_sdf_rect: rcorners });
      a.AddItem(red_4);
      const yel_4 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(PURPLEB[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: yel_4, enable_sdf_rect: rcorners });
      a.AddItem(yel_4);
      const ora_4 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(ORANGEL[8], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: ora_4, enable_sdf_rect: rcorners });
      a.AddItem(ora_4);
      const yel = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [14, 10], dim: min_size, col: TRANSPARENCY(YELLOW[8], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
      yel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: yel, enable_sdf_rect: rcorners });
      a.AddItem(yel);
   }


   const aaa = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [15, 15], dim: min_size, col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
   aaa.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Widget_gfx_ready_enable({ mesh: aaa, enable_sdf_rect: rcorners });
   l1_s.AddItem(aaa);
   {
      {
         const l2_s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(GREY[3], tr) }));
         l2_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: l2_s1, enable_sdf_rect: rcorners });
         aaa.AddItem(l2_s1);
         {
            {

               const gry1_1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(ORANGEL[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               Widget_gfx_ready_enable({ mesh: gry1_1, enable_sdf_rect: rcorners });
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[8], tr) }));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _0, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_0);
                  const _1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[6], tr) }));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _1, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_1);
                  const _2 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[4], tr) }));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _2, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_2);
               }
            }
            {

               const gry1_1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(GREENL[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               Widget_gfx_ready_enable({ mesh: gry1_1, enable_sdf_rect: rcorners });
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[5], tr) }));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _0, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_0);
                  const _1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[3], tr) }));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _1, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_1);
                  const _2 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[1], tr) }));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _2, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_2);
               }
            }

         }
      }
      {
         const l2_s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(GREY[4], tr), }));
         l2_s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         Widget_gfx_ready_enable({ mesh: l2_s1, enable_sdf_rect: rcorners });
         aaa.AddItem(l2_s1);
         {
            {

               const gry1_1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(PURPLER[8], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               Widget_gfx_ready_enable({ mesh: gry1_1, enable_sdf_rect: rcorners });
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[9], tr) }));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _0, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_0);
                  const _1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[7], tr) }));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _1, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_1);
                  const _2 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[5], tr) }));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _2, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_2);
               }
            }
            {

               const gry1_1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: min_size, col: TRANSPARENCY(PURPLEB[9], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
               gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               Widget_gfx_ready_enable({ mesh: gry1_1, enable_sdf_rect: rcorners });
               l2_s1.AddItem(gry1_1);
               {

                  const _0 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[3], tr) }));
                  _0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _0, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_0);
                  const _1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[6], tr) }));
                  _1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _1, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_1);
                  const _2 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: TRANSPARENCY(GREY[9], tr) }));
                  _2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  Widget_gfx_ready_enable({ mesh: _2, enable_sdf_rect: rcorners });
                  gry1_1.AddItem(_2);
               }
            }

         }
      }
   }

   const l1_s4 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [15, 15], dim: min_size, col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
   l1_s4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Widget_gfx_ready_enable({ mesh: l1_s4, enable_sdf_rect: rcorners });
   l1_s.AddItem(l1_s4);
   {
      const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: RED[9] }));
      r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners });
      l1_s4.AddItem(r);
      const rg = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[9] }));
      rg.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: rg, enable_sdf_rect: rcorners });
      l1_s4.AddItem(rg);
      const g = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: GREEN[9] }));
      g.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: g, enable_sdf_rect: rcorners });
      l1_s4.AddItem(g);
      const gb = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: CYAN[9] }));
      gb.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: gb, enable_sdf_rect: rcorners });
      l1_s4.AddItem(gb);
      const b = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: BLUE[9] }));
      b.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: b, enable_sdf_rect: rcorners });
      l1_s4.AddItem(b);
      const br = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: MAGENTA }));
      br.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      Widget_gfx_ready_enable({ mesh: br, enable_sdf_rect: rcorners });
      l1_s4.AddItem(br);
   }
   const l1_s5 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [15, 15], dim: min_size, col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
   l1_s5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Widget_gfx_ready_enable({ mesh: l1_s5, enable_sdf_rect: rcorners });
   l1_s.AddItem(l1_s5);
   {
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[0] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[1] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[2] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[3] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[4] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[5] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[6] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[7] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[8] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
      { const r = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: min_size, dim: min_size, col: YELLOW[9] })); r.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); Widget_gfx_ready_enable({ mesh: r, enable_sdf_rect: rcorners }); l1_s5.AddItem(r); }
   }




   /***********************************************************************************************************************************************************/
   // Render

   Align_nested_sections_pre(root_s);

   root_s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
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

   const Create_many_circles = (rcorners) => {
      const s = Create_rect_mesh(Style_rect_default_properties({ pad: [2, 2], pos: [0, 0, 4], col: TRANSPARENCY(GREY[2], .8), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
      Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, });
      s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 4], col: TRANSPARENCY(BLUEL[9], .8), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 4], col: TRANSPARENCY(GREEN[7], .8), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 4], col: TRANSPARENCY(YELLOWR[8], .8), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 4], col: TRANSPARENCY(PURPLEB[8], .8), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 4], col: TRANSPARENCY(PURPLER[7], .8), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 4], col: TRANSPARENCY(ORANGEL[8], .8), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 4], col: TRANSPARENCY(YELLOW[8], .8), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1)
      }

      return s;
   }

   const dp_col = GREY[5];
   const dp_menu_col = ORANGER[8];
   const rcorners = 10;
   const text_pad = [16, 8];
   const pad = [10, 10]
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
   const font_size = 9;
   const dp_rcorners = [10, 20, 10];

   // if (!PLATFORM.ANY_SMARTPHONE_DEVICE) font_size = 8;

   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [20, 20], pos: [pos[0] + l_pad, pos[1] + t_pad, 0], col: TRANSPARENCY(GREY[3], .4), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'Demo_widgets_dropdown' }));
   Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, });
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;





   /** Create the info for the user */
   const info = Create_widget_label(Style_label_default_properties({ text: text_sample_dropdown, col: GREY[2], text_pad: text_pad, texture_id: default_font, font_size: font_size }));
   Widget_gfx_ready_enable({ mesh: info, enable_sdf_rect: rcorners, })
   section.AddItem(info);




   const dp = Create_widget_dropdown(Style_dropdown_default_properties({ text: `ROOT`, pos: [0, 0, 1], col: GREY[5], btn_col: BLUEL[9], menu_col: YELLOWL[3], text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, })
   section.AddItem(dp);

   Dropdown_roots_set_root(dp, dp);

   let zpos = 0;

   zpos++
   { // Many dps

      const sub_dp1_count = 1;
      const sub_dp2_count = 1;

      const col = GetSequencedColor();
      for (let i = 0; i < sub_dp1_count; i++) {

         const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dropdown:${i}`, pos: [0, 0, zpos + 1], col: GREY[6], menu_col: YELLOWL[5], btn_col: YELLOW[7], text_pad: text_pad, pad: pad, }));
         dp.AddToMenu(dpsub1);
         Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, });
         dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

         const col1 = GetSequencedColor(4)
         for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dropdown:${i}${j}`, pos: [0, 0, zpos + 2], col: GREY[7], menu_col: YELLOWL[5], btn_col: ORANGE[8], text_pad: text_pad, text_pad: text_pad, pad: pad, }));
            dpsub1.AddToMenu(dpsub2);
            Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, });
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
            // console.log()

            const col2 = GetSequencedColor(3)
            for (let k = 0; k < sub_dp2_count; k++) {

               const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dropdown:${i}${j}0`, pos: [0, 0, zpos + 3], col: GREY[8], menu_col: YELLOWL[6], btn_col: PURPLE[7], text_pad: text_pad, pad: pad, }));
               dpsub2.AddToMenu(dpsub3);
               Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: dp_rcorners, });
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

               const col3 = GetSequencedColor(3)
               for (let k = 0; k < sub_dp2_count; k++) {

                  const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dropdown:${i}${j}01`, pos: [0, 0, zpos + 4], col: GREY[9], menu_col: GREY[6], btn_col: PURPLEB[9], text_pad: text_pad, pad: pad, }));
                  dpsub3.AddToMenu(dpsub4);
                  Widget_gfx_ready_enable({ mesh: dpsub4, enable_sdf_rect: dp_rcorners, });
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                  const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: BLUEL[6], text_pad: text_pad, font_size: font_size }));
                  Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners, });
                  dpsub4.AddToMenu(l);

                  { const s = Create_many_circles(rcorners); dpsub4.AddToMenu(s); }
                  { const s = Create_many_circles(rcorners); dpsub4.AddToMenu(s); }
                  { const s = Create_many_circles(rcorners); dpsub4.AddToMenu(s); }


                  const l2 = Create_widget_label(Style_label_default_properties({ text: 'Some SDF font symbols', col: BLUEL[6], text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: l2, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(l2);
                  { const symbol = Create_rect_mesh(Style_rect_default_properties({ dim: [60, 60], pad: pad, col: GREEN[9], texture_id: TEXTURES.MSDF_SYMBOLS, sub_texture_id: ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._19, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: symbol, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(symbol); }
                  { const symbol = Create_rect_mesh(Style_rect_default_properties({ dim: [60, 60], pad: pad, col: REDL[9], texture_id: TEXTURES.MSDF_SYMBOLS, sub_texture_id: ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._20, layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: symbol, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(symbol); }
                  { const symbol = Create_rect_mesh(Style_rect_default_properties({ dim: [60, 60], pad: pad, col: YELLOWR[9], texture_id: TEXTURES.MSDF_SYMBOLS, sub_texture_id: ATLASES_SUB_TEXTURES.MSDF_SYMBOLS._21, layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: symbol, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(symbol); }

                  const l3 = Create_widget_label(Style_label_default_properties({ text: 'More dropdowns...', col: YELLOW[7], text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: l3, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(l3);
                  {
                     const sub_dp1_count = 2;
                     const sub_dp2_count = 3;
                     const text_pad = [12, 6];
                     const pad = [6, 6];
                     const font_size = 8;
                     const dp_rcorners = 7;
                     const dp_col = GREY[4];
                     const menu_col = GREY[2];
                     const col = YELLOWR[7];
                     for (let i = 0; i < sub_dp1_count; i++) {

                        const dp_1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout:LAYOUT.RESIZE_SELF|LAYOUT.HORIZONTAL }));
                        Widget_gfx_ready_enable({ mesh: dp_1, enable_sdf_rect: dp_rcorners, })
                        dpsub4.AddToMenu(dp_1);
                        dp_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

                        const col1 = TRANSPARENCY(PURPLEB[6], 1.);
                        for (let j = 0; j < sub_dp2_count; j++) {

                           const dp_2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout:LAYOUT.RESIZE_SELF|LAYOUT.HORIZONTAL }));
                           Widget_gfx_ready_enable({ mesh: dp_2, enable_sdf_rect: dp_rcorners, })
                           dp_1.AddToMenu(dp_2);
                           dp_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                           dp_2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                           const col2 = TRANSPARENCY(GREEN[6], 1.)

                           for (let k = 0; k < sub_dp2_count; k++) {

                              const dp_3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size }));
                              Widget_gfx_ready_enable({ mesh: dp_3, enable_sdf_rect: dp_rcorners, })
                              dp_2.AddToMenu(dp_3);
                              dp_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                              dp_3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                              const col3 = TRANSPARENCY(YELLOW[6], 1.)
                              for (let n = 0; n < 6; n++) {

                                 const dp_4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col3, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size }));
                                 Widget_gfx_ready_enable({ mesh: dp_4, enable_sdf_rect: dp_rcorners, })
                                 dp_3.AddToMenu(dp_4);
                                 dp_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                                 dp_4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                              }
                           }
                        }
                     }
                  }
               }

            }
            for (let k = 0; k < sub_dp2_count; k++) {

               const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dropdown:${i}${j}0`, pos: [0, 0, zpos + 3], col: GREY[8], menu_col: YELLOWL[6], btn_col: PURPLE[7], text_pad: text_pad, pad: pad, }));
               dpsub2.AddToMenu(dpsub3);
               Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: dp_rcorners, });
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
               dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

               const col3 = GetSequencedColor(3)
               for (let k = 0; k < sub_dp2_count; k++) {

                  const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dropdown:${i}${j}01`, pos: [0, 0, zpos + 4], col: GREY[9], menu_col: GREY[6], btn_col: PURPLEB[9], text_pad: text_pad, pad: pad, }));
                  dpsub3.AddToMenu(dpsub4);
                  Widget_gfx_ready_enable({ mesh: dpsub4, enable_sdf_rect: dp_rcorners, });
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                  dpsub4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                  const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: BLUEL[6], text_pad: text_pad, font_size: font_size }));
                  Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners, });
                  dpsub4.AddToMenu(l);

                  { const s = Create_many_circles(rcorners); dpsub4.AddToMenu(s); }
                  { const s = Create_many_circles(rcorners); dpsub4.AddToMenu(s); }
                  { const s = Create_many_circles(rcorners); dpsub4.AddToMenu(s); }


                  const l2 = Create_widget_label(Style_label_default_properties({ text: 'Some simple textures', col: BLUEL[6], text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: l2, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(l2);
                  { const symbol = Create_rect_mesh(Style_rect_default_properties({ dim: [256 / 2, 256 / 2], pad: pad, col: WHITE[9], texture_id: TEXTURES.SMOKE_1, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: symbol, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(symbol); }
                  { const symbol = Create_rect_mesh(Style_rect_default_properties({ dim: [32 / 2, 32 / 2], pad: pad, col: WHITE[9], texture_id: TEXTURES.COIN, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: symbol, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(symbol); }
                  { const symbol = Create_rect_mesh(Style_rect_default_properties({ dim: [64 / 2, 73 / 2], pad: pad, col: WHITE[9], texture_id: TEXTURES.TEST_APPLE, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: symbol, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(symbol); }
                  const l3 = Create_widget_label(Style_label_default_properties({ text: 'More dropdowns...', col: YELLOW[7], text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: l3, enable_sdf_rect: rcorners, }); dpsub4.AddToMenu(l3);
                  {
                     const sub_dp1_count = 2;
                     const sub_dp2_count = 3;
                     const text_pad = [12, 6];
                     const pad = [6, 6];
                     const font_size = 8;
                     const dp_rcorners = 7;
                     const dp_col = GREY[4];
                     const menu_col = GREY[2];
                     const col = YELLOWR[7];
                     for (let i = 0; i < sub_dp1_count; i++) {

                        const dp_1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout:LAYOUT.RESIZE_SELF|LAYOUT.HORIZONTAL }));
                        Widget_gfx_ready_enable({ mesh: dp_1, enable_sdf_rect: dp_rcorners, })
                        dpsub4.AddToMenu(dp_1);
                        dp_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

                        const col1 = TRANSPARENCY(PURPLEB[6], 1.);
                        for (let j = 0; j < sub_dp2_count; j++) {

                           const dp_2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout:LAYOUT.RESIZE_SELF|LAYOUT.HORIZONTAL }));
                           Widget_gfx_ready_enable({ mesh: dp_2, enable_sdf_rect: dp_rcorners, })
                           dp_1.AddToMenu(dp_2);
                           dp_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                           dp_2.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                           const col2 = TRANSPARENCY(GREEN[6], 1.)

                           for (let k = 0; k < sub_dp2_count; k++) {

                              const dp_3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size }));
                              Widget_gfx_ready_enable({ mesh: dp_3, enable_sdf_rect: dp_rcorners, })
                              dp_2.AddToMenu(dp_3);
                              dp_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                              dp_3.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                              const col3 = TRANSPARENCY(YELLOW[6], 1.)
                              for (let n = 0; n < 6; n++) {

                                 const dp_4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col3, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size }));
                                 Widget_gfx_ready_enable({ mesh: dp_4, enable_sdf_rect: dp_rcorners, })
                                 dp_3.AddToMenu(dp_4);
                                 dp_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                                 dp_4.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

                              }
                           }
                        }
                     }
                  }
               }

            }

         }
      }
   }


   Align_nested_sections_pre(section);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();


   section.Render()
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)


   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
   View_build_group_from_root_mesh(section);

   // // Color some words
   // info.text_mesh.SetColorRGBSpecificIndex(YELLOWR[9], 0, 8);
   // info.text_mesh.SetColorRGBSpecificIndex(GREEN[7], 8, 13);

   return section;
}





export function Demo_widgets(root_widget = ROOT_WIDGETS.CREATE_ROOT, pos = [0, 0], control_slider_distance = null, control_slider_smoothness = null, control_slider_intensity = null) {

   const text_sample_widgets = `\
GENERIC WIDGETS\
   `;

   const rcorners = 10;
   const switch_size = 18;
   const font_size = 10;

   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;

   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: root_widget, options: SECTION.HORIZONTAL, pad: [20, 20], pos: [pos[0] + l_pad, pos[1] + t_pad, 0], dim: [100, 100], col: TRANSPARENCY(GREY[3], .6), name:'Demo_widgets'}));
   Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, });
   section.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL;
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;





   /** Create the info for the uuser */
   const info = Create_widget_label(Style_label_default_properties({ text: text_sample_widgets, col: GREY[4], text_col: WHITE, text_pad: [10, 10], texture_id: default_font, font_size: font_size, }));
   Widget_gfx_ready_enable({ mesh: info, enable_sdf_rect: rcorners, });
   info.align.flags = LAYOUT.HORIZONTAL;
   section.AddItem(info);


   /**************************************************************************************************************************************************/

   // Create Button Widget with counter on click
   {
      const s = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: [0, 0], col: TRANSPARENCY(GREY[3], .4), name:'Button panel' }));
      Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, });
      s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
      section.AddItem(s);

      const btn = Create_widget_button(Style_button_default_properties({ text: 'Button', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, col: BLUEL[7], text_col: WHITE, text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
      Widget_gfx_ready_enable({ mesh: btn, enable_sdf_rect: rcorners, });
      btn.align.flags = LAYOUT.HORIZONTAL;
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s.AddItem(btn);

      const label = Create_widget_label(Style_label_default_properties({ text: '000', col: GREY[2], text_col: GREENL[9], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
      Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: rcorners, });
      label.align.flags = LAYOUT.HORIZONTAL
      s.AddItem(label);

      const params = { counter: 0, }

      btn.Bind(
         (params) => {
            params.params.counter++;
            label.text_mesh.RenderTextFromNumber(params.params.counter);
         },
         _, params, _,
      );
   }

   // Create Switch Widget
   {
      const s = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: [0, 0], col: TRANSPARENCY(GREY[3], .4), }));
      Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, });
      s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
      s.SetName('Switches panel');
      section.AddItem(s);

      const switch_pad = [3, 3];

      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: [0, 0], col: TRANSPARENCY(GREY[4], .4), }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
         s1.SetName('One Switch panel');
         s.AddItem(s1);

         const switch1 = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 0], size: switch_size, col: YELLOWR[7], pad: switch_pad, }));
         Widget_gfx_ready_enable({ mesh: switch1, enable_sdf_rect: switch1.geom.dim[1], });
         switch1.align.flags = LAYOUT.VERTICAL;
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
         const label = Create_widget_label(Style_label_default_properties({ text: 'off', col: GREY[2], text_col: GREY[5], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
         Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: switch1.geom.dim[1], });
         label.align.flags = LAYOUT.HORIZONTAL;
         s1.AddItem(label);
      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: [0, 0], col: TRANSPARENCY(GREY[4], .4), }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
         s1.SetName('One Switch panel');
         s.AddItem(s1);
         const switch1 = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 0], size: switch_size, col: PURPLER[7], pad: switch_pad, }));
         Widget_gfx_ready_enable({ mesh: switch1, enable_sdf_rect: switch1.geom.dim[1], });
         switch1.align.flags = LAYOUT.HORIZONTAL;
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
         const label = Create_widget_label(Style_label_default_properties({ text: 'off', col: GREY[2], text_col: GREY[5], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
         Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: switch1.geom.dim[1], });
         label.align.flags = LAYOUT.HORIZONTAL;
         s1.AddItem(label);

      }
      {
         const s1 = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.HORIZONTAL, pad: [10, 10], dim: [0, 0], col: TRANSPARENCY(GREY[4], .4), }));
         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, });
         s1.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
         s1.SetName('One Switch panel');
         s.AddItem(s1);
         const switch1 = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 0], size: switch_size, col: BLUEL[7], pad: switch_pad, }));
         Widget_gfx_ready_enable({ mesh: switch1, enable_sdf_rect: switch1.geom.dim[1], });
         switch1.align.flags = LAYOUT.VERTICAL;
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
         const label = Create_widget_label(Style_label_default_properties({ text: 'off', col: GREY[2], text_col: GREY[5], text_pad: [16, 8], texture_id: default_font, font_size: font_size, }));
         Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: switch1.geom.dim[1], });
         label.align.flags = LAYOUT.HORIZONTAL;
         s1.AddItem(label);
      }

   }


   // Create Slider Widget
   {
      const s = Create_rect_mesh(Style_rect_default_properties({ is_root: _, options: SECTION.VERTICAL, pad: [10, 10], dim: [0, 0], col: TRANSPARENCY(GREY[3], .4) }));
      Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, });
      s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
      s.SetName('Slider panel');
      section.AddItem(s);

      const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 1], dim: [100, 10], col: TRANSPARENCY(GREY[2], .6), name: 'Test slider', texture_id: default_font, font_size: font_size }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, });
      slider.align.flags = LAYOUT.VERTICAL;
      slider.SetInitialValue(0);
      s.AddItem(slider);

      const label = Create_widget_label(Style_label_default_properties({ text: 'Move slider', col: GREY[5], texture_id: default_font, font_size: font_size - 1, }));
      Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: rcorners, });
      label.align.flags = LAYOUT.VERTICAL;
      s.AddItem(label);

      const clbk_params = { label: label, posx: s.geom.pos[0] + label.geom.pos[0] };
      Slider_connect(slider,
         (params, slider_val) => {

            const label = params.clbk_params.label;
            if (label.gfx === null) return;

            const dist = label.geom.pos[0] + (label.geom.dim[0]) * (slider_val + 1);
            label.SetWposX(dist);
            const pad = label.StylesGetPad(STYLES.AXIS.X);
            Mesh_set_wpos_relative_x(label.text_mesh, dist - label.text_mesh.text_width + pad * 2);
            // label.text_mesh.SetWposXFromAddWPos(dist - label.text_mesh.text_width + pad * 2);
         },
         clbk_params,
      );

   }






   /**************************************************************************************************************************************************/
   // Render

   Align_nested_sections_pre(section);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();


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

   const rcorners = 10;
   const text_pad = [16, 10];
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
   const font_size = 10;
   // if (!PLATFORM.ANY_SMARTPHONE_DEVICE) font_size = 8;

   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: root_widget, pad: [20, 20], pos: [l_pad, y + t_pad, 0], col: TRANSPARENCY(GREY[3], .8), }));
   Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, });
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Demo_widgets_colorpicker')




   /** Create the info for the user */
   const info = Create_widget_label(Style_label_default_properties({ text: text_sample_colorpicker, col: GREY[5], text_pad: text_pad, texture_id: default_font, font_size: font_size, }));
   Widget_gfx_ready_enable({ mesh: info, enable_sdf_rect: rcorners, });
   section.AddItem(info);


   // const colorpicker = Demo_widgets_colorpicker(0x0, 0, 0, _, _, _, _, _, _, 0x0,);
   const colorpicker = Demo_widgets_colorpicker(0x0, 0, 0, _, _, _, _, _, _, 0x0);
   colorpicker.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF;
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

      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

      Align_nested_sections_pre(section);

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
Each font size is represented by its own font texture. 
The engine combines different font size textures
in to one atlas texture, usualy per font type. 
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




   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: SECTION.VERTICAL, pad: [20, 20], pos: [x + l_pad, y + t_pad, 0], dim: [0, 0], col: TRANSPARENCY(GREY[3], .9) }));
   Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 4, });
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('Msdf_text_info');
   section.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL;





   /** Create the info for the user */
   const s = Create_rect_mesh(Style_rect_default_properties({ options: SECTION.VERTICAL, pad: [10, 10], pos: [x + l_pad, y + t_pad, 0], dim: [0, 0], col: TRANSPARENCY(GREY[1], .4) }));
   Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: 4, });
   s.SetName('Msdf_text_info_sub_section');
   s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL;
   section.AddItem(s);

   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   const font_size = 10;
   const info1 = Create_widget_label(Style_label_default_properties({ is_root: _, col: GREY[4], text_pad: [10, 10], text: text_sample_explainer1, texture_id: font, font_size: font_size, text_col: WHITE, is_debug_mesh: false, }));
   Widget_gfx_ready_enable({ mesh: info1, enable_sdf_rect: 4, });
   info1.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info1);

   const info2 = Create_widget_label(Style_label_default_properties({ is_root: _, col: GREY[4], text_pad: [10, 10], text: text_sample_explainer2, texture_id: font, font_size: font_size, text_col: WHITE, is_debug_mesh: false, }));
   Widget_gfx_ready_enable({ mesh: info2, enable_sdf_rect: 4, });
   info2.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info2);

   const info3 = Create_widget_label(Style_label_default_properties({ is_root: _, col: GREY[4], text_pad: [10, 10], text: text_sample_explainer3, texture_id: font, font_size: font_size, text_col: WHITE, is_debug_mesh: false, }));
   Widget_gfx_ready_enable({ mesh: info3, enable_sdf_rect: 4, });
   info3.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info3);

   const info4 = Create_widget_label(Style_label_default_properties({ is_root: _, col: GREY[4], text_pad: [10, 10], text: text_sample_explainer4, texture_id: font, font_size: font_size, text_col: WHITE, is_debug_mesh: false, }));
   Widget_gfx_ready_enable({ mesh: info4, enable_sdf_rect: 4, });
   info4.align.flags = LAYOUT.VERTICAL | LAYOUT.EXPAND;
   s.AddItem(info4);


   /********************************************************************************************************************************************************/
   // Align
   Align_nested_sections_pre(section);
   Align_expand(section)


   /**************************************************************************************************************************************************/
   // Render

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, section.mesh_bufferidx, true);
   section.GenGfxCtx();

   section.Render()
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);



   info1.text_mesh.SetColorRGBSpecificIndex(YELLOWR[9], 0, 14);




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
The quick brown fox jumps over the lazy dog[!]
   `;

   const ret2 = Widget_msdf_text_with_scale_slider(ROOT_WIDGETS.CREATE_ROOT, text, TEXTURES.MTSDF_CONSOLAS_1024, x, y, 20, GREY[0], 300, _, _, _);
   // const slider = ret2.slider;
   // const msdf_text = ret2.msdf_text;


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

   // const picker = Create_widget_color_picker(root_widget, [20, 20], [x, y, 0], [w, h], [c1, c2, c3, c4], _, Mesh_create_style_from_values(10, 2, 0));
   const picker = Create_widget_color_picker(Style_color_picker_default_properties({is_root:root_widget, pad:[20, 20], pos:[x, y, 0], 
      dim:[w, h], col:_, 
      // rcorners: {
      //    color_picker:  10,
      //    panel:         10,
      //    color_pick:    10,
      //    panel2:        10,
      //    color_present: 10,
      //    slider_trans:  4,
      //    handle_trans:  2,
      //    slider_hue:    6,
      //    labels:        10,
      // },
   }));

   // const tarnsparency_handle = picker.GetTransparencySliderHandle();
   // const tarnsparency_handle_rcorners = Min(tarnsparency_handle.geom.dim[0], tarnsparency_handle.geom.dim[1])
   // picker.GfxEnableAttr(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8, 8, 6, 4, 4, 4, tarnsparency_handle_rcorners, 4, 4);

   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) picker.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   picker.sid.inst = render_instanced_flags;

   picker.ColorpickerCreateListeners();


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      picker.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, picker.mesh_bufferidx, true);
      picker.GenGfxCtx();
      Align_nested_sections_pre(picker);

      picker.Render();
      Root_group_activate_all_vbs_in_renderqueue(picker.root_bufferidx);
      picker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, picker.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(picker);
      Construct_listen_events_relations_from_mesh_tree(picker);
   }

   return picker;

}





export function Demo_complicated_widget_layout(pos = [0, 0, 0]) {


   const Many_sections_builder = () => {

      const tr = 1.;

      const blu = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(BLUEL[7], tr), [15, 15],);
      blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      blu.SetLayout(LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF);


      const red = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(REDL[7], tr));
      red.SetLayout(LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF);
      red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      blu.AddItem(red);


      {
         const black1 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(GREY[1], tr),);
         black1.SetLayout(LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF);
         black1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         red.AddItem(black1);

         const grey11 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(GREY[4], tr),);
         grey11.SetLayout(LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF);
         grey11.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         black1.AddItem(grey11);

         const red111 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(REDL[7], tr),);
         red111.SetLayout(LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF);
         red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         grey11.AddItem(red111);

         const yel_1 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(YELLOWR[7], tr),);
         yel_1.SetLayout(LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF);
         yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         grey11.AddItem(yel_1);

         const purp12 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(PURPLE[7], tr),);
         purp12.SetLayout(LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF);
         purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         black1.AddItem(purp12);

         const blue13 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(BLUEL[5], tr),);
         blue13.SetLayout(LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF);
         blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         black1.AddItem(blue13);

         const green14 = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(GREEN[5], tr),);
         green14.SetLayout(LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF);
         green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         black1.AddItem(green14);
      }
      return blu;
   }
   function Many_labels_in_scroller(num_items = 10, font_size = 8) {

      const colors = [REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],];

      const section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], dim: [20, 20], col: TRANSPARENCY(GREY[0], 1.) }));
      Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 15 });
      section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      // section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 15);
      // section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      section.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;



      for (let i = 0; i < num_items; i++) {

         const label = Create_widget_label(Style_label_default_properties({ text: `${i}`, font_size: font_size, col: TRANSPARENCY(colors[i], .8), text_pad: [6, 4] }))
         Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 15 });
         // label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
         // label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         label.align.flags = LAYOUT.VERTICAL;
         label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
         section.AddItem(label);
      }

      // if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

      //    Align_nested_sections_pre(section)

      //    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      //    section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      //    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);



      // const clbk = ()=>{console.error('09093089348938948973')}
      const clbk = () => {
         View_build_group_from_root_mesh(section);

         // section.Render();
         Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

         // section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

         // Construct_listen_events_from_mesh_tree(section)
         // Construct_listen_events_relations_from_mesh_tree(section);

         const scroller_height = 40;
         const scroller_component = Components_create_scroller_component(10, scroller_height, section);
         console.log(scroller_component)
         Scoller_component_gengfx_and_render(scroller_component, section);
         Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(section.root_posidx, scroller_component.root_posidx);
         section.AddChildScrollerIdx(section.scroller_comp_idx);
         Listeners_set_priority(E.C, scroller_component.listeners)

         Scroller_component_calculate_handle_pos_dim(section, scroller_component);


         //    // Set scissor box
         //    const mx = section.mesh_bufferidx;
         //    const my = scroller_component.mesh_bufferidx;
         //    const mw = section.mesh_bufferidx;
         //    const mh = scroller_component.mesh_bufferidx;
         //    Vertex_buffer_group_create_scissorbox(section.gfx.vb.groupidx, mx, my, mw, mh);


         //    // Unfortunately must Re-render the section for the clipping of the scroller to take place
         //    Root_group_reset_gfxs(section.root_bufferidx);
         //    Root_group_rerender_from_root_reconstruct_listeners(section.root_bufferidx);
      }


      // }

      return { scroller: section, clbk: clbk };
   }


   const todo = { clbk: null }

   // Widget creation functions
   const Many_labels = (panel_col, align) => {
      const panel = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(panel_col, .4));
      panel.align.flags = LAYOUT.RESIZE_SELF | align;
      { const l = Widget_ready_label(0x0, 'Hi', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, GREY[4], _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      { const l = Widget_ready_label(0x0, 'This is', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, GREY[4], _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      { const l = Widget_ready_label(0x0, 'a sample', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, GREY[4], _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      { const l = Widget_ready_label(0x0, 'of labels', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, GREY[4], _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      return panel;
   }
   /** Test: Many section */
   const Many_sections = (panel_col, align) => {
      const panel = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(panel_col, .4));
      panel.align.flags = LAYOUT.RESIZE_SELF | align;
      { const l = Widget_ready_label(0x0, 'Hover Me!', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, panel_col, _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      const sections = Many_sections_builder();
      sections.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
      panel.AddItem(sections);
      return panel;
   }
   /** Test: Sliders */
   const Many_sliders = (panel_col, align) => {
      const panel = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(panel_col, .4));
      panel.align.flags = LAYOUT.RESIZE_SELF | align;
      { const l = Widget_ready_label(0x0, 'Slide Me!', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, panel_col, _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      const slider = Widget_ready_slider(_, _,);
      slider.align.flags = LAYOUT.VERTICAL;
      panel.AddItem(slider);
      return panel;
   }
   /** Test: Switches */
   const Many_switches = (panel_col, align) => {
      const panel = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(panel_col, .4));
      panel.align.flags = LAYOUT.RESIZE_SELF | align;
      { const l = Widget_ready_label(0x0, 'Switch Me!', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, panel_col, _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      { const switch1 = Widget_ready_switch(); switch1.align.flags = LAYOUT.VERTICAL; panel.AddItem(switch1); }
      { const switch1 = Widget_ready_switch(); switch1.align.flags = LAYOUT.VERTICAL; panel.AddItem(switch1); }
      { const switch1 = Widget_ready_switch(); switch1.SetLayout(LAYOUT.VERTICAL); panel.AddItem(switch1); }
      return panel;
   }
   /** Test: Scroller */
   const Many_scrollers = (panel_col, align) => {
      const panel = Widget_ready_rect(_, _, _, _, _, TRANSPARENCY(panel_col, .4));
      panel.align.flags = LAYOUT.RESIZE_SELF | align;
      { const l = Widget_ready_label(0x0, 'Scroll Me!', TEXTURES.MTSDF_CONSOLAS_1024, _, _, 10, panel_col, _, _,); panel.AddItem(l); l.align.flags = LAYOUT.HORIZONTAL; }
      const { scroller, clbk } = Many_labels_in_scroller();
      todo.clbk = clbk;
      scroller.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF;
      panel.AddItem(scroller);
      return panel;
   }

   const text_pad = [12, 4];
   const pad = [5, 5];
   const font_size = 8;
   const dp_rcorners = 7;
   const menu_rcorners = 7;
   const btn_rcorners = 7;

   const dp_col = GREY[3];
   const menu_col = GREY[2];
   const btn_col = GREY[6];
   const color_intensity = 8;


   const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, text: `ROOT`, pos: pos, col: dp_col, menu_col: menu_col, btn_col: btn_col, text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
   Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: 15 });
   // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
   // dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   dp.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
   dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   Dropdown_roots_set_root(dp, dp);


   const sub_dp1_count = 2;
   const sub_dp2_count = 2;
   let zpos = 1

   { const l = Widget_ready_label(_, 'LEVEL 1!', _, _, _, _, ORANGE[3]); dp.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }

   let col = GetSequencedColor(color_intensity)
   for (let i = 0; i < sub_dp1_count; i++) {

      const align_l1 = (i % 2) ? LAYOUT.HORIZONTAL : LAYOUT.VERTICAL;

      const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos++], col: dp_col, menu_col: menu_col, btn_col: btn_col, text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
      Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 15 });
      // dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
      // dpsub1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      dpsub1.align.flags = align_l1 | LAYOUT.RESIZE_SELF
      dp.AddToMenu(dpsub1);

      { const l = Widget_ready_label(_, 'LEVEL 2!', _, _, _, _, ORANGE[5]); dpsub1.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }


      col = GetSequencedColor(color_intensity)
      for (let j = 0; j < sub_dp2_count; j++) {

         // const align_l2 = (j % 2) ? LAYOUT.HORIZONTAL : LAYOUT.VERTICAL; 
         const align_l2 = LAYOUT.VERTICAL;

         const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos++], col: dp_col, menu_col: menu_col, btn_col: btn_col, text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
         Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 15 });
         // dpsub2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
         // dpsub2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         dpsub2.align.flags = align_l2 | LAYOUT.RESIZE_SELF
         dpsub1.AddToMenu(dpsub2);

         { const l = Widget_ready_label(_, 'LEVEL 3!', _, _, _, _, ORANGE[7]); dpsub2.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }

         const col2 = GetSequencedColor(color_intensity)
         for (let k = 0; k < sub_dp2_count; k++) {

            const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}${k}`, pos: [0, 0, zpos++], col: dp_col, menu_col: menu_col, btn_col: btn_col, text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
            Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 15 });
            // dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
            //    dpsub3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            dpsub3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            dpsub2.AddToMenu(dpsub3);

            // { const l = Widget_ready_label(_, 'LEVEL 4!',_,_,_,_,ORANGE[9]); dpsub3.AddToMenu(l); l.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); }

            { const w = Many_labels(GetSequencedColor(color_intensity), LAYOUT.VERTICAL); dpsub3.AddToMenu(w); }
            { const w = Many_sections(GetSequencedColor(color_intensity), LAYOUT.VERTICAL); dpsub3.AddToMenu(w); }
            { const w = Many_switches(GetSequencedColor(color_intensity), LAYOUT.HORIZONTAL); dpsub3.AddToMenu(w); }
            { const w = Many_sliders(GetSequencedColor(color_intensity), LAYOUT.VERTICAL); dpsub3.AddToMenu(w); }
            // { const w = Many_scrollers(GetSequencedColor(color_intensity), LAYOUT.VERTICAL); dpsub3.AddToMenu(w); }

         }
      }

   }

   // { const w = Many_scrollers(GetSequencedColor(color_intensity), LAYOUT.VERTICAL); dp.AddToMenu(w); }


   Align_nested_sections_pre(dp)

   dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

   dp.Render()
   Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

   dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(dp)
   Construct_listen_events_relations_from_mesh_tree(dp);

   // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
   View_build_group_from_root_mesh(dp);

   // todo.clbk()

   return dp;
}