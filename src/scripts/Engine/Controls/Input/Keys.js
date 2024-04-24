"use strict";

import { Listener_debug_print_view_recursive, Listener_debug_print_storage_buffer, Listener_debug_print_view_storage_buffer } from "../../Events/EventListeners.js";
import { Renderqueue_get } from "../../Renderers/Renderer/RenderQueue.js";
import { TimeIntervalsPrintAll } from "../../Timers/TimeIntervals.js";
import { FramebufferPrintBuffer, FramebufferPrintBufferAll } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Dropdown_roots_print_root_buffer } from "../../Drawables/Widgets/Widget_Dropdown.js";
import { Info_listener_print_buffer } from "../../Drawables/DebugInfo/InfoListeners.js";
import { Mesh_buffer_print, Mesh_buffer_print_loop, Widgetroot_buffer_print_w1, Widgetroot_gfx_print_w3, Widgetroot_gfx_print_loop_w2, Widget_root_batch_print_w4, Widgetroot_buffer_print_w6, Mesh_per_vb_print, Gfx_buffer_print_loop } from "../../Core/MeshBuffer.js";
import { Str_buffer_print, Str_buffer_mesh_names_print, Str_buffer_mesh_names_print_loop, Str_buffer_print_loop } from "../../Core/StringBuffer.js";
import { Gl_vertex_buffer_print } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_index_buffer_print } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Gl_vertex_array_object_print } from "../../../Graphics/Buffers/VertexArrays.js";
import { Gl_program_print } from "../../../Graphics/ShaderPrograms.js";
import { Shader_attributes_print } from "../../../Graphics/ShaderAttributes.js";
import { View_buffer_print, View_buffer_print_loop } from "../../Core/MeshBufferViews.js";
import { Styles_hover_margin_print, Styles_hover_margin_print_loop, Styles_margin_print, Styles_margin_print_loop, Styles_pad_buffer_print, Styles_pad_buffer_print_loop } from "../../Styles.js";
import { TEMP_dbg_info_ui_print_entries_table, TEMP_mesh_buffer_info_ui_print_entries_table } from "../../Drawables/DebugInfo/DebugInfoUi.js";
import { DEBUG_INFO_BUFFERS_PRINT, DEBUG_INFO_BUFFERS_PRINT2 } from "../../Core/Buffers.js";

_CNT = 0;
const p = _CNT++;
const a1 = _CNT++;
const a2 = _CNT++;
const r1 = _CNT++;
const r2 = _CNT++;
const f1 = _CNT++;
const f2 = _CNT++;
const i1 = _CNT++;
const l1 = _CNT++;
const l2 = _CNT++;
const l3 = _CNT++;
const s1 = _CNT++;
const s2 = _CNT++;
const s3 = _CNT++;
const s4 = _CNT++;
const dp = _CNT++;
const il = _CNT++;
const m1 = _CNT++;
const m2 = _CNT++;
const w1 = _CNT++;
const w2 = _CNT++;
const w3 = _CNT++;
const w4 = _CNT++;
const w5 = _CNT++;
const w6 = _CNT++;
const va = _CNT++;
const vb = _CNT++;
const vi = _CNT++;
const vp = _CNT++;
const vs = _CNT++;
const gs = _CNT++;
const gw = _CNT++;
const g1 = _CNT++;
const g2 = _CNT++;
const g3 = _CNT++;
const g4 = _CNT++;
const g5 = _CNT++;
const g6 = _CNT++;
const t1 = _CNT++;
const t2 = _CNT++;
const t3 = _CNT++;
const t4 = _CNT++;
const t5 = _CNT++;
const t6 = _CNT++;
const y1 = _CNT++;
const y2 = _CNT++;


