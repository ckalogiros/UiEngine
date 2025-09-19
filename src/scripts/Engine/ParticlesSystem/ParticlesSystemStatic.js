"use strict";

import { Sid_check_unif_match_sids } from "../../GlobalFunctions.js";
import { Vertex_buffer_render_group_set_num_faces, Vertex_buffer_render_group_set_state } from "../../Graphics/Buffers/RenderGroups.js";
import { Uniforms_buffer_find_ubidx_from_name } from "../../Graphics/Buffers/UniformBuffers.js";
import { Vertex_buffer_set_uniform_value_callback, Vertex_buffer_set_and_update_uniform, Vertex_buffer_init_vertices_for_particles, Vertex_buffer_group_set_mesh_debug_name, Vertex_buffer_add_vertices_from_render_group, Vertex_buffer_calculate_starts_per_render_group } from "../../Graphics/Buffers/VertexBuffers.js";
import { Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_tex2_with_rotation, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time_generic2, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time_generic2, Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner, Gl_particles_batch_set_instanced_col4_wpos3_dim2_time, Gl_particles_batch_set_vpos2_rcorner, Gl_particles_batch_set_instanced_col4_wpos3_dim2_time_generic2, Gl_particles_batch_set_vpos2, Gl_particles_batch_set_instanced_wpos3_time, Gl_particles_batch_set_col4_vpos2_dim2_rcorner, Gl_particles_batch_set_vpos2_dim2_rcorner, Gl_particles_batch_set_instanced_col4_wpos3_time } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Program_store_shader_operations } from "../../Graphics/ShaderPrograms.js";
import { Floor, Magnitude } from "../../Helpers/Math/MathOperations.js";
import { New_generic_buffer, New_int8_buffer } from "../Core/Buffers.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../Core/MeshUniformsBuffer.js";
import { Str_buffer_get_by_idx } from "../Core/StringBuffer.js";
import { New_uint64_buffer } from "../Core/Views/BitwiseBuffers.js";
import { View_add_mesh, View_create_new_group, View_render_specific_render_group, View_reset_rendering_buffer_whole_view_group } from "../Core/Views/MeshBufferViews.js";
import { Color_hsv_to_rgb_calibrated } from "../Drawables/Material/Colors.js";
import { Material, Material_Texture } from "../Drawables/Material/Material.js";
import { Rect_Mesh } from "../Drawables/Meshes/Rect_Mesh.js";
import { Mesh_get_name, Mesh_listener_add, Mesh_set_name } from "../Drawables/Operations/MeshPropertiesFunctions.js";
import { Style_rect_default_properties } from "../Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree, Listener_create_root_view } from "../Events/EventListeners.js";
import { Gfx_generate_context, GfxInfoMesh } from "../Interfaces/Gfx/MeshGfxContext.js";
import { Renderqueue_set_active } from "../Renderers/Renderer/RenderQueue.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";


/** // TODO: Implemetation
 * We may need to have 2 different kinds visualizers.
 *    1. For Buffers, of the buffer type of the app
 *    2. For meshes. Where children and recursion to children's children will be applied 
 * 
 * If we dont use intermidiateries, we must store a pointer to the target (buffer or mesh root) 
 * from which to draw the data for the visualization
 */


// Preallocated variables
let _gfx_copy = null; 
const _geom_copy = { 
   pos: new Float32Array([0, 0, 0]),
   dim: new Float32Array([0, 0]),
   time: 0,
}
const _mat_copy = { 
   col: new Float32Array([0,0,0,0]),
   style: { rcorners: 0, feather: 0, border: 0 },
   uv: [0, 1, 0, 1],
}


