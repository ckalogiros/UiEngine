"use strict";

import { CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Mouse_get_pos, Mouse_get_pos_dif } from "../../Controls/Input/Mouse.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { Relative_pos_comp_recalc_all } from "../Operations/RelativePosComponent.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_add_vb_root_wpos, Mesh_unif_set_vb_root_wposx_all_siblings, Mesh_unif_set_vb_root_wpos_all_siblings, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Set_color_a } from "../Operations/MeshAttributesFunctions.js";
import { BLUEL } from "../Material/Base/Colors.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";
import { Mesh } from "./Base/Mesh.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Material, Texture_Material } from "../Material/Base/Material.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Root_group_view_buffer_add_mesh, Root_group_view_buffer_create_root, Root_group_reset_gfxs, Root_group_vbidx_view_reset_mesh_per_vb_buffer, Root_group_resize_and_rerender } from "../../Core/Views/RootView.js";
import { Scroller_component_movexy } from "../Widgets/ScrollerComponent.js";
import { Mesh_set_root_in_focus } from "../Operations/MeshHelperFunctions.js";







// export class Section extends Rect {
// export class Section extends Rect_Mesh {
export class Section extends Mesh {

   // options: BIT-FIELD. Stores some state for 'this'.
   // pad:     [1,1] Stores pad for the meshes in-between space.
   // max_size:[1,1] Stores the max x-y size of all children meshes (not accumulative).
   // clampy Array: [x,y:[top,bottom,threshold]] clamp values. The threshold is a float, which added to the clamp value gives the absolute limit above/below to which a mesh should/should't be rendered 
   // total_margin


   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), pad = [4, 4], pos = [200, 400, 0],
      dim = [40, 40], col = TRANSPARENCY(BLUEL[6], .6), name = 'SECTION UNAMED', style = {rcorners:4, feather:2, border:0}, num_faces = 1, textureId=INT_NULL, is_debug_mesh) {

      const geom = new Geometry2D(pos, dim, _, num_faces);
      // Create texture if the user has passed a texture id of type:TEXTURES.
      const mat = (textureId===INT_NULL) ? new Material(col) : new Texture_Material(col, textureId);

      super(geom, mat);

      this.mesh_bufferidx = mesh_bufferidx;
      this.total_margin = [0, 0];
      this.options = options;
      this.StylesSetPad(pad);
      this.max_size = [0, 0];
      this.min_size = [0, 0];
      this.last_pos = [0, 0];


      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

      // In order to provide more info about the current section mesh. The 'SECTION_MESH_ONLY' could be disabled by another widget that 
      // extends section class, in order to call it's classes methods instead of the mother class(the Section)
      this.type |= MESH_TYPE.SECTION_MESH | MESH_TYPE.SECTION_MESH_ONLY; // FIXME: The SECTION_MESH_ONLY is set for a dropdown calling this constructor from super

      this.SetName(`[${this.mesh_bufferidx}]{${name}}-SECTION`);

      this.SetStyle(style);


      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT) {
         this.root_bufferidx = Root_group_view_buffer_create_root(this.mesh_bufferidx);
      }
   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Activate();
      }
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Deactivate();
      }
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].StateEnable(MASK);
      }
   }


   StateDisable(MASK = 0x0) {


      this.state.mask &= ~MASK;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].StateDisable(MASK);
      }
   }


   SetTypeDebug() {
      this.type |= MESH_TYPE.DEBUG_MESH;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].SetTypeDebug();
      }
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   Destroy() {

      // Any children destruction
      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) {
            // console.log('Destroy:', child.GetName(), 'chldren:', child.children.active_count, 'numfaces:', child.geom.num_faces)
            const shift_children = child.Destroy();
            if (shift_children) i--;
         }
      }

      // section's destruction
      return super.Destroy();
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.AddToWidgetRootBuffer(root_bufferidx);
      }

   }


   SetGfxEnableAttributes(which, params) {
      alert('777\nSetGfxEnableAttributes\nSection')
   }


   /** Must run for every mesh */
   GfxUniformsEnable(flags, name, type, shader_flags) {

      super.EnableGfxUniforms(flags, name, type, shader_flags);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.GfxUniformsEnable(flags, name, type, shader_flags);
      }

   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
      }

      // if(this.scroller_comp) this.scroller_comp.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
   }


   AddItem(mesh, options = 0x0) {

      this.options |= options;

      const idx = this.children.Add(mesh);
      mesh.idx = idx;
      mesh.parent = this;
   

      if (this.root_bufferidx !== INT_NULL && mesh.root_bufferidx === INT_NULL) {
         mesh.AddToWidgetRootBuffer(this.root_bufferidx)
      }

      mesh.isFramebufferRendered = this.isFramebufferRendered;
      mesh.StateEnable(this.state.mask & MESH_STATE.ACTIVE);

      return idx;
   }


   GfxCtxSetFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {

      if (this.gfx_ctx_parent === INT_NULL) {

         this.gfx_ctx_flags = FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;

         if(recurse){
            for (let i = 0; i <= this.children.boundary; i++) {
               if (this.children.buffer[i]) this.children.buffer[i].GfxCtxSetFlag(FLAGS, gfx_ctx_parent, recurse);
            }
         }
      }
   }


   /**
    * 
    * @param {*} FLAGS 
    * @param {*} gfx_ctx_parent Pass a parent to which the GenGfx will run to, preventing any search above parent mesh in the widget root tree structure
    */
   GfxCtxAddFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {

      if (this.gfx_ctx_parent === INT_NULL) {

         this.gfx_ctx_flags |= FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;

         if(recurse){
            for (let i = 0; i <= this.children.boundary; i++) {
               if (this.children.buffer[i]) this.children.buffer[i].GfxCtxAddFlag(FLAGS, gfx_ctx_parent, recurse);
            }
         }
      }
   }







   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   // HACK: I need to pass an extra param from Menu_bar widget, so that its children are handled by its class(all that because Widget_Menu_Bar inherits from Section)
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      // const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx);
      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child.gfx_ctx_flags) FLAGS = child.gfx_ctx_flags;
         child.GenGfxCtx(FLAGS, specific_vb_groupidx);
      }

   }


   Render(run_for_children = true) {

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) {
         this.AddToGfx()
      }

      if (run_for_children) {
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.Render();
            // console.log('2', child.GetName())
         }
      }

   }
   

   AddToGfx() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }


   Rerender(run_for_children = true) {

      super.AddToGfxFromReset();

      if (run_for_children) {
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child && (child.state.mask & MESH_STATE.ACTIVE)) {

               child.Rerender();
            }
         }
      }
   }


   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      Vertex_buffer_add_vertices_from_reset(this.gfx, this.geom, this.mat, _, this.GetName())
      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)

      
      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);
      this.is_gfx_inserted = true;

      return this.gfx.vb.start;
   }

   
   DeactivateGfx() {

      super.DeactivateGfx();

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.DeactivateGfx();
      }
   }





   /*******************************************************************************************************************************************************/
   // Setters-Getters
   /*******************************************************************************************************************************************************/

   GetMaxWidth() { return this.geom.dim[0]; }


   GetMaxHeight() { return this.geom.dim[1]; }


   SectionSetPad() {
      this.geom.dim[0] += this.StylesGetPad(STYLES.AXIS.X);
      this.geom.dim[1] += this.StylesGetPad(STYLES.AXIS.Y);
   }


   SetUpdateFrameBuffer() {
      if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetFrameBufferIdx(fbidx);
      }
   }


   SetPosX(x) {

      super.SetPosX(x);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosXYNoGfxUpdate(x);
      }
   }


   SetPosY(y) {

      super.SetPosY(y);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosY(y);
      }
   }


   SetPosXNoGfxUpdate(x) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         // Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
         Mesh_unif_set_vb_root_wposx_all_siblings(this.root_posidx, x); // TODO: Do this in all SetPos...NoGfxUpdate functions in all classes
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         this.geom.pos[0] = x;
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.SetPosXNoGfxUpdate(x);
         }
      }
   }


   SetPosYNoGfxUpdate(y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         this.geom.pos[1] = y;
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.SetPosYNoGfxUpdate(y);
         }
      }
   }


   SetPosXYNoGfxUpdate(x, y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         // Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
         Mesh_unif_set_vb_root_wpos_all_siblings(this.root_posidx, x, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.SetPosXYNoGfxUpdate(x, y);
         }
      }
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
      return true;
   }


   OnClick(params) {

      const section = params.evt_params.target_mesh;

      STATE.mesh.SetClicked(section);

      // This is to bind a click event to a section.
      if (section.evt_params && section.evt_params.EventClbk) {

         // Create time interval to continuosly press the button
         if (section.StateCheck(MESH_STATE.IS_HOLD_CLICK)) {

            const EventClbk = section.evt_params.EventClbk;
            const target_params = section.evt_params.params.target_params
            const idx = Time_intervals_create(16, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
            section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            STATE.mesh.SetClickHold(section);
         }
         else  {

            const EventClbk = section.evt_params.EventClbk;
            EventClbk(section.evt_params);
         }
      }
      // This is for move and/or resize events
      else if (section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const pos = section.GetPosXY();
         const right = pos[0] + section.geom.dim[0] * 2;
         const bottom = pos[1] + section.geom.dim[1] * 2;

         const point = Mouse_get_pos();
         // console.log(section)
         if (section.state.mask & MESH_STATE.IS_RESIZEABLE && (point[0] > right - TEMP_RESIZE_MARGIN[0] || point[1] > bottom - TEMP_RESIZE_MARGIN[1])) {

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

            section.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS;
            STATE.mesh.SetGrabed(section);
            // STATE.mesh.SetFocused(section);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            Mesh_set_root_in_focus(section.root_bufferidx);

            return true;
         }


         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = Time_intervals_create(10, 'Move Section', TIME_INTERVAL_REPEAT_ALWAYS, Section_on_move_clbk, section);
         section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (section.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(section);
            STATE.mesh.SetFocused(section);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            section.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
            // Root_group_set_in_focus(section.root_bufferidx);
            // Mesh_set_root_in_focus(section.root_bufferidx);

         }

      }


      return true;

   }


   OnResize(params) {

      const root = params.params;

      // NOTE: We use the same element of the mesh's interval buffer for the resize event as the move event, they cannot both exist at the same time. 
      if (root.StateCheck(MESH_STATE.IN_GRAB) === 0 && root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         Time_intervals_destroy_byidx(intervalIdx);
         root.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

         return;
      }

      const mouse_pos = Mouse_get_pos();


      // Set min dimentions. // TODO: Who decides for the minimum dimentions??????
      const pos = root.GetPosXY();
      const min_sizex = pos[0] + 80;
      const min_sizey = pos[1] + 80;
      let changes_hapened = false;



      if (mouse_pos[0] > min_sizex) {

         const sizex = mouse_pos[0] - pos[0];
         root.geom.dim[0] = sizex / 2;
         changes_hapened = true;
      }

      if (mouse_pos[1] > min_sizey) {

         const sizey = mouse_pos[1] - pos[1];
         root.geom.dim[1] = sizey / 2;
         changes_hapened = true;
      }



      if (changes_hapened) {


         Root_group_reset_gfxs(root.root_bufferidx)

         const root_pos = root.GetPosXY();
         const clip_top = root_pos[1];
         const clip_bottom = root_pos[1] + root.geom.dim[1] * 2;
         const clip_right = root_pos[0] + root.geom.dim[0] * 2;

         // Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
         for (let i = 0; i <= root.children.boundary; i++) {

            Clipy_from_tree_recursive(root.children.buffer[i], clip_top, clip_bottom);
         }
         // Clipx_from_group(root.group_bufferidxs[0], 0, clip_right);

         // First reset the buffer that holds all meshes(per vertex buffer), because the 'AddFromGfx' is gonna populate the buuffer with the added mesh
         Root_group_vbidx_view_reset_mesh_per_vb_buffer(root.root_bufferidx);


         const mouse_dif = Mouse_get_pos_dif()
         const dif = { x: mouse_dif.x / 2, y: -mouse_dif.y / 2 };
         // const dif = {x:mouse_dif.x, y: -mouse_dif.y};  
         Root_group_resize_and_rerender(root.root_bufferidx, dif.x, dif.y);
         // Root_group_resize_and_rerender(root.root_bufferidx, root.geom.dim[0], root.geom.dim[1]);
      }
   }


   RemoveTimeInterval(idx) {
      const intervalIdx = this.timeIntervalsIdxBuffer.buffer[idx];
      if(intervalIdx===-1){
         console.error('intervalIdx', intervalIdx, 'this.timeIntervalsIdxBuffer.buffer', this.timeIntervalsIdxBuffer.buffer)
         alert('4177834776439 \nIssue with timeInterval\nPossible error: We overloaded the time intervals buffer\nThe buffer currently holds up to two intervals\nINTERVALS.UPDATE and INTERVALS.MOVE\nTry to dissable mesh Move event')
      }
      Time_intervals_destroy_byidx(intervalIdx);
      this.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(idx);
   }



   /*******************************************************************************************************************************************************/
   // Transformations
   /*******************************************************************************************************************************************************/

   AddWposXY(x, y) {

      if (x === 0 && y === 0) return;
      
      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      // if(this.state.mask & MESH_STATE.ACTIVE) 
      this.geom.AddWposXY(this.gfx, x, y);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if(child===undefined || child===null) alert('43321455265 \n child is null');
         child.AddWposXY(x, y);
      }

   }


   AddWposX(x) {

      if (x === 0) return;
      
      this.geom.pos[0] += x;
      // if(this.state.mask & MESH_STATE.ACTIVE) 
      this.geom.AddWposY(this.gfx, x);
      
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if(child===undefined || child===null) alert('43321455265 \n child is null');
         child.AddWposX(x);
      }

   }
   

   AddWposY(y) {

      if (y === 0) return;
      
      this.geom.pos[1] += y;
      // if(this.state.mask & MESH_STATE.ACTIVE) 
      this.geom.AddWposY(this.gfx, y);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if(child===undefined || child===null) alert('43321455265 \n child is null');
         
         child.AddWposY(y);
      }
      
   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveNoGfxUpdate(x, y);
      }

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveYNoGfxUpdate(y);
      }

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveXNoGfxUpdate(x);
      }

   }


   TEMP_recalc(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.TEMP_recalc(x, y);
      }

   }


   TEMP_recalc_x(x) {

      this.geom.pos[0] += x;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.TEMP_recalc_x(x);
      }

   }


   SetPosXY(x, y) { Section_set_posxy_children_recursive(x, y, this); }


   SetPosX(x) { super.SetPosX(x); }


   SetColorAlpha(alpha) {

      Set_color_a(this, alpha);

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) Set_color_a(child, alpha);
      }
   }


   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetIsGfxInserted(flag)
      }
   }


   Resize() {
      alert('IMPLEMENT ME\nResize()\nSection.js')
      // console.log('\n==== Resizing:', this.GetName())
      // console.log()
      // this.SetColorRGB([1,1,0]);
   }


   RotateZ(angle) {

      super.RotateZ(angle);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) Section_rotatez_children_recursive(child, angle);
      }
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   OptionsEnable(MASK = 0x0) {

      this.options |= MASK;
      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child && child.options) child.OptionsEnable(MASK);
      }
   }


   Calc_no_gfx_update(options, target_child_idx) {

      if(!this.gfx) 
         alert('6655119982 \n First GenGfxCtx() and then call Calc_no_gfx_update()')

      const section = this;
      if (options === _) options = section.options; // Here set as options: the passed options(de-activates any mesh self-set-options), or the mesh self-options

      if (section.options & SECTION.FIXED_W) section.max_size[0] = section.geom.dim[0];
      if (section.options & SECTION.FIXED_H) section.max_size[1] = section.geom.dim[1];

      Calculate_sizes_recursive(section, options, target_child_idx);


      if (section.type & MESH_TYPE.WIDGET_DROP_DOWN) {
         CopyArr2(section.geom.dim, section.max_size); // Set size for the root dp.
         CopyArr2(section.geom.defDim, section.max_size); // Store to default for the root.
      }
      else {
         if (options & SECTION.RESIZE_PARENT) CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         else {
            if (options & SECTION.RESIZE_PARENTX) section.geom.dim[0] = section.max_size[0];
            if (options & SECTION.RESIZE_PARENTY) section.geom.dim[1] = section.max_size[1];
         }
      }

      // console.log('mesh', section.GetName(), section.geom.dim)


      Expand(section, options);


      section.SectionSetPad();

      Calculate_positions_no_gfx_update_recursive(section, options, section.geom.pos, target_child_idx, _);

      return section.max_size;

   }


   Recalc_no_gfx_update(options, target_child_idx = INT_NULL) {

      const section = this;

      if (target_child_idx === INT_NULL)
         this.Reset(section);
      return this.Calc_no_gfx_update(options, target_child_idx);
   }


   Reset(section) {

      // if(section.children.boundary > 2) console.log('mesh', section.GetName(), 'mesh children', section.children)
      for (let i = 0; i <= section.children.boundary; i++) {

         const mesh = section.children.buffer[i];

         if (mesh && mesh.children.active_count && mesh.type & MESH_TYPE.SECTION_MESH) {
            this.Reset(mesh);
         }
      }
      section.max_size[0] = 0;
      section.max_size[1] = 0;

   }


   Bind(EventClbk = null, targetBindingFunctions = _, params, click_flags) {


      this.evt_params = { // Create the parameters to pass for the button's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };

      if (click_flags) this.state.mask |= click_flags;

      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

   }


}



















