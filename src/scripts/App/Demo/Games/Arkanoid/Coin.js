'use strict';

import { Free_generic_buffer, Free_int8_buffer, New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_add_to_group } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Effect_explosion_circle_get_mesh_byidx, Effect_explosion_circle_remove_mesh_byidx, Effects_create_explosion_circle, Effects_create_explosion_glow } from "../../../../Engine/Drawables/Effects/Effects.js";
import { BLUEL, GREY, WHITE, YELLOW, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Set_color_a } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Gl_add_wpos_xy, Gl_set_alpha, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Logarithmic_interpolation, Quadratic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs } from "../../../../Helpers/Math/MathOperations.js";
import { Arkanoid_coin_counter_add } from "./Arkanoid.js";
import { ARK_STATE } from "./ArkanoisConstants.js";
import { Player_check_coin_collision, Player_get_dimy, Player_get_top } from "./Player.js";
import { Score_mod_create, Score_mod_get_text_mesh_byidx, Score_mod_remove_text_mesh_byidx } from "./ScoreMod.js";



/**
 * // TODO: In the coin Update function, run from size to 0. When we find the first 'not active' coin, return from loop
 * This entails the coins to be created in a sequence (from last elem-boundary, towards 0th)
 */

/** */
export const COIN_TEXTURE = TEXTURES.COIN;
/** */
export const COIN_SIZE = 16;
/** */
const PRE_INITIALIZED_COIN_MESHES = 12;
/** */
let coin_vb_groupidx = INT_NULL;
/** */
let coins_view_group_idx = INT_NULL;
/** */
let is_all_animations_finished = false;
/** */
export function Coin_is_all_animations_finished() { return is_all_animations_finished; }
/** */
export function Coin_set_false_is_all_animations_finished() { is_all_animations_finished = false; }
/** */
export function Arkanoid_coin_reset() {

   coin_vb_groupidx = INT_NULL;
   coins_view_group_idx = INT_NULL;
   is_all_animations_finished = false;

   _coin_buffer.ResetFull();
   _free_coin_idx_buffer.Reset();
}
/** */
export function Arkanoid_coin_destroy() {

   Free_generic_buffer(_coin_buffer);
   Free_int8_buffer(_free_coin_idx_buffer);
}







/**************************************************************************************************************************************/
// Effects Meshes

/** */
class Coin {

   constructor(x = 0, y = 0, texture_id = COIN_TEXTURE, vb_groupidx = INT_NULL) {

      this.is_active = false;


      // Coin textured mesh
      const mesh = Create_widget_section(_, _, [0, 0], [0, 0, 3], [COIN_SIZE, COIN_SIZE], TRANSPARENCY(WHITE, 1.), 'CoinMesh', _, _, texture_id,);

      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);


      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;

