import { Callback_animations_create, Callback_animations_print_size } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Mesh_animations_create } from "../../../../Engine/Animations/MeshAnimations.js";
import { Android_deactivate_scrolling, MouseGetPosDifX } from "../../../../Engine/Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh, Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../../../../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { BLACK, BLUEL, GREEN, GREENL, GREY, Interpolate_rgb_to_01, ORANGEL, ORANGER, PURPLEB, PURPLER, RED, REDL, WHITE, YELLOW, YELLOWL, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Mesh_calc_pos_dif } from "../../../../Engine/Drawables/Operations/MeshHelperFunctions.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../../Engine/Drawables/Operations/Recursions.js";
import { Time_intervals_create } from "../../../../Engine/Timers/TimeIntervals.js";
import { Gl_set_round_corners, Gl_add_vpos_xy, Gl_set_glow_intensity, GlRotateZ2D } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { GetRandomPos } from "../../../../Helpers/Helpers.js";
import { Slope_function_logarithmic } from "../../../../Helpers/Math/MathFunction.js";
import { Abs, Magnitude } from "../../../../Helpers/Math/MathOperations.js";






// TODO: Make the head another color
// TODO: Create animation for the collectable
// TODO: Create glow effect for the snake. ?When and Where?
// TODO:
// TODO: Create a better panel for user input
// TODO:
// TODO: Pass the snake through another shader for glow
// TODO: Also on scale the glow effect should intensify









const MAX_BODY_MESHES = 100;
var slope_constant1 = .2;
const INITIAL_SIZE = 45;
const snake_initial_body_count = 40;

// const collectable_pos_constraints = [];

/**
 * // NOTES:
 * If the 'body_meshes_dist_mod' is 2.0, then the distance between each body is halved.
 * Then we need to accomodate that distance to keep its relative value by deviding with the 'glow_scale_down_factor'.
 * So id 'body_meshes_dist_mod=2' and 'glow_scale_down_factor=0.5',
 * then the body_meshes_dist_mod/glow_scale_down_factor will be 4, which will put the bodies in halved size distance
 * 
 * GOOD SNAKE 
 * ROPERTIES:
 * 
 * const MAX_BODY_MESHES = 100;
 * var slope_constant1 = .2;
 * const INITIAL_SIZE = 40;
 * const snake_initial_body_count = 40;
 * 
 * color:TRANSPARENCY(YELLOWR[9], .6),
 * speed:1,
 * min_size: 4,
 * style: [INITIAL_SIZE, 0, 4],
 * reduce_mod: .5, // 
 * glow_intensity: .35,
 * glow_intensity_step: .1,
 * glow_scale_down_factor: 1., 
 * body_meshes_dist_mod: 3., 
 * 
 */




const snake = {
   count:0, // Number of snake body meshes
   size:INITIAL_SIZE, // Size of the snake body meshes

   // color:TRANSPARENCY(PURPLER[6], .6),
   color:TRANSPARENCY(YELLOWR[9], .7),

   speed:1,

   min_size: 4,
   style: [INITIAL_SIZE, 0, 2],
   // reduce_size: 1., // 
   reduce_mod: .5, // 

   glow_intensity: .35,
   glow_intensity_step: .1,
   glow_scale_down_factor: .5, // The regular rendered body mesh will be: 'glow_scale_down_factor' times bigger/smaller to the body glow effect 
   body_meshes_dist_mod: 5., // A modifier to control the distance between the snake body meshes
   // body_meshes_dist_mod: 2./.4, // A modifier to control the distance between the snake body meshes
   
   in_scale_animation: false,
   first_body_mesh_idx: INT_NULL, // The index of the snake head mesh 

   // rot_amt:0,
   rotation: { // This variable is to store the ammount of users input mouse, so that user can rotate the head mesh 
      amt:0.0,
   },
   
   
   step:0.005, // The step that the 'Move' function will use to advance the body meshes to the next position
   body:New_generic_buffer(_, 'Game Snake Body Meshes'), // Where all snake's body meshes variables will be stored
};

