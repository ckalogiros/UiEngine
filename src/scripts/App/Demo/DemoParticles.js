"use strict";



import { Create_rect_mesh, Create_widget_button, Create_widget_dropdown, Create_widget_label, Create_widget_slider, Create_widget_switch_simple } from '../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js';
import { Mesh_buffer_get_mesh_byidx } from '../../Engine/Core/MeshBuffer.js';
import { View_build_group_from_root_mesh } from '../../Engine/Core/Views/MeshBufferViews.js';
import { Mesh_unif_get_vb_root_wpos } from '../../Engine/Core/MeshUniformsBuffer.js';
import { Root_group_activate_all_vbs_in_renderqueue } from '../../Engine/Core/Views/RootView.js';
import { BLACK, BLUEL, Color_hsv_to_rgb_calibrated, GREENL, GREY, ORANGER, PURPLEB, WHITE, YELLOWL, YELLOWR } from '../../Engine/Drawables/Material/Colors.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../../Engine/Events/EventFunctions.js';
import { Dropdown_roots_set_root } from '../../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Slider_connect } from '../../Engine/Drawables/Widgets/WidgetSlider.js';
import { Switch_simple_time_interval_callback } from '../../Engine/Drawables/Widgets/WidgetSwitch.js';
import { Particle_system_create_emitter, Particle_system_emitt, Particles_get_particle_system, Particles_gen_gfx_ctx, Particle_system_init_particles } from '../../Engine/ParticlesSystem/ParticlesSystem.js';
import { Time_intervals_create } from '../../Engine/Timers/TimeIntervals.js';
import { Timer_get_global_timer, Timer_get_global_timer_cycle } from '../../Engine/Timers/Timers.js';
import { CopyArr4 } from '../../Helpers/Math/MathOperations.js';
import { Demo_widgets_colorpicker } from './DemoWidgets.js';
import { Controls_create_slider_controls_from_shader_uniform_buffer } from '../../Engine/Drawables/Widgets/Helpers/WidgetGenericControlsReady.js';
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties, Style_switch_default_properties } from '../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js';
import { Mesh_add_wpos_xy } from '../../Engine/Drawables/Operations/MeshAttributesFunctions.js';
import { Align_nested_sections_pre } from '../../Engine/Drawables/Operations/AlignNestedSections.js';
import { Color_theme_label_auto, Color_theme_slider_auto, Color_theme_switch_auto } from '../../Engine/Drawables/Material/Themes.js';
import { Widget_render } from '../../Engine/Drawables/Widgets/Helpers/WidgetRender.js';


const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
const text_pad = [16, 10];


// const control_parameters = {

//    generic:[], // u_generic_controls unniform buffer
//    scale:.2, // 'Particle Scale'
//    gravity:.5, // 'Gravity'
//    acceleration:.7, // 'Acceleration'
//    deccelerarion:.5, // 'Deccelerarion'
//    emitter_pos_x:.5, // 'Emitter Position X'
//    emitter_pos_y:.5, // 'Emitter Position Y'
//    dir_y_up:.05, // 'Direction Y Up '
//    dir_y_down:.05, // 'Direction Y Down'
//    dir_x:.5, // 'Direction in X'

// };







/*********************************************************************************************************************************************************************************************/
/** Glow Particles
 * Uppon calling 'Create_glow_particles()', an emitter is created along with the switch to enable it
 * and a switch for the colorpicker to change the particles color. 
 * There is a choise of creating the controls to manipulate all other kinds of variables of the particles system,
 * or use the next function 'Create_particles_controls()', to create the controls seperately
 * and combine them at the call in any way.
 */
/*********************************************************************************************************************************************************************************************/


export function Create_glow_particles(x = 0, y = 0, root_widget = 0x0, controls_create = true, num_particles_per_frame, scale_down=.2, transform_parameters=null) { // 3 control Sliders 

   const particles_size = 20;
   const rcorners = 10;




   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   let emitter1_idx = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [particles_size, particles_size], .006, 1, 4, .98, .1, 4, _, num_particles_per_frame, scale_down);
   let emitter = Particles_get_particle_system(emitter1_idx);
   Widget_gfx_ready_enable({ mesh: emitter, enable_sdf_rect: particles_size, enable_unif_scale: true });

   const generic_controls_parameters = [.0, 1., 1.];
   emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, generic_controls_parameters.length);

   emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   emitter.EnableProperties(PARTICLES.HAS_FADE);

   emitter.GfxEnableFn(SID.SHAD.FN_GLOW, { time: 0, });





   {

      // emitter.EnableGfx(SID.SHAD.FN_GLOW);

      // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   }


   // For default glow particles change:SetConeOfDirection(), gravity, diry -+ and dirx in controls
   emitter.SetConeOfDirection(.1, .1, .05, -.05);


   if(transform_parameters) {
      // The values are interpolated based on 'Create_particles_controls()' 

      {
         const max = 1, start = -.5;
         const v = (transform_parameters[0] * max) + start;
         emitter.gravity = v;
      }
      {
         const max = 25, start = 0;
         const v = (transform_parameters[1] * max) + start;
         emitter.accel = v;
         emitter.max_speed = 4;
      }
      {
         const h = 1, k = -2.8, r = 3.8 * 3.8;
         const x = transform_parameters[2];
         const v = Math.sqrt(-((x - h) * (x - h)) + r) + k;
         emitter.deccel = v;
      }
      {
         const v = transform_parameters[3] * VIEWPORT.WIDTH;
         emitter.geom.pos[0] = v;
      }
      {
         const v = transform_parameters[4] * VIEWPORT.HEIGHT;
         emitter.geom.pos[1] = v;
      }
   }




   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 1], col: TRANSPARENCY(GREY[1], .5), name: 'Emitter Window Panel', }));
   Widget_gfx_ready_enable({ mesh: controls_section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })



   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   Particles_gen_gfx_ctx(emitter, controls_section);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformSetAndUpdate('u_generic_controls', generic_controls_parameters);



   const zpos = -1

   const switch_panel = Create_emitt_switch_panel({ z: zpos, emitter: emitter, emitt_options: { continuous_emitt: true, button_pres_emitt: true } });
   controls_section.AddItem(switch_panel);

   const colorpicker_panel = Create_color_picker_switch_panel(zpos, emitter);
   controls_section.AddItem(colorpicker_panel);



   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const parameters = [.48, .5, .19, .08, .4, .04, .04, .55];
      // const parameters = [0.2, .48, .5, .19, .08, .4, .04, .55];
      const controls_buffer = Create_particles_controls(emitter, YELLOWL[4], parameters, generic_controls_parameters, 'u_generic_controls');

      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }


   controls_section.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);


   /****************************************************************************************************************/
   // Render 
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      // controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();

      Align_nested_sections_pre(controls_section);

      Widget_render(controls_section);
   }

   return {
      emitter: emitter,
      controls_section: controls_section,
   };

}




