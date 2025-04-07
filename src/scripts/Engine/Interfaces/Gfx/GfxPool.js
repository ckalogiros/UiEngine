"use strict";

import { Index_buffer_info_get, Index_buffer_info_reset_buffer, Index_buffer_reset_buffer } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Uniforms_buffer_reset } from "../../../Graphics/Buffers/UniformBuffers.js";
import { Gl_vertex_array_object_reset } from "../../../Graphics/Buffers/VertexArrays.js";
import { VBI_get_byidx, Vertex_buffer_group_get, Vertex_buffer_group_reset, Vertex_buffer_info_reset, Vertex_buffer_reset_full } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_remove_geometry } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { BUFFER_STATE, GFX_POOL_REQUESTS, SID } from "../../../Graphics/Global/GfxConstants.js";
import { Shader_attributes_reset } from "../../../Graphics/ShaderAttributes.js";
import { Program_reset, Program_full_reset_stored_shader_operation } from "../../../Graphics/ShaderPrograms.js";
import { Mesh_unif_get_vb_root_wpos_has_absolute_pos } from "../../Core/MeshUniformsBuffer.js";
import { Texture_buffer_reset } from "../../Loaders/Textures/Texture.js";
import { Renderqueue_set_active } from "../../Renderers/Renderer/RenderQueue.js";


/**
 * Application: Reusability of Vertex Buffers
 * 
 * . Finds between private/not-private of Vertex Buffers
 * . Finds between different sizes of Vertex Buffers
 * . Activation/deactivation of Vertex Buffers
 * . On Vertex Buffer reallocation, decides if another fitting buffer exists
 * . Dynamic checking for best fit
 */







export function Gfx_pool_vb_reset() {
   
   Vertex_buffer_reset_full();
   Vertex_buffer_info_reset();
   Vertex_buffer_group_reset();

   Index_buffer_reset_buffer();
   Index_buffer_info_reset_buffer();

   Texture_buffer_reset();

   Gl_vertex_array_object_reset();

   Program_reset();
   Shader_attributes_reset();
   Program_full_reset_stored_shader_operation();

   Uniforms_buffer_reset();
}



export function Gfx_pool_remove_geometry(gfx, num_faces, start_index, debug_mesh=null) {

   Gl_remove_geometry(gfx, num_faces, start_index, debug_mesh);

}



export function Gfx_pool_find_vb_notActive_and_private(sid, pool_request_flags, has_absolute_pos=0x0) {

   const vb_group_buffer = Vertex_buffer_group_get();

   // Return first buffer match
   if(pool_request_flags & GFX_POOL_REQUESTS.ANY){ 

      for (let i = 0; i <= vb_group_buffer.boundary; i++) {

         // Case the vertex buffer is empty and unused
         if((vb_group_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE) === 0){

            if(SID.CheckSidMatch(sid, vb_group_buffer.buffer[i].sid)){
   
               vb_group_buffer.buffer[i].state.mask |= BUFFER_STATE.IS_ACTIVE;
               Renderqueue_set_active(i, true);
               return i;
            }
         }
      }
   }

   else if(pool_request_flags & GFX_POOL_REQUESTS.BEST_FIT) {

      // const vbs_sorted = Bubble_sort();
      
      const temp_arr = new Int16Array(vb_group_buffer.active_count);
      let size = 0; 

      for (let i = 0; i <= vb_group_buffer.boundary; i++) {
         
         const vb_group = vb_group_buffer.buffer[i];
         for (let j = 0; j <= vb_group.vb_idxs.boundary; j++) {
            
            const vb_idx = vb_group.buffer[j];
            const vb = VBI_get_byidx(vb_idx);

            // vb count
            // if((vb_group_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE) === 0){
            // if(SID.CheckSidMatch(sid, vb_group_buffer.buffer[i].sid)){
            /**
             * Purpose is to run for all vbs and keep the one with the apropriate count
             * 
             * We need a calculated size for the meshes to be inserted.
             * Because this functionality mainly is for contexts of a game-app,
             * that means we have limited groups of meshes, already known or used.
             * So maybe we create a 'memory' for a large mesh group(mainly text characters)
             * and use that immidiately
             */
         }

      }

   }

   else{ // Else search from conditions. Searches through all vertex buffer groups

      let found = INT_NULL;
      let size = INT_NULL;

      for (let i = 0; i <= vb_group_buffer.boundary; i++) {
   
         if((vb_group_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE) === 0){
            
            const vb_sid = vb_group_buffer.buffer[i].sid;
            
            // // We need to have knowledge if the meshes of the vb stored, have absolute position or not
            // const has_vb_absolute_pos = Mesh_unif_get_vb_root_wpos_has_absolute_pos(i);

            // if((has_absolute_pos === has_vb_absolute_pos) && SID.CheckSidMatch(sid, vb_sid)){
            if(SID.CheckSidMatch(sid, vb_sid)){
   
               
               if(size === INT_NULL){ // Case first match
                  size = vb_group_buffer.buffer[i].size;
                  found = i;
               }
               else if(pool_request_flags & GFX_POOL_REQUESTS.SMALLEST){ // Case: If smaller buffer match found, use that
                  if(size > vb_group_buffer.buffer[i].size){
                     found = i;
                     console.log('GFX POOL found SMALLEST. vbidx:', found)
                  }
               }
               else if(pool_request_flags & GFX_POOL_REQUESTS.LARGEST){  // Case: If larger buffer match found, use that
                  if(size < vb_group_buffer.buffer[i].size){
                     found = i;
                     console.log('GFX POOL found LARGEST. vbidx:', found)
                  }
               }
            }
         }
      }

      if(found !== INT_NULL){
         vb_group_buffer.buffer[found].state.mask |= BUFFER_STATE.IS_ACTIVE;
         Renderqueue_set_active(found, true);
         return found;
      }
   }


   return INT_NULL;
}