/** */
function Set_update_function_pointers(emitter) {

   const sid = emitter.sid;
   if(sid.inst !== 0x0) {

      // Instanced geometry
      if(sid.inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.TIME)) {
         emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_instanced_col4_wpos3_dim2_time;
      }
      else if(sid.inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2)) {
         emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_instanced_col4_wpos3_dim2_time_generic2;
      }
      else if(sid.inst === (SID.ATTR.WPOS3  | SID.ATTR.TIME)) {
         emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_instanced_wpos3_time;
      }
      else if(sid.inst === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.TIME)) {
         emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_instanced_col4_wpos3_time;
      }
      // COL4 WPOS3 VPOS2 DIM2 TIME RCORNERS

      // Per vertex geometry (for 1 mesh only, gets updated once on particles initialization and keeps constant/unchanged values)
      const clean_attr = sid.attr & ~sid.inst; // Get the attributes flags without any instance geometry attributes flags
      if(clean_attr === (SID.ATTR.VPOS2 | SID.ATTR.R_CORNERS)) {
         emitter.Update_gfx_buffers_fn_inst = Gl_particles_batch_set_vpos2_rcorner;
      }
      else if(clean_attr === (SID.ATTR.VPOS2)) {
         emitter.Update_gfx_buffers_fn_inst = Gl_particles_batch_set_vpos2;
      }
      else if(clean_attr === (SID.ATTR.COL4 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS)) {
         emitter.Update_gfx_buffers_fn_inst = Gl_particles_batch_set_col4_vpos2_dim2_rcorner;
      }
      else if(clean_attr === (SID.ATTR.COL4 | SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS)) {
         emitter.Update_gfx_buffers_fn_inst = Gl_particles_batch_set_col4_vpos2_dim2_rcorner;
      }
      else if(clean_attr === (SID.ATTR.VPOS2 | SID.ATTR.DIM2 | SID.ATTR.R_CORNERS)) {
         emitter.Update_gfx_buffers_fn_inst = Gl_particles_batch_set_vpos2_dim2_rcorner;
      }
   }
   else { // TODO: OLD, implement clearly what attributes the particle emitter has(like in VertexBufferFillOps.js)

      if (emitter.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time_generic2;
      else if (emitter.sid.shad & SID.SHAD.FN_GLOW_SPHERE) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner;
      else if (emitter.sid.shad & SID.SHAD.FN_NOISE) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time;
      else if (emitter.sid.attr & SID.ATTR.GENERIC2 && emitter.sid.attr & SID.ATTR.R_CORNERS) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time_generic2;
      else if (emitter.sid.attr & (SID.ATTR.GENERIC2)) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_time_generic2;
      else if (emitter.sid.attr & SID.ATTR.TEX2) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_tex2_with_rotation;
      else if (emitter.sid.attr === (SID.ATTR.DIM2 | SID.ATTR.R_CORNERS | SID.ATTR.TIME)) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner_time;
      else if (emitter.sid.attr === (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.VPOS2 |  SID.ATTR.DIM2 | SID.ATTR.R_CORNERS)) emitter.Update_gfx_buffers_fn = Gl_particles_batch_set_col4_wpos3_vpos2_dim2_rcorner;
   }
}

class Particle {

   constructor(emitter, col, x,y,w,h) {

      if (emitter === null || emitter === undefined) alert('Trying to create particle with NULL emitter\nParticleSystem.js')

      this.col = [0, 0, 0, 0];
      this.pos = [x, y, 0];
      this.dim = [w, h];

      this.is_alive = false;
      this.scale = emitter.max_scale;
      this.idx = INT_NULL; // Self index to the emitter's buffer

      // GFX variables
      this.start = INT_NULL; // The start index in the vertex buffer

      // this.time = emitter.geom.time;
      this.generic = { a: emitter.geom.generic.a, b: emitter.geom.generic.b };

      this.col[0] = col[0];
      this.col[1] = col[1];
      this.col[2] = col[2];
      this.col[3] = col[3];


   }
   SetGfxStart(start) {
      this.start = start;
   }
   SetSelfIdx(idx) {
      this.idx = idx;
   }
}
/** */
class Emitter extends Rect_Mesh {

   constructor(mesh_bufferidx, properties) {

      super(mesh_bufferidx, Style_rect_default_properties({
         is_root: properties.is_root, // Avoid double setting as root, in this class and in Rect_Mesh class
         pos: properties.pos,
         dim: properties.dim,
         col: properties.col,
         pad: properties.pad,
         name: properties.text,
         num_faces: properties.num_faces,
         is_debug_mesh: properties.is_debug_mesh,
      }));

      this.type = MESH_TYPE.RENAME_ME;
      this.idx = INT_NULL;


      this.num_particles = properties.num_particles;

      this.particle_width = properties.particle_width;
      this.particle_height = properties.particle_height;

      // this.Update_gfx_buffers_fn_inst = null; // Function pointer to update the vertex buffer of the particle system
      this.Update_gfx_buffers_fn = null; // Function pointer to update the vertex buffer of the particle system

      this.particles_buffer = New_generic_buffer(_, 'Particles - particles_buffer');
      // this.vis_buffer = New_uint64_buffer(this.num_particles, 'VisualDebug');
      // GLOB_TEMP.visual_debug = this.vis_buffer;
      // console.warn('this.vis_buffer', this.vis_buffer)
      this.target = properties.target;
      // this.shader_ops_idxs = New_int8_buffer(8, 'ParticleSystem.shader_ops_idxs');

      this.sid = {
         shad: SID.SHAD.INDEXED | SID.SHAD.INDEXED_PATT_DISCONTINUE_4,
         attr: SID.ATTR.COL4 | SID.ATTR.VPOS2 | SID.ATTR.WPOS3, // TODO: some attribs are activated in the 'Fn Enables'
         unif: 0x0,
         // COL4 WPOS3 VPOS2 DIM2 TIME RCORNERS
         // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2),
         // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2),
         // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.TIME),
         // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.TIME),
         // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2),
         // inst: (SID.ATTR.WPOS3 | SID.ATTR.TIME),
         // inst: (SID.ATTR.WPOS3 | SID.ATTR.COL4),
         inst: 0x0,
         shad_ops: 0x0,
         pass: SID.ATTR.COL4,
         blend_options: 0x0,
         fx: 0x0,
      };

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

         case PARTICLES.HAS_SCALE: {
            this.properties_flags |= PARTICLES.HAS_SCALE;
            if (params) {
               this.max_scale = params;
            }
            break;
         }
         case PARTICLES.HAS_FADE: {
            this.properties_flags |= PARTICLES.HAS_FADE;
            break;
         }
      }
   }

}
/** */
// class Emitter {