/*********************************************************************************************************************************************************************************************/
/** Glow-Particles. Testing with different shaders */
// TODO: For attributes we need to implement the controls to control vb attribs
export function Demo_glow_particles_explosion_shaders(x = 0, y = 0, root_widget = 0x0, particles_size = 100, controls_create = true, num_particles_per_frame, transform_parameters=null, generic_controls_parameters=null) { // 3 control Sliders 

   const scale_down = .2;
   const rcorners = 10;



   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   let emitter1_idx = Particle_system_create_emitter('Particle System Emitter: Tests', TRANSPARENCY(BLUEL[9], .2), [x, y, 10], [particles_size, particles_size], .006, 1, 4, .98, .1, 4, _, num_particles_per_frame, scale_down);
   let emitter = Particles_get_particle_system(emitter1_idx);
   // Widget_gfx_ready_enable({mesh:emitter, enable_sdf_rect:particles_size, enable_unif_scale:true, });
   Widget_gfx_ready_enable({ mesh: emitter, enable_unif_scale: true, });

   emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   emitter.EnableProperties(PARTICLES.HAS_JIGGLE, { jigglex: 3.5, jiggley: 6 });
   emitter.EnableProperties(PARTICLES.HAS_FADE);


   emitter.GfxEnableFn(SID.SHAD.FN_EXPLOSION_CIRCLE, { time: .0, generic: { a: .0, b: .23 }, blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY });

   // emitter.GfxEnableFn(SID.SHAD.FN_INNER_SHADOW, {blend_mode:flag++});
   // emitter.EnableGfxUniforms({ unif:SID.UNIF.BLEND_MODE } , 'u_blend_mode', UNIF_TYPE.INT, UNIFORM.IN_FS);


   // emitter.EnableGfx(SID.SHAD.FN_GLOW);

   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);




   // For default glow particles change:SetConeOfDirection(), gravity, diry -+ and dirx in controls
   emitter.SetConeOfDirection(-.1, .1, .05, -.05);

   if(transform_parameters) {
      // The values are interpolated based on 'Create_particles_controls()' 

      {
         const max = 1, start = -.5;
         const v = (transform_parameters[0] * max) + start;
         emitter.gravity = v;
      }
      {
         const max = 25, start = 0;
         const v = (transform_parameters[1] * max) + start;
         emitter.accel = v;
         emitter.max_speed = 4;
      }
      {
         const h = 1, k = -2.8, r = 3.8 * 3.8;
         const x = transform_parameters[2];
         const v = Math.sqrt(-((x - h) * (x - h)) + r) + k;
         emitter.deccel = v;
      }
      {
         const v = transform_parameters[3] * VIEWPORT.WIDTH;
         emitter.geom.pos[0] = v;
      }
      {
         const v = transform_parameters[4] * VIEWPORT.HEIGHT;
         emitter.geom.pos[1] = v;
      }
   }


   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 1], col: TRANSPARENCY(GREY[1], .5), name: 'Emitter Window Panel', }));
   Widget_gfx_ready_enable({ mesh: controls_section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   Particles_gen_gfx_ctx(emitter, controls_section);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   // emitter.GfxUniformSetAndUpdate('u_generic_controls', [1, 0, 0]);
   emitter.GfxUniformsSetClbk('u_blend_mode', () => {
      return emitter.sid.blend_options;
   }, emitter.gfx.vb.groupidx);




   const zpos = -1

   const switch_panel = Create_emitt_switch_panel({ z: zpos, emitter: emitter, emitt_options: { continuous_emitt: true, button_pres_emitt: true } });
   controls_section.AddItem(switch_panel);

   const colorpicker_panel = Create_color_picker_switch_panel(zpos, emitter);
   controls_section.AddItem(colorpicker_panel);


   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function


      // const parameters = [.48, .5, .47, .08, .4, .04, .04, .55];
      // const generic_controls_parameters = [.7, 1., .12];
      // const controls_buffer = Create_particles_controls(emitter, YELLOWL[4], parameters, generic_controls_parameters, 'u_generic_controls');
      const controls_buffer = Create_particles_controls(emitter, YELLOWL[4], transform_parameters, generic_controls_parameters, 'u_generic_controls');
      // const controls_buffer = Create_particles_controls(emitter, YELLOWL[4], parameters, generic_controls_parameters, );




      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }


   controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION | GFX_CTX_FLAGS.ABSOLUTE_POSITION, _, true);
   controls_section.GfxCtxAddFlag(_, controls_section.mesh_bufferidx, true);
   // controls_section.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);


   /****************************************************************************************************************/
   // Render 
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      // controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();

      Align_nested_sections_pre(controls_section);

      controls_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);

      controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(controls_section);
      Construct_listen_events_relations_from_mesh_tree(controls_section);

   }

   return {
      emitter: emitter,
      controls_section: controls_section,
   };

}




/*********************************************************************************************************************************************************************************************/
/** Using FN_EXPLOSION_CIRCLE to create sparks effect. The difference is there is no sdf_rect enabled for the mesh and the blend mode is multiply */
export function Demo_glow_particles_sparkles_effect(x = 0, y = 0, root_widget = 0x0, particles_size = 100, controls_create = true, num_particles_per_frame, transform_parameters=null, generic_controls_parameters=null) { // 3 control Sliders 

   const scale_down = .25;
   const rcorners = 10;





   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   let emitter1_idx = Particle_system_create_emitter('Emitter:Sparkles', PURPLEB[9], [x, y, 10], [particles_size, particles_size], .006, 1, 4, .98, .1, 4, _, num_particles_per_frame, scale_down);
   let emitter = Particles_get_particle_system(emitter1_idx);
   Widget_gfx_ready_enable({ mesh: emitter, enable_unif_scale: true, })

   emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   emitter.EnableProperties(PARTICLES.HAS_JIGGLE, { jigglex: 1.5, jiggley: 2 });
   emitter.EnableProperties(PARTICLES.HAS_FADE);


   // New attrib Enable implementation
   emitter.GfxEnableFn(SID.SHAD.FN_EXPLOSION_CIRCLE, { time: .8, generic: { a: .02, b: .6 }, blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY });



   emitter.SetConeOfDirection(.1, .1, -.05, .05);

   if(transform_parameters) {
      // The values are interpolated based on 'Create_particles_controls()' 

      {
         const max = 1, start = -.5;
         const v = (transform_parameters[0] * max) + start;
         emitter.gravity = v;
      }
      {
         const max = 25, start = 0;
         const v = (transform_parameters[1] * max) + start;
         emitter.accel = v;
         emitter.max_speed = 4;
      }
      {
         const h = 1, k = -2.8, r = 3.8 * 3.8;
         const x = transform_parameters[2];
         const v = Math.sqrt(-((x - h) * (x - h)) + r) + k;
         emitter.deccel = v;
      }
      {
         const v = transform_parameters[3] * VIEWPORT.WIDTH;
         emitter.geom.pos[0] = v;
      }
      {
         const v = transform_parameters[4] * VIEWPORT.HEIGHT;
         emitter.geom.pos[1] = v;
      }
   }
   // if (emitter.properties_flags & PARTICLES.HAS_JIGGLE) {


   //    { // Jiggle X
   //       // Linear Interpolation
   //       const max = 10, start = 0;
   //       const val = (0 * max) + start;
   //       emitter.jigglex = val;
   //    }
   //    { // Jiggle Y
   //       // Linear Interpolation
   //       const max = 10, start = 0;
   //       const val = (0 * max) + start;
   //       emitter.jiggley = val;
   //    }
   // }


   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 1], col: TRANSPARENCY(GREY[1], .5), name: 'Emitter Window Panel', }));
   Widget_gfx_ready_enable({ mesh: controls_section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   Particles_gen_gfx_ctx(emitter, controls_section);

   Particle_system_init_particles(emitter);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformsSetClbk('u_blend_mode', () => { return emitter.sid.blend_options; }, emitter.gfx.vb.groupidx);




   const zpos = -1

   const switch_panel = Create_emitt_switch_panel({ z: zpos, emitter: emitter, emitt_options: { continuous_emitt: true, button_pres_emitt: true } });
   controls_section.AddItem(switch_panel);

   const colorpicker_panel = Create_color_picker_switch_panel(zpos, emitter);
   controls_section.AddItem(colorpicker_panel);




   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function


      const parameters = [.48, .6, .35, .08, .4, .04, .04, .55];
      // const generic_controls_parameters = [.7, 1., .12];
      const controls_buffer = Create_particles_controls(emitter, YELLOWL[4], parameters, _,);


      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }


   controls_section.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);


   /****************************************************************************************************************/
   // Render 
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      // controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();

      Align_nested_sections_pre(controls_section);

      controls_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);

      controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(controls_section);
      Construct_listen_events_relations_from_mesh_tree(controls_section);

   }

   return {
      emitter: emitter,
      controls_section: controls_section,
   };

}