class Body_mesh_properties {

   constructor(_mesh = null){

      if(!_mesh)alert()

      this.mesh = _mesh;
      this.idx = INT_NULL;
      this.size = INITIAL_SIZE;
      // this.default_reduced_size = INITIAL_SIZE; 
      
      // A modifier for the calculation of the slope function that controls the next position of a snake body mesh
      this.t = 0; // Values = [0-1]
      this.slope = Slope_function_logarithmic(this.t, slope_constant1) +1;// Stores the current calculated 't' to be used on the next snake 'Move' calculation. 
      this.max_scale_factor = 1.4; // Max scale will be = 'max_scale_factor' times bigger to the original size
      
      this.reduce_size = 1.; // Max scale will be: 'max_scale_factor' times bigger to the original size
      
      this.glow_intensity = snake.glow_intensity;
   }
}





/**************************************************************************************************************************************************************/
// 
function Clbk_u_glow_params_0(params){

   const body = snake.body.buffer[0];

   return (snake.in_scale_animation) ? .5 : .3;
   // return (body.mesh.geom.dim[0] > snake.min_size) ? body.mesh.geom.dim[0] * .015 : .3;
   // return body.mesh.geom.dim[0] * .015;
   // return .3;
   // return .5;
   // return .8;
}
function Clbk_u_glow_params_2(params){

   // const body = snake.body.buffer[0];

   return .0;
}








/**************************************************************************************************************************************************************/
// 


