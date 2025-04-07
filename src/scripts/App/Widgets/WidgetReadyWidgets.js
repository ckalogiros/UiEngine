"use strict";

import { Create_rect_mesh, Create_widget_label, Create_widget_slider, Create_widget_slider_simple, Create_widget_switch_button, Create_widget_switch_simple } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLUEL, GREY, WHITE, YELLOW } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Events/EventFunctions.js";
import { Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties, Style_slider_simple_default_properties, Style_switch_button_default_properties, Style_switch_default_properties } from "../../Engine/Drawables/Widgets/WidgetReadyStyles.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Gl_set_attr_round_corners, Gl_set_dim_xy } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Linear_interpolation, Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";
import { Max } from "../../Helpers/Math/MathOperations.js";
import { Widget_gfx_ready_enable } from "./WidgetGfxReady.js";






/** */
export function Widget_ready_slider_simple(is_root = 0x0, x = 0, y = 0, initial_val = .5, name, size = 120, col = GREY[5], handle_col = BLUEL[8]) {

   const pos = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? [200, 500, 0] : [0, 0, 0]
   const slider = Create_widget_slider_simple(Style_slider_simple_default_properties({
      is_root: is_root,
      pos: pos,
      dim: [size, 4],
      col: col,
      hover_margin: [6, 6],
      handle_col: handle_col,
   }));

   Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 4, });
   slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


   if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

      slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      slider.Render();
      Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
      slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(slider)
      Construct_listen_events_relations_from_mesh_tree(slider);
   }

   return slider;
}
/** */
export function Widget_ready_slider(is_root = 0x0, x = 0, y = 0, initial_val = .5, name, size = 120, col = GREY[5], handle_col = BLUEL[8]) {

   const pos = [x, y, 0];
   const slider = Create_widget_slider(Style_slider_default_properties({
      is_root: is_root,
      pos: pos,
      dim: [size, 15],
      col: col,
      hover_margin: [6, 6],
      handle_col: handle_col,
      name: name,
      texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
      font_size: 8,
   }));

   // Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 8, });
   Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect:8, });
   slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   slider.SetInitialValue(initial_val);

   if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

      slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      slider.Render();
      Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
      slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(slider)
      Construct_listen_events_relations_from_mesh_tree(slider);
   }

   return slider

}
/** */
export function Widget_ready_switch(is_root=0x0, x=0, y=0, size=20, col=GREY[4], handle_col=GREY[7], hover_margin=[6,6], on_click_clbk=null) {

   const pos = [x, y, 0];
   const switch1 = Create_widget_switch_simple(Style_switch_default_properties({ 
      is_root: is_root, 
      pos: pos, 
      col: col, 
      size:size,
      handle_col:handle_col,
      hover_margin:hover_margin,
   }));

   Widget_gfx_ready_enable({ mesh: switch1, enable_sdf_rect: switch1.geom.dim[1]});
   switch1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   switch1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   if(on_click_clbk) switch1.Bind(on_click_clbk);
   else switch1.Bind(function () { console.log('--------------------------- CALLBACK FROM USER ---------------------------')});

   if(is_root & ROOT_WIDGETS.CREATE_ROOT) {

      switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      switch1.Render();
   
      Root_group_activate_all_vbs_in_renderqueue(switch1.root_bufferidx);
   
      Construct_listen_events_from_mesh_tree(switch1)
      Construct_listen_events_relations_from_mesh_tree(switch1);
      switch1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, switch1.gfx.vb.groupidx)
   }

   return switch1;
}
/** */
export function Widget_ready_switch_button(is_root=0x0, x=0, y=0, col=GREY[3], font_size=8, text_pad=[12, 6], on_click_clbk=null) {

   const pos = [x, y, 0];
   const switch1 = Create_widget_switch_button(Style_switch_button_default_properties({ 
      is_root: is_root, 
      text_on: 'switch on', 
      text_off: 'switch off', 
      pos: pos, 
      font_size: font_size, 
      col: col, 
      text_col: WHITE, 
      text_pad: text_pad, 
   }));

   Widget_gfx_ready_enable({ mesh: switch1, enable_sdf_rect: 6});
   switch1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   switch1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   if(on_click_clbk) switch1.Bind(on_click_clbk);
   else switch1.Bind(function () { console.log('--------------------------- CALLBACK FROM USER ---------------------------')});

   if(is_root & ROOT_WIDGETS.CREATE_ROOT) {

      switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      switch1.Render();
   
      Root_group_activate_all_vbs_in_renderqueue(switch1.root_bufferidx);
   
      Construct_listen_events_from_mesh_tree(switch1)
      Construct_listen_events_relations_from_mesh_tree(switch1);
      switch1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, switch1.gfx.vb.groupidx)
   }

   return switch1;
}
/** */
export function Widget_ready_label(is_root = 0x0, name = 'Label', texture_id=TEXTURES.MTSDF_CONSOLAS_1024, x = 0, y = 0, font_size = 10, color = GREY[3], text_pad = [10, 6], color_text = WHITE, event_hover=true, event_move=false) {

   const pos = [x, y, 0];


   const label = Create_widget_label(Style_label_default_properties({
      is_root: is_root,

      pos: pos,
      col: color,
      text_pad: text_pad,
      text: name,
      texture_id: texture_id,
      font_size: font_size,
      text_col: color_text,
      is_debug_mesh: false,
   }));


   Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 4, });
   if(event_move) label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   if(event_hover) label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   // label.StateEnable(MESH_STATE_FLAGS.IS_HOVER_COLORABLE | MESH_STATE_FLAGS.IS_RESIZEABLE);
   // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
   // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);

   /********************************************************************************************************************************************************/
   // Render
   if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

      label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      label.Render()

      label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)

      if (is_root & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(label.root_bufferidx);
      Construct_listen_events_from_mesh_tree(label);
      Construct_listen_events_relations_from_mesh_tree(label);
   }

   { // abilities
      // Shader_bit_flags_print_enabled_attributes(label.sid.attr, `ATTR:  ${label.GetName()}`)
      // Shader_bit_flags_print_enabled_attributes(label.sid.pass, `PASS:  ${label.GetName()}`)
      // Shader_bit_flags_print_enabled_attributes(label.text_mesh.sid.attr, `ATTR:  ${label.text_mesh.GetName()}`)
      // Shader_bit_flags_print_enabled_attributes(label.text_mesh.sid.pass, `PASS:  ${label.text_mesh.GetName()}`)

      // label.text_mesh.SetColorRGB(REDL);
      // label.text_mesh.RenderTextFromString('REDL');
      // if(temp_flag) label.text_mesh.RenderTextFromString('AA AS');

      // label.Align(TEXT_ALIGN.BOTTOM | TEXT_ALIGN.LEFT, [0, 0]);
      // label.Align(TEXT_ALIGN.BOTTOM | TEXT_ALIGN.RIGHT, [0, 0]);
      // label.Align(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.RIGHT, [0, 0]);
      // label.Align(TEXT_ALIGN.TOP | TEXT_ALIGN.LEFT, [10, 10]);
      // label.Align(TEXT_ALIGN.TOP | TEXT_ALIGN.RIGHT, [0, 0]);
      // label.Align(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0]);
   }


   return label;
}
/** */
export function Widget_ready_rect(render=false, is_root = 0x0, x = 0, y = 0, dim=[20,20], col = BLUEL[5], pad=[10,10]) {

   const pos = [x, y, 0];
   const rect = Create_rect_mesh(Style_rect_default_properties({
      is_root: is_root,
      pos: pos,
      dim: dim,
      col: col,
      pad:pad,
   }));


   Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 4, });
   rect.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   rect.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


   /********************************************************************************************************************************************************/
   // Render
   if (render) {

      rect.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      rect.Render()

      rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)

      if (is_root & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);
      Construct_listen_events_from_mesh_tree(rect);
      Construct_listen_events_relations_from_mesh_tree(rect);
   }

   return rect;
}


















