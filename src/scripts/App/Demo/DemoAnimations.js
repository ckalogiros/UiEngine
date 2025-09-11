"use strict";

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { CALLBACK_ANIMATION_TYPE_FLAGS, CALLBACK_ANIMATION_TYPE_IDX, Callback_animations_create_specific } from "../../Engine/Animations/CallbackAnimationsReadyAnimations.js";
import { Create_rect_mesh, Create_widget_button, Create_widget_label, Create_widget_slider } from "../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { BLACK, BLUEL, Color_hsv_to_rgb_calibrated, Get_fasma_color, GREEN, GREENL, GREY, RED, WHITE, YELLOW, YELLOWL } from "../../Engine/Drawables/Material/Colors.js";
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties } from "../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Texture_metrics_get_sub_tex_width, Texture_metrics_get_line_height, Texture_metrics_get_sub_tex_height } from "../../Engine/Loaders/Textures/TextureUvMap.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { Gl_set_angle, Gl_set_dim_xy, Gl_set_attr_round_corners } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { GetSequencedColor } from "../../Helpers/Helpers.js";
import { Function_Slope, Linear_interpolation, Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";
import { Widget_ready_label } from "../../Engine/Drawables/Widgets/Helpers/WidgetReadyWidgets.js";
import { move_x, move_x_right_vertices_right, move_x_left_vertices_right, move_y, move_y_upper_vertices_down, text_animation_gfx_vertex_set_sqeeze_x_axis, text_animation_gfx_vertex_set_vpos_x_by_value, move_y_bottom_vertices_down, set_y_vertices, set_x_vertices, set_x, set_y_vpos, set_y } from "./DemoTextAnimations.js";
import { Mesh_rotate_z, Mesh_set_dim_xy, Mesh_set_wpos_x, Mesh_set_wpos_xy, Mesh_set_wpos_y, Mesh_update_set_wpos_x } from "../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Layout_expand_x_axis, Layout_basic_pre_render } from "../../Engine/Drawables/Operations/AlignNestedSections.js";
import { Color_theme_label_auto } from "../../Engine/Drawables/Material/Themes.js";
import { Widget_render } from "../../Engine/Drawables/Widgets/Helpers/WidgetRender.js";
import { Mesh_set_root_in_focus } from "../../Engine/Drawables/Operations/MeshPropertiesFunctions.js";






const MULTI_COLOR = [BLUEL[9], RED[9], GREEN[9], YELLOW[9],];




/*********************************************************************************************************************************************/
// Create Demo Animations
/*********************************************************************************************************************************************/

export function Demo_animations(x = 10, y = 60, num_meshes = 5, scale = 20, size = 20, pad = 6, time_step = 0.01) {

   const num_colors = 4; // The number of colors to interpolate in between
   const color_width = 5; // Regulates the coloring. The more items the less color difference between meshes.  
   const rcorners = 10;
   let total_height = 0;



   // Scale Animations
   {

      let slope = 0.05;

      const panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, y, 0], col:GREY[1], layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:'Animations-Scale'}));
      Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.MOVE}});

      const text = 'Scale Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(Style_label_default_properties({text:text, pos:[x, y, 1], col:GREENL[5], layout:LAYOUT.HORIZONTAL}));
      Widget_gfx_ready_enable({mesh:label, enable_sdf_rect: rcorners});
      panel.AddItem(label);

      const panel_scale = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:GREY[3], layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
      Widget_gfx_ready_enable({mesh:panel_scale, enable_sdf_rect: rcorners, });
      panel.AddItem(panel_scale);

      const space_between = 20;
      let next_pad = [0, 10];

      for (let i = 0; i < num_meshes; i++) {

         const l = Create_widget_label(Style_label_default_properties({text:`${slope.toFixed(2)}`, pad:next_pad, pos:[0, 0, 1], col:_, text_pad:[14, 3], layout:LAYOUT.HORIZONTAL}));// [2, 3]);
         Widget_gfx_ready_enable({mesh:l, enable_sdf_rect: rcorners, });
         panel_scale.AddItem(l);

         
         next_pad = [(size+scale)*2 - l.geom.dim[0]*2 + space_between, 10]
         slope *= 2;
      }

      let pad_x = 0;
      slope = 0.05;
      let temp_buffer_animated = [];
      for (let i = 0; i < num_meshes; i++) {

         let color = Get_fasma_color(i, color_width, num_colors);
         const layout = i===0 ? LAYOUT.VERTICAL : LAYOUT.HORIZONTAL;
         const ret = Demo_clbk_animations_scale(0x0, true, 0, 100, size, 0.01, slope, scale, color, layout, pad_x);
         const anim_mesh =ret.target_mesh;
         panel_scale.AddItem(anim_mesh);
         temp_buffer_animated.push(anim_mesh); // HACK: We need to Align the meshes scaled, and before Render to scale them down

         pad_x = space_between;
         // Increment slope factor for each mesh. // NOTE: Min-Max values are [0,1], so calculate slope accordingly to the number of meshes
         slope *= 2;
      }

      
      // Render
      panel.GenGfxCtx();
      for (let i = 0; i < temp_buffer_animated.length; i++) { temp_buffer_animated[i].geom.dim[0] = size+scale; temp_buffer_animated[i].geom.dim[1] = size+scale; }
      
      Layout_basic_pre_render(panel);
      Layout_expand_x_axis(panel);

      // HACK: Scale down before render
      for (let i = 0; i < temp_buffer_animated.length; i++) { temp_buffer_animated[i].geom.dim[0] = size; temp_buffer_animated[i].geom.dim[1] = size; }
            
      Widget_render(panel);

      total_height = y;
      total_height += panel.geom.dim[1] * 2;
   }

   
   // Rotation Animations
   {

      let slope = 0.05;
      const angle = Math.PI*2;
      size *= 2; // Make rotated meshe bigger

      const panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, total_height, 0], col:GREY[1], layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:'Animations-Scale'}));
      Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.MOVE}});

      const text = 'Rotation Animations\nEach rectangle uses different value\nto shape the slope\nof a logarithmic function.\nSmaller values constitute steeper slope.';
      const label = Create_widget_label(Style_label_default_properties({text:text, pos:[0, 0, 1], col:GREENL[5], layout:LAYOUT.HORIZONTAL}));
      Widget_gfx_ready_enable({mesh:label, enable_sdf_rect: rcorners});
      panel.AddItem(label);

      const panel_scale = Create_rect_mesh(Style_rect_default_properties({pad:[10, 10], pos:[0, 0, 1], col:GREY[3], layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
      Widget_gfx_ready_enable({mesh:panel_scale, enable_sdf_rect: rcorners, });
      panel.AddItem(panel_scale);


      const space_between = 20;
      let next_pad = [0, 10];

      for (let i = 0; i < num_meshes; i++) {

         const l = Create_widget_label(Style_label_default_properties({text:`${slope.toFixed(2)}`, pad:next_pad, pos:[0, 0, 1], col:_, text_pad:[14, 3], layout:LAYOUT.HORIZONTAL}));// [2, 3]);
         Widget_gfx_ready_enable({mesh:l, enable_sdf_rect: rcorners, });
         panel_scale.AddItem(l);

         
         next_pad = [(size)*2 - l.geom.dim[0]*2 + space_between, 10]
         // Increment slope factor for each mesh. // NOTE: Min-Max values are [0,1], so calculate slope accordingly to the number of meshes
         slope *= 2;
      }

      slope = 0.05;
      let temp_buffer_animated = [];
      let pad_x = 0;
      for (let i = 0; i < num_meshes; i++) {

         let color = Get_fasma_color(i, color_width, num_colors);
         const layout = i===0 ? LAYOUT.VERTICAL : LAYOUT.HORIZONTAL;
         const anim_mesh = Demo_clbk_animations_rotate(0x0, true, 0, 0, size, 0.01, slope, angle, color, layout, pad_x).target_mesh;
         
         panel_scale.AddItem(anim_mesh);
         temp_buffer_animated.push(anim_mesh); // HACK: We need to Align the meshes scaled, and before Render to scale them down
         
         pad_x = space_between;
         // Increment slope factor for each mesh. // NOTE: Min-Max values are [0,1], so calculate slope accordingly to the number of meshes
         slope *= 2;
      }
      
      
      // Render
      panel.GenGfxCtx();
      Layout_basic_pre_render(panel);
      Layout_expand_x_axis(panel);
      Widget_render(panel);

      total_height += panel.geom.dim[1] * 2;
   }

   return total_height;

}
/** */
export function Demo_animations_with_slider_slope(x = 0, y = 0) {

   let total_height = 0;
   const rcorners = 10

   const panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, y, 0], col:GREY[1], name:'Demo_animations_with_slider_slope', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   // Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect: rcorners, enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(GREY[4], GREY[2]), listener:{type:LISTEN_EVENT_TYPES.MOVE}});
   Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.MOVE}});
   
   const text = 'Use the slider to change the slope\nof the logarithmic function.';
   const label = Widget_ready_label(Style_label_default_properties({text:text, font_size:10, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, layout:LAYOUT.VERTICAL}));
   // Widget_gfx_ready_enable({mesh:label, enable_sdf_rect: rcorners, enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(GREY[2], GREY[4])});
   Widget_gfx_ready_enable({mesh:label, enable_sdf_rect: rcorners});
   panel.AddItem(label);
   total_height += label.geom.dim[1];





   /**********************************************************************************************************/
   // Scale
   const scale = 40, size = 40, num_items = 11, pad = 10;
   let ypos = 0;
   let offset = 0;

   let color = Get_fasma_color(offset, num_items, 2);

   const ret1 = Demo_clbk_animations_scale(0x0, true, 0, 0, size, 0.01, 0.05, scale, color);
   ret1.slider_mesh.align.flags = LAYOUT.VERTICAL;
   ret1.target_mesh.align.flags = LAYOUT.VERTICAL
   panel.AddItem(ret1.slider_mesh);
   panel.AddItem(ret1.target_mesh);
   ypos += size * 2 + pad * 3;


  
   
   
   /**********************************************************************************************************/
   // Rotation
   const anim_mesh_size = size * 2;
   const angle = Math.PI;
   color = Get_fasma_color(offset, num_items, 2);
   const ret2 = Demo_clbk_animations_rotate(0x0, true, 0, 0, anim_mesh_size, 0.01, 0.05, angle, color);
   ret2.target_mesh.align.flags = LAYOUT.VERTICAL;
   ret2.slider_mesh.align.flags = LAYOUT.VERTICAL;
   panel.AddItem(ret2.slider_mesh);
   panel.AddItem(ret2.target_mesh);




   /**********************************************************************************************************/
   // Render

   panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   panel.GenGfxCtx();
   ret1.target_mesh.geom.dim[1] = size+scale; // HACK: We need that the scaled size is calculated for the panel's dimentions
   Layout_basic_pre_render(panel);
   ret1.target_mesh.geom.dim[1] = size; // HACK:And then render it to normal size
   Widget_render(panel);

   return panel;
}
/** */
export function Demo_animations_text(x = 0, y = 0, create_controls = true, font_size) {

   const rcorners = 10;

   const panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, y, 0], col:GREY[1], name:'Demo_animations_with_slider_slope', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   // Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect: rcorners, enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(GREY[4], GREY[2]), listener:{type:LISTEN_EVENT_TYPES.MOVE}});
   Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.MOVE}});

   const text = 'Use the "Options" menu to change properties.';
   const label = Widget_ready_label(Style_label_default_properties({text:text, font_size:10, texture_id:TEXTURES.MTSDF_CONSOLAS_1024}));
   // Widget_gfx_ready_enable({mesh:label, enable_sdf_rect: rcorners, enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(GREY[2], GREY[4]), listener:{type:LISTEN_EVENT_TYPES.MOVE}});
   Widget_gfx_ready_enable({mesh:label, enable_sdf_rect: rcorners, });
   panel.AddItem(label);


   /**********************************************************************************************************/
   // Scale
   const anim_ret = Demo_clbk_animations_text_counter(0x0, create_controls, 0, 0, font_size );
   panel.AddItem(anim_ret.target_mesh);
   if (create_controls) {
      panel.AddItem(anim_ret.controls_section);
   }



   /**********************************************************************************************************/
   // Render

   
   panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
   panel.GenGfxCtx();

   Layout_basic_pre_render(panel);
   Widget_render(panel);

   return {
      panel: panel,
      slope_params_pointer: anim_ret.slope_params_pointer,
      animation_properties: anim_ret.animation_properties,
   };
}
/** */
export function Demo_animations_ready_button_with_panel(root_widget=0x0,  x = 0, y = 0) {

   const panel = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, y, 0], col:GREY[1], name:'Demo_animations_ready_button_with_panel'}));
   Widget_gfx_ready_enable({mesh:panel, enable_sdf_rect:10, });




   /***************************************************************************************************/
   // Create different animations of buttons with panel
   
   const anim1 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.SCALE, 'Scale Animation', LAYOUT.HORIZONTAL);
   panel.AddItem(anim1);
   
   const anim2 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_X, 'Move X', LAYOUT.HORIZONTAL);
   panel.AddItem(anim2);
   
   const anim3 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY, 'Move XY', LAYOUT.VERTICAL);
   panel.AddItem(anim3);

   const anim4 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY|CALLBACK_ANIMATION_TYPE_FLAGS.SCALE, 'Move X-Y & Scale', LAYOUT.HORIZONTAL);
   // const anim4 = Demo_animations_ready_button_anim(0x0, 0, 0, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY_SCALE, 'Move X-Y & Scale', LAYOUT.HORIZONTAL);
   panel.AddItem(anim4);


   


   /**********************************************************************************************************/
   // Render
   if(root_widget) {

      
      // panel.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      panel.GenGfxCtx();
      
      // Layout_basic_pre_render(panel, panel.geom.pos[0], panel.geom.pos[1]);
      Layout_basic_pre_render(panel);
      Layout_expand_x_axis(panel);
      Widget_render(panel);
   }

   return panel;
}






























