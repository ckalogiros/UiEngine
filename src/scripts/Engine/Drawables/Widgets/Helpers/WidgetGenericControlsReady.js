"use strict";

import { Create_rect_mesh, Create_widget_slider } from "./CreateWidgetInterface.js";
import { GREY, ORANGE, PURPLE, YELLOW } from "../../Material/Colors.js";
import { Mesh_get_uniform_ubidx_from_name } from "../../Operations/MeshHelperFunctions.js";
import { Slider_connect } from "../WidgetSlider.js";
import { Vertex_buffer_set_and_update_uniform } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Program_get_uniform_from_name } from "../../../../Graphics/ShaderPrograms.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties, Style_slider_default_properties } from "./WidgetEnableProperties.js";
import { Layout_basic_pre_render } from "../../Operations/AlignNestedSections.js";
import { Mesh_listener_create } from "../../Operations/MeshPropertiesFunctions.js";
import { Color_theme_slider_auto } from "../../Material/Themes.js";
import { Gl_set_generic2, Gl_set_time } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Widget_render } from "./WidgetRender.js";




export function Controls_create_slider_controls_from_shader_uniform_buffer(target_mesh, controls_size, parameters = null, uniform_name=null) {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      const slider = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.09, .8, .18, 0), dim: slider_dim, col: color, name: name, layout: LAYOUT.VERTICAL, texture_id: texture_id }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
      return slider;
   }

   const controls_buffer = [];

   let ypos = 20;
   const height = 45;
   const slider_dim = controls_size, color = YELLOW[4], rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_1024;

   // if (uniform_name && target_mesh.sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function
   if (target_mesh.sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function

      // const shader_uniforms = Program_get_uniform_from_name(target_mesh.gfx.prog.idx, uniform_name);
      const shader_uniforms = Program_get_uniform_from_name(target_mesh.gfx.prog.idx, 'u_generic_controls');
      const len = shader_uniforms.shader_variables_unif_names.length;
      for (let i = 0; i < len; i++) {

         const unif_name = shader_uniforms.shader_variables_unif_names[i].name;

         // Slider: unif 1
         const slider = Create_slider_control(slider_dim, color, unif_name, rcorners, default_font,);
         slider.SetInitialValue(parameters ? parameters[i] : 1.);
         controls_buffer.push(slider);

         const params = {
            target_mesh: target_mesh,
            // uniform_name: uniform_name,
            uniform_name: 'u_generic_controls',
            uniform_idx: i,
            mnemonics: { parameters: parameters, idx: i, },
         };

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate(params.clbk_params.uniform_name, slider_val, params.clbk_params.uniform_idx);

            // IMPORTANT: This is where we create 'memory' of a parameter. The 'parameters' is passed by refference(it is an array), so we update it's original value.
            if (params.clbk_params.mnemonics.parameters)
               params.clbk_params.mnemonics.parameters[params.clbk_params.mnemonics.idx] = slider_val;

         }, params,
         );
         ypos += height;
      }
   }


   /***********************************************************************************************************************************/
   // Create attribute controls
   const slider_theme = Color_theme_slider_auto(.29, .8, .18, 0);
   if (target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) {
      { // Attr Time
         const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: PURPLE[6], name: 'Time', layout: LAYOUT.VERTICAL, texture_id: default_font }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.time);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.geom.time = slider_val;
            Gl_set_time(target_mesh.gfx, target_mesh.geom.time, target_mesh.geom.num_faces);
         }, { target_mesh: target_mesh },
         );
      }
      { // Attr generic:a
         const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: PURPLE[6], name: 'Gen:a', layout: LAYOUT.VERTICAL, texture_id: default_font }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.a);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.geom.generic.a = slider_val;
            Gl_set_generic2(target_mesh.gfx, target_mesh.geom, target_mesh.geom.num_faces);
         }, { target_mesh: target_mesh },
         );
      }
      { // Attr generic:b
         const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: PURPLE[6], name: 'Gen:b', layout: LAYOUT.VERTICAL, texture_id: default_font }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.b);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.geom.generic.b = slider_val;
            Gl_set_generic2(target_mesh.gfx, target_mesh.geom, target_mesh.geom.num_faces);
         }, { target_mesh: target_mesh },
         );
      }
   }


   /***********************************************************************************************************************************/
   // Create scale controls
   if (target_mesh.sid.unif & SID.UNIF.U_SCALE_VEC2) {
      const rcorners = 10;
      const slider = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.0, .8, .18, 0), dim: slider_dim, col: ORANGE[8], name: 'Scale', layout: LAYOUT.VERTICAL, texture_id: default_font }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
      controls_buffer.push(slider);
      slider.SetInitialValue(target_mesh.geom.scale[0]);

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {
         const target_mesh = params.clbk_params.target_mesh;
         const val_idx = 0;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(target_mesh.uniforms, 'u_scale2');
         Vertex_buffer_set_and_update_uniform(target_mesh.gfx.vb.groupidx, ubidx, slider_val, val_idx);
         target_mesh.geom.scale[0] = slider_val;


      }, { target_mesh: target_mesh },
      );
   }

   return controls_buffer;
}

