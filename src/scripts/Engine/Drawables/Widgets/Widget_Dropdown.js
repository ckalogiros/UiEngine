"use strict";

import { New_generic_buffer } from "../../Core/Buffers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate } from "../../Timers/TimeIntervals.js";
import { Listener_assign_parent_event } from "../../Events/EventListeners.js";
import { AddArr2, CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Create_widget_button, Create_widget_section } from "../../Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx, Widget_root_add_mesh, Widget_root_buffer_get_root_meshidx, Widget_root_is_widget_root, Widget_root_set_in_focus, Widget_root_set_uniform_callback_per_gfx_root_mesh } from "../../Core/MeshBuffer.js";
import { Clipy_from_group, Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { Calculate_sizes_recursive, Expand, Section, Section_on_move_clbk } from "../Meshes/Section.js";
import { GREY, PURPLER, WHITE } from "../Material/Base/Colors.js";
import { View_add_to_group, View_remove_from_group, View_render_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/MeshBufferViews.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";
import { Relative_pos_comp_recalc_all } from "../Operations/RelativePosComponent.js";
import {  Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { TEMP_Scroller_calc_handle } from "./WidgetScroller.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";





















/**
 * We keep all root-dropdown widgets of the App in a buffer of this file's compilation unit.
 * The reason being not to store a reference pointer of the root in the  dropdown, 
 * rather an index to a buffer of all root-dropdowns. (?Does it worthh it?)
 */
let _root_dropdown = New_generic_buffer(_, 'Widget Dropdown roots');

export function Dropdown_roots_set_root(root, dropdown) {
   dropdown.rootidx = _root_dropdown.Add(root);
   return dropdown.rootidx;
}



function Dropdown_roots_get_root_by_idx(rootidx) {
   const root = _root_dropdown.buffer[rootidx];
   return root;
}



function Dropdown_roots_destroy_byidx(rootidx, caller_mesh_bufferidx) {
   // Destroy only if the caller dropdown is the root
   if (caller_mesh_bufferidx === _root_dropdown.buffer[rootidx].mesh_bufferidx)
      _root_dropdown.RemoveByIdx(rootidx);
}



/**Debug-Print */
export function Dropdown_roots_print_root_buffer() {
   for (let i = 0; i <= _root_dropdown.boundary; i++) {
      console.log('id:', _root_dropdown.buffer[i].mesh_bufferidx, ' name:', _root_dropdown.buffer[i].GetName(), ' pos:', _root_dropdown.buffer[i].geom.pos);
   }
}



























const tr = 1.5;
const _font_size = 7.5;

export class Widget_Dropdown extends Section {

   isOn; // Bool for checking a dropdown's menu expanded/contructed.
   menu_active; // H to preserve the 'expanded' state, even if the current dp is deactivated by a parent dp. 
   menu; // SEE ## Dropdown Menu 
   rootidx; // Store the root's dropdown index (of the '_root_dropdown');
   dp_symbols; // Text symbols for denoting a dropdown's Expanded/contracted menu. // TODO: Add textured symbols OR create a font texture with symbols for dropdown expansion/contraction.


   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, pos, col1 = GREY[3], col_menu = PURPLER[7], text_col = WHITE, 
               btn_pad = [3, 3], bold = .6, font = TEXTURES.MSDF_CONSOLAS_1024, style = [2, 5, 2], pad = [10, 10], is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, SECTION.VERTICAL, pad, pos, [10, 10], col1, _, style, _, is_debug_mesh);

      // NOTE: The mesh_bufferidx and the root_bufferidx as the root creation, happen in the Section from super(). 

      AddArr2(this.total_margin, pad);
      this.StylesSetPad(pad);
      this.isOn = DP_MENU_STATE.OFF;
      this.type |= MESH_TYPE.WIDGET_DROP_DOWN;
      this.type &= ~MESH_TYPE.SECTION_MESH_ONLY;
      this.rootidx = INT_NULL;

      pos[2] += 1;
      this.menu = Create_widget_section(_, SECTION.VERTICAL, pad, [0, 0, pos[2]], [1, 1], TRANSPARENCY(col_menu, tr), _, _, is_debug_mesh);
      this.menu.type |= MESH_TYPE.DROP_DOWN_MENU;
      this.menu.parent = this;
      AddArr2(this.menu.total_margin, this.menu.StylesGetPad());
      AddArr2(this.menu.total_margin, this.StylesGetPad());
      this.menu.state.mask &= ~MESH_STATE.ACTIVE;

      this.dp_symbols = ['+', '-'];
      const btn = Create_widget_button(_, `${this.dp_symbols[0]} ${text}`, (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, this.menu.geom.pos[2] + 1], _font_size, col_menu, text_col, btn_pad, bold, style, font, is_debug_mesh);
      // const btn = Create_widget_button(_, `${this.dp_symbols[0]} ${text}`, (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, this.menu.geom.pos[2] + 1], _font_size, TRANSPARENCY(col_menu, .1), WHITE, btn_pad, bold, style, font, is_debug_mesh);
      // AddArr2(btn.total_margin, this.menu.total_margin);
      btn.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;

      this.AddItem(btn);

      this.menu_active = false;

      btn.SetName(`Dp_Btn[${btn.mesh_bufferidx}]{${text}}`);
      this.menu.SetName(`Dp_Menu[${this.menu.mesh_bufferidx}]{${text}}`);
      this.SetName(`Dropdown[${this.mesh_bufferidx}]{${text}}`);



   }




   

   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      this.children.buffer[0].Activate(); // Button
      if(this.isOn & DP_MENU_STATE.ON){
         this.menu.Activate(); // Button
      }
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      this.children.buffer[0].Deactivate(); // Button
      if(this.isOn & DP_MENU_STATE.ON){
         this.menu.Deactivate(); // Button
      }
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
      this.children.buffer[0].StateEnable(MASK); // Button
      if (this.isOn & DP_MENU_STATE.ON) {
         this.menu.StateEnable(MASK); // Active Menu
      }
   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
      this.children.buffer[0].StateDisable(MASK); // Button
      if (this.isOn & DP_MENU_STATE.ON) {
         this.menu.StateDisable(MASK); // Active Menu
      }
   }


   SetTypeDebug() {

      this.type |= MESH_TYPE.DEBUG_MESH;

      this.children.buffer[0].SetTypeDebug();

      this.menu.type |= MESH_TYPE.DEBUG_MESH;
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   Destroy() {

      const btn = this.children.buffer[0];
      btn.Destroy();

      this.menu.Destroy();

      Dropdown_roots_destroy_byidx(this.rootidx);

      return super.Destroy();

   }
   
   
   AddToWidgetRootBuffer(root_bufferidx) {
      
      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
      
      const btn = this.children.buffer[0];
      btn.AddToWidgetRootBuffer(root_bufferidx);
      
      this.menu.AddToWidgetRootBuffer(root_bufferidx);
   }
   

   SetGfxEnableAttributes(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgetDropdown')
   }

   AddToMenu(mesh) {

      // NOTE: If the dp is Root, it has been set to widget root buffer from super. If not, there is no purpose of doing anything to the dp.
      // NOTE: The dp's button is inserted to the widget root buffer by the constructor:  'this.AddItem(btn)'

      if ((this.isOn & DP_MENU_STATE.ON) === 0) {
         mesh.StateDisable(MESH_STATE.ACTIVE)
      }


      if (mesh.type & MESH_TYPE.WIDGET_DROP_DOWN) {

         if (this.rootidx === INT_NULL) {

            /* IMPORTANT!!! 
             * With the current implementation we must add dropdown widgets to dropdown menus as items 
             * in the order of the tree representation. That means each dropdown that adds another dropdown must
             * already been added to a higher order in the tree dropdown, so that it has the 'rootidx' index.
             * ALL DROPDOWNS THAT ARE PART OF THE TREE STRUCT HAVE ONE ROOT DROPDOWN WIDGET 
             */
            // Also store to the root dropdown a rootidx of its self
            this.rootidx = Dropdown_roots_set_root(this, mesh);
         }
         else {
            mesh.rootidx = this.rootidx;
         }
      }


      if (this.root_bufferidx !== INT_NULL && this.menu.root_bufferidx === INT_NULL) {

         this.menu.root_bufferidx = this.root_bufferidx;
         Widget_root_add_mesh(this.menu.root_bufferidx, this.menu.mesh_bufferidx);
      }

      mesh.idx = this.menu.AddItem(mesh);

      // this.SetMenuItemsZindex(); // EFFICIENCY: It runs for all children al over again every time a new item is added

   }



   OptionsEnable(MASK=0x0){

      this.options |= MASK;
      this.menu.options |= MASK;
      for(let i=0; i <= this.menu.children.boundary; i++){
      
         const child = this.menu.children.buffer[i];
         if(child && child.options) child.OptionsEnable(MASK);
      }
   }

   
   // GfxCtxSetFlag(FLAGS){
   //    alert('-1 DROPDOWN')
   // }



   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   /** If FLAG===PRIVATE, then we get the gfx of the parent. If no parent exists, then the Gfx_generate_context creates new gfx. */
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx=INT_NULL) {

      if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      const btn = this.children.buffer[0];
      btn.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, this.gfx.vb.groupidx); // Set button's area gfx same with dropDown mesh 

      this.menu.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, this.gfx.vb.groupidx)
      if (this.group_bufferidxs[0] !== INT_NULL) console.error('TRUE:', this.GetName())

      return this.gfx;
   }


   Render() {

      super.AddToGfx();

      const btn = this.children.buffer[0];
      btn.Render();

      if (this.isOn & DP_MENU_STATE.ON) {
         for (let i = 0; i <= this.children.boundary; i++) {
            if(this.children.buffer[i]) this.children.buffer[i].Render();
         }
      }

   }


   Rerender() {

      super.AddToGfxFromReset();

      const btn = this.children.buffer[0];
      btn.Rerender();

      if (this.isOn & DP_MENU_STATE.ON) {
         this.menu.Rerender();
      }

   }






   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   // ConstructListeners(parent_listeners = null) {



   //    /*****************************************************************************************************************/
   //    // Create Listen Events for the dropdown
   //    if (this.listeners) {

   //       for (let i = 0; i <= this.listeners.boundary; i++) {

   //          if (this.listeners.buffer[i] !== null) {

   //             if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
   //                parent_listeners = [null, null];
   //             }

   //             // if (parent_listeners[i] !== null && parent_listeners[i] !== INT_NULL) {
   //             if (parent_listeners[i] === null || parent_listeners[i] === INT_NULL) {
   //                parent_listeners[i] = Find_parent_listen_event(i, this);
   //             }

   //             // If FAKE or HOVER, pass null params and null callback
   //             if (this.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {
                  
   //                // if(this.options & SECTION.INDEPENDENT){
   //                //    this.AddListenEvent(i, null, null, null);
   //                // }
   //                // else 
   //                   this.AddListenEvent(i, null, null, parent_listeners[i]);
   //             }
   //             else { // Else construct the params
   //                const params = {
   //                   EventClbk: null, targetBindingFunctions: null,
   //                   target_mesh: this, params: null,
   //                }
                  
   //                // if(this.options & SECTION.INDEPENDENT){
   //                //    this.AddListenEvent(i, super.OnClick, params, null);
   //                // }
   //                // else 
   //                this.AddListenEvent(i, super.OnClick, params, parent_listeners[i]);
   //             }
   //          }
   //       }
   //    }

   //    /*****************************************************************************************************************/
   //    // Create Listen Events for the button
   //    const btn = this.children.buffer[0];
   //    for (let i = 0; i <= btn.listeners.boundary; i++) {

   //       if (btn.listeners.buffer[i] !== null) {


   //          // Case there is a dropdown listener for dropdown, then make certain the button listener is a child
   //          if (this.listeners !== null && this.listeners.buffer[i] !== null && this.listeners.buffer[i] !== INT_NULL) {

   //             parent_listeners[i] = this.listeners.buffer[i];
   //          }
   //          else {

   //             if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
   //                parent_listeners = [null, null];
   //             }

   //             if (parent_listeners[i] === null || parent_listeners[i] === INT_NULL) {
   //                parent_listeners[i] = Find_parent_listen_event(i, btn);
   //             }
   //          }


   //          if (btn.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {

   //             btn.AddListenEvent(i, null, null, parent_listeners[i]);
   //          }
   //          else { // Else construct the params

   //             const params = { // Build the parameters for the OnClick callback function (menu expansion).
   //                drop_down: this,
   //                menu: this.menu,
   //             }

   //             // CAUTION: We run for i:Hover and click, but the callback is always 'this.OnClick'. For Hover callback, check the event type and pass the apropriate callback.
   //             btn.AddListenEvent(i, this.OnClick, params, parent_listeners[i]);
   //          }
   //       }
   //    }

   //    /*****************************************************************************************************************/
   //    // Create Listen Events for the menu and its items
   //    if (this.isOn & DP_MENU_STATE.ON) {
   //       this.ConstructListenersForMenuItems()
   //    }

   // }


   ConstructListenersForMenuItems() { // Handle the dropdown's menu listen events creation. (if any of the items has listen events)

      const dp = this;
      const menu = this.menu;

      for (let i = 0; i <= menu.children.boundary; i++) {

         const item = menu.children.buffer[i];

         // TEST: Remove the if(item!==null) case
         if(item === null || item === undefined) alert('55143326 \nItem is null, do not remove the check');


         item.ListenEventCreateAndAdd(dp.listeners.buffer);
         
         // If the item is a dropdown, run this function recursive 
         if(item.type & MESH_TYPE.WIDGET_DROP_DOWN) {
            item.ConstructListenersForMenuItems();
         }
      }
   }

   // TEMP_RECURSIVE(mesh, parent){

   //    for (let i = 0; i <= mesh.children.boundary; i++) {

   //       const child = mesh.children.buffer[i];
   //       console.log(child.GetName())
   //       child.ListenEventCreateAndAdd(parent.listeners.buffer);

   //       if(child.children.active_count) TEMP_RECURSIVE(child, );
   //    }
   // }
   
   
   // AddListeners() {

   //    const dp = this; // If in recursion, use as the current mesh the passed param. 
   //    if(!dp.listeners) 
   //       alert('228866 \nMust CreateListenEvent() first for dropdown mesh:.', dp.GetName);

   //    for (let etypeidx = 0; etypeidx <= dp.listeners.boundary; etypeidx++) {

   //       const evt = dp.listeners.buffer[etypeidx];
   //       if (evt !== null) { // If event is not null
   //          const evt_params = {
   //             EventClbk: null,
   //             targetBindingFunctions: null,
   //             target_mesh: dp,
   //             params: null,
   //          }
   //          dp.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
   //          const btn = this.children.buffer[0];
   //          btn.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
   //       }
   //    }
   // }

   ListenEventCreate(etype){

      const etypeidx = Listen_event_get_idx_from_type(etype);
      const dp = this;

      // For Hover events we need no callback and params
      if(etype & LISTEN_EVENT_TYPES.HOVER){

         dp.CreateListenEvent(etype);
         if(dp.state.mask & MESH_STATE.ACTIVE) dp.AddListenEvent(etypeidx, null, null);
         const btn = dp.children.buffer[0];
         btn.CreateListenEvent(etype);
         if(btn.state.mask & MESH_STATE.ACTIVE) btn.AddListenEvent(etypeidx, null, null);
      }
      else if(etype & LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.MOVE){
         
         const evt_params = { target_mesh: dp, };
         dp.CreateListenEvent(etype);
         if(dp.state.mask & MESH_STATE.ACTIVE) dp.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
         const btn = dp.children.buffer[0];
         btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
         if(btn.state.mask & MESH_STATE.ACTIVE) btn.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
      }

   }


   /**
    * This function creates events for meshes that are created at run time.
    * So it must create the listen events and also assign the parent event.
    * It gets a little complicated because it must find an apropriate parent event,
    * for each event type is independend from any other event type.
    * For instance, the click event may have a different parent event than the hover event of the same mesh. 
    */
   ListenEventCreateAndAdd(parent_events=null){

      const dp = this; 
      const btn = dp.children.buffer[0];

      if(!dp.listeners) 
         return; // Return if there are no listen events to add
         // alert('228867 \nMust CreateListenEvent() first for dropdown mesh:.', dp.GetName);
      if(parent_events === null) 
         alert('228868 \nParent event must be a valid event index.', dp.GetName);
      
      


      for (let etypeidx = 0; etypeidx <= dp.listeners.boundary; etypeidx++) {
         
         if((dp.state.mask & MESH_STATE.ACTIVE)===0x0) return; // Skip the dropdownn and button if are inactive 

         const etype = Listen_event_types_get_type_from_index(etypeidx);
         
         /***********************************************************************************************************************/
         // Create for dropdown button
         const dp_evt = dp.listeners.buffer[etypeidx];
         if (dp_evt !== null) { // If event for tis dp is null, don't do anything

            // For Hover events we need no callback and params
            if(etype & LISTEN_EVENT_TYPES.HOVER){
               dp.AddListenEvent(etypeidx, null, null);
            }
            else if(etype & LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.MOVE){
               
               const evt_params = { target_mesh: dp, };
               dp.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
            }

            // // It may be the case that the dp is not ACTIVE, so the .addListenEvent() will not add any event and the 'dp.listeners.buffer[etypeidx]' will be INT_NULL
            // if(dp.listeners.buffer[etypeidx] === INT_NULL) return; // Skip the dropdownn and the 
            
            if(parent_events[etypeidx] === INT_NULL || parent_events[etypeidx] === null && dp.listeners.buffer[etypeidx] !== INT_NULL){ // Find parent event
               
               const parent_event_idx = Find_parent_listen_event(etypeidx, dp);
               
               if(parent_event_idx === INT_NULL) alert('7182994 \nFailed to find any parent event in mesh tree');
               else Listener_assign_parent_event(etypeidx, dp.listeners.buffer[etypeidx], parent_event_idx);
            }
            else Listener_assign_parent_event(etypeidx, dp.listeners.buffer[etypeidx], parent_events[etypeidx]);

         }

         /***********************************************************************************************************************/
         // Create for dropdown button
         const btn_evt = btn.listeners.buffer[etypeidx];
         if (btn_evt !== null) { // If event for tis dp is null, don't do anything

            // For Hover events we need no callback and params
            if(etype & LISTEN_EVENT_TYPES.HOVER){
               btn.AddListenEvent(etypeidx, null, null);
            }
            else if(etype & LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.MOVE){
               
               const evt_params = { target_mesh: dp, };
               btn.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
            }
            
            
            if(dp.listeners.buffer[etypeidx] === null){ // If the dropdow doesn't have a hover event, we must find from the mesh tree

               const parent_event_idx = Find_parent_listen_event(etypeidx, dp);
               if(parent_event_idx === INT_NULL) alert('7182994 \nFailed to find any parent event in mesh tree');
               else Listener_assign_parent_event(etypeidx, btn.listeners.buffer[etypeidx], parent_event_idx); 
            }
            else Listener_assign_parent_event(etypeidx, btn.listeners.buffer[etypeidx], dp.listeners.buffer[etypeidx]);

         }
      }
   }
   // ListenEventCreateAndAdd(parent_events=null){

   //    const dp = this; // If in recursion, use as the current mesh the passed param. 
   //    if(!dp.listeners) 
   //       return; // Return if there are no listen events to add
   //       // alert('228867 \nMust CreateListenEvent() first for dropdown mesh:.', dp.GetName);
   //    if(parent_events === null) 
   //       alert('228868 \nParent event must be a valid event index.', dp.GetName);
      
   //    for (let etypeidx = 0; etypeidx <= dp.listeners.boundary; etypeidx++) {
         
   //       const etype = Listen_event_types_get_type_from_index(etypeidx);
   //       const evt = dp.listeners.buffer[etypeidx];
         
   //       if (evt !== null) { // If event is not null

   //          // For Hover events we need no callback and params
   //          if(etype & LISTEN_EVENT_TYPES.HOVER){
      
   //             // dp.CreateListenEvent(etype);
   //             dp.AddListenEvent(etypeidx, null, null);
   //             if(parent_events[etypeidx] === INT_NULL || parent_events[etypeidx] === null){ // Find parent event
                  
   //                const parent_event_idx = Find_parent_listen_event(etypeidx, dp);
                  
   //                if(parent_event_idx === INT_NULL) alert('7182994 \nFailed to find any parent event in mesh tree');
   //                else {
   //                   Listener_assign_parent_event(etypeidx, dp.listeners.buffer[etypeidx], parent_event_idx);
   //                }
   //             }
   //             else Listener_assign_parent_event(etypeidx, dp.listeners.buffer[etypeidx], parent_events[etypeidx]);
               
   //             const btn = dp.children.buffer[0];
   //             if(btn.listeners.buffer[etypeidx] !== null){ // Create hover event for button only if the user has set for hover event
                  
   //                // btn.CreateListenEvent(etype);
   //                btn.AddListenEvent(etypeidx, null, null);
                  
   //                if(dp.listeners.buffer[etypeidx] === null){ // If the dropdow doesn't have a hover event, we must find from the mesh tree

   //                   const parent_event_idx = Find_parent_listen_event(etypeidx, dp);
   //                   if(parent_event_idx === INT_NULL) alert('7182994 \nFailed to find any parent event in mesh tree');
   //                   else {
   //                      Listener_assign_parent_event(etypeidx, btn.listeners.buffer[etypeidx], parent_event_idx);
   //                   }
                     
   //                }
   //                else Listener_assign_parent_event(etypeidx, btn.listeners.buffer[etypeidx], dp.listeners.buffer[etypeidx]);
   //             }
   //          }
   //          else if(etype & LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.MOVE){
               
   //             const evt_params = { target_mesh: dp, };
               
   //             dp.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
   //             Listener_assign_parent_event(etypeidx, dp.listeners.buffer[etypeidx], parent_events[etypeidx])
      
   //             const btn = dp.children.buffer[0];
   //             btn.AddListenEvent(etypeidx, dp.OnClick, evt_params, null);
   //             Listener_assign_parent_event(etypeidx, btn.listeners.buffer[etypeidx], dp.listeners.buffer[etypeidx])
   //          }
   //       }
   //    }
   // }


   
   // SEE: ## OnClick()
   OnClick(params) {

      const dp = params.evt_params.target_mesh;

      /*DEBUG*/if (!params.evt_params) { console.error('Target_params.params is null, in a OnClick() event. evt_params:', params.evt_params); return; }
      /*DEBUG*/if (dp.rootidx === INT_NULL) { alert('Root for dropdown must be set. ', dp.GetName()); return; }

      const btn = dp.children.buffer[0];
      // Dropdown_roots_get_root_by_idx(dp.rootidx);

      // Check if the button is clicked
      if(params.meshidx === btn.mesh_bufferidx){

   
         if (dp.isOn & DP_MENU_STATE.OFF) { // Case: Activate Menu 
   
            dp.DpActivateMenu();
   
            btn.text_mesh.UpdateTextCharacter(dp.dp_symbols[1], 0); // Update the symbol text.
            dp.isOn = DP_MENU_STATE.ON;
   
         }
         else {  // Case: Deactivete Menu 
   
            btn.text_mesh.UpdateTextCharacter(dp.dp_symbols[0], 0);
   
            /* Need to update the symbol of the text(not only the gfx buffers), 
               because when the btn will be activated it will be re-inserted in the gfx buffers 
               and it will use the text_mesh's  string (wich is currently the '-' synmbol). */
            btn.text_mesh.SliceText(0, 1);
            btn.text_mesh.SetTextAtIndex(dp.dp_symbols[1], 0);
   
            dp.DpDeactivateMenu();
   
            dp.isOn |= DP_MENU_STATE.OFF;
         }

         STATE.mesh.SetClicked(btn);
         STATE.mesh.SetFocused(dp);
      }

      // Else the click happened anywhere in dropdown except the button area
      else if(dp.state.mask & MESH_STATE.IS_MOVABLE) { // Create move timeInterval if the dp has the move flag

         dp.OnMove({params:dp});
      }

      return true;
   }


   // SEE ### OnMove Events Implementation Logic
   OnMove(params) {

      const dp = params.params;

      /** Create Move event.
       * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
       * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
       */
      const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, Section_on_move_clbk, dp);
      dp.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

      if (dp.StateCheck(MESH_STATE.IS_GRABABLE)) {

         STATE.mesh.SetGrabed(dp);
         STATE.mesh.SetFocused(dp);
         Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: dp })
         dp.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
         Widget_root_set_in_focus(dp.root_bufferidx);
      }

   }








   /*******************************************************************************************************************************************************/
   // Events Handling
   /*******************************************************************************************************************************************************/

   CreateHoverEvent() {
      // const btn = this.children.buffer[0];
      // btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   }


   CreateClickEvent() {
      // If the 'click' event hasn't been activated by another call to 'CreateListenEvent' for this dp, 
      // create FAKE click event, if dp is root (direct child of scene),
      // else let the Construct listeners decide the parent event listener for dp's button
      if (this.listeners && this.listeners.buffer[E.C]===null && Widget_root_is_widget_root(this.root_bufferidx, this.mesh_bufferidx)) {
         this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
      }
      this.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      const btn = this.children.buffer[0];
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   }


   CreateMoveEvent() {
      this.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   }





   /*******************************************************************************************************************************************************/
   // Setters_Getters
   /*******************************************************************************************************************************************************/

   SetPosXYNoGfxUpdate(x, y) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;

         const btn = this.children.buffer[0];
         btn.SetPosXYNoGfxUpdate(x, y);
      }
   }

   // TEMP_TO_RECALC_FOR_DP_MENU(){
   //    Expand(this, this.options)
   //    temp_dp_calc_sizes(this, _, this.options & SECTION.INDEPENDENT);

         
   //    this.geom.dim[0] = this.max_size[0] + this.StylesGetPad(STYLES.AXIS.X);
   //    this.geom.dim[1] = this.max_size[1] + this.StylesGetPad(STYLES.AXIS.Y);
      

   //    const cur_pos = [0,0];
   //    cur_pos[0] = this.geom.pos[0]; 
   //    cur_pos[1] = this.geom.pos[1]; 

   //    // Calculate_positions_no_gfx_update_recursive(this, this.options, cur_pos, _);
   //    tu(this, this.options, cur_pos, _, _, this.options & SECTION.INDEPENDENT);
   // }

   TEMP_recalc(x, y) {

      const btn = this.children.buffer[0];

      const dx = btn.geom.pos[0] - this.geom.pos[0];
      const dy = btn.geom.pos[1] - this.geom.pos[1];

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;

      const pad = this.StylesGetPad();
      btn.TEMP_recalc(x + dx + pad[0], y + dy + pad[1]);

      // if(this.isOn & DP_MENU_STATE.ON){
      //    // HACK
      //    this.menu.TEMP_TO_RECALC_FOR_DP_MENU();
      // }
   }


   TEMP_recalc_x(x) {

      const btn = this.children.buffer[0];
      this.geom.pos[0] = x;

      // TODO: Conceptualize how to implement the code below that will reflect a broader context.

      const pad = this.StylesGetPad();
      const xp = x + pad[0];
      const yp = this.geom.pos[1] + pad[1]*2;
      const dx = btn.text_mesh.geom.pos[0]-btn.geom.pos[0];
      const dy = btn.text_mesh.geom.pos[1]-btn.geom.pos[1];
      btn.geom.pos[0] = xp;
      btn.geom.pos[1] = yp;
      btn.text_mesh.geom.pos[0] = xp+dx;
      btn.text_mesh.geom.pos[1] = yp+dy;

      if(this.isOn & DP_MENU_STATE.ON){
         // HACK
         this.menu.geom.pos[0] = this.geom.pos[0] + pad[0];
         this.menu.geom.pos[1] = this.geom.pos[1] + this.geom.dim[1]*2
         this.menu.Recalc_no_gfx_update();
      }
   }


   SetType(type_flag) {

      this.type |= type_flag;
      const btn = this.children.buffer[0];
      btn.type |= type_flag;
      btn.text_mesh.type |= type_flag;

   }


   SetText(text) {
      const btn = this.children.buffer[0];
      btn.text_mesh.RenderTextFromString(text);
   }


   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
      const btn = this.children.buffer[0];
      btn.SetIsGfxInserted(flag);
   }


   /** Must run for every mesh */
   GfxUniformsEnable(flags, name, type, shader_flags) {

      super.EnableGfxUniforms(flags, name, type, shader_flags);

      const btn = this.children.buffer[0];
      btn.GfxUniformsEnable(flags, name, type, shader_flags);
      
      this.menu.GfxUniformsEnable(flags, name, type, shader_flags);
      
   }

  
   GfxUniformsSetClbk(unif_name, Clbk, clbk_params){

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);

      if(unif_name === 'u_wposxy'){

         // Call for each root mesh in every vertex buffer
         const root_meshes = Widget_root_set_uniform_callback_per_gfx_root_mesh(this.root_bufferidx, unif_name, Clbk, clbk_params);
         const len = root_meshes.length;
         for(let i=1; i < len; i++){
      
            const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshes[i]);
            root_mesh.SetClbkGfxUniforms(unif_name, Clbk, root_mesh.root_posidx);
      
         }
      }

   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/
   




   // Reset and rebuild vertex buffers x
   #DeactivateMenu(dp = null) {

      if (!dp) dp = this;
      this.menu_active = false; // Set state to active.

      const menu = dp.menu;

      if (dp.isOn & DP_MENU_STATE.ON) {
         for (let j = 0; j <= menu.children.boundary; j++) {

            const item = menu.children.buffer[j]; 

            if(item){

               // If the menu's item mesh is of type dropdown, run recursively to deactivate mesh's menu.
               if (item.type & MESH_TYPE.WIDGET_DROP_DOWN && item.is_gfx_inserted) {
   
                  item.RemoveFromMeshPerVbBuffer();
                  item.Deactivate();
                  item.SetIsGfxInserted(false);
   
                  console.log(item.GetName())
                  item.RemoveAllListenEvents();
                  
                  
                  if (item.isOn & DP_MENU_STATE.ON) this.#DeactivateMenu(item); // Run recursive for every dropdown in every menu
               }
               else {
                  if (item.gfx && item.is_gfx_inserted) {
                     
                     item.RemoveFromMeshPerVbBuffer();
                     item.Deactivate();
                     item.SetIsGfxInserted(false);
                     
                     console.log(item.GetName())
                     
                     item.RemoveAllListenEvents();
                  }
               }
            }
         }

         if (menu.gfx && menu.is_gfx_inserted) {

            menu.state.mask &= ~MESH_STATE.ACTIVE;

            // Mesh_per_vb_remove_mesh(menu.gfx.vb.groupidx, menu.per_vb_bufferidx);
            menu.RemoveFromMeshPerVbBuffer();

            // Widget_group_update_decrement(root.group_bufferidxs, menu.geom.num_faces, menu);
            menu.is_gfx_inserted = false;
            // Remove menu's Fake listen events
            // menu.RemoveAllListenEvents();
         }
      }

      dp.isOn |= DP_MENU_STATE.OFF;
      dp.isOn &= ~DP_MENU_STATE.ON;

   }


   DpDeactivateMenu() {

      const menu = this.menu;
      const root = Dropdown_roots_get_root_by_idx(this.rootidx);

      // Reset vertex buffers from group
      View_reset_from_view_all_buffers(root.group_bufferidxs[0]);

      // Remove menu and all its items from the group view
      if (menu.group_bufferidxs[0] !== INT_NULL) {
         View_remove_from_group(menu);
      }

      // this.DpDestroyListeners(menu);
      this.#DeactivateMenu();
      this.RemoveChildByIdx(menu.idx); // Rememove menu from drop down

      const widget_root_meshidx = Widget_root_buffer_get_root_meshidx(this.root_bufferidx);
      const widget_root = Mesh_buffer_get_mesh_byidx(widget_root_meshidx)
      // { // New Implementation: Run for all meshes
         
      //    if (widget_root.options & SECTION.FIXED_W) widget_root.max_size[0] = widget_root.geom.dim[0];
      //    if (widget_root.options & SECTION.FIXED_H) widget_root.max_size[1] = widget_root.geom.dim[1];

      //    Calculate_sizes_recursive(widget_root, widget_root.options, );


      //    if (widget_root.type & MESH_TYPE.WIDGET_DROP_DOWN) {
      //       CopyArr2(widget_root.geom.dim, widget_root.max_size); // Set size for the root dp.
      //       CopyArr2(widget_root.geom.defDim, widget_root.max_size); // Store to default for the root.
      //    }
      //    else {
      //       if (widget_root.options & SECTION.RESIZE_PARENT) CopyArr2(widget_root.geom.dim, widget_root.max_size); // Set size for the root.
      //       else {
      //          if (widget_root.options & SECTION.RESIZE_PARENTX) widget_root.geom.dim[0] = widget_root.max_size[0];
      //          if (widget_root.options & SECTION.RESIZE_PARENTY) widget_root.geom.dim[1] = widget_root.max_size[1];
      //       }
      //    }

      //    widget_root.SectionSetPad();
      // }
      { // New Implementation: Run for all meshes
         
         if (root.options & SECTION.FIXED_W) root.max_size[0] = root.geom.dim[0];
         if (root.options & SECTION.FIXED_H) root.max_size[1] = root.geom.dim[1];

         // Calculate_sizes_recursive(root, root.options, );
         Calculate_sizes_recursive(widget_root, root.options, );


         if (root.type & MESH_TYPE.WIDGET_DROP_DOWN) {
            CopyArr2(root.geom.dim, root.max_size); // Set size for the root dp.
            CopyArr2(root.geom.defDim, root.max_size); // Store to default for the root.
         }
         else {
            if (root.options & SECTION.RESIZE_PARENT) CopyArr2(root.geom.dim, root.max_size); // Set size for the root.
            else {
               if (root.options & SECTION.RESIZE_PARENTX) root.geom.dim[0] = root.max_size[0];
               if (root.options & SECTION.RESIZE_PARENTY) root.geom.dim[1] = root.max_size[1];
            }
         }

         root.SectionSetPad();
      }
      

      { // Old Implementation: Run for clicked and set the parents in a loop

         // temp_dp_calc_sizes(widget_root, _, widget_root.options & SECTION.INDEPENDENT);
         // temp_dp_calc_sizes(this, _, this.options & SECTION.INDEPENDENT);
   
   
         // this.geom.dim[0] = this.max_size[0] + this.StylesGetPad(STYLES.AXIS.X);
         // this.geom.dim[1] = this.max_size[1] + this.StylesGetPad(STYLES.AXIS.Y);
      }



      const cur_pos = [0,0];
      cur_pos[0] = this.geom.pos[0]; 
      cur_pos[1] = this.geom.pos[1]; 
      tu(this, this.options, cur_pos, _, _, this.options & SECTION.INDEPENDENT);
      // tu(root, this.options, root.geom.pos, _, _, root.options & SECTION.INDEPENDENT);

      // Calculate_positions_no_gfx_update_recursive(widget_root, widget_root.options, widget_root.geom.pos);



      { // Clipping

         // // Get the group root mesh to Recalc position/dimentions 
         // const group_rootidx = View_get_view_vb_root_meshidx(this.group_bufferidxs);
         // const group_root_mesh = Mesh_buffer_get_mesh_byidx(group_rootidx)
         // let clip_top = null, clip_bottom = null;
         // if (group_root_mesh.parent) {
   
         //    clip_top = group_root_mesh.parent.GetPosY();
         //    clip_bottom = clip_top + group_root_mesh.parent.geom.dim[1]*2;
         //    // clip_right = group_root_mesh.parent.geom.pos[0] + group_root_mesh.parent.geom.dim[0] - 20;
         // }
         // else {
         //    clip_top = group_root_mesh.GetPosY();
         //    clip_bottom = clip_top + group_root_mesh.geom.dim[1]*2;
         // }
   
         // // If we do not use the clip from group, which runs for all meshes in the group(SLOW), then we do not un-clip any meshes after this dp
         // Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
         // // Clipy_from_tree_recursive(group_root_mesh, clip_top, clip_bottom);
         // // Clampx_from_group(root.group_bufferidxs[0], 0, clip_right);
   
   
         // // View_rerender_from_view_all_buffers(root.group_bufferidxs[0], false);
      }
      
      
      
      
      // HACK: We want to update the handles size and pos after dp activation
      const root_meshidx = Widget_root_buffer_get_root_meshidx(this.root_bufferidx)
      const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshidx)
      if(root_mesh.type & MESH_TYPE.WIDGET_SCROLLER) TEMP_Scroller_calc_handle(root_mesh)
         
      // View_render_from_view_all_buffers(widget_root.group_bufferidxs[0], false);
      View_render_from_view_all_buffers(root.group_bufferidxs[0], false);
   }


   #ActivateMenu(root) {
      // TODO: SEE ### Dropdown Remove
      // Must remove listener

      const menu = this.menu;
      this.menu_active = true; // Set state to active.

      menu.state.mask |= MESH_STATE.ACTIVE;

      // Activate menu's items, recursively
      for (let i = 0; i <= menu.children.boundary; i++) {

         const item = menu.children.buffer[i];

         if(item){

            item.Activate();
            if (item.type & MESH_TYPE.WIDGET_DROP_DOWN) { // Case item is another dropdown
   
               // if (item.isOn & DP_MENU_STATE.ON) { // Case the item dropdown has an 'active' menu, activate the item's menu (runs recursive for any opened sub menus). 
               if (item.menu_active) { // Case the item dropdown has an 'active' menu, activate the item's menu (runs recursive for any opened sub menus). 
   
                  // If the menu was deactivated while open, then on activation keep its '-' symbol
                  const btn = item.children.buffer[0];
                  btn.text_mesh.SliceText(0, 1);
                  btn.text_mesh.SetTextAtIndex(this.dp_symbols[1], 0);
                  item.#ActivateMenu(root);
               }
            }
         }
      }

      this.isOn |= DP_MENU_STATE.ON;
      this.isOn &= ~DP_MENU_STATE.OFF;

   }


   DpActivateMenu() {

      const menu = this.menu;
      const root = Dropdown_roots_get_root_by_idx(this.rootidx);


      this.isOn |= DP_MENU_STATE.ON;
      this.isOn &= ~DP_MENU_STATE.OFF;


      this.AddItem(menu); // Add the menu, which is a storage of Widget_Dropdown only, as a child to the drop_down

      // Case its the first time this menu will be rendered
      if (menu.group_bufferidxs[0] === INT_NULL && this.group_bufferidxs[0] !== INT_NULL) {
         View_add_to_group(menu, this.group_bufferidxs[0])
      }

      View_reset_from_view_all_buffers(root.group_bufferidxs[0]);
      // Mesh_per_vb_remove_all_from_index(root.gfx.vb.groupidx, root.per_vb_bufferidx);

      
      this.#ActivateMenu(root); // Add dropdown to gfx buffers.
      menu.SetFrameBufferIdx(this.isFramebufferRendered); // To update any framebuffer (if exists)
      
      
      // this.Calc_no_gfx_update();
      
      const widget_root_meshidx = Widget_root_buffer_get_root_meshidx(this.root_bufferidx);
      const widget_root = Mesh_buffer_get_mesh_byidx(widget_root_meshidx)
            
      // Expand(this, this.options)
      // Expand(widget_root, widget_root.options)

      // {
         
      //    if (widget_root.options & SECTION.FIXED_W) widget_root.max_size[0] = widget_root.geom.dim[0];
      //    if (widget_root.options & SECTION.FIXED_H) widget_root.max_size[1] = widget_root.geom.dim[1];

      //    Calculate_sizes_recursive(widget_root, widget_root.options, );


      //    if (widget_root.type & MESH_TYPE.WIDGET_DROP_DOWN) {
      //       CopyArr2(widget_root.geom.dim, widget_root.max_size); // Set size for the root dp.
      //       CopyArr2(widget_root.geom.defDim, widget_root.max_size); // Store to default for the root.
      //    }
      //    else {
      //       if (widget_root.options & SECTION.RESIZE_PARENT) CopyArr2(widget_root.geom.dim, widget_root.max_size); // Set size for the root.
      //       else {
      //          if (widget_root.options & SECTION.RESIZE_PARENTX) widget_root.geom.dim[0] = widget_root.max_size[0];
      //          if (widget_root.options & SECTION.RESIZE_PARENTY) widget_root.geom.dim[1] = widget_root.max_size[1];
      //       }
      //    }

      //    widget_root.SectionSetPad();
      // }
      { // Calculate all meshes sizes from the root widget dropdown
         
         if (root.options & SECTION.FIXED_W) root.max_size[0] = root.geom.dim[0];
         if (root.options & SECTION.FIXED_H) root.max_size[1] = root.geom.dim[1];

         // root.max_size[0] = 0;
         // root.max_size[1] = 0;


         
         // Calculate_sizes_recursive(root, root.options, );
         Calculate_sizes_recursive(widget_root, root.options, );


         if (root.type & MESH_TYPE.WIDGET_DROP_DOWN) {
            CopyArr2(root.geom.dim, root.max_size); // Set size for the root dp.
            CopyArr2(root.geom.defDim, root.max_size); // Store to default for the root.
         }
         else {
            if (root.options & SECTION.RESIZE_PARENT) CopyArr2(root.geom.dim, root.max_size); // Set size for the root.
            else {
               if (root.options & SECTION.RESIZE_PARENTX) root.geom.dim[0] = root.max_size[0];
               if (root.options & SECTION.RESIZE_PARENTY) root.geom.dim[1] = root.max_size[1];
            }
         }

         root.SectionSetPad();
      }

      
      // // temp_dp_calc_sizes(this, _, this.options & SECTION.INDEPENDENT);
      // temp_dp_calc_sizes(root, _, root.options & SECTION.INDEPENDENT);
      // // temp_dp_calc_sizes(widget_root, _, widget_root.options & SECTION.INDEPENDENT);
      // Calculate_sizes_recursive(widget_root, widget_root.options & SECTION.INDEPENDENT);
      // // Calculate_sizes_recursive(root, root.options & SECTION.INDEPENDENT);
      // widget_root.geom.dim[0] = widget_root.max_size[0] + widget_root.StylesGetPad(STYLES.AXIS.X);
      // widget_root.geom.dim[1] = widget_root.max_size[1] + widget_root.StylesGetPad(STYLES.AXIS.Y);
      
               
      // this.geom.dim[0] = this.max_size[0] + this.StylesGetPad(STYLES.AXIS.X);
      // this.geom.dim[1] = this.max_size[1] + this.StylesGetPad(STYLES.AXIS.Y);


      

      const cur_pos = [0,0];
      cur_pos[0] = this.geom.pos[0]; 
      cur_pos[1] = this.geom.pos[1]; 

      // // Calculate_positions_no_gfx_update_recursive(this, this.options, cur_pos, _);
      tu(this, this.options, cur_pos, _, _, this.options & SECTION.INDEPENDENT);
      // tu(root, this.options, root.geom.pos, _, _, root.options & SECTION.INDEPENDENT);
      // // tu(widget_root, widget_root.options, cur_pos, _, _, root.options & SECTION.INDEPENDENT);
      
      // Calculate_positions_no_gfx_update_recursive(this, this.options, this.geom.pos);
      // Calculate_positions_no_gfx_update_recursive(root, root.options, root.geom.pos);
      // Calculate_positions_no_gfx_update_recursive(widget_root, widget_root.options, widget_root.geom.pos);



      // widget_root.Recalc_no_gfx_update(this.options & SECTION.INDEPENDENT)
      // root.Recalc_no_gfx_update(this.options & SECTION.INDEPENDENT)
      // this.Recalc_no_gfx_update(this.options & SECTION.INDEPENDENT)


      { // Clipping

         // if((this.options & SECTION.INDEPENDENT)===0){
   
         //    // Get the group root mesh to Recalc position/dimentions 
         //    const group_rootidx = View_get_view_vb_root_meshidx(this.group_bufferidxs);
         //    const group_root_mesh = Mesh_buffer_get_mesh_byidx(group_rootidx)
         //    let clip_top = null, clip_bottom = null;
         //    if (group_root_mesh.parent) {
      
         //       clip_top = group_root_mesh.parent.GetPosY();
         //       clip_bottom = clip_top + group_root_mesh.parent.geom.dim[1]*2;
         //       // clip_right = group_root_mesh.parent.geom.pos[0] + group_root_mesh.parent.geom.dim[0] - 20;
         //    }
         //    else {
         //       clip_top = group_root_mesh.GetPosY();
         //       clip_bottom = clip_top + group_root_mesh.geom.dim[1]*2;
         //    }
   
         //    Clipy_from_group(group_root_mesh.group_bufferidxs[0], clip_top, clip_bottom);
   
            
         //    // Clipy_from_tree_recursive(group_root_mesh, clip_top, clip_bottom);
         //    // Clampx_from_group(root.group_bufferidxs[0], 0, clip_right);
            
         //    // // Clip from the tree recursive, if this dp has 'INDEPENDENT' flag, else clip from the whole group
         //    // if(this.options & SECTION.INDEPENDENT){
         //    //    Clipy_from_tree_recursive(root, clip_top, clip_bottom);
         //    // }
         //    // else{
         //       //    Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
         //       // }
               
               
         // }
      }
         
         /**
          * HERE
          * Follow the implementation of dropdown  listeners.
          * 1. The user creates event on dp creation
          * 2. Who calls the .AddListeners?
          * 3. Who calls Construct_listeners_relations()?
          * 4. What about the complication of the different TYPE of events?? 
          * 5. Also we have listeners=null, listeners.buffer[i]=null, listeners.buffer[i]=INT_NULL
          */
      this.ConstructListenersForMenuItems(); // Create listeners, as children of menu listeners.
      // Construct_listeners_relations(menu)

      // HACK: We want to update the handles size and pos after dp activation
      const root_meshidx = Widget_root_buffer_get_root_meshidx(this.root_bufferidx)
      const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshidx)
      if(root_mesh.type & MESH_TYPE.WIDGET_SCROLLER) TEMP_Scroller_calc_handle(root_mesh)



      // FIXME: For the first time a menu is rendered must call Render() and not Re-render in order to create the vb starts for each mesh
      // View_rerender_from_view_all_buffers(root.group_bufferidxs[0], false);
      // View_render_from_view_all_buffers(widget_root.group_bufferidxs[0], false);
      View_render_from_view_all_buffers(root.group_bufferidxs[0], false);

   }
}



