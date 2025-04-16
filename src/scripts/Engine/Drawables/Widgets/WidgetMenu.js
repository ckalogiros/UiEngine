"use strict";

import { Widget_Button } from "./WidgetButton.js";
import { Align_text_in_rect_parent } from "../Operations/Alignment.js";
import { Create_widget_close_btn, Create_widget_label, Create_widget_minimize_btn } from "./Helpers/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer.js";
import { BLUEL, GREY, WHITE } from "../Material/Colors.js";
import { Clipy_from_tree_recursive } from "../Operations/Clip.js";
import { View_get_view_vb_root_meshidx } from "../../Core/Views/MeshBufferViews.js";
import { Root_group_view_buffer_add_mesh, Root_group_reset_gfxs } from "../../Core/Views/RootView.js";
import { Widget_gfx_ready_enable, Style_label_default_properties, Style_rect_default_properties, Style_button_default_properties } from "./Helpers/WidgetEnableProperties.js";
import { Rect_Mesh } from "../Meshes/Rect_Mesh.js";
import { State_mesh_set_clicked } from "../../../GlobalFunctions.js";
import { Mesh_get_real_pos_y } from "../Operations/MeshAttributesFunctions.js";
import { Mesh_event_callback_create, Mesh_listener_add, Mesh_listener_create } from "../Operations/MeshPropertiesFunctions.js";



/**
 * // TODO:
 * Menus should not have specific elements, like close and minimize, nor variables of the children elesments, neither should have the CreateCloseButton functionality.
 * They should be generic containers, ready to have any kind of elements-widgets.
 * 
 * // TODO:
 * // IMIDIATELY:
 * Implement local-global indexes for all static meshes of a menu-bar(close, minimize, label,...) and store the meshes child-index to them
 * instead of having pointers to fields for each Widget_Menu_Bar class invocation
 */



const _fontsize = 8.5;
let menu_label_idx = INT_NULL; // Index in the parents children buffer
let menu_close_btn_idx = INT_NULL;
let menu_min_btn = INT_NULL;


export class Widget_Menu_Bar extends Rect_Mesh {

