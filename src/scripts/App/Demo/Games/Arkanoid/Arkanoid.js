"use strict"

import { Mouse_get_posx } from "../../../../Engine/Controls/Input/Mouse.js";
import { Create_widget_label, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Effects_explosion_circle_init_buffer, Effects_explosion_circle_update, Effects_explosion_glow_init_buffer, Effects_explosion_glow_update } from "../../../../Engine/Drawables/Effects/Effects.js";
import { GREEN, GREY, TRANSPARENT, WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Particle_system_emitter_set_position_x } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Renderqueue_set_priority_by_vb } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { Floor } from "../../../../Helpers/Math/MathOperations.js";
import { ARK_STATE } from "./ArkanoisConstants.js";
import { Ball_create2, Ball_init_buffer, Ball_release, Ball_tail_emitter_gengfx, Ball_update } from "./Ball.js";
import { Bricks_create } from "./Bricks.js";
import { Coin_init_buffer } from "./Coin.js";
import { Bullet_create, Bullet_init_buffer, Bullet_update, Gun_update_pos_x } from "./BulletGun.js";
import { Player, Player_get_pad } from "./Player.js";
import { Powup_init_buffer } from "./PowerUps.js";
import { Score_mod_init_buffer } from "./ScoreMod.js";





const ARKANOIS_MENU_DIM_Y = 50;
const ARKANOID_SECTION_DIM_X = 250, ARKANOID_SECTION_DIM_Y = 350;
const ARKANOID_SECTION_PAD_X = 100, ARKANOID_SECTION_PAD_Y = 100;
const BOUND_TOP = 0, BOUND_BOTTOM = 0, BOUND_RIGHT = ARKANOID_SECTION_DIM_X, BOUND_LEFT = 0.


let arkanoid_panel_mesh = null;

const _arkanoid_struct = {

   menu:null, 
   // score:null, 
   score_text:null, 
   score_num_text:null,
   score_mod_text:null,
   score_mod_num_text:null,
   
   score_num:0,
   score_mod_num:0,
   score_base_num:10, 
   
};







export function Arkanoid_get_main_panel_padxy() { return {x:ARKANOID_SECTION_PAD_X, y:ARKANOID_SECTION_PAD_Y+ ARKANOIS_MENU_DIM_Y*2}; }
export function Arkanoid_get_main_panel_padx() { return ARKANOID_SECTION_PAD_X; }
export function Arkanoid_get_main_panel_pady() { return ARKANOID_SECTION_PAD_Y + ARKANOIS_MENU_DIM_Y*2; }
export function TEMP_Arkanoid_get_main_panel() {
   return arkanoid_panel_mesh;
}
export function Arkanoid_get_panel_center_pos_x() { 
   return arkanoid_panel_mesh.geom.pos[0] + arkanoid_panel_mesh.geom.dim[0]; 
}
export function Arkanoid_get_panel_dim_x() { return arkanoid_panel_mesh.geom.dim[0]; }
export function Arkanoid_get_panel_right() { return arkanoid_panel_mesh.geom.pos[0] + arkanoid_panel_mesh.geom.dim[0]*2; }
export function Arkanoid_get_panel_bottom() { return arkanoid_panel_mesh.geom.pos[1] + arkanoid_panel_mesh.geom.dim[1]*2; }