//    constructor(mesh_bufferidx, properties) {

//       this.sid = 0x0;
//       this.sceneidx = STATE.scene.active_idx;
//       this.root_posidx = INT_NULL;
//       this.gfx = null;
//       this.type = MESH_TYPE.PARTICLES;
//       this.idx = INT_NULL;
//       Mesh_set_name(this, properties.name);
//       this.parent = null;
//       this.mesh_bufferidx = mesh_bufferidx;


//       this.num_particles = properties.num_particles;

//       this.particle_width = properties.particle_width;
//       this.particle_height = properties.particle_height;

//       this.t_step = properties.t_step;
//       this.life_time = properties.life_time;
//       this.max_scale = properties.max_scale;

//       this.state = {mask:0x0}; // Set from user by method: EnableProperties()
//       this.properties_flags = 0x0; // Set from user by method: EnableProperties()
//       this.any_particle_needs_update = false;


//       this.Update_gfx_buffers_fn_inst = null; // Function pointer to update the vertex buffer of the particle system
//       this.Update_gfx_buffers_fn = null; // Function pointer to update the vertex buffer of the particle system

//       this.particles_buffer = New_generic_buffer(_, 'Particles - particles_buffer');
//       this.shader_ops_idxs = New_int8_buffer(8, 'ParticleSystem.shader_ops_idxs');

//       // this.listeners = null;
      

//       this.sid = {
//          shad: SID.SHAD.INDEXED | SID.SHAD.INDEXED_PATT_DISCONTINUE_4,
//          attr: SID.ATTR.COL4 | SID.ATTR.VPOS2 | SID.ATTR.WPOS3, // TODO: some attribs are activated in the 'Fn Enables'
//          unif: 0x0,
//          // COL4 WPOS3 VPOS2 DIM2 TIME RCORNERS
//          // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.TIME),
//          // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.TIME),
//          // inst: (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2),
//          // inst: (SID.ATTR.WPOS3 | SID.ATTR.TIME),
//          inst: 0x0,
//          shad_ops: 0x0,
//          pass: SID.ATTR.COL4,
//          blend_options: 0x0,
//          fx: 0x0,
//       };


//       const mat = (properties.texture_id === INT_NULL) ? new Material(properties.col) : new Material_Texture(properties.col, properties.texture_id);
//       this.mat = mat;
//       this.sid.attr |= mat.sid.attr;
//       this.sid.unif |= mat.sid.unif;
//       this.sid.shad |= mat.sid.shad;
//       this.sid.pass |= mat.sid.pass;

//       this.geom = {
//          pos: properties.pos,
//          prev_pos: [properties.pos[0], properties.pos[1]],
//          dim: [properties.dim[0], properties.dim[1]],
//          generic: { a: 0, b: 0 },
//          time: 0,
//          scale: [properties.scale_down, 1],
//          num_faces:1,

//       };

//       this.uniforms = [];
//       this.EnableGfxUniforms({ unif: SID.UNIF.PROJECTION_MATRIX }, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);
//       this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

//       this.group_bufferidxs = [INT_NULL, INT_NULL, INT_NULL, INT_NULL];
//       this.group_bufferidxs[0] = View_create_new_group(this);

//       this.num_particles_per_frame = properties.num_particles_per_frame;
//       this.has_intermidiate_emission = properties.has_intermidiate_emission;


//       console.log('#### Perticles-Size', this.num_particles );

//    }
//    /**
//     * Enable shader properties.
//     * In order for a mesh to be drawn in a certain way, specific shaders must be build.
//     * Allow the shader constructor to combine different shaders by enabling meshes 'sid' bit field. 
//     */
//    EnableGfxOperations(function_operation, blend_mode = SID.BLEND_OPTIONS.BLEND_MODE_ADD) {

//       this.sid.shad_ops |= function_operation;
//       // console.log(this.shader_ops_idxs)
//       // console.log(function_operation)
//       this.shader_ops_idxs.Add(Program_store_shader_operations(function_operation, blend_mode));

//       if ((function_operation & SID.SHADER_OPERATIONS.GROUP_SDF_RECT) && (this.sid.shad_ops & SID.SHADER_OPERATIONS.SDF_RECT) === 0) {
//          console.error('Shader Operation detected: Need SDF_RECT to function.');
//          alert('Shader Operation detected: Need SDF_RECT to function.');
//       }

//       if (function_operation & SID.SHADER_OPERATIONS.DIST_RECT_FILLED) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW2) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.BUBBLE) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.FLARE) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.OUTER_GLOW_RECT) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
//       }
//       if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2) {
//          this.GfxEnableAttr(SID.ATTR.DIM2);
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
//       }

