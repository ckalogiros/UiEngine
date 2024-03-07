"use strict";

import * as math from '../../../../Helpers/Math/MathOperations.js'
import { GlSetColor, GlSetColorAlpha, GlSetColorPerVertex } from "../../../../Graphics/Buffers/GlBufferOps.js";
import { Texture_load_texture_byid } from '../../../Loaders/Textures/Texture.js';


let _materialId = 0;


export class Material {

   sid; // Bitfield: Shader id for the material
   type; // Bitfield: 
   col; // Array: of[red,green,blue,alpha]
   defCol; // Array: Store the initial color, used as a storage buffer
   style; // Array: of [];
   uv; // Array: of [v1,u1,v2,u2]
   uvIdx; // Value: The index of the uvmap data for the texture
   texidx; // Value: The index of the texture

   // col_id; // An index to the Str_buffer. As a name, is the name of the shader's color attribute. 
   // uv_id; // An index to the Str_buffer. As a name, is the name of the shader's textureCoord attribute. 
   // style_id; // An index to the Str_buffer. As a name, is the name of the shader's textureCoord attribute. 
   
   constructor(col = [1,1,1,1]) {

      this.sid = {
         shad: 0,
         attr: SID.ATTR.COL4,
         unif: 0,
         pass: 0,
      };
      
      this.col = [0,0,0,1];
      math.CopyArr4(this.col, col);
      this.defCol = [0,0,0,0];
      math.CopyArr4(this.defCol, col);
      this.type = MESH_TYPES_DBG.MATERIAL;
      this.style = [0, 0, 0]; // Initialize style: []
      this.uv = [0,1,0,1];
      this.uvIdx  = INT_NULL;
      this.texidx = INT_NULL;

      // this.col_id = INT_NULL;  
      // this.uv_id = INT_NULL;   
      // this.style_id = INT_NULL;
      

      { // Debug
         /**Unique id*/if (DEBUG.MATERIAL) Object.defineProperty(this, 'id', { value: _materialId++ });
      }
   }

   SetColor(col, gfx) {
      if(gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX){
         math.CopyMat4(this.col, col);
         GlSetColorPerVertex(gfx, this.col);
      }
      else {
         math.CopyArr4(this.col, col);
         GlSetColor(gfx, this.col);
      }
   }

   SetHoverColor(gfx) {
      const intensity = 1.4;
      if(gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX){
         GlSetColorPerVertex(gfx, math.Mult_mat4_scalar2(this.col, intensity));
      }
      else {
         GlSetColor(gfx, math.Mult_arr4_scalar2(this.col, intensity));
      }
   }

   SeHoverColortDefault(gfx) {
      if(gfx.sid.attr & SID.ATTR.COL4_PER_VERTEX){
         math.CopyMat4(this.col, this.defCol);
         GlSetColorPerVertex(gfx, this.col);
      }
      else {
         math.CopyArr4(this.col, this.defCol);
         GlSetColor(gfx, this.col);
      }
   }

   SetDefaultColor(gfx, num_faces) {
      math.CopyArr4(this.col, this.defCol);
      GlSetColor(gfx, this.col, num_faces);
   }

   SetColorRGB(col, gfx, num_faces) {
      math.CopyArr3(this.col, col);
      GlSetColor(gfx, this.col, num_faces);
   }

   SetColorAlpha(alpha, gfx, num_faces) {
      this.col[3] = alpha;
      GlSetColorAlpha(gfx, this.col[3], num_faces);
   }

   SetStyle(style) {
      if(!Array.isArray(style)) console.error
      math.CopyArr3(this.style, style); 
   }

   SetNewAttribute(attribName = null,) { }


   SetNewUniform() { }


   Copy(mat = {}){

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
         this.texidx = mat.texidx;
         this.uvIdx = mat.uvIdx;

		}
	}
}

export class FontMaterial extends Material {

   text;
   sdf_params;

   constructor(col = [1,1,1,1], texidx=INT_NULL, text='', sdf_params = [.5,.5]) {

      super(col, texidx);
      this.text = text;
      this.sdf_params = [0, 0];
      math.CopyArr2(this.sdf_params, sdf_params);
      this.texidx = texidx;
      
      this.sid.shad |= SID.SHAD.PRE_MULTIPLIED_ALPHA; // E
      this.sid.attr |= SID.ATTR.TEX2; // 
      this.sid.attr |= SID.ATTR.MSDF; // 
      this.type |= MESH_TYPES_DBG.FONT_MATERIAL;
      
      // Load texture and uv map, via indexes to the actual buffers
      const tex_idxs = Texture_load_texture_byid(this.texidx, TEXTURE_TYPE.TYPE_FONT);
      this.texidx = tex_idxs.texidx;
      this.uvIdx = tex_idxs.uvmapidx;
      
      
      { // Debug
         /**DEBUG*/if(DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if(DEBUG.MATERIAL && this.uvIdx === INT_NULL) console.error('Uvs Index is NULL')
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

   constructor(col = [1,1,1,1], textureid=INT_NULL) {

      super(col);
      
      this.sid.attr |= SID.ATTR.TEX2; // Enable texture coordinates for the vertex shader
      this.type |= MESH_TYPES_DBG.TEXTURE_MATERIAL;
      
      const tex_idxs = Texture_load_texture_byid(textureid, TEXTURE_TYPE.TYPE_TEXTURE);  
      this.texidx = tex_idxs.texidx;
      // NOTE: Simple texture does not have a uvmap


            
      { // Debug
         /**DEBUG*/if(DEBUG.MATERIAL && this.texidx === INT_NULL) console.error('Texture Index is NULL')
         /**DEBUG*/if(DEBUG.MATERIAL && this.uvIdx === INT_NULL) console.error('Uvs Index is NULL')
      }
   }
}

