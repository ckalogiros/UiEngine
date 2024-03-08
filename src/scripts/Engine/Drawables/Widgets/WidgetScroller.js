"use strict";

import { Section } from "../Meshes/Section.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Find_gfx_match_widget_root_impl, Find_textgfx_from_parent_descending } from "../../Interfaces/Gfx/GfxContextFindMatch.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_info_get_by_vbidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Mesh_buffer_get_mesh_byidx, Movey_from_widget_root_buffer, Widget_group_add, Widget_group_create, Widget_group_find_but_not_insert, Widget_group_update_decrement, Widget_group_update_increment, Widget_group_update_start, Widget_root_buffer_get_byidx, Widget_root_reset_gfx } from "../../Core/MeshBuffer.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { AddArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Clamp_y_remove_children_FIRST_TIME_CLAMP, Clipy_from_widget_root } from "../Operations/Clip.js";
import { Index_buffer_add_indices } from "../../../Graphics/Buffers/IndexBuffers.js";


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
let SCROLL_MESH_IDX = INT_NULL;
let SCROLL_BAR_IDX = INT_NULL;


export class Widget_Scroller extends Section {

   scrolled_section;
   scroll_bar;
   renderables; // Store the first/upper and last/lower meshes that is rendered by the gfx buffers

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, scrolled_mesh, dim = [100, 50], col = TRANSPARENCY(GREY5, .5)) {

      const pos = [200, 400, 0];

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, SECTION.HORIZONTAL, [10, 10], pos, dim, col);

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle([0, 6, 2]);
      this.SetName('Widget_Scroller');
      // this.StateEnable(MESH_STATE.HAS_POPUP);
      this.type |= MESH_TYPES_DBG.WIDGET_SCROLLER;
      // Disable the 'MESH_TYPES_DBG.SECTION_MESH_ONLY'
      this.type &= ~MESH_TYPES_DBG.SECTION_MESH_ONLY;

      // If there is a group (section) passed by the user, use that section as scrolled section.
      if (scrolled_mesh && (scrolled_mesh.type & MESH_TYPES_DBG.SECTION_MESH)) {

         this.scrolled_section = scrolled_mesh;
         // this.scrolled_section.root_bufferidx = this.root_bufferidx;
         this.scrolled_section.SetName('Scrolled_section')

         // Calculate the scroller's initial position
         this.geom.pos[0] = (this.scrolled_section.geom.pos[0] - this.scrolled_section.geom.dim[0]) - this.margin[0]; // Include the margin in the calculation
         this.geom.pos[1] = (this.scrolled_section.geom.pos[1] - this.scrolled_section.geom.dim[1]) + this.margin[1];
      }
      else { // else create a new scrolled section.
         // We need to calculate the sizes correctly.
         // E.x. we need to create a new scrolled_section section, add the items, calculate with .Calc() and get the size to use for aligning the scroller and the scroll bar...
         console.error('IMPLEMENT this.')
      }

      this.renderables = {
         first: 0,
         last: this.scrolled_section.children.boundary - 1,
      }

      // Calculate the bar's and handle's horizontal pading.
      const pad = [1.4, 1.4];


      /********************************************************************************************************************************************/
      // Scroller Bar: Bar is child of 'this'

      // Calculate bar's dimentions and position.
      const barpos = [pos[0], pos[1] + this.geom.dim[1], pos[2]]
      const barMetrics = this.#CalculateBarArea(barpos, [10, dim[1]], pad)


      const bar = Create_rect_mesh(barMetrics.pos, barMetrics.dim, PINK_240_60_160);

      bar.type |= MESH_TYPES_DBG.WIDGET_SCROLLER_BAR | bar.geom | bar.mat;
      bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      bar.SetStyle([0, 3, 2]);
      bar.SetName('Scroll bar');



      /********************************************************************************************************************************************/
      // Scroller Handle: Handle is a child of the bar mesh

      const handleMetrics = this.#CalculateHandleArea(bar.geom.pos, bar.geom.dim, pad)
      const handle = Create_rect_mesh(handleMetrics.pos, handleMetrics.dim, BLUE_10_120_220);
      handle.type |= MESH_TYPES_DBG.WIDGET_SCROLLER_HANDLE | handle.geom | handle.mat;
      handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      handle.SetStyle([4, 5, 1.9]);
      handle.SetName('Scroll handle');
      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      // handle.StateEnable(MESH_STATE.IS_MOVABLE); // No event is created, cause the handle move event is handled by the OnClick() class method

      // Make the vertical area of the bar larger for hover and handle grabing.
      bar.hover_margin = [0, handle.geom.dim[1] + 4];



      /********************************************************************************************************************************************/
      // Align

      // Calculate the scroller's width
      this.geom.pos[0] += this.geom.dim[0]; // Correct the scrollers pos now that we know its width.
      this.geom.pos[1] += this.geom.dim[1]; // Correct the scrollers pos now that we know its height.

      // Calculate handle's position, from bar's position
      handle.geom.pos[0] = bar.geom.pos[0];
      handle.geom.pos[1] = bar.geom.pos[1] - bar.geom.dim[1];

      bar.AddChild(handle);
      this.scroll_bar = bar;

      // Add the scrolled mesh
      SCROLL_BAR_IDX = this.AddItem(bar);
      // SCROLL_BAR_IDX = this.AddChild(bar);
      SCROLL_MESH_IDX = this.AddItem(this.scrolled_section);

   }


   AddItemToScrolledSection(mesh) {

      /**DEBUG*/if (ERROR_NULL(mesh)) { console.error('AddItemToScrolledSection(), the mesh to be added is null or undefined'); return; }

      this.scrolled_section.AddItem(mesh);

      const size = this.scrolled_section.Recalc();
      if (size[0] > this.geom.dim[0]) {

         this.#RecalculateWidth(size[0]);
      }
      this.#Reposition();

      // Set scroller's y pos
      this.geom.pos[1] = (this.scrolled_section.geom.pos[1] - this.scrolled_section.geom.dim[1]) + this.geom.dim[1] + this.margin[1];

      // Set the bar and handle y pos
      this.scroll_bar.SetPosY(this.geom.pos[1]);
      const handle = this.scroll_bar.children.buffer[0];
      handle.SetPosY(this.geom.pos[1]);
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.root_bufferidx = root_bufferidx;

      const handle = bar.children.buffer[0];
      handle.root_bufferidx = root_bufferidx;

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      scrolled_mesh.root_bufferidx = root_bufferidx;
   }

   
   AddToWidgetGroupBuffer(group_bufferidx) {

      if(this.state.mask & MESH_STATE.ACTIVE){
         /**DEBUG */ if (!this.gfx) console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO GFX FOR MESH:', this.mesh_bufferidx, this.GetName());
         /**DEBUG */ if (this.group_bufferidxs[1] !== INT_NULL) console.error('ADDING TO WIDGET GROUP BUFFER WARNING: MESH ALREADY IS IN A WIDGET GROUP:', this.mesh_bufferidx, this.GetName(), 'group:', this.group_bufferidxs, 'start', this.gfx.vb.start);

         this.group_bufferidxs[0] = group_bufferidx;
         this.group_bufferidxs[1] = Widget_group_add(group_bufferidx, this.gfx, this.geom.num_faces, this.mesh_bufferidx);
         
         const bar = this.children.buffer[SCROLL_BAR_IDX];
         bar.group_bufferidxs[0] = group_bufferidx;
         bar.group_bufferidxs[1] = Widget_group_add(group_bufferidx, bar.gfx, bar.geom.num_faces, bar.mesh_bufferidx);
         
         const handle = bar.children.buffer[0];
         handle.group_bufferidxs[0] = group_bufferidx;
         handle.group_bufferidxs[1] = Widget_group_add(group_bufferidx, handle.gfx, handle.geom.num_faces, handle.mesh_bufferidx);
         
         const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
         scrolled_mesh.group_bufferidxs[0] = group_bufferidx;
         scrolled_mesh.group_bufferidxs[1] = Widget_group_add(group_bufferidx, scrolled_mesh.gfx, scrolled_mesh.geom.num_faces, scrolled_mesh.mesh_bufferidx);
      }
   }


   Destroy() {

      // const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      const bar = this.children.buffer[SCROLL_BAR_IDX];
      const handle = bar.children.buffer[0];

      this.scrolled_section.Destroy();
      handle.Destroy();
      bar.Destroy();

      this.scrolled_section = null;
      this.scroll_bar = null;
      // Scrollers's rect_mesh destruction
      super.Destroy();
   }



   /*******************************************************************************************************************************************************/
   // Graphics
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx = null, is_scrolled_section_private = false) {

      if (FLAGS & GFX_CTX_FLAGS.PRIVATE) {

         const igfx = Find_gfx_match_widget_root_impl(this.root_bufferidx, this.sid);
         FLAGS |= igfx.FLAGS;

         this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, FLAGS, igfx.idxs, this.root_bufferidx, this.mesh_bufferidx);

         // Use the same gfx buffer for bar mesh
         const igfx_rect = [this.gfx.prog.idx, this.gfx.vb.idx];
         this.scroll_bar.gfx = Gfx_generate_context(this.scroll_bar.sid, this.scroll_bar.sceneidx, this.scroll_bar.geom.num_faces, FLAGS | GFX_CTX_FLAGS.SPECIFIC, igfx_rect, this.scroll_bar.root_bufferidx, this.scroll_bar.mesh_bufferidx);

         // Use the same gfx buffer for handle mesh
         const handle = this.scroll_bar.children.buffer[0];
         handle.gfx = Gfx_generate_context(handle.sid, handle.sceneidx, handle.geom.num_faces, FLAGS | GFX_CTX_FLAGS.SPECIFIC, igfx_rect, handle.root_bufferidx, handle.mesh_bufferidx);

         // Render the scrolled section and all it's meshes to it's own separate gfx buffer
         if (is_scrolled_section_private) {
            this.scrolled_section.gfx = Gfx_generate_context(this.scrolled_section.sid, this.scrolled_section.sceneidx, this.scrolled_section.geom.num_faces, GFX_CTX_FLAGS.PRIVATE, igfx_rect, this.scrolled_section.root_bufferidx, this.scrolled_section.mesh_bufferidx);
         }
         else {
            this.scrolled_section.gfx = Gfx_generate_context(this.scrolled_section.sid, this.scrolled_section.sceneidx, this.scrolled_section.geom.num_faces, FLAGS | GFX_CTX_FLAGS.SPECIFIC, igfx_rect, this.scrolled_section.root_bufferidx, this.scrolled_section.mesh_bufferidx);
         }

         const scrolled_section_igfx = [this.scrolled_section.gfx.prog.idx, this.scrolled_section.gfx.vb.idx];
         for (let i = 0; i < this.scrolled_section.children.boundary; i++) {
            const child = this.scrolled_section.children.buffer[i];
            if (child) {
               child.GenGfxCtx(FLAGS, scrolled_section_igfx);
            }
         }


      }
      else {

         /**
          * ELSE:
          *    if FLAGS = SPECIFIC AND gfxidx !== null
          *    the whole scroller will be rendered at the specific gfx buffer.
          *    The meshes in the scrolled mesh are handled by the Section's GenGfxCtx,
          *    and the dicision (Up until this IMPLEMENTATION) is "Find_gfx_match_widget_root_impl",
          *    for all 3 base classes: Rect_Mesh, Text_Mesh, Textured_Mesh
          */

         this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, FLAGS, gfxidx, this.root_bufferidx, this.mesh_bufferidx);
         const igfx = [this.gfx.prog.idx, this.gfx.vb.idx]

         this.scroll_bar.gfx = Gfx_generate_context(this.scroll_bar.sid, this.scroll_bar.sceneidx, this.scroll_bar.geom.num_faces, GFX_CTX_FLAGS.SPECIFIC, igfx, this.scroll_bar.root_bufferidx, this.scroll_bar.mesh_bufferidx);

         const handle = this.scroll_bar.children.buffer[0];
         handle.gfx = Gfx_generate_context(handle.sid, handle.sceneidx, handle.geom.num_faces, GFX_CTX_FLAGS.SPECIFIC, igfx, this.root_bufferidx, this.mesh_bufferidx);

         this.scrolled_section.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, igfx);
         for (let i = 0; i < this.scrolled_section.children.boundary; i++) {
            const child = this.scrolled_section.children.buffer[i];
            if (child) {
               child.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, igfx);
            }
         }
      }

      return this.gfx;
   }


   Render() {

      if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');
      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfx(); }

      const bar = this.scroll_bar;
      if (!bar.is_gfx_inserted && (bar.state.mask & MESH_STATE.ACTIVE)) { bar.AddToGfx(); }

      const handle = bar.children.buffer[0];
      if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfx(); }

      if (!this.scrolled_section.is_gfx_inserted && (this.scrolled_section.state.mask & MESH_STATE.ACTIVE)) { this.scrolled_section.Render(); }

      // this.SetScissorBox();
   }

   // IMIDIATELY: Create a separate function like in Dropdown widget
   Rerender() {

      // Reset any gfx buffers from mesh tree recursively
      Widget_root_reset_gfx(this.root_bufferidx);

      // Reset gfx start for the mesh
      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName());
      if(this.sid.shad & SID.SHAD.INDEXED) this.gfx.ib.start = Index_buffer_add_indices(this.gfx.ib, this.GetName());
      this.StateEnable(MESH_STATE.ACTIVE);

      const bar = this.scroll_bar;
      Vertex_buffer_add_vertices(bar.gfx, bar.geom, bar.mat, bar.GetName());
      if(bar.sid.shad & SID.SHAD.INDEXED) bar.gfx.ib.start = Index_buffer_add_indices(bar.gfx.ib, bar.GetName());
      bar.StateEnable(MESH_STATE.ACTIVE);

      const handle = bar.children.buffer[0];
      Vertex_buffer_add_vertices(handle.gfx, handle.geom, handle.mat, handle.GetName());
      if(handle.sid.shad & SID.SHAD.INDEXED) handle.gfx.ib.start = Index_buffer_add_indices(handle.gfx.ib, handle.GetName());
      handle.StateEnable(MESH_STATE.ACTIVE);

      Vertex_buffer_add_vertices(this.scrolled_section.gfx, this.scrolled_section.geom, this.scrolled_section.mat, this.scrolled_section.GetName());
      if(this.scrolled_section.sid.shad & SID.SHAD.INDEXED) this.scrolled_section.gfx.ib.start = Index_buffer_add_indices(this.scrolled_section.gfx.ib, this.scrolled_section.GetName());
      this.scrolled_section.StateEnable(MESH_STATE.ACTIVE);

      for (let i = 0; i < this.scrolled_section.children.boundary; i++) {

         const child = this.scrolled_section.children.buffer[i];
         /**DEBUG*/if (child === _) console.error('TEMP_RERENDER', this.scrolled_section.children.buffer, i)
         child.Rerender()

      }
   }


   SetScissorBox() {

      // Enable scissoring
      const vb = Vertex_buffer_info_get_by_vbidx(this.gfx.prog.groupidx, this.gfx.prog.idx, this.gfx.vb.idx);
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
         const vb_text = Vertex_buffer_info_get_by_vbidx(textgfx.prog.groupidx, textgfx.prog.idx, textgfx.vb.idx);
         /**DEBUG */ if (!vb_text) alert('SetScissorBox() in Scroller cannot resolve vertex buffer for text');
         vb_text.EnableScissorBox();
         vb_text.SetScissorBox(scissorbox);
      }
      else console.log('{}{}{}{}}}{}{}} TEXT BUFFER NNOT FOUND')
   }


   SetGfxProgramGroup(group_mask) {
      this.sid.progs_group = group_mask;

      this.scroll_bar.sid.progs_group = group_mask;
      const handle = this.scroll_bar.children.buffer[0];
      handle.sid.progs_group = group_mask;
      this.scrolled_section.SetGfxProgramGroup(group_mask);
   }


   /*******************************************************************************************************************************************************/
   // State
   /*******************************************************************************************************************************************************/

   StateEnable(bit) {
      this.state.mask |= bit;

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.state.mask |= bit;

      const handle = bar.children.buffer[0];
      handle.state.mask |= bit;

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      scrolled_mesh.state.mask |= bit;

   }



   /*******************************************************************************************************************************************************/
   // Setters-Getters
   /*******************************************************************************************************************************************************/



   /*******************************************************************************************************************************************************/
   // Events
   /*******************************************************************************************************************************************************/

   OnClick(params) {

      const mesh = params.target_params.target_mesh;
      const point = MouseGetPos();

      // Check if the click happened on bar
      const bar = mesh.children.buffer[SCROLL_BAR_IDX];
      if (point[0] > bar.geom.pos[0] - bar.geom.dim[0] + bar.hover_margin[0]) { // Check only if click is on the right of the left side of the bar mesh

         STATE.mesh.SetClicked(bar);

         if ((bar.type & MESH_TYPES_DBG.WIDGET_SCROLLER_BAR) && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

            const idx = TimeIntervalsCreate(16, 'Move Scroller Handle', TIME_INTERVAL_REPEAT_ALWAYS, Scroller_on_update_handle, bar);
            // bar.timeIntervalsIdxBuffer.Add(idx);
            bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            STATE.mesh.SetGrabed(bar);
            bar.StateEnable(MESH_STATE.IN_GRAB);
         }

         return true;
      }
      else {

         STATE.mesh.SetClicked(bar);
         // STATE.mesh.SetFocused(mesh);

         // Move Scroller // HERE!!!
         if ((mesh.type & MESH_TYPES_DBG.WIDGET_SCROLLER) && mesh.StateCheck(MESH_STATE.IS_GRABABLE) && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            const idx = TimeIntervalsCreate(10, 'Move Scroller', TIME_INTERVAL_REPEAT_ALWAYS, mesh.OnMove, mesh);
            // mesh.timeIntervalsIdxBuffer.Add(idx);
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

            STATE.mesh.SetGrabed(mesh);
            mesh.StateEnable(MESH_STATE.IN_GRAB);
         }

         return true;
      }
   }


   // SEE ### OnMove Events Implementation Logic
   OnMove(params) {// Called by timeInterval as a callback function

      // const scroller = params.target_params;
      const scroller = params.params;

      // Destroy the time interval and the Move operation, if the scroller is not grabed
      // MESH_STATE.IN_GRAB is deactivated upon mouse click up in Events.js.
      if (scroller.StateCheck(MESH_STATE.IN_GRAB) === 0 && scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         scroller.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.MOVE);

         // Set the position of any disabled meshes
         /**
          *  Upon moving the scroller, for efficiency we move only the renderables meshes,
          *  and not the clamped ones. So by calling Calculate_positions_recursive() 
          *  on mouse 'click-up', we reposition all meshes, including the clamped ones. 
          */
         // Calculate_positions_recursive(scroller.scrolled_section, SECTION.INHERIT); 

         return;
      }

      const mouse_pos = MouseGetPosDif();
      scroller.Move(mouse_pos.x, -mouse_pos.y);

      // scroller.SetScissorBox();
   }


   // IMPORTANT: This Move Calls Section's Move which runs on the meshbuffer for all widget_root_buffer meshes (LINEAR ACCESS)
   Move(x, y) { // Called from any widget. Example: If the scroller is child of a section, the section's Move() will call this Move for the scroller widget

      // Move 'this' text
      // this.geom.MoveXY(x, y, this.gfx);

      // const bar = this.children.buffer[SCROLL_BAR_IDX];
      // bar.geom.MoveXY(x, y, bar.gfx);

      // const handle = bar.children.buffer[0];
      // handle.geom.MoveXY(x, y, handle.gfx);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         /**DEBUG */ if (!scrolled_mesh.Move) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         // console.log('--------------------')
         scrolled_mesh.Move(x, y); // Let the scrolled mesh handle the Move().
      }

   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.geom.pos[0] += x;
      bar.geom.pos[1] += y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += x;
      handle.geom.pos[1] += y;

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         scrolled_mesh.MoveNoGfxUpdate(x, y); // Let the scrolled mesh handle the Move().
      }

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.geom.pos[1] += y;

      const handle = bar.children.buffer[0];
      handle.geom.pos[1] += y;

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         scrolled_mesh.MoveYNoGfxUpdate(y); // Let the scrolled mesh handle the Move().
      }

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.geom.pos[0] += x;

      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += x;

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         scrolled_mesh.MoveXNoGfxUpdate(x); // Let the scrolled mesh handle the Move().
      }

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


   FakeRemoveFromGfxPosy(posy) {

      this.geom.defPos[1] = this.geom.pos[1];
      this.geom.SetPosY(posy, this.gfx);

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.geom.defPos[1] = bar.geom.pos[1];
      bar.geom.SetPosY(posy, bar.gfx);

      const handle = bar.children.buffer[0];
      handle.geom.defPos[1] = handle.geom.pos[1];
      handle.geom.SetPosY(posy, handle.gfx);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         /**DEBUG */ if (!scrolled_mesh.FakeRemoveFromGfxPosy) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         scrolled_mesh.FakeRemoveFromGfxPosy(posy); // Let the scrolled mesh handle the Move().
      }
   }


   FakeAddFromGfxPosy(posy) {

      this.geom.pos[1] = this.geom.defPos[1];
      this.geom.SetPosY(posy, this.gfx);

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.geom.pos[1] = bar.geom.defPos[1];
      bar.geom.SetPosY(posy, bar.gfx);

      const handle = bar.children.buffer[0];
      handle.geom.pos[1] = handle.geom.defPos[1];
      handle.geom.SetPosY(posy, handle.gfx);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         /**DEBUG */ if (!scrolled_mesh.FakeAddFromGfxPosy) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         scrolled_mesh.FakeAddFromGfxPosy(posy); // Let the scrolled mesh handle the Move().
      }
   }


   FakeAddFromGfxAlpha(alpha) {

      this.mat.col[3] = this.mat.defCol[3];
      this.mat.SetColorAlpha(alpha, this.gfx);

      const bar = this.children.buffer[SLIDER_BAR_IDX];
      bar.mat.col[3] = bar.mat.defCol[3];
      bar.mat.SetColorAlpha(alpha, bar.gfx);

      const handle = bar.children.buffer[0];
      handle.mat.col[3] = handle.mat.defCol[3];
      handle.mat.SetColorAlpha(alpha, handle.gfx);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         /**DEBUG */ if (!scrolled_mesh.FakeAddFromGfxAlpha) alert('Move() function is missing from scrolled mesh. @WidgetScroller.js');
         scrolled_mesh.FakeAddFromGfxAlpha(alpha); // Let the scrolled mesh handle the Move().
      }
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

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      if (scrolled_mesh) {
         /**DEBUG */ if (!scrolled_mesh.FakeRemoveFromGfxAlpha) alert('FakeRemoveFromGfxAlpha() function is missing from scrolled mesh. @WidgetScroller.js');
         scrolled_mesh.FakeRemoveFromGfxAlpha(alpha); // Let the scrolled mesh handle the Move().
      }
   }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null) {

      const scroller = this;
      const bar = this.scroll_bar;
      const handle = bar.children.buffer[0];
      const scrolled_section = this.scrolled_section;

      const root_evt = _root ? _root.listeners.buffer : null;

      // Create hover events
      // BUG: It seems that hovering does not work for scroller and bar
      // if (scroller.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.HOVER]) scroller.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.HOVER);
      if (handle.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.HOVER]) handle.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.HOVER);
      // if (bar.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.HOVER]) bar.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.HOVER);

      const target_params = {
         EventClbk: null,
         targetBindingFunctions: null,
         target_mesh: scroller,
         params: null,
      }
      if (scroller.listeners.buffer[LISTEN_EVENT_TYPES_INDEX.CLICK]) { // This is a check mainly if the user has activated the 'Move' event for the scroller.

         scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE, false);
         scroller.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.CLICK, scroller.OnClick, target_params, root_evt);
      }
      else {

         // Create a Fake click event with no callback and params, but any root events.  
         scroller.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, true);
         scroller.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.CLICK, null, null, root_evt);
      }
      bar.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      bar.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.CLICK, scroller.OnClick, target_params, scroller.listeners.buffer);

      scrolled_section.ConstructListeners(this);

   }



   /*******************************************************************************************************************************************************/
   // Alignment
   /*******************************************************************************************************************************************************/

   Reposition_post(dif_pos) {

      this.geom.MoveXYZ(dif_pos, this.gfx);

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      bar.geom.MoveXYZ(dif_pos, bar.gfx);

      const handle = bar.children.buffer[0];
      handle.geom.MoveXYZ(dif_pos, handle.gfx);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      scrolled_mesh.MoveXYZ(dif_pos);
   }


   Reposition_pre(dif_pos) {

      AddArr2(this.geom.pos, dif_pos);

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      AddArr2(bar.geom.pos, dif_pos);

      const handle = bar.children.buffer[0];
      AddArr2(handle.geom.pos, dif_pos);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      scrolled_mesh.Reposition_pre(dif_pos);
   }


   /*******************************************************************************************************************************************************/
   // Misc
   /*******************************************************************************************************************************************************/

   UpdateWidgetGroupIncrementNumFaces() {

      Widget_group_update_increment(this.group_bufferidxs, this.geom.num_faces);

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      Widget_group_update_increment(bar.group_bufferidxs, bar.geom.num_faces);

      const handle = bar.children.buffer[0];
      Widget_group_update_increment(handle.group_bufferidxs, handle.geom.num_faces);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      Widget_group_update_increment(scrolled_mesh.group_bufferidxs, scrolled_mesh.geom.num_faces);
   }


   UpdateWidgetGroupDecrementNumFaces() {

      Widget_group_update_decrement(this.group_bufferidxs, this.geom.num_faces, this);

      const bar = this.children.buffer[SCROLL_BAR_IDX];
      Widget_group_update_decrement(bar.group_bufferidxs, bar.geom.num_faces);

      const handle = bar.children.buffer[0];
      Widget_group_update_decrement(handle.group_bufferidxs, handle.geom.num_faces);

      const scrolled_mesh = this.children.buffer[SCROLL_MESH_IDX];
      Widget_group_update_decrement(scrolled_mesh.group_bufferidxs, scrolled_mesh.geom.num_faces);
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

      const new_width = scrolled_section_width + this.scroll_bar.geom.dim[0] + this.margin[0] * 2;
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
      bar.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.UPDATE);

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

   const scrolled_section = scroller.children.buffer[SCROLL_MESH_IDX];
   const move_ratio = ((scrolled_section.geom.dim[1] * 2) - scroller.geom.dim[1] * 2) / 100;
   // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
   const scroller_top = scroller.geom.pos[1] - scroller.geom.dim[1];
   const posy = (move_ratio * -val) + scroller_top + scrolled_section.geom.dim[1];
   const ydif = posy - scrolled_section.geom.pos[1];


   /**
    * // TODO: clip and move at the same function. Update positions once a change 'rendering a mesh' happens???Only for scolled meshes??? 
    * 
    * Create a position accumulator.
    * 
    * The position of the meshes should change in 'Clipy_from_widget_root'
    * 
    * Acumulate the positions
    * 
    * If change in the 'Clipy_from_widget_root' happened, update the pos of all meshes
    * 
    * reset the accumulator
    */

   Movey_from_widget_root_buffer(scrolled_section, ydif);

   // scroller.scrolled_section.SetClampY(scroller.geom.pos[1], scroller.geom.dim[1], 300);
   // const changes_hapened = Clipy_chunks_impl(scroller.scrolled_section, scroller.scrolled_section.clamp[CLAMP.Y], scroller.renderables);
   const changes_hapened = Clipy_from_widget_root(scroller.root_bufferidx);

   // scroller.Rerender2()
   scroller.Rerender()
   // if(changes_hapened) scroller.Rerender2(); 
   // else{
   //    const group_batch_buffer = Widget_group_get(scrolled_section.group_bufferidxs[0]);
   //    const len = group_batch_buffer.vb_data.length
   //    for (let i = 0; i < len; i++) {
   //       const mesh = Mesh_buffer_get_mesh_byidx(group_batch_buffer.vb_data[i].meshidx);
   //       Batch_store(mesh, _, { pos: [0, ydif] }, group_batch_buffer.vb_data[i].num_faces, group_batch_buffer.vb_data[i].start); // The batch_store needs the number of meshes to update as well as the move value
   //    }
   // }


   /**FOR FRAMEBUFFER. DO NOT DELETE */
   // if(scrolled_section.isFramebufferRendered !== INT_NULL){
   //    // const r = scroller.geom.dim[1] / scrolled_section.geom.dim[1]
   //    const r = (scroller.scroll_bar.children.buffer[0].geom.dim[1] / scroller.scroll_bar.geom.dim[1]) /1000
   //    // const r = scroller.scroll_bar.children.buffer[0].geom.dim[1]/(scrolled_section.geom.dim[1] * scroller.scroll_bar.geom.dim[1]) 
   //    // const r = (scroller.scroll_bar.children.buffer[0].geom.dim[1]/(scrolled_section.geom.dim[1]) )/100
   //    Framebuffer_moveY(scrolled_section.isFramebufferRendered, ydif, r)
   // }

}



