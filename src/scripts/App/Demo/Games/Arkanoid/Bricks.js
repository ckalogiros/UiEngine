"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { New_generic_buffer, New_int16_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Core/CreateWidget.js";
import { Effects_create, Effects_get_fx_mesh_byidx, Effects_remove_fx_mesh_byidx, EFFECTS_TYPES } from "../../../../Engine/Drawables/Effects/Effects.js";
import { BLUEL, GREEN, GREY, PURPLE, WHITE, YELLOW, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Set_color_a } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_get_uniform_ubidx_from_name } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Particle_system_emitter_get_size, Particles_get_particle_system, Particle_system_emitter_set_size } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { Vertex_buffer_set_and_update_uniform } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Gl_add_wpos_xy, Gl_set_attr_round_corners, Gl_set_dim_x, Gl_set_dim_xy, Gl_set_time } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Logarithmic_interpolation, Quadratic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Floor, Min } from "../../../../Helpers/Math/MathOperations.js";
import { Arkanoid_get_panel_center_pos_x, Arkanoid_get_panel_right } from "./Arkanoid.js";
import { Ball_get } from "./Ball.js";
import { Coin_create, Coin_get_byidx, Coin_remove_byidx } from "./Coin.js";
import { Player_check_coin_collision, Player_get_dimy, Player_get, Player_get_top } from "./Player.js";
import { Score_mod_create, Score_mod_get_text_mesh_byidx, Score_mod_remove_text_mesh_byidx } from "./ScoreMod.js";









const BRICKS_SCHEMA0 = [
   [1, 0, 0, 0, 0,],
];
const BRICKS_SCHEMA1 = [
   [1, 1, 1, 1, 1,],
   [2, 2, 2, 2, 2,],
   [3, 3, 3, 3, 3,],
   [4, 4, 4, 4, 4,],
];
const BRICKS_SCHEMA2 = [
   [1, 0, 0, 0, 0, 0, 1,],
   [0, 0, 0, 0, 0, 0, 0,],
   [3, 0, 0, 4, 0, 0, 3,],
   [0, 0, 0, 2, 0, 0, 0,],
   [1, 0, 2, 3, 2, 0, 1,],
   [2, 0, 2, 3, 2, 0, 2,],
   [3, 0, 1, 4, 1, 0, 3,],
   [4, 0, 1, 4, 1, 0, 4,],
   [4, 0, 0, 4, 0, 0, 4,],
];
const BRICKS_SCHEMA3 = [
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
   [3, 0, 0, 4, 0, 0, 3, 0, 0, 4, 0, 0, 3,],
   [0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0,],
   [1, 0, 2, 3, 2, 0, 1, 0, 2, 3, 2, 0, 1,],
   [2, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 2,],
   [3, 0, 1, 4, 1, 0, 3, 0, 1, 4, 1, 0, 3,],
   [4, 0, 1, 4, 1, 0, 4, 0, 1, 4, 1, 0, 4,],
   [4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4,],
   [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
   [3, 0, 0, 4, 0, 0, 3, 0, 0, 4, 0, 0, 3,],
   [0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0,],
   [1, 0, 2, 3, 2, 0, 1, 0, 2, 3, 2, 0, 1,],
   [2, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 2,],
   [3, 0, 1, 4, 1, 0, 3, 0, 1, 4, 1, 0, 3,],
   [4, 0, 1, 4, 1, 0, 4, 0, 1, 4, 1, 0, 4,],
   [4, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 4,],
];

_CNT = 1;
const BRICK_TYPES = [
   {color: BLUEL[9]},
   {color: GREEN[9]},
   {color: YELLOWR[9]},
   {color: PURPLE[9]},
   {color: WHITE},
];

const BRICK_HIT_SIDE = {
   NONE: 0x0,
   LEFT: 0x1,
   RIGHT: 0x2,
   TOP: 0x4,
   BOTTOM: 0x8,
}


const RATIO = 75 / 40;
const BRICK_SIZE1 = 22;
const BRICK_SIZE2 = 18;
const BRICK_SIZE3 = 9.4;
const BRICKS = {
   SCHEMA:BRICKS_SCHEMA3,
   SIZE:BRICK_SIZE3,
};

const BRICK_DIM_X = BRICKS.SIZE * RATIO, BRICK_DIM_Y = BRICKS.SIZE;
const BRICK_PAD_Y = 3, BRICK_PAD_X = 3, BRICK_R_CORNERS = 6, BRICK_FEATHER = 1;
const ROW_HEIGHT = BRICK_DIM_Y * 2 + BRICK_PAD_Y;
const COL_WIDTH = BRICK_DIM_X * 2 + BRICK_PAD_X;
let bricks_row_0_x = 0, bricks_row_0_y = 0; // This is the distance of the first row from the arkanoid panel left-top position

const _bricks_buffer = New_generic_buffer(_, 'Arkanoid-BricksBuffer');
const _bricks_rows = New_generic_buffer(_, '_bricks_rows');



export class Brick {

   constructor(x, y, name, type) {

      const posx = x;
      const posy = y;

      const mesh = Create_rect_mesh(_, [posx, posy, 1], [BRICK_DIM_X, BRICK_DIM_Y], type.color, name,);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, BRICK_FEATHER);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, BRICK_R_CORNERS);


      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9]));

      mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, _, false)

      this.mesh = mesh;

      this.is_active = true;
      this.hit_side = BRICK_HIT_SIDE.NONE;

   }

   UniformSetAndUpdate() {

      this.mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1.0, 1., 1.]);
   }

}



