import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Android_deactivate_scrolling, MouseGetPosDifX } from "../../../../Engine/Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../../../../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { GREENL, GREY, Interpolate_rgb_to_01, ORANGEL, ORANGER, PURPLEB, PURPLER, WHITE, YELLOWL, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_calc_pos_dif } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { GlRotateZ2D } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomPos } from "../../../../Helpers/Helpers.js";
import { Slope_function_logarithmic } from "../../../../Helpers/Math/MathFunction.js";
import { Abs, Magnitude } from "../../../../Helpers/Math/MathOperations.js";






// TODO: Make the head another color
// TODO: Create animation for the collectible
// TODO: Create glow effect for the snake. ?When and Where?
// TODO:
// TODO: Create a better panel for user input
// TODO:
// TODO: Pass the snake through another shader for glow
// TODO: Also on scale the glow effect should intensify







var slope_constant1 = 1;




class Body_mesh_properties {

   constructor(_mesh = null){

      this.mesh = _mesh;
      this.idx = INT_NULL;
      this.size = 25;
      // A modifier for the calculation of the slope function that controls the next position of a snake body mesh
      this.t = 0; // Values = [0-1]
      // this.slope = 0;// Stores the current calculated 't' to be used on the next snake 'Move' calculation. 
      this.slope = Slope_function_logarithmic(this.t, slope_constant1) +1;// Stores the current calculated 't' to be used on the next snake 'Move' calculation. 
      this.max_scale_factor = 1.9; // Max scale will be = 'max_scale_factor' times bigger to the original size
      this.glow_scale_down_factor =  .5; // The regular rendered body mesh will be = 'glow_scale_down_factor' times bigger/smaller to the body glow effect 
      this.body_meshes_dist_mod =  3.5; // A modifier to control the distance between the snake body meshes
      this.border = 0;
      this.roundness = 0;
      this.feather = 0;
   }
}

const snake = {
   count:0, // Number of snake body meshes
   size:25, // Size of the snake body meshes
   style: [0, 25, 2],
   max_scale_factor:1.9, // Max scale will be: 'max_scale_factor' times bigger to the original size
   glow_scale_down_factor: .5, // The regular rendered body mesh will be: 'glow_scale_down_factor' times bigger/smaller to the body glow effect 
   body_meshes_dist_mod: 3.5, // A modifier to control the distance between the snake body meshes
   in_scale_animation: false,
   first_body_mesh_idx: INT_NULL, // The index of the snake head mesh 

   // rot_amt:0,
   rotation: { // This variable is to store the ammount of users input mouse, so that user can rotate the head mesh 
      amt:0.0,
   },
   
   
   step:0.007, // The step that the 'Move' function will use to advance the body meshes to the next position
   body:New_generic_buffer(_, 'Game Snake Body Meshes'), // Where all snake's body meshes variables will be stored
};

const snake_initial_body_count = 6;
// function Init_snake_body_meshes(){
//    for(let i=0; i<snake_initial_body_count; i++){
//       snake.body.Add(body_mesh_properties);
//    }
//    snake.count = snake.body.boundary;
// }







/**************************************************************************************************************************************************************/
// 


