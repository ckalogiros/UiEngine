"use strict";

import { Create_rect_mesh, Create_widget_multi_text, Create_widget_section, Create_widget_slider, Create_widget_text } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from "../../Engine/Core/Views/RootView.js";
import { BLUEL, GREEN, GREY, ORANGEL, ORANGER, PURPLER, RGB, WHITE, YELLOW, YELLOWL } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_get_uniform_ubidx_from_name } from "../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from "../../Engine/Drawables/Widgets/ScrollerComponent.js";
import { Slider_connect, Slider_simple_set_value } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Listeners_set_priority } from "../../Engine/Events/EventListeners.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { Vertex_buffer_group_create_scissorbox, Vertex_buffer_set_and_update_uniform } from "../../Graphics/Buffers/VertexBuffers.js";
import { Gl_rotate_z_2d, Gl_set_angle } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomInt, GetSequencedColor } from "../../Helpers/Helpers.js";
import { Abs, Dot, Magnitude, Magnitude_2vectors } from "../../Helpers/Math/MathOperations.js";
import { Contols_generic_uniforms_buffer } from "../Widgets/ControlWidgets.js";




/**
 * VELOCITY DISTRIBUTION SUMMED OF ANY DIRECTION FOR BOTH Y AND X 
 * from 1.0 to 1.41422. this is true for any direction.
 * the 1.0 is the max of any axis move (x or y), 
 * and it gets larger towards diagonal move, where max velocity for each (x,y) is 0.70711  
 */









/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
// Sattelite rotation

const random_velocities = [
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
];

// TODO: Must correct the issue of balls overlaping. 


