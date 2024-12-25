"use strict";

import { New_generic_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Core/CreateWidget.js";
import { BLUEL, WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Particle_system_create_emitter, Particles_gen_gfx_ctx, Particles_get_particle_system } from "../../../../Engine/ParticlesSystem/ParticlesSystem.js";
import { Renderqueue_set_priority_by_vb } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { GetSign } from "../../../../Helpers/Helpers.js";
import { Abs, Min } from "../../../../Helpers/Math/MathOperations.js";
import { ARK_STATE, ARK_STATE_IN_GAME } from "./ArkanoisConstants.js";
import { Bricks_check_collision } from "./Bricks.js";
import { Physics } from "./HelperClasses.js";
import { Player_get_dimy, Player_get_pad } from "./Player.js";








const BALL_DIM_X = 10; 
const BALL_DIM_Y = BALL_DIM_X;
const BALL_SPEED = 4;


const ACCEL_FROM_BOUNDS = 1;
const ACCEL_FROM_PLAYER = 3;

const _balls_buffer = New_generic_buffer(_, 'Arkanoid-BallsBuffer');

/**Get the main ball */
export function Ball_get() { return _balls_buffer.buffer[0]; }
/**Get any ball by index */
export function Ball_get_byidx(idx=0) { return _balls_buffer.buffer[idx]; }



export class Ball {

   constructor(x, y) {

      const posx = x-BALL_DIM_X;
      const posy = y-(BALL_DIM_Y*2 + Player_get_dimy()*2 + Player_get_pad());

      const mesh = Create_rect_mesh(_, [posx, posy, 1], [BALL_DIM_X, BALL_DIM_Y], WHITE, 'Ball', );
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, BALL_DIM_X);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9]));


      this.mesh = mesh;


      this.physics = new Physics(_, _, _,_, BALL_SPEED);

      this.scale_down = 1;
      this.in_move = false;
      // this.accelx_default = 3;
      // this.accely_default = 3;

      const scale = 2.;
      const particles_size = BALL_DIM_X * scale;
      // const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles`, GREY[3], [0, 0, 1], [particles_size, particles_size], 0.015, 1, 0, _, _, 4, _, 1);
      const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles`, BLUEL[9], [0, 0, 1], [particles_size, particles_size], 0.015, 1, 0, _, _, 4, _, 1);
      const tail_emitter = Particles_get_particle_system(tail_emitter_idx);
      // tail_emitter.EnableProperties(PARTICLES.HAS_RANDOM_POLAR_COORD);
      // tail_emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
      // tail_emitter.EnableProperties(PARTICLES.HAS_JIGGLE, {jigglex:10, jiggley:10});
      
      
      
      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE); // TODO: Does nothing, there is no enable for '.FX_NOISE'
      
      
      tail_emitter.EnableGfxUniforms({ fx: SID.FX.FS_NOISE, }, 'u_noise_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

      tail_emitter.SetDir(1, 1);

      this.tail_emitter_idx = tail_emitter_idx;

   }

   TempMakeUpdatesAfterGfxGen(particles_panel){

      // Render Ball tail particles on top of the glow particles
      const tail_emitter = Particles_get_particle_system(this.tail_emitter_idx);
      Particles_gen_gfx_ctx(tail_emitter, particles_panel);
      // Particles_gen_gfx_ctx(tail_emitter, this.mesh);
      // Initialize values to uniforms
      // tail_emitter.GfxUniformSetAndUpdate('u_noise_params', [.2, 0.4, .12]);
      tail_emitter.GfxUniformSetAndUpdate('u_noise_params', [.0, 0.9, .12]);
   
   }

   GetDir() {
      return this.physics.GetVelocityXY();
   }

}



export function Ball_create(x, y) {

   const idx = _balls_buffer.Add(new Ball(x, y));
   return _balls_buffer.buffer[idx];
}


export function Ball_release(params) {
   console.log('CLICK!')

   
   const ball = _balls_buffer.buffer[0];
   if(ball.in_move) return;

   ball.in_move = true;
   

   // Find the point of contact to calculate the balls direction
   const player = params.evt_params.player;
   const dif = (ball.mesh.geom.pos[0]) - (player.mesh.geom.pos[0]+player.mesh.geom.dim[0]);

   // Normalize dif to -1,0,1
   const dif_norm = dif / (player.mesh.geom.dim[0]*2);

   // const interpolated_dif = Linear_interpolation(-1, 1, dif);
   // const dirx = interpolated_dif
   const dirx = dif_norm*2.;
   const diry = 2. - Abs(dif_norm)*2.;

   
   ball.physics.SetVelocityXY(dirx, -diry);

   ARK_STATE.SET(ARK_STATE_IN_GAME);
}


export function Ball_update(bound_left, bound_right, bound_top, bound_bottom, player_pos, player_dim) {

   // Check Boundary Collisions
   for (let i = 0; i <= _balls_buffer.boundary; i++) {


      const ball = _balls_buffer.buffer[i];
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

      const ball_top    = ball_pos[1];
      const ball_bot    = ball_pos[1] + ball_size*2;
      const ball_left   = ball_pos[0];
      const ball_right  = ball_pos[0] + ball_size*2;
      
      // Check boundaries collision
      {
         if (ball_bot > bound_bottom) {
            ph.vely *= -1; 
            ball_pos[1] = bound_bottom - (ball_size * 2) - 3; // Put back inside the panel area
            // ph.accely += ACCEL_FROM_BOUNDS;
         }
         else if (ball_top < bound_top) {
            ph.vely *= -1;
            ball_pos[1] = ball_size;
            // ph.accely += ACCEL_FROM_BOUNDS;
         }
         if (ball_right > bound_right) {
            ph.velx *= -1;
            ball_pos[0] = bound_right - (ball_size * 2) - 3;
            // ph.accely += ACCEL_FROM_BOUNDS;
         }
         else if (ball_left < bound_left) {
            ph.velx *= -1;
            ball_pos[0] = ball_size;
            // ph.accely += ACCEL_FROM_BOUNDS;
         }
      }



      // Check Player collision
      {
         const plw = player_dim[0]*2;
         if (ball_bot > player_pos[1] && ball_left < player_pos[0] + plw && ball_right > player_pos[0]) {
            

            // Guarantee only one ball-player hit, between frames
            ball_pos[1] = player_pos[1] - ball_size -3;
            

            const hit_dif = ((ball_pos[0]+ball_size) - (player_pos[0]+player_dim[0])) *2;
            
            
            let amt = Abs(Min(hit_dif / plw, 1.0));
            if(amt>1) amt = 1;
            const ball_dir = GetSign(hit_dif); // If the ball hit the left part of player
            
            let xamt = amt; // Let x amt be lower
            let yamt = (1-amt) + 0.2;
            

            ph.velx = xamt*ball_dir;
            ph.vely = -yamt;

            ph.accely += ACCEL_FROM_PLAYER*(1+xamt);
            ph.accelx += ACCEL_FROM_PLAYER*(1+yamt);

         }
      }

      // Check Bricks collision
      {
         const ball_dir = ball.GetDir();
         const point_of_contact = Bricks_check_collision(ball_pos[0], ball_pos[1], ball_size, ball_size, x, y, ball_dir.x, ball_dir.y);

         ph.velx *= point_of_contact[0];
         ph.vely *= point_of_contact[1];
      }

      
      ball.mesh.geom.pos[0] += ph.velx * (ph.speed + ph.accelx);
      ball.mesh.geom.pos[1] += ph.vely * (ph.speed + ph.accely);
      ball.mesh.geom.SetWposXY(ball.mesh.gfx, ball.mesh.geom.pos[0]+ball_size, ball.mesh.geom.pos[1]+ball_size);
      // ball.mesh.geom.SetWposXY(ball.mesh.gfx, ball.mesh.geom.pos[0], ball.mesh.geom.pos[1]);
      
      {
         // const angle = Math.atan2(ph.velx, ph.vely);
         // const normalizedAngle = angle >= 0 ? angle : (2 * Math.PI + angle); // Normalize from -π,π to 0,π
         // console.log('θ=', angle/Math.PI)
      }

      if (ph.accelx > 0) ph.accelx *= .99; //else console.log('Accel x is diminished')
      if (ph.accely > 0) ph.accely *= .99; //else console.log('Accel y is diminished')
   }


}

