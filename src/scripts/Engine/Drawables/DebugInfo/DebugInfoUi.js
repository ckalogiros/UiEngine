"use strict";

import { Vertex_buffer_create_text_info, Vertex_buffer_info_get_by_vbidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Dropdown_roots_set_root } from "../Widgets/Widget_Dropdown";
import { PerformanceTimersGetBestFps, PerformanceTimersGetFps, PerformanceTimersGetWorstFps, Performance_timers_get_avg_1sec_reset, Performance_timers_get_ms_1sec_reset, _pt_all_timers, _pt_batch2_update, _pt_batch_update, _pt_event_listener, _pt_framebuffer_rendering, _pt_gl_draw, _pt_hover_listener, _pt_loop, _pt_mesh_info_tip, _pt_scene_update } from "../../Timers/PerformanceTimers";
import { Info_listener_create_event, Info_listener_destroy_event } from "./InfoListeners";
import { Create_widget_dropdown, Create_widget_multi_text, Create_widget_scroller, Create_widget_section, Create_widget_text } from "../../Core/CreateWidget";
import { Mesh_buffer_create_text_info, Mesh_buffer_get_mesh_byidx, TEMP_PRINT_ACCUM, TEMP_PRINT_START, Widget_root_batch_get_all_roots_by_vertex_buffer, Widget_root_buffer_get, Widget_root_buffer_get_byidx } from "../../Core/MeshBuffer";
import { TimeIntervalsCreate, } from "../../Timers/TimeIntervals";
import { Dbg_ui_create } from "./DebugInfoUiFactory";
import { Program_create_text_info, Program_get_programs } from "../../../Graphics/ShaderPrograms.js";
import { BLUEL, GREEN, GREY, ORANGE_240_160_10, PURPLEB, PURPLER, REDL, WHITE, YELLOWL } from "../Material/Base/Colors.js";
import { NOTIFICATION_TYPE_IDX } from "./DebugInfoUiNotifications.js";
import { View_build_group_from_root_mesh, View_destroy_view, View_set_view_start_vb_index } from "../../Core/MeshBufferViews.js";
import { SCROLLER_TEMP_GET_POS, SCROLLER_TEMP_SET_SCROLLED_SECTION_XPOS } from "../Widgets/WidgetScroller.js";
import { Clipy_from_group } from "../Operations/Clip.js";


const _font_size = 10;
export function Debug_info_ui_performance(scene) {

   // Style generic for widgets.
   const tr = 1.5; // Transparency

   // Style for the Section widgets.
   const section_pad = [10, 8];
   const fontsize = _font_size;
   const dp_margin = [14, 12];

   // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
   const label_style = [0, 8.5, 5];
   const label_pad = [5, 4];
   const label_col = TRANSPARENCY(GREY[1], .6);
   const label_text_col = BLUEL[7];

   // Style for the switch widgets
   const switch_fontsize = 8;
   const switch_pad = [4, 3];
   const switch_col = TRANSPARENCY(BLUEL[7], .8);
   const switch_textcol = WHITE;

   const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Generic Ui Debug Info', [180, 40, 0], GREY[0], GREY[1], BLUEL[7], [18, 3], _, _, _, dp_margin);
   dp.CreateClickEvent();
   dp.CreateMoveEvent();
   Dropdown_roots_set_root(dp, dp);
   



   let zindex = dp.geom.pos[2];

   const section_col = GREY[3];

   /************************************************************************************************************************************************/
   // Performance timers
   const perf_timers_ui = Dbg_ui_create('Performane', dp, fontsize, Debug_info_create_ui_performance_timers, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex);
   dp.AddToMenu(perf_timers_ui);


   /************************************************************************************************************************************************/
   // Mouse Info
   const mouse_ui = Dbg_ui_create('Mouse', dp, fontsize, Debug_info_create_ui_mouse, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex);
   dp.AddToMenu(mouse_ui);


   /************************************************************************************************************************************************/
   // Gfx Info
   const gfx_ui = Dbg_ui_create('Gfx', dp, fontsize, Debug_info_create_gfx_info, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex);
   dp.AddToMenu(gfx_ui);


   /************************************************************************************************************************************************/
   // Mesh Info
   const mesh_ui = Dbg_ui_create('Mesh', dp, fontsize, Debug_info_create_mesh_info, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex);
   dp.AddToMenu(mesh_ui);


   /************************************************************************************************************************************************/
   // Batch Buffer Info
   const batch_ui = Dbg_ui_create('Batch', dp, fontsize, Debug_info_create_batch_info, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex);
   dp.AddToMenu(batch_ui);


   /************************************************************************************************************************************************/
   // Vertexbuffer 2D representation
   // const vb2D_ui = Dbg_ui_create('Vb2D', dp, fontsize, Debug_info_create_vertexbuffer_2D, section_col, label_col, label_text_col, switch_col, section_pad, label_pad, switch_pad, label_style, zindex);
   // dp.AddToMenu(vb2D_ui);



   dp.options = SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
   dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   
   dp.Calc_no_gfx_update();
   
   dp.Render();

   dp.ConstructListeners();


   // Create Group for this dropdown, to easily remove meshes from their vertex buffers and rebuild the vertex buffer
   View_build_group_from_root_mesh(dp);

   return dp;
}



