"use strict";



import { Uniforms_buffer_set_uniform, Uniforms_buffer_update_uniform } from '../../../Graphics/Buffers/UniformBuffers.js';
import { Gl_set_rgba_per_vertex, Gl_set_alpha, Gl_set_rgba, Gl_set_wpos_xy, Gl_set_wpos_x, Gl_set_wpos_y, Gl_add_wpos_y } from '../../../Graphics/Buffers/VertexBuffersOps.js';
import * as VbOps from  '../../../Graphics/Buffers/VertexBuffersOps.js';
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
/*******************************************************************************************************************************************/
// SETTERS
/*******************************************************************************************************************************************/


/*******************************************************************************************************************************************/
// Attribute: Color
export function Set_color_rgba(mesh, col) {

   const color = col;
   math.CopyArr4(mesh.mat.col, color);

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      VbOps.Gl_set_rgba_per_vertex(mesh.gfx, color, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      math.CopyArr4(mesh.mat.col, color);
      VbOps.Gl_set_rgba(mesh.gfx, color, mesh.geom.num_faces);
   }
}


export function Set_color_rgb(mesh, col) {

   // this.SetUpdateFrameBuffer();
   const color = col;
   math.CopyArr3(mesh.mat.col, color); // BUG: The pervertex color is a Mat4
   math.CopyArr3(mesh.mat.defCol, color); // BUG: The pervertex color is a Mat4

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      VbOps.Gl_set_rgba_per_vertex(mesh.gfx, color, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      VbOps.Gl_set_rgba(mesh.gfx, color, mesh.geom.num_faces);
   }
}


export function Set_hover_color_rgba(mesh) {

   const intensity = 1.1;
   
   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      math.Mult_mat4_scalar2(mesh.mat.col, intensity)
      VbOps.Gl_set_rgba_per_vertex(mesh.gfx, mesh.mat.col, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      math.Mult_arr4_scalar(mesh.mat.col, intensity);
      VbOps.Gl_set_rgba(mesh.gfx, mesh.mat.col, mesh.geom.num_faces);
   }
}


export function Set_default_color_rgba(mesh) {

   const color = mesh.mat.defCol;
   math.CopyArr4(mesh.mat.col, color);

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      VbOps.Gl_set_rgba_per_vertex(mesh.gfx, color, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      VbOps.Gl_set_rgba(mesh.gfx, color, mesh.geom.num_faces);
   }
}


export function Set_color_a(mesh, alpha) {

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      math.Set_mat4_collumn(mesh.mat.col, alpha, 3)
      VbOps.Gl_set_rgba_per_vertex(mesh.gfx, mesh.mat.col, mesh.geom.num_faces); // TODO: Do we need a specific function to set only the alpha value?
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      mesh.mat.col[3] = alpha;
      VbOps.Gl_set_alpha(mesh.gfx, alpha, mesh.geom.num_faces);
   }
}




/*******************************************************************************************************************************************/
// Attribute: World Position


export function Set_wpos_xy(mesh, x, y) {

   x += mesh.geom.dim[0];
   y += mesh.geom.dim[1];
   mesh.geom.pos[0] = x;
   mesh.geom.pos[1] = y;
   VbOps.Gl_set_wpos_xy(mesh.gfx, x, y, mesh.geom.num_faces);
}

export function Set_wpos_x(mesh, x) {
   
   x += mesh.geom.dim[0];
   mesh.geom.pos[0] = x;
   VbOps.Gl_set_wpos_x(mesh.gfx, x, mesh.geom.num_faces);
}

export function Set_wpos_y(mesh, y) {
   
   y += mesh.geom.dim[1];
   mesh.geom.pos[1] = y;
   VbOps.Gl_set_wpos_y(mesh.gfx, y, mesh.geom.num_faces);
}

export function Add_wpos_xy(mesh, x, y) {

   mesh.geom.pos[0] = x;
   mesh.geom.pos[1] = y;
   VbOps.Gl_add_wpos_xy(mesh.gfx, x, y, mesh.geom.num_faces);
}

export function Add_wpos_x(mesh, x) {

   mesh.geom.pos[0] = x;
   VbOps.Gl_add_wpos_x(mesh.gfx, x, mesh.geom.num_faces);
}

export function Add_wpos_y(mesh, y) {

   mesh.geom.pos[1] = y;
   VbOps.Gl_add_wpos_y(mesh.gfx, y, mesh.geom.num_faces);
}


