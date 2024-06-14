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
      this.Bind(Button_click_default_callback, _, 'Default Button Binding Function')

      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
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
   ConstructListeners(parent_listeners = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 

      for (let i = 0; i <= mesh.listeners.boundary; i++) {

         if (mesh.listeners.buffer[i]) { 

            if(parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
               parent_listeners = [null, null];
               parent_listeners[i] = Find_parent_listen_event(i, mesh);
            }
            else if(parent_listeners[i] === null){
               parent_listeners[i] = Find_parent_listen_event(i, mesh);
            }


            mesh.AddListenEvent(i, mesh.OnClick, mesh.evt_params, parent_listeners[i]);
         }
      }
   }

   

   OnClick(params) {

      const mesh = params.evt_params.target_mesh;

      // Run for buttons that are enabled to a continuous click
      if(mesh.StateCheck(MESH_STATE.IS_HOLD_CLICK)){

        if (params.evt_params && params.evt_params.EventClbk) {
           
         const EventClbk = params.evt_params.EventClbk;
         const target_params = params.evt_params.params.target_params
         const idx = TimeIntervalsCreate(16, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
         mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);
         
         STATE.mesh.SetClickHold(mesh)
      }

      }
      else { // Run for one click buttons

         /**
          * For popup menu options and slider connections.
          * If the option is clicked, then we must call the slider connect function
          */
         if (params.evt_params && params.evt_params.EventClbk) {
            
            const EventClbk = params.evt_params.EventClbk;
            EventClbk(params.evt_params);
         }
         else { // Fallback to label OnClick()
            super.OnClick(params);
         }
   
         
         // console.log('CLICKED')
         return true;
      }
   }


   RemoveTimeInterval(idx){
      const intervalIdx = this.timeIntervalsIdxBuffer.buffer[idx];
      TimeIntervalsDestroyByIdx(intervalIdx);
      this.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(idx);
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   Bind(EventClbk=null, targetBindingFunctions=_, params, click_flags) {

      if(!EventClbk) { EventClbk = Button_click_default_callback; params = 'Button'; }
      
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.evt_params = { // Create the parameters to pass for the button's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };

      if(click_flags) this.state.mask |= click_flags;

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
   ConstructListeners(parent_listeners = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 

      for (let i = 0; i <= mesh.listeners.boundary; i++) {

         if (mesh.listeners.buffer[i]) { // If there is an event to be created

            if(parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
               parent_listeners = [null, null];
               parent_listeners[i] = Find_parent_listen_event(i, mesh);
            }
            else if(parent_listeners[i] === null){
               parent_listeners[i] = Find_parent_listen_event(i, mesh);
            }
            
            mesh.AddListenEvent(i, mesh.OnClick, mesh.evt_params, parent_listeners[i]);
         }
      }
   }


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

   Bind(EventClbk=null, targetBindingFunctions=_, params, click_flags) {

      if(!EventClbk) { EventClbk = Button_click_default_callback; params = 'Button'; }
      
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.evt_params = { // Create the parameters to pass for the button's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };

      if(click_flags) this.state.mask |= click_flags;

   }

}


function Button_click_default_callback(params){
   console.log(params, ' Clicked!');
}



