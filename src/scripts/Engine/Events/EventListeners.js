"use strict";

import { Intersection_point_rect } from "../Drawables/Operations/Collisions.js";
import { MouseGetPos } from "../Controls/Input/Mouse.js";
import { New_generic_buffer } from "../Core/Buffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";
import { Events_handle_immidiate } from "./Events.js";
import { Info_listener_create_event } from "../Drawables/DebugInfo/InfoListeners.js";
import { GREY } from "../Drawables/Material/Base/Colors.js";
import { Mesh_buffer_get_mesh_bounding_box_with_hover_margin, Mesh_buffer_get_mesh_byidx, Mesh_buffer_get_mesh_name_byidx } from "../Core/MeshBuffer.js";
import { Renderqueue_set_priority_by_vb } from "../Renderers/Renderer/RenderQueue.js";




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

/**
 * We use two separate storage buffers for smaller memory footprint (faster) for listen events access
 */
const _listeners_buffer_storage = New_generic_buffer();
const _listeners_buffer_view_storage = New_generic_buffer();




export function Listener_get_parent_event(TYPE_IDX, idx) {
   const parent_event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[idx].parent_idx;
   return parent_event;
}




export function Listener_get_parent_event_meshidx(TYPE_IDX, idx) {
   const parent_idx = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[idx].parent_idx;
   const parent_meshidx = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[parent_idx].meshidx;
   return parent_meshidx;
}




export function Listener_init_event_storage_buffers() {

   for (let i = 0; i < LISTEN_EVENT_TYPES_INDEX.SIZE; i++) {
      _listeners_buffer_storage.Add(New_generic_buffer(_, '_listeners_buffer_storage'));
      _listeners_buffer_view_storage.Add(New_generic_buffer(_, '_listeners_buffer_view_storage'));
   }
}



export function Listener_create_child_event(TYPE_IDX, meshidx, Clbk, evt_params, parent_event_idx) {

   /**DEBUG */const mesh = Mesh_buffer_get_mesh_byidx(meshidx);

   const event_idx = _listeners_buffer_storage.buffer[TYPE_IDX].Add({
      /**DEBUG */name: (mesh) ? mesh.GetName() : 'NO SOURCE PARAMS',
      type: TYPE_IDX,
      parent_idx: parent_event_idx,
      Clbk: Clbk,
      meshidx: meshidx,
      evt_params: evt_params,
      view_idx: INT_NULL,
      view: null,
   });

   const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx];

   if (parent_event_idx !== null && parent_event_idx !== INT_NULL) {

      // Get the parent event.
      const parent_event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[parent_event_idx];

      if (parent_event.view && !parent_event.view.children) {
         parent_event.view.children = New_generic_buffer(_, 'parent_event.children');
      }

      // Store the new event as a child to the parent in the listeners VIEW storage buffer.
      const view_idx = parent_event.view.children.Add({
         idx: event_idx,
         meshidx: meshidx,
         children: null,
      });

      event.view = parent_event.view.children.buffer[view_idx];
      event.view_idx = view_idx;
   }
   else {

      // Create a tree buffer stucture view of the listeners storage buffer, for fast event listeners search
      const view_idx = _listeners_buffer_view_storage.buffer[TYPE_IDX].Add({
         idx: event_idx,
         meshidx: meshidx,
         children: null,
      });


      // Store a reference of view back to listeners storage buffer. Can't have an index cause the view is tree buffer structure.
      event.view = _listeners_buffer_view_storage.buffer[TYPE_IDX].buffer[view_idx];
      event.view_idx = view_idx;
   }


   LISTENERS_FLAGS[TYPE_IDX] = true;

   return event_idx;
}













/**********************************************************************************************************************************************************/
// Destroy Listener

