"use strict";

import { Mesh_listener_create } from "../../Operations/MeshPropertiesFunctions.js";
import { BLUEL, GREY, WHITE, YELLOWL } from "../../Material/Colors.js";




/**
 * 
 * @param {Int} enable_sdf_rect Value for the rounding of the corners in pixels
 * 
 * 
 * enable_attr: flag
 * pass_attr: flag
 * 
 * 
 */
export function Widget_gfx_ready_enable({
   mesh = null,
   enable_sdf_rect,
   enable_unif_wpos = true,
   enable_unif_blend = true,
   enable_unif_scale = false,
   enable_unif_time = false,
   enable_src_color_in_main = true,
   enable_attr_dim = false,
   enable_pass_vpos = false,
   enable_pass_wpos = false,
   enable_col_per_vertex,
   enable_attr_angle,
   enable_blend_mode,
   listener={ type:0x0, Clbk:null, params:null },
   scroller=null,
}) {

   if (enable_unif_wpos) mesh.EnableGfxUniforms({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   if (enable_unif_blend) mesh.EnableGfxUniforms({ unif: SID.UNIF.BLEND_MODE }, 'u_blend_mode', UNIF_TYPE.INT, UNIFORM.IN_FS);
   if (enable_unif_scale) mesh.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   if (enable_unif_time) mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

   if (enable_attr_dim) { mesh.GfxEnableAttr(SID.ATTR.DIM2); mesh.GfxPassAttr(SID.ATTR.DIM2); }
   if (enable_pass_vpos) { mesh.GfxPassAttr(SID.ATTR.VPOS2); }
   if (enable_pass_wpos) { mesh.GfxPassAttr(SID.ATTR.WPOS3); }

   if (enable_src_color_in_main) mesh.sid.shad |= SID.SHAD.ENABLE_SRC_COLOR_IN_FRAG_MAIN;


   if (enable_sdf_rect !== undefined) {

      if (Array.isArray(enable_sdf_rect)) {
         mesh.GfxEnableAttr(SID.ATTR.R_CORNERS | SID.ATTR.DIM2, { rcorners: enable_sdf_rect[0] });
      }
      else mesh.GfxEnableAttr(SID.ATTR.R_CORNERS | SID.ATTR.DIM2, { rcorners: enable_sdf_rect });
      mesh.GfxPassAttr(SID.ATTR.R_CORNERS | SID.ATTR.DIM2 | SID.ATTR.VPOS2);

      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   }

   if (enable_col_per_vertex !== undefined) {
      // mesh.GfxEnableAttr(SID.ATTR.COL4_PER_VERTEX, enable_col_per_vertex);
      mesh.GfxEnableAttr(SID.ATTR.COL4_PER_VERTEX,);
   }

   if (enable_attr_angle !== undefined) {
      mesh.GfxEnableAttr(SID.ATTR.ANGLE, enable_attr_angle);
      mesh.GfxPassAttr(SID.ATTR.ANGLE);
   }

   if (enable_blend_mode !== undefined) {
      mesh.GfxEnableBlend(enable_blend_mode);
   }

   if (listener.type !== 0x0) {
      if(listener.type &  LISTEN_EVENT_TYPES.HOVER) Mesh_listener_create(mesh, LISTEN_EVENT_TYPES.HOVER, listener.Clbk, listener.params);
      if(listener.type &  LISTEN_EVENT_TYPES.MOVE) Mesh_listener_create(mesh, LISTEN_EVENT_TYPES.MOVE, listener.Clbk, listener.params);
      if(listener.type &  LISTEN_EVENT_TYPES.CLICK_UP) Mesh_listener_create(mesh, LISTEN_EVENT_TYPES.CLICK_UP, listener.Clbk, listener.params);
   }

   if (scroller) {
      const params = {
         width:(scroller.width!==undefined) ? scroller.width : 10,
         max_height:(scroller.max_height!==undefined) ? scroller.max_height : 80,
      };
      mesh.EnableScroller(params);

   }



}




/**
 * 
 * @param {*} user_properties:{
 * Slider Mesh      
 *    @param {Float Array} outer_pad:[2] 
 *    @param {} name:'' 
 *    @param {} pos @type:[3] float
 *    @param {} col:[4] FloatArray32
 *    @param {} text_pad:[2] float
 *    @param {} font_size: float
 *       
 * Bar Mesh
 *    @param bar_col:[4]
 * 
 * Handle Mesh
 *    @param handle_col:[4]
 * 
 * Text Meshes
 * name_text
 *    @param value_text_col
 *    @param text
 *    @param value_text_font_size OPTIONAL
 *    @param value_text_texture_id OPTIONAL
 *    @param value_text_sub_texture_id OPTIONAL
 *    @param value_text_variant_idx OPTIONAL
 * 
 * value_text
 *    @param text:''
 *    @param name_text_col
 *    @param name_text_font_size OPTIONAL
 *    @param name_text_texture_id OPTIONAL
 *    @param name_text_sub_texture_id OPTIONAL
 *    @param name_text_variant_idx OPTIONAL
 * }
 *     
 * @returns 
 */
export function Style_rect_default_properties(user_properties) {
   const properties = {
      is_root: user_properties.is_root,
      
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 
      dim: user_properties.dim !== undefined ? user_properties.dim : [0,0],
      col: user_properties.col,
      pad: user_properties.pad !== undefined ? user_properties.pad : [0,0],
      
      num_faces: user_properties.num_faces !== undefined ? user_properties.num_faces : 1,
      name: user_properties.name !== undefined ? user_properties.name : 'Rect Mesh UNAMED',
      // rcorners: user_properties.bar_rcorners !== undefined ? user_properties.bar_rcorners : 4,

      texture_id:user_properties.texture_id, 
      sub_texture_id: user_properties.sub_texture_id,
      variant_idx: user_properties.variant_idx,

      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF,

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };


  return properties;

}
/** */
export function Style_text_default_properties(user_properties) {

   const properties = {
      is_root:user_properties.is_root,
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 
      align:user_properties.align !== undefined ? user_properties.align : TEXT_ALIGN.HORIZONTAL, 
      
      text:user_properties.text !== undefined ? user_properties.text : 'UUnamed Multi Text', 
      font_size:user_properties.font_size !== undefined ? user_properties.font_size : 10, 
      col:user_properties.col !== undefined ? user_properties.col : WHITE, 
      pad:user_properties.pad !== undefined ? user_properties.pad : [0,0], 
      texture_id:user_properties.texture_id !== undefined ? user_properties.texture_id : TEXTURES.MTSDF_CONSOLAS_1024, 
      variant_idx:user_properties.variant_idx,

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };


  return properties;

}
/** */
export function Style_multi_text_default_properties(user_properties) {

   const properties = {
      is_root:user_properties.is_root,
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 
      align:user_properties.align !== undefined ? user_properties.align : TEXT_ALIGN.HORIZONTAL, 
      
      text:user_properties.text !== undefined ? user_properties.text : 'Unamed Multi Text', 
      font_size:user_properties.font_size !== undefined ? user_properties.font_size : 10, 
      col:user_properties.col !== undefined ? user_properties.col : WHITE, 
      pad:user_properties.pad !== undefined ? user_properties.pad : [0,0], 
      texture_id:user_properties.texture_id !== undefined ? user_properties.texture_id : TEXTURES.MTSDF_CONSOLAS_1024, 
      variant_idx:user_properties.variant_idx,

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };


  return properties;

}
/** */
export function Style_slider_simple_default_properties(user_properties) {

   const properties = {
      is_root: user_properties.is_root,
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 

      dim: user_properties.dim,
      col: user_properties.col,
      hover_margin: user_properties.hover_margin !== undefined ? user_properties.hover_margin : [7, 7],
      name: user_properties.name !== undefined ? user_properties.name : 'Slider Simple UNAMED',
      num_faces: user_properties.num_faces !== undefined ? user_properties.num_faces : 1,
      rcorners: user_properties.bar_rcorners !== undefined ? user_properties.bar_rcorners : 4,
      pad: user_properties.pad !== undefined ? user_properties.pad : [0,0],
      
      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL,

      handle: {
         col: user_properties.handle_col !== undefined ? user_properties.handle_col : BLUEL[7],
         dim:user_properties.handle_dim !== undefined ? user_properties.handle_dim : [10, 10],
      },

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };


  return properties;

}
/** */
export function Style_slider_default_properties(user_properties) {

   /**
    * Widget_Slider_XX1 properties
    * constructor(ROOT_WIDGET_FLAGS, _pos, dim, col, hover_margin, name, is_debug_mesh) {

    * 
    * Rect mesh properties
    * {mesh_bufferidx, ROOT_WIDGET_FLAGS, _pos, dim, col, hover_margin, name, is_debug_mesh}
    * 
    * Text mesh properties
    * { pos: pos, font_size: font_size, col: col, text: text, font: font, texture_id: texture_id, variant_idx:variant_idx, sub_texture_id: sub_texture_id, is_debug_mesh: is_debug_mesh },
    */


   const properties = {
      is_root: user_properties.is_root,
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 

      dim: user_properties.dim,
      col: user_properties.col,
      hover_margin: user_properties.hover_margin !== undefined ? user_properties.hover_margin : [7, 7],
      outer_pad: user_properties.outer_pad !== undefined ? user_properties.outer_pad : 4,
      name: user_properties.name !== undefined ? user_properties.name : 'Slider UNAMED',
      pad: user_properties.pad !== undefined ? user_properties.pad : [0,0],
      // For image texture rendering. Also can be used to pass texture_id for the slider's text meshes, if the texture_id is a font texture 
      // set this to undefined and store the texture_id to the value_text/name_text fields to be consumed in the slider constructor
      texture_id: user_properties.texture_id <= TEXTURES.TEXTURE_FONTS_COUNT ? _ : user_properties.texture_id,
      // font_size: user_properties.font_size,
      variant_idx: user_properties.variant_idx,
      
      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL,

      bar: {
         // col:BLUEL[7],
         col: user_properties.bar_col !== undefined ? user_properties.bar_col : GREY[8],
         rcorners: user_properties.bar_rcorners !== undefined ? user_properties.bar_rcorners : 4,
      },
      handle: {
         // col:GREY[8],
         col: user_properties.handle_col !== undefined ? user_properties.handle_col : BLUEL[7],
         dim:user_properties.handle_dim !== undefined ? user_properties.handle_dim : [10, 10],
      },
      name_text: {
         // Text_Mesh properties: { pos: pos, font_size: font_size, col: col, text: text, font: font, texture_id: texture_id, variant_idx:variant_idx, sub_texture_id: sub_texture_id, is_debug_mesh: is_debug_mesh },

         col: user_properties.value_text_col !== undefined ? user_properties.value_text_col : WHITE,
         text: user_properties.name !== undefined ? user_properties.name : 'Slider UNAMED',
         font_size: user_properties.font_size !== undefined ? user_properties.font_size : 8,
         texture_id: user_properties.value_text_texture_id !== undefined ? user_properties.value_text_texture_id : user_properties.texture_id <= TEXTURES.TEXTURE_FONTS_COUNT ? user_properties.texture_id : TEXTURES.MTSDF_COMIC_1024,
         sub_texture_id: user_properties.value_text_sub_texture_id !== undefined ? user_properties.value_text_sub_texture_id : _,
         variant_idx: user_properties.value_text_variant_idx !== undefined ? user_properties.value_text_variant_idx : _,
      },
      value_text: {
         // Text_Mesh properties: { pos: pos, font_size: font_size, col: col, text: text, font: font, texture_id: texture_id, variant_idx:variant_idx, sub_texture_id: sub_texture_id, is_debug_mesh: is_debug_mesh },

         col: user_properties.value_text_col !== undefined ? user_properties.value_text_col : WHITE,
         font_size: user_properties.font_size !== undefined ? user_properties.font_size : 8,
         texture_id: user_properties.value_text_texture_id !== undefined ? user_properties.value_text_texture_id : user_properties.texture_id <= TEXTURES.TEXTURE_FONTS_COUNT ? user_properties.texture_id : TEXTURES.MTSDF_COMIC_1024,
         sub_texture_id: user_properties.value_text_sub_texture_id !== undefined ? user_properties.value_text_sub_texture_id : _,
         variant_idx: user_properties.value_text_variant_idx !== undefined ? user_properties.value_text_variant_idx : _,
      },

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,

   };
   

   // Avoid using image texture for the slider's text meshes
   // Case the slider has a texture image and the user didn't pass a texture_id via the 'value_text_texture_id' to render the slider's font texture
   if(user_properties.texture_id > TEXTURES.TEXTURE_FONTS_COUNT && user_properties.value_text_sub_texture_id === undefined) 
      alert('998155242315773. Must pass texture_id for the widget slider text')


  return properties;

}
/**
 * 
 * @param {*} user_properties:{
 *       pad:[2] float
 *       name:'' 
 *       pos:[3] float
 *       col:[4] FloatArray32
 *       text:''
 *       text_pad:[2] float
 *       font_size: float
 *    }
 *     
 * @returns 
 */
export function Style_label_default_properties(user_properties) {

   const style = { rcorners: 8, feather: 0, border: 0 };

   const properties = { // Button||Label class

      // is_root, text, Align, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh
      is_root:user_properties.is_root,
      
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 
 
      col:user_properties.col !== undefined ? user_properties.col : BLUEL[4],
      dim:_,
      
      align:(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), 
      pad: user_properties.pad !== undefined ? user_properties.pad : [0,0],
      style:style, 
      
      text:user_properties.text !== undefined ? user_properties.text : 'Label', 
      text_pad:user_properties.text_pad !== undefined ? user_properties.text_pad : [10, 6], 
      text_col: user_properties.text_col !== undefined ? user_properties.text_col : WHITE, 
      
      font_size:user_properties.font_size !== undefined ? user_properties.font_size : 8, 
      texture_id:user_properties.texture_id !== undefined ? user_properties.texture_id : TEXTURES.MTSDF_CONSOLAS_1024, 
      sub_texture_id: user_properties.sub_texture_id !== undefined ? user_properties.sub_texture_id : _,
      variant_idx: user_properties.variant_idx !== undefined ? user_properties.variant_idx : _,
      
      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL,
      
      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };

   return properties;
}
/** */
export function Style_button_default_properties(user_properties) {

   const style = { rcorners: 8, feather: 0, border: 0 };

   const properties = { // Button||Label class

      // is_root, text, Align, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh
      is_root:user_properties.is_root,
      
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 
 
      col: user_properties.col !== undefined ? user_properties.col : BLUEL[4],
      dim:_,
      text_col:user_properties.text_col !== undefined ? user_properties.text_col : WHITE, 

      pad: user_properties.pad !== undefined ? user_properties.pad : [0,0],
      align:(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), 
      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL,
      
      text:user_properties.text, 
      text_pad:user_properties.text_pad, 
      style:style, 
      
      font_size:user_properties.font_size !== undefined ? user_properties.font_size : 8, 
      texture_id:user_properties.texture_id !== undefined ? user_properties.texture_id : TEXTURES.MTSDF_CONSOLAS_1024, 
      sub_texture_id: user_properties.sub_texture_id !== undefined ? user_properties.sub_texture_id : _,
      variant_idx: user_properties.variant_idx !== undefined ? user_properties.variant_idx : _,
      
      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };

   return properties;
}
/** */
export function Style_switch_button_default_properties(user_properties) {

   const style = { rcorners: 8, feather: 0, border: 0 };

   const properties = { // Switch-Button class

      is_root:user_properties.is_root,
      
      pos:[0, 0, user_properties.pos[2]], 
      col: user_properties.col !== undefined ? user_properties.col : BLUEL[4],
      dim:_,
      text_col:WHITE, 
      
      align:(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), 
      
      text_on:user_properties.text_on !== undefined ? user_properties.text_on : 'on',
      text_off:user_properties.text_off !== undefined ? user_properties.text_off : 'off',
      text_pad:user_properties.text_pad, 
      style:style, 

      text_on_col : user_properties.text_on_col !== undefined ? user_properties.text_on_col : user_properties.text_col !== undefined ? user_properties.text_col : WHITE,
      text_off_col : user_properties.text_off_col !== undefined ? user_properties.text_off_col : user_properties.text_col !== undefined ? user_properties.text_col : GREY[6],
      
      font_size:user_properties.font_size !== undefined ? user_properties.font_size : 8, 
      texture_id:user_properties.texture_id !== undefined ? user_properties.texture_id : TEXTURES.MTSDF_CONSOLAS_1024, 
      sub_texture_id: user_properties.sub_texture_id !== undefined ? user_properties.sub_texture_id : _,
      variant_idx: user_properties.variant_idx !== undefined ? user_properties.variant_idx : _,
      
      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };

   return properties;
}
/** */
export function Style_switch_default_properties(user_properties) {

   const style = { rcorners: 8, feather: 0, border: 0 };

   const properties = { // Switch class

      is_root: user_properties.is_root,
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 
      col: user_properties.col !== undefined ? user_properties.col : GREY[4],
      size:user_properties.size !== undefined ? user_properties.size : 40,
      // pad:user_properties.pad !== undefined ? user_properties.pad : 0,
      pad:user_properties.pad !== undefined ? user_properties.pad : [0,0],
      style:user_properties.style !== undefined ? user_properties.style : style,
            
      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL,

      handle: {
         
         col: user_properties.handle_col !== undefined ? user_properties.handle_col : GREY[8],
         hover_margin: user_properties.hover_margin !== undefined ? user_properties.hover_margin : 7,
      },

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };

   return properties;
}
/**
 * 
 * @param {*} user_properties:{
 * // TODO
 *       name:'' 
 *       pos:[3] float
 *       col:[4] FloatArray32
 *       pad:[2] float
 *       font_size: float
 *    }
 *     
 * @returns 
 */
export function Style_section_default_properties(user_properties) {
   /** (is_root, options, pad, pos, dim, col, name, style, num_faces, texture_id, sub_texture_id, is_debug_mesh) { */


   const style = { rcorners: 8, feather: 0, border: 0 };

   const properties = { // Button||Label class

      // is_root, text, Align, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh
      is_root:user_properties.is_root,
      name: user_properties.name !== undefined ? user_properties.name : 'Section UNAMED',
      
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 
      col: user_properties.col !== undefined ? user_properties.col : BLUEL[4],
      dim:user_properties.dim,

      options:user_properties.options, 
      pad:user_properties.pad !== undefined ? user_properties.pad : [0,0],

      style:style, 
      num_faces:user_properties.num_faces !== undefined ? user_properties.num_faces : 1, 
      
      font_size:user_properties.font_size, 
      texture_id:user_properties.texture_id, 
      sub_texture_id:user_properties.sub_texture_id,
      variant_idx:user_properties.variant_idx,
            
      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL,

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };

   return properties;
}
/**
 * 
 * @param {*} user_properties:{
 * // TODO
 *       pad:[2] float
 *       name:'' 
 *       pos:[3] float
 *       col:[4] FloatArray32
 *       text:''
 *       text_pad:[2] float
 *       font_size: float
 *    }
 *     
 * @returns 
 */
export function Style_dropdown_default_properties(user_properties) {

   // {is_root:is_root, text:`ROOT`, pos:pos, col:YELLOWL[3], menu_col:GREEN[4], text_col:WHITE, text_pad:pad, pad:margin, font_size:font_size}

   const style = { rcorners: 8, feather: 0, border: 0 };

   const properties = {
      dp: {
         is_root:user_properties.is_root,
         options:SECTION.VERTICAL, 
         
         pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 

         dim:_,
         col:user_properties.col !== undefined ? user_properties.col : GREY[2],
         
         // pad:user_properties.pad !== undefined ? user_properties.pad : [0,0],
         pad:[5,5],
         name:user_properties.name,
         num_face:1,
         style:style, 
         
         texture_id:_,
         sub_texture_id:_,
         variant_idx:_,
               
         layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.RESIZE_SELF|LAYOUT.HORIZONTAL,

         is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
      },
      menu: { // Section class
         is_root:0x0,
         options:SECTION.VERTICAL, 
         
         pos:[0, 0, user_properties.pos[2]+1], 
         dim:[100, 100],
         col:user_properties.menu_col !== undefined ? user_properties.menu_col : YELLOWL[4],
         
         pad:user_properties.pad !== undefined ? user_properties.pad : [10,10], 
         // pad:[5,5], 
         num_face:1,
         style:style, 
         
         texture_id:_,
         sub_texture_id:_,
         variant_idx:_,
         
         is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
      },
      btn: { // Button->Label class
         // is_root, text, Align, pos, font_size, col, text_col, pad, bold, style, font, is_debug_mesh
         is_root:0x0,
         
         pos:[0, 0, user_properties.pos[2]+2], 
         // col: GREY[6],
         col: user_properties.btn_col !== undefined ? user_properties.btn_col : user_properties.col !== undefined ? user_properties.col : BLUEL[4],
         // col: BLUEL[4],
         dim:_,
         text_col:WHITE, 
         // pad:user_properties.pad !== undefined ? user_properties.pad : [10,10], 
         pad:[0,0], 

         align:(TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), 
         
         text:user_properties.text!==undefined ? user_properties.text : user_properties.name, 
         text_pad:user_properties.text_pad !== undefined ? user_properties.text_pad : [10, 6],  
         style:{ rcorners: 4, feather: 0, border: 0 }, 
         
         // font_size:user_properties.font_size !== undefined ? user_properties.font_size : alert('009183321453312 font_size required'), 
         font_size:user_properties.font_size !== undefined ? user_properties.font_size : 10, 
         texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
         sub_texture_id:_,
         variant_idx:_,
         
         is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
      },
   };

   return properties;
}
/** */
export function Style_color_picker_default_properties(user_properties) {

   const properties = {

      is_root: user_properties.is_root,
      pos:user_properties.pos !== undefined ? user_properties.pos : [0,0,0], 

      dim: user_properties.dim,
      col: user_properties.col,
      num_faces: user_properties.num_faces !== undefined ? user_properties.num_faces : 1,
      name: user_properties.name !== undefined ? user_properties.name : 'Rect Mesh UNAMED',
      pad: user_properties.pad !== undefined ? user_properties.pad : [0,0],

      texture_id:user_properties.texture_id, 
      sub_texture_id: user_properties.sub_texture_id,
      variant_idx: user_properties.variant_idx,

      layout:user_properties.layout !== undefined ? user_properties.layout : LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF,

      rcorners:{
         color_picker:  user_properties.rcorners!==undefined && user_properties.rcorners.color_picker !== undefined ? user_properties.rcorners.color_picker : 10, 
         panel:         user_properties.rcorners!==undefined && user_properties.rcorners.panel !== undefined ? user_properties.rcorners.panel : 10, 
         color_pick:    user_properties.rcorners!==undefined && user_properties.rcorners.color_pick !== undefined ? user_properties.rcorners.color_pick : 10, 
         panel2:        user_properties.rcorners!==undefined && user_properties.rcorners.panel2 !== undefined ? user_properties.rcorners.panel2 : 10, 
         color_present: user_properties.rcorners!==undefined && user_properties.rcorners.color_present !== undefined ? user_properties.rcorners.color_present : 8, 
         slider_trans:  user_properties.rcorners!==undefined && user_properties.rcorners.slider_trans !== undefined ? user_properties.rcorners.slider_trans : 5, 
         handle_trans:  user_properties.rcorners!==undefined && user_properties.rcorners.handle_trans !== undefined ? user_properties.rcorners.handle_trans : 2, 
         slider_hue:    user_properties.rcorners!==undefined && user_properties.rcorners.slider_hue !== undefined ? user_properties.rcorners.slider_hue : 6, 
         labels:        user_properties.rcorners!==undefined && user_properties.rcorners.labels !== undefined ? user_properties.rcorners.labels : 5,
      },

      is_debug_mesh:user_properties.is_debug_mesh !== undefined ? user_properties.is_debug_mesh : false,
   };

   return properties;
}