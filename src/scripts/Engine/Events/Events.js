"use strict";

import { MOUSE } from "../Controls/Input/Mouse.js";
import { Set_default_color_rgba, Set_hover_color_rgba } from "../Drawables/Operations/MeshAttributesFunctions.js";
import { Listener_dispatch_check_hover_event, Listener_dispatch_event } from "./EventListeners.js";



const events = []; // Aplication's events array
let evtsIdx = 0; // Index for events array



export function RegisterEvent(eventType, params) {

    events[evtsIdx++] = {
        type: eventType,
        params: params,
    };
}



export function HandleEvents() {

    let i = 0;
    while (i < evtsIdx) {

        const e = events[i];

        if (e.type & EVENT_HANDLER_TYPE.MOUSE_MOVE) {

            if (LISTENERS_FLAGS[E.H] === true) // NOTE: Avoid dispatching if there are no listeners in the ListenersBuffer
                Listener_dispatch_check_hover_event();

        }
        else if (e.type & EVENT_HANDLER_TYPE.MOUSE_CLICK_DOWN && e.params.mouseButton === MOUSE.BTN_ID.LEFT) {

            STATE.mouse.activeClickedButtonId = e.params.mouseButton;

            if (LISTENERS_FLAGS[E.C] === true)  // NOTE: Avoid dispatching if there are no listeners in the ListenersBuffer
                Listener_dispatch_event(E.C, e.params.mouseButton);
                
        }
        else if (e.type & EVENT_HANDLER_TYPE.MOUSE_CLICK_UP) {

            STATE.mouse.activeClickedButtonId = INT_NULL;
            const mesh = STATE.mesh.hovered;

            // Disable mesh's hover state
            if (STATE.mesh.hovered) {
                if (mesh.StateCheck(MESH_STATE.IN_MOVE)) {
                    mesh.state.mask &= ~MESH_STATE.IN_MOVE; // Set false
                }
            }
            // Disable mesh's grab state
            if (STATE.mesh.grabed) {
                if (STATE.mesh.grabed.StateCheck(MESH_STATE.IN_GRAB)) {
                    STATE.mesh.grabed.state.mask &= ~MESH_STATE.IN_GRAB; // Set false
                    STATE.mesh.SetGrabed(null)
                }
            }
            // Resolve click n hold
            if (STATE.mesh.click_hold && e.params.mouseButton === MOUSE.BTN_ID.LEFT) {
                if (STATE.mesh.click_hold.StateCheck(MESH_STATE.IS_HOLD_CLICK)) {

                    STATE.mouse.activeClickedButtonId = e.params.mouseButton;
                    STATE.mesh.click_hold.state.mask &= ~MESH_STATE.IN_HOLD_CLICK; // Set false

                    /**
                     * // HACK:  Remove time interval of a click n hold button.
                     * Case the mouse 'click-up' happens outside the buttons area.
                     * Instead of run the buttons 'OnClick' method, we call directly a method
                     * to remove the the time interval.
                     * Else we should call the ListenEvents, which would not find any 
                     * intersection between the mouse and the button
                     */
                    STATE.mesh.click_hold.RemoveTimeInterval(INTERVALS.UPDATE);
                    
                    // if (LISTENERS_FLAGS[E.C] === true)  // NOTE: Avoid dispatching if there are no listeners in the ListenersBuffer
                    //     Listener_dispatch_event(E.C, e.params.mouseButton);
                    
                    STATE.mesh.SetClickHold(null)
                }
            }

            // e.type += ' HANDLED'; e.params = {}; evtsIdx--;

        }
    

        i++;
    } // End of events for loop

    evtsIdx = 0;
}



