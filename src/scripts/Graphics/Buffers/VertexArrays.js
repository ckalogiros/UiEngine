"use strict";

import { New_generic_buffer } from "../../Engine/Core/Buffers.js";





/*****************************************************************************************************************************************************/
// VAO: Vertex Array Object
/*****************************************************************************************************************************************************/


const _vertex_array_object = New_generic_buffer(_, 'GFX Vertex Array');
/** */
export function Gl_vertex_array_object_reset() { 
   Gl_vertex_array_vao_delete_all()
   _vertex_array_object.ResetFull(); 
}
/** */
export function Gl_vertex_array_object_get_by_vaoidx(vaoidx) {
   DEBUG1(vaoidx);
   return _vertex_array_object.buffer[vaoidx];
}
/** */
export function Gl_vertex_array_object_create(sid) {

   const vao = gfxCtx.gl.createVertexArray();

   const vao_sid = sid.attr; // Keep only the attribute part of the param sid 

   const vaoidx = _vertex_array_object.Add({ vao: vao, sid: vao_sid, type: BUFFER_TYPE.FLOAT32 });

   return vaoidx;
}
/** */
export function Gl_vertex_array_vao_delete(vaoidx) {

   const vao = _vertex_array_object.buffer[vaoidx].vao;
   gfxCtx.gl.deleteVertexArray(vao);
}
/** */
function Gl_vertex_array_vao_delete_all() {

   for(let i=0; i <= _vertex_array_object.boundary; i++){

      const vao = _vertex_array_object.buffer[i].vao;
      gfxCtx.gl.bindVertexArray(null);
      gfxCtx.gl.deleteVertexArray(vao);
   }
}
/** */
export function Gl_vertex_array_object_find_compatible(sid) {

   for (let i = 0; i <= _vertex_array_object.boundary; i++) {

      const vao = _vertex_array_object.buffer[i];
      if (vao.sid === sid.attr) {

         // Match found
         return i; // Return the vaoidx
      }
   }

   // Else vao match was not found
   return INT_NULL;
}











/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/

/** */
function DEBUG1(vaoidx) {
   /**DEBUG */ if (vaoidx < 0 || vaoidx > _vertex_array_object) alert('Vertex buffer index is out of bounds. @GlVertexArrayObject.js, Vertex_array_object_get_by_vaoidx()');
   /**DEBUG */ if (_vertex_array_object.buffer[vaoidx] === null) alert('Vertex buffer at index is NULL. @GlVertexArrayObjectr.js, Vertex_array_object_get_by_vaoidx()');
}
/** */
export function Gl_vertex_array_object_print() {
   console.log(_vertex_array_object)
}