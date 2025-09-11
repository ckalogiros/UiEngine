"use strict";



import { Uniforms_buffer_set_uniform, Uniforms_buffer_update_uniform } from '../../../Graphics/Buffers/UniformBuffers.js';
import { Gl_set_rgba_per_vertex, Gl_set_alpha, Gl_set_rgba, Gl_set_wpos_x, Gl_set_vpos_y, Gl_set_wpos_xy, Gl_set_wpos_y, Gl_set_vpos_xy, Gl_set_vpos_x, Gl_add_wpos_xy, Gl_add_wpos_x, Gl_add_wpos_y, Gl_add_vpos_xy, Gl_add_vpos_x, Gl_add_vpos_y, Gl_rotate_z_2d, Gl_rotate_add_z_2d, Gl_rotate_y_2d, Gl_set_angle, Gl_set_rgb, Gl_rotate_z_2d_from_pivot } from '../../../Graphics/Buffers/VertexBuffersOps.js';
import { Shader_builder_create_attribs_info } from '../../../Graphics/Shaders/ShaderBuilder/ShaderBuilder.js';
import * as math from '../../../Helpers/Math/MathOperations.js'
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_get_vb_root_wpos_obj_t, Mesh_unif_get_vb_root_wposx, Mesh_unif_get_vb_root_wposy } from '../../Core/MeshUniformsBuffer.js';
import { Mesh_get_uniform_ubidx_from_name } from './MeshPropertiesFunctions.js';






/*******************************************************************************************************************************************/
// Create attributes buffer from attributes info

/**TODO: Implement*/
export function Mesh_create_attributes(mesh) {

   const attribs_info = Shader_builder_create_attribs_info(mesh.sid);

   /**
    attribs_info.attribs_info_m.mesh_attribs:{
      attrib_flag: SID.ATTR.
      loc: 0
      name: "col4"
      offset: 0
      size: 4
      type: 35666
    }
   */

   const mesh_attribs = attribs_info.attribs_info_m.mesh_attribs;
   let attribs_size = 0;
   for (let i = 0; i < mesh_attribs.length; i++) {

      const attr = mesh_attribs[i];

      attribs_size += attr.size;

   }


   console.error(attribs_size);

   const attribs = new Float32Array(attribs_size);

   for (let i = 0; i < mesh_attribs.length; i++) {

      const attr = mesh_attribs[i];

      if(attr.attrib_flag & SID.ATTR.COL4) {
         if (attr.attrib_flag & SID.ATTR.COL4_PER_VERTEX) {
            attribs.set(mesh.mat.col, attr.offset);
         }
         else {
            attribs.set(mesh.mat.col, attr.offset);
         }
         console.log('COL4', attr.size)
      }
      else if(attr.attrib_flag & SID.ATTR.WPOS3) {
         attribs.set(mesh.geom.pos, attr.offset);
         console.log('WPOS3', attr.size)
      }
      else if(attr.attrib_flag & SID.ATTR.VPOS2) {
         attribs.set(mesh.geom.dim, attr.offset);
         console.log('VPOS2', attr.size)
      }
      else if (attr.attrib_flag & SID.ATTR.DIM2) { attribs.set(mesh.geom.dim, attr.offset); }
      else if (attr.attrib_flag & SID.ATTR.R_CORNERS) { attribs.set(mesh.mat.style.rcorners, attr.offset); }
      else if (attr.attrib_flag & SID.ATTR.TIME) { attribs.set(mesh.geom.time, attr.offset); }
      else if (attr.attrib_flag & SID.ATTR.ANGLE) { attribs.set(mesh.geom.dim, attr.offset); }
      else if (attr.attrib_flag & SID.ATTR.TEX2) { attribs.set(mesh.mat.uv, attr.offset); }
      else if (attr.attrib_flag & SID.ATTR.GENERIC2) { attribs.set([mesh.geom.generic.a, mesh.geom.generic.b], attr.offset); }

   }

   console.error('attributes buffer', attribs);

   return attribs;
}








