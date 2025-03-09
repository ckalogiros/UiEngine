"use strict";

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { CALLBACK_ANIMATION_TYPE_FLAGS, CALLBACK_ANIMATION_TYPE_IDX, Callback_animations_create_specific } from "../../Engine/Animations/CallbackAnimationsReadyAnimations.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_label, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLACK, BLUEL, COLOR_GRADIENT_HORIZONTAL, COLOR_GRADIENT_VERTICAL, Get_fasma_color, GREEN, GREENL, GREY, ORANGEL, PURPLEB, PURPLER, RED, REDL, WHITE, YELLOW, YELLOWL, YELLOWR } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_set_root_in_focus } from "../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Uv_metrics_get_char_width, Uv_metrics_get_row_height } from "../../Engine/Loaders/Textures/TextureUvMap.js";
// import { Uv_metrics_get_char_width, Uv_metrics_get_char_width } from "../../Engine/Loaders/Font/Font.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { Gl_set_angle, Gl_set_dim_xy, Gl_set_attr_round_corners } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { GetSequencedColor } from "../../Helpers/Helpers.js";
import { Function_Slope, Linear_interpolation, Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";
import { Style_widget_default } from "../Widgets/WidgetStyles.js";
import { move_x, move_x_right_vertices_right, move_x_left_vertices_right, move_y, move_y_bottom_vertices_up, move_y_upper_vertices_down, pos_x_set, pos_x_set_default, pos_y_set, pos_y_set_default, text_animation_gfx_vertex_set_sqeeze_x_axis, vertex_y_set, vertex_y_set_default, text_animation_gfx_vertex_set_vpos_x_by_value } from "./DemoTextAnimations.js";






const MULTI_COLOR = [BLUEL[9], RED[9], GREEN[9], YELLOW[9],];










/**************************************************************************************************************************************************************/
// Create Demo Animations

export function Demo_animations(x = 10, y = 60, num_meshes = 5, scale = 20, size = 20, pad = 6, time_step = 0.01) {

   const num_colors = 2; // The number of colors to interpolate in between
   const color_width = 8; // Regulates the coloring. The more items the less color difference between meshes.  

   const feather = 2, rcorners = 10;
   let total_height = 0;


   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const pad2 = 10;

   // Scale Animations
   {

      let ypos = y, xpos = x;
      let slope = 0.05;

      const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [xpos, ypos, 0], _, GREY[1]);
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[2], GREY[6]));
      panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      panel.SetName('Animations-Scale');

      ypos = 0;
      ypos += pad2;


      const text = 'Scale Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5]);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[5]));
      panel.AddItem(label);

      xpos += pad2;
      ypos += label.geom.dim[1] * 2 + pad2;

      const panel_scale = Create_widget_section(_, _, [10, 10], [pad2, ypos, 0], _, GREY[3]);
      panel_scale.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel_scale.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel_scale.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel_scale.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel_scale.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[3], GREY[2]));
      panel.AddItem(panel_scale);

      xpos += pad2;

      let s_height = 0;
      let inner_panel_width = 0;

      for (let i = 0; i < num_meshes; i++) {

         const xxx = (size * 2 + scale * 2 + pad * 2) * i;

         const l = Create_widget_label(_, `${slope.toFixed(2)}`, _, [xpos + xxx, ypos + pad2, 1], _, COLOR_GRADIENT_VERTICAL(GREEN[9], GREEN[3]), _, [2, 3]);
         l.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // l.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
         l.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
         l.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         l.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX,);
         l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_scale.gfx_ctx_parent, true);
         panel_scale.AddItem(l);

         let color = Get_fasma_color(i, color_width, num_colors);
         const anim_mesh = Demo_clbk_animations_scale(0x0, _, xpos + xxx + size, ypos + pad2 + size + l.geom.dim[1] * 2 + 4, size, 0.01, slope, scale, color).target_mesh;
         anim_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_scale.gfx_ctx_parent, true);
         panel_scale.AddItem(anim_mesh);

         const anim_mesh_width = (size + scale + pad);
         inner_panel_width += anim_mesh_width;
         s_height = l.geom.dim[1] + size + scale + pad;

         // Increment slope factor for each mesh. // NOTE: Min-Max values are [0,1], so calculate slope accordingly to the number of meshes
         slope *= 2;
      }

      panel_scale.geom.dim[0] = inner_panel_width + pad;
      panel_scale.geom.dim[1] = s_height + pad;
      panel.geom.dim[0] = ((panel_scale.geom.dim[0] > label.geom.dim[0]) ? panel_scale.geom.dim[0] : label.geom.dim[0]) + 10;
      panel.geom.dim[1] = label.geom.dim[1] + panel_scale.geom.dim[1] + 20;

      // Render
      panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      panel.GenGfxCtx();
      panel.Render();


      Root_group_activate_all_vbs_in_renderqueue(panel.root_bufferidx);
      Construct_listen_events_from_mesh_tree(panel);
      Construct_listen_events_relations_from_mesh_tree(panel);
      panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, panel.gfx.vb.groupidx);


      total_height += panel.geom.dim[1] * 2;
   }

   // Rotation Animations
   {
      let ypos = y, xpos = x;
      let slope = 0.05;
      const angle = Math.PI / 2

      const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [xpos, ypos], [0, ypos + total_height + 10, 0], _, GREY[1]);
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[2], GREY[6]));
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);
      panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      panel.SetName('Animations-Rotation');
      panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;


      ypos = 0;
      ypos += pad2;


      const text = 'Rotation Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5]);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[5]));
      panel.AddItem(label);

      // xpos += pad2;
      ypos += label.geom.dim[1] * 2 + pad2;

      const panel_rot = Create_widget_section(_, _, [10, 10], [xpos, ypos, 0], _, GREY[3]);
      panel_rot.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel_rot.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel_rot.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel_rot.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel_rot.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[3], GREY[2]));
      panel.AddItem(panel_rot);


      xpos += 10;

      let s_height = 0;
      let inner_panel_width = 0;

      const rot_mesh_size = size * 2.;
      scale = 0

      for (let i = 0; i < num_meshes; i++) {

         const xxx = (rot_mesh_size * 2 + pad * 2) * i;

         const l = Create_widget_label(_, `${slope.toFixed(2)}`, _, [xpos + xxx, ypos + pad, 1], _, COLOR_GRADIENT_VERTICAL(GREEN[9], GREEN[3]), _, [2, 3]);
         l.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         // l.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
         l.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
         l.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         l.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX,);
         l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_rot.gfx_ctx_parent, true);
         panel_rot.AddItem(l);


         let color = Get_fasma_color(i, color_width, num_colors);
         const anim_mesh = Demo_clbk_animations_rotate(0x0, _, xpos + xxx, pad2 + ypos + l.geom.dim[1] * 2, rot_mesh_size, _, slope, angle, color).target_mesh;
         anim_mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);
         anim_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_rot.gfx_ctx_parent, true);
         panel_rot.AddItem(anim_mesh);

         const anim_mesh_width = rot_mesh_size + pad;
         inner_panel_width += anim_mesh_width;
         s_height = l.geom.dim[1] + rot_mesh_size + pad;

         // Increment slope factor for each mesh. // NOTE: Min-Max values are [0,1], so calculate slope accordingly to the number of meshes
         slope *= 2;
         // slope = (1/(num_meshes-1)) * (i+1); 
      }


      panel_rot.geom.dim[0] = inner_panel_width + pad;
      panel_rot.geom.dim[1] = s_height + pad;
      panel.geom.dim[0] = ((panel_rot.geom.dim[0] > label.geom.dim[0]) ? panel_rot.geom.dim[0] : label.geom.dim[0]) + 10;
      panel.geom.dim[1] = label.geom.dim[1] + panel_rot.geom.dim[1] + 20;

      // Render
      panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      panel.GenGfxCtx();
      panel.Render();


      Root_group_activate_all_vbs_in_renderqueue(panel.root_bufferidx);
      Construct_listen_events_from_mesh_tree(panel);
      Construct_listen_events_relations_from_mesh_tree(panel);
      panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, panel.gfx.vb.groupidx);

      total_height += panel.geom.dim[1] * 2;
   }

   return total_height;

}
/** */
export function Demo_animations_with_slider_slope(x = 0, y = 0) {

   let total_height = 0;

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 0], _, GREY[1]);
   panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[4], GREY[2]));
   panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   panel.SetName('Demo_animations_with_slider_slope');

   const text = 'Use the slider to change the slope\nof the logarithmic function.';
   const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5]);
   label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[2], GREY[4]));
   panel.AddItem(label);

   total_height += label.geom.dim[1];




   /**********************************************************************************************************/
   // Scale
   const scale = 40, size = 40, num_items = 11, pad = 10;
   let ypos = 0;
   let offset = 0;

   let color = Get_fasma_color(offset, num_items, 2);
   const ret1 = Demo_clbk_animations_scale(0x0, true, 0, 0, size, 0.01, 0.05, scale, color);
   ret1.slider_mesh.MoveNoGfxUpdate(pad, label.geom.dim[1] * 2 + pad);
   ypos += label.geom.dim[1] * 2 + ret1.slider_mesh.geom.dim[1] * 2 + pad;
   ret1.target_mesh.geom.pos[0] += size + pad;
   ret1.target_mesh.geom.pos[1] = ypos + size + pad;
   panel.AddItem(ret1.slider_mesh);
   panel.AddItem(ret1.target_mesh);


   ypos += size * 2 + pad * 3;



   /**********************************************************************************************************/
   // Rotation
   const anim_mesh_size = size * 2;
   const angle = Math.PI;
   color = Get_fasma_color(offset, num_items, 2);
   const ret2 = Demo_clbk_animations_rotate(0x0, true, 0, 0, anim_mesh_size, 0.01, 0.05, angle, color);
   ret2.target_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, ret2.target_mesh.gfx_ctx_parent, true);
   ret2.slider_mesh.MoveNoGfxUpdate(pad, ypos + label.geom.dim[1] * 2 + pad);

   ypos += label.geom.dim[1] * 2 + pad
   ret2.target_mesh.geom.pos[0] += pad;
   ret2.target_mesh.geom.pos[1] = ypos + size + pad + 20;
   panel.AddItem(ret2.slider_mesh);
   panel.AddItem(ret2.target_mesh);




   /**********************************************************************************************************/
   // Render
   panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   panel.GenGfxCtx();


   panel.geom.dim[0] = ret2.slider_mesh.geom.dim[0] + pad;
   panel.geom.dim[1] = ypos;

   panel.Render();


   Root_group_activate_all_vbs_in_renderqueue(panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(panel);
   Construct_listen_events_relations_from_mesh_tree(panel);
   panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, panel.gfx.vb.groupidx);

   return panel;
}
/** */
export function Demo_animations_text(x = 0, y = 0, create_controls = true) {

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 0], _, GREY[1]);
   panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[4], GREY[2]));
   panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   panel.SetName('Demo_animations_with_slider_slope');

   const text = 'Use the "Options" menu to change properties.';
   const label = Create_widget_label(_, text, _, [0, 0, 1], _, GREENL[5]);
   label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[2], GREY[4]));
   panel.AddItem(label);




   /**********************************************************************************************************/
   // Scale
   const anim_ret = Demo_clbk_animations_text_counter(0x0, create_controls, 0, 0);
   panel.AddItem(anim_ret.target_mesh);
   if (create_controls) panel.AddItem(anim_ret.controls_section);



   /**********************************************************************************************************/
   // Render
   panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   panel.GenGfxCtx();


   panel.options = SECTION.RESIZE_PARENT | SECTION.VERTICAL;
   panel.Calc_no_gfx_update();

   // panel.geom.dim[0] = ret2.slider_mesh.geom.dim[0] + pad;
   // panel.geom.dim[1] = ypos;

   panel.Render();


   Root_group_activate_all_vbs_in_renderqueue(panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(panel);
   Construct_listen_events_relations_from_mesh_tree(panel);
   panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, panel.gfx.vb.groupidx);

   return {
      panel: panel,
      slope_params_pointer: anim_ret.slope_params_pointer,
      animation_properties: anim_ret.animation_properties,
   };
}
/** */
export function Demo_animations_ready_button_with_panel(root_widget=0x0,  x = 0, y = 0) {

   // Create panel to hold button panels
   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 0], _, GREY[1]);
   panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[4], GREY[2]));
   // panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   panel.SetName('Demo_animations_ready_button_with_panel');




   /***************************************************************************************************/
   // Create 3 different animations of buttons with panel
   // const anim2 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY, 'Move X-Y');
   
   // const anim0 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.RCORNERS, 'RCORNERS Animation');
   // panel.AddItem(anim0);
   
   const anim1 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.SCALE, 'Scale Animation');
   panel.AddItem(anim1);
   
   const anim2 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_X, 'Move X');
   panel.AddItem(anim2);
   
   const anim3 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY, 'Move XY');
   panel.AddItem(anim3);

   const anim4 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY|CALLBACK_ANIMATION_TYPE_FLAGS.SCALE, 'Move X-Y & Scale');
   panel.AddItem(anim4);


   


   /**********************************************************************************************************/
   // Render
   if(root_widget) {

      panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      panel.GenGfxCtx();
   
   
      // panel.options = SECTION.RESIZE_PARENT | SECTION.HORIZONTAL;
      panel.options = SECTION.RESIZE_PARENT | SECTION.VERTICAL;
      panel.Calc_no_gfx_update();
   
      // panel.geom.dim[0] = ret2.slider_mesh.geom.dim[0] + pad;
      // panel.geom.dim[1] = ypos;
   
      panel.Render();
   
   
      Root_group_activate_all_vbs_in_renderqueue(panel.root_bufferidx);
      Construct_listen_events_from_mesh_tree(panel);
      Construct_listen_events_relations_from_mesh_tree(panel);
      panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, panel.gfx.vb.groupidx);
   }

   return panel;
}






