function temp_dp_calc_sizes(dp, target_child_idx=0, is_independed=0x0){


   // Calculate sizes bottom-up the tree with this 'dp' being the root...  
   const dif = Calculate_sizes_recursive(dp, dp.options, target_child_idx);

   const dim = dp.geom.dim
   const max = dp.max_size;
   let prev_max = [max[0], max[1]];
   const pad = [0,0];
   

   // ... And then go up the tree, from this 'dp' to the actual root, to add the dimention difference that was calculated erlier.
   // NOTE: This is done so that we skip calculating all children from the root. Instead we calculate from this dp and all its children , and we propagate the size difference up to any 'Section' parents.   
   let p = dp.parent;
   while(p){

      const meshpad = p.StylesGetPad();
      pad[0] += meshpad[0];
      pad[1] += meshpad[1];
      console.log(
         'dim', p.geom.dim[1],
         'max_size', p.max_size[1],
         'dif', dif[1],
         'name', p.GetName(),
      )
      
      // if(p && (p.type & MESH_TYPE.SECTION_MESH)){
      if(p){
         if(p.type & MESH_TYPE.SECTION_MESH){

            if(p.type & MESH_TYPE.WIDGET_SCROLLER || p.type & MESH_TYPE.WIDGET_MENU_BAR || p.type & MESH_TYPE.WIDGET_WINDOW) {
               console.log('BREAK', p.GetName())
               break;
            }
   
            if(p.options & SECTION.VERTICAL){
   
               if(dif[0] > POSSITIVE && p.geom.dim[0] <= prev_max[0]){
                  // console.log(p.GetName(), 'max_size', p.max_size[0], 'dimx', p.geom.dim[0])
                  p.geom.dim[0] += dif[0];
                  p.max_size[0] = p.geom.dim[0];
   
               }
               // else if(dif[0] < POSSITIVE && p.geom.dim[0] > prev_max[0]){
               else if(dif[0] < POSSITIVE){
                  // console.log(p.GetName(), 'max_size', p.max_size[0], 'dimx', p.geom.dim[0])
                  if(p.type & MESH_TYPE.WIDGET_DROP_DOWN){

                     const ms = Dp_menu_get_max_size_from_siblings(p)
                     if(p.geom.dim[0] > ms[0]){
      
                        p.geom.dim[0] += dif[0];
                        p.max_size[0] = p.geom.dim[0];
      
                        // p.geom.dim[1] -= pad[1];
                     }
                  }
   
               }
               else{
                  console.log('{{{{{}}}}}', p.geom.dim[0], 'clicked max', dp.max_size[0])
               }
               
   
               p.geom.dim[1] += dif[1];
               p.max_size[1] = p.geom.dim[1];
            }
            else if(p.options & SECTION.HORIZONTAL){
   
               p.geom.dim[1] += dif[1] + pad[1];
               p.max_size[1] = p.geom.dim[1];
               if(p.geom.dim[1] < p.min_size[1]){
                  
                  p.geom.dim[1] = p.min_size[1] + pad[1];
                  p.max_size[1] = p.geom.dim[1];
               }
   
               p.geom.dim[1] += dif[1] + pad[1];
               p.max_size[1] = p.geom.dim[1];
            }
   
            prev_max[0] = p.max_size[0];
            prev_max[1] = p.max_size[1];
         }
         
         
         p = p.parent
      }
   }

   
   dp.geom.dim[0] -= dif[0]
   dp.max_size[0] -= dif[0]

   console.log('---------------------------------------')
}
/** */
// function temp_dp_calc_sizes(dp, target_child_idx=0, is_independed=0x0){
//    const parent = dp.parent;
//    // Calculate sizes bottom-up the tree with this 'dp' being the root...  
//    const dif = Calculate_sizes_recursive(dp, dp.options, target_child_idx);
   