export const DEBUG_PRINT_KEYS = [


   {
      key: 'p',
      discr: 'PAUSE APP',
      func: (e)=>{
         console.log('------------------ PAUSE APP ------------------');
         if(STATE.loop.paused) STATE.loop.paused = false
         else STATE.loop.paused = true
      },
   },
   {
      key: 'a1',
      discr: 'DEBUG_INFO_BUFFERS_PRINT()',
      func: (e)=>{
         console.log('------------------ DEBUG_INFO_BUFFERS_PRINT() ------------------');
         DEBUG_INFO_BUFFERS_PRINT();
      },
   },
   {
      key: 'a2',
      discr: 'DEBUG_INFO_BUFFERS_PRINT2()',
      func: (e)=>{
         console.log('------------------ DEBUG_INFO_BUFFERS_PRINT2() ------------------');
         DEBUG_INFO_BUFFERS_PRINT2();
      },
   },
   {
      key: 'r1',
      discr: 'RenderQueue All',
      func: (e)=>{
         console.log('------------------ RenderQueue All ------------------');
         Renderqueue_get().PrintAll();
      },
   },
   {
      key: 'r2',
      discr: 'RenderQueue Active',
      func: (e)=>{
         console.log('------------------ RenderQueue Active ------------------');
         Renderqueue_get().PrintActive();
      },
   },
   {
      key: 'f1',
      discr: 'FramebufferPrintBuffer',
      func: (e)=>{
         console.log('------------------ FramebufferPrintBuffer ------------------');
         FramebufferPrintBuffer();
      },
   },
   {
      key: 'f2',
      discr: 'FramebufferPrintBuffer',
      func: (e)=>{
         console.log('------------------ FramebufferPrintBuffer ------------------');
         FramebufferPrintBufferAll();
      },
   },
   {
      key: 'i1',
      discr: 'TimeIntervalsPrintAll',
      func: (e)=>{
         console.log('------------------ TimeIntervalsPrintAll ------------------')
         TimeIntervalsPrintAll();
      },
   },
   {
      key: 'l1',
      discr: 'Listener_debug_print_storage_buffer',
      func: (e)=>{
         console.log('------------------ Listener_debug_print_storage_buffer ------------------')
         Listener_debug_print_storage_buffer();

      },
   },
   {
      key: 'l2',
      discr: 'Listener_debug_print_view_storage_buffer',
      func: (e)=>{
         console.log('------------------ Listener_debug_print_view_storage_buffer ------------------')
         Listener_debug_print_view_storage_buffer();

      },
   },
   {
      key: 'l3',
      discr: 'Listener_debug_print_view_recursive',
      func: (e)=>{
         console.log('------------------ Listener_debug_print_view_recursive ------------------')
         Listener_debug_print_view_recursive();

      },
   },
   {
      key: 's1',
      discr: 'Str_buffer_print()',
      func: (e)=>{
         console.log('------------------ Str_buffer_print() ------------------');
         Str_buffer_print();
      },
   },
   {
      key: 's2',
      discr: 'Str_buffer_print_loop()',
      func: (e)=>{
         console.log('------------------ Str_buffer_print_loop() ------------------');
         Str_buffer_print_loop();
      },
   },
   {
      key: 's3',
      discr: 'Str_buffer_mesh_names_print()',
      func: (e)=>{
         console.log('------------------ Str_buffer_mesh_names_print() ------------------');
         Str_buffer_mesh_names_print();
      },
   },
   {
      key: 's4',
      discr: 'Str_buffer_mesh_names_print_loop()',
      func: (e)=>{
         console.log('------------------ Str_buffer_mesh_names_print_loop() ------------------');
         Str_buffer_mesh_names_print_loop();
      },
   },
   {
      key: 'dp',
      discr: 'Dropdown_roots_print_root_buffer',
      func: (e)=>{
         console.log('------------------ Dropdown_roots_print_root_buffer ------------------');
         Dropdown_roots_print_root_buffer();
      },
   },
   {
      key: 'il',
      discr: 'Info_listener_print_buffer',
      func: (e)=>{
         console.log('------------------ Info_listener_print_buffer() ------------------');
         Info_listener_print_buffer();
      },
   },
   {
      key: 'm1',
      discr: 'Mesh_buffer_print',
      func: (e)=>{
         console.log('------------------ Mesh_buffer_print() ------------------');
         Mesh_buffer_print();
      },
   },
   {
      key: 'm2',
      discr: 'Mesh_buffer_print_loop',
      func: (e)=>{
         console.log('------------------ Mesh_buffer_print_loop() ------------------');
         Mesh_buffer_print_loop();
      },
   },
   {
      key: 'w1',
      discr: 'Widgetroot_buffer_print_w1',
      func: (e)=>{
         console.log('------------------ Widgetroot_buffer_print_w1() ------------------');
         Widgetroot_buffer_print_w1();
      },
   },
   {
      key: 'w2',
      discr: 'Widgetroot_gfx_print_loop_w2',
      func: (e)=>{
         console.log('------------------ Widgetroot_gfx_print_loop_w2() ------------------');
         Widgetroot_gfx_print_loop_w2();
      },
   },
   {
      key: 'w3',
      discr: 'Widgetroot_gfx_print_w3',
      func: (e)=>{
         console.log('------------------ Widgetroot_gfx_print_w3() ------------------');
         Widgetroot_gfx_print_w3();
      },
   },
   {
      key: 'w4',
      discr: 'Widget_root_batch_print_w4',
      func: (e)=>{
         console.log('------------------ Widget_root_batch_print_w4() ------------------');
         Widget_root_batch_print_w4();
      },
   },
   {
      key: 'w5',
      discr: 'Widget_group_buffer_print_w5',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------');
         // Widget_group_buffer_print_w5();
      },
   },
   {
      key: 'w6',
      discr: 'Widgetroot_buffer_print_w6',
      func: (e)=>{
         console.log('------------------ Widgetroot_buffer_print_w6() ------------------');
         Widgetroot_buffer_print_w6();
      },
   },
   {
      key: 'va',
      discr: 'Gl_vertex_array_object_print',
      func: (e)=>{
         console.log('------------------ Gl_vertex_array_object_print() ------------------');
         Gl_vertex_array_object_print();
      },
   },
   {
      key: 'vb',
      discr: 'Gl_vertex_buffer_print',
      func: (e)=>{
         console.log('------------------ Gl_vertex_buffer_print() ------------------');
         Gl_vertex_buffer_print();
      },
   },
   {
      key: 'vi',
      discr: 'Gl_index_buffer_print',
      func: (e)=>{
         console.log('------------------ Gl_index_buffer_print() ------------------');
         Gl_index_buffer_print();
      },
   },
   {
      key: 'vp',
      discr: 'Gl_program_print',
      func: (e)=>{
         console.log('------------------ Gl_program_print() ------------------');
         Gl_program_print();
      },
   },
   {
      key: 'vs',
      discr: 'Shader_attributes_print',
      func: (e)=>{
         console.log('------------------ Shader_attributes_print() ------------------');
         Shader_attributes_print();
      },
   },
   {
      key: 'gs',
      discr: 'STATE',
      func: (e)=>{
         console.log('------------------ STATE ------------------');
         console.log('STATE.mesh:', STATE.mesh)
      },
   },
   {
      key: 'gw',
      discr: 'GL STATE',
      func: (e)=>{
         console.log('------------------ GL STATE ------------------');
         console.log('GL STATE:', GL)
      },
   },
   {
      key: 'g1',
      discr: 'Mesh_per_vb_print',
      func: (e)=>{
         console.log('------------------ Mesh_per_vb_print ------------------');
         Mesh_per_vb_print()
      },
   },
   {
      key: 'g2',
      discr: 'Gfx_buffer_print_loop',
      func: (e)=>{
         console.log('------------------ Gfx_buffer_print_loop ------------------');
         Gfx_buffer_print_loop()
      },
   },
   {
      key: 'g3',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------');
         Mesh_per_vb_print()
      },
   },
   {
      key: 'g4',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------');

      },
   },
   {
      key: 'g5',
      discr: 'View_buffer_print',
      func: (e)=>{
         console.log('------------------ View_buffer_print ------------------');
         View_buffer_print()
      },
   },
   {
      key: 'g6',
      discr: 'View_buffer_print_loop',
      func: (e)=>{
         console.log('------------------ View_buffer_print_loop ------------------');
         View_buffer_print_loop()
      },
   },
   {
      key: 't1',
      discr: 'Styles_margin_print()',
      func: (e)=>{
         console.log('------------------ Styles_margin_print() ------------------');
         Styles_margin_print();
      },
   },
   {
      key: 't2',
      discr: 'Styles_margin_print_loop()',
      func: (e)=>{
         console.log('------------------ Styles_margin_print_loop() ------------------');
         Styles_margin_print_loop();
      },
   },
   {
      key: 't3',
      discr: 'Styles_hover_margin_print()',
      func: (e)=>{
         console.log('------------------ Styles_hover_margin_print() ------------------');
         Styles_hover_margin_print();
      },
   },
   {
      key: 't4',
      discr: 'Styles_hover_margin_printt_loop()',
      func: (e)=>{
         console.log('------------------ Styles_hover_margin_printt_loop() ------------------');
         Styles_hover_margin_print_loop();
      },
   },
   {
      key: 't5',
      discr: 'Styles_pad_buffer_print()',
      func: (e)=>{
         console.log('------------------ Styles_pad_buffer_print() ------------------');
         Styles_pad_buffer_print();
      },
   },
   {
      key: 't6',
      discr: 'Styles_pad_buffer_print_loop()',
      func: (e)=>{
         console.log('------------------ Styles_pad_buffer_print_loop() ------------------');
         Styles_pad_buffer_print_loop();
      },
   },
   {
      key: 'y1',
      discr: 'TEMP_dbg_info_ui_print_entries_table()',
      func: (e)=>{
         console.log('------------------ TEMP_dbg_info_ui_print_entries_table() ------------------');
         TEMP_dbg_info_ui_print_entries_table();
      },
   },
   {
      key: 'y2',
      discr: 'TEMP_mesh_buffer_info_ui_print_entries_table()',
      func: (e)=>{
         console.log('------------------ TEMP_mesh_buffer_info_ui_print_entries_table() ------------------');
         TEMP_mesh_buffer_info_ui_print_entries_table();
      },
   },



];


