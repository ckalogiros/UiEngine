"use strict"

import { Mouse_get_posx } from "../../../../Engine/Controls/Input/Mouse.js";
import { Create_widget_label, Create_rect_mesh, Create_widget_slider } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Effects_explosion_circle_init_buffer, Effects_explosion_circle_update, Effects_explosion_glow_init_buffer, Effects_explosion_glow_update, Effects_print } from "../../../../Engine/Drawables/Effects/Effects.js";
import { BLUEL, GREEN, GREY, TRANSPARENT, WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Events/EventFunctions.js";
import { Particle_system_emitter_set_position_x } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../../../Engine/Timers/TimeIntervals.js";
import { CopyArr4, Floor, Mult_arr3_scalar } from "../../../../Helpers/Math/MathOperations.js";
import { ARK_STATE, ARKANOID_COLORS, Arkanoid_initialize_flags, Arkanoid_initialize_stages } from "./ArkanoisConstants.js";
import { Arkanoid_balls_destroy, Arkanoid_balls_reset, Ball_create, Ball_get_main_ball, Ball_init_buffer, Ball_print, Ball_release, Ball_reset, BALL_SIZE, Ball_update } from "./Ball.js";
import { Animation_, Arkanoid_bricks_destroy, Arkanoid_bricks_reset, Bricks_init_buffer, Bricks_reset_all_deactivated_bricks, Bricks_set_stage_bricks } from "./Bricks.js";
import { Arkanoid_coin_destroy, Arkanoid_coin_reset, Coin_init_buffer, Coin_is_all_animations_finished, Coin_print, Coin_set_false_is_all_animations_finished, COIN_SIZE, COIN_TEXTURE, Coin_update } from "./Coin.js";
import { Arkanoid_bulletgun_destroy, Arkanoid_bulletgun_reset, Bullet_create, Bullet_init_buffer, Bullet_update, Gun_disable, Gun_update_pos_x } from "./BulletGun.js";
import { Arkanoid_player_reset, Player_init, Player_set_position } from "./Player.js";
import { Arkanoid_powerup_reset, Arkanoid_powup_destroy, Powup_init_buffer, Powup_print, Powup_remove_all } from "./PowerUps.js";
import { Arkanoid_scoremod_destroy, Arkanoid_scoremod_reset, Score_mod_init_buffer } from "./ScoreMod.js";
import { View_add_to_group, View_build_group_from_root_mesh, View_activate_all_vbs } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { Check_intersection_point_rect } from "../../../../Engine/Drawables/Operations/Collisions.js";
import { Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties } from "../../../../Engine/Drawables/Widgets/WidgetReadyStyles.js";
import { Widget_gfx_ready_enable } from "../../../Widgets/WidgetGfxReady.js";
import { Align_pre_simple } from "../../../Tests/TestAlignNestedSections.js";
import { Renderqueue_set_priority_by_vb } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Gl_set_rgb } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Slider_connect } from "../../../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Controls_create_slider_controls_from_shader_uniform_buffer_with_panel } from "../../../Widgets/WidgetGenericControlsReady.js";
import { Mesh_animations_create } from "../../../../Engine/Animations/MeshAnimations.js";





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

      const intersects = Check_intersection_point_rect(Mesh_get_real_pos_xy(_arkanoid_struct.start_menu.start_btn), _arkanoid_struct.start_menu.start_btn.geom.dim, params.click_pos,);
      if (intersects)
         Arkanoid_load_state(ARK_STATE.IN_GAME_PLAY);

   }
   else if (ARK_STATE.IS(ARK_STATE.FIRE_BULLET_ENABLED)) {
      Bullet_create();
   }
}
/** */
function Arkanoid_initialize_start_menu(x, y) {

   const section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:[x, y, 0], dim:[ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], col:GREY[1]}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:20, });
   section.SetName('Arkanoid-Start Menu Panel');
   section.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move

   section.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   // const control_values = [.4, 1., .4, .0];
   const control_values = [.7, .8, .4, .0];
   // const control_values = [1., .26, .8, .0];
   section.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
   
   
   
   
   /*******************************************************************************************/
   // Load menu button
   const start_menu_btn = Create_widget_label(Style_label_default_properties({text:'Start', pos:[0, 0, 1], font_size:40, col:ARKANOID_COLORS.blue, dim:[16, 16], text_pad:[40, 15]}));
   Widget_gfx_ready_enable({mesh:start_menu_btn, enable_sdf_rect:20, enable_pass_vpos:true});
   start_menu_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   
   start_menu_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   start_menu_btn.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
   
   
   section.AddItem(start_menu_btn);
   
   _arkanoid_struct.start_menu.start_btn = start_menu_btn;
   
   let posx = ARKANOID_SECTION_DIM_X - start_menu_btn.geom.dim[0];
   let posy = ARKANOID_SECTION_DIM_Y - start_menu_btn.geom.dim[1];
   start_menu_btn.MoveNoGfxUpdate(posx, posy);
   
   
   
   

   /*******************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   section.Render()
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
   // section.GfxUniformsSetClbk('u_blend_mode', () => { return section.sid.blend_options; }, section.gfx.vb.groupidx);
   section.GfxUniformSetAndUpdate('u_generic_controls', control_values);
   // section.GfxUniformsSetClbk('u_generic_controls', () => { return control_values; }, section.gfx.vb.groupidx);

   View_build_group_from_root_mesh(section);
   _arkanoid_struct.start_menu.panel.view_group = section.group_bufferidxs;

   Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.GB, start_menu_btn, .0015, .5, 1.1,)



   return section;
}
/** */
function Arkanoid_initialize_game(x, y) {

   let ypos = y;

   /***************************************************************************************************************/
   // Create score panel

   const menu = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:[x, ypos, 0], dim:[ARKANOID_SECTION_DIM_X, ARKANOID_MENU_DIM_Y], col:GREY[2], layout:LAYOUT.HORIZONTAL}));
   Widget_gfx_ready_enable({mesh:menu, enable_sdf_rect:10, enable_pass_vpos:true,});
   menu.SetName('Arkanoid-Menu');
   menu.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move
   // const control_values = [.7, .26, .4, .0];
   // const control_values = [.7, .6, .4, .0];
   // const control_values = [.7, .8, .4, .0];
   const control_values = [.7, .6, .8, 1.];
   menu.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   menu.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

   _arkanoid_struct.menu = menu;
   
   const pad = 10;
   x = pad;
   y = pad;
   
   // Score text
   const score_text = Create_widget_label(Style_label_default_properties({text:'score', pos:[0, 0, 4], col:TRANSPARENT, font_size:12, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, }));
   Widget_gfx_ready_enable({mesh:score_text, enable_sdf_rect:20, enable_pass_vpos:true});
   menu.AddItem(score_text);
   _arkanoid_struct.score_text = score_text;
   score_text.text_mesh.mat.x
   
   const score_num_text = Create_widget_label(Style_label_default_properties({text:'000000000', pos:[0, 0, 4], col:TRANSPARENT, font_size:12, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, }));
   Widget_gfx_ready_enable({mesh:score_num_text, enable_sdf_rect:20, enable_pass_vpos:true});
   menu.AddItem(score_num_text)
   _arkanoid_struct.score_num_text = score_num_text;
   
   // Score modifier
   x = pad;
   y += score_text.text_mesh.geom.dim[1] * 2 + pad;
   const score_mod_text = Create_widget_label(Style_label_default_properties({text:'score mod', pos:[0, 0, 4], col:TRANSPARENT, font_size:12, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, }));
   Widget_gfx_ready_enable({mesh:score_mod_text, enable_sdf_rect:20, enable_pass_vpos:true});
   menu.AddItem(score_mod_text);
   _arkanoid_struct.score_mod_text = score_mod_text;
   
   x += score_mod_text.text_mesh.text_width * 2 + pad;
   const score_mod_num_text = Create_widget_label(Style_label_default_properties({text:'00000', pos:[0, 0, 0], col:TRANSPARENT, text_col:GREEN[9], font_size:12, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, }));
   Widget_gfx_ready_enable({mesh:score_mod_num_text, enable_sdf_rect:20, enable_pass_vpos:true});
   menu.AddItem(score_mod_num_text)
   _arkanoid_struct.score_mod_num_text = score_mod_num_text;
   
   // Coins counter
   x += score_mod_num_text.text_mesh.text_width * 2 + pad + 130;
   y = pad;
   const coins_texture = Create_rect_mesh(Style_rect_default_properties({pos:[0, 0, 4], col:WHITE, dim:[COIN_SIZE, COIN_SIZE], name:'CoinCounterUi', texture_id:COIN_TEXTURE, layout:LAYOUT.VERTICAL}));
   Widget_gfx_ready_enable({mesh:coins_texture, enable_sdf_rect:20, enable_pass_vpos:true,});
   menu.AddItem(coins_texture);
   _arkanoid_struct.coins_texture = coins_texture;

   x += coins_texture.geom.dim[0] * 2 + pad;
   const coins_texture_text = Create_widget_label(Style_label_default_properties({text:'x000', pos:[0, 0, 4], col:TRANSPARENT, text_col:GREEN[9], font_size:12, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, }));
   Widget_gfx_ready_enable({mesh:coins_texture_text, enable_sdf_rect:20, enable_pass_vpos:true})
   menu.AddItem(coins_texture_text)
   _arkanoid_struct.coins_num_text = coins_texture_text;


   // Combo counter
   y += coins_texture.geom.dim[1] * 2 + pad;
   x = coins_texture.geom.pos[0];
   const combo_text = Create_widget_label(Style_label_default_properties({text:'combo', pos:[0, 0, 4], col:TRANSPARENT, font_size:12, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, }));
   Widget_gfx_ready_enable({mesh:combo_text, enable_sdf_rect:20, enable_pass_vpos:true});
   menu.AddItem(combo_text);
   _arkanoid_struct.combo_text = combo_text;

   x += combo_text.text_mesh.text_width * 2 + pad;
   const combo_num_text = Create_widget_label(Style_label_default_properties({text:'x000', pos:[0, 0, 4], col:TRANSPARENT, text_col:GREEN[9], font_size:12, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, }));
   Widget_gfx_ready_enable({mesh:combo_num_text, enable_sdf_rect:20, enable_pass_vpos:true})
   menu.AddItem(combo_num_text)
   _arkanoid_struct.combo_num_text = combo_num_text;

   Align_pre_simple(menu);

   // Render
   menu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);



   menu.Render()
   
   Construct_listen_events_from_mesh_tree(menu);
   Construct_listen_events_relations_from_mesh_tree(menu);
   Root_group_activate_all_vbs_in_renderqueue(menu.root_bufferidx);
   
   menu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, menu.gfx.vb.groupidx)
   // menu.GfxUniformSetAndUpdate('u_generic_controls', control_values); // Sdf-InnerShadow-Glow
   menu.GfxUniformsSetClbk('u_generic_controls', ()=>{ return control_values; }, menu.gfx.vb.groupidx);


   score_num_text.text_mesh.RenderTextFromNumber(0);
   score_mod_num_text.text_mesh.RenderTextFromNumber(0);
   coins_texture_text.text_mesh.RenderTextFromNumber(0);
   combo_num_text.text_mesh.RenderTextFromNumber(0);

   Renderqueue_set_priority_by_vb(LAST, coins_texture.gfx.vb.groupidx);


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

   const game_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[0, 0], pos:[ARKANOID_SECTION_PAD_X, ypos, 0], dim:[ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], col:GREY[2]}));
   Widget_gfx_ready_enable({mesh:game_panel, enable_sdf_rect:10, });
   game_panel.SetName('Arkanoid-Game Panel');
   game_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP); // Event for start ball move

   game_panel.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   game_panel.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);


   // Render
   game_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   game_panel.Render()
   Construct_listen_events_from_mesh_tree(game_panel);
   Construct_listen_events_relations_from_mesh_tree(game_panel);
   Root_group_activate_all_vbs_in_renderqueue(game_panel.root_bufferidx);
   
   
   game_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, game_panel.gfx.vb.groupidx)
   // game_panel.GfxUniformSetAndUpdate('u_generic_controls', control_values);
   game_panel.GfxUniformsSetClbk('u_generic_controls', ()=>{ return control_values; }, game_panel.gfx.vb.groupidx);




   // HERE
   arkanoid_panel_mesh = game_panel;
   View_build_group_from_root_mesh(game_panel);
   _arkanoid_struct.game_panel.panel.view_group = game_panel.group_bufferidxs;
   _arkanoid_struct.game_panel.panel.mesh = game_panel;

   View_add_to_group(game_panel, group_idx);


   /***********************************************************************************/

   const parent = game_panel;

   const player = Player_init(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   const player_posx = ARKANOID_SECTION_DIM_X - player.mesh.geom.dim[0];
   const player_posy = ARKANOID_SECTION_DIM_Y * 2 - (player.mesh.geom.dim[1] * 2 + 20); // 20: some padd from bottom
   Player_set_position(player_posx, player_posy);
   _arkanoid_struct.game_panel.player.view_group = player.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.player.mesh = player;
   
   // Explosions
   const fx_explosion_circle = Effects_explosion_circle_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.fx_explosion_circle.view_group = fx_explosion_circle.mesh.group_bufferidxs;
   const fx_explosion_glow = Effects_explosion_glow_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.fx_explosion_glow.view_group = fx_explosion_glow.mesh.group_bufferidxs;
   
   const brick = Bricks_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.bricks.view_group = brick.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.bricks.mesh = brick;


   const ball_buffer = Ball_init_buffer(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   const ball_posx = player.mesh.geom.pos[0] + BALL_SIZE * 2;
   const ball_posy = player.mesh.geom.pos[1] - BALL_SIZE * 2;
   const ball = Ball_create(ball_posx, ball_posy)
   _arkanoid_struct.game_panel.balls.view_group = ball.mesh.group_bufferidxs;
   _arkanoid_struct.game_panel.balls.mesh = ball;



   // Pre initialize buffers
   // Coin
   const coin = Coin_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx, _);
   _arkanoid_struct.game_panel.coins.view_group = coin.mesh.group_bufferidxs;
   // Power ups
   const powup = Powup_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx,);
   _arkanoid_struct.game_panel.powups.view_group = powup.mesh.group_bufferidxs;
   // Fire bullet power up
   const gun = Bullet_init_buffer(0, 0, group_idx, parent.root_posidx, parent.mesh_bufferidx);
   _arkanoid_struct.game_panel.gun.view_group = gun.mesh.group_bufferidxs;
   // Score modifier text
   const score_vb_grouidxs = Score_mod_init_buffer(group_idx, parent.root_posidx, parent.mesh_bufferidx, _);


   const ball_release_params = { player: player };
   game_panel.ChangeListenEvent(E.C, Arkanoid_on_click_callback, ball_release_params);


   // console.warn('player', player.mesh.geom.pos);
   // console.warn('ball', ball.mesh.geom.pos);
   // console.warn('arkanoid_struct', _arkanoid_struct);

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
   const game_panel_pos = Mesh_get_real_pos_xy(panel);
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
   player.mesh.SetWposX(new_posx + player_half_dimx);


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

   // Ball_print();
   // Coin_print();
   // Powup_print();
   // Effects_print();



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
function Arkanoid_create_brick_animation() {

   Animation_();
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










export function Arkanoid_test_game_options() {

   const bricks_ratio = 75 / 40;
   const brick_dim_x = 20*bricks_ratio;
   const brick_dim_y = 20;

   const yellow = new Float32Array([1, .65, 0, 1]);
   const purple = new Float32Array([.75, 0, 1., 1]);
   // const purple = new Float32Array([1., 0, 1., 1]);
   const blue = new Float32Array([0, .5, 1, 1]);
   const green = new Float32Array([0., 1., 0., 1]);
   const cyan = new Float32Array([0, .5, .75, 1]);

   const slider_ctrl_init_val = {
      yellow:.75,
      purple:.65,
      blue:1.,
      green:.5,
   };

   let vb_groupidx = INT_NULL;

   let posx = 300;
   let posy = 10;

   const control_values = [.4, .75, 1., .23];
   // const control_values = [1., .26, .8, .0];

   const mesh_yellow = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[posx, posy, 1], dim:[brick_dim_x, brick_dim_y], col:yellow, name:'brick yellow',}));
   {
      Widget_gfx_ready_enable({mesh:mesh_yellow, enable_sdf_rect:10, enable_src_color_in_main:true, });
      mesh_yellow.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      mesh_yellow.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
      mesh_yellow.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
      mesh_yellow.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      mesh_yellow.Render();
      Root_group_activate_all_vbs_in_renderqueue(mesh_yellow.root_bufferidx);
      mesh_yellow.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh_yellow.gfx.vb.groupidx);
      mesh_yellow.GfxUniformsSetClbk('u_generic_controls', ()=>{ return control_values; }, mesh_yellow.gfx.vb.groupidx);
      Construct_listen_events_from_mesh_tree(mesh_yellow);
      Construct_listen_events_relations_from_mesh_tree(mesh_yellow);
   }

   posy+=brick_dim_y*2+20
   const mesh_purple = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[posx, posy, 1], dim:[brick_dim_x, brick_dim_y], col:purple, name:'brick purple',}));
   {
      Widget_gfx_ready_enable({mesh:mesh_purple, enable_sdf_rect:10, enable_src_color_in_main:true, });
      // Widget_gfx_ready_enable({mesh:mesh_purple, enable_sdf_rect:10, });
      mesh_purple.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      // mesh_purple.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      mesh_purple.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
      mesh_purple.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
      mesh_purple.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      mesh_purple.Render();
      Root_group_activate_all_vbs_in_renderqueue(mesh_purple.root_bufferidx);
      mesh_purple.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh_purple.gfx.vb.groupidx);
      // mesh_purple.GfxUniformSetAndUpdate('u_generic_controls', control_values); // Sdf-InnerShadow-Glow
      mesh_purple.GfxUniformsSetClbk('u_generic_controls', ()=>{ return control_values; }, mesh_purple.gfx.vb.groupidx);
      // mesh_purple.GfxUniformSetAndUpdate('u_scale2', [1, 1]);
      Construct_listen_events_from_mesh_tree(mesh_purple);
      Construct_listen_events_relations_from_mesh_tree(mesh_purple);
   }
   
   posy+=brick_dim_y*2+20;
   const mesh_blue = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[posx, posy, 1], dim:[brick_dim_x, brick_dim_y], col:blue, name:'brick blue',}));
   {
      Widget_gfx_ready_enable({mesh:mesh_blue, enable_sdf_rect:10, enable_src_color_in_main:true, });
      // Widget_gfx_ready_enable({mesh:mesh_blue, enable_sdf_rect:10, });
      // Widget_gfx_ready_enable({mesh:mesh_blue, enable_sdf_rect:10, });
      mesh_blue.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      // mesh_blue.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      mesh_blue.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      mesh_blue.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
      mesh_blue.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      mesh_blue.Render();
      Root_group_activate_all_vbs_in_renderqueue(mesh_blue.root_bufferidx);
      mesh_blue.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh_blue.gfx.vb.groupidx);
      // mesh_blue.GfxUniformSetAndUpdate('u_generic_controls', control_values); // Sdf-InnerShadow-Glow
      // Set uniform to update values each frame from Draw() function in order to avoid same program dif vb with different uniforms passed to the shaders
      mesh_blue.GfxUniformsSetClbk('u_generic_controls', ()=>{ return control_values; }, mesh_blue.gfx.vb.groupidx);
      // mesh_blue.GfxUniformSetAndUpdate('u_scale2', [1, 1]);
      Construct_listen_events_from_mesh_tree(mesh_blue);
      Construct_listen_events_relations_from_mesh_tree(mesh_blue);
   }
   
   posy+=brick_dim_y*2+20;
   const mesh_green = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[posx, posy, 1], dim:[brick_dim_x, brick_dim_y], col:green, name:'brick green',}));
   {
      Widget_gfx_ready_enable({mesh:mesh_green, enable_sdf_rect:10, enable_src_color_in_main:true, });
      // Widget_gfx_ready_enable({mesh:mesh_green, enable_sdf_rect:10, });
      mesh_green.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
      // mesh_green.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      mesh_green.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
      mesh_green.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
      mesh_green.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      mesh_green.Render();
      Root_group_activate_all_vbs_in_renderqueue(mesh_green.root_bufferidx);
      mesh_green.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh_green.gfx.vb.groupidx);
      // mesh_green.GfxUniformSetAndUpdate('u_generic_controls', control_values); // Sdf-InnerShadow-Glow
      mesh_green.GfxUniformsSetClbk('u_generic_controls', ()=>{ return control_values; }, mesh_green.gfx.vb.groupidx);
      // mesh_green.GfxUniformSetAndUpdate('u_scale2', [1, 1]);
      Construct_listen_events_from_mesh_tree(mesh_green);
      Construct_listen_events_relations_from_mesh_tree(mesh_green);
   }
   

   /**************************************************************************************************************************************/
   // Controls

   const controls_panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10,10], pos:[0, 0, 1], col:GREY[6], name:'panel', layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF,}));
   // Widget_gfx_ready_enable({mesh_yellow:controls_panel, enable_sdf_rect:10, enable_src_color_in_main:false, });
   Widget_gfx_ready_enable({mesh:controls_panel, enable_sdf_rect:10, });
   controls_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   // controls_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
   const slider_dim=[120, 20], color=GREY[4], rcorners=10, font=TEXTURES.MTSDF_CONSOLAS_1024;

   {
      {
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:yellow, name:'Scale', layout:LAYOUT.VERTICAL, texture_id:font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         slider.SetInitialValue(slider_ctrl_init_val.yellow);
         controls_panel.AddItem(slider)
   
         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            const color = [
               target_mesh.mat.col[0]*slider_val,  
               target_mesh.mat.col[1]*slider_val,  
               target_mesh.mat.col[2]*slider_val,  
               // target_mesh.mat.col[3]*slider_val,  
            ];
            if(target_mesh.gfx) Gl_set_rgb(target_mesh.gfx, color)
            if(slider.gfx) Gl_set_rgb(slider.gfx, color)
            }, { target_mesh:mesh_yellow },
         );
      }
      {
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:purple, name:'Scale', layout:LAYOUT.VERTICAL, texture_id:font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         slider.SetInitialValue(slider_ctrl_init_val.purple);
         controls_panel.AddItem(slider)
   
         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            const color = [
               target_mesh.mat.col[0]*slider_val,  
               target_mesh.mat.col[1]*slider_val,  
               target_mesh.mat.col[2]*slider_val,  
               target_mesh.mat.col[3],  
            ];
            
            if(target_mesh.gfx) Gl_set_rgb(target_mesh.gfx, color);
            if(slider.gfx) Gl_set_rgb(slider.gfx, color);

            }, { target_mesh:mesh_purple, prev_col: mesh_purple.mat.col},
         );
      }
      {
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:blue, name:'Scale', layout:LAYOUT.VERTICAL, texture_id:font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         slider.SetInitialValue(slider_ctrl_init_val.blue);
         controls_panel.AddItem(slider)
   
         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            const color = [
               target_mesh.mat.col[0]*slider_val,  
               target_mesh.mat.col[1]*slider_val,  
               target_mesh.mat.col[2]*slider_val,  
               // target_mesh.mat.col[3]*slider_val,  
            ];
            if(target_mesh.gfx) Gl_set_rgb(target_mesh.gfx, color)
            if(slider.gfx) Gl_set_rgb(slider.gfx, color)
            }, { target_mesh:mesh_blue },
         );
      }
      {
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:green, name:'Scale', layout:LAYOUT.VERTICAL, texture_id:font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         slider.SetInitialValue(slider_ctrl_init_val.green);
         controls_panel.AddItem(slider)
   
         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            const color = [
               target_mesh.mat.col[0]*slider_val,  
               target_mesh.mat.col[1]*slider_val,  
               target_mesh.mat.col[2]*slider_val,  
               // target_mesh.mat.col[3]*slider_val,  
            ];
            if(target_mesh.gfx) Gl_set_rgb(target_mesh.gfx, color)
            if(slider.gfx) Gl_set_rgb(slider.gfx, color)
            }, { target_mesh:mesh_green },
         );
      }
   }


   const panel = Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(mesh_yellow, slider_dim, control_values, 'u_generic_controls', 0x0, 0, 0); controls_panel.AddItem(panel);

   Align_pre_simple(controls_panel);
   controls_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   controls_panel.Render();
   // controls_panel.

   // Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

   controls_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_panel.gfx.vb.groupidx);
   Construct_listen_events_from_mesh_tree(controls_panel);
   Construct_listen_events_relations_from_mesh_tree(controls_panel);



   Arkanoid_test_power_up();
}