//    const dim = dp.geom.dim
//    const max = dp.max_size;
//    const pad = [0,0];
   

//    // ... And then go up the tree, from this 'dp' to the actual root, to add the dimention difference that was calculated erlier.
//    // NOTE: This is done so that we skip calculating all children from the root. Instead we calculate from this dp and all its children , and we propagate the size difference up to any 'Section' parents.   
//    let p = parent;
//    while(p){

//       const meshpad = p.StylesGetPad();
//       pad[0] += meshpad[0];
//       // pad[1] += meshpad[1];

      
//       if(p && (p.type & MESH_TYPE.SECTION_MESH)){
         
         
         
//          if(p.type & MESH_TYPE.WIDGET_SCROLLER || p.type & MESH_TYPE.WIDGET_MENU_BAR || p.type & MESH_TYPE.WIDGET_WINDOW) {
//             // console.log(p.GetName())
//             break;
//          }

//          if(p.options & SECTION.VERTICAL){

//             if(dif[0] > POSSITIVE && p.geom.dim[0] < max[0]){
//                // console.log(p.GetName(), 'max_size', p.max_size[0], 'dimx', p.geom.dim[0])

//                // const a = dim[0] + pad[0];
//                const a = dim[0];
//                const b = p.geom.dim[0] - a;
//                // p.geom.dim[0] += (dif[0] - b)+ pad[0];
//                p.geom.dim[0] += dif[0];
//                p.max_size[0] = p.geom.dim[0];
//             }
//             // else if(dif[0] < POSSITIVE && p.geom.dim[0] > max[0]){
//             else if(dif[0] < POSSITIVE && p.geom.dim[0] > max[0]){
//                // console.log(p.GetName(), 'max_size', p.max_size[0], 'dimx', p.geom.dim[0])

