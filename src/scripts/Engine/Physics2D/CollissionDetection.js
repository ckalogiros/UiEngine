"use strict";

import { Abs, Max, Min } from "../../Helpers/Math/MathOperations.js";
import { New_generic_buffer } from "../Core/Buffers.js";
import { Mesh_buffer_get_mesh_byidx } from "../Core/MeshBuffer.js";
import { Mesh_add_and_copy_wpos_xy } from "../Drawables/Operations/MeshAttributesFunctions.js";
import { Physics2D_update_pos_xy, Physics_2D_get_velocity_xy_from_position } from "./Physics2D.js";



/** Store object's collision data, and refferences into groups  */
const _collision_storage_buffer = New_generic_buffer(_, '_collision_storage_buffer');


_CNT=0x1;
export const PHYSICS2D_COLLISION_FLAGS = {
   IS_MOVABLE:_CNT,
   IS_OBSTRUCTED:_CNT<<=0x1,
};



const collision_data = {
   is_true:false,
   ux:0, uy:0, // Velocity
   normal_x:0, normal_y:0, // Norma Vector
   near_dx : 0, far_dx  : 0, near_dy : 0, far_dy  : 0, // Distance
   near_xt: 0, far_xt : 0, near_yt: 0, far_yt : 0, // Time
   near_t: 0, far_t: 0,
   penetration_depth_x:0,
   penetration_depth_y:0,
   axis   :'0'
};






/**********************************************************************************************************************/
// Physics Internal Workings

/** */
export function Collision_detection_create_group(name='') {

   const idx = _collision_storage_buffer.Add( {
      name:name,
      data:New_generic_buffer(_, 'collision_group'),
   } );

   return idx;
}
/** */
export function Collision_detection_add_object(group_idx, mesh, physics_idx, flags=0x0) {

   const coll_idx = _collision_storage_buffer.buffer[group_idx].data.Add({
      mesh_idx:mesh.mesh_bufferidx,
      coll_idx:INT_NULL,
      physics_idx:physics_idx,
      flags:flags,
   });

   _collision_storage_buffer.buffer[group_idx].data.buffer[coll_idx].coll_idx = coll_idx;

   mesh.physics.collision.group_idx = group_idx;


   return coll_idx;
}








/**********************************************************************************************************************/
// Physics Functionality


/**
 * // TODO 
 * 1. Create a bounding volume (circle) to have a quick estimation if the 2 objects are in a position of collision
 * 2. Pass all used variables. Avoid Getting meshes from mesh buffer
 */
