"use strict";

import { Mesh } from "./Base/Mesh.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_group_set_texidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Texture_Material } from "../Material/Base/Material.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { WHITE } from "../Material/Base/Colors.js";
import { Widget_root_set_in_focus } from "../../Core/MeshBuffer.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";
import { Listener_assign_parent_event } from "../../Events/EventListeners.js";



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
      this.gfx.tb.idx = (this.mat.texidx !== INT_NULL) ? this.mat.texidx : ((this.mat.uvIdx !== INT_NULL) ? this.mat.uvIdx : INT_NULL);
      Vertex_buffer_group_set_texidx(this.gfx.vb.groupidx, this.gfx.tb.idx); // Update the vertex buffer to store the texture index

      return this.gfx;
   }


   AddToGfxFromReset() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.StateEnable(MESH_STATE.ACTIVE);
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      // this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

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
   // TODO: The: ConstructListeners(), OnClick() and OnMove(), belong to a widget rather than a _Mesh. Neither Text_Mesh or Rect_Mesh have these functions. Maybe create the apropriate widget for the Textured_mesh too.
   // SEE ### Construct Listeners

   // ConstructListeners(parent_listeners = null) {

   //    const mesh = this; // If in recursion, use as the current mesh the passed param. 

   //    for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

   //       const evt = mesh.listeners.buffer[etypeidx];
   //       if (evt) { // If event is not null
   //          const evt_params = {
   //             EventClbk: null,
   //             targetBindingFunctions: null,
   //             target_mesh: mesh,
   //             params: null,
   //          }
   //          mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, parent_listeners[etypeidx]);
   //       }
   //    }
   // }

   
   // AddListeners() {

   //    const mesh = this; // If in recursion, use as the current mesh the passed param. 
   //    if(!mesh.listeners) alert('228866 \nMuste CreateListenEvent() first for mesh:.', mesh.GetName);

   //    for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

   //       const evt = mesh.listeners.buffer[etypeidx];
   //       if (evt) { // If event is not null
   //          const evt_params = {
   //             EventClbk: null,
   //             targetBindingFunctions: null,
   //             target_mesh: mesh,
   //             params: null,
   //          }
   //          mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, null);
   //       }
   //    }
   // }


   // ListenEventCreate(etype) {

   //    const etypeidx = Listen_event_get_idx_from_type(etype);
   //    const mesh = this;

   //    // For Hover events we need no callback and params
   //    if (etype & LISTEN_EVENT_TYPES.HOVER) {

   //       mesh.CreateListenEvent(etype);
   //       if (mesh.state.mask & MESH_STATE.ACTIVE) mesh.AddListenEvent(etypeidx, null, null);
   //    }
   //    else if (etype & LISTEN_EVENT_TYPES.CLICK_UP | LISTEN_EVENT_TYPES.MOVE) {

   //       const evt_params = { target_mesh: mesh, };
   //       mesh.CreateListenEvent(etype);
   //       if (mesh.state.mask & MESH_STATE.ACTIVE) mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params,);
   //    }

   // }


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


   // ListenEventCreateAndAdd(parent_events = null) {

   //    const mesh = this;

   //    if (!mesh.listeners)
   //       return; // Return if there are no listen events to add
   //    // alert('228867 \nMust CreateListenEvent() first for dropdown mesh:.', mesh.GetName);
   //    if (parent_events === null)
   //       alert('228868 \nParent event must be a valid event index.', mesh.GetName);




   //    for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

   //       if ((mesh.state.mask & MESH_STATE.ACTIVE) === 0x0) return; // Skip the dropdownn and button if are inactive 

   //       const etype = Listen_event_types_get_type_from_index(etypeidx);

   //       /***********************************************************************************************************************/
   //       // Create for dropdown button
   //       const dp_evt = mesh.listeners.buffer[etypeidx];
   //       if (dp_evt !== null) { // If event for tis mesh is null, don't do anything

   //          // For Hover events we need no callback and params
   //          if (etype & LISTEN_EVENT_TYPES.HOVER) {
   //             mesh.AddListenEvent(etypeidx, null, null);
   //          }
   //          else if (etype & LISTEN_EVENT_TYPES.CLICK_UP | LISTEN_EVENT_TYPES.MOVE) {

   //             const evt_params = { target_mesh: mesh, };
   //             mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, null);
   //          }

   //          if (parent_events[etypeidx] === INT_NULL || parent_events[etypeidx] === null && mesh.listeners.buffer[etypeidx] !== INT_NULL) { // Find parent event

   //             const parent_event_idx = Find_parent_listen_event(etypeidx, mesh);

   //             if (parent_event_idx === INT_NULL) alert('7182994 \nFailed to find any parent event in mesh tree');
   //             else Listener_assign_parent_event(etypeidx, mesh.listeners.buffer[etypeidx], parent_event_idx);
   //          }
   //          else Listener_assign_parent_event(etypeidx, mesh.listeners.buffer[etypeidx], parent_events[etypeidx]);

   //       }
   //    }
   // }

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
            const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnMoveFn, mesh);
            console.log('Time interval idx:', idx)
            // mesh.timeIntervalsIdxBuffer.Add(idx);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

            if (mesh.StateCheck(MESH_STATE.IS_GRABABLE)) {

               STATE.mesh.SetGrabed(mesh);
               STATE.mesh.SetFocused(mesh);
               mesh.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
               Widget_root_set_in_focus(mesh.root_bufferidx);
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