//                const a = dim[0] + pad[0];
//                const b = p.geom.dim[0] - a;
//                // p.geom.dim[0] += (dif[0] - b);
//                // p.geom.dim[0] += dif[0]+(pad[0]-meshpad[0]);
//                p.geom.dim[0] += dif[0];
//                p.max_size[0] = p.geom.dim[0];

//             }
            
//             // This is so that the outer sections will not be reduced less than the current dp 
//             if(p.geom.dim[0] < p.min_size[0]){
               
//                p.geom.dim[0] = p.min_size[0] + pad[0];
//                p.max_size[0] = p.geom.dim[0];
//             }

//             p.geom.dim[1] += dif[1] + pad[1];
//             p.max_size[1] = p.geom.dim[1];
//          }
//          else if(p.options & SECTION.HORIZONTAL){

//             p.geom.dim[1] += dif[1] + pad[1];
//             p.max_size[1] = p.geom.dim[1];
//             if(p.geom.dim[1] < p.min_size[1]){
               
//                p.geom.dim[1] = p.min_size[1] + pad[1];
//                p.max_size[1] = p.geom.dim[1];
//             }

//             p.geom.dim[1] += dif[1] + pad[1];
//             p.max_size[1] = p.geom.dim[1];
//          }
//          p = p.parent
//       }
//    }

