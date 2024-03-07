"use strict";

import { Str_buffer_get_by_idx } from "../../Engine/Core/StringBuffer";
import { Shader_attributes_get_attribs } from "../ShaderAttributes";






export function Select_fnidx_to_fill_vertex_buffer(attribsidx) {

   const shader_attribs = Shader_attributes_get_attribs(attribsidx);
   const names = shader_attribs.names;
   if (Str_buffer_get_by_idx(names[0]) === 'a_col' &&
       Str_buffer_get_by_idx(names[1]) === 'a_wpos_time' &&
       Str_buffer_get_by_idx(names[2]) === 'a_pos' &&
       Str_buffer_get_by_idx(names[3]) === 'a_params1') {
      return 0;
   }
   if (Str_buffer_get_by_idx(names[0]) === 'a_col' &&
       Str_buffer_get_by_idx(names[1]) === 'a_wpos_time' &&
       Str_buffer_get_by_idx(names[2]) === 'a_pos' &&
       Str_buffer_get_by_idx(names[3]) === 'a_tex') {
      return 1;
   }

   console.error('NO add function pointer was set. attrib names:', names);
   alert('SEE CONOLE ERROR.\nNO add function pointer was set. attrib names:')
}



const Vertex_buffer_fn_table_operation_add = [
   FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_PARAMS1_FN0,
   FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_TEX2_FN1,
];



export function Gl_operation_add(fnidx, vb_data, geom, mat, start, num_faces, stride) {
   return Vertex_buffer_fn_table_operation_add[fnidx](vb_data, geom, mat, start, num_faces, stride);
}



// FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_PARAMS1_FN0
function FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_PARAMS1_FN0(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3


      // V2
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3


      // V3
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3


      // V4
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      // index += stride;
      attribs_count += stride * 4; // TODO: Store Vertices_per_rect in shder_attribs?????
   }

   return attribs_count;
}



function FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_TEX2_FN1(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   // const end = start + (count * num_faces);

   for (let i = 0; i < num_faces; i++) {

      // V2
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];


      vb_data[index++] = mat.uv[0];
      vb_data[index++] = mat.uv[3];


      // V2
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      vb_data[index++] = mat.uv[0];
      vb_data[index++] = mat.uv[2];


      // V3
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      vb_data[index++] = mat.uv[1];
      vb_data[index++] = mat.uv[3];


      // V4
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      vb_data[index++] = mat.uv[1];
      vb_data[index++] = mat.uv[2];

      attribs_count += stride * 4;
   }

   return attribs_count;
}