/**Check penetration of 2 collision objects */
export function Penetration_check(collision_group_idx, collision_idx1, collision_idx2){

   const collision_data1 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx1];
   const collision_data2 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx2];

   const mesh1 = Mesh_buffer_get_mesh_byidx(collision_data1.mesh_idx);
   if(!mesh1||mesh1===undefined) alert('00199816551413221: CollisionDetection');
   const mesh2 = Mesh_buffer_get_mesh_byidx(collision_data2.mesh_idx);
   if(!mesh2||mesh2===undefined) alert('00199816551413222: CollisionDetection');


   const u = Physics_2D_get_velocity_xy_from_position(mesh1.physics.idx);
   
   
   // Cache values
   const pos1 = mesh1.geom.pos, dim1 = mesh1.geom.dim;
   const pos2 = mesh2.geom.pos, dim2 = mesh2.geom.dim;

   const hor_distance  = dim1[0] + dim2[0];
   const vert_distance = dim1[1] + dim2[1];
   
   const center1_x = pos1[0]+dim1[0], center1_y = pos1[1]+dim1[1];
   const center2_x = pos2[0]+dim2[0], center2_y = pos2[1]+dim2[1];
   
   const d_x = Abs(center1_x - center2_x)-1;
   const d_y = Abs(center1_y - center2_y)-1;
   
   // Chech penetration
   if(d_x < hor_distance && d_y < vert_distance) {

      const overlap_x = hor_distance - d_x;
      const overlap_y = vert_distance - d_y;
      let penetration_x = 0;

      // const gg = Abs((center1_x + u.x)-center2_x)
      // // console.log(gg, overlap_x, hor_distance, d_x, u.x)
      // if(gg > hor_distance){
      //    // overlap_x += Abs(u.x)
      //    // penetration_x = -Abs(u.x)
      //    penetration_x = -(Abs(u.x)+gg)-100
      //    // penetration_x = -gg*2
      //    console.log(penetration_x, gg, overlap_x, hor_distance, d_x, u.x)
      // }

      //    console.log(overlap_x, hor_distance, d_x, u.x)
      // }
      // if(Abs(u.x) > dim2[0]*2)
      //    console.log(u.x)

      if(overlap_x < overlap_y) { // resolve on X
         collision_data.normal_y = 0;
         collision_data.penetration_depth_x = overlap_x+penetration_x; 
         if (center1_x < center2_x) collision_data.normal_x = 1; // push right
         else if (center1_x > center2_x) collision_data.normal_x = -1; // push left
      }
      else if(overlap_y < overlap_x) { // resolve on Y
         collision_data.normal_x = 0;
         collision_data.penetration_depth_y = overlap_y; 
         if (center1_y < center2_y) collision_data.normal_y = 1;// push down
         else collision_data.normal_y = -1; // push upp
      }
      
      collision_data.time = 1;
      collision_data.penetration_depth_x *= collision_data.normal_x;
      collision_data.penetration_depth_y *= collision_data.normal_y;
      
      return collision_data;
      
   }

      // DEBUG
   if(collision_data.normal_x !== 0){
      if(collision_data.normal_x > 0) collision_data.axis = 'X';
      else if(collision_data.normal_x < 0) collision_data.axis = '-X';
      else  collision_data.axis = '0';
   }
   else if(collision_data.normal_y !== 0) {
      if(collision_data.normal_y > 0) collision_data.axis = 'Y';
      else if(collision_data.normal_y < 0) collision_data.axis = '-Y';
      else  collision_data.axis = '0';
   }
   
   collision_data.time = 0;
   return collision_data;
   

   // const h = (hor_distance*2 - impact_mag) *n;
   // const v = (vert_distance*2 - impact_mag) * n;
}
/**Check penetration of 2 collision objects */
/**Good Last */
export function Swept_AABB(collision_group_idx, collision_idx1, collision_idx2){

   const collision_data1 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx1];
   const collision_data2 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx2];

   const mesh1 = Mesh_buffer_get_mesh_byidx(collision_data1.mesh_idx);
   const mesh2 = Mesh_buffer_get_mesh_byidx(collision_data2.mesh_idx);

   const u = Physics_2D_get_velocity_xy_from_position(mesh1.physics.idx);
   collision_data.ux = Abs(u.x);
   collision_data.uy = Abs(u.y);

   if(u.x === 0 && u.y === 0) return collision_data;


   // Cache values
   const pos1 = mesh1.geom.pos, dim1 = mesh1.geom.dim;
   const pos2 = mesh2.geom.pos, dim2 = mesh2.geom.dim;

   const mesh1_center_x = pos1[0]+dim1[0];
   const mesh1_center_y = pos1[1]+dim1[1];

   const point = {
      x:mesh1_center_x,
      y:mesh1_center_y,
      dir_x:mesh1_center_x+Abs(u.x),
      dir_y:mesh1_center_y+Abs(u.y),
   };
   const inflated = {
      l:pos2[0]-dim1[0],
      r:pos2[0]+dim2[0]*2+dim1[0],
      t:pos2[1]-dim1[1],
      b:pos2[1]+dim2[1]*2+dim1[1],
   };


   // Distance before velocity acount
   const dx = mesh1_center_x - (pos2[0]+dim2[0]);
   const dy = mesh1_center_y - (pos2[1]+dim2[1]);
   // console.log(dx)

   // Calculate the distances of the colliders point p with both edges of both axis of the collidee.
   // Then devide by the new point p (velocity added) to get a percentage valueof that distance.
   let near_dx = 0;
   let far_dx  = 0;
   let near_dy = 0;
   let far_dy  = 0;
   

  
  // near_dx = point.x - inflated.r;
  // far_dx  = point.x - inflated.l;
  // near_dy = point.y - inflated.b;
  // far_dy  = point.y - inflated.t;

   if(u.x > 0) {
      near_dx = inflated.l - point.x;
      far_dx  = inflated.r - point.x;
   }
   else {
      near_dx = point.x - inflated.r;
      far_dx  = point.x - inflated.l;
   }
   if(u.y > 0) {
      near_dy = inflated.t - point.y;
      far_dy  = inflated.b - point.y;
   }
   else {
      near_dy = point.y - inflated.b;
      far_dy  = point.y - inflated.t;
   }
   collision_data.near_dx  = near_dx;  
   collision_data.far_dx   = far_dx ;
   collision_data.near_dy  = near_dy;
   collision_data.far_dy   = far_dy ;

   /**
    * In order to have the correct result
    * 1. We need the direction
    * 2. we need the position left-right,top,bottom from target
    * 3. we are not before top and bellow bottom
    * 
    * 1. we get from a) velocity sign, b) from near_dx-dy sign
    * 2. we get from distance. near_dx-dy also provides the distance
    * 3. we get from the product of far_dx-dy been negative
    * 
   */
  {
   // if((near_dx > 0 && dx < 0) && (near_dy*far_dy < 0)) {
   //    collision_data.normal_x = 1;
   //    collision_data.normal_y = 0;
   // }
   // else if((near_dx < 0 && dx > 0) && (near_dy*far_dy < 0)) {
   //    collision_data.normal_x = -1;
   //    collision_data.normal_y = 0;
   // }
   // else if((near_dy > 0 && dy < 0) && (near_dx*far_dx < 0)){
   //    collision_data.normal_y = 1;
   //    collision_data.normal_x = 0;
   // }
   // else if((near_dy < 0 && dy > 0) && (near_dx*far_dx < 0)){
   //    collision_data.normal_y = -1;
   //    collision_data.normal_x = 0;
   // }
  }
  if((mesh1_center_x > inflated.t) && (mesh1_center_x < inflated.b)) {
     collision_data.normal_y = 0;
     if(dx < 0) collision_data.normal_x = 1;
     else collision_data.normal_x = -1;
   }
   else if((mesh1_center_y > inflated.l && mesh1_center_y < inflated.r)) {
      collision_data.normal_x = 0;
      if(dy < 0) collision_data.normal_y = 1;
      else collision_data.normal_y = -1;
   }

   
   // Calculate penetration base on collider direction, to get the distance 
   collision_data.penetration_depth_x = -(point.x + point.dir_x) * 0.5;
   collision_data.penetration_depth_y = -(point.y + point.dir_y) * 0.5;



   // if(collision_data.near_dx*collision_data.far_dx > 0 || collision_data.near_dy*collision_data.far_dy > 0) return collision_data;
   
   
   // // Calculate collision time
   // if(u.x === 0) {
   //    // collision_data.near_xt = near_dx / -Infinity;
   //    // collision_data.far_xt  = far_dx  /  Infinity;
   //    // collision_data.near_xt = 0;
   //    // collision_data.far_xt  = 0;
   // }
   // else {
   //    // collision_data.near_xt = near_dx / u.x;
   //    // collision_data.far_xt  = far_dx  / u.x;
   //    collision_data.near_xt = near_dx / point.dir_x;
   //    collision_data.far_xt  = far_dx  / point.dir_x;
   // }
   // if(u.y === 0) {
   //    // collision_data.near_yt = near_dy / -Infinity;
   //    // collision_data.far_yt  = far_dy  /  Infinity;
   //    // collision_data.near_yt = 0;
   //    // collision_data.far_yt  = 0;
   // }
   // else {
   //    // collision_data.near_yt = near_dy / u.y;
   //    // collision_data.far_yt  = far_dy  / u.y;
   //    collision_data.near_yt = near_dy / point.dir_y;
   //    collision_data.far_yt  = far_dy  / point.dir_y;
   // }

   collision_data.near_t = Max(collision_data.near_xt, collision_data.near_yt);
   collision_data.far_t  = Min(collision_data.far_xt, collision_data.far_yt);
   
   // if((collision_data.near_xt > collision_data.near_yt)) {
         
   //    collision_data.normal_y = 0;
   //    collision_data.penetration_depth_y = 0;
   //    if(collision_data.near_xt > 0) {
   //       collision_data.penetration_depth_x *= collision_data.near_xt;
   //       // collision_data.penetration_depth_x = u.x;
   //       collision_data.normal_x = 1;
   //       // console.log('X', collision_data.penetration_depth_x.toFixed(2), collision_data.penetration_depth_y.toFixed(2))
   //    }
   //    else if(collision_data.near_xt < 0) {
   //       collision_data.penetration_depth_x = u.x;
   //       collision_data.normal_x = -1;
   //       // console.log('-X', collision_data.penetration_depth_x.toFixed(2), collision_data.penetration_depth_y.toFixed(2))
   //    }
   // }
   // if((collision_data.near_yt * far_dy > 0) && (near_dx * far_dx < 0)) {
      
   //    collision_data.normal_x = 0;
   //    collision_data.penetration_depth_x = 0;
   //    if(collision_data.near_yt > 0) {
   //       collision_data.penetration_depth_y = 2;
   //       collision_data.normal_y = 1;
   //       // console.log('Y', penetration_depth.x.toFixed(2), collision_data.penetration_depth_y.toFixed(2))
   //    }
   //    else if(collision_data.near_yt < 0) {
   //       collision_data.penetration_depth_y = -2;
   //       collision_data.normal_y = -1;
   //       // console.log('-Y', collision_data.penetration_depth_x.toFixed(2), collision_data.penetration_depth_y.toFixed(2))
   //    }
   // }

         
   // if(near_t < 0  && far_t > 0) { // We have a collision

   //    const d_x = point.x - inflated.

   // }
   
   // // collision_data.time = collision_data.near_t;
   collision_data.time = 1;
   // collision_data.time = 0;
   // if(collision_data.near_t < 1) {
   //    collision_data.time = collision_data.near_t;
   //    // console.log(collision_data.axis)
   // }


   // if(collision_data.near_t < 1 && collision_data.near_t > -1) collision_data.time = collision_data.near_t;
   // if(collision_data.near_t > collision_data.far_t || 
   //    (collision_data.near_xt < 0 && collision_data.near_yt < 0) || 
   //    (collision_data.near_xt > 1 || collision_data.near_yt > 1)) {

   //       collision_data.time = collision_data.near_t;
   //    }


   // DEBUG
   if(collision_data.normal_x !== 0){
      if(collision_data.normal_x > 0) collision_data.axis = 'X';
      else if(collision_data.normal_x < 0) collision_data.axis = '-X';
      else  collision_data.axis = '0';
   }
   else if(collision_data.normal_y !== 0) {
      if(collision_data.normal_y > 0) collision_data.axis = 'Y';
      else if(collision_data.normal_y < 0) collision_data.axis = '-Y';
      else  collision_data.axis = '0';
   }


   return collision_data;

}
/**SAVE */
// export function Swept_AABB(collision_group_idx, collision_idx1, collision_idx2){

