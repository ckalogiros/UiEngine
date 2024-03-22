"use strict";

import { Rect } from '../Meshes/Rect_Mesh.js';
import { MouseGetPos, MouseGetPosDif } from '../../Controls/Input/Mouse.js';
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from '../../Timers/TimeIntervals.js';
import { Gfx_generate_context } from '../../Interfaces/Gfx/MeshGfxContext.js';
import { Find_gfx_match_widget_root_impl } from '../../Interfaces/Gfx/GfxContextFindMatch.js';
import { AddArr2, RoundFloat1Decimal } from '../../../Helpers/Math/MathOperations.js';
import { Create_rect_mesh, Create_widget_text } from '../../Core/CreateWidget.js';
import { Widget_group_add, Widget_group_update_decrement, Widget_group_update_increment, Widget_root_add_mesh } from '../../Core/MeshBuffer.js';
import { Vertex_buffer_add_vertices } from '../../../Graphics/Buffers/VertexBuffers.js';
import { Index_buffer_add_indices } from '../../../Graphics/Buffers/IndexBuffers.js';
import { BLUE_10_120_220, GREY, REDL, WHITE } from '../Material/Base/Colors.js';



let SLIDER_BAR_IDX = INT_NULL;

// export class Widget_Slider extends Widget_Label {
export class Widget_Slider extends Rect {