export function Game_snake() {



   // Init_snake_body_meshes();
   
   const style = [10, snake.size, 3];
   let board_width = VIEWPORT.WIDTH/2;
   let board_height = (VIEWPORT.HEIGHT/2);

   // TODO: If android: deactivate scrolling
   if(PLATFORM.ANY_SMARTPHONE_DEVICE) {
      Android_deactivate_scrolling();
      board_width - DEVICE.info.canvas_left + DEVICE.info.canvas_right;
      board_height - DEVICE.info.canvas_top + DEVICE.info.canvas_bot;
   }

   const board_color = Interpolate_rgb_to_01(16, 28, 35);
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [0, 0, 0], [board_width,board_height], board_color, 'section', style);
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   section.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   
   section.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   section.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);



   const physics = [];






   /*************************************************************************************************/
   // Create the Collectible mesh

   const collectabel_size = snake.size*1.4;
   const rand_pos = GetRandomPos([20, 20], [section.geom.dim[0]-20, section.geom.dim[1]-20]);
   const collectible = Create_widget_section(_, _, [0,0], [rand_pos[0], rand_pos[1], 0], [collectabel_size,collectabel_size], PURPLEB[9], 'section', [0, collectabel_size, 6]);
   collectible.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   collectible.SetName('collectible');
   section.AddItem(collectible); 

   collectible.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   collectible.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);


   



   /*************************************************************************************************/
   // Create the snake head's nose mesh (Shows the direction of the snke)
   const nose = Create_rect_mesh(_, _, [4, 10], TRANSPARENCY(PURPLER[9], .2));
   nose.SetName('Nose');
   section.AddItem(nose);
   
   nose.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // nose.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
   // nose.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   // nose.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);



   


   /*************************************************************************************************/
   // Create snake body meshes

   const speed = 1.5;
   let next_posx = board_width/2;
   
   for(let i=0; i < snake_initial_body_count; i++){
      
      const body_mesh = Create_widget_section(_, _, [0,0], [next_posx, 20, 1], [snake.size,snake.size], TRANSPARENCY(ORANGER[9], 1.), 'body_mesh', snake.style);
      body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      const body_idx = section.AddItem(body_mesh);
      
      
      body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      
      // Store the index of the first body mesh
      // if(snake.first_body_mesh_idx === INT_NULL) snake.first_body_mesh_idx = body_idx;
      
      
      const idx = snake.body.Add(new Body_mesh_properties(body_mesh));
      snake.body.buffer[idx].idx = idx; // Store the index for convinience
      snake.count++;
      if(idx !== i) alert('514332139908', 'snake body mesh should index mismatch');
      
      // Name each body according to its index 
      body_mesh.SetName('body_mesh'+idx);
      // console.log(snake.body.buffer[idx].mesh.GetName())

      // Physics
      const velocity = [.5, .2]; 
      const mass = body_mesh.geom.dim[0]; 
      const momentum = [velocity[0]*mass, velocity[1] * mass];
      const acceleration = [0, 0];

      physics[i] = {
         vel:velocity,
         mass:mass,
         mom: momentum,
         accel: acceleration,
         speed:speed,
      }

      // next_posx -= snake.size*2 + style[2] * snake.body_meshes_dist_mod;
      next_posx -= snake.size;

   }

  





   /*************************************************************************************************/
   // Implement mouse controls directly to the section panel
   
   section.Bind(
      (params)=>{ // Click callback

         // if(snake.in_scale_animation) return;

         const phys = params.params.target_params.phys;


         const mouse_xdif = MouseGetPosDifX();
         if(Abs(mouse_xdif) > .5) {

            
            /*******************************************************************************************/
            // Satelite Rotation. Just add the ammount of mouse move on the x axis
            
            const mod = .02;

            params.params.target_params.rot.amt += mouse_xdif*mod;
            phys.vel[0] = Math.sin(params.params.target_params.rot.amt);
            phys.vel[1] = Math.cos(params.params.target_params.rot.amt);
            // console.log('mouse_xdif', mouse_xdif, 'amt', params.params.target_params.amt);
         }
            
      }, 
      _, 
      {target_params: {head:snake.body.buffer[0].mesh, nose:nose, phys: physics[0], rot: snake.rotation, } }, 
      // {nose: nose, phys: physics[0], }, 
      MESH_STATE.IS_HOLD_CLICK
   );
   


   
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();
   // section.options = SECTION.INHERIT|SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
   section.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);


   // section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   section.GfxUniformsSetClbk('u_scale2', function () { return [snake.glow_scale_down_factor, 1] }, section.gfx.vb.groupidx);
   
   const clbk_params_0 = { vb_grouidx: section.gfx.vb.groupidx, val_idx: 0, start_val: .0, }
   section.SetClbkGfxUniforms('u_glow_params', ()=>{return .3}, clbk_params_0);
   const clbk_params_1 = { vb_grouidx: section.gfx.vb.groupidx, val_idx: 2, start_val: .0, }
   section.SetClbkGfxUniforms('u_glow_params', ()=>{return .5}, clbk_params_1);





   /*************************************************************************************************/
   // Satelite Controls
   
   let total_height = VIEWPORT.HEIGHT/2 - 30;
   const pad = 0;
   const panel_height = 150;
   
   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4,4], [0+pad, 0+total_height*2, 0], [0, 0], GREY[1]);
   // if(!PLATFORM.ANY_SMARTPHONE_DEVICE) controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.SetName('Sattelite_rotation->controls_section');
   controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   





   /*************************************************************************************************/
   // Create move for body meshes
   const params = {
      section: section,
      physics: physics,
      collectible:collectible,
      nose:nose,
      rot:snake.rotation,
      controls_section:controls_section,
   }
   
   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_snake, params);
   

   


   // Debug_info_ui_static();
      
}

