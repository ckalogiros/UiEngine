"use strict"

import { Bitwise_calc_bit_length_from_flag_base } from "../../../../Engine/Core/BitwiseOps.js";
import { Free_generic_buffer, Free_int8_buffer, New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { View_add_to_group } from "../../../../Engine/Core/Views/MeshBufferViews.js";
import { BLACK, WHITE } from "../../../../Engine/Drawables/Material/Colors.js";
import { Mesh_set_color_rgba, Mesh_update_set_dim_xy } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Gl_set_wpos_x, Gl_set_wpos_xy } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Arkanoid_get_panel_dim_x } from "./Arkanoid.js";
import { ARKANOID_COLORS, ARKANOID_FLAGS } from "./ArkanoisConstants.js";
import { Ball_animation_scale, Ball_create, BALL_SIZE } from "./Ball.js";
import { Gun_create_animation } from "./BulletGun.js";
import { Player_create_animation_scale } from "./Player.js";



/** */
const POWUP_COLORS_ARRAY = [
   ARKANOID_COLORS.green,
   ARKANOID_COLORS.blue,
   ARKANOID_COLORS.purple,
   ARKANOID_COLORS.yellow,
];
/** */
const POWUP_INIT_SIZE = 26;
/** */
const PRE_INITIALIZED_POWUP_MESHES = 12;
/** */
let powup_vb_groupidx = INT_NULL;
/** */
export function Arkanoid_powerup_reset() {

   _powup_buffer.ResetFull();
   _free_powup_idx_buffer.Reset();
}
/** */
export function Arkanoid_powup_destroy() {

   Free_generic_buffer(_powup_buffer);
   Free_int8_buffer(_free_powup_idx_buffer);
}



/**************************************************************************************************************************************/
//

/** */
class Powup {

   constructor(x = 0, y = 0, color = WHITE, texture_file_id = INT_NULL, vb_groupidx = INT_NULL) {

      const mesh = Create_rect_mesh(Style_rect_default_properties({pos:[0, 0, 3], dim:[POWUP_INIT_SIZE, POWUP_INIT_SIZE], col:color, name:'PowupMesh', }));
      Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:10, enable_src_color_in_main:false,});


      // mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // this.control_values = [1, 1, 1, 1, .02, .99];
      // this.control_values = [1, 1., 1., .55, .14, 1,];
      // this.control_values = [.22, .24, .34, 1, 1, 1,];
      // this.control_values = [1, 1., 1., 1., .14, 1,];
      // this.control_values = [1, 1., 1., 1., .44, 1,];
      this.control_values = [.59, .78, 1., .18, .09, .36];
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, this.control_values.length);

      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);


      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;
          
      Vertex_buffer_calculate_render_group_starts();
      View_render_from_view_NEW(mesh.group_bufferidxs[0]);
   

      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);

      if (powup_vb_groupidx === INT_NULL) powup_vb_groupidx = mesh.gfx.vb.groupidx;


      if (vb_groupidx.label === INT_NULL) {
         Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      }

      this.idx = _powup_buffer.Add(this);
      this.mesh = mesh;
      this.is_active = true;

   }

}




/** */
const _powup_buffer = New_generic_buffer(_, '_powup_buffer');
/** */
const _free_powup_idx_buffer = New_int8_buffer(PRE_INITIALIZED_POWUP_MESHES, '_free_powup_idx_buffer');


/** */
export function Powup_get_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _powup_buffer.buffer[idx] === undefined) alert('1231231231231 Wrong index for _powup_buffer')
   return _powup_buffer.buffer[idx];
}
/** Removes the powup mesh from the storage buffer and from rendering, but mesh still remains in the application */
export function Powup_remove_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _powup_buffer.buffer[idx] === undefined) alert('1231231231232 Wrong index for _powup_buffer')

   const mesh = _powup_buffer.buffer[idx].mesh;

   mesh.geom.pos[0] = OUT_OF_VIEW;
   Gl_set_wpos_x(mesh.gfx, OUT_OF_VIEW);

   _powup_buffer.buffer[idx].is_active = false;
   _free_powup_idx_buffer.Add(idx);

}
/** Removes the powup mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application) */
export function Powup_destroy_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _powup_buffer.buffer[idx] === undefined) alert('1231231231233 Wrong index for _powup_buffer')
   const mesh = _powup_buffer.buffer[idx].mesh;
   _powup_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}
