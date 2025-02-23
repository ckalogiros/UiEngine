"use strict";



export function Style_widget_default(mesh, rcorners) {

   mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   mesh.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   mesh.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

}
