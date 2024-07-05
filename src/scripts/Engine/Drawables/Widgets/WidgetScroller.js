"use strict";

import { Section } from "../Meshes/Section.js";
import { MouseGetPos, MouseGetPosDif, MouseGetPosDifY } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Vertex_buffer_group_get_byidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Mesh_buffer_get_mesh_byidx, Widget_root_add_mesh, Widget_root_rerender, Widget_root_reset_gfx, Widget_root_set_in_focus, Widget_root_set_uniform_callback_per_gfx_root_mesh } from "../../Core/MeshBuffer.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { BLACK, BLUEL, GREY } from "../Material/Base/Colors.js";
import { View_rerender_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/MeshBufferViews.js";
import { Gl_set_dim_y, Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Floor } from "../../../Helpers/Math/MathOperations.js";
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_add_vb_root_wposy, Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { GetSign } from "../../../Helpers/Helpers.js";


























export class Widget_Scroller extends Section {

   scrolled_section;
   scroll_bar;
   renderables; // Store the first/upper and last/lower meshes that is rendered by the gfx buffers
   is_scrolled_section_private; // A way to set a scroller to use separate vertex buffer for the scrolled mesh and all its items  

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, scrolled_mesh, dim = [100, 50], col = TRANSPARENCY(GREY[5], .5), scroller_margin = [6, 6], style, num_faces, is_debug_mesh = 0x0) {

      const pos = [0, 0, 0];


      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, SECTION.HORIZONTAL, scroller_margin, pos, dim, col, _, style, num_faces, is_debug_mesh);

      this.is_scrolled_section_private = false;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle([15, 8, 2]);


      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


      this.type |= MESH_TYPE.WIDGET_SCROLLER;
      this.type &= ~MESH_TYPE.SECTION_MESH_ONLY;




      // Calculate the bar's and handle's horizontal pading.
      // const marg = [1.4, 1.4];
      const marg = [2, 2];
      const pad = this.StylesGetPad();


      // If there is a group (section) passed by the user, use that section as scrolled section.
      if (scrolled_mesh) {

         this.scrolled_section = scrolled_mesh;
         this.scrolled_section.SetName(`ScrolledSection[${this.mesh_bufferidx}]`)
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

      // if (this.scrolled_section.listeners === null) {
      //    this.scrolled_section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, FAKE_LISTEN_EVENT);
      // }






      /********************************************************************************************************************************************/
      // Scroll Bar

      const bar_dim = [10, dim[1] - pad[1]];
      const bar_pos = [this.geom.dim[0] * 2 - pad[0] * 2 - marg * 2, marg[1] * 2, pos[2] + 1];

      const bar = Create_rect_mesh(_, bar_pos, bar_dim, BLACK, _, _, _, _, is_debug_mesh);
      bar.type |= MESH_TYPE.WIDGET_SCROLLER_BAR;
      bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // bar.StylesSetMargin(marg);
      // bar.StylesSetPad([10,10]);
      bar.SetStyle([0, 3, 1]);
      bar.SetName(`ScrollBar[${this.mesh_bufferidx}]`);

      // bar.geom.pos[0] = this.geom.dim[0] * 2 - bar.geom.dim[0] - pad[0]*2 - bar.StylesGetPad(STYLES.AXIS.X)*2;
      // bar.geom.pos[0] = this.geom.dim[0] * 2 - bar.geom.dim[0] - pad[0] * 2 - marg[0] * 2;
      // bar.geom.pos[0] = this.geom.dim[0] * 2 - bar.geom.dim[0] - pad[0] - marg[0] * 2;
      bar.geom.pos[0] = this.geom.dim[0] * 2 - bar.geom.dim[0] - pad[0] - marg[0];
      bar.geom.pos[1] = pad[1];


      /********************************************************************************************************************************************/
      // Scroll Handle

      const handleMetrics = this.#CalculateHandleArea(bar.geom.pos, bar.geom.dim, marg)
      const handle = Create_rect_mesh(_, [0, 0, bar_pos[2] + 1], handleMetrics.dim, BLUEL[4], _, _, _, _, is_debug_mesh);
      handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      handle.SetStyle([0, 3, 1.6]);
      handle.SetName(`Scroll handle[${this.mesh_bufferidx}]`);
      handle.StylesSetMargin(marg);
      // handle.StylesSetPad([10,10]);
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

      this.SetName(`Scroller[${this.mesh_bufferidx}]`);

      bar.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      handle.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   }




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






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


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


   AddToWidgetRootBuffer(root_bufferidx, ROOT_WIDGET_FLAGS) {
      // alert('88712')
      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      this.scroll_bar.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.scroll_bar.root_bufferidx, this.scroll_bar.mesh_bufferidx);

      const handle = this.scroll_bar.children.buffer[0];
      handle.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(handle.root_bufferidx, handle.mesh_bufferidx);

      this.scrolled_section.AddToWidgetRootBuffer(root_bufferidx);

   }


   SetGfxEnableAttributes(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgetScroller')
   }


   /** Must run for every mesh */
   GfxUniformsEnable(flags, name, type, shader_flags) {

      super.EnableGfxUniforms(flags, name, type, shader_flags);

      this.scroll_bar.EnableGfxUniforms(flags, name, type, shader_flags);

      const handle = this.scroll_bar.children.buffer[0];
      handle.EnableGfxUniforms(flags, name, type, shader_flags);

      this.scrolled_section.GfxUniformsEnable(flags, name, type, shader_flags)

   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);


      /**
       * # UNIF PARAMS UPDATE ISSUE
       * 
       * Only for 'u_wposxy' uniform.
       * 
       * We want to create the link between the unif wpos of all the vertex buffers the scroller widget uses
       * with the uniforms callback parameter which is the 'root_posidx'.
       * 
       * // IMPORTANT:
       * The 'GfxUniformsSetClbk()' should be a generic function, handling all uniform connections.
       * The problem is with the need to pass different parameters for the update uniforms callback function, 
       * when a widget root uses more than on vertex buffers to render all of its meshes.
       * The solution for setting the parameters for the uniform 'u_wposxy' is implemented below.
       * The question then becomes what happens if we need to update other uniforms in the smae way????
       * 
       * // FIXME: We need to reimplement the whole concept of the parameters of the uniform callback update
       */
      if (unif_name === 'u_wposxy') {

         // Call for each root mesh in every vertex buffer
         const root_meshes = Widget_root_set_uniform_callback_per_gfx_root_mesh(this.root_bufferidx, unif_name, Clbk, clbk_params);
         const len = root_meshes.length;
         for (let i = 1; i < len; i++) {

            const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshes[i]);
            root_mesh.SetClbkGfxUniforms(unif_name, Clbk, root_mesh.root_posidx);

         }
      }

   }


   GfxCtxSetFlag(FLAGS, gfx_ctx_parent) {

      if (!this.gfx_ctx_parent) {
         this.gfx_ctx_flags = FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;

         this.scroll_bar.GfxCtxSetFlag(FLAGS, gfx_ctx_parent);

         this.scrolled_section.GfxCtxSetFlag(FLAGS, gfx_ctx_parent)
      }

   }





   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   // For scrollers we always create a separate vertex buffer, so it will be easier to handle the clipping of the scrolled section
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);


      const rect_vb_groupidx = this.gfx.vb.groupidx; // Copy the gfx from the scroller area.

      // Use the same gfx buffer for bar mesh
      this.scroll_bar.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, this.scroll_bar, rect_vb_groupidx);

      // Use the same gfx buffer for handle mesh
      const handle = this.scroll_bar.children.buffer[0];
      handle.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, handle, rect_vb_groupidx);

      this.is_scrolled_section_private = true; // HACK: This is just a Temp, move it.

      // Render the scrolled section and all it's meshes to it's own separate gfx buffer
      if (this.scrolled_section.gfx_ctx_flags) {
         this.scrolled_section.gfx = Gfx_generate_context(this.scrolled_section.gfx_ctx_flags, this.scrolled_section);
      }
      else if (this.is_scrolled_section_private) {
         this.scrolled_section.gfx = Gfx_generate_context(GFX_CTX_FLAGS.NEW, this.scrolled_section);
      }
      else {
         this.scrolled_section.gfx = Gfx_generate_context(GFX_CTX_FLAGS.SPECIFIC, this.scrolled_section, rect_vb_groupidx);
      }

      const scrolled_section_vb_groupidx = this.scrolled_section.gfx.vb.groupidx;
      for (let i = 0; i <= this.scrolled_section.children.boundary; i++) {
         const child = this.scrolled_section.children.buffer[i];
         if (child) {
            console.log('GenGfx', child.GetName(), child.gfx_ctx_flags)
            if (child.gfx_ctx_flags)
               child.GenGfxCtx(child.gfx_ctx_flags, INT_NULL);
            else
               child.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, scrolled_section_vb_groupidx);
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

      // View_reset_from_view_all_buffers(this.scrolled_section.group_bufferidxs[0]);

      // if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfxFromReset(); }
      if ((this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfxFromReset(); }

      // if (!this.scroll_bar.is_gfx_inserted && (this.scroll_bar.state.mask & MESH_STATE.ACTIVE)) { this.scroll_bar.AddToGfxFromReset(); }
      if ((this.scroll_bar.state.mask & MESH_STATE.ACTIVE)) { this.scroll_bar.AddToGfxFromReset(); }

      const handle = this.scroll_bar.children.buffer[0];
      // if (!handle.is_gfx_inserted && (handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfxFromReset(); }
      if ((handle.state.mask & MESH_STATE.ACTIVE)) { handle.AddToGfxFromReset(); }

      // if (!this.scrolled_section.is_gfx_inserted && (this.scrolled_section.state.mask & MESH_STATE.ACTIVE)) { this.scrolled_section.Render(); }
      if ((this.scrolled_section.state.mask & MESH_STATE.ACTIVE)) { this.scrolled_section.Render(); }

      for (let i = 0; i <= this.scrolled_section.children.boundary; i++) {

         const child = this.scrolled_section.children.buffer[i];
         if (child && child.state.mask & MESH_STATE.ACTIVE) {

            child.Rerender()
            // console.log(child.GetName())
         }

      }
   }


   SetScissorBox() {

      // Enable scissoring
      const vb = Vertex_buffer_group_get_byidx(this.gfx.vb.groupidx);
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
         const vb_text = Vertex_buffer_group_get_byidx(textgfx.vb.groupidx);
         /**DEBUG */ if (!vb_text) alert('SetScissorBox() in Scroller cannot resolve vertex buffer for text');
         vb_text.EnableScissorBox();
         vb_text.SetScissorBox(scissorbox);
      }
      else
         console.log('{}{}{}{}}}{}{}} TEXT BUFFER NNOT FOUND')
   }


   SetScrolledSectionToSeparateGfxBuffers() {
      if (this.scrolled_section.is_gfx_inserted) alert('Trying to set scrolled section to private buffers though the scrolled section is already added to the gfx buffers');
      this.is_scrolled_section_private = true;
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
      const bar = this.scroll_bar;
      // const handle = bar.children.buffer[0];
      const scrolled_section = this.scrolled_section;


      /****************************************************************************/
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

         // Construct for bar
         if (bar.listeners && bar.listeners.buffer[E.H] === INT_NULL) {
            bar.AddListenEvent(E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (bar.listeners && bar.listeners.buffer[E.C] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            bar.AddListenEvent(E.C, mesh.OnClick, evt_params);
         }

      }

   }


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
            const idx = TimeIntervalsCreate(10, 'ResizeXY Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, { mesh: mesh, mouse_click: point });
            mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
         }
         else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
            console.log('X RESIZE');
         }
         else { // Its a height resize
            console.log('Y RESIZE');
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

            if (point[1] < bar_pos[1] || point[1] > bar_pos[1] + bar.geom.dim[1] * 2) return

            grabbed_point = point[1];


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

      const scroller = params.params.mesh;
      // const mouse_click = params.params.mouse_click;

      // NOTE: We use the same element of the mesh's interval buffer for the resize event as the move event, they cannot both exist at the same time. 
      if (scroller.StateCheck(MESH_STATE.IN_GRAB) === 0 && scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         scroller.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

         return;
      }

      const mouse_click = MouseGetPos();
      const bar = scroller.scroll_bar;
      const handle = bar.children.buffer[0];

      // Set min dimentions. // TODO: Who decides for the minimum dimentions??????
      const scroller_pos = scroller.GetPosXY();
      const scroller_pad = scroller.StylesGetPad();
      const handle_pad = handle.StylesGetPad(STYLES.AXIS.X);

      // console.log('From Resize', scroller.scrolled_section.geom.dim)

      const scroller_width = scroller.scrolled_section.geom.dim[0] + bar.geom.dim[0] + scroller_pad[0];
      const min_sizex = scroller_pos[0] + scroller_width * 2 + scroller_pad[0] * 2
      const min_sizey = scroller_pos[1] + 80;
      let changes_hapened = false;


      /*********************************************************************************************************/
      // 
      if (mouse_click[0] > min_sizex) {

         const sizex = (mouse_click[0] - scroller_pos[0]) / 2;

         scroller.geom.dim[0] = sizex;

         // Bar
         bar.geom.pos[0] = scroller.geom.dim[0] * 2 - bar.geom.dim[0] - scroller_pad[0] * 2;

         // Handle
         handle.geom.pos[0] = bar.geom.pos[0] + handle_pad;

         changes_hapened = true;
      }
      else { // Avoid not being resized if the mouse jumped a big size chumk

         scroller.geom.dim[0] = scroller_width + scroller_pad[0];

         bar.geom.pos[0] = scroller.geom.dim[0] * 2 - bar.geom.dim[0] - scroller_pad[0] * 2;

         handle.geom.pos[0] = bar.geom.pos[0] + handle_pad;
         changes_hapened = true;
      }

      /*********************************************************************************************************/
      // Calculate the handles size in relation with the resized scroller
      if (mouse_click[1] > min_sizey) {

         const sizey = (mouse_click[1] - scroller_pos[1]) / 2;


         scroller.geom.dim[1] = sizey;

         bar.geom.dim[1] = scroller.geom.dim[1] - scroller_pad[1];

         
         // Set handles size
         Scroller_calc_handle_pos_dim_no_gfx_update(scroller);
         { // Abstruucted by fuuunction call         
            // const clean_bar_height = bar.geom.dim[1]

            // const clean_size = scroller.geom.dim[1] - scroller_pad[1];
            // const a = (clean_size * clean_size) / scroller.scrolled_section.geom.dim[1];
            // if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad;
            // else handle.geom.dim[1] = clean_bar_height - handle_pad;

            // const handle_bot = handle.geom.pos[1] + handle.geom.dim[1] * 2

            // // Set handles poosition
            // if (handle.geom.pos[1] <= bar.geom.pos[1] + scroller_pad[1] + handle_pad) {
            //    handle.geom.pos[1] = scroller.geom.pos[1] + scroller_pad[1] + handle_pad;
            // }
            // else if (handle_bot >= bar.geom.pos[1] + bar.geom.dim[1] * 2 - handle_pad) {
            //    handle.geom.pos[1] = scroller.geom.pos[1] + (bar.geom.dim[1] * 2) - (handle.geom.dim[1] * 2) + handle_pad;
            // }
         }


         Update_scrolled_section_pos_by_uniform(scroller)
         { // Move scrolled section
            // const val = Calculate_handle_position_ratio(bar, handle); // Calculate slider's value based on the handles position.

            // const scrolled_section = scroller.scrolled_section;
            // const scroller_top = scroller.GetPosY();
            // const scrolled_posy = scrolled_section.GetPosY();


            // // Calculate the ratio of the scrolled section height to that of the scrollers
            // const move_ratio = ((scrolled_section.geom.dim[1] * 2) - ((scroller.geom.dim[1] * 2)));

            // // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's scroller_pos because it changes).
            // const posy = (move_ratio * -val) + scroller_top;
            // const ydif = (posy - scrolled_posy) + scroller_pad[1]; // Add the scroller scroller_pad to the scrolled_section position



            // // Add the move difference to all vb's root positions.
            // Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, ydif);
         }



         changes_hapened = true;
      }


      if (changes_hapened) {
         console.warn('The Resize of the scroller is reseting all meshes from the root. \nMake sure the root is the scroller, OR else find a solution in rerendering only the scroller mesh.')

         // View_reset_from_view_all_buffers(scroller.scrolled_section.group_bufferidxs[0]);
         Widget_root_reset_gfx(scroller.root_bufferidx)

         // CLIP FROM GROUP
         // if (scroller.scrolled_section.group_bufferidxs[0] !== INT_NULL) {

         //    const clip_top = scroller.GetPosY();
         //    const clip_bottom = clip_top + scroller.geom.dim[1] * 2;
         //    const clip_left = scroller.geom.scroller_pos[0] - scroller.geom.dim[0];
         //    const clip_right = scroller.geom.scroller_pos[0] + scroller.geom.dim[0] - (scroller.StylesGetMargin(STYLES.AXIS.X) + bar.geom.dim[0] * 2);

         //    Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
         // }

         // CLIP uneccessary meshes
         const clip_top = scroller.GetPosY();
         const clip_bottom = clip_top + scroller.geom.dim[1] * 2;
         Clipy_from_tree_recursive(scroller.scrolled_section, clip_top, clip_bottom);


         // View_rerender_from_view_all_buffers(scroller.scrolled_section.group_bufferidxs[0], false);
         // View_render_from_view_all_buffers(scroller.scrolled_section.group_bufferidxs[0], true);
         Widget_root_rerender(scroller.root_bufferidx);
      }
   }


   Move(x, y) {
      if (x === 0 && y === 0) return;

      // HERE: We need a way to get the unif idx by name: 'u_wposxy' 
      Mesh_unif_add_vb_root_wpos(this.root_posidx, x, y);

   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;

      this.scroll_bar.geom.pos[0] += x;
      this.scroll_bar.geom.pos[1] += y;

      const handle = this.scroll_bar.children.buffer[0];
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

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update them as offsets 

         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
         this.scroll_bar.geom.pos[0] = x;
         this.scroll_bar.geom.pos[1] = y;
         const handle = this.scroll_bar.children.buffer[0];
         handle.geom.pos[0] = x;
         handle.geom.pos[1] = y;
         this.scrolled_section.SetPosXYNoGfxUpdate(x, y);

      }
   }


   SetPosXNoGfxUpdate(x) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update them as offsets 

         this.geom.pos[0] = x;
      }
   }


   SetPosYNoGfxUpdate(y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update them as offsets 

         this.geom.pos[1] = y;
         // this.scroll_bar.geom.pos[1] = y;
         // const handle = this.scroll_bar.children.buffer[0];
         // handle.geom.pos[1] = y;
         // this.scrolled_section.SetPosYNoGfxUpdate(y);

      }
   }


   TEMP_recalc(x, y) {

      const dx = x - this.geom.pos[0];
      const dy = y - this.geom.pos[1];

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;

      this.scroll_bar.geom.pos[0] += dx;
      this.scroll_bar.geom.pos[1] += dy;

      const handle = this.scroll_bar.children.buffer[0];
      handle.geom.pos[0] += dx;
      handle.geom.pos[1] += dy;

      this.scrolled_section.MoveNoGfxUpdate(dx, dy);

   }


   SetColorAlpha(alpha) {

      console.error('implement me\nSEE console error')
      alert('implement me\nSEE console error')

   }








   /*******************************************************************************************************************************************************/
   // Private Methods 
   /*******************************************************************************************************************************************************/

   #CalculateHandleArea(_pos, _dim, pad) {

      const dim = [_dim[0] - (pad[0] * 2), 0];
      const pos = [_pos[0], _pos[1] + pad[1] * 2, _pos[2] + 1]; // Pos does not need to change for positioning in the center.

      return {
         pos: pos,
         dim, dim,
      };
   }


   #RecalculateWidth(scrolled_section_width) {

      const new_width = scrolled_section_width + this.scroll_bar.geom.dim[0] + this.StylesGetPad(STYLES.AXIS.X) * 2;
      this.SetDim([new_width, UNCHANGED]);
   }


   // Reposition scroller arround the scrolled_section
   #Reposition() {

      const x = this.scrolled_section.geom.pos[0] + this.scrolled_section.geom.dim[0] + (this.scroll_bar.geom.dim[0])
      this.scroll_bar.SetPosX(x);
      const handle = this.scroll_bar.children.buffer[0];
      handle.SetPosX(x);

   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   AddItemToScrolledSection(mesh) {

      /**DEBUG*/if (ERROR_NULL(mesh)) { console.error('AddItemToScrolledSection(), the mesh to be added is null or undefined'); return; }

      this.scrolled_section.AddItem(mesh);

      const size = this.scrolled_section.Recalc();
      if (size[0] > this.geom.dim[0]) {
         this.#RecalculateWidth(size[0]);
      }
      this.#Reposition();

      // Set scroller's y pos
      this.geom.pos[1] = (this.scrolled_section.geom.pos[1] - this.scrolled_section.geom.dim[1]) + this.geom.dim[1] + this.StylesGetPad(STYLES.AXIS.Y);

      // Set the bar and handle y pos
      this.scroll_bar.SetPosY(this.geom.pos[1]);
      const handle = this.scroll_bar.children.buffer[0];
      handle.SetPosY(this.geom.pos[1]);

      // return SCROLL_MESH_IDX;
   }


   ScrollerAlignWithItemsRecalc() {

      this.scrolled_section.options |= SECTION.RESIZE_PARENT; // For the scrolled section to encapsulate all items.
      this.options |= SECTION.RESIZE_PARENTX;
      this.scrolled_section.Recalc_no_gfx_update();

      const bar = this.scroll_bar;
      const handle = bar.children.buffer[0];

      const scoller_pad = this.StylesGetPad();
      const scrolled_section_pad = this.scrolled_section.StylesGetPad(STYLES.AXIS.Y);
      const handle_pad = handle.StylesGetPad()

      this.scrolled_section.SetPosXYNoGfxUpdate(this.geom.pos[0] + scoller_pad[0], this.geom.pos[1] + scoller_pad[1]);


      this.geom.dim[0] = this.scrolled_section.geom.dim[0] + bar.geom.dim[0] + scoller_pad[0] + scrolled_section_pad;

      bar.geom.pos[0] = (this.geom.pos[0] + this.geom.dim[0] * 2) - (scoller_pad[0] + bar.geom.dim[0] * 2)
      bar.geom.pos[1] = (this.geom.pos[1] + scoller_pad[1])

      // Calculate handle dimention to the ratio of the scroller/scrolled_section
      const ratio = this.geom.dim[1] / this.scrolled_section.geom.dim[1];
      const h = (ratio * this.geom.dim[1] >= this.geom.dim[1]) ? bar.geom.dim[1] - handle_pad[1] : ratio * this.geom.dim[1];
      handle.geom.dim[1] = h;
      handle.geom.pos[0] = bar.geom.pos[0] + handle_pad[0];
      handle.geom.pos[1] = bar.geom.pos[1] + handle_pad[1];


   }


   ScrollerAlignBar() {

      const bar = this.scroll_bar;
      const handle = bar.children.buffer[0];

      const scoller_pad = this.StylesGetPad();
      const scrolled_section_pad = this.scrolled_section.StylesGetPad(STYLES.AXIS.Y);
      const handle_pad = handle.StylesGetPad()

      // this.scrolled_section.SetPosXYNoGfxUpdate(this.geom.pos[0] + scoller_pad[0], this.geom.pos[1] + scoller_pad[1]);
      // this.scrolled_section.SetPosXYNoGfxUpdate(this.geom.pos[0] + scoller_pad[0], this.geom.pos[1] + scoller_pad[1]);


      this.geom.dim[0] = this.scrolled_section.geom.dim[0] + bar.geom.dim[0] + scoller_pad[0] + scrolled_section_pad;

      bar.geom.pos[0] = (this.geom.pos[0] + this.geom.dim[0] * 2) - (scoller_pad[0] + bar.geom.dim[0] * 2)
      bar.geom.pos[1] = (this.geom.pos[1] + scoller_pad[1])

      // Calculate handle dimention to the ratio of the scroller/scrolled_section
      const ratio = this.geom.dim[1] / this.scrolled_section.geom.dim[1];
      const h = (ratio * this.geom.dim[1] * 2 >= this.geom.dim[1] * 2) ? bar.geom.dim[1] + handle_pad[1] : ratio * this.geom.dim[1] + handle_pad[1];
      handle.geom.dim[1] = h;
      handle.geom.pos[0] = bar.geom.pos[0] + handle_pad[0];
      
      // Scroller_calc_handle_pos_dim(this);
      Scroller_calc_handle_pos_dim_no_gfx_update(this);
      // handle.geom.pos[1] = handleypos;


      Update_scrolled_section_pos_by_uniform(this);
      // const scrolled_section = this.scrolled_section;
      // const scroller_top = this.GetPosY();
      // const scrolled_posy = scrolled_section.GetPosY();
      // // Calculate the ratio of the scrolled section height to that of the scrollers
      // const move_ratio = ((scrolled_section.geom.dim[1] * 2) - ((this.geom.dim[1] * 2)));

      // const val = Calculate_handle_position_ratio(bar, handle); // Calculate slider's value based on the handles position.
      // // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
      // const posy = (move_ratio * -val) + scroller_top;
      // const ydif = (posy - scrolled_posy) + scoller_pad[1]; // Add the scroller pad to the scrolled_section position

      // // Add the move difference to all vb's root positions.
      // Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, ydif);

   }
}














