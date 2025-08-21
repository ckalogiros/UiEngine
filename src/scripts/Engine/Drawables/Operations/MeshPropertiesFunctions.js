"use strict";

import { New_generic_buffer } from "../../Core/Buffers.js";
import { Str_buffer_mesh_names_get_by_idx, Str_buffer_mesh_names_store } from "../../Core/StringBuffer.js";
import { Listener_change_child_event, Listener_create_child_event, Listener_remove_event_by_idx } from "../../Events/EventListeners.js";


/** */
export function Mesh_set_name(mesh, name = null) {
   if (name !== '' && name) mesh.nameidx = Str_buffer_mesh_names_store(name, mesh.mesh_bufferidx, mesh.type & MESH_TYPE.DEBUG_MESH);
   /**DEBUG*/mesh.name = name
}
/** */
export function Mesh_get_name(mesh) { 
   return Str_buffer_mesh_names_get_by_idx(mesh.nameidx); 
}
/** Mesh State*/
export function Mesh_state_check(mesh, bit) {
   return mesh.state.mask & bit;
}
/** */
export function Mesh_calc_pos_dif(mesh1, mesh2) {

    const m1_posx = mesh1.geom.pos[0] + mesh1.geom.dim[0];
    const m1_posy = mesh1.geom.pos[1] + mesh1.geom.dim[1];
    const m2_posx = mesh2.geom.pos[0] + mesh2.geom.dim[0];
    const m2_posy = mesh2.geom.pos[1] + mesh2.geom.dim[1];
    return [
        m1_posx - m2_posx,
        m1_posy - m2_posy,
    ];
}


/*******************************************************************************************************************************************************/
// Listeners
/*******************************************************************************************************************************************************/

/** */
export function Mesh_listener_create(mesh, etype,  clbk=null, clbk_params=null, is_fake_event = false) {

   if (!mesh.listeners) {
      mesh.listeners = New_generic_buffer(_, 'Mesh-Listeners');
      mesh.listeners.Init(LISTEN_EVENT_TYPES_INDEX.SIZE);
   }

   if (etype & LISTEN_EVENT_TYPES.HOVER) {

      mesh.listeners.AddAtIndex(E.H, INT_NULL);

      mesh.state.mask |= (MESH_STATE_FLAGS.IS_HOVERABLE | MESH_STATE_FLAGS.IS_HOVER_COLORABLE);

      // if (is_fake_event) mesh.state.mask |= (MESH_STATE_FLAGS.IS_FAKE_EVENT | MESH_STATE_FLAGS.IS_FAKE_HOVERABLE);

   }
   if (etype & LISTEN_EVENT_TYPES.CLICK_UP) {

      mesh.listeners.AddAtIndex(E.C, INT_NULL)

      mesh.state.mask |= (MESH_STATE_FLAGS.IS_CLICKABLE);

      // if (is_fake_event) mesh.state.mask |= (MESH_STATE_FLAGS.IS_FAKE_EVENT | MESH_STATE_FLAGS.IS_FAKE_CLICKABLE);

   }
   if (etype & LISTEN_EVENT_TYPES.MOVE) {

      mesh.listeners.AddAtIndex(E.C, INT_NULL);

      mesh.state.mask |= (MESH_STATE_FLAGS.IS_GRABABLE | MESH_STATE_FLAGS.IS_MOVABLE | MESH_STATE_FLAGS.IS_CLICKABLE);

      // if (is_fake_event) mesh.state.mask |= (MESH_STATE_FLAGS.IS_FAKE_EVENT | MESH_STATE_FLAGS.IS_FAKE_CLICKABLE);

   }
   if (etype & LISTEN_EVENT_TYPES.KEY_PRESS) {

      mesh.listeners.AddAtIndex(E.K, INT_NULL);

      mesh.state.mask |= (MESH_STATE_FLAGS.IS_KEY_PRESSABLE);

      // TEMPORARY: We temporariliy use the mesh's .event_clbks to store the key press callback(e.x. for moving a target with arrow keys)
      if(clbk) Mesh_event_callback_create(mesh, clbk, clbk_params);

      // if (is_fake_event) mesh.state.mask |= (MESH_STATE_FLAGS.IS_FAKE_EVENT | MESH_STATE_FLAGS.IS_FAKE_CLICKABLE);

   }

}
/** */
// Either the 'parent_event' is legit if we pass it or null, so just check if is NOT INT_NULL
export function Mesh_listener_add(mesh, etypeidx, Clbk = null, params = null) {

   if (mesh.listeners.buffer[etypeidx] !== INT_NULL) return;
   if ((mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) === 0x0) {
      return;
   }


   const is_fake = (mesh.state.mask & MESH_STATE_FLAGS.IS_FAKE_EVENT) ? true : false;
   mesh.listeners.buffer[etypeidx] = Listener_create_child_event(etypeidx, mesh.mesh_bufferidx, Clbk, params, is_fake);
}
/** */
// Either the 'parent_event' is legit if we pass it or null, so just check if is NOT INT_NULL
export function Mesh_listener_change_clbk(mesh, etypeidx, Clbk = null, params = null) {

   if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) { // HERE: see if can remove check

      Listener_change_child_event(etypeidx, mesh.listeners.buffer[etypeidx], Clbk, params);
   }
}
/** */
export function Mesh_listener_remove(mesh,) {

   if (!mesh.listeners) return;

   for (let i = 0; i <= mesh.listeners.boundary; i++) {

      if (mesh.listeners.buffer[i] !== null && mesh.listeners.buffer[i] !== INT_NULL) {
         Listener_remove_event_by_idx(i, mesh.listeners.buffer[i]);
         mesh.listeners.buffer[i] = INT_NULL;
      }
   }
}
/** */
// export function Mesh_event_callback_create(mesh, params = null, event_clbks_resolve_fn = null) {

//    if (!params) alert('Mesh_event_callback_create(params = null). @ Mesh.js')
//    if (mesh.event_clbks === null) mesh.event_clbks = New_generic_buffer(_, 'Mesh event_clbks');

//    // Automaticaly enable event callback if the first event callback is activated. 
//    // For the rest of the callback events, the user is responsible to set the current active by setting current_event_callback_idx
//    const evt_clbk_idx = mesh.event_clbks.Add(params);
//    if (evt_clbk_idx === 0) mesh.current_event_callback_idx = evt_clbk_idx;

//    // User created function to resolve the event callback
//    if (event_clbks_resolve_fn) mesh.event_clbks_resolve_fn = event_clbks_resolve_fn;
//    return evt_clbk_idx;
// }
export function Mesh_event_callback_create(mesh, Clbk, clbk_params = null, event_clbks_resolve_fn = null) {

   const params = {
      Clbk: Clbk,
      clbk_params: clbk_params,
   }

   if (!params) alert('Mesh_event_callback_create(params = null). @ Mesh.js')
   if (mesh.event_clbks === null) mesh.event_clbks = New_generic_buffer(_, 'Mesh event_clbks');

   // Automaticaly enable event callback if the first event callback is activated. 
   // For the rest of the callback events, the user is responsible to set the current active by setting current_event_callback_idx
   const evt_clbk_idx = mesh.event_clbks.Add(params);
   if (evt_clbk_idx === 0) mesh.current_event_callback_idx = evt_clbk_idx;

   // User created function to resolve the event callback
   if (event_clbks_resolve_fn) mesh.event_clbks_resolve_fn = event_clbks_resolve_fn;
   return evt_clbk_idx;
}