// CAUTION!: If the event is a child event, then its index is an invalid index, because its the index to the parents children buffer and not to the 'view_buffer.buffer[TYPE_IDX].buffer[evt_idx]'
export function Listener_remove_event_by_idx(TYPE_IDX, event_idx) {

   const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx];

   const mesh = Mesh_buffer_get_mesh_byidx(event.meshidx);

   // If event is root, has no 'parent_idx', then destroy its children from the view storage buffer
   if (event.parent_idx === null) {

      event.view.children = null;
      const view_idx = event.view_idx

      _listeners_buffer_view_storage.buffer[TYPE_IDX].RemoveByIdx(view_idx);

   }
   else { // Has a parent event... Remove the event from the view storage buffer

      // Get parent event, in order to access the .view ref, and remove the event from the 'view' by its parent(Only Way)
      const parent = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event.parent_idx];

      if (event.view && event.view.children)
         Listener_remove_all_children_events_from_view(TYPE_IDX, event.view.children);

      const view_idx = event.view_idx
      parent.view.children.RemoveByIdx(view_idx);
      if (parent.view.children.boundary === parent.view.children.active_count && parent.view.children.active_count === 0)
         console.log(view_idx, parent.view.children)

   }

   // Listener_debug_print_view_recursive()

   // HERE: We need to run a recursive loop in view storage buffer, to remove all childs from the events storage buffer

   event.view = null;
   _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(event_idx)
   mesh.listeners.buffer[TYPE_IDX] = INT_NULL

   if (_listeners_buffer_storage.buffer[TYPE_IDX].active_count === 0)
      LISTENERS_FLAGS[TYPE_IDX] = false;

}




function Listener_remove_all_children_events_from_view(TYPE_IDX, view) {

   for (let i = 0; i <= view.boundary; i++) {

      // if(view.buffer[i]===null)
      // console.log()

      if (view.buffer[i] !== null) {

         if (view.buffer[i].children) {
            Listener_remove_all_children_events_from_view(TYPE_IDX, view.buffer[i].children);
         }
         _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view.buffer[i].idx].view = null;
         _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(view.buffer[i].idx);

         const mesh = Mesh_buffer_get_mesh_byidx(view.buffer[i].meshidx);
         mesh.listeners.buffer[TYPE_IDX] = INT_NULL
      }
   }
}















/**********************************************************************************************************************************************************/
// HOVER CHECK

export function Listener_dispatch_check_hover_event() {


   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.HoverListener);

   const view_buffer = _listeners_buffer_view_storage.buffer[E.H];

   let intersects = false;

   if(STATE.mesh.focused){
      
      const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(STATE.mesh.focusedIdx);
      const point = MouseGetPos();

      // If and only if mouse is intersecting with the current mesh(mouse hover) ...
      intersects = Intersection_point_rect(point, bounding_box);

      if (intersects) {

         const mesh = Mesh_buffer_get_mesh_byidx(STATE.mesh.focusedIdx);
         const event = _listeners_buffer_storage.buffer[E.H].buffer[mesh.listeners.buffer[E.H]];

         if(event){

            if(event.view.children){
   
               if (Check_hover_recursive(event.view.children, point)) {
                  // intersects = true;
                  return;
               }
            }
   
            Events_handle_immidiate({ type: 'hover', params: { mesh: mesh } });
         }

         return;
      }
   }

   for (let i = 0; i <= view_buffer.boundary; i++) {

      if (view_buffer.buffer[i]) {

         const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(view_buffer.buffer[i].meshidx);
         const point = MouseGetPos();
         
         /**DEBUG*/if (bounding_box === false) {
            console.log('i', i, 'view_buffer.buffer[i]', view_buffer.buffer[i], 'view_buffer', view_buffer);
            STATE.loop.paused = true;
            return;
         }


         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         intersects = Intersection_point_rect(point, bounding_box);

         if (intersects) {

            if (view_buffer.buffer[i] !== null) {

               if (view_buffer.buffer[i].children) { // Check all of its children(recursively)

                  if (Check_hover_recursive(view_buffer.buffer[i].children, point)) {
                     intersects = true;
                     // mesh.SetUpdateFrameBuffer();
                     return;
                  }

               }
            }


            const meshidx = view_buffer.buffer[i].meshidx;
            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);

            Events_handle_immidiate({ type: 'hover', params: { mesh: mesh } });
            // mesh.SetUpdateFrameBuffer();
            intersects = true;
         }
      }

   }



   // NOTE: The only way to avoid meshes remain hovered, after mouse hover skiping over the root mesh's listener.
   if (!intersects && STATE.mesh.hovered) { // If mouse is not intersecting with any mesh and there still is a hovered mesh, unhover it.
      Events_handle_immidiate({ type: 'unhover', params: { mesh: STATE.mesh.hovered } });
   }
   // _pt_hover_listener.timer.Stop();
   // Performance_timer_detailed_stop(PERFORMANCE_TIMERS_IDXS.HoverListener);
   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.HoverListener);
}