function Animate_snake(params) {

   if(snake.in_scale_animation) return;

   const section = params.params.section;
   
   const head = snake.body.buffer[0].mesh;
   const phys = params.params.physics[0];
   const nose = params.params.nose;
   const collectible = params.params.collectible;
   const controls_section = params.params.controls_section;
   
   
   // Calculate move velocity
   const x = phys.mass * (phys.vel[0] + phys.accel[0]) * phys.speed * .1;
   const y = phys.mass * (phys.vel[1] + phys.accel[1]) * phys.speed * .1;
   
   



   /*******************************************************************************************/
   // Check panel boundary collision
   let hit = false;
   const top_bound = 0;
   const bot_bound = section.geom.dim[1] * 2;
   const left_bound = 0;
   const right_bound = section.geom.dim[0] * 2;
   
   // Check boundaries
   const ball_radius = head.geom.dim[0];
   const ball_top = head.geom.pos[1] + y;
   const ball_bot = head.geom.pos[1] + ball_radius * 2 + y;
   const ball_left = head.geom.pos[0] + x;
   const ball_right = head.geom.pos[0] + ball_radius * 2 + x;

   
   if (ball_bot > bot_bound) {
      phys.vel[1] *= -1; // Reverse velocity
      // head.geom.pos[1] = bot_bound-ball_radius*2; // Puut back inside the panel area
      hit=true;
   }
   else if (ball_top < top_bound) {
      phys.vel[1] *= -1;
      // head.geom.pos[1] = 0;
      hit=true;
   }
   if (ball_right > right_bound) {
      phys.vel[0] *= -1;
      // Calculate the correct position from the wall
      const b_dist = right_bound - (head.geom.pos[0] + ball_radius * 2);
      head.geom.pos[0] =  right_bound - ((x - b_dist) + ball_radius*2);
      head.geom.UpdateSetWposX(head.gfx);
      hit=true;
      // console.log(i, x, b_dist, x-b_dist, head.geom.pos[0])
   }
   else if (ball_left < left_bound) {
      phys.vel[0] *= -1;
      
      // Calculate the correct position from the wall
      const b_dist = left_bound + head.geom.pos[0];
      head.geom.pos[0] =  left_bound + (Abs(x) - b_dist);
      head.geom.UpdateSetWposX(head.gfx);
      // head.geom.pos[0] = 0;
      hit=true;
   }
   else {
   
      head.geom.pos[0] += x;
      head.geom.pos[1] += y;
      head.geom.AddWposXY(head.gfx, x, y);
   }


   
   /*******************************************************************************************/
   // Check collision with collectible

   const dif = Mesh_calc_pos_dif(collectible, head)
   const dist1 = Magnitude(dif[0], dif[1]);
   // console.log('dist1', dist1, 'dif', dif)
   
   // On collect
   if(dist1 < collectible.geom.dim[0]+head.geom.dim[0] ){
      
      // Create new collectible in another random position
      const rand_pos = GetRandomPos([20, 20], [section.geom.dim[0]*2-20, section.geom.dim[1]*2-20]);
      collectible.SetWposXY(rand_pos)

      // Create scale animation
      const params2 = {
         section:section,
         body_mesh_idx:0,
         slope_constant1:1.,
         physics: params.params.physics,
      };
   
      Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);



      // TODO: Increment score

   }


   
   /*******************************************************************************************/
   // Move snake

   const body = snake.body.buffer[1].mesh;
   // const style = head.mat.style[1]/2;
   const style = snake.body.buffer[1].size/2;

   // const axis = [
   //    (head.GetPosX()) - (body.GetPosX()),
   //    (head.GetPosY()) - (body.GetPosY()),
   // ];
   const axis = [
      head.geom.pos[0] - body.geom.pos[0],
      head.geom.pos[1] - body.geom.pos[1],
   ];

   const dist = Magnitude(axis[0], axis[1]) + style * snake.body_meshes_dist_mod //(1+glow_scale_down_factor*2);
   

   // Move the ball
   if(dist > head.geom.dim[0]*2 ){
      
      let prev_mesh = head;
      
      for(let i=1; i <= snake.body.boundary; i++){
         
         const body_mesh = snake.body.buffer[i].mesh;

         const axis2 = [
            prev_mesh.geom.pos[0] - body_mesh.geom.pos[0],
            prev_mesh.geom.pos[1] - body_mesh.geom.pos[1],
         ];

         const dist2 = Magnitude(axis2[0], axis2[1]) + style * snake.body_meshes_dist_mod //(1+glow_scale_down_factor*2);
         
         /** Body Follows head with almost in stantly */
         const n2 = [
            axis2[0] / dist2,
            axis2[1] / dist2,
         ];
         
         const delta2 = dist2 - snake.size*2;
         const xx2 = n2[0] * delta2;
         const yy2 = n2[1] * delta2;
         
         
         // if(dist2 > prev_mesh.geom.dim[0]*2 )
            {
            
            body_mesh.geom.pos[0] += xx2;
            body_mesh.geom.pos[1] += yy2;
            body_mesh.geom.AddWposXY(body_mesh.gfx, xx2, yy2);
            
         }

         prev_mesh = body_mesh;
      }
   }



   

   
   /*******************************************************************************************/
   // Satelite move

   const angle = Math.atan2(x, y); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
   GlRotateZ2D(nose.gfx, nose.geom.dim, angle, 1);
   /* Use for rendering sattelite with GFX.ATTR_STYLE */
   // const cx = nose.geom.pos[0] - nose.geom.dim[0] 
   // const cy = nose.geom.pos[1] - nose.geom.dim[1]
   /* Use for rendering sattelite without GFX.ATTR_STYLE */
   const cx = nose.geom.pos[0]; // Center to sattelites position
   const cy = nose.geom.pos[1] 
   const r = head.geom.dim[0] + nose.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
   const a = (cx + (r * Math.sin(angle))); // The rotation is the tangent of the outer head's perimeter 
   const b = (cy + (r * Math.cos(angle)));
   
   nose.geom.SetWposXY(nose.gfx, head.geom.pos[0]+head.geom.dim[0], head.geom.pos[1]+head.geom.dim[1]);
   nose.geom.AddWposXY(nose.gfx, a, b);

   // Update the rotation ammount from the user input
   params.params.rot.amt = angle;

}

