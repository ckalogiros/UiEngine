"use strict";

import { GetSign } from "../../Helpers/Helpers.js";
import { Abs } from "../../Helpers/Math/MathOperations.js";
import { New_generic_buffer } from "../Core/Buffers.js";




// physics2D_object 
//    u_x: velocity x
//    u_y: velocity y
//    a_x: acceleration x
//    a_y: acceleration y
//    p_x: position x
//    p_y: position y
//    m:0, mass
const physics2D_struct = {
   prev_t:0,
   curr_t:0,
   dt:0, // delta time
};

const _physics_buffer = New_generic_buffer(_, '_physics_buffer');


/** */
export function Physics2D_test(x=0, y=0) {

   const o =  Physics2D_create_object(x, y);

   // Move to new position
   const new_x = x+10, new_y = y-10;
   physics2D_struct.prev_t = 0;
   physics2D_struct.curr_t = 16;

   console.log('pos', o.p_x, o.p_y);
   console.log('new pos', new_x, new_y);
   console.log('Physics2D_Calculate_angle_from_pos', Physics2D_Calculate_angle_from_pos(o.p_x, o.p_y), 'new_pos', Physics2D_Calculate_angle_from_pos(new_x, new_y));
   console.log('Physics2D_Calculate_magnitude', Physics2D_Calculate_magnitude(o.p_x, o.p_y));
   console.log('Physics2D_Calculate_magnitude new', Physics2D_Calculate_magnitude(new_x, new_y));
   console.log('Physics2D_Normalize', Physics2D_Normalize(o.p_x, o.p_y));
   console.log('Physics2D_Normalize new', Physics2D_Normalize(new_x, new_y));
   console.log('Velocity', Calculate_velocity_xy_from_position(o.p_x, o.p_y, new_x, new_y, physics2D_struct.prev_t, physics2D_struct.curr_t));
   console.log('Acceleration', Calculate_acceleration_from_position(o.p_x, o.p_y, new_x, new_y, physics2D_struct.prev_t, physics2D_struct.curr_t));
   console.log('Dot', Calculate_dot_product(o.p_x, o.p_y, new_x, new_y));
   console.log('Cross', Calculate_cross_product(o.p_x, o.p_y, new_x, new_y));
   console.log('Theta', Calculate_angle_theta(o.p_x, o.p_y, new_x, new_y));
   console.log('', );

}
/** */
function Mult(x1,y1,x2,y2) {
   // return
}
/** */
export function Physics2D_Calculate_angle_from_pos(pos_x, pos_y) {
   const angle = Math.atan2(pos_x, pos_y);
   return angle;
}
/** */
function Calculate_angle_theta(pos_x1, pos_y1, pos_x2, pos_y2) {

   const dot = Calculate_dot_product(pos_x1, pos_y1, pos_x2, pos_y2);
   const mag1 = Physics2D_Calculate_magnitude(pos_x1, pos_y1);
   const mag2 = Physics2D_Calculate_magnitude(pos_x2, pos_y2);
   const theta = Math.acos(dot / (mag1*mag2));
   return theta;
}
/** Calculate a mesh's theta angle based on position change*/
// export function Calculate_angle_theta_self(physics_idx) {

//    const o = _physics_buffer.buffer[physics_idx];

//    const dot = Calculate_dot_product(o.p_x, o.p_y, o.prev_p_x, o.prev_p_y);
//    const mag1 = Physics2D_Calculate_magnitude(o.p_x, o.p_y);
//    const mag2 = Physics2D_Calculate_magnitude(o.prev_p_x, o.prev_p_y);
//    const theta = Math.acos(dot / (mag1*mag2));
//    return theta;
// }
/** */
function Calculate_dot_product(pos_x1, pos_y1, pos_x2, pos_y2) {

   const dot_product =  ((pos_x1*pos_x2) + (pos_y1*pos_y2));
   return dot_product;
}
/** */
function Calculate_cross_product(pos_x1, pos_y1, pos_x2, pos_y2) {

   const cross_product =  ((pos_x1*pos_y2) - (pos_y1*pos_x2));
   return cross_product;
}
/** */
export function Physics2D_Calculate_magnitude(pos_x, pos_y) {

   const magnitude =  Math.sqrt((pos_x*pos_x) + (pos_y*pos_y));
   return magnitude;
}
/** */
export function Physics2D_Calculate_magnitude_local_space(physics_idx) {

   const o = _physics_buffer.buffer[physics_idx];
   const pos_x = o.p_x - o.prev_p_x;
   const pos_y = o.p_y - o.prev_p_y;

   const magnitude =  Math.sqrt((pos_x*pos_x) + (pos_y*pos_y));
   return magnitude;
}
/** */
export function Physics2D_Normalize(pos_x, pos_y) {

   const magnitude =  Physics2D_Calculate_magnitude(pos_x, pos_y)
   const normalization = {
      x:pos_x/magnitude,
      y:pos_y/magnitude,
   };
   return normalization;
}
/** */
function Calculate_velocity_xy_from_position(prev_pos_x, prev_pos_y, pos_x, pos_y, prev_t, curr_t) {

   // const dt = curr_t - prev_t;
   // const u = {
   //    x: (pos_x-prev_pos_x) / dt,
   //    y: (pos_y-prev_pos_y) / dt,
   // }; 
   const u = {
      x: (pos_x-prev_pos_x),
      y: (pos_y-prev_pos_y),
   }; 
   return u;
}
/** */
function Calculate_acceleration_from_position(prev_pos_x, prev_pos_y, pos_x, pos_y, prev_t, curr_t) {

   const dt = curr_t - prev_t;
   const dt2 = dt*dt;
   const dx = (pos_x-prev_pos_x) * (pos_x-prev_pos_x);
   const dx2 = dx*dx;
   const dy = (pos_y-prev_pos_y) * (pos_y-prev_pos_y);
   const dy2 = dy*dy;
   const a = {
      x: dx2/dt2,
      y: dy2/dt2,
   }; 
   return a;
}

