"use strict";

import { Dropdown_roots_set_root, TEMP_DP_STEAL_THE_DP_RECALC } from "../Widgets/Widget_Dropdown.js";
import { PerformanceTimersGetFps, PerformanceTimersGetMilisec, PerformanceTimersGetWorstFps, Performance_timer_create_secondary_timer, Performance_timers_get_avg_1sec_reset } from "../../Timers/PerformanceTimers.js";
import { Create_rect_mesh, Create_widget_dropdown, Create_widget_label, Create_widget_multi_text, Create_widget_scroller, Create_widget_section, Create_widget_text } from "../../Core/CreateWidget.js";
import { Mesh_buffer_get_count, Mesh_buffer_get_mesh_byidx, Mesh_buffer_get_size, Mesh_per_vb_get_count, Mesh_per_vb_get_size, Mesh_per_vb_get_vb_byidx } from "../../Core/MeshBuffer.js";
import { Time_intervals_create, } from "../../Timers/TimeIntervals.js";
import { Ui_create_label_switch } from "./DebugInfoUiFactory.js";
import { BLACK, BLUEL, GREEN, GREY, ORANGEL, PURPLEB, REDL, WHITE, YELLOW, YELLOWR } from "../Material/Base/Colors.js";
import { NOTIFICATION_TYPE, Notifications_deactivate, Notifications_get_ui_widget, Notifications_initialize, Notifications_set_ui_widget } from "./DebugInfoUiNotifications.js";
import { View_add_to_group, View_build_group_from_root_mesh, View_remove_view, View_get_count, View_remove_from_group, View_set_view_vb_start, View_render_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/Views/MeshBufferViews.js";
import { Clipy_from_group, Clipy_from_tree_recursive, Clipy_one_mesh } from "../Operations/Clip.js";
import { VBI_get_byidx, Vertex_buffer_get_Active_count, Vertex_buffer_group_get_byidx, Vertex_buffer_group_get_count, Vertex_buffer_group_get_size } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Str_buffer_get_count, Str_buffer_get_size, Str_buffer_mesh_names_get_by_idx, Str_buffer_mesh_names_get_count, Str_buffer_mesh_names_get_size } from "../../Core/StringBuffer.js";
import { GetRandomColor } from "../../../Helpers/Helpers.js";
import { Generic_buffers_container_get_active_count, Generic_buffers_container_get_boundary, Generic_buffers_container_get_size, New_generic_buffer, New_int8_buffer } from "../../Core/Buffers.js";
import { Renderqueue_active_get_count, Renderqueue_get_byidx, Renderqueue_get_count, Renderqueue_get_size } from "../../Renderers/Renderer/RenderQueue.js";
import { Mesh_unif_col_get_count, Mesh_unif_col_get_size, Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_wpos_get_count, Mesh_unif_wpos_get_size, Screen_wpos_get_y } from "../../Core/MeshUniformsBuffer.js";
import { Listeners_click_get_count, Listeners_hover_get_count, Listeners_set_priority } from "../../Events/EventListeners.js";
import { Info_listener_create_event, Info_listener_remove_event } from "./InfoListeners.js";
import { Floor } from "../../../Helpers/Math/MathOperations.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Operations/Recursions.js";
import { Components_create_scroller_component, Scoller_component_destroy, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from "../Widgets/ScrollerComponent.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_view_buffer_get, Root_group_view_buffer_get_byidx, Root_group_view_buffer_get_count, Root_group_rerender, Root_group_reset_gfxs, Root_group_set_render_queue_flags } from "../../Core/Views/RootView.js";
import { Renderer_get_performance_timer_query_avaraged } from "../../Renderers/Renderer.js";
import { Align_pre_simple } from "../../../App/Tests/TestAlignNestedSections.js";
import { Style_dropdown_default_properties, Style_rect_default_properties, Style_section_default_properties } from "../Widgets/WidgetReadyStyles.js";
import { Demo_complicated_widget_layout } from "../../../App/Demo/DemoWidgets.js";
import { Widget_gfx_ready_enable } from "../../../App/Widgets/WidgetGfxReady.js";













export function Dbg_ui_info_all_reset() {
   Dbg_ui_reset_buffer_entries();
   Dbg_ui_info_reset();
   DEBUG_INFO.Reset();

   NOTIFICATION_TYPE.Reset();
   Notifications_initialize();
}











/************************************************************************************************************************************************/
// Absolut Position Basic Info: {Fps, MeshCount, ...}
/************************************************************************************************************************************************/
export function Debug_info_ui_static(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0) {

   const transp = .9;
   const zpos = 0;
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, zpos], [0, 0], TRANSPARENCY(GREY[2], transp), 'ui performance timers panel', _, _, _);
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui performance timers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   section.SetName('InfoUi-static');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   const fontsize = 7;
   const fontsizedynamic = 7.5;
   let pad1 = [4, 0];
   let pad2 = [4, 0];
   const g_ms = 0;
   let ms = 500;
   const align = ALIGN.HORIZONTAL;
   // const align = ALIGN.VERTICAL;

   //TODO: Name all the timers correctly

   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   { // FPS average 1 second

      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'FPS:', 
         align:ALIGN.HORIZONTAL, 
         pos:[0, 0, zpos + 1], 
         font_size:fontsizedynamic, 
         col:TRANSPARENCY(WHITE, transp), 
         bold:.5, 
         pad:pad1, 
         texture_id:TEXTURES.CONSOLA_VARIANT_FONT, 
         variant_idx:ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_5,
         is_debug_mesh:false,
      });
      Widget_gfx_ready_enable({mesh:timer, enable_attr_dim:false,});
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9,);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.GameLoop, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('Meshes:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_buffer_get_count, _, _, _); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      timer.CreateNewText('Active VBs:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop 1secReset`, ms, Renderqueue_get_count, _, _, generic_time_interval)

      timer.CreateNewText('GPU:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop 1secReset`, ms, Renderer_get_performance_timer_query_avaraged, gfxCtx, _, generic_time_interval)
      timer.CreateNewText('ms', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
   }
   { // Device Info
      /**
         DEVICE.info: 
         inner_width:window.innerWidth,
         inner_height:window.innerHeight,
         outer_width:window.outerWidth,
         outer_height:window.outerHeight,
         
         page_xoffset:window.pageXOffset,
         page_yoffset:window.pageYOffset,
         
         gpu:window.navigator.gpu,
         
         virtual_keyboard:window.navigator.virtualKeyboard,

         offsetHeight:   document.documentElement.offsetHeight,
         offsetLeft:   document.documentElement.offsetLeft,
         offsetParent:   document.documentElement.offsetParent,
         offsetTop:   document.documentElement.offsetTop,
         offsetWidth:   document.documentElement.offsetWidth,
         clientHeight:   document.documentElement.clientHeight,
         clientLeft:   document.documentElement.clientLeft,
         clientTop:   document.documentElement.clientTop,
         clientWidth:   document.documentElement.clientWidth,
       */

      // ms = (g_ms) ? g_ms : 1000;
      // const nfo1 = Create_widget_multi_text(_, 'clientHeight:', align, [0, 0, zpos + 1], fontsizedynamic, TRANSPARENCY(WHITE, transp), .5, pad1,TEXTURES.CONSOLA_VARIANT_FONT, _, ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_5);
      // section.AddItem(nfo1);
      // nfo1.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo1.SetDynamicText(`ms${ms} Renderloop avg`, ms, ()=>{return DEVICE.info.clientHeight}, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo1 for each widget dynamic text.
      // generic_time_interval = nfo1.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      // nfo1.CreateNewText('clientLeft:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      // nfo1.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo1.SetDynamicText(`ms${ms} Stats MeshCount`, ms, ()=>{return DEVICE.info.clientLeft}, _, _, _); // idx param is for use in creating separate nfo1 for each widget dynamic text.
      // generic_time_interval = nfo1.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      // //////////////////////////////////////////////////////////
      // const nfo12 = Create_widget_multi_text(_, 'clientTop:', align, [0, 0, zpos + 1], fontsizedynamic, TRANSPARENCY(WHITE, transp), .5, pad1);
      // section.AddItem(nfo12);
      // nfo12.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo12.SetDynamicText(`ms${ms} Renderloop avg`, ms, ()=>{return DEVICE.info.clientTop}, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo1 for each widget dynamic text.
      // generic_time_interval = nfo12.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      // nfo12.CreateNewText('clientWidth:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      // nfo12.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo12.SetDynamicText(`ms${ms} Renderloop 1secReset`, ms, ()=>{return DEVICE.info.clientWidth}, _, _, generic_time_interval)
      // generic_time_interval = nfo12.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];



      // //////////////////////////////////////////////////////////
      // const nfo3 = Create_widget_multi_text(_, 'offsetLeft:', align, [0, 0, zpos + 1], fontsizedynamic, TRANSPARENCY(WHITE, transp), .5, pad1);
      // section.AddItem(nfo3);
      // nfo3.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo3.SetDynamicText(`ms${ms} Renderloop avg`, ms, ()=>{return DEVICE.info.offsetLeft}, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo2 for each widget dynamic text.
      // generic_time_interval = nfo3.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      // nfo3.CreateNewText('offsetHeight:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      // nfo3.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo3.SetDynamicText(`ms${ms} Renderloop 1secReset`, ms, ()=>{return DEVICE.info.offsetHeight}, _, _, generic_time_interval)
      // generic_time_interval = nfo3.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];



      // //////////////////////////////////////////////////////////
      // const nfo4 = Create_widget_multi_text(_, 'offsetWidth:', align, [0, 0, zpos + 1], fontsizedynamic, TRANSPARENCY(WHITE, transp), .5, pad1);
      // section.AddItem(nfo4);
      // nfo4.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo4.SetDynamicText(`ms${ms} Renderloop avg`, ms, ()=>{return DEVICE.info.offsetWidth}, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo2 for each widget dynamic text.
      // generic_time_interval = nfo4.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      // nfo4.CreateNewText('offsetTop:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      // nfo4.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      // nfo4.SetDynamicText(`ms${ms} Renderloop 1secReset`, ms, ()=>{return DEVICE.info.offsetTop}, _, _, generic_time_interval)
      // generic_time_interval = nfo4.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      Align_pre_simple(section);
      // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET | GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx, true);
      section.GenGfxCtx();

      // section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      // section.Calc_no_gfx_update();

      section.Render();
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   }

   return section;

}
export function Debug_info_ui_static_more_performance_timers(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0) {

   const transp = .9;
   const zpos = 0;
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, zpos], [0, 0], TRANSPARENCY(GREY[2], transp), 'ui performance timers panel', _, _, _);
   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui performance timers panel', options:SECTION.VERTICAL, pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), }));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui performance timers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   section.SetName('MorePerformanceTimers');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   const fontsizedynamic = 18.5;
   let pad1 = [4, 0];
   let pad2 = [4, 0];
   const g_ms = 0;
   let ms = 500;
   const align = ALIGN.HORIZONTAL;

   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   { // FPS average 1 second

      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Particles Emitt:', 
         align:align, 
         pos:[0, 0, zpos + 1], 
         font_size:fontsizedynamic, 
         col:TRANSPARENCY(WHITE, transp), 
         pad:pad1, 
         texture_id:TEXTURES.CONSOLA_VARIANT_FONT, 
         variant_idx:ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_5,
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9,);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.Particles, 0], _, generic_time_interval, ); // idx param is for use in creating separate timer for each widget dynamic text.
      // timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.Particles, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('Particles Update:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval, ); // idx param is for use in creating separate timer for each widget dynamic text.
      // timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET | GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx, true);
      section.GenGfxCtx();

      section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      section.Calc_no_gfx_update();

      section.Render();
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   }

   return section;

}
export function Debug_info_ui_static_app_generic_buffers_container(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0) {

   const transp = .9;
   const zpos = 0;
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, zpos], [0, 0], TRANSPARENCY(GREY[2], transp), 'ui performance timers panel', _, _, _);
   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui performance timers panel', options:SECTION.VERTICAL, pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), }));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui performance timers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   section.SetName('ApplicationBuffers');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   const fontsizedynamic = 7.5;
   let pad1 = [4, 0];
   let pad2 = [4, 0];
   const g_ms = 0;
   let ms = 500;
   const align = ALIGN.HORIZONTAL;

   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   { // Generic Buffer

      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Generic Buffers:', 
         align:align, 
         pos:[0, 0, zpos + 1], 
         font_size:fontsizedynamic, 
         col:TRANSPARENCY(WHITE, transp), 
         pad:pad1, 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         // variant_idx:ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_5,
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      // timer.CreateNewText('Size:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Generic_buffers_container_get_size, [PERFORMANCE_TIMERS_IDXS.Particles, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('Count:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Generic_buffers_container_get_active_count, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('Boundary:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Generic_buffers_container_get_boundary, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET | GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx, true);
      section.GenGfxCtx();

      section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      section.Calc_no_gfx_update();

      section.Render();
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   }

   return section;

}
export function Debug_info_ui_static_app_generic_buffers(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0) {

   const transp = .9;
   const zpos = 0;
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, zpos], [0, 0], TRANSPARENCY(GREY[2], transp), 'ui performance timers panel', _, _, _);
   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui performance timers panel', options:SECTION.VERTICAL, pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), }));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui performance timers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});

   section.SetName('ApplicationBuffers');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   const fontsizedynamic = 7.5;
   let pad1 = [4, 0];
   let pad2 = [4, 0];
   const g_ms = 0;
   let ms = 500;
   const align = ALIGN.HORIZONTAL;

   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   { // Generic Buffer

      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Total Generic | Num buffers:', 
         align:align, 
         pos:[0, 0, zpos + 1], 
         font_size:fontsizedynamic, 
         col:TRANSPARENCY(WHITE, transp), 
         pad:pad1, 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      // timer.CreateNewText('Size:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9,);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_generic_buffer_get_num_buffers, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('size:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_generic_buffer_get_size, [PERFORMANCE_TIMERS_IDXS.Particles, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('elems:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_generic_buffer_get_elems_count, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET | GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx, true);
      section.GenGfxCtx();

      section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      section.Calc_no_gfx_update();

      section.Render();
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   }

   return section;

}
export function Debug_info_ui_static_app_int16_buffers(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0) {

   const transp = .9;
   const zpos = 0;
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, zpos], [0, 0], TRANSPARENCY(GREY[2], transp), 'ui performance:int16_buffers panel', _, _, _);
   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui performance:int16_buffers panel', options:SECTION.VERTICAL, pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), }));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui performance:int16_buffers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});

   section.SetName('ApplicationBuffers');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   const fontsizedynamic = 7.5;
   let pad1 = [4, 0];
   let pad2 = [4, 0];
   const g_ms = 0;
   let ms = 500;
   const align = ALIGN.HORIZONTAL;

   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   { // Generic Buffer
      DEBUG_INFO_STRUCTS
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Total Int16 | Num buffers:', 
         align:align, 
         pos:[0, 0, zpos + 1], 
         font_size:fontsizedynamic, 
         col:TRANSPARENCY(WHITE, transp), 
         pad:pad1, 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      // timer.CreateNewText('Size:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_int16_buffer_get_num_buffers, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('size:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_int16_buffer_get_size, [PERFORMANCE_TIMERS_IDXS.Particles, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('elems:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_int16_buffer_get_elems_count, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET | GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx, true);
      section.GenGfxCtx();

      section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      section.Calc_no_gfx_update();

      section.Render();
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   }

   return section;

}
export function Debug_info_ui_static_app_int8_buffers(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0) {

   const transp = .9;
   const zpos = 0;
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, zpos], [0, 0], TRANSPARENCY(GREY[2], transp), 'ui performance:int16_buffers panel', _, _, _);
   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui performance:int8_buffers panel', options:SECTION.VERTICAL, pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), }));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui performance:int8_buffers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   section.SetName('ApplicationBuffers');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   const fontsizedynamic = 7.5;
   let pad1 = [4, 0];
   let pad2 = [4, 0];
   const g_ms = 0;
   let ms = 500;
   const align = ALIGN.HORIZONTAL;

   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   { // Generic Buffer
      DEBUG_INFO_STRUCTS
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Total Int8 | Num buffers:', 
         align:align, 
         pos:[0, 0, zpos + 1], 
         font_size:fontsizedynamic, 
         col:TRANSPARENCY(WHITE, transp), 
         pad:pad1, 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      // timer.CreateNewText('Size:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9, );
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9,);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_int8_buffer_get_num_buffers, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('size:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_int8_buffer_get_size, [PERFORMANCE_TIMERS_IDXS.Particles, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];


      timer.CreateNewText('elems:', fontsizedynamic, TRANSPARENCY(WHITE, transp), pad2, .9,);
      timer.CreateNewText('000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, Get_debug_info_structs_int8_buffer_get_elems_count, [PERFORMANCE_TIMERS_IDXS.Particles2, 0], _, generic_time_interval,); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET | GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx, true);
      section.GenGfxCtx();

      section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      section.Calc_no_gfx_update();

      section.Render();
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   }

   return section;

}

















/************************************************************************************************************************************************/
// Debug Info Ui Widget: A widget to open many different debuging info widgets
/************************************************************************************************************************************************/
// const _font_size = 100.47 / 5.556385362210606;
const _font_size = 10. ;