export function Game_snake() {

   
   const board_pad = 30;
   const style = [snake.size, 6, 3];
   let board_width = VIEWPORT.WIDTH/2 - board_pad;
   let board_height = (VIEWPORT.HEIGHT/2) - board_pad;

   // TODO: If android: deactivate scrolling
   if(PLATFORM.ANY_SMARTPHONE_DEVICE) {
      Android_deactivate_scrolling();
      board_width - DEVICE.info.canvas_left + DEVICE.info.canvas_right;
      board_height - DEVICE.info.canvas_top + DEVICE.info.canvas_bot;
   }

   const board_color = TRANSPARENCY(Interpolate_rgb_to_01(16, 28, 35), .2);
   // const board_color = TRANSPARENCY(Interpolate_rgb_to_01(160, 250, 255), .2);
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [board_pad, board_pad, 0], [board_width,board_height], board_color, 'section', style);
   section.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.EnableGfxUniforms({fx: SID.FX.FS_GLOW_VEC2,}, 'u_glow_params', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_BORDER);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_GLOW_INTENSITY);




   const physics = [];






   /*************************************************************************************************/
   // Create the Collectible mesh

   // const collectable_size = snake.size*1.4;
   const collectable_size = 40;
   const posx_start = section.geom.pos[0]                         + collectable_size*2 + 10;
   const posx_end = (section.geom.pos[0] + section.geom.dim[0]*2) - (collectable_size*2 + 10);
   const posy_start = section.geom.pos[1]                         + collectable_size*2 + 10;
   const posy_end = (section.geom.pos[1] + section.geom.dim[1]*2) - (collectable_size*2 + 10);
   
   const rand_pos = GetRandomPos([posx_start, posy_start], [posx_end, posy_end]);

   const collectable = Create_widget_section(_, _, [0,0], [rand_pos[0], rand_pos[1], 0], [collectable_size,collectable_size], PURPLEB[9], 'section', [collectable_size, 0, 3]);
   
   collectable.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   collectable.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   collectable.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
   collectable.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
   collectable.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_BORDER);
   collectable.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_GLOW_INTENSITY);
   collectable.EnableGfxUniforms({fx: SID.FX.FS_GLOW_VEC2,}, 'u_glow_params', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
   collectable.SetName('collectable');
   section.AddItem(collectable); 
   
   
   
   
   
   
   
   
   /*************************************************************************************************/
   // Create the snake head's nose mesh (Shows the direction of the snke)
   const nose = Create_rect_mesh(_, [0, 0, 1], [3, 8], TRANSPARENCY(PURPLER[9], .2));
   nose.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   nose.SetName('Nose');
   section.AddItem(nose);
   
   
   
   
   
   
   /*************************************************************************************************/
   // Create snake body meshes
   
   let next_posx = board_width;
   let next_posy = 60;
   let zpos = 1;
   
   for(let i=0; i < snake_initial_body_count; i++){
      
      // Calculate body size according to body mesh index (the greater the index the smaller the size)
      let reduce_size = i * snake.reduce_mod;
      let calc_size = snake.size - reduce_size;
      if(calc_size < snake.min_size) {
         calc_size = snake.min_size;
         reduce_size = 0;
      }
      
      
      const body_mesh = Create_widget_section(_, _, [0,0], [next_posx, next_posy, MAX_BODY_MESHES-i+1], [calc_size, calc_size], snake.color, 'body_mesh', [calc_size, snake.style[1], snake.style[2]]);
      body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxUniforms({fx: SID.FX.FS_GLOW_VEC2,}, 'u_glow_params', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_BORDER);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_GLOW_INTENSITY);
      section.AddItem(body_mesh);
      
      
      const bodyidx = snake.body.Add(new Body_mesh_properties(body_mesh));
      snake.body.buffer[bodyidx].idx = bodyidx; // Store the index for convinience
      snake.body.buffer[bodyidx].size = calc_size; // Store the index for convinience
      snake.body.buffer[bodyidx].reduce_size = reduce_size;

      snake.count++;
      if(bodyidx !== i) alert('514332139908', 'snake body mesh should index mismatch');
      // Name each body according to its index 
      body_mesh.SetName('body-' + bodyidx);



      // Set the max scale factor according to body mesh index
      // const max_scale_factor = snake.max_scale_factor - i * .05;
      // if(max_scale_factor < snake.reduce_size) snake.body.buffer[i].max_scale_factor = snake.reduce_size;
      // else snake.body.buffer[i].max_scale_factor = max_scale_factor;

      // // Set the min scale factor according to body mesh index
      // const reduce_size = snake.reduce_size - i * snake.reduce_mod;
      // if(reduce_size > snake.reduce_size) snake.body.buffer[i].reduce_size = snake.reduce_size;
      // else snake.body.buffer[i].reduce_size = reduce_size;



      // Physics
      const velocity = [.5, .0]; 
      const mass = body_mesh.geom.dim[0]; 
      const momentum = [velocity[0]*mass, velocity[1] * mass];
      const acceleration = [0, 0];

      physics[i] = {
         vel:velocity,
         mass:mass,
         mom: momentum,
         accel: acceleration,
         speed:snake.speed,
      }

      // next_posx -= snake.reduce_mod;
      next_posx += snake.reduce_mod;
      next_posy += snake.reduce_mod;

   }






   /*************************************************************************************************/
   // Implement mouse controls directly to the section panel
   
   section.Bind(
      (params)=>{ // Click callback

         const phys = params.params.target_params.phys;


         const mouse_xdif = MouseGetPosDifX();
         if(Abs(mouse_xdif) > .5) {

            
            /*******************************************************************************************/
            // Nose Rotation. Just add the ammount of mouse move on the x axis
            
            const mod = .02;

            params.params.target_params.rot.amt += mouse_xdif*mod;
            phys.vel[0] = Math.sin(params.params.target_params.rot.amt);
            phys.vel[1] = Math.cos(params.params.target_params.rot.amt);
         }
            
      }, 
      _, 
      {target_params: {head:snake.body.buffer[0].mesh, nose:nose, phys: physics[0], rot: snake.rotation, } }, 
      MESH_STATE.IS_HOLD_CLICK
   );
   


   
   section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   section.GenGfxCtx();
   section.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section);
   Construct_listen_events_relations_from_mesh_tree(section);

   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
   section.SetClbkGfxUniforms('u_glow_params', ()=>{ return .5}, { vb_grouidx: section.gfx.vb.groupidx, val_idx: 0, start_val: .0, });
   section.SetClbkGfxUniforms('u_glow_params', ()=>{ return .4}, { vb_grouidx: section.gfx.vb.groupidx, val_idx: 1, start_val: .0, });





   /*************************************************************************************************/
   
   collectable.GfxUniformsSetClbk('u_scale2', 
      function () { 
         return [snake.glow_scale_down_factor, 1];
      }
      , collectable.gfx.vb.groupidx
   );
   collectable.SetClbkGfxUniforms('u_glow_params', ()=>{ return .7}, { vb_grouidx: collectable.gfx.vb.groupidx, val_idx: 0, start_val: .8, });
   collectable.SetClbkGfxUniforms('u_glow_params', ()=>{ return .3}, { vb_grouidx: collectable.gfx.vb.groupidx, val_idx: 1, start_val: .0, });
   Gl_set_glow_intensity(collectable.gfx, 1.);
   
   // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, collectable, .01, .35, .75, _, .35, false)
   // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, collectable, .01, .35, .75, _, .35, false)
   // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, collectable, .1, -1., 1., 0);
   // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.ROT, collectable, .5, -5., 5., 0);
   
   // const head = snake.body.buffer[0].mesh;
   // // head.GfxUniformsSetClbk('u_scale2', function () { return [snake.glow_scale_down_factor, 1] }, head.gfx.vb.groupidx);
   // head.SetClbkGfxUniforms('u_glow_params', ()=>{ 
   //    return .6}, { vb_grouidx: head.gfx.vb.groupidx, val_idx: 0, start_val: .8, });
   // // const clbk_params_0 = { vb_grouidx: head.gfx.vb.groupidx, val_idx: 0, start_val: 1.0, }
   // // head.SetClbkGfxUniforms('u_glow_params', Clbk_u_glow_params_0, clbk_params_0);
   // const clbk_params_1 = { vb_grouidx: head.gfx.vb.groupidx, val_idx: 1, start_val: .0, }
   // head.SetClbkGfxUniforms('u_glow_params', ()=>{ 
   //    return .6}, clbk_params_1);

   // head.SetClbkGfxUniforms('u_glow_params', ()=>{ return .04}, { vb_grouidx: head.gfx.vb.groupidx, val_idx: 0, start_val: .8, });
   // head.SetClbkGfxUniforms('u_glow_params', ()=>{ return .0}, { vb_grouidx: head.gfx.vb.groupidx, val_idx: 1, start_val: .0, });






   /*************************************************************************************************/
   // Nose Controls
   
   let total_height = VIEWPORT.HEIGHT/2 - 30;
   const pad = 0;
   
   const controls_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4,4], [0+pad, 0+total_height*2, 0], [0, 0], GREY[1]);
   controls_section.SetName('Sattelite_rotation->controls_section');
   controls_section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

   





   /*************************************************************************************************/
   // Create move for body meshes
   const params = {
      section: section,
      physics: physics,
      collectable:collectable,
      nose:nose,
      rot:snake.rotation,
      controls_section:controls_section,
   }
   
   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_snake, params);
   

   


   // Debug_info_ui_static();
      
}


