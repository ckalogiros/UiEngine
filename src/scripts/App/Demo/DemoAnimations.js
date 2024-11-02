"use strict";

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { Create_rect_mesh, Create_widget_label, Create_widget_section, Create_widget_slider } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLACK, BLUEL, BLUER, COLOR_GRADIENT_HORIZONTAL, COLOR_GRADIENT_VERTICAL, Get_fasma_color, GREEN, GREENL, GREY, ORANGEL, PURPLEB, PURPLER, RED, REDL, WHITE, YELLOW, YELLOWL } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Gl_set_angle, Gl_set_dim_xy, Gl_set_round_corners } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Shader_attributes_print } from "../../Graphics/ShaderAttributes.js";
import { Slope_function_logarithmic } from "../../Helpers/Math/MathFunction.js";






const MULTI_COLOR = [BLUEL[9], RED[9], GREEN[9], YELLOW[9], ];










/**************************************************************************************************************************************************************/
// Create Demo Animations

export function Demo_animations(x=10, y=60, num_meshes=5, scale = 20, size = 20, pad = 6, time_step = 0.01) {

   const num_colors = 2; // The number of colors to interpolate in between
   const color_width = 8; // Regulates the coloring. The more items the less color difference between meshes.  
   
   const feather=2, rcorners=10;
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
      panel.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      panel.SetName('Animations-Scale');
      
      ypos = 0;
      ypos += pad2;
      
      
      const text = 'Scale Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5] );
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[5]));
      panel.AddItem(label);
      
      xpos += pad2;
      ypos += label.geom.dim[1]*2+pad2;
      
      const panel_scale = Create_widget_section(_, _, [10, 10], [pad2, ypos, 0], _, GREY[3]);
      panel_scale.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel_scale.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel_scale.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel_scale.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[3], GREY[2]));
      panel.AddItem(panel_scale);
      
      // xpos += pad2;

      let s_height = 0;
      let inner_panel_width = 0;
      
      for (let i = 0; i < num_meshes; i++) {
         
         const xxx = (size*2 + scale*2 + pad*2) * i;
         
         const l = Create_widget_label(_, `${slope}`, _, [xpos+xxx, ypos+pad2, 1], _, GREENL[4], _, [2, 3] );
         l.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREENL[4], GREENL[3]));
         l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_scale.gfx_ctx_parent, true);
         panel_scale.AddItem(l);
         
         let color = Get_fasma_color(i, color_width, num_colors); 
         const anim_mesh = Clbk_animations_scale(0x0, _, xpos+xxx+size, ypos+pad2+size+l.geom.dim[1]*2+4, size, 0.01, slope, scale, color).target_mesh;
         anim_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_scale.gfx_ctx_parent, true);
         panel_scale.AddItem(anim_mesh);

         const anim_mesh_width = (size + scale + pad) ;
         inner_panel_width += anim_mesh_width;
         s_height = l.geom.dim[1] + size + scale + pad;
         
         // Increment slope factor for each mesh. // NOTE: Min-Max values are [0,1], so calculate slope accordingly to the number of meshes
         slope *=2; 
         // slope = (1/(num_meshes-1)) * (i+1); 
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


      total_height += panel.geom.dim[1]*2;
   }
   
   // Rotation Animations
   {
      let ypos = y, xpos = x;
      let slope = 0.05;
      const angle = Math.PI/2
      
      const panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [xpos, ypos], [0,ypos+total_height+10,0], _, GREY[1]);
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[2], GREY[6]));
      // panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);
      panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      panel.SetName('Animations-Rotation');
      panel.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
      
            
      ypos = 0;
      ypos += pad2;
      
      
      const text = 'Rotation Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5] );
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[5]));
      panel.AddItem(label);
      
      // xpos += pad2;
      ypos += label.geom.dim[1]*2+pad2;
      
      const panel_rot = Create_widget_section(_, _, [10, 10], [xpos, ypos, 0], _, GREY[3]);
      panel_rot.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel_rot.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      panel_rot.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      panel_rot.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[3], GREY[2]));
      panel.AddItem(panel_rot);
      
            
      xpos += 10;

      let s_height = 0;
      let inner_panel_width = 0;

      const rot_mesh_size = size*2.;
      scale = 0
      
      for (let i = 0; i < num_meshes; i++) {
         
         const xxx = (rot_mesh_size*2 + pad*2) * i ;
         
         const l = Create_widget_label(_, `${slope.toFixed(2)}`, _, [xpos+xxx, ypos+pad, 1], _, GREENL[4], _, [2, 3] );
         l.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
         l.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREENL[4], GREENL[3]));
         l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_rot.gfx_ctx_parent, true);
         panel_rot.AddItem(l);
         
         
         let color = Get_fasma_color(i, color_width, num_colors);
         const anim_mesh = Clbk_animations_rotate(0x0, _, xpos+xxx, pad2+ypos+l.geom.dim[1]*2, rot_mesh_size, _, slope, angle, color).target_mesh;
         anim_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);
         anim_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, panel_rot.gfx_ctx_parent, true);
         panel_rot.AddItem(anim_mesh);

         const anim_mesh_width = rot_mesh_size + pad ;
         inner_panel_width += anim_mesh_width;
         s_height = l.geom.dim[1] + rot_mesh_size + pad;
         
         // Increment slope factor for each mesh. // NOTE: Min-Max values are [0,1], so calculate slope accordingly to the number of meshes
         slope *=2; 
         // slope = (1/(num_meshes-1)) * (i+1); 
      }
      

      panel_rot.geom.dim[0] = inner_panel_width+pad;
      panel_rot.geom.dim[1] = s_height+pad;
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

      total_height += panel.geom.dim[1]*2;
   }

   return total_height;

}











