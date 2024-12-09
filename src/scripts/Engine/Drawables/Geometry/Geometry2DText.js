"use strict";

import { Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { Font_metrics_get_char_width, Font_metrics_get_row_height, Msdf_Font_get_font_advancex, Msdf_Font_get_font_line_height, Msdf_ont_get_char_plane_bounds_height, Msdf_ont_get_char_plane_bounds_width } from "../../Loaders/Font/Font.js";
import { Geometry2D } from "./Base/Geometry.js";










export class Geometry2D_Text extends Geometry2D {

   constructor(pos=[0,0,0], fontSize=4, scale=[0,0], text='', textureid = INT_NULL, uvmap_idx) {


      // const advancex = Font_metrics_get_face_advancex(uvmap_idx)/2;
      const width = Font_metrics_get_char_width(uvmap_idx, text[0])/2;
      const font_height = Font_metrics_get_row_height(uvmap_idx)/2;

      const dim = [width, font_height];

      super(pos, dim, scale);

      this.text = text;
      this.num_faces = text.length;
      this.type |= MESH_TYPE.TEXT_GEOMETRY2D;
   }
   AddWposXY(gfx, x, y) { super.AddWposXY(gfx, x, y, this.num_faces) }
   AddWposX(gfx, x) { super.AddWposX(gfx, x, this.num_faces) }
   AddWposY(gfx, y) { super.AddWposY(gfx, y, this.num_faces) }
   SetWposXY(gfx, x, y) { super.SetWposXY(gfx, x, y, this.num_faces) }
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


      // const advancex = Msdf_font_metrics_get_face_advancex(uvmap_idx)/2;
      // const width = Msdf_ont_get_char_plane_bounds_width(uvmap_idx, text[0])/2;
      // const font_height = Msdf_ont_get_char_plane_bounds_height(uvmap_idx)/2;

      // const dim = [width, font_height];
      // const sizex = Msdf_Font_get_font_advancex(uvmap_idx) * fontsize;
      // const sizey = Msdf_Font_get_font_line_height(uvmap_idx) * fontsize;
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

