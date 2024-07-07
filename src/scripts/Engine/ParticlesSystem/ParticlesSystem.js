"use strict";

import { Vertex_buffer_add_vertices_from_reset, Vertex_buffer_set_uniform_value_callback, Vertex_buffer_state_enable } from "../../Graphics/Buffers/VertexBuffers.js";
import { Gl_particles_batch_set_col4_wpos4_pos2, Gl_particles_batch_set_col4_wpos4_pos2_style3 } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomInt, GetSign } from "../../Helpers/Helpers.js";
import { Hash, Max } from "../../Helpers/Math/MathOperations.js";
import { New_generic_buffer, New_int16_buffer } from "../Core/Buffers.js";
import { Mesh_unif_get_vb_root_wpos } from "../Core/MeshUniformsBuffer.js";
import { Str_buffer_get_by_idx, Str_buffer_mesh_names_get_by_idx, Str_buffer_mesh_names_store, Str_buffer_store } from "../Core/StringBuffer.js";
import { Gfx_generate_context_for_particle_system } from "../Interfaces/Gfx/MeshGfxContext.js";
import { Timer_get_global_timer } from "../Timers/Timers.js";




const speed = 4;
const speed_ratio = .01
const max = 100;
const interpolate = 1/max;


class Particle {

   constructor(emitter) {

      if (emitter === null || emitter === undefined) alert('Trying to create particle with NULL emitter\nParticleSystem.js')

      this.col = [0, 0, 0, 0];
      this.pos = [0, 0, 0];
      this.dim = [0, 0];


      this.is_alive = false;

      // this.t = 0;
      this.accel = emitter.accel;
      this.grav = emitter.gravity;


      // Emitter variables
      this.idx = INT_NULL; // Self index to the emitter's buffer
      this.emitter = emitter;
      
      // GFX variables
      this.start = INT_NULL; // The start index in the vertex buffer
      
      // Copy the position of the emitter
      this.time = 0;
      // this.time = Hash(Timer_get_global_timer());;
      this.random_val = Hash(Timer_get_global_timer()); // This parameter is only for the Fragment Shader 
      this.pos[0] = emitter.pos[0];
      this.pos[1] = emitter.pos[1];
      this.pos[2] = emitter.pos[2];
      this.dim[0] = emitter.dim[0];
      this.dim[1] = emitter.dim[1];
      this.dirx = (emitter.dir[0] !== 0) ? emitter.dir[0] : 1;
      this.diry = (emitter.dir[1] !== 0) ? emitter.dir[1] : 1;

      this.col[0] = emitter.col[0];
      this.col[1] = emitter.col[1];
      this.col[2] = emitter.col[2];
      this.col[3] = emitter.col[3];

      if(emitter.flags & PARTICLES.HAS_START_POS_VARIATION){

         const minx = emitter.variation_emission.xdir_neg * max
         const maxx = emitter.variation_emission.xdir_pos * max
         const dx = GetRandomInt(minx, maxx);
         this.dirx *= interpolate*dx;
         
         const miny = emitter.variation_emission.ydir_neg * max
         const maxy = emitter.variation_emission.ydir_pos * max
         const dy = GetRandomInt(miny, maxy);
         // console.log(dy, interpolate*dy)
         this.diry *= interpolate*dy;
         

      }
   }

   SetGfxStart(start) {
      this.start = start;
   }

   SetSelfIdx(idx) {
      this.idx = idx;
   }
}


class Emitter {

