"use strict"

import { Mouse_get_posx } from "../../../../Engine/Controls/Input/Mouse.js";
import { Create_widget_label, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Effects_explosion_circle_init_buffer, Effects_explosion_circle_update, Effects_explosion_glow_init_buffer, Effects_explosion_glow_update, Effects_print } from "../../../../Engine/Drawables/Effects/Effects.js";
import { GREEN, GREY, TRANSPARENT, WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Particle_system_emitter_set_position_x } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../../../Engine/Timers/TimeIntervals.js";
import { Floor } from "../../../../Helpers/Math/MathOperations.js";
import { ARK_STATE, Arkanoid_initialize_flags, Arkanoid_initialize_stages } from "./ArkanoisConstants.js";
import { Arkanoid_balls_destroy, Arkanoid_balls_reset, Ball_create, Ball_get_main_ball, Ball_init_buffer, Ball_print, Ball_release, Ball_reset, BALL_SIZE, Ball_update } from "./Ball.js";
import { Animation_, Arkanoid_bricks_destroy, Arkanoid_bricks_reset, Bricks_init_buffer, Bricks_reset_all_deactivated_bricks, Bricks_set_stage_bricks } from "./Bricks.js";
import { Arkanoid_coin_destroy, Arkanoid_coin_reset, Coin_init_buffer, Coin_is_all_animations_finished, Coin_print, Coin_set_false_is_all_animations_finished, COIN_SIZE, COIN_TEXTURE, Coin_update } from "./Coin.js";
import { Arkanoid_bulletgun_destroy, Arkanoid_bulletgun_reset, Bullet_create, Bullet_init_buffer, Bullet_update, Gun_disable, Gun_update_pos_x } from "./BulletGun.js";
import { Arkanoid_player_reset, Player_init, Player_set_position } from "./Player.js";
import { Arkanoid_powerup_reset, Arkanoid_powup_destroy, Powup_init_buffer, Powup_print, Powup_remove_all } from "./PowerUps.js";
import { Arkanoid_scoremod_destroy, Arkanoid_scoremod_reset, Score_mod_init_buffer } from "./ScoreMod.js";
import { View_add_to_group, View_build_group_from_root_mesh, View_activate_all_vbs } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Check_intersection_point_rect } from "../../../../Engine/Drawables/Operations/Collisions.js";





const ARKANOID_MENU_DIM_Y = 50;
export const ARKANOID_SECTION_DIM_X = 300, ARKANOID_SECTION_DIM_Y = 350;
const ARKANOID_SECTION_PAD_X = 100, ARKANOID_SECTION_PAD_Y = 100;


let arkanoid_panel_mesh = null;

const _arkanoid_struct = {

   start_menu: {
      panel: { view_group: null, mesh: null },
      start_btn: { view_group: null, mesh: null },
   },
   game_menu: {
      panel: { view_group: null, mesh: null },
   },
   game_panel: {
      panel: { view_group: null, mesh: null },
      player: { view_group: null, mesh: null },
      balls: { view_group: null, mesh: null },
      balls_tail_emitter: { view_group: null },
      bricks: { view_group: null, mesh: null },
      fx_explosion_circle: { view_group: null },
      fx_explosion_glow: { view_group: null },
      coins: { view_group: null },
      powups: { view_group: null },
      gun: { view_group: null },
   },
   stage_finish: {
      panel: null,
   },
   in_game: { update_loop_time_interval_idx: INT_NULL, },

   // score:null, 
   score_text: null,
   score_num_text: null,
   score_mod_text: null,
   score_mod_num_text: null,
   score_num: 0,
   score_mod_num: 0,
   score_base_num: 10,
   combo_text: null,
   combo_num_text: null,
   combo_num: 0,
   coins_texture: null,
   coins_num_text: null,
   coins_num: 0,

   is_stage_completed_initiated: false,
   is_last_ball_lost: false,

};





