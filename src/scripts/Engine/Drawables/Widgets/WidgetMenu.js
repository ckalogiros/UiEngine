"use strict";

import { AddArr2, CopyArr3 } from "../../../Helpers/Math/MathOperations.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { M_Buffer } from "../../Core/Buffers.js";
import { Widget_Button } from "./WidgetButton.js";
import { Widget_Label } from "./WidgetLabel.js";
import { Align_self } from "../Operations/Alignment.js";
import { TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Create_widget_close_btn, Create_widget_minimize_btn } from "../../Core/CreateWidget.js";
import { Widget_root_add_mesh, Widget_root_create_root } from "../../Core/MeshBuffer.js";
import { Batch_store } from "../../Batch/Batch.js";
import { GREY, WHITE } from "../Material/Base/Colors.js";



const _fontsize = 10;
export class Widget_Menu_Bar extends Widget_Label {

   close_btn_idx;
   minimize_btn_idx;

   // UNUSED: The align param is unused from the Widget_Label class
   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, align, pos, col = GREY[3], text_col = WHITE, pad = [14, 6], bold = .4, style = [2, 5, 2], font = TEXTURES.MSDF_CONSOLAS_1024) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, align, pos, _fontsize, col, text_col, pad, bold, font, style);

      if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT) {
         this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);
      }

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle(style);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


      this.SetName('Widget_Menu_Bar');
      this.type |= MESH_TYPE.WIDGET_MENU_BAR;

      this.close_btn_idx = INT_NULL;
      this.minimize_btn_idx = INT_NULL;

   }


   AddCloseButton(ROOT_WIDGET_FLAGS, root, text, fontsize = 0, col = GREY[3], text_col = WHITE, pad = [4, 2], bold = .4, style = [6, 5, 3], font = TEXTURES.MSDF_CONSOLAS_1024) {

      if (!fontsize) fontsize = this.text_mesh.geom.dim[0];

      const pos = [0, 0, 0];
      CopyArr3(pos, this.geom.pos)
      pos[2] += 1; // Put close button in front of the parent widget.
      // pos[0] += this.geom.dim[0] - ; // Align right

      const close_btn = Create_widget_close_btn(ROOT_WIDGET_FLAGS, root, text, pos, fontsize, col, text_col, pad, bold, style, font);
      close_btn.geom.pos[0] += this.geom.dim[0] - close_btn.geom.dim[0]; // Align right
      close_btn.text_mesh.geom.pos[0] += this.geom.dim[0] - close_btn.geom.dim[0]; // Align right
      close_btn.SetName('close_btn');

      // this.geom.dim[0] += close_btn.geom.dim[0]; // Widen the menu rect area by the width of the close button
      this.geom.dim[0] += close_btn.geom.dim[0] * 2;
      this.geom.dim[1] = (this.geom.dim[1] < close_btn.geom.dim[1]) ? close_btn.geom.dim[1] + this.pad[1] : this.geom.dim[1];

      this.close_btn_idx = this.AddChild(close_btn);

      // Realign menu's children
      this.ReAlign();
   }


   AddMinimizeButton(ROOT_WIDGET_FLAGS, root, fontsize = 0, col = GREY[3], text_col = WHITE, pad = [4, 2], bold = .4, font = TEXTURES.MSDF_CONSOLAS_1024, style = [6, 5, 3]) {

      if (!fontsize) fontsize = this.text_mesh.geom.dim[0];
      let pos = [100, 200, 0]
      pos[2] += 1; // Put close button in front of the parent widget.

      const minimize_btn = Create_widget_minimize_btn(ROOT_WIDGET_FLAGS, root, pos, fontsize, col, text_col, pad, bold, style);
      minimize_btn.text_mesh.geom.pos[0] += this.geom.dim[0] - minimize_btn.geom.dim[0]; // Align right
      minimize_btn.SetName('minimize_btn')

      this.geom.dim[0] += minimize_btn.geom.dim[0];
      this.geom.dim[1] = (this.geom.dim[1] < minimize_btn.geom.dim[1]) ? minimize_btn.geom.dim[1] + this.pad[1] : this.geom.dim[1];

      this.minimize_btn_idx = this.AddChild(minimize_btn);

      this.ReAlign();

   }


   Destroy(_this) {

      // Menu's children(close/minimize etc) destruction
      for (let i = 0; i <= _this.children.boundary; i++) {

         const child = _this.children.buffer[i];
         child.Destroy();
      }

      // Menus's destruction
      super.Destroy();
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      this.text_mesh.root_bufferidx = root_bufferidx;
      Widget_root_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);

      if (this.close_btn_idx !== INT_NULL) {

         const close_btn = this.children.buffer[this.close_btn_idx];
         close_btn.AddToWidgetRootBuffer(root_bufferidx)
      }

      if (this.minimize_btn_idx !== INT_NULL) {

         const minimize_btn = this.children.buffer[this.minimize_btn_idx];
         minimize_btn.AddToWidgetRootBuffer(root_bufferidx)
      }
   }


   /*******************************************************************************************************************************************************/
   // Graphics
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx) {

      const gfx = super.GenGfxCtx(FLAGS, gfxidx); // For the menu meshes

      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes
         const child = this.children.buffer[i];
         child.GenGfxCtx(FLAGS, gfxidx)
      }
      return gfx;
   }


   Render() {

      super.Render(); // For the menu meshes

      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes

         const child = this.children.buffer[i];
         if (!child.is_gfx_inserted) { child.Render(); }
         if (!child.text_mesh.is_gfx_inserted) { child.text_mesh.Render(); }
      }
   }



   /*******************************************************************************************************************************************************/
   // Setters-Getters

   /** Return type: Array. Returns an array of all widgets meshes */
   GetAllMeshes() {

      let all_meshes = [this, this.text_mesh];
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i]
         all_meshes = child.GetAllMeshes(all_meshes)
      }
      return all_meshes;
   }



   /*******************************************************************************************************************************************************/
   // Events Handling

   // SEE ### OnMove Events Implementation Logic
   OnMove(params) {

      // The 'OnMove' function is called by the timeInterval.
      // The timeInterval has been set by the 'OnClick' event.
      const menu = params.params;
      const text_mesh = menu.text_mesh;

      // Destroy the time interval and the Move operation, if the mesh is not grabed
      // MESH_STATE.IN_GRAB is deactivated upon mouse click up in Events.js.
      if (menu.StateCheck(MESH_STATE.IN_GRAB) === 0 && menu.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = menu.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         TimeIntervalsDestroyByIdx(intervalIdx);
         menu.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.MOVE);

         return;
      }

      // Move menu widget
      const mouse_pos = MouseGetPosDif();
      menu.geom.MoveXY(mouse_pos.x, -mouse_pos.y, menu.gfx);


      // Move menu children widgets(close/minimize buttons)
      for (let i = 0; i <= menu.children.boundary; i++) {

         const widget_child = menu.children.buffer[i];
         widget_child.geom.MoveXY(mouse_pos.x, -mouse_pos.y, widget_child.gfx)
         widget_child.text_mesh.geom.MoveXY(mouse_pos.x, -mouse_pos.y, widget_child.text_mesh.gfx)
      }

   }


   // SEE ### Construct Listeners
   ConstructListeners(_root = null) {

      // const mesh = (_mesh) ? _mesh : this; // If in recursion, use as the current mesh the passed param. 
      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
      // console.log('****', mesh.GetName(), mesh.listeners.buffer)

      const root_evt = root.listeners.buffer;

      for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

         for (let i = 0; i <= mesh.children.boundary; i++) {

            const child = mesh.children.buffer[i];
            if (child) {
               const evt = child.listeners.buffer[etypeidx];
               if (evt) { // If event is not null
                  const target_params = {
                     EventClbk: null,
                     targetBindingFunctions: null,
                     target_mesh: child,
                     params: null,
                  }
                  child.AddListenEvent(etypeidx, child.OnClick, target_params, root_evt);
               }
            }
         }
      }
   }



   /*******************************************************************************************************************************************************/
   // Alignment

   ReAlign() {

      // Realign menu's text
      this.Align(ALIGN.LEFT, this.pad);

      let pad = [this.pad[0], this.pad[1]];

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         Align_self(ALIGN.RIGHT, this.geom, _, child.geom, pad); // Align the close/minimize buttons area_mesh to the menu area mesh.
         child.Align(ALIGN.RIGHT, pad); // Also we need to update the close/minimize buttons text_mesh position(by aligning)
         pad[0] += this.children.buffer[i].geom.dim[0] * 2; // Each child widget of the menu is positioned relative to the previous child.
      }

   }


   Reposition_post(pos_dif) {

      this.MoveXYZ(pos_dif);
      this.text_mesh.MoveXYZ(pos_dif);

      // Menu's children(close/minimize etc) destruction
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         child.Reposition_post(pos_dif);
      }
   }


   Reposition_pre(pos_dif) {
      console.error('NO BATCH CREATED')
      AddArr2(this.geom.pos, pos_dif);
      this.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(this, _, { pos: pos_dif }, _);

      AddArr2(this.text_mesh.geom.pos, pos_dif);
      this.text_mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(this.text_mesh, _, { pos: pos_dif }, _);

      // Menu's children(close/minimize etc) destruction
      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         child.Reposition_pre(pos_dif);
      }
   }



   /*******************************************************************************************************************************************************/
   // Transformations

   Move(x, y) {

      if (x === 0 && y === 0) return;

      // Move 'this' text
      this.geom.MoveXY(x, y, this.gfx);
      this.text_mesh.geom.MoveXY(x, y, this.text_mesh.gfx);

      // Move menu children widgets(close/minimize buttons)
      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         child.geom.MoveXY(x, y, child.gfx);
         child.text_mesh.geom.MoveXY(x, y, child.text_mesh.gfx);
      }
   }

}