export function Bricks_create(x, y) {

   // Here we add any padding for the bricks rows positioning
   // The brick row 0 is the refference position to remove all unecessary pading for calculating the row from the ball's position
   bricks_row_0_x = BRICK_PAD_X + 0;
   bricks_row_0_y = BRICK_PAD_X + 0;

   let posx = x + bricks_row_0_x, posy = y + bricks_row_0_y;

   const rows_len = BRICKS.SCHEMA.length;
   for (let i = 0; i < rows_len; i++) {

      const cols_len = BRICKS.SCHEMA[i].length;
      _bricks_rows[i] = New_int16_buffer(cols_len, `Bricks row:${i}`); // Create new row buffer equal to the number of brick's columns

      for (let j = 0; j < cols_len; j++) {

         const type_id = BRICKS.SCHEMA[i][j];
         if (type_id !== 0) {

            const idx = _bricks_buffer.Add(new Brick(posx, posy, `br-${i}-${j}`, BRICK_TYPES[type_id-1]) );
            _bricks_rows[i].AddAtIndex(j, idx);

         }

         posx += (BRICK_DIM_X * 2) + BRICK_PAD_X;
      }

      posy += ROW_HEIGHT;
      posx = x + bricks_row_0_x

   }


   return _bricks_buffer;
}


function Bricks_calc_row_from_pos(y) {

   const clean_posy = y - bricks_row_0_y;

   if (y < bricks_row_0_y) return INT_NULL; // Case the y pos is above of first row pos
   else if (clean_posy < ROW_HEIGHT) return 0; // Case the y pos is on the first row(0-th index)

   const rowy = (clean_posy) / ROW_HEIGHT;
   const row = Floor(rowy);

   if (row >= BRICKS.SCHEMA.length) return INT_NULL;// Case the pos is lower of the lowest row
   return row;

}


function Bricks_calc_column_from_pos(x) {

   const clean_posx = x - bricks_row_0_x;

   if (x < bricks_row_0_x) return INT_NULL; // Case the x pos is left of first column pos
   else if (clean_posx < COL_WIDTH) return 0; // Case the x pos is on the first column

   const coly = (clean_posx) / COL_WIDTH;
   const col = Floor(coly);

   if (col >= BRICKS.SCHEMA[0].length) return INT_NULL; // Case the pos is right of the right most column
   return col;

}




function Bricks_find_rows_from_pos(ballx, bally, ball_size) {

   // Test_Bricks_calc_row_from_pos();

   // We search 2 rows, one for each ball's top and bottom positions
   const row1 = Bricks_calc_row_from_pos(bally);
   const row2 = Bricks_calc_row_from_pos(bally + ball_size * 2);

   // console.log('row1', row1, 'row2', row2)

   const rows = [INT_NULL, INT_NULL];
   let rows_len = 0;

   if (row1 !== INT_NULL) { rows[rows_len] = row1; rows_len++; }
   if (row2 !== INT_NULL && row2 !== row1) { rows[rows_len] = row2; rows_len++; }


   // Same for columns
   const col1 = Bricks_calc_column_from_pos(ballx);
   const col2 = Bricks_calc_column_from_pos(ballx + ball_size * 2);

   // console.log('col1', col1, 'col2', col2)

   const cols = [INT_NULL, INT_NULL];
   let cols_len = 0;

   if (col1 !== INT_NULL) { cols[cols_len] = col1; cols_len++; }
   if (col2 !== INT_NULL && col2 !== col1) { cols[cols_len] = col2; cols_len++; }


   return {
      rows: rows,
      rows_len: rows_len,
      cols: cols,
      cols_len: cols_len,
   };
}


