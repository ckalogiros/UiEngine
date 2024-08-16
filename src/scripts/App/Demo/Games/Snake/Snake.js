import { Callback_animations_create } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Android_deactivate_scrolling, MouseGetPosDifX } from "../../../../Engine/Controls/Input/Mouse.js";
import { Create_rect_mesh, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../../../../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { GREENL, GREY, Interpolate_rgb_to_01, ORANGEL, ORANGER, PURPLEB, PURPLER, WHITE, YELLOWL } from "../../../../Engine/Drawables/Material/Base/Colors.js";
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

let body_count = 6;
const t = [];
const step = 0.007;
const size = 15;
const scale = 1.9;

let in_scale_animation = false;
let first_body_mesh_idx = INT_NULL;

const rotation = { // This variable is to store the ammount of users input mouse, so that user can rotate the head mesh 
   amt:0.0,
};

function Init_t(){
   for(let i=0; i<body_count; i++){
      t[i] = 0;
   }
}



/**************************************************************************************************************************************************************/
// 

var slope_constant1 = 1;

export function Game_snake() {



   Init_t();
   
   const style = [10, size, 3];
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


   const physics = [];






   /*************************************************************************************************/
   // Create the Collectible mesh

   const rand_pos = GetRandomPos([20, 20], [section.geom.dim[0]-20, section.geom.dim[1]-20]);
   const collectible = Create_widget_section(_, _, [0,0], [rand_pos[0], rand_pos[1], 0], [25,25], PURPLEB[9], 'section', [0, 25, 10]);
   collectible.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   collectible.SetName('collectible');
   section.AddItem(collectible); 
   



   /*************************************************************************************************/
   // Create the snake head's nose mesh (Shows the direction of the snke)
   const sat = Create_rect_mesh(_, _, [4, 10], TRANSPARENCY(PURPLER[9], .2));
   sat.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.AddItem(sat);





   


   /*************************************************************************************************/
   // Create snake body meshes

   const speed = 1.5;
   let next_posx = board_width/2;
   
   for(let i=0; i < body_count; i++){
      
      const body_mesh = Create_widget_section(_, _, [0,0], [next_posx, 20, 1], [size,size], TRANSPARENCY(ORANGER[9], .5), 'body_mesh', [5, size, 3]);
      body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      const body_idx = section.AddItem(body_mesh);
      body_mesh.SetName('body_mesh'+body_idx);
      
      // Store the index of the first body mesh
      if(first_body_mesh_idx === INT_NULL) first_body_mesh_idx = body_idx;


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

      next_posx -= size*2 + style[2];

   }

  





   /*************************************************************************************************/
   // Implement mouse controls directly to the section panel
   
   section.Bind(
      (params)=>{ // Click callback

         if(in_scale_animation) return;

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
      {target_params: {head:section.children.buffer[first_body_mesh_idx], sat:sat, phys: physics[0], rot: rotation, } }, 
      // {sat: sat, phys: physics[0], }, 
      MESH_STATE.IS_HOLD_CLICK
   );
   


   
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();
   section.options = SECTION.INHERIT|SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
   section.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);


  





   /*************************************************************************************************/
   // Satelite Controls
   
   let total_height = VIEWPORT.HEIGHT/2 - 30;
   const pad = 0;
   const panel_height = 150;
   
   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4,4], [0+pad, 0+total_height*2, 0], [0, 0], GREY[1]);
   // if(!PLATFORM.ANY_SMARTPHONE_DEVICE) controls_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   controls_section.SetName('Sattelite_rotation->controls_section');
   controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   const flags = {
      unif: SID.UNIF.ROOT_WPOS2,
      pass: SID.PASS.WPOS2,
   };