   text_mesh;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, dim, col = TRANSPARENCY(GREY[1], .6), hover_margin = [0, 0]) {

      // Calculate the bar's and handle's horizontal pading.
      const ratio = dim[0] / dim[1];
      const pad = [dim[0] * 0.5, dim[1] / 2.8];
      // const pad = [dim[0], dim[1] / 2.8];
      pad[0] /= ratio;

      // Calculate the font size of the sliders texts, base on the sliders dimentions
      // const min_font_size = 4, max_font_size = 10;
      // const r = 3;
      // const fontSize = max_font_size < (dim[1] / r) ? max_font_size : (min_font_size > (dim[1] / r) ? min_font_size : (dim[1] / r));
      const fontSize = 10;


      // Create slider_name_text (it is the text_mesh of the extended Widget_Label class)
      const name_text = Create_widget_text(ROOT_WIDGET_FLAGS, 'Slider', pos, fontSize, WHITE, .4);


      /** Label area mesh */
      super(pos, dim, col);

      this.mesh_bufferidx = mesh_bufferidx;
      this.type |= MESH_TYPE.WIDGET_SLIDER;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle([0, 6, 2]);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      
      
      this.SetName('Widget_Slider');
      // this.StateEnable(MESH_STATE.HAS_POPUP);

      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT && this) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);
      }

      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      // Slider Bar: Bar is child of the slider mesh

      // Calculate bar's dimentions and position.
      const barpos = [pos[0], pos[1] + this.geom.dim[1], pos[2]]
      const barMetrics = this.#CalculateBarArea(barpos, dim, pad)

      const bar = Create_rect_mesh(barMetrics.pos, barMetrics.dim, GREY[3]);

      bar.type |= MESH_TYPE.WIDGET_SLIDER_BAR | bar.geom | bar.mat;
      bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      bar.SetStyle([0, 3, 2]);
      // bar.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      bar.SetName('Bar');


      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      // Slider Handle: Handle is a child of the bar mesh
      pad[1] = dim[1] / 10;
      const handleMetrics = this.#CalculateHandleArea(bar.geom.pos, dim, pad)

      const handle = Create_rect_mesh(handleMetrics.pos, handleMetrics.dim, BLUE_10_120_220);

      handle.type |= MESH_TYPE.WIDGET_SLIDER_HANDLE | handle.geom | handle.mat;
      handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      handle.SetStyle([5, 35, 3]);
      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      handle.SetName('handle');


      // Create value_text
      const value_text = Create_widget_text(ROOT_WIDGET_FLAGS, '0000', pos, fontSize, WHITE, .4);
      value_text.SetName(this.GetName() + ' - value_text');


      // Make the vertical area of the bar larger for hover and handle moving.
      bar.hover_margin = [0, handle.geom.dim[1] + 4];


      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
      // Align
      const totalheight = (handle.geom.dim[1] + name_text.geom.dim[1] + value_text.geom.dim[1]);
      this.geom.dim[1] = totalheight;

      bar.geom.pos[0] = this.geom.pos[0];
      bar.geom.pos[1] = this.geom.pos[1] + this.geom.dim[1] - handle.geom.dim[1] - pad[1];

      handle.geom.pos[0] = bar.geom.pos[0];
      handle.geom.pos[1] = bar.geom.pos[1];

      value_text.geom.pos[1] = handle.geom.pos[1] - handle.geom.dim[1] - value_text.geom.dim[1]
      value_text.geom.pos[0] = bar.geom.pos[0] + bar.geom.dim[0] - (value_text.geom.CalcTextWidth());
      value_text.geom.pos[2] = bar.geom.pos[2] + 1;

      name_text.geom.pos[1] = handle.geom.pos[1] - handle.geom.dim[1] - name_text.geom.dim[1]
      name_text.geom.pos[0] = bar.geom.pos[0] - bar.geom.dim[0] + name_text.geom.dim[0];
      name_text.geom.pos[2] = this.geom.pos[2] + 1;

      SLIDER_BAR_IDX = this.AddChild(bar)
      // this.AddChild(name_text)
      bar.AddChild(handle)
      bar.AddChild(value_text)

      this.text_mesh = name_text;

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


   AddToWidgetGroupBuffer(group_bufferidx) {

      if(group_bufferidx === INT_NULL)
         console.error('Catch group_bufferidx === -1. this:', this.GetName(), this)

      if (this.state.mask & MESH_STATE.ACTIVE) {
         /**DEBUG */ if (!this.gfx) console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO GFX FOR MESH:', this.mesh_bufferidx, this.GetName());
         /**DEBUG */ if (this.group_bufferidxs[1] !== INT_NULL) console.error('ADDING TO WIDGET GROUP BUFFER WARNING: MESH ALREADY IS IN A WIDGET GROUP:', this.mesh_bufferidx, this.GetName(), 'group:', this.group_bufferidxs, 'start', this.gfx.vb.start);

         this.group_bufferidxs[0] = group_bufferidx;
         this.group_bufferidxs[1] = Widget_group_add(group_bufferidx, this.gfx, this.geom.num_faces, this.mesh_bufferidx);

         const bar = this.children.buffer[SLIDER_BAR_IDX];
         bar.group_bufferidxs[0] = group_bufferidx;
         bar.group_bufferidxs[1] = Widget_group_add(group_bufferidx, bar.gfx, bar.geom.num_faces, bar.mesh_bufferidx);

         const name_text = this.text_mesh;
         name_text.group_bufferidxs[0] = group_bufferidx;
         name_text.group_bufferidxs[1] = Widget_group_add(group_bufferidx, name_text.gfx, name_text.geom.num_faces, name_text.mesh_bufferidx);

         const handle = bar.children.buffer[0];
         handle.group_bufferidxs[0] = group_bufferidx;
         handle.group_bufferidxs[1] = Widget_group_add(group_bufferidx, handle.gfx, handle.geom.num_faces, handle.mesh_bufferidx);

         const value_text = bar.children.buffer[1];
         value_text.group_bufferidxs[0] = group_bufferidx;
         value_text.group_bufferidxs[1] = Widget_group_add(group_bufferidx, value_text.gfx, value_text.geom.num_faces, value_text.mesh_bufferidx);
      }
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

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx = null) {

      if (FLAGS & GFX_CTX_FLAGS.PRIVATE) {

         {
            const igfx_rect = Find_gfx_match_widget_root_impl(this.root_bufferidx, this.sid);
            FLAGS |= igfx_rect.FLAGS;
            this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, igfx_rect.FLAGS, igfx_rect.idxs, this.root_bufferidx, this.mesh_bufferidx, this.uniforms);
   
            const igfx_text = Find_gfx_match_widget_root_impl(this.text_mesh.root_bufferidx, this.text_mesh.sid);
            FLAGS |= igfx_text.FLAGS;
            this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.sid, this.text_mesh.sceneidx, this.text_mesh.geom.num_faces, igfx_text.FLAGS, igfx_text.idxs, this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx, this.text_mesh.uniforms);
         }

         // We already have a vertex buffer for rect and text rendering
         const igfx_rect = [this.gfx.prog.idx, this.gfx.vb.idx];
         const igfx_text = [this.text_mesh.gfx.prog.idx, this.text_mesh.gfx.vb.idx];


         const name_text = this.text_mesh;
         name_text.gfx = Gfx_generate_context(name_text.sid, name_text.sceneidx, name_text.geom.num_faces, FLAGS | GFX_CTX_FLAGS.SPECIFIC, igfx_text, name_text.root_bufferidx, name_text.mesh_bufferidx);

         const bar = this.children.buffer[SLIDER_BAR_IDX];
         bar.gfx = Gfx_generate_context(bar.sid, bar.sceneidx, bar.geom.num_faces, FLAGS | GFX_CTX_FLAGS.SPECIFIC, igfx_rect, bar.root_bufferidx, bar.mesh_bufferidx);

         const handle = bar.children.buffer[0];
         handle.gfx = Gfx_generate_context(handle.sid, handle.sceneidx, handle.geom.num_faces, FLAGS | GFX_CTX_FLAGS.SPECIFIC, igfx_rect, handle.root_bufferidx, handle.mesh_bufferidx);

         const value_text = bar.children.buffer[1];
         value_text.gfx = Gfx_generate_context(value_text.sid, value_text.sceneidx, value_text.geom.num_faces, FLAGS | GFX_CTX_FLAGS.SPECIFIC, igfx_text, value_text.root_bufferidx, value_text.mesh_bufferidx);
      }
      else {
         this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, FLAGS, gfxidx, this.root_bufferidx, this.mesh_bufferidx);
         this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.sid, this.text_mesh.sceneidx, this.text_mesh.geom.num_faces, FLAGS, gfxidx, this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);

         const name_text = this.text_mesh;
         name_text.gfx = Gfx_generate_context(name_text.sid, name_text.sceneidx, name_text.geom.num_faces, FLAGS, gfxidx, name_text.root_bufferidx, name_text.mesh_bufferidx);

         const bar = this.children.buffer[SLIDER_BAR_IDX];
         bar.gfx = Gfx_generate_context(bar.sid, bar.sceneidx, bar.geom.num_faces, FLAGS, gfxidx, bar.root_bufferidx, bar.mesh_bufferidx);

         const handle = bar.children.buffer[0];
         handle.gfx = Gfx_generate_context(handle.sid, handle.sceneidx, handle.geom.num_faces, FLAGS, gfxidx, handle.root_bufferidx, handle.mesh_bufferidx);

         const value_text = bar.children.buffer[1];
         value_text.gfx = Gfx_generate_context(value_text.sid, value_text.sceneidx, value_text.geom.num_faces, FLAGS, gfxidx, value_text.root_bufferidx, value_text.mesh_bufferidx);
      }


      return this.gfx;
   }


   Render() {

      if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfx(); this.is_gfx_inserted = true }
      // if (!this.is_gfx_inserted) { this.AddToGfx(); this.is_gfx_inserted = true }
      if (!this.text_mesh.is_gfx_inserted && (this.text_mesh.state.mask & MESH_STATE.ACTIVE)) { this.text_mesh.AddToGfx(); this.text_mesh.is_gfx_inserted = true }
      // if (!this.text_mesh.is_gfx_inserted) { this.text_mesh.AddToGfx(); this.text_mesh.is_gfx_inserted = true }

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      if (!bar.is_gfx_inserted && (bar.state.mask & MESH_STATE.ACTIVE)) { bar.AddToGfx(); bar.is_gfx_inserted = true }
      // if (!bar.is_gfx_inserted) { bar.AddToGfx(); bar.is_gfx_inserted = true }

      const handle = bar.children.buffer[0];
      if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfx(); handle.is_gfx_inserted = true }
      // if (!handle.is_gfx_inserted) { handle.AddToGfx(); handle.is_gfx_inserted = true }

      const value_text = bar.children.buffer[1];
      if (!value_text.is_gfx_inserted && (value_text.state.mask & MESH_STATE.ACTIVE)) { value_text.AddToGfx(); value_text.is_gfx_inserted = true }
      // if (!value_text.is_gfx_inserted) { value_text.AddToGfx(); value_text.is_gfx_inserted = true }
   }


   Rerender() {

      // Reset gfx start for the mesh
      // Add to vertexbuffer
      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName());
      if(this.sid.shad & SID.SHAD.INDEXED) this.gfx.ib.start = Index_buffer_add_indices(this.gfx.ib, this.GetName());
      this.is_gfx_inserted = true;
      this.StateEnable(MESH_STATE.ACTIVE);

      this.text_mesh.AddToGfxFromReset();

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      Vertex_buffer_add_vertices(bar.gfx, bar.geom, bar.mat, bar.GetName());
      if(bar.sid.shad & SID.SHAD.INDEXED) bar.gfx.ib.start = Index_buffer_add_indices(bar.gfx.ib, bar.GetName());
      bar.is_gfx_inserted = true;
      bar.StateEnable(MESH_STATE.ACTIVE);

      const handle = bar.children.buffer[0];
      Vertex_buffer_add_vertices(handle.gfx, handle.geom, handle.mat, handle.GetName());
      if(handle.sid.shad & SID.SHAD.INDEXED) handle.gfx.ib.start = Index_buffer_add_indices(handle.gfx.ib, handle.GetName());
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
         mesh.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.MOVE);

         return;
      }

      const mouse_pos = MouseGetPosDif();
      // mesh.SetUpdateFramebuffer();

      // alert('MoveY @ WidgetLabel')
      // Move 'this' text
      mesh.geom.MoveXY(mouse_pos.x, -mouse_pos.y, mesh.gfx);

      const bar = mesh.children.buffer[SLIDER_BAR_IDX];
      bar.geom.MoveXY(mouse_pos.x, -mouse_pos.y, bar.gfx);
      const name_text = mesh.text_mesh;
      name_text.geom.MoveXY(mouse_pos.x, -mouse_pos.y, name_text.gfx);
      const handle = bar.children.buffer[0];
      handle.geom.MoveXY(mouse_pos.x, -mouse_pos.y, handle.gfx);
      const value_text = bar.children.buffer[1];
      value_text.geom.MoveXY(mouse_pos.x, -mouse_pos.y, value_text.gfx);

   }


   // TODO!!!: the widget is passed in 'params.target_params.target_mesh', so REMOVE the 'params.source_params' tha has the slider.area_mesh is not needed. 
   OnClick(params) {

      const mesh = params.target_params.target_mesh;
      const point = MouseGetPos();

      // Check if the click happened on bar
      const bar = mesh.children.buffer[SLIDER_BAR_IDX];
      if (point[1] > bar.geom.pos[1] - bar.hover_margin[1]) { // TODO!!! The only thing currently that seperates handle-move from widget-move is the fact that this if fails for 'hover_margin=0'. Create a more apropriate check.

         STATE.mesh.SetClicked(bar);
         // STATE.mesh.SetFocused(mesh);

         if ((bar.type & MESH_TYPE.WIDGET_SLIDER_BAR) && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

            const idx = TimeIntervalsCreate(10, 'Move Slider Handle', TIME_INTERVAL_REPEAT_ALWAYS, Slider_on_update_handle, bar);
            bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);
            // bar.timeIntervalsIdxBuffer.Add(idx);

            STATE.mesh.SetGrabed(bar);
            bar.StateEnable(MESH_STATE.IN_GRAB);
         }

         return true;
      }
      else {

         STATE.mesh.SetClicked(bar);
         // STATE.mesh.SetFocused(mesh);

         // Move Slider 
         if ((mesh.type & MESH_TYPE.WIDGET_SLIDER) && mesh.StateCheck(MESH_STATE.IS_GRABABLE) && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            // const idx = TimeIntervalsCreate(10, 'Move Slider', TIME_INTERVAL_REPEAT_ALWAYS, Slider_move_event, mesh);
            const idx = TimeIntervalsCreate(10, 'Move Slider', TIME_INTERVAL_REPEAT_ALWAYS, mesh.OnMove, mesh);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            // mesh.timeIntervalsIdxBuffer.Add(idx);

            STATE.mesh.SetGrabed(mesh);
            mesh.StateEnable(MESH_STATE.IN_GRAB);
         }

         // Handle any menu (on leftClick only)
         if (mesh.StateCheck(MESH_STATE.HAS_POPUP)) {

            const btnId = params.trigger_params;
            Widget_popup_handler_onclick_event(mesh, btnId)
         }

         return true;
      }
      return false;
   }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null) {

      const slider = this;
      const bar = slider.children.buffer[SLIDER_BAR_IDX];
      const handle = bar.children.buffer[0];

      const root_evt = _root ? _root.listeners.buffer : null;

      // Create hover events, NOT as part of the root listen events.
      if (slider.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.HOVER]) slider.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.HOVER);
      if (handle.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.HOVER]) handle.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.HOVER);
      if (bar.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.HOVER]) bar.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.HOVER);

      const target_params = {
         EventClbk: null,
         targetBindingFunctions: null,
         target_mesh: slider,
         params: null,
      }
      if (slider.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.CLICK]) { // This is a check mainly if the user has activated the 'Move' event for the scroller.

         slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE, false);
         slider.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.CLICK, slider.OnClick, target_params);
      }
      else {

         // Create a Fake click event with no callback and params, but any root events. 
         slider.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, true);
         slider.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.CLICK, null, null, root_evt);
      }
      bar.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      bar.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.CLICK, slider.OnClick, target_params, slider.listeners.buffer);

   }



   /*******************************************************************************************************************************************************/
   // Transformations

   Move(x, y) {

      if (x === 0 && y === 0) return;

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


   SetColorAlpha(alpha) {

      this.mat.SetColorAlpha(alpha, this.gfx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.mat.SetColorAlpha(alpha, bar.gfx);

      const name_text = this.text_mesh;
      name_text.mat.SetColorAlpha(alpha, name_text.gfx);

      const handle = bar.children.buffer[0];
      handle.mat.SetColorAlpha(alpha, handle.gfx);

      const value_text = bar.children.buffer[1];
      value_text.mat.SetColorAlpha(alpha, value_text.gfx);
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


   FakeRemoveFromGfxPosy(posy) {

      this.geom.defPos[1] = this.geom.pos[1]; // Copy the current position to the mesh's default pos, so it can be retrieved.
      this.geom.SetPosY(posy, this.gfx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.defPos[1] = bar.geom.pos[1];
      bar.geom.SetPosY(posy, bar.gfx);

      const name_text = this.text_mesh;
      name_text.geom.defPos[1] = name_text.geom.pos[1];
      name_text.geom.SetPosY(posy, name_text.gfx);

      const handle = bar.children.buffer[0];
      handle.geom.defPos[1] = handle.geom.pos[1];
      handle.geom.SetPosY(posy, handle.gfx);

      const value_text = bar.children.buffer[1];
      value_text.geom.defPos[1] = value_text.geom.pos[1];
      value_text.geom.SetPosY(posy, value_text.gfx);
   }


   FakeAddFromGfxPosy(posy) {

      this.geom.pos[1] = this.geom.defPos[1]; // Copy the current alpha to the mesh's default col, so it can be retrieved.
      this.geom.SetPosY(posy, this.gfx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[1] = bar.geom.defPos[1];
      bar.geom.SetPosY(posy, bar.gfx);

      const name_text = this.text_mesh;
      name_text.geom.pos[1] = name_text.geom.defPos[1];
      name_text.geom.SetPosY(posy, name_text.gfx);

      const handle = bar.children.buffer[0];
      handle.geom.pos[1] = handle.geom.defPos[1];
      handle.geom.SetPosY(posy, handle.gfx);

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[1] = value_text.geom.defPos[1];
      value_text.geom.SetPosY(posy, value_text.gfx);
   }


   FakeAddFromGfxAlpha(alpha) {

      this.mat.col[3] = this.mat.defCol[3];
      this.mat.SetColorAlpha(alpha, this.gfx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.mat.col[3] = bar.mat.defCol[3];
      bar.mat.SetColorAlpha(alpha, bar.gfx);

      const name_text = this.text_mesh;
      name_text.mat.col[3] = name_text.mat.defCol[3];
      name_text.mat.SetColorAlpha(alpha, name_text.gfx);

      const handle = bar.children.buffer[0];
      handle.mat.col[3] = handle.mat.defCol[3];
      handle.mat.SetColorAlpha(alpha, handle.gfx);

      const value_text = bar.children.buffer[1];
      value_text.mat.col[3] = value_text.mat.defCol[3];
      value_text.mat.SetColorAlpha(alpha, value_text.gfx);
   }


   FakeRemoveFromGfxAlpha(alpha) {

      this.mat.defCol[3] = this.mat.col[3];
      this.mat.SetColorAlpha(alpha, this.gfx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.mat.defCol[3] = bar.mat.col[3];
      bar.mat.SetColorAlpha(alpha, bar.gfx);

      const name_text = this.text_mesh;
      name_text.mat.defCol[3] = name_text.mat.col[3];
      name_text.mat.SetColorAlpha(alpha, name_text.gfx);

      const handle = bar.children.buffer[0];
      handle.mat.defCol[3] = handle.mat.col[3];
      handle.mat.SetColorAlpha(alpha, handle.gfx);

      const value_text = bar.children.buffer[1];
      value_text.mat.defCol[3] = value_text.mat.col[3];
      value_text.mat.SetColorAlpha(alpha, value_text.gfx);
   }



   /*******************************************************************************************************************************************************/
   // Setters-Getters

   /** Return type: Array. Returns an array with all widget's children + this */
   GetAllMeshes(parent_meshes_buf) {

      // If a parent mesh called this method, all_meshes buffer should include the parents all_meshes (put at the start of the buffer)
      const all_meshes = parent_meshes_buf ? parent_meshes_buf : [];

      all_meshes.push(this);
      all_meshes.push(this.text_mesh);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      all_meshes.push(bar);
      const handle = bar.children.buffer[0];
      all_meshes.push(handle);
      const value_text = bar.children.buffer[1];
      all_meshes.push(value_text);

      return all_meshes;
   }


   SetMenuOptionsClbk(ClbkFunction) {

      const bar = this.children.buffer[SLIDER_BAR_IDX].children.buffer[0];
      bar.menu_options.Clbk = ClbkFunction;
   }


   SetZPos(z) {
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


   SetPosXNoGfxUpdate(x) {

      this.geom.pos[0] = x;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[0] = x;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] = x;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] = x;

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[0] = x;
   }


   SetPosYNoGfxUpdate(y) {

      this.geom.pos[1] = y;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[1] = y;

      const name_text = this.text_mesh;
      name_text.geom.pos[1] = y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[1] = y;

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[1] = y;
   }


   SetPosXYNoGfxUpdate(x, y) {

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.geom.pos[0] = x;
      bar.geom.pos[1] = y;

      const name_text = this.text_mesh;
      name_text.geom.pos[0] = x;
      name_text.geom.pos[1] = y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] = x;
      handle.geom.pos[1] = y;

      const value_text = bar.children.buffer[1];
      value_text.geom.pos[0] = x;
      value_text.geom.pos[1] = y;
   }



   /*******************************************************************************************************************************************************/
   // Alignment

   Reposition_post(pos_dif) {

      this.MoveXYZ(pos_dif);
      const name_mesh = this.text_mesh;
      name_mesh.MoveXYZ(pos_dif);
      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.MoveXYZ(pos_dif);
      const handle = bar.children.buffer[0];
      handle.MoveXYZ(pos_dif);
      const value = bar.children.buffer[1];
      value.MoveXYZ(pos_dif);
   }


   Reposition_pre(pos_dif) {
      console.error('NO BATCH CREATED')

      AddArr2(this.geom.pos, pos_dif);
      this.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(this, _, { pos: pos_dif }, _);

      const name_mesh = this.text_mesh;
      AddArr2(name_mesh.geom.pos, pos_dif);
      name_mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(name_mesh, _, { pos: pos_dif }, _);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      AddArr2(bar.geom.pos, pos_dif);
      bar.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(bar, _, { pos: pos_dif }, _);

      const handle = bar.children.buffer[0];
      AddArr2(handle.geom.pos, pos_dif);
      handle.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(handle, _, { pos: pos_dif }, _);

      const value = bar.children.buffer[1];
      AddArr2(value.geom.pos, pos_dif);
      value.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(value, _, { pos: pos_dif }, _);

   }



   /*******************************************************************************************************************************************************/
   // Misc

   UpdateWidgetGroupIncrementNumFaces() {

      Widget_group_update_increment(this.group_bufferidxs, this.geom.num_faces);

      const name_mesh = this.text_mesh;
      Widget_group_update_increment(name_mesh.group_bufferidxs, name_mesh.geom.num_faces);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      Widget_group_update_increment(bar.group_bufferidxs, bar.geom.num_faces);

      const handle = bar.children.buffer[0];
      Widget_group_update_increment(handle.group_bufferidxs, handle.geom.num_faces);

      const value = bar.children.buffer[1];
      Widget_group_update_increment(value.group_bufferidxs, value.geom.num_faces);
   }


   UpdateWidgetGroupDecrementNumFaces() {

      Widget_group_update_decrement(this.group_bufferidxs, this.geom.num_faces);

      const name_mesh = this.text_mesh;
      Widget_group_update_decrement(name_mesh.group_bufferidxs, name_mesh.geom.num_faces);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      Widget_group_update_decrement(bar.group_bufferidxs, bar.geom.num_faces);

      const handle = bar.children.buffer[0];
      Widget_group_update_decrement(handle.group_bufferidxs, handle.geom.num_faces);

      const value = bar.children.buffer[1];
      Widget_group_update_decrement(value.group_bufferidxs, value.geom.num_faces);
   }



   /*******************************************************************************************************************************************************/
   // Private Methods 

   #CalculateBarArea(_pos, _dim, pad) {

      const dim = [RoundFloat1Decimal(_dim[0] - (pad[0] * 2)), RoundFloat1Decimal(_dim[1] - (pad[1] * 2))];
      // const pos = [_pos[0] + pad[0], _pos[1] + pad[1]];
      const pos = [_pos[0], _pos[1], _pos[2] + 1]; // Does not need to change for center positioning.

      return {
         pos: pos,
         dim, dim,
      };
   }



   #CalculateHandleArea(_pos, _dim, pad) {

      const dim = [0, _dim[1] - (pad[1] * 2)];
      dim[0] = dim[1];
      const pos = [_pos[0], _pos[1], _pos[2] + 1]; // Does not need to change for center positioning.

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
            /*FOR DEBUG*/clicked_mesh.SetColor(REDL[7])

            // Disconnect
            sliderBar.eventCallbacks.RemoveByIdx(i);
            return;
         }
      }

   }

   console.log('Connecting target:', target.GetName(), ' clicked:', STATE.mesh.clickedId);
   /*FOR DEBUG*/clicked_mesh.SetColor(GREEN)

   const params = {
      target: target,
      Clbk: Binding_function,
   }
   sliderBar.eventCallbacks.Add(params);

}



