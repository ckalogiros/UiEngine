"use strict";

import { Sid_check_unif_match_sids } from "../../GlobalFunctions.js";
import { Vertex_buffer_render_group_set_count_from_num_faces, Vertex_buffer_render_group_set_draw_count_from_num_faces, Vertex_buffer_render_group_set_num_faces, Vertex_buffer_render_group_set_state } from "../../Graphics/Buffers/RenderGroups.js";
import { Uniforms_buffer_find_ubidx_from_name } from "../../Graphics/Buffers/UniformBuffers.js";
import { Vertex_buffer_set_uniform_value_callback, Vertex_buffer_set_and_update_uniform, Vertex_buffer_add_vertices_from_render_group, Vertex_buffer_init_vertices_for_particles, Vertex_buffer_group_set_mesh_debug_name } from "../../Graphics/Buffers/VertexBuffers.js";
import { Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_tex2_with_rotation, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time_generic2, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time_generic2, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Program_store_shader_operations } from "../../Graphics/ShaderPrograms.js";
import { GetRandomInt, GetSign } from "../../Helpers/Helpers.js";
import { Abs, Floor, Hash, Magnitude } from "../../Helpers/Math/MathOperations.js";
import { Rotation_z_get_2D_matrix } from "../../Helpers/Math/Matrix.js";
import { New_generic_buffer, New_int8_buffer } from "../Core/Buffers.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../Core/MeshUniformsBuffer.js";
import { Str_buffer_get_by_idx } from "../Core/StringBuffer.js";
import { View_add_mesh, View_create_new_group, View_render_specific_render_group } from "../Core/Views/MeshBufferViews.js";
import { Material, Material_Texture } from "../Drawables/Material/Material.js";
import { Mesh_get_name, Mesh_set_name } from "../Drawables/Operations/MeshPropertiesFunctions.js";
import { Gfx_generate_context } from "../Interfaces/Gfx/MeshGfxContext.js";
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
 */

/**
 * Particles number aproximation
 * 
 * aprox: particle/frame * lifetime/frame
 * Then add some more: Floor(1.1*aprox) + 1
 */

const speed = 4;
const rand_max = 210;
const interpolate = 1 / rand_max;


class Int32_Buffer_Reversed {

   constructor(size) {
      this.buffer = new Int32Array(size);
      this.size = size;
      this.count = 0;
      this.pos = 0;

      for(let i=0; i<=this.size-1; i++) {
         this.buffer[i] = INT_NULL;
      }
   }
   Add(idx) {  // populate free particles buffer from start to size
      this.buffer[this.count] = idx;
      this.count++;
   }
   AddFree(idx) { // Add free particle to free position
      
      this.pos--;
      // console.log('Free', this.pos, idx);
      // console.log('Free', idx);
      this.buffer[this.pos] = idx;
      this.count++;
   }
   GetNextFree() { // Get most left free particle 

      if(this.pos < 0 || this.pos >= this.size) {
         console.error('Particle index out of bounds: this.pos', this.pos)
         // alert()
         return undefined;
      }

      // console.log('Add', this.pos, this.buffer[this.pos]);
      // console.log('Add', this.buffer[this.pos]);
      const freeidx = this.buffer[this.pos];
      this.buffer[this.pos] = -1;
      this.pos++;
      this.count--;
      return freeidx;
   }
}



