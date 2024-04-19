"use strict";

import { Section } from "../Meshes/Section.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Vertex_buffer_info_get_by_vbidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Mesh_per_vb_remove_all_from_index, Movey_from_widget_root_buffer, Widget_root_add_mesh, Widget_root_set_in_focus } from "../../Core/MeshBuffer.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { AddArr2, CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Clampx_from_group,Clipy_from_group } from "../Operations/Clip.js";
import { BLUEL, BLUE_10_120_220, GREY, PURPLER, WHITE } from "../Material/Base/Colors.js";
import { View_movey_group, View_rerender_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/MeshBufferViews.js";
import { Listener_destroy_children_buffer, Listener_remove_child_event_from_parent, Listener_remove_event_by_idx } from "../../Events/EventListeners.js";
import { Gl_set_dim_XY, Gl_set_dim_Y, Gl_set_wpos_X, Gl_set_wpos_XY, Gl_set_wpos_Y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";


/** ### Scroller Widget
 *    Scroller is used for almost in any case of the construction of 
 *    a group of meshes/widgets.
 * 
 *    It has 3 main parts:
 *       1. The outer section.
 *       2. The scrolled section.
 *       3. The scroll bar and handle.
 * 
 *    The outer section is fixed height OR should not exceed certain height (not more than the canvas height).
 *    The scroll bar has the same height as the outer section.
 *    The scrolled section holds (grouped) widgets/meshes. It can grow in height and in width.
 * 
 *    Both scrolled section and scroll bar are direct childs of scroller widget.
 * 
 *    The outer section:
 *       Must Align the Both scrolled section and scroll bar.
 *       Must grow in width according to the arbitary width of the scrooled section.
 * 
 *    Construction:
 *       Can be both on demand and automatic???
 *       If a type of 'Section' is passed to the constructor, the that section is copied to the scrooled section of the class.
 *       Else the scrolled section is initialized as a 'Section' in the constructor.
 *       After scroller widget construction, the only way to add widget/meshes/items to the group (scrolled section)
 *          is by using the apropriate class method AddTo...().
 *    
 *    Adding items to scrolled section:
 *       Check if the new item's width is larger, in that case sroller must resize and re-align Both scrolled section and scroll bar.
 *    Deleting items from scrolled section:
 *       ???
 * 
 * 
 *    GFX:
 *       All meshes (scroller widget, scrolled section, scroll bar and handle)
 *       can be stored in the same gfx buffers.
 *       If the bar and handle is not to be shown, then use the alpha color.
 *    
 */


export class Widget_Scroller extends Section {

   scrolled_section;
   scroll_bar;
   renderables; // Store the first/upper and last/lower meshes that is rendered by the gfx buffers
   is_scrolled_section_private; // A way to set a scroller to use separate vertex buffer for the scrolled mesh and all its items  

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, scrolled_mesh, dim = [100, 50], col = TRANSPARENCY(GREY[5], .5), scroller_margin=[10,10], is_debug_mesh=0x0) {

      const pos = [0, 0, 0];


      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, SECTION.HORIZONTAL, scroller_margin, pos, dim, col, is_debug_mesh);

      this.is_scrolled_section_private = false;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle([0, 6, 2]);
      this.state.mask |= MESH_STATE.IS_RESIZEABLE;

      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


      this.type |= MESH_TYPE.WIDGET_SCROLLER;
      this.type &= ~MESH_TYPE.SECTION_MESH_ONLY;

      // If there is a group (section) passed by the user, use that section as scrolled section.
      // if (scrolled_mesh && (scrolled_mesh.type & MESH_TYPE.SECTION_MESH)) {
      if (scrolled_mesh) {

         this.scrolled_section = scrolled_mesh;
         this.scrolled_section.SetName(`[${this.mesh_bufferidx}]-Scrolled section`)

         // Calculate the scroller's position based on scrooled mesh position
         // this.geom.pos[0] = (this.scrolled_section.geom.pos[0] - this.scrolled_section.geom.dim[0]) - this.StylesGetMargin(STYLES.AXIS.X); // Include the margin in the calculation
         // this.geom.pos[1] = (this.scrolled_section.geom.pos[1] - this.scrolled_section.geom.dim[1]) + this.StylesGetMargin(STYLES.AXIS.Y);
         this.geom.pos[0] = this.scrolled_section.geom.pos[0]; 
         this.geom.pos[1] = this.scrolled_section.geom.pos[1];
      }
      else { // else create a new scrolled section.
         // We need to calculate the sizes correctly.
         // E.x. we need to create a new scrolled_section section, add the items, calculate with .Calc() and get the size to use for aligning the scroller and the scroll bar...
         console.error('IMPLEMENT Scroller create new scrolled section.')
      }

      this.scrolled_section.type |= MESH_TYPE.SCROLLED_SECTION;

      this.renderables = {
         first: 0,
         last: this.scrolled_section.children.boundary,
      }

      if(this.scrolled_section.listeners === null) {
         this.scrolled_section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
      }



      // Calculate the bar's and handle's horizontal pading.
      const pad = [1.4, 1.4];


      /********************************************************************************************************************************************/
      // Scroller Bar: Bar is child of 'this'

      // Calculate bar's dimentions and position.
      const barpos = [pos[0], pos[1] + this.geom.dim[1], this.scrolled_section.geom.pos[2]+40]
      const barMetrics = this.#CalculateBarArea(barpos, [10, dim[1]], pad)


      const bar = Create_rect_mesh(barMetrics.pos, barMetrics.dim, GREY[1], is_debug_mesh);
      bar.sid.gfx_group = this.sid.gfx_group;
      bar.type |= MESH_TYPE.WIDGET_SCROLLER_BAR;
      bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      bar.SetStyle([1.5, 3, 1]);
      bar.StylesSetPad(pad);
      bar.SetName(`[${this.mesh_bufferidx}]-Scroll bar`);
      
      
      
      /********************************************************************************************************************************************/
      // Scroller Handle: Handle is a child of the bar mesh
      
      const handleMetrics = this.#CalculateHandleArea(bar.geom.pos, bar.geom.dim, pad)
      const handle = Create_rect_mesh([0,0,bar.geom.pos[2]+1], handleMetrics.dim, BLUEL[4], is_debug_mesh);
      handle.sid.gfx_group = this.sid.gfx_group;
      handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      handle.SetStyle([0, 3, 1.6]);
      handle.SetName('Scroll handle');
      handle.StylesSetMargin(pad);
      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

      // Make the vertical area of the bar larger for hover and handle grabing.
      bar.hover_margin = [0, handle.geom.dim[1] + 4];
      bar.StylesSetHoverMargin([0, handle.geom.dim[1] + 4]);



      /********************************************************************************************************************************************/
      // Align

      // Calculate the scroller's width
      // this.geom.pos[0] += this.geom.dim[0]; // Correct the scrollers pos now that we know its width.
      // this.geom.pos[1] += this.geom.dim[1]; // Correct the scrollers pos now that we know its height.

      // Calculate handle's position, from bar's position
      handle.geom.pos[0] = bar.geom.pos[0];
      handle.geom.pos[1] = bar.geom.pos[1] - bar.geom.dim[1] + handle.StylesGetMargin(STYLES.AXIS.Y);

      handle.StylesSetPad([13,3]);

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

      // const size = this.scrolled_section.Recalc();
      // if (size[0] > this.geom.dim[0]) {
      //    this.#RecalculateWidth(size[0]);
      // }
      // this.#Reposition();

      // Set scroller's y pos
      this.geom.pos[1] = (this.scrolled_section.geom.pos[1] - this.scrolled_section.geom.dim[1]) + this.geom.dim[1] + this.StylesGetMargin(STYLES.AXIS.Y);

      // Set the bar and handle y pos
      // this.scroll_bar.SetPosY(this.geom.pos[1]);
      // const handle = this.scroll_bar.children.buffer[0];
      // handle.SetPosY(this.geom.pos[1]);

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

      // Render the scrolled section and all it's meshes to it's own separate gfx buffer
      if (this.is_scrolled_section_private) {
         this.scrolled_section.gfx = Gfx_generate_context(FLAGS, this.scrolled_section, [INT_NULL, INT_NULL]);
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
      const vb = Vertex_buffer_info_get_by_vbidx(this.gfx.vb.idx);
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
         const vb_text = Vertex_buffer_info_get_by_vbidx(textgfx.vb.idx);
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
      const right = mesh.geom.pos[0] + mesh.geom.dim[0];
      const bottom = mesh.geom.pos[1] + mesh.geom.dim[1];

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

         mesh.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB|MESH_STATE.IN_FOCUS;
         STATE.mesh.SetGrabed(mesh);
         STATE.mesh.SetFocused(mesh);
         Widget_root_set_in_focus(mesh.root_bufferidx);
         // console.log(point, right, bottom, TEMP_RESIZE_MARGIN)
         
         return true;
      }
      else {

         // Check if the click happened on bar
         const bar = mesh.scroll_bar;
         // if (point[0] > bar.geom.pos[0] - bar.geom.dim[0] + bar.hover_margin[0]) { // Check only if click is on the right of the left side of the bar mesh
         if (point[0] > bar.geom.pos[0] - bar.geom.dim[0] + bar.StylesGetHoverMargin(STYLES.AXIS.X)) { // Check only if click is on the right of the left side of the bar mesh
   
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
         else {
   
            STATE.mesh.SetClicked(bar);
   
            // Move Scroller
            if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) && mesh.StateCheck(MESH_STATE.IS_GRABABLE) && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {
   
               const idx = TimeIntervalsCreate(10, 'Move Scroller', TIME_INTERVAL_REPEAT_ALWAYS, mesh.OnMove, mesh);
               mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
   
               STATE.mesh.SetGrabed(mesh);
               STATE.mesh.SetFocused(mesh);
               mesh.StateEnable(MESH_STATE.IN_GRAB|MESH_STATE.IN_FOCUS);
               Widget_root_set_in_focus(mesh.root_bufferidx);
            }
   
            return true;
         }
      }


   }


   // SEE ### OnMove Events Implementation Logic
   OnMove(params) {// Called by timeInterval as a callback function

      // const scroller = params.evt_params;
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
         // const min_width = scroller.scrolled_section.geom.dim[0];
         const min_width = scroller.geom.defDim[0];
         const min_height = scroller.geom.defDim[1];

         if (x > POSSITIVE || (x < NEGATIVE && scroller.geom.dim[0] + x > min_width)) {
            
            scroller.geom.dim[0] += x;
            scroller.geom.pos[0] += x;

            // Move bar

            bar.geom.pos[0] += x*2;
            Gl_set_wpos_X(bar.gfx, bar.geom.pos[0], bar.geom.num_faces)

            // re-position handle
            const dif = x*2;
            const handle = bar.children.buffer[0];            
            handle.geom.pos[0] += dif;
            Gl_set_wpos_X(handle.gfx, handle.geom.pos[0], handle.geom.num_faces)

         }
         
         
         if (y > POSSITIVE || (y < NEGATIVE && scroller.geom.dim[1] + y > min_height)) {
            
            scroller.geom.dim[1] += y;
            scroller.geom.pos[1] += y;

            // resize bar
                  
            bar.geom.dim[1] += y;
            bar.geom.pos[1] += y;
            Gl_set_dim_Y(bar.gfx, bar.geom.dim[1], bar.geom.num_faces)
            Gl_set_wpos_Y(bar.gfx, bar.geom.pos[1], bar.geom.num_faces)


            // const dif_percentage = bar.geom.dim[1] / bar_old_height;
            
            // re-position handle
            const dif = y/2;
            const handle = bar.children.buffer[0];            
            handle.geom.pos[1] += dif;
            Gl_set_wpos_Y(handle.gfx, handle.geom.pos[1], handle.geom.num_faces)
            
         }


         Gl_set_dim_XY(scroller.gfx, scroller.geom.dim, scroller.geom.num_faces)
         Gl_set_wpos_XY(scroller.gfx, scroller.geom.pos, scroller.geom.num_faces)

         View_reset_from_view_all_buffers(scroller.scrolled_section.group_bufferidxs[0]);
         // Mesh_per_vb_remove_all_from_index(scroller.scrolled_section.gfx.vb.idx, scroller.scrolled_section.per_vb_bufferidx);

         const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1];
         const clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1];
         const clip_left = scroller.geom.pos[0] - scroller.geom.dim[0];
         // const clip_right = scroller.geom.pos[0] + scroller.geom.dim[0] + (scroller.StylesGetMargin(STYLES.AXIS.X));
         const clip_right = scroller.geom.pos[0] + scroller.geom.dim[0] - (scroller.StylesGetMargin(STYLES.AXIS.X) + bar.geom.dim[0]*2);
         
         Clampx_from_group(scroller.scrolled_section.group_bufferidxs[0], 0, clip_right);
         
         View_rerender_from_view_all_buffers(scroller.scrolled_section.group_bufferidxs[0], false);


      }

   }


   // IMPORTANT: This Move Calls Section's Move which runs on the meshbuffer for all widget_root_buffer meshes (LINEAR ACCESS)
   Move(x, y) { // Called from any widget. Example: If the scroller is child of a section, the section's Move() will call this Move for the scroller widget

      if (this.scrolled_section) {
         /**DEBUG */ if (!this.scrolled_section.Move) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         // console.log('--------------------')
         this.scrolled_section.Move(x, y); // Let the scrolled mesh handle the Move().
      }

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


   SetColorAlpha(alpha) {

      console.error('implement me\nSEE console error')
      alert('implement me\nSEE console error')

   }


   FakeRemoveFromGfxPosy(posy) {

      this.geom.defPos[1] = this.geom.pos[1];
      this.geom.SetPosY(posy, this.gfx);

      this.scroll_bar.geom.defPos[1] = this.scroll_bar.geom.pos[1];
      this.scroll_bar.geom.SetPosY(posy, this.scroll_bar.gfx);

      const handle = this.scroll_bar.children.buffer[0];
      handle.geom.defPos[1] = handle.geom.pos[1];
      handle.geom.SetPosY(posy, handle.gfx);

      if (this.scrolled_section) {
         /**DEBUG */ if (!this.scrolled_section.FakeRemoveFromGfxPosy) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         this.scrolled_section.FakeRemoveFromGfxPosy(posy); // Let the scrolled mesh handle the Move().
      }
   }


   FakeAddFromGfxPosy(posy) {

      this.geom.pos[1] = this.geom.defPos[1];
      this.geom.SetPosY(posy, this.gfx);

      this.scroll_bar.geom.pos[1] = this.scroll_bar.geom.defPos[1];
      this.scroll_bar.geom.SetPosY(posy, this.scroll_bar.gfx);

      const handle = this.scroll_bar.children.buffer[0];
      handle.geom.pos[1] = handle.geom.defPos[1];
      handle.geom.SetPosY(posy, handle.gfx);

      if (this.scrolled_section) {
         /**DEBUG */ if (!this.scrolled_section.FakeAddFromGfxPosy) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         this.scrolled_section.FakeAddFromGfxPosy(posy); // Let the scrolled mesh handle the Move().
      }
   }


   FakeAddFromGfxAlpha(alpha) {

      this.mat.col[3] = this.mat.defCol[3];
      this.mat.SetColorAlpha(alpha, this.gfx);

      this.scroll_bar.mat.col[3] = this.scroll_bar.mat.defCol[3];
      this.scroll_bar.mat.SetColorAlpha(alpha, this.scroll_bar.gfx);

      const handle = this.scroll_bar.children.buffer[0];
      handle.mat.col[3] = handle.mat.defCol[3];
      handle.mat.SetColorAlpha(alpha, handle.gfx);

      if (this.scrolled_section) {
         /**DEBUG */ if (!this.scrolled_section.FakeAddFromGfxAlpha) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         this.scrolled_section.FakeAddFromGfxAlpha(alpha); // Let the scrolled mesh handle the Move().
      }
   }


   FakeRemoveFromGfxAlpha(alpha) {

      this.mat.defCol[3] = this.mat.col[3];
      this.mat.SetColorAlpha(alpha, this.gfx);

      this.scroll_bar.mat.defCol[3] = bar.mat.col[3];
      this.scroll_bar.mat.SetColorAlpha(alpha, bar.gfx);

      const handle = this.scroll_bar.children.buffer[0];
      handle.mat.defCol[3] = handle.mat.col[3];
      handle.mat.SetColorAlpha(alpha, handle.gfx);

      if (this.scrolled_section) {
         /**DEBUG */ if (!this.scrolled_section.FakeRemoveFromGfxAlpha) alert('FakeRemoveFromGfxAlpha() function is missing from scrolled mesh. @WidgetScroller.js');
         this.scrolled_section.FakeRemoveFromGfxAlpha(alpha); // Let the scrolled mesh handle the Move().
      }
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
         else{ // Handle any FAKE listen event creation for scroller


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

   Reposition_post(dif_pos) {

      this.geom.MoveXYZ(dif_pos, this.gfx);

      this.scroll_bar.geom.MoveXYZ(dif_pos, bar.gfx);

      const handle = this.scroll_bar.children.buffer[0];
      handle.geom.MoveXYZ(dif_pos, handle.gfx);

      this.scrolled_section.MoveXYZ(dif_pos);
   }


   Reposition_pre(dif_pos) {

      AddArr2(this.geom.pos, dif_pos);
      CopyArr2(this.geom.defPos, this.geom.pos);

      AddArr2(this.scroll_bar.geom.pos, dif_pos);
      CopyArr2(this.scroll_bar.geom.defPos, bar.geom.pos);

      const handle = this.scroll_bar.children.buffer[0];
      AddArr2(handle.geom.pos, dif_pos);
      CopyArr2(handle.geom.defPos, handle.geom.pos);

      this.scrolled_section.Reposition_pre(dif_pos);
   }


   /*******************************************************************************************************************************************************/
   // Private Methods 
   /*******************************************************************************************************************************************************/

   #CalculateBarArea(_pos, _dim, pad) {

      const dim = [_dim[0], _dim[1]];
      const pos = [_pos[0], _pos[1], _pos[2] + 1]; // Does not need to change for center positioning.

      return {
         pos: pos,
         dim, dim,
      };
   }


   #CalculateHandleArea(_pos, _dim, pad) {

      const dim = [_dim[0] - (pad[0] * 2), 0];
      dim[1] = dim[0];
      const pos = [_pos[0], _pos[1], _pos[2] + 1]; // Pos does not need to change for positioning in the center.

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


let temp_ypos_accum = 0;
let _scroller_handle_ypos = 0; // IMIDIATELY: Implement a var to store any changes of scroll
export function Scroller_on_update_handle(_params) {

   /**
    * The function is called by the timeInterval.
    * The timeInterval has been set by the 'Scroller_create_on_click_event',
    * that is called from 'HandleEvents()' 
    * as 'mesh.eventCallbacks.buffer[i].Clbk(target, Clbk);'
    * The 'HandleEvents()' passes the param '_params' to this function.
    */

   const bar = _params.params;

   if (bar.StateCheck(MESH_STATE.IN_GRAB) === 0 && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

      // If bar out of hover, delete the timeInterval for moving the handle
      const intervalIdx = bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      bar.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);

      return;
   }

   const handle = bar.children.buffer[0];
   const scroller = bar.parent;

   // Case the handle is grabbed but not moved, then we do not have anything to calculate, just move the scroller and return
   if (handle.geom.pos[1] === _scroller_handle_ypos) {
      Scroller_move_handle(bar, handle);
      return;
   }

   // Else procceed
   Scroller_move_handle(bar, handle);
   _scroller_handle_ypos = handle.geom.pos[1]

   const val = Scroller_calculate_value(bar, handle); // Calculate slider's value based on the handles position.
   
   const scrolled_section = scroller.scrolled_section;
   
   // Calculate height of handle
   const ratio = scroller.geom.dim[1] / scrolled_section.geom.dim[1];
   // const h = (ratio*scroller.geom.dim[1] > scroller.geom.dim[1]) ? bar.geom.dim[1]-handle.StylesGetMargin(STYLES.AXIS.Y) : ratio*scroller.geom.dim[1];
   const h = (ratio*scroller.geom.dim[1] >= scroller.geom.dim[1]) ? bar.geom.dim[1]-handle.StylesGetMargin(STYLES.AXIS.Y) : ratio*scroller.geom.dim[1];
   handle.SetDim([UNCHANGED, h]);
   // handle.SetDimYNoGfxUpdate(d*scroller.geom.dim[1]);

   const scroller_pady = scroller.StylesGetMargin(STYLES.AXIS.Y);
   const move_ratio = ((scrolled_section.geom.dim[1] * 2) - ((scroller.geom.dim[1] * 2)-scroller_pady*2));
   // const move_ratio = ((scrolled_section.geom.dim[1] * 2) - ((scroller.geom.dim[1] * 2) - 30));

   // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
   const scroller_top = scroller.geom.pos[1] - (scroller.geom.dim[1]-scroller_pady);
   const posy = (move_ratio * -val) + scroller_top + scrolled_section.geom.dim[1];
   const ydif = posy - scrolled_section.geom.pos[1];

   temp_ypos_accum += ydif;

   /**
    * // TODO: clip and move at the same function. Update positions once a change 'rendering a mesh' happens???Only for scolled meshes??? 
    * 
    * Create a position accumulator.
    * 
    * The position of the meshes should change in 'Clipy_from_group'
    * 
    * Acumulate the positions
    * 
    * If change in the 'Clipy_from_group' happened, update the pos of all meshes
    * 
    * reset the accumulator
    */

   // Movey_from_widget_root_buffer(scrolled_section, ydif);
   // scrolled_section.MoveYNoGfxUpdate(ydif)
   View_movey_group(scrolled_section.group_bufferidxs[0], ydif);


   const clip_top = scroller.geom.pos[1] - scroller.geom.dim[1], clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1];
   const changes_hapened = Clipy_from_group(scrolled_section.group_bufferidxs[0], clip_top, clip_bottom, ydif);

   View_reset_from_view_all_buffers(scrolled_section.group_bufferidxs[0]);
   // Mesh_per_vb_remove_all_from_index(scrolled_section.gfx.vb.idx, scrolled_section.per_vb_bufferidx);


   /**
    * REMOVING SCOLLED SECTION'S EVENTS TO RECONSTRUCT THEM FOR THE NEW EVENTS OF THE ACTIVATED SCROLLED ITEMS 
    * 
    * Explanation:
    * 1. For HOVER the root event is the scrolled section
    * 2. For CLICK the root event is the scroller
    * 
    * So there is different approach as to how to remove HOVER & CLICK events
    * from scrolled_section as wel as for the children events too.
    * // NOTE: The children events are 'winked', because the are in
    * scrolled section's event children buffer, so we just set the buffer to null.
    *   
    * The NON loop way to remove children events is 'Listener_remove_child_event_from_parent'.
    * But this function needs a parent event to remove the children.
    * In case of HOVER, the top root event is that of scrolled section.
    * So to remove for hover we must:
    * HOVER:
    *    1. Wink the children's event buffer, by setting it to null.
    *    2. Remove the parent event(scrolled section).
    *    3. Remove the scrolled section's index of its 'listeners' buffer
    *       so that on 'Reconstruct()' a new event for scrooled section will be created
    *       and its index to be stored at the scrolled section's 'listeners' buffer.
    *    
    */



   for (let i = 0; i <= scrolled_section.listeners.boundary; i++) {

      // if (!scrolled_section.listeners.buffer[i]) 
      if (scrolled_section.listeners.buffer[i] !== null && scrolled_section.listeners.buffer[i] !== INT_NULL) {
         // console.log()

         Listener_remove_event_by_idx(i, scrolled_section.listeners.buffer[i])
         scrolled_section.listeners.buffer[i] = INT_NULL;
         // console.log('REMOVE')
         
      }
   }


   View_rerender_from_view_all_buffers(scrolled_section.group_bufferidxs[0], true);

   /**FOR FRAMEBUFFER. DO NOT DELETE */
   // if(scrolled_section.isFramebufferRendered !== INT_NULL){
   //    // const r = scroller.geom.dim[1] / scrolled_section.geom.dim[1]
   //    const r = (scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1] / scroller.scroll_bar.geom.dim[1]) /1000
   //    // const r = scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1]/(scrolled_section.geom.dim[1] * scroller.scroll_bar.geom.dim[1]) 
   //    // const r = (scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1]/(scrolled_section.geom.dim[1]) )/100
   //    Framebuffer_moveY(scrolled_section.isFramebufferRendered, ydif, r)
   // }

}



