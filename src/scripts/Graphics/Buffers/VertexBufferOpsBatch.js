"use strict";

import { _pt_batch2_update, _pt_test_misc_2 } from "../../Engine/Timers/PerformanceTimers";
import { Vertex_buffer_get_by_vbidx, Vertex_buffer_state_enable } from "./GL/VertexBuffers";

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
   // GL_update_gfx_batch_set_pos_dim_fn3,
   // GL_update_gfx_batch_set_pos_dim_fn4,
   // SET_WPOS4_FROM_POS_DIF,
   // GL_update_gfx_batch_fn6_renameme,
];


// Probably // UNNECESSARY
export function Gl_batch_update_get_fn_idx(sid) { // TODO: Re implement. 

   if ((sid.attr & SID.ATTR.COL4) && (sid.attr & SID.ATTR.WPOS_TIME4) && (sid.attr & SID.ATTR.POS2)) {
      if ((sid.attr & SID.ATTR.TEX2) && (sid.attr & SID.ATTR.MSDF)) {
         BATCH_FN_TABLE.RECT
         return 4; // Return the index of the apropriate function in the _batch_gfx_update_fn_table_indexes buffer.
      }
      else if ((sid.attr & SID.ATTR.PARAMS1)) {
         return 1; // Return the index of the apropriate function in the _batch_gfx_update_fn_table_indexes buffer.
      }
      else if ((sid.attr & SID.ATTR.TEX2)) {
         return 2; // Return the index of the apropriate function in the _batch_gfx_update_fn_table_indexes buffer.
      }
      else {
         return INT_NULL
      }
   }

}



export function Gl_batch_update_get_fn_byidx(idx) {

   /**DEBUG */ if (idx < 0 || idx > MAX_SIZE) alert('@GlBufferOpsBatch.js')
   return _batch_gfx_update_fn_table[idx];
}


//                                       fnidx, vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces = 1, update_data
export function Gl_batch_update_fn_byidx(fnidx, vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces = 1, update_data) {
   
   _pt_test_misc_2.timer.Start();
   _pt_batch2_update.timer.Start();
   _batch_gfx_update_fn_table[fnidx](vbidx, start, attrib_offset, verts_per_rect, attribs_per_vertex, num_faces, update_data);
   _pt_batch2_update.timer.Stop();
   _pt_test_misc_2.timer.Stop();
}


export function Gl_batch_generic(array_data) {

   console.log('______________________________')
   const len = array_data.length;
   for(let i=0; i<len; i++){

      console.log(array_data[i])
      // console.log(array_data[i].fnidx, array_data[i].name)
   }

   // const vb_info = Vertex_buffer_info_get_by_vbidx(vbidx);
   // const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   // const num_vertices = vertsPerRect;
   // const count = num_faces * num_vertices;
   // // const count = ((num_faces * num_vertices) < vb.count) ? (num_faces * num_vertices) : vb.count;

   // let index = start;
   // for (let i = 0; i < count; i++) { // Runs for each mesh in the vertex buffer

   //    // col
   //    index+=V_COL_COUNT;

   //    // wpos
   //    vb_data[index++] += update_data.pos[0];
   //    vb_data[index++] += update_data.pos[1];
   //    index++;
   //    index++;

   //    // pos
   //    index+=V_POS_COUNT;

   //    // params1: style
   //    index+=V_PARAMS1_COUNT;

   // }

   // vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
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
   // const count = ((num_faces * num_vertices) < vb.count) ? (num_faces * num_vertices) : vb.count;

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
   // const count = ((num_faces * num_vertices) < vb.count) ? (num_faces * num_vertices) : vb.count;

   let index = start + attrib_offset;
   for (let i = 0; i < count; i++) { // Runs for each mesh in the vertex buffer

      /**
       * -+
       * --
       * ++
       * +-
       */
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
      // pos
      vb_data[index++] = -update_data.data[cnt++];
      vb_data[index++] = update_data.data[cnt++];
      // params1: style
      index+=V_PARAMS1_COUNT;

      cnt = 0;
      /**************************************/
      // col
      index+=V_COL_COUNT;
      vb_data[index++] = update_data.data[cnt++]; // 
      vb_data[index++] = update_data.data[cnt++]; // 
      index++;
      index++;
      // pos
      vb_data[index++] = -update_data.data[cnt++];
      vb_data[index++] = -update_data.data[cnt++];
      // params1: style
      index+=V_PARAMS1_COUNT;
      
      cnt = 0;
      /**************************************/
      // col
      index+=V_COL_COUNT;
      vb_data[index++] = update_data.data[cnt++]; // 
      vb_data[index++] = update_data.data[cnt++]; // 
      // vb_data[index++] = update_data.data[cnt++]; // 
      index++;
      index++;
      // pos
      vb_data[index++] = update_data.data[cnt++];
      vb_data[index++] = update_data.data[cnt++];
      // params1: style
      index+=V_PARAMS1_COUNT;
      
      cnt = 0;
      /**************************************/
      // col
      index+=V_COL_COUNT;
      vb_data[index++] = update_data.data[cnt++]; // 
      vb_data[index++] = update_data.data[cnt++]; // 
      // vb_data[index++] = update_data.data[cnt++]; // 
      index++;
      index++;
      // pos
      vb_data[index++] = update_data.data[cnt++];
      vb_data[index++] = -update_data.data[cnt++];
      // params1: style
      index+=V_PARAMS1_COUNT;
   }
   

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE)
}








// // Update TEXT - POS from mesh pos
// function GL_update_gfx_batch_fn6_renameme(groupidx, progidx, vbidx, start, vertsPerRect, num_faces = 1, update_data) {

//    const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
//    const num_vertices = vertsPerRect;
//    const count = num_faces * num_vertices;

//    let index = start;
//    for (let i = 0; i < count; i++) { // Runs for each mesh in the vertex buffer

//       // col
//       index+=V_COL_COUNT;

//       // wpos
//       vb_data[index++] += geom.pos_dif[0];
//       vb_data[index++] += geom.pos_dif[1];
//       index++;
//       index++;

//       // pos
//       index+=V_POS_COUNT;

//       // params1: style
//       index+=V_TEX_COUNT;

//    }

//    vb.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
// }
