"use strict";



import { Uniforms_buffer_set_uniform, Uniforms_buffer_update_uniform } from '../../../Graphics/Buffers/UniformBuffers.js';
import { Gl_set_rgba_per_vertex, Gl_set_alpha, Gl_set_rgba, Gl_set_wpos_x, Gl_set_vpos_y, Gl_set_wpos_xy, Gl_set_wpos_y, Gl_set_vpos_xy, Gl_set_vpos_x, Gl_add_wpos_xy, Gl_add_wpos_x, Gl_add_wpos_y, Gl_add_vpos_xy, Gl_add_vpos_x, Gl_add_vpos_y } from '../../../Graphics/Buffers/VertexBuffersOps.js';
import * as math from '../../../Helpers/Math/MathOperations.js'
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_get_vb_root_wposx, Mesh_unif_get_vb_root_wposy } from '../../Core/MeshUniformsBuffer.js';
import { WHITE } from '../Material/Base/Colors.js';
import { Mesh_get_uniform_ubidx_from_name } from './MeshHelperFunctions.js';






/*******************************************************************************************************************************************/
// HELPER FUNCTIONS




function Set_mesh_uniform_color(mesh_unif_buffer, color){

   const ubidx = Mesh_get_uniform_ubidx_from_name('u_col4', mesh_unif_buffer);
   Uniforms_buffer_set_uniform(ubidx, color);
   Uniforms_buffer_update_uniform(ubidx);
}



/*******************************************************************************************************************************************/
// SETTERS
export function Set_color_rgba(mesh, col) {

   // mesh.SetUpdateFrameBuffer();
   const color = col;
   math.CopyArr4(mesh.mat.col, color);
   // math.CopyArr4(mesh.mat.defCol, color);
   const mesh_unif_buffer = mesh.uniforms;

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      Gl_set_rgba_per_vertex(mesh.gfx, color);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      math.CopyArr4(mesh.mat.col, color);
      Gl_set_rgba(mesh.gfx, color);
   }
   else if (mesh.gfx.sid.unif & SID.UNIF.COL4) { // Handle uniform color 
      Set_mesh_uniform_color(mesh_unif_buffer, color)
   }
}


export function Set_color_rgb(mesh, col) {

   // mesh.SetUpdateFrameBuffer();
   const color = col;
   math.CopyArr3(mesh.mat.col, color); // BUG: The pervertex color is a Mat4
   math.CopyArr3(mesh.mat.defCol, color); // BUG: The pervertex color is a Mat4
   const mesh_unif_buffer = mesh.uniforms;

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      Gl_set_rgba_per_vertex(mesh.gfx, color);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      Gl_set_rgba(mesh.gfx, color);
   }
   else if (mesh.gfx.sid.unif & SID.UNIF.COL4) { // Handle uniform color 
      Set_mesh_uniform_color(mesh_unif_buffer, color); // BUG: The Set uniform sets rgba, not rgb
   }
}


export function Set_hover_color_rgba(mesh) {

   const intensity = 1.1;
   const mesh_unif_buffer = mesh.uniforms;
   
   
   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      math.Mult_mat4_scalar2(mesh.mat.col, intensity)
      Gl_set_rgba_per_vertex(mesh.gfx, mesh.mat.col);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      math.Mult_arr4_scalar(mesh.mat.col, intensity);
      Gl_set_rgba(mesh.gfx, mesh.mat.col);
   }
   else if (mesh.gfx.sid.unif & SID.UNIF.COL4) { // Handle uniform color 
      math.Mult_arr4_scalar(mesh.mat.col, intensity);
      Set_mesh_uniform_color(mesh_unif_buffer, mesh.mat.col)
   }
}


export function Set_default_color_rgba(mesh) {

   const color = mesh.mat.defCol;
   math.CopyArr4(mesh.mat.col, color);
   const mesh_unif_buffer = mesh.uniforms;

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      Gl_set_rgba_per_vertex(mesh.gfx, color);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      Gl_set_rgba(mesh.gfx, color);
   }
   else if (mesh.gfx.sid.unif & SID.UNIF.COL4) { // Handle uniform color 
      Set_mesh_uniform_color(mesh_unif_buffer, color)
   }
}


export function Set_color_a(mesh, alpha) {

   const mesh_unif_buffer = mesh.uniforms;
   
   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      math.Set_mat4_collumn(mesh.mat.col, alpha, 3)
      Gl_set_rgba_per_vertex(mesh.gfx, mesh.mat.col); // TODO: Do we need a specific function to set only the alpha value?
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      mesh.mat.col[3] = alpha;
      Gl_set_alpha(mesh.gfx, alpha, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.unif & SID.UNIF.COL4) { // Handle uniform color 
      mesh.mat.col[3] = alpha;
      Set_mesh_uniform_color(mesh_unif_buffer, color); // TODO: Do we need a specific function to set only the alpha value?
   }
}





/**
 * 
 */


/** */
export function Mesh_get_real_pos_xy(mesh) {

      const p = Mesh_unif_get_vb_root_wpos(mesh.root_posidx);
      let pos = [p[0], p[1], 0];

      pos[0] += mesh.geom.pos[0];
      pos[1] += mesh.geom.pos[1];
      return pos;
}
/** */
export function Mesh_get_real_pos_x(mesh, ) {

   let p = Mesh_unif_get_vb_root_wposx(mesh.root_posidx);
   return p + mesh.geom.pos[0];
}
/** */
export function Mesh_get_real_pos_y(mesh, ) {

   let p = Mesh_unif_get_vb_root_wposy(mesh.root_posidx);
   return p + mesh.geom.pos[1];
}
/** */
export function Set_time(mesh, t) {
   mesh.geom.time = t;
}