export function Scroller_calc_posy_from_handle(scroller, scrolled_section) {

   const bar = scroller.scroll_bar;
   const handle = bar.children.buffer[0];

   const val = Scroller_calculate_value(bar, handle); // Calculate slider's value based on the handles position.

   const move_ratio = ((scrolled_section.geom.dim[1] * 2) - (scroller.geom.dim[1] * 2) );

   // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
   const scroller_top = scroller.geom.pos[1] - scroller.geom.dim[1];
   const posy = (move_ratio * -val) + scroller_top + scrolled_section.geom.dim[1];
   const ydif = posy - scrolled_section.geom.pos[1];

   return ydif;
}




export function Scroller_get_pos_left(scroller) {

   const posx = (scroller.geom.pos[0] - scroller.geom.dim[0] + scroller.StylesGetMargin(STYLES.AXIS.X));
   return posx;
}






/*******************************************************************************************************************************************************/
// Scroller Functionality 

function Scroller_move_handle(bar, handle) {

   /** Move the handle acoring to the mouse position */
   const pad = handle.StylesGetMargin(STYLES.AXIS.Y);
   const barupper = bar.geom.pos[1] - bar.geom.dim[1] + (handle.geom.dim[1] + pad);
   const barlower = bar.geom.pos[1] + bar.geom.dim[1] - (handle.geom.dim[1] + pad);
   const y = MouseGetPos()[1];

   if (y > barupper && y < barlower)
      handle.geom.SetPosY(y, handle.gfx)

   else if (y > barlower)
      handle.geom.SetPosY(barlower, handle.gfx)

   else if (y < barupper)
      handle.geom.SetPosY(barupper, handle.gfx)

   return true;
}




export function Scroller_calculate_value(bar, handle) {

   const pad = handle.StylesGetMargin(STYLES.AXIS.Y);
   const handleypos = handle.geom.pos[1];
   let barheight = bar.geom.dim[1] * 2 - ((handle.geom.dim[1] + pad) * 2);
   let bartop = bar.geom.pos[1] - bar.geom.dim[1] + (handle.geom.dim[1] + pad);

   const val = handleypos - bartop;

   if(barheight===0) barheight=1

   // Interpolate to a 0-max value.
   const scrollerVal = val / (barheight);

   return scrollerVal;
}
// export function Scroller_calculate_value(bar, handle) {

//    const pad = handle.StylesGetMargin(STYLES.AXIS.Y);
//    const handleypos = handle.geom.pos[1];
//    let barheight = bar.geom.dim[1] * 2 - ((handle.geom.dim[1] + pad) * 2);
//    let bartop = bar.geom.pos[1] - bar.geom.dim[1] + (handle.geom.dim[1] + pad);

//    const val = handleypos - bartop;

//    // Interpolate to a 0-max value.
//    const scrollerVal = val / (barheight);

//    return scrollerVal;
// }
