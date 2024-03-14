"use strict";

import { Vertex_buffer_get_by_vbidx } from "../../../Graphics/Buffers/VertexBuffers.js";
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



export function Gfx_pool_remove_geometry(gfx, num_faces, start_index) {

   const ret = Gl_remove_geometry(gfx, num_faces, start_index);
   if (ret.empty) { // If the vertex buffer is empty, then set it as not active, so it can be used by other gfx demands.
alert('IMPLEMENT ME. GfxPool.js\nGfx_pool_remove_geometry()')
      _gfx_pool.buffer[gfx.prog.groupidx].buffer[gfx.prog.idx].buffer[gfx.vb.idx].inUse = false;



      // TODO: DONT FORGET TO UPDATE THE RENDERQUE OR SET AN UPDATE IF RENDERQUEUE CHNGED TO AVOID THE OVERHEAD    }
   }
   return ret;
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