"use strict";



import { Callback_animations_create } from '../../Engine/Animations/CallbackAnimations.js';
import { Mesh_animations_create } from '../../Engine/Animations/MeshAnimations.js';
import { Create_rect_mesh, Create_widget_button, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_scroller, Create_widget_section, Create_widget_slider, Create_widget_switch_simple } from '../../Engine/Core/CreateWidget.js';
import { Mesh_buffer_get_mesh_byidx, Widget_root_activate_all_vbs_in_renderqueue, Widget_root_set_render_queue_priority } from '../../Engine/Core/MeshBuffer.js';
import { View_build_group_from_root_mesh } from '../../Engine/Core/MeshBufferViews.js';
import { Mesh_unif_add_vb_root_wposx, Mesh_unif_add_vb_root_wposy, Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos, Mesh_unif_get_vb_root_wposx, Mesh_unif_get_vb_root_wposy } from '../../Engine/Core/MeshUniformsBuffer.js';
import { Debug_info_ui } from '../../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { BLACK, BLUEL, GREEN, GREY, Interpolate_rgb_to_01, ORANGE, ORANGEL, ORANGER, PURPLEB, PURPLER, WHITE, YELLOW, YELLOWL, YELLOWR } from '../../Engine/Drawables/Material/Base/Colors.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../../Engine/Drawables/Operations/Recursions.js';
import { Components_create_scroller_component, Scoller_component_gengfx_and_render } from '../../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Dropdown_roots_set_root } from '../../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Slider_connect, Slider_get_slider_val } from '../../Engine/Drawables/Widgets/WidgetSlider.js';
import { Switch_simple_time_interval_callback } from '../../Engine/Drawables/Widgets/WidgetSwitch.js';
import { Listeners_set_priority } from '../../Engine/Events/EventListeners.js';
import { Particle_system_create_emitter, Particle_system_emitt, Particles_get_particle_system, Particles_gfx_uniforms_set_clbk, TEMP_PARTICLES_GEN_GFX } from '../../Engine/ParticlesSystem/ParticlesSystem.js';
import { Renderqueue_set_priority_by_vb } from '../../Engine/Renderers/Renderer/RenderQueue.js';
import { Time_intervals_create } from '../../Engine/Timers/TimeIntervals.js';
import { TimerGetGlobalTimerCycle } from '../../Engine/Timers/Timers.js';
import { Vertex_buffer_group_create_scissorbox } from '../../Graphics/Buffers/VertexBuffers.js';
import { Gl_set_rgba } from '../../Graphics/Buffers/VertexBuffersOps.js';
import { GetRandomPos, GetSequencedColor } from '../../Helpers/Helpers.js';
import { CopyArr4 } from '../../Helpers/Math/MathOperations.js';
import { CreateColorPicker } from '../TestWidgets.js';















export function CreateGlowParticles(x = 0, y = 0, root_widget = ROOT_WIDGETS.CREATE_ROOT) { // 3 control Sliders 

   /**
    * // TODO:
    * // BUG: The settings dealt from a callback update the emitter's parameters, but the particles 
    * themselves are not being updated until the destruction and recreation of a new particle
    */

   const scale_down = .2;

   const emitter_idx1 = Particle_system_create_emitter('Particle System Glow Emitter', BLUEL[9], [x, y, 10], [40, 40], .6, 1, 4, .98, .1, 4);
   const emitter = Particles_get_particle_system(emitter_idx1);
   emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;

   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   emitter.EnableGfxUniforms(0x0, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);


   emitter.SetConeOfDirection(1, 1, .2, -.2);



   // Second Particle Emitter
   // const emitter_idx2 = Particle_system_create_emitter('Test Particle System2', PURPLER[5], [300,300,10], [40,40], .6, 1, 4, .98, .1);
   // const emitter2 = Particles_get_particle_system(emitter_idx2);
   // emitter2.flags |= PARTICLES.HAS_START_POS_VARIATION;

   // emitter2.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW);
   // emitter2.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
   // emitter2.EnableGfxUniforms({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   // emitter2.EnableGfxUniforms(0x0, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

   // TEMP_PARTICLES_GEN_GFX(emitter2);
   // emitter2.GfxUniformsSetClbk('u_scale2', function(){return [scale_down,1]}, emitter2.gfx.vb.groupidx);

   // // emitter2.SetDir(1,1); // Enable emitters direction. By default is [0,0].
   // emitter2.SetConeOfDirection(-1, 1, -1, -1);










   /*************************************************************************************************************** */
   // Create Particles Control Panel

   const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];


   const slider_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [VIEWPORT.WIDTH - slider_dim[0] * 2 - 40, 60, 1], [0, 0], GREEN[2], 'SliderSection', [0, 10, 2],);
   slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   // slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }
   slider_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   
   /****************************************************************************************************************/
   // Add the emitter here, because it needs a parent mesh to pass as param
   TEMP_PARTICLES_GEN_GFX(emitter, slider_section);
   emitter.GfxUniformsSetClbk('u_scale2', function () { return [scale_down, 1] }, emitter.gfx.vb.groupidx);



   /****************************************************************************************************************/
   // Create the emitter button, as well as a switch to auto-emitt particles
   const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Emitt', _, [0, 0, 1], 20, BLUEL[6], WHITE, [5, 5], .5);
   slider_section.AddItem(btn)
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   btn.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   // btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idx1, emitter_idx2] }, MESH_STATE.IS_HOLD_CLICK)
   btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idx1] }, MESH_STATE.IS_HOLD_CLICK)




   /****************************************************************************************************************/
   // Create the switch to auto-emitt particles
   const emitt_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, BLUEL[6], _);
   slider_section.AddItem(emitt_switch);
   emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
   emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
   const evt_params = { target_params: [emitter_idx1] };
   /**
    * Pass the Emitt pareticles callback 'Particle_system_emitt' as the t'targetBindingFunctions' parameter, 
    * so that the 'OnClick' of the switch widget will call the 'Switch_simple_time_interval_callback' 
    * that will create the timeInterval passing the 'Particle_system_emitt' callback.
    */
   emitt_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
   emitt_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);




   /****************************************************************************************************************/
   // Create the switch to create/destroy colorpicker for particles color control
   const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, BLUEL[6], _);
   slider_section.AddItem(colorpicker_switch);
   colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
   colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
   colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
            // How should this callback know about the colorpicker, so that it can destroy it???????

            const colorpicker = CreateColorPicker(x, y, _, ROOT_WIDGETS.CREATE_ROOT);
            colorpicker.AssignTargetMeshClbk((params) => {
               const color = params;

               CopyArr4(slider_section.mat.col, color);
               CopyArr4(slider_section.mat.defCol, color);
               Gl_set_rgba(slider_section.gfx, color, slider_section.geom.num_faces);
               CopyArr4(emitter.col, color);
            });
            switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
         }
         else {

            const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
            colorpicker.Destroy();
         }
      },
      null, null,
   );

   /***********************************************************************************************/
   // Create Color Picker (INDEPENDENT CANNOT BE DESTROYED) to change the particles color
   // const picker = CreateColorPicker(x, y, _, 0x0);
   // picker.AssignTargetMeshClbk((params)=>{
   //     const color = params;
   //     Gl_set_rgba(slider_section.gfx, color, slider_section.geom.num_faces);
   //     CopyArr4(emitter.col, color);
   // });
   // slider_section.


   /*************************************************************************************************************** */
   // Create Sliders for manipulating variables of particles
   /**
    * NICE EFFECT:
    * Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22}
    */
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function

      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Distance');
         slider_section.AddItem(slider);
         slider.SetInitialValue(71);

         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 0)
         // Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 0)
      }
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Brighter');
         slider_section.AddItem(slider);
         slider.SetInitialValue(62);

         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 1)
         // Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 1)
      }
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Intensity');
         slider_section.AddItem(slider);
         slider.SetInitialValue(2);


         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 2)
         // Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 2)
      }
      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Gravity');
         slider_section.AddItem(slider);
         slider.SetInitialValue(48);


         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});

            // Linear Interpolation
            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitter.gravity = y;
         }, _);
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Acceleration');
         slider_section.AddItem(slider);
         slider.SetInitialValue(59);


         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            emitter.accel = slider_val;

            // Linear Interpolation
            const max = 15, start = 0;
            const y = (slider_val * max) + start;
            emitter.accel = y;
            emitter.max_speed = 4;
         }, _);
      }
      { // Deccelerarion
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Deccelerarion');
         slider_section.AddItem(slider);
         slider.SetInitialValue(19);


         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            /* Solve for y~={0.5, 1.0}  => {h:1, k:-2.0, r:1.2} */
            /* Solve for y~={0.9, 1.0}  => {h:1, k:-4.0, r:5.0} */

            /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            let y = 0;
            y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitter.deccel = y;

         }, _);
      }
      { // Set Emitter X Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Emitter Position X');
         slider_section.AddItem(slider);
         slider.SetInitialValue(8);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const y = slider_val * VIEWPORT.WIDTH;
            emitter.pos[0] = y;
            // Mesh_unif_set_vb_root_wposx(emitter.root_posidx, y);
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Emitter Position Y');
         slider_section.AddItem(slider);
         slider.SetInitialValue(40);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const y = slider_val * VIEWPORT.HEIGHT;
            emitter.pos[1] = y;
            // Mesh_unif_set_vb_root_wposy(emitter.root_posidx, y);
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction Y Up ');
         slider_section.AddItem(slider);
         slider.SetInitialValue(10);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = -1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_neg = y;
            console.log(slider_val, y)
         }, _);
      }
      { // Set Emitter Y Direction Y Down
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction Y Down');
         slider_section.AddItem(slider);
         slider.SetInitialValue(10);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = 1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_pos = y;
            console.log(slider_val, y)
         }, _);
      }
      { // Set Emitter Direction X Left
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction X Left');
         slider_section.AddItem(slider);
         slider.SetInitialValue(55);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {

            // const slider_val = Slider_get_slider_val({slider:slider});
            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitter.variation_emission.xdir_pos = y;
            emitter.variation_emission.xdir_neg = y;
            console.log(slider_val, y)
         }, _);
      }



      slider_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
      slider_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
      slider_section.Calc_no_gfx_update();
      slider_section.Render();
      Widget_root_activate_all_vbs_in_renderqueue(slider_section.root_bufferidx);

      Construct_listen_events_from_mesh_tree(slider_section);
      Construct_listen_events_relations_from_mesh_tree(slider_section);


      slider_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_section.gfx.vb.groupidx);
   }

   return emitter;

}



