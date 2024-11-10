"use strict";



import { Uniforms_buffer_set_uniform, Uniforms_buffer_update_uniform } from '../../../Graphics/Buffers/UniformBuffers.js';
import { Gl_set_rgba_per_vertex, Gl_set_alpha, Gl_set_rgba } from '../../../Graphics/Buffers/VertexBuffersOps.js';
import * as math from '../../../Helpers/Math/MathOperations.js'
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

   // this.SetUpdateFrameBuffer();
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

   // this.SetUpdateFrameBuffer();
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

   // this.SetUpdateFrameBuffer();
   const intensity = 1.4;
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






