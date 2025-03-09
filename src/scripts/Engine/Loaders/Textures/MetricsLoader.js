"use strict"

import { Abs } from "../../../Helpers/Math/MathOperations.js";






/** Load metrics from Chlumsky */
export function Metrics_loader_load_chlumsky_msdf_metrics(metrics_file, sub_tex_idx){

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

   // If the texture is a font texture, leave [0] element for the ' ' space character, else start inserting sub-texture coordinates from [0]
   const start_idx = (sub_tex_idx !== INT_NULL) ? 0 : 1; 

   for (let i = start_idx; i < glyphs.length; i++) {
      
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
export function Metrics_loader_load_custom_metrics(metrics_file) {

   const metrics = {
      sub_tex: [],
      size: 0,
      texWidth: 0,
      texHeight: 0,
      row_height: 0,
      advancex: 0, // Start (in pixels) of curr character unti the start of next character(in the texture)
      padding: 0,
      isMonoSpace: 0, // In non monospace fonts, the advancex variable is different from char to char (compare to monospace fonts)
      ratio: 0,
   };

   const file = { content: {}, name: '', pos: filePos, size: 0, };
   // file.content = TEXTURE_PATHS[texture_file_id].metrics; 
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
   metrics.sub_tex[ii] = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      advancex: 0,
      width: 0,
      height: 0,
      // bearingtop: 0,
      // bearingleft: 0,
      ratio: 0, // Ratio width to height, for each character's. Used for non monospace fonts
   };
   // For char space character ' '
   metrics.sub_tex[ii].left = 0;
   metrics.sub_tex[ii].right = 0;
   metrics.sub_tex[ii].top = 0;
   metrics.sub_tex[ii].bottom = 0;
   metrics.sub_tex[ii].width = metrics.advancex;
   metrics.sub_tex[ii].height = 0;
   metrics.sub_tex[ii].row_num = 0;
   if (!metrics.isMonoSpace) {
      metrics.sub_tex[ii].advancex = metrics.advancex;
      metrics.sub_tex[ii].ratio = metrics.texHeight / metrics.sub_tex[0].advancex; // width to height ratio(and not the other way arround)
   }

   ii++;

   // Reset the file's pos
   file.pos.start = 0;

   // Load all property values to character map for each character
   for (let i = ii; i < size; i++) {

      metrics.sub_tex[i] = {
         left: 0,
         right: 0,
         top: 0,
         bottom: 0,
         advancex: 0,
         width: 0,
         height: 0,
         // bearingtop: 0,
         // bearingleft: 0,
         ratio: 0, // Ratio width to height, for each character's. Used for non monospace fonts
      };

      file.pos = Find_field_by_name(file.content, "Face Left", file.pos);
      if (file.pos.len)
         metrics.sub_tex[i].left = Find_next_field(file, "[]");

      // Because the file.pos retains the start position
      // we just call Find_next_field() to  get the next val
      metrics.sub_tex[i].right 			= Find_next_field(file, "[]");
      metrics.sub_tex[i].top 			= Find_next_field(file, "[]");
      metrics.sub_tex[i].bottom 		= Find_next_field(file, "[]");
      metrics.sub_tex[i].width 			= Find_next_field(file, "[]");
      metrics.sub_tex[i].height 		= Find_next_field(file, "[]");
      metrics.sub_tex[i].row_num 		= Find_next_field(file, "[]");
      metrics.sub_tex[i].bearingleft 	= Find_next_field(file, "[]");
      metrics.sub_tex[i].bearingtop 	= Find_next_field(file, "[]");
      if (!metrics.isMonoSpace) {
         metrics.sub_tex[i].advancex = Find_next_field(file, "[]");
         metrics.sub_tex[i].ratio = metrics.sub_tex[i].height / metrics.sub_tex[i].width; // width to height ratio(and not the other way arround)
      }
   }

   if(DEBUG.UVS){ console.log('metrics', metrics); }

   const uv_map = Create_uv_map(metrics);
   // return uv_map;

   return {
      metrics:metrics,
      uv_map:uv_map,
   };
}
/** */
function Create_uv_map(metrics) {

   const uvmap = [];

   let transormedU = 1.0 / metrics.texWidth;	// Transform to 0-1 coords
   let transormedV = 1.0 / metrics.texHeight;	// Transform to 0-1 coords

   const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
   for (let j = 0; j < metrics.size; j++) {
      
      const uv = metrics.sub_tex[j]; // Get a characters pixel position in the font texture.
      
      // New uv coordinates for every character
      uvmap[j] = [0,0,0,0];

      // and store them to the uvmap
      uvmap[j] = [0.0, 0.0, 0.0, 0.0]; //  Create new uvs for each character
      uvmap[j][U1] = transormedU * uv.left;
      uvmap[j][U2] = transormedU * uv.right;
      uvmap[j][V1] = metrics.row_height * transormedV * (uv.row_num);
      uvmap[j][V2] = uvmap[j][V1] + (metrics.row_height * transormedV);
      
      // Round for any potential floating-point rounding errors
      const round = 100000;
      uvmap[j][V1] = Math.round(uvmap[j][V1] * round) / round;
      uvmap[j][V2] = Math.round(uvmap[j][V2] * round) / round;
      uvmap[j][U1] = Math.round(uvmap[j][U1] * round) / round;
      uvmap[j][U2] = Math.round(uvmap[j][U2] * round) / round;
   }

   if(DEBUG.UVS){ console.log('uvmap:', uvmap); }
   
   return uvmap;
}
/* Finds text between delimiters, in a string buffer. */
function Find_next_field(file, delim) {
   /**
    * pos reference's indexes in the string buffer.
    * 		pos.start:   the start index of the searched text in the string buffer
    * 		pos.end:     the end index of the searched text in the string buffer
    * 		pos.len:     the length of the searched text in the string buffer
    * 		pos.line:    the line of the searched text in the string buffer
    */
   let pos = file.pos;

   // Cash values
   const data = file.content;
   let i = file.pos.start;

   // Find first delim
   while (data[i++] != delim[0]) {
      if (data[i] == '\n')
         file.pos.line++;
      if (i >= file.size) {
         console.error("Delimiter does not exist. Returning");
         return -1;
      }
   }
   pos.start = i;

   // Store to "charval" whatever lies in between the two delimiter characters
   let charval = '';
   let k = 0;
   while (data[i] != delim[1]) {
      charval += data[i];
      pos.len++;
      i++; k++;
      if (i >= file.size) {
         console.error("No value found. Reached the end of file.");
      }
   }
   pos.end = i - 1;

   // Store the "charval's" position (in the string buffer) to file.pos object
   file.pos.start = pos.start;
   file.pos.end = pos.end;
   file.pos.len = pos.len;

   // Convert String to Number
   let val = 0;
   for (i = 0; i < k; i++)
      val = val * 10 + (charval[i] - '0');

   return val;
}
/** */
function Find_field_by_name(file, word, pos) {

   const wordpos = { start: -1, end: -1, len: 0, line: -1 };
   const wordlen = word.length;
   
   let line = pos.line;
   let i = pos.start;
   
   const filelen = file.length;
   while (i <= filelen) {

      let k = 0;
      if (file[i] == '\n') line++;

      if (file[i] == word[k]) {

         wordpos.start = i;
         wordpos.len = 0;
         i++; k++;

         while (file[i] == word[k]) {

            wordpos.len++;
            if (k >= wordlen - 1) {
               wordpos.line = line;
               wordpos.len++;
               wordpos.end = i + 1;
               return wordpos;
            }
            i++; k++;
         }
      }
      i++;
   }
   return wordpos;
}