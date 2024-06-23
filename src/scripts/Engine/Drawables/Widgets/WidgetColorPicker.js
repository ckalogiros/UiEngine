"use strict"

import { Gl_set_rgba, Gl_set_rgba_per_vertex, Gl_set_rgba_per_vertex_specify_vertex, Gl_set_rgba_specify_attribute } from "../../../Graphics/Buffers/VertexBuffersOps";
import { Floor, Mix_vec3, Mix_vec4 } from "../../../Helpers/Math/MathOperations";
import { MouseGetPosDif } from "../../Controls/Input/Mouse";
import { Create_rect_mesh, Create_widget_label, Create_widget_section, Create_widget_slider_simple } from "../../Core/CreateWidget";
import { Mesh_buffer_get_mesh_byidx, Widget_root_batch_get_all_roots_by_vertex_buffer, Widget_root_set_in_focus, Widget_root_set_uniform_callback_per_gfx_root_mesh } from "../../Core/MeshBuffer";
import { Mesh_unif_add_vb_root_wpos } from "../../Core/MeshUniformsBuffer";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners";
import { BLACK, BLUE, BLUEL, GREEN, GREY, RED, REDL, WHITE, YELLOW } from "../Material/Base/Colors";
import { Section } from "../Meshes/Section";
import { Find_parent_listen_event } from "../Operations/Recursions";
import { Slider_connect } from "./WidgetSlider";



// TODO: Deal with these global variables, especially if we need to cob=nstruct a second Colorpicker widget
let temp_panel2_idx = INT_NULL;
let temp_hue_pick_idx = INT_NULL;
let temp_color_pick_idx = INT_NULL;
let temp_color_present_idx = INT_NULL;
let temp_tran_slider_idx = INT_NULL;
let temp_slider_idx = INT_NULL;



export class Widget_Color_Picker extends Section {

