"use strict";

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { MouseGetPosDifX } from "../../Engine/Controls/Input/Mouse.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_section, Create_widget_slider } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { GREENL, GREY, PURPLER, WHITE, YELLOWL } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_calc_pos_dif } from "../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect, Slider_simple_set_value } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { GlRotateZ2D } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomPos, GetSequencedColor } from "../../Helpers/Helpers.js";
import { Slope_function_logarithmic } from "../../Helpers/Math/MathFunction.js";
import { Abs, Magnitude } from "../../Helpers/Math/MathOperations.js";




/**
 * // TODO: 
 * The body meshes, except the head, only need the velocity at 'physics'
 */



const snake_body = [];
let body_count = 26;
const t = [];
const step = 0.005;
const size = 15;
const scale = 1.7;
const rotation = { // This variable is to store the ammount of users input mouse, so that user can rotate the head mesh 
   amt:0.0,
}; 
let in_scale_animation = false;
let first_body_mesh_idx = INT_NULL;


function Init_t(){
   for(let i=0; i < body_count; i++){
      t[i] = 0;
   }
}




/**************************************************************************************************************************************************************/
// 

var slope_constant1 = 0;

export function Demo_snake_animation() {


   Debug_info_ui_static();

   Init_t();

   const style = [size, 0, 1.8];
   const board_size = 300;
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [20,20], [20, 100, 0], [board_size,board_size], GREY[1], 'section', style);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   section.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   const physics = [];






   /*************************************************************************************************/
   // Collectible

   const rand_pos = GetRandomPos([20, 20], [section.geom.dim[0]-20, section.geom.dim[1]-20]);
   const collectible = Create_widget_section(_, _, [0,0], [rand_pos[0], rand_pos[1], 0], [15,15], GREENL[9], 'section', [15, 0, 2]);
   collectible.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   collectible.SetName('collectible');
   section.AddItem(collectible); 
   



   /*************************************************************************************************/
   // 
   const sat = Create_rect_mesh(_, _, [4, 10], YELLOWL[9]);
   sat.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.AddItem(sat);





   


   /*************************************************************************************************/
   //

   const speed = 1.5;
   let next_posx = board_size/2;
   
   for(let i=0; i < body_count; i++){
      
      // const color = GetSequencedColor(9);
      
      const circle = Create_widget_section(_, _, [0,0], [next_posx, 20, 1], [size,size], TRANSPARENCY(PURPLER[9], .6), 'circle', [size, 0, 2]);
      // const circle = Create_widget_section(_, _, [0,0], [next_posx, 20, 1], [size,size], TRANSPARENCY(color,.6), 'circle', style);
      circle.SetName('circle'+i);
      circle.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
      // Store the index of the first body mesh
      const idx = section.AddItem(circle);
      if(first_body_mesh_idx === INT_NULL) first_body_mesh_idx = idx;


      // Physics
      const velocity = [.5, .2]; 
      const mass = circle.geom.dim[0]; 
      const momentum = [velocity[0]*mass, velocity[1] * mass];
      const acceleration = [0, 0];

      physics[i] = {
         vel:velocity,
         mass:mass,
         mom: momentum,
         accel: acceleration,
         speed:speed,
      }

      next_posx -= size*2 + style[2];

   }

   


   
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();
   section.options = SECTION.INHERIT|SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
   section.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   
   



   
   /*************************************************************************************************/
   // Constant value slope_constant1 slider
   const slider_dim = [300, 10];
   const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [0, 0, 0], slider_dim, _, _, 'Speed');
   slope_constant1 = 1.;
   slider.SetInitialValue(slope_constant1*100);
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
   Slider_connect(slider, 
      (params, slider_val) => {
         slope_constant1 = slider_val;
      }, 
      slider_params
   );
  





   /*************************************************************************************************/
   // Satelite Controls
   
   let total_height = 20;
   const pad = 10;
   const panel_height = 150;
   
   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4,4], [0+pad, 0+total_height*2, 0], [0, 0], GREY[1]);
   if(!PLATFORM.ANY_SMARTPHONE_DEVICE) controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.SetName('Sattelite_rotation->controls_section');
   controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   };

   /****************************************************************************************************************/
   // Rotation slider
   // const rot_slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Rotation');
   // controls_section.AddItem(rot_slider);
   // rot_slider.SetInitialValue(0);
   // rot_slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   /****************************************************************************************************************/
   // Speed slider
   // const spd_slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Speed');
   // controls_section.AddItem(spd_slider);
   // spd_slider.SetInitialValue(speed);
   // spd_slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   /****************************************************************************************************************/
   // mouse left right control
   const mouse_panel_control = Create_widget_button(_, '_________________________________________', _, [0, 0, 1], 20, GREY[6], WHITE, [5, 5], .5);
   controls_section.AddItem(mouse_panel_control)
   // mouse_panel_control.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   mouse_panel_control.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   // btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idx1, emitter_idx2] }, MESH_STATE.IS_HOLD_CLICK)
   mouse_panel_control.Bind(
      (params)=>{ // Click callback

         const phys = params.params.target_params.phys;


         const mouse_xdif = MouseGetPosDifX();
         if(Abs(mouse_xdif) > .5) {

            
            /*******************************************************************************************/
            // Satelite Rotation. Just add the ammount of mouse move on the x axis
            
            const mod = .04;

            params.params.target_params.rot.amt += mouse_xdif*mod;
            phys.vel[0] = Math.sin(params.params.target_params.rot.amt);
            phys.vel[1] = Math.cos(params.params.target_params.rot.amt);
            // console.log('mouse_xdif', mouse_xdif, 'amt', params.params.target_params.amt);
         }
            
      }, 
      _, 
      {target_params: {head:section.children.buffer[first_body_mesh_idx], sat:sat, phys: physics[0], rot: rotation, } }, 
      // {sat: sat, phys: physics[0], }, 
      MESH_STATE.IS_HOLD_CLICK
   );
   
   
   /****************************************************************************************************************/
   // Render
   controls_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   controls_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   controls_section.Calc_no_gfx_update();
   controls_section.Render();
   Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);
   controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);
   Construct_listen_events_from_mesh_tree(controls_section)
   Construct_listen_events_relations_from_mesh_tree(controls_section);









   /*********************************************************************************************************************************************/
   // Set slider callback
   {

      // const head = section.children.buffer[first_body_mesh_idx];
      // const phys = physics[0];
      // const params = {
      //    section: section,
      //    ball:head, 
      //    phys: phys,
      //    sat:sat,
      // }

      // // Slider_connect(rot_slider, (params, slider_val) => {
   
      // //    const ball = params.clbk_params.ball;
      // //    const phys = params.clbk_params.phys;
         
      // //    phys.vel[0] = Math.sin(slider_val*Math.PI*2);
      // //    phys.vel[1] = Math.cos(slider_val*Math.PI*2);

      // //    const section = params.clbk_params.section;
      // //    const top_bound = 0;
      // //    const bot_bound = section.geom.dim[1] * 2;
      // //    const left_bound = 0;
      // //    const right_bound = section.geom.dim[0] * 2;
         
      // //    // Check boundaries
      // //    const ball_radius = ball.geom.dim[0];
      // //    const ball_top = ball.geom.pos[1];
      // //    const ball_bot = ball.geom.pos[1] + ball_radius * 2;
      // //    const ball_left = ball.geom.pos[0];
      // //    const ball_right = ball.geom.pos[0] + ball_radius * 2;
         
      // //    if (ball_bot > bot_bound) phys.vel[1] *= -1; // Reverse velocity
      // //    else if (ball_top < top_bound) phys.vel[1] *= -1;
      // //    if (ball_right > right_bound) phys.vel[0] *= -1;
      // //    else if (ball_left < left_bound) phys.vel[0] *= -1;

      // // }, params);

      // Slider_connect(spd_slider, (params, slider_val) => {
   
      //    const ball = params.clbk_params.ball;
      //    const phys = params.clbk_params.phys;
         
      //    phys.speed = slider_val *2;

      //    const section = params.clbk_params.section;
      //    const top_bound = 0;
      //    const bot_bound = section.geom.dim[1] * 2;
      //    const left_bound = 0;
      //    const right_bound = section.geom.dim[0] * 2;
         
      //    // Check boundaries
      //    const ball_radius = ball.geom.dim[0];
      //    const ball_top = ball.geom.pos[1];
      //    const ball_bot = ball.geom.pos[1] + ball_radius * 2;
      //    const ball_left = ball.geom.pos[0];
      //    const ball_right = ball.geom.pos[0] + ball_radius * 2;
         
      //    if (ball_bot > bot_bound) phys.vel[1] *= -1; // Reverse velocity
      //    else if (ball_top < top_bound) phys.vel[1] *= -1;
      //    if (ball_right > right_bound) phys.vel[0] *= -1;
      //    else if (ball_left < left_bound) phys.vel[0] *= -1;

      // }, params);
   }
   
   





   /*************************************************************************************************/
   // Create move for body meshes
   const params = {
      section: section,
      physics: physics,
      collectible:collectible,
      sat:sat,
      rot:rotation,
      controls_section:controls_section,
   }
   
   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_sattelite, params);
   
   
   
   
   
   
   
   /*************************************************************************************************/
   // Create scale animation for body meshes
   
   // const params2 = {
   //    section:section,
   //    circle_idx:first_body_mesh_idx,
   //    slider:slider,
   //    slope_constant1:slope_constant1,
   //    physics: physics,
   // };

   // Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
      
}