function Check_hover_recursive(view_children, point) {

   for (let i = 0; i <= view_children.boundary; i++) {

      const child_evt = view_children.buffer[i];
      if (child_evt) {

         const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(child_evt.meshidx);

         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         const intersects = Intersection_point_rect(point, bounding_box);

         if (intersects) {


            if (child_evt.children) {
               const ret = Check_hover_recursive(view_children.buffer[i].children, point);
               if (ret) return true; // If the most inner hovered found, return recursively so that we do not check annd set a hover of the parent meshes(that are obviusly hovered in the first place).
            }

            const meshidx = view_children.buffer[i].meshidx;
            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);

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

   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.EventListener);

   let view_buffer = _listeners_buffer_view_storage.buffer[TYPE_IDX];

   let intersects = false;


   if(STATE.mesh.focused){
      
      const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(STATE.mesh.focusedIdx);
      const point = MouseGetPos();

      // If and only if mouse is intersecting with the current mesh(mouse hover) ...
      intersects = Intersection_point_rect(point, bounding_box);

      if (intersects) {

         const mesh = Mesh_buffer_get_mesh_byidx(STATE.mesh.focusedIdx);
         const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[mesh.listeners.buffer[TYPE_IDX]];

         if(event.view.children){

            const event_found = Check_child_events_recursive(event.view.children, point);
            if (event_found) {

               // Get the the event (which has all the event data) from the listeners storage buffer
               const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_found.idx];

               const dispatch_params = {
                  meshidx: event.meshidx,
                  evt_params: event.evt_params,
                  trigger_params: trigger_params,
                  event_type: TYPE_IDX,
               }

               if (event.Clbk) {

                  event.Clbk(dispatch_params);
                  Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);

                  // const mesh = Mesh_buffer_get_mesh_byidx(dispatch_params.meshidx);
                  // STATE.mesh.SetFocused(mesh);
                  return; // Return if at least one event is handled. Also return so that any event of the main event will not run.
               }
            }
         }

         // Else handle this event
         if (event.Clbk) {
            // Else if no children event was triggered, run any events of the main event.
            const dispatch_params = {
               meshidx: event.meshidx,
               evt_params: event.evt_params,
               trigger_params: trigger_params,
               event_type: TYPE_IDX,
            }

            event.Clbk(dispatch_params); // Call the event
            Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);

            // const mesh = Mesh_buffer_get_mesh_byidx(event.meshidx);
            // STATE.mesh.SetFocused(mesh);

         } 
         return;
      }


   }

   for (let i = 0; i <= view_buffer.boundary; i++) {

      if (view_buffer.buffer[i]) {

         const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(view_buffer.buffer[i].meshidx);
         const point = MouseGetPos();

         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         intersects = Intersection_point_rect(point, bounding_box);

         if (intersects) {


            // Check all children (recursive)
            if (view_buffer.buffer[i].children) {

               const event_found = Check_child_events_recursive(view_buffer.buffer[i].children, point);
               if (event_found) {

                  // Get the the event (which has all the event data) from the listeners storage buffer
                  const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_found.idx];

                  const dispatch_params = {
                     meshidx: event.meshidx,
                     evt_params: event.evt_params,
                     trigger_params: trigger_params,
                     event_type: TYPE_IDX,
                  }

                  if (event.Clbk) {

                     event.Clbk(dispatch_params);
                     Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);

                     // const mesh = Mesh_buffer_get_mesh_byidx(dispatch_params.meshidx);
                     // STATE.mesh.SetFocused(mesh);
                     return; // Return if at least one event is handled. Also return so that any event of the main event will not run.
                  }
               }
            }

            // Else handle this event

            // Get the event (which has all the event data) from the listeners storage buffer
            const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view_buffer.buffer[i].idx];

            if (event.Clbk) {
               // Else if no children event was triggered, run any events of the main event.
               const dispatch_params = {
                  meshidx: event.meshidx,
                  evt_params: event.evt_params,
                  trigger_params: trigger_params,
                  event_type: TYPE_IDX,
               }

               event.Clbk(dispatch_params); // Call the event
               Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);

               // const mesh = Mesh_buffer_get_mesh_byidx(event.meshidx);
               // STATE.mesh.SetFocused(mesh);

               return;
            }
         }
      }
      // mesh.SetUpdateFrameBuffer();
   }

}