/** 'is_root_widget' can be two values: 1. ROOT_WIDGETS.CREATE_ROOT-which creates an independed widget, 2. undefined-which means that ths widget will belong to some parent structure */
export function Debug_info_ui(is_root_widget = undefined, x, y) {

   // Style generic for widgets.
   const tr = 1.5; // Transparency

   // Style for the Section widgets.
   const section_pad = [10, 0];
   const fontsize = _font_size;
   const dp_margin = [6, 6];

   // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
   // const label_style = [0, 3.5, 2.];
   const label_style = [8, 5, 3];
   const label_pad = [5, 4];
   const label_col = TRANSPARENCY(GREY[0], .0);
   const label_text_col = BLUEL[9];

   // Style for the switch widgets
   const switch_size = 14;
   const switch_pad = 4;
   const switch_col = TRANSPARENCY(GREY[0], .9);
   const switch_col2 = TRANSPARENCY(BLUEL[5], .9);

   const feather = 1.8;
   const rcorners = 6;
   
   // const dp = Create_widget_dropdown(Style_dropdown_default_properties({is_root:is_root_widget, text:'Debug Info', pos:[x, y, 0], col:TRANSPARENCY(GREY[0], .1), pad:dp_margin, text_pad:[10, 3], is_debug_mesh:true}));
   const dp = Create_widget_dropdown(Style_dropdown_default_properties({is_root:is_root_widget, text:'Debug Info', pos:[x, y, 0], col:_, pad:dp_margin, text_pad:[10, 3], is_debug_mesh:true}));
   // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   Dropdown_roots_set_root(dp, dp);

   // dp.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   {
      let zindex = dp.geom.pos[2];

      const section_col = GREY[1];

      /************************************************************************************************************************************************/
      // Performance timers
      const stats_ui = Ui_create_label_switch('Stats', fontsize, switch_size, Debug_info_create_ui_stats, null, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      dp.AddToMenu(stats_ui);
      // IMPORTANT: Must set of the gfx context flags bacause the fact that these meshes are not yet activated(dp is 'closed'), in order to do a 'FROM_PARENT_ASC_SEARCH_ALL' whenthe dp is 'opened'
      stats_ui.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      
      
      /************************************************************************************************************************************************/
      // Performance timers
      const perf_timers_ui = Ui_create_label_switch('Performance', fontsize, switch_size, Debug_info_create_ui_performance_timers, null, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      dp.AddToMenu(perf_timers_ui);
      perf_timers_ui.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      
      
      /************************************************************************************************************************************************/
      // Mouse Info
      const mouse_ui = Ui_create_label_switch('Mouse', fontsize, switch_size, Debug_info_create_ui_mouse, null, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      dp.AddToMenu(mouse_ui);
      mouse_ui.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


      // /************************************************************************************************************************************************/
      // // Mesh Tree
      // const mesh_ui = Ui_create_label_switch('Mesh Tree', fontsize, switch_size, Debug_info_create_mesh_info, null, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      // dp.AddToMenu(mesh_ui);


      // /************************************************************************************************************************************************/
      // // Mesh Tree
      // const mesh_tree_ui = Ui_create_label_switch('Mesh Tree', fontsize, switch_size, Debug_info_mesh_tree_create_ui, NOTIFICATION_TYPE.MESH_TREE_IDXS, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      // dp.AddToMenu(mesh_tree_ui);


      // /************************************************************************************************************************************************/
      // // Mesh Buffer
      // const mesh_buffer_ui = Ui_create_label_switch('Mesh Buffer', fontsize, switch_size, Debug_info_mesh_buffer_create_ui, NOTIFICATION_TYPE.MESH_BUFFER_IDXS, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      // dp.AddToMenu(mesh_buffer_ui);

      // /************************************************************************************************************************************************/
      // // String Buffer
      // const string_buffer_ui = Ui_create_label_switch('String Buffer', fontsize, switch_size, Debug_info_string_buffer_create_ui, NOTIFICATION_TYPE.STRING_BUFFER_IDXS, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      // dp.AddToMenu(string_buffer_ui);

      // /************************************************************************************************************************************************/
      // // Mesh per vb Buffer
      // const mesh_per_vb_buffer_ui = Ui_create_label_switch('Mesh Per Vb Buffer', fontsize, switch_size, Debug_info_mesh_per_vb_buffer_create_ui, NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      // dp.AddToMenu(mesh_per_vb_buffer_ui);

      // /************************************************************************************************************************************************/
      // // Vertex Buffer
      // const vertex_buffer_ui = Ui_create_label_switch('Vertex Buffer', fontsize, switch_size, Debug_info_vertex_buffer_create_ui, NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      // dp.AddToMenu(vertex_buffer_ui);


      // /************************************************************************************************************************************************/
      // // Render Queue
      // const render_queue_buffer_ui = Ui_create_label_switch('Render Queue Buffer', fontsize, switch_size, Debug_info_render_queue_buffer_create_ui, NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS, section_col, label_col, label_text_col, switch_col, switch_col2, section_pad, label_pad, switch_pad, label_style, zindex);
      // dp.AddToMenu(render_queue_buffer_ui);


      // /************************************************************************************************************************************************/
      // // Vertexbuffer 2D representation
      // // const vb2D_ui = Dbg_ui_create('Vb2D', fontsize,  switch_size, Debug_info_create_vertexbuffer_2D, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex);
      // // dp.AddToMenu(vb2D_ui);
   }



   dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT | SECTION.INHERIT;
   dp.menu.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT; // Set menu to expand to the dropdown's width

   if (is_root_widget !== undefined) {

      // dp.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      dp.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      dp.GenGfxCtx();
      // dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

      dp.Calc_no_gfx_update();

      dp.Render();
      Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

      dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)


      Construct_listen_events_from_mesh_tree(dp)
      Construct_listen_events_relations_from_mesh_tree(dp);

      // Create Group for this dropdown, to easily remove meshes from their vertex buffers and rebuild the vertex buffer
      View_build_group_from_root_mesh(dp);

   }

   return dp;
}


















/************************************************************************************************************************************************/
// Generic Stats
/************************************************************************************************************************************************/

// These functions are used only as for callbacks
function Get_debug_info_structs_generic_buffer_get_num_buffers() { return DEBUG_INFO_STRUCTS.BUFFER.GENERIC.NUM_BUFFERS; }
function Get_debug_info_structs_int8_buffer_get_num_buffers() { return DEBUG_INFO_STRUCTS.BUFFER.INT8.NUM_BUFFERS; }
function Get_debug_info_structs_int16_buffer_get_num_buffers() { return DEBUG_INFO_STRUCTS.BUFFER.INT16.NUM_BUFFERS; }
function Get_debug_info_structs_generic_buffer_get_size() { return DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE; }
function Get_debug_info_structs_int8_buffer_get_size() { return DEBUG_INFO_STRUCTS.BUFFER.INT8.TOTAL_BUFFER_SIZE; }
function Get_debug_info_structs_int16_buffer_get_size() { return DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE; }
function Get_debug_info_structs_generic_buffer_get_elems_count() { return DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT; }
function Get_debug_info_structs_int8_buffer_get_elems_count() { return DEBUG_INFO_STRUCTS.BUFFER.INT8.TOTAL_ELEM_COUNT; }
function Get_debug_info_structs_int16_buffer_get_elems_count() { return DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_ELEM_COUNT; }


function Debug_info_create_ui_stats() {


   if (DEBUG_INFO.UI_STATS.IS_ON) {

      const section = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_STATS.MESH_BUFFER_IDX);

      const pos = Mesh_unif_get_vb_root_wpos(section.root_posidx);
      DEBUG_INFO.UI_STATS.POS = [pos[0], pos[1], section.geom.pos[2]]; // Remember the info's position.

      section.Destroy();

      DEBUG_INFO.UI_STATS.MESH_BUFFER_IDX = INT_NULL;
      DEBUG_INFO.UI_STATS.IS_ON = false;
      return;
   }


   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui stats timers panel', options:SECTION.VERTICAL, pad:[10, 14], pos:DEBUG_INFO.UI_STATS.POS, dim:[0,0], col:TRANSPARENCY(GREY[1], 1.8), is_debug_mesh:true}));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui stats timers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-Stats section');


   const fontsize = 8;
   const texture_id = TEXTURES.MTSDF_CONSOLAS_1024;
   const fontsizedynamic = 9;
   let pad1 = [0, 1];
   let dt_pad = [4, 0];
   const g_ms = 0; // Overide time interval for all 
   let ms = 500;
   const align = ALIGN.HORIZONTAL;


   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   const multi_text_properties = {
      is_root:0x0,
      text:'', 
      align:align, 
      pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
      font_size:fontsizedynamic, 
      pad:[8, 5],
      col:WHITE, 
      texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
      variant_idx:_,
      is_debug_mesh:false,
   };


   {
      ms = (g_ms) ? g_ms : 500;
      multi_text_properties.text = 'Meshes:';
      const i1 = Create_widget_multi_text(multi_text_properties);
      section.AddItem(i1);
      
      i1.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      i1.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_buffer_get_count, _, _, _); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = i1.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      
      i1.CreateNewText('Active VB:', fontsize, GREY[7], dt_pad, .9);
      i1.CreateNewText('0000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      i1.SetDynamicText(`ms${ms} Renderloop 1secReset`, ms, Vertex_buffer_get_Active_count, _, _, generic_time_interval)
   }

   
   { // Listen Events Buffer
      ms = (g_ms) ? g_ms : 500;
      
      // Create info for Hover listeners
      multi_text_properties.text = 'Listeners - Hover:';
      const i2 = Create_widget_multi_text(multi_text_properties);
      section.AddItem(i2);

      i2.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Listeners_hover_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

      i2.CreateNewText('Click:', fontsize, GREY[7], dt_pad, .9);
      i2.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Listeners_click_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

   }


   { // Mesh Per Vertex Buffer
      ms = (g_ms) ? g_ms : 500;
      multi_text_properties.text = 'Meshes Per VB:';
      const i1 = Create_widget_multi_text(multi_text_properties);
      i1.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      i1.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_per_vb_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      section.AddItem(i1);

      // TODO: Unfortunately we create this once, so any new vb creation is not acccounted. It will work when the updates are through Notifications.
      // const count = Mesh_per_vb_get_count();
      // for(let i=0; i < count; i++){

      //    // Create info for Hover listeners
      //    const i2 = Create_widget_multi_text(_, `   Vb:${i}`, align, [0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], fontsize, GREY[7], .5, pad1);
      //    section.AddItem(i2);

      //    i2.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      //    i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_per_vb_get_mesh_count, i, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      // }

   }


   { // Widget Roots Buffer
      ms = (g_ms) ? g_ms : 500;
      multi_text_properties.text = 'Widget Roots Buffer:';
      const i1 = Create_widget_multi_text(multi_text_properties);
      i1.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      i1.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Root_group_view_buffer_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      section.AddItem(i1);

   }


   { // View Buffer
      ms = (g_ms) ? g_ms : 500;
      multi_text_properties.text = 'View Buffer:';
      const i1 = Create_widget_multi_text(multi_text_properties);
      i1.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
      i1.SetDynamicText(`ms${ms} Stats MeshCount`, ms, View_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      section.AddItem(i1);

   }


   { // Applications All Buffers Struct
      ms = (g_ms) ? g_ms : 500;
      { // Generic Buffers
         multi_text_properties.text = 'Generic - ';
         const i2 = Create_widget_multi_text(multi_text_properties);
         i2.CreateNewText('BufferCount:', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('00000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Get_debug_info_structs_generic_buffer_get_num_buffers, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         i2.CreateNewText('TotalElemsCount:', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('00000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Get_debug_info_structs_generic_buffer_get_elems_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         section.AddItem(i2);
      }
      { // INT16 Buffers
         multi_text_properties.text = 'INT16 - ';
         const i2 = Create_widget_multi_text(multi_text_properties);

         i2.CreateNewText('BufferCount', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('00000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Get_debug_info_structs_int16_buffer_get_num_buffers, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         section.AddItem(i2);

      }
      { // INT8 Buffers
         multi_text_properties.text = 'INT8 - ';
         const i2 = Create_widget_multi_text(multi_text_properties);

         i2.CreateNewText('BufferCount', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('00000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Get_debug_info_structs_int8_buffer_get_num_buffers, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         section.AddItem(i2);

      }
   }


   { // String Buffers
      ms = (g_ms) ? g_ms : 500;
      { // Generic Buffers
         multi_text_properties.text = 'String Buffer:';
         const i2 = Create_widget_multi_text(multi_text_properties);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Str_buffer_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         i2.CreateNewText('Size', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Str_buffer_get_size, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
         section.AddItem(i2);

      }
      { // Mesh Names Buffers
         multi_text_properties.text = 'Mesh Names:';
         const i2 = Create_widget_multi_text(multi_text_properties);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Str_buffer_mesh_names_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         i2.CreateNewText('Size', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Str_buffer_mesh_names_get_size, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
         section.AddItem(i2);

      }

   }


   { // Root Attributes Buffers
      ms = (g_ms) ? g_ms : 500;
      { // WPOS Buffers
         multi_text_properties.text = 'Root Attrib Buffers - WPOS:';
         const i2 = Create_widget_multi_text(multi_text_properties);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_unif_wpos_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         i2.CreateNewText('Size', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_unif_wpos_get_size, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
         section.AddItem(i2);

      }
      { // COL Buffers
         multi_text_properties.text = 'COL:';
         const i2 = Create_widget_multi_text(multi_text_properties);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_unif_col_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         i2.CreateNewText('Size', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Mesh_unif_col_get_size, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
         section.AddItem(i2);

      }

   }


   { // Render Queue Buffers
      ms = (g_ms) ? g_ms : 500;
      { // All Buffers
         multi_text_properties.text = 'Renderqueue Buffers - All:';
         const i2 = Create_widget_multi_text(multi_text_properties);
         i2.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Renderqueue_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         i2.CreateNewText('Size', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Renderqueue_get_size, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
         i2.CreateNewText('Active:', fontsize, GREY[7], dt_pad, .9);
         i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Renderqueue_active_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
         section.AddItem(i2);

      }
      { // Active Buffers
         // const i2 = Create_widget_multi_text(_, 'Active:', align, [0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], fontsize, GREY[7], .5, TEXTURES.MTSDF_CONSOLAS_1024, _, _);
         // i2.CreateNewText('0000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         // i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Renderqueue_active_get_count, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

         // // i2.CreateNewText('Size', fontsizedynamic, GREY[7], dt_pad, .9);
         // // i2.CreateNewText('000000', fontsizedynamic, YELLOW[9], dt_pad, .9);
         // // i2.SetDynamicText(`ms${ms} Stats MeshCount`, ms, Renderqueue_get_size, _, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
         // section.AddItem(i2);

      }

   }






   // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

   section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)


   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);


   Root_group_set_render_queue_flags(section.root_bufferidx, RENDER_QUEUE_FLAGS.SKIP_PRIORITY);


   DEBUG_INFO.UI_STATS.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_STATS.IS_ON = true;

   // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, section);

}

















/************************************************************************************************************************************************/
// Performance timers
/************************************************************************************************************************************************/

export function Debug_info_ui_performance_set_initial_position_screen_right() {

   DEBUG_INFO.UI_TIMERS.POS[0] = VIEWPORT.RIGHT;
}

function Debug_info_create_ui_performance_timers() {


   if (DEBUG_INFO.UI_TIMERS.IS_ON) {

      const section = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_TIMERS.MESH_BUFFER_IDX);

      const pos = Mesh_unif_get_vb_root_wpos(section.root_posidx); ''
      DEBUG_INFO.UI_TIMERS.POS = [pos[0], pos[1], section.geom.pos[2]]; // Remember the info's position.
      section.Destroy();

      DEBUG_INFO.UI_TIMERS.MESH_BUFFER_IDX = INT_NULL;
      DEBUG_INFO.UI_TIMERS.IS_ON = false;
      return;
   }

   const zpos = DEBUG_INFO.UI_TIMERS.POS[2];
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, zpos], [0, 0], TRANSPARENCY(GREY[1], .8), 'ui performance timers panel', [18, 14, 2]);
   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui performance timers panel', options:SECTION.VERTICAL, pad:[10, 10], pos:[0, 0, zpos], dim:[0,0], col:TRANSPARENCY(GREY[1], 1.8), is_debug_mesh:true}));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui performance timers panel', pad:[10, 10], pos:[x, y, zpos], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-PerformanceTimers section');


   const fontsize = 7;
   const fontsizedynamic = 9;
   let pad1 = [0, 1];
   let pad2 = [4, 0];
   const g_ms = 0;
   let ms = 500;
   const align = ALIGN.HORIZONTAL;

   //TODO: Name all the timers correctly

   // Use custom interval for all debug ui for efficiency
   let generic_time_interval = INT_NULL;

   { // FPS average 1 second
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'Render:avg:', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Render:avg:', 
         align:align, 
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.GameLoop, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.GameLoop);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.GameLoop, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.GameLoop);
      timer.CreateNewText('ms:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop worst`, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.GameLoop, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.GameLoop);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Renderloop worst`, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.GameLoop, timeridx], _, generic_time_interval)

   }
   { // All Timers Update timer
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'Timers:avg:', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Timers:avg:', 
         align:align, 
         pad:pad1, 
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Timers avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.AllTimersUpdate, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.AllTimersUpdate);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Timers 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.AllTimersUpdate, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.AllTimersUpdate);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Timers worst`, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.AllTimersUpdate, timeridx], _, generic_time_interval)

   }
   { // Gl_draw timer.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'GlDraw:avg', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'GlDraw:avg:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} GlDraw avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.GlDraw, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.GlDraw);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} GlDraw 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.GlDraw, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.GlDraw);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} GlDraw worst`, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.GlDraw, timeridx], _, generic_time_interval)

   }
   { // Event Listener.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'Events:avg', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Events:avg:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Events avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.EventListener, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.EventListener);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Events 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.EventListener, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.EventListener);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Events worst`, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.EventListener, timeridx], _, generic_time_interval)

   }
   { // Hover Listener.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'Hover:avg', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Hover:avg:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.HoverListener, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.HoverListener);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.HoverListener, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.HoverListener);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover worst `, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.HoverListener, timeridx], _, generic_time_interval)

   }
   { // AddToGfxRect.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'AddToGfxRect', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'AddToGfxRect:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.AddToGfxRect, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.AddToGfxRect);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.AddToGfxRect, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.AddToGfxRect);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover worst `, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.AddToGfxRect, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.AddToGfxRect);
      timer.CreateNewText('ms:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover worst `, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.AddToGfxRect, timeridx], _, generic_time_interval)

   }
   { // AddToGfxText.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'AddToGfxText', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'AddToGfxText:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.AddToGfxText, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.AddToGfxText);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.AddToGfxText, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.AddToGfxText);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover worst `, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.AddToGfxText, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.AddToGfxText);
      timer.CreateNewText('ms:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover worst `, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.AddToGfxText, timeridx], _, generic_time_interval)

   }
   { // Animations.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'Animations', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Animations:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Animations avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.Animations, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.Animations);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Animations 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.Animations, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.Animations);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Animations worst `, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.Animations, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.Animations);
      timer.CreateNewText('ms:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Animations worst `, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.Animations, timeridx], _, generic_time_interval)

   }
   { // Particles.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'Particles', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'Particles:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Particles avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.Particles, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.Particles);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Particles 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.Particles, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.Particles);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Particles worst `, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.Particles, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.Particles);
      timer.CreateNewText('ms:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Particles worst `, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.Particles, timeridx], _, generic_time_interval)

   }
   { // MiscTest2.
      ms = (g_ms) ? g_ms : 1000;
      // const timer = Create_widget_multi_text(_, 'ConstructListeners', align, [0, 0, zpos + 1], fontsize, GREY[7], .5, pad1);
      const timer = Create_widget_multi_text({
         is_root:0x0,
         text:'ConstructListeners:', 
         align:align,  
         pad:pad1,
         pos:[0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], 
         font_size:fontsizedynamic, 
         col:GREY[7], 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         is_debug_mesh:false,
      });
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover avg`, ms, PerformanceTimersGetFps, [PERFORMANCE_TIMERS_IDXS.MiscTest2, 0], _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      let timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.BASE, PERFORMANCE_TIMERS_IDXS.MiscTest2);
      timer.CreateNewText('avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsizedynamic, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover 1secReset`, ms, Performance_timers_get_avg_1sec_reset, [PERFORMANCE_TIMERS_IDXS.MiscTest2, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.MiscTest2);
      timer.CreateNewText('worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover worst `, ms, PerformanceTimersGetWorstFps, [PERFORMANCE_TIMERS_IDXS.MiscTest2, timeridx], _, generic_time_interval)

      timeridx = Performance_timer_create_secondary_timer(PERFORMANCE_TIMER.DETAILED, PERFORMANCE_TIMERS_IDXS.MiscTest2);
      timer.CreateNewText('ms:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOW[9], pad2, .9);
      timer.SetDynamicText(`ms${ms} Hover worst `, ms, PerformanceTimersGetMilisec, [PERFORMANCE_TIMERS_IDXS.MiscTest2, timeridx], _, generic_time_interval)

   }
   {
      // { // Batch Buffer
      //    ms = (g_ms) ? g_ms : 1000;
      //    const timer = Create_widget_multi_text(_, 'Batch: | avg:', align, [0, 0, zpos+1], fontsize, GREY[7], .5, pad1);
      //    section.AddItem(timer);
      //    timer.CreateNewText('00000000', fontsize, PURPLER[7], pad2, .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_batch_update.timer, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

      //    timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_avg_1sec_reset, _pt_batch_update, _, generic_time_interval)

      //    timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_batch_update.timer, _, generic_time_interval)

      //    timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_batch_update.timer, _, generic_time_interval)

      // }
      // { // Batch2 Buffer
      //    ms = (g_ms) ? g_ms : 1000;
      //    const timer = Create_widget_multi_text(_, 'Batch2: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      //    section.AddItem(timer);
      //    timer.CreateNewText('00000000', fontsize, PURPLER[7], pad2, .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_batch2_update.timer, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

      //    timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_avg_1sec_reset, _pt_batch2_update, _, generic_time_interval)

      //    timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_batch2_update.timer, _, generic_time_interval)

      //    timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_batch2_update.timer, _, generic_time_interval)

      // }
      // { // Framebuffer Rendering.
      //    ms = (g_ms) ? g_ms : 1000;
      //    const timer = Create_widget_multi_text(_, 'Framebuffer Rendering: | avg:', align, [0, 0, zpos+1], fontsize, GREY[7], .5, pad1);
      //    section.AddItem(timer);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_framebuffer_rendering.timer, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

      //    timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_ms_1sec_reset, _pt_framebuffer_rendering, _, generic_time_interval)

      //    timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_framebuffer_rendering.timer, _, generic_time_interval)

      //    timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_framebuffer_rendering.timer, _, generic_time_interval)

      // }
      // { // Mesh info tip.
      //    ms = (g_ms) ? g_ms : 1000;
      //    const timer = Create_widget_multi_text(_, 'MeshInfo: | avg:', align, [0, 0, zpos+1], fontsize, GREY[7], .5, pad1);
      //    section.AddItem(timer);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`ms${ms} MeshInfo avg`, ms, PerformanceTimersGetFps, _pt_mesh_info_tip.timer, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

      //    timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`ms${ms} MeshInfo 1secReset`, ms, Performance_timers_get_ms_1sec_reset, _pt_mesh_info_tip, _, generic_time_interval)

      //    timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`ms${ms} MeshInfo best`, ms, PerformanceTimersGetBestFps, _pt_mesh_info_tip.timer, _, generic_time_interval)

      //    timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      //    timer.SetDynamicText(`ms${ms} MeshInfo worst`, ms, PerformanceTimersGetWorstFps, _pt_mesh_info_tip.timer, _, generic_time_interval)

      // }
      // { // Scene Update timer
      //    ms = (g_ms) ? g_ms : 1000;
      //    const timer = Create_widget_multi_text(_, 'Scene: | avg:', align, [0, 0, zpos+1], fontsize, GREY[7], .5, pad1);
      //    section.AddItem(timer);
      //    timer.CreateNewText('0000000', fontsize, BLUEL[7], pad2, .9);
      //    timer.SetDynamicText(`ms${ms} Scene avg`, ms, PerformanceTimersGetFps, _pt_scene_update.timer, _, generic_time_interval); // idx param is for use in creating separate timer for each widget dynamic text.

      //    timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, BLUEL[7], [0, 0], .9);
      //    timer.SetDynamicText(`ms${ms} Scene 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_scene_update, _, generic_time_interval)

      //    timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, BLUEL[7], [0, 0], .9);
      //    timer.SetDynamicText(`ms${ms} Scene best`, ms, PerformanceTimersGetBestFps, _pt_scene_update.timer, _, generic_time_interval)

      //    timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      //    timer.CreateNewText('0000000', fontsize, BLUEL[7], [0, 0], .9);
      //    timer.SetDynamicText(`ms${ms} Scene worst`, ms, PerformanceTimersGetWorstFps, _pt_scene_update.timer, _, generic_time_interval)

      // }
   }

   // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

   section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();

   const w = section.GetMaxWidth();
   Mesh_unif_set_vb_root_wpos(section.root_posidx, VIEWPORT.RIGHT - w * 2, 0);

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);


   DEBUG_INFO.UI_TIMERS.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_TIMERS.IS_ON = true;

   // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, section);

}


















/************************************************************************************************************************************************/
// Mouse Info
/************************************************************************************************************************************************/

export function Debug_info_create_ui_mouse(x=0, y=0) {


   if (DEBUG_INFO.UI_MOUSE.IS_ON) {

      const section = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_MOUSE.MESH_BUFFER_IDX);

      Info_listener_remove_event(section.debug_info.evtidx);

      const pos = Mesh_unif_get_vb_root_wpos(section.root_posidx);
      DEBUG_INFO.UI_MOUSE.POS = [pos[0], pos[1], section.geom.pos[2]]; // Remember the info's position.

      section.Destroy();

      DEBUG_INFO.UI_MOUSE.IS_ON = false;
      return;
   }

   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [10, 10], [x, y, DEBUG_INFO.UI_MOUSE.POS[2]], [0, 0], TRANSPARENCY(GREY[1], .8), 'ui mouse info panel');
   // const section = Create_widget_section(Style_section_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, name:'ui mouse info panel', options:SECTION.HORIZONTAL, pad:[10, 10], pos:[x, y, DEBUG_INFO.UI_MOUSE.POS[2]], dim:[0,0], col:TRANSPARENCY(GREY[2], .8), }));
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui mouse info panel', pad:[10, 10], pos:[x, y, DEBUG_INFO.UI_MOUSE.POS[2]], dim:[0,0], col:TRANSPARENCY(GREY[2], transp), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:2,});
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
   // section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   section.align.flags = ALIGN_2.RESIZE_SELF;
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-Mouse section');
   
   
   const fontsize = _font_size;
   
   const infomesh = Create_widget_multi_text({
      is_root:0x0,
      text:'Mouse:', 
      align:ALIGN.HORIZONTAL, 
      pos: [0, 0, DEBUG_INFO.UI_MOUSE.POS[2] + 1], 
      font_size:fontsize, 
      col:WHITE, 
      pad:[0,0], 
      texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
      is_debug_mesh:false,
   });
   infomesh.align.flags = ALIGN_2.HORIZONTAL;
   section.AddItem(infomesh);
   // dynamic_text, fontSize, text_col2, pad = [0, 0], bold = .5, align = ALIGN.HORIZONTAL, align_NEW=ALIGN_2.HORIZONTAL
   infomesh.CreateNewText('pos[-0000, -0000]', fontsize, GREEN[7], [0, 0], .9, _, ALIGN_2.VERTICAL,);
   infomesh.CreateNewText('area[-0000, -0000]', fontsize, GREEN[7], [0, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('222',        fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('0',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.VERTICAL);
   // infomesh.CreateNewText('0',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('0',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('0',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('0',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.VERTICAL);
   // infomesh.CreateNewText('0',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.VERTICAL);
   // infomesh.CreateNewText('0',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.VERTICAL);
   // // infomesh.CreateNewText('555000000000000000000',       fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('3333',      fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.VERTICAL);
   // infomesh.CreateNewText('00',        fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('555',       fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('6',         fontsize, GREEN[7], [10, 0], .9, _, ALIGN_2.HORIZONTAL);
   // infomesh.CreateNewText('5', fontsize, GREEN[7], [8, 0], .9, _, ALIGN_2.VERTICAL);


   section.gfx_pool_request |= GFX_POOL_REQUESTS.SMALLEST; // Assign so the gfx pool requests the smalest buffers
   section.gfx_pool_request &= ~GFX_POOL_REQUESTS.ANY; // Disable the default.
   infomesh.gfx_pool_request |= GFX_POOL_REQUESTS.SMALLEST; // Assign so the gfx pool requests the smalest buffers
   infomesh.gfx_pool_request &= ~GFX_POOL_REQUESTS.ANY; // Disable the default.


      // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;
   // Align_expand(section, section.align.flags,)

   // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

   // section.options |= SECTION.EXPAND | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   // section.Calc_no_gfx_update();

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   DEBUG_INFO.UI_MOUSE.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_MOUSE.IS_ON = true;

   // Create an Info listener to update the mouse position ui text
   section.debug_info.evtidx = Info_listener_create_event(INFO_LISTEN_EVENT_TYPE.MOUSE, Debug_info_update_ui_mouse_pos, null, infomesh);

   return section;
}



function Debug_info_update_ui_mouse_pos(params) {

   const evt_params = params.evt_params;
   const info_data = params.trigger_params.mouse;

   const mp = `pos:[${info_data.pos.x},${info_data.pos.y}]`;
   const mpr = `area:[${info_data.pos.x - info_data.click.up.x}, ${info_data.pos.y - info_data.click.up.y}]`;
   // const mpr = `area:[${info_data.click.drag.x}, ${info_data.click.drag.y}]`;

   const mouse_pos_text = evt_params.children.buffer[0];
   mouse_pos_text.RenderTextFromString(mp)
   const mouse_prev_text = evt_params.children.buffer[1];
   mouse_prev_text.RenderTextFromString(mpr)

}


















/************************************************************************************************************************************************/
// Focused Mesh Info
/************************************************************************************************************************************************/

export function Debug_info_create_ui_focused() {


   if (DEBUG_INFO.UI_FOCUSED.IS_ON) {

      const section = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_FOCUSED.MESH_BUFFER_IDX);

      Info_listener_remove_event(section.debug_info.evtidx);

      const pos = Mesh_unif_get_vb_root_wpos(section.root_posidx);
      DEBUG_INFO.UI_FOCUSED.POS = [pos[0], pos[1], section.geom.pos[2]]; // Remember the info's position.

      section.Destroy();

      DEBUG_INFO.UI_FOCUSED.IS_ON = false;
      return;
   }


   const fontsize = _font_size;

   // const section = Create_widget_section(_, SECTION.HORIZONTAL, [10, 8], [0, 0, DEBUG_INFO.UI_FOCUSED.POS[2]], [0, 0], TRANSPARENCY(GREY[1], .8), 'ui mouse info panel');
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui mouse info panel', pad:[10, 10], pos:[x, y, DEBUG_INFO.UI_FOCUSED.POS[2]], dim:[0,0], col:TRANSPARENCY(GREY[1], .8), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-Focused scrolled section');



   const infomesh = Create_widget_multi_text(_, 'Mouse:', ALIGN.HORIZONTAL, [0, 0, DEBUG_INFO.UI_FOCUSED.POS[2] + 1], fontsize, WHITE, .4, [10, 10], TEXTURES.MTSDF_CONSOLAS_1024, _, _);
   section.AddItem(infomesh);
   infomesh.CreateNewText('pos[-0000, -0000]', fontsize, GREEN[7], [8, 0], .9);
   infomesh.CreateNewText('area[-0000, -0000]', fontsize, GREEN[7], [8, 0], .9);


   section.gfx_pool_request |= GFX_POOL_REQUESTS.SMALLEST; // Assign so the gfx pool requests the smalest buffers
   section.gfx_pool_request &= ~GFX_POOL_REQUESTS.ANY; // Disable the default.
   infomesh.gfx_pool_request |= GFX_POOL_REQUESTS.SMALLEST; // Assign so the gfx pool requests the smalest buffers
   infomesh.gfx_pool_request &= ~GFX_POOL_REQUESTS.ANY; // Disable the default.


   /********************************************************************************************************************************/
   // Create the scroller

   // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.options = SECTION.HORIZONTAL | SECTION.INHERIT;
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);


   View_build_group_from_root_mesh(section);

   const clip_top = section.GetPosY();
   const clip_bottom = clip_top + section.geom.dim[1] * 2;
   Clipy_from_group(section.group_bufferidxs[0], clip_top, clip_bottom);

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   View_set_view_vb_start(section.group_bufferidxs, section.gfx.vb.start);

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   DEBUG_INFO.UI_FOCUSED.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_FOCUSED.IS_ON = true;

   // Create an Info listener to update the mouse position ui text
   section.debug_info.evtidx = Info_listener_create_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, Debug_info_update_ui_focused, null, scroller);

   return section;

}


let u = 0;
// function Debug_info_update_ui_focused(params) {

//    // const scroller = params.evt_params;
//    const scrolled = params.evt_params;

//    // We are destoyng a mesh, so the boundary decrements with every destroy. So we always destroy the last child in the children's buffer
//    let i = scrolled.children.boundary;
//    while(i >= 0){

//       const item = scrolled.children.buffer[i];
//       // console.log('DESTROY', item.GetName())
//       item.Destroy();
//       i = scrolled.children.boundary;
//    }

//    // const focused = params.trigger_params.focused.evt_params.target_mesh;
//    const focused = STATE.mesh.focused;
//    const zpos = focused.geom.pos[2];

//    /**
//          this.temp_align = 0x0;

//          this.geom = {
//             this.pos = [0, 0, 0];
//             this.dim = [0, 0];
//             this.scale = [0, 0];
//             this.defPos = [0, 0, 0];
//             this.defDim = [0, 0];
//             this.defScale = [0, 0];
//             this.num_faces = num_faces;
//             this.type |= MESH_TYPE.GEOMETRY2D;}
//          }

//          this.mat = {
//             this.col = [0, 0, 0, 1];
//             math.CopyArr4(this.col, col);
//             this.defCol = [0, 0, 0, 0];
//             this.type = MESH_TYPE.MATERIAL;
//             this.style = [0, 0, 0];
//             this.uv = [0, 1, 0, 1];
//             this.metrics_idx = INT_NULL;
//             this.texidx = INT_NULL;
//          };

//         this.sid = {
//             shad: SID.SHAD.INDEXED | (this.geom.sid.shad | this.mat.sid.shad),
//             attr: (this.geom.sid.attr | this.mat.sid.attr),
//             inst: (this.geom.sid.inst | this.mat.sid.inst),
//             unif: this.mat.sid.unif,
//             pass: (this.geom.sid.pass | this.mat.sid.pass | SID.PASS.COL4),
//             gfx_group: GFX_GROUPS.DEFAULT.MASK, // To denote if the curent mesh is used for debug, so it uses specific gfx buffers for debug ui rendering.
//         };


//         this.gfx_ctx_flags = 0x0;
//         this.gfx_ctx_parent = INT_NULL;

//         this.uniforms = [];

//         this.type = MESH_TYPE.MESH;
//         this.state = { mask: MESH_STATE.ACTIVE }; // Unfortunately js cannot create a pointer for integers, so we have to wrap the mask to a class;
//         this.gfx_pool_request = GFX_POOL_REQUESTS.ANY;


//         this.gfx = null;
//         this.is_gfx_inserted = false;
//         this.isFramebufferRendered = INT_NULL;

//         this.idx = INT_NULL;
//         this.sceneidx = STATE.scene.active_idx;
//         this.fbidx = INT_NULL; // This should render the current mesh to the default gl framebuffer. 
//         this.batch_fnidx = INT_NULL;
//         this.mesh_bufferidx = INT_NULL;
//         this.root_bufferidx = INT_NULL;
//         this.per_vb_bufferidx = INT_NULL;
//         this.batch_buffer_vbidx = INT_NULL;
//         this.batchidx = INT_NULL;
//         this.group_bufferidxs = [INT_NULL, INT_NULL, INT_NULL];
//         this.nameidx = INT_NULL;

//         this.parent = null;

//         this.listeners = null;
//         this.parent_event_idx = INT_NULL;

//         this.event_clbks = null;
//         this.children = New_generic_buffer(_, 'Mesh children');
//         this.timeIntervalsIdxBuffer = New_int8_buffer(INTERVALS.SIZE, 'NEW time_intervals');

//         this.rel_comp = null;
//         this.root_posidx = INT_NULL;


//         this.hover_margin = [0, 0];
//         this.styles = Styles_create();
//         this.clamp = [0, [0, 10000, DEFAULT_CLAMP_THRESHOLD]];


//         this.menu_options_idx = INT_NULL;
//         this.menu_options = {
//             Clbk: null,
//             idx: INT_NULL,
//         };

//         this.debug_info = {
//             type: 0x0, // Bit mask for distinguish the infoListener listening to that event type
//             data: null, // Some storage for any kind of data
//             evtidx: INT_NULL, // Stores the index of the events in the Info_Listeners buffer.
//         };
//     */

//    // console.log(SID.GetTypeToString(scroller.sid));
//    // console.log(focused.GetName());

//    {
//       const text_info = `Name:dim:${focused.GetName()}`
//       const info_mesh = Create_widget_label(_, text_info, _, [0,0,1], 9, PURPLEB[9], _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
//       scrolled.AddItem(info_mesh);
//       info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       info_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
//    }
//    // {
//    //    const text_info = `dim:[${focused.geom.dim[0]},${focused.geom.dim[1]}]`
//    //    const info_mesh = Create_widget_label(_, text_info, _, [0,0,1], 9, PURPLEB[9], _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
//    //    scrolled.AddItem(info_mesh);
//    //    info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       // info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    //    info_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
//    // }
//    // {
//    //    const text_info = `pos:[${focused.geom.pos[0]},${focused.geom.pos[1]},${focused.geom.pos[2]}]`
//    //    const info_mesh = Create_widget_label(_, text_info, _, [0,0,1], 9, PURPLEB[9], _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
//    //    scrolled.AddItem(info_mesh);
//    //    info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       // info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    //    info_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
//    // }

//    {
//       // const text_info = `Relative pos:[${focused.GetPosX().toFixed(1)},${focused.GetPosY().toFixed(1)}]`
//       const text_info = `Relative pos:[${Floor(focused.GetPosX())},${Floor(focused.GetPosY())}]`
//       const info_mesh = Create_widget_label(_, text_info, _, [0,0,1], 9, PURPLEB[9], _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
//       scrolled.AddItem(info_mesh);
//       info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       info_mesh.GenGfxCtx();
//    }
//    {
//       const info_mesh = Ui_focused_create_info_geom(focused, zpos+1);
//       scrolled.AddItem(info_mesh);
//       info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       info_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
//    }
//    {
//       const info_mesh = Ui_focused_create_info_mat(focused, zpos+1);
//       scrolled.AddItem(info_mesh);
//       info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       info_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
//    }
//    {
//       const info_mesh = Ui_focused_create_info_gfx(focused, zpos+1);
//       scrolled.AddItem(info_mesh);
//       info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       info_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
//    }
//    {
//       const info_mesh =Ui_focused_create_info_sid(focused, zpos+1);
//       scrolled.AddItem(info_mesh);
//       info_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled.mesh_bufferidx);
//       info_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       info_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
//    }


//    Root_group_reset_gfxs(scroller.root_bufferidx);

//    // scroller.ScrollerAlignWithItemsRecalc();


//    // info_mesh.AddToWidgetRootBuffer(scrolled.root_bufferidx)



//    // CLIP FROM WIDGET TREE
//    const clip_top = scroller.GetPosY();
//    const clip_bottom = clip_top + scroller.geom.dim[1] * 2;
//    Clipy_from_tree_recursive(scroller.scrolled_section, clip_top, clip_bottom);
//    Root_group_rerender(scroller.root_bufferidx);

// }



// function Ui_focused_create_info_sid(mesh, zpos){

//    // this.geom = {
//    //    this.pos = [0, 0, 0];
//    //    this.dim = [0, 0];
//    //    this.scale = [0, 0];
//    //    this.defPos = [0, 0, 0];
//    //    this.defDim = [0, 0];
//    //    this.defScale = [0, 0];
//    //    this.num_faces = num_faces;
//    //    this.type |= MESH_TYPE.GEOMETRY2D;}
//    // }

//    const fontsize = 8;
//    const fontsizedynamic = 9;
//    const extra_pad1 = [18, 4];
//    const extra_pad2 = [0, 4];
//    const align = ALIGN.VERTICAL;

//    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0,0,zpos++], [0,0], GREY[1], 'Ui Geometry Info Focused', _, _, _, MESH_TYPE.DEBUG_MESH);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

//    const text_info = SID.GetTypeToString(mesh.sid)
//    const info_text = Create_widget_multi_text(_, 'Attributes', align, [0, 0, zpos], fontsize, GREEN[9], .5, extra_pad1, _, MESH_TYPE.DEBUG_MESH);

//    info_text.CreateNewText(`shad:${text_info[0]}`, fontsizedynamic, WHITE, extra_pad2, .9);
//    info_text.CreateNewText(`attr:${text_info[1]}`, fontsizedynamic, WHITE, extra_pad2, .9);
//    info_text.CreateNewText(`inst:${text_info[3]}`, fontsizedynamic, WHITE, extra_pad2, .9);
//    info_text.CreateNewText(`unif:${text_info[2]}`, fontsizedynamic, WHITE, extra_pad2, .9);
//    info_text.CreateNewText(`pass:${text_info[4]}`, fontsizedynamic, WHITE, extra_pad2, .9);

//    section.AddItem(info_text);
//    return section;
// }



// function Ui_focused_create_info_geom(mesh, zpos){

//    // this.geom = {
//    //    this.pos = [0, 0, 0];
//    //    this.dim = [0, 0];
//    //    this.scale = [0, 0];
//    //    this.defPos = [0, 0, 0];
//    //    this.defDim = [0, 0];
//    //    this.defScale = [0, 0];
//    //    this.num_faces = num_faces;
//    //    this.type |= MESH_TYPE.GEOMETRY2D;}
//    // }

//    const fontsize = 8;
//    const fontsizedynamic = 9;
//    const extra_pad1 = [18, 4];
//    const extra_pad2 = [0, 4];
//    const align = ALIGN.VERTICAL;

//    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0,0,zpos++], [0,0], ORANGEL[2], 'Ui Geometry Info Focused', _, _, _, MESH_TYPE.DEBUG_MESH);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

//    const info_text = Create_widget_multi_text(_, `pos:[${mesh.geom.pos[0]}, ${mesh.geom.pos[1]}, ${mesh.geom.pos[2]}]`, align, [0, 0, zpos], fontsize, WHITE, .5, extra_pad1, _, MESH_TYPE.DEBUG_MESH);

//    info_text.CreateNewText(`dim:[${mesh.geom.dim[0]}, ${mesh.geom.dim[1]}]`, fontsizedynamic, YELLOW[9], extra_pad2, .9);
//    info_text.CreateNewText(`num_faces:${mesh.geom.num_faces}`, fontsizedynamic, YELLOW[9], extra_pad2, .9);

//    section.AddItem(info_text);
//    return section;
// }



// function Ui_focused_create_info_mat(mesh, zpos){

//    //    this.col = [0, 0, 0, 1];
//    //    math.CopyArr4(this.col, col);
//    //    this.defCol = [0, 0, 0, 0];
//    //    this.type = MESH_TYPE.MATERIAL;
//    //    this.style = [0, 0, 0];
//    //    this.uv = [0, 1, 0, 1];
//    //    this.metrics_idx = INT_NULL;
//    //    this.texidx = INT_NULL;
//    // };

//    const fontsize = 8;
//    const fontsizedynamic = 9;
//    const extra_pad1 = [18, 4];
//    const extra_pad2 = [0, 4];
//    const align = ALIGN.VERTICAL;

//    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0,0,zpos++], [0,0], ORANGEL[2], 'Ui Geometry Info Focused', _, _, _, MESH_TYPE.DEBUG_MESH);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

//    const info_text = Create_widget_multi_text(_, `col:[${mesh.mat.col[0]}, ${mesh.mat.col[1]}, ${mesh.mat.col[2]}, ${mesh.mat.col[3]}]`, align, [0, 0, zpos], fontsize, WHITE, .5, extra_pad1, _, MESH_TYPE.DEBUG_MESH);

//    info_text.CreateNewText(`style:[${mesh.mat.style.rcorners}, ${mesh.mat.style.feather}, ${mesh.mat.style.border}]`, fontsizedynamic, YELLOW[9], extra_pad2, .9);
//    info_text.CreateNewText(`uv:[${mesh.mat.uv[0]}, ${mesh.mat.uv[1]}, ${mesh.mat.uv[2]}, ${mesh.mat.uv[3]}]`, fontsizedynamic, YELLOW[9], extra_pad2, .9);
//    info_text.CreateNewText(`metrics_idx:${mesh.mat.metrics_idx}`, fontsizedynamic, YELLOW[9], extra_pad2, .9);
//    info_text.CreateNewText(`texidx:${mesh.mat.texture_file_id}`, fontsizedynamic, YELLOW[9], extra_pad2, .9);

//    section.AddItem(info_text);
//    return section;
// }



// function Ui_focused_create_info_gfx(mesh, zpos){
//    /**
//       sid
//       sceneidx
//       isPrivate
//       num_faces
//       vertsPerRect
//       attribsPerVertex
//       meshIdx
//       vao

//       prog = {
//          idx
//          progibidx
//          attribsidx
//       };

//       vb = {

//          groupidx
//          idxs
//          starts
//          counts

//          which_vb: {
//             col_buf
//             wpos_buf
//             generic_attr1_buf
//             dim_buf
//             tex_buf
//          },
//          is_per_vertex
//       };

//       ib = {
//          idx
//          count
//       };

//       tb = {
//          id
//          idx
//       };
//  */


//    const fontsize = 8;
//    const fontsizedynamic = 9;
//    const extra_pad1 = [18, 4];
//    const extra_pad2 = [0, 4];
//    const align = ALIGN.VERTICAL;

//    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0,0,zpos++], [0,0], ORANGEL[2], 'Ui Gfx Info Focused', _, _, _ , MESH_TYPE.DEBUG_MESH);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

//    const info_text = Create_widget_multi_text(_, `progidx:${mesh.gfx.prog.idx}`, align, [0, 0, zpos], fontsize, WHITE, .5, extra_pad1, _, MESH_TYPE.DEBUG_MESH);

//    info_text.CreateNewText(`attribsidx:${mesh.gfx.prog.attribsidx}`, fontsizedynamic, YELLOW[9], extra_pad2, .9);

//    info_text.CreateNewText(`vbgroupidx:${mesh.gfx.vb.groupidx}`, fontsize, WHITE, extra_pad1, .9);

//    let vbidxs = '';
//    for(let i=0; i <= mesh.gfx.vb.idxs.boundary; i++){
//       vbidxs += mesh.gfx.vb.idxs.buffer[i] + ',';
//    }
//    info_text.CreateNewText(`vbidxs:[${vbidxs}]`, fontsize, WHITE, extra_pad2, .9);

//    let starts = '';
//    for(let i=0; i <= mesh.gfx.vb.idxs.boundary; i++){
//       starts += mesh.gfx.vb.starts.buffer[i] + ',';
//    }
//    info_text.CreateNewText(`starts:[${starts}]`, fontsize, WHITE, extra_pad2, .9);

//    let counts = '';
//    for(let i=0; i <= mesh.gfx.vb.idxs.boundary; i++){
//       counts += mesh.gfx.vb.counts.buffer[i] + ',';
//    }
//    info_text.CreateNewText(`counts:[${counts}]`, fontsize, WHITE, extra_pad2, .9);

//    info_text.CreateNewText(`ibidx:${mesh.gfx.ib.idx}`, fontsize, WHITE, extra_pad1, .9);

//    info_text.CreateNewText(`tbidx:${mesh.gfx.tb.idx}`, fontsize, WHITE, extra_pad1, .9);

//    section.AddItem(info_text);
//    return section;
// }
















/************************************************************************************************************************************************/
// Mesh Info
/************************************************************************************************************************************************/

const temp_btnpad = [10, 3];
function Debug_info_create_mesh_info(params) {

   const sceneidx = params.params;

   // Deactivate/Destroy/Close the DebugMeshInfoUi 
   if (DEBUG_INFO.UI_MESH.IS_ON) {

      const widget_root = Root_group_view_buffer_get_byidx(DEBUG_INFO.UI_MESH.ROOT_IDX);
      const scroller = Mesh_buffer_get_mesh_byidx(widget_root.buffer[0]);

      Info_listener_remove_event(scroller.debug_info.evtidx);
      // Remember the ui's position based on the dropdown which is responsible of setting the position of the scroller widget arround it..
      DEBUG_INFO.UI_MESH.POS = [
         // scroller.geom.pos[0] + scroller.margin[0],
         scroller.geom.pos[0] + scroller.StylesGetPad(STYLES.AXIS.X),
         scroller.geom.pos[1] - scroller.geom.dim[1],
         scroller.geom.pos[2],
      ];

      // Scoller_component_destroy(ui_widget.scroller_comp);
      // View_remove_view(scroller.group_bufferidxs);
      scroller.Destroy();


      DEBUG_INFO.UI_MESH.ROOT_IDX = INT_NULL;
      DEBUG_INFO.UI_MESH.IS_ON = false;

      return;
   }


   const tr = 1.45;

   // const section = Create_widget_section(_, SECTION.VERTICAL, _, DEBUG_INFO.UI_MESH.POS, [0, 0], TRANSPARENCY(REDL[7], .7), 'MeshInfo DebugUi');
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'MeshInfo DebugUi', pad:[10, 10], pos:DEBUG_INFO.UI_MESH.POS, dim:[0,0], col:TRANSPARENCY(GREY[1], .8), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER, FAKE_LISTEN_EVENT);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);

   // const dp = Create_widget_dropdown(_, `InfoUi Mesh DP`, DEBUG_INFO.UI_MESH.POS, GREY[1], TRANSPARENCY(GREY[1], tr), WHITE, temp_btnpad);
   const dp = Create_widget_dropdown(_, `InfoUi Mesh DP`, [0, 0, DEBUG_INFO.UI_MESH.POS[2]], GREY[1], TRANSPARENCY(GREY[1], tr), WHITE, temp_btnpad);
   
   // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   dp.StateEnable(MESH_STATE.ACTIVE);
   dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   Dropdown_roots_set_root(dp, dp);
   dp.SetTypeDebug();

   // dp.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;
   // dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   // dp.menu.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL; // Set menu to expand to the dropdown's width

   section.AddItem(dp);


   // Create scroller for the ui-mesh info widget
   const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [0, 300], GREY[1], [4, 4]);
   scroller.StateEnable(MESH_STATE.ACTIVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   // scroller.scrolled_section.options = SECTION.VERTICAL | SECTION.EXPAND | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   scroller.scrolled_section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   scroller.SetTypeDebug();


   // Create the dropdown structure representing all the applications's meshes
   const root_meshes_idxs = Root_group_view_buffer_get();
   for (let i = 0; i <= root_meshes_idxs.boundary; i++) {

      if (root_meshes_idxs.buffer[i]) {
         const root = Mesh_buffer_get_mesh_byidx(root_meshes_idxs.buffer[i].buffer[0]);
         Debug_info_mesh_add_meshes_as_tree_struct(root, dp);
      }
   }

   // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, section.mesh_bufferidx, true);
   section.GenGfxCtx();

   // scroller.Calc_no_gfx_update();
   scroller.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
   // scroller.ScrollerAlignWithItemsRecalc();

   scroller.Render();
   Root_group_activate_all_vbs_in_renderqueue(scroller.root_bufferidx);

   scroller.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scroller.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(scroller)
   Construct_listen_events_relations_from_mesh_tree(scroller);

   View_build_group_from_root_mesh(scroller.scrolled_section)


   DEBUG_INFO.UI_MESH.ROOT_IDX = scroller.root_bufferidx;
   DEBUG_INFO.UI_MESH.IS_ON = true;


   // Update at run time.
   // Create a listener to update the 'InfoUi Mesh DP' with any new scene meshes added at run time.
   // Not to be confused with the event listeners system. This is only for the debug widgets displaying info for the application.
   scroller.debug_info.evtidx = Info_listener_create_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_MESH, Debug_info_mesh_update, params, dp);

}