//    }
//    GfxEnableAttr(flags, params) {

//       if (flags & SID.ATTR.DIM2) { this.sid.attr |= SID.ATTR.DIM2; }
//       if (flags & SID.ATTR.TEX2) { this.sid.attr |= SID.ATTR.TEX2; }
//       if (flags & SID.ATTR.ANGLE) { this.sid.attr |= SID.ATTR.ANGLE; }
//       if (flags & SID.ATTR.TIME) { this.sid.attr |= SID.ATTR.TIME; }
//       if (flags & SID.ATTR.GENERIC2) { this.sid.attr |= SID.ATTR.GENERIC2; }
//       if (flags & SID.ATTR.R_CORNERS) { this.sid.attr |= SID.ATTR.R_CORNERS; }
//       if (flags & SID.ATTR.COL4_PER_VERTEX) this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;

//       if (params) {

//          if (params.time) { this.geom.time = params.time; }
//          if (params.generic) { this.geom.generic = params.generic; }
//          if (params.rcorners) this.mat.style.rcorners = params.rcorners;
//          if (params.col4_per_vertex) { this.mat.col = params.col4_per_vertex; }
//       }

//    }
//    GfxPassAttr(flags) {

//       if (flags & SID.ATTR.VPOS2) this.sid.pass |= SID.ATTR.VPOS2;
//       if (flags & SID.ATTR.DIM2) { this.sid.pass |= SID.ATTR.DIM2; }
//       if (flags & SID.ATTR.WPOS2) this.sid.pass |= SID.ATTR.WPOS2;
//       if (flags & SID.ATTR.WPOS3) this.sid.pass |= SID.ATTR.WPOS3;
//       if (flags & SID.ATTR.TEX2) { this.sid.pass |= SID.ATTR.TEX2; }
//       if (flags & SID.ATTR.RES2) this.sid.pass |= SID.ATTR.RES2;
//       if (flags & SID.ATTR.TIME) { this.sid.pass |= SID.ATTR.TIME; }
//       if (flags & SID.ATTR.ANGLE) { this.sid.pass |= SID.ATTR.ANGLE; }
//       if (flags & SID.ATTR.R_CORNERS) { this.sid.pass |= SID.ATTR.R_CORNERS; }
//       if (flags & SID.ATTR.GENERIC2) { this.sid.pass |= SID.ATTR.GENERIC2; }
//       if (flags & SID.ATTR.COL4_PER_VERTEX) { this.sid.pass |= SID.ATTR.COL4_PER_VERTEX; }

//    }
//    GfxEnableBlend(blend_flags) {
//       this.sid.blend_options |= blend_flags;
//    }
//    GfxEnableFn(flags, params) {


//       // Enable shader function calls (from shader main())
//       if (flags === SID.SHAD.FN_GLOW) {
//          if (params === undefined) alert('Enable shader FN_GLOW needs \'time\' parameter.\nBut no parameters are passed to \'GfxEnableFn()\'');
//          const param = { // Create default attribs values
//             time: params.time !== undefined ? params.time : 0,
//          };
//          this.sid.shad |= SID.SHAD.FN_GLOW;
//          this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
//          this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
//       }
//       // TODO: See if attr enable and passes are required, It seems NOT
//       if (flags === SID.SHAD.FN_INNER_SHADOW) {
//          this.sid.shad |= SID.SHAD.FN_INNER_SHADOW;
//          this.GfxEnableAttr(SID.ATTR.DIM2,); // Enable attribute and store attribs value to cuurrent mesh
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
//       }
//       if (flags === SID.SHAD.FN_EXPLOSION_CIRCLE) {
//          if (params === undefined) alert('Enable shader FN_EXPLOSION_CIRCLE needs: \'time, generic.a, generic.b\' parameters.\nBut no parameters are passed to \'GfxEnableFn()\'');
//          const param = { // Create default attribs values
//             time: params.time !== undefined ? params.time : 0,
//             generic: params.generic !== undefined ? params.generic : { a: 1, b: 1 },
//          };
//          this.sid.shad |= SID.SHAD.FN_EXPLOSION_CIRCLE;
//          this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2, param); // Enable attribute and store attribs value to cuurrent mesh
//          this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.GENERIC2 | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
//       }
//       if (flags === SID.SHAD.FN_EXPLOSION_GLOW) {
//          if (params === undefined) alert('Enable shader FN_EXPLOSION_GLOW needs: \'time, generic.a, generic.b\' parameters.\nBut no parameters are passed to \'GfxEnableFn()\'');
//          const param = { // Create default attribs values
//             time: params.time !== undefined ? params.time : 0,
//             // generic: params.generic !== undefined ? params.generic : { a: 1, b: 1 },
//          };
//          this.sid.shad |= SID.SHAD.FN_EXPLOSION_GLOW;
//          this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
//          this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
//       }
//       if (flags === SID.SHAD.FN_GLOW_SPHERE) {
//          this.sid.shad |= SID.SHAD.FN_GLOW_SPHERE;
//          this.GfxEnableAttr(SID.ATTR.DIM2,); // Enable attribute and store attribs value to cuurrent mesh
//          this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
//       }
//       if (flags === SID.SHAD.FN_NOISE) {
//          if (params === undefined) alert('Enable shader FN_NOISE needs \'time\' parameter.\nBut no parameters are passed to \'GfxEnableFn()\'');
//          const param = { // Create default attribs values
//             time: params.time !== undefined ? params.time : 0,
//          };
//          this.sid.shad |= SID.SHAD.FN_NOISE;
//          this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
//          this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.DIM2 | SID.ATTR.WPOS3,); // Enable pass of the attributes to fragment shader
//       }
//       if (flags === SID.SHAD.FN_NOISE_WORLEY_1) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_1; }
//       if (flags === SID.SHAD.FN_NOISE_WORLEY_2) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_2; }
//       if (flags === SID.SHAD.FN_NOISE_WORLEY_3_TYPES) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_3_TYPES; }
//       if (flags === SID.SHAD.FN_NOISE_WORLEY_3D) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_3D; }
//       if (flags === SID.SHAD.FN_NOISE_VORONOI_1) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_1; }
//       if (flags === SID.SHAD.FN_NOISE_VORONOI_2) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_2; }

