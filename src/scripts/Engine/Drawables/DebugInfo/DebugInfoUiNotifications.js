"use strict";

import { M_Buffer } from "../../Core/Buffers";


_CNT = 0;
export const NOTIFICATION_TYPE_IDX = {
   GFX_PROGRAM: _CNT++,
   GFX_VERTEX_BUFFER: _CNT++,
   // GFX_VERTEX_BUFFER: _CNT <<= 0x1,

   SIZE: _CNT,

   ToSting(idx) {

      if (idx === this.GFX_PROGRAM) return 'GFX_PROGRAM';
      if (idx === this.GFX_VERTEX_BUFFER) return 'GFX_VERTEX_BUFFER';
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
_debug_ui_buffer.Init(NOTIFICATION_TYPE_IDX.SIZE, new Notification());
_debug_ui_buffer.boundary = NOTIFICATION_TYPE_IDX.SIZE; // HACK
// _debug_ui_buffer.Init(NOTIFICATION_TYPE_IDX.SIZE);



export function Debug_ui_create_notification(idx, Clbk, params) {

   // if(!_debug_ui_buffer.buffer || !_debug_ui_buffer.buffer[idx])
   //    _debug_ui_buffer.Add(new Notification())

   const notification = _debug_ui_buffer.buffer[idx];
   notification.Clbk = Clbk;
   notification.params = params;
}




export function Debug_ui_set_notification(idx) {

   const notification = _debug_ui_buffer.buffer[idx];
   notification.isActive = true;

   // console.warn('--- NOTIFICATION {', NOTIFICATION_TYPE_IDX.ToSting(idx), '} ---')
}




export function Debug_ui_update_notifications() {


   for (let i = 0; i <= _debug_ui_buffer.boundary; i++) {

      const notification = _debug_ui_buffer.buffer[i];
      if (notification.isActive) {

         notification.Clbk(i, notification.params);
         notification.isActive = false;
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