export function Demo_clbk_animations_create_transition_slope(time_step = 0.01, slope_const = .2, speed = 20) {
   const slope_params_pointer = new Function_Slope(slope_const, time_step, speed);
   return slope_params_pointer;
}











/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
// Button animations
/** Pass flag of type: CALLBACK_ANIMATION_TYPE_FLAGS */
export function Demo_animations_ready_button_anim(root_widget=0x0,  x = 0, y = 0, anim_type_flag=0x0, create_label='') {
   if(!anim_type_flag) alert('No animation type flag is set. Please pass the animation type flag (of type: CALLBACK_ANIMATION_TYPE_FLAGS) to create animations.');


   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;

   // const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [VIEWPORT.WIDTH / 2 - dim[0], VIEWPORT.HEIGHT / 2 - dim[1], 0], dim, TRANSPARENCY(GREY[1], .9), 'section',);
   const menu_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 0], dim, TRANSPARENCY(GREY[1], .9), 'section',);
   menu_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, menu_panel.geom.dim[0] / 10);
   menu_panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) menu_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   menu_panel.SetName('MenuLoadPanel');

   menu_panel.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.HORIZONTAL_CENTER;
   // menu_panel.options = SECTION.RESIZE_PARENT | SECTION.VERTICAL | SECTION.EXPAND | SECTION.INHERIT | SECTION.HORIZONTAL_CENTER;
   zpos++;


   if(create_label!=='') {
      const label = Create_widget_label(_, create_label, _, [0, 0, 1], _, GREENL[5]);
      label.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 7);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[2], GREY[4]));
      menu_panel.AddItem(label);
   }
   /*************************************************************************************************/
   // Menu Items
   const menu_items = Create_menu_items_buttons();
   const len = menu_items.length;
   for (let i = 0; i < len; i++) { menu_panel.AddItem(menu_items[i]); }


   /*************************************************************************************************/
   // Render Menu 
   if(root_widget) {

      // menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx);
      menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx);
      menu_panel.GenGfxCtx();
      //  menu_panel.Calc_no_gfx_update(SECTION.EXPAND);
      menu_panel.Calc_no_gfx_update(SECTION.RESIZE_PARENT | SECTION.VERTICAL | SECTION.EXPAND);
      menu_panel.Render();
   
      Root_group_activate_all_vbs_in_renderqueue(menu_panel.root_bufferidx);
      Construct_listen_events_from_mesh_tree(menu_panel);
      Construct_listen_events_relations_from_mesh_tree(menu_panel);
   
      menu_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu_panel.gfx.vb.groupidx);
   
      // Set menu in focus
      Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);
   }


   // Create event callback for each menu item
   for (let i = 0; i <= menu_panel.children.boundary; i++) {

      const menu_button = menu_panel.children.buffer[i];
      if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_XY, { slope_constant: .3, time_step: 0.05, ammount: 40 });
      else if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_X) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 });
      if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.SCALE) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.SCALE, { slope_constant: 1., time_step: 0.1, ammount: 17 });
      if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.RCORNERS) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.RCORNERS, { slope_constant: 1., time_step: 0.1, ammount: .1 }, true);
   }


   return menu_panel;


}
/** */
function Create_menu_items_buttons() {

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items
   const feather = 2;
   const rcorners = 15;
   const font = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? TEXTURES.CONSOLAS_12px : TEXTURES.CONSOLAS_16px;
   const text_col = WHITE;
   let btn_col = TRANSPARENCY(GREY[1], 1.);

   /*******************************************************************************************/
   // Button 1
   btn_col = GetSequencedColor(7);
   const button1 = Create_widget_button(_, 'Mathematics      ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Style_widget_default(button1, rcorners);
   menu_items_array.push(button1);


   /*******************************************************************************************/
   // Button 2
   btn_col = GetSequencedColor(7);
   const button2 = Create_widget_button(_, 'Astronomy        ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Style_widget_default(button2, rcorners);
   menu_items_array.push(button2);

   /*******************************************************************************************/
   // Button 3
   btn_col = GetSequencedColor(7);
   const button3 = Create_widget_button(_, 'Molecular Biology', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   Style_widget_default(button3, rcorners);
   button3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   menu_items_array.push(button3);

   /*******************************************************************************************/
   // Button 4
   btn_col = GetSequencedColor(7);
   const button4 = Create_widget_button(_, 'Chemistry        ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   button4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   Style_widget_default(button4, rcorners);
   menu_items_array.push(button4);

   {
      /*******************************************************************************************/
      // Button 5
      btn_col = GetSequencedColor(7);
      const button5 = Create_widget_button(_, 'Neuroscience     ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
      Style_widget_default(button5, rcorners);
      button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      menu_items_array.push(button5);
   }
   {
      /*******************************************************************************************/
      // Button 5
      btn_col = GetSequencedColor(7);
      const button5 = Create_widget_button(_, 'Physics          ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
      Style_widget_default(button5, rcorners);
      button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      menu_items_array.push(button5);
   }
   {
      /*******************************************************************************************/
      // Button 5
      btn_col = GetSequencedColor(7);
      const button5 = Create_widget_button(_, 'Biochemistry     ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
      Style_widget_default(button5, rcorners);
      button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      menu_items_array.push(button5);
   }
   {
      /*******************************************************************************************/
      // Button 5
      btn_col = GetSequencedColor(7);
      const button5 = Create_widget_button(_, 'Genetics         ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
      Style_widget_default(button5, rcorners);
      button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      menu_items_array.push(button5);
   }
   // {
   //    /*******************************************************************************************/
   //    // Button 5
   //    btn_col = GetSequencedColor(7);
   //    const button5 = Create_widget_button(_, 'Neuroscience     ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   //    Style_widget_default(button5, rcorners);
   //    button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   //    menu_items_array.push(button5);
   // }
   // {
   //    /*******************************************************************************************/
   //    // Button 5
   //    btn_col = GetSequencedColor(7);
   //    const button5 = Create_widget_button(_, 'Neuroscience     ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   //    Style_widget_default(button5, rcorners);
   //    button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   //    menu_items_array.push(button5);
   // }
   // {
   //    /*******************************************************************************************/
   //    // Button 5
   //    btn_col = GetSequencedColor(7);
   //    const button5 = Create_widget_button(_, 'Neuroscience     ', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _, btn_col, text_col, [15, 8], .5, _, font);
   //    Style_widget_default(button5, rcorners);
   //    button5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   //    menu_items_array.push(button5);
   // }



   return menu_items_array;
}










/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
// Circle scale animation

export function Demo_clbk_animations_scale(root_widget = 0x0, create_slider = false, x = 100, y = 100, size = 20, time_step = 0.01, slope_const = 0.4, scale = 100, color = GREY[2]) {

   const feather = 2;
   const rcorners = size;
   let total_height = 0;
   let slider = null;


   /*************************************************************************************************/
   // 
   if (create_slider) {

      const slider_dim = (200 * 2 < VIEWPORT.WIDTH) ? [200, 10] : [VIEWPORT.WIDTH / 2 - 10, 10];
      slider = Create_widget_slider(_, [x, y, 0], slider_dim, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), _, 'Log Function Slope');
      slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      slider.SetInitialValue(slope_const);

      total_height += slider.geom.dim[1] * 2;

   }




   /*************************************************************************************************/

   if (create_slider) {
      y += slider.geom.dim[1] * 2 + 10;
      total_height += slider.geom.dim[1] * 2 + 10;
   }

   const mesh = Create_rect_mesh(root_widget, [x, y, 0], [size, size], color, 'mesh_anim_scale_rect',);
   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, MULTI_COLOR);


   total_height += mesh.geom.dim[1] * 2;

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      if (create_slider) {

         // slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
         // slider.Render();
         // Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
         // slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

         // Construct_listen_events_from_mesh_tree(slider)
         // Construct_listen_events_relations_from_mesh_tree(slider);
      }
      mesh.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      mesh.GenGfxCtx();
      mesh.Render();

      Root_group_activate_all_vbs_in_renderqueue(mesh.root_bufferidx);
      Construct_listen_events_from_mesh_tree(mesh);
      Construct_listen_events_relations_from_mesh_tree(mesh);
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);

   }



   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   if (create_slider) {

      // Connect slider to control the slope_constant1 value
      const slider_params = slope_params_pointer;
      Slider_connect(slider, (params, slider_val) => {
         const val = Linear_interpolation(.01, 1, slider_val);
         params.clbk_params.SetSlope(val);
      }, slider_params);
   }


   const params = {
      mesh: mesh,
      function_slope: slope_params_pointer,
   };

   Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, `Run:${params.function_slope.slope_constant}`);

   return {
      target_mesh: mesh,
      slider_mesh: slider,
      total_height: total_height,
   };

}

function Animation_scale_up_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const size = mesh.geom.dim[0] + (slope * scale);

   mesh.geom.SetDimXY(mesh.gfx, size, size);
   Gl_set_dim_xy(mesh.gfx, size, size);

   const diffx = mesh.geom.pos[0] + (slope * scale);
   const diffy = mesh.geom.pos[1] + (slope * scale);
   mesh.geom.SetWposXY(mesh.gfx, diffx, diffy);

   if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
      Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners * (slope + 1));
   }

   if (slope < 1.) return true;
   else return false

}