//       if (params !== undefined) {
//          if (params.blend_mode !== undefined) {
//             this.sid.blend_options |= params.blend_mode;
//          }
//       }

//       // TODO
//       // case MESH_ENABLE.GFX.BLEND_OPTIONS: { if (params === null) alert('BLEND_OPTIONS MUST be passed in the params'); this.sid.blend_options |= params; break; }
//       // case MESH_ENABLE.GFX.TEST_SHADERS_1: { this.sid.shad |= SID.SHAD.FS_TEST1; this.sid.shad |= SID.SHAD.FS_TEST1; break; }
//       // case MESH_ENABLE.GFX.TEST_SHADERS_2: { this.sid.shad |= SID.SHAD.FS_TEST2; this.sid.shad |= SID.SHAD.FS_TEST2; break; }
//       // case MESH_ENABLE.GFX.TEST_SHADERS_3: { this.sid.shad |= SID.SHAD.FS_TEST3; this.sid.shad |= SID.SHAD.FS_TEST3; break; }
//       // case MESH_ENABLE.GFX.TEST_SHADERS_4: { this.sid.shad |= SID.SHAD.FS_TEST4; this.sid.shad |= SID.SHAD.FS_TEST4; break; }
//    }
//    EnableGfxUniforms(flags = 0x0, name, type, shader_flags, arr_size = 0) {


//       /**
//        * How to set up a uniform:
//        * 1. Call this, with uniform name and a gl:SID.UNIF. the type of uniform to enable.
//        *      This means that the user is responsible to add any new uniform type in 'SID' global object.
//        *      That is so we can check and enable code in the shader builder. 
//        * 2. We need to bind the 'Set' and 'Update' functions for the uniforms to be usefull.
//        *      . For the block uniforms, we only need to 'Set' the value via 'Uniforms_block_set_uniform()' 
//        *          function, the Update happens by gl.bindBuffer.
//        *      . For individual uniforms, both 'Set' and 'Update' must be bound via 'Program_uniform_bind()' function.
//        *          Use the 'Program_uniform_bind' and not 'Uniforms_bind...' Because the uniform update uses only a 'loc', 
//        *          this might lead to unwilingly updating same loc of another program's uniform. 
//        */

//       if (flags) {

//          if (flags.unif) this.sid.unif |= flags.unif;
//          if (flags.pass) this.sid.pass |= flags.pass;
//          // if (flags.fx) this.sid.fx |= flags.fx;
//       }

//       // Avoid duplicates
//       const len = this.uniforms.length;
//       let skip = false;
//       for (let i = 0; i < len; i++) {
//          if (this.uniforms[i].name === name)
//             skip = true;
//       }

//       if (!skip) {
//          this.uniforms.push({
//             name: name,
//             type: type,
//             ubidx: INT_NULL, // Should be set by the Gl Program creation. So the first mesh that will push to create the program will have the ubidx
//             shader: shader_flags,
//             arr_size: arr_size,
//          });
//       }

//    }
//    SetClbkGfxUniforms(unif_name, Clbk, clbk_params) {

//       // Find uniform
//       const len = this.uniforms.length;
//       let found_idx = INT_NULL;
//       for (let i = 0; i < len; i++) {
//          if (this.uniforms[i].name === unif_name) {
//             found_idx = i;
//             break;
//          }
//       }

//       if (found_idx !== INT_NULL) {

//          if (this.uniforms[found_idx].ubidx === INT_NULL) {

//             // console.error('ubidx is INT_NULL. SEE if the uniform of this mesh has already been initialized for the vertex buffer.');