function Animate_snake(params) {

   // if(snake.in_scale_animation) return;

   const section = params.params.section;
   
   const head = snake.body.buffer[0].mesh;
   const phys = params.params.physics[0];
   const nose = params.params.nose;
   const collectable = params.params.collectable;
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
      hit=true;
   }
   else if (ball_top < top_bound) {
      phys.vel[1] *= -1;
      hit=true;
   }
   if (ball_right > right_bound) {
      phys.vel[0] *= -1;
      // Calculate the correct position from the wall
      const b_dist = right_bound - (head.geom.pos[0] + ball_radius * 2);
      head.geom.pos[0] =  right_bound - ((x - b_dist) + ball_radius*2);
      head.geom.UpdateSetWposX(head.gfx);
      hit=true;
   }
   else if (ball_left < left_bound) {
      phys.vel[0] *= -1;
      
      // Calculate the correct position from the wall
      const b_dist = left_bound + head.geom.pos[0];
      head.geom.pos[0] =  left_bound + (Abs(x) - b_dist);
      head.geom.UpdateSetWposX(head.gfx);
      hit=true;
   }
   else {
   
      head.geom.pos[0] += x;
      head.geom.pos[1] += y;
      head.geom.AddWposXY(head.gfx, x, y);
   }


   
   /*******************************************************************************************/
   // Check collision with collectable

   const dif = Mesh_calc_pos_dif(collectable, head)
   const dist1 = Magnitude(dif[0], dif[1]);
   // console.log('dist1', dist1, 'dif', dif)
   
   // On collect
   if(dist1 < collectable.geom.dim[0]+head.geom.dim[0] ){
      
      // Create new collectable in another random position
      const collectable_size = collectable.geom.dim[0];
      const posx_start = section.geom.pos[0]                         + (collectable_size*2 + 10);
      const posx_end = (section.geom.pos[0] + section.geom.dim[0]*2) - (collectable_size*2 + 10);
      const posy_start = section.geom.pos[1]                         + (collectable_size*2 + 10);
      const posy_end = (section.geom.pos[1] + section.geom.dim[1]*2) - (collectable_size*2 + 10);
      const rand_pos = GetRandomPos([posx_start, posy_start], [posx_end, posy_end]);
      collectable.SetWposXY(rand_pos)

      // Create scale animation
      const params2 = {
         section:section,
         body_mesh_idx:0,
         nose:params.params.nose,
         slope_constant1:1.,
         physics: params.params.physics,
      };
   
      Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
      // Callback_animations_print_size();



      // TODO: Increment score

   }


   
   /*******************************************************************************************/
   // Move snake

   const body = snake.body.buffer[1].mesh;


   const axis = [
      head.geom.pos[0] - body.geom.pos[0],
      head.geom.pos[1] - body.geom.pos[1],
   ];
   
   let dist_mod = snake.body.buffer[1].size * snake.body_meshes_dist_mod;
   const dist = Magnitude(axis[0], axis[1]) + dist_mod;
   

   // Move snake body
   if(dist > head.geom.dim[0] ){
      
      let prev_mesh = head;
      
      for(let i=1; i <= snake.body.boundary; i++){
         
         const body_mesh = snake.body.buffer[i].mesh;

         const axis2 = [
            (prev_mesh.geom.pos[0]+prev_mesh.geom.dim[0]) - (body_mesh.geom.pos[0]+body_mesh.geom.dim[0]),
            (prev_mesh.geom.pos[1]+prev_mesh.geom.dim[1]) - (body_mesh.geom.pos[1]+body_mesh.geom.dim[1]),
         ];

         dist_mod = body_mesh.geom.dim[0]/2 * snake.body_meshes_dist_mod;

         const dist2 = Magnitude(axis2[0], axis2[1]) + dist_mod;
         
         /** Body Follows head with almost in stantly */
         const n2 = [
            axis2[0] / dist2,
            axis2[1] / dist2,
         ];
         
         // const delta2 = dist2 - snake.size*2;
         const delta2 = dist2 - body_mesh.geom.dim[0]*2;
         const xx2 = n2[0] * delta2;
         const yy2 = n2[1] * delta2;
         
         // if(dist2 > body_mesh.geom.dim[0]*2 )
         {
            
            body_mesh.geom.pos[0] += xx2;
            body_mesh.geom.pos[1] += yy2;
            body_mesh.geom.AddWposXY(body_mesh.gfx, xx2, yy2);
            
         }


         prev_mesh = body_mesh;
      }
   }



   

   
   /*******************************************************************************************/
   // Nose move

   const angle = Math.atan2(x*.5, y*.5); // !!! Get the angle of rotation from two [x,y] vector points with ATAN2 !!!
   GlRotateZ2D(nose.gfx, nose.geom.dim, angle, 1);
   /* Use for rendering sattelite with GFX.ATTR_STYLE */
   // const cx = nose.geom.pos[0] - nose.geom.dim[0] 
   // const cy = nose.geom.pos[1] - nose.geom.dim[1]
   /* Use for rendering sattelite without GFX.ATTR_STYLE */
   const cx = nose.geom.pos[0]; // Center to sattelites position
   const cy = nose.geom.pos[1] 
   const r = head.geom.dim[0] + nose.geom.dim[1]; // Set the radius in which the sattelite will be rotating (perimetricaly)
   const a = (cx + (r * Math.sin(angle))) * snake.glow_scale_down_factor; // The rotation is the tangent of the outer head's perimeter 
   const b = (cy + (r * Math.cos(angle))) * snake.glow_scale_down_factor;
   
   const new_posx = head.geom.pos[0] + head.geom.dim[0];
   const new_posy = head.geom.pos[1] + head.geom.dim[1];

   nose.geom.SetWposXY(nose.gfx, new_posx, new_posy);
   nose.geom.AddWposXY(nose.gfx, a, b);

   // Update the rotation ammount from the user input
   params.params.rot.amt = angle;

}


