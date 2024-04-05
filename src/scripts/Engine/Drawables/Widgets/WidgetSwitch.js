"use strict";

import { CopyArr4 } from "../../../Helpers/Math/MathOperations";
import { Create_rect_mesh } from "../../Core/CreateWidget";
import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer";
import { BLUEL, GREEN, GREY } from "../Material/Base/Colors";
import { Rect } from "../Meshes/Rect_Mesh";





export class Widget_Switch_Simple extends Rect {

   isOn;
   evt_params;
   color_active;
   pad; // int, not array for x-y pad

   // constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text_on, text_off, pos, fontsize = 5, col = GREY[1], text_col = WHITE, pad = [fontsize, fontsize], bold, style = [3, 6, 2], font) {
   // constructor(col = GREY[1], pos, size=20, bold, style = [3, 6, 2]) {
   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, size = 16, col = GREY[1], pad = 2, bold, style = [3, 6, 2]) {

      const switch_dim = [size * 2, size]
      super(pos, switch_dim, TRANSPARENCY(GREY[1], .6))

      this.color_active = [0, 0, 0, 0];
      CopyArr4(this.color_active, col);

      this.mesh_bufferidx = mesh_bufferidx;
      this.isOn = 0x0;
      this.type |= MESH_TYPE.WIDGET_BUTTON;
      this.SetName('Switch Widget');

      this.evt_params = null;
      this.pad = pad;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      this.SetStyle([0, 15, 2.]);
      this.StateEnable(MESH_STATE.IS_HOVER_COLORABLE)
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER, true)

      const switch_pos = [pos[0] - size, pos[1], pos[2] + 1];
      const switch0 = Create_rect_mesh(switch_pos, [size - pad, size - pad], TRANSPARENCY(GREY[9], .7));
      switch0.sid.gfx_group = this.sid.gfx_group;
      switch0.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      switch0.SetStyle([3, 15, 3]);
      switch0.SetName('switch');
      switch0.state.mask &= ~MESH_STATE.ACTIVE;

      // switch0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      // switch0.StateEnable(MESH_STATE.IS_HOVER_COLORABLE)

      this.AddChild(switch0);



   }


   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx = null, params = null) {

      const gfx = super.GenGfxCtx(FLAGS, gfxidx, params);
      this.children.buffer[0].GenGfxCtx(FLAGS, gfxidx, params);

      return gfx;
   }


   Render() {

      if (this.state.mask & MESH_STATE.ACTIVE) {
         super.AddToGfx();
         this.children.buffer[0].AddToGfx();
      }

   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      this.children.buffer[0].state.mask |= MESH_STATE.ACTIVE;
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      this.children.buffer[0].state.mask &= ~MESH_STATE.ACTIVE;
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

   SetPosXNoGfxUpdate(x) {
      this.geom.pos[0] = x;
      this.children.buffer[0].geom.pos[0] = x;
      this.children.buffer[0].geom.pos[0] = (this.geom.pos[0] - this.geom.dim[0]) + this.children.buffer[0].geom.dim[0] + this.pad;
   }


   SetPosYNoGfxUpdate(y) {
      this.geom.pos[1] = y;
      this.children.buffer[0].geom.pos[1] = y;;
   }


   SetPosXYNoGfxUpdate(x, y) {
      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
      this.children.buffer[0].geom.pos[0] = x;
      this.children.buffer[0].geom.pos[1] = y;
   }

   /*******************************************************************************************************************************************************/
   // Events Handling

   OnClick(params) {

      const mesh = Mesh_buffer_get_mesh_byidx(params.meshidx);
      const switch0 = mesh.children.buffer[0];

      mesh.isOn ^= 0x1;
      mesh.SetUpdateFrameBuffer();
      STATE.mesh.SetClicked(mesh);

      if (mesh.isOn) {
         mesh.SetColor(mesh.color_active, .7);
         switch0.geom.MoveX(mesh.geom.dim[0], switch0.gfx);
      }
      else {
         mesh.SetDefaultColor();
         switch0.geom.MoveX(-mesh.geom.dim[0], switch0.gfx);
      }

      if (params.evt_params.EventClbk) {

         const EventClbk = params.evt_params.EventClbk;
         EventClbk(params.evt_params);
      }

      console.log('CLICKED')
      return true;
   }


   SetHoverColor() { this.SetUpdateFrameBuffer(); this.children.buffer[0].mat.SetHoverColor(this.children.buffer[0].gfx); }

   SetHoverColorDefault() { this.SetUpdateFrameBuffer(); this.children.buffer[0].mat.SetHoverColorDefault(this.children.buffer[0].gfx); }

   /*******************************************************************************************************************************************************/
   // Misc
   Bind(EventClbk = null, targetBindingFunctions = _, params) {

      if (!EventClbk) { EventClbk = Switch_click_default_callback; params = 'Switch'; }

      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      this.evt_params = { // Create the parameters to pass for the switch's click event. 
         EventClbk: EventClbk,
         targetBindingFunctions: targetBindingFunctions,
         target_mesh: this,
         params: params,
      };
   }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
      const root_evt = root.listeners.buffer;

      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         const evt = mesh.listeners.buffer[etypeidx];
         if (evt) {
            mesh.AddListenEvent(etypeidx, mesh.OnClick, this.evt_params, root_evt);
         }
      }

      // const switch0 = mesh.children.buffer[0];
      // if(mesh.listeners.active_count){

      //    switch0.ConstructListeners(this);
      // }
   }

}



function Switch_click_default_callback(params) {
   console.log(params, ' Clicked!');
}