function Check_child_events_recursive(view_children, point) {

   for (let i = 0; i <= view_children.boundary; i++) {

      const child_evt = view_children.buffer[i];
      if (child_evt) {

         const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(child_evt.meshidx);

         // const name = Mesh_buffer_get_mesh_name_byidx(child_evt.meshidx)

         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         const intersects = Intersection_point_rect(point, bounding_box);

         if (intersects) {

            if (child_evt.children) { // Check all of its children(recursively)
               const ret = Check_child_events_recursive(view_children.buffer[i].children, point)
               if (ret) return ret; // Because it a recursive procedure, when the mesh is found we must return it recursively immidiately after the return of the each recursion.
            }
            else
               return child_evt;
         }

      }

   }
   return null;
}




















/**********************************************************************************************************************************************************/
// Misc

export function Listener_set_root_mesh_priority() {

   // Set render priority of all widget root meshes, based on their position in the listeners view buffer 
   for (let i=0; i <= _listeners_buffer_view_storage.boundary; i++ ){
      
      for (let j=0; j <= _listeners_buffer_view_storage.buffer[i].boundary; j++ ){
   
         const view_buffer = _listeners_buffer_view_storage.buffer[i].buffer[j];
   
         const mesh = Mesh_buffer_get_mesh_byidx(view_buffer.meshidx);
   
         Renderqueue_set_priority_by_vb(FIRST, mesh.gfx.vb.idx);
      }
   }

}



















/**********************************************************************************************************************************************************/
// Create Listener

// export function Listener_create_event(TYPE_IDX, meshidx, Clbk, evt_params) {

//    return _listener.AddEvent(TYPE_IDX, meshidx, Clbk, evt_params);
// }



// export function Listener_create_child_event(TYPE_IDX, meshidx, Clbk, evt_params, parent_event) {

//    return _listener.AddChildEvent(TYPE_IDX, meshidx, Clbk, evt_params, parent_event);
// }







/**********************************************************************************************************************************************************/
// Destroy Listener

// CAUTION!: If the event is a child event, then its index is an invalid index, because its the index to the parents children buffer and not to the 'view_buffer.buffer[TYPE_IDX].buffer[evt_idx]'
// export function Listener_remove_event_by_idx(TYPE_IDX, evt) {

//    view_buffer.buffer[TYPE_IDX].RemoveByIdx(evt.evt_idx);

//    if (view_buffer.buffer[TYPE_IDX].active_count === 0)
//       LISTENERS_FLAGS[TYPE_IDX] = false;

// }



export function Listener_remove_child_event_from_parent(TYPE_IDX, evt) {

   // Remove child events requires the parent to remove the child event from 
   evt.parent_evt.children.RemoveByIdx(evt.evt_idx);

   if (view_buffer.buffer[TYPE_IDX].active_count === 0)
      LISTENERS_FLAGS[TYPE_IDX] = false;
}




export function Listener_destroy_children_buffer(TYPE_IDX, event_idx) {
   view_buffer.buffer[TYPE_IDX].buffer[event_idx].children = null;
}




export function Listener_recover_children_buffer(TYPE_IDX, event_idx, children_buffer) {
   view_buffer.buffer[TYPE_IDX].buffer[event_idx].children = children_buffer;
   view_buffer.buffer[TYPE_IDX].buffer[event_idx].has_child_events = true;
}




