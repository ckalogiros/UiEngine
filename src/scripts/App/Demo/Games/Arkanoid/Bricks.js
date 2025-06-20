"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Free_generic_buffer, Free_int8_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Effects_create_explosion_circle, Effects_create_explosion_glow, Effect_explosion_circle_get_mesh_byidx, Effect_explosion_circle_remove_mesh_byidx } from "../../../../Engine/Drawables/Effects/Effects.js";
import { BLUEL, GREY, PURPLE, TRANSPARENT, YELLOW } from "../../../../Engine/Drawables/Material/Colors.js";
import { Mesh_add_wpos_x, Mesh_add_wpos_xy, Mesh_add_wpos_y, Mesh_set_color_rgba, Mesh_update_set_dim_xy, Mesh_update_set_wpos_xy, Set_color_a } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_set_name } from "../../../../Engine/Drawables/Operations/MeshPropertiesFunctions.js";
import { Gl_add_wpos_xy, Gl_add_wpos_y, Gl_set_dim_xy, Gl_set_rgba, Gl_set_time, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetSign } from "../../../../Helpers/Helpers.js";
import { Function_Slope, Logarithmic_interpolation, Quadratic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Floor, Min } from "../../../../Helpers/Math/MathOperations.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Arkanoid_combo_counter_add, Arkanoid_create_update_game_loop, Arkanoid_get_panel_dim_x, Arkanoid_get_panel_pos_x, Arkanoid_get_panel_right, ARKANOID_SECTION_DIM_X } from "./Arkanoid.js";
import { ARK_STATE, ARKANOID_COLORS, ARKANOID_FLAGS, BRICK_STAGES } from "./ArkanoidConstants.js";
import { Coin_create } from "./Coin.js";
import { Player_get_dimy, Player_get_top, Player_check_powup_collision } from "./Player.js";
import { Powup_create, Powup_get_byidx, Powup_remove_byidx, Powup_resolve_hit } from "./PowerUps.js";
import { Score_mod_create, Score_mod_get_text_mesh_byidx, Score_mod_remove_text_mesh_byidx } from "./ScoreMod.js";
import { Widget_render } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetRender.js";
import { Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_render_specific_render_group } from "../../../../Engine/Core/Views/MeshBufferViews.js";








/** */
const BRICKS = {
   STAGE_SCHEMA: [],
   CURRENT_STAGE_INDEX: 0,
   SIZE: 0,
   VB_GROUP_IDX: INT_NULL,
   RATIO: 75 / 40,
   TYPES: [],
   HIT_SIDE: {},
   SCALE_DOWN: 1,
   PRE_INITIALIZED_MESHES: 80,
   ROW_PAD: 3, // Pad between rows
   COLUMN_PAD: 3, // Pad between columns
   PAD_X: 20, // Panel left-right pad
   PAD_Y: 30, // Panel TOP pad
   DIM_X: 0,
   DIM_Y: 0,
   DIM_X_SCALED: 0,
   DIM_Y_SCALED: 0,
   R_CORNERS: 10,
   ROW_HEIGHT: 0,
   COL_WIDTH: 0,
   PARENT: null,

   Reset() {
      this.CURRENT_STAGE_INDEX = 0;
   }
};
/** */
function Bricks_init() {

   BRICKS.STAGE_SCHEMA = BRICK_STAGES[BRICKS.CURRENT_STAGE_INDEX];

   const num_bricks_in_row = BRICKS.STAGE_SCHEMA[0].length;
   const total_padding_x = ((num_bricks_in_row - 1) * BRICKS.COLUMN_PAD) + (BRICKS.PAD_X * 2);
   BRICKS.SIZE = ((ARKANOID_SECTION_DIM_X * 2 - total_padding_x) / num_bricks_in_row) / 2;
   BRICKS.DIM_X_SCALED = (BRICKS.SIZE) * BRICKS.SCALE_DOWN;
   BRICKS.DIM_Y_SCALED = (BRICKS.SIZE / BRICKS.RATIO) * BRICKS.SCALE_DOWN;
   BRICKS.DIM_X = BRICKS.DIM_X_SCALED;
   BRICKS.DIM_Y = BRICKS.DIM_Y_SCALED;
   BRICKS.ROW_HEIGHT = BRICKS.DIM_Y_SCALED * 2 + BRICKS.COLUMN_PAD;
   // BRICKS.COL_WIDTH = BRICKS.DIM_X_SCALED * 2 + BRICKS.ROW_PAD;
   BRICKS.COL_WIDTH = BRICKS.DIM_X_SCALED * 2 + BRICKS.ROW_PAD;


   BRICKS.HIT_SIDE = {
      NONE: 0x0,
      LEFT: 0x1,
      RIGHT: 0x2,
      TOP: 0x4,
      BOTTOM: 0x8,
   }
}
/** */
function Bricks_resolve_color_from_flag(FLAG) {

   // .7, .65, 1., .5
   // const yellow = new Float32Array([1, .65, 0, 1]);   Mult_arr3_scalar(yellow, .7);
   // const purple = new Float32Array([.75, 0, 1., 1]);  Mult_arr3_scalar(purple, .65);
   // const blue = new Float32Array([0, .5, 1, 1]);       Mult_arr3_scalar(blue, 1.);
   // const green = new Float32Array([0., 1., 0., 1]);    Mult_arr3_scalar(green, .5);
   // if (FLAG & ARKANOID_FLAGS.BRICK_COLOR_GREEN) return GREEN[4];
   if (FLAG & ARKANOID_FLAGS.BRICK_COLOR_GREEN) return ARKANOID_COLORS.green;
   if (FLAG & ARKANOID_FLAGS.BRICK_COLOR_BLUE) return ARKANOID_COLORS.blue;
   if (FLAG & ARKANOID_FLAGS.BRICK_COLOR_PURPLE) return ARKANOID_COLORS.purple;
   if (FLAG & ARKANOID_FLAGS.BRICK_COLOR_YELLOW) return ARKANOID_COLORS.yellow;

}
/** */
let bricks_row_0_x = 0, bricks_row_0_y = 0; // This is the distance of the first row from the arkanoid panel left-top position
/** */
const _bricks_buffer = New_generic_buffer(_, 'Arkanoid-BricksBuffer');
/** */
const _free_brick_idxs_buffer = New_int8_buffer(BRICKS.PRE_INITIALIZED_MESHES, '_free_brick_idxs_buffer');
/** */
const _bricks_rows = New_generic_buffer(_, '_bricks_rows');
/** */
const _bricks_counter = {
   rows_alive: 0,
   count: 0,
};