function Animation_scale_up_run(params){

   // if(params.body_mesh_idx === 0) snake.in_scale_animation = true;
   snake.in_scale_animation = true;

   const section = params.section;
   const bodyidx = params.body_mesh_idx;

   if(bodyidx >= snake.body.active_count) return false; // Guard against passing 'params.body_mesh_idx + 1' of the last body
   
   
   const body = snake.body.buffer[bodyidx];
   
   
   let mod = 0;
   
   // Update snake body meshes scale
   body.t += snake.step;
   const slope = Slope_function_logarithmic(body.t, slope_constant1-mod) +1;
   
   // Find the difference from the previous slope and the current
   // const res = (slope - body.slope)*(body.mesh.idx+100); // Move faster on gerater mesh index
   const res = (slope - body.slope) * 100;
   body.slope = slope;
   body.mesh.geom.dim[0] += res;
   body.mesh.geom.dim[1] += res;
   body.mesh.geom.AddDimXY(body.mesh.gfx, res, res);
   
   // Also move the body meshes because the coordinate system is the top-left of the mesh
   body.mesh.geom.pos[0] += -res;
   body.mesh.geom.pos[1] += -res;
   body.mesh.geom.AddWposXY(body.mesh.gfx, -res, -res);

   Gl_add_vpos_xy(body.mesh.gfx, res, res);

   body.mesh.mat.style[0] =  body.mesh.geom.dim[0];
         Gl_set_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);
   
   
   body.glow_intensity +=  snake.glow_intensity_step;
   // Gl_set_glow_intensity(body.mesh.gfx, body.glow_intensity);

   


   

   
   /*******************************************************************************************/
   // Nose move with the scale

   if(bodyidx === 0){

      const nose = params.nose;
      const physics = params.physics;
      nose.geom.AddWposXY(nose.gfx, res * .5 * physics[0].vel[0], res * .5 * physics[0].vel[1]);
   }


   
   // While the scaled mesh is less than the max scaled constant, continue scaling
   if(body.mesh.geom.dim[0] < body.size * body.max_scale_factor) return true;
   else { // Else scale max reached, return false to continue with the scale down AND create the next body scale up animation
      if(bodyidx + 1 < snake.count){

         // Create scale up for the next body mesh
         const params2 = {
            section:section,
            nose:params.nose,
            body_mesh_idx:params.body_mesh_idx + 1,
            physics: params.physics,
         };
            
         if(bodyidx <= snake.body.boundary){
            Callback_animations_create(Animation_scale_up_run, Animation_scale_up_stop, params2);
            // Callback_animations_print_size();
         }
      }
      
      return false;
   }

}