/*********************************************************************/
// Colors

/** */
export function Mesh_set_color_rgba(mesh, col) {

   Gl_set_rgba(mesh.gfx, col, mesh.geom.num_faces);
}
/** */
export function Mesh_set_and_update_color_rgba(mesh, col) {

   math.CopyArr4(mesh.mat.col, col);
   math.CopyArr4(mesh.mat.col, col);
   Gl_set_rgba(mesh.gfx, col, mesh.geom.num_faces);
}
/** */
export function Mesh_set_color_rgb(mesh, col) {

   Gl_set_rgb(mesh.gfx, col, mesh.geom.num_faces);
}
/** */
export function Mesh_set_and_update_color_rgb(mesh, col) {

   math.CopyArr4(mesh.mat.col, col);
   math.CopyArr4(mesh.mat.col, col);
   Gl_set_rgb(mesh.gfx, col, mesh.geom.num_faces);
}
/** */
function Set_mesh_uniform_color(mesh_unif_buffer, color) {

   const ubidx = Mesh_get_uniform_ubidx_from_name('u_col4', mesh_unif_buffer);
   Uniforms_buffer_set_uniform(ubidx, color);
   Uniforms_buffer_update_uniform(ubidx);
}



/** */
export function Set_color_rgba(mesh, col) {

   const color = col;
   math.CopyArr4(mesh.mat.col, color);

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      Gl_set_rgba_per_vertex(mesh.gfx, color, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      math.CopyArr4(mesh.mat.col, color);
      Gl_set_rgba(mesh.gfx, color, mesh.geom.num_faces);
   }
}
/** */
export function Set_color_rgb(mesh, col) {

   const color = col;
   math.CopyArr3(mesh.mat.col, color); // BUG: The pervertex color is a Mat4
   math.CopyArr3(mesh.mat.defCol, color); // BUG: The pervertex color is a Mat4

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      Gl_set_rgba_per_vertex(mesh.gfx, color, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      Gl_set_rgba(mesh.gfx, color, mesh.geom.num_faces);
   }
}
/** */
export function Set_hover_color_rgba(mesh) {

   const intensity = 1.1;

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      math.Mult_mat4_scalar2(mesh.mat.col, intensity)
      Gl_set_rgba_per_vertex(mesh.gfx, mesh.mat.col, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      math.Mult_arr4_scalar(mesh.mat.col, intensity);
      Gl_set_rgba(mesh.gfx, mesh.mat.col, mesh.geom.num_faces);
   }
}
/** */
export function Set_default_color_rgba(mesh) {

   const color = mesh.mat.defCol;
   math.CopyArr4(mesh.mat.col, color, mesh.geom.num_faces);

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      Gl_set_rgba_per_vertex(mesh.gfx, color, mesh.geom.num_faces);
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      Gl_set_rgba(mesh.gfx, color, mesh.geom.num_faces);
   }
}
/** */
export function Set_color_a(mesh, alpha) {

   // Handle attribute color per vertex 
   if (mesh.gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX) {
      math.Set_mat4_collumn(mesh.mat.col, alpha, 3)
      Gl_set_rgba_per_vertex(mesh.gfx, mesh.mat.col); // TODO: Do we need a specific function to set only the alpha value?
   }
   else if (mesh.gfx.sid.attr & SID.ATTR.COL4) {
      mesh.mat.col[3] = alpha;
      Gl_set_alpha(mesh.gfx, alpha, mesh.geom.num_faces);
   }

}





/*******************************************************************************************************************************************/
// Positions


