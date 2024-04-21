"use strict";

import { Vertex_buffer_get_by_vbidx, Vertex_buffer_state_enable } from "./VertexBuffers.js";




/**
 * // TODO:
 * Break the fn table to 2 arrays.
 * The first is responible for the type: Rect, Text, Texture, ...
 * The second is for specific updates, like: pos, pos-col, pos from move val, ... 
 */




const _batch_gfx_update_fn_table = [
   SET_WPOS4, 
   ADD_WPOS4, 
   SET_POS2, 
   SET_WPOS4_POS2, 
];




export function Gl_batch_update_get_fn_byidx(idx) {

   /**DEBUG */ if (idx < 0 || idx > MAX_SIZE) alert('@GlBufferOpsBatch.js')
   return _batch_gfx_update_fn_table[idx];
}



export function Gl_batch_update_fn_byidx(fnidx, vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces = 1, update_data) {
   
   // _pt_batch2_update.timer.Start();
   _batch_gfx_update_fn_table[fnidx](vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces, update_data);
   // _pt_batch2_update.timer.Stop();
}



// ADD_WPOS4
function ADD_WPOS4(vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces = 1, update_data) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const count = num_faces * verts_per_rect;
   const stride = attribs_per_vertex - update_data.sizes[0];
   // const count = ((num_faces * num_vertices) < vb.count) ? (num_faces * num_vertices) : vb.count;

   let index = start + attrib_offset;

   for (let i = 0; i < count; i++) { // Runs for each mesh in the vertex buffer

      vb_data[index++] += update_data.data[0];
      vb_data[index++] += update_data.data[1];
      index += stride;

   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}



function SET_WPOS4(vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces = 1, update_data) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const count = num_faces * verts_per_rect;
   const stride = attribs_per_vertex - update_data.sizes[0];

   let index = start + attrib_offset;
   for (let i = 0; i < count; i++) { // Runs for each mesh in the vertex buffer

      vb_data[index++] = update_data.data[0]; // 
      vb_data[index++] = update_data.data[1]; // 
      index += stride;

   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}



function SET_POS2(vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces = 1, update_data) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const count = num_faces;
   const stride = attribs_per_vertex - update_data.sizes[0];

   let index = start + attrib_offset;
   for (let i = 0; i < count; i++) { // Runs for each mesh in the vertex buffer

      vb_data[index++] = -update_data.data[0]; // 
      vb_data[index++] =  update_data.data[1]; // 
      index += stride;
      vb_data[index++] = -update_data.data[0]; // 
      vb_data[index++] = -update_data.data[1]; // 
      index += stride;
      vb_data[index++] =  update_data.data[0]; // 
      vb_data[index++] =  update_data.data[1]; // 
      index += stride;
      vb_data[index++] =  update_data.data[0]; // 
      vb_data[index++] = -update_data.data[1]; // 
      index += stride;

   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}



function SET_WPOS4_POS2(vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces = 1, update_data) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const count = num_faces;
   // const stride = attribs_per_vertex - update_data.sizes[0];

   let index = start + attrib_offset;
   let cnt = 0;

   for (let i = 0; i < count; i++) { // Runs for each mesh in the vertex buffer

      // wpos
      vb_data[index++] = update_data.data[cnt++]; // 
      vb_data[index++] = update_data.data[cnt++]; // 
      index++;
      index++;
      // params1: style
      index+=V_PARAMS1_COUNT;
      // pos
      vb_data[index++] = -update_data.data[cnt++];
      vb_data[index++] = update_data.data[cnt++];

      cnt = 0;
      /**************************************/
      // col
      index+=V_COL_COUNT;
      vb_data[index++] = update_data.data[cnt++]; // 
      vb_data[index++] = update_data.data[cnt++]; // 
      index++;
      index++;
      // params1: style
      index+=V_PARAMS1_COUNT;
      // pos
      vb_data[index++] = -update_data.data[cnt++];
      vb_data[index++] = -update_data.data[cnt++];
      
      cnt = 0;
      /**************************************/
      // col
      index+=V_COL_COUNT;
      vb_data[index++] = update_data.data[cnt++]; // 
      vb_data[index++] = update_data.data[cnt++]; // 
      // vb_data[index++] = update_data.data[cnt++]; // 
      index++;
      index++;
      // params1: style
      index+=V_PARAMS1_COUNT;
      // pos
      vb_data[index++] = update_data.data[cnt++];
      vb_data[index++] = update_data.data[cnt++];
      
      cnt = 0;
      /**************************************/
      // col
      index+=V_COL_COUNT;
      vb_data[index++] = update_data.data[cnt++]; // 
      vb_data[index++] = update_data.data[cnt++]; // 
      // vb_data[index++] = update_data.data[cnt++]; // 
      index++;
      index++;
      // params1: style
      index+=V_PARAMS1_COUNT;
      // pos
      vb_data[index++] = update_data.data[cnt++];
      vb_data[index++] = -update_data.data[cnt++];
   }
   

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE)
}

