"use strict";

import * as math from '../../../../Helpers/Math/MathOperations.js'
import { Gl_set_rgb, Gl_set_rgba } from '../../../../Graphics/Buffers/VertexBuffersOps.js';
import { Texture_load_texture_byid } from '../../../Loaders/Textures/Texture.js';
import { New_generic_char_buffer } from '../../../Core/Buffers.js';
import { Texture_metrics_get_texture_pixel_size, Uv_get_uv_coords } from '../../../Loaders/Textures/TextureUvMap.js';
import { SID } from '../../../../Graphics/Global/GfxConstants.js';
import { DEBUG, MESH_TYPE, TEXTURE_TYPE } from '../../../Global/EngineConstants.js';







/** */
export class Material {

   // TODO
   // col_id; // An index to the Str_buffer. As a name, is the name of the shader's color attribute. 
   // uv_id; // An index to the Str_buffer. As a name, is the name of the shader's textureCoord attribute. 
   // style_id; // An index to the Str_buffer. As a name, is the name of the shader's textureCoord attribute. 

   constructor(col = [1, 1, 1, 1]) {

      this.sid = {
         shad: SID.SHAD.INDEXED_PATT_DISCONTINUE_4,
         attr: SID.ATTR.COL4,
         inst: 0x0,
         unif: 0,
         pass: 0,
      };

      this.type = MESH_TYPE.MATERIAL;
      this.style = { rcorners: 0, feather: 0, border: 0 };
      this.uv = [0, 1, 0, 1];
      this.metrics_idx = INT_NULL;
      this.texture_file_id = INT_NULL;
      this.texidx = INT_NULL;

      if (col[0].constructor === Float32Array) {

         const len = col.length;
         this.col = new Array(len);
         this.defCol = new Array(len);


         for (let i = 0; i < len; i++) {
            this.col[i] = new Float32Array(col[i]);
            this.defCol[i] = new Float32Array(col[i]);
         }

         this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      }
      else {
         this.col = new Float32Array(col);
         this.defCol = new Float32Array(col);
      }

   }
   SetColorAllRGB(col, gfx, num_faces) {
      math.CopyArr3(this.col, col);
      math.CopyArr3(this.defCol, col);
      Gl_set_rgb(gfx, this.col, num_faces);
   }
   SetColorRGB(col, gfx, num_faces) {
      math.CopyArr3(this.col, col);
      Gl_set_rgb(gfx, this.col, num_faces);
   }
   SetColorRGBA(col, gfx, num_faces) {
      math.CopyArr4(this.col, col);
      Gl_set_rgba(gfx, this.col, num_faces);
   }

}
/** */
export class Material_Font extends Material {

   constructor(col = [1, 1, 1, 1], texture_file_id = INT_NULL, text = '', sdf_params = [.5, .5], variant_idx) {

      super(col, texture_file_id);


      const len = text.length;
      this.char_buffer = New_generic_char_buffer(_, `Material - ${text}`);
      this.char_buffer.Init(len, text);

      this.temp_max_chars_inserted_in_gfx = 0;


      this.text = text;
      this.sdf_params = [0, 0];
      math.CopyArr2(this.sdf_params, sdf_params);
      this.texture_file_id = texture_file_id;

      this.sid.attr |= SID.ATTR.TEX2; // 
      this.sid.pass |= SID.ATTR.TEX2; //
      if (FONT_IS_MSDF(texture_file_id)) {
         this.sid.attr |= SID.ATTR.MSDF; // 
      }
      this.type |= MESH_TYPE.FONT_MATERIAL;

      // Load texture and uv map, via indexes to the actual buffers
      const texture = Texture_load_texture_byid(TEXTURE_TYPE.TYPE_FONT, this.texture_file_id, variant_idx, _);
      this.texidx = texture.tex_idx;
      this.metrics_idx = texture.metrics_idx;

      this.pixel_size = Texture_metrics_get_texture_pixel_size(this.metrics_idx)/2;



      { // Debug
         /**DEBUG*/if (DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if (DEBUG.MATERIAL && this.metrics_idx === INT_NULL) console.error('Uvs Index is NULL')
      }
   }
}
/** Used for texture atlases but not font rendering. The difference is that in a font atlas texture there are many characters to be represented via Text_Mesh class. */
export class Material_Atlas_Texture extends Material {

