"use strict";

import { Listener_debug_print_view_recursive, Listener_debug_print_storage_buffer, Listener_debug_print_view_storage_buffer } from "../../Events/EventListeners.js";
import { Renderqueue_print_active, Renderqueue_print_all } from "../../Renderers/Renderer/RenderQueue.js";
import { Time_intervals_print } from "../../Timers/TimeIntervals.js";
import { FramebufferPrintBuffer, FramebufferPrintBufferAll } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Dropdown_roots_print_root_buffer } from "../../Drawables/Widgets/Widget_Dropdown.js";
import { Mesh_buffer_print, Mesh_buffer_print_loop, Mesh_per_vb_print, Mesh_per_vb_print_loop } from "../../Core/MeshBuffer.js";
import { Str_buffer_print, Str_buffer_mesh_names_print, Str_buffer_mesh_names_print_loop, Str_buffer_print_loop } from "../../Core/StringBuffer.js";
import { Vertex_buffer_print } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_index_buffer_print } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Gl_vertex_array_object_print } from "../../../Graphics/Buffers/VertexArrays.js";
import { Gl_program_print } from "../../../Graphics/ShaderPrograms.js";
import { Shader_attributes_print } from "../../../Graphics/ShaderAttributes.js";
import { View_buffer_print, View_buffer_print_loop } from "../../Core/Views/MeshBufferViews.js";
import { Styles_hover_margin_print, Styles_hover_margin_print_loop, Styles_margin_print, Styles_margin_print_loop, Styles_pad_buffer_print, Styles_pad_buffer_print_loop } from "../../Styles.js";
import { Dbg_info_ui_print_entries_table, TEMP_mesh_buffer_info_ui_print_entries_table } from "../../Drawables/DebugInfo/DebugInfoUi.js";
import { DEBUG_INFO_BUFFERS_PRINT, DEBUG_INFO_BUFFERS_PRINT2 } from "../../Core/Buffers.js";
import { Uniforms_buffer_block_print, Uniforms_buffer_print } from "../../../Graphics/Buffers/UniformBuffers.js";
import { Mesh_animations_print } from "../../Animations/MeshAnimations.js";
import { Root_uniforms_for_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Callback_animations_print } from "../../Animations/CallbackAnimations.js";
import { Particle_system_print_info } from "../../ParticlesSystem/ParticlesSystem.js";
import { Notifications_print, Notifications_print_loop } from "../../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Texture_buffer_print } from "../../Loaders/Textures/Texture.js";
import { Widget_root_per_vb_meshidx_print_w4, Root_group_buffer_print_w1, Root_group_buffer_print_w6, Root_group_vbidx_buffer_print_loop_w2, Root_group_vbidx_buffer_print_w3 } from "../../Core/Views/RootView.js";
import { Shaders_print_loop } from "../../../Graphics/GlShaders.js";
import { Arkanois_print_scrore_mod } from "../../../App/Demo/Games/Arkanoid/ScoreMod.js";
import { Uvmaps_print } from "../../Loaders/Textures/TextureUvMap.js";
import { Vertex_buffer_render_group_print_loop } from "../../../Graphics/Buffers/RenderGroups.js";

_CNT = 0;
const p = _CNT++;
const a1 = _CNT++;
const a2 = _CNT++;
const a3 = _CNT++;
const a4 = _CNT++;
const r1 = _CNT++;
const r2 = _CNT++;
const f1 = _CNT++;
const f2 = _CNT++;
const f3 = _CNT++;
const i1 = _CNT++;
const l1 = _CNT++;
const l2 = _CNT++;
const l3 = _CNT++;
const s1 = _CNT++;
const s2 = _CNT++;
const s3 = _CNT++;
const s4 = _CNT++;
const dp = _CNT++;
const m1 = _CNT++;
const m2 = _CNT++;
const w1 = _CNT++;
const w2 = _CNT++;
const w3 = _CNT++;
const w4 = _CNT++;
const w5 = _CNT++;
const w6 = _CNT++;
const w7 = _CNT++;
const va = _CNT++;
const vb = _CNT++;
const vr = _CNT++;
const vi = _CNT++;
const vp = _CNT++;
const vs = _CNT++;
const v1 = _CNT++;
const gs = _CNT++;
const gw = _CNT++;
const gd = _CNT++;
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
const t7 = _CNT++;
const y1 = _CNT++;
const y2 = _CNT++;
const u1 = _CNT++;
const u2 = _CNT++;
const e1 = _CNT++;
const n1 = _CNT++;
const n2 = _CNT++;

