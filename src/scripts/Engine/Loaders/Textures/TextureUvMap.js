"use strict"

import { Metrics_loader_load_chlumsky_msdf_metrics, Metrics_loader_load_custom_metrics } from "./MetricsLoader";




// POTENTIAL_BUG: 
// The font texture buffer is build specificaly for fonts, but it gets the font textures from the application's texture buffer.
// So the indexing is not guarantee to be 1to1 (texture buffer-font buffer).
// It will work only if the font textures in the texture buffer preceding all the regular textures in the texture buffer



// The maximum number of characters for ASCII
const ASCII_NUM_CHARACTERS = '~'.charCodeAt(0) - (' '.charCodeAt(0));
const TEXTURE_ATLASES_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT; 

var _metrics_buffer = []; // Indexed via fontidx (SEE Material.js).
var _uvmap_buffer = [];  // Indexed via fontidx (SEE Material.js).
var _uvmap_active_maps_buffer = new Int8Array(TEXTURE_ATLASES_MAX_COUNT); // Indexed via textureid (SEE: TEXTURES global object)




export function Uv_texture_reset_buffers() {
   _metrics_buffer = [];
   _uvmap_buffer = [];
   _uvmap_active_maps_buffer = new Int8Array(TEXTURE_ATLASES_MAX_COUNT); 
}

export function Uv_texture_init_buffers() {
   // Initialize active fonts buffer
   for(let i=0; i<TEXTURE_ATLASES_MAX_COUNT; i++) {
      _uvmap_active_maps_buffer[i] = INT_NULL;
   }
}





export function Uv_create_uvmap(texture_id){

   Uv_get_metrics_by_texid(texture_id); 
}