/** */
export function Physics_2D_get_velocity_xy_from_position(physics_idx) {

   const o = _physics_buffer.buffer[physics_idx];
   const u = {
      x: (o.p_x-o.prev_p_x),
      y: (o.p_y-o.prev_p_y),
   }; 
   return u;
}

/** */
export function Physics2D_create_object(pos_x, pos_y, drag_x=1, drag_y=1) {

   const idx = _physics_buffer.Add(
      {
         p_x:pos_x, // position x
         p_y:pos_y, // position y
         prev_p_x:pos_x, // position x
         prev_p_y:pos_y, // position y
         u_x:0, // velocity x
         u_y:0, // velocity y
         a_x:0, // acceleration x
         a_y:0, // acceleration y
         dir_x:0, // direction x
         dir_y:0, // direction y
         drag_x:drag_x, // drag/dumping x
         drag_y:drag_y, // drag/dumping y
         m:0, // mass
         g:1., // gravity
      }
   );


   return idx;
   // return _physics_buffer.buffer[idx];
}
/** */
export function Physics2D_update() {

   // Update all meshes with physics2D 
   for(let i = 0; i <= _physics_buffer.boundary; i++) {

      const o = _physics_buffer.buffer[i];

      // Reset. set previous pos to current
      Physics2D_update_pos_xy(i, o.p_x, o.p_y);

      // Apply forces
   }

   // // Update time
   // physics2D_struct.prev_t = physics2D_struct.curr_t;
   // physics2D_struct.curr_t = Time_get_time();

   // // Update frame delta time
   // physics2D_struct.dt = (physics2D_struct.curr_t - physics2D_struct.prev_t) * MILLISEC_TO_SEC;
}

/** */
export function Physics2D_set_velocity_x(idx, velocity_x){

   const o = _physics_buffer.buffer[idx];
   o.u_x = velocity_x;
}
export function Physics2D_set_velocity_y(idx, velocity_y){

   const o = _physics_buffer.buffer[idx];
   o.u_y = velocity_y;
}
/** */
export function Physics2D_set_pos_y(idx, pos_y){

   const o = _physics_buffer.buffer[idx];
   o.p_y = pos_y;
}
/** */
export function Physics2D_update_pos_xy(idx, pos_x, pos_y){

   const o = _physics_buffer.buffer[idx];
   o.prev_p_x = o.p_x;
   o.prev_p_y = o.p_y;
   o.p_x = pos_x;
   o.p_y = pos_y;
}
/** */
export function Physics2D_update_pos_x(idx, pos_x){

   const o = _physics_buffer.buffer[idx];
   o.prev_p_x = o.p_x;
   o.p_x = pos_x;
}
/** */
export function Physics2D_update_pos_y(idx, pos_y){

   const o = _physics_buffer.buffer[idx];
   o.prev_p_y = o.p_y;
   o.p_y = pos_y;
}

/** */
export function Physics2D_get_velocity_x(idx){
   return _physics_buffer.buffer[idx].u_x;
}
/** */
export function Physics2D_get_velocity_y(idx){
   return _physics_buffer.buffer[idx].u_y;
}
/** */
export function Physics2D_get_acceleration_x(idx){
   return _physics_buffer.buffer[idx].a_x;
}
/** */
export function Physics2D_get_acceleration_y(idx){
   return _physics_buffer.buffer[idx].a_y;
}

/** */
export function Physics2D_apply_force(idx, force_x, force_y){
   const o = _physics_buffer.buffer[idx];
   o.dir_x = GetSign(force_x)
   o.dir_y = GetSign(force_y)
   o.a_x = Abs(force_x);
   o.a_y = Abs(force_y);
   // console.log(o.u_x, o.dir_x)
}
/** */
export function Physics2D_apply_force_x(idx, force_x){
   const o = _physics_buffer.buffer[idx];
   o.dir_x = GetSign(force_x);
   o.a_x = Abs(force_x);
}
/** */
export function Physics2D_apply_force_y(idx, force_y){
   const o = _physics_buffer.buffer[idx];
   o.dir_y = GetSign(force_y)
   o.a_y = Abs(force_y);
}
/** */
export function Physics2D_limit_velocity(idx, max_velocity_x, max_velocity_y){
   const o = _physics_buffer.buffer[idx];
   if(o.u_x > max_velocity_x) o.u_x = max_velocity_x;
   if(o.u_y > max_velocity_y) o.u_y = max_velocity_y;
}

export function Physics2D_calculate_position(idx) {

   const o = _physics_buffer.buffer[idx];

   // o.a_y *= o.g;

   // Update velocity
   o.u_x += o.a_x;
   o.u_y += o.a_y;
   o.u_x *= o.drag_x;
   o.u_y *= o.drag_y;


   if(o.u_x < .01) o.u_x = 0;
   if(o.u_y < .01) o.u_y = 0;

   // console.log(o.a_y)
   // console.log(o.u_x)

   // Apply gravity
   // o.u_y *= o.g*o.drag_y;
   o.u_y += o.g*o.drag_y;

   // Update position
   o.p_x += o.u_x * o.dir_x;
   o.p_y += o.u_y * o.dir_y;
   // Reset acceleration
   o.a_x = 0;
   o.a_y = 0;
   // o.a_y = o.g;

   return{
      x:o.p_x,
      y:o.p_y,
   };
}
