"use strict";

import { Uniforms_buffer_find_ubidx_from_name } from "../../Graphics/Buffers/UniformBuffers.js";
import { Vertex_buffer_add_vertices_from_reset, Vertex_buffer_set_uniform_value_callback, Vertex_buffer_state_enable, Vertex_buffer_set_and_update_uniform } from "../../Graphics/Buffers/VertexBuffers.js";
import { Gl_particles_batch_set_col4_wpos4_vpos2_dim2_time, Gl_particles_batch_set_col4_wpos4_vpos2_dim2_tex2_rot4, Gl_particles_batch_set_col4_wpos4_vpos2_dim2_style2_time, Gl_particles_batch_set_col4_wpos4_dim2_style1_time, Gl_particles_batch_set_col4_wpos4_vpos2_dim2_style1_time_generic2, Gl_particles_batch_set_col4_wpos4_vpos2_dim2_time_generic2 } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Program_store_shader_operations } from "../../Graphics/ShaderPrograms.js";
import { GetRandomInt, GetSign } from "../../Helpers/Helpers.js";
import { Abs, Floor, Hash, Magnitude } from "../../Helpers/Math/MathOperations.js";
import { Rotation_z_get_2D_matrix } from "../../Helpers/Math/Matrix.js";
import { New_generic_buffer, New_int32_buffer, New_int8_buffer } from "../Core/Buffers.js";
import { Mesh_unif_get_vb_root_wpos } from "../Core/MeshUniformsBuffer.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Core/StringBuffer.js";
import { Material, Material_Texture } from "../Drawables/Material/Base/Material.js";
import { Gfx_generate_context_for_particle_system } from "../Interfaces/Gfx/MeshGfxContext.js";
import { Renderqueue_set_active } from "../Renderers/Renderer/RenderQueue.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";
import { Timer_get_global_timer } from "../Timers/Timers.js";


/**
 * // TODO: Implement correctly the fillOp functions
 * 
 * // TODO: Implement the rotation,jiggle,etc, to be enabled exclusively by the user
 * Enable jiggle and create the contol slider to manage it
 * 
 * // TODO: Create a better random direction algorithm
 * 
 * Make particle system more Generic:
 * Example: Implement an explosion effect.
 * 
 * Create the correct controls + the number of particles per frame.
 * 
 * 
 * Prerequisites: 
 *    1. Have many particles created at one frame, taht needs to position each particle differently in a for loop
 *    2. // TODO: particles.OnUpdate() 
 * 
 * So, we need to implement a particles num_count per frame variable.
 * Also we need a way for creating the 'directions' of the particles, 
 * for per frame different particles -through dirx/diry-, as well as look the current 
 * implementation of particle direction. Maybe create some flag for 'EXPOSION' 
 * and create the direction conditionaly from a function.
 * 
 * 
 */


const speed = 4;
const speed_ratio = .01
const max = 210;
const interpolate = 1 / max;

const initial_scale = 10;



function Polar_coordinates() {
   const rand_angle = GetRandomInt(0, 360);
   const dirx = Math.sin(rand_angle);
   const diry = Math.cos(rand_angle);
   return { x: dirx, y: diry, };
}
function Random_coordinates(xdir_neg, xdir_pos, ydir_neg, ydir_pos) {

   const minx = xdir_neg * max
   const maxx = xdir_pos * max
   const dx = GetRandomInt(minx, maxx);
   const dirx = (interpolate * dx) + .01053;

   const miny = ydir_neg * max
   const maxy = ydir_pos * max
   const dy = GetRandomInt(miny, maxy);
   const diry = (interpolate * dy) + .00953;
   return { x: dirx, y: diry, };
}

let counter = 0;

class Particle {