// }


function Dp_menu_get_max_size_from_siblings(parent){

   console.log('- parent', parent.geom.dim[0], 'max', parent.max_size[0], parent.GetName())
   let max_size = [0, 0];
   for (let i=0; i <= parent.children.boundary; i++){
      const sib = parent.children.buffer[i];
      console.log('---- sibling', sib.geom.dim[0], 'max', max_size[0], sib.GetName())
      const pad = sib.StylesGetPad()
      if(max_size[0] <= sib.geom.dim[0]+pad[0]*2){
         max_size[0] = sib.geom.dim[0] + pad[0]*2;
      // if(max_size[0] <= sib.geom.dim[0]+pad[0]){
      //    max_size[0] = sib.geom.dim[0] + pad[0];
         console.log('SET MAX SIZE', max_size[0])
      }
      else if(sib.max_size===_){console.log('Has no max_size', sib.GetName())}
      // if(sib.max_size && max_size[0] < sib.geom.dim[0]){
      //    max_size[0] = sib.geom.dim[0];
      // }
   }

   // This is with max_size instead of .geom.dim
   // for (let i=0; i <= parent.children.boundary; i++){
   //    const sib = parent.children.buffer[i];
   //    console.log('---- sibling', sib.geom.dim[0], 'sib max', 'max', max_size[0], sib.GetName())
   //    const pad = sib.StylesGetPad()
   //    if(sib.max_size && max_size[0] <= sib.max_size[0]+pad[0]*2){
   //       max_size[0] = sib.max_size[0] + pad[0]*2;
   //       console.log('SET MAX SIZE', max_size[0])
   //    }
   //    else if(sib.max_size===_){console.log('Has no max_size', sib.GetName())}
   // }

   return max_size;
}



