"use strict";

import { GREY, WHITE } from '../Material/Base/Colors.js';
import { Widget_Label } from './WidgetLabel.js';



export class Widget_Button extends Widget_Label {

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, Align = (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), pos = [200, 300, 0], fontsize = 10, col = GREY[1], text_col = WHITE, pad = [10, 5], bold = .4, style = [0, 6, 2], font = TEXTURES.MSDF_CONSOLAS_1024, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, Align, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh)
      this.type |= MESH_TYPE.WIDGET_BUTTON;
      // this.SetName('Button');

      // Bind a default function for OnClick() event
      this.Bind(Button_click_default_callback, _, 'Default Button Binding Function')

      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   }

      /*******************************************************************************************************************************************************/
   // Events Handling

   OnClick(params) {

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


   /*******************************************************************************************************************************************************/
   // Misc
   Bind(EventClbk=null, targetBindingFunctions=_, params) {

      if(!EventClbk) { EventClbk = Button_click_default_callback; params = 'Button'; }
      
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.evt_params = { // Create the parameters to pass for the switch's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };
   }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
      const root_evt = root.listeners.buffer;

      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         const evt = mesh.listeners.buffer[etypeidx];
         if (evt) { 
            mesh.AddListenEvent(etypeidx, mesh.OnClick, this.evt_params, root_evt);
         }
      }
   }
}



/** DO NOT DELETE - WIDGET SWITCH - With text on/off */
export class Widget_Switch extends Widget_Button {

   isOn;
   state_text;
   evt_params;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text_on, text_off, pos, fontsize = 5, col = GREY[1], text_col = WHITE, pad = [fontsize, fontsize], bold, style = [3, 6, 2], font, is_debug_mesh) {

      // super(text_off, (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), pos, fontsize, col, text_col, pad, bold, style, font)
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text_off, (ALIGN.LEFT | ALIGN.BOTTOM), pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh)

      this.isOn = 0x0;
      this.state_text = [text_off, text_on];

      this.type |= MESH_TYPE.WIDGET_BUTTON;
      this.SetName('Switch');

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

   }


   /*******************************************************************************************************************************************************/
   // Events Handling

   OnClick(params) {

      const mesh = params.evt_params.target_mesh;
      const text_mesh = mesh.text_mesh;

      mesh.isOn ^= 0x1;
      text_mesh.RenderTextFromString(mesh.state_text[mesh.isOn]);
      mesh.SetUpdateFrameBuffer();
      STATE.mesh.SetClicked(mesh);
      // STATE.mesh.SetFocused(mesh);

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


   /*******************************************************************************************************************************************************/
   // Misc
   Bind(EventClbk=null, targetBindingFunctions=_, params) {

      if(!EventClbk) { EventClbk = Button_click_default_callback; params = 'Switch'; }
      
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.evt_params = { // Create the parameters to pass for the switch's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };
   }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
      const root_evt = root.listeners.buffer;

      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         const evt = mesh.listeners.buffer[etypeidx];
         if (evt) { 
            mesh.AddListenEvent(etypeidx, mesh.OnClick, this.evt_params, root_evt);
         }
      }
   }

}


function Button_click_default_callback(params){
   console.log(params, ' Clicked!');
}



