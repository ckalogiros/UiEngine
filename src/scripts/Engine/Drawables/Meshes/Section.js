"use strict";

import { CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Rect } from "./Rect_Mesh.js";
import { Widget_root_create_root, Widget_root_batch_move_from_batch_buffer } from "../../Core/MeshBuffer.js";
import { Batch_store } from "../../Batch/Batch.js";
import { Relative_pos_comp_recalc_all } from "../Operations/RelativePosComponent.js";
import { View_rerender_from_view_all_buffers, View_reset_from_view_all_buffers } from "../../Core/MeshBufferViews.js";
import { Gl_set_dim_XY, Gl_set_wpos_XY } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Clampx_from_group, Clipy_from_group } from "../Operations/Clip.js";
import { New_generic_buffer } from "../../Core/Buffers.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";


const temp_parent_listeners = New_generic_buffer();
// temp_parent_listeners.Add(INT_NULL);
temp_parent_listeners.Add(INT_NULL);
temp_parent_listeners.Add(INT_NULL);



export class Section extends Rect {

   options;  // BIT-FIELD. Stores some state for 'this'.
   margin;   // [1,1] Stores the x-y margins
   pad;  // [1,1] Stores pad for the meshes in-between space.
   max_size; // [1,1] Stores the max x-y size of all children meshes (not accumulative).
   clampy; // Array: [x,y:[top,bottom,threshold]] clamp values. The threshold is a float, which added to the clamp value gives the absolute limit above/below to which a mesh should/should't be rendered 
   total_margin;



   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), margin = [4, 4], pos = [200, 400, 0], dim = [40, 40], col = TRANSPARENCY(BLUE, .6), name = 'SECTION UNAMED', style = [0, 3.5, 2.], is_debug_mesh) {

      super(pos, dim, col, is_debug_mesh);

      this.mesh_bufferidx = mesh_bufferidx;
      this.total_margin = [0, 0];
      this.options = options;
      this.pad = [0, 0];
      // this.margin = margin;
      this.StylesSetMargin(margin);
      this.StylesSetMargin(margin);
      this.max_size = [0, 0];


      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);



      this.clampy = { // UNNECESSARY??

         first: INT_NULL,
         top: INT_NULL,
         bottom: INT_NULL,
         last: INT_NULL,
         firstidx: INT_NULL,
         topidx: INT_NULL,
         bottomidx: INT_NULL,
         lastidx: INT_NULL,
         chunk_size: INT_NULL,
      }

      this.type |= MESH_TYPE.SECTION_MESH;
      // In order to provide more info about the current section mesh. The 'SECTION_MESH_ONLY' could be disabled by another widget that 
      // extends section class, in order to call it's classes methods instead of the mother class(the Section)
      this.type |= MESH_TYPE.SECTION_MESH_ONLY;

      this.SetName(`[${this.mesh_bufferidx}]{${name}}-SECTION`);

      this.SetStyle(style);


      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);
      }
   }


   Destroy() {

      // Any children destruction
      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) {
            const shift_children = child.Destroy(child);
            if (shift_children) i--;
         }
      }

      // section's destruction
      return super.Destroy();
   }


   AddItem(mesh, options) {

      this.options |= options;

      // SID.InheritUniform(mesh.sid.unif, this.sid.unif); // Inherits the parent's uniform flags

      const idx = this.AddChild(mesh);

      if (this.root_bufferidx !== INT_NULL && mesh.root_bufferidx === INT_NULL) {
         mesh.AddToWidgetRootBuffer(this.root_bufferidx)
      }

      mesh.isFramebufferRendered = this.isFramebufferRendered;

      mesh.StateEnable(this.state.mask & MESH_STATE.ACTIVE);

      // UNNECESSARY: the calc rearanges all items
      if (mesh.type & MESH_TYPE.SECTION_MESH) { // Handle other sections

         if (options & SECTION.FIT) {

            // TODO: implement
         }
         else if (options & SECTION.ITEM_FIT) {
            CopyArr2(mesh.geom.pos, this.geom.pos);
         }
      }
      else { // Handle Items 
         // TODO: implement
      }

      mesh.idx = idx;

      return idx;
   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         this.children.buffer[i].Activate();
      }
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         this.children.buffer[i].Deactivate();
      }
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
      for (let i = 0; i <= this.children.boundary; i++) {
         this.children.buffer[i].StateEnable(MASK);
      }
   }


   StateDisable(MASK = 0x0) {


      this.state.mask &= ~MASK;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (!this.children.buffer[i]) console.error('child missisng. this:', this.GetName(), 'children', this.children)
         this.children.buffer[i].StateDisable(MASK);
      }
   }


   Calc(options = _, target_child_idx) {

      const section = this;
      if (options === _) options = section.options


      const old_sizex = section.geom.dim[0];
      const old_sizey = section.geom.dim[1];


      Calculate_sizes_recursive(section, options, target_child_idx);

      // UNNECESSARY: we handle this at: if(options & SECTION.RESIZE_PARENT)
      if (section.type & MESH_TYPE.WIDGET_SCROLLER) {
         section.geom.dim[0] = section.max_size[0]; // For scroller widgets, do not set the height
         section.geom.defDim[0] = section.max_size[0];
      }
      if (section.type & MESH_TYPE.WIDGET_DROP_DOWN) {
         CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         // CopyArr2(section.geom.defDim, section.max_size); // Set size for the root.
      }
      else {
         if(options & SECTION.RESIZE_PARENT) CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         // CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         // CopyArr2(section.geom.defDim, section.max_size); // Set size for the root.
      }


      /** OPTIONS:EXPAND 
       * Expand width of items to match the max width of section, minus the margin.
       * Happens on a second pass of all items of current section, since each section may have different options for expand.
       * Only if the section has VERTICAL align for its items. 
       */
      if (options & SECTION.EXPAND) {
         Expand(section, options, section.max_size[0], 0);
      }


      // Calculate the parent section's position, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      // Add the parent's new size offset, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      if ((options & SECTION.TOP_DOWN) && (options & SECTION.RESIZE_PARENT)) {
         section.geom.pos[0] += (section.max_size[0] - old_sizex) + section.StylesGetMargin(STYLES.AXIS.X);
         section.geom.pos[1] += (section.max_size[1] - old_sizey) + section.StylesGetMargin(STYLES.AXIS.Y);
      }


      section.SetMargin();

      Calculate_positions_recursive(section, options);


      // Update for the root
      section.batch_fnidx = BATCH_FN_IDX.SET_POS2; // HACK
      const update_data = {
         sizes: [2],
         data: [section.geom.dim[0], section.geom.dim[1]],
      };
      Batch_store(section, SHADER_ATTRIBUTES.POS2, update_data, _);

      return section.max_size;

   }


   Calc_no_gfx_update(options, target_child_idx) {
      // console.log('\n{=============================}');

      const section = this;
      if (options === _) options = section.options; // Here set as options: the passed options(de-activates any mesh self-set-options), or the mesh self-options


      const old_sizex = section.geom.dim[0];
      const old_sizey = section.geom.dim[1];

      Calculate_sizes_recursive(section, options, target_child_idx);


      if (section.type & MESH_TYPE.WIDGET_SCROLLER) {
         section.geom.dim[0] = section.max_size[0]; // For scroller widgets, do not set the height
         section.geom.defDim[0] = section.max_size[0];
      }
      if (section.type & MESH_TYPE.WIDGET_DROP_DOWN) {
         CopyArr2(section.geom.dim, section.max_size); // Set size for the root dp.
         CopyArr2(section.geom.defDim, section.max_size); // Store to default for the root.
      }
      else {
         if(options & SECTION.RESIZE_PARENT) CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         // CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         // CopyArr2(section.geom.defDim, section.max_size); // Set size for the root.
      }

      /** OPTIONS:EXPAND 
       * Happens on a second pass of all items of current section, since each section may have different options for expand.
       * Expand width of items to match the max width of section, minus the margin.
       * Only if the section has VERTICAL align for its items. 
       */
      if (options & SECTION.EXPAND && (options & SECTION.RESIZE_PARENT)) {
         Expand(section, options, section.max_size[0], 0);
      }


      // Add the parent's new size offset, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      if ((options & SECTION.TOP_DOWN) && (options & SECTION.RESIZE_PARENT)) {
         section.geom.pos[0] += (section.max_size[0] - old_sizex) + section.StylesGetMargin(STYLES.AXIS.X);
         section.geom.pos[1] += (section.max_size[1] - old_sizey) + section.StylesGetMargin(STYLES.AXIS.Y);
      }
      
      // Update default position
      // CopyArr2(section.geom.defPos, section.geom.pos);
      
      if (options & SECTION.RESIZE_PARENT) 
      section.SetMargin();

      Calculate_positions_no_gfx_update_recursive(section, options);

      return section.max_size;

   }


   Recalc(options) {

      const section = this;

      this.Reset(section);
      return this.Calc(options);
   }


   Recalc_no_gfx_update(options, target_child_idx) {

      const section = this;

      this.Reset(section);
      return this.Calc_no_gfx_update(options, target_child_idx);
   }


   Reset(section) {

      for (let i = 0; i <= section.children.boundary; i++) {

         const mesh = section.children.buffer[i];
         if (mesh.children.active_count && mesh.type & MESH_TYPE.SECTION_MESH) {
            this.Reset(mesh);
         }
      }
      section.max_size[0] = 0;
      section.max_size[1] = 0;

   }



   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   // HACK: I need to pass an extra param from Menu_bar widget, so that its children are handled by its class(all that because Widget_Menu_Bar inherits from Section)
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx = null, params = null, run_for_children = true) {

      const gfx = super.GenGfxCtx(FLAGS, gfxidx, params);

      if (run_for_children) {
         for (let i = 0; i <= this.children.boundary; i++) {

            const child = this.children.buffer[i];
            if (child) child.GenGfxCtx(FLAGS, gfxidx, params);
         }
      }


      return gfx;
   }


   Render(run_for_children = true) {

      if (this.state.mask & MESH_STATE.ACTIVE) super.AddToGfx();

      if (run_for_children) {
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            child.Render();
         }
      }

   }


   Rerender(run_for_children = true) {

      super.AddToGfxFromReset();

      if (run_for_children) {
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child && (child.state.mask & MESH_STATE.ACTIVE)) {
               child.Rerender();
            }
         }
      }
   }


   DeactivateGfx() {

      super.DeactivateGfx();

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.DeactivateGfx();
      }
   }



   /*******************************************************************************************************************************************************/
   // Setters-Getters
   /*******************************************************************************************************************************************************/

   /** Return type: Array. Returns an array of all widgets meshes */
   GetAllMeshes(parent_meshes_buf) {

      let all_meshes = parent_meshes_buf ? parent_meshes_buf : [];
      all_meshes.push(this)

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) all_meshes = child.GetAllMeshes(all_meshes);
      }

      // return [this];
      return all_meshes;
   }


   SetMargin() {
      // this.geom.dim[0] += this.margin[0];
      // this.geom.dim[1] += this.margin[1];
      this.geom.dim[0] += this.StylesGetMargin(STYLES.AXIS.X);
      this.geom.dim[1] += this.StylesGetMargin(STYLES.AXIS.Y);
   }


   SetUpdateFrameBuffer() {
      if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {
            child.SetFrameBufferIdx(fbidx)
         }
      }
   }


   SetPosY(y) {

      super.SetPosY(y);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosY(y);
      }
   }


   SetPosXNoGfxUpdate(x) {
      this.geom.pos[0] = x;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosXNoGfxUpdate(x);
      }
   }


   SetPosYNoGfxUpdate(y) {
      this.geom.pos[1] = y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosYNoGfxUpdate(y);
      }
   }


   SetPosXYNoGfxUpdate(x, y) {
      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosXYNoGfxUpdate(x, y);
      }
   }



   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   OnClick(params) {

      const section = params.evt_params.target_mesh;

      STATE.mesh.SetClicked(section);

      if (section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const right = section.geom.pos[0] + section.geom.dim[0];
         const bottom = section.geom.pos[1] + section.geom.dim[1];

         const point = MouseGetPos();
         if (section.state.mask & MESH_STATE.IS_RESIZEABLE && (point[0] > right - TEMP_RESIZE_MARGIN[0] || point[1] > bottom - TEMP_RESIZE_MARGIN[1])) {

            // We have Resize

            if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
               // console.log('X Y RESIZE');

               const OnResizeFn = section.OnResize;
               const idx = TimeIntervalsCreate(10, 'ResizeXY Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, section);
               section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }
            else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
               // console.log('X RESIZE');
            }
            else { // Its a height resize
               // console.log('Y RESIZE');
            }

            section.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB;
            STATE.mesh.SetGrabed(section);

            return true;
         }


         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, Section_on_move_section, section);
         section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (section.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(section);
            section.StateEnable(MESH_STATE.IN_GRAB);
         }

      }

      return true;

   }


   OnResize(params) {

      const root = params.params;

      // NOTE: We use the same element of the mesh's interval buffer for the resize event as the move event, they cannot both exist at the same time. 
      if (root.StateCheck(MESH_STATE.IN_GRAB) === 0 && root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         root.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

         return;
      }

      const mouse_pos = MouseGetPosDif();

      console.log('IS_RESIZABLE:', root.state.mask & MESH_STATE.IS_RESIZEABLE)

      // TODO: We can set all positions and simentions and call 'Gl_set_pos_dim' for all meshes of the root
      if ((root.state.mask & MESH_STATE.IS_RESIZEABLE) && (mouse_pos.x !== 0 || mouse_pos.y !== 0)) {

         const x = mouse_pos.x / 2;
         const y = -mouse_pos.y / 2;

         // Check for min dimentions. // TODO: Who decides for the minimum dimentions??????
         // const min_width = root.geom.defDim[0];
         // const min_height = root.geom.defDim[1];
         const min_width = 0;
         const min_height = 0;

         let changes_hapened = false;

         if (x > POSSITIVE || (x < NEGATIVE && root.geom.dim[0] + x > min_width)) {

            root.geom.dim[0] += x;
            root.geom.pos[0] += x;
            changes_hapened = true;

         }


         if (y > POSSITIVE || (y < NEGATIVE && root.geom.dim[1] + y > min_height)) {

            root.geom.dim[1] += y;
            root.geom.pos[1] += y;
            changes_hapened = true;

         }


         if (changes_hapened) {

            // Deal with widgets that need resize on root(this) mesh resize

            // Menu bar
            if (root.children.buffer[0].type & MESH_TYPE.WIDGET_MENU_BAR) {
               root.children.buffer[0].Resize(x);
            }




            Gl_set_dim_XY(root.gfx, root.geom.dim, root.geom.num_faces)
            Gl_set_wpos_XY(root.gfx, root.geom.pos, root.geom.num_faces)

            View_reset_from_view_all_buffers(root.group_bufferidxs[0]);
            // Mesh_per_vb_remove_all_from_index(root.gfx.vb.idx, root.per_vb_bufferidx);

            const clip_top = root.geom.pos[1] - root.geom.dim[1];
            const clip_bottom = root.geom.pos[1] + root.geom.dim[1];
            const clip_left = root.geom.pos[0] - root.geom.dim[0];
            const clip_right = root.geom.pos[0] + root.geom.dim[0];
            // console.log('clip_right ', clip_right);

            Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
            // Clampy_from_group(root.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom)

            Clampx_from_group(root.group_bufferidxs[0], 0, clip_right);
            // Clipx_from_group(root.group_bufferidxs[0], 0, clip_right);

            View_rerender_from_view_all_buffers(root.group_bufferidxs[0], false);
         }


      }

   }



   ConstructListeners(parent_listeners = null, _Clbk = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 

      // Create listen events for the section
      if(mesh.listeners){
         for (let i = 0; i <= mesh.listeners.boundary; i++) {
   
            // if (mesh.listeners.buffer[i] !== null && mesh.listeners.buffer[i] !== INT_NULL) { // If NOT null, has a listen event
            if (mesh.listeners.buffer[i] !== null) { // If NOT null, has a listen event
   
               const evt_params = {
                  EventClbk: null,
                  targetBindingFunctions: null,
                  target_mesh: mesh,
                  params: null,
               }
               
               const Clbk = (_Clbk) ? _Clbk : mesh.OnClick;

               if(!parent_listeners){
                  parent_listeners = [null, null];
               }

               if(parent_listeners[i] === null){
                  parent_listeners[i] = Find_parent_listen_event(i, mesh);
               }
               
               mesh.AddListenEvent(i, Clbk, evt_params, parent_listeners[i]); 

               parent_listeners[i] = mesh.listeners.buffer[i]; 
            }
         }
      }

      // Construct listen events for each section's item.
      for (let i = 0; i <= mesh.children.boundary; i++) {

         const child = mesh.children.buffer[i];
         if (child && (child.state.mask & MESH_STATE.ACTIVE)) {
            if (child.ConstructListeners) { // Call the widget's specific .ConstructListeners() to handle the widget's listen events creation
               child.ConstructListeners(parent_listeners);
               // child.ConstructListeners(this.listeners.buffer[i]);
               
               // if(mesh.listeners){
               //    if(mesh.listeners.buffer[i]) parent_listeners[i] = mesh.listeners.buffer[i];
               // }
            }
         }
      }
   }





   /*******************************************************************************************************************************************************/
   // Transformations
   /*******************************************************************************************************************************************************/

   Move(x, y) {

      if (x === 0 && y === 0) return;

      if (this.root_bufferidx === INT_NULL) return;
      
      Widget_root_batch_move_from_batch_buffer(this.root_bufferidx, x, y)

   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveNoGfxUpdate(x, y);
      }

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveYNoGfxUpdate(y);
      }

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveXNoGfxUpdate(x);
      }

   }


   SetPosXY(x, y) { Section_set_posxy_children_recursive([x, y], this); }


   SetPosX(x) { super.SetPosX(x); }


   SetColorAlpha(alpha) {

      super.SetColorAlpha(alpha);

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         child.SetColorAlpha(alpha, alpha)
      }
   }


   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         child.SetIsGfxInserted(flag)
      }
   }


   FakeRemoveFromGfxPosy(posy) {

      this.geom.defPos[1] = this.geom.pos[1];
      this.geom.SetPosY(posy, this.gfx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];

         if (child.state.mask & MESH_STATE.ACTIVE)
            child.FakeRemoveFromGfxPosy(posy)
      }
   }


   FakeAddFromGfxPosy(posy) {

      this.geom.pos[1] = this.geom.defPos[1];
      this.geom.SetPosY(posy, this.gfx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child.state.mask & MESH_STATE.ACTIVE)
            child.FakeAddFromGfxPosy(posy)
      }
   }


   FakeRemoveFromGfxAlpha(alpha) {

      this.mat.defCol[3] = this.mat.col[3];  // Copy the current alpha to the mesh's default col, so it can be retrieved.
      this.mat.SetColorAlpha(alpha, this.gfx);

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (!child.FakeRemoveFromGfxAlpha) {
            console.log(child.GetName(), child.constructor.name)
         }
         child.FakeRemoveFromGfxAlpha(alpha)
      }
   }


   FakeAddFromGfxAlpha(alpha) {

      this.mat.col[3] = this.mat.defCol[3];  // Copy the current alpha to the mesh's default col, so it can be retrieved.
      this.mat.SetColorAlpha(alpha, this.gfx);

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (!child.FakeAddFromGfxAlpha) {
            console.log(child.GetName(), child.constructor.name)
         }
         child.FakeAddFromGfxAlpha(alpha)
      }
   }


   Resize() {

      // console.log('\n==== Resizing:', this.GetName())
      // console.log()
      // this.SetColorRGB([1,1,0]);
   }


   RotateZ(angle) {

      super.RotateZ(angle);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {

            Section_rotatez_children_recursive(child, angle);
         }
      }
   }






   /*******************************************************************************************************************************************************/
   // Misc
   /*******************************************************************************************************************************************************/


}



