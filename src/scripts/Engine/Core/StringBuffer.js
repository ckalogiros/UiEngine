"use strict";

import { NOTIFICATION_TYPE, Notifications_send } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Int16Buffer, M_Buffer, New_generic_buffer, New_int16_buffer } from "./Buffers.js";
import { Mesh_buffer_get_mesh_byidx } from "./MeshBuffer.js";



const NOTIFICATIONS_ON = true;



/**
 * '_str_buffer' is the storage for any Application's strings, except mesh names.
 * E.x. Could be names for timers, intervals, animations, frambuffers, textures, ... etc.
 * The reason of the separation is that for the mesh names buffer, we have refferenses to meshes via an int, the mesh_bufferidx.
 * For the '_str_buffer' we can get only a pointer refference.
 */

const _str_buffer = New_generic_buffer(_, 'String buffer');
_str_buffer.Add(''); // Empty string




export function Str_buffer_get_count() { return _str_buffer.active_count; }
export function Str_buffer_get_size() { return _str_buffer.size; }



export function Str_buffer_get_DEBUG() {
   return _str_buffer;
}




export function Str_buffer_store(str) {

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




export function Str_buffer_destroy(nameidx) {
   _str_buffer.RemoveByIdx(nameidx);
   // const idx = _str_buffer.Add(new_name);
   // return idx;
}






/****************************************************************************************************************************************************/
// String Buffer for mesh names only
/****************************************************************************************************************************************************/


const _str_buffer_mesh_names = New_generic_buffer(_, 'String buffer names');




// A buffer to index the string buffer. Stores the mesh's idx (mesh_bufferidx).
// These 2 buffers must be 1to1. If a mesh name is stored at inde 3, then the '_str_buffer_mesh_names_index_buffer' must have the meshe's 'mesh_bufferidx' at index 3 also.
// Usage of indices buffer to string names buffer: We need a connection back to the mesh, so we can change any mesh's name on the sorted buffers. 
const _str_buffer_mesh_names_index_buffer = New_int16_buffer(512);



export function Str_buffer_mesh_names_get_count() { return _str_buffer_mesh_names.active_count; }
export function Str_buffer_mesh_names_get_size() { return _str_buffer_mesh_names.size; }



export function Str_buffer_mesh_names_get_DEBUG() {
   return _str_buffer_mesh_names;
}




export function Str_buffer_mesh_names_get_by_idx(nameidx) {
   return _str_buffer_mesh_names.buffer[nameidx];
}


function Mesh_name_exists(meshidx) {

   for (let i = 0; i <= _str_buffer_mesh_names_index_buffer.boundary; i++) {
      const mesh_idx = _str_buffer_mesh_names_index_buffer.buffer[i];
      if (meshidx === mesh_idx) {
         return i;
      }
   }
   return INT_NULL;
}




export function Str_buffer_mesh_names_store(str, mesh_bufferidx, is_debug_mesh) {

   const existsidx = Mesh_name_exists(mesh_bufferidx);

   // If string name already exists, replace it with the new. 
   if (existsidx !== INT_NULL) {

      // console.log('NAME ALREADY REGISTERED TO _str_buffer_mesh_names.\nindex', existsidx)
      // remove the previous string 
      Str_buffer_mesh_names_remove_by_idx(existsidx);


      // add the new one
      const idx = _str_buffer_mesh_names.Add(str);
      _str_buffer_mesh_names_index_buffer.AddAtIndex(idx, mesh_bufferidx);


      if(NOTIFICATIONS_ON && is_debug_mesh===0) 
         Notifications_send(NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, mesh_bufferidx);

      return idx;
   }
   else { // Else add the new mesh string name

      const idx = _str_buffer_mesh_names.Add(str);

      // Create element in '_str_buffer_mesh_names_index_buffer' at same index.
      _str_buffer_mesh_names_index_buffer.AddAtIndex(idx, mesh_bufferidx)
      return idx;
   }

}




export function Str_buffer_mesh_names_remove_by_idx(nameidx) {


   { // Debug-Print

      // const mesh = Mesh_buffer_get_mesh_byidx(replacer_meshidx);
      // console.log('mesh nameidx:', nameidx, 'meshidx:', _str_buffer_mesh_names_index_buffer.buffer[nameidx], 'name', _str_buffer_mesh_names.buffer[nameidx])
   }

   if(NOTIFICATIONS_ON) 
      Notifications_send(NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.DESTROY, _str_buffer_mesh_names_index_buffer.buffer[nameidx]);

   _str_buffer_mesh_names.RemoveByIdxSortedVersion(nameidx);

   _str_buffer_mesh_names_index_buffer.RemoveByIdxSortedVersion(nameidx);
   
   // Get the mesh index. 
   const replacer_meshidx = _str_buffer_mesh_names_index_buffer.buffer[nameidx];

   

   // Because we moved an element, and the removed is replaced by the last, we need to set the new index for the mesh that pointed at the last(moved) element.
   // Else if destroyed already last element, do nothing
   if (replacer_meshidx !== INT_NULL) {

      const replacer_mesh = Mesh_buffer_get_mesh_byidx(replacer_meshidx);

      if(!(replacer_mesh === RESERVED_MESH)){

         // Update mesh's new nameidx. 
         replacer_mesh.nameidx = nameidx;
      }
   }
}














/****************************************************************************************************************************************************/
// DEBUG-PRINT
/****************************************************************************************************************************************************/

export function Str_buffer_print() {
   console.log(_str_buffer);
}

export function Str_buffer_print_loop() {
   for (let i = 0; i <= _str_buffer.boundary; i++) {
      console.log('i:', i, _str_buffer.buffer[i]);
   }
}

export function Str_buffer_mesh_names_print() {
   console.log(_str_buffer_mesh_names);
}

export function Str_buffer_mesh_names_print_loop() {
   for (let i = 0; i <= _str_buffer_mesh_names.boundary; i++) {
      console.log('i:', i, 'meshidx', _str_buffer_mesh_names_index_buffer.buffer[i], _str_buffer_mesh_names.buffer[i]);
   }
}



