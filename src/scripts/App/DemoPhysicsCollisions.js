"use strict";

import { Create_rect_mesh, Create_widget_multi_text, Create_widget_section, Create_widget_slider, Create_widget_text } from "../Engine/Core/CreateWidget.js";
import { Widget_root_activate_all_vbs_in_renderqueue } from "../Engine/Core/MeshBuffer.js";
import { Mesh_unif_get_vb_root_wpos } from "../Engine/Core/MeshUniformsBuffer";
import { BLACK, GREEN, GREY, ORANGE, PURPLE, WHITE, YELLOW, YELLOWL, YELLOWR } from "../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect, Slider_simple_set_value } from "../Engine/Drawables/Widgets/WidgetSlider.js";
import { TimeIntervalsCreate } from "../Engine/Timers/TimeIntervals";
import { GlRotateZ2D } from "../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomInt, GetRandomPos, GetSequencedColor } from "../Helpers/Helpers";
import { Abs, Dot, Floor, Magnitude, Magnitude_2vectors, Normalize_vec2 } from "../Helpers/Math/MathOperations.js";



const random_velocities = [
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
   -.2, .5, -.7, .9, -.6, -.9, .4, -1, 1, .3,
];



const random_positions = [
   [0, 0],
   [80, 60],
   [140, 20],
];


let collision = false;




export function Physics_collisions() {

   let total_height = 20;

   const panel_dim = [200, 200]
   const pad = 10;
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [pad, total_height*2, 0], panel_dim, GREY[3]);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.StateEnable(MESH_STATE.IS_RESIZEABLE);


   const balls_buffer = [], physics = [], info_buffer = [];




   for (let i = 0; i < 2; i++) {

      /**************************************************************************************************************************************/
      // Balls
      const size = GetRandomInt(40, 40);
      const dim = [size, size]
      // const pos = GetRandomPos([10, 10], [180, 180])
      const pos = random_positions[i];

      let zpos = 1;

      // const ball = Create_rect_mesh(_, [pos[0], pos[1], 2], dim, GetSequencedColor(), 'Ball', [0, dim[0], 2]);
      const ball = Create_widget_section(_, SECTION.VERTICAL, [5,5], [pos[0], pos[1], zpos++], dim, GetSequencedColor(9), 'Ball', [0, dim[0], 2]);
      ball.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      ball.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      ball.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, [0, size, 2]);
      section.AddItem(ball);
      
      balls_buffer[i] = ball;


      info_buffer[i] = {
         name: null,
         pos: null,
         overlap: null,
         dir: null,
         pos_after: null,
      };

      { // Create the info widgets

         const COLOR = ball.mat.col;
         let y = 10;
         const pos_orig = [ball.geom.pos[0], ball.geom.pos[1]]
   
         const name = Create_widget_text(_, `Ball ${i}`, [pos_orig[0]+size/2, pos_orig[1]+y, zpos++], _, COLOR, )
         name.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ball.AddItem(name);
         info_buffer[i].name = name;
   
         y += name.GetTotalHeight() * 2 + 4
         const info_pos = Create_widget_text(_, `p ${i}:0000000000`, [pos_orig[0]+size/2, pos_orig[1]+y, zpos++], _, COLOR, )
         info_pos.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ball.AddItem(info_pos);
         info_buffer[i].pos = info_pos;
   
         y += info_pos.GetTotalHeight() * 2 + 4
         const info_overlap = Create_widget_text(_, `overlap ${i}:00000`, [pos_orig[0]+size/2, pos_orig[1]+y, zpos++], _, COLOR, )
         info_overlap.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ball.AddItem(info_overlap);
         info_buffer[i].overlap = info_overlap;
   
         y += info_pos.GetTotalHeight() * 2 + 4
         const info_dir = Create_widget_text(_, `dir ${i}:0000000000`, [pos_orig[0]+size/2, pos_orig[1]+y, zpos++], _, COLOR, )
         info_dir.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ball.AddItem(info_dir);
         info_buffer[i].dir = info_dir;
   
         y += info_overlap.GetTotalHeight() * 2 + 4
         const info_pos_after = Create_widget_text(_, `p${i}:000000000000000`, [pos_orig[0]+size/2, pos_orig[1]+y, zpos++], _, COLOR, )
         info_pos_after.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         ball.AddItem(info_pos_after);
         info_buffer[i].pos_after = info_pos_after;
      }


      // Physics
      const velocity = [random_velocities[i], random_velocities[i + 1]];
      const mass = ball.geom.dim[0];
      const momentum = [velocity[0] * mass, velocity[1] * mass];
      const acceleration = [0, 0];
      // const speed = GetRandomInt(1, 1);
      const speed = 7.;
      physics[i] = {
         vel: velocity,
         mass: mass,
         mom: momentum,
         accel: acceleration,
         speed: speed,
      }
   }



   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   section.Render();
   Widget_root_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);


   total_height += panel_dim[1];
   // Animate_balls (section, balls_buffer, physics)



   const params = {
      section: section,
      balls_buffer: balls_buffer,
      physics: physics,
      info_buffer: info_buffer
   }

   TimeIntervalsCreate(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_balls, params);


   

   

   /**********************************************************************************************************************************************/
   // Info Panel
   let y = 0;
   for (let i = 0; i < 2; i++) {

      const ball = balls_buffer[i];
      const pos = [
         section.geom.pos[0] + section.geom.dim[0]*2 + pad + pad, 
         20+y, 
         0
      ];
      const info_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [5, 5], pos, [0, 0], GREY[1]);
      info_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
      info_section.SetName(`InfoUi-panel${i}`);

      y += 40
      // info_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


      const font_size = 0;
      const pad1 = [6, 1];
      const pad2 = [4, 0];
      const zpos = 1;
      const ms = 60;
      const COLOR = ball.mat.col;
      let generic_time_interval = INT_NULL;
      { // Info
         const nfo = Create_widget_multi_text(_, 'px:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, WHITE, .5, pad1);
         info_section.AddItem(nfo);

         nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
         nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, ()=>{return ball.geom.pos[0];}, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

         nfo.CreateNewText('py:', font_size, TRANSPARENCY(WHITE, 1), pad2, .9, );
         nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
         nfo.SetDynamicText(`ms${ms} -`, ms, ()=>{ return ball.geom.pos[1]; }, _, _, _); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      }
      { // Info
         const nfo = Create_widget_multi_text(_, 'vx:', ALIGN.HORIZONTAL, [0, 0, zpos + 1], font_size, TRANSPARENCY(WHITE, 1), .5, pad1);
         info_section.AddItem(nfo);

         nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
         nfo.SetDynamicText(`ms${ms} TEST_ball_velocity_with_trigonometrics`, ms, ()=>{return physics[i].vel[0];}, [PERFORMANCE_TIMER.BASE, 0], _, generic_time_interval); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];

         nfo.CreateNewText('vy:', font_size, TRANSPARENCY(WHITE, 1), pad2, .9, );
         nfo.CreateNewText('0000', font_size, COLOR, pad2, .9);
         nfo.SetDynamicText(`ms${ms} -`, ms, ()=>{ return physics[i].vel[1]; }, _, _, _); // idx param is for use in creating separate nfo for each widget dynamic text.
         generic_time_interval = nfo.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      }



      // Render
      info_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      info_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

      info_section.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT;
      info_section.Calc_no_gfx_update();

      info_section.Render();
      Widget_root_activate_all_vbs_in_renderqueue(info_section.root_bufferidx);

      info_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, info_section.gfx.vb.groupidx)


      Construct_listen_events_from_mesh_tree(info_section)
      Construct_listen_events_relations_from_mesh_tree(info_section);
   }
}