function Debug_info_mesh_add_meshes_as_tree_struct(mesh, parent) {

   // Create a dropdown for the mesh, and then create some info of the mesh as text and add it to the dropdown's menu
   const dp_mesh = Create_widget_dropdown(_, `${mesh.GetName()}`, [0, 0, parent.geom.pos[2] + 1], TRANSPARENCY(GREY[5], .5), TRANSPARENCY(GREY[1], .8), WHITE, temp_btnpad, _, _, _, _, [4, 4]);
   dp_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   dp_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   parent.AddToMenu(dp_mesh);
   dp_mesh.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   dp_mesh.menu.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL; // Set menu to expand to the dropdown's width

   const fontsize = 10;

   // Gather all info to a string buffr
   const meshinfo = Mesh_info_builder(mesh);
   if (mesh.parent) {
      const parentinfo = Mesh_info_builder(mesh.parent);
      meshinfo.push('Parent:');
      for (let i = 0; i < parentinfo.length; i++) {
         meshinfo.push(parentinfo[i]);
      }
   }
   else {
      meshinfo.push('parent:NULL');
   }

   // Create the text widget's from the info string buffer
   for (let i = 0; i < meshinfo.length; i++) {
      const info = Create_widget_text(_, meshinfo[i], [0, 0, parent.geom.pos[2] + 1], 7);
      dp_mesh.AddToMenu(info);
   }

   // Run recursively for any mesh's children
   for (let i = 0; i <= mesh.children.boundary; i++) {
      const child = mesh.children.buffer[i];
      if (child)
         Debug_info_mesh_add_meshes_as_tree_struct(child, dp_mesh);
   }

}