//    /**
//     * INFO: {
//     *    nx:   near in x axis, 
//     *    fx:   far in x axis, 
//     *    collider:   A point, striped of its size
//     *    collidee:   Inflated by the size of collider
//     * }
//     * X-AXIS: Approaching from the left side
//     * If nx = 1: this is half the distance between origin(the main panel) and mesh2's left edge
//     * If nx = 0: exactly at the left edge of mesh 2(contact point: at nx=0)
//     * So the time percentage for a collision (approaching from left) is 1 at half distance and 0 at contact point
//     * X-AXIS: Approaching from the right side
//     * If fx = 0: exactly at the right edge of mesh 2 (contact point:at fx=0)
//     * 
//     * Approaching side
//     * If fx < 0 (negative), then collider is on the right side of collidee, approaching from the right
//     * If nx > 0 (positive), then collider is on the left side of collidee, approaching from the left
//     * 
//     * So: 
//     *    if +nx and +fx we are on the left
//     *    if -nx and -fx we are on the right
//     *    else -nx +fx we collide
//     * In math: if(nx*fx === positive) NO collision
//     *          if(nx*fx === negative) COLLISION
//     * 
//     * 
//     * # Contact point and penetration
//     * (only approaching from the left):
//     * The contact point is 0 on the collision, positive before the collision and negative in penetration
//     * Contact point measures half the distance in pixels, from center of collider to the left side of the collidee
//     * 
//     */


//    const collision_data1 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx1];
//    const collision_data2 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx2];

//    const mesh1 = Mesh_buffer_get_mesh_byidx(collision_data1.mesh_idx);
//    if(!mesh1||mesh1===undefined) alert('00199816551413221: CollisionDetection');
//    const mesh2 = Mesh_buffer_get_mesh_byidx(collision_data2.mesh_idx);
//    if(!mesh2||mesh2===undefined) alert('00199816551413222: CollisionDetection');

//    const u = Physics_2D_get_velocity_xy_from_position(mesh1.physics.idx);
//    collision_data.ux = Abs(u.x);
//    collision_data.uy = Abs(u.y);

//    if(u.x === 0 && u.y === 0) return collision_data;


//    // Cache values
//    const pos1 = mesh1.geom.pos, dim1 = mesh1.geom.dim;
//    const pos2 = mesh2.geom.pos, dim2 = mesh2.geom.dim;

//    /**
//     * Ray origin{x,y} : Center position
//     * point directio{x,y} : position+velocity
//     */
//    const mesh1_center_x = pos1[0]+dim1[0];
//    const mesh1_center_y = pos1[1]+dim1[1];
//    const point = {
//       x:mesh1_center_x,
//       y:mesh1_center_y,
//       dir_x:mesh1_center_x+Abs(u.x),
//       dir_y:mesh1_center_y+Abs(u.y),
//    };
//    const inflated = {
//       l:pos2[0]-dim1[0],
//       r:pos2[0]+dim2[0]*2+dim1[0],
//       t:pos2[1]-dim1[1],
//       b:pos2[1]+dim2[1]*2+dim1[1],
//    };

