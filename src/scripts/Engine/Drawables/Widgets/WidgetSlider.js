"use strict";

import { Rect_Mesh } from '../Meshes/Rect_Mesh.js';
import { MouseGetPosDif } from '../../Controls/Input/Mouse.js';
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from '../../Timers/TimeIntervals.js';
import { Gfx_generate_context } from '../../Interfaces/Gfx/MeshGfxContext.js';
import { AddArr2, CopyArr4, Min } from '../../../Helpers/Math/MathOperations.js';
import { Create_rect_mesh, Create_widget_slider_simple, Create_widget_text } from '../../Core/CreateWidget.js';
import { Mesh_buffer_get_mesh_byidx, Widget_root_add_mesh, Widget_root_create_root, Widget_root_set_in_focus, Widget_root_set_uniform_callback_per_gfx_root_mesh } from '../../Core/MeshBuffer.js';
import { Vertex_buffer_add_vertices } from '../../../Graphics/Buffers/VertexBuffers.js';
import { BLUEL, GREY, WHITE } from '../Material/Base/Colors.js';
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from '../../Core/MeshUniformsBuffer.js';
import { Set_color_a } from '../Operations/MeshAttributesFunctions.js';















export class Widget_Slider_Simple extends Rect_Mesh {


   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, dim, col = GREY[8], hover_margin = [0, 0], handle_dim=[10,10], handle_col=[1,1,1,1], num_faces=1, is_debug_mesh) {

      
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, dim, col, _, _, _, num_faces, is_debug_mesh);
      

      this.mesh_bufferidx = mesh_bufferidx;
      this.type |= MESH_TYPE.WIDGET_SLIDER | MESH_TYPE.WIDGET_SLIDER_BAR | this.geom | this.mat;
      
      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      
      
      this.SetStyle([0, 2, .6]);
      
      
      this.slider_val = 0;

      const handle = Create_rect_mesh(_,[pos[0]-handle_dim[0]+dim[0], pos[1]-handle_dim[1]+dim[1], pos[2]+1], handle_dim, handle_col, _, _, _, 1, is_debug_mesh);
      handle.type |= MESH_TYPE.WIDGET_SLIDER_HANDLE | handle.geom | handle.mat;

      handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      handle.SetStyle([5, Min(handle_dim[0],handle_dim[1]), 1.5]);



      // Make the vertical area of the bar larger for hover and handle moving.
      if(hover_margin[1] > handle.geom.dim[1]) hover_margin[1] = handle.geom.dim[1] + 4; // Avoid overlap with other widgets if the hover_margin is set too high from the user
      this.StylesSetHoverMargin(hover_margin);


      this.AddChild(handle)

      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT && this) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);

         handle.root_bufferidx = this.root_bufferidx;
         Widget_root_add_mesh(handle.root_bufferidx, handle.mesh_bufferidx);
      }

      handle.SetName('Slider handle');
      this.SetName('Slider Bar');


      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      // this.SetInitialValue(0)

      // It is enabled by the user, when a uniform is created for passing slider value to shaders
      // this.slider_val_unif_ubidx = INT_NULL;

   }




   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // OVERIDEN METHODS
   /****************************************************************************************************************************************************/
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

      const handle = this.children.buffer[0];
      handle.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(handle.root_bufferidx, handle.mesh_bufferidx);

   }


   SetGfxEnableAttributes(which, params) {
      
      this.SetGfxEnableAttributes(which, params);
      const handle = this.children.buffer[0];
      handle.SetGfxEnableAttributes(which, params);
   }


   GfxUniformsEnable(flags, name, type, shader_flags) {

      super.EnableGfxUniforms(flags, name, type, shader_flags);

      const handle = this.children.buffer[0];
      handle.EnableGfxUniforms(flags, name, type, shader_flags);

   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);

      // const handle = this.children.buffer[0];
      // handle.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
   }


   SetPosXNoGfxUpdate(x) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else {
         this.geom.pos[0] = x;
         this.children.buffer[0].geom.pos[0] = x;
      }
   }



   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);
      const rect_igfx = this.gfx.vb.groupidx; // Copy the gfx from the scroller area.

      const handle = this.children.buffer[0];
      handle.gfx = Gfx_generate_context(FLAGS, handle, rect_igfx);
      // handle.gfx = Gfx_generate_context(FLAGS, handle, INT_NULL);

      return this.gfx;
   }


   Render() {

      if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfx(); this.is_gfx_inserted = true }

      const handle = this.children.buffer[0];
      if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfx(); handle.is_gfx_inserted = true }
   }


   Rerender() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.is_gfx_inserted = true;
      this.StateEnable(MESH_STATE.ACTIVE);

      const handle = this.children.buffer[0];
      Vertex_buffer_add_vertices(handle.gfx, handle.geom, handle.mat, _, handle.GetName());
      handle.is_gfx_inserted = true;
      handle.StateEnable(MESH_STATE.ACTIVE);
   }


   DeactivateGfx() {
      
      super.DeactivateGfx()
      const handle = this.children.buffer[0];
      handle.DeactivateGfx();

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
      
      return false;
   }


   OnClick(params) {

      const bar = params.evt_params.target_mesh;

      STATE.mesh.SetClicked(bar);

      if ((bar.type & MESH_TYPE.WIDGET_SLIDER_BAR) && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

         // Assign apropriate callback based on the sliders axis Vertical/Horizontal
         if(bar.geom.dim[0] > bar.geom.dim[1]){

            const idx = TimeIntervalsCreate(10, 'Move Slider Handle', TIME_INTERVAL_REPEAT_ALWAYS, Slider_horizontal_on_update_handle, bar);
            bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);
         }
         else {

            const idx = TimeIntervalsCreate(10, 'Move Slider Handle', TIME_INTERVAL_REPEAT_ALWAYS, Slider_vertical_on_update_handle, bar);
            bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);
         }

         STATE.mesh.SetGrabed(bar);
         STATE.mesh.SetFocused(bar);
         bar.state.mask |= MESH_STATE.IN_FOCUS;
         bar.state.mask |= MESH_STATE.IN_GRAB;
         
         Widget_root_set_in_focus(bar.root_bufferidx);
      }

      return true;

   }


   SetPosXNoGfxUpdate(x) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, x);
      }
      else {
         this.geom.pos[0] = x;
         this.children.buffer[0].geom.pos[0] = x;
      }

   }


   SetPosYNoGfxUpdate(y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else {
         this.geom.pos[1] = y;
         this.children.buffer[0].geom.pos[1] = y;
      }

   }


   SetPosZNoGfxUpdate(val) {
      this.geom.pos[2] = val;
   }


   SetPosXYNoGfxUpdate(x, y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else {
         const handle = this.children.buffer[0];
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
         handle.geom.pos[0] = x;
         handle.geom.pos[1] = (this.geom.pos[1] + this.geom.dim[1])- handle.geom.dim[1];
      }
   }
   

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
   

   TEMP_recalc(x, y) {

      const dx = x - this.geom.pos[0];
      const dy = y - this.geom.pos[1];

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;

      const bar = this.children.buffer[0];
      bar.geom.pos[0] += dx;
      bar.geom.pos[1] += dy;

   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   
   /** Input values: from:0 to:100 */
   SetInitialValue(val){

      this.slider_val = (1/100)*val;
      
      if(this.geom.dim[0] > this.geom.dim[1]){
         
         const pos = ( (this.geom.dim[0] * 2 * this.geom.num_faces ) /100) *val;
         const handle = this.children.buffer[0];
         handle.geom.pos[0] = pos -(handle.geom.dim[0] * 2 * this.slider_val); // Neccesary to take into consideration of the width, cause the value is calculated to full(100) but the handle does not go over the bar. 
      }
      else {

         const handle = this.children.buffer[0];
         handle.geom.pos[1] = (this.geom.dim[1] * 2) - ( (val/100) * (this.geom.dim[1] * 2) ); // Neccesary to take into consideration of the width, cause the value is calculated to full(100) but the handle does not go over the bar. 
      }

      return this.slider_val;
   }


   SetColorHandleNoGfxUpdate(col){

      const handle = this.children.buffer[0];
      CopyArr4(handle.mat.col, col);
      CopyArr4(handle.mat.defCol, col);
   }
}




