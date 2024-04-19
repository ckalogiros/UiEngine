"use strict";

import { MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../Core/Buffers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Listener_get_parent_event, Listener_remove_event_by_idx } from "../../Events/EventListeners.js";
import { AddArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Create_widget_button, Create_widget_section } from "../../Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx, Widget_movexy, Widget_root_add_mesh, Widget_root_buffer_get_byidx, Widget_root_is_widget_root } from "../../Core/MeshBuffer.js";
import { Clampx_from_group, Clipy_from_group } from "../Operations/Clip.js";
import { Section } from "../Meshes/Section.js";
import { BLUEL, GREEN, GREY, PURPLER, REDL, WHITE } from "../Material/Base/Colors.js";
import { View_add_to_group, View_get_view_vb_root_meshidx, View_remove_from_group, View_rerender_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/MeshBufferViews.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";

/**
 * SEE: ### Widget_Dropdown
 * 

 */



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
      console.log('id:', _root_dropdown.buffer[i].id, ' name:', _root_dropdown.buffer[i].GetName(), ' pos:', _root_dropdown.buffer[i].geom.pos);
   }
}


const tr = .5;
const _font_size = 9;

export class Widget_Dropdown extends Section {

   isOn; // Bool for checking a dropdown's menu expanded/contructed.
   menu_active; // H to preserve the 'expanded' state, even if the current dp is deactivated by a parent dp. 
   menu; // SEE ## Dropdown Menu 
   rootidx; // Store the root's dropdown index (of the '_root_dropdown');
   dp_symbols; // Text symbols for denoting a dropdown's Expanded/contracted menu. // TODO: Add textured symbols OR create a font texture with symbols for dropdown expansion/contraction.
   // depth_level; // The tree depth level that the dropdown exists (root dp = 0 depth).


   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, pos, col1 = GREY[3], col_menu = PURPLER[7], text_col = WHITE, btn_pad = [3, 3], bold = .6, font = TEXTURES.MSDF_CONSOLAS_1024, style = [2, 5, 2], margin = [10, 10], is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, SECTION.VERTICAL, margin, pos, [10, 10], col1, null, style, is_debug_mesh);

      // NOTE: The mesh_bufferidx and the root_bufferidx as the root creation, happen in the Section from super(). 

      AddArr2(this.total_margin, margin);
      this.StylesSetMargin(margin);
      this.isOn = DP_MENU_STATE.OFF;
      this.type |= MESH_TYPE.WIDGET_DROP_DOWN;
      this.type &= ~MESH_TYPE.SECTION_MESH_ONLY;
      this.rootidx = INT_NULL;

      pos[2] += 1;
      this.menu = Create_widget_section(_, SECTION.VERTICAL, margin, [OUT_OF_VIEW, OUT_OF_VIEW, pos[2]], [1, 1], TRANSPARENCY(col_menu, tr), _, _, is_debug_mesh);
      this.menu.type |= MESH_TYPE.DROP_DOWN_MENU;
      this.menu.parent = this;
      AddArr2(this.menu.total_margin, this.menu.StylesGetMargin());
      AddArr2(this.menu.total_margin, this.StylesGetMargin());
      { // Multi color vertex
         this.menu.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
         this.menu.mat.col = [WHITE, REDL[7], GREEN[7], BLUEL[7]];
         this.menu.mat.defCol = [WHITE, REDL[7], GREEN[7], BLUEL[7]];
         this.menu.mat.col[1][3] = .5;
         this.menu.mat.col[1][7] = .5;
         this.menu.mat.col[1][11] = .5;
         this.menu.mat.col[1][15] = .6;
      }
      this.menu.state.mask &= ~MESH_STATE.ACTIVE;

      this.dp_symbols = ['+', '-'];
      const btn = new Create_widget_button(_, `${this.dp_symbols[0]} ${text}`, ALIGN.LEFT, [pos[0], pos[1], this.menu.geom.pos[2] + 1], _font_size, col_menu, text_col, btn_pad, bold, style, font, is_debug_mesh);
      // AddArr2(btn.total_margin, this.menu.total_margin);
      btn.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;

      this.AddItem(btn);

      this.menu_active = false;

      btn.SetName(`[${btn.mesh_bufferidx}]{${text}}-BTN_DP`);
      this.menu.SetName(`[${this.menu.mesh_bufferidx}]{${text}}-MENU_DP`);
      this.SetName(`[${this.mesh_bufferidx}]{${text}}-DP`);

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

         // mesh.depth_level = this.depth_level + 1; // Set the depth of the new dp.

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

      this.SetMenuItemsZindex(); // EFFICIENCY: It runs for all children al over again every time a new item is added

   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      const btn = this.children.buffer[0];
      btn.AddToWidgetRootBuffer(root_bufferidx);

      this.menu.AddToWidgetRootBuffer(root_bufferidx);
   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      this.children.buffer[0].Activate(); // Button
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      this.children.buffer[0].Deactivate(); // Button
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



   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   /** If FLAG===PRIVATE, then we get the gfx of the parent. If no parent exists, then the Gfx_generate_context creates new gfx. */
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx = _) {

      this.gfx = Gfx_generate_context(FLAGS, this, gfxidx);

      const btn = this.children.buffer[0];
      btn.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, [this.gfx.prog.idx, this.gfx.vb.idx], _); // Set button's area gfx same with dropDown mesh 

      this.menu.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, [this.gfx.prog.idx, this.gfx.vb.idx], _)
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



   // NOTE: Call comes from DpActivateMenu()
   // TODO: Is it still valid or needs to be re-designed???
   GenMenuGfxCtx_recursive(root, FLAGS) {
      // SEE ## Widget Dropdown generate gfx Context

      const menu = this.menu;

      if (!menu.gfx) { // Generate gfx context only if the menu does not alredy have gfx context.

         const igfx_rect = [this.gfx.prog.idx, this.gfx.vb.idx];
         const btn = this.children.buffer[0];
         const igfx_text = [btn.text_mesh.gfx.prog.idx, btn.text_mesh.gfx.vb.idx];


         // menu.gfx = Gfx_generate_context(FLAGS | GFX_CTX_FLAGS.SPECIFIC, menu, igfx_rect);
         menu.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, menu, igfx_rect);

         for (let i = 0; i <= menu.children.boundary; i++) {

            const item = menu.children.buffer[i];

            if (item.type & MESH_TYPE.WIDGET_DROP_DOWN) { // Case item is another dropdown

               // We know that dropdown derives from Section, so we can pass the igfx_rect
               item.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, item, igfx_rect);
               AddArr2(item.total_margin, menu.total_margin);

               const btn1 = item.children.buffer[0];
               btn1.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, igfx_rect, igfx_text);
               btn1.SetZPos(item.geom.pos[2] + 1);

               if (item.isOn & DP_MENU_STATE.ON) { // Case the item dropdown has an 'active' menu, activate the item's dp menu (runs recursive for any opened sub dp menus). 

                  // If the menu was deactivated while open, then on activation keep its '-' symbol
                  btn.text_mesh.SliceText(0, 1);
                  btn.text_mesh.SetTextAtIndex(this.dp_symbols[1], 0);
                  item.GenMenuGfxCtx_recursive(root, FLAGS);
               }

            }
            else { // Case: Generate gfx for any other children meshes (non dropdown meshes).

               // TODO. Do we genarate gfx for any other widget in the same gfx????  
               item.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
               // console.error('TEMP ERROR PATH:', item.GetName())

            }

         }
      }
   }


   Destroy() {

      const btn = this.children.buffer[0];
      btn.Destroy();

      this.menu.Destroy();

      Dropdown_roots_destroy_byidx(this.rootidx);

      return super.Destroy();

   }




   /*******************************************************************************************************************************************************/
   // State
   /*******************************************************************************************************************************************************/

   StateEnable(bit) {
      this.state.mask |= bit;
      const btn = this.children.buffer[0];
      btn.StateEnable(bit & MESH_STATE.ACTIVE); // POTENTIAL_BUG: The button state should only inherit 'ACTIVE' and not any 'MOVABLE' etc 
   }



   /*******************************************************************************************************************************************************/
   // Events Listeners
   /*******************************************************************************************************************************************************/

   ConstructListeners(parent_listeners = null, _mesh = null) {

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


               // If FAKE or HOVER, pass null params and null callback
               if (this.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {

                  this.AddListenEvent(i, null, null, parent_listeners[i]);
               }
               else { // Else construct the params
                  const params = {
                     EventClbk: null, targetBindingFunctions: null,
                     target_mesh: this, params: null,
                  }

                  this.AddListenEvent(i, super.OnClick, params, parent_listeners[i]);
               }
            }
         }
      }

