"use strict";

import { consola_msdf_test_1024_metrics } from "../../../../../resources/fonts/consolas_sdf/metrics/consola_msdf_test_1024_metrics.js";
import { Abs } from "../../../Helpers/Math/MathOperations.js";


const _font_metrics_buffer = [];




// const CONSOLE_MSDF_METRICS = consola_msdf_test_1024_metrics;

// export function Parse_json_metrics(json_metrics_object){
export function Load_msdf_font_metrics_new(textureid){

   const metrics_file = TEXTURE_PATHS[textureid].metrics;
   const obj      = JSON.parse(metrics_file);
   const atlas    = obj.atlas;
   const glyphs   = obj.glyphs;

   // const size = atlas.size;
   const texture_width = atlas.width;
   const texture_height = atlas.height;

   const m = {
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
   const plane_extra_space_y = (obj.metrics.lineHeight - (Abs(ascender) + Abs(descender))) *2;
   // const base_line = obj.metrics.lineHeight - (obj.metrics.lineHeight - (Abs(ascender) + Abs(descender) * 1.)*1.);
   // const base_line = obj.metrics.lineHeight - (Abs(ascender) + Abs(descender) * 1.);
   // const base_line = descender + plane_extra_space_y;
   const base_line = descender;


   const uvmap = [];
   uvmap[0] = [0.0, 0.0, 0.0, 0.0];          // Set for space character
   const plane_bounds = [];
   // plane_bounds[0] = {left:0, right:advance, top:-obj.metrics.lineHeight/2, bottom:obj.metrics.lineHeight/2, width:advance, height:obj.metrics.lineHeight, yoffset:0};   // Set for space character
   plane_bounds[0] = {left:0, right:advance, top:-obj.metrics.lineHeight, bottom:0, width:advance, height:obj.metrics.lineHeight, yoffset:0};   // Set for space character
   const atlas_bounds = [];
   atlas_bounds[0] = {left:0, right:0, top:0, bottom:0, width:0, height:0};   // Set for space character


   
   // const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
   const U1 = 0, U2 = 1, V1 = 2, V2 = 3;

   let normalizedU = 1.0 / texture_width;	   // Normalize texture coords to 0-1 values.
   let normalizedV = 1.0 / texture_height;   // Normalize texture coords to 0-1 values.

   for (let i = 1; i < glyphs.length; i++) {
      
      // m.advance  = glyphs[i].advance * size;
      m.char   = glyphs[i].unicode;
      m.left   = glyphs[i].atlasBounds.left;
      m.right  = glyphs[i].atlasBounds.right;
      m.top    = glyphs[i].atlasBounds.top;
      m.bottom = glyphs[i].atlasBounds.bottom;
      m.width  = m.right  - m.left;
      m.height = m.bottom - m.top;
      
      
      // Calculate uvs
      uvmap[i] = [0.0, 0.0, 0.0, 0.0]; // Create new array for each character's uv coord.
      uvmap[i][U1] = normalizedU * m.left;
      uvmap[i][U2] = normalizedU * m.right;
      uvmap[i][V1] = normalizedV * m.top;
      uvmap[i][V2] = normalizedV * m.bottom;

      
      // Store
      plane_bounds[i] = {
         left:    glyphs[i].planeBounds.left,
         right:   glyphs[i].planeBounds.right,
         top:     glyphs[i].planeBounds.top,
         bottom:  glyphs[i].planeBounds.bottom,
         width:   glyphs[i].planeBounds.right-glyphs[i].planeBounds.left,
         // width:   Abs(Abs(glyphs[i].planeBounds.right)-Abs(glyphs[i].planeBounds.left)),
         height:  glyphs[i].planeBounds.bottom-glyphs[i].planeBounds.top,
         // yoffset: (Abs(ascender)-Abs(glyphs[i].planeBounds.top)) * 2,
         
         // yoffset: (Abs(ascender)-(Abs(ascender) + Abs(descender))) * 2,
         // yoffset: (Abs(obj.metrics.lineHeight)-(Abs(glyphs[i].planeBounds.top) )) * 2,
         // yoffset: (Abs(ascender)-(Abs(glyphs[i].planeBounds.top) )) * 2,
         // yoffset: (Abs(ascender)-(Abs(glyphs[i].planeBounds.top) )) ,
         yoffset: (Abs(obj.metrics.lineHeight)-(Abs(glyphs[i].planeBounds.top) )),
         // yoffset: (Abs(ascender)-Abs(glyphs[i].planeBounds.top)) * 2,
         // yoffset: (Abs(ascender)-Abs(glyphs[i].planeBounds.top)),
         // yoffset: ((glyphs[i].planeBounds.top)*2),
         // yoffset: (ascender-glyphs[i].planeBounds.top),
         // yoffset: (Abs(obj.metrics.lineHeight) - (Abs(glyphs[i].planeBounds.top))),
      };
      
      atlas_bounds[i] = {
         left:    m.left,
         right:   m.right,
         top:     m.top,
         bottom:  m.bottom,
         width:   m.width,
         height:  m.height,
      };

      // console.log('ch', String.fromCharCode(i+CHAR_ARRAY_START_OFFSET),
      //    '\nadvance:', glyphs[i].advance,  
      //    '\nwidth:', plane_bounds[i].width,
      //    '\ntop:', plane_bounds[i].top,
      //    '\nbottom:', plane_bounds[i].bottom,
      //    '\nheight:', plane_bounds[i].height,
      // )
      
   }
   
   // { // Debug-Print
   //    console.log('-------------------', 
   //       '\nlineH', obj.metrics.lineHeight,
   //       '\nasc', ascender, 
   //       '\ndesc', descender,
   //       '\nABS(asc+desc)', Abs(ascender) + Abs(descender),
   //       '\nABS(asc-desc)', Abs(ascender) - Abs(descender),
   //       '\nlineH-ABS(asc+desc)', obj.metrics.lineHeight - (Abs(ascender) + Abs(descender)),
   //       '\nlineH-ABS(asc-desc)', obj.metrics.lineHeight - (Abs(ascender) - Abs(descender)),
   //       '\nbase: ', base_line,  
   //    )
   //    console.log('-------------------\n',
   //       'base: ', base_line,  
   //       '\nascender:', -ascender ,
   //       '\n(-ascender)+descender', (-ascender)+descender ,
   //    )
   //    // console.log('------------------- metrics:', _font_metrics_buffer)
   // }
   

   
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
