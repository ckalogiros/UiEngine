"use strict"

import { Gl_set_rgba, Gl_set_rgba_per_vertex, Gl_set_rgba_per_vertex_specify_vertex, Gl_set_rgba_specify_attribute } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { CopyArr3, CopyArr4, Floor, Mix_vec3_float32Array, Mix_vec4_float32Array } from "../../../Helpers/Math/MathOperations.js";
import { MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Create_rect_mesh, Create_widget_label, Create_widget_section, Create_widget_slider_simple } from "../../Core/CreateWidget.js";
import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer.js";
import { Mesh_unif_add_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Root_group_set_in_focus, Root_group_per_vb_meshidx_view_get_all_roots } from "../../Core/Views/RootView.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";
import { BLACK, BLUE, BLUEL, GREEN, GREY, RED, REDL, TRANSPARENT, WHITE, YELLOW } from "../Material/Base/Colors.js";
import { Section } from "../Meshes/Section.js";
import { Slider_simple_connect } from "./WidgetSlider.js";




// TODO: Deal with these global variables, especially if we need to cob=nstruct a second Colorpicker widget
let temp_panel2_idx = INT_NULL;
let temp_hue_pick_idx = INT_NULL;
let temp_color_pick_idx = INT_NULL;
let temp_color_present_idx = INT_NULL;
let temp_tran_slider_idx = INT_NULL;



export class Widget_Color_Picker extends Section {