function Debug_info_mesh_update(params) {

   const root_info_dp = params.target_params;
   const added_mesh_gfx = params.trigger_params
   const parent = added_mesh_gfx.parent ? added_mesh_gfx.parent : null;


   /**
    * 1. Find the newly added mesh's parent.
    * 2. Find the parent's info mesh dropdown.
    *    2.1. If no parent, create new dp at the level of the menu of the root_info_dp
    *    2.2. If parent
    *       2.2.1. Create new dropdown of the added mesh.
    * 4. Add the mesh dp to the menu of the found parent dp
    * DONE
    */

   if (!parent) {

      if (!root_info_dp.menu.gfx) { // GFX must exist.

         console.error('Menu is OFF:', root_info_dp.mesh_bufferidx, ' added_mesh_gfx', added_mesh_gfx)
         return;
      }

      const dp_mesh = Create_widget_dropdown(_, ` ${added_mesh_gfx.mesh.GetName()}`, [0, 0, parent.geom.pos[2] + 1], TRANSPARENCY(GREEN[7], .5), GREY[1], WHITE, [8, 3]);
      dp_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      dp_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      root_info_dp.AddToMenu(dp_mesh);
      dp_mesh.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      dp_mesh.menu.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL; // Set menu to expand to the dropdown's width

      const gfx_idxs = [root_info_dp.menu.gfx.prog.idx, root_info_dp.menu.gfx.vb.idx];
      // dp_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      dp_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, dp_mesh.mesh_bufferidx, true);
      dp_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, gfx_idxs);
      root_info_dp.Calc_no_gfx_update();
      dp_mesh.Render();
      Root_group_activate_all_vbs_in_renderqueue(dp_mesh.root_bufferidx);
      dp_mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp_mesh.gfx.vb.groupidx);

   }
   else { // Parent must exist. Catch the error if
      console.error('---- PARENT EXISTS, IMPLEMENT ME!');
      alert('SEE CONSOLE ERROR')
   }
}