export function Sattelite_rotation(x = 0, y = 0) {


   let total_height = 20;
   const pad = 10;
   const panel_height = 150;

   const feather = 2;
   const rcorners = 10;

   /**********************************************************************************************************************************************/
   // Controls
   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4, 4], [x + pad, y, 0], [0, 0], GREY[1]);
   // controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.SetName('Sattelite_rotation->controls_section');
   controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   };

   const slider_dim = [300, 10];
   if (PLATFORM.ANY_SMARTPHONE_DEVICE) slider_dim[0] = VIEWPORT.WIDTH / 2 - 10;

   // Rotation slider
   const rot_slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Rotation');
   // rot_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   rot_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   rot_slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   controls_section.AddItem(rot_slider);
   rot_slider.SetInitialValue(0);
   rot_slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   // Speed slider
   const spd_slider = Create_widget_slider(_, [0, 0, 0], slider_dim, _, _, 'Speed');
   // spd_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   spd_slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   spd_slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   controls_section.AddItem(spd_slider);
   spd_slider.SetInitialValue(0.01);
   spd_slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


   // Render
   controls_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   controls_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   controls_section.Calc_no_gfx_update();
   controls_section.Render();
   Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);
   controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);
   Construct_listen_events_from_mesh_tree(controls_section)
   Construct_listen_events_relations_from_mesh_tree(controls_section);

   total_height += controls_section.geom.dim[1] + pad;


   /*********************************************************************************************************************************************/
   // Main Panel Section

   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [x + pad, y + total_height * 2, 0], [panel_height, panel_height], GREY[1]);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.StateEnable(MESH_STATE.IS_RESIZEABLE);
   section.SetName('Sattelite_rotation->panel');


   const balls_buffer = [], physics = [];


   for (let i = 0; i < 1; i++) {

      /*********************************************************************************************************************************************/
      // Balls
      const size = 30;
      const dim = [size, size]
      const pos = [(panel_height - size), (panel_height - size)];


      const ball = Create_rect_mesh(_, [pos[0], pos[1], 2], dim, BLUEL[9], 'Ball', [0, dim[0], 2]);
      ball.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      // ball.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      ball.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dim[0]);
      ball.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      section.AddItem(ball);

      balls_buffer[i] = ball;

      // Physics
      const velocity = [random_velocities[i], random_velocities[i + 1]];
      const mass = ball.geom.dim[0];
      const momentum = [velocity[0] * mass, velocity[1] * mass];
      const acceleration = [0, 0];
      const speed = .5;

      physics[i] = {
         vel: velocity,
         mass: mass,
         mom: momentum,
         accel: acceleration,
         speed: speed,
      }

   }

   const sat = Create_rect_mesh(_, _, [6, 12], YELLOWL[9]);
   sat.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // sat.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   sat.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 6);
   sat.EnableGfx(MESH_ENABLE.GFX.ATTR_ANGLE, 0);
   sat.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   section.AddItem(sat);

   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   total_height += panel_height + pad;







   /*********************************************************************************************************************************************/
   // Set slider callback

   {

      const ball = balls_buffer[0];
      const phys = physics[0];
      const params = {
         section: section,
         ball: ball,
         phys: phys,
         sat: sat,
      }

      Slider_connect(rot_slider, (params, slider_val) => {

         const ball = params.clbk_params.ball;
         const phys = params.clbk_params.phys;

         phys.vel[0] = Math.sin(slider_val * Math.PI * 2);
         phys.vel[1] = Math.cos(slider_val * Math.PI * 2);

         const section = params.clbk_params.section;
         const top_bound = 0;
         const bot_bound = section.geom.dim[1] * 2;
         const left_bound = 0;
         const right_bound = section.geom.dim[0] * 2;

         // Check boundaries
         const ball_radius = ball.geom.dim[0];
         const ball_top = ball.geom.pos[1];
         const ball_bot = ball.geom.pos[1] + ball_radius * 2;
         const ball_left = ball.geom.pos[0];
         const ball_right = ball.geom.pos[0] + ball_radius * 2;

         if (ball_bot > bot_bound) phys.vel[1] *= -1; // Reverse velocity
         else if (ball_top < top_bound) phys.vel[1] *= -1;
         if (ball_right > right_bound) phys.vel[0] *= -1;
         else if (ball_left < left_bound) phys.vel[0] *= -1;

      }, params);

      Slider_connect(spd_slider, (params, slider_val) => {

         const ball = params.clbk_params.ball;
         const phys = params.clbk_params.phys;

         phys.speed = slider_val * 2;

         const section = params.clbk_params.section;
         const top_bound = 0;
         const bot_bound = section.geom.dim[1] * 2;
         const left_bound = 0;
         const right_bound = section.geom.dim[0] * 2;

         // Check boundaries
         const ball_radius = ball.geom.dim[0];
         const ball_top = ball.geom.pos[1];
         const ball_bot = ball.geom.pos[1] + ball_radius * 2;
         const ball_left = ball.geom.pos[0];
         const ball_right = ball.geom.pos[0] + ball_radius * 2;

         if (ball_bot > bot_bound) phys.vel[1] *= -1; // Reverse velocity
         else if (ball_top < top_bound) phys.vel[1] *= -1;
         if (ball_right > right_bound) phys.vel[0] *= -1;
         else if (ball_left < left_bound) phys.vel[0] *= -1;

      }, params);
   }


   /*********************************************************************************************************************************************/
   // Create time interval for ball move and sattelite manipuulation
   const params = {
      section: section,
      balls_buffer: balls_buffer,
      physics: physics,
      controls_section: controls_section,
      prev_pos: [0, 0],
      hits: 0, // TODO: Create info-ui displaying the wall-hit value
   }


   Time_intervals_create(1, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_sattelite, params);



   /**********************************************************************************************************************************************/
   // Create Info Panel
   {
      const info_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x + pad, y + total_height * 2, 0], [0, 0], GREY[1]);
      // sat.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      sat.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      sat.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      if (!PLATFORM.ANY_SMARTPHONE_DEVICE) info_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      info_section.SetName('Sattelite_rotation->InfoUi-panel');


      const font_size = _;
      const pad1 = [0, 1];
      const pad2 = [4, 0];
      const ms = 60;
      let zpos = 1;
      let generic_time_interval = INT_NULL;

      { // Info
         const nfo = Create_widget_multi_text(_, 'Vel x:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1);
         info_section.AddItem(nfo);

         nfo.CreateNewText('00000', font_size, GREEN[7], pad2, .9);
         nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return physics[0].vel[0]; }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

         nfo.CreateNewText('Vely:', font_size, WHITE, pad2, .9,);
         nfo.CreateNewText('00000', font_size, GREEN[7], pad2, .9);
         nfo.SetDynamicText(`ms${ms} -`, ms, () => { return physics[0].vel[1]; }, _, _, _); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

         nfo.CreateNewText('Sum:', font_size, WHITE, pad2, .9,);
         nfo.CreateNewText('00000', font_size, ORANGER[9], pad2, .9);
         nfo.SetDynamicText(`ms${ms} -`, ms, () => { return Abs(physics[0].vel[0]) + Abs(physics[0].vel[1]); }, _, _, _); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      }
      { // Info
         const ms = 60;
         const nfo = Create_widget_multi_text(_, 'Pi Angle:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1);
         info_section.AddItem(nfo);

         nfo.CreateNewText('00000', font_size, GREEN[7], pad2, .9);
         nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return Math.atan2(physics[0].vel[0], physics[0].vel[1]); }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      }
      { // Info
         const ball = balls_buffer[0];

         const ms = 60;
         const nfo = Create_widget_multi_text(_, 'Vel:cos(atan2):', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1);
         info_section.AddItem(nfo);

         nfo.CreateNewText('00000', font_size, YELLOW[9], pad2, .9);
         nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return Abs(sat.geom.pos[0] + (ball.geom.dim[0] * Math.cos(Math.atan2(physics[0].vel[0], physics[0].vel[1])))); }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

         nfo.CreateNewText('Vel:sin(atan2):', font_size, WHITE, pad2, .9,);
         nfo.CreateNewText('00000', font_size, YELLOW[9], pad2, .9);
         nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return Abs(sat.geom.pos[1] + (ball.geom.dim[1] * Math.sin(Math.atan2(physics[0].vel[0], physics[0].vel[1])))); }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      }
      { // Info Magnitude
         const ball = balls_buffer[0];

         const ms = 60;
         const nfo = Create_widget_multi_text(_, 'Vector Mag:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1);
         info_section.AddItem(nfo);


         // Cache the ball 1 and ball 2 center positions
         const p1 = [
            (ball.geom.pos[0] + ball.geom.dim[0]),
            (ball.geom.pos[1] + ball.geom.dim[1])
         ];
         // Calc the vector of the impact line and the magnitude of that vector...
         const impact_vector = [p1[0], p1[1]];
         const impact_mag = Magnitude(impact_vector[0], impact_vector[1]);


         nfo.CreateNewText('00000', font_size, GREEN[7], pad2, .9);
         nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return impact_mag; }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

      }


      // Render
      info_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      info_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

      info_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      info_section.Calc_no_gfx_update();

      info_section.Render();
      Root_group_activate_all_vbs_in_renderqueue(info_section.root_bufferidx);

      info_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, info_section.gfx.vb.groupidx)


      Construct_listen_events_from_mesh_tree(info_section)
      Construct_listen_events_relations_from_mesh_tree(info_section);

      total_height += info_section.geom.dim[1] + pad;
   }

   return total_height;

}



