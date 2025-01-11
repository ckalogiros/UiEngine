"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Free_generic_buffer, Free_int16_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_add_to_group } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Effects_create_explosion_circle, Effects_create_explosion_glow, Effect_explosion_circle_get_mesh_byidx, Effect_explosion_circle_remove_mesh_byidx } from "../../../../Engine/Drawables/Effects/Effects.js";
import { BLUEL, GREEN, GREY, PURPLE, TRANSPARENT, WHITE, YELLOW, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Set_color_a } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Gl_add_wpos_xy, Gl_set_attr_round_corners, Gl_set_dim_xy, Gl_set_rgba, Gl_set_time, Gl_set_wpos_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetSign } from "../../../../Helpers/Helpers.js";
import { Function_Slope, Logarithmic_interpolation, Quadratic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Floor, Min } from "../../../../Helpers/Math/MathOperations.js";
import { Arkanoid_get_panel_center_pos_x, Arkanoid_get_panel_right } from "./Arkanoid.js";
import { ARK_STATE } from "./ArkanoisConstants.js";
import { Coin_create, Coin_get_byidx, Coin_remove_byidx } from "./Coin.js";
import { Player_check_coin_collision, Player_get_dimy, Player_get_top, Player_check_powup_collision } from "./Player.js";
import { Powup_create, Powup_get_byidx, Powup_remove_byidx, Powup_resolve_hit, POWUP_TYPE_IDXS } from "./PowerUps.js";
import { Score_mod_create, Score_mod_get_text_mesh_byidx, Score_mod_remove_text_mesh_byidx } from "./ScoreMod.js";









const BRICKS_SCHEMA0 = [
   [1, 0, 0, 0, 0, 0, 0,],
   [1, 0, 0, 0, 0, 0, 0,],
   [1, 0, 0, 0, 0, 0, 0,],
   [1, 0, 0, 0, 0, 0, 0,],
   [1, 0, 0, 0, 0, 0, 0,],
   [1, 0, 0, 0, 0, 0, 0,],
   [1, 1, 1, 1, 1, 0, 0,],
   [1, 1, 1, 1, 1, 0, 0,],
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
const BRICKS_SCHEMA4 = [
   [0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0],
   [0, 0, 0, 3, 0],
   [0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0],
];
const BRICKS_SCHEMA5 = [
   [0, 0, 4, 0, 0],
   [0, 0, 4, 0, 0],
   [0, 0, 4, 0, 0],
   [0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0],
];

_CNT = 1;
const BRICK_TYPES = [
   // {color: GREEN[9],},
   {color: WHITE,},
   {color: PURPLE[9],},
   {color: BLUEL[9],},
   {color: YELLOWR[9],},
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
   // SCHEMA:[BRICKS_SCHEMA2],
   SCHEMA:[BRICKS_SCHEMA4, BRICKS_SCHEMA2, BRICKS_SCHEMA5, BRICKS_SCHEMA1, BRICKS_SCHEMA5, BRICKS_SCHEMA2, BRICKS_SCHEMA1, BRICKS_SCHEMA2, BRICKS_SCHEMA5, BRICKS_SCHEMA1, BRICKS_SCHEMA2, BRICKS_SCHEMA5, BRICKS_SCHEMA1],
   CURRENT_SCHEMA:BRICKS_SCHEMA4,
   SIZE:BRICK_SIZE2,
   VB_GROUP_IDX:INT_NULL,
};
const PRE_INITIALIZED_BRICK_MESHES = 1;

const BRICK_DIM_X = BRICKS.SIZE * RATIO, BRICK_DIM_Y = BRICKS.SIZE;
const BRICK_PAD_Y = 3, BRICK_PAD_X = 3, BRICK_R_CORNERS = 6, BRICK_FEATHER = 1;
const ROW_HEIGHT = BRICK_DIM_Y * 2 + BRICK_PAD_Y;
const COL_WIDTH = BRICK_DIM_X * 2 + BRICK_PAD_X;
let bricks_row_0_x = 0, bricks_row_0_y = 0; // This is the distance of the first row from the arkanoid panel left-top position

const _bricks_buffer = New_generic_buffer(_, 'Arkanoid-BricksBuffer');
const _free_brick_idxs_buffer = New_int8_buffer(PRE_INITIALIZED_BRICK_MESHES, '_free_brick_idxs_buffer');
const _bricks_rows = New_generic_buffer(_, '_bricks_rows');
const _bricks_counter = {
   rows_alive: 0,
};





export class Brick {

   constructor(x=0, y=0, name='NULL', type_id=1, gfx_ctx_flags=0x0, vb_grouidx=INT_NULL, gfx_ctx_parent=INT_NULL) {

      const posx = x;
      const posy = y;

      // const mesh = Create_rect_mesh(_, [posx, posy, 1], [BRICK_DIM_X, BRICK_DIM_Y],  BRICK_TYPES[type_id-1].color, name,);
      const mesh = Create_rect_mesh(_, [0, 0, 1], [BRICK_DIM_X, BRICK_DIM_Y],  BRICK_TYPES[type_id-1].color, name,);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, BRICK_FEATHER);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, BRICK_R_CORNERS);


      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9]));

      // mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, _, false)
      // mesh.gfx_ctx_parent = gfx_ctx_parent;
      // mesh.GfxCtxSetFlag(gfx_ctx_flags, gfx_ctx_parent, false)

      // mesh.GenGfxCtx(_, vb_grouidx)
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE, vb_grouidx);

      mesh.geom.pos[0] = posx;
      mesh.geom.pos[1] = posy;
      
      mesh.Render();
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);

      this.mesh = mesh;

      this.is_active = true;
      this.lock_squash_anim = false;
      this.hit_side = BRICK_HIT_SIDE.NONE;


      this.idx = _bricks_buffer.Add(this);


      this.powup_type_idx = INT_NULL;

      if(type_id===1) {

         this.powup_type_idx = POWUP_TYPE_IDXS.NEW_BALL;
      }
      // else if(type_id===2) {
         
      //    this.powup_type_idx = POWUP_TYPE_IDXS.SCALE_BALL;
      // }
      else if(type_id===3) { 
         
         this.powup_type_idx = POWUP_TYPE_IDXS.SCALE_PLAYER;
      }
      else 
      if(type_id===4) {

         this.powup_type_idx = POWUP_TYPE_IDXS.FIRE_BULLET;
      }


   }

   UniformSetAndUpdate() {

      this.mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1.0, 1., 1.]);
   }

}