/*******************************************************************************************************************************************************/
// Slider Functionality 

function Slider_horizontal_move_handle(bar, handle) {

   const x = MouseGetPosDif().x;
   if (x === 0) return;

   const bar_length = bar.geom.dim[0] * 2 * bar.geom.num_faces;
   if (handle.geom.pos[0] + x >= bar.geom.pos[0] && handle.geom.pos[0] + handle.geom.dim[0] * 2 + x <= bar.geom.pos[0] + bar_length) {
      handle.geom.pos[0] += x;
      handle.geom.AddWposX(handle.gfx, x, );
   }

   // TODO: It is very complicated that we do not have a pipeline for the "mesh update gfx buffers". We need something more concrete  as to where the updates are passing through
   handle.SetUpdateFrameBuffer(); 

   return true;
}



function Slider_vertical_move_handle(bar, handle) {

   const y = -MouseGetPosDif().y;
   if (y === 0) return;

   const bar_length = bar.geom.dim[1] * 2 * bar.geom.num_faces;
   if (handle.geom.pos[1] + y >= bar.geom.pos[1] && handle.geom.pos[1] + handle.geom.dim[1] * 2 + y <= bar.geom.pos[1] + bar_length) {
      handle.geom.pos[1] += y;
      handle.geom.AddWposY(handle.gfx, y, );
   }

   handle.SetUpdateFrameBuffer(); 

   return true;
}