   label;
   close_btn_idx;
   minimize_btn_idx;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, pos, dim, col = GREY[3], text_col = WHITE, text, pad = [14, 6], bold = .4, style = { rcorners: 5, feather: 2, border: 0 }, num_faces, is_debug_mesh) {

      
      const label = Create_widget_label(Style_label_default_properties({text:text, pos:[0, 0, pos[2]], font_size:_fontsize, col:TRANSPARENCY(BLUEL[7], .0), text_col:text_col, text_pad:[10,6], texture_id:TEXTURES.MTSDF_COMIC_1024, is_debug_mesh:is_debug_mesh,}));
      Widget_gfx_ready_enable({mesh:label, enable_sdf_rect:8, });
      
      // super(mesh_bufferidx, ROOT_WIDGET_FLAGS, _, pad, [0, 0, pos[2]], dim, col, _, style, num_faces, _, _, is_debug_mesh);
      super(mesh_bufferidx, Style_rect_default_properties({ is_root:ROOT_WIDGET_FLAGS, pad:pad, pos:[0, 0, pos[2]], dim:dim, col:col, num_faces:num_faces, is_debug_mesh:is_debug_mesh}));
      
      menu_label_idx = this.AddItem(label);
      
      Widget_gfx_ready_enable({mesh:this, enable_sdf_rect:8, });
      
      

      this.geom.dim[1] = label.geom.dim[1];
      
      this.SetName('Widget_Menu_Bar');
      this.type |= MESH_TYPE.WIDGET_MENU_BAR;
      
      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      
      // this.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL | LAYOUT.EXPAND;
      this.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL | LAYOUT.FIXED_WIDTH;
      label.align.flags = LAYOUT.HORIZONTAL;
      
      this.close_btn_idx = INT_NULL;
      this.minimize_btn_idx = INT_NULL;

      // this.SetLayout(properties.layout);
      
   }
   
   SetLayout(align_flags) {

      this.align.flags = align_flags;
   }

   AddLayout(align_flags) {

      this.align.flags |= align_flags;
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   // Destroy(_this) {

   //    // Menu's children(close/minimize etc) destruction
   //    for (let i = 0; i <= _this.children.boundary; i++) {

   //       const child = _this.children.buffer[i];
   //       if (child) child.Destroy();
   //    }

   //    _this.label.Destroy();

   //    // Menus's destruction
   //    return super.Destroy();
   // }
   Destroy() {

      // Menu's children(close/minimize etc) destruction
      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.Destroy();
      }

      const label = this.children.buffer[menu_label_idx];
      label.Destroy();
      
      const close_btn = this.children.buffer[menu_close_btn_idx];
      if(close_btn !== undefined && close_btn !== null)
         close_btn.Destroy();

      // Menus's destruction
      return super.Destroy();
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      const label = this.children.buffer[menu_label_idx];
      label.AddToWidgetRootBuffer(root_bufferidx);

      if (this.close_btn_idx !== INT_NULL) {

         const close_btn = this.children.buffer[this.close_btn_idx];
         close_btn.AddToWidgetRootBuffer(root_bufferidx)
      }

      if (this.minimize_btn_idx !== INT_NULL) {

         const minimize_btn = this.children.buffer[this.minimize_btn_idx];
         minimize_btn.AddToWidgetRootBuffer(root_bufferidx)
      }
   }


   SetGfxEnable(which, params) {
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


   // GfxUniformsEnable(flags, name, type, shader_flags) {

   //    super.EnableGfxUniforms(flags, name, type, shader_flags);

   //    const label = this.children.buffer[menu_label_idx];
   //    label.EnableGfxUniforms(flags, name, type, shader_flags);

   // }

   EnableGfx(which, bar_params = null, handle_params = null) {

      super.EnableGfx(which, bar_params);
      const label = this.children.buffer[menu_label_idx];
      label.EnableGfx(which, handle_params);
   }


   EnableGfxOperations(function_operation, blend_mode) {

      super.EnableGfxOperations(function_operation, blend_mode);
      const label = this.children.buffer[menu_label_idx];
      label.EnableGfxOperations(function_operation, blend_mode);
   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      const label = this.children.buffer[menu_label_idx];
      label.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);

      const close_btn = this.children.buffer[menu_close_btn_idx];
      if(close_btn !== undefined && close_btn !== null) {
         close_btn.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
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
      // alert('556172834 \n Implement me')


      const mesh = this;

      if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

         // Construct HOVER event
         if (mesh.listeners && mesh.listeners.buffer[E.H] === INT_NULL) {
            Mesh_listener_add(mesh, E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (mesh.listeners && mesh.listeners.buffer[E.C] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            Mesh_listener_add(mesh, E.C, mesh.OnClick, evt_params);
         }
      }
   }

   // Resize menu bar. Keep the menu elements to their relative positions 
   Resize(x) {

      this.geom.dim[0] += x;
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/


   AddCloseButton(ROOT_WIDGET_FLAGS, root, text, fontsize = 0, col = GREY[1], text_col = WHITE, _pad = [4, 2], bold = .4, style = { rcorners: 5, feather: 2, border: 0 }, font = TEXTURES.DEFAULT_FONT) {

      if (!fontsize) {
         const label = this.children.buffer[menu_label_idx];
         fontsize = label.text_mesh.geom.dim[0];
      }

      // Use only the top-down pad
      const pad = [0, 0]; // IMPORTANT: If we are to set the dim of the close_btn's to a 'y padding', we better set the close_btn.pad[1] to 0



      const close_btn = Create_widget_close_btn(ROOT_WIDGET_FLAGS, root, text, [0, 0, this.geom.pos[2] + 1], fontsize, TRANSPARENCY(col, 1.0), text_col, pad, bold, style, font);



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
                  Align_text_in_rect_parent(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, child);
               }
            }
         }
      }
      else { // Set mesh height to the max height 

         close_btn.geom.dim[1] = this.geom.dim[1];
         // close_btn.geom.dim[0] = this.geom.dim[1];
         // Because we changed the size of the button, we need to realign the text
         Align_text_in_rect_parent(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, close_btn);
      }


      menu_close_btn_idx = this.AddItem(close_btn);

   }


   AddMinimizeButton(ROOT_WIDGET_FLAGS, root, fontsize = 0, col = GREY[1], text_col = WHITE, _pad, bold = .4, font = TEXTURES.DEFAULT_FONT, style = { rcorners: 5, feather: 2, border: 0 }) {

      if (!fontsize) {
         const label = this.children.buffer[menu_label_idx];
         fontsize = label.text_mesh.geom.dim[0];
      }

      // Use only the top-down pad
      const pad = [0, 0];



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
                  Align_text_in_rect_parent(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, child);
               }
            }
         }
      }
      else { // Set mesh height to the max height 

         minimize_btn.geom.dim[1] = this.geom.dim[1];
         minimize_btn.geom.dim[0] = this.geom.dim[1];

         // Because we changed the size of the button, we need to realign the text
         Align_text_in_rect_parent(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, minimize_btn);
      }


      this.AddItem(minimize_btn);

   }


   AddToMenuBar(mesh, RelPosAlign) {

      // Any mesh of bese type Section, must be calculated(position/size) independent of any other mesh of the menu bar and/or parent/parent-children
      // if(mesh.type & MESH_TYPE.SECTION_MESH) mesh.options |= this.options = SECTION.INDEPENDENT;
      if (mesh.type & MESH_TYPE.SECTION_MESH) mesh.OptionsEnable(SECTION.INDEPENDENT);


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

                  // Because we changed the size of the button, we need to realign the text
                  Align_text_in_rect_parent(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, child);
               }
            }
         }
      }
      else { // Set mesh height to the max height 

         mesh.geom.dim[1] = this.geom.dim[1];
         // Because we changed the size of the button, we need to realign the text
         Align_text_in_rect_parent(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, mesh);
      }



      this.AddItem(mesh)

   }
}


