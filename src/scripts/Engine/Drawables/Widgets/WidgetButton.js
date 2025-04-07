"use strict";

import { _, INT_NULL } from '../../Global/EngineConstants.js';
import { Time_intervals_create, Time_intervals_destroy_byidx } from '../../Timers/TimeIntervals.js';
import { GREY, WHITE } from '../Material/Base/Colors.js';
import { Widget_Label } from './WidgetLabel.js';
import { Style_button_default_properties } from './WidgetReadyStyles.js';







export class Widget_Button extends Widget_Label {

   // constructor(mesh_bufferidx, is_root, text, Align, pos, fontsize, col, text_col, pad = [20, 15], bold = .4, style = {rcorners:6, feather:2, border:0}, font = TEXTURES.DEFAULT_FONT, is_debug_mesh) {
   constructor(mesh_bufferidx, properties) {

      super(mesh_bufferidx, properties);
      this.type |= MESH_TYPE.WIDGET_BUTTON;

   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   SetGfxEnable(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgeButton')
   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/


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


   OnClick(params) {

      const mesh = params.evt_params.target_mesh;

      // Case the mesh has a chain callback function to call. (For now the button's chain callbacks are not chained)
      if (mesh.evt_params && mesh.evt_params.EventClbk) {

         // Create time interval to continuosly press the button
         if (mesh.StateCheck(MESH_STATE.IS_HOLD_CLICK)) {

            const EventClbk = mesh.evt_params.EventClbk;
            const target_params = mesh.evt_params.params.target_params
            const idx = Time_intervals_create(16, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            STATE.mesh.SetClickHold(mesh);
         }
         else  {

            const EventClbk = mesh.evt_params.EventClbk;
            EventClbk(mesh.evt_params);
         }
      }
      else if (params.evt_params && params.evt_params.EventClbk) { // Is this neccessary, if the evt_params are in the mesh????

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
      Time_intervals_destroy_byidx(intervalIdx);
      this.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(idx);
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

      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

      // If there is a click event already created
   }
}



/** DO NOT DELETE - WIDGET SWITCH - With text on/off */
export class Widget_Switch extends Widget_Button {

   constructor(mesh_bufferidx, properties) {

      const max_text = properties.text_on.length > properties.text_off.length ? properties.text_on : properties.text_off;

      super(mesh_bufferidx, Style_button_default_properties({is_root:properties.is_root, text:max_text, align:properties.align, pos:properties.pos, col:properties.col, text_col:properties.text_col, text_pad:properties.text_pad, font_size:properties.font_size,  texture_id:properties.txture_id}))

      this.text_mesh.ReplaceText(properties.text_on);

      this.isOn = 0x0;
      this.state_text = [properties.text_off, properties.text_on];
      this.evt_params = null;

      this.type |= MESH_TYPE.WIDGET_BUTTON;
      this.SetName('Switch');

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

   }

   SetLayout(align_flags) {

      this.align.flags = align_flags;
   }
   
   AddLayout(align_flags) {
      
      tthis.align.flags |= align_flags;
   }




   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   SetGfxEnable(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgetSwitch')
   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/


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