/** Getters for root panel */
// TODO: Remove 'arkanoid_panel_mesh' and use '_arkanoid_struct.game_panel'
export function Arkanoid_get_main_panel_padxy() { return { x: ARKANOID_SECTION_PAD_X, y: ARKANOID_SECTION_PAD_Y + ARKANOID_MENU_DIM_Y * 2 }; }
export function Arkanoid_get_main_panel_padx() { return ARKANOID_SECTION_PAD_X; }
export function Arkanoid_get_main_panel_pady() { return ARKANOID_SECTION_PAD_Y + ARKANOID_MENU_DIM_Y * 2; }
export function TEMP_Arkanoid_get_main_panel() { return arkanoid_panel_mesh; }
export function Arkanoid_get_panel_pos_x() { return arkanoid_panel_mesh.geom.pos[0]; }
export function Arkanoid_get_panel_center_pos_x() { return arkanoid_panel_mesh.geom.pos[0] + arkanoid_panel_mesh.geom.dim[0]; }
export function Arkanoid_get_panel_dim_x() { return arkanoid_panel_mesh.geom.dim[0]; }
export function Arkanoid_get_panel_dim_y() { return arkanoid_panel_mesh.geom.dim[1]; }
export function Arkanoid_get_panel_right() { return arkanoid_panel_mesh.geom.pos[0] + arkanoid_panel_mesh.geom.dim[0] * 2; }
export function Arkanoid_get_panel_bottom() { return arkanoid_panel_mesh.geom.pos[1] + arkanoid_panel_mesh.geom.dim[1] * 2; }