function Animation_scale_up_stop(params) {

   Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params, `Stop:${params.function_slope.slope_constant}`)
   params.function_slope.SetTimer(0);

   return false;
}

function Animation_scale_down_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const size = mesh.geom.dim[0] + ((1. - slope) * scale);
   mesh.geom.SetDimXY(mesh.gfx, size, size);
   Gl_set_dim_xy(mesh.gfx, size, size);

   const diffx = mesh.geom.pos[0] + ((1. - slope) * scale);
   const diffy = mesh.geom.pos[1] + ((1. - slope) * scale);
   mesh.geom.SetWposXY(mesh.gfx, diffx, diffy);

   if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
      Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners * ((1. - slope) + 1));
   }



   if (slope < 1.) return true;
   else return false
}

function Animation_scale_down_stop(params) {

   Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, `Stop:${params.function_slope.slope_constant}`);
   params.function_slope.SetTimer(0);

   return false;
}











/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
// Circle flip animation

let rotation = 0;

export function Demo_clbk_animations_rotate(root_widget = 0x0, create_slider = false, x = 0, y = 0, size = 20, time_step = 0.01, slope_const = 0.4, angle = 0, color = GREY[2]) {

   const feather = 2;
   const rcorners = 10;
   let total_height = 0;

   let slider = null;

   /*************************************************************************************************/
   // Constant value slope_constant slider
   if (create_slider) {

      const slider_dim = (200 * 2 < VIEWPORT.WIDTH) ? [200, 10] : [VIEWPORT.WIDTH / 2 - 10, 10];
      slider = Create_widget_slider(root_widget, [x, y, 0], slider_dim, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), _, 'Log Function Slope');
      slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      slider.SetInitialValue(slope_const);

      total_height += slider.geom.dim[1] * 2;

   }






   /*************************************************************************************************/
   // Rotated mesh

   const mesh = Create_widget_section(root_widget, _, [0, 0], [x, y, 0], [size, size], color, 'mesh',);
   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2.5);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, MULTI_COLOR);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);



   total_height += mesh.geom.dim[1] * 2;

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      if (create_slider) {

         slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
         slider.Render();
         Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
         slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

         Construct_listen_events_from_mesh_tree(slider)
         Construct_listen_events_relations_from_mesh_tree(slider);
      }

      mesh.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      mesh.GenGfxCtx();
      mesh.Render();


      Root_group_activate_all_vbs_in_renderqueue(mesh.root_bufferidx);
      Construct_listen_events_from_mesh_tree(mesh);
      Construct_listen_events_relations_from_mesh_tree(mesh);
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);
   }


   const slope_params_pointer = new Function_Slope(slope_const, time_step, angle);

   if (create_slider) {

      const slider_params = slope_params_pointer;
      Slider_connect(slider, (params, slider_val) => {
         const val = Linear_interpolation(.01, 1, slider_val);
         params.clbk_params.SetSlope(val);
      }, slider_params);
   }


   const params = {
      mesh: mesh,
      function_slope: slope_params_pointer,
   };

   Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Run:${params.function_slope.slope_constant}`);



   return {
      target_mesh: mesh,
      slider_mesh: slider,
      total_height: total_height,
   };
}

function Animation_rotate_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);

   const rot = (slope * angle);

   mesh.RotateZ(rot);
   Gl_set_angle(mesh.gfx, rot);
   rotation = rot;

   if (slope < 1.) return true;
   else return false

}

function Animation_rotate_stop(params) {

   Callback_animations_create(Animation_rotate_back_run, Animation_rotate_back_stop, params, `Stop${params.function_slope.slope_constant}`);
   params.function_slope.SetTimer(0);

   return false;
}

function Animation_rotate_back_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);

   const rot = ((1. - slope) * angle);

   mesh.RotateZ(rot);
   Gl_set_angle(mesh.gfx, rot);
   rotation = rot;

   if (slope < 1.) return true;
   else return false
}

function Animation_rotate_back_stop(params) {

   Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Stop:${params.function_slope.slope_constant}`);
   params.function_slope.SetTimer(0);

   return false;
}











