"use strict";

import { Gl_add_wpos_xy, Gl_set_attr_round_corners, Gl_set_dim_xy, Gl_set_wpos_x, Gl_set_wpos_xy } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";
import { Mesh_set_dim_xy, Mesh_update_set_dim_xy } from "../Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_event_callback_create } from "../Drawables/Operations/MeshPropertiesFunctions.js";
import { Callback_animations_create, Callback_animations_destroy_byidx, Callback_animations_replace_byidx } from "./CallbackAnimations.js";





let _cnt = 0;
export const CALLBACK_ANIMATION_TYPE_IDX = {
   MOVE_XY: _cnt++,
   MOVE_X: _cnt++,
   SCALE: _cnt++,
   RCORNERS: _cnt++,
   COUNT: _cnt,
};
_cnt = 0x1;
export const CALLBACK_ANIMATION_TYPE_FLAGS = {
   MOVE_XY: _cnt,
   MOVE_X: _cnt <<= 0x1,
   SCALE: _cnt <<= 0x1,
   RCORNERS: _cnt <<= 0x1,
};

const _ready_animations_buffer = [
   { run: Animation_move_xy_inflate_run, stop: Animation_move_xy_inflate_stop },
   { run: Animation_move_x_inflate_run, stop: Animation_move_x_inflate_stop },
   { run: Animation_scale_inflate_run, stop: Animation_scale_inflate_stop },
   { run: Animation_rcorners_inflate_run, stop: Animation_rcorners_inflate_stop },
   { run: Animation_move_xy_deflate_run, stop: Animation_move_xy_deflate_stop },
   { run: Animation_move_x_deflate_run, stop: Animation_move_x_deflate_stop },
   { run: Animation_scale_deflate_run, stop: Animation_scale_deflate_stop },
   { run: Animation_rcorners_deflate_run, stop: Animation_rcorners_deflate_stop },
];


/**
 * HERE:
 * Για να εχουμε σωστη διαχειρηση των callback animations of the mesh class,
 * we need to create a resolveCallback function pointer in the mesh class and pass it with Mesh_event_callback_create.
 * So int the event listeners, the mesh will call the resolveCallback function pointer, which will call the callback function.
 * That way user chooses the callback function to be called when the event is triggered in the event listeners.
 */

/**
* This function sets the target target_mesh's event callback(Event Listeners), to run an animation
* 
* @param {Mesh} target_mesh : The target_mesh to be animated
* @param {INT} animation_type_idx : Index to a function from function pointers buffer. Must be of type: CALLBACK_ANIMATION_TYPE_IDX.
* @param {Object} object_parameter : {a:slope_constant, b:time_step, c:ammount}. Consumed by: 'Function_Slope' Class, 
*/
export function Callback_animations_create_specific(target_mesh, animation_type_idx, { slope_constant = 1.0, time_step = 0.1, ammount = 10 } = {}, interupt = false) {

   // const slope_params_pointer = new Function_Slope(1., 0.1, 10);
   const slope_params_pointer = new Function_Slope(slope_constant, time_step, ammount,);
   /**
    * TODO:
    * Abstract the geom pos as an int_value
    */
   const animation_params = {
      target_mesh: target_mesh,
      interupt: interupt, // Ability: to stop the animation at any point, if the user (for now) has unhovered the target mesh. (Later we may implement animations that aren't based on mouse hover, so we would need to pass a function clbk specific to do the condition check for the interuption )
      init_value_x: target_mesh.geom.pos[0],
      init_value_y: target_mesh.geom.pos[1],
      cur_value_x: target_mesh.geom.pos[0],
      cur_value_y: target_mesh.geom.pos[1],
      start_dimx: target_mesh.geom.dim[0],
      start_dimy: target_mesh.geom.dim[1],
      function_slope: slope_params_pointer,
      animation_index: INT_NULL,
      limit: ammount,
      step: 4,
      is_animation_active: false,
      in_animation_inflate: false,
      in_animation_deflate: false,
      in_animation_inflate_stall: false,
      unlock_anim_auto_completion: false,
   };


   const event_clbk_params = {
      Clbk: Callback_animations_clbk,
      clbk_params: {
         Animation_run: _ready_animations_buffer[animation_type_idx].run,
         Animation_stop: _ready_animations_buffer[animation_type_idx].stop,
         Animation_back_run: _ready_animations_buffer[animation_type_idx + CALLBACK_ANIMATION_TYPE_IDX.COUNT].run, // The count is the offset to the back animation
         Animation_back_stop: _ready_animations_buffer[animation_type_idx + CALLBACK_ANIMATION_TYPE_IDX.COUNT].stop,
         animation_params: animation_params,
         animation_name: `${animation_params.function_slope.slope_constant}`,
      },
   }
   const event_clbks_resolve_fn = function (target_mesh = null, event_handler_type) {

      // Call all the callbacks in the event_clbks buffer
      for (let i = 0; i <= target_mesh.event_clbks.boundary; i++) {

         const clbk_params = target_mesh.event_clbks.buffer[i].clbk_params;
         target_mesh.event_clbks.buffer[i].Clbk(clbk_params, event_handler_type);
      }
   }
   Mesh_event_callback_create(target_mesh, event_clbk_params, event_clbks_resolve_fn);

}


