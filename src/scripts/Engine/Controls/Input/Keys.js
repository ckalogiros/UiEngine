"use strict";

import { PrintAttributes, PrintIndexBuffer, PrintVertexBufferDataAndNames } from "../../../Graphics/Debug/GfxDebug.js";
import { Listener_debug_print_all, Listener_debug_print_info } from "../../Events/EventListeners.js";
import { Renderqueue_get } from "../../Renderers/Renderer/RenderQueue.js";
import { Scenes_get_scene_by_idx } from "../../Scenes.js";
import { TimeIntervalsPrintAll } from "../../Timers/TimeIntervals.js";
import { Mesh_print_all_mesh_listeners } from "../../Drawables/Meshes/Base/Mesh.js";
import { FramebufferPrintBuffer, FramebufferPrintBufferAll } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Dropdown_roots_print_root_buffer } from "../../Drawables/Widgets/Widget_Dropdown.js";
import { Info_listener_print_buffer } from "../../Drawables/DebugInfo/InfoListeners.js";
import { Mesh_buffer_print, Mesh_buffer_print_loop, Widgetroot_buffer_print_w1, Widgetroot_gfx_print_w3, Widgetroot_gfx_print_loop_w2, Widget_root_batch_print_w4, Widget_group_buffer_print_w5, Widgetroot_buffer_print_w6, Gfx_buffer_print, Gfx_buffer_print_loop } from "../../Core/MeshBuffer.js";
import { Str_buffer_print } from "../../Core/StringBuffer.js";
import { Gl_vertex_buffer_print } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_index_buffer_print } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Gl_vertex_array_object_print } from "../../../Graphics/Buffers/VertexArrays.js";
import { Gl_program_print } from "../../../Graphics/ShaderPrograms.js";
import { Shader_attributes_print } from "../../../Graphics/ShaderAttributes.js";
import { Gfx_pool_print } from "../../Interfaces/Gfx/GfxPool.js";
import { View_buffer_print, View_buffer_print_loop } from "../../Core/MeshBufferViews.js";

_CNT = 0;
const em = _CNT++;
const p = _CNT++;
const x = _CNT++;
const X = _CNT++;
const c = _CNT++;
const C = _CNT++;
const z = _CNT++;
const r = _CNT++;
const R = _CNT++;
const f = _CNT++;
const F = _CNT++;
const i = _CNT++;
const b = _CNT++;
const ee = _CNT++;
const E = _CNT++;
const m = _CNT++;
const M = _CNT++;
const s3 = _CNT++;
const s4 = _CNT++;
const s8 = _CNT++;
const L = _CNT++;
const g = _CNT++;
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
const vs = _CNT++;
const gs = _CNT++;
const gw = _CNT++;
const g1 = _CNT++;
const g2 = _CNT++;
const g5 = _CNT++;
const g6 = _CNT++;
const p1 = _CNT++;

