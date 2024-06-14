"use strict";

import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset, Vertex_buffer_group_set_texidx, Vertex_buffer_state_enable } from "../../../Graphics/Buffers/VertexBuffers.js";
import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D_Text } from "../Geometry/Geometry2DText.js";
import { FontMaterial } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Font_get_char_plane_bounds, Font_get_char_uv_coords, Font_get_font_advancex } from "../../Loaders/Font/ChlumskyFontMetricsLoader.js";
import { Gl_set_dim_xy, Gl_set_uv, Gl_set_wpos_xy } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Mesh_per_vb_remove_mesh, Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { WHITE } from "../Material/Base/Colors.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";



export class Text_Mesh extends Mesh {

   fontsize; // TODO: TEMP. Move it to mat or geom or Mesh?
   advancex; // The advancex is a ratio with which we calculate the correct width of any text
   last_charidx; // An index to the last char of each state of the current text.(dynamic text changes, so it is good to always have the last char).

   constructor(text, pos = [0, 0, 0], fontsize = 8, color = WHITE, bold = 4, font = TEXTURES.MSDF_CONSOLAS_1024, scale = [1, 1], is_debug_mesh) {

      const sdfouter = CalculateSdfOuterFromDim(fontsize);
      if (sdfouter + bold > 1) bold = 1 - sdfouter;
      const mat = new FontMaterial(color, font, text, [bold, sdfouter])
      const geom = new Geometry2D_Text(pos, fontsize, scale, text, font);

      super(geom, mat);

      this.last_charidx = text.length;

      this.type |= MESH_TYPE.TEXT_MESH | is_debug_mesh;
      this.fontsize = fontsize;
      this.advancex = Font_get_font_advancex(font);
      // this.geom.pos[0] -= (this.geom.dim[0]/2-1)*this.advancex;
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
   }


   SetTypeDebug() {
      this.type |= MESH_TYPE.DEBUG_MESH;
   }


