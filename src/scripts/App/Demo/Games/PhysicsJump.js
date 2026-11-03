"use strict";

import { Input_keyboard_bind_keydown_callback, Input_keyboard_bind_keyup_callback } from "../../../Engine/Controls/Input/Keyboard.js";
import { Mesh_unif_add_vb_root_wposx, Mesh_unif_add_vb_root_wposy, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../../Engine/Core/MeshUniformsBuffer.js";
import { Color_hsv_to_rgb_calibrated } from "../../../Engine/Drawables/Material/Colors.js";
import { Mesh_add_and_copy_wpos_x, Mesh_add_and_copy_wpos_y, Mesh_add_wpos_y, Mesh_set_and_copy_wpos_y, Mesh_set_wpos_y } from "../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Create_rect_mesh } from "../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Style_rect_default_properties, Widget_gfx_ready_enable } from "../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Widget_render } from "../../../Engine/Drawables/Widgets/Helpers/WidgetRender.js";
import { Time_get_delta_time_in_ms } from "../../../Engine/Timers/Time.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../../Engine/Timers/TimeIntervals.js";
import { GetSign } from "../../../Helpers/Helpers.js";
import { Abs } from "../../../Helpers/Math/MathOperations.js";
import { Ball_get_pos_xy } from "./Arkanoid/Ball.js";
import { Physics } from "./Arkanoid/HelperClasses.js";



let bit_mask = 0x1;
const SPACE = bit_mask;
const LEFT = bit_mask<<=0x1;
const UP = bit_mask<<=0x1;
const RIGHT = bit_mask<<=0x1;
const DOWN = bit_mask<<=0x1;



const game_struct = {

   panel: null,
   ground:null,
   player:null,
   physics:null,
};

const keys = {
   pressed:0x0
};


const gravity = 1.9;
const deccel = .75;
const max_accelx = 8;
let in_move_right = false;
let in_move_left = false;
let in_jump = false;
let in_ground = true;


export function Jump_physics(x=100, y=10) {

   // Bind Keyboard Controls
   Input_keyboard_bind_keydown_callback(Keyboard_input_keydown);
   Input_keyboard_bind_keyup_callback(Keyboard_input_keyup);

   const game_panel = Create_rect_mesh(Style_rect_default_properties({
      is_root:ROOT_WIDGETS.CREATE_ROOT, 
      pad:[5, 10], 
      pos:[x, y, 0], dim:[300, 400],
      col:Color_hsv_to_rgb_calibrated(.0, .0, 1., 1., .2, .0), 
      name:'GamePanel', 
      layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF,
   }));

   Widget_gfx_ready_enable({mesh:game_panel, enable_sdf_rect: 10, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}}); 

   game_struct.panel = game_panel;


   // Create player
   game_struct.ground = Create_ground(0, 800);
   game_panel.AddItem(game_struct.ground);

   // Create player
   // game_struct.player = Create_player(200, 790);
   game_struct.player = Create_player(200, 200);
   game_panel.AddItem(game_struct.player);


   game_panel.GenGfxCtx();
   Widget_render(game_panel);


   // game_struct.player = Create_player(200, 790);

   game_struct.physics = new Physics(0, 0, 0, 0, .05);
   Init_controls_time_interval(Move_player);

}
/** */
function Create_ground(x, y) {

   const dimx = 300, dimy = 80;

   const ground = Create_rect_mesh(Style_rect_default_properties({
      is_root:0x0, 
      pad:[0, 0], 
      pos:[x, y-dimy*2, 0], dim:[dimx, dimy],
      col:Color_hsv_to_rgb_calibrated(.36, 1., 1., 1., .6, .0), 
      name:'Ground', 
      layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF,
   }));


   Widget_gfx_ready_enable({mesh:ground, enable_sdf_rect: 10, }); 

   return ground;
}
/** */
// function Create_player(x, y) {

//    const dimx = 30, dimy = 30;