function Slider_horizontal_calculate_value(bar, handle) {

   
   const barwidth = (bar.geom.dim[0] * 2 * bar.geom.num_faces) - (handle.geom.dim[0] * 2);
   
   // Interpolate pos to 0-1 
   const x = handle.geom.pos[0] - bar.geom.pos[0]; // Tranform to mesh coordinates (0 t0 mesh dim)
   const percentage = (x / barwidth); // Calc the percentage 

   return percentage;
}



function Slider_vertical_calculate_value(bar, handle) {

   const bar_length = (bar.geom.dim[1] * 2 * bar.geom.num_faces) - (handle.geom.dim[1] * 2);
   const y = handle.geom.pos[1] - bar.geom.pos[1]; // Tranform to mesh coordinates (0 t0 mesh dim)
   // Interpolate pos to 0-1 
   const percentage = 1 - (y / bar_length); // Calc the percentage 
   
   return percentage;
}



export function Slider_horizontal_on_update_handle(_params) {

   /**
    * The function is called by the timeInterval.
    * The timeInterval has been set by the 'Slider_create_on_click_event',
    * that is called from 'HandleEvents()' 
    * as 'mesh.eventCallbacks.buffer[i].Clbk(target, Clbk);'
    * The 'HandleEvents()' passes the param '_params' to this function.
    */

   const bar = _params.params;
   const handle = bar.children.buffer[0];

   if (bar.StateCheck(MESH_STATE.IN_GRAB) === 0 && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

      // If bar out of hover, delete the timeInterval for moving the handle
      const intervalIdx = bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      bar.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);

      return;
   }

   Slider_horizontal_move_handle(bar, handle);

   const val = Slider_horizontal_calculate_value(bar, handle); // Calculate slider's value based on the handles position.
   bar.slider_val = val;

   // Do stuf with the slider handle value, based on the parent slider_widget
   if (bar.parent) {
      if (bar.parent.SliderSetValueToInfoText) bar.parent.SliderSetValueToInfoText(val);
   }

   /**
    * Dispatch all callbacks for all targets, that are stored in eventCallbacks[] buffer.
    * E.x. Slider binding callback on slider value change.
    */
   if (bar.eventCallbacks) {
      for (let i = 0; i <= bar.eventCallbacks.boundary; i++) {

         if (bar.eventCallbacks.buffer[i] !== null) {

            const params = bar.eventCallbacks.buffer[i];
            const Clbk = bar.eventCallbacks.buffer[i].Clbk;
            Clbk(params, val);
         }
      }
   }

}



/** Update slider handle for vertical sliders */
export function Slider_vertical_on_update_handle(_params) {
   
   /**
    * The function is called by the timeInterval.
    * The timeInterval has been set by the 'Slider_create_on_click_event',
    * that is called from 'HandleEvents()' 
    * as 'mesh.eventCallbacks.buffer[i].Clbk(target, Clbk);'
    * The 'HandleEvents()' passes the param '_params' to this function.
   */
  
  const bar = _params.params;
  const handle = bar.children.buffer[0];
  
  if (bar.StateCheck(MESH_STATE.IN_GRAB) === 0 && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {
     
     // If bar out of hover, delete the timeInterval for moving the handle
     const intervalIdx = bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
     TimeIntervalsDestroyByIdx(intervalIdx);
     bar.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);
     
     return;
   }
   
   Slider_vertical_move_handle(bar, handle);
   
   const val = Slider_vertical_calculate_value(bar, handle); // Calculate slider's value based on the handles position.
   
   // Do stuf with the slider handle value, based on the parent slider_widget
   if (bar.parent) {
      if (bar.parent.SliderSetValueToInfoText) bar.parent.SliderSetValueToInfoText(val);
   }
   
   /**
    * Dispatch all callbacks for all targets, that are
    * stored in eventCallbacks[] buffer.  
   */
  if (bar.eventCallbacks) {
     for (let i = 0; i <= bar.eventCallbacks.boundary; i++) {
        
        if (bar.eventCallbacks.buffer[i] !== null) {
           
           // const params = bar.eventCallbacks.buffer[i].clbk_params;
           const params = bar.eventCallbacks.buffer[i];
           const Clbk = bar.eventCallbacks.buffer[i].Clbk;
           Clbk(params, val);
         }
      }
   }
   
}


