"use strict";

import { Intersection_point_rect } from "../Drawables/Operations/Collisions.js";
import { MouseGetPos } from "../Controls/Input/Mouse.js";
import { Free_generic_buffer, New_generic_buffer } from "../Core/Buffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";
import { Events_handle_immidiate } from "./Events.js";
import { Mesh_buffer_get_mesh_bounding_box, Mesh_buffer_get_mesh_byidx, Mesh_buffer_get_mesh_name_byidx } from "../Core/MeshBuffer.js";




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
 */

/**
 * We use two separate storage buffers for smaller memory footprint (faster) for listen events access
 */
const _listeners_buffer_storage = New_generic_buffer(_, '_listeners_buffer_storage');
const _listeners_buffer_view_storage = New_generic_buffer(_, '_listeners_buffer_view_storage');




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
      _listeners_buffer_storage.Add(New_generic_buffer(_, '_listeners_buffer_storage - Hover'));
      _listeners_buffer_view_storage.Add(New_generic_buffer(_, '_listeners_buffer_view_storage - Click'));
   }
}



/**********************************************************************************************************************************************************/
// Create Listener
export function Listener_create_child_event(TYPE_IDX, meshidx, Clbk, evt_params, is_fake) {

   /**DEBUG */const mesh = Mesh_buffer_get_mesh_byidx(meshidx);

   const event_idx = _listeners_buffer_storage.buffer[TYPE_IDX].Add({
      /**DEBUG */name: (mesh) ? mesh.GetName() : 'NO SOURCE PARAMS',
      type: TYPE_IDX,
      parent_idx: INT_NULL,
      Clbk: Clbk,
      meshidx: meshidx,
      evt_params: evt_params,
      is_fake: is_fake,
      view: null,
   });


   // _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx].event_idx = event_idx;

   LISTENERS_FLAGS[TYPE_IDX] = true;

   return event_idx;
}




/** Change an event's callback and parameters */
export function Listener_change_child_event(TYPE_IDX, event_idx, Clbk, evt_params) {

   const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx];
   if(Clbk) event.Clbk = Clbk;
   event.evt_params = evt_params;

}



/**********************************************************************************************************************************************************/
// Create Parent-Child relation
/**
 * The point of the view is to have in a tree like structure all events for fast access. 
 * Root views are constructed based on the widget roots of the widget buffer,
 * though a root event may be any children of the widget root tree.
 * That is because if a root widget does not have a listener, we can create root event any child seen fit.
 * 
 */
export function Listener_create_root_view(TYPE_IDX, event_idx){

   const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx];


   // Avoid creating duplicate root views of the same event
   if(event.view){

      // Get the event index ouuut of the view event, and compare it with the current event idxe we try to set as root view event
      // If it is equal, meaning the current event is already a root view event, DO NOTHING 
      const root_view_event_idx = _listeners_buffer_view_storage.buffer[TYPE_IDX].buffer[event.view.view_idx].event_idx
      if(event_idx === root_view_event_idx){
         return;
      }
   }



   // Create a tree buffer stucture view of the listeners storage buffer, for fast event listeners search
   const view_idx = _listeners_buffer_view_storage.buffer[TYPE_IDX].Add({
      event_idx: event_idx,
      meshidx: event.meshidx,
      view_idx: INT_NULL,
      children: null,
   });

   // Store the view's index in the parents children buffer.
   _listeners_buffer_view_storage.buffer[TYPE_IDX].buffer[view_idx].view_idx = view_idx;

   // Store a reference of view back to listeners storage buffer. Can't have an index cause the view is tree buffer structure.
   event.view = _listeners_buffer_view_storage.buffer[TYPE_IDX].buffer[view_idx];

}



/**
 * Every event that is not a root event, must be assigned a parent event in order to be checked by the event listen function(Hover, Click, ...) 
 */
