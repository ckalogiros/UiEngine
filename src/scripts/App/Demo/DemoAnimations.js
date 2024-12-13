"use strict";

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { Create_rect_mesh, Create_widget_label, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLACK, BLUEL, COLOR_GRADIENT_HORIZONTAL, COLOR_GRADIENT_VERTICAL, Get_fasma_color, GREEN, GREENL, GREY, ORANGEL, PURPLEB, PURPLER, RED, REDL, WHITE, YELLOW, YELLOWL, YELLOWR } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Font_metrics_get_char_width, Font_metrics_get_row_height } from "../../Engine/Loaders/Font/Font.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { Gl_set_angle, Gl_set_dim_xy, Gl_set_attr_round_corners } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Linear_interpolation, Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";
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
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[2], GREY[6]));
      panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      panel.SetName('Animations-Scale');

      ypos = 0;
      ypos += pad2;


      const text = 'Scale Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5]);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[5]));
      panel.AddItem(label);

      xpos += pad2;
      ypos += label.geom.dim[1] * 2 + pad2;

      const panel_scale = Create_widget_section(_, _, [10, 10], [pad2, ypos, 0], _, GREY[3]);
      panel_scale.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel_scale.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel_scale.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel_scale.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[3], GREY[2]));
      panel.AddItem(panel_scale);

      xpos += pad2;

      let s_height = 0;
      let inner_panel_width = 0;

      for (let i = 0; i < num_meshes; i++) {

         const xxx = (size * 2 + scale * 2 + pad * 2) * i;

         const l = Create_widget_label(_, `${slope.toFixed(2)}`, _, [xpos + xxx, ypos + pad2, 1], _, COLOR_GRADIENT_VERTICAL(GREEN[9], GREEN[3]), _, [2, 3]);
         l.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, );
         l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_scale.gfx_ctx_parent, true);
         panel_scale.AddItem(l);

         let color = Get_fasma_color(i, color_width, num_colors);
         const anim_mesh = Clbk_animations_scale(0x0, _, xpos + xxx + size, ypos + pad2 + size + l.geom.dim[1] * 2 + 4, size, 0.01, slope, scale, color).target_mesh;
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
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[2], GREY[6]));
      // panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);
      panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      panel.SetName('Animations-Rotation');
      panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;


      ypos = 0;
      ypos += pad2;


      const text = 'Rotation Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5]);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[5]));
      panel.AddItem(label);

      // xpos += pad2;
      ypos += label.geom.dim[1] * 2 + pad2;

      const panel_rot = Create_widget_section(_, _, [10, 10], [xpos, ypos, 0], _, GREY[3]);
      panel_rot.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel_rot.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel_rot.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel_rot.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[3], GREY[2]));
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
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, );
         l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_rot.gfx_ctx_parent, true);
         panel_rot.AddItem(l);


         let color = Get_fasma_color(i, color_width, num_colors);
         const anim_mesh = Clbk_animations_rotate(0x0, _, xpos + xxx, pad2 + ypos + l.geom.dim[1] * 2, rot_mesh_size, _, slope, angle, color).target_mesh;
         anim_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);
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











export function Demo_animations_with_slider_slope(x = 0, y = 0) {

   let total_height = 0;

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 0], _, GREY[1]);
   panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[4], GREY[2]));
   panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
   panel.SetName('Demo_animations_with_slider_slope');

   const text = 'Use the slider to change the slope\nof the logarithmic function.';
   const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5]);
   label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[2], GREY[4]));
   panel.AddItem(label);

   total_height += label.geom.dim[1];




   /**********************************************************************************************************/
   // Scale
   const scale = 40, size = 40, num_items = 11, pad = 10;
   let ypos = 0;
   let offset = 0;

   let color = Get_fasma_color(offset, num_items, 2);
   const ret1 = Clbk_animations_scale(0x0, true, 0, 0, size, 0.01, 0.05, scale, color);
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
   const ret2 = Clbk_animations_rotate(0x0, true, 0, 0, anim_mesh_size, 0.01, 0.05, angle, color);
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











export function Demo_animations_text(x = 0, y = 0, create_controls=true) {

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [x, y, 0], _, GREY[1]);
   panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[4], GREY[2]));
   panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   panel.SetName('Demo_animations_with_slider_slope');

   const text = 'Use the "Options" menu to change properties.';
   const label = Create_widget_label(_, text, _, [0, 0, 1], _, GREENL[5]);
   label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[2], GREY[4]));
   panel.AddItem(label);




   /**********************************************************************************************************/
   // Scale
   const anim_ret = Clbk_animations_text_counter(0x0, create_controls, 0, 0 );
   panel.AddItem(anim_ret.target_mesh);
   if(create_controls) panel.AddItem(anim_ret.controls_section);
   
   

   /**********************************************************************************************************/
   // Render
   panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   panel.GenGfxCtx();
   
   
   panel.options = SECTION.RESIZE_PARENT|SECTION.VERTICAL;
   panel.Calc_no_gfx_update();
   
   // panel.geom.dim[0] = ret2.slider_mesh.geom.dim[0] + pad;
   // panel.geom.dim[1] = ypos;

   panel.Render();


   Root_group_activate_all_vbs_in_renderqueue(panel.root_bufferidx);
   Construct_listen_events_from_mesh_tree(panel);
   Construct_listen_events_relations_from_mesh_tree(panel);
   panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, panel.gfx.vb.groupidx);

   return {
      panel:panel,
      slope_params_pointer:anim_ret.slope_params_pointer,
      animation_properties:anim_ret.animation_properties,
   };
}