/**
 * 
 * @param {*} posx Balls pos x
 * @param {*} posy Balls pos y
 * @param {*} dimx Balls half width 
 * @param {*} dimy Balls half height
 * @param {*} difx The difference of ball's pos current pos with ball's next pos
 * @param {*} dify The difference of ball's pos current pos with ball's next pos
 * @returns 
 */
export function Bricks_check_collision(posx, posy, dimx, dimy, difx, dify, dirx, diry) {

   const ret = [1, 1];

   const rc = Bricks_find_rows_from_pos(posx, posy, dimx, dimy);
   const rows_found = rc.rows;
   const cols_found = rc.cols;
   const rows_len = rc.rows_len;
   const cols_len = rc.cols_len;

   for (let i = 0; i < rows_len; i++) {

      const rowidxs = _bricks_rows[rows_found[i]]; // Get the row of brick indexes

      for (let j = 0; j < cols_len; j++) {

         const elem_idx = rowidxs.buffer[cols_found[j]]; // elem_idx is the index of the brick in the _bricks_buffer
         if (elem_idx !== INT_NULL) { // If there is no brick at this row-column, elem_idx should be INT_NULL

            const brick = _bricks_buffer.buffer[elem_idx];

            // check the actual ball-brick meshes collision
            const br_l = brick.mesh.geom.pos[0];
            const br_r = brick.mesh.geom.pos[0] + brick.mesh.geom.dim[0] * 2;
            const br_t = brick.mesh.geom.pos[1];
            const br_b = brick.mesh.geom.pos[1] + brick.mesh.geom.dim[1] * 2;
            const bl_l = posx;
            const bl_r = posx + (dimx * 2);
            const bl_t = posy;
            const bl_b = posy + (dimy * 2);

            if (bl_r > br_l && bl_l < br_r && bl_b > br_t && bl_t < br_b) {

               /**
                * // TODO: Since we need to resolve the hit side by conventional means, maybe the fancy point of collision calculation must go!
                */

               // Find the point of contact

               let l = Abs(bl_r - difx - br_l); // From brick's left side
               let r = Abs(bl_l - difx - br_r); // From brick's right side
               let t = Abs(bl_b - dify - br_t); // From brick's top side
               let b = Abs(bl_t - dify - br_b); // From brick's bottom side

               const x = Abs(Min(l, r));
               const y = Abs(Min(t, b));

               /** // TODO: We need the balls direction in the point of contact to correctly calculate for diagonal collisions */


               // HIT SIDE
               if (x < y) {
                  ret[0] = -1;
                  if (dirx < 0) brick.hit_side = BRICK_HIT_SIDE.RIGHT;
                  else if (dirx > 0) brick.hit_side = BRICK_HIT_SIDE.LEFT;
                  else alert('887766 NO X DIR WAS RESOLVED. PROBABLY DIR=0 ')
               }
               else {
                  ret[1] = -1;
                  if (diry < 0) brick.hit_side = BRICK_HIT_SIDE.BOTTOM;
                  else if (diry > 0) brick.hit_side = BRICK_HIT_SIDE.TOP;
                  else alert('887766 NO Y DIR WAS RESOLVED. PROBABLY DIR=0 ')
               }
               // DO NOT DELETE: Diagonal point of contact
               // if(Abs(x-y) < 10) { ret[0] = -1; ret[1] = -1; } // Diagonal point of contact


               // Remove mesh from the brick row(by setting the index to INT_NULL)
               rowidxs.buffer[cols_found[j]] = INT_NULL;

               Clbk_animation_push(brick)

               return ret;
            }
         }
      }
   }
   return ret;
}





/**************************************************************************************************************************************************************/
// Brick Push-Pull animation

function Clbk_animation_push(brick, time_step = 0.02, slope_const = 0.2, scale = 2) {
   
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   const x = brick.mesh.GetPosX()+brick.mesh.geom.dim[0];
   const y = brick.mesh.GetPosY()+brick.mesh.geom.dim[1];

   const text_mesh_idx = Score_mod_create('x1.2', x, y, TEXTURES.MSDF_COMIC_1024, 5, _, YELLOW[9]);
   const label = Score_mod_get_text_mesh_byidx(text_mesh_idx);

   // Resolve the hit direction to move the brick
   const dirx = (brick.hit_side & BRICK_HIT_SIDE.LEFT) ? 1 : ((brick.hit_side & BRICK_HIT_SIDE.RIGHT) ? -1 : 0)
   const diry = (brick.hit_side & BRICK_HIT_SIDE.TOP) ? 1 : ((brick.hit_side & BRICK_HIT_SIDE.BOTTOM) ? -1 : 0)

   const params = {
      brick: brick,
      direction: { x: dirx, y: diry },
      target_dist: 30, // in pixels
      move_dist: 2.5, // in pixels

      score_mod:label,
      function_slope:slope_params_pointer,
      move_amt: 2.5,
   };

   Callback_animations_create(Animation_push_up_run, Animation_push_up_stop, params,);

}

