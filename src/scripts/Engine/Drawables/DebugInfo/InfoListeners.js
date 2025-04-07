/**
 * This is the dispatch notifications mechanism
 * for the 'Notifications' system.
 * For example, if a mesh is created, at the site of creation we 
 * dispatch a 'mesh creation' notification message.
 */

"use strict";

import { New_generic_buffer } from "../../Core/Buffers.js";
import { _, INT_NULL } from "../../Global/EngineConstants.js";




export class Info_Listeners {


   events;


   constructor() {

      this.events = New_generic_buffer(_, 'Info_Listeners');
   }


   AddEvent(EVENT_TYPE, Clbk = null, source_params = null, evt_params = null) {

      const event_params = {
         event_type: EVENT_TYPE,
         Clbk: Clbk,
         source_params: source_params,
         evt_params: evt_params,
         isActive: true,
      }

      return this.events.Add(event_params);
   }


   RemoveEvent(idx) {

      this.events.RemoveByIdx(idx);
   }


   GetEvent(TYPE_IDX) {

      for (let i = 0; i <= this.events.boundary; i++) {

         if (this.events.buffer[i].event_type === TYPE_IDX) {
            return this.events.buffer[i];
         }
      }
      return null;
   }


   DispatchEvents(EVENT_TYPE, trigger_params) {

      for (let i = 0; i <= this.events.boundary; i++) {

         const evt = this.events.buffer[i];

         if (evt && (evt.event_type & EVENT_TYPE)) {

            // Handle event via callback
            const dispatch_params = {
               source_params: evt.source_params,
               evt_params: evt.evt_params,
               trigger_params: trigger_params,
               dispatch_event_type: EVENT_TYPE,
               event_type: evt.event_type,
            }
            evt.Clbk(dispatch_params)
         }
      }
   }
}




const _info_listeners = new Info_Listeners();

export function Info_listener_create_event(TYPE_IDX, Clbk, source_params, evt_params) {

   return _info_listeners.AddEvent(TYPE_IDX, Clbk, source_params, evt_params);
}




export function Info_listener_dispatch_event(TYPE_IDX, trigger_params) {

   _info_listeners.DispatchEvents(TYPE_IDX, trigger_params);
}




export function Info_listener_remove_event(event_idx) {
   if (event_idx === INT_NULL) {
      console.error('Info_listener_remove_event is NULL. event_idx:', event_idx);
      return;
   }
   _info_listeners.RemoveEvent(event_idx);
}




export function Info_listener_get_event(TYPE_IDX) {

   return _info_listeners.GetEvent(TYPE_IDX);
}




/**Debug-Print */
export function Info_listener_print_buffer() {

   console.log(_info_listeners);
}