export function Brick_get_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bricks_buffer.buffer[idx] === undefined) alert('1231231231231 Wrong index for _bricks_buffer')
   return _bricks_buffer.buffer[idx];
}
// Removes the coin mesh from the storage buffer and from rendering, but mesh still remains in the application
export function Brick_remove_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bricks_buffer.buffer[idx] === undefined) alert('1231231231232 Wrong index for _bricks_buffer')
   
   const mesh = _bricks_buffer.buffer[idx].mesh;
   
   mesh.SetColorRGBA(TRANSPARENT);

   _bricks_buffer.buffer[idx].is_active = false;
   _free_brick_idxs_buffer.Add(idx);
   
}
// Removes the coin mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application)
export function Brick_destroy_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bricks_buffer.buffer[idx] === undefined) alert('1231231231233 Wrong index for _bricks_buffer')
   const mesh = _bricks_buffer.buffer[idx].mesh;
   _bricks_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}
export function Bricks_init_buffer(group_idx, parent_root_posidx, parent_mesh_bufferidx, num_effect_meshes=PRE_INITIALIZED_BRICK_MESHES) {

   let vb_groupidx = INT_NULL;
   let brick = null;

   for(let i=0; i<num_effect_meshes; i++) {

      brick = new Brick(0, 0, _, _, _, vb_groupidx); 
      vb_groupidx = brick.mesh.gfx.vb.groupidx;

      // Add to View Group
      View_add_to_group(brick.mesh, group_idx);
      // Implement to draw wpos from a root uniform wpos 
      if(parent_root_posidx!==INT_NULL) Mesh_unif_hack_parent_root_wpos(brick.mesh.root_posidx, parent_root_posidx, parent_mesh_bufferidx);
      
      Brick_remove_byidx(brick.idx);
   }

   BRICKS.VB_GROUP_IDX = vb_groupidx;
   
   // return vb_groupidx;
   return brick;
}
// 
export function Bricks_reset_all_deactivated_bricks() {

   for(let i=0; i <= _bricks_buffer.boundary; i++) {

      const brick = _bricks_buffer.buffer[i];
      Gl_set_rgba(brick.mesh.gfx, TRANSPARENT);
   }

   // Reset, because the columnns number may differ from stage to stage. So we need to reallocate the columns on each stage
   _bricks_rows.ResetFull();
}