//    const player = Create_rect_mesh(Style_rect_default_properties({
//       // is_root:ROOT_WIDGETS.CREATE_ROOT, 
//       pos:[x, y-dimy*2 - 10, 0], dim:[dimx, dimy],
//       col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), 
//       name:'Player', 
//    }));
//    Widget_gfx_ready_enable({mesh:player, enable_sdf_rect: dimy, }); 

//    return player;
// }
/**save */
function Create_player(x, y) {

   const r_corners = 3;
   
   const player_dim_x = 50;
   const player_dim_y = player_dim_x*1.66;
   const player_pos_x = x;
   const player_pos_y = y-player_dim_y*2 - 10;
   const player = Create_rect_mesh(Style_rect_default_properties({
      is_root:0x0, 
      pos:[player_pos_x, player_pos_y, 0], dim:[player_dim_x, player_dim_y],
      col:Color_hsv_to_rgb_calibrated(.56, 0., 1., 0.5, .08, .0), 
      name:'Player', 
      // layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF,
   }));
   
   
   Widget_gfx_ready_enable({mesh:player, enable_sdf_rect: r_corners, }); 
   
   player.RenderToNewRenderGroup();

   Create_player_parts_facing_right(player, player_dim_x, player_dim_y, player_pos_x, player_pos_y);

   return player;

}
/** */
function Create_player_parts_facing_front(player, player_dim_x, player_dim_y, player_pos_x, player_pos_y){
   
      const ratios = {
      head_x:.50, head_y:.26,
      body_x:.6,  body_y:.19,
      arms_x:.20, arms_y:.35,
      legs_x:.30, legs_y:.34,
   };

   const r_corners = 3;

   
   const head_dim_x = player_dim_x*ratios.head_x;
   const head_dim_y = player_dim_y*ratios.head_y;
   const head_pos_x = player_pos_x + player_dim_x - head_dim_x;
   const head_pos_y = (player_pos_y);

   const head = Create_rect_mesh(Style_rect_default_properties({
      pos:[head_pos_x, head_pos_y, 0], dim:[head_dim_x, head_dim_y],
      col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), 
      name:'Player-Head', 
   }));
   Widget_gfx_ready_enable({mesh:head, enable_sdf_rect: r_corners, }); 
   player.AddItem(head);

   const body_dim_x = player_dim_x*ratios.body_x;
   const body_dim_y = player_dim_y*ratios.body_y;
   const body_pos_x = head.geom.pos[0] + head.geom.dim[0] - body_dim_x;
   const body_pos_y = (head.geom.pos[1] + head_dim_y*2);
   const body = Create_rect_mesh(Style_rect_default_properties({
      pos:[body_pos_x, body_pos_y, 0], dim:[body_dim_x, body_dim_y],
      col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), 
      name:'Player-Body1', 
   }));
   Widget_gfx_ready_enable({mesh:body, enable_sdf_rect: r_corners, }); 
   player.AddItem(body);
   const body2 = Create_rect_mesh(Style_rect_default_properties({
      is_root:0x0, 
      pos:[body_pos_x, body_pos_y+body_dim_y*2, 0], dim:[body_dim_x, body_dim_y],
      col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), 
      name:'Player-Body2', 
   }));
   Widget_gfx_ready_enable({mesh:body2, enable_sdf_rect: r_corners, }); 
   player.AddItem(body2);

   // Arms
   const arm_dim_x = player_dim_x*ratios.arms_x;
   const arm_dim_y = player_dim_y*ratios.arms_y;
   const arm_pos_x = body2.geom.pos[0] - arm_dim_x*2;
   const arm_pos_y = body.geom.pos[1]+0;
   const arm_lt = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x, arm_pos_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-arm-left-top', }));
   Widget_gfx_ready_enable({mesh:arm_lt, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_lt);
   const arm_lb = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x, arm_pos_y+arm_dim_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-arm-left-bot', }));
   Widget_gfx_ready_enable({mesh:arm_lb, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_lb);
   const arm_rt = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x*2+arm_dim_x*2, arm_pos_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-arm-right-top', }));
   Widget_gfx_ready_enable({mesh:arm_rt, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_rt);
   const arm_rb = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x*2+arm_dim_x*2, arm_pos_y+arm_dim_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-arm-right-bot', }));
   Widget_gfx_ready_enable({mesh:arm_rb, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_rb);


   // Legs
   const leg_dim_x = player_dim_x*ratios.legs_x;
   const leg_dim_y = player_dim_y*ratios.legs_y;
   const leg_pos_x = body2.geom.pos[0];
   const leg_pos_y = (body2.geom.pos[1] + body_dim_y*2);
   const leg_lt = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x, leg_pos_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-leg-left-top', }));
   Widget_gfx_ready_enable({mesh:leg_lt, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_lt);
   const leg_lb = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x, leg_pos_y+leg_dim_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-leg-left-bot', }));
   Widget_gfx_ready_enable({mesh:leg_lb, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_lb);
   const leg_rt = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+leg_dim_x*2, leg_pos_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-leg-right-top', }));
   Widget_gfx_ready_enable({mesh:leg_rt, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_rt);
   const leg_rb = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+leg_dim_x*2, leg_pos_y+leg_dim_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-leg-right-bot', }));
   Widget_gfx_ready_enable({mesh:leg_rb, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_rb);

}
/** */
function Create_player_parts_facing_right(player, player_dim_x, player_dim_y, player_pos_x, player_pos_y){
   
   // const ratios = {
   //    head_x:.45, head_y:.26,
   //    body_x:.6,  body_y:.19,
   //    arms_x:.20, arms_y:.35,
   //    legs_x:.22, legs_y:.34,
   // };
   const ratios = {
      head_x:.5, head_y:.26,
      body_x:.8,  body_y:.19,
      arms_x:.28, arms_y:.4,
      legs_x:.34, legs_y:.34,
   };

   const r_corners = 3;

   
   const head_dim_x = player_dim_x*ratios.head_x;
   const head_dim_y = player_dim_y*ratios.head_y;
   const head_pos_x = player_pos_x + player_dim_x - head_dim_x;
   const head_pos_y = (player_pos_y);

   const head = Create_rect_mesh(Style_rect_default_properties({pos:[head_pos_x, head_pos_y, 0], dim:[head_dim_x, head_dim_y],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-Head', }));
   Widget_gfx_ready_enable({mesh:head, enable_sdf_rect: r_corners, }); 
   player.AddItem(head);

   const body_dim_x = player_dim_x*ratios.body_x;
   const body_dim_y = player_dim_y*ratios.body_y;
   const body_pos_x = head.geom.pos[0] + head.geom.dim[0] - body_dim_x;
   const body_pos_y = (head.geom.pos[1] + head_dim_y*2);

   const arm_dim_x = player_dim_x*ratios.arms_x;
   const arm_dim_y = player_dim_y*ratios.arms_y;
   const arm_pos_x = body_pos_x ;
   const arm_pos_y = body_pos_y;
   const arm_lt = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.36, 1., 1., 1., .6, .0), name:'Player-arm-left-top', }));
   Widget_gfx_ready_enable({mesh:arm_lt, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_lt);
   const arm_lb = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y+arm_dim_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.36, 1., 1., 1., .6, .0), name:'Player-arm-left-bot', }));
   Widget_gfx_ready_enable({mesh:arm_lb, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_lb);


   const body = Create_rect_mesh(Style_rect_default_properties({pos:[body_pos_x, body_pos_y, 0], dim:[body_dim_x, body_dim_y],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-Body1', }));
   Widget_gfx_ready_enable({mesh:body, enable_sdf_rect: r_corners, }); 
   player.AddItem(body);
   const body2 = Create_rect_mesh(Style_rect_default_properties({is_root:0x0, pos:[body_pos_x, body_pos_y+body_dim_y*2, 0], dim:[body_dim_x, body_dim_y],col:Color_hsv_to_rgb_calibrated(.56, 1., 1., 1., .6, .0), name:'Player-Body2', }));
   Widget_gfx_ready_enable({mesh:body2, enable_sdf_rect: r_corners, }); 
   player.AddItem(body2);




   // Legs
   const leg_dim_x = player_dim_x*ratios.legs_x;
   const leg_dim_y = player_dim_y*ratios.legs_y;
   const leg_pos_x = body2.geom.pos[0];
   const leg_pos_y = (body2.geom.pos[1] + body_dim_y*2);
   const leg_lt = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.76, 1., 1., 1., .8, .0), name:'Player-leg-left-top', }));
   Widget_gfx_ready_enable({mesh:leg_lt, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_lt);
   const leg_lb = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y+leg_dim_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.76, 1., 1., 1., .8, .0), name:'Player-leg-left-bot', }));
   Widget_gfx_ready_enable({mesh:leg_lb, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_lb);
   const leg_rt = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.86, 1., 1., 1., .6, .0), name:'Player-leg-right-top', }));
   Widget_gfx_ready_enable({mesh:leg_rt, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_rt);
   const leg_rb = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y+leg_dim_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.86, 1., 1., 1., .6, .0), name:'Player-leg-right-bot', }));
   Widget_gfx_ready_enable({mesh:leg_rb, enable_sdf_rect: r_corners, }); 
   player.AddItem(leg_rb);

   // Right Arm
   const arm_rt = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.16, 1., 1., 1., .6, .0), name:'Player-arm-right-top', }));
   Widget_gfx_ready_enable({mesh:arm_rt, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_rt);
   const arm_rb = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y+arm_dim_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.16, 1., 1., 1., .6, .0), name:'Player-arm-right-bot', }));
   Widget_gfx_ready_enable({mesh:arm_rb, enable_sdf_rect: r_corners, }); 
   player.AddItem(arm_rb);

}