function Section_rotatez_children_recursive(mesh, angle) {

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child.type & MESH_TYPE.SECTION_MESH) { // Case anothe section, run recursively
         Section_rotatez_children_recursive(child, angle);
      }
   }

   mesh.RotateZ(angle);
}



function Section_set_posxy_children_recursive(pos, mesh) {

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];

      if (child.type & MESH_TYPE.SECTION_MESH) { // Case another section, run recursively
         Section_set_posxy_children_recursive(pos, child);
      }
      else { // NOTE: To avoid moving section twice (as a child and as a section from recursion)
         child.SetPosXY(pos);
      }
   }

   mesh.geom.SetPosXY(pos, mesh.gfx);

}




function Section_on_move_section(params) {

   const section = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (section.StateCheck(MESH_STATE.IN_GRAB) === 0 && section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      section.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_pos = MouseGetPosDif();
   if (mouse_pos.x === 0 && mouse_pos.y === 0) return;

   // HERE: In one example, the section is a child, but the Move runs from widget root and we move from root and not from this section
   section.Move(mouse_pos.x, -mouse_pos.y)

}




export function TEMP_Section_on_move_section(params) {

   const section = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (section.StateCheck(MESH_STATE.IN_GRAB) === 0 && section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      section.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_pos = MouseGetPosDif();
   if (mouse_pos.x === 0 && mouse_pos.y === 0) return;

   section.Move(mouse_pos.x, -mouse_pos.y)

}



function Expand(parent, options, width, accum_margins) {

   let opt = options
   for (let i = 0; i <= parent.children.boundary; i++) {

      const child = parent.children.buffer[i];
      if (options & SECTION.INHERIT) opt = parent.options

      if (child.type & MESH_TYPE.WIDGET_LABEL && child.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC) {
         // child.Resize(); // TODO: Implement
         // child.geom.dim[0] = width - (parent.margin[0] + accum_margins);
         child.geom.dim[0] = width - (parent.StylesGetMargin(STYLES.AXIS.X) + accum_margins);
         child.geom.defDim[0] = child.geom.dim[0];
      }
      else if (child.type & MESH_TYPE.SECTION_MESH) {

         // child.Resize();
         if (opt & SECTION.VERTICAL) {
            child.geom.dim[0] = width - accum_margins;
            child.geom.defDim[0] = child.geom.dim[0];
         }
         else if (opt & SECTION.HORIZONTAL) {

         }

         // accum_margins += child.margin[0];
         accum_margins += child.StylesGetMargin(STYLES.AXIS.X);
         // HACK: Pass the parent's options so that if parent parent is vertical align for children, the children will expand. The option of the child counts for it's children expansion. 
         // Expand(child, child.parent.options, width, accum_margins);
         Expand(child, opt, width, accum_margins);
         // accum_margins -= child.margin[0];
         accum_margins -= child.StylesGetMargin(STYLES.AXIS.X);
      }
   }

   return accum_margins;
}



// TODO: For calculating multi-word text, if we need separate flags (HORIZONTAL | VERTICAL), we need to store the flags in the mesh. 
function Calculate_sizes_recursive(parent, options, target_child_idx) {

   const pad = [0, 0]; // TODO: Implement
   const accum_size_per_section = [0, 0];

   let opt = options

   const target_idx = (target_child_idx!=undefined) ? (target_child_idx>=0) ? target_child_idx : 0 : 0; 
   // const target_idx = 0; 


   // TODO: Implement Better. Here we check for any parent's that have text meshes 
   if (parent.text_mesh) {

      if (parent.options & SECTION.VERTICAL) {

         // accum_size_per_section[1] += parent.text_mesh.geom.dim[1];
         accum_size_per_section[0] = parent.text_mesh.GetMaxWidth();
         parent.max_size[1] += parent.text_mesh.geom.dim[1];

         if (parent.max_size[0] < accum_size_per_section[0])
            parent.max_size[0] = parent.geom.dim[0]; // For horizontal, grow to the max width of all meshes
      }
      else if (parent.options & SECTION.HORIZONTAL) {

         accum_size_per_section[0] += parent.text_mesh.GetMaxWidth();
         // accum_size_per_section[1] =  parent.text_mesh.geom.dim[1];
         parent.max_size[0] += parent.text_mesh.GetMaxWidth();

         if (parent.max_size[1] < accum_size_per_section[1])
            parent.max_size[1] = parent.geom.dim[1];  // For horizontal, grow to the max height of all meshes
      }
   }


   for (let i = target_idx; i <= parent.children.boundary; i++) {


      if (options & SECTION.INHERIT) opt = parent.options

      const mesh = parent.children.buffer[i];
      // console.log('{===}', target_idx, mesh.mesh_bufferidx, mesh.GetName())



      if (mesh.children.active_count && (mesh.type & MESH_TYPE.SECTION_MESH)) {

         Calculate_sizes_recursive(mesh, options); // Recurse if child mesh is of type of Section

         if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) === 0) {

            mesh.geom.dim[0] = mesh.max_size[0];
            mesh.geom.dim[1] = mesh.max_size[1];

            // Update mesh's default dim
            mesh.geom.defDim[0] = mesh.max_size[0];
            mesh.geom.defDim[1] = mesh.max_size[1];

         }


         mesh.SetMargin();

         if (opt & SECTION.VERTICAL) {
            if (parent.max_size[0] < mesh.geom.dim[0])
               parent.max_size[0] = mesh.geom.dim[0]
            parent.max_size[1] += mesh.geom.dim[1]
         }
         else if (opt & SECTION.HORIZONTAL) {
            parent.max_size[0] += mesh.geom.dim[0]
            if (parent.max_size[1] < mesh.geom.dim[1]) parent.max_size[1] = mesh.geom.dim[1]
         }
      }
      else if ((mesh.type & MESH_TYPE.TEXT_MESH) || (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC)) { // Case the current item is of type text.

         if (opt & SECTION.VERTICAL) {

            if (mesh.children.boundary) { // Case text mesh has separate text as children, calculate size of all of them.
               accum_size_per_section[1] += mesh.GetTotalHeight();
               parent.max_size[1] += mesh.GetTotalHeight();
            }
            else {
               accum_size_per_section[1] += mesh.geom.dim[1];
               parent.max_size[1] += mesh.geom.dim[1];
            }

            accum_size_per_section[0] = mesh.GetMaxWidth();
            if (parent.max_size[0] < accum_size_per_section[0])
               parent.max_size[0] = accum_size_per_section[0];  // Keep the max width of all meshes in Vertical mode.

         }
         else if (opt & SECTION.HORIZONTAL) {

            accum_size_per_section[0] += mesh.GetMaxWidth();
            parent.max_size[0] += mesh.GetMaxWidth();

            accum_size_per_section[1] = mesh.geom.dim[1];
            if (parent.max_size[1] < accum_size_per_section[1])
               parent.max_size[1] = mesh.geom.dim[1];  // Keep the max height of all meshes in Horizontal mode.
         }
      }
      else { // Case the current item does not have children.

         if (opt & SECTION.VERTICAL) {

            // if (mesh.text_mesh) {
            //    accum_size_per_section[1] += mesh.text_mesh.geom.dim[1];
            //    accum_size_per_section[0] = mesh.text_mesh.GetMaxWidth();
            //    // parent.max_size[1] += mesh.text_mesh.geom.dim[1];
            // }
            // else{

               accum_size_per_section[1] += mesh.geom.dim[1];
               accum_size_per_section[0] = mesh.geom.dim[0];
            // }

            parent.max_size[1] += mesh.geom.dim[1];

            if (parent.max_size[0] <= accum_size_per_section[0])
               parent.max_size[0] = mesh.geom.dim[0]; // For horizontal, grow to the max width of all meshes
         }
         else if (opt & SECTION.HORIZONTAL) {

            // if (mesh.text_mesh) {
            //    accum_size_per_section[0] += mesh.text_mesh.GetMaxWidth();
            //    accum_size_per_section[1] = mesh.text_mesh.geom.dim[1];
            //    parent.max_size[0] += mesh.text_mesh.GetMaxWidth();
            // }
            // else{

               accum_size_per_section[0] += mesh.geom.dim[0];
               accum_size_per_section[1] = mesh.geom.dim[1];
            // }

            parent.max_size[0] += mesh.geom.dim[0];

            if (parent.max_size[1] < accum_size_per_section[1])
               parent.max_size[1] = mesh.geom.dim[1];  // For horizontal, grow to the max height of all meshes
         }
      }
   }

}
/**DO NOT DELETE. IMPLEMENT FAST calc sizes implementation  */
// function Calculate_sizes_recursive_from_parent_ascending(parent, options, target_child_idx) {

