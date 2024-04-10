"use strict";

import { Intersection_point_rect } from "../Drawables/Operations/Collisions.js";
import { MouseGetPos } from "../Controls/Input/Mouse.js";
import { M_Buffer, New_generic_buffer } from "../Core/Buffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";
import { Events_handle_immidiate } from "./Events.js";
import { Info_listener_create_event, Info_listener_dispatch_event } from "../Drawables/DebugInfo/InfoListeners.js";
import { GREY } from "../Drawables/Material/Base/Colors.js";
import { Mesh_buffer_get_mesh_byidx } from "../Core/MeshBuffer.js";




/** // TODO!!: For efficiency
 * 
 * 
 * All buffer's listeners and children run for count,
 * eventhough the buffers may have a lot of null elements due to the implementation of the EventListener.
 * FIX THAT!
 * 
 * Also ipmlement the: 
 *    If we check for click event, and the cur mesh has a hover, it's much more efficient
 *    to directly check for click the 'STATE.mesh.hovered' and skip all 
 *    the one by one top root meshes checking for click, since the only clicked mesh is
 *    the one that is allready hovered.
 * CODE:
      if (STATE.mesh.hovered &&
         STATE.mesh.hovered.listeners.buffer[H] !== INT_NULL &&
         STATE.mesh.hovered.listeners.buffer[C] !== INT_NULL) {

         const idx = STATE.mesh.hovered.listeners.buffer[C];

         const dispatch_params = {
            meshidx: this.event_type[C].buffer[idx].meshidx,
            evt_params: this.event_type[C].buffer[idx].evt_params,
            trigger_params: trigger_params,
            event_type: TYPE_IDX,
         }
         ret = this.event_type[TYPE_IDX].buffer[idx].Clbk(dispatch_params);

      // First check the children's event buffer
      if(this.event_type[C].buffer[idx].children !== null){ // Check children for events

         for(let j=0; j<this.event_type[C].buffer[idx].children.boundary; j++){

            const child_event = this.event_type[C].buffer[idx].children.buffer[j];

            const dispatch_params = {
               meshidx: child_event.meshidx,
               evt_params: child_event.evt_params,
               trigger_params: trigger_params,
               event_type: TYPE_IDX,
            }
            
            ret = child_event.Clbk(dispatch_params);
            
            if(ret) return; // If at least one event is handled, do not continue.
         }
         
      }
 */







// TODO: Maybe the meshidx and target params are just mesh_bufferidxs
export class Event_Listener {

   event_type;

   constructor() {

      this.event_type = new Array(LISTEN_EVENT_TYPES_INDEX.SIZE);
   }


   AddEvent(TYPE_IDX, meshidx = null, Clbk = null, evt_params = null) {

      if (this.event_type[TYPE_IDX] === undefined) {
         this.event_type[TYPE_IDX] = New_generic_buffer();
      }


      const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
      const event_params = {
         /**DEBUG */name: (mesh) ? mesh.GetName() : 'NO SOURCE PARAMS',
         type: TYPE_IDX,
         Clbk: Clbk,
         evt_idx: INT_NULL,
         parent_evt: INT_NULL,
         meshidx: meshidx,
         evt_params: evt_params,
         isActive: false, // UNUSED: TODO: Make use of the is Active or remove it.
         children: null, // current mesh may have children with events. This is the buffer to store them, but only after 'ReconstructEvents' function call.
         has_child_events: false, // This is to check if the current event has any children events(eficient since we do not have to check every child event if 'isActive')
      }

      LISTENERS_FLAGS[TYPE_IDX] = true;
      event_params.evt_idx = this.event_type[TYPE_IDX].Add(event_params);

      if (mesh.debug_info.type === 0)
         Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.LISTENERS, event_params);