export function Events_handle_immidiate(e) {

    /**
     * // TODO: Set the hovered mesh to be darwn on top(last in vertexBuffer or in render queue)
     * 0. Check to see if overlap (2)
     * 1. If the hovered mesh is in different vertexBuffer than the previous hovered mesh,
     *      change the order of the render queue, if it is drawn before. 5
     * 2. Else if the hovered mesh is in the same vertexBuffer than the previous hovered mesh, 
     *      change the order inside the vertexBuuffer, if is drawn before. 
     */
    // if (e.type === 'hover') {
    if (e.type & EVENT_HANDLER_TYPE.MOUSE_HOVER) {

        // Apply Hover Color, if the hovered mesh is not already in hover.
        // TODO: isn't it unecessary to check if colorable????? The purpose of hover is to color????
        if (e.params.mesh.StateCheck(MESH_STATE.IS_HOVER_COLORABLE) && e.params.mesh.mesh_bufferidx !== STATE.mesh.hoveredIdx) {

            // Unhover any hovered mesh.
            if (STATE.mesh.hovered) {

                // If there is a resolve function, call it.
                if(STATE.mesh.hovered.event_clbks_resolve_fn) {
                    STATE.mesh.hovered.event_clbks_resolve_fn(STATE.mesh.hovered, EVENT_HANDLER_TYPE.MOUSE_UNHOVER);
                }
                else if(STATE.mesh.hovered.current_event_callback_idx !== INT_NULL){
                    const Clbk = STATE.mesh.hovered.event_clbks.buffer[STATE.mesh.hovered.current_event_callback_idx].Clbk;
                    if(Clbk !== undefined){
                        // console.error('Event callback is running second time, from unhover event. CHECK if THERE IS ANY CONFLICT OF DUPLICATE EVENT CALL')
                        const clbk_params = STATE.mesh.hovered.event_clbks.buffer[STATE.mesh.hovered.current_event_callback_idx].clbk_params;
                        Clbk(clbk_params, EVENT_HANDLER_TYPE.MOUSE_UNHOVER);
                        // console.log('UNHOVER 2')
                    }
                }

                Set_default_color_rgba(STATE.mesh.hovered);
                STATE.mesh.hovered.state.mask &= ~MESH_STATE.IN_HOVER_COLOR;
            }

            Set_hover_color_rgba(e.params.mesh);

            e.params.mesh.state.mask |= (MESH_STATE.IN_HOVER_COLOR | MESH_STATE.IN_HOVER); 
            
            STATE.mesh.SetHovered(e.params.mesh);
            TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.COUNT++;

            // If there is a resolve function, call it.
            if(e.params.mesh.event_clbks_resolve_fn) {
                e.params.mesh.event_clbks_resolve_fn(e.params.mesh, EVENT_HANDLER_TYPE.MOUSE_HOVER);
            }
            else if(e.params.mesh.current_event_callback_idx !== INT_NULL){
                const Clbk = e.params.mesh.event_clbks.buffer[e.params.mesh.current_event_callback_idx].Clbk;
                if(Clbk !== undefined){
                    const clbk_params = e.params.mesh.event_clbks.buffer[e.params.mesh.current_event_callback_idx].clbk_params;
                    // console.log('HOVER ', 
                    //     'active', clbk_params.animation_params.is_animation_active,
                    //     'inflate', clbk_params.animation_params.in_animation_inflate,
                    //     'deflate', clbk_params.animation_params.in_animation_deflate,
                    //     'stall', clbk_params.animation_params.in_animation_inflate_stall,
                    // )
                    Clbk(clbk_params, EVENT_HANDLER_TYPE.MOUSE_HOVER);
                }
            }

        }

    }

    // else if (e.type === 'unhover') {
    else if (e.type & EVENT_HANDLER_TYPE.MOUSE_UNHOVER) {

        if (e.params.mesh.StateCheck(MESH_STATE.IN_HOVER_COLOR)) {
            Set_default_color_rgba(e.params.mesh);
            e.params.mesh.state.mask &= ~MESH_STATE.IN_HOVER_COLOR; // Set false
        }

            // If there is a resolve function, call it.
            if(e.params.mesh.event_clbks_resolve_fn) {
                e.params.mesh.event_clbks_resolve_fn(e.params.mesh, EVENT_HANDLER_TYPE.MOUSE_UNHOVER);
            }
            else if(e.params.mesh.current_event_callback_idx !== INT_NULL){
                const Clbk = e.params.mesh.event_clbks.buffer[e.params.mesh.current_event_callback_idx].Clbk;
                if(Clbk !== undefined){
                    // console.error('Event callback is running second time, from unhover event. CHECK if THERE IS ANY CONFLICT OF DUPLICATE EVENT CALL')
                    const clbk_params = e.params.mesh.event_clbks.buffer[e.params.mesh.current_event_callback_idx].clbk_params;
                    // console.log('UNHOVER 1', 
                    //     'active', clbk_params.animation_params.is_animation_active,
                    //     'inflate', clbk_params.animation_params.in_animation_inflate,
                    //     'deflate', clbk_params.animation_params.in_animation_deflate,
                    //     'stall', clbk_params.animation_params.in_animation_inflate_stall,
                    // )
                    // console.log('UNHOVER 1', clbk_params.animation_params.in_animation_inflate_stall)
                    Clbk(clbk_params, EVENT_HANDLER_TYPE.MOUSE_UNHOVER);
                    // console.log('UNHOVER 1', clbk_params.animation_params.cur_posx)
                }
            }
        // }
        
        e.params.mesh.state.mask &= ~MESH_STATE.IN_HOVER; // Set false
        STATE.mesh.SetHovered(null);
    }

}

