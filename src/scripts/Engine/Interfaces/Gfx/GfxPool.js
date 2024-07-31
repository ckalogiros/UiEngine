"use strict";

import { Index_buffer_info_get, Index_buffer_info_reset_buffer, Index_buffer_reset_buffer } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Uniform_blocks_buffer_reset, Uniforms_buffer_reset } from "../../../Graphics/Buffers/UniformBuffers.js";
import { Gl_vertex_array_object_reset } from "../../../Graphics/Buffers/VertexArrays.js";
import { VBI_get_byidx, VBI_get_whole_buffer, Vertex_buffer_get_by_vbidx, Vertex_buffer_reset, Vertex_buffer_group_get, Vertex_buffer_group_reset, Vertex_buffer_info_reset, Vertex_buffer_reset_full } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_remove_geometry } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Shader_attributes_reset } from "../../../Graphics/ShaderAttributes.js";
import { Progarm_get_program, Program_reset } from "../../../Graphics/ShaderPrograms.js";
import { Texture_buffer_reset } from "../../Loaders/Textures/Texture.js";
import { Renderer_create_gl_context } from "../../Renderers/Renderer.js";


/**
 * Application: Reusability of Vertex Buffers
 * 
 * . Finds between private/nto private of Vertex Buffers
 * . Finds between different sizes of Vertex Buffers
 * . Activation/deactivation of Vertex Buffers
 * . On Vertex Buffer reallocation, decides if another fitting buffer exists
 * . Dynamic checking for best fit
 */







export function Gfx_pool_vb_reset() {
   
   
   // const vb_info_buffer = Vertex_buffer_group_get();

   // for (let i = 0; i <= vb_info_buffer.boundary; i++) {

   //    if((vb_info_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE)){

   //       vb_info_buffer.buffer[i].state.mask |= BUFFER_STATE.IS_ACTIVE;
   //       vb_info_buffer.buffer[i].state.mask |= BUFFER_STATE.IS_ACTIVE;
   //    }
   // }

   Vertex_buffer_reset_full();
   Vertex_buffer_info_reset();
   Vertex_buffer_group_reset();

   Index_buffer_reset_buffer();
   Index_buffer_info_reset_buffer();

   Texture_buffer_reset();

   Gl_vertex_array_object_reset();

   Program_reset();
   Shader_attributes_reset();

   Uniforms_buffer_reset();
   // Uniform_blocks_buffer_reset();

   // Renderer_create_gl_context();
}



export function Gfx_pool_remove_geometry(gfx, num_faces, start_index, debug_mesh=null) {

   Gl_remove_geometry(gfx, num_faces, start_index, debug_mesh);

}



export function Gfx_pool_find_vb_notActive_and_private(sid, pool_request_flags) {

   const vb_info_buffer = Vertex_buffer_group_get();

   // Return first buffer match
   if(pool_request_flags & GFX_POOL_REQUESTS.ANY){ 

      for (let i = 0; i <= vb_info_buffer.boundary; i++) {

         if((vb_info_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE) === 0){
               
            if(SID.CheckSidMatch(sid, vb_info_buffer.buffer[i].sid)){
   
               vb_info_buffer.buffer[i].state.mask |= BUFFER_STATE.IS_ACTIVE;
               return i;
            }
         }
      }
   }

   else{ // Else search from conditions. Searches through all vertex buffer groups

      let found = INT_NULL;
      let size = INT_NULL;

      for (let i = 0; i <= vb_info_buffer.boundary; i++) {
   
         if((vb_info_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE) === 0){
            
            const vb_sid = vb_info_buffer.buffer[i].sid;
            if(SID.CheckSidMatch(sid, vb_sid)){
   
               
               if(size === INT_NULL){ // Case first match
                  size = vb_info_buffer.buffer[i].size;
                  found = i;
               }
               else if(pool_request_flags & GFX_POOL_REQUESTS.SMALLEST){ // Case: If smaller buffer match found, use that
                  if(size > vb_info_buffer.buffer[i].size){
                     found = i;
                     console.log('GFX POOL found SMALLEST. vbidx:', found)
                  }
               }
               else if(pool_request_flags & GFX_POOL_REQUESTS.LARGEST){  // Case: If larger buffer match found, use that
                  if(size < vb_info_buffer.buffer[i].size){
                     found = i;
                     console.log('GFX POOL found LARGEST. vbidx:', found)
                  }
               }
            }
         }
      }

      if(found !== INT_NULL){
         vb_info_buffer.buffer[found].state.mask |= BUFFER_STATE.IS_ACTIVE;
         return found;
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