/** */
function Init_controls_time_interval(EventClbk) {

   const target_params = {
      target_mesh:game_struct.player,
      ground:game_struct.ground,
      physics:game_struct.physics,
      keys:keys,
   };
   const idx = Time_intervals_create(1, 'PhysicsJump', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
   game_struct.player.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);



   // Debug Print
   // const target_params_d = {

   //    target_mesh: game_struct.panel,
   //    physics:game_struct.physics,
   //    keys:keys,
   // };
   // const idx_d = Time_intervals_create(1000, 'DebugPrint', TIME_INTERVAL_REPEAT_ALWAYS, ()=>{ 
   //       console.log('----------------');
   //       console.log('physics', game_struct.physics);
   //       let msg = '';
   //       msg += ((keys.pressed & LEFT)) ? 'LEFT' : '';
   //       msg += ((keys.pressed & RIGHT)) ? ' RIGHT' : '';
   //       console.log('keys.pressed', msg);
   //       // console.log('keys.pressed', keys.pressed);
   //    }, 
   //    { target_params: target_params_d }
   // );
   // game_struct.player.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx_d);
}
/** */
// Keyboard input
function Keyboard_input_keydown(params) {

   const key = params.key;
   const keycode = params.event.keyCode;
   const physics = game_struct.physics;


   // if ((keycode === INPUT_KEYCODE_SPACE_BAR) && !in_jump) { 
   if ((keycode === INPUT_KEYCODE_SPACE_BAR) && in_ground) { 
      keys.pressed |= SPACE;
      physics.accely = 1;
      physics.signy = -1;
      in_jump = true;
      in_ground = false;
   }
   if ((keycode === INPUT_KEYCODE_LEFT) && !in_move_left)      { 
      keys.pressed |= LEFT;
      // keys.pressed &= ~RIGHT; // Remove any potential oposite pressed direction
      physics.accelx = 1;
      physics.signx = -1;
      in_move_left = true;
      in_move_right = false;
   }
   if ((keycode === INPUT_KEYCODE_RIGHT) && !in_move_right)     { 
      keys.pressed |= RIGHT;
      // keys.pressed &= ~LEFT; // Remove any potential oposite pressed direction
      physics.accelx = 1;
      physics.signx = 1;
      in_move_right = true;
      in_move_left = false;
   }

}
/** */
function Keyboard_input_keyup(params) {

   const key = params.key;
   const keycode = params.event.keyCode;
   const physics = game_struct.physics;

   if (keycode === INPUT_KEYCODE_SPACE_BAR) { 
      keys.pressed &= ~ SPACE;
      physics.accely = 0;
      // physics.signy = 1;
      in_jump = false;
   }
   if ((keycode === INPUT_KEYCODE_LEFT))      { 
      keys.pressed &= ~ LEFT;
      in_move_left = false;
      // physics.signx = 1;
      if(keys.pressed & RIGHT) {
         in_move_right = true;
         physics.signx = 1;
      }
   }
   if ((keycode === INPUT_KEYCODE_RIGHT))     { 
      keys.pressed &= ~ RIGHT;
      in_move_right = false;
      // physics.signx = -1;
      if(keys.pressed & LEFT) {
         in_move_left = true;
         physics.signx = -1;
      }
   }


}
/** */
// function Move_player() {