   color_pick_click_pos; // We need to store the selected color position (of the clor pick panes)(from the clicked position)
   label_r;
   label_g;
   label_b;
   label_a;

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), margin, pos, dim, col, name = 'Color Picker', style, num_faces, is_debug_mesh) {


      // super(mesh_bufferidx, ROOT_WIDGET_FLAGS, options, margin, pos, dim, col, name, style, is_debug_mesh);
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, options, margin, pos, dim, col, name, style, num_faces, is_debug_mesh);


      // Multi color vertex
      this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      this.mat.col = [GREY[0], GREY[1], GREY[0], GREY[1]];
      // this.mat.col = [BLUEL[6], BLUEL[6], BLUEL[6], BLUEL[6]];
      this.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      this.options |= SECTION.RESIZE_PARENT;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      this.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)


      this.label_r = null;
      this.label_g = null;
      this.label_b = null;
      this.label_a = null;



      /******************************************************************************/
      // Create panel to align further meshes
      style[1] = 10;
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 1], _, col, 'Color Picker Panel', style, is_debug_mesh, 1);
      panel.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      panel.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      panel.options |= SECTION.RESIZE_PARENT;
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // panel.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      // panel.EnableGfxUniforms({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfxUniforms({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.mat.col = [
         // YELLOWL[1], YELLOWL[2], YELLOWL[1], YELLOWL[2]
         GREY[1], GREY[3], GREY[1], GREY[3]
      ];
      this.AddItem(panel)






      /******************************************************************************/
      // Create the color picker panel
      const color_pick = Create_rect_mesh(_, [20, 20, 2], [150, 150], col, 'Color Picker', style, [0, 0], 1, is_debug_mesh);
      color_pick.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      color_pick.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      color_pick.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // color_pick.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      // color_pick.EnableGfxUniforms({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // color_pick.EnableGfxUniforms({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      color_pick.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
      color_pick.mat.col = [
         BLACK, WHITE,     // v1-v2
         BLACK, YELLOW[9], // v3-v4
      ];

      color_pick.state.mask &= ~MESH_STATE.ACTIVE;
      temp_color_pick_idx = panel.AddItem(color_pick);



      /******************************************************************************/
      // Create panel for the color presentation and info labels
      const panel2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 1], _, col, 'Inner Panel 1', style, is_debug_mesh, 1);
      panel2.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      panel2.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      panel2.options |= SECTION.RESIZE_PARENT;
      panel2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // panel2.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      // panel2.EnableGfxUniforms({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel2.EnableGfxUniforms({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel2.StylesSetMargin([10, 0]);
      panel2.mat.col = [
         BLACK, BLACK, // v1-v2
         BLACK, BLACK, // v3-v4
      ];
      // panel2.mat.col = [
      //    GREEN[2], GREEN[2], // v1-v2
      //    GREEN[2], GREEN[2], // v3-v4
      // ];
      temp_panel2_idx = panel.AddItem(panel2)




      /******************************************************************************/
      // Create the color present mesh
      const color_present = Create_rect_mesh(_, [20, 20, 2], [80, 60], col, 'Color Present', style, [0, 0], 1, is_debug_mesh);
      color_present.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      color_present.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      color_present.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // color_present.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      // panel.EnableGfxUniforms({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // color_present.EnableGfxUniforms({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      color_present.StylesSetMargin([0, 0]);
      color_present.mat.col = [
         YELLOW[9], YELLOW[9], // v1-v2
         YELLOW[9], YELLOW[9],   // v3-v4
      ];

      this.color_pick_click_pos = [0, 0];
      temp_color_present_idx = panel2.AddItem(color_present);


      /******************************************************************************/
      // Create Label Info meshes
      {
         {
            const label = Create_widget_label(_, 'R', _, [0, 0, 3], 8, REDL[5], WHITE, _, _, style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            // label.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            // label.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // label.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
            label.StylesSetMargin([5, 5]);
            panel2.AddItem(label);

            this.label_r = Create_widget_label(_, 'RRRRR', _, [0, 0, 3], 8, GREY[2], WHITE, _, _, style);
            this.label_r.temp_align |= SECTION.HORIZONTAL;
            this.label_r.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            // this.label_r.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            // this.label_r.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // this.label_r.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
            this.label_r.StylesSetMargin([5, 0]);
            panel2.AddItem(this.label_r);
         }
         {
            const label = Create_widget_label(_, 'G', _, [0, 0, 3], 8, GREEN[4], WHITE, _, _, style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            // label.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            // label.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // label.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
            label.StylesSetMargin([5, 5]);
            panel2.AddItem(label);

            this.label_g = Create_widget_label(_, 'GGGGG', _, [0, 0, 3], 8, GREY[2], WHITE, _, _, style);
            this.label_g.temp_align |= SECTION.HORIZONTAL;
            this.label_g.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            // this.label_g.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            // this.label_g.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // this.label_g.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
            this.label_g.StylesSetMargin([5, 0]);
            panel2.AddItem(this.label_g);
         }
         {
            const label = Create_widget_label(_, 'B', _, [0, 0, 3], 8, BLUEL[6], WHITE, _, _, style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            // label.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            // label.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // label.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            label.StylesSetMargin([5, 5]);
            panel2.AddItem(label);

            this.label_b = Create_widget_label(_, 'BBBBB', _, [0, 0, 3], 8, GREY[2], WHITE, _, _, style);
            this.label_b.temp_align |= SECTION.HORIZONTAL;
            this.label_b.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            // this.label_b.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            // this.label_b.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // this.label_b.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
            this.label_b.StylesSetMargin([5, 0]);
            panel2.AddItem(this.label_b);
         }
         {
            const label = Create_widget_label(_, 'A', _, [0, 0, 3], 8, GREY[6], WHITE, _, _, style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            label.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            label.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // label.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            label.StylesSetMargin([5, 5]);
            panel2.AddItem(label);

            this.label_a = Create_widget_label(_, 'AAAAA', _, [0, 0, 3], 8, GREY[2], WHITE, _, _, style);
            this.label_a.temp_align |= SECTION.HORIZONTAL;
            this.label_a.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            this.label_a.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
            this.label_a.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            // this.label_a.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            this.label_a.StylesSetMargin([5, 0]);
            panel2.AddItem(this.label_a);
         }


      }

      /******************************************************************************/
      // Create the tranparency slider

      // const slider = Create_widget_slider_simple(_, [0, 0, 2], [250, 20], HUE_COLOR, [0, 0], [4, 20], HUE_COLOR.length-1);
      const slider_tran = Create_widget_slider_simple(_, [0, 0, 13], [12, 150], [WHITE, WHITE, WHITE, WHITE], [0, 0], [12, 4], 1);
      slider_tran.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      slider_tran.children.buffer[0].sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X; // Set the handle
      slider_tran.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      slider_tran.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // slider_tran.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
      // slider_tran.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // slider_tran.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
      slider_tran.SetStyle(style);
      // slider_tran.StylesSetPad([20,20]);
      slider_tran.StylesSetMargin([10, 0]);

      slider_tran.mat.col = [
         [0.3, 0.3, 0.3, .3],
         RED[9],
         [0.3, 0.3, 0.3, .3],
         RED[9],
      ];

      const clbk_params_transparency_slider = {
         target_mesh: null,
         src_mesh: this,
         slider_mesh: slider_tran,
         color_pick_mesh: color_pick,
         color_present_mesh: color_present,
      }
      // Slider_connect(slider, ()=>{console.log('HI FROM SLIDER CONNECT CLBK');}, null)
      Slider_connect(slider_tran, this.OnClickTranpsarencyPick, clbk_params_transparency_slider)
      temp_tran_slider_idx = panel.AddItem(slider_tran);








      /******************************************************************************/
      // Create the hue picker mesh
      const HUE_COLOR = [
         RED[9], RED[9],
         YELLOW[9], YELLOW[9], // v1-v2
         GREEN[9], GREEN[9],   // v3-v4
         BLUE[9], BLUE[9],   // v5-v6
         RED[9], RED[9],
      ];

      const vertices_count = (HUE_COLOR.length / 2) - 1;

      const slider = Create_widget_slider_simple(_, [0, 0, 2], [250, 20], [WHITE, WHITE, WHITE, WHITE], [0, 0], [4, 20], vertices_count);
      
      slider.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      slider.children.buffer[0].sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X; // Set the handle
      slider.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // slider.GfxUniformsEnable({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED)
      // slider.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // slider.GfxUniformsEnable({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS)
      slider.StylesSetMargin([0, 20]);
      slider.SetStyle(style);

      slider.mat.col = HUE_COLOR;

      const clbk_params = {
         target_mesh: null,
         src_mesh: this,
         slider_mesh: slider,
         slider_transp_mesh: slider_tran,
         color_pick_mesh: color_pick,
         color_present_mesh: color_present,
      }
      Slider_connect(slider, this.OnClickHuePick, clbk_params);


      temp_slider_idx = this.AddItem(slider);


   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/


   SetGfxEnableAttributes(which, params) {
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


   /** Must run for every mesh */
   GfxUniformsEnable(flags, name, type, shader_flags) {
      // alert('+++\nGfxUniformsEnable')
      super.EnableGfxUniforms(flags, name, type, shader_flags);
      
      for (let i = 0; i <= this.children.boundary; i++) {
         if(this.children.buffer[i].GfxUniformsEnable === null)
            console.log()
         if (this.children.buffer[i]) this.children.buffer[i].GfxUniformsEnable(flags, name, type, shader_flags);
      }
   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      
      // Call for each root mesh in every vertex buffer
      Widget_root_set_uniform_callback_per_gfx_root_mesh(this.root_bufferidx, unif_name, Clbk, clbk_params);

   }


   GfxCtxSetFlag(FLAGS) {
      alert('-1 COLORPICKER')
   }




   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL, params = null) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].GenGfxCtx(FLAGS, specific_vb_groupidx, params);
      }
   }


   Render() {

      if (this.state.mask & MESH_STATE.ACTIVE) {
         super.AddToGfx();
         for (let i = 0; i <= this.children.boundary; i++) {
            if (this.children.buffer[i]) this.children.buffer[i].Render();
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

   // TODO: THIS IS A BIG MESS
   ConstructListeners(parent_listeners = null) {

      // super.ConstructListeners()

      const mesh = this; // If in recursion, use as the current mesh the passed param. 

      for (let i = 0; i <= mesh.listeners.boundary; i++) {

         if (mesh.listeners.buffer[i]) {

            if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
               parent_listeners = [null, null];
               parent_listeners[i] = Find_parent_listen_event(i, mesh);
            }
            else if (parent_listeners[i] === null) {
               parent_listeners[i] = Find_parent_listen_event(i, mesh);
            }

            const evt_params = { // Create the parameters to pass for the switch's click event. 
               EventClbk: null,
               targetBindingFunctions: null,
               target_mesh: this,
               params: null,
            };

            mesh.AddListenEvent(i, mesh.OnClick, evt_params, parent_listeners[i]);
            parent_listeners[i] = mesh.listeners.buffer[i];
         }
      }

      const panel = this.children.buffer[0];

      {
         const color_mesh = panel.children.buffer[temp_color_pick_idx];
         const evt_params = { // Create the parameters to pass for the switch's click event. 
            EventClbk: null,
            targetBindingFunctions: null,
            target_mesh: this,
            params: null,
         };
         color_mesh.AddListenEvent(E.C, mesh.OnClickColorPick, evt_params, parent_listeners[E.C]);
      }


      const hue_mesh = mesh.children.buffer[temp_slider_idx];
      hue_mesh.ConstructListeners(parent_listeners);

      const transp_slider_mesh = panel.children.buffer[temp_tran_slider_idx];
      transp_slider_mesh.ConstructListeners(parent_listeners);

      {
         // const hue_mesh = mesh.children.buffer[temp_hue_pick_idx];
         // const hue_mesh = mesh.children.buffer[temp_slider_idx];
         // hue_mesh.ConstructListeners(parent_listeners);
         // const evt_params = { // Create the parameters to pass for the switch's click event. 
         //    EventClbk: null,
         //    targetBindingFunctions: null,
         //    target_mesh: mesh,
         //    params: null,
         // };
         // hue_mesh.AddListenEvent(E.C, mesh.OnClickHuePick, evt_params, parent_listeners[E.C]);
      }
   }


   OnClick(params) {

      const widget = params.evt_params.target_mesh;
      // const hue_mesh = widget.children.buffer[temp_hue_pick_idx];
      // const color_mesh = widget.children.buffer[temp_color_pick_idx];

      console.log('COLOR picker widget', widget.name);

      // TODO: Implement Move and Resize functionality

      STATE.mesh.SetClicked(widget);

      if (widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const pos = widget.GetPosXY();
         // const right = pos[0] + widget.geom.dim[0]*2;
         // const bottom = pos[1] + widget.geom.dim[1]*2;

         // const point = MouseGetPos();
         // if (widget.state.mask & MESH_STATE.IS_RESIZEABLE && (point[0] > right - TEMP_RESIZE_MARGIN[0] || point[1] > bottom - TEMP_RESIZE_MARGIN[1])) {

         //    // We have Resize
         //    if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
         //       // console.log('X Y RESIZE');

         //       const OnResizeFn = widget.OnResize;
         //       const idx = TimeIntervalsCreate(10, 'ResizeXY Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, widget);
         //       widget.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
         //    }
         //    else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
         //       // console.log('X RESIZE');
         //    }
         //    else { // Its a height resize
         //       // console.log('Y RESIZE');
         //    }

         //    widget.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS;
         //    STATE.mesh.SetGrabed(widget);
         //    STATE.mesh.SetFocused(widget);
         //    Widget_root_set_in_focus(widget.root_bufferidx);


         //    return true;
         // }


         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, On_move_clbk, widget);
         widget.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (widget.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(widget);
            STATE.mesh.SetFocused(widget);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            widget.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
            Widget_root_set_in_focus(widget.root_bufferidx);
         }

      }

      return true;

   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   // Called via slider connect function
   OnClickHuePick(params, slider_val) {

      const widget = params.src_mesh;
      const slider = params.slider_mesh;
      const slider_tran = params.slider_transp_mesh;
      const color_pick_mesh = params.color_pick_mesh;

      /**
       * part1 part2  3   4
       * .____.____.____.____.
       * .____.____.____.____.
       * Find the correct part from which to get the vertex color(left and right vertex indices)
       * 
       * Formula:
       * res=(x/w) * P  =>  Ceil(res)  :  x->handle_pos, w->hue_bar_width, P->part_index(the part of the hue bar that represents the interpolation of 2 colors)
       * P=(num_vertices-2)/2: we subtract the last(rightmost) 2 vertices, we devide by 2 up and down verts
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
      const parts = slider.geom.num_faces;
      // Calculate the index of the part the handle is currently located 

      // Calculate handle pos percentage to be 1 whole unit for every part. E.x: For part1:0-1, part2:1-2, part3:2-3, ...
      slider_val += 0.000001; // Must be > 0 in order to choose the first part and not the -1 part which does not exist
      if (slider_val >= 1) slider_val = .999999; // CAUTION: If the value is greate or equal to 1, then we will advance to the next part of 2 left and rigth vertices which does no exist
      const part_ratio = slider_val * parts


      let c_idx = Math.ceil(part_ratio);

      c_idx -= 1; // Deal with parts from 0 to n-1
      // Calulate the indices of the colors, that the left and right vertices (from the handles position) represent
      const color_indices = [(c_idx * 2), (c_idx * 2) + 2];

      // TODO: Mix the rgb only and finaly get the alpha fro the transparency slider, for both color picker and presen meshes

      // Cache the vertex colors of the current part of the hue bar
      const c1 = slider.mat.col[color_indices[0]];
      const c2 = slider.mat.col[color_indices[1]];
      // Get the fraction of the percentage so that it always is 0-1 for any part
      const fract = part_ratio - Floor(part_ratio);
      const c = Mix_vec4(c1, c2, fract);

      // console.log((x/w)*parts, (slider_val*parts))

      const num_faces = color_pick_mesh.geom.num_faces; // Face Index:The first one
      const vidx = 3; // Vertex Index: Top-Right
      // CAUTION: Make sure the vertex count is not surpassing the mesh and start updating the color of the next mesh in the vertex buffer 
      const vertex_count = 1; // How many vertices of the mesh to update 

      // Store the calculated color to the color pick mesh 
      for (let i = 0; i < vertex_count; i++)
         color_pick_mesh.mat.col[i + vidx] = c;
      // Update the vertex buffer
      Gl_set_rgba_per_vertex_specify_vertex(color_pick_mesh.gfx, c, num_faces, vidx, vertex_count);





      /*****************************************************************************************************/
      // Calculate the color for the color present panel

      // Set the new color picked in the color present panel of the widget
      const color_present_mesh = params.color_present_mesh;

      // Adjust the new hue to the color present panel
      const xx = widget.color_pick_click_pos[0]; // The x coord of the selected area of the color pick panel
      const y = widget.color_pick_click_pos[1]; // The y coord of the selected area of the color pick panel

      // TODO: We need to update only the top-right vertex color, NOT all vertices colors
      const percentagex = (xx / color_pick_mesh.geom.dim[0] / 2); // Calc the percentage, x coord
      const percentagey = 1 - (y / color_pick_mesh.geom.dim[1] / 2); // Calc the percentage, y coord
      const hue = Mix_vec3(WHITE, c, percentagex);
      const intensity = Mix_vec3(BLACK, hue, percentagey);

      // Check if mesh has color per vertex, and get the alpha from any vertex 
      const alpha = (Array.isArray(color_present_mesh.mat.col[0])) ? color_present_mesh.mat.col[0][3] : color_present_mesh.mat.col[3];
      // Contruct the final color
      const final_color = [intensity[0], intensity[1], intensity[2], alpha];
      Gl_set_rgba(color_present_mesh.gfx, final_color, color_present_mesh.geom.num_faces);





      /*****************************************************************************************************/
      // Assign the color to the top vertices of the transparency slider

      slider_tran.mat.col[1] = c;
      slider_tran.mat.col[3] = c;
      Gl_set_rgba_per_vertex(slider_tran.gfx, slider_tran.mat.col)





      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(intensity[0])
      widget.label_g.text_mesh.RenderTextFromNumber(intensity[1])
      widget.label_b.text_mesh.RenderTextFromNumber(intensity[2])
      widget.label_a.text_mesh.RenderTextFromNumber(final_color[3])

      // console.log(c)

   }


   OnClickTranpsarencyPick(params, slider_val) {

      const widget = params.src_mesh;
      const slider = params.slider_mesh;
      const color_pick_mesh = params.color_pick_mesh;
      const num_faces = slider.geom.num_faces; // Face Index:The first one
      const alphaidx = 3;





      /*****************************************************************************************************/
      // Calculate the color for the color pick panel
      const vidx = 0; // Vertex Index:Top-Right
      // CAUTION: Make sure the vertex count is not surpassing the mesh and start updating the color of the next mesh in the vertex buffer 
      const vertex_count = 4; // How many vertices of the mesh to update 
      for (let i = vidx; i < vertex_count; i++)
         color_pick_mesh.mat.col[i][alphaidx] = slider_val;

      // Update the vertex buffer
      Gl_set_rgba_specify_attribute(color_pick_mesh.gfx, slider_val, num_faces, vidx, vertex_count, alphaidx);





      /*****************************************************************************************************/
      // Calculate the color for the color present panel

      // Set the new color picked in the color present panel of the widget
      const color_present_mesh = params.color_present_mesh;

      // if (Array.isArray(color_present_mesh.mat.col[0])) {

      //    for (let i = 0; i < color_present_mesh.mat.col.length; i++)
      //       color_present_mesh.mat.col[i][alphaidx] = slider_val;
      // }
      // else color_present_mesh.mat.col[alphaidx] = slider_val;
      color_present_mesh.mat.col[alphaidx] = slider_val;

      const vertex_idx = 0, vcount = 4;
      Gl_set_rgba_specify_attribute(color_present_mesh.gfx, slider_val, num_faces, vertex_idx, vcount, alphaidx)





      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[0])
      widget.label_g.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[1])
      widget.label_b.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[2])
      widget.label_a.text_mesh.RenderTextFromNumber(slider_val)
   }


   OnClickColorPick(params) {

      // const panel = params.evt_params.target_mesh;
      const widget = params.evt_params.target_mesh;
      const panel = widget.children.buffer[0]; // HACk: we do not have a dedicated idx var for the panel, but we know its the first child
      const color_pick_mesh = panel.children.buffer[temp_color_pick_idx];
      const panel2 = panel.children.buffer[temp_panel2_idx]; // HACk: we do not have a dedicated idx var for the panel, but we know its the first child

      const click_pos = params.click_pos;
      const x = click_pos[0] - color_pick_mesh.GetPosX(); // Tranform to mesh coordinates (0 t0 mesh dim)
      const y = click_pos[1] - color_pick_mesh.GetPosY(); // Tranform to mesh coordinates (0 t0 mesh dim)
      widget.color_pick_click_pos = [x, y];

      const percentagex = (x / color_pick_mesh.geom.dim[0] / 2); // Calc the percentage 
      const percentagey = 1 - (y / color_pick_mesh.geom.dim[1] / 2); // Calc the percentage 
      console.log('percentagex', percentagex, 'percentagey', percentagey)


      // Finally calculate the interpolated rgb values from the percenage of the click and the colors of all 4 vertices of the color pick mesh
      /**
       * The x axis controls the color hue. That is white on the left and the right's vertex color to the right
       * The y axis controls the color intensity. That is black on the bottom and full color to the top
       */
      const color = color_pick_mesh.mat.col[3]; // The 4-th is the v4 or the upper right vertex
      const hue = Mix_vec4(WHITE, color, percentagex);
      const intensity = Mix_vec4(BLACK, hue, percentagey);

      // Set the new color picked in the color present panel of the widget
      const color_present_mesh = panel2.children.buffer[temp_color_present_idx];
      Gl_set_rgba(color_present_mesh.gfx, intensity, color_present_mesh.geom.num_faces);





      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(intensity[0])
      widget.label_g.text_mesh.RenderTextFromNumber(intensity[1])
      widget.label_b.text_mesh.RenderTextFromNumber(intensity[2])
      widget.label_a.text_mesh.RenderTextFromNumber(intensity[3])

   }
}






function On_move_clbk(params) {

   const widget = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (widget.StateCheck(MESH_STATE.IN_GRAB) === 0 && widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      widget.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_dif = MouseGetPosDif();
   if (mouse_dif.x === 0 && mouse_dif.y === 0) return;

   Mesh_unif_add_vb_root_wpos(widget.root_posidx, [mouse_dif.x, -mouse_dif.y])

   // Widget_root_gfx_add_unif_wpos_per_vb(section.root_bufferidx, [mouse_dif.x, -mouse_dif.y]);

}