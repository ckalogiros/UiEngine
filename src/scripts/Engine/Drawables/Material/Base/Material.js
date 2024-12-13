"use strict";

import * as math from '../../../../Helpers/Math/MathOperations.js'
import { Gl_set_rgb, Gl_set_rgba } from '../../../../Graphics/Buffers/VertexBuffersOps.js';
import { Texture_load_texture_byid } from '../../../Loaders/Textures/Texture.js';
import { New_generic_char_buffer } from '../../../Core/Buffers.js';







export class Material {

   // sid;  Bitfield: Shader id for the material
   // type;  Bitfield: 
   // col;  Array: of[red,green,blue,alpha]
   // defCol;  Array: Store the initial color, used as a storage buffer
   // style;  Array: of [];
   // uv;  Array: of [v1,u1,v2,u2]
   // fontidx;  Value: The index of the uvmap data for the texture 
   // textureid;  Value: The textuure id of type 'TEXTURE.'
   // texidx;  Value: The index of the texture

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
      this.style = {rcorners:0, feather:0, border:0};
      this.uv = [0, 1, 0, 1];
      this.fontidx= INT_NULL;
      this.textureid = INT_NULL;
      this.texidx = INT_NULL;


      // if (Array.isArray(col[0])) {
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


   SetStyle(style) {

      this.style.rcorners = style.rcorners;
      this.style.feather = style.feather;
      this.style.border = style.border;
   }


   SetCopyColor(col) {

      // if((this.sid.attr & SID.ATTR.COL4_PER_VERTEX) && !Array.isArray(col[0])){
      if ((this.sid.attr & SID.ATTR.COL4_PER_VERTEX) && !(col[0].constructor === Float32Array)) {
         alert('8816772');
         return;
      }

      const len = this.col.length;
      for (let i = 0; i < len; i++) {
         const len2 = this.col[i].length;
         for (let j = 0; j < len2; j++) {
            this.col[i][j] = col[i][j];
            this.defCol[i][j] = col[i][j];
         }
      }

   }


   Copy(mat = {}) {
      alert('00188723')
      if (mat instanceof Material) {

         this.shad = mat.sid.shad;
         this.attr = mat.sid.attr;
         this.unif = mat.sid.unif;
         this.pass = mat.sid.pass;
         math.CopyArr4(this.col, mat.col);
         math.CopyArr4(this.defCol, mat.defCol);
         math.CopyArr4(this.uv, mat.uv);
         math.CopyArr3(this.style, mat.style);
         this.type = mat.type;
         this.textureid = mat.textureid;
         this.texidx = mat.texidx;
         this.fontidx= mat.fontidx;

      }
   }
}




export class FontMaterial extends Material {


   constructor(col = [1, 1, 1, 1], textureid = INT_NULL, text = '', sdf_params = [.5, .5]) {

      super(col, textureid);


      const len = text.length;
      this.char_buffer = New_generic_char_buffer(_, `Material - ${text}`);
      this.char_buffer.Init(len, text);

      this.temp_max_chars_inserted_in_gfx = 0;


      this.text = text;
      this.sdf_params = [0, 0];
      math.CopyArr2(this.sdf_params, sdf_params);
      this.textureid = textureid;

      this.sid.attr |= SID.ATTR.TEX2; // 
      this.sid.pass |= SID.PASS.TEX2; //
      if(FONT_IS_MSDF(textureid)) {
         this.sid.attr |= SID.ATTR.MSDF; // 
         // this.sid.pass |= SID.PASS.TEX2; //

      } 
      this.type |= MESH_TYPE.FONT_MATERIAL;

      // Load texture and uv map, via indexes to the actual buffers
      const texture = Texture_load_texture_byid(this.textureid, TEXTURE_TYPE.TYPE_FONT);
      this.texidx = texture.webGl_texture_idx;
      this.fontidx= texture.fontidx;


      { // Debug
         /**DEBUG*/if (DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if (DEBUG.MATERIAL && this.fontidx=== INT_NULL) console.error('Uvs Index is NULL')
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
export class Texture_Material extends Material {

   constructor(col = [1, 1, 1, 1], textureid = INT_NULL) {

      super(col);

      this.sid.attr |= SID.ATTR.TEX2; // Enable texture coordinates for the vertex shader
      this.sid.pass |= SID.PASS.TEX2;
      this.type |= MESH_TYPE.TEXTURE_MATERIAL;

      const texture = Texture_load_texture_byid(textureid, TEXTURE_TYPE.TYPE_TEXTURE);
      this.texidx = texture.webGl_texture_idx;
      this.textureId = textureid;
      // NOTE: Simple texture does not have a uvmap


      { // Debug
         /**DEBUG*/if (DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if (DEBUG.MATERIAL && this.fontidx=== INT_NULL) console.error('Uvs Index is NULL')
      }
   }
}