function Polar_coordinates() {
   const rand_angle = GetRandomInt(0, 360);
   const dirx = Math.sin(rand_angle);
   const diry = Math.cos(rand_angle);
   return { x: dirx, y: diry, };
}
function Random_coordinates(xdir_neg, xdir_pos, ydir_neg, ydir_pos) {

   const minx = xdir_neg * rand_max
   const maxx = xdir_pos * rand_max
   const dx = GetRandomInt(minx, maxx);
   const dirx = (interpolate * dx) + .01053;

   const miny = ydir_neg * rand_max
   const maxy = ydir_pos * rand_max
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

      this.time = emitter.geom.time;
      this.generic = { a: emitter.geom.generic.a, b: emitter.geom.generic.b };
      // Deep Copy values from emitter
      this.pos[0] = emitter.geom.pos[0];
      this.pos[1] = emitter.geom.pos[1];
      this.pos[2] = emitter.geom.pos[2];

      this.dim[0] = emitter.geom.dim[0];
      this.dim[1] = emitter.geom.dim[1];

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
      // this.angle = (rnd * .5 + 2) * Math.PI * 2;
      this.angle = (rnd * 2.5 + 2) * Math.PI * 14;
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

function TEMP_number_of_particles_aproximation(life_time, t_step, num_particles, has_intermidiate_emission) {

   
   const total_particles_num = (life_time / t_step) * num_particles;
   // TODO: The ammount of extra particles can be aproximated only if we take into consideration the max speed(deriving the max number of particles being put in between the spaces)
   const extra_particles = has_intermidiate_emission ? total_particles_num*2 : 0;
   return Floor(total_particles_num)+100+extra_particles;
}

class Emitter {

   // constructor(mesh_bufferidx, name, col, pos, dim, t_step = .0001, life_time, accel = 1, deccel = .99, gravity = 0, max_speed = 2, texture_id = INT_NULL, num_particles_per_frame = 1, scale_down = 1) {
   constructor(mesh_bufferidx, properties) {

      this.sid = 0x0;
      this.sceneidx = STATE.scene.active_idx;
      this.root_posidx = INT_NULL;
      this.gfx = null;
      this.type = MESH_TYPE.PARTICLES;
      this.idx = INT_NULL;
      // this.name = properties.name;
      // this.nameidx = Str_buffer_store(properties.name);
      Mesh_set_name(this, properties.name);
      this.parent = null;
      this.mesh_bufferidx = mesh_bufferidx;


      this.dir = [0, 0];
      this.t_step = properties.t_step;
      this.life_time = properties.life_time;
      this.speed = speed;
      this.texidx = INT_NULL;


      this.state = {mask:0x0};

      this.accel = properties.accel;
      this.max_speed = properties.max_speed;
      this.deccel = properties.deccel;
      this.gravity = properties.gravity;
      this.max_scale = properties.max_speed;

      this.properties_flags = 0x0; // Set from user by method: EnableProperties()
      this.jigglex = 4;
      this.jiggley = 3;
      this.rotation = 0; // TODO: IMPLEMENT

      this.left_over = 0;
      this.total_alive = 0;

      this.UpdateGfxBuffersFn = null; // Function pointer to update the vertex buffer of the particle system

      // Set the cone of variation vector direction. Diagonals are -.5 and +.5 
      this.variation_emission = {
         xdir_pos: 1, // Right quadrant
         xdir_neg: 0, // Left quadrant
         ydir_pos: 1, // Lower quadrant
         ydir_neg: 0, // Upper quadrant
      }
      
      if(properties.is_continuous_emmit) {
         
         // this.vb_aprox_size = TEMP_number_of_particles_aproximation(properties.life_time, properties.t_step, properties.num_particles, properties.has_intermidiate_emission);
         this.vb_aprox_size = TEMP_number_of_particles_aproximation(properties.life_time, properties.t_step, properties.num_particles_per_frame, properties.has_intermidiate_emission);
      }
      else {
         
         this.vb_aprox_size = properties.num_particles_per_frame * properties.num_particles;
      }

      this.particles_buffer = New_generic_buffer(_, 'Particles - particles_buffer');
      // this.free_particles_idxs_buffer = New_int32_buffer(vb_aprox_size, 'ParticlesSystem-free_particles_idxs_buffer');
      
      this.shader_ops_idxs = New_int8_buffer(8, 'ParticleSystem.shader_ops_idxs');
      
      this.free_particles_idxs_buffer = new Int32_Buffer_Reversed(this.vb_aprox_size);

      this.vertex_buffer_start = 0;  // The start position in the vertex buffer(start may vary according to the first particle) 

      this.sid = {
         shad: SID.SHAD.INDEXED | SID.SHAD.INDEXED_PATT_DISCONTINUE_4,
         attr: SID.ATTR.COL4 | SID.ATTR.VPOS2 | SID.ATTR.WPOS3, // TODO: some attribs are activated in the 'Fn Enables'
         unif: 0x0,
         shad_ops: 0x0,
         pass: SID.ATTR.COL4,
         blend_options: 0x0,
         fx: 0x0,
      };


      const mat = (properties.texture_id === INT_NULL) ? new Material(properties.col) : new Material_Texture(properties.col, properties.texture_id);
      this.mat = mat;
      this.sid.attr |= mat.sid.attr;
      this.sid.unif |= mat.sid.unif;
      this.sid.shad |= mat.sid.shad;
      this.sid.pass |= mat.sid.pass;

      this.geom = {
         pos: properties.pos,
         prev_pos: [properties.pos[0], properties.pos[1]],
         dim: [properties.dim[0], properties.dim[1]],
         generic: { a: 0, b: 0 },
         time: 0,
         scale: [properties.scale_down, 1],
         num_faces:1,

      };

      this.attributes = null;

      this.uniforms = [];
      this.EnableGfxUniforms({ unif: SID.UNIF.PROJECTION_MATRIX }, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);
      this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

      this.group_bufferidxs = [INT_NULL, INT_NULL, INT_NULL, INT_NULL];
      this.group_bufferidxs[0] = View_create_new_group(this);

      this.num_particles_per_frame = properties.num_particles_per_frame;
      this.has_intermidiate_emission = properties.has_intermidiate_emission;


      // Initialize Function Pointers
      // Let them run an empty function instead of if statements in the update loop
      this.Particle_update_position = Particle_update_position_empty;
      this.Particle_update_jiggle = Particle_update_jiggle_empty;
      this.Particle_update_rotation = Particle_update_rotation_empty;
      this.Particle_update_scale = Particle_update_scale_empty;
      this.Particle_update_fade = Particle_update_fade_empty;

      console.log('#### Perticles-Size aproximation', this.vb_aprox_size );

   }
   ParticleAddToGfx(particle_idx) {

      // Must create geom struct to pass to the GlAdd...() fuunction
      const geom = {
         pos: this.particles_buffer.buffer[particle_idx].pos,
         dim: this.particles_buffer.buffer[particle_idx].dim,
         time: this.particles_buffer.buffer[particle_idx].time,
         generic: this.particles_buffer.buffer[particle_idx].generic,
      }
      // alert('99923836562545243523\n Vertex_buffer_add_vertices is DEPRECRATED')
      // const start = Vertex_buffer_add_vertices_from_reset(this.gfx, geom, this.mat, _);
      // const start = Vertex_buffer_add_vertices(this.gfx, geom, this.mat, _, _, true);
      const start = Vertex_buffer_add_vertices_from_render_group(this.gfx, geom, this.mat, _, Mesh_get_name(this));
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
      // console.log(this.shader_ops_idxs)
      // console.log(function_operation)
      this.shader_ops_idxs.Add(Program_store_shader_operations(function_operation, blend_mode));

      if ((function_operation & SID.SHADER_OPERATIONS.GROUP_SDF_RECT) && (this.sid.shad_ops & SID.SHADER_OPERATIONS.SDF_RECT) === 0) {
         console.error('Shader Operation detected: Need SDF_RECT to function.');
         alert('Shader Operation detected: Need SDF_RECT to function.');
      }

      if (function_operation & SID.SHADER_OPERATIONS.DIST_RECT_FILLED) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
      }
      if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
      }
      if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW2) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
      }
      if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
      }
      if (function_operation & SID.SHADER_OPERATIONS.BUBBLE) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
      }
      if (function_operation & SID.SHADER_OPERATIONS.FLARE) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
      }
      if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
      }
      if (function_operation & SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
      }
      if (function_operation & SID.SHADER_OPERATIONS.OUTER_GLOW_RECT) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
      }
      if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
      }
      if (function_operation & SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
      }
      if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2) {
         this.GfxEnableAttr(SID.ATTR.DIM2);
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
      }

   }
   GfxEnableAttr(flags, params) {

      if (flags & SID.ATTR.DIM2) { this.sid.attr |= SID.ATTR.DIM2; }
      if (flags & SID.ATTR.TEX2) { this.sid.attr |= SID.ATTR.TEX2; }
      if (flags & SID.ATTR.ANGLE) { this.sid.attr |= SID.ATTR.ANGLE; }
      if (flags & SID.ATTR.TIME) { this.sid.attr |= SID.ATTR.TIME; }
      if (flags & SID.ATTR.GENERIC2) { this.sid.attr |= SID.ATTR.GENERIC2; }
      if (flags & SID.ATTR.R_CORNERS) { this.sid.attr |= SID.ATTR.R_CORNERS; }
      if (flags & SID.ATTR.COL4_PER_VERTEX) this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;

      if (params) {

         if (params.time) { this.geom.time = params.time; }
         if (params.generic) { this.geom.generic = params.generic; }
         if (params.rcorners) this.mat.style.rcorners = params.rcorners;
         if (params.col4_per_vertex) { this.mat.col = params.col4_per_vertex; }
      }

   }
   GfxPassAttr(flags) {

      if (flags & SID.ATTR.VPOS2) this.sid.pass |= SID.ATTR.VPOS2;
      if (flags & SID.ATTR.DIM2) { this.sid.pass |= SID.ATTR.DIM2; }
      if (flags & SID.ATTR.WPOS2) this.sid.pass |= SID.ATTR.WPOS2;
      if (flags & SID.ATTR.WPOS3) this.sid.pass |= SID.ATTR.WPOS3;
      if (flags & SID.ATTR.TEX2) { this.sid.pass |= SID.ATTR.TEX2; }
      if (flags & SID.ATTR.RES2) this.sid.pass |= SID.ATTR.RES2;
      if (flags & SID.ATTR.TIME) { this.sid.pass |= SID.ATTR.TIME; }
      if (flags & SID.ATTR.ANGLE) { this.sid.pass |= SID.ATTR.ANGLE; }
      if (flags & SID.ATTR.R_CORNERS) { this.sid.pass |= SID.ATTR.R_CORNERS; }
      if (flags & SID.ATTR.GENERIC2) { this.sid.pass |= SID.ATTR.GENERIC2; }
      if (flags & SID.ATTR.COL4_PER_VERTEX) { this.sid.pass |= SID.ATTR.COL4_PER_VERTEX; }

   }
   GfxEnableBlend(blend_flags) {
      this.sid.blend_options |= blend_flags;
   }
   GfxEnableFn(flags, params) {


      // Enable shader function calls (from shader main())
      if (flags === SID.SHAD.FN_GLOW) {
         if (params === undefined) alert('Enable shader FN_GLOW needs \'time\' parameter.\nBut no parameters are passed to \'GfxEnableFn()\'');
         const param = { // Create default attribs values
            time: params.time !== undefined ? params.time : 0,
         };
         this.sid.shad |= SID.SHAD.FN_GLOW;
         this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
         this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
      }
      // TODO: See if attr enable and passes are required, It seems NOT
      if (flags === SID.SHAD.FN_INNER_SHADOW) {
         this.sid.shad |= SID.SHAD.FN_INNER_SHADOW;
         this.GfxEnableAttr(SID.ATTR.DIM2,); // Enable attribute and store attribs value to cuurrent mesh
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
      }
      if (flags === SID.SHAD.FN_EXPLOSION_CIRCLE) {
         if (params === undefined) alert('Enable shader FN_EXPLOSION_CIRCLE needs: \'time, generic.a, generic.b\' parameters.\nBut no parameters are passed to \'GfxEnableFn()\'');
         const param = { // Create default attribs values
            time: params.time !== undefined ? params.time : 0,
            generic: params.generic !== undefined ? params.generic : { a: 1, b: 1 },
         };
         this.sid.shad |= SID.SHAD.FN_EXPLOSION_CIRCLE;
         this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2, param); // Enable attribute and store attribs value to cuurrent mesh
         this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.GENERIC2 | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
      }
      if (flags === SID.SHAD.FN_EXPLOSION_GLOW) {
         if (params === undefined) alert('Enable shader FN_EXPLOSION_GLOW needs: \'time, generic.a, generic.b\' parameters.\nBut no parameters are passed to \'GfxEnableFn()\'');
         const param = { // Create default attribs values
            time: params.time !== undefined ? params.time : 0,
            // generic: params.generic !== undefined ? params.generic : { a: 1, b: 1 },
         };
         this.sid.shad |= SID.SHAD.FN_EXPLOSION_GLOW;
         this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
         this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
      }
      if (flags === SID.SHAD.FN_GLOW_SPHERE) {
         this.sid.shad |= SID.SHAD.FN_GLOW_SPHERE;
         this.GfxEnableAttr(SID.ATTR.DIM2,); // Enable attribute and store attribs value to cuurrent mesh
         this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
      }
      if (flags === SID.SHAD.FN_NOISE) {
         if (params === undefined) alert('Enable shader FN_NOISE needs \'time\' parameter.\nBut no parameters are passed to \'GfxEnableFn()\'');
         const param = { // Create default attribs values
            time: params.time !== undefined ? params.time : 0,
         };
         this.sid.shad |= SID.SHAD.FN_NOISE;
         this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
         this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.DIM2 | SID.ATTR.WPOS3,); // Enable pass of the attributes to fragment shader
      }
      if (flags === SID.SHAD.FN_NOISE_WORLEY_1) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_1; }
      if (flags === SID.SHAD.FN_NOISE_WORLEY_2) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_2; }
      if (flags === SID.SHAD.FN_NOISE_WORLEY_3_TYPES) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_3_TYPES; }
      if (flags === SID.SHAD.FN_NOISE_WORLEY_3D) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_3D; }
      if (flags === SID.SHAD.FN_NOISE_VORONOI_1) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_1; }
      if (flags === SID.SHAD.FN_NOISE_VORONOI_2) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_2; }

      if (params !== undefined) {
         if (params.blend_mode !== undefined) {
            this.sid.blend_options |= params.blend_mode;
         }
      }

      // TODO
      // case MESH_ENABLE.GFX.BLEND_OPTIONS: { if (params === null) alert('BLEND_OPTIONS MUST be passed in the params'); this.sid.blend_options |= params; break; }
      // case MESH_ENABLE.GFX.TEST_SHADERS_1: { this.sid.shad |= SID.SHAD.FS_TEST1; this.sid.shad |= SID.SHAD.FS_TEST1; break; }
      // case MESH_ENABLE.GFX.TEST_SHADERS_2: { this.sid.shad |= SID.SHAD.FS_TEST2; this.sid.shad |= SID.SHAD.FS_TEST2; break; }
      // case MESH_ENABLE.GFX.TEST_SHADERS_3: { this.sid.shad |= SID.SHAD.FS_TEST3; this.sid.shad |= SID.SHAD.FS_TEST3; break; }
      // case MESH_ENABLE.GFX.TEST_SHADERS_4: { this.sid.shad |= SID.SHAD.FS_TEST4; this.sid.shad |= SID.SHAD.FS_TEST4; break; }
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

      if (flags) {

         if (flags.unif) this.sid.unif |= flags.unif;
         if (flags.pass) this.sid.pass |= flags.pass;
         // if (flags.fx) this.sid.fx |= flags.fx;
      }

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
   SetClbkGfxUniforms(unif_name, Clbk, clbk_params) {

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

            // console.error('ubidx is INT_NULL. SEE if the uniform of this mesh has already been initialized for the vertex buffer.');

            this.uniforms[found_idx].ubidx = Uniforms_buffer_find_ubidx_from_name(this.uniforms[found_idx].name, this.gfx.vb.groupidx)

            if (this.uniforms[found_idx].ubidx === INT_NULL) {
               // alert('51998712223 \nUniform Not Found')
               return;
            }
         }

         // this.uniforms[found_idx].vertex_buffer_store_idx = Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx);
         Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx, this.uniforms[found_idx].name);
         return;
      }


      // Alert if the current mesh system does not have the uniform enabled.
      console.error('No Uniform ', unif_name, ' found for mesh:', Mesh_get_name(this));
      if (Sid_check_unif_match_sids(this.sid.unif, unif_name) === true) {

         alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js\nSEE ERROR')
      }


   }
   GfxUniformSetAndUpdate(unif_name, value, value_idx = null) {

      /**ERROR */ if (this.gfx === null) alert('Try to update uniform before mesh has gfx.')

      const len = this.uniforms.length;
      for (let i = 0; i < len; i++) {
         if (this.uniforms[i].name === unif_name) {
            const ubidx = this.uniforms[i].ubidx;
            if (ubidx === INT_NULL) {


               console.error('334334334334 ubidx is null.',
                  '\nPossible error: mesh is not the root mesh of the vertex buffer, and there is no ubidx store that is why ubidx is null',
                  '\nuniform name', unif_name,
                  '\nubidx', ubidx,
                  '\nmesh all uniforms', this.uniforms,

               )
               alert('334334334334 ubidx is null. Check if mesh is the root mesh of the vertex buffer')
            }
            Vertex_buffer_set_and_update_uniform(this.gfx.vb.groupidx, ubidx, value, value_idx);
            break;
         }
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
      console.error('No Uniform ', unif_name, ' found for mesh:', Mesh_get_name(this));
      if (Sid_check_unif_match_sids(this.sid.unif, unif_name) === true) {
         alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js\nSEE ERROR')
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
   SetVbStartIndex(vb_startidx) {
      this.vertex_buffer_start = vb_startidx;
   }
   // TODO: Implement Destroy for Emmiters AND add Destroy for the buffers(M_, Int8, Int16)
   GetName() {
      return Str_buffer_get_by_idx(this.nameidx);
   }

}




const _emitters = New_generic_buffer(_, 'Particle System: Emitter buffer');
/** */
export function Particles_system_reset() { return _emitters.ResetFull(); }
/** */
export function Particles_get_particle_system(idx) { return _emitters.buffer[idx]; }
/**
 * 
 * @param {*} emitteridx 
 * @param {*} unif_name 
 * @param {*} Clbk 
 * @param {*} clbk_params : These are the parameters for the callback function
 * @param {*} val_idx : The index of the uniform element to access. E.x. If uniform is vec3, then an index of 0 will access the first element
 * @param {*} start_val : Set a start value from which the changes(from a slider) will take effect
 * @param {*} rand_max : Set the maximum value that the uniform value will take
 */
export function Particles_gfx_uniforms_set_clbk(emitteridx, unif_name, Clbk, clbk_params, val_idx = null, start_val = 0, rand_max = 1) {

   const emitter = _emitters.buffer[emitteridx];
   const params = {
      slider: clbk_params,
      vb_grouidx: emitter.gfx.vb.groupidx,
      val_idx: val_idx,
      rand_max: rand_max,
      start_val: start_val,
   }
   emitter.GfxUniformsSetClbk(unif_name, Clbk, params);
}





/** */
// TODO: pass an already created sid, for selecting from a gama of shader particles
export function Particle_system_create_emitter(mesh_bufferidx, properties) {

   const emitter = new Emitter(mesh_bufferidx, properties);
   const idx = _emitters.Add(emitter);
   _emitters.buffer[idx].idx = idx;

   return emitter;
}
/** */
export function Particles_gen_gfx_ctx(emitter, parent = null, specific_vb_groupidx) {

   if (!parent) console.error('4431623 \nEmmiter should have a parent mesh.')

   const pos_x = emitter.geom.pos[0];
   const pos_y = emitter.geom.pos[1];
   emitter.geom.pos[0] = 0;
   emitter.geom.pos[1] = 0;
   
   emitter.parent = parent;
   const FLAGS = GFX_CTX_FLAGS.PRIVATE;
   const ret = Gfx_generate_context(FLAGS, emitter, specific_vb_groupidx, true, emitter.vb_aprox_size);
   emitter.gfx = ret.gfx;
   emitter.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, emitter.gfx.vb.render_groupidx);
   // Add to view group
   View_add_mesh(emitter.group_bufferidxs[0], emitter, ret.is_root_widget_on_reused_vb);

   emitter.geom.pos[0] = pos_x;
   emitter.geom.pos[1] = pos_y;

   // TODO: Temporary implementation of assigning the correct gfx update function pointer
   // TODO: Implement an Abstract function to not use function pointer 
   if (emitter.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time_generic2;
   else if (emitter.sid.shad & SID.SHAD.FN_GLOW_SPHERE) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner;
   else if (emitter.sid.shad & SID.SHAD.FN_NOISE) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time;
   else if (emitter.sid.attr & SID.ATTR.GENERIC2 && emitter.sid.attr & SID.ATTR.R_CORNERS) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time_generic2;
   else if (emitter.sid.attr & (SID.ATTR.GENERIC2)) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time_generic2;
   else if (emitter.sid.attr & SID.ATTR.TEX2) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_tex2_with_rotation;
   else if (emitter.sid.attr & (SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.TIME)) emitter.UpdateGfxBuffersFn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time;
   else alert('Particles-System: No VertexBufferFillOperation function selected.');

   Vertex_buffer_group_set_mesh_debug_name(emitter.gfx.vb.groupidx, emitter.name);
   
   return emitter.gfx.vb.groupidx;
}
/** */
export function Particle_system_init_particles(emitter) {
   
   // Pre_init particles
   for(let i=0; i < emitter.vb_aprox_size; i++) {

      const particle = new Particle(emitter);
      const particle_idx = emitter.particles_buffer.Add(particle);

      const start = Vertex_buffer_init_vertices_for_particles(emitter.gfx, emitter.mat.texidx)
      emitter.particles_buffer.buffer[particle_idx].SetGfxStart(start);

      // Add to free particles
      emitter.free_particles_idxs_buffer.Add(particle_idx);
   }

   Vertex_buffer_render_group_set_num_faces(emitter.gfx.vb.render_groupidx, emitter.particles_buffer.boundary+1);
   Vertex_buffer_render_group_set_draw_count_from_num_faces(emitter.gfx.vb.render_groupidx, emitter.particles_buffer.boundary+1);
   Vertex_buffer_render_group_set_count_from_num_faces(emitter.gfx.vb.render_groupidx, emitter.particles_buffer.boundary+1);
   // emitter.SetVbStartIndex(0);
   // Vertex_buffer_render_group_set_start(emitter.gfx.vb.render_groupidx, emitter.vertex_buffer_start)
      
   View_render_specific_render_group(emitter.group_bufferidxs[0], emitter.group_bufferidxs[1], emitter.group_bufferidxs[2])

   console.log('+++++++++++++++++++++++++++++\nParticles Free Buffer:',emitter.free_particles_idxs_buffer)

}
/** */
export function Particle_system_emitt(params) {

   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Particles);

   const len = params.params.target_params.length;
   for (let i = 0; i < len; i++) {

      const emitter_idx = params.params.target_params[i]
      const emitter = _emitters.buffer[emitter_idx];

      const has_intermidiate_emission = emitter.has_intermidiate_emission;
      
      // Case emitter has been deactivated (if all of its particles animations have been stoped)
      if ((emitter.state.mask & MESH_STATE_FLAGS.ACTIVE) === 0) {

         emitter.state.mask |= MESH_STATE_FLAGS.ACTIVE;
         Renderqueue_set_active(emitter.gfx.vb.groupidx, true);
      }

      
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

         const y = emitter.geom.pos[1]
         const x = emitter.geom.pos[0]
         const pos_dif = [emitter.geom.prev_pos[0] - x, emitter.geom.prev_pos[1] - y];
         angle = Math.atan2(pos_dif[0], pos_dif[1])
         mag = Magnitude(pos_dif[0], pos_dif[1]);

         mag += emitter.left_over;

         dist = emitter.geom.dim[0] / 6;
         const ratio = mag / dist;
         intermediate_num_particles = Floor(ratio);
         emitter.left_over = ratio - intermediate_num_particles; // Save any fraction value of the distance magnitude for later use

         if (intermediate_num_particles === 0) intermediate_num_particles = 1; // Emitt a particle at least once per frame

      }


      const stored_pos = [emitter.geom.pos[0], emitter.geom.pos[1]]; // Store the emitters's pos to re-set it

      // Choise: If has intermidiate_emission, calculate the num particles from the prev_pos-pos magnitude. Else use the 'num_particles_per_frame' variable
      const num_particles = has_intermidiate_emission ? intermediate_num_particles : emitter.num_particles_per_frame;
      
      
      for (let j = 0; j < num_particles; j++) {
         
         if (has_intermidiate_emission) {
            
            const new_pos = [(mag_partition * Math.sin(angle)), (mag_partition * Math.cos(angle))];
            emitter.geom.pos[0] = stored_pos[0] + new_pos[0];
            emitter.geom.pos[1] = stored_pos[1] + new_pos[1];
            emitter.geom.time = emitter.t_step * j;
         }
         
         let next_free_particle_idx = emitter.free_particles_idxs_buffer.GetNextFree();
         const particle = emitter.particles_buffer.buffer[next_free_particle_idx];
         emitter.total_alive++;
         
         if (particle !== undefined) { // Reset particle to default values
            
            particle.is_alive = true;
            
            // particle.accel = emitter.accel;
            particle.deccel = emitter.deccel;
            particle.grav = emitter.gravity;
            
            particle.scale = emitter.max_scale;
            
            if (has_intermidiate_emission) particle.time = emitter.t_step * j;
            // else particle.time = 0;
            else particle.time = emitter.geom.time;
            // particle.col[3] -= .2*j;
            
            particle.pos[0] = emitter.geom.pos[0];
            particle.pos[1] = emitter.geom.pos[1];
            
            particle.dim[0] = emitter.geom.dim[0];
            particle.dim[1] = emitter.geom.dim[1];
            
            particle.col[0] = emitter.mat.col[0];
            particle.col[1] = emitter.mat.col[1];
            particle.col[2] = emitter.mat.col[2];
            particle.col[3] = emitter.mat.col[3];
            
            particle.generic.a = emitter.geom.generic.a;
            particle.generic.b = emitter.geom.generic.b;
            
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
            
         }
         else {
            // console.error('0099890099889 UNDEFINED', 
            //    'num_particles', num_particles, 
            //    'total_alive', emitter.total_alive,
            //    'next_free_particle_idx', next_free_particle_idx,
            // )
            return;
         }
         
         // increment to the next position
         mag_partition += dist;
      }
      
      emitter.geom.pos[0] = stored_pos[0];
      emitter.geom.pos[1] = stored_pos[1];
      emitter.geom.prev_pos[0] = emitter.geom.pos[0];
      emitter.geom.prev_pos[1] = emitter.geom.pos[1];
      
      
      // Vertex_buffer_render_group_set_num_faces(emitter.gfx.vb.render_groupidx, emitter.total_alive);
      // // Set DrawCount in the renderBuffer
      // Vertex_buffer_render_group_set_draw_count_from_num_faces(emitter.gfx.vb.render_groupidx, emitter.total_alive);
      // Vertex_buffer_render_group_set_count_from_num_faces(emitter.gfx.vb.render_groupidx, emitter.total_alive);
      // emitter.SetVbStartIndex(0);
      // Vertex_buffer_render_group_set_start(emitter.gfx.vb.render_groupidx, emitter.vertex_buffer_start)
      
   }

   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Particles);

}