export function Clbk_animations_create_transition_slope(time_step = 0.01, slope_const = .2, speed = 20) {
   const slope_params_pointer = new Function_Slope(slope_const, time_step, speed);
   return slope_params_pointer;
}











/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************/
// Circle scale animation

export function Clbk_animations_scale(root_widget = 0x0, create_slider = false, x = 100, y = 100, size = 20, time_step = 0.01, slope_const = 0.4, scale = 100, color=GREY[2]) {

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
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
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
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, MULTI_COLOR);


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
   const scale = params.function_slope.GetValueChange();
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
   const scale = params.function_slope.GetValueChange();
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

export function Clbk_animations_rotate(root_widget = 0x0, create_slider = false, x = 0, y = 0, size = 20, time_step = 0.01, slope_const = 0.4, angle = 0, color=GREY[2]) {

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
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      slider.SetInitialValue(slope_const);

      total_height += slider.geom.dim[1] * 2;

   }






   /*************************************************************************************************/
   // Rotated mesh

   const mesh = Create_widget_section(root_widget, _, [0, 0], [x, y, 0], [size, size], color, 'mesh',);
   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2.5);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, MULTI_COLOR);
   mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);



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
   const angle = params.function_slope.GetValueChange();
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
   const angle = params.function_slope.GetValueChange();
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

