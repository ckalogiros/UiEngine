"use strict";

import { New_generic_buffer } from "../../Core/Buffers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Time_intervals_create } from "../../Timers/TimeIntervals.js";
import { Create_rect_mesh, Create_widget_button } from "./Helpers/CreateWidgetInterface.js";
import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer.js";
import { View_calculate_rendergroup_draw_count, View_add_mesh, View_reset_rendergroup_draw_count, View_render_from_view_NEW, View_render_specific_render_group, View_reset_rendering_buffer_whole_view_group } from "../../Core/Views/MeshBufferViews.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";
import { Root_group_view_buffer_add_mesh, Root_group_view_buffer_get_root_meshidx } from "../../Core/Views/RootView.js";
import { Rect_Mesh, Rect_mesh_on_move_clbk } from "../Meshes/Rect_Mesh.js";
import { Widget_gfx_ready_enable } from "./Helpers/WidgetEnableProperties.js";
import { Sid_check_match, State_mesh_set_clicked, State_mesh_set_focused, State_mesh_set_grabed } from "../../../GlobalFunctions.js";
import { Mesh_get_name, Mesh_listener_add, Mesh_listener_remove, Mesh_set_name, Mesh_state_check } from "../Operations/MeshPropertiesFunctions.js";
import { Layout_basic_pre_render, Layout_grow_containers_pre_render_with_item_reposition } from "../Operations/AlignNestedSections.js";
import { Components_create_scroller_component, Components_get_scroller_component, Scoller_component_render, Scroller_component_calculate_handle_pos_dim } from "./ScrollerComponent.js";
import { Vertex_buffer_group_create_scissorbox, Vertex_buffer_group_set_scissorbox, Vertex_buffer_group_update_scissorbox } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Events/EventListeners.js";





















/**
 * We keep all root-dropdown widgets of the App in a buffer of this file's compilation unit.
 * The reason being not to store a reference pointer of the root in the  dropdown, 
 * rather an index to a buffer of all root-dropdowns. (?Does it worthh it?)
 */
const _root_dropdown = New_generic_buffer(_, 'Widget Dropdown roots');
export function Dropdown_roots_reset() { _root_dropdown.ResetFull(); }



/** */
export function Dropdown_roots_set_root(root, dropdown) {
   dropdown.rootidx = _root_dropdown.Add(root);
   return dropdown.rootidx;
}
/** */
function Dropdown_roots_get_root_by_idx(rootidx) {
   const root = _root_dropdown.buffer[rootidx];
   return root;
}
/** */
function Dropdown_roots_destroy_byidx(rootidx, caller_mesh_bufferidx) {
   // Destroy only if the caller dropdown is the root
   if (caller_mesh_bufferidx === _root_dropdown.buffer[rootidx].mesh_bufferidx)
      _root_dropdown.RemoveByIdx(rootidx);
}

/**Debug-Print */
export function Dropdown_roots_print_root_buffer() {
   for (let i = 0; i <= _root_dropdown.boundary; i++) {
      console.log('id:', _root_dropdown.buffer[i].mesh_bufferidx, ' name:', Mesh_get_name(_root_dropdown.buffer[i]), ' pos:', _root_dropdown.buffer[i].geom.pos);
   }
}














// export class Widget_Dropdown extends Section {
export class Widget_Dropdown extends Rect_Mesh {

   isOn; // Bool for checking a dropdown's menu expanded/contructed.
   menu_active; // H to preserve the 'expanded' state, even if the current dp is deactivated by a parent dp. 
   menu; // SEE ## Dropdown Menu 
   rootidx; // Store the root's dropdown index (of the '_root_dropdown');
   dp_symbols; // Text symbols for denoting a dropdown's Expanded/contracted menu. // TODO: Add textured symbols OR create a font texture with symbols for dropdown expansion/contraction.

