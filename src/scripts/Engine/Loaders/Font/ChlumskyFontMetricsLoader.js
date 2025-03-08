"use strict";

import { Abs } from "../../../Helpers/Math/MathOperations.js";


export function Load_msdf_font_metrics_new(textureid){

   const metrics_file = TEXTURE_PATHS[textureid].metrics;
   const obj      = JSON.parse(metrics_file);
   const atlas    = obj.atlas;
   const glyphs   = obj.glyphs;

   const texture_width = atlas.width;
   const texture_height = atlas.height;

   const glyph = {
      advance  : 0,
      char     : 0,
      left     : 0,
      right    : 0,
      top      : 0,
      bottom   : 0,
      width    : 0,
      height   : 0,
   }


   const ascender    = obj.metrics.ascender;
   const descender   = obj.metrics.descender;
   const advance     = glyphs[0].advance;
   const base_line = descender;


   const uvmap = [];
   uvmap[0] = [0.0, 0.0, 0.0, 0.0];          // Set for space character
   const plane_bounds = [];
   plane_bounds[0] = {left:0, right:advance, top:-obj.metrics.lineHeight, bottom:0, width:advance, height:obj.metrics.lineHeight, yoffset:0};   // Set for space character
   const atlas_bounds = [];
   atlas_bounds[0] = {left:0, right:0, top:0, bottom:0, width:0, height:0};   // Set for space character


   
   const U1 = 0, U2 = 1, V1 = 2, V2 = 3;

   let normalizedU = 1.0 / texture_width;	   // Normalize texture coords to 0-1 values.
   let normalizedV = 1.0 / texture_height;   // Normalize texture coords to 0-1 values.

   for (let i = 1; i < glyphs.length; i++) {
      
      // glyph.advance  = glyphs[i].advance * size;
      glyph.char   = glyphs[i].unicode;
      glyph.left   = glyphs[i].atlasBounds.left;
      glyph.right  = glyphs[i].atlasBounds.right;
      glyph.top    = glyphs[i].atlasBounds.top;
      glyph.bottom = glyphs[i].atlasBounds.bottom;
      glyph.width  = glyph.right  - glyph.left;
      glyph.height = glyph.bottom - glyph.top;
      
      
      // Calculate uvs
      uvmap[i] = [0.0, 0.0, 0.0, 0.0]; // Create new array for each character's uv coord.
      uvmap[i][U1] = normalizedU * glyph.left;
      uvmap[i][U2] = normalizedU * glyph.right;
      uvmap[i][V1] = normalizedV * glyph.top;
      uvmap[i][V2] = normalizedV * glyph.bottom;

      
      // Store
      plane_bounds[i] = {
         left:    glyphs[i].planeBounds.left,
         right:   glyphs[i].planeBounds.right,
         top:     glyphs[i].planeBounds.top,
         bottom:  glyphs[i].planeBounds.bottom,
         width:   glyphs[i].planeBounds.right-glyphs[i].planeBounds.left,
         height:  glyphs[i].planeBounds.bottom-glyphs[i].planeBounds.top,
         yoffset: (Abs(obj.metrics.lineHeight)-(Abs(glyphs[i].planeBounds.top) )),
      };
      
      atlas_bounds[i] = {
         left:    glyph.left,
         right:   glyph.right,
         top:     glyph.top,
         bottom:  glyph.bottom,
         width:   glyph.width,
         height:  glyph.height,
      };

   }
   
   return {
      uvmap       : uvmap,
      plane_bounds: plane_bounds,
      atlas_bounds: atlas_bounds,
      texture:{
         type        : obj.atlas.type,
         width       : texture_width, 
         height      : texture_height, 
         ascender    : ascender,
         descender   : descender,
         advance     : advance, // For monospace fonts
         
         line_height : obj.metrics.lineHeight,
         base_line   : base_line,
         
      },
   }
}
