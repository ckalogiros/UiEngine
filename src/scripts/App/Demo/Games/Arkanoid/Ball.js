"use strict";

import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Free_generic_buffer, Free_int8_buffer, New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_add_to_group } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { BLUEL, PURPLEB, WHITE, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_get_uniform_ubidx_from_name } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Style_rect_default_properties } from "../../../../Engine/Drawables/Widgets/WidgetReadyStyles.js";
import { Particle_system_create_emitter, Particle_system_emitt, Particle_system_emitter_enable_intermidiate_emission, Particle_system_emitter_get_position_xy, Particle_system_emitter_get_size, Particle_system_emitter_set_position_xy, Particle_system_emitter_set_prev_position_xy, Particle_system_emitter_set_size, Particles_gen_gfx_ctx, Particles_get_particle_system } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Gl_set_alpha, Gl_set_attr_round_corners, Gl_set_dim_xy, Gl_set_wpos_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetSign } from "../../../../Helpers/Helpers.js";
import { Function_Slope, Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Abs, Min } from "../../../../Helpers/Math/MathOperations.js";
import { Widget_gfx_ready_enable } from "../../../Widgets/WidgetGfxReady.js";
import { Arkanoid_combo_counter_reset, Arkanoid_get_main_panel_padx, Arkanoid_get_main_panel_pady } from "./Arkanoid.js";
import { ARK_STATE } from "./ArkanoisConstants.js";
import { Bricks_check_collision } from "./Bricks.js";
import { Physics } from "./HelperClasses.js";
import { Player_get } from "./Player.js";








export const BALL_SIZE = 12;
const BALL_DIM_X = BALL_SIZE;
const BALL_DIM_Y = BALL_SIZE;
const BALL_SPEED = 4;
const MAX_BALLS_COUNT = 3;


const ACCEL_FROM_BOUNDS = 1;
const ACCEL_FROM_PLAYER = 2;


const BALL_COLORS = [BLUEL[9], YELLOWR[9], PURPLEB[9]];



const _balls_buffer = New_generic_buffer(_, '_balls_buffer');
const _free_balls_buffer_idxs = New_int8_buffer(_, '_free_balls_buffer_idxs');
let balls_vb_groupidx = INT_NULL;

const _main_panel_pad = { x: 0, y: 0 };

let main_ball = null; // this is to store the main ball
/** */
export function Ball_get_main_ball() { return main_ball; }
/** */
export function Ball_get_byidx(idx = 0) { return _balls_buffer.buffer[idx]; }
/** */
export function Ball_get_pos_xy(idx) { return _balls_buffer.buffer[idx].mesh.geom.pos; }
/** */
export function Ball_get_dim_xy(idx) { return _balls_buffer.buffer[idx].mesh.geom.dim; }
/** */
export function Arkanoid_balls_reset() {

   _balls_buffer.ResetFull();
   _free_balls_buffer_idxs.Reset();
   balls_vb_groupidx = INT_NULL;
   main_ball = null;
   _main_panel_pad.x = 0;
   _main_panel_pad.y = 0;
}
/** */
export function Arkanoid_balls_destroy() {

   Free_generic_buffer(_balls_buffer);
   Free_int8_buffer(_free_balls_buffer_idxs);
}
/** */
export class Ball {

