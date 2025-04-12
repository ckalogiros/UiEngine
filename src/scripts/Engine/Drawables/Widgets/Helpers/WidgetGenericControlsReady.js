"use strict";

import { Create_rect_mesh, Create_widget_slider } from "./CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../Core/Views/RootView.js";
import { GREY, ORANGE, PURPLE, YELLOW } from "../../Material/Colors.js";
import { Mesh_get_uniform_ubidx_from_name } from "../../Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../Events/EventFunctions.js";
import { Slider_connect } from "../WidgetSlider.js";
import { Vertex_buffer_set_and_update_uniform } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Program_get_uniform_from_name } from "../../../../Graphics/ShaderPrograms.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties, Style_slider_default_properties } from "./WidgetEnableProperties.js";
import { Align_nested_sections_pre } from "../../Operations/AlignNestedSections.js";




export function Controls_create_slider_controls_from_shader_uniform_buffer(target_mesh, controls_size, parameters = null, uniform_name) {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:color, name:name, layout:LAYOUT.VERTICAL, texture_id:texture_id}));
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
      return slider;
   }


   const controls_buffer = [];
   
   

   
   let ypos = 20;
   const height = 45;
   const slider_dim=controls_size, color=YELLOW[4], rcorners=10, default_font=TEXTURES.MTSDF_CONSOLAS_1024;
   
   if (target_mesh.sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function

      const shader_uniforms = Program_get_uniform_from_name(target_mesh.gfx.prog.idx, uniform_name);
      const len = shader_uniforms.shader_variables_unif_names.length;
      for(let i=0; i<len; i++) {
   
         const unif_name = shader_uniforms.shader_variables_unif_names[i].name;
   
         // Slider: unif 1
         const slider = Create_slider_control(slider_dim, color, unif_name, rcorners, default_font, );
         slider.SetInitialValue(parameters ? parameters[i] : 1.);
         controls_buffer.push(slider);
   
         const params = {
            target_mesh: target_mesh,
            uniform_name:uniform_name,
            uniform_idx:i,
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
   if(target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE || target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_GLOW) {
      { // Attr Time
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:PURPLE[6], name:'Time', layout:LAYOUT.VERTICAL, texture_id:default_font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.time);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const emitter = params.clbk_params.emitter;
            emitter.geom.time = slider_val;
            }, { emitter:target_mesh },
         );
      }
      { // Attr generic:a
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:PURPLE[6], name:'Gen:a', layout:LAYOUT.VERTICAL, texture_id:default_font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.a);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const emitter = params.clbk_params.emitter;
            emitter.geom.generic.a = slider_val;
            }, { emitter:target_mesh },
         );
      }
      { // Attr generic:b
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:PURPLE[6], name:'Gen:b', layout:LAYOUT.VERTICAL, texture_id:default_font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.b);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const emitter = params.clbk_params.emitter;
            emitter.geom.generic.b = slider_val;
            }, { emitter:target_mesh },
         );
      }
   }
   
   
   /***********************************************************************************************************************************/
   // Create scale controls
   if(target_mesh.sid.unif & SID.UNIF.U_SCALE_VEC2) {
      const rcorners = 10;
      const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:ORANGE[8], name:'Scale', layout:LAYOUT.VERTICAL, texture_id:default_font}));
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
      controls_buffer.push(slider);
      slider.SetInitialValue(target_mesh.geom.scale[0]);

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {
         const emitter = params.clbk_params.emitter;
         const val_idx = 0;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);
         emitter.geom.scale[0] = slider_val;
         // console.log('---------------------------',emitter.geom.scale[0])
         }, { emitter:target_mesh },
      );
   }

   return controls_buffer;
}

