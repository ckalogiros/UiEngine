"use strict";

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { Create_widget_section, Create_widget_slider } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { ORANGEL, PURPLER } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Gl_add_vpos_xy, Gl_set_round_corners } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Slope_function_logarithmic } from "../../Helpers/Math/MathFunction.js";








var t = 0.0;
const final_t = .5; // The time for the animation. Greter values increments more the scale-rotation
const step = 0.005;
const size = 60;






/**************************************************************************************************************************************************************/
// Circle scale animation

var slope_constant1 = .1;

export function Clbk_animations_circle_scale() {

   /*************************************************************************************************/
   
   const circle = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [VIEWPORT.WIDTH/2, VIEWPORT.HEIGHT/2, 0], [size,size], PURPLER[8], 'circle', [size, 0, 2]);
   circle.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   circle.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   
   circle.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   circle.GenGfxCtx();
   circle.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(circle.root_bufferidx);
   Construct_listen_events_from_mesh_tree(circle);
   Construct_listen_events_relations_from_mesh_tree(circle);
   circle.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, circle.gfx.vb.groupidx);
   
   
   
   /*************************************************************************************************/
   // Constant value slope_constant1 slider
   const slider_dim = [300, 10];
   const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [0, 0, 0], slider_dim, _, _, 'Speed');
   slider.SetInitialValue(slope_constant1);
   slider.GfxUniformsEnable(slider, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   slider.Render();
   Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
   slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(slider)
   Construct_listen_events_relations_from_mesh_tree(slider);

   // Connect slider to control the slope_constant1 value
   const slider_params = slope_constant1;
   Slider_connect(slider, (params, slider_val) => {

      // const bar = slider.children.buffer[slider.bar_idx];
      // slope_constant1 = bar.slider_val;
      slope_constant1 = slider_val;

   }, slider_params);

   
   const params = {
      circle:circle,
      slider:slider,
      slope_constant1:slope_constant1,
   };

   Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params);
      
}

function Animation_scale_up_run(params){

   const circle = params.circle;
   // const slope_constant1 = params.slope_constant1;

   const val = Slope_function_logarithmic(t, slope_constant1) +1;
   
   // Update 
   t+=step;

   
   const temp = Slope_function_logarithmic(t, slope_constant1) +1;
   
   const res = (temp-val)*100
   // Debug: Print the difference in scale of prev calculated with the next
   // console.log((temp-val)*1000)
   
   
   
   circle.geom.dim[0] += res*2;
   circle.geom.dim[1] += res*2;
   circle.geom.AddDimXY(circle.gfx, res, res);
   circle.geom.pos[0] += -res;
   circle.geom.pos[1] += -res;
   circle.geom.AddWposXY(circle.gfx, -res, -res);
   // console.log(res)

   
   Gl_add_vpos_xy(circle.gfx, res, res);

   if(circle.mat.sid.attr & SID.ATTR.R_CORNERS) {

      circle.mat.style[0] =  circle.geom.dim[0];
      Gl_set_round_corners(circle.gfx, circle.geom.dim[0]);
   }

   if(res >= final_t) return true;
   else return false

}

function Animation_scale_up_stop(params){
   
   setTimeout(
      ()=>{ Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); },
      200, 
      
   );

   t = 0.0;
   
   return false;
}

function Animation_scale_down_run(params){
   
   const circle = params.circle;
   
   const val = Slope_function_logarithmic(t, slope_constant1) +1;
   t+=step;
   
   const temp = Slope_function_logarithmic(t, slope_constant1) +1;
   
   const res = (temp-val)*100
   // Debug: Print the difference in scale of prev calculated with the next
   // console.log((temp-val)*1000, t, slope_constant1)
   
   circle.geom.dim[0] -= res*2;
   circle.geom.dim[1] -= res*2;
   circle.geom.AddDimXY(circle.gfx, -res, -res);
   circle.geom.pos[0] += res;
   circle.geom.pos[1] += res;
   circle.geom.AddWposXY(circle.gfx, res, res);
   
   Gl_add_vpos_xy(circle.gfx, -res, -res);

   if(circle.mat.sid.attr & SID.ATTR.R_CORNERS) {

      circle.mat.style[0] =  circle.geom.dim[0];
      Gl_set_round_corners(circle.gfx, circle.geom.dim[0]);
   }

   if(res > .01) return true;
   else return false
}

function Animation_scale_down_stop(params){

   setTimeout(
      ()=>{ Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params); },
      1000, 
   );

   t = 0.0;
   // slope_constant1+=.03

   // await sleep(2000);
   console.log('END')

   return false;
}










/**************************************************************************************************************************************************************/
// Circle flip animation

let slope_constant2 = 1;
let rotation = 0;
let rotation_step = .001;

export function Clbk_animations_circle_flip() {
   
   /*************************************************************************************************/
   
   const circle = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [250, 350, 0], [size,size], ORANGEL[8], 'circle', [size, 0, 2]);
   circle.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   circle.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   
   circle.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   circle.GenGfxCtx();
   circle.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(circle.root_bufferidx);
   Construct_listen_events_from_mesh_tree(circle);
   Construct_listen_events_relations_from_mesh_tree(circle);
   circle.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, circle.gfx.vb.groupidx);
   
   
   
   /*************************************************************************************************/
   // Constant value slope_constant slider
   const slider_dim = [300, 10];
   const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [0, 250, 0], slider_dim, _, _, 'Speed');
   slider.SetInitialValue(slope_constant2);
   slider.GfxUniformsEnable(slider, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   slider.Render();
   Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
   slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(slider)
   Construct_listen_events_relations_from_mesh_tree(slider);

   // Connect slider to control the slope_constant2 value
   const slider_params = slope_constant2;
   Slider_connect(slider, 
      (params, slider_val) => {
         slope_constant2 = slider_val;
      }, 
      slider_params
   );

   
   const params = {
      circle:circle,
      slider:slider,
      slope_constant2:slope_constant2,
   };

   Callback_animations_create(Animation_flip_up_run, Animation_flip_up_stop, params);
      
}

function Animation_flip_up_run(params){

   const circle = params.circle;
   
   
   const val = Slope_function_logarithmic(t, slope_constant2) +1;
   t+=step;
   const temp = Slope_function_logarithmic(t, slope_constant2) +1;
   const res = (temp-val)*10

   rotation += rotation_step+res;
   circle.RotateZ(rotation);

   if(rotation < Math.PI/3) return true;
   else return false

}

function Animation_flip_up_stop(params){
   
   setTimeout(
      ()=>{ Callback_animations_create(Animation_flip_down_run, Animation_flip_down_stop, params); },
      200, 
   );

   t = 0.0;
   
   return false;
}

function Animation_flip_down_run(params){
   
   const circle = params.circle;

   const val = Slope_function_logarithmic(t, slope_constant2) +1;
   t+=step;
   const temp = Slope_function_logarithmic(t, slope_constant2) +1;
   const res = (temp-val)*10
   
   rotation -= rotation_step+res;
   circle.RotateZ(rotation);

   if(rotation > 0) return true;
   else return false
}

function Animation_flip_down_stop(params){

   setTimeout(
      ()=>{ Callback_animations_create(Animation_flip_up_run, Animation_flip_up_stop, params); },
      1000, 
   );

   t = 0.0;
   // slope_constant2+=.03

   // await sleep(2000);
   console.log('END')

   return false;
}