/** This is the callback that the target_mesh will call (from its 'event_clbks' buffer)*/
function Callback_animations_clbk(params, event_handler_type) {

   const Animation_run = params.Animation_run;
   const Animation_stop = params.Animation_stop;
   const animation_params = params.animation_params;
   const animation_name = params.animation_name;

   animation_params.unlock_anim_auto_completion = false;



   if ((event_handler_type & EVENT_HANDLER_TYPE.MOUSE_HOVER) && animation_params.is_animation_active && animation_params.in_animation_inflate) {
      return;
   }

   /** Case we hover on deflated animation, stop deflate and start inflate ASAP */
   if ((event_handler_type & EVENT_HANDLER_TYPE.MOUSE_HOVER) && animation_params.in_animation_deflate) {

      Callback_animations_replace_byidx(animation_params.animation_index, Animation_run, Animation_stop, animation_params);
      animation_params.is_animation_active = true;
      animation_params.in_animation_inflate = true;
      animation_params.in_animation_deflate = false;
      animation_params.in_animation_inflate_stall = true;

      return;

   }

   /** Avoid inflate without a deflate animation been run. Case the un-hover happened before the inflate animation finished */
   if ((event_handler_type & EVENT_HANDLER_TYPE.MOUSE_UNHOVER) && animation_params.is_animation_active && animation_params.in_animation_inflate_stall && animation_params.in_animation_inflate) {
      animation_params.unlock_anim_auto_completion = true;
      animation_params.lock = true;
      return;
   }

   // Do not 'disturb' if already in animation. And do not start the deflate animation, if the animation is in inflate stage
   if (animation_params.is_animation_active === false && (event_handler_type & EVENT_HANDLER_TYPE.MOUSE_UNHOVER) === 0) {

      if (animation_params.in_animation_inflate === false) {

         // Init the animation's parameters: start_pos and cur_value_x of the target mesh.
         animation_params.init_value_x = animation_params.target_mesh.geom.pos[0];
         animation_params.init_value_y = animation_params.target_mesh.geom.pos[1];
         animation_params.cur_value_x = animation_params.init_value_x;
         animation_params.cur_value_y = animation_params.init_value_y;
         
         const anim_idx = Callback_animations_create(Animation_run, Animation_stop, animation_params, `Run:${animation_name}`);
         animation_params.animation_index = anim_idx;
         animation_params.is_animation_active = true;
         animation_params.in_animation_inflate = true;
         animation_params.in_animation_inflate_stall = true;
      }
   }
   // Case the inflate anim has alredy finished
   else if (animation_params.is_animation_active && animation_params.in_animation_inflate === false && animation_params.in_animation_deflate === false) {

      animation_params.in_animation_inflate_stall = false;
      const anim_idx = Callback_animations_create(params.Animation_back_run, params.Animation_back_stop, animation_params, `Run:${animation_name}`);
      animation_params.animation_index = anim_idx;
      animation_params.in_animation_deflate = true;

   }


}










