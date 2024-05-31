"use strict"

import { GREY } from "../Material/Base/Colors";
import { Section } from "../Meshes/Section";



export class Widget_Color_Picker extends Section{

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), margin, pos, dim, col, name = 'Color Picker', style, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, options, margin, pos, dim, col, name, style, is_debug_mesh);


      // Multi color vertex
      this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      // this.menu.mat.col = [WHITE, REDL[7], GREEN[7], BLUEL[7]];
      // this.menu.mat.defCol = [WHITE, REDL[7], GREEN[7], BLUEL[7]];
      // this.menu.mat.col[1][3] = .5;
      // this.menu.mat.col[1][7] = .5;
      // this.menu.mat.col[1][11] = .5;
      // this.menu.mat.col[1][15] = .6;

   }
}