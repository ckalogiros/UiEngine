"use strict";

import { M_Buffer, New_generic_buffer } from "../../Core/Buffers";


_CNT = 0;
let xxx = 0x1;
export const NOTIFICATION_TYPE_IDX = {
   MESH_BUFFER: _CNT++,
   GFX_VERTEX_BUFFER: _CNT++,
   GFX_PROGRAM: _CNT++,
   STRING_BUFFER: _CNT++,

   SIZE: _CNT,

   FLAGS:{
      CREATE: xxx,
      DESTROY: xxx<<=0x1,
      CHANGE: xxx<<=0x1,
   },

   ToSting(idx) {

      if (idx === this.GFX_PROGRAM) return 'GFX_PROGRAM';
      if (idx === this.GFX_VERTEX_BUFFER) return 'GFX_VERTEX_BUFFER';
      if (idx === this.MESH_BUFFER) return 'MESH_BUFFER';
   }
}




export class Notification {


   constructor() {

      this.is_active = false;
      this.Clbk = null;
      this.params = {};
   }

}




const _notifications_buffer = New_generic_buffer();




export function Notifications_create(Clbk_store, Clbk_update, params) {

   _notifications_buffer.Add({
      is_active: true,
      Clbk_store: Clbk_store,
      Clbk_update: Clbk_update,
      params: params,
   });

}




export function Notifications_send(TYPE_IDX, FLAGS, params) {

   if(_notifications_buffer.buffer[TYPE_IDX] === null) return;

   const notification = _notifications_buffer.buffer[TYPE_IDX];

   notification.is_active = true;
   notification.params.flags = FLAGS;
   notification.Clbk_store(params, FLAGS);

}





export function Notifications_update() {

   
   const len = _notifications_buffer.boundary;
   for (let i = 0; i <= len; i++) {

      const notification = _notifications_buffer.buffer[i];
      if (notification.is_active) {

         notification.Clbk_update(notification.params);
         notification.is_active = false;
      }
   }
}




export function Notifications_destroy(idx) {

   _notifications_buffer.RemoveByIdx(idx);
}




export function Notifications_get_by_idx(idx) {

   return _notifications_buffer.buffer[idx];
}




/**Debug-Print */
export function Notifications_print() {

   console.log(_notifications_buffer);
}
