"use strict";

import { MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../Core/Buffers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Listener_get_parent_event } from "../../Events/EventListeners.js";
import { AddArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Create_widget_button, Create_widget_section } from "../../Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx, Widget_root_add_mesh, Widget_root_buffer_get_byidx, Widget_root_buffer_get_root_meshidx, Widget_root_is_widget_root } from "../../Core/MeshBuffer.js";
import { Clipy_from_group, Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { Calculate_sizes_recursive, Expand, Section } from "../Meshes/Section.js";
import { GREY, PURPLER, WHITE } from "../Material/Base/Colors.js";
import { View_add_to_group, View_get_view_vb_root_meshidx, View_remove_from_group, View_render_from_view_all_buffers, View_rerender_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/MeshBufferViews.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";
import { Relative_pos_comp_recalc_all } from "../Operations/RelativePosComponent.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { TEMP_Scroller_calc_handle } from "./WidgetScroller.js";





















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


   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, pos, col1 = GREY[3], col_menu = PURPLER[7], text_col = WHITE, btn_pad = [3, 3], bold = .6, font = TEXTURES.MSDF_CONSOLAS_1024, style = [2, 5, 2], margin = [10, 10], is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, SECTION.VERTICAL, margin, pos, [10, 10], col1, _, style, _, is_debug_mesh);

      // NOTE: The mesh_bufferidx and the root_bufferidx as the root creation, happen in the Section from super(). 

      AddArr2(this.total_margin, margin);
      this.StylesSetMargin(margin);
      this.isOn = DP_MENU_STATE.OFF;
      this.type |= MESH_TYPE.WIDGET_DROP_DOWN;
      this.type &= ~MESH_TYPE.SECTION_MESH_ONLY;
      this.rootidx = INT_NULL;

      pos[2] += 1;
      // this.menu = Create_widget_section(_, SECTION.VERTICAL, margin, [OUT_OF_VIEW, OUT_OF_VIEW, pos[2]], [1, 1], TRANSPARENCY(col_menu, tr), _, _, is_debug_mesh);
      this.menu = Create_widget_section(_, SECTION.VERTICAL, margin, [0, 0, pos[2]], [1, 1], TRANSPARENCY(col_menu, tr), _, _, is_debug_mesh);
      this.menu.type |= MESH_TYPE.DROP_DOWN_MENU;
      this.menu.parent = this;
      AddArr2(this.menu.total_margin, this.menu.StylesGetMargin());
      AddArr2(this.menu.total_margin, this.StylesGetMargin());
      this.menu.state.mask &= ~MESH_STATE.ACTIVE;

      this.dp_symbols = ['+', '-'];
      const btn = Create_widget_button(_, `${this.dp_symbols[0]} ${text}`, (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, this.menu.geom.pos[2] + 1], _font_size, col_menu, text_col, btn_pad, bold, style, font, is_debug_mesh);
      // const btn = Create_widget_button(_, `${this.dp_symbols[0]} ${text}`, (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, this.menu.geom.pos[2] + 1], _font_size, TRANSPARENCY(col_menu, .1), WHITE, btn_pad, bold, style, font, is_debug_mesh);
      // AddArr2(btn.total_margin, this.menu.total_margin);
      btn.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;

      this.AddItem(btn);

      this.menu_active = false;

      btn.SetName(`[${btn.mesh_bufferidx}]{${text}}-BTN_DP`);
      this.menu.SetName(`[${this.menu.mesh_bufferidx}]{${text}}-MENU_DP`);
      this.SetName(`[${this.mesh_bufferidx}]{${text}}-DP`);



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

      // if(this.isOn & DP_MENU_STATE.OFF){
      if ((this.isOn & DP_MENU_STATE.ON) === 0) {
         // this.StateDisable(MESH_STATE.ACTIVE)
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
         if(child.options) child.OptionsEnable(MASK);
      }
   }




   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   /** If FLAG===PRIVATE, then we get the gfx of the parent. If no parent exists, then the Gfx_generate_context creates new gfx. */
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx=INT_NULL) {

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
            this.children.buffer[i].Render();
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

   ConstructListeners(parent_listeners = null) {



      /*****************************************************************************************************************/
      // Create Listen Events for the dropdown
      if (this.listeners) {

         for (let i = 0; i <= this.listeners.boundary; i++) {

            if (this.listeners.buffer[i] !== null) {

               if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
                  parent_listeners = [null, null];
               }

               // if (parent_listeners[i] !== null && parent_listeners[i] !== INT_NULL) {
               if (parent_listeners[i] === null || parent_listeners[i] === INT_NULL) {
                  parent_listeners[i] = Find_parent_listen_event(i, this);
               }

               // if(this.options & SECTION.INDEPENDENT){
               //    parent_listeners[i] = null
               // }
               
               // If FAKE or HOVER, pass null params and null callback
               if (this.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {
                  
                  // if(this.options & SECTION.INDEPENDENT){
                  //    this.AddListenEvent(i, null, null, null);
                  // }
                  // else 
                     this.AddListenEvent(i, null, null, parent_listeners[i]);
               }
               else { // Else construct the params
                  const params = {
                     EventClbk: null, targetBindingFunctions: null,
                     target_mesh: this, params: null,
                  }
                  
                  // if(this.options & SECTION.INDEPENDENT){
                  //    this.AddListenEvent(i, super.OnClick, params, null);
                  // }
                  // else 
                     this.AddListenEvent(i, super.OnClick, params, parent_listeners[i]);
               }
            }
         }
      }

      /*****************************************************************************************************************/
      // Create Listen Events for the button
      const btn = this.children.buffer[0];
      for (let i = 0; i <= btn.listeners.boundary; i++) {

         if (btn.listeners.buffer[i] !== null) {


            // Case there is a dropdown listener for dropdown, then make certain the button listener is a child
            if (this.listeners !== null && this.listeners.buffer[i] !== null && this.listeners.buffer[i] !== INT_NULL) {

               parent_listeners[i] = this.listeners.buffer[i];
            }
            else {

               if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
                  parent_listeners = [null, null];
               }

               if (parent_listeners[i] === null || parent_listeners[i] === INT_NULL) {
                  parent_listeners[i] = Find_parent_listen_event(i, btn);
               }
            }


            if (btn.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {

               btn.AddListenEvent(i, null, null, parent_listeners[i]);
            }
            else { // Else construct the params

               const params = { // Build the parameters for the OnClick callback function (menu expansion).
                  drop_down: this,
                  menu: this.menu,
               }

               // CAUTION: We run for i:Hover and click, but the callback is always 'this.OnClick'. For Hover callback, check the event type and pass the apropriate callback.
               btn.AddListenEvent(i, this.OnClick, params, parent_listeners[i]);
            }
         }
      }

      /*****************************************************************************************************************/
      // Create Listen Events for the menu and its items
      if (this.isOn & DP_MENU_STATE.ON) {
         this.ConstructListenersForMenu(this.menu)
      }

   }


   ConstructListenersForMenu(dp_menu) { // Handle the dropdown's menu listen events creation. (if any of the items has listen events)

      const menu = dp_menu;

      for (let i = 0; i <= menu.children.boundary; i++) {

         const item = menu.children.buffer[i];

         if(this.options & SECTION.INDEPENDENT) { 
            // item.ConstructListeners([INT_NULL, INT_NULL]);
            item.ConstructListeners([null, null]);
         }
         else{

            for (let j = 0; j <= LISTEN_EVENT_TYPES_INDEX.SIZE; j++) {
   
               // If no listeners, create Fake
               if (((menu.listeners === null || menu.listeners.buffer[j] === null) || menu.listeners.buffer[j] === INT_NULL)) {
   
                  menu.CreateListenEvent(Listen_event_types_get_type_from_index(j), FAKE_LISTEN_EVENT);
   
                  if (this.children.buffer[0].listeners.buffer[j] === null || this.children.buffer[0].listeners.buffer[j] === INT_NULL) {
                     const parent_event_idx = Find_parent_listen_event(j, menu)
                     menu.AddListenEvent(j, null, null, parent_event_idx);
                  }
                  else {
   
                     const parent_event_idx = Listener_get_parent_event(j, this.children.buffer[0].listeners.buffer[j]);
                     menu.AddListenEvent(j, null, null, parent_event_idx);
                  }
               }
            }
   
            // EFFICIENCY: Allocations happen in this function
            item.ConstructListeners([menu.listeners.buffer[0], menu.listeners.buffer[1]]);
         }
      }
   }
   

   // SEE: ## OnClick()
   OnClick(params) {

      const dp = params.evt_params.drop_down;

      /*DEBUG*/if (!params.evt_params) { console.error('Target_params.params is null, in a OnClick() event. evt_params:', params.evt_params); return; }
      /*DEBUG*/if (dp.rootidx === INT_NULL) { alert('Root for dropdown must be set. ', dp.GetName()); return; }

      const btn = dp.children.buffer[0];
      Dropdown_roots_get_root_by_idx(dp.rootidx);

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

      return true;
   }


   // SEE ### OnMove Events Implementation Logic
   OnMove(params) {

      /** The function is called by the timeInterval.
       *  The timeInterval has been set by the 'OnClick' event.
       */

      const mesh = params.params;

      // Destroy the time interval calling this function if the mesh is not grabed.
      if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         mesh.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

         return;
      }

      // Move the mesh
      const mouse_pos = MouseGetPosDif();
      mesh.Move(mouse_pos.x, -mouse_pos.y);

   }



   /*******************************************************************************************************************************************************/
   // Dropdown activation
   /*******************************************************************************************************************************************************/





   // Reset and rebuild vertex buffers x
   #DeactivateMenu(dp = null) {

      if (!dp) dp = this;
      this.menu_active = false; // Set state to active.

      const menu = dp.menu;

      if (dp.isOn & DP_MENU_STATE.ON) {
         for (let j = 0; j <= menu.children.boundary; j++) {

            const item = menu.children.buffer[j]; 


            // If the menu's item mesh is of type dropdown, run recursively to deactivate mesh's menu.
            if (item.type & MESH_TYPE.WIDGET_DROP_DOWN && item.is_gfx_inserted) {

               item.RemoveFromMeshPerVbBuffer();
               item.Deactivate();
               item.SetIsGfxInserted(false);

               item.RemoveAllListenEvents();
               
               
               if (item.isOn & DP_MENU_STATE.ON) this.#DeactivateMenu(item); // Run recursive for every dropdown in every menu
            }
            else {
               if (item.gfx && item.is_gfx_inserted) {
                  
                  item.RemoveFromMeshPerVbBuffer();
                  item.Deactivate();
                  item.SetIsGfxInserted(false);
                  
                  item.RemoveAllListenEvents();
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
            menu.RemoveAllListenEvents();
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

      // Calculate_sizes_recursive(parent, parent.options, dp.idx);
      temp_dp_calc_sizes(this, _, this.options & SECTION.INDEPENDENT);


      this.geom.dim[0] = this.max_size[0] + this.StylesGetMargin(STYLES.AXIS.X);
      this.geom.dim[1] = this.max_size[1] + this.StylesGetMargin(STYLES.AXIS.Y);

      const cur_pos = [0,0];
      cur_pos[0] = this.geom.pos[0]; 
      cur_pos[1] = this.geom.pos[1]; 
      tu(this, this.options, cur_pos, _, _, this.options & SECTION.INDEPENDENT);



      // Get the group root mesh to Recalc position/dimentions 
      const group_rootidx = View_get_view_vb_root_meshidx(this.group_bufferidxs);
      const group_root_mesh = Mesh_buffer_get_mesh_byidx(group_rootidx)
      let clip_top = null, clip_bottom = null;
      if (group_root_mesh.parent) {

         clip_top = group_root_mesh.parent.GetPosY();
         clip_bottom = clip_top + group_root_mesh.parent.geom.dim[1]*2;
         // clip_right = group_root_mesh.parent.geom.pos[0] + group_root_mesh.parent.geom.dim[0] - 20;
      }
      else {
         clip_top = group_root_mesh.GetPosY();
         clip_bottom = clip_top + group_root_mesh.geom.dim[1]*2;
      }

      // If we do not use the clip from group, which runs for all meshes in the group(SLOW), then we do not un-clip any meshes after this dp
      Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
      // Clipy_from_tree_recursive(group_root_mesh, clip_top, clip_bottom);
      // Clampx_from_group(root.group_bufferidxs[0], 0, clip_right);


      // View_rerender_from_view_all_buffers(root.group_bufferidxs[0], false);
      View_render_from_view_all_buffers(root.group_bufferidxs[0], false);

      
      

      // HACK: We want to update the handles size and pos after dp activation
      const root_meshidx = Widget_root_buffer_get_root_meshidx(this.root_bufferidx)
      const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshidx)
      if(root_mesh.type & MESH_TYPE.WIDGET_SCROLLER) TEMP_Scroller_calc_handle(root_mesh)

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


      // Calculate_sizes_recursive(parent, parent.options, dp.idx);
      Expand(this, this.options)
      temp_dp_calc_sizes(this, _, this.options & SECTION.INDEPENDENT);

         
      this.geom.dim[0] = this.max_size[0] + this.StylesGetMargin(STYLES.AXIS.X);
      this.geom.dim[1] = this.max_size[1] + this.StylesGetMargin(STYLES.AXIS.Y);
      

      const cur_pos = [0,0];
      cur_pos[0] = this.geom.pos[0]; 
      cur_pos[1] = this.geom.pos[1]; 
      // console.log('---------------------')
      tu(this, this.options, cur_pos, _, _, this.options & SECTION.INDEPENDENT);



      if((this.options & SECTION.INDEPENDENT)===0){

         // Get the group root mesh to Recalc position/dimentions 
         const group_rootidx = View_get_view_vb_root_meshidx(this.group_bufferidxs);
         const group_root_mesh = Mesh_buffer_get_mesh_byidx(group_rootidx)
         let clip_top = null, clip_bottom = null;
         if (group_root_mesh.parent) {
   
            clip_top = group_root_mesh.parent.GetPosY();
            clip_bottom = clip_top + group_root_mesh.parent.geom.dim[1]*2;
            // clip_right = group_root_mesh.parent.geom.pos[0] + group_root_mesh.parent.geom.dim[0] - 20;
         }
         else {
            clip_top = group_root_mesh.GetPosY();
            clip_bottom = clip_top + group_root_mesh.geom.dim[1]*2;
         }

         Clipy_from_group(group_root_mesh.group_bufferidxs[0], clip_top, clip_bottom);

         
         // Clipy_from_tree_recursive(group_root_mesh, clip_top, clip_bottom);
         // Clampx_from_group(root.group_bufferidxs[0], 0, clip_right);
         
         // // Clip from the tree recursive, if this dp has 'INDEPENDENT' flag, else clip from the whole group
         // if(this.options & SECTION.INDEPENDENT){
         //    Clipy_from_tree_recursive(root, clip_top, clip_bottom);
         // }
         // else{
            //    Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
            // }
            
            
         }
         
         
         this.ConstructListenersForMenu(menu); // Create listeners, as children of menu listeners.

      // HACK: We want to update the handles size and pos after dp activation
      const root_meshidx = Widget_root_buffer_get_root_meshidx(this.root_bufferidx)
      const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshidx)
      if(root_mesh.type & MESH_TYPE.WIDGET_SCROLLER) TEMP_Scroller_calc_handle(root_mesh)



      // FIXME: For the first time a menu is rendered must call Render() and not Re-render in order to create the vb starts for each mesh
      // View_rerender_from_view_all_buffers(root.group_bufferidxs[0], false);
      View_render_from_view_all_buffers(root.group_bufferidxs[0], false);

   }


   // ClipY(limit){

   //    const btn = this.children.buffer[0];
   //    btn.ClipY()
   // }







   /*******************************************************************************************************************************************************/
   // Events Handling
   /*******************************************************************************************************************************************************/

   CreateHoverEvent() {
      const btn = this.children.buffer[0];
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   }


   CreateClickEvent() {
      // If the 'click' event hasn't been activated by another call to 'CreateListenEvent' for this dp, 
      // create FAKE click event, if dp is root (direct child of scene),
      // else let the Construct listeners decide the parent event listener for dp's button
      if (this.listeners && this.listeners.buffer[E.C]===null && Widget_root_is_widget_root(this.root_bufferidx, this.mesh_bufferidx)) {
         this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
      }
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


   TEMP_recalc(x, y) {

      const btn = this.children.buffer[0];

      const dx = btn.geom.pos[0] - this.geom.pos[0];
      const dy = btn.geom.pos[1] - this.geom.pos[1];

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;

      const marg = this.StylesGetMargin();
      btn.TEMP_recalc(x + dx + marg[0], y + dy + marg[1]);
   }


   TEMP_recalc_x(x) {

      const btn = this.children.buffer[0];

      // const dx = btn.geom.pos[0] - this.geom.pos[0];

      this.geom.pos[0] = x;

      // btn.TEMP_recalc_x(x + this.StylesGetMargin(STYLES.AXIS.X));

      // TODO: Conceptualize how to implement the code below that will reflect a broader context.

      const xp = x + this.StylesGetMargin(STYLES.AXIS.X);
      const yp = this.geom.pos[1] + this.StylesGetMargin(STYLES.AXIS.Y)*2;
      const dx = btn.text_mesh.geom.pos[0]-btn.geom.pos[0];
      const dy = btn.text_mesh.geom.pos[1]-btn.geom.pos[1];
      btn.geom.pos[0] = xp;
      btn.geom.pos[1] = yp;
      btn.text_mesh.geom.pos[0] = xp+dx;
      btn.text_mesh.geom.pos[1] = yp+dy;

      if(this.isOn & DP_MENU_STATE.ON){
         // this.menu.TEMP_recalc(xp, yp)
         // HACK
         this.menu.geom.pos[0] = this.geom.pos[0] + this.StylesGetMargin(STYLES.AXIS.X)
         this.menu.geom.pos[1] = this.geom.pos[1] + this.geom.dim[1]*2
         // this.menu.geom.dim[0] = this.geom.dim[0]
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
      btn.EnableGfxUniforms(flags, name, type, shader_flags);
      
      this.menu.GfxUniformsEnable(flags, name, type, shader_flags);
      
   }

  
   GfxUniformsSetClbk(unif_name, Clbk, clbk_params){

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      super.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);

      // And we set one of the text meshes, since we know all other text meshes belong to the same vb
      const btn = this.children.buffer[0];
      btn.text_mesh.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

}
/**SAVE: Try to clac the size of the activated dp, and update all the parents up the tree */
// function Set_size_of_parents_recursive(dp, size){

//    // TODO: This is buggy: FIX IT when it'll show that is not working

//    if(dp.parent){

//       const parent = dp.parent;
//       if((parent.type & MESH_TYPE.WIDGET_WINDOW)===0 && 
//          (parent.type & MESH_TYPE.WIDGET_SCROLLER)===0) { // Exlude the window which is resizable by the user
//          // parent.geom.dim[0] = dp.max_size[0] + parent.StylesGetMargin(STYLES.AXIS.X);
//          // parent.geom.dim[1] = dp.max_size[1] + parent.StylesGetMargin(STYLES.AXIS.Y);
         
//          // parent.geom.dim[0] = size[0] + parent.StylesGetMargin(STYLES.AXIS.X);
//          // parent.geom.dim[1] = size[1] + parent.StylesGetMargin(STYLES.AXIS.Y);
//          // size[0] += parent.StylesGetMargin(STYLES.AXIS.X);
//          // size[1] += parent.StylesGetMargin(STYLES.AXIS.Y);

//          // if(parent.options & SECTION.VERTICAL){
//          //    parent.geom.dim[1] += (size[1] + parent.StylesGetMargin(STYLES.AXIS.Y)/2);
//          // }
//          // else if(parent.options & SECTION.HORIZONTAL){
//          //    parent.geom.dim[0] += (size[0] + parent.StylesGetMargin(STYLES.AXIS.X)/2);
//          // }
//          // parent.geom.dim[0] += size[0];
//          // parent.geom.dim[1] += size[1];
         
//          // parent.geom.dim[0] += (size[0] + parent.StylesGetMargin(STYLES.AXIS.X)) - parent.geom.dim[0];
//          // parent.geom.dim[1] += (size[1] + parent.StylesGetMargin(STYLES.AXIS.Y)) - parent.geom.dim[1];
//          // parent.geom.dim[1] += size[1];
         
//          // parent.geom.dim[0] = 0;
//          // parent.geom.dim[1] = 0;
//          parent.geom.dim[0] = parent.StylesGetMargin(STYLES.AXIS.X);
//          parent.geom.dim[1] = parent.StylesGetMargin(STYLES.AXIS.Y);
//          for(let i=0; i <= parent.children.boundary; i++){

//             const child = parent.children.buffer[i];
//             console.log('____________', child.geom.dim, child.max_size, child.GetName())
//             if(parent.options & SECTION.VERTICAL){
//                if(child.max_size){
//                   if(parent.geom.dim[0] < child.max_size[0]) parent.geom.dim[0] = child.max_size[0] + child.StylesGetMargin(STYLES.AXIS.X)*2;
//                   parent.geom.dim[1] += child.max_size[1] + child.StylesGetMargin(STYLES.AXIS.Y);
//                }
//             }
//             else if(parent.options & SECTION.HORIZONTAL){
//                if(child.max_size){
//                   parent.geom.dim[0] += child.max_size[0];
//                   if(parent.geom.dim[1] < child.max_size[1]) parent.geom.dim[1] = child.max_size[1];
//                }
//             }

//          }
//       }

//       console.log(' ->> RESIZE PARENT DIM', parent.GetName())
      
//       // Run recursively up the parent tree
//       Set_size_of_parents_recursive(dp.parent, size)
//    }
// }




// function temp_dp_calc_sizes(dp, target_child_idx=0, is_independed=0x0){

//    const parent = dp.parent;
//    const is_scroller = (parent && parent.parent) ? (parent.parent.type & MESH_TYPE.WIDGET_SCROLLER) : 0;
   

//    if(parent){
      
//       // const is_menubar = (parent.type & MESH_TYPE.WIDGET_MENU_BAR);

//       const continue_recur = (is_independed & (dp.options & SECTION.INDEPENDENT)) ? true 
//       : ((is_independed===0x0 && (parent.options & SECTION.INDEPENDENT)===0) ? true : false);

//       // if((parent.type & MESH_TYPE.SECTION_MESH) && !is_menubar){
//       if((parent.type & MESH_TYPE.SECTION_MESH) && continue_recur && !is_scroller){
   
//          console.log(parent.GetName())
//          Calculate_sizes_recursive(parent, parent.options, dp.idx)
//          // Calculate_sizes_recursive(parent, parent.options, )
   
//          // Set the new size to the parent mesh: it is store in .max_size
//          if((parent.type & MESH_TYPE.WIDGET_WINDOW)===0){
//             parent.geom.dim[0] = parent.max_size[0] + parent.StylesGetMargin(STYLES.AXIS.X);
//             parent.geom.dim[1] = parent.max_size[1] + parent.StylesGetMargin(STYLES.AXIS.Y);
//          }
//       }

//       // Recurse Tree mesh upwards
//       if(continue_recur) temp_dp_calc_sizes(parent, dp.idx, is_independed);

//    }
//    else{
//       Calculate_sizes_recursive(dp, dp.options, target_child_idx);
//    }

// }
function temp_dp_calc_sizes(dp, target_child_idx=0, is_independed=0x0){

   const parent = dp.parent;
   // Calculate sizes bottom-up the tree with this 'dp' being the root...  
   const dif = Calculate_sizes_recursive(dp, dp.options, target_child_idx);

   // let TEMP_scroller = null; // HACK: If there is a scroller 

   // ... And then go up the tree, from this 'dp' to the actual root, to add the dimention difference that was calculated erlier.
   // NOTE: This is done so that we skip calculating all children from the root. Insted we calculate from this dp and all its children , and we propagate the size difference up to any 'Section' parents.   
   let p = parent
   while(p){

      // if(p && (p.type & MESH_TYPE.SECTION_MESH) &&  (parent.parent.type & MESH_TYPE.WIDGET_SCROLLER)===0){
      if(p && (p.type & MESH_TYPE.SECTION_MESH)){

         
         if(p.type & MESH_TYPE.WIDGET_SCROLLER || p.type & MESH_TYPE.WIDGET_MENU_BAR || p.type & MESH_TYPE.WIDGET_WINDOW) {
            break;
         }

         if(p.options & SECTION.VERTICAL){

            p.geom.dim[0] += dif[0];
            p.max_size[0] = p.geom.dim[0];
            if(p.geom.dim[0] < p.min_size[0]){
               
               p.geom.dim[0] = p.min_size[0];
               p.max_size[0] = p.geom.dim[0];
            }

            p.geom.dim[1] += dif[1];
            p.max_size[1] = p.geom.dim[1];
         }
         else if(p.options & SECTION.HORIZONTAL){

            p.geom.dim[1] += dif[1];
            p.max_size[1] = p.geom.dim[1];
            if(p.geom.dim[1] < p.min_size[1]){
               
               p.geom.dim[1] = p.min_size[1];
               p.max_size[1] = p.geom.dim[1];
            }

            p.geom.dim[1] += dif[1];
            p.max_size[1] = p.geom.dim[1];
         }
         p = p.parent
      }
   }
   

   // if(parent){
      
   //    // const is_menubar = (parent.type & MESH_TYPE.WIDGET_MENU_BAR);

   //    const continue_recur = (is_independed & (dp.options & SECTION.INDEPENDENT)) ? true 
   //    : ((is_independed===0x0 && (parent.options & SECTION.INDEPENDENT)===0) ? true : false);

   //    // if((parent.type & MESH_TYPE.SECTION_MESH) && !is_menubar){
   //    if((parent.type & MESH_TYPE.SECTION_MESH) && continue_recur && !is_scroller){
   
   //       console.log(parent.GetName())
   //       Calculate_sizes_recursive(parent, parent.options, dp.idx)
   //       // Calculate_sizes_recursive(parent, parent.options, )
   
   //       // Set the new size to the parent mesh: it is store in .max_size
   //       if((parent.type & MESH_TYPE.WIDGET_WINDOW)===0){
   //          parent.geom.dim[0] = parent.max_size[0] + parent.StylesGetMargin(STYLES.AXIS.X);
   //          parent.geom.dim[1] = parent.max_size[1] + parent.StylesGetMargin(STYLES.AXIS.Y);
   //       }
   //    }

   //    // Recurse Tree mesh upwards
   //    if(continue_recur) temp_dp_calc_sizes(parent, dp.idx, is_independed);

   // }
   // else{
   //    Calculate_sizes_recursive(dp, dp.options, target_child_idx);
   // }

}


export function TEMP_DP_STEAL_THE_DP_RECALC(dp){
   
   // Calculate_sizes_recursive(parent, parent.options, dp.idx);
   Expand(dp, dp.options)
   temp_dp_calc_sizes(dp, _, dp.options & SECTION.INDEPENDENT);

      
   dp.geom.dim[0] = dp.max_size[0] + dp.StylesGetMargin(STYLES.AXIS.X);
   dp.geom.dim[1] = dp.max_size[1] + dp.StylesGetMargin(STYLES.AXIS.Y);
   

   const cur_pos = [0,0];
   cur_pos[0] = dp.geom.pos[0]; 
   cur_pos[1] = dp.geom.pos[1]; 
   tu(dp, dp.options, cur_pos, _, _, dp.options & SECTION.INDEPENDENT);
}

function tu(dp, options, curr, target_child_idx, is_for_build, is_independed=0x0){

   // console.log(dp.GetName())
   Temp_dp_calculate_positions(dp, options, curr, target_child_idx, is_for_build);
   
   const parent = dp.parent;

   // const is_scroller = (parent && parent.parent) ? (parent.parent.type & MESH_TYPE.WIDGET_SCROLLER) : 0;
   // if(parent && parent.children.active_count){
   if(parent && (parent.type & MESH_TYPE.WIDGET_SCROLLER)===0){
      
      const continue_recur = (is_independed & (parent.options & SECTION.INDEPENDENT)) ? true 
      : ((is_independed===0x0 && (parent.options & SECTION.INDEPENDENT)===0) ? true : false);

      if(parent.options & SECTION.VERTICAL) {
         curr[0] = parent.geom.pos[0];
         curr[1] = dp.geom.pos[1] + dp.geom.dim[1]*2;
      }
      else if(parent.options & SECTION.HORIZONTAL) {
         // curr[0] = parent.geom.pos[0] + dp.geom.pos[0] + dp.geom.dim[0]*2;
         curr[0] = dp.geom.pos[0] + dp.geom.dim[0]*2;
         curr[1] = dp.geom.pos[1];
         // curr[1] = dp.geom.pos[1] + dp.geom.dim[1]*2;
      }

      if(continue_recur)
         tu(parent, options, curr, dp.idx+1, true, (parent.options & SECTION.INDEPENDENT));
   }

}



function Temp_dp_calculate_positions(parent, options, curr, target_child_idx, is_for_build=false) {

   
   const cur_pos = [
      curr[0] + parent.StylesGetMargin(STYLES.AXIS.X), 
      is_for_build ? curr[1] : curr[1] + parent.StylesGetMargin(STYLES.AXIS.Y), // 'is_for_build=true' don't add the margin on repositioning alredy buld dropdowns  
   ];
   // const cur_pos = [
   //    curr[0] + parent.StylesGetMargin(STYLES.AXIS.X), 
   //    curr[1] + parent.StylesGetMargin(STYLES.AXIS.Y), // 'is_for_build=true' don't add the margin on repositioning alredy buld dropdowns  
   // ];

   
   const pad = [0, 0]
   
   const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;

   if(target_idx > parent.children.boundary) return

   for (let i = target_idx; i <= parent.children.boundary; i++) {
      
      const mesh = parent.children.buffer[i];
      let continue_recur = true;
      let opt = options

      // console.log('  RecalcPos', mesh.GetName())

      if (options & SECTION.INHERIT) opt = parent.options

      const padd = mesh.StylesGetPad();
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

         mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
         continue_recur = false;
      }
      else if (mesh.type & MESH_TYPE.SECTION_MESH) 
      { // For meshes with a parent of type Section

         mesh.geom.pos[0] = rel_pos[0]; 
         mesh.geom.pos[1] = rel_pos[1];
         
         // Case of menu bar, that has text directly as a child
         if(mesh.text_mesh){
            mesh.text_mesh.geom.pos[0] = rel_pos[0] 
            mesh.text_mesh.geom.pos[1] = rel_pos[1]
         }
      }
      else{

         mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);

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
      }
      else if (parent.options & SECTION.HORIZONTAL) {
         cur_pos[0] += mesh.geom.dim[0] * 2;
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