export function Demo_animations_with_slider_slope(x=0, y=0){

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
   panel.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT;
   panel.SetName('Demo_animations_with_slider_slope');

   const text = 'Use the slider to change the slope\nof the logarithmic function.';
   const label = Create_widget_label(_, text, _, [10, 10, 1], _, GREENL[5] );
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
   ret1.slider_mesh.MoveNoGfxUpdate(pad, label.geom.dim[1]*2+pad);
   ypos += label.geom.dim[1]*2+ret1.slider_mesh.geom.dim[1]*2 + pad;
   ret1.target_mesh.geom.pos[0] += size+pad;
   ret1.target_mesh.geom.pos[1] = ypos + size + pad;
   panel.AddItem(ret1.slider_mesh);
   panel.AddItem(ret1.target_mesh);
   

   ypos += size*2 + pad*3;



   /**********************************************************************************************************/
   // Rotation
   const anim_mesh_size = size*2; 
   const angle = Math.PI;
   color = Get_fasma_color(offset, num_items, 2); 
   const ret2 = Clbk_animations_rotate(0x0, true, 0, 0, anim_mesh_size, 0.01, 0.05, angle, color); 
   ret2.target_mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, ret2.target_mesh.gfx_ctx_parent, true);
   ret2.slider_mesh.MoveNoGfxUpdate(pad, ypos+label.geom.dim[1]*2+pad);

   ypos += label.geom.dim[1]*2+pad
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




























   // var t = 0.0;
   // const final_t =  1.; // The time for the animation. Greater values increments more the scale/rotation
   // const step = 0.01;
   // const size = 20;

   let ID = 0;
   function Get_ID() { return ID++; }



   class Function_Slope {
      constructor(slope_constant = 1.0, time_step = 0.1, scale = 100, name = ID) {

         this.slope_constant = slope_constant;
         this.time_step = time_step;
         this.timer = 0.0;
         this.scale = scale;

         if (name) this.name = name;
         else name = Get_ID();
      }

      GetSlope() {
         return this.slope_constant;
      }

      SetSlope(val) {
         this.slope_constant = val;
      }

      // GetTimeStep(){
      //    return this.time_step;
      // }

      GetTimer() {
         return this.timer;
      }

      SetTimer(val) {
         this.timer = val;
      }

      IncrementTimer() {
         this.timer += this.time_step;
      }

      GetScale() {
         return this.scale;
      }

      SetScale(val) {
         this.scale = val;
      }
   }





   /**************************************************************************************************************************************************************/
   // Circle scale animation

   // var slope_constant1 = .04;
   // const const_scale_step = 180.;

   export function Clbk_animations_scale(root_widget=0x0, create_slider=false, x = 100, y = 100, size = 20, time_step = 0.01, slope_const = 0.4, scale = 100, color) {

      const feather = 2;
      const rcorners = size;
      let total_height = 0;
      let slider = null;


      /*************************************************************************************************/
      // 
      if(create_slider) {

         const slider_dim = (200*2 < VIEWPORT.WIDTH) ? [200, 10] : [VIEWPORT.WIDTH/2-10, 10];
         slider = Create_widget_slider(_, [x, y, 0], slider_dim, _, _, 'Log Function Slope');
         slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
         slider.SetInitialValue(slope_const);
   
         total_height += slider.geom.dim[1] * 2;

      }
      
      
      
      
      /*************************************************************************************************/
      
      if(create_slider) {
         y += slider.geom.dim[1] * 2 +10;
         total_height += slider.geom.dim[1] * 2 +10;
      }

      const mesh = Create_rect_mesh(root_widget, [x, y, 0], [size, size], color, 'mesh_anim_scale_rect', );
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, MULTI_COLOR);

      
      total_height += mesh.geom.dim[1] * 2;

      if(root_widget&ROOT_WIDGETS.CREATE_ROOT) {

         if(create_slider) {
            
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

      if(create_slider) {

         // Connect slider to control the slope_constant1 value
         const slider_params = slope_params_pointer;
         Slider_connect(slider, (params, slider_val) => {
            params.clbk_params.SetSlope(slider_val);
         }, slider_params);
      }


      const params = {
         mesh: mesh,
         function_slope: slope_params_pointer,
      };

      Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, `Run:${params.function_slope.slope_constant}`);

      return {
         target_mesh:mesh,
         slider_mesh:slider,
         total_height:total_height,
      };

   }

   function Animation_scale_up_run(params) {

      const mesh = params.mesh;
      const slope_constant = params.function_slope.GetSlope();
      const scale = params.function_slope.GetScale();
      params.function_slope.IncrementTimer();
      const timer = params.function_slope.GetTimer();

      const slope = Slope_function_logarithmic(timer, slope_constant);
      const aaa = 1.;
      const size = mesh.geom.dim[0] + (slope * scale * aaa);

      mesh.geom.SetDimXY(mesh.gfx, size, size);
      Gl_set_dim_xy(mesh.gfx, size, size);

      const diffx = mesh.geom.pos[0] + (slope * scale)*aaa;
      const diffy = mesh.geom.pos[1] + (slope * scale)*aaa;
      mesh.geom.SetWposXY(mesh.gfx, diffx, diffy);

      if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
         Gl_set_round_corners(mesh.gfx, mesh.mat.style[0]*(slope+1));
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
      const scale = params.function_slope.GetScale();
      params.function_slope.IncrementTimer();
      const timer = params.function_slope.GetTimer();

      const slope = Slope_function_logarithmic(timer, slope_constant);
      const aaa = 1.;
      const size = mesh.geom.dim[0] + ((1. - slope) * scale * aaa);
      mesh.geom.SetDimXY(mesh.gfx, size, size);
      Gl_set_dim_xy(mesh.gfx, size, size);

      const diffx = mesh.geom.pos[0] + ((1. - slope) * scale)*aaa;
      const diffy = mesh.geom.pos[1] + ((1. - slope) * scale)*aaa;
      mesh.geom.SetWposXY(mesh.gfx, diffx, diffy);

      if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
         Gl_set_round_corners(mesh.gfx, mesh.mat.style[0]*((1.-slope)+1));
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
   // Circle flip animation

   let rotation = 0;

   export function Clbk_animations_rotate(root_widget=0x0, create_slider=false, x = 0, y = 0, size = 20, time_step = 0.01, slope_const = 0.4, angle = 0, color) {

      const feather = 2;
      const rcorners = 10;
      let total_height = 0;

      let slider = null;

      /*************************************************************************************************/
      // Constant value slope_constant slider
      if(create_slider) {

         const slider_dim = (200*2 < VIEWPORT.WIDTH) ? [200, 10] : [VIEWPORT.WIDTH/2-10, 10];
         // slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [x, y, 0], slider_dim, _, _, 'Log Function Slope');
         slider = Create_widget_slider(root_widget, [x, y, 0], slider_dim, _, _, 'Log Function Slope');
         slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
         slider.SetInitialValue(slope_const);
         // slider.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
   
         total_height += slider.geom.dim[1] * 2;
   

      }






      /*************************************************************************************************/
      // Rotated mesh

      const mesh = Create_widget_section(root_widget, _, [0,0], [x, y, 0], [size, size], color, 'mesh', );
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2.5);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, MULTI_COLOR);

      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);
      
      // mesh.GfxUniformsEnable({ unif: SID.UNIF.FS_GENERIC_FLOAT, pass: SID.PASS.WPOS3, }, 'u_generic_float', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

      
      total_height += mesh.geom.dim[1] * 2;

      if(root_widget&ROOT_WIDGETS.CREATE_ROOT){

         if(create_slider) {
            
            slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
            slider.Render();
            Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
            slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)
            // slider.GfxUniformSetAndUpdate('u_generic_float', Math.PI);
            
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
         // mesh.GfxUniformSetAndUpdate('u_generic_float', Math.PI);
      }


      const slope_params_pointer = new Function_Slope(slope_const, time_step, angle);

      if(create_slider) {

         const slider_params = slope_params_pointer;
         Slider_connect(slider, (params, slider_val) => {
            params.clbk_params.SetSlope(slider_val);
         }, slider_params);
      }


      const params = {
         mesh: mesh,
         function_slope: slope_params_pointer,
      };

      Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Run:${params.function_slope.slope_constant}`);


      
      return {
         target_mesh:mesh,
         slider_mesh:slider,
         total_height:total_height,
      };
   }

   function Animation_rotate_run(params) {

      const mesh = params.mesh;
      const slope_constant = params.function_slope.GetSlope();
      const angle = params.function_slope.GetScale();
      params.function_slope.IncrementTimer();
      const timer = params.function_slope.GetTimer();

      const slope = Slope_function_logarithmic(timer, slope_constant);

      const rot = (slope * angle);
      // const rot = .786;
      // console.log(rot);

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
      const angle = params.function_slope.GetScale();
      params.function_slope.IncrementTimer();
      const timer = params.function_slope.GetTimer();

      const slope = Slope_function_logarithmic(timer, slope_constant);
      
      const rot = ((1.-slope) * angle);
      
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