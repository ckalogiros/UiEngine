"use strict";

import { Mesh } from "./Base/Mesh.js";
import { Vertex_buffer_add_vertices } from "../../../Graphics/Buffers/VertexBuffers.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Texture_Material } from "../Material/Base/Material.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { WHITE } from "../Material/Base/Colors.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Root_group_set_in_focus } from "../../Core/Views/RootView.js";



export class Textured_Mesh extends Mesh {

   constructor(pos = [0, 0, 0], dim, color = WHITE, textureid = INT_NULL, name = 'UNDEFINED_TEXTURED_MESH_NAME', is_debug_mesh) {

      const mat = new Texture_Material(color, textureid);
      const geom = new Geometry2D(pos, dim);

      super(geom, mat);
      this.SetName(name);
      this.type |= MESH_TYPE.TEXT_MESH | is_debug_mesh;

   }




   

   SetTypeDebug() {
      this.type |= MESH_TYPE.DEBUG_MESH;
   }




   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/


   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      return this.gfx;
   }


   AddToGfx() { // TODO: Should be named 'AddToGfx' like Rect_Mesh and Text_Mesh

      // Get the starting index of the text in the vertex buffer.
      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.is_gfx_inserted = true;


      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);



      // If texture exists, store texture index, else if font texture exists, store font texture index, else store null
      // BUG: Make sure the below statement makes sense for Texture_Material(it is copied from the Font_Material)
      // this.gfx.tb.idx = (this.mat.texidxtextureid !== INT_NULL) ? this.mat.texidx : ((this.mat.uvIdx !== INT_NULL) ? this.mat.uvIdx : INT_NULL);
      // Vertex_buffer_group_set_texidx(this.gfx.vb.groupidx, this.gfx.tb.idx); // Update the vertex buffer to store the texture index

      return this.gfx;
   }


   AddToGfxFromReset() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.StateEnable(MESH_STATE.ACTIVE);
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

   }


   UpdateGfx() {

      alert('Implement me\nUpdateGfx() @ Textured_Mesh.js')
      // if(this.is_gfx_inserted) 
      //    Vertex_buffer_update_vertices(this.gfx, this.geom, this.mat, this.GetName())
      // else {
      //    this.gfx.vb.start = Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx);
      //    this.is_gfx_inserted = true;
      // }

      // return this.gfx.vb.start;
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

      const mesh = this;

      if (mesh.state.mask & MESH_STATE.ACTIVE) {
         
         // Construct HOVER event
         if (mesh.listeners.buffer[E.H] === INT_NULL) {
            mesh.AddListenEvent(E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (mesh.listeners.buffer[E.C] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            mesh.AddListenEvent(E.C, mesh.OnClick, evt_params);
         }
      }

      return false;
   }


   OnClick(params) {
      alert('7123451 \n Implement me')

      const mesh = params.evt_params.target_mesh;
      const OnMoveFn = mesh.OnMove;

      const point = MouseGetPos();
      const g = mesh.geom;
      // TODO: Isn't the mesh already been checked for collision??????
      if (Check_intersection_point_rect(g.pos, g.dim, point, [0, 8])) {

         STATE.mesh.SetClicked(mesh);
         console.log('Clicked:', mesh.GetName())

         if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            /**
               * Create Move event.
               * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
               * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
            */
            const idx = Time_intervals_create(10, 'Move Textured_Mesh', TIME_INTERVAL_REPEAT_ALWAYS, OnMoveFn, mesh);
            console.log('Time interval idx:', idx)
            // mesh.timeIntervalsIdxBuffer.Add(idx);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

            if (mesh.StateCheck(MESH_STATE.IS_GRABABLE)) {

               STATE.mesh.SetGrabed(mesh);
               STATE.mesh.SetFocused(mesh);
               mesh.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
               Root_group_set_in_focus(mesh.root_bufferidx);
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
         Time_intervals_destroy_byidx(intervalIdx);
         mesh.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

         return;
      }

      // Move 
      const mouse_pos = MouseGetPosDif();

      mesh.geom.AddWposXY( mesh.gfx, mouse_pos.x, -mouse_pos.y);

   }


   SetPosZNoGfxUpdate(z) {
      this.geom.pos[2] = z;
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


   SetPosXYNoGfxUpdate(x, y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else {
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
      }
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/
}