/************************************************************************************************************************************************/
// Performance timers
/************************************************************************************************************************************************/

function Debug_info_create_ui_performance_timers() {


   if (DEBUG_INFO.UI_TIMERS.IS_ON) {

      const section = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_TIMERS.MESH_BUFFER_IDX);

      DEBUG_INFO.UI_TIMERS.POS = section.geom.pos; // Remember the info's position.
      section.Destroy();

      DEBUG_INFO.UI_TIMERS.MESH_BUFFER_IDX = INT_NULL;
      DEBUG_INFO.UI_TIMERS.IS_ON = false;
      return;
   }


   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], DEBUG_INFO.UI_TIMERS.POS, [0, 0], TRANSPARENCY(GREY[1], .8), 'ui performance timers panel');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-PerformanceTimers section');


   const fontsize = 7;
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
      const timer = Create_widget_multi_text(_, 'Main loop: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);

      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, pad2, .9);
      timer.SetDynamicText(`ms${ms} Mainloop avg`, ms, PerformanceTimersGetFps, _pt_loop.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.
      generic_time_interval = timer.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      // timer.SetDynamicText(`ms${ms} Mainloop avg`, ms, PerformanceTimersGetFps, _pt_loop.timer); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, pad2, .9);
      timer.SetDynamicText(`ms${ms} Mainloop 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_loop, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, pad2, .9);
      timer.SetDynamicText(`ms${ms} Mainloop best`, ms, PerformanceTimersGetBestFps, _pt_loop.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, pad2, .9);
      timer.SetDynamicText(`ms${ms} Mainloop worst`, ms, PerformanceTimersGetWorstFps, _pt_loop.timer, _, generic_time_interval)

   }
   { // All Timers Update timer
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Timers: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('0000000', fontsize, YELLOWL[7], pad2, .9);
      timer.SetDynamicText(`ms${ms} Timers avg`, ms, PerformanceTimersGetFps, _pt_all_timers.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOWL[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} Timers 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_all_timers, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOWL[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} Timers best`, ms, PerformanceTimersGetBestFps, _pt_all_timers.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, YELLOWL[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} Timers worst`, ms, PerformanceTimersGetWorstFps, _pt_all_timers.timer, _, generic_time_interval)

   }
   { // Scene Update timer
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Scene: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('0000000', fontsize, BLUEL[7], pad2, .9);
      timer.SetDynamicText(`ms${ms} Scene avg`, ms, PerformanceTimersGetFps, _pt_scene_update.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, BLUEL[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} Scene 1secReset`, ms, Performance_timers_get_avg_1sec_reset, _pt_scene_update, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, BLUEL[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} Scene best`, ms, PerformanceTimersGetBestFps, _pt_scene_update.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, BLUEL[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} Scene worst`, ms, PerformanceTimersGetWorstFps, _pt_scene_update.timer, _, generic_time_interval)

   }
   { // Gl_draw timer.
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Gl Draw: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('0000000', fontsize, GREEN[7], pad2, .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_gl_draw.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, GREEN[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_avg_1sec_reset, _pt_gl_draw, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, GREEN[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_gl_draw.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, GREEN[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_gl_draw.timer, _, generic_time_interval)

   }
   { // Batch Buffer
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Batch: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('00000000', fontsize, PURPLER[7], pad2, .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_batch_update.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_avg_1sec_reset, _pt_batch_update, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_batch_update.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_batch_update.timer, _, generic_time_interval)

   }
   { // Batch2 Buffer
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Batch2: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('00000000', fontsize, PURPLER[7], pad2, .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_batch2_update.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_avg_1sec_reset, _pt_batch2_update, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_batch2_update.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_batch2_update.timer, _, generic_time_interval)

   }
   { // Event Listener.
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Event Listener: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_event_listener.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_avg_1sec_reset, _pt_event_listener, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_event_listener.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_event_listener.timer, _, generic_time_interval)

   }
   { // Hover Listener.
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Hover Listener: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_hover_listener.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_avg_1sec_reset, _pt_hover_listener, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_hover_listener.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, ORANGE_240_160_10, [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_hover_listener.timer, _, generic_time_interval)

   }
   { // Framebuffer Rendering.
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'Framebuffer Rendering: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetFps`, ms, PerformanceTimersGetFps, _pt_framebuffer_rendering.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, Performance_timers_get_ms_1sec_reset, _pt_framebuffer_rendering, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetBestFps, _pt_framebuffer_rendering.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`DynText ${ms} Timer TimeGetDeltaAvg`, ms, PerformanceTimersGetWorstFps, _pt_framebuffer_rendering.timer, _, generic_time_interval)

   }
   { // Mesh info tip.
      ms = (g_ms) ? g_ms : 1000;
      const timer = Create_widget_multi_text(_, 'MeshInfo: | avg:', align, [0, 0, 0], fontsize, GREY[7], .5, pad1);
      section.AddItem(timer);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} MeshInfo avg`, ms, PerformanceTimersGetFps, _pt_mesh_info_tip.timer, _, generic_time_interval); // idx is for use in creating separate time intervals for each dynamic text.

      timer.CreateNewText('| avg_1sec:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} MeshInfo 1secReset`, ms, Performance_timers_get_ms_1sec_reset, _pt_mesh_info_tip, _, generic_time_interval)

      timer.CreateNewText('| best:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} MeshInfo best`, ms, PerformanceTimersGetBestFps, _pt_mesh_info_tip.timer, _, generic_time_interval)

      timer.CreateNewText('| worst:', fontsize, GREY[7], pad2, .9);
      timer.CreateNewText('0000000', fontsize, PURPLER[7], [0, 0], .9);
      timer.SetDynamicText(`ms${ms} MeshInfo worst`, ms, PerformanceTimersGetWorstFps, _pt_mesh_info_tip.timer, _, generic_time_interval)

   }


   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   section.ActivateAndChildren()
   section.Render()
   section.options = SECTION.VERTICAL;
   section.Calc();
   section.ConstructListeners();


   DEBUG_INFO.UI_TIMERS.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_TIMERS.IS_ON = true;

   // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, section);

}



