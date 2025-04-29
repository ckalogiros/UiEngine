"use strict";

import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "../Geometry/Geometry.js";
import { Material, Material_Atlas_Texture, Material_Texture } from "../Material/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset, Vertex_buffer_group_create_scissorbox } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Root_group_reset_gfxs, Root_group_resize_and_rerender, Root_group_vbidx_view_reset_mesh_per_vb_buffer, Root_group_view_buffer_add_mesh, Root_group_view_buffer_create_root } from "../../Core/Views/RootView.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";
import { Mesh_set_root_in_focus } from "../Operations/MeshHelperFunctions.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Mouse_get_pos, Mouse_get_pos_dif } from "../../Controls/Input/Mouse.js";
import { Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { State_mesh_set_clicked, State_mesh_set_clickhold, State_mesh_set_focused, State_mesh_set_grabed } from "../../../GlobalFunctions.js";
import { Components_create_scroller_component, Components_get_scroller_component, Scoller_component_gengfx, Scoller_component_gengfx_and_render, Scoller_component_render, Scroller_component_calculate_handle_pos_dim, Scroller_component_movexy } from "../Widgets/ScrollerComponent.js";
import { Mesh_get_real_pos_xy } from "../Operations/MeshAttributesFunctions.js";
import { Mesh_get_name, Mesh_listener_add, Mesh_listener_create, Mesh_set_name, Mesh_state_check } from "../Operations/MeshPropertiesFunctions.js";
import { Align_pre_simple___with_grow_containers } from "../Operations/AlignNestedSections.js";


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
      // console.log(properties.name, properties.col)

      this.sid.unif |= SID.UNIF.ROOT_WPOS2;

      this.mesh_bufferidx = mesh_bufferidx;

      this.StylesSetPad(properties.pad);
      Mesh_set_name(this, `${properties.name}`);


      if (properties.is_root & ROOT_WIDGETS.CREATE_ROOT) {
         this.root_bufferidx = Root_group_view_buffer_create_root(this.mesh_bufferidx);
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
   AddItem(mesh, options = 0x0) {

      this.options |= options;

      const idx = this.children.Add(mesh);
      mesh.idx = idx;
      mesh.parent = this;


      if (this.root_bufferidx !== INT_NULL && mesh.root_bufferidx === INT_NULL) {
         mesh.AddToWidgetRootBuffer(this.root_bufferidx)
      }

      mesh.StateEnable(this.state.mask & MESH_STATE_FLAGS.ACTIVE);

      // If it is the first child, then HORIZONTAL layout must be applied.
      // if (mesh.align.flags & LAYOUT.VERTICAL && idx === 0) {
      //    mesh.align.flags &= ~LAYOUT.VERTICAL ;
      //    mesh.align.flags |= LAYOUT.HORIZONTAL;
      // }

      // console.error(Mesh_get_name(this), 'horr', this.align.TEMP_children_hor, 'vert', this.align.TEMP_children_vert)
      return idx;
   }
   /** */
   AddChild(mesh) {

      mesh.idx = this.children.Add(mesh);

      mesh.parent = this;

      return mesh.idx;
   }



   /****************************************************************************************************************************************************/
   // OVERIDEN METHODS
   /** */
   Destroy() {

      let is_child_shifted = false;
      for (let i = 0; i <= this.children.boundary; i++) {

         if (this.children.buffer[i]) is_child_shifted = this.children.buffer[i].Destroy();
         // IMPORTANT: Because of the (childrens) buffer shifts remaining children, the buffer is getting smaller, and we need to reduce the index too.           
         if (is_child_shifted) {
            i -= 1;
            is_child_shifted = false;
         }
      }
      return super.Destroy();
   }
   /** */
   Activate() {

      this.state.mask |= MESH_STATE_FLAGS.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Activate();
      }
   }
   /** */
   Deactivate() {

      this.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
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
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
      }
   }
   /** */
   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
   }



   /*******************************************************************************************************************************************************/
   // Graphics
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         child.GenGfxCtx(FLAGS, specific_vb_groupidx);
      }

      if (this.scroller_comp) {

         Scoller_component_gengfx(this.scroller_comp,);
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

         Scoller_component_render(this.scroller_comp);
         // Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(this.root_posidx, this.scroller_comp.root_posidx)
         const aaa = this.scroller_comp.base_unif_wpos ? this.scroller_comp.base_unif_wpos : this
         Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(aaa.root_posidx, this.scroller_comp.root_posidx)
         this.AddChildScrollerIdx(this.scroller_comp_idx);

         if(0) { // TODO: Scroller component should store if it has scissor box enabled
            // Set scissor box
            const mx = this.mesh_bufferidx;
            const my = this.scroller_comp.mesh_bufferidx;
            const mw = this.mesh_bufferidx;
            const mh = this.scroller_comp.mesh_bufferidx;
            Vertex_buffer_group_create_scissorbox(this.gfx.vb.groupidx, mx, my, mw, mh);
         }
      }

   }
   AddToGfx() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, Mesh_get_name(this));
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }
   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      Vertex_buffer_add_vertices_from_reset(this.gfx, this.geom, this.mat, _, Mesh_get_name(this))

      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

   }

   EnableScroller(scroller_params) {

      const scroller = Components_create_scroller_component(scroller_params.width, scroller_params.max_height, this, scroller_params.bar_col, scroller_params.handle_col, scroller_params.parent);

      this.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
      this.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

      // this.AddChild(scroller);
      // this.AddItem(scroller);
   }



   /*******************************************************************************************************************************************************/
   // Alignment
   AlignNEW(pos_x, pos_y) {

      const pad_x = this.StylesGetPad(STYLES.AXIS.X);
      const pad_y = this.StylesGetPad(STYLES.AXIS.Y);
      this.geom.pos[0] = pos_x + pad_x;
      this.geom.pos[1] = pos_y + pad_y;

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
      }

      return true;
   }
   OnClick(params) {

      const section = params.evt_params.target_mesh;

      State_mesh_set_clicked(section);

      // This is to bind a click event to a section.
      if (section.evt_params && section.evt_params.EventClbk) {

         // Create time interval to continuosly press the button
         if (Mesh_state_check(section, MESH_STATE_FLAGS.IS_HOLD_CLICK)) {

            const EventClbk = section.evt_params.EventClbk;
            const target_params = section.evt_params.params.target_params
            const idx = Time_intervals_create(16, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
            section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            State_mesh_set_clickhold(section);
         }
         else {

            const EventClbk = section.evt_params.EventClbk;
            EventClbk(section.evt_params);
         }
      }
      // This is for move and/or resize events
      else if (section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const pos = Mesh_get_real_pos_xy(section);
         const right = pos[0] + section.geom.dim[0] * 2;
         const bottom = pos[1] + section.geom.dim[1] * 2;

         const point = Mouse_get_pos();
         if (section.state.mask & MESH_STATE_FLAGS.IS_RESIZEABLE && (point[0] > right - TEMP_RESIZE_MARGIN[0] || point[1] > bottom - TEMP_RESIZE_MARGIN[1])) {

            // We have Resize
            if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
               // console.log('X Y RESIZE');

               const OnResizeFn = section.OnResize;
               const idx = Time_intervals_create(10, 'ResizeXY Section', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, section);
               section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }
            else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
               // console.log('X RESIZE');
            }
            else { // Its a height resize
               // console.log('Y RESIZE');
            }

            section.state.mask |= MESH_STATE_FLAGS.IN_RESIZE | MESH_STATE_FLAGS.IN_GRAB | MESH_STATE_FLAGS.IN_FOCUS;
            State_mesh_set_grabed(section);
            // State_mesh_set_focused(section);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            Mesh_set_root_in_focus(section.root_bufferidx);

            return true;
         }


         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = Time_intervals_create(10, 'Move Section', TIME_INTERVAL_REPEAT_ALWAYS, Rect_mesh_on_move_clbk, section);
         section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (Mesh_state_check(section, MESH_STATE_FLAGS.IS_GRABABLE)) {

            State_mesh_set_grabed(section);
            State_mesh_set_focused(section);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            section.StateEnable(MESH_STATE_FLAGS.IN_GRAB | MESH_STATE_FLAGS.IN_FOCUS);
            // Root_group_set_in_focus(section.root_bufferidx);
            // Mesh_set_root_in_focus(section.root_bufferidx);

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
      const pos = Mesh_get_real_pos_xy(root);
      const min_sizex = pos[0] + 80;
      const min_sizey = pos[1] + 80;
      let changes_hapened = false;



      if (mouse_pos[0] > min_sizex) {

                  // console.log('1', root.geom.dim[1])
                  if(root.scroller_comp) {
                     // const scroller_comp = Components_get_scroller_component(root.children_scrollers_buffer.buffer[i]);
                     // Scroller_component_set_pos_from_scrolled_section(scroller_comp);
                     Scroller_component_calculate_handle_pos_dim(root.scroller_comp);
                  }

         const sizex = mouse_pos[0] - pos[0];
         root.geom.dim[0] = sizex / 2;
         changes_hapened = true;
      }

      if (mouse_pos[1] > min_sizey) {

                  // console.log('1', root.geom.dim[1])
                  if(root.scroller_comp) {
                     // const scroller_comp = Components_get_scroller_component(root.children_scrollers_buffer.buffer[i]);
                     // Scroller_component_set_pos_from_scrolled_section(scroller_comp);
                     Scroller_component_calculate_handle_pos_dim(root.scroller_comp);
                  }

         const sizey = mouse_pos[1] - pos[1];
         root.geom.dim[1] = sizey / 2;
         changes_hapened = true;
         console.log(sizey/2 - root.geom.dim[1])
      }



      if (changes_hapened) {


         Root_group_reset_gfxs(root.root_bufferidx)

         const root_pos = Mesh_get_real_pos_xy(root);
         const clip_top = root_pos[1];
         const clip_bottom = root_pos[1] + root.geom.dim[1] * 2;
         const clip_right = root_pos[0] + root.geom.dim[0] * 2;


         if(root.align.flags & LAYOUT.TYPE_GROW_CONTAINER) Align_pre_simple___with_grow_containers(root);

         
         
         // // console.log('1', root.geom.dim[1])
         // if(root.scroller_comp) {
         //    // const scroller_comp = Components_get_scroller_component(root.children_scrollers_buffer.buffer[i]);
         //    // Scroller_component_set_pos_from_scrolled_section(scroller_comp);
         //    Scroller_component_calculate_handle_pos_dim(root.scroller_comp);
         // }
         // console.log('2', root.geom.dim[1])



         // Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
         for (let i = 0; i <= root.children.boundary; i++) {

            Clipy_from_tree_recursive(root.children.buffer[i], clip_top, clip_bottom);
         }
         // Clipx_from_group(root.group_bufferidxs[0], 0, clip_right);

         // First reset the buffer that holds all meshes(per vertex buffer), because the 'AddFromGfx' is gonna populate the buuffer with the added mesh
         Root_group_vbidx_view_reset_mesh_per_vb_buffer(root.root_bufferidx);

         const mouse_dif = Mouse_get_pos_dif()
         const dif = { x: mouse_dif.x / 2, y: -mouse_dif.y / 2 };
         Root_group_resize_and_rerender(root.root_bufferidx, dif.x, dif.y);
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

}


export function Rect_mesh_on_move_clbk(params) {

   const section = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (Mesh_state_check(section, MESH_STATE_FLAGS.IN_GRAB) === 0 && section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      Time_intervals_destroy_byidx(intervalIdx);
      section.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_dif = Mouse_get_pos_dif();
   if (mouse_dif.x === 0 && mouse_dif.y === 0) return;

   Mesh_unif_add_vb_root_wpos(section.root_posidx, mouse_dif.x, -mouse_dif.y);


   /********************************************************************************************************************/
   // Set any scrollbar
   // TODO: We need to make the scroller visible to the root parent 'section' mesh.
   if (section.scroller_comp !== null || section.has_children_scrollers)
      Scroller_component_movexy(section.children_scrollers_buffer, mouse_dif.x, -mouse_dif.y);

}