export function Scroller_calc_handle_pos_dim(scroller) {

   const bar = scroller.scroll_bar;
   const handle = bar.children.buffer[0];

   // Set min dimentions. // TODO: Who decides for the minimum dimentions??????
   const pad = scroller.StylesGetPad();
   const handle_pad = handle.StylesGetPad(STYLES.AXIS.X)
   const clean_bar_height = bar.geom.dim[1]


   // Handle
   // Set handles size
   const clean_size = scroller.geom.dim[1] - pad[1];
   const a = (clean_size * clean_size) / scroller.scrolled_section.geom.dim[1];


   if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad;
   else handle.geom.dim[1] = clean_bar_height - handle_pad;


   const handle_bot = handle.geom.pos[1] + handle.geom.dim[1] * 2

   // Correct handles position to the new scoller/bar size
   if (handle.geom.pos[1] <= bar.geom.pos[1] + pad[1] + handle_pad) {
      handle.geom.pos[1] = scroller.geom.pos[1] + pad[1] + handle_pad;
   }
   else if (handle_bot >= bar.geom.pos[1] + bar.geom.dim[1] * 2 - handle_pad) {
      handle.geom.pos[1] = scroller.geom.pos[1] + (bar.geom.dim[1] * 2) - (handle.geom.dim[1] * 2) + handle_pad;
   }

   Gl_set_dim_y(handle.gfx, handle.geom.dim[1], 1);
   Gl_set_wpos_y(handle.gfx, handle.geom.pos[1], 1);

} 