/************************************************************************************************************************************************/
// Mouse Info
/************************************************************************************************************************************************/

function Debug_info_create_ui_mouse() {


   if (DEBUG_INFO.UI_MOUSE.IS_ON) {

      const section = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_MOUSE.MESH_BUFFER_IDX);

      Info_listener_destroy_event(section.debug_info.evtidx);
      DEBUG_INFO.UI_MOUSE.POS = section.geom.pos; // Remember the info's position.
      section.Destroy();

      DEBUG_INFO.UI_MOUSE.IS_ON = false;
      return;
   }

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [3, 3], DEBUG_INFO.UI_MOUSE.POS, [0, 0], TRANSPARENCY(GREY[1], .4), 'ui mouse info panel');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-Mouse section');


   const fontsize = _font_size;

   const infomesh = Create_widget_multi_text(_, 'Mouse |', ALIGN.HORIZONTAL, [0, 0, 0], fontsize, YELLOWL[7], .4);
   section.AddItem(infomesh);
   infomesh.CreateNewText('pos: x:0000, y:0000', fontsize, GREEN[7], [0, 0], .9);
   infomesh.CreateNewText('| area: x:0000, y:0000', fontsize, GREEN[7], [0, 0], .9);
   
   
   section.UNAMED |= GFX_POOL_REQUESTS.SMALLEST; // Assign so the gfx pool requests the smalest buffers
   section.UNAMED &= ~GFX_POOL_REQUESTS.ANY; // Disable the default.
   infomesh.UNAMED |= GFX_POOL_REQUESTS.SMALLEST; // Assign so the gfx pool requests the smalest buffers
   infomesh.UNAMED &= ~GFX_POOL_REQUESTS.ANY; // Disable the default.

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   section.ActivateAndChildren();
   section.Render()
   section.options |= SECTION.EXPAND | SECTION.INHERIT;
   section.Calc();
   section.ConstructListeners();

   DEBUG_INFO.UI_MOUSE.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_MOUSE.IS_ON = true;

   // Create an Info listener to update the mouse position ui text
   section.debug_info.evtidx = Info_listener_create_event(INFO_LISTEN_EVENT_TYPE.MOUSE, Debug_info_update_ui_mouse_pos, null, infomesh);

}



function Debug_info_update_ui_mouse_pos(params) {

   const evt_params = params.evt_params;
   const m = params.trigger_params.mouse;

   const mp = `pos: x:${m.pos.x}, y:${m.pos.y}`;
   const mpr = `area: x:${m.pos.x - m.click.up.x}, y:${m.pos.y - m.click.up.y}`;

   const mouse_pos_text = evt_params.children.buffer[0];
   mouse_pos_text.UpdateText(mp)
   const mouse_prev_text = evt_params.children.buffer[1];
   mouse_prev_text.UpdateText(mpr)

}



