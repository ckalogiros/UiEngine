"use strict";

import { Color_hsv_to_rgb_calibrated } from "../../../Engine/Drawables/Material/Colors.js";
import { Mesh_add_and_copy_wpos_x, Mesh_add_and_copy_wpos_y, Mesh_set_and_copy_wpos_y } from "../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Create_rect_mesh } from "../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Style_rect_default_properties, Widget_gfx_ready_enable } from "../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Widget_render } from "../../../Engine/Drawables/Widgets/Helpers/WidgetRender.js";
import { Time_intervals_create } from "../../../Engine/Timers/TimeIntervals.js";
import { Gl_add_wpos_y, Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Linear_interpolation, Normalize } from "../../../Helpers/Math/MathFunctions.js";
import { Abs, Magnitude } from "../../../Helpers/Math/MathOperations.js";





const spring_physics = {

   rest_length:0,
   stifness:.5,
   damp:.5,
   length_pos_x:0,
   length_pos_y:0,
};

const radius = 20;





export function Spring_physics(x=100, y=10) {

   // Bind Keyboard Controls
   // Input_keyboard_bind_keydown_callback(Keyboard_input_keydown);
   // Input_keyboard_bind_keyup_callback(Keyboard_input_keyup);

   const panel = Create_rect_mesh(Style_rect_default_properties({
      is_root:ROOT_WIDGETS.CREATE_ROOT, 
      pad:[5, 10], 
      pos:[x, y, 0], dim:[300, 400],
      col:Color_hsv_to_rgb_calibrated(.0, .0, 1., 1., .2, .0), 
      name:'GamePanel', 
      layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF,
   }));

   Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect: 10, listener:{type:LISTEN_EVENT_TYPES.MOVE}}); 
   
   const pad = 10;
   for(let i=0; i<10; i++) {
      
      y+=pad;
      spring_physics.rest_length += pad;
      const spring_object = Create_rect_mesh(Style_rect_default_properties({
         pos:[x, y, 0], dim:[radius, radius],
         col:Color_hsv_to_rgb_calibrated(.4, 1.0, 1., 1., .7, .0), 
         name:'spring_object', 
         // layout:LAYOUT.VERTICAL,
      }));
      Widget_gfx_ready_enable({mesh:spring_object, enable_sdf_rect: radius, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); 
      y+=radius*2;
      spring_physics.rest_length += radius*2;
      
      panel.AddItem(spring_object);
      console.log(spring_object.geom.pos[1])
   }
   

   console.log('spring_physics', spring_physics);




   panel.GenGfxCtx();
   Widget_render(panel);


   // game_struct.player = Create_player(200, 790);
   const params = {
      panel:panel,

   };
   Time_intervals_create(200, 'Spring Physics', TIME_INTERVAL_REPEAT_ALWAYS, Update_spring_physics, params);

   console.log(panel.children.buffer)

}


let move_y_dir = 1; // Direction
let accum_move_y = 0; // store the acumulated moving distance
const accel = .5;
const speed = 2;
function Update_spring_physics(params){

   const panel = params.params.panel;

   // Move the last spring object
   const last_spring_object = panel.children.buffer[panel.children.boundary];
   // Calculate velocity
   const vel = accel * speed * move_y_dir;
   accum_move_y += vel;
   Mesh_add_and_copy_wpos_y(last_spring_object, -vel);
   
   if(accum_move_y > 100) move_y_dir = -1;
   else if(accum_move_y < -100) move_y_dir = 1;
   
   const new_pos_x = last_spring_object.geom.pos[0];
   const new_pos_y = last_spring_object.geom.pos[1];
   const anchor = 0;

   for(let i=0; i <= panel.children.boundary-1; i++) {
      
      const spring_object = panel.children.buffer[i];
      
      let force_y = spring_object.geom.pos[1] * .1;
      force_y -= anchor;
      const magnitude = Abs(Magnitude(0, force_y-spring_physics.rest_length));// * spring_physics.stifness;
      // const magnitude = Abs(Magnitude(0, force_y-100));// * spring_physics.stifness;
      // force_y = Normalize(-anchor, spring_physics.rest_length, force_y);
      force_y = Normalize(-0, spring_physics.rest_length, force_y);
      force_y *= -magnitude;
      if(i===8) console.log(force_y.toFixed(3))

      // const v = 
      
      // Mesh_add_and_copy_wpos_y(spring_object, force_y);
      // Mesh_set_and_copy_wpos_y(spring_object, force_y* move_y_dir);
      // Gl_add_wpos_y(spring_object.gfx, force_y*vel);
      Gl_add_wpos_y(spring_object.gfx, force_y);
      // Gl_set_wpos_y(spring_object.gfx, force_y);
      // console.log(force_y)
      // console.log(magnitude)

   }
   // // for(let i=panel.children.boundary-1; i >= 0; i--) {
   // for(let i=0; i <= panel.children.boundary-1; i++) {
      
   //    const spring_object = panel.children.buffer[i];
      
   //    // let force_y = -(spring_object.geom.pos[1] - new_pos_y) * 1;
   //    // let force_y = -(new_pos_y - spring_object.geom.pos[1]) * .1;
   //    let force_y = spring_object.geom.pos[1];
   //    // let force_y = accum_move_y;
   //    force_y = Normalize(400, 100, force_y);
   //    // force_y = Normalize(0, 1, force_y);
   //    // force_y = Linear_interpolation(0, 100, force_y);
   //    const magnitude = Magnitude(0, force_y)// * spring_physics.stifness;
   //    force_y *= -magnitude;
   //    // force_y *= -magnitude;
      
   //    // Mesh_add_and_copy_wpos_y(spring_object, force_y);
   //    // Gl_add_wpos_y(spring_object.gfx, force_y*vel);
   //    Gl_add_wpos_y(spring_object.gfx, force_y);
   //    // console.log(magnitude)
   //    // console.log(force_y)
   //    // console.log(force_x)
   //    // console.log(force_y)

   // }

   // console.log(last_spring_object.geom.pos[1], spring_physics.rest_length)
}