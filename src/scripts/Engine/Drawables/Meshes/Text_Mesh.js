"use strict";

import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_non_existant_mesh, Vertex_buffer_set_texidx, Vertex_buffer_state_enable } from "../../../Graphics/Buffers/VertexBuffers.js";
import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { Abs, AddArr3, CopyArr3, Floor } from "../../../Helpers/Math/MathOperations.js";
import { Gfx_generate_context, GfxInfoMesh } from "../../Interfaces/Gfx/MeshGfxContext.js"; ``
import { Geometry2D_Text } from "../Geometry/Geometry2DText.js";
import { FontMaterial } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Font_get_char_atlas_bounds, Font_get_char_atlas_bounds_left, Font_get_char_atlas_bounds_width, Font_get_char_plane_bounds, Font_get_char_uv_coords, Font_get_font_advancex, Font_get_font_ascender, Font_get_font_descender, Font_get_font_line_height } from "../../Loaders/Font/ChlumskyFontMetricsLoader.js";
import { Gl_set_dim_XY, Gl_set_uv, Gl_set_uv2, Gl_set_wpos_XY } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Gfx_buffer_remove_mesh_by_vbidx, Gfx_buffer_store } from "../../Core/MeshBuffer.js";
import { Shader_attributes_get_attribs_offset_size } from "../../../Graphics/ShaderAttributes.js";
import { WHITE } from "../Material/Base/Colors.js";



export class Text_Mesh extends Mesh {

   fontsize; // TODO: TEMP. Move it to mat or geom or Mesh?
   advancex; // The advancex is a ratio with which we calculate the correct width of any text
   last_charidx; // An index to the last char of each state of the current text.(dynamic text changes, so it is good to always have the last char).

   constructor(text, pos = [0, 0, 0], fontsize = 8, color = WHITE, bold = 4, font = TEXTURES.MSDF_CONSOLAS_1024, scale = [1, 1]) {

      const sdfouter = CalculateSdfOuterFromDim(fontsize);
      if (sdfouter + bold > 1) bold = 1 - sdfouter;
      const mat = new FontMaterial(color, font, text, [bold, sdfouter])
      const geom = new Geometry2D_Text(pos, fontsize, scale, text, font);

      super(geom, mat);

      this.last_charidx = text.length;

      this.type |= MESH_TYPE.TEXT_MESH;
      this.fontsize = fontsize;
      this.advancex = Font_get_font_advancex(font);
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
   }
      

   SetTypeDebug(){
      this.type |= MESH_TYPE.DEBUG_MESH;
   }
   

   AddToGfxBuffer() { 
      this.gfx_bufferidx = Gfx_buffer_store(this.gfx.vb.idx, this.mesh_bufferidx);
   }