function Animate_sattelite(params) {

   if(in_scale_animation) return

   const section = params.params.section;
   
   const head = section.children.buffer[first_body_mesh_idx];
   const phys = params.params.physics[0];
   const sat = params.params.sat;
   const collectible = params.params.collectible;
   // const rot_amt = params.params.amt;
   const controls_section = params.params.controls_section;
   const mouse_panel_control = controls_section.children.buffer[0];
   // const slider = controls_section.children.buffer[0];
   
   
   // Calculate move velocity
   const x = phys.mass * (phys.vel[0] + phys.accel[0]) * phys.speed * .1;
   const y = phys.mass * (phys.vel[1] + phys.accel[1]) * phys.speed * .1;
   
   



   /*******************************************************************************************/
   // Check boundaries
   let hit = false;
   const top_bound = 0;
   const bot_bound = section.geom.dim[1] * 2;
   const left_bound = 0;
   const right_bound = section.geom.dim[0] * 2;
   
   // Check boundaries
   const ball_radius = head.geom.dim[0];
   const ball_top = head.geom.pos[1] + y;
   const ball_bot = head.geom.pos[1] + ball_radius * 2 + y;
   const ball_left = head.geom.pos[0] + x;
   const ball_right = head.geom.pos[0] + ball_radius * 2 + x;

   
   if (ball_bot > bot_bound) {
      phys.vel[1] *= -1; // Reverse velocity
      // head.geom.pos[1] = bot_bound-ball_radius*2; // Puut back inside the panel area
      hit=true;
   }
   else if (ball_top < top_bound) {
      phys.vel[1] *= -1;
      // head.geom.pos[1] = 0;
      hit=true;
   }
   if (ball_right > right_bound) {
      phys.vel[0] *= -1;
      // Calculate the correct position from the wall
      const b_dist = right_bound - (head.geom.pos[0] + ball_radius * 2);
      head.geom.pos[0] =  right_bound - ((x - b_dist) + ball_radius*2);
      head.geom.UpdateSetWposX(head.gfx);
      hit=true;
      // console.log(i, x, b_dist, x-b_dist, head.geom.pos[0])
   }
   else if (ball_left < left_bound) {
      phys.vel[0] *= -1;
      
      // Calculate the correct position from the wall
      const b_dist = left_bound + head.geom.pos[0];
      head.geom.pos[0] =  left_bound + (Abs(x) - b_dist);
      head.geom.UpdateSetWposX(head.gfx);
      // head.geom.pos[0] = 0;
      hit=true;
   }
   else {
   
      head.geom.pos[0] += x;
      head.geom.pos[1] += y;
      head.geom.AddWposXY(head.gfx, x, y);
   }


   
   /*******************************************************************************************/
   // Check collision with collectible

   const dif = Mesh_calc_pos_dif(collectible, head)
   const dist1 = Magnitude(dif[0], dif[1]);
   // console.log('dist1', dist1, 'dif', dif)
   
   // On collect
   if(dist1 < collectible.geom.dim[0]+head.geom.dim[0] ){
      
      // Create new collectible in another random position
      const rand_pos = GetRandomPos([20, 20], [section.geom.dim[0]*2-20, section.geom.dim[1]*2-20]);
      collectible.SetWposXY(rand_pos)

      // Add a body to the snake

      // Increment score
   }


   
   /*******************************************************************************************/
   // Move Body

   // const head = params.params.head;
   const body = section.children.buffer[first_body_mesh_idx+1];

   // const size = head.geom.dim[0];
   const s = size;


   const axis = [
      head.GetPosX() - body.GetPosX(),
      head.GetPosY() - body.GetPosY(),
   ];

   const dist = Magnitude(axis[0], axis[1]);
   
   // Move the ball
   if(dist > head.geom.dim[0]*2 ){
      
      let prev_mesh = head;
      
      for(let i=first_body_mesh_idx; i <= section.children.boundary; i++){
         
         const body_mesh = section.children.buffer[i];

         const axis2 = [
            prev_mesh.GetPosX() - body_mesh.GetPosX() ,
            prev_mesh.GetPosY() - body_mesh.GetPosY() 
         ];

         const dist2 = Magnitude(axis2[0], axis2[1]);
         
         /** Body Follows head with almost in stantly */
         const n2 = [
            axis2[0] / dist2,
            axis2[1] / dist2,
         ];
         
         const delta2 = dist2 - size*2;
         const xx2 = n2[0] * delta2;
         const yy2 = n2[1] * delta2;
         
         
         if(dist2 > prev_mesh.geom.dim[0]*2 ){
            
            body_mesh.geom.pos[0] += xx2;
            body_mesh.geom.pos[1] += yy2;
            body_mesh.geom.AddWposXY(body_mesh.gfx, xx2, yy2);
            
         }

         prev_mesh = body_mesh;
      }
   }



   

   
   /*******************************************************************************************/
   // Satelite move

   const angle = Math.atan2(x, y); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
   GlRotateZ2D(sat.gfx, sat.geom.dim, angle, 1);
   /* Use for rendering sattelite with GFX.ATTR_STYLE */
   {
      // const cx = sat.geom.pos[0] - sat.geom.dim[0] 
      // const cy = sat.geom.pos[1] - sat.geom.dim[1]
   }
   /* Use for rendering sattelite without GFX.ATTR_STYLE */
   const cx = sat.geom.pos[0]; // Center to sattelites position
   const cy = sat.geom.pos[1] 
   const r = head.geom.dim[0] + sat.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
   const a = (cx + (r * Math.sin(angle))); // The rotation is the tangent of the outer head's perimeter 
   const b = (cy + (r * Math.cos(angle)));
   
   sat.geom.SetWposXY(sat.gfx, head.geom.pos[0]+head.geom.dim[0], head.geom.pos[1]+head.geom.dim[1]);
   sat.geom.AddWposXY(sat.gfx, a, b);

   // Updtate the rotation ammount from the user input
   params.params.rot.amt = angle;

   // /** if the head has hitted the wall boundaries, set the slider (value and position) according to the new direction */
   // // This value gives: from [0..1] of the right semicircle rotation, and [-1..0] for the left semicircle rotation
   // // (The right semicircle starts pointing down, and ends up. The left starts pointing up and ends down (counter clockwise))
   // let val = angle / Math.PI;
   
   // // Interpolate the above value to slider's [0..1] span.
   // if(val < 0){ // If val [0..1] for the right semicircle, 
   //    val = (val * .5) +1; // give us a value of [0..0.5]
   // }
   // else { // If val [-1..0] for the left semicircle, 
   //    val = (val * .5); // give us a value of [0.5..1]
   // }
   
   
   // const bar = slider.children.buffer[1];
   // Slider_simple_set_value(bar, val);
}