/** Move in X & Y direction */
function Animation_move_xy_inflate_run(params) {

   const target_mesh = params.target_mesh;

   const amt = params.step;
   params.cur_value_x -= amt;
   params.cur_value_y -= amt * .3;

   Gl_set_wpos_xy(target_mesh.gfx, params.cur_value_x + target_mesh.geom.dim[0], params.cur_value_y + target_mesh.geom.dim[1]);

   if (params.cur_value_x > params.init_value_x - params.limit) 
      return true;
   else return false;

}
/** */
function Animation_move_xy_inflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.in_animation_inflate = false;
   params.animation_index = INT_NULL;

   if (params.unlock_anim_auto_completion) {

      params.in_animation_inflate_stall = false;

      const anim_idx = Callback_animations_create(Animation_move_xy_deflate_run, Animation_move_xy_deflate_stop, params, `Stop:${params.function_slope.slope_constant}`)
      params.animation_index = anim_idx; // Must update the animation index to the newly created Stop animation
      params.in_animation_deflate = true;
   }

   return false;
}
/** */
function Animation_move_xy_deflate_run(params) {

   const target_mesh = params.target_mesh;

   const amt = params.step;
   params.cur_value_x += amt;
   params.cur_value_y += amt * .3;

   Gl_set_wpos_xy(target_mesh.gfx, params.cur_value_x + target_mesh.geom.dim[0], params.cur_value_y + target_mesh.geom.dim[1]);

   if (params.cur_value_x < params.init_value_x) return true;
   else return false;
}
/** */
function Animation_move_xy_deflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.animation_index = INT_NULL; // Denote animation removal from current object

   params.in_animation_deflate = false;
   params.is_animation_active = false;
   params.lock = false;
   params.unlock_anim_auto_completion = false;

   return false;
}

/** Move in X direction */
function Animation_move_x_inflate_run(params) {

   const target_mesh = params.target_mesh;

   const amt = params.step;
   params.cur_value_x -= amt;

   Gl_set_wpos_x(target_mesh.gfx, params.cur_value_x + target_mesh.geom.dim[0]);

   if (params.cur_value_x > params.init_value_x - params.limit) return true;
   else {

      params.cur_value_x;
      return false;
   }

}
/** */
function Animation_move_x_inflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.in_animation_inflate = false;
   params.animation_index = INT_NULL;

   if (params.unlock_anim_auto_completion) {

      params.in_animation_inflate_stall = false;

      const anim_idx = Callback_animations_create(Animation_move_x_deflate_run, Animation_move_x_deflate_stop, params, `Stop:${params.function_slope.slope_constant}`)
      params.animation_index = anim_idx; // Must update the animation index to the newly created Stop animation
      params.in_animation_deflate = true;
   }

   return false;
}
/** */
function Animation_move_x_deflate_run(params) {

   const target_mesh = params.target_mesh;

   const amt = params.step;
   params.cur_value_x += amt;

   Gl_set_wpos_x(target_mesh.gfx, params.cur_value_x + target_mesh.geom.dim[0]);

   if (params.cur_value_x < params.init_value_x) return true;
   else return false;
}
/** */
function Animation_move_x_deflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.animation_index = INT_NULL; // Denote animation removal from current object

   params.in_animation_deflate = false;
   params.is_animation_active = false;
   params.lock = false;
   params.unlock_anim_auto_completion = false;

   return false;
}