// if(parent_listeners[1]===13)
// console.log()

      /*****************************************************************************************************************/
      // Create Listen Events for the button
      const btn = this.children.buffer[0];
      for (let i = 0; i <= btn.listeners.boundary; i++) {

         if (btn.listeners.buffer[i] !== null) {


            // Case there is a dropdown listener for dropdown, then make certain the button listener is a child
            if(this.listeners !== null && this.listeners.buffer[i] !== null && this.listeners.buffer[i] !== INT_NULL){

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


   RemoveAllListenersFromDpMenuItems(dp_menu) { // Mainly used to destroy listen events of any deactivated menus that have 'isActive=false' listen events.

      const menu = dp_menu;

      for (let j = 0; j <= menu.children.boundary; j++) {

         const child = menu.children.buffer[j];

         // If the menu's child mesh is of type dropdown, run recursively all menus.
         if (child.type)
            this.RemoveAllListenersFromDpMenuItems(child); // Run recursive for every dropdown in every menu

         // It is the button that may have any listen events.
         const btn = menu.children.buffer[0];
         if (btn)
            btn.RemoveAllListenEvents();

      }
   }


   ConstructListenersForMenu(dp_menu) { // Handle the dropdown's menu listen events creation. (if any of the items has listen events)

      const menu = dp_menu;

      for (let i = 0; i <= menu.children.boundary; i++) {

         const item = menu.children.buffer[i];

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

         // const temp = [menu.listeners.buffer[0], menu.listeners.buffer[1]]
         // item.ConstructListeners(temp);
         // EFFICIENCY: Allocations happen in this function
         item.ConstructListeners([menu.listeners.buffer[0], menu.listeners.buffer[1]]);

      }
   }



   /*******************************************************************************************************************************************************/
   // Dropdown activation
   /*******************************************************************************************************************************************************/





   // Reset and rebuild vertex buffers x
   DeactivateMenu(dp = null) {

      if (!dp) dp = this;
      this.menu_active = false; // Set state to active.

      const menu = dp.menu;

      if (dp.isOn & DP_MENU_STATE.ON) {
         for (let j = 0; j <= menu.children.boundary; j++) {

            const item = menu.children.buffer[j];


            // If the menu's item mesh is of type dropdown, run recursively to deactivate mesh's menu.
            if (item.type & MESH_TYPE.WIDGET_DROP_DOWN && item.is_gfx_inserted) {

               item.RemoveFromGfxBuffer();
               item.Deactivate();
               item.SetIsGfxInserted(false);

               item.RemoveAllListenEvents();


               if (item.isOn & DP_MENU_STATE.ON) this.DeactivateMenu(item); // Run recursive for every dropdown in every menu
            }
            else {
               if (item.gfx && item.is_gfx_inserted) {

                  item.RemoveFromGfxBuffer();
                  item.Deactivate();
                  item.SetIsGfxInserted(false);
               }
            }
         }

         if (menu.gfx && menu.is_gfx_inserted) {

            menu.state.mask &= ~MESH_STATE.ACTIVE;

            // Mesh_per_vb_remove_mesh(menu.gfx.vb.idx, menu.per_vb_bufferidx);
            menu.RemoveFromGfxBuffer();

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
      this.DeactivateMenu();
      this.RemoveChildByIdx(menu.idx); // Rememove menu from drop down


      // TODO: If group root mesh does not have a Recalc function, we MUST search for the first 'Section' fro the group root 
      // Re-calculate dimensions and positions
      let clip_top = null, clip_bottom = null;
      let clip_right = null;
      if (root.group_bufferidxs[0] !== INT_NULL) {

         // Get the group root mesh to Recalc position/dimentions 
         const group_rootidx = View_get_view_vb_root_meshidx(this.group_bufferidxs);
         const group_root_mesh = Mesh_buffer_get_mesh_byidx(group_rootidx);

         // group_root_mesh.Recalc_no_gfx_update(_, this.idx);
         group_root_mesh.Recalc_no_gfx_update(_);

         // TODO: If the group root is a scrolled_section, maybe the responsibility for Clip is at scroller ?????????
         if (group_root_mesh.parent) {

            clip_top = group_root_mesh.parent.geom.pos[1] - group_root_mesh.parent.geom.dim[1];
            clip_bottom = group_root_mesh.parent.geom.pos[1] + group_root_mesh.parent.geom.dim[1];
            clip_right = group_root_mesh.parent.geom.pos[0] + group_root_mesh.parent.geom.dim[0] - 20;
         }
      }
      else {
         // root.Recalc_no_gfx_update(_, this.idx);
         root.Recalc_no_gfx_update(_);
      }


      Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
      Clampx_from_group(root.group_bufferidxs[0], 0, clip_right);
      View_rerender_from_view_all_buffers(root.group_bufferidxs[0], false);

   }


   ActivateMenu(root) {
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
               item.ActivateMenu(root);
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
      if (!menu.gfx) {
         alert('Dropdown-DpActivateMenu()-menu has no gfx')
         // Case the menu is added  at runtime, must generate gfx context for the menu and its items
         this.GenMenuGfxCtx_recursive(root, GFX_CTX_FLAGS.PRIVATE | SECTION.FROM_PARENT_ASC); // Create PRIVATE context to the root's gfx buffers.
      }

      // Case its the first time this menu will be rendered
      if (menu.group_bufferidxs[0] === INT_NULL && this.group_bufferidxs[0] !== INT_NULL) {
         View_add_to_group(menu, this.group_bufferidxs[0])
      }

      View_reset_from_view_all_buffers(root.group_bufferidxs[0]);
      // Mesh_per_vb_remove_all_from_index(root.gfx.vb.idx, root.per_vb_bufferidx);


      this.ActivateMenu(root); // Add dropdown to gfx buffers.
      menu.SetFrameBufferIdx(this.isFramebufferRendered); // To update any framebuffer (if exists)

      /**
       * // TODO: If group root mesh does not have a Recalc function, we MUST search for the first 'Section' fro the group root 
       */
      // Re-calculate dimensions and positions
      let clip_top = null, clip_bottom = null;
      let clip_right = null;
      if (root.group_bufferidxs[0] !== INT_NULL) {

         // Get the group root mesh to Recalc position/dimentions 
         const group_rootidx = View_get_view_vb_root_meshidx(this.group_bufferidxs);
         const group_root_mesh = Mesh_buffer_get_mesh_byidx(group_rootidx)

         // group_root_mesh.Recalc_no_gfx_update(_, this.idx);
         group_root_mesh.Recalc_no_gfx_update(_);

         // TODO: If the group root is a scrolled_section, maybe the responsibility for Clip is at scroller ?????????
         if (group_root_mesh.parent) {

            clip_top = group_root_mesh.parent.geom.pos[1] - group_root_mesh.parent.geom.dim[1];
            clip_bottom = group_root_mesh.parent.geom.pos[1] + group_root_mesh.parent.geom.dim[1];
            clip_right = group_root_mesh.parent.geom.pos[0] + group_root_mesh.parent.geom.dim[0] - 20;
         }

      }
      else {
         root.Recalc_no_gfx_update(_);
         console.error('{{{{{{{{{{{{{{{{{{{{{{{{{{{{{');
      }

      Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
      Clampx_from_group(root.group_bufferidxs[0], 0, clip_right);

      View_rerender_from_view_all_buffers(root.group_bufferidxs[0], false);

      this.ConstructListenersForMenu(menu); // Create listeners, as children of menu listeners.

   }


   // Is Called from a source that has added a new dropdown to an existing one and must activate it 
   DpActivate() {

      const menu = this.parent;
      if (menu && (menu.parent.isOn & DP_MENU_STATE.OFF)) return; // Case the menu is not opened for the current dropdown, so the droppdown must not be rendered AND/OR .Calc()

      const root = Dropdown_roots_get_root_by_idx(this.rootidx);

      // this.CreateClickEvent();
      // this.CreateHoverEvent();
      this.Render(); // Add dropdown to gfx buffers.
      this.ConstructListeners(this.parent); // Create listeners, as children of menu listeners.                         // POTENTIAL_BUG: We create the listen events as children to the parent dropdown. So any change to the way we construct listeners for dropdowns must be apllied here too. 

      root.Recalc();

   }




   /*******************************************************************************************************************************************************/
   // Events Handling
   /*******************************************************************************************************************************************************/

   CreateHoverEvent() {
      const btn = this.children.buffer[0];
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   }


   CreateClickEvent() {
      // If dp is root (direct child of scene), create FAKE click event,
      // else let the Construct listeners decide the parent event listener for dp's button
      if (Widget_root_is_widget_root(this.root_bufferidx, this.mesh_bufferidx)) {
         this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
      }
      const btn = this.children.buffer[0];
      btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   }


   CreateMoveEvent() {
      this.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
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


   SetOnMove(params) {

      const mesh = Mesh_buffer_get_mesh_byidx(params.meshidx);
      STATE.mesh.SetClicked(mesh);
      // STATE.mesh.SetFocused(mesh);

      // Suppose the clicked mesh to be moved is only a menu.
      // const MoveFn = mesh.OnMove;
      const MoveFn = Widget_movexy;

      if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const idx = TimeIntervalsCreate(10, `Move: ${mesh.GetName()}`, TIME_INTERVAL_REPEAT_ALWAYS, MoveFn, mesh);
         mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (mesh.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(mesh);
            mesh.StateEnable(MESH_STATE.IN_GRAB);
         }

      }

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
   // Alignment
   /*******************************************************************************************************************************************************/

   ReAlign() {

      // Realign menu's text
      const text_mesh = this.children.buffer[0];
      text_mesh.Align_pre(this, ALIGN.LEFT, this.pad);

      let pad = [this.pad[0], this.pad[1]];

      for (let i = 1; i <= this.children.boundary; i++) {

         const btn = this.children.buffer[i];
         btn.Align_pre(this, ALIGN.RIGHT | ALIGN.VERT_CENTER, pad);
         pad[0] += btn.geom.dim[0] * 2;
      }

   }


   /*******************************************************************************************************************************************************/
   // Setters_Getters
   /*******************************************************************************************************************************************************/

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


   GetSize(size = [0, 0]) {

      // Accum dropdown's size
      size[0] += this.children.buffer[0].geom.dim[0] + this.StylesGetMargin(STYLES.AXIS.X);
      size[1] += this.children.buffer[0].geom.dim[1] + this.StylesGetMargin(STYLES.AXIS.Y);

      if (this.isOn & DP_MENU_STATE.ON) { // If the menu is active, accum its size
         size[0] += this.menu.geom.dim[0];
         size[1] += this.menu.geom.dim[1];
      }

      return size;
   }



   /*******************************************************************************************************************************************************/
   // Clamp
   /*******************************************************************************************************************************************************/

   SetClamp(x = 0, y = 0) {
      this.clamp[0] = x;
      // this.clamp[1] = y;
   }


   ClampXtree(clampx) {

      if (!this.clamp[0]) {
         return; // Don't run if no clamping exists for this dropdown.
      }

      const marg = Get_all_margins_recursive_bottom_up(this);
      Clamp_x_recursive(this, clampx, marg[0]);
   }


   ClampX(clampx) {

      const marg = Get_all_margins_recursive_bottom_up(this);
      super.ClampX(clampx, marg[0]);
   }


   SetMenuItemsZindex() {

      if (this.parent) {
         // Set this. z index
         this.geom.pos[2] = this.parent.geom.pos[2] + 1;
         this.menu.geom.pos[2] = this.geom.pos[2] + 1;
      }
      // DICISION: What about any children recursive???
      for (let i = 0; i <= this.menu.children.boundary; i++) {
         const child = this.menu.children.buffer[i];
         if (child)
            child.SetZPos(this.menu.geom.pos[2] + 1);
      }
   }



   /*******************************************************************************************************************************************************/
   // Misc
   /*******************************************************************************************************************************************************/



   // BUG: The function fails in the occation that the menu is above the upper clip limit and needs NOT to be clipped.
   // TODO: We should pre-calculate the menu's height somehow
   RoughEstimateCalculationOfUnititializedMenuClippingY(clip_top, clip_bottom) {

      const menu = this.menu;
      const btn = this.children.buffer[0];
      const menu_top = btn.GetBottom_A() + 1; // +1 pixel. // TODO: Should calculate any dropdown's internal padding

      const fake_menu_height = 30; // HACK: We fake estimate a random height for the uninitialized menu

      if (menu_top > clip_bottom || menu_top + fake_menu_height < clip_top)
         return true;
      return false;
   }
}


export function TEMP_PRINT_IS_GFX_INSERTED(_mesh, msg) {

   const root = Widget_root_buffer_get_byidx(_mesh.root_bufferidx)
   for (let i = 0; i <= root.boundary; i++) {
      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i])
      if (mesh.is_gfx_inserted)
         console.log(i, `[[GFX_INSERTED]] ${msg}`, mesh.mesh_bufferidx, mesh.geom.pos[1], mesh.GetName())
   }
   for (let i = 0; i <= root.boundary; i++) {
      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i])
      if (mesh.state.mask & MESH_STATE.ACTIVE)
         console.log(i, `[ACTIVE] ${msg}`, mesh.mesh_bufferidx, mesh.geom.pos[1], mesh.GetName())
   }
}


/*******************************************************************************************************************************************************/
// Helpers
/*******************************************************************************************************************************************************/

function Clamp_x_recursive(mesh, clampx, margx) {

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {
         // If child is of type dropdown, gather all margins up to the root, else use the param margx, which is the already gathered margins 
         const marg = Get_all_margins_recursive_bottom_up(child);
         if (marg) Clamp_x_recursive(child, clampx, marg[0])
         else Clamp_x_recursive(child, clampx, margx)
      }
   }

   mesh.ClampX(clampx, margx);

}



function Get_all_margins_recursive_bottom_up(dp, margin = [0, 0]) {

   if ((dp.type & MESH_TYPE.WIDGET_DROP_DOWN)) {

      AddArr2(margin, dp.StylesGetMargin());
      AddArr2(margin, dp.menu.StylesGetMargin());
   }

   if (dp.parent) {
      margin = Get_all_margins_recursive_bottom_up(dp.parent, margin);
   }
   return margin;
}