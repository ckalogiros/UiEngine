"use strict";

import { Widget_Button } from "./WidgetButton.js";
import { Align_text_in_rect_parent } from "../Operations/Alignment.js";
import { Create_widget_close_btn, Create_widget_label, Create_widget_minimize_btn } from "../../Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer.js";
import { GREY, WHITE } from "../Material/Base/Colors.js";
import { Section } from "../Meshes/Section.js";
import { REL_POS, Relative_pos_comp_add_child_to_comp, Relative_pos_comp_create_new_comp } from "../Operations/RelativePosComponent.js";
import { Styles_pad_set } from "../../Styles.js";
import { Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { View_get_view_vb_root_meshidx } from "../../Core/MeshBufferViews.js";
import { Root_group_view_buffer_add_mesh, Root_group_reset_gfxs } from "../../Core/Views/RootView.js";



/**
 * TODO:
 * Menus should not have specific elements, like close and minimize, nor variables of the children elesments, neither should have the CreateCloseButton functionality.
 * They should be generic containers, ready to have any kind of elements-widgets.
 * 
 * // IMIDIATELY:
 * For the close button
 */



const _fontsize = 8.5;


export class Widget_Menu_Bar extends Section {

   label;
   close_btn_idx;
   minimize_btn_idx;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, dim, col = GREY[3], text_col = WHITE, text, pad = [14, 6], bold = .4, style = [5, 2, 2], num_faces, is_debug_mesh) {

      const label = Create_widget_label(_, text, _, [0, 0, pos[2]], _fontsize, col, text_col, _, _, _, _, is_debug_mesh);


      // const dim = [label.GetMaxWidth(), 10];
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, _, [5, 5], [0, 0, pos[2]], dim, col, _, style, num_faces, _, is_debug_mesh);

      Styles_pad_set(this.styles, pad)
      Styles_pad_set(label.styles, pad)

      this.geom.dim[1] = label.geom.dim[1];

      this.StylesSetPad(pad)


      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.SetStyle(style);
      // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
      this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      this.options = SECTION.INDEPENDENT;


      this.SetName('Widget_Menu_Bar');
      this.type |= MESH_TYPE.WIDGET_MENU_BAR;


      this.label = label;
      this.AddChild(label);


      this.close_btn_idx = INT_NULL;
      this.minimize_btn_idx = INT_NULL;

   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   Destroy(_this) {

      // Menu's children(close/minimize etc) destruction
      for (let i = 0; i <= _this.children.boundary; i++) {

         const child = _this.children.buffer[i];
         if (child) child.Destroy();
      }

      _this.label.Destroy();

      // Menus's destruction
      return super.Destroy();
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      this.label.AddToWidgetRootBuffer(root_bufferidx);

      if (this.close_btn_idx !== INT_NULL) {

         const close_btn = this.children.buffer[this.close_btn_idx];
         close_btn.AddToWidgetRootBuffer(root_bufferidx)
      }

      if (this.minimize_btn_idx !== INT_NULL) {

         const minimize_btn = this.children.buffer[this.minimize_btn_idx];
         minimize_btn.AddToWidgetRootBuffer(root_bufferidx)
      }
   }


   SetGfxEnableAttributes(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgetMenu')
   }







   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx, _, false); // For the menu meshes

      const rect_specific_vb_groupidx = this.gfx.vb.groupidx;
      // const text_igfx = this.label.text_mesh.gfx.vb.groupidx;

      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes
         const child = this.children.buffer[i];
         // child.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, rect_igfx, text_igfx)
         if (child) child.GenGfxCtx(FLAGS, rect_specific_vb_groupidx)
      }
      return gfx;
   }


   Render() {

      super.AddToGfx(false); // For the menu meshes

      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes

         const child = this.children.buffer[i];
         if (child) child.Render();
      }
   }


   Rerender() {

      super.AddToGfxFromReset();

      for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes

         const child = this.children.buffer[i];
         if (child) child.Rerender();
      }
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
      alert('556172834 \n Implement me')


      const mesh = this;

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
      }
   }

   // Resize menu bar. Keep the menu elements to their relative positions 
   Resize(x) {

      // this.geom.pos[0] += x;
      this.geom.dim[0] += x;

      // Relative_pos_comp_recalc_right(this);
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/


   AddCloseButton(ROOT_WIDGET_FLAGS, root, text, fontsize = 0, col = GREY[1], text_col = WHITE, _pad = [4, 2], bold = .4, style = [5, 2, 2], font = TEXTURES.DEFAULT_FONT) {

      if (!fontsize) fontsize = this.label.text_mesh.geom.dim[0];

      // Use only the top-down pad
      const pad = [0, 0]; // IMPORTANT: If we are to set the dim of the close_btn's to a 'y padding', we better set the close_btn.pad[1] to 0


      if (!this.rel_comp) this.rel_comp = Relative_pos_comp_create_new_comp();

      const close_btn = Create_widget_close_btn(ROOT_WIDGET_FLAGS, root, text, [0, 0, this.geom.pos[2] + 1], fontsize, TRANSPARENCY(col, 1.0), text_col, pad, bold, style, font);
      close_btn.SetName('close_btn');


      // Set the height of the menu item to be the same across all other items
      if (this.geom.dim[1] < close_btn.geom.dim[1]) {

         // Store the max y size in the menu bar height
         this.geom.dim[1] = close_btn.geom.dim[1];

         // Update the max height of the rest of menu's items
         if (this.children.active_count) {
            for (let i = 0; i <= this.children.boundary; i++) {
               const child = this.children.buffer[i];
               if (child) {

                  child.geom.dim[1] = this.geom.dim[1];
                  child.geom.dim[0] = this.geom.dim[1];

                  // Because we changed the size of the button, we need to realign the text
                  Align_text_in_rect_parent(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, child);
               }
            }
         }
      }
      else { // Set mesh height to the max height 

         close_btn.geom.dim[1] = this.geom.dim[1];
         close_btn.geom.dim[0] = this.geom.dim[1];
         // Because we changed the size of the button, we need to realign the text
         Align_text_in_rect_parent(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, close_btn);
      }


      this.AddItem(close_btn);

      Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, this, close_btn.idx);

   }


   AddMinimizeButton(ROOT_WIDGET_FLAGS, root, fontsize = 0, col = GREY[1], text_col = WHITE, _pad, bold = .4, font = TEXTURES.DEFAULT_FONT, style = [5, 2, 2]) {

      if (!fontsize) fontsize = this.label.text_mesh.geom.dim[0];

      // Use only the top-down pad
      const pad = [0, 0];


      if (!this.rel_comp) this.rel_comp = Relative_pos_comp_create_new_comp();

      if (root.mesh_bufferidx === this.mesh_bufferidx) {
         console.error('FAIL TO CREATE MINIMIZE BUTTON. REASON: The root passed should not be the menu');
         return;
      }

      const minimize_btn = Create_widget_minimize_btn(ROOT_WIDGET_FLAGS, root, [0, 0, this.geom.pos[2] + 1], fontsize, TRANSPARENCY(col, 1.0), text_col, pad, bold, style);
      minimize_btn.SetName('minimize_btn');


      // Set the height of the menu item to be the same across all other items
      if (this.geom.dim[1] < minimize_btn.geom.dim[1]) {

         // Store the max y size in the menu bar height
         this.geom.dim[1] = minimize_btn.geom.dim[1];

         // Update the max height of the rest of menu's items
         if (this.children.active_count) {
            for (let i = 0; i <= this.children.boundary; i++) {

               if (child) {

                  const child = this.children.buffer[i];
                  child.geom.dim[1] = this.geom.dim[1];
                  child.geom.dim[0] = this.geom.dim[1];


                  // Because we changed the size of the button, we need to realign the text
                  Align_text_in_rect_parent(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, child);
               }
            }
         }
      }
      else { // Set mesh height to the max height 

         minimize_btn.geom.dim[1] = this.geom.dim[1];
         minimize_btn.geom.dim[0] = this.geom.dim[1];

         // Because we changed the size of the button, we need to realign the text
         Align_text_in_rect_parent(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, minimize_btn);
      }


      this.AddItem(minimize_btn);

      Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, this, minimize_btn.idx);

   }


   // TODO: pass: REL_POS right-left-middle, so user can assign the rel pos of the mesh
   AddToMenuBar(mesh, RelPosAlign) {

      if (!this.rel_comp) this.rel_comp = Relative_pos_comp_create_new_comp();

      mesh.SetStyle([5, 2, 2]);

      // Any mesh of bese type Section, must be calculated(position/size) independent of any other mesh of the menu bar and/or parent/parent-children
      // if(mesh.type & MESH_TYPE.SECTION_MESH) mesh.options |= this.options = SECTION.INDEPENDENT;
      if (mesh.type & MESH_TYPE.SECTION_MESH) mesh.OptionsEnable(SECTION.INDEPENDENT);

      const align_item_flag = (RelPosAlign !== undefined) ? RelPosAlign : REL_POS.LEFT;


      // Set the height of the menu item to be the same across all other items
      if (this.geom.dim[1] < mesh.geom.dim[1]) {

         // Store the max y size in the menu bar height
         this.geom.dim[1] = mesh.geom.dim[1];

         // Update the max height of the rest of menu's items
         if (this.children.active_count) {
            for (let i = 0; i <= this.children.boundary; i++) {

               if (child) {

                  const child = this.children.buffer[i];
                  child.geom.dim[1] = this.geom.dim[1];
                  // child.geom.dim[0] = child.geom.dim[1];

                  // Because we changed the size of the button, we need to realign the text
                  Align_text_in_rect_parent(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, child);
               }
            }
         }
      }
      else { // Set mesh height to the max height 

         mesh.geom.dim[1] = this.geom.dim[1];
         // Because we changed the size of the button, we need to realign the text
         Align_text_in_rect_parent(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, mesh);
      }



      this.AddItem(mesh)

      // TODO: Use the parem 'RelPosAlign', but first implement correctly the 'REL_POS.LEFT' alingment
      // Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, this, mesh.idx);
      if (RelPosAlign & REL_POS.RIGHT) Relative_pos_comp_add_child_to_comp(align_item_flag, this, mesh.idx);

   }
}