export function CreateBallTailParticles(x = 0, y = 0, width=VIEWPORT.WIDTH/2-10, height=VIEWPORT.HEIGHT/2 - 150, num_balls = 2, root_widget = ROOT_WIDGETS.CREATE_ROOT) { // Particles Bouncing Ball Tail

   let balls_buffer = [];
   let dirs_buffer = [];
   let tail_particles_buffer = [];
   let glow_particles_buffer = [];


   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x, y, 0], [width, height], TRANSPARENCY(GREY[1], 1.0), 'Particles Bouncing Ball Tail',)
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);



   let swap_dir = 1; // Create direction variation in case of rendering many balls 
   for (let i = 0; i < num_balls; i++) {




      /**************************************************************************************************************************************/
      // Balltail particles
      const dim = [10, 10]
      const pos = GetRandomPos([0, 0], [section.geom.dim[0], section.geom.dim[1]])

      const ball = Create_rect_mesh(_, [pos[0], pos[1], 2], dim, WHITE, 'Ball', [0, dim[0], 2]);
      ball.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      ball.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ball.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      section.AddItem(ball);

      balls_buffer[i] = ball

      const color = GetSequencedColor()

      const scale = 2.;
      const particles_dim = [dim[0] * scale, dim[1] * scale]
      // const particles_dim = [300, 300]
      const tail_emitter_idx = Particle_system_create_emitter(`Tail Particles ${i}`, color, [0, 0, 1], particles_dim, .7, 1);
      const tail_emitter = Particles_get_particle_system(tail_emitter_idx);


      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      tail_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);

      tail_emitter.EnableGfxUniforms(0x0, 'u_noise_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      
      
      
      
      
      /**************************************************************************************************************************************/
      // Secondary particles
      
      const glow_emitter_idx = Particle_system_create_emitter('Glow Particles', color, [0, 0, 3], [40, 40], 1, 1, 2, .79, 0, 2);
      const glow_emitter = Particles_get_particle_system(glow_emitter_idx);
      glow_emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      
      glow_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW);
      glow_emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
      glow_emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      glow_emitter.EnableGfxUniforms(0x0, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

      glow_emitter.SetDir(-1, -1);
      glow_emitter.SetConeOfDirection(-.1, .1, .1, -.1);
      glow_particles_buffer[i] = glow_emitter;





      /**************************************************************************************************************************************/
      // Render Ball tail particles on top of the glow particles

      tail_emitter.SetDir(1, 1 * swap_dir);


      tail_particles_buffer[i] = tail_emitter;
      dirs_buffer[i] = [1, 1 * swap_dir]

      swap_dir *= -1;


   }


   /***************************************************************************************************************/
   // Render 

   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

   section.Render();
   Widget_root_activate_all_vbs_in_renderqueue(section.root_bufferidx);


   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);


   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);


   // IMPORTANT: Generate particles gfx after the generation of any parent mesh, so that the particles system unif_wpos has a parent root_posidx
   for (let i = 0; i < num_balls; i++) {

      const scale_down = .04;
      // const scale_down = .22;
      
      const glow_emitter = glow_particles_buffer[i];
      TEMP_PARTICLES_GEN_GFX(glow_emitter, section);
      // TODO: Create SetScale callback from within the particles class, so we can moderate the scale with uniforms
      glow_emitter.GfxUniformsSetClbk('u_scale2', function () { return [scale_down, 1] }, glow_emitter.gfx.vb.groupidx);


      // Render Ball tail particles on top of the glow particles
      const tail_emitter = tail_particles_buffer[i];
      TEMP_PARTICLES_GEN_GFX(tail_emitter, section);

   }





   /*************************************************************************************************************** */
   // Create Sliders for manipulating variables of particles

   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function
      const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];
      // const slider_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10,10], [x+VIEWPORT.WIDTH-slider_dim[0]*2-40, y+60, 1], [0,0], GREEN[2], 'SliderSection', [0,10,2], );
      const slider_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x + VIEWPORT.WIDTH - slider_dim[0] * 2 - 40, 500, 1], [0, 0], GREEN[2], 'SliderSection', [0, 10, 2],);
      slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      // slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

      const flags = {
         unif: SID.UNIF.ROOT_WPOS2,
         pass: SID.PASS.WPOS2,
      }

      slider_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);




      /****************************************************************************************************************/
      // Create the switch to create/destroy colorpicker for particles color control
      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, BLUEL[6], _);
      slider_section.AddItem(colorpicker_switch);
      colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
               // How should this callback know about the colorpicker, so that it can destroy it???????

               const colorpicker = CreateColorPicker(x, section.geom.dim[1] * 2, _, ROOT_WIDGETS.CREATE_ROOT);
               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;
                  Gl_set_rgba(slider_section.gfx, color, slider_section.geom.num_faces);

                  CopyArr4(tail_particles_buffer[0].col, color);
                  CopyArr4(glow_particles_buffer[0].col, color);
                  // For control of all ball's tail particles
                  // for(let i=0; i<num_balls; i++){
                  //     CopyArr4(tail_particles_buffer[i].col, color);
                  //     CopyArr4(glow_particles_buffer[i].col, color);
                  // }
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {

               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, null,
      );






      /****************************************************************************************************************/
      // Tail Particle System: Contol Sliders 
      const tail_buffer_len = tail_particles_buffer.length;
      {

         // const glow_emitter = tail_particles_buffer[i]

         { // Slider 1 contol
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Speed');
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);


            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


            Slider_connect(slider, (params, slider_val) => {

               // const slider_val = Slider_get_slider_val({slider:slider, start_val:0, max:1});

               for (let i = 0; i < tail_buffer_len; i++) {

                  const glow_emitter = tail_particles_buffer[i]
                  let min = .8; // The min value gives the prolonged glow_emitter
                  let max = 1.; // Calculate that the max value will be +1+min
                  const rev_slider_val = 1 - slider_val;
                  glow_emitter.t_step = rev_slider_val + min + ((max - slider_val) * (rev_slider_val));
                  glow_emitter.speed = (slider_val + 1) * 3;
               }
            }, _);

         }
         { // Slider 2 contol
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Intensity');
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 1)
            }

         }
         { // Slider 3 contol
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Fire Variation');
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 0)
            }
         }
         { // Slider 4 contol: Uniform value in fragment shader
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Noise Complexity');
            slider.SetInitialValue(12);
            slider_section.AddItem(slider);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 2)
            }
         }
      }

      // Glow Particle System: Contol Sliders 
      const glow_buffer_len = glow_particles_buffer.length;
      for (let i = 0; i < glow_buffer_len; i++) {

         const glow_emitter = glow_particles_buffer[i]
         /**
          * NICE EFFECT:
          * Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22}
          */

         {
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Distance');
            slider_section.AddItem(slider);
            slider.SetInitialValue(0);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 0)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Brighter');
            slider_section.AddItem(slider);
            slider.SetInitialValue(100);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 1)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Intensity');
            slider_section.AddItem(slider);
            slider.SetInitialValue(3);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 2)
         }
      }

      slider_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
      slider_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
      slider_section.Calc_no_gfx_update();
      slider_section.Render();
      Widget_root_activate_all_vbs_in_renderqueue(slider_section.root_bufferidx);


      Construct_listen_events_from_mesh_tree(slider_section);
      Construct_listen_events_relations_from_mesh_tree(slider_section);

      slider_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_section.gfx.vb.groupidx);
   }








   /****************************************************************************************************************/
   // Create the ball's animation callback
   const AnimateBall = function (params) {


      const section = params.params.section;


      const top_bound = 0;
      const bot_bound = section.geom.dim[1] * 2;
      const left_bound = 0;
      const right_bound = section.geom.dim[0] * 2;

      const len = params.params.ball.length;
      for (let i = 0; i < len; i++) {

         const ball = params.params.ball[i];
         const tail_emitter = params.params.tail_particles_buffer[i];
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



   const params = {
      section: section,
      ball: balls_buffer,
      dir: dirs_buffer,
      tail_particles_buffer: tail_particles_buffer,
      glow_particles: glow_particles_buffer,
   }

   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, AnimateBall, params);


   const particles_params = {
       params: {
           target_params:[tail_particles_buffer[0].idx],
       }
   }
   Particle_system_emitt(particles_params);



   return {
      section: section,
      tail_particles_buffer: tail_particles_buffer,
      glow_particles_buffer: glow_particles_buffer,
   };
}



export function CreateSmokeParticles(x = 0, y = 0) {

   /**
    * // TODO: The "u_smoke_params" is one float instead of vec3 that we are passing 
    */

   const emitters = [];
   const emitter_idxs = [];
   const speed = 10;
   let cnt = 0;
   const dim = [150*DEVICE.device_scale, 150*DEVICE.device_scale];


   // Create Particle emitters
   { // Emitter 1
      const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', PURPLEB[9], [-90, y + 530, 0], dim, 1.5, 1, 2, .98, -.1, 3);
      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;

      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxUniforms({ fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

      TEMP_PARTICLES_GEN_GFX(emitter);


      emitter.SetConeOfDirection(1, 1, -.1, .2);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++
   }
   { // Emitter 2
      const emitter_idx = Particle_system_create_emitter('SmokeParticles 2', PURPLER[9], [-90, y + 420, 0], dim, .7, 1, 2, .98, -.1, 3);
      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;

      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxUniforms({ unif: SID.UNIF.UNIF_SMOKE2, fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

      TEMP_PARTICLES_GEN_GFX(emitter);

      emitter.GfxUniformsSetClbk('u_smoke_params', function () { return [1, 1, 1] }, emitter.gfx.vb.groupidx);

      emitter.SetConeOfDirection(1, 1, -.1, .2);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++
   }
   { // Emitter 3
      const emitter_idx = Particle_system_create_emitter('SmokeParticles 3', YELLOW[9], [-90, y + 310, 0], dim, .7, 1, 2, .98, -.1, 3);
      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;

      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxUniforms({ unif: SID.UNIF.UNIF_SMOKE2, fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

      TEMP_PARTICLES_GEN_GFX(emitter);

      emitter.GfxUniformsSetClbk('u_smoke_params', function () { return [1, 1, 1] }, emitter.gfx.vb.groupidx);

      emitter.SetConeOfDirection(1, 1, -.1, .2);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++
   }
   { // Emitter 4
      const emitter_idx = Particle_system_create_emitter('SmokeParticles 4', GREEN[9], [-90, y + 200, 0], dim, .7, 1, 2, .98, -.1, 3);
      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;

      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxUniforms({ unif: SID.UNIF.UNIF_SMOKE2, fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

      TEMP_PARTICLES_GEN_GFX(emitter);

      emitter.GfxUniformsSetClbk('u_smoke_params', function () { return [1, 1, 1] }, emitter.gfx.vb.groupidx);

      emitter.SetConeOfDirection(1, 1, -.1, .2);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++

   }


   /*************************************************************************************************************** */
   // Create Particles Control Panel

   const slider_dim = [120, 10];


   const slider_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [VIEWPORT.WIDTH/2 - slider_dim[0] * 2 - 40, y + 60, 1], [0, 0], GREEN[2], 'SliderSection', [0, 10, 2],);
   // const slider_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [100, 60, 1], [0, 0], GREEN[2], 'SliderSection', [0, 10, 2],);
   slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }


   /****************************************************************************************************************/
   // Create the emitter button, as well as a switch to auto-emitt particles
   const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Emitt', _, [0, 0, 1], 20, BLUEL[6], WHITE, [5, 5], .5);
   slider_section.AddItem(btn)
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   btn.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   // btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idx1, emitter_idx2] }, MESH_STATE.IS_HOLD_CLICK)
   btn.Bind(Particle_system_emitt, _, { target_params: emitter_idxs }, MESH_STATE.IS_HOLD_CLICK)

   /****************************************************************************************************************/
   // Create the switch to auto-emitt particles
   const emitt_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, BLUEL[6], _);
   const evt_params = { target_params: emitter_idxs };
   emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
   emitt_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
   /**
    * Pass the Emitt pareticles callback 'Particle_system_emitt' as the t'targetBindingFunctions' parameter, 
    * so that the 'OnClick' of the switch widget will call the 'Switch_simple_time_interval_callback' 
    * that will create the timeInterval passing the 'Particle_system_emitt' callback.
    */
   emitt_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
   emitt_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);




   /*************************************************************************************************************** */
   // Create Sliders for manipulating variables of particles

   slider_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider_section.AddItem(emitt_switch)




   /****************************************************************************************************************/
   // Create the switch to create/destroy colorpicker for particles color control
   const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, 1], 18, BLUEL[6], _);
   slider_section.AddItem(colorpicker_switch);
   colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
   colorpicker_switch.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
   colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
            // How should this callback know about the colorpicker, so that it can destroy it???????

            const colorpicker = CreateColorPicker(x, y, _, ROOT_WIDGETS.CREATE_ROOT);
            colorpicker.AssignTargetMeshClbk((params) => {
               const color = params;
               Gl_set_rgba(slider_section.gfx, color, slider_section.geom.num_faces);

               CopyArr4(emitters[0].col, color);
            });
            switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
         }
         else {

            const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
            colorpicker.Destroy();
         }
      },
      null, null,
   );





   /****************************************************************************************************************/
   // Create slider contols
   {
      /** Good Effect: 
       * Gravity:{.5} 
       * Acceleration:{.2} 
       * Decceleration:{.48}
       * Color:
       * Alpha:{.224} 
       */
      { // Distance
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Distance');
         slider_section.AddItem(slider);
         slider.SetInitialValue(71);
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 0)
      }
      { // Unused
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Unused');
         slider_section.AddItem(slider);
         slider.SetInitialValue(0);
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         // Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 1)
      }
      { // Unused
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Unused');
         slider_section.AddItem(slider);
         slider.SetInitialValue(0);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         // Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 2)
      }
      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Gravity');
         slider_section.AddItem(slider);
         slider.SetInitialValue(50);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            // Linear Interpolation
            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitters[0].gravity = y;
         }, _);
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Acceleration');
         slider_section.AddItem(slider);
         slider.SetInitialValue(13);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            emitters[0].accel = slider_val;
   
            // Linear Interpolation
            const max = 15, start = 0;
            const y = (slider_val * max) + start;
            emitters[0].accel = y;
            emitters[0].max_speed = 4;
         }, _);
      }
      { // Deccelerarion
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Deccelerarion');
         slider_section.AddItem(slider);
         slider.SetInitialValue(73);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            let y = 0;
            y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitters[0].deccel = y;
   
         }, _);
      }
   }


   slider_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   slider_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   slider_section.Calc_no_gfx_update();
   slider_section.Render();
   Widget_root_activate_all_vbs_in_renderqueue(slider_section.root_bufferidx);


   Construct_listen_events_from_mesh_tree(slider_section);
   Construct_listen_events_relations_from_mesh_tree(slider_section);

   slider_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_section.gfx.vb.groupidx);

}