   constructor(x, y, color = WHITE, vb_groupidx = INT_NULL) {

      const posx = x;
      const posy = y;

      const mesh = Create_rect_mesh(Style_rect_default_properties({pos:[posx, posy, 1], dim:[BALL_DIM_X, BALL_DIM_Y], col:color, name:'Ball',}));
      Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:BALL_DIM_X, });

      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE, vb_groupidx);

      mesh.Render();
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);

      this.mesh = mesh;

      this.physics = new Physics(0, 0, _, _, BALL_SPEED);

      this.scale_down = 1;
      this.in_move = false;
      this.in_scale_animation = false;
      this.lock_squash_anim = false;
      this.in_squash_anim = false;


      this.is_active = false;

      this.idx = _balls_buffer.Add(this);


      // Tail Particles Emitter
      {
         const scale = 2.;
         const particles_size = BALL_DIM_X * scale;
         const mod = BALL_SPEED * .002; // Avoid very long tails with increased speed// HACK: configure the ball tail according to ball speed(Thats if the particles system has the creation of intermidiate particles creation enabled)
         const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles`, color, [0, 0, 1], [particles_size, particles_size], 0.015 + mod, 1, 0, _, _, 4, _, 1);
         const tail_emitter = Particles_get_particle_system(tail_emitter_idx);
         Widget_gfx_ready_enable({mesh:tail_emitter, enable_src_color_in_main:false, }); // Just to enable u_wposxy and u_blend_mode

         tail_emitter.EnableProperties(PARTICLES.HAS_FADE);
         tail_emitter.GfxEnableFn(SID.SHAD.FN_NOISE, {time:0});
         tail_emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

         // // tail_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
         // // tail_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
         // // tail_emitter.EnableGfx(SID.SHAD.FN_NOISE); // TODO: Does nothing, there is no enable for '.FN_NOISE'
         // tail_emitter.GfxEnableFn(SID.SHAD.FN_NOISE, {time:0}); // TODO: Does nothing, there is no enable for '.FN_NOISE'


         // // tail_emitter.EnableGfxUniforms({ fx: SID.SHAD.FN_NOISE, }, 'u_noise_params', UNIF_TYPE.FVEC4, UNIFORM.IN_FS);
         // tail_emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS, }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 4);

         tail_emitter.SetDir(1, 1);

         // Render 
         Particles_gen_gfx_ctx(tail_emitter, this.mesh);
         // Initialize values to uniforms
         // tail_emitter.GfxUniformSetAndUpdate('u_noise_params', [.2, 0.4, .12, 0]);
         tail_emitter.GfxUniformSetAndUpdate('u_generic_controls', [.2, 0.4, .12, 0]);


         Particle_system_emitter_set_position_xy(tail_emitter_idx, this.mesh.geom.pos[0], this.mesh.geom.pos[1]);
         Particle_system_emitter_set_prev_position_xy(tail_emitter_idx);
         Particle_system_emitter_enable_intermidiate_emission(tail_emitter_idx);


         this.tail_emitter_idx = tail_emitter_idx;
      }

   }

   GetDir() {
      return this.physics.GetVelocityXY();
   }

   Reset() {

      this.in_move = false;
      this.in_scale_animation = false;
      this.lock_squash_anim = false;
      this.in_squash_anim = false;
      this.is_active = false;

      this.physics.Reset(_, _, _, _, BALL_SPEED);
   }

}
/** */
export function Ball_init_buffer(x, y, group_idx, parent_root_posidx = INT_NULL, parent_mesh_bufferidx) {

   let idx = 0;
   const ball = new Ball(x, y, BALL_COLORS[idx]);
   let vb_groupidx = ball.mesh.gfx.vb.groupidx;

   // Implement to draw wpos from a root uniform wpos
   if (parent_root_posidx !== INT_NULL) Mesh_unif_hack_parent_root_wpos(ball.mesh.root_posidx, parent_root_posidx, parent_mesh_bufferidx);

   Ball_remove_mesh_byidx(ball.idx);
   idx++;

   for (let i = 1; i < MAX_BALLS_COUNT; i++) {

      idx = idx >= BALL_COLORS.length ? 0 : idx;
      const color = BALL_COLORS[idx];
      const ball = new Ball(x, y, color, vb_groupidx);
      View_add_to_group(ball.mesh, group_idx); // Add to View Group
      Ball_remove_mesh_byidx(ball.idx);

      idx++;
   }

   _main_panel_pad.x = Arkanoid_get_main_panel_padx();
   _main_panel_pad.y = Arkanoid_get_main_panel_pady();

   return _balls_buffer;
}
/** Removes the effect mesh from the storage buffer and from rendering, but mesh still remains in the application */
export function Ball_remove_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _balls_buffer.buffer[idx] === undefined) alert('0101010101 Wrong index for _balls_buffer')

   const mesh = _balls_buffer.buffer[idx].mesh;
   if (mesh.gfx !== null)
      Gl_set_alpha(mesh.gfx, 0);
   else mesh.mat.col[3] = 0;

   _balls_buffer.buffer[idx].Reset();
   _free_balls_buffer_idxs.Add(idx);
// 
   // Ball_print_loop();

}
/** */
export function Ball_reset(x, y, color = WHITE) {

   for (let i = 0; i <= _balls_buffer.boundary; i++) {

      const ball = _balls_buffer.buffer[i];
      if (ball !== null && ball.is_active) {

         Ball_remove_mesh_byidx(ball.idx);
      }
   }

   const ball = Ball_create(x, y, color);
   main_ball = ball;
}
/** */
export function Ball_create(x, y, color = WHITE) {

   let idx = INT_NULL;

   const freeidx = _free_balls_buffer_idxs.boundary;


   if (freeidx >= 0) {

      idx = _free_balls_buffer_idxs.buffer[freeidx];
      const ball = _balls_buffer.buffer[idx];

      ball.is_active = true;

      ball.mesh.geom.pos[0] = x;
      ball.mesh.geom.pos[1] = y;
      Gl_set_wpos_xy(ball.mesh.gfx, ball.mesh.geom.pos[0] + BALL_DIM_X, ball.mesh.geom.pos[1] + BALL_DIM_X);

      ball.mesh.SetColorRGBA(color);

      // Calculate ball velocity vector according to player's position
      const player = Player_get();
      const dif = (ball.mesh.geom.pos[0]) - (player.mesh.geom.pos[0] + player.mesh.geom.dim[0]);
      const dif_norm = dif / (player.mesh.geom.dim[0] * 2);
      const dirx = dif_norm * 2.;
      const diry = 2. - Abs(dif_norm) * 2.;
      ball.physics.SetVelocityXY(dirx, -diry);

      const tail_emitter_idx = ball.tail_emitter_idx;
      const emitter_pos = Particle_system_emitter_get_position_xy(tail_emitter_idx);
      const xx = emitter_pos[0] = ball.mesh.geom.pos[0] + ball.mesh.geom.dim[0];
      const yy = ball.mesh.geom.pos[1] + ball.mesh.geom.dim[1];
      Particle_system_emitter_set_position_xy(tail_emitter_idx, xx, yy);
      Particle_system_emitter_set_prev_position_xy(tail_emitter_idx)

      // Set main ball if this ball is the only one active
      if (_free_balls_buffer_idxs.active_count === _balls_buffer.active_count) {
         main_ball = ball;
      }

      // Remove from the free idxs buffer
      _free_balls_buffer_idxs.RemoveByIdx(freeidx);


      return ball;
   }


}
/** */
export function Ball_release(player) {


   const ball = main_ball;
   if (ball.in_move || !ball.is_active) return;

   ball.in_move = true;


   // Find the point of contact to calculate the balls direction
   const dif = (ball.mesh.geom.pos[0]) - (player.mesh.geom.pos[0] + player.mesh.geom.dim[0]);

   // Normalize dif to -1,0,1
   const dif_norm = dif / (player.mesh.geom.dim[0] * 2);
   const dirx = dif_norm * 2.;
   const diry = 2. - Abs(dif_norm) * 2.;


   ball.physics.SetVelocityXY(dirx, -diry);

}
/** */
export function Ball_update(bound_left, bound_right, bound_top, bound_bottom, player_pos, player_dim) {

   // Check Boundary Collisions
   for (let i = 0; i <= _balls_buffer.boundary; i++) {

      const ball = _balls_buffer.buffer[i];

      if (!ball.is_active) continue;

      const ph = ball.physics;

      // Move the ball
      const x = ph.velx * (ph.speed + ph.accelx);
      const y = ph.vely * (ph.speed + ph.accely);
      const ball_pos = [
         ball.mesh.geom.pos[0] + x,
         ball.mesh.geom.pos[1] + y
      ];

      // Calculate the scaled ball size
      const ball_size = ball.mesh.geom.dim[0] * ball.scale_down;

      const ball_top = ball_pos[1];
      const ball_bot = ball_pos[1] + ball_size * 2;
      const ball_left = ball_pos[0];
      const ball_right = ball_pos[0] + ball_size * 2;

      let hit = false;
      // Check boundaries collision
      {
         if (ball_bot > bound_bottom) {

            Ball_remove_mesh_byidx(ball.idx);
            if (_free_balls_buffer_idxs.active_count === _balls_buffer.active_count) {

               main_ball = null;
               ARK_STATE.ADD(ARK_STATE.LAST_BALL_LOST);
            }
         }
         else if (ball_top < bound_top) {
            ph.vely *= -1;
            ball_pos[1] = ball_size;
            // ph.accely += ACCEL_FROM_BOUNDS;
            hit = true;
         }
         if (ball_right > bound_right) {
            ph.velx *= -1;
            ball_pos[0] = bound_right - (ball_size * 2) - 3;
            // ph.accely += ACCEL_FROM_BOUNDS;
            hit = true;
         }
         else if (ball_left < bound_left) {
            ph.velx *= -1;
            ball_pos[0] = ball_size;
            // ph.accely += ACCEL_FROM_BOUNDS;
            hit = true;
         }
      }

      /** Squash animation */
      {
         // if(hit && !ball.in_squash_anim) {
         // if(hit ) {

         //    ball.in_squash_anim = true;

         //    const time_step = 0.02, slope_const = .2, scale = .5;
         //    const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

         //    const params = {
         //       ball: ball,
         //       direction: { x: GetSign(ph.velx), y: -GetSign(ph.vely) },
         //       // direction: { x: (ph.velx), y: -(ph.vely) },
         //       target_dist: 30, // in pixels
         //       move_dist: 2.5, // in pixels
         //       ball_squash_lim: ball.mesh.geom.dim[0]*.34,
         //       ball_initial_size: ball.mesh.geom.dim[0],

         //       function_slope:slope_params_pointer,
         //    };

         //    Callback_animations_create(Ball_animation_squash_run, Ball_animation_squash_stop, params,);
         //    return;
         // }
      }

      // Check Player collision
      {
         const plw = player_dim[0] * 2;
         if (ball_bot > player_pos[1]) {

            if (ball_left < player_pos[0] + plw && ball_right > player_pos[0]) {

               // Guarantee only one ball-player hit, between frames
               ball_pos[1] = player_pos[1] - ball_size - 3;


               const hit_dif = ((ball_pos[0] + ball_size) - (player_pos[0] + player_dim[0])) * 2;


               let amt = Abs(Min(hit_dif / plw, 1.0));
               if (amt > 1) amt = 1;
               const ball_dir = GetSign(hit_dif); // If the ball hit the left part of player

               let xamt = amt; // Let x amt be lower
               let yamt = (1 - amt) + 0.2;


               ph.velx = xamt * ball_dir;
               ph.vely = -yamt;

               ph.accely += ACCEL_FROM_PLAYER * (1 + xamt);
               ph.accelx += ACCEL_FROM_PLAYER * (1 + yamt);

               Arkanoid_combo_counter_reset();

            }
         }
      }

      // Check Bricks collision
      {
         const ball_dir = ball.GetDir();
         const point_of_contact = Bricks_check_collision(ball_pos[0], ball_pos[1], ball_size, ball_size, x, y, ball_dir.x, ball_dir.y, ball.idx);

         ph.velx *= point_of_contact[0];
         ph.vely *= point_of_contact[1];
      }


      ball.mesh.geom.pos[0] += ph.velx * (ph.speed + ph.accelx);
      ball.mesh.geom.pos[1] += ph.vely * (ph.speed + ph.accely);
      ball.mesh.geom.SetWposXY(ball.mesh.gfx, ball.mesh.geom.pos[0] + ball_size, ball.mesh.geom.pos[1] + ball_size);

      if (ph.accelx < .1) ph.accelx = 0; // Avoid accel from reaching very small floating point values
      else if (ph.accelx > 0) ph.accelx *= .99; //else console.log('Accel x is diminished')
      if (ph.accely < .1) ph.accely = 0; // Avoid accel from reaching very small floating point values
      else if (ph.accely > 0) ph.accely *= .99; //else console.log('Accel y is diminished')




      /*********************************************************************************************************/
      // Update Particles

      const tail_emitter_idx = ball.tail_emitter_idx;
      const emitter_pos = Particle_system_emitter_get_position_xy(tail_emitter_idx);
      const xx = emitter_pos[0] = ball.mesh.geom.pos[0] + ball.mesh.geom.dim[0];
      const yy = ball.mesh.geom.pos[1] + ball.mesh.geom.dim[1];
      Particle_system_emitter_set_position_xy(tail_emitter_idx, xx, yy);
      Particle_system_emitt({ params: { target_params: [tail_emitter_idx], } });
   }


}







/************************************************************************************************************************************************/
// Power up animations

/** */
export function Ball_animation_scale() {

   const ball = main_ball;

   if (ball.in_scale_animation) return;

   ball.in_scale_animation = true;

   // const time_step = 0.01, slope_const = 0.2, scale = .5;
   const time_step = 0.005, slope_const = 1., scale = .5;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   const emitter_size = Particle_system_emitter_get_size(ball.tail_emitter_idx);
   const emitter = Particles_get_particle_system(ball.tail_emitter_idx);

   const params = {
      ball: ball,
      emitter: {
         size: emitter_size,
         current_size: emitter_size,
         vb_groupidx: emitter.gfx.vb.groupidx,
         // ubidx: Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params'),
         ubidx: Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls'),
         shader_uniform_index: 2,
      },
      function_slope: slope_params_pointer,
      ball_initial_dimx: ball.mesh.geom.dim[0],
      ball_current_dimx: ball.mesh.geom.dim[0],
      scale_up: 3,
   };

   Callback_animations_create(Ball_animation_scale_up_run, Ball_animation_scale_up_stop, params,);

}
/** */
function Ball_animation_scale_up_run(params) {

   const ball = params.ball.mesh;
   const ball_initial_dimx = params.ball_initial_dimx;
   const ball_current_dimx = params.ball_current_dimx;

   const timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();


   const slope = Logarithmic_interpolation(timer, slope_constant);
   const scale_factor = slope * scale;


   // Update ball x dir scale
   const ball_size = ball_current_dimx + (ball_initial_dimx * scale_factor * params.scale_up);
   ball.geom.dim[0] = ball_size;
   ball.geom.dim[1] = ball_size;

   ball.geom.SetDimXY(ball.gfx, ball_size, ball_size);
   Gl_set_dim_xy(ball.gfx, ball_size, ball_size);
   Gl_set_attr_round_corners(ball.gfx, ball.geom.dim[0]);

   // Update ball tail particle emitter
   const emitter_size = params.emitter.current_size + (params.emitter.size * scale_factor * params.scale_up); // Calculate the scaled size from the original size
   Particle_system_emitter_set_size(params.ball.tail_emitter_idx, emitter_size); // Scale up emitter and its particles
   // const noise_reduction = (1-scale_factor)*0.1 + .03;
   // Vertex_buffer_set_and_update_uniform(params.emitter.vb_groupidx, params.emitter.ubidx, noise_reduction, params.emitter.shader_uniform_index); // Scale down the precedural noise 

   if (slope > 1) return false;

   return true;
}
/** */
function Ball_animation_scale_up_stop(params) {

   params.function_slope.SetTimer(0);

   // Set the scale down as the inverse of scale up
   const scale = params.function_slope.GetAmmount();
   params.function_slope.SetAmmount(-scale);

   // Store current ball dimention
   params.ball_current_dimx = params.ball.mesh.geom.dim[0];
   params.emitter.current_size = Particle_system_emitter_get_size(params.ball.tail_emitter_idx);

   // Set the scale down animation
   Callback_animations_create(Ball_animation_scale_down_run, Ball_animation_scale_down_stop, params,);

   return false;
}
/** */
function Ball_animation_scale_down_run(params) {

   const ball = params.ball.mesh;
   const ball_initial_dimx = params.ball_initial_dimx;
   const ball_current_dimx = params.ball_current_dimx;

   const timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const scale_factor = slope * scale;

   // Update ball x dir scale
   const ball_size = ball_current_dimx + (ball_initial_dimx * scale_factor * params.scale_up);
   ball.geom.dim[0] = ball_size;
   ball.geom.dim[1] = ball_size;

   ball.geom.SetDimXY(ball.gfx, ball_size, ball_size);
   Gl_set_dim_xy(ball.gfx, ball_size, ball_size);
   Gl_set_attr_round_corners(ball.gfx, ball.geom.dim[0]);

   // Update ball tail particle emitter
   const emitter_size = params.emitter.current_size + (params.emitter.size * scale_factor * params.scale_up); // Calculate the scaled size from the original size
   Particle_system_emitter_set_size(params.ball.tail_emitter_idx, emitter_size);
   // const noise_reduction = (slope)*0.27 + .03;
   // Vertex_buffer_set_and_update_uniform(params.emitter.vb_groupidx, params.emitter.ubidx, noise_reduction, params.emitter.shader_uniform_index);

   if (slope > 1) return false;


   return true;
}
/** */
function Ball_animation_scale_down_stop(params) {

   const ball_initial_dimx = params.ball_initial_dimx;
   params.ball.mesh.geom.dim[0] = ball_initial_dimx;
   params.ball.mesh.geom.dim[1] = ball_initial_dimx;

   params.ball.mesh.geom.SetDimXY(params.ball.mesh.gfx, ball_initial_dimx, ball_initial_dimx);
   Gl_set_dim_xy(params.ball.mesh.gfx, ball_initial_dimx, ball_initial_dimx);
   Gl_set_attr_round_corners(params.ball.mesh.gfx, ball_initial_dimx);

   Particle_system_emitter_set_size(params.ball.tail_emitter_idx, params.emitter.size); // Scale up emitter and its particles

   params.ball.in_scale_animation = false;

   return false;
}




/** */
function Ball_animation_squash_run(params) {

   const ball = params.ball.mesh;


   const timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   params.function_slope.IncrementTimer();


   // const slope = Logarithmic_interpolation(timer, slope_constant);

   // Create ball squash
   const lim = params.ball_squash_lim;
   // const size = 2*(slope*.3+.3);;
   // const size = slope;
   // const size = timer*2;
   const size = 4;

   if (!params.ball.lock_squash_anim && ball.geom.dim[1] > params.ball_initial_size - lim) {

      // const slope = Logarithmic_interpolation(timer, slope_constant);
      // const size = slope*2;


      ball.geom.dim[1] -= size;
      ball.geom.dim[0] += size;

      // Mesh_add_wpos_xy(ball, -size);
      // Mesh_add_wpos_xy(ball, size*params.direction.y);
      // Mesh_add_wpos_xy(ball, -size*params.direction.x, size*params.direction.y);
      // Mesh_add_wpos_xy(ball, 0, size*params.direction.y);
      if (ball.geom.dim[1] <= params.ball_initial_size - lim) {
         params.ball.lock_squash_anim = true;
         // params.function_slope.SetTimer(0);
      }

      // Update ball tail particle emitter
      Particle_system_emitter_set_size(params.ball.tail_emitter_idx, -size, size); // Scale up emitter and its particles
      // Particle_system_emitter_add_size_xy(params.ball.tail_emitter_idx, -size, size); // Scale up emitter and its particles

   }

   // else if(params.ball.lock_squash_anim && ball.geom.dim[1] < params.ball_initial_size + lim) {

   //    const slope = Logarithmic_interpolation(timer, slope_constant);
   //    const size = slope*2;

   //    ball.geom.dim[1] += size;
   //    ball.geom.dim[0] -= size;
   //    // ball.geom.AddWposY(ball.gfx, size);
   //    // ball.geom.AddWposY(ball.gfx, size*-params.direction.y);
   //    // ball.geom.AddWposXY(ball.gfx, -size*params.direction.x, -size*params.direction.y);
   //    // if(ball.geom.dim[1] >= params.ball_initial_size + lim) params.ball.lock_squash_anim = false;

   //    // Update ball tail particle emitter
   //    // Particle_system_emitter_add_size_xy(params.ball.tail_emitter_idx, size, -size); // Scale up emitter and its particles
   // }
   else {
      ball.geom.dim[1] = params.ball_initial_size;
      ball.geom.dim[0] = params.ball_initial_size;
      // ball.geom.AddWposY(ball.gfx, size);
      ball.geom.SetDimXY(ball.gfx, ball.geom.dim[0], ball.geom.dim[1]);
      Gl_set_dim_xy(ball.gfx, ball.geom.dim[0], ball.geom.dim[1]);
      Gl_set_attr_round_corners(ball.gfx, params.ball_initial_size);

      // Particle_system_emitter_set_size(params.ball.tail_emitter_idx, ball.geom.dim[0]*2, ball.geom.dim[1]*2); // Scale up emitter and its particles

      params.ball.in_squash_anim = false;
      params.ball.lock_squash_anim = false;

      return false;
   }
   ball.geom.SetDimXY(ball.gfx, ball.geom.dim[0], ball.geom.dim[1]);
   Gl_set_dim_xy(ball.gfx, ball.geom.dim[0], ball.geom.dim[1]);
   Gl_set_attr_round_corners(ball.gfx, Min(ball.geom.dim[0], ball.geom.dim[1]));

   return true;
}
/** */
function Ball_animation_squash_stop(params) {

   return false;
}






/*******************************************************************************************************/
// Debug Print
/** */
export function Ball_print() {
   console.log(
      'Balls buffer', _balls_buffer,
      'Balls free buffer', _free_balls_buffer_idxs,
   );
}
/** */
export function Ball_print_loop() {
   console.log('Balls buffer active_count', _balls_buffer.active_count);
   for (let i = 0; i <= _balls_buffer.boundary; i++) {
      console.log(i, _balls_buffer.buffer[i].idx, 'active', _balls_buffer.buffer[i].is_active);
   }
   console.log('Balls free buffer active_count', _free_balls_buffer_idxs.active_count);
   for (let i = 0; i <= _free_balls_buffer_idxs.boundary; i++) {
      console.log(i, _free_balls_buffer_idxs.buffer[i]);
   }
}