   constructor(col = [1, 1, 1, 1], texture_file_id = INT_NULL, sub_tex_idx = INT_NULL, sdf_params = [.5, .5]) {

      super(col, texture_file_id);

      this.sdf_params = [0, 0];
      math.CopyArr2(this.sdf_params, sdf_params);

      this.sid.attr |= SID.ATTR.TEX2;
      this.sid.pass |= SID.ATTR.TEX2;
      if (FONT_IS_MSDF(texture_file_id)) {
         this.sid.attr |= SID.ATTR.MSDF;
      }
      this.type |= MESH_TYPE.ATLAS_TEXTURE_MATERIAL;

      let texture_type = TEXTURE_TYPE.TYPE_FONT_SYMBOL;

      // Load texture and uv map, via indexes to the actual buffers
      const texture = Texture_load_texture_byid(texture_type, texture_file_id, _, sub_tex_idx);
      this.texidx = texture.tex_idx;
      this.metrics_idx = texture.metrics_idx;
      this.texture_file_id = texture_file_id;
      this.sub_tex_idx = sub_tex_idx; // The index of the sub-texture in the Atlas texture

      this.uv = Uv_get_uv_coords(this.metrics_idx, this.sub_tex_idx);


      { // Debug
         /**DEBUG*/if (DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if (DEBUG.MATERIAL && this.metrics_idx === INT_NULL) console.error('Uvs Index is NULL')
      }
   }
}
/** Used for Font rendering. This is the case where many font sizes are on the same atlas, so the variant_idx refers to the font size texture characters. */
export class Material_Atlas_Texture_Variant extends Material {


   constructor(col = [1, 1, 1, 1], texture_file_id = INT_NULL, sub_tex_idx = INT_NULL, sdf_params = [.5, .5], variant_idx = 0) {

      super(col, texture_file_id);

      this.sdf_params = [0, 0];
      math.CopyArr2(this.sdf_params, sdf_params);

      this.sid.attr |= SID.ATTR.TEX2; // 
      this.sid.pass |= SID.ATTR.TEX2; //
      if (FONT_IS_MSDF(texture_file_id)) {
         this.sid.attr |= SID.ATTR.MSDF; // 
      }
      this.type |= MESH_TYPE.ATLAS_TEXTURE_MATERIAL;

      let texture_type = TEXTURE_TYPE.TYPE_VARIANT_FONT;

      // Load texture and uv map, via indexes to the actual buffers
      const texture = Texture_load_texture_byid(texture_type, texture_file_id, variant_idx, sub_tex_idx);
      this.texidx = texture.tex_idx;
      this.metrics_idx = texture.metrics_idx;
      this.texture_file_id = texture_file_id;
      this.sub_tex_idx = sub_tex_idx; // The index of the sub-texture in the Atlas texture

      this.uv = Uv_get_uv_coords(this.metrics_idx, this.sub_tex_idx);


      { // Debug
         /**DEBUG*/if (DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if (DEBUG.MATERIAL && this.metrics_idx === INT_NULL) console.error('Uvs Index is NULL')
      }
   }
}
/**
 * If texture is an atlas imported from the engine,
 *    we should have metrics for it, so we get the uvs from it's metrics storage.
 * If texture is created from a framebuffer,
 *    1. If it is an atlas texture, the uvs are calculated at the creation site of the framebuffer,
 *    2. Else the uvs are [0,1,0,1] covering the whole texture. 
 */
export class Material_Texture extends Material {

   constructor(col = [1, 1, 1, 1], texture_file_id = INT_NULL) {

      super(col);

      this.sid.attr |= SID.ATTR.TEX2; // Enable texture coordinates for the vertex shader
      this.sid.pass |= SID.ATTR.TEX2;
      this.type |= MESH_TYPE.TEXTURE_MATERIAL;

      let texture_type = TEXTURE_TYPE.TYPE_TEXTURE; // Initialize to comon texture

      if (FONT_IS_MSDF(texture_file_id)) {
         this.sid.attr |= SID.ATTR.MSDF; // 
         texture_type = TEXTURE_TYPE.TYPE_FONT_SYMBOL; // Case texture is type of font symbol with metrics
      }

      const texture = Texture_load_texture_byid(texture_type, texture_file_id, _, _);
      this.texidx = texture.tex_idx;
      this.texture_id = texture_file_id;
      // NOTE: Simple texture does not have a uvmap


      { // Debug
         /**DEBUG*/if (DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if (DEBUG.MATERIAL && this.metrics_idx === INT_NULL) console.error('Uvs Index is NULL')
      }
   }
}

