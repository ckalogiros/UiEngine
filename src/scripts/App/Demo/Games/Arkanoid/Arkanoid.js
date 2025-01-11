"use strict"

import { Mouse_get_posx } from "../../../../Engine/Controls/Input/Mouse.js";
import { Create_widget_button, Create_widget_label, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Effects_explosion_circle_init_buffer, Effects_explosion_circle_update, Effects_explosion_glow_init_buffer, Effects_explosion_glow_update, Effects_print } from "../../../../Engine/Drawables/Effects/Effects.js";
import { GREEN, GREY, TRANSPARENT, WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Particle_system_emitter_set_position_x } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../../../Engine/Timers/TimeIntervals.js";
import { Floor } from "../../../../Helpers/Math/MathOperations.js";
import { ARK_STATE } from "./ArkanoisConstants.js";
import { Ball_create, Ball_init_buffer, Ball_print, Ball_release, Ball_reset, BALL_SIZE, Ball_update } from "./Ball.js";
import { Bricks_init_buffer, Bricks_is_any_brick_alive, Bricks_reset_all_deactivated_bricks, Bricks_set_stage_bricks } from "./Bricks.js";
import { Coin_init_buffer, Coin_print } from "./Coin.js";
import { Bullet_create, Bullet_init_buffer, Bullet_update, Gun_disable, Gun_update_pos_x } from "./BulletGun.js";
import { Player_init, Player_set_position } from "./Player.js";
import { Powup_init_buffer, Powup_print } from "./PowerUps.js";
import { Score_mod_init_buffer } from "./ScoreMod.js";
import { View_add_to_group, View_build_group_from_root_mesh, View_activate_all_vbs } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";





const ARKANOIS_MENU_DIM_Y = 50;
const ARKANOID_SECTION_DIM_X = 250, ARKANOID_SECTION_DIM_Y = 350;
const ARKANOID_SECTION_PAD_X = 100, ARKANOID_SECTION_PAD_Y = 100;


let arkanoid_panel_mesh = null;

const _arkanoid_struct = {

   start_menu: {
      panel:{ view_group:null, mesh:null },
   },
   game_menu: {
      panel:{ view_group:null, mesh:null },
   },
   game_panel: {
      panel:{ view_group:null, mesh:null },
      player:{ view_group:null, mesh:null },
      balls:{ view_group:null, mesh:null },
      balls_tail_emitter:{ view_group:null },
      bricks:{ view_group:null, mesh:null },
      fx_explosion_circle:{ view_group:null },
      fx_explosion_glow:{ view_group:null },
      coins:{ view_group:null },
      powups:{ view_group:null },
      gun:{ view_group:null },
   },
   stage_finish: {
      panel:null,
   },
   in_game: { update_loop_time_interval_idx: INT_NULL, },

   // score:null, 
   score_text:null, 
   score_num_text:null,
   score_mod_text:null,
   score_mod_num_text:null,
   score_num:0,
   score_mod_num:0,
   score_base_num:10, 

   // game_panel_group:null,
   // player_group:null,
   // balls_group:null,
   // balls_tail_emitter_group:null,
   // bricks_group:null,
   // fx_explosion_circle_group:null,
   // fx_explosion_glow_group:null,
   // coins_group:null,
   // powups_group:null,
   // fire_bullets_group:null,

   is_stage_completed_initiated: false,
   
};






// TODO: Remove 'arkanoid_panel_mesh' and use '_arkanoid_struct.game_panel'
export function Arkanoid_get_main_panel_padxy() { return {x:ARKANOID_SECTION_PAD_X, y:ARKANOID_SECTION_PAD_Y + ARKANOIS_MENU_DIM_Y*2}; }
export function Arkanoid_get_main_panel_padx() { return ARKANOID_SECTION_PAD_X; }
export function Arkanoid_get_main_panel_pady() { return ARKANOID_SECTION_PAD_Y + ARKANOIS_MENU_DIM_Y*2; }
export function TEMP_Arkanoid_get_main_panel() { return arkanoid_panel_mesh; }
export function Arkanoid_get_panel_center_pos_x() { return arkanoid_panel_mesh.geom.pos[0] + arkanoid_panel_mesh.geom.dim[0]; }
export function Arkanoid_get_panel_dim_x() { return arkanoid_panel_mesh.geom.dim[0]; }
export function Arkanoid_get_panel_dim_y() { return arkanoid_panel_mesh.geom.dim[1]; }
export function Arkanoid_get_panel_right() { return arkanoid_panel_mesh.geom.pos[0] + arkanoid_panel_mesh.geom.dim[0]*2; }
export function Arkanoid_get_panel_bottom() { return arkanoid_panel_mesh.geom.pos[1] + arkanoid_panel_mesh.geom.dim[1]*2; }