const q1 = _CNT++;
const q2 = _CNT++;
const q3 = _CNT++;
const q4 = _CNT++;
const q5 = _CNT++;
const q6 = _CNT++;
const q7 = _CNT++;
const q8 = _CNT++;
const q9 = _CNT++;


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
      key: 'a3',
      discr: 'Mesh_animations_print()',
      func: (e)=>{
         console.log('------------------ Mesh_animations_print() ------------------');
         Mesh_animations_print();
      },
   },
   {
      key: 'a4',
      discr: 'Callback_animations_print()',
      func: (e)=>{
         console.log('------------------ Callback_animations_print() ------------------');
         Callback_animations_print();
      },
   },
   {
      key: 'r1',
      discr: 'Renderqueue_print_all',
      func: (e)=>{
         console.log('------------------ Renderqueue_print_all ------------------');
         Renderqueue_print_all();
      },
   },
   {
      key: 'r2',
      discr: 'Renderqueue_print_active',
      func: (e)=>{
         console.log('------------------ Renderqueue_print_active ------------------');
         Renderqueue_print_active();
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
      key: 'f3',
      discr: 'Uvmaps_print',
      func: (e)=>{
         console.log('------------------ Uvmaps_print ------------------');
         Uvmaps_print();
      },
   },
   {
      key: 'i1',
      discr: 'Time_intervals_print',
      func: (e)=>{
         console.log('------------------ Time_intervals_print ------------------')
         Time_intervals_print();
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
      discr: 'Root_group_buffer_print_w1',
      func: (e)=>{
         console.log('------------------ Root_group_buffer_print_w1() ------------------');
         Root_group_buffer_print_w1();
      },
   },
   {
      key: 'w2',
      discr: 'Root_group_vbidx_buffer_print_loop_w2',
      func: (e)=>{
         console.log('------------------ Root_group_vbidx_buffer_print_loop_w2() ------------------');
         Root_group_vbidx_buffer_print_loop_w2();
      },
   },
   {
      key: 'w3',
      discr: 'Root_group_vbidx_buffer_print_w3',
      func: (e)=>{
         console.log('------------------ Root_group_vbidx_buffer_print_w3() ------------------');
         Root_group_vbidx_buffer_print_w3();
      },
   },
   {
      key: 'w4',
      discr: 'Widget_root_per_vb_meshidx_print_w4',
      func: (e)=>{
         console.log('------------------ Widget_root_per_vb_meshidx_print_w4() ------------------');
         Widget_root_per_vb_meshidx_print_w4();
      },
   },
   {
      key: 'w5',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY ------------------');
      },
   },
   {
      key: 'w6',
      discr: 'Root_group_buffer_print_w6',
      func: (e)=>{
         console.log('------------------ Root_group_buffer_print_w6() ------------------');
         Root_group_buffer_print_w6();
      },
   },
   {
      key: 'w7',
      discr: 'Root_uniforms_for_wpos',
      func: (e)=>{
         console.log('------------------ Root_uniforms_for_wpos() ------------------');
         Root_uniforms_for_wpos();
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
      discr: 'Vertex_buffer_print',
      func: (e)=>{
         console.log('------------------ Vertex_buffer_print() ------------------');
         Vertex_buffer_print();
      },
   },
   {
      key: 'vr',
      discr: 'Vertex_buffer_render_group_print_loop',
      func: (e)=>{
         console.log('------------------ Vertex_buffer_render_group_print_loop() ------------------');
         Vertex_buffer_render_group_print_loop();
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
      key: 'v1',
      discr: 'Shaders_print_loop',
      func: (e)=>{
         console.log('------------------ Shaders_print_loop() ------------------');
         Shaders_print_loop();
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
         console.log('GL STATE:', GL_STATE)
      },
   },
   {
      key: 'gd',
      discr: 'VIEWPORT, DEVICE',
      func: (e)=>{
         console.log('------------------ VIEWPORT, DEVICE ------------------');
         console.log('VIEWPORT:', VIEWPORT, '\nDEVICE', DEVICE)
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
      discr: 'Mesh_per_vb_print_loop',
      func: (e)=>{
         console.log('------------------ Mesh_per_vb_print_loop ------------------');
         Mesh_per_vb_print_loop()
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
      key: 't7',
      discr: 'Texture_buffer_print()',
      func: (e)=>{
         console.log('------------------ Texture_buffer_print() ------------------');
         Texture_buffer_print();
      },
   },
   {
      key: 'y1',
      discr: 'Dbg_info_ui_print_entries_table()',
      func: (e)=>{
         console.log('------------------ Dbg_info_ui_print_entries_table() ------------------');
         Dbg_info_ui_print_entries_table();
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
   {
      key: 'u1',
      discr: 'Uniforms_buffer_block()',
      func: (e)=>{
         console.log('------------------ Uniforms_buffer_block() ------------------');
         Uniforms_buffer_block_print();
      },
   },
   {
      key: 'u2',
      discr: 'Uniforms_buffer_block()',
      func: (e)=>{
         console.log('------------------ Uniforms_buffer_block() ------------------');
         Uniforms_buffer_print();
      },
   },
   {
      key: 'e1',
      discr: 'Particle_system_print_info()',
      func: (e)=>{
         console.log('------------------ Particle_system_print_info() ------------------');
         Particle_system_print_info();
      },
   },
   {
      key: 'n1',
      discr: 'Notifications_print()',
      func: (e)=>{
         console.log('------------------ Notifications_print() ------------------');
         Notifications_print();
      },
   },
   {
      key: 'n2',
      discr: 'Notifications_print_loop()',
      func: (e)=>{
         console.log('------------------ Notifications_print_loop() ------------------');
         Notifications_print_loop();
      },
   },

   /*****************************************************************************************************/
   // Miscelaneus
   {
      key: 'q1',
      discr: 'Arkanois_print_scrore_mod()',
      func: (e)=>{
         console.log('------------------ Arkanois_print_scrore_mod() ------------------');
         Arkanois_print_scrore_mod();
      },
   },
   {
      key: 'q2',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },
   {
      key: 'q3',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },
   {
      key: 'q4',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },
   {
      key: 'q5',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },
   {
      key: 'q6',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },
   {
      key: 'q7',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },
   {
      key: 'q8',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },
   {
      key: 'q9',
      discr: 'EMPTY',
      func: (e)=>{
         console.log('------------------ EMPTY() ------------------');
      },
   },




];


let _keys_buffer = [];

let On_key_down_callback = null;
let On_key_up_callback = null;

console.log('Keyboard Debugging keys:', DEBUG_PRINT_KEYS)
export function OnKeyDown(e){

   e.stopPropagation();

   // Case the user needs keyboard input, shoyld bind a callback that will be called here.
   if(On_key_down_callback) {

      On_key_down_callback({
         event: e,
         key: e.key,
      });

      // return;
   }

   if(!e.repeat){

      _keys_buffer.push({
         key: e.key,
         ctrl:e.ctrlKey,
         shift:e.shiftKey,
         alt:e.altKey,
      });
   }
}

export function Input_keyboard_bind_keydown_callback(Clbk){

   On_key_down_callback = Clbk;
}

export function Input_keyboard_bind_keyup_callback(Clbk){

   On_key_up_callback = Clbk;
}

export function OnKeyUp(e){
   
   e.stopPropagation();


   // Case the user needs keyboard input, shoyld bind a callback that will be called here.
   if(On_key_down_callback) {

      On_key_up_callback({
         event: e,
         key: e.key,
      });

      // return;
   }



   const len = _keys_buffer.length-1;

   if(len === 1){
      
      if  (_keys_buffer[0].key === 'r') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[r1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[r2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'a') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[a1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[a2].func(e);  
         else if  (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[a3].func(e);  
         else if  (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[a4].func(e);  
      }
      else if  (_keys_buffer[0].key === 'f') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[f1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[f2].func(e);  
         else if  (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[f3].func(e);  
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
         
         if  (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[s1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[s2].func(e);  
         else if  (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[s3].func(e);  
         else if  (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[s4].func(e);  
      }
      else if  (_keys_buffer[0].key === 'm') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[m1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[m2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'd' && _keys_buffer[1].key === 'p') { 
         DEBUG_PRINT_KEYS[dp].func(e);  
      }
      // else if  (_keys_buffer[0].key === 'i' && _keys_buffer[1].key === 'l') { 
      //    DEBUG_PRINT_KEYS[il].func(e);  
      // }
      else if  (_keys_buffer[0].key === 'w') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[w1].func(e);  
         else if  (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[w2].func(e);  
         else if  (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[w3].func(e);  
         else if  (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[w4].func(e);  
         else if  (_keys_buffer[len].key === '5') DEBUG_PRINT_KEYS[w5].func(e);  
         else if  (_keys_buffer[len].key === '6') DEBUG_PRINT_KEYS[w6].func(e);  
         else if  (_keys_buffer[len].key === '7') DEBUG_PRINT_KEYS[w7].func(e);  
      }
      else if  (_keys_buffer[0].key === 'v') { 
         if       (_keys_buffer[len].key === 'a') DEBUG_PRINT_KEYS[va].func(e);  
         else if       (_keys_buffer[len].key === 'b') DEBUG_PRINT_KEYS[vb].func(e);  
         else if       (_keys_buffer[len].key === 'r') DEBUG_PRINT_KEYS[vr].func(e);  
         else if       (_keys_buffer[len].key === 'i') DEBUG_PRINT_KEYS[vi].func(e);  
         else if       (_keys_buffer[len].key === 'p') DEBUG_PRINT_KEYS[vp].func(e);  
         else if       (_keys_buffer[len].key === 's') DEBUG_PRINT_KEYS[vs].func(e);  
         else if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[v1].func(e);  
      }
      else if  (_keys_buffer[0].key === 't') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[t1].func(e);  
         else if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[t2].func(e);  
         else if       (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[t3].func(e);  
         else if       (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[t4].func(e);  
         else if       (_keys_buffer[len].key === '5') DEBUG_PRINT_KEYS[t5].func(e);  
         else if       (_keys_buffer[len].key === '6') DEBUG_PRINT_KEYS[t6].func(e);  
         else if       (_keys_buffer[len].key === '7') DEBUG_PRINT_KEYS[t7].func(e);  
      }
      else if  (_keys_buffer[0].key === 'g') { 
         if       (_keys_buffer[len].key === 's') DEBUG_PRINT_KEYS[gs].func(e);  
         else if       (_keys_buffer[len].key === 'w') DEBUG_PRINT_KEYS[gw].func(e);  
         else if       (_keys_buffer[len].key === 'd') DEBUG_PRINT_KEYS[gd].func(e);  
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
      else if  (_keys_buffer[0].key === 'u') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[u1].func(e);  
         if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[u2].func(e);  
      }
      else if  (_keys_buffer[0].key === 'e') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[e1].func(e);  
      }
      else if  (_keys_buffer[0].key === 'n') { 
         if       (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[n1].func(e);  
         else if       (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[n2].func(e);  
      }

      // Misc
      else if  (_keys_buffer[0].key === 'q') { 
         if      (_keys_buffer[len].key === '1') DEBUG_PRINT_KEYS[q1].func(e);  
         else if (_keys_buffer[len].key === '2') DEBUG_PRINT_KEYS[q2].func(e);  
         else if (_keys_buffer[len].key === '3') DEBUG_PRINT_KEYS[q3].func(e);  
         else if (_keys_buffer[len].key === '4') DEBUG_PRINT_KEYS[q4].func(e);  
         else if (_keys_buffer[len].key === '5') DEBUG_PRINT_KEYS[q5].func(e);  
         else if (_keys_buffer[len].key === '6') DEBUG_PRINT_KEYS[q6].func(e);  
         else if (_keys_buffer[len].key === '7') DEBUG_PRINT_KEYS[q7].func(e);  
         else if (_keys_buffer[len].key === '8') DEBUG_PRINT_KEYS[q8].func(e);  
         else if (_keys_buffer[len].key === '9') DEBUG_PRINT_KEYS[q9].func(e);  
      }


   }
   else if(len === 0){

   if       (_keys_buffer[len].key === 'p') { DEBUG_PRINT_KEYS[p].func(e); }
   else if  (_keys_buffer[len].key === 'a') { console.log('@ Buffers Allocations', `\n  1:${DEBUG_PRINT_KEYS[a1].discr}\n  2:${DEBUG_PRINT_KEYS[a2].discr}\n  3:${DEBUG_PRINT_KEYS[a3].discr}\n  4:${DEBUG_PRINT_KEYS[a4].discr}`); }
   else if  (_keys_buffer[len].key === 'r') { console.log('@ Render Queue', `\n  1:${DEBUG_PRINT_KEYS[r1].discr},  2:${DEBUG_PRINT_KEYS[r2].discr}`); }
   else if  (_keys_buffer[len].key === 'f') { console.log('@ Frame Buuffer', `\n  1:${DEBUG_PRINT_KEYS[f1].discr},  2:${DEBUG_PRINT_KEYS[f2].discr}, 3:${DEBUG_PRINT_KEYS[f3].discr}`);  }
   else if  (_keys_buffer[len].key === 'i') { console.log('@ Time Intervals Queue', `\n  1:${DEBUG_PRINT_KEYS[i1].discr}`); }
   else if  (_keys_buffer[len].key === 'l') { console.log('@ Event Listeners', `\n  1:${DEBUG_PRINT_KEYS[l1].discr}\n  2:${DEBUG_PRINT_KEYS[l2].discr}\n  3:${DEBUG_PRINT_KEYS[l3].discr}`); }
   else if  (_keys_buffer[len].key === 's') { console.log('@ String Buffer', `\n  1:${DEBUG_PRINT_KEYS[s1].discr}\n  2:${DEBUG_PRINT_KEYS[s2].discr}\n  3:${DEBUG_PRINT_KEYS[s3].discr}\n  4:${DEBUG_PRINT_KEYS[s4].discr}`); }
   else if  (_keys_buffer[len].key === 'w') { console.log('@ Widget Root', `\n  1:${DEBUG_PRINT_KEYS[w1].discr}\n  2:${DEBUG_PRINT_KEYS[w2].discr}\n  3:${DEBUG_PRINT_KEYS[w3].discr}\n  4:${DEBUG_PRINT_KEYS[w4].discr}\n  5:${DEBUG_PRINT_KEYS[w5].discr}\n  6:${DEBUG_PRINT_KEYS[w6].discr}\n  7:${DEBUG_PRINT_KEYS[w7].discr}`); }
   else if  (_keys_buffer[len].key === 't') { console.log('@ Styles', `\n  1:${DEBUG_PRINT_KEYS[t1].discr}\n  2:${DEBUG_PRINT_KEYS[t2].discr}\n  3:${DEBUG_PRINT_KEYS[t3].discr}\n  4:${DEBUG_PRINT_KEYS[t4].discr}\n  5:${DEBUG_PRINT_KEYS[t5].discr}\n  6:${DEBUG_PRINT_KEYS[t6].discr}\n--\n  7:${DEBUG_PRINT_KEYS[t7].discr}`); }
   else if  (_keys_buffer[len].key === 'v') { console.log('@ GL', `\n  a:${DEBUG_PRINT_KEYS[va].discr}\n  b:${DEBUG_PRINT_KEYS[vb].discr}\n  r:${DEBUG_PRINT_KEYS[vr].discr}\n  i:${DEBUG_PRINT_KEYS[vi].discr}\n  p:${DEBUG_PRINT_KEYS[vp].discr}\n  s:${DEBUG_PRINT_KEYS[vs].discr}\n  1:${DEBUG_PRINT_KEYS[v1].discr}` ); }
   else if  (_keys_buffer[len].key === 'g') { console.log('@ +++', `\n  s:${DEBUG_PRINT_KEYS[gs].discr}\n  w:${DEBUG_PRINT_KEYS[gw].discr}\n  d:${DEBUG_PRINT_KEYS[gd].discr}\n  1:${DEBUG_PRINT_KEYS[g1].discr}\n  2:${DEBUG_PRINT_KEYS[g2].discr}\n  3:${DEBUG_PRINT_KEYS[g3].discr}\n  4:${DEBUG_PRINT_KEYS[g4].discr}\n  5:${DEBUG_PRINT_KEYS[g5].discr}\n  6:${DEBUG_PRINT_KEYS[g6].discr}`); }
   else if  (_keys_buffer[len].key === 'm') { console.log('@ Mesh Buffer', `\n  1:${DEBUG_PRINT_KEYS[m1].discr}, 2:${DEBUG_PRINT_KEYS[m2].discr}`); }
   else if  (_keys_buffer[len].key === 'y') { console.log('@ Debug ui entries table', `\n  1:${DEBUG_PRINT_KEYS[y1].discr}\n  2:${DEBUG_PRINT_KEYS[y2].discr}`); }
   else if  (_keys_buffer[len].key === 'u') { console.log('@ Uniform', `\n  1:${DEBUG_PRINT_KEYS[u1].discr}\n  2:${DEBUG_PRINT_KEYS[u2].discr}`); }
   else if  (_keys_buffer[len].key === 'e') { console.log('@ Particles System', `\n  1:${DEBUG_PRINT_KEYS[e1].discr}\n`); }
   else if  (_keys_buffer[len].key === 'n') { console.log('@ Notifications System', `\n  1:${DEBUG_PRINT_KEYS[n1].discr}\n   2:${DEBUG_PRINT_KEYS[n2].discr}\n`); }
   // Misc
   else if  (_keys_buffer[len].key === 'q') { console.log('@ Notifications System', `\n  1:${DEBUG_PRINT_KEYS[q1].discr}\n  2:${DEBUG_PRINT_KEYS[q2].discr}\n  3:${DEBUG_PRINT_KEYS[q3].discr}\n  4:${DEBUG_PRINT_KEYS[q4].discr}\n  5:${DEBUG_PRINT_KEYS[q5].discr}\n  6:${DEBUG_PRINT_KEYS[q6].discr}\n  7:${DEBUG_PRINT_KEYS[q7].discr}\n  8:${DEBUG_PRINT_KEYS[q8].discr}\n  9:${DEBUG_PRINT_KEYS[q9].discr}\n`); }}

   _keys_buffer = [];

}