export function Slider_bind_on_value_change(sliderBar, target, Clbk) {

   const params = {
      target: target,
      Clbk: Binding_function,
   }
   sliderBar.eventCallbacks.Add(params);

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
      bar.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.UPDATE);

      return;
   }

   Slider_move_handle(bar, handle);

   const val = Slider_calculate_value(bar, handle); // Calculate slider's value based on the handles position.

   slider_val.UpdateText(val); // Change the text mesh to the current slider's value

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

   /** Move the handle acoring to the mouse position */
   const barLeft = bar.geom.pos[0] - bar.geom.dim[0];
   const barRight = bar.geom.pos[0] + bar.geom.dim[0];
   const x = MouseGetPos()[0];

   if (x > barLeft && x < barRight)
      handle.geom.SetPosX(x, handle.gfx)

   else if (x > barRight)
      handle.geom.SetPosX(barRight, handle.gfx)

   else if (x < barLeft)
      handle.geom.SetPosX(barLeft, handle.gfx)

   handle.SetUpdateFrameBuffer(); // IMIDIATELY: It is very complicated that we do not have a pipeline for the "mesh update gfx buffers". We need something more concrete  as to where the updates are passing through

   return true;
}



function Slider_calculate_value(bar, handle) {

   const handlexpos = handle.geom.pos[0];
   const barwidth = bar.geom.dim[0] * 2;
   const barleft = bar.geom.pos[0] - bar.geom.dim[0];

   const val = handlexpos - barleft;

   const max = 100; // Set the max value the slider will interpolate to.
   // Interpolate to a 0-max value.
   const sliderVal = (val * max) / (barwidth);

   return sliderVal;
}