//             this.uniforms[found_idx].ubidx = Uniforms_buffer_find_ubidx_from_name(this.uniforms[found_idx].name, this.gfx.vb.groupidx)

//             if (this.uniforms[found_idx].ubidx === INT_NULL) {
//                // alert('51998712223 \nUniform Not Found')
//                return;
//             }
//          }

//          // this.uniforms[found_idx].vertex_buffer_store_idx = Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx);
//          Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx, this.uniforms[found_idx].name);
//          return;
//       }


//       // Alert if the current mesh system does not have the uniform enabled.
//       console.error('No Uniform ', unif_name, ' found for mesh:', Mesh_get_name(this));
//       if (Sid_check_unif_match_sids(this.sid.unif, unif_name) === true) {

//          alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js\nSEE ERROR')
//       }


//    }
//    GfxUniformSetAndUpdate(unif_name, value, value_idx = null) {

//       /**ERROR */ if (this.gfx === null) alert('Try to update uniform before mesh has gfx.')

//       const len = this.uniforms.length;
//       for (let i = 0; i < len; i++) {
//          if (this.uniforms[i].name === unif_name) {
//             const ubidx = this.uniforms[i].ubidx;
//             if (ubidx === INT_NULL) {


//                console.error('334334334334 ubidx is null.',
//                   '\nPossible error: mesh is not the root mesh of the vertex buffer, and there is no ubidx store that is why ubidx is null',
//                   '\nuniform name', unif_name,
//                   '\nubidx', ubidx,
//                   '\nmesh all uniforms', this.uniforms,

//                )
//                alert('334334334334 ubidx is null. Check if mesh is the root mesh of the vertex buffer')
//             }
//             Vertex_buffer_set_and_update_uniform(this.gfx.vb.groupidx, ubidx, value, value_idx);
//             break;
//          }
//       }
//    }
//    GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

//       // Find uniform
//       const len = this.uniforms.length;
//       let found_idx = INT_NULL;
//       for (let i = 0; i < len; i++) {
//          if (this.uniforms[i].name === unif_name) {
//             found_idx = i;
//             break;
//          }
//       }

//       if (found_idx !== INT_NULL) {

//          if (this.uniforms[found_idx].ubidx === INT_NULL) {

//             // Case the mesh is new but the vertex buffer already created and owns the uniform
//             this.uniforms[found_idx].ubidx = Uniforms_buffer_find_ubidx_from_name(this.uniforms[found_idx].name, this.gfx.vb.groupidx);

//             if (this.uniforms[found_idx].ubidx === INT_NULL) {
//                return;
//             }
//          }

//          // this.uniforms[found_idx].vertex_buffer_store_idx = Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx);
//          Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx, this.uniforms[found_idx].name);
//          return;
//       }


//       // Alert if the current particle system does not have the uniform enabled.
//       console.error('No Uniform ', unif_name, ' found for mesh:', Mesh_get_name(this));
//       if (Sid_check_unif_match_sids(this.sid.unif, unif_name) === true) {
//          alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js\nSEE ERROR')
//       }

//    }
//    EnableProperties(which, params = null) {

//       switch (which) {

//          case PARTICLES.HAS_SCALE: {
//             this.properties_flags |= PARTICLES.HAS_SCALE;
//             if (params) {
//                this.max_scale = params;
//             }
//             break;
//          }
//          case PARTICLES.HAS_FADE: {
//             this.properties_flags |= PARTICLES.HAS_FADE;
//             break;
//          }
//       }
//    }

//    // ListenEventConstruct() {

//    //    const mesh = this;

//    //    if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

//    //       // Construct HOVER event
//    //       if (mesh.listeners && mesh.listeners.buffer[E.H] === INT_NULL) {
//    //          Mesh_listener_add(mesh, E.H, null, null);
//    //       }
//    //       // Construct CLICK_UP/MOVE event
//    //       if (mesh.listeners && mesh.listeners.buffer[E.C] === INT_NULL) {
//    //          const evt_params = { target_mesh: mesh, };
//    //          Mesh_listener_add(mesh, E.C, mesh.OnClick, evt_params);
//    //          // Listener_create_root_view(E.C, mesh.listeners.buffer[E.C]);
//    //       }
//    //       if (mesh.listeners && mesh.listeners.buffer[E.K] === INT_NULL) {
//    //          const evt_params = { target_mesh: mesh, };
//    //          // HACK: Assuming mesh has no other callbacks stored, 0 index is used 
//    //          if(mesh.event_clbks.buffer[0]) Mesh_listener_add(mesh, E.K, mesh.event_clbks.buffer[0], evt_params);
//    //          else alert('99187223332. Constructing KEY_PRESS listener->No callback is set.');
//    //       }
//    //    }
//    //    return true;
//    // }

// }




const _emitters = New_generic_buffer(_, 'Static Particle System: Emitters buffer');