   constructor(emitter) {

      if (emitter === null || emitter === undefined) alert('Trying to create particle with NULL emitter\nParticleSystem.js')

      this.col = [0, 0, 0, 0];
      this.pos = [0, 0, 0];
      this.dim = [0, 0];

      this.is_alive = false;

      this.random_val = Hash(Timer_get_global_timer() + counter++); // This parameter is only for the Fragment Shader 
      const rnd = Abs(this.random_val);

      this.scale = emitter.max_scale;
      this.accel = emitter.accel;
      this.deccel = emitter.deccel;
      this.grav = emitter.gravity;

      // Emitter variables
      this.idx = INT_NULL; // Self index to the emitter's buffer
      // this.emitter = emitter;

      // GFX variables
      this.start = INT_NULL; // The start index in the vertex buffer

      this.time = emitter.time;
      this.generic = { a: emitter.generic.a, b: emitter.generic.b };
      // Deep Copy values from emitter
      this.pos[0] = emitter.pos[0];
      this.pos[1] = emitter.pos[1];
      this.pos[2] = emitter.pos[2];

      this.dim[0] = emitter.dim[0];
      this.dim[1] = emitter.dim[1];

      this.dirx = (emitter.dir[0] !== 0) ? emitter.dir[0] : 1;
      this.diry = (emitter.dir[1] !== 0) ? emitter.dir[1] : 1;

      this.col[0] = emitter.mat.col[0];
      this.col[1] = emitter.mat.col[1];
      this.col[2] = emitter.mat.col[2];
      this.col[3] = emitter.mat.col[3];
      // this.col = GetSequencedColor();

      this.uv = [0, 1, 0, 1];

      this.rot = [1, 1, 1, 1];
      // Create random rotation
      this.angle = (rnd * .5 + 2) * Math.PI * 2;
      this.rot = Rotation_z_get_2D_matrix(this.angle);

      if (emitter.properties_flags & PARTICLES.HAS_START_POS_VARIATION) {

         const dir = Random_coordinates(emitter.variation_emission.xdir_neg, emitter.variation_emission.xdir_pos, emitter.variation_emission.ydir_neg, emitter.variation_emission.ydir_pos);
         this.dirx = dir.x;
         this.diry = dir.y;

         this.accel = emitter.accel * (rnd * .5 + 1) * 1.4;

      }
      if (emitter.properties_flags & PARTICLES.HAS_RANDOM_POLAR_COORD) {

         const dir = Polar_coordinates()
         this.dirx = dir.x;
         this.diry = dir.y;

         this.accel = emitter.accel * (this.random_val * 100 + 100) * .001;

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

   constructor(name, col, pos, dim, t_step = .0001, life_time, accel = 1, deccel = .99, gravity = 0, max_speed = 2, texture_id = INT_NULL, num_particles_per_frame = 1) {

      this.sid = 0x0;
      this.sceneidx = STATE.scene.active_idx;
      this.root_posidx = INT_NULL;
      this.gfx = null;
      this.type = MESH_TYPE.PARTICLES;
      this.idx = INT_NULL;
      this.name = name;
      this.nameidx = Str_buffer_store(name);
      // this.col = new Float32Array(col); // a uniform color for the gfx
      this.pos = [pos[0], pos[1], pos[2]];
      this.prev_pos = [pos[0], pos[1]];
      this.dim = [dim[0], dim[1]];

      this.dir = [0, 0];
      this.t_step = t_step;
      this.life_time = life_time;
      this.speed = speed;
      this.texture_id = texture_id;
      this.texidx = INT_NULL;

      this.parent = null;

      this.is_active = false;

      this.accel = accel;
      this.max_speed = max_speed;
      this.deccel = deccel;
      this.gravity = gravity;
      this.max_scale = max_speed;

      this.properties_flags = 0x0; // Set from user by method: EnableProperties()
      this.jigglex = 4;
      this.jiggley = 3;
      this.rotation = 0; // TODO: IMPLEMENT

      this.left_over = 0;
      this.time = 0; // Only purpose of 'this.time', is to initialize a particle's .time on new creation
      this.generic = { a: 0, b: 0 };


      this.UpdateGfxBuffersFn = null; // Function pointer to update the vertex buffer of the particle system

      // Set the cone of variation vector direction. Diagonals are -.5 and +.5 
      this.variation_emission = {
         xdir_pos: 1, // Right quadrant
         xdir_neg: 0, // Left quadrant
         ydir_pos: 1, // Lower quadrant
         ydir_neg: 0, // Upper quadrant
      }

      this.particles_buffer = New_generic_buffer(_, 'Particles - particles_buffer');
      this.free_particles_idxs_buffer = New_int32_buffer(_, 'ParticlesSystem-free_particles_idxs_buffer');
      this.shader_ops_idxs = New_int8_buffer(8, 'ParticleSystem.shader_ops_idxs');


      this.sid = {
         shad: SID.SHAD.INDEXED | SID.SHAD.INDEXED_PATT_DISCONTINUE_4,
         attr: SID.ATTR.COL4 | SID.ATTR.VPOS2 | SID.ATTR.WPOS3,
         unif: 0x0,
         shad_ops: 0x0,
         pass: SID.PASS.COL4,
         blend_options: 0x0,
         fx: 0x0,
      };


      const mat = (this.texture_id === INT_NULL) ? new Material(col) : new Material_Texture(col, this.texture_id);
      this.mat = mat;
      this.sid.attr |= mat.sid.attr;
      this.sid.unif |= mat.sid.unif;
      this.sid.shad |= mat.sid.shad;
      this.sid.pass |= mat.sid.pass;
      this.sid.fx |= mat.sid.fx;


      this.uniforms = [];
      if (APP.ENABLE_SHADER_PROJECTION_MATRIX)
         this.EnableGfxUniforms({ unif: SID.UNIF.PROJECTION_MATRIX }, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);

      this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      this.EnableGfxUniforms({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      this.num_particles_per_frame = num_particles_per_frame;
      this.has_intermidiate_emission = false;


      // Initialize Function Pointers
      // Let them run an empty function instead of if statements in the update loop
      this.Particle_update_position = Particle_update_position_empty;
      this.Particle_update_jiggle = Particle_update_jiggle_empty;
      this.Particle_update_rotation = Particle_update_rotation_empty;
      this.Particle_update_scale = Particle_update_scale_empty;
      this.Particle_update_fade = Particle_update_fade_empty;
   }


   Reset() {

      this.particles_buffer.ResetFull();
      this.free_particles_idxs_buffer.Reset();
   }



   ParticleAddToGfx(particle_idx) {

      // Must create geom struct to pass to the GlAdd...() fuunction
      const geom = {
         pos: this.particles_buffer.buffer[particle_idx].pos,
         dim: this.particles_buffer.buffer[particle_idx].dim,
         time: this.particles_buffer.buffer[particle_idx].time,
         generic: this.particles_buffer.buffer[particle_idx].generic,
      }

      const start = Vertex_buffer_add_vertices_from_reset(this.gfx, geom, this.mat, _);
      this.particles_buffer.buffer[particle_idx].SetGfxStart(start);


      return start;
   }


   SetDir(xdir = 0, ydir = 0) {

      if (xdir !== 0) this.dir[0] = GetSign(xdir);
      if (ydir !== 0) this.dir[1] = GetSign(ydir);
   }


   SetConeOfDirection(xdir_pos, xdir_neg, ydir_pos, ydir_neg) {

      this.variation_emission.xdir_pos = xdir_pos;
      this.variation_emission.xdir_neg = xdir_neg;
      this.variation_emission.ydir_pos = ydir_pos;
      this.variation_emission.ydir_neg = ydir_neg;
   }


   /**
    * Enable shader properties.
    * In order for a mesh to be drawn in a certain way, specific shaders must be build.
    * Allow the shader constructor to combine different shaders by enabling meshes 'sid' bit field. 
   */
   EnableGfxOperations(function_operation, blend_mode = SID.BLEND_OPTIONS.BLEND_MODE_ADD) {

      this.sid.shad_ops |= function_operation;
      this.shader_ops_idxs.Add(Program_store_shader_operations(function_operation, blend_mode));

      if((function_operation & SID.SHADER_OPERATIONS.GROUP_SDF_RECT) && (this.sid.shad_ops & SID.SHADER_OPERATIONS.SDF_RECT)===0) {
         console.error('Shader Operation detected: Need SDF_RECT to function.');
         alert('Shader Operation detected: Need SDF_RECT to function.');
      }
   }
   EnableGfx(which, params = null) {

      switch (which) {

         // case MESH_ENABLE.GFX.PASS_VPOS2: { this.sid.attr |= SID.ATTR.VPOS2; this.sid.pass |= SID.PASS.VPOS2; break; }
         case MESH_ENABLE.GFX.PASS_VPOS2: { this.sid.pass |= SID.PASS.VPOS2; break; }
         // case MESH_ENABLE.GFX.PASS_WPOS2: { this.sid.pass |= SID.PASS.WPOS2; break; }
         case MESH_ENABLE.GFX.ATTR_DIM2: { this.sid.attr |= SID.ATTR.DIM2; this.sid.pass |= SID.PASS.DIM2; break; }
         case MESH_ENABLE.GFX.ATTR_TEX2: { this.sid.attr |= SID.ATTR.TEX2; this.sid.pass |= SID.PASS.TEX2; break; }
         case MESH_ENABLE.GFX.ATTR_GENERIC_VEC2: {
            this.sid.attr |= SID.ATTR.GENERIC2;
            this.sid.pass |= SID.PASS.GENERIC2;
            if (params !== null) {
               this.generic.a = params.a;
               this.generic.b = params.b;
            }
            break;
         }
         case MESH_ENABLE.GFX.ATTR_TIME: {
            this.sid.attr |= SID.ATTR.TIME;
            this.sid.pass |= SID.PASS.TIME;
            if (params !== null) {
               this.time = params;
            }
            break;
         }
         case MESH_ENABLE.GFX.ATTR_ANGLE: { this.sid.attr |= SID.ATTR.ANGLE; this.sid.pass |= SID.PASS.ANGLE; break; }
         case MESH_ENABLE.GFX.ATTR_GLOW_INTENSITY: { this.sid.attr |= SID.ATTR.GLOW_INTENSITY; this.sid.pass |= SID.PASS.GLOW_INTENSITY; break; }
         case MESH_ENABLE.GFX.PASS_RES2: { this.sid.pass |= SID.PASS.RES2; break; }

         case MESH_ENABLE.GFX.FN_GLOW: { this.sid.shad |= SID.SHAD.FN_GLOW; break; }
         case MESH_ENABLE.GFX.FN_INNER_SHADOW: { this.sid.shad |= SID.SHAD.FN_INNER_SHADOW; break; }
         case MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE: { this.sid.shad |= SID.SHAD.FN_EXPLOSION_CIRCLE; break; }
         case MESH_ENABLE.GFX.FN_EXPLOSION_GLOW: { this.sid.shad |= SID.SHAD.FN_EXPLOSION_GLOW; break; }

         case MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX: {
            this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
            this.sid.pass |= SID.PASS.COL4_PER_VERTEX;
            if (params !== null) {
               if ((params[0] instanceof Float32Array) === false) alert('988701199872 Color must be an array of colors for COL4_PER_VERTEX')
               if (this.mat.col[0] instanceof Float32Array) CopyMat4(this.mat.col, params);
               else { this.mat.col = params; }
            }
            break;
         }
         case MESH_ENABLE.GFX.ATTR_R_CORNERS: {
            this.sid.pass |= SID.PASS.VPOS2 | SID.PASS.WPOS3;
            this.sid.pass |= SID.PASS.VPOS2 | SID.PASS.WPOS3;
            this.sid.attr |= SID.ATTR.R_CORNERS; this.sid.pass |= SID.PASS.R_CORNERS;
            this.sid.attr |= SID.ATTR.DIM2; this.sid.pass |= SID.PASS.DIM2;
            if (params !== null) this.mat.style.rcorners = params;
            break;
         }
         case MESH_ENABLE.GFX.ATTR_FEATHER: {
            this.sid.attr |= SID.ATTR.FEATHER; this.sid.pass |= SID.PASS.FEATHER;
            this.sid.pass |= SID.PASS.VPOS2 | SID.PASS.WPOS3;
            this.sid.attr |= SID.ATTR.DIM2; this.sid.pass |= SID.PASS.DIM2;
            if (params !== null) this.mat.style.feather = params;
            break;
         }
         case MESH_ENABLE.GFX.ATTR_BORDER: {
            this.sid.attr |= SID.ATTR.BORDER; this.sid.pass |= SID.PASS.BORDER;
            this.sid.pass |= SID.PASS.VPOS2 | SID.PASS.WPOS3;
            this.sid.attr |= SID.ATTR.DIM2; this.sid.pass |= SID.PASS.DIM2;
            if (params !== null) this.mat.style.border = params;
            break;
         }


         // Shader Color Functions
         case MESH_ENABLE.GFX.FX_NOISE: {
            // Exception: Use the 'params' to distinguish different worley noises 
            if (!params || params === 1) { this.sid.fx |= SID.FX.FS_NOISE; break; }
            else if (params === 2) { this.sid.fx |= SID.FX.FS_NOISE_2; break; }
         }
         case MESH_ENABLE.GFX.FN_GLOW_SPHERE: {
            if (this.sid.blend_options === 0x0) alert('Blend Mode MUST be enabled for shader: MESH_ENABLE.GFX.FN_GLOW_SPHERE')
            // if(params===null) alert('Blend Mode MUST be enabled for shader: MESH_ENABLE.GFX.FN_GLOW_SPHERE')
            this.sid.shad |= SID.SHAD.FN_GLOW_SPHERE; break;
         }
         case MESH_ENABLE.GFX.FN_NOISE_WORLEY: {
            // Exception: Use the 'params' to distinguish different worley noises 
            if (!params || params === 1) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_1; break; }
            else if (params === 2) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_2; break; }
            else if (params === 3) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_3_TYPES; break; }
         }
         case MESH_ENABLE.GFX.FN_NOISE_VORONOI: {
            // Exception: Use the 'params' to distinguish different worley noises 
            if (!params || params === 1) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_1; break; }
            else if (params === 2) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_2; break; }
         }

         case MESH_ENABLE.GFX.BLEND_OPTIONS: { if (params === null) alert('BLEND_OPTIONS MUST be passed in the params'); this.sid.blend_options |= params; break; }



         case MESH_ENABLE.GFX.TEST_SHADERS_1: { this.sid.shad |= SID.SHAD.FS_TEST1; this.sid.shad |= SID.SHAD.FS_TEST1; break; }
         case MESH_ENABLE.GFX.TEST_SHADERS_2: { this.sid.shad |= SID.SHAD.FS_TEST2; this.sid.shad |= SID.SHAD.FS_TEST2; break; }
         case MESH_ENABLE.GFX.TEST_SHADERS_3: { this.sid.shad |= SID.SHAD.FS_TEST3; this.sid.shad |= SID.SHAD.FS_TEST3; break; }
         case MESH_ENABLE.GFX.TEST_SHADERS_4: { this.sid.shad |= SID.SHAD.FS_TEST4; this.sid.shad |= SID.SHAD.FS_TEST4; break; }
         case MESH_ENABLE.GFX.FLARE: {
            // this.sid.shad |= SID.SHADER_OPERATIONS.FLARE; 
            // if(params === null) alert('665518665518 params should not be null');
            if (params !== null) this.shader_ops_idxs.Add(Program_store_shader_operations(params.function_operation, params.blend_mode));
            break;
         }

      }

   }



   EnableGfxUniforms(flags = 0x0, name, type, shader_flags, arr_size = 0) {


      /**
       * How to set up a uniform:
       * 1. Call this, with uniform name and a gl:SID.UNIF. the type of uniform to enable.
       *      This means that the user is responsible to add any new uniform type in 'SID' global object.
       *      That is so we can check and enable code in the shader builder. 
       * 2. We need to bind the 'Set' and 'Update' functions for the uniforms to be usefull.
       *      . For the block uniforms, we only need to 'Set' the value via 'Uniforms_block_set_uniform()' 
       *          function, the Update happens by gl.bindBuffer.
       *      . For individual uniforms, both 'Set' and 'Update' must be bound via 'Program_uniform_bind()' function.
       *          Use the 'Program_uniform_bind' and not 'Uniforms_bind...' Because the uniform update uses only a 'loc', 
       *          this might lead to unwilingly updating same loc of another program's uniform. 
       */

      if (flags.unif) this.sid.unif |= flags.unif;
      if (flags.pass) this.sid.pass |= flags.pass;
      if (flags.fx) this.sid.fx |= flags.fx;

      // Avoid duplicates
      const len = this.uniforms.length;
      let skip = false;
      for (let i = 0; i < len; i++) {
         if (this.uniforms[i].name === name)
            skip = true;
      }

      if (!skip) {
         this.uniforms.push({
            name: name,
            type: type,
            ubidx: INT_NULL, // Should be set by the Gl Program creation. So the first mesh that will push to create the program will have the ubidx
            shader: shader_flags,
            arr_size: arr_size,
         });
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

         if (this.uniforms[found_idx].ubidx === INT_NULL) {

            // Case the mesh is new but the vertex buffer already created and owns the uniform
            this.uniforms[found_idx].ubidx = Uniforms_buffer_find_ubidx_from_name(this.uniforms[found_idx].name, this.gfx.vb.groupidx);

            if (this.uniforms[found_idx].ubidx === INT_NULL) {
               return;
            }
         }

         // this.uniforms[found_idx].vertex_buffer_store_idx = Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx);
         Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx, this.uniforms[found_idx].name);
         return;
      }


      // Alert if the current particle system does not have the uniform enabled.
      console.error('No Uniform ', unif_name, ' found for mesh:', this.GetName());
      if (SID.CheckSidUnifByName(this.sid.unif, unif_name) === true) {
         alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js\nSEE ERROR')
      }

   }


   GfxUniformSetAndUpdate(unif_name, value, value_idx = null) {

      /**ERROR */ if (this.gfx === null) alert('Try to update uniform befores mesh has gfx.')

      const len = this.uniforms.length;
      for (let i = 0; i < len; i++) {
         if (this.uniforms[i].name === unif_name) {
            const ubidx = this.uniforms[i].ubidx;
            Vertex_buffer_set_and_update_uniform(this.gfx.vb.groupidx, ubidx, value, value_idx);
            break;
         }
      }
   }


   EnableProperties(which, params = null) {

      switch (which) {

         case PARTICLES.HAS_START_POS_VARIATION: {
            this.properties_flags |= PARTICLES.HAS_START_POS_VARIATION;
            this.Particle_update_position = Particle_update_position;
            break;
         }
         case PARTICLES.HAS_RANDOM_POLAR_COORD: {
            this.properties_flags |= PARTICLES.HAS_RANDOM_POLAR_COORD;
            this.Particle_update_position = Particle_update_position;
            break;
         }
         case PARTICLES.HAS_SCALE: {
            this.properties_flags |= PARTICLES.HAS_SCALE;
            if (params) {
               this.max_scale = params;
            }
            this.Particle_update_scale = Particle_update_scale;
            break;
         }
         case PARTICLES.HAS_ROTATION: {
            this.properties_flags |= PARTICLES.HAS_ROTATION;
            if (params) {
               this.rotation = params;
            }
            this.Particle_update_rotation = Particle_update_rotation;
            break;
         }
         case PARTICLES.HAS_JIGGLE: {
            this.properties_flags |= PARTICLES.HAS_JIGGLE;
            if (params) {
               this.jigglex = params.jigglex;
               this.jiggley = params.jiggley;
            }
            this.Particle_update_jiggle = Particle_update_jiggle;
            break;
         }
         case PARTICLES.HAS_FADE: {
            this.properties_flags |= PARTICLES.HAS_FADE;
            this.Particle_update_fade = Particle_update_fade;
            break;
         }
      }
   }

   // TODO: Implement Destroy for Emmiters AND add Destroy for the buffers(M_, Int8, Int16)


   // SetStyle(style) { this.mat.SetStyle(style); }
   SetStyle(style) { alert('this.mat.SetStyle(style);') }


   GetName() {
      return Str_buffer_get_by_idx(this.nameidx);
   }

}