function Animation_scale_up_stop(params){
   
   setTimeout(
      ()=>{ Callback_animations_create(Animation_scale_down_run, Animation_scale_down_stop, params); /*Callback_animations_print_size();*/ },
      100, 
   );

   snake.body.buffer[params.body_mesh_idx].t = 0.0;
   snake.body.buffer[params.body_mesh_idx].slope = Slope_function_logarithmic(0.0, slope_constant1) +1;

   return false;
}


function Animation_scale_down_run(params){
   
   const bodyidx = params.body_mesh_idx;
   const body = snake.body.buffer[bodyidx];



   // Update 
   const mod =  0;
   body.t += snake.step;
   const slope = Slope_function_logarithmic(body.t, slope_constant1-mod) +1;
   // const res = (slope - body.slope)*(body.mesh.idx+100); // Move faster on gerater mesh index
   // const res = (slope - body.slope);
   const res = (slope - body.slope) * 100;
   body.slope = slope;


   



   // Run scale down function until the snake body reaches the default size
   if(body.mesh.geom.dim[0] - res > body.size) {

      body.mesh.geom.dim[0] -= res;
      body.mesh.geom.dim[1] -= res;
      body.mesh.geom.AddDimXY(body.mesh.gfx, -res, -res);
      body.mesh.geom.pos[0] += res;
      body.mesh.geom.pos[1] += res;
      body.mesh.geom.AddWposXY(body.mesh.gfx, res, res);

      Gl_add_vpos_xy(body.mesh.gfx, res, res);

      
      body.mesh.mat.style[0] =  body.mesh.geom.dim[0];
      Gl_set_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);

         
      body.glow_intensity -=  snake.glow_intensity_step;
      // Gl_set_glow_intensity(body.mesh.gfx, body.glow_intensity);


      /*******************************************************************************************/
      // Nose move with the scale
      if(bodyidx === 0){
         const nose = params.nose;
         const physics = params.physics;
         nose.geom.AddWposXY(nose.gfx, -res * .5 * physics[0].vel[0], -res * .5 * physics[0].vel[1]);
      }
      
      
      return true;
   }
   
   else {

      // Avoid smaller than snake.min_size body meshes
      body.mesh.geom.dim[0] = body.size;
      body.mesh.geom.dim[1] = body.size;
      body.mesh.geom.SetDimXY(body.mesh.gfx, body.size, body.size);


      // Reposition mesh after setting initial dimention on the axis of the prev and next body meshes
      if(bodyidx > 0 && bodyidx < snake.count-1){

         const prev_mesh = snake.body.buffer[bodyidx-1].mesh;
         const next_mesh = snake.body.buffer[bodyidx+1].mesh;

         const axis = [
            (prev_mesh.geom.pos[0]+prev_mesh.geom.dim[0]) + (next_mesh.geom.pos[0]+next_mesh.geom.dim[0]),
            (prev_mesh.geom.pos[1]+prev_mesh.geom.dim[1]) + (next_mesh.geom.pos[1]+next_mesh.geom.dim[1]),
         ];
            
         const x = axis[0]/2 - body.mesh.geom.dim[0];
         const y = axis[1]/2 - body.mesh.geom.dim[1];

         body.mesh.geom.pos[0] = x;
         body.mesh.geom.pos[1] = y;
         body.mesh.geom.SetWposXY(body.mesh.gfx, x, y);

      }

            
      body.mesh.mat.style[0] =  body.mesh.geom.dim[0];
      Gl_set_round_corners(body.mesh.gfx, body.mesh.geom.dim[0]);

      // Reset the glow intensity
      body.glow_intensity = snake.glow_intensity;
      // Gl_set_glow_intensity(body.mesh.gfx, snake.glow_intensity);

      return false;
   }

}