function Bricks_create(x, y, color, name, type_id, vb_grouidx, group_idx) {

   let idx = INT_NULL;

   const freeidx = _free_brick_idxs_buffer.boundary;
   
   
   if (freeidx >= 0) {

      idx = _free_brick_idxs_buffer.buffer[freeidx];
      const brick = _bricks_buffer.buffer[idx];
      
      brick.mesh.geom.pos[0] = x;
      brick.mesh.geom.pos[1] = y;
      Gl_set_wpos_xy(brick.mesh.gfx, brick.mesh.geom.pos[0]+brick.mesh.geom.dim[0], brick.mesh.geom.pos[1]+brick.mesh.geom.dim[1]);

      // brick.mesh.geom.dim[0] = w;
      // brick.mesh.geom.dim[1] = h;
      // brick.mesh.geom.SetDimXY(brick.gfx, w, h);
      
      brick.mesh.SetColorRGBA(color);

      
      brick.mesh.SetName(name);


      _bricks_buffer.buffer[idx].is_active = true;


      // Remove from the free idxs buffer
      _free_brick_idxs_buffer.RemoveByIdx(freeidx);
   }
   else { // If no apropriate free mesh was found, create new mesh

      const brick = new Brick(0,  0, name, type_id, _, vb_grouidx);
      idx = brick.idx;
      // Add to group
      View_add_to_group(brick.mesh, group_idx);

      brick.mesh.geom.pos[0] = x;
      brick.mesh.geom.pos[1] = y;
      Gl_set_wpos_xy(brick.mesh.gfx, brick.mesh.geom.pos[0]+brick.mesh.geom.dim[0], brick.mesh.geom.pos[1]+brick.mesh.geom.dim[1]);

      // Update the free buffer, otherwise it may have less elements that the current bricks buffer.
      if(idx >= _free_brick_idxs_buffer.size) {

         const new_elem_idx = _free_brick_idxs_buffer.AddAtIndex(_free_brick_idxs_buffer.size, 127);
         _free_brick_idxs_buffer.RemoveByIdx(new_elem_idx);
      }
   }


   return idx;

}

let temp_cnt = 0;
export function Bricks_set_stage_bricks(x=0, y=0, group_idx) {

   // Here we add any padding for the bricks rows positioning
   // The brick row 0 is the refference position to remove all unecessary pading for calculating the row from the ball's position
   bricks_row_0_x = BRICK_PAD_X + 0;
   bricks_row_0_y = BRICK_PAD_X + 0;

   let posx = x + bricks_row_0_x, posy = y + bricks_row_0_y;

   let vb_grouidx = BRICKS.VB_GROUP_IDX;

   BRICKS.CURRENT_SCHEMA = BRICKS.SCHEMA[temp_cnt++];
   const scema = BRICKS.CURRENT_SCHEMA;

   const rows_len = BRICKS.CURRENT_SCHEMA.length;
   for (let i = 0; i < rows_len; i++) {

      const cols_len = scema[i].length;

      _bricks_rows.Add(New_int16_buffer(cols_len, `Bricks row:${i}`)); // Create new row buffer

      for (let j = 0; j < cols_len; j++) {

         const type_id = scema[i][j];
         if (type_id !== 0) {

            const color = BRICK_TYPES[type_id-1].color;
            const brick_idx = Bricks_create(posx, posy, color, `br-${i}-${j}`, type_id, vb_grouidx, group_idx);
            _bricks_rows.buffer[i].AddAtIndex(j, brick_idx);
         }

         posx += (BRICK_DIM_X * 2) + BRICK_PAD_X;
      }

      posy += ROW_HEIGHT;
      posx = x + bricks_row_0_x

   }

   // Calculate number of alive rows 
   Bricks_set_alive_rows_counter();

   return _bricks_buffer;
}


function Bricks_set_alive_rows_counter() {

   for(let i=0; i <= _bricks_rows.boundary; i++) {

      const column_num_bricks = _bricks_rows.buffer[i].boundary+1;
      if(column_num_bricks > 0) {
         
         _bricks_counter.rows_alive++;
      }
   }

   console.warn('_bricks_counter', _bricks_counter);
}
export function Bricks_get_alive_rows_counter() {
   return _bricks_counter.rows_alive;
}
export function Bricks_is_any_brick_alive() {
   if(_bricks_counter.rows_alive > 0) return true;
   return false;
}


function Bricks_calc_row_from_pos(y) {

   const clean_posy = y - bricks_row_0_y;

   if (y < bricks_row_0_y) return INT_NULL; // Case the y pos is above of first row pos
   else if (clean_posy < ROW_HEIGHT) return 0; // Case the y pos is on the first row(0-th index)

   const rowy = (clean_posy) / ROW_HEIGHT;
   const row = Floor(rowy);

   if (row >= BRICKS.CURRENT_SCHEMA.length) return INT_NULL;// Case the pos is lower of the lowest row
   return row;

}


