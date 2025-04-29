"use strict"

import { Widget_gfx_ready_enable, Style_label_default_properties, Style_rect_default_properties, Style_slider_simple_default_properties } from "./Helpers/WidgetEnableProperties.js";
import { State_mesh_set_clicked, State_mesh_set_focused, State_mesh_set_grabed } from "../../../GlobalFunctions.js";
import { Gl_set_rgba, Gl_set_rgba_per_vertex, Gl_set_rgba_per_vertex_specify_vertex, Gl_set_rgba_specify_attribute } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { CopyArr3, CopyArr4, CopyMat4_arr4, Floor, Mix_vec3_float32Array, Mix_vec4_float32Array } from "../../../Helpers/Math/MathOperations.js";
import { Mouse_get_pos_dif } from "../../Controls/Input/Mouse.js";
import { Create_rect_mesh, Create_widget_label, Create_widget_slider_simple } from "./Helpers/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer.js";
import { Mesh_unif_add_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Root_group_per_vb_meshidx_view_get_all_roots } from "../../Core/Views/RootView.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";
import { BLACK, BLUE, BLUEL, COLOR_GRADIENT_HORIZONTAL, COLOR_GRADIENT_VERTICAL, CYAN, GREEN, GREY, PURPLE, RED, REDL, WHITE, YELLOW } from "../Material/Colors.js";
import { Rect_Mesh } from "../Meshes/Rect_Mesh.js";
import { Mesh_get_real_pos_x, Mesh_get_real_pos_y } from "../Operations/MeshAttributesFunctions.js";
import { Mesh_listener_add, Mesh_listener_create, Mesh_set_name, Mesh_state_check } from "../Operations/MeshPropertiesFunctions.js";
import { Slider_simple_connect, Slider_simple_set_value } from "./WidgetSlider.js";




// TODO: Deal with these global variables, especially if we need to construct a second Colorpicker widget
let panel_idx = INT_NULL;
let panel2_idx = INT_NULL;
let slider_hue_idx = INT_NULL;
let color_pick_idx = INT_NULL;
let color_present_idx = INT_NULL;
let slider_trans_idx = INT_NULL;



/**
 * Colorpicker mesh tree structure
 * 
 * Colorpicker panel
 * ->    slider hue
 * ->    panel
 * ->->     color pick
 * ->->     slider transarency
 * ->->     panel2
 * ->->->      color present
 * ->->->      labels
 */




// export class Widget_Color_Picker extends Section {
export class Widget_Color_Picker extends Rect_Mesh {

   color_pick_click_pos; // We need to store the selected color position (of the clor pick panes)(from the clicked position)
   label_r;
   label_g;
   label_b;
   label_a;

