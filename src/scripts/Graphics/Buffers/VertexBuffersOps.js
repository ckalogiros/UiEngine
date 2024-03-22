"use strict";

import { Str_buffer_get_DEBUG, Str_buffer_get_by_idx } from "../../Engine/Core/StringBuffer";
import { Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs, Shader_attributes_get_attribs_offset_size } from "../ShaderAttributes";
import { Index_buffer_get_by_ibidx, Index_buffer_info_get_by_ibidx } from "./IndexBuffers";
import { Vertex_buffer_get_by_vbidx, Vertex_buffer_info_get_by_vbidx, Vertex_buffer_remove_geometry, Vertex_buffer_state_enable } from "./VertexBuffers";



/**************************************************************************************************************************************/
// Apropriate Function Selector
/**************************************************************************************************************************************/


export function Select_fnidx_to_fill_vertex_buffer(attribsidx) {

   const shader_attribs = Shader_attributes_get_attribs(attribsidx);
   const names = shader_attribs.names;
   const str_buffer = Str_buffer_get_DEBUG();
   if (Str_buffer_get_by_idx(names[0]) === 'a_col' && Str_buffer_get_by_idx(names[1]) === 'a_wpos_time' &&
       Str_buffer_get_by_idx(names[2]) === 'a_params1' && Str_buffer_get_by_idx(names[3]) === 'a_pos') {
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
   FILL_VERTEX_BUFFER_COL4_WPOS4_PARAMS1_POS2_FN0,
   FILL_VERTEX_BUFFER_COL4_WPOS4_POS2_TEX2_FN1,
];



export function Gl_operation_add(fnidx, vb_data, geom, mat, start, num_faces, stride) {
   return Vertex_buffer_fn_table_operation_add[fnidx](vb_data, geom, mat, start, num_faces, stride);
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

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
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

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
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

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
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

      vb_data[index++] = geom.pos[0];
      vb_data[index++] = geom.pos[1];
      vb_data[index++] = geom.pos[2];
      index++; // For WPOS4

      vb_data[index++] = mat.style[0];
      vb_data[index++] = mat.style[1];
      vb_data[index++] = mat.style[2];
      index++; // For PARAMS1 - STYLE3

      vb_data[index++] = geom.dim[0];
      vb_data[index++] = -geom.dim[1];

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




/**************************************************************************************************************************************/
// Add, Remove, Shift Attribs - Vertex Buffer Functions
/**************************************************************************************************************************************/


export function Gl_remove_geometry(gfx, num_faces = 1, start_index = 0) {

   const vb = Vertex_buffer_info_get_by_vbidx(gfx.vb.idx);
   const ib = Index_buffer_info_get_by_ibidx(gfx.ib.idx);

   const start = (start_index) ? start_index : gfx.vb.start;

   // Structure to use for updating a removed mesh's start index pointing to it's location in the vertex buffer..
   const ret = {
       counts: [0, 0], // 0:vb, 1:ib
       start: start,
       last: (start + gfx.vb.count * num_faces >= vb.count) ? true : false,
       empty: false, // Is the buffer is empty?
   };

   // if(DEBUG.GFX.REMOVE_MESH) console.log('idx:', gfx.prog.idx, gfx.vb.idx, 'vb count:', vb.count, ' attributes from start:', gfx.vb.start, ' to:', gfx.vb.start+gfx.vb.count*num_faces)
   // ret.counts[0] = vb.Remove_geometry(gfx, num_faces, start);
   ret.counts[0] = Vertex_buffer_remove_geometry(gfx, num_faces, start);
   ret.counts[1] = ib.Remove_geometry(num_faces); // It doe not matter from where we remove indexes, as long as the vertices per face are same. 

   // vb.in
   // if (vb.count <= 0) ret.empty = true;

   // if (ret.empty) vb.Reset();


   return ret;
}



export function Gl_remove_geometry_params(vbidx, num_faces = 1, start_index = 0, attribsPerVertex, verticesPerRect) {

   const vb = Vertex_buffer_info_get_by_vbidx(vbidx);
   const ib = Index_buffer_get_by_ibidx(vbidx);

   const start = start_index;

   // Structure to use for updating a removed mesh's start index pointing to it's location in the vertex buffer..
   const ret = {
       counts: [0, 0], // 0:vb, 1:ib
       start: start,
       last: (start + ((attribsPerVertex * verticesPerRect) * num_faces) >= vb.count) ? true : false,
       empty: false, // Is the buffer is empty?
   };

   // if(DEBUG.GFX.REMOVE_MESH) console.log('idx:', gfx.prog.idx, gfx.vb.idx, 'vb count:', vb.count, ' attributes from start:', gfx.vb.start, ' to:', gfx.vb.start+gfx.vb.count*num_faces)
   ret.counts[0] = vb.Remove_geometry_params(num_faces, start, attribsPerVertex, verticesPerRect);
   ret.counts[1] = ib.Remove_geometry(num_faces); // It doe not matter from where we remove indexes, as long as the vertices per face are same. 

   if (vb.count <= 0) ret.empty = true;

   if (ret.empty) vb.Reset();


   return ret;
}



export function Gl_set_vb_mesh_priority(progidx, vbIdx, meshIdx, meshCount) {

   const vb = Vertex_buffer_info_get_by_vbidx(progidx, vbIdx);

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

   alert('IMPLEMENT ME. @ Gl_set_RGBA()');
   // /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_RGBA()'); }

   // // const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   // const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);

   // const offset = Shader_attributes_get_attrib_offset_by_nameid(SHADER_ATTRIBUTES.COL4);

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
}



export function Gl_set_RGBA(gfxInfo, color, num_faces = 1) {

   /**DEBUG*/if (gfxInfo === null) { alert('GFX is null. @ Gl_set_RGBA()'); }

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.COL4);

   let index = gfxInfo.vb.start + a.offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - a.size;

   while (verts) {

       vb_data[index++] = color[0]; // Move mesh's x pos by amt
       vb_data[index++] = color[1]; // Move mesh's x pos by amt
       vb_data[index++] = color[2]; // Move mesh's x pos by amt
       vb_data[index++] = color[3]; // Move mesh's x pos by amt

       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
       verts--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_alpha(gfxInfo, val, num_faces) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

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



export function Gl_set_dim_XY(gfxInfo, dim, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.POS2);

   let index = gfxInfo.vb.start + a.offset;
   let faces = num_faces;
   let stride = gfxInfo.attribsPerVertex - a.size;


   while (faces) {

       vb_data[index++] = -dim[0];
       vb_data[index++] = dim[1];
       index += stride;

       vb_data[index++] = -dim[0];
       vb_data[index++] = -dim[1];
       index += stride;

       vb_data[index++] = dim[0];
       vb_data[index++] = dim[1];
       index += stride;

       vb_data[index++] = dim[0];
       vb_data[index++] = -dim[1];
       index += stride;

       faces--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_dim_X(gfxInfo, x, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.POS2);

   let index = gfxInfo.vb.start + offset;
   let faces = num_faces;
   let stride = gfxInfo.attribsPerVertex;

   while (faces) {

       vb_data[index] = -x;
       index += stride;
       vb_data[index] = -x;
       index += stride;
       vb_data[index] = x;
       index += stride;
       vb_data[index] = x;
       index += stride;

       faces--;

   }

   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_dim_Y(gfxInfo, y, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.POS2);

   let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.DIM_Y;
   let faces = num_faces;
   let stride = gfxInfo.attribsPerVertex;

   while (faces) {

       vb_data[index] = y;
       index += stride;
       vb_data[index] = -y;
       index += stride;
       vb_data[index] = y;
       index += stride;
       vb_data[index] = -y;
       index += stride;

       faces--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_add_wpos_XYZ(gfxInfo, wpos, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   const stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XYZ;

   while (verts) {

       vb_data[index++] += wpos[0]; // Move mesh's x pos by amt
       vb_data[index++] += wpos[1]; // Move mesh's y pos by amt
       vb_data[index++] += wpos[2]; // Move mesh's y pos by amt

       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
       verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_wpos_XYZ(gfxInfo, pos, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XYZ;

   while (verts) {

       vb_data[index++] = pos[0];
       vb_data[index++] = pos[1];
       vb_data[index++] = pos[2];


       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
       verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_wpos_XY(gfxInfo, wpos, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XY;

   while (verts) {

       vb_data[index++] = wpos[0]; // Move mesh's x pos by amt
       vb_data[index++] = wpos[1]; // Move mesh's y pos by amt

       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
       verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_add_wpos_XY(gfxInfo, wpos, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex - GRAPHICS_LAYOUT.ATTR_SIZES.XY;

   while (verts) {

       vb_data[index++] += wpos[0]; // Move mesh's x pos by amt
       vb_data[index++] += wpos[1]; // Move mesh's y pos by amt

       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
       verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_add_wpos_X(gfxInfo, x, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex

   while (verts) {

       vb_data[index++] += x; // Move mesh's x pos by amt
       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
       verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_add_wpos_Y(gfxInfo, y, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset;
   let verts = num_faces * gfxInfo.vertsPerRect;
   let stride = gfxInfo.attribsPerVertex

   while (verts) {

       vb_data[index] += y; // Move mesh's x pos by amt
       index += stride; // Go to next vertice's pos. +1 for skipping pos.z
       verts--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_wpos_X(gfxInfo, posx, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset;
   let faces = num_faces; // Number of vertices
   let stride = gfxInfo.attribsPerVertex;

   while (faces) {

       vb_data[index] = posx;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posx;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posx;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posx;
       index += stride; // Go to next vertice's wposx.

       faces--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_wpos_Y(gfxInfo, posy, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.WPOS_Y;
   let faces = num_faces; // Number of vertices
   let stride = gfxInfo.attribsPerVertex; // Offset to next scale[0] attribute

   while (faces) {

       vb_data[index] = posy;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posy;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posy;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posy;
       index += stride; // Go to next vertice's wposx.

       faces--;
   }
   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_wpos_Z(gfxInfo, posz, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

   let index = gfxInfo.vb.start + offset + GRAPHICS_LAYOUT.ATTR_SELF_OFFSETS.WPOS_Z;
   let faces = num_faces; // Number of vertices
   let stride = gfxInfo.attribsPerVertex;

   while (faces) {

       vb_data[index] = posz;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posz;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posz;
       index += stride; // Go to next vertice's wposx.
       vb_data[index] = posz;
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



export function Gl_set_uv(gfxInfo, uvs, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const a = Shader_attributes_get_attribs_offset_size(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.TEX2);

   let index = gfxInfo.vb.start + a.offset;
   // let numTimes = num_faces;
   let stride = gfxInfo.attribsPerVertex - a.size;

   while (num_faces) {

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

       num_faces--;
   }

   Vertex_buffer_state_enable(gfxInfo.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
}



export function Gl_set_uv2(vbidx, uvs, start, attr_offset, attr_size, attribs_per_vertex, num_faces = 1) {

   const vb_data = Vertex_buffer_get_by_vbidx(vbidx);

   let index = start + attr_offset;
   // let numTimes = num_faces;
   let stride = attribs_per_vertex - attr_size;

   while (num_faces) {

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

       num_faces--;
   }

}


export function Gl_set_wpos_time(gfxInfo, val) {

   const vb_data = Vertex_buffer_get_by_vbidx(gfxInfo.vb.idx);
   const offset = Shader_attributes_get_attrib_offset_by_nameid(gfxInfo.prog.attribsidx, SHADER_ATTRIBUTES.WPOS4);

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