/** */
export function Powup_remove_all() {

   for (let i = 0; i <= _powup_buffer.boundary; i++) {

      const powup = _powup_buffer.buffer[i];
      if (powup.is_active)
         Powup_remove_byidx(powup.idx);
   }
}
/** */
export function Powup_init_buffer(group_idx, parent_root_posidx, parent_mesh_bufferidx, num_effect_meshes = PRE_INITIALIZED_POWUP_MESHES) {

   let vb_groupidx = INT_NULL;
   let powup = null;

   for (let i = 0; i < num_effect_meshes; i++) {

      powup = new Powup(_, _, _, _, vb_groupidx);
      vb_groupidx = powup.mesh.gfx.vb.groupidx;

      // Add to View Group
      View_add_to_group(powup.mesh, group_idx);
      // Implement to draw wpos from a root uniform wpos 
      if (parent_root_posidx !== INT_NULL) Mesh_unif_hack_parent_root_wpos(powup.mesh.root_posidx, parent_root_posidx, parent_mesh_bufferidx);

      Powup_remove_byidx(powup.idx);
   }

   const control_values = _powup_buffer.buffer[0].control_values
   // _powup_buffer.buffer[0].mesh.GfxUniformSetAndUpdate('u_generic_controls', [.22, .24, .34, 1, 1, 1, 1, 1]);
   _powup_buffer.buffer[0].mesh.GfxUniformSetAndUpdate('u_generic_controls', control_values);

   return powup;
}
/** */
export function Powup_create(x, y, w, h, w_src = 0, h_src = 0, powup_type_flag, col = BLACK) {

   let idx = INT_NULL;

   const freeidx = _free_powup_idx_buffer.boundary;

   w = POWUP_INIT_SIZE;
   h = POWUP_INIT_SIZE;

   // Calculate an index from flag, starting from index 0 by using a base
   const color_index = Bitwise_calc_bit_length_from_flag_base(powup_type_flag, ARKANOID_FLAGS.POWUP_BASE);
   const color = POWUP_COLORS_ARRAY[color_index];

   if (freeidx >= 0) {

      idx = _free_powup_idx_buffer.buffer[freeidx];
      const powup = _powup_buffer.buffer[idx].mesh;

      powup.geom.pos[0] = x - w + w_src;
      powup.geom.pos[1] = y - h + h_src;
      Gl_set_wpos_xy(powup.gfx, powup.geom.pos[0] + w, powup.geom.pos[1] + h);

      
      powup.geom.dim[0] = w;
      powup.geom.dim[1] = h;
      Mesh_update_set_dim_xy(powup);

      Mesh_set_color_rgba(powup, color);

      _powup_buffer.buffer[idx].is_active = true;

      // Remove from the free idxs buffer
      _free_powup_idx_buffer.RemoveByIdx(freeidx);
   }
   else { // If no apropriate free mesh was found, create new mesh

      // TODO: How to find the vb idx if a new text needs to be created in the already created vb?
      const powup = new Powup(x - w + w_src, y - h + h_src, color, _, powup_vb_groupidx);
      idx = powup.idx;
   }


   return idx;

}
/** */
// POW_BALL, NEW_BALL, SCALE_BALL, CREATE_BALL, SCALE_PLAYER, FIRE_BULLET
export function Powup_resolve_hit(powup_idx, powup_type_flag) {

   if (powup_type_flag & ARKANOID_FLAGS.POWUP_SCALE_PLAYER) {
      Player_create_animation_scale();
   }
   else if (powup_type_flag & ARKANOID_FLAGS.POWUP_SCALE_BALL) {
      Ball_animation_scale();
   }
   else if (powup_type_flag & ARKANOID_FLAGS.POWUP_NEW_BALL) {
      const powup = _powup_buffer.buffer[powup_idx];
      let ball_posx = powup.mesh.geom.pos[0] + powup.mesh.geom.dim[0];
      const panel_dimx = Arkanoid_get_panel_dim_x() * 2;
      if (ball_posx > panel_dimx) ball_posx = panel_dimx - BALL_SIZE * 2;
      else if (ball_posx < 0) ball_posx = BALL_SIZE * 2;
      const ball_posy = powup.mesh.geom.pos[1] + powup.mesh.geom.dim[1];
      Ball_create(ball_posx, ball_posy, _);
   }
   else if (powup_type_flag & ARKANOID_FLAGS.POWUP_FIRE_BULLET) {
      Gun_create_animation();

   }
}







/*******************************************************************************************************/
// Debug Print
/** */
export function Powup_print() {
   console.log(
      'Powerup buffer', _powup_buffer.buffer,
   );
}