function Animation_scale_up_run(params){

   snake.in_scale_animation = true;

   const section = params.section;
   const bodyidx = params.body_mesh_idx;

   if(bodyidx >= snake.body.active_count) return false;
   
   
   const body_mesh = snake.body.buffer[bodyidx].mesh;
   
   
   // const modifier =  (1 / count) * bodyidx;
   const min = 0.25; 
   const max = 1.0; 
   
   let mod = 0;

   // if(bodyidx < 6){
   //    mod = bodyidx/6;
   //    // mod = bodyidx/(6*(count-bodyidx));
   //    // mod = bodyidx/(30-count);
   //    // console.log(bodyidx, slope_constant1-mod)
   // }
   // else {

   //    const z = 0.025 * snake.count * .2 * bodyidx;
   
   //    mod = (z) < max 
   //          ? ( (z < min) ? 0 : z ) 
   //          : max-min;

   //    // console.log(bodyidx, z, slope_constant1-mod)
   // }
   
   // Update snake body meshes scale
   snake.body.buffer[bodyidx].t += snake.step;
   const slope = Slope_function_logarithmic(snake.body.buffer[bodyidx].t, slope_constant1-mod) +1;
   
   // Find the difference from the previous slope and the current
   const res = (slope - snake.body.buffer[bodyidx].slope)*100
   
   snake.body.buffer[bodyidx].slope = slope;
   
   body_mesh.geom.dim[0] += res*2;
   body_mesh.geom.dim[1] += res*2;
   body_mesh.geom.AddDimXY(body_mesh.gfx, res, res);
   // Also move the body meshes because the coordinate system is the top-left of the mesh
   body_mesh.geom.pos[0] += -res;
   body_mesh.geom.pos[1] += -res;
   body_mesh.geom.AddWposXY(body_mesh.gfx, -res, -res);


   // While the scaled mesh is less than the max scaled constant, continue scaling
   // if(body_mesh.geom.dim[0] < snake.size * snake.max_scale_factor && res > 1) return true;
   if(body_mesh.geom.dim[0] < snake.size * snake.max_scale_factor) return true;
   else { // Else scale max reached, return false to continue with the scale down
      if(bodyidx + 1 < snake.count){

         // Create scale up for the next body mesh
         const params2 = {
            section:section,
            body_mesh_idx:params.body_mesh_idx + 1,
            physics: params.physics,
         };
            
         if(bodyidx <= snake.body.boundary){
            Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
         }
      }
      

      return false;
   }

}

function Animation_scale_up_stop(params){
   
   setTimeout(
      ()=>{ Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); },
      100, 
   );

   snake.body.buffer[params.body_mesh_idx].t = 0.0;
   snake.body.buffer[params.body_mesh_idx].slope = Slope_function_logarithmic(0.0, slope_constant1) +1;

   return false;
}

function Animation_scale_down_run(params){
   
   const bodyidx = params.body_mesh_idx;

   // if(bodyidx >= snake.body.active_count) 
   //    return false;

   const body_mesh = snake.body.buffer[params.body_mesh_idx].mesh;

   
   const mod =  0;
   // Update 
   snake.body.buffer[bodyidx].t += snake.step;
   const slope = Slope_function_logarithmic(snake.body.buffer[bodyidx].t, slope_constant1-mod) +1;
   
   
   const res = (slope - snake.body.buffer[bodyidx].slope)*100
   
   snake.body.buffer[bodyidx].slope = slope;

   // Run scale down function until the snake body reaches the default size
   // if(body_mesh.geom.dim[0]- res*2 > snake.size &&  res > .01) {
   if(body_mesh.geom.dim[0]- res*2 > snake.size ) {
      
      body_mesh.geom.dim[0] -= res*2;
      body_mesh.geom.dim[1] -= res*2;
      body_mesh.geom.AddDimXY(body_mesh.gfx, -res, -res);
      body_mesh.geom.pos[0] += res;
      body_mesh.geom.pos[1] += res;
      body_mesh.geom.AddWposXY(body_mesh.gfx, res, res);
      
      return true;
   }
   
   else {

      // Avoid smaller than snake.size body meshes
      body_mesh.geom.dim[0] = snake.size;
      body_mesh.geom.dim[1] = snake.size;
      body_mesh.geom.SetDimXY(body_mesh.gfx, snake.size, snake.size);

      // console.log('Scale down CORRECTION')

      return false;
   }
}