      return this.event_type[TYPE_IDX].buffer[event_params.evt_idx];
   }


   AddChildEvent(TYPE_IDX, meshidx = null, Clbk = null, evt_params = null, parent_event = null) {

      if (this.event_type[TYPE_IDX] === undefined) {

         console.log('Creating new event type events buffer')
         this.event_type[TYPE_IDX] = New_generic_buffer();
      }

      const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
      const event_params = {
         /**DEBUG */name: (mesh) ? mesh.GetName() : 'NO SOURCE PARAMS',
         type: TYPE_IDX,
         Clbk: Clbk,
         evt_idx: INT_NULL,
         parent_evt: parent_event,
         meshidx: meshidx,
         evt_params: evt_params,
         isActive: true,
         children: null, // current mesh may have children with events. This is the buffer to store them, but only after 'ReconstructEvents' function call.
         has_child_events: false, // This is to check if the current event has any children events(eficient since we do not have to check every child event if 'isActive')
      }

      LISTENERS_FLAGS[TYPE_IDX] = true;
      const event = parent_event;


      if (!event.children) {
         event.children = New_generic_buffer();
      }

      event_params.evt_idx = event.children.Add(event_params);
      event.has_child_events = true;

      if (mesh.debug_info.type === 0)
         Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.LISTENERS, event_params);

      return event.children.buffer[event_params.evt_idx];
   }


   CopyChildren(TYPE_IDX, event_idx) {

      const children_events = this.event_type[TYPE_IDX].buffer[event_idx].children;
      const temp = New_generic_buffer();

      for (let i = 0; i <= children_events.boundary; i++) {

         const evt = children_events.buffer[i];

         const event_params = {
            type: evt.type,
            Clbk: evt.Clbk,
            meshidx: evt.meshidx,
            evt_params: evt.evt_params,
            isActive: evt.isActive,
            children: null, // TODO: MUST COPY ALL CHILDRENS BUFFER RECURSIVELY???
            has_child_events: evt.has_child_events,
         }

         temp.Add(event_params);
      }
      return temp;
   }


   /** Debug */
   PrintAll() {
      console.log('Listener: ', _listener.event_type)
   }

}



export function Listeners_copy_event_children_buffer(TYPE_IDX, event_idx) { return _listener.CopyChildren(TYPE_IDX, event_idx); }





const _listener = new Event_Listener();



export function Listeners_get_event(TYPE_IDX, event_idx) { return _listener.event_type[TYPE_IDX].buffer[event_idx]; }





/**********************************************************************************************************************************************************/
// HOVER CHECK

export function Listener_dispatch_check_hover_event() {


   // _pt_hover_listener.timer.Start();
   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.HoverListener);


   if (_listener.event_type[E.H] === undefined) return;
   /*DEBUG*/if (E.H < 0 || E.H >= LISTEN_EVENT_TYPES_INDEX.SIZE) console.error('Event type index does not exist.');

   let intersected = false;

   // console.log('----- CHECK HOVER EVENTS -----')
   for (let i = 0; i <= _listener.event_type[E.H].boundary; i++) {
      
      const event = _listener.event_type[E.H].buffer[i];
      
      if (_listener.event_type[E.H].buffer[i]) { // Some buffer elements maybe null(removed)

         const point = MouseGetPos();
         const mesh = Mesh_buffer_get_mesh_byidx(event.meshidx);
         const d = mesh.geom;

         const rect = [
            [d.pos[0] - d.dim[0], d.pos[0] + d.dim[0]],     // Left  Right 
            [(d.pos[1] - d.dim[1]), (d.pos[1] + d.dim[1])], // Top  Bottom
         ];


         if (Intersection_point_rect(point, rect)) {

            if (event.has_child_events && event.children) {

               if (Check_hover_recursive(event, point)) {
                  intersected = true;
                  // mesh.SetUpdateFrameBuffer();
                  return;
               }
            }

            Events_handle_immidiate({ type: 'hover', params: { mesh: mesh } });
            // mesh.SetUpdateFrameBuffer();
            intersected = true;

         }
      }
   }

   
   // NOTE: The only way to avoid meshes remain hovered, after mouse hover skiping over the root mesh's listener.
   if(!intersected && STATE.mesh.hovered){ // If mouse is not intersecting with any mesh and there still is a hovered mesh, unhover it.
      Events_handle_immidiate({ type: 'unhover', params: { mesh: STATE.mesh.hovered } });
   }
   // _pt_hover_listener.timer.Stop();
   // Performance_timer_detailed_stop(PERFORMANCE_TIMERS_IDXS.HoverListener);
   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.HoverListener);
}
   