/*********************************************************************************************************************************************************************************************/
/** Glow Particles
 * Uppon calling 'Create_glow_particles()', an emitter is created along with the switch to enable it
 * and a switch for the colorpicker to change the particles color. 
 * There is a choise of creating the controls to manipulate all other kinds of variables of the particles system,
 * or use the next function 'Create_particles_controls()', to create the controls seperately
 * and combine them at the call in any way.
 */
/*********************************************************************************************************************************************************************************************/


export function Create_explosion_particles(x = 0, y = 0, root_widget = 0x0, controls_create = true, num_particles_per_frame = 10, generic_controls_parameters = [0, .6, .3], transform_parameters=null) { // 3 control Sliders 

   const scale_down = .14;
   const particles_size = 20;
   const rcorners = 10;



   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   const emitter1_idx = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [particles_size, particles_size], .006, 1, 4, .98, .1, 4, _, num_particles_per_frame, scale_down);
   const emitter = Particles_get_particle_system(emitter1_idx);
   Widget_gfx_ready_enable({ mesh: emitter, enable_sdf_rect: particles_size, enable_unif_scale: true, });

   emitter.EnableProperties(PARTICLES.HAS_RANDOM_POLAR_COORD);
   emitter.EnableProperties(PARTICLES.HAS_FADE);

   emitter.GfxEnableFn(SID.SHAD.FN_GLOW, { time: 0, });
   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   // const generic_controls_parameters = [0, .6, .3];
   emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, generic_controls_parameters.length);

   emitter.SetConeOfDirection(-.1, .1, .1, -.1);

   if(transform_parameters) {
      // The values are interpolated based on 'Create_particles_controls()' 

      {
         const max = 1, start = -.5;
         const v = (transform_parameters[0] * max) + start;
         emitter.gravity = v;
      }
      {
         const max = 25, start = 0;
         const v = (transform_parameters[1] * max) + start;
         emitter.accel = v;
         emitter.max_speed = 4;
      }
      {
         const h = 1, k = -2.8, r = 3.8 * 3.8;
         const x = transform_parameters[2];
         const v = Math.sqrt(-((x - h) * (x - h)) + r) + k;
         emitter.deccel = v;
      }
      {
         const v = transform_parameters[3] * VIEWPORT.WIDTH;
         emitter.geom.pos[0] = v;
      }
      {
         const v = transform_parameters[4] * VIEWPORT.HEIGHT;
         emitter.geom.pos[1] = v;
      }
   }

   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 1], col: TRANSPARENCY(GREY[1], .5), name: 'Emitter Window Panel', }));
   Widget_gfx_ready_enable({ mesh: controls_section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   // Particles_gen_gfx_ctx(emitter, controls_section);
   Particles_gen_gfx_ctx(emitter, _);
   Particle_system_init_particles(emitter);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformSetAndUpdate('u_generic_controls', generic_controls_parameters);




   const zpos = -1

   const switch_panel = Create_emitt_switch_panel({ z: zpos, emitter: emitter, emitt_options: { continuous_emitt: true, button_pres_emitt: true } });
   controls_section.AddItem(switch_panel);

   const colorpicker_panel = Create_color_picker_switch_panel(zpos, emitter);
   controls_section.AddItem(colorpicker_panel);



   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const parameters = [.5, 1., .5, .5, .5, .05, .05, .5];
      const controls_buffer = Create_particles_controls(emitter, YELLOWL[4], parameters, generic_controls_parameters, 'u_generic_controls');

      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }


   controls_section.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);


   /****************************************************************************************************************/
   // Render 
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      controls_section.GenGfxCtx();
      Align_nested_sections_pre(controls_section);
      Widget_render(controls_section);
      // controls_section.GenGfxCtx();

      // Align_nested_sections_pre(controls_section);

      // controls_section.Render();
      // Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);

      // controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

      // Construct_listen_events_from_mesh_tree(controls_section);
      // Construct_listen_events_relations_from_mesh_tree(controls_section);

   }

   return {
      emitter: emitter,
      controls_section: controls_section,
   };

}

/*********************************************************************************************************************************************************************************************/










/*********************************************************************************************************************************************************************************************/
/** Create slider controls  */
/**
   control_parameters = [
      'Particle Scale'
      'Gravity'
      'Acceleration'
      'Deccelerarion'
      'Emitter Position X'
      'Emitter Position Y'
      'Direction Y Up '
      'Direction Y Down'
      'Direction in X'
   ]
   generic_contols_parameters = [
      arbitrary number of params
      // TODO: Automate the slider creation, depending on the number of parameters,  and also the naming of the slider params(extracted from ShaderBuilder)
   ]
 */
