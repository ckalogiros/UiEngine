"use strict";



import { Callback_animations_create } from '../../Engine/Animations/CallbackAnimations.js';
import { Create_rect_mesh, Create_widget_button, Create_widget_dropdown, Create_widget_label, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from '../../Engine/Core/CreateWidget.js';
import { Mesh_buffer_get_mesh_byidx } from '../../Engine/Core/MeshBuffer.js';
import { View_build_group_from_root_mesh } from '../../Engine/Core/Views/MeshBufferViews.js';
import { Mesh_unif_add_vb_root_wposx, Mesh_unif_get_vb_root_wpos, Mesh_unif_get_vb_root_wposx } from '../../Engine/Core/MeshUniformsBuffer.js';
import { Root_group_activate_all_vbs_in_renderqueue } from '../../Engine/Core/Views/RootView.js';
import { BLACK, BLUEL, GREEN, GREY, Interpolate_rgb_to_01, ORANGE, ORANGEL, ORANGER, PURPLE, PURPLEB, WHITE, YELLOW, YELLOWL, YELLOWR } from '../../Engine/Drawables/Material/Base/Colors.js';
import { Mesh_get_uniform_ubidx_from_name } from '../../Engine/Drawables/Operations/MeshHelperFunctions.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../../Engine/Drawables/Operations/Recursions.js';
import { Dropdown_roots_set_root } from '../../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Slider_connect } from '../../Engine/Drawables/Widgets/WidgetSlider.js';
import { Switch_simple_time_interval_callback } from '../../Engine/Drawables/Widgets/WidgetSwitch.js';
import { Particle_system_create_emitter, Particle_system_emitt, Particles_get_particle_system, Particles_gen_gfx_ctx } from '../../Engine/ParticlesSystem/ParticlesSystem.js';
import { Time_intervals_create } from '../../Engine/Timers/TimeIntervals.js';
import { Timer_get_global_timer, Timer_get_global_timer_cycle } from '../../Engine/Timers/Timers.js';
import { Vertex_buffer_set_and_update_uniform } from '../../Graphics/Buffers/VertexBuffers.js';
import { CopyArr4 } from '../../Helpers/Math/MathOperations.js';
import { Demo_widgets_colorpicker } from './DemoWidgets.js';
import { Linear_interpolation } from '../../Helpers/Math/MathFunctions.js';
import { Contols_generic_uniforms_buffer } from '../Widgets/WidgetGenericControlsReady.js';
import { Widget_ready_slider } from '../Widgets/WidgetReadyWidgets.js';





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
 * or use the next function 'Create_glow_particles_controls()', to create the controls seperately
 * and combine them at the call in any way.
 */
/*********************************************************************************************************************************************************************************************/


export function Create_glow_particles(x = 0, y = 0, root_widget = 0x0, controls_create = true, num_particles_per_frame) { // 3 control Sliders 

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }
   const scale_down = .2;
   const particles_size = 40;




   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   let emitter1_idx = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [particles_size, particles_size], .006, 1, 4, .98, .1, 4, _, num_particles_per_frame);
   let emitter = Particles_get_particle_system(emitter1_idx);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

   emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   // emitter.EnableProperties(PARTICLES.HAS_JIGGLE, {jigglex:1.5, jiggley:2});
   emitter.EnableProperties(PARTICLES.HAS_FADE);


   emitter.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0.0);

   { // Test Shaders
      // emitter.EnableGfx(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
      // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a:0.01, b:0.0 });
   }

   emitter.EnableGfx(MESH_ENABLE.GFX.FN_GLOW);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
   emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);



   // For default glow particles change:SetConeOfDirection(), gravity, diry -+ and dirx in controls
   emitter.SetConeOfDirection(-.1, .1, .05, -.05);


   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], TRANSPARENCY(GREY[1], .5), 'Emitter Window Panel', [0, 10, 2],);
   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   Particles_gen_gfx_ctx(emitter, controls_section);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformSetAndUpdate('u_generic_controls', [.2, 1., .1]);




   const zpos = -1

   { // Create emitt panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [x, y, zpos + 1], [0, 0], YELLOWL[4], 'glow_emitter_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Emitt', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, YELLOWR[8], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const emitt_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, YELLOWR[8], _, 0);
      // emitt_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      emitt_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 18);
      emitt_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
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
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, GREY[1], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, GREY[1], _);
      // colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 18);
      colorpicker_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);

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
               // colorpicker.SetTransparencySliderSetInitialValue(transparency)
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

      // panel.Calc_no_gfx_update();
   }



   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const parameters = [0.2, .48, .5, .19, .08, .4, .04, .04, .55];
      const generic_controls_parameters = [.7, 1., .12];
      const controls_buffer = Create_glow_particles_controls(emitter, scale_down, YELLOWL[3], parameters, true, generic_controls_parameters);

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
      controls_section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.Calc_no_gfx_update();

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
/** Glow-Particles. Testing with different shaders */
export function Demo_glow_particles_test_dif_shaders(x = 0, y = 0, root_widget = 0x0, particles_size = 100, controls_create = true, num_particles_per_frame) { // 3 control Sliders 

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }
   const scale_down = .2;
   // const scale_down = .7;
   // const scale_down = 5.;
   // const particles_size = 140;




   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   let emitter1_idx = Particle_system_create_emitter('Particle System Emitter: Tests', BLUEL[9], [x, y, 10], [particles_size, particles_size], .006, 1, 4, .98, .1, 4, _, num_particles_per_frame);
   let emitter = Particles_get_particle_system(emitter1_idx);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

   emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   emitter.EnableProperties(PARTICLES.HAS_JIGGLE, { jigglex: 1.5, jiggley: 2 });

   // emitter.EnableProperties(PARTICLES.HAS_RANDOM_POLAR_COORD);
   // emitter.EnableProperties(PARTICLES.HAS_FADE);


   emitter.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0.0);

   emitter.EnableGfx(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a: 0.01, b: 0.0 });

   // emitter.EnableGfx(MESH_ENABLE.GFX.FN_GLOW);

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


   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], TRANSPARENCY(GREY[1], .5), 'Emitter Window Panel', [0, 10, 2],);
   // controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   Particles_gen_gfx_ctx(emitter, controls_section);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformSetAndUpdate('u_generic_controls', [1, 0, 0]);




   const zpos = -1

   { // Create emitt panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [x, y, zpos + 1], [0, 0], YELLOWL[4], 'glow_emitter_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Emitt', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _,  GREY[1], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const emitt_switch = Create_widget_switch_simple(_, [0, 0, 1], 18,  GREY[1], _);
      // emitt_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      emitt_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 18);
      emitt_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
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
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _,  GREY[1], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18,  GREY[1], _);
      // colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);

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
               // colorpicker.SetTransparencySliderSetInitialValue(transparency)
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

      // panel.Calc_no_gfx_update();
   }



   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const parameters = [.5, .48, .5, .71, .08, .4, .05, .05, .55];
      const generic_controls_parameters = [1., .0, .01, 1.];
      const controls_buffer = Create_glow_particles_controls(emitter, scale_down, YELLOWL[3], parameters, true, generic_controls_parameters);

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
      controls_section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.Calc_no_gfx_update();

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
 * or use the next function 'Create_glow_particles_controls()', to create the controls seperately
 * and combine them at the call in any way.
 */