function Animate_sattelite(params) {

   const section = params.params.section;


   const len = params.params.balls_buffer.length;
   for (let i = 0; i < len; i++) {

      const ball = params.params.balls_buffer[i];
      const phys = params.params.physics[i];
      const sat = section.children.buffer[1];
      const controls_section = params.params.controls_section;
      const slider = controls_section.children.buffer[0];


      // Move the ball
      const x = phys.mass * (phys.vel[0] + phys.accel[0]) * phys.speed * .1;
      const y = phys.mass * (phys.vel[1] + phys.accel[1]) * phys.speed * .1;

      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;


      // Check boundaries
      let hit = false;
      const top_bound = 0;
      const bot_bound = section.geom.dim[1] * 2;
      const left_bound = 0;
      const right_bound = section.geom.dim[0] * 2;

      // Check boundaries
      const ball_radius = ball.geom.dim[0];
      const ball_top = ball.geom.pos[1] + y;
      const ball_bot = ball.geom.pos[1] + ball_radius * 2 + y;
      const ball_left = ball.geom.pos[0] + x;
      const ball_right = ball.geom.pos[0] + ball_radius * 2 + x;


      if (ball_bot > bot_bound) {
         phys.vel[1] *= -1; // Reverse velocity
         hit = true;
      }
      else if (ball_top < top_bound) {
         phys.vel[1] *= -1;
         hit = true;
      }
      if (ball_right > right_bound) {
         phys.vel[0] *= -1;
         hit = true;
      }
      else if (ball_left < left_bound) {
         phys.vel[0] *= -1;
         hit = true;
      }

      ball.geom.AddWposXY(ball.gfx, x, y);
      /* Uncomment to speed uup the balls velocity each time it collides to a wall */
      // if(hit && phys.speed < 3) {
      //    phys.speed *= 1.05;
      //    params.params.hits++;
      //    console.log(params.params.hits);
      // }

      const angle = Math.atan2(x, y); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
      const normalizedAngle = angle >= 0 ? angle : (2 * Math.PI + angle); // Normalize from -π,π to 0,π
      Gl_set_angle(sat.gfx, normalizedAngle);
      Gl_rotate_z_2d(sat.gfx, sat.geom.dim, angle, 1);

      const cx = sat.geom.pos[0]; // Center to sattelites position
      const cy = sat.geom.pos[1]
      const r = ball.geom.dim[0] + sat.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
      const a = (cx + (r * Math.sin(angle))); // The rotation is the tangent of the outer ball's perimeter, and we add the   
      const b = (cy + (r * Math.cos(angle)));

      sat.geom.SetWposXY(sat.gfx, ball.geom.pos[0] + ball.geom.dim[0], ball.geom.pos[1] + ball.geom.dim[1]);
      sat.geom.AddWposXY(sat.gfx, a, b);




      /** if the ball has hitted the wall boundaries, set the slider (value and position) according to the new direction */
      // This value gives: from [0..1] of the right semicircle rotation, and [-1..0] for the left semicircle rotation
      // (The right semicircle starts pointing down, and ends up. The left starts pointing up and ends down (counter clockwise))
      let val = angle / Math.PI;

      // Interpolate the above value to slider's [0..1] span.
      if (val < 0) { // If val [0..1] for the right semicircle, 
         val = (val * .5) + 1; // give us a value of [0..0.5]
      }
      else { // If val [-1..0] for the left semicircle, 
         val = (val * .5); // give us a value of [0.5..1]
      }


      const bar = slider.children.buffer[1];
      Slider_simple_set_value(bar, val);


   }
}