/****************************************************************************************************************************************************/
/****************************************************************************************************************************************************/
// FUNCTIONS
/****************************************************************************************************************************************************/



function Section_rotatez_children_recursive(mesh, angle) {

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child && child.type & MESH_TYPE.SECTION_MESH) { // Case anothe section, run recursively
         Section_rotatez_children_recursive(child, angle);
      }
   }

   mesh.RotateZ(angle);
}



function Section_set_posxy_children_recursive(pos, mesh) {

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];

      if (child) {
         if (child.type & MESH_TYPE.SECTION_MESH) { // Case another section, run recursively
            Section_set_posxy_children_recursive(pos, child);
         }
         else { // NOTE: To avoid moving section twice (as a child and as a section from recursion)
            child.SetPosXY(pos[0], pos[1]);
         }
      }
   }

   mesh.geom.SetPosXY(mesh.gfx, pos[0], pos[1]);

}



export function Section_on_move_clbk(params) {

   const section = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (section.StateCheck(MESH_STATE.IN_GRAB) === 0 && section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

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
   if(section.scroller_comp !== null || section.has_children_scrollers) 
      Scroller_component_movexy(section.children_scrollers_buffer, mouse_dif.x, -mouse_dif.y);

}



export function Expand(parent, options, _width = 0) {

   // const width = parent.geom.dim[0] + parent.StylesGetMargin(STYLES.AXIS.X);
   let width = parent.geom.dim[0] - parent.StylesGetPad(STYLES.AXIS.X);
   if (width < _width) width = _width;
   let opt = options

   for (let i = 0; i <= parent.children.boundary; i++) {

      const child = parent.children.buffer[i];

      if (child) {

         const pad = child.StylesGetPad();

         if (options & SECTION.INHERIT) opt = parent.options;

         if (child.type & MESH_TYPE.WIDGET_LABEL) {
            // // For other than section widgets, the parent should control child expansion 
            if (options & SECTION.EXPAND) {
               child.geom.dim[0] = width;
               child.geom.defDim[0] = child.geom.dim[0] + pad[0];
            }
         }
         else if (child.type & MESH_TYPE.SECTION_MESH) {
            // For section widgets, the child's options should control child expansion 

            if (opt & SECTION.VERTICAL) {
               if (child.options & SECTION.EXPAND) {
                  child.geom.dim[0] = width;
                  child.geom.defDim[0] = child.geom.dim[0] + pad[0];
               }
            }
            else if (opt & SECTION.HORIZONTAL) {
               if (child.options & SECTION.EXPAND) {
                  child.geom.dim[0] = width;
                  child.geom.defDim[0] = child.geom.dim[0] + pad[0];
               }
            }

            // Expand(child, opt, width);
            width = Expand(child, opt, width);
            // if(width < _width) width = _width;
         }
         else {

            if (opt & SECTION.VERTICAL) {
               if (child.options & SECTION.EXPAND) {
                  child.geom.dim[0] = width;
                  child.geom.defDim[0] = child.geom.dim[0] + pad[0];
               }
            }
            else if (opt & SECTION.HORIZONTAL) {
               // width -= child.geom.dim[0] *2
               // child.geom.dim[0] = width;
               // child.geom.defDim[0] = child.geom.dim[0] + pad[0];
            }
         }
      }
   }

   return width
}



// TODO: For calculating multi-word text, if we need separate flags (HORIZONTAL | VERTICAL), we need to store the flags in the mesh. 
export function Calculate_sizes_recursive(parent, options, target_child_idx, recur_cnt = 0) {


   const prev_size = [
      parent.max_size[0],
      parent.max_size[1],
   ];
   const accum_size_per_section = [0, 0]; // TODO: See how accum_size_per_section is working and remove it if there is another solution
   parent.max_size[0] = 0
   parent.max_size[1] = 0

   let opt = (options !== undefined) ? options : parent.options


   const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;


   if (parent.text_mesh) {

      if (parent.options & SECTION.VERTICAL) {

         accum_size_per_section[0] = parent.text_mesh.GetMaxWidth();
         parent.max_size[1] += parent.text_mesh.geom.dim[1];

         if (parent.max_size[0] < accum_size_per_section[0])
            parent.max_size[0] = parent.geom.dim[0]; // For horizontal, grow to the max width of all meshes
      }
      else if (parent.options & SECTION.HORIZONTAL) {

         accum_size_per_section[0] += parent.text_mesh.GetMaxWidth();
         parent.max_size[0] += parent.text_mesh.GetMaxWidth();

         if (parent.max_size[1] < accum_size_per_section[1])
            parent.max_size[1] = parent.geom.dim[1];  // For horizontal, grow to the max height of all meshes
      }
   }

   const child_accum_size = [0, 0]; // A max size for the current children loop
   let prev_align = 0x0;

   for (let i = target_idx; i <= parent.children.boundary; i++) {

      const mesh = parent.children.buffer[i];
      // console.log('Size', mesh.GetName())


      if (mesh) {

         const marg = mesh.StylesGetMargin();
         const pad = mesh.StylesGetPad();

         // IMPORTANT: margin is to increase the PARENTS size, padd is for the mesh position inside parent


         let cur_align = 0x0

         // if(mesh.temp_align) opt // TODO: Copy align from mesh. So we need to add .Vertical/.Horizontal and remove .Vertical/.Horizontal from opt, cause the options and the .temp_align are not the same

         if (mesh.type & MESH_TYPE.WIDGET_MENU_BAR) {
            if ((mesh.options & SECTION.INHERIT) === 0) opt = mesh.options;


            Calculate_sizes_recursive(mesh, opt, _, recur_cnt++); // Recurse if child mesh is of type of Section
            // recur_cnt++
            if ((mesh.options & SECTION.INHERIT) === 0) opt = parent.options; // Roll back to the options


            if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) === 0) {

               mesh.geom.dim[0] -= pad[0];
               mesh.geom.dim[1] = mesh.max_size[1];

               // Update mesh's default dim
               mesh.geom.defDim[0] = mesh.max_size[0] + pad[0];
               mesh.geom.defDim[1] = mesh.max_size[1] + pad[1];

            }

            mesh.SectionSetPad();

            if (opt & SECTION.VERTICAL) {
               if ((parent.options & SECTION.FIXED_W) === 0 && parent.max_size[0] < mesh.geom.dim[0])
                  parent.max_size[0] = mesh.geom.dim[0] + marg[0];
               if ((parent.options & SECTION.FIXED_H) === 0) parent.max_size[1] += mesh.geom.dim[1] + marg[1];
            }
            else if (opt & SECTION.HORIZONTAL) {
               if ((parent.options & SECTION.FIXED_W) === 0) parent.max_size[0] += mesh.geom.dim[0] + marg[0];
               if ((parent.options & SECTION.FIXED_H) === 0 && parent.max_size[1] < mesh.geom.dim[1]) parent.max_size[1] = mesh.geom.dim[1] + marg[1];
            }
         }
         else 
         if (mesh.type & MESH_TYPE.SECTION_MESH) {

            if ((mesh.options & SECTION.INHERIT) === 0) opt = mesh.options;

            // console.error('RECURSION', mesh.GetName())
            // if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) === 0) Calculate_sizes_recursive(mesh, opt, _, recur_cnt++); // Recurse if child mesh is of type of Section
            Calculate_sizes_recursive(mesh, opt, _, recur_cnt++); // Recurse if child mesh is of type of Section

            if ((mesh.options & SECTION.INHERIT) === 0) opt = parent.options; // Roll back to the options


            // if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) === 0) 
            // {
            // if (mesh.scroller_comp !== null) {
               
            // mesh.geom.dim[0] = mesh.max_size[0];
            // mesh.geom.dim[1] = mesh.scroller_comp.geom.dim[1];
            // parent.min_size[1] = mesh.scroller_comp.geom.dim[1];
               

               // Update mesh's default dim
               // mesh.geom.defDim[0] = mesh.max_size[0];
               // mesh.geom.defDim[1] = mesh.scroller_comp.geom.dim[1];
            // }
            // else 
            {
               
               mesh.geom.dim[0] = mesh.max_size[0];
               mesh.geom.dim[1] = mesh.max_size[1];
               
               
               // Update mesh's default dim
               mesh.geom.defDim[0] = mesh.max_size[0];
               mesh.geom.defDim[1] = mesh.max_size[1];
               
               mesh.SectionSetPad(); // Must not update for scrollers 
            }
            
            
            if (opt & SECTION.VERTICAL) {
               if ((parent.options & SECTION.FIXED_W) === 0 && parent.max_size[0] < mesh.geom.dim[0])
                  parent.max_size[0] = mesh.geom.dim[0] + marg[0];
               if (mesh.scroller_comp !== null){ // Case mesh is scrolled mesh, resize the parent to the scroll bar height.
                  parent.max_size[1] = mesh.scroller_comp.geom.dim[1];
                  parent.max_size[0] += mesh.scroller_comp.geom.dim[0];
               }
               else if ((parent.options & SECTION.FIXED_H) === 0) parent.max_size[1] += mesh.geom.dim[1] + marg[1];
            }
            else if (opt & SECTION.HORIZONTAL) {
               if ((parent.options & SECTION.FIXED_W) === 0) parent.max_size[0] += mesh.geom.dim[0] + marg[0];
               if (mesh.scroller_comp !== null){ // Case mesh is scrolled mesh, resize the parent to the scroll bar height.
                  parent.max_size[1] = mesh.scroller_comp.geom.dim[1];
                  parent.max_size[0] += mesh.scroller_comp.geom.dim[0];
               }
               else if ((parent.options & SECTION.FIXED_H) === 0 && parent.max_size[1] < mesh.geom.dim[1]) parent.max_size[1] = mesh.geom.dim[1] + marg[1];
            }

         }
         else if ((mesh.type & MESH_TYPE.TEXT_MESH) || (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC)) { // Case the current item is of type text.


            if (opt & SECTION.VERTICAL) {

               if (mesh.children.boundary) { // Case text mesh has separate text as children, calculate size of all of them.
                  accum_size_per_section[1] += mesh.GetMaxHeight();
                  parent.max_size[1] += mesh.GetMaxHeight() + marg[1];
               }
               else {
                  accum_size_per_section[1] += mesh.geom.dim[1] + marg[1];
                  parent.max_size[1] += mesh.geom.dim[1] + marg[1];
               }

               accum_size_per_section[0] = mesh.GetMaxWidth();
               if ((parent.options & SECTION.FIXED_W) === 0 && parent.max_size[0] < accum_size_per_section[0])
                  parent.max_size[0] = accum_size_per_section[0] + marg[0];  // Keep the max width of all meshes in Vertical mode.

            }
            else if (opt & SECTION.HORIZONTAL) {

               accum_size_per_section[0] += mesh.GetMaxWidth();
               parent.max_size[0] += mesh.GetMaxWidth() + marg[0];

               accum_size_per_section[1] = mesh.geom.dim[1];
               if ((parent.options & SECTION.FIXED_H) === 0 && parent.max_size[1] < accum_size_per_section[1])
                  parent.max_size[1] = mesh.geom.dim[1] + marg[1];  // Keep the max height of all meshes in Horizontal mode.
            }
         }
         else { // Case the current item is not a section either a text, accumulate its size

            if (mesh.temp_align & SECTION.HORIZONTAL) {

               cur_align = SECTION.HORIZONTAL
               child_accum_size[0] += mesh.geom.dim[0] + marg[0];

               if (parent.max_size[0] < child_accum_size[0]) {
                  parent.max_size[0] = child_accum_size[0];
               }

               // TODO: I think 'accum_size_per_section' shouldn't be changed here 
               if (parent.max_size[1] < accum_size_per_section[1]) {
                  parent.max_size[1] = accum_size_per_section[1];
               }

               prev_align = SECTION.HORIZONTAL
               child_accum_size[1] = 0;
            }
            else if (mesh.temp_align & SECTION.VERTICAL) {

               cur_align = SECTION.VERTICAL
               child_accum_size[0] = 0;

               // TODO: I think 'accum_size_per_section' shouldn't be changed here
               accum_size_per_section[1] += mesh.geom.dim[1] + marg[1];

               if (prev_align !== cur_align) {
                  // child_accum_size[0] += mesh.geom.dim[0];
                  child_accum_size[0] += mesh.geom.dim[0] + marg[0] / 2;
                  // if(parent.max_size[0] < child_accum_size[0]) {
                  //    // parent.max_size[0] = child_accum_size[0];
                  //    child_accum_size[0] += mesh.geom.dim[0] + marg[0]/2;
                  // }
               }

               // parent.max_size[1] += mesh.geom.dim[1];

               prev_align = SECTION.VERTICAL;
            }
            else if (opt & SECTION.VERTICAL) {

               accum_size_per_section[1] += mesh.geom.dim[1] + marg[1];
               accum_size_per_section[0] = mesh.geom.dim[0];

               if ((parent.options & SECTION.FIXED_H) === 0) {
                  parent.max_size[1] += mesh.geom.dim[1] + marg[1];
               }

               if ((parent.options & SECTION.FIXED_W) === 0 && parent.max_size[0] <= accum_size_per_section[0])
                  parent.max_size[0] = accum_size_per_section[0]; // For horizontal, grow to the max width of all meshes

            }
            else if (opt & SECTION.HORIZONTAL) {

               accum_size_per_section[0] += mesh.geom.dim[0] + marg[0];
               accum_size_per_section[1] = mesh.geom.dim[1];

               parent.max_size[0] += mesh.geom.dim[0] + marg[0];

               if (parent.max_size[1] < accum_size_per_section[1])
                  parent.max_size[1] = accum_size_per_section[1];  // For horizontal, grow to the max height of all meshes

            }
         }

         // console.log(
         //    '>>>>>',
         //    'dim', mesh.geom.dim[0],
         //    'max_size', mesh.max_size ? mesh.max_size[0] : 'null',
         //    'name', mesh.GetName(),
         // )
      }
   }


   if (parent.min_size[0] < parent.max_size[0])
      parent.min_size[0] = parent.max_size[0];
   if (parent.min_size[1] < parent.max_size[1])
      parent.min_size[1] = parent.max_size[1];

   const dif_max_size = [
      parent.max_size[0] - prev_size[0] - parent.StylesGetPad(STYLES.AXIS.X),
      parent.max_size[1] - prev_size[1] - parent.StylesGetPad(STYLES.AXIS.Y),
      // parent.max_size[0] - prev_size[0],
      // parent.max_size[1] - prev_size[1],
      recur_cnt,
   ];
   // console.log('dif_max_size', dif_max_size)
   return dif_max_size

}




