"use strict";

import { Intersection_point_rect } from "../Drawables/Operations/Collisions.js";
import { MouseGetPos } from "../Controls/Input/Mouse.js";
import { New_generic_buffer } from "../Core/Buffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";
import { Events_handle_immidiate } from "./Events.js";
import { Info_listener_create_event, Info_listener_dispatch_event } from "../Drawables/DebugInfo/InfoListeners.js";
import { GREY } from "../Drawables/Material/Base/Colors.js";
import { Mesh_buffer_get_mesh_bounding_box, Mesh_buffer_get_mesh_bounding_box_with_hover_margin, Mesh_buffer_get_mesh_byidx, Mesh_buffer_get_mesh_geometry, Mesh_buffer_get_mesh_name_byidx } from "../Core/MeshBuffer.js";




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

   // If event is root, has no 'parent_idx', then destroy its children from the view storage buffer
   if (event.parent_idx === null) {

      event.view.children = null;
      const view_idx = event.view_idx

      _listeners_buffer_view_storage.buffer[TYPE_IDX].RemoveByIdx(view_idx);
   }
   else { // Has a parent event... Remove the event from the view storage buffer
      // Get parent event, in order to access the .view ref, and remove the event from the 'view' by its parent(Only Way)
      const parent = _listeners_buffer_storage.buffer[TYPE_IDX].buffer[event.parent_idx];

      // console.log('00000', TYPE_IDX, Mesh_buffer_get_mesh_name_byidx(event.meshidx))
      // Listener_remove_all_children_events_from_view(TYPE_IDX, event.view);
      // if(event.view && event.view.children) 
      // Listener_remove_all_children_events_from_view(TYPE_IDX, event.view.children);
      
      const view_idx = event.view_idx
      parent.view.children.RemoveByIdx(view_idx);

      // Listener_debug_print_info_e1()
      // parent.view.children.ShiftElementOnDestroy(view_idx);
   }


   // HERE: We need to run a recursive llop in view storage buffer, to remove all childs from the events storage buffer

   event.view = null;
   _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(event_idx)

   if (_listeners_buffer_storage.buffer[TYPE_IDX].active_count === 0)
      LISTENERS_FLAGS[TYPE_IDX] = false;

}

function Listener_remove_all_children_events_from_view(TYPE_IDX, view){

   // console.log('1', TYPE_IDX, Mesh_buffer_get_mesh_name_byidx(view.meshidx))
   
   for(let i=0; i<=view.boundary; i++){

      if(view.buffer[i].children){
         Listener_remove_all_children_events_from_view(TYPE_IDX, view.buffer[i].children);
      }
      // console.log('2', TYPE_IDX, Mesh_buffer_get_mesh_name_byidx(view.buffer[i].meshidx))
      // console.log('   ', _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view.buffer[i].idx])
      // console.log('   ',view.buffer[i])
      _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view.buffer[i].idx].view = null;
      _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(view.buffer[i].idx)
   }
}

// function Listener_remove_all_children_events_from_view(TYPE_IDX, view){

//    console.log('1', TYPE_IDX, Mesh_buffer_get_mesh_name_byidx(view.meshidx))
//    if(view.children){

//       for(let i=0; i<=view.children.boundary; i++){
//          console.log('2', TYPE_IDX, Mesh_buffer_get_mesh_name_byidx(view.children.buffer[i].meshidx))
//          Listener_remove_all_children_events_from_view(TYPE_IDX, view.children.buffer[i]);
         
//          // _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view.children.buffer[i].idx].view = null;
//          // _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(view.children.buffer[i].idx)
//       }
//    }
//    _listeners_buffer_storage.buffer[TYPE_IDX].buffer[view.idx].view = null;
//    _listeners_buffer_storage.buffer[TYPE_IDX].RemoveByIdx(view.idx)
// }





/**********************************************************************************************************************************************************/
// HOVER CHECK