/** */
export function Arkanoid_bricks_reset() {

   _bricks_buffer.ResetFull();
   _bricks_rows.ResetFull();
   _free_brick_idxs_buffer.Reset();
   _bricks_counter.rows_alive = 0;
   _bricks_counter.count = 0;

   BRICKS.Reset();
}
/** */
export function Arkanoid_bricks_destroy() {

   Free_generic_buffer(_bricks_buffer);
   Free_generic_buffer(_bricks_rows);
   Free_int8_buffer(_free_brick_idxs_buffer);
}
/** */
let aaa = true
export class Brick {

   constructor(x = 0, y = 0, color, name = 'BRICK', flags = 0x0, groupidx, parent=null) {

      const posx = x;
      const posy = y;

      const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [x, y, 1], dim: [BRICKS.DIM_X_SCALED, BRICKS.DIM_Y_SCALED], col: color, name: name, }));
      // const mesh = Create_rect_mesh(Style_rect_default_properties({ is_root:ROOT_WIDGETS.CREATE_ROOT, pos: [0, 0, 1], dim: [BRICKS.DIM_X_SCALED, BRICKS.DIM_Y_SCALED], col: color, name: name, }));
      Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 10, enable_src_color_in_main: true, });


      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
      // mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

      // mesh.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      // this.generic_control_values = [.4, .75, 1., .23];
      this.generic_control_values = [.4, .75, 1., .23];
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, this.generic_control_values.length);


      // Must be set before GenGfxCtx call
      mesh.parent = parent; // HACK: Adding parent on the fly! mainly for picking the same rendergroup for all balls
      // parent.AddItem(mesh);// HACK: Adding mesh as a child helps for searching from parent to locate all other coins and choose the same render group

      // console.error('***************************************************************')
      mesh.SetViewGroupIndex(groupidx);
      mesh.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET|GFX_CTX_FLAGS.RENDER_GROUP_MATCH_FROM_RENDER_GROUP);
      if(aaa) {
         mesh.gfx_ctx_flags |= GFX_CTX_FLAGS.RENDER_GROUP_NEW;
         aaa=false;
      }
      mesh.GenGfxCtx();
      // Widget_render(mesh);
      View_render_specific_render_group(mesh.group_bufferidxs[0], mesh.group_bufferidxs[1], mesh.group_bufferidxs[2], true);

      // // mesh.GfxUniformSetAndUpdate('u_generic_controls', this.generic_control_values); // Sdf-InnerShadow-Glow
      mesh.GfxUniformsSetClbk('u_generic_controls', () => { return this.generic_control_values; }, mesh.gfx.vb.groupidx);
      // mesh.GfxUniformSetAndUpdate('u_scale2', [1, 1]);

      mesh.geom.dim[0] = BRICKS.DIM_X;
      mesh.geom.dim[1] = BRICKS.DIM_Y;

      this.mesh = mesh;
      this.is_active = false;
      this.flags = flags;
      this.lock_squash_anim = false;
      this.hit_side = BRICKS.HIT_SIDE.NONE;

      this.idx = _bricks_buffer.Add(this);
      this.powup_type_idx = INT_NULL;

   }
}
/** */
export function Brick_get_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bricks_buffer.buffer[idx] === undefined) alert('1231231231231 Wrong index for _bricks_buffer')
   return _bricks_buffer.buffer[idx];
}
/** Removes the coin mesh from the storage buffer and from rendering, but mesh still remains in the application */
export function Brick_remove_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bricks_buffer.buffer[idx] === undefined) alert('1231231231232 Wrong index for _bricks_buffer')

   const mesh = _bricks_buffer.buffer[idx].mesh;

   Mesh_set_color_rgba(mesh, TRANSPARENT);

   _bricks_buffer.buffer[idx].is_active = false;
   _free_brick_idxs_buffer.Add(idx);

}
/** Removes the coin mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application) */
export function Brick_destroy_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bricks_buffer.buffer[idx] === undefined) alert('1231231231233 Wrong index for _bricks_buffer')
   const mesh = _bricks_buffer.buffer[idx].mesh;
   _bricks_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}
