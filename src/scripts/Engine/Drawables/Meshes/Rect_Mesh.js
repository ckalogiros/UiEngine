"use strict";

import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Material } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { AddArr2, CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Batch_store } from "../../Batch/Batch.js";
import { Mesh_per_vb_remove_mesh, Mesh_per_vb_store_mesh, Widget_root_add_mesh } from "../../Core/MeshBuffer.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset, Vertex_buffer_update_vertices } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy, Mesh_unif_is_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";


export class Rect extends Mesh {

   constructor(pos = POSITION_CENTER, dim = [10, 10], col = BLUER3, is_debug_mesh = 0x0) {

      const geom = new Geometry2D(pos, dim);
      const mat = new Material(col);

      super(geom, mat);

      this.type |= MESH_TYPE.RECT_MESH | is_debug_mesh;

   }


   AddChild(mesh) {

      mesh.idx = this.children.Add(mesh);

      mesh.parent = this;

      return mesh.idx;
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];

         /**CATCH ERROR - INFINITE LOOP */
         if (child.type & MESH_TYPE.RECT_MESH) {
            console.warn('RECT_MESH. Recursive call on AddToWidgetRootBuffer().\nSee for infinite loop', '\nchild:', child.constructor.name, 'name:', child.GetName());
         }
         child.AddToWidgetRootBuffer(root_bufferidx);
      }

   }


   RemoveFromGfxBuffer() {
      Mesh_per_vb_remove_mesh(this.gfx.vb.groupidx, this.per_vb_bufferidx);
   }


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




   /*******************************************************************************************************************************************************/
   // Graphics

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      return this.gfx;
   }


   AddToGfx() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx);
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }


   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      // Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName())
      Vertex_buffer_add_vertices_from_reset(this.gfx, this.geom, this.mat, this.GetName())

      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      this.is_gfx_inserted = true;


      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }


   // TODO: Use it
   UpdateGfx() {

      if (this.is_gfx_inserted)
         Vertex_buffer_update_vertices(this.gfx, this.geom, this.mat, this.GetName())
      else {
         Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx);
         this.is_gfx_inserted = true;
      }

      return this.gfx.vb.start;
   }

   /*******************************************************************************************************************************************************/
   // Alignment





   /*******************************************************************************************************************************************************/
   // Setters-Getters

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

   // SEE ### Construct Listeners
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
