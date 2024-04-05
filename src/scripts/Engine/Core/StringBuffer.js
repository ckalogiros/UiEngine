"use strict";

import { Int16Buffer, M_Buffer } from "./Buffers";


const _str_buffer = new M_Buffer();
_str_buffer.Add(''); // Empty string

// A buffer to index the string buffer. Stores the mesh's idx (mesh_bufferidx).
const _str_index_buffer = new Int16Buffer(512);

export function Str_buffer_get_DEBUG() {
   return _str_buffer;
}

export function Str_buffer_store(str, mesh_bufferidx) {
   
   const idx = _str_buffer.Add(str);

   _str_index_buffer

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
// DEBUG-PRINT
/****************************************************************************************************************************************************/

export function Str_buffer_print() {
   console.log(_str_buffer);
}