export class Close_Button extends Widget_Button {

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, text, pos, fontsize, col = GREY[3], text_col = WHITE,
      pad = [0, 0], bold = .4, style = [6, 5, 3], font = TEXTURES.DEFAULT_FONT, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, _, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh);

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)

      // Set a callback function for the destruction of the menu and its window on clicking the close button.
      const params = {
         source_params: this,
         evt_params: root, // root should be the root widget from which the recursive destruction should start.
      }

      // Pass the root and the callback for destroying the parent widget
      this.CreateEventCallback(params);
   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   OnClick(params) {

      const widget_close_btn = params.evt_params.target_mesh;
      widget_close_btn.OnClose();
      return true; // Needed for the listen event not to propagate further, after widget destruction
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

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

   // toggle; // On/Off
   // stored_children_meshes; // Store all children meshes of the root, to maximize the widget back to normal. 

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, pos = [100, 200, 0], fontsize = 5, col = GREY[3], text_col, pad = [6, 2], bold = .5, style = [4, 0, 1.8], font, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, '_', _, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh);

      this.toggle = false;
      this.store_children_meshes = null;

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





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   OnClick(_params) {

      const widget_minimize_btn = _params.evt_params.target_mesh;
      const params = widget_minimize_btn.eventCallbacks.buffer[0]; // HACK: We must set up an index clarification for eventCallbacks buffer. 
      widget_minimize_btn.OnMinimize(params);
      return true; // Needed for the listen event not to propagate further, after widget destruction
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   OnMinimize(params) {

      const minim_mesh = params.source_params;
      const root = params.evt_params;

      STATE.mesh.SetClicked(minim_mesh);


      if (minim_mesh.group_bufferidxs[0] === INT_NULL) {
         alert('Minimize button needs a ViewGrouup to work');
         return;
      }

      if (root) {

         if (!minim_mesh.toggle) {  // Minimize - toggle off

            // Copy root's children to a buffer
            minim_mesh.stored_children_meshes = root.children;


            // Reset Graphics buffers;
            Root_group_reset_gfxs(root.root_bufferidx)

            // Store the root children tree structure to a temporary place, so that can be retrieved on maximize
            const menu_bar = root.children.buffer[0]; // CAUTION: First child suppose to be the menu_bar. What happens if it is at a different index???


            // Render only the menu bar at the root

            // Deactivate all children, except the menu bar, so they are not gonna be drawn to the vertex buffer on any re-render 
            for (let i = menu_bar.idx + 1; i <= root.children.boundary; i++) {
               if (root.children.buffer[i]) root.children.buffer[i].Deactivate()
            }

            root.children.ResetFull(); // Reset the children's buffer and allocate new array
            root.AddChild(menu_bar);


            // Store pos and dim of the un-munimized root mesh
            root.geom.defPos[1] = root.geom.pos[1];
            root.geom.defDim[1] = root.geom.dim[1];
            // Resize the root widget to include only the height of the menu bar
            root.geom.dim[1] = menu_bar.geom.dim[1] + root.StylesGetMargin(STYLES.AXIS.Y);

            { // For side-ways minimizing

               // // Store pos and dim of the un-munimized root mesh
               // // root.geom.defPos[0] = root.geom.pos[0];
               // Mesh_unif_set_vb_root_wposx(root.root_posidx, VIEWPORT.WIDTH - menu_bar.geom.dim[0]*2);
               // // root.geom.pos[0] = VIEWPORT.WIDTH - root.GetPosX() - menu_bar.geom.dim[0]*2;
               // root.geom.defDim[0] = root.geom.dim[0];
               // // Resize the root widget to include only the height of the menu bar
               // root.geom.dim[0] = menu_bar.geom.dim[0] + root.StylesGetMargin(STYLES.AXIS.X);
               // // root.geom.dim[0] = menu_bar.geom.dim[0] ;
            }


            // Change the minimized button text
            minim_mesh.text_mesh.RenderTextFromString('+');

            // Set Graphics
            root.Rerender(); // We need to re-render the whole vb. Many meshes have been excluded from the minimize action

            root.StateDisable(MESH_STATE.IS_RESIZEABLE);
            minim_mesh.toggle = true;

         }
         else { // Maximize - toggle on

            // Gfx_deactivate_no_listeners_touch(root);
            Root_group_reset_gfxs(root.root_bufferidx)

            root.children.Reset();
            root.children = minim_mesh.stored_children_meshes;

            // Re-Activate all children, except the menu bar, so they are gonna be drawn to the vertex buffer on re-render 
            for (let i = root.children.buffer[0].idx + 1; i <= root.children.boundary; i++) {
               if (root.children.buffer[i]) root.children.buffer[i].Activate();
            }


            // Retrieve stored pos and dim
            root.geom.pos[1] = root.geom.defPos[1];
            root.geom.dim[1] = root.geom.defDim[1];


            { // For side-ways minimizing
               // // Retrieve stored pos and dim
               // // root.geom.pos[0] = root.geom.defPos[0];
               // Mesh_unif_add_vb_root_wposx(root.root_posidx, -root.geom.defDim[0] * 2 + root.geom.dim[0] *2);
               // console.log(root.geom.dim[0])
               // // Mesh_unif_set_vb_root_wposx(root.root_posidx, VIEWPORT.WIDTH - menu_bar.geom.dim[0]*2);
               // root.geom.dim[0] = root.geom.defDim[0];
            }


            minim_mesh.text_mesh.RenderTextFromString('-');


            // NO NEED TO CHANGE ANYTHING.
            // The un minimize does not have anything else, as log as the window does not resize. Everything is in place
            /**
             * // EFFICIENCY
             * Unfortunately we have to run through all meshes for:
             * 1. Activating all
             * 2. ClipY all 
             */

            // Get the group root mesh to Recalc position/dimentions 
            const group_rootidx = View_get_view_vb_root_meshidx(root.group_bufferidxs);
            const group_root = Mesh_buffer_get_mesh_byidx(group_rootidx);
            const clip_top = group_root.GetPosY();
            const clip_bottom = clip_top + group_root.geom.dim[1] * 2;
            // Clipy_from_group(group_root.group_bufferidxs[0], clip_top, clip_bottom);
            Clipy_from_tree_recursive(group_root, clip_top, clip_bottom);

            // Calculate_positions_no_gfx_update_recursive(root, SECTION.TOP_DOWN | SECTION.INHERIT | SECTION.VERTICAL, [this.geom.pos[0], this.geom.pos[1]])
            // Calculate_positions_no_gfx_update_recursive(root, SECTION.TOP_DOWN | SECTION.INHERIT | SECTION.VERTICAL, [0, 0])


            root.Rerender();

            root.StateEnable(MESH_STATE.IS_RESIZEABLE);
            minim_mesh.toggle = false;
         }
      }

      return true;

   }

}