function Animation_push_up_run(params) {

   const brick = params.brick;
   const score_mod = params.score_mod.mesh;
   const mesh = brick.mesh;

   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   


   // Direction of movement
   const dirx = params.direction.x;
   const diry = params.direction.y;
   const movex = params.move_dist * dirx;
   const movey = params.move_dist * diry;

   if (dirx !== 0 && diry !== 0) {

      mesh.geom.AddWposXY(mesh.gfx, movex, movey);
      params.target_dist -= params.move_dist;
   }
   else if (dirx !== 0) {
      
      mesh.geom.AddWposX(mesh.gfx, movex);
      params.target_dist -= params.move_dist;
   }
   else if (diry !== 0) {
      
      mesh.geom.AddWposY(mesh.gfx, movey);
      params.target_dist -= params.move_dist;
   }
   
   const slope = Logarithmic_interpolation(timer, slope_constant);
   {
      // const sizex = mesh.geom.dim[0] + (slope * scale);
      // const sizey = mesh.geom.dim[1] + (slope * scale);
      const sizex = score_mod.geom.dim[0] * (slope * scale);
      const sizey = score_mod.geom.dim[1] * (slope * scale);
      score_mod.geom.SetDimXY(score_mod.gfx, sizex, sizey);
      Gl_set_dim_xy(score_mod.gfx, sizex, sizey);
   
      // const diffx = score_mod.geom.pos[0] + (slope * scale);
      // const diffy = score_mod.geom.pos[1] + (slope * scale);
      // score_mod.geom.SetWposXY(score_mod.gfx, diffx, diffy);
   
      if (score_mod.sid.attr & SID.ATTR.R_CORNERS) {
         Gl_set_attr_round_corners(score_mod.gfx, score_mod.mat.style.rcorners * (slope + 1));
      }
      // // score_mod.text_mesh.ScaleText((slope * scale))
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt);
   }

   // if (slope < 1.) return true;
   if (params.target_dist > 0) return true;
   return false
   // return true

}

function Animation_push_up_stop(params) {

   params.move_dist = 3;
   params.target_dist = 25;

   Callback_animations_create(Animation_pull_run, Animation_pull_stop, params,);
   return false;
}

function Animation_pull_run(params) {

   const brick = params.brick;
   const mesh = brick.mesh;
   const score_mod = params.score_mod.mesh;

   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   // Direction of movement
   const dirx = params.direction.x;
   const diry = params.direction.y;
   const movex = params.move_dist * dirx;
   const movey = params.move_dist * diry;

   if (params.target_dist > 0) {

      if (dirx !== 0 && diry !== 0) {
   
         mesh.geom.AddWposXY(mesh.gfx, -movex, -movey);
         params.target_dist -= params.move_dist;
      }
      else if (dirx !== 0) {
   
         mesh.geom.AddWposX(mesh.gfx, -movex);
         params.target_dist -= params.move_dist;
      }
      else if (diry !== 0) {
   
         mesh.geom.AddWposY(mesh.gfx, -movey);
         params.target_dist -= params.move_dist;
         // score_mod.AddWposY(movey);
      }
   }

   const slope = Logarithmic_interpolation(timer, slope_constant);
   {
      const sizex = score_mod.geom.dim[0] * (slope * scale);
      const sizey = score_mod.geom.dim[1] * (slope * scale);
      score_mod.geom.SetDimXY(score_mod.gfx, sizex, sizey);
      Gl_set_dim_xy(score_mod.gfx, sizex, sizey);

      if (score_mod.sid.attr & SID.ATTR.R_CORNERS) {
         Gl_set_attr_round_corners(score_mod.gfx, score_mod.mat.style.rcorners * (slope + 1));
      }
   
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt);
   }



   // if (slope < .9) return true;
   if (params.target_dist > 0) return true;

   // console.log('slope_constant', slope_constant, 'timer', timer, 'scale', scale)
   return false
}

