"use strict";

import { Rect } from '../Meshes/Rect_Mesh.js';
import { MouseGetPos, MouseGetPosDif } from '../../Controls/Input/Mouse.js';
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from '../../Timers/TimeIntervals.js';
import { Gfx_generate_context } from '../../Interfaces/Gfx/MeshGfxContext.js';
import { AddArr2, RoundFloat1Decimal } from '../../../Helpers/Math/MathOperations.js';
import { Create_rect_mesh, Create_widget_text } from '../../Core/CreateWidget.js';
import { Widget_root_add_mesh, Widget_root_create_root, Widget_root_set_in_focus } from '../../Core/MeshBuffer.js';
import { Vertex_buffer_add_vertices } from '../../../Graphics/Buffers/VertexBuffers.js';
import { BLUE_10_120_220, GREY, REDL, WHITE } from '../Material/Base/Colors.js';
import { Find_parent_listen_event } from '../Operations/Recursions.js';
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_is_vb_root_wpos } from '../../Core/MeshUniformsBuffer.js';
import { Set_color_a } from '../Operations/MeshAttributesFunctions.js';







let SLIDER_BAR_IDX = INT_NULL;

export class Widget_Slider extends Rect {

   text_mesh;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, _pos, dim, col = TRANSPARENCY(GREY[0], .6), hover_margin = [0, 0], is_debug_mesh) {

      // Calculate the bar's and handle's horizontal pading.
      const ratio = dim[0] / dim[1];
      const pad = [dim[0] * 0.5, dim[1] / 2.8];
      pad[0] /= ratio;

      // Calculate the font size of the sliders texts, base on the sliders dimentions
      const min_font_size = 7, max_font_size = 25;
      const r = 2;
      const fontSize = max_font_size < (dim[1] / r) ? max_font_size : (min_font_size > (dim[1] / r) ? min_font_size : (dim[1] / r));


      const pos = (ROOT_WIDGET_FLAGS !== undefined) ? _pos  : [0, 0, _pos[2]];


      // Create slider_name_text (it is the text_mesh of the extended Widget_Label class)
      const name_text = Create_widget_text(ROOT_WIDGET_FLAGS, 'Slider', pos, fontSize, WHITE, .4, is_debug_mesh);
      
      /** Label area mesh */
      super(pos, dim, col, is_debug_mesh);
      
      name_text.sid.gfx_group = this.sid.gfx_group;

      this.mesh_bufferidx = mesh_bufferidx;
      this.type |= MESH_TYPE.WIDGET_SLIDER;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle([0, 6, 2]);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

      // this.StateEnable(MESH_STATE.HAS_POPUP);


      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      // Slider Bar: Bar is child of the slider mesh

      // Calculate bar's dimentions and position.
      const barMetrics = this.#CalculateBarArea(pos, dim, pad)

      const bar = Create_rect_mesh(barMetrics.pos, barMetrics.dim, GREY[3], is_debug_mesh);
      bar.sid.gfx_group = this.sid.gfx_group;

      bar.type |= MESH_TYPE.WIDGET_SLIDER_BAR | bar.geom | bar.mat;
      bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      bar.SetStyle([0, 1, .4]);
      bar.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      
      
      
      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      // Slider Handle: Handle is a child of the bar mesh
      pad[1] = dim[1] / 10;
      const handleMetrics = this.#CalculateHandleArea(bar.geom.pos, dim, pad)
      
      
      const handle = Create_rect_mesh(handleMetrics.pos, handleMetrics.dim, BLUE_10_120_220, is_debug_mesh);
      handle.sid.gfx_group = this.sid.gfx_group;
      handle.type |= MESH_TYPE.WIDGET_SLIDER_HANDLE | handle.geom | handle.mat;
      handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      handle.SetStyle([5, 35, 3]);
      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      
      
      
      // Create value_text
      const value_text = Create_widget_text(ROOT_WIDGET_FLAGS, '0000', pos, fontSize, WHITE, .4, is_debug_mesh);
      value_text.sid.gfx_group = this.sid.gfx_group;
      
      
      // Make the vertical area of the bar larger for hover and handle moving.
      bar.hover_margin = [0, handle.geom.dim[1] + 4];
      
      
      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      // Align
      const totalheight = (handle.geom.dim[1] + name_text.geom.dim[1] + value_text.geom.dim[1]);
      this.geom.dim[1] = totalheight;
      
      bar.geom.dim[1] = 2;
      bar.geom.pos[0] = pad[0]*2;
      bar.geom.pos[1] = this.geom.dim[1]*2-handle.geom.dim[1]-pad[1];
      
      handle.geom.pos[0] = bar.geom.pos[0];
      handle.geom.pos[1] = bar.geom.pos[1] - handle.geom.dim[1];
      
      value_text.geom.pos[0] = this.geom.dim[0]*2 - (value_text.GetMaxWidth()*2) ;
      value_text.geom.pos[1] = 4;
      value_text.geom.pos[2] = bar.geom.pos[2] + 1;
      // value_text.parent = bar;
      
      name_text.geom.pos[0] = 0;
      name_text.geom.pos[1] = 4;
      name_text.geom.pos[2] = this.geom.pos[2] + 1;
      name_text.parent = this;
      
      SLIDER_BAR_IDX = this.AddChild(bar)
      bar.AddChild(handle)
      bar.AddChild(value_text)
      
      this.text_mesh = name_text;
      
      
      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT && this) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);
         
         this.AddToWidgetRootBuffer(this.root_bufferidx)
      }
      
      value_text.SetName(this.GetName() + ' - value_text');
      handle.SetName('handle');
      bar.SetName('Bar');
      this.SetName('Widget_Slider');
      
   }


   Destroy() {

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      const name_text = this.text_mesh;
      const handle = bar.children.buffer[0];
      const value_text = bar.children.buffer[1];

      value_text.Destroy();
      handle.Destroy();
      // name_text.Destroy();
      bar.Destroy();

      // Sliders's rect_mesh destruction
      return super.Destroy();
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(bar.root_bufferidx, bar.mesh_bufferidx);

      const name_text = this.text_mesh;
      name_text.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(name_text.root_bufferidx, name_text.mesh_bufferidx);

      const handle = bar.children.buffer[0];
      handle.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(handle.root_bufferidx, handle.mesh_bufferidx);

      const value_text = bar.children.buffer[1];
      value_text.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(value_text.root_bufferidx, value_text.mesh_bufferidx);

   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.state.mask |= MESH_STATE.ACTIVE;

      const name_text = this.text_mesh;
      name_text.state.mask |= MESH_STATE.ACTIVE;

      const handle = bar.children.buffer[0];
      handle.state.mask |= MESH_STATE.ACTIVE;

      const value_text = bar.children.buffer[1];
      value_text.state.mask |= MESH_STATE.ACTIVE;
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.state.mask &= ~MESH_STATE.ACTIVE;

      const name_text = this.text_mesh;
      name_text.state.mask &= ~MESH_STATE.ACTIVE;

      const handle = bar.children.buffer[0];
      handle.state.mask &= ~MESH_STATE.ACTIVE;

      const value_text = bar.children.buffer[1];
      value_text.state.mask &= ~MESH_STATE.ACTIVE;
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.state.mask |= MASK;

      const name_text = this.text_mesh;
      name_text.state.mask |= MASK;

      const handle = bar.children.buffer[0];
      handle.state.mask |= MASK;

      const value_text = bar.children.buffer[1];
      value_text.state.mask |= MASK;

   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
      
      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.state.mask &= ~MASK;

      const name_text = this.text_mesh;
      name_text.state.mask &= ~MASK;

      const handle = bar.children.buffer[0];
      handle.state.mask &= ~MASK;

      const value_text = bar.children.buffer[1];
      value_text.state.mask &= ~MASK;

   }



   /*******************************************************************************************************************************************************/
   // Graphics

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY) {


      this.gfx = Gfx_generate_context(FLAGS, this);
      const rect_igfx = [this.gfx.prog.idx, this.gfx.vb.idx]; // Copy the gfx from the scroller area.
      
      
      const name_text = this.text_mesh;
      name_text.gfx = Gfx_generate_context(FLAGS|GFX_CTX_FLAGS.SPECIFIC, name_text);
      const text_igfx = [name_text.gfx.prog.idx, name_text.gfx.vb.idx];

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.gfx = Gfx_generate_context(FLAGS, bar, rect_igfx);

      const handle = bar.children.buffer[0];
      handle.gfx = Gfx_generate_context(FLAGS, handle, rect_igfx);

      const value_text = bar.children.buffer[1];
      value_text.gfx = Gfx_generate_context(FLAGS|GFX_CTX_FLAGS.SPECIFIC, value_text, text_igfx);
   
      return this.gfx;
   }


   Render() {

      if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfx(); this.is_gfx_inserted = true }
      if (!this.text_mesh.is_gfx_inserted && (this.text_mesh.state.mask & MESH_STATE.ACTIVE)) { this.text_mesh.AddToGfx(); this.text_mesh.is_gfx_inserted = true }

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      if (!bar.is_gfx_inserted && (bar.state.mask & MESH_STATE.ACTIVE)) { bar.AddToGfx(); bar.is_gfx_inserted = true }

      const handle = bar.children.buffer[0];
      if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfx(); handle.is_gfx_inserted = true }

      const value_text = bar.children.buffer[1];
      if (!value_text.is_gfx_inserted && (value_text.state.mask & MESH_STATE.ACTIVE)) { value_text.AddToGfx(); value_text.is_gfx_inserted = true }
   }


   Rerender() {

      // Reset gfx start for the mesh
      // Add to vertexbuffer
      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName());
      this.is_gfx_inserted = true;
      this.StateEnable(MESH_STATE.ACTIVE);

      this.text_mesh.AddToGfxFromReset();

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      Vertex_buffer_add_vertices(bar.gfx, bar.geom, bar.mat, bar.GetName());
      bar.is_gfx_inserted = true;
      bar.StateEnable(MESH_STATE.ACTIVE);

      const handle = bar.children.buffer[0];
      Vertex_buffer_add_vertices(handle.gfx, handle.geom, handle.mat, handle.GetName());
      handle.is_gfx_inserted = true;
      handle.StateEnable(MESH_STATE.ACTIVE);

      const value_text = bar.children.buffer[1];
      value_text.AddToGfxFromReset();
   }


   DeactivateGfx() {

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      // const name_text = this.text_mesh;
      const handle = bar.children.buffer[0];
      const value_text = bar.children.buffer[1];

      bar.DeactivateGfx();
      // name_text.DeactivateGfx();
      handle.DeactivateGfx();
      value_text.DeactivateGfx();
      super.DeactivateGfx()

   }



   /*******************************************************************************************************************************************************/
   // Events Handling


   // SEE ### OnMove Events Implementation Logic
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
      
      // Widget_root_gfx_add_unif_wpos_per_vb(mesh.root_bufferidx, [mouse_pos.x, -mouse_pos.y]);
      Mesh_unif_add_vb_root_wpos(mesh.root_posidx, [mouse_pos.x, -mouse_pos.y]);
      
      mesh.SetUpdateFrameBuffer();

   }


   // TODO!!!: the widget is passed in 'params.evt_params.target_mesh', so REMOVE the 'params.source_params' tha has the slider.area_mesh is not needed. 
   OnClick(params) {

      const mesh = params.evt_params.target_mesh;
      const point = MouseGetPos();

      // Check if the click happened on bar for slide event
      const bar = mesh.children.buffer[SLIDER_BAR_IDX];
      const sliderypos = bar.parent.geom.pos[1] -bar.parent.geom.dim[1]

      if (point[1] > bar.GetPosY() - bar.hover_margin[1]) { // TODO!!! The only thing currently that seperates handle-move from widget-move is the fact that this if fails for 'hover_margin=0'. Create a more apropriate check.
         
         console.log('mouse', point[1], 'bar ypos', bar.geom.pos[1]*2, 'hover margin', bar.hover_margin[1], bar.geom.pos[1]*2+sliderypos, bar.GetPosY())
         
         
         STATE.mesh.SetClicked(bar);
         // STATE.mesh.SetFocused(mesh);

         if ((bar.type & MESH_TYPE.WIDGET_SLIDER_BAR) && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

            const idx = TimeIntervalsCreate(10, 'Move Slider Handle', TIME_INTERVAL_REPEAT_ALWAYS, Slider_on_update_handle, bar);
            bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);
            // bar.timeIntervalsIdxBuffer.Add(idx);

            STATE.mesh.SetGrabed(bar);
            STATE.mesh.SetFocused(mesh);
            mesh.state.mask |= MESH_STATE.IN_FOCUS;
            bar.StateEnable(MESH_STATE.IN_GRAB|MESH_STATE.IN_FOCUS);
            Widget_root_set_in_focus(mesh.root_bufferidx);
         }

         return true;
      }
      else { // Else Move Widget Slider 

         STATE.mesh.SetClicked(bar);
         // STATE.mesh.SetFocused(mesh);

         if ((mesh.type & MESH_TYPE.WIDGET_SLIDER) && mesh.StateCheck(MESH_STATE.IS_GRABABLE) && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            const idx = TimeIntervalsCreate(10, 'Move Slider', TIME_INTERVAL_REPEAT_ALWAYS, mesh.OnMove, mesh);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

            STATE.mesh.SetGrabed(mesh);
            STATE.mesh.SetFocused(mesh);
            mesh.StateEnable(MESH_STATE.IN_GRAB|MESH_STATE.IN_FOCUS);
            Widget_root_set_in_focus(mesh.root_bufferidx);
         }

         // Handle any menu (on leftClick only)
         if (mesh.StateCheck(MESH_STATE.HAS_POPUP)) {

            const btnId = params.trigger_params;
            Widget_popup_handler_onclick_event(mesh, btnId)
         }

         return true;
      }
   }


   // SEE ### Construct Listeners
   ConstructListeners(parent_listeners = null) {

      const slider = this;
      const bar = slider.children.buffer[SLIDER_BAR_IDX];
      const handle = bar.children.buffer[0];


      for (let i = 0; i < LISTEN_EVENT_TYPES_INDEX.SIZE; i++) {
         
               
         if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
            parent_listeners = [null, null];
         }

         if(slider.listeners){

            const params = {
               EventClbk: null, targetBindingFunctions: null,
               target_mesh: slider, params: null,
            }

            if(slider.listeners.buffer[i] !== null){
               
               slider.AddListenEvent(i, slider.OnClick, params, slider.listeners.buffer[i]);
               parent_listeners[i] = slider.listeners.buffer[i];
            }
            
            if(bar.listeners.buffer[i] !== null){
               bar.AddListenEvent(i, slider.OnClick, params, parent_listeners[i]);
            }
            if(handle.listeners.buffer[i] !== null){
               bar.AddListenEvent(i, slider.OnClick, params, parent_listeners[i]);
            }
         }
         else {


            if (parent_listeners[i] === null || parent_listeners[i] === INT_NULL) {
               parent_listeners[i] = Find_parent_listen_event(i, bar);
            }

            if (bar.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {
   
               bar.AddListenEvent(i, null, null, parent_listeners[i])
            }
            else { // Else construct with Clbk and params
   
               const params = {
                  EventClbk: null, targetBindingFunctions: null,
                  target_mesh: slider, params: null,
               }
   
               bar.AddListenEvent(i, slider.OnClick, params, parent_listeners[i]);
            }
         }
      }
   }



   /*******************************************************************************************************************************************************/
   // Transformations

   Move(x, y) {

      if (x === 0 && y === 0) return;

      AddArr2(this.geom.pos, [x,y]);
      this.geom.MoveXY(x, y, this.gfx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.MoveXY(x, y, bar.gfx);

      const name_text = this.text_mesh;
      name_text.geom.MoveXY(x, y, name_text.gfx);

      const handle = bar.children.buffer[0];
      handle.geom.MoveXY(x, y, handle.gfx);

      const value_text = bar.children.buffer[1];
      value_text.geom.MoveXY(x, y, value_text.gfx);

   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[0] += x;
      bar.geom.pos[1] += y;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] += x;
      name_text.geom.pos[1] += y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += x;
      handle.geom.pos[1] += y;

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[0] += x;
      value_text.geom.pos[1] += y;

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[1] += y;

      const name_text = this.text_mesh;
      name_text.geom.pos[1] += y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[1] += y;

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[1] += y;

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[0] += x;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] += x;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += x;

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[0] += x;

   }
   

   SetPosXNoGfxUpdate(x) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         
         this.geom.pos[0] = x;
         
         const bar = this.children.buffer[SLIDER_BAR_IDX];
         bar.geom.pos[0] += x;
   
         const name_text = this.text_mesh;
         name_text.geom.pos[0] += x;
   
         const handle = bar.children.buffer[0];
         handle.geom.pos[0] += x;
   
         const value_text = bar.children.buffer[1];
         value_text.geom.pos[0] += x;
      }

   }


   SetPosYNoGfxUpdate(y) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         
         this.geom.pos[1] = y;

         const bar = this.children.buffer[SLIDER_BAR_IDX];
         bar.geom.pos[1] += y;
   
         const name_text = this.text_mesh;
         name_text.geom.pos[1] += y;
   
         const handle = bar.children.buffer[0];
         handle.geom.pos[1] += y;
   
         const value_text = bar.children.buffer[1];
         value_text.geom.pos[1] += y;
      }

   }


   SetPosXYNoGfxUpdate(x, y) {
      
      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
   
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
   
         const bar = this.children.buffer[SLIDER_BAR_IDX];
         bar.geom.pos[0] += x;
         bar.geom.pos[1] += y;
   
         const name_text = this.text_mesh;
         name_text.geom.pos[0] += x;
         name_text.geom.pos[1] += y;
   
         const handle = bar.children.buffer[0];
         handle.geom.pos[0] += x;
         handle.geom.pos[1] += y;
   
         const value_text = bar.children.buffer[1];
         value_text.geom.pos[0] += x;
         value_text.geom.pos[1] += y;
      }
   }
   

   TEMP_recalc(x, y) {

      const dx = x-this.geom.pos[0];
      const dy = y-this.geom.pos[1];

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[0] += dx;
      bar.geom.pos[1] += dy;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] += dx;
      name_text.geom.pos[1] += dy;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += dx;
      handle.geom.pos[1] += dy;

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[0] += dx;
      value_text.geom.pos[1] += dy;
  }


   SetColorAlpha(alpha) {

      this.mat.SetColorAlpha(alpha, this.gfx);
      Set_color_a(this, alpha);
      
      const bar = this.children.buffer[SLIDER_BAR_IDX];
      Set_color_a(bar, alpha);
      // bar.mat.SetColorAlpha(alpha, bar.gfx);
      
      const name_text = this.text_mesh;
      Set_color_a(name_text, alpha);
      // name_text.mat.SetColorAlpha(alpha, name_text.gfx);
      
      const handle = bar.children.buffer[0];
      Set_color_a(handle, alpha);
      // handle.mat.SetColorAlpha(alpha, handle.gfx);
      
      const value_text = bar.children.buffer[1];
      Set_color_a(value_text, alpha);
      // value_text.mat.SetColorAlpha(alpha, value_text.gfx);
   }


   SetGfxInserted(flag) {

      this.is_gfx_inserted = flag;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.SetPosY(posy, tbaris.gfx);

      const name_text = this.text_mesh;
      name_text.is_gfx_inserted = flag;

      const handle = bar.children.buffer[0];
      handle.is_gfx_inserted = flag;

      const value_text = bar.children.buffer[1];
      value_text.is_gfx_inserted = flag;
   }





   /*******************************************************************************************************************************************************/
   // Setters-Getters


   SetMenuOptionsClbk(ClbkFunction) {

      const bar = this.children.buffer[SLIDER_BAR_IDX].children.buffer[0];
      bar.menu_options.Clbk = ClbkFunction;
   }


   SetPosZNoGfxUpdate(z) {
      this.geom.pos[2] = z;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[2] = z + 1;
      const name_text = this.text_mesh;
      name_text.geom.pos[2] = z + 1;
      const handle = bar.children.buffer[0];
      handle.geom.pos[2] = bar.geom.pos[2] + 1;
      const value_text = bar.children.buffer[1];
      value_text.geom.pos[2] = z + 1;
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.isFramebufferRendered = fbidx;
      const name_text = this.text_mesh;
      name_text.isFramebufferRendered = fbidx;
      const handle = bar.children.buffer[0];
      handle.isFramebufferRendered = fbidx;
      const value_text = bar.children.buffer[1];
      value_text.isFramebufferRendered = fbidx;
   }




   /*******************************************************************************************************************************************************/
   // Alignment





   /*******************************************************************************************************************************************************/
   // Misc




   /*******************************************************************************************************************************************************/
   // Private Methods 

   #CalculateBarArea(_pos, _dim, pad) {

      const dim = [RoundFloat1Decimal(_dim[0] - (pad[0] * 2)), RoundFloat1Decimal(_dim[1] - (pad[1] * 2))];
      const pos = [0, 0, _pos[2] + 1]; // Does not need to change for center positioning.

      return {
         pos: pos,
         dim, dim,
      };
   }



   #CalculateHandleArea(_pos, _dim, pad) {

      const dim = [0, _dim[1] - (pad[1] * 2)];
      dim[0] = dim[1];
      const pos = [_pos[0], 0, _pos[2] + 1]; // Does not need to change for center positioning.

      return {
         pos: pos,
         dim, dim,
      };
   }


}

