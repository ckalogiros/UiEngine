"use strict";

import { Gl_add_wpos_x, Gl_set_wpos_x, Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Uv_metrics_get_row_height, Uv_metrics_get_texture_width } from "../../Loaders/Textures/TextureUvMap.js";
import { Geometry2D } from "./Base/Geometry.js";




function Text_get_all_new_lines(text) {

   let new_lines = 0;
   const len = text.length;
   for (let i = 0; i < len; i++) {

      if(text[i] === '\n')
         new_lines++;
   }

   return new_lines;
}





export class Geometry2D_Text extends Geometry2D {

   constructor(pos=[0,0,0], fontSize=4, scale=[0,0], text='', textureid = INT_NULL, uvmap_idx) {


      // const advancex = Uv_metrics_get_face_advancex(uvmap_idx)/2;
      const width = Uv_metrics_get_texture_width(uvmap_idx, text[0])/2;
      const font_height = Uv_metrics_get_row_height(uvmap_idx)/2;

      const dim = [width, font_height];

      super(pos, dim, scale);

      const new_lines = Text_get_all_new_lines(text)

      this.text = text;
      this.num_faces = text.length - new_lines;
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


export class Geometry2D_msdf_text extends Geometry2D {

   constructor(pos=[0,0,0], fontsize=4, scale=[0,0], text='', textureid = INT_NULL, uvmap_idx) {

      const dim = [fontsize, fontsize];

      super(pos, dim, scale);

      this.text = text;
      this.num_faces = text.length;
      this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
   }
   AddWposXY(gfx, x, y) { super.AddWposXY(gfx, x, y, this.num_faces) }
   AddWposX(gfx, x) { super.AddWposX(gfx, x, this.num_faces) }
   AddWposY(gfx, y) { super.AddWposY(gfx, y, this.num_faces) }
   SetWposXY(gfx, x, y) { super.SetWposXY(gfx, x, y, this.num_faces) }
   SetPosX(gfx, x) { 
      this.pos[0] = x;
      Gl_set_wpos_x(gfx, x, this.num_faces);
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

