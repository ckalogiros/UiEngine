"use strict";

import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset } from "../../../Graphics/Buffers/VertexBuffers.js";
import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D_Text } from "../Geometry/Geometry2DText.js";
import { Material_Font } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Gl_set_uv, Gl_set_rgb_specific_index, Gl_set_vpos_xy, Gl_set_wpos_xy } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Uv_get_uv_coords, Texture_metrics_get_sub_tex_width, Msdf_Uv_get_sub_tex_bounds, Texture_metrics_get_sub_tex_height, Texture_metrics_get_texture, Texture_metrics_get_sub_tex_yoffset, Texture_metrics_get_calc_dim_from_string } from "../../Loaders/Textures/TextureUvMap.js";
import { CopyArr4 } from "../../../Helpers/Math/MathOperations.js";









export class Text_Mesh extends Mesh {

   font_size; // TODO: Render_text. Move it to mat or geom or Mesh?
   advancex; // The advancex is a ratio with which we calculate the correct width of any properties.text
   last_charidx; // An index to the last char of each state of the current properties.text.(dynamic properties.text changes, so it is good to always have the last char).
   text_width; // An extra var to store the width of the properties.text(for efficiency reasons).
   text_height; // An extra var to store the height including any new lines.

   /**
    * @param {*} properties { pos, dim, col, pad, text, font_size, texture_id, sub_texture_id, variant_idx, is_debug_mesh, } 
    */
   constructor(properties) {

      const sdfouter = CalculateSdfOuterFromDim(properties.font_size);
      if (sdfouter + properties.bold > 1) properties.bold = 1 - sdfouter;
      
      const mat = new Material_Font(properties.col, properties.texture_id, properties.text, [properties.bold, sdfouter], properties.variant_idx)
      const size = (FONT_IS_MSDF(properties.texture_id)) ? properties.font_size : mat.pixel_size;
      const geom = new Geometry2D_Text(properties.pos, properties.text, size);
      
      super(geom, mat);

      this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
      // this.EnableGfxUniforms({ unif:SID.UNIF.BLEND_MODE } , 'u_blend_mode', UNIF_TYPE.INT, UNIFORM.IN_FS);
      
      this.last_charidx = properties.text.length;
      
      this.type |= MESH_TYPE.TEXT_MESH | properties.is_debug_mesh;
      this.properties.font_size = properties.font_size;

      this.text_width = 0;
      this.text_height = 0;
      const ret = Texture_metrics_get_calc_dim_from_string(this.mat.metrics_idx, this.mat.text);
      this.text_width = (this.text_width < ret.width * this.geom.font_size) ? ret.width * this.geom.font_size : this.text_width;
      this.text_height = ret.height * this.geom.font_size;

      this.SetLayout(properties.layout);
   }

   SetLayout(align_flags) {

      this.align.flags = align_flags;
   }

