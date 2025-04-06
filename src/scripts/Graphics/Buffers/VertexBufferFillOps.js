"use strict"

import { Shader_attributes_get_attribs } from "../ShaderAttributes.js";







/**************************************************************************************************************************************/
// Function Selector
/**************************************************************************************************************************************/

_CNT = 0;
const FUNCTION_TABLE_IDXS = {
   COL4_WPOS3_VPOS2_RCORNERS_FEATHER: INT_NULL,
   // COL4_WPOS3_VPOS2_RCORNERS_FEATHER_BORDER_GLOW_INTENSITY: INT_NULL,
   // COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_GLOW_INTENSITY: INT_NULL,
   // COL4_WPOS3_VPOS2_RCORNERS_FEATHER_GLOW_INTENSITY: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_ANGLE: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS_FEATHER: INT_NULL,
   COL4_WPOS3_VPOS2_TEX2_RCORNERS_FEATHER: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME_GENERIC2: INT_NULL,
   // COL4_WPOS3_VPOS2_DIM2_RCORNERS_GENERIC2: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_TIME_GENERIC2: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_RCORNERS: INT_NULL,
   COL4_WPOS3_VPOS2_FEATHER: INT_NULL,
   COL4_WPOS3_VPOS2_TEX2: INT_NULL,
   COL4_WPOS3_VPOS2: INT_NULL,
   COL4_WPOS3_TIME_VPOS2_RCORNERS_FEATHER_BORDER: INT_NULL,
   COL4_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER: INT_NULL,
   COL4_WPOS3_RCORNERS_FEATHER: INT_NULL,
   COL4_WPOS3_TIME_VPOS2_DIM2_RCORNERS_FEATHER: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_TIME: INT_NULL,
   COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TIME: INT_NULL,
   COL4_WPOS3_TIME_VPOS2_DIM2_TEX2_TIME: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2_TIME: INT_NULL,
   COL4_WPOS3_VPOS2_DIM2: INT_NULL,
   COL4_WPOS3_VPOS2_TIME: INT_NULL,
   COL4_WPOS3_TEX2: INT_NULL,
   POS2_RCORNERS_FEATHER: INT_NULL,
   WPOS3_VPOS2_RCORNERS_FEATHER: INT_NULL,
   WPOS3_VPOS2: INT_NULL,
   POS2_TEX2: INT_NULL,
   VPOS2: INT_NULL,

   COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER_ANGLE: INT_NULL,
   COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE: INT_NULL,
   COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER: INT_NULL,
   COL4PERVERTEX_WPOS3_VPOS2_RCORNERS_FEATHER: INT_NULL,
   COL4PERVERTEX_WPOS3_VPOS2: INT_NULL,
   COL4PERVERTEX_VPOS2_RCORNERS_FEATHER: INT_NULL,
   COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS: INT_NULL,
   // Instaned Geometry
   INST_COL4_WPOS3_DIM2_RCORNERS_FEATHER_ANGLE: INT_NULL,
   INST_COL4_WPOS3_DIM2_RCORNERS_FEATHER: INT_NULL,
   INST_COL4_WPOS3_RCORNERS_FEATHER: INT_NULL,
   INST_COL4_WPOS3_TIME: INT_NULL,
   INST_COL4_WPOS3: INT_NULL,
   INST_WPOS3: INT_NULL,
   // TESTS

   SIZE: INT_NULL,
};




