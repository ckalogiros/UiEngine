"use strict"

import { Abs } from "../../../Helpers/Math/MathOperations.js";






/** Load metrics from Chlumsky */
export function Metrics_loader_load_chlumsky_msdf_metrics(textureid, metrics_file){

   // const metrics_file = TEXTURE_PATHS[textureid].metrics;
   // const metrics_file = metrics_file;
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

/** Load metrics custom loader */
// Read the text file using 'filePos' as guide of word-line
const filePos = { start: 0, end: 0, len: 0, line: 0 };
export function Metrics_loader_load_custom_metrics(font_idx, textureid, metrics_file) {

   const metrics = _font_metrics_buffer[font_idx];

   const file = { content: '', name: '', pos: filePos, size: 0, };
   // file.content = TEXTURE_PATHS[textureid].metrics; 
   file.content = metrics_file; 
   file.size = file.content.length;


   let size = 0;
   // Get how many characters the font texture has 
   // by retrieving the line: "NumCharacters		:	[94]"
   file.pos = Find_field_by_name(file.content, "NumCharacters", file.pos);
   if (file.pos.len) size = Find_next_field(file, "[]");
   size++; // +1 for the ' ' space char

   metrics.size = size;
   
   
   file.pos = Find_field_by_name(file.content, "Image Width", file.pos);
   if (file.pos.len) {
      metrics.texWidth = Find_next_field(file, "[]");
      // The next val inside [] is the height 
      metrics.texHeight = Find_next_field(file, "[]");
      metrics.row_height = Find_next_field(file, "[]");
   }

   // In monospace {Only} the advance x is the same for every character
   metrics.advancex = Find_next_field(file, "[]");
   // Space between the characters in the texture font
   metrics.padding = Find_next_field(file, "[]");

   file.pos = Find_field_by_name(file.content, "Mono Space", file.pos);
   metrics.isMonoSpace = Find_next_field(file, "[]");
   metrics.ratio = metrics.texHeight / metrics.advancex;

   let ii = 0;

   /**
    * // TODO: Set the start character=10->\n,
    * leave emty array elements to the ' '=32
    */
   // For char space character ' '
   metrics.ch[ii].left = 0;
   metrics.ch[ii].right = 0;
   metrics.ch[ii].top = 0;
   metrics.ch[ii].bottom = 0;
   metrics.ch[ii].width = metrics.advancex;
   metrics.ch[ii].height = 0;
   metrics.ch[ii].row_num = 0;
   if (!metrics.isMonoSpace) {
      metrics.ch[ii].advancex = metrics.advancex;
      metrics.ch[ii].ratio = metrics.texHeight / metrics.ch[0].advancex; // width to height ratio(and not the other way arround)
   }

   ii++;

   // Reset the file's pos
   file.pos.start = 0;

   // Load all property values to character map for each character
   for (let i = ii; i < size; i++) {
      file.pos = Find_field_by_name(file.content, "Face Left", file.pos);
      if (file.pos.len)
         metrics.ch[i].left = Find_next_field(file, "[]");

      // Because the file.pos retains the start position
      // we just call Find_next_field() to  get the next val
      metrics.ch[i].right 			= Find_next_field(file, "[]");
      metrics.ch[i].top 			= Find_next_field(file, "[]");
      metrics.ch[i].bottom 		= Find_next_field(file, "[]");
      metrics.ch[i].width 			= Find_next_field(file, "[]");
      metrics.ch[i].height 		= Find_next_field(file, "[]");
      metrics.ch[i].row_num 		= Find_next_field(file, "[]");
      metrics.ch[i].bearingleft 	= Find_next_field(file, "[]");
      metrics.ch[i].bearingtop 	= Find_next_field(file, "[]");
      if (!metrics.isMonoSpace) {
         metrics.ch[i].advancex = Find_next_field(file, "[]");
         metrics.ch[i].ratio = metrics.ch[i].height / metrics.ch[i].width; // width to height ratio(and not the other way arround)
      }
   }

   if(DEBUG.UVS){ console.log('metrics', metrics); }
   return font_idx;
}