export function Uv_create_storage_buffer_font() {


   const metrics = {
      ch: [],
      size: 0,
      texWidth: 0,
      texHeight: 0,
      row_height: 0,
      advancex: 0, // Start (in pixels) of curr character unti the start of next character(in the texture)
      padding: 0,
      isMonoSpace: 0, // In non monospace fonts, the advancex variable is different from char to char (compare to monospace fonts)
      ratio: 0,
   };

   // New uvMap for every font
   const uvMap = [];
   
   // New font metrics for every character
   for (let j = 0; j <= ASCII_NUM_CHARACTERS; j++) {
      
      metrics.ch[j] = {
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
      // New uv coordinates for every character
      uvMap[j] = [0,0,0,0];
   }


   return {
      metrics:metrics,
      uvMap:uvMap,
   };
}



// export function Texture_is_texture_loaded(textureid) {
//    if (_uvmap_active_maps_buffer[textureid] === INT_NULL) return false;
//    return true;
// }



export function Uv_retrieve_uvidx(textureid) {
   return _uvmap_active_maps_buffer[textureid];
}



/**
 * UV Coordinates Getters
 */
export function Uv_get_uv_coords(sub_tex_idx, ch) {
   
   return _uvmap_buffer[sub_tex_idx][ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET];
}



export function FontGetFontDimRatio(sub_tex_idx) {
   return _metrics_buffer[sub_tex_idx].ratio;
}



export function Uv_metrics_get_face_advancex(sub_tex_idx) { return _metrics_buffer[sub_tex_idx].advancex; }
export function Uv_metrics_get_texture_width(sub_tex_idx) { return _metrics_buffer[sub_tex_idx].texWidth; }
export function Uv_metrics_get_texture_height(sub_tex_idx) { return _metrics_buffer[sub_tex_idx].texHeight; }
export function Uv_metrics_get_char_width(sub_tex_idx, ch) { return _metrics_buffer[sub_tex_idx].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; }
export function Uv_metrics_get_char_height(sub_tex_idx, ch) { return _metrics_buffer[sub_tex_idx].ch[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].row_height; }
export function Uv_metrics_get_row_height(sub_tex_idx) { return _metrics_buffer[sub_tex_idx].row_height; }
export function Uv_metrics_get_interpolated_x(sub_tex_idx) { return 1.0 / _metrics_buffer[sub_tex_idx].texWidth; } // Transform to 0-1 coords 

export function Uv_metrics_calculate_width_from_text(str, sub_tex_idx){

   let width = 0;
   const len = str.length;
   for(let i=0; i<len; i++){

      width += Uv_metrics_get_char_width(sub_tex_idx, str[i]);
   }

   return width;
}

// HERE: The UV_MAP buffer should be here and not in the metrics.js file. Also handle the uv_maps here

export function Uv_load_uvs(textureid, metrics_file) {

   // Create new font metrics and uvmap
   const sub_tex_idx = _uvmap_buffer.length;
   _uvmap_active_maps_buffer[textureid] = sub_tex_idx; // Update the 'active' fonts
   
   
   if(FONT_IS_MSDF(textureid)) {
      
      const msdf_metrics = Metrics_loader_load_chlumsky_msdf_metrics(textureid, metrics_file);
      _metrics_buffer[sub_tex_idx] = msdf_metrics;
      _uvmap_buffer[sub_tex_idx] =  msdf_metrics.uvmap
      
      // console.log(
      //    '==========================================================================',
      //    'Load Font:', TEXTURE_PATHS[textureid].imgName,
      //    'Metrics:', _metrics_buffer[sub_tex_idx],
      //    'Active Fonts idxs:', _uvmap_active_maps_buffer,
      // )
   }
   else {
      
      // console.log(
      //    '==========================================================================',
      //    'Load Font:', TEXTURE_PATHS[textureid].imgName,
      //    'Metrics:', _metrics_buffer[sub_tex_idx],
      //    'Active Fonts idxs:', _uvmap_active_maps_buffer,
      // )

      // Create new font metrics and uvmap
      const ret = Uv_create_storage_buffer_font();
      _metrics_buffer[sub_tex_idx] = ret.metrics
      _uvmap_buffer[sub_tex_idx] = ret.uvMap;
      Metrics_loader_load_custom_metrics(sub_tex_idx, textureid, metrics_file);
      Create_uv_map(sub_tex_idx);
      
   }
   
   return sub_tex_idx;
}



// // Read the text file using 'filePos' as guide of word-line
// const filePos = { start: 0, end: 0, len: 0, line: 0 };
// function Metrics_loader_load_custom_metrics(sub_tex_idx, textureid) {

//    const metrics = _metrics_buffer[sub_tex_idx];

//    const file = { content: '', name: '', pos: filePos, size: 0, };
//    file.content = TEXTURE_PATHS[textureid].metrics; 
//    file.size = file.content.length;


//    let size = 0;
//    // Get how many characters the font texture has 
//    // by retrieving the line: "NumCharacters		:	[94]"
//    file.pos = Find_field_by_name(file.content, "NumCharacters", file.pos);
//    if (file.pos.len) size = Find_next_field(file, "[]");
//    size++; // +1 for the ' ' space char

//    metrics.size = size;
   
   
//    file.pos = Find_field_by_name(file.content, "Image Width", file.pos);
//    if (file.pos.len) {
//       metrics.texWidth = Find_next_field(file, "[]");
//       // The next val inside [] is the height 
//       metrics.texHeight = Find_next_field(file, "[]");
//       metrics.row_height = Find_next_field(file, "[]");
//    }

//    // In monospace {Only} the advance x is the same for every character
//    metrics.advancex = Find_next_field(file, "[]");
//    // Space between the characters in the texture font
//    metrics.padding = Find_next_field(file, "[]");

//    file.pos = Find_field_by_name(file.content, "Mono Space", file.pos);
//    metrics.isMonoSpace = Find_next_field(file, "[]");
//    metrics.ratio = metrics.texHeight / metrics.advancex;

//    let ii = 0;

//    /**
//     * // TODO: Set the start character=10->\n,
//     * leave emty array elements to the ' '=32
//     */
//    // For char space character ' '
//    metrics.ch[ii].left = 0;
//    metrics.ch[ii].right = 0;
//    metrics.ch[ii].top = 0;
//    metrics.ch[ii].bottom = 0;
//    metrics.ch[ii].width = metrics.advancex;
//    metrics.ch[ii].height = 0;
//    metrics.ch[ii].row_num = 0;
//    if (!metrics.isMonoSpace) {
//       metrics.ch[ii].advancex = metrics.advancex;
//       metrics.ch[ii].ratio = metrics.texHeight / metrics.ch[0].advancex; // width to height ratio(and not the other way arround)
//    }

//    ii++;

//    // Reset the file's pos
//    file.pos.start = 0;

//    // Load all property values to character map for each character
//    for (let i = ii; i < size; i++) {
//       file.pos = Find_field_by_name(file.content, "Face Left", file.pos);
//       if (file.pos.len)
//          metrics.ch[i].left = Find_next_field(file, "[]");

//       // Because the file.pos retains the start position
//       // we just call Find_next_field() to  get the next val
//       metrics.ch[i].right 			= Find_next_field(file, "[]");
//       metrics.ch[i].top 			= Find_next_field(file, "[]");
//       metrics.ch[i].bottom 		= Find_next_field(file, "[]");
//       metrics.ch[i].width 			= Find_next_field(file, "[]");
//       metrics.ch[i].height 		= Find_next_field(file, "[]");
//       metrics.ch[i].row_num 		= Find_next_field(file, "[]");
//       metrics.ch[i].bearingleft 	= Find_next_field(file, "[]");
//       metrics.ch[i].bearingtop 	= Find_next_field(file, "[]");
//       if (!metrics.isMonoSpace) {
//          metrics.ch[i].advancex = Find_next_field(file, "[]");
//          metrics.ch[i].ratio = metrics.ch[i].height / metrics.ch[i].width; // width to height ratio(and not the other way arround)
//       }
//    }

//    if(DEBUG.UVS){ console.log('metrics', metrics); }
//    return sub_tex_idx;
// }



function Create_uv_map(sub_tex_idx, uvMap) {

   const metrics = _metrics_buffer[sub_tex_idx]; 
   
   const uvmap = _uvmap_buffer[sub_tex_idx];

   let transormedU = 1.0 / metrics.texWidth;	// Transform to 0-1 coords
   let transormedV = 1.0 / metrics.texHeight;	// Transform to 0-1 coords

   const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
   for (let j = 0; j < metrics.size; j++) {
      
      const uv = metrics.ch[j]; // Get a characters pixel position in the font texture.
      
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



/*
   Finds text between delimiters, in a string buffer.
*/
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




  



















/**
   texture:
      type        : obj.atlas.type,
      width       : texture_width, 
      height      : texture_height, 
      ascender    : obj.metrics.ascender,
      descender   : obj.metrics.descender,
      advance     : advance, // For monospace fonts
      line_height : obj.metrics.lineHeight,
      base_line   : base_line,
*/
export function Msdf_Uv_get_char_uv_coords(fontIdx, ch) { return _metrics_buffer[fontIdx].uvmap[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET]; }
export function Msdf_Uv_get_char_plane_bounds(fontIdx, ch) { return _metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET]; }
export function Msdf_Uv_get_char_atlas_bounds(fontIdx, ch) { return _metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET]; }
export function Msdf_Uv_get_atlas_texture_metrics(fontIdx) { return _metrics_buffer[fontIdx].texture; }
export function Msdf_Uv_get_font_line_height(fontIdx) { return _metrics_buffer[fontIdx].texture.line_height; }
export function Msdf_Uv_get_font_advancex(fontIdx) { return _metrics_buffer[fontIdx].texture.advance; }
export function Msdf_Uv_get_font_base_line(fontIdx) { return _metrics_buffer[fontIdx].texture.base_line; }




/**
   plane_bounds[i]:
      left:    glyphs[i].planeBounds.left,
      right:   glyphs[i].planeBounds.right,
      top:     glyphs[i].planeBounds.top,
      bottom:  glyphs[i].planeBounds.bottom,
      width:   glyphs[i].planeBounds.right-glyphs[i].planeBounds.left,
      height:  glyphs[i].planeBounds.bottom-glyphs[i].planeBounds.top,
*/
export function Msdf_ont_get_char_plane_bounds_width(fontIdx, ch) { 
   return _metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; 
}
export function Msdf_ont_get_char_plane_bounds_height(fontIdx, ch) { 
   return _metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].height; 
}
export function Msdf_ont_get_char_plane_bounds_left(fontIdx, ch) { 
   return _metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].left; 
}
export function Msdf_ont_get_char_plane_bounds_right(fontIdx, ch) { 
   return _metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].right; 
}
export function Msdf_ont_get_char_plane_bounds_top(fontIdx, ch) { 
   return _metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].top; 
}
export function Msdf_ont_get_char_plane_bounds_bottom(fontIdx, ch) { 
   return _metrics_buffer[fontIdx].plane_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].bottom; 
}