function Animation_scale_up_run(params){

   in_scale_animation = true;

   const section = params.section;
   const idx = params.circle_idx;

   if(idx >= body_count) return false;


   const circle = section.children.buffer[idx];

   const val = Slope_function_logarithmic(t[idx], slope_constant1) +1;
   
   // Update 
   t[idx] += step;

   
   const temp = Slope_function_logarithmic(t[idx], slope_constant1) +1;
   
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

   
   if(circle.geom.dim[0] < size*scale && res > 1) return true;
   else {
      
      const params2 = {
         section:section,
         circle_idx:params.circle_idx + 1,
         physics: params.physics,
      };
         
      if(params.circle_idx-first_body_mesh_idx <= body_count){
            
         // console.log('Create NEW', params.circle_idx)
         Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
      }

      return false;
   }

}

function Animation_scale_up_stop(params){
   
   // console.log('SCALE DOWN NEW', params.circle_idx)

   setTimeout(
      ()=>{ Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); },
      100, 
   );

   const idx = params.circle_idx;
   t[idx] = 0.0;
   
   return false;
}

function Animation_scale_down_run(params){
   
   const section = params.section;
   const idx = params.circle_idx;

   if(idx >= body_count) 
      return false;

   const circle = section.children.buffer[idx];

   const val = Slope_function_logarithmic(t[idx], slope_constant1) +1;
   t[idx] += step;
   
   const temp = Slope_function_logarithmic(t[idx], slope_constant1) +1;
   
   const res = (temp-val)*100
   // Debug: Print the difference in scale of prev calculated with the next
   // console.log((temp-val)*1000, t, slope_constant1)
   
   circle.geom.dim[0] -= res*2;
   circle.geom.dim[1] -= res*2;
   circle.geom.AddDimXY(circle.gfx, -res, -res);
   circle.geom.pos[0] += res;
   circle.geom.pos[1] += res;
   circle.geom.AddWposXY(circle.gfx, res, res);
   
   if(circle.geom.dim[0] > size &&  res > .01) return true;
   else return false;
}