/************************************************************************************************************************************************/
// Gfx Info
/************************************************************************************************************************************************/

function Debug_info_create_gfx_info(params) {


   if (DEBUG_INFO.UI_GFX.IS_ON) {

      const dropdown = Mesh_buffer_get_mesh_byidx(DEBUG_INFO.UI_GFX.MESH_BUFFER_IDX);

      Info_listener_destroy_event(dropdown.debug_info.evtidx);
      // Set the pos relative to the dropdown button, because the dropdown has variable width and height based on the menuw opened.
      DEBUG_INFO.UI_GFX.POS = [
         dropdown.children.buffer[0].geom.pos[0],
         dropdown.children.buffer[0].geom.pos[1],
         dropdown.geom.pos[2],
      ];

      dropdown.Destroy();

      DEBUG_INFO.UI_GFX.MESH_BUFFER_IDX = INT_NULL; // reference to the scene's mesh buffer
      DEBUG_INFO.UI_GFX.IS_ON = false;

      return;
   }

   const tr = 1.15;
   const btnpad = [8, 3];

   const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `InfoUi Gfx DP`, DEBUG_INFO.UI_GFX.POS, GREY[1], TRANSPARENCY(GREEN[7], tr), WHITE, btnpad);
   // dp.StateEnable(MESH_STATE.ACTIVE);
   dp.CreateClickEvent();
   dp.CreateMoveEvent();
   Dropdown_roots_set_root(dp, dp);

   // Get the gfx programs buffer of which we want to create the info to.
   // const progs = Program_get_group(GFX_GROUPS.GetIdxByMask(GFX_GROUPS.DEFAULT.MASK));
   const progs = Program_get_programs();
   const count = progs.boundary;
   let j = 0;

   // Create all dropdowns for gfx programs
   for (let i = 0; i < count; i++) {

      const dp_pr = Create_widget_dropdown(_, `prog:${i} | Vb count:${progs.buffer[i].vertexBufferCount}`, [0, 0, 0], TRANSPARENCY(BLUEL[7], tr), TRANSPARENCY(PURPLEB[7], tr), WHITE, btnpad);
      dp_pr._gfxidx = i;
      dp.AddToMenu(dp_pr);

      // Create all dropdowns for gfx vertex buffers of current gfx program
      for (j = 0; j < progs.buffer[i].vertexBufferCount; j++) {

         const vb = progs.buffer[i].vb[j];
         const dp_vb = Create_widget_dropdown(_, `vb:${j} | count:${vb.count}`, [0, 0, 0], TRANSPARENCY(GREY[3], tr), TRANSPARENCY(GREY[2], tr), WHITE, btnpad);
         dp_vb._gfxidx = j;
         dp_vb.debug_info.data = { progidx: i, vbidx: j, };
         dp_pr.AddToMenu(dp_vb);

         // Create more info to display for the current vertex buffer
         Debug_info_gfx_create_more_info(dp_vb, vb);
      }

   }

   dp.sid.gfx_group = GFX_GROUPS.DEBUG.MASK;

   dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   dp.Render();
   dp.Calc();
   dp.ConstructListeners();


   // Create Group for this dropdown, to easily remove meshes from their vertex buffers and rebuild the vertex buffer(Mainly for activate/deactivate dropdowns)
   View_build_group_from_root_mesh(dp);


   DEBUG_INFO.UI_GFX.MESH_BUFFER_IDX = dp.mesh_bufferidx;
   DEBUG_INFO.UI_GFX.IS_ON = true;

   // Create an 'Info' listener to update the 'InfoUi Gfx DP', that is the info for the app's graphics buffers, 
   // with any new meshes added to gfx at run time or any new addition that is happening the the app's gfx buffers.
   dp.debug_info.evtidx = Info_listener_create_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_GFX, Debug_info_gfx_update, null, dp);

}