function Bricks_calc_column_from_pos(x) {

   const clean_posx = x - bricks_row_0_x;

   if (x < bricks_row_0_x) return INT_NULL; // Case the x pos is left of first column pos
   else if (clean_posx < COL_WIDTH) return 0; // Case the x pos is on the first column

   const coly = (clean_posx) / COL_WIDTH;
   const col = Floor(coly);

   if (col >= BRICKS.CURRENT_SCHEMA[0].length) return INT_NULL; // Case the pos is right of the right most column
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

      // const rowidxs = _bricks_rows[rows_found[i]]; // Get the row of brick indexes
      const rowidxs = _bricks_rows.buffer[rows_found[i]]; // Get the row of brick indexes

      for (let j = 0; j < cols_len; j++) {

         const elem_idx = rowidxs.buffer[cols_found[j]]; // elem_idx is the index of the brick in the _bricks_buffer
         if (elem_idx !== INT_NULL) { // If there is no brick at this row-column, elem_idx should be INT_NULL
            
            const brick = _bricks_buffer.buffer[elem_idx];
            
            // check the actual ball-brick meshes collision
            const br_l = brick.mesh.geom.pos[0];
            const br_r = brick.mesh.geom.pos[0] + brick.mesh.geom.dim[0] * 2;
            const br_t = brick.mesh.geom.pos[1];
            const br_b = brick.mesh.geom.pos[1] + brick.mesh.geom.dim[1] * 2;
            const l = posx;
            const r = posx + (dimx * 2);
            const t = posy;
            const b = posy + (dimy * 2);

            if (r > br_l && l < br_r && b > br_t && t < br_b) {

               /**
                * // TODO: Since we need to resolve the hit side by conventional means, maybe the fancy point of collision calculation must go!
                */

               // Find the point of contact

               let l2 = Abs(r - difx - br_l); // From brick's left side
               let r2 = Abs(l - difx - br_r); // From brick's right side
               let t2 = Abs(b - dify - br_t); // From brick's top side
               let b2 = Abs(t - dify - br_b); // From brick's bottom side

               const x = Abs(Min(l2, r2));
               const y = Abs(Min(t2, b2));

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

               // HERE
               // TODO: Create squash for the ball. Stop the ball's move on hit, run squash animation, return to move

               // Remove mesh from the brick row(by setting the index to INT_NULL)
               // rowidxs.buffer[cols_found[j]] = INT_NULL;
               rowidxs.RemoveByIdx(cols_found[j]);
               if(rowidxs.boundary < 0) {
                  _bricks_counter.rows_alive--;
                  console.warn(_bricks_counter)
               }

               _free_brick_idxs_buffer.Add(brick.idx)

               Clbk_animation_push(brick, posx, posy, dimx, dimy);

               return ret;
            }
         }
      }
   }
   return ret;
}
export function Bricks_check_collision_column_only(posx, posy, dimx, dimy, diry) {

   const ret = [1, 1];

   const rc = Bricks_find_rows_from_pos(posx, posy, dimx, dimy);
   const rows_found = rc.rows;
   const cols_found = rc.cols;
   const rows_len = rc.rows_len;
   const cols_len = rc.cols_len;

   for (let i = 0; i < rows_len; i++) {

      // const rowidxs = _bricks_rows[rows_found[i]]; // Get the row of brick indexes
      const rowidxs = _bricks_rows.buffer[rows_found[i]]; // Get the row of brick indexes

      for (let j = 0; j < cols_len; j++) {

         const elem_idx = rowidxs.buffer[cols_found[j]]; // elem_idx is the index of the brick in the _bricks_buffer
         if (elem_idx !== INT_NULL) { // If there is no brick at this row-column, elem_idx should be INT_NULL

            const brick = _bricks_buffer.buffer[elem_idx];

            // check the actual ball-brick meshes collision
            const br_l = brick.mesh.geom.pos[0];
            const br_r = brick.mesh.geom.pos[0] + brick.mesh.geom.dim[0] * 2;
            const br_t = brick.mesh.geom.pos[1];
            const br_b = brick.mesh.geom.pos[1] + brick.mesh.geom.dim[1] * 2;
            const l = posx;
            const r = posx + (dimx * 2);
            const t = posy;
            const b = posy + (dimy * 2);

            if (r > br_l && l < br_r && b > br_t && t < br_b) {

               ret[1] = -1;
               if (diry < 0) brick.hit_side = BRICK_HIT_SIDE.BOTTOM;
               else if (diry > 0) brick.hit_side = BRICK_HIT_SIDE.TOP;
               else alert('887766 NO Y DIR WAS RESOLVED. PROBABLY DIR=0 ')

               // Remove mesh from the brick row(by setting the index to INT_NULL)
               // rowidxs.buffer[cols_found[j]] = INT_NULL;
               rowidxs.RemoveByIdx(cols_found[j]);
               if(rowidxs.boundary < 0) {
                  _bricks_counter.rows_alive--;
                  console.warn(_bricks_counter)
               }

               Clbk_animation_push(brick, posx, posy, dimx, dimy);

               return true;
            }
         }
      }
   }
   return false;
}





/**************************************************************************************************************************************************************/
// Brick Push-Pull animation

