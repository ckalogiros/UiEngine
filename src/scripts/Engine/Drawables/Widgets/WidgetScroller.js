"use strict";

import { Section } from "../Meshes/Section.js";
import { MouseGetPos, MouseGetPosDif, MouseGetPosDifY } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Vertex_buffer_group_get_byidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Widget_root_add_mesh, Widget_root_gfx_add_unif_wpos_per_vb, Widget_root_set_in_focus } from "../../Core/MeshBuffer.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { Clipy_from_group } from "../Operations/Clip.js";
import { BLUEL, GREY } from "../Material/Base/Colors.js";
import { View_rerender_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/MeshBufferViews.js";
import { Listener_remove_event_by_idx } from "../../Events/EventListeners.js";
import { Gl_set_dim_XY, Gl_set_dim_Y, Gl_set_wpos_X, Gl_set_wpos_XY, Gl_set_wpos_Y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";
import { Abs, Floor, Max, Min } from "../../../Helpers/Math/MathOperations.js";
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";


























export class Widget_Scroller extends Section {

   scrolled_section;
   scroll_bar;
   renderables; // Store the first/upper and last/lower meshes that is rendered by the gfx buffers
   is_scrolled_section_private; // A way to set a scroller to use separate vertex buffer for the scrolled mesh and all its items  

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, scrolled_mesh, dim = [100, 50], col = TRANSPARENCY(GREY[5], .5), scroller_margin = [6, 6], is_debug_mesh = 0x0) {

      const pos = [0, 0, 0];


      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, SECTION.HORIZONTAL, scroller_margin, pos, dim, col, is_debug_mesh);

      this.is_scrolled_section_private = false;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle([0, 3, 1]);

      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


      this.type |= MESH_TYPE.WIDGET_SCROLLER;
      this.type &= ~MESH_TYPE.SECTION_MESH_ONLY;


      
      
      // Calculate the bar's and handle's horizontal pading.
      const pad = [1.4, 1.4];
      const marg = this.StylesGetMargin();


      // If there is a group (section) passed by the user, use that section as scrolled section.
      if (scrolled_mesh) {

         this.scrolled_section = scrolled_mesh;
         this.scrolled_section.SetName(`[${this.mesh_bufferidx}]-Scrolled section`)

         // Calculate the scroller's position based on scrooled mesh position
         // this.scrolled_section.geom.pos[0] = this.geom.pos[0] ;
         // this.scrolled_section.geom.pos[1] = this.geom.pos[1] ;
         
         // this.scrolled_section.SetPosXYNoGfxUpdate(marg[0]/2, marg[1]/2);

      }
      else { // else create a new scrolled section.
         // We need to calculate the sizes correctly.
         // E.x. we need to create a new scrolled_section section, add the items, calculate with .Calc() and get the size to use for aligning the scroller and the scroll bar...
         console.error('IMPLEMENT Scroller create new scrolled section.')
         return;
      }

      // Here we set new vb for scrolled section and its items, in order to have its own wpos uniform for fast scrolling.
      this.scrolled_section.type |= MESH_TYPE.SCROLLED_SECTION;

      this.renderables = {
         first: 0,
         last: this.scrolled_section.children.boundary,
      }

      if (this.scrolled_section.listeners === null) {
         this.scrolled_section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
      }

      

      
      

      /********************************************************************************************************************************************/
      // Scroll Bar

      const bar_dim = [10, dim[1]-marg[1]];
      const bar_pos = [this.geom.dim[0] * 2 - marg[0]*2 - pad*2, pad[1] * 2, pos[2]];

      const bar = Create_rect_mesh(bar_pos, bar_dim, GREY[1], is_debug_mesh);
      bar.sid.gfx_group = this.sid.gfx_group;
      bar.type |= MESH_TYPE.WIDGET_SCROLLER_BAR;
      bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      bar.SetStyle([1.5, 3, 1]);
      bar.StylesSetPad(pad);
      bar.SetName(`[${this.mesh_bufferidx}]-Scroll bar`);

      // bar.geom.pos[0] = this.geom.dim[0] * 2 - bar.geom.dim[0] - marg[0]*2 - bar.StylesGetPad(STYLES.AXIS.X)*2;
      bar.geom.pos[0] = this.geom.dim[0] * 2 - bar.geom.dim[0] - marg[0]*2 - pad[0]*2;
      bar.geom.pos[1] = marg[1];


      /********************************************************************************************************************************************/
      // Scroll Handle

      const handleMetrics = this.#CalculateHandleArea(bar.geom.pos, bar.geom.dim, pad)
      const handle = Create_rect_mesh([0,0,0], handleMetrics.dim, BLUEL[4], is_debug_mesh);
      handle.sid.gfx_group = this.sid.gfx_group;
      handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      handle.SetStyle([0, 3, 1.6]);
      handle.SetName('Scroll handle');
      handle.StylesSetMargin(pad);
      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      handle.StylesSetPad([3, 3]);

      handle.geom.pos[0] = bar.geom.pos[0];
      handle.geom.pos[1] = bar.geom.pos[1];

      // Make the vertical area of the bar larger for hover and handle grabing.
      bar.hover_margin = [0, handle.geom.dim[1] + 4];
      bar.StylesSetHoverMargin([0, handle.geom.dim[1] + 4]);



      /********************************************************************************************************************************************/
      // Align


      bar.AddChild(handle);
      this.scroll_bar = bar;

      // Add the scrolled mesh
      this.AddItem(this.scrolled_section);
      this.AddItem(bar);

      this.SetName(`[${this.mesh_bufferidx}]-Scroller`); // Keep rename scroller last to avoid a bug. Bacause the scroller has not yet been stored to the MeshBuffer, it cannot be renamed before any of its children have been set or renamed.  

      this.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      bar.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   }


   AddScrolledSection(scrolled_section) {

      /**DEBUG*/if (ERROR_NULL(scrolled_section)) { console.error('AddItemToScrolledSection(), the mesh to be added is null or undefined'); return; }

      SCROLL_MESH_IDX = this.AddItem(scrolled_section);

      this.geom.pos[1] = (this.scrolled_section.geom.pos[1] - this.scrolled_section.geom.dim[1]) + this.geom.dim[1] + this.StylesGetMargin(STYLES.AXIS.Y);

      return SCROLL_MESH_IDX;
   }


   AddItemToScrolledSection(mesh) {

      /**DEBUG*/if (ERROR_NULL(mesh)) { console.error('AddItemToScrolledSection(), the mesh to be added is null or undefined'); return; }

      SCROLL_MESH_IDX = this.scrolled_section.AddItem(mesh);

      const size = this.scrolled_section.Recalc();
      if (size[0] > this.geom.dim[0]) {
         this.#RecalculateWidth(size[0]);
      }
      this.#Reposition();

      // Set scroller's y pos
      this.geom.pos[1] = (this.scrolled_section.geom.pos[1] - this.scrolled_section.geom.dim[1]) + this.geom.dim[1] + this.StylesGetMargin(STYLES.AXIS.Y);

      // Set the bar and handle y pos
      this.scroll_bar.SetPosY(this.geom.pos[1]);
      const handle = this.scroll_bar.children.buffer[0];
      handle.SetPosY(this.geom.pos[1]);

      return SCROLL_MESH_IDX;
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      this.scroll_bar.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.scroll_bar.root_bufferidx, this.scroll_bar.mesh_bufferidx);

      const handle = this.scroll_bar.children.buffer[0];
      handle.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(handle.root_bufferidx, handle.mesh_bufferidx);

      this.scrolled_section.AddToWidgetRootBuffer(root_bufferidx);

   }


   Destroy() {

      const bar = this.scroll_bar;
      const handle = bar.children.buffer[0];

      this.scrolled_section.Destroy();
      handle.Destroy();
      bar.Destroy();

      this.scrolled_section = null;
      this.scroll_bar = null;

      // Scrollers's rect_mesh destruction
      return super.Destroy();
   }



   /*******************************************************************************************************************************************************/
   // Graphics

   // For scrollers we always create a separate vertex buffer, so it will be easier to handle the clipping of the scrolled section
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidxs = [INT_NULL, INT_NULL]) {


      this.gfx = Gfx_generate_context(FLAGS, this, gfxidxs);


      const rect_igfx = [this.gfx.prog.idx, this.gfx.vb.idx]; // Copy the gfx from the scroller area.

      // Use the same gfx buffer for bar mesh
      this.scroll_bar.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, this.scroll_bar, rect_igfx);

      // Use the same gfx buffer for handle mesh
      const handle = this.scroll_bar.children.buffer[0];
      handle.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, handle, rect_igfx);

      this.is_scrolled_section_private = true

      // Render the scrolled section and all it's meshes to it's own separate gfx buffer
      if (this.is_scrolled_section_private) {
         this.scrolled_section.gfx = Gfx_generate_context(GFX_CTX_FLAGS.NEW, this.scrolled_section, [INT_NULL, INT_NULL]);
      }
      else {
         this.scrolled_section.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, this.scrolled_section, rect_igfx);
      }

      const scrolled_section_igfx = [this.scrolled_section.gfx.prog.idx, this.scrolled_section.gfx.vb.idx];
      for (let i = 0; i <= this.scrolled_section.children.boundary; i++) {
         const child = this.scrolled_section.children.buffer[i];
         if (child) {
            child.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, scrolled_section_igfx);
         }
      }



      return this.gfx;

   }


   Render() {

      if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');
      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfx(); }

      if (!this.scroll_bar.is_gfx_inserted && (this.scroll_bar.state.mask & MESH_STATE.ACTIVE)) { this.scroll_bar.AddToGfx(); }

      const handle = this.scroll_bar.children.buffer[0];
      if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfx(); }

      if (!this.scrolled_section.is_gfx_inserted && (this.scrolled_section.state.mask & MESH_STATE.ACTIVE)) { this.scrolled_section.Render(); }

   }


   Rerender() {

      View_reset_from_view_all_buffers(this.scrolled_section.group_bufferidxs[0]);
      // Mesh_per_vb_remove_all_from_index(this.gfx.vb.idx, this.per_vb_bufferidx);

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfxFromReset(); }

      if (!this.scroll_bar.is_gfx_inserted && (this.scroll_bar.state.mask & MESH_STATE.ACTIVE)) { this.scroll_bar.AddToGfxFromReset(); }

      const handle = this.scroll_bar.children.buffer[0];
      if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfxFromReset(); }

      if (!this.scrolled_section.is_gfx_inserted && (this.scrolled_section.state.mask & MESH_STATE.ACTIVE)) { this.scrolled_section.Render(); }

      for (let i = 0; i <= this.scrolled_section.children.boundary; i++) {

         const child = this.scrolled_section.children.buffer[i];
         if (child.state.mask & MESH_STATE.ACTIVE) {

            child.Rerender()
            // console.log(child.GetName())
         }

      }
   }


   SetScissorBox() {

      // Enable scissoring
      const vb = Vertex_buffer_group_get_byidx(this.gfx.vb.idx);
      /**DEBUG */ if (!vb) alert('SetScissorBox() in Scroller cannot resolve vertex buffer');
      const scissorbox = [
         this.geom.pos[0] - this.geom.dim[0],
         this.geom.pos[1] + this.geom.dim[1],
         this.geom.dim[0] * 2,
         this.geom.dim[1] * 2,
      ];
      vb.EnableScissorBox();
      vb.SetScissorBox(scissorbox);

      const textgfx = Find_textgfx_from_parent_descending(this);
      if (textgfx) {
         const vb_text = Vertex_buffer_group_get_byidx(textgfx.vb.idx);
         /**DEBUG */ if (!vb_text) alert('SetScissorBox() in Scroller cannot resolve vertex buffer for text');
         vb_text.EnableScissorBox();
         vb_text.SetScissorBox(scissorbox);
      }
      else console.log('{}{}{}{}}}{}{}} TEXT BUFFER NNOT FOUND')
   }


   SetScrolledSectionToSeparateGfxBuffers() {
      if (this.scrolled_section.is_gfx_inserted) alert('Trying to set scrolled section to private buffers though the scrolled section is already added to the gfx buffers');
      this.is_scrolled_section_private = true;
   }



   /*******************************************************************************************************************************************************/
   // State
   /*******************************************************************************************************************************************************/

   StateEnable(bit) {

      this.state.mask |= bit;

      this.scroll_bar.state.mask |= bit;

      const handle = this.scroll_bar.children.buffer[0];
      handle.state.mask |= bit;

      this.scrolled_section.state.mask |= bit;

   }


   SetTypeDebug() {

      this.type |= MESH_TYPE.DEBUG_MESH;

      this.scroll_bar.type |= MESH_TYPE.DEBUG_MESH;

      const handle = this.scroll_bar.children.buffer[0];
      handle.type |= MESH_TYPE.DEBUG_MESH;

      this.scrolled_section.type |= MESH_TYPE.DEBUG_MESH;
   }



   /*******************************************************************************************************************************************************/
   // Events
   /*******************************************************************************************************************************************************/

   OnClick(params) {


      const mesh = params.evt_params.target_mesh;
      const point = MouseGetPos();


      /**
       * All scollers are resizable.
       * So we check directly if the pointer is clicked inside the 'resize' area,
       * and if not, we procceed with bar move or scroller move
       */

      // Check for Resize
      const right = mesh.GetPosX() + mesh.geom.dim[0] * 2;
      const bottom = mesh.GetPosY() + mesh.geom.dim[1] * 2;

      if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) {

         // We have Resize

         if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize

            const OnResizeFn = mesh.OnResize;
            const idx = TimeIntervalsCreate(10, 'ResizeXY Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, mesh);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
         }
         else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
            // console.log('X RESIZE');
         }
         else { // Its a height resize
            // console.log('Y RESIZE');
         }

         mesh.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS;
         STATE.mesh.SetGrabed(mesh);
         STATE.mesh.SetFocused(mesh);
         Widget_root_set_in_focus(mesh.root_bufferidx);

         return true;
      }
      else { // Move the scroller handle

         // Check if the click happened on bar
         const bar = mesh.scroll_bar;
         const bar_pos = bar.GetPosXY();
         if (point[0] > bar_pos[0] + bar.StylesGetHoverMargin(STYLES.AXIS.X)) { // Check only if click is on the right of the left side of the bar mesh

            if(point[1] < bar_pos[1] || point[1] > bar_pos[1] + bar.geom.dim[1]*2) return

            STATE.mesh.SetClicked(bar);

            if ((bar.type & MESH_TYPE.WIDGET_SCROLLER_BAR) && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

               const idx = TimeIntervalsCreate(16, 'Move Scroller Handle', TIME_INTERVAL_REPEAT_ALWAYS, Scroller_on_update_handle, bar);
               bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

               STATE.mesh.SetGrabed(bar);
               STATE.mesh.SetFocused(mesh);
               mesh.state.mask |= MESH_STATE.IN_FOCUS;
               bar.StateEnable(MESH_STATE.IN_GRAB);
               Widget_root_set_in_focus(mesh.root_bufferidx);
            }

            return true;
         }
         else { // Move the scroller widget

            STATE.mesh.SetClicked(bar);

            // Move Scroller
            if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) && mesh.StateCheck(MESH_STATE.IS_GRABABLE) && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

               const idx = TimeIntervalsCreate(10, 'Move Scroller', TIME_INTERVAL_REPEAT_ALWAYS, Scroller_on_move_clbk, mesh);
               mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

               STATE.mesh.SetGrabed(mesh);
               STATE.mesh.SetFocused(mesh);
               mesh.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
               Widget_root_set_in_focus(mesh.root_bufferidx);
            }

            return true;
         }
      }


   }


   OnResize(params) {

      const scroller = params.params;

      if (scroller.StateCheck(MESH_STATE.IN_GRAB) === 0 && scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         scroller.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

         return;
      }

      // console.log('RESIZING ', scroller.GetName());
      const mouse_pos = MouseGetPosDif();
      const bar = scroller.scroll_bar;



      // TODO: We can set all positions and simentions and call 'Gl_set_pos_dim' for all meshes of the scroller
      if (mouse_pos.x !== 0 || mouse_pos.y !== 0) {

         const x = mouse_pos.x / 2;
         const y = -mouse_pos.y / 2;


         // Check for min dimentions. // TODO: Who decides for the minimum dimentions??????
         const marg = scroller.StylesGetMargin();
         const min_width = scroller.scrolled_section.geom.dim[0] + marg[0]*2;
         const min_height = 80;
         

         // Resize X
         if (x > POSSITIVE || (x < NEGATIVE && scroller.geom.dim[0] + x > min_width)) {

            scroller.geom.dim[0] += x;

            // Bar
            // bar.geom.pos[0] = scroller.geom.dim[0] * 2 - bar.geom.dim[0] - scroller.StylesGetMargin(STYLES.AXIS.X) - bar.StylesGetPad(STYLES.AXIS.X);
            bar.geom.pos[0] = scroller.geom.dim[0] * 2 - bar.geom.dim[0] - marg[0]*2 - bar.StylesGetPad(STYLES.AXIS.X)*2;
            Gl_set_wpos_X(bar.gfx, bar.geom.pos[0] + bar.geom.dim[0], bar.geom.num_faces)

            // Handle
            const handle = bar.children.buffer[0];
            handle.geom.pos[0] = bar.geom.pos[0] + bar.StylesGetPad(STYLES.AXIS.X) * 2;
            Gl_set_wpos_X(handle.gfx, handle.geom.pos[0] + handle.geom.dim[0], handle.geom.num_faces)
         }

         // Resize Y
         if (y > POSSITIVE || (y < NEGATIVE && scroller.geom.dim[1] + y > min_height)) {

            scroller.geom.dim[1] += y;

            // Bar
            bar.geom.dim[1] = scroller.geom.dim[1] - marg[1];
            Gl_set_dim_Y(bar.gfx, bar.geom.dim[1], bar.geom.num_faces)
            Gl_set_wpos_Y(bar.gfx, bar.geom.pos[1] + bar.geom.dim[1], bar.geom.num_faces)


            // Handle
            const handle = bar.children.buffer[0];
            // Calculate handle dimention to the ratio of the scroller/scrolled_section
            const ratio = scroller.geom.dim[1] / scroller.scrolled_section.geom.dim[1];
            const h = (ratio * scroller.geom.dim[1] >= scroller.geom.dim[1]) ? bar.geom.dim[1] - handle.StylesGetMargin(STYLES.AXIS.Y) : ratio * scroller.geom.dim[1];

            handle.SetDim([UNCHANGED, h]);


            Gl_set_wpos_Y(handle.gfx, handle.geom.pos[1] + handle.geom.dim[1], handle.geom.num_faces)

         }


         Gl_set_dim_XY(scroller.gfx, scroller.geom.dim, scroller.geom.num_faces)
         Gl_set_wpos_XY(scroller.gfx, scroller.geom.pos[0] + scroller.geom.dim[0], scroller.geom.pos[1] + scroller.geom.dim[1], scroller.geom.num_faces);

         View_reset_from_view_all_buffers(scroller.scrolled_section.group_bufferidxs[0]);
         // Mesh_per_vb_remove_all_from_index(scroller.scrolled_section.gfx.vb.idx, scroller.scrolled_section.per_vb_bufferidx);

         
         if(scroller.scrolled_section.group_bufferidxs[0] !==INT_NULL){

            const clip_top = scroller.GetPosY();
            const clip_bottom = clip_top + scroller.geom.dim[1]*2;
            const clip_left = scroller.geom.pos[0] - scroller.geom.dim[0];
            const clip_right = scroller.geom.pos[0] + scroller.geom.dim[0] - (scroller.StylesGetMargin(STYLES.AXIS.X) + bar.geom.dim[0] * 2);

            Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
            // Clampx_from_group(scroller.scrolled_section.group_bufferidxs[0], 0, clip_right);
         }

         View_rerender_from_view_all_buffers(scroller.scrolled_section.group_bufferidxs[0], false);


      }

   }


   Move(x, y) {
      if (x === 0 && y === 0) return;

      // HERE: We need a way to get the unif idx by name: 'u_wposxy' 
      Mesh_unif_add_vb_root_wpos(this.root_posidx, [x, y]);

      // Add the move difference to all vb's root positions.
      // Widget_root_gfx_add_unif_wpos_per_vb(this.root_bufferidx, [x, y]);

   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;

      this.scroll_bar.geom.pos[0] += x;
      this.scroll_bar.geom.pos[1] += y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += x;
      handle.geom.pos[1] += y;

      if (this.scrolled_section) {
         this.scrolled_section.MoveNoGfxUpdate(x, y); // Let the scrolled mesh handle the Move().
      }

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;

      this.scroll_bar.geom.pos[1] += y;

      const handle = this.scroll_bar.children.buffer[0];
      handle.geom.pos[1] += y;

      if (this.scrolled_section) {
         this.scrolled_section.MoveYNoGfxUpdate(y); // Let the scrolled mesh handle the Move().
      }

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;

      this.scroll_bar.geom.pos[0] += x;

      handle.geom.pos[0] += x;

      if (this.scrolled_section) {
         this.scrolled_section.MoveXNoGfxUpdate(x); // Let the scrolled mesh handle the Move().
      }

   }
   
	
   SetPosXYNoGfxUpdate(x, y) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
		else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update them as offsets 
			
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
         this.scroll_bar.geom.pos[0] = x;
         this.scroll_bar.geom.pos[1] = y;
         const handle = this.scroll_bar.children.buffer[0];
         handle.geom.pos[0] = x;
         handle.geom.pos[1] = y;
         this.scrolled_section.SetPosXYNoGfxUpdate(x,y);

		}
   }

   
   SetPosXNoGfxUpdate(x) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
		else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update them as offsets 
			
         this.geom.pos[0] = x;
         this.scroll_bar.geom.pos[0] = x;
         const handle = this.scroll_bar.children.buffer[0];
         handle.geom.pos[0] = x;
         this.scrolled_section.SetPosXNoGfxUpdate(x);

		}
   }
   
   
   SetPosYNoGfxUpdate(y) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
		else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update them as offsets 
			
         this.geom.pos[1] = y;
         this.scroll_bar.geom.pos[1] = y;
         const handle = this.scroll_bar.children.buffer[0];
         handle.geom.pos[1] = y;
         this.scrolled_section.SetPosYNoGfxUpdate(y);

		}
   }


   TEMP_recalc(x, y) {

      console.error('IMPLEMENT\nTEMP_recalc()\nWidget Scroller')

      // const dx = this.text_mesh.geom.pos[0]-this.geom.pos[0];
      // const dy = this.text_mesh.geom.pos[1]-this.geom.pos[1];
      // this.geom.pos[0] = x;
      // this.geom.pos[1] = y;
      // this.text_mesh.geom.pos[0] = x+dx;
      // this.text_mesh.geom.pos[1] = y+dy;
   }


   SetColorAlpha(alpha) {

      console.error('implement me\nSEE console error')
      alert('implement me\nSEE console error')

   }


   // SEE ### Construct Listeners
   ConstructListeners(parent_listeners = null) {

      const scroller = this;
      const bar = this.scroll_bar;
      const handle = bar.children.buffer[0];
      const scrolled_section = this.scrolled_section;

      for (let i = 0; i <= scroller.listeners.boundary; i++) {

         if (scroller.listeners.buffer[i] !== null && scroller.listeners.buffer[i] !== INT_NULL) {

            if (scroller.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {

               scroller.AddListenEvent(i, null, null, scroller.listeners.buffer[i]);
               bar.AddListenEvent(i, scroller.OnClick, params, scroller.listeners.buffer[i]);
               handle.AddListenEvent(i, null, null, bar.listeners.buffer[i])
            }
            else { // Else construct with Clbk and params

               const params = {
                  EventClbk: null, targetBindingFunctions: null,
                  target_mesh: scroller, params: null,
               }

               // CAUTION: We run for i:Hover and click, but the callback is always 'this.OnClick'. For Hover callback, check the event type and pass the apropriate callback.
               scroller.AddListenEvent(i, scroller.OnClick, params, scroller.listeners.buffer[i]);
            }

            const params = {
               EventClbk: null, targetBindingFunctions: null,
               target_mesh: scroller, params: null,
            }
            bar.AddListenEvent(i, scroller.OnClick, params, scroller.listeners.buffer[i]);
            handle.AddListenEvent(i, null, null, bar.listeners.buffer[i])
         }
         else { // Handle any FAKE listen event creation for scroller


            if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
               parent_listeners = [null, null];
            }

            if (parent_listeners[i] === null || parent_listeners[i] === INT_NULL) {
               parent_listeners[i] = Find_parent_listen_event(i, scroller);
            }

            if (scroller.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {

               scroller.AddListenEvent(i, null, null, parent_listeners[i]);
               // bar.AddListenEvent(i, null, null, scroller.listeners.buffer[i]);
               handle.AddListenEvent(i, null, null, bar.listeners.buffer[i])
            }
            else { // Else construct with Clbk and params

               const params = {
                  EventClbk: null, targetBindingFunctions: null,
                  target_mesh: scroller, params: null,
               }

               // CAUTION: We run for i:Hover and click, but the callback is always 'this.OnClick'. For Hover callback, check the event type and pass the apropriate callback.
               scroller.AddListenEvent(i, scroller.OnClick, params, parent_listeners[i]);
               bar.AddListenEvent(i, scroller.OnClick, params, scroller.listeners.buffer[i]);
               // handle.AddListenEvent(i, null, null, bar.listeners.buffer[i])
            }

            const params = {
               EventClbk: null, targetBindingFunctions: null,
               target_mesh: scroller, params: null,
            }

            // bar.AddListenEvent(i, scroller.OnClick, params, scroller.listeners.buffer[i]);
            // handle.AddListenEvent(i, null, null, bar.listeners.buffer[i])

         }

      }

      const parent_events = [scroller.listeners.buffer[0], scroller.listeners.buffer[1]];
      // HACK: We create all event listeners for scrolled section, so that on scrolling, any children events will be removed from the scroole section parent event 
      scrolled_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER, FAKE_LISTEN_EVENT);
      scrolled_section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
      scrolled_section.ConstructListeners(parent_events);

   }



   /*******************************************************************************************************************************************************/
   // Alignment
   /*******************************************************************************************************************************************************/




   ScrollerAlign() {

      this.scrolled_section.options |= SECTION.RESIZE_PARENT; // For the scrolled section to encapsulate all items.
      this.options |= SECTION.RESIZE_PARENTX;
      this.scrolled_section.Calc_no_gfx_update();
      // this.Calc_no_gfx_update();

      // Calculate handle dimention to the ratio of the scroller/scrolled_section
      const bar = this.scroll_bar;
      const handle = bar.children.buffer[0];
      const ratio = this.geom.dim[1] / this.scrolled_section.geom.dim[1];
      const h = (ratio * this.geom.dim[1] >= this.geom.dim[1]) ? bar.geom.dim[1] - handle.StylesGetMargin(STYLES.AXIS.Y) : ratio * this.geom.dim[1];
      handle.geom.dim[1] = h;
      const handle_pad = handle.StylesGetPad();
      handle.geom.pos[0] += handle_pad[0];
      handle.geom.pos[1] += handle_pad[1];

   }








   /*******************************************************************************************************************************************************/
   // Private Methods 
   /*******************************************************************************************************************************************************/


   #CalculateHandleArea(_pos, _dim, pad) {

      const dim = [_dim[0] - (pad[0] * 2), 0];
      // const pos = [_pos[0] + pad[0] * 2, _pos[1] + pad[1] * 2, _pos[2] + 1]; // Pos does not need to change for positioning in the center.
      const pos = [_pos[0] , _pos[1] + pad[1] * 2, _pos[2] + 1]; // Pos does not need to change for positioning in the center.

      return {
         pos: pos,
         dim, dim,
      };
   }


   #RecalculateWidth(scrolled_section_width) {

      const new_width = scrolled_section_width + this.scroll_bar.geom.dim[0] + this.StylesGetMargin(STYLES.AXIS.X) * 2;
      this.SetDim([new_width, UNCHANGED]);
   }


   // Reposition scroller arround the scrolled_section
   #Reposition() {

      const x = this.scrolled_section.geom.pos[0] + this.scrolled_section.geom.dim[0] + (this.scroll_bar.geom.dim[0])
      this.scroll_bar.SetPosX(x);
      const handle = this.scroll_bar.children.buffer[0];
      handle.SetPosX(x);

   }

}