export const DEBUG_PRINT_KEYS = [

   { 
      key: 'em',
      discr: 'Mesh_print_all_mesh_listeners',
      func: (e)=>{
         console.log('------------------ Mesh_print_all_mesh_listeners ------------------')
         Mesh_print_all_mesh_listeners();
      },
   },
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
      key: 'x',
      discr: 'Gl_vertex_buffer_print',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------');
      },
   },
   {
      key: 'X',
      discr: 'PrintVertexBufferDataAndNames',
      func: (e)=>{
         console.log('------------------ PrintVertexBufferDataAndNames ------------------');
         PrintVertexBufferDataAndNames();
      },
   },
   {
      key: 'c',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------');
      },
   },
   {
      key: 'C',
      discr: 'PrintIndexBuffer',
      func: (e)=>{
         console.log('------------------ PrintIndexBuffer ------------------');
         PrintIndexBuffer();
      },
   },
   {
      key: 'z',
      discr: 'PrintAttributes',
      func: (e)=>{
         console.log('------------------ PrintAttributes ------------------');
         PrintAttributes();
      },
   },
   {
      key: 'r',
      discr: 'RenderQueue All',
      func: (e)=>{
         console.log('------------------ RenderQueue All ------------------');
         Renderqueue_get().PrintAll();
      },
   },
   {
      key: 'R',
      discr: 'RenderQueue Active',
      func: (e)=>{
         console.log('------------------ RenderQueue Active ------------------');
         Renderqueue_get().PrintActive();
      },
   },
   {
      key: 'f',
      discr: 'FramebufferPrintBuffer',
      func: (e)=>{
         console.log('------------------ FramebufferPrintBuffer ------------------');
         FramebufferPrintBuffer();
         // const fps = FpsGet();
         // console.log(`UNUSED: Used to be for Fps`)
      },
   },
   {
      key: 'F',
      discr: 'FramebufferPrintBuffer',
      func: (e)=>{
         console.log('------------------ FramebufferPrintBuffer ------------------');
         FramebufferPrintBufferAll();
         // const fps = FpsGet();
         // console.log(`UNUSED: Used to be for Fps`)
      },
   },
   {
      key: 'i',
      discr: 'TimeIntervalsPrintAll',
      func: (e)=>{
         console.log('------------------ TimeIntervalsPrintAll ------------------')
         TimeIntervalsPrintAll();
      },
   },
   {
      key: 'b',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------')
      },
   },
   {
      key: 'e',
      discr: 'Listener_debug_print_all',
      func: (e)=>{
         console.log('------------------ Listener_debug_print_all ------------------')
         Listener_debug_print_all();
      },
   },
   {
      key: 'E',
      discr: 'Listener_debug_print_info',
      func: (e)=>{
         console.log('------------------ Listener_debug_print_all ------------------')
         Listener_debug_print_info();

      },
   },
   {
      key: 'm',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------')
      },
   },
   {
      key: 'M',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------')
      },
   },
   {
      key: 's3',
      discr: 'Scene:PrintGfxStorageBuffer()',
      func: (e)=>{
         console.log('------------------ Scene:PrintGfxStorageBuffer ------------------');
         const scene = Scenes_get_scene_by_idx(STATE.scene.active_idx);
         scene.PrintGfxStorageBuffer();
      },
   },
   {
      key: 's4',
      discr: 'Scene:PrintRootMeshBuffer()',
      func: (e)=>{
         console.log('------------------ Scene:PrintRootMeshBuffer ------------------');
         const scene = Scenes_get_scene_by_idx(STATE.scene.active_idx);
         scene.PrintRootMeshBuffer();
      },
   },
   {
      key: 's8',
      discr: 'Str_buffer_print()',
      func: (e)=>{
         console.log('------------------ Str_buffer_print() ------------------');
         Str_buffer_print();
      },
   },
   {
      key: 'L',
      discr: 'NULL',
      func: (e)=>{
         console.log('------------------ UN-ASSIGNED ------------------');
         // Listener_hover_Print();
      },
   },
   {
      key: 'g',
      discr: 'Gfx_pool_print',
      func: (e)=>{
         console.log('------------------ Gfx_pool_print ------------------');
         Gfx_pool_print();
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
         console.log('------------------ Widget_group_buffer_print_w5() ------------------');
         Widget_group_buffer_print_w5();
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
      discr: 'Gfx_buffer_print',
      func: (e)=>{
         console.log('------------------ Gfx_buffer_print ------------------');
         Gfx_buffer_print()
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
      key: 'p1',
      discr: 'Gl_program_print',
      func: (e)=>{
         console.log('------------------ Gl_program_print() ------------------');
         Gl_program_print();
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
      
      if (_keys_buffer[0].key === 'e' && _keys_buffer[1].key === 'm') { 
         
         const idx = 'e'.charCodeAt(0) + 'm'.charCodeAt(0) - CHAR_ARRAY_LETTERS_START_OFFSET;
         DEBUG_PRINT_KEYS[em].func(e);  
      }
      else if  (_keys_buffer[len].key === 'M' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[M].func(e); 
      }
      else if  (_keys_buffer[len].key === 'S' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[S].func(e); 
      }
      else if  (_keys_buffer[len].key === 'L' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[L].func(e); 
      }
      else if  (_keys_buffer[len].key === 'R' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[R].func(e);  
      }
      else if  (_keys_buffer[len].key === 'X' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[X].func(e);  
      }
      else if  (_keys_buffer[len].key === 'C' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[C].func(e);  
      }
      else if  (_keys_buffer[len].key === 'E' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[E].func(e);  
      }
      else if  (_keys_buffer[len].key === 'F' && _keys_buffer[0].key === 'Shift') { 
         DEBUG_PRINT_KEYS[F].func(e);  
      }
      else if  (_keys_buffer[0].key === 's') { 

         if       (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[s3].func(e);  
         else if  (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[s4].func(e);  
         else if  (_keys_buffer[len].key === '8') DEBUG_PRINT_KEYS[s8].func(e);  
      }
      else if  (_keys_buffer[0].key === 'd' && _keys_buffer[1].key === 'p') { 
         DEBUG_PRINT_KEYS[dp].func(e);  
      }
      else if  (_keys_buffer[0].key === 'i' && _keys_buffer[1].key === 'l') { 
         DEBUG_PRINT_KEYS[il].func(e);  
      }
      else if  (_keys_buffer[0].key === 'm' && _keys_buffer[1].key === '1') { 
         DEBUG_PRINT_KEYS[m1].func(e);  
      }
      else if  (_keys_buffer[0].key === 'm' && _keys_buffer[1].key === '2') { 
         DEBUG_PRINT_KEYS[m2].func(e);  
      }
      // else if  (_keys_buffer[0].key === 'w' && _keys_buffer[1].key === '1') { 
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
         else if       (_keys_buffer[len].key === 's') DEBUG_PRINT_KEYS[vs].func(e);  
      }
      else if  (_keys_buffer[0].key === 'g') { 
         if       (_keys_buffer[len].key === 's') DEBUG_PRINT_KEYS[gs].func(e);  
         else if       (_keys_buffer[len].key === 'w') DEBUG_PRINT_KEYS[gw].func(e);  
         else if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[g1].func(e);  
         else if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[g2].func(e);  
         else if       (_keys_buffer[len].key === '5') DEBUG_PRINT_KEYS[g5].func(e);  
         else if       (_keys_buffer[len].key === '6') DEBUG_PRINT_KEYS[g6].func(e);  
      }
      else if  (_keys_buffer[0].key === 'p') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[p1].func(e);  
      }

   }
   else if(len === 0){

      if       (_keys_buffer[len].key === 'p') { DEBUG_PRINT_KEYS[p].func(e);  }
      else if  (_keys_buffer[len].key === 'x') { DEBUG_PRINT_KEYS[x].func(e);  }
      else if  (_keys_buffer[len].key === 'c') { DEBUG_PRINT_KEYS[c].func(e);  }
      else if  (_keys_buffer[len].key === 'z') { DEBUG_PRINT_KEYS[z].func(e);  }
      else if  (_keys_buffer[len].key === 'r') { DEBUG_PRINT_KEYS[r].func(e);  }
      else if  (_keys_buffer[len].key === 'f') { DEBUG_PRINT_KEYS[f].func(e);  }
      else if  (_keys_buffer[len].key === 'i') { DEBUG_PRINT_KEYS[i].func(e);  }
      else if  (_keys_buffer[len].key === 'b') { DEBUG_PRINT_KEYS[b].func(e);  }
      else if  (_keys_buffer[len].key === 'e') { DEBUG_PRINT_KEYS[ee].func(e);  }
      else if  (_keys_buffer[len].key === 'm') { DEBUG_PRINT_KEYS[m].func(e); }
      else if  (_keys_buffer[len].key === 'g') { DEBUG_PRINT_KEYS[g].func(e); }
   }

   // e.preventDefault();
   // console.log(_keys_buffer)
   _keys_buffer = [];

}