function Debug_info_gfx_update(params) {

   const tr = .7;

   // Trigger params is the mesh that have been inserted and to which we want to create info for.
   const progidx = params.trigger_params.progidx;
   const vbidx = params.trigger_params.vbidx;

   // Target params is the root mesh that will display the info of the newly added mesh. 
   const root = params.target_params;

   console.error('See file and line');
   alert('IMPLEMET ME. SEE console error')
   // Implement: How to avoid infinite loop by avoiding meshes of type DEBUG INFO
   // // 0. If the groupidx of the inserted mesh is the same with the groupidx of the UiGfxInfo dropdown, we want to skip(avoid infinite loop) 
   // if (root.gfx.prog.groupidx === groupidx) {
   //    if (DEBUG.INFO_UI) console.error('UiGfxInfo: Cannot add new entry that belongs to the same group as the UiGfxInfo dropdown.')
   //    return;
   // }

   let dp_prog = null;
   let dp_vb = null;


   // 1. We want to search in the dropdown all the programs info dropdowns if there is any prog dp for the progidx that was inserted. 
   let foundprogidx = INT_NULL;
   // Find if program dropdown exists
   for (let i = 0; i <= root.menu.children.boundary; i++) {
      const pr = root.menu.children.buffer[i];
      if (pr._gfxidx === undefined) console.error('Missing prog-gfxidx property for dropdown')
      if (pr._gfxidx === progidx) {
         foundprogidx = i;
         break;
      }
   }

   // 2. If no dp for displaying program ui was found, create new entry(new dropdown representing the progidx)
   // Find if dropdown for displaying vb exist
   let foundvbidx = INT_NULL;
   if (foundprogidx !== INT_NULL) {

      dp_prog = root.menu.children.buffer[foundprogidx];
      for (let i = 0; i <= dp_prog.menu.children.boundary; i++) {

         const vb = dp_prog.menu.children.buffer[i];
         /**DEBUG*/if (vb._gfxidx === undefined)
            console.error('Missing vb-gfxidx  property for dropdown')
         if (vb._gfxidx === vbidx) {
            foundvbidx = i;
            break;
         }
      }
   }

   if (!dp_prog) console.error('dropdown program not found')

   const vb = Vertex_buffer_info_get_by_vbidx(vbidx);
   if (foundvbidx !== INT_NULL) {

      if (dp_prog.isOn === DP_MENU_STATE.OFF) return;
      dp_vb = dp_prog.menu.children.buffer[foundvbidx];

      const sumbol = dp_vb.children.buffer[0].text_mesh.mat.text[0];
      const text = `${sumbol} vb:${vbidx} | count:${vb.count}`;
      dp_vb.SetText(text);
   }
   else { // Else no vertex buffer was found, so we create a new ui info dp for the new vertex buffer

      const parent = dp_prog;

      // Create vb dropdown. The spaces are to create enough space for large vb.count values.
      const new_dp_vb = Create_widget_dropdown(_, `vb:${vbidx} | count:${vb.count}    `, [0, 0, parent.geom.pos[2]], TRANSPARENCY(GREEN[7], tr), TRANSPARENCY(PURPLER[7], tr), WHITE, [8, 3]);
      new_dp_vb._gfxidx = vbidx;
      new_dp_vb.debug_info.data = { progidx: progidx, vbidx: vbidx, };
      parent.AddToMenu(new_dp_vb);

      Debug_info_gfx_create_more_info(new_dp_vb, vb)

      new_dp_vb.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC)
      new_dp_vb.DpActivate();

      // TODO: Must add new meshes to widget root buffer
      // Add_child_to_root_widget_buffer(parent.root_meshidx, new_dp_vb.mesh_bufferidx, new_dp_vb.GetName())

   }

}



function Debug_info_gfx_create_more_info(dp_vb, vb) {

   { // Create info text for the current vertex buffer ui
      const infomesh = Create_widget_multi_text(_, 'isPrivate:', ALIGN.HORIZONTAL, [0, 0, 0], _font_size, YELLOWL[7], .4);
      dp_vb.AddToMenu(infomesh);
      infomesh.CreateNewText(`${vb.isPrivate}`, _font_size, GREEN[7], [10, 10], .9);
   }

   { // Adding all vertex buffer's mesh names
      // const mesh_names_count = vb.meshesNames.length;
      // const dp_names = Create_widget_dropdown(`Meshes:${mesh_names_count}`,[0, 0, 0], [0,0], TRANSPARENCY(GREY2, .7), TRANSPARENCY(GREEN[7], .4), .4);
      // dp_vb.AddToMenu(dp_names);

      // const mesh_names = vb.meshesNames;
      // for(let i=0; i<mesh_names_count; i++){
      //    const name = Create_widget_text(_, `${mesh_names[i]}`, [0, 0, 0], _font_size, WHITE);
      //    dp_names.AddToMenu(GetName());
      // }
   }

   // TEST: Custom text to 'vb' param variable
   const str_buffer = [
      "jsdkjkqsjdkmsqm",
      "jsdkjkqsjdkmsqm",
      "jsdkjkqsjdkmsqm",
      "jsdkjkqsjdkmsqm",
      "jsdkjkqsjdkmsqm",
      "jsdkjkqsjdkmsqm",
      "jsdkjkqsjdkmsqm",
   ];


   { // Adding all vertex buffer's mesh names
      const mesh_names_count = str_buffer.length;
      const dp_names = Create_widget_dropdown(_, `Meshes:${mesh_names_count}`, [0, 0, 0], TRANSPARENCY(GREY[3], .5), TRANSPARENCY(GREY[4], .5), WHITE);
      dp_vb.AddToMenu(dp_names);

      const section = Create_widget_section(_, SECTION.VERTICAL, _, [0, 0, 8], [0, 0], TRANSPARENCY(REDL[7], .7), 'mesh names section for scroller');
      // const mesh_names = vb.meshesNames;
      const mesh_names = str_buffer;
      for (let i = 0; i < mesh_names_count; i++) {
         const name_mesh = Create_widget_text(_, `${mesh_names[i]}`, [0, 0, 0], _font_size, WHITE);
         section.AddItem(name_mesh);
      }

      const scroller = Create_widget_scroller(_, section, [250, 80], TRANSPARENCY(YELLOW, .3));
      scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      dp_names.AddToMenu(scroller);

      section.Calc(SECTION.INHERIT | SECTION.TOP_DOWN);

   }
}



