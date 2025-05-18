"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Create_rect_mesh } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_add_to_group } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Effect_explosion_circle_get_mesh_byidx, Effect_explosion_circle_remove_mesh_byidx, Effects_create_explosion_circle } from "../../../../Engine/Drawables/Effects/Effects.js";
import { BLUEL } from "../../../../Engine/Drawables/Material/Colors.js";
import { Mesh_update_set_dim_x } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Gl_set_alpha, Gl_set_attr_round_corners, Gl_set_dim_x, Gl_set_generic2, Gl_set_time, Gl_set_wpos_x, Gl_set_wpos_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Linear_interpolation, Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";



/** */
export const PLAYER_DIM_X = 100, PLAYER_DIM_Y = 10, PLAYER_PAD = 20;
/** */
let _player = null;
/** */
export function Arkanoid_player_reset() {

   _player = null;
}
/** */
export function Player_get() { return _player; }
/** */
export function Player_get_top() { return _player.mesh.geom.pos[1]; }
/** */
export function Player_get_dimx() { return _player.mesh.geom.dim[0]; }
/** */
export function Player_get_dimy() { return _player.mesh.geom.dim[1]; }
/** */
export function Player_get_pad() { return PLAYER_PAD; }
/** */
export class Player {

   constructor(x, y) {

      const posx = x;
      const posy = y;

      const mesh = Create_rect_mesh(Style_rect_default_properties({pos:[posx, posy, 1], dim:[PLAYER_DIM_X, PLAYER_DIM_Y], col:BLUEL[9], name:'Player',}));
      Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:10, });

      // mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE, _);
      mesh.GenGfxCtx();
            
      Vertex_buffer_calculate_render_group_starts();
      View_render_from_view_NEW(player.group_bufferidxs[0]);
      
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);

      this.in_scale_animation = false;

      this.mesh = mesh;

      _player = this;

   }
}
/** */
export function Player_init(x, y, group_idx = INT_NULL, parent_root_posidx = INT_NULL, parent_mesh_bufferidx) {


   const player = new Player(x, y, group_idx);
   // Add to View Group
   View_add_to_group(player.mesh, group_idx);
   // Implement to draw wpos from a root uniform wpos 
   if (parent_root_posidx !== INT_NULL) Mesh_unif_hack_parent_root_wpos(player.mesh.root_posidx, parent_root_posidx, parent_mesh_bufferidx);

   return player;
}
/** */
export function Player_set_position(x, y) {

   _player.mesh.geom.pos[0] = x;
   _player.mesh.geom.pos[1] = y;
   Gl_set_wpos_xy(_player.mesh.gfx, _player.mesh.geom.pos[0] + PLAYER_DIM_X, _player.mesh.geom.pos[1] + PLAYER_DIM_Y);
}
/** */
export function Player_check_coin_collision(coin_left, coin_right) {

   const pl_left = _player.mesh.geom.pos[0];
   const pl_right = pl_left + _player.mesh.geom.dim[0] * 2;

   if (coin_left < pl_right && coin_right > pl_left) {
      return true;
   }

   return false;
}
/** */
export function Player_check_powup_collision(powup_left, powup_right) {

   const pl_left = _player.mesh.geom.pos[0];
   const pl_right = pl_left + _player.mesh.geom.dim[0] * 2;

   if (powup_left < pl_right && powup_right > pl_left) {
      return true;
   }

   return false;
}







/************************************************************************************************************************************************/
// Power up animations