export function Scroller_clampy_and_render(scroller, upper_threshold = 0, lower_thresold = 0) {

   // First run a calc to update the dimensions and positions of all meshes, so that we can clamp correctly
   scroller.Calc_no_gfx_update();

   // Remove all children that are not inside limits
   const ret = Clamp_y_remove_children_FIRST_TIME_CLAMP(scroller.scrolled_section, upper_threshold, lower_thresold);
   scroller.renderables.first = ret.firstupper;
   scroller.renderables.first_all = ret.firstupper;
   scroller.renderables.last = ret.firstlower - 1;
   scroller.renderables.last_all = ret.firstlower;
   console.log('scroller.renderables', scroller.renderables, 'ret', ret);


   // Build the group out of the clamped scrolled section
   scroller.scrolled_section.group_bufferidxs = Widget_group_create(scroller.scrolled_section.mesh_bufferidx, scroller.scrolled_section.gfx)
   scroller.scrolled_section.AddToWidgetGroupBuffer(scroller.scrolled_section.group_bufferidxs[0]);

   // Render the clamped scroller
   scroller.Render();   
   // scroller.Recalc();
   // This way we do not resize the scrolled section to the clamped height(keeps it at original height for all items)
   scroller.ConstructListeners();

   // NOTE: We have to update the "starts" of all group.vb[] arrays after the render, because the group was created before the render, the start indexes to the vertex buffers are set wrong.
   Widget_group_update_start(scroller.scrolled_section.group_bufferidxs[0]);

   // IMPORTANT: Do not trust a mesh that has a valid .group_bufferidxs, that it is actively in the group at any time.
   /**
    * In order for all scrolled meshes to be able to be rendered correctly, we need them to 
    * have a reference to the group buffer via their .group_bufferidxs variable.
    * That is because at any given time, a Batch update will update X number of faces in the vertex buffers,
    * but the number of scrolled items may change depending on the clamp of the scroller.
    * So we need to dynamicaly update the number of faces of the group when changes happen on the clamp procedure.
    * The only way to acomplish this is to store the group in to all items regardless if they are actively in the group or not.  
    */
   // Assign to all scrolled items the scroller's group
   // TEMPORARY: Design how and where to implement.
   const widget_root = Widget_root_buffer_get_byidx(scroller.root_bufferidx);
   const group_bufferidx = scroller.scrolled_section.group_bufferidxs[0]; // The roots group idx
   for (let i = 0; i < widget_root.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(widget_root.buffer[i])
      if (mesh.gfx && mesh.group_bufferidxs[1] === INT_NULL) {
         mesh.group_bufferidxs = Widget_group_find_but_not_insert(group_bufferidx, mesh.gfx);
      }
   }



   /** DO NOT DELETE YET. This is the code to restore the removed children back to scrolled section */
   // let cnt = 0;
   // // Restore the upper chunk removed meshes back as children of the scrolled mesh
   // for(let i=firstupper; i<lastupper; i++){

   //     const child = clamped_buffer[cnt++];
   //     scroller.scrolled_section.children.buffer[i] = child; // Store children to a temp buffer, in order to restore them back after .Render().
   // }
   // // Restore the lower chunk removed meshes
   // if(firstlower !== INT_NULL)
   // for(let i=firstlower; i<lastlower; i++){

   //     const child = clamped_buffer[cnt++];
   //     scroller.scrolled_section.children.buffer[i] = child; // Store children to a temp buffer, in order to restore them back after .Render().
   // }

}



/*******************************************************************************************************************************************************/
// Scroller Functionality 

function Scroller_move_handle(bar, handle) {

   /** Move the handle acoring to the mouse position */
   const barupper = bar.geom.pos[1] - bar.geom.dim[1];
   const barlower = bar.geom.pos[1] + bar.geom.dim[1];
   const y = MouseGetPos()[1];

   if (y > barupper && y < barlower)
      handle.geom.SetPosY(y, handle.gfx)

   else if (y > barlower)
      handle.geom.SetPosY(barlower, handle.gfx)

   else if (y < barupper)
      handle.geom.SetPosY(barupper, handle.gfx)

   return true;
}



function Scroller_calculate_value(bar, handle) {

   const handleypos = handle.geom.pos[1];
   const barheight = bar.geom.dim[1] * 2;
   const bartop = bar.geom.pos[1] - bar.geom.dim[1];

   const val = handleypos - bartop;

   const max = 100; // Set the max value the scroller will interpolate to.
   // Interpolate to a 0-max value.
   const scrollerVal = (val * max) / (barheight);

   return scrollerVal;
}