/************************************************************************************************************************************************/
// Mesh Info
/************************************************************************************************************************************************/

const temp_btnpad = [10, 3];
function Debug_info_create_mesh_info(params) {

   const sceneidx = params.params;

   // Deactivate/Destroy/Close the DebugMeshInfoUi 
   if (DEBUG_INFO.UI_MESH.IS_ON) {

      const widget_root = Widget_root_buffer_get_byidx(DEBUG_INFO.UI_MESH.ROOT_IDX);
      const scroller = Mesh_buffer_get_mesh_byidx(widget_root.buffer[0]);

      Info_listener_destroy_event(scroller.debug_info.evtidx);
      // Remember the ui's position based on the dropdown which is responsible of setting the position of the scroller widget arround it..
      DEBUG_INFO.UI_MESH.POS = [
         scroller.geom.pos[0] + scroller.margin[0],
         scroller.geom.pos[1] - scroller.geom.dim[1],
         scroller.geom.pos[2],
      ];

      View_destroy_view(scroller.scrolled_section.group_bufferidxs);
      scroller.Destroy();


      DEBUG_INFO.UI_MESH.ROOT_IDX = INT_NULL;
      DEBUG_INFO.UI_MESH.IS_ON = false;

      return;
   }


   const tr = 1.45;

   const section = Create_widget_section(_, SECTION.VERTICAL, _, DEBUG_INFO.UI_MESH.POS, [0, 0], TRANSPARENCY(REDL[7], .7), 'MeshInfo DebugUi');

   const dp = Create_widget_dropdown(_, `InfoUi Mesh DP`, DEBUG_INFO.UI_MESH.POS, GREY[1], TRANSPARENCY(GREY[1], tr), WHITE, temp_btnpad);
   dp.StateEnable(MESH_STATE.ACTIVE);
   dp.CreateClickEvent();
   dp.CreateMoveEvent();
   Dropdown_roots_set_root(dp, dp);
   dp.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;

   section.AddItem(dp);


   // Create scroller for the ui-mesh info widget
   const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [0, 300]);
   scroller.StateEnable(MESH_STATE.ACTIVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   scroller.scrolled_section.options = SECTION.VERTICAL | SECTION.EXPAND | SECTION.INHERIT | SECTION.TOP_DOWN;
    

   // Create the dropdown structure representing all the applications's meshes
   const root_meshes_idxs = Widget_root_buffer_get();
   for (let i = 0; i <= root_meshes_idxs.boundary; i++) {
   
      const root = Mesh_buffer_get_mesh_byidx(root_meshes_idxs.buffer[i].buffer[0]);

      Debug_info_mesh_add_meshes_as_tree_struct(root, dp);

   }

   scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   scroller.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
   scroller.Calc_no_gfx_update();
   scroller.Render();
   scroller.ConstructListeners();


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
   const dp_mesh = Create_widget_dropdown(_, `${mesh.GetName()}`, [0, 0, 0], TRANSPARENCY(GREY[5], .5), TRANSPARENCY(GREY[1], .8), WHITE, temp_btnpad, _, _, _, [4, 4]);
   parent.AddToMenu(dp_mesh);

   const fontsize = 10;

   // Gather all info to a string buffr
   // const meshinfo = Mesh_info_builder(mesh);
   // if (mesh.parent) {
   //    const parentinfo = Mesh_info_builder(mesh.parent);
   //    meshinfo.push('Parent:');
   //    for (let i = 0; i < parentinfo.length; i++) {
   //       meshinfo.push(parentinfo[i]);
   //    }
   // }
   // else {
   //    meshinfo.push('parent:NULL');
   // }

   // // Create the text widget's from the info string buffer
   // for (let i = 0; i < meshinfo.length; i++) {
   //    const info = Create_widget_text(_, meshinfo[i], [0, 0, 0], fontsize);
   //    dp_mesh.AddToMenu(info);
   // }

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

         console.error('Menu is OFF:', root_info_dp.id, ' added_mesh_gfx', added_mesh_gfx)
         return;
      }

      const dp_mesh = Create_widget_dropdown(_, ` ${added_mesh_gfx.mesh.GetName()}`, [0, 0, 0], TRANSPARENCY(GREEN[7], .5), GREY[1], WHITE, [8, 3]);
      root_info_dp.AddToMenu(dp_mesh);

      const gfx_idxs = [root_info_dp.menu.gfx.prog.idx, root_info_dp.menu.gfx.vb.idx];
      dp_mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, gfx_idxs);
      dp_mesh.Render();
      root_info_dp.Calc();

   }
   else { // Parent must exist. Catch the error if
      console.error('---- PARENT EXISTS, IMPLEMENT ME!');
      alert('SEE CONSOLE ERROR')
   }
}



