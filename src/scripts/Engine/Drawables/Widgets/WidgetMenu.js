"use strict";

import { AddArr2, CopyArr2, CopyArr3 } from "../../../Helpers/Math/MathOperations.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { M_Buffer, New_generic_buffer } from "../../Core/Buffers.js";
import { Widget_Button } from "./WidgetButton.js";
import { CalculateArea } from "./WidgetLabel.js";
import { Align_self_get_dif } from "../Operations/Alignment.js";
import { TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Create_widget_close_btn, Create_widget_minimize_btn, Create_widget_text } from "../../Core/CreateWidget.js";
import { Widget_root_add_mesh, Widget_root_reset_gfx } from "../../Core/MeshBuffer.js";
import { GREY, WHITE } from "../Material/Base/Colors.js";
import { Calculate_positions_no_gfx_update_recursive, Section } from "../Meshes/Section.js";
import { Font_get_font_advancex } from "../../Loaders/Font/ChlumskyFontMetricsLoader.js";
import { REL_POS, Relative_pos_comp_add_child_to_comp, Relative_pos_comp_create_new_comp, Relative_pos_comp_recalc_right } from "../Operations/RelativePosComponent.js";



/**
 * TODO:
 * Menus should not have specific elements, like close and minimize, nor variables of the children elesments, neither should have the CreateCloseButton functionality.
 * They should be generic containers, ready to have any kind of elements-widgets.
 */



const _fontsize = 10;
export class Widget_Menu_Bar extends Section {

