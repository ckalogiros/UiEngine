"use strict";

import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Find_gfx_match_widget_root_impl } from "../../Interfaces/Gfx/GfxContextFindMatch.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Material } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { AddArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Batch_store } from "../../Batch/Batch.js";
import { Widget_group_add, Widget_root_add_mesh, Widget_root_batch_update_increment_accumulator } from "../../Core/MeshBuffer.js";
import { Vertex_buffer_add_vertices } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Index_buffer_add_indices } from "../../../Graphics/Buffers/IndexBuffers.js";


export class Rect extends Mesh {

   constructor(pos = POSITION_CENTER, dim = [10, 10], col = BLUER3) {

      const geom = new Geometry2D(pos, dim);
      const mat = new Material(col);

      super(geom, mat);

      this.type |= MESH_TYPE.RECT_MESH;

   }


   AddChild(mesh) {

      mesh.idx = this.children.Add(mesh);

      // SID.InheritUniform(mesh.sid.unif, this.sid.unif);  // Inherits the parent's uniform flags

      mesh.parent = this;
      return mesh.idx;
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         child.root_bufferidx = root_bufferidx;
         Widget_root_add_mesh(child.root_bufferidx, child.mesh_bufferidx);
         console.warn('RECT_MESH has children. Please check the type of children because we add them directly to the widget_root.', '\nchild:', child.constructor.name, 'name:', child.GetName());
      }

   }


   AddToWidgetGroupBuffer(group_bufferidx) {

      if (this.state.mask & MESH_STATE.ACTIVE) {
         /**DEBUG */ if (!this.gfx) console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO GFX FOR SECTION:', this.mesh_bufferidx, this.GetName());
         this.group_bufferidxs[0] = group_bufferidx;
         this.group_bufferidxs[1] = Widget_group_add(group_bufferidx, this.gfx, this.geom.num_faces, this.mesh_bufferidx);
      }
   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
   }


   StateEnable(MASK=0x0) {

      this.state.mask |= MASK;
   }


   StateDisable(MASK=0x0) {

      this.state.mask &= ~MASK;
   }


   ClipY(clip_top, clip_bottom) {

      if(this.ClipyCheck_A(clip_top, clip_bottom))
         this.state.mask &= ~MESH_STATE.ACTIVE;
   }



   /*******************************************************************************************************************************************************/
   // Graphics

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx = null) {

      if (FLAGS & GFX_CTX_FLAGS.PRIVATE) {

         const igfx = Find_gfx_match_widget_root_impl(this.root_bufferidx, this.sid);
         FLAGS |= igfx.FLAGS;

         this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, FLAGS, igfx.idxs, this.root_bufferidx, this.mesh_bufferidx, this.uniforms);
      }
      else {
         this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, FLAGS, gfxidx, this.root_bufferidx, this.mesh_bufferidx, this.uniforms);
      }


      return this.gfx;
   }


   AddToGfx() {

      this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx);
      if(this.sid.shad & SID.SHAD.INDEXED) this.gfx.ib.start = Index_buffer_add_indices(this.gfx.ib, this.GetName());
      this.is_gfx_inserted = true;


      // if (this.batch_buffer_vbidx !== INT_NULL) Widget_root_batch_update_increment_accumulator(this.root_bufferidx, this.batch_buffer_vbidx, this.geom.num_faces);

      const params = {
         progidx: this.gfx.prog.idx,
         vbidx: this.gfx.vb.idx,
         mesh: this,
      }
      // Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_MESH, params);

      // const params2 = {
      //    progidx: this.gfx.prog.idx,
      //    vbidx: this.gfx.vb.idx,
      //    sceneidx: this.sceneidx,
      //    isActive: true,
      //    isPrivate: (FLAGS & GFX_CTX_FLAGS.PRIVATE) ? true : false,
      //    type: INFO_LISTEN_EVENT_TYPE.UI_INFO_GFX,
      // }
      // Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_GFX, params2);

      return this.gfx.vb.start;
   }


   AddToGfxFromReset() {

      this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx);
      if(this.sid.shad & SID.SHAD.INDEXED) this.gfx.ib.start = Index_buffer_add_indices(this.gfx.ib, this.GetName());
      this.is_gfx_inserted = true;

      return this.gfx.vb.start;
   }

   /*******************************************************************************************************************************************************/
   // Alignment

   Reposition_post(pos_dif) {

      this.MoveXYZ(pos_dif);

      for (let i = 0; i <= this.children.boundary; i++) {
         this.children.buffer[i].MoveXYZ(pos_dif);
      }
   }


   Reposition_pre(pos_dif) {
      AddArr2(this.geom.pos, pos_dif);
      this.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      Batch_store(this, _, { pos: pos_dif }, _);

      for (let i = 0; i <= this.children.boundary; i++) {
         AddArr2(this.children.buffer[i].geom.pos, pos_dif);
         this.children.buffer[i].batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
         Batch_store(this.children.buffer[i], _, { pos: pos_dif }, _);
      }
   }



   /*******************************************************************************************************************************************************/
   // Setters-Getters

   GetMaxWidth() { return this.geom.dim[0]; }


   GetTotalHeight() { return this.geom.dim[1]; }


   GetCenterPosX() { return this.geom.pos[0]; }


   GetCenterPosY() { return this.geom.pos[1]; }


   GetLeft_A() { return this.geom.pos[0] - this.geom.dim[0]; }


   GetRight_A() { return this.geom.pos[0] + this.geom.dim[0]; }


   GetTop_A() { return this.geom.pos[1] - this.geom.dim[1]; }


   GetBottom_A() { return this.geom.pos[1] + this.geom.dim[1]; }


   /** Return type: Array. Returns an array of all widgets meshes */
   GetAllMeshes() { return [this]; }


   SetZPos(val) {
      this.geom.pos[2] = val;
   }


   SetGfxProgramGroup(group_mask) {
      this.sid.gfx_group = group_mask;
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
   }


   SetPosXNoGfxUpdate(x) {
      this.geom.pos[0] = x;
   }


   SetPosYNoGfxUpdate(y) {
      this.geom.pos[1] = y;
   }


   SetPosXYNoGfxUpdate(x, y) {
      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
   }


	SetIsGfxInserted(flag){
		if(this.is_gfx_inserted !== flag)this.is_gfx_inserted = flag; // If true then set false
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



   // UpdateWidgetGroupIncrementNumFaces(){
   //    Widget_group_update_increment(this.group_bufferidxs, this.geom.num_faces); // Increment the number of faces of the vb_data of the group for the rect mesh.
   // }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
      const root_evt = root.listeners.buffer;

      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         const evt = mesh.listeners.buffer[etypeidx];
         if (evt) { // If event is not null
            const target_params = {
               EventClbk: null,
               targetBindingFunctions: null,
               target_mesh: mesh,
               params: null,
            }
            mesh.AddListenEvent(etypeidx, mesh.OnClick, target_params, root_evt);
         }
      }
   }


   ClipyCheck_A(clip_top, clip_bottom){
      
      if(this.GetTop_A() > clip_bottom || this.GetBottom_A() < clip_top)
         return true;
      return false
   }
}