/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
// Elastic Collisions


const elastic_collisions_panel_dim = [120, 200];
const num_balls = 9;
const ball_dim = 20;
const pad = 15;

const random_positions = [
   [ball_dim * 2 + pad, ball_dim * 2],
   [ball_dim * 2 * 3 + pad, ball_dim * 2],
   [ball_dim * 2 * 5 + pad, ball_dim * 2],
   [ball_dim * 2 + pad, ball_dim * 4],
   [ball_dim * 2 * 3 + pad, ball_dim * 4],
   [ball_dim * 2 * 5 + pad, ball_dim * 4],
   [ball_dim * 2 + pad, ball_dim * 6],
   [ball_dim * 2 * 3 + pad, ball_dim * 6],
   [ball_dim * 2 * 5 + pad, ball_dim * 6],
   [ball_dim * 2 + pad, ball_dim * 8],
   [ball_dim * 2 * 3 + pad, ball_dim * 8],
   [ball_dim * 2 * 5 + pad, ball_dim * 8],


];


let collision = false;
let in_scale_adjustment = false;




export function Elastic_collisions(x = 0, y = 0, root_widget = 0x0, controls_create = true, controls_render = false) {

   let total_height = 20;

   const scale_down = .6;
   const feather = 2;
   const rcorners = 10;

   let controls_section = null;


   const pad = 10;
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4, 4], [x + pad, y + total_height * 2, 0], elastic_collisions_panel_dim, GREY[1]);
   // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.StateEnable(MESH_STATE.IS_RESIZEABLE);
   section.SetName('Elastic_collisions');


   const balls_buffer = [], physics = [], info_buffer = [];

   const test = Create_widget_text(_, `Explanation Here.`, [0, 400, 10], _, WHITE, _, _, TEXTURES.CONSOLAS_12px);
   test.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.AddItem(test);


   for (let i = 0; i < num_balls; i++) {

      /**************************************************************************************************************************************/
      // Balls
      const size = GetRandomInt(ball_dim, ball_dim * 2)
      // const size = ball_dim;
      const dim = [size, size]
      const pos = random_positions[i];


      let zpos = 1;

      const color = GetSequencedColor(9);
      // const color = RGB(i, 0.15, 0, 1.3);
      const ball = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [pos[0], pos[1], zpos++], dim, color, 'Ball' + i, [0, dim[0], 2]);
      ball.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ball.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      ball.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

      ball.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dim[0]);
      ball.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


      // ball.EnableGfx(MESH_ENABLE.GFX.PASS_VPOS2);
      // ball.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
      // ball.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME, 0.4);

      { // Test Shaders
         // ball.EnableGfx(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
         // ball.EnableGfx(MESH_ENABLE.GFX.ATTR_GENERIC_VEC2, { a:0.01, b:0.0 });
      }

      ball.EnableGfx(MESH_ENABLE.GFX.FN_GLOW);

      section.AddItem(ball);

      balls_buffer[i] = ball;


      info_buffer[i] = {
         name: null,
         pos: null,
         overlap: null,
         dir: null,
         pos_after: null,
      };

      // Physics
      const velocity = [random_velocities[i], random_velocities[i + 1]];
      const mass = ball.geom.dim[0] * scale_down;
      const momentum = [velocity[0] * mass, velocity[1] * mass];
      const acceleration = [0, 0];
      // const speed = GetRandomInt(1, 1);
      const speed = 1.5;
      physics[i] = {
         vel: velocity,
         mass: mass,
         mom: momentum,
         accel: acceleration,
         speed: speed,
         overlap: [0, 0], // The overlap distance of the collision
      }
   }




   const slider_feather = 2;
   const slider_rcorners = 10;
   const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }

   const mnemonics = {
      scale_down: scale_down,
      initial_speed: physics[0].speed,
      physics: physics,
      in_scale_adjustment: in_scale_adjustment,
      // scale_factor:0,

   };

   const params = {
      mnemonics: mnemonics,
   }


   /****************************************************************************************************************/
   // Create slider controls




   if (controls_create) { // Create slider controls only if this is to be rendered from this function

      const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [x, 500, 1], [0, 0], GREY[1], 'Emitter Window Panel', [0, 10, 2],);
      // controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
      controls_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      controls_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      controls_section.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      const controls_buffer = Create_elastic_collisions_controls(balls_buffer, YELLOWL[3], [scale_down], params);

      const len = controls_buffer.length;
      for (let i = 0; i < len; i++) {
         const ctrl = controls_buffer[i];
         controls_section.AddItem(ctrl);
      }

      if (controls_render) {

         /****************************************************************************************************************/
         // Render 
         controls_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, controls_section.mesh_bufferidx, true);
         controls_section.GenGfxCtx();
         controls_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
         controls_section.Calc_no_gfx_update();

         controls_section.Render();
         Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);

         controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);

         Construct_listen_events_from_mesh_tree(controls_section);
         Construct_listen_events_relations_from_mesh_tree(controls_section);
      }

   }









   /****************************************************************************************************************/
   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   // Initialize values to uniforms
   balls_buffer[0].GfxUniformSetAndUpdate('u_scale2', [scale_down, 1]);
   // balls_buffer[0].GfxUniformSetAndUpdate('u_glow_params', [.7, 1., .4]);
   balls_buffer[0].GfxUniformSetAndUpdate('u_generic_controls', [1., .0, 1.]);

   total_height += elastic_collisions_panel_dim[1];



   const animation_params = {
      section: section,
      balls_buffer: balls_buffer,
      // physics: physics,
      info_buffer: info_buffer,
      // scale_down: scale_down,
      mnemonics: mnemonics,
   }

   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_elastic_collisions_balls, animation_params);






   /**********************************************************************************************************************************************/
   // Info Panel
   let yy = 0;
   const pos = [
      section.geom.pos[0] + section.geom.dim[0] * 2 + pad,
      section.GetPosY() + yy,
      0
   ];
   const info_section_panel = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [5, 5], pos, [0, 0], GREY[1]);
   {
      // info_section_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      info_section_panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
      info_section_panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      if (!PLATFORM.ANY_SMARTPHONE_DEVICE) info_section_panel.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      info_section_panel.SetName(`InfoUi-info_section_panel`);
      for (let i = 0; i < num_balls; i++) {

         const pos = [
            section.geom.pos[0] + section.geom.dim[0] * 2 + pad + pad,
            section.GetPosY() + yy,
            0
         ];
         const info_section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], pos, [0, 0], GREY[2]);
         // info_section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
         info_section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
         info_section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         info_section.SetName(`InfoUi-panel${i}`);
         const ball = balls_buffer[i];

         yy += 40


         const font = TEXTURES.CONSOLAS_12px;
         const font_size = 0;
         const pad1 = [6, 1];
         const pad2 = [4, 0];
         const zpos = 1;
         const ms = 60;
         const COLOR = ball.mat.col;
         var info_text_mesh = null;
         let generic_time_interval = INT_NULL;
         { // Info
            const nfo = Create_widget_multi_text(_, 'px:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1, font);
            info_section.AddItem(nfo);

            nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
            nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return ball.geom.pos[0]; }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
            generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

            nfo.CreateNewText('py:', font_size, WHITE, pad2, .9,);
            nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
            nfo.SetDynamicText(`ms${ms} -`, ms, () => { return ball.geom.pos[1]; }, _, _, _); // idx param is for use in creating separate nfo for each widget dynamic text.
            generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

            info_text_mesh = nfo;
         }
         { // Info
            const nfo = Create_widget_multi_text(_, 'vx:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1, font);
            info_section.AddItem(nfo);

            nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
            nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return physics[i].vel[0]; }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
            generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

            nfo.CreateNewText('vy:', font_size, WHITE, pad2, .9,);
            nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
            nfo.SetDynamicText(`ms${ms} -`, ms, () => { return physics[i].vel[1]; }, _, _, _); // idx param is for use in creating separate nfo for each widget dynamic text.
            generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
         }
         { // Info
            const nfo = Create_widget_multi_text(_, 'accel x:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1, font);
            info_section.AddItem(nfo);

            nfo.CreateNewText('000', font_size, COLOR, pad2, .9);
            nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return physics[i].accel[0]; }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
            generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

            nfo.CreateNewText('y:', font_size, WHITE, pad2, .9,);
            nfo.CreateNewText('000', font_size, COLOR, pad2, .9);
            nfo.SetDynamicText(`ms${ms} -`, ms, () => { return physics[i].accel[1]; }, _, _, _);
            generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
         }
         { // Info
            // const ivev = [ball.geom.pos[0]-ball2.geom.pos[0], ball.geom.pos[1]-ball2.geom.pos[1]];
            // const imag = Magnitude(ball.geom.pos[0], ball.geom.pos[1]);
            const nfo = Create_widget_multi_text(_, 'magnitude: ', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1, font);
            info_section.AddItem(nfo);

            nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
            nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, () => { return Magnitude(ball.geom.pos[0], ball.geom.pos[1]); }, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
            generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

         }

         info_section_panel.AddItem(info_section)
      }


      // Render
      info_section_panel.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      // info_section_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
      info_section_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
      // info_section_panel.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_DSC, info_section_panel.mesh_bufferidx, true);


      info_section_panel.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      info_section_panel.Calc_no_gfx_update();

      info_section_panel.Render();
      Root_group_activate_all_vbs_in_renderqueue(info_section_panel.root_bufferidx);

      info_section_panel.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, info_section_panel.gfx.vb.groupidx);


      Construct_listen_events_from_mesh_tree(info_section_panel)
      Construct_listen_events_relations_from_mesh_tree(info_section_panel);


      // Create scroller
      const needs_scroller = (info_section_panel.geom.dim[1] > elastic_collisions_panel_dim[1]) ? true : false
      if (needs_scroller) {

         // const scroller_component = Components_create_scroller_component(10, elastic_collisions_panel_dim[1], info_section_panel, info_section_panel.GetPosY(),);
         const scroller_component = Components_create_scroller_component(10, elastic_collisions_panel_dim[1], info_section_panel, _,);
         Scoller_component_gengfx_and_render(scroller_component, info_section_panel);
         Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(info_section_panel.root_posidx, scroller_component.root_posidx);
         Listeners_set_priority(E.C, scroller_component.listeners)
         info_section_panel.AddChildScrollerIdx(info_section_panel.scroller_comp_idx);
         Scroller_component_calculate_handle_pos_dim(info_section_panel, scroller_component);


         // Set scissor box
         const mx = info_section_panel.mesh_bufferidx;
         const my = scroller_component.mesh_bufferidx;
         const mw = info_section_panel.mesh_bufferidx;
         const mh = scroller_component.mesh_bufferidx;
         Vertex_buffer_group_create_scissorbox(info_section_panel.gfx.vb.groupidx, mx, my, mw, mh);
         Vertex_buffer_group_create_scissorbox(info_text_mesh.gfx.vb.groupidx, mx, my, mw, mh);


         // Unfortunately must Re-render the section for the clipping of the scroller to take place
         Root_group_reset_gfxs(info_section_panel.root_bufferidx);
         Root_group_rerender_from_root_reconstruct_listeners(info_section_panel.root_bufferidx);
      }
   }

   return {
      ellastic_collisions_balls: balls_buffer,
      controls_section: controls_section,
      info_section_panel: info_section_panel,
      mnemonics: mnemonics,
   };
}




