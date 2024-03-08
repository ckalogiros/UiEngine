"use strict";

import { Gl_set_wpos_XY, Gl_set_wpos_Y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Batch_store } from "../../Batch/Batch.js";
import { GfxInfoMesh } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "./Base/Geometry.js";


export class Geometry2D_Text extends Geometry2D {

   text;
   // char_ratio;

   constructor(pos=[0,0,0], fontSize=4, scale=[0,0], text='', texidx = INT_NULL) {

      
      // let advancex = 1;
      if (texidx !== INT_NULL) {
         
         // advancex = Font_get_font_advancex(texidx);
         // var char_ratio = Font_get_font_ratio(texidx);
         pos[0] += fontSize; // Case pos is set to 0, then we must add half text face width.
      }
      let dim = [0, 0]
      dim = [fontSize, fontSize];
      // dim = [fontSize*advancex, fontSize];

      super(pos, dim, scale);

      // this.char_ratio = char_ratio;
      this.text = text;
      this.num_faces = text.length;
      this.type |= MESH_TYPES_DBG.TEXT_GEOMETRY2D;
   }

   /*******************************************************************************************************************************************************/
   // 

   MoveXYZ(pos, gfx) {
      super.MoveXYZ(pos, gfx, this.num_faces)
   }

   MoveXY(x, y, gfx) {
      super.MoveXY(x, y, gfx, this.num_faces)
   }

   SetPosXYZ(pos, gfx) {
      super.SetPosXYZ(pos, gfx, this.num_faces)
   }

   SetPosY(y, gfx) {
      this.pos[1] = y;
      Gl_set_wpos_Y(gfx, y, this.num_faces);
   }

   UpdatePosXY(gfx) {
      
      // For text face position update, we must calculate the x pos of each face.
      const charPos = [0, 0];
      charPos[0] = this.pos[0];
      charPos[1] = this.pos[1];

      // Copy gfx, to pass new start for each character
      let gfxCopy = new GfxInfoMesh(gfx);
      for (let i = 0; i < this.num_faces; i++) {

         Gl_set_wpos_XY(gfxCopy, charPos);
         gfxCopy.vb.start += gfxCopy.vb.count;
         charPos[0] += this.dim[0];
         console.error('MADE A CHANGE FOR DIMENTION CALCULATION. SEE UpdatePosXY(gfx) @ Geometry2DText TO RESOLVE ANY ISSUES OF THE CHANGE')
      }
   }

   /*******************************************************************************************************************************************************/
   // Helpers
   CalcTextWidth() {
      // return this.num_faces * this.dim[0] * 2;
      return this.num_faces * this.dim[0];
   }

   Reposition_pre(pos) {
      // console.error('NO BATCH CREATED')
      CopyArr2(this.pos, pos)
      CopyArr2(this.defPos, pos)
      this.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;
      const update_data = {
         sizes: [pos.length],
         dtat: pos,
      }
      Batch_store(this, _, update_data, _);
   }

   static Copy(geom = {}) {

      if (geom instanceof Geometry2D) {

         super.Copy(geom);

         this.text = geom.text;
         // this.char_ratio = geom.char_ratio;

      }
   }
}