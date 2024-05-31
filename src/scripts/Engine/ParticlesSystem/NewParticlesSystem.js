"use strict";

import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset, Vertex_buffer_state_enable, Vertex_buffer_update_vertices, Vertex_buffer_update_vertices_explicit_Params } from "../../Graphics/Buffers/VertexBuffers.js";
import { Gl_particles_batch_set, Gl_particles_batch_set_col4_wpos4_pos2_style3 } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomColor, GetRandomInt } from "../../Helpers/Helpers.js";
import { CopyArr3 } from "../../Helpers/Math/MathOperations.js";
import { New_generic_buffer, New_int16_buffer } from "../Core/Buffers.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Core/StringBuffer.js";
import { TEMP_Gfx_generate_context_for_particles } from "../Interfaces/Gfx/MeshGfxContext.js";
import { Timer_get_global_timer } from "../Timers/Timers.js";



// Create particle struct

// Create the emmiter struct. Should be a normal mesh?

// Create the buffer for the children particles

/**
 * Particles Shader
 * 
 * uniform color
 * uniform wpos
 * 
 * attribute pos
 * attribute dim
 * attribute tex // If Used
 * 
 * attribute time // Inside the wpo4 design
 * 
 * Alpha
 * attribute alpha // Inside the dim???
 * Or use the shader with the timer to calculate the alpha
 */
const dir_factor = .6


let yy = .1
let speed = .06;
let accel = 4.;
let deccel = .985;
let max = 100;
let gravity = 1.04;
// let gravity = 1.06;
// let gravity = 1.3;



class Particle {

   constructor(emitter) {

      if (emitter === null || emitter === undefined) alert('Trying to create particle with NULL emitter\nParticleSystem.js')

      // this.col = [];
      this.col = [0, 0, 0, 0];
      this.pos = [0, 0, 0];
      this.dim = [0, 0];
      
      this.is_alive = false;
      
      this.t = 0;
      this.accel = accel;
      this.grav = yy;
      this.dirx = GetRandomInt(50, max);
      this.diry = max - this.dirx;

      // Emitter variables
      this.idx = INT_NULL; // Self index to the emitter's buffer
      this.emitter = emitter;

      // GFX variables
      this.start = INT_NULL; // The start index in the vertex buffer

      // Copy the position of the emitter
      this.pos[0] = emitter.pos[0];
      this.pos[1] = emitter.pos[1];
      this.pos[2] = emitter.pos[2];
      this.dim[0] = emitter.dim[0];
      this.dim[1] = emitter.dim[1];

      this.col[0] = emitter.col[0];
      this.col[1] = emitter.col[1];
      this.col[2] = emitter.col[2];
      this.col[3] = emitter.col[3];
   }

   SetGfxStart(start) {
      this.start = start;
   }

   SetSelfIdx(idx) {
      this.idx = idx;
   }
}


class Emitter {

   constructor(col, pos, dim, t_step, life_time, name) {

      this.sid = 0x0;
      this.sceneidx = STATE.scene.active_idx;
      this.col = col; // a uniform color for the gfx
      this.pos = pos;
      this.dim = dim;
      this.t_step = t_step;
      this.life_time = life_time;
      this.root_posidx = INT_NULL;
      this.gfx = null;
      this.type = MESH_TYPE.PARTICLES;
      this.nameidx = Str_buffer_store(name);
      
      this.particles_buffer = New_generic_buffer(_, 'Particles - particles_buffer');
      this.free_particles_idxs_buffer = New_int16_buffer();


      this.sid = {
         shad: SID.SHAD.INDEXED,
         attr: SID.ATTR.COL4 | SID.ATTR.POS2 | SID.ATTR.WPOS_TIME4,
         unif: 0x0,
         pass: SID.PASS.COL4,
      };

      this.style = [0, 40, 1.5]
      this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);


      this.uniforms = [];
      if (APP.ENABLE_SHADER_PROJECTION_MATRIX)
         this.EnableGfxUniforms(SID.UNIF.PROJECTION_MATRIX, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);

      this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

      this.EnableGfxUniforms(SID.UNIF.WPOS4, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // this.EnableGfxUniforms(SID.UNIF.COL4, 'u_col4', UNIF_TYPE.FVEC4, UNIFORM.IN_VS);
   }

