/**
 * Notification System
 * 
 * This is an internal notification system for the purpose of
 * keeping track of some of the applications systems info.
 * For example: if a new mesh is created, a notification is registered
 * of that type (NOTIFICATION_TYPE.MESH_BUFFER).
 * This functionality is mainly used for displaying debug info via rendering.
 * For example if we want to display the number of total meshes of the app. 
 */

"use strict";

import { New_generic_buffer } from "../../Core/Buffers.js";
import { Dbg_ui_init_buffer_entries, Dbg_ui_reset_buffer_entries, Dbg_ui_store_changes } from "./DebugInfoUi.js";


_CNT = 0x1;
let xxx = 0x1;
/** */
export const NOTIFICATION_TYPE = {
   
   MESH_BUFFER: _CNT,
   STRING_BUFFER: _CNT<<=0x1,
   MESH_PER_VB_BUFFER: _CNT<<=0x1,
   VERTEX_BUFFER: _CNT<<=0x1,
   RENDER_QUEUE_BUFFER: _CNT<<=0x1,
   
   MESH_TREE_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },
   MESH_BUFFER_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },
   STRING_BUFFER_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },
   MESH_PER_VB_BUFFER_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },
   VERTEX_BUFFER_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },
   RENDER_QUEUE_BUFFER_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },


   SIZE: 3,

   FLAGS:{
      CREATE: xxx,
      DESTROY: xxx<<=0x1,
      CHANGE: xxx<<=0x1,
      IS_INSERTED:xxx<<=0x1, // This is set by the function that inserts a new entry to the entries flag table, to denote if the current entry has been drawn.
   },

   Reset(){
      this.MESH_TREE_IDXS.NOTIF =INT_NULL
      this.MESH_TREE_IDXS.ENTRIES =INT_NULL
      this.MESH_BUFFER_IDXS.NOTIF =INT_NULL
      this.MESH_BUFFER_IDXS.ENTRIES =INT_NULL
      this.STRING_BUFFER_IDXS.NOTIF =INT_NULL
      this.STRING_BUFFER_IDXS.ENTRIES =INT_NULL
      this.MESH_PER_VB_BUFFER_IDXS.NOTIF =INT_NULL
      this.MESH_PER_VB_BUFFER_IDXS.ENTRIES =INT_NULL
      this.VERTEX_BUFFER_IDXS.NOTIF =INT_NULL
      this.VERTEX_BUFFER_IDXS.ENTRIES =INT_NULL
      this.RENDER_QUEUE_BUFFER_IDXS.NOTIF =INT_NULL
      this.RENDER_QUEUE_BUFFER_IDXS.ENTRIES =INT_NULL
   }

}
/** */
function Notification_type_to_sting(idx) {

   if (idx === this.MESH_BUFFER) return 'MESH_BUFFER';
   if (idx === this.STRING_BUFFER) return 'STRING_BUFFER';
   if (idx === this.MESH_PER_VB_BUFFER) return 'MESH_PER_VB_BUFFER';
   if (idx === this.VERTEX_BUFFER) return 'VERTEX_BUFFER';
   if (idx === this.RENDER_QUEUE_BUFFER) return 'RENDER_QUEUE_BUFFER';
}
/** */
function Notification_process_to_sting(idx) {

   let res = '';
   if (idx === this.FLAGS.CREATE) res += 'MESH_BUFFER';
   if (idx === this.FLAGS.DESTROY) res += 'DESTROY';
   if (idx === this.FLAGS.CHANGE) res += 'CHANGE';
   if (idx === this.FLAGS.IS_INSERTED) res += 'IS_INSERTED';

   return res;
}