{
   // /****************************************************************************************************************/
   // // mouse left right control
   // const mouse_panel_control = Create_widget_button(_, '_________________________________________', _, [0, 0, 1], 20, GREY[6], WHITE, [5, 5], .5);
   // controls_section.AddItem(mouse_panel_control)
   // // mouse_panel_control.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   // mouse_panel_control.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   
   // mouse_panel_control.Bind(
   //    (params)=>{ // Click callback

   //       if(in_scale_animation) return;

   //       const phys = params.params.target_params.phys;


   //       const mouse_xdif = MouseGetPosDifX();
   //       if(Abs(mouse_xdif) > .5) {

            
   //          /*******************************************************************************************/
   //          // Satelite Rotation. Just add the ammount of mouse move on the x axis
            
   //          const mod = .02;

   //          params.params.target_params.rot.amt += mouse_xdif*mod;
   //          phys.vel[0] = Math.sin(params.params.target_params.rot.amt);
   //          phys.vel[1] = Math.cos(params.params.target_params.rot.amt);
   //          // console.log('mouse_xdif', mouse_xdif, 'amt', params.params.target_params.amt);
   //       }
            
   //    }, 
   //    _, 
   //    {target_params: {head:section.children.buffer[first_body_mesh_idx], sat:sat, phys: physics[0], rot: rotation, } }, 
   //    // {sat: sat, phys: physics[0], }, 
   //    MESH_STATE.IS_HOLD_CLICK
   // );
   
   
   // /****************************************************************************************************************/
   // // Render
   // controls_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
   // controls_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   // controls_section.Calc_no_gfx_update();
   // controls_section.Render();
   // Root_group_activate_all_vbs_in_renderqueue(controls_section.root_bufferidx);
   // controls_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, controls_section.gfx.vb.groupidx);
   // Construct_listen_events_from_mesh_tree(controls_section)
   // Construct_listen_events_relations_from_mesh_tree(controls_section);
}

   
   





   /*************************************************************************************************/
   // Create move for body meshes
   const params = {
      section: section,
      physics: physics,
      collectible:collectible,
      sat:sat,
      rot:rotation,
      controls_section:controls_section,
   }
   
   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_snake, params);
   

   


   Debug_info_ui_static();
      
}