   ParticleAddToGfx(particle_idx) {

      // Must create geom struct to pass to the GlAdd...() fuunction
      const geom = {
         pos: this.particles_buffer.buffer[particle_idx].pos,
         dim: this.particles_buffer.buffer[particle_idx].dim,
      }
      
      const mat = {
         col: this.particles_buffer.buffer[particle_idx].col,
         style: this.style,
      };

      const start = Vertex_buffer_add_vertices_from_reset(this.gfx, geom, mat);
      this.particles_buffer.buffer[particle_idx].SetGfxStart(start);
      
      
      return start;
   }
   
   // ParticleUpdateGfx(particle_idx) {
      
   //    // Must create geom struct to pass to the GlAdd...() fuunction
   //    const geom = {
   //       pos: this.particles_buffer.buffer[particle_idx].pos,
   //       dim: this.particles_buffer.buffer[particle_idx].dim,
   //    }
      
   //    const mat = {
   //       col: this.particles_buffer.buffer[particle_idx].col,
   //       style: this.style,
   //    };
      
   //    const vbidx = this.gfx.vb.groupidx; 
   //    const start = this.particles_buffer.buffer[particle_idx].start; 
   //    Vertex_buffer_update_vertices_explicit_Params(vbidx, start, geom, mat);

   // }

   EnableGfxAttributes(which, params) {

      if (this.alreadyAdded === true) {
          console.error(`You are trying to enable ${which} but the shaders have been already created. Try Enable() before inserting the mesh to a Scene().`);
          alert('SEE console error');
      }


      switch (which) {

          case MESH_ENABLE.GFX.ATTR_STYLE: {

              this.sid.attr |= (SID.ATTR.STYLE | SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER) | SID.ATTR.GENERIC_ATTR1_VEC4 | SID.ATTR.EMPTY;
              this.sid.pass |= SID.PASS.WPOS2 | SID.PASS.DIM2;
              if (!(params === null || params === undefined)) {
                  this.style = params.style;
              }
              break;
          }
          case MESH_ENABLE.GFX.ATTR_TIME: {

              this.sid.attr |= SID.ATTR.TIME;
              break;
          }

          case MESH_ENABLE.GFX.PASS_COL4: { this.sid.pass |= SID.PASS.COL4; break; }
          case MESH_ENABLE.GFX.PASS_WPOS2: { this.sid.pass |= SID.PASS.WPOS2; break; }
          case MESH_ENABLE.GFX.PASS_DIM2: { this.sid.pass |= SID.PASS.DIM2; break; }
          case MESH_ENABLE.GFX.PASS_RES2: { this.sid.pass |= SID.PASS.RES2; break; }
          case MESH_ENABLE.GFX.PASS_TIME1: { this.sid.pass |= SID.PASS.TIME1; break; }

          default: console.error('Enable material\'s shader param failed. @ Material.js');
      }
  }