/** */
export function Static_particle_system_create_emitter(mesh_bufferidx, properties) {

   const emitter = new Emitter(mesh_bufferidx, properties);
   const idx = _emitters.Add(emitter);
   _emitters.buffer[idx].idx = idx;

   return emitter;
}
/** */
export function Static_particles_gen_gfx_ctx(emitter, parent = null, specific_vb_groupidx) {

   const pos_x = emitter.geom.pos[0];
   const pos_y = emitter.geom.pos[1];
   emitter.geom.pos[0] = 0;
   emitter.geom.pos[1] = 0;
   
   emitter.parent = parent;
   const FLAGS = GFX_CTX_FLAGS.PRIVATE;
   const ret = Gfx_generate_context(FLAGS, emitter, specific_vb_groupidx, true, emitter.num_particles);
   emitter.gfx = ret.gfx;
   emitter.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, emitter.gfx.vb.render_groupidx);
   // Add to view group
   View_add_mesh(emitter.group_bufferidxs[0], emitter, ret.is_root_widget_on_reused_vb);

   emitter.geom.pos[0] = pos_x;
   emitter.geom.pos[1] = pos_y;

   Construct_listen_events_from_mesh_tree(emitter);
   Construct_listen_events_relations_from_mesh_tree(emitter);

   Set_update_function_pointers(emitter);
   Vertex_buffer_group_set_mesh_debug_name(emitter.gfx.vb.groupidx, emitter.name);
   Vertex_buffer_render_group_set_num_faces(emitter.gfx.vb.render_groupidx, emitter.num_particles+1);
   // if(emitter.sid.inst) Vertex_buffer_render_group_set_num_faces(emitter.gfx.vb.render_groupidx, 1);
   // else Vertex_buffer_render_group_set_num_faces(emitter.gfx.vb.render_groupidx, emitter.num_particles+1);

   View_render_specific_render_group(emitter.group_bufferidxs[0], emitter.group_bufferidxs[1], emitter.group_bufferidxs[2]);

   emitter.state.mask |= MESH_STATE_FLAGS.ACTIVE;
   // emitter.ListenEventConstruct();

   return emitter.gfx.vb.groupidx;
}
/** */
export function Static_particle_system_init_particles(emitter) {
   
   let x=emitter.geom.pos[0], y=emitter.geom.pos[1];
   let w=emitter.particle_width, h=emitter.particle_height;
   const pad = emitter.StylesGetPad(STYLES.AXIS.X);

   _gfx_copy = emitter.gfx.Copy();
   _mat_copy.style.rcorners  = emitter.mat.style.rcorners;

   _mat_copy.col = Color_hsv_to_rgb_calibrated(0,0,1,1,.13,0);
   // const start1 = Vertex_buffer_add_vertices_from_render_group(emitter.gfx, emitter.geom, _mat_copy, 1, 'Emitter', false);
   // _gfx_copy.vb.starts[0] = start1;
   let hue = 0.1

   for(let i=0; i < emitter.num_particles; i++) {


      // if (x+w*1+pad*2 > emitter.geom.pos[0]+emitter.geom.dim[0]*2) {
      if (x+w*2+pad > emitter.geom.pos[0]+emitter.geom.dim[0]*2) {
         x = emitter.geom.pos[0];
         y += h * 2;
      }
      
      const particle = new Particle(emitter, emitter.mat.col, x+pad,y+pad,w,h);
      const particle_idx = emitter.particles_buffer.Add(particle);


      particle.is_alive = true;
      particle.idx = particle_idx;
      
      const new_col = Color_hsv_to_rgb_calibrated(hue,1,1,1,.6,.4);
      
      _geom_copy.pos[0] = particle.pos[0];
      _geom_copy.pos[1] = particle.pos[1];
      _geom_copy.pos[2] = particle.pos[2];
      _geom_copy.dim[0] = particle.dim[0];
      _geom_copy.dim[1] = particle.dim[1];
      _geom_copy.time   = emitter.geom.time;
      particle.col[0] = new_col[0]; 
      particle.col[1] = new_col[1]; 
      particle.col[2] = new_col[2]; 
      particle.col[3] = new_col[3];
      // _mat_copy.col[0]  = particle.col[0]; _mat_copy.col[1]  = particle.col[1]; _mat_copy.col[2]  = particle.col[2]; _mat_copy.col[3]  = particle.col[3];
      
      _mat_copy.col = Color_hsv_to_rgb_calibrated(hue,1,1,1,.6,.4);
      hue+=1/emitter.num_particles
      _mat_copy.col[0]  = 0; _mat_copy.col[1]  = 0; _mat_copy.col[2]  = 0; _mat_copy.col[3]  = 1;
      const start = Vertex_buffer_add_vertices_from_render_group(_gfx_copy, _geom_copy, _mat_copy, 1, `particle:${particle_idx}`, false);
      _gfx_copy.vb.starts[0] = start;
            
      emitter.particles_buffer.buffer[particle_idx].SetGfxStart(start);

      
      // increment to the next position
      x += w*2;
   }



   // Vertex_buffer_render_group_set_state(emitter.gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);
   Renderqueue_set_active(emitter.gfx.vb.groupidx, true);

   // View_reset_rendering_buffer_whole_view_group(emitter.group_bufferidxs[0]);
   

          
   if(emitter.sid.inst !== 0x0) {

      emitter.Update_gfx_buffers_fn_inst(
            emitter.gfx.vb.groupidx+1, 0, 
            emitter.mat.col[0], emitter.mat.col[1], emitter.mat.col[2], emitter.mat.col[3],
            0, 0, 
            emitter.geom.dim[0], emitter.geom.dim[1],
            emitter.mat.style.rcorners, 
            0, 
            0,0,0,0,
            0,0,0,0,
            0,0, // particle.generic.a, particle.generic.b,
      );

   }

   Static_particle_system_print_info();

}
/** */
export function Static_particle_system_update() {

   if (_emitters.active_count === 0) return;

   for (let i = 0; i <= _emitters.boundary; i++) {
      
      const emitter = _emitters.buffer[i];
      // if(!emitter.any_particle_needs_update) continue;

      const target = emitter.target;
      // console.log(target.idx)
      
      
      let needs_update = false;
      
      for (let j = 0; j < target.particles_buffer.size; j++) {

         const particle = emitter.particles_buffer.buffer[j];
         // const is_alive = GLOB_TEMP.visual_debug.Retrieve(j);

         const target_particle = target.particles_buffer.buffer[j];

         if (target_particle !== null && target_particle.is_alive) {

            // if(j===0) console.log(particle.start)
            emitter.Update_gfx_buffers_fn(
               emitter.gfx.vb.groupidx, particle.start, 
               particle.col[0], particle.col[1], particle.col[2], particle.col[3],
               particle.pos[0], particle.pos[1], 
               particle.dim[0], particle.dim[1],
               emitter.mat.style.rcorners, 
            );

            needs_update = true;
         }
         else {
            emitter.Update_gfx_buffers_fn(
               emitter.gfx.vb.groupidx, particle.start, 
               0, 0, 0, 1,
               particle.pos[0], particle.pos[1], 
               particle.dim[0], particle.dim[1],
               emitter.mat.style.rcorners, 
            );
            needs_update = true;
         }

      }


      // if (needs_update) Vertex_buffer_state_enable(_emitters.buffer[i].gfx.vb.groupidx, _emitters.buffer[i].gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
      if (needs_update) Vertex_buffer_render_group_set_state(_emitters.buffer[i].gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);

   }



}
/** SAVE-with uin64 buffer intermidiary */
// export function Static_particle_system_update() {

