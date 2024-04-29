"use strict";

import { Gl_set_wpos_XY, Gl_set_wpos_Y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { CopyArr2 } from "../../../Helpers/Math/MathOperations.js";
import { Batch_store } from "../../Batch/Batch.js";
import { GfxInfoMesh } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "./Base/Geometry.js";


export class Geometry2D_Text extends Geometry2D {

   text;

   constructor(pos=[0,0,0], fontSize=4, scale=[0,0], text='', texidx = INT_NULL) {

      let dim = [0, 0]
      dim = [fontSize, fontSize];

      super(pos, dim, scale);

      this.text = text;
      this.num_faces = text.length;
      this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
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
      const x = 0;
      const y = 0;

      // Copy gfx, to pass new start for each character
      let gfxCopy = new GfxInfoMesh(gfx);
      for (let i = 0; i < this.num_faces; i++) {

         Gl_set_wpos_XY(gfxCopy, x, y);
         gfxCopy.vb.start += gfxCopy.vb.count;
         x += this.dim[0];

         console.error('MADE A CHANGE FOR DIMENTION CALCULATION. SEE UpdatePosXY(gfx) @ Geometry2DText TO RESOLVE ANY ISSUES OF THE CHANGE')
      }
   }

   /*******************************************************************************************************************************************************/
   // Helpers
   CalcTextWidth() { // CAUTION: If font is not 'monospace', the calculation is of. For correct calc must sum all characters width from font's metrics
      // return this.num_faces * this.dim[0] * 2;
      return this.num_faces * this.dim[0];
   }

   Reposition_pre(pos) {

      CopyArr2(this.pos, pos)
      CopyArr2(this.defPos, pos)
      // CopyArr2(this.defPos, pos)

      this.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;
      const update_data = {
         sizes: [2],
         data: [pos[0], pos[1]],
      }
      Batch_store(this, SHADER_ATTRIBUTES.WPOS4, update_data, _);
   }

   static Copy(geom = {}) {

      if (geom instanceof Geometry2D) {

         super.Copy(geom);

         this.text = geom.text;
         // this.char_ratio = geom.char_ratio;

      }
   }
}