const _notifications_buffer = New_generic_buffer(_, '_notifications_buffer');
/** */
export function Notifications_reset() { _notifications_buffer.ResetFull(); Dbg_ui_reset_buffer_entries() }
/** */
export function Notifications_get_ui_widget(TYPE_IDX){
   return _notifications_buffer.buffer[TYPE_IDX].params.root;
}
/** */
export function Notifications_set_ui_widget(TYPE_IDX, ui_widget_root){
   _notifications_buffer.buffer[TYPE_IDX].params.root = ui_widget_root;
}
/** */
export function Notifications_get_by_idx(idx) {
   return _notifications_buffer.buffer[idx];
}
/** */
function Create(){

   const ret = Dbg_ui_init_buffer_entries();

   const type_idx = _notifications_buffer.Add({
      is_active: false,
      needs_update: true,
      Clbk_update: ret.update,
      params: {
         type_idxs: null,
         flags: 0x0,
         root: null,
      },
   });

   return { type_idx:type_idx, entries_bufferidx:ret.entries_bufferidx };
}
/** */
export function Notifications_initialize() {

   {
      const ret = Create();
      NOTIFICATION_TYPE.MESH_TREE_IDXS.ENTRIES = ret.entries_bufferidx;
      NOTIFICATION_TYPE.MESH_TREE_IDXS.NOTIF = ret.type_idx;
      _notifications_buffer.buffer[ret.type_idx].params.type_idxs = NOTIFICATION_TYPE.MESH_TREE_IDXS; // A reference
   }
   {
      const ret = Create();
      NOTIFICATION_TYPE.MESH_BUFFER_IDXS.ENTRIES = ret.entries_bufferidx;
      NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF = ret.type_idx;
      _notifications_buffer.buffer[ret.type_idx].params.type_idxs = NOTIFICATION_TYPE.MESH_BUFFER_IDXS; // A reference
   }
   {
      const ret = Create();
      NOTIFICATION_TYPE.STRING_BUFFER_IDXS.ENTRIES = ret.entries_bufferidx;
      NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF = ret.type_idx;
      _notifications_buffer.buffer[ret.type_idx].params.type_idxs = NOTIFICATION_TYPE.STRING_BUFFER_IDXS; // A reference
   }
   {
      const ret = Create();
      NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.ENTRIES = ret.entries_bufferidx;
      NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF = ret.type_idx;
      _notifications_buffer.buffer[ret.type_idx].params.type_idxs = NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS; // A reference
   }
   {
      const ret = Create();
      NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.ENTRIES = ret.entries_bufferidx;
      NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF = ret.type_idx;
      _notifications_buffer.buffer[ret.type_idx].params.type_idxs = NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS; // A reference
   }
   {
      const ret = Create();
      NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.ENTRIES = ret.entries_bufferidx;
      NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF = ret.type_idx;
      _notifications_buffer.buffer[ret.type_idx].params.type_idxs = NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS; // A reference
   }

}
/** */
export function Notifications_send(TYPE_IDX, FLAGS, bufferidx) {

   const notification = _notifications_buffer.buffer[TYPE_IDX];
   
   Dbg_ui_store_changes(notification.params.type_idxs, bufferidx, FLAGS);

   notification.needs_update = true;
   notification.params.flags = FLAGS;

   if(_notifications_buffer.buffer[TYPE_IDX].params.root) 
      notification.is_active = true;

}
/** */
export function Notifications_update() {

   
   const len = _notifications_buffer.boundary;
   for (let i = 0; i <= len; i++) {

      const notification = _notifications_buffer.buffer[i];
      if (notification && notification.is_active && notification.needs_update) {

         notification.Clbk_update(notification.params);
         notification.needs_update = false;
      }
   }
}
/** */
export function Notifications_destroy(TYPE_IDX) {

   _notifications_buffer.RemoveByIdx(TYPE_IDX);
   if(TYPE_IDX === NOTIFICATION_TYPE.MESH_TREE_IDXS.NOTIF) NOTIFICATION_TYPE.MESH_TREE_IDXS.NOTIF = INT_NULL;
   else if(TYPE_IDX === NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF) NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF = INT_NULL;
   else if(TYPE_IDX === NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF) NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF = INT_NULL;
   else if(TYPE_IDX === NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF) NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF = INT_NULL;
   else if(TYPE_IDX === NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF) NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF = INT_NULL;
   else if(TYPE_IDX === NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF) NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF = INT_NULL;
}
/** */
export function Notifications_deactivate(TYPE_IDX) {

   _notifications_buffer.buffer[TYPE_IDX].is_active = false;
   _notifications_buffer.buffer[TYPE_IDX].params.root = null; // Detach the refference to the ui widget
}
/**Debug-Print */
export function Notifications_print() {

   console.log(_notifications_buffer);
}
export function Notifications_print_loop() {

   for(let i=0; i <= _notifications_buffer.boundary; i++){

      console.log( i,
         'is active', _notifications_buffer.buffer[i].is_active,
         'needs_update', _notifications_buffer.buffer[i].needs_update,
         'flags', _notifications_buffer.buffer[i].params.flags,
         'root', _notifications_buffer.buffer[i].params.root,
         'Callback', _notifications_buffer.buffer[i].Clbk_update.name,
      );
   }
}