const Vertex_buffer_fn_table_operation_add = [
   FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_VPOS2_DIM2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_TIME,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TIME,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TEX2,
   // FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_BORDER_GLOW_INTENSITY,
   // FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_GLOW_INTENSITY,
   // FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_GLOW_INTENSITY,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_ANGLE,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE,
   FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_VPOS2_RCORNERS_FEATHER_BORDER,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME_GENERIC2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TIME_GENERIC2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_FEATHER,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_TIME,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TIME,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_TIME,
   FILL_VERTEX_BUFFER_COL4_WPOS3_TEX2,
   FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2,
   FILL_VERTEX_BUFFER_WPOS3_VPOS2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_WPOS3_VPOS2,
   FILL_VERTEX_BUFFER_VPOS2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_VPOS2,
   FILL_VERTEX_BUFFER_VPOS2_TEX2,

   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER_ANGLE,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_ANGLE,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2_RCORNERS_FEATHER,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS,
   FILL_VERTEX_BUFFER_COL4PERVERTEX_VPOS2_RCORNERS_FEATHER,
   // Instanced Geometry
   INST_FILL_VERTEX_BUFFER_COL4_WPOS3_DIM2_RCORNERS_FEATHER_ANGLE,
   INST_FILL_VERTEX_BUFFER_COL4_WPOS3_DIM2_RCORNERS_FEATHER,
   INST_FILL_VERTEX_BUFFER_COL4_WPOS3_RCORNERS_FEATHER,
   INST_FILL_VERTEX_BUFFER_COL4_WPOS3_TIME,
   INST_FILL_VERTEX_BUFFER_COL4_WPOS3,
   INST_FILL_VERTEX_BUFFER_WPOS3,

   //TESTS
];


