"use strict";

import { COLOR_GRADIENT_VERTICAL, GREY } from "../../Engine/Drawables/Material/Base/Colors";



export function Widget_gfx_ready_enable_default(mesh, rcorners) {

   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   // mesh.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   // mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

}
/**
 * 
 * @param {Int} enable_sdf_rect Value for the rounding of the corners in pixels
 */
export function Widget_gfx_ready_enable( { 
   mesh=null, 
   enable_sdf_rect, 
   enable_unif_wpos = true, 
   enable_attr_dim=true, 
   enable_pass_vpos=false, 
   enable_col_per_vertex, 
}) {

   if(enable_unif_wpos) mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   if(enable_attr_dim) mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   if(enable_pass_vpos) mesh.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);

   if(enable_sdf_rect!==undefined) {

      mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, enable_sdf_rect);
      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   }

   if(enable_col_per_vertex!==undefined) {
      mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, enable_col_per_vertex);
   }

}