/** Set the value for a slider and update the handles position (and value text) */
export function Slider_simple_set_value(slider_bar, new_value) {
   
   const bar = slider_bar;
   const handle = bar.children.buffer[0];
   
   bar.slider_val = new_value;

   // We claculate from origin pos = 0. So we subtract any slider bar pos.
   const extra_padd = bar.geom.pos[0];
      
   if(bar.geom.dim[0] > bar.geom.dim[1]){
      
      const pos = ( (bar.geom.dim[0] * 2 * bar.geom.num_faces ) ) *new_value;
      handle.geom.pos[0] = pos -(handle.geom.dim[0] * 2 * bar.slider_val - extra_padd); // Neccesary to take into consideration of the width, cause the value is calculated to full(100) but the handle does not go over the bar. 
      handle.geom.UpdateSetWposX(handle.gfx)
   }
   else {

      const handle = bar.children.buffer[0];
      handle.geom.pos[1] = (bar.geom.dim[1] * 2) - ( (new_value) * (bar.geom.dim[1] * 2)); // Neccesary to take into consideration of the width, cause the value is calculated to full(100) but the handle does not go over the bar. 
   }

   if(bar.parent) bar.parent.SliderSetValueToInfoText(new_value);
   
}



/** Connect a simple slider class, has no panel and/or text name/value */
export function Slider_simple_connect(slider_bar, Clbk, clbk_params) {
   
   const bar = slider_bar;
   
   
   const params = {
      Clbk: Clbk,
      clbk_params: clbk_params,
   }
   
   // bar.CreateEventCallback(params);
   bar.CreateEventCallback(params);
   
   // Run the callback to set the sliders initial value.
   Clbk(params, bar.slider_val);
   
}


/** Connect a slider of class Slider, with panel and text name/value */
export function Slider_connect(slider, Clbk, clbk_params) {
   
   const bar = slider.children.buffer[slider.bar_idx];


   const params = {
      Clbk: Clbk,
      clbk_params: clbk_params,
   }

   bar.CreateEventCallback(params);

   // Run the callback to set the sliders initial value.
   Clbk(params, bar.slider_val);

}







































// export class Widget_Slider_XX1 extends Rect {
export class Widget_Slider_XX1 extends Rect_Mesh {

