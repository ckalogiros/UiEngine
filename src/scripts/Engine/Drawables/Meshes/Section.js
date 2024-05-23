"use strict";

import { CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Rect } from "./Rect_Mesh.js";
import { Widget_root_create_root, Widget_root_set_in_focus, Widget_root_buffer_get_mesh_by_rootidx, Widget_root_reset_gfx, Widget_root_resize_and_rerender, Widget_root_gfx_reset_mesh_per_vb_buffer } from "../../Core/MeshBuffer.js";
import { Batch_store } from "../../Batch/Batch.js";
import { Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { New_generic_buffer } from "../../Core/Buffers.js";
import { Find_parent_listen_event } from "../Operations/Recursions.js";
import { Relative_pos_comp_recalc_all } from "../Operations/RelativePosComponent.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_add_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Set_color_a } from "../Operations/MeshAttributesFunctions.js";







const temp_parent_listeners = New_generic_buffer();
temp_parent_listeners.Add(INT_NULL);
temp_parent_listeners.Add(INT_NULL);



export class Section extends Rect {

   // options: BIT-FIELD. Stores some state for 'this'.
   // pad:     [1,1] Stores pad for the meshes in-between space.
   // max_size:[1,1] Stores the max x-y size of all children meshes (not accumulative).
   // clampy Array: [x,y:[top,bottom,threshold]] clamp values. The threshold is a float, which added to the clamp value gives the absolute limit above/below to which a mesh should/should't be rendered 
   // total_margin


   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), margin = [4, 4], pos = [200, 400, 0], dim = [40, 40], col = TRANSPARENCY(BLUE, .6), name = 'SECTION UNAMED', style = [0, 3.5, 2.], is_debug_mesh) {

      super(pos, dim, col, is_debug_mesh);

      this.mesh_bufferidx = mesh_bufferidx;
      this.total_margin = [0, 0];
      this.options = options;
      const pad = [0, 0];
      this.StylesSetPad(pad);
      this.StylesSetMargin(margin);
      this.max_size = [0, 0];
      this.min_size = [0, 0];


      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

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


   AddItem(mesh, options=0x0) {

      this.options |= options;

      const idx = this.AddChild(mesh);

      if (this.root_bufferidx !== INT_NULL && mesh.root_bufferidx === INT_NULL) {
         mesh.AddToWidgetRootBuffer(this.root_bufferidx)
      }

      mesh.isFramebufferRendered = this.isFramebufferRendered;
      mesh.StateEnable(this.state.mask & MESH_STATE.ACTIVE);

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


   OptionsEnable(MASK=0x0){

      this.options |= MASK;
      for(let i=0; i <= this.children.boundary; i++){
      
         const child = this.children.buffer[i];
         if(child.options) child.OptionsEnable(MASK);
      }
   }


   Calc(options = _, target_child_idx) {

      const section = this;
      if (options === _) options = section.options


      const old_sizex = section.geom.dim[0];
      const old_sizey = section.geom.dim[1];

      
      if(section.options & SECTION.FIXED_W) section.max_size[0] = section.geom.dim[0];
      if(section.options & SECTION.FIXED_H) section.max_size[1] = section.geom.dim[1];


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
         if (options & SECTION.RESIZE_PARENT) CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         if (options & SECTION.RESIZE_PARENTX) section.geom.dim[0] = section.max_size[0];
         if (options & SECTION.RESIZE_PARENTY) section.geom.dim[1] = section.max_size[1];
      }


      // /** OPTIONS:EXPAND 
      //  * Expand width of items to match the max width of section, minus the margin.
      //  * Happens on a second pass of all items of current section, since each section may have different options for expand.
      //  * Only if the section has VERTICAL align for its items. 
      //  */
      // // if (options & SECTION.EXPAND && (options & (SECTION.RESIZE_PARENT | SECTION.RESIZE_PARENTX | SECTION.RESIZE_PARENTY))) {
      // // if (options & SECTION.EXPAND) {
      // //    Expand(section, options);
      // // }
      Expand(section, options);


      // Calculate the parent section's position, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      // Add the parent's new size offset, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      // if ((options & SECTION.TOP_DOWN) && (options & (SECTION.RESIZE_PARENT | SECTION.RESIZE_PARENTX | SECTION.RESIZE_PARENTY))) {
      //    section.geom.pos[0] += (section.max_size[0] - old_sizex) + section.StylesGetMargin(STYLES.AXIS.X);
      //    section.geom.pos[1] += (section.max_size[1] - old_sizey) + section.StylesGetMargin(STYLES.AXIS.Y);
      // }


      if (options & (SECTION.RESIZE_PARENT | SECTION.RESIZE_PARENTX | SECTION.RESIZE_PARENTY))
         section.SetMargin();

      Calculate_positions_recursive(section, options);


      // Update for the root
      // section.batch_fnidx = BATCH_FN_IDX.SET_POS2; // HACK
      // const update_data = {
      //    sizes: [2],
      //    data: [section.geom.dim[0], section.geom.dim[1]],
      // };
      // Batch_store(section, SHADER_ATTRIBUTES.POS2, update_data, _);

      return section.max_size;

   }


   Calc_no_gfx_update(options, target_child_idx) {
      // console.log('\n{=============================}');

      const section = this;
      if (options === _) options = section.options; // Here set as options: the passed options(de-activates any mesh self-set-options), or the mesh self-options

      if(section.options & SECTION.FIXED_W) section.max_size[0] = section.geom.dim[0];
      if(section.options & SECTION.FIXED_H) section.max_size[1] = section.geom.dim[1];

      Calculate_sizes_recursive(section, options, target_child_idx);


      // if (section.type & MESH_TYPE.WIDGET_SCROLLER) {
      //    section.geom.dim[0] = section.max_size[0]; // For scroller widgets, do not set the height
      //    // section.geom.defDim[0] = section.max_size[0];
      // }
      if (section.type & MESH_TYPE.WIDGET_DROP_DOWN) {
         CopyArr2(section.geom.dim, section.max_size); // Set size for the root dp.
         CopyArr2(section.geom.defDim, section.max_size); // Store to default for the root.
      }
      else {
         if (options & SECTION.RESIZE_PARENT) CopyArr2(section.geom.dim, section.max_size); // Set size for the root.
         if (options & SECTION.RESIZE_PARENTX) section.geom.dim[0] = section.max_size[0];
         if (options & SECTION.RESIZE_PARENTY) section.geom.dim[1] = section.max_size[1];
      }
      
      
      Expand(section, options);
      

      // Add the parent's new size offset, so that its items are positioned from top to bottom, (Ex. when a dropdown menu is opened). 
      // if ((options & SECTION.TOP_DOWN) && (options & (SECTION.RESIZE_PARENT | SECTION.RESIZE_PARENTX | SECTION.RESIZE_PARENTY))) {
      //    section.geom.pos[0] += (section.max_size[0] - old_sizex) + section.StylesGetMargin(STYLES.AXIS.X);
      //    section.geom.pos[1] += (section.max_size[1] - old_sizey) + section.StylesGetMargin(STYLES.AXIS.Y);
      // }


      section.SetMargin();
      // if (options & (SECTION.RESIZE_PARENT | SECTION.RESIZE_PARENTX | SECTION.RESIZE_PARENTY))
      //    section.SetMargin();

      Calculate_positions_no_gfx_update_recursive(section, options, section.geom.pos, target_child_idx);

      return section.max_size;

   }


   Recalc(options) {

      const section = this;

      this.Reset(section);
      return this.Calc(options);
   }


   Recalc_no_gfx_update(options, target_child_idx=INT_NULL) {

      const section = this;

      if(target_child_idx===INT_NULL)
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
   // GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL, params = null, run_for_children = true) {
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      // const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx, params);
      const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx);

      // if (run_for_children) {
      if (true) {
         for (let i = 0; i <= this.children.boundary; i++) {

            const child = this.children.buffer[i];
            // if (child) child.GenGfxCtx(FLAGS, specific_vb_groupidx, params);
            if (child) child.GenGfxCtx(FLAGS, specific_vb_groupidx);
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
               if(!child.Rerender)
                  console.log()
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



   SetMargin() {
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


   SetPosX(x) {

      super.SetPosX(x);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosXYNoGfxUpdate(x);
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

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         this.geom.pos[0] = x;
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.SetPosXNoGfxUpdate(x);
         }
      }
   }


   SetPosYNoGfxUpdate(y) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         this.geom.pos[1] = y;
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.SetPosYNoGfxUpdate(y);
         }
      }
   }


   SetPosXYNoGfxUpdate(x, y) {

      if(Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)){ // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.SetPosXYNoGfxUpdate(x, y);
         }
      }
   }



   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   OnClick(params) {

      const section = params.evt_params.target_mesh;

      STATE.mesh.SetClicked(section);

      if (section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const pos = section.GetPosXY();
         const right = pos[0] + section.geom.dim[0]*2;
         const bottom = pos[1] + section.geom.dim[1]*2;

         const point = MouseGetPos();
         // console.log(section)
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

            section.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS;
            STATE.mesh.SetGrabed(section);
            STATE.mesh.SetFocused(section);
            Widget_root_set_in_focus(section.root_bufferidx);


            return true;
         }


         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, Section_on_move_clbk, section);
         section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (section.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(section);
            STATE.mesh.SetFocused(section);
            section.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
            Widget_root_set_in_focus(section.root_bufferidx);
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

      const mouse_dif = MouseGetPosDif();


      // TODO: We can set all positions and dimentions and call 'Gl_set_pos_dim' for all meshes of the root
      if ((root.state.mask & MESH_STATE.IS_RESIZEABLE) && (mouse_dif.x !== 0 || mouse_dif.y !== 0)) {

         const dif = {x:mouse_dif.x / 2, y: -mouse_dif.y / 2};         
         
         // Set min dimentions. // TODO: Who decides for the minimum dimentions??????
         const pos = root.GetPosXY();
         const min_width = pos[0] + 200;
         const min_height = pos[1] + 200;
         // Cache
         const r = pos[0]+root.geom.dim[0]*2;
         const b = pos[1]+root.geom.dim[1]*2;

         let changes_hapened = false;

         if (dif.x > POSSITIVE || (dif.x < NEGATIVE &&  r + dif.x > min_width)) {
            changes_hapened = true;
         }
         else {
            if(dif.x !== 0 && r > min_width) dif.x = r - min_width; // Smooths the resize transition
            else dif.x = 0;
         }


         if (dif.y > POSSITIVE || (dif.y < NEGATIVE && b + dif.y > min_height)) {
            changes_hapened = true;
         }
         else {
            if(dif.y !== 0 && b > min_height) dif.y = b - min_height; // Smooths the resize transition
            else dif.y = 0;
         }


         if (changes_hapened) {


            Widget_root_reset_gfx(root.root_bufferidx)

            const root_pos = root.GetPosXY();
            const clip_top = root_pos[1];
            const clip_bottom = root_pos[1] + root.geom.dim[1]*2;
            const clip_right = root_pos[0] + root.geom.dim[0]*2;

            // Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
            for(let i=0; i <= root.children.boundary; i++){

               Clipy_from_tree_recursive(root.children.buffer[i], clip_top, clip_bottom);
            }
            // Clipx_from_group(root.group_bufferidxs[0], 0, clip_right);

            // First reset the buffer that holds all meshes(per vertex buffer), because the 'AddFromGfx' is gonna populate the buuffer with the added mesh
            Widget_root_gfx_reset_mesh_per_vb_buffer(root.root_bufferidx);
            Widget_root_resize_and_rerender(root.root_bufferidx, dif.x, dif.y, true);
         }


      }

   }


   ConstructListeners(parent_listeners = null, _Clbk = null) {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 

      // Create listen events for the section
      if (mesh.listeners) {
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

               if (!parent_listeners) {
                  parent_listeners = [null, null];
               }

               if (parent_listeners[i] === null) {
                  parent_listeners[i] = Find_parent_listen_event(i, mesh);
               }

               if (mesh.state.mask & MESH_STATE.IS_FAKE_EVENT || (Listen_event_types_get_type_from_index(i) & LISTEN_EVENT_TYPES.HOVER)) {
                  mesh.AddListenEvent(i, null, null, parent_listeners[i]);
               }
               else { // Else construct with Clbk and params
                  mesh.AddListenEvent(i, Clbk, evt_params, parent_listeners[i]);
               }

               parent_listeners[i] = mesh.listeners.buffer[i];
            }
         }
      }

      // Construct listen events for each section's item.
      for (let i = 0; i <= mesh.children.boundary; i++) {

         const child = mesh.children.buffer[i];
         if (child && (child.state.mask & MESH_STATE.ACTIVE)) {

            if (child.ConstructListeners) { // Call the widget's specific .ConstructListeners() to handle the widget's listen events creation

               child.ConstructListeners([parent_listeners[0], parent_listeners[1]]);
            }
         }
      }
   }





   /*******************************************************************************************************************************************************/
   // Transformations
   /*******************************************************************************************************************************************************/

   Move(x, y) {
      alert('Section.js\nMove')
      if (x === 0 && y === 0) return;
      
      // HERE: We need a way to get the unif idx by name: 'u_wposxy' 
      Mesh_unif_add_vb_root_wpos(this.root_posidx, [x,y]);
      
      
   }
   
   
   MoveNoGfxUpdate(x, y) {
      
      // alert('Section.js\nMoveNoGfxUpdate')
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
      
   
   TEMP_recalc(x, y) {
      
      // alert('Section.js\nTEMP_recalc')
      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.TEMP_recalc(x, y);
      }

   }
      
   
   TEMP_recalc_x(x) {
      
      this.geom.pos[0] += x;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.TEMP_recalc_x(x);
      }

   }


   SetPosXY(x, y) { Section_set_posxy_children_recursive([x, y], this); }


   SetPosX(x) { super.SetPosX(x); }


   SetColorAlpha(alpha) {

      Set_color_a(this, alpha);

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         Set_color_a(child, alpha);
      }
   }


   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false

      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         child.SetIsGfxInserted(flag)
      }
   }


   Resize() {
      alert('IMPLEMENT ME\nResize()\nSection.js')
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




export function Section_on_move_clbk(params) {

   const section = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (section.StateCheck(MESH_STATE.IN_GRAB) === 0 && section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      section.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_dif = MouseGetPosDif();
   if (mouse_dif.x === 0 && mouse_dif.y === 0) return;

   Mesh_unif_add_vb_root_wpos(section.root_posidx, [mouse_dif.x, -mouse_dif.y])

   // Widget_root_gfx_add_unif_wpos_per_vb(section.root_bufferidx, [mouse_dif.x, -mouse_dif.y]);

}



export function Expand(parent, options) {
   
   // const width = parent.geom.dim[0] - parent.StylesGetMargin(STYLES.AXIS.X);
   const width = parent.geom.dim[0] + parent.StylesGetMargin(STYLES.AXIS.X);
   // const width = parent.geom.dim[0] ;
   let opt = options

   for (let i = 0; i <= parent.children.boundary; i++) {

      const child = parent.children.buffer[i];
      if (options & SECTION.INHERIT) opt = parent.options;

      if (child.type & MESH_TYPE.WIDGET_LABEL) {
         // // For other than section widgets, the parent should control child expansion 
         if(options & SECTION.EXPAND) {
            // child.geom.dim[0] = width - (parent.StylesGetMargin(STYLES.AXIS.X));
            child.geom.dim[0] = width;
            child.geom.defDim[0] = child.geom.dim[0];
         }
      }
      else if (child.type & MESH_TYPE.SECTION_MESH) {
         // For section widgets, the child's options should control child expansion 
         
         if (opt & SECTION.VERTICAL) {
            if(child.options & SECTION.EXPAND) {
               child.geom.dim[0] = width;
               child.geom.defDim[0] = child.geom.dim[0];
            }
         }
         else if (opt & SECTION.HORIZONTAL) {
            if(child.options & SECTION.EXPAND) {
               child.geom.dim[0] = width;
               child.geom.defDim[0] = child.geom.dim[0];
            }
         }

         Expand(child, opt);
      }
   }
}



// TODO: For calculating multi-word text, if we need separate flags (HORIZONTAL | VERTICAL), we need to store the flags in the mesh. 
export function Calculate_sizes_recursive(parent, options, target_child_idx, recur_cnt=0) {


   const prev_size = [
      // parent.max_size[0],
      // parent.max_size[1],
      parent.max_size[0],
      parent.max_size[1],
      // parent.max_size[1] + (parent.StylesGetMargin(STYLES.AXIS.Y)),
   ];
   const accum_size_per_section = [0, 0]; // TODO: See how accum_size_per_section is workin and remove it if there is another solution
   parent.max_size[0] = 0
   parent.max_size[1] = 0

   let opt = (options !== undefined) ? options : parent.options
   
   // recur_cnt++

   const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;


   if (parent.text_mesh) {

      if (parent.options & SECTION.VERTICAL) {

         accum_size_per_section[0] = parent.text_mesh.GetMaxWidth();
         parent.max_size[1] += parent.text_mesh.geom.dim[1];

         if (parent.max_size[0] < accum_size_per_section[0])
            parent.max_size[0] = parent.geom.dim[0]; // For horizontal, grow to the max width of all meshes
      }
      else if (parent.options & SECTION.HORIZONTAL) {

         accum_size_per_section[0] += parent.text_mesh.GetMaxWidth();
         parent.max_size[0] += parent.text_mesh.GetMaxWidth();

         if (parent.max_size[1] < accum_size_per_section[1])
            parent.max_size[1] = parent.geom.dim[1];  // For horizontal, grow to the max height of all meshes
      }
   }

   for (let i = target_idx; i <= parent.children.boundary; i++) {

      const mesh = parent.children.buffer[i];
      const pad = mesh.StylesGetPad();

      // console.log('  Resize', mesh.GetName())

      if (mesh.type & MESH_TYPE.SECTION_MESH) {

         if ((mesh.options & SECTION.INHERIT)===0) opt = mesh.options;

         
         Calculate_sizes_recursive(mesh, opt, _, recur_cnt++); // Recurse if child mesh is of type of Section
         // recur_cnt++
         if ((mesh.options & SECTION.INHERIT)===0) opt = parent.options; // Roll back to the options


         if ((mesh.type & MESH_TYPE.WIDGET_SCROLLER) === 0) {

            mesh.geom.dim[0] = mesh.max_size[0];
            mesh.geom.dim[1] = mesh.max_size[1];

            // Update mesh's default dim
            mesh.geom.defDim[0] = mesh.max_size[0];
            mesh.geom.defDim[1] = mesh.max_size[1];

         }

         mesh.SetMargin();

         if (opt & SECTION.VERTICAL) {
            if ((parent.options & SECTION.FIXED_W)===0 && parent.max_size[0] < mesh.geom.dim[0])
               parent.max_size[0] = mesh.geom.dim[0]
            
            if((parent.options & SECTION.FIXED_H)===0) parent.max_size[1] += mesh.geom.dim[1]
            // if((parent.options & SECTION.FIXED_H)===0) parent.max_size[1] = mesh.geom.dim[1]
         }
         else if (opt & SECTION.HORIZONTAL) {
            if((parent.options & SECTION.FIXED_W)===0) parent.max_size[0] += mesh.geom.dim[0]
            if ((parent.options & SECTION.FIXED_H)===0 && parent.max_size[1] < mesh.geom.dim[1]) parent.max_size[1] = mesh.geom.dim[1]
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
            if ((parent.options & SECTION.FIXED_W)===0 && parent.max_size[0] < accum_size_per_section[0])
               parent.max_size[0] = accum_size_per_section[0];  // Keep the max width of all meshes in Vertical mode.

         }
         else if (opt & SECTION.HORIZONTAL) {

            accum_size_per_section[0] += mesh.GetMaxWidth();
            parent.max_size[0] += mesh.GetMaxWidth();

            accum_size_per_section[1] = mesh.geom.dim[1];
            if ((parent.options & SECTION.FIXED_H)===0 && parent.max_size[1] < accum_size_per_section[1])
               parent.max_size[1] = mesh.geom.dim[1];  // Keep the max height of all meshes in Horizontal mode.
         }
      }
      else { // Case the current item is not a section either a text, accumulate its size
         
        
         if (opt & SECTION.VERTICAL) {

            // accum_size_per_section[1] += mesh.geom.dim[1];
            accum_size_per_section[1] += mesh.geom.dim[1] + pad[1];
            accum_size_per_section[0] = mesh.geom.dim[0];

            if ((parent.options & SECTION.FIXED_H)===0) {
               // parent.max_size[1] += mesh.geom.dim[1] + pad[1];
               parent.max_size[1] += mesh.geom.dim[1];
            }
            
            if (parent.max_size[0] < accum_size_per_section[0])
               parent.max_size[0] = mesh.geom.dim[0] ; // For horizontal, grow to the max width of all meshes


            if ((parent.options & SECTION.FIXED_W)===0 && parent.max_size[0] <= accum_size_per_section[0])
               parent.max_size[0] = mesh.geom.dim[0] ; // For horizontal, grow to the max width of all meshes
         }
         else if (opt & SECTION.HORIZONTAL) {

            accum_size_per_section[0] += mesh.geom.dim[0] + pad[0];
            // accum_size_per_section[0] += mesh.geom.dim[0];
            accum_size_per_section[1] = mesh.geom.dim[1];

            parent.max_size[0] += mesh.geom.dim[0] + pad[0];
            // parent.max_size[0] += mesh.geom.dim[0];

            if (parent.max_size[1] < accum_size_per_section[1])
               parent.max_size[1] = mesh.geom.dim[1];  // For horizontal, grow to the max height of all meshes
         }
         // console.log(mesh.GetName(), mesh.geom.dim)
      }
   }

               
   if(parent.min_size[0] < parent.max_size[0])
      parent.min_size[0] = parent.max_size[0];
   if(parent.min_size[1] < parent.max_size[1])
      parent.min_size[1] = parent.max_size[1];

   const dif_max_size = [
      parent.max_size[0] - prev_size[0],
      parent.max_size[1] - prev_size[1],
      recur_cnt,
   ];
   return dif_max_size

}






export function Calculate_positions_recursive(parent, options) {

   const pad = [0, 0]

   const root = Widget_root_buffer_get_mesh_by_rootidx(parent.root_bufferidx);
   const pos = root.GetPosXYZ(); 
   const top  = (root.mesh_bufferidx !== parent.mesh_bufferidx) ? pos[0] + parent.geom.pos[0] + parent.StylesGetMargin(STYLES.AXIS.X) : pos[0] + parent.StylesGetMargin(STYLES.AXIS.X); 
   const left = (root.mesh_bufferidx !== parent.mesh_bufferidx) ? pos[1] + parent.geom.pos[1] + parent.StylesGetMargin(STYLES.AXIS.Y) : pos[1] + parent.StylesGetMargin(STYLES.AXIS.Y);
   const cur_pos = [top, left] 

   if (parent.text_mesh) {
      const rel_pos = [ (cur_pos[0]) - root.geom.pos[0], (cur_pos[1] ) - root.geom.pos[1], parent.geom.pos[2] + 1 ];
      parent.text_mesh.SetPosXYNoGfxUpdate(rel_pos[0], rel_pos[1]);
      // console.log('TEXT: ', rel_pos, parent.text_mesh.geom.dim, parent.text_mesh.GetName())
   }
   
   for (let i = 0; i <= parent.children.boundary; i++) {
      
      const mesh = parent.children.buffer[i];
      let continue_recur = true;
      let opt = options
      
      if (options & SECTION.INHERIT) opt = parent.options

      const rel_pos = [ (cur_pos[0]) - root.geom.pos[0], (cur_pos[1] ) - root.geom.pos[1], parent.geom.pos[2] + 1 ];


      if ((mesh.type & MESH_TYPE.SECTION_MESH) === 0) { // Case mesh not of type section, have it update it's new pos-dim on a later when it's gfx exists.
         // alert('1010101010')
         continue_recur = false; // Stop recursion for mesh's children. Let the mesh deal with it's children positioning.
      }
      else { // Case  mesh is of type section  
         // alert('10101010')
         CopyArr2(mesh.geom.pos, rel_pos);
         CopyArr2(mesh.geom.defPos, mesh.geom.pos);
         const update_data = {
            sizes: [2],
            data: [rel_pos[0], rel_pos[1], mesh.geom.dim[0], mesh.geom.dim[1],]
         };

         // mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4_POS2; // HACK
         mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4_POS2; // HACK
         Batch_store(mesh, SHADER_ATTRIBUTES.WPOS_TIME4, update_data, _);
      }

      if (continue_recur) { // Continue recursively, if the mesh does not handle any its children.
         Calculate_positions_recursive(parent, options);

      }


      // Increment current position tracker
      if (parent.options & SECTION.VERTICAL) {
         cur_pos[1] += mesh.geom.dim[1] * 2;
      }
      else if (parent.options & SECTION.HORIZONTAL) {
         cur_pos[0] += mesh.geom.dim[0] * 2;
      }

   }



}



export function Calculate_positions_no_gfx_update_recursive(parent, options, curr, target_child_idx) {

   
   const cur_pos = [
      curr[0] + parent.StylesGetMargin(STYLES.AXIS.X), 
      curr[1] + parent.StylesGetMargin(STYLES.AXIS.Y),
   ];
   
   
   const target_idx = (target_child_idx != undefined) ? (target_child_idx >= 0) ? target_child_idx : 0 : 0;

   for (let i = target_idx; i <= parent.children.boundary; i++) {
      
      const mesh = parent.children.buffer[i];
      let continue_recur = true;
      let opt = options


      if (options & SECTION.INHERIT) opt = parent.options

      
      const rel_pos = [cur_pos[0], cur_pos[1]];
      
      if(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC){
         
         mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);
         continue_recur = false;
      }
      else if(mesh.type & MESH_TYPE.WIDGET_SLIDER){

         mesh.SetPosXYNoGfxUpdate(rel_pos[0], rel_pos[1]);
         continue_recur = false;
      }
      else if(mesh.type & MESH_TYPE.WIDGET_DROP_DOWN){

         // mesh.SetPosXYNoGfxUpdate(rel_pos[0], rel_pos[1]);
         mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
         continue_recur = false;
      }
      else if (mesh.type & MESH_TYPE.SECTION_MESH) 
      { // For meshes with a parent of type Section
         
         mesh.geom.pos[0] = rel_pos[0]; 
         mesh.geom.pos[1] = rel_pos[1];
         
         // Case of menu bar, that has text directly as a child
         if(mesh.text_mesh){
            mesh.text_mesh.geom.pos[0] = rel_pos[0] 
            mesh.text_mesh.geom.pos[1] = rel_pos[1]
         }
      }
      else{

         // mesh.SetPosXYNoGfxUpdate(rel_pos[0], rel_pos[1]);
         mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);

         if(mesh.type & MESH_TYPE.WIDGET_SWITCH) continue_recur = false;
         if(mesh.text_mesh) continue_recur = false;
      }


      if(parent.rel_comp){
         Relative_pos_comp_recalc_all(parent);
         continue_recur = false;
      }

      if (continue_recur) { // Continue recursively, if the mesh does not handle any its children.
         Calculate_positions_no_gfx_update_recursive(mesh, opt, cur_pos);
      }


      // Increment current position tracker
      if (parent.options & SECTION.VERTICAL) {
         cur_pos[1] += mesh.geom.dim[1] * 2;
      }
      else if (parent.options & SECTION.HORIZONTAL) {
         cur_pos[0] += mesh.geom.dim[0] * 2;
      }

   }

}

