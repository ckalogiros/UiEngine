"use strict"

import { Metrics_loader_load_chlumsky_msdf_metrics, Metrics_loader_load_custom_metrics } from "./MetricsLoader";





// The maximum number of characters for ASCII
// const ASCII_NUM_CHARACTERS = '~'.charCodeAt(0) - (' '.charCodeAt(0));
const TEXTURE_ATLASES_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT; 

var _metrics_buffer = []; // Indexed via metrics_idx (SEE Material.js).
var _uvmap_buffer = [];  // Indexed via metrics_idx (SEE Material.js).
// var _uvmap_active_maps_buffer = new Int8Array(TEXTURE_ATLASES_MAX_COUNT); // Indexed via texture_file_id (SEE: TEXTURES global object)


/** */
export function Uv_texture_reset_buffers() {
   _metrics_buffer = [];
   _uvmap_buffer = [];
}

export function Uv_texture_init_buffers() {
   // Initialize active fonts buffer
   for(let i=0; i<TEXTURE_ATLASES_MAX_COUNT; i++) {
      _metrics_buffer[i] = null;
   }
}

/************************************************************************************************************************************************/
// Getters
export function Uv_get_uv_coords(metrics_idx, sub_tex_idx) {
   
   return _uvmap_buffer[metrics_idx][sub_tex_idx];
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
export function Uv_metrics_create_uvmap(texture_file_id, sub_tex_idx, metrics_file) {

   // Create new font metrics and uvmap
   const metrics_idx = _uvmap_buffer.length;
   // _uvmap_active_maps_buffer[texture_file_id] = metrics_idx; // Update the 'active' fonts
   
   
   if(FONT_IS_MSDF(texture_file_id)) {
      if(!metrics_file)
         console.log(metrics_file)
      const msdf_metrics = Metrics_loader_load_chlumsky_msdf_metrics(metrics_file, sub_tex_idx);
      _metrics_buffer[metrics_idx] = msdf_metrics;
      _uvmap_buffer[metrics_idx] =  msdf_metrics.uvmap
   }
   else {
      const ret = Metrics_loader_load_custom_metrics(metrics_file);
      _metrics_buffer[metrics_idx] = ret.metrics
      _uvmap_buffer[metrics_idx] = ret.uv_map;
   }
   
   return metrics_idx;
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
   console.log(
      '----------------------------------- Fonts -----------------------------------', 
      '\nMetrics', _metrics_buffer,
      '\nUvMaps', _uvmap_buffer,
   );
}