//    const pad = [0, 0]; // TODO: Implement
//    const accum_size_per_section = [0, 0];

//    let opt = options

//    const target_idx = (target_child_idx!=undefined) ? (target_child_idx>=0) ? target_child_idx : 0 : 0; 
//    // const target_idx = 0; 


//    // TODO: Implement Better. Here we check for any parent's that have text meshes 
//    if (parent.text_mesh) {

//       if (parent.options & SECTION.VERTICAL) {

//          // accum_size_per_section[1] += parent.text_mesh.geom.dim[1];
//          accum_size_per_section[0] = parent.text_mesh.GetMaxWidth();
//          parent.max_size[1] += parent.text_mesh.geom.dim[1];

//          if (parent.max_size[0] < accum_size_per_section[0])
//             parent.max_size[0] = parent.geom.dim[0]; // For horizontal, grow to the max width of all meshes
//       }
//       else if (parent.options & SECTION.HORIZONTAL) {

//          accum_size_per_section[0] += parent.text_mesh.GetMaxWidth();
//          // accum_size_per_section[1] =  parent.text_mesh.geom.dim[1];
//          parent.max_size[0] += parent.text_mesh.GetMaxWidth();

//          if (parent.max_size[1] < accum_size_per_section[1])
//             parent.max_size[1] = parent.geom.dim[1];  // For horizontal, grow to the max height of all meshes
//       }
//    }