function Animation_pull_stop(params) {

   // Set to initial position
   params.brick.mesh.geom.SetWposXY(params.brick.mesh.gfx, params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0], params.brick.mesh.geom.pos[1] + params.brick.mesh.geom.dim[1]);

   // Create explosion circle
   const explosion_fx = Arkanoid_create_explosion_circle( params.brick.mesh.mat.col, params, );


   params.brick.mesh.SetColorRGBA(TRANSPARENCY(GREY[2], .3));
   params.brick.is_active = false;

   return false;
}









/**************************************************************************************************************************************************************/
// Brick Push-Pull animation

function Arkanoid_create_explosion_circle(color=BLUEL[9], params) {

   const w = params.brick.mesh.geom.dim[0];
   const h = params.brick.mesh.geom.dim[1];
   const x = params.brick.mesh.GetPosX();
   const y = params.brick.mesh.GetPosY();


   // Create explosion mesh and animation
   const explosion_fx_idx = Effects_create(EFFECTS_TYPES.EXPLOSION_CIRCLE, x, y, h*4, h*4, w, h, color)
   const explosion_fx = Effects_get_fx_mesh_byidx(explosion_fx_idx);
   
   
   const params_explosion = {
      explosion_fx: explosion_fx, 
      timer: 0, 
      timer_limit: 1, 
      timer_step: .01, 
      move_amt: .15,
      
      function_slope: params.function_slope,
      score_mod: params.score_mod, 
   };
   
   
   Callback_animations_create(Animation_explosion_circle_run, Animation_explosion_circle_stop, params_explosion,);
   
   
   // Create coin mesh, coin glow mesh and animation
   const coin_idx = Coin_create(x, y, 16, 16, w, h);
   const coin = Coin_get_byidx(coin_idx);
   
   // Coin Glow effect
   const coin_glow_fx_idx = Effects_create(EFFECTS_TYPES.EXPLOSION_CIRCLE, x, y, 16*1.6, 16*1.6, w, h, YELLOW[9])
   const coin_glow_fx = Effects_get_fx_mesh_byidx(coin_glow_fx_idx);
   coin_glow_fx.mesh.timer = 0.01;
   Gl_set_time(coin_glow_fx.mesh.gfx, 0.01); // Reset attribute time
   
   const arkanoid_panel_center_posx = Arkanoid_get_panel_center_pos_x();
   const arkanoid_panel_right = Arkanoid_get_panel_right();
   const brick_center_posx = params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0];
   const dirx = (brick_center_posx < arkanoid_panel_center_posx) ? 1 : -1;

   const params_coin = {
      coin:coin,
      timer: 0, 
      timer_limit: 1, 
      timer_step: .01, 
      move_amt: .15,
      dirx: dirx,
      // Calc a max value on left and right position ends, and a min value in the middle, as a ratio
      brick_center_ratio:Quadratic_interpolation(0, arkanoid_panel_right, params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0]),

      coin_glow_fx: coin_glow_fx, 
   };
   Callback_animations_create(Animation_coin_run, Animation_coin_stop, params_coin,);

   return explosion_fx;
}



function Animation_explosion_circle_run(params) {
   
   
   const explosion_fx = params.explosion_fx;
   const score_mod = params.score_mod.mesh;
   
   // Stop exlposion animation if time limit is reached   
   if (params.timer >= params.timer_limit + params.timer_step) {
      return false;
   }
   
   params.timer += params.timer_step;
   
   // Update  time(attribute) for explosion animation
   Gl_set_time(explosion_fx.mesh.gfx, params.timer); // Update attribute time
   
   
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   // Avoid BLACK color in explosion when timer is equal or less than 0
   if(1-params.timer > 0) {
      
      // Update label rect
      const slope = Logarithmic_interpolation(timer, slope_constant);
      const sizex = score_mod.geom.dim[0] * (slope * scale);
      const sizey = score_mod.geom.dim[1] * (slope * scale);
      score_mod.geom.SetDimXY(score_mod.gfx, sizex, sizey);
      Gl_set_dim_xy(score_mod.gfx, sizex, sizey);

      // if (score_mod.sid.attr & SID.ATTR.R_CORNERS) { // This is only if the label's rect(score mod text) is rendered
      //    Gl_set_attr_round_corners(score_mod.gfx, score_mod.mat.style.rcorners * (slope + 1));
      // }
      
      // Update text
      Set_color_a(score_mod.text_mesh, 1-params.timer, score_mod.text_mesh.geom.num_faces);
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt*1.2);

   }
   
   return true
   
}

function Animation_explosion_circle_stop(params) {
   
   // Remove the explosion effect
   Effects_remove_fx_mesh_byidx(params.explosion_fx.idx);
   
   // Remove the score modifier text
   Score_mod_remove_text_mesh_byidx(params.score_mod.idx);

   return false;
}


