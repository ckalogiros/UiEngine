"use strict";

import { AddArr2, CopyArr2, CopyArr3 } from "../../../Helpers/Math/MathOperations.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Rect } from "./Rect_Mesh.js";
import { Mesh_buffer_get_mesh_byidx, Widget_group_add, Widget_group_update_decrement, Widget_group_update_increment, Widget_root_add_mesh, Widget_root_batch_get, Widget_root_create_root, Widget_root_buffer_get_byidx, Widget_group_get, Widgetroot_buffer_print_w1, Widgetroot_gfx_print_w3 } from "../../Core/MeshBuffer.js";
import { Batch_store } from "../../Batch/Batch.js";




export class Section extends Rect {

   options;  // BIT-FIELD. Stores some state for 'this'.
   margin;   // [1,1] Stores the x-y margins
   padding;  // [1,1] Stores padding for the meshes in-between space.
   max_size; // [1,1] Stores the max x-y size of all children meshes (not accumulative).
   clampy; // Array: [x,y:[top,bottom,threshold]] clamp values. The threshold is a float, which added to the clamp value gives the absolute limit above/below to which a mesh should/should't be rendered 
   total_margin;



   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), margin = [4, 4], pos = [200, 400, 0], dim = [40, 40], col = TRANSPARENCY(BLUE, .6), name = 'SECTION UNAMED', style = [0, 3.5, 2.]) {

      super(pos, dim, col);

      this.total_margin = [0, 0];

      this.mesh_bufferidx = mesh_bufferidx;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


      this.options = options;
      this.margin = margin;
      this.max_size = [0, 0];

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

      this.SetName(name)

      this.SetStyle(style);


      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);
      }
   }


   Destroy() {

      // Any children destruction
      for (let i = 0; i < this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.Destroy(child);
      }

      // section's destruction
      super.Destroy();
   }


   AddItem(mesh, options) {

      this.options |= options;

      // SID.InheritUniform(mesh.sid.unif, this.sid.unif); // Inherits the parent's uniform flags

      const idx = this.AddChild(mesh);
      this.children_all.Add(mesh.mesh_bufferidx);

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
            CopyArr3(mesh.geom.pos, this.geom.pos);
         }
      }
      else { // Handle Items 
         // TODO: implement
      }

      return idx;
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      for (let i = 0; i < this.children.boundary; i++) {

         const child = this.children.buffer[i];
         /**DEBUG */ if (!child.AddToWidgetRootBuffer)
            console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO AddToWidgetGroupBuffer() FOR SECTION CHILD:', child.mesh_bufferidx, child.GetName());
         if (child) child.AddToWidgetRootBuffer(root_bufferidx);
      }
   }


   AddToWidgetGroupBuffer(group_bufferidx, temp_max_size = 0) {

      if(this.mesh_bufferidx === 365)
      console.log()

      if (this.state.mask & MESH_STATE.ACTIVE) {
         /**DEBUG */ if (!this.gfx) console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO GFX FOR SECTION:', this.mesh_bufferidx, this.GetName());
         this.group_bufferidxs[0] = group_bufferidx;
         this.group_bufferidxs[1] = Widget_group_add(group_bufferidx, this.gfx, this.geom.num_faces, this.mesh_bufferidx);

         const count = (temp_max_size) ? temp_max_size : this.children.boundary
         for (let i = 0; i < count; i++) {

            const child = this.children.buffer[i];
            /**DEBUG */ if (!child.gfx) console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO GFX FOR SECTION CHILD:', child.mesh_bufferidx, child.GetName());
            /**DEBUG */ if (!child.AddToWidgetGroupBuffer)
               console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO AddToWidgetGroupBuffer() FOR SECTION CHILD:', child.mesh_bufferidx, child.GetName());
               
      if(child.mesh_bufferidx === 365)
      console.log('FROM AddToWidgetGroup()', child.state.mask)
            if (child.state.mask & MESH_STATE.ACTIVE) child.AddToWidgetGroupBuffer(group_bufferidx);
         }
      }
   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      for (let i = 0; i < this.children.boundary; i++) {
         this.children.buffer[i].Activate();
      }
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      for (let i = 0; i < this.children.boundary; i++) {
         this.children.buffer[i].Deactivate();
      }
   }


   StateEnable(MASK=0x0) {

      this.state.mask |= MASK;
      for (let i = 0; i < this.children.boundary; i++) {
         this.children.buffer[i].StateEnable(MASK);
      }
   }


   StateDisable(MASK=0x0) {

      // if(this.mesh_bufferidx === 365)
      // console.log('FROM AddToWidgetGroup()','mask', MASK, this.GetName(), this.state.mask)
      this.state.mask &= ~MASK;
      for (let i = 0; i < this.children.boundary; i++) {
         this.children.buffer[i].StateDisable(MASK);
      }
   }


   Calc(options = SECTION.INHERIT) {

      // TEMP_PRINT_IS_GFX_INSERTED(this, 'CALC START')
      const section = this;
      let left = section.geom.pos[0]; // Left starting position
      let top = section.geom.pos[1]; // Top starting position

      const total_size = [0, 0], total_margin = [0, 0]
      const old_sizex = section.geom.dim[0];
      const old_sizey = section.geom.dim[1];


      Calculate_sizes_recursive(section, top, left, options, total_margin, total_size);


      if (section.type & MESH_TYPE.WIDGET_SCROLLER) {
         section.geom.dim[0] = section.max_size[0]; // For scroller widgets, do not set the height
      }
      else {
         CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
      }

      /** OPTIONS:EXPAND 
       * Happens on a second pass of all items of current section, since each section may have different options for expand.
       * Expand width of items to match the max width of section, minus the margin.
       * Only if the section has VERTICAL align for its items. 
       */
      if (options & SECTION.EXPAND) {
         Expand(section, section.options, section.max_size[0], 0);
      }


      // Calculate the parent section's position, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      if (options & SECTION.TOP_DOWN) {
         // NOTE: The position in the gfx buffers is updated at Calculate_positions_recursive().
         section.geom.pos[0] += (section.max_size[0] - old_sizex) + section.margin[0];
         section.geom.pos[1] += (section.max_size[1] - old_sizey) + section.margin[1];
      }

      section.SetMargin();

      Calculate_positions_recursive(section, options);


      // Update for the root
      section.batch_fnidx = BATCH_FN_IDX.SET_POS2; // HACK
      const update_data = {
          sizes:[2],
          data:[section.geom.dim[0], section.geom.dim[1]],
      };
      Batch_store(section, SHADER_ATTRIBUTES.POS2, update_data, _);
      // Batch_store(section, SHADER_ATTRIBUTES.WPOS4, _, _);

      return section.max_size;

   }


   Calc_no_gfx_update(options = SECTION.INHERIT) {

      const section = this;

      let left = section.geom.pos[0]; // Left starting position
      let top = section.geom.pos[1]; // Top starting position

      const total_size = [0, 0], total_margin = [0, 0]
      const old_sizex = section.geom.dim[0];
      const old_sizey = section.geom.dim[1];


      Calculate_sizes_recursive(section, top, left, options, total_margin, total_size);


      if (section.type & MESH_TYPE.WIDGET_SCROLLER) {
         section.geom.dim[0] = section.max_size[0]; // For scroller widgets, do not set the height
      }
      else {
         CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
      }

      /** OPTIONS:EXPAND 
       * Happens on a second pass of all items of current section, since each section may have different options for expand.
       * Expand width of items to match the max width of section, minus the margin.
       * Only if the section has VERTICAL align for its items. 
       */
      if (options & SECTION.EXPAND) {
         Expand(section, section.options, section.max_size[0], 0);
      }


      // Add the parent's new size offset, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      if (options & SECTION.TOP_DOWN) {
         section.geom.pos[0] += (section.max_size[0] - old_sizex) + section.margin[0];
         section.geom.pos[1] += (section.max_size[1] - old_sizey) + section.margin[1];
      }

      section.SetMargin();

      Calculate_positions_no_gfx_update_recursive(section, options, _);

      return section.max_size;

   }


   Recalc(options) {

      const section = this;

      this.Reset(section);
      return this.Calc(options);
   }


   Recalc_no_batch_render(options) {

      const section = this;

      this.Reset(section);
      return this.Calc_no_gfx_update(options);
   }


   Reset(section) {

      for (let i = 0; i < section.children.boundary; i++) {

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

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx = null) {

      const gfx = super.GenGfxCtx(FLAGS, gfxidx);

      for (let i = 0; i < this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.GenGfxCtx(FLAGS, gfxidx);
      }


      return gfx;
   }


   Render() {
      
      if (this.state.mask & MESH_STATE.ACTIVE) super.AddToGfx();
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         child.Render();
      }

   }


   Rerender() {

      super.AddToGfxFromReset();

      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child && (child.state.mask & MESH_STATE.ACTIVE)) {
            child.Rerender();
         }
      }
   }


   DeactivateGfx() {

      super.DeactivateGfx();

      for (let i = 0; i < this.children.boundary; i++) {

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

      for (let i = 0; i < this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) all_meshes = child.GetAllMeshes(all_meshes);
      }

      // return [this];
      return all_meshes;
   }


   SetMargin() {
      this.geom.dim[0] += this.margin[0];
      this.geom.dim[1] += this.margin[1];
   }


   SetUpdateFrameBuffer() {
      if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {
            child.SetFrameBufferIdx(fbidx)
         }
      }
   }


   SetPosY(y) {

      super.SetPosY(y);
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosY(y);
      }
   }


   SetPosXNoGfxUpdate(x) {
      this.geom.pos[0] = x;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosXNoGfxUpdate(x);
      }
   }


   SetPosYNoGfxUpdate(y) {
      this.geom.pos[1] = y;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosYNoGfxUpdate(y);
      }
   }


   SetPosXYNoGfxUpdate(x, y) {
      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosXYNoGfxUpdate(x, y);
      }
   }



   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   OnClick(params) {

      const section = params.target_params.target_mesh;

      const point = MouseGetPos();
      const g = section.geom;

      if (Check_intersection_point_rect(g.pos, g.dim, point, [0, 8])) {

         STATE.mesh.SetClicked(section);
         console.log('Clicked:', section.GetName())

         if (section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            /** Create Move event.
             * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
             * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
             */
            const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, Section_on_move_section, section);
            // section.timeIntervalsIdxBuffer.Add(idx);
            section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

            if (section.StateCheck(MESH_STATE.IS_GRABABLE)) {

               STATE.mesh.SetGrabed(section);
               section.StateEnable(MESH_STATE.IN_GRAB);
            }

         }

         return true;
      }

   }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null, _Clbk = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      const root = (_root) ? _root : this; // If in recursion, use as root the passed param. 

      // Create listen events for the section
      const root_evt = root.listeners.buffer;
      for (let etypeidx = 0; etypeidx < mesh.listeners.boundary; etypeidx++) {

         const evt = mesh.listeners.buffer[etypeidx];

         if (evt) { // If mesh has events to add...
            const target_params = {
               EventClbk: null,
               targetBindingFunctions: null,
               target_mesh: mesh,
               params: null,
            }
            const Clbk = (_Clbk) ? _Clbk : mesh.OnClick;
            mesh.AddListenEvent(etypeidx, Clbk, target_params, root_evt);
         }
      }

      // Construct listen events for each section's item.
      for (let i = 0; i < mesh.children.boundary; i++) {

         const child = mesh.children.buffer[i];
         if (child) {
         /**
          * Create a Fake listen event as a parent event, if the section has no listen events,
          * so that the actual listen events of the section's children meshes have a parent event to be grouped.
          * 
          * // TODO!!: IMPORTANT!
          * 1. We create Fake event only for click events.
          * 2. We create Fake event despite the fact that there may not be any children events.
          */

            const parent_root = root.parent ? root.parent : root

            // Case item is of type section, run recursively.
            // If the root mesh does not have an event, create a fake event to store the children events to. 
            if (root.listeners.buffer[1] === null) {

               root.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP, true);
               root.AddListenEvent(1, null, null, parent_root.listeners.buffer);
            }

            if (child.ConstructListeners) // Call the widget's specific .ConstructListeners() to handle the widget's listen events creation
               child.ConstructListeners(root);

         }
      }
   }



   /*******************************************************************************************************************************************************/
   // Transformations
   /*******************************************************************************************************************************************************/

   Move(x, y) {

      if (x === 0 && y === 0) return;

      if (this.root_bufferidx > INT_NULL) {

         const widget_root_buffer = Widget_root_buffer_get_byidx(this.root_bufferidx);
         for (let i = 0; i < widget_root_buffer.boundary; i++) {

            // EFFICIENCY: Maybe its better to access the _mesh_buffer directly from the MeshBuffer.js file. Also later we use 'Widget_root_batch_get'
            const mesh = Mesh_buffer_get_mesh_byidx(widget_root_buffer.buffer[i]);
            mesh.geom.pos[0] += x;
            mesh.geom.pos[1] += y;
         }

         const root_batch_buffer = Widget_root_batch_get(this.root_bufferidx);

         const len = root_batch_buffer.vb.length
         for (let i = 0; i < len; i++) {

            const meshidx = root_batch_buffer.vb[i].batch_mesh_bufferidx;
            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);

            mesh.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;
            const update_data = {
                sizes:[2],
                data:[x, y],
            };
            Batch_store(mesh, SHADER_ATTRIBUTES.WPOS4, update_data, root_batch_buffer.vb[i].num_faces); // The batch_store needs the number of meshes to update as well as the move value
         }

      }
      else {

         this.geom.pos[0] += x;
         this.geom.pos[1] += y;
         
         // Batch_store(this, _, { pos: [x, y] });
         
         for (let i = 0; i < this.children.boundary; i++) {
            // EFFICIENCY: Unfortunately if the chldren are all Widget_text, we are gonna batch_store all seperately, instead of batch store all of the texts together with total num_faces
            const child = this.children.buffer[i];
            if (child.is_gfx_inserted) {
               child.Move(x, y)
            }
         }
      }
   }


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveNoGfxUpdate(x, y);
      }

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveYNoGfxUpdate(y);
      }

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveXNoGfxUpdate(x);
      }

   }

   SetPosXY(x, y) { Section_set_posxy_children_recursive([x, y], this); }


   SetPosX(x) { super.SetPosX(x); } 


   SetColorAlpha(alpha) {

      super.SetColorAlpha(alpha);

      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         child.SetColorAlpha(alpha, alpha)
      }
   }


   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false

      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         child.SetIsGfxInserted(flag)
      }
   }


   FakeRemoveFromGfxPosy(posy) {

      this.geom.defPos[1] = this.geom.pos[1];
      this.geom.SetPosY(posy, this.gfx);

      for (let i = 0; i < this.children.boundary; i++) {

         const child = this.children.buffer[i];

         if (child.state.mask & MESH_STATE.ACTIVE)
            child.FakeRemoveFromGfxPosy(posy)
      }
   }


   FakeAddFromGfxPosy(posy) {

      this.geom.pos[1] = this.geom.defPos[1];
      this.geom.SetPosY(posy, this.gfx);

      for (let i = 0; i < this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child.state.mask & MESH_STATE.ACTIVE)
            child.FakeAddFromGfxPosy(posy)
      }
   }


   FakeRemoveFromGfxAlpha(alpha) {

      this.mat.defCol[3] = this.mat.col[3];  // Copy the current alpha to the mesh's default col, so it can be retrieved.
      this.mat.SetColorAlpha(alpha, this.gfx);

      for (let i = 0; i < this.children.boundary; i++) {
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

      for (let i = 0; i < this.children.boundary; i++) {
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
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {

            Section_rotatez_children_recursive(child, angle);
         }
      }
   }


   SetGfxProgramGroup(group_mask) {
      this.sid.progs_group = group_mask;
      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {
            child.SetGfxProgramGroup(group_mask);
         }
      }
   }


   /*******************************************************************************************************************************************************/
   // Misc
   /*******************************************************************************************************************************************************/

   UpdateWidgetGroupIncrementNumFaces() {

      Widget_group_update_increment(this.group_bufferidxs, this.geom.num_faces);

      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {
            child.UpdateWidgetGroupIncrementNumFaces();
         }
      }
   }


   UpdateWidgetGroupDecrementNumFaces() {

      Widget_group_update_decrement(this.group_bufferidxs, this.geom.num_faces, this);

      for (let i = 0; i < this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) {
            child.UpdateWidgetGroupDecrementNumFaces();
         }
      }
   }
}