export function TEMP_DP_STEAL_THE_DP_RECALC(dp){
   
   Expand(dp, dp.options)
   temp_dp_calc_sizes(dp, _, dp.options & SECTION.INDEPENDENT);

      
   dp.geom.dim[0] = dp.max_size[0] + dp.StylesGetPad(STYLES.AXIS.X);
   dp.geom.dim[1] = dp.max_size[1] + dp.StylesGetPad(STYLES.AXIS.Y);
   

   const cur_pos = [0,0];
   cur_pos[0] = dp.geom.pos[0]; 
   cur_pos[1] = dp.geom.pos[1]; 
   tu(dp, dp.options, cur_pos, _, _, dp.options & SECTION.INDEPENDENT);
}

function tu(dp, options, curr, target_child_idx, is_for_build, is_independed=0x0){

   Temp_dp_calculate_positions(dp, options, curr, target_child_idx, is_for_build);
   
   const parent = dp.parent;

   if(parent && (parent.type & MESH_TYPE.WIDGET_SCROLLER)===0){
      
      const continue_recur = (is_independed & (parent.options & SECTION.INDEPENDENT)) ? true 
      : ((is_independed===0x0 && (parent.options & SECTION.INDEPENDENT)===0) ? true : false);

      if(parent.options & SECTION.VERTICAL) {
         curr[0] = parent.geom.pos[0];
         curr[1] = dp.geom.pos[1] + dp.geom.dim[1]*2;
      }
      else if(parent.options & SECTION.HORIZONTAL) {
         curr[0] = dp.geom.pos[0] + dp.geom.dim[0]*2;
         curr[1] = dp.geom.pos[1];
      }

      if(continue_recur)
         tu(parent, options, curr, dp.idx+1, true, (parent.options & SECTION.INDEPENDENT));
   }

}