// Helper to build mesh info
function Mesh_info_builder(mesh) {
   return [
      `id:${mesh.id} | idx:${mesh.idx}`,
      `pos:${mesh.geom.pos} | dim:${mesh.geom.dim} | alpha:${mesh.mat.col[3]}`,
      'gfx:', `prog:${mesh.gfx.prog.idx} | vb:prog:${mesh.gfx.vb.idx}`
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

      // Info_listener_destroy_event(section.debug_info.evtidx);
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

   const section = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], DEBUG_INFO.UI_BATCH.POS, [0, 0], TRANSPARENCY(GREY[1], .5), 'ui batch info panel');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.SetName('InfoUi-Batch section');


   const info1 = Create_widget_text(_, `Batch store: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_STORE}0000`, [0, 0, 10], 10, ORANGE_240_160_10);
   const info2 = Create_widget_text(_, `Batch update: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_UPDATE}0000`, [0, 0, 10], 10, ORANGE_240_160_10);
   section.AddItem(info1);
   section.AddItem(info2);


   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   section.ActivateAndChildren();
   section.Render()
   section.options = SECTION.HORIZONTAL;
   section.Calc();
   section.ConstructListeners();


   // DEBUG_INFO.UI_BATCH.ROOT_IDX = section.root_bufferidx;
   DEBUG_INFO.UI_BATCH.MESH_BUFFER_IDX = section.mesh_bufferidx;
   DEBUG_INFO.UI_BATCH.IS_ON = true;

   const idx = TimeIntervalsCreate(64, 'Batch info ui', TIME_INTERVAL_REPEAT_ALWAYS, Debug_info_update_batch, { target_params: section });
   section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

}



function Debug_info_update_batch(params) {

   const evt_params = params.params.target_params;

   const info1 = evt_params.children.buffer[0];
   const info2 = evt_params.children.buffer[1];

   info1.UpdateText(`Batch store: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_STORE}`)
   info2.UpdateText(`Batch update: ${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_UPDATE}`)

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

   //    Info_listener_destroy_event(root.debug_info.evtidx);
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

   //    // for (let m = 0; m < meshes.length; m++) {
   //    for (let m = 0; cnt < count; m++) {

   //       // const mh_text = new Widget_Label(`mesh_text`, _, _, 8, _, WHITE);
   //       // section.AddItem(mh_text)
   //       const mh = Create_widget_section(_, SECTION.HORIZONTAL, [4, 4], [0, 0, 2], [10, 10], TRANSPARENCY(GREY[3], 1.), `mesh:`);
   //       mesh_section.AddItem(mh)

   //       for (let ff = 0; ff < meshes[m].num_faces && cnt < count; ff++) {

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





/************************************************************************************************************************************************/
// All Generic Info
/************************************************************************************************************************************************/

export function Debug_info_create_all_generic_info() {

   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.HORIZONTAL, [5, 5], [400,200,0], [100, 100], PURPLEB[1], 'All Generic Info');
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   
   const mb_info = Mesh_buffer_create_text_info();
   // section.AddItem(mb_info);
   
   // const vb_info = Vertex_buffer_create_text_info();
   // section.AddItem(vb_info);

   // const program_info = Program_create_text_info();
   // section.AddItem(program_info);


   // Create scroller for the ui-mesh info widget
   const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, mb_info, [0, 300]);
   scroller.StateEnable(MESH_STATE.ACTIVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   scroller.scrolled_section.options =  SECTION.VERTICAL  | SECTION.TOP_DOWN;
   scroller.SetTypeDebug();

   scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
   scroller.Calc_no_gfx_update();
   scroller.Render();
   scroller.ConstructListeners();

   View_build_group_from_root_mesh(scroller.scrolled_section);

}