//    const player = game_struct.player;
//    const ground = game_struct.ground;
//    const physics = game_struct.physics;


//    const delta_time = Time_get_delta_time_in_ms();
   
//    // STOP accelarating UP based on velocity value. If we break the first time this statement and go to 'else', then accel becomes 0, and the only way to accelarate again is via key-down function
//    if((keys.pressed & SPACE) && physics.accely > 0 && physics.vely > -19)  {
            
//       physics.accely *= 1.2;
//       if(physics.accely > 8) physics.accely = 8;
//       // console.log('1', physics.accely)
//    }
//    else {
//       physics.accely = 0;
//       if(physics.accely > -.01) {
//          physics.vely += gravity;

//       }
//    }

//    physics.vely += ((physics.accely * physics.signy * physics.speed)) * delta_time;
//    if(physics.vely < -20) physics.vely = -20;
//    let posy = physics.vely+player.geom.pos[1];
//    // Ground Collision detection
//    if(posy > ground.geom.pos[1] - player.geom.dim[1]*2) {
//       posy = ground.geom.pos[1] - player.geom.dim[1]*2;
//       physics.vely = 0;
//       in_ground = true;

//    }
//    Mesh_set_and_copy_wpos_y(player, posy);
   
   
//    //. Move x direction
//    const right_boundary = game_struct.panel.geom.pos[0]+game_struct.panel.geom.dim[0]*2;
//    if(player.geom.pos[0]+player.geom.dim[0]*2 + physics.velx > right_boundary) {
//       // physics.signx *=-1;
//       // physics.accelx *=-1;
//       // physics.velx += -20;
//       physics.velx = -1;
//    }
//    else