//    // Calculate the distances of the colliders point p with both edges of both axis of the collidee.
//    // Then devide by the new point p (velocity added) to get a percentage valueof that distance.
//    let near_dx = ((inflated.l - point.x) / point.dir_x)+1;
//    let far_dx  = ((inflated.r - point.x) / point.dir_x)-1;
//    let near_dy = ((inflated.t - point.y) / point.dir_y)+1;
//    let far_dy  = ((inflated.b - point.y) / point.dir_y)-1;
//    collision_data.near_dx  = near_dx ;
//    collision_data.far_dx   = far_dx  ;
//    collision_data.near_dy  = near_dy ;
//    collision_data.far_dy   = far_dy  ;


//    /**
//     * In order a collision to happen, both far_ distances(fx and fy) must be  positive
//     * and both near_ distances must be negative. Any other case there is no collision.
//     * Bellow we simply multiply the signs. The only way to have a collision is to:
//     * get a possitive mult result for nx-fx, that is only if both have opposite signs,
//     * if the signs are both negative or possitive then we have no collision and we return.
//     * Same for y-axis 
//     */
//    // if(near_dx*far_dx > 0 || near_dy*far_dy > 0) return collision;
//    // if(near_dx*far_dx > 0 || near_dy*far_dy > 0) return collision;
   
   
//    // Calculate collision time
//    const near_t = Max(near_dx, near_dy);
//    const far_t  = Min(far_dx, far_dy);
   
   
//    // Calculate constact point
//    const penetration_depth = {
//       // Calculate penetration base on collider direction, to get the distance 
//       // x: -(point.x + point.dir_x) * 0.5,
//       // y: -(point.y + point.dir_y) * 0.5,
//       x: 0,
//       y: 0,
//    };
   
//    // if((near_dx * far_dx > 0) && (near_dy * far_dy < 0)) {
//    if((near_dx * far_dx < 0) && (near_dy * far_dy < 0)) {

//       if((near_dx > near_dy)) {
         
//          collision_data.normal_y = 0;
//          penetration_depth.y = 0;
//          if(near_dx > 0) {
//             // penetration_depth.x *= near_dx;
//             penetration_depth.x = u.x;
//             collision_data.normal_x = 1;
//             // console.log('X', penetration_depth.x.toFixed(2), penetration_depth.y.toFixed(2))
//          }
//          else if(near_dx < 0) {
//             penetration_depth.x = u.x;
//             collision_data.normal_x = -1;
//             // console.log('-X', penetration_depth.x.toFixed(2), penetration_depth.y.toFixed(2))
//          }
//       }
//       if((near_dy * far_dy > 0) && (near_dx * far_dx < 0)) {
         
//          collision_data.normal_x = 0;
//          penetration_depth.x = 0;
//          if(near_dy > 0) {
//             penetration_depth.y = 2;
//             collision_data.normal_y = 1;
//             // console.log('Y', penetration_depth.x.toFixed(2), penetration_depth.y.toFixed(2))
//          }
//          else if(near_dy < 0) {
//             penetration_depth.y = -2;
//             collision_data.normal_y = -1;
//             // console.log('-Y', penetration_depth.x.toFixed(2), penetration_depth.y.toFixed(2))
//          }
//       }
//    }
   
  
   
   
//    // console.log(u.x.toFixed(2), u.y.toFixed(2), penetration_depth.y.toFixed(2))
//    // if(penetration_depth.y < -40)
//    //    console.log(penetration_depth.y.toFixed(2))


//    collision_data.penetration_depth_x = penetration_depth.x;
//    collision_data.penetration_depth_y = penetration_depth.y;
//    collision_data.near_t  = near_t ;
//    collision_data.far_t   = far_t  ;
//    // console.log(collision_data.penetration_depth_x.toFixed(2), collision_data.penetration_depth_y.toFixed(2))

//    return collision_data;

   
   
//    // // Calculate normal vector
//    // const normal_v = {x:0, y:0}
//    // if(near_dx > near_dy) {
//    //    if(point.dir_x < 0) { 
//    //       normal_v.x = 1;
//    //       normal_v.y = 0;
//    //    }
//    //    else {
//    //       normal_v.x = -1;
//    //       normal_v.y =  0;
//    //    }
//    // }
//    // else if(near_dx < near_dy) {
//    //    if(point.dir_y < 0) { 
//    //       normal_v.x = 0;
//    //       normal_v.y = 1;
//    //    }
//    //    else {
//    //       normal_v.x = 0;
//    //       normal_v.y = 1;
//    //    }
//    // }



// }
/**SAVE */
// export function Swept_AABB(collision_group_idx, collision_idx1, collision_idx2){

//    /**
//     * INFO: {
//     *    nx:   near in x axis, 
//     *    fx:   far in x axis, 
//     *    collider:   A point, striped of its size
//     *    collidee:   Inflated by the size of collider
//     * }
//     * X-AXIS: Approaching from the left side
//     * If nx = 1: this is half the distance between origin(the main panel) and mesh2's left edge
//     * If nx = 0: exactly at the left edge of mesh 2(contact point: at nx=0)
//     * So the time percentage for a collision_data (approaching from left) is 1 at half distance and 0 at contact point
//     * X-AXIS: Approaching from the right side
//     * If fx = 0: exactly at the right edge of mesh 2 (contact point:at fx=0)
//     * 
//     * Approaching side
//     * If fx < 0 (negative), then collider is on the right side of collidee, approaching from the right
//     * If nx > 0 (positive), then collider is on the left side of collidee, approaching from the left
//     * 
//     * So: 
//     *    if +nx and +fx we are on the left
//     *    if -nx and -fx we are on the right
//     *    else -nx +fx we collide
//     * In math: if(nx*fx === positive) NO collision
//     *          if(nx*fx === negative) COLLISION
//     * 
//     * 
//     * # Contact point and penetration
//     * (only approaching from the left):
//     * The contact point is 0 on the collision, positive before the collision and negative in penetration
//     * Contact point measures half the distance in pixels, from center of collider to the left side of the collidee
//     * 
//     */


//    const collision_data1 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx1];
//    const collision_data2 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx2];