function Clbk_animation_push(brick, hit_posx, hit_posy, hit_w, hit_h, time_step = 0.02, slope_const = 0.2, scale = 2) {
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);
   
   const w = brick.mesh.geom.dim[0];
   const h = brick.mesh.geom.dim[1];
   const x = brick.mesh.geom.pos[0];
   const y = brick.mesh.geom.pos[1];

   const text_mesh_idx = Score_mod_create(1.2, 'x1.2', x+w, y+h, TEXTURES.MSDF_COMIC_1024, 5, _, YELLOW[9]);
   const label = Score_mod_get_text_mesh_byidx(text_mesh_idx);

   // Resolve the hit direction to move the brick
   const dirx = (brick.hit_side & BRICK_HIT_SIDE.LEFT) ? 1 : ((brick.hit_side & BRICK_HIT_SIDE.RIGHT) ? -1 : 0)
   const diry = (brick.hit_side & BRICK_HIT_SIDE.TOP) ? 1 : ((brick.hit_side & BRICK_HIT_SIDE.BOTTOM) ? -1 : 0)

   const params = {
      brick: brick,
      direction: { x: dirx, y: diry },
      // target_dist: 50, // in pixels
      target_dist: 30, // in pixels
      move_dist: 2.5, // in pixels
      brick_dim_ratio: w/h,
      brick_squash_lim: 7,
      brick_dim_x_initial: w,
      brick_dim_y_initial: h,

      score_mod:label,
      function_slope:slope_params_pointer,
      move_amt: 2.5,
   };

   Callback_animations_create(Animation_push_up_run, Animation_push_up_stop, params,);

   // Create explosion glow mesh
   const explosion_glow_size = h*3;
   const xx = hit_posx;
   const yy = hit_posy;
   const ex_glow_y = (yy) + (((y+h) - (yy))/2);
   Effects_create_explosion_glow(xx, ex_glow_y, explosion_glow_size, explosion_glow_size, hit_w, h, WHITE);

}