export function Gfx_pool_find_vb_notPrivate(sid, pool_request_flags, has_absolute_pos=0x0) {

   const vb_group_buffer = Vertex_buffer_group_get();

   // Return first buffer match
   if(pool_request_flags & GFX_POOL_REQUESTS.ANY){ 

      for (let i = 0; i <= vb_group_buffer.boundary; i++) {

         // Case the vertex buuffer is empty and unused
         if((vb_group_buffer.buffer[i].state.mask & BUFFER_STATE.IS_PRIVATE) === 0){
                        
            // We need to have knowledge if the meshes of the vb stored, have absolute position or not
            const has_vb_absolute_pos = Mesh_unif_get_vb_root_wpos_has_absolute_pos(i);

            if((has_absolute_pos === has_vb_absolute_pos) && SID.CheckSidMatch(sid, vb_group_buffer.buffer[i].sid)){
   
               vb_group_buffer.buffer[i].state.mask |= BUFFER_STATE.IS_ACTIVE;
               Renderqueue_set_active(i, true);
               return i;
            }
         }
      }
   }

   return INT_NULL;
}



export function Gfx_pool_find_ib_notActive(shad) {

   const ib_buffer = Index_buffer_info_get();
   for (let i = 0; i <= ib_buffer.boundary; i++) {

      if(shad === ib_buffer.buffer[i].sid.shad){

         ib_buffer.buffer[i].state.mask |= BUFFER_STATE.IS_ACTIVE;
         return i;
      }
   }
   return INT_NULL;
}












/****************************************************************************************************************************************************/
// Debug-Print
/****************************************************************************************************************************************************/

export function Gfx_pool_print() {

   console.log('Pool does not exist: ');
   // console.log(_gfx_pool);
   // for (let i = 0; i <= _gfx_pool.boundary; i++) {
   //    for (let j = 0; j <= _gfx_pool.buffer[i].boundary; j++) {
   //       for (let k = 0; k <= _gfx_pool.buffer[i].buffer[j].boundary; k++) {

   //          console.log(
   //             'group:', _gfx_pool.buffer[i].buffer[j].buffer[k].groupidx,
   //             ' prog:', _gfx_pool.buffer[i].buffer[j].buffer[k].progidx,
   //             ' vb:', _gfx_pool.buffer[i].buffer[j].buffer[k].vbidx,
   //             ' inUse:', _gfx_pool.buffer[i].buffer[j].buffer[k].inUse,
   //             ' private:', _gfx_pool.buffer[i].buffer[j].buffer[k].isPrivate,
   //          );
   //       }
   //    }
   // }
}