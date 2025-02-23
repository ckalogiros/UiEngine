"use strict";

import { Create_widget_label, Create_widget_slider } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLUEL, WHITE } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Gl_set_attr_round_corners, Gl_set_dim_xy } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Linear_interpolation } from "../../Helpers/Math/MathFunctions.js";






/*****************************************************************************************************************************************************/
// Widget-Slider
export function Widget_ready_slider(root_widget = 0x0, x = 0, y = 0, initial_val = .5, name, size = 250) {

   const pos = [x, y, 0];
   const slider = Create_widget_slider(root_widget, pos, [size, 10], _, _, name);
   // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   slider.SetInitialValue(initial_val);

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      slider.Render();
      Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
      slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

      Construct_listen_events_from_mesh_tree(slider)
      Construct_listen_events_relations_from_mesh_tree(slider);
   }

   return slider

}



export function Widget_ready_label(root_widget = ROOT_WIDGETS.CREATE_ROOT, name = 'Label', font, x = 0, y = 0, font_size = 20, color = BLUEL[5], vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL) {

   const pos = [x, y, 2];
   const label = Create_widget_label(root_widget, name, _, pos, font_size, TRANSPARENCY(color, 1.), WHITE, [0, 0], .5, _, font,);
   label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
   label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);
   // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
   // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);

   if (vb_groupidx !== INT_NULL) label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
   else label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   label.Render()

   label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(label.root_bufferidx);
   Construct_listen_events_from_mesh_tree(label);
   Construct_listen_events_relations_from_mesh_tree(label);

   { // abilities
      // Shader_bit_flags_print_enabled_attributes(label.sid.attr, `ATTR:  ${label.GetName()}`)
      // Shader_bit_flags_print_enabled_attributes(label.sid.pass, `PASS:  ${label.GetName()}`)
      // Shader_bit_flags_print_enabled_attributes(label.text_mesh.sid.attr, `ATTR:  ${label.text_mesh.GetName()}`)
      // Shader_bit_flags_print_enabled_attributes(label.text_mesh.sid.pass, `PASS:  ${label.text_mesh.GetName()}`)

      // label.text_mesh.SetColorRGB(REDL);
      // label.text_mesh.RenderTextFromString('REDL');
      // if(temp_flag) label.text_mesh.RenderTextFromString('AA AS');

      // label.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
      // label.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
      // label.Align(ALIGN.HOR_CENTER | ALIGN.RIGHT, [0, 0]);
      // label.Align(ALIGN.TOP | ALIGN.LEFT, [10, 10]);
      // label.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);
      // label.Align(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0]);
   }


   return label;
}


















/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
// Synthesized Widget Structures
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/







/*****************************************************************************************************************************************************/
// MSDF Text Label
export function Widget_msdf_text_with_scale_slider(root_widget = 0x0, name = 'Label ', font, x = 0, y = 0, font_size = 20, color = BLUEL[5], slider_size, vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL, temp_flag = false) {

   let posx = 0, posy = 0;

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {
      posx = x;
      posy = y;
   }

   const slider = Widget_ready_slider(root_widget, x, y, .06, 'ScaleText', slider_size);

   // if(root_widget&ROOT_WIDGETS.CREATE_ROOT) {
   //    posy += slider.geom.dim[1] * 2 + 30;
   // }
   posy += slider.geom.dim[1] * 2 + 30;

   const pos = [posx, posy, 2];
   const text_pad = 0;
   const msdf_text = Create_widget_label(root_widget, name, _, pos, font_size, TRANSPARENCY(color, .3), WHITE, [text_pad, text_pad], .5, _, font,);
   msdf_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // msdf_text.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   msdf_text.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
   msdf_text.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) msdf_text.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   msdf_text.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   // msdf_text.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);
   // msdf_text.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
   // msdf_text.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      if (vb_groupidx !== INT_NULL) msdf_text.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
      else msdf_text.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      msdf_text.Render()

      msdf_text.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, msdf_text.gfx.vb.groupidx)

      if (root_widget & ROOT_WIDGETS.CREATE_ROOT) Root_group_activate_all_vbs_in_renderqueue(msdf_text.root_bufferidx);
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

         // msdf_text.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
         // msdf_text.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
         // msdf_text.Align(ALIGN.HOR_CENTER | ALIGN.RIGHT, [0, 0]);
         // msdf_text.Align(ALIGN.TOP | ALIGN.LEFT, [10, 10]);
         // msdf_text.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);
         // msdf_text.Align(ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0]);
      }
   }



   if (slider) { // Scale Text

      const params = {
         target_mesh: msdf_text,
         mnemonics: {
            sizex: msdf_text.geom.dim[0],
            sizey: msdf_text.geom.dim[1],
            rcorners: msdf_text.mat.style.rcorners
         },
      };

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {

         if (!slider.gfx) return;

         const target_mesh = params.clbk_params.target_mesh;
         const rcorners = params.clbk_params.mnemonics.rcorners;

         const max = 18, min = .1;
         const val = Linear_interpolation(min, max, slider_val);

         {
            const sizex = params.clbk_params.mnemonics.sizex * val;
            const sizey = params.clbk_params.mnemonics.sizey * val;
            const difx = sizex - target_mesh.geom.dim[0];
            const dify = sizey - target_mesh.geom.dim[1];

            target_mesh.geom.dim[0] = sizex;
            target_mesh.geom.dim[1] = sizey;
            target_mesh.geom.SetDimXY(target_mesh.gfx, sizex, sizey);
            Gl_set_dim_xy(target_mesh.gfx, sizex, sizey);

            target_mesh.geom.AddWposXY(target_mesh.gfx, difx, dify);

            if (target_mesh.sid.attr & SID.ATTR.R_CORNERS) {
               target_mesh.mat.style.rcorners = rcorners * val;
               Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners);
            }
         }

         {
            const text = target_mesh.text_mesh;
            text.ScaleText(val)
         }


      }, params,
      );
   }

   return {
      slider: slider,
      msdf_text: msdf_text,
   };
}