/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/

export function Demo_clbk_animations_text_counter(root_widget = 0x0, create_contols = false, x = 0, y = 0, clbk_anim_flag = CLBK_ANIMATIONS.TEXT_SQUEEZE_Y, size = 20, time_step = 0.01, slope = .2, speed = 20,) {

   let total_height = 0;
   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, slope, speed);

   // We need a refference to an object so that we can chnge the 'animation type' of the interval via the contols menu
   const animation_properties = {
      counter1: 0,
      counter2: 1,
      anim_flag: clbk_anim_flag,
      digit1_mesh: null,
      digit2_mesh: null,
   };


   /*************************************************************************************************/
   // Create controls
   const controls_section = Create_widget_section(root_widget, SECTION.VERTICAL, [10, 10], [0, 0, 3], [0, 0], BLACK, 'Controls Section', [0, 10, 2],);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2;
   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[1], GREY[3]));

   if (create_contols) { // Create slider controls only if this is to be rendered from this function

      const controls_buffer = Demo_clbk_animations_text_create_contols(slope_params_pointer, animation_properties, YELLOWL[3]);

      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }

   controls_section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;




   /****************************************************************************************************************/
   // Render 
   if (create_contols && (root_widget & ROOT_WIDGETS.CREATE_ROOT)) { // Create slider controls only if this is to be rendered from this function

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();

      // controls_section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT | SECTION.EXPAND;
      controls_section.Calc_no_gfx_update();

      controls_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);

      controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(controls_section);
      Construct_listen_events_relations_from_mesh_tree(controls_section);

   }





   /*************************************************************************************************************/
   // Create animated meshes

   // Create panel
   const section = Create_widget_section(root_widget, _, [20, 20], [0, 0, 0], _, GREY[2]);
   {
      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      section.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[1], GREY[4]));
      section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT;
   }


   // Create animated meshes
   const text_pad_x = 10, text_pad_y = 6;
   const mesh2 = Create_widget_label(_, '-', _, [0, 0, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
   {
      mesh2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      mesh2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      mesh2.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(PURPLER[2], PURPLER[7]));
      section.AddItem(mesh2)
   }
   const mesh1 = Create_widget_label(_, '.', _, [0, 0, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
   {
      mesh1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      mesh1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      mesh1.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(PURPLEB[2], PURPLEB[9]));
      section.AddItem(mesh1)
   }





   /*************************************************************************************************************/
   // Render animated meshes
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

      section.Calc_no_gfx_update();

      section.Render()
      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
      Construct_listen_events_from_mesh_tree(section);
      Construct_listen_events_relations_from_mesh_tree(section);
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      total_height += section.geom.dim[1] * 2;

   }




   /*************************************************************************************************************/
   // Create callback animation with interval timer

   animation_properties.digit1_mesh = mesh1;
   animation_properties.digit2_mesh = mesh2;

   Time_intervals_create(1000, 'TEST_text_animation', TIME_INTERVAL_REPEAT_ALWAYS,
      (params) => {

         const anim_flag = params.params.anim_flag;

         if (params.params.counter1 > 9) {

            const digit2_mesh = params.params.digit2_mesh;

            let limit_ = 0;
            const text_substitution_ = `${params.params.counter2++}`
            if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit_ = Uv_metrics_get_char_width(digit2_mesh.text_mesh.mat.fontidx, text_substitution_) / 2;
            else if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit_ = Uv_metrics_get_row_height(digit2_mesh.text_mesh.mat.fontidx) / 2;

            const anim_idx = Demo_clbk_animations_text_create(digit2_mesh, slope_params_pointer, limit_, 'TEST_text_animation_2', anim_flag, text_substitution_);
            params.params.counter1 = 0;
         }


         const digit1_mesh = params.params.digit1_mesh;
         if (params.params.counter2 > 9) { params.params.counter2 = 0; }

         const text_substitution = `${params.params.counter1++}`

         let limit = 0;
         if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Uv_metrics_get_char_width(digit1_mesh.text_mesh.mat.fontidx, text_substitution) / 2;
         else if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit = Uv_metrics_get_row_height(digit1_mesh.text_mesh.mat.fontidx) / 2;

         const anim_idx = Demo_clbk_animations_text_create(digit1_mesh, slope_params_pointer, limit, 'TEST_text_animation_1', anim_flag, text_substitution);
      },

      animation_properties,
   );


   return {
      target_mesh: section,
      controls_section: controls_section,
      slope_params_pointer: slope_params_pointer,
      animation_properties: animation_properties,
      total_height: total_height,
   };

}
/* Text Animation Controls */
export function Demo_clbk_animations_text_create_contols(slope_params_pointer, animation_properties) {

   const contols_buffer = [];


   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }
   let zpos = 0;

   /*****************************************************************************************/
   // Slider for controling the slope
   {
      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      const slider_rcorners = 10;

      const slider = Create_widget_slider(_, [0, 0, zpos + 1], slider_dim, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), _, 'Animation Slope');
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      slider.SetInitialValue(slope_params_pointer.GetSlope());

      contols_buffer.push(slider);

      // animation_properties:animation_properties
      const slider_params = slope_params_pointer;
      Slider_connect(slider, (params, slider_val) => {
         params.clbk_params.SetSlope(slider_val);
      }, slider_params);
   }

   /*****************************************************************************************/
   // Slider for controling the animation speed
   {
      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      const slider_rcorners = 10;

      const slider = Create_widget_slider(_, [0, 0, zpos + 1], slider_dim, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), _, 'Animation Speed');
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]),);
      slider.SetInitialValue(slope_params_pointer.GetSlope());

      contols_buffer.push(slider);

      // animation_properties:animation_properties
      const slider_params = {
         slope_params_pointer: slope_params_pointer,
         min: slope_params_pointer.GetAmmount() / 2,
         max: slope_params_pointer.GetAmmount() * 3,
      }
      Slider_connect(slider, (params, slider_val) => {
         const min = params.clbk_params.min, max = params.clbk_params.max;
         const val = Linear_interpolation(min, max, slider_val);
         params.clbk_params.slope_params_pointer.SetAmmount(val);
      }, slider_params);
   }


   /*****************************************************************************************/
   // Switch for changing the animation type
   { // Translate switch animations switch

      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), 'anim_type_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      contols_buffer.push(panel);

      // Create label
      const label = Create_widget_label(_, 'Type: Translate X:Y', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, COLOR_GRADIENT_HORIZONTAL(GREEN[5], GREEN[2]), WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[5], GREEN[2]));
      panel.AddItem(label);

      const type_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), _);
      // type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2, 2);
      type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, type_switch.geom.dim[1]);
      type_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), COLOR_GRADIENT_VERTICAL(GREY[5], GREY[9]));
      type_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      type_switch.SetName('anim_type_switch');
      panel.AddItem(type_switch);

      type_switch.Bind(
         (params) => {

            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;

            if (isOn) {
               animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_X
            }
            else {

               animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y
            }
         },
         null, _, _,
      );

   }
   { // Sqeeze switch animations switch
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), 'anim_type_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      contols_buffer.push(panel);

      // Create label
      const label = Create_widget_label(_, 'Type: Squeeze X:Y', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]), WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]));
      panel.AddItem(label);

      const type_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), _);
      // type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2, 2);
      type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, type_switch.geom.dim[1]);
      type_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), COLOR_GRADIENT_VERTICAL(GREY[5], GREY[9]));
      type_switch.color_active = COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]);
      type_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      type_switch.SetName('anim_type_switch');
      panel.AddItem(type_switch);

      type_switch.Bind(
         (params) => {

            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;

            if (isOn) {
               animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_SQUEEZE_X
            }
            else {

               animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_SQUEEZE_Y
            }
         },
         null, _, _,
      );

   }

   return contols_buffer;
}
/** */
export function Demo_clbk_animations_text_create(target_mesh, slope_params_pointer, limit, name, animation_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, text_substitution = '0') {

   const params = {
      mesh: target_mesh,
      limit: limit,
      text_mesh: target_mesh.text_mesh,
      text_substitution: text_substitution,
      function_slope: slope_params_pointer,
      name: name,
   };

   if (animation_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_X) return Callback_animations_create(Animation_text_run_translation_x, Animation_text_stop_translation_x, params, `Run:${params.name}`);
   else if (animation_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_Y) return Callback_animations_create(Animation_text_run_translation_y, Animation_text_stop_translation_y, params, `Run:${params.name}`);
   else if (animation_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_X) return Callback_animations_create(Animation_text_run_squeeze_x, Animation_text_stop_squeeze_x, params, `Run:${params.name}`);
   else if (animation_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_Y) return Callback_animations_create(Animation_text_run_squeeze_y, Animation_text_stop_squeeze_y, params, `Run:${params.name}`);
}







