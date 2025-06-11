"use strict";

import { Vertex_buffer_add_vertices_from_render_group } from "../../../Graphics/Buffers/VertexBuffers.js";
import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Material_Font } from "../Material/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Gl_set_uv, Gl_set_rgb_specific_index, Gl_set_vpos_xy, Gl_set_wpos_xy } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Uv_get_uv_coords, Texture_metrics_get_sub_tex_width, Msdf_Uv_get_sub_tex_bounds, Texture_metrics_get_sub_tex_height, Texture_metrics_get_texture, Texture_metrics_get_sub_tex_yoffset, Texture_metrics_get_calc_dim_from_string } from "../../Loaders/Textures/TextureUvMap.js";
import { Geometry2D_Text } from "../Geometry/Geometry.js";
import { Mesh_get_name } from "../Operations/MeshPropertiesFunctions.js";
import { Set_color_rgb } from "../Operations/MeshAttributesFunctions.js";
import { View_add_mesh } from "../../Core/Views/MeshBufferViews.js";


// Preallocated variables
const _geom_copy = { 
   pos: [0, 0, 0],
   dim: [0, 0],
}





export class Text_Mesh extends Mesh {

   font_size; // TODO: Render_text. Move it to mat or geom or Mesh?
   advancex; // The advancex is a ratio with which we calculate the correct width of any properties.text
   last_charidx; // An index to the last char of each state of the current properties.text.(dynamic properties.text changes, so it is good to always have the last char).
   text_width; // An extra var to store the width of the properties.text(for efficiency reasons).
   text_height; // An extra var to store the height including any new lines.

   /**
    * @param {*} properties { pos, dim, col, pad, text, font_size, texture_id, sub_texture_id, variant_idx, is_debug_mesh, } 
    */
   constructor(mesh_bufferidx, properties) {

      const sdfouter = CalculateSdfOuterFromDim(properties.font_size);
      if (sdfouter + properties.bold > 1) properties.bold = 1 - sdfouter;
      
      const mat = new Material_Font(properties.col, properties.texture_id, properties.text, [properties.bold, sdfouter], properties.variant_idx)
      const size = (FONT_IS_MSDF(properties.texture_id)) ? properties.font_size : mat.pixel_size;
      const geom = new Geometry2D_Text(properties.pos, properties.text, size);
      
      super(geom, mat);
      
		this.mesh_bufferidx = mesh_bufferidx;
      this.last_charidx = properties.text.length;
      
      this.type |= MESH_TYPE.TEXT_MESH | properties.is_debug_mesh;
      this.font_size = properties.font_size;

      this.text_width = 0;
      this.text_height = 0;
      this.#CalculateTextDimentionsFromMetrics();
      // const ret = Texture_metrics_get_calc_dim_from_string(this.mat.metrics_idx, this.mat.text);
      // this.text_width =  ret.width * this.geom.font_size;
      // this.text_height = ret.height * this.geom.font_size;
      
      // /** // HACK: For some reason the width of the whole text is off by the ammount of characters. We correct by increasing by hlf of that */
      // this.text_width += (ret.max_row_faces+0)/2; // If new lines exist, we need to add the row faces of the the max row faces 
      // if(ret.new_lines > 0) this.text_height -= (this.geom.font_size); // Same with height

      this.SetLayout(properties.layout);
   }
   /** */
   #CalculateTextDimentionsFromMetrics() {
      const ret = Texture_metrics_get_calc_dim_from_string(this.mat.metrics_idx, this.mat.text, this.geom.num_faces);
      this.text_width =  ret.width * this.geom.font_size;
      this.text_height = ret.height * this.geom.font_size;
      
