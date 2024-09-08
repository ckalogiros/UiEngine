"use strict";

import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset, Vertex_buffer_group_set_texidx, Vertex_buffer_state_enable } from "../../../Graphics/Buffers/VertexBuffers.js";
import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D_Text } from "../Geometry/Geometry2DText.js";
import { FontMaterial } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Font_get_char_plane_bounds, Font_get_char_uv_coords, Font_get_font_advancex } from "../../Loaders/Font/ChlumskyFontMetricsLoader.js";
import { Mesh_per_vb_remove_mesh, Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { WHITE } from "../Material/Base/Colors.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Font_get_uv_coords, Font_metrics_get_advancex, Font_metrics_get_char_width, Font_metrics_get_row_height } from "../../Loaders/Font/Font.js";
import { Gl_add_wpos_x, Gl_set_dim_x, Gl_set_uv, Gl_set_wpos_x } from "../../../Graphics/Buffers/VertexBuffersOps.js";









export class Text_Mesh extends Mesh {

   fontsize; // TODO: TEMP. Move it to mat or geom or Mesh?
   advancex; // The advancex is a ratio with which we calculate the correct width of any text
   last_charidx; // An index to the last char of each state of the current text.(dynamic text changes, so it is good to always have the last char).
   text_width; // An extra var to store the width of the text(for efficiency reasons).
   text_height; // An extra var to store the height including any new lines.

   // constructor(text, pos = [0, 0, 0], fontsize = 8, color = WHITE, bold = 4, font = TEXTURES.MSDF_CONSOLAS_1024, scale = [1, 1], is_debug_mesh) {
   constructor(text, pos = [0, 0, 0], fontsize = 8, color = WHITE, bold = 4, font = TEXTURES.DEFAULT_FONT, scale = [1, 1], is_debug_mesh) {

      const sdfouter = CalculateSdfOuterFromDim(fontsize);
      if (sdfouter + bold > 1) bold = 1 - sdfouter;
      
      
      const mat = new FontMaterial(color, font, text, [bold, sdfouter])
      const geom = new Geometry2D_Text(pos, fontsize, scale, text, font, mat.uvIdx);
      
      super(geom, mat);
      
      this.last_charidx = text.length;
      
      this.type |= MESH_TYPE.TEXT_MESH | is_debug_mesh;
      this.fontsize = fontsize;

      const advancex = Font_metrics_get_advancex(mat.uvIdx)/2;
      this.advancex = advancex;
      
      this.CalculateTextWidth()
      // this.text_width = 0;
      // this.text_height = Font_metrics_get_row_height(mat.uvIdx);

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


   // RemoveFromMeshPerVbBuffer() {
   //    Mesh_per_vb_remove_mesh(this.gfx.vb.groupidx, this.per_vb_bufferidx);
   // }





   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/


   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      return this.gfx;
   }


   AddToGfx() {

      this.#TEMP();

      // TODO: I think now we can get rid of 'temp_max_chars_inserted_in_gfx', if we manage to implement correctly the size of the inserted text vertices
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.size + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.size;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      this.is_gfx_inserted = true;

   }


   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxText)
      this.#TEMP();
      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxText)

      // KEEP TRACK OF THE MAXIMUM CHARACTERS INSERTED IN GFX.
      // This is important so that we know the length of the faces we must remove from the vertex buffer on text.Destroy
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.boundary + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.boundary + 1;

      
      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);
      
      this.is_gfx_inserted = true;


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

      for (let i = len; i < this.mat.char_buffer.size; i++) {

         this.mat.char_buffer.buffer[i] = ' '; // We do not want to increment active_count for '' empty characters, so we avoid .Add
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


   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

   

   CalculateTextWidth(){

      const face_count = this.mat.char_buffer.size; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      let width = 0;
      let prevline_width = 0;
      let height = Font_metrics_get_row_height(this.mat.uvIdx)/2;
      // let height = 0;

      for (let i = 0; i < face_count; i++) {

         if(this.mat.char_buffer.buffer[i] === '\n'){
            
            if(width > prevline_width) prevline_width = width;
            width = 0;
            height += Font_metrics_get_row_height(this.mat.uvIdx)/2;
         }
         else {
            width += Font_metrics_get_char_width(this.mat.uvIdx, this.mat.char_buffer.buffer[i])/2;
         }
      }

      this.text_width = (width > prevline_width) ? width : prevline_width;
      this.text_height = height;
      return {w:this.text_width, h:height};
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
      if (!this.gfx) { console.error('98776\nTrying to Render Text before vertex buffer creation\ntext:', this.mat.char_buffer.buffer); return; }



      const store_start = this.gfx.vb.starts.buffer[0];

      // TODO: Remove arrays, substitute with variables
      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0] - this.geom.dim[0] * 2, this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      const c = this.mat.char_buffer.buffer;
      const space_char_uv = Font_get_uv_coords(this.mat.uvIdx, ' ');


      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
         this.mat.uv = space_char_uv;
         // const width = Font_metrics_get_char_width(this.mat.uvIdx, this.mat.char_buffer.buffer[i])/2;
         const width = Font_metrics_get_char_width(this.mat.uvIdx, this.mat.char_buffer.buffer[i])*2;

         if (c[i] !== ' ') // If char=' ' space, just render [0,0] uv coordinates.
         {
            this.mat.uv = Font_get_uv_coords(this.mat.uvIdx, this.mat.char_buffer.buffer[i]);
            // Reset this mesh's attributes to that of the first character of the text 
            // geom_copy.dim[0] = width; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1]; 
         }
         
         Gl_set_uv(this.gfx, this.mat.uv);
         Gl_set_dim_x(this.gfx, width*2);
         
         this.gfx.vb.starts.buffer[0] += this.gfx.vb.counts.buffer[0];
      }
      
      // If there are characters beyond the renderable, AND the are NOT EMPTY '', render empty char face
      for (let i = this.mat.char_buffer.boundary + 1; i < this.mat.char_buffer.size; i++) {
         
         let uvs = [0, 0, 0, 0]; // Set uvs to ' ' space char, to replace any extra previous text's characters
         Gl_set_uv(this.gfx, uvs);
         
         this.gfx.vb.starts.buffer[0] += this.gfx.vb.counts.buffer[0];
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
      this.mat.uv = Font_get_uv_coords(this.mat.uvIdx, text);
      geom_copy.dim[0] = 12; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1]; // Reset 
      Gl_set_uv(this.gfx, this.mat.uv);

   }


   ResetText(new_text) {

      const len = new_text.length;
      if (len > this.mat.char_buffer.size) alert('[][][]]sdklljsdm')
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

      this.gfx.tb.idx = this.mat.texidx;
      
      // const face_count = this.mat.char_buffer.active_count; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      
      // Run for buffer size so that the vertex buffers have the neccessary space for the whole char_buffer.
      const face_count = this.mat.char_buffer.size; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      
      // const space_char_uv = Font_get_char_uv_coords(this.mat.uvIdx, ' ');
      const space_char_uv = Font_get_uv_coords(this.mat.uvIdx, ' ');

      for (let i = 0; i < face_count; i++) {

         const char = this.mat.char_buffer.buffer[i];
         if(char==='\n'){ // Case new line
            
            geom_copy.pos[1] += Font_metrics_get_row_height(this.mat.uvIdx);
            geom_copy.pos[0] = this.geom.pos[0];
         }
         else {
            
            // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
            this.mat.uv = space_char_uv;
            const width = Font_metrics_get_char_width(this.mat.uvIdx, char)/2;
   
            if (char) { // If there is a text, get char uv and metrics
   
               this.mat.uv = Font_get_uv_coords(this.mat.uvIdx, char);
               geom_copy.dim[0] = width;
   
            }
   
            if (i === 0) {
               Vertex_buffer_add_vertices(this.gfx, geom_copy, this.mat, 1, `${char} in: ${this.GetName()}`);
            }
            else { // The first face exista as an entity, the rest are constructed here and store only to the vertex buffer
               Vertex_buffer_add_vertices_from_reset(this.gfx, geom_copy, this.mat, 1, `${char} in: ${this.GetName()}`);
            }
   
            // Advance to next free char position
            geom_copy.pos[0] += (width*2);
   
            // Reset geometry copy
            geom_copy.dim[0] = this.geom.dim[0]; 
            geom_copy.dim[1] = this.geom.dim[1]; 
         }

      }
   }

}



