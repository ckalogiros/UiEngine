"use strict";

import { Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Font_metrics_get_interpolated_x } from "../../Loaders/Font/Font.js";
import { Geometry2D } from "./Base/Geometry.js";










export class Geometry2D_Text extends Geometry2D {

   constructor(pos=[0,0,0], fontSize=4, scale=[0,0], text='', texidx = INT_NULL, advancex) {


      // const ratio = Font_metrics_get_interpolated_x(0)
      // const ratio = advancex/fontSize;
      // console.log('][][][][][][][][][][][][][][][][][', ratio)

      let dim = [0, 0]
      // dim = [fontSize, fontSize];
      dim = [advancex, fontSize];

      super(pos, dim, scale);

      this.text = text;
      this.num_faces = text.length;
      this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
   }




   
   /*******************************************************************************************************************************************************/
   // 

   AddWposXY(gfx, x, y) {
      super.AddWposXY(gfx, x, y, this.num_faces)
   }

   SetWposXY(pos, gfx) {
      super.SetWposXY(gfx, pos[0], pos[1], this.num_faces)
   }

   SetPosY(y, gfx) {
      this.pos[1] = y;
      Gl_set_wpos_y(gfx, y, this.num_faces);
   }


   static Copy(geom = {}) {

      if (geom instanceof Geometry2D) {

         super.Copy(geom);
         this.text = geom.text;

      }
   }
}