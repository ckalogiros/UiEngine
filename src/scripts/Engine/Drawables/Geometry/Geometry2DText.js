"use strict";

import { Gl_add_wpos_x, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Geometry2D } from "./Base/Geometry.js";






export class Geometry2D_Text extends Geometry2D {

   constructor(pos=[0,0,0], text='', size) {

      const dim = [size, size];

      super(pos, dim);

      this.font_size = size;
      this.text = text;
      this.num_faces = text.length;
      this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
   }
   AddWposXY(gfx, x, y) { super.AddWposXY(gfx, x, y, this.num_faces) }
   AddWposX(gfx, x) { super.AddWposX(gfx, x, this.num_faces) }
   AddWposY(gfx, y) { super.AddWposY(gfx, y, this.num_faces) }
   SetWposXY(gfx, x, y) { super.SetWposXY(gfx, x, y, this.num_faces) }
   SetWposXYFromAddWPos(gfx, x, y) { 
      const difx = x-this.pos[0];
      this.pos[0] = x;
      const dify = y-this.pos[0];
      this.pos[1] = y;
      Gl_set_wpos_xy(gfx, difx, dify, this.num_faces);
   }
   SetWposXFromAddWPos(gfx, x) { 
      const dif = x-this.pos[0];
      this.pos[0] = x;
      Gl_add_wpos_x(gfx, dif, this.num_faces);
   }
   SetWposYFromAddWPos(gfx, y) {
      const dif = y-this.pos[0];
      this.pos[1] = y;
      Gl_set_wpos_y(gfx, dif, this.num_faces);
   }
   static Copy(geom = {}) {

      if (geom instanceof Geometry2D) {

         super.Copy(geom);
         this.text = geom.text;

      }
   }
}

