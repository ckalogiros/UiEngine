"use strict";

import { Mult_arr3_scalar, Mult_arr4_scalar } from "../../../../Helpers/Math/MathOperations";



let _flag_counter = 0x1;


export const ARK_STATE = {
   
   START: _flag_counter,
   IN_GAME_PLAY: _flag_counter<<=0x1,
   IN_GAME_FINISH: _flag_counter<<=0x1,
   
   STAGE_COMPLETED_INITIATED: _flag_counter<<=0x1,

   BALL_START: _flag_counter<<=0x1,
   LAST_BALL_LOST: _flag_counter<<=0x1,

   FIRE_BULLET_ENABLED: _flag_counter<<=0x1,
   GUN_ENABLED: _flag_counter<<=0x1,

   state: 0x0,

   RESET(flag) { this.state = flag; },
   ADD(flag) { this.state |= flag; },
   REMOVE(flag) { this.state &= ~flag; },

   IS(flag) { return flag & this.state; }
};

ARK_STATE.RESET(ARK_STATE.START);
// ARK_STATE.RESET(ARK_STATE.IN_GAME_PLAY);




export const ARKANOID_FLAGS = {
   
   BRICK_COLOR_GREEN:0x0,
   BRICK_COLOR_BLUE:0x0,
   BRICK_COLOR_PURPLE:0x0,
   BRICK_COLOR_YELLOW:0x0,
   
   POWUP_BASE:0x0,
   POWUP_SCALE_PLAYER:0x0,
   POWUP_NEW_BALL:0x0,
   POWUP_SCALE_BALL:0x0,
   POWUP_FIRE_BULLET:0x0,
   POWUP_:0x0,
   
   POWUP_COLOR_GREEN:0x0,
   POWUP_COLOR_BLUE:0x0,
   POWUP_COLOR_PURPLE:0x0,
   POWUP_COLOR_YELLOW:0x0,
};

export function Arkanoid_initialize_flags() {
   
   _flag_counter = 0x1;
   ARKANOID_FLAGS.BRICK_COLOR_GREEN = _flag_counter;
   ARKANOID_FLAGS.BRICK_COLOR_BLUE = _flag_counter<<=0x1;
   ARKANOID_FLAGS.BRICK_COLOR_PURPLE = _flag_counter<<=0x1;
   ARKANOID_FLAGS.BRICK_COLOR_YELLOW = _flag_counter<<=0x1;
   

   ARKANOID_FLAGS.POWUP_BASE = _flag_counter<<=0X1; // This is the bsae start of the power up type flags. Use to 'mask-out' all previous bit flags and start 'POWUP_SCALE_PLAYER' from 0x1
   ARKANOID_FLAGS.POWUP_SCALE_PLAYER = _flag_counter;
   ARKANOID_FLAGS.POWUP_NEW_BALL = _flag_counter<<=0X1;
   ARKANOID_FLAGS.POWUP_SCALE_BALL = _flag_counter<<=0X1;
   ARKANOID_FLAGS.POWUP_FIRE_BULLET = _flag_counter<<=0X1;
   ARKANOID_FLAGS.POWUP_ = 0x0; // This is to 'SUM' all flags for any power up type flags(so we can use it as a|o mask).
   
   ARKANOID_FLAGS.POWUP_COLOR_GREEN = _flag_counter;
   ARKANOID_FLAGS.POWUP_COLOR_BLUE = _flag_counter<<=0x1;
   ARKANOID_FLAGS.POWUP_COLOR_PURPLE = _flag_counter<<=0x1;
   ARKANOID_FLAGS.POWUP_COLOR_YELLOW = _flag_counter<<=0x1;

   ARKANOID_FLAGS.POWUP_ = (ARKANOID_FLAGS.POWUP_SCALE_PLAYER|ARKANOID_FLAGS.POWUP_NEW_BALL|ARKANOID_FLAGS.POWUP_SCALE_BALL|ARKANOID_FLAGS.POWUP_FIRE_BULLET);
}