/** */
export function Particle_system_update() {

   if (_emitters.active_count === 0) return;

   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Particles2);
   
   
   
   
   for (let i = 0; i <= _emitters.boundary; i++) {
      
      const emitter = _emitters.buffer[i];
      
      // if ((emitter.state.mask & MESH_STATE_FLAGS.ACTIVE)===0) continue;
      
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
               // In order to make the jiggle smoother, there must be a smooth interpolation between randomness
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

               let rotspeed = (emitter.life_time > (particle.time + .8) * .9) * .1
                  ? (emitter.life_time - (particle.time + .8) * .9) * .1
                  : (((particle.time + .8) * .9) * .1) - emitter.life_time;
               if (rotspeed > 0) particle.angle -= rotspeed * 1.;
               particle.rot = Rotation_z_get_2D_matrix(particle.angle);
               // let rotspeed = 4;
               // particle.rot = Rotation_z_get_2D_matrix((-particle.time)*rotspeed);
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

            /** Alternative NONE conditional upadate(with function pointers) */
            {
               // emitter.Particle_update_position(emitter, particle);
               // emitter.Particle_update_jiggle(emitter, particle);
               // emitter.Particle_update_rotation(emitter, particle);
               // emitter.Particle_update_scale(emitter, particle);
               // emitter.Particle_update_fade(emitter, particle);
            }


            if (particle.time >= .99) particle.col[3] = 0.0;


            // Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Particles2);
            // Render Particles
            // emitter.UpdateGfxBuffersFn(emitter.gfx.vb.groupidx, particle.start, particle.col, particle.pos, particle.time, particle.dim, particle.rot, particle.uv, particle.generic);
            emitter.UpdateGfxBuffersFn(
               emitter.gfx.vb.groupidx, particle.start, 
               particle.col[0], particle.col[1], particle.col[2], particle.col[3],
               particle.pos[0], particle.pos[1], 
               particle.dim[0], particle.dim[1],
               emitter.mat.style.rcorners, 
               particle.time, 
               particle.rot[0], particle.rot[1], particle.rot[2], particle.rot[3],
               particle.uv[0],  particle.uv[1], particle.uv[2], particle.uv[3], 
               particle.generic.a, particle.generic.b,
            );
            // vbidx, start, r,g,b,a, x,y, w,h, rc, t, rot, uv
            // Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Particles2);


            particle.time += emitter.t_step;

            if (particle.time >= emitter.life_time) {

               // Reset particle for reuse
               particle.is_alive = false;
               particle.time = emitter.geom.time;
               emitter.free_particles_idxs_buffer.Add(j);
               emitter.free_particles_idxs_buffer.AddFree(j);
               emitter.total_alive--;
               // if (emitter.free_particles_idxs_buffer.boundary === emitter.particles_buffer.boundary) {
               //    emitter.is_active = false;
               //    Renderqueue_set_active(emitter.gfx.vb.groupidx, false);
               // }

            }

            needs_update = true;
         }
      }

      // if (needs_update) Vertex_buffer_state_enable(_emitters.buffer[i].gfx.vb.groupidx, _emitters.buffer[i].gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
      if (needs_update) Vertex_buffer_render_group_set_state(_emitters.buffer[i].gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);


      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Particles2);

   }



}