/************************************************************************/
// Squeeze text animation

// X AXIS
function Animation_text_run_squeeze_x(params) {


   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   const limit = params.limit;
   // Substitution text
   const text_substitution = params.text_substitution;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Squeeze text down to a limit
   const a = move_x_left_vertices_right(text, val, limit);

   // if limit width reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);
      text.SetWposX(text.geom.pos[0] + text.geom.dim[0]);

      text_animation_gfx_vertex_set_sqeeze_x_axis(text, -limit);

      return false;
   }

   return true

}

function Animation_text_stop_squeeze_x(params) {

   Callback_animations_create(Animation_text_back_run_squeeze_x, Animation_text_back_stop_squeeze_x, params, `Stop:${params.name}`)
   params.function_slope.SetTimer(0);

   return false;
}

function Animation_text_back_run_squeeze_x(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   const limit = params.limit;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Squeeze text down to a limit
   const a = move_x_right_vertices_right(text, val, limit);

   if (a === false) {

      // text_animation_gfx_vertex_set_vpos_x_default(text);
      text_animation_gfx_vertex_set_vpos_x_by_value(text, limit);

      return false;
   }
   return true

}

function Animation_text_back_stop_squeeze_x(params) {

   params.function_slope.SetTimer(0);
   return false;
}

// Y AXIS
function Animation_text_run_squeeze_y(params) {


   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   const limit = params.limit;
   // Substitution text
   const text_substitution = params.text_substitution;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Squeeze text down to a limit
   const a = move_y_upper_vertices_down(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);

      vertex_y_set(text, -limit);
      text.SetWposX(text.geom.pos[0] + text.geom.dim[0]);


      return false;
   }

   return true

}