function Animate_snake(params) {

   if(in_scale_animation) return;

   const section = params.params.section;
   
   const head = section.children.buffer[first_body_mesh_idx];
   const phys = params.params.physics[0];
   const sat = params.params.sat;
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
         body_mesh_idx:first_body_mesh_idx,
         slope_constant1:1.,
         physics: params.params.physics,
      };
   
      Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);


      // TODO: Add a body to the snake

      // TODO: Increment score

   }


   
   /*******************************************************************************************/
   // Move Body

   const body = section.children.buffer[first_body_mesh_idx+1];


   const axis = [
      head.GetPosX() - body.GetPosX(),
      head.GetPosY() - body.GetPosY(),
   ];

   const dist = Magnitude(axis[0], axis[1]);
   
   // Move the ball
   if(dist > head.geom.dim[0]*2 ){
      
      let prev_mesh = head;
      
      for(let i=first_body_mesh_idx; i <= section.children.boundary; i++){
         
         const body_mesh = section.children.buffer[i];

         const axis2 = [
            prev_mesh.GetPosX() - body_mesh.GetPosX() ,
            prev_mesh.GetPosY() - body_mesh.GetPosY() 
         ];

         const dist2 = Magnitude(axis2[0], axis2[1]);
         
         /** Body Follows head with almost in stantly */
         const n2 = [
            axis2[0] / dist2,
            axis2[1] / dist2,
         ];
         
         const delta2 = dist2 - size*2;
         const xx2 = n2[0] * delta2;
         const yy2 = n2[1] * delta2;
         
         
         if(dist2 > prev_mesh.geom.dim[0]*2 ){
            
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
   GlRotateZ2D(sat.gfx, sat.geom.dim, angle, 1);
   /* Use for rendering sattelite with GFX.ATTR_STYLE */
   {
      // const cx = sat.geom.pos[0] - sat.geom.dim[0] 
      // const cy = sat.geom.pos[1] - sat.geom.dim[1]
   }
   /* Use for rendering sattelite without GFX.ATTR_STYLE */
   const cx = sat.geom.pos[0]; // Center to sattelites position
   const cy = sat.geom.pos[1] 
   const r = head.geom.dim[0] + sat.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
   const a = (cx + (r * Math.sin(angle))); // The rotation is the tangent of the outer head's perimeter 
   const b = (cy + (r * Math.cos(angle)));
   
   sat.geom.SetWposXY(sat.gfx, head.geom.pos[0]+head.geom.dim[0], head.geom.pos[1]+head.geom.dim[1]);
   sat.geom.AddWposXY(sat.gfx, a, b);

   // Update the rotation ammount from the user input
   params.params.rot.amt = angle;

}




function Animation_scale_up_run(params){

   in_scale_animation = true;

   const section = params.section;
   const idx = params.body_mesh_idx - first_body_mesh_idx;

   if(idx >= body_count) return false;
   
   
   const body_mesh = section.children.buffer[params.body_mesh_idx];
   // console.log(body_mesh.GetName())
   
   
   const t_idx = idx;
   
   // const modifier =  (1 / body_count) * idx;
   const min = 0.25; 
   const max = 1.0; 
   
   let mod = 0;

   if(idx < 6){
      mod = idx/6;
      // mod = idx/(6*(body_count-idx));
      // mod = idx/(30-body_count);
      // console.log(idx, slope_constant1-mod)
   }
   else {

      const z = 0.025 * body_count*.2 * idx;
   
      mod = (z) < max 
            ? ( (z < min) ? 0 : z ) 
            : max-min;

      // console.log(idx, z, slope_constant1-mod)
   }
   const val = Slope_function_logarithmic(t[t_idx], slope_constant1-mod) +1;
   
   // Update 
   t[t_idx] += step;
   
   const temp = Slope_function_logarithmic(t[t_idx], slope_constant1-mod) +1;
   
   const res = (temp-val)*100
   
   
   body_mesh.geom.dim[0] += res*2;
   body_mesh.geom.dim[1] += res*2;
   body_mesh.geom.AddDimXY(body_mesh.gfx, res, res);
   body_mesh.geom.pos[0] += -res;
   body_mesh.geom.pos[1] += -res;
   body_mesh.geom.AddWposXY(body_mesh.gfx, -res, -res);
   // console.log(res)

   
   // if(body_mesh.geom.dim[0] < size*scale && res > 1) return true;
   if(body_mesh.geom.dim[0] < size*scale ) return true;
   else {
      
      const params2 = {
         section:section,
         body_mesh_idx:params.body_mesh_idx + 1,
         physics: params.physics,
      };
         
      if(idx < body_count){
         Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
      }

      return false;
   }

}

function Animation_scale_up_stop(params){
   
   // console.log('SCALE DOWN NEW', params.body_mesh_idx)

   setTimeout(
      ()=>{ Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); },
      100, 
   );

   const t_idx = params.body_mesh_idx - first_body_mesh_idx;
   t[t_idx] = 0.0;

   // in_scale_animation = false;
   return false;
}

function Animation_scale_down_run(params){
   
   const section = params.section;
   const idx = params.body_mesh_idx - first_body_mesh_idx;

   if(idx >= body_count) 
      return false;

   const body_mesh = section.children.buffer[params.body_mesh_idx];

   const t_idx = idx;
   // const modifier =  (1 / body_count) * idx;
   const modifier =  0;
   const val = Slope_function_logarithmic(t[t_idx], slope_constant1-modifier) +1;
   t[t_idx] += step;
   
   const temp = Slope_function_logarithmic(t[t_idx], slope_constant1-modifier) +1;
   
   const res = (temp-val)*100
   
   body_mesh.geom.dim[0] -= res*2;
   body_mesh.geom.dim[1] -= res*2;
   body_mesh.geom.AddDimXY(body_mesh.gfx, -res, -res);
   body_mesh.geom.pos[0] += res;
   body_mesh.geom.pos[1] += res;
   body_mesh.geom.AddWposXY(body_mesh.gfx, res, res);
   
   if(body_mesh.geom.dim[0] > size &&  res > .01) return true;
   else return false;
}

function Animation_scale_down_stop(params){

   
   if(params.body_mesh_idx - first_body_mesh_idx >= body_count) {

      const section = params.section;

      // const last_elem_idx = section.children.boundary - first_body_mesh_idx;
      const last_elem_idx = section.children.boundary;
      const last_mesh = section.children.buffer[last_elem_idx];
      

      // Calc the axis vector of the 2 last body meshes, and set the position of the new body mesh to that axis
      const second_last_mesh = section.children.buffer[last_elem_idx-1];
      const axis = [
         last_mesh.GetPosX() - second_last_mesh.GetPosX(),
         last_mesh.GetPosY() - second_last_mesh.GetPosY(),
      ];
   
      const posx = last_mesh.geom.pos[0] + axis[0];
      const posy = last_mesh.geom.pos[1] + axis[1];


      const body_mesh = Create_widget_section(_, _, [0,0], [posx, posy, 1], [size,size], TRANSPARENCY(PURPLER[9], .5), 'body_mesh', [5, size, 3]);
      body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      const body_idx = section.AddItem(body_mesh);
      body_mesh.SetName('body_mesh' + body_idx);

      body_mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_mesh.gfx.vb.groupidx);
      body_mesh.Render();

      /***************************************************************************************************/
      // Physics
      const phys_last_elem_idx = last_elem_idx - first_body_mesh_idx;
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

      params.physics.push(physics);

      body_count++;

      in_scale_animation = false;
   }


   const t_idx = params.body_mesh_idx - first_body_mesh_idx;
   t[t_idx] = 0.0;
   
   return false;

}