const _emitters = New_generic_buffer(_, 'Particle System: Emitter buffer');
export function Particles_system_reset() { return _emitters.ResetFull(); }




export function Particles_get_particle_system(idx) { return _emitters.buffer[idx]; }



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
export function Particles_gfx_uniforms_set_clbk(emitteridx, unif_name, Clbk, clbk_params, val_idx = null, start_val = 0, max = 1) {

   const emitter = _emitters.buffer[emitteridx];
   const params = {
      slider: clbk_params,
      vb_grouidx: emitter.gfx.vb.groupidx,
      val_idx: val_idx,
      max: max,
      start_val: start_val,
   }
   emitter.GfxUniformsSetClbk(unif_name, Clbk, params);
}




export function Particles_gen_gfx_ctx(emitter, parent = null, specific_vb_groupidx) {

   if (!parent) console.error('4431623 \nEmmiter should have a parent mesh.')

   emitter.parent = parent;
   const FLAGS = GFX_CTX_FLAGS.PRIVATE;
   emitter.gfx = Gfx_generate_context_for_particle_system(FLAGS, emitter, _, specific_vb_groupidx,);
   emitter.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, emitter.gfx.vb.groupidx);

   // emitter.per_vb_bufferidx = Mesh_per_vb_store_mesh(emitter.gfx.vb.groupidx, emitter.mesh_bufferidx);


   // TODO: Temporary implementation of assigning the correct gfx update function pointer

   if (emitter.sid.fx & SID.SHAD.FN_EXPLOSION_CIRCLE) {
      if (emitter.sid.attr & SID.ATTR.FEATHER) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_vpos2_dim2_style2_time;
      else emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_dim2_style1_time;
   }
   else if (emitter.sid.fx & SID.FX.FS_NOISE) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_vpos2_dim2_time;
   else if (emitter.sid.attr & SID.ATTR.GENERIC2 && emitter.sid.attr & SID.ATTR.R_CORNERS) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_vpos2_dim2_style1_time_generic2;
   else if (emitter.sid.attr & (SID.ATTR.GENERIC2)) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_vpos2_dim2_time_generic2;
   else if (emitter.sid.attr & SID.ATTR.TEX2) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_vpos2_dim2_tex2_rot4;
   else if (emitter.sid.attr & (SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.TIME)) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_dim2_style1_time;
   // else if (emitter.sid.attr & (SID.ATTR.DIM2 | SID.ATTR._R_CORNERS)) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos4_dim2_style1_time;
   else alert('Particles-System: No VertexBufferFillOperation function selected.')


   return emitter.gfx.vb.groupidx;
}