export function Demo_clbk_animations_create_transition_slope(time_step = 0.01, slope_const = .2, speed = 20) {
   const slope_params_pointer = new Function_Slope(slope_const, time_step, speed);
   return slope_params_pointer;
}




/*********************************************************************************************************************************************/
// Generic - Button Animations
/*********************************************************************************************************************************************/
/** Pass flag of type: CALLBACK_ANIMATION_TYPE_FLAGS */
export function Demo_animations_ready_button_anim(root_widget=0x0,  x = 0, y = 0, anim_type_flag=0x0, create_label='', layout=LAYOUT.VERTICAL) {
   if(!anim_type_flag) alert('No animation type flag is set. Please pass the animation type flag (of type: CALLBACK_ANIMATION_TYPE_FLAGS) to create animations.');


   const dim = [
      (VIEWPORT.WIDTH / 2 >= 180) ? 180 : VIEWPORT.WIDTH / 2 - 10,
      (VIEWPORT.HEIGHT / 2 >= 250) ? 250 : VIEWPORT.HEIGHT / 2 - 10,
   ];

   let zpos = 10;

   const menu_panel = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, pad:[10, 10], pos:[x, y, 0], dim:dim, col:Color_hsv_to_rgb_calibrated(.0, .0, .8, .9, .18, .0), name:'MenuLoadPanel', layout:layout|LAYOUT.RESIZE_SELF}));
   Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect: menu_panel.geom.dim[0] / 10, listener:{type:LISTEN_EVENT_TYPES.MOVE|LISTEN_EVENT_TYPES.CLICK_UP}}); 
   
   zpos++;
   
   

   /*************************************************************************************************/
   // Menu Items
   const menu_items = Create_menu_items_buttons();
   const len = menu_items.length;
   for (let i = 0; i < len; i++) { menu_panel.AddItem(menu_items[i]); }


   /*************************************************************************************************/
   // Render Menu 
   if(root_widget) {
      
      menu_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, menu_panel.mesh_bufferidx);
      menu_panel.GenGfxCtx();

      Layout_basic_pre_render(menu_panel);
      Layout_expand_x_axis(menu_panel);

      Widget_render(menu_panel);

      // Set menu in focus
      Mesh_set_root_in_focus(menu_panel.root_bufferidx, menu_panel.scroller_comp_idx);
   }


   // Create event callback for each menu item
   for (let i = 0; i <= menu_panel.children.boundary; i++) {

      const menu_button = menu_panel.children.buffer[i];
      // if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY_SCALE) 
      //    Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_XY_SCALE, { slope_constant: .3, time_step: 0.05, ammount: 80 });
      if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_XY, { slope_constant: .3, time_step: 0.05, ammount: 40 });
      else if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_X) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 });
      if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.SCALE) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.SCALE, { slope_constant: 1., time_step: 0.1, ammount: 17 });
      if(anim_type_flag & CALLBACK_ANIMATION_TYPE_FLAGS.RCORNERS) 
         Callback_animations_create_specific(menu_button, CALLBACK_ANIMATION_TYPE_IDX.RCORNERS, { slope_constant: 1., time_step: 0.1, ammount: .1 }, true);
   }


   return menu_panel;


}
/** */
export function Create_menu_items_buttons() {

   const menu_items_array = [];

   /*************************************************************************************************/
   // Menu Items
   const rcorners = 15;
   const font = TEXTURES.MTSDF_CONSOLAS_1024;
   const font_size = (PLATFORM.ANY_SMARTPHONE_DEVICE) ? 6 : 10;
   const text_col = WHITE;
   let btn_col = TRANSPARENCY(GREY[1], 1.);
   const layout = LAYOUT.VERTICAL|LAYOUT.EXPAND;
   
   const saturation = .5;
   const contrast = .28;
   const hue_preserve = .7;
   {
      /*******************************************************************************************/
      // Button 1
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.57, saturation, contrast, hue_preserve), text:'Mathematics      ',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }

   {
      /*******************************************************************************************/
      // Button 2
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.18, saturation, contrast, hue_preserve), text:'Mathematics      ',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }

   {
      /*******************************************************************************************/
      // Button 3
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.79, saturation, contrast, hue_preserve), text:'Molecular Biology',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }

   {
      /*******************************************************************************************/
      // Button 4
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(contrast, saturation, contrast, hue_preserve), text:'Chemistry        ',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }

   {
      /*******************************************************************************************/
      // Button 5
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.51, saturation, contrast, hue_preserve), text:'Neuroscience     ',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }
   {
      /*******************************************************************************************/
      // Button 6
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.89, saturation, contrast, hue_preserve), text:'Physics          ',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }
   {
      /*******************************************************************************************/
      // Button 7
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.12, saturation, contrast, hue_preserve), text:'Biochemistry     ',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }
   {
      /*******************************************************************************************/
      // Button 8
      btn_col = GetSequencedColor(7);
      const button = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.06, saturation, contrast, hue_preserve), text:'Genetics         ',pos:[0, 0, 0], col:btn_col, text_col:text_col, text_pad:[15, 8], font_size:font_size,  bold:.5, texture_id:font, layout:layout}));
      Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
      menu_items_array.push(button);
   }

   return menu_items_array;
}




