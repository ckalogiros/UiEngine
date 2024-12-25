"use strict";

import { Create_rect_mesh } from "../../../../Engine/Core/CreateWidget.js";
import { BLUEL } from "../../../../Engine/Drawables/Material/Base/Colors.js";




const PLAYER_DIM_X = 100, PLAYER_DIM_Y = 10, PLAYER_PAD = 20;

let _player = null;


export function Player_get() { return _player; }
// export function Player_get_top() { return _player.mesh.geom.pos[1]; }
export function Player_get_top() { return _player.mesh.GetPosY(); }
export function Player_get_dimx() { return _player.mesh.geom.dim[0]; }
export function Player_get_dimy() { return _player.mesh.geom.dim[1]; }
export function Player_get_pad() { return PLAYER_PAD; }

export class Player {

   constructor(x, y) {

      // const posx = x-PLAYER_DIM_X;
      // const posy = y-(PLAYER_DIM_Y*2 + PLAYER_PAD);

      // const mesh = Create_rect_mesh(_, [x, y, 1], [PLAYER_DIM_X, PLAYER_DIM_Y], BLUEL[9], 'Player', );
      // const mesh = Create_rect_mesh(_, [posx, posy, 1], [PLAYER_DIM_X, PLAYER_DIM_Y], BLUEL[9], 'Player', );
      const mesh = Create_rect_mesh(_, [0, 0, 1], [PLAYER_DIM_X, PLAYER_DIM_Y], BLUEL[9], 'Player', );
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9]));
      
      this.in_scale_animation = false;

      this.mesh = mesh;

      _player = this;

   }
}


export function Player_check_coin_collision(coin_left, coin_right) {

      // const pl_left = _player.mesh.geom.pos[0];
      // const pl_right = _player.mesh.geom.pos[0]+_player.mesh.geom.dim[0]*2;
      // const pl_top = _player.mesh.geom.pos[1];
      const pl_left = _player.mesh.GetPosX();
      const pl_right = pl_left+_player.mesh.geom.dim[0]*2;
      const pl_top = _player.mesh.GetPosY();
   
      // if (ball_bot > player_pos[1] && coin_left < player_pos[0] + plw && coin_right > player_pos[0]) {
      // if (coin_bottom > pl_top && coin_left < pl_right && coin_right > pl_left) {
      if (coin_left < pl_right && coin_right > pl_left) {
         return true;
      }

      return false;
}

