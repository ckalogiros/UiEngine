"use strict";

import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Material } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { AddArr2, CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Batch_store } from "../../Batch/Batch.js";
import { Mesh_per_vb_remove_mesh, Mesh_per_vb_store_mesh, Widget_root_add_mesh, Widget_root_is_widget_root } from "../../Core/MeshBuffer.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_update_vertices } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";


export class Rect extends Mesh {

   constructor(pos = POSITION_CENTER, dim = [10, 10], col = BLUER3, is_debug_mesh=0x0) {

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
         if(child.type & MESH_TYPE.RECT_MESH){
            console.warn('RECT_MESH. Recursive call on AddToWidgetRootBuffer().\nSee for infinite loop', '\nchild:', child.constructor.name, 'name:', child.GetName());
         }
         child.AddToWidgetRootBuffer(root_bufferidx);
      }

   }


   RemoveFromGfxBuffer() { 
      Mesh_per_vb_remove_mesh(this.gfx.vb.idx, this.per_vb_bufferidx);
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


   SetTypeDebug(){
      this.type |= MESH_TYPE.DEBUG_MESH;
   }




   /*******************************************************************************************************************************************************/
   // Graphics

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidxs=[INT_NULL, INT_NULL]) {

      this.gfx = Gfx_generate_context(FLAGS, this, gfxidxs);

      return this.gfx;
   }


   AddToGfx() {

      // const g = {
      //    pos:this.GetPosXYZ(),
      //    dim:this.geom.dim,
      // };

      // this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, g, this.mat, this.GetName(), this.idx);
      this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx);
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.idx, this.mesh_bufferidx);
      
      return this.gfx.vb.start;
   }
   
   
   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName())
      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      this.is_gfx_inserted = true;
      

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.idx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }


   // TODO: Use it
   UpdateGfx() {

      if(this.is_gfx_inserted) 
         Vertex_buffer_update_vertices(this.gfx, this.geom, this.mat, this.GetName())
      else {
         this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx);
         this.is_gfx_inserted = true;
      }

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

      CopyArr2(this.geom.defPos, this.geom.pos);
      AddArr2(this.geom.pos, pos_dif);
      // this.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      this.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;

      const update_data = {
         sizes: [2],
         data: [pos_dif[0], pos_dif[1]],
      }
      Batch_store(this, SHADER_ATTRIBUTES.WPOS4, update_data, _);
      
      for (let i = 0; i <= this.children.boundary; i++) {

         AddArr2(this.children.buffer[i].geom.pos, pos_dif);
         CopyArr2(this.children.buffer[i].geom.defPos, this.children.buffer[i].geom.pos);
         
         // this.children.buffer[i].batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
         this.children.buffer[i].batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;
         Batch_store(this.children.buffer[i], SHADER_ATTRIBUTES.WPOS4, update_data, _);
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


   SetPosX(x) {
      super.SetPosX(x);
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


   SetPosZNoGfxUpdate(val) {
      this.geom.pos[2] = val;
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