/** */
export function Bricks_init_buffer(x=0, y=0, groupidx, parent, num_effect_meshes = BRICKS.PRE_INITIALIZED_MESHES) {

   Bricks_init();

   let brick = null;

   for (let i = 0; i < num_effect_meshes; i++) {

      brick = new Brick(x, y, _, _, _, groupidx, parent);

      // Implement to draw wpos from a root uniform wpos 
      // if (parent !== null) Mesh_unif_hack_parent_root_wpos(brick.mesh.gfx.vb.render_groupidx, parent.root_posidx, parent.mesh_bufferidx);

      Brick_remove_byidx(brick.idx);
   }

   
   const br = _bricks_buffer.buffer[0];
   br.mesh.GfxUniformSetAndUpdate('u_scale2', [BRICKS.SCALE_DOWN, 1]);
   br.mesh.GfxUniformSetAndUpdate('u_generic_controls', br.generic_control_values); // Sdf-InnerShadow-Glow
   // br.mesh.GfxUniformsSetClbk('u_generic_controls', ()=>{ 
   //    return br.generic_control_values; 
   // }, br.mesh.gfx.vb.groupidx);

   BRICKS.VB_GROUP_IDX = brick.mesh.gfx.vb.groupidx;
   BRICKS.PARENT = parent;

   return brick;
}
/** */
export function Bricks_reset_all_deactivated_bricks() {

   for (let i = 0; i <= _bricks_buffer.boundary; i++) {

      const brick = _bricks_buffer.buffer[i];
      Gl_set_rgba(brick.mesh.gfx, TRANSPARENT);
   }

   // Reset, because the columnns number may differ from stage to stage. So we need to reallocate the columns on each stage
   _bricks_rows.ResetFull();

   _bricks_counter.count = 0;
}
/** */
function Bricks_create(x, y, color, name, flags, groupidx) {

   let idx = INT_NULL;

   const freeidx = _free_brick_idxs_buffer.boundary;
   const br_dim_x = BRICKS.DIM_X, br_dim_y = BRICKS.DIM_Y;


   if (freeidx >= 0) {

      idx = _free_brick_idxs_buffer.buffer[freeidx];
      const brick = _bricks_buffer.buffer[idx];

      brick.mesh.geom.pos[0] = brick.mesh.geom.defPos[0] = x;
      brick.mesh.geom.pos[1] = brick.mesh.geom.defPos[1] = y;
      Gl_set_wpos_xy(brick.mesh.gfx, brick.mesh.geom.pos[0] + br_dim_x, brick.mesh.geom.pos[1] + brick.mesh.geom.dim[1]);

      Mesh_set_color_rgba(brick.mesh, color);
      Mesh_set_name(brick.mesh, name);

      brick.flags = flags;

      // Remove from the free idxs buffer
      _free_brick_idxs_buffer.RemoveByIdx(freeidx);
   }
   else { // If no apropriate free mesh was found, create new mesh

      const brick = new Brick(0, 0, color, name, flags, groupidx, BRICKS.PARENT);
      idx = brick.idx;

      brick.mesh.geom.pos[0] = brick.mesh.geom.defPos[0] = x;
      brick.mesh.geom.pos[1] = brick.mesh.geom.defPos[1] = y;
      Gl_set_wpos_xy(brick.mesh.gfx, brick.mesh.geom.pos[0] + br_dim_x, brick.mesh.geom.pos[1] + brick.mesh.geom.dim[1]);

      // Update the free buffer, otherwise it may have less elements that the current bricks buffer.
      if (idx >= _free_brick_idxs_buffer.size) {

         const new_elem_idx = _free_brick_idxs_buffer.AddAtIndex(_free_brick_idxs_buffer.size, 127);
         _free_brick_idxs_buffer.RemoveByIdx(new_elem_idx);
      }
   }


   _bricks_counter.count++;

   // return idx;
   return _bricks_buffer.buffer[idx];

}