//    for (let i = target_idx; i <= parent.children.boundary; i++) {


//       if (options & SECTION.INHERIT) opt = parent.options

//       const mesh = parent.children.buffer[i];
//       console.log('{===}', target_idx, mesh.mesh_bufferidx, mesh.GetName())



//       if (mesh.children.active_count && (mesh.type & MESH_TYPE.SECTION_MESH)) {



//          if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) === 0) {

//             mesh.geom.dim[0] = mesh.max_size[0];
//             mesh.geom.dim[1] = mesh.max_size[1];

//             // Update mesh's default dim
//             mesh.geom.defDim[0] = mesh.max_size[0];
//             mesh.geom.defDim[1] = mesh.max_size[1];

//          }


//          mesh.SetMargin();

//          if (opt & SECTION.VERTICAL) {
//             if (parent.max_size[0] < mesh.geom.dim[0])
//                parent.max_size[0] = mesh.geom.dim[0]
//             parent.max_size[1] += mesh.geom.dim[1]
//          }
//          else if (opt & SECTION.HORIZONTAL) {
//             parent.max_size[0] += mesh.geom.dim[0]
//             if (parent.max_size[1] < mesh.geom.dim[1]) parent.max_size[1] = mesh.geom.dim[1]
//          }
//       }
//       else if ((mesh.type & MESH_TYPE.TEXT_MESH) || (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC)) { // Case the current item is of type text.

