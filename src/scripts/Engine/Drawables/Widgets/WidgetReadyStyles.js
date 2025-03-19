"use strict";

import { GREY, WHITE } from "../Material/Base/Colors";

// inspection of correct widget properties passed as parameters to widget creation function
// OR widget configuration
export function Inspect_and_correct_slider_properties(user_properties) {

   /**
    * Rect mesh properties
    * {mesh_bufferidx, ROOT_WIDGET_FLAGS, _pos, dim, col, hover_margin, name, is_debug_mesh}
    * 
    * Text mesh properties
    * { pos: pos, font_size: font_size, col: col, text: text, font: font, texture_id: texture_id, variant_idx:variant_idx, sub_texture_id: sub_texture_id, is_debug_mesh: is_debug_mesh },
    */

   const rect_mesh_properties = {
      mesh_bufferidx, 
      ROOT_WIDGET_FLAGS, 
      pos: (existing_properties.pos) ? existing_properties.pos : [0,0,0], 
      dim:  (existing_properties.name) ? existing_properties.name : undefined, 
      col: (existing_properties.col) ? existing_properties.col : WHITE, 
      hover_margin:  (existing_properties.name) ? existing_properties.name : '', 
      name: (existing_properties.name) ? existing_properties.name : 'Slider', 
      is_debug_mesh: (existing_properties.is_debug_mesh) ? existing_properties.is_debug_mesh : undefined, 
   };
   const text_mesh_properties = {
      pos: (existing_properties.pos) ? existing_properties.pos : [0,0,0], 
      font_size: (existing_properties.font_size) ? existing_properties.font_size : 10, 
      col: (existing_properties.col) ? existing_properties.col : WHITE, 
      text: (existing_properties.text) ? existing_properties.text : '', 
      texture_id: (existing_properties.texture_id) ? existing_properties.texture_id : TEXTURES.CONSOLA_VARIANT_FONT, 
      variant_idx:(existing_properties.variant_idx) ? existing_properties.variant_idx : ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S3_5, 
      sub_texture_id: (existing_properties.sub_texture_id) ? existing_properties.sub_texture_id : undefined, 
      is_debug_mesh: (existing_properties.is_debug_mesh) ? existing_properties.is_debug_mesh : undefined, 
   };

   return { rect_mesh_properties:rect_mesh_properties, text_mesh_properties:text_mesh_properties }
}
export function Style_slider_default(existing_properties) {

   /**
    * Rect mesh properties
    * {mesh_bufferidx, ROOT_WIDGET_FLAGS, _pos, dim, col, hover_margin, name, is_debug_mesh}
    * 
    * Text mesh properties
    * { pos: pos, font_size: font_size, col: col, text: text, font: font, texture_id: texture_id, variant_idx:variant_idx, sub_texture_id: sub_texture_id, is_debug_mesh: is_debug_mesh },
    */

   const rect_mesh_properties = {
      mesh_bufferidx, 
      ROOT_WIDGET_FLAGS, 
      pos: (existing_properties.pos) ? existing_properties.pos : [0,0,0], 
      dim:  (existing_properties.name) ? existing_properties.name : undefined, 
      col: (existing_properties.col) ? existing_properties.col : WHITE, 
      hover_margin:  (existing_properties.name) ? existing_properties.name : '', 
      name: (existing_properties.name) ? existing_properties.name : 'Slider', 
      is_debug_mesh: (existing_properties.is_debug_mesh) ? existing_properties.is_debug_mesh : undefined, 
   };
   const text_mesh_properties = {
      pos: (existing_properties.pos) ? existing_properties.pos : [0,0,0], 
      font_size: (existing_properties.font_size) ? existing_properties.font_size : 10, 
      col: (existing_properties.col) ? existing_properties.col : WHITE, 
      text: (existing_properties.text) ? existing_properties.text : '', 
      texture_id: (existing_properties.texture_id) ? existing_properties.texture_id : TEXTURES.CONSOLA_VARIANT_FONT, 
      variant_idx:(existing_properties.variant_idx) ? existing_properties.variant_idx : ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S3_5, 
      sub_texture_id: (existing_properties.sub_texture_id) ? existing_properties.sub_texture_id : undefined, 
      is_debug_mesh: (existing_properties.is_debug_mesh) ? existing_properties.is_debug_mesh : undefined, 
   };

   return { rect_mesh_properties:rect_mesh_properties, text_mesh_properties:text_mesh_properties }
}