/*********************************************************************************************************************************************/
// Scale Animations
/*********************************************************************************************************************************************/

export function Demo_clbk_animations_scale(root_widget = 0x0, create_slider = false, x = 100, y = 100, size = 20, time_step = 0.01, slope_const = 0.4, scale = 100, color = GREY[2], layout = LAYOUT.HORIZONTAL, pad_x=0) {

   // const rcorners = size;
   const rcorners = 10;
   let total_height = 0;
   let slider = null;


   /*************************************************************************************************/
   // 
   if (create_slider) {

      const slider_dim = (200 * 2 < VIEWPORT.WIDTH) ? [200, 10] : [VIEWPORT.WIDTH / 2 - 10, 10];
      slider = Create_widget_slider(Style_slider_default_properties({pos:[0, 0, 2], dim:slider_dim, col:GREY[5], name:'Log Function Slope', layout:LAYOUT.VERTICAL}));
      // Widget_gfx_ready_enable({mesh:slider, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(GREY[1], GREY[3]), });
      // Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:10, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(GREY[1], GREY[3]), });
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:rcorners });
      slider.SetInitialValue(slope_const);

      total_height += slider.geom.dim[1] * 2;

   }




   /*************************************************************************************************/

   if (create_slider) {
      y += slider.geom.dim[1] * 2 + 10;
      total_height += slider.geom.dim[1] * 2 + 10;
   }

   const mesh = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, pad:[pad_x, 10], pos:[0, 0, 2], dim:[size, size], col:color, name:'mesh_anim_scale_rect', layout:layout,}));
   Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect: rcorners, enable_col_per_vertex:MULTI_COLOR, enable_attr_angle:true, });
   // Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect: rcorners, enable_attr_angle:true, });


   total_height += mesh.geom.dim[1] * 2;

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      if (create_slider) {

         slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
         Widget_render(slider);

      }
      
      mesh.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      mesh.GenGfxCtx();

      Layout_basic_pre_render(mesh);

      Widget_render(mesh);
            
   }



   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);

   if (create_slider) {

      // Connect slider to control the slope_constant1 value
      const slider_params = slope_params_pointer;
      Slider_connect(slider, (params, slider_val) => {
         const val = Linear_interpolation(.01, 1, slider_val);
         params.clbk_params.SetSlope(val);
      }, slider_params);
   }


   const params = {
      mesh: mesh,
      function_slope: slope_params_pointer,
   };

   Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, `Run:${params.function_slope.slope_constant}`);

   return {
      target_mesh: mesh,
      slider_mesh: slider,
      total_height: total_height,
   };

}