/** For rendering the slider controls seperately from the ellastic collisions */
export function Create_elastic_collisions_controls(ball_mesh, color = GREY[2], slider_init_values = null, params = null) {

   let contols_buffer = [];


   /****************************************************************************************************************/
   // Create Graphics controls
   if (ball_mesh[0].sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) { // Create slider controls only if this is to be rendered from this function

      const slider_size = 120 * DEVICE.device_scale; // y:10 * DEVICE.device_scale;
      // const parameters = [0.2, .48, .5, .19, .08, .4, .04, .04, .55];
      const generic_controls_parameters = [1., 0., 1.];
      contols_buffer = Contols_generic_uniforms_buffer(ball_mesh[0], slider_size, generic_controls_parameters);
   }

   const u_wpos_flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS3,
   }


   /****************************************************************************************************************/
   // Create Sliders for manipulating variables of ellastic collisions
   {

      const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
      const slider_feather = 2;
      const slider_rcorners = 10;


      { // Set Scale
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Particle Scale');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         contols_buffer.push(slider);
         slider.SetInitialValue(slider_init_values ? slider_init_values[0] : .08);
         // params.mnemonics.scale_factor =  (slider_init_values?slider_init_values[0]:.08);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh[0];
            const val_idx = params.clbk_params.val_idx;
            // Find the ubidx
            const ubidx = Mesh_get_uniform_ubidx_from_name(target_mesh.uniforms, 'u_scale2');
            Vertex_buffer_set_and_update_uniform(target_mesh.gfx.vb.groupidx, ubidx, slider_val, val_idx);

            params.clbk_params.mnemonics.scale_down = slider_val;

            params.clbk_params.mnemonics.in_scale_adjustment = true;
            // params.clbk_params.mnemonics.scale_factor = true;

         }, { mnemonics: params.mnemonics, target_mesh: ball_mesh, val_idx: 0, }, false);
      }
      { // Set Speed
         const slider = Create_widget_slider(_, [0, 0, 0], slider_dim, color, _, 'Speed');
         // slider.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, slider_feather);
         slider.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, slider_rcorners);
         slider.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         contols_buffer.push(slider);
         slider.SetInitialValue(slider_init_values[1] ? slider_init_values[1] : .08);
         slider.GfxUniformsEnable(u_wpos_flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

         Slider_connect(slider, (params, slider_val) => {

            const physics = params.clbk_params.mnemonics.physics;
            const inital_speed = params.clbk_params.mnemonics.initial_speed;
            const len = physics.length;
            for (let i = 0; i < len; i++) {

               physics[i].speed = inital_speed * (slider_val + 1);
            }
            // params.clbk_params.mnemonics.scale_down = slider_val;

         }, { mnemonics: params.mnemonics, target_mesh: ball_mesh, }, true);
      }


   }

   return contols_buffer;
}