   RemoveFromMeshPerVbBuffer() {
      Mesh_per_vb_remove_mesh(this.gfx.vb.groupidx, this.per_vb_bufferidx);
   }




   
   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/


   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      return this.gfx;
   }


   AddToGfx() {

      this.#TEMP();

      // KEEP TRACK OF THE MAXIMUM CHARACTERS INSERTED IN GFX.
      // This is important so that we know the length of the faces we must remove from the vertex buffer on text.Destroy
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.boundary + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.boundary + 1;

      // BUG: If one text has by mistake a different 'this.mat.uvIdx', then the vb will store that uv-map index. Cause a vertex buffer may use only one texture.
      Vertex_buffer_group_set_texidx(this.gfx.vb.groupidx, this.gfx.tb.idx); // Update the vertex buffer to store the texture index

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      this.is_gfx_inserted = true;

   }


   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxText)
      this.#TEMP();
      // this.#TEMP_re_add();
      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxText)

      // KEEP TRACK OF THE MAXIMUM CHARACTERS INSERTED IN GFX.
      // This is important so that we know the length of the faces we must remove from the vertex buffer on text.Destroy
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.boundary + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.boundary + 1;

      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      // this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

   }


   // TODO:Use it
   UpdateGfx() {

      this.#TEMP()

      // KEEP TRACK OF THE MAXIMUM CHARACTERS INSERTED IN GFX.
      // This is important so that we know the length of the faces we must remove from the vertex buffer on text.Destroy
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.boundary + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.boundary + 1;

      this.is_gfx_inserted = true;

   }





   
   /*******************************************************************************************************************************************************/
   // Transformations
   /*******************************************************************************************************************************************************/


   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveNoGfxUpdate(x, y);
      }

   }


   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveYNoGfxUpdate(y);
      }

   }


   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveXNoGfxUpdate(x);
      }

   }

   SetPosX(x) {

      super.SetPosX(x);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.SetPosX(x);
      }
   }


   TEMP_recalc(x, y) {

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.TEMP_recalc(x, y);
      }
   }


   SetPosXYNoGfxUpdate(x, y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else {
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
      }
   }


   SetPosXNoGfxUpdate(x) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else this.geom.pos[0] = x;
   }


   SetPosYNoGfxUpdate(y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else this.geom.pos[1] = y;
   }


   SetPosZNoGfxUpdate(val) {
      this.geom.pos[2] = val;
   }


   SetText(str) {

      this.mat.char_buffer.Reset();

      const len = (str.length < this.mat.char_buffer.size) ? str.length : this.mat.char_buffer.size;

      for (let i = 0; i < len; i++) {

         this.mat.char_buffer.Add(str[i]);
      }

      for (let i = len; i < this.mat.char_buffer.size; i++) {

         this.mat.char_buffer.buffer[i] = ''; // We do not want to increment active_count for '' empty characters, so we avoid .Add
      }

      this.mat.text = str;
      this.geom.num_faces = str.length;
   }


   ClipX(limit) {

      const text_len = this.mat.text.length;
      const face_width = this.geom.dim[0] * this.advancex;
      let right = this.GetTextRight_A();

      let changes_happended = false;


      if (right - face_width > limit) {

         changes_happended = true;
         for (let i = this.mat.char_buffer.boundary; i >= 0; i--) {

            this.mat.char_buffer.RemoveByIdx(i);
            this.geom.num_faces--;
            right -= face_width * 2;
            if (right < limit)
               break
         }
      }
      else if (right + face_width < limit && this.mat.char_buffer.active_count < text_len) {

         changes_happended = true;
         for (let i = this.mat.char_buffer.active_count; i < text_len; i++) {
            this.mat.char_buffer.buffer[i] = this.mat.text[i];
            this.mat.char_buffer.boundary++;
            this.mat.char_buffer.active_count++;
            this.geom.num_faces++;
            right += face_width * 2;
            if (right > limit)
               break
         }
      }
   }




   
   /*******************************************************************************************************************************************************/
   // Setters-Getters
   /*******************************************************************************************************************************************************/

   GetMaxWidth() { return (this.geom.dim[0] * this.advancex) * (this.geom.num_faces); }


   GetTotalHeight() { return this.geom.dim[1]; }


   GetCenterPosX() { return this.geom.pos[0] + this.GetMaxWidth() - this.geom.dim[0]; }


   GetTextLeft_A() { return this.GetCenterPosX() - this.GetMaxWidth(); }


   GetTextRight_A() { return this.GetCenterPosX() + this.GetMaxWidth(); }


   SetColorRGB(col, char_len = 0) {
      const num_face = (char_len) ? char_len : this.geom.num_faces;
      this.mat.SetColorRGB(col, this.gfx, num_face)
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   /** Pass array[] of { strings or arrays } */
   SetTextConcat(str_array) {

      this.mat.char_buffer.Reset();

      const len = str_array.length;

      for (let i = 0; i < len; i++) {

         const len2 = str_array[i].length;
         for (let j = 0; j < len2; j++) {

            this.mat.char_buffer.Add(str_array[i][j]);
         }
      }
   }


   SetTextAtIndex(str, start) {

      /**DEBUG */ if (start > this.mat.char_buffer.size) console.error('ERROR @SetTextAtIndex().\n start greater than buffer size.\nstart=', start);

      const len = str.length;

      for (let i = start; i < len; i++) {

         this.mat.char_buffer.AddAtIndex(i, str[i]);
      }
   }


   SliceText(_start = 0, _count = _) {
      // If no start is passed, all characters are removed/replaced
      // count=0, the loop does not run for i<0

      const count = (_count === _ || _count > this.mat.char_buffer.size) ? this.mat.char_buffer.active_count : _count;
      // If start > buffer last char, replace last element
      const start = (_start > this.mat.char_buffer.boundary) ? this.mat.char_buffer.boundary : _start;

      for (let i = start; i < count; i++) {
         this.mat.char_buffer.RemoveByIdx(i);
      }

   }


   // EFFICIENCY: Implement to update only for the changed characters, not all the characters
   /**
    * Also very memory heavy, shown in firefox profiler tools.
    * Probably because of the new GfxInfoMesh and new Geometry2D_Text.
    * Concider building the structs localy.
    */
   RenderTextFromNumber(value) {
      if (value.constructor === Number) {
         // console.log(value, `${value}`)
         this.SetText(`${value}`)
         this.RenderText();
      }
   }


   RenderTextFromString(text) {
      if (text.constructor === String) {
         this.SetText(text);
         this.RenderText();
      }
   }



   RenderText() {
      // console.error('This functions is not implemented for instancing\nAt RenderText()\n At Text_Mesh.js')

      if(!this.gfx)
         console.log
      const store_start = this.gfx.vb.starts.buffer[0];

      // TODO: Remove arrays, substitute with variables
      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0]-this.geom.dim[0]*2, this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }


      const advancex = Font_get_font_advancex(this.mat.texidx);
      const c = this.mat.char_buffer.buffer;
      // const attr = Shader_attributes_get_attribs_offset_size(this.gfx.prog.attribsidx, SHADER_ATTRIBUTES.TEX2);

      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         let uvs = [0, 0, 0, 0]; // Set uvs to ' ' space char, to replace any extra previous text's characters

         if (c[i] !== '') // If char=' ' space, just render [0,0] uv coordinates.
         {
            // Set character dimentions.
            const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, c[i]);
            geom_copy.dim[0] *= plane_bounds.width;
            geom_copy.dim[1] *= plane_bounds.height;
            Gl_set_dim_xy(this.gfx, geom_copy.dim[0], geom_copy.dim[1]);

            // Set character y position and advance.
            // geom_copy.pos[0] += (advancex + plane_bounds.left) * 2 * this.fontsize;
            // geom_copy.pos[1] += geom_copy.dim[1] + (plane_bounds.yoffset * this.fontsize);
            geom_copy.pos[0] += (advancex + plane_bounds.left) * 2 * this.fontsize;
            geom_copy.pos[1] += (plane_bounds.yoffset * this.fontsize);
            Gl_set_wpos_xy(this.gfx, geom_copy.pos[0], geom_copy.pos[1]);

            // Get the correct uv coordinates.
            uvs = Font_get_char_uv_coords(this.mat.uvIdx, c[i]);

            geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1]; // Reset 
         }

         // Gl_set_uv(this.gfx.vb.groupidx, uvs, start, attr.offset, attr.size, this.gfx.attribsPerVertex)
         Gl_set_uv(this.gfx, uvs);

         this.gfx.vb.starts.buffer[0] += this.gfx.vb.counts.buffer[0];
      }

      // If there are characters beyond the renderable, AND the are NOT EMPTY '', render empty char face
      for (let i = this.mat.char_buffer.boundary + 1; i < this.mat.char_buffer.size; i++) {

         let uvs = [0, 0, 0, 0]; // Set uvs to ' ' space char, to replace any extra previous text's characters
         Gl_set_uv(this.gfx, uvs);

         this.gfx.vb.starts.buffer[0] += this.gfx.vb.counts.buffer[0]
      }

      this.gfx.vb.starts.buffer[0] = store_start;
      Vertex_buffer_state_enable(this.gfx.vb.groupidx, this.gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);
   }


   /** Update a specific character in text char array */
   UpdateTextCharacter(_text, idx) {

      // /**DEBUG */ if (_text.length > 1) alert('Try to use a char update function but string is passed');
      // if (!this.gfx) return; // Case this called before text is inserted to gfx buffers.

      // const text = (typeof (_text) === 'number') ? `${_text}` : _text; // Takes arithmetic values or just a char.

      // // Make a copy to not change the default .start value of the first char(face).
      // const gfx_copy = {
      //    vb: { idx: this.gfx.vb.groupidx, start: this.gfx.vb.start, count: this.gfx.vb.count },
      //    prog: { attribsidx: this.gfx.prog.attribsidx },
      //    vertsPerRect: this.gfx.vertsPerRect,
      //    attribsPerVertex: this.gfx.attribsPerVertex,
      // }
      // gfx_copy.vb.start = this.gfx.vb.start + (gfx_copy.vb.count * idx); // Calc the characters position inside the char array.


      // // Make a copy to not change the default face.
      // const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
      //    pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
      //    dim: [this.geom.dim[0], this.geom.dim[1]],
      // }

      // const advancex = Font_get_font_advancex(this.mat.texidx);

      // const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, text);

      // // Set character dimentions. 
      // geom_copy.dim[0] *= plane_bounds.width;
      // geom_copy.dim[1] *= plane_bounds.height;
      // Gl_set_dim_xy(gfx_copy, geom_copy.dim);

      // // Set character y position and advance.
      // geom_copy.pos[0] +=  (advancex+plane_bounds.left) * 2 * this.fontsize;
      // geom_copy.pos[1] += geom_copy.dim[1] + plane_bounds.yoffset * this.fontsize;
      // geom_copy.pos[0] += Floor(this.fontsize * advancex);

      // // Set the correct uv coordinates.
      // const uvs = Font_get_char_uv_coords(this.mat.uvIdx, _text);
      // Gl_set_uv(gfx_copy, uvs);

   }


   ResetText(new_text) {

      const len = new_text.length;
      if(len > this.mat.char_buffer.size) alert('[][][]]sdklljsdm')
      for (let i = 0; i < len; i++) {
         this.mat.char_buffer.buffer[i] = new_text[i];
      }
      this.geom.text = new_text;
      this.geom.num_faces = new_text.length;
   }
      

   #TEMP() {

      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      const advancex = Font_get_font_advancex(this.mat.texidx); // Cash the space character
      this.gfx.tb.idx = this.mat.texidx;
      const face_count = this.mat.char_buffer.active_count; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      const space_char_uv = Font_get_char_uv_coords(this.mat.uvIdx, ' ');

      for (let i = 0; i < face_count; i++) {

         // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
         this.mat.uv = space_char_uv;

         let left_bounds = 0;
         if (this.mat.char_buffer.buffer[i]) { // If there is a text, get char uv and metrics

            this.mat.uv = Font_get_char_uv_coords(this.mat.uvIdx, this.mat.char_buffer.buffer[i]);
            const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, this.mat.char_buffer.buffer[i]);
            geom_copy.dim[0] *= plane_bounds.width;
            geom_copy.dim[1] *= plane_bounds.height;
            geom_copy.pos[0] += plane_bounds.left * this.fontsize;
            geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;
            left_bounds = plane_bounds.left;

         }

         if (i === 0) {
            Vertex_buffer_add_vertices(this.gfx, geom_copy, this.mat, 1, `${this.mat.char_buffer.buffer[i]} in: ${this.GetName()}`);
         }
         else { // The first face exista as an entity, the rest are constructed here and store only to the vertex buffer
            Vertex_buffer_add_vertices_from_reset(this.gfx, geom_copy, this.mat, 1, `${this.mat.char_buffer.buffer[i]} in: ${this.GetName()}`);
         }

         geom_copy.pos[0] += (this.fontsize * 2 * (advancex - left_bounds));

         // Reset geometry copy
         geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1];

      }
   }
}