function Animation_scale_up_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const size = mesh.geom.dim[0] + (slope * scale);

   Mesh_set_dim_xy(mesh, size, size);
   Gl_set_dim_xy(mesh.gfx, size, size);

   const diffx = mesh.geom.pos[0] + (slope * scale);
   const diffy = mesh.geom.pos[1] + (slope * scale);
   Mesh_set_wpos_xy(mesh, diffx, diffy/2);
   // Mesh_set_wpos_xy(mesh, mesh.geom.pos[0] + size, mesh.geom.pos[0] + size/2);

   if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
      Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners * (slope + 1));
   }

   if (slope < 1.) return true;
   else return false
}

function Animation_scale_up_stop(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params, `Stop:${params.function_slope.slope_constant}`)

   return false;
}

function Animation_scale_down_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const size = mesh.geom.dim[0] + ((1. - slope) * scale);
   Mesh_set_dim_xy(mesh, size, size);
   Gl_set_dim_xy(mesh.gfx, size, size);

   const diffx = mesh.geom.pos[0] + ((1. - slope) * scale);
   const diffy = mesh.geom.pos[1] + ((1. - slope) * scale);
   Mesh_set_wpos_xy(mesh, diffx, diffy/2);
   // Mesh_set_wpos_xy(mesh, size, size/2);

   if (mesh.sid.attr & SID.ATTR.R_CORNERS) {
      Gl_set_attr_round_corners(mesh.gfx, mesh.mat.style.rcorners * ((1. - slope) + 1));
   }



   if (slope < 1.) return true;
   else return false
}

function Animation_scale_down_stop(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params, `Stop:${params.function_slope.slope_constant}`);

   return false;
}




/*********************************************************************************************************************************************/
// Rotate Animations
/*********************************************************************************************************************************************/
let rotation = 0;