// TODO: pass an already created sid, for selecting from a gama of shader particles
export function Particle_system_create_emitter(name, col, pos, dim, t_step, life_time, accel, deccel, gravity, max_speed, texture_id, num_particles_per_frame) {

   const emitter = new Emitter(name, col, pos, dim, t_step, life_time, accel, deccel, gravity, max_speed, texture_id, num_particles_per_frame);

   const idx = _emitters.Add(emitter);

   _emitters.buffer[idx].idx = idx;


   return idx;
}





export function Particle_system_emitt(params) {

   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Particles);

   const len = params.params.target_params.length;
   for (let i = 0; i < len; i++) {

      const emitter_idx = params.params.target_params[i]
      const emitter = _emitters.buffer[emitter_idx];
      let last_elem = emitter.free_particles_idxs_buffer.boundary;

      const has_intermidiate_emission = emitter.has_intermidiate_emission;

      // Case emitter has been deactivated (if all of its particles animations have been stoped)
      if (!emitter.is_active) {

         emitter.is_active = true;
         Renderqueue_set_active(emitter.gfx.vb.groupidx, true);
         // console.error('Renderqueue ACTIVATED')
      }

      // let is_particle_created = false;



      /**
       * 'has_intermidiate_emission'
       * Fill big position gaps (created by great movement speed) with particles
       * 
       * Calculate the magnitude of the prev and curent pos
       * if the difference is greater than a preffered distance:
       *    reduce the magnitude by a threshold distance
       *    the angle is calculated from atan2(x,y)
       *    calculate the particle position with pos = [magnitude*sin(angle), magnitude*cos(angle)]
       *    create new particle at that position
       *    repeat until the magnitude-distance is 0
       * 
      */

      let mag = 0, // The vector magnitude of the difference of the previous and current emitter position
         angle = 0,
         intermediate_num_particles = 0, // Store the number of total particles to be created in a frame
         dist = 0, // A minimum distance in which a particle must be created
         mag_partition = 0; // This will cary the next reduced magnitude distance

      if (has_intermidiate_emission) {

         const y = emitter.pos[1]
         const x = emitter.pos[0]
         const pos_dif = [emitter.prev_pos[0] - x, emitter.prev_pos[1] - y];
         angle = Math.atan2(pos_dif[0], pos_dif[1])
         mag = Magnitude(pos_dif[0], pos_dif[1]);

         mag += emitter.left_over;

         // const dist = 2;
         dist = emitter.dim[0] / 6;
         const ratio = mag / dist;
         intermediate_num_particles = Floor(ratio);
         emitter.left_over = ratio - intermediate_num_particles; // Save any fraction value of the distance magnitude for later use

         if (intermediate_num_particles === 0) intermediate_num_particles = 1; // Emitt a particle at least once per frame

         // emitter.mat.col = GetSequencedColor();

      }




      const stored_pos = [emitter.pos[0], emitter.pos[1]]; // Store the emitters's pos to re-set it

      // Choise: If has intermidiate_emission, calculate the num particles from the prev_pos-pos magnitude. Else use the 'num_particles_per_frame' variable
      const num_particles = has_intermidiate_emission ? intermediate_num_particles : emitter.num_particles_per_frame;


      for (let j = 0; j < num_particles; j++) {
         // for (let j = 0; j < 1; j++) {


         if (has_intermidiate_emission) {

            const new_pos = [(mag_partition * Math.sin(angle)), (mag_partition * Math.cos(angle))];
            emitter.pos[0] = stored_pos[0] + new_pos[0];
            emitter.pos[1] = stored_pos[1] + new_pos[1];
            emitter.time = emitter.t_step * j;
         }

         if (last_elem === INT_NULL) {

            const particle = new Particle(emitter);
            const particle_idx = emitter.particles_buffer.Add(particle);
            particle.is_alive = true;

            emitter.ParticleAddToGfx(particle_idx);

         }
         else {

            const particle_idx = emitter.free_particles_idxs_buffer.buffer[last_elem];
            const particle = emitter.particles_buffer.buffer[particle_idx];

            if (particle !== undefined) {

               particle.is_alive = true;

               // particle.accel = emitter.accel;
               particle.deccel = emitter.deccel;
               particle.grav = emitter.gravity;

               // particle.scale = initial_scale;
               particle.scale = emitter.max_scale;

               if (has_intermidiate_emission) particle.time = emitter.t_step * j;
               // else particle.time = 0;
               else particle.time = emitter.time;
               // particle.col[3] -= .2*j;

               particle.pos[0] = emitter.pos[0];
               particle.pos[1] = emitter.pos[1];

               particle.dim[0] = emitter.dim[0];
               particle.dim[1] = emitter.dim[1];

               particle.col[0] = emitter.mat.col[0];
               particle.col[1] = emitter.mat.col[1];
               particle.col[2] = emitter.mat.col[2];
               particle.col[3] = emitter.mat.col[3];

               if (emitter.properties_flags & PARTICLES.HAS_START_POS_VARIATION) {

                  const dir = Random_coordinates(emitter.variation_emission.xdir_neg, emitter.variation_emission.xdir_pos, emitter.variation_emission.ydir_neg, emitter.variation_emission.ydir_pos);
                  particle.dirx = dir.x;
                  particle.diry = dir.y;
                  particle.accel = emitter.accel * (Abs(particle.random_val) * .5 + 1) * 1.4;

               }
               if (emitter.properties_flags & PARTICLES.HAS_RANDOM_POLAR_COORD) {

                  const dir = Polar_coordinates()
                  particle.dirx = dir.x;
                  particle.diry = dir.y;

                  particle.accel = emitter.accel * (particle.random_val * 100 + 100) * .001;
                  // particle.accel = emitter.accel * (particle.random_val * 50 + 50) * .002;

               }

               // emitter.free_particles_idxs_buffer.RemoveByIdx(last_elem);
               emitter.free_particles_idxs_buffer.RemoveByIdxSortedVersionLastElemGuarantee();
               last_elem = emitter.free_particles_idxs_buffer.boundary
            }
            else {
               console.error('0099890099889 UNDEFINED')
            }
         }

         // increment to the next position
         mag_partition += dist;
      }


      // emitter.left_over += mag;
      // emitter.left_over += mag-mag_partition;


      emitter.pos[0] = stored_pos[0];
      emitter.pos[1] = stored_pos[1];
      emitter.prev_pos[0] = emitter.pos[0];
      emitter.prev_pos[1] = emitter.pos[1];
      // if (is_particle_created) {

      //    emitter.pos[0] = stored_pos[0];
      //    emitter.pos[1] = stored_pos[1];

      //    emitter.prev_pos[0] = emitter.pos[0];
      //    emitter.prev_pos[1] = emitter.pos[1];
      // }

   }

   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Particles);

}

