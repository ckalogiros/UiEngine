"use strict"

import { Shader_attributes_get_attribs } from "../ShaderAttributes.js";







/**************************************************************************************************************************************/
// Function Selector
/**************************************************************************************************************************************/

_CNT = 0;
const FUNCTION_TABLE_IDXS = {
   COL4_WPOS3_POS2_RCORNERS1_FEATHER1: INT_NULL,
   COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1_GLOW_INTENSITY: INT_NULL,
   COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_GLOW_INTENSITY: INT_NULL,
   COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1: INT_NULL,
   COL4_WPOS3_DIM2_RCORNERS1_FEATHER1_BORDER1: INT_NULL,
   COL4_WPOS3_DIM2_RCORNERS1_FEATHER1: INT_NULL,
   COL4_WPOS3_POS2_DIM2_FEATHER1: INT_NULL,
   COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1: INT_NULL,
   COL4_WPOS3_POS2_DIM2_TEX2_RCORNERS1_FEATHER1: INT_NULL,
   COL4_WPOS3_POS2_TEX2_RCORNERS1_FEATHER1: INT_NULL,
   COL4_WPOS3_TIME_POS2_DIM2_TEX2_TIME: INT_NULL,
   COL4_WPOS3_POS2_DIM2_TEX2: INT_NULL,
   COL4_WPOS3_TIME_POS2_DIM2: INT_NULL,
   COL4_WPOS3_POS2_DIM2: INT_NULL,
   COL4PERVERTEX_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1: INT_NULL,
   COL4PERVERTEX_WPOS3_POS2_RCORNERS1_FEATHER1: INT_NULL,
   COL4PERVERTEX_WPOS3_POS2: INT_NULL,
   COL4_WPOS3_POS2_TEX2: INT_NULL,
   COL4_WPOS3_TEX2: INT_NULL,
   COL4_WPOS3_POS2: INT_NULL,
   WPOS3_POS2_RCORNERS1_FEATHER1: INT_NULL,
   WPOS3_POS2: INT_NULL,
   WPOS3_DIM2: INT_NULL,
   POS2_RCORNERS1_FEATHER1: INT_NULL,
   POS2: INT_NULL,
   POS2_TEX2: INT_NULL,
   COL4PERVERTEX_POS2_RCORNERS1_FEATHER1: INT_NULL,
   // Instaned Geometry
   INST_COL4_WPOS3_POS2: INT_NULL,
   INST_COL4_WPOS3: INT_NULL,
   INST_WPOS3_DIM2: INT_NULL,
   INST_WPOS3: INT_NULL,
   INST_DIM2: INT_NULL,
   // TESTS

   SIZE: INT_NULL,
};




const Vertex_buffer_fn_table_operation_add = [
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_RCORNERS1_FEATHER1_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1_GLOW_INTENSITY,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_GLOW_INTENSITY,
   FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_COL4_WPOS3_DIM2_RCORNERS1_FEATHER1_BORDER1,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_COL4_WPOS3_DIM2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_FEATHER1,
   FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_POS2,
   FILL_VERTEX_BUFFER_WPOS3_POS2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_WPOS3_POS2,
   FILL_VERTEX_BUFFER_POS2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_POS2,
   FILL_VERTEX_BUFFER_POS2_TEX2,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_POS2_RCORNERS1_FEATHER1,
   FILL_VERTEX_BUFFER_WPOS3_DIM2,
   // Instanced Geometry
   INST_FILL_VERTEX_BUFFER_COL4_WPOS3,
   INST_FILL_VERTEX_BUFFER_WPOS3_DIM2,
   INST_FILL_VERTEX_BUFFER_WPOS3,
   INST_FILL_VERTEX_BUFFER_DIM2,

   //TESTS
];


function Set_up_fn_table() {

   const len = Vertex_buffer_fn_table_operation_add.length;
   for (let i = 0; i < len; i++) {

      if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_TEX2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_RCORNERS1_FEATHER1_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_TEX2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1_GLOW_INTENSITY) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1_GLOW_INTENSITY = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_GLOW_INTENSITY) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_GLOW_INTENSITY = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1) FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_COL4_WPOS3_DIM2_RCORNERS1_FEATHER1_BORDER1) FUNCTION_TABLE_IDXS.COL4_WPOS3_DIM2_RCORNERS1_FEATHER1_BORDER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_COL4_WPOS3_DIM2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.COL4_WPOS3_DIM2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_FEATHER1) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2_TEX2_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_TEX2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2) FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_POS2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_POS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_TEX2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_TEX2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_POS2) FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_WPOS3_POS2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.WPOS3_POS2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_WPOS3_POS2) FUNCTION_TABLE_IDXS.WPOS3_POS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_POS2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.POS2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_POS2_RCORNERS1_FEATHER1) FUNCTION_TABLE_IDXS.COL4PERVERTEX_POS2_RCORNERS1_FEATHER1 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_WPOS3_DIM2) FUNCTION_TABLE_IDXS.WPOS3_DIM2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_POS2) FUNCTION_TABLE_IDXS.POS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_POS2_TEX2) FUNCTION_TABLE_IDXS.POS2_TEX2 = i;
      // Instanced Geometry
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_COL4_WPOS3) FUNCTION_TABLE_IDXS.INST_COL4_WPOS3 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_WPOS3_DIM2) FUNCTION_TABLE_IDXS.INST_WPOS3_DIM2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_WPOS3) FUNCTION_TABLE_IDXS.INST_WPOS3 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_DIM2) FUNCTION_TABLE_IDXS.INST_DIM2 = i;
      //TESTS
   }

   FUNCTION_TABLE_IDXS.SIZE = len;
}

