"use strict"

import { Mouse_get_pos_difx, Mouse_get_posx } from "../../../../Engine/Controls/Input/Mouse.js";
import { Create_widget_label, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Effects_init_buffer, EFFECTS_TYPES } from "../../../../Engine/Drawables/Effects/Effects.js";
import { BLUEL, CYAN, GREY, PURPLE, PURPLEB, PURPLER, TRANSPARENT, WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Particle_system_emitt, Particles_get_particle_system } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Renderqueue_set_priority_by_vb } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { ARK_STATE, ARK_STATE_IN_GAME } from "./ArkanoisConstants.js";
import { Ball_create, Ball_release, Ball_update } from "./Ball.js";
import { Bricks_create } from "./Bricks.js";
import { Coin_init_buffer } from "./Coin.js";
import { Player, Player_get_pad } from "./Player.js";
import { Score_mod_init_buffer } from "./ScoreMod.js";





const ARKANOID_SECTION_DIM_X = 250, ARKANOID_SECTION_DIM_Y = 350;
const BOUND_TOP = 0, BOUND_BOTTOM = 0, BOUND_RIGHT = ARKANOID_SECTION_DIM_X, BOUND_LEFT = 0.


let arkanoid_panel_mesh = null;


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

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [100, 100, 0], [ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y], GREY[5]);
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

   const ball = Ball_create(ARKANOID_SECTION_DIM_X, ARKANOID_SECTION_DIM_Y * 2);
   section.AddItem(ball.mesh);

   // Pre initialize buffers
   // Explosions
   const fx_vb_grouidx = Effects_init_buffer(EFFECTS_TYPES.EXPLOSION_CIRCLE, _)
   // Coin
   const coin_vb_grouidx = Coin_init_buffer(_);
   // Score modifier text
   const score_vb_grouidxs = Score_mod_init_buffer(_);


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


   const ball_release_params = { player: player };
   section.ChangeListenEvent(E.C, Ball_release, ball_release_params)

   // Set and update bricks uniforms for the INNER_SHADOW shader
   // section.GfxUniformSetAndUpdate('u_generic_vec3', [.5, .0, .0]);
   // section.GfxUniformSetAndUpdate('u_generic_vec3', [.0, 1., 1.]);
   section.GfxUniformSetAndUpdate('u_generic_vec3', [.0, .0, .0]);

   
   Renderqueue_set_priority_by_vb(LAST, bricks_buffer.buffer[0].mesh.gfx.vb.groupidx);
   Renderqueue_set_priority_by_vb(LAST, fx_vb_grouidx);
   Renderqueue_set_priority_by_vb(LAST, coin_vb_grouidx);
   Renderqueue_set_priority_by_vb(LAST, score_vb_grouidxs.label);
   Renderqueue_set_priority_by_vb(LAST, score_vb_grouidxs.text_mesh);
   ball.TempMakeUpdatesAfterGfxGen(section);
   Renderqueue_set_priority_by_vb(LAST, ball.mesh.gfx.vb.groupidx);





   // Set the Update() fuunction
   const params = {
      panel: section,
      player: player,
      ball: ball,
      tail_emitter_idx: ball.tail_emitter_idx,
   };
   Time_intervals_create(1, 'Arkanoid Update', TIME_INTERVAL_REPEAT_ALWAYS, Arkanoid_run, params,);

}




function Arkanoid_run(params) {

   const panel = params.params.panel;
   const player = params.params.player;
   let mouse_posx = Mouse_get_posx() - panel.GetPosX() - player.mesh.geom.dim[0];
   const panel_pos_local = panel.geom.pos;


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

   if (ARK_STATE.state & ARK_STATE_IN_GAME) {

      const bound_local_left = (panel_pos_local[0] + player_pad);
      const bound_local_right = (panel_pos_local[0] + panel.geom.dim[0] * 2) - player_pad;
      const bound_local_bottom = (panel_pos_local[0] + panel.geom.dim[1] * 2) - player_pad;
      const bound_local_top = panel_pos_local[1] + player_pad;
      Ball_update(bound_local_left, bound_local_right, bound_local_top, bound_local_bottom, player.mesh.geom.pos, player.mesh.geom.dim);



      /*********************************************************************************************************/
      // Update Particles

      const tail_emitter_idx = params.params.tail_emitter_idx;
      const tail_emitter = Particles_get_particle_system(tail_emitter_idx);
      tail_emitter.pos[0] = ball.mesh.geom.pos[0] + ball.mesh.geom.dim[0];
      tail_emitter.pos[1] = ball.mesh.geom.pos[1] + ball.mesh.geom.dim[1];



      Particle_system_emitt({ params: { target_params: [tail_emitter_idx], } });
   }
   else { // Case the ball is not moving AKA game in 'ARK_STATE_IN_START'
      // Ball follow player and keep the ball in players x width 

      // Make the ball not leave the players's width area
      if (ball.mesh.geom.pos[0] < pl_left ) {
         ball.mesh.geom.pos[0] = pl_left;
         ball.mesh.geom.SetWposX(ball.mesh.gfx, pl_left);
      }
      else if (ball.mesh.geom.pos[0] > pl_right) {
         ball.mesh.geom.pos[0] = pl_right;
         ball.mesh.geom.SetWposX(ball.mesh.gfx, pl_right);
      }

   }


}
