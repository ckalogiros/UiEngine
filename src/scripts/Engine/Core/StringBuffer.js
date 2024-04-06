"use strict";

import { Int16Buffer, M_Buffer } from "./Buffers.js";
// import { Mesh_buffer_get_mesh_byidx_I } from "./MeshBufferFunctions.js";
// import { Mesh_buffer_get_mesh_byidx } from "./MeshBuffer.js";
// import { _str_buffer_ } from "./StringBufferTest.js";


const _str_buffer = new M_Buffer();
_str_buffer.Add(''); // Empty string


export function Str_buffer_get_DEBUG() {
   return _str_buffer;
}

export function Str_buffer_store(str, mesh_refference) {
   
   const idx = _str_buffer.Add(str);
   return idx;
}



export function Str_buffer_get_by_idx(nameidx) {
   return _str_buffer.buffer[nameidx];
}



export function Str_buffer_get_empty_string() {
   return _str_buffer.buffer[0];
}



export function Str_buffer_change(nameidx, new_name) {
   _str_buffer.RemoveByIdx(nameidx);
   const idx = _str_buffer.Add(new_name);
   return idx;
}



 


/****************************************************************************************************************************************************/
// String Buffer for mesh names only
/****************************************************************************************************************************************************/


const _str_buffer_mesh_names = new M_Buffer();

// A buffer to index the string buffer. Stores the mesh's idx (mesh_bufferidx).
// These 2 buffers must be 1to1. If a mesh name is stored at inde 3, then the '_str_buffer_mesh_names_index_buffer' must have the meshe's 'mesh_bufferidx' at index 3 also.
const _str_buffer_mesh_names_index_buffer = new Int16Buffer(512);



export function Str_buffer_mesh_names_get_DEBUG() {
   return _str_buffer_mesh_names;
}




export function Str_buffer_mesh_names_get_by_idx(nameidx) {
   return _str_buffer_mesh_names.buffer[nameidx];
}



export function Str_buffer_mesh_names_store(str, mesh_bufferidx) {
   
   const idx = _str_buffer_mesh_names.Add(str);

   // Create element in '_str_buffer_mesh_names_index_buffer' at same index.
   _str_buffer_mesh_names_index_buffer.AddAtIndex(idx, mesh_bufferidx)

   return idx;
}




export function Str_buffer_mesh_names_remove_by_idx(nameidx) {
   
   _str_buffer_mesh_names.RemoveByIdx(nameidx);
   
   const replacer_idx = _str_buffer_mesh_names_index_buffer.RemoveByIdxSortedVersion(nameidx);
   
   // Because we moved an element, the last replaced the removed, we need to set the new index for the mesh that pointed at the last(moved) element.
   // Get the mesh index. 
   const replacer_meshidx = _str_buffer_mesh_names_index_buffer.buffer[replacer_idx];
   // Get the mesh. 
   const replacer_mesh = Mesh_buffer_get_mesh_byidx_I(replacer_meshidx);
   // Update mesh's new nameidx. 
   replacer_mesh.nameidx = replacer_idx;
}














/****************************************************************************************************************************************************/
// DEBUG-PRINT
/****************************************************************************************************************************************************/

export function Str_buffer_print() {
   console.log(_str_buffer);
}