function Check_hover_recursive(events, point) {

   for (let i = 0; i <= events.children.boundary; i++) {

      if (events.children.buffer[i]) {

         const evt = events.children.buffer[i];
         const mesh = Mesh_buffer_get_mesh_byidx(evt.meshidx);
         const d = mesh.geom;
         const rect = [
            [d.pos[0] - d.dim[0], d.pos[0] + d.dim[0]],     // Left  Right 
            [(d.pos[1] - d.dim[1]), (d.pos[1] + d.dim[1])], // Top  Bottom
         ];

         // if (evt.isActive && Intersection_point_rect(point, rect)) {
         if (Intersection_point_rect(point, rect)) {


            if (evt.has_child_events) {
               const ret = Check_hover_recursive(evt, point);
               if (ret) return true; // If the most inner hovered found, return recursively so that we do not check annd set a hover of the parent meshes(that are obviusly hovered in the first place).
            }

            Events_handle_immidiate({ type: 'hover', params: { mesh: mesh } });
            return true;
         }
      }
   }

   return false;
}





/**********************************************************************************************************************************************************/
// CLICK CHECK(Only click for now)

export function Listener_dispatch_event(TYPE_IDX, trigger_params) {


   // _pt_event_listener.timer.Start(); /* Performance measure */
   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.EventListener);
   console.log('+START')
   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);

   if (_listener.event_type[TYPE_IDX] === undefined) return;
   /**DEBUG*/if (TYPE_IDX < 0 || TYPE_IDX >= LISTEN_EVENT_TYPES_INDEX.SIZE) alert('Event type index does not exist.');


   let intersected = false;

   for (let i = 0; i <= _listener.event_type[TYPE_IDX].boundary; i++) {

      const evt = _listener.event_type[TYPE_IDX].buffer[i];

      if (evt) {

         const mesh = Mesh_buffer_get_mesh_byidx(evt.meshidx);
         const point = MouseGetPos();
         const verticalMargin = mesh.hover_margin;

         const rect = [ // The rect area to check for event(mouse hover)
            [mesh.geom.pos[0] - mesh.geom.dim[0] - verticalMargin[0], mesh.geom.pos[0] + mesh.geom.dim[0] + verticalMargin[0]], // Left  Right 
            [(mesh.geom.pos[1] - mesh.geom.dim[1]) - verticalMargin[1], (mesh.geom.pos[1] + mesh.geom.dim[1]) + verticalMargin[1]], // Top  Bottom
         ];

         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         intersected = Intersection_point_rect(point, rect);

         if (intersected) {

            if (evt.has_child_events) { // Check all of its children(recursively)
               const event_found = Check_child_events_recursive(evt, point);
               if (event_found) {

                  const dispatch_params = {
                     meshidx: event_found.meshidx,
                     evt_params: event_found.evt_params,
                     trigger_params: trigger_params,
                     event_type: TYPE_IDX,
                  }

                  if (event_found.Clbk) {

                     event_found.Clbk(dispatch_params);
                     // Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
                     // console.log('STOP111111')

                     const mesh = Mesh_buffer_get_mesh_byidx(dispatch_params.meshidx);
                     STATE.mesh.SetFocused(mesh);
                     return; // Return if at least one event is handled. Also return so that any event of the main event will not run.
                  }
               }
            }

            if (evt.Clbk) {
               // Else if no children event was triggered, run any events of the main event.
               const dispatch_params = {
                  meshidx: evt.meshidx,
                  evt_params: evt.evt_params,
                  trigger_params: trigger_params,
                  event_type: TYPE_IDX,
               }

               evt.Clbk(dispatch_params);
               // Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
               // console.log('STOP22222222222')

               const mesh = Mesh_buffer_get_mesh_byidx(dispatch_params.meshidx);
               STATE.mesh.SetFocused(mesh);

               return;
            }
         }
         mesh.SetUpdateFrameBuffer();
      }
   }

   // Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
   // console.log('STOP333')

}