export function Create_particles_controls(emitter, color = GREY[2], parameters = null, generic_contols_parameters = null, uniform_name = null, enable_transform_controls = true) {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      // const slider = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.12, .8, .18, 0), dim: slider_dim, col: color, name: name, layout: LAYOUT.VERTICAL, texture_id: texture_id }));
      const slider = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.57, .8, .18, .0), dim: slider_dim, col: color, name: name, layout: LAYOUT.VERTICAL, texture_id: texture_id }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
      return slider;
   }

   let controls_buffer = []; // Buffer to store all control meshes

   /****************************************************************************************************************/
   // Create Graphics controls
   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
   controls_buffer = Controls_create_slider_controls_from_shader_uniform_buffer(emitter, slider_dim, generic_contols_parameters, uniform_name);




   const slider_rcorners = 10;
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;

   /*****************************************************************************************/
   // Create particle system controls
   if (enable_transform_controls) {


      { // Gravity
         const slider = Create_slider_control(slider_dim, color, 'Gravity', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         // slider.SetInitialValue(parameters ? parameters[0] : .48);
         slider.SetInitialValue((parameters && parameters[0]!==undefined) ? parameters[0] : .48);

         Slider_connect(slider, (params, slider_val) => {

            // Linear Interpolation
            const max = 1, start = -.5;
            const v = (slider_val * max) + start;
            emitter.gravity = v;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Acceleration
         const slider = Create_slider_control(slider_dim, color, 'Acceleration', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue((parameters  && parameters[1]!==undefined) ? parameters[1] : .59);

         Slider_connect(slider, (params, slider_val) => {

            // emitter.accel = slider_val;

            // Linear Interpolation
            const max = 25, start = 0;
            const v = (slider_val * max) + start;
            emitter.accel = v;
            emitter.max_speed = 4;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Deccelerarion
         const slider = Create_slider_control(slider_dim, color, 'Deccelerarion', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue((parameters  && parameters[2]!==undefined) ? parameters[2] : .19);

         Slider_connect(slider, (params, slider_val) => {

            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            const v = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitter.deccel = v;


            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter X Position
         const slider = Create_slider_control(slider_dim, color, 'Emitter Position X', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue((parameters  && parameters[3]!==undefined) ? parameters[3] : .08);

         Slider_connect(slider, (params, slider_val) => {

            const v = slider_val * VIEWPORT.WIDTH;
            emitter.geom.pos[0] = v;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Y Position
         const slider = Create_slider_control(slider_dim, color, 'Emitter Position Y', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue((parameters  && parameters[4]!==undefined) ? parameters[4] : .40);

         Slider_connect(slider, (params, slider_val) => {

            const v = slider_val * VIEWPORT.HEIGHT;
            emitter.geom.pos[1] = v;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[4] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Y Direction Y Up
         const slider = Create_slider_control(slider_dim, color, 'Direction Y Up', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue((parameters  && parameters[5]!==undefined) ? parameters[5] : .05);

         Slider_connect(slider, (params, slider_val) => {

            const max = -1, start = 0;
            const v = (slider_val * max) + start;
            emitter.variation_emission.ydir_neg = v;
            console.log(slider_val, v)

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[5] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Y Direction Y Down
         const slider = Create_slider_control(slider_dim, color, 'Direction Y Down', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue((parameters  && parameters[6]!==undefined) ? parameters[6] : .05);

         Slider_connect(slider, (params, slider_val) => {

            const max = 1, start = 0;
            const v = (slider_val * max) + start;
            emitter.variation_emission.ydir_pos = v;
            console.log(slider_val, v)

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[6] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Direction X Left
         const slider = Create_slider_control(slider_dim, color, 'Direction in X', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue((parameters  && parameters[7]!==undefined) ? parameters[7] : .55);

         Slider_connect(slider, (params, slider_val) => {

            let max = 2, start = -1;
            const v = (slider_val * max) + start;
            emitter.variation_emission.xdir_pos = v;
            emitter.variation_emission.xdir_neg = v;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[7] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }

   }
   if (emitter.properties_flags & PARTICLES.HAS_JIGGLE) {


      const jiggle_slider_color = GREENL[4];
      { // Jiggle X
         const slider = Create_slider_control(slider_dim, jiggle_slider_color, 'Jiggle X', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue(0);

         Slider_connect(slider, (params, slider_val) => {

            // Linear Interpolation
            const max = 10, start = 0;
            const val = (slider_val * max) + start;
            emitter.jigglex = val;

         }, _,
         );
      }
      { // Jiggle Y
         const slider = Create_slider_control(slider_dim, jiggle_slider_color, 'Jiggle Y', slider_rcorners, default_font,);
         controls_buffer.push(slider);
         slider.SetInitialValue(0);

         Slider_connect(slider, (params, slider_val) => {

            // Linear Interpolation
            const max = 10, start = 0;
            const val = (slider_val * max) + start;
            emitter.jiggley = val;

         }, _,
         );
      }
   }



   return controls_buffer;
}

/*********************************************************************************************************************************************************************************************/



















/*********************************************************************************************************************************************************************************************/
/** Smoke Particles - Textured
 */
/*********************************************************************************************************************************************************************************************/

export function Create_smoke_particles(x = 0, y = 0, root_widget = ROOT_WIDGETS.CREATE_ROOT, controls_create = true) {

   const emitters = [];
   const emitter_idxs = [];
   const speed = 10;
   const scale_down = .2;
   const particles_size = 40;
   const rcorners = 10;
   let cnt = 0;


   // Create Particle emitters
   const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', YELLOWR[9], [x, y, 0], [particles_size, particles_size], 0.015, 1, 2, .98, -.1, 3, TEXTURES.SMOKE_1, 1, scale_down);
   const emitter = Particles_get_particle_system(emitter_idx);
   Widget_gfx_ready_enable({ mesh: emitter, })

   emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   emitter.EnableProperties(PARTICLES.HAS_ROTATION);
   emitter.EnableProperties(PARTICLES.HAS_SCALE, 10);
   emitter.EnableProperties(PARTICLES.HAS_FADE);
   emitter.speed = speed;

   emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 2);

   emitter.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.TEX2, { time: 0 });
   emitter.GfxPassAttr(SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.TEX2);


   { // Some Test Shaders
      // emitter.EnableGfx(SID.SHAD.FN_EXPLOSION_CIRCLE);
      // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a:0.01, b:0.0 });
      // emitter.EnableGfx(SID.SHAD.FN_GLOW);
      // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
      // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
   }


   Particles_gen_gfx_ctx(emitter);
   Particle_system_init_particles(emitter);

   emitter.GfxUniformSetAndUpdate('u_generic_controls', [.2, 1.]);

   emitter.SetConeOfDirection(1, 1, -.1, .2);

   emitters[cnt] = emitter;
   emitter_idxs[cnt] = emitter_idx;
   cnt++;










   /*************************************************************************************************************** */
   // Create Particles Control Panel

   const controls_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 1], col: TRANSPARENCY(GREY[1], .5), name: 'Emitter Window Panel', }));
   Widget_gfx_ready_enable({ mesh: controls_section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })





   /*************************************************************************************************************** */
   // Create Emitter switch and colorpicker switch

   const zpos = -1

   const switch_panel = Create_emitt_switch_panel({ z: zpos, emitter: emitter, emitt_options: { continuous_emitt: true, button_pres_emitt: true } });
   controls_section.AddItem(switch_panel);

   const colorpicker_panel = Create_color_picker_switch_panel(zpos, emitter);
   controls_section.AddItem(colorpicker_panel);




   /****************************************************************************************************************/
   // Create slider contols
   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const controls_buffer = Create_smoke_particles_controls(emitters[0], YELLOWL[4], _, _, [.2, 1.], 'u_generic_controls');

      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

   }



   controls_section.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);




   /****************************************************************************************************************/
   // Render 
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      controls_section.GenGfxCtx();
      Align_nested_sections_pre(controls_section);
      Widget_render(controls_section);

   }

   return {
      emitter: emitter,
      controls_section: controls_section,
   };
}


/** For rendering the slider controls seperately from the smoke particles */
export function Create_smoke_particles_controls(emitter, color = GREY[2], parameters = null, shader_parameters = null, generic_contols_parameters, uniform_name = 'u_generic_controls') {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      const slider = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.57, .8, .18, .0), dim: slider_dim, col: color, name: name, layout: LAYOUT.VERTICAL, texture_id: texture_id }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
      return slider;
   }

   let controls_buffer = []; // Buffer to store all control meshes

   /****************************************************************************************************************/
   // Create Graphics controls
   if (emitter.sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function

      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      controls_buffer = Controls_create_slider_controls_from_shader_uniform_buffer(emitter, slider_dim, generic_contols_parameters, uniform_name);
   }


   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
   const slider_col = color;
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
   const slider_rcorners = 6;


   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles

   
   // // Contols for shader params
   // if (emitter.sid.unif & SID.UNIF.U_SCALE_VEC2) {
   //    const slider = Create_slider_control(slider_dim, slider_col, 'Scale', slider_rcorners, default_font,);
   //    controls_buffer.push(slider);
   //    slider.SetInitialValue(shader_parameters ? shader_parameters[0] : emitter.geom.scale[0]);
   //    Slider_connect(slider, (params, slider_val) => {
         
   //       const val_idx = 0;
   //       // Find the ubidx
   //       const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
   //       Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);
         
   //    }, { mnemonics: { shader_parameters: shader_parameters }, },);
   // }


   // Contols for tarnsform and physics
   { // Gravity
      const slider = Create_slider_control(slider_dim, slider_col, 'Gravity', slider_rcorners, default_font,);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[0] : .48);
      Slider_connect(slider, (params, slider_val) => {

         // Linear Interpolation
         const max = 1, start = -.5;
         const y = (slider_val * max) + start;
         emitter.gravity = y;

         if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

         // emitter[1].gravity = y;
      }, { mnemonics: { parameters: parameters }, },);
   }
   { // Acceleration
      const slider = Create_slider_control(slider_dim, slider_col, 'Acceleration', slider_rcorners, default_font,);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[1] : .08);
      Slider_connect(slider, (params, slider_val) => {

         emitter.accel = slider_val;

         // Linear Interpolation
         const max = 15, start = 0;
         const y = (slider_val * max) + start;
         emitter.accel = y;
         emitter.max_speed = 4;

         if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

      }, { mnemonics: { parameters: parameters }, },);
   }
   { // Deccelerarion
      const slider = Create_slider_control(slider_dim, slider_col, 'Deccelerarion', slider_rcorners, default_font,);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[2] : .48);
      Slider_connect(slider, (params, slider_val) => {

         /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
         const h = 1, k = -2.8, r = 3.8 * 3.8;
         const x = slider_val;
         let y = 0;
         y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
         emitter.deccel = y;

         if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

      }, { mnemonics: { parameters: parameters }, },);
   }
   { // Set Emitter X Position
      const slider = Create_slider_control(slider_dim, slider_col, 'Emitter Position X', slider_rcorners, default_font,);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[3] : .0);
      Slider_connect(slider, (params, slider_val) => {

         emitter.geom.pos[0] = slider_val * VIEWPORT.WIDTH;

         if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

      }, { mnemonics: { parameters: parameters }, },);
   }
   { // Set Emitter Y Position
      const slider = Create_slider_control(slider_dim, slider_col, 'Emitter Position Y', slider_rcorners, default_font,);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[4] : .5);
      Slider_connect(slider, (params, slider_val) => {

         emitter.geom.pos[1] = slider_val * VIEWPORT.HEIGHT;

         if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[4] = slider_val;

      }, { mnemonics: { parameters: parameters }, },);
   }


   return controls_buffer;
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
export function Create_comet_particles(x = 0, y = 0, width = VIEWPORT.WIDTH / 2 - 10, height = VIEWPORT.HEIGHT / 2 - 150, num_balls = 1, root_widget = ROOT_WIDGETS.CREATE_ROOT, controls_create_but_not_render = true, comet_size = 30) { // Particles Bouncing Ball Tail

   let balls_buffer = [];
   let dirs_buffer = [];
   let noise_emitter_buffer = [];
   let glow_emitter_buffer = [];

   const glow_size = 20;
   const scale_down = .12;
   const rcorners = 10;
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;
   const text_pad = [16, 10];


   
   
   const particles_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 0], dim: [width, height], col: TRANSPARENCY(GREY[1], 1.), name: 'articles Bouncing Ball Tail', }));
   Widget_gfx_ready_enable({ mesh: particles_panel, enable_sdf_rect: 20, })
   
   
   
   
   const noise_generic_controls_parameters = [1, 0, .12, 1];
   const glow_generic_controls_parameters = [0., 1, .31];


   let swap_dir = 1; // Create direction variation in case of rendering many balls 
   for (let i = 0; i < num_balls; i++) {

      /****************************************************************************************************************/
      // Balltail particles
      const dim = [comet_size, comet_size]
      const pos = [100, 100]

      const ball = Create_rect_mesh(Style_rect_default_properties({ pos: [pos[0], pos[1], 2], dim: dim, col: WHITE, name: 'Ball', }));
      Widget_gfx_ready_enable({ mesh: ball, enable_sdf_rect: dim[0], listener: { type: LISTEN_EVENT_TYPES.MOVE } })

      particles_panel.AddItem(ball);

      balls_buffer[i] = ball

      const color = ORANGER[9];

      const scale = 2.;
      const particles_size = dim[1] * scale;
      const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles ${i}`, color, [0, 0, 1], [particles_size, particles_size], 0.015, 1, 0, _, _, 4, _, 1, scale_down);
      const tail_emitter = Particles_get_particle_system(tail_emitter_idx);
      Widget_gfx_ready_enable({ mesh: tail_emitter, enable_src_color_in_main: false }); // Just to enable u_wposxy and u_blend_mode
      // Widget_gfx_ready_enable({mesh:tail_emitter, enable_src_color_in_main:true}); // Just to enable u_wposxy and u_blend_mode

      tail_emitter.EnableProperties(PARTICLES.HAS_FADE);
      tail_emitter.GfxEnableFn(SID.SHAD.FN_NOISE, { time: 0 });
      tail_emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, noise_generic_controls_parameters.length);
      
      
      /****************************************************************************************************************/
      // Secondary particles
      
      const glow_emitter_idx = Particle_system_create_emitter('Glow Particles', TRANSPARENCY(color, .5), [0, 0, 3], [glow_size, glow_size], .005, 1., 1.8, .99, 0, 16, _, 1, scale_down);
      const glow_emitter = Particles_get_particle_system(glow_emitter_idx);
      Widget_gfx_ready_enable({ mesh: glow_emitter, enable_sdf_rect: particles_size, enable_unif_scale: true })
      
      glow_emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, glow_generic_controls_parameters.length);

      glow_emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
      glow_emitter.EnableProperties(PARTICLES.HAS_JIGGLE, { jigglex: 1, jiggley: 2 });
      glow_emitter.EnableProperties(PARTICLES.HAS_FADE);


      glow_emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
      glow_emitter.EnableProperties(PARTICLES.HAS_FADE);

      glow_emitter.GfxEnableFn(SID.SHAD.FN_GLOW, { time: 0, });



      glow_emitter.SetDir(-1, -1);
      const amt = .05;
      glow_emitter.SetConeOfDirection(-amt, amt, amt, -amt);
      glow_emitter_buffer[i] = glow_emitter;



      tail_emitter.SetDir(1, 1 * swap_dir);


      noise_emitter_buffer[i] = tail_emitter;
      dirs_buffer[i] = [1, 1 * swap_dir]

      swap_dir *= -1;


   }








   /****************************************************************************************************************/
   // Render 

   particles_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, particles_panel.mesh_bufferidx, true);
   particles_panel.GenGfxCtx();

   particles_panel.Render();
   Root_group_activate_all_vbs_in_renderqueue(particles_panel.root_bufferidx);

   particles_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, particles_panel.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(particles_panel);
   Construct_listen_events_relations_from_mesh_tree(particles_panel);




   // IMPORTANT: Generate particles gfx after the generation of any parent mesh, so that the particles system unif_wpos has a parent root_posidx
   for (let i = 0; i < num_balls; i++) {

      const glow_emitter = glow_emitter_buffer[i];
      Particles_gen_gfx_ctx(glow_emitter, particles_panel);
      // Initialize values to uniforms
      glow_emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1]);
      glow_emitter.GfxUniformSetAndUpdate('u_generic_controls', glow_generic_controls_parameters);
      
      
      // Render Ball tail particles on top of the glow particles
      const tail_emitter = noise_emitter_buffer[i];
      Particles_gen_gfx_ctx(tail_emitter, particles_panel);
      // Initialize values to uniforms
      tail_emitter.GfxUniformSetAndUpdate('u_generic_controls', noise_generic_controls_parameters);

   }


   const controls_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x + particles_panel.geom.dim[0] * 2, y, 1], col: TRANSPARENCY(GREY[1], .5), name: 'Emitter Window Panel', }));
   Widget_gfx_ready_enable({ mesh: controls_section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

   const zpos = -1

   { // Create color picker panel
      const panel = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, zpos + 1], col: YELLOWL[4], name: 'color_picker_panel', layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
      Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: 16, })
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(Style_label_default_properties({ text: 'Colorpicker', pos: [0, 0, zpos + 2], col: GREY[1], text_pad: text_pad, texture_id: default_font, layout: LAYOUT.VERTICAL }));
      Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 16, })
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 18, col: GREY[1], name: 'color_picker_switch' }));
      Widget_gfx_ready_enable({ mesh: colorpicker_switch, enable_sdf_rect: 18, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.CLICK_UP } })
      panel.AddItem(colorpicker_switch);

      const cp_params = {
         noise_emitter_buffer: noise_emitter_buffer,
         glow_emitter_buffer: glow_emitter_buffer,
         mnemonics: { transparency: 0.5, hue: 0.5, color: null },
      };
      colorpicker_switch.Bind(
         (params) => {

            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'event_clbks' of the switch widget??????
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

               const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, x, y, 300, 300,);
               colorpicker.SetTransparencySliderSetInitialValue(transparency);
               colorpicker.SetHueSliderSetInitialValue(hue);

               colorpicker.AssignTargetMeshClbk((col, params) => {

                  const noise_emitter_buffer = params.noise_emitter_buffer;
                  const glow_emitter_buffer = params.glow_emitter_buffer;
                  const color = col;

                  const len = noise_emitter_buffer.length;
                  for (let i = 0; i < len; i++) {

                     const tail_emitter = noise_emitter_buffer[i];
                     const glow_emitter = glow_emitter_buffer[i];

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

   }






   if (controls_create_but_not_render) { // Create slider controls only if this is to be rendered from this function


      /****************************************************************************************************************/
      // Tail Particle System: Contol Sliders 

      const comet_contols_buffer = Create_comet_noise_contols(noise_emitter_buffer, YELLOWL[2], _, [1, 0, .12, 1], 'u_generic_controls');
      const len = comet_contols_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = comet_contols_buffer[i];
         controls_section.AddItem(ctrl);
      }


      /****************************************************************************************************************/
      // Glow Particle System: Contol Sliders 
      // const parameters = [0.2, .48, .5, .19, .08, .4, .04, .04, .55];
      // const generic_controls_parameters = [.7, 1., .12];
      // const glow_contols_buffer = Create_comet_glow_contols(glow_emitter_buffer, YELLOWL[2], parameters, true, generic_controls_parameters);
      // const glow_contols_buffer = Create_comet_glow_contols(glow_emitter_buffer, YELLOWL[2], _);



      const particles_len = glow_emitter_buffer.length;
      for (let i = 0; i < particles_len; i++) {

         const glow_contols_buffer = Create_particles_controls(glow_emitter_buffer[i], YELLOWL[4], _, glow_generic_controls_parameters, 'u_generic_controls', false);

         const contols_len = glow_contols_buffer.length;
         for (let j = 0; j < contols_len; j++) {

            const ctrl = glow_contols_buffer[j];
            controls_section.AddItem(ctrl);
         }


      }


   }

   controls_section.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);



   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function



      /****************************************************************************************************************/
      // Render 

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, controls_section.mesh_bufferidx, true);
      controls_section.GenGfxCtx();

      Align_nested_sections_pre(controls_section);

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
      noise_emitter_buffer: noise_emitter_buffer,
      glow_particles: glow_emitter_buffer,
   }

   Time_intervals_create(1, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_comet, params);


   return {
      particles_panel: particles_panel,
      controls_section: controls_section,
      noise_emitter_buffer: noise_emitter_buffer,
      glow_emitter_buffer: glow_emitter_buffer,
   };

}

/** For rendering the slider controls seperately from the ball tail particles */
export function Create_comet_noise_contols(noise_emitter_buffer, color = GREY[2], parameters = null, generic_contols_parameters, uniform_name) {

   const Create_slider_control = (slider_dim, color, name, rcorners, texture_id) => {
      const slider = Create_widget_slider(Style_slider_default_properties({ dim: slider_dim, col: color, name: name, layout: LAYOUT.VERTICAL, texture_id: texture_id }));
      Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: [rcorners, 5], })
      return slider;
   }

   const controls_buffer = [];


   /****************************************************************************************************************/
   // Tail Particle System: Contol Sliders 
   const particles_buffer = noise_emitter_buffer;
   const particles_buffer_len = noise_emitter_buffer.length;

   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
   const slider_rcorners = 10;
   const default_font = TEXTURES.MTSDF_CONSOLAS_1024;


   for (let i = 0; i < particles_buffer_len; i++) {

      const emitter = particles_buffer[i];

      { // Slider 1 contol

         const slider = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.78, .8, .18, .0), pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Speed', layout:LAYOUT.VERTICAL }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[0] : 0);

         Slider_connect(slider, (params, slider_val) => {

            let min = .006; // The min value gives the prolonged emitter
            let max = .008; // Calculate that the max value will be +1+min
            // const rev_slider_val = 1 - slider_val;
            // emitter.t_step = rev_slider_val + min + ((max - slider_val) * (rev_slider_val));
            // emitter.t_step = Linear_interpolation(max, min, slider_val);
            emitter.speed = (slider_val + 1) * 4;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      /****************************************************************************************************************/
      // Automaticaly collect and create uniform controls from shader
      if (emitter.sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function

         const ctrl = Controls_create_slider_controls_from_shader_uniform_buffer(emitter, slider_dim, generic_contols_parameters, uniform_name);
         for (let j = 0; j < ctrl.length; j++) {
            controls_buffer.push(ctrl[j]);
         }
      }

   }


   return controls_buffer;
}
/** For rendering the slider controls seperately from the ball tail particles */
export function Create_comet_glow_contols(glow_emitter_buffer, color = GREY[2], parameters = null, uniform_name, scale_down = .12) {

   let controls_buffer = []; // Buffer to store all control meshes

   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];


   /****************************************************************************************************************/
   // Glow Particle System: Contol Sliders 
   const particles_buffer = glow_emitter_buffer;
   const particles_buffer_len = glow_emitter_buffer.length;

   


   // Glow Particle System: Contol Sliders 
   for (let i = 0; i < particles_buffer_len; i++) {

      const emitter = particles_buffer[i];
      
      controls_buffer = Controls_create_slider_controls_from_shader_uniform_buffer(emitter, slider_dim, parameters, uniform_name);


   //    const slider_rcorners = 10;

   //    { // SHADER UNIFORMS: Particle Glow Distance
   //       const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Distance', layout:LAYOUT.VERTICAL }));
   //       Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
   //       controls_buffer.push(slider);
   //       slider.SetInitialValue(parameters ? parameters[0] : 1.);

   //       Slider_connect(slider, (params, slider_val) => {

   //          const val_idx = 0;
   //          // Find the ubidx
   //          const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
   //          Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

   //          if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

   //       }, { mnemonics: { parameters: parameters }, },
   //       );

   //    }
   //    { // SHADER UNIFORMS: Particle Glow Brightness
   //       const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Brighter', layout:LAYOUT.VERTICAL }));
   //       Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
   //       controls_buffer.push(slider);
   //       slider.SetInitialValue(parameters ? parameters[1] : 0);

   //       Slider_connect(slider, (params, slider_val) => {

   //          const val_idx = 1;
   //          // Find the ubidx
   //          const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
   //          Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

   //          if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

   //       }, { mnemonics: { parameters: parameters }, },
   //       );

   //    }
   //    { // SHADER UNIFORMS: Particle Glow Intensity
   //       const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Intensity', layout:LAYOUT.VERTICAL }));
   //       Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
   //       controls_buffer.push(slider);
   //       slider.SetInitialValue(parameters ? parameters[2] : .13);

   //       Slider_connect(slider, (params, slider_val) => {

   //          const val_idx = 2;
   //          // Find the ubidx
   //          const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
   //          Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

   //          if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

   //       }, { mnemonics: { parameters: parameters }, },
   //       );

   //    }
   //    { // SHADER UNIFORMS: Particle Scale
   //       const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Particle Scale', layout:LAYOUT.VERTICAL }));
   //       Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
   //       controls_buffer.push(slider);
   //       slider.SetInitialValue(parameters ? parameters[4] : scale_down);

   //       // Connect sliders to gfx program uniforms 
   //       Slider_connect(slider, (params, slider_val) => {

   //          const val_idx = 0;
   //          // Find the ubidx
   //          const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
   //          Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

   //          if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[4] = slider_val;

   //       }, { mnemonics: { parameters: parameters }, },
   //       );
   //    }
   }


   return controls_buffer;
}

export function Comet_create_controls(noise_emitter_buffer, noise_control_parameters, generic_contols_parameters, uniform_name, glow_emitter_buffer, glow_control_parameters,) {

   const controls_buffer = Create_comet_noise_contols(noise_emitter_buffer, _, noise_control_parameters, generic_contols_parameters, uniform_name);
   const glow_controls_buffer = Create_comet_glow_contols(glow_emitter_buffer, _, glow_control_parameters, uniform_name);

   const len = glow_controls_buffer.length;
   for (let i = 0; i < len; i++) {
      controls_buffer.push(glow_controls_buffer[i]);
   }

   return controls_buffer;
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
      const tail_emitter = params.params.noise_emitter_buffer[i];
      const tail_emitter_idx = tail_emitter.idx;
      const dir = params.params.dir[i];

      // Secondary Particles
      const glow_particles = params.params.glow_particles[i];


      // Move the ball
      const variation = Timer_get_global_timer_cycle() * .3 + .5;
      const x = dir[0] * tail_emitter.speed * variation;
      // const x = dir[0] * tail_emitter.speed * .5;
      const y = dir[1] * tail_emitter.speed * .5;

      Mesh_add_wpos_xy(ball, x, y);
      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;

      const pos = [ball.geom.pos[0] + ball.geom.dim[0], ball.geom.pos[1] + ball.geom.dim[1]];
      tail_emitter.geom.pos[0] = pos[0];
      tail_emitter.geom.pos[1] = pos[1];


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


      Particle_system_emitt({ params: { target_params: [tail_emitter_idx], } });
      /*********************************************************************************************************/
      // Secondary Particles
      glow_particles.geom.pos[0] = pos[0];
      glow_particles.geom.pos[1] = pos[1];

      Particle_system_emitt({ params: { target_params: [glow_particles.idx], } });
   }

}
function Animate_comet_perimetric(params) {


   const particles_panel = params.params.particles_panel;


   const top_bound = 0;
   const bot_bound = particles_panel.geom.dim[1] * 2;
   const left_bound = 0;
   const right_bound = particles_panel.geom.dim[0] * 2;

   const len = params.params.ball.length;
   for (let i = 0; i < len; i++) {

      const ball = params.params.ball[i];
      const tail_emitter = params.params.noise_emitter_buffer[i];
      const tail_emitter_idx = tail_emitter.idx;
      const dir = params.params.dir[i];

      // Secondary Particles
      const glow_particles = params.params.glow_particles[i];


      // Move the ball
      const variation = Timer_get_global_timer_cycle() * .3 + .5;
      // const x = 1 * dir[0] * tail_emitter.speed * variation;
      // const x = (i+.3)*(dir[0] * tail_emitter.speed ) * Math.sin(Timer_get_global_timer() * 6);
      const x = (dir[0] * tail_emitter.speed) * Math.sin(Timer_get_global_timer() * 6);
      const y = (dir[1] * tail_emitter.speed) * Math.cos(Timer_get_global_timer() * 6);
      // const y = Math.cos(1 * dir[1] * tail_emitter.speed )* 1;


      Mesh_add_wpos_xy(ball, x, y);
      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;

      const pos = [ball.geom.pos[0] + ball.geom.dim[0], ball.geom.pos[1] + ball.geom.dim[1]];
      tail_emitter.geom.pos[0] = pos[0];
      tail_emitter.geom.pos[1] = pos[1];


      // // Check boundaries
      // const ball_top = ball.geom.pos[1] + y;
      // const ball_bot = ball.geom.pos[1] + ball.geom.dim[1] * 2 + y;
      // const ball_left = ball.geom.pos[0] + x;
      // const ball_right = ball.geom.pos[0] + ball.geom.dim[0] * 2 + x;



      // if (ball_bot > bot_bound) {
      //    dir[1] *= -1;
      //    tail_emitter.SetDir(0, dir[1])
      //    glow_particles.dir[1] = 1;
      // }
      // else if (ball_top < top_bound) {
      //    dir[1] *= -1;
      //    tail_emitter.SetDir(0, dir[1])
      //    glow_particles.dir[1] = -1;
      // }
      // if (ball_right > right_bound) {
      //    dir[0] *= -1;
      //    tail_emitter.SetDir(dir[0], 0)
      //    glow_particles.dir[0] = 1;
      // }
      // else if (ball_left < left_bound) {
      //    dir[0] *= -1;
      //    tail_emitter.SetDir(dir[0], 0)
      //    glow_particles.dir[0] = -1;
      // }



      const particles_params = {
         params: {
            target_params: [tail_emitter_idx],
         }
      }
      Particle_system_emitt(particles_params);
      /*********************************************************************************************************/
      // Secondary Particles
      glow_particles.geom.pos[0] = pos[0];
      glow_particles.geom.pos[1] = pos[1];

      Particle_system_emitt({ params: { target_params: [glow_particles.idx], } });
   }

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

      const emitter_idx = Particle_system_create_emitter('TestParticles', TRANSPARENCY(WHITE, .1), [0, 300, 0], dim, .003, 1, 1, .96, -.1, 3, TEXTURES.SMOKE_1,);

      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
      emitter.speed = speed;


      emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
      emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TEX2);


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
      pass: SID.ATTR.WPOS3,
   }

   const controls_dp = Create_widget_dropdown(_, 'Emitter Test', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
   controls_dp.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   Dropdown_roots_set_root(controls_dp, controls_dp);
   // controls_dp.AddToMenu(controls_dp);




   { // Emitter switch and label

      const emitter_section = Create_rect_mesh(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Emitter Test', label_style);
      emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

      const label = Create_widget_label(_, 'Emitter Test', (TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
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
      const color_picker = Create_rect_mesh(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

      // Create label
      const label = Create_widget_label(_, 'Color Picker', (TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
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
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'event_clbks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
            */
            const switch_mesh = params.target_mesh;
            const isOn = switch_mesh.isOn;


            if (isOn) {

               const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 0, _, _, _, _, _, _, 0x0,);

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
      const slider_theme = Color_theme_slider_auto(.45, .8, .18, 0);
      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      const slider_rcorners = 10;
      const glow_controls_dp2 = Create_widget_dropdown(_, 'Transform Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [6, 0, 2], [4, 4],);
      glow_controls_dp2.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      controls_dp.AddToMenu(glow_controls_dp2)

      { // Gravity
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Gravity' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.50);

         Slider_connect(slider, (params, slider_val) => {

            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitters[0].gravity = y;
         }, _);
      }
      { // Acceleration
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Acceleration' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.29);

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
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Deccelerarion' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.58);

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
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Emitter Position X' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.05);
         Slider_connect(slider, (params, slider_val) => {
            const y = slider_val * VIEWPORT.WIDTH - emitters[0].dim[0];
            emitters[0].pos[0] = y;
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Emitter Position Y' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.29);
         Slider_connect(slider, (params, slider_val) => {

            const y = slider_val * VIEWPORT.HEIGHT - emitters[0].dim[1];
            emitters[0].pos[1] = y;
         }, _);
      }
      { // Set Emitter Y Direction Up
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Direction Y Up' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.02);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = -1, start = 0;
            const y = (slider_val * max) + start;
            emitters[0].variation_emission.ydir_neg = y;
         }, _);
      }
      { // Set Emitter Y Direction Down
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Direction Y Down' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.02);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = 1, start = 0;
            const y = (slider_val * max) + start;
            emitters[0].variation_emission.ydir_pos = y;
         }, _);
      }
      { // Set Emitter Direction X Left
         const slider = Create_widget_slider(Style_slider_default_properties({ theme:slider_theme, pos: [0, 0, 0], dim: slider_dim, col: slider_col, name: 'Direction X Left' }));
         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: slider_rcorners, });
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(.60);
         Slider_connect(slider, (params, slider_val) => {

            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitters[0].variation_emission.xdir_pos = y;
            emitters[0].variation_emission.xdir_neg = y;
         }, _);

      }

   }




   const section = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [4, 4], [VIEWPORT.RIGHT - 280, 50, 0], [100, 100], CGREY, 'SidePanel', [0, 10, 1.8]);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

   section.AddItem(controls_dp);



   // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
   const text_mesh = controls_dp.children.buffer[0].text_mesh;
   text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;


   // Render properties panel
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
   const s = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [10, 60, 0], _, GREY[1],);
   s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


   const btn = Create_widget_button(_, 'Emitt', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], 20, BLUEL[6], WHITE, [5, 5], .5);
   s.AddItem(btn);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idxs] },)


   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
/** 
 * Helper-Mesh construction functions
 */
/*********************************************************************************************************************************************************************************************/

// function Create_emitt_switch_panel(z, emitter, emitt_options:{continuous=false, }) {
function Create_emitt_switch_panel({ z = 0, emitter = null, emitt_options = { continuous_emitt: true, button_pres_emitt: false }, }) {

   // Create emitt panel
   const panel = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, z + 1], col: Color_hsv_to_rgb_calibrated(.0, .0, .8, 1, .12, .0), name: `${emitter.name}_emitt_panel`, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
   Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: 16, })


   // Create a one time emmit switch or 
   if (emitt_options.continuous_emitt) {
      // Create label
      // const label = Create_widget_label(Style_label_default_properties({ text: 'Emitt', pos: [0, 0, z + 2], col: YELLOWR[8], text_pad: text_pad, texture_id: default_font, layout: LAYOUT.HORIZONTAL }));
      const label = Create_widget_label(Style_label_default_properties({ theme: Color_theme_label_auto(.12, .8, .2, .0), text: 'Emitt', pos: [0, 0, z + 2], col: Color_hsv_to_rgb_calibrated(.12, .8, 1., 1, .75, .0), text_pad: text_pad, texture_id: default_font, layout: LAYOUT.HORIZONTAL }));
      Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 12, })
      panel.AddItem(label);

      // const emitt_switch = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, z + 2], size: 18, col: YELLOWR[8], layout: LAYOUT.HORIZONTAL, name: `${emitter.name}_emitt_switch` }));
      const emitt_switch = Create_widget_switch_simple(Style_switch_default_properties({ theme: Color_theme_switch_auto(.12, 1., .2, .0), pos: [0, 0, z + 2], size: 18, col: Color_hsv_to_rgb_calibrated(.12, .8, 1., 1, .75, .0), layout: LAYOUT.HORIZONTAL, name: `${emitter.name}_emitt_switch` }));
      Widget_gfx_ready_enable({ mesh: emitt_switch, enable_sdf_rect: emitt_switch.geom.dim[1], listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.CLICK_UP } })
      panel.AddItem(emitt_switch);

      const evt_params = { target_params: [emitter.idx] };
      emitt_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
   }
   if (emitt_options.button_pres_emitt) {

      const emitt_btn = Create_widget_button(Style_button_default_properties({ theme: Color_theme_label_auto(.12, .8, .4, .0), text: 'Emitt', pos: [0, 0, z + 2], col: Color_hsv_to_rgb_calibrated(.12, .8, 1., 1, .75, .0), text_pad: text_pad, texture_id: default_font, layout: LAYOUT.VERTICAL, name: `${emitter.name}_emitt_button` }));
      Widget_gfx_ready_enable({ mesh: emitt_btn, enable_sdf_rect: emitt_btn.geom.dim[1], listener: { type: LISTEN_EVENT_TYPES.HOVER } })
      panel.AddItem(emitt_btn);

      const evt_params = { target_params: [emitter.idx] };
      emitt_btn.Bind(Particle_system_emitt, _, evt_params);
   }

   return panel;
}

function Create_color_picker_switch_panel(z, emitter) {

   // Create color picker panel
   const panel = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, z + 1], col: Color_hsv_to_rgb_calibrated(.0, .0, .8, 1, .12, .0), name: 'color_picker_panel', layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
   Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: 16, })

   // Create label
   const label = Create_widget_label(Style_label_default_properties({ theme:Color_theme_label_auto(.6, .8, .2, .0), text: 'Colorpicker', pos: [0, 0, z + 2], col: Color_hsv_to_rgb_calibrated(.76, .0, 1., 1, .2, .0), text_pad: text_pad, texture_id: default_font, layout: LAYOUT.VERTICAL }));
   Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 16, })
   panel.AddItem(label);

   const colorpicker_switch = Create_widget_switch_simple(Style_switch_default_properties({ theme: Color_theme_switch_auto(.6, 1., .2, .0), pos: [0, 0, 1], size: 18, col: GREY[1], name: 'color_picker_switch' }));
   // const colorpicker_switch = Create_widget_switch_simple(Style_switch_default_properties({ theme: Color_theme_switch_auto(.76, 1., .0, .0), pos: [0, 0, 1], size: 18, col: GREY[1], name: 'color_picker_switch' }));
   Widget_gfx_ready_enable({ mesh: colorpicker_switch, enable_sdf_rect: 18, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.CLICK_UP } })
   panel.AddItem(colorpicker_switch);

   colorpicker_switch.Bind(
      (params) => {

         const switch_mesh = params.target_mesh;
         const isOn = switch_mesh.isOn;
         const x = 0;
         const y = VIEWPORT.HEIGHT - 300;

         if (isOn) {

            const transparency = params.params.mnemonics.transparency;
            const hue = params.params.mnemonics.hue;
            const color = params.params.mnemonics.color;

            const colorpicker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, x, y, 300, 300,);
            colorpicker.SetTransparencySliderSetInitialValue(transparency);
            colorpicker.SetHueSliderSetInitialValue(hue);

            colorpicker.AssignTargetMeshClbk(
               (col, params) => {
                  const color = col;
                  CopyArr4(emitter.mat.col, color);
                  params.mnemonics.color = color;
               },
               params.params
            );
            switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
         }
         else {

            const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
            colorpicker.Destroy();
         }
      },
      null, { mnemonics: { transparency: 0.5, hue: 0.5, color: null }, }, _,
   );

   return panel;
}

/*********************************************************************************************************************************************************************************************/








