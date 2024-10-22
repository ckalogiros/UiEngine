"use strict";



import { Callback_animations_create } from '../../Engine/Animations/CallbackAnimations.js';
import { Mesh_animations_create } from '../../Engine/Animations/MeshAnimations.js';
import { Create_rect_mesh, Create_widget_button, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_scroller, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from '../../Engine/Core/CreateWidget.js';
import { Mesh_buffer_get_mesh_byidx } from '../../Engine/Core/MeshBuffer.js';
import { View_build_group_from_root_mesh } from '../../Engine/Core/Views/MeshBufferViews.js';
import { Mesh_unif_add_vb_root_wposx, Mesh_unif_add_vb_root_wposy, Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos, Mesh_unif_get_vb_root_wposx, Mesh_unif_get_vb_root_wposy } from '../../Engine/Core/MeshUniformsBuffer.js';
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_set_render_queue_priority } from '../../Engine/Core/Views/RootView.js';
import { BLACK, BLUEL, GREEN, GREENL, GREY, Interpolate_rgb_to_01, ORANGE, ORANGEL, ORANGER, PURPLEB, PURPLER, RED, REDL, WHITE, YELLOW, YELLOWL, YELLOWR } from '../../Engine/Drawables/Material/Base/Colors.js';
import { Mesh_get_uniform_ubidx_from_name } from '../../Engine/Drawables/Operations/MeshHelperFunctions.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../../Engine/Drawables/Operations/Recursions.js';
import { Components_create_scroller_component, Scoller_component_gengfx_and_render } from '../../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Dropdown_roots_set_root } from '../../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Slider_connect, Slider_get_slider_val } from '../../Engine/Drawables/Widgets/WidgetSlider.js';
import { Switch_simple_time_interval_callback } from '../../Engine/Drawables/Widgets/WidgetSwitch.js';
import { Listeners_set_priority } from '../../Engine/Events/EventListeners.js';
import { Particle_system_create_emitter, Particle_system_emitt, Particles_get_particle_system, Particles_gen_gfx_ctx } from '../../Engine/ParticlesSystem/ParticlesSystem.js';
import { Renderqueue_set_priority_by_vb } from '../../Engine/Renderers/Renderer/RenderQueue.js';
import { Time_intervals_create } from '../../Engine/Timers/TimeIntervals.js';
import { TimerGetGlobalTimerCycle } from '../../Engine/Timers/Timers.js';
import { Vertex_buffer_group_create_scissorbox, Vertex_buffer_set_and_update_uniform } from '../../Graphics/Buffers/VertexBuffers.js';
import { Gl_set_rgba } from '../../Graphics/Buffers/VertexBuffersOps.js';
import { GetRandomPos, GetSequencedColor } from '../../Helpers/Helpers.js';
import { CopyArr4 } from '../../Helpers/Math/MathOperations.js';
import { Demo_widgets_colorpicker } from './DemoWidgets.js';












/*********************************************************************************************************************************************************************************************/
/** Glow Particles
 * Uppon calling 'Create_glow_particles()', an emitter is created along with the switch to enable it
 * and a switch for the colorpicker to change the particles color. 
 * There is a choise of creating the controls to manipulate all other kinds of variables of the particles system,
 * or use the next function 'Create_glow_particles_controls()', to create the controls seperately
 * and combine them at the call in any way.
 */
/*********************************************************************************************************************************************************************************************/


export function Create_glow_particles(x = 0, y = 0, root_widget = 0x0, controls_create = true) { // 3 control Sliders 

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }
   const scale_down = .2;
   const particles_size = 140;




   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   const emitter1_idx = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [particles_size, particles_size], .6, 1, 4, .98, .1, 4);
   const emitter = Particles_get_particle_system(emitter1_idx);
   emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;

   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
   
   emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   emitter.EnableGfxUniforms({ fx: SID.FX.FS_GLOW_VEC3, }, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

   emitter.SetConeOfDirection(1, 1, .2, -.2);



   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], BLACK, 'Emitter Window Panel', [0, 10, 2],);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   Particles_gen_gfx_ctx(emitter, controls_section);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformSetAndUpdate('u_glow_params', [.2, 1., .1]);



   
   const zpos = -1

   { // Create emitt panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10,10], [x, y, zpos + 1], [0, 0], YELLOWL[4], 'glow_emitter_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);
      
      // Create label
      const label = Create_widget_label(_, 'Emitt', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, YELLOWR[8], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.AddItem(label);
      
      const emitt_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, YELLOWR[8], _);
      emitt_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      emitt_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 18);
      emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      emitt_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      emitt_switch.SetName('glow_emitter_switch');
      panel.AddItem(emitt_switch);
      
      const evt_params = { target_params: [emitter.idx] };
      emitt_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
      emitt_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   }
   { // Create color picker panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10,10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);
   
      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, PURPLEB[6], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, PURPLEB[6], _);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);
      
      colorpicker_switch.Bind(
         (params) => {
   
            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
             */
            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;

            const x = 0;
            const y = VIEWPORT.HEIGHT - 300;
   
   
            if (isOn) {
   
               const transparency = params.params.mnemonics.transparency;
               const hue = params.params.mnemonics.hue;
               const color = params.params.mnemonics.color;

               const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, x, y, 300, 300, );
               // colorpicker.SetTransparencySliderSetInitialValue(transparency)
               colorpicker.SetTransparencySliderSetInitialValue(transparency);
               colorpicker.SetHueSliderSetInitialValue(hue);

               colorpicker.AssignTargetMeshClbk((col, params) => {
                  const color = col;
                  CopyArr4(emitter.mat.col, color);
                  params.mnemonics.color = color;
               }, params.params);
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {
   
               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, {mnemonics:{transparency:0.5, hue:0.5, color:null},}, _,
      );
   
      panel.Calc_no_gfx_update();
   }



   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const controls_buffer = Create_glow_particles_controls(emitter, scale_down, YELLOWL[3]);
      
      const len = controls_buffer.length;
      for(let i=0; i<len; i++){
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }





   /****************************************************************************************************************/
   // Render 
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();
      // controls_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
      controls_section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.Calc_no_gfx_update();

      controls_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);

      controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(controls_section);
      Construct_listen_events_relations_from_mesh_tree(controls_section);

   }

   return {
      emitter:emitter,
      controls_section:controls_section,
   };

}

/** For rendering the slider controls seperately from the glow particles */
export function Create_glow_particles_controls(emitter, scale_down, color = GREY[2], parameters=null) {
   
   const contols_buffer = [];


   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }


   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles
   {

      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      const slider_feather = 2;
      const slider_rcorners = 10;

      { // SHADER UNIFORMS: Distance
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Distance');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[0]:.36);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // SHADER UNIFORMS: Brightness
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Brighter');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[1]:1.);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 1;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // SHADER UNIFORMS: Intensity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Intensity');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[2]:.12);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 2;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // SHADER UNIFORMS: Particle Scale
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Particle Scale');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[3]:scale_down);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Gravity');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[4]:.48);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            // Linear Interpolation
            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitter.gravity = y;
         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[4] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Acceleration');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[5]:.59);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            emitter.accel = slider_val;

            // Linear Interpolation
            const max = 15, start = 0;
            const y = (slider_val * max) + start;
            emitter.accel = y;
            emitter.max_speed = 4;
         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[5] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Deccelerarion
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Deccelerarion');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[6]:.19);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            let y = 0;
            y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitter.deccel = y;

         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[6] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Set Emitter X Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Emitter Position X');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[7]:.08);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const y = slider_val * VIEWPORT.WIDTH;
            emitter.pos[0] = y;
         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[7] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Emitter Position Y');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[8]:.40);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const y = slider_val * VIEWPORT.HEIGHT;
            emitter.pos[1] = y;
         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[8] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Set Emitter Y Direction Y Up
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Direction Y Up ');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[9]:.05);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const max = -1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_neg = y;
            console.log(slider_val, y)
         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[9] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Set Emitter Y Direction Y Down
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Direction Y Down');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[10]:.05);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const max = 1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_pos = y;
            console.log(slider_val, y)
         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[10] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Set Emitter Direction X Left
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Direction X Left');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[11]:.55);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitter.variation_emission.xdir_pos = y;
            emitter.variation_emission.xdir_neg = y;
         
            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[11] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }

   }

   return contols_buffer;
}

/*********************************************************************************************************************************************************************************************/



















/*********************************************************************************************************************************************************************************************/
/** Ball Tail Particles
 * Uppon calling 'Create_comet_particles()', an emitter is created along with the switch to enable it
 * and a switch for the colorpicker to change the particles color. 
 * There is a choise of creating the controls to manipulate all other kinds of variables of the particles system,
 * or use the next two functions 'Create_comet_noise_contols()' and 'Create_comet_glow_contols()', 
 * to create the controls seperately and combine them at the call in any way.
 */
/*********************************************************************************************************************************************************************************************/


/**
 * // TODO: I think the for loop to initialize the u_noise_params its unecessary if the vertex buffer is the same for all balls
 */