function Animation_scale_down_stop(params){

   // console.log(params.body_mesh_idx, snake.body.boundary)
   if(params.body_mesh_idx === snake.body.boundary) {

      const section = params.section;

      // const last_elem_idx = section.children.boundary - first_body_mesh_idx;
      const last_elem_idx = snake.body.boundary;
      const last_mesh = snake.body.buffer[last_elem_idx].mesh;
      

      // Calc the axis vector of the 2 last body meshes, and set the position of the new body mesh to that axis
      const second_last_mesh = snake.body.buffer[last_elem_idx-1].mesh;
      const axis = [
         // last_mesh.GetPosX() + snake.size - second_last_mesh.GetPosX() + snake.size,
         // last_mesh.GetPosY() + snake.size - second_last_mesh.GetPosY() + snake.size,
         last_mesh.geom.pos[0] - snake.size - second_last_mesh.geom.pos[0] + snake.size,
         last_mesh.geom.pos[1] - snake.size - second_last_mesh.geom.pos[1] + snake.size,
      ];
   
      const style = snake.body.buffer[last_elem_idx].size/2;
      const posx = last_mesh.geom.pos[0] + axis[0];
      const posy = last_mesh.geom.pos[1] + axis[1];



      const body_mesh = Create_widget_section(_, _, [0,0], [posx, posy, 1], [snake.size, snake.size], TRANSPARENCY(YELLOWR[9], 1.), 'body_mesh', snake.style);
      body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      const body_idx = section.AddItem(body_mesh);
      body_mesh.SetName('body_mesh' + body_idx);


      body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

      body_mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_mesh.gfx.vb.groupidx);
      body_mesh.Render();

      /***************************************************************************************************/
      // Physics
      const phys_last_elem_idx = last_elem_idx;
      const velocity = [params.physics[phys_last_elem_idx].vel[0], params.physics[phys_last_elem_idx].vel[1]]; 
      const mass = body_mesh.geom.dim[0]; 
      const momentum = [velocity[0]*mass, velocity[1] * mass];
      const acceleration = [0, 0];
      const speed = 5.5;

      const physics = {
         vel:velocity,
         mass:mass,
         mom: momentum,
         accel: acceleration,
         speed:speed,
      }


      const idx = snake.body.Add(new Body_mesh_properties(body_mesh));
      snake.body.buffer[idx].idx = idx; // Store the index for convinience
      snake.count++;
      
      params.physics.push(physics);

      snake.in_scale_animation = false;
   }
   
   // if(params.body_mesh_idx === snake.body.boundary-1) snake.in_scale_animation = false;

   const bodyidx = params.body_mesh_idx;
   snake.body.buffer[bodyidx].t = 0.0;
   snake.body.buffer[bodyidx].slope = Slope_function_logarithmic(snake.body.buffer[bodyidx].t, slope_constant1) +1;
   
   // return false;

}




















// /****************************************************************************************************************************************************************************/
// // SAVE:Old Implementation 
// let body_count = 6;
// const t = [];
// const step = 0.007;
// const size = 25;
// const scale = 1.9;

// const body_mesh_style = [0, size, 2];
// const glow_scale_down = .5;
// const body_meshes_dist_mod = 3.5; 

// let in_scale_animation = false;
// let first_body_mesh_idx = INT_NULL;

// const rotation = { // This variable is to store the ammount of users input mouse, so that user can rotate the head mesh 
//    amt:0.0,
// };

// function Init_t(){
//    for(let i=0; i<snake_initial_body_count; i++){
//       t[i] = 0;
//    }
// }




// /**************************************************************************************************************************************************************/
// // 

// var slope_constant1 = 1;

// export function Game_snake() {



//    Init_t();
   
//    const style = [10, size, 3];
//    let board_width = VIEWPORT.WIDTH/2;
//    let board_height = (VIEWPORT.HEIGHT/2);

//    // TODO: If android: deactivate scrolling
//    if(PLATFORM.ANY_SMARTPHONE_DEVICE) {
//       Android_deactivate_scrolling();
//       board_width - DEVICE.info.canvas_left + DEVICE.info.canvas_right;
//       board_height - DEVICE.info.canvas_top + DEVICE.info.canvas_bot;
//    }

//    const board_color = Interpolate_rgb_to_01(16, 28, 35);
//    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [0, 0, 0], [board_width,board_height], board_color, 'section', style);
//    // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
//    section.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   
//    section.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//    section.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);



//    const physics = [];






//    /*************************************************************************************************/
//    // Create the Collectible mesh

//    const collectabel_size = size*1.4;
//    const rand_pos = GetRandomPos([20, 20], [section.geom.dim[0]-20, section.geom.dim[1]-20]);
//    const collectible = Create_widget_section(_, _, [0,0], [rand_pos[0], rand_pos[1], 0], [collectabel_size,collectabel_size], PURPLEB[9], 'section', [0, collectabel_size, 6]);
//    collectible.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    collectible.SetName('collectible');
//    section.AddItem(collectible); 

//    collectible.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//    collectible.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);


   



//    /*************************************************************************************************/
//    // Create the snake head's nose mesh (Shows the direction of the snke)
//    const nose = Create_rect_mesh(_, _, [4, 10], TRANSPARENCY(PURPLER[9], .2));
//    nose.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    nose.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
//    section.AddItem(nose);


//    nose.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//    nose.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);



   


//    /*************************************************************************************************/
//    // Create snake body meshes

//    const speed = 1.5;
//    let next_posx = board_width/2;
   
//    for(let i=0; i < body_count; i++){
      
//       const body_mesh = Create_widget_section(_, _, [0,0], [next_posx, 20, 1], [size,size], TRANSPARENCY(ORANGER[9], 1.), 'body_mesh', body_mesh_style);
//       body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       const body_idx = section.AddItem(body_mesh);
//       body_mesh.SetName('body_mesh'+body_idx);

      
//       body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//       body_mesh.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      
//       // Store the index of the first body mesh
//       if(first_body_mesh_idx === INT_NULL) first_body_mesh_idx = body_idx;


//       // Physics
//       const velocity = [.5, .2]; 
//       const mass = body_mesh.geom.dim[0]; 
//       const momentum = [velocity[0]*mass, velocity[1] * mass];
//       const acceleration = [0, 0];

//       physics[i] = {
//          vel:velocity,
//          mass:mass,
//          mom: momentum,
//          accel: acceleration,
//          speed:speed,
//       }

//       next_posx -= size*2 + style[2]*body_meshes_dist_mod;

//    }

  





//    /*************************************************************************************************/
//    // Implement mouse controls directly to the section panel
   
//    section.Bind(
//       (params)=>{ // Click callback

