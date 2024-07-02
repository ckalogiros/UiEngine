"use strict";

import { CopyArr4 } from "../../../Helpers/Math/MathOperations.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx, Widget_root_add_mesh, Widget_root_create_root } from "../../Core/MeshBuffer.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Listener_assign_parent_event } from "../../Events/EventListeners.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { BLUE, BLUEL, GREEN, GREY } from "../Material/Base/Colors.js";
import { Rect, Rect_Mesh } from "../Meshes/Rect_Mesh.js";
import { Set_color_rgba, Set_default_color_rgba, Set_hover_color_rgba } from "../Operations/MeshAttributesFunctions.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";





// export class Widget_Switch_Simple extends Rect {
export class Widget_Switch_Simple extends Rect_Mesh {

   isOn;
   evt_params;
   color_active;
   pad; // int, not array for x-y pad

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, size = 16, col = GREY[1], col2 = GREEN[2], _pad = 0, bold, style = [0, 15, 2.], is_debug_mesh) {

      const ratio = .2;
      const pad = (_pad !== 0) ? _pad : size*ratio;
      const switch_dim = [size * 2, size]
      // const style = [_style[0], size * (1-ratio), _style[2]]
      style[1] = size;

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, switch_dim, col, _, style, _pad, 1, is_debug_mesh)
      // super(pos, switch_dim, col, _, is_debug_mesh)

      this.color_active = [0, 0, 0, 0];
      CopyArr4(this.color_active, col2);

      this.mesh_bufferidx = mesh_bufferidx;
      this.isOn = 0x0;
      this.type |= MESH_TYPE.WIDGET_SWITCH;
      this.SetName('Switch Widget');

      this.evt_params = null;
      this.pad = pad;


      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      // this.SetStyle(style[0], size, style[2]);
      // this.SetStyle(style);
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      
      // const switch_pos = [pos[0] - size, pos[1], pos[2] + 1];
      const switch_pos = [pad, pad, pos[2] + 1];
      const switch0 = Create_rect_mesh(_, switch_pos, [size - pad, size - pad], GREY[9], _, _, _, _, is_debug_mesh);
      this.AddChild(switch0);
      switch0.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      switch0.SetStyle([style[0], size * (1-ratio), style[2]]);
      // switch0.SetStyle(style);
      switch0.SetName('switch');
      switch0.state.mask &= ~MESH_STATE.ACTIVE;
      
      this.StateEnable(MESH_STATE.IS_HOVER_COLORABLE)

      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT && this) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);

         // this.AddToWidgetRootBuffer(this.root_bufferidx)
         switch0.root_bufferidx = this.root_bufferidx;
      }


      // switch0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      // switch0.StateEnable(MESH_STATE.IS_HOVER_COLORABLE)




   }




   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      this.children.buffer[0].state.mask |= MESH_STATE.ACTIVE;
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      this.children.buffer[0].state.mask &= ~MESH_STATE.ACTIVE;
   }

   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
      this.children.buffer[0].state.mask |= MASK;
   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
      this.children.buffer[0].state.mask &= ~MASK;
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/
   

   

   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
      this.children.buffer[0].root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.children.buffer[0].root_bufferidx, this.children.buffer[0].mesh_bufferidx);
   }


   SetGfxEnableAttributes(which, params) {
      alert('777\nSetGfxEnableAttributes\WidgetSwitch')
   }


   /** Must run for every mesh */
   GfxUniformsEnable(flags, name, type, shader_flags) {

      super.EnableGfxUniforms(flags, name, type, shader_flags);
      this.children.buffer[0].GfxUniformsEnable(flags, name, type, shader_flags);

   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      // super.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
      super.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
   }

   
   GfxCtxSetFlag(FLAGS, gfx_ctx_parent){
      
      if(!this.gfx_ctx_parent) {
         
         this.gfx_ctx_flags = FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;
         this.children.buffer[i].gfx_ctx_flags = FLAGS;
         this.children.buffer[i].gfx_ctx_parent = gfx_ctx_parent;
      }
   }



   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL, params = null) {

      if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.
      
      const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx, params);
      this.children.buffer[0].GenGfxCtx(FLAGS, specific_vb_groupidx, params);

      return gfx;
   }


   Render() {

      if (this.state.mask & MESH_STATE.ACTIVE) {
         super.AddToGfx();
         this.children.buffer[0].AddToGfx();
      }

   }


   Rerender() {

      super.AddToGfxFromReset();
      this.children.buffer[0].AddToGfxFromReset();
   }





   /*******************************************************************************************************************************************************/
   // Transformation


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      this.children.buffer[0].geom.pos[0] += x;
      this.children.buffer[0].geom.pos[1] += y;
   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;
      this.children.buffer[0].geom.pos[1] += y;
   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;
      this.children.buffer[0].geom.pos[0] += x;
   }

   SetPosX(x) {

      super.SetPosX(x);
      this.children.buffer[0].SetPosX(x);
   }

   SetPosXNoGfxUpdate(x) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.child, and must update both offsets 
         this.geom.pos[0] = x;
         this.children.buffer[0].geom.pos[0] = x;
         this.children.buffer[0].geom.pos[0] = (this.geom.pos[0] - this.geom.dim[0]) + this.children.buffer[0].geom.dim[0] + this.pad;
      }
   }


   SetPosYNoGfxUpdate(y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.child, and must update both offsets 
         this.geom.pos[1] = y;
         this.children.buffer[0].geom.pos[1] = y;
      }
   }


   SetPosXYNoGfxUpdate(x, y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.child, and must update both offsets 
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
         this.children.buffer[0].geom.pos[0] = x;
         this.children.buffer[0].geom.pos[1] = y;
      }
   }


   TEMP_recalc(x, y) {

      const dx = this.children.buffer[0].geom.pos[0] - this.geom.pos[0];
      const dy = this.children.buffer[0].geom.pos[1] - this.geom.pos[1];
      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
      this.children.buffer[0].geom.pos[0] = x + dx;
      this.children.buffer[0].geom.pos[1] = y + dy;
      // console.log('1', this.children.buffer[0].geom.pos,this.GetName())
   }

   SetHoverColor() { this.SetUpdateFrameBuffer(); Set_hover_color_rgba(this.children.buffer[0]); }

   SetHoverColorDefault() { this.SetUpdateFrameBuffer(); Set_default_color_rgba(this.children.buffer[0]); }






   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/


   // ConstructListeners(parent_listeners = null) {

   //    const mesh = this; // If in recursion, use as the current mesh the passed param. 

   //    for (let i = 0; i <= mesh.listeners.boundary; i++) {

   //       if (mesh.listeners.buffer[i]) {

   //          if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
   //             parent_listeners = [null, null];
   //             parent_listeners[i] = Find_parent_listen_event(i, mesh);
   //          }
   //          else if (parent_listeners[i] === null) {
   //             parent_listeners[i] = Find_parent_listen_event(i, mesh);
   //          }


   //          mesh.AddListenEvent(i, mesh.OnClick, mesh.evt_params, parent_listeners[i]);
   //       }
   //    }
   // }


   ListenEventCreate(etype) {

      const etypeidx = Listen_event_get_idx_from_type(etype);
      const mesh = this;

      // For Hover events we need no callback and params
      if (etype & LISTEN_EVENT_TYPES.HOVER) {

         mesh.CreateListenEvent(etype);
         if (mesh.state.mask & MESH_STATE.ACTIVE) mesh.AddListenEvent(etypeidx, null, null);
      }
      else if (etype & LISTEN_EVENT_TYPES.CLICK_UP | LISTEN_EVENT_TYPES.MOVE) {

         const evt_params = { target_mesh: mesh, };
         mesh.CreateListenEvent(etype);
         if (mesh.state.mask & MESH_STATE.ACTIVE) mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, null);
      }

   }

   ListenEventCreateAndAdd(parent_events = null) {

      const mesh = this;

      if (!mesh.listeners)
         return; // Return if there are no listen events to add
      // alert('228867 \nMust CreateListenEvent() first for dropdown mesh:.', mesh.GetName);
      if (parent_events === null)
         alert('228868 \nParent event must be a valid event index.', mesh.GetName);




      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         if ((mesh.state.mask & MESH_STATE.ACTIVE) === 0x0) return; // Skip the dropdownn and button if are inactive 

         const etype = Listen_event_types_get_type_from_index(etypeidx);

         /***********************************************************************************************************************/
         // Create for dropdown button
         const dp_evt = mesh.listeners.buffer[etypeidx];
         if (dp_evt !== null) { // If event for tis mesh is null, don't do anything

            // For Hover events we need no callback and params
            if (etype & LISTEN_EVENT_TYPES.HOVER) {
               mesh.AddListenEvent(etypeidx, null, null);
            }
            else if (etype & LISTEN_EVENT_TYPES.CLICK_UP | LISTEN_EVENT_TYPES.MOVE) {

               const evt_params = { target_mesh: mesh, };
               mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, null);
            }

            if (parent_events[etypeidx] === INT_NULL || parent_events[etypeidx] === null && mesh.listeners.buffer[etypeidx] !== INT_NULL) { // Find parent event

               const parent_event_idx = Find_parent_listen_event(etypeidx, mesh);

               if (parent_event_idx === INT_NULL) alert('7182994 \nFailed to find any parent event in mesh tree');
               else Listener_assign_parent_event(etypeidx, mesh.listeners.buffer[etypeidx], parent_event_idx);
            }
            else Listener_assign_parent_event(etypeidx, mesh.listeners.buffer[etypeidx], parent_events[etypeidx]);

         }
      }
   }
   
   OnClick(params) {


      const mesh = Mesh_buffer_get_mesh_byidx(params.meshidx);
      const switch0 = mesh.children.buffer[0];

      mesh.isOn ^= 0x1;
      mesh.SetUpdateFrameBuffer();
      STATE.mesh.SetClicked(mesh);

      if (mesh.isOn) {
         Set_color_rgba(mesh, mesh.color_active);
         switch0.geom.pos[0] += mesh.geom.dim[0];
         switch0.geom.MoveX(mesh.geom.dim[0], switch0.gfx);
         // switch0.geom.MoveY(mesh.geom.dim[0], switch0.gfx);
         // switch0.geom.MoveXY(mesh.geom.dim[0], mesh.geom.dim[1], switch0.gfx);
      }
      else {
         Set_default_color_rgba(mesh);
         switch0.geom.pos[0] -= mesh.geom.dim[0];
         switch0.geom.MoveX(-mesh.geom.dim[0], switch0.gfx);
      }

      
      if (params===null || params.evt_params===null || params.evt_params.EventClbk===null){
         console.error('No Callback function has been set for switch widget\nSet up one');
         return;
      }

      if (mesh.evt_params) {
         if (mesh.evt_params.EventClbk) {
   
            const EventClbk = mesh.evt_params.EventClbk;
            EventClbk(mesh.evt_params);
         }
      }

      console.log('CLICKED')
      return true;
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   Bind(EventClbk = null, targetBindingFunctions = _, params) {

      if (!EventClbk) { EventClbk = Switch_click_default_callback; params = 'Switch'; }

      // this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.evt_params = { // Create the parameters to pass for the switch's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };
   }


}



/** A callback function calls another callback that must be called via 'timeInterval'. 
 * Is responsible for creation/destruction of the timeInterval that in its turn 
 * will run automaticaly a callback from the application */
export function Switch_simple_time_interval_callback(params){

   const this_switch = params.target_mesh;

   if (this_switch.isOn === 0x0 && this_switch.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

      const intervalIdx = this_switch.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      this_switch.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);

      return;
   }

   if (this_switch.isOn === 0x1 && this_switch.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

      const Clbk = params.targetBindingFunctions;
      // const idx = TimeIntervalsCreate(10, 'Switch TimeInterval Creation', TIME_INTERVAL_REPEAT_ALWAYS, this.evt_params.EventClbk, this.evt_params.evt_params);
      const idx = TimeIntervalsCreate(10, 'Switch TimeInterval Creation', TIME_INTERVAL_REPEAT_ALWAYS, Clbk, params.params);
      this_switch.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);
   }
}


function Switch_click_default_callback(params) {
   console.log(params, ' Clicked!');
}