export function Particle_system_update() {

   if (_emitters.active_count === 0) return;

   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Particles2);

   for (let i = 0; i <= _emitters.boundary; i++) {

      const emitter = _emitters.buffer[i];

      if (!emitter.is_active) continue;

      let needs_update = false;

      for (let j = 0; j <= emitter.particles_buffer.boundary; j++) {

         const particle = emitter.particles_buffer.buffer[j];

         if (particle.is_alive) {

            // TODO: For efficiency create 2 loops, and check which case is without if statement
            if (emitter.properties_flags & (PARTICLES.HAS_START_POS_VARIATION | PARTICLES.HAS_RANDOM_POLAR_COORD)) {
               const speed = emitter.speed * particle.accel;
               particle.pos[0] += speed * particle.dirx;
               particle.pos[1] += speed * particle.diry;

               particle.pos[1] += particle.grav;
               particle.grav += emitter.gravity * emitter.deccel;

               particle.accel *= emitter.deccel;
            }

            if (emitter.properties_flags & PARTICLES.HAS_JIGGLE) {

               // TODO: Make jiggle slower. Must include time, expand the jiggle through frames
               const jigglex = emitter.jigglex;
               const jiggley = emitter.jiggley;
               const x = GetRandomInt(particle.pos[0] - jigglex, particle.pos[0] + jigglex);
               particle.pos[0] += (x - particle.pos[0]) * .2;
               const y = GetRandomInt(particle.pos[1] - jiggley, particle.pos[1] + jiggley);
               particle.pos[1] += (y - particle.pos[1]) * .2;


               { // Effect:{Jiggle in}
                  // const x = GetRandomInt(1, 20);
                  // const y = GetRandomInt(1, 30);
                  // particle.pos[0] += (x-particle.pos[0]*.03)*.2;
                  // particle.pos[1] += (y-particle.pos[1]*.038)*.2;

                  // const x = GetRandomInt(-10, 20);
                  // particle.pos[0] += (x-particle.pos[0]*.038)*.2;
                  // const y = particle.pos[1] + GetRandomInt(-20, 20);
                  // particle.pos[1] += (y-particle.pos[1]*1.)*1.;
                  // particle.pos[0] += (x-particle.pos[0]*.1)*1.;
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
            }

            if (emitter.properties_flags & PARTICLES.HAS_ROTATION) {

               // let rotspeed = (emitter.life_time > (particle.time + .8) * .9) * .1
               let rotspeed = (emitter.life_time > (particle.time + .8) * .9) * .1
                  ? (emitter.life_time - (particle.time + .8) * .9) * .1
                  : (((particle.time + .8) * .9) * .1) - emitter.life_time;
               if (rotspeed > 0) particle.angle -= rotspeed * 1.;
               particle.rot = Rotation_z_get_2D_matrix(particle.angle);
            }

            if (emitter.properties_flags & PARTICLES.HAS_SCALE) {
               // For smoke enlarge effect 
               particle.dim[0] *= particle.scale * .0055 + 1;
               particle.dim[1] *= particle.scale * .0055 + 1;
               // if(j===0) console.log(particle.dim[0])
               if (particle.scale > 1.00) {
                  particle.scale *= .98;
               }
            }

            // Particle Fade: For smoke effect. 
            if (emitter.properties_flags & PARTICLES.HAS_FADE) {
               const random = Math.random() * .4 + .5;
               if (particle.time > random) {
                  particle.col[3] *= .85;
               }
            }


            // emitter.Particle_update_position(emitter, particle);
            // emitter.Particle_update_jiggle(emitter, particle);
            // emitter.Particle_update_rotation(emitter, particle);
            // emitter.Particle_update_scale(emitter, particle);
            // emitter.Particle_update_fade(emitter, particle);


            if (particle.time >= .99) particle.col[3] = 0.0;
            // Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Particles2);

            // Render Particles
            emitter.UpdateGfxBuffersFn(emitter.gfx.vb.groupidx, particle.start, particle.col, particle.pos, particle.time, particle.dim, particle.rot, particle.uv);

            // Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Particles2);

            particle.time += emitter.t_step;

            if (particle.time >= emitter.life_time) {

               // Reset particle for reuse
               particle.is_alive = false;
               // particle.time = 0;
               particle.time = emitter.time;

               emitter.free_particles_idxs_buffer.Add(j);

               if (emitter.free_particles_idxs_buffer.boundary === emitter.particles_buffer.boundary) {

                  emitter.is_active = false;
                  Renderqueue_set_active(emitter.gfx.vb.groupidx, false);
                  // console.error('Renderqueue DEACTIVATED')
               }

               // rotation_speed = initial_rotation_speed;

            }

            needs_update = true;
         }
      }

      if (needs_update) Vertex_buffer_state_enable(_emitters.buffer[i].gfx.vb.groupidx, _emitters.buffer[i].gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);


   }

   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Particles2);


}