export function Demo_clbk_animations_rotate(root_widget = 0x0, create_slider = false, x = 0, y = 0, size = 20, time_step = 0.01, slope_const = 0.4, angle = 0, color = GREY[2], layout=LAYOUT.VERTICAL, pad_x=0) {

   const rcorners = 10;
   let total_height = 0;

   let slider = null;


   /*************************************************************************************************/
   // Constant value slope_constant slider
   if (create_slider) {

      const slider_dim = (200 * 2 < VIEWPORT.WIDTH) ? [200, 10] : [VIEWPORT.WIDTH / 2 - 10, 10];
      slider = Create_widget_slider(Style_slider_default_properties({pos:[0, 0, 2], dim:slider_dim, col:GREY[5], name:'Log Function Slope'}));
      // Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect: rcorners, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), });
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect: rcorners });
      slider.SetInitialValue(slope_const);

      total_height += slider.geom.dim[1] * 2;

   }


   /*************************************************************************************************/
   // Rotated mesh
   const mesh = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, pad:[pad_x, 30], pos:[0, 0, 0], dim:[size, size], col:color, layout:layout, name:'mesh_anim_rotate_rect',}));
   Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect: rcorners, enable_col_per_vertex:MULTI_COLOR, enable_attr_angle:true, });


   total_height += mesh.geom.dim[1] * 2;

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      if (create_slider) {

         slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
                     
         Widget_render(slider);

      }

      
      Mesh_set_wpos_y(mesh.geom.pos[1], y);
      
      mesh.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
      mesh.GenGfxCtx();

      Layout_basic_pre_render(mesh);
      
      Widget_render(mesh);

   }


   const slope_params_pointer = new Function_Slope(slope_const, time_step, angle);

   if (create_slider) {

      const slider_params = slope_params_pointer;
      Slider_connect(slider, (params, slider_val) => {
         const val = Linear_interpolation(.01, 1, slider_val);
         params.clbk_params.SetSlope(val);
      }, slider_params);
   }


   const params = {
      mesh: mesh,
      function_slope: slope_params_pointer,
   };

   Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Run:${params.function_slope.slope_constant}`);



   return {
      target_mesh: mesh,
      slider_mesh: slider,
      total_height: total_height,
   };
}

function Animation_rotate_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);

   const rot = (slope * angle);

   Mesh_rotate_z(mesh, rot);
   Gl_set_angle(mesh.gfx, rot);
   rotation = rot;

   if (slope < 1.) return true;
   else return false

}

function Animation_rotate_stop(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_rotate_back_run, Animation_rotate_back_stop, params, `Stop${params.function_slope.slope_constant}`);

   return false;
}

function Animation_rotate_back_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);

   const rot = ((1. - slope) * angle);

   Mesh_rotate_z(mesh, rot);
   Gl_set_angle(mesh.gfx, rot);
   rotation = rot;

   if (slope < 1.) return true;
   else return false
}

function Animation_rotate_back_stop(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Stop:${params.function_slope.slope_constant}`);

   return false;
}