export function Arkanoid_initialize() {

   ARK_STATE.RESET(ARK_STATE.START);
   // ARK_STATE.RESET(ARK_STATE.IN_GAME_START);


   let ypos = ARKANOID_SECTION_PAD_Y;
   
   Arkanoid_initialize_game(ARKANOID_SECTION_PAD_X, ypos);
   View_activate_all_vbs(_arkanoid_struct.game_panel.panel.view_group, false);
   Arkanoid_initialize_start_menu(ARKANOID_SECTION_PAD_X, ypos);
}
function Arkanoid_load_state(state) {

   // Unload
   if(ARK_STATE.IS(ARK_STATE.START)) { // Case the ball is at start position
      View_activate_all_vbs(_arkanoid_struct.start_menu.panel.view_group, false);
   }
   else if(ARK_STATE.IS(ARK_STATE.IN_GAME_PLAY)) {
      View_activate_all_vbs(_arkanoid_struct.game_panel.panel.view_group, false);
      // Time_intervals_destroy_byidx(_arkanoid_struct.in_game.update_loop_time_interval_idx);
      _arkanoid_struct.in_game.update_loop_time_interval_idx = INT_NULL;
   }
   
   ARK_STATE.RESET(state);
   
   // Load
   if(ARK_STATE.IS(ARK_STATE.START)) { // Case the ball is at start position
      View_activate_all_vbs(_arkanoid_struct.start_menu.panel.view_group, true);
   }
   else if(ARK_STATE.IS(ARK_STATE.IN_GAME_START)) {
      View_activate_all_vbs(_arkanoid_struct.game_panel.panel.view_group, true);
      Bricks_reset_all_deactivated_bricks();
      Bricks_set_stage_bricks(_, _, _arkanoid_struct.game_panel.panel.view_group[0]);
      Arkanoid_create_update_game_loop();
   }
}
// Mouse click event callback
function Arkanoid_on_click_callback(params) {

   if(ARK_STATE.IS(ARK_STATE.IN_GAME_START)) { // Case the ball is at start position
      Ball_release(params.evt_params.ball_idx, params.evt_params.player);
      ARK_STATE.RESET(ARK_STATE.IN_GAME_PLAY);
   }
   else if(ARK_STATE.IS(ARK_STATE.FIRE_BULLET_ENABLED)) {
      Bullet_create();
   }
   else if(ARK_STATE.IS(ARK_STATE.START)) {
      Arkanoid_load_state(ARK_STATE.IN_GAME_START);
   }
}