// Helper to build mesh info
function Mesh_info_builder(mesh) {
   return [
      `meshidx:${mesh.mesh_bufferidx} | idx:${mesh.idx}`,
      `pos:${mesh.geom.pos} | dim:${mesh.geom.dim} | alpha:${mesh.mat.col[3]}`,
      // 'gfx:', `prog:${mesh.gfx.prog.idx} | vb:prog:${mesh.gfx.vb.idx}`
   ];
}


















/************************************************************************************************************************************************/
// Batch Buffer
/************************************************************************************************************************************************/

function Debug_info_create_batch_info(params) {

   const sceneidx = params.params; // UNNECESSARY: np params needed. That applies to all DebugInfoUi Create functions

   // Deactivate/Destroy/Close the DebugMeshInfoUi 
   if (DEBUG_INFO.UI_BATCH.IS_ON) {

      const section = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_BATCH.MESH_BUFFER_IDX);
      // const meshes = Scenes_get_root_meshes(sceneidx);
      // const section = meshes.buffer[DEBUG_INFO.UI_BATCH.IDX];

      // Info_listener_remove_event(section.debug_info.evtidx);
      // Remember the ui's position
      DEBUG_INFO.UI_BATCH.POS = [
         section.geom.pos[0] - section.geom.dim[0],
         section.geom.pos[1] - section.geom.dim[1],
         section.geom.pos[2],
      ];

      section.Destroy();

      // DEBUG_INFO.UI_BATCH.ROOT_IDX = INT_NULL; 
      DEBUG_INFO.UI_BATCH.MESH_BUFFER_IDX = INT_NULL; // reference to the scene's mesh buffer
      DEBUG_INFO.UI_BATCH.IS_ON = false;

      return;
   }

   // const section = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], DEBUG_INFO.UI_BATCH.POS, [0, 0], TRANSPARENCY(GREY[1], .5), 'ui batch info panel');
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui batch info panel', pad:[10, 10], pos:DEBUG_INFO.UI_BATCH.POS, dim:[0,0], col:TRANSPARENCY(GREY[1], .8), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-Batch section');


   const info1 = Create_widget_text(_, `Batch store: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_STORE}0000`, [0, 0, 10], 10, YELLOW[9]);
   const info2 = Create_widget_text(_, `Batch update: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_UPDATE}0000`, [0, 0, 10], 10, YELLOW[9]);
   section.AddItem(info1);
   section.AddItem(info2);

   // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

   section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT;
   section.Calc_no_gfx_update();

   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(scroller)
   Construct_listen_events_relations_from_mesh_tree(scroller);


   // DEBUG_INFO.UI_BATCH.ROOT_IDX = section.root_bufferidx;
   DEBUG_INFO.UI_BATCH.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_BATCH.IS_ON = true;

   const idx = Time_intervals_create(64, 'Batch info ui', TIME_INTERVAL_REPEAT_ALWAYS, Debug_info_update_batch, { target_params: section });
   section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

}



function Debug_info_update_batch(params) {

   const evt_params = params.params.target_params;

   const info1 = evt_params.children.buffer[0];
   const info2 = evt_params.children.buffer[1];

   info1.RenderTextFromString(`Batch store: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_STORE}`)
   info2.RenderTextFromString(`Batch update: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_UPDATE}`)

}


















/************************************************************************************************************************************************/
// Vertexbuffer 2D representation
/************************************************************************************************************************************************/

function Debug_info_create_vertexbuffer_2D(params) {

   // if (DEBUG_INFO.UI_MESH.IDX === INT_NULL) 
   return;
   // const sceneidx = params.params;

   // // Deactivate/Destroy/Close the DebugMeshInfoUi 
   // if (DEBUG_INFO.UI_VB_2D.IS_ON) {

   //    const meshes = Scenes_get_root_meshes(sceneidx);
   //    const root = meshes.buffer[DEBUG_INFO.UI_VB_2D.IDX];

   //    Info_listener_remove_event(root.debug_info.evtidx);
   //    // Remember the ui's position based
   //    DEBUG_INFO.UI_VB_2D.POS = [
   //       root.geom.pos[0] + root.margin[0] * 2,
   //       root.geom.pos[1] - root.geom.dim[1] + root.margin[1],
   //       root.geom.pos[2],
   //    ];

   //    root.Destroy();

   //    DEBUG_INFO.UI_VB_2D.IDX = INT_NULL; // reference to the scene's mesh buffer
   //    DEBUG_INFO.UI_VB_2D.IS_ON = false;

   //    return;
   // }


   // const tr = 1.45;

   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [10, 10], [400, 400, 0], [0, 0], TRANSPARENCY(REDL[7], .7), 'Vertexbuffer 2D representation');
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


   // const scene_meshes = Scenes_get_root_meshes(sceneidx);
   // const root_mesh = scene_meshes.buffer[DEBUG_INFO.UI_MESH.IDX]; // To get the mesh that that we want it's gfx buffer to be drawed as a 2D mesh

   // const mesh_to_represent = root_mesh.children.buffer[0]; // Get a text child and use its vertexbuffer
   // // const mesh_to_represent = root_mesh;
   // const meshes = [];
   // for (let i = 0; i < root_mesh.children.boundary; i++) {

   //    const child = root_mesh.children.buffer[i];
   //    if (child) meshes.push({
   //       start: child.gfx.start,
   //       end: child.gfx.vb.end,
   //       num_faces: child.geom.num_faces,
   //    });
   //    if (child.children.boundary) {

   //       for (let j = 0; j < child.children.boundary; j++) {

   //          const ch = child.children.buffer[j];
   //          if (ch) meshes.push({
   //             start: ch.gfx.start,
   //             end: ch.gfx.vb.end,
   //             num_faces: ch.geom.num_faces,
   //          });
   //       }
   //    }
   // }

   // const prog = Gl_progs_get_prog_byidx(mesh_to_represent.gfx.prog.groupidx, mesh_to_represent.gfx.prog.idx); // Get the vertexbuffer
   // const vb = prog.vb[mesh_to_represent.gfx.vb.idx];
   // const attribs_sizes = prog.shaderinfo.attributes.size;

   // // Gather all active attributes of the vertexbuffer
   // const attribs = []
   // if (attribs_sizes.col) attribs.push({ name: 'col', size: attribs_sizes.col, color: RED_200_10_10, })
   // if (attribs_sizes.params1) attribs.push({ name: 'params1', size: attribs_sizes.params1, color: PURPLER[7], })
   // if (attribs_sizes.pos) attribs.push({ name: 'pos', size: attribs_sizes.pos, color: PURPLER[7], })
   // if (attribs_sizes.sdf) attribs.push({ name: 'sdf', size: attribs_sizes.sdf, color: PURPLER[7], })
   // if (attribs_sizes.tex) attribs.push({ name: 'tex', size: attribs_sizes.tex, color: PURPLER[7], })
   // if (attribs_sizes.wposTime) attribs.push({ name: 'wposTime', size: attribs_sizes.wposTime, color: GREEN7, })


   // // console.log('prog:', prog)
   // // console.log('vb:', vb)
   // console.log('attribs_sizes:', attribs_sizes)
   // console.log('Enabled attribs:', attribs)


   // const vertsPerRect = prog.shaderinfo.verticesPerRect;
   // const attribsPerVertex = prog.shaderinfo.attribsPerVertex;
   // const stride_count = vertsPerRect * attribsPerVertex;

   // console.log('vertsPerRect:', vertsPerRect)
   // console.log('attribsPerVertex:', attribsPerVertex)
   // console.log('stride_count:', stride_count)
   // console.log('vertexbuffer count', vb.count)

   // let cnt = 0;
   // const max_count = 10000
   // const count = (vb.count < max_count) ? vb.count : max_count;
   // while (cnt < count) {

   //    console.log(`---- mesh:`)

   //    const mesh_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], [10, 10], TRANSPARENCY(GREY[0], 1.), `mesh_section`);
   //    section.AddItem(mesh_section)

   //    // for (let info_data = 0; info_data < meshes.length; info_data++) {
   //    for (let info_data = 0; cnt < count; info_data++) {

   //       // const mh_text = new Widget_Label(`mesh_text`, _, _, 8, _, WHITE);
   //       // section.AddItem(mh_text)
   //       const mh = Create_widget_section(_, SECTION.HORIZONTAL, [4, 4], [0, 0, 2], [10, 10], TRANSPARENCY(GREY[3], 1.), `mesh:`);
   //       mesh_section.AddItem(mh)

   //       for (let ff = 0; ff < meshes[info_data].num_faces && cnt < count; ff++) {

   //          // Create face (4 vertices for rect meshes ONLY)
   //          console.log(`---- face:`)
   //          const f = Create_widget_section(_, SECTION.VERTICAL, [3, 3], [0, 0, 3], [10, 10], TRANSPARENCY(BLUEL[7], .5), `face:`);
   //          mh.AddItem(f)

   //          // Faces count text
   //          // const temp = Create_widget_section(_, SECTION.HORIZONTAL, [5, 5], [0, 0, 2], [10, 10], TRANSPARENCY(GREY2, .5), `temp:`);
   //          // const f_text = new Widget_Label(`f:${ff}`, _, [0,0,10], 6, _, WHITE, [2,2]);
   //          // temp.AddItem(f_text)

   //          // // Vertex count text.
   //          // const attr_text = new Widget_Label(`v:${ff*vertsPerRect}`, _, [0,0,10], 6, _, WHITE, [2,2]);
   //          // temp.AddItem(attr_text)

   //          // // Attributes count text
   //          // const vert_text = new Widget_Label(`a:${cnt}`, _, [0,0,10], 6, _, WHITE, [2,2]);
   //          // temp.AddItem(vert_text)
   //          // f.AddItem(temp)

   //          for (let i = 0; i < vertsPerRect; i++) {


   //             // Create vertex 
   //             // console.log(`----  vertex:`)
   //             const v = Create_widget_section(_, SECTION.HORIZONTAL, [2, 2], [0, 0, 4], [10, 10], TRANSPARENCY(GREY[1], 1.), `vertex:${i}`);
   //             f.AddItem(v)

   //             for (let j = 0; j < attribs.length; j++) {

   //                for (let k = 0; k < attribs[j].size; k++) {

   //                   // Create floats of attributes
   //                   const val = Create_widget_section(_, SECTION.HORIZONTAL, [1, 1], [0, 0, 5], [2, 2], TRANSPARENCY(attribs[j].color, 1.), `float:${j}`);
   //                   v.AddItem(val)
   //                   cnt++;
   //                }
   //             }
   //          }
   //       }

   //    }
   // }



   // // Render the 
   // section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
   // section.Render();
   // section.Calc();
   // section.ConstructListeners();

   // DEBUG_INFO.UI_VB_2D.IDX =;
   // DEBUG_INFO.UI_VB_2D.IS_ON = true;

}

















let mesh_tree_ui_counter = 0;
let mesh_buffer_ui_counter = 0;
let string_buffer_ui_counter = 0;
let mesh_per_vb_buffer_ui_counter = 0;
let vertex_buffer_ui_counter = 0;
let render_queue_buffer_ui_counter = 0;
let mesh_tree_ui_pos = [100, 600, 0];
let mesh_buffer_ui_pos = [100, 600, 0];
let string_buffer_ui_pos = [300, 600, 0];
let mesh_per_vb_buffer_ui_pos = [300, 600, 0];
let vertex_buffer_ui_pos = [500, 600, 0];
let render_queue_buffer_ui_pos = [800, 600, 0];




/************************************************************************************************************************************************/
// Create mesh info Generic
/************************************************************************************************************************************************/
/**
 * IMPLEMENTATION:
 * We use a buffer of 2 entries. The first is the meshidx which is created uppon mesh creation and store in the Mesh_buffer storage buffer.
 * The second is again the meshidx of the coresponding new entry mesh.
 * Any 'debug_mesh' is not processed (by setting to -1).
 */
const _ui_info_buffer = New_generic_buffer(_, '_ui_info_buffer');
function Dbg_ui_info_reset() { _ui_info_buffer.ResetFull(); }




export function Dbg_ui_init_buffer_entries() {


   const entries_bufferidx = _ui_info_buffer.Add({
      entries: New_generic_buffer(_, 'Entries of _ui_info_buffer'),
      entries_flags: New_int8_buffer(_, 'NEW entries_flags'),
   });

   const ret = {
      // params:params,
      update: Dbg_ui_update_callback,
      entries_bufferidx: entries_bufferidx,
   };

   return ret;

}



export function Dbg_ui_reset_buffer_entries() {

   for (let i = 0; i <= _ui_info_buffer.boundary; i++) {
      _ui_info_buffer.buffer[i].entries.ResetFull();
      _ui_info_buffer.buffer[i].entries_flags.Reset();
   }
}



function Dbg_info_ui_create_ui(pos, name) {

   const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GREY[5], 1.);
   const pad = [6, 6], style = { rcorners: 6, feather: 1.8, border: 0 }, fontsize = 9.8;
   // const pad = [6, 6], style = [0, 1, 0], fontsize = 9.8;

   pos[0] = 0;
   pos[1] = 0;

   // Create the scolled section where a dropdown is going to exist 
   const scrolled = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6, 6], [0, 0, pos[2] + 1], [0, 0], TRANSPARENCY(GREY[0], .4), 'DBG UI Scrolled section', _, _, _, MESH_TYPE.DEBUG_MESH);
   // const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, name:'ui batch info panel', pad:[10, 10], pos:DEBUG_INFO.UI_BATCH.POS, dim:[0,0], col:TRANSPARENCY(GREY[1], .8), layout:ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL}));
   // Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   scrolled.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   scrolled.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   // scrolled.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER, FAKE_LISTEN_EVENT);
   // scrolled.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
   scrolled.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   scrolled.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   // scrolled.SetTypeDebug();

   // Create the dropdown where all entries for the info will be stored
   const dp = Create_widget_dropdown(_, name, [0, 0, pos[2] + 2], col_dp, col_menu, _, [4, 4], _, _, _, style, pad, MESH_TYPE.DEBUG_MESH);
   // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, style.feather);
   // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, style.rcorners);
   dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, style.rcorners);
   dp.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   Dropdown_roots_set_root(dp, dp);
   dp.SetTypeDebug();
   scrolled.AddItem(dp)

   // Create a text widget for count and size info of a buffer
   const info = Create_widget_text(_, `count:000 size:000`, [0, 0, pos[2] + 2], fontsize, WHITE, _, _, _, MESH_TYPE.DEBUG_MESH);
   info.SetTypeDebug();
   dp.AddToMenu(info);



   scrolled.SetTypeDebug();

   // scrolled.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   scrolled.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, scrolled.mesh_bufferidx, true);
   scrolled.GenGfxCtx();


   // scrolled.ScrollerAlignWithItemsRecalc();
   scrolled.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   scrolled.Calc_no_gfx_update();

   scrolled.Render();
   Root_group_activate_all_vbs_in_renderqueue(scrolled.root_bufferidx);

   scrolled.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scrolled.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(scrolled)
   Construct_listen_events_relations_from_mesh_tree(scrolled);

   View_build_group_from_root_mesh(scrolled);

   const scroller_component = Components_create_scroller_component(_, 200, scrolled, 100);
   Scoller_component_gengfx_and_render(scroller_component, scrolled, _);
   Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(scrolled.root_posidx, scroller_component.root_posidx);
   Listeners_set_priority(E.C, scroller_component.listeners);
   scrolled.AddChildScrollerIdx(scrolled.scroller_comp_idx);

   Scroller_component_calculate_handle_pos_dim(scrolled, scroller_component);


   return scrolled;
}




function Dbg_info_helper_find_entry_exists(meshidx, entries) {

   if (entries.active_count === 0) return INT_NULL; // If buffer empty, skip loop

   const len = entries.boundary;
   for (let i = 0; i <= len; i++) {

      if (entries.buffer[i] && meshidx === entries.buffer[i][0]) {
         return i;
      }
   }

   return INT_NULL;
}




export function Dbg_ui_store_changes(TYPE_IDXS, new_entry_idx, FLAGS) {

   const ui_buffer = _ui_info_buffer.buffer[TYPE_IDXS.ENTRIES];
   const foundidx = Dbg_info_helper_find_entry_exists(new_entry_idx, ui_buffer.entries);
   if (foundidx === INT_NULL) {

      const idx = ui_buffer.entries.Add([new_entry_idx, INT_NULL]); // Create a table entry. [meshidx, ui widget meshidx]
      ui_buffer.entries_flags.AddAtIndex(idx, FLAGS);
   }
   else { // Found, change the flag to what ever the caller of the notifications function send
      ui_buffer.entries_flags.AddAtIndex(foundidx, FLAGS);
   }
}