/** World Position*/
export function Mesh_update_set_wpos_xy(mesh, ) {
   Gl_set_wpos_xy( mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces );
}
/** */
export function Mesh_update_set_wpos_x(mesh, ) {
   Gl_set_wpos_x( mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.num_faces );
}
/** */
export function Mesh_update_set_wpos_y(mesh, ) {
   Gl_set_wpos_y( mesh.gfx, mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces );
}
/** */
export function Mesh_set_wpos_xy(mesh, x, y) {
   Gl_set_wpos_xy( mesh.gfx, x + mesh.geom.dim[0], y + mesh.geom.dim[1]+y, mesh.geom.num_faces );
}
/** */
export function Mesh_set_wpos_x(mesh, x) {
   Gl_set_wpos_x( mesh.gfx, x + mesh.geom.dim[0], mesh.geom.num_faces );
}
/** */
export function Mesh_set_wpos_y(mesh, y) {
   Gl_set_wpos_y( mesh.gfx, y + mesh.geom.dim[1], mesh.geom.num_faces );
}
/** */
export function Mesh_add_wpos_xy(mesh, x, y) {
   Gl_add_wpos_xy( mesh.gfx, x, y, mesh.geom.num_faces );
}
/** */
export function Mesh_add_wpos_x(mesh, x) {
   Gl_add_wpos_x( mesh.gfx, x, mesh.geom.num_faces );
}
/** */
export function Mesh_add_wpos_y(mesh, y) {
   Gl_add_wpos_y( mesh.gfx, y, mesh.geom.num_faces );
}
/** Add position to mesh and vertex buffer */
export function Mesh_add_and_copy_wpos_xy(mesh, x, y) {
   mesh.geom.pos[0] += x;
   mesh.geom.pos[1] += y;
   Gl_add_wpos_xy( mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces );
}
/** */
export function Mesh_add_and_copy_wpos_x(mesh, x) {
   mesh.geom.pos[0] += x;
   Gl_add_wpos_x( mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.num_faces );
}
/** */
export function Mesh_add_and_copy_wpos_y(mesh, y) {
   mesh.geom.pos[1] += y;
   Gl_add_wpos_y( mesh.gfx, mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces );
}
/** Set position to mesh and vertex buffer */
export function Mesh_set_and_copy_wpos_xy(mesh, x, y) {
   mesh.geom.pos[0] = x;
   mesh.geom.pos[1] = y;
   Gl_set_wpos_xy( mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces );
}
/** */
export function Mesh_set_and_copy_wpos_x(mesh, x) {
   mesh.geom.pos[0] = x;
   Gl_set_wpos_x( mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.num_faces );
}
/** */
export function Mesh_set_and_copy_wpos_y(mesh, y) {
   mesh.geom.pos[1] = y;
   Gl_set_wpos_y( mesh.gfx, mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces );
}
/** Set relative world position (via current pos difference) */
export function Mesh_set_wpos_relative_xy(mesh, x, y) { 
   const difx = x-mesh.geom.pos[0];
   mesh.geom.pos[0] = x;
   const dify = y-mesh.geom.pos[0];
   mesh.geom.pos[1] = y;
   Gl_set_wpos_xy(mesh.gfx, difx, dify, mesh.num_faces);
}
/** */
export function Mesh_set_wpos_relative_x(mesh, x) { 
   const dif = x-mesh.geom.pos[0];
   mesh.geom.pos[0] = x;
   Gl_add_wpos_x(mesh.gfx, dif, mesh.num_faces);
}
/** */
export function Mesh_set_wpos_relative_y(mesh, y) {
   const dif = y-mesh.geom.pos[0];
   mesh.geom.pos[1] = y;
   Gl_set_wpos_y(mesh.gfx, dif, mesh.num_faces);
}





/** Vertex Position */
export function Mesh_update_set_dim_xy(mesh, ) {
   Gl_set_vpos_xy( mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1], mesh.geom.num_faces );
}
/** */
export function Mesh_update_set_dim_x(mesh, ) {
   Gl_set_vpos_x( mesh.gfx, mesh.geom.dim[0], mesh.geom.num_faces );
}
/** */
export function Mesh_update_set_dim_y(mesh, ) {
   Gl_set_vpos_y( mesh.gfx, mesh.geom.dim[1], mesh.geom.num_faces );
}
/** */
export function Mesh_set_dim_xy(mesh, x, y) {
   Gl_set_vpos_xy( mesh.gfx, x, y, mesh.geom.num_faces );
}
/** */
export function Mesh_set_dim_x(mesh, x) {
   Gl_set_vpos_x( mesh.gfx, x, mesh.geom.num_faces );
}
/** */
export function Mesh_set_dim_y(mesh, y) {
   Gl_set_vpos_y( mesh.gfx, y, mesh.geom.num_faces );
}
/** */
export function Mesh_add_dim_xy(mesh, x, y) {
   Gl_add_vpos_xy( mesh.gfx, x, y, mesh.geom.num_faces );
}
/** */
export function Mesh_add_dim_x(mesh, x) {
   Gl_add_vpos_x( mesh.gfx, x, mesh.geom.num_faces );
}
/** */
export function Mesh_add_dim_y(mesh, y) {
   Gl_add_vpos_y( mesh.gfx, y, mesh.geom.num_faces );
}



