"use strict";

import { Gl_set_wpos_Y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Geometry2D } from "./Base/Geometry.js";










export class Geometry2D_Text extends Geometry2D {

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


   static Copy(geom = {}) {

      if (geom instanceof Geometry2D) {

         super.Copy(geom);
         this.text = geom.text;

      }
   }
}