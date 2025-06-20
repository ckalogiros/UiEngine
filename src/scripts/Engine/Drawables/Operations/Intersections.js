"use strict";



/**
 * @param {*} p x,y coords. 
 * @param {*} lrtb 2D rectangle. left, right, top, bottom 
 * @returns True for collision. 
 */
export function Intersection_point_rect(px, py, l, r, t, b){

   if(px > l && px < r && py > t && py < b)
      return true;
   
   return false;
}



export function Collision_PointTriangle(p, t){

   // const base = t[0][1] - t[0][0];
   // const height = t[1][1] - t[1][0];
   // const y = height - p[1];
   // const x = (base/2) * y;

   // if(p[0] > t[0][0]-x && p[0] < t[0][1]+x && p[1] > t[1][0] && p[1] < t[1][1]){
   //    console.log('Triangle Collision!')
   //    return true;
   // }
   // return false;
}



export function Check_intersection_point_rect(pos, dim, point, margin = [0,0]){

   const l = pos[0]-margin[0];
   const r = pos[0]+dim[0]*2+margin[0];
   const t = pos[1]-margin[1];
   const b = pos[1]+dim[1]*2+margin[1];

      // return b;
   return Intersection_point_rect(point.x, point.y, l, r, t, b);
}