function Scroller_calc_handle_pos_dim_no_gfx_update(scroller) {

   const bar = scroller.scroll_bar;
   const handle = bar.children.buffer[0];

   const scroller_pad = scroller.StylesGetPad(STYLES.AXIS.Y)
   const handle_pad = handle.StylesGetPad(STYLES.AXIS.Y)
   const clean_bar_height = bar.geom.dim[1]
   
   const clean_size = scroller.geom.dim[1] - scroller_pad;
   const a = (clean_size * clean_size) / scroller.scrolled_section.geom.dim[1];
   if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad;
   else handle.geom.dim[1] = clean_bar_height - handle_pad;

   const handle_bot = handle.geom.pos[1] + handle.geom.dim[1] * 2

   // Set handles poosition
   if (handle.geom.pos[1] <= bar.geom.pos[1] + scroller_pad + handle_pad) {
      handle.geom.pos[1] = scroller.geom.pos[1] + scroller_pad + handle_pad;
   }
   else if (handle_bot >= bar.geom.pos[1] + bar.geom.dim[1] * 2 - handle_pad) {
      handle.geom.pos[1] = (scroller.geom.pos[1] + (bar.geom.dim[1] * 2)) - (handle.geom.dim[1]*2 + handle_pad);
   }

}



function Update_scrolled_section_pos_by_uniform(scroller) {


   const scrolled_section = scroller.scrolled_section;
   const scroller_top = scroller.GetPosY();
   const scrolled_posy = scrolled_section.GetPosY();

   const bar = scroller.scroll_bar;
   const handle = bar.children.buffer[0];

   // Calculate the ratio of the scrolled section height to that of the scrollers
   const move_ratio = ((scrolled_section.geom.dim[1] * 2) - ((scroller.geom.dim[1] * 2)));

   const val = Calculate_handle_position_ratio(bar, handle); // Calculate slider's value based on the handles position.

   // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
   const posy = (move_ratio * -val) + scroller_top;

   /**
    * This is a ratio  for -1 to 1 of the conttribution of the addition of the scroller pad. 
    * We want to add or subtract the scroller pad from the scrolled position relative to the position of the scrolled section to the scroller.
    * We add the positive pad half way up by the ammount of 0 to 1
    * and we add(subtract) the pad half way down by the amount 0 to -1
    */
   const pad_ratio = (val * 2 - 1);

   const ydif = (posy - scrolled_posy) + scroller.StylesGetPad(STYLES.AXIS.Y) * -pad_ratio;

   // Add the move difference to all vb's root positions.
   Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, ydif);
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



