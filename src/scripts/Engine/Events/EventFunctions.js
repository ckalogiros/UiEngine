"use strict";

import { Listen_event_types_get_type_from_index } from "../../GlobalFunctions.js";
import { Mesh_buffer_get_mesh_byidx } from "../Core/MeshBuffer.js";
import { View_get_group_root_meshidx } from "../Core/Views/MeshBufferViews.js";
import { Root_group_view_buffer_get_root_meshidx } from "../Core/Views/RootView.js";
import { Mesh_get_name, Mesh_listener_add, Mesh_listener_create } from "../Drawables/Operations/MeshPropertiesFunctions.js";
import { Listener_assign_parent_event, Listener_create_root_view } from "./EventListeners.js";


/** // IMPORTANT: Cannot/MustNot return null, only INT_NULL */
function Find_parent_listen_event(EVENT_TYPE_IDX, mesh) {

    if (mesh.parent === null) return INT_NULL;

    let current = mesh.parent;

    
    while (current) {
        /**
         * HERE we must check if a parent is of type dropdown.
         * If it is, we create a FAKE event to the dp
         * and BREAK
         */


        // Find the first parent with an event listener of type
        if (current.listeners !== null && current.listeners.buffer[EVENT_TYPE_IDX] !== null && current.listeners.buffer[EVENT_TYPE_IDX] !== INT_NULL) {

            return current.listeners.buffer[EVENT_TYPE_IDX];
        }


        if(current.type & MESH_TYPE.WIDGET_DROP_DOWN){

            const etype = Listen_event_types_get_type_from_index(EVENT_TYPE_IDX);
            
            // Create FAKE event
            Mesh_listener_create(current, etype, true); 
            // Construct
            Mesh_listener_add(current, EVENT_TYPE_IDX, null, null); 

            // Find parent ELSE create root view event
            const parent_eventidx = Find_parent_listen_event(EVENT_TYPE_IDX, current)
        
            // The third check is to avoid the fouund parent event being the root, so no root view has been created 
            if (parent_eventidx !== null && parent_eventidx !== INT_NULL && parent_eventidx !== current.listeners.buffer[EVENT_TYPE_IDX]) { 
                Listener_assign_parent_event(EVENT_TYPE_IDX, current.listeners.buffer[EVENT_TYPE_IDX], parent_eventidx)
            }
            else Listener_create_root_view(EVENT_TYPE_IDX, current.listeners.buffer[EVENT_TYPE_IDX]);
            break;
        }

        current = current.parent;
    }


    // If no parent with event is found, create FAKE event at the widget root
    if (current === null) { // UNNECESSARY: I believe if break is not reached, then current will go to scene which is 'NO_MESH_PARENT'
        // const root_meshidx = Root_group_view_buffer_get_root_meshidx(mesh.root_bufferidx)
        const root_meshidx = View_get_group_root_meshidx(mesh.group_bufferidxs[0]);
        current = Mesh_buffer_get_mesh_byidx(root_meshidx)
    }


    if(current.listeners && current.listeners.buffer[EVENT_TYPE_IDX]) return current.listeners.buffer[EVENT_TYPE_IDX]
    return null;
}






/**
 * The only thing it does, is to create a parent relation for each event.
 * That is by creating a 'view' of tree structure of all events in the ListenersBuffer.
 * If a mesh's parent does not have an event, then a search up the mesh tree is taking place,
 * to find the first grand-parent with an equivalent event, and set it as the parent event.
 * If no such event is found, then a FAKE event of that type is created at the root parent mesh.
 */
export function Construct_listen_events_relations_from_mesh_tree(mesh, parent=null) {
    
    let parent_events = null;
    if(parent!==null) parent_events = parent.listeners;
    else if (mesh.parent) parent_events = mesh.parent.listeners; 

    if (mesh.listeners !== null && (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE)) {

        for (let etype = 0; etype <= mesh.listeners.boundary; etype++) {
            
            if (mesh.listeners.buffer[etype] !== null) {
                
                // ERROR CHECK: Case parent event is INT_NULL
                if(parent_events && parent_events.buffer[etype] === INT_NULL) {
                    console.error('mesh', Mesh_get_name(mesh), '\nlisteners', mesh.listeners, '\nparent_events', parent_events, 'etype', etype);
                    // alert('7266534');
                }

                
                // if (parent_events === null || parent_events.buffer[etype] === null) {
                if (parent_events === null || parent_events.buffer[etype] === null || parent_events.buffer[etype] === INT_NULL) {
                    // Find from widget root tree any parent events
                    const parent_eventidx = Find_parent_listen_event(etype, mesh);
    
                    if (parent_eventidx !== null && parent_eventidx !== INT_NULL) { // Find any parent event from the widget root tree
                        
                        if(mesh.listeners.buffer[etype] === INT_NULL) //return;
                        console.log(mesh.listeners.buffer[etype], parent_eventidx)
                        
                        Listener_assign_parent_event(etype, mesh.listeners.buffer[etype], parent_eventidx, mesh)
                    }
                    else if (mesh.listeners.buffer[etype] !== null && mesh.listeners.buffer[etype] !== INT_NULL) { // Create root event view 
                        Listener_create_root_view(etype, mesh.listeners.buffer[etype]);
                    }
                }
                else if (parent_events.buffer[etype] !== INT_NULL && parent_events.buffer[etype] !== null && mesh.listeners.buffer[etype] !== INT_NULL) {
    
                    // Connect child's event with the current parent
                    Listener_assign_parent_event(etype, mesh.listeners.buffer[etype], parent_events.buffer[etype], mesh)
                    // console.log('Connect event:', mesh.listeners.buffer[etype], 'with parent', parent_events.buffer[etype])
                }
            }
        }
    }

    // Run recursive for mesh tree node
    for (let i = 0; i <= mesh.children.boundary; i++) {

        const child = mesh.children.buffer[i];
        Construct_listen_events_relations_from_mesh_tree(child)

    }
}








export function Construct_listen_events_from_mesh_tree(mesh){
    // console.log('------------------------------------------------ \nTIMES Construct_listen_events_from_mesh_tree is CALLED\n', mesh.GetName(), '\n----------------------------------------');

    /**
     * READ CAREFULLY!!!
     * Why children-meshes of a widget will call 'ListenEventConstruct()' more than one times
     * and why they are gonna construct their listener only the first time
     * 
     * If the current mesh is a dropdown, the Dropdown method will be called.
     * It will construct the listener in the EventListeners System buffer for however the method is implemented,
     * that is construct at least click listener for the dp's button. 
     * After the dp, this function will run for the dp's children.
     * So the button will call it's 'ListenEventConstruct()', in button widget class.
     * THAT IS NOT A PROBLEM of reconstruucting the buttons listener,
     * for the reason that any listener in the mesh.listeners buffer that is NOT INT_NULL,
     * the listener construction will fail.
     */
    const continue_with_children = mesh.ListenEventConstruct();
    
    // Recurse 
    for (let i=0; i <= mesh.children.boundary; i++){
        const child = mesh.children.buffer[i];
        Construct_listen_events_from_mesh_tree(child)
    }
}
    