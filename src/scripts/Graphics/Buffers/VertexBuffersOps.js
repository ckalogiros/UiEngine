"use strict";

import { RotateY, RotateZ, RotateZ_with_pivot } from "../../Helpers/Math/Matrix.js";
import { Shader_attributes_get_attribs_offset_attribs_per_vertex, Shader_attributes_get_attribs_offset_size_attribs_per_vertex } from "../ShaderAttributes.js";
import { Index_buffer_get_by_ibidx } from "./IndexBuffers.js";
import { Vertex_buffer_render_group_set_state } from "./RenderGroups.js";
import { VBI_get_byidx, Vertex_buffer_get_by_vbidx, Vertex_buffer_group_get_byidx, Vertex_buffer_remove_geometry, Vertex_buffer_state_enable } from "./VertexBuffers.js";










/**************************************************************************************************************************************/
// COLOR ATTRIBUTES
/**************************************************************************************************************************************/
/** */
export function Gl_set_rgb(gfx, color, num_faces = 1) {

   /**DEBUG*/if (gfx === null) { alert('GFX is null. @ Gl_set_rgba()'); }

   const vbidx = gfx.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - (vb_info.attribs_info.sizes[vbidx] - 1);


   while (loop_count) {

      vb_data[index++] = color[0];
      vb_data[index++] = color[1];
      vb_data[index++] = color[2];

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_rgb_specific_index(gfx, color, num_faces = 1, start_face) {

   /**DEBUG*/if (gfx === null) { alert('GFX is null. @ Gl_set_rgba()'); }

   const vbidx = gfx.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   // let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx];
   let index = gfx.vb.starts.buffer[vbidx] + (start_face * gfx.vertsPerRect * vb_info.attribs_info.count) + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - (vb_info.attribs_info.sizes[vbidx] - 1);


   while (loop_count) {

      vb_data[index++] = color[0];
      vb_data[index++] = color[1];
      vb_data[index++] = color[2];

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_rgba(gfx, color, num_faces = 1) {

   /**DEBUG*/if (gfx === null) { alert('GFX is null. @ Gl_set_rgba()'); }

   const vbidx = gfx.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   // const a = Shader_attributes_get_attribs_offset_size(gfx.prog.attribsidx, SID.ATTR.COL4);

   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vbidx];


   while (loop_count) {

      vb_data[index++] = color[0];
      vb_data[index++] = color[1];
      vb_data[index++] = color[2];
      vb_data[index++] = color[3];

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

   Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_alpha(gfx, alpha, num_faces = 1) {

   /**DEBUG*/if (gfx === null) { alert('GFX is null. @ Gl_set_rgba()'); }

   const vbidx = gfx.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   // const a = Shader_attributes_get_attribs_offset_size(gfx.prog.attribsidx, SID.ATTR.COL4);

   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx] + 3;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - 1;


   while (loop_count) {

      vb_data[index++] = alpha;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_rgba_per_vertex(gfx, color, num_faces = 1) {

   /**DEBUG*/if (gfx === null) { alert('GFX is null. @ Gl_set_rgba_per_vertex()'); }

   const vbidx = gfx.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vbidx];

   // console.log(color)

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

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_rgba_per_vertex_specify_vertex(gfx, color, num_faces = 1, vertex_idx, vertex_count) {

   /**DEBUG*/if (gfx === null) { alert('GFX is null. @ Gl_set_rgba_per_vertex()'); }

   const vbidx = gfx.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   let stride = vb_info.attribs_info.count;
   // let index = (gfx.vb.starts.buffer[vbidx] + (face_idx * stride * vertex_idx)) + vb_info.attribs_info.offsets[vbidx];
   let index = (gfx.vb.starts.buffer[vbidx] + (vertex_idx * vb_info.attribs_info.count)) + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces * vertex_count;
   // if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;

   // TODO: In case we want to update a specific vertex (vertex top-right) in a mesh with more than one face, 
   // TODO: we need a second loop and a stride, to reach the next equivalent vertex in the next mesh's face

   let k = 0;

   while (loop_count) {

      vb_data[index + 0] = color[0];
      vb_data[index + 1] = color[1];
      vb_data[index + 2] = color[2];
      vb_data[index + 3] = color[3];

      index += stride; // Go to next vertex color attribute.
      loop_count--;
      k++;

   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_rgba_specify_attribute(gfx, value, num_faces = 1, vertex_idx, vertex_count, attribidx) {

   /**DEBUG*/if (gfx === null) { alert('GFX is null. @ Gl_set_rgba_per_vertex()'); }

   // console.error('SEE the implementation of Gl_set_rgba_specify_attribute() function for color picker')

   const vbidx = gfx.vb.which_vb.col_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   let stride = vb_info.attribs_info.count;
   // let index = (gfx.vb.starts.buffer[vbidx] + (face_idx * stride * vertex_idx)) + vb_info.attribs_info.offsets[vbidx];
   let index = (gfx.vb.starts.buffer[vbidx] + (vertex_idx * vb_info.attribs_info.count)) + vb_info.attribs_info.offsets[vbidx];
   let loop_count = num_faces * vertex_count;
   // if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;

   // TODO: In case we want to update a specific vertex (vertex top-right) in a mesh with more than one face, 
   // TODO: we need a second loop and a stride, to reach the next equivalent vertex in the next mesh's face

   let k = 0;

   while (loop_count) {

      vb_data[index + attribidx] = value;
      // vb_data[index+1] = color[1];
      // vb_data[index+2] = color[2];
      // vb_data[index+3] = color[3];

      index += stride; // Go to next vertex color attribute.
      loop_count--;
      k++;

   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}










/**************************************************************************************************************************************/
// WORLD POSITION ATTRIBUTES
/**************************************************************************************************************************************/
/** */
export function Gl_add_wpos_xy(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.WPOS3;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] += x;
      vb_data[index++] += y;

      index += stride;
      loop_count--;
   }

   Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_wpos_x(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.WPOS3;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 2;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] += x;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_wpos_y(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.WPOS3;
   const a_offset = vb_info.attribs_info.offsets[attr_idx] + 1;
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 2;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   // console.log(y)

   while (loop_count) {

      vb_data[index++] += y;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_wpos_xy(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.WPOS3;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] = x;
      vb_data[index++] = y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_wpos_x(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.WPOS3;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 2;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] = x;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_wpos_y(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.WPOS3;
   const a_offset = vb_info.attribs_info.offsets[attr_idx] + 1;
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 2;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;


   while (loop_count) {

      vb_data[index++] = y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}










/**************************************************************************************************************************************/
// VERTEX POSITION ATTRIBUTES
/**************************************************************************************************************************************/
/** */
export function Gl_set_vpos_xy(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];


   let index = start + a_offset;
   let stride = vb_info.attribs_info.count - a_size;

   // Devide cause we use twice the x and y, once for minus and once for plus
   const xx = x;
   const yy = y;

   // const len = (num_faces * gfx.verts_per_face)+2;
   // Set_vertex_position_VPOS2(vb_data, start + a_offset, vb_info.attribs_info.count, xx, yy, num_faces, len)


   /**Contol point of resize left-top */
   vb_data[index++] = -xx;
   vb_data[index++] = -yy;
   index += stride;

   vb_data[index++] = -xx;
   vb_data[index++] = yy;
   index += stride;

   vb_data[index++] = xx;
   vb_data[index++] = -yy;
   index += stride;

   vb_data[index++] = xx;
   vb_data[index++] = yy;


      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/**
 * ISSUE:
 * Currently we use vpos and dim to set the position of the vertices of a face and the dimention as a const value.
 * For meshes that do not have DIM2 attribute enabled, on changing the dimention of the mesh,
 * we need to manipulate the vertex position attribute.
 * For the meshes with DIM2 attribute, we just manipulate the dim attribute. 
 */
/** */
export function Gl_set_vpos_x(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - a_size;


   while (loop_count) {

      vb_data[index++] = -x;
      index += stride;

      vb_data[index++] = -x;
      index += stride;

      vb_data[index++] = x;
      index += stride;

      vb_data[index++] = x;
      index += stride;

      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_vpos_y(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx] + 1;
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - a_size;


   while (loop_count) {

      vb_data[index++] = -y;
      index += stride;

      vb_data[index++] = y;
      index += stride;

      vb_data[index++] = -y;
      index += stride;

      vb_data[index++] = y;
      index += stride;

      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_vpos_xy(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - a_size;


   while (loop_count) {

      vb_data[index++] += -x;
      vb_data[index++] += -y;
      index += stride;

      vb_data[index++] += -x;
      vb_data[index++] += y;
      index += stride;

      vb_data[index++] += x;
      vb_data[index++] += -y;
      index += stride;

      vb_data[index++] += x;
      vb_data[index++] += y;
      index += stride;

      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_vpos_x(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   // if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] += -x;
      index += stride;

      vb_data[index++] += -x;
      index += stride;

      vb_data[index++] += x;
      index += stride;

      vb_data[index++] += x;
      index += stride;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_vpos_y(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx] + 1;
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   // if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] += -y;
      index += stride;

      vb_data[index++] += y;
      index += stride;

      vb_data[index++] += -y;
      index += stride;

      vb_data[index++] += y;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}

/** */
export function Gl_add_vpos_xy_right(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];


   let index = start + a_offset;
   let stride = vb_info.attribs_info.count - a_size;

   // Devide cause we use twice the x and y, once for minus and once for plus
   const xx = x;
   const yy = y;

   // const len = (num_faces * gfx.verts_per_face)+2;
   // Set_vertex_position_VPOS2(vb_data, start + a_offset, vb_info.attribs_info.count, xx, yy, num_faces, len)


   /**Contol point of resize left-top */
   index++;
   index++;
   index += stride;

   index++;
   index++;
   index += stride;

   vb_data[index++] = xx;
   vb_data[index++] = -yy;
   index += stride;

   vb_data[index++] = xx;
   vb_data[index++] = yy;


      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_vpos_xy_left(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];


   let index = start + a_offset;
   let stride = vb_info.attribs_info.count - a_size;

   // Devide cause we use twice the x and y, once for minus and once for plus
   const xx = x;
   const yy = y;

   // const len = (num_faces * gfx.verts_per_face)+2;
   // Set_vertex_position_VPOS2(vb_data, start + a_offset, vb_info.attribs_info.count, xx, yy, num_faces, len)


   /**Contol point of resize left-top */
   vb_data[index++] = -xx;
   vb_data[index++] = -yy;
   index += stride;

   vb_data[index++] = -xx;
   vb_data[index++] = yy;
   index += stride;

   index++;
   index++;
   index += stride;

   index++;
   index++;


      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_vpos_xy_diag_1(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - a_size;


   while (loop_count) {

      vb_data[index++] += -x;
      vb_data[index++] += -y;
      index += stride;

      index++;
      index++;
      // vb_data[index++] += -x;
      // vb_data[index++] += y;
      index += stride;

      index++;
      index++;
      // vb_data[index++] += x;
      // vb_data[index++] += -y;
      index += stride;

      vb_data[index++] += x;
      vb_data[index++] += y;
      index += stride;

      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_vpos_x_right(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   // if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      index++;
      index += stride;

      index++;
      index += stride;

      vb_data[index++] += x;
      index += stride;

      vb_data[index++] += x;
      index += stride;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_vpos_x_left(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   // if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] += -x;
      index += stride;

      vb_data[index++] += -x;
      index += stride;

      index++;
      index += stride;

      index++;
      index += stride;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_vpos_y_top(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      index++;
      vb_data[index++] = y;
      index += stride;
      
      index++;
      index++;
      index += stride;

      index++;
      vb_data[index++] = y;
      index += stride;
      
      index++;
      index++;
      index += stride;


      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_vpos_y_bottom(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.VPOS2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      index += stride;
      vb_data[index++] = y;

      index += stride;
      vb_data[index++] = y;

      index++;
      index += stride;

      index++;
      index += stride;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}










/**************************************************************************************************************************************/
// DIMENTION ATTRIBUTES (FOR RECTANGLE MESHES ONLY)
/**************************************************************************************************************************************/
/** */
export function Gl_set_dim_xy(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.DIM2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let stride = vb_info.attribs_info.count - a_size;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;

   while (loop_count) {

      vb_data[index++] = x;
      vb_data[index++] = y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_dim_x(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.DIM2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] = x;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }


      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_dim_y(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.DIM2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx] + 1;
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] = y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}

/** */
export function Gl_add_dim_xy(gfx, x, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.DIM2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] += x;
      vb_data[index++] += y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_dim_x(gfx, x, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.DIM2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] += x;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_dim_y(gfx, y, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.DIM2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx] + 1;
   const a_size = vb_info.attribs_info.sizes[attr_idx] - 1;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;

   while (loop_count) {

      vb_data[index++] += y;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}










/**************************************************************************************************************************************/
// TEXTURE COORDINATES ATTRIBUTES
/**************************************************************************************************************************************/
/** */
export function Gl_set_uv(gfx, uvs, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.tex_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.TEX2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   let stride = vb_info.attribs_info.count - a_size;

   const u0 = uvs[0];
   const u1 = uvs[1];
   const v0 = uvs[2];
   const v1 = uvs[3];


   while (loop_count) {

      vb_data[index++] = u0;
      vb_data[index++] = v0;
      index += stride;

      vb_data[index++] = u0;
      vb_data[index++] = v1;
      index += stride;

      vb_data[index++] = u1;
      vb_data[index++] = v0;
      index += stride;

      vb_data[index++] = u1;
      vb_data[index++] = v1;
      index += stride;

      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}










/**************************************************************************************************************************************/
// VERTEX GENERIC ATTRIBUTES
/**************************************************************************************************************************************/
/** */
export function Gl_set_attr_round_corners(gfx, r, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.R_CORNERS;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] = r;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_attr_feather(gfx, val, num_faces = 1) {

   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.FEATHER;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;


   while (loop_count) {

      vb_data[index++] = val;

      index += stride;
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_angle(gfx, val, num_faces = 1) {

   const vbidx = 0;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.ANGLE;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] = val;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_angle(gfx, val, num_faces = 1) {

   const vbidx = 0;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.ANGLE;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] += val;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_time(gfx, val, num_faces = 1) {

   const vbidx = 0;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.TIME;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] = val;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_time(gfx, val, num_faces = 1) {

   const vbidx = 0;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.TIME;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      vb_data[index++] += val;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_set_generic2(gfx, geom, num_faces = 1) {

   const vbidx = 0;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   // let size = 0;
   // if(val1!==null) size++;
   // if(val2!==null) size++;

   const attr_idx = vb_info.attribs_indexing.GENERIC2;
   const a_size = vb_info.attribs_info.sizes[attr_idx];
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   // const a_size = size;

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;
   // let stride = vb_info.attribs_info.count - size;



   while (loop_count) {

      // if(val1) vb_data[index++] = val1;
      // if(val2) vb_data[index++] = val2;
      vb_data[index++] = geom.generic.a;
      vb_data[index++] = geom.generic.b;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_add_generic2(gfx, geom, num_faces = 1) {

   const vbidx = 0;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);

   const attr_idx = vb_info.attribs_indexing.GENERIC2;
   const a_offset = vb_info.attribs_info.offsets[attr_idx];
   const a_size = vb_info.attribs_info.sizes[attr_idx];

   const start = gfx.vb.starts.buffer[vbidx];

   let index = start + a_offset;
   let loop_count = num_faces;
   if (gfx.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfx.vertsPerRect;
   let stride = vb_info.attribs_info.count - a_size;



   while (loop_count) {

      // vb_data[index++] += val1;
      // vb_data[index++] += val2;
      vb_data[index++] += geom.generic.a;
      vb_data[index++] += geom.generic.b;

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      loop_count--;
   }

      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}


/** */
export function Gl_rotate_z_2d_from_pivot(gfx, dim, angle, pivotx, pivoty, num_faces = 1) {


   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vpos_attr_idx = vb_info.attribs_indexing.VPOS2; // The index of the offset to access the correct attribute.
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);


   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vpos_attr_idx];
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vpos_attr_idx];

   const newPos = RotateZ_with_pivot(dim, angle, pivotx, pivoty);

   vb_data[index++] = newPos[0];
   vb_data[index++] = newPos[1]; index += stride;
   vb_data[index++] = newPos[2];
   vb_data[index++] = newPos[3]; index += stride;
   vb_data[index++] = newPos[4];
   vb_data[index++] = newPos[5]; index += stride;
   vb_data[index++] = newPos[6];
   vb_data[index++] = newPos[7];


   Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);

   return newPos;
}
/** */
export function Gl_rotate_z_2d(gfx, dim, angle, num_faces = 1) {


   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vpos_attr_idx = vb_info.attribs_indexing.VPOS2; // The index of the offset to access the correct attribute.
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);


   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vpos_attr_idx];
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vpos_attr_idx];

   const newPos = RotateZ(dim, angle)

   vb_data[index++] = newPos[0];
   vb_data[index++] = newPos[1]; index += stride;
   vb_data[index++] = newPos[2];
   vb_data[index++] = newPos[3]; index += stride;
   vb_data[index++] = newPos[4];
   vb_data[index++] = newPos[5]; index += stride;
   vb_data[index++] = newPos[6];
   vb_data[index++] = newPos[7];



   Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_rotate_add_z_2d(gfx, dim, angle, num_faces = 1) {


   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vpos_attr_idx = vb_info.attribs_indexing.VPOS2; // The index of the offset to access the correct attribute.
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);


   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vpos_attr_idx];
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vpos_attr_idx];

   const newPos = RotateZ(dim, angle)

   vb_data[index++] += newPos[0];
   vb_data[index++] += newPos[1]; index += stride;
   vb_data[index++] += newPos[2];
   vb_data[index++] += newPos[3]; index += stride;
   vb_data[index++] += newPos[4];
   vb_data[index++] += newPos[5]; index += stride;
   vb_data[index++] += newPos[6];
   vb_data[index++] += newPos[7];



      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function Gl_rotate_y_2d(gfx, dim, angle, num_faces = 1) {


   const vbidx = gfx.vb.which_vb.dim_buf;
   const vb_info = VBI_get_byidx(gfx.vb.idxs.buffer[vbidx]);
   const vpos_attr_idx = vb_info.attribs_indexing.VPOS2; // The index of the offset to access the correct attribute.
   const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idxs.buffer[vbidx]);


   let index = gfx.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[vpos_attr_idx];
   // let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[vpos_attr_idx];
   let stride = vb_info.attribs_info.count - 3;

   const newPos = RotateY(dim, angle)

   vb_data[index++] = newPos[0];
   vb_data[index++] = newPos[1];
   vb_data[index++] = newPos[2]; index += stride;
   vb_data[index++] = newPos[3];
   vb_data[index++] = newPos[4];
   vb_data[index++] = newPos[5];
   vb_data[index++] = newPos[6]; index += stride;
   vb_data[index++] = newPos[7];
   vb_data[index++] = newPos[8];
   vb_data[index++] = newPos[9];
   vb_data[index++] = newPos[10]; index += stride;
   vb_data[index++] = newPos[11];
   vb_data[index++] = newPos[12];



      Vertex_buffer_render_group_set_state(gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   // Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}










/**************************************************************************************************************************************/
// Set Specific Attributes - Vertex Buffer Functions
/**************************************************************************************************************************************/
// TODO: IMPLEMENT










/**************************************************************************************************************************************/
// Set Specific Attributes - Vertex Buffer Functions
/**************************************************************************************************************************************/
/** 'starts' and 'color_indices' should be of the same element count arrays */
export function Gl_batch_set_RGBA(vb_groupidx, starts, colors, color_indices, colors_len, attribsidx, num_faces, color_offsets, which_attr_vb = null, counts, vertices_per_rect = 4) {

   // const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Get or pass the vertices per rect
   const vb_data = Vertex_buffer_get_by_vbidx(vb_groupidx);
   const shader_attribs_info = Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, SID.ATTR.COL4);

   // let stride = shader_attribs_info.attribs_per_vertex - colors_len;
   // let stride = shader_attribs_info.attribs_per_vertex;
   let stride = counts[which_attr_vb.col_buf] / vertices_per_rect;

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
export function Gl_batch_set_pos_xy(vb_groupidx, starts, pos, pos_indices, pos_len, attribsidx, num_faces, pos_offsets, which_attr_vb = null, counts, vertices_per_rect = 4) {


   const vb_data = Vertex_buffer_get_by_vbidx(vb_groupidx);
   const shader_attribs_info = Shader_attributes_get_attribs_offset_size_attribs_per_vertex(attribsidx, SID.ATTR.WPOS3);

   // let stride = shader_attribs_info.attribs_per_vertex - (shader_attribs_info.size - 3);
   // let stride = shader_attribs_info.attribs_per_vertex;
   let stride = counts[which_attr_vb.wpos_buf] / vertices_per_rect;

   const pos_indices_len = pos_indices.length;
   for (let i = 0; i < pos_indices_len; i++) {

      let index = starts[i][0] + shader_attribs_info.offset;
      const verts_len = vertices_per_rect * num_faces[i]
      for (let j = 0; j < verts_len; j++) {

         let advance = 0;
         const pos_offsets_len = pos_offsets.length;
         for (let k = 0; k < pos_len; k++) {
            vb_data[index + pos_offsets[advance] + k] += pos[pos_indices[i] + k];
            advance++;
            if (advance >= pos_offsets_len - 1) advance = 0;
         }

         index += stride;
      }


   }

   Vertex_buffer_state_enable(vb_groupidx, vb_groupidx + which_attr_vb.wpos_buf, BUFFER_STATE.NEEDS_UPDATE);
}










/**************************************************************************************************************/
// Particle System: Batch Update Particles
/** */
export function Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = r; 
   // console.log(vb_data[index], r, start, vbidx)
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V2
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V3
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V4
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
}
/** */
export function Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {
   
   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;
   
   // V1
   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
   
   // V2
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
   
   // V3
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
   
   // V4
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
}
/** */
export function Gl_particles_batch_set_col4_wpos3_vpos2_dim2_tex2_with_rotation(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {
   // console.error('CALCULATE THE STRIDE CORRECTLY')
   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w * rot0 + h * rot2;
   vb_data[index++] = -w * rot1 + h * rot3;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = u1;
   vb_data[index++] = v1;
   vb_data[index++] = t;

   // V2
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w * rot0 + -h * rot2;
   vb_data[index++] = -w * rot1 + -h * rot3;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = u1;
   vb_data[index++] = v2;
   vb_data[index++] = t;

   // V3
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w * rot0 + h * rot2;
   vb_data[index++] = w * rot1 + h * rot3;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = u2;
   vb_data[index++] = v1;
   vb_data[index++] = t;

   // V4
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w * rot0 + -h * rot2;
   vb_data[index++] = w * rot1 + -h * rot3;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = u2;
   vb_data[index++] = v2;
   vb_data[index++] = t;

}
/** */
export function Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time_generic2(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;

   // V2
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;

   // V3
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;

   // V4
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;

}
/** */ 
export function Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time_generic2(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {
   // console.error('CALCULATE THE STRIDE CORRECTLY')

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;



   // V2
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;


   // V3
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;


   // V4
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;

}
/** */ 
export function Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;

   // V2
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;

   // V3
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;

   // V4
   vb_data[index++] = r;
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // Z pos
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;

}

/****************************************************************************************************************************************************************************/
// Particles: Instanced Geometry
/** */
export function Gl_particles_batch_set_instanced_col4_wpos3_dim2_time_generic2(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;
   vb_data[index++] = gena;
   vb_data[index++] = genb;

}
/** */
export function Gl_particles_batch_set_instanced_wpos3_time(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = t;
   // console.log('SUCCESS',x,y,t)

}
/** */
export function Gl_particles_batch_set_instanced_col4_wpos3_time(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = t;
   // console.log('SUCCESS',x,y,t)

}
/** */
export function Gl_particles_batch_set_instanced_col4_wpos3_dim2_time(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = x;
   vb_data[index++] = y;
   index++; // z;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = t;
   

}

/** */
export function Gl_particles_batch_set_col4_vpos2_dim2_rcorner(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V2
   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V3
   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V4
   vb_data[index++] = r; 
   vb_data[index++] = g;
   vb_data[index++] = b;
   vb_data[index++] = a;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
}
/** */
export function Gl_particles_batch_set_vpos2_dim2_rcorner(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V2
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V3
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V4
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
}
/** */
export function Gl_particles_batch_set_vpos2_rcorner(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V2
   vb_data[index++] = -w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V3
   vb_data[index++] = w;
   vb_data[index++] = -h;
   vb_data[index++] = rc; // FOR RCORNERS
   
   // V4
   vb_data[index++] = w;
   vb_data[index++] = h;
   vb_data[index++] = rc; // FOR RCORNERS
   
}
/** */
export function Gl_particles_batch_set_vpos2(vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot0,rot1,rot2,rot3, u1,u2,v1,v2, gena,genb) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   let index = start;

   // V1
   vb_data[index++] = -w;
   vb_data[index++] = -h;
   
   // V2
   vb_data[index++] = -w;
   vb_data[index++] = h;
   
   // V3
   vb_data[index++] = w;
   vb_data[index++] = -h;
   
   // V4
   vb_data[index++] = w;
   vb_data[index++] = h;
   
}









/**************************************************************************************************************************************/
// Add, Remove, Shift Attribs - Vertex Buffer Functions
/**************************************************************************************************************************************/
/** */
export function Gl_remove_geometry(gfx, num_faces = 1, start_index = 0, debug_mesh = null) {

   Vertex_buffer_remove_geometry(gfx, num_faces, debug_mesh);

}
/** */
export function Gl_remove_geometry_params(vbidx, num_faces = 1, start_index = 0, attribsPerVertex, verticesPerRect) {
   alert('132132132132 IMPLEMENT ME')
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
/** */
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

// NOT IMPLEMENTED
/** */
export function GlSetAttrSdfParams(gfx, val) {
   alert("IMPLEMENT ME")
   // const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idx);
   // const offset = Shader_attributes_get_attrib_offset_by_nameid(gfx.prog.attribsidx, SID.ATTR

   // let index = gfx.vb.start + progs.buffer[gfx.prog.idx].shaderinfo.attributes.offset.sdf;
   // let verts = num_faces * gfx.vertsPerRect;
   // let stride = gfx.attribsPerVertex - V_SDF_COUNT;

   // while (verts) {

   //     vb_data[index++] = val[0];
   //     vb_data[index++] = val[1];

   //     index += stride; // Go to next vertice's borderWidth attrib.
   //     verts--;
   // }
   // Vertex_buffer_state_enable(gfx.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}
/** */
export function GlSetAttrSdfParamsOuter(gfx, val) {
   alert("IMPLEMENT ME")
   // const vb_data = Vertex_buffer_get_by_vbidx(gfx.vb.idx);
   // const offset = Shader_attributes_get_attrib_offset_by_nameid(gfx.prog.attribsidx, SID.ATTR

   // let index = gfx.vb.start + progs.buffer[gfx.prog.idx].shaderinfo.attributes.offset.sdf;
   // let verts = num_faces * gfx.vertsPerRect;
   // let stride = gfx.attribsPerVertex - V_SDF_COUNT;

   // while (verts) {

   //     index++; // Skip sdf-inner param 
   //     vb_data[index++] = val;

   //     index += stride; // Go to next vertice's borderWidth attrib.
   //     verts--;
   // }
   // Vertex_buffer_state_enable(gfx.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}













// End
/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************************/