function Dbg_ui_destroy_entry(params) {

   // const scroller = params.root;
   const scrolled = params.root;
   const ui_buffer = _ui_info_buffer.buffer[params.type_idxs.ENTRIES];


   for (let i = 0; i <= ui_buffer.entries.boundary; i++) {

      if (ui_buffer.entries.buffer[i]) { // Must check for null elements

         const info_data = Mesh_buffer_get_mesh_byidx(ui_buffer.entries.buffer[i][1]);

         if (info_data && (ui_buffer.entries_flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.DESTROY)) { // Insert meshes that are only belong to DEFAULT grouping

            ui_buffer.entries_flags.buffer[i] &= ~NOTIFICATION_TYPE.FLAGS.IS_INSERTED;

            if (info_data.group_bufferidxs[0] !== INT_NULL) {
               View_remove_from_group(info_data);
            }
            info_data.Destroy();
            const sort = ui_buffer.entries.RemoveByIdxNoGapsVersion(i);
            ui_buffer.entries_flags.RemoveByIdxNoGapsVersion(i, false);
            if (sort) i--;
            // if(root_dp.children.buffer[1]) console.log(scrolled.GetName(), root_dp.children.buffer[1].children.buffer)
         }
      }
   }

   // Update size and count info of the mesh buffer
   const root_dp = scrolled.children.buffer[0];
   const buffer_info = root_dp.menu.children.buffer[0];
   buffer_info.RenderTextFromString(`count:${Mesh_buffer_get_count()} size:${Mesh_buffer_get_size()}`)

}




function Dbg_ui_update_callback(params) {

   const FLAGS = params.flags;
   const TYPE_IDX = params.type_idxs.ENTRIES;

   if (FLAGS & NOTIFICATION_TYPE.FLAGS.DESTROY) {
      Dbg_ui_destroy_entry(params)
   }
   if (FLAGS & NOTIFICATION_TYPE.FLAGS.CREATE) {
      if (TYPE_IDX === NOTIFICATION_TYPE.MESH_TREE_IDXS.ENTRIES) {
         Dbg_ui_mesh_buffer_create_entry(params, TYPE_IDX)
      }
      if (TYPE_IDX === NOTIFICATION_TYPE.MESH_BUFFER_IDXS.ENTRIES) {
         Dbg_ui_mesh_buffer_create_entry(params, TYPE_IDX)
      }
      else if (TYPE_IDX === NOTIFICATION_TYPE.STRING_BUFFER_IDXS.ENTRIES) {
         Dbg_ui_string_buffer_create_entry(params, TYPE_IDX)
      }
      else if (TYPE_IDX === NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.ENTRIES) {
         Dbg_ui_vertex_buffer_create_entry(params, TYPE_IDX)
      }
      else if (TYPE_IDX === NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.ENTRIES) {
         Dbg_ui_render_queue_buffer_create_entry(params, TYPE_IDX)
      }
   }

}




export function Dbg_info_ui_print_entries_table() {
   console.log(_ui_info_buffer);
}

















/****************************************************************************************************************************************************/
// DEBUG Info - Create mesh info from tree mesh
/****************************************************************************************************************************************************/

export function Debug_info_mesh_tree_create_ui() {


   // This is called by a 'switch' or 'button'. If the debug ui widget exists, then we called to close/destroy.
   const ui_widget = Notifications_get_ui_widget(NOTIFICATION_TYPE.MESH_TREE_IDXS.NOTIF);
   if (ui_widget) {

      // Remember the ui's position based on the dropdown which is responsible of setting the position of the ui_widget widget arround it..
      mesh_tree_ui_pos[0] = ui_widget.geom.pos[0],
         mesh_tree_ui_pos[1] = ui_widget.geom.pos[1],
         mesh_tree_ui_pos[2] = ui_widget.geom.pos[2],

         // Scoller_component_destroy(ui_widget.scroller_comp);
         // View_remove_view(ui_widget.group_bufferidxs);
         ui_widget.Destroy();


      // Set all entries to NOT inserted, so next time the ui wil open, all entries will be drawn
      const flags_table = _ui_info_buffer.buffer[NOTIFICATION_TYPE.MESH_TREE_IDXS.ENTRIES].entries_flags
      for (let i = 0; i <= flags_table.boundary; i++) {
         flags_table.buffer[i] &= ~NOTIFICATION_TYPE.FLAGS.IS_INSERTED;
      }

      Notifications_deactivate(NOTIFICATION_TYPE.MESH_TREE_IDXS.NOTIF);

      mesh_tree_ui_counter = 0;

      return;
   }

   const new_ui_widget = Dbg_info_ui_create_ui(mesh_tree_ui_pos, 'Mesh Buffer');

   // Connect Vertex buffer notification with the root ui widget
   Notifications_set_ui_widget(NOTIFICATION_TYPE.MESH_TREE_IDXS.NOTIF, new_ui_widget);


   const _params = {
      type_idxs: NOTIFICATION_TYPE.MESH_TREE_IDXS,
      flags: 0x0,
      root: new_ui_widget,
   }

   Dbg_ui_mesh_tree_create_entry(_params);

}




function Dbg_ui_mesh_tree_create_entry(params) {

   const scrolled = params.root;
   scrolled.options |= SECTION.RESIZE_PARENT
   const root_dp = scrolled.children.buffer[0];
   const new_entries = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries;
   const flags = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries_flags;


   const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GetRandomColor(), 1.);
   const margin = [root_dp.StylesGetPad(STYLES.AXIS.X), root_dp.StylesGetPad(STYLES.AXIS.Y)];
   const style = { rcorners: 3, feather: 1, border: 0 };
   const zindex = root_dp.menu.geom.pos[2];



   const widget_roots = Root_group_view_buffer_get();
   const len = widget_roots.boundary; // Avoid infinite loop (Avoid creating info for self debug UI's)

   for (let i = 0; i <= len; i++) {

      const child = Mesh_buffer_get_mesh_byidx(widget_roots.buffer[i].buffer[0]);
      TEMPORARY(child, root_dp)
   }



   // const len = new_entries.boundary; // Avoid infinite loop (Avoid creating info for self debug UI's)

   // for (let i = 0; i <= len; i++) {

   //    const info_data = Mesh_buffer_get_mesh_byidx(new_entries.buffer[i][0]);
   //    // console.log(info_data.mesh_bufferidx, info_data.GetName())

   //    const is_inserted = (flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.IS_INSERTED);

   //    if (!is_inserted && info_data && (info_data.type & MESH_TYPE.DEBUG_MESH) === 0) { // Insert meshes that belong only to DEFAULT grouping

   //       flags.buffer[i] |= NOTIFICATION_TYPE.FLAGS.IS_INSERTED; // Set flag for current entry to 'INSERTED'
   //       const entry_mesh = Create_widget_dropdown(_, `${mesh_tree_ui_counter++} @[${info_data.mesh_bufferidx}]`, [0, 0, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);

   //       /*****************************************************/
   //       // Connect entry's mesh_bufferidx to mesh
   //       new_entries.buffer[i][1] = entry_mesh.mesh_bufferidx;
   //       /*****************************************************/

   //       entry_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
   //       entry_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   //       entry_mesh.SetTypeDebug();
   //       const idx = root_dp.AddToMenu(entry_mesh);


   //       Helper_mesh_tree_info_create_more_info(entry_mesh, info_data, zindex, col_menu, col_dp, margin, style);

   //       /*********************************************************************************************************************************************/
   //       // Set up and Render new meshes
   //       entry_mesh.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   //       entry_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   //       if (root_dp.menu.is_gfx_inserted) {

   //          scrolled.Recalc_no_gfx_update();
   //          // scrolled.Recalc();

   //          const scroller = scrolled.scroller_comp;
   //          const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1], clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]
   //          Clipy_one_mesh(entry_mesh, clip_top, clip_bottom)
   //          if (entry_mesh.state.mask & MESH_STATE.ACTIVE) {
   //             entry_mesh.Render();
   //             // TODO: MAKE SURE THE MESHES ARE ADDED TO ALREADY EXISTING VERTEX BUUFFERS ELSE WE NEED TO UPDATE THE RENDERQUEUE
   //             const parent_events = [root_dp.menu.listeners.buffer[0], root_dp.menu.listeners.buffer[1]];
   //             // entry_mesh.ConstructListeners(parent_events);
   //          }
   //          if (root_dp.menu.group_bufferidxs[0] !== INT_NULL) View_add_to_group(entry_mesh, root_dp.group_bufferidxs[0])
   //       }

   //    }

   // }


   // Update size and count info of the mesh buffer
   const buffer_info = root_dp.menu.children.buffer[0];
   const size = Mesh_buffer_get_count(), count = Mesh_buffer_get_size();
   const text = `count:${size} size:${count}`;
   if (root_dp.isOn & DP_MENU_STATE.ON) buffer_info.RenderTextFromString(text)
   else buffer_info.SetText(text);

   console.log(scrolled.GetName(), scrolled)

}




function TEMPORARY(mesh, parent, root_entry_dp) {

   // const new_entries = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries;
   // const flags = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries_flags;



   const info_data = mesh;
   // const root_dp = root_entry_dp; // HACK for now
   // console.log(info_data.mesh_bufferidx, info_data.GetName())

   // const is_inserted = (flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.IS_INSERTED);

   // if (!is_inserted && info_data && (info_data.type & MESH_TYPE.DEBUG_MESH) === 0) { // Insert meshes that belong only to DEFAULT grouping
   if (info_data && (info_data.type & MESH_TYPE.DEBUG_MESH) === 0) { // Insert meshes that belong only to DEFAULT grouping

      // const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GetRandomColor(), 1.);
      // const margin = [root_dp.StylesGetPad(STYLES.AXIS.X), root_dp.StylesGetPad(STYLES.AXIS.Y)];
      // const style = {rcorners:3, feather:1, border:0};
      // const zindex = root_dp.menu.geom.pos[2]

      // // flags.buffer[i] |= NOTIFICATION_TYPE.FLAGS.IS_INSERTED; // Set flag for current entry to 'INSERTED'
      // const entry_mesh = Create_widget_dropdown(_, `${mesh_tree_ui_counter++} @[${info_data.mesh_bufferidx}]`, [0, 0, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);

      // // /*****************************************************/
      // // // Connect entry's mesh_bufferidx to mesh
      // // new_entries.buffer[i][1] = entry_mesh.mesh_bufferidx;
      // /*****************************************************/

      // entry_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      // entry_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      // entry_mesh.SetTypeDebug();
      // const idx = root_dp.AddToMenu(entry_mesh);

      // // Create a dropdown for the mesh, and then create some info of the mesh as text and add it to the dropdown's menu
      // const dp_mesh = Create_widget_dropdown(_, `${mesh.GetName()}`, [0, 0, parent.geom.pos[2] + 1], TRANSPARENCY(GREY[5], .5), TRANSPARENCY(GREY[1], .8), WHITE, temp_btnpad, _, _, _, _, [4, 4]);
      // parent.AddToMenu(dp_mesh);
      // dp_mesh.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      // dp_mesh.menu.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL; // Set menu to expand to the dropdown's width

      // const fontsize = 10;


      // Create a dropdown for the mesh, and then create some info of the mesh as text and add it to the dropdown's menu
      const dp_mesh = Create_widget_dropdown(_, `${mesh.GetName()}`, [0, 0, parent.geom.pos[2] + 1], TRANSPARENCY(GREY[5], .5), TRANSPARENCY(GREY[1], .8), WHITE, temp_btnpad, _, _, _, _, [4, 4]);
      dp_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      dp_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      parent.AddToMenu(dp_mesh);
      dp_mesh.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      dp_mesh.menu.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL; // Set menu to expand to the dropdown's width

      // Gather all info to a string buffr
      // const meshinfo = Helper_mesh_tree_info_create_more_info(mesh);
      const meshinfo = Mesh_info_builder(mesh);
      if (mesh.parent) {
         const parentinfo = Mesh_info_builder(mesh.parent);
         meshinfo.push('Parent:');
         for (let i = 0; i < parentinfo.length; i++) {
            meshinfo.push(parentinfo[i]);
         }
      }
      else {
         meshinfo.push('parent:NULL');
      }

      // Create the text widget's from the info string buffer
      for (let i = 0; i < meshinfo.length; i++) {
         const info = Create_widget_text(_, meshinfo[i], [0, 0, parent.geom.pos[2] + 1], 7);
         dp_mesh.AddToMenu(info);
      }
      // Run recursively for any mesh's children
      for (let i = 0; i <= mesh.children.boundary; i++) {
         const child = mesh.children.buffer[i];
         if (child)
            TEMPORARY(child, dp_mesh);
      }
   }

}




