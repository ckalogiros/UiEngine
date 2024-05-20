"use strict";

import { Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs, Shader_attributes_get_attribs_offset_attribs_per_vertex, Shader_attributes_get_attribs_offset_size, Shader_attributes_get_attribs_offset_size_attribs_per_vertex } from "../ShaderAttributes.js";
import { Index_buffer_get_by_ibidx } from "./IndexBuffers.js";
import { VBI_get_byidx, Vertex_buffer_get_by_vbidx, Vertex_buffer_group_get_byidx, Vertex_buffer_remove_geometry, Vertex_buffer_state_enable } from "./VertexBuffers.js";



/**************************************************************************************************************************************/
// Function Selector
/**************************************************************************************************************************************/

_CNT = 0;
const FUNCTION_TABLE_IDXS = {
   COL4_WPOS4_PARAMS1_POS2: _CNT++,
   COL4_WPOS4_POS2_TEX2: _CNT++,
   COL4_WPOS4_TEX2: _CNT++,
   COL4_WPOS4_POS2: _CNT++,
   WPOS4_PARAMS1_POS2: _CNT++,
   WPOS4_POS2: _CNT++,
   PARAMS1_POS2: _CNT++,
   POS2: _CNT++,
   POS2_TEX2: _CNT++,
   // Instaned Geometry
   INST_COL4_WPOS4_PARAMS1: _CNT++,
   INST_COL4_WPOS4_POS2: _CNT++,
   INST_COL4_WPOS4: _CNT++,
   INST_POS2_TEX2: _CNT++,
   INST_COL4_WPOS4_TEX2: _CNT++,

   SIZE: _CNT,
};



const Vertex_buffer_fn_table_operation_add = [
   FILL_VERTEX_BUFFER_COL4_WPOS4_PARAMS1_POS2_FN0,
   FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_TEX2_FN1,
   FILL_VERTEX_BUFFER_COL4_WPOS4_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_FN2,
   FILL_VERTEX_BUFFER_WPOS4_PARAMS1_POS2_FN3,
   FILL_VERTEX_BUFFER_WPOS4_POS2_FN4,
   FILL_VERTEX_BUFFER_PARAMS1_POS2_FN5,
   FILL_VERTEX_BUFFER_POS2_FN6,
   FILL_VERTEX_BUFFER_POS2_TEX2,
   // Instanced Geometry
   INST_FILL_VERTEX_BUFFER_COL4_WPOS4_PARAMS1_FN0,
   INST_FILL_VERTEX_BUFFER_COL4_WPOS4_POS2,
   INST_FILL_VERTEX_BUFFER_COL4_WPOS4_FN1,
   INST_FILL_VERTEX_BUFFER_POS2_FN2,
   INST_FILL_VERTEX_BUFFER_COL4_WPOS4_TEX2,
];

function Set_fn_table_fill_vb(){

   for(let i=0; i < FUNCTION_TABLE_IDXS.SIZE; i++){

      FUNCTION
   }
}