/** */
// Emitter function pointers to update particle functions. It is to replace any if statements inside the 'Update loop'
function Particle_update_position(emitter, particle) {
   const speed = emitter.speed * particle.accel;
   particle.pos[0] += speed * particle.dirx;
   particle.pos[1] += speed * particle.diry;

   particle.pos[1] += particle.grav;
   particle.grav += emitter.gravity * emitter.deccel;

   particle.accel *= emitter.deccel;
}
/** */
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
/** */
function Particle_update_rotation(emitter, particle) {
   let rotspeed = (emitter.life_time > (particle.time + .8) * .9) * .1
      ? (emitter.life_time - (particle.time + .8) * .9) * .1
      : (((particle.time + .8) * .9) * .1) - emitter.life_time;
   if (rotspeed > 0) particle.angle -= rotspeed * 1.;
   particle.rot = Rotation_z_get_2D_matrix(particle.angle);
}
/** */
function Particle_update_scale(emitter, particle) {
   // For smoke enlarge effect 
   particle.dim[0] *= particle.scale * .0055 + 1;
   particle.dim[1] *= particle.scale * .0055 + 1;
   // if(j===0) console.log(particle.dim[0])
   if (particle.scale > 1.00) {
      particle.scale *= .98;
   }
}
/** */
function Particle_update_fade(emitter, particle) {
   const random = Math.random() * .4 + .5;
   if (particle.time > random) {
      particle.col[3] *= .85;
   }
}
/** */
function Particle_update_position_empty() { }
/** */
function Particle_update_jiggle_empty() { }
/** */
function Particle_update_rotation_empty() { }
/** */
function Particle_update_scale_empty() { }
/** */
function Particle_update_fade_empty() { }