//       // physics.velx = physics.accelx * physics.signx * physics.speed * delta_time;
//    physics.velx += physics.accelx * physics.signx * physics.speed*16;
//    if(Abs(physics.velx) > 10) physics.velx = 10*physics.signx;
//    if(keys.pressed & LEFT || keys.pressed & RIGHT) {
      
//       physics.accelx *= 1.04;
//       if(physics.accelx > max_accelx) physics.accelx = max_accelx;
//    }
//    // else {
//    //    physics.velx = 0;
//    //    physics.accelx *= deccel;
//    //    if(physics.accelx < .01) physics.accelx = 0;
//    // }
//    else {
//       physics.accelx = 0;
//       physics.velx *= .8;
//       // if(physics.accelx > -.01) {
//       //    physics.velx *= .8;

//       // }
//    }
   
//    Mesh_add_and_copy_wpos_x(player, physics.velx);

// }
/**SAVE */
function Move_player() {

   const player = game_struct.player;
   const ground = game_struct.ground;
   const physics = game_struct.physics;


   const delta_time = Time_get_delta_time_in_ms();
   
   // STOP accelarating UP based on velocity value. If we break the first time this statement and go to 'else', then accel becomes 0, and the only way to accelarate again is via key-down function
   if((keys.pressed & SPACE) && physics.accely > 0 && physics.vely > -19) {
            
      physics.accely *= 1.2;
      if(physics.accely > 8) physics.accely = 8;
      // console.log('1', physics.accely)
   }
   else {
      physics.accely = 0;
      if(physics.accely > -.01) {
         physics.vely += gravity;
      }
      in_ground = true;
   }

   physics.vely += ((physics.accely * physics.signy * physics.speed)) * delta_time;
   if(physics.vely < -20) physics.vely = -20;


   // const p_right = player.geom.pos[1] + player.geom.dim[0]*2 + physics.vely;
   const p_right = player.geom.pos[1] + player.geom.dim[0]*2 + physics.velx;
   const right_bound = ground.geom.pos[0] + ground.geom.dim[0];
   // console.log(p_right, right_bound)
   console.log(player.geom.pos[1]+physics.velx, right_bound)
   if (p_right >= right_bound) {
      physics.velx = 0;
   }
   // else if (head_right > right_bound) {
   //    dirx = -1; // Reverse velocity
   //    hit = true;
   // }

   let posy = physics.vely+player.geom.pos[1];
   // Ground Collision detection
   if(posy > ground.geom.pos[1] - player.geom.dim[1]*2) {
      posy = ground.geom.pos[1] - player.geom.dim[1]*2;
      physics.vely = 0;
      in_jump = false;

   }


   Mesh_set_and_copy_wpos_y(player, posy);
   // Mesh_add_and_copy_wpos_y(player, physics.vely);
   // Mesh_unif_set_vb_root_wposy(player.root_posidx, posy);
   
   
   //. Move x direction
   // physics.velx = physics.accelx * physics.signx * physics.speed * delta_time;
   physics.velx = physics.accelx * physics.signx * physics.speed*16;
   if(keys.pressed & LEFT || keys.pressed & RIGHT) {
      
      // physics.accelx *= 1.04;
      physics.accelx *= 1.2;
      if(physics.accelx > max_accelx) physics.accelx = max_accelx;
   }
   else {
      physics.accelx *= deccel;
      if(physics.accelx < .01) physics.accelx = 0;
   }
   
   Mesh_add_and_copy_wpos_x(player, physics.velx);
   // Mesh_unif_add_vb_roo
   
   if(player.children.boundary!==INT_NULL) {

      for(let i=0; i <= player.children.boundary; i++) {
   
         const child = player.children.buffer[i];
         Mesh_add_and_copy_wpos_x(child, physics.velx);
         // Mesh_add_wpos_y(child, physics.vely);
         // const y =  player.geom.pos[1] + child.geom.pos[1] + physics.vely
         const y =  child.geom.pos[1] + posy - 20
         Mesh_set_wpos_y(child, y);
      }
   }

}













/*************************************************************************/
// OLD-Implementation of keypress via event lkisteners

/** */
// function Set_move_time_interval(params) {

//    const mesh = params.evt_params.target_mesh;
   
//    const EventClbk = params.clbk_params.Move_clbk;
//    const target_params = {target_mesh:mesh};
//    const idx = Time_intervals_create(50, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
//    mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);
// }
/** */
// function Move_clbk(params) {

//    const mesh = params.params.target_params.target_mesh;


//    // NOTE: We use the same element of the mesh's interval buffer for the resize event as the move event, they cannot both exist at the same time. 
//    if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

//       const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
//       Time_intervals_destroy_byidx(intervalIdx);
//       mesh.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.UPDATE);

//       return;
//    }

// }