/****************************************************************************************************************/
// Create the ball's animation callback
function Animate_balls(params) {



   if(collision===true){
      STATE.loop.paused = true;
      collision=false
   }

   const section = params.params.section;

   const top_bound = 0;
   const bot_bound = section.geom.dim[1] * 2;
   const left_bound = 0;
   const right_bound = section.geom.dim[0] * 2;

   // console.log('')
   let overlap = 0;

   const len = params.params.balls_buffer.length;
   for (let i = 0; i < 1; i++) {

      const smoothness = 8;

      const phys1 = params.params.physics[0];
      const phys2 = params.params.physics[1];

      const ball = params.params.balls_buffer[i];
      const info_text1 = params.params.info_buffer[i];
      const info_text2 = params.params.info_buffer[1];



      // Cache the ball 1 and ball 2 center positions
      // const p1 = [
      //    (ball.geom.pos[0] + ball.geom.dim[0]) + ((phys1.vel[0] + phys1.accel[0]) * phys1.speed),
      //    (ball.geom.pos[1] + ball.geom.dim[1]) + ((phys1.vel[1] + phys1.accel[1]) * phys1.speed)
      // ];
      // const ball2 = params.params.balls_buffer[1];
      // const p2 = [
      //    (ball2.geom.pos[0] + ball2.geom.dim[0]) + ((phys2.vel[0] + phys2.accel[0]) * phys2.speed),
      //    (ball2.geom.pos[1] + ball2.geom.dim[1]) + ((phys2.vel[1] + phys2.accel[1]) * phys2.speed)
      // ];
      const p1 = [
         (ball.geom.pos[0] + ball.geom.dim[0]) ,
         (ball.geom.pos[1] + ball.geom.dim[1]) 
      ];
      const ball2 = params.params.balls_buffer[1];
      const p2 = [
         (ball2.geom.pos[0] + ball2.geom.dim[0]),
         (ball2.geom.pos[1] + ball2.geom.dim[1])
      ];
      const radii = (ball.geom.dim[0] + ball2.geom.dim[0]);

      
      // Calc the vector of the impact line and the magnitude of that vector...
      const impact_vector = [p1[0]-p2[0], p1[1]-p2[1]];
      const impact_mag = Magnitude(impact_vector[0], impact_vector[1]);
      
      // If the vector magnitude is less than the 2 radii of the balls, we have a collision
      if (impact_mag <= radii)  {

         // The overlap distance of the 2 balls, coinciding with the line of impact 
         overlap = (radii - impact_mag)/2;
         
         
         
         const dir1 = Normalize_vec2(p1[0], p1[1]);
         const dir2 = Normalize_vec2(p2[0], p2[1]);
         
         
         /****************************************************************************************/
         // Handle info text
         info_text1.pos.RenderTextFromString(`p:x${Floor(p1[0])}y${Floor(p1[1])}`);
         info_text1.overlap.RenderTextFromString(`overlap:${overlap.toFixed(2)}`);
         info_text1.dir.RenderTextFromString(`dir:x${dir1[0].toFixed(2)}y${dir1[1].toFixed(2)}`);
         
         info_text2.pos.RenderTextFromString(`p:x${Floor(p2[0])}y${Floor(p2[1])}`);
         info_text2.overlap.RenderTextFromString(`overlap:${overlap.toFixed(2)}`);
         info_text2.dir.RenderTextFromString(`dir:x${dir2[0].toFixed(2)}y${dir2[1].toFixed(2)}`);
         
         // console.log(overlap)
         
         // Correct the distance to be equal to the two radii so the balls do not overlap
         // p1[0] += overlap*dir1[0];
         // p2[0] -= overlap*dir2[0];
         // p1[1] += overlap*dir1[1];
         // p2[1] -= overlap*dir2[1];
         // p1[0] += overlap;
         // p2[0] -= overlap;
         // p1[1] += overlap;
         // p2[1] -= overlap;
         
         /****************************************************************************************/
         // Handle info text
         // render the position after the overlap has been added
         info_text1.pos_after.RenderTextFromString(`p1after:x${Floor(p1[0])}y${Floor(p1[1])}`);
         info_text2.pos_after.RenderTextFromString(`p2after:x${Floor(p2[0])}y${Floor(p2[1])}`);

         
         // STATE.loop.paused = true;
         // collision = true;

         // Cache the cuuurrent velocity vectors of the 2 balls to be compared
         // Caution! Must copy the values 
         const velx1 = phys1.vel[0], vely1 = phys1.vel[1];
         const velx2 = phys2.vel[0], vely2 = phys2.vel[1];


         /**
          * Math equation for elastic collisions
          * u1` = u1+ ( ( (u2-u1) DOT (x2-x1) ) / (|x2-x1|)^2 ) * (x2-x1)
          * x:vector position, |x2-x1|)^2 : the magnitude of the resulted vector
          */
         
         // Get the distance vector of the 2 balls
         // Must check for equal positions, and set to small value, to avoid devide by 0)
         const dx = (p2[0] === p1[0]) ? .0001 : (p2[0] - p1[0]);
         const dy = (p2[1] === p1[1]) ? .0001 : (p2[1] - p1[1]);
         const mag = Magnitude_2vectors(p2, p1)
         { // Ball 1: velocity calculation
            const dot_product = Dot(velx2-velx1, vely2-vely1, dx, dy);
            phys1.vel[0] = velx1 +  (( dot_product / (mag*mag) ) * dx); 
            phys1.vel[1] = vely1 +  (( dot_product / (mag*mag) ) * dy);
            
         }
         { // Ball 2: velocity calculation
            const dot_product = Dot(velx1-velx2, vely1-vely2, -dx, -dy);
            phys2.vel[0] = velx2 +  (( dot_product / (mag*mag) ) * -dx); 
            phys2.vel[1] = vely2 +  (( dot_product / (mag*mag) ) * -dy);
         }


      }

   }

   // TODO: Combine the 2 for loops
   for (let i = 0; i < len; i++) {


      const ball = params.params.balls_buffer[i];
      const phys1 = params.params.physics[i];

      // Move the ball
      const x = (phys1.vel[0] + phys1.accel[0]) * phys1.speed;
      const y = (phys1.vel[1] + phys1.accel[1]) * phys1.speed;
      // const x = phys1.mass * (phys1.vel[0] + phys1.accel[0]) * phys1.speed * .1 + overlap;
      // const y = phys1.mass * (phys1.vel[1] + phys1.accel[1]) * phys1.speed * .1 + overlap;

      ball.geom.AddWposXY(ball.gfx, x, y);
      ball.geom.pos[0] += x;
      ball.geom.pos[1] += y;

      // ball.Move(x, y); // Move ball with any children text info 

      // Check boundaries
      const ball_radius = ball.geom.dim[0];
      const ball_top = ball.geom.pos[1] + y;
      const ball_bot = ball.geom.pos[1] + ball_radius * 2 + y;
      const ball_left = ball.geom.pos[0] + x;
      const ball_right = ball.geom.pos[0] + ball_radius * 2 + x;


      if (ball_bot > bot_bound) phys1.vel[1] *= -1;
      else if (ball_top < top_bound) phys1.vel[1] *= -1;
      if (ball_right > right_bound) phys1.vel[0] *= -1;
      else if (ball_left < left_bound) phys1.vel[0] *= -1;

   }


}