//    if (_emitters.active_count === 0) return;

//    for (let i = 0; i <= _emitters.boundary; i++) {
      
//       const emitter = _emitters.buffer[i];
//       if(!emitter.any_particle_needs_update) continue;

      
      
//       let needs_update = false;
      
//       for (let j = 0; j <= emitter.particles_buffer.boundary; j++) {

//          const particle = emitter.particles_buffer.buffer[j];
//          const is_alive = GLOB_TEMP.visual_debug.Retrieve(j);
         
//          if (is_alive) {

//             // if(j===0) console.log(particle.start)
//             emitter.Update_gfx_buffers_fn(
//                emitter.gfx.vb.groupidx, particle.start, 
//                particle.col[0], particle.col[1], particle.col[2], particle.col[3],
//                particle.pos[0], particle.pos[1], 
//                particle.dim[0], particle.dim[1],
//                emitter.mat.style.rcorners, 
//                // particle.time, 
//                // particle.generic.a, particle.generic.b,
//             );

//             needs_update = true;
//          }
//          else {
//             emitter.Update_gfx_buffers_fn(
//                emitter.gfx.vb.groupidx, particle.start, 
//                0, 0, 0, 1,
//                particle.pos[0], particle.pos[1], 
//                particle.dim[0], particle.dim[1],
//                emitter.mat.style.rcorners, 
//                // particle.time, 
//                // particle.generic.a, particle.generic.b,
//             );
//             needs_update = true;
//          }
//       }


//       // if (needs_update) Vertex_buffer_state_enable(_emitters.buffer[i].gfx.vb.groupidx, _emitters.buffer[i].gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
//       if (needs_update) Vertex_buffer_render_group_set_state(_emitters.buffer[i].gfx.vb.render_groupidx, RENDER_GROUP_STATE.NEEDS_UPDATE);

//    }



// }


export function Static_particles_set_need_update(emitter_idx, needs_update) {
   const emitter = _emitters.buffer[emitter_idx];
   // const emitter = _emitters.buffer[0];
   emitter.any_particle_needs_update = needs_update;
}
















/*********************************************************************************************************/
// DEBUG-PRINT



// Print the widget groups buffer
export function Static_particle_system_print_info() {


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
         '\nlife_time:', emitter.life_time,
         '\nt_step:', emitter.t_step,
         '\nuniforms:', emitter.uniforms,
         '\nParticlesBuffer:', emitter.particles_buffer,
      );
   }
}
export function Static_particle_system_print_all_particles() {

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