/*********************************************************************************************************************************************************************************************/


export function Create_explosion_particles(x = 0, y = 0, root_widget = 0x0, controls_create = true, num_particles_per_frame = 50) { // 3 control Sliders 

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }
   const scale_down = .2;
   const particles_size = 40;




   /****************************************************************************************************************/
   // Create Particles Particles Emitter

   const emitter1_idx = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [particles_size, particles_size], .006, 1, 4, .98, .1, 4, _, num_particles_per_frame);
   const emitter = Particles_get_particle_system(emitter1_idx);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

   emitter.EnableProperties(PARTICLES.HAS_RANDOM_POLAR_COORD);
   emitter.EnableProperties(PARTICLES.HAS_FADE);


   emitter.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0.0);

   { // Test Shaders
      // emitter.EnableGfx(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
      // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a:0.01, b:0.0 });
   }

   emitter.EnableGfx(MESH_ENABLE.GFX.FN_GLOW);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
   emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


   emitter.SetConeOfDirection(-.1, .1, .1, -.1);



   /****************************************************************************************************************/
   // Create Particles Control Panel

   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], TRANSPARENCY(GREY[1], .5), 'Emitter Window Panel', [0, 10, 2],);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);



   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   Particles_gen_gfx_ctx(emitter, controls_section);
   // Set callback for uniform update
   emitter.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1,]);
   emitter.GfxUniformSetAndUpdate('u_generic_controls', [.2, 1., .1]);




   const zpos = -1

   { // Create emitt panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [x, y, zpos + 1], [0, 0], YELLOWL[4], 'glow_emitter_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      const emitt_btn = Create_widget_button(_, 'Emitt', _, [0, 0, 1], 10, YELLOWR[8], _, [6, 4]);
      emitt_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      emitt_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      emitt_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      emitt_btn.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      emitt_btn.SetName('glow_emitter_switch');
      panel.AddItem(emitt_btn);

      const evt_params = { target_params: [emitter.idx] };
      emitt_btn.Bind(Particle_system_emitt, _, evt_params);
      emitt_btn.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   }
   { // Create color picker panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, GREY[1], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, GREY[1], _);
      colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);

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
         null, { mnemonics: { transparency: 0.5, hue: 0.5, color: null }, }, _,
      );

      // panel.Calc_no_gfx_update();
   }



   /****************************************************************************************************************/
   // Create slider controls

   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      // u_generic_controls uniform buffer
      // 'Particle Scale'
      // 'Gravity'
      // 'Acceleration'
      // 'Deccelerarion'
      // 'Emitter Position X'
      // 'Emitter Position Y'
      // 'Direction Y Up '
      // 'Direction Y Down'
      // 'Direction in X'
      // const parameters = [scale_down, .11, .02, .21, .5, 1., .5, .5, .5, .05, .05, .5];
      const parameters = [0.08, .5, 1., .5, .5, .5, .05, .05, .5];
      const generic_controls_parameters = [.7, 1., .26];
      // const controls_buffer = Create_explosion_particles_controls(emitter, scale_down, YELLOWL[3], parameters, true, generic_controls_parameters);
      const controls_buffer = Create_glow_particles_controls(emitter, scale_down, YELLOWL[3], parameters, true, generic_controls_parameters);

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
      controls_section.options = SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.Calc_no_gfx_update();

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
export function Create_glow_particles_controls(emitter, scale_down, color = GREY[2], parameters = null, u_scale_create = false, generic_contols_parameters = null) {

   let controls_buffer = []; // Buffer to store all control meshes

   /****************************************************************************************************************/
   // Create Graphics controls
   if (emitter.sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function

      const slider_size = 120 * DEVICE.device_scale; // y:10 * DEVICE.device_scale;
      controls_buffer = Contols_generic_uniforms_buffer(emitter, slider_size, generic_contols_parameters);
   }

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }


   /*****************************************************************************************/
   // Create particle system controls
   {

      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      const slider_feather = 2;
      const slider_rcorners = 10;

      if (u_scale_create) { // SHADER UNIFORMS: Particle Scale
         // const slider_initial_val = parameters ? parameters[0] : scale_down;
         // const slider = Widget_ready_slider(_, 0, 0, slider_initial_val, 'Particle Scale', slider_dim);
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Particle Scale',);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[0] : scale_down);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);


            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Gravity');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[1] : .48);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            // Linear Interpolation
            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitter.gravity = y;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Acceleration');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[2] : .59);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            emitter.accel = slider_val;

            // Linear Interpolation
            const max = 25, start = 0;
            const y = (slider_val * max) + start;
            emitter.accel = y;
            emitter.max_speed = 4;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Deccelerarion
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Deccelerarion');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[3] : .19);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            let y = 0;
            y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitter.deccel = y;


            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter X Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Emitter Position X');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[4] : .08);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const y = slider_val * VIEWPORT.WIDTH;
            emitter.pos[0] = y;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[4] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Emitter Position Y');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[5] : .40);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const y = slider_val * VIEWPORT.HEIGHT;
            emitter.pos[1] = y;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[5] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Y Direction Y Up
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Direction Y Up ');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[6] : .05);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const max = -1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_neg = y;
            console.log(slider_val, y)

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[6] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Y Direction Y Down
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Direction Y Down');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[7] : .05);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const max = 1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_pos = y;
            console.log(slider_val, y)

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[7] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Set Emitter Direction X Left
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Direction in X');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners)
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[8] : .55);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitter.variation_emission.xdir_pos = y;
            emitter.variation_emission.xdir_neg = y;

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[8] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }

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
   let noise_particles_buffer = [];
   let glow_particles_buffer = [];

   const glow_size = 20;
   const scale_down = .22;

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }


   const particles_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x, y, 0], [width, height], TRANSPARENCY(GREY[1], 1.), 'Particles Bouncing Ball Tail',)
   particles_panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // particles_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   particles_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 20);
   particles_panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);



   let swap_dir = 1; // Create direction variation in case of rendering many balls 
   for (let i = 0; i < num_balls; i++) {

      /****************************************************************************************************************/
      // Balltail particles
      const dim = [comet_size, comet_size]
      // const pos = GetRandomPos([0, 0], [particles_panel.geom.dim[0], particles_panel.geom.dim[1]])
      const pos = [100, 100]

      const ball = Create_rect_mesh(_, [pos[0], pos[1], 2], dim, WHITE, 'Ball', [0, dim[0], 2]);
      ball.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      ball.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // ball.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      ball.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dim[0]);
      ball.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

      particles_panel.AddItem(ball);

      balls_buffer[i] = ball

      // const color = GetSequencedColor()
      // const color = YELLOW[9];
      const color = ORANGER[9];

      const scale = 2.;
      const particles_size = dim[1] * scale;
      // const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles ${i}`, color, [0, 0, 1], [particles_size, particles_size], 0.005, 1, _, _, _, 8, _, 1);
      const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles ${i}`, color, [0, 0, 1], [particles_size, particles_size], 0.015, 1, 0, _, _, 4, _, 1);
      const tail_emitter = Particles_get_particle_system(tail_emitter_idx);
      // tail_emitter.EnableProperties(PARTICLES.HAS_RANDOM_POLAR_COORD);
      // tail_emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
      // tail_emitter.EnableProperties(PARTICLES.HAS_JIGGLE, {jigglex:10, jiggley:10});



      tail_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
      tail_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
      tail_emitter.EnableGfx(MESH_ENABLE.GFX.FX_NOISE); // TODO: Does nothing, there is no enable for '.FX_NOISE'


      // tail_emitter.EnableGfxUniforms({ fx: SID.FX.FS_NOISE, }, 'u_noise_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      tail_emitter.EnableGfxUniforms({ fx: SID.FX.FS_NOISE, }, 'u_noise_params', UNIF_TYPE.FVEC4, UNIFORM.IN_FS);


      // tail_emitter.SetConeOfDirection(-1, 1, 1, -1);





      /****************************************************************************************************************/
      // Secondary particles

      // const glow_emitter_idx = Particle_system_create_emitter('Glow Particles', TRANSPARENCY(color, .5), [0, 0, 3], [glow_size, glow_size], .5, 1., 2, .989, 0, 8);
      const glow_emitter_idx = Particle_system_create_emitter('Glow Particles', TRANSPARENCY(color, .5), [0, 0, 3], [glow_size, glow_size], .005, 1., 1.8, .99, 0, 16, _, 1);
      const glow_emitter = Particles_get_particle_system(glow_emitter_idx);
      glow_emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      glow_emitter.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

      glow_emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
      glow_emitter.EnableProperties(PARTICLES.HAS_JIGGLE, { jigglex: 1, jiggley: 2 });
      glow_emitter.EnableProperties(PARTICLES.HAS_FADE);

      glow_emitter.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
      glow_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
      glow_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0.0);

      { // Test Shaders
         // glow_emitter.EnableGfx(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
         // glow_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a:0.01, b:0.0 });
      }

      glow_emitter.EnableGfx(MESH_ENABLE.GFX.FN_GLOW);
      glow_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
      glow_emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

      // glow_emitter.EnableGfx(MESH_ENABLE.GFX.FN_GLOW);
      // glow_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, glow_size);
      // glow_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
      // glow_emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);




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

   particles_panel.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, particles_panel.mesh_bufferidx, true);
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
      glow_emitter.GfxUniformSetAndUpdate('u_scale2', [.12, 1]);
      // glow_emitter.GfxUniformSetAndUpdate('u_generic_controls', [.3, 1, .2]);
      glow_emitter.GfxUniformSetAndUpdate('u_generic_controls', [1., 1, .31]);


      // Render Ball tail particles on top of the glow particles
      const tail_emitter = noise_particles_buffer[i];
      Particles_gen_gfx_ctx(tail_emitter, particles_panel);
      // Initialize values to uniforms
      // tail_emitter.GfxUniformSetAndUpdate('u_noise_params', [1, 0, .12]);
      tail_emitter.GfxUniformSetAndUpdate('u_noise_params', [1, 0, .12, 1]);

   }


   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], TRANSPARENCY(GREY[1], .5), 'Emitter Window Panel', [0, 10, 2],);
   // controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   const zpos = -1

   { // Create color picker panel
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], GREEN[6], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, GREY[1], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, GREY[1], _);
      // colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);

      const cp_params = {
         noise_particles_buffer: noise_particles_buffer,
         glow_particles_buffer: glow_particles_buffer,
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

                  const noise_particles_buffer = params.noise_particles_buffer;
                  const glow_particles_buffer = params.glow_particles_buffer;
                  const color = col;

                  const len = noise_particles_buffer.length;
                  for (let i = 0; i < len; i++) {

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

      // panel.Calc_no_gfx_update();
   }






   if (controls_create_but_not_render) { // Create slider controls only if this is to be rendered from this function


      /****************************************************************************************************************/
      // Tail Particle System: Contol Sliders 

      const comet_contols_buffer = Create_comet_noise_contols(noise_particles_buffer, YELLOWL[2], _);
      const len = comet_contols_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = comet_contols_buffer[i];
         controls_section.AddItem(ctrl);
      }

      controls_section.MoveNoGfxUpdate(VIEWPORT.WIDTH - 250, 400)




      /****************************************************************************************************************/
      // Glow Particle System: Contol Sliders 
      // const parameters = [0.2, .48, .5, .19, .08, .4, .04, .04, .55];
      // const generic_controls_parameters = [.7, 1., .12];
      // const glow_contols_buffer = Create_comet_glow_contols(glow_particles_buffer, YELLOWL[2], parameters, true, generic_controls_parameters);
      const glow_contols_buffer = Create_comet_glow_contols(glow_particles_buffer, YELLOWL[2], _);
      const glow_len = glow_contols_buffer.length;
      for (let i = 0; i < glow_len; i++) {
         const ctrl = glow_contols_buffer[i];
         controls_section.AddItem(ctrl);
      }


   }

   controls_section.GfxCtxAddFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC | GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_section.mesh_bufferidx, true);



   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function



      /****************************************************************************************************************/
      // Render 

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
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

   Time_intervals_create(1, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_comet, params);
   // Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_comet_perimetric, params);


   return {
      particles_panel: particles_panel,
      controls_section: controls_section,
      noise_particles_buffer: noise_particles_buffer,
      glow_particles_buffer: glow_particles_buffer,
   };

}

/** For rendering the slider controls seperately from the ball tail particles */
export function Create_comet_noise_contols(noise_particles_buffer, color = GREY[2], parameters = null,) {


   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }


   const controls_buffer = [];


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
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         slider.SetInitialValue(parameters !== null ? parameters[0] : 0);
         controls_buffer.push(slider);


         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
      { // Slider 2 contol
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Intensity');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         slider.SetInitialValue(parameters ? parameters[1] : 0);
         slider.SetName('Intensity');
         controls_buffer.push(slider);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 1;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );

      }
      { // Slider 3 contol
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Fire Variation');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         slider.SetInitialValue(parameters ? parameters[2] : 0);
         slider.SetName('Fire Variation');
         controls_buffer.push(slider);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      { // Slider 4 contol: Uniform value in fragment shader
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Noise Complexity');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         slider.SetInitialValue(parameters ? parameters[3] : .12);
         // slider.SetInitialValue(parameters?parameters[3]:.05);
         slider.SetName('Noise Complexity');
         controls_buffer.push(slider);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 2;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_noise_params');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
      // { // SHADER UNIFORMS: Particle Scale
      //    const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Particle Scale');
      // //    slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      //    slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      // slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      //    controls_buffer.push(slider);
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


   return controls_buffer;
}
/** For rendering the slider controls seperately from the ball tail particles */
export function Create_comet_glow_contols(glow_particles_buffer, color = GREY[2], parameters = null, scale_down = .12) {


   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }


   const controls_buffer = [];


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
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[0] : 1.);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[0] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );

      }
      { // SHADER UNIFORMS: Particle Glow Brightness
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Brighter');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[1] : 0);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 1;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[1] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );

      }
      { // SHADER UNIFORMS: Particle Glow Intensity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Intensity');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[2] : .13);

         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 2;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_generic_controls');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[2] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );

      }
      { // SHADER UNIFORMS: Particle Scale
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Particle Scale');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         controls_buffer.push(slider);
         slider.SetInitialValue(parameters ? parameters[3] : scale_down);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         // Connect sliders to gfx program uniforms 
         Slider_connect(slider, (params, slider_val) => {

            const val_idx = 0;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
            Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

         }, { mnemonics: { parameters: parameters }, },
         );
      }
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
      const tail_emitter = params.params.noise_particles_buffer[i];
      const tail_emitter_idx = tail_emitter.idx;
      const dir = params.params.dir[i];

      // Secondary Particles
      const glow_particles = params.params.glow_particles[i];


      // Move the ball
      const variation = Timer_get_global_timer_cycle() * .3 + .5;
      const x = dir[0] * tail_emitter.speed * variation;
      // const x = dir[0] * tail_emitter.speed * .5;
      const y = dir[1] * tail_emitter.speed * .5;

      ball.geom.AddWposXY(ball.gfx, x, y);
      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;

      const pos = [ball.geom.pos[0] + ball.geom.dim[0], ball.geom.pos[1] + ball.geom.dim[1]];
      tail_emitter.pos[0] = pos[0];
      tail_emitter.pos[1] = pos[1];


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
      glow_particles.pos[0] = pos[0];
      glow_particles.pos[1] = pos[1];

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
      const tail_emitter = params.params.noise_particles_buffer[i];
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


      ball.geom.AddWposXY(ball.gfx, x, y);
      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;

      const pos = [ball.geom.pos[0] + ball.geom.dim[0], ball.geom.pos[1] + ball.geom.dim[1]];
      tail_emitter.pos[0] = pos[0];
      tail_emitter.pos[1] = pos[1];


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
      glow_particles.pos[0] = pos[0];
      glow_particles.pos[1] = pos[1];

      Particle_system_emitt({ params: { target_params: [glow_particles.idx], } });
   }

}
/*********************************************************************************************************************************************************************************************/



















/*********************************************************************************************************************************************************************************************/
/** Smoke Particles - Textured
 */
/*********************************************************************************************************************************************************************************************/

export function Create_smoke_particles(x = 0, y = 0, root_widget = ROOT_WIDGETS.CREATE_ROOT, controls_create = true) {

   /**
    * // TODO: The "u_smoke_params" is one float instead of vec3 that we are passing 
    */

   const emitters = [];
   const emitter_idxs = [];
   const speed = 10;
   let cnt = 0;
   // const dim = [150*DEVICE.device_scale, 150*DEVICE.device_scale];
   const particles_size = 40;


   // Create Particle emitters
   // const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', YELLOWR[9], [-90, y + 530, 0], dim, 1.5, 1, 2, .98, -.1, 3, TEXTURES.SMOKE_1);
   const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', YELLOWR[9], [x, y, 0], [particles_size, particles_size], 0.015, 1, 2, .98, -.1, 3, TEXTURES.SMOKE_1, 1);
   const emitter = Particles_get_particle_system(emitter_idx);
   // emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
   emitter.EnableProperties(PARTICLES.HAS_START_POS_VARIATION);
   emitter.EnableProperties(PARTICLES.HAS_ROTATION);
   emitter.EnableProperties(PARTICLES.HAS_SCALE, 10);
   emitter.EnableProperties(PARTICLES.HAS_FADE);
   emitter.speed = speed;

   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TEX2);


   // emitter.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TEX2);
   emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0.0);

   { // Test Shaders
      // emitter.EnableGfx(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
      // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a:0.01, b:0.0 });
   }

   // emitter.EnableGfx(MESH_ENABLE.GFX.FN_GLOW);
   // emitter.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, particles_size);
   // emitter.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

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
      pass: SID.PASS.WPOS3,
   }


   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, y, 1], [0, 0], TRANSPARENCY(GREY[1], .5), 'SliderSection', [0, 10, 2],);
   // controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);







   /*************************************************************************************************************** */
   // Create Emitter switch and colorpicker switch

   const zpos = -1

   { // Create emitt 
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [x, y, zpos + 1], [0, 0], YELLOWL[4], 'glow_emitter_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      const emitt_btn = Create_widget_button(_, 'Emitt', _, [0, 0, 1], 10, YELLOWR[8], _, [6, 4]);
      // emitt_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      emitt_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      emitt_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      emitt_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      // emitt_btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      emitt_btn.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      emitt_btn.SetName('glow_emitter_switch');
      panel.AddItem(emitt_btn);

      const evt_params = { target_params: [emitter.idx] };
      emitt_btn.Bind(Particle_system_emitt, _, evt_params);
      emitt_btn.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   }
   { // Create emitt continuous
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'glow_emitter_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Emitt', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, YELLOWR[8], WHITE, [5, 5], _, _, _, _);
      // const label = Create_widget_label(_, 'Emitt', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, ORANGER[8], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const emitt_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, YELLOWR[8], _);
      // emitt_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      emitt_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      emitt_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
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
      const panel = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, zpos + 1], [0, 0], YELLOWL[4], 'color_picker_panel');
      panel.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
      controls_section.AddItem(panel);

      // Create label
      const label = Create_widget_label(_, 'Colorpicker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], _, GREY[1], WHITE, [5, 5], _, _, _, _);
      label.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      label.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      panel.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, GREY[1], _);
      // colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      colorpicker_switch.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 16);
      colorpicker_switch.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      colorpicker_switch.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      colorpicker_switch.SetName('color_picker_switch');
      panel.AddItem(colorpicker_switch);

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
         null, { mnemonics: { transparency: 0.5, hue: 0.5, color: null }, }, _,
      );

      // panel.Calc_no_gfx_update();
   }







   /****************************************************************************************************************/
   // Create slider contols
   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const controls_buffer = Create_smoke_particles_controls(emitters[0], YELLOWL[3]);

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

      controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, controls_section.mesh_bufferidx, true);
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
      emitter: emitter,
      controls_section: controls_section,
   };
}


/** For rendering the slider controls seperately from the smoke particles */
export function Create_smoke_particles_controls(emitter, color = GREY[2], parameters = null, shader_parameters = null) {

   const controls_buffer = [];

   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
   const slider_col = color;


   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }


   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles

   /**   NICE EFFECT2: Distance:{.25}, Brighter:{1}, Intensity:{.61}, Intensity:{33}, Gravity:{.48}, Acceleration:{.59}, Decceleration:{19}, DirectionX:{64} 
    *    NICE EFFECT: Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22} 
    *    color:{R:.2, G:.0, B:.8, A:.68, }
    */
   const slider_feather = 2;
   const slider_rcorners = 6;

   // [.71, .71, .78, .5, ]
   // [.48, .08, .48, .0, .5]
   // Contols for shader params
   if (emitter.sid.unif & SID.UNIF.SCALE2) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Scale');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      slider.SetInitialValue(shader_parameters ? shader_parameters[0] : .71);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 0;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_scale2');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, { mnemonics: { shader_parameters: shader_parameters }, },);
   }
   if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Noise UV Coord');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      slider.SetInitialValue(shader_parameters ? shader_parameters[1] : .71);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 0;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, { mnemonics: { shader_parameters: shader_parameters }, },);
   }
   if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Cone Wideness');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      slider.SetInitialValue(shader_parameters ? shader_parameters[2] : .78);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 1;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, { mnemonics: { shader_parameters: shader_parameters }, },);
   }
   if (emitter.sid.fx & SID.FX.FS_SMOKE_VEC3) {
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Complexity');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push.AddToMenu(slider);
      slider.SetInitialValue(shader_parameters ? shader_parameters[3] : .50);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         const val_idx = 2;
         // Find the ubidx
         const ubidx = Mesh_get_uniform_ubidx_from_name(emitter.uniforms, 'u_smoke_params');
         Vertex_buffer_set_and_update_uniform(emitter.gfx.vb.groupidx, ubidx, slider_val, val_idx);

      }, { mnemonics: { shader_parameters: shader_parameters }, },);
   }
   // Contols for tarnsform and physics
   { // Gravity
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[0] : .48);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[1] : .08);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Deccelerarion');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[2] : .48);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position X');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      slider.SetInitialValue(parameters ? parameters[3] : .0);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      Slider_connect(slider, (params, slider_val) => {

         emitter.pos[0] = slider_val * VIEWPORT.WIDTH;

         if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[3] = slider_val;

      }, { mnemonics: { parameters: parameters }, },);
   }
   { // Set Emitter Y Position
      const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
      // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
      slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
      slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_buffer.push(slider);
      // slider.SetInitialValue(.5);
      slider.SetInitialValue(parameters ? parameters[4] : .5);
      slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      Slider_connect(slider, (params, slider_val) => {

         emitter.pos[1] = slider_val * VIEWPORT.HEIGHT;

         if (params.clbk_params.mnemonics.parameters) params.clbk_params.mnemonics.parameters[4] = slider_val;

      }, { mnemonics: { parameters: parameters }, },);
   }


   return controls_buffer;
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

      const emitter_idx = Particle_system_create_emitter('TestParticles', TRANSPARENCY(WHITE, .1), [0, 300, 0], dim, .003, 1, 1, .96, -.1, 3, TEXTURES.SMOKE_1);

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
      pass: SID.PASS.WPOS3,
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
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

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
   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


   const btn = Create_widget_button(_, 'Emitt', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 20, BLUEL[6], WHITE, [5, 5], .5);
   s.AddItem(btn);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idxs] },)


   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
   // properties_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   properties_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   properties_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // properties_btn.EnableGfx(MESH_ENABLE.ATTR_STYLE);
   section.AddItem(properties_btn)

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 4], [0, 0, 2], [0, 800], TRANSPARENCY(GREY[2], 1), 'InnerPanel', [0, 10, 1.8]);
   // s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   section.AddItem(s);

   const heading = Create_widget_label(_, 'Properties Panel', _, [0, 0, 4], _, GREY[1], BLUEL[9], [10, 4], _, [0, 8, 1.8]);
   // heading.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   heading.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   heading.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   s.AddItem(heading);


   if (render_target) {


      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
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
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // section.state.mask |= MESH_STATE.STICKY_POSX;


   // const properties_btn = Create_rect_mesh(_, [0, 2, 11], [VIEWPORT.WIDTH/2, 8], TRANSPARENCY(Interpolate_rgb_to_01(2, 32, 60), 1.), 'Btn', [0, 10, 1.8]);
   const properties_btn = Create_rect_mesh(_, [0, 2, 11], [VIEWPORT.WIDTH / 2 - pad, 8], TRANSPARENCY(Interpolate_rgb_to_01(10, 72, 160), 1.), 'Btn', [0, 100, 1.8]);
   // properties_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   properties_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   properties_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   // properties_btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   properties_btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   // properties_btn.EnableGfx(MESH_ENABLE.ATTR_STYLE);
   section.AddItem(properties_btn)

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 4], [0, 20, 2], [0, 800], TRANSPARENCY(GREY[2], 1), 'InnerPanel', [0, 10, 1.8]);
   // s.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   section.AddItem(s);

   const heading = Create_widget_label(_, 'Properties Panel', _, [0, 0, 4], _, GREY[1], BLUEL[9], [10, 4], _, [0, 8, 1.8]);
   // heading.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   heading.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   heading.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   s.AddItem(heading);

   // section.geom.pos[0] -= 200



   if (render_target) {


      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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