function Set_up_fn_table() {

   const len = Vertex_buffer_fn_table_operation_add.length;
   for (let i = 0; i < len; i++) {

      if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_VPOS2_DIM2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_VPOS2_DIM2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_TIME) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TIME) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_VPOS2_RCORNERS_FEATHER_BORDER) FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_VPOS2_RCORNERS_FEATHER_BORDER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_TEX2_RCORNERS_FEATHER = i;
      // else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_BORDER_GLOW_INTENSITY) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER_BORDER_GLOW_INTENSITY = i;
      // else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_GLOW_INTENSITY) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_GLOW_INTENSITY = i;
      // else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_GLOW_INTENSITY) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER_GLOW_INTENSITY = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_ANGLE) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_ANGLE = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.COL4_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME_GENERIC2) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME_GENERIC2 = i;
      // else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_GENERIC2) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_GENERIC2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TIME_GENERIC2) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TIME_GENERIC2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_FEATHER) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_TIME) FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_VPOS2_DIM2_TEX2_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_TEX2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TIME) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_TIME) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_TEX2) FUNCTION_TABLE_IDXS.COL4_WPOS3_TEX2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2) FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_WPOS3_VPOS2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.WPOS3_VPOS2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_WPOS3_VPOS2) FUNCTION_TABLE_IDXS.WPOS3_VPOS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_VPOS2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.POS2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_VPOS2) FUNCTION_TABLE_IDXS.VPOS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_VPOS2_TEX2) FUNCTION_TABLE_IDXS.POS2_TEX2 = i;

      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER_ANGLE) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER_ANGLE = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_ANGLE) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_VPOS2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.COL4PERVERTEX_VPOS2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS) FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS = i;
      // Instanced Geometry
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_COL4_WPOS3_DIM2_RCORNERS_FEATHER_ANGLE) FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_DIM2_RCORNERS_FEATHER_ANGLE = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_COL4_WPOS3_DIM2_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_DIM2_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_COL4_WPOS3_RCORNERS_FEATHER) FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_RCORNERS_FEATHER = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_COL4_WPOS3_TIME) FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_TIME = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_COL4_WPOS3) FUNCTION_TABLE_IDXS.INST_COL4_WPOS3 = i;
      else if (Vertex_buffer_fn_table_operation_add[i] === INST_FILL_VERTEX_BUFFER_WPOS3) FUNCTION_TABLE_IDXS.INST_WPOS3 = i;
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
      if (inst & SID.ATTR.COL4) clean_inst |= SID.ATTR.COL4;
      if (attr & SID.ATTR.COL4_PER_VERTEX) clean_inst |= SID.ATTR.COL4_PER_VERTEX;
      if (inst & SID.ATTR.WPOS3) clean_inst |= SID.ATTR.WPOS3;
      if (inst & SID.ATTR.DIM2) clean_inst |= SID.ATTR.DIM2;
      if (inst & SID.ATTR.TEX2) clean_inst |= SID.ATTR.TEX2;
      if (inst & SID.ATTR.TIME) clean_inst |= SID.ATTR.TIME;
      if (inst & SID.ATTR.R_CORNERS) clean_inst |= SID.ATTR.R_CORNERS;
      if (inst & SID.ATTR.FEATHER) clean_inst |= SID.ATTR.FEATHER;
      if (inst & SID.ATTR.ANGLE) clean_inst |= SID.ATTR.ANGLE;
      if (inst & SID.ATTR.BORDER) clean_inst |= SID.ATTR.BORDER;
      if (attr & SID.ATTR.COL4_PER_VERTEX) alert('Color4 Per Vertex attribute cannot exist in instance buffer');

      if (clean_inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.ANGLE)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_DIM2_RCORNERS_FEATHER_ANGLE;
      if (clean_inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_DIM2_RCORNERS_FEATHER;
      if (clean_inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_RCORNERS_FEATHER;
      if (clean_inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS3_TIME;
      if (clean_inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3)) return FUNCTION_TABLE_IDXS.INST_COL4_WPOS3;
      if (clean_inst === (SID.ATTR.WPOS3)) return FUNCTION_TABLE_IDXS.INST_WPOS3;
   }
   else {

      // TODO: Should we dijoint the COL4 from the per vertex color?
      // todo: Also the COL4 in a per vertex buffer is also a per vertex color in gfx buffers. So the name COL4 is only valid in the mesh perspective.  
      let clean_attr = 0x0;
      if (attr & SID.ATTR.COL4) {
         if (attr & SID.ATTR.COL4_PER_VERTEX) clean_attr |= SID.ATTR.COL4_PER_VERTEX;
         else clean_attr |= SID.ATTR.COL4;
      }
      if (attr & SID.ATTR.WPOS3) clean_attr |= SID.ATTR.WPOS3;
      if (attr & SID.ATTR.VPOS2) clean_attr |= SID.ATTR.VPOS2;
      if (attr & SID.ATTR.DIM2) clean_attr |= SID.ATTR.DIM2;
      if (attr & SID.ATTR.R_CORNERS) clean_attr |= SID.ATTR.R_CORNERS;
      if (attr & SID.ATTR.FEATHER) clean_attr |= SID.ATTR.FEATHER;
      if (attr & SID.ATTR.TIME) clean_attr |= SID.ATTR.TIME;
      if (attr & SID.ATTR.ANGLE) clean_attr |= SID.ATTR.ANGLE;
      if (attr & SID.ATTR.BORDER) clean_attr |= SID.ATTR.BORDER;
      if (attr & SID.ATTR.TEX2) clean_attr |= SID.ATTR.TEX2;
      // if (attr & SID.ATTR.GLOW_INTENSITY) clean_attr |= SID.ATTR.GLOW_INTENSITY;
      if (attr & SID.ATTR.GENERIC2) clean_attr |= SID.ATTR.GENERIC2;

      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.BORDER | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_VPOS2_RCORNERS_FEATHER_BORDER;
      // if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.GLOW_INTENSITY)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_GLOW_INTENSITY;
      // if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.BORDER | SID.ATTR.GLOW_INTENSITY)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER_BORDER_GLOW_INTENSITY;
      // if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.GLOW_INTENSITY)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER_GLOW_INTENSITY;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.ANGLE)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_ANGLE;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.ANGLE)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_VPOS2_DIM2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_TIME;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TIME;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.TEX2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.TEX2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_TEX2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.TEX2 | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TIME_VPOS2_DIM2_TEX2_TIME;
      if (clean_attr === (SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.WPOS3_VPOS2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2;

      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.TIME | SID.ATTR.GENERIC2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME_GENERIC2;
      // if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.GENERIC2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_GENERIC2;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TIME_GENERIC2;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.TEX2 | SID.ATTR.R_CORNERS)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2| SID.ATTR.R_CORNERS)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_RCORNERS;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_DIM2_TIME;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.TIME)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_TIME;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2_TEX2;
      if (clean_attr === (SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.POS2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_VPOS2;
      if (clean_attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.COL4_WPOS3_TEX2;
      if (clean_attr === (SID.ATTR.WPOS3 | SID.ATTR.VPOS2)) return FUNCTION_TABLE_IDXS.WPOS3_VPOS2;
      if (clean_attr === (SID.ATTR.VPOS2 | SID.ATTR.TEX2)) return FUNCTION_TABLE_IDXS.POS2_TEX2;
      if (clean_attr === (SID.ATTR.WPOS3)) return FUNCTION_TABLE_IDXS.WPOS3;
      if (clean_attr === (SID.ATTR.VPOS2)) return FUNCTION_TABLE_IDXS.VPOS2;

      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.ANGLE)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER_ANGLE;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.ANGLE)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER | SID.ATTR.VPOS2)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_VPOS2_RCORNERS_FEATHER;
      if (clean_attr === (SID.ATTR.COL4_PER_VERTEX | SID.ATTR.WPOS3 | SID.ATTR.VPOS2)) return FUNCTION_TABLE_IDXS.COL4PERVERTEX_WPOS3_VPOS2;

   }


   console.error('NO function (pointer) was set for adding meshes to Vertex buffer. attrib names:', names, shader_attribs.attr_flag, SID.ATTR);
   // alert('SEE CONOLE ERROR.\nNO add function pointer was set. attrib names:')
   alert(`${inst} SEE CONOLE ERROR.\nNO add function pointer was set. attrib names:`)
   return -1;
}






export function Gl_operation_add(fnidx, vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset, vCount) {
   const vb_info_count = Vertex_buffer_fn_table_operation_add[fnidx](vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset, vCount);
   return vb_info_count;
}


// export function FILL_VERTEX_BUFFER_TEST(vb_data, attribs, start, num_faces, stride, num_vertices, a_vpos_offset) {

//    let attribs_count = 0;
//    let index = start;

//    // for (let i = 0; i < num_faces; i++) {
      
//    //    for (let j = 0; j < num_vertices; j++) {

//    //       for (let k = 0; k < attribs.length; k++) {
            
//    //          for (let l = 0; l < attribs[k].length; l++) {

//    //             vb_data[index++] = attribs[k][l];
//    //          }
//    //       }
//    //    }

//    //    attribs_count += stride; // TODO: Store Vertices_per_rect in shader_attribs?????

//    // }
//    for (let i = 0; i < num_faces; i++) {
      
//       for (let j = 0; j < num_vertices; j++) {

//          for (let k = 0; k < attribs.length; k++) {
            
//             vb_data[index++] = attribs[k];
//          }
//       }

//       attribs_count += stride; // TODO: Store Vertices_per_rect in shader_attribs?????

//    }

//    // Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
//    return attribs_count;

// }




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
 *    (COL4) (WPOS3) (TIME) (VPOS2) (R_CORNERS) (BORDER) (FEATHER) (TEX2) (SDF) (MSDF) {

 * 
 **************************************************************************************************************************************/


export function Set_vertex_position_VPOS2(vb_data, start, stride, dimx, dimy, num_faces, len) {

   let index = start;

   stride -= 2;

   let width = (dimx * 2) / (num_faces);
   let l = -dimx;
   let t = -dimy;
   let b = dimy;

   len /= 2;

   for (let i = 0; i < len; i++) {

      // VERTEX POSITION
      vb_data[index++] = l;
      vb_data[index++] = t;
      index += stride;

      vb_data[index++] = l;
      vb_data[index++] = b;
      index += stride;

      l += width;

   }

}
function Set_vertex_uv_coordinates_TEX2(vb_data, start, stride, uv) {

   let index = start;

   stride -= 2;

   const u0 = uv[0];
   const u1 = uv[1];
   const v0 = uv[2];
   const v1 = uv[3];

   // VERTEX POSITION

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

}




function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // TEXTURE COORDS
      index += V_TEX_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TEX2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      // TEXTURE COORDS
      index += V_TEX_COUNT;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_TIME(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // TEXTURE COORDS
      index += V_TEX_COUNT;

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TIME(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   // Set_vertex_uv_coordinates_TEX2(vb_data, start+a_uv_offset, stride, mat.uv);

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_TIME(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);

}
function INST_FILL_VERTEX_BUFFER_COL4_WPOS3_TIME(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_TEX2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // TEXTURE COORDS
      index += V_TEX_COUNT;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_VPOS2_RCORNERS_FEATHER_BORDER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;
      vb_data[index++] = mat.style.border;

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      // index += V_POS_COUNT;
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   // const a_dim_offset = a_vpos_offset+2
   // Set_dimention_DIM2(vb_data, start+a_dim_offset, stride, geom.dim[0], geom.dim[1], num_faces);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;

      // TIME
      vb_data[index++] = geom.time;

      // // GENERIC
      // // index += V_GENERIC2_COUNT;
      // vb_data[index++] = geom.generic.a;
      // vb_data[index++] = geom.generic.b;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   // const a_dim_offset = a_vpos_offset+2
   // Set_dimention_DIM2(vb_data, start+a_dim_offset, stride, geom.dim[0], geom.dim[1], num_faces);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TEX2_RCORNERS(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // TEXTURE COORDS
      index += V_TEX_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;

      // // TIME
      // vb_data[index++] = geom.time;

      // // GENERIC
      // // index += V_GENERIC2_COUNT;
      // vb_data[index++] = geom.generic.a;
      // vb_data[index++] = geom.generic.b;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   // const a_dim_offset = a_vpos_offset+2
   // Set_dimention_DIM2(vb_data, start+a_dim_offset, stride, geom.dim[0], geom.dim[1], num_faces);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_TIME_GENERIC2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;

      // TIME
      vb_data[index++] = geom.time;

      // GENERIC
      // index += V_GENERIC2_COUNT;
      vb_data[index++] = geom.generic.a;
      vb_data[index++] = geom.generic.b;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   // const a_dim_offset = a_vpos_offset+2
   // Set_dimention_DIM2(vb_data, start+a_dim_offset, stride, geom.dim[0], geom.dim[1], num_faces);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_TIME_GENERIC2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // TIME
      vb_data[index++] = geom.time;

      // GENERIC
      // index += V_GENERIC2_COUNT;
      vb_data[index++] = geom.generic.a;
      vb_data[index++] = geom.generic.b;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   // const a_dim_offset = a_vpos_offset+2
   // Set_dimention_DIM2(vb_data, start+a_dim_offset, stride, geom.dim[0], geom.dim[1], num_faces);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_ANGLE(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      // ANGLE
      vb_data[index++] = 0

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_ANGLE(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;

      // ANGLE
      vb_data[index++] = 0

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TIME_VPOS2_DIM2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_DIM2_RCORNERS_FEATHER_TIME(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2_RCORNERS_FEATHER_TIME(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      // TIME
      vb_data[index++] = geom.time;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_VPOS2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // // VERTEX POSITION
      index += V_POS_COUNT;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_WPOS3_VPOS2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_WPOS3_VPOS2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_VPOS2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_VPOS2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);

}
function FILL_VERTEX_BUFFER_COL4_WPOS3_TEX2() {

   let attribs_count = 0;
   let index = start;
   const len = num_faces * verts_per_rect;

   for (let i = 0; i < len; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // TEXTURE COORDS
      index += V_TEX_COUNT;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_VPOS2_TEX2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, a_uv_offset) {

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   Set_vertex_uv_coordinates_TEX2(vb_data, start + a_uv_offset, stride, mat.uv);

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_VPOS2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   const len = num_faces * verts_per_rect;
   const col_len = mat.col.length - 1;

   for (let i = 0; i < len; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      // COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      k++;
      if (k > col_len) k = 0;
   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2_DIM2_RCORNERS(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset, _, vCount) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   const len = num_faces * verts_per_rect+2;
   const col_len = mat.col.length - 1;

   // for (let i = 0; i < len; i++) {
   for (let i = 0; i < vCount; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      // COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      k++;
      if (k > col_len) k = 0;
   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   // const len = num_faces * verts_per_rect;
   const len = (num_faces * verts_per_rect) + 2;
   const col_len = mat.col.length - 1;

   for (let i = 0; i < len; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      // COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      k++;
      if (k > col_len) k = 0;

   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_VPOS2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   const len = num_faces * verts_per_rect;
   const col_len = mat.col.length - 1;

   for (let i = 0; i < len; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      // COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      k++;
      if (k > col_len) k = 0;
   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER_ANGLE(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   const len = num_faces * verts_per_rect;
   const col_len = mat.col.length - 1;

   for (let i = 0; i < len; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      // COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      // ANGLE
      vb_data[index++] = 0;


      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      k++;
      if (k > col_len) k = 0;
   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_ANGLE(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   const len = num_faces * verts_per_rect;
   const col_len = mat.col.length - 1;

   for (let i = 0; i < len; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      // COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;

      // ANGLE
      vb_data[index++] = 0;


      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      k++;
      if (k > col_len) k = 0;
   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}
function FILL_VERTEX_BUFFER_COL4PERVERTEX_WPOS3_DIM2_VPOS2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;
   let k = 0;
   const len = (num_faces * verts_per_rect) + 2;
   const col_len = mat.col.length - 1;

   // if(verts_per_rect === 2) len += 2
   // if(index >= 780)
   //    len = 14

   for (let i = 0; i < len; i++) {

      // Case some meshes have one color for all vertices, but still use color per vertex buffer.
      const col = (mat.col[k].constructor === Float32Array) ? mat.col[k] : mat.col;

      // COLOR
      vb_data[index++] = col[0];
      vb_data[index++] = col[1];
      vb_data[index++] = col[2];
      vb_data[index++] = col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // VERTEX POSITION
      index += V_POS_COUNT;

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride; // TODO: Store Vertices_per_rect in shder_attribs?????
      k++;
      if (k > col_len) k = 0;
   }

   Set_vertex_position_VPOS2(vb_data, start + a_vpos_offset, stride, geom.dim[0], geom.dim[1], num_faces, len);
   return attribs_count;

}







/**************************************************************************************************************************************/
// Fill - Instanced Attributes - Vertex Buffer Functions
/**************************************************************************************************************************************/

function INST_FILL_VERTEX_BUFFER_COL4_WPOS3_DIM2_RCORNERS_FEATHER_ANGLE(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      // ΑΝΓΛΕ
      vb_data[index++] = 0;

      attribs_count += stride;

   }

   return attribs_count;

}
function INST_FILL_VERTEX_BUFFER_COL4_WPOS3_DIM2_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // DIMENTION
      vb_data[index++] = geom.dim[0];
      vb_data[index++] = geom.dim[1];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride;

   }

   return attribs_count;

}
function INST_FILL_VERTEX_BUFFER_COL4_WPOS3_RCORNERS_FEATHER(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      // STYLE
      vb_data[index++] = mat.style.rcorners;
      vb_data[index++] = mat.style.feather;

      attribs_count += stride;

   }

   return attribs_count;

}
function INST_FILL_VERTEX_BUFFER_COL4_WPOS3(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset = 0) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // COLOR
      vb_data[index++] = mat.col[0];
      vb_data[index++] = mat.col[1];
      vb_data[index++] = mat.col[2];
      vb_data[index++] = mat.col[3];

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      attribs_count += stride;

   }

   return attribs_count;

}
function INST_FILL_VERTEX_BUFFER_WPOS3(vb_data, geom, mat, start, num_faces, stride, verts_per_rect, a_vpos_offset) {

   let attribs_count = 0;
   let index = start;

   for (let i = 0; i < num_faces; i++) {

      // WORLD POSITION
      vb_data[index++] = geom.pos[0] + geom.dim[0];
      vb_data[index++] = geom.pos[1] + geom.dim[1];
      vb_data[index++] = geom.pos[2];

      attribs_count += stride;

   }

   return attribs_count;

}