export function Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(target_mesh, controls_size, parameters = null, uniform_name=null, is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0) {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      const slider = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.09, .8, .18, 0), dim: slider_dim, col: color, name: name, layout: LAYOUT.VERTICAL, texture_id: texture_id }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
      return slider;
   }


   const controls_buffer = [];


   let ypos = 20;
   const height = 45;
   const slider_dim = controls_size, color = YELLOW[4], rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_1024;

   /*************************************************************************************************************** */
   // Create Particles Control Panel
   const controls_section = Create_rect_mesh(Style_rect_default_properties({ is_root: is_root, pad: [10, 10], pos: [x, y, 1], col: TRANSPARENCY(GREY[1], .5), name: 'Auto-Controls Panel', layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF }));
   Widget_gfx_ready_enable({ mesh: controls_section, enable_sdf_rect: rcorners, })
   Mesh_listener_create(controls_section, LISTEN_EVENT_TYPES.MOVE);


   if (uniform_name && target_mesh.sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function

      const shader_uniforms = Program_get_uniform_from_name(target_mesh.gfx.prog.idx, uniform_name);
      const len = shader_uniforms.shader_variables_unif_names.length;
      for (let i = 0; i < len; i++) {

         const unif_name = shader_uniforms.shader_variables_unif_names[i].name;

         // Slider: unif 1
         const slider = Create_slider_control(slider_dim, color, unif_name, rcorners, default_font,);
         slider.SetInitialValue(parameters ? parameters[i] : 1.);
         controls_buffer.push(slider);

         const params = {
            target_mesh: target_mesh,
            uniform_name: uniform_name,
            uniform_idx: i,
         };

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate(params.clbk_params.uniform_name, slider_val, params.clbk_params.uniform_idx);

         }, params,
         );
         ypos += height;
      }
   }


   /***********************************************************************************************************************************/
   // Create attribute controls
   const slider_theme = Color_theme_slider_auto(.29, .8, .18, 0);
   if (target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) {
      // if(target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) {
      const rcorners = 10;
      { // Attr Time
         const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: PURPLE[6], name: 'Time', layout: LAYOUT.VERTICAL, texture_id: default_font }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.time);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.geom.time = slider_val;
            Gl_set_time(target_mesh.gfx, target_mesh.geom.time, target_mesh.geom.num_faces);
         }, { target_mesh: target_mesh },
         );
      }
      { // Attr generic:a
         const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: PURPLE[6], name: 'Gen:a', layout: LAYOUT.VERTICAL, texture_id: default_font }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.a);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.geom.generic.a = slider_val;
            Gl_set_generic2(target_mesh.gfx, target_mesh.geom, target_mesh.geom.num_faces);
         }, { target_mesh: target_mesh },
         );
      }
      { // Attr generic:b
         const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: PURPLE[6], name: 'Gen:b', layout: LAYOUT.VERTICAL, texture_id: default_font }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.b);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.geom.generic.b = slider_val;
            Gl_set_generic2(target_mesh.gfx, target_mesh.geom, target_mesh.geom.num_faces);
         }, { target_mesh: target_mesh },
         );
      }
   }
   if (target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_GLOW) {
      const rcorners = 10;
      { // Attr Time
         const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: PURPLE[6], name: 'Time', layout: LAYOUT.VERTICAL, texture_id: default_font }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.time);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.geom.time = slider_val;
            Gl_set_time(target_mesh.gfx, target_mesh.geom.time, target_mesh.geom.num_faces);
         }, { target_mesh: target_mesh },
         );
      }
   }


   /***********************************************************************************************************************************/
   // Create scale controls
   if (target_mesh.sid.unif & SID.UNIF.U_SCALE_VEC2) {
      const rcorners = 10;
      const slider = Create_widget_slider(Style_slider_default_properties({ theme: slider_theme, dim: slider_dim, col: ORANGE[8], name: 'Scale', layout: LAYOUT.VERTICAL, texture_id: default_font }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
      controls_buffer.push(slider);
      slider.SetInitialValue(target_mesh.geom.scale[0]);

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {
         const target_mesh = params.clbk_params.target_mesh;
         target_mesh.geom.scale[0] = slider_val;
         target_mesh.GfxUniformSetAndUpdate('u_scale2', slider_val, 0);
      }, { target_mesh: target_mesh },
      );
   }


   // Add all controls to controls panel
   for (let i = 0; i < controls_buffer.length; i++) {
      controls_section.AddItem(controls_buffer[i]);
   }

   /****************************************************************************************************************/
   // Render 
   if (is_root & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      // // controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();
      Layout_basic_pre_render(controls_section);
      Widget_render(controls_section);

   }

   return controls_section;

}