export function Slider_connect(_params) {

   const sliderBar = _params.self_mesh.children.buffer[SLIDER_BAR_IDX];
   const target = _params.target_mesh;
   const Binding_function = _params.targetBindingFunctions;

   /*FOR DEBUG*/const clicked_mesh = _params.clicked_mesh

   // Check if the connection already exists
   for (let i = 0; i < sliderBar.eventCallbacks.count; i++) {

      if (sliderBar.eventCallbacks.buffer[i] !== null) {

         var newTargetId = _params.target_mesh.id;
         var existingTargetId = sliderBar.eventCallbacks.buffer[i].target.id;

         // The connection already exists
         if (newTargetId === existingTargetId) {

            console.log('Disconnecting target:', sliderBar.eventCallbacks.buffer[i].target.GetName(), ' clicked:', STATE.mesh.clickedId);
            /*FOR DEBUG*/Set_color_rgba(clicked_mesh, REDL[7]);

            // Disconnect
            sliderBar.eventCallbacks.RemoveByIdx(i);
            return;
         }
      }

   }

   console.log('Connecting target:', target.GetName(), ' clicked:', STATE.mesh.clickedId);
   /*FOR DEBUG*/Set_color_rgba(clicked_mesh, GREEN);

   const params = {
      target: target,
      Clbk: Binding_function,
   }
   // sliderBar.eventCallbacks.Add(params);
   sliderBar.CreateEventCallback(params);

}