/** Returns object type instead of array */
export function Mesh_get_real_pos_xy_obj_t(mesh) {

   const p = Mesh_unif_get_vb_root_wpos_obj_t(mesh.gfx.vb.render_groupidx);

   p.x += mesh.geom.pos[0];
   p.y += mesh.geom.pos[1];
   return p;
}
/** */
export function Mesh_get_real_pos_xy(mesh) {

   const p = Mesh_unif_get_vb_root_wpos(mesh.gfx.vb.render_groupidx);

   p[0] += mesh.geom.pos[0];
   p[1] += mesh.geom.pos[1];
   return p;
}
/** */
export function Mesh_get_real_pos_x(mesh,) {

   let p = Mesh_unif_get_vb_root_wposx(mesh.gfx.vb.render_groupidx);
   return p + mesh.geom.pos[0];
}
/** */
export function Mesh_get_real_pos_y(mesh,) {

   let p = Mesh_unif_get_vb_root_wposy(mesh.gfx.vb.render_groupidx);
   return p + mesh.geom.pos[1];
}
/** */
export function Set_time(mesh, t) {
   mesh.geom.time = t;
}



/** World Position*/
export function Mesh_update_set_wpos_xy(mesh,) {
   Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces);
}
/** */
export function Mesh_update_set_wpos_x(mesh,) {
   Gl_set_wpos_x(mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.num_faces);
}
/** */
export function Mesh_update_set_wpos_y(mesh,) {
   Gl_set_wpos_y(mesh.gfx, mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces);
}
/** */
export function Mesh_set_wpos_xy(mesh, x, y) {
   Gl_set_wpos_xy(mesh.gfx, x + mesh.geom.dim[0], y + mesh.geom.dim[1], mesh.geom.num_faces);
}
/** */
export function Mesh_set_wpos_x(mesh, x) {
   Gl_set_wpos_x(mesh.gfx, x + mesh.geom.dim[0], mesh.geom.num_faces);
}
/** */
export function Mesh_set_wpos_y(mesh, y) {
   Gl_set_wpos_y(mesh.gfx, y + mesh.geom.dim[1], mesh.geom.num_faces);
}
/** */
export function Mesh_add_wpos_xy(mesh, x, y) {
   Gl_add_wpos_xy(mesh.gfx, x, y, mesh.geom.num_faces);
}
/** */
export function Mesh_add_wpos_x(mesh, x) {
   Gl_add_wpos_x(mesh.gfx, x, mesh.geom.num_faces);
}
/** */
export function Mesh_add_wpos_y(mesh, y) {
   Gl_add_wpos_y(mesh.gfx, y, mesh.geom.num_faces);
}
/** Add position to mesh and vertex buffer */
export function Mesh_add_and_copy_wpos_xy(mesh, x, y) {
   mesh.geom.pos[0] += x;
   mesh.geom.pos[1] += y;
   Gl_add_wpos_xy(mesh.gfx, x, y, mesh.geom.num_faces);
}
/** */
export function Mesh_add_and_copy_wpos_x(mesh, x) {
   mesh.geom.pos[0] += x;
   Gl_add_wpos_x(mesh.gfx, x, mesh.geom.num_faces);
}
/** */
export function Mesh_add_and_copy_wpos_y(mesh, y) {
   mesh.geom.pos[1] += y;
   Gl_add_wpos_y(mesh.gfx, y, mesh.geom.num_faces);
}
/** Set position to mesh and vertex buffer */
export function Mesh_set_and_copy_wpos_xy(mesh, x, y) {
   mesh.geom.pos[0] = x;
   mesh.geom.pos[1] = y;
   Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces);
}
/** */
export function Mesh_set_and_copy_wpos_x(mesh, x) {
   mesh.geom.pos[0] = x;
   Gl_set_wpos_x(mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.num_faces);
}
/** */
export function Mesh_set_and_copy_wpos_y(mesh, y) {
   mesh.geom.pos[1] = y;
   Gl_set_wpos_y(mesh.gfx, mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces);
}
/** Set relative world position (via current pos difference) */
export function Mesh_set_wpos_relative_xy(mesh, x, y) {
   const difx = x - mesh.geom.pos[0];
   mesh.geom.pos[0] = x;
   const dify = y - mesh.geom.pos[0];
   mesh.geom.pos[1] = y;
   Gl_set_wpos_xy(mesh.gfx, difx, dify, mesh.geom.num_faces);
}
/** */
export function Mesh_set_wpos_relative_x(mesh, x) {
   const dif = x - mesh.geom.pos[0];
   // const dif = mesh.geom.pos[0]-x;
   mesh.geom.pos[0] = x;
   Gl_add_wpos_x(mesh.gfx, dif, mesh.geom.num_faces);
}
/** */
export function Mesh_set_wpos_relative_y(mesh, y) {
   const dif = y - mesh.geom.pos[0];
   mesh.geom.pos[1] = y;
   Gl_set_wpos_y(mesh.gfx, dif, mesh.geom.num_faces);
}





