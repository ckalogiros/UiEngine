'use strict';

import { Free_generic_buffer, Free_int8_buffer, New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_widget_label } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { TRANSPARENT, YELLOW, YELLOWR } from "../../../../Engine/Drawables/Material/Colors.js";
import { Gl_set_alpha } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Widget_gfx_ready_enable, Style_label_default_properties } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Arkanoid_score_calc } from "./Arkanoid.js";
import { Mesh_set_color_rgba } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";



const SCORE_TEXT_MOD_INITIAL_FONT_SIZE = 5;
const SCORE_TEXT_MOD_FONT = TEXTURES.MTSDF_COMIC_1024;
const SCORE_TEXT_MOD_TEXT_COLOR = YELLOWR[9];
const PRE_INITIALIZED_SCORE_MOD_TEXT_MESHES = 32;

/** */
const vb_groupidxs = {
   label: INT_NULL,
   text_mesh: INT_NULL,
}
/** */
let score_mod_view_group_idx = INT_NULL;
/** */
export function Arkanoid_scoremod_reset() {

   vb_groupidxs.label = INT_NULL;
   vb_groupidxs.text_mesh = INT_NULL;

   score_mod_view_group_idx = INT_NULL;

   _text_mesh_buffer.ResetFull();
   _free_text_idx_buffer.Reset();
}
/** */
export function Arkanoid_scoremod_destroy() {

   Free_generic_buffer(_text_mesh_buffer);
   Free_int8_buffer(_free_text_idx_buffer);
}

/**************************************************************************************************************************************/
// Effects Meshes

/** */
class Score_Mod {

   constructor(score_mod_num, text, x = 0, y = 0, font = TEXTURES.MTSDF_COMIC_1024, font_size = 6, color, text_color, vb_groupidxs = INT_NULL) {

      const mesh = Create_widget_label(Style_label_default_properties({text:text, pos:[0, 0, 4], font_size:font_size, col:TRANSPARENT, text_col:text_color, texture_id:font,}));
      Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:10, });
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidxs.label, vb_groupidxs.text_mesh);


      const difx = x - mesh.geom.dim[0];
      const dify = y - mesh.geom.dim[1];
      mesh.geom.pos[0] += difx;
      mesh.geom.pos[1] += dify;
      mesh.text_mesh.geom.pos[0] += difx;
      mesh.text_mesh.geom.pos[1] += dify;

      Vertex_buffer_calculate_vertexbuffer_render_group_starts();
      View_render_from_view_NEW(mesh.group_bufferidxs[0]);
   

      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx)

      { // abilities
         // Shader_bit_flags_print_enabled_attributes(mesh.sid.attr, `ATTR:  ${mesh.GetName()}`)
         // Shader_bit_flags_print_enabled_attributes(mesh.sid.pass, `PASS:  ${mesh.GetName()}`)
         // Shader_bit_flags_print_enabled_attributes(mesh.text_mesh.sid.attr, `ATTR:  ${mesh.text_mesh.GetName()}`)
         // Shader_bit_flags_print_enabled_attributes(mesh.text_mesh.sid.pass, `PASS:  ${mesh.text_mesh.GetName()}`)

         // mesh.text_mesh.SetColorRGB(REDL);
         // mesh.text_mesh.RenderTextFromString('REDL');
         // if(temp_flag) mesh.text_mesh.RenderTextFromString('AA AS');
      }


      this.number = score_mod_num;

      this.idx = _text_mesh_buffer.Add(this);

      this.mesh = mesh;


      this.is_active = true;
   }
}




/** */
const _text_mesh_buffer = New_generic_buffer(_, '_text_mesh_buffer');
/** */
const _free_text_idx_buffer = New_int8_buffer(PRE_INITIALIZED_SCORE_MOD_TEXT_MESHES, '_free_text_idx_buffer');


