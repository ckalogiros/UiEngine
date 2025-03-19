"use strict";

import { Gl_add_wpos_x, Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Geometry2D } from "./Base/Geometry.js";




// function Text_get_all_new_lines(text) {

//    let new_lines = 0;
//    const len = text.length;
//    for (let i = 0; i < len; i++) {

//       if(text[i] === '\n')
//          new_lines++;
//    }

//    return new_lines;
// }





export class Geometry2D_Text extends Geometry2D {

   constructor(pos=[0,0,0], text='', size) {

      const dim = [size, size];

      super(pos, dim);

      // this.num_new_lines = Text_get_all_new_lines(text);
      // this.num_new_lines = 0;

      this.font_size = size;
      this.text = text;
      // this.num_faces = text.length - this.num_new_lines;
      this.num_faces = text.length;
      this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
   }
   AddWposXY(gfx, x, y) { super.AddWposXY(gfx, x, y, this.num_faces) }
   AddWposX(gfx, x) { super.AddWposX(gfx, x, this.num_faces) }
   AddWposY(gfx, y) { super.AddWposY(gfx, y, this.num_faces) }
   SetWposXY(gfx, x, y) { super.SetWposXY(gfx, x, y, this.num_faces) }
   SetPosX(gfx, x) { 
      const dif = x-this.pos[0];
      this.pos[0] = x;
      Gl_add_wpos_x(gfx, dif, this.num_faces);
   }
   SetPosY(gfx, y) {
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


// export class Geometry2D_msdf_text extends Geometry2D {

//    constructor(pos=[0,0,0], fontsize=4, text='', metrics_idx) {

//       const dim = [fontsize, fontsize];

//       super(pos, dim);

//       this.font_size = fontsize;
//       this.text = text;
//       this.num_faces = text.length;
//       this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
//    }
//    AddWposXY(gfx, x, y) { super.AddWposXY(gfx, x, y, this.num_faces) }
//    AddWposX(gfx, x) { super.AddWposX(gfx, x, this.num_faces) }
//    AddWposY(gfx, y) { super.AddWposY(gfx, y, this.num_faces) }
//    SetWposXY(gfx, x, y) { super.SetWposXY(gfx, x, y, this.num_faces) }
//    SetPosX(gfx, x) { 
//       this.pos[0] = x;
//       Gl_set_wpos_x(gfx, x, this.num_faces);
//    }
//    SetPosY(gfx, y) {
//       this.pos[1] = y;
//       Gl_set_wpos_y(gfx, y, this.num_faces);
//    }
//    static Copy(geom = {}) {

//       if (geom instanceof Geometry2D) {

//          super.Copy(geom);
//          this.text = geom.text;

//       }
//    }
// }