function Animation_coin_run(params) {
   
   const coin = params.coin.mesh;





   // Check player-coin collision
   const player_top = Player_get_top();
   const player_dimy = Player_get_dimy();
   // if(coin.geom.pos[1]+coin.geom.dim[1]*2 > player_top && coin.geom.pos[1] < player_top+player_dimy*2){
   if(coin.geom.pos[1]+coin.geom.dim[1]*2 > player_top) {

      if(coin.geom.pos[1] < player_top+player_dimy*2){
         
         const player_hit = Player_check_coin_collision(coin.geom.pos[0], coin.geom.pos[0]+coin.geom.dim[0]*2, );
         
         if(player_hit) { // Remove the coin and run coin glow animation
            Coin_remove_byidx(params.coin.idx);
            // Set up the coin's glow animation
            Animation_coin_hit(params.coin_glow_fx);
   
            // Animation_test_player_scale();
            return false;
         }
      }

      else if (coin.geom.pos[1] > VIEWPORT.BOTTOM + 100) { // else if coin exceeds limit y pos, remove it
         Coin_remove_byidx(params.coin.idx);
         Effects_remove_fx_mesh_byidx(params.coin_glow_fx.idx);
         return false;
      }
   }




   const brick_center_ratio = params.brick_center_ratio; // The more at the edges a brick is, the more of x dir movment the coin has. The more at the center the less x dir move.

   const coin_glow_fx = params.coin_glow_fx.mesh;
   
   params.timer += params.timer_step;

   // Avoid weird position if timer is equal or greater than 1
   if(params.timer > .999) params.timer = .999;
   
   const t = params.timer;
   const gravity = 10.0;
   const move_up_dist = 1.9;
   const reverse_time_mod = (1-t+.4); // "t+.x": avoids straight line down move 
   let x = 4 * brick_center_ratio * reverse_time_mod * (params.dirx); // Calc the ammount of x direction
   let y = (gravity * t * t) + (t * t) + (t - move_up_dist); // Calc the ammount of gravity pull




   // Update coin animation position
   coin.geom.pos[0] += x;
   coin.geom.pos[1] += y;
   Gl_add_wpos_xy(coin.gfx, x, y);
   
   // Update coin glow animation position
   coin_glow_fx.geom.pos[0] += x;
   coin_glow_fx.geom.pos[1] += y;
   Gl_add_wpos_xy(coin_glow_fx.gfx, x, y);
   
   return true
   
}

function Animation_coin_stop(params) {
   
   return false;
}


export function Animation_coin_hit(coin_glow_fx) {


   //TODO: Also set up a player-coin hit glow + a score mod for the hit
   const time_step = 0.03, slope_const = 0.5, scale = 3;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   const x = coin_glow_fx.mesh.GetPosX()+coin_glow_fx.mesh.geom.dim[0];
   const y = coin_glow_fx.mesh.GetPosY()+coin_glow_fx.mesh.geom.dim[1];

   const text_mesh_idx = Score_mod_create('+0.5', x, y, TEXTURES.MSDF_COMIC_1024, 5, _, YELLOW[9]);
   const label = Score_mod_get_text_mesh_byidx(text_mesh_idx);


   // console.log('---Create', text_mesh_idx)
   const params_coin_glow_fx = {
      coin_glow_fx: coin_glow_fx, 
      score_mod:label,
      function_slope:slope_params_pointer,
      move_amt: .25,
      alpha_timer:0,
      alpha_timer_step:0.02,
   };
   Callback_animations_create(Animation_coin_hit_run, Animation_coin_hit_stop, params_coin_glow_fx,);
}