   constructor(name, col, pos, dim, t_step=.1, life_time, accel=1, deccel=0, gravity=0, max_speed=2) {

      this.col = new Float32Array(col); // a uniform color for the gfx
      this.pos = [pos[0], pos[1], pos[2]];
      this.dim = dim;
      this.dir = [0, 0];
      this.t_step = t_step;
      this.life_time = life_time;
      this.speed = speed;

      this.parent = null;
      
      // For smoke effect
      // this.accel = 2.;
      // this.deccel = .98;
      // this.gravity = -.1;
      this.accel = accel;
      this.max_speed = max_speed;
      this.deccel = deccel;
      this.gravity = gravity;
      
      this.sid = 0x0;
      this.sceneidx = STATE.scene.active_idx;
      this.root_posidx = INT_NULL;
      this.gfx = null;
      this.type = MESH_TYPE.PARTICLES;
      this.idx = INT_NULL;
      this.nameidx = Str_buffer_store(name);

      this.UpdateGfxBuffersFn = null; // Function pointer to update the vertex buffer of the particle system

      // Set the cone of variation vector direction. Diagonals are -.5 and +.5 
      this.variation_emission = {
         xdir_pos: 1, // Right quadrant
         xdir_neg: 0, // Left quadrant
         ydir_pos: 1, // Lower quadrant
         ydir_neg: 0, // Upper quadrant
      }

      this.particles_buffer = New_generic_buffer(_, 'Particles - particles_buffer');
      this.free_particles_idxs_buffer = New_int16_buffer(_, 'ParticlesSystem-free_particles_idxs_buffer');


      this.sid = {
         shad: SID.SHAD.INDEXED | SID.SHAD.INDEXED_PATT_DISCONTINUE_4,
         attr: SID.ATTR.COL4 | SID.ATTR.POS2 | SID.ATTR.WPOS_TIME4 | SID.ATTR.DIM2,
         unif: 0x0,
         pass: SID.PASS.COL4|SID.PASS.DIM2,
         fx: 0x0,
      };

      this.style = [0, Max(dim[0], dim[1]), 1.5]


      this.uniforms = [];
      if (APP.ENABLE_SHADER_PROJECTION_MATRIX)
         this.EnableGfxUniforms({unif:SID.UNIF.PROJECTION_MATRIX}, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);

      this.EnableGfxUniforms({unif:SID.UNIF.SCREEN_RESOLUTION}, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      this.EnableGfxUniforms({unif:SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   }




   ParticleAddToGfx(particle_idx) {

      // Must create geom struct to pass to the GlAdd...() fuunction
      const geom = {
         pos: this.particles_buffer.buffer[particle_idx].pos,
         dim: this.particles_buffer.buffer[particle_idx].dim,
         time: this.particles_buffer.buffer[particle_idx].time,
      }

      const mat = {
         col: this.particles_buffer.buffer[particle_idx].col,
         style: this.style,
      };



      const start = Vertex_buffer_add_vertices_from_reset(this.gfx, geom, mat, _);
      this.particles_buffer.buffer[particle_idx].SetGfxStart(start);


      return start;
   }


   SetDir(xdir=0, ydir=0){

      if(xdir!==0) this.dir[0] = GetSign(xdir);
      if(ydir!==0) this.dir[1] = GetSign(ydir);
   }


   SetConeOfDirection(xdir_pos, xdir_neg, ydir_pos, ydir_neg){

      this.variation_emission.xdir_pos = xdir_pos;
      this.variation_emission.xdir_neg = xdir_neg;
      this.variation_emission.ydir_pos = ydir_pos;
      this.variation_emission.ydir_neg = ydir_neg;
   }


   EnableGfxAttributes(which, params) {


      switch (which) {

         case MESH_ENABLE.GFX.ATTR_STYLE: {

             this.sid.attr |= (SID.ATTR.STYLE | SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER) | SID.ATTR.GENERIC_ATTR1_VEC4 | SID.ATTR.EMPTY | SID.ATTR.DIM2;
             this.sid.pass |= SID.PASS.WPOS2 | SID.PASS.DIM2;
             if (!(params === null || params === undefined)) {
                 this.mat.style = params.style;
             }
             break;
         }
         case MESH_ENABLE.GFX.ATTR_TIME: { this.sid.attr |= SID.ATTR.TIME; break; }
         case MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX: { this.sid.attr |= SID.ATTR.COL4_PER_VERTEX; break; }
         case MESH_ENABLE.GFX.ATTR_DIM2: {

             this.sid.attr |= SID.ATTR.DIM2;
             this.sid.pass |= SID.PASS.DIM2; // TODO: Do we set the passing of dim to fargment shader automaticaly????
             break;
         }
         case MESH_ENABLE.GFX.PASS_COL4: { this.sid.pass |= SID.PASS.COL4; break; }
         case MESH_ENABLE.GFX.PASS_WPOS2: { this.sid.pass |= SID.PASS.WPOS2; break; }
         case MESH_ENABLE.GFX.PASS_DIM2: { this.sid.pass |= SID.PASS.DIM2; break; }
         case MESH_ENABLE.GFX.PASS_RES2: { this.sid.pass |= SID.PASS.RES2; break; }
         case MESH_ENABLE.GFX.PASS_TIME1: { this.sid.pass |= SID.PASS.TIME1; break; }
         // Effect Shaders
         case MESH_ENABLE.GFX.FX_GLOW: { this.sid.fx |= SID.FX.FS_GLOW; break; }
         case MESH_ENABLE.GFX.FX_NOISE: { this.sid.fx |= SID.FX.FS_NOISE; break; }
         case MESH_ENABLE.GFX.FX_SMOKE: { this.sid.fx |= SID.FX.FS_SMOKE; break; }

         default: console.error('Enable material\'s shader param failed. @ Material.js');
     }
   }


   EnableGfxUniforms(flags=0x0, name, type, shader_flags) {

      /**
       * How to set up a uniform:
       * 1. Call this, with uniform name and a gl:SID.UNIF. the type of uniform to enable.
       *      This means that the user is responsible to add any new uniform type in 'SID' global object.
       *      That is so we can check and enable code in the shader builder. 
       *       Also User must create the apropriate conditionals and glsl code in 'ShaderBuilder.js' for the uniform
       * 2. We need to bind the 'Set' and 'Update' functions for the uniforms to be usefull.
       *      . For the block uniforms, we only need to 'Set' the value via 'Uniforms_block_set_uniform()' 
       *          function, the Update happens by gl.bindBuffer.
       *      . For individual uniforms, both 'Set' and 'Update' must be bound via 'Program_uniform_bind()' function.
       *          Use the 'Program_uniform_bind' and not 'Uniforms_bind...' Because the uniform update uses only a 'loc', 
       *          this might lead to unwilingly updating same loc of another program's uniform. 
       */

      if(flags.unif) this.sid.unif |= flags.unif;
      if(flags.pass) this.sid.pass |= flags.pass;
      if(flags.fx)   this.sid.fx   |= flags.fx;

      // Avoid duplicates
      const len = this.uniforms.length;
      let skip = false;
      for (let i = 0; i < len; i++) {
         if (this.uniforms[i].name === name)
            skip = true;
      }

      if (!skip) {

         const idx = this.uniforms.push({
            name: name,
            type: type,
            ubidx: INT_NULL, // Shoud be set by the Gl Program creation. So the first mesh that will push to create the program will have the ubidx
            shader: shader_flags,
         });

         this.temp_unif_wpos = idx - 1;

      }

   }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // Find uniform
      const len = this.uniforms.length;
      let found_idx = INT_NULL;
      for (let i = 0; i < len; i++) {
         if (this.uniforms[i].name === unif_name) {
            found_idx = i;
            break;
         }
      }

      if (found_idx !== INT_NULL) {

         Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx);
         return;
      }

      console.error('No Uniform Found', unif_name, this.GetName())
      alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js')

   }


   // TODO: Implement Destroy for Emmiters AND add Destroy for the buffers(M_, Int8, Int16)


   GetName() {
      return Str_buffer_get_by_idx(this.nameidx);
   }

}

const _emitters = New_generic_buffer(_, 'Particle System: Emitter buffer');


export function Particles_get_particle_system(idx){
   return _emitters.buffer[idx];
}



/**
 * 
 * @param {*} emitteridx 
 * @param {*} unif_name 
 * @param {*} Clbk 
 * @param {*} clbk_params : These are the parameters for the callback function
 * @param {*} val_idx : The index of the uniform element to access. E.x. If uniform is vec3, then an index of 0 will access the first element
 * @param {*} start_val : Set a start value from which the changes(from a slider) will take effect
 * @param {*} max : Set the maximum value that the uniform value will take
 */
export function Particles_gfx_uniforms_set_clbk(emitteridx, unif_name, Clbk, clbk_params, val_idx=null, start_val=0, max=1) {

   const emitter = _emitters.buffer[emitteridx];
   const params = {
      slider:clbk_params, 
      vb_grouidx:emitter.gfx.vb.groupidx,
      val_idx:val_idx,
      max:max,
      start_val:start_val,
   }
   emitter.GfxUniformsSetClbk(unif_name, Clbk, params);
}

export function TEMP_PARTICLES_GEN_GFX(emitter, parent=null, specific_vb_groupidx){

   if(!parent) console.error('4431623 \nEmmiter should have a parent mesh.')

   emitter.parent = parent;

   const FLAGS = GFX_CTX_FLAGS.PRIVATE;
   emitter.gfx = Gfx_generate_context_for_particle_system(FLAGS, emitter, _, specific_vb_groupidx,);

   emitter.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, emitter.gfx.vb.groupidx);

      

