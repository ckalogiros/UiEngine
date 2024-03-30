"use strict";

import { Mesh } from "./Base/Mesh.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_set_texidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Texture_Material } from "../Material/Base/Material.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { WHITE } from "../Material/Base/Colors.js";



export class Textured_Mesh extends Mesh {

   constructor(pos = [0, 0, 0], dim, color = WHITE, textureid = INT_NULL, name = 'UNDEFINED_TEXTURED_MESH_NAME') {

      const mat = new Texture_Material(color, textureid);
      const geom = new Geometry2D(pos, dim);

      super(geom, mat);
      this.SetName(name);
      this.type |= MESH_TYPE.TEXT_MESH;

   }



   /*******************************************************************************************************************************************************/
   // Graphics


   GenGfxCtx(FLAGS=GFX_CTX_FLAGS.ANY, gfxidxs=[INT_NULL, INT_NULL]) {

      this.gfx = Gfx_generate_context(FLAGS, this, gfxidxs);

      return this.gfx;
   }


   AddToGfx() { // TODO: Should be named 'AddToGfx' like Rect_Mesh and Text_Mesh

      // Get the starting index of the text in the vertex buffer.
      this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName());
      this.is_gfx_inserted = true;

      
      // Add entry to Gfx Buffer
      // this.gfx_bufferidx = Gfx_buffer_store(this.gfx.vb.idx, this.mesh_bufferidx);



      // If texture exists, store texture index, else if font texture exists, store font texture index, else store null
      // BUG: Make sure the below statement makes sense for Texture_Material(it is copied from the Font_Material)
      this.gfx.tb.idx = (this.mat.texidx !== INT_NULL) ? this.mat.texidx : ((this.mat.uvIdx !== INT_NULL) ? this.mat.uvIdx : INT_NULL);
      Vertex_buffer_set_texidx(this.gfx.vb.idx, this.gfx.tb.idx); // Update the vertex buffer to store the texture index

      return this.gfx;
   }


   AddToGfxFromReset() {

      this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName());
      this.StateEnable(MESH_STATE.ACTIVE);
      this.is_gfx_inserted = true;
      
      // Add entry to Gfx Buffer
      // this.gfx_bufferidx = Gfx_buffer_store(this.gfx.vb.idx, this.mesh_bufferidx);

   }



   /********************************************************************************************************************************************************************** */
   // TODO: The: ConstructListeners(), OnClick() and OnMove(), belong to a widget rather than a _Mesh. Neither Text_Mesh or Rect_Mesh have these functions. Maybe create the apropriate widget for the Textured_mesh too.
   // SEE ### Construct Listeners
   
   ConstructListeners(_root = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
      // console.log('****', mesh.GetName(), mesh.listeners.buffer)

      const root_evt = root.listeners.buffer;

      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         const evt = mesh.listeners.buffer[etypeidx];
         if (evt) { // If event is not null
            const evt_params = {
               EventClbk: null,
               targetBindingFunctions: null,
               target_mesh: mesh,
               params: null,
            }
            mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, root_evt);
         }
      }
   }


   OnClick(params) {

      const mesh = params.evt_params.target_mesh;
      const OnMoveFn = mesh.OnMove;

      const point = MouseGetPos();
      const g = mesh.geom;
      if (Check_intersection_point_rect(g.pos, g.dim, point, [0, 8])) {

         STATE.mesh.SetClicked(mesh);
         // STATE.mesh.SetFocused(mesh);
         console.log('Clicked:', mesh.GetName())

         if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            /**
               * Create Move event.
               * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
               * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
            */
            const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnMoveFn, mesh);
            console.log('Time interval idx:', idx)
            // mesh.timeIntervalsIdxBuffer.Add(idx);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

            if (mesh.StateCheck(MESH_STATE.IS_GRABABLE)) {

               STATE.mesh.SetGrabed(mesh);
               mesh.StateEnable(MESH_STATE.IN_GRAB);
            }

         }
         return true;
      }
      return false;
   }


   // SEE ### OnMove Events Implementation Logic
   OnMove(params) {

      // The 'OnMove' function is called by the timeInterval.
      // The timeInterval has been set by the 'OnClick' event.
      const mesh = params.params;

      // Destroy the time interval and the Move operation, if the mesh is not grabed
      // MESH_STATE.IN_GRAB is deactivated upon mouse 'click up' in Events.js.
      if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         mesh.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

         return;
      }

      // Move 
      const mouse_pos = MouseGetPosDif();

      mesh.geom.MoveXY(mouse_pos.x, -mouse_pos.y, mesh.gfx);

   }


   UpdatePosZ(z) {
      this.geom.UpdatePosZ(z, this.gfx, this.geom.num_faces);
   }


   SetZPos(z) {
      this.geom.pos[2] = z;
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
   

   SetTypeDebug(){
      this.type |= MESH_TYPE.DEBUG_MESH;
   }


   
   /*******************************************************************************************************************************************************/
   // Alignment

}