//          if (opt & SECTION.VERTICAL) {

//             if (mesh.children.boundary) { // Case text mesh has separate text as children, calculate size of all of them.
//                accum_size_per_section[1] += mesh.GetTotalHeight();
//                parent.max_size[1] += mesh.GetTotalHeight();
//             }
//             else {
//                accum_size_per_section[1] += mesh.geom.dim[1];
//                parent.max_size[1] += mesh.geom.dim[1];
//             }

//             accum_size_per_section[0] = mesh.GetMaxWidth();
//             if (parent.max_size[0] < accum_size_per_section[0])
//                parent.max_size[0] = accum_size_per_section[0];  // Keep the max width of all meshes in Vertical mode.

//          }
//          else if (opt & SECTION.HORIZONTAL) {

//             accum_size_per_section[0] += mesh.GetMaxWidth();
//             parent.max_size[0] += mesh.GetMaxWidth();

//             accum_size_per_section[1] = mesh.geom.dim[1];
//             if (parent.max_size[1] < accum_size_per_section[1])
//                parent.max_size[1] = mesh.geom.dim[1];  // Keep the max height of all meshes in Horizontal mode.
//          }
//       }
//       else { // Case the current item does not have children.

//          if (opt & SECTION.VERTICAL) {

//             if (mesh.text_mesh) {
//                accum_size_per_section[1] += mesh.text_mesh.geom.dim[1];
//                accum_size_per_section[0] = mesh.text_mesh.GetMaxWidth();
//                // parent.max_size[1] += mesh.text_mesh.geom.dim[1];
//             }