      /** // HACK: For some reason the width of the whole text is off by the ammount of characters. We correct by increasing by hlf of that */
      this.text_width += (ret.max_row_faces+0)/2; // If new lines exist, we need to add the row faces of the the max row faces 
      if(ret.new_lines > 0) this.text_height -= (this.geom.font_size); // Same with height
   }
   /** */
   SetLayout(align_flags) {

      this.align.flags = align_flags;
   }
   /** */
   AddLayout(align_flags) {

      this.align.flags |= align_flags;
   }
   /** */
   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
   }
   /** */
   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
   }
   /** */
   SetTypeDebug() {
      this.type |= MESH_TYPE.DEBUG_MESH;
   }
   /** */
   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // FIXME: The clbk_params for unif_wpos is the vb_groupidx, BUT instead is passed recursively from the 'section.GfxUniformsSetClbk()'
      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      // for (let i = 0; i <= this.children.boundary; i++) {
      //    const child = this.children.buffer[i];
      //    if (child && child.gfx) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
      // }
   }




   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/
   /** */
   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      // Add to view group
      View_add_mesh(this.group_bufferidxs[0], this);

      return this.gfx;
   }
   /** */
   AddToGfx() {

      this.#Render_text();
      // this.RenderText();

      // TODO: I think now we can get rid of 'temp_max_chars_inserted_in_gfx', if we manage to implement correctly the size of the inserted text vertices
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.size + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.size;

      this.is_gfx_inserted = true;

   }
   /** */
   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxText)
      this.#Render_text();
      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxText)

      // KEEP TRACK OF THE MAXIMUM CHARACTERS INSERTED IN GFX.
      // This is important so that we know the length of the faces we must remove from the vertex buffer on text.Destroy
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.boundary + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.boundary + 1;

      
      // Add entry to Gfx Buffer
      // this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);
      
      this.is_gfx_inserted = true;


   }







   /*******************************************************************************************************************************************************/
   // Transformations
   /*******************************************************************************************************************************************************/
   /** */
   MoveNoGfxUpdate(x, y) {

      this.geom.pos[0] += x;
      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveNoGfxUpdate(x, y);
      }

   }
   /** */
   MoveYNoGfxUpdate(y) {

      this.geom.pos[1] += y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveYNoGfxUpdate(y);
      }

   }
   /** */
   MoveXNoGfxUpdate(x) {

      this.geom.pos[0] += x;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.MoveXNoGfxUpdate(x);
      }

   }
   /** */
   TEMP_recalc(x, y) {

      this.geom.pos[0] = x;
      this.geom.pos[1] = y;
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.TEMP_recalc(x, y);
      }
   }
   /** */
   SetPosXYNoGfxUpdate(x, y) {
      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
      }
      else {
         this.geom.pos[0] = x;
         this.geom.pos[1] = y;
      }
   }
   /** */
   SetPosXNoGfxUpdate(x) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
      }
      else this.geom.pos[0] = x;
   }
   /** */
   SetPosYNoGfxUpdate(y) {

      if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
         Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
      }
      else this.geom.pos[1] = y;
   }
   /** */
   SetPosZNoGfxUpdate(val) {
      this.geom.pos[2] = val;
   }
   /** */
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

   /** */
   GetMaxWidth() { return this.text_width; }
   /** */
   GetMaxHeight() { return this.text_height; }
   /** */
   GetCenterPosX() { return this.geom.pos[0] + this.GetMaxWidth() - this.geom.dim[0]; }
   /** */
   GetTextLeft_A() { return this.GetCenterPosX() - this.GetMaxWidth(); }
   /** */
   GetTextRight_A() { return this.GetCenterPosX() + this.GetMaxWidth(); }
   /** */
   SetColorRGB(col, char_len = 0) {
      const num_face = (char_len) ? char_len : this.geom.num_faces;
      Set_color_rgb(this, col);
   }
   /** */
   SetColorRGBSpecificIndex(col, char_start, char_len = 0) {
      const num_faces = (char_len) ? char_len : this.geom.num_faces;
      Gl_set_rgb_specific_index(this.gfx, col, num_faces, char_start);
   }
   /** */
   SetFrameBufferIdx(fbidx) {
      this.isFramebufferRendered = fbidx;
   }






   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // UNIQUE METHODS
   /****************************************************************************************************************************************************/

      /** @reduce_bool: If false, text width remains the same as the previous. If true, any empty characters will not be rendered, so the text width may vary. */
   SetText(str, reduce_bool=false) {

      const len = (str.length < this.mat.char_buffer.size) ? str.length : this.mat.char_buffer.size;
      this.mat.char_buffer.Reset();

      let replace_chars = ' ';
      if(reduce_bool) {
         replace_chars = '';
         this.geom.num_faces = len;
         this.mat.text = str;
         this.#CalculateTextDimentionsFromMetrics();
      }
      
      for (let i = 0; i < len; i++) {
         this.mat.char_buffer.Add(str[i]);
      }
      
      if(str.length < this.mat.char_buffer.size){

         for (let i = len; i < this.mat.char_buffer.size; i++) {
            this.mat.char_buffer.buffer[i] =  replace_chars; // We do not want to increment active_count for '' empty characters, so we avoid .Add
         }
      }
         
      // if(reduce_bool)

      return (str.length > this.mat.char_buffer.size); // Return true if new text length is greater than existing
   }
   /** Replace existing text with another text of equal size or smaller, assuming the text mesh have already registered to the gfx buffers */
   ReplaceText(str) {

      if(str.length > this.mat.char_buffer.size) alert('8871698876543. Cannot Replace text with a text larger than the original one.')

      this.mat.char_buffer.Reset();

      for (let i = 0; i < this.mat.char_buffer.size; i++) {

         if(str[i] !== undefined) this.mat.char_buffer.Add(str[i]);
         else this.mat.char_buffer.Add(' ');
      }
   }
   /** */
   SetTextAtIndex(str, start) {

      /**DEBUG */ if (start > this.mat.char_buffer.size) console.error('ERROR @SetTextAtIndex().\n start greater than buffer size.\nstart=', start);

      const len = str.length;

      for (let i = start; i < len; i++) {

         this.mat.char_buffer.AddAtIndex(i, str[i]);
      }
   }
   /** */
   SliceText(_start = 0, _count = _) {
      const count = (_count === _ || _count > this.mat.char_buffer.size) ? this.mat.char_buffer.active_count : _count;
      const start = (_start > this.mat.char_buffer.boundary) ? this.mat.char_buffer.boundary : _start;

      for (let i = start; i < count; i++) {
         this.mat.char_buffer.RemoveByIdx(i);
      }

   }
   /** */
   ScaleText(scale) {

      if (!this.gfx) {
         console.error('98776\nTrying to Render Text before vertex buffer creation\ntext:', this.mat.char_buffer.buffer); return;
      }

      const store_start = this.gfx.vb.starts.buffer[0];
      const attribs_count = this.gfx.vb.counts.buffer[0];

      const sizex = this.geom.dim[0] * scale;
      const sizey = this.geom.dim[1] * scale;

      const size = this.geom.font_size * scale;
      const texture = Texture_metrics_get_texture(this.mat.metrics_idx);
      const line_height = texture.line_height * size;

      let line = 0;

      const text_width = ((this.text_width) * scale) - this.parent.geom.dim[0];
      const text_height = ((this.text_height) * scale) - this.parent.geom.dim[1];

      let posx = this.geom.pos[0] - text_width;
      let posy = this.geom.pos[1] - text_height;

      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         const char = this.mat.char_buffer.buffer[i];
         const sub_tex_idx = char.charCodeAt(0) - CHAR_ARRAY_START_OFFSET;

         if (char === '\n') { // Case new line

            posx = this.geom.pos[0];
            line += line_height * 2;
         }
         else {

            const width = Texture_metrics_get_sub_tex_width(this.mat.metrics_idx, sub_tex_idx) * sizex;
            const height = Texture_metrics_get_sub_tex_height(this.mat.metrics_idx, sub_tex_idx) * sizey;
            const yoffset = Texture_metrics_get_sub_tex_yoffset(this.mat.metrics_idx, sub_tex_idx);

            Gl_set_vpos_xy(this.gfx, width, height, 1);

            
            posy += line + (yoffset * sizey * 2);
            Gl_set_wpos_xy(this.gfx, posx + width, posy + height);
            
            posx += width * 2;
            posy = this.geom.pos[1] - text_height; // Reset yh position

            this.gfx.vb.starts.buffer[0] += attribs_count;
         }


      }

      // Reset this mesh's vb start index to that of the first character of the text 
      this.gfx.vb.starts.buffer[0] = store_start;

   }
   /**
    * Also very memory heavy, shown in firefox profiler tools.
    * Probably because of the new GfxInfoMesh and new Geometry2D_Text.
    * Concider building the structs localy.
    */
   RenderTextFromNumber(value) {
      if (value.constructor === Number) {
         this.SetText(`${value}`)
         this.RenderText(value);
      }
   }
   /** */
   RenderTextFromString(text) {
      if (text.constructor === String) {
         const needs_resize = this.SetText(text);
         if(!needs_resize) this.RenderText(text);
         else this.#Render_text()
      }
   }
   /** */
   RenderText() {
      if (!this.gfx) { // Case there is a timeInterval or some callback calling to render text before its 'root' widget called the '.Render()' function
         return; 
      }

      const store_start = this.gfx.vb.starts.buffer[0];
      const attribs_count = this.gfx.vb.counts.buffer[0];
      
      const size = this.geom.font_size;
      const c = this.mat.char_buffer.buffer;
      const space_char_uv = Uv_get_uv_coords(this.mat.metrics_idx, ' '.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
      const texture = Texture_metrics_get_texture(this.mat.metrics_idx);
      const line_height = texture.line_height * size * 2;

      let cur_line_posy = this.geom.pos[1];

      let xpos = this.geom.pos[0];
      let ypos = cur_line_posy;


      // console.log(
      //    'text:', this.mat.text,
      //    'char_buffer:', this.mat.char_buffer.buffer,
      //    'width:', this.text_width,
      //    'height:', this.text_height,
      //    'num_faces:', this.geom.num_faces,
      // )

      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         if(c[i]==='\n'){ // Case new line
            
            cur_line_posy += line_height;
            xpos = this.geom.pos[0];
         }
         else if (c[i] !== '') {

            const sub_tex_idx = c[i].charCodeAt(0) - CHAR_ARRAY_START_OFFSET;
            
            // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
            this.mat.uv = space_char_uv;
            const width = Texture_metrics_get_sub_tex_width(this.mat.metrics_idx, sub_tex_idx) * size;
   
            const plane_bounds = Msdf_Uv_get_sub_tex_bounds(this.mat.metrics_idx, sub_tex_idx);
             
            const height = plane_bounds.height * this.geom.font_size;
            const yoffset = Texture_metrics_get_sub_tex_yoffset(this.mat.metrics_idx, sub_tex_idx);
            ypos += (yoffset-texture.base_line ) * size * 2;
   
           
            if (c[i] !== ' ') { // If char=' ' space, just render [0,0] uv coordinates.
               this.mat.uv = Uv_get_uv_coords(this.mat.metrics_idx, sub_tex_idx);
            }
            
            // TODO: For efficiency, create a dedicated Gl_ function to update all values
            Gl_set_uv(this.gfx, this.mat.uv);
            Gl_set_vpos_xy(this.gfx, width, height, 1);
            Gl_set_wpos_xy(this.gfx, xpos+width, ypos+height); 
            
            xpos += width*2; // Second half width
            
            this.gfx.vb.starts.buffer[0] += attribs_count; // Advance to the next face(char) in vertex buffer
            
         }
         
         ypos = cur_line_posy;
      }
      
               
      for (let i = this.mat.char_buffer.boundary + 1; i < this.mat.char_buffer.size; i++) {
         
         Gl_set_uv(this.gfx, space_char_uv);
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


      // Use a copy to not change the default char start.
      _geom_copy.pos[0] = this.geom.pos[0];
      _geom_copy.pos[1] = this.geom.pos[1];
      _geom_copy.pos[2] = this.geom.pos[2];
      _geom_copy.dim[0] = this.geom.dim[0];
      _geom_copy.dim[1] = this.geom.dim[1];

      // Set the correct uv coordinates.
      this.mat.uv = Uv_get_uv_coords(this.mat.metrics_idx, text.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
      _geom_copy.dim[0] = 12; _geom_copy.dim[1] = this.geom.dim[1]; _geom_copy.pos[1] = this.geom.pos[1]; // Reset 
      Gl_set_uv(this.gfx, this.mat.uv);

   }
   /** */
   ResetText(new_text) {

      const len = new_text.length;
      if (len > this.mat.char_buffer.size) alert('[][][]]sdklljsdm')
      for (let i = 0; i < len; i++) {
         this.mat.char_buffer.buffer[i] = new_text[i];
      }
      this.mat.text = new_text;
      this.geom.num_faces = new_text.length;
   }
   /** */
   #Render_text() {

      _geom_copy.pos[0] = this.geom.pos[0];
      _geom_copy.pos[1] = this.geom.pos[1];
      _geom_copy.pos[2] = this.geom.pos[2];
      _geom_copy.dim[0] = this.geom.dim[0];
      _geom_copy.dim[1] = this.geom.dim[1];


      let cur_line_posy = this.geom.pos[1];
      this.gfx.tb.idx = this.mat.texidx;


      const size = this.geom.font_size;
      const texture = Texture_metrics_get_texture(this.mat.metrics_idx);
      const line_height = texture.line_height * size * 2;
      
      // Run for buffer size so that the vertex buffers have the neccessary space for the whole char_buffer.
      const space_char_uv = Uv_get_uv_coords(this.mat.metrics_idx, ' '.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
      
      const face_count = this.mat.char_buffer.size; // Avoid having clamped text faces not being added(because the GenGfx creates the start and end of the text mesh attributes in the vertex buffer)
      for (let i = 0; i < face_count; i++) {

         const char = this.mat.char_buffer.buffer[i];
         const sub_tex_idx = char.charCodeAt(0) - CHAR_ARRAY_START_OFFSET;

         if(char==='\n'){ // Case new line
            
            cur_line_posy += line_height;
            _geom_copy.pos[0] = this.geom.pos[0];
         }
         else {
            
            // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
            this.mat.uv = space_char_uv;
            
            
            if (char !== '') { // If there is a text, get char uv and metrics
               let width = Texture_metrics_get_sub_tex_width(this.mat.metrics_idx, sub_tex_idx);
               // width = Texture_metrics_get_sub_tex_width(this.mat.metrics_idx, sub_tex_idx);
               
               this.mat.uv = Uv_get_uv_coords(this.mat.metrics_idx, sub_tex_idx);
               const height = Texture_metrics_get_sub_tex_height(this.mat.metrics_idx, sub_tex_idx);
               _geom_copy.dim[0] = width * size;
               _geom_copy.dim[1] = height * size;
               const yoffset = Texture_metrics_get_sub_tex_yoffset(this.mat.metrics_idx, sub_tex_idx);
               _geom_copy.pos[1] += (yoffset-texture.base_line ) * size * 2;

               // The first face exists as an entity, the rest are constructed here and stored only to the vertex buffer
               const attrib_start = Vertex_buffer_add_vertices_from_render_group(this.gfx, _geom_copy, this.mat, 1, `${char} in: ${Mesh_get_name(this)}`, true);
               
               if(i===0) this.gfx.vb.starts.buffer[0] = attrib_start;
               // Advance to next free char position
               _geom_copy.pos[0] += (width * size * 2)+1;
            }
            
            
            
         }
         _geom_copy.dim[0] = this.geom.dim[0]; _geom_copy.dim[1] = this.geom.dim[1]; _geom_copy.pos[1] = cur_line_posy;
         
         
      }

      
   }

}