function Check_child_events_recursive(evt, point) {

   let ret = null;

   for (let i = 0; i <= evt.children.boundary; i++) {

      const child_evt = evt.children.buffer[i];
      if (child_evt) {

         const mesh = Mesh_buffer_get_mesh_byidx(child_evt.meshidx);
         const verticalMargin = mesh.hover_margin;

         const rect = [ // The rect area to check for event(mouse hover)
            [mesh.geom.pos[0] - mesh.geom.dim[0] - verticalMargin[0], mesh.geom.pos[0] + mesh.geom.dim[0] + verticalMargin[0]], // Left  Right 
            [(mesh.geom.pos[1] - mesh.geom.dim[1]) - verticalMargin[1], (mesh.geom.pos[1] + mesh.geom.dim[1]) + verticalMargin[1]], // Top  Bottom
         ];

         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         const intersects = Intersection_point_rect(point, rect);

         if (intersects && child_evt.has_child_events) { // Check all of its children(recursively)
            const ret = Check_child_events_recursive(child_evt, point)
            if (ret) return ret; // Because it a recursive procedure, when the mesh is found we must return it recursively immidiately after the return of the each recursion.
         }
         else{

            if (intersects && (mesh.StateCheck(MESH_STATE.IS_FAKE_EVENT) === 0)) { // 
               // console.log(mesh.GetName())
               return child_evt;
            }
            if (intersects) 
               return child_evt;
         }
      }
   }

   return null;
}







/**********************************************************************************************************************************************************/
// Create Listener

export function Listener_create_event(TYPE_IDX, meshidx, Clbk, evt_params) {

   return _listener.AddEvent(TYPE_IDX, meshidx, Clbk, evt_params);
}



export function Listener_create_child_event(TYPE_IDX, meshidx, Clbk, evt_params, parent_event) {

   return _listener.AddChildEvent(TYPE_IDX, meshidx, Clbk, evt_params, parent_event);
}







/**********************************************************************************************************************************************************/
// Destroy Listener

// CAUTION!: If the event is a child event, then its index is an invalid index, because its the index to the parents children buffer and not to the '_listener.event_type[TYPE_IDX].buffer[evt_idx]'
export function Listener_remove_event_by_idx(TYPE_IDX, evt) {

   _listener.event_type[TYPE_IDX].RemoveByIdx(evt.evt_idx);

   if (_listener.event_type[TYPE_IDX].active_count === 0)
      LISTENERS_FLAGS[TYPE_IDX] = false;

}



export function Listener_remove_child_event_from_parent(TYPE_IDX, evt) {

   // Remove child events requires the parent to remove the child event from 
   evt.parent_evt.children.RemoveByIdx(evt.evt_idx);

   if (_listener.event_type[TYPE_IDX].active_count === 0)
      LISTENERS_FLAGS[TYPE_IDX] = false;
}



export function Listener_destroy_children_buffer(TYPE_IDX, event_idx) {
   _listener.event_type[TYPE_IDX].buffer[event_idx].children = null;
}



export function Listener_recover_children_buffer(TYPE_IDX, event_idx, children_buffer) {
   _listener.event_type[TYPE_IDX].buffer[event_idx].children = children_buffer;
   _listener.event_type[TYPE_IDX].buffer[event_idx].has_child_events = true;
}



export function Listener_events_set_mesh_events_active(FLAGS, mesh_listeners, bool_activate) {

   if ((FLAGS & LISTENERS_FLAGS.HOVER) || (FLAGS & LISTENERS_FLAGS.ALL)) {

      if (mesh_listeners.buffer[E.H]) {
         _listener.event_type[E.H].buffer[mesh_listeners.buffer[E.H].idx].isActive = bool_activate;
      }
   }

   if ((FLAGS & LISTENERS_FLAGS.CLICK) || (FLAGS & LISTENERS_FLAGS.ALL)) {

      if (mesh_listeners.buffer[E.C]) {
         /**DEBUG ERROR*/ if (_listener.event_type[E.C].buffer[mesh_listeners.buffer[E.C].idx] === undefined)
            console.error('Undefined listen event:', mesh_listeners.buffer[E.C].idx, ' type:', E.C)

         _listener.event_type[E.C].buffer[mesh_listeners.buffer[E.C].idx].isActive = bool_activate;
      }
   }
}