   AddLayout(align_flags) {

      this.align.flags |= align_flags;
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

      this.#Render_text();
      // this.RenderText();

      // TODO: I think now we can get rid of 'temp_max_chars_inserted_in_gfx', if we manage to implement correctly the size of the inserted text vertices
      if (this.mat.temp_max_chars_inserted_in_gfx <= this.mat.char_buffer.size + 1)
         this.mat.temp_max_chars_inserted_in_gfx = this.mat.char_buffer.size;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      this.is_gfx_inserted = true;

   }


   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxText)
      this.#Render_text();
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

      this.#Render_text()

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

      this.geom.SetPosX(this.gfx, x, this.geom.num_faces);

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

      if(str.length < this.mat.char_buffer.size){

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

   

   // CalculateTextWidth(){

   //    const ret = Texture_metrics_get_calc_dim_from_string(this.mat.metrics_idx, this.mat.text);
   //    this.text_width = (this.text_width < ret.width * this.geom.font_size) ? ret.width * this.geom.font_size : this.text_width;
   //    this.text_height = ret.height * this.geom.font_size;

   // }
   

   CalculateTextDimentions(){

      const ret = Texture_metrics_get_calc_dim_from_string(this.mat.metrics_idx, this.mat.text);
      this.text_width = (this.text_width < ret.width * this.geom.font_size) ? ret.width * this.geom.font_size : this.text_width;
      this.text_height = ret.height * this.geom.font_size;

   }


   /** Replace existing text with another text of  equal size or smaller, assuming the text mesh have already registered to the gfx buffers */
   ReplaceText(str) {

      if(str.length > this.mat.char_buffer.size) alert('8871698876543. Cannot Replace text with a text larger than the original one.')

      this.mat.char_buffer.Reset();

      for (let i = 0; i < this.mat.char_buffer.size; i++) {

         if(str[i] !== undefined) this.mat.char_buffer.Add(str[i]);
         else this.mat.char_buffer.Add(' ');
      }
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

   ScaleText(scale) {

      if (!this.gfx) {
         console.error('98776\nTrying to Render Text before vertex buffer creation\ntext:', this.mat.char_buffer.buffer); return;
      }

      const store_start = this.gfx.vb.starts.buffer[0];
      const attribs_count = this.gfx.vb.counts.buffer[0];

      const sizex = this.geom.dim[0] * scale;
      const sizey = this.geom.dim[1] * scale;

      // const space_char_uv = Msdf_Uv_get_sub_tex_uv_coords(this.mat.metrics_idx, ' '.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
      // const base_line = Msdf_Uv_get_font_base_line(this.mat.metrics_idx);
      // const line_height = Msdf_Uv_get_font_line_height(this.mat.metrics_idx) * sizey;

      
      const size = this.geom.font_size * scale;
      const texture = Texture_metrics_get_texture(this.mat.metrics_idx);
      const line_height = texture.line_height * size;

      let line = 0;

      const text_width = ((this.text_width) * scale) - this.parent.geom.dim[0];
      const text_height = ((this.text_height) * scale) - this.parent.geom.dim[1];

      // const difx = this.geom.dim[0]-sizex;
      // const dify = this.geom.dim[0]-sizey;
      // let posx = this.geom.pos[0] - difx*2;
      // let posy = this.geom.pos[1] - dify/2;

      // let posx = center ? this.geom.pos[0]+this.text_width : this.geom.pos[0];
      let posx = this.geom.pos[0] - text_width;
      // let posy = this.geom.pos[1] - text_height;
      // let posy = center ? this.geom.pos[1]+this.text_height : this.geom.pos[1];
      let posy = this.geom.pos[1];


      // const gfx_copy = { vb: this.gfx.CopyVb() } 


      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         const char = this.mat.char_buffer.buffer[i];
         const sub_tex_idx = char.charCodeAt(0) - CHAR_ARRAY_START_OFFSET;

         if (char === '\n') { // Case new line

            posx = this.geom.pos[0];
            line += line_height * 2;
         }
         else {

            // const plane_bounds = Msdf_Uv_get_sub_tex_bounds(this.mat.metrics_idx, char.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
            const width = Texture_metrics_get_sub_tex_width(this.mat.metrics_idx, sub_tex_idx) * sizex;
            const height = Texture_metrics_get_sub_tex_height(this.mat.metrics_idx, sub_tex_idx) * sizey;
            const yoffset = Texture_metrics_get_sub_tex_yoffset(this.mat.metrics_idx, sub_tex_idx);

            // TODO: For efficiency, create a dedicated Gl_ function to update all values
            // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
            // const width = plane_bounds.width * sizex;
            // const height = plane_bounds.height * sizey;

            Gl_set_vpos_xy(this.gfx, width, height, 1);

            posy += line + (yoffset * sizey * 2);
            // posy += line + (yoffset * sizey * 2);
            // posy -= base_line * sizey * font_y_constant_temp;
            // posy -= (yoffset-texture.base_line ) * sizey;
            // posy += (yoffset-texture.base_line ) * size
            // posy += (yoffset-texture.base_line ) * size * 2;

            Gl_set_wpos_xy(this.gfx, posx + width, posy + height);
            posx += width * 2;

            posy = this.geom.pos[1] - text_height; // Reset yh position

            this.gfx.vb.starts.buffer[0] += attribs_count;
         }


      }

      // Reset this mesh's vb start index to that of the first character of the text 
      this.gfx.vb.starts.buffer[0] = store_start;

   }
   // ScaleText(scale) {

   //    if (!this.gfx) {
   //       console.error('98776\nTrying to Render Text before vertex buffer creation\ntext:', this.mat.char_buffer.buffer); return;
   //    }

   //    const store_start = this.gfx.vb.starts.buffer[0];
   //    const attribs_count = this.gfx.vb.counts.buffer[0];

   //    const sizex = this.geom.dim[0] * scale;
   //    const sizey = this.geom.dim[1] * scale;

   //    // const space_char_uv = Msdf_Uv_get_sub_tex_uv_coords(this.mat.metrics_idx, ' '.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
   //    // const base_line = Msdf_Uv_get_font_base_line(this.mat.metrics_idx);
   //    // const line_height = Msdf_Uv_get_font_line_height(this.mat.metrics_idx) * sizey;

      
   //    const size = this.geom.font_size;
   //    const texture = Texture_metrics_get_texture(this.mat.metrics_idx);
   //    const line_height = texture.line_height * size * 2;

   //    let line = 0;

   //    const text_width = ((this.text_width) * scale) - this.parent.geom.dim[0];
   //    const text_height = ((this.text_height) * scale) - this.parent.geom.dim[1];

   //    // const difx = this.geom.dim[0]-sizex;
   //    // const dify = this.geom.dim[0]-sizey;
   //    // let posx = this.geom.pos[0] - difx*2;
   //    // let posy = this.geom.pos[1] - dify/2;

   //    // let posx = center ? this.geom.pos[0]+this.text_width : this.geom.pos[0];
   //    let posx = this.geom.pos[0] - text_width;
   //    // let posy = this.geom.pos[1] - text_height;
   //    // let posy = center ? this.geom.pos[1]+this.text_height : this.geom.pos[1];
   //    let posy = this.geom.pos[1];


   //    // const gfx_copy = { vb: this.gfx.CopyVb() } 


   //    // Update text faces
   //    for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

   //       const char = this.mat.char_buffer.buffer[i];
   //       const sub_tex_idx = char.charCodeAt(0) - CHAR_ARRAY_START_OFFSET;

   //       if (char === '\n') { // Case new line

   //          posx = this.geom.pos[0];
   //          line += line_height * 2;
   //       }
   //       else {

   //          // const plane_bounds = Msdf_Uv_get_sub_tex_bounds(this.mat.metrics_idx, char.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
   //          const width = Texture_metrics_get_sub_tex_width(this.mat.metrics_idx, sub_tex_idx) * sizex;
   //          const height = Texture_metrics_get_sub_tex_height(this.mat.metrics_idx, sub_tex_idx) * sizey;
   //          const yoffset = Texture_metrics_get_sub_tex_yoffset(this.mat.metrics_idx, sub_tex_idx);

   //          // TODO: For efficiency, create a dedicated Gl_ function to update all values
   //          // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
   //          // const width = plane_bounds.width * sizex;
   //          // const height = plane_bounds.height * sizey;

   //          Gl_set_vpos_xy(this.gfx, width, height, 1);

   //          posy += line + (yoffset * sizey * 2);
   //          // posy += line + (yoffset * sizey * 2);
   //          // posy -= base_line * sizey * font_y_constant_temp;
   //          // posy -= (yoffset-texture.base_line ) * sizey;
   //          // posy += (yoffset-texture.base_line ) * size
   //          // posy += (yoffset-texture.base_line ) * size * 2;

   //          Gl_set_wpos_xy(this.gfx, posx + width, posy + height);
   //          posx += width * 2;

   //          posy = this.geom.pos[1] - text_height; // Reset yh position

   //          this.gfx.vb.starts.buffer[0] += attribs_count;
   //       }


   //    }

   //    // Reset this mesh's vb start index to that of the first character of the text 
   //    this.gfx.vb.starts.buffer[0] = store_start;

   // }

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
         // this.#Render_text(value);
      }
   }


   RenderTextFromString(text) {
      if (text.constructor === String) {
         this.SetText(text);
         this.RenderText(text);
      }
   }



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


      
      // Update text faces
      for (let i = 0; i <= this.mat.char_buffer.boundary; i++) {

         if(c[i]==='\n'){ // Case new line
            
            cur_line_posy += line_height;
            xpos = this.geom.pos[0];
         }
         else {

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


      // Make a copy to not change the default face.
      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

      // Set the correct uv coordinates.
      this.mat.uv = Uv_get_uv_coords(this.mat.metrics_idx, text.charCodeAt(0) - CHAR_ARRAY_START_OFFSET);
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


   #Render_text() {

      const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
         pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
         dim: [this.geom.dim[0], this.geom.dim[1]],
      }

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
            geom_copy.pos[0] = this.geom.pos[0];
         }
         else {
            
            // Case the text changed to a shorter text, fill up the absent texts in the graphics buffer with empty text(space char).
            this.mat.uv = space_char_uv;
            const width = Texture_metrics_get_sub_tex_width(this.mat.metrics_idx, sub_tex_idx);
            
            
            if (char !== '') { // If there is a text, get char uv and metrics
               
               this.mat.uv = Uv_get_uv_coords(this.mat.metrics_idx, sub_tex_idx);
               const height = Texture_metrics_get_sub_tex_height(this.mat.metrics_idx, sub_tex_idx);
               geom_copy.dim[0] = width * size;
               geom_copy.dim[1] = height * size;
               const yoffset = Texture_metrics_get_sub_tex_yoffset(this.mat.metrics_idx, sub_tex_idx);
               geom_copy.pos[1] += (yoffset-texture.base_line ) * size * 2;
            }
            
            // The first face exists as an entity, the rest are constructed here and stored only to the vertex buffer
            if (i === 0) {
               Vertex_buffer_add_vertices(this.gfx, geom_copy, this.mat, 1, `${char} in: ${this.GetName()}`);
            }
            else { // Avoid function call to store any data to '.gfx.start' etc and to accumulate all char faces to the vertex buffer. 
               Vertex_buffer_add_vertices_from_reset(this.gfx, geom_copy, this.mat, 1, `${char} in: ${this.GetName()}`);
            }
   
            // Advance to next free char position
            geom_copy.pos[0] += (width * size * 2)+0;
            
         }
         geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = cur_line_posy;

      }
      
   }

}