   text_mesh;
   close_btn_idx;
   minimize_btn_idx;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, col = GREY[3], text_col = WHITE, text, pad = [14, 6], bold = .4, style = [2, 5, 2], is_debug_mesh) {

      const text_mesh = Create_widget_text(_, text, pos, _fontsize, WHITE, is_debug_mesh);

      const dim = [
         (text_mesh.fontsize * 2 * Font_get_font_advancex(text_mesh.mat.texidx)) / 2,
         text_mesh.geom.dim[1]
      ];
      const areaMetrics = CalculateArea(text, dim, pos, pad)
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, _, [6, 6], areaMetrics.pos, areaMetrics.dim, col, _, style, is_debug_mesh);

      this.pad[0] = pad[0];
      this.pad[1] = pad[1];


      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle(style);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


      this.SetName('Widget_Menu_Bar');
      this.type |= MESH_TYPE.WIDGET_MENU_BAR;


      this.text_mesh = text_mesh;
      this.text_mesh.root_bufferidx = this.root_bufferidx;


      this.close_btn_idx = INT_NULL;
      this.minimize_btn_idx = INT_NULL;

   }


   AddCloseButton(ROOT_WIDGET_FLAGS, root, text, fontsize = 0, col = GREY[3], text_col = WHITE, pad = [4, 2], bold = .4, style=[0, 0, 0.4], font = TEXTURES.MSDF_CONSOLAS_1024) {

      if (!fontsize) fontsize = this.text_mesh.geom.dim[0];
      const pos = [0, 0, 0];
      CopyArr3(pos, this.geom.pos)
      pos[2] += 1; // Put close button in front of the parent widget.

      if(!this.rel_comp) this.rel_comp = Relative_pos_comp_create_new_comp();
      
      const close_btn = Create_widget_close_btn(ROOT_WIDGET_FLAGS, root, text, pos, fontsize, TRANSPARENCY(col, .1), text_col, pad, bold, style, font);
      close_btn.geom.pos[0] += this.geom.dim[0] - close_btn.geom.dim[0]; // Align right
      close_btn.text_mesh.geom.pos[0] += this.geom.dim[0] - close_btn.geom.dim[0]; // Align right
      close_btn.SetName('close_btn');
      // close_btn.AddToWidgetRootBuffer(root.root_bufferidx);
      
      this.geom.dim[0] += close_btn.geom.dim[0] * 2;
      this.geom.pos[0] += close_btn.geom.dim[0]*2;
      
      this.close_btn_idx = this.AddChild(close_btn);
      Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, this, this.close_btn_idx);

   }


   AddMinimizeButton(ROOT_WIDGET_FLAGS, root, fontsize = 0, col = GREY[3], text_col = WHITE, pad = [4, 2], bold = .4, font = TEXTURES.MSDF_CONSOLAS_1024, style=[0, 0, 0.4]) {

      if (!fontsize) fontsize = this.text_mesh.geom.dim[0];
      const pos = [0, 0, 0];
      CopyArr3(pos, this.geom.pos)
      pos[2] += 1; // Put close button in front of the parent widget.

      if(!this.rel_comp) this.rel_comp = Relative_pos_comp_create_new_comp();

      if(root.mesh_bufferidx === this.mesh_bufferidx) {
         console.error('FAIL TO CREATE MINIMIZE BUTTON. REASON: The root passed should not be the menu');  
         return;
      }

      const minimize_btn = Create_widget_minimize_btn(ROOT_WIDGET_FLAGS, root, pos, fontsize, TRANSPARENCY(col, .9), text_col, pad, bold, style);
      minimize_btn.text_mesh.geom.pos[0] += this.geom.dim[0] - minimize_btn.geom.dim[0]; // Align right
      minimize_btn.SetName('minimize_btn');
      // minimize_btn.AddToWidgetRootBuffer(root.root_bufferidx);

      this.geom.dim[0] += minimize_btn.geom.dim[0]*2;
      this.geom.pos[0] += minimize_btn.geom.dim[0]*2;

      this.minimize_btn_idx = this.AddChild(minimize_btn);
      Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, this, this.minimize_btn_idx);

   }


   Destroy(_this) {

      // Menu's children(close/minimize etc) destruction
      for (let i = 0; i <= _this.children.boundary; i++) {

         const child = _this.children.buffer[i];
         child.Destroy();
      }

      _this.text_mesh.Destroy();

      // Menus's destruction
      return super.Destroy();
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

      const gfx = super.GenGfxCtx(FLAGS, gfxidx, _, false); // For the menu meshes
      this.text_mesh.gfx = this.text_mesh.GenGfxCtx(FLAGS, gfxidx); // For the menu meshes
      
      const rect_igfx = [this.gfx.prog.idx, this.gfx.vb.idx];
      const text_igfx = [this.text_mesh.gfx.prog.idx, this.text_mesh.gfx.vb.idx];

      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes
         const child = this.children.buffer[i];
         // child.GenGfxCtx(FLAGS, rect_igfx, text_igfx)
         child.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, rect_igfx, text_igfx)
      }
      return gfx;
   }


   Render() {

      super.Render(false); // For the menu meshes
      this.text_mesh.Render();


      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes

         const child = this.children.buffer[i];
         child.Render();
         // if (child.text_mesh) child.text_mesh.Render();
      }
   }


   Rerender() {

      super.AddToGfxFromReset();
      this.text_mesh.Rerender();

      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes

         const child = this.children.buffer[i];
         child.Rerender();
         // if()
         // child.text_mesh.Rerender();
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
         menu.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

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

      const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
      super.ConstructListeners(root);

   }




   /*******************************************************************************************************************************************************/
   // Alignment

   // ReAlign(Align) {

   //    // Realign menu's text
   //    this.Align(ALIGN.LEFT, this.pad);

   //    let pad = [this.pad[0], this.pad[1]];

   //    for (let i = 0; i <= this.children.boundary; i++) {

   //       const child = this.children.buffer[i];
         
   //       const pos = Align_self_get_dif(Align, this.geom, child.geom, pad); // Align the close/minimize buttons area_mesh to the menu area mesh.
   //       child.geom.pos[0] = pos[0];
   //       child.geom.pos[1] = pos[1];
   //       console.log('ooooooooooooooooooooooooo', child.geom.pos, child.geom.dim, child.GetName())

   //       // child.Align(ALIGN.RIGHT, pad); // Also we need to update the close/minimize buttons text_mesh position(by aligning)
   //       // pad[0] += this.children.buffer[i].geom.dim[0] * 2; // Each child widget of the menu is positioned relative to the previous child.
   //    }

   // }


   Align(flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

      const move_dif = Align_self_get_dif(flags, this.geom, this.text_mesh.geom, _, this.text_mesh.geom.num_faces, this.pad);

      // Update vertex buffers
      if (this.is_gfx_inserted) {
         /** If the alignment happens after the widgets insertion to 
          * the vertex buffers, we must update the vertex buffers too.
          */
         this.text_mesh.geom.MoveXY(move_dif[0], move_dif[1], this.text_mesh.gfx);
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
      CopyArr2(this.geom.defPos, this.geom.pos);
      this.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
      // Batch_store(this, _, { pos: pos_dif }, _);

      AddArr2(this.text_mesh.geom.pos, pos_dif);
      CopyArr2(this.text_mesh.geom.defPos, this.text_mesh.geom.pos);
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


   // Resize menu bar. Keep the menu elements to their relative positions 
   Resize(x){

      this.geom.pos[0] += x;
      this.geom.dim[0] += x;

      Relative_pos_comp_recalc_right(this);
   }

}


export class Close_Button extends Widget_Button {

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, text, pos, fontsize, col = GREY[3], text_col = WHITE, pad = [0, 0], bold = .4, style = [6, 5, 3], font = TEXTURES.MSDF_CONSOLAS_1024, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, _, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh);

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)

      // Set a callback function for the destruction of the menu and its window on clicking the close button.
      const params = {
         source_params: this,
         evt_params: root, // root should be the root widget from which the recursive destruction should start.
         // Clbk: root.OnCloseButtonClick, // The callback that will destroy the root and all of its children(recursive)
      }
      // this.eventCallbacks.Add(params); 
      // Pass the root and the callback for destroying the parent widget
      this.CreateEventCallback(params);
   }



   /*******************************************************************************************************************************************************/
   // Events handling

   OnClick(params) {

      const widget_close_btn = params.evt_params.target_mesh;
      widget_close_btn.OnClose();
      return true; // Needed for the listen event not to propagate further, after widget destruction
   }


   OnClose() {

      console.log('OnClose', this);

      /** The Scema of the 'params', constructed for the 'eventCallbacks'
         source_params: this,
         evt_params: root,
       */
      const params = this.eventCallbacks.buffer[0]; // HACK: We must set up an index clarification for eventCallbacks buffer. 
      const root = params.evt_params
      root.Destroy(root);

   }

}