function Animation_scale_down_stop(params){

   
   if(params.circle_idx-first_body_mesh_idx >= body_count) {

      // Create new round of scales in a timeout
      // params.circle_idx = 0;
      // setTimeout(
      //    ()=>{ Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params); },
      //    5000, 
      // );

      {
         const section = params.section;

         const last_elem_idx = section.children.boundary;
         const last_mesh = section.children.buffer[last_elem_idx];
         

         // Calc the axis vector of the 2 last body meshes, and set the position of the new body mesh to that axis
         const second_last_mesh = section.children.buffer[last_elem_idx-1];
         const axis = [
            last_mesh.GetPosX() - second_last_mesh.GetPosX(),
            last_mesh.GetPosY() - second_last_mesh.GetPosY(),
         ];
      
         const posx = last_mesh.geom.pos[0] + axis[0];
         const posy = last_mesh.geom.pos[1] + axis[1];


         const circle = Create_widget_section(_, _, [0,0], [posx, posy, 1], [size,size], TRANSPARENCY(PURPLER[9], .6), 'circle', [0, size, 2]);
         // const circle = Create_widget_section(_, _, [0,0], [next_posx, 20, 1], [size,size], TRANSPARENCY(color,.6), 'circle', style);
         circle.SetName('circle');
         circle.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         section.AddItem(circle);
   
         circle.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_mesh.gfx.vb.groupidx);
         circle.Render();
   
         // Physics
         const velocity = [params.physics[last_elem_idx].vel[0], params.physics[last_elem_idx].vel[1]]; 
         const mass = circle.geom.dim[0]; 
         const momentum = [velocity[0]*mass, velocity[1] * mass];
         const acceleration = [0, 0];
         const speed = 5.5;
   
         const physics = {
            vel:velocity,
            mass:mass,
            mom: momentum,
            accel: acceleration,
            speed:speed,
         }

         params.physics.push(physics);

         body_count++;
   
         // next_posx -= size*2 + style[2];
      }


      in_scale_animation = false;
      return false;
   }
   // else in_scale_animation = false;


   const idx = params.circle_idx;
   t[idx] = 0.0;
   
   // console.log('END', params.circle_idx);
   return false;
}