export function TEMP_111111111111111111111111111() {

   const mb_info = Mesh_buffer_create_text_info();

   // Create scroller for the ui-mesh info widget
   const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, mb_info, [0, 200]);
   scroller.StateEnable(MESH_STATE.ACTIVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   scroller.scrolled_section.options =  SECTION.VERTICAL | SECTION.TOP_DOWN ;
   scroller.SetTypeDebug();

   scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
   scroller.Calc_no_gfx_update();
   
   View_build_group_from_root_mesh(scroller.scrolled_section);
   
   const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1];
   const clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1];
   Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);

   scroller.Render();

   View_set_view_start_vb_index(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);

   scroller.ConstructListeners();

}
export function TEMP_222222222222222222222222222() {
   
   const vb_info = Vertex_buffer_create_text_info();

   // Create scroller for the ui-mesh info widget
   const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, vb_info, [200, 200]);
   scroller.StateEnable(MESH_STATE.ACTIVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   scroller.scrolled_section.options =  SECTION.VERTICAL  | SECTION.TOP_DOWN;
   scroller.SetTypeDebug();

   scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
   scroller.Calc_no_gfx_update();
   scroller.Render();
   scroller.ConstructListeners();

   View_build_group_from_root_mesh(scroller.scrolled_section);
}
export function TEMP_333333333333333333333333333() {

   const program_info = Program_create_text_info();

   // Create scroller for the ui-mesh info widget
   const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, program_info, [500, 200]);
   scroller.StateEnable(MESH_STATE.ACTIVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   scroller.scrolled_section.options =  SECTION.VERTICAL  | SECTION.TOP_DOWN;
   scroller.SetTypeDebug();

   scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
   scroller.Calc_no_gfx_update();
   scroller.Render();
   scroller.ConstructListeners();

   View_build_group_from_root_mesh(scroller.scrolled_section);
}


export function Debug_info_update_clbk(params){

   
   const notification_type =  params.notification_type;
   const scroller = params.parent_section;

   TEMP_PRINT_ACCUM();
   TEMP_PRINT_START();
   
   
   if(notification_type === NOTIFICATION_TYPE_IDX.GFX_PROGRAM){ // Program Info Ui
      
      const updated_info = Program_create_text_info();
      scroller.AddItem(updated_info);
      scroller.scrolled_section =  updated_info;
      scroller.scrolled_section.options =  SECTION.VERTICAL  | SECTION.TOP_DOWN;
      
      updated_info.ConstructListeners();
      updated_info.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
      scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN;
      scroller.Recalc_no_batch_render();
      updated_info.Render();

      View_build_group_from_root_mesh(updated_info);
   }
   
   if(notification_type === NOTIFICATION_TYPE_IDX.GFX_VERTEX_BUFFER){ // Vertex buffer Info Ui
      
      const updated_info = Vertex_buffer_create_text_info();
      scroller.AddItem(updated_info);
      scroller.scrolled_section =  updated_info;
      scroller.scrolled_section.options =  SECTION.VERTICAL  | SECTION.TOP_DOWN;
      
      updated_info.ConstructListeners();
      updated_info.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
      scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN;
      scroller.Recalc_no_batch_render();
      updated_info.Render();

      View_build_group_from_root_mesh(updated_info);
   }
   
   if(notification_type === NOTIFICATION_TYPE_IDX.MESH_BUFFER){ // Vertex buffer Info Ui
      
      const updated_info = Mesh_buffer_create_text_info();
      updated_info.options =  SECTION.VERTICAL  | SECTION.TOP_DOWN | SECTION.INHERIT ;

      const posx = SCROLLER_TEMP_SET_SCROLLED_SECTION_XPOS(scroller);
      updated_info.geom.pos[0] = posx;
      

      scroller.AddItem(updated_info);
      scroller.scrolled_section =  updated_info;
      
      updated_info.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
      updated_info.Recalc_no_batch_render();
      
      // Set correct position according to scroller handle position
      const ydif = SCROLLER_TEMP_GET_POS(scroller, updated_info);
      updated_info.MoveYNoGfxUpdate(ydif)
      
      
      updated_info.Render();
      updated_info.ConstructListeners();

      View_build_group_from_root_mesh(updated_info);
   }
   
   // scroller.Recalc();
}