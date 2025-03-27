"use strict";

import { Create_widget_slider } from "../../Engine/Core/CreateWidget.js";
import { YELLOW } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Style_slider_default_properties } from "../../Engine/Drawables/Widgets/WidgetReadyStyles.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Program_get_uniform_from_name } from "../../Graphics/ShaderPrograms.js";
import { Widget_gfx_ready_enable } from "./WidgetGfxReady.js";




export function Contols_generic_uniforms_buffer(target_mesh, controls_size, parameters = null, uniform_name) {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:color, name:name, layout:ALIGN_2.VERTICAL, texture_id:texture_id}));
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
      return slider;
   }
   
   
   
   const contols_buffer = [];
   
   
   const params = {
      target_mesh: target_mesh,
      uniform_name:uniform_name,
   };
   
   let ypos = 20;
   const height = 45;
   const slider_dim=controls_size, color=YELLOW[4], rcorners=10, default_font=TEXTURES.MTSDF_CONSOLAS_1024;
   

   const shader_uniforms = Program_get_uniform_from_name(target_mesh.gfx.prog.idx, uniform_name);
   const len = shader_uniforms.shader_variables_unif_names.length;
   for(let i=0; i<len; i++) {

      const unif_name = shader_uniforms.shader_variables_unif_names[i].name;

      // Slider: unif 1
      const slider = Create_slider_control(slider_dim, color, unif_name, rcorners, default_font, );
      slider.SetInitialValue(parameters ? parameters[0] : 1.);
      contols_buffer.push(slider);

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {

         const target_mesh = params.clbk_params.target_mesh;
         // target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, i);
         target_mesh.GfxUniformSetAndUpdate(params.clbk_params.uniform_name, slider_val, i);

      }, params,
      );
      ypos += height;
   }

   // {
   //    { // Slider: unif 1
   //       const slider = Create_slider_control(slider_dim, color, 'UNUSED', rcorners, default_font, );
   //       slider.SetInitialValue(parameters ? parameters[0] : 1.);
   //       contols_buffer.push(slider);

   //       // Connect sliders to gfx program uniforms 
   //       Slider_connect(slider, (params, slider_val) => {

   //          const target_mesh = params.clbk_params.target_mesh;
   //          target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);

   //       }, params,
   //       );
   //    } ypos += height;
   //    { // Slider: unif 2
   //       const slider = Create_slider_control(slider_dim, color, 'UNUSED', rcorners, default_font, );
   //       slider.SetInitialValue(parameters ? parameters[1] : 1.);
   //       contols_buffer.push(slider);

   //       // Connect sliders to gfx program uniforms 
   //       Slider_connect(slider, (params, slider_val) => {

   //          const target_mesh = params.clbk_params.target_mesh;
   //          target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

   //       }, params,
   //       );
   //    } ypos += height;
   //    { // Slider: unif 3
   //       const slider = Create_slider_control(slider_dim, color, 'UNUSED', rcorners, default_font, );
   //       slider.SetInitialValue(parameters ? parameters[2] : 1.);
   //       contols_buffer.push(slider);

   //       // Connect sliders to gfx program uniforms 
   //       Slider_connect(slider, (params, slider_val) => {

   //          const target_mesh = params.clbk_params.target_mesh;
   //          target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

   //       }, params,
   //       );
   //    } ypos += height;
   //    { // Slider: unif 4
   //       const slider = Create_slider_control(slider_dim, color, 'UNUSED', rcorners, default_font, );
   //       slider.SetInitialValue(parameters ? parameters[3] : 1.);
   //       contols_buffer.push(slider);

   //       // Connect sliders to gfx program uniforms 
   //       Slider_connect(slider, (params, slider_val) => {

   //          const target_mesh = params.clbk_params.target_mesh;
   //          target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

   //       }, params,
   //       );
   //    } ypos += height;
   //    { // Slider: unif 5
   //       const slider = Create_slider_control(slider_dim, color, 'UNUSED', rcorners, default_font, );
   //       slider.SetInitialValue(parameters ? parameters[4] : 1.);
   //       contols_buffer.push(slider);

   //       // Connect sliders to gfx program uniforms 
   //       Slider_connect(slider, (params, slider_val) => {

   //          const target_mesh = params.clbk_params.target_mesh;
   //          target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

   //       }, params,
   //       );
   //    } ypos += height;
   //    { // Slider: unif 6
   //       const slider = Create_slider_control(slider_dim, color, 'UNUSED', rcorners, default_font, );
   //       slider.SetInitialValue(parameters ? parameters[5] : 1.);
   //       contols_buffer.push(slider);

   //       // Connect sliders to gfx program uniforms 
   //       Slider_connect(slider, (params, slider_val) => {

   //          const target_mesh = params.clbk_params.target_mesh;
   //          target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

   //       }, params,
   //       );
   //    } ypos += height;

   // }

   return contols_buffer;
}

