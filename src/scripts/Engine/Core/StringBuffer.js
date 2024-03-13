"use strict";

import { M_Buffer } from "./Buffers";


const _str_Buffer = new M_Buffer();
_str_Buffer.Add(''); // Empty string

export function Str_buffer_get_DEBUG() {
   return _str_Buffer;
}

export function Str_buffer_store(str) {
   const idx = _str_Buffer.Add(str);
   return idx;
}



export function Str_buffer_get_by_idx(nameidx) {
   return _str_Buffer.buffer[nameidx];
}



export function Str_buffer_get_empty_string() {
   return _str_Buffer.buffer[0];
}



export function Str_buffer_change(nameidx, new_name) {
   _str_Buffer.RemoveByIdx(nameidx);
   const idx = _str_Buffer.Add(new_name);
   return idx;
}



export function Str_buffer_print() {
   console.log(_str_Buffer);
}