export function Listener_dispatch_check_hover_event() {


   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.HoverListener);

   const view_buffer = _listeners_buffer_view_storage.buffer[E.H];

   let intersects = false;

   for (let i = 0; i <= view_buffer.boundary; i++) {


      const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(view_buffer.buffer[i].meshidx);
      const point = MouseGetPos();


      // If and only if mouse is intersecting with the current mesh(mouse hover) ...
      intersects = Intersection_point_rect(point, bounding_box);

      if (intersects) {


         if (view_buffer.buffer[i].children) { // Check all of its children(recursively)

            if (Check_hover_recursive(view_buffer.buffer[i].children, point)) {
               intersects = true;
               // mesh.SetUpdateFrameBuffer();
               return;
            }

         }

         const meshidx = view_buffer.buffer[i].meshidx;
         const mesh = Mesh_buffer_get_mesh_byidx(meshidx);

         Events_handle_immidiate({ type: 'hover', params: { mesh: mesh } });
         // mesh.SetUpdateFrameBuffer();
         intersects = true;
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

   const view_buffer = _listeners_buffer_view_storage.buffer[TYPE_IDX];

   let intersects = false;

   for (let i = 0; i <= view_buffer.boundary; i++) {

      if (view_buffer.buffer[i]) {

         const bounding_box = Mesh_buffer_get_mesh_bounding_box_with_hover_margin(view_buffer.buffer[i].meshidx);
         const point = MouseGetPos();

         const name = Mesh_buffer_get_mesh_name_byidx(view_buffer.buffer[i].meshidx)


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

                     const mesh = Mesh_buffer_get_mesh_byidx(dispatch_params.meshidx);
                     STATE.mesh.SetFocused(mesh);
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

               const mesh = Mesh_buffer_get_mesh_byidx(event.meshidx);
               STATE.mesh.SetFocused(mesh);

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

         const name = Mesh_buffer_get_mesh_name_byidx(child_evt.meshidx)

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

















































// TODO: Maybe the meshidx and target params are just mesh_bufferidxs
// export class Event_Listener {

//    event_type;

//    constructor() {

//       this.event_type = new Array(LISTEN_EVENT_TYPES_INDEX.SIZE);
//    }


//    AddEvent(TYPE_IDX, meshidx = null, Clbk = null, evt_params = null) {

//       if (this.event_type[TYPE_IDX] === undefined) {
//          this.event_type[TYPE_IDX] = New_generic_buffer(_, 'Event Listeners buffer');
//       }


//       const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
//       const event_params = {
//       /**DEBUG */name: (mesh) ? mesh.GetName() : 'NO SOURCE PARAMS',
//          type: TYPE_IDX,
//          Clbk: Clbk,
//          evt_idx: INT_NULL,
//          parent_evt: INT_NULL,
//          meshidx: meshidx,
//          evt_params: evt_params,
//          isActive: false, // UNUSED: TODO: Make use of the is Active or remove it.
//          children: null, // current mesh may have children with events. This is the buffer to store them, but only after 'ReconstructEvents' function call.
//          has_child_events: false, // This is to check if the current event has any children events(eficient since we do not have to check every child event if 'isActive')
//       }

//       LISTENERS_FLAGS[TYPE_IDX] = true;
//       event_params.evt_idx = this.event_type[TYPE_IDX].Add(event_params);

//       if (mesh.debug_info.type === 0)
//          Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.LISTENERS, event_params);

//       return this.event_type[TYPE_IDX].buffer[event_params.evt_idx];
//    }


//    AddChildEvent(TYPE_IDX, meshidx = null, Clbk = null, evt_params = null, parent_event = null) {

//       if (this.event_type[TYPE_IDX] === undefined) {

//          console.log('Creating new event type events buffer')
//          this.event_type[TYPE_IDX] = New_generic_buffer(_, 'Child Event Listeners buffer 1');
//       }

//       const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
//       const event_params = {
//       /**DEBUG */name: (mesh) ? mesh.GetName() : 'NO SOURCE PARAMS',
//          type: TYPE_IDX,
//          Clbk: Clbk,
//          evt_idx: INT_NULL,
//          parent_evt: parent_event,
//          meshidx: meshidx,
//          evt_params: evt_params,
//          isActive: true,
//          children: null, // current mesh may have children with events. This is the buffer to store them, but only after 'ReconstructEvents' function call.
//          has_child_events: false, // This is to check if the current event has any children events(eficient since we do not have to check every child event if 'isActive')
//       }

//       LISTENERS_FLAGS[TYPE_IDX] = true;
//       const event = parent_event;


//       if (!event.children) {
//          event.children = New_generic_buffer(_, 'Child Event Listeners buffer 2');
//       }

//       event_params.evt_idx = event.children.Add(event_params);
//       event.has_child_events = true;

//       if (mesh.debug_info.type === 0)
//          Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.LISTENERS, event_params);

//       return event.children.buffer[event_params.evt_idx];
//    }


//    CopyChildren(TYPE_IDX, event_idx) {

//       const children_events = this.event_type[TYPE_IDX].buffer[event_idx].children;
//       const temp = New_generic_buffer(_, 'Listeners buffer COPY TEM buffer');

//       for (let i = 0; i <= children_events.boundary; i++) {

//          const evt = children_events.buffer[i];

//          const event_params = {
//             type: evt.type,
//             Clbk: evt.Clbk,
//             meshidx: evt.meshidx,
//             evt_params: evt.evt_params,
//             isActive: evt.isActive,
//             children: null, // TODO: MUST COPY ALL CHILDRENS BUFFER RECURSIVELY???
//             has_child_events: evt.has_child_events,
//          }

//          temp.Add(event_params);
//       }
//       return temp;
//    }


//    /** Debug */
//    PrintAll() {
//       console.log('Listener: ', view_buffer.buffer)
//    }

// }



// export function Listeners_copy_event_children_buffer(TYPE_IDX, event_idx) { return _listener.CopyChildren(TYPE_IDX, event_idx); }





// const _listener = new Event_Listener();



// export function Listeners_get_event(TYPE_IDX, event_idx) { return view_buffer.buffer[TYPE_IDX].buffer[event_idx]; }




/**********************************************************************************************************************************************************/
// CLICK CHECK(Only click for now)

// export function Listener_dispatch_event(TYPE_IDX, trigger_params) {


//    // _pt_event_listener.timer.Start(); /* Performance measure */
//    Performance_timer_start(PERFORMANCE_TIMERS_IDXS.EventListener);

//    if (view_buffer.buffer[TYPE_IDX] === undefined) return;
//    /**DEBUG*/if (TYPE_IDX < 0 || TYPE_IDX >= LISTEN_EVENT_TYPES_INDEX.SIZE) alert('Event type index does not exist.');


//    let intersected = false;

//    for (let i = 0; i <= view_buffer.buffer[TYPE_IDX].boundary; i++) {

//       const evt = view_buffer.buffer[TYPE_IDX].buffer[i];

//       if (evt) {

//          const mesh = Mesh_buffer_get_mesh_byidx(evt.meshidx);
//          const point = MouseGetPos();
//          const verticalMargin = mesh.hover_margin;

//          const rect = [ // The rect area to check for event(mouse hover)
//          [mesh.geom.pos[0] - mesh.geom.dim[0] - verticalMargin[0], mesh.geom.pos[0] + mesh.geom.dim[0] + verticalMargin[0]], // Left  Right 
//          [(mesh.geom.pos[1] - mesh.geom.dim[1]) - verticalMargin[1], (mesh.geom.pos[1] + mesh.geom.dim[1]) + verticalMargin[1]], // Top  Bottom
//       ];

//       // If and only if mouse is intersecting with the current mesh(mouse hover) ...
//       intersected = Intersection_point_rect(point, rect);

//       if (intersected) {

//          if (evt.has_child_events) { // Check all of its children(recursively)
//             const event_found = Check_child_events_recursive(evt, point);
//             if (event_found) {

//                const dispatch_params = {
//                   meshidx: event_found.meshidx,
//                   evt_params: event_found.evt_params,
//                   trigger_params: trigger_params,
//                   event_type: TYPE_IDX,
//                }

//                if (event_found.Clbk) {

//                   event_found.Clbk(dispatch_params);
//                   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
//                   // console.log('STOP111111')

//                   const mesh = Mesh_buffer_get_mesh_byidx(dispatch_params.meshidx);
//                   STATE.mesh.SetFocused(mesh);
//                   return; // Return if at least one event is handled. Also return so that any event of the main event will not run.
//                }
//             }
//          }

//          if (evt.Clbk) {
//             // Else if no children event was triggered, run any events of the main event.
//             const dispatch_params = {
//                meshidx: evt.meshidx,
//                evt_params: evt.evt_params,
//                trigger_params: trigger_params,
//                event_type: TYPE_IDX,
//             }

//             evt.Clbk(dispatch_params);
//             Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
//             // console.log('STOP22222222222')

//             const mesh = Mesh_buffer_get_mesh_byidx(dispatch_params.meshidx);
//             STATE.mesh.SetFocused(mesh);

//             return;
//             }
//          }
//          mesh.SetUpdateFrameBuffer();
//       }
//    }

//    // Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.EventListener);
//    // console.log('STOP333')

// }



// function Check_child_events_recursive(evt, point) {

//    let ret = null;

//    for (let i = 0; i <= evt.children.boundary; i++) {

//       const child_evt = evt.children.buffer[i];
//       if (child_evt) {

//          const mesh = Mesh_buffer_get_mesh_byidx(child_evt.meshidx);
//          const verticalMargin = mesh.hover_margin;

//          const rect = [ // The rect area to check for event(mouse hover)
//             [mesh.geom.pos[0] - mesh.geom.dim[0] - verticalMargin[0], mesh.geom.pos[0] + mesh.geom.dim[0] + verticalMargin[0]], // Left  Right 
//             [(mesh.geom.pos[1] - mesh.geom.dim[1]) - verticalMargin[1], (mesh.geom.pos[1] + mesh.geom.dim[1]) + verticalMargin[1]], // Top  Bottom
//          ];

//          // If and only if mouse is intersecting with the current mesh(mouse hover) ...
//          const intersects = Intersection_point_rect(point, rect);

//          if (intersects && child_evt.has_child_events) { // Check all of its children(recursively)
//             const ret = Check_child_events_recursive(child_evt, point)
//             if (ret) return ret; // Because it a recursive procedure, when the mesh is found we must return it recursively immidiately after the return of the each recursion.
//          }
//          else{

//             if (intersects && (mesh.StateCheck(MESH_STATE.IS_FAKE_EVENT) === 0)) { // 
//                // console.log(mesh.GetName())
//                return child_evt;
//             }
//             if (intersects) 
//                return child_evt;
//          }
//       }
//    }

//    return null;
// }







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

export function Debug_get_event_listeners() { return _listener; }



export function Listener_debug_print_all() {

   _listener.PrintAll();
}



// export function Listener_debug_print_info_e1() {

//    const count = view_buffer.buffer.length;
//    for (let i = 0; i < count; i++) {

//       console.log('-Event type:', i);

//       let events_count = 0;
//       const e = view_buffer.buffer[i];
//       if (e) {
//          events_count += Listener_debug_print_info_recursive(e, events_count);
//       }
//       console.log(`+++ Total count:${events_count}`)
//    }
// }



// function Listener_debug_print_info_recursive(children, count) {

//    let total_count = 0;

//    for (let i = 0; i <= children.boundary; i++) {

//       const e = children.buffer[i];

//       if (e) {

//          let r = '  ';

//          for (let j = 0; j < count; j++) { r += '->'; }

//          const mesh = Mesh_buffer_get_mesh_byidx(e.meshidx);
//          const is_child_event = (mesh.listeners.buffer[1]) ? mesh.listeners.buffer[1].is_child_event : false;
//          const parentEvent = e.parent_event ? e.parent_event.GetName() : 'NULL'
//          console.log(`${r} :(${mesh.GetName()})-(has children:${e.has_child_events})-(is child:${is_child_event})-(evtidx:${e.evt_idx})-(parent:${parentEvent})`);
//          total_count++;

//          if (e.children) {
//             count++;
//             total_count += Listener_debug_print_info_recursive(e.children, count);
//             count--;
//          }
//       }
//    }

//    return total_count;
// }


export function Listener_debug_print_storage_buffer_e2() {

   for (let i = 0; i <= _listeners_buffer_storage.boundary; i++) {
      console.log('Events Storage Buffer\n   ', _listeners_buffer_storage.buffer[i].buffer);
   }
}
export function Listener_debug_print_view_storage_buffer_e3() {

   for (let i = 0; i <= _listeners_buffer_view_storage.boundary; i++) {
      console.log('Events Storage Buffer:type:', i, '\n   ', _listeners_buffer_view_storage.buffer[i].buffer);
   }
}
export function Listener_debug_print_info_e1() {

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
         const is_child_event = event.parent_idx!==null ? 'true' : 'false';
         const parentEvent = e.parent_event ? e.parent_event.GetName() : 'NULL'
         const is_fake = event.Clbk ? 'false' : 'true'


         console.log(`${r} :[${e.idx}] (is child:${is_child_event}) (is fake:${is_fake}) (parent:${event.parent_idx}) (${mesh.GetName()}) `, event.view);
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



