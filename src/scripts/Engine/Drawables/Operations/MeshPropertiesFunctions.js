"use strict";

import { New_generic_buffer } from "../../Core/Buffers.js";
import { Str_buffer_mesh_names_get_by_idx, Str_buffer_mesh_names_store } from "../../Core/StringBuffer.js";
import { Listener_change_child_event, Listener_create_child_event, Listener_remove_event_by_idx, Listeners_set_priority } from "../../Events/EventListeners.js";
import { State_mesh_set_focused } from "../../../GlobalFunctions.js";
import { Vertex_buffer_set_and_update_uniform } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Program_find_uniform_ubidx_from_name } from "../../../Graphics/ShaderPrograms.js";
import { Root_group_view_buffer_get_mesh_by_rootidx } from "../../Core/Views/RootView.js";
import { Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";

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
   return params;
   return evt_clbk_idx;
}



/*******************************************************************************************************************************************************/
// Uniforms
/*******************************************************************************************************************************************************/

/** */
export function Mesh_find_unif_idx_from_unif_name(mesh_unif_buffer, unif_name) {

    const len = mesh_unif_buffer.length;
    for (let i = 0; i < len; i++) {
        if (mesh_unif_buffer[i].name === unif_name) {
            return i;
        }
    }

    alert('Find_mesh_ubidx_from_unif_name(ubidx, unif_name)\nNo uniform found with name:', unif_name, mesh_unif_buffer)
}
/** */
export function Mesh_set_uniform_ubidx_from_name(uniforms, ubidx, unif_name) {

    const len = uniforms.length;
    for (let i = 0; i < len; i++) {
        if (uniforms[i].name === unif_name) {
            uniforms[i].ubidx = ubidx;
            return;
        }
    }

    alert('Mesh_set_uniform_ubidx_from_name()\nNo mesh with uniform found.')
}
/** */
export function Mesh_set_and_update_wpos_uniform(progidx, vb_groupidx, unif_val, val_idx) {

    const ubidx = Program_find_uniform_ubidx_from_name(progidx, 'u_wposxy');
    Vertex_buffer_set_and_update_uniform(vb_groupidx, ubidx, unif_val, val_idx);
    // console.error('ubidx', ubidx, 'progidx', progidx, 'vbidx', vb_groupidx)
}
/** */
export function Mesh_get_uniform_ubidx_from_name(uniforms_buffer, unif_name) {

    const len = uniforms_buffer.length;
    for (let i = 0; i < len; i++) {
        if (uniforms_buffer[i].name === unif_name) {
            return uniforms_buffer[i].ubidx;
        }
    }

    console.error('unif_name', unif_name, '\nuniforms_buffer', uniforms_buffer);
    alert('Mesh_get_uniform_ubidx_from_name()\nNo mesh with uniform found.')
}



/** DEPRECATED: Reimplement with ViewGroups*/
export function Mesh_set_root_in_focus(root_bufferidx, scroller_comp_idx = INT_NULL) {

    // // Get all vertex buffers of all the root grouped meshes.
    // const gfx_buffers = Root_group_vbidx_view_get(root_bufferidx);

    // let scrollers = []

    // for (let i = 0; i <= gfx_buffers.boundary; i++) {

    //     // Reorder renderqueue
    //     Renderqueue_set_priority_by_vb(LAST, gfx_buffers.buffer[i]);

    //     const root_mesh_idx = Mesh_per_vb_get_vb_byidx(gfx_buffers.buffer[i]);

    //     // Check for any scroller component and reorder its Draw
    //     if (root_mesh_idx !== null && root_mesh_idx !== undefined) {
    //         for (let j = 0; j <= root_mesh_idx.boundary; j++) {

    //             const mesh_idx = root_mesh_idx.buffer[j];

    //             if (mesh_idx !== INT_NULL) {

    //                 const mesh = Mesh_buffer_get_mesh_byidx(mesh_idx);

    //                 if (mesh && mesh.scroller_comp_idx !== INT_NULL) {

    //                     const scroller = Components_get_scroller_component(mesh.scroller_comp_idx);
    //                     scrollers.push(scroller)

    //                     // Reorder renderqueue
    //                     Renderqueue_set_priority_by_vb(LAST, scroller.gfx.vb.groupidx);

    //                 }
    //             }

    //         }
    //     }
    //     else {
    //         console.error('129917330298 \nRoot mesh is missing\nfor setting the scroller\'s render priority.');
    //     }


    // }


    // Reorder listeners buffer
    const root = Root_group_view_buffer_get_mesh_by_rootidx(root_bufferidx);
    // TODO: We need to insure that there is a root widget liste event in all root widgets
    if (root.listeners) {
        Listeners_set_priority(E.H, root.listeners);
        Listeners_set_priority(E.C, root.listeners);
    }


    // // Do the same for any scrollers

    // for (let j = 0; j < scrollers.length; j++) {

    //     const scroller = scrollers[j];

    //     // Reorder renderqueue
    //     Renderqueue_set_priority_by_vb(LAST, scroller.gfx.vb.groupidx);

    //     if (scroller.listeners) {
    //         Listeners_set_priority(E.H, scroller.listeners);
    //         Listeners_set_priority(E.C, scroller.listeners);
    //     }
    // }


    // Set the global state
    State_mesh_set_focused(root);
}



/** */
export function Mesh_remove_time_interval(mesh, idx) {
    const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[idx];
    if (intervalIdx === -1) {
        console.error('intervalIdx', intervalIdx, 'mesh.timeIntervalsIdxBuffer.buffer', mesh.timeIntervalsIdxBuffer.buffer)
        alert('417772839 \nIssue with timeInterval\nPossible error: We overloaded the time intervals buffer\nThe buffer currently holds up to two intervals\nINTERVALS.UPDATE and INTERVALS.MOVE\nTry to dissable mesh Move event')
    }
    Time_intervals_destroy_byidx(intervalIdx);
    mesh.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(idx);
}