//             accum_size_per_section[1] += mesh.geom.dim[1];
//             accum_size_per_section[0] = mesh.geom.dim[0];

//             parent.max_size[1] += mesh.geom.dim[1];

//             if (parent.max_size[0] < accum_size_per_section[0])
//                parent.max_size[0] = mesh.geom.dim[0]; // For horizontal, grow to the max width of all meshes
//          }
//          else if (opt & SECTION.HORIZONTAL) {

//             if (mesh.text_mesh) {
//                accum_size_per_section[0] += mesh.text_mesh.GetMaxWidth();
//                accum_size_per_section[1] = mesh.text_mesh.geom.dim[1];
//                parent.max_size[0] += mesh.text_mesh.GetMaxWidth();
//             }

//             accum_size_per_section[0] += mesh.geom.dim[0];
//             accum_size_per_section[1] = mesh.geom.dim[1];

//             parent.max_size[0] += mesh.geom.dim[0];

//             if (parent.max_size[1] < accum_size_per_section[1])
//                parent.max_size[1] = mesh.geom.dim[1];  // For horizontal, grow to the max height of all meshes
//          }
//       }
//    }

//    if(parent.parent){

//       let p = parent.parent
//       while(p !== null && p !== _){
         
//          if ((p.type & MESH_TYPE.SECTION_MESH))
//             p.max_size[0] += parent.max_size[0]; 
//          p = p.parent;
//       }
//    }
// }