/**SAVE-SIMPLE REPOSITION ONLY FOR DP-DP_MENU-BUTTON */
// function Temp_dp_calculate_positions(parent, options, curr, target_child_idx, is_for_build=false) {

   
//    const cur_pos = [
//       curr[0] + parent.StylesGetPad(STYLES.AXIS.X), 
//       is_for_build ? curr[1] : curr[1] + parent.StylesGetPad(STYLES.AXIS.Y), // 'is_for_build=true' don't add the pad on repositioning alredy buld dropdowns  
//    ];

   
//    const pad = [0, 0]
   
//    const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;

//    if(target_idx > parent.children.boundary) return

//    for (let i = target_idx; i <= parent.children.boundary; i++) {
      
//       const mesh = parent.children.buffer[i];

//       if(mesh){

//          let continue_recur = true;
//          let opt = options
   
//          // console.log('  RecalcPos', mesh.GetName())
   
//          if (options & SECTION.INHERIT) opt = parent.options
         
//          const padd = [0,0,];
//          if(padd){
//             pad[0] += padd[0];
//             pad[1] += padd[1];
//          }
   
//          const rel_pos = [cur_pos[0], cur_pos[1]];

//          mesh.geom.pos[0] = rel_pos[0]; 
//          mesh.geom.pos[1] = rel_pos[1];
   
