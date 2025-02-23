"use strict";

import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Widget_ready_slider } from "./ReadyWidgets.js";




export function Contols_generic_uniforms_buffer(target_mesh, controls_size, parameters = null) {


   const contols_buffer = [];


   const params = {
      target_mesh: target_mesh,
   };

   let ypos = 20;
   const height = 45;

   {
      { // Slider: unif 1
         const slider_initial_val = parameters[0]!==_ ? parameters[0] : 1.;
         const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
         contols_buffer.push(slider);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);

         }, params,
         );
      } ypos += height;
      { // Slider: unif 2
         const slider_initial_val = parameters[1]!==_ ? parameters[1] : 1.;
         const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
         contols_buffer.push(slider);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

         }, params,
         );
      } ypos += height;
      { // Slider: unif 3
         const slider_initial_val = parameters[2]!==_ ? parameters[2] : 1.;
         const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
         contols_buffer.push(slider);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

         }, params,
         );
      } ypos += height;
      { // Slider: unif 4
         const slider_initial_val = parameters[3]!==_ ? parameters[3] : 1.;
         const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
         contols_buffer.push(slider);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

         }, params,
         );
      } ypos += height;
      { // Slider: unif 5
         const slider_initial_val = parameters[4]!==_ ? parameters[4] : 1.;
         const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
         contols_buffer.push(slider);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

         }, params,
         );
      } ypos += height;
      { // Slider: unif 6
         const slider_initial_val = parameters[5]!==_ ? parameters[5] : 1.;
         const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
         contols_buffer.push(slider);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

         }, params,
         );
      } ypos += height;
      // { // Slider: unif 7
      //    const slider_initial_val = .5;
      //    const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
      //    contols_buffer.push(slider);

      //    // Connect sliders to gfx program uniforms 
      //    Slider_connect(slider, (params, slider_val) => {

      //       const target_mesh = params.clbk_params.target_mesh;
      //       target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 6);

      //    }, params,
      //    );
      // } ypos += height;
      // { // Slider: unif 8
      //    const slider_initial_val = .5;
      //    const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'UNUSED', controls_size);
      //    contols_buffer.push(slider);

      //    // Connect sliders to gfx program uniforms 
      //    Slider_connect(slider, (params, slider_val) => {

      //       const target_mesh = params.clbk_params.target_mesh;
      //       target_mesh.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 7);

      //    }, params,
      //    );
      // } ypos += height;
   }

   return contols_buffer;
}