   // constructor(mesh_bufferidx, is_root, margin, pos, dim = [100, 100], col = GREY[1], name = 'Color Picker', style = { rcorners: 10, feather: 2, border: 0 }, num_faces, is_debug_mesh) {
   constructor(mesh_bufferidx, properties) {

      const scale = .6;

      if (properties.col !== _ && properties.col[0].constructor !== Float32Array) alert('Colorpicker needs Multicolor for the constructor\nConsider passing an array of 4 COLORS')

      properties.col = COLOR_GRADIENT_VERTICAL(GREY[8], GREY[4]);
      super(mesh_bufferidx, properties);
      Widget_gfx_ready_enable({ mesh: this, enable_sdf_rect: properties.rcorners.color_picker, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
      this.AlignNEW.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;

      // Multi color vertex
      this.options |= SECTION.RESIZE_PARENT;

      this.label_r = null;
      this.label_g = null;
      this.label_b = null;
      this.label_a = null;

      this.temp_target_mesh_clbk = null;
      this.temp_target_mesh_params = null;



      /******************************************************************************/
      // Create panel to align further meshes
      // style.feather = 10;
      const color = [GREY[7], GREY[3], GREY[2], GREY[1]];

      const panel = Create_rect_mesh(Style_rect_default_properties({
         is_root: _, pad: [10 * scale, 10 * scale],
         pos: [0, 0, 1], col: color, name: 'Color Picker Panel', num_meshes: 1,
         layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, is_debug_mesh: properties.is_debug_mesh
      }));
      Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: properties.rcorners.panel, enable_col_per_vertex: color, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
      panel_idx = this.AddItem(panel)






      /******************************************************************************/
      // Create the color picker panel
      const color_pick = Create_rect_mesh(Style_rect_default_properties({ 
         pos: [0, 0, 2], dim: [150 * scale, 150 * scale], col: [WHITE, BLACK, YELLOW[9], BLACK,], 
         pad: [10, 10], name: 'Color Picker', num_meshes: 1, 
         layout: LAYOUT.HORIZONTAL, is_debug_mesh: properties.is_debug_mesh, 
      }));
      Widget_gfx_ready_enable({ mesh: color_pick, enable_sdf_rect: properties.rcorners.color_pick, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });

      color_pick.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
      color_pick_idx = panel.AddItem(color_pick);



      /******************************************************************************/
      // Create panel for the color presentation and info labels
      // const panel2 = Create_widget_section(Style_section_default_properties({options:SECTION.VERTICAL, pad:[20 * scale, 20 * scale], pos:[0, 0, 1], col:COLOR_GRADIENT_VERTICAL(GREY[5], GREY[1]), name:'Inner Panel 1', style:style, num_meshes:1, is_debug_mesh:is_debug_mesh}));
      const panel2 = Create_rect_mesh(Style_rect_default_properties({ 
         pad: [20 * scale, 20 * scale], pos: [0, 0, 1], col: COLOR_GRADIENT_VERTICAL(GREY[5], GREY[1]), 
         name: 'Inner Panel 1', num_meshes: 1, is_debug_mesh: properties.is_debug_mesh, 
         layout:LAYOUT.RESIZE_SELF|LAYOUT.HORIZONTAL, 
      }));
      Widget_gfx_ready_enable({ mesh: panel2, enable_sdf_rect: properties.rcorners.panel2, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
      panel2_idx = panel.AddItem(panel2);



      /******************************************************************************/
      // Create the color present mesh
      const color_present_mesh = Create_rect_mesh(Style_rect_default_properties({ 
         pos: [0, 0, 2], dim: [75 * scale, 45 * scale], col: [YELLOW[9], YELLOW[9], YELLOW[9], YELLOW[9]], 
         name: 'Color Present', num_meshes: 1, layout: LAYOUT.HORIZONTAL, is_debug_mesh: properties.is_debug_mesh 
      }));
      Widget_gfx_ready_enable({ mesh: color_present_mesh, enable_sdf_rect: properties.rcorners.color_present, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
      color_present_mesh.StylesSetMargin([0, 0]);

      this.color_pick_click_pos = [color_pick.geom.dim[0] * 2, 0];
      color_present_idx = panel2.AddItem(color_present_mesh);


      const fontsize = 14 * scale;
      const label_pad = [15 * scale * scale, 9 * scale * scale];
      const label_style = [10 * scale, 0, 1.2];

      /******************************************************************************/
      // Create Label RGBA color Info meshes
      {
         const grad_grey = { _1: GREY[7], _2: GREY[1] };
         {
            const label_col = Create_widget_label(Style_label_default_properties({ text: 'R', pos: [0, 0, 13], font_size: fontsize, col: [REDL[5], REDL[5], REDL[5], REDL[5]], pad: [0, 5], text_col: WHITE, text_pad: label_pad, layout: LAYOUT.VERTICAL }));
            Widget_gfx_ready_enable({ mesh: label_col, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            label_col.align.flags = LAYOUT.VERTICAL;
            panel2.AddItem(label_col);

            const label_val = Create_widget_label(Style_label_default_properties({ text: 'R1111', pos: [0, 0, 13], font_size: fontsize, col: COLOR_GRADIENT_HORIZONTAL(grad_grey._1, grad_grey._2), pad: [5, 5], text_col: WHITE, text_pad: label_pad, }));
            Widget_gfx_ready_enable({ mesh: label_val, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            panel2.AddItem(label_val);
            this.label_r = label_val;
         }
         {
            const label_col = Create_widget_label(Style_label_default_properties({ text: 'G', pos: [0, 0, 3], font_size: fontsize, col: [GREEN[4], GREEN[4], GREEN[4], GREEN[4]], text_col: WHITE, pad: [0, 5], text_pad: label_pad, layout: LAYOUT.VERTICAL }));
            Widget_gfx_ready_enable({ mesh: label_col, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            panel2.AddItem(label_col);

            const label_val = Create_widget_label(Style_label_default_properties({ text: 'G1111', pos: [0, 0, 3], font_size: fontsize, col: COLOR_GRADIENT_HORIZONTAL(grad_grey._1, grad_grey._2), pad: [5, 5], text_col: WHITE, text_pad: label_pad, }));
            Widget_gfx_ready_enable({ mesh: label_val, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            panel2.AddItem(label_val);
            this.label_g = label_val;
         }
         {
            const label_col = Create_widget_label(Style_label_default_properties({ text: 'G', pos: [0, 0, 3], font_size: fontsize, col: [BLUEL[6], BLUEL[6], BLUEL[6], BLUEL[6]], text_col: WHITE, pad: [0, 5], text_pad: label_pad, layout: LAYOUT.VERTICAL }));
            Widget_gfx_ready_enable({ mesh: label_col, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            panel2.AddItem(label_col);

            const label_val = Create_widget_label(Style_label_default_properties({ text: 'B1111', pos: [0, 0, 3], font_size: fontsize, col: COLOR_GRADIENT_HORIZONTAL(grad_grey._1, grad_grey._2), pad: [5, 5], text_col: WHITE, text_pad: label_pad, }));
            Widget_gfx_ready_enable({ mesh: label_val, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            panel2.AddItem(label_val);
            this.label_b = label_val;
         }
         {
            const label_col = Create_widget_label(Style_label_default_properties({ text: 'A', pos: [0, 0, 3], font_size: fontsize, col: [GREY[8], GREY[8], GREY[8], GREY[8]], text_col: WHITE, pad: [0, 5], text_pad: label_pad, layout: LAYOUT.VERTICAL }));
            Widget_gfx_ready_enable({ mesh: label_col, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            panel2.AddItem(label_col);

            const label_val = Create_widget_label(Style_label_default_properties({ text: 'A1111', pos: [0, 0, 3], font_size: fontsize, col: COLOR_GRADIENT_HORIZONTAL(grad_grey._1, grad_grey._2), pad: [5, 5], text_col: WHITE, text_pad: label_pad, }));
            Widget_gfx_ready_enable({ mesh: label_val, enable_sdf_rect: properties.rcorners.labels, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
            panel2.AddItem(label_val);
            this.label_a = label_val;
         }


      }


      /******************************************************************************/
      // Create the tranparency slider
      // const TRANSPARENCY_BAR_COLOR = [
      //    RED[9],
      //    GREY[3],
      //    YELLOW[9],
      //    GREY[3],
      // ];
      const TRANSPARENCY_BAR_COLOR = COLOR_GRADIENT_VERTICAL(YELLOW[9], GREY[3]);
      const slider_tran = Create_widget_slider_simple(Style_slider_simple_default_properties({ 
         pos: [0, 0, 13], dim: [12 * scale, 150 * scale], pad: [10, 0], col: TRANSPARENCY_BAR_COLOR, 
         hover_margin: [10, 10], handle_dim: [16 * scale, 4 * scale], handle_col: WHITE, 
         num_faces: 1, layout: LAYOUT.HORIZONTAL, 
      }));
      Widget_gfx_ready_enable({ mesh: slider_tran, enable_sdf_rect: properties.rcorners.slider_trans, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
      Mesh_set_name(slider_tran, 'Slider Transparency');
      // slider_tran.align.flags = LAYOUT.HORIZONTAL;

      slider_trans_idx = panel.AddItem(slider_tran);








      /******************************************************************************/
      // Create the hue picker mesh
      const HUE_COLOR = [
         RED[9], RED[9],
         YELLOW[9], YELLOW[9], // v1-v2
         GREEN[9], GREEN[9],   // v3-v4
         CYAN[9], CYAN[9],     // v3-v4
         BLUE[9], BLUE[9],     // v5-v6
         PURPLE[9], PURPLE[9], // v3-v4
         RED[9], RED[9],
      ];

      const vertices_count = (HUE_COLOR.length / 2) - 1;
      const slider_hue = Create_widget_slider_simple(Style_slider_simple_default_properties({ 
         pos: [0, 0, 2], dim: [properties.dim[0] * scale, 20 * scale], pad: [0, 10], col: HUE_COLOR, hover_margin: [10, 10], 
         handle_dim: [4 * scale, 24 * scale], handle_col: WHITE, num_faces: vertices_count, layout: LAYOUT.VERTICAL, 
      }));
      Widget_gfx_ready_enable({ mesh: slider_hue, enable_sdf_rect: properties.rcorners.slider_hue, enable_col_per_vertex: true, enable_blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });

      slider_hue.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      Mesh_set_name(slider_hue, 'Slider Hue');
      // slider_hue.align.flags = LAYOUT.VERTICAL;
      slider_hue_idx = this.AddItem(slider_hue);


   }



   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/

   Destroy() {
      // alert('Implement Destroy()\nColorpicker Widget');

      super.Destroy();

      // This section
      // Panel 1
      // Panel 2
      // Slider transparency
      // Slider Hue
      // Color pick area
      // Color present area
   }


   SetGfxEnable(which, params) {
      alert('777\nSetGfxEnableAttributes\nWidgetColorpicker')
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].StateEnable(MASK);
      }
   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].StateDisable(MASK);
      }
   }


   EnableGfx(which, self_params = null, panel_params = null, color_pick_params = null, pane2_params = null, color_present_params = null, slider_trans_params = null, handle_trans_params = null, slider_hue_params = null, labels_params = null) {

      super.EnableGfx(which, self_params);

      const slider_hue = this.children.buffer[slider_hue_idx];
      slider_hue.EnableGfx(which, slider_hue_params, 1);

      const panel = this.children.buffer[panel_idx];
      panel.EnableGfx(which, panel_params);

      const color_pick = panel.children.buffer[color_pick_idx];
      color_pick.EnableGfx(which, color_pick_params);

      const slider_trans = panel.children.buffer[slider_trans_idx];
      slider_trans.EnableGfx(which, slider_trans_params, handle_trans_params,);

      const panel2 = panel.children.buffer[panel2_idx];
      panel2.EnableGfx(which, pane2_params);

      const color_present = panel2.children.buffer[color_present_idx];
      color_present.EnableGfx(which, color_present_params);


      for (let i = color_present_idx + 1; i <= panel2.children.boundary; i++) {
         const label = panel2.children.buffer[i];
         label.EnableGfx(which, labels_params);
      }
   }


   // /** Must run for every mesh */
   // GfxUniformsEnable(flags, name, type, shader_flags) {

   //    super.EnableGfxUniforms(flags, name, type, shader_flags);
   //    for (let i = 0; i <= this.children.boundary; i++) {
   //       const child = this.children.buffer[i];
   //       if (child) child.GfxUniformsEnable(flags, name, type, shader_flags);
   //    }
   // }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);

      if (unif_name === 'u_wposxy') {

         // Call for each root mesh in every vertex buffer
         const root_meshes = Root_group_per_vb_meshidx_view_get_all_roots(this.root_bufferidx, unif_name, Clbk, clbk_params);
         const len = root_meshes.length;
         for (let i = 1; i < len; i++) {

            const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshes[i]);
            root_mesh.SetClbkGfxUniforms(unif_name, Clbk, root_mesh.root_posidx);

         }
      }

   }


   GfxCtxSetFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

      if (this.gfx_ctx_parent === INT_NULL) { // Set for the first time, if gfx_ctx_parent=INT_NULL from initialization

         if ((this.gfx_ctx_flags  & GFX_CTX_FLAGS.NEW)===0) {
            this.gfx_ctx_flags = FLAGS;
            this.gfx_ctx_parent = gfx_ctx_parent;
         }

         if (recurse) {
            for (let i = 0; i <= this.children.boundary; i++) {
               const child = this.children.buffer[i];
               if (child) child.GfxCtxSetFlag(FLAGS, gfx_ctx_parent, recurse);
            }
         }
      }
   }


   GfxCtxAddFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

      if (this.gfx_ctx_parent === INT_NULL) { // Set for the first time, if gfx_ctx_parent=INT_NULL from initialization

         this.gfx_ctx_flags |= FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;

         if (recurse) {
            for (let i = 0; i <= this.children.boundary; i++) {
               const child = this.children.buffer[i];
               if (child) child.GfxCtxAddFlag(FLAGS, gfx_ctx_parent, recurse);
            }
         }
      }
   }



   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].GenGfxCtx(FLAGS, specific_vb_groupidx);
      }

   }


   Render() {

      if (this.state.mask & MESH_STATE_FLAGS.ACTIVE) {
         // super.AddToGfx();
         super.AddToGfx();
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];

            if (child) child.Render();
         }
      }
   }


   Rerender() {

      super.AddToGfxFromReset();

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Rerender();
      }
   }





   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/


   ColorpickerCreateListeners() {

      const mesh = this; // If in recursion, use as the current mesh the passed param. 

      const parent_listeners = mesh.listeners.buffer;

      const panel = mesh.children.buffer[0];
      const panel2 = panel.children.buffer[panel2_idx];
      const color_pick_mesh = panel.children.buffer[color_pick_idx];
      const hue_mesh = mesh.children.buffer[slider_hue_idx];
      const transp_slider_mesh = panel.children.buffer[slider_trans_idx];
      const color_present_mesh = panel2.children.buffer[color_present_idx];

      { // Color Pick Panel
         Mesh_listener_create(color_pick_mesh, LISTEN_EVENT_TYPES.CLICK_UP)
         const evt_params = { // Create the parameters to pass for the switch's click event. 
            EventClbk: null,
            targetBindingFunctions: null,
            target_mesh: mesh,
            params: null,
         };
         Mesh_listener_add(color_pick_mesh, E.C, mesh.OnClickColorPick, evt_params, parent_listeners[E.C]);
      }

      { // Hue Slider
         // For the hue slider, we create a click event from the Widget Slider class, so that on slider huue click we run the sliders click event.
         Mesh_listener_create(hue_mesh, LISTEN_EVENT_TYPES.CLICK_UP);
         const evt_params = { // Create the parameters to pass for the switch's click event. 
            EventClbk: null,
            targetBindingFunctions: null,
            target_mesh: hue_mesh,
            params: null,
         };
         Mesh_listener_add(hue_mesh, E.C, hue_mesh.OnClick, evt_params, parent_listeners[E.C]);

         /**
          * Here we set up a connection between the slider and this class 'OnClickHuePick()'.
          * We create a callback in the sliders 'EventCallback' buffer, so that the slider 
          * after doing its part of calculation and move, to call this class 
          * 'OnClickHuePick' function for further proccess.
          * 
          */
         const clbk_params = {
            target_mesh: null,
            src_mesh: mesh,
            slider_hue: hue_mesh,
            slider_transp_mesh: transp_slider_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
         }
         hue_mesh.SetInitialValue(.17);
         Slider_simple_connect(hue_mesh, mesh.OnClickHuePick, clbk_params);

      }

      { // Tranparency Slider
         // Create the click event on the slider class
         Mesh_listener_create(transp_slider_mesh, LISTEN_EVENT_TYPES.CLICK_UP);
         const evt_params = { // Create the parameters to pass for the switch's click event. 
            EventClbk: null,
            targetBindingFunctions: null,
            target_mesh: transp_slider_mesh,
            params: null,
         };
         Mesh_listener_add(transp_slider_mesh, E.C, transp_slider_mesh.OnClick, evt_params, parent_listeners[E.C]);

         // Create the callback that the slider will call to run the local method for transparency slider
         const clbk_params_transparency_slider = {
            src_mesh: mesh,
            slider_tran: transp_slider_mesh,
            slider_hue: hue_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
            target_mesh: null,
         }
         transp_slider_mesh.SetInitialValue(1);
         Slider_simple_connect(transp_slider_mesh, mesh.OnClickTranpsarencyPick, clbk_params_transparency_slider)

      }
   }


   OnClick(params) {

      const widget = params.evt_params.target_mesh;

      console.log('COLOR picker widget', widget.name);

      // TODO: Implement Resize functionality

      State_mesh_set_clicked(widget);

      if (widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = Time_intervals_create(10, 'Move Widget_Color_Picker', TIME_INTERVAL_REPEAT_ALWAYS, On_move_clbk, widget);
         widget.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (Mesh_state_check(widget, MESH_STATE_FLAGS.IS_GRABABLE)) {

            State_mesh_set_grabed(widget);
            State_mesh_set_focused(widget);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            widget.StateEnable(MESH_STATE_FLAGS.IN_GRAB | MESH_STATE_FLAGS.IN_FOCUS);
            // Mesh_set_root_in_focus(widget.root_bufferidx);
         }

      }

      return true;

   }





   /*******************************************************************************************************************************************************/
   // Getters-Setters
   /*******************************************************************************************************************************************************/

   GetTransparencySliderHandle() {

      const panel = this.children.buffer[panel_idx];
      const slider_trans = panel.children.buffer[slider_trans_idx];
      const handle_trans = slider_trans.children.buffer[0];
      return handle_trans;
   }





   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   // Called via slider connect function
   OnClickHuePick(params, slider_val) {

      const widget = params.clbk_params.src_mesh;
      const slider_tran = params.clbk_params.slider_transp_mesh;
      const slider_hue = params.clbk_params.slider_hue;
      const color_pick_mesh = params.clbk_params.color_pick_mesh;
      const color_present_mesh = params.clbk_params.color_present_mesh;

      /**
       * part1 part2  3   4
       * .____.____.____.____.
       * .____.____.____.____.
       * Find the correct part from which to get the vertex color(left and right vertex indices)
       * 
       * Formula:
       * res=(x/w) * P  =>  Ceil(res)  :  x->handle_pos, w->hue_bar_width, P->part_index(the part of the hue bar that represents the interpolation of 2 colors)
       * P=(num_vertices-2)/2: we subtract the last(rightmost) 2 vertices, we divide by 2 up and down verts
       * Or in our case: P=num_faces, where num_faces is equal to the total parts of the hue bar.
       * 
       * Compacted
       * indexes=[
       *    (   Ceil( (x/w)*P )-1 )*2 , 
       *    ( ( Ceil( (x/w)*P )-1 )*2 ) + 2
       * ]
       */




      /*****************************************************************************************************/
      // Calculate the color for the color pick panel

      // Get the number of color parts of the hue bar
      const parts = slider_hue.geom.num_faces;

      // Calculate the index of the part, the handle is currently located 
      // Calculate handle pos percentage to be 1 whole unit for every part. E.x: For part1:0-1, part2:1-2, part3:2-3, ...
      slider_val += 0.000001; // Must be > 0 in order to choose the first part and not the -1 part which does not exist
      if (slider_val >= 1) slider_val = .999999; // CAUTION: If the value is greater or equal to 1, then we will advance to the next part of 2 left and rigth vertices which does no exist
      const part_ratio = slider_val * parts;

      let c_idx = Math.ceil(part_ratio);

      c_idx -= 1; // Deal with parts from 0 to n-1
      // Calulate the indices of the colors, that the left and right vertices (from the handles position) represent
      const color_indices = [(c_idx * 2), (c_idx * 2) + 2];


      // Cache the vertex colors of the current part of the hue bar
      const c1 = slider_hue.mat.col[color_indices[0]];
      const c2 = slider_hue.mat.col[color_indices[1]];
      // Get the fraction of the percentage so that it always is 0-1 for any part
      const fract = part_ratio - Floor(part_ratio);
      const c = Mix_vec4_float32Array(c1, c2, fract);

      // console.log((x/w)*parts, (slider_val*parts))

      const num_faces = color_pick_mesh.geom.num_faces; // Face Index:The first one
      const vidx = 2; // Vertex Index: Top-Right
      // CAUTION: Make sure the vertex count is not surpassing the mesh and starts updating the color of the next mesh in the vertex buffer 
      const vertex_count = 1; // How many vertices of the mesh to update 

      // Store the calculated color to the color pick mesh 
      for (let i = 0; i < vertex_count; i++)
         CopyArr4(color_pick_mesh.mat.col[i + vidx], c);

      // Update the vertex buffer
      if (color_pick_mesh.gfx)
         Gl_set_rgba_per_vertex_specify_vertex(color_pick_mesh.gfx, c, num_faces, vidx, vertex_count);





      /*****************************************************************************************************/
      // Calculate the color for the color present panel

      // Set the new color picked in the color present panel of the widget


      // Adjust the new hue to the color present panel
      const xx = widget.color_pick_click_pos[0]; // The x coord of the selected area of the color pick panel
      const y = widget.color_pick_click_pos[1]; // The y coord of the selected area of the color pick panel

      // TODO: We need to update only the top-right vertex color, NOT all vertices colors
      const percentagex = (xx / color_pick_mesh.geom.dim[0] / 2); // Calc the percentage, x coord
      const percentagey = 1 - (y / color_pick_mesh.geom.dim[1] / 2); // Calc the percentage, y coord
      const hue = Mix_vec3_float32Array([1, 1, 1, 1], c, percentagex);
      const intensity = Mix_vec3_float32Array([0, 0, 0, 1], hue, percentagey);

      const alpha = slider_tran.slider_val; // Get the alpha from the transparency slider
      // Contruct the final color
      const final_color = new Float32Array([intensity[0], intensity[1], intensity[2], alpha]);
      CopyMat4_arr4(color_present_mesh.mat.col, final_color);
      if (color_present_mesh.gfx)
         Gl_set_rgba(color_present_mesh.gfx, final_color, color_present_mesh.geom.num_faces);









      /*****************************************************************************************************/
      // Assign the color to the top vertices of the transparency slider

      CopyArr4(slider_tran.mat.col[0], final_color);
      CopyArr4(slider_tran.mat.col[2], final_color);
      if (slider_tran.gfx)
         Gl_set_rgba_per_vertex(slider_tran.gfx, slider_tran.mat.col)





      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(intensity[0])
      widget.label_g.text_mesh.RenderTextFromNumber(intensity[1])
      widget.label_b.text_mesh.RenderTextFromNumber(intensity[2])
      widget.label_a.text_mesh.RenderTextFromNumber(final_color[3])




      /*****************************************************************************************************/
      // Update target meshes

      if (widget.temp_target_mesh_clbk) {

         widget.temp_target_mesh_params.mnemonics.transparency = slider_tran.slider_val;
         widget.temp_target_mesh_params.mnemonics.hue = slider_hue.slider_val;

         widget.temp_target_mesh_clbk(
            new Float32Array([
               intensity[0],
               intensity[1],
               intensity[2],
               final_color[3],
            ]),
            widget.temp_target_mesh_params,
         );
      }

   }


   OnClickTranpsarencyPick(params, slider_val) {

      const widget = params.clbk_params.src_mesh;
      const slider_tran = params.clbk_params.slider_tran;
      const slider_hue = params.clbk_params.slider_hue;
      const num_faces = slider_tran.geom.num_faces; // Face Index:The first one
      const alphaidx = 3;


      slider_tran.slider_val = slider_val; // In case this function is called before slider been rendered




      /*****************************************************************************************************/
      // Calculate the color for the color present panel

      // Set the new color picked in the color present panel of the widget
      const color_present_mesh = params.clbk_params.color_present_mesh;

      if (color_present_mesh.mat.col[0].constructor === Float32Array) {

         for (let i = 0; i < color_present_mesh.mat.col.length; i++)
            color_present_mesh.mat.col[i][alphaidx] = slider_val;
      }
      else color_present_mesh.mat.col[alphaidx] = slider_val;

      const vertex_idx = 0, vcount = 4;
      if (color_present_mesh.gfx) Gl_set_rgba_specify_attribute(color_present_mesh.gfx, slider_val, num_faces, vertex_idx, vcount, alphaidx);





      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[0][0])
      widget.label_g.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[0][1])
      widget.label_b.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[0][2])
      widget.label_a.text_mesh.RenderTextFromNumber(slider_val)




      /*****************************************************************************************************/
      // Update target meshes

      if (widget.temp_target_mesh_clbk) {

         widget.temp_target_mesh_params.mnemonics.transparency = slider_tran.slider_val;
         widget.temp_target_mesh_params.mnemonics.hue = slider_hue.slider_val;

         widget.temp_target_mesh_clbk(
            new Float32Array([
               color_present_mesh.mat.col[0][0],
               color_present_mesh.mat.col[0][1],
               color_present_mesh.mat.col[0][2],
               slider_val,
            ],),
            widget.temp_target_mesh_params,
         );
      }


   }


   OnClickColorPick(params) {

      // const panel = params.evt_params.target_mesh;
      const widget = params.evt_params.target_mesh;
      const panel = widget.children.buffer[0]; // HACk: we do not have a dedicated idx var for the panel, but we know its the first child
      const color_pick_mesh = panel.children.buffer[color_pick_idx];
      const panel2 = panel.children.buffer[panel2_idx]; // HACk: we do not have a dedicated idx var for the panel, but we know its the first child

      const click_pos = params.click_pos;
      const x = click_pos[0] -  Mesh_get_real_pos_x(color_pick_mesh); // Tranform to mesh coordinates (0 t0 mesh dim)
      const y = click_pos[1] -  Mesh_get_real_pos_y(color_pick_mesh); // Tranform to mesh coordinates (0 t0 mesh dim)
      widget.color_pick_click_pos = [x, y];

      const percentagex = (x / color_pick_mesh.geom.dim[0] / 2); // Calc the percentage 
      const percentagey = 1 - (y / color_pick_mesh.geom.dim[1] / 2); // Calc the percentage 
      // console.log('percentagex', percentagex, 'percentagey', percentagey)


      // Finally calculate the interpolated rgb values from the percenage of the click and the colors of all 4 vertices of the color pick mesh
      /**
       * The x axis controls the color hue. That is white on the left and the right's vertex color to the right
       * The y axis controls the color intensity. That is black on the bottom and full color to the top
      */

      const color = color_pick_mesh.mat.col[2]; // is the v4 or the upper right vertex
      const hue = Mix_vec4_float32Array(WHITE, color, percentagex);
      const intensity = Mix_vec4_float32Array(BLACK, hue, percentagey);



      /*****************************************************************************************************/
      // Assign the color to the top vertices of the transparency slider

      const transp_slider = panel.children.buffer[slider_trans_idx];
      CopyArr3(transp_slider.mat.col[0], intensity);
      CopyArr3(transp_slider.mat.col[2], intensity);
      if (transp_slider.gfx) Gl_set_rgba_per_vertex(transp_slider.gfx, transp_slider.mat.col)
      intensity[3] = transp_slider.slider_val;






      /*****************************************************************************************************/
      // Set the new color picked in the color present panel of the widget

      const color_present_mesh = panel2.children.buffer[color_present_idx];
      CopyMat4_arr4(color_present_mesh.mat.col, intensity);
      Gl_set_rgba(color_present_mesh.gfx, intensity, color_present_mesh.geom.num_faces);





      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(intensity[0])
      widget.label_g.text_mesh.RenderTextFromNumber(intensity[1])
      widget.label_b.text_mesh.RenderTextFromNumber(intensity[2])
      widget.label_a.text_mesh.RenderTextFromNumber(intensity[3])





      /*****************************************************************************************************/
      // Update target meshes

      if (widget.temp_target_mesh_clbk) {

         // widget.temp_target_mesh_params.mnemonics.transparency = slider_tran.slider_val;
         // widget.temp_target_mesh_params.mnemonics.hue = slider_hue.slider_val;
         // widget.temp_target_mesh_params.mnemonics.hue = slider_hue.slider_val;

         widget.temp_target_mesh_clbk(intensity, widget.temp_target_mesh_params);
      }
   }


   AssignTargetMeshClbk(Clbk, params) {
      this.temp_target_mesh_clbk = Clbk;
      this.temp_target_mesh_params = params;
   }


   SetTransparencySliderSetInitialValue(slider_val) {

      const mesh = this;
      const panel = mesh.children.buffer[0];
      const panel2 = panel.children.buffer[panel2_idx];
      const color_pick_mesh = panel.children.buffer[color_pick_idx];
      const transp_slider_mesh = panel.children.buffer[slider_trans_idx];
      const color_present_mesh = panel2.children.buffer[color_present_idx];


      const params = {
         clbk_params: {

            src_mesh: mesh,
            slider_tran: transp_slider_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
            target_mesh: null,
         },

      };

      if (transp_slider_mesh.gfx !== null) {

         Slider_simple_set_value(transp_slider_mesh, slider_val);
         this.OnClickTranpsarencyPick(params, slider_val)
      }
      else {

         const interpolated_slider_val = transp_slider_mesh.SetInitialValue(slider_val);
         this.OnClickTranpsarencyPick(params, interpolated_slider_val)
      }



   }


   SetHueSliderSetInitialValue(slider_val) {

      const mesh = this;
      const panel = mesh.children.buffer[0];
      const panel2 = panel.children.buffer[panel2_idx];
      const color_pick_mesh = panel.children.buffer[color_pick_idx];
      const transp_slider_mesh = panel.children.buffer[slider_trans_idx];
      const color_present_mesh = panel2.children.buffer[color_present_idx];
      const hue_mesh = mesh.children.buffer[slider_hue_idx];


      const params = {
         clbk_params: {

            src_mesh: mesh,
            slider_hue: hue_mesh,
            slider_transp_mesh: transp_slider_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
            target_mesh: null,
         },

      };

      if (hue_mesh.gfx !== null) {

         Slider_simple_set_value(hue_mesh, slider_val);
         this.OnClickHuePick(params, slider_val)
      }
      else {

         const interpolated_slider_val = hue_mesh.SetInitialValue(slider_val);
         this.OnClickHuePick(params, interpolated_slider_val)
      }

   }



}






function On_move_clbk(params) {

   const widget = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (Mesh_state_check(widget, MESH_STATE_FLAGS.IN_GRAB) === 0 && widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      Time_intervals_destroy_byidx(intervalIdx);
      widget.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_dif = Mouse_get_pos_dif();
   if (mouse_dif.x === 0 && mouse_dif.y === 0) return;

   Mesh_unif_add_vb_root_wpos(widget.root_posidx, mouse_dif.x, -mouse_dif.y)

}

