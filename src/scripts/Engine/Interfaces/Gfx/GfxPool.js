"use strict";

import { Index_buffer_info_get } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Vertex_buffer_get_by_vbidx, Vertex_buffer_group_get } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_remove_geometry } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Progarm_get_program } from "../../../Graphics/ShaderPrograms.js";


/**
 * Application: Reusability of Vertex Buffers
 * 
 * . Finds between private/nto private of Vertex Buffers
 * . Finds between different sizes of Vertex Buffers
 * . Activation/deactivation of Vertex Buffers
 * . On Vertex Buffer reallocation, decides if another fitting buffer exists
 * . Dynamic checking for best fit
 */







export function Gfx_pool_find_notActive_and_notPrivate_vb(progidx) {
   alert('IMPLEMENT ME. GfxPool.js\n Gfx_pool_find_notActive_and_notPrivate_vb()')
   // 
   const prog = Progarm_get_program(progidx);

   for(let i=0; i <= prog.vb.boundary; i++){

      const vb = Vertex_buffer_get_by_vbidx(prog.vb.buffer[i]);
      if (!vb.inUse && !vb.isPrivate) return vb;
   }

   return null;
}



export function Gfx_pool_remove_geometry(gfx, num_faces, start_index, debug_mesh=null) {

   const ret = Gl_remove_geometry(gfx, num_faces, start_index, debug_mesh);
   if (ret.empty) { // If the vertex buffer is empty, then set it as not active, so it can be used by other gfx demands.
      alert('IMPLEMENT ME. GfxPool.js\nGfx_pool_remove_geometry()')
      // _gfx_pool.buffer[gfx.prog.groupidx].buffer[gfx.prog.idx].buffer[gfx.vb.idx].inUse = false;

      // TODO: DONT FORGET TO UPDATE THE RENDERQUE OR SET AN UPDATE IF RENDERQUEUE CHANGED TO AVOID THE OVERHEAD    }
   }
   return ret;
}



export function Gfx_pool_find_vb_notActive_and_private(sid, pool_request_flags) {

   const vb_group_buffer = Vertex_buffer_group_get();

   // Return first buffer match
   if(pool_request_flags & GFX_POOL_REQUESTS.ANY){ 

      for (let i = 0; i <= vb_group_buffer.boundary; i++) {

         if((vb_group_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE) === 0){
               
            if(SID.CheckSidMatch(sid, vb_group_buffer.buffer[i].sid)){
   
               vb_group_buffer.buffer[i].state.mask |= BUFFER_STATE.IS_ACTIVE;
               return i;
            }
         }
      }
   }

   else{ // Else search from conditions. Searches through all vertex buffer groups

      let found = INT_NULL;
      let size = INT_NULL;

      for (let i = 0; i <= vb_buffer.boundary; i++) {
   
         if((vb_buffer.buffer[i].state.mask & BUFFER_STATE.IS_ACTIVE) === 0){
            
            const vb_sid = vb_buffer.buffer[i].sid;
            if(SID.CheckSidMatch(sid, vb_sid)){
   
               
               if(size === INT_NULL){ // Case first match
                  size = vb_buffer.buffer[i].size;
                  found = i;
               }
               else if(pool_request_flags & GFX_POOL_REQUESTS.SMALLEST){ // Case: If smaller buffer match found, use that
                  if(size > vb_buffer.buffer[i].size){
                     found = i;
                     console.log('GFX POOL found SMALLEST. vbidx:', found)
                  }
               }
               else if(pool_request_flags & GFX_POOL_REQUESTS.LARGEST){  // Case: If larger buffer match found, use that
                  if(size < vb_buffer.buffer[i].size){
                     found = i;
                     console.log('GFX POOL found LARGEST. vbidx:', found)
                  }
               }
            }
         }
      }

      if(found !== INT_NULL){
         vb_buffer.buffer[found].state.mask |= BUFFER_STATE.IS_ACTIVE;
         return found;
      }
   }


   return INT_NULL;
}



export function Gfx_pool_find_ib_notActive(PATTERN) {

   const ib_buffer = Index_buffer_info_get();
   for (let i = 0; i <= ib_buffer.boundary; i++) {

      if(ib_buffer.buffer[i].temp_pattern & PATTERN){

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