function Section_rotatez_children_recursive(mesh, angle) {

   for (let i = 0; i < mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child.type & MESH_TYPE.SECTION_MESH) { // Case anothe section, run recursively
         Section_rotatez_children_recursive(child, angle);
      }
   }

   mesh.RotateZ(angle);
}



function Section_set_posxy_children_recursive(pos, mesh) {

   for (let i = 0; i < mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];

      if (child.type & MESH_TYPE.SECTION_MESH) { // Case another section, run recursively
         Section_set_posxy_children_recursive(pos, child);
      }
      else { // NOTE: To avoid moving section twice (as a child and as a section from recursion)
         // child.MoveXY(pos);
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
      section.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.MOVE);

      return;
   }

   const mouse_pos = MouseGetPosDif();
   if (mouse_pos.x === 0 && mouse_pos.y === 0) return;

   section.Move(mouse_pos.x, -mouse_pos.y)

}



function Expand(section, options, width, accum_margins) {


   for (let i = 0; i < section.children.boundary; i++) {

      const child = section.children.buffer[i];

      if (child.type & MESH_TYPE.WIDGET_TEXT_LABEL && child.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC) {
         child.Resize();
         child.geom.dim[0] = width - (section.margin[0] + accum_margins);
      }
      else if (child.type & MESH_TYPE.SECTION_MESH) {

         child.Resize();
         if (options & SECTION.VERTICAL) {
            child.geom.dim[0] = width - accum_margins;
         }
         else if (options & SECTION.HORIZONTAL) {

         }

         accum_margins += child.margin[0];
         // HACK: Pass the parent's options so that if parent section is vertical align for children, the children will expand. The option of the child counts for it's children expansion. 
         Expand(child, child.parent.options, width, accum_margins);
         accum_margins -= child.margin[0];
      }
   }

   return accum_margins;
}



