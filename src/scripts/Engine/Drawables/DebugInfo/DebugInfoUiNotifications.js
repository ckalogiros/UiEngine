"use strict";

import { M_Buffer } from "../../Core/Buffers";


_CNT = 0;
export const NOTIFICATION_TYPE_IDX = {
   GFX_PROGRAM: _CNT++,
   GFX_VERTEX_BUFFER: _CNT++,
   MESH_BUFFER: _CNT++,

   SIZE: _CNT,

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




const _debug_ui_buffer = new M_Buffer();
// _debug_ui_buffer.Init(NOTIFICATION_TYPE_IDX.SIZE, new Notification());



export function Debug_ui_create_notification(Clbk, params) {

   _debug_ui_buffer.Add({
      is_active: true,
      Clbk: Clbk,
      params: params,
   });
   // const notification = _debug_ui_buffer.buffer[idx];
   // notification.Clbk = Clbk;
   // notification.params = params;
}




export function Debug_ui_set_notification(idx) {

   const notification = _debug_ui_buffer.buffer[idx];
   notification.is_active = true;

   // _debug_ui_buffer.Add({
   //    is_active: true,
   //    Clbk: Clbk,
   //    params: params,
   // });
}




export function Debug_ui_update_notifications() {

   
   const len = _debug_ui_buffer.boundary;
   for (let i = 0; i <= len; i++) {

      const notification = _debug_ui_buffer.buffer[i];
      if (notification.is_active) {

         notification.Clbk(notification.params);
         notification.is_active = false;
         // Debug_ui_destroy_notification(i);
      }
   }
}




export function Debug_ui_destroy_notification(idx) {

   _debug_ui_buffer.RemoveByIdx(idx);
}




export function Debug_ui_get_notification(idx) {

   return _debug_ui_buffer.buffer[idx];
}




/**Debug-Print */
export function Debug_ui_print_buffer() {

   console.log(_debug_ui_buffer);
}