// export function Calculate_positions_no_gfx_update_recursive(parent, options) {

//    const pad = [0, 0]

//    const root = Widget_root_buffer_get_mesh_by_rootidx(parent.root_bufferidx);
//    // const pos = root.GetPosXY(); 
//    const pos = root.geom.pos; 
//    const top  = pos[0]  + parent.geom.pos[0] + parent.StylesGetMargin(STYLES.AXIS.X); 
//    const left = pos[1]  + parent.geom.pos[1] + parent.StylesGetMargin(STYLES.AXIS.Y);
  
//    const cur_pos = [top, left] 

   
//    for (let i = 0; i <= parent.children.boundary; i++) {
      
//       const mesh = parent.children.buffer[i];
//       let continue_recur = true;
//       let opt = options
      
//       if (options & SECTION.INHERIT) opt = parent.options

//       const rel_pos = [ (cur_pos[0]) - root.geom.pos[0], (cur_pos[1] ) - root.geom.pos[1], parent.geom.pos[2] + 1 ];


//       if(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC){
         
//          mesh.geom.pos[0] += rel_pos[0] 
//          mesh.geom.pos[1] += rel_pos[1]
//       }
//       else if(mesh.type & MESH_TYPE.WIDGET_SCROLLER){
//          alert('CONDITIONAL ALERT\nSection\n->Calculate_positions_no_gfx_update_recursive\n->For Scroller')
//          mesh.ScrollerAlign();
//          // console.log('WIDGET_SCROLLER: ', rel_pos, mesh.geom.dim, mesh.GetName())
//          continue_recur = false;
//       }
      
