"use strict";

import { M_Buffer, New_generic_buffer } from "../../Core/Buffers";


_CNT = 0x1;
let xxx = 0x1;
export const NOTIFICATION_TYPE = {
   
   MESH_BUFFER: _CNT,
   STRING_BUFFER: _CNT<<=0x1,
   
   MESH_BUFFER_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },
   STRING_BUFFER_IDXS: {
      NOTIF:INT_NULL,
      ENTRIES:INT_NULL,
   },
   
   
   // MESH_BUFFER_IDX: INT_NULL,
   GFX_VERTEX_BUFFER_IDX: INT_NULL,
   GFX_PROGRAM_IDX: INT_NULL,
   // STRING_BUFFER_IDX: INT_NULL,

   SIZE: 0,

   FLAGS:{
      CREATE: xxx,
      DESTROY: xxx<<=0x1,
      CHANGE: xxx<<=0x1,
      IS_INSERTED:xxx<<=0x1, // This is set by the function that inserts a new entry to the entries flag table, to denote if the current entry has been drawn.
   },

   ToSting(idx) {

      if (idx === this.GFX_PROGRAM_IDX) return 'GFX_PROGRAM';
      if (idx === this.GFX_VERTEX_BUFFER_IDX) return 'GFX_VERTEX_BUFFER';
      if (idx === this.MESH_BUFFER_IDX) return 'MESH_BUFFER';
   }
}




export class Notification {


   constructor() {

      this.is_active = false;
      this.Clbk = null;
      this.params = {};
   }

}




const _notifications_buffer = New_generic_buffer(_, '_notifications_buffer');



export function Notifications_get_ui_widget(TYPE_IDX){
   return _notifications_buffer.buffer[TYPE_IDX].params.root;
}


export function Notifications_assign(TYPE, Clbk_store, Clbk_update, params) {

   // const notification = _notifications_buffer.buffer[TYPE_IDX];
   // _notifications_buffer.AddAtIndex(TYPE_IDX, {
   const type_idx = _notifications_buffer.Add({
      is_active: true,
      Clbk_store: Clbk_store,
      Clbk_update: Clbk_update,
      params: params,
   });

   if(TYPE & NOTIFICATION_TYPE.MESH_BUFFER){
      NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF = type_idx
   }
   if(TYPE & NOTIFICATION_TYPE.STRING_BUFFER){
      NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF = type_idx
   }

}



export function Notifications_send(TYPE_IDX, FLAGS, meshidx) {

   if(_notifications_buffer.buffer[TYPE_IDX] === null) return;
   if(_notifications_buffer.buffer[TYPE_IDX] === _) return;
   if(_notifications_buffer.buffer[TYPE_IDX].params === null) return;

   const notification = _notifications_buffer.buffer[TYPE_IDX];

   notification.is_active = true;
   notification.params.flags = FLAGS;
   
   if(TYPE_IDX === NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF) notification.Clbk_store(NOTIFICATION_TYPE.MESH_BUFFER_IDXS, meshidx, FLAGS);
   else if(TYPE_IDX === NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF) notification.Clbk_store(NOTIFICATION_TYPE.STRING_BUFFER_IDXS, meshidx, FLAGS);
   

}





export function Notifications_update() {

   
   const len = _notifications_buffer.boundary;
   for (let i = 0; i <= len; i++) {

      const notification = _notifications_buffer.buffer[i];
      // if (notification.is_active) {
      if (notification && notification.is_active) {

         notification.Clbk_update(notification.params);
         notification.is_active = false;
      }
   }
}




export function Notifications_destroy(TYPE_IDX) {

   _notifications_buffer.RemoveByIdx(TYPE_IDX);
   if(TYPE_IDX === NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF) NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF = INT_NULL;
   else if(TYPE_IDX === NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF) NOTIFICATION_TYPE.STRING_BUFFER_IDXS.NOTIF = INT_NULL;
}




export function Notifications_get_by_idx(idx) {

   return _notifications_buffer.buffer[idx];
}




/**Debug-Print */
export function Notifications_print() {

   console.log(_notifications_buffer);
}