// TODO: For calculating multi-word text, if we need separate flags (HORIZONTAL | VERTICAL), we need to store the flags in the mesh. 
function Calculate_sizes_recursive(section, top, left, options, total_margin = [0, 0], total_size = [0, 0]) {

   const padding = [0, 0]; // TODO: Implement
   const margin = total_margin;
   const accum_size_per_section = [0, 0];

   for (let i = 0; i < section.children.boundary; i++) {


      let opt = options
      if (options & SECTION.INHERIT)
         opt = section.options

      const mesh = section.children.buffer[i];

      if (mesh.children.active_count && ((mesh.type & MESH_TYPE.SECTION_MESH) && !((mesh.type & MESH_TYPE.WIDGET_SCROLLER)))) {

         const size = Calculate_sizes_recursive(mesh, top, left, SECTION.INHERIT, margin, total_size); // Recurse if child mesh is of type of Section

         total_size[0] += size[0];
         total_size[1] += size[1];

         mesh.geom.dim[0] = mesh.max_size[0]
         mesh.geom.dim[1] = mesh.max_size[1]

         mesh.SetMargin();

         if (opt & SECTION.VERTICAL) {
            if (section.max_size[0] < mesh.geom.dim[0])
               section.max_size[0] = mesh.geom.dim[0]
            section.max_size[1] += mesh.geom.dim[1]
         }
         else if (opt & SECTION.HORIZONTAL) {
            section.max_size[0] += mesh.geom.dim[0]
            if (section.max_size[1] < mesh.geom.dim[1]) section.max_size[1] = mesh.geom.dim[1]
         }
      }
      else if ((mesh.type & MESH_TYPE.TEXT_MESH) || (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC)) { // Case the current item is of type text.

         if (opt & SECTION.VERTICAL) {

            if (mesh.children.boundary) { // Case text mesh has separate text as children, calculate size of all of them.
               accum_size_per_section[1] += mesh.GetTotalHeight();
               section.max_size[1] += mesh.GetTotalHeight();
            }
            else {
               accum_size_per_section[1] += mesh.geom.dim[1];
               section.max_size[1] += mesh.geom.dim[1];
            }
            if(mesh.mesh_bufferidx === 97)
            console.log
            accum_size_per_section[0] = mesh.GetMaxWidth();
            if (section.max_size[0] < accum_size_per_section[0])
               section.max_size[0] = accum_size_per_section[0];  // Keep the max width of all meshes in Vertical mode.

         }
         else if (opt & SECTION.HORIZONTAL) {

            accum_size_per_section[0] += mesh.GetMaxWidth();
            section.max_size[0] += mesh.GetMaxWidth();

            accum_size_per_section[1] = mesh.geom.dim[1];
            if (section.max_size[1] < accum_size_per_section[1])
               section.max_size[1] = mesh.geom.dim[1];  // Keep the max height of all meshes in Horizontal mode.
         }
      }
      else { // Case the current item does not have children.

         if (opt & SECTION.VERTICAL) {
            accum_size_per_section[1] += mesh.geom.dim[1];
            accum_size_per_section[0] = mesh.geom.dim[0];
            section.max_size[1] += mesh.geom.dim[1];
            if (section.max_size[0] < accum_size_per_section[0])
               section.max_size[0] = mesh.geom.dim[0]; // For horizontal, grow to the max width of all meshes
         }
         else if (opt & SECTION.HORIZONTAL) {
            accum_size_per_section[0] += mesh.geom.dim[0];
            accum_size_per_section[1] = mesh.geom.dim[1];
            section.max_size[0] += mesh.geom.dim[0];
            if (section.max_size[1] < accum_size_per_section[1])
               section.max_size[1] = mesh.geom.dim[1];  // For horizontal, grow to the max height of all meshes
         }
      }
   }

   AddArr2(total_size, accum_size_per_section);
   return total_size;
}