/** */
export function Particle_system_emitter_set_size(emitter_idx, size) {

   _emitters.buffer[emitter_idx].geom.dim[0] = size;
   _emitters.buffer[emitter_idx].geom.dim[1] = size;
}
/** */
export function Particle_system_emitter_add_size_xy(emitter_idx, sizex, sizey) {

   _emitters.buffer[emitter_idx].geom.dim[0] += sizex;
   _emitters.buffer[emitter_idx].geom.dim[1] += sizey;
}
/** */
export function Particle_system_emitter_get_size(emitter_idx) {

   return _emitters.buffer[emitter_idx].geom.dim[0];
}
/** */
export function Particle_system_emitter_set_position_xy(emitter_idx, x, y) {

   // _emitters.buffer[emitter_idx].prev_pos[0] = _emitters.buffer[emitter_idx].pos[0];
   // _emitters.buffer[emitter_idx].prev_pos[1] = _emitters.buffer[emitter_idx].pos[1];
   _emitters.buffer[emitter_idx].geom.pos[0] = x;
   _emitters.buffer[emitter_idx].geom.pos[1] = y;
}
/** */
export function Particle_system_emitter_set_position_x(emitter_idx, x) {
   _emitters.buffer[emitter_idx].geom.pos[0] = x;
}
/** */
export function Particle_system_emitter_set_prev_position_xy(emitter_idx) {

   _emitters.buffer[emitter_idx].geom.prev_pos[0] = _emitters.buffer[emitter_idx].geom.pos[0];
   _emitters.buffer[emitter_idx].geom.prev_pos[1] = _emitters.buffer[emitter_idx].geom.pos[1];
}
/** */
export function Particle_system_emitter_get_position_xy(emitter_idx) {

   return _emitters.buffer[emitter_idx].geom.pos;
}
/** */
export function Particle_system_emitter_enable_intermidiate_emission(emitter_idx) {

   return _emitters.buffer[emitter_idx].has_intermidiate_emission = true;
}