   // TODO: Temporary implementation of assigning the correct gfx update function pointer
   if(emitter.sid.fx & SID.FX.FS_GLOW)
      emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_pos2_style3;
   else emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_pos2;

   return emitter.gfx.vb.groupidx;
}

// TODO: pass an already created sid, for selecting from a gama of shader particles
export function Particle_system_create_emitter(name, col, pos, dim, t_step, life_time, accel, deccel, gravity, max_speed) {

   const emitter = new Emitter(name, col, pos, dim, t_step, life_time, accel, deccel, gravity, max_speed);

   const idx = _emitters.Add(emitter);

   _emitters.buffer[idx].idx = idx;


   return idx;
}


export function Particle_system_emitt(params) {


   const len = params.params.target_params.length;
   // const len = params.evt_params.target_params.length;
   for (let i = 0; i < len; i++) {

      // const emitter_idx = params.evt_params.target_params[i]
      const emitter_idx = params.params.target_params[i]
      const emitter = _emitters.buffer[emitter_idx];
      const last_elem = emitter.free_particles_idxs_buffer.boundary;


      if (last_elem === INT_NULL) {

         const particle = new Particle(emitter);
         const particle_idx = emitter.particles_buffer.Add(particle);
         particle.is_alive = true;
         // Push particle to the gfx buffers
         emitter.ParticleAddToGfx(particle_idx);
      }
      else {

         const particle_idx = emitter.free_particles_idxs_buffer.buffer[last_elem];
         const particle = emitter.particles_buffer.buffer[particle_idx];
         if (particle !== undefined) {

            particle.is_alive = true;
            particle.random_val = Hash(Timer_get_global_timer());
            particle.accel = emitter.accel;
            particle.deccel = emitter.deccel;
            particle.gravity = emitter.gravity;
            // particle.time = Hash(Timer_get_global_timer());
            particle.pos[0] = emitter.pos[0];
            particle.pos[1] = emitter.pos[1];

            particle.col[0] = emitter.col[0];
            particle.col[1] = emitter.col[1];
            particle.col[2] = emitter.col[2];
            particle.col[3] = emitter.col[3];


            if(emitter.dir[0] !== 0 && GetSign(particle.dirx) !== emitter.dir[0]){
               particle.dirx *= -1;
               emitter.dirx_change = false;
               
            }
            if(emitter.dir[1] !== 0 && GetSign(particle.diry) !== emitter.dir[1]){
               particle.diry *=-1; 
               emitter.diry_change = false;
            }

            if(emitter.flags & PARTICLES.HAS_START_POS_VARIATION){

               const minx = emitter.variation_emission.xdir_neg * max
               const maxx = emitter.variation_emission.xdir_pos * max
               const dx = GetRandomInt(minx, maxx);
               particle.dirx = interpolate*dx;
               
               const miny = emitter.variation_emission.ydir_neg * max
               const maxy = emitter.variation_emission.ydir_pos * max
               const dy = GetRandomInt(miny, maxy);
               particle.diry = interpolate*dy;
      
            }
            
            emitter.free_particles_idxs_buffer.RemoveByIdx(last_elem);
         }
         else console.log('UNDEFINED')
      }
   }



}


