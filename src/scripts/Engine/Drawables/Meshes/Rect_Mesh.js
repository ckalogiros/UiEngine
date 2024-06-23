"use strict";

import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Material } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Mesh_per_vb_remove_mesh, Mesh_per_vb_store_mesh, Widget_root_add_mesh } from "../../Core/MeshBuffer.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset, Vertex_buffer_update_vertices } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy, Mesh_unif_is_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { BLUEL } from "../Material/Base/Colors.js";


export class Rect extends Mesh {

   constructor(pos = POSITION_CENTER, dim = [10, 10], col, num_faces, is_debug_mesh = 0x0) {

      // num_faces = 1
      const geom = new Geometry2D(pos, dim, _, num_faces);
      const mat = new Material(col);

      super(geom, mat);

      this.type |= MESH_TYPE.RECT_MESH | is_debug_mesh;

   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // OVERIDEN METHODS
   /****************************************************************************************************************************************************/
   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
   }


   SetTypeDebug() {
      this.type |= MESH_TYPE.DEBUG_MESH;
   }
   

   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

   }


   AddChild(mesh) {

      mesh.idx = this.children.Add(mesh);

      mesh.parent = this;

      return mesh.idx;
   }



   RemoveFromMeshPerVbBuffer() {
      Mesh_per_vb_remove_mesh(this.gfx.vb.groupidx, this.per_vb_bufferidx);
   }





   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      // if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      return this.gfx;
   }


   AddToGfx() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }


   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      Vertex_buffer_add_vertices_from_reset(this.gfx, this.geom, this.mat, _, this.GetName())

      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      // this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }


   // TODO: Use it
   UpdateGfx() {

      if (this.is_gfx_inserted)
         Vertex_buffer_update_vertices(this.gfx, this.geom, this.mat, this.GetName())
      else {
         Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
         this.is_gfx_inserted = true;
      }

      return this.gfx.vb.start;
   }





   /*******************************************************************************************************************************************************/
   // Setters-Getters
   /*******************************************************************************************************************************************************/

   GetMaxWidth() { return this.geom.dim[0]; }


   GetTotalHeight() { return this.geom.dim[1]; }


   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
   }


   SetPosX(x) {
      super.SetPosX(x);
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
   }


   SetPosXNoGfxUpdate(x) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else this.geom.pos[0] = x;
   }


   SetPosYNoGfxUpdate(y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else this.geom.pos[1] = y;
   }


   SetPosZNoGfxUpdate(val) {
      this.geom.pos[2] = val;
   }


   SetPosXYNoGfxUpdate(x, y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else {
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
      }
   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;
   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;
   }


   SetDimNoGfxUpdate(x, y) {

      this.geom.dim[0] = x;
      this.geom.pos[1] = y;
   }


   SetDimYNoGfxUpdate(y) {

      this.geom.dim[1] = y;
   }


   SetDimXNoGfxUpdate(x) {

      this.geom.dim[0] = x;
   }


   TEMP_recalc(x, y) {
      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
   }


   // SetMargin() {
   //    this.geom.dim[0] += this.StylesGetMargin(STYLES.AXIS.X);
   //    this.geom.dim[1] += this.StylesGetMargin(STYLES.AXIS.Y);
   // }



}



// TODO: IMPLEMENT
export class Rect_Mesh extends Rect {

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS,
      pos = [0, 0, 0], dim = [10, 10],
      col = TRANSPARENCY(BLUEL[6], .6), name = 'SECTION UNAMED',
      style = [10, 6, 2.], pad = [4, 4], num_faces = 1, is_debug_mesh) {
   
      super(pos, dim, col, num_faces, is_debug_mesh);

      const unif = {
         name: 'u_wposxy',
         type: UNIF_TYPE.FVEC2,
         which_shader: UNIFORM.IN_VS,
      };

      this.sid.unif |= SID.UNIF.ROOT_WPOS2
      this.sid.pass |= SID.PASS.WPOS2

      this.mesh_bufferidx = mesh_bufferidx;

      this.SetStyle(style)

   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // OVERIDEN METHODS
   /****************************************************************************************************************************************************/


   Destroy() {

      return super.Destroy();
   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         if(this.children.buffer[i]) this.children.buffer[i].Activate();
      }
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         if(this.children.buffer[i]) this.children.buffer[i].Deactivate();
      }
   }

   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if(child) child.AddToWidgetRootBuffer(root_bufferidx);
      }

   }

// TODO: This is wrong, cause we assume the children are NOT widgets with more children/meshes in them
   GfxCtxSetFlag(FLAGS){

      this.gfx_ctx_flags = FLAGS;
      for (let i = 0; i <= this.children.boundary; i++) {
         if(this.children.buffer[i]) this.children.buffer[i].gfx_ctx_flags = FLAGS;
      }
   }

   GfxUniformsEnable(flags, name, type, shader_flags) {

      super.EnableGfxUniforms(flags, name, type, shader_flags);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.EnableGfxUniforms(flags, name, type, shader_flags);
      }

   }
   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
      }
   }


   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      // if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx);
      return gfx;
   }


   Render() {

      if (this.state.mask & MESH_STATE.ACTIVE) super.AddToGfx();
   }


   Rerender() {

      super.AddToGfxFromReset();
   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   ConstructListeners(parent_listeners = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 

      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         const evt = mesh.listeners.buffer[etypeidx];
         if (evt) { // If event is not null
            const evt_params = {
               EventClbk: null,
               targetBindingFunctions: null,
               target_mesh: mesh,
               params: null,
            }
            mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, parent_listeners[etypeidx]);
         }
      }
   }

}