export function Particle_system_set_uwpos_x(emitter, pos_x) {

   Mesh_unif_set_vb_root_wposx(emitter.root_posidx, pos_x);
}
export function Particle_system_set_uwpos_y(emitter, pos_y) {

   Mesh_unif_set_vb_root_wposy(emitter.root_posidx, pos_y);
}







/*********************************************************************************************************/
// DEBUG-PRINT



// Print the widget groups buffer
export function Particle_system_print_info() {


   console.log('_emitters:\n count:', _emitters.active_count, 'size', _emitters.size)
   for (let i = 0; i <= _emitters.boundary; i++) {

      const emitter = _emitters.buffer[i];
      const parent = (emitter.parent !== null) ? Mesh_get_name(emitter.parent) : 'null'

      console.log('emitter:', i, 'name:', Str_buffer_get_by_idx(emitter.nameidx),
         '\nindex:', emitter.idx,
         'sid:', emitter.sid,
         '\nroot_pos:', emitter.root_posidx,
         // 'temp_unif_wpos:', emitter.temp_unif_wpos,
         '\nprog:', emitter.gfx.prog.idx, 'vb:', emitter.gfx.vb.groupidx, 'ib:', emitter.gfx.ib.idx, 'attribsPerVertex:', emitter.gfx.attribsPerVertex,
         '\nparent:', parent,
         '\ncolor:', emitter.mat.col,
         '\npos:', emitter.geom.pos,
         '\ndim:', emitter.geom.dim,
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
         '\nParticlesBuffer:', emitter.particles_buffer,
         '\nParticlesFreeBuffer:', emitter.free_particles_idxs_buffer.buffer,
      );
   }
}
export function Particle_system_print_all_particles() {

   console.log('_emitters:\n count:', _emitters.active_count, 'size', _emitters.size)
   for (let i = 0; i <= _emitters.boundary; i++) {
      
      const emitter = _emitters.buffer[i];
      console.log('emitter:', i, 'name:', Str_buffer_get_by_idx(emitter.nameidx),);

      for (let j = 0; j <= emitter.particles_buffer.boundary; j++) {

         const particle = emitter.particles_buffer.buffer[j];
         console.log('particle idx:', particle.idx,
            'is_alive:', particle.is_alive,
            'start:', particle.start,
         );

      }
   }
}
export function Particle_system_print_free_particles_buffer() {

   console.log('_emitters:\n count:', _emitters.active_count, 'size', _emitters.size)
   for (let i = 0; i <= _emitters.boundary; i++) {

      const emitter = _emitters.buffer[i];
      console.log('emitter:', i, 'name:', Str_buffer_get_by_idx(emitter.nameidx),
         'free_buffer:', emitter.free_particles_idxs_buffer.buffer,
      );
   }
}