let _keys_buffer = [];

console.log(DEBUG_PRINT_KEYS)
export function OnKeyDown(e){

   e.stopPropagation();

   if(!e.repeat){

      _keys_buffer.push({
         key: e.key,
         ctrl:e.ctrlKey,
         shift:e.shiftKey,
         alt:e.altKey,
      })
   }
}
export function OnKeyUp(e){
   
   e.stopPropagation();

   const len = _keys_buffer.length-1;

   if(len === 1){
      
      if  (_keys_buffer[0].key === 'r') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[r1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[r2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'a') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[a1].func(e);  
         if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[a2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'f') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[f1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[f2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'i') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[i1].func(e);  
         // else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[i2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'l') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[l1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[l2].func(e);  
         else if  (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[l3].func(e);  
      }
      else if  (_keys_buffer[0].key === 's') { 
         
         if  (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[s6].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[s7].func(e);  
         else if  (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[s8].func(e);  
         else if  (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[s9].func(e);  
      }
      else if  (_keys_buffer[0].key === 'm') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[m1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[m2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'd' && _keys_buffer[1].key === 'p') { 
         DEBUG_PRINT_KEYS[dp].func(e);  
      }
      else if  (_keys_buffer[0].key === 'i' && _keys_buffer[1].key === 'l') { 
         DEBUG_PRINT_KEYS[il].func(e);  
      }
      else if  (_keys_buffer[0].key === 'w') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[w1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[w2].func(e);  
         else if  (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[w3].func(e);  
         else if  (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[w4].func(e);  
         else if  (_keys_buffer[len].key === '5') DEBUG_PRINT_KEYS[w5].func(e);  
         else if  (_keys_buffer[len].key === '6') DEBUG_PRINT_KEYS[w6].func(e);  
      }
      else if  (_keys_buffer[0].key === 'v') { 
         if       (_keys_buffer[len].key === 'a') DEBUG_PRINT_KEYS[va].func(e);  
         else if       (_keys_buffer[len].key === 'b') DEBUG_PRINT_KEYS[vb].func(e);  
         else if       (_keys_buffer[len].key === 'i') DEBUG_PRINT_KEYS[vi].func(e);  
         else if       (_keys_buffer[len].key === 'p') DEBUG_PRINT_KEYS[vp].func(e);  
         else if       (_keys_buffer[len].key === 's') DEBUG_PRINT_KEYS[vs].func(e);  
      }
      else if  (_keys_buffer[0].key === 't') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[t1].func(e);  
         else if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[t2].func(e);  
         else if       (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[t3].func(e);  
         else if       (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[t4].func(e);  
         else if       (_keys_buffer[len].key === '5') DEBUG_PRINT_KEYS[t5].func(e);  
         else if       (_keys_buffer[len].key === '6') DEBUG_PRINT_KEYS[t6].func(e);  
      }
      else if  (_keys_buffer[0].key === 'g') { 
         if       (_keys_buffer[len].key === 's') DEBUG_PRINT_KEYS[gs].func(e);  
         else if       (_keys_buffer[len].key === 'w') DEBUG_PRINT_KEYS[gw].func(e);  
         else if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[g1].func(e);  
         else if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[g2].func(e);  
         else if       (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[g2].func(e);  
         else if       (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[g2].func(e);  
         else if       (_keys_buffer[len].key === '5') DEBUG_PRINT_KEYS[g5].func(e);  
         else if       (_keys_buffer[len].key === '6') DEBUG_PRINT_KEYS[g6].func(e);  
      }
      else if  (_keys_buffer[0].key === 'y') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[y1].func(e);  
         if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[y2].func(e);  
      }


   }
   else if(len === 0){

      if       (_keys_buffer[len].key === 'p') { DEBUG_PRINT_KEYS[p].func(e); }
      else if  (_keys_buffer[len].key === 'a') { console.log('@ Buffers Allocations', `\n  1:${DEBUG_PRINT_KEYS[a1].discr}, 2:${DEBUG_PRINT_KEYS[a2].discr}`); }
      else if  (_keys_buffer[len].key === 'r') { console.log('@ Render Queue', `\n  1:${DEBUG_PRINT_KEYS[r1].discr}, 2:${DEBUG_PRINT_KEYS[r2].discr}`); }
      else if  (_keys_buffer[len].key === 'f') { console.log('@ Frame Buuffer', `\n  1:${DEBUG_PRINT_KEYS[f1].discr}, 2:${DEBUG_PRINT_KEYS[f2].discr}`);  }
      else if  (_keys_buffer[len].key === 'i') { console.log('@ Time Intervals Queue', `\n  1:${DEBUG_PRINT_KEYS[i1].discr}`); }
      else if  (_keys_buffer[len].key === 'l') { console.log('@ Event Listeners', `\n  1:${DEBUG_PRINT_KEYS[l1].discr}\n  2:${DEBUG_PRINT_KEYS[l2].discr}\n  3:${DEBUG_PRINT_KEYS[l3].discr}`); }
      else if  (_keys_buffer[len].key === 's') { console.log('@ String Buffer', `\n  1:${DEBUG_PRINT_KEYS[s1].discr}\n  2:${DEBUG_PRINT_KEYS[s2].discr}\n  3:${DEBUG_PRINT_KEYS[s3].discr}\n  4:${DEBUG_PRINT_KEYS[s4].discr}`); }
      else if  (_keys_buffer[len].key === 'w') { console.log('@ Widget Root', `\n  1:${DEBUG_PRINT_KEYS[w1].discr}\n  2:${DEBUG_PRINT_KEYS[w2].discr}\n  3:${DEBUG_PRINT_KEYS[w3].discr}\n  4:${DEBUG_PRINT_KEYS[w4].discr}\n  5:${DEBUG_PRINT_KEYS[w5].discr}\n  6:${DEBUG_PRINT_KEYS[w6].discr}`); }
      else if  (_keys_buffer[len].key === 't') { console.log('@ Styles', `\n  1:${DEBUG_PRINT_KEYS[t1].discr}\n  2:${DEBUG_PRINT_KEYS[t2].discr}\n  3:${DEBUG_PRINT_KEYS[t3].discr}\n  4:${DEBUG_PRINT_KEYS[t4].discr}\n  5:${DEBUG_PRINT_KEYS[t5].discr}\n  6:${DEBUG_PRINT_KEYS[t6].discr}`); }
      else if  (_keys_buffer[len].key === 'v') { console.log('@ GL', `\n  a:${DEBUG_PRINT_KEYS[va].discr}\n  b:${DEBUG_PRINT_KEYS[vb].discr}\n  i:${DEBUG_PRINT_KEYS[vi].discr}\n  p:${DEBUG_PRINT_KEYS[vp].discr}\n  s:${DEBUG_PRINT_KEYS[vs].discr}`); }
      else if  (_keys_buffer[len].key === 'g') { console.log('@ +++', `\n  s:${DEBUG_PRINT_KEYS[gs].discr}\n  w:${DEBUG_PRINT_KEYS[gw].discr}\n  1:${DEBUG_PRINT_KEYS[g1].discr}\n  2:${DEBUG_PRINT_KEYS[g2].discr}\n  3:${DEBUG_PRINT_KEYS[g3].discr}\n  4:${DEBUG_PRINT_KEYS[g4].discr}\n  5:${DEBUG_PRINT_KEYS[g5].discr}\n  6:${DEBUG_PRINT_KEYS[g6].discr}`); }
      else if  (_keys_buffer[len].key === 'm') { console.log('@ Mesh Buffer', `\n  1:${DEBUG_PRINT_KEYS[m1].discr}, 2:${DEBUG_PRINT_KEYS[m2].discr}`); }
      else if  (_keys_buffer[len].key === 'y') { console.log('@ Debuug ui entries table', `\n  1:${DEBUG_PRINT_KEYS[y1].discr}\n  2:${DEBUG_PRINT_KEYS[y2].discr}`); }
   }

   // e.preventDefault();
   // console.log(_keys_buffer)
   _keys_buffer = [];

}