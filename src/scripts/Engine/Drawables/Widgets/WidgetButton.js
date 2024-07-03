"use strict";

import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from '../../Timers/TimeIntervals.js';
import { GREY, WHITE } from '../Material/Base/Colors.js';
import { Find_parent_listen_event } from '../Operations/Recursions.js';
import { Widget_Label } from './WidgetLabel.js';







export class Widget_Button extends Widget_Label {

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, Align, pos, fontsize, col, text_col, pad = [20, 15], bold = .4, style = [0, 6, 2], font = TEXTURES.MSDF_CONSOLAS_1024, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, Align, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh)
      this.type |= MESH_TYPE.WIDGET_BUTTON;

      // Bind a default function for OnClick() event
      // this.Bind(Button_click_default_callback, _, 'Default Button Binding Function')

      // this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   SetGfxEnableAttributes(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgeButton')
   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/
   // ConstructListeners(parent_listeners = null) {

   //    const mesh = this; // If in recursion, use as the current mesh the passed param. 

   //    for (let i = 0; i <= mesh.listeners.boundary; i++) {

   //       if (mesh.listeners.buffer[i]) { 

   //          if(parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
   //             parent_listeners = [null, null];
   //             parent_listeners[i] = Find_parent_listen_event(i, mesh);
   //          }
   //          else if(parent_listeners[i] === null){
   //             parent_listeners[i] = Find_parent_listen_event(i, mesh);
   //          }


   //          mesh.AddListenEvent(i, mesh.OnClick, mesh.evt_params, parent_listeners[i]);
   //       }
   //    }
   // }


   // AddListeners() {

   //    const mesh = this; // If in recursion, use as the current mesh the passed param. 
   //    if(!mesh.listeners) alert('228866 \nMuste CreateListenEvent() first for mesh:.', mesh.GetName);

   //    for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

   //       const evt = mesh.listeners.buffer[etypeidx];
   //       if (evt) { // If event is not null
   //          const evt_params = {
   //             EventClbk: null,
   //             targetBindingFunctions: null,
   //             target_mesh: mesh,
   //             params: null,
   //          }
   //          mesh.AddListenEvent(etypeidx, mesh.OnClick, mesh.evt_params, null);
   //       }
   //    }
   // }


   // ListenEventCreate(etype) {

   //    const etypeidx = Listen_event_get_idx_from_type(etype);
   //    const mesh = this;

   //    // For Hover events we need no callback and params
   //    if (etype & LISTEN_EVENT_TYPES.HOVER) {

   //       mesh.CreateListenEvent(etype);
   //       if (mesh.state.mask & MESH_STATE.ACTIVE) mesh.AddListenEvent(etypeidx, null, null);
   //    }
   //    else if (etype & LISTEN_EVENT_TYPES.CLICK_UP | LISTEN_EVENT_TYPES.MOVE) {

   //       const evt_params = { target_mesh: mesh, };
   //       mesh.CreateListenEvent(etype);
   //       if (mesh.state.mask & MESH_STATE.ACTIVE) mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, null);
   //    }

   // }



   /**
    * Constructs all listen events enabled for this classs widget.
    * 
    * The listener will be constructed only if:
    *    1. the mesh is ACTIVE
    *    2. the event index is INT_NULL. 
    *       That is so we skip the construction of an already created listener, if the .listeners[etype] is a number [0..n] indexing the listener in the EventListeners System buffer
    *       and it does not create a listener if the .listeners[etype] is null, if there is no listener assigned to be created
    * 
    *  This fuction must be called through 'Construct_listen_events_from_mesh_tree()', because it does not check if 'mesh.listeners' is null buffer
    */
   ListenEventConstruct() {

      const mesh = this;

      if (mesh.state.mask & MESH_STATE.ACTIVE) {
         
         // Construct HOVER event
         if (mesh.listeners && mesh.listeners.buffer[E.H] === INT_NULL) {
            mesh.AddListenEvent(E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (mesh.listeners && mesh.listeners.buffer[E.C] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            mesh.AddListenEvent(E.C, mesh.OnClick, evt_params);
         }
      }
      
      return false;
   }

   // ListenEventCreateAndAdd(parent_events = null) {

   //    const mesh = this;

   //    if (!mesh.listeners)
   //       return; // Return if there are no listen events to add
   //    // alert('228867 \nMust CreateListenEvent() first for dropdown mesh:.', mesh.GetName);
   //    if (parent_events === null)
   //       alert('228868 \nParent event must be a valid event index.', mesh.GetName);




   //    for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

   //       if ((mesh.state.mask & MESH_STATE.ACTIVE) === 0x0) return; // Skip the dropdownn and button if are inactive 

   //       const etype = Listen_event_types_get_type_from_index(etypeidx);

   //       /***********************************************************************************************************************/
   //       // Create for dropdown button
   //       const dp_evt = mesh.listeners.buffer[etypeidx];
   //       if (dp_evt !== null) { // If event for tis mesh is null, don't do anything

   //          // For Hover events we need no callback and params
   //          if (etype & LISTEN_EVENT_TYPES.HOVER) {
   //             mesh.AddListenEvent(etypeidx, null, null);
   //          }
   //          else if (etype & LISTEN_EVENT_TYPES.CLICK_UP | LISTEN_EVENT_TYPES.MOVE) {

   //             const evt_params = { target_mesh: mesh, };
   //             mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, null);
   //          }

   //          if (parent_events[etypeidx] === INT_NULL || parent_events[etypeidx] === null && mesh.listeners.buffer[etypeidx] !== INT_NULL) { // Find parent event

   //             const parent_event_idx = Find_parent_listen_event(etypeidx, mesh);

   //             if (parent_event_idx === INT_NULL) alert('7182994 \nFailed to find any parent event in mesh tree');
   //             else Listener_assign_parent_event(etypeidx, mesh.listeners.buffer[etypeidx], parent_event_idx);
   //          }
   //          else Listener_assign_parent_event(etypeidx, mesh.listeners.buffer[etypeidx], parent_events[etypeidx]);

   //       }
   //    }
   // }


   OnClick(params) {

      const mesh = params.evt_params.target_mesh;

      // Case the mesh has a chain callback function to call. (For now the button's chain callbacks are not chained)
      if (mesh.evt_params && mesh.evt_params.EventClbk) {

         // Create time interval to continuosly press the button
         if (mesh.StateCheck(MESH_STATE.IS_HOLD_CLICK)) {

            const EventClbk = mesh.evt_params.EventClbk;
            const target_params = mesh.evt_params.params.target_params
            const idx = TimeIntervalsCreate(16, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            STATE.mesh.SetClickHold(mesh);
         }
         else  {

            const EventClbk = mesh.evt_params.EventClbk;
            EventClbk(mesh.evt_params);
         }
      }
      if (params.evt_params && params.evt_params.EventClbk) {

         const EventClbk = params.evt_params.EventClbk;
         EventClbk(params.evt_params);
      }
      else { // Fallback to label OnClick() wich has Move and Resize functionality
         super.OnClick(params);
      }

   }


   RemoveTimeInterval(idx) {
      const intervalIdx = this.timeIntervalsIdxBuffer.buffer[idx];
      if(intervalIdx===-1){
         console.error('intervalIdx', intervalIdx, 'this.timeIntervalsIdxBuffer.buffer', this.timeIntervalsIdxBuffer.buffer)
         alert('417772839 \nIssue with timeInterval\nPossible error: We overloaded the time intervals buffer\nThe buffer currently holds up to two intervals\nINTERVALS.UPDATE and INTERVALS.MOVE\nTry to dissable mesh Move event')
      }
      TimeIntervalsDestroyByIdx(intervalIdx);
      this.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(idx);
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   Bind(EventClbk = null, targetBindingFunctions = _, params, click_flags) {

      if (!EventClbk) { EventClbk = Button_click_default_callback; params = 'Button'; }

      this.evt_params = { // Create the parameters to pass for the button's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };

      if (click_flags) this.state.mask |= click_flags;

   }
}



/** DO NOT DELETE - WIDGET SWITCH - With text on/off */
export class Widget_Switch extends Widget_Button {

   // isOn;
   // state_text;
   // evt_params;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text_on, text_off, pos, fontsize = 5, col = GREY[1], text_col = WHITE, pad = [fontsize, fontsize], bold, style = [3, 6, 2], font, is_debug_mesh) {

      // super(text_off, (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), pos, fontsize, col, text_col, pad, bold, style, font)
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text_off, _, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh)

      this.isOn = 0x0;
      this.state_text = [text_off, text_on];
      this.evt_params = null;

      this.type |= MESH_TYPE.WIDGET_BUTTON;
      this.SetName('Switch');

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   SetGfxEnableAttributes(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgetSwitch')
   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/
   // ConstructListeners(parent_listeners = null) {

   //    const mesh = this; // If in recursion, use as the current mesh the passed param. 

   //    for (let i = 0; i <= mesh.listeners.boundary; i++) {

   //       if (mesh.listeners.buffer[i]) { // If there is an event to be created

   //          if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
   //             parent_listeners = [null, null];
   //             parent_listeners[i] = Find_parent_listen_event(i, mesh);
   //          }
   //          else if (parent_listeners[i] === null) {
   //             parent_listeners[i] = Find_parent_listen_event(i, mesh);
   //          }

   //          mesh.AddListenEvent(i, mesh.OnClick, mesh.evt_params, parent_listeners[i]);
   //       }
   //    }
   // }


   // AddListeners() {

   //    const mesh = this; // If in recursion, use as the current mesh the passed param. 
   //    if (!mesh.listeners) alert('228866 \nMuste CreateListenEvent() first for mesh:.', mesh.GetName);

   //    for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

   //       const evt = mesh.listeners.buffer[etypeidx];
   //       if (evt) { // If event is not null
   //          const evt_params = {
   //             EventClbk: null,
   //             targetBindingFunctions: null,
   //             target_mesh: mesh,
   //             params: null,
   //          }
   //          mesh.AddListenEvent(etypeidx, mesh.OnClick, mesh.evt_params, null);
   //       }
   //    }
   // }

   OnClick(params) {

      const mesh = params.evt_params.target_mesh;
      const text_mesh = mesh.text_mesh;

      mesh.isOn ^= 0x1;
      text_mesh.RenderTextFromString(mesh.state_text[mesh.isOn]);
      mesh.SetUpdateFrameBuffer();
      STATE.mesh.SetClicked(mesh);

      /**
       * For popup menu options and slider connections.
       * If the option is clicked, then we must call the slider connect function
       */

      if (params.evt_params.EventClbk) {

         const EventClbk = params.evt_params.EventClbk;
         EventClbk(params.evt_params);
      }

      console.log('CLICKED')
      return true;
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   Bind(EventClbk = null, targetBindingFunctions = _, params, click_flags) {

      if (!EventClbk) { EventClbk = Button_click_default_callback; params = 'Button'; }

      // this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.evt_params = { // Create the parameters to pass for the button's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };

      if (click_flags) this.state.mask |= click_flags;

   }

}


function Button_click_default_callback(params) {
   console.log(params, ' Clicked!');
}