   RemoveFromGfxBuffer() { 
      Gfx_buffer_remove_mesh_by_vbidx(this.gfx.vb.idx, this.gfx_bufferidx);
   }


   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/


   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidxs=[INT_NULL, INT_NULL]) {

      this.gfx = Gfx_generate_context(FLAGS, this, gfxidxs);

      return this.gfx;
   }


   AddToGfx() {

      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      const advancex = Font_get_font_advancex(this.mat.texidx); // Cash the space character
      const line_height = Font_get_font_line_height(this.mat.texidx); // Cash the space character
      const ascender = Font_get_font_ascender(this.mat.texidx); // Cash the space character
      const descender = Font_get_font_descender(this.mat.texidx); // Cash the space character

      this.gfx.tb.idx = this.mat.texidx;
      const face_count = this.mat.text.length; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      const space_char_uv = Font_get_char_uv_coords(this.mat.uvIdx, ' ');

      let prev_half_dim_x = 0;
      let posx = 0;
      const ratio = 1/advancex; // Normalize advance

      prev_half_dim_x = geom_copy.dim[0];

      const size = this.geom.dim[0];

      for (let i = 0; i < face_count; i++) {
         
         // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
         this.mat.uv = space_char_uv;
         
         const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, this.mat.text[i]);
         const left_offset = (plane_bounds.left * ratio) * size;


         if (this.mat.text[i]) { // If there is a text, get char uv and metrics
            
            this.mat.uv = Font_get_char_uv_coords(this.mat.uvIdx, this.mat.text[i]);
            // geom_copy.dim[0] *= plane_bounds.width;
            // geom_copy.dim[1] *= plane_bounds.height;
            // geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;
            
            // geom_copy.dim[0] = (plane_bounds.width * size) + left_offset;
            geom_copy.dim[0] = (plane_bounds.width * size);
            geom_copy.dim[1] = plane_bounds.height * size;
            geom_copy.pos[1] += plane_bounds.yoffset * size;
            
         }
         
         
         if (i === 0) {
            Vertex_buffer_add_vertices(this.gfx, geom_copy, this.mat, `${this.mat.text[i]} in: ${this.GetName()}`);
         }
         else { // The first face exista as an entity, the rest are constructed here and store only to the vertex buffer
            Vertex_buffer_add_vertices_from_non_existant_mesh(this.gfx, geom_copy, this.mat, `${this.mat.text[i]} in: ${this.GetName()}`);
         }
         


         if(this.mat.text[i] === ' ') posx = size * 2 * advancex;
         else posx = ((plane_bounds.width * ratio) * size) + left_offset;
         geom_copy.pos[0] += posx;

         // Reset geometry copy
         // geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; 
         geom_copy.pos[1] = this.geom.pos[1];

      }

      // BUG: If one text has by mistake a different 'this.mat.uvIdx', then the vb will store that uv-map index. Cause a vertex buffer may use only one texture.
      Vertex_buffer_set_texidx(this.gfx.vb.idx, this.gfx.tb.idx); // Update the vertex buffer to store the texture index


      this.is_gfx_inserted = true;

   }


   AddToGfxFromReset() {

      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      const advancex = Font_get_font_advancex(this.mat.texidx);
      this.gfx.tb.idx = this.mat.texidx;
      const face_count = this.mat.text.length; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      const space_char_uv = Font_get_char_uv_coords(this.mat.uvIdx, ' ');


      for (let i = 0; i < face_count; i++) {

         // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
         this.mat.uv = space_char_uv;

         if (this.mat.text[i]) { // If there is a text, get char uv and metrics

            this.mat.uv = Font_get_char_uv_coords(this.mat.uvIdx, this.mat.text[i]);
            const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, this.mat.text[i]);
            geom_copy.dim[0] *= plane_bounds.width;
            geom_copy.dim[1] *= plane_bounds.height;
            geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;

         }

         if (i === 0) {
            Vertex_buffer_add_vertices(this.gfx, geom_copy, this.mat, `${this.mat.text[i]} in: ${this.GetName()}`);
            // if (this.sid.shad & SID.SHAD.INDEXED) Index_buffer_add_indices(this.gfx.ib, `${this.mat.text[i]} in: ${this.GetName()}`);
         }
         else {
            Vertex_buffer_add_vertices_from_non_existant_mesh(this.gfx, geom_copy, this.mat, `${this.mat.text[i]} in: ${this.GetName()}`);
            // if (this.sid.shad & SID.SHAD.INDEXED) Index_buffer_add_indices_from_non_existant_mesh(this.gfx.ib, `${this.mat.text[i]} in: ${this.GetName()}`);
         }


         geom_copy.pos[0] += (this.fontsize * 2 * advancex);

         // Reset geometry copy
         geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1];

      }

      this.is_gfx_inserted = true;
      
      // Add entry to Gfx Buffer
      // this.gfx_bufferidx = Gfx_buffer_store(this.gfx.vb.idx, this.mesh_bufferidx);

   }

   
   ResetText(new_text){
      this.mat.text = new_text;
      this.geom.text = new_text;
      this.geom.num_faces = new_text.length;
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


   UpdatePosZ(z) {
      this.geom.UpdatePosZ(z, this.gfx, this.geom.num_faces)      // const params = {
   }


   SetZPos(z) {
      this.geom.pos[2] = z;
   }


   SetText(str) {
      this.mat.text = str;
   }


   UpdatePosXYZ() {

      // alert()
      const text = this.mat.text;

      const textLen = text.length;
      const len = this.geom.num_faces > textLen ? this.geom.num_faces : textLen;

      const charPos = [0, 0, 0];
      CopyArr3(charPos, this.geom.pos)

      // Copy gfx, to pass new start for each character
      let gfxcopy = new GfxInfoMesh(this.gfx);

      for (let i = 0; i < len; i++) {

         this.geom.UpdateFromPosXYZ(gfxcopy, charPos); // For text we need to give a 'next' position for every characters
         gfxcopy.vb.start += gfxcopy.vb.boundary;
         charPos[0] += this.geom.dim[0] * 2;
      }
   }


   // EFFICIENCY: Implement to update only for the changed characters, not all the characters
   /**
    * Also very memory heavy, shown in firefox profiler tools.
    * Probably because of the new GfxInfoMesh and new Geometry2D_Text.
    * Concider building the structs localy.
    */
   UpdateText(_text) {

      if (!this.gfx) return; // Case replace text before insert to gfx buffers;

      let text = (typeof (_text) === 'number') ? `${_text}` : _text; // Takes arithmetic values or just a char.

      const gfx_copy = {
         vb: { idx: this.gfx.vb.idx, start: this.gfx.vb.start, count: this.gfx.vb.count },
         prog: { attribsidx: this.gfx.prog.attribsidx },
         vertsPerRect: this.gfx.vertsPerRect,
         attribsPerVertex: this.gfx.attribsPerVertex,
      }

      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }


      const advancex = Font_get_font_advancex(this.mat.texidx);

      const numchars = text.length;
      // NOTE: We want to run for max chars to reset any extra from the current text
      const len = (this.geom.num_faces > numchars) ? this.geom.num_faces :
         (numchars > this.geom.num_faces ? this.geom.num_faces : numchars);

      // let len = 0;
      // if (numchars > this.last_charidx) {
      //    len = numchars < this.geom.num_faces ? numchars : this.geom.num_faces;
      //    this.last_charidx = len
      // }
      // else {
      //    len = this.last_charidx;
      //    this.last_charidx = numchars
      // }


      const attr = Shader_attributes_get_attribs_offset_size(gfx_copy.prog.attribsidx, SHADER_ATTRIBUTES.TEX2);

      let prev_half_dim_x = 0;
      let posx = 0;

      // Update text faces
      for (let i = 0; i < len; i++) {

         let uvs = [0, 0, 0, 0]; // Set uvs to ' ' space char, to replace any extra previous text's characters

         if (text[i] !== undefined) // If char=' ' space, just render [0,0] uv coordinates.
         {
            // Set character dimentions.
            const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, text[i]);
            geom_copy.dim[0] *= plane_bounds.width;
            geom_copy.dim[1] *= plane_bounds.height;
            Gl_set_dim_XY(gfx_copy, geom_copy.dim);

            // // Set character y position and advance.
            geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;
            Gl_set_wpos_XY(gfx_copy, geom_copy.pos);
            posx = geom_copy.dim[0] + prev_half_dim_x;
            geom_copy.pos[0] += posx;
            prev_half_dim_x = geom_copy.dim[0];

            // Get the correct uv coordinates.
            uvs = Font_get_char_uv_coords(this.mat.uvIdx, text[i]);

            geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1]; // Reset 
         }

         Gl_set_uv2(gfx_copy.vb.idx, uvs, gfx_copy.vb.start, attr.offset, attr.size, gfx_copy.attribsPerVertex)

         gfx_copy.vb.start += gfx_copy.vb.count
      }

      Vertex_buffer_state_enable(gfx_copy.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
   }
   // UpdateText(_text) {

   //    if (!this.gfx) return; // Case replace text before insert to gfx buffers;

   //    let text = (typeof (_text) === 'number') ? `${_text}` : _text; // Takes arithmetic values or just a char.

   //    const gfx_copy = {
   //       vb: { idx: this.gfx.vb.idx, start: this.gfx.vb.start, count: this.gfx.vb.count },
   //       prog: { attribsidx: this.gfx.prog.attribsidx },
   //       vertsPerRect: this.gfx.vertsPerRect,
   //       attribsPerVertex: this.gfx.attribsPerVertex,
   //    }

   //    const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
   //       pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
   //       dim: [this.geom.dim[0], this.geom.dim[1]],
   //    }


   //    const advancex = Font_get_font_advancex(this.mat.texidx);

   //    const numchars = text.length;
   //    // NOTE: We want to run for max chars to reset any extra from the current text
   //    const len = (this.geom.num_faces > numchars) ? this.geom.num_faces :
   //       (numchars > this.geom.num_faces ? this.geom.num_faces : numchars);

   //    // let len = 0;
   //    // if (numchars > this.last_charidx) {
   //    //    len = numchars < this.geom.num_faces ? numchars : this.geom.num_faces;
   //    //    this.last_charidx = len
   //    // }
   //    // else {
   //    //    len = this.last_charidx;
   //    //    this.last_charidx = numchars
   //    // }


   //    const attr = Shader_attributes_get_attribs_offset_size(gfx_copy.prog.attribsidx, SHADER_ATTRIBUTES.TEX2);

   //    // Update text faces
   //    for (let i = 0; i < len; i++) {

   //       let uvs = [0, 0, 0, 0]; // Set uvs to ' ' space char, to replace any extra previous text's characters

   //       if (text[i] !== undefined) // If char=' ' space, just render [0,0] uv coordinates.
   //       {
   //          // Set character dimentions.
   //          const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, text[i]);
   //          geom_copy.dim[0] *= plane_bounds.width;
   //          geom_copy.dim[1] *= plane_bounds.height;
   //          Gl_set_dim_XY(gfx_copy, geom_copy.dim);

   //          // // Set character y position and advance.
   //          geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;
   //          Gl_set_wpos_XY(gfx_copy, geom_copy.pos);
   //          geom_copy.pos[0] += Floor(this.fontsize * 2 * advancex);

   //          // Get the correct uv coordinates.
   //          uvs = Font_get_char_uv_coords(this.mat.uvIdx, text[i]);

   //          geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1]; // Reset 
   //       }

   //       Gl_set_uv2(gfx_copy.vb.idx, uvs, gfx_copy.vb.start, attr.offset, attr.size, gfx_copy.attribsPerVertex)

   //       gfx_copy.vb.start += gfx_copy.vb.count
   //    }

   //    Vertex_buffer_state_enable(gfx_copy.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
   // }

   /** Update a specific character in text char array */
   UpdateTextCharacter(_text, idx) {

      /**DEBUG */ if (_text.length > 1) alert('Try to use a char update function but string is passed');
      if (!this.gfx) return; // Case this called before text is inserted to gfx buffers.

      const text = (typeof (_text) === 'number') ? `${_text}` : _text; // Takes arithmetic values or just a char.

      // Make a copy to not change the default .start value of the first char(face).
      const gfx_copy = {
         vb: { idx: this.gfx.vb.idx, start: this.gfx.vb.start, count: this.gfx.vb.count },
         prog: { attribsidx: this.gfx.prog.attribsidx },
         vertsPerRect: this.gfx.vertsPerRect,
         attribsPerVertex: this.gfx.attribsPerVertex,
      }
      gfx_copy.vb.start = this.gfx.vb.start + (gfx_copy.vb.count * idx); // Calc the characters position inside the char array.


      // Make a copy to not change the default face.
      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      const advancex = Font_get_font_advancex(this.mat.texidx);

      const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, text);

      // Set character dimentions. 
      geom_copy.dim[0] *= plane_bounds.width;
      geom_copy.dim[1] *= plane_bounds.height;
      Gl_set_dim_XY(gfx_copy, geom_copy.dim);

      // Set character y position and advance.
      geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;
      geom_copy.pos[0] += this.geom.dim[0];
      geom_copy.pos[0] += Floor(this.fontsize * advancex);

      // Set the correct uv coordinates.
      const uvs = Font_get_char_uv_coords(this.mat.uvIdx, _text);
      Gl_set_uv(gfx_copy, uvs);

   }



   /*******************************************************************************************************************************************************/
   // Setters-Getters
   // IMPORTANT !!! The dim[0] of any text should be multiplied with advancex for correct calculation.

   // GetMaxWidth() { return this.geom.dim[0] / 2 * (this.geom.num_faces) + 1; }
   GetMaxWidth() { return (this.geom.dim[0] * this.advancex) * (this.geom.num_faces); }


   GetTotalHeight() { return this.geom.dim[1]; }


   GetCenterPosX() { return this.geom.pos[0] + this.GetMaxWidth() - this.geom.dim[0]; }


   GetCenterPosY() { return this.geom.pos[1]; }


   GetLeft_A() { return this.geom.pos[0] - this.geom.pos[0]; }


   GetRight_A() { return this.geom.pos[0] + this.geom.pos[0]; }


   GetTop_A() { return this.geom.pos[1] - this.geom.pos[1]; }


   GetBottom_A() { return this.geom.pos[1] + this.geom.pos[1]; }


   GetTextLeft_A() { return this.GetCenterPosX() - this.GetMaxWidth(); }


   GetTextRight_A() { return this.GetCenterPosX() + this.GetMaxWidth(); }


   GetTextTop_A() { return this.GetTop_A(); } // UNNECESSARY


   GetTextBottom_A() { return this.GetBottom_A(); } // UNNECESSARY



   SetColorRGB(col, char_len = 0) {
      const num_face = (char_len) ? char_len : this.geom.num_faces;
      this.mat.SetColorRGB(col, this.gfx, num_face)
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
   }


   SetPosXNoGfxUpdate(x) {
      this.geom.pos[0] = x;
   }


   SetPosYNoGfxUpdate(y) {
      this.geom.pos[1] = y;
   }


   SetPosXYNoGfxUpdate(x, y) {
      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
   }



   /*******************************************************************************************************************************************************/
   // Alignment

   Reposition_pre(pos_dif) {
      console.error('NO BATCH CREATED')

      AddArr3(this.geom.pos, pos_dif);
   }




}