/** */
export function Arkanoid_initialize() {

   Arkanoid_initialize_flags();

   Arkanoid_initialize_stages()

   ARK_STATE.RESET(ARK_STATE.START);

   let ypos = ARKANOID_SECTION_PAD_Y;

   Arkanoid_initialize_game(ARKANOID_SECTION_PAD_X, ypos);
   View_activate_all_vbs(_arkanoid_struct.game_panel.panel.view_group, false);
   Arkanoid_initialize_start_menu(ARKANOID_SECTION_PAD_X, ypos);
}
/** */
function Arkanoid_load_state(state) {

   // Unload
   if (ARK_STATE.IS(ARK_STATE.START)) { // Case the game is at start menu
      View_activate_all_vbs(_arkanoid_struct.start_menu.panel.view_group, false);
   }
   else if (ARK_STATE.IS(ARK_STATE.IN_GAME_PLAY)) {
      View_activate_all_vbs(_arkanoid_struct.game_panel.panel.view_group, false);
      Time_intervals_destroy_byidx(_arkanoid_struct.in_game.update_loop_time_interval_idx);
      _arkanoid_struct.in_game.update_loop_time_interval_idx = INT_NULL;
   }

   ARK_STATE.RESET(state);

   // Load
   if (ARK_STATE.IS(ARK_STATE.START)) { // Case the game is at start menu
      View_activate_all_vbs(_arkanoid_struct.start_menu.panel.view_group, true);
      Coin_set_false_is_all_animations_finished();
   }
   else if (ARK_STATE.IS(ARK_STATE.IN_GAME_PLAY)) { // Case the game is at the start stage
      View_activate_all_vbs(_arkanoid_struct.game_panel.panel.view_group, true);
      Bricks_reset_all_deactivated_bricks();
      Bricks_set_stage_bricks(_, _, _arkanoid_struct.game_panel.panel.view_group[0]);
      Arkanoid_create_brick_animation();
      ARK_STATE.ADD(ARK_STATE.BALL_START);
   }
}
/** Mouse click event callback */
function Arkanoid_on_click_callback(params) {

   if (ARK_STATE.IS(ARK_STATE.BALL_START)) { // Case the ball is at start position
      Ball_release(params.evt_params.player);
      ARK_STATE.REMOVE(ARK_STATE.BALL_START);
   }
   else if (ARK_STATE.IS(ARK_STATE.START)) {

      const intersects = Check_intersection_point_rect(_arkanoid_struct.start_menu.start_btn.GetPosXY(), _arkanoid_struct.start_menu.start_btn.geom.dim, params.click_pos,);
      if (intersects)
         Arkanoid_load_state(ARK_STATE.IN_GAME_PLAY);

   }
   else if (ARK_STATE.IS(ARK_STATE.FIRE_BULLET_ENABLED)) {
      Bullet_create();
   }
}
/** */
function Arkanoid_initialize_start_menu(x, y) {

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x, y, 0], [ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], GREY[4]);
   section.SetName('Arkanoid-Start Menu Panel');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move

   // section.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   section.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 20);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);


   section.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);




   /*******************************************************************************************/
   // Load menu button
   const start_menu_btn = Create_widget_label(_, 'Start', _, [0, 0, 1], 40, GREEN[7], WHITE, [16, 16], .5, _, TEXTURES.MTSDF_COMIC_1024);
   start_menu_btn.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);
   start_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   start_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   start_menu_btn.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   start_menu_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   start_menu_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 35);
   start_menu_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   start_menu_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   // start_menu_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // start_menu_btn.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);


   section.AddItem(start_menu_btn);

   _arkanoid_struct.start_menu.start_btn = start_menu_btn;

   let posx = ARKANOID_SECTION_DIM_X - start_menu_btn.geom.dim[0];
   let posy = ARKANOID_SECTION_DIM_Y - start_menu_btn.geom.dim[1];
   start_menu_btn.MoveNoGfxUpdate(posx, posy);





   /*******************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

   section.Render()
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

   // Set and update bricks uniforms for the INNER_SHADOW shader
   section.GfxUniformSetAndUpdate('u_generic_controls', [.25, 1., .5]);

   View_build_group_from_root_mesh(section);
   _arkanoid_struct.start_menu.panel.view_group = section.group_bufferidxs;



   return section;
}
/** */
function Arkanoid_initialize_game(x, y) {

   let ypos = y;

   /***************************************************************************************************************/
   // Create score panel

   const menu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x, ypos, 0], [ARKANOID_SECTION_DIM_X, ARKANOID_MENU_DIM_Y], GREY[5]);
   menu.SetName('Arkanoid-Menu');
   menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move

   menu.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   menu.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   menu.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   menu.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   menu.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   menu.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

   _arkanoid_struct.menu = menu;

   const pad = 10;
   x = pad;
   y = pad;

   // Score text
   const score_text = Create_widget_label(_, 'score', _, [x, y, 4], 12, TRANSPARENT, WHITE, [0, 0], .5, _, TEXTURES.MTSDF_COMIC_1024,);
   score_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_text);
   _arkanoid_struct.score_text = score_text;
   score_text.text_mesh.mat.x

   x += score_text.text_mesh.text_width * 2 + pad;
   const score_num_text = Create_widget_label(_, '000000000', _, [x, y, 4], 12, TRANSPARENT, GREEN[9], [0, 0], .5, _, TEXTURES.MTSDF_COMIC_1024,);
   score_num_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_num_text)
   _arkanoid_struct.score_num_text = score_num_text;

   // Score modifier
   x = pad;
   y += score_text.text_mesh.geom.dim[1] * 2 + pad;
   const score_mod_text = Create_widget_label(_, 'score mod', _, [x, y, 4], 12, TRANSPARENT, WHITE, [0, 0], .5, _, TEXTURES.MTSDF_COMIC_1024,);
   score_mod_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_mod_text);
   _arkanoid_struct.score_mod_text = score_mod_text;

   x += score_mod_text.text_mesh.text_width * 2 + pad;
   const score_mod_num_text = Create_widget_label(_, '00000', _, [x, y, 4], 12, TRANSPARENT, GREEN[9], [0, 0], .5, _, TEXTURES.MTSDF_COMIC_1024,);
   score_mod_num_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(score_mod_num_text)
   _arkanoid_struct.score_mod_num_text = score_mod_num_text;

   // Coins counter
   // x += (menu.geom.dim[0]*2) score_mod_num_text.text_mesh.text_width*2+pad;
   x += score_mod_num_text.text_mesh.text_width * 2 + pad + 130;
   y = pad;
   const coins_texture = Create_widget_section(_, _, [0, 0], [x, y, 4], [COIN_SIZE, COIN_SIZE], WHITE, 'CoinCounterUi', _, _, COIN_TEXTURE);
   coins_texture.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(coins_texture);
   _arkanoid_struct.coins_texture = coins_texture;

   x += coins_texture.geom.dim[0] * 2 + pad;
   const coins_texture_text = Create_widget_label(_, 'x000', _, [x, y, 4], 12, TRANSPARENT, GREEN[9], [0, 0], .5, _, TEXTURES.MTSDF_COMIC_1024,);
   coins_texture_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(coins_texture_text)
   _arkanoid_struct.coins_num_text = coins_texture_text;


   // Combo counter
   y += coins_texture.geom.dim[1] * 2 + pad;
   // x = coins_texture.geom.pos[0] + score_mod_num_text.text_mesh.text_width*2+pad;
   x = coins_texture.geom.pos[0];
   const combo_text = Create_widget_label(_, 'combo', _, [x, y, 4], 12, TRANSPARENT, WHITE, [0, 0], .5, _, TEXTURES.MTSDF_COMIC_1024,);
   combo_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(combo_text);
   _arkanoid_struct.combo_text = combo_text;

   x += combo_text.text_mesh.text_width * 2 + pad;
   const combo_num_text = Create_widget_label(_, 'x000', _, [x, y, 4], 12, TRANSPARENT, GREEN[9], [0, 0], .5, _, TEXTURES.MTSDF_COMIC_1024,);
   combo_num_text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.AddItem(combo_num_text)
   _arkanoid_struct.combo_num_text = combo_num_text;


   // Render
   menu.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENT;
   menu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   menu.Render()
   menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(menu);
   Construct_listen_events_relations_from_mesh_tree(menu);
   Root_group_activate_all_vbs_in_renderqueue(menu.root_bufferidx);


   // Set and update bricks uniforms for the INNER_SHADOW shader
   menu.GfxUniformSetAndUpdate('u_generic_controls', [1.0, .3, 1.0]);

   score_num_text.text_mesh.RenderTextFromNumber(0);
   score_mod_num_text.text_mesh.RenderTextFromNumber(0);
   coins_texture_text.text_mesh.RenderTextFromNumber(0);
   combo_num_text.text_mesh.RenderTextFromNumber(0);


   View_build_group_from_root_mesh(menu);
   const group_idx = menu.group_bufferidxs[0];

   View_add_to_group(score_text, group_idx);
   View_add_to_group(score_num_text, group_idx);
   View_add_to_group(score_mod_text, group_idx);
   View_add_to_group(score_mod_num_text, group_idx);
   View_add_to_group(combo_text, group_idx);
   View_add_to_group(combo_num_text, group_idx);




   ypos += ARKANOID_MENU_DIM_Y * 2;









   /***************************************************************************************************************/
   // Create game panel

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [ARKANOID_SECTION_PAD_X, ypos, 0], [ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], GREY[5]);
   section.SetName('Arkanoid-Game Panel');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move


   section.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


   section.EnableGfx(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   section.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

   arkanoid_panel_mesh = section;
   _arkanoid_struct.game_panel.panel.view_group = section.group_bufferidxs;
   _arkanoid_struct.game_panel.panel.mesh = section;

   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render()
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);


   // Set and update bricks uniforms for the INNER_SHADOW shader
   // section.GfxUniformSetAndUpdate('u_generic_controls', [1.0, .3, 1.0]);
   section.GfxUniformSetAndUpdate('u_generic_controls', [.0, .0, .0]);


   View_add_to_group(section, group_idx);


   /***********************************************************************************/

   const parent = section;

   const player = Player_init(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   const player_posx = ARKANOID_SECTION_DIM_X - player.mesh.geom.dim[0];
   const player_posy = ARKANOID_SECTION_DIM_Y * 2 - (player.mesh.geom.dim[1] * 2 + 20); // 20: some padd from bottom
   Player_set_position(player_posx, player_posy);
   _arkanoid_struct.game_panel.player.view_group = player.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.player.mesh = player;


   const ball_buffer = Ball_init_buffer(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   const ball_posx = player.mesh.geom.pos[0] + BALL_SIZE * 2;
   const ball_posy = player.mesh.geom.pos[1] - BALL_SIZE * 2;
   const ball = Ball_create(ball_posx, ball_posy)
   _arkanoid_struct.game_panel.balls.view_group = ball.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.balls.mesh = ball;


   const brick = Bricks_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.bricks.view_group = brick.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.bricks.mesh = brick;



   // Pre initialize buffers
   // Score modifier text
   const score_vb_grouidxs = Score_mod_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx, _);
   // Explosions
   const fx_explosion_circle = Effects_explosion_circle_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.fx_explosion_circle.view_group = fx_explosion_circle.mesh.group_bufferidxs;
   const fx_explosion_glow = Effects_explosion_glow_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.fx_explosion_glow.view_group = fx_explosion_glow.mesh.group_bufferidxs;
   // Coin
   const coin = Coin_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx, _);
   _arkanoid_struct.game_panel.coins.view_group = coin.mesh.group_bufferidxs;
   // Power ups
   const powup = Powup_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx,);
   _arkanoid_struct.game_panel.powups.view_group = powup.mesh.group_bufferidxs;
   // Fire bullet power up
   const gun = Bullet_init_buffer(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.gun.view_group = gun.mesh.group_bufferidxs;


   // Renderqueue_set_priority_by_vb(LAST, bricks_buffer.buffer[0].mesh.gfx.vb.groupidx);


   const ball_release_params = { player: player };
   section.ChangeListenEvent(E.C, Arkanoid_on_click_callback, ball_release_params);


   console.warn('player', player.mesh.geom.pos);
   console.warn('ball', ball.mesh.geom.pos);
   console.warn('arkanoid_struct', _arkanoid_struct);


}
/** */
function Arkanoid_create_brick_animation() {

   Animation_();
}
/** */
export function Arkanoid_create_update_game_loop() {

   const params = {
      panel: _arkanoid_struct.game_panel.panel.mesh,
      player: _arkanoid_struct.game_panel.player.mesh,
      ball: _arkanoid_struct.game_panel.balls.mesh,
      tail_emitter_idx: _arkanoid_struct.game_panel.balls.mesh.tail_emitter_idx,
   };
   _arkanoid_struct.in_game.update_loop_time_interval_idx = Time_intervals_create(1, 'Arkanoid Update', TIME_INTERVAL_REPEAT_ALWAYS, Arkanoid_run, params,);
}
/** */
function Arkanoid_run(params) {

   if (Coin_is_all_animations_finished()) {
      Arkanoid_initiate_stage_completed(params.params.player);
   }
   if (ARK_STATE.IS(ARK_STATE.LAST_BALL_LOST)) {
      Arkanoid_initiate_ball_start(params.params.player);
      ARK_STATE.REMOVE(ARK_STATE.LAST_BALL_LOST);
      ARK_STATE.ADD(ARK_STATE.BALL_START);
   }

   const panel = params.params.panel;
   const player = params.params.player;
   const game_panel_pos = panel.GetPosXY();
   let mouse_posx = Mouse_get_posx();


   const player_half_dimx = player.mesh.geom.dim[0];


   const bound_left = game_panel_pos[0];
   const bound_right = game_panel_pos[0] + panel.geom.dim[0] * 2;

   let posx = mouse_posx - game_panel_pos[0] - player_half_dimx;

   // Limit player move to the left and right panel bounds
   if (posx > bound_right - player_half_dimx * 2) posx = bound_right - player_half_dimx * 2;
   else if (posx < bound_left - player_half_dimx * 2) posx = bound_left - player_half_dimx * 2;

   // Set player's new position
   const new_posx = posx;
   player.mesh.geom.pos[0] = new_posx;
   player.mesh.SetPosX(new_posx + player_half_dimx);


   const pl_left = player.mesh.geom.pos[0];
   const pl_right = player.mesh.geom.pos[0] + player.mesh.geom.dim[0] * 2;

   const apos = panel.geom.pos
   if (ARK_STATE.IS(ARK_STATE.IN_GAME_PLAY)) {

      if (ARK_STATE.IS(ARK_STATE.BALL_START)) { // Case the ball is not moving AKA game in 'ARK_STATE_IN_START'
         // Ball follows player and constrain it in players width 

         const ball = Ball_get_main_ball();

         // Make the ball not leave the players's width area
         if (ball.mesh.geom.pos[0] < pl_left) {
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
      else {

         const bound_local_left = (apos[0]);
         const bound_local_right = (apos[0] + panel.geom.dim[0] * 2);
         const bound_local_bottom = (apos[0] + panel.geom.dim[1] * 2);
         const bound_local_top = apos[1];
         Ball_update(bound_local_left, bound_local_right, bound_local_top, bound_local_bottom, player.mesh.geom.pos, player.mesh.geom.dim);
      }

      // Update fire bullet power up
      if (ARK_STATE.IS(ARK_STATE.GUN_ENABLED)) {
         // Gun_update_pos_x(game_panel_pos[0] + player.mesh.geom.pos[0] + player_half_dimx);
         Gun_update_pos_x(player.mesh.geom.pos[0] + player_half_dimx);
      }
      if (ARK_STATE.IS(ARK_STATE.FIRE_BULLET_ENABLED)) {
         Bullet_update();
      }

      Coin_update();


      // Update Effects
      Effects_explosion_glow_update();
      Effects_explosion_circle_update();

   }

}
/** */
function Arkanoid_initiate_stage_completed(player) {

   Ball_print();
   Coin_print();
   Powup_print();
   Effects_print();



   // Reset all game meshes
   Ball_reset(player.mesh.geom.pos[0] + BALL_SIZE * 2, player.mesh.geom.pos[1] - BALL_SIZE * 2);
   Gun_disable();
   Powup_remove_all();

   Arkanoid_combo_counter_reset();

   Arkanoid_load_state(ARK_STATE.START);
}
/** */
function Arkanoid_initiate_ball_start(player) {

   // Reset all game meshes
   Gun_disable();
   Powup_remove_all();

   Arkanoid_combo_counter_reset();

   const ball_posy = player.mesh.geom.pos[1] - BALL_SIZE * 2;
   Ball_create(player.mesh.geom.pos[0] + player.mesh.geom.dim[0], ball_posy,);

   ARK_STATE.RESET(ARK_STATE.IN_GAME_PLAY);

}



/** */
export function Arkanoid_score_mod_add(score_mod_num) {

   _arkanoid_struct.score_mod_num += score_mod_num;
   _arkanoid_struct.score_num = _arkanoid_struct.score_mod_num * _arkanoid_struct.score_base_num;
   _arkanoid_struct.score_text.text_mesh.RenderTextFromNumber(_arkanoid_struct.score_num);
}
/** */
export function Arkanoid_score_calc(score_mod_num) {

   _arkanoid_struct.score_mod_num += score_mod_num;
   _arkanoid_struct.score_mod_num_text.text_mesh.RenderTextFromNumber(_arkanoid_struct.score_mod_num);
   _arkanoid_struct.score_num += (_arkanoid_struct.score_base_num);
   _arkanoid_struct.score_num += (_arkanoid_struct.score_base_num * _arkanoid_struct.combo_num + 1);
   _arkanoid_struct.score_num_text.text_mesh.RenderTextFromNumber(Floor(_arkanoid_struct.score_num));
}
/** */
export function Arkanoid_combo_counter_get() {
   return _arkanoid_struct.combo_num;
}
/** */
export function Arkanoid_combo_counter_reset() {
   _arkanoid_struct.combo_num = 0;
   _arkanoid_struct.combo_num_text.text_mesh.RenderTextFromString(`x${_arkanoid_struct.combo_num}`);
}
/** */
export function Arkanoid_combo_counter_add(val) {
   _arkanoid_struct.combo_num += val;
   _arkanoid_struct.combo_num_text.text_mesh.RenderTextFromString(`x${_arkanoid_struct.combo_num}`);

}
/** */
export function Arkanoid_coin_counter_add(val) {
   _arkanoid_struct.coins_num += val;
   _arkanoid_struct.coins_num_text.text_mesh.RenderTextFromString(`x${_arkanoid_struct.coins_num}`);

}




/** */
export function Arkanoid_reset() {

   Arkanoid_scoremod_reset();
   Arkanoid_powerup_reset();
   Arkanoid_player_reset();
   Arkanoid_coin_reset();
   Arkanoid_bulletgun_reset();
   Arkanoid_bricks_reset();
   Arkanoid_balls_reset();

}




/** */
export function Arkanoid_free_buffers() {

   Arkanoid_scoremod_destroy();
   Arkanoid_powup_destroy();
   Arkanoid_coin_destroy();
   Arkanoid_bulletgun_destroy();
   Arkanoid_bricks_destroy();
   Arkanoid_balls_destroy();

}