Set_up_fn_table();



/**
 * If the sid of the mesh, passed to the vertex buffer creation, has any flag(!0x0),
 * then a function for that specific implementation of the vertex buffer will be chosen.
 */
export function Select_fnidx_to_fill_vertex_buffer(attribsidx, attr, inst) {

   const shader_attribs = Shader_attributes_get_attribs(attribsidx);
   const names = shader_attribs.names;


   if (inst) {

      let clean_inst = 0x0;
      if (inst & SHADER_ATTRIBUTES.COL4) clean_inst |= SHADER_ATTRIBUTES.COL4;
      if (attr & SHADER_ATTRIBUTES.COL4_PER_VERTEX) clean_inst |= SHADER_ATTRIBUTES.COL4_PER_VERTEX;
      if (inst & SHADER_ATTRIBUTES.WPOS3) clean_inst |= SHADER_ATTRIBUTES.WPOS3;
      if (inst & SHADER_ATTRIBUTES.STYLE) clean_inst |= SHADER_ATTRIBUTES.STYLE;
      if (inst & SHADER_ATTRIBUTES.DIM2) clean_inst |= SHADER_ATTRIBUTES.DIM2;
      if (inst & SHADER_ATTRIBUTES.TEX2) clean_inst |= SHADER_ATTRIBUTES.TEX2;

      if (clean_inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_POS2;
      if (clean_inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS3;
      if (clean_inst === (SID.ATTR.WPOS3 | SID.ATTR.DIM2)) return FUNCTION_TABLE_IDXS.INST_WPOS3_DIM2;
      if (clean_inst === (SID.ATTR.WPOS3)) return FUNCTION_TABLE_IDXS.INST_WPOS3;
      if (clean_inst === (SID.ATTR.DIM2)) return FUNCTION_TABLE_IDXS.INST_DIM2;
   }
   else {

      let clean_attr = 0x0;
      if (attr & SHADER_ATTRIBUTES.COL4) {
         if (attr & SHADER_ATTRIBUTES.COL4_PER_VERTEX) clean_attr |= SHADER_ATTRIBUTES.COL4_PER_VERTEX;
         else clean_attr |= SHADER_ATTRIBUTES.COL4;
      }
      if (attr & SHADER_ATTRIBUTES.COL4_PER_VERTEX) clean_attr |= SHADER_ATTRIBUTES.COL4_PER_VERTEX;
      if (attr & SHADER_ATTRIBUTES.WPOS3) clean_attr |= SHADER_ATTRIBUTES.WPOS3;
      if (attr & SHADER_ATTRIBUTES.TIME) clean_attr |= SHADER_ATTRIBUTES.TIME;
      if (attr & SHADER_ATTRIBUTES.POS2) clean_attr |= SHADER_ATTRIBUTES.POS2;
      if (attr & SHADER_ATTRIBUTES.DIM2) clean_attr |= SHADER_ATTRIBUTES.DIM2;
      if (attr & SHADER_ATTRIBUTES.R_CORNERS) clean_attr |= SHADER_ATTRIBUTES.R_CORNERS;
      if (attr & SHADER_ATTRIBUTES.FEATHER) clean_attr |= SHADER_ATTRIBUTES.FEATHER;
      if (attr & SHADER_ATTRIBUTES.BORDER) clean_attr |= SHADER_ATTRIBUTES.BORDER;
      if (attr & SHADER_ATTRIBUTES.TEX2) clean_attr |= SHADER_ATTRIBUTES.TEX2;
      if (attr & SHADER_ATTRIBUTES.GLOW_INTENSITY) clean_attr |= SHADER_ATTRIBUTES.GLOW_INTENSITY;

      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.POS2 | SID.ATTR.DIM2)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.BORDER | SID.ATTR.GLOW_INTENSITY)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1_GLOW_INTENSITY;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.GLOW_INTENSITY)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_GLOW_INTENSITY;

      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.BORDER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.BORDER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_DIM2_RCORNERS1_FEATHER1_BORDER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_DIM2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_FEATHER1;

      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.TEX2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_TEX2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.TEX2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_TEX2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.TEX2 | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2_TEX2_TIME;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2_TEX2;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2 | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_POS2_DIM2;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.DIM2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_DIM2;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_POS2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_POS2;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2_TEX2;
      if (clean_attr === (SID.ATTR.WPOS3 | SID.ATTR.POS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.WPOS3_POS2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_POS2;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TEX2;
      if (clean_attr === (SID.ATTR.POS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.POS2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.WPOS3 | SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.WPOS3_POS2;
      if (clean_attr === (SID.ATTR.POS2 | SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.POS2_TEX2;
      if (clean_attr === (SID.ATTR.WPOS3 | SID.ATTR.DIM2)) return FUNCTION_TABLE_IDXS.WPOS3_DIM2;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.POS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_POS2_RCORNERS1_FEATHER1;
      if (clean_attr === (SID.ATTR.POS2)) return FUNCTION_TABLE_IDXS.POS2;
   }


   console.error('NO function (pointer) was set for adding meshes to Vertex buffer. attrib names:', names, shader_attribs.nameids, SHADER_ATTRIBUTES);
   // alert('SEE CONOLE ERROR.\nNO add function pointer was set. attrib names:')
   alert(`${inst} SEE CONOLE ERROR.\nNO add function pointer was set. attrib names:`)
   return -1;
}






export function Gl_operation_add(fnidx, vb_data, geom, mat, start, num_faces, stride, attribs_info) {
   const vb_info_count = Vertex_buffer_fn_table_operation_add[fnidx](vb_data, geom, mat, start, num_faces, stride, attribs_info);
   // console.log('-----------------------\n', vb_info_count, 'fnidx', fnidx)
   return vb_info_count;
}






/**************************************************************************************************************************************
 * Fill - Vertex Buffer Functions
 * 
 * IMPORTANT NOTE
 * The sequence in which the attributes are inserted into the vertex buffer,
 * must match the sequence in which the function 'Vertex_shader_resolve_attributes_in()'
 * has set them. (See ShaderBuilder.js).
 * Also the name of each function shoul represent the sequence of the attributes.
 * 
 * SEQUENCE:
 *    (COL4) (WPOS3) (TIME) (POS2) (DIM2) (R_CORNERS) (BORDER) (FEATHER) (TEX2) (GLOW_INTENSITY) (SDF) (MSDF) {

 * 
 **************************************************************************************************************************************/


function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = col[k][0];
         vb_data[index++] = col[k][1];
         vb_data[index++] = col[k][2];
         vb_data[index++] = col[k][3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         k++; // Switch to the next color for this vertex
         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = col[k][0];
         vb_data[index++] = col[k][1];
         vb_data[index++] = col[k][2];
         vb_data[index++] = col[k][3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         k++; // Switch to the next color for this vertex
         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride) {


   let attribs_count = 0;
   let index = start;
   let k = 0;

   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // Case some meshes have one color for all vertices, but still use color per vertex buffer.
         const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

         // COLOR
         vb_data[index++] = col[0];
         vb_data[index++] = col[1];
         vb_data[index++] = col[2];
         vb_data[index++] = col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         k++; // Switch to the next color for this vertex
         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_TEX2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-thu coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         // TEXTURE COORDS
         vb_data[index++] = mat.uv[uv_uindex];
         vb_data[index++] = mat.uv[uv_vindex];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_RCORNERS1_FEATHER1_TEX2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-thu coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         // TEXTURE COORDS
         vb_data[index++] = mat.uv[uv_uindex];
         vb_data[index++] = mat.uv[uv_vindex];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_TEX2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-thu coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // TIME
         vb_data[index++] = geom.time;

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // TEXTURE COORDS
         vb_data[index++] = mat.uv[uv_uindex];
         vb_data[index++] = mat.uv[uv_vindex];


         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_TEX2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-thu coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // TEXTURE COORDS
         vb_data[index++] = mat.uv[uv_uindex];
         vb_data[index++] = mat.uv[uv_vindex];


         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1(vb_data, geom, mat, start, num_faces, stride, attribs_info) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // TIME
         vb_data[index++] = geom.time;

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[1];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_COL4_WPOS3_DIM2_RCORNERS1_FEATHER1_BORDER1(vb_data, geom, mat, start, num_faces, stride, attribs_info) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[1];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_COL4_WPOS3_DIM2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride, attribs_info) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_FEATHER1(vb_data, geom, mat, start, num_faces, stride, attribs_info) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_BORDER1_GLOW_INTENSITY(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[1];
         vb_data[index++] = mat.style[2];

         // GLOW_INTENSITY
         vb_data[index++] = .0;

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2_RCORNERS1_FEATHER1_GLOW_INTENSITY(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[1];

         // GLOW_INTENSITY
         vb_data[index++] = mat.style[2]; // HACK: this attribute must have its own field variable in the mesh class

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // TIME
         vb_data[index++] = geom.time;

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_POS2_DIM2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // TIME
         vb_data[index++] = geom.time;

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_DIM2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // TIME
         vb_data[index++] = geom.time;

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2_TEX2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-th coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // TEXTURE COORDS
         vb_data[index++] = mat.uv[uv_uindex];
         vb_data[index++] = mat.uv[uv_vindex];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_POS2(vb_data, geom, mat, start, num_faces, stride, attribs_info) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-th coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_WPOS3_POS2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-thu coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_WPOS3_POS2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-th coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_POS2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-th coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_POS2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-thu coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TEX2() {

   let attribs_count = 0;
   let index = start;
   let uv_uindex = 0; // Uses 0-th coord for first 2 vertices of each face(4 vertices)

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = mat.col[0];
         vb_data[index++] = mat.col[1];
         vb_data[index++] = mat.col[2];
         vb_data[index++] = mat.col[3];

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // TEXTURE COORDS
         vb_data[index++] = mat.uv[uv_uindex];
         vb_data[index++] = mat.uv[uv_vindex];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_POS2_TEX2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-th coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // TEXTURE COORDS
         vb_data[index++] = mat.uv[uv_uindex];
         vb_data[index++] = mat.uv[uv_vindex];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_WPOS3_DIM2() {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      for (let j = 0; j < 2; j++) {

         // WPOS
         vb_data[index++] = geom.pos[0];
         vb_data[index++] = geom.pos[1];
         vb_data[index++] = geom.pos[2];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // DIMENTIONS
         vb_data[index++] = geom.dim[0] * num_faces;
         vb_data[index++] = geom.dim[1];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      }

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_POS2_RCORNERS1_FEATHER1(vb_data, geom, mat, start, num_faces, stride, verts_per_rect = 4) {

   let attribs_count = 0;
   let index = start;
   let vpos_x = 0;
   let uv_uindex = 0; // Uses 0-th coord for first 2 vertices of each face(4 vertices)

   const posx = geom.dim[0] * 2;
   const posy = geom.dim[1] * 2;

   for (let i = 0; i < num_faces + 1; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;
      let uv_vindex = 3; // Must alternate on every vertex

      for (let j = 0; j < 2; j++) {

         // COLOR
         vb_data[index++] = col[k][0];
         vb_data[index++] = col[k][1];
         vb_data[index++] = col[k][2];
         vb_data[index++] = col[k][3];

         // VERTEX POSITION
         vb_data[index++] = vpos_x;
         if (j === 0) vb_data[index++] = posy;
         if (j === 1) vb_data[index++] = 0;

         // STYLE
         vb_data[index++] = mat.style[0];
         vb_data[index++] = mat.style[2];

         attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

         uv_vindex--;
      }

      uv_uindex++;

      vpos_x += posx; // Increment the vertex position for the next 2 verts (face)

   }

   return attribs_count;

}








/**************************************************************************************************************************************/
// Fill - Instanced Attributes - Vertex Buffer Functions
/**************************************************************************************************************************************/

function INST_FILL_VERTEX_BUFFER_DIM2(vb_data, geom, mat, start, num_faces, stride) {

   // TODO: RESET THE VERTEX BUFFER BEFORE RESIZE THE MESH
   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // DIM
      vb_data[index++] = geom.dim[0] * num_faces;
      vb_data[index++] = geom.dim[1];

      attribs_count += stride;
      
   }

   return attribs_count;

}
function INST_FILL_VERTEX_BUFFER_WPOS3_DIM2(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // WPOS
      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      vb_data[index++] = 0;

      // DIMENTIONS
      vb_data[index++] = geom.dim[0] * num_faces;
      vb_data[index++] = geom.dim[1];

      attribs_count += stride;
      
   }

   return attribs_count;

}
function INST_FILL_VERTEX_BUFFER_WPOS3(vb_data, geom, mat, start, num_faces, stride) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // WPOS
      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      vb_data[index++] = 0;

      attribs_count += stride;
      
   }

   return attribs_count;

}
function INST_FILL_VERTEX_BUFFER_COL4_WPOS3(vb_data, geom, mat, start, num_faces, stride = 0) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WPOS
      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];

      attribs_count += stride;
      
   }

   return attribs_count;

}