function Animation_push_up_run(params) {

   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;


   const brick = params.brick;
   const score_mod = params.score_mod.mesh;
   const mesh = brick.mesh;

   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   
   const slope = Logarithmic_interpolation(timer, slope_constant);


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

      // Create brick squash
      const lim = params.brick_squash_lim;
      const size = 2*(slope*.25+.3);
      // const size = slope;
      if(!brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim) {
         mesh.geom.dim[0] -= size;
         mesh.geom.dim[1] += size;
         if(mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = true;
      }
      else if(brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim){
         mesh.geom.dim[0] += size;
         mesh.geom.dim[1] -= size;
         if(mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = false;
      }
      mesh.geom.SetDimXY(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);
      Gl_set_dim_xy(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);
   }
   else if (diry !== 0) {
      
      mesh.geom.AddWposY(mesh.gfx, movey);
      params.target_dist -= params.move_dist;


      // Create brick squash
      const lim = params.brick_squash_lim;
      const size = 2*(slope*.25+.3);
      // const size = slope;
      if(!brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim) {
         mesh.geom.dim[0] += size;
         mesh.geom.dim[1] -= size;
         if(mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = true;
      }
      else if(brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim){
         mesh.geom.dim[0] -= size;
         mesh.geom.dim[1] += size;
         if(mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = false;
      }
      mesh.geom.SetDimXY(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);
      Gl_set_dim_xy(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);

   }
   
   { // Score modifier
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

   if (params.target_dist > 0) return true;
   return false

}

function Animation_push_up_stop(params) {

   // if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;


   // params.move_dist = 3;
   // params.target_dist = 25;
   params.move_dist = 2.5;
   params.target_dist = 30;
   // params.target_dist = 50;

   Callback_animations_create(Animation_pull_run, Animation_pull_stop, params,);
   return false;
}

function Animation_pull_run(params) {

   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;


   const brick = params.brick;
   const mesh = brick.mesh;
   const score_mod = params.score_mod.mesh;

   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);


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

         // Create brick squash
         const lim = params.brick_squash_lim;
         const size = 2*(slope*.3+.3);
         // const size = slope;
         if(!brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim) {
            mesh.geom.dim[0] -= size;
            mesh.geom.dim[1] += size;
            if(mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = true;
         }
         else if(brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim){
            mesh.geom.dim[0] += size;
            mesh.geom.dim[1] -= size;
            if(mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = false;
         }
         mesh.geom.SetDimXY(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);
         Gl_set_dim_xy(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);
      }
      else if (diry !== 0) {
         
         mesh.geom.AddWposY(mesh.gfx, -movey);
         params.target_dist -= params.move_dist;
         
         // Create brick squash
         const lim = params.brick_squash_lim;
         const size = 2*(slope*.3+.3);;
         // const size = slope;
         // const size = timer*2;
         if(!brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim) {
            mesh.geom.dim[0] += size;
            mesh.geom.dim[1] -= size;
            if(mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = true;
         }
         // else if((mesh.geom.dim[0]/mesh.geom.dim[1]) > params.brick_dim_ratio +.8) {
            else if(brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim){
            mesh.geom.dim[0] -= size;
            mesh.geom.dim[1] += size;
            if(mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = false;
         }
         mesh.geom.SetDimXY(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);
         Gl_set_dim_xy(mesh.gfx,  mesh.geom.dim[0],  mesh.geom.dim[1]);
      }
   }

   { // Score modifier
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

   // if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;


   // Brick set back initial dimentions
   params.brick.mesh.geom.dim[0] = params.brick_dim_x_initial;
   params.brick.mesh.geom.dim[1] = params.brick_dim_y_initial;
   params.brick.mesh.geom.SetDimXY(params.brick.mesh.gfx, params.brick.mesh.geom.dim[0],  params.brick.mesh.geom.dim[1]);
   Gl_set_dim_xy(params.brick.mesh.gfx,  params.brick.mesh.geom.dim[0],  params.brick.mesh.geom.dim[1]);

   // Set to initial position
   params.brick.mesh.geom.SetWposXY(params.brick.mesh.gfx, params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0], params.brick.mesh.geom.pos[1] + params.brick.mesh.geom.dim[1]);

   params.brick.mesh.SetColorRGBA(TRANSPARENCY(GREY[2], .3));
   // params.brick.mesh.SetColorRGBA(TRANSPARENCY(GREY[2], 1.));
   params.brick.is_active = false;
   params.brick.lock_squash_anim = false;

   // Create explosion circle
   Arkanoid_create_explosion_circle( params.brick.mesh.mat.defCol, params, );


   return false;
}









/**************************************************************************************************************************************************************/
// Brick Push-Pull animation

function Arkanoid_create_explosion_circle(color=BLUEL[9], params) {

   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;


   const w = params.brick.mesh.geom.dim[0];
   const h = params.brick.mesh.geom.dim[1];
   const x = params.brick.mesh.geom.pos[0];
   const y = params.brick.mesh.geom.pos[1];


   // Create explosion glow mesh
   const explosion_fx_idx = Effects_create_explosion_circle(x, y, h*4, h*4, w, h, color)
   const explosion_fx = Effect_explosion_circle_get_mesh_byidx(explosion_fx_idx);
   
   
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
   const coin_size = 16;
   const coin_idx = Coin_create(x, y, coin_size, coin_size, w, h);
   const coin = Coin_get_byidx(coin_idx);
   
   // Coin Glow effect
   const coin_glow_fx_idx = Effects_create_explosion_circle(x, y, coin_size*1.6, coin_size*1.6, w, h, YELLOW[9])
   const coin_glow_fx = Effect_explosion_circle_get_mesh_byidx(coin_glow_fx_idx);


   
   // Powup Glow effect
   // const powup_glow_fx_idx = Effects_create_explosion_circle(x, y, powup_size*1.6, powup_size*1.6, w, h, WHITE)
   // const powup_glow_fx = Effect_explosion_circle_get_mesh_byidx(powup_glow_fx_idx);
   
   const arkanoid_panel_center_posx = Arkanoid_get_panel_center_pos_x();
   const arkanoid_panel_right = Arkanoid_get_panel_right();
   const coin_center_posx = params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0];
   const dirx = (coin_center_posx < arkanoid_panel_center_posx) ? 1 : -1;

   const params_coins = {
      coin:coin,
      timer: 0, 
      timer_limit: 1, 
      timer_step: .01, 
      move_amt: .15,
      dirx: dirx,
      // Calc a max value on left and right position ends, and a min value in the middle, as a ratio
      coin_center_ratio:Quadratic_interpolation(0, arkanoid_panel_right, params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0]),

      coin_glow_fx: coin_glow_fx, 
   };
   Callback_animations_create(Animation_coin_run, Animation_coin_stop, params_coins,);


      
   // Create power up
   if(params.brick.powup_type_idx !== INT_NULL) {
      
      const powup_size = 16;
      const powup_idx = Powup_create(x, y, powup_size, powup_size, w, h, params.brick.powup_type_idx, params.brick.mesh.mat.col);
      const powup = Powup_get_byidx(powup_idx);
      const params_powup = {
         powup:powup,
         coin_center_ratio:Quadratic_interpolation(0, arkanoid_panel_right, params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0]),
         timer: 1, 
         timer_step: .01, 
         dir: 1, 
         // rand: GetRandomInt(10, 100) * .01,
         rand: 0,
   
         // powup_glow_fx: powup_glow_fx, 
         powup_glow_fx: null, 
      };
      Callback_animations_create(Animation_powup_run, Animation_powup_stop, params_powup,);
   }

}
function Animation_explosion_circle_run(params) {
   
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
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

      // Update text
      Set_color_a(score_mod.text_mesh, 1-params.timer, score_mod.text_mesh.geom.num_faces);
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt*1.2);

   }
   
   return true
   
}
function Animation_explosion_circle_stop(params) {
   // if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
   // Remove the explosion effect
   Effect_explosion_circle_remove_mesh_byidx(params.explosion_fx.idx);
   
   // Remove the score modifier text
   Score_mod_remove_text_mesh_byidx(params.score_mod.idx);

   return false;
}