/*********************************************************************************************************************************************/
// Text Counter Animations
/*********************************************************************************************************************************************/
export function Demo_clbk_animations_text_counter(root_widget = 0x0, create_contols = false, x = 0, y = 0, font_size=12, clbk_anim_flag = CLBK_ANIMATIONS.TEXT_SQUEEZE_Y, size = 20, time_step = 0.01, slope = .2, speed = 20, layout=LAYOUT.VERTICAL) {

   let total_height = 0;

   const slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, slope, speed);

   // We need a refference to an object so that we can chnge the 'animation type' of the interval via the contols menu
   const animation_properties = {
      counter1: 0,
      counter2: 1,
      anim_flag: clbk_anim_flag,
      digit1_mesh: null,
      digit2_mesh: null,
   };


   /*************************************************************************************************/
   // Create controls
   const controls_section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, pad:[10, 10], pos:[0, 0, 3], dim:[0, 0], col:BLACK, name:'Controls Section', style:[0, 10, 2], layout:LAYOUT.RESIZE_SELF|layout}));
   // Widget_gfx_ready_enable({mesh:controls_section, enable_sdf_rect: 10, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(GREY[1], GREY[3])});
   Widget_gfx_ready_enable({mesh:controls_section, enable_sdf_rect: 10, });

   if (create_contols) { // Create slider controls only if this is to be rendered from this function

      const controls_buffer = Demo_clbk_animations_text_create_contols(slope_params_pointer, animation_properties, YELLOWL[3]);

      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }

   // controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

   /****************************************************************************************************************/
   // Render 
   if (create_contols && (root_widget & ROOT_WIDGETS.CREATE_ROOT)) { // Create slider controls only if this is to be rendered from this function
      
      controls_section.GenGfxCtx();
      Layout_basic_pre_render(controls_section);
      Widget_render(controls_section);


   }





   /*************************************************************************************************************/
   // Create animated meshes

   // Create panel
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:root_widget, pad:[20, 20], pos:[0, 100, 0], col:GREY[2], layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF}));
   // Widget_gfx_ready_enable({mesh:section, enable_sdf_rect: 10, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(GREY[1], GREY[3]), listener:{type:LISTEN_EVENT_TYPES.MOVE}});
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect: 10, listener:{type:LISTEN_EVENT_TYPES.MOVE}});


   // ISSUE: Somehow the text on update shifts to the rigth in x-axis, but the first characters ar aligned correctly


   // Create animated meshes
   const text_pad_x = 10, text_pad_y = 6;
   const mesh2 = Create_widget_label(Style_label_default_properties({text:'-', pos:[0, 0, 0], col:BLUEL[9], text_col:WHITE, text_pad:[text_pad_x, text_pad_y], texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:font_size, layout:LAYOUT.HORIZONTAL}));
   // Widget_gfx_ready_enable({mesh:mesh2, enable_sdf_rect: 6, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(PURPLER[9], PURPLER[0])});
   Widget_gfx_ready_enable({mesh:mesh2, enable_sdf_rect: 6});
   section.AddItem(mesh2)
   const mesh1 = Create_widget_label(Style_label_default_properties({text:'-', pos:[0, 0, 0], col:BLUEL[9], text_col:WHITE, text_pad:[text_pad_x, text_pad_y], texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:font_size, layout:LAYOUT.HORIZONTAL}));
   // Widget_gfx_ready_enable({mesh:mesh1, enable_sdf_rect: 6, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(PURPLEB[9], PURPLEB[0])});
   Widget_gfx_ready_enable({mesh:mesh1, enable_sdf_rect: 6});
   section.AddItem(mesh1)

   // section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);





   /*************************************************************************************************************/
   // Render animated meshes
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

      section.GenGfxCtx();
      Layout_basic_pre_render(section);
      Widget_render(section);
      
      total_height += section.geom.dim[1] * 2;

   }




   /*************************************************************************************************************/
   // Create callback animation with interval timer

   animation_properties.digit1_mesh = mesh1;
   animation_properties.digit2_mesh = mesh2;

   //  const slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, slope, speed);
    
    let cnt = 0;

    { // One time call

        if (cnt > 9) cnt = 0;
        const text_substitution = `${cnt++}`;
        
        let limit = 0;
        if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Texture_metrics_get_sub_tex_width(animation_properties.digit2_mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;
        else if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_Y) limit = Texture_metrics_get_sub_tex_height(animation_properties.digit2_mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;
        else if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_Y) limit = Texture_metrics_get_line_height(animation_properties.digit2_mesh.text_mesh.mat.metrics_idx) * animation_properties.digit2_mesh.text_mesh.geom.dim[0];

        const times_to_run = -1;
        const wait_time = 500; // In miliseconds
        
        Demo_clbk_animations_text_create(animation_properties.digit2_mesh, slope_params_pointer, limit, clbk_anim_flag, font_size, times_to_run, cnt, wait_time, text_substitution, 'TESTETESTTEST', );
    }

   // Time_intervals_create(1000, 'TEST_text_animation', TIME_INTERVAL_REPEAT_ALWAYS,
   //    (params) => {

   //       const anim_flag = params.params.anim_flag;

   //       if (params.params.counter1 > 9) {

   //          const digit2_mesh = params.params.digit2_mesh;

   //          let limit_ = 0;
   //          const text_substitution_ = `${params.params.counter2++}`
   //          if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit_ = Texture_metrics_get_sub_tex_width(digit2_mesh.text_mesh.mat.metrics_idx, text_substitution_.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) / 2;
   //          else if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit_ = Texture_metrics_get_sub_tex_height(digit2_mesh.text_mesh.mat.metrics_idx, text_substitution_.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;

   //          const anim_idx = Demo_clbk_animations_text_create(digit2_mesh, slope_params_pointer, limit_, 'TEST_text_animation_2', anim_flag, text_substitution_);
   //          params.params.counter1 = 0;
   //       }


   //       const digit1_mesh = params.params.digit1_mesh;
   //       if (params.params.counter2 > 9) { params.params.counter2 = 0; }

   //       const text_substitution = `${params.params.counter1++}`

   //       let limit = 0;
   //       if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Texture_metrics_get_sub_tex_width(digit1_mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) / 2;
   //       else if (anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit = Texture_metrics_get_sub_tex_height(digit1_mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;

   //       const anim_idx = Demo_clbk_animations_text_create(digit1_mesh, slope_params_pointer, limit, 'TEST_text_animation_1', anim_flag, text_substitution);
   //    },

   //    animation_properties,
   // );


   return {
      target_mesh: section,
      controls_section: controls_section,
      slope_params_pointer: slope_params_pointer,
      animation_properties: animation_properties,
      total_height: total_height,
   };

}
/* Text Animation Controls */
export function Demo_clbk_animations_text_create_contols(slope_params_pointer, animation_properties) {

   const contols_buffer = [];
   let zpos = 0;

   /*****************************************************************************************/
   // Slider for controling the slope
   const slider_rcorners = 7;
   const bar_rcorners = 6;
   {
      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];

      const slider = Create_widget_slider(Style_slider_default_properties({pos:[0, 0, zpos + 1], dim:slider_dim, col:GREY[5], name:'Animation Slope', texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:10}));
      // Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect: 8, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2])});
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect: 8});
      
      slider.SetInitialValue(slope_params_pointer.GetSlope());
      // slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      slider.SetLayout(LAYOUT.HORIZONTAL);
      
      contols_buffer.push(slider);
      
      // animation_properties:animation_properties
      const slider_params = slope_params_pointer;
      Slider_connect(slider, (params, slider_val) => {
         params.clbk_params.SetSlope(slider_val);
      }, slider_params);
   }
   
   /*****************************************************************************************/
   // Slider for controling the animation speed
   {
      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      
      const slider = Create_widget_slider(Style_slider_default_properties({pos:[0, 0, zpos + 1], col:GREY[5], dim:slider_dim, name:'Animation Speed', texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:10}));
      // Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect: 8, enable_col_per_vertex:COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2])});
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect: 8});
      slider.SetInitialValue(slope_params_pointer.GetSlope());
      // slider.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      slider.SetLayout(LAYOUT.VERTICAL);

      contols_buffer.push(slider);

      // animation_properties:animation_properties
      const slider_params = {
         slope_params_pointer: slope_params_pointer,
         min: slope_params_pointer.GetAmmount() / 2,
         max: slope_params_pointer.GetAmmount() * 3,
      }
      Slider_connect(slider, (params, slider_val) => {
         const min = params.clbk_params.min, max = params.clbk_params.max;
         const val = Linear_interpolation(min, max, slider_val);
         params.clbk_params.slope_params_pointer.SetAmmount(val);
      }, slider_params);
   }


   // /*****************************************************************************************/
   // // Switch for changing the animation type
   // { // Translate switch animations switch

   //    const panel = Create_rect_mesh(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), 'anim_type_panel');
   //    panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   //    // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   //    panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   //    panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   //    panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
   //    contols_buffer.push(panel);

   //    // Create label
   //    const label = Create_widget_label(_, 'Type: Translate X:Y', (TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, COLOR_GRADIENT_HORIZONTAL(GREEN[5], GREEN[2]), WHITE, [5, 5], _, _, _, _);
   //    label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   //    // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   //    label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   //    label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   //    label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREEN[5], GREEN[2]));
   //    panel.AddItem(label);

   //    const type_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), _);
   //    // type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2, 2);
   //    type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, type_switch.geom.dim[1]);
   //    type_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   //    type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), COLOR_GRADIENT_VERTICAL(GREY[5], GREY[9]));
   //    type_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   //    type_switch.SetName('anim_type_switch');
   //    panel.AddItem(type_switch);

   //    type_switch.Bind(
   //       (params) => {

   //          const switch_mesh = params.target_mesh;
   //          const isOn = switch_mesh.isOn;

   //          if (isOn) {
   //             animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_X
   //          }
   //          else {

   //             animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y
   //          }
   //       },
   //       null, _, _,
   //    );

   // }
   // { // Sqeeze switch animations switch
   //    const panel = Create_rect_mesh(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]), 'anim_type_panel');
   //    panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   //    // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   //    panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   //    panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   //    panel.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_VERTICAL(GREY[5], GREY[2]));
   //    contols_buffer.push(panel);

   //    // Create label
   //    const label = Create_widget_label(_, 'Type: Squeeze X:Y', (TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]), WHITE, [5, 5], _, _, _, _);
   //    label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   //    // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   //    label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   //    label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   //    label.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]));
   //    panel.AddItem(label);

   //    const type_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), _);
   //    // type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2, 2);
   //    type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, type_switch.geom.dim[1]);
   //    type_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   //    type_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, COLOR_GRADIENT_HORIZONTAL(GREY[5], GREY[2]), COLOR_GRADIENT_VERTICAL(GREY[5], GREY[9]));
   //    type_switch.color_active = COLOR_GRADIENT_HORIZONTAL(YELLOWR[6], YELLOWR[3]);
   //    type_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   //    type_switch.SetName('anim_type_switch');
   //    panel.AddItem(type_switch);

   //    type_switch.Bind(
   //       (params) => {

   //          const switch_mesh = params.target_mesh;
   //          const isOn = switch_mesh.isOn;

   //          if (isOn) {
   //             animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_SQUEEZE_X
   //          }
   //          else {

   //             animation_properties.anim_flag = CLBK_ANIMATIONS.TEXT_SQUEEZE_Y
   //          }
   //       },
   //       null, _, _,
   //    );

   // }

   return contols_buffer;
}
/** */
export function Demo_clbk_animations_text_create(target_mesh, slope_params_pointer, limit, animation_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, font_size, times_to_run=-1, counter, wait_time, text_substitution = '0', name, ) {

   const params = {
      mesh: target_mesh,
      limit: limit,
      text_mesh: target_mesh.text_mesh,
      function_slope: slope_params_pointer,
      clbk_anim_flag:animation_flag,
      font_size:font_size,
      times_to_run:times_to_run,
      cnt:counter,
      text_substitution: text_substitution,
      wait_time: wait_time,
      name: name,
   };

   if (animation_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_X) return Callback_animations_create(Animation_text_run_translation_x, Animation_text_stop_translation_x, params, `Run:${params.name}`);
   else if (animation_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_Y) return Callback_animations_create(Animation_text_run_translation_y, Animation_text_stop_translation_y, params, `Run:${params.name}`);
   else if (animation_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_X) return Callback_animations_create(Animation_text_run_squeeze_x, Animation_text_stop_squeeze_x, params, `Run:${params.name}`);
   else if (animation_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_Y) return Callback_animations_create(Animation_text_run_squeeze_y, Animation_text_stop_squeeze_y, params, `Run:${params.name}`);
}