export class Close_Button extends Widget_Button {

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, text, pos, fontsize, col = GREY[3], text_col = WHITE, pad = [0, 0], bold = .4, style = [6, 5, 3], font = TEXTURES.MSDF_CONSOLAS_1024) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, _, pos, fontsize, col, text_col, pad, bold, style, font);

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)

      // Set a callback function for the destruction of the menu and its window on clicking the close button.
      const params = {
         source_params: this,
         target_params: root, // root should be the root widget from which the recursive destruction should start.
         // Clbk: root.OnCloseButtonClick, // The callback that will destroy the root and all of its children(recursive)
      }
      this.eventCallbacks.Add(params); // Pass the root and the callback for destroying the parent widget

   }



   /*******************************************************************************************************************************************************/
   // Events handling

   OnClick(params) {

      const widget_close_btn = params.target_params.target_mesh;
      widget_close_btn.OnClose();
      return true; // Needed for the listen event not to propagate further, after widget destruction
   }


   OnClose() {

      console.log('OnClose', this);

      /** The Scema of the 'params', constructed for the 'eventCallbacks'
         source_params: this,
         target_params: root,
       */
      const params = this.eventCallbacks.buffer[0]; // HACK: We must set up an index clarification for eventCallbacks buffer. 
      const root = params.target_params
      root.Destroy(root);

   }

}