export function Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(target_mesh, controls_size, parameters = null, uniform_name, is_root=false, x=0, y=0) {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:color, name:name, layout:LAYOUT.VERTICAL, texture_id:texture_id}));
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
      return slider;
   }


   const controls_buffer = [];

   
   let ypos = 20;
   const height = 45;
   const slider_dim=controls_size, color=YELLOW[4], rcorners=10, default_font=TEXTURES.MTSDF_CONSOLAS_1024;
   
   /*************************************************************************************************************** */
   // Create Particles Control Panel
   const controls_section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[x, y, 1], col:TRANSPARENCY(GREY[1], .5), name:'Auto-Controls Panel', }));
   Widget_gfx_ready_enable({mesh:controls_section, enable_sdf_rect:rcorners,})
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   

   const shader_uniforms = Program_get_uniform_from_name(target_mesh.gfx.prog.idx, uniform_name);
   const len = shader_uniforms.shader_variables_unif_names.length;
   for(let i=0; i<len; i++) {

      const unif_name = shader_uniforms.shader_variables_unif_names[i].name;

      // Slider: unif 1
      const slider = Create_slider_control(slider_dim, color, unif_name, rcorners, default_font, );
      slider.SetInitialValue(parameters ? parameters[i] : 1.);
      controls_buffer.push(slider);

      const params = {
         target_mesh: target_mesh,
         uniform_name:uniform_name,
         uniform_idx:i,
      };

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {

         const target_mesh = params.clbk_params.target_mesh;
         target_mesh.GfxUniformSetAndUpdate(params.clbk_params.uniform_name, slider_val, params.clbk_params.uniform_idx);

      }, params,
      );
      ypos += height;
   }


   /***********************************************************************************************************************************/
   // Create attribute controls
   if(target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE || target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_GLOW) {
   // if(target_mesh.sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) {
      const rcorners = 10;
      { // Attr Time
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:PURPLE[6], name:'Time', layout:LAYOUT.VERTICAL, texture_id:default_font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.time);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const emitter = params.clbk_params.emitter;
            emitter.geom.time = slider_val;
            }, { emitter:target_mesh },
         );
      }
      { // Attr generic:a
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:PURPLE[6], name:'Gen:a', layout:LAYOUT.VERTICAL, texture_id:default_font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.a);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const emitter = params.clbk_params.emitter;
            emitter.geom.generic.a = slider_val;
            }, { emitter:target_mesh },
         );
      }
      { // Attr generic:b
         const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:PURPLE[6], name:'Gen:b', layout:LAYOUT.VERTICAL, texture_id:default_font}));
         Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
         controls_buffer.push(slider);
         slider.SetInitialValue(target_mesh.geom.generic.b);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {
            const emitter = params.clbk_params.emitter;
            emitter.geom.generic.b = slider_val;
            }, { emitter:target_mesh },
         );
      }
   }


   /***********************************************************************************************************************************/
   // Create scale controls
   if(target_mesh.sid.unif & SID.UNIF.U_SCALE_VEC2) {
      const rcorners = 10;
      const slider = Create_widget_slider(Style_slider_default_properties({dim:slider_dim, col:ORANGE[8], name:'Scale', layout:LAYOUT.VERTICAL, texture_id:default_font}));
      Widget_gfx_ready_enable({mesh:slider, enable_sdf_rect:[rcorners, 5],})
      controls_buffer.push(slider);
      slider.SetInitialValue(target_mesh.geom.scale[0]);

      // Connect sliders to gfx program uniforms 
      Slider_connect(slider, (params, slider_val) => {
         const emitter = params.clbk_params.emitter;
         emitter.geom.scale[0] = slider_val;
         emitter.GfxUniformSetAndUpdate('u_scale2', slider_val, 0);
         }, { emitter:target_mesh },
      );
   }


   // Add all controls to controls panel
   for(let i=0; i<controls_buffer.length; i++) {
      controls_section.AddItem(controls_buffer[i]);
   }

   /****************************************************************************************************************/
   // Render 
   if (is_root & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();

      Align_nested_sections_pre(controls_section);

      controls_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);


      Construct_listen_events_from_mesh_tree(controls_section);
      Construct_listen_events_relations_from_mesh_tree(controls_section);

      controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

      
   }
   
   return controls_section;

}