/****************************************************************************************************************/
// Create the ball's animation callback
function Animate_elastic_collisions_balls(params) {

   if (collision === true) {
      STATE.loop.paused = true;
      collision = false
   }

   const section = params.params.section;
   const scale_down = params.params.mnemonics.scale_down;

   const top_bound = 0;
   const bot_bound = section.geom.dim[1] * 2;
   const left_bound = 0;
   const right_bound = section.geom.dim[0] * 2;


   const len = params.params.balls_buffer.length;
   for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {

         const ball = params.params.balls_buffer[i];
         const ball2 = params.params.balls_buffer[j];

         const phys1 = params.params.mnemonics.physics[i];
         const phys2 = params.params.mnemonics.physics[j];


         // Calculate the scaled ball size
         const ball_size = ball.geom.dim[0] * scale_down;
         const ball2_size = ball2.geom.dim[0] * scale_down;
         // const ball_size = ball.geom.dim[0] * scale_factor;
         // const ball2_size = ball2.geom.dim[0] * scale_factor;

         // Calculate position relative to the new scaled size
         const ball_pos = [
            // (ball.geom.pos[0] + ball.geom.dim[0]) - ball_size,
            // (ball.geom.pos[1] + ball.geom.dim[1]) - ball_size,
            (ball.geom.pos[0]),
            (ball.geom.pos[1]),
         ];
         const ball2_pos = [
            // (ball2.geom.pos[0] + ball2.geom.dim[0]) - ball2_size,
            // (ball2.geom.pos[1] + ball2.geom.dim[1]) - ball2_size,
            (ball2.geom.pos[0]),
            (ball2.geom.pos[1]),
         ];


         // Cache the ball 1 and ball 2 center positions
         const p1 = [
            (ball_pos[0] + ball_size),
            (ball_pos[1] + ball_size)
         ];
         const p2 = [
            (ball2_pos[0] + ball2_size),
            (ball2_pos[1] + ball2_size)
         ];
         const radii = (ball_size + ball2_size);


         // Calc the vector of the impact line and the magnitude of that vector...
         const impact_vector = [p1[0] - p2[0], p1[1] - p2[1]];
         const impact_mag = Magnitude(impact_vector[0], impact_vector[1]);

         // If the vector magnitude is less than the 2 radii of the balls, we have a collision
         if (impact_mag <= radii) {

            // The overlap distance of the 2 balls, coinciding with the line of impact 
            // overlap = (impact_mag - radii);

            const n = [impact_vector[0] / impact_mag, impact_vector[1] / impact_mag];
            const d = radii - impact_mag;
            // console.log('n', n, 'd', d)

            phys1.overlap[0] = .5 * d * n[0];
            phys1.overlap[1] = .5 * d * n[1];
            phys2.overlap[0] = -.5 * d * n[0];
            phys2.overlap[1] = -.5 * d * n[1];

            // STATE.loop.paused = true

            /****************************************************************************************/
            // Handle info text
            {

               // const info_text1 = params.params.info_buffer[i];
               // const info_text2 = params.params.info_buffer[j];

               // info_text1.pos.RenderTextFromString(`p:x${Floor(p1[0])}y${Floor(p1[1])}`);
               // info_text1.overlap.RenderTextFromString(`overlap:${overlap.toFixed(2)}`);
               // info_text1.dir.RenderTextFromString(`dir:x${dir1[0].toFixed(2)}y${dir1[1].toFixed(2)}`);

               // info_text2.pos.RenderTextFromString(`p:x${Floor(p2[0])}y${Floor(p2[1])}`);
               // info_text2.overlap.RenderTextFromString(`overlap:${overlap.toFixed(2)}`);
               // info_text2.dir.RenderTextFromString(`dir:x${dir2[0].toFixed(2)}y${dir2[1].toFixed(2)}`);
            }


            // Cache the current velocity vectors of the 2 balls to be compared
            // Caution! Must copy the values 
            const velx1 = phys1.vel[0], vely1 = phys1.vel[1];
            const velx2 = phys2.vel[0], vely2 = phys2.vel[1];


            /**
             * Elastic collision Resolution
             * u1` = u1+ ( ( (u2-u1) DOT (x2-x1) ) / (|x2-x1|)^2 ) * (x2-x1)
             * x:vector position, |x2-x1|)^2 : the magnitude of the resulted vector
            */

            // Get the distance vector of the 2 balls
            // Must check for equal positions, and set to small value, to avoid divide by 0)
            const dx = (p2[0] === p1[0]) ? .0001 : (p2[0] - p1[0]);
            const dy = (p2[1] === p1[1]) ? .0001 : (p2[1] - p1[1]);
            const mag = Magnitude_2vectors(p2, p1)
            { // Ball 1: velocity calculation
               const dot_product = Dot(velx2 - velx1, vely2 - vely1, dx, dy);
               phys1.vel[0] = velx1 + ((dot_product / (mag * mag)) * dx);
               phys1.vel[1] = vely1 + ((dot_product / (mag * mag)) * dy);

            }
            { // Ball 2: velocity calculation
               const dot_product = Dot(velx1 - velx2, vely1 - vely2, -dx, -dy);
               phys2.vel[0] = velx2 + ((dot_product / (mag * mag)) * -dx);
               phys2.vel[1] = vely2 + ((dot_product / (mag * mag)) * -dy);
            }

            // STATE.loop.paused = true;

         }
      }
   }

   // TODO: Combine the 2 for loops
   // Check Boundary Collisions
   for (let i = 0; i < len; i++) {


      const ball = params.params.balls_buffer[i];
      const phys1 = params.params.mnemonics.physics[i];


      // Calculate the scaled ball size
      const ball_size = ball.geom.dim[0] * scale_down;

      // Calculate position relative to the new scaled size
      const ball_pos = [
         ball.geom.pos[0],
         ball.geom.pos[1],
      ];

      ball_pos[0] += phys1.overlap[0];
      ball_pos[1] += phys1.overlap[1];
      ball.geom.pos[0] += phys1.overlap[0];
      ball.geom.pos[1] += phys1.overlap[1];

      // Move the ball
      const x = (phys1.vel[0]) * (phys1.speed + phys1.accel[0]);
      const y = (phys1.vel[1]) * (phys1.speed + phys1.accel[1]);
      ball_pos[0] += x;
      ball_pos[1] += y;
      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;

      // Check boundaries
      const ball_top = ball_pos[1] - ball_size + y;
      const ball_bot = ball_pos[1] + ball_size + y;
      const ball_left = ball_pos[0] - ball_size + x;
      const ball_right = ball_pos[0] + ball_size + x;

      if (ball_bot > bot_bound) {
         phys1.vel[1] = -1; // Reverse velocity
         ball_pos[1] = bot_bound - (ball_size * 2) - 3; // Put back inside the panel area
      }
      else if (ball_top < top_bound) {
         phys1.vel[1] = 1;
         ball_pos[1] = 0;
      }
      if (ball_right > right_bound) {
         phys1.vel[0] = -1;
         ball_pos[0] = right_bound - (ball_size * 2) - 3;
      }
      else if (ball_left < left_bound) {
         phys1.vel[0] = 1;
         ball_pos[0] = 0;
      }


      ball.geom.SetWposXY(ball.gfx, ball.geom.pos[0], ball.geom.pos[1]);

      phys1.overlap[0] = 0;
      phys1.overlap[1] = 0;

      if (phys1.accel[0] > 0) phys1.accel[0] -= .05;
      if (phys1.accel[1] > 0) phys1.accel[1] -= .05;
   }

}