// Emitter function pointers to update particle functions. It is to replace any if statements inside the 'Update loop'
function Particle_update_position(emitter, particle) {
   const speed = emitter.speed * particle.accel;
   particle.pos[0] += speed * particle.dirx;
   particle.pos[1] += speed * particle.diry;

   particle.pos[1] += particle.grav;
   particle.grav += emitter.gravity * emitter.deccel;

   particle.accel *= emitter.deccel;
}
function Particle_update_jiggle(emitter, particle) {

   // TODO: Make jiggle slower. Must include time, expand the jiggle through frames
   const jigglex = emitter.jigglex;
   const jiggley = emitter.jiggley;
   const x = GetRandomInt(particle.pos[0] - jigglex, particle.pos[0] + jigglex);
   particle.pos[0] += (x - particle.pos[0]) * .2;
   const y = GetRandomInt(particle.pos[1] - jiggley, particle.pos[1] + jiggley);
   particle.pos[1] += (y - particle.pos[1]) * .2;


   { // Effect:{Jiggle in}
      // const x = GetRandomInt(1, 20);
      // const y = GetRandomInt(1, 30);
      // particle.pos[0] += (x-particle.pos[0]*.03)*.2;
      // particle.pos[1] += (y-particle.pos[1]*.038)*.2;

      // const x = GetRandomInt(-10, 20);
      // particle.pos[0] += (x-particle.pos[0]*.038)*.2;
      // const y = particle.pos[1] + GetRandomInt(-20, 20);
      // particle.pos[1] += (y-particle.pos[1]*1.)*1.;
      // particle.pos[0] += (x-particle.pos[0]*.1)*1.;
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
}
function Particle_update_rotation(emitter, particle) {
   let rotspeed = (emitter.life_time > (particle.time + .8) * .9) * .1
      ? (emitter.life_time - (particle.time + .8) * .9) * .1
      : (((particle.time + .8) * .9) * .1) - emitter.life_time;
   if (rotspeed > 0) particle.angle -= rotspeed * 1.;
   particle.rot = Rotation_z_get_2D_matrix(particle.angle);
}
function Particle_update_scale(emitter, particle) {
   // For smoke enlarge effect 
   particle.dim[0] *= particle.scale * .0055 + 1;
   particle.dim[1] *= particle.scale * .0055 + 1;
   // if(j===0) console.log(particle.dim[0])
   if (particle.scale > 1.00) {
      particle.scale *= .98;
   }
}
function Particle_update_fade(emitter, particle) {
   const random = Math.random() * .4 + .5;
   if (particle.time > random) {
      particle.col[3] *= .85;
   }
}
function Particle_update_position_empty() { }
function Particle_update_jiggle_empty() { }
function Particle_update_rotation_empty() { }
function Particle_update_scale_empty() { }
function Particle_update_fade_empty() { }


export function Particle_system_emitter_set_size(emitter_idx, size) {

   _emitters.buffer[emitter_idx].dim[0] = size;
   _emitters.buffer[emitter_idx].dim[1] = size;
}
export function Particle_system_emitter_add_size_xy(emitter_idx, sizex, sizey) {

   _emitters.buffer[emitter_idx].dim[0] += sizex;
   _emitters.buffer[emitter_idx].dim[1] += sizey;
}
export function Particle_system_emitter_get_size(emitter_idx) {

   return _emitters.buffer[emitter_idx].dim[0];
}
export function Particle_system_emitter_set_position_xy(emitter_idx, x, y) {

   // _emitters.buffer[emitter_idx].prev_pos[0] = _emitters.buffer[emitter_idx].pos[0];
   // _emitters.buffer[emitter_idx].prev_pos[1] = _emitters.buffer[emitter_idx].pos[1];
   _emitters.buffer[emitter_idx].pos[0] = x;
   _emitters.buffer[emitter_idx].pos[1] = y;
}
export function Particle_system_emitter_set_position_x(emitter_idx, x) {
   _emitters.buffer[emitter_idx].pos[0] = x;
}
export function Particle_system_emitter_set_prev_position_xy(emitter_idx) {

   _emitters.buffer[emitter_idx].prev_pos[0] = _emitters.buffer[emitter_idx].pos[0];
   _emitters.buffer[emitter_idx].prev_pos[1] = _emitters.buffer[emitter_idx].pos[1];
}
export function Particle_system_emitter_get_position_xy(emitter_idx) {

   return _emitters.buffer[emitter_idx].pos;
}
export function Particle_system_emitter_enable_intermidiate_emission(emitter_idx) {

   return _emitters.buffer[emitter_idx].has_intermidiate_emission = true;
}



/****************************************************************************************************************************************************************/
// Function Pointers
function Emitter_particles_set_direction_emission(emitter) {

}
function Emitter_particles_set_direction_explosio(emitter) {

}























/*********************************************************************************************************/
// DEBUG-PRINT



// Print the widget groups buffer
export function Particle_system_print_info() {


   console.log('_emitters:\n count:', _emitters.active_count, 'size', _emitters.size)
   for (let i = 0; i <= _emitters.boundary; i++) {

      const emitter = _emitters.buffer[i];
      const parent = (emitter.parent !== null) ? emitter.parent.GetName() : 'null'

      console.log('emitter:', i, 'name:', Str_buffer_get_by_idx(emitter.nameidx),
         '\nindex:', emitter.idx,
         'sid:', emitter.sid,
         '\nroot_pos:', emitter.root_posidx,
         // 'temp_unif_wpos:', emitter.temp_unif_wpos,
         '\nprog:', emitter.gfx.prog.idx, 'vb:', emitter.gfx.vb.groupidx, 'ib:', emitter.gfx.ib.idx, 'attribsPerVertex:', emitter.gfx.attribsPerVertex,
         '\nparent:', parent,
         '\ncolor:', emitter.mat.col,
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
      );
   }
}
