function Scroller_on_move_clbk(params) {// Called by timeInterval as a callback function

   const scroller = params.params;

   // Destroy the time interval and the Move operation, if the scroller is not grabed
   // MESH_STATE.IN_GRAB is deactivated upon mouse click up in Events.js.
   if (scroller.StateCheck(MESH_STATE.IN_GRAB) === 0 && scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      scroller.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_pos = MouseGetPosDif();
   scroller.Move(mouse_pos.x, -mouse_pos.y);

}



export function Scroller_on_update_handle(_params) {

   const bar = _params.params;
   const handle = bar.children.buffer[0];

   if (bar.StateCheck(MESH_STATE.IN_GRAB) === 0 && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

      // If bar out of hover, delete the timeInterval for moving the handle
      const intervalIdx = bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      bar.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);

      handle.state.mask &= ~MESH_STATE.IN_GRAB;

      return;
   }

   const scroller = bar.parent;

   // Case the handle is grabbed but not moved, then we do not have anything to calculate, just move the scroller and return
   Scroller_move_handle(bar, handle);

   const val = Scroller_calculate_value(bar, handle); // Calculate slider's value based on the handles position.

   const scrolled_section = scroller.scrolled_section;
   const scroller_top = scroller.GetPosY();
   const scrolled_posy = scrolled_section.GetPosY() + scrolled_section.geom.dim[1];

   // Calculate height of handle
   const ratio = scroller.geom.dim[1] / scrolled_section.geom.dim[1];

   const move_ratio = ((scrolled_section.geom.dim[1] * 2) - ((scroller.geom.dim[1] * 2)));

   // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
   const posy = (move_ratio * -val) + scroller_top + scrolled_section.geom.dim[1];
   const ydif = posy - scrolled_posy;


   // Add the move difference to all vb's root positions.
   // Widget_root_gfx_add_unif_wpos_per_vb(scroller.root_bufferidx, [0, ydif]);

   const clip_top = scroller_top, clip_bottom = (scroller_top) + scroller.geom.dim[1] * 2;

   const changes_hapened = Clipy_from_group(scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);

   /**
    * HERE: // IMIDIATELY
    *   CAN WE SKIP RE-RENDER, BASED ON THE FACT THAT WE HAVE OFFSET POSITIONS FOR THE SCROOLED MOVE????
    */
   if (changes_hapened) {

      View_reset_from_view_all_buffers(scrolled_section.group_bufferidxs[0]);


      // Remove all listen events. To rebuild from scratch all items listen events after the clip
      for (let i = 0; i <= scrolled_section.listeners.boundary; i++) {

         if (scrolled_section.listeners.buffer[i] !== null && scrolled_section.listeners.buffer[i] !== INT_NULL) {

             (i, scrolled_section.listeners.buffer[i])
            scrolled_section.listeners.buffer[i] = INT_NULL;
         }
      }



      View_rerender_from_view_all_buffers(scrolled_section.group_bufferidxs[0], true);
   }

   /**FOR FRAMEBUFFER. DO NOT DELETE */
   // if(scrolled_section.isFramebufferRendered !== INT_NULL){
   //    // const r = scroller.geom.dim[1] / scrolled_section.geom.dim[1]
   //    const r = (scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1] / scroller.scroll_bar.geom.dim[1]) /1000
   //    // const r = scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1]/(scrolled_section.geom.dim[1] * scroller.scroll_bar.geom.dim[1]) 
   //    // const r = (scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1]/(scrolled_section.geom.dim[1]) )/100
   //    Framebuffer_moveY(scrolled_section.isFramebufferRendered, ydif, r)
   // }


}







