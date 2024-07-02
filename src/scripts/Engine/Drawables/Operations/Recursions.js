"use strict";

import { Mesh_buffer_get_mesh_byidx, Widget_root_buffer_get_root_meshidx } from "../../Core/MeshBuffer.js";
import { Listener_assign_parent_event, Listener_create_root_view } from "../../Events/EventListeners.js";


/** // IMPORTANT: Cannot/MustNot return null, only INT_NULL */
export function Find_parent_listen_event(EVENT_TYPE_IDX, mesh) {

    if (mesh.parent === null) return INT_NULL;

    let current = mesh.parent;
    while (current) {

        // Find the first parent with an event listener of type
        if (current.listeners !== null && current.listeners.buffer[EVENT_TYPE_IDX] !== null && current.listeners.buffer[EVENT_TYPE_IDX] !== INT_NULL) {

            return current.listeners.buffer[EVENT_TYPE_IDX];
        }
        current = current.parent;
    }


    // If no parent listener is found:
    // 1. If mesh parent is of type section, create FAKE event listener
    // 2. Else create FAKE event listener at widget root

    // if(mesh.parent && (mesh.parent.type & MESH_TYPE.SECTION_MESH)){

    //    mesh.parent.CreateListenEvent(mesh.event_flags, FAKE_LISTEN_EVENT);
    //    mesh.parent.AddListenEvent(EVENT_TYPE_IDX, null, null, null);
    //    return mesh.parent.listeners.buffer[EVENT_TYPE_IDX];
    // }

if(mesh.root_bufferidx === -1)
console.log
    // Ceate FAKE event listener at widget root. The current stored the root in the while loop above
    if (current === null) { // UNNECESSARY: I believe if break is not reached, then current will go to scene which is 'NO_MESH_PARENT'
        const root_meshidx = Widget_root_buffer_get_root_meshidx(mesh.root_bufferidx)
        current = Mesh_buffer_get_mesh_byidx(root_meshidx)
    }
    // HERE! We want to create an event if the listeners buffer is null OR if the current TYPE_IDX is null
    if (current.listeners === null || current.listeners.buffer[EVENT_TYPE_IDX] === null) {

        const etype = Listen_event_types_get_type_from_index(EVENT_TYPE_IDX);
        current.CreateListenEvent(etype, FAKE_LISTEN_EVENT);
        current.AddListenEvent(EVENT_TYPE_IDX, null, null, null);
        Listener_create_root_view(EVENT_TYPE_IDX, current.listeners.buffer[EVENT_TYPE_IDX]);
    }

    const parent_event_idx = current.listeners.buffer[EVENT_TYPE_IDX];
    return parent_event_idx;
}



/**
 * The only thing it does, is to create a parent relation for each event.
 * That is by creating a 'view' of tree structure of all events in the ListenersBuffer.
 * If a mesh's parent does not have an event, then a search up the mesh tree is taking place,
 * to find the first grand-parent with an equivalent event, and set it as the parent event.
 * If no such event is found, then a FAKE event of that type is created at the root parent mesh.
 */
export function Construct_listeners_relations(mesh) {
    let parent_events = null;
    if (mesh.parent) {
        parent_events = mesh.parent.listeners;
        // console.log(mesh.GetName(), mesh.parent.GetName(), parent_events)
    }
    // else if(mesh)
    console.log(mesh.GetName())
    if(mesh.GetName() === 'Switch Widget')
        console.log()

    // TODO: Remove from the event: to be as null and as an INT_NULL    
    if (mesh.listeners !== null) {

        for (let etype = 0; etype <= mesh.listeners.boundary; etype++) {
            
            if (mesh.listeners.buffer[etype] !== null) {
                
                // ERROR CHECK: Case parent event is INT_NUULL
                if(parent_events && parent_events.buffer[etype] === INT_NULL) alert('7266534');

                
                if (parent_events === null || parent_events.buffer[etype] === null) {
                    // Find from widget root tree any parent events
                    const parent_eventidx = Find_parent_listen_event(etype, mesh);
    
                    if (parent_eventidx !== INT_NULL) { // Find any parent event from the widget root tree
                        // Listener_create_root_view(etype, parent_eventidx);
                        Listener_assign_parent_event(etype, mesh.listeners.buffer[etype], parent_eventidx)
                    }
                    else if (mesh.listeners.buffer[etype] !== null && mesh.listeners.buffer[etype] !== INT_NULL) { // Create root event view 
                        Listener_create_root_view(etype, mesh.listeners.buffer[etype]);
                    }
                }
                else if (parent_events.buffer[etype] !== INT_NULL && parent_events.buffer[etype] !== null && mesh.listeners.buffer[etype] !== INT_NULL) {
    
                    // Connect child's event with the current parent
                    Listener_assign_parent_event(etype, mesh.listeners.buffer[etype], parent_events.buffer[etype])
                    console.log('Connect event:', mesh.listeners.buffer[etype], 'with parent', parent_events.buffer[etype])
                }
            }

            // TODO: If there is no current-parent event, create a fake one 
        }
    }

    for (let i = 0; i <= mesh.children.boundary; i++) {

        const child = mesh.children.buffer[i];
        Construct_listeners_relations(child)

    }
    // Run  for children
}
/**SAVE */
// export function Construct_listeners_relations(mesh) {
//     let parent_events = null;
//     if (mesh.parent) {
//         parent_events = mesh.parent.listeners;
//         // console.log(mesh.GetName(), mesh.parent.GetName(), parent_events)
//     }
//     // else if(mesh)

//     // TODO: Remove from the event: to be as null and as an INT_NULL    
//     if (mesh.listeners !== null) {
//         for (let etype = 0; etype <= mesh.listeners.boundary; etype++) {
            
//             if (mesh.listeners.buffer[etype] !== null) {
                
//                 if (parent_events === null || parent_events.buffer[etype] === null) {
//                     // Find from widget root tree any parent events
//                     const parent_eventidx = Find_parent_listen_event(etype, mesh);
    
//                     if (parent_eventidx !== INT_NULL) { // Find any parent event from the widget root tree
//                         // Listener_create_root_view(etype, parent_eventidx);
//                         Listener_assign_parent_event(etype, mesh.listeners.buffer[etype], parent_eventidx)
//                     }
//                     else if (mesh.listeners.buffer[etype] !== null && mesh.listeners.buffer[etype] !== INT_NULL) { // Create root event view 
//                         Listener_create_root_view(etype, mesh.listeners.buffer[etype]);
//                     }
//                 }
//                 else if (parent_events.buffer[etype] !== INT_NULL && parent_events.buffer[etype] !== null && mesh.listeners.buffer[etype] !== INT_NULL) {
    
//                     // Connect child's event with the current parent
//                     Listener_assign_parent_event(etype, mesh.listeners.buffer[etype], parent_events.buffer[etype])
//                     console.log('Connect event:', mesh.listeners.buffer[etype], 'with parent', parent_events.buffer[etype])
//                 }
//             }

//             // TODO: If there is no current-parent event, create a fake one 
//         }
//     }

//     for (let i = 0; i <= mesh.children.boundary; i++) {

//         const child = mesh.children.buffer[i];
//         Construct_listeners_relations(child)

//     }
//     // Run  for children
// }