/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
// Synthesized Widget Structures
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/







/*****************************************************************************************************************************************************/
// MSDF Text Label
/** */
export function Widget_msdf_text_with_scale_slider(is_root = 0x0, name = 'Label ', font, x = 0, y = 0, font_size = 20, color = BLUEL[5], slider_size, vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL, temp_flag = false) {

   let posx = 0, posy = 0;

   if (is_root & ROOT_WIDGETS.CREATE_ROOT) {
      posx = x;
      posy = y;
   }

   const slider = Widget_ready_slider(is_root, x, y, .06, 'ScaleText', slider_size);

   posy += slider.geom.dim[1] * 2 + 30;

   const text_pad = [0, 0];
   // const msdf_text = Create_widget_label(is_root, name, _, pos, font_size, TRANSPARENCY(color, .3), WHITE, [text_pad, text_pad], .5, _, font,);
   const msdf_text = Create_widget_label(Style_label_default_properties({
      is_root: is_root,
      pos: [posx, posy, 2],
      col: TRANSPARENCY(color, .6),
      text_pad: text_pad,
      text: name,
      texture_id: font,
      font_size: font_size,
      text_col: WHITE,
      is_debug_mesh: false,
   }));
   Widget_gfx_ready_enable({mesh:msdf_text, enable_sdf_rect:4});
   // msdf_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // msdf_text.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
   // msdf_text.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) msdf_text.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   msdf_text.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   // msdf_text.StateEnable(MESH_STATE_FLAGS.IS_HOVER_COLORABLE | MESH_STATE_FLAGS.IS_RESIZEABLE);
   // msdf_text.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
   // msdf_text.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);

   console.error(msdf_text.text_mesh.text_width)

   if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

      if (vb_groupidx !== INT_NULL) msdf_text.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
      else msdf_text.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      msdf_text.Render()

      msdf_text.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, msdf_text.gfx.vb.groupidx)

      if (is_root & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(msdf_text.root_bufferidx);
      Construct_listen_events_from_mesh_tree(msdf_text);
      Construct_listen_events_relations_from_mesh_tree(msdf_text);

      { // abilities
         // Shader_bit_flags_print_enabled_attributes(msdf_text.sid.attr, `ATTR:  ${msdf_text.GetName()}`)
         // Shader_bit_flags_print_enabled_attributes(msdf_text.sid.pass, `PASS:  ${msdf_text.GetName()}`)
         // Shader_bit_flags_print_enabled_attributes(msdf_text.text_mesh.sid.attr, `ATTR:  ${msdf_text.text_mesh.GetName()}`)
         // Shader_bit_flags_print_enabled_attributes(msdf_text.text_mesh.sid.pass, `PASS:  ${msdf_text.text_mesh.GetName()}`)

         // msdf_text.text_mesh.SetColorRGB(REDL);
         // msdf_text.text_mesh.RenderTextFromString('REDL');
         // if(temp_flag) msdf_text.text_mesh.RenderTextFromString('AA AS');

         // msdf_text.Align(TEXT_ALIGN.BOTTOM | TEXT_ALIGN.LEFT, [0, 0]);
         // msdf_text.Align(TEXT_ALIGN.BOTTOM | TEXT_ALIGN.RIGHT, [0, 0]);
         // msdf_text.Align(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.RIGHT, [0, 0]);
         // msdf_text.Align(TEXT_ALIGN.TOP | TEXT_ALIGN.LEFT, [10, 10]);
         // msdf_text.Align(TEXT_ALIGN.TOP | TEXT_ALIGN.RIGHT, [0, 0]);
         // msdf_text.Align(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0]);
      }
   }



   if (slider) { // Scale Text

      const slope_const = .5, time_step = .01, scale = 1;
      const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

      const params = {
         target_mesh: msdf_text,
         function_slope: slope_params_pointer,
         mnemonics: {
            sizex: msdf_text.geom.dim[0],
            sizey: msdf_text.geom.dim[1],
            rcorners: msdf_text.mat.style.rcorners,
         },
      };

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {

         if (!slider.gfx) return;

         const target_mesh = params.clbk_params.target_mesh;
         const rcorners = params.clbk_params.mnemonics.rcorners;

         // const max = 18, min = .01;
         // const val = Linear_interpolation(min, max, slider_val);
         // const val = Logarithmic_interpolation(1-slider_val, max);
         // const max = 2, min = .01;
         // const val = 1-Quadratic_interpolation(min, max, slider_val);

         const slope_constant = params.clbk_params.function_slope.GetSlope();
         const scale = params.clbk_params.function_slope.GetAmmount();
         params.clbk_params.function_slope.IncrementTimer();
         const timer = params.clbk_params.function_slope.GetTimer();
         // const slope = Logarithmic_interpolation(timer, slope_constant);
         const val = (.1 / Logarithmic_interpolation(1 - slider_val, slope_constant));
         const max = val !== Infinity ? val >= 0 ? val : .01 : 23

         // console.log(slope)
         // console.log(max)

         {
            const sizex = params.clbk_params.mnemonics.sizex * max;
            const sizey = params.clbk_params.mnemonics.sizey * max;
            const difx = sizex - target_mesh.geom.dim[0];
            const dify = sizey - target_mesh.geom.dim[1];

            target_mesh.geom.dim[0] = sizex;
            target_mesh.geom.dim[1] = sizey;
            target_mesh.geom.SetDimXY(target_mesh.gfx, sizex, sizey);
            Gl_set_dim_xy(target_mesh.gfx, sizex, sizey);

            target_mesh.geom.AddWposXY(target_mesh.gfx, difx, dify);

            if (target_mesh.sid.attr & SID.ATTR.R_CORNERS) {
               target_mesh.mat.style.rcorners = rcorners * Max(max, 2);
               Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners);
            }
         }

         {
            const text = target_mesh.text_mesh;
            text.ScaleText(max)
         }


      }, params,
      );
   }

   return {
      slider: slider,
      msdf_text: msdf_text,
   };
}