function Animation_coin_run(params) {
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
   const coin = params.coin.mesh;

   // Check player-coin collision
   const player_top = Player_get_top();
   const player_dimy = Player_get_dimy();
   if(coin.geom.pos[1]+coin.geom.dim[1]*2 > player_top) {

      if(coin.geom.pos[1] < player_top+player_dimy*2){
         
         const player_hit = Player_check_coin_collision(coin.geom.pos[0], coin.geom.pos[0]+coin.geom.dim[0]*2, );
         
         if(player_hit) { // Remove the coin and run coin glow animation

            Coin_remove_byidx(params.coin.idx);
            
            // Set up the coin's glow animation
            Animation_coin_hit(params.coin_glow_fx);

            // Create explosion glow mesh
            const explosion_glow_size =  coin.geom.dim[0]*3;
            const x = coin.geom.pos[0];
            const y = coin.geom.pos[1];
            Effects_create_explosion_glow(x, y, explosion_glow_size, explosion_glow_size, coin.geom.dim[0], player_dimy, GREY[7]);
            
            return false;
         }
      }

      else if (coin.geom.pos[1] > VIEWPORT.BOTTOM + 100) { // else if coin exceeds limit y pos, remove it
         Coin_remove_byidx(params.coin.idx);
         Effect_explosion_circle_remove_mesh_byidx(params.coin_glow_fx.idx);
         return false;
      }

   }




   const coin_center_ratio = params.coin_center_ratio; // The more at the edges a coin is, the more of x dir movment the coin has. The more at the center the less x dir move.

   const coin_glow_fx = params.coin_glow_fx.mesh;
   
   params.timer += params.timer_step;

   // Avoid weird position if timer is equal or greater than 1
   if(params.timer > .999) params.timer = .999;
   
   const t = params.timer;
   const gravity = 10.0;
   const move_up_dist = 1.9;
   const reverse_time_mod = (1-t+.4); // "t+.x": avoids straight line down move 
   let x = 4 * coin_center_ratio * reverse_time_mod * (params.dirx); // Calc the ammount of x direction
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
      
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) {
      Coin_remove_byidx(params.coin.idx);
   }

   return false;
}


function Animation_powup_run(params) {
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
   const powup = params.powup.mesh;


   // Check player-powup collision
   const player_top = Player_get_top();
   const player_dimy = Player_get_dimy();

   if(powup.geom.pos[1]+powup.geom.dim[1]*2 > player_top) {

      if(powup.geom.pos[1] < player_top+player_dimy*2){
         
         const player_hit = Player_check_powup_collision(powup.geom.pos[0], powup.geom.pos[0]+powup.geom.dim[0]*2, );
         
         if(player_hit) { // Remove the powup and run powup glow animation

            Powup_remove_byidx(params.powup.idx);
            // Effect_explosion_circle_remove_mesh_byidx(params.powup_glow_fx.idx);
            
            // Set up the powup's glow animation
            const x = powup.geom.pos[0] + powup.geom.dim[0];
            const y = powup.geom.pos[1] + powup.geom.dim[1];
            Animation_powup_hit(x, y);

            // Resolve any powup
            Powup_resolve_hit(params.powup.idx, params.powup.type_idx);

            
   
            // Create explosion glow mesh
            const explosion_glow_size =  powup.geom.dim[0]*3;
            const xx = powup.geom.pos[0];
            const yy = powup.geom.pos[1];
            Effects_create_explosion_glow(xx, yy, explosion_glow_size, explosion_glow_size, powup.geom.dim[0], player_dimy, GREY[7]);
            // Effects_create_explosion_glow(x, y, explosion_glow_size, explosion_glow_size, powup.geom.dim[0], player_dimy, GREY[7]);
   
            return false;
         }
      }

      else if (powup.geom.pos[1] > VIEWPORT.BOTTOM + 100) { // else if powup exceeds limit y pos, remove it
         Powup_remove_byidx(params.powup.idx);
         // Effect_explosion_circle_remove_mesh_byidx(params.powup_glow_fx.idx);
         return false;
      }

   }

   
   params.timer += params.timer_step;
   if(params.timer >= 1) {
      params.dir = -1;
      params.timer_step = -.03;
      // params.timer=.0
      
   }
   if(params.timer <= -1) {
      params.dir = 1;
      params.timer_step = .03;
   }
   const t = (params.timer)*.5;
   
   const a = GetSign(t);
   const b = Abs(t);
   const x = b*a*8; // Bounce
   // const c = Abs((1*b)-1); // 0,2,0

   const f = 1;
   const bb = Abs(params.timer * f);
   const d = (bb)-f;
   // const y = (-((d+d*d+d)*d*4) ) + (bb*bb*4+bb+bb+bb+bb) + rand;
   // const y = (-((d+d*d+d)*d*4) ) + (bb*bb*8) + params.rand;
   // const y = ((-((d+d*d+d)*((d-.5)*2)) ) + (bb*bb*5)) * params.rand;
   // const y = ((-((d+d*d+d)*((d-.5)*1)) ) + (bb*bb*12)) + params.rand;
   const y = 1-(d + params.rand);
   
   // Update powup animation position
   powup.geom.pos[0] += x;
   powup.geom.pos[1] += y;
   Gl_add_wpos_xy(powup.gfx, x, y);
   
   return true
   
}
function Animation_powup_stop(params) {
   
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) {
      Powup_remove_byidx(params.powup.idx);
   }

   return false;
}