      mesh.Render()

      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx)

      if (coin_vb_groupidx === INT_NULL) coin_vb_groupidx = mesh.gfx.vb.groupidx;


      if (vb_groupidx.label === INT_NULL) {
         Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      }

      this.mesh = mesh;
      this.glow_mesh = null;
      this.score_mod = null;

      this.dependencies = this.CreateDependenciesStruct();
      this.SetDependencies2Struct();

      this.Update_fn_ptr = null;


      this.idx = _coin_buffer.Add(this);
   }

   SetUpdateFnPtr(Fn = null) {
      this.Update_fn_ptr = Fn;
   }

   CreateGlowFx(x, y) {

      // Coin Glow effect mesh
      const ring_diameter = 1.0, intensity = .01;
      const coin_glow_fx_idx = Effects_create_explosion_circle(x + COIN_SIZE, y + COIN_SIZE, COIN_SIZE * 1.6, COIN_SIZE * 1.6, 0, 0, YELLOWR[9], ring_diameter, intensity)
      const coin_glow_fx = Effect_explosion_circle_get_mesh_byidx(coin_glow_fx_idx);
      this.glow_mesh = coin_glow_fx;
      return coin_glow_fx;
   }

   CreateScoreModText(color = YELLOW[9]) {

      // Coin Glow effect mesh
      const x = this.glow_mesh.mesh.geom.pos[0] + this.glow_mesh.mesh.geom.dim[0];
      const y = this.glow_mesh.mesh.geom.pos[1] + this.glow_mesh.mesh.geom.dim[1];

      const text_mesh_idx = Score_mod_create(0.5, '+0.5', x, y, TEXTURES.MSDF_COMIC_1024, 5, _, color);
      const score_mod = Score_mod_get_text_mesh_byidx(text_mesh_idx);
      this.score_mod = score_mod;
      return score_mod;
   }

   CreateDependenciesStruct() {

      return {

         // Update 2
         game_panel_right: 0, // TODO: this is a constant value, no need every coin to have it
         brick_posx: 0,
         brick_dimx: 0,
         timer: 0,
         timer_step: .01,
         center_ratio: 0, // The more at the edges a coin is, the more of x dir movment the coin has. The more at the center the less x dir move.
         dirx: 1,

         // Update 2
         function_slope: null,
         move_amt: .25,
         alpha_timer: 0,
         alpha_timer_step: 0.02,

      };
   }

   SetDependenciesStruct(game_panel_posx, game_panel_dimx, brick_posx, brick_dimx) {

      this.dependencies.timer = 0;
      this.dependencies.game_panel_posx = game_panel_posx;
      this.dependencies.game_panel_dimx = game_panel_dimx;
      this.dependencies.brick_posx = brick_posx;
      this.dependencies.brick_dimx = brick_dimx;
      this.dependencies.center_ratio = Quadratic_interpolation(0, game_panel_posx + game_panel_dimx * 2, brick_posx + brick_dimx); // The more at the edges a coin is, the more of x dir movment the coin has. The more at the center the less x dir move.
      this.dependencies.dirx = (this.mesh.geom.pos[0] + this.mesh.geom.dim[0] < game_panel_posx + game_panel_dimx) ? 1 : -1;

   }
   SetDependencies2Struct(slope_const = 0.5, time_step = 0.03, scale = 3) {

      this.dependencies.function_slope = new Function_Slope(slope_const, time_step, scale);
      this.dependencies.move_amt = .25;
      this.dependencies.alpha_timer = 0;
      this.dependencies.alpha_timer_step = 0.02;
   }
}




/** */
const _coin_buffer = New_generic_buffer(_, '_coin_buffer');
/** */
const _free_coin_idx_buffer = New_int8_buffer(PRE_INITIALIZED_COIN_MESHES, '_free_coin_idx_buffer');


/** */
export function Coin_get_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _coin_buffer.buffer[idx] === undefined) alert('1231231231231 Wrong index for _coin_buffer')
   return _coin_buffer.buffer[idx];
}
/** Removes the coin mesh from the storage buffer and from rendering, but mesh still remains in the application */

export function Coin_remove_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _coin_buffer.buffer[idx] === undefined) alert('1231231231232 Wrong index for _coin_buffer')

   const mesh = _coin_buffer.buffer[idx].mesh;

   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);

   _coin_buffer.buffer[idx].is_active = false;
   _free_coin_idx_buffer.Add(idx);

}
/** Removes the coin mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application) */
export function Coin_destroy_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _coin_buffer.buffer[idx] === undefined) alert('1231231231233 Wrong index for _coin_buffer')
   const mesh = _coin_buffer.buffer[idx].mesh;
   _coin_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}