export function Select_fnidx_to_fill_vertex_buffer(attribsidx, attr, inst) {

   const shader_attribs = Shader_attributes_get_attribs(attribsidx);
   const names = shader_attribs.names;


   if ((shader_attribs.nameids[0] & SHADER_ATTRIBUTES.COL4) &&
      (shader_attribs.nameids[1] & SHADER_ATTRIBUTES.WPOS_TIME4) &&
      (shader_attribs.nameids[2] & SHADER_ATTRIBUTES.PARAMS1) &&
      (shader_attribs.nameids[3] & SHADER_ATTRIBUTES.POS2))
   {
      // Case we have multiple vertex buffers per shader instance, (Instanced geometry, not interleaved geometry)
      // if(inst & (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4;
      if(inst & (SID.ATTR.COL4) && (inst & SID.ATTR.WPOS_TIME4) && (inst & SID.ATTR.PARAMS1)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4_PARAMS1;
      if(inst & (SID.ATTR.COL4) && (inst & SID.ATTR.WPOS_TIME4)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4;
      
      else {
         if((attr & SID.ATTR.COL4) && (attr & SID.ATTR.WPOS_TIME4) && (attr & SID.ATTR.PARAMS1) && (attr & SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.COL4_WPOS4_PARAMS1_POS2;
         if((attr & SID.ATTR.POS2) && (attr & SID.ATTR.PARAMS1)) return FUNCTION_TABLE_IDXS.PARAMS1_POS2;
         if(attr & (SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.POS2;
      }
   }


   else if ((shader_attribs.nameids[0] & SHADER_ATTRIBUTES.COL4) &&
      (shader_attribs.nameids[1] & SHADER_ATTRIBUTES.WPOS_TIME4) &&
      (shader_attribs.nameids[2] & SHADER_ATTRIBUTES.POS2) &&
      (shader_attribs.nameids[3] & SHADER_ATTRIBUTES.TEX2))
   {
      // Case we have multiple vertex buffers per shader instance, (Instanced geometry, not interleaved geometry)
      if(inst & (SID.ATTR.COL4) && (inst & SID.ATTR.WPOS_TIME4) && (inst & SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4_TEX2;
      if(inst & (SID.ATTR.COL4) && (inst & SID.ATTR.WPOS_TIME4)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4;
      // else if(inst & SID.ATTR.POS2) return FUNCTION_TABLE_IDXS.INST_POS2_POS2;
      
      else {
         if(attr & (SID.ATTR.COL4) && (attr & SID.ATTR.WPOS_TIME4) && (attr & SID.ATTR.POS2) && (attr & SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.COL4_WPOS4_POS2_TEX2;
         if(attr & (SID.ATTR.COL4) && (attr & SID.ATTR.WPOS_TIME4) && (attr & SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4;
         if((attr & SID.ATTR.POS2) && (attr & SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.POS2_TEX2;
         if(attr & (SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.POS2;
      }
   }


   else if ((shader_attribs.nameids[0] & SHADER_ATTRIBUTES.COL4) &&
      (shader_attribs.nameids[1] & SHADER_ATTRIBUTES.WPOS_TIME4) &&
      (shader_attribs.nameids[2] & SHADER_ATTRIBUTES.POS2))
   {
      // Case we have multiple vertex buffers per shader instance, (Instanced geometry, not interleaved geometry)
      if(inst & (SID.ATTR.COL4) && (inst & SID.ATTR.WPOS_TIME4) && (inst & SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4_POS2;
      if(inst & (SID.ATTR.COL4) && (inst & SID.ATTR.WPOS_TIME4)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS4;
      if(inst & SID.ATTR.POS2) return FUNCTION_TABLE_IDXS.INST_POS2_POS2;
      
      else {
         if(attr & (SID.ATTR.COL4) && (attr & SID.ATTR.WPOS_TIME4) && (attr & SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.COL4_WPOS4_POS2;
         // if(attr & (SID.ATTR.COL4) && (attr & SID.ATTR.WPOS_TIME4)) return FUNCTION_TABLE_IDXS.COL4_WPOS4;
         if((attr & SID.ATTR.POS2) && (attr & SID.ATTR.PARAMS1)) return FUNCTION_TABLE_IDXS.PARAMS1_POS2;
         if(attr & (SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.POS2;
      }
   }
   // if (Str_buffer_get_by_idx(names[0]) === 'a_col' &&
   //    Str_buffer_get_by_idx(names[1]) === 'a_wpos_time' &&
   //    Str_buffer_get_by_idx(names[2]) === 'a_pos' &&
   //    Str_buffer_get_by_idx(names[3]) === 'a_tex') 
   // {
   //    return FUNCTION_TABLE_IDXS.COL4_WPOS4_POS2_TEX2;
   // }
   // if (Str_buffer_get_by_idx(names[0]) === 'a_col' &&
   //    Str_buffer_get_by_idx(names[1]) === 'a_wpos_time' &&
   //    Str_buffer_get_by_idx(names[2]) === 'a_pos') 
   // {
   //    return FUNCTION_TABLE_IDXS.COL4_WPOS4_POS2;
   // }
   // if (Str_buffer_get_by_idx(names[0]) === 'a_wpos_time' &&
   //    Str_buffer_get_by_idx(names[1]) === 'a_params1' &&
   //    Str_buffer_get_by_idx(names[2]) === 'a_pos') 
   // {
   //    return FUNCTION_TABLE_IDXS.WPOS4_PARAMS1_POS2;
   // }
   // if (Str_buffer_get_by_idx(names[0]) === 'a_wpos_time' &&
   //    Str_buffer_get_by_idx(names[1]) === 'a_pos') 
   // {
   //    return FUNCTION_TABLE_IDXS.WPOS4_POS2;
   // }

   console.error('NO function (pointer) was set for adding meshes to Vertex buffer. attrib names:', names);
   alert('SEE CONOLE ERROR.\nNO add function pointer was set. attrib names:')
}





export function Gl_operation_add(fnidx, vb_data, geom, mat, start, num_faces, stride) {
   const vb_info_count = Vertex_buffer_fn_table_operation_add[fnidx](vb_data, geom, mat, start, num_faces, stride);
   // console.log('-----------------------\n', vb_info_count, 'fnidx', fnidx)
   return vb_info_count;
}




/**************************************************************************************************************************************/
// Fill - Vertex Buffer Functions
/**************************************************************************************************************************************/


function FILL_VERTEX_BUFFER_COL4_WPOS4_PARAMS1_POS2_FN0(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;


   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V2
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];


      // V3
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V4
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // index += stride;
      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
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

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
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

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
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

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
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

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      vb_data[index++] = mat.uv[1];
      vb_data[index++] = mat.uv[2];

      attribs_count += stride;
   }

   return attribs_count;
}



function FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_FN2(vb_data, geom, mat, start, num_faces, stride) {

   let index = start;
   let attribs_count = 0;


   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V2
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];


      // V3
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V4
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // index += stride;
      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
   }

   return attribs_count;
}


function FILL_VERTEX_BUFFER_WPOS4_PARAMS1_POS2_FN3(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;


   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V2
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];


      // V3
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V4
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // index += stride;
      attribs_count += stride; // TODO: Store Vertices_per_rect in shader_attribs?????
   }

   return attribs_count;
}


function FILL_VERTEX_BUFFER_WPOS4_POS2_FN4(vb_data, geom, mat, start, num_faces, stride){

   let attribs_count = 0;
   let index = start;


   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V2
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];


      // V3
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V4
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // index += stride;
      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
   }

   return attribs_count;
}


function FILL_VERTEX_BUFFER_PARAMS1_POS2_FN5(vb_data, geom, mat, start, num_faces, stride){

}
function FILL_VERTEX_BUFFER_POS2_FN6(vb_data, geom, mat, start, num_faces, stride){
   
   let attribs_count = 0;
   let index = start;


   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];


      // V2
      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // V3
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // V4
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // index += stride;
      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
   }

   return attribs_count;
}

function FILL_VERTEX_BUFFER_COL4_WPOS4_TEX2(){
   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      index++;
      index++;


      vb_data[index++] = mat.uv[0];
      vb_data[index++] = mat.uv[3];

   }

   return attribs_count;
}

function FILL_VERTEX_BUFFER_POS2_TEX2(vb_data, geom, mat, start, num_faces, stride){
   
   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];


      vb_data[index++] = mat.uv[0];
      vb_data[index++] = mat.uv[3];


      // V2
      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      vb_data[index++] = mat.uv[0];
      vb_data[index++] = mat.uv[2];


      // V3
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      vb_data[index++] = mat.uv[1];
      vb_data[index++] = mat.uv[3];


      // V4
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      vb_data[index++] = mat.uv[1];
      vb_data[index++] = mat.uv[2];

      attribs_count += stride;
   }

   return attribs_count;
}


/**************************************************************************************************************************************/
// Instanced Attributes - Vertex Buffer Functions
/**************************************************************************************************************************************/

function INST_FILL_VERTEX_BUFFER_COL4_WPOS4_PARAMS1_FN0(vb_data, geom, start, num_faces, stride){
   alert('Create stride\nFILL_VERTEX_BUFFER')
   // for (let i = 0; i < num_faces; i++) {
   //    // V1
   //    vb_data[index++] = mat.col[0];
   //    vb_data[index++] = mat.col[1];
   //    vb_data[index++] = mat.col[2];
   //    vb_data[index++] = mat.col[3];

   //    vb_data[index++] = geom.pos[0] + geom.dim[0];
   //    vb_data[index++] = geom.pos[1] + geom.dim[1];
   //    vb_data[index++] = geom.pos[2];
   //    index++; // For WPOS4

   //    vb_data[index++] = mat.style[0];
   //    vb_data[index++] = mat.style[1];
   //    vb_data[index++] = mat.style[2];
   //    index++; // For PARAMS1 - STYLE3

   //    attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
   // }
}

function INST_FILL_VERTEX_BUFFER_COL4_WPOS4_POS2(vb_data, geom, start, num_faces, stride){

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      vb_data[index++] = 0;
      // index++; // For WPOS4
      attribs_count += stride;
   }

   return attribs_count;
}


function INST_FILL_VERTEX_BUFFER_COL4_WPOS4_FN1(vb_data, geom, mat, start, num_faces, stride=0){
   // alert('Create stride\nFILL_VERTEX_BUFFER')

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];
      vb_data[index++] = 0;

      attribs_count += stride;
   }

   return attribs_count;
}
function INST_FILL_VERTEX_BUFFER_POS2_FN2(vb_data, geom, mat, start, num_faces, stride=0){
   alert('Create stride\nFILL_VERTEX_BUFFER')

   let attribs_count = 0;
   let index = start;


   for (let i = 0; i < num_faces; i++) {

      // V1
      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // V2
      vb_data[index++] = -geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // V3
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // V4
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

      // index += stride;
      attribs_count += stride;
   }

   return attribs_count;
}

function INST_FILL_VERTEX_BUFFER_COL4_WPOS4_TEX2(vb_data, geom, mat, start, num_faces, stride=0){
   alert('kkla')
}







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


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[wposidx] +1;
   let loop_count = num_faces;
   if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - (vb_info.attribs_info.sizes[wposidx]-1);
   let stride = vb_info.attribs_info.count - 1;

   

   while (loop_count) {

      // vb_data[index++] = x;
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
   // if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[dimidx];
   // let stride = vb_info.attribs_info.count - 1; 


   while (loop_count) {

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

      loop_count--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_set_dim_x(gfxInfo, x, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf; 
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx]+1;
   let loop_count = num_faces;
   // if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - vb_info.attribs_info.sizes[dimidx];
   let stride = vb_info.attribs_info.count - 1; 


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

   Vertex_buffer_state_enable(gfxInfo.vb.groupidx, gfxInfo.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
}


export function Gl_set_dim_y(gfxInfo, y, num_faces = 1) {

   const vbidx = gfxInfo.vb.which_vb.dim_buf; 
   const dimidx = gfxInfo.vb.which_attrib.dim_idx; // An index to access the wpos elements
   const vb_info = VBI_get_byidx(gfxInfo.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idxs.buffer[vbidx]);


   let index = gfxInfo.vb.starts.buffer[vbidx] + vb_info.attribs_info.offsets[dimidx]+1;
   let loop_count = num_faces;
   // if (gfxInfo.vb.is_per_vertex.buffer[vbidx]) loop_count *= gfxInfo.vertsPerRect;
   // let stride = vb_info.attribs_info.count - (vb_info.attribs_info.sizes[dimidx]-1);
   let stride = vb_info.attribs_info.count - 1; 


   while (loop_count) {

      // vb_data[index++] = -dim[0];
      vb_data[index++] = y;
      index += stride;

      // vb_data[index++] = -dim[0];
      vb_data[index++] = -y;
      index += stride;

      // vb_data[index++] = dim[0];
      vb_data[index++] = y;
      index += stride;

      // vb_data[index++] = dim[0];
      vb_data[index++] = -y;
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


export function Gl_remove_geometry(gfx, num_faces = 1, start_index = 0, debug_mesh = null) {

   const temp_vb = Vertex_buffer_get_by_vbidx(gfx.vb.idx);
   const vb_info = Vertex_buffer_group_get_byidx(gfx.vb.idx);

   const start = (start_index) ? start_index : gfx.vb.start;

   // Structure to use for updating a removed mesh's start index pointing to it's location in the vertex buffer..
   const ret = {
      counts: [0, 0], // 0:vb, 1:ib
      start: start,
      // is_last: (start + gfx.vb.count * num_faces >= vb_info.count) ? true : false,
      is_last: (start + gfx.vb.count * num_faces === vb_info.count) ? true : false,
      empty: false, // Is the buffer is empty?
   };


   ret.counts[0] = Vertex_buffer_remove_geometry(gfx, num_faces, start, ret.is_last, debug_mesh);
   return ret;
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


export function Gl_set_RGBA_per_vertex(gfxInfo, color, num_faces = 1) {

   // alert('IMPLEMENT ME. @ Gl_set_rgba()');
   /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_rgba()'); }

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.COL4);

   let index = gfxInfo.vb.start + a.offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - a.size;


   let k = 0;

   while (verts) {

      vb_data[index++] = color[0];
      vb_data[index++] = color[1];
      vb_data[index++] = color[2];
      vb_data[index++] = color[3];

      vb_data[index++] = color[k][0];
      vb_data[index++] = color[k][1];
      vb_data[index++] = color[k][0];
      vb_data[index++] = color[k][3];

      index += stride;
      vb_data.count += V_COL_COUNT;
      k++;
      if (k >= 4) k = 0;
      verts--;

      // index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      // verts--;
   }


   // let index = gfxInfo.vb.start + offset;
   // let verts = num_faces * gfxInfo.vertsPerRect;
   // let stride = gfxInfo.attribsPerVertex - V_COL_COUNT;

   // if (gfxInfo.sid.attr & SID.ATTR.COL4_PER_VERTEX) {

   //     let k = 0;
   //     while (verts) {

   //         vb_data[index++] = color[k][0];
   //         vb_data[index++] = color[k][1];
   //         vb_data[index++] = color[k][0];
   //         vb_data[index++] = color[k][3];

   //         index += stride;
   //         vb_data.count += V_COL_COUNT;
   //         k++;
   //         if (k >= 4) k = 0;
   //         verts--;
   //     }
   // }

   // Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
   // return count;

   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}




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
export function Gl_batch_set_RGBA(vbidx, starts, colors, color_indices, colors_len, attribsidx, num_faces, color_offsets) {

   const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Get or pass the vertices per rect
   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const shader_attribs_info = Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, SHADER_ATTRIBUTES.COL4);

   // let stride = shader_attribs_info.attribs_per_vertex - colors_len;
   let stride = shader_attribs_info.attribs_per_vertex;
   
   const color_indices_len = color_indices.length;
   for(let i=0; i < color_indices_len; i++){

      let index = starts[i] + shader_attribs_info.offset;
      for(let j=0; j <= vertices_per_rect * num_faces; j++){

         for(let k=0; k < colors_len; k++){
            vb_data[index + color_offsets[k]] = colors[color_indices[i]+k]; 
         }

         index += stride;
      }


   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}


/** 'starts' and 'color_indices' should be of the same element couunt arrays */
export function Gl_batch_set_pos_xy(vbidx, starts, pos, pos_indices, pos_len, attribsidx, num_faces) {

   const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Get or pass the vertices per rect
   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   const shader_attribs_info = Shader_attributes_get_attribs_offset_size_attribs_per_vertex(attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

   let stride = shader_attribs_info.attribs_per_vertex - shader_attribs_info.size;
   
   const pos_indices_len = pos_indices.length;
   for(let i=0; i < pos_indices_len; i++){
      
      let index = starts[i] + shader_attribs_info.offset;

      for(let j=0; j <= vertices_per_rect * num_faces[i]; j++){
         
         for(let k=0; k < pos_len; k++){
            vb_data[index++] = pos[pos_indices[i]+k]; 
            index++
         }
         
         index += stride;
      }


   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_alpha(gfxInfo, val, num_faces) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex;

   let i = 0;
   while (verts) {

      index += GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.ALPHA;
      vb_data[index] = val; // Move mesh's x pos by amt

      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}


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



export function Gl_add_wpos_XYZ(gfxInfo, x, y, z, num_faces = 1) {
   
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



export function Gl_set_wpos_XYZ(gfxInfo, x, y, z, num_faces = 1) {
   
   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XYZ;

   while (verts) {

      vb_data[index++] = x;
      vb_data[index++] = y;
      vb_data[index++] = z;


      index += stride; // Go to next vertice's pos. +1 for skipping pos.z
      verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



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
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.PARAMS1);

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
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.PARAMS1);

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
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.PARAMS1);

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
export function Gl_particles_batch_set(vbidx, start, colors, positions, dimention) {

   // const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Get or pass the vertices per rect
   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   // const shader_attribs_info = Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, SHADER_ATTRIBUTES.COL4);

   // let stride = shader_attribs_info.attribs_per_vertex;
   
   let index = start;
   // const len = colors.length;
   const len = 1;

   for (let i = 0; i < len; i++) {

      // const col = colors[i];
      // const pos = positions[i];
      const col = colors;
      const pos = positions;
      const dim = dimention;

      // V1
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
      
      index++;
      index++;
      // vb_data[index++] = -dim[0];
      // vb_data[index++] = dim[1];
      
      
      // V2
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
            
      index++;
      index++;
      // vb_data[index++] = -dim[0];
      // vb_data[index++] = -dim[1];
      
      
      // V3
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
            
      index++;
      index++;
      // vb_data[index++] = dim[0];
      // vb_data[index++] = dim[1];
      
      
      // V4
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
      
      index++;
      index++;
      // vb_data[index++] = dim[0];
      // vb_data[index++] = -dim[1];

   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
}

export function Gl_particles_batch_set_col4_wpos4_pos2_style3(vbidx, start, colors, positions, dimention) {

   // const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Get or pass the vertices per rect
   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);
   // const shader_attribs_info = Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, SHADER_ATTRIBUTES.COL4);

   // let stride = shader_attribs_info.attribs_per_vertex;
   
   let index = start;
   // const len = colors.length;
   const len = 1;

   for (let i = 0; i < len; i++) {

      // const col = colors[i];
      // const pos = positions[i];
      const col = colors;
      const pos = positions;
      const dim = dimention;

      // V1
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
      
      index++;
      index++;
      index++;
      index++;

      index++;
      index++;
      // vb_data[index++] = -dim[0];
      // vb_data[index++] = dim[1];
      
      
      // V2
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
                 
      index++;
      index++;
      index++;
      index++;

      index++;
      index++;
      // vb_data[index++] = -dim[0];
      // vb_data[index++] = -dim[1];
      
      
      // V3
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
                  
      index++;
      index++;
      index++;
      index++;

      index++;
      index++;
      // vb_data[index++] = dim[0];
      // vb_data[index++] = dim[1];
      
      
      // V4
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];
      
      vb_data[index++] = pos[0];
      vb_data[index++] = pos[1];
      vb_data[index++] = pos[2];
      // vb_data[index++] = pos[3]; // Timer t
      index++;
            
      index++;
      index++;
      index++;
      index++;

      index++;
      index++;
      // vb_data[index++] = dim[0];
      // vb_data[index++] = -dim[1];

   }

   Vertex_buffer_state_enable(vbidx, BUFFER_STATE.NEEDS_UPDATE);
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
   // const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.PARAMS1);

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