/*******************************************************************************************************************************************/
// Vertex Positions

/** */
export function Mesh_update_set_dim_xy(mesh,) {
   Gl_set_vpos_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1], mesh.geom.num_faces);
}
/** */
export function Mesh_update_set_dim_x(mesh,) {
   Gl_set_vpos_x(mesh.gfx, mesh.geom.dim[0], mesh.geom.num_faces);
}
/** */
export function Mesh_update_set_dim_y(mesh,) {
   Gl_set_vpos_y(mesh.gfx, mesh.geom.dim[1], mesh.geom.num_faces);
}
/** */
export function Mesh_set_dim_xy(mesh, x, y) {
   Gl_set_vpos_xy(mesh.gfx, x, y, mesh.geom.num_faces);
}
/** */
export function Mesh_set_dim_x(mesh, x) {
   Gl_set_vpos_x(mesh.gfx, x, mesh.geom.num_faces);
}
/** */
export function Mesh_set_dim_y(mesh, y) {
   Gl_set_vpos_y(mesh.gfx, y, mesh.geom.num_faces);
}
/** */
export function Mesh_add_dim_xy(mesh, x, y) {
   Gl_add_vpos_xy(mesh.gfx, x, y, mesh.geom.num_faces);
}
/** */
export function Mesh_add_dim_x(mesh, x) {
   Gl_add_vpos_x(mesh.gfx, x, mesh.geom.num_faces);
}
/** */
export function Mesh_add_dim_y(mesh, y) {
   Gl_add_vpos_y(mesh.gfx, y, mesh.geom.num_faces);
}





/*******************************************************************************************************************************************/
// Rotations
/** */
export function Mesh_rotate_z(mesh, angle) {
   Gl_rotate_z_2d(mesh.gfx, mesh.geom.dim, angle);
   Gl_set_angle(mesh.gfx, angle);
}
/** */
export function Mesh_rotate_z_with_pivot(mesh, angle, pivotx, pivoty) {
   /** 
    * If pivot x = mesh dimx then the mesh rotates on its left side. 
    * If pivot x = mesh -dimx then the mesh rotates on its right side. 
    * If pivot x > mesh |dimx| then rotation pivot is outside the mesh dimentions. 
    * If pivot x < mesh |dimx| then rotation pivot is inside the mesh dimentions. 
    * 
    * If pivot y = mesh dimy then the mesh rotates on its top side. 
    * If pivot y = mesh -dimy then the mesh rotates on its bottom side. 
    * Same as pivot x
    * */
   const vertex_positions = Gl_rotate_z_2d_from_pivot(mesh.gfx, mesh.geom.dim, angle, pivotx, pivoty);
   Gl_set_angle(mesh.gfx, angle);

   return vertex_positions;
}
/** */
export function Mesh_rotate_add_z(mesh, angle) {
   Gl_rotate_add_z_2d(mesh.gfx, mesh.geom.dim, angle);
   Gl_set_angle(mesh.gfx, angle);
}
/** */
export function Mesh_rotate_y(mesh, angle) {
   Gl_rotate_y_2d(mesh.gfx, mesh.geom.dim, angle);
   Gl_set_angle(mesh.gfx, angle);
}