export function Calculate_positions_recursive(parent, options) {

   const pad = [0, 0]
   const cur_pos = [parent.geom.pos[0], parent.geom.pos[1]];

   for (let i = 0; i <= parent.children.boundary; i++) {

      const mesh = parent.children.buffer[i];
      let continue_recur = true;
      let opt = options

      if (options & SECTION.INHERIT) opt = parent.options

      const mesh_max_width = mesh.GetMaxWidth();
      if (parent.type & MESH_TYPE.SECTION_MESH) { // For meshes with a parent of type Section

         const c_x = cur_pos[0], c_y = cur_pos[1]; // curent position
         const parent_dimx = parent.GetMaxWidth(), parent_dimy = parent.GetTotalHeight(); // parent mesh dimention
         // const parent_margx = parent.margin[0], parent_margy = parent.margin[1]; // parent mesh margin
         const parent_margx = parent.StylesGetMargin(STYLES.AXIS.X), parent_margy = parent.StylesGetMargin(STYLES.AXIS.Y); // parent mesh margin

         const new_pos = [(c_x - parent_dimx) + mesh_max_width + parent_margx, (c_y - parent_dimy) + mesh.geom.dim[1] + parent_margy, parent.geom.pos[2] + 1,];
         const pos_dif = [new_pos[0] - mesh.GetCenterPosX(), new_pos[1] - mesh.GetCenterPosY(), new_pos[2] + 1];

         if (pos_dif[0] !== 0 || pos_dif[1] !== 0) {

            if ((mesh.type & MESH_TYPE.SECTION_MESH) === 0) { // Case mesh not of type section, have it update it's new pos-dim on a later when it's gfx exists.

               mesh.Reposition_pre(pos_dif);
               continue_recur = false; // Stop recursion for mesh's children. Let the mesh deal with it's children positioning.
            }
            else { // Case  mesh is of type section  

               CopyArr2(mesh.geom.pos, new_pos);
               CopyArr2(mesh.geom.defPos, mesh.geom.pos);
               const update_data = {
                  sizes: [2],
                  data: [new_pos[0], new_pos[1], mesh.geom.dim[0], mesh.geom.dim[1],]
               };

               // mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4_POS2; // HACK
               mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4_POS2; // HACK
               Batch_store(mesh, SHADER_ATTRIBUTES.WPOS4, update_data, _);
            }
         }

      }

      // if ((mesh.state.mask & MESH_STATE.ACTIVE) && continue_recur)
      if (continue_recur)
         Calculate_positions_recursive(mesh, options)

      const mesh_width = mesh_max_width;
      const mesh_height = mesh.GetTotalHeight();

      if (opt & SECTION.VERTICAL) {
         cur_pos[1] += (mesh_height * 2);
      }
      else if (opt & SECTION.HORIZONTAL) {
         cur_pos[0] += mesh_width * 2;
      }
   }

}