   color_pick_click_pos; // We need to store the selected color position (of the clor pick panes)(from the clicked position)
   label_r;
   label_g;
   label_b;
   label_a;
   
   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), margin, pos, dim=[100, 100], col=GREY[1], name = 'Color Picker', style=[0, 10, 2], num_faces, is_debug_mesh) {
      

      const scale = .6;
      style[1] = 15
      
      if(col[0].constructor !== Float32Array) alert('Colorpicker needs Multicolor for the constructor\nConsider passing an array of 4 COLORS')
      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, options, [margin[0]*scale, margin[1]*scale], pos, [dim[0]*scale, dim[1]*scale], col, name, style, num_faces, _, is_debug_mesh);
      
      
      // Multi color vertex
      this.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      this.options |= SECTION.RESIZE_PARENT;

      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      // this.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)


      this.label_r = null;
      this.label_g = null;
      this.label_b = null;
      this.label_a = null;

      this.temp_target_mesh_clbk = null;



      /******************************************************************************/
      // Create panel to align further meshes
      style[1] = 10;
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10*scale, 10*scale], [0, 0, 1], _, [GREY[1], GREY[3], GREY[1], GREY[3]], 'Color Picker Panel', style, 1, _, is_debug_mesh);
      panel.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      panel.options |= SECTION.RESIZE_PARENT;
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      this.AddItem(panel)






      /******************************************************************************/
      // Create the color picker panel
      const color_pick = Create_rect_mesh(_, [20, 20, 2], [150*scale, 150*scale], [BLACK, WHITE, BLACK, YELLOW[9]], 'Color Picker', style, [0, 0], 1, is_debug_mesh);
      color_pick.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      color_pick.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      // color_pick.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

      color_pick.state.mask &= ~MESH_STATE.ACTIVE;
      temp_color_pick_idx = panel.AddItem(color_pick);



      /******************************************************************************/
      // Create panel for the color presentation and info labels
      const panel2 = Create_widget_section(_, SECTION.VERTICAL, [10*scale, 10*scale], [0, 0, 1], _, [BLACK, BLACK, BLACK, BLACK], 'Inner Panel 1', style, 1, _, is_debug_mesh);
      panel2.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      panel2.options |= SECTION.RESIZE_PARENT;
      panel2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      panel2.StylesSetMargin([10, 0]);
      temp_panel2_idx = panel.AddItem(panel2)
      



      /******************************************************************************/
      // Create the color present mesh
      // const color_present_mesh = Create_rect_mesh(_, [20, 20, 2], [80, 60], [YELLOW[9], YELLOW[9],YELLOW[9], YELLOW[9]], 'Color Present', style, [0, 0], 1, is_debug_mesh);
      const color_present_mesh = Create_rect_mesh(_, [20, 20, 2], [80*scale, 60*scale], YELLOW[9], 'Color Present', style, [0, 0], 1, is_debug_mesh);
      color_present_mesh.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      color_present_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      color_present_mesh.StylesSetMargin([0, 0]);

      this.color_pick_click_pos = [color_pick.geom.dim[0]*2, 0];
      temp_color_present_idx = panel2.AddItem(color_present_mesh);


      const fontsize = 10*scale*1.2;
      const label_pad = [10*scale*scale, 6*scale*scale];
      const label_style = [0, 10*scale, 1.2];

      /******************************************************************************/
      // Create Label Info meshes
      {
         {
            const label = Create_widget_label(_, 'R', _, [0, 0, 3], fontsize, REDL[5], WHITE, label_pad, _, label_style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            label.StylesSetMargin(label_pad);
            panel2.AddItem(label);

            this.label_r = Create_widget_label(_, 'RRRRR', _, [0, 0, 3], fontsize, GREY[2], WHITE, label_pad, _, label_style);
            this.label_r.temp_align |= SECTION.HORIZONTAL;
            this.label_r.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            this.label_r.StylesSetMargin([label_pad[0], 0]);
            panel2.AddItem(this.label_r);
         }
         {
            const label = Create_widget_label(_, 'G', _, [0, 0, 3], fontsize, GREEN[4], WHITE, label_pad, _, label_style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            label.StylesSetMargin(label_pad);
            panel2.AddItem(label);

            this.label_g = Create_widget_label(_, 'GGGGG', _, [0, 0, 3], fontsize, GREY[2], WHITE, label_pad, _, label_style);
            this.label_g.temp_align |= SECTION.HORIZONTAL;
            this.label_g.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            this.label_g.StylesSetMargin([label_pad[0], 0]);
            panel2.AddItem(this.label_g);
         }
         {
            const label = Create_widget_label(_, 'B', _, [0, 0, 3], fontsize, BLUEL[6], WHITE, label_pad, _, label_style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            label.StylesSetMargin(label_pad);
            panel2.AddItem(label);

            this.label_b = Create_widget_label(_, 'BBBBB', _, [0, 0, 3], fontsize, GREY[2], WHITE, label_pad, _, label_style);
            this.label_b.temp_align |= SECTION.HORIZONTAL;
            this.label_b.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            this.label_b.StylesSetMargin([label_pad[0], 0]);
            panel2.AddItem(this.label_b);
         }
         {
            const label = Create_widget_label(_, 'A', _, [0, 0, 3], fontsize, GREY[6], WHITE, label_pad, _, label_style);
            label.temp_align |= SECTION.VERTICAL;
            label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            label.StylesSetMargin(label_pad);
            panel2.AddItem(label);

            this.label_a = Create_widget_label(_, 'AAAAA', _, [0, 0, 3], fontsize, GREY[2], WHITE, label_pad, _, label_style);
            this.label_a.temp_align |= SECTION.HORIZONTAL;
            this.label_a.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
            this.label_a.StylesSetMargin([label_pad[0], 0]);
            panel2.AddItem(this.label_a);
         }


      }


      /******************************************************************************/
      // Create the tranparency slider

      const TRANSPARENCY_BAR_COLOR = [
         GREY[3], 
         RED[9],
         GREY[3], 
         YELLOW[9],
      ];

      const slider_tran = Create_widget_slider_simple(_, [0, 0, 13], [12*scale, 150*scale], TRANSPARENCY_BAR_COLOR, [0, 0], [16*scale, 3*scale], WHITE, 1);
      slider_tran.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      slider_tran.children.buffer[0].sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X; // Set the handle
      slider_tran.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      slider_tran.SetStyle([0, 12*scale, 2]);
      slider_tran.StylesSetMargin([10, 0]);
      slider_tran.SetName('Slider Transparency');

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

      const slider = Create_widget_slider_simple(_, [0, 0, 2], [dim[0]*scale, 20*scale], HUE_COLOR, [0, 0], [4*scale, 24*scale], WHITE, vertices_count);
      
      slider.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;
      slider.children.buffer[0].sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X; // Set the handle
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      slider.StylesSetMargin([0, 20]);
      slider.SetStyle([style[0], 20*scale, style[2]]);
      slider.SetName('Slider Hue');
      temp_hue_pick_idx = this.AddItem(slider);



      console.log(
         '\ntemp_panel2_idx' , temp_panel2_idx,
         '\ntemp_hue_pick_idx' , temp_hue_pick_idx,
         '\ntemp_color_pick_idx' , temp_color_pick_idx,
         '\ntemp_color_present_idx' , temp_color_present_idx,
         '\ntemp_tran_slider_idx' , temp_tran_slider_idx,

      );



   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // INHERITED METHODS
   /****************************************************************************************************************************************************/

   Destroy(){
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
         const child = this.children.buffer[i];
         // if (child) child.EnableGfxUniforms(flags, name, type, shader_flags);
         if (child) child.GfxUniformsEnable(flags, name, type, shader_flags);
         // if(this.children.buffer[i].GfxUniformsEnable === null)
         // if (this.children.buffer[i]) this.children.buffer[i].GfxUniformsEnable(flags, name, type, shader_flags);
      }
   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      
      if(unif_name === 'u_wposxy'){

         // Call for each root mesh in every vertex buffer
         const root_meshes = Root_group_per_vb_meshidx_view_get_all_roots(this.root_bufferidx, unif_name, Clbk, clbk_params);
         const len = root_meshes.length;
         for(let i=1; i < len; i++){
      
            const root_mesh = Mesh_buffer_get_mesh_byidx(root_meshes[i]);
            root_mesh.SetClbkGfxUniforms(unif_name, Clbk, root_mesh.root_posidx);
      
         }
      }

   }


   GfxCtxSetFlag(FLAGS) {
      alert('-1 COLORPICKER')
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

      if (this.state.mask & MESH_STATE.ACTIVE) {
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


   ColorpickerCreateListeners(){

      const mesh = this; // If in recursion, use as the current mesh the passed param. 
      // mesh.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      mesh.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      
      const parent_listeners = mesh.listeners.buffer;
      
      const panel = mesh.children.buffer[0];
      const panel2 = panel.children.buffer[temp_panel2_idx];
      const color_pick_mesh = panel.children.buffer[temp_color_pick_idx];
      const hue_mesh = mesh.children.buffer[temp_hue_pick_idx];
      const transp_slider_mesh = panel.children.buffer[temp_tran_slider_idx];
      const color_present_mesh = panel2.children.buffer[temp_color_present_idx];
      
      { // Color Pick Panel
         color_pick_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
         const evt_params = { // Create the parameters to pass for the switch's click event. 
            EventClbk: null,
            targetBindingFunctions: null,
            target_mesh: mesh,
            params: null,
         };
         color_pick_mesh.AddListenEvent(E.C, mesh.OnClickColorPick, evt_params, parent_listeners[E.C]);
      }
      
      { // Hue Slider

         // For the hue slider, we create a click event from the Widget Slider class, so that on slider huue click we run the sliders click event.
         hue_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
         const evt_params = { // Create the parameters to pass for the switch's click event. 
            EventClbk: null,
            targetBindingFunctions: null,
            target_mesh: hue_mesh,
            params: null,
         };
         hue_mesh.AddListenEvent(E.C, hue_mesh.OnClick, evt_params, parent_listeners[E.C]);

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
            slider_mesh: hue_mesh,
            slider_transp_mesh: transp_slider_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
         }
         hue_mesh.SetInitialValue(17);
         Slider_simple_connect(hue_mesh, mesh.OnClickHuePick, clbk_params);
         
      }
      
      { // Tranparency Slider

         // Create the click event on the slider class
         transp_slider_mesh.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
         const evt_params = { // Create the parameters to pass for the switch's click event. 
            EventClbk: null,
            targetBindingFunctions: null,
            target_mesh: transp_slider_mesh,
            params: null,
         };
         transp_slider_mesh.AddListenEvent(E.C, transp_slider_mesh.OnClick, evt_params, parent_listeners[E.C]);

         // Create the callback that the slider will call to run the local method for transparency slider
         const clbk_params_transparency_slider = {
            src_mesh: mesh,
            slider_tran: transp_slider_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
            target_mesh: null,
         }
         transp_slider_mesh.SetInitialValue(100);
         Slider_simple_connect(transp_slider_mesh, mesh.OnClickTranpsarencyPick, clbk_params_transparency_slider)

      }
   }


   OnClick(params) {

      const widget = params.evt_params.target_mesh;

      console.log('COLOR picker widget', widget.name);

      // TODO: Implement Resize functionality

      STATE.mesh.SetClicked(widget);

      if (widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = Time_intervals_create(10, 'Move Widget_Color_Picker', TIME_INTERVAL_REPEAT_ALWAYS, On_move_clbk, widget);
         widget.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (widget.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(widget);
            STATE.mesh.SetFocused(widget);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            widget.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
            Root_group_set_in_focus(widget.root_bufferidx);
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

      const widget = params.clbk_params.src_mesh;
      const slider = params.clbk_params.slider_mesh;
      const slider_tran = params.clbk_params.slider_transp_mesh;
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
      
      // Calculate the index of the part, the handle is currently located 
      // Calculate handle pos percentage to be 1 whole unit for every part. E.x: For part1:0-1, part2:1-2, part3:2-3, ...
      slider_val += 0.000001; // Must be > 0 in order to choose the first part and not the -1 part which does not exist
      if (slider_val >= 1) slider_val = .999999; // CAUTION: If the value is greater or equal to 1, then we will advance to the next part of 2 left and rigth vertices which does no exist
      const part_ratio = slider_val * parts


      let c_idx = Math.ceil(part_ratio);

      c_idx -= 1; // Deal with parts from 0 to n-1
      // Calulate the indices of the colors, that the left and right vertices (from the handles position) represent
      const color_indices = [(c_idx * 2), (c_idx * 2) + 2];

      
      // Cache the vertex colors of the current part of the hue bar
      const c1 = slider.mat.col[color_indices[0]];
      const c2 = slider.mat.col[color_indices[1]];
      // Get the fraction of the percentage so that it always is 0-1 for any part
      const fract = part_ratio - Floor(part_ratio);
      const c = Mix_vec4_float32Array(c1, c2, fract);
      
      // console.log((x/w)*parts, (slider_val*parts))
      
      const num_faces = color_pick_mesh.geom.num_faces; // Face Index:The first one
      const vidx = 3; // Vertex Index: Top-Right
      // CAUTION: Make sure the vertex count is not surpassing the mesh and starts updating the color of the next mesh in the vertex buffer 
      const vertex_count = 1; // How many vertices of the mesh to update 
      
      // Store the calculated color to the color pick mesh 
      for (let i = 0; i < vertex_count; i++)
         CopyArr4(color_pick_mesh.mat.col[i + vidx], c);
         // color_pick_mesh.mat.col[i + vidx] = c;
      
         // Update the vertex buffer
      if(color_pick_mesh.gfx) 
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
      const hue = Mix_vec3_float32Array(WHITE, c, percentagex);
      const intensity = Mix_vec3_float32Array(BLACK, hue, percentagey);
      
      const alpha = slider_tran.slider_val; // Get the alpha from the transparency slider
      // Contruct the final color
      const final_color = new Float32Array([intensity[0], intensity[1], intensity[2], alpha]);
      CopyArr4(color_present_mesh.mat.col, final_color);
      if(color_present_mesh.gfx) Gl_set_rgba(color_present_mesh.gfx, final_color, color_present_mesh.geom.num_faces);



      





      /*****************************************************************************************************/
      // Assign the color to the top vertices of the transparency slider

      CopyArr4(slider_tran.mat.col[1], c);
      CopyArr4(slider_tran.mat.col[3], c);
      if(slider_tran.gfx) Gl_set_rgba_per_vertex(slider_tran.gfx, slider_tran.mat.col)





      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(intensity[0])
      widget.label_g.text_mesh.RenderTextFromNumber(intensity[1])
      widget.label_b.text_mesh.RenderTextFromNumber(intensity[2])
      widget.label_a.text_mesh.RenderTextFromNumber(final_color[3])




      /*****************************************************************************************************/
      // Update target meshes

      if(widget.temp_target_mesh_clbk){
         widget.temp_target_mesh_clbk(new Float32Array([
            intensity[0],
            intensity[1],
            intensity[2],
            final_color[3],
         ]));
      }

   }


   OnClickTranpsarencyPick(params, slider_val) {

      const widget = params.clbk_params.src_mesh;
      const slider_tran = params.clbk_params.slider_tran;
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
      if(color_present_mesh.gfx) Gl_set_rgba_specify_attribute(color_present_mesh.gfx, slider_val, num_faces, vertex_idx, vcount, alphaidx);


      


      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[0])
      widget.label_g.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[1])
      widget.label_b.text_mesh.RenderTextFromNumber(color_present_mesh.mat.col[2])
      widget.label_a.text_mesh.RenderTextFromNumber(slider_val)
      



      /*****************************************************************************************************/
      // Update target meshes

      if(widget.temp_target_mesh_clbk){
         widget.temp_target_mesh_clbk(new Float32Array([
            color_present_mesh.mat.col[0],
            color_present_mesh.mat.col[1],
            color_present_mesh.mat.col[2],
            slider_val,
         ]));
      }
      
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
      const hue = Mix_vec4_float32Array(WHITE, color, percentagex);
      const intensity = Mix_vec4_float32Array(BLACK, hue, percentagey);




      /*****************************************************************************************************/
      // Assign the color to the top vertices of the transparency slider

      const transp_slider = panel.children.buffer[temp_tran_slider_idx];
      CopyArr3(transp_slider.mat.col[1], intensity);
      CopyArr3(transp_slider.mat.col[3], intensity);
      if(transp_slider.gfx) Gl_set_rgba_per_vertex(transp_slider.gfx, transp_slider.mat.col)
      intensity[3] = transp_slider.slider_val;






      /*****************************************************************************************************/
      // Set the new color picked in the color present panel of the widget

      const color_present_mesh = panel2.children.buffer[temp_color_present_idx];
      // CopyArr4(color_present_mesh.mat.col[3], intensity); 
      CopyArr4(color_present_mesh.mat.col, intensity); 
      Gl_set_rgba(color_present_mesh.gfx, intensity, color_present_mesh.geom.num_faces);


      


      /*****************************************************************************************************/
      // Update the labels

      widget.label_r.text_mesh.RenderTextFromNumber(intensity[0])
      widget.label_g.text_mesh.RenderTextFromNumber(intensity[1])
      widget.label_b.text_mesh.RenderTextFromNumber(intensity[2])
      widget.label_a.text_mesh.RenderTextFromNumber(intensity[3])

      



      /*****************************************************************************************************/
      // Update target meshes

      if(widget.temp_target_mesh_clbk){
         widget.temp_target_mesh_clbk(intensity);
      }
   }

   
   AssignTargetMeshClbk(Clbk){
      this.temp_target_mesh_clbk = Clbk;
   }


   SetTransparencySliderSetInitialValue(slider_val){

      const mesh = this;
      const panel = mesh.children.buffer[0];
      const panel2 = panel.children.buffer[temp_panel2_idx];
      const color_pick_mesh = panel.children.buffer[temp_color_pick_idx];
      const transp_slider_mesh = panel.children.buffer[temp_tran_slider_idx];
      const color_present_mesh = panel2.children.buffer[temp_color_present_idx];


      const params = {
         clbk_params:{

            src_mesh: mesh,
            slider_tran: transp_slider_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
            target_mesh: null,
         },

      };


      const interpolated_slider_val = transp_slider_mesh.SetInitialValue(slider_val);
      this.OnClickTranpsarencyPick(params, interpolated_slider_val)

      
   }


   SetHueSliderSetInitialValue(slider_val){

      const mesh = this;
      const panel = mesh.children.buffer[0];
      const panel2 = panel.children.buffer[temp_panel2_idx];
      const color_pick_mesh = panel.children.buffer[temp_color_pick_idx];
      const transp_slider_mesh = panel.children.buffer[temp_tran_slider_idx];
      const color_present_mesh = panel2.children.buffer[temp_color_present_idx];
      const hue_mesh = mesh.children.buffer[temp_hue_pick_idx];


      const params = {
         clbk_params:{

            src_mesh: mesh,
            slider_mesh: hue_mesh,
            slider_transp_mesh: transp_slider_mesh,
            color_pick_mesh: color_pick_mesh,
            color_present_mesh: color_present_mesh,
            target_mesh: null,
         },

      };


      const interpolated_slider_val = hue_mesh.SetInitialValue(slider_val);
      this.OnClickHuePick(params, interpolated_slider_val)

   }

   

}






function On_move_clbk(params) {

   const widget = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (widget.StateCheck(MESH_STATE.IN_GRAB) === 0 && widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = widget.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      Time_intervals_destroy_byidx(intervalIdx);
      widget.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_dif = MouseGetPosDif();
   if (mouse_dif.x === 0 && mouse_dif.y === 0) return;

   Mesh_unif_add_vb_root_wpos(widget.root_posidx, mouse_dif.x, -mouse_dif.y)

}