export function TestNoiseShader() {

   const emitters = [];
   const emitter_idxs = [];
   const speed = 10;
   let cnt = 0;
   const size = 40
   const dim = [size*DEVICE.device_scale, size*DEVICE.device_scale]

   // Create Particle emitters
   {
      // const emitter_idx = Particle_system_create_emitter('TestParticles', TRANSPARENCY(WHITE, .2), [0, 300, 0], dim, .5, 1, 2, .96, -.1, 3);
      // const emitter_idx = Particle_system_create_emitter('TestParticles', TRANSPARENCY(WHITE, .25), [0, 300, 0], dim, .8, 1, 1, .96, -.1, 3, TEXTURES.SMOKE_1);
      const emitter_idx = Particle_system_create_emitter('TestParticles', TRANSPARENCY(WHITE, .1), [0, 300, 0], dim, .3, 1, 1, .96, -.1, 3, TEXTURES.SMOKE_1);

      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;
      // emitter.EnableGfxShadAttributes(SID.SHAD.FS_TEST1);


      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      // emitter.EnableGfxUniforms({ fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      // emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      TEMP_PARTICLES_GEN_GFX(emitter);

      // emitter.GfxUniformsSetClbk('u_smoke_params', function () { return [1, 1, 1] }, emitter.gfx.vb.groupidx);
      // emitter.GfxUniformsSetClbk('u_scale2', function () { return [.5, .5] }, emitter.gfx.vb.groupidx);


      emitter.SetConeOfDirection(1, 1, -.9, .4);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++
   }








   /*************************************************************************************************************************************************/
   /*************************************************************************************************************************************************/
   // Emitter controls

   const header_font_size = 9*DEVICE.device_scale;
   const regular_font_size = 8*DEVICE.device_scale;

   // Style for the Section widgets.
   const section_pad = [0, 0];
   const clp_fontsize = regular_font_size;
   const trans = .2, trans2 = .2;

   // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
   const label_style = [0, 6, 2];
   const label_pad = [6, 6];
   const label_col = TRANSPARENCY(BLUEL[1], 0);
   const label_text_col = WHITE;
   
   
   const slider_col = TRANSPARENCY(GREY[5], .1);
   const slider_text_col = WHITE;
   
   // Style for the switch widgets
   const C1 = TRANSPARENCY(BLACK, trans2);
   const CGREY = TRANSPARENCY(GREY[0], trans2);
   const switch_size = 19*DEVICE.device_scale;
   const switch_pad = 4;
   const switch_col = TRANSPARENCY(GREY[8], .1);
   const section_col = C1;
   const switch_col2 = TRANSPARENCY(GREY[1], trans2);
   let zpos = 0;
      
   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }

   const controls_dp = Create_widget_dropdown(_, 'Emitter Test', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
   controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
   
      emitter_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      const evt_params = { target_params: [emitter_idxs[0]] };
      emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
      emitter_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   
      controls_dp.AddToMenu(emitter_section);
   }
   
   { // Color picker switch  label

      zpos = -1
      const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
      
      // Create label
      const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      color_picker.AddItem(label);
      color_picker.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      // Create switch
      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      colorpicker_switch.SetName('color_picker switch');
      color_picker.AddItem(colorpicker_switch);
      
      colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
               // How should this callback know about the colorpicker, so that it can destroy it???????
               
               // const colorpicker = CreateColorPicker(x, y, _, ROOT_WIDGETS.CREATE_ROOT,);
               
               
               const colorpicker = Create_widget_color_picker(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [emitters[0].pos[0], emitters[0].pos[1]+50, 0], [300, 200], [GREY[0], GREY[1], GREY[0], GREY[1]], _, [0, 35, 2]);
               colorpicker.sid.inst = 0x0;
               colorpicker.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
               colorpicker.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
               
               colorpicker.ColorpickerCreateListeners();
               
               
               // TODO: The slider from colorpicker updates correctly but the glow particles chuuue and transparency do not update    
               colorpicker.SetTransparencySliderSetInitialValue(100)
               colorpicker.SetHueSliderSetInitialValue(66)
               
               colorpicker.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
               colorpicker.Calc_no_gfx_update();
               colorpicker.Render();
               Widget_root_activate_all_vbs_in_renderqueue(colorpicker.root_bufferidx);

               colorpicker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, colorpicker.gfx.vb.groupidx);

               Renderqueue_set_priority_by_vb(FIRST, colorpicker.gfx.vb.groupidx);
      
               Construct_listen_events_from_mesh_tree(colorpicker);
               Construct_listen_events_relations_from_mesh_tree(colorpicker);


               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;
   
                  // Add color to controls dropdown
                  // CopyArr4(controls_dp.mat.col, color);
                  // CopyArr4(controls_dp.mat.defCol, color);
                  // Gl_set_rgba(controls_dp.gfx, color, controls_dp.geom.num_faces);
                  CopyArr4(emitters[0].col, color);
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

   { // Contol Params for shader params

      // const glow_controls_dp = Create_widget_dropdown(_, 'Shader Params', [0, 0, zpos], YELLOW[6], CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
      // glow_controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // {
      //    const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Scale');
      //    glow_controls_dp.AddToMenu(slider);
      //    slider.SetInitialValue(71);
   
      //    slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
      //    Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_scale2', Slider_get_slider_val, slider, 0);

      //    // TODO: Implement the resizing of the emitter. Needs to run by the ONE callback we set for updating the u_scale2. How to do it????
      //    // Change the dimention of the particle mesh
      // }
      // {
      //    const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Noise UV Coord');
      //    glow_controls_dp.AddToMenu(slider);
      //    slider.SetInitialValue(71);
   
      //    slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
      //    Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 0)
      // }
      // {
      //    const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Cone Wideness');
      //    glow_controls_dp.AddToMenu(slider);
      //    slider.SetInitialValue(78);
   
      //    slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
      //    Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 1)
      // }
      // {
      //    const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Complexity');
      //    glow_controls_dp.AddToMenu(slider);
      //    slider.SetInitialValue(50);
   
   
      //    slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
      //    Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 2)
      // }

      // controls_dp.AddToMenu(glow_controls_dp)
   }

   { // Contol Params for tarnsform and physics

      const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];
      const glow_controls_dp2 = Create_widget_dropdown(_, 'Transform Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
      glow_controls_dp2.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      controls_dp.AddToMenu(glow_controls_dp2)

      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(50);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitters[0].gravity = y;
         }, _);
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(29);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
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
         slider.SetInitialValue(58);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
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
         slider.SetInitialValue(5);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
            const y = slider_val * VIEWPORT.WIDTH - emitters[0].dim[0];
            emitters[0].pos[0] = y;
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(29);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            const y = slider_val * VIEWPORT.HEIGHT - emitters[0].dim[1];
            emitters[0].pos[1] = y;
         }, _);
      }
      { // Set Emitter Y Direction Up
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction Y Up ');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(2);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
         slider.SetInitialValue(2);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
         slider.SetInitialValue(60);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitters[0].variation_emission.xdir_pos = y;
            emitters[0].variation_emission.xdir_neg = y;
         }, _);
         
      }

   }

   
   
   
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [4, 4], [VIEWPORT.RIGHT-280, 50, 0], [100, 100], CGREY, 'SidePanel', [0, 10, 1.8]);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

   section.AddItem(controls_dp);

   

   // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
   const text_mesh = controls_dp.children.buffer[0].text_mesh;
   text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;
   // const text_mesh2 = ctrl_dp_emitt3.children.buffer[0].text_mesh;
   // text_mesh2.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;


   // Render side panel
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   section.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   section.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, section.mesh_bufferidx);
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
   section.Calc_no_gfx_update();
   section.Render();
   Widget_root_activate_all_vbs_in_renderqueue(section.root_bufferidx);

  
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   
   View_build_group_from_root_mesh(section);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   
   
   
   
   
   
   
   
   /*************************************************************************************************************** */
   const s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10,10], [10,60,0], _, GREY[1], );
   s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


   const btn = Create_widget_button(_, 'Emitt', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 20, BLUEL[6], WHITE, [5, 5], .5);
   s.AddItem(btn);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idxs] }, )


   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // s.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX
   s.options = SECTION.VERTICAL|SECTION.RESIZE_PARENT
   s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   s.Calc_no_gfx_update();
   s.Render();
   Widget_root_activate_all_vbs_in_renderqueue(s.root_bufferidx);

   s.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, s.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(s);
   Construct_listen_events_relations_from_mesh_tree(s);




   // /***********************************************************************************************/
   // // Create Color Picker to change the particles color
   // const picker = CreateColorPicker(x, y);
   // picker.AssignTargetMeshClbk((params)=>{
   //     const color = params;
   //     // Gl_set_rgba(slider_section.gfx, color, slider_section.geom.num_faces);
   //     CopyArr4(emitters[0].col, color);
   // });
}














/**********************************************************************************************************************************************************/
/**********************************************************************************************************************************************************/
// DEMOS with side panel for the controls