export function Calculate_positions_recursive(parent, options = SECTION.INHERIT, _accum_pos = [parent.geom.pos[1], 0]) {

   const padding = [0, 0]
   const cur_pos = [parent.geom.pos[0], parent.geom.pos[1]];
   const accum_pos = _accum_pos;

   for (let i = 0; i < parent.children.boundary; i++) {

      const mesh = parent.children.buffer[i];
      let continue_recur = true;
      let opt = options

      if (options & SECTION.INHERIT) opt = parent.options

      const mesh_max_width = mesh.GetMaxWidth();
      if (parent.type & MESH_TYPE.SECTION_MESH) { // For meshes with a parent of type Section

         const c_x = cur_pos[0], c_y = cur_pos[1]; // curent position
         const parent_dimx = parent.GetMaxWidth(), parent_dimy = parent.GetTotalHeight(); // parent mesh dimention
         const parent_margx = parent.margin[0], parent_margy = parent.margin[1]; // parent mesh margin

         const new_pos = [(c_x - parent_dimx) + mesh_max_width + parent_margx, (c_y - parent_dimy) + mesh.geom.dim[1] + parent_margy, parent.geom.pos[2] + 1,];
         const pos_dif = [new_pos[0] - mesh.GetCenterPosX(), new_pos[1] - mesh.GetCenterPosY(), new_pos[2] + 1];

         if (pos_dif[0] !== 0 || pos_dif[1] !== 0) {

            if ((mesh.type & MESH_TYPE.SECTION_MESH) === 0) { // Case mesh not of type section, have it update it's new pos-dim on a later when it's gfx exists.

               mesh.Reposition_pre(pos_dif);
               continue_recur = false; // Stop recursion for mesh's children. Let the mesh deal with it's children positioning.
            }
            else { // Case  mesh is of type section  

               CopyArr2(mesh.geom.pos, new_pos);
               const update_data = { 
                  sizes:[2],
                  data: [new_pos[0], new_pos[1], mesh.geom.dim[0],mesh.geom.dim[1],]
                  // data: [new_pos[0], new_pos[1]]
               };
               // mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4; // HACK
               // Batch_store(mesh, SHADER_ATTRIBUTES.WPOS4, update_data, _);
               console.log(mesh.geom.dim, mesh.GetName());
               mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4_POS2; // HACK
               Batch_store(mesh, SHADER_ATTRIBUTES.WPOS4, update_data, _);
            }
         }

      }

      // if ((mesh.state.mask & MESH_STATE.ACTIVE) && continue_recur)
      if (continue_recur)
         Calculate_positions_recursive(mesh, options, accum_pos)

      const mesh_width = mesh_max_width;
      const mesh_height = mesh.GetTotalHeight();

      if (opt & SECTION.VERTICAL) {
         cur_pos[1] += (mesh_height * 2);
      }
      else if (opt & SECTION.HORIZONTAL) {
         cur_pos[0] += mesh_width * 2;
      }
   }

   return accum_pos;
}