export function Listener_events_set_mesh_events_active(FLAGS, mesh_listeners, bool_activate) {

   if ((FLAGS & LISTENERS_FLAGS.HOVER) || (FLAGS & LISTENERS_FLAGS.ALL)) {

      if (mesh_listeners.buffer[E.H]) {
         view_buffer.buffer[E.H].buffer[mesh_listeners.buffer[E.H].idx].isActive = bool_activate;
      }
   }

   if ((FLAGS & LISTENERS_FLAGS.CLICK) || (FLAGS & LISTENERS_FLAGS.ALL)) {

      if (mesh_listeners.buffer[E.C]) {
         /**DEBUG ERROR*/ if (view_buffer.buffer[E.C].buffer[mesh_listeners.buffer[E.C].idx] === undefined)
            console.error('Undefined listen event:', mesh_listeners.buffer[E.C].idx, ' type:', E.C)

         view_buffer.buffer[E.C].buffer[mesh_listeners.buffer[E.C].idx].isActive = bool_activate;
      }
   }
}




export function Listener_set_event_active_by_idx(TYPE_IDX, root, childs_evt_idx) {
   // SEE ### docs/ScemeDraws/HoveListenEvents.drawio

   const parent_event_idx = root.listeners.buffer[TYPE_IDX].idx; // Get the parents event from the EventListener's buffer
   if (parent_event_idx === INT_NULL) alert('Root does not have a FAKE event')

   // Get the root's event.
   const evt = view_buffer.buffer[TYPE_IDX].buffer[parent_event_idx];

   if (evt === null) {

      console.error('evt is null');
      return;
   }

   if (evt.children === null) {

      evt.children = New_generic_buffer(_, 'Child Event Listeners buffer 3'); // Create new buffer as a children's events buffer
      evt.has_child_events = true;
   }

   // Copy the child's event params 
   const event_params = view_buffer.buffer[TYPE_IDX].buffer[childs_evt_idx];

   view_buffer.buffer[TYPE_IDX].RemoveByIdx(childs_evt_idx); // Remove the child's event from the root eventListeners buffer
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



export function Listener_debug_print_storage_buffer() {

   for (let i = 0; i <= _listeners_buffer_storage.boundary; i++) {
      console.log('Events Storage Buffer\n   ', _listeners_buffer_storage.buffer[i].buffer);
   }
}
export function Listener_debug_print_view_storage_buffer() {

   for (let i = 0; i <= _listeners_buffer_view_storage.boundary; i++) {
      console.log('Events Storage Buffer:type:', i, '\n   ', _listeners_buffer_view_storage.buffer[i].buffer);
   }
}
export function Listener_debug_print_view_recursive() {

   for (let i = 0; i <= _listeners_buffer_view_storage.boundary; i++) {

      console.log('-Event type:', i);

      let events_count = 0;
      const e_view = _listeners_buffer_view_storage.buffer[i];
      events_count += Listener_debug_print_info_recursive(i, e_view, events_count);
      console.log(`+++ Total count:${events_count}`)
   }
}



function Listener_debug_print_info_recursive(TYPE_IDX, view, count) {

   if (view.active_count === 0) return count;

   let total_count = 0;

   for (let i = 0; i <= view.boundary; i++) {

      // const e = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view.buffer[i].idx];
      const e = view.buffer[i];

      if (e) {

         let r = '  ';

         for (let j = 0; j < count; j++) { r += '->'; }

         const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[e.idx];
         const mesh = Mesh_buffer_get_mesh_byidx(event.meshidx);
         const is_child_event = event.parent_idx !== null ? 'true' : 'false';
         const parentEvent = e.parent_event ? e.parent_event.GetName() : 'NULL'
         const is_fake = event.Clbk ? 'false' : 'true'


         // console.log(`${r} :[${e.idx}] (is child:${is_child_event}) (is fake:${is_fake}) (parent:${event.parent_idx}) (${mesh.GetName()}) `, event.view);
         console.log(`${r} :[${e.idx}] (is child:${is_child_event}) (is fake:${is_fake}) (parent:${event.parent_idx}) (${mesh.GetName()}) `);
         total_count++;

         if (e.children) {
            count++;
            total_count += Listener_debug_print_info_recursive(TYPE_IDX, e.children, count);
            count--;
         }
      }
   }

   return total_count;
}