function CreateSidePanel(root_widget = ROOT_WIDGETS.CREATE_ROOT, render_target = false, width=300) {

   const height = VIEWPORT.HEIGHT/2;
   const pad = 4;

   const section = Create_widget_section(root_widget, SECTION.HORIZONTAL, [pad, 2], [VIEWPORT.RIGHT - (width+250 - pad * 2+10), 0, 0], [width, height], GREY[1], 'SidePanel', [0, 1, 1.8]);
   // section.state.mask |= MESH_STATE.STICKY_POSX;


   const sbtn = Create_rect_mesh(_, [0, 0, 11], [8, height], TRANSPARENCY(Interpolate_rgb_to_01(2, 32, 60), 1.5), 'Btn', [0, 10, 1.8]);
   sbtn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   sbtn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   sbtn.EnableGfxAttributes(MESH_ENABLE.ATTR_STYLE);
   section.AddItem(sbtn)

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 4], [0, 0, 2], [0, 800], TRANSPARENCY(GREY[2], 1), 'InnerPanel', [0, 10, 1.8]);
   section.AddItem(s);

   const heading = Create_widget_label(_, 'Properties Panel', _, [0, 0, 4], _, GREY[1], BLUEL[9], [10, 4], _, [0, 8, 1.8]);
   s.AddItem(heading);


   if (render_target) {


      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX
      section.options = SECTION.HORIZONTAL|SECTION.EXPAND|SECTION.RESIZE_PARENTX
      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      section.Calc_no_gfx_update();
      section.Render();
      Widget_root_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(section);
      Construct_listen_events_relations_from_mesh_tree(section);

      View_build_group_from_root_mesh(section);


      // Create the panel button click evnt and animation 
      const params = {
         isOn: true,
      };
      sbtn.ChangeListenEvent(E.C,
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
function CreateSidePanelHorizontal(root_widget = ROOT_WIDGETS.CREATE_ROOT, render_target = false, height=300) {

   // const height = VIEWPORT.HEIGHT/2;
   const pad = 4;

   const section = Create_widget_section(root_widget, SECTION.VERTICAL, [pad, 2], [0, VIEWPORT.HEIGHT-height, 0], [VIEWPORT.WIDTH, height/2], GREY[1], 'SidePanel', [0, 1, 1.8]);
   // section.state.mask |= MESH_STATE.STICKY_POSX;


   // const sbtn = Create_rect_mesh(_, [0, 2, 11], [VIEWPORT.WIDTH/2, 8], TRANSPARENCY(Interpolate_rgb_to_01(2, 32, 60), 1.), 'Btn', [0, 10, 1.8]);
   const sbtn = Create_rect_mesh(_, [0, 2, 11], [VIEWPORT.WIDTH/2, 8], TRANSPARENCY(Interpolate_rgb_to_01(10, 72, 160), 1.), 'Btn', [0, 100, 1.8]);
   // sbtn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   sbtn.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   sbtn.EnableGfxAttributes(MESH_ENABLE.ATTR_STYLE);
   section.AddItem(sbtn)

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 4], [0, 20, 2], [0, 800], TRANSPARENCY(GREY[2], 1), 'InnerPanel', [0, 10, 1.8]);
   section.AddItem(s);

   const heading = Create_widget_label(_, 'Properties Panel', _, [0, 0, 4], _, GREY[1], BLUEL[9], [10, 4], _, [0, 8, 1.8]);
   s.AddItem(heading);

   // section.geom.pos[0] -= 200



   if (render_target) {


      section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // section.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX
      section.options = SECTION.VERTICAL|SECTION.EXPAND|SECTION.RESIZE_PARENTY
      section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      section.Calc_no_gfx_update();
      section.Render();
      // Widget_root_activate_all_vbs_in_renderqueue(section.root_bufferidx);

      section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

      Construct_listen_events_from_mesh_tree(section);
      Construct_listen_events_relations_from_mesh_tree(section);

      View_build_group_from_root_mesh(section);


      // // Create the panel button click evnt and animation 
      // const params = {
      //    isOn: true,
      // };
      // sbtn.ChangeListenEvent(E.C,
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



export function Demo_glow_particles_2(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, ) { // 3 control Sliders 

   /**
    * // TODO:
    * // BUG: The settings dealt from a callback update the emitter's parameters, but the particles 
    * themselves are not being updated until the destruction and recreation of a new particle
    */

   const scale_down = .2;

   const emitter_idx1 = Particle_system_create_emitter('T1st Particle System', BLUEL[9], [0, y, 10], [40, 40], .6, 1, 4, .98, .1, 4);
   const emitter = Particles_get_particle_system(emitter_idx1);
   emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;

   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW);
   emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
   emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   emitter.EnableGfxUniforms(0x0, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);


   emitter.SetConeOfDirection(1, 1, .2, -.2);






   let zpos = 1;
   const header_font_size = 9*DEVICE.device_scale;
   const regular_font_size = 8*DEVICE.device_scale;
   const trans = 1




   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles

   const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];

   const controls_dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Glow Particles Demo', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [10, 4], _, _, header_font_size, [0, 6, 2], [4, 4],);
   Dropdown_roots_set_root(controls_dp, controls_dp);


   // controls_dp.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   // controls_dp.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_dp.mesh_bufferidx)

   // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
   const text_mesh = controls_dp.children.buffer[0].text_mesh;
   text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;



   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }
   controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);






   /****************************************************************************************************************/
   // Create the switch to create/destroy colorpicker for particles color control

   // Style for the Section widgets.
   const section_pad = [0, 0];
   const clp_fontsize = regular_font_size;

   // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
   const label_style = [0, 6, 2];
   const label_pad = [6, 6];
   const label_col = TRANSPARENCY(BLUEL[1], 0);
   const label_text_col = WHITE;

   // Style for the switch widgets
   const switch_size = 19*DEVICE.device_scale;
   const switch_pad = 4;
   const switch_col = TRANSPARENCY(YELLOWL[1], 1);
   const switch_col2 = TRANSPARENCY(GREY[1], trans);
   const section_col = TRANSPARENCY(YELLOWL[5], 1.);




   { // Emitter switch and label

      const emitter_section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Emitter', label_style);
      emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
   
      const label = Create_widget_label(_, 'Emitter', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      emitter_section.AddItem(label);
   
      const emitter_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      emitter_switch.SetName('emitter_switch switch');
      emitter_section.AddItem(emitter_switch);
   
      emitter_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      const evt_params = { target_params: [emitter_idx1] };
      emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
      emitter_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   
      controls_dp.AddToMenu(emitter_section);
   }



   { // Color picker switch and label

      const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
   
      // Create label
      const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      color_picker.AddItem(label);
      color_picker.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      // Create switch
      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      colorpicker_switch.SetName('color_picker switch');
      color_picker.AddItem(colorpicker_switch);
   
      colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
               // How should this callback know about the colorpicker, so that it can destroy it???????
   
               // const colorpicker = CreateColorPicker(x, y, _, ROOT_WIDGETS.CREATE_ROOT,);


               const colorpicker_dim = [300, VIEWPORT.WIDTH/2-8];
               const colorpicker = Create_widget_color_picker(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [x, y*2-colorpicker_dim[1], 0], colorpicker_dim, [GREY[0], GREY[1], GREY[0], GREY[1]], _, [0, 35, 2]);
               colorpicker.sid.inst = 0x0;
               colorpicker.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
               
               colorpicker.ColorpickerCreateListeners();
               
               
               // TODO: The slider from colorpicker updates correctly but the glow particles chuuue and transparency do not update    
               colorpicker.SetTransparencySliderSetInitialValue(10)
               colorpicker.SetHueSliderSetInitialValue(80)
               
               colorpicker.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
               colorpicker.Calc_no_gfx_update();
               colorpicker.Render();
               Widget_root_activate_all_vbs_in_renderqueue(colorpicker.root_bufferidx);

               colorpicker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, colorpicker.gfx.vb.groupidx)
      
               Construct_listen_events_from_mesh_tree(colorpicker);
               Construct_listen_events_relations_from_mesh_tree(colorpicker);


               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;
   
                  CopyArr4(controls_dp.mat.col, color);
                  CopyArr4(controls_dp.mat.defCol, color);
                  Gl_set_rgba(controls_dp.gfx, color, controls_dp.geom.num_faces);
                  CopyArr4(emitter.col, color);
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
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





   TEMP_PARTICLES_GEN_GFX(emitter, controls_dp);
   emitter.GfxUniformsSetClbk('u_scale2', function () { return [scale_down, 1] }, emitter.gfx.vb.groupidx);





   /*************************************************************************************************************** */
   // Create Sliders for manipulating variables of particles
   {
      /** NICE EFFECT: Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22} */
      /** NICE EFFECT2: Distance:{.25}, Brighter:{1}, Intensity:{.61}, Intensity:{33}, Gravity:{.48}, Acceleration:{.59}, Decceleration:{19}, DirectionX:{64} 
       *    color:{R:.2, G:.0, B:.8, A:.68, }
      */

      // Contol Params for shader params
      const glow_controls_dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Shader Params', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
      glow_controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Distance');
         glow_controls_dp.AddToMenu(slider);
         slider.SetInitialValue(71);
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 0)
      }
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Brighter');
         glow_controls_dp.AddToMenu(slider);
         slider.SetInitialValue(62);
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 1)
      }
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Intensity');
         glow_controls_dp.AddToMenu(slider);
         slider.SetInitialValue(2);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 2)
         // Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 2)
      }

      controls_dp.AddToMenu(glow_controls_dp)


      // Contol Params for tarnsform and physics
      const glow_controls_dp2 = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Transform Params', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
      glow_controls_dp2.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Gravity');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(48);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
   
            // Linear Interpolation
            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitter.gravity = y;
         }, _);
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Acceleration');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(59);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            emitter.accel = slider_val;
   
            // Linear Interpolation
            const max = 15, start = 0;
            const y = (slider_val * max) + start;
            emitter.accel = y;
            emitter.max_speed = 4;
         }, _);
      }
      { // Deccelerarion
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Deccelerarion');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(19);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            /* Solve for y~={0.5, 1.0}  => {h:1, k:-2.0, r:1.2} */
            /* Solve for y~={0.9, 1.0}  => {h:1, k:-4.0, r:5.0} */
   
            /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            let y = 0;
            y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitter.deccel = y;
   
         }, _);
      }
      { // Set Emitter X Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Emitter Position X');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(0);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
            const y = slider_val * VIEWPORT.WIDTH;
            emitter.pos[0] = y;
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Emitter Position Y');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(35);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            const y = slider_val * VIEWPORT.HEIGHT;
            emitter.pos[1] = y;
            // Mesh_unif_set_vb_root_wposy(emitter.root_posidx, y);
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction Y Up ');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(10);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = -1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_neg = y;
            console.log(slider_val, y)
         }, _);
      }
      { // Set Emitter Y Direction Y Down
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction Y Down');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(10);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = 1, start = 0;
            const y = (slider_val * max) + start;
            emitter.variation_emission.ydir_pos = y;
            console.log(slider_val, y)
         }, _);
      }
      { // Set Emitter Direction X Left
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Direction X Left');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(55);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitter.variation_emission.xdir_pos = y;
            emitter.variation_emission.xdir_neg = y;
            console.log(slider_val, y)
         }, _);
      }

      controls_dp.AddToMenu(glow_controls_dp2)

   }


   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) { // Create slider controls only if this is to be rendered from this function




      controls_dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      // controls_dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);


      controls_dp.geom.pos[0] = x;
      controls_dp.geom.pos[1] = y;

      controls_dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
      controls_dp.Calc_no_gfx_update();

      controls_dp.Render();
      Widget_root_activate_all_vbs_in_renderqueue(controls_dp.root_bufferidx);


      Construct_listen_events_from_mesh_tree(controls_dp);
      Construct_listen_events_relations_from_mesh_tree(controls_dp);

      // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
      View_build_group_from_root_mesh(controls_dp)

      controls_dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_dp.gfx.vb.groupidx);

   }

   return controls_dp;

}



