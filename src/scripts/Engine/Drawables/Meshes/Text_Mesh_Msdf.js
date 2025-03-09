"use strict";

import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset } from "../../../Graphics/Buffers/VertexBuffers.js";
import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { AddArr3, CopyArr3 } from "../../../Helpers/Math/MathOperations.js";
import { Gfx_generate_context, GfxInfoMesh } from "../../Interfaces/Gfx/MeshGfxContext.js"; ``
import { Geometry2D_msdf_text } from "../Geometry/Geometry2DText.js";
import { Material_Font } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Gl_set_rgb_specific_index, Gl_set_uv, Gl_set_vpos_xy, Gl_set_wpos_x, Gl_set_wpos_xy } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { WHITE } from "../Material/Base/Colors.js";
import { Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { Msdf_Uv_get_font_line_height, Msdf_Uv_get_font_advancex, Msdf_Uv_get_font_base_line, Uv_get_uv_coords, Msdf_Uv_get_char_uv_coords} from "../../Loaders/Textures/TextureUvMap.js";


const font_y_constant_temp = 2.25;

export class Text_Mesh_Msdf extends Mesh {

   fontsize; // TODO: TEMP. Move it to mat or geom or Mesh?
   advancex; // The advancex is a ratio with which we calculate the correct width of any text
   last_charidx; // An index to the last char of each state of the current text.(dynamic text changes, so it is good to always have the last char).

   constructor(text, pos = [0, 0, 0], fontsize = 8, color = WHITE, font = TEXTURES.MSDF_CONSOLAS_1024, bold = 4, scale = [1, 1]) {

      const sdfouter = CalculateSdfOuterFromDim(fontsize);
      if (sdfouter + bold > 1) bold = 1 - sdfouter;
      const mat = new Material_Font(color, font, text, [bold, sdfouter])
      const geom = new Geometry2D_msdf_text(pos, fontsize, scale, text, font, mat.fontidx);

      super(geom, mat);

      this.last_charidx = text.length;

      this.type |= MESH_TYPE.TEXT_MESH;
      this.fontsize = fontsize;
      this.advancex = Msdf_Uv_get_font_advancex(mat.fontidx);

      this.text_width = 0;
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

   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/


   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidxs = [INT_NULL, INT_NULL]) {

      this.gfx = Gfx_generate_context(FLAGS, this, gfxidxs);

      return this.gfx;
   }

   AddToGfx() {

      this.#Render_text();

      // TODO: I think now we can get rid of 'temp_max_chars_inserted_in_gfx', if we manage to implement correctly the size of the inserted text vertices
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.size + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.size;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      this.is_gfx_inserted = true;

   }



   AddToGfxFromReset() {

      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      const advancex = Msdf_Uv_get_font_advancex(this.mat.fontidx);
      this.gfx.tb.idx = this.mat.texidx;
      const face_count = this.mat.text.length; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      const space_char_uv = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, ' ');

      for (let i = 0; i < face_count; i++) {

         // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
         this.mat.uv = space_char_uv;
         const char = this.mat.char_buffer.buffer[i];

         if (char) { // If there is a text, get char uv and metrics

            this.mat.uv = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, char);
            const plane_bounds = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, char);
            geom_copy.dim[0] *= plane_bounds.width;
            geom_copy.dim[1] *= plane_bounds.height;
            geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;

         }

         if (i === 0) {
            Vertex_buffer_add_vertices(this.gfx, geom_copy, this.mat, 1, `${char} in: ${this.GetName()}`);
         }
         else {
            Vertex_buffer_add_vertices_from_reset(this.gfx, geom_copy, this.mat, `${char} in: ${this.GetName()}`);
         }


         geom_copy.pos[0] += (this.fontsize * 2 * advancex);

         // Reset geometry copy
         geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1];

      }

      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      // this.gfx_bufferidx = Gfx_buffer_store(this.gfx.vb.idx, this.mesh_bufferidx);

   }


   ResetText(new_text) {
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

   SetPosX(x) {

      // THERE is no point setting all characters to the same position
      console.error('implement me')
      // this.geom.SetPosX(this.gfx, x, this.geom.num_faces);

   }
   AddWposX(x) {

      this.geom.AddWposX(this.gfx, x, this.geom.num_faces);

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

      if (str.length < this.mat.char_buffer.size) {

         for (let i = len; i < this.mat.char_buffer.size; i++) {

            this.mat.char_buffer.buffer[i] = ' '; // We do not want to increment active_count for '' empty characters, so we avoid .Add
         }
      }

      this.mat.text = str;
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



   /*******************************************************************************************************************************************************/
   // Setters-Getters
   /*******************************************************************************************************************************************************/

   // GetMaxWidth() { return (this.geom.dim[0] * this.advancex) * (this.geom.num_faces); }
   GetMaxWidth() { return this.text_width; }


   GetMaxHeight() { return this.text_height; }


   GetCenterPosX() { return this.geom.pos[0] + this.GetMaxWidth() - this.geom.dim[0]; }


   GetTextLeft_A() { return this.GetCenterPosX() - this.GetMaxWidth(); }


   GetTextRight_A() { return this.GetCenterPosX() + this.GetMaxWidth(); }


   SetColorRGB(col, char_len = 0) {
      const num_face = (char_len) ? char_len : this.geom.num_faces;
      this.mat.SetColorRGB(col, this.gfx, num_face)
   }


   SetColorRGBSpecificIndex(col, char_start, char_len = 0) {
      const num_faces = (char_len) ? char_len : this.geom.num_faces;
      Gl_set_rgb_specific_index(this.gfx, col, num_faces, char_start);
   }


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
   }









   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/



   CalculateTextWidth() {

      const face_count = this.mat.char_buffer.size; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)

      let width = 0;
      let prevline_width = 0;

      const height = Msdf_Uv_get_font_line_height(this.mat.fontidx) * this.geom.dim[1];
      let h = height;

      // const ratio = 1 / this.advancex; // Normalize advance
      const size = this.geom.dim[0];

      for (let i = 0; i < face_count; i++) {

         const char = this.mat.char_buffer.buffer[i];
         const plane_bounds = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, char);

         if (char === '\n') {

            if (width > prevline_width) prevline_width = width;
            width = 0;
            h += height;
         }
         else {
            let w = (plane_bounds.width * size);
            width += w;
         }
      }

      this.text_width = (width > prevline_width) ? width : prevline_width;
      this.text_height = h;
      return { w: this.text_width, h: h };
   }


   ScaleText(scale){

      if (!this.gfx) {
         console.error('98776\nTrying to Render Text before vertex buffer creation\ntext:', this.mat.char_buffer.buffer); return;
      }

      const store_start = this.gfx.vb.starts.buffer[0];
      const attribs_count = this.gfx.vb.counts.buffer[0];

      const sizex = this.geom.dim[0] * scale;
      const sizey = this.geom.dim[1] * scale;

      const space_char_uv = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, ' ');
      const base_line = Msdf_Uv_get_font_base_line(this.mat.fontidx);
      const line_height = Msdf_Uv_get_font_line_height(this.mat.fontidx) * sizey;

      let line = 0;

      const text_width = ((this.text_width) * scale) - this.parent.geom.dim[0]; 
      const text_height = ((this.text_height) * scale) - this.parent.geom.dim[1]; 

      // const difx = this.geom.dim[0]-sizex;
      // const dify = this.geom.dim[0]-sizey;
      // let posx = this.geom.pos[0] - difx*2;
      // let posy = this.geom.pos[1] - dify/2;

      // let posx = center ? this.geom.pos[0]+this.text_width : this.geom.pos[0];
      let posx = this.geom.pos[0]-text_width;
      let posy = this.geom.pos[1]-text_height;
      // let posy = center ? this.geom.pos[1]+this.text_height : this.geom.pos[1];
      // let posy = this.geom.pos[1];


      // const gfx_copy = { vb: this.gfx.CopyVb() } 


      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         const char = this.mat.char_buffer.buffer[i];

         if(char==='\n'){ // Case new line
            
            posx = this.geom.pos[0];
            line += line_height*2;
         }
         else {

            const plane_bounds = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, char);
   
            // TODO: For efficiency, create a dedicated Gl_ function to update all values
            // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
            const width  = plane_bounds.width * sizex;
            const height = plane_bounds.height * sizey;
   
            Gl_set_vpos_xy(this.gfx, width, height, 1);
   
            posy += line + (plane_bounds.yoffset * sizey * 2);
            posy -= base_line * sizey * font_y_constant_temp;
   
            Gl_set_wpos_xy(this.gfx, posx + width, posy + height);
            posx += width * 2;
   
            // posy = this.geom.pos[1]; // Reset yh position
            posy = this.geom.pos[1]-text_height;; // Reset yh position
   
            this.gfx.vb.starts.buffer[0] += attribs_count;
         }


      }
      
      // Reset this mesh's vb start index to that of the first character of the text 
      this.gfx.vb.starts.buffer[0] = store_start;

   }


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
         this.RenderText(value);
      }
   }


   RenderTextFromString(text) {
      if (text.constructor === String) {
         this.SetText(text);
         this.RenderText(text);
         // this.#Render_text(text);
      }
   }



   RenderText() {
      if (!this.gfx) {
         console.error('98776\nTrying to Render Text before vertex buffer creation\ntext:', this.mat.char_buffer.buffer); return;
      }

      const store_start = this.gfx.vb.starts.buffer[0];
      const attribs_count = this.gfx.vb.counts.buffer[0];

      const c = this.mat.char_buffer.buffer;
      const space_char_uv = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, ' ');
      const base_line = Msdf_Uv_get_font_base_line(this.mat.fontidx);

      // const sizex = Msdf_Uv_get_font_advancex(this.mat.fontidx) * this.geom.dim[0];
      // const sizey = Msdf_Uv_get_font_line_height(this.mat.fontidx) * this.geom.dim[1];
      const sizex = this.geom.dim[0];
      const sizey = this.geom.dim[1];
      let posx = this.geom.pos[0];
      let posy = this.geom.pos[1];


      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         this.mat.uv = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, c[i]);
         Gl_set_uv(this.gfx, this.mat.uv);

         const plane_bounds = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, c[i]);

         // TODO: For efficiency, create a dedicated Gl_ function to update all values
         // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
         const width  = plane_bounds.width * sizex;
         const height = plane_bounds.height * sizey;

         Gl_set_vpos_xy(this.gfx, width, height, 1);
         // Gl_set_vpos_x(this.gfx, width, 1);
         // Gl_set_vpos_y(this.gfx, height, 1);

         posy += plane_bounds.yoffset * sizey * 2;
         posy -= base_line * sizey * font_y_constant_temp;

         Gl_set_wpos_xy(this.gfx, posx + width, posy + height);
         // Gl_set_wpos_x(this.gfx, posx + width);
         // Gl_set_wpos_y(this.gfx, posy + height);
         posx += width * 2;

         this.gfx.vb.starts.buffer[0] += attribs_count;


         posy = this.geom.pos[1]; // Reset yh position

      }

      // const adv = Msdf_Uv_get_font_advancex(this.mat.fontidx) * sizex;
      const adv = this.advancex * sizex * 2;
      const line_height = Msdf_Uv_get_font_line_height(this.mat.fontidx);
      // posx += adv ;
      posx += adv/2;
      for (let i = this.mat.char_buffer.boundary + 1; i < this.mat.char_buffer.size; i++) {

         Gl_set_uv(this.gfx, space_char_uv);

         const width  = this.advancex * sizex;
         const height = line_height * sizey;
         
         
         Gl_set_vpos_xy(this.gfx, width, height, 1);
         // Gl_set_vpos_x(this.gfx, width, 1);
         // Gl_set_vpos_y(this.gfx, height, 1);

         Gl_set_wpos_x(this.gfx, posx);
         // Gl_set_wpos_y(this.gfx, posy );
         posx += width * 2;

         this.gfx.vb.starts.buffer[0] += attribs_count;
      }


      // Reset this mesh's vb start index to that of the first character of the text 
      this.gfx.vb.starts.buffer[0] = store_start;

   }


   /** Update a specific character in text char array */
   UpdateTextCharacter(_text, idx) {

      /**DEBUG */ if (_text.length > 1) alert('Try to use a char update function but string is passed');
      if (!this.gfx) return; // Case this called before text is inserted to gfx buffers.

      const text = (typeof (_text) === 'number') ? `${_text}` : _text; // Takes arithmetic values or just a char.

      // Make a copy to not change the default .start value of the first char(face).
      const gfx_copy = {
         vb: { idx: this.gfx.vb.groupidx, start: this.gfx.vb.start, count: this.gfx.vb.count },
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

      // Set the correct uv coordinates.
      this.mat.uv = Uv_get_uv_coords(this.mat.fontidx, text);
      geom_copy.dim[0] = 12; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1]; // Reset 
      Gl_set_uv(this.gfx, this.mat.uv);

   }


   ResetText(new_text) {

      const len = new_text.length;
      if (len > this.mat.char_buffer.size) alert('7716524431234')
      for (let i = 0; i < len; i++) {
         this.mat.char_buffer.buffer[i] = new_text[i];
      }
      this.geom.text = new_text;
      this.geom.num_faces = new_text.length;
   }

   
   #Render_text() {

      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      this.gfx.tb.idx = this.mat.texidx;

      // Run for buffer size so that the vertex buffers have the neccessary space for the whole char_buffer.
      const face_count = this.mat.char_buffer.size; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)

      const sizex = this.geom.dim[0];
      const sizey = this.geom.dim[1];
      const space_char_uv = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, ' ');
      const base_line = Msdf_Uv_get_font_base_line(this.mat.fontidx);
      const line_height = Msdf_Uv_get_font_line_height(this.mat.fontidx) * sizey;

      let line = 0;
      let posx = 0;

      for (let i = 0; i < face_count; i++) {

         // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
         this.mat.uv = space_char_uv;
         const char = this.mat.char_buffer.buffer[i];

         if(char==='\n'){ // Case new line
            
            geom_copy.pos[0] = this.geom.pos[0];
            line += line_height*2;
         }
         else {
            
            const plane_bounds = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, char);
   
            if (char) { // If there is a text, get char uv and metrics
   
               this.mat.uv = Msdf_Uv_get_char_uv_coords(this.mat.fontidx, char);
               // geom_copy.dim[0] = (plane_bounds.width * size) + left_offset;
               geom_copy.dim[0] = (plane_bounds.width * sizex);
               geom_copy.dim[1] = plane_bounds.height * sizey;
   
               // geom_copy.pos[0] += left_offset;
               geom_copy.pos[1] += line + (plane_bounds.yoffset * sizey * 2);
               geom_copy.pos[1] -= base_line * sizey * font_y_constant_temp;
            }
   
            if (i === 0) {
               Vertex_buffer_add_vertices(this.gfx, geom_copy, this.mat, 1, `${char} in: ${this.GetName()}`);
            }
            else { // The first face exista as an entity, the rest are constructed here and store only to the vertex buffer
               Vertex_buffer_add_vertices_from_reset(this.gfx, geom_copy, this.mat, 1, `${char} in: ${this.GetName()}`);
            }
   
   
            posx = geom_copy.dim[0] * 2;
            geom_copy.pos[0] += posx;
   
            geom_copy.pos[1] = this.geom.pos[1];
         }

      }


   }



   /*******************************************************************************************************************************************************/
   // Alignment

   Reposition_pre(pos_dif) {
      console.error('NO BATCH CREATED')

      AddArr3(this.geom.pos, pos_dif);
   }




}