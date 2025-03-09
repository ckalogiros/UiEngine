"use strict"

import { Metrics_loader_load_chlumsky_msdf_metrics, Metrics_loader_load_custom_metrics } from "./MetricsLoader";





// The maximum number of characters for ASCII
const ASCII_NUM_CHARACTERS = '~'.charCodeAt(0) - (' '.charCodeAt(0));
const TEXTURE_ATLASES_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT; 

var _metrics_buffer = []; // Indexed via metrics_idx (SEE Material.js).
var _uvmap_buffer = [];  // Indexed via metrics_idx (SEE Material.js).
var _uvmap_active_maps_buffer = new Int8Array(TEXTURE_ATLASES_MAX_COUNT); // Indexed via texture_file_id (SEE: TEXTURES global object)




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





// export function Uv_create_uvmap(texture_file_id){

//    Uv_get_metrics_by_texid(texture_file_id); 
// }



export function Uv_create_storage_buffer_font() {


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

   // New uvMap for every font
   const uvMap = [];
   
   // New font metrics for every character
   for (let j = 0; j <= ASCII_NUM_CHARACTERS; j++) {
      
      metrics.sub_tex[j] = {
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



// export function Texture_is_texture_loaded(texture_file_id) {
//    if (_uvmap_active_maps_buffer[texture_file_id] === INT_NULL) return false;
//    return true;
// }



/** */
export function Uv_retrieve_uvmap_idx(texture_file_id) {
   return _uvmap_active_maps_buffer[texture_file_id];
}



/**
 * UV Coordinates Getters
 */
export function Uv_get_uv_coords(metrics_idx, sub_tex_idx) {
   
   return _uvmap_buffer[metrics_idx][sub_tex_idx];
}



/** */
export function FontGetFontDimRatio(metrics_idx) {
   return _metrics_buffer[metrics_idx].ratio;
}



/** */
export function Uv_metrics_get_face_advancex(metrics_idx) { return _metrics_buffer[metrics_idx].advancex; }
/** */
export function Uv_metrics_get_texture_width(metrics_idx) { return _metrics_buffer[metrics_idx].texWidth; }
/** */
export function Uv_metrics_get_texture_height(metrics_idx) { return _metrics_buffer[metrics_idx].texHeight; }
/** */
export function Uv_metrics_get_char_width(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].sub_tex[sub_tex_idx].width; }
/** */
export function Uv_metrics_get_char_height(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].sub_tex[sub_tex_idx].row_height; }
/** */
export function Uv_metrics_get_row_height(metrics_idx) { return _metrics_buffer[metrics_idx].row_height; }
/** */
export function Uv_metrics_get_interpolated_x(metrics_idx) { return 1.0 / _metrics_buffer[metrics_idx].texWidth; } // Transform to 0-1 coords 

/** */
export function Uv_metrics_calculate_width_from_text(str, metrics_idx){

   let width = 0;
   const len = str.length;
   for(let i=0; i<len; i++){

      width += Uv_metrics_get_char_width(metrics_idx, str[i]);
   }

   return width;
}
/** */
export function Uv_load_uvs(texture_file_id, metrics_file) {

   // Create new font metrics and uvmap
   const metrics_idx = _uvmap_buffer.length;
   _uvmap_active_maps_buffer[texture_file_id] = metrics_idx; // Update the 'active' fonts
   
   
   if(FONT_IS_MSDF(texture_file_id)) {
      if(!metrics_file)
         console.log(metrics_file)
      const msdf_metrics = Metrics_loader_load_chlumsky_msdf_metrics(metrics_file);
      _metrics_buffer[metrics_idx] = msdf_metrics;
      _uvmap_buffer[metrics_idx] =  msdf_metrics.uvmap
   }
   else {
      // Create new font metrics and uvmap
      const ret = Uv_create_storage_buffer_font();
      _metrics_buffer[metrics_idx] = ret.metrics
      _uvmap_buffer[metrics_idx] = ret.uvMap;
      Metrics_loader_load_custom_metrics(ret.metrics, metrics_file);
      Create_uv_map(metrics_idx);
      
   }
   
   return metrics_idx;
}
/** */
function Create_uv_map(metrics_idx) {

   const metrics = _metrics_buffer[metrics_idx]; 
   
   const uvmap = _uvmap_buffer[metrics_idx];

   let transormedU = 1.0 / metrics.texWidth;	// Transform to 0-1 coords
   let transormedV = 1.0 / metrics.texHeight;	// Transform to 0-1 coords

   const U1 = 0, U2 = 1, V1 = 2, V2 = 3;
   for (let j = 0; j < metrics.size; j++) {
      
      const uv = metrics.sub_tex[j]; // Get a characters pixel position in the font texture.
      
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
export function Msdf_Uv_get_char_uv_coords(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].uvmap[sub_tex_idx]; }
export function Msdf_Uv_get_char_plane_bounds(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].plane_bounds[sub_tex_idx]; }
// export function Msdf_Uv_get_char_atlas_bounds(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].atlas_bounds[sub_tex_idx]; }
// export function Msdf_Uv_get_atlas_texture_metrics(metrics_idx) { return _metrics_buffer[metrics_idx].texture; }
export function Msdf_Uv_get_font_line_height(metrics_idx) { return _metrics_buffer[metrics_idx].texture.line_height; }
export function Msdf_Uv_get_font_advancex(metrics_idx) { return _metrics_buffer[metrics_idx].texture.advance; }
export function Msdf_Uv_get_font_base_line(metrics_idx) { return _metrics_buffer[metrics_idx].texture.base_line; }




/**
   plane_bounds[i]:
      left:    glyphs[i].planeBounds.left,
      right:   glyphs[i].planeBounds.right,
      top:     glyphs[i].planeBounds.top,
      bottom:  glyphs[i].planeBounds.bottom,
      width:   glyphs[i].planeBounds.right-glyphs[i].planeBounds.left,
      height:  glyphs[i].planeBounds.bottom-glyphs[i].planeBounds.top,
*/
// export function Msdf_ont_get_char_plane_bounds_width(metrics_idx, sub_tex_idx) { 
//    return _metrics_buffer[metrics_idx].plane_bounds[sub_tex_idx].width; 
// }
// export function Msdf_ont_get_char_plane_bounds_height(metrics_idx, sub_tex_idx) { 
//    return _metrics_buffer[metrics_idx].plane_bounds[sub_tex_idx].height; 
// }
// export function Msdf_ont_get_char_plane_bounds_left(metrics_idx, sub_tex_idx) { 
//    return _metrics_buffer[metrics_idx].plane_bounds[sub_tex_idx].left; 
// }
// export function Msdf_ont_get_char_plane_bounds_right(metrics_idx, sub_tex_idx) { 
//    return _metrics_buffer[metrics_idx].plane_bounds[sub_tex_idx].right; 
// }
// export function Msdf_ont_get_char_plane_bounds_top(metrics_idx, sub_tex_idx) { 
//    return _metrics_buffer[metrics_idx].plane_bounds[sub_tex_idx].top; 
// }
// export function Msdf_ont_get_char_plane_bounds_bottom(metrics_idx, sub_tex_idx) { 
//    return _metrics_buffer[metrics_idx].plane_bounds[sub_tex_idx].bottom; 
// }

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
// export function Msdf_ont_get_char_atlas_bounds_width(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].atlas_bounds[sub_tex_idx].width; }
// export function Msdf_ont_get_char_atlas_bounds_height(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].atlas_bounds[sub_tex_idx].height; }
// export function Msdf_ont_get_char_atlas_bounds_left(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].atlas_bounds[sub_tex_idx].left; }
// export function Msdf_ont_get_char_atlas_bounds_right(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].atlas_bounds[sub_tex_idx].right; }
// export function Msdf_ont_get_char_atlas_bounds_top(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].atlas_bounds[sub_tex_idx].top; }
// export function Msdf_ont_get_char_atlas_bounds_bottom(metrics_idx, sub_tex_idx) { return _metrics_buffer[metrics_idx].atlas_bounds[sub_tex_idx].bottom; }
















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