export function Demo_ball_tail() { // Side Panel 


   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // BallTail
   const balltail_section_xpos = 4;
   const balltail_section_ypos = 43;
   const tail_particles = CreateBallTailParticles(balltail_section_xpos, balltail_section_ypos, _, _, 1, 0x0);
   const tail_particles_buffer = tail_particles.tail_particles_buffer
   const glow_particles_buffer = tail_particles.glow_particles_buffer;



   let zpos = 1;
   const header_font_size = 9*DEVICE.device_scale;
   const regular_font_size = 8*DEVICE.device_scale;
   const trans = .8



   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles

   const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];
   const slider_section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, zpos], [0, 0], YELLOWL[6], 'SliderSection', [0, 10, 2],);
   // slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }

   slider_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   { // Create sliders and colorpicker

      zpos++;
      // Create Header
      // const controls_label = Create_widget_label(_, 'Ball Controls', _, [0,0,zpos], _, GREY[2]);
      // slider_section.AddItem(controls_label);

      const controls_label = Create_widget_label(_, 'Ball Tail Demo', _, [0, 0, 4], header_font_size, GREY[2], YELLOWL[9], [10, 6], _, [0, 8, 1.8]);
      slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      slider_section.AddItem(controls_label);

      // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
      const text_mesh = controls_label.text_mesh;
      text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW



      /****************************************************************************************************************/
      // Create the switch to create/destroy colorpicker for particles color control

      // Style for the Section widgets.
      const section_pad = [0, 0];
      const clp_fontsize = regular_font_size;

      // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
      const label_style = [8, 8, 2];
      const label_pad = [10, 6];
      const label_col = TRANSPARENCY(GREY[2], trans);
      const label_text_col = WHITE;

      // Style for the switch widgets
      const switch_size = 19*DEVICE.device_scale;
      const switch_pad = 4;
      const switch_col = TRANSPARENCY(GREY[2], trans);
      const switch_col2 = TRANSPARENCY(GREY[2], trans);
      const section_col = TRANSPARENCY(YELLOWL[5], .0);


      const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      // color_picker.options = SECTION.HORIZONTAL | SECTION.EXPAND | SECTION.TOP_DOWN;
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

      const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      color_picker.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      colorpicker_switch.SetName('color_picker switch');
      color_picker.AddItem(colorpicker_switch);

      colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      const x = 0, y = 0
      colorpicker_switch.Bind(
         (params) => {

            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
             */
            const switch_mesh = params.target_mesh;
            const tail_particles_buffer = params.params.tail_particles_buffer;
            const glow_particles_buffer = params.params.glow_particles_buffer;
            const isOn = switch_mesh.isOn;


            if (isOn) {
               // How should this callback know about the colorpicker, so that it can destroy it???????

               const colorpicker = CreateColorPicker(x, y + tail_particles.section.geom.dim[1] * 2, _, ROOT_WIDGETS.CREATE_ROOT);
               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;

                  // Gl_set_rgba(slider_section.gfx, color, slider_section.geom.num_faces);
                  CopyArr4(tail_particles_buffer[0].col, color);
                  CopyArr4(glow_particles_buffer[0].col, color);
                  // For control of all ball's tail particles
                  // for(let i=0; i<num_balls; i++){
                  //     CopyArr4(tail_particles_buffer[i].col, color);
                  //     CopyArr4(glow_particles_buffer[i].col, color);
                  // }
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {

               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null,
         {
            tail_particles_buffer: tail_particles_buffer,
            glow_particles_buffer: glow_particles_buffer,
         },
      );

      slider_section.AddItem(color_picker);






      /****************************************************************************************************************/
      // Tail Particle System: Control Sliders 
      const tail_buffer_len = tail_particles_buffer.length;
      {

         // const glow_emitter = tail_particles_buffer[i]

         { // Slider 1 contol
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Speed');
            // slider.temp_align |= SECTION.VERTICAL;
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);


            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


            Slider_connect(slider, (params, slider_val) => {

               for (let i = 0; i < tail_buffer_len; i++) {

                  const glow_emitter = tail_particles_buffer[i]
                  let min = .8; // The min value gives the prolonged glow_emitter
                  let max = 1.; // Calculate that the max value will be +1+min
                  const rev_slider_val = 1 - slider_val;
                  glow_emitter.t_step = rev_slider_val + min + ((max - slider_val) * (rev_slider_val));
                  glow_emitter.speed = (slider_val + 1) * 3;
               }
            }, _);

         }
         { // Slider 2 contol: Uniform value in fragment shader
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Intensity');
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 1)
            }

         }
         { // Slider 3 contol: Uniform value in fragment shader
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Fire Variation');
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 0)
            }
         }
         { // Slider 4 contol: Uniform value in fragment shader
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Noise Complexity');
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 2)
            }
         }
      }

      // Glow Particle System: Control Sliders 
      const glow_buffer_len = glow_particles_buffer.length;
      for (let i = 0; i < glow_buffer_len; i++) {

         const glow_emitter = glow_particles_buffer[i]
         /**
          * NICE EFFECT:
          * Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22}
          */

         {
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Distance');
            slider_section.AddItem(slider);
            slider.SetInitialValue(0);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 0)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Brighter');
            slider_section.AddItem(slider);
            slider.SetInitialValue(100);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 1)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, _, _, 'Intensity');
            slider_section.AddItem(slider);
            slider.SetInitialValue(3);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 2)
         }
      }


   }






   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Side panel
   const side_panel = CreateSidePanel(ROOT_WIDGETS.CREATE_ROOT);


   // Create the panel for holding all controls
   const controls_panel = Create_widget_section(_, SECTION.VERTICAL, [4, 4], [0, 0, 0], [0, 0], TRANSPARENCY(PURPLEB[5], 1), 'SidePanel', [0, 10, 1.8]);
   side_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
   controls_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


   controls_panel.AddItem(slider_section)
   const inner_section = side_panel.children.buffer[1];


   // Create scroller for the ui-mesh info widget
   const scroller_width = 10;
   const scroller = Create_widget_scroller(_, controls_panel, [scroller_width, 160], _, [4, 4]);
   inner_section.AddItem(scroller);
   scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.RESIZE_PARENTX;
   scroller.scrolled_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;





   side_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   side_panel.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX

   side_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
   side_panel.Recalc_no_gfx_update();
   side_panel.Render();
   Widget_root_activate_all_vbs_in_renderqueue(side_panel.root_bufferidx);

   side_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, side_panel.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(side_panel);
   Construct_listen_events_relations_from_mesh_tree(side_panel);

   View_build_group_from_root_mesh(side_panel);


   const sbtn = side_panel.children.buffer[0];


   const params = {
      isOn: true,
      section_pad: side_panel.StylesGetPad(),
   };
   sbtn.ChangeListenEvent(E.C,
      (params) => {


         const section = params.evt_params.section;
         const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
         const isOn = params.evt_params.rest_params.isOn;
         const section_pad = params.evt_params.rest_params.section_pad;
         const reduce_val = section.geom.dim[0] * 2 / 10;

         if (isOn) { // Close Panel

            Callback_animations_create( // Close Panel
               (params) => { // Run Animation

                  let reduce_val = params.reduce_val;
                  const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);

                  if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - section_pad[0] * 2) {

                     const section = params.section;
                     Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

                     if (params.reduce_val > 5) params.reduce_val *= .9
                     // console.log('reduce_val', reduce_val, unif_wpos)

                     return true;
                  }

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
                  if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2) {

                     const section = params.section;
                     Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

                     if (params.reduce_val > 5) params.reduce_val *= .9
                     // console.log('reduce_val', reduce_val, unif_wpos)

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
      , { section: side_panel, rest_params: params },
   );


}



export function Demo_smoke_2(root_widget = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, ) { // 3 control Sliders 

   /**
    * // TODO:
    * // BUG: The settings dealt from a callback update the emitter's parameters, but the particles 
    * themselves are not being updated until the destruction and recreation of a new particle
    */

   const scale_down = 1.;
   const emitters = [];
   const emitter_idxs = [];
   const speed = 10;
   let cnt = 0;
   const dim = [150*DEVICE.device_scale, 150*DEVICE.device_scale];

   let particles_vb_groupidx = INT_NULL;


   // Create Particle emitters
   { // Emitter 1
      // const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', TRANSPARENCY(ORANGE[9], .0), [-dim[0], VIEWPORT.HEIGHT-dim[1], 0], dim, 1.5, 1, 2, .98, -.1, 3);
      const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', TRANSPARENCY(ORANGE[9], .0), [0, 0, 0], dim, 1.5, 1, 2, .98, -.1, 3);
      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;
      
      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxUniforms({ fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

      particles_vb_groupidx = TEMP_PARTICLES_GEN_GFX(emitter);
      // emitter.GfxUniformsSetClbk('u_scale2', function () { return [scale_down, 1.] }, emitter.gfx.vb.groupidx);

      emitter.pos[0] = -dim[0]; 
      emitter.pos[1] = VIEWPORT.HEIGHT-dim[1]; 

      emitter.SetConeOfDirection(.25, .25, -.1, -.2);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++

   }
   { // Emitter 2
      // const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', TRANSPARENCY(ORANGE[9], .0), [VIEWPORT.WIDTH-dim[0], -dim[1], 0], dim, 1.5, 1, 2, .98, -.1, 3);
      const emitter_idx = Particle_system_create_emitter('SmokeParticles 2', TRANSPARENCY(ORANGE[9], .0), [0, 0, 0], dim, 1.5, 1, 2, .98, -.1, 3);
      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;

      
      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxUniforms({ fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      
      TEMP_PARTICLES_GEN_GFX(emitter, _, particles_vb_groupidx);

      emitter.pos[0] = VIEWPORT.WIDTH-dim[0]; 
      emitter.pos[1] = -dim[1]; 
         
      emitter.SetConeOfDirection(-.25, -.25, .2, .1);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++
   }





   let zpos = 1;
   // const header_font_size = 9*DEVICE.device_scale;
   // const regular_font_size = 8*DEVICE.device_scale;
   const header_font_size = 9;
   const regular_font_size = 8;
   const trans = 1;
   const trans2 = .3;




   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles

   const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];

   // const controls_dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Smoke Particles Demo', [0, 0+40, zpos], YELLOWL[6], GREY[1], WHITE, [10, 4], _, _, header_font_size, [0, 6, 2], [4, 4],);
   // Dropdown_roots_set_root(controls_dp, controls_dp);


   // // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
   // const text_mesh = controls_dp.children.buffer[0].text_mesh;
   // text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;



   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }
   // controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);






   /****************************************************************************************************************/
   // Create the switch to create/destroy colorpicker for particles color control

   // Style for the Section widgets.
   const section_pad = [0, 0];
   const clp_fontsize = regular_font_size;

   // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
   const label_style = [0, 6, 2];
   const label_pad = [6, 6];
   const label_col = TRANSPARENCY(BLUEL[1], 0);
   const label_text_col = WHITE;
   
   
   const slider_col = TRANSPARENCY(GREY[5], .1);
   const slider_text_col = WHITE;
   
   // Style for the switch widgets
   const C1 = TRANSPARENCY(BLACK, trans2);
   const CGREY = TRANSPARENCY(GREY[0], trans2);
   const switch_size = 19*DEVICE.device_scale;
   const switch_pad = 4;
   const switch_col = TRANSPARENCY(GREY[8], .1);
   const section_col = C1;
   const switch_col2 = TRANSPARENCY(GREY[1], trans2);



   

   
   










   
   /*************************************************************************************************************************************************/
   /*************************************************************************************************************************************************/
   // Emitter 1-2 controls

      
   const ctrl_dp_emitt12 = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Emitters 1-2', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
   ctrl_dp_emitt12.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // controls_dp.AddToMenu(ctrl_dp_emitt12);


   /******************************************************************************************************************************************************************************/
   // Emitter activation switch
   { // Emitter 1-2 switch and label

      const emitter_section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Activate', label_style);
      emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
   
      const label = Create_widget_label(_, 'Emitter', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      emitter_section.AddItem(label);
   
      const emitter_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      emitter_switch.SetName('emitter_switch switch');
      emitter_section.AddItem(emitter_switch);
   
      emitter_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      const evt_params = { target_params: [emitter_idxs[0], emitter_idxs[1]] };
      emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
      emitter_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   
      ctrl_dp_emitt12.AddToMenu(emitter_section);
   }





   /******************************************************************************************************************************************************************************/
   // Emitter Colorpicker

   { // Color picker switch and label

      const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
      ctrl_dp_emitt12.AddToMenu(color_picker);
   
      // Create label
      const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      color_picker.AddItem(label);
      color_picker.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      // Create switch
      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      colorpicker_switch.SetName('color_picker switch');
      color_picker.AddItem(colorpicker_switch);
   
      colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
               // How should this callback know about the colorpicker, so that it can destroy it???????
   
               const colorpicker = Create_widget_color_picker(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [x, y+40, 0], [300, 200], [GREY[0], GREY[1], GREY[0], GREY[1]], _, [0, 35, 2]);
               colorpicker.sid.inst = 0x0;
               colorpicker.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
               
               colorpicker.ColorpickerCreateListeners();
               
               
               // TODO: The slider from colorpicker updates correctly but the glow particles chuuue and transparency do not update    
               colorpicker.SetTransparencySliderSetInitialValue(10)
               colorpicker.SetHueSliderSetInitialValue(80)
               
               colorpicker.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
               colorpicker.Calc_no_gfx_update();
               colorpicker.Render();
               Widget_root_activate_all_vbs_in_renderqueue(colorpicker.root_bufferidx);

               colorpicker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, colorpicker.gfx.vb.groupidx)
      
               Construct_listen_events_from_mesh_tree(colorpicker);
               Construct_listen_events_relations_from_mesh_tree(colorpicker);


               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;
   
                  // Add color to controls dropdown
                  CopyArr4(ctrl_dp_emitt12.mat.col, color);
                  CopyArr4(ctrl_dp_emitt12.mat.defCol, color);
                  Gl_set_rgba(ctrl_dp_emitt12.gfx, color, ctrl_dp_emitt12.geom.num_faces);
                  CopyArr4(emitters[0].col, color);
                  CopyArr4(emitters[1].col, color);
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {
   
               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, null,
      );
   
   }



   /*************************************************************************************************************** */
   // Create Sliders for manipulating variables of particles
   {
      /** NICE EFFECT: Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22} */
      /** NICE EFFECT2: Distance:{.25}, Brighter:{1}, Intensity:{.61}, Intensity:{33}, Gravity:{.48}, Acceleration:{.59}, Decceleration:{19}, DirectionX:{64} 
       *    color:{R:.2, G:.0, B:.8, A:.68, }
      */

      { // Contol Params for shader params

         const glow_controls_dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Shader Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
         glow_controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ctrl_dp_emitt12.AddToMenu(glow_controls_dp);

         {
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Scale');
            glow_controls_dp.AddToMenu(slider);
            slider.SetInitialValue(71);
      
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
            Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_scale2', Slider_get_slider_val, slider, 0);
            // Particles_gfx_uniforms_set_clbk(emitter_idxs[1], 'u_scale2', Slider_get_slider_val, slider, 0);
   
            // TODO: Implement the resizing of the emitter. Needs to run by the ONE callback we set for updating the u_scale2. How to do it????
            // Change the dimention of the particle mesh
            // emitters[0].dim[0] = dim[0] * 
         }
         {
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Noise UV Coord');
            glow_controls_dp.AddToMenu(slider);
            slider.SetInitialValue(71);
      
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
            Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 0)
            // Particles_gfx_uniforms_set_clbk(emitter_idxs[1], 'u_smoke_params', Slider_get_slider_val, slider, 0)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Cone Wideness');
            glow_controls_dp.AddToMenu(slider);
            slider.SetInitialValue(78);
      
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
            Particles_gfx_uniforms_set_clbk(emitter_idxs[0], 'u_smoke_params', Slider_get_slider_val, slider, 1)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Complexity');
            glow_controls_dp.AddToMenu(slider);
            slider.SetInitialValue(50);
      
      
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
            Particles_gfx_uniforms_set_clbk(emitter_idxs[1], 'u_smoke_params', Slider_get_slider_val, slider, 2)
         }
   
      }


      { // Contol Params for tarnsform and physics

         const glow_controls_dp2 = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Transform Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
         glow_controls_dp2.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ctrl_dp_emitt12.AddToMenu(glow_controls_dp2);
         
         { // Gravity
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
            glow_controls_dp2.AddToMenu(slider);
            slider.SetInitialValue(50);
      
      
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
            Slider_connect(slider, (params, slider_val) => {
      
               // const slider_val = Slider_get_slider_val({slider:slider});
      
               // Linear Interpolation
               const max = 1, start = -.5;
               const y = (slider_val * max) + start;
               emitters[0].gravity = y;
               emitters[1].gravity = y;
            }, _);
         }
         { // Acceleration
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
            glow_controls_dp2.AddToMenu(slider);
            slider.SetInitialValue(58);
      
      
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
            Slider_connect(slider, (params, slider_val) => {
      
               // const slider_val = Slider_get_slider_val({slider:slider});
               emitters[0].accel = slider_val;
      
               // Linear Interpolation
               const max = 15, start = 0;
               const y = (slider_val * max) + start;
               emitters[0].accel = y;
               emitters[0].max_speed = 4;
               emitters[1].accel = y;
               emitters[1].max_speed = 4;
            }, _);
         }
         { // Deccelerarion
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Deccelerarion');
            glow_controls_dp2.AddToMenu(slider);
            slider.SetInitialValue(48);
      
      
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
            Slider_connect(slider, (params, slider_val) => {
      
               // const slider_val = Slider_get_slider_val({slider:slider});
               /* Solve for y~={0.5, 1.0}  => {h:1, k:-2.0, r:1.2} */
               /* Solve for y~={0.9, 1.0}  => {h:1, k:-4.0, r:5.0} */
      
               /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
               const h = 1, k = -2.8, r = 3.8 * 3.8;
               const x = slider_val;
               let y = 0;
               y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
               emitters[0].deccel = y;
               emitters[1].deccel = y;
      
            }, _);
         }
         { // Set Emitter X Position
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position X');
            glow_controls_dp2.AddToMenu(slider);
            slider.SetInitialValue(0);
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            Slider_connect(slider, (params, slider_val) => {
               const y = slider_val * VIEWPORT.WIDTH;
               // emitters[0].pos[0] = y;
               // emitters[1].pos[0] = -y;
            }, _);
         }
         { // Set Emitter Y Position
            const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
            glow_controls_dp2.AddToMenu(slider);
            slider.SetInitialValue(0);
            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            Slider_connect(slider, (params, slider_val) => {
      
               // const slider_val = Slider_get_slider_val({slider:slider});
               const y = slider_val * VIEWPORT.HEIGHT;
               // emitters[0].pos[1] = -y;
               // emitters[1].pos[1] = y;
            }, _);
         }

      }

      
   }
   












   /*************************************************************************************************************************************************/
   /*************************************************************************************************************************************************/
   // Emitter 3 

   
   { // Emitter 3
      // const emitter_idx = Particle_system_create_emitter('SmokeParticles 1', PURPLEB[9], [VIEWPORT.WIDTH/2-dim[0], VIEWPORT.HEIGHT/2-dim[1], 0], dim, 1.5, 1, 2, .98, -.1, 3);
      const emitter_idx = Particle_system_create_emitter('SmokeParticles 3', TRANSPARENCY(BLUEL[9], .0), [0, 0, 0], dim, 1.5, 1, 2, .98, -.1, 3);
      const emitter = Particles_get_particle_system(emitter_idx);
      emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
      emitter.speed = speed;

      
      emitter.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME);
      emitter.EnableGfxUniforms({ fx: SID.FX.FS_SMOKE }, 'u_smoke_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      emitter.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      
      TEMP_PARTICLES_GEN_GFX(emitter, _, particles_vb_groupidx);

         
      emitter.SetConeOfDirection(.2, .2, .1, .1);

      emitters[cnt] = emitter;
      emitter_idxs[cnt] = emitter_idx;
      cnt++
   }





   /*************************************************************************************************************************************************/
   // Emitter 3 controls

      
   const ctrl_dp_emitt3 = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Emitter 3', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
   ctrl_dp_emitt3.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // controls_dp.AddToMenu(ctrl_dp_emitt3);

   { // Emitter 3 switch and label


      const emitter_section = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Emitter 3', label_style);
      emitter_section.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
   
      const label = Create_widget_label(_, 'Emitter 3', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      emitter_section.AddItem(label);
   
      const emitter_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      emitter_switch.SetName('emitter_switch switch 3');
      emitter_section.AddItem(emitter_switch);
   
      emitter_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      const evt_params = { target_params: [emitter_idxs[2]] };
      emitter_switch.Bind(Switch_simple_time_interval_callback, Particle_system_emitt, evt_params);
      emitter_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   
      ctrl_dp_emitt3.AddToMenu(emitter_section);
   }

   
   { // Color picker switch and label

      zpos = -1
      const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;
   
      // Create label
      const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      color_picker.AddItem(label);
      color_picker.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      // Create switch
      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      colorpicker_switch.SetName('color_picker switch');
      color_picker.AddItem(colorpicker_switch);
   
      colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
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
               // How should this callback know about the colorpicker, so that it can destroy it???????
   
               // const colorpicker = CreateColorPicker(x, y, _, ROOT_WIDGETS.CREATE_ROOT,);


               const colorpicker = Create_widget_color_picker(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [emitters[2].pos[0], emitters[2].pos[1]+50, 0], [300, 200], [GREY[0], GREY[1], GREY[0], GREY[1]], _, [0, 35, 2]);
               colorpicker.sid.inst = 0x0;
               colorpicker.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
               
               colorpicker.ColorpickerCreateListeners();
               
               
               // TODO: The slider from colorpicker updates correctly but the glow particles chuuue and transparency do not update    
               colorpicker.SetTransparencySliderSetInitialValue(10)
               colorpicker.SetHueSliderSetInitialValue(80)
               
               colorpicker.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
               colorpicker.Calc_no_gfx_update();
               colorpicker.Render();
               Widget_root_activate_all_vbs_in_renderqueue(colorpicker.root_bufferidx);

               colorpicker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, colorpicker.gfx.vb.groupidx);

               Renderqueue_set_priority_by_vb(FIRST, colorpicker.gfx.vb.groupidx);
      
               Construct_listen_events_from_mesh_tree(colorpicker);
               Construct_listen_events_relations_from_mesh_tree(colorpicker);


               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;
   
                  // Add color to controls dropdown
                  // CopyArr4(controls_dp.mat.col, color);
                  // CopyArr4(controls_dp.mat.defCol, color);
                  // Gl_set_rgba(controls_dp.gfx, color, controls_dp.geom.num_faces);
                  CopyArr4(emitters[2].col, color);
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {
   
               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null, null,
      );
   
      ctrl_dp_emitt3.AddToMenu(color_picker);
   }

   { // Contol Params for shader params

      const glow_controls_dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Shader Params', [0, 0, zpos], YELLOW[6], CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
      glow_controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Scale');
         glow_controls_dp.AddToMenu(slider);
         slider.SetInitialValue(71);
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idxs[2], 'u_scale2', Slider_get_slider_val, slider, 0);

         // TODO: Implement the resizing of the emitter. Needs to run by the ONE callback we set for updating the u_scale2. How to do it????
         // Change the dimention of the particle mesh
      }
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Noise UV Coord');
         glow_controls_dp.AddToMenu(slider);
         slider.SetInitialValue(71);
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idxs[2], 'u_smoke_params', Slider_get_slider_val, slider, 0)
      }
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Cone Wideness');
         glow_controls_dp.AddToMenu(slider);
         slider.SetInitialValue(78);
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idxs[2], 'u_smoke_params', Slider_get_slider_val, slider, 1)
      }
      {
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Complexity');
         glow_controls_dp.AddToMenu(slider);
         slider.SetInitialValue(50);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Particles_gfx_uniforms_set_clbk(emitter_idxs[2], 'u_smoke_params', Slider_get_slider_val, slider, 2)
      }

      ctrl_dp_emitt3.AddToMenu(glow_controls_dp)
   }


   { // Contol Params for tarnsform and physics

      const glow_controls_dp2 = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'Transform Params', [0, 0, zpos], C1, CGREY, WHITE, [10, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
      glow_controls_dp2.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ctrl_dp_emitt3.AddToMenu(glow_controls_dp2)

      { // Gravity
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Gravity');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(50);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
   
            // Linear Interpolation
            const max = 1, start = -.5;
            const y = (slider_val * max) + start;
            emitters[2].gravity = y;
         }, _);
      }
      { // Acceleration
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Acceleration');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(82);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            emitters[2].accel = slider_val;
   
            // Linear Interpolation
            const max = 15, start = 0;
            const y = (slider_val * max) + start;
            emitters[2].accel = y;
            emitters[2].max_speed = 4;
         }, _);
      }
      { // Deccelerarion
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Deccelerarion');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(35);
   
   
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            /* Solve for y~={0.5, 1.0}  => {h:1, k:-2.0, r:1.2} */
            /* Solve for y~={0.9, 1.0}  => {h:1, k:-4.0, r:5.0} */
   
            /* Solve for y~={0.86, 1.0} => {h:1, k:-2.8, r:3.8} */
            const h = 1, k = -2.8, r = 3.8 * 3.8;
            const x = slider_val;
            let y = 0;
            y = Math.sqrt(-((x - h) * (x - h)) + r) + k;
            emitters[2].deccel = y;
   
         }, _);
      }
      { // Set Emitter X Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position X');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(0);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
            const y = slider_val * VIEWPORT.WIDTH - emitters[2].dim[0];
            emitters[2].pos[0] = y;
         }, _);
      }
      { // Set Emitter Y Position
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Emitter Position Y');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(60);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            const y = slider_val * VIEWPORT.HEIGHT - emitters[2].dim[1];
            emitters[2].pos[1] = y;
         }, _);
      }
      { // Set Emitter Y Direction Up
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction Y Up ');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(12);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = -1, start = 0;
            const y = (slider_val * max) + start;
            emitters[2].variation_emission.ydir_neg = y;
         }, _);
      }
      { // Set Emitter Y Direction Down
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction Y Down');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(0);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            const max = 1, start = 0;
            const y = (slider_val * max) + start;
            emitters[2].variation_emission.ydir_pos = y;
         }, _);
      }
      { // Set Emitter Direction X Left
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, slider_col, _, 'Direction X Left');
         glow_controls_dp2.AddToMenu(slider);
         slider.SetInitialValue(60);
         slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         Slider_connect(slider, (params, slider_val) => {
   
            // const slider_val = Slider_get_slider_val({slider:slider});
            let max = 2, start = -1;
            const y = (slider_val * max) + start;
            emitters[2].variation_emission.xdir_pos = y;
            emitters[2].variation_emission.xdir_neg = y;
         }, _);
         
      }

   }


   


   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Side panel

   // const side_panel = CreateSidePanel(ROOT_WIDGETS.CREATE_ROOT);
   const side_panel = CreateSidePanelHorizontal(ROOT_WIDGETS.CREATE_ROOT, _, VIEWPORT.HEIGHT/2);
   side_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)


   const s = Create_widget_section(_, SECTION.VERTICAL, [4, 4], [0, 0, 0], [100, 100], CGREY, 'SidePanel', [0, 10, 1.8]);
   s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   s.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

   s.AddItem(ctrl_dp_emitt12);
   s.AddItem(ctrl_dp_emitt3);

   

   // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
   const text_mesh = ctrl_dp_emitt12.children.buffer[0].text_mesh;
   text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;
   const text_mesh2 = ctrl_dp_emitt3.children.buffer[0].text_mesh;
   text_mesh2.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;


   // Get the inner panel of the side panel, to add the section with all scrollers of controls
   // const inner_section = side_panel.children.buffer[1];
   // inner_section.AddItem(s);
   side_panel.AddItem(s)


   // Render side panel
   side_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // side_panel.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX

   // side_panel.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   side_panel.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
   side_panel.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   side_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, side_panel.mesh_bufferidx);
   side_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
   // side_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   side_panel.Calc_no_gfx_update();

   // side_panel.MoveNoGfxUpdate(VIEWPORT.WIDTH - side_panel.geom.dim[0]*2)
   // side_panel.SetPosXNoGfxUpdate(VIEWPORT.WIDTH - side_panel.geom.dim[0]*2)

   side_panel.Render();
   Widget_root_activate_all_vbs_in_renderqueue(side_panel.root_bufferidx);

  
   Construct_listen_events_from_mesh_tree(side_panel);
   Construct_listen_events_relations_from_mesh_tree(side_panel);
   
   View_build_group_from_root_mesh(side_panel);

   side_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, side_panel.gfx.vb.groupidx);

   console.log(s.geom.pos[1], s.GetPosY())

   // Add scroller
   const scroller_component = Components_create_scroller_component(_, side_panel.geom.dim[1], s, side_panel.GetPosY(), TRANSPARENCY(GREY[0], .4), TRANSPARENCY(GREY[8], .2));
   
   
   const sbtn = side_panel.children.buffer[0];
   
   const sbtn_col = Interpolate_rgb_to_01(10, 72, 160);
   const time_ratio = sbtn_col[1] / sbtn_col[2]
   const step=.006, min=0.3, start_val=.0, has_start_val=false; 
   { // Animate Blue
      
      const max=sbtn_col[2]; 
      // sbtn.mat.col[0] = 0; 
      Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, sbtn, step, min, max, _, start_val, has_start_val)
   }
   { // Animate Green

      const max=sbtn_col[1]; 
      // sbtn.mat.col[0] = 0; 
      Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, sbtn, step*time_ratio, min*time_ratio, max, _, start_val, has_start_val)
   }
   // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, sbtn, step, min, max, _, start_val, has_start_val)

   const properties_label = side_panel.children.buffer[1];
   
   // Correct scroller to end at the viewport height
   scroller_component.geom.dim[1] -= sbtn.geom.dim[1]*2 + properties_label.geom.dim[1]*2;
   scroller_component.children.buffer[0].geom.dim[1] -= sbtn.geom.dim[1]*2 + properties_label.geom.dim[1]*2;
   scroller_component.geom.pos[1] += sbtn.geom.dim[1]*2 + properties_label.geom.dim[1]*2;
   scroller_component.children.buffer[0].geom.pos[1] -= sbtn.geom.dim[1]*2 + properties_label.geom.dim[1]*2;
   Scoller_component_gengfx_and_render(scroller_component, s, GFX_CTX_FLAGS.ABSOLUTE_POSITION);
   Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(s.root_posidx , scroller_component.root_posidx);
   Listeners_set_priority(E.C, scroller_component.listeners)


   const params = {
      isOn: true,
      section_pad: side_panel.StylesGetPad(),
      scroller_component:scroller_component,
   };
   sbtn.ChangeListenEvent(E.C,
      (params) => {


         const section = params.evt_params.section;
         const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
         const isOn = params.evt_params.rest_params.isOn;
         const section_pad = params.evt_params.rest_params.section_pad;
         const scroller_component = params.evt_params.rest_params.scroller_component;
         const reduce_val = section.geom.dim[1] * 2 / 10;

         if (isOn) { // Close Panel

            Callback_animations_create( // Close Panel
               (params) => { // Run Animation

                  let reduce_val = params.reduce_val;
                  const unif_wpos = Mesh_unif_get_vb_root_wposy(section.root_posidx);
                  if (unif_wpos + reduce_val < VIEWPORT.HEIGHT - btn.geom.dim[1] * 2 - section_pad[0] * 2) {

                     const section = params.section;
                     Mesh_unif_add_vb_root_wposy(section.root_posidx, reduce_val);

                     // Move scrollbar
                     scroller_component.geom.pos[1] += reduce_val;
                     scroller_component.geom.AddWposY(scroller_component.gfx, reduce_val);
                     const handle = scroller_component.children.buffer[0];
                     handle.geom.pos[1] += reduce_val;
                     handle.geom.AddWposY(handle.gfx, reduce_val);

                     if (params.reduce_val > 5) params.reduce_val *= .9
                     // console.log('reduce_val', reduce_val, unif_wpos)


                     return true;
                  }

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
                  const unif_wpos = Mesh_unif_get_vb_root_wposy(section.root_posidx);
                  if (unif_wpos > VIEWPORT.HEIGHT - section.geom.dim[1] * 2) {

                     const section = params.section;
                     Mesh_unif_add_vb_root_wposy(section.root_posidx, -reduce_val);
                     
                     // Move scrollbar
                     scroller_component.geom.pos[1] -= reduce_val;
                     scroller_component.geom.AddWposY(scroller_component.gfx, -reduce_val);
                     const handle = scroller_component.children.buffer[0];
                     handle.geom.pos[1] -= reduce_val;
                     handle.geom.AddWposY(handle.gfx, -reduce_val);

                     if (params.reduce_val > 5) params.reduce_val *= .9
                     // console.log('reduce_val', reduce_val, unif_wpos)

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
      , { section: side_panel, rest_params: params },
   );

   /**SAVE-VERTICAL PANEL BUTTON */
   // sbtn.ChangeListenEvent(E.C,
   //    (params) => {


   //       const section = params.evt_params.section;
   //       const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
   //       const isOn = params.evt_params.rest_params.isOn;
   //       const section_pad = params.evt_params.rest_params.section_pad;
   //       const reduce_val = section.geom.dim[0] * 2 / 10;

   //       if (isOn) { // Close Panel

   //          Callback_animations_create( // Close Panel
   //             (params) => { // Run Animation

   //                let reduce_val = params.reduce_val;
   //                const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);

   //                if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - section_pad[0] * 2) {

   //                   const section = params.section;
   //                   Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

   //                   if (params.reduce_val > 5) params.reduce_val *= .9
   //                   // console.log('reduce_val', reduce_val, unif_wpos)

   //                   return true;
   //                }

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
   //                if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2) {

   //                   const section = params.section;
   //                   Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

   //                   if (params.reduce_val > 5) params.reduce_val *= .9
   //                   // console.log('reduce_val', reduce_val, unif_wpos)

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
   //    , { section: side_panel, rest_params: params },
   // );


   // return controls_dp;

}



export function Demo_ball_tail_2(root_widget = ROOT_WIDGETS.CREATE_ROOT, width, height) { // Side Panel 
   

   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // BallTail
   const balltail_section_xpos = 4;
   const balltail_section_ypos = 43;
   const tail_particles = CreateBallTailParticles(balltail_section_xpos, balltail_section_ypos, width, height, 1, 0x0);
   const tail_particles_buffer = tail_particles.tail_particles_buffer
   const glow_particles_buffer = tail_particles.glow_particles_buffer;



   let zpos = 1;
   const header_font_size = 9*DEVICE.device_scale;
   const regular_font_size = 8*DEVICE.device_scale;
   const trans = 1


   
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of particles

   const controls_dp = Create_widget_dropdown(_, 'Ball Tail Demo', [0, 0, zpos], TRANSPARENCY(BLACK, .2), GREY[1], WHITE, [10, 4], _, _, header_font_size, [0, 6, 2], [4, 4],);
   Dropdown_roots_set_root(controls_dp, controls_dp);
   // controls_dp.SetName('controls_dp');



   // HACK: Set all text meshes of the scrolled_section to be rendered to a new VB
   const text_mesh = controls_dp.children.buffer[0].text_mesh;
   text_mesh.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;
   controls_dp.gfx_ctx_flags = GFX_CTX_FLAGS.NEW;

   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   }

   controls_dp.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


   { // Create sliders and colorpicker

      zpos++;


      /****************************************************************************************************************/
      // Create the switch to create/destroy colorpicker for particles color control

      // Style for the Section widgets.
      const section_pad = [0, 0];
      const clp_fontsize = regular_font_size;

      // Style for the label widgets: [BORDER, ROUND_CORNERS, FEATHER]
      const label_style = [0, 6, 2];
      const label_pad = [6, 6];
      const label_col = TRANSPARENCY(BLUEL[1], 0);
      const label_text_col = WHITE;

      // Style for the switch widgets
      const switch_size = 19*DEVICE.device_scale;
      const switch_pad = 4;
      const switch_col = TRANSPARENCY(YELLOWL[1], 1);
      const switch_col2 = TRANSPARENCY(GREY[1], trans);
      const section_col = TRANSPARENCY(YELLOWL[5], 1.);



      

      const color_picker = Create_widget_section(_, SECTION.HORIZONTAL, section_pad, [0, 0, zpos + 1], [0, 0], section_col, 'Color Picker', label_style);
      // color_picker.options = SECTION.HORIZONTAL | SECTION.EXPAND | SECTION.TOP_DOWN;
      color_picker.options = SECTION.HORIZONTAL | SECTION.TOP_DOWN;

      const label = Create_widget_label(_, 'Color Picker', (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), [0, 0, zpos + 2], clp_fontsize, label_col, label_text_col, label_pad, _, label_style, _, _);
      color_picker.AddItem(label);

      const colorpicker_switch = Create_widget_switch_simple(_, [0, 0, zpos + 2], switch_size, switch_col, switch_col2, switch_pad, _, [6, 14, 2]);
      colorpicker_switch.SetName('color_picker switch');
      color_picker.AddItem(colorpicker_switch);

      colorpicker_switch.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      const x = 0, y = 0
      colorpicker_switch.Bind(
         (params) => {

            /**
             * // TODO: Why we use the 'evt_params.EventClbk' in the .Bind() function instead of the 'eventCallbacks' of the switch widget??????
             * Explanation:
             * This is the callback function that the switch is calling upon switch.OnClick via the 'switch.evt_params.EventClbk()'.
             * 
             */
            const switch_mesh = params.target_mesh;
            const tail_particles_buffer = params.params.tail_particles_buffer;
            const glow_particles_buffer = params.params.glow_particles_buffer;
            const isOn = switch_mesh.isOn;


            if (isOn) {
               // How should this callback know about the colorpicker, so that it can destroy it???????

               const colorpicker = CreateColorPicker(x, y + tail_particles.section.geom.dim[1] * 2, _, ROOT_WIDGETS.CREATE_ROOT);
               
               // Renderqueue_set_priority_by_vb(FIRST, colorpicker.gfx.vb.groupidx);
               Widget_root_set_render_queue_priority(colorpicker.root_bufferidx);

               colorpicker.AssignTargetMeshClbk((params) => {
                  const color = params;

                  // Gl_set_rgba(controls_dp.gfx, color, controls_dp.geom.num_faces);
                  CopyArr4(tail_particles_buffer[0].col, color);
                  CopyArr4(glow_particles_buffer[0].col, color);
                  // For control of all ball's tail particles
                  // for(let i=0; i<num_balls; i++){
                  //     CopyArr4(tail_particles_buffer[i].col, color);
                  //     CopyArr4(glow_particles_buffer[i].col, color);
                  // }
               });
               switch_mesh.temporary_renameme = colorpicker.mesh_bufferidx; // TODO: TEMPORARY assign. We need a way to store the colorpicker's index somewhere so that this callback can destroy it
            }
            else {

               const colorpicker = Mesh_buffer_get_mesh_byidx(switch_mesh.temporary_renameme)
               colorpicker.Destroy();
            }
         },
         null,
         {
            tail_particles_buffer: tail_particles_buffer,
            glow_particles_buffer: glow_particles_buffer,
         },
      );

      controls_dp.AddToMenu(color_picker);







      /****************************************************************************************************************/
      // Tail Particle System: Control Sliders 
      const slider_dim = [120*DEVICE.device_scale, 10*DEVICE.device_scale];
      const slider_col = GREY[2]
      const tail_buffer_len = tail_particles_buffer.length;
      {

         const ball_tail_controls = Create_widget_dropdown(_, 'Ball Tail Controls', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [4, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);
         // const glow_emitter = tail_particles_buffer[i]

         { // Slider 1 contol
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Speed');
            // slider.temp_align |= SECTION.VERTICAL;
            slider.SetInitialValue(27);
            ball_tail_controls.AddToMenu(slider);

            slider.SetColorHandleNoGfxUpdate(YELLOWL[6]);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


            Slider_connect(slider, (params, slider_val) => {

               for (let i = 0; i < tail_buffer_len; i++) {

                  const glow_emitter = tail_particles_buffer[i]
                  let min = .8; // The min value gives the prolonged glow_emitter
                  let max = 1.; // Calculate that the max value will be +1+min
                  const rev_slider_val = 1 - slider_val;
                  glow_emitter.t_step = rev_slider_val + min + ((max - slider_val) * (rev_slider_val));
                  glow_emitter.speed = (slider_val + 1) * 3;
               }
            }, _);

         }
         { // Slider 2 contol: Uniform value in fragment shader
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Intensity');
            slider.SetInitialValue(20);
            ball_tail_controls.AddToMenu(slider);

            slider.SetColorHandleNoGfxUpdate(YELLOWL[6]);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 1)
            }

         }
         { // Slider 3 contol: Uniform value in fragment shader
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Fire Variation');
            slider.SetInitialValue(100);
            ball_tail_controls.AddToMenu(slider);

            slider.SetColorHandleNoGfxUpdate(YELLOWL[6]);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 0)
            }
         }
         { // Slider 4 contol: Uniform value in fragment shader
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Noise Complexity');
            slider.SetInitialValue(50);
            ball_tail_controls.AddToMenu(slider);

            slider.SetColorHandleNoGfxUpdate(YELLOWL[6]);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            for (let i = 0; i < tail_buffer_len; i++) {

               const glow_emitter = tail_particles_buffer[i]
               Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_noise_params', Slider_get_slider_val, slider, 2)
            }
         }

         controls_dp.AddToMenu(ball_tail_controls);
      }

      // Glow Particle System: Control Sliders 
      const glow_buffer_len = glow_particles_buffer.length;
      for (let i = 0; i < glow_buffer_len; i++) {

         const glow_emitter = glow_particles_buffer[i];
         const glow_particles_controls = Create_widget_dropdown(_, 'Glow Particles Controls', [0, 0, zpos], YELLOWL[6], GREY[1], WHITE, [4, 4], _, _, regular_font_size, [0, 6, 2], [4, 4],);

         /**
          * NICE EFFECT:
          * Distance:{.28}, Brighter:{1}, Intensity:{.05}, Gravity:{.53{=.03}}, Acceleration:{.22}
          */

         {
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Distance');
            glow_particles_controls.AddToMenu(slider);
            slider.SetInitialValue(0);

            slider.SetColorHandleNoGfxUpdate(YELLOWL[6]);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 0)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Brighter');
            glow_particles_controls.AddToMenu(slider);
            slider.SetInitialValue(100);

            slider.SetColorHandleNoGfxUpdate(YELLOWL[6]);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 1)
         }
         {
            const slider = Create_widget_slider(_, [0, 0, zpos], slider_dim, slider_col, _, 'Intensity');
            glow_particles_controls.AddToMenu(slider);
            slider.SetInitialValue(3);

            slider.SetColorHandleNoGfxUpdate(YELLOWL[6]);

            slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            Particles_gfx_uniforms_set_clbk(glow_emitter.idx, 'u_glow_params', Slider_get_slider_val, slider, 2)
         }

         controls_dp.AddToMenu(glow_particles_controls);
      }


   }

   
   // controls_dp.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   // controls_dp.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, controls_dp.mesh_bufferidx);

   /****************************************************************************************************************/
   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Side panel
   if (root_widget & ROOT_WIDGETS.CREATE_ROOT) {
      const side_panel = CreateSidePanel(ROOT_WIDGETS.CREATE_ROOT);


      // Create the panel for holding all controls
      // const controls_panel = Create_widget_section(_, SECTION.VERTICAL, [4, 4], [0, 0, 0], [0, 0], TRANSPARENCY(PURPLEB[5], 1), 'SidePanel', [0, 10, 1.8]);
      // side_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
      // controls_panel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


      // controls_panel.AddItem(controls_dp)

      // Add the ballTail control properties to the side panel
      const inner_section = side_panel.children.buffer[1];


      // // Create scroller for the ui-mesh info widget
      // const scroller_width = 10;
      // const scroller = Create_widget_scroller(_, controls_panel, [scroller_width, 160], _, [4, 4]);
      // inner_section.AddItem(scroller);
      // scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.RESIZE_PARENTX;
      // scroller.scrolled_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      
      // inner_section.AddItem(controls_panel);
      inner_section.AddItem(controls_dp);

      // TODO: Must render the scrolled_section to its own VB
      
      
      
      side_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      side_panel.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX
      
      side_panel.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
      side_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, side_panel.mesh_bufferidx);
      side_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
      side_panel.Recalc_no_gfx_update();
      side_panel.Render();
      Widget_root_activate_all_vbs_in_renderqueue(side_panel.root_bufferidx);

      side_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, side_panel.gfx.vb.groupidx);
      
      Construct_listen_events_from_mesh_tree(side_panel);
      Construct_listen_events_relations_from_mesh_tree(side_panel);
      
      View_build_group_from_root_mesh(side_panel);
      
      
      // const scroller_component = Components_create_scroller_component(_, controls_dp.geom.dim[1], controls_dp, controls_dp.GetPosY(),);
      const scroller_component = Components_create_scroller_component(_, 100, controls_dp, controls_dp.GetPosY(),);
      Scoller_component_gengfx_and_render(scroller_component, controls_dp);
      Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(controls_dp.root_posidx , scroller_component.root_posidx);
      // Listeners_set_priority(E.C, scroller_component.listeners)

      
      // Set scissor box
      const mx = controls_dp.mesh_bufferidx;
      const my = scroller_component.mesh_bufferidx;
      const mw = controls_dp.mesh_bufferidx;
      const mh = scroller_component.mesh_bufferidx;
      Vertex_buffer_group_create_scissorbox(controls_dp.gfx.vb.groupidx, mx, my, mw, mh);


      const sbtn = side_panel.children.buffer[0];


      const params = {
         isOn: true,
         section_pad: side_panel.StylesGetPad(),
         scroller_component:scroller_component,
      };
      sbtn.ChangeListenEvent(E.C,
         (params) => {


            const section = params.evt_params.section;
            const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
            const isOn = params.evt_params.rest_params.isOn;
            const section_pad = params.evt_params.rest_params.section_pad;
            const scroller_component = params.evt_params.rest_params.scroller_component;
            const reduce_val = section.geom.dim[0] * 2 / 10;

            if (isOn) { // Close Panel

               Callback_animations_create( // Close Panel
                  (params) => { // Run Animation

                     let reduce_val = params.reduce_val;
                     const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);

                     if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - section_pad[0] * 2) {

                        const section = params.section;
                        Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

                        if (params.reduce_val > 5) params.reduce_val *= .9
                        // console.log('reduce_val', reduce_val, unif_wpos)

                        return true;
                     }

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
                     if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2) {

                        const section = params.section;
                        Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

                        if (params.reduce_val > 5) params.reduce_val *= .9
                        // console.log('reduce_val', reduce_val, unif_wpos)

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
         , { section: side_panel, rest_params: params },
      );
   }

   return controls_dp;

}