//       else if (mesh.type & MESH_TYPE.SECTION_MESH) 
//          { // For meshes with a parent of type Section
            
//             mesh.geom.pos[0] = rel_pos[0]; 
//             mesh.geom.pos[1] = rel_pos[1];
            
//             // Case of menu bar, that has text directly as a child
//             if(mesh.text_mesh){
//                mesh.text_mesh.geom.pos[0] += rel_pos[0] 
//                mesh.text_mesh.geom.pos[1] += rel_pos[1]
//             }
//          console.log('SECTION: ', rel_pos, mesh.geom.dim, mesh.GetName())
//       }
//       else{
//          // console.log(mesh.constructor.name, mesh.GetName(), mesh.geom.pos)

//          // mesh.TEMP_recalc(rel_pos[0], rel_pos[1]);
//          // mesh.SetXYNoGfxUpdate(rel_pos[0], rel_pos[1]);
//          mesh.MoveNoGfxUpdate(rel_pos[0], rel_pos[1]);

//          if(mesh.type & MESH_TYPE.WIDGET_SWITCH) continue_recur = false;
//          if(mesh.text_mesh) continue_recur = false;
//          // console.log('WIDGET: ', rel_pos, mesh.text_mesh.geom.pos, mesh.text_mesh.geom.dim, mesh.GetName())
//       }

//       // With this implementation, we calc for all meshes that belong to a parent that 
//       // has relative positioning for its children, and then we re-calc the mesh and all its children
//       // again, to position them relative right.
//       // A better aproach is to re-calc the relative position at the level where the 'mesh' has the 'rel_comp'(not the 'parent')
//       // and skip (continue_recur=false) the calc of its children. The problem is that the y axis is not positioned at all,
//       // plus we need to add (Relative_pos_comp_recalc_right()) all the matgins of the parent of 'mesh'
//       if(parent.rel_comp){
//          // Relative_pos_comp_recalc_right(parent);
//          Relative_pos_comp_recalc_all(parent);
//          continue_recur = false;
//       }

//       if (continue_recur) { // Continue recursively, if the mesh does not handle any its children.
//          Calculate_positions_no_gfx_update_recursive(mesh, opt);
//       }


//       // Increment current position tracker
//       if (parent.options & SECTION.VERTICAL) {
//          cur_pos[1] += mesh.geom.dim[1] * 2;
//       }
//       else if (parent.options & SECTION.HORIZONTAL) {
//          cur_pos[0] += mesh.geom.dim[0] * 2;
//       }

//    }

// }




















































































































































































































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