/*********************************************************************************************************************************************/
// Squeeze X
/*********************************************************************************************************************************************/
function Animation_text_run_squeeze_x(params) {

   const text = params.mesh.text_mesh;

   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const limit = params.limit;
   const text_substitution = params.text_substitution; // Substitution text

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Squeeze text down to a limit
   const a = move_x_left_vertices_right(text, val, limit);

   // if limit width reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);

      text_animation_gfx_vertex_set_sqeeze_x_axis(text, -limit);

      return false;
   }

   return true

}

function Animation_text_stop_squeeze_x(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_text_back_run_squeeze_x, Animation_text_back_stop_squeeze_x, params, `Stop:${params.name}`)

   // Reset vertices position to the 'left' face's boundary(from right), to start the procces of 'un-sqeeze' moving right vertices right
   const text = params.mesh.text_mesh;
   const x = params.limit; 
   set_x_vertices(text, -x);

   return false;

}

function Animation_text_back_run_squeeze_x(params) {

   const mesh = params.mesh;
   const text = mesh.text_mesh;

   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const effect = 10; // Exceed the limit to create a bounce effect
   const limit = params.limit;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Squeeze text down to a limit
   const a = move_x_right_vertices_right(text, val, limit+effect);

   if (a === false) {

      text_animation_gfx_vertex_set_vpos_x_by_value(text, limit);
      // Translate to original starting position
      const center_posx = (mesh.geom.pos[0] + mesh.geom.dim[0]);
      set_x(text, center_posx);

      return false;
   }
   return true

}

function Animation_text_back_stop_squeeze_x(params) {

   Time_intervals_create(params.wait_time, 'Text_Animations-WAIT Time', 1,  (params)=>{

      params.params.function_slope.SetTimer(0);
   
      if(params.params.times_to_run !== 0) {
   
         if (params.params.cnt > 9) params.params.cnt = 0;
         const text_substitution = `${params.params.cnt++}`;
         
         let limit = Texture_metrics_get_sub_tex_width(params.params.mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * params.params.font_size;
      
         params.params.times_to_run--;
   
         Demo_clbk_animations_text_create(
            params.params.mesh, 
            params.params.function_slope, 
            limit, 
            params.params.clbk_anim_flag, 
            params.params.font_size,
            params.params.times_to_run,
            params.params.cnt,
            params.params.wait_time,
            text_substitution, 
            params.params.name, 
         );
      }
   
   
      return false;
   }, params);

   return true;
}




/*********************************************************************************************************************************************/
// Squeeze Y
/*********************************************************************************************************************************************/
function Animation_text_run_squeeze_y(params) {


   const mesh = params.mesh;
   const text = params.mesh.text_mesh;

   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const limit = params.limit;
   const text_substitution = params.text_substitution; // Substitution text

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);


   // Squeeze text down to a limit
   const a = move_y_upper_vertices_down(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);
      // Face should be fully squeezed. Avoid text face been render as a rect, because of RenderTextFromString() reseting the upper vertex positions.
      move_y_upper_vertices_down(text, (limit*2+10), 10000);

      // Center new text 
      const center_posx = (mesh.geom.pos[0] + mesh.geom.dim[0]);
      set_x(text, center_posx);

      return false;
   }

   return true

}

function Animation_text_stop_squeeze_y(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_text_back_run_squeeze_y, Animation_text_back_stop_squeeze_y, params, `Stop:${params.name}`)

   // Reset vertices position to the 'upper' face's boundary(from bottom), to start the procces of 'un-sqeeze' moving bottom vertices down
   const text = params.mesh.text_mesh;
   const y = params.limit; 
   set_y_vertices(text, -y);

   return false;
}

function Animation_text_back_run_squeeze_y(params) {

   const mesh = params.mesh;
   const text = mesh.text_mesh;

   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   
   const effect = 10; // Exceed the limit to create a bounce effect
   const limit = params.limit;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   
   // Squeeze text down to a limit
   const a = move_y_bottom_vertices_down(text, val, limit+effect);
   
   if (a === false) {
      set_y_vpos(text, limit);
      return false;
   }

   return true;

}