export function Demo_all() { // Side Panel 

   // const side_panel_width = 300;
   const scroller_panel_width = 10;
   
   
   const ball_tail_controls = Demo_ball_tail_2(0x0, (VIEWPORT.WIDTH/2), )
   ball_tail_controls.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   ball_tail_controls.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, ball_tail_controls.mesh_bufferidx);
   const side_panel_width = ball_tail_controls.geom.dim[0];
   
   const glow_controls = Demo_glow_particles_2(0x0, 0, VIEWPORT.HEIGHT)
   glow_controls.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   glow_controls.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, glow_controls.mesh_bufferidx);


   /****************************************************************************************************************/
   /****************************************************************************************************************/
   // Side panel

   const side_panel = CreateSidePanel(ROOT_WIDGETS.CREATE_ROOT, _, side_panel_width+scroller_panel_width);
   side_panel.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
   
      
   
   // Get the inner panel of the side panel, to add the section with all scrollers of controls
   const inner_section = side_panel.children.buffer[1];
   

   const s = Create_widget_section(_, SECTION.VERTICAL, [4, 4], [0, 0, 0], [10, 10], TRANSPARENCY(BLUEL[4], 1), 'Controls', [0, 10, 1.8]);
   s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   s.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;
   
   
   s.AddItem(ball_tail_controls)
   s.AddItem(glow_controls)
   
   
   const debug_ui = Debug_info_ui(_, [0,0,0]);
   s.AddItem(debug_ui);
   
   
   inner_section.AddItem(s);




   // Render side panel
   side_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   side_panel.options = SECTION.HORIZONTAL | SECTION.RESIZE_PARENTX

   side_panel.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   side_panel.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, side_panel.mesh_bufferidx);
   // side_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC | GFX_CTX_FLAGS.ABSOLUTE_POSITION);
   side_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   side_panel.Recalc_no_gfx_update();
   side_panel.Render();
   Widget_root_activate_all_vbs_in_renderqueue(side_panel.root_bufferidx);

   Construct_listen_events_from_mesh_tree(side_panel);
   Construct_listen_events_relations_from_mesh_tree(side_panel);
   
   View_build_group_from_root_mesh(side_panel);
   
   side_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, side_panel.gfx.vb.groupidx);
      
      
   const scroller_component = Components_create_scroller_component(scroller_panel_width, 140, s, s.GetPosY(),);
   Scoller_component_gengfx_and_render(scroller_component, s);
   Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(s.root_posidx , scroller_component.root_posidx);
   Listeners_set_priority(E.H, scroller_component.listeners)
   Listeners_set_priority(E.C, scroller_component.listeners)




   const sbtn = side_panel.children.buffer[0];


   const params = {
      isOn: true,
      section_pad: side_panel.StylesGetPad(),
      // section_pad: [50,50],
      scroller_component:scroller_component,
   };
   sbtn.ChangeListenEvent(E.C,
      (params) => {


         const section = params.evt_params.section;
         const btn = Mesh_buffer_get_mesh_byidx(params.meshidx);
         const isOn = params.evt_params.rest_params.isOn;
         const section_pad = params.evt_params.rest_params.section_pad;
         const reduce_val = section.geom.dim[0] * 2 / 10;
         // const scroll_comp_width = params.evt_params.rest_params.scroller_component.geom.dim[0]*2;
         const scroll_comp_width = 0;

         if (isOn) { // Close Panel

            Callback_animations_create( // Close Panel
               (params) => { // Run Animation

                  let reduce_val = params.reduce_val;
                  const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);

                  if (unif_wpos + reduce_val < VIEWPORT.WIDTH - btn.geom.dim[0] * 2 - section_pad[0]) {

                     const section = params.section;
                     Mesh_unif_add_vb_root_wposx(section.root_posidx, reduce_val);

                     if (params.reduce_val > 5) params.reduce_val *= .9
                     // console.log('reduce_val', reduce_val, unif_wpos)

                     return true;
                  }

                  return false;
               },
               () => { // Stop Animation

                  return false;
               },
               { section: section, reduce_val: reduce_val, scroll_comp_width: scroll_comp_width }
            );

            params.evt_params.rest_params.isOn = false;
         }
         else { // Open Panel

            Callback_animations_create(
               (params) => { // Run Animation

                  
                  const scroll_comp_width = params.scroll_comp_width;
                  let reduce_val = params.reduce_val;
                  const unif_wpos = Mesh_unif_get_vb_root_wposx(section.root_posidx);
                  if (unif_wpos > VIEWPORT.WIDTH - section.geom.dim[0] * 2 - scroll_comp_width) {

                     const section = params.section;
                     Mesh_unif_add_vb_root_wposx(section.root_posidx, -reduce_val);

                     if (params.reduce_val > 5) params.reduce_val *= .9
                     // console.log('reduce_val', reduce_val, unif_wpos)

                     return true;
                  }

                  return false;
               },
               () => { // Stop Animation

                  return false;
               },
               { section: section, reduce_val: reduce_val, scroll_comp_width: scroll_comp_width }
            );

            params.evt_params.rest_params.isOn = true;
         }


      }
      , { section: side_panel, rest_params: params },
   );


}