/** */
export function Player_create_animation_scale() {

   const player = _player;

   if (player.in_scale_animation) return;

   player.in_scale_animation = true;

   // const time_step = 0.01, slope_const = 0.2, scale = .5;
   const time_step = 0.005, slope_const = .3, scale = .5;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   // Create glow effect
   const w = player.mesh.geom.dim[0];
   const h = player.mesh.geom.dim[1];
   const x = player.mesh.geom.pos[0];
   const y = player.mesh.geom.pos[1];
   const glow_scalex = 1.;
   const glow_scaley = 2.2;
   const ring_diameter = .0, intensity = .2
   const glow_fx_idx = Effects_create_explosion_circle(x, y, w * glow_scalex, h * glow_scaley, w, h, TRANSPARENCY(BLUEL[9], 0), ring_diameter, intensity);
   const glow_fx = Effect_explosion_circle_get_mesh_byidx(glow_fx_idx);


   Gl_set_time(glow_fx.mesh.gfx, .01);


   const params_player = {
      player: player,
      function_slope: slope_params_pointer,
      player_initial_dimx: player.mesh.geom.dim[0],
      player_current_dimx: player.mesh.geom.dim[0],

      glow_fx: glow_fx,
      glow_scalex: glow_scalex,
      glow_scaley: glow_scaley,
      glow_current_dimx: glow_fx.mesh.geom.dim[0],
      glow_intensity: glow_fx.mesh.geom.generic.b,
   };



   Callback_animations_create(Player_animation_scale_up_run, Player_animation_scale_up_stop, params_player,);


}
/** */
function Player_animation_scale_up_run(params) {

   const player = params.player.mesh;
   const player_initial_dimx = params.player_initial_dimx;
   const player_current_dimx = params.player_current_dimx;

   const timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();


   const slope = Logarithmic_interpolation(timer, slope_constant);
   const scale_factor = slope * scale;


   // Update player x dir scale
   const sizex = player_current_dimx + (player_initial_dimx * scale_factor);
   
   player.geom.dim[0] = sizex;
   Mesh_update_set_dim_x(player);
   Gl_set_dim_x(player.gfx, sizex,);
   Gl_set_attr_round_corners(player.gfx, player.mat.style.rcorners + scale_factor);

   // Animate player glow
   {
      const glow_fx = params.glow_fx.mesh;
      const glow_current_dimx = params.glow_current_dimx;
      const glow_sizex = glow_current_dimx + (glow_current_dimx * slope * params.glow_scalex);
      
      glow_fx.geom.dim[0] = glow_sizex;
      Mesh_update_set_dim_x(glow_fx);
      Gl_set_dim_x(glow_fx.gfx, glow_sizex,);

      glow_fx.geom.pos[0] = player.geom.pos[0] + player.geom.dim[0];
      Gl_set_wpos_x(glow_fx.gfx, glow_fx.geom.pos[0]);

      Gl_set_alpha(glow_fx.gfx, slope);

      const val = Linear_interpolation(.01, params.glow_intensity, slope);
      glow_fx.geom.generic.b = val;
      Gl_set_generic2(glow_fx.gfx, glow_fx.geom,)
   }

   if (slope > 1) return false;

   return true;
}
/** */
function Player_animation_scale_up_stop(params) {

   params.function_slope.SetTimer(0);

   // Set the scale down as the inverse of scale up
   const scale = params.function_slope.GetAmmount();
   params.function_slope.SetAmmount(-scale);

   // Store current player dimention
   params.player_current_dimx = params.player.mesh.geom.dim[0];

   Callback_animations_create(Player_animation_scale_down_run, Player_animation_scale_down_stop, params,);
   return false;
}
/** */
function Player_animation_scale_down_run(params) {

   const player = params.player.mesh;
   const player_initial_dimx = params.player_initial_dimx;
   const player_current_dimx = params.player_current_dimx;


   const timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const scale_factor = slope * scale;

   // Update coin glow position
   const sizex = player_current_dimx + (player_initial_dimx * scale_factor);
   
   player.geom.dim[0] = sizex;
   Mesh_update_set_dim_x(player);
   Gl_set_dim_x(player.gfx, sizex,);
   Gl_set_attr_round_corners(player.gfx, player.mat.style.rcorners + scale_factor);

   // Animate player glow
   {
      const glow_fx = params.glow_fx.mesh;

      glow_fx.geom.pos[0] = player.geom.pos[0] + player.geom.dim[0];
      Gl_set_wpos_x(glow_fx.gfx, glow_fx.geom.pos[0]);

      Gl_set_time(glow_fx.gfx, timer);

      // Gl_set_alpha(glow_fx.gfx, (1-slope));

      const val = Linear_interpolation(params.glow_intensity, .01, slope);
      glow_fx.geom.generic.b = val;
      Gl_set_generic2(glow_fx.gfx, glow_fx.geom,)
   }

   if (slope > 1) return false;


   return true;
}
/** */
function Player_animation_scale_down_stop(params) {

   params.player.in_scale_animation = false;
   Effect_explosion_circle_remove_mesh_byidx(params.glow_fx.idx);

   return false;
}