/** */
export function Bricks_set_stage_bricks(x = 0, y = 0, groupidx) {

   // Here we add any padding for the bricks rows positioning
   // The brick row 0 is the refference position to remove all unecessary pading for calculating the row from the ball's position
   // bricks_row_0_x = x+BRICKS.PAD_X;
   // bricks_row_0_y = y+BRICKS.PAD_Y;
   bricks_row_0_x = BRICKS.PAD_X;
   bricks_row_0_y = BRICKS.PAD_Y;

   let posx = x + bricks_row_0_x, posy = y + bricks_row_0_y;
   // let posx = bricks_row_0_x, posy = bricks_row_0_y;

   let vb_groupidx = BRICKS.VB_GROUP_IDX;

   BRICKS.STAGE_SCHEMA = BRICK_STAGES[BRICKS.CURRENT_STAGE_INDEX++];
   const scema = BRICKS.STAGE_SCHEMA;

   const rows_len = BRICKS.STAGE_SCHEMA.length;
   for (let i = 0; i < rows_len; i++) {

      const cols_len = scema[i].length;

      _bricks_rows.Add(New_int16_buffer(cols_len, `Bricks row:${i}`)); // Create new row buffer


      for (let j = 0; j < cols_len; j++) {

         const flags = scema[i][j];

         if (flags !== 0) {

            const color = Bricks_resolve_color_from_flag(flags);

            const brick = Bricks_create(posx, posy, color, `br-${i}-${j}`, flags, groupidx);
            _bricks_rows.buffer[i].AddAtIndex(j, brick.idx);

            _bricks_buffer.buffer[brick.idx].mesh.geom.pos[1] -= 800;
            Gl_add_wpos_y(_bricks_buffer.buffer[brick.idx].mesh.gfx, -800);

            if (vb_groupidx === INT_NULL) {
               vb_groupidx = brick.mesh.gfx.vb.groupidx;
               BRICKS.VB_GROUP_IDX = brick.mesh.gfx.vb.groupidx;
            }
         }

         posx += (BRICKS.DIM_X * 2) + BRICKS.COLUMN_PAD;
      }

      posy += BRICKS.ROW_HEIGHT;
      posx = x + bricks_row_0_x;
      // posx = bricks_row_0_x;

   }

   // Calculate number of alive rows 
   Bricks_set_alive_rows_counter();

   // console.log('[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[', _bricks_rows)

   return _bricks_buffer;
}
/** */
function Bricks_set_alive_rows_counter() {

   for (let i = 0; i <= _bricks_rows.boundary; i++) {

      const column_num_bricks = _bricks_rows.buffer[i].boundary + 1;
      if (column_num_bricks > 0) {

         _bricks_counter.rows_alive++;
      }
   }

   // console.warn('_bricks_counter', _bricks_counter);
}
/** */
export function Bricks_get_alive_rows_counter() {
   return _bricks_counter.rows_alive;
}
/** */
export function Bricks_is_any_brick_alive() {
   if (_bricks_counter.rows_alive > 0) return true;
   return false;
}
/** */
function Bricks_calc_row_from_pos(y) {

   const clean_posy = y - bricks_row_0_y;

   if (y < bricks_row_0_y) return INT_NULL; // Case the y pos is above of first row pos
   else if (clean_posy < BRICKS.ROW_HEIGHT) return 0; // Case the y pos is on the first row(0-th index)

   
   const rowy = (clean_posy) / BRICKS.ROW_HEIGHT;
   const row = Floor(rowy);
   // console.log(y, row)

   if (row >= BRICKS.STAGE_SCHEMA.length) return INT_NULL;// Case the pos is lower of the lowest row
   return row;

}
/** */
function Bricks_calc_column_from_pos(x) {

   const clean_posx = x - bricks_row_0_x;

   if (x < bricks_row_0_x) return INT_NULL; // Case the x pos is left of first column pos
   else if (clean_posx < BRICKS.COL_WIDTH) return 0; // Case the x pos is on the first column

   const coly = (clean_posx) / BRICKS.COL_WIDTH;
   const col = Floor(coly);

   if (col >= BRICKS.STAGE_SCHEMA[0].length) return INT_NULL; // Case the pos is right of the right most column
   return col;

}
/** */
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

   const is_any_brick_alive = Bricks_is_any_brick_alive();
   // if(!is_any_brick_alive) ARK_STATE.RESET(ARK_STATE.STAGE_COMPLETED_INITIATED);
   if (!is_any_brick_alive)
      ARK_STATE.ADD(ARK_STATE.STAGE_COMPLETED_INITIATED);

   const ret = [1, 1];

   const rc = Bricks_find_rows_from_pos(posx, posy, dimx, dimy);
   const rows_found = rc.rows;
   const cols_found = rc.cols;
   const rows_len = rc.rows_len;
   const cols_len = rc.cols_len;

   const br_dim_x = BRICKS.DIM_X, br_dim_y = BRICKS.DIM_Y;

   for (let i = 0; i < rows_len; i++) {

      const rowidxs = _bricks_rows.buffer[rows_found[i]]; // Get the row of brick indexes

      for (let j = 0; j < cols_len; j++) {

         const elem_idx = rowidxs.buffer[cols_found[j]]; // elem_idx is the index of the brick in the _bricks_buffer
         if (elem_idx !== INT_NULL) { // If there is no brick at this row-column, elem_idx should be INT_NULL

            const brick = _bricks_buffer.buffer[elem_idx];

            // check the actual ball-brick meshes collision
            const br_l = brick.mesh.geom.pos[0];
            const br_r = brick.mesh.geom.pos[0] + br_dim_x * 2;
            const br_t = brick.mesh.geom.pos[1];
            const br_b = brick.mesh.geom.pos[1] + brick.mesh.geom.dim[1] * 2;
            const l = posx;
            const r = posx + (dimx * 2);
            const t = posy;
            const b = posy + (dimy * 2);

            // console.log('br_l', br_l, 'br_t', br_t)
            // console.log('br_t', br_t,'ball t', t, )

            if (r > br_l && l < br_r && b > br_t && t < br_b) {

               /**
                * // TODO: Since we need to resolve the hit side by conventional means, maybe the 'fancy' point of contact calculation must go!
                */

               // Find the point of contact

               let l2 = Abs(r - difx - br_l); // From brick's left side
               let r2 = Abs(l - difx - br_r); // From brick's right side
               let t2 = Abs(b - dify - br_t); // From brick's top side
               let b2 = Abs(t - dify - br_b); // From brick's bottom side

               const x = Abs(Min(l2, r2));
               const y = Abs(Min(t2, b2));

               /** // TODO: We need the balls direction on the point of contact to correctly calculate diagonal collisions */


               // HIT SIDE
               if (x < y) {
                  ret[0] = -1;
                  if (dirx < 0) brick.hit_side = BRICKS.HIT_SIDE.RIGHT;
                  else if (dirx > 0) brick.hit_side = BRICKS.HIT_SIDE.LEFT;
                  else alert('887766 NO X DIR WAS RESOLVED. PROBABLY DIR=0 ')
               }
               else {
                  ret[1] = -1;
                  if (diry < 0) brick.hit_side = BRICKS.HIT_SIDE.BOTTOM;
                  else if (diry > 0) brick.hit_side = BRICKS.HIT_SIDE.TOP;
                  else alert('887766 NO Y DIR WAS RESOLVED. PROBABLY DIR=0 ')
               }
               // DO NOT DELETE: Diagonal point of contact
               // if(Abs(x-y) < 10) { ret[0] = -1; ret[1] = -1; } // Diagonal point of contact

               // HERE
               // TODO: Create squash for the ball. Stop the ball's move on hit, run squash animation, then return to moving again

               // Remove mesh from the brick row(by setting the index to INT_NULL)
               // rowidxs.buffer[cols_found[j]] = INT_NULL;
               rowidxs.RemoveByIdx(cols_found[j]);
               if (rowidxs.boundary < 0) {
                  _bricks_counter.rows_alive--;
               }

               _free_brick_idxs_buffer.Add(brick.idx)

               Clbk_animation_push(brick, posx, posy, dimx, dimy);

               Arkanoid_combo_counter_add(1);

               return ret;
            }
         }
      }
   }
   return ret;
}
/** */
export function Bricks_check_collision_column_only(posx, posy, dimx, dimy, diry) {

   const ret = [1, 1];

   const rc = Bricks_find_rows_from_pos(posx, posy, dimx, dimy);
   const rows_found = rc.rows;
   const cols_found = rc.cols;
   const rows_len = rc.rows_len;
   const cols_len = rc.cols_len;

   const br_dim_x = BRICKS.DIM_X, br_dim_y = BRICKS.DIM_Y;

   for (let i = 0; i < rows_len; i++) {

      const rowidxs = _bricks_rows.buffer[rows_found[i]]; // Get the row of brick indexes

      for (let j = 0; j < cols_len; j++) {

         const elem_idx = rowidxs.buffer[cols_found[j]]; // elem_idx is the index of the brick in the _bricks_buffer
         if (elem_idx !== INT_NULL) { // If there is no brick at this row-column, elem_idx should be INT_NULL

            const brick = _bricks_buffer.buffer[elem_idx];

            // check the actual ball-brick meshes collision
            const br_l = brick.mesh.geom.pos[0];
            const br_r = brick.mesh.geom.pos[0] + br_dim_x * 2;
            const br_t = brick.mesh.geom.pos[1];
            const br_b = brick.mesh.geom.pos[1] + br_dim_y * 2;
            const l = posx;
            const r = posx + (dimx * 2);
            const t = posy;
            const b = posy + (dimy * 2);

            if (r > br_l && l < br_r && b > br_t && t < br_b) {

               ret[1] = -1;
               if (diry < 0) brick.hit_side = BRICKS.HIT_SIDE.BOTTOM;
               else if (diry > 0) brick.hit_side = BRICKS.HIT_SIDE.TOP;
               else alert('887766 NO Y DIR WAS RESOLVED. PROBABLY DIR=0 ')

               // Remove mesh from the brick row(by setting the index to INT_NULL)
               rowidxs.RemoveByIdx(cols_found[j]);
               if (rowidxs.boundary < 0) {
                  _bricks_counter.rows_alive--;
                  // console.warn(_bricks_counter)
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

/** */
function Clbk_animation_push(brick, hit_posx, hit_posy, hit_w, hit_h, time_step = 0.02, slope_const = 0.2, scale = 2) {

   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   const w = brick.mesh.geom.dim[0];
   const h = brick.mesh.geom.dim[1];
   const x = brick.mesh.geom.pos[0];
   const y = brick.mesh.geom.pos[1];

   const score_mod_idx = Score_mod_create(1.2, 'x1.2', x, y, TEXTURES.MTSDF_COMIC_1024, 5, _, YELLOW[9], BRICKS.VB_GROUP_IDX, BRICKS.PARENT);
   const score_mod = Score_mod_get_text_mesh_byidx(score_mod_idx);

   // Resolve the hit direction to move the brick
   const dirx = (brick.hit_side & BRICKS.HIT_SIDE.LEFT) ? 1 : ((brick.hit_side & BRICKS.HIT_SIDE.RIGHT) ? -1 : 0)
   const diry = (brick.hit_side & BRICKS.HIT_SIDE.TOP) ? 1 : ((brick.hit_side & BRICKS.HIT_SIDE.BOTTOM) ? -1 : 0)

   const params = {
      brick: brick,
      direction: { x: dirx, y: diry },
      target_dist: 30, // in pixels
      move_dist: 2.5, // in pixels
      brick_dim_ratio: w / h,
      brick_squash_lim: 7,
      brick_dim_x_initial: w,
      brick_dim_y_initial: h,

      score_mod: score_mod,
      function_slope: slope_params_pointer,
      move_amt: 2.5,
   };

   Callback_animations_create(Animation_push_up_run, Animation_push_up_stop, params,);

   // Create explosion glow mesh
   const explosion_glow_size = h * 3;
   const xx = hit_posx;
   const yy = hit_posy;
   const ex_glow_y = (yy) + (((y + h) - (yy)) / 2);
   Effects_create_explosion_glow(xx, ex_glow_y, explosion_glow_size, explosion_glow_size, hit_w, h, GREY[8]);

}
/** */
function Animation_push_up_run(params) {

   const brick = params.brick;
   const score_mod = params.score_mod.mesh;
   const mesh = brick.mesh;

   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);


   // Direction of movement
   const dirx = params.direction.x;
   const diry = params.direction.y;
   const movex = params.move_dist * dirx;
   const movey = params.move_dist * diry;



   if (dirx !== 0 && diry !== 0) {

      Mesh_add_wpos_xy(mesh, movex, movey);
      params.target_dist -= params.move_dist;
   }
   else if (dirx !== 0) {

      Mesh_add_wpos_x(mesh, movex);
      params.target_dist -= params.move_dist;

      // Create brick squash
      const lim = params.brick_squash_lim;
      const size = 2 * (slope * .25 + .3);
      // const size = slope;
      if (!brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim) {
         mesh.geom.dim[0] -= size;
         mesh.geom.dim[1] += size;
         if (mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = true;
      }
      else if (brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim) {
         mesh.geom.dim[0] += size;
         mesh.geom.dim[1] -= size;
         if (mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = false;
      }
      Mesh_update_set_dim_xy(mesh);
      Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);
   }
   else if (diry !== 0) {

      Mesh_add_wpos_y(mesh, movey);
      params.target_dist -= params.move_dist;


      // Create brick squash
      const lim = params.brick_squash_lim;
      const size = 2 * (slope * .25 + .3);
      // const size = slope;
      if (!brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim) {
         mesh.geom.dim[0] += size;
         mesh.geom.dim[1] -= size;
         if (mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = true;
      }
      else if (brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim) {
         mesh.geom.dim[0] -= size;
         mesh.geom.dim[1] += size;
         if (mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = false;
      }
      Mesh_update_set_dim_xy(mesh);
      Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);

   }

   { // Score modifier
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt);
   }

   if (params.target_dist > 0) return true;
   return false

}
/** */
function Animation_push_up_stop(params) {

   params.move_dist = 2.5;
   params.target_dist = 30;

   Callback_animations_create(Animation_pull_run, Animation_pull_stop, params,);
   return false;
}
/** */
function Animation_pull_run(params) {

   const brick = params.brick;
   const mesh = brick.mesh;
   const score_mod = params.score_mod.mesh;

   const slope_constant = params.function_slope.GetSlope();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   const scale = params.function_slope.GetAmmount();

   const slope = Logarithmic_interpolation(timer, slope_constant);


   // Direction of movement
   const dirx = params.direction.x;
   const diry = params.direction.y;
   const movex = params.move_dist * dirx;
   const movey = params.move_dist * diry;

   if (params.target_dist > 0) {

      if (dirx !== 0 && diry !== 0) {

         Mesh_add_wpos_xy(mesh, -movex, -movey);
         params.target_dist -= params.move_dist;
      }
      else if (dirx !== 0) {

         Mesh_add_wpos_x(mesh, -movex);
         params.target_dist -= params.move_dist;

         // Create brick squash
         const lim = params.brick_squash_lim;
         const size = 2 * (slope * .3 + .3);
         if (!brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim) {
            mesh.geom.dim[0] -= size;
            mesh.geom.dim[1] += size;
            if (mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = true;
         }
         else if (brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim) {
            mesh.geom.dim[0] += size;
            mesh.geom.dim[1] -= size;
            if (mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = false;
         }
         Mesh_update_set_dim_xy(mesh);
         Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);
      }
      else if (diry !== 0) {

         Mesh_add_wpos_y(mesh, -movey);
         params.target_dist -= params.move_dist;

         // Create brick squash
         const lim = params.brick_squash_lim;
         const size = 2 * (slope * .3 + .3);;
         if (!brick.lock_squash_anim && mesh.geom.dim[0] < params.brick_dim_x_initial + lim) {
            mesh.geom.dim[0] += size;
            mesh.geom.dim[1] -= size;
            if (mesh.geom.dim[0] >= params.brick_dim_x_initial + lim) brick.lock_squash_anim = true;
         }
         else if (brick.lock_squash_anim && mesh.geom.dim[0] > params.brick_dim_x_initial - lim) {
            mesh.geom.dim[0] -= size;
            mesh.geom.dim[1] += size;
            if (mesh.geom.dim[0] <= params.brick_dim_x_initial - lim) brick.lock_squash_anim = false;
         }
         Mesh_update_set_dim_xy(mesh);
         Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);
      }
      { // Score modifier
         score_mod.text_mesh.ScaleText(slope * scale)
         score_mod.AddWposY(params.move_amt * .6);
      }
      return true;
   }

   return false
}
/** */
function Animation_pull_stop(params) {

   // Brick set back initial dimentions
   params.brick.mesh.geom.dim[0] = params.brick_dim_x_initial;
   params.brick.mesh.geom.dim[1] = params.brick_dim_y_initial;
   Mesh_update_set_dim_xy(params.brick.mesh);
   Gl_set_dim_xy(params.brick.mesh.gfx, params.brick.mesh.geom.dim[0], params.brick.mesh.geom.dim[1]);

   // Set to initial position
   Mesh_update_set_wpos_xy(params.brick.mesh);

   Mesh_set_color_rgba(params.brick.mesh, TRANSPARENCY(GREY[2], .3));
   params.brick.is_active = false;
   params.brick.lock_squash_anim = false;

   // Create explosion circle
   Arkanoid_create_explosion_circle(params.brick.mesh.mat.defCol, params,);


   return false;
}









/**************************************************************************************************************************************************************/
// Brick Push-Pull animation

/** */
function Arkanoid_create_explosion_circle(color = BLUEL[9], params) {

   const w = params.brick.mesh.geom.dim[0];
   const h = params.brick.mesh.geom.dim[1];
   const x = params.brick.mesh.geom.pos[0];
   const y = params.brick.mesh.geom.pos[1];


   // Create explosion glow mesh
   {
      const ring_diameter = .4, intensity = .03;
      const explosion_fx_idx = Effects_create_explosion_circle(x, y, h * 4, h * 4, w, h, color, ring_diameter, intensity);
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
   }



   // Create coin mesh, coin glow mesh and animation
   const coin_size = 16;
   const game_panel_posx = Arkanoid_get_panel_pos_x();
   const game_panel_dimx = Arkanoid_get_panel_dim_x();
   Coin_create(x, y, coin_size, coin_size, w, h, game_panel_posx, game_panel_dimx, params.brick.mesh.geom.pos[0], params.brick.mesh.geom.dim[0]);



   // Create power up
   if (params.brick.flags & (ARKANOID_FLAGS.POWUP_)) {

      const arkanoid_panel_right = Arkanoid_get_panel_right();
      const powup_size = 16;
      const powup_idx = Powup_create(x, y, powup_size, powup_size, w, h, params.brick.flags, params.brick.mesh.mat.col);
      const powup = Powup_get_byidx(powup_idx);
      const params_powup = {
         powup: powup,
         coin_center_ratio: Quadratic_interpolation(0, arkanoid_panel_right, params.brick.mesh.geom.pos[0] + params.brick.mesh.geom.dim[0]),
         timer: 1,
         timer_step: .01,
         dir: 1,
         rand: 0,
         powup_glow_fx: null,
         flags: params.brick.flags,
      };
      Callback_animations_create(Animation_powup_run, Animation_powup_stop, params_powup,);
   }

}
/** */
function Animation_explosion_circle_run(params) {

   const explosion_fx = params.explosion_fx;
   const score_mod = params.score_mod.mesh;

   // Stop exlposion animation if time limit is reached   
   if (params.timer >= params.timer_limit + params.timer_step) {
      return false;
   }

   params.timer += params.timer_step;

   Gl_set_time(explosion_fx.mesh.gfx, params.timer); // Update attribute time

   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();


   // Avoid BLACK color in explosion when timer is equal or less than 0
   if (1 - params.timer > 0) {
      const slope = Logarithmic_interpolation(timer, slope_constant);
      Set_color_a(score_mod.text_mesh, 1 - params.timer, score_mod.text_mesh.geom.num_faces);
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt * 2.9);

   }

   return true

}
/** */
function Animation_explosion_circle_stop(params) {

   // Remove the explosion effect
   Effect_explosion_circle_remove_mesh_byidx(params.explosion_fx.idx);

   // Remove the score modifier text
   Score_mod_remove_text_mesh_byidx(params.score_mod.idx);

   return false;
}



/** */
function Animation_powup_run(params) {

   const powup = params.powup.mesh;


   // Check player-powup collision
   const player_top = Player_get_top();
   const player_dimy = Player_get_dimy();

   if (powup.geom.pos[1] + powup.geom.dim[1] * 2 > player_top) {

      if (powup.geom.pos[1] < player_top + player_dimy * 2) {

         const player_hit = Player_check_powup_collision(powup.geom.pos[0], powup.geom.pos[0] + powup.geom.dim[0] * 2,);

         if (player_hit) { // Remove the powup and run powup glow animation

            // Set up the powup's glow animation
            const x = powup.geom.pos[0] + powup.geom.dim[0];
            const y = powup.geom.pos[1] + powup.geom.dim[1];
            Animation_powup_hit(x, y);

            // Resolve any powup
            Powup_resolve_hit(params.powup.idx, params.flags);

            // Create explosion glow mesh
            const explosion_glow_size = powup.geom.dim[0] * 1.5;
            const xx = powup.geom.pos[0];
            const yy = powup.geom.pos[1];
            Effects_create_explosion_glow(xx, yy, explosion_glow_size, explosion_glow_size, powup.geom.dim[0], powup.geom.dim[1], GREY[8]);

            Powup_remove_byidx(params.powup.idx);

            return false;
         }
      }

      else if (powup.geom.pos[1] > VIEWPORT.BOTTOM + 100) { // else if powup exceeds limit y pos, remove it
         Powup_remove_byidx(params.powup.idx);
         return false;
      }

   }


   params.timer += params.timer_step;
   if (params.timer >= 1) {
      params.dir = -1;
      params.timer_step = -.03;
   }
   if (params.timer <= -1) {
      params.dir = 1;
      params.timer_step = .03;
   }
   const t = (params.timer) * .5;

   const a = GetSign(t);
   const b = Abs(t);
   const x = b * a * 8; // Bounce

   const f = 1;
   const bb = Abs(params.timer * f);
   const d = (bb) - f;
   const y = 1 - (d + params.rand);

   // Update powup animation position
   powup.geom.pos[0] += x;
   powup.geom.pos[1] += y;
   Gl_add_wpos_xy(powup.gfx, x, y);

   return true

}
/** */
function Animation_powup_stop(params) {

   return false;
}



/** */
function Animation_powup_hit(x, y) {

   //TODO: Also set up a player-brick hit glow + a score mod for the hit
   const time_step = 0.03, slope_const = 0.5, scale = 3;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   const text_mesh_idx = Score_mod_create(0.2, '+0.2', x, y, TEXTURES.MTSDF_COMIC_1024, 5, _, PURPLE[9], BRICKS.VB_GROUP_IDX, BRICKS.PARENT);
   const label = Score_mod_get_text_mesh_byidx(text_mesh_idx);


   const params_powup = {
      score_mod: label,
      function_slope: slope_params_pointer,
      move_amt: .25,
      alpha_timer: 0,
      alpha_timer_step: 0.02,
   };
   Callback_animations_create(Animation_powup_hit_run, Animation_powup_hit_stop, params_powup,);
}
/** */
function Animation_powup_hit_run(params) {

   // Update score mode text glow position
   const score_mod = params.score_mod.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();



   if (timer < 1) {

      const slope = Logarithmic_interpolation(timer, slope_constant);
      score_mod.text_mesh.ScaleText(slope * scale)
      score_mod.AddWposY(-params.move_amt * 10 * (1 - slope));

   }
   else if (params.alpha_timer < 1) {

      // TODO: Unecessary calls. MUST BE CALLED ONCE
      params.function_slope.SetSlope(1);

      score_mod.text_mesh.ScaleText((params.alpha_timer + 1) * scale)
      Set_color_a(score_mod.text_mesh, 1 - params.alpha_timer, score_mod.text_mesh.geom.num_faces);
      params.alpha_timer += params.alpha_timer_step;
   }
   else return false;


   return true;
}
/** */
function Animation_powup_hit_stop(params) {

   const score_mod = params.score_mod;

   // Remove the score modifier text
   Score_mod_remove_text_mesh_byidx(score_mod.idx);

   return false;
}




/** */
export function Animation_() {

   const time_step = 0.03, slope_const = 0.5, scale = 3;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);
   const params = {
      function_slope: slope_params_pointer,
      col_idx: 0,
      bricks_count: 0,
   };
   Callback_animations_create(Animation_run, Animation_stop, params);
}
/** */
function Animation_run(params) {

   const gravity = .5;

   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();


   const rows_len = _bricks_rows.boundary;

   let k = 1;
   for (let j = 0; j <= rows_len; j++) {

      const row = _bricks_rows.buffer[j];
      const cols_len = row.boundary
      for (let i = 0; i <= cols_len; i++) {

         if (row.buffer[i] !== INT_NULL) {

            const brick = _bricks_buffer.buffer[row.buffer[i]].mesh;
            const y = gravity * k * (timer * 5);

            if (brick.geom.pos[1] + y < brick.geom.defPos[1] + 15 && _bricks_buffer.buffer[row.buffer[i]].is_active === false) {
               brick.geom.pos[1] += y;
               Gl_add_wpos_y(brick.gfx, y);
               k += .5;
            }
            else {
               if (brick.geom.dim[1] > 13 && _bricks_buffer.buffer[row.buffer[i]].is_active === false) {

                  const size = 2.
                  Mesh_add_wpos_y(brick, size);
                  brick.geom.dim[0] += size;
                  brick.geom.dim[1] -= size;
                  Mesh_update_set_dim_xy(brick);
                  // brick.geom.SetDimXY(brick.gfx, brick.geom.dim[0], brick.geom.dim[1]);
                  Gl_set_dim_xy(brick.gfx, brick.geom.dim[0], brick.geom.dim[1]);

               }
               else if (_bricks_buffer.buffer[row.buffer[i]].is_active === false) { // Current brick has reached its position

                  brick.geom.dim[0] = brick.geom.defDim[0];
                  brick.geom.dim[1] = brick.geom.defDim[1];
                  Mesh_update_set_dim_xy(brick);
                  Gl_set_dim_xy(brick.gfx, brick.geom.dim[0], brick.geom.dim[1]);

                  brick.geom.pos[1] = brick.geom.defPos[1];
                  Gl_set_wpos_y(brick.gfx, brick.geom.defPos[1] + brick.geom.dim[1]);

                  _bricks_buffer.buffer[row.buffer[i]].is_active = true;

                  params.bricks_count++;
                  if (params.bricks_count >= _bricks_counter.count)
                     return false;
               }
            }

         }
      }
   }

   return true;
}
/** */
function Animation_stop() { Arkanoid_create_update_game_loop(); }







/*****************************************************************************************************************************/
// Tests

/** */
function Test_Bricks_calc_row_from_pos() {
   console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=',)

   const times = 8;
   const rowy_start = bricks_row_0_y;
   let posy = 0;
   for (let i = 0; i < BRICKS.STAGE_SCHEMA.length; i++) {
      console.log('row:', i, 'Between', rowy_start + (BRICKS.ROW_HEIGHT * i), '-', rowy_start + (BRICKS.ROW_HEIGHT * (i + 1)),);
   }
   console.log('------ Find row from pos',)
   for (let i = 0; i < times; i++) {
      const found_row = Bricks_calc_row_from_pos(posy);
      console.log('posy', posy, 'found_row', found_row,);
      posy += BRICKS.ROW_HEIGHT / 2;
   }

   console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=',)
}