export function Listener_assign_parent_event(TYPE_IDX, event_idx, parent_event_idx){
if(event_idx === parent_event_idx) return
   const parent_event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[parent_event_idx];
   if(parent_event===null || parent_event===undefined) 
      alert('000111333')

   
   const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx];


   // Create the parent's children View
   if (!parent_event.view.children) {
      parent_event.view.children = New_generic_buffer(_, `Listeners->parent_event.view.children:${parent_event.name}`);
   }

   // Avoid duuplicte views on a recostruction. If the current event already exists as a view node, Skip
   if(parent_event.view && event.view){
      if(parent_event.view.children.buffer[event.view.view_idx].event_idx === event_idx){
         // console.log('ADDED index', 'event', event.name, 'parent', parent_event.name)
         return
      }
   }

   // Store the new event as a child to the parent in the listeners VIEW storage buffer.
   const view_idx = parent_event.view.children.Add({
      event_idx: event_idx,
      meshidx: event.meshidx,
      view_idx: INT_NULL,
      children: null,
   });

   // console.log('ADDED index', view_idx, 'event', event.name, 'parent', parent_event.name)

   event.parent_idx = parent_event_idx;

   /**
    * // IMPORTANT: 
    * The view_index is only a valid index to the parent event's children buffer, 
    * which is untraceble because its a tree structure, unless the event is a root event,
    * in which case the view_idx is an index to the '_listeners_buffer_view_storage'
    * The only way to access a node is by searching the View storage buffer from the root event, 
    * else it can be accessed from the events.view field, which has a refference of the view node, along with the children buffer
    */
   // Store the view's index in the parents children buffer.
   parent_event.view.children.buffer[view_idx].view_idx = view_idx;
   
   // Store a reference of view back to listeners storage buffer. Can't have an index cause the view is tree buffer structure.
   event.view = parent_event.view.children.buffer[view_idx];


}












/**********************************************************************************************************************************************************/
// Destroy Event Listeners

/**
 * // IMPORTANT:
 * If an event is to be removed that has child events(via the view tree struct), 
 * then all the children events will be removed also, from the tree view as from the listeners storage buffer.
 * Otherwise there would be events with no parent event (in the view tree) inaccesible from the EventListeners system.
 * So we need to be cautious aboput any meshes that their event might be removed without calling specificaly for the event removal. 
 */
export function Listener_remove_event_by_idx(TYPE_IDX, event_idx) {

   const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx];

   if(event === null || event === undefined) {
      console.error('1092873 \nTrying to remove an event that does not exist', 'Event type', TYPE_IDX, 'event idx', event_idx, '\nbuffer:', _listeners_buffer_storage.buffer[TYPE_IDX].buffer)
      alert('1092873 \nTrying to remove an event that does not exist')
   }


   // If event is root, has no 'parent_idx', then destroy its children from the view storage buffer
   if (event.parent_idx === INT_NULL) {

      event.view.children = null;
      _listeners_buffer_view_storage.buffer[TYPE_IDX].RemoveByIdx(event.view.view_idx);

   }
   else { // Has a parent event... Remove the view event from the view storage buffer

      // Get parent event, in order to access the .view ref, and remove the event from the 'view' by its parent(Only Way)
      const parent = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event.parent_idx];

      if (event.view && event.view.children)
         Listener_remove_all_children_events_from_view(TYPE_IDX, event.view.children);

      // console.log('1 Remove View', 'type', TYPE_IDX, 'view_idx', event.view)
      parent.view.children.RemoveByIdx(event.view.view_idx);

   }


   // Remove event from the listeners storage buffer
   event.view = null;
   
   _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(event_idx);

   if (_listeners_buffer_storage.buffer[TYPE_IDX].active_count === 0)
      LISTENERS_FLAGS[TYPE_IDX] = false;

}



/** This function removes any tree view node from View storage buffer, but does not remove any listen events from the Listeners storage buffer */
export function Listener_disable_event_view_and_all_children(TYPE_IDX, event_idx) {

   const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_idx];
   
   if(event === null || event === undefined) {
      console.error('1092873 \nTrying to remove an event that does not exist', 'Event type', TYPE_IDX, 'event idx', event_idx, '\nbuffer:', _listeners_buffer_storage.buffer[TYPE_IDX].buffer)
      alert('1092873 \nTrying to remove an event that does not exist')
   }

   // If event is root, has no 'parent_idx', then destroy its children directly from the view storage buffer
   if (event.parent_idx === INT_NULL) {

      event.view.children = null;
      _listeners_buffer_view_storage.buffer[TYPE_IDX].RemoveByIdx(event.view.view_idx);

   }
   else { // Else we need the parent event in order to remove the event view from the view tree

      // Get parent event, in order to access the .view ref, and remove the event from the 'view' by its parent(Only Way)
      const parent = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event.parent_idx];
      parent.view.children.RemoveByIdx(event.view.view_idx);

   }


   // Remove event from the listeners storage buffer
   event.view = null;
   
}