//          if(in_scale_animation) return;

//          const phys = params.params.target_params.phys;


//          const mouse_xdif = MouseGetPosDifX();
//          if(Abs(mouse_xdif) > .5) {

            
//             /*******************************************************************************************/
//             // Satelite Rotation. Just add the ammount of mouse move on the x axis
            
//             const mod = .02;

//             params.params.target_params.rot.amt += mouse_xdif*mod;
//             phys.vel[0] = Math.sin(params.params.target_params.rot.amt);
//             phys.vel[1] = Math.cos(params.params.target_params.rot.amt);
//             // console.log('mouse_xdif', mouse_xdif, 'amt', params.params.target_params.amt);
//          }
            
//       }, 
//       _, 
//       {target_params: {head:section.children.buffer[first_body_mesh_idx], nose:nose, phys: physics[0], rot: rotation, } }, 
//       // {nose: nose, phys: physics[0], }, 
//       MESH_STATE.IS_HOLD_CLICK
//    );
   


   
//    section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
//    section.GenGfxCtx();
//    // section.options = SECTION.INHERIT|SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
//    section.Render();
   
   
//    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
//    Construct_listen_events_from_mesh_tree(section);
//    Construct_listen_events_relations_from_mesh_tree(section);
//    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);


//    // section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
//    section.GfxUniformsSetClbk('u_scale2', function () { return [glow_scale_down, 1] }, section.gfx.vb.groupidx);
   
//    const clbk_params_0 = { vb_grouidx: section.gfx.vb.groupidx, val_idx: 0, start_val: .0, }
//    section.SetClbkGfxUniforms('u_glow_params', ()=>{return .3}, clbk_params_0);
//    const clbk_params_1 = { vb_grouidx: section.gfx.vb.groupidx, val_idx: 2, start_val: .0, }
//    section.SetClbkGfxUniforms('u_glow_params', ()=>{return .5}, clbk_params_1);





//    /*************************************************************************************************/
//    // Satelite Controls
   
//    let total_height = VIEWPORT.HEIGHT/2 - 30;
//    const pad = 0;
//    const panel_height = 150;
   
//    const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4,4], [0+pad, 0+total_height*2, 0], [0, 0], GREY[1]);
//    // if(!PLATFORM.ANY_SMARTPHONE_DEVICE) controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//    controls_section.SetName('Sattelite_rotation->controls_section');
//    controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
//    const flags = {
//       unif: SID.UNIF.ROOT_WPOS2,
//       pass: SID.PASS.WPOS2,
//    };

   
   





//    /*************************************************************************************************/
//    // Create move for body meshes
//    const params = {
//       section: section,
//       physics: physics,
//       collectible:collectible,
//       nose:nose,
//       rot:rotation,
//       controls_section:controls_section,
//    }
   
//    Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_snake, params);
   

   


//    // Debug_info_ui_static();
      
// }




// function Animate_snake(params) {

//    if(in_scale_animation) return;

//    const section = params.params.section;
   
//    const head = section.children.buffer[first_body_mesh_idx];
//    const phys = params.params.physics[0];
//    const nose = params.params.nose;
//    const collectible = params.params.collectible;
//    const controls_section = params.params.controls_section;
   
   
//    // Calculate move velocity
//    const x = phys.mass * (phys.vel[0] + phys.accel[0]) * phys.speed * .1;
//    const y = phys.mass * (phys.vel[1] + phys.accel[1]) * phys.speed * .1;
   
   



//    /*******************************************************************************************/
//    // Check panel boundary collision
//    let hit = false;
//    const top_bound = 0;
//    const bot_bound = section.geom.dim[1] * 2;
//    const left_bound = 0;
//    const right_bound = section.geom.dim[0] * 2;
   
//    // Check boundaries
//    const ball_radius = head.geom.dim[0];
//    const ball_top = head.geom.pos[1] + y;
//    const ball_bot = head.geom.pos[1] + ball_radius * 2 + y;
//    const ball_left = head.geom.pos[0] + x;
//    const ball_right = head.geom.pos[0] + ball_radius * 2 + x;

   
//    if (ball_bot > bot_bound) {
//       phys.vel[1] *= -1; // Reverse velocity
//       // head.geom.pos[1] = bot_bound-ball_radius*2; // Puut back inside the panel area
//       hit=true;
//    }
//    else if (ball_top < top_bound) {
//       phys.vel[1] *= -1;
//       // head.geom.pos[1] = 0;
//       hit=true;
//    }
//    if (ball_right > right_bound) {
//       phys.vel[0] *= -1;
//       // Calculate the correct position from the wall
//       const b_dist = right_bound - (head.geom.pos[0] + ball_radius * 2);
//       head.geom.pos[0] =  right_bound - ((x - b_dist) + ball_radius*2);
//       head.geom.UpdateSetWposX(head.gfx);
//       hit=true;
//       // console.log(i, x, b_dist, x-b_dist, head.geom.pos[0])
//    }
//    else if (ball_left < left_bound) {
//       phys.vel[0] *= -1;
      
//       // Calculate the correct position from the wall
//       const b_dist = left_bound + head.geom.pos[0];
//       head.geom.pos[0] =  left_bound + (Abs(x) - b_dist);
//       head.geom.UpdateSetWposX(head.gfx);
//       // head.geom.pos[0] = 0;
//       hit=true;
//    }
//    else {
   