//    const mesh1 = Mesh_buffer_get_mesh_byidx(collision_data1.mesh_idx);
//    const mesh2 = Mesh_buffer_get_mesh_byidx(collision_data2.mesh_idx);

//    const u = Physics_2D_get_velocity_xy_from_position(mesh1.physics.idx);



//    if(u.x === 0 && u.y === 0) return collision_data;


//    // Cache values
//    const pos1 = mesh1.geom.pos, dim1 = mesh1.geom.dim;
//    const pos2 = mesh2.geom.pos, dim2 = mesh2.geom.dim;

//    /**
//     * Ray origin{x,y} : Center position
//     * point directio{x,y} : position+velocity
//     */
//    const mesh1_center_x = pos1[0]+dim1[0];
//    const mesh1_center_y = pos1[1]+dim1[1];
//    const point = {
//       x:mesh1_center_x,
//       y:mesh1_center_y,
//       dir_x:mesh1_center_x+Abs(u.x),
//       dir_y:mesh1_center_y+Abs(u.y),
//    };
//    const offset = 4;
//    const inflated = {
//       l:pos2[0]-dim1[0] - offset,
//       r:pos2[0]+dim2[0]*2+dim1[0] + offset,
//       t:pos2[1]-dim1[1] - offset,
//       b:pos2[1]+dim2[1]*2+dim1[1] + offset,
//    };

//    // Calculate the distances of the colliders point p with both edges of both axis of the collidee.
//    // Then devide by the new point p (velocity added) to get a percentage valueof that distance.
//    let near_dx = (inflated.l - point.x) / point.dir_x;
//    let far_dx  = (inflated.r - point.x) / point.dir_x;
//    let near_dy = (inflated.t - point.y) / point.dir_y;
//    let far_dy  = (inflated.b - point.y) / point.dir_y;



//    /**
//     * In order a collision to happen, both far_ distances(fx and fy) must be  positive
//     * and both near_ distances must be negative. Any other case there is no collision.
//     * Bellow we simply multiply the signs. The only way to have a collision is to:
//     * get a possitive mult result for nx-fx, that is only if both have opposite signs,
//     * if the signs are both negative or possitive then we have no collision and we return.
//     * Same for y-axis 
//     */
//    // if(near_dx*far_dx > 0 || near_dy*far_dy > 0) return collision;




//    // Calculate constact point
//    const penetration_depth = {
//       // Calculate penetration base on collider direction, to get the distance 
//       x: -(point.x + point.dir_x) * 0.5,
//       y: -(point.y + point.dir_y) * 0.5,
//       // x: (u.x < 0) ?  -(point.x + point.dir_x) * 0.5 * far_dx : -(point.x + point.dir_x) * .5 * near_dx,
//       // y: (u.y < 0) ?  -(point.y + point.dir_y) * 0.5 * far_dy : -(point.y + point.dir_y) * .5 * near_dy,
//       // x: (u.x < 0) ?  -(point.x + point.dir_x) * 0.5 * far_dx : (point.x + point.dir_x) * .5 * near_dx,
//       // y: (u.y < 0) ?  -(point.y + point.dir_y) * 0.5 * far_dy : (point.y + point.dir_y) * .5 * near_dy,
//       // x: -(point.x + point.dir_x) * .5 * near_dx,
//       // y: -(point.y + point.dir_y) * .5 * near_dy,
//       // x: -(point.dir_x*near_t),
//       // y: -(point.dir_y*near_t),
//       // x: -(u.x*near_t),
//       // y: -(u.y*near_t),
//       // x: u.x,
//       // y: u.y,
//    };

//    if(near_dx > near_dy && far_dx > far_dy) {
//       // console.log('X', near_dx.toFixed(2), near_dy.toFixed(2))
//       if(u.x > 0) {
//          penetration_depth.x *= near_dx;
//          penetration_depth.y = 0;
//       }
//       else { // Case x velocity is 0
//          penetration_depth.x = 0;
//          penetration_depth.y = 0;
//       }
//    }
//    else if(near_dx < near_dy && far_dx < far_dy) {
//       // console.log('-X', near_dx.toFixed(2), near_dy.toFixed(2))
//       if(u.x < 0) {
//          penetration_depth.x *= far_dx;
//          penetration_depth.y = 0;
//       }
//       else { // Case x velocity is 0
//          penetration_depth.x = 0;
//          penetration_depth.y = 0;
//       }
//    }

   
      
//    // Calculate collision time
//    const near_t = Max(near_dx, near_dy);
//    const far_t  = Min(far_dx, far_dy);


//    collision_data.penetration_depth_x = penetration_depth.x;
//    collision_data.penetration_depth_y = penetration_depth.y;
//    // collision_data.normal_x = normal_v.x;
//    // collision_data.normal_y = normal_v.y;
//    collision_data.normal_x = 0;
//    collision_data.normal_y = 0;
//    collision_data.near_dx  = near_dx ;
//    collision_data.far_dx   = far_dx  ;
//    collision_data.near_dy  = near_dy ;
//    collision_data.far_dy   = far_dy  ;
//    collision_data.near_t  = near_t ;
//    collision_data.far_t   = far_t  ;
//    collision_data.ux = u.x;
//    collision_data.uy = u.y;
//    collision_data.time = 1;

//    return collision_data;


// }

/** Check a target mesh with all the other collisions of the group */
function Penetration_check_group(target_collision_idx, ) {}

function Intersection_point_rect(px, py, l, r, t, b){

   if(px > l && px < r && py > t && py < b)
      return true;
   
   return false;
}

/** Finds the 'moving' mesh from the collision meshes group.  */
export function Physics2D_collision_detection_find_collider_from_group(group_idx) {

   const colliding_meshes = _collision_storage_buffer.buffer[group_idx].data;

   for(let i = 0; i <= colliding_meshes.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(colliding_meshes.buffer[i].mesh_idx);
      const u = Physics_2D_get_velocity_xy_from_position(mesh.physics.idx);

      if(u.x !== 0 || u.y !== 0) {
         return colliding_meshes.buffer[i].coll_idx;
      }
   }

   return INT_NULL;

}