   /** */
   constructor(mesh_bufferidx, properties) {

      super(mesh_bufferidx, properties.dp)

      // NOTE: The mesh_bufferidx and the root_bufferidx as the root creation, happen in the Section from super(). 

      this.StylesSetPad(properties.dp.pad);
      this.isOn = DP_MENU_STATE.OFF;
      this.type |= MESH_TYPE.WIDGET_DROP_DOWN;
      this.type &= ~MESH_TYPE.SECTION_MESH_ONLY;
      this.rootidx = INT_NULL;
      
      // this.align.flags = LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF;
      // this.align.flags = LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF;
      this.align.flags = properties.dp.layout !== undefined ? properties.dp.layout : LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF;
      
      properties.dp.pos[2] += 1;
      this.menu = Create_rect_mesh(properties.menu);
      Widget_gfx_ready_enable({mesh:this.menu, enable_sdf_rect:10, });
      this.menu.type |= MESH_TYPE.DROP_DOWN_MENU;
      this.menu.parent = this;
      this.menu.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
      this.menu.StylesSetPad(properties.menu.pad);
      // this.menu.RenderToNewRenderGroup();
      
      
      this.dp_symbols = ['+', '-'];
      properties.btn.text = `${this.dp_symbols[0]} ${properties.btn.text}`;
      const btn = Create_widget_button(properties.btn);
      Widget_gfx_ready_enable({mesh:btn, enable_sdf_rect:10, listener: { type: LISTEN_EVENT_TYPES.CLICK_UP }})
      btn.align.flags = LAYOUT.VERTICAL
      btn.StylesSetPad(properties.btn.pad);
      
      this.menu.geom.pos[1] = btn.geom.dim[1];
      
      
      btn.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;
      
      this.AddItem(btn);

      this.menu_active = false;
      this.menu.Deactivate();

      
      if (properties.dp.is_root & ROOT_WIDGETS.CREATE_ROOT) {

         // Store view group index
         const btn = this.children.buffer[0];
         btn.SetViewGroupIndex(this.group_bufferidxs[0]);
         
         // Store view group index
         this.menu.SetViewGroupIndex(this.group_bufferidxs[0]);
      }

      Mesh_set_name(btn, `Dp_Btn[${btn.mesh_bufferidx}]{${properties.btn.text}}`);
      Mesh_set_name(this.menu, `Dp_Menu[${this.menu.mesh_bufferidx}]{${properties.btn.text}}`);
      Mesh_set_name(this, `${properties.dp.name}:Dp[${this.mesh_bufferidx}]`);

   }
   /** */
   SetLayout(align_flags) {

      this.align.flags = align_flags;
   }
   /** */
   AddLayout(align_flags) {

      this.align.flags |= align_flags;
   }
   /** */
   Activate() {

      this.state.mask |= MESH_STATE_FLAGS.ACTIVE;
      
      this.children.buffer[0].Activate(); // Button

      if(this.isOn & DP_MENU_STATE.ON){
         this.menu.Activate(); // Button
      }
   }
   /** */
   Deactivate() {
      
      this.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
      // View_remove_mesh(this.group_bufferidxs, this.geom.num_faces);

      this.children.buffer[0].Deactivate(); // Button
      if(this.isOn & DP_MENU_STATE.ON){
         this.menu.Deactivate();
      }
   }
   /** */
   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
      this.children.buffer[0].StateEnable(MASK); // Button
      if (this.isOn & DP_MENU_STATE.ON) {
         this.menu.StateEnable(MASK); // Active Menu
      }
   }
   /** */
   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
      this.children.buffer[0].StateDisable(MASK); // Button
      if (this.isOn & DP_MENU_STATE.ON) {
         this.menu.StateDisable(MASK); // Active Menu
      }
   }
   /** */
   SetTypeDebug() {

      this.type |= MESH_TYPE.DEBUG_MESH;

      this.children.buffer[0].SetTypeDebug();

      this.menu.type |= MESH_TYPE.DEBUG_MESH;
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/

   /** */
   Destroy() {

      const btn = this.children.buffer[0];
      btn.Destroy();

      this.menu.Destroy();

      Dropdown_roots_destroy_byidx(this.rootidx);

      return super.Destroy();

   }
   /** */
   AddToWidgetRootBuffer(root_bufferidx) {
      
      this.root_bufferidx = root_bufferidx;
      Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
      
      const btn = this.children.buffer[0];
      btn.AddToWidgetRootBuffer(root_bufferidx);
      
      this.menu.AddToWidgetRootBuffer(root_bufferidx);
   }
   /** */
   SetViewGroupIndex(view_groupidx) {
      
      this.group_bufferidxs[0] = view_groupidx;
      
      // Store view group index
      const btn = this.children.buffer[0];
      btn.SetViewGroupIndex(view_groupidx);
      
      // Store view group index
      this.menu.SetViewGroupIndex(view_groupidx);
   }
   /** */
   SetGfxEnable(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgetDropdown')
   }
   /** */
   AddToMenu(mesh) {

      // NOTE: If the dp is Root, it has been set to widget root buffer from super. If not, there is no purpose of doing anything to the dp.
      // NOTE: The dp's button is inserted to the widget root buffer by the constructor:  'this.AddItem(btn)'

      if ((this.isOn & DP_MENU_STATE.ON) === 0) {
         mesh.StateDisable(MESH_STATE_FLAGS.ACTIVE);
         // Disable all children meshes
         for(let i=0; i<=mesh.children.boundary; i++) {
            const child = mesh.children.buffer[i];
            child.StateDisable(MESH_STATE_FLAGS.ACTIVE);
         }
      }

      if (mesh.type & MESH_TYPE.WIDGET_DROP_DOWN) {

         if (this.rootidx === INT_NULL) {

            /* IMPORTANT!!! 
             * With the current implementation we must add dropdown widgets to dropdown menus as items 
             * in the order of the tree representation. That means each dropdown that adds another dropdown must
             * already been added to a higher order in the tree dropdown, so that it has the 'rootidx' index.
             * ALL DROPDOWNS THAT ARE PART OF THE TREE STRUCT HAVE ONE DROPDOWN ROOT WIDGET 
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
         Root_group_view_buffer_add_mesh(this.menu.root_bufferidx, this.menu.mesh_bufferidx);
      }

      // Store view group index
      if(this.group_bufferidxs[0] !== INT_NULL) {
         mesh.SetViewGroupIndex(this.group_bufferidxs[0]);
      }

      
      if((this.menu.state.mask & MESH_STATE_FLAGS.ACTIVE)===0) 
         mesh.StateDisable(MESH_STATE_FLAGS.ACTIVE);

      mesh.idx = this.menu.AddItem(mesh);

   }

   /** */
   EnableGfx(which, params=null, menu_params=null, button_params=null){
      
      super.EnableGfx(which, params);
      
      if(this.menu) this.menu.EnableGfx(which, menu_params);
      
      const btn = this.children.buffer[0];
      btn.EnableGfx(which, button_params);
      
   }
   /** */
   EnableGfxUniforms(flags, name, type, shader_flags){
      
      super.EnableGfxUniforms(flags, name, type, shader_flags);
      
      if(this.menu) this.menu.EnableGfxUniforms(flags, name, type, shader_flags);
            
      if(this.children){
         
         const btn = this.children.buffer[0];
         if(btn) btn.EnableGfxUniforms(flags, name, type, shader_flags);
      } 
      
   }
   /** */
   GfxCtxSetFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {

      if (this.gfx_ctx_parent === INT_NULL) {

         if ((this.gfx_ctx_flags & GFX_CTX_FLAGS.NEW)===0) {
            this.gfx_ctx_flags = FLAGS;
            this.gfx_ctx_parent = gfx_ctx_parent;
         }

         if(recurse){
            if(this.menu) this.menu.GfxCtxSetFlag(FLAGS, gfx_ctx_parent, recurse);
         }

         const btn = this.children.buffer[0];
         btn.GfxCtxSetFlag(FLAGS, gfx_ctx_parent, recurse);
      }
   }
   /** */
   GfxCtxAddFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {

      if (this.gfx_ctx_parent === INT_NULL) {

         this.gfx_ctx_flags |= FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;

         if(recurse){
            if(this.menu) this.menu.GfxCtxAddFlag(FLAGS, gfx_ctx_parent, recurse);
         }

         const btn = this.children.buffer[0];
         btn.GfxCtxAddFlag(FLAGS, gfx_ctx_parent, recurse);
      }
   }
   /** */
   EnableGfxOperations(function_operation, blend_mode) {

      super.EnableGfxOperations(function_operation, blend_mode);
      if(this.menu) this.menu.EnableGfxOperations(function_operation, blend_mode);
            
      if(this.children){
         const btn = this.children.buffer[0];
         if(btn) btn.EnableGfxOperations(function_operation, blend_mode);
      }
   }
   /** */
   GfxUniformsSetClbk(unif_name, Clbk, clbk_params){

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);

      // if(unif_name === 'u_wposxy'){

      //    // Call for each root mesh in every vertex buffer
      //    const root_meshes = Root_group_per_vb_meshidx_view_get_all_roots(this.root_bufferidx, unif_name, Clbk, clbk_params);
      //    const len = root_meshes.length;
      //    for(let i=1; i < len; i++){
      
      //       const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshes[i]);
      //       root_mesh.SetClbkGfxUniforms(unif_name, Clbk, root_mesh.root_posidx);
      
      //    }
      // }

   }
   /** */
   RenderToNewRenderGroup() {
      this.gfx_ctx_flags |= GFX_CTX_FLAGS.RENDER_GROUP_NEW;

      // Assure independent rendering for each dropdown children, if their shaders differ from the dropdown's


      if(Sid_check_match(this.sid, this.menu.sid) === false) {
         btn.gfx_ctx_flags |= GFX_CTX_FLAGS.RENDER_GROUP_NEW;
      }

      const btn = this.children.buffer[0];
      if(Sid_check_match(this.sid, btn.sid) === false) {
         btn.gfx_ctx_flags |= GFX_CTX_FLAGS.RENDER_GROUP_NEW;
      }

      // Text is certain to have different shader 
      btn.text_mesh.gfx_ctx_flags |= GFX_CTX_FLAGS.RENDER_GROUP_NEW;
   }

   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   /** If FLAG===PRIVATE, then we get the gfx of the parent. If no parent exists, then the Gfx_generate_context creates new gfx. */
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx=INT_NULL) {

      if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      const temp = (this.gfx_ctx_flags & GFX_CTX_FLAGS.NEW) ? INT_NULL : specific_vb_groupidx
      const ret = Gfx_generate_context(FLAGS, this, temp);
      this.gfx = ret.gfx;
      // Add to view group
      View_add_mesh(this.group_bufferidxs[0], this, ret.is_root_widget_on_reused_vb);
      
      const btn = this.children.buffer[0];
      btn.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, this.gfx.vb.groupidx); // Set button's area gfx same with dropDown mesh 
      
      this.menu.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, this.gfx.vb.groupidx)

      return this.gfx;
   }
   /** */
   Render() {
alert('00000111119999922222')
      // super.AddToGfx();
      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE_FLAGS.ACTIVE)) {
         super.AddToGfx()
      }

      const btn = this.children.buffer[0];
      btn.Render();

      if (this.isOn & DP_MENU_STATE.ON) {
         for (let i = 0; i <= this.children.boundary; i++) {
            if(this.children.buffer[i]) this.children.buffer[i].Render();
         }
      }

      if(this.menu.scroller_comp) {

         const scrolled_section = this.menu;

         Scoller_component_render(scrolled_section.scroller_comp)
         Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(this.root_posidx, scrolled_section.scroller_comp.root_posidx)
         this.AddChildScrollerIdx(scrolled_section.scroller_comp_idx);

         if(0) { // TODO: Scroller component should store if it has scissor box enabled
            // Set scissor box
            const mx = scrolled_section.mesh_bufferidx;
            const my = scrolled_section.scroller_comp.mesh_bufferidx;
            const mw = scrolled_section.mesh_bufferidx;
            const mh = scrolled_section.scroller_comp.mesh_bufferidx;
            Vertex_buffer_group_create_scissorbox(scrolled_section.gfx.vb.groupidx, mx, my, mw, mh);
         }
      }

   }
   /** */
   Rerender() {

      super.AddToGfxFromReset();

      const btn = this.children.buffer[0];
      btn.Rerender();

      if (this.isOn & DP_MENU_STATE.ON) {
         this.menu.Rerender();
      }

   }
   /** */
   EnableScroller(scroller_params) {

      // Components_create_scroller_component(scroller_params.width, scroller_params.max_height, this.menu, scroller_params.bar_col, scroller_params.handle_col, scroller_params.parent);
      const scroller = Components_create_scroller_component(scroller_params.width, scroller_params.max_height, this, scroller_params.bar_col, scroller_params.handle_col, scroller_params.parent);
      this.AddItem(scroller);
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
    * This fuction must be called through 'Construct_listen_events_from_mesh_tree()', because it does not check if 'mesh.listeners' is null buffer
   */
   ListenEventConstruct() {

      const dp = this;
      const btn = this.children.buffer[0];


      /****************************************************************************/
      if (dp.state.mask & MESH_STATE_FLAGS.ACTIVE) {
         
         // Construct HOVER event
         if (dp.listeners && dp.listeners.buffer[E.H] === INT_NULL) {
            Mesh_listener_add(dp, E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (dp.listeners && dp.listeners.buffer[E.C] === INT_NULL) {

            // Create listener on dropdown only for move events OR for hierarchy reasons, if we need to be the parent event of all mesh events in its menu 
            const evt_params = { target_mesh: dp, };
            // // Mesh_listener_add(dp, E.C, dp.OnClick, evt_params);
            // Mesh_listener_add(btn, E.C, dp.OnClick, evt_params);
            // // btn.AddListenEvent(E.C, dp.OnClick, evt_params);

            Mesh_listener_add(dp, E.C, dp.OnClick, evt_params);
            Mesh_listener_add(btn, E.C, dp.OnClick, evt_params);

            // dp.AddListenEvent(E.C, dp.OnClick, evt_params);
            // btn.AddListenEvent(E.C, dp.OnClick, evt_params);
         }
         else if (btn.listeners && btn.listeners.buffer[E.C] === INT_NULL) { // Definitely need to create dropdown's button click

            const evt_params = { target_mesh: dp, };
            Mesh_listener_add(btn, E.C, dp.OnClick, evt_params);
         }
      }

      
      return false;

   }

   
   // SEE: ## OnClick()
   /** */
   OnClick(params) {

      const dp = params.evt_params.target_mesh;

      /*DEBUG*/if (!params.evt_params) { console.error('Target_params.params is null, in a OnClick() event. evt_params:', params.evt_params); return; }
      /*DEBUG*/if (dp.rootidx === INT_NULL) { alert('Root for dropdown must be set. ', Mesh_get_name(dp)); return; }

      const btn = dp.children.buffer[0];

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

         State_mesh_set_clicked(btn);
         State_mesh_set_focused(dp);
      }

      // Else the click happened anywhere in dropdown except the button area
      else if(dp.state.mask & MESH_STATE_FLAGS.IS_MOVABLE) { // Create move timeInterval if the dp has the move flag

         dp.OnMove({params:dp});
      }

      return true;
   }
   // SEE ### OnMove Events Implementation Logic
   /** */
   OnMove(params) {

      const dp = params.params;

      /** Create Move event.
       * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
       * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
       */
      const idx = Time_intervals_create(10, 'Move Widget_Dropdown', TIME_INTERVAL_REPEAT_ALWAYS, Rect_mesh_on_move_clbk, dp);
      dp.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

      if (Mesh_state_check(dp, MESH_STATE_FLAGS.IS_GRABABLE)) {

         State_mesh_set_grabed(dp);
         State_mesh_set_focused(dp);
         Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: dp })
         dp.StateEnable(MESH_STATE_FLAGS.IN_GRAB | MESH_STATE_FLAGS.IN_FOCUS);
      }


   }








   /*******************************************************************************************************************************************************/
   // Setters_Getters
   /*******************************************************************************************************************************************************/
   
   /** */
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
   /** */
   SetType(type_flag) {

      this.type |= type_flag;
      const btn = this.children.buffer[0];
      btn.type |= type_flag;
      btn.text_mesh.type |= type_flag;

   }
   /** */
   SetText(text) {
      const btn = this.children.buffer[0];
      btn.text_mesh.RenderTextFromString(text);
   }
   /** */
   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
      const btn = this.children.buffer[0];
      btn.SetIsGfxInserted(flag);
   }




   /*******************************************************************************************************************************************************/
   // Align
   /*******************************************************************************************************************************************************/
   
   /** */
   AlignNEW(pos_x, pos_y) {

      this.geom.pos[0] = pos_x;
      this.geom.pos[1] = pos_y;

      this.menu.AlignNEW(pos_x, pos_y);

      const btn = this.children.buffer[0];
      btn.AlignNEW(pos_x, pos_y);

      return {
         dim_x: this.geom.dim[0],
         dim_y: this.geom.dim[1],
      };
   }




   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   /** */
   #DeactivateMenu(dp = null) {

      if (!dp) dp = this;
      this.menu_active = false; // Set state to active.

      const menu = dp.menu;
               
      // Set opened/closed dp text
      const btn = this.children.buffer[0];
      btn.text_mesh.SliceText(0, 1);
      btn.text_mesh.SetTextAtIndex(this.dp_symbols[0], 0);

      if (dp.isOn & DP_MENU_STATE.ON) {
         for (let j = 0; j <= menu.children.boundary; j++) {

            const item = menu.children.buffer[j]; 

            if(item){

               // If the menu's item mesh is of type dropdown, run recursively to deactivate mesh's menu.
               if (item.type & MESH_TYPE.WIDGET_DROP_DOWN && item.is_gfx_inserted) {

                  const btn = item.children.buffer[0];
                  btn.text_mesh.SliceText(0, 1);
                  btn.text_mesh.SetTextAtIndex(this.dp_symbols[0], 0);
   
                  // item.RemoveFromMeshPerVbBuffer();
                  item.Deactivate();
                  item.SetIsGfxInserted(false);
   
                  // console.log(item.GetName())
                  Mesh_listener_remove(item);
                  
                  
                  if (item.isOn & DP_MENU_STATE.ON) this.#DeactivateMenu(item); // Run recursive for every dropdown in every menu
               }
               else {
                  if (item.gfx && item.is_gfx_inserted) {
                     
                     // item.RemoveFromMeshPerVbBuffer();
                     item.Deactivate();
                     item.SetIsGfxInserted(false);
                     
                     // console.log(item.GetName())
                     Mesh_listener_remove(item);
                  }
               }
            }
         }

         if (menu.gfx && menu.is_gfx_inserted) {

            menu.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;

            // Widget_group_update_decrement(root.group_bufferidxs, menu.geom.num_faces, menu);
            menu.is_gfx_inserted = false;
         }
      }

      dp.isOn |= DP_MENU_STATE.OFF;
      dp.isOn &= ~DP_MENU_STATE.ON;

   }


   /** */
   DpDeactivateMenu() {

      const menu = this.menu;
      
      this.#DeactivateMenu();
      this.RemoveChildByIdx(menu.idx); // Rememove menu from drop down

      const root_meshidx = Root_group_view_buffer_get_root_meshidx(this.root_bufferidx);
      const widget_root = Mesh_buffer_get_mesh_byidx(root_meshidx);
      
      // Re-calculate layout
      if(widget_root.align.flags & LAYOUT.TYPE_GROW_CONTAINER) Layout_grow_containers_pre_render_with_item_reposition(widget_root);
      else Layout_basic_pre_render(widget_root);

      // Layout_expand_x_axis(menu);
      
      // Re-create listen events 
      Construct_listen_events_from_mesh_tree(menu);
      Construct_listen_events_relations_from_mesh_tree(menu);
      
      // Re-calculate scrollers
      if(menu.has_children_scrollers) {
         for(let i=0; i <= menu.children_scrollers_buffer.boundary; i++) {
            const scroller_comp = Components_get_scroller_component(menu.children_scrollers_buffer.buffer[i]);
            // Scroller_component_set_pos_from_scrolled_section(scroller_comp);
            Scroller_component_calculate_handle_pos_dim(scroller_comp);
            // Vertex_buffer_group_update_scissorbox(scroller_comp.scrolled_gsection.gfx.vb.groupidx);
         }
      }

      if(menu.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_NEW) { // for fast activation
         // Activate specific render groups
         View_reset_rendergroup_draw_count(menu.gfx.vb.render_groupidx);
      }
      else { // Render the whole buffer mesh by mesh for each render group
         View_reset_rendering_buffer_whole_view_group(menu.group_bufferidxs[0]);
         View_render_from_view_NEW(menu.group_bufferidxs[0]);
      }


   }


   /** */
   #ActivateMenu() {

      const menu = this.menu;
      this.menu_active = true; // Set state to active.

      menu.state.mask |= MESH_STATE_FLAGS.ACTIVE;
               
      // Set opened/closed dp text
      const btn = this.children.buffer[0];
      btn.text_mesh.SliceText(0, 1);
      btn.text_mesh.SetTextAtIndex(this.dp_symbols[1], 0);

      // Activate menu's items, recursively
      for (let i = 0; i <= menu.children.boundary; i++) {

         const item = menu.children.buffer[i];

         if(item){

            item.Activate();
            
            if (item.type & MESH_TYPE.WIDGET_DROP_DOWN) { // Case item is another dropdown
               
               const btn = item.children.buffer[0];
               if (item.menu_active) { // Case the item dropdown has an 'active' menu, activate the item's menu (runs recursive for any opened sub menus). 
                  
                  // If the menu was deactivated while open, then on activation keep its '-' symbol
                  btn.text_mesh.SliceText(0, 1);
                  btn.text_mesh.SetTextAtIndex(this.dp_symbols[1], 0);
                  item.#ActivateMenu();
               }
            }
         }
      }

      this.isOn |= DP_MENU_STATE.ON;
      this.isOn &= ~DP_MENU_STATE.OFF;

   }


   /** */
   DpActivateMenu() {

      const menu = this.menu;

      this.AddItem(menu); // Add the menu, which is a storage of Widget_Dropdown only, as a child to the drop_down
      this.#ActivateMenu(); // Set all menu item's as 'active'

      const root_meshidx = Root_group_view_buffer_get_root_meshidx(this.root_bufferidx);
      const widget_root = Mesh_buffer_get_mesh_byidx(root_meshidx);
     
      // Re-calculate layout
      if(widget_root.align.flags & LAYOUT.TYPE_GROW_CONTAINER) Layout_grow_containers_pre_render_with_item_reposition(widget_root);
      else Layout_basic_pre_render(widget_root);
      
      // Layout_expand_x_axis(menu);
      
      // Re-create listen events 
      Construct_listen_events_from_mesh_tree(menu);
      Construct_listen_events_relations_from_mesh_tree(menu);
      
      // Re-calculate scrollers
      if(menu.has_children_scrollers) {
         for(let i=0; i <= menu.children_scrollers_buffer.boundary; i++) {
            const scroller_comp = Components_get_scroller_component(menu.children_scrollers_buffer.buffer[i]);
            // Scroller_component_set_pos_from_scrolled_section(scroller_comp);
            Scroller_component_calculate_handle_pos_dim(scroller_comp);
            // Vertex_buffer_group_update_scissorbox(scroller_comp.scrolled_gsection.gfx.vb.groupidx);
            console.log(menu.scroller_comp_idx, scroller_comp.geom.pos[1])
         }
      }

      if(menu.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_NEW) { // for fast activation
         if(menu.is_gfx_inserted) {
            // Activate specific render groups
            View_calculate_rendergroup_draw_count(menu.group_bufferidxs);
         }
         else { // First time menu is rendered
            // Render menu's rendergroup
            // TODO: Render the rest of the render groups that belong to the menu...
            View_render_specific_render_group(mesh.group_bufferidxs[0], mesh.group_bufferidxs[1], mesh.group_bufferidxs[2], );
         }
      }
      // Slower
      else { // Render the whole buffer mesh by mesh for each render group
         View_reset_rendering_buffer_whole_view_group(menu.group_bufferidxs[0]);
         View_render_from_view_NEW(menu.group_bufferidxs[0]);
      }

   }

}



