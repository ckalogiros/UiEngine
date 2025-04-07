"use strict";

import { MESH_ENABLE, SID, UNIF_TYPE } from "../../Graphics/Global/GfxConstants.js";




export function Widget_gfx_ready_enable_default(mesh, rcorners) {

   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   // mesh.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

}
/**
 * 
 * @param {Int} enable_sdf_rect Value for the rounding of the corners in pixels
 * 
 * 
 * enable_attr: flag
 * pass_attr: flag
 * 
 * 
 */
export function Widget_gfx_ready_enable({
   mesh = null,
   enable_sdf_rect,
   enable_unif_wpos = true,
   enable_unif_blend = true,
   enable_unif_scale = false,
   enable_unif_time = false,
   // enable_unif_gen_ctrl = null,
   enable_src_color_in_main = true,
   enable_attr_dim = false,
   enable_pass_vpos = false,
   enable_pass_wpos = false,
   enable_col_per_vertex,
   enable_attr_angle,
   enable_blend_mode,
}) {

   if (enable_unif_wpos) mesh.EnableGfxUniforms({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   if (enable_unif_blend) mesh.EnableGfxUniforms({ unif: SID.UNIF.BLEND_MODE }, 'u_blend_mode', UNIF_TYPE.INT, UNIFORM.IN_FS);
   if (enable_unif_scale) mesh.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   if (enable_unif_time) mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
   // if (enable_unif_gen_ctrl) mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, enable_unif_gen_ctrl.controls_count);

   if (enable_attr_dim) { mesh.GfxEnableAttr(SID.ATTR.DIM2); mesh.GfxPassAttr(SID.ATTR.DIM2); }
   if (enable_pass_vpos) { mesh.GfxPassAttr(SID.ATTR.VPOS2); }
   if (enable_pass_wpos) { mesh.GfxPassAttr(SID.ATTR.WPOS3); }

   if (enable_src_color_in_main) mesh.sid.shad |= SID.SHAD.ENABLE_SRC_COLOR_IN_FRAG_MAIN;


   if (enable_sdf_rect !== undefined) {

      if (Array.isArray(enable_sdf_rect)) {
         mesh.GfxEnableAttr(SID.ATTR.R_CORNERS | SID.ATTR.DIM2, { rcorners: enable_sdf_rect[0] });
      }
      else mesh.GfxEnableAttr(SID.ATTR.R_CORNERS | SID.ATTR.DIM2, { rcorners: enable_sdf_rect });
      mesh.GfxPassAttr(SID.ATTR.R_CORNERS | SID.ATTR.DIM2 | SID.ATTR.VPOS2);

      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   }

   if (enable_col_per_vertex !== undefined) {
      // mesh.GfxEnableAttr(SID.ATTR.COL4_PER_VERTEX, enable_col_per_vertex);
      mesh.GfxEnableAttr(SID.ATTR.COL4_PER_VERTEX,);
   }

   if (enable_attr_angle !== undefined) {
      mesh.GfxEnableAttr(SID.ATTR.ANGLE, enable_attr_angle);
      mesh.GfxPassAttr(SID.ATTR.ANGLE);
   }

   if (enable_blend_mode !== undefined) {
      mesh.GfxEnableBlend(enable_blend_mode);
   }

}
/** SAVE-USING OLD ENABLE of Mesh.js */
// export function Widget_gfx_ready_enable({
//    mesh = null,
//    enable_sdf_rect,
//    enable_unif_wpos = true,
//    enable_attr_dim = true,
//    enable_pass_vpos = false,
//    enable_pass_wpos = false,
//    enable_col_per_vertex,
//    enable_attr_angle,
//    enable_blend_mode,
// }) {

//    if (enable_unif_wpos) mesh.EnableGfxUniforms({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    mesh.EnableGfxUniforms({ unif: SID.UNIF.BLEND_MODE }, 'u_blend_mode', UNIF_TYPE.INT, UNIFORM.IN_FS);

//    if (enable_attr_dim) mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
//    if (enable_pass_vpos) mesh.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
//    if (enable_pass_wpos) mesh.EnableGfx(MESH_ENABLE.GFX.PASS_WPOS2);
//    if (enable_sdf_rect !== undefined) {

//       if (Array.isArray(enable_sdf_rect)) {

//          mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, enable_sdf_rect[0], enable_sdf_rect[1], enable_sdf_rect[2]);
//       }
//       else mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, enable_sdf_rect);
//       // mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//       mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
//    }

//    if (enable_col_per_vertex !== undefined) {
//       mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, enable_col_per_vertex);
//    }

//    if (enable_attr_angle !== undefined) {
//       mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE);
//    }

//    if (enable_blend_mode !== undefined) {
//       mesh.GfxEnableBlend(enable_blend_mode);
//    }

// }