function Animation_scale_down_stop(params){

   // console.log(params.body_mesh_idx, snake.body.boundary)
   if(params.body_mesh_idx === snake.body.boundary) {

      const section = params.section;
      const last_elem_idx = snake.body.boundary;
      const last_mesh = snake.body.buffer[last_elem_idx].mesh;
      

      // Calc the axis vector of the 2 last body meshes, and set the position of the new body mesh to that axis
      const second_last_mesh = snake.body.buffer[last_elem_idx-1].mesh;
      const axis = [
         last_mesh.geom.pos[0] - second_last_mesh.geom.pos[0],
         last_mesh.geom.pos[1] - second_last_mesh.geom.pos[1],
      ];
   
      let posx = last_mesh.geom.pos[0] + axis[0];
      const posy = last_mesh.geom.pos[1] + axis[1];

      // Calculate body size according to body mesh index (the greater the index the smaller the size)
      let reduce_size = (snake.count-1) * snake.reduce_mod;
      let calc_size = snake.size - reduce_size;
      if(calc_size < snake.min_size) {
         calc_size = snake.min_size;
         reduce_size = 0;
      }

      posx -=  (calc_size-last_mesh.geom.dim[0]);


      const zpos = snake.count;
      const body_mesh = Create_widget_section(_, _, [0,0], [posx, posy, MAX_BODY_MESHES-zpos], [calc_size, calc_size], snake.color, 'body_mesh', [calc_size, snake.style[1], snake.style[2]]);
      section.AddItem(body_mesh);

      
      body_mesh.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      body_mesh.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxUniforms({fx: SID.FX.FS_GLOW_VEC2,}, 'u_glow_params', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_BORDER);
      body_mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_GLOW_INTENSITY);



      body_mesh.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, last_mesh.gfx.vb.groupidx);
      body_mesh.Render();
      
      /***************************************************************************************************/
      // Physics
      const phys_last_elem_idx = last_elem_idx;
      const velocity = [params.physics[phys_last_elem_idx].vel[0], params.physics[phys_last_elem_idx].vel[1]]; 
      const mass = body_mesh.geom.dim[0]; 
      const momentum = [velocity[0]*mass, velocity[1] * mass];
      const acceleration = [0, 0];
      
      const physics = {
         vel:velocity,
         mass:mass,
         mom: momentum,
         accel: acceleration,
         speed:snake.speed,
      }
      

      // /*************************************************************************************************/
      // const head = snake.body.buffer[0].mesh;
      // head.GfxUniformsSetClbk('u_scale2', function () { return [snake.glow_scale_down_factor, 1] }, head.gfx.vb.groupidx);
      // const clbk_params_0 = { vb_grouidx: head.gfx.vb.groupidx, val_idx: 0, start_val: 1.0, }
      // head.SetClbkGfxUniforms('u_glow_params', Clbk_u_glow_params_0, clbk_params_0);
      // const clbk_params_1 = { vb_grouidx: head.gfx.vb.groupidx, val_idx: 1, start_val: .0, }
      // head.SetClbkGfxUniforms('u_glow_params', ()=>{ return .0}, clbk_params_1);
      
      const bodyidx = snake.body.Add(new Body_mesh_properties(body_mesh));
      snake.count++;
      body_mesh.SetName('body-' + bodyidx);
      
      const body = snake.body.buffer[bodyidx];
      body.idx = bodyidx; // Store the index for convinience
      body.reduce_size = reduce_size;
      body.size = calc_size;

      params.physics.push(physics);

      
      
      
      // // Set the max scale factor according to body mesh index
      // const max_scale_factor = snake.max_scale_factor - bodyidx * .05;
      // if(max_scale_factor < snake.reduce_size) body.max_scale_factor = snake.reduce_size;
      // else body.max_scale_factor = max_scale_factor;
      
      // STATE.loop.paused = true;
      // snake.in_scale_animation = false;
   }
   
   snake.in_scale_animation = false;
   const bodyidx = params.body_mesh_idx;
   snake.body.buffer[bodyidx].t = 0.0;
   snake.body.buffer[bodyidx].slope = Slope_function_logarithmic(snake.body.buffer[bodyidx].t, slope_constant1) +1;

   return false;

}