export class Widget_Minimize extends Widget_Button {

   toggle; // On/Off
   stored_children_meshes; // Store all children meshes of the root, to maximize the widget back to normal. 
   stored_children_events; // Store the 'children' buffer of the roots EventListeners (class).

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, pos = [100, 200, 0], fontsize = 5, col = GREY[3], text_col, pad = [6, 2], bold = .5, style = [0, 4, 1.8], font, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, '-', ALIGN.RIGHT, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh);

      this.toggle = false;
      this.store_children_meshes = null;
      this.stored_children_events = new Array(LISTEN_EVENT_TYPES_INDEX.SIZE); // Store the 'children' buffer of the roots EventListeners (class). 

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)

      const params = {
         source_params: this,
         evt_params: root,
      }
      // The eventCallbacks are going to run from the OnClick() in Widget_Button class.
      // this.eventCallbacks.Add(params); 
      // Pass the root and the callback for destroying the parent widget
      this.CreateEventCallback(params);

   }


   OnClick(_params) {

      const widget_minimize_btn = _params.evt_params.target_mesh;
      const params = widget_minimize_btn.eventCallbacks.buffer[0]; // HACK: We must set up an index clarification for eventCallbacks buffer. 
      widget_minimize_btn.OnMinimize(params);
      return true; // Needed for the listen event not to propagate further, after widget destruction
   }


   OnMinimize(params) {

      const minim_mesh = params.source_params;
      const root = params.evt_params;
      const point = MouseGetPos();
      const m = minim_mesh.geom;

      if (Check_intersection_point_rect(m.pos, m.dim, point, [0, 0])) {

         STATE.mesh.SetClicked(minim_mesh);


         if (root) {

            if (!minim_mesh.toggle) {  // Maximize - toggle on

               // Copy root's children to a buffer
               minim_mesh.stored_children_meshes = New_generic_buffer(root.children, 'minim_mesh.stored_children_meshes'); // TODO: Maybe copying all children is not efficient. Just get the pointer and use it later on maximize


               // Reset Graphics buffers;
               Widget_root_reset_gfx(root.root_bufferidx)

               // Store the root children tree structure to a temporary place, so that can be retrieved on maximize
               const menu_bar = root.children.buffer[0]; // CAUTION: First child suppose to be the menu_bar. What happens if it is at a different index???
               
               
               // Render only the menu bar at the root
               root.children.ResetFull();
               root.AddChild(menu_bar);

               
               // Store pos and dim of the un-munimized root mesh
               CopyArr3(root.geom.defPos, root.geom.pos); // Set current pos as the default pos.
               CopyArr3(root.geom.defDim, root.geom.dim); // Set current pos as the default pos.
               
               minim_mesh.text_mesh.RenderTextFromString('+');
               
               
               // Set Graphics
               root.Recalc_no_gfx_update(root.options|SECTION.RESIZE_PARENT, menu_bar.idx)
               root.Rerender();
               
               root.StateDisable(MESH_STATE.IS_RESIZEABLE);
               minim_mesh.toggle = true;
               
            }
            else { // Maximize - toggle off

               // Gfx_deactivate_no_listeners_touch(root);
               Widget_root_reset_gfx(root.root_bufferidx)
               
               root.children.Reset();
               root.children = minim_mesh.stored_children_meshes;
               
               const dif =  root.geom.defDim[0] -  root.geom.dim[0];
               
               // Retrieve stored pos and dim
               CopyArr3(root.geom.pos, root.geom.defPos); // Set current pos as the default pos.
               CopyArr3(root.geom.dim, root.geom.defDim); // Set current pos as the default pos.
               
               const menu_bar = minim_mesh.parent;
               
               menu_bar.Resize(dif)
               
               minim_mesh.text_mesh.RenderTextFromString('-');
               
               Calculate_positions_no_gfx_update_recursive(root, SECTION.TOP_DOWN | SECTION.INHERIT | SECTION.VERTICAL)
               root.Rerender();
               
               root.StateEnable(MESH_STATE.IS_RESIZEABLE);
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

