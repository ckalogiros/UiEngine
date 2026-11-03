"use strict";

import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "../Geometry/Geometry.js";
import { Material, Material_Atlas_Texture, Material_Texture } from "../Material/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Vertex_buffer_add_vertices_from_render_group } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Root_group_view_buffer_add_mesh, Root_group_view_buffer_create_root } from "../../Core/Views/RootView.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Mouse_get_pos, Mouse_get_pos_dif } from "../../Controls/Input/Mouse.js";
import { Mesh_unif_add_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { State_mesh_set_clicked, State_mesh_set_clickhold, State_mesh_set_focused, State_mesh_set_grabed } from "../../../GlobalFunctions.js";
import { Components_create_scroller_component, Scroller_component_movexy, Scroller_component_resize_y } from "../Widgets/ScrollerComponent.js";
import { Mesh_add_and_copy_wpos_xy, Mesh_get_real_pos_xy_obj_t } from "../Operations/MeshAttributesFunctions.js";
import { Mesh_get_name, Mesh_listener_add, Mesh_listener_create, Mesh_set_name, Mesh_set_root_in_focus, Mesh_state_check } from "../Operations/MeshPropertiesFunctions.js";
import { Layout_grow_containers_pre_render_with_item_reposition } from "../Operations/AlignNestedSections.js";
import { View_add_mesh, View_create_new_group, View_render_whole_view_group_NEW, View_reset_rendering_buffer_whole_view_group, View_update_scissorbox } from "../../Core/Views/MeshBufferViews.js";
import { Physics2D_update_pos_xy } from "../../Physics2D/Physics2D.js";
import { Renderqueue_set_priority_by_vb } from "../../Renderers/Renderer/RenderQueue.js";


/** */
export class Rect_Mesh extends Mesh {

   /**
    * @param {*} properties { is_root, pos, dim, col, num_faces, pad, style, is_debug_mesh, } 
    */
   constructor(mesh_bufferidx, properties) {

      const geom = new Geometry2D(properties.pos, properties.dim, _, properties.num_faces);

      // Create texture if the user has passed a texture id of type:TEXTURES.
      const mat = (properties.texture_id === undefined) ? new Material(properties.col) :
         (properties.sub_texture_id !== INT_NULL && properties.sub_texture_id !== undefined) ? new Material_Atlas_Texture(properties.col, properties.texture_id, properties.sub_texture_id, _) : new Material_Texture(properties.col, properties.texture_id);


      super(geom, mat);

      this.sid.unif |= SID.UNIF.ROOT_WPOS2;

      this.mesh_bufferidx = mesh_bufferidx;

      this.StylesSetPad(properties.pad);
      Mesh_set_name(this, `${properties.name}`);


      if (properties.is_root & ROOT_WIDGETS.CREATE_ROOT) {
         this.root_bufferidx = Root_group_view_buffer_create_root(this.mesh_bufferidx);
         if (this.group_bufferidxs[0] === INT_NULL) {
            this.group_bufferidxs[0] = View_create_new_group(this);
         }
      }

      this.type |= MESH_TYPE.RECT_MESH | properties.is_debug_mesh;

      this.SetLayout(properties.layout)
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
   AddItem(mesh) {

      const idx = this.children.Add(mesh);
      mesh.idx = idx;
      mesh.parent = this;

      // Add to view group
      if(this.group_bufferidxs[0] !== INT_NULL) {
         mesh.SetViewGroupIndex(this.group_bufferidxs[0]);
      }

      if (this.root_bufferidx !== INT_NULL && mesh.root_bufferidx === INT_NULL) {
         mesh.AddToWidgetRootBuffer(this.root_bufferidx);
      }

      if((this.state.mask & MESH_STATE_FLAGS.ACTIVE)===0) 
         mesh.StateDisable(MESH_STATE_FLAGS.ACTIVE);

      return idx;
   }



   /****************************************************************************************************************************************************/
   // OVERIDEN METHODS

   /** */
   Activate() {

      this.state.mask |= MESH_STATE_FLAGS.ACTIVE;

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Activate();
      }
   }
   /** */
   Deactivate() { // TODO: ADD to all widget-Mesh classes

      this.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
      // View_remove_mesh(this.group_bufferidxs, this.geom.num_faces);

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Deactivate();
      }
   }

   /** */
   StateEnable(MASK = 0x0) { this.state.mask |= MASK; }
   /** */
   StateDisable(MASK = 0x0) { this.state.mask &= ~MASK; }
   /** */
   SetTypeDebug() { this.type |= MESH_TYPE.DEBUG_MESH; }
   /** */
   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.AddToWidgetRootBuffer(root_bufferidx);
      }

   }
   /** */
   SetViewGroupIndex(view_groupidx) {

      this.group_bufferidxs[0] = view_groupidx;

      for (let i = 0; i <= this.children.boundary; i++) {

         // Store view group index
         const child = this.children.buffer[i];
         if (child) child.SetViewGroupIndex(view_groupidx);
      }

   }

   /** */
   GfxCtxSetFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

      if (this.gfx_ctx_parent === INT_NULL) {
         
         if ((this.gfx_ctx_flags  & GFX_CTX_FLAGS.NEW)===0) {
            this.gfx_ctx_flags = FLAGS;
            this.gfx_ctx_parent = gfx_ctx_parent;
         }

         if (recurse) {
            for (let i = 0; i <= this.children.boundary; i++) {
               if (this.children.buffer[i]) this.children.buffer[i].GfxCtxSetFlag(FLAGS, gfx_ctx_parent, recurse);
            }
         }
      }
   }
   /** */
   GfxCtxAddFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

      if (this.gfx_ctx_parent === INT_NULL) {

         this.gfx_ctx_flags |= FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;

         if (recurse) {
            for (let i = 0; i <= this.children.boundary; i++) {
               if (this.children.buffer[i]) this.children.buffer[i].GfxCtxAddFlag(FLAGS, gfx_ctx_parent, recurse);
            }
         }
      }
   }
   /** */
   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // FIXME: The clbk_params for unif_wpos is the vb_groupidx, BUT instead is passed recursively from the 'section.GfxUniformsSetClbk()'
      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      // for (let i = 0; i <= this.children.boundary; i++) {
      //    const child = this.children.buffer[i];
      //    if (child && child.gfx) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
      // }
   }
   /** */
   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
   }
   /** */
   RenderToNewRenderGroup() {
      this.gfx_ctx_flags |= GFX_CTX_FLAGS.RENDER_GROUP_NEW;
   }



   /*******************************************************************************************************************************************************/
   // Graphics
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL, specific_view_group = INT_NULL) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      const ret = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);
      this.gfx = ret.gfx;

      // Add to view group
      View_add_mesh(this.group_bufferidxs[0], this, ret.is_root_widget_on_reused_vb);


      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         child.GenGfxCtx(FLAGS, specific_vb_groupidx);
      }

   }
   Render(run_for_children = true) {

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE_FLAGS.ACTIVE)) {
         this.AddToGfx();
      }

      if (run_for_children) {
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.Render();
         }
      }

      if (this.scroller_comp) {

         // Scoller_component_render(this.scroller_comp);
         // // Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(this.root_posidx, this.scroller_comp.root_posidx)
         // const aaa = this.scroller_comp.base_unif_wpos ? this.scroller_comp.base_unif_wpos : this
         // Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(aaa.root_posidx, this.scroller_comp.root_posidx)
         // this.AddChildScrollerIdx(this.scroller_comp_idx);

         // Scroller_component_calculate_handle_pos_dim(this.scroller_comp);

         // if(0) { // TODO: Scroller component should store if it has scissor box enabled
         //    // Set scissor box
         //    const mx = this.mesh_bufferidx;
         //    const my = this.scroller_comp.mesh_bufferidx;
         //    const mw = this.mesh_bufferidx;
         //    const mh = this.scroller_comp.mesh_bufferidx;
         //    Vertex_buffer_group_create_scissorbox(this.gfx.vb.groupidx, mx, my, mw, mh);
         // }
      }

   }
   AddToGfx() {

      Vertex_buffer_add_vertices_from_render_group(this.gfx, this.geom, this.mat, _, Mesh_get_name(this));
      this.is_gfx_inserted = true;

      return this.gfx.vb.start;
   }
   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      Vertex_buffer_add_vertices_from_render_group(this.gfx, this.geom, this.mat, _, Mesh_get_name(this), true);

      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      this.is_gfx_inserted = true;

   }
   /** */
   EnableScroller(scroller_params) {

      const scroller = Components_create_scroller_component(scroller_params.width, scroller_params.max_height, this, scroller_params.bar_col, scroller_params.handle_col, scroller_params.parent);
      this.AddItem(scroller);
   }



   /*******************************************************************************************************************************************************/
   // Alignment
   AlignNEW(pos_x, pos_y) {

      const dif_y = pos_y - this.geom.pos[1];
      
      const pad_x = this.StylesGetPad(STYLES.AXIS.X);
      const pad_y = this.StylesGetPad(STYLES.AXIS.Y);
      this.geom.pos[0] = pos_x + pad_x;
      this.geom.pos[1] = pos_y + pad_y;
      
      // TEMPORARY
      // HACK: TODO: Implement AlignNEW() in scroller
      if(this.type & MESH_TYPE.WIDGET_SCROLLER_BAR) {
         
         const handle = this.children.buffer[0];
         const handle_pad = handle.StylesGetPad();
         handle.geom.pos[0] = this.geom.pos[0] + handle_pad[0];
         handle.geom.pos[1] = handle.geom.pos[1]+dif_y;
      }

      return {
         dim_x: this.geom.dim[0],
         dim_y: this.geom.dim[1],
         pad_x: pad_x / 2,
         pad_y: pad_y / 2,
      };

   }




   /*******************************************************************************************************************************************************/
   // Listeners
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

      if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

         // Construct HOVER event
         if (mesh.listeners && mesh.listeners.buffer[E.H] === INT_NULL) {
            Mesh_listener_add(mesh, E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (mesh.listeners && mesh.listeners.buffer[E.C] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            Mesh_listener_add(mesh, E.C, mesh.OnClick, evt_params);
         }
         if (mesh.listeners && mesh.listeners.buffer[E.K] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            // HACK: Assuming mesh has no other callbacks stored, 0 index is used 
            if(mesh.event_clbks.buffer[0]) Mesh_listener_add(mesh, E.K, mesh.event_clbks.buffer[0], evt_params);
            else alert('99187223332. Constructing KEY_PRESS listener->No callback is set.');
         }
      }

      return true;
   }
   OnClick(params) {

      const mesh = params.evt_params.target_mesh;

      State_mesh_set_clicked(mesh);

      // This is to bind a click event to a mesh.
      if (mesh.evt_params && mesh.evt_params.EventClbk) {

         // Create time interval to continuously press the button
         if (Mesh_state_check(mesh, MESH_STATE_FLAGS.IS_HOLD_CLICK)) {

            const EventClbk = mesh.evt_params.EventClbk;
            const target_params = mesh.evt_params.params.target_params
            const idx = Time_intervals_create(1, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            State_mesh_set_clickhold(mesh);
         }
         else {

            const EventClbk = mesh.evt_params.EventClbk;
            EventClbk(mesh.evt_params);
         }
      }
      // This is for move and/or resize events
      else if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const pos = Mesh_get_real_pos_xy_obj_t(mesh);
         const right = pos.x + mesh.geom.dim[0] * 2;
         const bottom = pos.y + mesh.geom.dim[1] * 2;

         const point = Mouse_get_pos();
         if (mesh.state.mask & MESH_STATE_FLAGS.IS_RESIZEABLE && (point.x > right - TEMP_RESIZE_MARGIN[0] || point.y > bottom - TEMP_RESIZE_MARGIN[1])) {

            // We have Resize
            if (point.x > right - TEMP_RESIZE_MARGIN[0] && point.y > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
               // console.log('X Y RESIZE');

               const OnResizeFn = mesh.OnResize;
               const idx = Time_intervals_create(1, 'ResizeXY Section', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, mesh);
               mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }
            else if (point.x > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
               // console.log('X RESIZE');
            }
            else { // Its a height resize
               // console.log('Y RESIZE');
            }

            mesh.state.mask |= MESH_STATE_FLAGS.IN_RESIZE | MESH_STATE_FLAGS.IN_GRAB | MESH_STATE_FLAGS.IN_FOCUS;
            State_mesh_set_grabed(mesh);
            // State_mesh_set_focused(mesh);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            Mesh_set_root_in_focus(mesh.root_bufferidx);

            return true;
         }


         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = Time_intervals_create(1, 'Move Section', TIME_INTERVAL_REPEAT_ALWAYS, Rect_mesh_on_move_clbk, mesh);
         mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (Mesh_state_check(mesh, MESH_STATE_FLAGS.IS_GRABABLE)) {

            State_mesh_set_grabed(mesh);
            State_mesh_set_focused(mesh);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            mesh.StateEnable(MESH_STATE_FLAGS.IN_GRAB | MESH_STATE_FLAGS.IN_FOCUS);
            // TODO: Create a set focus function, that repositions the vertex buffers in the render queue

         }

      }


      return true;

   }
   OnResize(params) {

      const root = params.params;

      // NOTE: We use the same element of the mesh's interval buffer for the resize event as the move event, they cannot both exist at the same time. 
      if (Mesh_state_check(root, MESH_STATE_FLAGS.IN_GRAB) === 0 && root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         Time_intervals_destroy_byidx(intervalIdx);
         root.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

         return;
      }

      const mouse_pos = Mouse_get_pos();


      // Set min dimentions. // TODO: Who decides for the minimum dimentions??????
      const pos = Mesh_get_real_pos_xy_obj_t(root);
      const min_sizex = pos.x + 80;
      const min_sizey = pos.y + 80;
      let changes_hapened = false;



      if (mouse_pos.x > min_sizex) {

         // console.log('1', root.geom.dim[1])
         if(root.scroller_comp) {
            // const scroller_comp = Components_get_scroller_component(root.children_scrollers_buffer.buffer[i]);
            // Scroller_component_set_pos_from_scrolled_section(scroller_comp);
            // Scroller_component_calculate_handle_pos_dim(root.scroller_comp);
         }

         const sizex = mouse_pos.x - pos.x;
         root.geom.dim[0] = sizex / 2;
         changes_hapened = true;
      }

      if (mouse_pos.y > min_sizey) {

         // console.log('1', root.geom.dim[1])
         
         const sizey = (mouse_pos.y - pos.y)/2;
         root.geom.dim[1] = sizey;
         changes_hapened = true;
         if(root.scroller_comp) {

            const pad_y = root.StylesGetPad(STYLES.AXIS.Y);
            Scroller_component_resize_y(root.scroller_comp, sizey-pad_y);
            // const scroller_comp = Components_get_scroller_component(root.children_scrollers_buffer.buffer[i]);
            // Scroller_component_set_pos_from_scrolled_section(root.scroller_comp);
            // Scroller_component_calculate_handle_pos_dim(root.scroller_comp);
         }
      }



      if (changes_hapened) {

         const root_pos = Mesh_get_real_pos_xy_obj_t(root);
         const clip_top = root_pos.y;
         const clip_bottom = root_pos.y + root.geom.dim[1] * 2;
         const clip_right = root_pos.x + root.geom.dim[0] * 2;

         View_reset_rendering_buffer_whole_view_group(root.group_bufferidxs[0]);


         if(root.align.flags & LAYOUT.TYPE_GROW_CONTAINER) 
            Layout_grow_containers_pre_render_with_item_reposition(root);
            // Layout_grow_containers_pre_render(root);


         // Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
         // for (let i = 0; i <= root.children.boundary; i++) {
         //    // Clipy_from_tree_recursive(root.children.buffer[i], clip_top, clip_bottom);
         // }
         // Clipx_from_group(root.group_bufferidxs[0], 0, clip_right);

         // First reset the buffer that holds all meshes(per vertex buffer), because the 'AddFromGfx' is gonna populate the buuffer with the added mesh
         // Root_group_vbidx_view_reset_mesh_per_vb_buffer(root.root_bufferidx);
         
         View_render_whole_view_group_NEW(root.group_bufferidxs[0]);
         // View_render_from_view_NEW(root.group_bufferidxs[0]);

      }
   }
   Bind(EventClbk = null, targetBindingFunctions = _, params, click_flags) {

      if (!EventClbk) { EventClbk = Button_click_default_callback; params = 'Button'; }

      this.evt_params = { // Create the parameters to pass for the button's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };

      if (click_flags) this.state.mask |= click_flags;

      Mesh_listener_create(this, LISTEN_EVENT_TYPES.CLICK_UP);

      // If there is a click event already created
   }

   SetRenderPriority(flag) {
      Renderqueue_set_priority_by_vb(flag, this.gfx.vb.groupidx);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {
            Renderqueue_set_priority_by_vb(flag, child.gfx.vb.groupidx);
            if (child.text_mesh) 
               Renderqueue_set_priority_by_vb(flag, child.text_mesh.gfx.vb.groupidx);
         }
      }
   }

}
/** */
export function Rect_mesh_on_move_clbk(params) {

   const rect = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (Mesh_state_check(rect, MESH_STATE_FLAGS.IN_GRAB) === 0 && rect.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = rect.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      Time_intervals_destroy_byidx(intervalIdx);
      rect.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

      return;
   }


   
   const mouse_dif = Mouse_get_pos_dif();
   // console.log('M HIT', mouse_dif.x, mouse_dif.y)
   if ((mouse_dif.x === 0 && mouse_dif.y === 0)) return;
   
   // console.log('M HIT', mouse_dif.x, mouse_dif.y)

   // If mesh has physics - Update physics
   if(rect.physics.idx !== INT_NULL) {
      // // const collision_group_idx = rect.physics.collision.group_idx, collider_idx = rect.physics.collision.collision_idx;
      // // Physics2D_collision_detection_all_with_all(collision_group_idx, collider_idx);
      Mesh_add_and_copy_wpos_xy(rect, mouse_dif.x, -mouse_dif.y);
      Physics2D_update_pos_xy(rect.physics.idx, rect.geom.pos[0], rect.geom.pos[1]);
      return;
   }

   // Else - Move by uniform position if rect is root and has a root_posidx, else move local space
   if(rect.root_posidx === INT_NULL) {
      Mesh_add_and_copy_wpos_xy(rect, mouse_dif.x, -mouse_dif.y);
   }
   else {
      Mesh_unif_add_vb_root_wpos(rect.root_posidx, mouse_dif.x, -mouse_dif.y);
   }

   
   /********************************************************************************************************************/
   // Set any scrollbar
   // TODO: We need to make the scroller visible to the root parent 'rect' mesh.
   if (rect.scroller_comp !== null || rect.has_children_scrollers)
      Scroller_component_movexy(rect.children_scrollers_buffer, mouse_dif.x, -mouse_dif.y);

   if(rect.scroller_comp)
      View_update_scissorbox(rect.group_bufferidxs[0]);
}