export function Slider_bind_on_value_change(sliderBar, target, Clbk) {

   const params = {
      target: target,
      Clbk: Binding_function,
   }
   // sliderBar.eventCallbacks.Add(params);
   sliderBar.CreateEventCallback(params);

}



export function Slider_on_update_handle(_params) {

   /**
    * The function is called by the timeInterval.
    * The timeInterval has been set by the 'Slider_create_on_click_event',
    * that is called from 'HandleEvents()' 
    * as 'mesh.eventCallbacks.buffer[i].Clbk(target, Clbk);'
    * The 'HandleEvents()' passes the param '_params' to this function.
    */

   const bar = _params.params;
   const handle = bar.children.buffer[0];
   const slider_val = bar.children.buffer[1];

   if (bar.StateCheck(MESH_STATE.IN_GRAB) === 0 && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

      // If bar out of hover, delete the timeInterval for moving the handle
      const intervalIdx = bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      bar.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);

      return;
   }

   Slider_move_handle(bar, handle);

   const val = Slider_calculate_value(bar, handle); // Calculate slider's value based on the handles position.

   slider_val.RenderTextFromNumber(val); // Change the text mesh to the current slider's value

   /**
    * Dispatch all callbacks for all targets, that is
    * found on every eventCallbacks[] buffer.  
    */
   if (bar.eventCallbacks.count) {
      for (let i = 0; i < bar.eventCallbacks.count; i++) {

         if (bar.eventCallbacks.buffer[i] !== null) {

            const target = bar.eventCallbacks.buffer[i].target;
            const TargetClbk = bar.eventCallbacks.buffer[i].Clbk;
            TargetClbk(target, val, 100);
         }
      }
   }

}



/*******************************************************************************************************************************************************/
// Slider Functionality 

function Slider_move_handle(bar, handle) {

   const x = MouseGetPosDif().x;
   if(x===0) return;

   if(handle.geom.pos[0] + x >= 0 && handle.geom.pos[0] + x <= bar.geom.dim[0]*2){
      handle.geom.pos[0] += x;
      handle.geom.MoveX(x, handle.gfx);
      // console.log(handle.geom.pos[0], bar.geom.dim[0])
   }

   handle.SetUpdateFrameBuffer(); // IMIDIATELY: It is very complicated that we do not have a pipeline for the "mesh update gfx buffers". We need something more concrete  as to where the updates are passing through
   
   return true;
}



function Slider_calculate_value(bar, handle) {
   
   const barwidth = bar.geom.dim[0]*2;
   const val = handle.geom.pos[0];
   
   const max = 100; // Set the max value the slider will interpolate to.
   // Interpolate to a 0-max value.
   const sliderVal = (val * max) / (barwidth);

   return sliderVal;
}