function Listener_remove_all_children_events_from_view(TYPE_IDX, view) {

   for (let i = 0; i <= view.boundary; i++) {


      if (view.buffer[i] !== null) {

         if (view.buffer[i].children) {
            Listener_remove_all_children_events_from_view(TYPE_IDX, view.buffer[i].children);
         }
         _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view.buffer[i].event_idx].view = null; // Set the 'view' field to null, removing any refference
         _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(view.buffer[i].event_idx); // Remove the event from the listeners storage buffer

         // IMPORTANT: Because we remove events that their mesh didn't call for, we just set the mesh's event index to INT_NULL here
         const mesh = Mesh_buffer_get_mesh_byidx(view.buffer[i].meshidx);
         mesh.listeners.buffer[TYPE_IDX] = INT_NULL
      }
   }

   // Free the memory of this view.buffer after we have removed all elements in the loop above.
   // This is only to set the 'DEBUG_INFO_STRUCTS.BUFFER.GENERIC.COUNTER'.
   // The actual view is removed-destroyed from it's parent, in the caller function
   Free_generic_buffer(view)
}


























/**********************************************************************************************************************************************************/
/**********************************************************************************************************************************************************/
/**********************************************************************************************************************************************************/
// FUNCTIONALITY
/**********************************************************************************************************************************************************/
/**********************************************************************************************************************************************************/
/**********************************************************************************************************************************************************/




/**********************************************************************************************************************************************************/
// HOVER CHECK