function Animation_text_stop_squeeze_y(params) {

   Callback_animations_create(Animation_text_back_run_squeeze_y, Animation_text_back_stop_squeeze_y, params, `Stop:${params.name}`)
   params.function_slope.SetTimer(0);

   return false;
}

function Animation_text_back_run_squeeze_y(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   const limit = params.limit;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Squeeze text down to a limit
   const a = move_y_bottom_vertices_up(text, val, limit);

   if (a === false) {

      vertex_y_set_default(text);
      return false;
   }
   return true

}

function Animation_text_back_stop_squeeze_y(params) {

   params.function_slope.SetTimer(0);
   return false;
}






/************************************************************************/
// Translate text animation

// X AXIS
function Animation_text_run_translation_x(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   // Substitution text
   const text_substitution = params.text_substitution;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text down to a limit
   const center = mesh.geom.pos[0] + mesh.geom.dim[0];
   const limit = center + (mesh.geom.dim[0]) - text.geom.dim[0] * 2;
   const a = move_x(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);
      // TODO: The dimention of the text changes according to the rendered character, and not the INITIAL character
      pos_x_set(text, mesh.geom.pos[0] + text.geom.dim[0]);

      return false;
   }

   return true

}

function Animation_text_stop_translation_x(params) {

   Callback_animations_create(Animation_text_back_run_translation_x, Animation_text_back_stop_translation_x, params, `Stop:${params.name}`)
   params.function_slope.SetTimer(0);

   return false;
}