function Animation_coin_hit_run(params) {
   
   // Update score mode text glow position
   const score_mod = params.score_mod.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer(); 


   // IMIDIATELY: Find a way to diminish the if statements and separate functionality into three parts

   if(timer<1) {

      const slope = Logarithmic_interpolation(timer, slope_constant);
      
      // DO NOT DELETE: UPDATE LABEL RECT
      // const sizex = score_mod.geom.dim[0] * (slope * scale);
      // const sizey = score_mod.geom.dim[1] * (slope * scale);
      // score_mod.geom.SetDimXY(score_mod.gfx, sizex, sizey);
      // Gl_set_dim_xy(score_mod.gfx, sizex, sizey);
      
      score_mod.text_mesh.ScaleText(slope * scale)
      
      score_mod.AddWposY(-params.move_amt*10*(1-slope));
      
      // TODO: Unecessary calls. MUST BE CALLED ONCE
      // params.alpha_timer = 0;
   }
   else if(params.alpha_timer<1){
      
      // TODO: Unecessary calls. MUST BE CALLED ONCE
      params.function_slope.SetSlope(1);
      
      
      score_mod.text_mesh.ScaleText((params.alpha_timer+1) * scale)
      
      Set_color_a(score_mod.text_mesh, 1-params.alpha_timer, score_mod.text_mesh.geom.num_faces);
      
      score_mod.AddWposY(-params.move_amt*2);
      params.alpha_timer += params.alpha_timer_step;
   }



   const coin_glow_fx = params.coin_glow_fx;
   const dst_pos = [400, 0]; // Destination position to move to
   const src_pos = [coin_glow_fx.mesh.geom.pos[0], coin_glow_fx.mesh.geom.pos[1]];
   const dist = [dst_pos[0] - src_pos[0], dst_pos[1] - src_pos[1]];

   // Return if destination position of the coin glow is reached
   if(Abs(dist[1]) < 10) {
      Effects_remove_fx_mesh_byidx(params.coin_glow_fx.idx);
      return false;
   }

   // Move the coin glow a little bit closer to destination position by small ammounts
   dist[0] *= 0.01; 
   // dist[1] *= 0.02;
   dist[1] *= 0.03;

   // Update coin glow position
   coin_glow_fx.mesh.geom.pos[0] += dist[0];
   coin_glow_fx.mesh.geom.pos[1] += dist[1];
   Gl_add_wpos_xy(coin_glow_fx.mesh.gfx, dist[0], dist[1]);
 


   return true;
}
function Animation_coin_hit_stop(params) {
   
   // Remove the score modifier text
   const score_mod = params.score_mod;
   Score_mod_remove_text_mesh_byidx(score_mod.idx);
   
   return false;
}




/**********************************************************************************************************************************/
// TESTS

export function Animation_test_player_scale() {
   
   const player = Player_get();
   const ball = Ball_get();

   if(player.in_scale_animation) return;

   player.in_scale_animation = true;

   // const time_step = 0.01, slope_const = 0.2, scale = .5;
   const time_step = 0.005, slope_const = 1., scale = .5;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   const emitter_size = Particle_system_emitter_get_size(ball.tail_emitter_idx);
   const emitter = Particles_get_particle_system(ball.tail_emitter_idx);

   const params_player = {
      player:player,
      ball:ball,
      emitter: {
         size:emitter_size,
         current_size:emitter_size,
         vb_groupidx:emitter.gfx.vb.groupidx,
         ubidx:Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params'),
         shader_uniform_index:2,
      },
      function_slope:slope_params_pointer,
      player_initial_dimx:player.mesh.geom.dim[0],
      player_current_dimx:player.mesh.geom.dim[0],
      ball_initial_dimx:ball.mesh.geom.dim[0],
      ball_current_dimx:ball.mesh.geom.dim[0],
   };

   Callback_animations_create(Animation_test_player_scale_up_run, Animation_test_player_scale_up_stop, params_player,);
   
}
function Animation_test_player_scale_up_run(params) {
   
   const player = params.player.mesh; 
   const player_initial_dimx = params.player_initial_dimx;
   const player_current_dimx = params.player_current_dimx;
   const ball = params.ball.mesh; 
   const ball_initial_dimx = params.ball_initial_dimx;
   const ball_current_dimx = params.ball_current_dimx;
   
   const timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   
   
   const slope = Logarithmic_interpolation(timer, slope_constant);
   const scale_factor = slope*scale;
      

   // Update player x dir scale
   const sizex = player_current_dimx + (player_initial_dimx * scale_factor);
   player.geom.dim[0] = sizex;
   
   player.geom.SetDimX(player.gfx, sizex,);
   Gl_set_dim_x(player.gfx, sizex, );
   Gl_set_attr_round_corners(player.gfx, player.mat.style.rcorners + scale_factor);
 
   // Update ball x dir scale
   const ball_size = ball_current_dimx + (ball_initial_dimx * scale_factor * 2);
   ball.geom.dim[0] = ball_size;
   
   ball.geom.SetDimXY(ball.gfx, ball_size, ball_size);
   Gl_set_dim_xy(ball.gfx, ball_size, ball_size);
   Gl_set_attr_round_corners(ball.gfx, ball.geom.dim[0]);

   // // Update ball tail particle emitter
   // // const emitter_size = params.emitter.size * (scale_factor+1) * 2; // Calculate the scaled size from the original size
   // const emitter_size = params.emitter.current_size + (params.emitter.size * scale_factor * 2); // Calculate the scaled size from the original size
   // Particle_system_emitter_set_size(params.ball.tail_emitter_idx, emitter_size); // Scale up emitter and its particles
   // const noise_reduction = (1-scale_factor)*0.1 + .03;
   // // console.log('noise_reduction', noise_reduction)
   // Vertex_buffer_set_and_update_uniform(params.emitter.vb_groupidx, params.emitter.ubidx, noise_reduction, params.emitter.shader_uniform_index); // Scale down the precedural noise 
 
   if(slope > 1) 
      return false;

   return true;
}
function Animation_test_player_scale_up_stop(params) {
   
   params.function_slope.SetTimer(0);

   // Set the scale down as the inverse of scale up
   const scale = params.function_slope.GetValueChange();
   params.function_slope.SetValueChange(-scale);

   // Store current player dimention
   params.player_current_dimx = params.player.mesh.geom.dim[0];
   params.ball_current_dimx = params.ball.mesh.geom.dim[0];
   params.emitter.current_size = Particle_system_emitter_get_size(params.ball.tail_emitter_idx);
   
   // Set the scale down animation
   Time_intervals_create(5000, 'player_scale_up', 1, Animation_test_player_scale_down, params)
   // Callback_animations_create(Animation_test_player_scale_down_run, Animation_test_player_scale_down_stop, params,);

   return true;
}