   name_text; // Slider's name text mesh
   value_text_idx; // Slider's value text mesh index in children buffer
   bar_idx; // Slider's bar and handle mesh index in children buffer

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, _pos=[0,0,0], dim=[120, 10], col = TRANSPARENCY(GREY[0], .6), hover_margin = [5, 16], name='SLIDER UNAMED', is_debug_mesh) {

      // Calculate the bar's and handle's horizontal pading.
      const ratio = dim[0] / dim[1];
      const pad = [dim[0] * 0.5, dim[1] / 2.8];
      pad[0] /= ratio;

      // Calculate the font size of the sliders texts, base on the sliders dimentions
      const min_font_size = 7, max_font_size = 25;
      const r = 2;
      const fontSize = max_font_size < (dim[1] / r) ? max_font_size : (min_font_size > (dim[1] / r) ? min_font_size : (dim[1] / r));


      const pos = (ROOT_WIDGET_FLAGS !== undefined) ? _pos : [0, 0, _pos[2]];


      // Create slider_name_text (it is the text_mesh of the extended Widget_Label class)
      const name_text = Create_widget_text(ROOT_WIDGET_FLAGS, name, pos, fontSize, WHITE, .4, _, _, is_debug_mesh);


      /** Label area mesh */
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, _pos, dim, col, _, _, [pad,pad], 1, is_debug_mesh);




      this.mesh_bufferidx = mesh_bufferidx;
      this.type |= MESH_TYPE.WIDGET_SLIDER;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle([0, 6, 2]);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


      /*****************************************************************************************************************/
      // Slider Bar: Bar is child of the slider mesh
      const bar = Create_widget_slider_simple(_, [0, dim[1]*4, _pos[2]+1], [dim[0], 2], GREY[8], hover_margin, [10, 10], BLUEL[7], 1, is_debug_mesh);
      
      
      /*****************************************************************************************************************/
      // Slider Handle: Handle is a child of the bar mesh
      const handle = bar.children.buffer[0];


      // Create value_text
      const value_text = Create_widget_text(ROOT_WIDGET_FLAGS, '0000', pos, fontSize, WHITE, .4, _, _, is_debug_mesh);


      // Make the vertical area of the bar larger for hover and handle moving.
      bar.MoveYNoGfxUpdate(-handle.geom.dim[0])


      /*****************************************************************************************************************/
      // Align
      const totalheight = (handle.geom.dim[1] + name_text.geom.dim[1] + value_text.geom.dim[1]);
      this.geom.dim[1] = totalheight;


      value_text.geom.pos[0] = this.geom.dim[0] * 2 - (value_text.GetMaxWidth() * 2);
      value_text.geom.pos[1] = 4;
      value_text.geom.pos[2] = bar.geom.pos[2] + 1;


      name_text.geom.pos[0] = 0;
      name_text.geom.pos[1] = 4;
      name_text.geom.pos[2] = this.geom.pos[2] + 1;
      name_text.parent = this;

      this.value_text_idx = this.AddChild(value_text)
      this.bar_idx = this.AddChild(bar)

      this.text_mesh = name_text;


      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT && this) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);

         const name_text = this.text_mesh;
         name_text.root_bufferidx = this.root_bufferidx;
         Widget_root_add_mesh(name_text.root_bufferidx, name_text.mesh_bufferidx);

         const value_text = this.children.buffer[this.value_text_idx];
         value_text.root_bufferidx = this.root_bufferidx;
         Widget_root_add_mesh(value_text.root_bufferidx, value_text.mesh_bufferidx);

         bar.AddToWidgetRootBuffer(this.root_bufferidx);
      }

      value_text.SetName(this.GetName() + ' - value_text');
      this.SetName('Widget_Slider_XX1');


      this.SetGfxEnableAttributes(MESH_ENABLE.GFX.ATTR_DIM2)

      bar.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      // bar.ListenEventCreate(LISTEN_EVENT_TYPES.HOVER)

   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/

   Destroy() {

      const bar = this.children.buffer[this.bar_idx];
      const name_text = this.text_mesh;
      const handle = bar.children.buffer[0];
      const value_text = this.children.buffer[this.value_text_idx];

      value_text.Destroy();
      handle.Destroy();
      name_text.Destroy();
      bar.Destroy();

      // Sliders's rect_mesh destruction
      return super.Destroy();
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      const name_text = this.text_mesh;
      name_text.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(name_text.root_bufferidx, name_text.mesh_bufferidx);

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(value_text.root_bufferidx, value_text.mesh_bufferidx);

      const bar = this.children.buffer[this.bar_idx];
      bar.AddToWidgetRootBuffer(root_bufferidx);

   }

   
   SetGfxEnableAttributes(which, params) {
      // alert('777\nSetGfxEnableAttributes\nWidgetSlider')

      this.EnableGfxAttributes(which, params);

      const bar = this.children.buffer[this.bar_idx];
      bar.EnableGfxAttributes(which, params);

      // const handle = bar.children.buffer[0];
      // handle.EnableGfxAttributes(which, params);
   }

   
   GfxUniformsEnable(flags, name, type, shader_flags) {

      super.EnableGfxUniforms(flags, name, type, shader_flags);
      this.text_mesh.EnableGfxUniforms(flags, name, type, shader_flags);

      const name_text = this.text_mesh;
      name_text.EnableGfxUniforms(flags, name, type, shader_flags);
   
      const value_text = this.children.buffer[this.value_text_idx];
      value_text.EnableGfxUniforms(flags, name, type, shader_flags);

      const bar = this.children.buffer[this.bar_idx];
      bar.GfxUniformsEnable(flags, name, type, shader_flags);

   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);

      if(unif_name === 'u_wposxy'){

         // Call for each root mesh in every vertex buffer
         const root_meshes = Widget_root_set_uniform_callback_per_gfx_root_mesh(this.root_bufferidx, unif_name, Clbk, clbk_params);
         const len = root_meshes.length;
         for(let i=1; i < len; i++){
      
            const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshes[i]);
            root_mesh.SetClbkGfxUniforms(unif_name, Clbk, root_mesh.root_posidx);
      
         }
      }

   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      
      const name_text = this.text_mesh;
      name_text.state.mask |= MESH_STATE.ACTIVE;
      
      const value_text = this.children.buffer[this.value_text_idx];
      value_text.state.mask |= MESH_STATE.ACTIVE;

      const bar = this.children.buffer[this.bar_idx];
      bar.state.mask |= MESH_STATE.ACTIVE;
      
      const handle = bar.children.buffer[0];
      handle.state.mask |= MESH_STATE.ACTIVE;
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;

      const bar = this.children.buffer[this.bar_idx];
      bar.state.mask &= ~MESH_STATE.ACTIVE;

      const name_text = this.text_mesh;
      name_text.state.mask &= ~MESH_STATE.ACTIVE;

      const handle = bar.children.buffer[0];
      handle.state.mask &= ~MESH_STATE.ACTIVE;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.state.mask &= ~MESH_STATE.ACTIVE;
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;

      const bar = this.children.buffer[this.bar_idx];
      bar.state.mask |= MASK;

      const name_text = this.text_mesh;
      name_text.state.mask |= MASK;

      const handle = bar.children.buffer[0];
      handle.state.mask |= MASK;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.state.mask |= MASK;

   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;

      const bar = this.children.buffer[this.bar_idx];
      bar.state.mask &= ~MASK;

      const name_text = this.text_mesh;
      name_text.state.mask &= ~MASK;

      const handle = bar.children.buffer[0];
      handle.state.mask &= ~MASK;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.state.mask &= ~MASK;

   }


   GfxCtxSetFlag(FLAGS){

      this.gfx_ctx_flags = FLAGS;

      const bar = this.children.buffer[this.bar_idx];
      bar.gfx_ctx_flags = FLAGS;

      const name_text = this.text_mesh;
      name_text.gfx_ctx_flags = FLAGS;

      const handle = bar.children.buffer[0];
      handle.gfx_ctx_flags = FLAGS;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.gfx_ctx_flags = FLAGS;
   }


   GfxCtxAddFlag(FLAGS){

      this.gfx_ctx_flags |= FLAGS;

      const bar = this.children.buffer[this.bar_idx];
      bar.gfx_ctx_flags |= FLAGS;

      const name_text = this.text_mesh;
      name_text.gfx_ctx_flags |= FLAGS;

      const handle = bar.children.buffer[0];
      handle.gfx_ctx_flags |= FLAGS;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.gfx_ctx_flags |= FLAGS;
   }




   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);
      const rect_igfx = this.gfx.vb.groupidx; // Copy the gfx from the scroller area.


      const name_text = this.text_mesh;
      name_text.gfx = Gfx_generate_context(FLAGS | GFX_CTX_FLAGS.SPECIFIC, name_text,);
      const text_igfx = name_text.gfx.vb.groupidx;

      const bar = this.children.buffer[this.bar_idx];
      bar.gfx = Gfx_generate_context(FLAGS, bar, rect_igfx);

      const handle = bar.children.buffer[0];
      handle.gfx = Gfx_generate_context(FLAGS, handle, rect_igfx);

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.gfx = Gfx_generate_context(FLAGS | GFX_CTX_FLAGS.SPECIFIC, value_text, text_igfx);

      return this.gfx;
   }


   Render() {

      if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfx(); this.is_gfx_inserted = true }
      if (!this.text_mesh.is_gfx_inserted && (this.text_mesh.state.mask & MESH_STATE.ACTIVE)) { this.text_mesh.AddToGfx(); this.text_mesh.is_gfx_inserted = true }

      const bar = this.children.buffer[this.bar_idx];
      if (!bar.is_gfx_inserted && (bar.state.mask & MESH_STATE.ACTIVE)) { bar.AddToGfx(); bar.is_gfx_inserted = true }

      const handle = bar.children.buffer[0];
      if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfx(); handle.is_gfx_inserted = true }

      const value_text = this.children.buffer[this.value_text_idx];
      if (!value_text.is_gfx_inserted && (value_text.state.mask & MESH_STATE.ACTIVE)) { value_text.AddToGfx(); value_text.is_gfx_inserted = true }
   }


   Rerender() {

      // Reset gfx start for the mesh
      // Add to vertexbuffer
      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.is_gfx_inserted = true;
      this.StateEnable(MESH_STATE.ACTIVE);

      this.text_mesh.AddToGfxFromReset();

      const bar = this.children.buffer[this.bar_idx];
      Vertex_buffer_add_vertices(bar.gfx, bar.geom, bar.mat, _, bar.GetName());
      bar.is_gfx_inserted = true;
      bar.StateEnable(MESH_STATE.ACTIVE);

      const handle = bar.children.buffer[0];
      Vertex_buffer_add_vertices(handle.gfx, handle.geom, handle.mat, _, handle.GetName());
      handle.is_gfx_inserted = true;
      handle.StateEnable(MESH_STATE.ACTIVE);

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.AddToGfxFromReset();
   }


   DeactivateGfx() {

      const bar = this.children.buffer[this.bar_idx];
      // const name_text = this.text_mesh;
      const handle = bar.children.buffer[0];
      const value_text = this.children.buffer[this.value_text_idx];

      bar.DeactivateGfx();
      // name_text.DeactivateGfx();
      handle.DeactivateGfx();
      value_text.DeactivateGfx();
      super.DeactivateGfx()

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
      const bar = mesh.children.buffer[mesh.bar_idx];

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
         
         // Construct for the bar
         if (bar.listeners && bar.listeners.buffer[E.H] === INT_NULL) {
            bar.AddListenEvent(E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (bar.listeners && bar.listeners.buffer[E.C] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            bar.AddListenEvent(E.C, mesh.OnClick, evt_params);
         }
      }
       
      return false;  
   }


   // TODO!!!: the widget is passed in 'params.evt_params.target_mesh', so REMOVE the 'params.source_params' tha has the slider.area_mesh is not needed. 
   OnClick(params) {

      const mesh = params.evt_params.target_mesh;
      const bar = mesh.children.buffer[mesh.bar_idx];
      
      
      // Check if the clicked mesh index is the bars...
      if(params.meshidx === bar.mesh_bufferidx){

         STATE.mesh.SetClicked(bar);

         if ((bar.type & MESH_TYPE.WIDGET_SLIDER_BAR) && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

            const idx = TimeIntervalsCreate(10, 'Move Slider Handle', TIME_INTERVAL_REPEAT_ALWAYS, Slider_horizontal_on_update_handle, bar);
            bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            STATE.mesh.SetGrabed(bar);
            STATE.mesh.SetFocused(mesh);
            mesh.state.mask |= MESH_STATE.IN_FOCUS;
            bar.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
            Widget_root_set_in_focus(mesh.root_bufferidx);
         }

         return true;
      }
      else { // Else the clicked mesh is the slider

         STATE.mesh.SetClicked(mesh);

         if ((mesh.type & MESH_TYPE.WIDGET_SLIDER) && mesh.StateCheck(MESH_STATE.IS_GRABABLE) && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            const idx = TimeIntervalsCreate(10, 'Move Slider', TIME_INTERVAL_REPEAT_ALWAYS, mesh.OnMove, mesh);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

            STATE.mesh.SetGrabed(mesh);
            STATE.mesh.SetFocused(mesh);
            mesh.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
            Widget_root_set_in_focus(mesh.root_bufferidx);
         }

         return true;
      }
   }


   OnMove(params) {

      const mesh = params.params;

      // Destroy the time interval and the Move operation, if the mesh is not grabed
      // MESH_STATE.IN_GRAB is deactivated upon mouse click up in Events.js.
      if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         mesh.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

         return;
      }

      const mouse_pos = MouseGetPosDif();
      if (mouse_pos.x === 0 && mouse_pos.y === 0) return;

      // Avoid moving when slider is child of another mesh. {{In order to work, slider must have a Move Event}}
      if (Mesh_unif_is_vb_root_wpos(mesh.root_posidx, mesh.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_add_vb_root_wpos(mesh.root_posidx, mouse_pos.x, -mouse_pos.y);
      }
      else{
         // TODO: Call Move() function for moving while slider is child of another mesh
      }

      // mesh.SetUpdateFrameBuffer();

   }



   /*******************************************************************************************************************************************************/
   // Transformations

   Move(x, y) {

      if (x === 0 && y === 0) return;

      AddArr2(this.geom.pos, [x, y]);
      this.geom.AddWposXY(this.gfx, x, y, );

      const bar = this.children.buffer[this.bar_idx];
      bar.geom.AddWposXY(bar.gfx, x, y, );

      const name_text = this.text_mesh;
      name_text.geom.AddWposXY(name_text.gfx, x, y, );

      const handle = bar.children.buffer[0];
      handle.geom.AddWposXY(handle.gfx, x, y, );

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.geom.AddWposXY(value_text.gfx, x, y, );

   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;

      const bar = this.children.buffer[this.bar_idx];
      bar.geom.pos[0] += x;
      bar.geom.pos[1] += y;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] += x;
      name_text.geom.pos[1] += y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += x;
      handle.geom.pos[1] += y;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.geom.pos[0] += x;
      value_text.geom.pos[1] += y;

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;

      const bar = this.children.buffer[this.bar_idx];
      bar.geom.pos[1] += y;

      const name_text = this.text_mesh;
      name_text.geom.pos[1] += y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[1] += y;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.geom.pos[1] += y;

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;

      const bar = this.children.buffer[this.bar_idx];
      bar.geom.pos[0] += x;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] += x;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += x;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.geom.pos[0] += x;

   }


   SetPosXNoGfxUpdate(x) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 

         this.geom.pos[0] = x;

         const bar = this.children.buffer[this.bar_idx];
         bar.geom.pos[0] += x;

         const name_text = this.text_mesh;
         name_text.geom.pos[0] += x;

         const handle = bar.children.buffer[0];
         handle.geom.pos[0] += x;

         const value_text = this.children.buffer[this.value_text_idx];
         value_text.geom.pos[0] += x;
      }

   }


   SetPosYNoGfxUpdate(y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 

         this.geom.pos[1] = y;

         const bar = this.children.buffer[this.bar_idx];
         bar.geom.pos[1] += y;

         const name_text = this.text_mesh;
         name_text.geom.pos[1] += y;

         const handle = bar.children.buffer[0];
         handle.geom.pos[1] += y;

         const value_text = this.children.buffer[this.value_text_idx];
         value_text.geom.pos[1] += y;
      }

   }


   SetPosXYNoGfxUpdate(x, y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 

         this.geom.pos[0] = x;
         this.geom.pos[1] = y;

         const bar = this.children.buffer[this.bar_idx];
         bar.geom.pos[0] += x;
         bar.geom.pos[1] += y;

         const name_text = this.text_mesh;
         name_text.geom.pos[0] += x;
         name_text.geom.pos[1] += y;

         const handle = bar.children.buffer[0];
         handle.geom.pos[0] += x;
         handle.geom.pos[1] += y;

         const value_text = this.children.buffer[this.value_text_idx];
         value_text.geom.pos[0] += x;
         value_text.geom.pos[1] += y;
      }
   }


   TEMP_recalc(x, y) {

      const dx = x - this.geom.pos[0];
      const dy = y - this.geom.pos[1];

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;

      const bar = this.children.buffer[this.bar_idx];
      bar.geom.pos[0] += dx;
      bar.geom.pos[1] += dy;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] += dx;
      name_text.geom.pos[1] += dy;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += dx;
      handle.geom.pos[1] += dy;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.geom.pos[0] += dx;
      value_text.geom.pos[1] += dy;
   }


   SetColorAlpha(alpha) {

      this.mat.SetColorAlpha(alpha, this.gfx);
      Set_color_a(this, alpha);

      const bar = this.children.buffer[this.bar_idx];
      Set_color_a(bar, alpha);
      // bar.mat.SetColorAlpha(alpha, bar.gfx);

      const name_text = this.text_mesh;
      Set_color_a(name_text, alpha);
      // name_text.mat.SetColorAlpha(alpha, name_text.gfx);

      const handle = bar.children.buffer[0];
      Set_color_a(handle, alpha);
      // handle.mat.SetColorAlpha(alpha, handle.gfx);

      const value_text = this.children.buffer[this.value_text_idx];
      Set_color_a(value_text, alpha);
      // value_text.mat.SetColorAlpha(alpha, value_text.gfx);
   }





   /*******************************************************************************************************************************************************/
   // Setters-Getters

   

   SetGfxInserted(flag) {

      this.is_gfx_inserted = flag;

      const bar = this.children.buffer[this.bar_idx];
      bar.geom.SetPosY(posy, tbaris.gfx);

      const name_text = this.text_mesh;
      name_text.is_gfx_inserted = flag;

      const handle = bar.children.buffer[0];
      handle.is_gfx_inserted = flag;

      const value_text = this.children.buffer[this.value_text_idx];
      value_text.is_gfx_inserted = flag;
   }



   SetMenuOptionsClbk(ClbkFunction) {

      const bar = this.children.buffer[this.bar_idx].children.buffer[0];
      bar.menu_options.Clbk = ClbkFunction;
   }


   SetPosZNoGfxUpdate(z) {
      this.geom.pos[2] = z;

      const bar = this.children.buffer[this.bar_idx];
      bar.geom.pos[2] = z + 1;
      const name_text = this.text_mesh;
      name_text.geom.pos[2] = z + 1;
      const handle = bar.children.buffer[0];
      handle.geom.pos[2] = bar.geom.pos[2] + 1;
      const value_text = this.children.buffer[this.value_text_idx];
      value_text.geom.pos[2] = z + 1;
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;

      const bar = this.children.buffer[this.bar_idx];
      bar.isFramebufferRendered = fbidx;
      const name_text = this.text_mesh;
      name_text.isFramebufferRendered = fbidx;
      const handle = bar.children.buffer[0];
      handle.isFramebufferRendered = fbidx;
      const value_text = this.children.buffer[this.value_text_idx];
      value_text.isFramebufferRendered = fbidx;
   }







   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   SliderSetValueToInfoText(val) {
      // TODO: This is a HOT-PATH to do so many if statements
      const value_text = this.children.buffer[this.value_text_idx];
      if(this.gfx) value_text.RenderTextFromNumber(val); // Change the text mesh to the current slider's value
      else value_text.SetText(`${val}`);
   }


   SliderConnect(Clbk, clbk_params) {
   
      const bar = this.children.buffer[this.bar_idx];
      Slider_simple_connect(bar, Clbk, clbk_params);
   }


   SetInitialValue(val){
      
      const bar = this.children.buffer[this.bar_idx];
      bar.SetInitialValue(val);
      this.SliderSetValueToInfoText(val);
   }
   

   SetColorHandleNoGfxUpdate(col){

      const bar = this.children.buffer[this.bar_idx];
      bar.SetColorHandleNoGfxUpdate(col);
   }

   GetValue(){
      const bar = this.children.buffer[this.bar_idx];
      return bar.slider_val;
   }
}
   

export function Slider_get_slider_val(params){
   
   const slider = params.slider;
   const bar = slider.children.buffer[slider.bar_idx];
   return bar.slider_val;

}