/**
   atlas_bounds[i]:
      left:    glyphs[i].planeBounds.left,
      right:   glyphs[i].planeBounds.right,
      top:     glyphs[i].planeBounds.top,
      bottom:  glyphs[i].planeBounds.bottom,
      width:   glyphs[i].planeBounds.right-glyphs[i].planeBounds.left,
      height:  glyphs[i].planeBounds.bottom-glyphs[i].planeBounds.top,
      yoffset: -((ascender-glyphs[i].planeBounds.top)+(descender-glyphs[i].planeBounds.bottom)) * scale,
   */
export function Msdf_ont_get_char_atlas_bounds_width(fontIdx, ch) { return _metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].width; }
export function Msdf_ont_get_char_atlas_bounds_height(fontIdx, ch) { return _metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].height; }
export function Msdf_ont_get_char_atlas_bounds_left(fontIdx, ch) { return _metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].left; }
export function Msdf_ont_get_char_atlas_bounds_right(fontIdx, ch) { return _metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].right; }
export function Msdf_ont_get_char_atlas_bounds_top(fontIdx, ch) { return _metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].top; }
export function Msdf_ont_get_char_atlas_bounds_bottom(fontIdx, ch) { return _metrics_buffer[fontIdx].atlas_bounds[ch.charCodeAt(0) - CHAR_ARRAY_START_OFFSET].bottom; }
















/**Debug-Print */
export function Uvmaps_print() {
   /**
      const TEXTURE_ATLASES_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT; 
      const _metrics_buffer = [];
      const _uvmap_buffer = [];
      const _uvmap_active_maps_buffer = new Int8Array(TEXTURE_ATLASES_MAX_COUNT); 
   */
   console.log(
      '----------------------------------- Fonts -----------------------------------', 
      '\nMetrics', _metrics_buffer,
      '\nActive Font idxs', _uvmap_active_maps_buffer,
      '\nUvMaps', _uvmap_buffer,
   );
}