/*******************************************************************************************************************************************************/
// Scroller Functionality 

function Scroller_move_handle(bar, handle) {

   const mouse_posy = MouseGetPos()[1];
   const ydif = Floor(MouseGetPosDifY());

   const marg = bar.parent.StylesGetMargin(STYLES.AXIS.Y);
   const handle_pad = handle.StylesGetPad(STYLES.AXIS.Y);
   
   const bar_abs_pos = bar.GetPosY();
   const y = mouse_posy - bar_abs_pos;
   const bar_height = bar.geom.dim[1]*2;

   
   /**
    * Case mouse click is inside the bar area but outside the handle area, make handle juump to mouse position.
    * 
    * :(handle.state.mask & MESH_STATE.IN_GRAB)===0
    * This makes suure the handle is not already in scrolling
    * 
    * : mouse pos is in between handle top AND scroller top (y>0)
    * (y < handle.geom.pos[1] && y > 0)
    * 
    * : mouse pos is in between handle bottom AND bar bottom
    * (y > handle.geom.pos[1]+handle.geom.dim[1]*2 && y < bar_height)
    * 
    * // BUG: there is a pad missing from the handle pos, and as a concequence the click below (visualy) the handle does not 'count'
   */
  if((handle.state.mask & MESH_STATE.IN_GRAB)===0 && ((y < handle.geom.pos[1] && y > 0) || (y > handle.geom.pos[1]+handle.geom.dim[1]*2 && y < bar_height))){
     handle.geom.pos[1] = y 
     handle.geom.SetPosY(handle.geom.pos[1], handle.gfx);
   }


   const handle_top = handle.geom.pos[1] - (handle_pad + marg);
   const handle_bottom = handle.geom.pos[1] + handle.geom.dim[1]*2  - handle_pad;

   if (handle_bottom - ydif > bar_height) { // Set handle's position bottom limit
      
      handle.geom.pos[1] = (bar_height + marg) - (handle.geom.dim[1]*2 + handle_pad);
      handle.geom.SetPosY(handle.geom.pos[1], handle.gfx);
      return true;
   }
   else if (handle_top - ydif < 0) { // Set handle's position top limit
      
      handle.geom.pos[1] = marg+handle_pad;
      handle.geom.SetPosY(handle.geom.pos[1], handle.gfx)
      return true;
   }
   else { // Else the handle is not hitting any pos limits, so we can move it.

      // Makes sure that the handle is not moving if the mouse is outside the bars area
      // BUT also that the handle is moving despite the mouse pos being ouutside the handle's area (buut inside bar's area)
      if((y < handle_bottom-handle_pad-3 && y > handle_top+handle_pad+3) || (handle_bottom < bar_height && handle_top > 0)){
         handle.geom.pos[1] -= ydif;
         handle.geom.SetPosY(handle.geom.pos[1], handle.gfx);
         handle.state.mask |= MESH_STATE.IN_GRAB;
      }
   }
}





function Scroller_calculate_value(bar, handle) {

   const pad = handle.StylesGetMargin(STYLES.AXIS.Y);
   const marg = bar.parent.StylesGetMargin(STYLES.AXIS.Y);

   const handleypos = handle.geom.pos[1]; // Must add the pad for correct align of top-scroller with top-scrolled

   const bartop = bar.geom.pos[1]+marg/2;
   const barheight = ((bar.geom.dim[1]*2-marg-pad)-handle.geom.dim[1]*2);
   
   const val = handleypos - bartop;

   // Interpolate to a 0-1 value.
   const scrollerVal = (barheight === 0) ? val : val / (barheight);
   // console.log(scrollerVal)
   return scrollerVal;
}