//       head.geom.pos[0] += x;
//       head.geom.pos[1] += y;
//       head.geom.AddWposXY(head.gfx, x, y);
//    }


   
//    /*******************************************************************************************/
//    // Check collision with collectible

//    const dif = Mesh_calc_pos_dif(collectible, head)
//    const dist1 = Magnitude(dif[0], dif[1]);
//    // console.log('dist1', dist1, 'dif', dif)
   
//    // On collect
//    if(dist1 < collectible.geom.dim[0]+head.geom.dim[0] ){
      
//       // Create new collectible in another random position
//       const rand_pos = GetRandomPos([20, 20], [section.geom.dim[0]*2-20, section.geom.dim[1]*2-20]);
//       collectible.SetWposXY(rand_pos)

//       // Create scale animation
//       const params2 = {
//          section:section,
//          body_mesh_idx:first_body_mesh_idx,
//          slope_constant1:1.,
//          physics: params.params.physics,
//       };
   
//       Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);


//       // TODO: Add a body to the snake

//       // TODO: Increment score

//    }


   
//    /*******************************************************************************************/
//    // Move Body

//    const body = section.children.buffer[first_body_mesh_idx+1];

//    const style = head.mat.style[1]/2;

//    const axis = [
//       (head.GetPosX()) - (body.GetPosX()),
//       (head.GetPosY()) - (body.GetPosY()),
//    ];

//    const dist = Magnitude(axis[0], axis[1]) + style * body_meshes_dist_mod //(1+glow_scale_down*2);
   
//    // Move the ball
//    if(dist > head.geom.dim[0]*2 ){
      
//       let prev_mesh = head;
      
//       for(let i=first_body_mesh_idx; i <= section.children.boundary; i++){
         
//          const body_mesh = section.children.buffer[i];

//          const axis2 = [
//             (prev_mesh.GetPosX()) - (body_mesh.GetPosX()),
//             (prev_mesh.GetPosY()) - (body_mesh.GetPosY()) 
//          ];

//          const dist2 = Magnitude(axis2[0], axis2[1]) + style * body_meshes_dist_mod //(1+glow_scale_down*2);
         
//          /** Body Follows head with almost in stantly */
//          const n2 = [
//             axis2[0] / dist2,
//             axis2[1] / dist2,
//          ];
         
//          const delta2 = dist2 - size*2;
//          const xx2 = n2[0] * delta2;
//          const yy2 = n2[1] * delta2;
         
         
//          if(dist2 > prev_mesh.geom.dim[0]*2 ){
            
//             body_mesh.geom.pos[0] += xx2;
//             body_mesh.geom.pos[1] += yy2;
//             body_mesh.geom.AddWposXY(body_mesh.gfx, xx2, yy2);
            
//          }

//          prev_mesh = body_mesh;
//       }
//    }



   

   
//    /*******************************************************************************************/
//    // Satelite move

//    const angle = Math.atan2(x, y); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
//    GlRotateZ2D(nose.gfx, nose.geom.dim, angle, 1);
//    /* Use for rendering sattelite with GFX.ATTR_STYLE */
//    {
//       // const cx = nose.geom.pos[0] - nose.geom.dim[0] 
//       // const cy = nose.geom.pos[1] - nose.geom.dim[1]
//    }
//    /* Use for rendering sattelite without GFX.ATTR_STYLE */
//    const cx = nose.geom.pos[0]; // Center to sattelites position
//    const cy = nose.geom.pos[1] 
//    const r = head.geom.dim[0] + nose.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
//    const a = (cx + (r * Math.sin(angle))); // The rotation is the tangent of the outer head's perimeter 
//    const b = (cy + (r * Math.cos(angle)));
   
//    nose.geom.SetWposXY(nose.gfx, head.geom.pos[0]+head.geom.dim[0], head.geom.pos[1]+head.geom.dim[1]);
//    nose.geom.AddWposXY(nose.gfx, a, b);

//    // Update the rotation ammount from the user input
//    params.params.rot.amt = angle;

// }




// function Animation_scale_up_run(params){

//    in_scale_animation = true;

//    const section = params.section;
//    const idx = params.body_mesh_idx - first_body_mesh_idx;

//    if(idx >= body_count) return false;
   
   
//    const body_mesh = section.children.buffer[params.body_mesh_idx];
//    // console.log(body_mesh.GetName())
   
   
//    const t_idx = idx;
   
//    // const modifier =  (1 / body_count) * idx;
//    const min = 0.25; 
//    const max = 1.0; 
   
//    let mod = 0;

//    if(idx < 6){
//       mod = idx/6;
//       // mod = idx/(6*(body_count-idx));
//       // mod = idx/(30-body_count);
//       // console.log(idx, slope_constant1-mod)
//    }
//    else {

//       const z = 0.025 * body_count*.2 * idx;
   
//       mod = (z) < max 
//             ? ( (z < min) ? 0 : z ) 
//             : max-min;

//       // console.log(idx, z, slope_constant1-mod)
//    }
//    const val = Slope_function_logarithmic(t[t_idx], slope_constant1-mod) +1;
   
//    // Update 
//    t[t_idx] += step;
   