export class Close_Button extends Widget_Button {
// export class Close_Button extends Section {

   // constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, text, pos, fontsize, col = GREY[3], text_col = WHITE,
   // pad = [0, 0], bold = .4, style = { rcorners: 6, feather: 5, border: 0 }, font = TEXTURES.DEFAULT_FONT, _, is_debug_mesh) {
   constructor(mesh_bufferidx, properties) {

      // super(Style_button_default_properties({mesh_bufferidx, ROOT_WIDGET_FLAGS, text, _, pos, fontsize, col, text_col, [10,6], bold, style, font, is_debug_mesh}));
      // super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, _, pos, fontsize, col, text_col, [10,6], bold, style, font, is_debug_mesh);
      super(mesh_bufferidx, properties);

      // Mesh_listener_create(this, LISTEN_EVENT_TYPES.HOVER);
      Mesh_listener_create(this, LISTEN_EVENT_TYPES.CLICK_UP);
      // this.align.flags = LAYOUT.HORIZONTAL|LAYOUT.FLOAT_RIGHT;
      
      // Set a callback function for the destruction of the menu and its window on clicking the close button.
      const params = {
         source_params: this,
         evt_params: properties.target_mesh, // root should be the root widget from which the recursive destruction should start.
      }

      // Pass the root and the callback for destroying the parent widget
      Mesh_event_callback_create(this, params);
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

      /** The Scema of the 'params', constructed for the 'event_clbks'
        * source_params: this,
        * evt_params: root,
       */
      const params = this.event_clbks.buffer[0]; // HACK: We must set up an index clarification for event_clbks buffer. 
      const root = params.evt_params
      root.Destroy(root);

      if (root.event_clbks) {
         root.event_clbks.buffer[0].evt_clbks();
      }

   }

}


export class Widget_Minimize extends Widget_Button {

   // toggle; // On/Off

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, root, pos = [100, 200, 0], fontsize = 5, col = GREY[3], text_col, pad = [6, 2], bold = .5, style = { rcorners: 4, feather: 2, border: 0 }, font, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, '_', _, pos, fontsize, col, text_col, pad, bold, style, font, is_debug_mesh);

      this.toggle = false;
      this.store_children_meshes = null;

      this.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      this.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)


      const params = {
         source_params: this,
         evt_params: root,
      }

      Mesh_event_callback_create(this, params);

   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/

   OnClick(_params) {

      const widget_minimize_btn = _params.evt_params.target_mesh;
      const params = widget_minimize_btn.event_clbks.buffer[0]; // HACK: We must set up an index clarification for event_clbks buffer. 
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

      State_mesh_set_clicked(minim_mesh);


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

            root.StateDisable(MESH_STATE_FLAGS.IS_RESIZEABLE);
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
            const clip_top = Mesh_get_real_pos_y(group_root);
            const clip_bottom = clip_top + group_root.geom.dim[1] * 2;
            Clipy_from_tree_recursive(group_root, clip_top, clip_bottom);


            root.Rerender();

            root.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);
            minim_mesh.toggle = false;
         }
      }

      return true;

   }

}