export function Listener_set_event_active_by_idx(TYPE_IDX, root, childs_evt_idx) {
   // SEE ### docs/ScemeDraws/HoveListenEvents.drawio

   const parent_event_idx = root.listeners.buffer[TYPE_IDX].idx; // Get the parents event from the EventListener's buffer
   if (parent_event_idx === INT_NULL) alert('Root does not have a FAKE event')

   // Get the root's event.
   const evt = _listener.event_type[TYPE_IDX].buffer[parent_event_idx];

   if (evt === null) {

      console.error('evt is null');
      return;
   }

   if (evt.children === null) {

      evt.children = New_generic_buffer(); // Create new buffer as a children's events buffer
      evt.has_child_events = true;
   }

   // Copy the child's event params 
   const event_params = _listener.event_type[TYPE_IDX].buffer[childs_evt_idx];

   _listener.event_type[TYPE_IDX].RemoveByIdx(childs_evt_idx); // Remove the child's event from the root eventListeners buffer
   // Store them to the parents children event buffer
   const idx = evt.children.Add(event_params);

   return idx;
}







/**************************************************************************************************************************/
// Debug Info Drop Down

export function Listeners_debug_info_create(scene) {

   const dp_btn_pad = [10, 2];

   // Create the dropdown that will hold all listen events to display for debuging purposes.
   const dropdown = new Widget_Dropdown('Info Ui Listeners Root-DP', [VIEWPORT.RIGHT - 140, 20, 0], GREY1, TRANSPARENCY(GREY[5], .8), WHITE, dp_btn_pad);
   dropdown.CreateClickEvent();
   dropdown.CreateMoveEvent();
   Dropdown_roots_set_root(dropdown, dropdown);
   dropdown.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS; // NOTE: Must set the specific type for the dropdown to avoid infinite looping
   dropdown.menu.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS; // NOTE: Must set the specific type for the dp's menu to avoid infinite looping


   dropdown.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   dropdown.Calc();
   dropdown.Render();
   dropdown.ConstructListeners();

   Info_listener_create_event(INFO_LISTEN_EVENT_TYPE.LISTENERS, Listeners_debug_info_update, dropdown, null);
}































/**********************************************************************************************************************************************************/
// Debug Print

export function Debug_get_event_listeners() { return _listener; }



export function Listener_debug_print_all() {

   _listener.PrintAll();
}



export function Listener_debug_print_info() {

   const count = _listener.event_type.length;
   for (let i = 0; i < count; i++) {

      console.log('-Event type:', i);

      let events_count = 0;
      const e = _listener.event_type[i];
      if (e) {
         events_count += Listener_debug_print_info_recursive(e, events_count);
      }
      console.log(`+++ Total count:${events_count}`)
   }
}



function Listener_debug_print_info_recursive(children, count) {

   let total_count = 0;

   for (let i = 0; i <= children.boundary; i++) {

      const e = children.buffer[i];

      if (e) {

         let r = '  ';

         for (let j = 0; j < count; j++) { r += '->'; }

         const mesh = Mesh_buffer_get_mesh_byidx(e.meshidx);
         const is_child_event = (mesh.listeners.buffer[1]) ? mesh.listeners.buffer[1].is_child_event : false;
         const parentEvent = e.parent_event ? e.parent_event.GetName() : 'NULL'
         console.log(`${r} :(${mesh.GetName()})-(has children:${e.has_child_events})-(is child:${is_child_event})-(evtidx:${e.evt_idx})-(parent:${parentEvent})`);
         total_count++;

         if (e.children) {
            count++;
            total_count += Listener_debug_print_info_recursive(e.children, count);
            count--;
         }
      }
   }

   return total_count;
}