/** Scale */
function Animation_scale_inflate_run(params) {

   const target_mesh = params.target_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const ammount = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();


   const slope = Logarithmic_interpolation(timer, slope_constant);

   const amt = (slope * ammount);
   const sizex = params.start_dimx + amt;
   const sizey = params.start_dimy + amt * .3;
   // const sizex = target_mesh.geom.dim[0] + amt;
   // const sizey = target_mesh.geom.dim[1] + amt;

   target_mesh.geom.dim[0] = sizex;
   target_mesh.geom.dim[1] = sizey;
   Mesh_update_set_dim_xy(target_mesh);
   Gl_set_dim_xy(target_mesh.gfx, sizex, sizey);

   // target_mesh.geom.dim[0] = sizex;
   // target_mesh.geom.dim[1] = sizey;

   /** Keep target mesh pinned left-up corner */
   // const diffx = target_mesh.geom.pos[0] + sizex;
   // const diffy = target_mesh.geom.pos[1] + sizey;
   // Gl_set_wpos_xy(target_mesh.gfx, diffx, diffy);

   if (target_mesh.sid.attr & SID.ATTR.R_CORNERS) {
      // Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners * amt);
      // Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners * (slope + 1.0));
      // Gl_set_attr_round_corners(target_mesh.gfx, slope * amt);
      Gl_set_attr_round_corners(target_mesh.gfx, amt);
      // Gl_set_attr_round_corners(target_mesh.gfx, slope);
   }


   /**
    * // TODO: Implement an ability to stop the animation at any point, if the user has unhovered the target mesh
    * We need to access the STATE of the target_mesh, as well as if the ability is enabled.
    */
   if(params.interupt && STATE.mesh.hoveredIdx !== target_mesh.mesh_bufferidx) 
      return false;
   if (slope < 1.) return true;
   else {
      return false;
   }

}
/** */
function Animation_scale_inflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.in_animation_inflate = false;
   params.animation_index = INT_NULL;

   if (params.unlock_anim_auto_completion) {

      const anim_idx = Callback_animations_create(Animation_scale_deflate_run, Animation_scale_deflate_stop, params, `Stop:${params.function_slope.slope_constant}`)
      params.animation_index = anim_idx; // Must update the animation index to the newly created Stop animation
      params.unlock_anim_auto_completion = false;
   }

   return false;
}
/** */
function Animation_scale_deflate_run(params) {

   const target_mesh = params.target_mesh;
   const slope_constant = params.function_slope.GetSlope();
   const ammount = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();


   const slope = Logarithmic_interpolation(timer, slope_constant);

   const amt = ((1. - slope) * ammount);
   const sizex = params.start_dimx + amt;
   const sizey = params.start_dimy + amt * .3;

   Mesh_set_dim_xy(target_mesh, sizex, sizey);
   Gl_set_dim_xy(target_mesh.gfx, sizex, sizey);

   // target_mesh.geom.dim[0] = sizex;
   // target_mesh.geom.dim[1] = sizey;

   /** Keep target mesh pinned left-up corner */
   // const diffx = target_mesh.geom.pos[0] + sizex;
   // const diffy = target_mesh.geom.pos[1] + sizey;
   // Gl_set_wpos_xy(target_mesh.gfx, diffx, diffy);

   if (target_mesh.sid.attr & SID.ATTR.R_CORNERS) {
      // Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners * (slope + 1));
      Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners);
      
   
   }


   if (slope < 1.) return true;
   else {
      params.is_animation_active = false;
      return false;
   }
}
/** */
function Animation_scale_deflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.animation_index = INT_NULL; // Denote animation removal from current object

   params.in_animation_deflate = false;
   params.is_animation_active = false;
   params.lock = false;

   return false;
}










/** Round Corners */
function Animation_rcorners_inflate_run(params) {

   const target_mesh = params.target_mesh;
   const slope_constant = params.function_slope.GetSlope();
   // const ammount = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();


   const slope = Logarithmic_interpolation(timer, slope_constant);

   const amt = (slope+1);

   // console.log(amt)

   if (target_mesh.sid.attr & SID.ATTR.R_CORNERS) {
      Gl_set_attr_round_corners(target_mesh.gfx, target_mesh.mat.style.rcorners * amt);
      // target_mesh.mat.style.rcorners = amt;

   }


   // if(params.interupt && STATE.mesh.hoveredIdx !== target_mesh.mesh_bufferidx) 
   //    return false;
   if (slope < .99) return true;
   else {
      return false;
   }

}
/** */
function Animation_rcorners_inflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.in_animation_inflate = false;
   params.animation_index = INT_NULL;

   if (params.unlock_anim_auto_completion) {

      const anim_idx = Callback_animations_create(Animation_rcorners_deflate_run, Animation_rcorners_deflate_run, params, `Stop:${params.function_slope.slope_constant}`)
      params.animation_index = anim_idx; // Must update the animation index to the newly created Stop animation
      params.unlock_anim_auto_completion = false;
   }

   return false;
}
/** */
function Animation_rcorners_deflate_run(params) {

   const target_mesh = params.target_mesh;
   const slope_constant = params.function_slope.GetSlope();
   // const ammount = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();


   const slope = Logarithmic_interpolation(timer, slope_constant);

   const amt = 1. - slope;

   // console.log(amt)

   // if (target_mesh.sid.attr & SID.ATTR.R_CORNERS) {
   //    Gl_set_attr_round_corners(target_mesh.gfx, (target_mesh.mat.style.rcorners * amt)+target_mesh.mat.style.rcorners);
   // }


   if (slope < .99) return true;
   else {
      params.is_animation_active = false;
      return false;
   }
}
/** */
function Animation_rcorners_deflate_stop(params) {

   params.function_slope.SetTimer(0);
   params.animation_index = INT_NULL; // Denote animation removal from current object

   params.in_animation_deflate = false;
   params.is_animation_active = false;
   params.lock = false;

   return false;
}