function Animation_text_back_run_translation_x(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text down to a limit
   const center = mesh.geom.pos[0] + mesh.geom.dim[0];
   const a = move_x(text, val, center);

   if (a === false) {

      // Translate to original position
      pos_x_set_default(text);

      return false;
   }
   return true;

}

function Animation_text_back_stop_translation_x(params) {

   params.function_slope.SetTimer(0);
   return false;
}

// Y AXIS
function Animation_text_run_translation_y(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   // Substitution text
   const text_substitution = params.text_substitution;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Translate text down to a limit
   const center = mesh.geom.pos[1] + mesh.geom.dim[1];
   const limit = center + (mesh.geom.dim[1]) - text.geom.dim[1];
   const a = move_y(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);
      pos_y_set(text, center - (mesh.geom.dim[1]) + text.geom.dim[1]);
      text.SetWposX(text.geom.pos[0] + text.geom.dim[0]);

      return false;
   }

   return true

}

function Animation_text_stop_translation_y(params) {

   Callback_animations_create(Animation_text_back_run_translation_y, Animation_text_back_stop_translation_y, params, `Stop:${params.name}`)
   params.function_slope.SetTimer(0);

   return false;
}

function Animation_text_back_run_translation_y(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Translate text down to center
   const center = mesh.geom.pos[1] + mesh.geom.dim[1];
   const a = move_y(text, val, center);

   if (a === false) {

      // Correct to text's original position
      pos_y_set_default(text);

      return false;
   }
   return true;

}

function Animation_text_back_stop_translation_y(params) {

   params.function_slope.SetTimer(0);
   return false;
}