/** Recursive collision detection ammongst all meshes in a physics group */
export function Physics2D_collision_detection_one_with_all(group_idx, collider_idx) {

   const colliding_meshes = _collision_storage_buffer.buffer[group_idx].data;
   
   for(let i = 0; i <= colliding_meshes.boundary; i++) {
      
      const collidee_idx = colliding_meshes.buffer[i].coll_idx;
      if(i === collider_idx || collidee_idx === INT_NULL) continue; // Skip checking if ith mesh is the collider mesh OR a mesh has already been checked
      
      const collision_data =  Penetration_check(group_idx, collider_idx, collidee_idx);
      if(collision_data.time) {
         
         const collider_mesh = Mesh_buffer_get_mesh_byidx(colliding_meshes.buffer[collider_idx].mesh_idx);
         Collision_resolver_obstruct_collider(collision_data, collider_mesh)
            
      }
   }

}

/** Recursive collision detection ammongst all meshes in a physics group 
 * // TODO: We need a 'precursor' function to cache data and pass them for the recursion functionality. OR WE DONT??
*/
let recur_depth = 0;
export function Physics2D_collision_detection_all_with_all(group_idx, collider_idx) {
   const colliding_meshes = _collision_storage_buffer.buffer[group_idx].data;

   let debug_info = null;

   for(let i = 0; i <= colliding_meshes.boundary; i++) {
      
      const collidee_idx = colliding_meshes.buffer[i].coll_idx;
      if(i === collider_idx || collidee_idx === INT_NULL) continue; // Skip checking if ith mesh is the collider mesh OR a mesh has already been checked
      
      const collision_data =  Penetration_check(group_idx, collider_idx, collidee_idx);
      // const collision_data =  Swept_AABB(group_idx, collider_idx, collidee_idx);
      if(collision_data.time) {

         const collidee_mesh = Mesh_buffer_get_mesh_byidx(colliding_meshes.buffer[collidee_idx].mesh_idx);
         Collision_resolver_move_collidee(collision_data, collidee_mesh);
         
         recur_depth++;
         colliding_meshes.buffer[collider_idx].coll_idx = INT_NULL; // Remove the detected collided mesh for further recursion collision detections
         Physics2D_collision_detection_all_with_all(group_idx, collidee_idx); // Check collisions between collidee and remaining meshes
         colliding_meshes.buffer[collider_idx].coll_idx = collider_idx; // Re-add the checked for the remaining collision detections of current recursion level
         recur_depth--;
         debug_info = collision_data;
      }
   }
   
   return debug_info;
}
export function Physics2D_collision_detection_all_with_all_with_obstructions(group_idx, collider_idx ) {

   const colliding_meshes = _collision_storage_buffer.buffer[group_idx].data;

   for(let i = 0; i <= colliding_meshes.boundary; i++) {

      const collidee_idx = colliding_meshes.buffer[i].coll_idx;
      if(i === collider_idx || collidee_idx === INT_NULL) continue; // Skip checking if ith mesh is the collider mesh OR a mesh has already been checked
      
      
      const collision_data =  Penetration_check(group_idx, collider_idx, collidee_idx);
      // const collision_data =  Swept_AABB(group_idx, collider_idx, collidee_idx);
      if(collision_data.time) {
         
         const collidee_mesh = Mesh_buffer_get_mesh_byidx(colliding_meshes.buffer[collidee_idx].mesh_idx);
         const is_movable = Physics2D_flags_get_is_movable(group_idx, collidee_idx);
         // const is_obstracted = Physics2D_flags_get_is_obstructed(group_idx, collidee_idx);
            
       
         // if(is_movable && !is_obstracted) {
         if(is_movable) {
            Collision_resolver_move_collidee(collision_data, collidee_mesh);
         }
         else {
            const collider_mesh = Mesh_buffer_get_mesh_byidx(colliding_meshes.buffer[collider_idx].mesh_idx);
            Collision_resolver_obstruct_collider(collision_data, collider_mesh);
            // Physics2D_flags_set_is_obstructed(group_idx, collider_idx, true);
            return collision_data;
         }
         
         colliding_meshes.buffer[collider_idx].coll_idx = INT_NULL; // Remove the detected collided mesh for further recursion collision detections
         const ret = Physics2D_collision_detection_all_with_all_with_obstructions(group_idx, collidee_idx); // Check collisions between collidee and remaining meshes
         colliding_meshes.buffer[collider_idx].coll_idx = collider_idx; // Re-add the checked for the remaining collision detections of current recursion level
         
         if(ret !== null){
            const collider_mesh = Mesh_buffer_get_mesh_byidx(colliding_meshes.buffer[collider_idx].mesh_idx);
            // console.log(collider_mesh.name, collidee_mesh.name);
            Collision_resolver_obstruct_collider(collision_data, collider_mesh);
            // Physics2D_flags_set_is_obstructed(group_idx, collider_idx, false);
            // Collision_resolver_obstruct_collider(ret, collider_mesh);
            // return collision_data;
         }
      }
   }

   return null;
}

// TODO: move resolve functions to resolve...js file
/** */
function Collision_resolver_move_collider(collision_data, collider_mesh) {

   Mesh_add_and_copy_wpos_xy(collider_mesh, collision_data.penetration_depth_x, collision_data.penetration_depth_y);
   Physics2D_update_pos_xy(collider_mesh.physics.idx, collider_mesh.geom.pos[0], collider_mesh.geom.pos[1]);
}
/** */
function Collision_resolver_move_collidee(collision_data, collidee_mesh) {

   Mesh_add_and_copy_wpos_xy(collidee_mesh, collision_data.penetration_depth_x, collision_data.penetration_depth_y);
   Physics2D_update_pos_xy(collidee_mesh.physics.idx, collidee_mesh.geom.pos[0], collidee_mesh.geom.pos[1]);

}
/** */
function Collision_resolver_obstruct_collider(collision_data, collider_mesh) {

   Mesh_add_and_copy_wpos_xy(collider_mesh, -collision_data.penetration_depth_x, -collision_data.penetration_depth_y);
   Physics2D_update_pos_xy(collider_mesh.physics.idx, collider_mesh.geom.pos[0], collider_mesh.geom.pos[1]);

}