/************************************************************************************************/
// Colors
const color_brightness_ctrl_val = { yellow:.75, purple:.65, blue:1., green:.5, };
export const ARKANOID_COLORS = {
   yellow:  new Float32Array([1, .65, 0, 1]),
   purple:  new Float32Array([.75, 0, 1., 1]),
   blue:    new Float32Array([0, .5, 1, 1]),
   green:   new Float32Array([0., 1., 0., 1]),
};
Mult_arr3_scalar(ARKANOID_COLORS.yellow, color_brightness_ctrl_val.yellow)
Mult_arr3_scalar(ARKANOID_COLORS.purple, color_brightness_ctrl_val.purple)
Mult_arr3_scalar(ARKANOID_COLORS.blue, color_brightness_ctrl_val.blue)
Mult_arr3_scalar(ARKANOID_COLORS.green, color_brightness_ctrl_val.green)





/************************************************************************************************/
// Stages mock-up

export function Arkanoid_initialize_stages() {
   
   // abcdefghijklmnopqrstuvwxyz
   // abcdefgh COLORS
   // ijklmnop POWER UPS
   // qrstuvwx UNUSED
   // yz       UNUSED

   const ___ = 0x0; // No brick
   const a = ARKANOID_FLAGS.BRICK_COLOR_BLUE; // Brick color type 1
   const b = ARKANOID_FLAGS.BRICK_COLOR_PURPLE; // ... 2
   const c = ARKANOID_FLAGS.BRICK_COLOR_GREEN;  // ... 3
   const d = ARKANOID_FLAGS.BRICK_COLOR_YELLOW;  // ... 4
   const o = 0x0;
   const i = ARKANOID_FLAGS.POWUP_NEW_BALL; // Brick powerup type 1
   const j = ARKANOID_FLAGS.POWUP_SCALE_PLAYER; // ... 2
   const k = ARKANOID_FLAGS.POWUP_SCALE_BALL;  // ... 3
   const l = ARKANOID_FLAGS.POWUP_FIRE_BULLET;  // ... 4
   
   
   
   
   // const BRICKS_STAGE_0 = [
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   //    [___,___,___,___,___,___,___],
   // ];
   const BRICKS_STAGE_0 = [
      [___,___,___,___,___,___,___,___,___], // 1
      [___,___,___,___,___,___,___,___,___], // 2 
      [___,___,___,___,___,___,___,___,___], // 3
      [___,___,___,___,___,___,___,___,___], // 4
      [___,___,___,___,___,___,___,___,___], // 5
      [___,___,___,___,___,___,___,___,___], // 6
      [___,___,___,___,___,___,___,___,___], // 7
      [___,___,___,___,___,___,___,___,___], // 8
      [___,___,___,___,___,___,___,___,___], // 9
      [___,___,___,___,___,___,___,___,___], // 11
      [___,___,___,___,___,___,___,___,___], // 12
      [___,___,___,___,___,___,___,___,___], // 13
      [___,___,___,___,___,___,___,___,___], // 14
   ];
   const BRICKS_STAGE_3 = [
      [a|o,___,b|o,c|o,___,d|o,b|o,___,a|o], // 1
      [a|o,___,b|o,c|o,___,d|o,b|o,___,a|o], // 2 
      [a|o,___,b|o,c|o,___,d|o,b|o,___,a|i], // 3
      [a|o,___,b|o,c|o,___,d|o,b|o,___,a|o], // 4
      [a|o,___,b|o,c|i,___,d|o,b|o,___,a|o], // 5
      [a|o,___,b|o,c|o,___,d|o,b|o,___,a|o], // 6
      [___,___,___,___,___,___,___,___,___], // 7
      [a|o,___,c|o,d|o,___,b|o,c|l,___,d|o], // 8
      [a|o,___,c|o,d|o,___,b|o,c|o,___,d|o], // 9
      [a|o,___,c|o,d|o,___,b|o,c|o,___,d|i], // 11
      [c|i,___,c|o,d|o,___,b|o,c|o,___,b|o], // 12
      [c|o,___,c|l,d|o,___,b|o,c|o,___,b|o], // 13
      // [c|o,___,c|o,d|i,___,b|o,c|o,___,b|o], // 14
   ];
   const BRICKS_STAGE_2 = [
      [___,___,___,___,a|o,___,___,___,___], // 1
      [___,___,___,a|o,b|o,a|o,___,___,___], // 2 
      [___,___,a|o,c|o,b|o,c|o,a|o,___,___], // 3
      [___,a|o,c|o,d|o,b|o,d|o,c|o,a|o,___], // 4
      [a|o,c|o,d|o,d|o,b|o,d|o,d|o,c|o,a|l], // 5
      [___,a|o,c|o,d|o,b|o,d|o,c|o,a|o,___], // 6
      [___,___,a|l,c|o,b|o,c|o,a|i,___,___], // 7
      [___,___,___,a|i,b|o,a|o,___,___,___], // 8
      [___,___,___,___,a|l,___,___,___,___], // 9
      [___,___,___,a|o,b|o,a|o,___,___,___], // 10
      [___,___,a|i,c|o,b|o,c|o,a|o,___,___], // 11
      [___,a|o,c|o,d|o,b|o,d|i,c|o,a|o,___], // 12
      // [a|o,c|o,d|o,d|o,b|o,d|o,d|i,c|o,a|o], // 13
   ];
   // const BRICKS_STAGE_1 = [
   //    [a|o,___,c|o,___,b|o,___,c|o,___,d|o], // 1
   //    [a|o,___,c|o,___,b|o,___,c|o,___,d|o], // 2 
   //    [___,b|o,___,a|o,___,b|o,___,c|o,___], // 3
   //    [___,b|o,___,a|o,___,b|o,___,c|o,___], // 4
   //    [c|o,___,c|o,___,a|o,___,a|o,___,d|o], // 5
   //    [c|o,___,c|o,___,a|o,___,a|o,___,d|o], // 6
   //    [___,d|o,___,a|o,___,c|o,___,b|o,___], // 7
   //    [___,d|o,___,a|o,___,c|o,___,b|o,___], // 8
   //    [c|o,___,c|o,___,a|o,___,a|o,___,d|o], // 9
   //    [c|o,___,c|o,___,a|o,___,a|o,___,d|o], // 10
   // ];
   const BRICKS_STAGE_1 = [
      [a|o,___,c|o,___,b|o,___,c|o,___,d|o], // 1
      [a|o,___,c|o,___,b|o,___,c|o,___,d|o], // 2 
      [___,b|o,___,d|i,___,b|o,___,b|k,___], // 3
      [___,b|o,___,a|o,___,a|j,___,c|o,___], // 4
      [b|k,___,c|o,___,a|o,___,a|o,___,c|l], // 5
      [c|o,___,c|o,___,a|o,___,d|i,___,d|o], // 6
      [___,c|l,___,a|o,___,b|k,___,b|o,___], // 7
      [___,d|o,___,d|i,___,c|o,___,a|j,___], // 8
      [c|o,___,c|o,___,a|o,___,a|o,___,c|l], // 9
      [c|o,___,b|k,___,d|i,___,a|o,___,d|o], // 10
      [___,b|o,___,d|i,___,b|o,___,b|k,___], // 11
      [___,b|o,___,a|o,___,a|j,___,c|o,___], // 12
      [a|o,___,c|o,___,b|o,___,c|o,___,d|o], // 13
      // [a|o,___,c|o,___,b|o,___,c|o,___,d|o], // 14 
   ];

   let cnt = 0;
   // Set the sequence of each consecutive stage
   BRICK_STAGES[cnt++] = BRICKS_STAGE_1;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_2;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_3;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_1;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_2;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_3;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_1;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_2;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_3;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_1;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_2;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_3;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_1;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_2;
   BRICK_STAGES[cnt++] = BRICKS_STAGE_3;
}



export const BRICK_STAGES = [];