export function Particle_system_update() {

   if (_emitters.active_count === 0) return;
   
   for (let i = 0; i <= _emitters.boundary; i++) {
      
      const emitter = _emitters.buffer[i];
      let needs_update = false;
      
      // console.log(emitter.speed)


      for (let j = 0; j <= emitter.particles_buffer.boundary; j++) {

         const particle = emitter.particles_buffer.buffer[j];

         if (particle.is_alive) {

            { // Effect:{Jiggle in}
               // const x = GetRandomInt(1, 20);
               // const y = GetRandomInt(1, 30);
               // particle.pos[0] += (x-particle.pos[0]*.038)*.2;
               // particle.pos[1] += (y-particle.pos[1]*.038)*.2;
            }
            { // Effect:{Siphon in}
               // const x = GetRandomInt(1, 20);
               // const y = GetRandomInt(1, 30);
               // particle.pos[0] += (x-particle.pos[0]*.04)*.2;
               // particle.pos[1] += (y-particle.pos[1]*.04)*.2;
               // particle.pos[0] += (x-particle.pos[0])*.06;
               // particle.pos[1] += (y-particle.pos[1])*.06;
               // // particle.pos[0] += (x-particle.pos[0])*.07;
               // // particle.pos[1] += (y-particle.pos[1])*.07;
            }
            { // Effect: {TESTS}
            //    // const x = GetRandomInt(-2, 2)*particle.dirx;
            //    // const x = GetRandomInt(-5, -2);
            //    // const y = GetRandomInt(-5, -2);
            //    const x = GetRandomInt(5, 20);
            //    const y = GetRandomInt(5, 20);
            //    // const x = GetRandomInt(0, 20);
            //    // const y = GetRandomInt(-10, 10);
            //    // particle.pos[0] += (x-particle.pos[0]*.04)*.2;
            //    // particle.pos[1] += (y-particle.pos[0]*.04)*.2;
            //    particle.pos[0] += (x-particle.pos[0]*.04)*.2;
            //    particle.pos[1] += (y-particle.pos[1]*.04)*.2;
            //    // particle.pos[0] += (x-particle.pos[0])*.06;
            //    // particle.pos[1] += (y-particle.pos[1])*.06;
            //    // particle.pos[0] += (x-particle.pos[0])*.02;
            //    // particle.pos[1] += (y-particle.pos[1])*.02;
            }


            
            // TODO: For efficiency create 2 loops, and check which case the particles are and run the for without if statement
            if(emitter.flags & PARTICLES.HAS_START_POS_VARIATION){
               // const x = GetRandomInt(-4, 4);
               // const y = GetRandomInt(-4, 4);
               // particle.pos[0] += (x)*.17;
               // particle.pos[1] += (y)*.17;
               // const x = GetRandomInt(-40, 40);
               // const y = GetRandomInt(-40, 40);
               // particle.pos[0] += (x)*.017;
               // particle.pos[1] += (y)*.017;
               // const x = GetRandomInt(-2, 2);
               // const y = GetRandomInt(-2, 2);
               // particle.pos[0] += (x)*.6;
               // particle.pos[1] += (y)*.09;
               
               const speed = emitter.speed * particle.accel;
               // particle.pos[0] += .1;
               // particle.pos[1] = -200;
               particle.pos[0] += speed * particle.dirx;
               particle.pos[1] += speed * particle.diry;

               particle.pos[1] += particle.grav* particle.accel;
               particle.grav += emitter.gravity * emitter.deccel;
               
               if (speed > emitter.max_speed) {
                  particle.accel *= emitter.deccel;
               }
            }
            
            if(true){ // Fade away
               // const h=1.8, k=0, r=1.8*1.8; 
               // const h=1, k=0, r=1; 
               // const x = particle.time;
               // let y = Math.sqrt((-(x-h)*(x-h)) + r) +k;
               // y = 2 *(Math.sin((x*x*x)+Math.PI/2))-1;
               // particle.col[3] -= emitter.t_step;
               // particle.col[3] -= emitter.t_step*y;
               // particle.col[3] *= y;
               // if(i===0) console.log(y)
               // if(i===0) console.log(particle.col[3])
            }

               // particle.pos[0] += speed * particle.accel * particle.dirx;
               // particle.pos[1] += speed * particle.accel * particle.diry * particle.grav;
               // // particle.pos[1] += speed  * particle.diry * particle.grav;
               // if (particle.accel > 1) particle.accel *= deccel
               // particle.grav *= gravity;
               // // particle.diry = GetRandomInt(5, max)*dir_factor;



            emitter.UpdateGfxBuffersFn(emitter.gfx.vb.groupidx, particle.start, particle.col, particle.pos, particle.time);

            // particle.time += .003;
            particle.time += emitter.t_step *speed_ratio;
            
            // console.log(emitter.t_step)
            if (particle.time >= emitter.life_time) {

               // Reset particle for reuse
               particle.is_alive = false;
               particle.time = 0;
               particle.accel = emitter.accel;
               particle.grav = emitter.gravity;
               particle.pos[0] = 0
               particle.pos[1] = 0
               particle.col[3] = 1

               emitter.free_particles_idxs_buffer.Add(j)
               // emitter.particles_buffer.RemoveByIdx(j);

            }

            needs_update = true;
         }
      }

      if (needs_update) Vertex_buffer_state_enable(_emitters.buffer[i].gfx.vb.groupidx, _emitters.buffer[i].gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
   }

}



























/*********************************************************************************************************/
// DEBUG-PRINT



// Print the widget groups buffer
export function Particle_system_print_info() {

   
   console.log('_emitters:\n count:', _emitters.active_count, 'size',  _emitters.size)
   for (let i = 0; i <= _emitters.boundary; i++) {

      const emitter = _emitters.buffer[i];

      // for(let k=0; k<emitter.uniforms.length; k++) {

      //    console.log(emitter.uniforms[k]);
      // }

      // .gfx
      const parent = (emitter.parent !== null) ? emitter.parent.GetName() : 'null'

      console.log('emitter:', i, 'name:', Str_buffer_get_by_idx(emitter.nameidx),
         '\nindex:', emitter.idx,
         'sid:', emitter.sid,
         '\nroot_pos:', emitter.root_posidx,
         'temp_unif_wpos:', emitter.temp_unif_wpos,
         'prog:', emitter.gfx.prog.idx, 'vb:', emitter.gfx.vb.groupidx,'ib:', emitter.gfx.ib.idx, 'attribsPerVertex:', emitter.gfx.attribsPerVertex,
         '\nparent:', parent,
         '\ncolor:', emitter.col,
         '\npos:', emitter.pos,
         '\ndim:', emitter.dim,
         '\nAccel:', emitter.accel,
         '\ndeccel:', emitter.deccel,
         '\ngravity:', emitter.gravity,
         '\nspeed:', emitter.speed,
         '\nmax_speed:', emitter.max_speed,
         '\nlife_time:', emitter.life_time,
         '\nt_step:', emitter.t_step,
         '\ndirection:', emitter.dir,
         '\nvariation_emission:', emitter.variation_emission,
         '\nuniforms:', emitter.uniforms,
         // '||| parent:', parent_name,
         // 'parent_posidx:', _per_vb_mesh_unif_wpos.buffer[i].parent_posidx,
         // 'Uniforms:', uniform_names,
      );
   }
}
