function Arkanoid_initialize_start_menu(x, y) {

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x, y, 0], [ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], GREY[5]);
   section.SetName('Arkanoid-Start Menu Panel');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move

   section.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   section.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);







   /*******************************************************************************************/
   // Load menu button
   const start_menu_btn = Create_widget_button(_, 'Start', _, [0, 0, 1], 40, GREEN[7], WHITE, [16, 16], .5, _, TEXTURES.MSDF_COMIC_1024);
   start_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   start_menu_btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   start_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 1.8);
   start_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   
   start_menu_btn.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   start_menu_btn.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

   section.AddItem(start_menu_btn);

   let posx = ARKANOID_SECTION_DIM_X - start_menu_btn.geom.dim[0];
   let posy = ARKANOID_SECTION_DIM_Y - start_menu_btn.geom.dim[1];
   start_menu_btn.MoveNoGfxUpdate(posx, posy);

   // TODO: Resolve the all click events from 'Arkanoid_on_click_callback'. At this point the code below is not correct, it does not pass any parameters 
   const evt_params = { target_params: null};
   start_menu_btn.Bind(
      ()=>{ 
         Arkanoid_on_click_callback(ARK_STATE.IN_GAME_START) 
      }, 
      _, evt_params
   );








   /*******************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   
   section.Render()
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   
   // Set and update bricks uniforms for the INNER_SHADOW shader
   // section.GfxUniformSetAndUpdate('u_generic_vec3', [.2, .6, .7]);
   section.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .0, .0]);
   
   View_build_group_from_root_mesh(section);
   _arkanoid_struct.start_menu.panel.view_group = section.group_bufferidxs;







   /*******************************************************************************************/
   // 
   // const evt_params = {  };
   // start_menu_btn.ChangeListenEvent(E.C, Arkanoid_on_click_callback, evt_params);
   
   return section;
}
function Arkanoid_initialize_game(x, y) {

   let ypos = y;

   /***************************************************************************************************************/
   // Create score and menu
   
   const menu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x, ypos, 0], [ARKANOID_SECTION_DIM_X, ARKANOIS_MENU_DIM_Y], GREY[5]);
   menu.SetName('Arkanoid-Menu');
   menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   menu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   menu.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move
   
   menu.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   menu.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
   
   _arkanoid_struct.menu = menu;
   
   const pad = 10;
   x = pad;
   y = pad;

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
   menu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

   
   menu.Render()
   menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(menu);
   Construct_listen_events_relations_from_mesh_tree(menu);
   Root_group_activate_all_vbs_in_renderqueue(menu.root_bufferidx);

   
   // Set and update bricks uniforms for the INNER_SHADOW shader
   menu.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .0, 1.0]);

   // score_num.text_mesh.RenderTextFromNumber(0);


   View_build_group_from_root_mesh(menu);
   const group_idx = menu.group_bufferidxs[0];

   View_add_to_group(score_text, group_idx);
   View_add_to_group(score_num_text, group_idx);
   View_add_to_group(score_mod_text, group_idx);
   View_add_to_group(score_mod_num_text, group_idx);




   ypos += ARKANOIS_MENU_DIM_Y*2;









   /***************************************************************************************************************/
   // Create game panel
   
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [ARKANOID_SECTION_PAD_X, ypos, 0], [ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], GREY[5]);
   section.SetName('Arkanoid-Game Panel');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   // section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[1], GREY[4]));
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move

   section.EnableGfxAttributes(MESH_ENABLE.GFX.FN_INNER_SHADOW);
   section.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

   arkanoid_panel_mesh = section;
   _arkanoid_struct.game_panel.panel.view_group = section.group_bufferidxs;
   _arkanoid_struct.game_panel.panel.mesh = section;
   
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   
   
   section.Render()
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   
   
   // Set and update bricks uniforms for the INNER_SHADOW shader
   // section.GfxUniformSetAndUpdate('u_generic_vec3', [.5, .0, .0]);
   // section.GfxUniformSetAndUpdate('u_generic_vec3', [.0, 1., 1.]);
   section.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .0, .0]);
   
   View_add_to_group(section, group_idx);


   /***********************************************************************************/

   const parent = section;
   
   let posx = section.geom.pos[0];
   let posy = section.geom.pos[1];


   // const player = Player_init(posx, posy, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   const player = Player_init(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   const player_posx = ARKANOID_SECTION_DIM_X - player.mesh.geom.dim[0]; 
   const player_posy = ARKANOID_SECTION_DIM_Y * 2 - (player.mesh.geom.dim[1]*2 + 20); // 20: some padd from bottom
   Player_set_position(player_posx, player_posy);
   _arkanoid_struct.game_panel.player.view_group = player.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.player.mesh = player;
   
   
   const ball_buffer = Ball_init_buffer(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   const ball_posx = player.mesh.geom.pos[0] + BALL_SIZE*2;
   const ball_posy = player.mesh.geom.pos[1] - BALL_SIZE*2;
   const ball = Ball_create(ball_posx, ball_posy)
   _arkanoid_struct.game_panel.balls.view_group = ball.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.balls.mesh = ball;
   
   
   const brick = Bricks_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.bricks.view_group = brick.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.bricks.mesh = brick;
   // const bricks_buffer = Bricks_create(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   // _arkanoid_struct.game_panel.bricks.view_group = bricks_buffer.buffer[0].mesh.group_bufferidxs;
   // _arkanoid_struct.game_panel.bricks.mesh = bricks_buffer.buffer[0];
   
   
   
   // Pre initialize buffers
   // Explosions
   const fx_explosion_circle = Effects_explosion_circle_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.fx_explosion_circle.view_group = fx_explosion_circle.mesh.group_bufferidxs;
   const fx_explosion_glow = Effects_explosion_glow_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.fx_explosion_glow.view_group = fx_explosion_glow.mesh.group_bufferidxs;
   // Coin
   const coin = Coin_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx, _);
   _arkanoid_struct.game_panel.coins.view_group = coin.mesh.group_bufferidxs;
   // Power ups
   const powup = Powup_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx, );
   _arkanoid_struct.game_panel.powups.view_group = powup.mesh.group_bufferidxs;
   // Fire bullet power up
   const gun = Bullet_init_buffer(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.gun.view_group = gun.mesh.group_bufferidxs;
   // Score modifier text
   const score_vb_grouidxs = Score_mod_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx, _);



   {
      // Renderqueue_set_priority_by_vb(LAST, bricks_buffer.buffer[0].mesh.gfx.vb.groupidx);
      // Renderqueue_set_priority_by_vb(LAST, fx_explosion_circle_vb_grouidx);
      // Renderqueue_set_priority_by_vb(LAST, powup_vb_grouidx);
      // Renderqueue_set_priority_by_vb(LAST, fx_explosion_glow_vb_grouidx);
      // Renderqueue_set_priority_by_vb(LAST, coin_vb_grouidx);
      // Renderqueue_set_priority_by_vb(LAST, score_vb_grouidxs.label);
      // Renderqueue_set_priority_by_vb(LAST, score_vb_grouidxs.text_mesh);
      // Renderqueue_set_priority_by_vb(LAST, bullet_vb_grouidx);
      // Renderqueue_set_priority_by_vb(LAST, ball.mesh.gfx.vb.groupidx);
   }



   const ball_release_params = { player: player, ball_idx:ball.idx };
   section.ChangeListenEvent(E.C, Arkanoid_on_click_callback, ball_release_params);


   console.warn('player', player.mesh.geom.pos);
   console.warn('ball', ball.mesh.geom.pos);
   console.warn('arkanoid_struct', _arkanoid_struct);


}
function Arkanoid_create_update_game_loop() {

   const params = {
      panel: _arkanoid_struct.game_panel.panel.mesh,
      player: _arkanoid_struct.game_panel.player.mesh,
      ball: _arkanoid_struct.game_panel.balls.mesh,
      tail_emitter_idx: _arkanoid_struct.game_panel.balls.mesh.tail_emitter_idx,
   };
   _arkanoid_struct.in_game.update_loop_time_interval_idx = Time_intervals_create(1, 'Arkanoid Update', TIME_INTERVAL_REPEAT_ALWAYS, Arkanoid_run, params,);
}
function Arkanoid_run(params) {

   const is_any_brick_alive = Bricks_is_any_brick_alive();
   // if(!is_any_brick_alive && !_arkanoid_struct.is_stage_completed_initiated) 
   if(!is_any_brick_alive && !ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) 
      Arkanoid_initiate_stage_completed(params.params.panel, params.params.player);

   const panel = params.params.panel;
   const player = params.params.player;
   const game_panel_pos = panel.GetPosXY();
   let mouse_posx = Mouse_get_posx();
   
   
   const player_half_dimx = player.mesh.geom.dim[0];
   const ball = params.params.ball;
   
   const bound_left = game_panel_pos[0];
   const bound_right = game_panel_pos[0] + panel.geom.dim[0] * 2;
   
   let posx = mouse_posx - game_panel_pos[0] - player_half_dimx;

   // Limit player move to the left and right panel bounds
   if (posx > bound_right - player_half_dimx*2) posx = bound_right - player_half_dimx*2;
   else if (posx < bound_left - player_half_dimx*2) posx = bound_left - player_half_dimx*2;

   // Calculate player's new position
   const new_posx = posx;
   // Set player's position
   player.mesh.geom.pos[0] = new_posx;
   player.mesh.SetPosX(new_posx + player_half_dimx);
   
   
   const pl_left = player.mesh.geom.pos[0];
   const pl_right = player.mesh.geom.pos[0] + player.mesh.geom.dim[0] * 2;
   
   const apos = panel.geom.pos
   if (ARK_STATE.IS(ARK_STATE.IN_GAME_PLAY)) {
      
      const bound_local_left = (apos[0]);
      const bound_local_right = (apos[0] + panel.geom.dim[0] * 2);
      const bound_local_bottom = (apos[0] + panel.geom.dim[1] * 2);
      const bound_local_top = apos[1];
      Ball_update(bound_local_left, bound_local_right, bound_local_top, bound_local_bottom, player.mesh.geom.pos, player.mesh.geom.dim);
      
      // Update fire bullet power up
      if(ARK_STATE.IS(ARK_STATE.GUN_ENABLED)) { 
         // Gun_update_pos_x(game_panel_pos[0] + player.mesh.geom.pos[0] + player_half_dimx);
         Gun_update_pos_x(player.mesh.geom.pos[0] + player_half_dimx);
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


function Arkanoid_initiate_stage_completed(game_panel, player) {

   // _arkanoid_struct.is_stage_completed_initiated = true;
   ARK_STATE.ADD(ARK_STATE.STAGE_COMPLETED_INITIATED);
   
   const params = {
      game_panel:game_panel,
      player:player,
      // ball:ball,
   };
   Callback_animations_create(Animation_stage_completed_run, Animation_stage_completed_stop, params,);

   Ball_print();
   Coin_print();
   Powup_print();
   Effects_print();
}

function Animation_stage_completed_run(params){

   // setTimeout(()=>{return false}, 2000)
   // return true;
   return false;
}
function Animation_stage_completed_stop(params){

   // Deactivate the game update function
   Time_intervals_destroy_byidx(_arkanoid_struct.in_game.update_loop_time_interval_idx);
   // _arkanoid_struct.is_stage_completed_initiated = false;
   ARK_STATE.REMOVE(ARK_STATE.STAGE_COMPLETED_INITIATED);


   // Reset all game meshes
   Ball_reset(params.player.mesh.geom.pos[0] + BALL_SIZE*2, params.player.mesh.geom.pos[1] - BALL_SIZE*2);
   Gun_disable();


   // Load start menu
   Arkanoid_load_state(ARK_STATE.START);
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