export function Listener_dispatch_check_hover_event() {


   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.HoverListener);

   const view_buffer = _listeners_buffer_view_storage.buffer[E.H];

   let intersects = false;

   // if(STATE.mesh.focused && STATE.mesh.focused.listeners){ // TODO: efficiency: must check because the focused may not have a listen event. FIXME
      
   //    const bounding_box = Mesh_buffer_get_mesh_bounding_box(STATE.mesh.focusedIdx);
      
   //    const point = MouseGetPos();

   //    // If and only if mouse is intersecting with the current mesh(mouse hover) ...
   //    intersects = Intersection_point_rect(point, bounding_box);

   //    if (intersects) {

   //       const mesh = Mesh_buffer_get_mesh_byidx(STATE.mesh.focusedIdx);

   //       const event = _listeners_buffer_storage.buffer[E.H].buffer[mesh.listeners.buffer[E.H]];
   //       if(event){

   //          if(event.view.children){
   
   //             if (Check_hover_recursive(event.view.children, point)) {
   //                // intersects = true;
   //                return;
   //             }
   //          }
   
   //          Events_handle_immidiate({ type: 'hover', params: { mesh: mesh } });
   //       }

   //       return;
   //    }
   // }

   for (let i = 0; i <= view_buffer.boundary; i++) {

      if (view_buffer.buffer[i]) {

         const bounding_box = Mesh_buffer_get_mesh_bounding_box(view_buffer.buffer[i].meshidx);
         const point = MouseGetPos();
         
         /**DEBUG*/if (bounding_box === false) {
            console.log('i', i, 'view_buffer.buffer[i]', view_buffer.buffer[i], 'view_buffer', view_buffer);
            STATE.loop.paused = true;
            return;
         }
         
         
         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         intersects = Intersection_point_rect(point, bounding_box);
         // console.log(bounding_box[0][0], bounding_box[1][0], point[0], 'intersects', intersects)



         if (intersects) {
            // console.log(view_buffer.buffer[i])

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

            break;
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

         const bounding_box = Mesh_buffer_get_mesh_bounding_box(child_evt.meshidx);

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


   // if(STATE.mesh.focused && STATE.mesh.focused.listeners){ // TODO: efficiency: must check because the focused may not have a listen event. FIXME
      
   //    const bounding_box = Mesh_buffer_get_mesh_bounding_box(STATE.mesh.focusedIdx);
   //    const point = MouseGetPos();

   //    // If and only if mouse is intersecting with the current mesh(mouse hover) ...
   //    intersects = Intersection_point_rect(point, bounding_box);

   //    if (intersects) {

   //       const mesh = Mesh_buffer_get_mesh_byidx(STATE.mesh.focusedIdx);
   //       const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[mesh.listeners.buffer[TYPE_IDX]];

   //       if(event.view.children){

   //          const event_found = Check_child_events_recursive(event.view.children, point);
   //          if (event_found) {

   //             // Get the the event (which has all the event data) from the listeners storage buffer
   //             const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_found.event_idx];

   //             const dispatch_params = {
   //                meshidx: event.meshidx,
   //                evt_params: event.evt_params,
   //                trigger_params: trigger_params,
   //                event_type: TYPE_IDX,
   //                click_pos: point,
   //             }

   //             if (event.Clbk) {

   //                Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
   //                event.Clbk(dispatch_params);

   //                return; // Return if at least one event is handled. Also return so that any event of the main event will not run.
   //             }
   //          }
   //       }

   //       // Else handle this event
   //       if (event.Clbk) {
   //          // Else if no children event was triggered, run any events of the main event.
   //          const dispatch_params = {
   //             meshidx: event.meshidx,
   //             evt_params: event.evt_params,
   //             trigger_params: trigger_params,
   //             event_type: TYPE_IDX,
   //             click_pos: point,
   //          }

   //          Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
   //          event.Clbk(dispatch_params); // Call the event

   //       } 
   //       return;
   //    }


   // }

   for (let i = 0; i <= view_buffer.boundary; i++) {

      if (view_buffer.buffer[i]) {

         const bounding_box = Mesh_buffer_get_mesh_bounding_box(view_buffer.buffer[i].meshidx);
         const point = MouseGetPos();

         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         intersects = Intersection_point_rect(point, bounding_box);

         if (intersects) {

            // Get the event (which has all the event data) from the listeners storage buffer
            const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view_buffer.buffer[i].event_idx];

            // Check all children (recursive)
            if (view_buffer.buffer[i].children) {

               const event_found = Check_child_events_recursive(view_buffer.buffer[i].children, point);
               if (event_found) { // If the child event is found but does not have a Callback, handle the parent event

                  // Get the the event (which has all the event data) from the listeners storage buffer
                  const e = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event_found.event_idx];

                  const dispatch_params = {
                     meshidx: e.meshidx,
                     evt_params: e.evt_params,
                     trigger_params: trigger_params,
                     event_type: TYPE_IDX,
                     click_pos: point,
                  }

                  if (e.Clbk) {

                     Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
                     e.Clbk(dispatch_params);

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
                  click_pos: point,
               }

               Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
               event.Clbk(dispatch_params); // Call the event

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

         const name = Mesh_buffer_get_mesh_name_byidx(child_evt.meshidx)
         const mesh = Mesh_buffer_get_mesh_byidx(child_evt.meshidx)

         const bounding_box = Mesh_buffer_get_mesh_bounding_box(child_evt.meshidx);

         // If and only if mouse is intersecting with the current mesh(mouse hover) ...
         const intersects = Intersection_point_rect(point, bounding_box);
         console.log(mesh.GetName(), 'intersects', intersects)

         if (intersects) {

            if (child_evt.children) { // Check all of its children(recursively)
               
               const evt = Check_child_events_recursive(view_children.buffer[i].children, point)
               
               if (evt) { // I has Callback then it is not a FAKE event, so its ok to return the event
                  
                  // Get the the event (which has all the event data) from the listeners storage buffer
                  const e = _listeners_buffer_storage.buffer[E.C].buffer[evt.event_idx];

   
                  // Because its a recursive procedure, when the mesh is found we must return it recursively immidiately after the return of the each recursion.
                  if (evt && e.Clbk) return evt; // I has Callback then it is not a FAKE event, so its ok to return the event
                  // Else continue
               }
            }
            else
               return child_evt;
         }

      }

   }
   console.log('-----------------------------------------')
   return null;
}




















/**********************************************************************************************************************************************************/
// Misc





















/**************************************************************************************************************************/
// Debug Info Getters
export function Listeners_get_count()        { return _listeners_buffer_storage.active_count; }
export function Listeners_get_size()         { return _listeners_buffer_storage.size; }
export function Listeners_hover_get_count()  { return _listeners_buffer_storage.buffer[E.H].active_count; }
export function Listeners_hover_get_size()   { return _listeners_buffer_storage.buffer[E.H].size; }
export function Listeners_click_get_count()  { return _listeners_buffer_storage.buffer[E.C].active_count; }
export function Listeners_click_get_size()   { return _listeners_buffer_storage.buffer[E.C].size; }






























/**********************************************************************************************************************************************************/
// Debug Print



export function Listener_debug_print_storage_buffer() {

   for (let i = 0; i <= _listeners_buffer_storage.boundary; i++) {
      console.log('Events Storage (Linear) Buffer. Type:', i, '\n    ', _listeners_buffer_storage.buffer[i].buffer);
   }
}
export function Listener_debug_print_view_storage_buffer() {

   for (let i = 0; i <= _listeners_buffer_view_storage.boundary; i++) {
      console.log('Events View Storage Buffer:type:', i, '\n   ', _listeners_buffer_view_storage.buffer[i].buffer);
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

         const event = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[e.event_idx];
         if(event){

            const mesh = Mesh_buffer_get_mesh_byidx(event.meshidx);
            const is_child_event = event.parent_idx !== null ? 'true' : 'false';
            const is_fake = event.is_fake;
   
            console.log(`${r} :[${e.event_idx}] (is child:${is_child_event}) (is fake:${is_fake}) (parent:${event.parent_idx}) (${mesh.GetName()}) `);
            total_count++;
         }

         if (e.children) {
            count++;
            total_count += Listener_debug_print_info_recursive(TYPE_IDX, e.children, count);
            count--;
         }
      }
   }

   return total_count;
}