function Animation_text_back_stop_squeeze_y(params) {

   Time_intervals_create(params.wait_time, 'Text_Animations-WAIT Time', 1,  (params)=>{

      params.params.function_slope.SetTimer(0);
         
      if(params.params.times_to_run !== 0) {
   
         if (params.params.cnt > 9) params.params.cnt = 0;
         const text_substitution = `${params.params.cnt++}`;
         
         let limit = Texture_metrics_get_sub_tex_height(params.params.mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * params.params.font_size;
      
         params.params.times_to_run--;
   
         Demo_clbk_animations_text_create(
            params.params.mesh, 
            params.params.function_slope, 
            limit, 
            params.params.clbk_anim_flag, 
            params.params.font_size,
            params.params.times_to_run,
            params.params.cnt,
            params.params.wait_time,
            text_substitution, 
            params.params.name, 
         );
      }
   
      return false;
      
   }, params);
   
   return true;
}




/*********************************************************************************************************************************************/
// Translate X
/*********************************************************************************************************************************************/
function Animation_text_run_translation_x(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;
   
   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const limit = mesh.text_mesh.geom.pos[0] + (mesh.text_mesh.geom.dim[0] * 2) + 4;
   const text_substitution = params.text_substitution; // Substitution text
   
   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text right to a limit
   const a = move_x(text, val, limit);

   if (a === false) { // if limit is reached,

      // Substitute the text
      text.RenderTextFromString(text_substitution);

      // Translate to original starting position
      set_x(text, mesh.geom.pos[0] - params.limit);

      return false;
   }

   return true

}

function Animation_text_stop_translation_x(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_text_back_run_translation_x, Animation_text_back_stop_translation_x, params, `Stop:${params.name}`)

   return false;
}

function Animation_text_back_run_translation_x(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;

   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   
   const effect = 10; // Exceed the limit to create a bounce effect
   const limit = mesh.geom.pos[0] + mesh.geom.dim[0] + effect;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text right to a limit
   const a = move_x(text, val, limit);

   if (a === false) {

      // Translate to original starting position
      const center_posx = (mesh.geom.pos[0] + mesh.geom.dim[0]);
      set_x(text, center_posx);

      return false;
   }
   return true;

}

function Animation_text_back_stop_translation_x(params) {

   Time_intervals_create(params.wait_time, 'Text_Animations-WAIT Time', 1,  (params)=>{

      params.params.function_slope.SetTimer(0);
         
      if(params.params.times_to_run !== 0) {
   
         if (params.params.cnt > 9) params.params.cnt = 0;
         const text_substitution = `${params.params.cnt++}`;
         
         let limit = Texture_metrics_get_sub_tex_width(params.params.mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * params.params.font_size;
      
         params.params.times_to_run--;
   
         Demo_clbk_animations_text_create(
            params.params.mesh, 
            params.params.function_slope, 
            limit, 
            params.params.clbk_anim_flag, 
            params.params.font_size,
            params.params.times_to_run,
            params.params.cnt,
            params.params.wait_time,
            text_substitution, 
            params.params.name, 
         );
      }
   
      return false;
      
   }, params);

   return true;
}




/*********************************************************************************************************************************************/
// Translate Y
/*********************************************************************************************************************************************/
function Animation_text_run_translation_y(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;

   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   // const limit = mesh.text_mesh.geom.pos[1] + (mesh.geom.dim[1] * 2) + 35;
   const limit = mesh.text_mesh.geom.pos[1] + (mesh.geom.dim[1] * 2) + 4;
   // const limit = mesh.text_mesh.geom.pos[1] + (params.limit * 2) + 4;
   const text_substitution = params.text_substitution; // Substitution text
   
   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text right to a limit
   const a = move_y(text, val, limit);

   // if limit height reached,
   if (a === false) {

      // ... move the text in the upper starting position, for the next animation to start  

      // Also substitute the text
      text.RenderTextFromString(text_substitution);

      // // Translate to original starting position
      // const center_posx = (mesh.geom.pos[1] + mesh.geom.dim[1]);
      // set_x(text, center_posx);

      // Translate to original starting position
      set_y(text, mesh.geom.pos[1] - params.limit);
                  
      // Center new text in x coord 
      const center_posx = (mesh.geom.pos[0] + mesh.geom.dim[0]);
      set_x(text, center_posx);

      return false;
   }

   return true

}
/** */
function Animation_text_stop_translation_y(params) {

   params.function_slope.SetTimer(0);
   Callback_animations_create(Animation_text_back_run_translation_y, Animation_text_back_stop_translation_y, params, `Stop:${params.name}`)

   return false;
}
/** */
function Animation_text_back_run_translation_y(params) {

   const mesh = params.mesh;
   const text = params.mesh.text_mesh;

   const slope_constant = params.function_slope.GetSlope();
   const speed = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const effect = 10; // Exceed the limit to create a bounce effect
   const limit = mesh.geom.pos[1] + mesh.geom.dim[1] + effect;

   const slope = Logarithmic_interpolation(timer, slope_constant);
   const val = (slope * speed);

   // Translate text right to a limit
   const a = move_y(text, val, limit);

   if (a === false) {

      // Translate to original starting position
      const center_posy = (mesh.geom.pos[1] + mesh.geom.dim[1]);
      set_y(text, center_posy);

      return false;
   }
   return true;
}
/** */
function Animation_text_back_stop_translation_y(params) {

   
   Time_intervals_create(params.wait_time, 'Text_Animations-WAIT Time', 1,  (params)=>{

      params.params.function_slope.SetTimer(0);
         
      if(params.params.times_to_run !== 0) {
         
         if (params.params.cnt > 9) params.params.cnt = 0;
         const text_substitution = `${params.params.cnt++}`;
         
         let limit = Texture_metrics_get_line_height(params.params.mesh.text_mesh.mat.metrics_idx) * params.params.mesh.text_mesh.geom.dim[0];
         
         params.params.times_to_run--;
   
         Demo_clbk_animations_text_create(
            params.params.mesh, 
            params.params.function_slope, 
            limit, 
            params.params.clbk_anim_flag, 
            params.params.font_size,
            params.params.times_to_run,
            params.params.cnt,
            params.params.wait_time,
            text_substitution, 
            params.params.name, 
         );
      }
   
      return false;
      
   }, params);

   return true;
}