export function Calculate_positions_no_gfx_update_recursive(parent, options, curr, target_child_idx) {


   const cur_pos = [
      curr[0] + parent.StylesGetPad(STYLES.AXIS.X),
      curr[1] + parent.StylesGetPad(STYLES.AXIS.Y),
   ];

   if(options & SECTION.HORIZONTAL_CENTER){
      cur_pos[0] += parent.geom.dim[0];
   }


   const start_posx = cur_pos[0];


   const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;

   for (let i = target_idx; i <= parent.children.boundary; i++) {

      const mesh = parent.children.buffer[i];

      if (mesh) {

         const marg = mesh.StylesGetMargin();
         let continue_recur = true;
         let opt = options

         if (options & SECTION.INHERIT) opt = parent.options


         cur_pos[0] += marg[0];
         cur_pos[1] += marg[1];

         // If center horizontal, then subtract the meshes half dimention
         if(options & SECTION.HORIZONTAL_CENTER){
            cur_pos[0] -= mesh.geom.dim[0];
         }

         
         
         const rel_pos = [cur_pos[0], cur_pos[1]];
         // console.log('##########', mesh.GetName(), rel_pos)

         if(mesh)
         
         if (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC) {
            
            mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);
            continue_recur = false;
         }
         else if (mesh.type & MESH_TYPE.WIDGET_SLIDER) {
            
            // mesh.SetPosXYNoGfxUpdate(rel_pos[0], rel_pos[1]);
            // mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);
            mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
            continue_recur = false;
         }
         else if (mesh.type & MESH_TYPE.WIDGET_DROP_DOWN) {

            mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
            continue_recur = false;
         }
         else if (mesh.type & MESH_TYPE.SECTION_MESH) { // For meshes with a parent of type Section

            mesh.geom.pos[0] = rel_pos[0];
            mesh.geom.pos[1] = rel_pos[1];
            // Case of menu bar, that has text directly as a child
            if (mesh.text_mesh) {
               mesh.text_mesh.geom.pos[0] = rel_pos[0]
               mesh.text_mesh.geom.pos[1] = rel_pos[1]
            }
         }
         else {

            mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);

            if (mesh.type & MESH_TYPE.WIDGET_SWITCH) continue_recur = false;
            if (mesh.text_mesh) continue_recur = false;
         }

         if (parent.rel_comp) {
            Relative_pos_comp_recalc_all(parent);
            continue_recur = false;
         }

         // Remove any added dimention from this mesh to the current position tracker
         if(options & SECTION.HORIZONTAL_CENTER){
            cur_pos[0] += mesh.geom.dim[0];
         }

         if (continue_recur) { // Continue recursively, if the mesh does not handle any its children.
            Calculate_positions_no_gfx_update_recursive(mesh, opt, cur_pos, _);
         }


         const next_mesh = parent.children.buffer[i + 1]

         // Increment current position tracker
         if (next_mesh && next_mesh.temp_align & SECTION.HORIZONTAL) {
            cur_pos[0] += mesh.geom.dim[0] * 2;
         }
         else if (next_mesh && next_mesh.temp_align & SECTION.VERTICAL) {
            cur_pos[1] += mesh.geom.dim[1] * 2;
            cur_pos[0] = start_posx;

         }
         else if (parent.options & SECTION.VERTICAL) {
            cur_pos[1] += mesh.geom.dim[1] * 2;
            parent.last_pos[1] += mesh.geom.dim[1] * 2;
         }
         else if (parent.options & SECTION.HORIZONTAL) {
            cur_pos[0] += mesh.geom.dim[0] * 2;
            parent.last_pos[0] += mesh.geom.dim[0] * 2;
            if (mesh.scroller_comp !== null){ // Include scroll bar in the position calculation.
               cur_pos[0] += mesh.scroller_comp.geom.dim[0]*2;
               parent.last_pos[0] += mesh.scroller_comp.geom.dim[0]*2;
            }
         }
      }

   }

}