export function Calculate_positions_no_gfx_update_recursive(parent, options = SECTION.INHERIT, _accum_pos = [parent.geom.pos[1], 0]) {

   const padding = [0, 0]
   const cur_pos = [parent.geom.pos[0], parent.geom.pos[1]];
   const accum_pos = _accum_pos;


   for (let i = 0; i < parent.children.boundary; i++) {

      const mesh = parent.children.buffer[i];
      let continue_recur = true;
      let opt = options

      if (options & SECTION.INHERIT) opt = parent.options

      const mesh_max_width = mesh.GetMaxWidth();
      if (parent.type & MESH_TYPE.SECTION_MESH) { // For meshes with a parent of type Section

         const c_x = cur_pos[0], c_y = cur_pos[1]; // curent position
         const parent_dimx = parent.GetMaxWidth(), parent_dimy = parent.GetTotalHeight(); // parent mesh dimention
         const parent_margx = parent.margin[0], parent_margy = parent.margin[1]; // parent mesh margin

         const new_pos = [(c_x - parent_dimx) + mesh_max_width + parent_margx, (c_y - parent_dimy) + mesh.geom.dim[1] + parent_margy, parent.geom.pos[2] + 1,];
         const pos_dif = [new_pos[0] - (mesh.GetCenterPosX()), new_pos[1] - mesh.GetCenterPosY(), new_pos[2] + 1];

         if ((mesh.type & MESH_TYPE.SECTION_MESH) === 0) { // Case mesh not of type section, have it update it's new pos-dim on a later when it's gfx exists.

            // IMPORTANT: CANNOT RUN BATCH HERE BECAUSE ANY NEW MESHES HAVEN'T BEEN INITIALIZED AND THEIR START IS 0
            if (!mesh.MoveNoGfxUpdate) console.error('Mesh does not have function .MoveNoGfxUpdate()', mesh.constructor.name, mesh.GetName())

            mesh.MoveNoGfxUpdate(pos_dif[0], pos_dif[1]);


            // HACK: Because scrollers bar is a Rect_mesh, it does not handle any children, like the scrollers handle
            if (mesh.type & MESH_TYPE.WIDGET_SCROLLER_BAR) {
               mesh.children.buffer[0].geom.pos[0] += pos_dif[0];
               mesh.children.buffer[0].geom.pos[1] += pos_dif[1];
            }

            continue_recur = false; // Stop recursion for mesh's children. Let the mesh deal with it's children positioning.
         }
         else { // Case  mesh is of type section  

            CopyArr2(mesh.geom.pos, new_pos);
         }

      }


      if (continue_recur)
         Calculate_positions_no_gfx_update_recursive(mesh, options, accum_pos)

      const mesh_width = mesh_max_width;
      const mesh_height = mesh.GetTotalHeight();

      if (opt & SECTION.VERTICAL) {
         cur_pos[1] += (mesh_height * 2);
      }
      else if (opt & SECTION.HORIZONTAL) {
         cur_pos[0] += mesh_width * 2;
      }
   }

   return accum_pos;
}