/** */
export function Coin_remove_all() {

   for (let i = 0; i <= _coin_buffer.boundary; i++) {

      const coin = _coin_buffer.buffer[i];
      if (coin.is_active) {

         Effect_explosion_circle_remove_mesh_byidx(coin.glow_mesh.idx);
         if (coin.score_mod) Score_mod_remove_text_mesh_byidx(coin.score_mod.idx);
         Coin_remove_byidx(coin.idx);
      }
   }
}
/** */
export function Coin_init_buffer(group_idx, parent_root_posidx, parent_mesh_bufferidx, num_effect_meshes = PRE_INITIALIZED_COIN_MESHES) {

   let vb_groupidx = INT_NULL;
   let coin = null;

   for (let i = 0; i < num_effect_meshes; i++) {

      coin = new Coin(_, _, _, vb_groupidx);
      vb_groupidx = coin.mesh.gfx.vb.groupidx;

      // Add to View Group
      View_add_to_group(coin.mesh, group_idx);
      Coin_remove_byidx(coin.idx);
   }

   coins_view_group_idx = group_idx;
   // Implement to draw wpos from a root uniform wpos 
   if (parent_root_posidx !== INT_NULL) Mesh_unif_hack_parent_root_wpos(coin.mesh.root_posidx, parent_root_posidx, parent_mesh_bufferidx);

   return coin;
}
/** */
export function Coin_create(x, y, w = COIN_SIZE, h = COIN_SIZE, w_src = 0, h_src = 0, game_panel_posx, game_panel_dimx, brick_posx, brick_dimx) {

   let idx = INT_NULL;

   const freeidx = _free_coin_idx_buffer.boundary;

   const xx = x - w + w_src;
   const yy = y - h + h_src;


   if (freeidx >= 0) {

      idx = _free_coin_idx_buffer.buffer[freeidx];
      const coin = _coin_buffer.buffer[idx].mesh;

      // Coin mesh
      coin.geom.pos[0] = xx;
      coin.geom.pos[1] = yy;
      Gl_set_wpos_xy(coin.gfx, coin.geom.pos[0] + w, coin.geom.pos[1] + h);
      Gl_set_alpha(coin.gfx, 1);

      // Coin glow mesh
      _coin_buffer.buffer[idx].CreateGlowFx(xx, yy);
      _coin_buffer.buffer[idx].SetDependenciesStruct(game_panel_posx, game_panel_dimx, brick_posx, brick_dimx);
      _coin_buffer.buffer[idx].is_active = true;

      // Remove from the free idxs buffer
      _free_coin_idx_buffer.RemoveByIdx(freeidx);
   }
   else { // If no apropriate free mesh was found, create new mesh

      const coin = new Coin(xx, yy, _, coin_vb_groupidx);
      idx = coin.idx;
      coin.is_active = true;

      _coin_buffer.buffer[idx].CreateGlowFx(xx, yy);

      coin.SetDependenciesStruct(game_panel_posx, game_panel_dimx, brick_posx, brick_dimx);

      // Add to View Group
      View_add_to_group(coin.mesh, coins_view_group_idx);
   }

   // Start by animating the coin 'fall'
   _coin_buffer.buffer[idx].SetUpdateFnPtr(Coin_update_state_1)


   is_all_animations_finished = false;

   return idx;

}
/** */
export function Coin_update() {

   for (let i = 0; i <= _coin_buffer.boundary; i++) {

      const coin = _coin_buffer.buffer[i];

      if (coin.is_active) {
         coin.Update_fn_ptr(coin);
      }

   }
}