/********************************************************************************************************************/
// Flags Getters-Setters
export function Physics2D_flags_get_is_movable(group_idx, coll_idx) { 
   return _collision_storage_buffer.buffer[group_idx].data.buffer[coll_idx].flags & PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE;
}
export function Physics2D_flags_get_is_obstructed(group_idx, coll_idx) { 
   return _collision_storage_buffer.buffer[group_idx].data.buffer[coll_idx].flags & PHYSICS2D_COLLISION_FLAGS.IS_OBSTRUCTED;
}
export function Physics2D_flags_set_is_movable(group_idx, coll_idx, flag=true) { 
   if(flag) _collision_storage_buffer.buffer[group_idx].data.buffer[coll_idx].flags |= PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE;
   else _collision_storage_buffer.buffer[group_idx].data.buffer[coll_idx].flags &= ~PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE;
}
export function Physics2D_flags_set_is_obstructed(group_idx, coll_idx, flag=true) { 
   if(flag) _collision_storage_buffer.buffer[group_idx].data.buffer[coll_idx].flags |= PHYSICS2D_COLLISION_FLAGS.IS_OBSTRUCTED;
   else _collision_storage_buffer.buffer[group_idx].data.buffer[coll_idx].flags &= ~PHYSICS2D_COLLISION_FLAGS.IS_OBSTRUCTED;
}
// export function Physics2D_flags_get() {  }
// export function Physics2D_flags_get() {  }
// export function Physics2D_flags_get() {  }






























/**SAVE */
// export function Swept_AABB(collision_group_idx, collision_idx1, collision_idx2){

//    const collision_data1 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx1];
//    const collision_data2 = _collision_storage_buffer.buffer[collision_group_idx].data.buffer[collision_idx2];

//    const mesh1 = Mesh_buffer_get_mesh_byidx(collision_data1.mesh_idx);
//    if(!mesh1||mesh1===undefined) alert('00199816551413221: CollisionDetection');
//    const mesh2 = Mesh_buffer_get_mesh_byidx(collision_data2.mesh_idx);
//    if(!mesh2||mesh2===undefined) alert('00199816551413222: CollisionDetection');

//    const u = Physics_2D_get_velocity_xy_from_position(mesh1.physics.idx);

//    if(u.x === 0 && u.y === 0) return false;

//    // Cache values
//    const pos1 = mesh1.geom.pos, dim1 = mesh1.geom.dim;
//    const pos2 = mesh2.geom.pos, dim2 = mesh2.geom.dim;

//    const bb1 = {
//       // l:pos1[0]+u.x,
//       // r:pos1[0]+u.x+dim1[0]*2,
//       // t:pos1[1]+u.y,
//       // b:pos1[1]+u.y+dim1[1]*2,
//       l:pos1[0],
//       r:pos1[0]+dim1[0]*2,
//       t:pos1[1],
//       b:pos1[1]+dim1[1]*2,
//    };
//    const inflated = {
//       l:pos2[0],
//       r:pos2[0]+dim2[0]*2,
//       t:pos2[1],
//       b:pos2[1]+dim2[1]*2,
//    };

//    let entry_x = 0, exit_x = 0;
//    if(u.x > 0) { // from left
//       entry_x = inflated.l - bb1.r;
//       exit_x = inflated.r - bb1.l;
//    }
//    else if(u.x < 0) { // from right
//       entry_x = inflated.r - bb1.l;
//       exit_x = inflated.l - bb1.r;
//    }
//    let entry_y = 0, exit_y = 0;
//    if(u.y > 0) { // from top
//       entry_y = inflated.t - bb1.b;
//       exit_y = inflated.b - bb1.t;
//    }
//    else if(u.y < 0) { // from bottom
//       entry_y = inflated.b - bb1.t;
//       exit_y = inflated.t - bb1.b;
//    }

      
//    let u_x_entry  = (u.x === 0) ? -Infinity : u.x;
//    let u_x_exit   = (u.x === 0) ?  Infinity : u.x;
//    let u_y_entry  = (u.y === 0) ? -Infinity : u.y;
//    let u_y_exit   = (u.y === 0) ?  Infinity : u.y;
//    entry_x  /= u_x_entry;
//    exit_x   /= u_x_exit;
//    entry_y  /= u_y_entry;
//    exit_y   /= u_y_exit;

//    // // let u_x = (u.x === 0) ? -Infinity : u.x;
//    // entry_x /= (u.x === 0) ? -Infinity : u.x;
//    // exit_x /= (u.x === 0) ? Infinity : u.x;;
//    // // let u_y = (u.y === 0) ? Infinity : u.y;
//    // entry_y /= (u.y === 0) ? -Infinity : u.y;
//    // exit_y /= (u.y === 0) ? Infinity : u.y;

//    // const entry_time = (Abs(entry_x) > Abs(entry_y)) ? entry_x : entry_y;
//    // const exit_time = (Abs(exit_x) < Abs(exit_y)) ? exit_x : exit_y;
//    // const entry_time = ((entry_x) > (entry_y)) ? entry_x : entry_y;
//    const exit_time = ((exit_x) < (exit_y)) ? exit_x : exit_y;
//    const entry_time = entry_x;
//    const collision = entry_x < exit_y ? true : false;

//    // if(entry_time > -1 && entry_time < 1) {
//    if(collision) {

//       console.log('entry_time', entry_time.toFixed(2), );
//             return {
//          is_true:true,
//          x:u.x,
//          y:0,
//       };
//    }
//    // if(entry_time > 0 && entry_time < 1) {
//    //    // console.log('entry_time', entry_time.toFixed(2), 'entry_x', entry_x.toFixed(2), 'entry_y', entry_y.toFixed(2), );
//    //    console.log('entry_time', entry_time.toFixed(2), );

//    //    let ux = u.x;
//    //    u.x = 0
//    //    return {
//    //       is_true:true,
//    //       // x:u.x*(entry_time),
//    //       x:ux,
//    //       // y:0,
//    //       // x:u.x*Abs(entry_time),
//    //       // y:0,
//    //       // x:u.x*Abs(entry_x),
//    //       y:0,
//    //    };
//    // }
   