/** */
export function Score_mod_get_text_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _text_mesh_buffer.buffer[idx] === undefined) alert('0808080801 Wrong index for _text_mesh_buffer')
   return _text_mesh_buffer.buffer[idx];
}
/** Removes the score_mod mesh from the storage buffer and from rendering, but mesh still remains in the application */
export function Score_mod_remove_text_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _text_mesh_buffer.buffer[idx] === undefined) alert('090909092 Wrong index for _text_mesh_buffer')

   const mesh = _text_mesh_buffer.buffer[idx].mesh;

   mesh.text_mesh.mat.col[3] = 0;
   Gl_set_alpha(mesh.text_mesh.gfx, 0, mesh.text_mesh.geom.num_faces);

   _text_mesh_buffer.buffer[idx].is_active = false;
   _free_text_idx_buffer.Add(idx);

}
/** Removes the score_mod mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application) */
export function Score_mod_destroy_text_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _text_mesh_buffer.buffer[idx] === undefined) alert('0808080803 Wrong index for _text_mesh_buffer')
   const mesh = _text_mesh_buffer.buffer[idx].mesh;
   _text_mesh_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}
/** */
export function Score_mod_init_buffer(group_idx, parent_root_posidx, parent_mesh_bufferidx, num_effect_meshes = PRE_INITIALIZED_SCORE_MOD_TEXT_MESHES) {

   let score_mod = null;

   for (let i = 0; i < num_effect_meshes; i++) {

      score_mod = new Score_Mod(1.2, 'x1.2', _, _, SCORE_TEXT_MOD_FONT, SCORE_TEXT_MOD_INITIAL_FONT_SIZE, _, SCORE_TEXT_MOD_TEXT_COLOR, vb_groupidxs);

      if (vb_groupidxs.label === INT_NULL) {

         vb_groupidxs.label = score_mod.mesh.gfx.vb.groupidx;
         vb_groupidxs.text_mesh = score_mod.mesh.text_mesh.gfx.vb.groupidx;
      }

      Score_mod_remove_text_mesh_byidx(score_mod.idx);
   }

   score_mod_view_group_idx = group_idx;
   // Implement to draw wpos from a root uniform wpos 
   if (parent_root_posidx !== INT_NULL) Mesh_unif_hack_parent_root_wpos(score_mod.mesh.root_posidx, parent_root_posidx, parent_mesh_bufferidx);

   return vb_groupidxs;
}
/** */
export function Score_mod_create(score_mod_number, text, x, y, font, font_size, color = TRANSPARENT, text_color = YELLOW[9]) {

   let idx = INT_NULL;

   const freeidx = _free_text_idx_buffer.boundary;


   if (freeidx >= 0) {

      idx = _free_text_idx_buffer.buffer[freeidx];
      const score_mod = _text_mesh_buffer.buffer[idx];


      score_mod.mesh.SetWposXY(x, y);
      score_mod.mesh.text_mesh.RenderTextFromString(text);

      Mesh_set_color_rgba(score_mod.mesh.text_mesh, text_color)
      score_mod.is_active = true;

      // Remove from the free idxs buffer
      _free_text_idx_buffer.RemoveByIdx(freeidx);

   }
   else { // If no apropriate free mesh was found, create new mesh

      // TODO: How to find the vb idx if a new text needs to be created in the already created vb?

      const score_mod = new Score_Mod(score_mod_number, text, x, y, font, font_size, color, text_color, vb_groupidxs);
      idx = score_mod.idx;

   }

   _text_mesh_buffer.buffer[idx].number = score_mod_number;
   Arkanoid_score_calc(score_mod_number);

   return idx;

}







/******************************************************************************************************/
// DEBUG_PRINT

/** */
export function Arkanois_print_scrore_mod() {
   console.log('---- Score modifier - Arkanoid ----');
   console.log('buffer', _text_mesh_buffer.buffer, '\nfree buffer', _free_text_idx_buffer.buffer);
   return { _text_mesh_buffer: _text_mesh_buffer, _free_text_idx_buffer: _free_text_idx_buffer }
}