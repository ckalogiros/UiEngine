"use strict"

import { BLUEL, GREEN, PURPLER, REDL, WHITE, YELLOW, YELLOWL } from "../Material/Base/Colors";
import { Section } from "../Meshes/Section";



export class Widget_Color_Picker extends Section{

   constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), margin, pos, dim, col, name = 'Color Picker', style, is_debug_mesh) {

      super(mesh_bufferidx, ROOT_WIDGET_FLAGS, options, margin, pos, dim, col, name, style, is_debug_mesh);


      // Multi color vertex
      // this.sid.attr &= ~SID.ATTR.GENERIC_ATTR1_VEC4;
      this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;
      // this.mat.col = [YELLOW[9], REDL[9], GREEN[9], BLUEL[9]];
      // this.mat.col = [BLUEL[9], REDL[9], REDL[9], BLUEL[9]];
      // this.mat.col = [REDL[9], BLUEL[9],  BLUEL[9], REDL[9]];
      
      // this.mat.col = [REDL[9], REDL[9],  BLUEL[9], BLUEL[9]];
      this.mat.col = [BLUEL[9], PURPLER[9], BLUEL[9], PURPLER[9]];

   }
}