function Animation_test_player_scale_down(params) {
   Callback_animations_create(Animation_test_player_scale_down_run, Animation_test_player_scale_down_stop, params.params,);
}

function Animation_test_player_scale_down_run(params) {
   
   const player = params.player.mesh; 
   const player_initial_dimx = params.player_initial_dimx;
   const player_current_dimx = params.player_current_dimx;
   const ball = params.ball.mesh; 
   const ball_initial_dimx = params.ball_initial_dimx;
   const ball_current_dimx = params.ball_initial_dimx;

   const timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   
   const slope = Logarithmic_interpolation(timer, slope_constant);
   const scale_factor = slope * scale;

   // Update coin glow position
   const sizex = player_current_dimx + (player_initial_dimx * scale_factor);
   player.geom.dim[0] = sizex;
   
   player.geom.SetDimX(player.gfx, sizex,);
   Gl_set_dim_x(player.gfx, sizex, );
   Gl_set_attr_round_corners(player.gfx, player.mat.style.rcorners + scale_factor);
 
 
   // Update ball x dir scale
   const ball_size = ball_current_dimx + (ball_initial_dimx * scale_factor * 2);
   ball.geom.dim[0] = ball_size;
   
   ball.geom.SetDimXY(ball.gfx, ball_size, ball_size);
   Gl_set_dim_xy(ball.gfx, ball_size, ball_size);
   Gl_set_attr_round_corners(ball.gfx, ball.geom.dim[0]);

   // // Update ball tail particle emitter
   // // const emitter_size = params.emitter.size * (scale_factor+1) * 2;
   // const emitter_size = params.emitter.current_size + (params.emitter.size * scale_factor * 2); // Calculate the scaled size from the original size
   // Particle_system_emitter_set_size(params.ball.tail_emitter_idx, emitter_size);
   // const noise_reduction = (slope)*0.27 + .03;
   // // console.log('---noise_reduction', noise_reduction)
   // Vertex_buffer_set_and_update_uniform(params.emitter.vb_groupidx, params.emitter.ubidx, noise_reduction, params.emitter.shader_uniform_index);

   if(slope > 1) 
      return false;

   
   return true;
}
function Animation_test_player_scale_down_stop(params) {
   
   // params.player.geom.SetDimX(player.mesh.gfx, sizex,);
   // Gl_set_dim_x(params.player.mesh.gfx, sizex, );
   // Gl_set_attr_round_corners(params.player.mesh.gfx, params.player.mesh.mat.style.rcorners);
   params.player.in_scale_animation = false;
   
   return false;
}
















/*****************************************************************************************************************************/
// Tests

function Test_Bricks_calc_row_from_pos() {
   console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=',)

   const times = 8;
   const rowy_start = bricks_row_0_y;
   let posy = 0;
   for (let i = 0; i < BRICKS.SCHEMA.length; i++) {
      console.log('row:', i, 'Between', rowy_start + (ROW_HEIGHT * i), '-', rowy_start + (ROW_HEIGHT * (i + 1)),);
   }
   console.log('------ Find row from pos',)
   for (let i = 0; i < times; i++) {
      const found_row = Bricks_calc_row_from_pos(posy);
      console.log('posy', posy, 'found_row', found_row,);
      posy += ROW_HEIGHT / 2;
   }

   console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=',)
}