export function Create_comet_particles(x = 0, y = 0, width = VIEWPORT.WIDTH / 2 - 10, height = VIEWPORT.HEIGHT / 2 - 150, num_balls = 1, root_widget = ROOT_WIDGETS.CREATE_ROOT, controls_create_but_not_render = true) { // Particles Bouncing Ball Tail

   let balls_buffer = [];
   let dirs_buffer = [];
   let noise_particles_buffer = [];
   let glow_particles_buffer = [];

   const glow_size = 20;
   const scale_down = .22;

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }


   const particles_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x, y, 0], [width, height], TRANSPARENCY(GREY[1], 1.), 'Particles Bouncing Ball Tail',)
   particles_panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   particles_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   particles_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 20);



   let swap_dir = 1; // Create direction variation in case of rendering many balls 
   for (let i = 0; i < num_balls; i++) {

      /****************************************************************************************************************/
      // Balltail particles
      const dim = [30, 30]
      const pos = GetRandomPos([0, 0], [particles_panel.geom.dim[0], particles_panel.geom.dim[1]])

      const ball = Create_rect_mesh(_, [pos[0], pos[1], 2], dim, WHITE, 'Ball', [0, dim[0], 2]);
      ball.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      ball.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ball.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      ball.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, dim[0]);
      particles_panel.AddItem(ball);

      balls_buffer[i] = ball

      // const color = GetSequencedColor()
      const color = YELLOWR[9];
      // const color = ORANGER[9];

      const scale = 2.;
      const particles_size = dim[1] * scale;
      const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles ${i}`, color, [0, 0, 1], [particles_size, particles_size], 2, 2, _, _, _, 4);
      const tail_emitter = Particles_get_particle_system(tail_emitter_idx);



      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);


      tail_emitter.EnableGfxUniforms({ fx: SID.FX.FS_NOISE, }, 'u_noise_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);








      /****************************************************************************************************************/
      // Secondary particles

      const glow_emitter_idx = Particle_system_create_emitter('Glow Particles', TRANSPARENCY(color, .5), [0, 0, 3], [glow_size, glow_size], 1, 1., 2, .989, 0, 2);
      const glow_emitter = Particles_get_particle_system(glow_emitter_idx);
      glow_emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;

      glow_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW);
      glow_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, glow_size);
      glow_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      glow_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      glow_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);

      glow_emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      glow_emitter.EnableGfxUniforms({ fx: SID.FX.FS_GLOW_VEC3, }, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);



      glow_emitter.SetDir(-1, -1);
      const amt = .05;
      glow_emitter.SetConeOfDirection(-amt, amt, amt, -amt);
      glow_particles_buffer[i] = glow_emitter;



      tail_emitter.SetDir(1, 1 * swap_dir);


      noise_particles_buffer[i] = tail_emitter;
      dirs_buffer[i] = [1, 1 * swap_dir]

      swap_dir *= -1;


   }








   /****************************************************************************************************************/
   // Render 

   particles_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, particles_panel.mesh_bufferidx, true);
   particles_panel.GenGfxCtx();

   particles_panel.Render();
   Root_group_activate_all_vbs_in_renderqueue(particles_panel.root_bufferidx);

   particles_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, particles_panel.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(particles_panel);
   Construct_listen_events_relations_from_mesh_tree(particles_panel);




   // IMPORTANT: Generate particles gfx after the generation of any parent mesh, so that the particles system unif_wpos has a parent root_posidx
   for (let i = 0; i < num_balls; i++) {

      const glow_emitter = glow_particles_buffer[i];
      Particles_gen_gfx_ctx(glow_emitter, particles_panel);
      // Initialize values to uniforms
      glow_emitter.GfxUniformSetAndUpdate('u_scale2', [.1, 1]);
      glow_emitter.GfxUniformSetAndUpdate('u_glow_params', [.3, 1, .2]);


      // Render Ball tail particles on top of the glow particles
      const tail_emitter = noise_particles_buffer[i];
      Particles_gen_gfx_ctx(tail_emitter, particles_panel);
      // Initialize values to uniforms
      tail_emitter.GfxUniformSetAndUpdate('u_noise_params', [1, 0, .12]);

   }


   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], BLACK, 'Emitter Window Panel', [0, 10, 2],);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   const zpos = -1

   { // Create color picker panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10,10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);
   
      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, PURPLEB[6], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, PURPLEB[6], _);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);
      
      const cp_params = {
         noise_particles_buffer:noise_particles_buffer,
         glow_particles_buffer:glow_particles_buffer,
         mnemonics:{transparency:0.5, hue:0.5, color:null},
      };
      colorpicker_switch.Bind(
         (params) => {
   
            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
             */
            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;

            const x = 0;
            const y = VIEWPORT.HEIGHT - 300;
   
   
            if (isOn) {
   
               const transparency = params.params.mnemonics.transparency;
               const hue = params.params.mnemonics.hue;
               const color = params.params.mnemonics.color;

               const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, x, y, 300, 300, );
               colorpicker.SetTransparencySliderSetInitialValue(transparency);
               colorpicker.SetHueSliderSetInitialValue(hue);

               colorpicker.AssignTargetMeshClbk((col, params) => {

                  const noise_particles_buffer = params.noise_particles_buffer;
                  const glow_particles_buffer = params.glow_particles_buffer;
                  const color = col;
                  
                  const len = noise_particles_buffer.length;
                  for(let i=0; i<len; i++){

                     const tail_emitter = noise_particles_buffer[i];
                     const glow_emitter = glow_particles_buffer[i];
                     
                     CopyArr4(tail_emitter.mat.col, color);
                     CopyArr4(glow_emitter.mat.col, color);
                  }
                  // TODO: store all the colorpicker params in mnemonics
                  // params.mnemonics.color = color;
               }, params.params);
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {
   
               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, cp_params, _,
      );
   
      panel.Calc_no_gfx_update();
   }






   if (controls_create_but_not_render) { // Create slider controls only if this is to be rendered from this function


      /****************************************************************************************************************/
      // Tail Particle System: Contol Sliders 

      const comet_contols_buffer = Create_comet_noise_contols(noise_particles_buffer, YELLOWL[2], _);
      const len = comet_contols_buffer.length;
      for(let i=0; i<len; i++){
         const ctrl = comet_contols_buffer[i];
         controls_section.AddItem(ctrl);
      }





      /****************************************************************************************************************/
      // Glow Particle System: Contol Sliders 
      
      const glow_contols_buffer = Create_comet_glow_contols(glow_particles_buffer, YELLOWL[2], _);
      const glow_len = glow_contols_buffer.length;
      for(let i=0; i<glow_len; i++){
         const ctrl = glow_contols_buffer[i];
         controls_section.AddItem(ctrl);
      }


   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function



      /****************************************************************************************************************/
      // Render 
      
      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();
      // controls_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC);
      controls_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
      controls_section.Calc_no_gfx_update();

      controls_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);

      controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(controls_section);
      Construct_listen_events_relations_from_mesh_tree(controls_section);

   }




   const params = {
      particles_panel: particles_panel,
      ball: balls_buffer,
      dir: dirs_buffer,
      noise_particles_buffer: noise_particles_buffer,
      glow_particles: glow_particles_buffer,
   }

   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_comet, params);


   return {
      particles_panel: particles_panel,
      controls_section:controls_section,
      noise_particles_buffer: noise_particles_buffer,
      glow_particles_buffer: glow_particles_buffer,
   };
   
}

/** For rendering the slider controls seperately from the ball tail particles */
export function Create_comet_noise_contols(noise_particles_buffer, color = GREY[2], parameters=null, ) {


   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }


   const contols_buffer = [];


   /****************************************************************************************************************/
   // Tail Particle System: Contol Sliders 
   const particles_buffer = noise_particles_buffer;
   const particles_buffer_len = noise_particles_buffer.length;

   const slider_feather = 2;
   const slider_rcorners = 10;


   for (let i = 0; i < particles_buffer_len; i++) {

      const emitter = particles_buffer[i];

      { // Slider 1 contol
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Speed');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.SetInitialValue(parameters?parameters[0]:0);
         contols_buffer.push(slider);


         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


         Slider_connect(slider, (params, slider_val) => {

            let min = .8; // The min value gives the prolonged emitter
            let max = 1.; // Calculate that the max value will be +1+min
            const rev_slider_val = 1 - slider_val;
            emitter.t_step = rev_slider_val + min + ((max - slider_val) * (rev_slider_val));
            emitter.speed = (slider_val + 1) * 3;

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );

      }
      { // Slider 2 contol
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Intensity');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.SetInitialValue(parameters?parameters[1]:0);
         slider.SetName('Intensity');
         contols_buffer.push(slider);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 1;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );

      }
      { // Slider 3 contol
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Fire Variation');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.SetInitialValue(parameters?parameters[2]:0);
         slider.SetName('Fire Variation');
         contols_buffer.push(slider);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      { // Slider 4 contol: Uniform value in fragment shader
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Noise Complexity');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.SetInitialValue(parameters?parameters[3]:.12);
         slider.SetName('Noise Complexity');
         contols_buffer.push(slider);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 2;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
      // { // SHADER UNIFORMS: Particle Scale
      //    const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Particle Scale');
      //    slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      //    slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
      //    contols_buffer.push(slider);
      //    slider.SetInitialValue(scale_down);

      //    slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      //    for (let i = 0; i < tail_buffer_len; i++) {
      //       const glow_emitter = glow_particles_buffer[i];

      //       Slider_connect(slider, (params, slider_val) => {

      //          const val_idx = 0;
      //          // Find the ubidx
      //          const ubidx = Mesh_get_uniform_ubidx_from_name(glow_emitter.uniforms, 'u_scale2');
      //          Vertex_buffer_set_and_update_uniform(glow_emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      //       }, _);
      //    }
      // }
   }


   return contols_buffer;
}
/** For rendering the slider controls seperately from the ball tail particles */
export function Create_comet_glow_contols(glow_particles_buffer, color = GREY[2], parameters=null, scale_down=.2) {


   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }


   const contols_buffer = [];


   /****************************************************************************************************************/
   // Glow Particle System: Contol Sliders 
   const particles_buffer = glow_particles_buffer;
   const particles_buffer_len = glow_particles_buffer.length;


   // Glow Particle System: Contol Sliders 
   for (let i = 0; i < particles_buffer_len; i++) {

      const emitter = particles_buffer[i]

      const slider_feather = 2;
      const slider_rcorners = 10;

      { // SHADER UNIFORMS: Particle Glow Distance
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Distance');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[0]:0);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );

      }
      { // SHADER UNIFORMS: Particle Glow Brightness
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Brighter');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[1]:1);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 1;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );

      }
      { // SHADER UNIFORMS: Particle Glow Intensity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Intensity');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[2]:.03);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 2;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );

      }
      { // SHADER UNIFORMS: Particle Scale
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Particle Scale');
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         contols_buffer.push(slider);
         slider.SetInitialValue(parameters?parameters[3]:scale_down);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if(params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

            }, { mnemonics:{parameters:parameters}, },
         );
      }
   }



   return contols_buffer;
}





/****************************************************************************************************************/
// Create the ball's animation callback
function Animate_comet(params) {


   const particles_panel = params.params.particles_panel;


   const top_bound = 0;
   const bot_bound = particles_panel.geom.dim[1] * 2;
   const left_bound = 0;
   const right_bound = particles_panel.geom.dim[0] * 2;

   const len = params.params.ball.length;
   for (let i = 0; i < len; i++) {

      const ball = params.params.ball[i];
      const tail_emitter = params.params.noise_particles_buffer[i];
      const tail_emitter_idx = tail_emitter.idx;
      const dir = params.params.dir[i];

      // Secondary Particles
      const glow_particles = params.params.glow_particles[i];


      // Move the ball
      const variation = TimerGetGlobalTimerCycle() * .3 + .5;
      const x = 1 * dir[0] * tail_emitter.speed * variation;
      const y = 1 * dir[1] * tail_emitter.speed * .5;

      ball.geom.AddWposXY(ball.gfx, x, y);
      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;

      const pos = [ball.geom.pos[0], ball.geom.pos[1]];
      tail_emitter.pos[0] = pos[0] + ball.geom.dim[0] - tail_emitter.dim[0];
      tail_emitter.pos[1] = pos[1] + ball.geom.dim[1] - tail_emitter.dim[1];


      // Check boundaries
      const ball_top = ball.geom.pos[1] + y;
      const ball_bot = ball.geom.pos[1] + ball.geom.dim[1] * 2 + y;
      const ball_left = ball.geom.pos[0] + x;
      const ball_right = ball.geom.pos[0] + ball.geom.dim[0] * 2 + x;



      if (ball_bot > bot_bound) {
         dir[1] *= -1;
         tail_emitter.SetDir(0, dir[1])
         glow_particles.dir[1] = 1;
      }
      else if (ball_top < top_bound) {
         dir[1] *= -1;
         tail_emitter.SetDir(0, dir[1])
         glow_particles.dir[1] = -1;
      }
      if (ball_right > right_bound) {
         dir[0] *= -1;
         tail_emitter.SetDir(dir[0], 0)
         glow_particles.dir[0] = 1;
      }
      else if (ball_left < left_bound) {
         dir[0] *= -1;
         tail_emitter.SetDir(dir[0], 0)
         glow_particles.dir[0] = -1;
      }



      const particles_params = {
         params: {
            target_params: [tail_emitter_idx],
         }
      }
      Particle_system_emitt(particles_params);
      /*********************************************************************************************************/
      // Secondary Particles
      glow_particles.pos[0] = pos[0] + ball.geom.dim[0] - glow_particles.dim[0];
      glow_particles.pos[1] = pos[1] + ball.geom.dim[0] - glow_particles.dim[1];

      Particle_system_emitt({ params: { target_params: [glow_particles.idx], } });
   }

}
/*********************************************************************************************************************************************************************************************/



















/*********************************************************************************************************************************************************************************************/
/** Smoke Particles - Textured
 */
/*********************************************************************************************************************************************************************************************/

export function Create_smoke_particles(x = 0, y = 0, root_widget=ROOT_WIDGETS.CREATE_ROOT, controls_create=true) {

   /**
    * // TODO: The "u_smoke_params" is one float instead of vec3 that we are passing 
    */

   const emitters = [];
   const emitter_idxs = [];
   const speed = 10;
   let cnt = 0;
   // const dim = [150*DEVICE.device_scale, 150*DEVICE.device_scale];
   const dim = [40, 40];


   // Create Particle emitters
   // Emitter 1
   // const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', YELLOWR[9], [-90, y + 530, 0], dim, 1.5, 1, 2, .98, -.1, 3, TEXTURES.SMOKE_1);
   const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', YELLOWR[9], [x, y, 0], dim, 1.5, 1, 2, .98, -.1, 3, TEXTURES.SMOKE_1);
   const emitter = Particles_get_particle_system(emitter_idx);
   emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
   emitter.speed = speed;

   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TEX2);

   Particles_gen_gfx_ctx(emitter);

   emitter.SetConeOfDirection(1, 1, -.1, .2);

   emitters[cnt] = emitter;
   emitter_idxs[cnt] = emitter_idx;
   cnt++










   /*************************************************************************************************************** */
   // Create Particles Control Panel

   const slider_dim = [120, 10];

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }


   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], GREY[1], 'SliderSection', [0, 10, 2],);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   controls_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);







   /*************************************************************************************************************** */
   // Create Emitter switch and colorpicker switch

   const zpos = -1

   { // Create emitt panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10,10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'glow_emitter_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);
      
      // Create label
      const label = Create_widget_label(_, 'Emitt', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, YELLOWR[8], WHITE, [5, 5], _, _, _, _);
      // const label = Create_widget_label(_, 'Emitt', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, ORANGER[8], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.AddItem(label);
      
      const emitt_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, YELLOWR[8], _);
      emitt_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      emitt_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      emitt_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      emitt_switch.SetName('glow_emitter_switch');
      panel.AddItem(emitt_switch);
      
      const evt_params = { target_params: [emitter_idxs[0]] };
      emitt_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
      emitt_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   }
   { // Create color picker panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10,10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);
   
      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, PURPLEB[6], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, PURPLEB[6], _);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);
      
      colorpicker_switch.Bind(
         (params) => {
   
            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
             */
            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;

            const x = 0;
            const y = VIEWPORT.HEIGHT - 300;
   
   
            if (isOn) {
   
               const transparency = params.params.mnemonics.transparency;
               const hue = params.params.mnemonics.hue;
               const color = params.params.mnemonics.color;

               const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, x, y, 300, 300, );
               // colorpicker.SetTransparencySliderSetInitialValue(transparency)
               colorpicker.SetTransparencySliderSetInitialValue(transparency);
               colorpicker.SetHueSliderSetInitialValue(hue);

               colorpicker.AssignTargetMeshClbk((col, params) => {
                  const color = col;
                  CopyArr4(emitters[0].mat.col, color);
                  params.mnemonics.color = color;
               }, params.params);
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {
   
               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, {mnemonics:{transparency:0.5, hue:0.5, color:null},}, _,
      );
   
      panel.Calc_no_gfx_update();
   }







   /****************************************************************************************************************/
   // Create slider contols
   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const controls_buffer = Create_smoke_particles_controls(emitters[0], YELLOWL[3]);
      
      const len = controls_buffer.length;
      for(let i=0; i<len; i++){
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }







   /****************************************************************************************************************/
   // Render 
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();
      controls_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
      controls_section.Calc_no_gfx_update();
      controls_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);
   
   
      Construct_listen_events_from_mesh_tree(controls_section);
      Construct_listen_events_relations_from_mesh_tree(controls_section);

      controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

   }

   return {
      emitter:emitter,
      controls_section:controls_section,
   };
}


/** For rendering the slider controls seperately from the smoke particles */
export function Create_smoke_particles_controls(emitter, color = GREY[2]) {
   
   const contols_buffer = [];

   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
   const slider_col = color;


   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }


   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles
   
   /**   NICE EFFECT2: Distance:{.25}, Brighter:{1}, Intensity:{.61}, Intensity:{33}, Gravity:{.48}, Acceleration:{.59}, Decceleration:{19}, DirectionX:{64} 
    *    NICE EFFECT: Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22} 
    *    color:{R:.2, G:.0, B:.8, A:.68, }
    */
   const slider_feather = 2;
   const slider_rcorners = 6;

   
   // Contols for shader params
   if (emitter.sid.unif & SID.UNIF.SCALE2) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Scale');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(.71);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 0;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, _);
   }
   if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Noise UV Coord');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(.71);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 0;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, _);
   }
   if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Cone Wideness');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(.78);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 1;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, _);
   }
   if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Complexity');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push.AddToMenu(slider);
      slider.SetInitialValue(.50);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 2;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, _);
   }

   // Contols for tarnsform and physics
   { // Gravity
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(.48);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      Slider_connect(slider, (params, slider_val) => {

         // Linear Interpolation
         const max = 1, start = -.5;
         const y = (slider_val * max) + start;
         emitter.gravity = y;
         // emitter[1].gravity = y;
      }, _);
   }
   { // Acceleration
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(.08);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      Slider_connect(slider, (params, slider_val) => {

         emitter.accel = slider_val;

         // Linear Interpolation
         const max = 15, start = 0;
         const y = (slider_val * max) + start;
         emitter.accel = y;
         emitter.max_speed = 4;
         // emitter[1].accel = y;
         // emitter[1].max_speed = 4;
      }, _);
   }
   { // Deccelerarion
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Deccelerarion');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(.48);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      Slider_connect(slider, (params, slider_val) => {

         /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
         const h = 1, k = -2.8, r = 3.8 * 3.8;
         const x = slider_val;
         let y = 0;
         y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
         emitter.deccel = y;

      }, _);
   }
   { // Set Emitter X Position
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position X');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(0);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         emitter.pos[0] = slider_val * VIEWPORT.WIDTH;
         // emitter[1].pos[0] = VIEWPORT.WIDTH - (slider_val * VIEWPORT.WIDTH);
      }, _);
   }
   { // Set Emitter Y Position
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      contols_buffer.push(slider);
      slider.SetInitialValue(.5);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      Slider_connect(slider, (params, slider_val) => {

         emitter.pos[1] = slider_val * VIEWPORT.HEIGHT;
      }, _);
   }


   return contols_buffer;
}
/*********************************************************************************************************************************************************************************************/



















/*********************************************************************************************************************************************************************************************/
/** 
 */
/*********************************************************************************************************************************************************************************************/

export function Test_noise_shader() {

   const emitters = [];
   const emitter_idxs = [];
   const speed = 10;
   let cnt = 0;
   const size = 40
   const dim = [size * DEVICE.device_scale, size * DEVICE.device_scale]

   // Create Particle emitters
   {

      const emitter_idx = Particle_system_create_emitter('TestParticles', TRANSPARENCY(WHITE, .1), [0, 300, 0], dim, .3, 1, 1, .96, -.1, 3, TEXTURES.SMOKE_1);

      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;


      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TEX2);


      Particles_gen_gfx_ctx(emitter);



      emitter.SetConeOfDirection(1, 1, -.9, .4);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++
   }








   /****************************************************************************************************************/
   // Emitter controls

   const header_font_size = 9 * DEVICE.device_scale;
   const regular_font_size = 8 * DEVICE.device_scale;

   // Style for the Section widgets.
   const section_pad = [0, 0];
   const clp_fontsize = regular_font_size;
   const trans = .2, trans2 = .2;

   // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
   const label_style = [6, 0, 2];
   const label_pad = [6, 6];
   const label_col = TRANSPARENCY(BLUEL[1], 0);
   const label_text_col = WHITE;


   const slider_col = TRANSPARENCY(GREY[5], .1);
   const slider_text_col = WHITE;

   // Style for the switch widgets
   const C1 = TRANSPARENCY(BLACK, trans2);
   const CGREY = TRANSPARENCY(GREY[0], trans2);
   const switch_size = 19 * DEVICE.device_scale;
   const switch_pad = 4;
   const switch_col = TRANSPARENCY(GREY[8], .1);
   const section_col = C1;
   const switch_col2 = TRANSPARENCY(GREY[1], trans2);
   let zpos = 0;

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }

   const controls_dp = Create_widget_dropdown(_, 'Emitter Test', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
   controls_dp.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   Dropdown_roots_set_root(controls_dp, controls_dp);
   // controls_dp.AddToMenu(controls_dp);




   { // Emitter switch and label

      const emitter_section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Emitter Test', label_style);
      emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

      const label = Create_widget_label(_, 'Emitter Test', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      emitter_section.AddItem(label);

      const emitter_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      emitter_switch.SetName('emitter_switch switch Test');
      emitter_section.AddItem(emitter_switch);

      emitter_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      const evt_params = { target_params: [emitter_idxs[0]] };
      emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
      emitter_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      controls_dp.AddToMenu(emitter_section);
   }

   { // Color picker switch  label

      zpos = -1
      const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

      // Create label
      const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      color_picker.AddItem(label);
      color_picker.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      // Create switch
      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      colorpicker_switch.SetName('color_picker switch');
      color_picker.AddItem(colorpicker_switch);

      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.Bind(
         (params) => {

            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
            */
            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;


            if (isOn) {

               const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 0, _, _, _, _, _, _, 0x0, );

               // TODO: The slider from colorpicker updates correctly but the glow particles hue and transparency do not update    
               colorpicker.SetTransparencySliderSetInitialValue(1.0)
               // colorpicker.SetHueSliderSetInitialValue(.80)

               // Root_group_set_render_queue_priority(colorpicker.root_bufferidx);


               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;

                  // Add color to controls dropdown
                  // CopyArr4(controls_dp.mat.col, color);
                  // CopyArr4(controls_dp.mat.defCol, color);
                  // Gl_set_rgba(controls_dp.gfx, color, controls_dp.geom.num_faces);
                  CopyArr4(emitters[0].mat.col, color);
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker'section index somewhere so that this callback can destroy it
            }
            else {

               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, null,
      );

      controls_dp.AddToMenu(color_picker);
   }


   { // Contol Params for tarnsform and physics

      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      const glow_controls_dp2 = Create_widget_dropdown(_, 'Transform Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
      glow_controls_dp2.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      controls_dp.AddToMenu(glow_controls_dp2)

      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.50);


         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitters[0].gravity = y;
         }, _);
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.29);


         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            emitters[0].accel = slider_val;

            // Linear Interpolation
            const max = 15, start = 0;
            const y = (slider_val * max) + start;
            emitters[0].accel = y;
            emitters[0].max_speed = 4;
         }, _);
      }
      { // Deccelerarion
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Deccelerarion');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.58);


         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            let y = 0;
            y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitters[0].deccel = y;

         }, _);
      }
      { // Set Emitter X Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position X');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.05);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
            const y = slider_val * VIEWPORT.WIDTH - emitters[0].dim[0];
            emitters[0].pos[0] = y;
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.29);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            const y = slider_val * VIEWPORT.HEIGHT - emitters[0].dim[1];
            emitters[0].pos[1] = y;
         }, _);
      }
      { // Set Emitter Y Direction Up
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction Y Up ');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.02);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = -1, start = 0;
            const y = (slider_val * max) + start;
            emitters[0].variation_emission.ydir_neg = y;
         }, _);
      }
      { // Set Emitter Y Direction Down
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction Y Down');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.02);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = 1, start = 0;
            const y = (slider_val * max) + start;
            emitters[0].variation_emission.ydir_pos = y;
         }, _);
      }
      { // Set Emitter Direction X Left
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction X Left');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.60);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitters[0].variation_emission.xdir_pos = y;
            emitters[0].variation_emission.xdir_neg = y;
         }, _);

      }

   }




   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [4, 4], [VIEWPORT.RIGHT - 280, 50, 0], [100, 100], CGREY, 'SidePanel', [0, 10, 1.8]);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

   section.AddItem(controls_dp);



   // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
   const text_mesh = controls_dp.children.buffer[0].text_mesh;
   text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;


   // Render properties panel
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   section.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   section.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx);
   // section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_PARENT_DSC, section.mesh_bufferidx, true);
   section.GenGfxCtx();
   // section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
   section.Calc_no_gfx_update();
   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);


   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);

   View_build_group_from_root_mesh(section);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);








   /****************************************************************************************************************/
   const s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [10, 60, 0], _, GREY[1],);
   s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


   const btn = Create_widget_button(_, 'Emitt', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 20, BLUEL[6], WHITE, [5, 5], .5);
   s.AddItem(btn);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idxs] },)


   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // s.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX
   s.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT
   s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC);
   s.Calc_no_gfx_update();
   s.Render();
   Root_group_activate_all_vbs_in_renderqueue(s.root_bufferidx);

   s.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, s.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(s);
   Construct_listen_events_relations_from_mesh_tree(s);

}


/*********************************************************************************************************************************************************************************************/



















/*********************************************************************************************************************************************************************************************/
/** Side-Panel
 * Create a collapsed menu panel (with button),
 * to add any kind of controls/options
 */
/*********************************************************************************************************************************************************************************************/

function Create_side_panel(root_widget = ROOT_WIDGETS.CREATE_ROOT, render_target = false, width = 300) {

   const height = VIEWPORT.HEIGHT / 2;
   const pad = 4;

   // const section = Create_widget_section(root_widget, SECTION.HORIZONTAL, [pad, 2], [VIEWPORT.RIGHT - (width+250 - pad * 2+10), 0, 0], [width, height], GREY[1], 'SidePanel', [0, 1, 1.8]);
   const section = Create_widget_section(root_widget, SECTION.HORIZONTAL, [pad, 2], [VIEWPORT.RIGHT - (width + 50 - pad * 2 + 10), 0, 0], [width, height], GREY[1], 'SidePanel', [0, 1, 1.8]);
   // section.state.mask |= MESH_STATE.STICKY_POSX;


   const properties_btn = Create_rect_mesh(_, [0, 0, 11], [8, height], TRANSPARENCY(Interpolate_rgb_to_01(2, 32, 60), 1.5), 'Btn', [10, 0, 1.8]);
   properties_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   properties_btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   properties_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   properties_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   // properties_btn.EnableGfxAttributes(MESH_ENABLE.ATTR_STYLE);
   section.AddItem(properties_btn)

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 4], [0, 0, 2], [0, 800], TRANSPARENCY(GREY[2], 1), 'InnerPanel', [0, 10, 1.8]);
   s.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   s.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.AddItem(s);

   const heading = Create_widget_label(_, 'Properties Panel', _, [0, 0, 4], _, GREY[1], BLUEL[9], [10, 4], _, [0, 8, 1.8]);
   heading.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   heading.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   s.AddItem(heading);


   if (render_target) {


      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      // section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX
      section.options = SECTION.HORIZONTAL | SECTION.EXPAND | SECTION.RESIZE_PARENTX
      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      section.Calc_no_gfx_update();
      section.Render();
      Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(section);
      Construct_listen_events_relations_from_mesh_tree(section);

      View_build_group_from_root_mesh(section);


      // Create the panel button click evnt and animation 
      const params = {
         isOn: true,
      };
      properties_btn.ChangeListenEvent(E.C,
         (params) => {

            console.log('[][][][]][][][][][][');

            const section = params.evt_params.section;
            const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
            const isOn = params.evt_params.rest_params.isOn;
            const reduce_val = 25;
            console.log(isOn)

            if (isOn) {

               Callback_animations_create( // Close Panel
                  (params) => { // Run Animation
                     // console.log(params)

                     let reduce_val = params.reduce_val;
                     const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);
                     if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - 5) {
                        // console.log('unif_wpos', unif_wpos)
                        const section = params.section;
                        Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

                        // params.reduce_val *= 1.03
                        params.reduce_val *= .9
                        // console.log('reduce_val', params.reduce_val)

                        return true;
                     }

                     // Mesh_unif_add_vb_root_wposx(section.root_posidx, section.geom.dim[0]*2 - btn.geom.dim[0]*2 - 5);

                     return false;
                  },
                  () => { // Stop Animation

                     return false;
                  },
                  { section: section, reduce_val: reduce_val }
               );

               params.evt_params.rest_params.isOn = false;
            }
            else { // Open Panel

               Callback_animations_create(
                  (params) => { // Run Animation

                     let reduce_val = params.reduce_val;
                     const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);
                     if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2 || reduce_val < 1) {

                        const section = params.section;
                        Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

                        params.reduce_val *= .9
                        // console.log('unif_wpos', unif_wpos, 'reduce_val',VIEWPORT.WIDTH - btn.geom.dim[0])

                        return true;
                     }

                     return false;
                  },
                  () => { // Stop Animation

                     return false;
                  },
                  { section: section, reduce_val: reduce_val }
               );

               params.evt_params.rest_params.isOn = true;
            }


         }
         , { section: section, rest_params: params },
      );
   }


   return section;
}



function Create_side_panel_horizontal(root_widget = ROOT_WIDGETS.CREATE_ROOT, render_target = false, height = 300) {

   // const height = VIEWPORT.HEIGHT/2;
   const pad = 4;

   const section = Create_widget_section(root_widget, SECTION.VERTICAL, [pad, 2], [0, VIEWPORT.HEIGHT - height, 0], [VIEWPORT.WIDTH, height / 2], GREY[1], 'SidePanel', [0, 1, 1.8]);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   // section.state.mask |= MESH_STATE.STICKY_POSX;


   // const properties_btn = Create_rect_mesh(_, [0, 2, 11], [VIEWPORT.WIDTH/2, 8], TRANSPARENCY(Interpolate_rgb_to_01(2, 32, 60), 1.), 'Btn', [0, 10, 1.8]);
   const properties_btn = Create_rect_mesh(_, [0, 2, 11], [VIEWPORT.WIDTH / 2 - pad, 8], TRANSPARENCY(Interpolate_rgb_to_01(10, 72, 160), 1.), 'Btn', [0, 100, 1.8]);
   properties_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   properties_btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   // properties_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   properties_btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   // properties_btn.EnableGfxAttributes(MESH_ENABLE.ATTR_STYLE);
   section.AddItem(properties_btn)

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 4], [0, 20, 2], [0, 800], TRANSPARENCY(GREY[2], 1), 'InnerPanel', [0, 10, 1.8]);
   s.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   s.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   section.AddItem(s);

   const heading = Create_widget_label(_, 'Properties Panel', _, [0, 0, 4], _, GREY[1], BLUEL[9], [10, 4], _, [0, 8, 1.8]);
   heading.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   heading.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   s.AddItem(heading);

   // section.geom.pos[0] -= 200



   if (render_target) {


      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX
      section.options = SECTION.VERTICAL | SECTION.EXPAND | SECTION.RESIZE_PARENTY
      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      section.Calc_no_gfx_update();
      section.Render();
      // Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(section);
      Construct_listen_events_relations_from_mesh_tree(section);

      View_build_group_from_root_mesh(section);


      // // Create the panel button click evnt and animation 
      // const params = {
      //    isOn: true,
      // };
      // properties_btn.ChangeListenEvent(E.C,
      //    (params) => {

      //       console.log('[][][][]][][][][][][');

      //       const section = params.evt_params.section;
      //       const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
      //       const isOn = params.evt_params.rest_params.isOn;
      //       const reduce_val = 25;
      //       console.log(isOn)

      //       if (isOn) {

      //          Callback_animations_create( // Close Panel
      //             (params) => { // Run Animation
      //                // console.log(params)

      //                let reduce_val = params.reduce_val;
      //                const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);
      //                if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - 5) {
      //                   // console.log('unif_wpos', unif_wpos)
      //                   const section = params.section;
      //                   Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

      //                   // params.reduce_val *= 1.03
      //                   params.reduce_val *= .9
      //                   // console.log('reduce_val', params.reduce_val)

      //                   return true;
      //                }

      //                // Mesh_unif_add_vb_root_wposx(section.root_posidx, section.geom.dim[0]*2 - btn.geom.dim[0]*2 - 5);

      //                return false;
      //             },
      //             () => { // Stop Animation

      //                return false;
      //             },
      //             { section: section, reduce_val: reduce_val }
      //          );

      //          params.evt_params.rest_params.isOn = false;
      //       }
      //       else { // Open Panel

      //          Callback_animations_create(
      //             (params) => { // Run Animation

      //                let reduce_val = params.reduce_val;
      //                const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);
      //                if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2 || reduce_val < 1) {

      //                   const section = params.section;
      //                   Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

      //                   params.reduce_val *= .9
      //                   // console.log('unif_wpos', unif_wpos, 'reduce_val',VIEWPORT.WIDTH - btn.geom.dim[0])

      //                   return true;
      //                }

      //                return false;
      //             },
      //             () => { // Stop Animation

      //                return false;
      //             },
      //             { section: section, reduce_val: reduce_val }
      //          );

      //          params.evt_params.rest_params.isOn = true;
      //       }


      //    }
      //    , { section: section, rest_params: params },
      // );
   }


   return section;
}
/*********************************************************************************************************************************************************************************************/













/**********************************************************************************************************************************************************/
/**********************************************************************************************************************************************************/
// DEMOS with properties panel for the controls




// export function Demo_glow_particles_2(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0,) { // 3 control Sliders 

//    /**
//     * // TODO:
//     * // BUG: The settings dealt from a callback update the emitter's parameters, but the particles 
//     * themselves are not being updated until the destruction and recreation of a new particle
//     */

//    const scale_down = .2;

//    const emitter1_idx = Particle_system_create_emitter('T1st Particle System', BLUEL[9], [0, y, 10], [40, 40], .6, 1, 4, .98, .1, 4);
//    const emitter = Particles_get_particle_system(emitter1_idx);
//    emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;

//    emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW);
//    emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 40);


//    emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
//    emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);

//    emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//    emitter.EnableGfxUniforms({ fx: SID.FX.FS_GLOW_VEC3, }, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);


//    emitter.SetConeOfDirection(1, 1, .2, -.2);






//    let zpos = 1;
//    const header_font_size = 9 * DEVICE.device_scale;
//    const regular_font_size = 8 * DEVICE.device_scale;
//    const trans = 1








//    /****************************************************************************************************************/
//    // Create Sliders for manipulating variables of particles

//    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];

//    const controls_dp = Create_widget_dropdown(root_widget, 'Glow Particles Demo', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [10, 4], _, _, header_font_size, [6, 0, 2], [4, 4],);
//    controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//    Dropdown_roots_set_root(controls_dp, controls_dp);


//    // controls_dp.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
//    // controls_dp.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_dp.mesh_bufferidx)

//    // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
//    const text_mesh = controls_dp.children.buffer[0].text_mesh;
//    text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;



//    const u_wpos_flags = {
//       unif: SID.UNIF.ROOT_WPOS2,
//       pass: SID.PASS.WPOS2,
//    }
//    controls_dp.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);








//    /****************************************************************************************************************/
//    // Create the switch to create/destroy colorpicker for particles color control

//    // Style for the Section widgets.
//    const section_pad = [0, 0];
//    const clp_fontsize = regular_font_size;

//    // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
//    const label_style = [6, 0, 2];
//    const label_pad = [6, 6];
//    const label_col = TRANSPARENCY(BLUEL[1], 0);
//    const label_text_col = WHITE;

//    // Style for the switch widgets
//    const switch_size = 19 * DEVICE.device_scale;
//    const switch_pad = 4;
//    const switch_col = TRANSPARENCY(YELLOWL[1], 1);
//    const switch_col2 = TRANSPARENCY(GREY[1], trans);
//    const section_col = TRANSPARENCY(YELLOWL[5], 1.);




//    { // Emitter switch and label

//       const emitter_section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Emitter', label_style);
//       emitter_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       emitter_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);
//       emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

//       const label = Create_widget_label(_, 'Emitter', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);
//       emitter_section.AddItem(label);

//       const emitter_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
//       emitter_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       emitter_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size[1]);
//       emitter_switch.SetName('emitter_switch switch');
//       emitter_section.AddItem(emitter_switch);

//       emitter_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//       const evt_params = { target_params: [emitter1_idx] };
//       emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
//       emitter_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//       controls_dp.AddToMenu(emitter_section);
//    }



//    { // Color picker switch and label

//       const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);
//       color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

//       // Create label
//       const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);
//       color_picker.AddItem(label);
//       color_picker.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//       // Create switch
//       const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size[1]);
//       colorpicker_switch.SetName('color_picker switch');
//       color_picker.AddItem(colorpicker_switch);

//       colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       colorpicker_switch.Bind(
//          (params) => {

//             /**
//              * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
//              * Explanation:
//              * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
//              * 
//              */
//             const switch_mesh = params.target_mesh;
//             const isOn = switch_mesh.isOn;


//             if (isOn) {

//                // const colorpicker = Demo_widgets_colorpicker(x, y, 0x0, ROOT_WIDGETS.CREATE_ROOT);
//                const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 0, _, _, _, _, _, _, 0x0, );

//                // TODO: The slider from colorpicker updates correctly but the glow particles hue and transparency do not update    
//                colorpicker.SetTransparencySliderSetInitialValue(1.0)
//                colorpicker.SetHueSliderSetInitialValue(1.0)

//                Root_group_set_render_queue_priority(colorpicker.root_bufferidx);

//                colorpicker.AssignTargetMeshClbk((params) => {
//                   const color = params;

//                   CopyArr4(controls_dp.mat.col, color);
//                   CopyArr4(controls_dp.mat.defCol, color);
//                   Gl_set_rgba(controls_dp.gfx, color, controls_dp.geom.num_faces);
//                   CopyArr4(emitter.mat.col, color);
//                });
//                switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
//             }
//             else {

//                const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
//                colorpicker.Destroy();
//             }
//          },
//          null, null,
//       );

//       controls_dp.AddToMenu(color_picker);
//    }





//    Particles_gen_gfx_ctx(emitter, controls_dp);
//    // Initialize values to uniforms
//    emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1]);







//    /****************************************************************************************************************/
//    // Create Sliders for manipulating variables of particles
//    {
//       /** NICE EFFECT: Distance:{.26}, Brighter:{1}, Intensity:{1.}, Gravity:{.53{=.03}}, Acceleration:{.12} */
//       /** NICE EFFECT: Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22} */
//       /** NICE EFFECT2: Distance:{.25}, Brighter:{1}, Intensity:{.61}, Intensity:{33}, Gravity:{.48}, Acceleration:{.59}, Decceleration:{19}, DirectionX:{64} 
//        *    color:{R:.2, G:.0, B:.8, A:.68, }
//       */

//       const slider_feather = 2;
//       const slider_rcorners = 10;

//       // Contol Params for shader params
//       const glow_controls_dp = Create_widget_dropdown(root_widget, 'Shader Uniforms', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//       glow_controls_dp.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       glow_controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       glow_controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);

//       { // SHADER UNIFORMS: Distance
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Distance');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(.36);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 0;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);
//       }
//       { // SHADER UNIFORMS: Brightness
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Brighter');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(1.);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 1;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);
//       }
//       { // SHADER UNIFORMS: Intensity
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Intensity');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(.12);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 2;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);
//       }
//       { // SHADER UNIFORMS: Particle Scale
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Particle Scale');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(scale_down);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 0;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);
//       }
//       controls_dp.AddToMenu(glow_controls_dp);


//       // Contol Params for tarnsform and physics
//       const glow_controls_dp2 = Create_widget_dropdown(root_widget, 'Transform Params', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//       glow_controls_dp2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//       glow_controls_dp2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//       glow_controls_dp2.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       { // Gravity
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Gravity');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.48);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             // Linear Interpolation
//             const max = 1, start = -.5;
//             const y = (slider_val * max) + start;
//             emitter.gravity = y;
//          }, _);
//       }
//       { // Acceleration
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Acceleration');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.59);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             emitter.accel = slider_val;

//             // Linear Interpolation
//             const max = 15, start = 0;
//             const y = (slider_val * max) + start;
//             emitter.accel = y;
//             emitter.max_speed = 4;
//          }, _);
//       }
//       { // Deccelerarion
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Deccelerarion');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.19);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
//             const h = 1, k = -2.8, r = 3.8 * 3.8;
//             const x = slider_val;
//             let y = 0;
//             y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
//             emitter.deccel = y;

//          }, _);
//       }
//       { // Set Emitter X Position
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Emitter Position X');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(0);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {
//             const y = slider_val * VIEWPORT.WIDTH;
//             emitter.pos[0] = y;
//          }, _);
//       }
//       { // Set Emitter Y Position
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Emitter Position Y');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.35);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const y = slider_val * VIEWPORT.HEIGHT;
//             emitter.pos[1] = y;
//          }, _);
//       }
//       { // Set Emitter Y Position
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction Y Up ');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.05);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const max = -1, start = 0;
//             const y = (slider_val * max) + start;
//             emitter.variation_emission.ydir_neg = y;
//             console.log(slider_val, y)
//          }, _);
//       }
//       { // Set Emitter Y Direction Y Down
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction Y Down');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.05);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const max = 1, start = 0;
//             const y = (slider_val * max) + start;
//             emitter.variation_emission.ydir_pos = y;
//             console.log(slider_val, y)
//          }, _);
//       }
//       { // Set Emitter Direction X Left
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction X Left');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.55);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             let max = 2, start = -1;
//             const y = (slider_val * max) + start;
//             emitter.variation_emission.xdir_pos = y;
//             emitter.variation_emission.xdir_neg = y;
//             console.log(slider_val, y)
//          }, _);
//       }

//       controls_dp.AddToMenu(glow_controls_dp2)

//    }


//    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

//       controls_dp.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.FROM_PARENT_DSC, controls_dp.mesh_bufferidx, true);
//       controls_dp.GenGfxCtx();
//       // controls_dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);


//       controls_dp.geom.pos[0] = x;
//       controls_dp.geom.pos[1] = y;

//       controls_dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
//       controls_dp.Calc_no_gfx_update();

//       controls_dp.Render();
//       Root_group_activate_all_vbs_in_renderqueue(controls_dp.root_bufferidx);


//       Construct_listen_events_from_mesh_tree(controls_dp);
//       Construct_listen_events_relations_from_mesh_tree(controls_dp);

//       // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
//       View_build_group_from_root_mesh(controls_dp)

//       controls_dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_dp.gfx.vb.groupidx);

//    }

//    return controls_dp;

// }



// export function Demo_ball_tail() { // Side Panel 

//    /****************************************************************************************************************/
//    // BallTail
//    const balltail_section_xpos = 4;
//    const balltail_section_ypos = 43;
//    const tail_particles = Create_comet_particles(balltail_section_xpos, balltail_section_ypos, _, _, 1, 0x0);
//    const noise_particles_buffer = tail_particles.noise_particles_buffer
//    const glow_particles_buffer = tail_particles.glow_particles_buffer;



//    let zpos = 1;
//    const header_font_size = 9 * DEVICE.device_scale;
//    const regular_font_size = 8 * DEVICE.device_scale;
//    const trans = .8








//    /****************************************************************************************************************/
//    // Create Sliders for manipulating variables of particles

//    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
//    const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, zpos], [0, 0], YELLOWL[6], 'SliderSection', [10, 0, 2],);
//    slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

//    const u_wpos_flags = {
//       unif: SID.UNIF.ROOT_WPOS2,
//       pass: SID.PASS.WPOS2,
//    }

//    slider_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//    { // Create sliders and colorpicker

//       zpos++;

//       const controls_label = Create_widget_label(_, 'Ball Tail Demo', _, [0, 0, 4], header_font_size, GREY[2], YELLOWL[9], [10, 6], _, [0, 8, 1.8]);
//       slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//       slider_section.AddItem(controls_label);

//       // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
//       const text_mesh = controls_label.text_mesh;
//       text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW








//       /****************************************************************************************************************/
//       // Create the switch to create/destroy colorpicker for particles color control

//       // Style for the Section widgets.
//       const section_pad = [0, 0];
//       const clp_fontsize = regular_font_size;

//       // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
//       const label_style = [8, 8, 2];
//       const label_pad = [10, 6];
//       const label_col = TRANSPARENCY(GREY[2], trans);
//       const label_text_col = WHITE;

//       // Style for the switch widgets
//       const switch_size = 19 * DEVICE.device_scale;
//       const switch_pad = 4;
//       const switch_col = TRANSPARENCY(GREY[2], trans);
//       const switch_col2 = TRANSPARENCY(GREY[2], trans);
//       const section_col = TRANSPARENCY(YELLOWL[5], .0);


//       const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
//       slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       slider_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);
//       // color_picker.options = SECTION.HORIZONTAL | SECTION.EXPAND | SECTION.TOP_DOWN;
//       color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

//       const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       color_picker.AddItem(label);

//       const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size[1]);
//       colorpicker_switch.SetName('color_picker switch');
//       color_picker.AddItem(colorpicker_switch);

//       colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       const x = 0, y = 0
//       colorpicker_switch.Bind(
//          (params) => {

//             /**
//              * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
//              * Explanation:
//              * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
//              * 
//              */
//             const switch_mesh = params.target_mesh;
//             const noise_particles_buffer = params.params.noise_particles_buffer;
//             const glow_particles_buffer = params.params.glow_particles_buffer;
//             const isOn = switch_mesh.isOn;


//             if (isOn) {

//                const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, x, y + tail_particles.section.geom.dim[1] * 2, _, _, _, _, _, _, 0x0, );

//                // TODO: The slider from colorpicker updates correctly but the glow particles hue and transparency do not update    
//                // colorpicker.SetTransparencySliderSetInitialValue(.10)
//                // colorpicker.SetHueSliderSetInitialValue(.80)

//                // Root_group_set_render_queue_priority(colorpicker.root_bufferidx);

//                colorpicker.AssignTargetMeshClbk((params) => {

//                   const color = params;
//                   CopyArr4(noise_particles_buffer[0].mat.col, color);
//                   CopyArr4(glow_particles_buffer[0].mat.col, color);
//                });

//                switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
//             }
//             else {

//                const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
//                colorpicker.Destroy();
//             }
//          },
//          null,
//          {
//             noise_particles_buffer: noise_particles_buffer,
//             glow_particles_buffer: glow_particles_buffer,
//          },
//       );

//       slider_section.AddItem(color_picker);








//       /****************************************************************************************************************/
//       // Tail Particle System: Control Sliders 
//       const tail_buffer_len = noise_particles_buffer.length;
//       for (let i = 0; i < tail_buffer_len; i++) {
//          { // Tail Particle System: Control Sliders 
//             const emitter = noise_particles_buffer[i]

//             { // Slider 1 contol
//                const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Speed');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//                slider.SetInitialValue(0);
//                slider_section.AddItem(slider);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//                Slider_connect(slider, (params, slider_val) => {

//                   const glow_emitter = noise_particles_buffer[i]
//                   let min = .8; // The min value gives the prolonged glow_emitter
//                   let max = 1.; // Calculate that the max value will be +1+min
//                   const rev_slider_val = 1 - slider_val;
//                   glow_emitter.t_step = rev_slider_val + min + ((max - slider_val) * (rev_slider_val));
//                   glow_emitter.speed = (slider_val + 1) * 3;
//                }, _);

//             }
//             { // Slider 2 contol: Uniform value in fragment shader
//                const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Intensity');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//                slider.SetInitialValue(0);
//                slider_section.AddItem(slider);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 1;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);

//             }
//             { // Slider 3 contol: Uniform value in fragment shader
//                const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Fire Variation');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//                slider.SetInitialValue(0);
//                slider_section.AddItem(slider);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 0;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//             { // Slider 4 contol: Uniform value in fragment shader
//                const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Noise Complexity');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//                slider.SetInitialValue(0);
//                slider_section.AddItem(slider);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 2;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//          }



//          { // Glow Particle System: Control Sliders 
//             const emitter = glow_particles_buffer[i]
//             /**
//              * NICE EFFECT:
//              * Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22}
//              */

//             {
//                const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Distance');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//                slider_section.AddItem(slider);
//                slider.SetInitialValue(0);

//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 0;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//             {
//                const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Brighter');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//                slider_section.AddItem(slider);
//                slider.SetInitialValue(1);

//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 1;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//             {
//                const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Intensity');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//                slider_section.AddItem(slider);
//                slider.SetInitialValue(.03);

//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 2;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);

//             }
//          }
//       }
//    }








//    /****************************************************************************************************************/
//    // Side panel
//    const properties_panel = Create_side_panel(ROOT_WIDGETS.CREATE_ROOT);


//    // Create the panel for holding all controls
//    const controls_panel = Create_widget_section(_, SECTION.VERTICAL, [4, 4], [0, 0, 0], [0, 0], TRANSPARENCY(PURPLEB[5], 1), 'SidePanel', [10, 0, 1.8]);
//    controls_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//    controls_panel.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//    properties_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
//    controls_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);



//    controls_panel.AddItem(slider_section)
//    const inner_section = properties_panel.children.buffer[1];


//    // Create scroller for the ui-mesh info widget
//    const scroller_width = 10;
//    const scroller = Create_widget_scroller(_, controls_panel, [scroller_width, 160], _, [4, 4]);
//    scroller.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, .6);
//    scroller.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);

//    inner_section.AddItem(scroller);
//    scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.RESIZE_PARENTX;
//    scroller.scrolled_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;





//    properties_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    properties_panel.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX

//    properties_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
//    properties_panel.Recalc_no_gfx_update();
//    properties_panel.Render();
//    Root_group_activate_all_vbs_in_renderqueue(properties_panel.root_bufferidx);

//    properties_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, properties_panel.gfx.vb.groupidx);

//    Construct_listen_events_from_mesh_tree(properties_panel);
//    Construct_listen_events_relations_from_mesh_tree(properties_panel);

//    View_build_group_from_root_mesh(properties_panel);


//    const properties_btn = properties_panel.children.buffer[0];


//    const params = {
//       isOn: true,
//       section_pad: properties_panel.StylesGetPad(),
//    };
//    properties_btn.ChangeListenEvent(E.C,
//       (params) => {


//          const section = params.evt_params.section;
//          const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
//          const isOn = params.evt_params.rest_params.isOn;
//          const section_pad = params.evt_params.rest_params.section_pad;
//          const reduce_val = section.geom.dim[0] * 2 / 10;

//          if (isOn) { // Close Panel

//             Callback_animations_create( // Close Panel
//                (params) => { // Run Animation

//                   let reduce_val = params.reduce_val;
//                   const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);

//                   if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - section_pad[0] * 2) {

//                      const section = params.section;
//                      Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

//                      if (params.reduce_val > 5) params.reduce_val *= .9

//                      return true;
//                   }

//                   return false;
//                },
//                () => { // Stop Animation

//                   return false;
//                },
//                { section: section, reduce_val: reduce_val }
//             );

//             params.evt_params.rest_params.isOn = false;
//          }
//          else { // Open Panel

//             Callback_animations_create(
//                (params) => { // Run Animation

//                   let reduce_val = params.reduce_val;
//                   const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);
//                   if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2) {

//                      const section = params.section;
//                      Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

//                      if (params.reduce_val > 5) params.reduce_val *= .9

//                      return true;
//                   }

//                   return false;
//                },
//                () => { // Stop Animation

//                   return false;
//                },
//                { section: section, reduce_val: reduce_val }
//             );

//             params.evt_params.rest_params.isOn = true;
//          }


//       }
//       , { section: properties_panel, rest_params: params },
//    );


// }



// export function Demo_smoke_2(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0,) { // 3 control Sliders 

//    const scale_down = 1.;
//    const emitters = [];
//    const emitter_idxs = [];
//    const speed = 10;
//    let cnt = 0;
//    // const dim = [150*DEVICE.device_scale, 150*DEVICE.device_scale];
//    const dim = [20 * DEVICE.device_scale, 20 * DEVICE.device_scale];

//    let particles_vb_groupidx = INT_NULL;


//    // Create Particle emitters
//    { // Emitter 1
//       const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', TRANSPARENCY(ORANGE[9], .009), [x, y, 0], dim, 1., 1., 1, .05, 0, 1, TEXTURES.SMOKE_1);
//       const emitter = Particles_get_particle_system(emitter_idx);
//       emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
//       emitter.speed = speed;


//       // emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//       // emitter.EnableGfxUniforms({fx: SID.FX.FS_GLOW_VEC3,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TEX2);


//       particles_vb_groupidx = Particles_gen_gfx_ctx(emitter);
//       // Initialize values to uniforms
//       // emitter.GfxUniformSetAndUpdate('u_scale2', [.1, 1]);
//       // emitter.GfxUniformSetAndUpdate('u_glow_params', [.3, 1, .2]);

//       emitter.SetConeOfDirection(.25, .25, .7, .4);

//       emitters[cnt] = emitter;
//       emitter_idxs[cnt] = emitter_idx;
//       cnt++;

//    }
//    { // Emitter 2
//       // const emitter_idx = Particle_system_create_emitter('SmokeParticles 2', TRANSPARENCY(PURPLER[9], .009), [0, 0, 0], dim, 1.5, 1, 2, .98, -.1, 3, TEXTURES.SMOKE_1);
//       const emitter_idx = Particle_system_create_emitter('SmokeParticles 2', TRANSPARENCY(PURPLER[9], .009), [0, 0, 0], dim, 1., 1., 1, .05, 0, 1, TEXTURES.SMOKE_1);
//       const emitter = Particles_get_particle_system(emitter_idx);
//       emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
//       emitter.speed = speed;

//       // emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//       // emitter.EnableGfxUniforms({fx: SID.FX.FS_GLOW_VEC3,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);


//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TEX2);

//       Particles_gen_gfx_ctx(emitter, _, particles_vb_groupidx);
//       // Initialize values to uniforms
//       // emitter.GfxUniformSetAndUpdate('u_scale2', [.1, 1]);
//       // emitter.GfxUniformSetAndUpdate('u_glow_params', [.3, 1, .2]);

//       // emitter.pos[0] = VIEWPORT.WIDTH/2-dim[0]; 
//       // emitter.pos[1] = -dim[1]; 

//       // emitter.SetConeOfDirection(-.25, -.75, .2, .1);
//       emitter.SetConeOfDirection(.25, .25, .7, .4);

//       emitters[cnt] = emitter;
//       emitter_idxs[cnt] = emitter_idx;
//       cnt++;
//    }





//    let zpos = 1;
//    const regular_font_size = 8;
//    const trans = 1;
//    const trans2 = .3;

//    const u_wpos_flags = {
//       unif: SID.UNIF.ROOT_WPOS2,
//       pass: SID.PASS.WPOS2,
//    }

//    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];

//    // Style for the Section widgets.
//    const section_pad = [0, 0];
//    const clp_fontsize = regular_font_size;

//    // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
//    const label_style = [6, 0, 2];
//    const label_pad = [6, 6];
//    const label_col = TRANSPARENCY(BLUEL[1], 0);
//    const label_text_col = WHITE;


//    const slider_col = TRANSPARENCY(GREY[5], .1);
//    const slider_text_col = WHITE;

//    // Style for the switch widgets
//    const C1 = TRANSPARENCY(BLACK, 0);
//    const CGREY = TRANSPARENCY(GREY[0], trans2);
//    const switch_size = 19 * DEVICE.device_scale;
//    const switch_pad = 4;
//    const switch_col = TRANSPARENCY(GREY[8], .1);
//    const section_col = C1;
//    const switch_col2 = TRANSPARENCY(GREY[1], trans2);








//    /****************************************************************************************************************/
//    // Emitter 1-2 controls


//    const ctrl_dp_emitt12 = Create_widget_dropdown(_, 'Emitters 1-2', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//    ctrl_dp_emitt12.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    ctrl_dp_emitt12.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    ctrl_dp_emitt12.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);








//    /****************************************************************************************************************/
//    // Emitter activation switch
//    { // Emitter 1-2 switch and label

//       const emitter_section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Activate', label_style);
//       emitter_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       emitter_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

//       const label = Create_widget_label(_, 'Emitter', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       emitter_section.AddItem(label);

//       const emitter_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
//       emitter_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       emitter_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size[1]);
//       emitter_switch.SetName('emitter_switch switch');
//       emitter_section.AddItem(emitter_switch);

//       emitter_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//       const evt_params = { target_params: [emitter_idxs[0], emitter_idxs[1]] };
//       emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
//       emitter_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//       ctrl_dp_emitt12.AddToMenu(emitter_section);
//    }








//    /****************************************************************************************************************/
//    // Emitter Colorpicker

//    { // Color picker switch and label

//       const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker 1-2', label_style);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
//       ctrl_dp_emitt12.AddToMenu(color_picker);

//       // Create label
//       const label = Create_widget_label(_, 'Color Picker 1-2 label', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       color_picker.AddItem(label);
//       color_picker.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//       // Create switch
//       const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size[1]);
//       colorpicker_switch.SetName('color_picker 1-2 switch');
//       color_picker.AddItem(colorpicker_switch);

//       colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       colorpicker_switch.Bind(
//          (params) => {

//             /**
//              * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
//              * Explanation:
//              * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
//              * 
//              */
//             const switch_mesh = params.target_mesh;
//             const isOn = switch_mesh.isOn;


//             if (isOn) {
//                // How should this callback know about the colorpicker, so that it can destroy it???????

//                const colorpicker = Demo_widgets_colorpicker(_, _, 0x0, ROOT_WIDGETS.CREATE_ROOT);

//                // TODO: The slider from colorpicker updates correctly but the glow particles hue and transparency do not update    
//                // colorpicker.SetTransparencySliderSetInitialValue(.10)
//                // colorpicker.SetHueSliderSetInitialValue(.80)

//                // Root_group_set_render_queue_priority(colorpicker.root_bufferidx);

//                colorpicker.AssignTargetMeshClbk((params) => {

//                   const color = params;

//                   // Add color to controls dropdown
//                   CopyArr4(ctrl_dp_emitt12.mat.col, color);
//                   CopyArr4(ctrl_dp_emitt12.mat.defCol, color);
//                   Gl_set_rgba(ctrl_dp_emitt12.gfx, color, ctrl_dp_emitt12.geom.num_faces);
//                   CopyArr4(emitters[0].mat.col, color);
//                   CopyArr4(emitters[1].mat.col, color);

//                });
//                switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
//             }
//             else {

//                const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
//                colorpicker.Destroy();
//             }
//          },
//          null, null,
//       );

//    }








//    /****************************************************************************************************************/
//    // Create Sliders for manipulating variables of particles
//    // if(emitters[0].sid.fx & SID.FX.FS_SMOKE_VEC3)
//    {
//       /**   NICE EFFECT2: Distance:{.25}, Brighter:{1}, Intensity:{.61}, Intensity:{33}, Gravity:{.48}, Acceleration:{.59}, Decceleration:{19}, DirectionX:{64} 
//        *    NICE EFFECT: Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22} 
//        *    color:{R:.2, G:.0, B:.8, A:.68, }
//        */

//       { // Contol Params for shader params

//          const slider_feather = 2;
//          const slider_rcorners = 6;
//          const glow_controls_dp = Create_widget_dropdown(_, 'Shader Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//          glow_controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//          glow_controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//          glow_controls_dp.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          ctrl_dp_emitt12.AddToMenu(glow_controls_dp);

//          {
//             const emitter = emitters[0];
//             if (emitter.sid.unif & SID.UNIF.SCALE2) {
//                const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Scale');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//                glow_controls_dp.AddToMenu(slider);
//                slider.SetInitialValue(.71);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 0;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//             if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
//                const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Noise UV Coord');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//                glow_controls_dp.AddToMenu(slider);
//                slider.SetInitialValue(.71);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 0;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//             if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
//                const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Cone Wideness');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//                glow_controls_dp.AddToMenu(slider);
//                slider.SetInitialValue(.78);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 1;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//             if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
//                const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Complexity');
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//                slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//                glow_controls_dp.AddToMenu(slider);
//                slider.SetInitialValue(.50);
//                slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//                Slider_connect(slider, (params, slider_val) => {

//                   const val_idx = 2;
//                   // Find the ubidx
//                   const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
//                   Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//                }, _);
//             }
//          }

//       }
//       { // Contol Params for tarnsform and physics

//          const slider_feather = 2;
//          const slider_rcorners = 6;

//          const glow_controls_dp2 = Create_widget_dropdown(_, 'Transform Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//          glow_controls_dp2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          glow_controls_dp2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          ctrl_dp_emitt12.AddToMenu(glow_controls_dp2);

//          { // Gravity
//             const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//             glow_controls_dp2.AddToMenu(slider);
//             slider.SetInitialValue(.48);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                // Linear Interpolation
//                const max = 1, start = -.5;
//                const y = (slider_val * max) + start;
//                emitters[0].gravity = y;
//                emitters[1].gravity = y;
//             }, _);
//          }
//          { // Acceleration
//             const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//             glow_controls_dp2.AddToMenu(slider);
//             slider.SetInitialValue(.08);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                emitters[0].accel = slider_val;

//                // Linear Interpolation
//                const max = 15, start = 0;
//                const y = (slider_val * max) + start;
//                emitters[0].accel = y;
//                emitters[0].max_speed = 4;
//                emitters[1].accel = y;
//                emitters[1].max_speed = 4;
//             }, _);
//          }
//          { // Deccelerarion
//             const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Deccelerarion');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//             glow_controls_dp2.AddToMenu(slider);
//             slider.SetInitialValue(.48);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
//                const h = 1, k = -2.8, r = 3.8 * 3.8;
//                const x = slider_val;
//                let y = 0;
//                y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
//                emitters[0].deccel = y;
//                emitters[1].deccel = y;

//             }, _);
//          }
//          { // Set Emitter X Position
//             const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position X');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//             glow_controls_dp2.AddToMenu(slider);
//             slider.SetInitialValue(0);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//             Slider_connect(slider, (params, slider_val) => {

//                emitters[0].pos[0] = slider_val * VIEWPORT.WIDTH;
//                emitters[1].pos[0] = VIEWPORT.WIDTH - (slider_val * VIEWPORT.WIDTH);
//             }, _);
//          }
//          { // Set Emitter Y Position
//             const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//             glow_controls_dp2.AddToMenu(slider);
//             slider.SetInitialValue(0);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                emitters[0].pos[1] = slider_val * VIEWPORT.HEIGHT;
//                emitters[1].pos[1] = VIEWPORT.HEIGHT - (slider_val * VIEWPORT.HEIGHT);
//             }, _);
//          }

//       }

//    }








//    /****************************************************************************************************************/
//    // Emitter 3 


//    { // Emitter 3
//       const emitter_idx = Particle_system_create_emitter('SmokeParticles 3', TRANSPARENCY(BLUEL[9], .0), [0, 0, 0], dim, 1.5, 1, 2, .98, -.1, 3, TEXTURES.SMOKE_1);
//       const emitter = Particles_get_particle_system(emitter_idx);
//       emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
//       emitter.speed = speed;

//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
//       emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TEX2);

//       Particles_gen_gfx_ctx(emitter, _, particles_vb_groupidx);

//       emitter.SetConeOfDirection(.2, .2, .1, .1);

//       emitters[cnt] = emitter;
//       emitter_idxs[cnt] = emitter_idx;
//       cnt++
//    }








//    /****************************************************************************************************************/
//    // Emitter 3 controls

//    const ctrl_dp_emitt3 = Create_widget_dropdown(_, 'Emitter 3', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//    ctrl_dp_emitt3.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    ctrl_dp_emitt3.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//    ctrl_dp_emitt3.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//    { // Emitter 3 switch and label

//       const emitter_section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Emitter 3', label_style);
//       emitter_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       emitter_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

//       const label = Create_widget_label(_, 'Emitter 3', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       emitter_section.AddItem(label);

//       const emitter_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [14, 6, 2]);
//       emitter_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       emitter_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size[1]);
//       emitter_switch.SetName('emitter_switch switch 3');
//       emitter_section.AddItem(emitter_switch);

//       emitter_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//       const evt_params = { target_params: [emitter_idxs[2]] };
//       emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
//       emitter_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//       ctrl_dp_emitt3.AddToMenu(emitter_section);
//    }

//    { // Color picker switch and label

//       zpos = -1
//       const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker 3', label_style);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

//       // Create label
//       const label = Create_widget_label(_, 'Color Picker 3 label', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       color_picker.AddItem(label);
//       color_picker.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//       // Create switch
//       const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size[1]);
//       colorpicker_switch.SetName('color_picker 3 switch');
//       color_picker.AddItem(colorpicker_switch);

//       colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       colorpicker_switch.Bind(
//          (params) => {

//             /**
//              * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
//              * Explanation:
//              * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
//              * 
//              */
//             const switch_mesh = params.target_mesh;
//             const isOn = switch_mesh.isOn;


//             if (isOn) {

//                const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 0, _, _, _, _, _, _, 0x0, );

//                // colorpicker.SetTransparencySliderSetInitialValue(.10)
//                // colorpicker.SetHueSliderSetInitialValue(.80)

//                // Root_group_set_render_queue_priority(colorpicker.root_bufferidx);



//                colorpicker.AssignTargetMeshClbk((params) => {
//                   const color = params;

//                   // Add color to controls dropdown
//                   CopyArr4(ctrl_dp_emitt3.mat.col, color);
//                   CopyArr4(ctrl_dp_emitt3.mat.defCol, color);
//                   Gl_set_rgba(ctrl_dp_emitt3.gfx, color, ctrl_dp_emitt3.geom.num_faces);
//                   CopyArr4(emitters[2].mat.col, color);
//                });
//                switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
//             }
//             else {

//                const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
//                colorpicker.Destroy();
//             }
//          },
//          null, null,
//       );

//       ctrl_dp_emitt3.AddToMenu(color_picker);
//    }

//    { // Contol Params for shader params

//       const slider_feather = 2;
//       const slider_rcorners = 6;

//       const glow_controls_dp = Create_widget_dropdown(_, 'Shader Params', [0, 0, zpos], YELLOW[6], CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//       glow_controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//       glow_controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//       glow_controls_dp.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//       const emitter = emitters[0];

//       if (emitters[2].sid.unif & SID.UNIF.SCALE2) {
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Scale');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(.71);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 0;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);

//       }
//       if (emitters[2].sid.fx & SID.FX.FS_SMOKE_VEC3) {
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Noise UV Coord');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(.71);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 0;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);
//       }
//       if (emitters[2].sid.fx & SID.FX.FS_SMOKE_VEC3) {
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Cone Wideness');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(.78);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 1;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);
//       }
//       if (emitters[2].sid.fx & SID.FX.FS_SMOKE_VEC3) {
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Complexity');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp.AddToMenu(slider);
//          slider.SetInitialValue(.50);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const val_idx = 2;
//             // Find the ubidx
//             const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
//             Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//          }, _);
//       }

//       ctrl_dp_emitt3.AddToMenu(glow_controls_dp)
//    }

//    { // Contol Params for tarnsform and physics

//       const slider_feather = 2;
//       const slider_rcorners = 6;

//       const glow_controls_dp2 = Create_widget_dropdown(_, 'Transform Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//       glow_controls_dp2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       glow_controls_dp2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//       glow_controls_dp2.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       ctrl_dp_emitt3.AddToMenu(glow_controls_dp2)

//       { // Gravity
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.50);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             // Linear Interpolation
//             const max = 1, start = -.5;
//             const y = (slider_val * max) + start;
//             emitters[2].gravity = y;
//          }, _);
//       }
//       { // Acceleration
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.82);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             emitters[2].accel = slider_val;

//             // Linear Interpolation
//             const max = 15, start = 0;
//             const y = (slider_val * max) + start;
//             emitters[2].accel = y;
//             emitters[2].max_speed = 4;
//          }, _);
//       }
//       { // Deccelerarion
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Deccelerarion');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.35);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
//             const h = 1, k = -2.8, r = 3.8 * 3.8;
//             const x = slider_val;
//             let y = 0;
//             y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
//             emitters[2].deccel = y;

//          }, _);
//       }
//       { // Set Emitter X Position
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position X');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(0);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {
//             emitters[2].pos[0] = slider_val * VIEWPORT.WIDTH;
//          }, _);
//       }
//       { // Set Emitter Y Position
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.60);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             emitters[2].pos[1] = slider_val * VIEWPORT.HEIGHT - emitters[2].dim[1];
//          }, _);
//       }
//       { // Set Emitter Y Direction Up
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction Y Up ');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.12);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const max = -1, start = 0;
//             const y = (slider_val * max) + start;
//             emitters[2].variation_emission.ydir_neg = y;
//          }, _);
//       }
//       { // Set Emitter Y Direction Down
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction Y Down');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(0);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             const max = 1, start = 0;
//             const y = (slider_val * max) + start;
//             emitters[2].variation_emission.ydir_pos = y;
//          }, _);
//       }
//       { // Set Emitter Direction X Left
//          const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction X Left');
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
//          slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
//          glow_controls_dp2.AddToMenu(slider);
//          slider.SetInitialValue(.60);
//          slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//          Slider_connect(slider, (params, slider_val) => {

//             let max = 2, start = -1;
//             const y = (slider_val * max) + start;
//             emitters[2].variation_emission.xdir_pos = y;
//             emitters[2].variation_emission.xdir_neg = y;
//          }, _);

//       }

//    }








//    /****************************************************************************************************************/
//    // Side panel

//    const properties_panel = Create_side_panel_horizontal(ROOT_WIDGETS.CREATE_ROOT, _, VIEWPORT.HEIGHT / 2);
//    properties_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)

//    // Render properties panel
//    properties_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//    properties_panel.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
//    properties_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
//    properties_panel.Calc_no_gfx_update();

//    properties_panel.Render();
//    Root_group_activate_all_vbs_in_renderqueue(properties_panel.root_bufferidx);

//    Construct_listen_events_from_mesh_tree(properties_panel);
//    Construct_listen_events_relations_from_mesh_tree(properties_panel);

//    View_build_group_from_root_mesh(properties_panel);

//    properties_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, properties_panel.gfx.vb.groupidx);








//    /****************************************************************************************************************/
//    // Scrolled Section
//    const properties_btn = properties_panel.children.buffer[0];
//    const properties_label = properties_panel.children.buffer[1];
//    const scrolled_section_top = properties_panel.GetPosY() + properties_btn.geom.dim[1] * 2 + properties_label.geom.dim[1] * 2;
//    const scrolled_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [4, 4], [0, scrolled_section_top, 0], [100, 100], TRANSPARENCY(GREY[3], 1), 'ScrolledSection', [10, 0, 1.8]);

//    scrolled_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    scrolled_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//    scrolled_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

//    scrolled_section.AddItem(ctrl_dp_emitt12);
//    scrolled_section.AddItem(ctrl_dp_emitt3);

//    scrolled_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//    scrolled_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
//    scrolled_section.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, scrolled_section.mesh_bufferidx);
//    scrolled_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
//    scrolled_section.Calc_no_gfx_update();

//    scrolled_section.Render();
//    Root_group_activate_all_vbs_in_renderqueue(scrolled_section.root_bufferidx);

//    Construct_listen_events_from_mesh_tree(scrolled_section);
//    Construct_listen_events_relations_from_mesh_tree(scrolled_section);

//    Listeners_set_priority(E.C, ctrl_dp_emitt3.listeners);
//    Listeners_set_priority(E.C, ctrl_dp_emitt12.listeners);

//    View_build_group_from_root_mesh(scrolled_section);

//    scrolled_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scrolled_section.gfx.vb.groupidx);








//    /****************************************************************************************************************/
//    // Add scroller component
//    const scroller_component = Components_create_scroller_component(_, properties_panel.geom.dim[1] - (scrolled_section_top - properties_panel.GetPosY()) / 2 - 2, scrolled_section, scrolled_section.GetPosY(), TRANSPARENCY(GREY[0], .4), TRANSPARENCY(GREY[8], .2));
//    Scoller_component_gengfx_and_render(scroller_component, scrolled_section, GFX_CTX_FLAGS.ABSOLUTE_POSITION);
//    Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(scrolled_section.root_posidx, scroller_component.root_posidx);
//    Listeners_set_priority(E.C, scroller_component.listeners);








//    /****************************************************************************************************************/
//    // Add 

//    const prop_btn_col = Interpolate_rgb_to_01(10, 72, 160);
//    const time_ratio = prop_btn_col[1] / prop_btn_col[2]
//    const step = .006, min = 0.3, start_val = .0, has_start_val = false;
//    { // Animate Blue

//       const max = prop_btn_col[2];
//       Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, properties_btn, step, min, max, _, start_val, has_start_val)
//    }
//    { // Animate Green

//       const max = prop_btn_col[1];
//       Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, properties_btn, step * time_ratio, min * time_ratio, max, _, start_val, has_start_val)
//    }

//    const params = {
//       isOn: true,
//       section_pad: properties_panel.StylesGetPad(),
//       scroller_component: scroller_component,
//    };
//    properties_btn.ChangeListenEvent(E.C,
//       (params) => {


//          const section = params.evt_params.section;
//          const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
//          const isOn = params.evt_params.rest_params.isOn;
//          const section_pad = params.evt_params.rest_params.section_pad;
//          const scroller_component = params.evt_params.rest_params.scroller_component;
//          const reduce_val = section.geom.dim[1] * 2 / 10;

//          if (isOn) { // Close Panel

//             Callback_animations_create( // Close Panel
//                (params) => { // Run Animation

//                   let reduce_val = params.reduce_val;
//                   const unif_wpos = Mesh_unif_get_vb_root_wposy(section.root_posidx);
//                   if (unif_wpos + reduce_val < VIEWPORT.HEIGHT - btn.geom.dim[1] * 2 - section_pad[0] * 2) {

//                      const section = params.section;
//                      Mesh_unif_add_vb_root_wposy(section.root_posidx, reduce_val);

//                      // Move scrollbar
//                      scroller_component.geom.pos[1] += reduce_val;
//                      scroller_component.geom.AddWposY(scroller_component.gfx, reduce_val);
//                      const handle = scroller_component.children.buffer[0];
//                      handle.geom.pos[1] += reduce_val;
//                      handle.geom.AddWposY(handle.gfx, reduce_val);

//                      // Move the scrolled section
//                      const scrolled_section = scroller_component.scrolled_section;
//                      Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, reduce_val);

//                      if (params.reduce_val > 5) params.reduce_val *= .9

//                      return true;
//                   }

//                   return false;
//                },
//                () => { // Stop Animation

//                   return false;
//                },
//                { section: section, reduce_val: reduce_val }
//             );

//             params.evt_params.rest_params.isOn = false;
//          }
//          else { // Open Panel

//             Callback_animations_create(
//                (params) => { // Run Animation

//                   let reduce_val = params.reduce_val;
//                   const unif_wpos = Mesh_unif_get_vb_root_wposy(section.root_posidx);
//                   if (unif_wpos > VIEWPORT.HEIGHT - section.geom.dim[1] * 2) {

//                      const section = params.section;
//                      Mesh_unif_add_vb_root_wposy(section.root_posidx, -reduce_val);

//                      // Move scrollbar
//                      scroller_component.geom.pos[1] -= reduce_val;
//                      scroller_component.geom.AddWposY(scroller_component.gfx, -reduce_val);
//                      const handle = scroller_component.children.buffer[0];
//                      handle.geom.pos[1] -= reduce_val;
//                      handle.geom.AddWposY(handle.gfx, -reduce_val);

//                      // Move the scrolled section
//                      const scrolled_section = scroller_component.scrolled_section;
//                      Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, -reduce_val);

//                      if (params.reduce_val > 5) params.reduce_val *= .9

//                      return true;
//                   }

//                   return false;
//                },
//                () => { // Stop Animation

//                   return false;
//                },
//                { section: section, reduce_val: reduce_val }
//             );

//             params.evt_params.rest_params.isOn = true;
//          }


//       }
//       , { section: properties_panel, rest_params: params },
//    );

// }



// export function Demo_ball_tail_2(root_widget = ROOT_WIDGETS.CREATE_ROOT, width, height) { // Side Panel 


//    width = VIEWPORT.WIDTH / 2 - 200;








//    /****************************************************************************************************************/
//    // BallTail
//    const balltail_section_xpos = 4;
//    const balltail_section_ypos = 43;
//    const tail_particles = Create_comet_particles(balltail_section_xpos, balltail_section_ypos, width, height, 1, 0x0);
//    const noise_particles_buffer = tail_particles.noise_particles_buffer
//    const glow_particles_buffer = tail_particles.glow_particles_buffer;



//    let zpos = 1;
//    const header_font_size = 9 * DEVICE.device_scale;
//    const regular_font_size = 8 * DEVICE.device_scale;
//    const trans = 1

//    const u_wpos_flags = {
//       unif: SID.UNIF.ROOT_WPOS2,
//       pass: SID.PASS.WPOS2,
//    }







//    /****************************************************************************************************************/
//    // Create Sliders for manipulating variables of particles

//    const controls_dp = Create_widget_dropdown(_, 'Ball Tail Demo', [0, 0, zpos], TRANSPARENCY(GREY[4], .2), GREY[1], WHITE, [10, 4], _, _, header_font_size, [6, 0, 2], [4, 4],);
//    controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    controls_dp.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//    Dropdown_roots_set_root(controls_dp, controls_dp);

//    controls_dp.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


//    { // Create sliders and colorpicker

//       zpos++;

//       /****************************************************************************************************************/
//       // Create the switch to create/destroy colorpicker for particles color control

//       // Style for the Section widgets.
//       const section_pad = [0, 0];
//       const clp_fontsize = regular_font_size;

//       // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
//       const label_style = [6, 0, 2];
//       const label_pad = [6, 6];
//       const label_col = TRANSPARENCY(BLUEL[1], 0);
//       const label_text_col = WHITE;

//       // Style for the switch widgets
//       const switch_size = 19 * DEVICE.device_scale;
//       const switch_pad = 4;
//       const switch_col = TRANSPARENCY(YELLOWL[1], 1);
//       const switch_col2 = TRANSPARENCY(GREY[1], trans);
//       const section_col = TRANSPARENCY(YELLOWL[5], 1.);





//       const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       color_picker.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);
//       color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

//       const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//       label.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[0]);
//       color_picker.AddItem(label);

//       const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//       colorpicker_switch.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, switch_size);
//       colorpicker_switch.SetName('color_picker switch');
//       color_picker.AddItem(colorpicker_switch);

//       colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       const x = 0, y = 0
//       colorpicker_switch.Bind(
//          (params) => {

//             /**
//              * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
//              * Explanation:
//              * 
//             */
//             // This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
//             const switch_mesh = params.target_mesh;
//             const noise_particles_buffer = params.params.noise_particles_buffer;
//             const glow_particles_buffer = params.params.glow_particles_buffer;
//             const isOn = switch_mesh.isOn;


//             if (isOn) {

//                const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, x, y + tail_particles.section.geom.dim[1] * 2, _, _, _, _, _, _, 0x0, );

//                Root_group_set_render_queue_priority(colorpicker.root_bufferidx);

//                colorpicker.AssignTargetMeshClbk((params) => {

//                   const color = params;
//                   CopyArr4(noise_particles_buffer[0].mat.col, color);
//                   CopyArr4(glow_particles_buffer[0].mat.col, color);
//                });
//                switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
//             }
//             else {

//                const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
//                colorpicker.Destroy();
//             }
//          },
//          null,
//          {
//             noise_particles_buffer: noise_particles_buffer,
//             glow_particles_buffer: glow_particles_buffer,
//          },
//       );

//       controls_dp.AddToMenu(color_picker);








//       /****************************************************************************************************************/
//       // Tail Particle System: Control Sliders 
//       const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
//       const slider_col = GREY[2]
//       const tail_buffer_len = noise_particles_buffer.length;
//       for (let i = 0; i < tail_buffer_len; i++) {

//          const ball_tail_ctrl_color = REDL[9];

//          const ball_tail_controls = Create_widget_dropdown(_, 'Ball Tail Controls', [0, 0, zpos], ball_tail_ctrl_color, GREY[1], WHITE, [4, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//          ball_tail_controls.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//          ball_tail_controls.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[10]);

//          const emitter = noise_particles_buffer[i];

//          { // Slider 1 contol
//             const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Speed');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//             slider.SetInitialValue(.27);
//             ball_tail_controls.AddToMenu(slider);
//             slider.SetColorHandleNoGfxUpdate(ball_tail_ctrl_color);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                let min = .8; // The min value gives the prolonged glow_emitter
//                let max = 1.; // Calculate that the max value will be +1+min
//                const rev_slider_val = 1 - slider_val;
//                emitter.t_step = rev_slider_val + min + ((max - slider_val) * (rev_slider_val));
//                emitter.speed = (slider_val + 1) * 3;
//             }, _);

//          }
//          { // Slider 2 contol: Uniform value in fragment shader
//             const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Intensity');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//             slider.SetInitialValue(.20);
//             ball_tail_controls.AddToMenu(slider);
//             slider.SetColorHandleNoGfxUpdate(ball_tail_ctrl_color);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                const val_idx = 1;
//                // Find the ubidx
//                const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
//                Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//             }, _);

//          }
//          { // Slider 3 contol: Uniform value in fragment shader
//             const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Fire Variation');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//             slider.SetInitialValue(1);
//             ball_tail_controls.AddToMenu(slider);
//             slider.SetColorHandleNoGfxUpdate(ball_tail_ctrl_color);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                const val_idx = 0;
//                // Find the ubidx
//                const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
//                Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//             }, _);
//          }
//          { // Slider 4 contol: Uniform value in fragment shader
//             const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Noise Complexity');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//             slider.SetInitialValue(.50);
//             ball_tail_controls.AddToMenu(slider);
//             slider.SetColorHandleNoGfxUpdate(ball_tail_ctrl_color);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                const val_idx = 2;
//                // Find the ubidx
//                const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
//                Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//             }, _);
//          }

//          controls_dp.AddToMenu(ball_tail_controls);
//       }

//       // Glow Particle System: Control Sliders 
//       const glow_buffer_len = glow_particles_buffer.length;
//       for (let i = 0; i < glow_buffer_len; i++) {

//          const glow_particles_ctrl_color = YELLOWL[6];

//          const glow_emitter = glow_particles_buffer[i];
//          const glow_particles_controls = Create_widget_dropdown(_, 'Glow Particles Controls', [0, 0, zpos], glow_particles_ctrl_color, GREY[1], WHITE, [4, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
//          glow_particles_controls.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, label_style[2]);
//          glow_particles_controls.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, label_style[10]);

//          const emitter = glow_particles_buffer[i];

//          {
//             const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Distance');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//             glow_particles_controls.AddToMenu(slider);
//             slider.SetInitialValue(0);
//             slider.SetColorHandleNoGfxUpdate(glow_particles_ctrl_color);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                const val_idx = 0;
//                // Find the ubidx
//                const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//                Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//             }, _);
//          }
//          {
//             const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Brighter');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//             glow_particles_controls.AddToMenu(slider);
//             slider.SetInitialValue(1);
//             slider.SetColorHandleNoGfxUpdate(glow_particles_ctrl_color);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                const val_idx = 1;
//                // Find the ubidx
//                const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//                Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//             }, _);
//          }
//          {
//             const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Intensity');
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//             slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//             glow_particles_controls.AddToMenu(slider);
//             slider.SetInitialValue(.03);
//             slider.SetColorHandleNoGfxUpdate(glow_particles_ctrl_color);
//             slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//             Slider_connect(slider, (params, slider_val) => {

//                const val_idx = 2;
//                // Find the ubidx
//                const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_glow_params');
//                Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

//             }, _);
//          }

//          controls_dp.AddToMenu(glow_particles_controls);
//       }

//    }








//    /****************************************************************************************************************/
//    // Side panel
//    if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {

//       const properties_panel = Create_side_panel(ROOT_WIDGETS.CREATE_ROOT);

//       // Add the ballTail control properties to the properties panel
//       const inner_section = properties_panel.children.buffer[1];

//       inner_section.AddItem(controls_dp);

//       properties_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       properties_panel.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX

//       properties_panel.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
//       properties_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, properties_panel.mesh_bufferidx);
//       properties_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC);
//       properties_panel.Recalc_no_gfx_update();
//       properties_panel.Render();

//       Root_group_activate_all_vbs_in_renderqueue(properties_panel.root_bufferidx);

//       properties_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, properties_panel.gfx.vb.groupidx);

//       Construct_listen_events_from_mesh_tree(properties_panel);
//       Construct_listen_events_relations_from_mesh_tree(properties_panel);

//       View_build_group_from_root_mesh(properties_panel);


//       const scroller_component = Components_create_scroller_component(_, 100, controls_dp, controls_dp.GetPosY(),);
//       Scoller_component_gengfx_and_render(scroller_component, controls_dp);
//       Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(controls_dp.root_posidx, scroller_component.root_posidx);


//       // Set scissor box
//       const mx = controls_dp.mesh_bufferidx;
//       const my = scroller_component.mesh_bufferidx;
//       const mw = controls_dp.mesh_bufferidx;
//       const mh = scroller_component.mesh_bufferidx;
//       Vertex_buffer_group_create_scissorbox(controls_dp.gfx.vb.groupidx, mx, my, mw, mh);


//       const properties_btn = properties_panel.children.buffer[0];


//       const params = {
//          isOn: true,
//          section_pad: properties_panel.StylesGetPad(),
//          scroller_component: scroller_component,
//       };
//       properties_btn.ChangeListenEvent(E.C,
//          (params) => {


//             const section = params.evt_params.section;
//             const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
//             const isOn = params.evt_params.rest_params.isOn;
//             const section_pad = params.evt_params.rest_params.section_pad;
//             const reduce_val = section.geom.dim[0] * 2 / 10;

//             if (isOn) { // Close Panel

//                Callback_animations_create( // Close Panel
//                   (params) => { // Run Animation

//                      let reduce_val = params.reduce_val;
//                      const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);

//                      if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - section_pad[0] * 2) {

//                         const section = params.section;
//                         Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

//                         if (params.reduce_val > 5) params.reduce_val *= .9

//                         return true;
//                      }

//                      return false;
//                   },
//                   () => { // Stop Animation

//                      return false;
//                   },
//                   { section: section, reduce_val: reduce_val }
//                );

//                params.evt_params.rest_params.isOn = false;
//             }
//             else { // Open Panel

//                Callback_animations_create(
//                   (params) => { // Run Animation

//                      let reduce_val = params.reduce_val;
//                      const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);
//                      if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2) {

//                         const section = params.section;
//                         Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

//                         if (params.reduce_val > 5) params.reduce_val *= .9

//                         return true;
//                      }

//                      return false;
//                   },
//                   () => { // Stop Animation

//                      return false;
//                   },
//                   { section: section, reduce_val: reduce_val }
//                );

//                params.evt_params.rest_params.isOn = true;
//             }


//          }
//          , { section: properties_panel, rest_params: params },
//       );
//    }

//    return controls_dp;

// }



// export function Demo_all() { // Side Panel 

//    // Ball-tail particles emitter and properies controls
//    const ball_tail_controls = Demo_ball_tail_2(0x0, (VIEWPORT.WIDTH / 2),)
//    ball_tail_controls.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
//    ball_tail_controls.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, ball_tail_controls.mesh_bufferidx);

//    // glow particles emitter and properies controls
//    const glow_controls = Demo_glow_particles_2(0x0, 0, VIEWPORT.HEIGHT)
//    glow_controls.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
//    glow_controls.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, glow_controls.mesh_bufferidx);








//    /****************************************************************************************************************/
//    // Side panel

//    const properties_panel = Create_side_panel_horizontal(ROOT_WIDGETS.CREATE_ROOT, _, VIEWPORT.HEIGHT / 2);
//    properties_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)

//    // Render properties panel
//    properties_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//    properties_panel.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
//    properties_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
//    properties_panel.Calc_no_gfx_update();

//    properties_panel.Render();
//    Root_group_activate_all_vbs_in_renderqueue(properties_panel.root_bufferidx);


//    Construct_listen_events_from_mesh_tree(properties_panel);
//    Construct_listen_events_relations_from_mesh_tree(properties_panel);

//    View_build_group_from_root_mesh(properties_panel);

//    properties_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, properties_panel.gfx.vb.groupidx);





//    const properties_label = properties_panel.children.buffer[1];
//    const properties_btn = properties_panel.children.buffer[0];
//    const scrolled_section_top = properties_panel.GetPosY() + properties_btn.geom.dim[1] * 2 + properties_label.geom.dim[1] * 2;

//    const scrolled_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [4, 4], [0, scrolled_section_top, 0], [100, 100], TRANSPARENCY(GREY[3], 1), 'ScrolledSection', [10, 0, 1.8]);

//    scrolled_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
//    scrolled_section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
//    scrolled_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

//    scrolled_section.AddItem(ball_tail_controls);
//    scrolled_section.AddItem(glow_controls);

//    scrolled_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

//    // scrolled_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
//    scrolled_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
//    scrolled_section.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, scrolled_section.mesh_bufferidx);
//    scrolled_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
//    scrolled_section.Calc_no_gfx_update();

//    scrolled_section.Render();
//    Root_group_activate_all_vbs_in_renderqueue(scrolled_section.root_bufferidx);


//    Construct_listen_events_from_mesh_tree(scrolled_section);
//    Construct_listen_events_relations_from_mesh_tree(scrolled_section);

//    Listeners_set_priority(E.C, glow_controls.listeners);
//    Listeners_set_priority(E.C, ball_tail_controls.listeners);

//    View_build_group_from_root_mesh(scrolled_section);

//    scrolled_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scrolled_section.gfx.vb.groupidx);




//    // Add scroller component
//    const scroller_component = Components_create_scroller_component(_, properties_panel.geom.dim[1] - (scrolled_section_top - properties_panel.GetPosY()) / 2 - 2, scrolled_section, scrolled_section.GetPosY(), TRANSPARENCY(GREY[0], .4), TRANSPARENCY(GREY[8], .2));
//    Scoller_component_gengfx_and_render(scroller_component, scrolled_section, GFX_CTX_FLAGS.ABSOLUTE_POSITION);
//    Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(scrolled_section.root_posidx, scroller_component.root_posidx);
//    Listeners_set_priority(E.C, scroller_component.listeners);


//    const mx = scrolled_section.mesh_bufferidx;
//    const my = scroller_component.mesh_bufferidx;
//    const mw = scrolled_section.mesh_bufferidx;
//    const mh = scroller_component.mesh_bufferidx;
//    Vertex_buffer_group_create_scissorbox(scrolled_section.gfx.vb.groupidx, mx, my, mw, mh);








//    /****************************************************************************************************************/
//    // 

//    const prop_btn_col = Interpolate_rgb_to_01(10, 72, 160);
//    const time_ratio = prop_btn_col[1] / prop_btn_col[2]
//    const step = .006, min = 0.3, start_val = .0, has_start_val = false;
//    { // Animate Blue

//       const max = prop_btn_col[2];
//       Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, properties_btn, step, min, max, _, start_val, has_start_val)
//    }
//    { // Animate Green

//       const max = prop_btn_col[1];
//       Mesh_animations_create(ANIMATIONS.TYPE.COLOR | ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, properties_btn, step * time_ratio, min * time_ratio, max, _, start_val, has_start_val)
//    }

//    const params = {
//       isOn: true,
//       section_pad: properties_panel.StylesGetPad(),
//       scroller_component: scroller_component,
//    };
//    properties_btn.ChangeListenEvent(E.C,
//       (params) => {

//          const section = params.evt_params.section;
//          const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
//          const isOn = params.evt_params.rest_params.isOn;
//          const section_pad = params.evt_params.rest_params.section_pad;
//          const scroller_component = params.evt_params.rest_params.scroller_component;
//          const reduce_val = section.geom.dim[1] * 2 / 10;

//          if (isOn) { // Close Panel

//             Callback_animations_create( // Close Panel
//                (params) => { // Run Animation

//                   let reduce_val = params.reduce_val;
//                   const unif_wpos = Mesh_unif_get_vb_root_wposy(section.root_posidx);
//                   if (unif_wpos + reduce_val < VIEWPORT.HEIGHT - btn.geom.dim[1] * 2 - section_pad[0] * 2) {

//                      const section = params.section;
//                      Mesh_unif_add_vb_root_wposy(section.root_posidx, reduce_val);

//                      // Move scrollbar
//                      scroller_component.geom.pos[1] += reduce_val;
//                      scroller_component.geom.AddWposY(scroller_component.gfx, reduce_val);
//                      const handle = scroller_component.children.buffer[0];
//                      handle.geom.pos[1] += reduce_val;
//                      handle.geom.AddWposY(handle.gfx, reduce_val);

//                      // Move the scrolled section
//                      const scrolled_section = scroller_component.scrolled_section;
//                      Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, reduce_val);

//                      if (params.reduce_val > 5) params.reduce_val *= .9

//                      return true;
//                   }

//                   return false;
//                },
//                () => { // Stop Animation

//                   return false;
//                },
//                { section: section, reduce_val: reduce_val }
//             );

//             params.evt_params.rest_params.isOn = false;
//          }
//          else { // Open Panel

//             Callback_animations_create(
//                (params) => { // Run Animation

//                   let reduce_val = params.reduce_val;
//                   const unif_wpos = Mesh_unif_get_vb_root_wposy(section.root_posidx);
//                   if (unif_wpos > VIEWPORT.HEIGHT - section.geom.dim[1] * 2) {

//                      const section = params.section;
//                      Mesh_unif_add_vb_root_wposy(section.root_posidx, -reduce_val);

//                      // Move scrollbar
//                      scroller_component.geom.pos[1] -= reduce_val;
//                      scroller_component.geom.AddWposY(scroller_component.gfx, -reduce_val);
//                      const handle = scroller_component.children.buffer[0];
//                      handle.geom.pos[1] -= reduce_val;
//                      handle.geom.AddWposY(handle.gfx, -reduce_val);

//                      // Move the scrolled section
//                      const scrolled_section = scroller_component.scrolled_section;
//                      Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, -reduce_val);

//                      if (params.reduce_val > 5) params.reduce_val *= .9

//                      return true;
//                   }

//                   return false;
//                },
//                () => { // Stop Animation

//                   return false;
//                },
//                { section: section, reduce_val: reduce_val }
//             );

//             params.evt_params.rest_params.isOn = true;
//          }


//       }
//       , { section: properties_panel, rest_params: params },
//    );


// }