function Animation_coin_hit(coin_glow_fx) {

   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;

   //TODO: Also set up a player-coin hit glow + a score mod for the hit
   const time_step = 0.03, slope_const = 0.5, scale = 3;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   const x = coin_glow_fx.mesh.geom.pos[0] + coin_glow_fx.mesh.geom.dim[0];
   const y = coin_glow_fx.mesh.geom.pos[1] + coin_glow_fx.mesh.geom.dim[1];

   const text_mesh_idx = Score_mod_create(0.5, '+0.5', x, y, TEXTURES.MSDF_COMIC_1024, 5, _, YELLOW[9]);
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
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
   // Update score mode text glow position
   const score_mod = params.score_mod.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer(); 


   if(timer<1) {

      const slope = Logarithmic_interpolation(timer, slope_constant);
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt*10*(1-slope));
   }
   else if(params.alpha_timer<1){
      
      // TODO: Unecessary calls. MUST BE CALLED ONCE
      params.function_slope.SetSlope(1);
      
      
      score_mod.text_mesh.ScaleText((params.alpha_timer+1) * scale)
      
      Set_color_a(score_mod.text_mesh, 1-params.alpha_timer, score_mod.text_mesh.geom.num_faces);
      
      // score_mod.AddWposY(-params.move_amt*2);
      params.alpha_timer += params.alpha_timer_step;
   }



   const coin_glow_fx = params.coin_glow_fx;
   const dst_pos = [400, 0]; // Destination position to move to
   const src_pos = [coin_glow_fx.mesh.geom.pos[0], coin_glow_fx.mesh.geom.pos[1]];
   const dist = [dst_pos[0] - src_pos[0], dst_pos[1] - src_pos[1]];

   // Return if destination position of the coin glow is reached
   if(Abs(dist[1]) < 10) {
      Effect_explosion_circle_remove_mesh_byidx(params.coin_glow_fx.idx);
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
   // if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
   // Remove the score modifier text
   const score_mod = params.score_mod;

   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) {
      // score_mod.text_mesh.ScaleText((params.alpha_timer+1) * scale)
      Set_color_a(score_mod.mesh.text_mesh, 0, score_mod.mesh.text_mesh.geom.num_faces);

      Effect_explosion_circle_remove_mesh_byidx(params.coin_glow_fx.idx);
   }

   Score_mod_remove_text_mesh_byidx(score_mod.idx);
   
   return false;
}


function Animation_powup_hit(x, y) {

   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;

   //TODO: Also set up a player-brick hit glow + a score mod for the hit
   const time_step = 0.03, slope_const = 0.5, scale = 3;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);


   const text_mesh_idx = Score_mod_create(0.2, '+0.2', x, y, TEXTURES.MSDF_COMIC_1024, 5, _, WHITE);
   const label = Score_mod_get_text_mesh_byidx(text_mesh_idx);


   // console.log('---Create', text_mesh_idx)
   const params_powup = {
      score_mod:label,
      function_slope:slope_params_pointer,
      move_amt: .25,
      alpha_timer:0,
      alpha_timer_step:0.02,
   };
   Callback_animations_create(Animation_powup_hit_run, Animation_powup_hit_stop, params_powup,);
}
function Animation_powup_hit_run(params) {
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) return false;
   
   // Update score mode text glow position
   const score_mod = params.score_mod.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetValueChange();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer(); 



   if(timer<1) {

      const slope = Logarithmic_interpolation(timer, slope_constant);
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt*10*(1-slope));
      
   }
   else if(params.alpha_timer<1){
      
      // TODO: Unecessary calls. MUST BE CALLED ONCE
      params.function_slope.SetSlope(1);
      
      score_mod.text_mesh.ScaleText((params.alpha_timer+1) * scale)
      Set_color_a(score_mod.text_mesh, 1-params.alpha_timer, score_mod.text_mesh.geom.num_faces);
      // score_mod.AddWposY(-params.move_amt*2);
      params.alpha_timer += params.alpha_timer_step;
   }
   else return false;


   return true;
}
function Animation_powup_hit_stop(params) {
   
   const score_mod = params.score_mod;
   
   if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) {
      // score_mod.text_mesh.ScaleText((params.alpha_timer+1) * scale)
      Set_color_a(score_mod.mesh.text_mesh, 0, score_mod.mesh.text_mesh.geom.num_faces);
   }

   // Remove the score modifier text
   Score_mod_remove_text_mesh_byidx(score_mod.idx);
   
   return false;
}






/**********************************************************************************************************************************/
// TESTS animations
















/*****************************************************************************************************************************/
// Tests

function Test_Bricks_calc_row_from_pos() {
   console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=',)

   const times = 8;
   const rowy_start = bricks_row_0_y;
   let posy = 0;
   for (let i = 0; i < BRICKS.CURRENT_SCHEMA.length; i++) {
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