function Helper_mesh_tree_info_create_more_info(parent, info_data, zindex, col_menu, col_dp, margin, style) {


   { // Views indexes info
      const view = Create_widget_dropdown(_, `view`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      view.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      view.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      view.SetTypeDebug();
      view.Deactivate();
      parent.AddToMenu(view)
      { const info = Create_widget_text(_, `gfx:${info_data.per_vb_bufferidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `root:${info_data.root_bufferidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `batch:${info_data.batch_buffer_vbidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `group:${info_data.group_bufferidxs}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `fbidx:${info_data.fbidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `batch_fnidx:${info_data.batch_fnidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
   }

   { // Geometry info
      const view = Create_widget_dropdown(_, `geometry`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      view.options = SECTION.TOP_DOWN | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      view.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      view.SetTypeDebug();
      view.Deactivate();
      parent.AddToMenu(view)
      { const info = Create_widget_text(_, `pos:${info_data.geom.pos[0]}, ${info_data.geom.pos[1]}, ${info_data.geom.pos[2]}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `dim:${info_data.geom.dim[0]}, ${info_data.geom.dim[1]}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
   }

   { // Gfx info
      const gfx = Create_widget_dropdown(_, `gfx`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      gfx.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      gfx.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      gfx.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      gfx.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      gfx.SetTypeDebug();
      parent.AddToMenu(gfx)
      if (info_data.gfx) {
         // Program
         { const info = Create_widget_text(_, `prog: {idx:${info_data.gfx.prog.idx} attribsidx:${info_data.gfx.prog.attribsidx} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Vertex buffer
         { const info = Create_widget_text(_, `vb: { idx:${info_data.gfx.vb.idx} start:${info_data.gfx.vb.start} count:${info_data.gfx.vb.count} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Index buffer
         { const info = Create_widget_text(_, `ib: { idx:${info_data.gfx.ib.idx} count:${info_data.gfx.ib.count} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Texture
         { const info = Create_widget_text(_, `tb: { idx:${info_data.gfx.tb.idx} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
      }
      else {
         { // Vertex buffer
            const info = Create_widget_text(_, `NULL`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
            info.SetTypeDebug();
            info.Deactivate();
            gfx.AddToMenu(info);
         }
      }
   }
}

















/****************************************************************************************************************************************************/
// DEBUG Info - Create mesh info from MeshBuffer
/****************************************************************************************************************************************************/

export function Debug_info_mesh_buffer_create_ui() {


   // This is called by a 'switch' or 'button'. If the debug ui widget exists, then we called to close/destroy.
   const ui_widget = Notifications_get_ui_widget(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF);
   if (ui_widget) {

      // Remember the ui's position based on the dropdown which is responsible of setting the position of the ui_widget widget arround it..
      mesh_buffer_ui_pos[0] = ui_widget.geom.pos[0],
         mesh_buffer_ui_pos[1] = ui_widget.geom.pos[1],
         mesh_buffer_ui_pos[2] = ui_widget.geom.pos[2],

         // Scoller_component_destroy(ui_widget.scroller_comp);
         // View_remove_view(ui_widget.group_bufferidxs);
         ui_widget.Destroy();


      // Set all entries to NOT inserted, so next time the ui wil open, all entries will be drawn
      const flags_table = _ui_info_buffer.buffer[NOTIFICATION_TYPE.MESH_BUFFER_IDXS.ENTRIES].entries_flags
      for (let i = 0; i <= flags_table.boundary; i++) {
         flags_table.buffer[i] &= ~NOTIFICATION_TYPE.FLAGS.IS_INSERTED;
      }

      Notifications_deactivate(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF);

      mesh_buffer_ui_counter = 0;

      return;
   }

   const new_ui_widget = Dbg_info_ui_create_ui(mesh_buffer_ui_pos, 'Mesh Buffer');

   // Connect Vertex buffer notification with the root ui widget
   Notifications_set_ui_widget(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, new_ui_widget);


   const _params = {
      type_idxs: NOTIFICATION_TYPE.MESH_BUFFER_IDXS,
      flags: 0x0,
      root: new_ui_widget,
   }

   Dbg_ui_mesh_buffer_create_entry(_params);

}




function Dbg_ui_mesh_buffer_create_entry(params) {


   const scrolled = params.root;
   scrolled.options |= SECTION.RESIZE_PARENT
   const root_dp = scrolled.children.buffer[0];
   const new_entries = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries;
   const flags = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries_flags;

   View_reset_from_view_all_buffers(scrolled.group_bufferidxs[0]);


   const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GetRandomColor(), 1.);
   const margin = [root_dp.StylesGetPad(STYLES.AXIS.X), root_dp.StylesGetPad(STYLES.AXIS.Y)];
   const style = { rcorners: 6, feather: 1.8, border: 0 };
   const zindex = root_dp.menu.geom.pos[2]

   const len = new_entries.boundary; // Avoid infinite loop (Avoid creating info for self debug UI's)

   for (let i = 0; i <= len; i++) {

      const info_data = Mesh_buffer_get_mesh_byidx(new_entries.buffer[i][0]);
      // console.log(info_data.mesh_bufferidx, info_data.GetName())

      const is_inserted = (flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.IS_INSERTED);

      if (!is_inserted && info_data && (info_data.type & MESH_TYPE.DEBUG_MESH) === 0) { // Insert meshes that belong only to DEFAULT grouping

         flags.buffer[i] |= NOTIFICATION_TYPE.FLAGS.IS_INSERTED; // Set flag for current entry to 'INSERTED'
         const entry_mesh = Create_widget_dropdown(_, `${mesh_buffer_ui_counter++} @[${info_data.mesh_bufferidx}]`, [0, 0, zindex], col_dp, col_menu, _, [4, 2], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
         /*****************************************************/
         // Connect entry's mesh_bufferidx to mesh
         new_entries.buffer[i][1] = entry_mesh.mesh_bufferidx;
         /*****************************************************/

         entry_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
         entry_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
         entry_mesh.SetTypeDebug();
         const idx = root_dp.AddToMenu(entry_mesh);

         Helper_mesh_buffer_info_create_more_info(entry_mesh, info_data, zindex, col_menu, col_dp, margin, style);

         /*********************************************************************************************************************************************/
         // Set up and Render new meshes
         // entry_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         entry_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, root_dp.mesh_bufferidx, true);
         entry_mesh.GenGfxCtx();
         if (root_dp.menu.is_gfx_inserted) {

            // scrolled.Recalc_no_gfx_update();

            const scroller = scrolled.scroller_comp;
            const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1], clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]
            Clipy_one_mesh(entry_mesh, clip_top, clip_bottom)
            // if (entry_mesh.state.mask & MESH_STATE.ACTIVE) {
            //    entry_mesh.Render();
            //    // if(root_dp.menu.listeners===null)
            //    //    console.log()
            //    // TODO: MAKE SURE THE MESHES ARE ADDED TO ALREADY EXISTING VERTEX BUUFFERS ELSE WE NEED TO UPDATE THE RENDERQUEUE
            //    // const parent_events = [root_dp.menu.listeners.buffer[0], root_dp.menu.listeners.buffer[1]];
            //    // entry_mesh.ConstructListeners(parent_events);
            // }
            if (root_dp.menu.group_bufferidxs[0] !== INT_NULL) View_add_to_group(entry_mesh, root_dp.group_bufferidxs[0])
         }

      }
      else { // Destroy the entry
         // console.log(i, new_entries.buffer[i], info_data.GetName())
      }
   }


   scrolled.Calc_no_gfx_update();
   // scrolled.Recalc_no_gfx_update();
   /********************************************************************************************************************/
   // Re-create listen events 
   // Construct_listen_events_from_mesh_tree(this.menu)
   // Construct_listen_events_relations_from_mesh_tree(this.menu);

   // Set menu in focus
   // Mesh_set_root_in_focus(root.root_bufferidx);

   /********************************************************************************************************************/
   // Re-render   
   View_render_from_view_all_buffers(scrolled.group_bufferidxs[0], false);

   // Update size and count info of the mesh buffer
   const buffer_info = root_dp.menu.children.buffer[0];
   const size = Mesh_buffer_get_count(), count = Mesh_buffer_get_size();
   const text = `count:${size} size:${count}`;
   if (root_dp.isOn & DP_MENU_STATE.ON) buffer_info.RenderTextFromString(text)
   else buffer_info.SetText(text);


}




function Helper_mesh_buffer_info_create_more_info(parent, info_data, zindex, col_menu, col_dp, margin, style, btn_pad = [4, 2]) {

   { // Create info name
      const info_name = Create_widget_label(_, info_data.GetName(), _, [0, 0, 1], 9, PURPLEB[9], _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
      // info_name.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      info_name.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, style.feather);
      info_name.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, style.r_corners);
      parent.AddToMenu(info_name);

   }
   { // Views indexes info
      const view = Create_widget_dropdown(_, `view`, [100, 100, zindex], col_dp, col_menu, _, btn_pad, _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, style.feather);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, style.r_corners);
      view.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      view.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      view.SetTypeDebug();
      view.Deactivate();
      parent.AddToMenu(view)
      { const info = Create_widget_text(_, `per_vb_idx:${info_data.per_vb_bufferidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `root:${info_data.root_bufferidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `batch:${info_data.batch_buffer_vbidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `group:${info_data.group_bufferidxs}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `fbidx:${info_data.fbidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `batch_fnidx:${info_data.batch_fnidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
   }

   { // Geometry info
      const view = Create_widget_dropdown(_, `geometry`, [100, 100, zindex], col_dp, col_menu, _, btn_pad, _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, style.feather);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, style.r_corners);
      view.options = SECTION.TOP_DOWN | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      view.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      view.SetTypeDebug();
      view.Deactivate();
      parent.AddToMenu(view)
      { const info = Create_widget_text(_, `pos:${info_data.geom.pos[0]}, ${info_data.geom.pos[1]}, ${info_data.geom.pos[2]}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `dim:${info_data.geom.dim[0]}, ${info_data.geom.dim[1]}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
   }

   { // Gfx info
      const gfx = Create_widget_dropdown(_, `gfx`, [100, 100, zindex], col_dp, col_menu, _, btn_pad, _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      gfx.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, style.feather);
      gfx.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, style.r_corners);
      gfx.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      gfx.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      gfx.SetTypeDebug();
      parent.AddToMenu(gfx)
      if (info_data.gfx) {
         // Program
         { const info = Create_widget_text(_, `prog: {idx:${info_data.gfx.prog.idx} attribsidx:${info_data.gfx.prog.attribsidx} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Vertex buffer
         { const info = Create_widget_text(_, `vb: { idx:${info_data.gfx.vb.idxs.buffer[0]} start:${info_data.gfx.vb.starts.buffer[0]} count:${info_data.gfx.vb.counts.buffer[0]} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Index buffer
         { const info = Create_widget_text(_, `ib: { idx:${info_data.gfx.ib.idx} count:${info_data.gfx.ib.count} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Texture
         { const info = Create_widget_text(_, `tb: { idx:${info_data.gfx.tb.idx} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
      }
      else {
         { // Vertex buffer
            const info = Create_widget_text(_, `NULL`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
            info.SetTypeDebug();
            info.Deactivate();
            gfx.AddToMenu(info);
         }
      }
   }
}




export function TEMP_mesh_buffer_info_ui_print_entries_table() {
   const ui = _ui_info_buffer.buffer[NOTIFICATION_TYPE.MESH_BUFFER_IDXS.ENTRIES];
   if (ui && ui !== _) {
      console.log(ui.entries);
      console.log(ui.entries_flags);
   }
}
















/****************************************************************************************************************************************************/
// DEBUG Info - Create info from String Buffer
/****************************************************************************************************************************************************/



export function Debug_info_string_buffer_create_ui() {


   // This is called by a 'switch' or 'button'. If the debug ui widget exists, then we called to close/destroy.
   const ui_widget = Notifications_get_ui_widget(NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF);
   if (ui_widget) {

      // Remember the ui's position based on the dropdown which is responsible of setting the position of the ui_widget widget arround it..
      string_buffer_ui_pos[0] = ui_widget.geom.pos[0],
         string_buffer_ui_pos[1] = ui_widget.geom.pos[1],
         string_buffer_ui_pos[2] = ui_widget.geom.pos[2],

         // Scoller_component_destroy(ui_widget.scroller_comp);
         // View_remove_view(ui_widget.group_bufferidxs);
         ui_widget.Destroy();


      // Set all entries to NOT inserted, so next time the ui wil open, all entries will be drawn
      const flags_table = _ui_info_buffer.buffer[NOTIFICATION_TYPE.STRING_BUFFER_IDXS.ENTRIES].entries_flags
      for (let i = 0; i <= flags_table.boundary; i++) {
         flags_table.buffer[i] &= ~NOTIFICATION_TYPE.FLAGS.IS_INSERTED;
      }

      Notifications_deactivate(NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF);

      string_buffer_ui_counter = 0;

      return;
   }


   const new_ui_widget = Dbg_info_ui_create_ui(string_buffer_ui_pos, 'String Buffer');

   // Connect Vertex buffer notification with the root ui widget
   Notifications_set_ui_widget(NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF, new_ui_widget);


   const _params = {
      type_idxs: NOTIFICATION_TYPE.STRING_BUFFER_IDXS,
      flags: 0x0,
      root: new_ui_widget,
   }

   Dbg_ui_string_buffer_create_entry(_params);

}




function Dbg_ui_string_buffer_create_entry(params) {

   const scrolled = params.root;

   scrolled.options |= SECTION.RESIZE_PARENT
   const root_dp = scrolled.children.buffer[0];
   const new_entries = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries;
   const flags = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries_flags;

   const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GetRandomColor(), 1.);
   const margin = [root_dp.StylesGetPad(STYLES.AXIS.X), root_dp.StylesGetPad(STYLES.AXIS.Y)];
   const style = { rcorners: 3, feather: 1, border: 0 };
   const zindex = root_dp.menu.geom.pos[2]

   const len = new_entries.boundary; // Avoid infinite loop (Avoid creating info for dubug UI's)

   for (let i = 0; i <= len; i++) {

      const info_data = Mesh_buffer_get_mesh_byidx(new_entries.buffer[i][0]);


      const is_inserted = (flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.IS_INSERTED);
      if (!is_inserted && info_data && (info_data.type & MESH_TYPE.DEBUG_MESH) === 0) { // Insert meshes that are only belong to DEFAULT grouping

         flags.buffer[i] |= NOTIFICATION_TYPE.FLAGS.IS_INSERTED; // Set flag for current entry to 'INSERTED'
         const string = Str_buffer_mesh_names_get_by_idx(info_data.nameidx);
         const entry_mesh = Create_widget_dropdown(_, `${string_buffer_ui_counter++} ${string}`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

         /*****************************************************/
         // Connect entry's mesh_bufferidx to mesh
         new_entries.buffer[i][1] = entry_mesh.mesh_bufferidx;
         /*****************************************************/

         // entry_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
         entry_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
         entry_mesh.SetTypeDebug();
         root_dp.AddToMenu(entry_mesh);


         Helper_string_buffer_info_create_more_info(entry_mesh, info_data, zindex, col_menu, col_dp, margin, style);

         /*********************************************************************************************************************************************/
         // Set up and Render new meshes
         // entry_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         entry_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, root_dp.mesh_bufferidx, true);
         entry_mesh.GenGfxCtx();
         if (root_dp.menu.is_gfx_inserted) {

            scrolled.Recalc_no_gfx_update();

            const scroller = scrolled.scroller_comp;
            const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1], clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]
            Clipy_one_mesh(entry_mesh, clip_top, clip_bottom)
            if (entry_mesh.state.mask & MESH_STATE.ACTIVE) {
               entry_mesh.Render();
               // entry_mesh.ConstructListeners(root_dp);
            }
            if (root_dp.menu.group_bufferidxs[0] !== INT_NULL) View_add_to_group(entry_mesh, root_dp.group_bufferidxs[0])
         }

      }
   }


   // Update size and count info of the mesh buffer
   const buffer_info = root_dp.menu.children.buffer[0];
   const size = Mesh_buffer_get_count(), count = Mesh_buffer_get_size();
   const text = `count:${size} size:${count}`;
   if (root_dp.isOn & DP_MENU_STATE.ON) buffer_info.RenderTextFromString(text)
   else buffer_info.SetText(text);

}




function Helper_string_buffer_info_create_more_info(parent, info_data, zindex, col_menu, col_dp, margin, style) {

   { // Views indexes info
      const view = Create_widget_dropdown(_, `view`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      // view.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.EXPAND;
      view.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      view.SetTypeDebug();
      view.Deactivate();
      parent.AddToMenu(view)
      { const info = Create_widget_text(_, `gfx:${info_data.per_vb_bufferidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `root:${info_data.root_bufferidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `batch:${info_data.batch_buffer_vbidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `group:${info_data.group_bufferidxs}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `fbidx:${info_data.fbidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `batch_fnidx:${info_data.batch_fnidx}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
   }

   { // Geometry info
      const view = Create_widget_dropdown(_, `geometry`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      view.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      // view.options = SECTION.TOP_DOWN | SECTION.EXPAND | SECTION.VERTICAL | SECTION.INHERIT;
      view.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      view.SetTypeDebug();
      parent.AddToMenu(view)
      { const info = Create_widget_text(_, `pos:${info_data.geom.pos[0]}, ${info_data.geom.pos[1]}, ${info_data.geom.pos[2]}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
      { const info = Create_widget_text(_, `dim:${info_data.geom.dim[0]}, ${info_data.geom.dim[1]}`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); view.AddToMenu(info); }
   }

   { // Gfx info
      const gfx = Create_widget_dropdown(_, `gfx`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      gfx.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      gfx.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      // gfx.options = SECTION.TOP_DOWN | SECTION.EXPAND  | SECTION.VERTICAL | SECTION.INHERIT;
      gfx.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      gfx.SetTypeDebug();
      gfx.Deactivate();
      parent.AddToMenu(gfx)
      if (info_data.gfx) {
         // Program
         { const info = Create_widget_text(_, `prog: {idx:${info_data.gfx.prog.idx} attribsidx:${info_data.gfx.prog.attribsidx} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Vertex buffer
         { const info = Create_widget_text(_, `vb: { idx:${info_data.gfx.vb.idx} start:${info_data.gfx.vb.start} count:${info_data.gfx.vb.count} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Index buffer
         { const info = Create_widget_text(_, `ib: { idx:${info_data.gfx.ib.idx} count:${info_data.gfx.ib.count} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
         // Texture
         { const info = Create_widget_text(_, `tb: { idx:${info_data.gfx.tb.idx} }`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); gfx.AddToMenu(info); }
      }
      else {
         { // Vertex buffer
            const info = Create_widget_text(_, `NULL`, _, _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
            info.SetTypeDebug();
            info.Deactivate();
            gfx.AddToMenu(info);
         }
      }
   }
}




export function TEMP_string_buffer_info_ui_print_entries_table() {
   const ui = _ui_info_buffer.buffer[NOTIFICATION_TYPE.STRING_BUFFER_IDXS.ENTRIES];
   if (ui && ui !== _) {
      console.log(ui.entries);
      console.log(ui.entries_flags);
   }
}

















/****************************************************************************************************************************************************/
// DEBUG Info - Create mesh info from mesh per vb buffer
/****************************************************************************************************************************************************/

export function Debug_info_mesh_per_vb_buffer_create_ui() {


   // This is called by a 'switch' or 'button'. If the debug ui widget exists, then we called to close/destroy.
   const ui_widget = Notifications_get_ui_widget(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF);
   if (ui_widget) {

      // Remember the ui's position based on the dropdown which is responsible of setting the position of the ui_widget widget arround it..
      mesh_per_vb_buffer_ui_pos[0] = ui_widget.geom.pos[0],
         mesh_per_vb_buffer_ui_pos[1] = ui_widget.geom.pos[1],
         mesh_per_vb_buffer_ui_pos[2] = ui_widget.geom.pos[2],

         // Scoller_component_destroy(ui_widget.scroller_comp);
         // View_remove_view(ui_widget.group_bufferidxs);
         ui_widget.Destroy();


      // Set all entries to NOT inserted, so next time the ui wil open, all entries will be drawn
      const flags_table = _ui_info_buffer.buffer[NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.ENTRIES].entries_flags
      for (let i = 0; i <= flags_table.boundary; i++) {
         flags_table.buffer[i] &= ~NOTIFICATION_TYPE.FLAGS.IS_INSERTED;
      }

      Notifications_deactivate(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF);

      mesh_per_vb_buffer_ui_counter = 0;

      return;
   }


   mesh_per_vb_buffer_ui_pos[1] = Screen_wpos_get_y();
   const new_ui_widget = Dbg_info_ui_create_ui(mesh_per_vb_buffer_ui_pos, 'Mesh Per Vb Buffer');

   // Connect Vertex buffer notification with the root ui widget
   Notifications_set_ui_widget(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF, new_ui_widget);


   const _params = {
      type_idxs: NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS,
      flags: 0x0,
      root: new_ui_widget,
   }

   Dbg_ui_mesh_per_vb_buffer_create_entry(_params);

}




function Dbg_ui_mesh_per_vb_buffer_create_entry(params) {

   // const scroller = params.root;
   const scrolled = params.root;
   scrolled.options |= SECTION.RESIZE_PARENT
   const root_dp = scrolled.children.buffer[0];
   const new_entries = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries;
   const flags = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries_flags;

   const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GetRandomColor(), 1.);
   const margin = [root_dp.StylesGetPad(STYLES.AXIS.X), root_dp.StylesGetPad(STYLES.AXIS.Y)];
   const style = { rcorners: 3, feather: 1, border: 0 };
   // const style = [0, 0, 0];
   const zindex = root_dp.menu.geom.pos[2]

   const len = new_entries.boundary; // Avoid infinite loop (Avoid creating info for dubug UI's)

   for (let i = 0; i <= len; i++) {

      const info_data = Mesh_per_vb_get_vb_byidx(new_entries.buffer[i][0]);


      const is_inserted = (flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.IS_INSERTED);
      if (!is_inserted && info_data && (info_data.type & MESH_TYPE.DEBUG_MESH) === 0) { // Insert meshes that are only belong to DEFAULT grouping

         flags.buffer[i] |= NOTIFICATION_TYPE.FLAGS.IS_INSERTED; // Set flag for current entry to 'INSERTED'
         const entry_mesh = Create_widget_dropdown(_, `${mesh_per_vb_buffer_ui_counter++} Meshes-VB[${new_entries.buffer[i][0]}]`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

         /*****************************************************/
         // Connect entry's mesh_bufferidx to mesh
         new_entries.buffer[i][1] = entry_mesh.mesh_bufferidx;
         /*****************************************************/

         entry_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
         entry_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
         entry_mesh.SetTypeDebug();
         root_dp.AddToMenu(entry_mesh);


         Helper_mesh_per_vb_buffer_info_create_more_info(entry_mesh, info_data, zindex, col_menu, col_dp, margin, style);

         /*********************************************************************************************************************************************/
         // Set up and Render new meshes
         // entry_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         entry_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, root_dp.mesh_bufferidx, true);
         entry_mesh.GenGfxCtx();
         if (root_dp.menu.is_gfx_inserted) {

            scrolled.Recalc_no_gfx_update();

            const scroller = scrolled.scroller_comp;
            const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1], clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]
            Clipy_one_mesh(entry_mesh, clip_top, clip_bottom)
            if (entry_mesh.state.mask & MESH_STATE.ACTIVE) {
               entry_mesh.Render();
               // entry_mesh.ConstructListeners(root_dp);
            }
            if (root_dp.menu.group_bufferidxs[0] !== INT_NULL) View_add_to_group(entry_mesh, root_dp.group_bufferidxs[0])
         }
         else {
            entry_mesh.state.mask &= ~MESH_STATE.ACTIVE;
         }

      }
   }


   // Update size and count info of the mesh buffer
   const buffer_info = root_dp.menu.children.buffer[0];
   const size = Mesh_per_vb_get_count(), count = Mesh_per_vb_get_size();
   const text = `count:${size} size:${count}`;
   if (root_dp.isOn & DP_MENU_STATE.ON) buffer_info.RenderTextFromString(text)
   else buffer_info.SetText(text);

}




function Helper_mesh_per_vb_buffer_info_create_more_info(parent, info_data, zindex, col_menu, col_dp, margin, style) {

   {
      const info_mesh = Create_widget_section(_, SECTION.VERTICAL, margin, [0, 0, zindex], _, GREEN[4], 'vb_info', style, _, _, MESH_TYPE.DEBUG_MESH);
      info_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      info_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      info_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
      info_mesh.SetTypeDebug();
      info_mesh.Deactivate();
      parent.AddToMenu(info_mesh);

      const pos = [0, 0, info_mesh.geom.pos[2] + 1]
      { const info = Create_widget_text(_, `count:${info_data.active_count}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
      { const info = Create_widget_text(_, `size:${info_data.size}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
      { const info = Create_widget_text(_, `boundary:${info_data.boundary}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
      { const info = Create_widget_text(_, `freeidx:${info_data.freeidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
      { const info = Create_widget_text(_, `reserveidx:${info_data.reserveidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }

      {

         const all_meshes_buffer = Create_widget_dropdown(_, `meshes`, [100, 100, zindex + 1], GREY[1], GREY[2], _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
         all_meshes_buffer.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
         all_meshes_buffer.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
         all_meshes_buffer.options = SECTION.TOP_DOWN | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
         all_meshes_buffer.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
         all_meshes_buffer.SetTypeDebug();
         all_meshes_buffer.Deactivate();
         Dropdown_roots_set_root(all_meshes_buffer, all_meshes_buffer)
         info_mesh.AddItem(all_meshes_buffer);

         // pos[2] += 1;

         for (let i = 0; i <= info_data.boundary; i++) {

            const meshidx = info_data.buffer[i];
            const mesh = Mesh_buffer_get_mesh_byidx(meshidx)
            if (mesh) {

               const info = Create_widget_text(_, `idx:[${meshidx}] ${mesh.GetName()}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
               info.SetTypeDebug();
               all_meshes_buffer.AddToMenu(info);
            }
         }

      }
   }


   // { // Gfx info
   //    const gfx = Create_widget_dropdown(_, `gfx`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, style, margin, MESH_TYPE.DEBUG_MESH);
   //    gfx.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
   //    gfx.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   //    gfx.SetTypeDebug();
   //    parent.AddToMenu(gfx)
   //    if (info_data.gfx) {
   //       // Program
   //       { const info = Create_widget_text(_, `prog: {idx:${info_data.gfx.prog.idx} attribsidx:${info_data.gfx.prog.attribsidx} }`, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.SetTypeDebug(); gfx.AddToMenu(info); }
   //       // Vertex buffer
   //       { const info = Create_widget_text(_, `vb: { idx:${info_data.gfx.vb.idx} start:${info_data.gfx.vb.start} count:${info_data.gfx.vb.count} }`, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.SetTypeDebug(); gfx.AddToMenu(info); }
   //       // Index buffer
   //       { const info = Create_widget_text(_, `ib: { idx:${info_data.gfx.ib.idx} count:${info_data.gfx.ib.count} }`, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.SetTypeDebug(); gfx.AddToMenu(info); }
   //       // Texture
   //       { const info = Create_widget_text(_, `tb: { idx:${info_data.gfx.tb.idx} }`, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.SetTypeDebug(); gfx.AddToMenu(info); }
   //    }
   //    else {
   //       { // Vertex buffer
   //          const info = Create_widget_text(_, `NULL`, _, _, _, _, _, MESH_TYPE.DEBUG_MESH);
   //          info.SetTypeDebug();
   //          gfx.AddToMenu(info);
   //       }
   //    }
   // }
}




export function TEMP_mesh_per_vb_buffer_info_ui_print_entries_table() {
   const ui = _ui_info_buffer.buffer[NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.ENTRIES];
   if (ui && ui !== _) {
      console.log(ui.entries);
      console.log(ui.entries_flags);
   }
}

















/****************************************************************************************************************************************************/
// DEBUG Info - Create Vertex buffers text
/****************************************************************************************************************************************************/


function Debug_info_vertex_buffer_create_ui() {


   // This is called by a 'switch' or 'button'. If the debug ui widget exists, then we called to close/destroy.
   const ui_widget = Notifications_get_ui_widget(NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF);
   if (ui_widget) {

      // Remember the ui's position based on the dropdown which is responsible of setting the position of the ui_widget widget arround it..
      vertex_buffer_ui_pos[0] = ui_widget.geom.pos[0],
         vertex_buffer_ui_pos[1] = ui_widget.geom.pos[1],
         vertex_buffer_ui_pos[2] = ui_widget.geom.pos[2],

         // Scoller_component_destroy(ui_widget.scroller_comp);
         // View_remove_view(ui_widget.group_bufferidxs);
         ui_widget.Destroy();


      // Set all entries to NOT inserted, so next time the ui wil open, all entries will be drawn
      const flags_table = _ui_info_buffer.buffer[NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.ENTRIES].entries_flags
      for (let i = 0; i <= flags_table.boundary; i++) {
         flags_table.buffer[i] &= ~NOTIFICATION_TYPE.FLAGS.IS_INSERTED;
      }

      Notifications_deactivate(NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF);

      vertex_buffer_ui_counter = 0;

      return;
   }


   const new_ui_widget = Dbg_info_ui_create_ui(vertex_buffer_ui_pos, 'Vertex Buffer');

   // Connect Vertex buffer notification with the root ui widget
   Notifications_set_ui_widget(NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF, new_ui_widget);


   const _params = {
      type_idxs: NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS,
      flags: 0x0,
      root: new_ui_widget,
   }

   Dbg_ui_vertex_buffer_create_entry(_params);

}



function Dbg_ui_vertex_buffer_create_entry(params) {


   // const scroller = params.root;
   const scrolled = params.root;
   scrolled.options |= SECTION.RESIZE_PARENT
   const root_dp = scrolled.children.buffer[0];
   const new_entries = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries;
   const flags = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries_flags;

   const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GetRandomColor(), 1.);
   const margin = [root_dp.StylesGetPad(STYLES.AXIS.X), root_dp.StylesGetPad(STYLES.AXIS.Y)];
   const style = { rcorners: 3, feather: 1, border: 0 };
   const zindex = root_dp.menu.geom.pos[2];

   const VERTEX_BUFFER_INFO = 0; // The index of the entries buffer that caries info from the vertex buffers Notification call
   const MESH_IDX = 1; // The index at which is storing the mesh's index (to the mesh buffer) 

   const len = new_entries.boundary; // Avoid infinite loop (Avoid creating info for dubug UI's)

   for (let i = 0; i <= len; i++) {

      const vb_group = Vertex_buffer_group_get_byidx(new_entries.buffer[i][VERTEX_BUFFER_INFO]);

      const is_inserted = (flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.IS_INSERTED);

      if (!is_inserted) {

         flags.buffer[i] |= NOTIFICATION_TYPE.FLAGS.IS_INSERTED; // Set flag for current entry to 'INSERTED'
         const entry_mesh = Create_widget_dropdown(_, `${vertex_buffer_ui_counter++} VB-Group[${vb_group.idx}]`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

         /*****************************************************/
         // Connect entry's mesh_bufferidx to mesh
         new_entries.buffer[i][MESH_IDX] = entry_mesh.mesh_bufferidx;

         /*****************************************************/
         entry_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
         entry_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
         entry_mesh.SetTypeDebug();
         root_dp.AddToMenu(entry_mesh);


         Helper_vertex_buffer_info_create_more_info(entry_mesh, vb_group, zindex + 1, col_menu, margin, style)

         /*********************************************************************************************************************************************/
         // Set up and Render new meshes
         // entry_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         entry_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, root_dp.mesh_bufferidx, true);
         entry_mesh.GenGfxCtx();
         if (root_dp.menu.is_gfx_inserted) {

            scrolled.Recalc_no_gfx_update();

            const scroller = scrolled.scroller_comp;
            const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1], clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]
            Clipy_one_mesh(entry_mesh, clip_top, clip_bottom)
            if (entry_mesh.state.mask & MESH_STATE.ACTIVE) {
               entry_mesh.Render();
               const parent_events = [root_dp.menu.listeners.buffer[0], root_dp.menu.listeners.buffer[1]];
               // entry_mesh.ConstructListeners(parent_events);
            }
            if (root_dp.menu.group_bufferidxs[0] !== INT_NULL) View_add_to_group(entry_mesh, root_dp.group_bufferidxs[0])
         }
      }
   }


   // Update size and count info of the mesh buffer
   const buffer_info = root_dp.menu.children.buffer[0];
   const size = Vertex_buffer_group_get_size(), count = Vertex_buffer_group_get_count();
   const text = `count:${count} size:${size}`;
   if (root_dp.isOn & DP_MENU_STATE.ON) buffer_info.RenderTextFromString(text)
   else buffer_info.SetText(text);

}



function Helper_vertex_buffer_info_create_more_info(parent, vb_group, zindex, col_menu, margin, style) {

   const info_mesh = Create_widget_section(_, SECTION.VERTICAL, margin, [0, 0, zindex + 1], _, col_menu, 'vb_info', style, _, _, MESH_TYPE.DEBUG_MESH);
   info_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   info_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 5);
   info_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
   info_mesh.SetTypeDebug();
   parent.AddToMenu(info_mesh);


   const pos = [0, 0, zindex + 2]
   for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {

      const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[i]);

      const vb_info_info = Create_widget_dropdown(_, `VB-[${vb_group.vb_idxs.buffer[i]}]`, [0, 0, zindex], _, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
      vb_info_info.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
      vb_info_info.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 5);
      parent.AddToMenu(vb_info_info);

      /* vb_info struct:
         add_to_fn, count, vCount, sid:, size, state, texidx, type, vbo:webGlObject, 
         attribs_info:{ attrib_divisor:int, count:int, locs:[], offsets:[], sizes:[], }
      */

      { const info = Create_widget_text(_, `count:${vb_info.count}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.SetTypeDebug(); vb_info_info.AddToMenu(info); }
      { const info = Create_widget_text(_, `size:${vb_info.size}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.SetTypeDebug(); vb_info_info.AddToMenu(info); }
      { const info = Create_widget_text(_, `vCount:${vb_info.vCount}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.SetTypeDebug(); vb_info_info.AddToMenu(info); }
   }
   { const info = Create_widget_text(_, `draw count:${vb_group.draw_count}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info.state.mask &= ~MESH_STATE.ACTIVE; info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `render_queueidx:${vb_group.render_queueidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info.state.mask &= ~MESH_STATE.ACTIVE; info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `progidx:${vb_group.progidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info.state.mask &= ~MESH_STATE.ACTIVE; info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `ibidx:${vb_group.ibidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info.state.mask &= ~MESH_STATE.ACTIVE; info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `texidx:${vb_group.texture_file_id}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info.state.mask &= ~MESH_STATE.ACTIVE; info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `vaoidx:${vb_group.vaoidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info.state.mask &= ~MESH_STATE.ACTIVE; info_mesh.AddItem(info); }

}

















/****************************************************************************************************************************************************/
// DEBUG Info - Create mesh info from Render Queue
/****************************************************************************************************************************************************/


function Debug_info_render_queue_buffer_create_ui() {


   // This is called by a 'switch' or 'button'. If the debug ui widget exists, then we called to close/destroy.
   const ui_widget = Notifications_get_ui_widget(NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF);
   if (ui_widget) {

      // Remember the ui's position based on the dropdown which is responsible of setting the position of the ui_widget widget arround it..
      render_queue_buffer_ui_pos[0] = ui_widget.geom.pos[0],
         render_queue_buffer_ui_pos[1] = ui_widget.geom.pos[1],
         render_queue_buffer_ui_pos[2] = ui_widget.geom.pos[2],

         // Scoller_component_destroy(ui_widget.scroller_comp);
         // View_remove_view(ui_widget.group_bufferidxs);
         ui_widget.Destroy();


      // Set all entries to NOT inserted, so next time the ui wil open, all entries will be drawn
      const flags_table = _ui_info_buffer.buffer[NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.ENTRIES].entries_flags
      for (let i = 0; i <= flags_table.boundary; i++) {
         flags_table.buffer[i] &= ~NOTIFICATION_TYPE.FLAGS.IS_INSERTED;
      }

      Notifications_deactivate(NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF);

      render_queue_buffer_ui_counter = 0;

      return;
   }


   const new_ui_widget = Dbg_info_ui_create_ui(render_queue_buffer_ui_pos, 'Render Queue Buffer');

   // Connect Vertex buffer notification with the root ui widget
   Notifications_set_ui_widget(NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF, new_ui_widget);


   const _params = {
      type_idxs: NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS,
      flags: 0x0,
      root: new_ui_widget,
   }

   Dbg_ui_render_queue_buffer_create_entry(_params);

}



function Dbg_ui_render_queue_buffer_create_entry(params) {


   // const scroller = params.root;
   const scrolled = params.root;
   scrolled.options |= SECTION.RESIZE_PARENT
   const root_dp = scrolled.children.buffer[0];
   const new_entries = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries;
   const flags = _ui_info_buffer.buffer[params.type_idxs.ENTRIES].entries_flags;

   const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GetRandomColor(), 1.);
   const margin = [root_dp.StylesGetPad(STYLES.AXIS.X), root_dp.StylesGetPad(STYLES.AXIS.Y)];
   const style = { rcorners: 3, feather: 3, border: 1 };
   const zindex = root_dp.menu.geom.pos[2]

   const len = new_entries.boundary; // Avoid infinite loop (Avoid creating info for dubug UI's)

   // IMPORTANT: We need to activate the dp's menu, in order to call Render() on the new entries.
   root_dp.menu.state.mask |= MESH_STATE.ACTIVE;

   for (let i = 0; i <= len; i++) {

      const rq_info = Renderqueue_get_byidx(new_entries.buffer[i][0]);

      const is_inserted = (flags.buffer[i] & NOTIFICATION_TYPE.FLAGS.IS_INSERTED);

      if (!is_inserted) {

         flags.buffer[i] |= NOTIFICATION_TYPE.FLAGS.IS_INSERTED; // Set flag for current entry to 'INSERTED'
         const entry_mesh = Create_widget_dropdown(_, `${render_queue_buffer_ui_counter++} RQ[${rq_info.queueIdx}]`, [100, 100, zindex], col_dp, col_menu, _, [2, 1], _, _, _, style, margin, MESH_TYPE.DEBUG_MESH);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
         entry_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 5);
         /*****************************************************/
         // Connect entry's mesh_bufferidx to mesh
         new_entries.buffer[i][1] = entry_mesh.mesh_bufferidx;
         /*****************************************************/

         entry_mesh.SetTypeDebug();
         root_dp.AddToMenu(entry_mesh);
         entry_mesh.Deactivate();


         Helper_render_queue_buffer_info_create_more_info(entry_mesh, rq_info, zindex + 1, col_menu, margin, style)

         /*********************************************************************************************************************************************/
         // Set up and Render new meshes
         // entry_mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         entry_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, root_dp.mesh_bufferidx, true);
         entry_mesh.GenGfxCtx();

         // TEMP_DP_STEAL_THE_DP_RECALC(root_dp)
         if (root_dp.menu.is_gfx_inserted) {

            entry_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
            root_dp.Recalc_no_gfx_update();

            const scroller = scrolled.scroller_comp;
            const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1], clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]
            // Clipy_one_mesh(entry_mesh, clip_top, clip_bottom)
            if (entry_mesh.state.mask & MESH_STATE.ACTIVE) {
               entry_mesh.Render();
               // const parent_events = [root_dp.menu.listeners.buffer[0], root_dp.menu.listeners.buffer[1]];
               // entry_mesh.ConstructListeners(parent_events);
            }

            if (root_dp.menu.group_bufferidxs[0] !== INT_NULL) View_add_to_group(entry_mesh, root_dp.group_bufferidxs[0]);

            // View_reset_from_view_all_buffers(root_dp.group_bufferidxs[0]);
            // View_render_from_view_all_buffers(root_dp.group_bufferidxs[0], false);
         }
      }
   }

   if (root_dp.menu.is_gfx_inserted) {
      scrolled.Recalc_no_gfx_update();
   }

   // Update size and count info of the mesh buffer
   const buffer_info = root_dp.menu.children.buffer[0];
   const size = Renderqueue_get_size(), count = Renderqueue_get_count();
   const text = `count:${count} size:${size}`;
   if (root_dp.isOn & DP_MENU_STATE.ON) buffer_info.RenderTextFromString(text)
   else buffer_info.SetText(text);

}



function Helper_render_queue_buffer_info_create_more_info(parent, info_data, zindex, col_menu, margin, style) {

   const info_mesh = Create_widget_section(_, SECTION.VERTICAL, margin, [0, 0, zindex + 1], _, col_menu, 'rq_info', style, _, _, MESH_TYPE.DEBUG_MESH);
   info_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   info_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 5);
   info_mesh.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
   info_mesh.SetTypeDebug();
   info_mesh.Deactivate();
   parent.AddToMenu(info_mesh);


   const pos = [0, 0, zindex + 2]
   { const info = Create_widget_text(_, `is active:${info_data.isActive}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `isactiveflag:${info_data.flags & 0x1}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `progidx:${info_data.progidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `vbidx:${info_data.vbidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }
   { const info = Create_widget_text(_, `ibidx:${info_data.ibidx}`, pos, _, _, _, _, _, MESH_TYPE.DEBUG_MESH); info.Deactivate(); info.SetTypeDebug(); info_mesh.AddItem(info); }

}