//    // if(entry_x > -1 && entry_x < 1) {

//    //    console.log('u.x', Floor(u.x), 'entry_x', Floor(entry_x), 'exit_x', Floor(exit_x));
//    // }
//    // if(entry_x > -1 && entry_x < 1) {

//    //    console.log('u.y', Floor(u.y), 'entry_y', Floor(entry_y), 'exit_x', Floor(exit_y));
//    // }


   
//    // // Cache values
//    // let pos1_x = mesh1.geom.pos[0], pos1_y = mesh1.geom.pos[1], dim1 = mesh1.geom.dim;
//    // const pos2 = mesh2.geom.pos, dim2 = mesh2.geom.dim;
   
//    // // pos1_x += u.x;
//    // // pos1_y += u.y;
   
//    // let hor_distance = dim1[0] + dim2[0];
//    // let vert_distance = dim1[1] + dim2[1];
   
//    // const center1_x = pos1_x+dim1[0], center1_y = pos1_y+dim1[1];
//    // const center2_x = pos2[0]+dim2[0], center2_y = pos2[1]+dim2[1];
   
   
//    // const d_x = Abs(center1_x - center2_x)-2;
//    // const d_y = Abs(center1_y - center2_y)-2;
   
   
//    // // Chech penetration
//    // if(d_x < hor_distance && d_y < vert_distance) {
      
      
//    //    let overlap_x = hor_distance - d_x;
//    //    let overlap_y = vert_distance - d_y;
//    //    const penetration = {x:0, y:0};
//    //    // const u = Physics_2D_get_velocity_xy_from_position(mesh1.physics.idx);

//    //    // if(Abs(u.x) > dim2[0]) { overlap_x /= Abs(overlap_x); console.log('u.x', Clamp(u.x), dim2[0], overlap_x); }
//    //    // if(Abs(u.y) > dim2[1]) { overlap_y /= Abs(overlap_y); console.log('u.y', Clamp(u.y), dim2[1], overlap_y); }
//    //    // if(Abs(u.x) > dim2[0]) { overlap_x /= Abs(d_x); console.log('u.x', Clamp(u.x), dim2[0], d_x); }
//    //    // if(Abs(u.y) > dim2[1]) { overlap_y /= Abs(d_y); console.log('u.y', Clamp(u.y), dim2[1], d_y); }

//    //    if(overlap_x < overlap_y) {
//    //       // resolve on X
//    //       if (center1_x < center2_x) 
//    //          penetration.x = overlap_x; // push right
//    //       else if (center1_x > center2_x) 
//    //          penetration.x = -overlap_x; // push left
//    //    }
//    //    else if(overlap_y < overlap_x) {
//    //       // resolve on Y
//    //       if (center1_y < center2_y) 
//    //          penetration.y = overlap_y; // push down
//    //       else
//    //          penetration.y = -overlap_y; // push upp
//    //    }



//       // return {
//       //    is_true:true,
//       //    x:0,
//       //    y:0,
//       // };
//    // }


//    // return false;
   
// }
/** */
/**SAVE-OLD check with AABB */
// const bb1 = {
//    l:pos1[0]+u.x,
//    r:pos1[0]+u.x+dim1[0]*2,
//    t:pos1[1]+u.y,
//    b:pos1[1]+u.y+dim1[1]*2,
// };
// const inflated = {
//    l:pos2[0],
//    r:pos2[0]+dim2[0]*2,
//    t:pos2[1],
//    b:pos2[1]+dim2[1]*2,
// };
   
// Find contact edge //
// We need an offset to avoid locking penetration of the two objects 
// const offset_x = 2*u.x;
// const offset_y = 2*u.y;
// if((bb1.t-offset_y >= inflated.b && bb1.b > inflated.b) || // Aproach from bottom
// (bb1.b-offset_y <= inflated.t && bb1.t < inflated.t)) { // Aproach from top
//    u.x = 0; 
// }
// else if( (bb1.r-offset_x <= inflated.l && bb1.l < inflated.l) || // Aproach from left
// (bb1.l-offset_x >= inflated.r && bb1.r > inflated.r)) { // Aproach from right
//    u.y = 0; 
// }

// // Find contact edge //
// const offset_x = 2*u.x;
// const offset_y = 2*u.y;
// // Aproach from bottom
// if(bb1.t-offset_y > inflated.b && bb1.b > inflated.b) {u.x = 0;}
// // Aproach from top
// if(bb1.b-offset_y < inflated.t && bb1.t < inflated.t) {u.x = 0;}
// // Aproach from rigth
// if(bb1.l-offset_x > inflated.r && bb1.r > inflated.r) {u.y = 0;}
// // Aproach from left
// if(bb1.r-offset_x < inflated.l && bb1.l < inflated.l) {u.y = 0;}
// if(u.y < 0) {
// }
// else if(u.y > 0) {
// }
/**SAVE */
// if(u.y < 0) {
//    if(bb1.t-offset_y >= inflated.b && bb1.b > inflated.b) {u.x = 0;}
// }
// // Aproach from top
// else if(u.y > 0) {
//    if(bb1.b-offset_y <= inflated.t && bb1.t < inflated.t) {u.x = 0;}
// }

// // Aproach from bottom
// if(u.x < 0) {
//    if(bb1.l-offset_x >= inflated.r && bb1.r > inflated.r) {u.y = 0;}
// }
// // Aproach from top
// else if(u.x > 0) {
//    if(bb1.r-offset_x <= inflated.l && bb1.l < inflated.l) {u.y = 0;}
// }
/** */
// Previous code

/** */
// const bb1 = {
//    l:pos1[0],
//    r:pos1[0]+dim1[0]*2,
//    t:pos1[1],
//    b:pos1[1]+dim1[1]*2,
// };
// const inflated = {
//    l:pos2[0],
//    r:pos2[0]+dim2[0]*2,
//    t:pos2[1],
//    b:pos2[1]+dim2[1]*2,
// };
// if(bb1.l <= inflated.r && bb1.r >= inflated.l) {
//    if(bb1.t <= inflated.b && bb1.b >= inflated.t) {
//    }
// }
/** */
// const n = (d_x / d_y / impact_mag);