//    const temp = Slope_function_logarithmic(t[t_idx], slope_constant1-mod) +1;
   
//    const res = (temp-val)*100
   
   
//    body_mesh.geom.dim[0] += res*2;
//    body_mesh.geom.dim[1] += res*2;
//    body_mesh.geom.AddDimXY(body_mesh.gfx, res, res);
//    body_mesh.geom.pos[0] += -res;
//    body_mesh.geom.pos[1] += -res;
//    body_mesh.geom.AddWposXY(body_mesh.gfx, -res, -res);
//    // console.log(res)

   
//    // if(body_mesh.geom.dim[0] < size*scale && res > 1) return true;
//    // const style = body_mesh.mat.style[1]/2;
//    // if(body_mesh.geom.dim[0] < size*scale - style) return true;
//    if(body_mesh.geom.dim[0] < size*scale) return true;
//    else {
      
//       const params2 = {
//          section:section,
//          body_mesh_idx:params.body_mesh_idx + 1,
//          physics: params.physics,
//       };
         
//       if(idx < body_count){
//          Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
//       }

//       return false;
//    }

// }

// function Animation_scale_up_stop(params){
   
//    // console.log('SCALE DOWN NEW', params.body_mesh_idx)

//    setTimeout(
//       ()=>{ Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); },
//       100, 
//    );

//    const t_idx = params.body_mesh_idx - first_body_mesh_idx;
//    t[t_idx] = 0.0;

//    // in_scale_animation = false;
//    return false;
// }

// function Animation_scale_down_run(params){
   
//    const section = params.section;
//    const idx = params.body_mesh_idx - first_body_mesh_idx;

//    if(idx >= body_count) 
//       return false;

//    const body_mesh = section.children.buffer[params.body_mesh_idx];

//    const t_idx = idx;
//    // const modifier =  (1 / body_count) * idx;
//    const modifier =  0;
//    const val = Slope_function_logarithmic(t[t_idx], slope_constant1-modifier) +1;
//    t[t_idx] += step;
   
//    const temp = Slope_function_logarithmic(t[t_idx], slope_constant1-modifier) +1;
   
//    const res = (temp-val)*100
   
//    body_mesh.geom.dim[0] -= res*2;
//    body_mesh.geom.dim[1] -= res*2;
//    body_mesh.geom.AddDimXY(body_mesh.gfx, -res, -res);
//    body_mesh.geom.pos[0] += res;
//    body_mesh.geom.pos[1] += res;
//    body_mesh.geom.AddWposXY(body_mesh.gfx, res, res);
   
//    if(body_mesh.geom.dim[0] > size &&  res > .01) return true;
//    else return false;
// }

// function Animation_scale_down_stop(params){

   
//    if(params.body_mesh_idx - first_body_mesh_idx >= body_count) {

//       const section = params.section;

//       // const last_elem_idx = section.children.boundary - first_body_mesh_idx;
//       const last_elem_idx = section.children.boundary;
//       const last_mesh = section.children.buffer[last_elem_idx];
      

//       // Calc the axis vector of the 2 last body meshes, and set the position of the new body mesh to that axis
//       const second_last_mesh = section.children.buffer[last_elem_idx-1];
//       const axis = [
//          last_mesh.GetPosX() - second_last_mesh.GetPosX(),
//          last_mesh.GetPosY() - second_last_mesh.GetPosY(),
//       ];
   
//       const style = last_mesh.mat.style[1]/2;
//       // const posx = last_mesh.geom.pos[0] + axis[0] + style * body_meshes_dist_mod;
//       // const posy = last_mesh.geom.pos[1] + axis[1] + style * body_meshes_dist_mod;
//       const posx = last_mesh.geom.pos[0] + axis[0] + style;
//       const posy = last_mesh.geom.pos[1] + axis[1] + style;
//       // const posx = last_mesh.geom.pos[0] + axis[0];
//       // const posy = last_mesh.geom.pos[1] + axis[1];


//       const body_mesh = Create_widget_section(_, _, [0,0], [posx, posy, 1], [size,size], TRANSPARENCY(YELLOWR[9], 1.), 'body_mesh', body_mesh_style);
//       body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       const body_idx = section.AddItem(body_mesh);
//       body_mesh.SetName('body_mesh' + body_idx);


//       body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
//       body_mesh.EnableGfxUniforms({fx: SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

//       body_mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_mesh.gfx.vb.groupidx);
//       body_mesh.Render();

//       /***************************************************************************************************/
//       // Physics
//       const phys_last_elem_idx = last_elem_idx - first_body_mesh_idx;
//       const velocity = [params.physics[phys_last_elem_idx].vel[0], params.physics[phys_last_elem_idx].vel[1]]; 
//       const mass = body_mesh.geom.dim[0]; 
//       const momentum = [velocity[0]*mass, velocity[1] * mass];
//       const acceleration = [0, 0];
//       const speed = 5.5;

//       const physics = {
//          vel:velocity,
//          mass:mass,
//          mom: momentum,
//          accel: acceleration,
//          speed:speed,
//       }

//       params.physics.push(physics);

//       body_count++;

//       in_scale_animation = false;
//    }


//    const t_idx = params.body_mesh_idx - first_body_mesh_idx;
//    t[t_idx] = 0.0;
   
//    return false;

// }