export function Calculate_positions_no_gfx_update_recursive(parent, options) {

   const pad = [0, 0]
   const cur_pos = [parent.geom.pos[0], parent.geom.pos[1]];

   // TODO: Quick and Dirty-Implement Better. Here we check for any parent's that have text meshes 
   if (parent.text_mesh) {
      const c_x = cur_pos[0], c_y = cur_pos[1]; // curent position
      const parent_dimx = parent.GetMaxWidth(), parent_dimy = parent.GetTotalHeight(); // parent mesh dimention
      // const parent_margx = parent.margin[0], parent_margy = parent.margin[1]; // parent mesh margin

      const parent_margx = parent.StylesGetMargin(STYLES.AXIS.X), parent_margy = parent.StylesGetMargin(STYLES.AXIS.Y); // parent mesh margin
      const new_pos = [(c_x - parent_dimx) + parent.text_mesh.GetMaxWidth() + parent_margx, (c_y - parent_dimy) + parent.text_mesh.geom.dim[1] + parent_margy, parent.geom.pos[2] + 1,];
      const pos_dif = [new_pos[0] - (parent.text_mesh.GetCenterPosX()), new_pos[1] - parent.text_mesh.GetCenterPosY(), new_pos[2] + 1];
      parent.text_mesh.MoveNoGfxUpdate(pos_dif[0], pos_dif[1]);
   }


   for (let i = 0; i <= parent.children.boundary; i++) {

      const mesh = parent.children.buffer[i];
      let continue_recur = true;
      let opt = options


      if (options & SECTION.INHERIT) opt = parent.options

      const mesh_max_width = mesh.GetMaxWidth();


      if (parent.type & MESH_TYPE.SECTION_MESH) { // For meshes with a parent of type Section
         
         const c_x = cur_pos[0], c_y = cur_pos[1]; // curent position
         const parent_dimx = parent.GetMaxWidth(), parent_dimy = parent.GetTotalHeight(); // parent mesh dimention
         // const parent_margx = parent.margin[0], parent_margy = parent.margin[1]; // parent mesh margin
         const parent_margx = parent.StylesGetMargin(STYLES.AXIS.X), parent_margy = parent.StylesGetMargin(STYLES.AXIS.Y); // parent mesh margin

         const new_pos = [(c_x - parent_dimx) + mesh_max_width + parent_margx, (c_y - parent_dimy) + mesh.geom.dim[1] + parent_margy, parent.geom.pos[2] + 1,];
         const pos_dif = [new_pos[0] - (mesh.GetCenterPosX()), new_pos[1] - mesh.GetCenterPosY(), new_pos[2] + 1];

         if(pos_dif[0] || pos_dif[1]){

            if ((mesh.type & MESH_TYPE.SECTION_MESH) === 0) { // Case mesh not of type section, have it update it's new pos-dim on a later when it's gfx exists.
   
   
               mesh.MoveNoGfxUpdate(pos_dif[0], pos_dif[1]);
               // console.log('{===}', mesh.mesh_bufferidx, mesh.GetName())
   
   
               // HACK: Because scrollers bar is a Rect_mesh, it does not handle any children, like: scrollers handle
               if (mesh.type & MESH_TYPE.WIDGET_SCROLLER_BAR) {
                  mesh.children.buffer[0].geom.pos[0] += pos_dif[0];
                  mesh.children.buffer[0].geom.pos[1] += pos_dif[1] + mesh.children.buffer[0].geom.dim[1];
                  CopyArr2(mesh.children.buffer[0].geom.defPos, mesh.children.buffer[0].geom.pos);
               }
   
               continue_recur = false; // Stop recursion for mesh's children. Let the mesh deal with it's children positioning.
            }
            else { // Case  mesh is of type section  
               CopyArr2(mesh.geom.pos, new_pos);
               CopyArr2(mesh.geom.defPos, mesh.geom.pos);
            }
         } 
         else{
            continue_recur = false;
         }

      }


      if (parent.rel_comp) { // Reposition any meshes that have relative position for their children
         Relative_pos_comp_recalc_all(parent)
      }


      if (continue_recur) // Continue recursively, if the mesh does not handle any its children.
         Calculate_positions_no_gfx_update_recursive(mesh, options)

      const mesh_width = mesh_max_width;
      const mesh_height = mesh.GetTotalHeight();


      // Increment current postision tracker
      if (opt & SECTION.VERTICAL) {
         cur_pos[1] += (mesh_height * 2);
      }
      else if (opt & SECTION.HORIZONTAL) {
         cur_pos[0] += mesh_width * 2;
      }
   }

}