   EnableGfxUniforms(flags, name, type, shader_flags) {

      if (this.alreadyAdded === true) {
         console.error(`You are trying to enable ${which} but the shaders have been already created. Try Enable() before inserting the mesh to a Scene().`);
         alert('SEE console error');
      }

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

      this.sid.unif |= flags;

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
}

const _emitters = New_generic_buffer(_, 'Particle System: Emitter buffer');

// TODO: pass an already created sid, for selecting from a gama of shader particles
export function Particle_system_create_emitter(col, pos, dim, t_step, life_time, name) {

   const emitter = new Emitter(col, pos, dim, t_step, life_time, name);


   const FLAGS = GFX_CTX_FLAGS.PRIVATE;
   emitter.gfx = TEMP_Gfx_generate_context_for_particles(FLAGS, emitter, _,  );


   const idx = _emitters.Add(emitter);

   return idx;
}


// export function Particle_system_emitt(emitter_idx) {
export function Particle_system_emitt(params) {


   const len = params.params.target_params.length;
   for (let i=0; i < len; i++){

      const emitter_idx = params.params.target_params[i]
      const emitter = _emitters.buffer[emitter_idx];
      const last_elem = emitter.free_particles_idxs_buffer.boundary;
      
      
      if(last_elem === INT_NULL){
         
         const particle = new Particle(emitter);
         const particle_idx = emitter.particles_buffer.Add(particle);
         particle.is_alive = true;
         // Push particle to the gfx buffers
         emitter.ParticleAddToGfx(particle_idx);
      }
      else{
         
         const particle_idx = emitter.free_particles_idxs_buffer.buffer[last_elem];
         const particle = emitter.particles_buffer.buffer[particle_idx];
         if(particle !== undefined){
            
            particle.is_alive = true;
            emitter.free_particles_idxs_buffer.RemoveByIdx(last_elem);
            // console.log('USED ', 'idx', particle_idx, 'posx', emitter.particles_buffer.buffer[particle_idx].pos[0], 'start',emitter.particles_buffer.buffer[particle_idx].start)
         }
         else console.log('UNDEFINED')
      }
   }



}


export function Particle_system_update() { 

   if(_emitters.active_count===0) return;

   const t = Timer_get_global_timer();
   // console.log('---------------------')

   for(let i=0; i <= _emitters.boundary; i++){
      
      const emitter = _emitters.buffer[i];
      
      for(let j=0; j <= emitter.particles_buffer.boundary; j++){

         const particle = emitter.particles_buffer.buffer[j];

         if(particle.is_alive){
            
            // Process particle physics
            
            particle.pos[0] += speed * particle.accel * particle.dirx;
            particle.pos[1] += speed * particle.accel * particle.diry * particle.grav;
            // particle.pos[1] += speed  * particle.diry * particle.grav;
            if(particle.accel>1) particle.accel *= deccel
            particle.grav *= gravity;

            
            
            // Updtate Gfx Buffers
            Gl_particles_batch_set_col4_wpos4_pos2_style3(emitter.gfx.vb.groupidx, particle.start, particle.col, particle.pos, particle.dim)
            
            particle.t += .003;
            if(particle.t >= 1){
               
               // Reset particle for reuse
               particle.is_alive = false;
               particle.t = 0;
               // particle.dirx = GetRandomInt(.1, max)*dir_factor;
               particle.dirx = GetRandomInt(50, max);
               particle.diry = max - particle.dirx;
               // particle.diry = GetRandomInt(5, max)*dir_factor;
               particle.accel = accel;
               particle.grav = yy;
               particle.pos[0] = 0
               particle.pos[1] = 1
               
               emitter.free_particles_idxs_buffer.Add(j)
               // emitter.particles_buffer.RemoveByIdx(j);
               
            }
         }
      }
      Vertex_buffer_state_enable(_emitters.buffer[i].gfx.vb.groupidx, _emitters.buffer[i].gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
   }

}



// function TEMP_update_particles_vertex_buffer(vb_data, geom, mat, start, num_faces, stride){

//    let attribs_count = 0;
//    let index = start;


//    for (let i = 0; i < num_faces; i++) {

//       // V1
//       vb_data[index++] = geom.pos[0] + geom.dim[0];
//       vb_data[index++] = geom.pos[1] + geom.dim[1];
//       vb_data[index++] = geom.pos[2];
//       index++; // For WPOS4

//       vb_data[index++] = -geom.dim[0];
//       vb_data[index++] = geom.dim[1];


//       // V2
//       vb_data[index++] = geom.pos[0] + geom.dim[0];
//       vb_data[index++] = geom.pos[1] + geom.dim[1];
//       vb_data[index++] = geom.pos[2];
//       index++; // For WPOS4

//       vb_data[index++] = -geom.dim[0];
//       vb_data[index++] = -geom.dim[1];


//       // V3
//       vb_data[index++] = geom.pos[0] + geom.dim[0];
//       vb_data[index++] = geom.pos[1] + geom.dim[1];
//       vb_data[index++] = geom.pos[2];
//       index++; // For WPOS4

//       vb_data[index++] = geom.dim[0];
//       vb_data[index++] = geom.dim[1];


//       // V4
//       vb_data[index++] = geom.pos[0] + geom.dim[0];
//       vb_data[index++] = geom.pos[1] + geom.dim[1];
//       vb_data[index++] = geom.pos[2];
//       index++; // For WPOS4

//       vb_data[index++] = geom.dim[0];
//       vb_data[index++] = -geom.dim[1];

//       // index += stride;
//       attribs_count += stride * 4; // TODO: Store Vertices_per_rect in shder_attribs?????
//    }

//    return attribs_count;
// }