/**
 * // FIXME: Scroller ISSUE of scroll handle getting stuck at the bottom of the bar
 * This is NOT occuring when the mouse grabs the handle at a low point.
 * So it has to do with the difference of the mouse pointer and the handle with the bar-bottom
 */
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
   // TODO: Implement the above. return if the above is valid



   Scroller_move_handle(bar, handle);

   Update_scrolled_section_pos_by_uniform(scroller)

   const scrolled_section = scroller.scrolled_section;
   const scroller_top = scroller.GetPosY();
   const clip_top = scroller_top, clip_bottom = (scroller_top) + scroller.geom.dim[1] * 2;
   const changes_hapened = Clipy_from_tree_recursive(scrolled_section, clip_top, clip_bottom);


   View_reset_from_view_all_buffers(scrolled_section.group_bufferidxs[0]);
   // Widget_root_reset_gfx(scroller.root_bufferidx);


   View_rerender_from_view_all_buffers(scrolled_section.group_bufferidxs[0], true);
   // Widget_root_rerender(scroller.root_bufferidx);



   /**FOR FRAMEBUFFER. DO NOT DELETE */
   // if(scrolled_section.isFramebufferRendered !== INT_NULL){
   //    // const r = scroller.geom.dim[1] / scrolled_section.geom.dim[1]
   //    const r = (scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1] / scroller.scroll_bar.geom.dim[1]) /1000
   //    // const r = scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1]/(scrolled_section.geom.dim[1] * scroller.scroll_bar.geom.dim[1]) 
   //    // const r = (scroller.scroll_bar.children.buffer[SCROLL_BAR_IDX].geom.dim[1]/(scrolled_section.geom.dim[1]) )/100
   //    Framebuffer_moveY(scrolled_section.isFramebufferRendered, ydif, r)
   // }


}