//          if (continue_recur) { // Continue recursively, if the mesh does not handle any its children.
//             Temp_dp_calculate_positions(mesh, opt, cur_pos, _, _);
//          }
   
   
//          // Increment current position tracker
//          if (parent.options & SECTION.VERTICAL) {
//             cur_pos[1] += mesh.geom.dim[1] * 2;
//             parent.last_pos[1] = cur_pos[1];
//          }
//          else if (parent.options & SECTION.HORIZONTAL) {
//             cur_pos[0] += mesh.geom.dim[0] * 2;
//             parent.last_pos[0] = cur_pos[0];
//          }
//       }

//    }

// }
/** */
function Temp_dp_calculate_positions(parent, options, curr, target_child_idx, is_for_build=false) {

   
   const cur_pos = [
      curr[0] + parent.StylesGetPad(STYLES.AXIS.X), 
      is_for_build ? curr[1] : curr[1] + parent.StylesGetPad(STYLES.AXIS.Y), // 'is_for_build=true' don't add the pad on repositioning alredy buld dropdowns  
   ];
   // const cur_pos = [
   //    curr[0] + parent.StylesGetMargin(STYLES.AXIS.X), 
   //    curr[1] + parent.StylesGetMargin(STYLES.AXIS.Y), // 'is_for_build=true' don't add the pad on repositioning alredy buld dropdowns  
   // ];

   
   const pad = [0, 0]
   
   const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;

   if(target_idx > parent.children.boundary) return

   for (let i = target_idx; i <= parent.children.boundary; i++) {
      
      const mesh = parent.children.buffer[i];

      if(mesh){

         let continue_recur = true;
         let opt = options
   
         // console.log('  RecalcPos', mesh.GetName())
   
         if (options & SECTION.INHERIT) opt = parent.options
         
         // const padd = mesh.StylesGetPad();
         const padd = [0,0,];
         if(padd){
            pad[0] += padd[0];
            pad[1] += padd[1];
         }
   
         const rel_pos = [cur_pos[0], cur_pos[1]];
         
         if(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC){
            
            mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);
            continue_recur = false;
         }
         else if(mesh.type & MESH_TYPE.WIDGET_SLIDER){
   
            // mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);
            mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
            continue_recur = false;
         }
         else if (mesh.type & MESH_TYPE.WIDGET_SCROLLER) {
            
            // mesh.geom.pos[0] = rel_pos[0]; 
            // mesh.geom.pos[1] = rel_pos[1];
            mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
            // mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);

            continue_recur = false;
         }
         else if (mesh.type & MESH_TYPE.SECTION_MESH) 
         { // For meshes with a parent of type Section
   
            mesh.geom.pos[0] = rel_pos[0]; 
            mesh.geom.pos[1] = rel_pos[1];
            
            // Case of menu bar, that has text directly as a child
            if(mesh.text_mesh){
               mesh.text_mesh.geom.pos[0] = rel_pos[0] + pad[0];
               mesh.text_mesh.geom.pos[1] = rel_pos[1] + pad[1];
            }
         }
         else{
   
            // mesh.TEMP_recalc(rel_pos[0] + pad[0], rel_pos[1] + pad[1]);
            mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
            // console.log(mesh.GetName())
   
            if(mesh.type & MESH_TYPE.WIDGET_SWITCH) continue_recur = false;
            if(mesh.text_mesh) continue_recur = false;
         }
   
   
         if(parent.rel_comp){
            Relative_pos_comp_recalc_all(parent);
            continue_recur = false;
         }
   
         if (continue_recur) { // Continue recursively, if the mesh does not handle any its children.
            Temp_dp_calculate_positions(mesh, opt, cur_pos, _, _);
            // console.log('   RecalcPos', mesh.GetName())
         }
   
   
         // Increment current position tracker
         if (parent.options & SECTION.VERTICAL) {
            cur_pos[1] += mesh.geom.dim[1] * 2;
            parent.last_pos[1] = cur_pos[1];
         }
         else if (parent.options & SECTION.HORIZONTAL) {
            cur_pos[0] += mesh.geom.dim[0] * 2;
            parent.last_pos[0] = cur_pos[0];
         }
      }

   }

}



/**SAVE */
// function tu(dp, options, curr, target_child_idx, is_for_build, is_independed=0x0){

//    // console.log(dp.GetName())
//    Temp_dp_calculate_positions(dp, options, curr, target_child_idx, is_for_build);
   
//    const parent = dp.parent;

   
//    if(parent && parent.children.active_count){
      
//       const continue_recur = (is_independed & (parent.options & SECTION.INDEPENDENT)) ? true 
//       : ((is_independed===0x0 && (parent.options & SECTION.INDEPENDENT)===0) ? true : false);

//       if(parent.options & SECTION.VERTICAL) {
//          curr[0] = parent.geom.pos[0];
//          curr[1] = dp.geom.pos[1] + dp.geom.dim[1]*2;
//       }

//       const has_scroller = (parent && parent.parent) ? (parent.parent.type & MESH_TYPE.WIDGET_SCROLLER) : 0;
//       // if(!has_scroller)tu(parent, options, curr, dp.idx+1, true);
//       if(continue_recur)
//          tu(parent, options, curr, dp.idx+1, true, (parent.options & SECTION.INDEPENDENT));
//    }

// }

// function Temp_dp_calculate_positions(parent, options, curr, target_child_idx, is_for_build=false) {

   
//    const cur_pos = [
//       curr[0] + parent.StylesGetMargin(STYLES.AXIS.X), 
//       is_for_build ? curr[1] : curr[1] + parent.StylesGetMargin(STYLES.AXIS.Y), // 'is_for_build=true' don't add the margin on repositioning alredy buld dropdowns  
//    ];

   
//    const pad = [0, 0]
   
//    const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;

//    if(target_idx > parent.children.boundary) return

//    for (let i = target_idx; i <= parent.children.boundary; i++) {
      
//       const mesh = parent.children.buffer[i];
//       let continue_recur = true;
//       let opt = options

//       console.log('  RecalcPos', mesh.GetName())

//       if (options & SECTION.INHERIT) opt = parent.options

//       const padd = mesh.StylesGetPad();
//       if(padd){
//          pad[0] += padd[0];
//          pad[1] += padd[1];
//       }
      
//       const rel_pos = [cur_pos[0], cur_pos[1]];
      
//       if(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC){
         
//          mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);
//          continue_recur = false;
//       }
//       else if(mesh.type & MESH_TYPE.WIDGET_SLIDER){

//          mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
//          continue_recur = false;
//       }
//       else if (mesh.type & MESH_TYPE.SECTION_MESH) 
//       { // For meshes with a parent of type Section

//          mesh.geom.pos[0] = rel_pos[0]; 
//          mesh.geom.pos[1] = rel_pos[1];
         
//          // Case of menu bar, that has text directly as a child
//          if(mesh.text_mesh){
//             mesh.text_mesh.geom.pos[0] = rel_pos[0] 
//             mesh.text_mesh.geom.pos[1] = rel_pos[1]
//          }
//       }
//       else{

//          mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);

//          if(mesh.type & MESH_TYPE.WIDGET_SWITCH) continue_recur = false;
//          if(mesh.text_mesh) continue_recur = false;
//       }


//       if(parent.rel_comp){
//          Relative_pos_comp_recalc_all(parent);
//          continue_recur = false;
//       }

//       if (continue_recur) { // Continue recursively, if the mesh does not handle any its children.
//          Temp_dp_calculate_positions(mesh, opt, cur_pos, _, _);
//          // console.log('   RecalcPos', mesh.GetName())
//       }


//       // Increment current position tracker
//       if (parent.options & SECTION.VERTICAL) {
//          cur_pos[1] += mesh.geom.dim[1] * 2;
//       }
//       else if (parent.options & SECTION.HORIZONTAL) {
//          cur_pos[0] += mesh.geom.dim[0] * 2;
//       }

//    }

// }