export function Arkanoid_initialize() {

   let ypos = ARKANOID_SECTION_PAD_Y;

   /***************************************************************************************************************/
   // Create score and menu
   
   const menu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [ARKANOID_SECTION_PAD_X, ypos, 0], [ARKANOID_SECTION_DIM_X, ARKANOIS_MENU_DIM_Y], GREY[5]);
   menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   menu.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move
   
   menu.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   menu.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
   
   _arkanoid_struct.menu = menu;
   
   const pad = 10;
   let x = pad;
   let y = pad;

   const score_text = Create_widget_label(_, 'score', _, [x, y, 4], 12, TRANSPARENT, WHITE, [0, 0], .5, _, TEXTURES.MSDF_COMIC_1024,);
   score_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_text);
   _arkanoid_struct.score_text = score_text;
   
   x += score_text.text_mesh.text_width*2+pad;
   const score_num_text = Create_widget_label(_, '00000000000', _, [x, y, 4], 12, TRANSPARENT, GREEN[9], [0, 0], .5, _, TEXTURES.MSDF_COMIC_1024,);
   score_num_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_num_text)
   _arkanoid_struct.score_num_text = score_num_text;
   
   x = pad;
   y += score_text.text_mesh.geom.dim[1]*2+pad;
   const score_mod_text = Create_widget_label(_, 'score mod', _, [x, y, 4], 12, TRANSPARENT, WHITE, [0, 0], .5, _, TEXTURES.MSDF_COMIC_1024,);
   score_mod_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_mod_text);
   _arkanoid_struct.score_mod_text = score_mod_text;
   
   x += score_mod_text.text_mesh.text_width*2+pad;
   const score_mod_num_text = Create_widget_label(_, '00000', _, [x, y, 4], 12, TRANSPARENT, GREEN[9], [0, 0], .5, _, TEXTURES.MSDF_COMIC_1024,);
   score_mod_num_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_mod_num_text)
   _arkanoid_struct.score_mod_num_text = score_mod_num_text;


   // Render
   menu.options = SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
   menu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

   
   menu.Render()
   menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(menu);
   Construct_listen_events_relations_from_mesh_tree(menu);
   Root_group_activate_all_vbs_in_renderqueue(menu.root_bufferidx);

   
   // Set and update bricks uniforms for the INNER_SHADOW shader
   menu.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .0, 1.0]);

   // score_num.text_mesh.RenderTextFromNumber(0);







   ypos += ARKANOIS_MENU_DIM_Y*2;









   /***************************************************************************************************************/
   // Create game panel
   
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [ARKANOID_SECTION_PAD_X, ypos, 0], [ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], GREY[5]);
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   // section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[1], GREY[4]));
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move

   section.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   section.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

   const player = new Player(ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y * 2);
   section.AddItem(player.mesh);

   const bricks_buffer = Bricks_create(0, 0);
   for (let i = 0; i <= bricks_buffer.boundary; i++) {
      section.AddItem(bricks_buffer.buffer[i].mesh);
   }
   
   // const ball_buffer = Ball_init_buffer(ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y * 2);
   const ball_buffer = Ball_init_buffer(0, 0 * 2);
   for (let i = 0; i <= ball_buffer.boundary; i++) {
      section.AddItem(ball_buffer.buffer[i].mesh);
   }

   
   // Pre initialize buffers
   // Explosions
   const fx_vb_grouidx = Effects_explosion_circle_init_buffer()
   const fx_explosion_glow_vb_grouidx = Effects_explosion_glow_init_buffer()
   // Coin
   const coin_vb_grouidx = Coin_init_buffer(_);
   // Power ups
   const powup_vb_grouidx = Powup_init_buffer();
   // Score modifier text
   const score_vb_grouidxs = Score_mod_init_buffer(_);
   // Fire bullet power up
   const bullet_vb_grouidx = Bullet_init_buffer();
   
   
   arkanoid_panel_mesh = section;
   
   
   // Render
   // section.options = SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   
   // section.Calc_no_gfx_update();
   
   player.mesh.geom.pos[1] = (ARKANOID_SECTION_DIM_Y * 2) - (player.mesh.geom.dim[1]*2 + Player_get_pad());
   
   section.Render()
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   
   // Set and update bricks uniforms for the INNER_SHADOW shader
   // section.GfxUniformSetAndUpdate('u_generic_vec3', [.5, .0, .0]);
   // section.GfxUniformSetAndUpdate('u_generic_vec3', [.0, 1., 1.]);
   section.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .0, .0]);
   
   
   Renderqueue_set_priority_by_vb(LAST, bricks_buffer.buffer[0].mesh.gfx.vb.groupidx);
   Renderqueue_set_priority_by_vb(LAST, fx_vb_grouidx);
   Renderqueue_set_priority_by_vb(LAST, fx_explosion_glow_vb_grouidx);
   Renderqueue_set_priority_by_vb(LAST, powup_vb_grouidx);
   Renderqueue_set_priority_by_vb(LAST, coin_vb_grouidx);
   Renderqueue_set_priority_by_vb(LAST, score_vb_grouidxs.label);
   Renderqueue_set_priority_by_vb(LAST, score_vb_grouidxs.text_mesh);
   Renderqueue_set_priority_by_vb(LAST, bullet_vb_grouidx);


   const ball = Ball_create2(player.mesh.geom.pos[0]+player.mesh.geom.dim[0]+ARKANOID_SECTION_PAD_X, player.mesh.geom.pos[1]-player.mesh.geom.dim[1]+Arkanoid_get_main_panel_pady())
   Ball_tail_emitter_gengfx(section);
   Renderqueue_set_priority_by_vb(LAST, ball.mesh.gfx.vb.groupidx);

   const ball_release_params = { player: player, ball_idx:ball.idx };
   section.ChangeListenEvent(E.C, Arkanoid_on_click_callback, ball_release_params)




   // Set the Update() function
   const params = {
      panel: section,
      player: player,
      ball: ball,
      tail_emitter_idx: ball.tail_emitter_idx,
   };
   Time_intervals_create(1, 'Arkanoid Update', TIME_INTERVAL_REPEAT_ALWAYS, Arkanoid_run, params,);

}


