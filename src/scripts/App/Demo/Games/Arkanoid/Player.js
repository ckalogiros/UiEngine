"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Create_rect_mesh } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_add_to_group } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { BLUEL } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Gl_set_attr_round_corners, Gl_set_dim_x, Gl_set_wpos_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";




export const PLAYER_DIM_X = 100, PLAYER_DIM_Y = 10, PLAYER_PAD = 20;

let _player = null;


export function Player_get() { return _player; }
export function Player_get_top() { return _player.mesh.geom.pos[1]; }
export function Player_get_dimx() { return _player.mesh.geom.dim[0]; }
export function Player_get_dimy() { return _player.mesh.geom.dim[1]; }
export function Player_get_pad() { return PLAYER_PAD; }

export class Player {

   constructor(x, y) {

      // const posx = x - PLAYER_DIM_X;
      // const posy = y - PLAYER_DIM_Y;
      // const posy = y;
      // const pad_y = -20;
      const posx = x;
      const posy = y;

      // const mesh = Create_rect_mesh(_, [0, 0, 1], [PLAYER_DIM_X, PLAYER_DIM_Y], BLUEL[9], 'Player', );
      // const mesh = Create_rect_mesh(_, [0, pad_y, 1], [PLAYER_DIM_X, PLAYER_DIM_Y], BLUEL[9], 'Player', );
      const mesh = Create_rect_mesh(_, [posx, posy, 1], [PLAYER_DIM_X, PLAYER_DIM_Y], BLUEL[9], 'Player', );
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9]));
      
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE, _);

      // mesh.geom.pos[0] -= PLAYER_DIM_X;
      // mesh.geom.pos[1] -= PLAYER_DIM_Y;

      mesh.Render();
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);
      
      this.in_scale_animation = false;

      this.mesh = mesh;

      _player = this;

   }
}

export function Player_init(x, y, group_idx=INT_NULL, parent_root_posidx=INT_NULL, parent_mesh_bufferidx) {


   const player = new Player(x, y, group_idx); 
   // Add to View Group
   View_add_to_group(player.mesh, group_idx);
   // Implement to draw wpos from a root uniform wpos 
   if(parent_root_posidx!==INT_NULL) Mesh_unif_hack_parent_root_wpos(player.mesh.root_posidx, parent_root_posidx, parent_mesh_bufferidx);
   
   return player;
}


export function Player_set_position(x, y) {

   _player.mesh.geom.pos[0] = x; 
   _player.mesh.geom.pos[1] = y; 
   Gl_set_wpos_xy(_player.mesh.gfx, _player.mesh.geom.pos[0]+PLAYER_DIM_X, _player.mesh.geom.pos[1]+PLAYER_DIM_Y);
}


export function Player_check_coin_collision(coin_left, coin_right) {

   const pl_left = _player.mesh.geom.pos[0];
   const pl_right = pl_left+_player.mesh.geom.dim[0]*2;

   if (coin_left < pl_right && coin_right > pl_left) {
      return true;
   }

   return false;
}


export function Player_check_powup_collision(powup_left, powup_right) {

   const pl_left = _player.mesh.geom.pos[0];
   const pl_right = pl_left+_player.mesh.geom.dim[0]*2;

   if (powup_left < pl_right && powup_right > pl_left) {
      return true;
   }

   return false;
}







/************************************************************************************************************************************************/
// Power up animations


export function Player_create_animation_scale() {
   
   const player = _player;

   if(player.in_scale_animation) return;

   player.in_scale_animation = true;

   // const time_step = 0.01, slope_const = 0.2, scale = .5;
   const time_step = 0.005, slope_const = 1., scale = .5;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);


   const params_player = {
      player:player,
      function_slope:slope_params_pointer,
      player_initial_dimx:player.mesh.geom.dim[0],
      player_current_dimx:player.mesh.geom.dim[0],
   };

   Callback_animations_create(Player_animation_scale_up_run, Player_animation_scale_up_stop, params_player,);
   
}
function Player_animation_scale_up_run(params) {
   
   const player = params.player.mesh; 
   const player_initial_dimx = params.player_initial_dimx;
   const player_current_dimx = params.player_current_dimx;
   
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
 
 
   if(slope > 1) return false;

   return true;
}
function Player_animation_scale_up_stop(params) {
   
   params.function_slope.SetTimer(0);

   // Set the scale down as the inverse of scale up
   const scale = params.function_slope.GetValueChange();
   params.function_slope.SetValueChange(-scale);

   // Store current player dimention
   params.player_current_dimx = params.player.mesh.geom.dim[0];
   
   Callback_animations_create(Player_animation_scale_down_run, Player_animation_scale_down_stop, params,);
   return false;
}
function Player_animation_scale_down_run(params) {
   
   const player = params.player.mesh; 
   const player_initial_dimx = params.player_initial_dimx;
   const player_current_dimx = params.player_current_dimx;


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
 

   if(slope > 1) return false;

   
   return true;
}
function Player_animation_scale_down_stop(params) {
   
   params.player.in_scale_animation = false;
   
   return false;
}