export class Widget_Minimize extends Widget_Button {

   toggle; // On/Off
   stored_children_meshes; // Store all children meshes of the root, to maximize the widget back to normal. 
   stored_children_events; // Store the 'children' buffer of the roots EventListeners (class).

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, pos = [100, 200, 0], fontsize = 5, col = GREY[3], text_col, pad = [6, 2], bold = .5, style = [0, 4, 1.8], font) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, '- minimize', ALIGN.RIGHT, pos, fontsize, col, text_col, pad, bold, style, font);

      this.toggle = false;
      this.store_children_meshes = null;
      this.stored_children_events = new Array(LISTEN_EVENT_TYPES_INDEX.SIZE); // Store the 'children' buffer of the roots EventListeners (class). 

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)

      const params = {
         source_params: this,
         target_params: root,
      }
      // The eventCallbacks are going to run from the OnClick() in Widget_Button class.
      this.eventCallbacks.Add(params); // Pass the root and the callback for destroying the parent widget

   }


   OnClick(_params) {

      const widget_minimize_btn = _params.target_params.target_mesh;
      const params = widget_minimize_btn.eventCallbacks.buffer[0]; // HACK: We must set up an index clarification for eventCallbacks buffer. 
      widget_minimize_btn.OnMinimize(params);
      return true; // Needed for the listen event not to propagate further, after widget destruction
   }


   OnMinimize(params) {

      const minim_mesh = params.source_params;
      const root = params.target_params;
      const point = MouseGetPos();
      const m = minim_mesh.geom;

      if (Check_intersection_point_rect(m.pos, m.dim, point, [0, 0])) {

         STATE.mesh.SetClicked(minim_mesh);
         // STATE.mesh.SetFocused(root);


         if (root) {

            if (!minim_mesh.toggle) {  // Maximize - toggle on

               // Copy root's children to a buffer
               minim_mesh.stored_children_meshes = new M_Buffer(root.children);


               Reset_gfx_from_parent_recursive(root);
               // Vertex_buffer_reset(root.gfx);
               // Index_buffer_reset(root.gfx);


               { // Create new minimized widget and add to the root

                  const menu_bar = root.children.buffer[0]; // TODO: First child suppose to be the menu_bar. What happens if the btn is at a different index???

                  root.children.Reset();
                  root.AddChild(menu_bar);

                  minim_mesh.text_mesh.SetText('+ maximize');
                  minim_mesh.text_mesh.UpdateText('+ maximize');
                  minim_mesh.toggle = true;

                  CopyArr3(root.geom.defPos, root.geom.pos); // Set current pos as the default pos.
                  // HACK: Store the window area(root section) to the defDim var, to remember its original window's dimentions before the minimization
                  CopyArr3(root.geom.defDim, root.geom.dim); // Set current pos as the default pos.

                  // Reposition minimized widget
                  root.geom.pos[1] -= root.geom.dim[1] - root.children.buffer[0].geom.dim[1] - root.margin[1];
                  root.geom.pos[0] = root.children.buffer[0].geom.pos[0];

                  root.geom.dim[0] = root.children.buffer[0].geom.dim[0];
                  root.geom.dim[1] = root.children.buffer[0].geom.dim[1];

                  // Set Graphics
                  root.Render();
               }

            }
            else { // Maximize - toggle off

               // Gfx_deactivate_no_listeners_touch(root);
               Reset_gfx_from_parent_recursive(root);
               // Vertex_buffer_reset(root.gfx);
               // Index_buffer_reset(root.gfx);

               root.children.Reset();
               root.children = minim_mesh.stored_children_meshes;

               minim_mesh.text_mesh.SetText('- minimize');
               minim_mesh.text_mesh.UpdateText('- minimize');

               { // Set widget pos and render
                  root.geom.pos[1] = root.geom.defPos[1];
                  root.geom.pos[0] = root.geom.defPos[0];

                  root.geom.dim[0] = root.geom.defDim[0];
                  root.geom.dim[1] = root.geom.defDim[1];

                  root.Render();
               }

               minim_mesh.toggle = false;
            }
         }

         return true;
      }

      return false;
   }

}



function Reset_gfx_from_parent_recursive(mesh) {

   for (let i = 0; i <= mesh.children.boundary; i++) {
      const child = mesh.children.buffer[i];
      // console.log('1111W', child.GetName())
      if (child)
         Reset_gfx_from_parent_recursive(child);
   }

   // NOTE: Avoid calling Reset on an alredy reseted buffer should take place in Vertex_buffer_reset() and Index_buffer_reset()
   Vertex_buffer_reset(mesh.gfx);
   Index_buffer_reset(mesh.gfx.ib.idx);

   mesh.is_gfx_inserted = false; // So that we can re-render the mesh to the vertex buffer.
   if (mesh.text_mesh) { // Do this for any text meshes.
      Vertex_buffer_reset(mesh.text_mesh.gfx);
      Index_buffer_reset(mesh.text_mesh.gfx.ib.idx);
      mesh.text_mesh.is_gfx_inserted = false;
   }
}