function Arkanoid_on_click_callback(params) {

   if(ARK_STATE.IS(ARK_STATE.IN_START)) { // Case the ball is at start position
      Ball_release(params.evt_params.ball_idx, params.evt_params.player);
      ARK_STATE.RESET(ARK_STATE.IN_GAME);
   }
   else if(ARK_STATE.IS(ARK_STATE.FIRE_BULLET_ENABLED)) {
      Bullet_create();
   }
}




function Arkanoid_run(params) {

   const panel = params.params.panel;
   const player = params.params.player;
   let mouse_posx = Mouse_get_posx() - panel.GetPosX() - player.mesh.geom.dim[0];
   const panel_pos_local = panel.geom.pos;

   const pad = Arkanoid_get_main_panel_padxy();


   const player_pad = 0;
   const player_half_dimx = player.mesh.geom.dim[0];
   const ball = params.params.ball;

   const bound_left = (panel_pos_local[0] + player_pad);
   const bound_right = (panel_pos_local[0] + panel.geom.dim[0] * 2) - player_pad;

   // Limit player move to the left and right panel bounds
   if (mouse_posx > bound_right - player_half_dimx) mouse_posx = bound_right - player_half_dimx;
   else if (mouse_posx < bound_left - player_half_dimx) mouse_posx = bound_left - player_half_dimx;

   // Calculate player's new position
   const new_posx = mouse_posx;
   // Set player's position   
   player.mesh.geom.pos[0] = new_posx;
   player.mesh.SetPosX(new_posx + player_half_dimx);
   
   
   const pl_left = player.mesh.geom.pos[0];
   const pl_right = player.mesh.geom.pos[0] + player.mesh.geom.dim[0] * 2;
   
   if (ARK_STATE.IS(ARK_STATE.IN_GAME)) {
      
      const bound_local_left = (panel_pos_local[0] + player_pad);
      const bound_local_right = (panel_pos_local[0] + panel.geom.dim[0] * 2) - player_pad;
      const bound_local_bottom = (panel_pos_local[0] + panel.geom.dim[1] * 2) - player_pad;
      const bound_local_top = panel_pos_local[1] + player_pad;
      Ball_update(bound_local_left, bound_local_right, bound_local_top, bound_local_bottom, player.mesh.geom.pos, player.mesh.geom.dim);
      
      // Update fire bullet power up
      if(ARK_STATE.IS(ARK_STATE.GUN_ENABLED)) { 
         Gun_update_pos_x(player.mesh.geom.pos[0]+player_half_dimx+pad.x);
      }
      if(ARK_STATE.IS(ARK_STATE.FIRE_BULLET_ENABLED)) { 
         Bullet_update();
      }


      /*********************************************************************************************************/
      // Update Effects
      Effects_explosion_glow_update();
      Effects_explosion_circle_update();

   }
   else { // Case the ball is not moving AKA game in 'ARK_STATE_IN_START'
      // Ball follow player and keep the ball in players x width 
      
      // Make the ball not leave the players's width area
      if (ball.mesh.geom.pos[0] < pl_left ) {
         ball.mesh.geom.pos[0] = pl_left;
         ball.mesh.geom.SetWposX(ball.mesh.gfx, pl_left);
         Particle_system_emitter_set_position_x(ball.tail_emitter_idx, ball.mesh.geom.pos[0]);
      }
      else if (ball.mesh.geom.pos[0] > pl_right) {
         ball.mesh.geom.pos[0] = pl_right;
         ball.mesh.geom.SetWposX(ball.mesh.gfx, pl_right);
         Particle_system_emitter_set_position_x(ball.tail_emitter_idx, ball.mesh.geom.pos[0]);
      }

   }


}




export function Arkanoid_add_score_mod(score_mod_num) {

   _arkanoid_struct.score_mod_num += score_mod_num;
   _arkanoid_struct.score_num = _arkanoid_struct.score_mod_num * _arkanoid_struct.score_base_num;
   _arkanoid_struct.score_text.text_mesh.RenderTextFromNumber(_arkanoid_struct.score_num);
}
export function Arkanoid_calc_score(score_mod_num) {

   _arkanoid_struct.score_mod_num += score_mod_num;
   _arkanoid_struct.score_num = _arkanoid_struct.score_mod_num * _arkanoid_struct.score_base_num;
   _arkanoid_struct.score_num_text.text_mesh.RenderTextFromNumber(Floor(_arkanoid_struct.score_num));
   _arkanoid_struct.score_mod_num_text.text_mesh.RenderTextFromNumber(_arkanoid_struct.score_mod_num);
}