function Arkanoid_test_power_up() {

   const ctrl_val = { yellow:.75, purple:.65, blue:1., green:.5, };
   const yellow = new Float32Array([1, .65, 0, 1]); Mult_arr3_scalar(yellow, ctrl_val.yellow);
   const purple = new Float32Array([.75, 0, 1., 1]); Mult_arr3_scalar(purple, ctrl_val.purple);
   const blue = new Float32Array([0, .5, 1, 1]); Mult_arr3_scalar(blue, ctrl_val.blue);
   const green = new Float32Array([0., 1., 0., 1]); Mult_arr3_scalar(green, ctrl_val.green);

   const size = 40;
   const mesh = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[0, 0, 3], dim:[size, size], col:yellow, name:'PowupMesh', }));
   Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:10, enable_src_color_in_main:false,});


   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // this.control_values = [1, 1., 1., 1., .14, 1,];
   // const control_values = [1, 1., 1., 1., .44, 1,];
   const control_values = [.59, .78, 1., .18, .09, .36];
   mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

   mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   mesh.Render()

   mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);
   mesh.GfxUniformSetAndUpdate('u_generic_controls', control_values);




   const slider_dim=[120, 20], color=GREY[4], rcorners=10, font=TEXTURES.MTSDF_CONSOLAS_1024;
   const panel = Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(mesh, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 0, 0); 
   // panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   // panel.Render()
   // panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);

}