let grabbed_point = 0;

/*******************************************************************************************************************************************************/
// Scroller Functionality 

function Scroller_move_handle(bar, handle) {

   const handle_marg = handle.StylesGetMargin(STYLES.AXIS.Y);

   const y = -MouseGetPosDif().y;

   if (y === 0) return;

   const bar_length = bar.geom.dim[1] * 2 * bar.geom.num_faces;
   if (handle.geom.pos[1] - handle_marg * 2 + y >= bar.geom.pos[1] &&
      handle.geom.pos[1] + handle.geom.dim[1] * 2 + handle_marg * 2 + y <= bar.geom.pos[1] + bar_length) {
      handle.geom.pos[1] += y;
      handle.geom.MoveY(y, handle.gfx);
   }
   // else {
   //    if (handle.geom.pos[1] - handle_marg * 2 + y < bar.geom.pos[1]) {

   //       handle.geom.pos[1] = bar.geom.pos[1] + handle.StylesGetPad(STYLES.AXIS.Y);
   //       handle.geom.SetPosY(handle.geom.pos[1], handle.gfx);
   //    }
   //    else if (handle.geom.pos[1] + handle.geom.dim[1] * 2 + handle_marg * 2 + y <= bar.geom.pos[1] + bar_length) {

   //       handle.geom.pos[1] = (bar.geom.pos[1] + bar.geom.dim[1] * 2) - handle.geom.dim[1] * 2 + handle.StylesGetPad(STYLES.AXIS.Y);
   //       handle.geom.SetPosY(handle.geom.pos[1], handle.gfx);
   //    }
   // }
}



function Calculate_handle_position_ratio(bar, handle) {

   const handle_pad = handle.StylesGetMargin(STYLES.AXIS.Y);

   const handletop = handle.geom.pos[1] - handle_pad; // Must add the pad for correct align of top-scroller with top-scrolled

   const bartop = bar.geom.pos[1];

   const dim_dif = (bar.geom.dim[1] * 2) - (handle.geom.dim[1] * 2 + handle_pad * 4);

   const pos_dif = handletop - bartop;


   // Interpolate to a 0-1 value.
   const ratio = (pos_dif <= handle_pad * 2) ? 0 : (pos_dif / dim_dif < 1) ? pos_dif / dim_dif : 1;
   return ratio;
}