export function Clbk_animations_text_counter(root_widget = 0x0, create_contols = false, x = 0, y = 0, clbk_anim_flag=CLBK_ANIMATIONS.TEXT_SQUEEZE_Y, size = 20, time_step = 0.01, slope = .2, speed = 20,) {

   let total_height = 0;
   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const slope_params_pointer = Clbk_animations_create_transition_slope(_, slope, speed);

   // We need a refference to an object so that we can chnge the 'animation type' of the interval via the contols menu
   const animation_properties = {
      counter1:0,
      counter2:1,
      anim_flag:clbk_anim_flag,
      digit1_mesh:null, 
      digit2_mesh:null, 
   };


   /*************************************************************************************************/
   // Create controls
   const controls_section = Create_widget_section(root_widget, SECTION.VERTICAL, [10, 10], [0, 0, 3], [0, 0], BLACK, 'Controls Section', [0, 10, 2],);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   if (create_contols) { // Create slider controls only if this is to be rendered from this function

      const controls_buffer = Clbk_animations_text_create_contols(slope_params_pointer, animation_properties, YELLOWL[3]);
      
      const len = controls_buffer.length;
      for(let i=0; i<len; i++){
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }
   
   controls_section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;




   /****************************************************************************************************************/
   // Render 
   if (create_contols && (root_widget & ROOT_WIDGETS.CREATE_ROOT)) { // Create slider controls only if this is to be rendered from this function

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
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
   const section = Create_widget_section(root_widget, _, [20,20], [0,0,0], _, GREY[2]);
   {
      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[1], GREY[4]));
      section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT;
   }
   
   
   // Create animated meshes
   const text_pad_x=10, text_pad_y=6;
   const mesh2 = Create_widget_label(_, '-', _, [0, 0, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
   {
       mesh2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
       mesh2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
       mesh2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
       mesh2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(PURPLER[2], PURPLER[7]));
       section.AddItem(mesh2)
   }
   const mesh1 = Create_widget_label(_, '.', _, [0, 0, 0], _, BLUEL[9], WHITE, [text_pad_x, text_pad_y], _, _, TEXTURES.CONSOLAS_32px);
   {
       mesh1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
       mesh1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
       mesh1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
       mesh1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(PURPLEB[2], PURPLEB[9]));
       section.AddItem(mesh1)
   }





   /*************************************************************************************************************/
   // Render animated meshes
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {
      
      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
      
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
       (params)=>{

         const anim_flag = params.params.anim_flag;

         if (params.params.counter1 > 9) {
            
            const digit2_mesh = params.params.digit2_mesh;

            let limit_ = 0;
            const text_substitution_ = `${params.params.counter2++}`
            if(anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X|CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit_ = Font_metrics_get_char_width(digit2_mesh.text_mesh.mat.fontidx, text_substitution_) / 2;
            else if(anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y|CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit_ = Font_metrics_get_row_height(digit2_mesh.text_mesh.mat.fontidx) / 2;
            
            const anim_idx = Clbk_animations_text_create(digit2_mesh, slope_params_pointer, limit_, 'TEST_text_animation_2', anim_flag, text_substitution_);
            params.params.counter1 = 0;
         }

                     
         const digit1_mesh = params.params.digit1_mesh;
         if (params.params.counter2 > 9) { params.params.counter2 = 0; }

         const text_substitution = `${params.params.counter1++}`

         let limit = 0;
         if(anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X|CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Font_metrics_get_char_width(digit1_mesh.text_mesh.mat.fontidx, text_substitution) / 2;
         else if(anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y|CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit = Font_metrics_get_row_height(digit1_mesh.text_mesh.mat.fontidx) / 2;
         
         const anim_idx = Clbk_animations_text_create(digit1_mesh, slope_params_pointer, limit, 'TEST_text_animation_1', anim_flag, text_substitution);
      }, 

      animation_properties,
   );

   
   return {
      target_mesh: section,
      controls_section:controls_section,
      slope_params_pointer:slope_params_pointer,
      animation_properties:animation_properties,
      total_height: total_height,
   };

}




/************************************************************************/
// Text Animation Controls
export function Clbk_animations_text_create_contols(slope_params_pointer, animation_properties) {

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
      const slider_feather = 2;
      const slider_rcorners = 10;
      
      const slider = Create_widget_slider(_, [0, 0, zpos+1], slider_dim, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), _, 'Animation Slope');
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
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
      const slider_feather = 2;
      const slider_rcorners = 10;
      
      const slider = Create_widget_slider(_, [0, 0, zpos+1], slider_dim, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), _, 'Animation Speed');
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), );
      slider.SetInitialValue(slope_params_pointer.GetSlope());
   
      contols_buffer.push(slider);
   
      // animation_properties:animation_properties
      const slider_params = {
         slope_params_pointer:slope_params_pointer,
         min:slope_params_pointer.GetValueChange()/2, 
         max:slope_params_pointer.GetValueChange()*3,
      }
      Slider_connect(slider, (params, slider_val) => {
         const min = params.clbk_params.min, max = params.clbk_params.max;
         const val = Linear_interpolation(min, max, slider_val);
         params.clbk_params.slope_params_pointer.SetValueChange(val);
      }, slider_params);
   }


   /*****************************************************************************************/
   // Switch for changing the animation type
   { // Translate switch animations switch

      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10,10], [0, 0, zpos + 1], [0, 0], COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), 'anim_type_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      contols_buffer.push(panel);
   
      // Create label
      const label = Create_widget_label(_, 'Type: Translate X:Y', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, COLOR_GRADIENT_HORIZONTAL(GREEN[5], GREEN[2]), WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[5], GREEN[2]));
      panel.AddItem(label);
      
      const type_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), _);
      type_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2, 2);
      type_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, type_switch.geom.dim[1]);
      type_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), COLOR_GRADIENT_VERTICAL(GREY[5], GREY[9]));
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
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10,10], [0, 0, zpos + 1], [0, 0], COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), 'anim_type_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
      contols_buffer.push(panel);
   
      // Create label
      const label = Create_widget_label(_, 'Type: Squeeze X:Y', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]), WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]));
      panel.AddItem(label);
      
      const type_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), _);
      type_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2, 2);
      type_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, type_switch.geom.dim[1]);
      type_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), COLOR_GRADIENT_VERTICAL(GREY[5], GREY[9]));
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











export function Clbk_animations_text_create(target_mesh, slope_params_pointer, limit, name, animation_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, text_substitution = '0') {

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


   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   const limit = params.limit;
   // Substitution text
   const text_substitution = params.text_substitution;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Squeeze text down to a limit
   const a = move_x_left_vertices_right(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);

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
   const speed = params.function_slope.GetValueChange();
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
   const speed = params.function_slope.GetValueChange();
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
   const speed = params.function_slope.GetValueChange();
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
   const speed = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   // Substitution text
   const text_substitution = params.text_substitution;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text down to a limit
   const center = mesh.geom.pos[0]+mesh.geom.dim[0];
   const limit = center+(mesh.geom.dim[0])-text.geom.dim[0]*2;
   const a = move_x(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);
      // TODO: The dimention of the text changes according to the rendered character, and not the INITIAL character
      pos_x_set(text, mesh.geom.pos[0]+text.geom.dim[0]);

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
   const speed = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text down to a limit
   const center = mesh.geom.pos[0]+mesh.geom.dim[0];
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
   const speed = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   // Substitution text
   const text_substitution = params.text_substitution;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   
   // Translate text down to a limit
   const center = mesh.geom.pos[1] + mesh.geom.dim[1];
   const limit = center + (mesh.geom.dim[1])-text.geom.dim[1];
   const a = move_y(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);
      pos_y_set(text, center - (mesh.geom.dim[1])+text.geom.dim[1]);

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
   const speed = params.function_slope.GetValueChange();
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