/** Animate coin fall, check colision with player */
function Coin_update_state_1(coin) {

   const coin_glow = coin.glow_mesh.mesh;

   const player_top = Player_get_top();
   const player_dimy = Player_get_dimy();
   if (coin.mesh.geom.pos[1] + coin.mesh.geom.dim[1] * 2 > player_top) {

      if (coin.mesh.geom.pos[1] < player_top + player_dimy * 2) {

         const player_hit = Player_check_coin_collision(coin.mesh.geom.pos[0], coin.mesh.geom.pos[0] + coin.mesh.geom.dim[0] * 2,);

         if (player_hit) { // Remove the coin and run coin glow animation

            // Set up the coin's glow animation function call
            coin.SetUpdateFnPtr(Coin_update_state_2);

            // Create explosion glow mesh
            const explosion_glow_size = coin.mesh.geom.dim[0] * 3;
            const x = coin.mesh.geom.pos[0];
            const y = coin.mesh.geom.pos[1];
            Effects_create_explosion_glow(x, y, explosion_glow_size, explosion_glow_size, coin.mesh.geom.dim[0], player_dimy, GREY[8]);

            // Create score mod mesh
            coin.CreateScoreModText(BLUEL[9]);
            coin.SetDependencies2Struct();

            // Disable coin mesh render
            Gl_set_alpha(coin.mesh.gfx, 0);


            // Update UI coin counter
            Arkanoid_coin_counter_add(1);

            return false;
         }
      }

      else if (coin.mesh.geom.pos[1] > VIEWPORT.BOTTOM + 100) { // else if coin exceeds limit y pos, remove it
         Effect_explosion_circle_remove_mesh_byidx(coin.glow_mesh.idx);
         Coin_remove_byidx(coin.idx);

         if (ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) {
            if (_free_coin_idx_buffer.active_count === _coin_buffer.active_count)
               is_all_animations_finished = true;
         }

         return false;
      }

   }


   // Update coin fall animation
   {
      coin.dependencies.timer += coin.dependencies.timer_step;

      // Avoid weird position if timer is equal or greater than 1
      if (coin.dependencies.timer > .999) coin.dependencies.timer = .999;

      const t = coin.dependencies.timer;
      const gravity = 10.0;
      const move_up_dist = 1.9;
      const reverse_time_mod = (1 - t + .4); // "t+.x": avoids straight line down move 
      const x = 4 * coin.dependencies.center_ratio * reverse_time_mod * coin.dependencies.dirx; // Calc the ammount of x direction
      const y = (gravity * t * t) + (t * t) + (t - move_up_dist); // Calc the ammount of gravity pull


      // Update coin animation position
      coin.mesh.geom.pos[0] += x;
      coin.mesh.geom.pos[1] += y;
      Gl_add_wpos_xy(coin.mesh.gfx, x, y);


      // Update coin glow animation position
      coin_glow.geom.pos[0] += x;
      coin_glow.geom.pos[1] += y;
      Gl_add_wpos_xy(coin_glow.gfx, x, y);
   }

}
/** Animate coin glow and score_mod */
function Coin_update_state_2(coin) {


   // Animate score mod
   {
      // Update score mode text glow position
      const score_mod = coin.score_mod.mesh;
      const slope = coin.dependencies.function_slope;
      const slope_constant = slope.GetSlope();
      const scale = slope.GetAmmount();
      slope.IncrementTimer();
      const timer = slope.GetTimer();


      if (timer < 1) {

         const slope = Logarithmic_interpolation(timer, slope_constant);
         score_mod.text_mesh.ScaleText(slope * scale)
         score_mod.AddWposY(-coin.dependencies.move_amt * 10 * (1 - slope));
      }
      else if (coin.dependencies.alpha_timer < 1) {

         // TODO: Unecessary calls. MUST BE CALLED ONCE
         slope.SetSlope(1);
         score_mod.text_mesh.ScaleText((coin.dependencies.alpha_timer + 1) * scale)
         Set_color_a(score_mod.text_mesh, 1 - coin.dependencies.alpha_timer, score_mod.text_mesh.geom.num_faces);
         coin.dependencies.alpha_timer += coin.dependencies.alpha_timer_step;
      }
   }


   // Animate coin glow
   {
      const coin_glow = coin.glow_mesh.mesh;
      const dst_pos = [400, 0]; // Destination position to move to
      const src_pos = [coin_glow.geom.pos[0], coin_glow.geom.pos[1]];
      const dist = [dst_pos[0] - src_pos[0], dst_pos[1] - src_pos[1]];

      // Return if destination position of the coin glow is reached
      if (Abs(dist[1]) < 10) {
         Effect_explosion_circle_remove_mesh_byidx(coin.glow_mesh.idx);
         Score_mod_remove_text_mesh_byidx(coin.score_mod.idx);
         Coin_remove_byidx(coin.idx);

         if (ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) {
            if (_free_coin_idx_buffer.active_count === _coin_buffer.active_count)
               is_all_animations_finished = true;
         }

         return false;
      }

      // Move the coin glow a little bit closer to destination position by small ammounts
      dist[0] *= 0.01;
      dist[1] *= 0.03;

      // Update coin glow position
      coin_glow.geom.pos[0] += dist[0];
      coin_glow.geom.pos[1] += dist[1];
      Gl_add_wpos_xy(coin_glow.gfx, dist[0], dist[1]);
   }

}







/*******************************************************************************************************/
// Debug Print
/** */
export function Coin_print() {
   console.log(
      'Coin buffer', _coin_buffer.buffer,
   );
}