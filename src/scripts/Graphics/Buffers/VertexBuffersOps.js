"use strict";

import { RotateZ } from "../../Helpers/Math/Matrix.js";
import { Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs_offset_attribs_per_vertex, Shader_attributes_get_attribs_offset_size, Shader_attributes_get_attribs_offset_size_attribs_per_vertex } from "../ShaderAttributes.js";
import { Index_buffer_get_by_ibidx } from "./IndexBuffers.js";
import { VBI_get_byidx, Vertex_buffer_get_by_vbidx, Vertex_buffer_group_get_byidx, Vertex_buffer_remove_geometry, Vertex_buffer_state_enable } from "./VertexBuffers.js";



/**
 * // TODOS:
 * 
 * Remove all older attribute functions and replace them with new, if they are used
 */






/**************************************************************************************************************************************/
// NEW IMPLEMENTATION Vertex Buffer Functions
/**************************************************************************************************************************************/


/**************************************************************************************************************************************/
// COLOR ATTRIBUTES
/**************************************************************************************************************************************/
export function Gl_set_rgba(gfxInfo, color, num_faces = 1) {

   /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_rgba()'); }

   const vbidx = gfxInfo.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);

   // const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.COL4);

   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vbidx];


   while (loop_count) {

      vb_data[index++] = color[0];
      vb_data[index++] = color[1];
      vb_data[index++] = color[2];
      vb_data[index++] = color[3];

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_alpha(gfxInfo, alpha, num_faces = 1) {

   /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_rgba()'); }

   const vbidx = gfxInfo.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);

   // const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.COL4);

   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx] + 3;
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   let stride = vb_info.attribs_info.count - 1;


   while (loop_count) {

      vb_data[index++] = alpha;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_rgba_per_vertex(gfxInfo, color, num_faces = 1) {

   /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_rgba_per_vertex()'); }

   const vbidx = gfxInfo.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);

   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vbidx];


   let k = 0;

   while (loop_count) {

      vb_data[index++] = color[k][0];
      vb_data[index++] = color[k][1];
      vb_data[index++] = color[k][2];
      vb_data[index++] = color[k][3];

      index += stride; // Go to next vertice's col.
      loop_count--;
      k++;

   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_rgba_per_vertex_specify_vertex(gfxInfo, color, num_faces = 1, vertex_idx, vertex_count) {

   /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_rgba_per_vertex()'); }

   const vbidx = gfxInfo.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);

   let stride = vb_info.attribs_info.count;
   // let index = (gfxInfo.vb.starts.buffer[vbidx] + (face_idx * stride * vertex_idx)) + vb_info.attribs_info.offsets[vbidx];
   let index = (gfxInfo.vb.starts.buffer[vbidx] + (vertex_idx * vb_info.attribs_info.count)) + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces * vertex_count;
   // if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   
   // TODO: In case we want to update a specific vertex (vertex top-right) in a mesh with more than one face, 
   // TODO: we need a second loop and a stride, to reach the next equivalent vertex in the next mesh's face
   
   let k = 0;

   while (loop_count) {

      vb_data[index+0] = color[0]; 
      vb_data[index+1] = color[1];
      vb_data[index+2] = color[2];
      vb_data[index+3] = color[3];

      index += stride; // Go to next vertex color attribute.
      loop_count--;
      k++;

   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_rgba_specify_attribute(gfxInfo, value, num_faces = 1, vertex_idx, vertex_count, attribidx) {

   /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_rgba_per_vertex()'); }

   const vbidx = gfxInfo.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);

   let stride = vb_info.attribs_info.count;
   // let index = (gfxInfo.vb.starts.buffer[vbidx] + (face_idx * stride * vertex_idx)) + vb_info.attribs_info.offsets[vbidx];
   let index = (gfxInfo.vb.starts.buffer[vbidx] + (vertex_idx * vb_info.attribs_info.count)) + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces * vertex_count;
   // if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   
   // TODO: In case we want to update a specific vertex (vertex top-right) in a mesh with more than one face, 
   // TODO: we need a second loop and a stride, to reach the next equivalent vertex in the next mesh's face
   
   let k = 0;

   while (loop_count) {

      vb_data[index+attribidx] = value; 
      // vb_data[index+1] = color[1];
      // vb_data[index+2] = color[2];
      // vb_data[index+3] = color[3];

      index += stride; // Go to next vertex color attribute.
      loop_count--;
      k++;

   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}




/**************************************************************************************************************************************/
// WORLD POSITION ATTRIBUTES
/**************************************************************************************************************************************/

export function Gl_add_wpos_xy(gfxInfo, x, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.wpos_buf;
   const wposidx = gfxInfo.vb.which_attrib.wpos_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[wposidx];
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[wposidx];
   let stride = vb_info.attribs_info.count - 2;



   while (loop_count) {

      vb_data[index++] += x;
      vb_data[index++] += y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_add_wpos_x(gfxInfo, x, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.wpos_buf;
   const wposidx = gfxInfo.vb.which_attrib.wpos_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[wposidx];
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[wposidx];
   let stride = vb_info.attribs_info.count - 1;



   while (loop_count) {

      vb_data[index++] += x;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_add_wpos_y(gfxInfo, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.wpos_buf;
   const wposidx = gfxInfo.vb.which_attrib.wpos_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[wposidx] + 1;
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[wposidx];
   let stride = vb_info.attribs_info.count - 1;



   while (loop_count) {

      vb_data[index++] += y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_set_wpos_xy(gfxInfo, x, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.wpos_buf;
   const wposidx = gfxInfo.vb.which_attrib.wpos_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[wposidx];
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[wposidx];
   let stride = vb_info.attribs_info.count - 2;



   while (loop_count) {

      vb_data[index++] = x;
      vb_data[index++] = y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_set_wpos_x(gfxInfo, x, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.wpos_buf;
   const wposidx = gfxInfo.vb.which_attrib.wpos_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[wposidx];
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - (vb_info.attribs_info.sizes[wposidx]-1);
   let stride = vb_info.attribs_info.count - 1;



   while (loop_count) {

      vb_data[index++] = x;
      // vb_data[index++] = y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_set_wpos_y(gfxInfo, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.wpos_buf;
   const wposidx = gfxInfo.vb.which_attrib.wpos_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[wposidx] + 1;
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   let stride = vb_info.attribs_info.count - 1;



   while (loop_count) {

      vb_data[index++] = y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}




/**************************************************************************************************************************************/
// VERTEX POSITION ATTRIBUTES
/**************************************************************************************************************************************/

export function Gl_set_dim_xy(gfxInfo, x, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf;
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx];
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[dimidx];

   x*=2; y*=2;

   while (loop_count) {

      vb_data[index++] = 0;
      vb_data[index++] = y;
      index += stride;

      vb_data[index++] = 0;
      vb_data[index++] = 0;
      index += stride;

      vb_data[index++] = x;
      vb_data[index++] = y;
      index += stride;

      vb_data[index++] = x;
      vb_data[index++] = 0;
      index += stride;

      loop_count--;
   }


   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_set_dim_x(gfxInfo, x, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf;
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx];
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - 1;

   x*=2;

   while (loop_count) {

      vb_data[index++] = 0;
      index += stride;
      
      vb_data[index++] = 0;
      index += stride;
      
      vb_data[index++] = x;
      index += stride;
      
      vb_data[index++] = x;
      index += stride;

      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_set_dim_y(gfxInfo, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf;
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx] + 1;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - 1;

   // y*=2;
   /** // TODO: Correct the vetex position with the dimention expansion. IF it exists in the attributes of the vertex buffer
      // VERTEX POSITION
      vb_data[index++] = vpos_x;
      if(j===0) vb_data[index++] = geom.dim[1]*2;
      if(j===1) vb_data[index++] = 0;
      
      // DIMENTIONS
      vb_data[index++] = geom.dim[0] * num_faces;
      vb_data[index++] = geom.dim[1];
   */
   while (loop_count) {

      vb_data[index++] = y*2;
      vb_data[index+1] = y*num_faces;
      index += stride;
      
      vb_data[index++] = 0;
      vb_data[index+1] = y*num_faces;
      index += stride;
      
      vb_data[index++] = y*2;
      vb_data[index+1] = y*num_faces;
      index += stride;
      
      vb_data[index++] = 0;
      vb_data[index+1] = y*num_faces;
      index += stride;

      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_add_dim_xy(gfxInfo, x, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf;
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx];
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[dimidx];

   x*=2; y*=2;


   while (loop_count) {

      vb_data[index++] += 0;
      vb_data[index++] += y;
      index += stride;

      vb_data[index++] += 0;
      vb_data[index++] += 0;
      index += stride;

      vb_data[index++] += x;
      vb_data[index++] += y;
      index += stride;

      vb_data[index++] += x;
      vb_data[index++] += 0;
      index += stride;

      loop_count--;
   }


   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_add_dim_x(gfxInfo, x, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf;
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx] + 1;
   let loop_count = num_faces;
   // if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[dimidx];
   let stride = vb_info.attribs_info.count - 1;

   x*=2

   while (loop_count) {

      vb_data[index++] += 0;
      index += stride;

      vb_data[index++] += 0;
      index += stride;

      vb_data[index++] += x;
      index += stride;

      vb_data[index++] += x;
      index += stride;

      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_add_dim_y(gfxInfo, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf;
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx] + 1;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - 1;

   y*=2;

   while (loop_count) {

      vb_data[index++] += y;
      index += stride;

      vb_data[index++] += 0;
      index += stride;

      vb_data[index++] += y;
      index += stride;

      vb_data[index++] += 0;
      index += stride;

      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}



/**************************************************************************************************************************************/
// TEXTURE COORDINATES ATTRIBUTES
/**************************************************************************************************************************************/


// export function Gl_set_uv(vbidx, uvs, start, attr_offset, attr_size, attribs_per_vertex, num_faces = 1) {
export function Gl_set_uv(gfxInfo, uvs, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.tex_buf;
   const uvidx = gfxInfo.vb.which_attrib.tex_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[uvidx];
   // let index = start + vb_info.attribs_info.offsets[uvidx];
   let loop_count = num_faces;
   // if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[uvidx];



   while (loop_count) {

      vb_data[index++] = uvs[0];
      vb_data[index++] = uvs[3];
      index += stride;

      vb_data[index++] = uvs[0];
      vb_data[index++] = uvs[2];
      index += stride;

      vb_data[index++] = uvs[1];
      vb_data[index++] = uvs[3];
      index += stride;

      vb_data[index++] = uvs[1];
      vb_data[index++] = uvs[2];
      index += stride;

      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}

















/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



/**************************************************************************************************************************************/
// 
/**************************************************************************************************************************************/



















/**************************************************************************************************************************************/
// Add, Remove, Shift Attribs - Vertex Buffer Functions
/**************************************************************************************************************************************/

// TODO: We get the vb_infohere and in 'Vertex_buffer_remove_geometry()'
export function Gl_remove_geometry(gfx, num_faces = 1, start_index = 0, debug_mesh = null) {

   Vertex_buffer_remove_geometry(gfx, num_faces);

}



export function Gl_remove_geometry_params(vbidx, num_faces = 1, start_index = 0, attribsPerVertex, verticesPerRect) {

   const vb = Vertex_buffer_group_get_byidx(vbidx);
   const ib = Index_buffer_get_by_ibidx(vbidx);

   const start = start_index;

   // Structure to use for updating a removed mesh's start index pointing to it's location in the vertex buffer..
   const ret = {
      counts: [0, 0], // 0:vb, 1:ib
      start: start,
      last: (start + ((attribsPerVertex * verticesPerRect) * num_faces) >= vb.count) ? true : false,
      empty: false, // Is the buffer is empty?
   };

   ret.counts[0] = vb.Remove_geometry_params(num_faces, start, attribsPerVertex, verticesPerRect);
   // ret.counts[1] = ib.Remove_geometry(num_faces); // It doe not matter from where we remove indexes, as long as the vertices per face are same. 

   if (vb.count <= 0) ret.empty = true;

   if (ret.empty) vb.Reset();


   return ret;
}



export function Gl_set_vb_mesh_priority(progidx, vbIdx, meshIdx, meshCount) {

   const vb = Vertex_buffer_group_get_byidx(progidx, vbIdx);

   const meshStart = vb.meshes[meshIdx].vb.start;
   const meshSize = vb.meshes[meshIdx].vb.count;
   const allmeshCount = vb.meshes.length;

   const temp = new Array(meshCount);
   let c = meshStart;
   for (let i = 0; i < meshCount; i++) {
      temp[i] = new Float32Array(meshSize);
      for (let j = 0; j < meshSize; j++) {
         temp[i][j] = vb[c];
         c++;
      }
   }


   // 'Slide' all other meshes to the left by one mesh
   let start = vb.meshes[meshIdx].vb.start;
   let k = start;
   let meshNewIdx = meshIdx;

   for (let i = meshIdx + meshCount; i < allmeshCount; i++) {
      const newStart = vb.meshes[i].vb.start;
      const newSize = vb.meshes[i].vb.count;
      for (let j = newStart; j < newStart + newSize; j++) {
         vb[k] = vb[j];
         k++;
      }
      vb.meshes[i].vb.start = start;
      vb.meshes[i].meshIdx = meshNewIdx; // Update the meshe's index
      meshNewIdx++;
      start = k; // Keep the start of current mesh as the next's iteration previus meshe's start
   }

   /**
    *  Finally add the mesh at the end of the vb
    */
   let cnt = start;
   for (let i = 0; i < meshCount; i++) {
      for (let j = 0; j < meshSize; j++) {
         vb[cnt] = temp[i][j];
         cnt++;
      }
      vb.meshes[meshIdx + i].vb.start = start;
      vb.meshes[meshIdx + i].meshIdx = meshNewIdx; // Update the meshe's index
      start = cnt;
   }
}





/**************************************************************************************************************************************/
// Set Specific Attributes - Vertex Buffer Functions
/**************************************************************************************************************************************/


// export function Gl_set_RGBA_per_vertex(gfxInfo, color, num_faces = 1) {

//    // alert('IMPLEMENT ME. @ Gl_set_rgba()');
//    /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_rgba()'); }

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.COL4);

//    let index = gfxInfo.vb.start + a.offset;
//    let verts = num_faces * gfxInfo.vertsPerRect;
//    let stride = gfxInfo.attribsPerVertex - a.size;


//    let k = 0;

//    while (verts) {

//       vb_data[index++] = color[0];
//       vb_data[index++] = color[1];
//       vb_data[index++] = color[2];
//       vb_data[index++] = color[3];

//       vb_data[index++] = color[k][0];
//       vb_data[index++] = color[k][1];
//       vb_data[index++] = color[k][0];
//       vb_data[index++] = color[k][3];

//       index += stride;
//       vb_data.count += V_COL_COUNT;
//       k++;
//       if (k >= 4) k = 0;
//       verts--;

//       // index += stride; // Go to next vertice's pos. +1 for skipping pos.z
//       // verts--;
//    }


//    // let index = gfxInfo.vb.start + offset;
//    // let verts = num_faces * gfxInfo.vertsPerRect;
//    // let stride = gfxInfo.attribsPerVertex - V_COL_COUNT;

//    // if (gfxInfo.sid.attr & SID.ATTR.COL4_PER_VERTEX) {

//    //     let k = 0;
//    //     while (verts) {

//    //         vb_data[index++] = color[k][0];
//    //         vb_data[index++] = color[k][1];
//    //         vb_data[index++] = color[k][0];
//    //         vb_data[index++] = color[k][3];

//    //         index += stride;
//    //         vb_data.count += V_COL_COUNT;
//    //         k++;
//    //         if (k >= 4) k = 0;
//    //         verts--;
//    //     }
//    // }

//    // Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
//    // return count;

//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }




/** 'starts' and 'color_indices' should be of the same element couunt arrays */
// export function Gl_batch_set_RGBA(vbidx, starts, colors, color_indices, colors_len, attribsidx, num_faces) {

//    const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Get or pass the vertices per rect
//    const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
//    const shader_attribs_info = Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, SHADER_ATTRIBUTES.COL4);

//    let stride = shader_attribs_info.attribs_per_vertex - colors_len;

//    const color_indices_len = color_indices.length;
//    for(let i=0; i < color_indices_len; i++){

//       let index = starts[i] + shader_attribs_info.offset;
//       for(let j=0; j <= vertices_per_rect * num_faces; j++){

//          for(let k=0; k < colors_len; k++){
//             vb_data[index++] = colors[color_indices[i]+k]; 
//          }

//          index += stride;
//       }


//    }

//    Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
// }
/** 'starts' and 'color_indices' should be of the same element couunt arrays */
export function Gl_batch_set_RGBA(vb_groupidx, starts, colors, color_indices, colors_len, attribsidx, num_faces, color_offsets, which_attr_vb = null, counts, vertices_per_rect = 4) {

   // const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Get or pass the vertices per rect
   const vb_data = Vertex_buffer_get_by_vbidx(vb_groupidx);
   const shader_attribs_info = Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, SHADER_ATTRIBUTES.COL4);

   // let stride = shader_attribs_info.attribs_per_vertex - colors_len;
   // let stride = shader_attribs_info.attribs_per_vertex;
   let stride = counts[which_attr_vb.col_buf]/vertices_per_rect;

   const color_indices_len = color_indices.length;
   for (let i = 0; i < color_indices_len; i++) {

      let index = starts[i][0] + shader_attribs_info.offset;
      const verts_len = vertices_per_rect * num_faces[i]
      for (let j = 0; j < verts_len; j++) {

         for (let k = 0; k < colors_len; k++) {
            vb_data[index + color_offsets[k]] = colors[color_indices[i] + k];
         }

         index += stride;
      }


   }

   Vertex_buffer_state_enable(vb_groupidx, vb_groupidx + which_attr_vb.col_buf, BUFFER_STATE.NEEDS_UPDATE);
}


/** 'starts' and 'color_indices' should be of the same element couunt arrays */
export function Gl_batch_set_pos_xy(vb_groupidx, starts, pos, pos_indices, pos_len, attribsidx, num_faces, 
                                    pos_offsets, which_attr_vb = null, counts, vertices_per_rect = 4) {

   const vb_data = Vertex_buffer_get_by_vbidx(vb_groupidx);
   const shader_attribs_info = Shader_attributes_get_attribs_offset_size_attribs_per_vertex(attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

   // let stride = shader_attribs_info.attribs_per_vertex - (shader_attribs_info.size - 3);
   // let stride = shader_attribs_info.attribs_per_vertex;
   let stride = counts[which_attr_vb.wpos_buf]/vertices_per_rect;

   const pos_indices_len = pos_indices.length;
   for (let i = 0; i < pos_indices_len; i++) {

      let index = starts[i][0] + shader_attribs_info.offset;
      const verts_len = vertices_per_rect * num_faces[i]
      for (let j = 0; j < verts_len; j++) {

         let advance = 0;
         const pos_offsets_len = pos_offsets.length;
         for (let k = 0; k < pos_len; k++) {
            vb_data[index + pos_offsets[advance] + k] = pos[pos_indices[i] + k];
            advance++;
            if(advance >= pos_offsets_len-1) advance = 0;
         }

         index += stride;
      }


   }

   Vertex_buffer_state_enable(vb_groupidx, vb_groupidx + which_attr_vb.wpos_buf, BUFFER_STATE.NEEDS_UPDATE);
}



// export function Gl_set_alpha(gfxInfo, val, num_faces) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

//    let index = gfxInfo.vb.start + offset;
//    let verts = num_faces * gfxInfo.vertsPerRect;
//    let stride = gfxInfo.attribsPerVertex;

//    let i = 0;
//    while (verts) {

//       index += GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.ALPHA;
//       vb_data[index] = val; // Move mesh's x pos by amt

//       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
//       verts--;
//    }
//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }


/** Send the start of a mesh and offset it by num_faces */
export function Gl_set_alpha_from_offset(gfxInfo, val, from_offset, num_faces) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.COL4);

   // The 'from_offset' is in number of faces, so we convert to attributes
   const attr_offset = from_offset * gfxInfo.vertsPerRect * gfxInfo.prog.attribsidx;

   let index = gfxInfo.vb.start + attr_offset + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.ALPHA;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex;

   let i = 0;
   while (verts) {

      vb_data[index] = val; // Move mesh's x pos by amt

      index += stride; // Go to next alpha attrib
      verts--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_dim_XY2(vbidx, start, attribsidx, attribsPerVertex, x, y, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const a = Shader_attributes_get_attribs_offset_size(attribsidx, SHADER_ATTRIBUTES.POS2);

   let index = start + a.offset;
   let faces = num_faces;
   let stride = attribsPerVertex - a.size;


   while (faces) {

      vb_data[index++] = -x;
      vb_data[index++] = y;
      index += stride;

      vb_data[index++] = -x;
      vb_data[index++] = -y;
      index += stride;

      vb_data[index++] = x;
      vb_data[index++] = y;
      index += stride;

      vb_data[index++] = x;
      vb_data[index++] = -y;
      index += stride;

      faces--;
   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}
/**ΣΑΩΕ */
// export function Gl_set_dim_xy(gfxInfo, dim, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.POS2);

//    let index = gfxInfo.vb.start + a.offset;
//    let faces = num_faces;
//    let stride = gfxInfo.attribsPerVertex - a.size;


//    while (faces) {

//       vb_data[index++] = -dim[0];
//       vb_data[index++] = dim[1];
//       index += stride;

//       vb_data[index++] = -dim[0];
//       vb_data[index++] = -dim[1];
//       index += stride;

//       vb_data[index++] = dim[0];
//       vb_data[index++] = dim[1];
//       index += stride;

//       vb_data[index++] = dim[0];
//       vb_data[index++] = -dim[1];
//       index += stride;

//       faces--;
//    }

//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// export function Gl_set_dim_x(gfxInfo, x, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.POS2);

//    let index = gfxInfo.vb.start + offset;
//    let faces = num_faces;
//    let stride = gfxInfo.attribsPerVertex;

//    while (faces) {

//       vb_data[index] = -x;
//       index += stride;
//       vb_data[index] = -x;
//       index += stride;
//       vb_data[index] = x;
//       index += stride;
//       vb_data[index] = x;
//       index += stride;

//       faces--;

//    }

//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// export function Gl_set_dim_y(gfxInfo, y, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.POS2);

//    let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.DIM_Y;
//    let faces = num_faces;
//    let stride = gfxInfo.attribsPerVertex;

//    while (faces) {

//       vb_data[index] = y;
//       index += stride;
//       vb_data[index] = -y;
//       index += stride;
//       vb_data[index] = y;
//       index += stride;
//       vb_data[index] = -y;
//       index += stride;

//       faces--;
//    }
//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



export function Gl_add_wpos_xyz(gfxInfo, x, y, z, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   const stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XYZ;

   while (verts) {

      vb_data[index++] += x; // Move mesh's x pos by amt
      vb_data[index++] += y; // Move mesh's y pos by amt
      vb_data[index++] += z; // Move mesh's y pos by amt

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



// export function Gl_set_wpos_xy(gfxInfo, x, y, z, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

//    let index = gfxInfo.vb.start + offset;
//    let verts = num_faces * gfxInfo.vertsPerRect;
//    let stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XYZ;

//    while (verts) {

//       vb_data[index++] = x;
//       vb_data[index++] = y;
//       vb_data[index++] = z;


//       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
//       verts--;
//    }
//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



export function Gl_set_wpos_XY2(vbidx, start, attribsidx, attribsPerVertex, vertsPerRect, x, y, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);


   let index = start + offset;
   let verts = num_faces * vertsPerRect;
   let stride = attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XY;

   while (verts) {

      vb_data[index++] = x; // Move mesh's x pos by amt
      vb_data[index++] = y; // Move mesh's y pos by amt

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      verts--;
   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}
/**SAVE */
// export function Gl_set_wpos_xy(gfxInfo, x, y, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

//    let index = gfxInfo.vb.start + offset;
//    let verts = num_faces * gfxInfo.vertsPerRect;
//    let stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XY;

//    while (verts) {

//       vb_data[index++] = x; // Move mesh's x pos by amt
//       vb_data[index++] = y; // Move mesh's y pos by amt

//       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
//       verts--;
//    }

//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// export function Gl_add_wpos_xy(gfxInfo, x, y, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

//    let index = gfxInfo.vb.start + offset;
//    let verts = num_faces * gfxInfo.vertsPerRect;
//    let stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XY;

//    while (verts) {

//       vb_data[index++] += x; // Move mesh's x pos by amt
//       vb_data[index++] += y; // Move mesh's y pos by amt

//       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
//       verts--;
//    }
//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }




// export function Gl_add_wpos_y(gfxInfo, y, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

//    let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.WPOS_Y;
//    let verts = num_faces * gfxInfo.vertsPerRect;
//    let stride = gfxInfo.attribsPerVertex

//    while (verts) {

//       vb_data[index] += y; // Move mesh's x pos by amt
//       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
//       verts--;
//    }
//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// export function Gl_set_wpos_x(gfxInfo, x, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

//    let index = gfxInfo.vb.start + offset;
//    let faces = num_faces; // Number of vertices
//    let stride = gfxInfo.attribsPerVertex;

//    while (faces) {

//       vb_data[index] = x;
//       index += stride; // Go to next vertice's wposx.
//       vb_data[index] = x;
//       index += stride; // Go to next vertice's wposx.
//       vb_data[index] = x;
//       index += stride; // Go to next vertice's wposx.
//       vb_data[index] = x;
//       index += stride; // Go to next vertice's wposx.

//       faces--;
//    }

//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// export function Gl_set_wpos_y(gfxInfo, y, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

//    let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.WPOS_Y;
//    let faces = num_faces; // Number of vertices
//    let stride = gfxInfo.attribsPerVertex; // Offset to next scale[0] attribute

//    while (faces) {

//       vb_data[index] = y;
//       index += stride; // Go to next vertice's wposx.
//       vb_data[index] = y;
//       index += stride; // Go to next vertice's wposx.
//       vb_data[index] = y;
//       index += stride; // Go to next vertice's wposx.
//       vb_data[index] = y;
//       index += stride; // Go to next vertice's wposx.

//       faces--;
//    }
//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



export function Gl_set_wpos_Z(gfxInfo, z, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

   let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.WPOS_Z;
   let faces = num_faces; // Number of vertices
   let stride = gfxInfo.attribsPerVertex;

   while (faces) {

      vb_data[index] = z;
      index += stride; // Go to next vertice's wposx.
      vb_data[index] = z;
      index += stride; // Go to next vertice's wposx.
      vb_data[index] = z;
      index += stride; // Go to next vertice's wposx.
      vb_data[index] = z;
      index += stride; // Go to next vertice's wposx.

      faces--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function GlSetAttrRoundCorner(gfxInfo, val) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.GENERIC_ATTR1_VEC4);

   let index = gfxInfo.vb.start + offset + V_ROUND_CORNER_STRIDE;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - 1; // Minus 1 attr that we are setting

   while (verts) {

      vb_data[index++] = val;

      index += stride; // Go to next vertice's borderWidth attrib.
      verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function GlSetAttrBorderWidth(gfxInfo, val) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.GENERIC_ATTR1_VEC4);

   let index = gfxInfo.vb.start + offset + V_BORDER_WIDTH_STRIDE;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - 1; // Minus 1 attr that we are setting

   while (verts) {

      vb_data[index++] = val;

      index += stride; // Go to next vertice's borderWidth attrib.
      verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function GlSetAttrBorderFeather(gfxInfo, val) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.GENERIC_ATTR1_VEC4);

   let index = gfxInfo.vb.start + offset + V_BORDER_FEATHER_STRIDE;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - 1; // Minus 1 attr that we are setting

   while (verts) {

      vb_data[index++] = val;

      index += stride; // Go to next vertice's borderWidth attrib.
      verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



// export function Gl_set_uv(gfxInfo, uvs, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
//    const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.TEX2);

//    let index = gfxInfo.vb.start + a.offset;
//    // let numTimes = num_faces;
//    let stride = gfxInfo.attribsPerVertex - a.size;

//    while (num_faces) {

//       vb_data[index++] = uvs[0];
//       vb_data[index++] = uvs[3];
//       index += stride;

//       vb_data[index++] = uvs[0];
//       vb_data[index++] = uvs[2];
//       index += stride;

//       vb_data[index++] = uvs[1];
//       vb_data[index++] = uvs[3];
//       index += stride;

//       vb_data[index++] = uvs[1];
//       vb_data[index++] = uvs[2];
//       index += stride;

//       num_faces--;
//    }

//    Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
// }



// export function Gl_set_uv(vbidx, uvs, start, attr_offset, attr_size, attribs_per_vertex, num_faces = 1) {

//    const vb_data = Vertex_buffer_get_by_vbidx(vbidx);

//    let index = start + attr_offset;
//    // let numTimes = num_faces;
//    let stride = attribs_per_vertex - attr_size;

//    while (num_faces) {

//       vb_data[index++] = uvs[0];
//       vb_data[index++] = uvs[3];
//       index += stride;

//       vb_data[index++] = uvs[0];
//       vb_data[index++] = uvs[2];
//       index += stride;

//       vb_data[index++] = uvs[1];
//       vb_data[index++] = uvs[3];
//       index += stride;

//       vb_data[index++] = uvs[1];
//       vb_data[index++] = uvs[2];
//       index += stride;

//       num_faces--;
//    }

// }


export function Gl_set_wpos_time(gfxInfo, val) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

   let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.WPOS4_TIME;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex;

   while (verts) {

      vb_data[index] = val;
      index += stride; // Go to next vertice's borderWidth attrib.
      verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE); // HACK. // TODO suppose to be implemented in MESH????
}




/**************************************************************************************************************/
// Particle System: Batch Update Particles


export function Gl_particles_batch_set_col4_wpos4_pos2_style3(vbidx, start, colors, positions, time) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);

   let index = start;


   const col = colors;
   const pos = positions;
   const t = time;

   // V1
   vb_data[index++] = col[0];
   vb_data[index++] = col[1];
   vb_data[index++] = col[2];
   vb_data[index++] = col[3];

   vb_data[index++] = pos[0];
   vb_data[index++] = pos[1];
   vb_data[index++] = pos[2];
   vb_data[index++] = t;
   
   index+=8; // TODO: add the stride - the inserted count
   
   
   // V2
   vb_data[index++] = col[0];
   vb_data[index++] = col[1];
   vb_data[index++] = col[2];
   vb_data[index++] = col[3];
   
   vb_data[index++] = pos[0];
   vb_data[index++] = pos[1];
   vb_data[index++] = pos[2];
   vb_data[index++] = t;
   
   index+=8; // TODO: add the stride - the inserted count
   
   
   // V3
   vb_data[index++] = col[0];
   vb_data[index++] = col[1];
   vb_data[index++] = col[2];
   vb_data[index++] = col[3];
   
   vb_data[index++] = pos[0];
   vb_data[index++] = pos[1];
   vb_data[index++] = pos[2];
   vb_data[index++] = t;
   
   index+=8; // TODO: add the stride - the inserted count
   
   
   // V4
   vb_data[index++] = col[0];
   vb_data[index++] = col[1];
   vb_data[index++] = col[2];
   vb_data[index++] = col[3];
   
   vb_data[index++] = pos[0];
   vb_data[index++] = pos[1];
   vb_data[index++] = pos[2];
   vb_data[index++] = t;
   
   index+=8; // TODO: add the stride - the inserted count
}


export function Gl_particles_batch_set_col4_wpos4_pos2_dim2_rot4(vbidx, start, colors, positions, time, p, r) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);

   let index = start;
   const len = 1;

   for (let i = 0; i < len; i++) {

      const col = colors;
      const pos = positions;
      const t = time;
      // const dim = dim;

      // V1
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      vb_data[index++] = -p[0]*r[0] + p[1]*r[2];
      vb_data[index++] = -p[0]*r[1] + p[1]*r[3];

      index+=2
		

      // V2
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      vb_data[index++] = -p[0]*r[0] + -p[1]*r[2];
      vb_data[index++] = -p[0]*r[1] + -p[1]*r[3];

      index+=2
      
      
      // V3
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      vb_data[index++] = p[0]*r[0] + p[1]*r[2];
      vb_data[index++] = p[0]*r[1] + p[1]*r[3];
      
      index+=2
      
      
      // V4
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      vb_data[index++] =  p[0]*r[0] + -p[1]*r[2]; //console.log(r)
      vb_data[index++] =  p[0]*r[1] + -p[1]*r[3];
      index+=2
   }

}


export function Gl_particles_batch_set_col4_wpos4_pos2_dim2_tex2_rot4(vbidx, start, colors, positions, time, p, r, uvs) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);

   let index = start;
   const len = 1;

   for (let i = 0; i < len; i++) {

      const col = colors;
      const pos = positions;
      const t = time;
      // const dim = dim;

      // V1
      // VERTEX COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      // WORLD POSITION + TIME
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      // VERTEX POSITION
      vb_data[index++] = -p[0]*r[0] + p[1]*r[2];
      vb_data[index++] = -p[0]*r[1] + p[1]*r[3];

      // TEXTURE COORDS
      vb_data[index++] = uvs[0];
      vb_data[index++] = uvs[2];

      index+=2
		

      // V2
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      vb_data[index++] = -p[0]*r[0] + -p[1]*r[2];
      vb_data[index++] = -p[0]*r[1] + -p[1]*r[3];
      
      // TEXTURE COORDS
      vb_data[index++] = uvs[0];
      vb_data[index++] = uvs[3];

      index+=2
      
      
      // V3
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      vb_data[index++] = p[0]*r[0] + p[1]*r[2];
      vb_data[index++] = p[0]*r[1] + p[1]*r[3];
      
      // TEXTURE COORDS
      vb_data[index++] = uvs[1];
      vb_data[index++] = uvs[2];

      index+=2
      
      
      // V4
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      vb_data[index++] =  p[0]*r[0] + -p[1]*r[2]; //console.log(r)
      vb_data[index++] =  p[0]*r[1] + -p[1]*r[3];

      // TEXTURE COORDS
      vb_data[index++] = uvs[1];
      vb_data[index++] = uvs[3];

      index+=2
   }

}


export function Gl_particles_batch_set_col4_wpos4_pos2(vbidx, start, colors, positions, time) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);

   let index = start;
   const len = 1;

   for (let i = 0; i < len; i++) {

      const col = colors;
      const pos = positions;
      const t = time;

      // V1
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2]; 
      vb_data[index++] = t;
      
      index+=4
      
      
      // V2
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      index+=4
      
      
      // V3
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      index+=4
      
      
      // V4
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      vb_data[index++] = t;
      
      index+=4
   }

}






// NOT IMPLEMENTED
export function GlSetAttrSdfParams(gfxInfo, val) {
   alert("IMPLEMENT ME")
   // const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   // const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

   // let index = gfxInfo.vb.start + progs.buffer[gfxInfo.prog.idx].shaderinfo.attributes.offset.sdf;
   // let verts = num_faces * gfxInfo.vertsPerRect;
   // let stride = gfxInfo.attribsPerVertex - V_SDF_COUNT;

   // while (verts) {

   //     vb_data[index++] = val[0];
   //     vb_data[index++] = val[1];

   //     index += stride; // Go to next vertice's borderWidth attrib.
   //     verts--;
   // }
   // Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}
export function GlSetAttrSdfParamsOuter(gfxInfo, val) {
   alert("IMPLEMENT ME")
   // const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   // const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES

   // let index = gfxInfo.vb.start + progs.buffer[gfxInfo.prog.idx].shaderinfo.attributes.offset.sdf;
   // let verts = num_faces * gfxInfo.vertsPerRect;
   // let stride = gfxInfo.attribsPerVertex - V_SDF_COUNT;

   // while (verts) {

   //     index++; // Skip sdf-inner param 
   //     vb_data[index++] = val;

   //     index += stride; // Go to next vertice's borderWidth attrib.
   //     verts--;
   // }
   // Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}
export function GlSetAttrParams1(gfxInfo, param, paramOffset) {
   alert("IMPLEMENT ME")

   // const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   // const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.GENERIC_ATTR1_VEC4);

   // let index = gfxInfo.vb.start + progs.buffer[gfxInfo.prog.idx].shaderinfo.attributes.offset.params1 + paramOffset;
   // let verts = num_faces * gfxInfo.vertsPerRect;
   // let stride = gfxInfo.attribsPerVertex - 1;

   // while (verts) {
   //     vb_data[index++] = param[paramOffset];
   //     index += stride;
   //     verts--;
   // }
   // Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}













/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/






export function GlRotateZ2D(gfxInfo, dim, angle, num_faces = 1) {


   const vbidx = gfxInfo.vb.which_vb.dim_buf;
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx];
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[dimidx];

   const newPos = RotateZ(dim, angle)
   
   vb_data[index++] = newPos[0];
   vb_data[index++] = newPos[1];
   index += stride;
   vb_data[index++] = newPos[2];
   vb_data[index++] = newPos[3];
   index += stride;
   vb_data[index++] = newPos[4];
   vb_data[index++] = newPos[5];
   index += stride;
   vb_data[index++] = newPos[6];
   vb_data[index++] = newPos[7];
   
   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}

