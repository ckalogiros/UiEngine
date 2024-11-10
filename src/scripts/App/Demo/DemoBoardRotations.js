"use strict"

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { Create_widget_section } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { GREY } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Gl_set_angle } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";







let rotation = 0;


let ID = 0;
function Get_ID() { return ID++; }



class Function_Slope {
   constructor(slope_constant = 1.0, time_step = 0.1, scale = 100, name = ID) {

      this.slope_constant = slope_constant;
      this.time_step = time_step;
      this.timer = 0.0;
      this.scale = scale;
      this.in_animation = false;

      if (name) this.name = name;
      else name = Get_ID();
   }

   GetSlope() {
      return this.slope_constant;
   }

   SetSlope(val) {
      this.slope_constant = val;
   }

   GetTimer() {
      return this.timer;
   }

   SetTimer(val) {
      this.timer = val;
   }

   IncrementTimer() {
      this.timer += this.time_step;
   }

   GetAngle() {
      return this.scale;
   }

   SetAngle(val) {
      this.scale = val;
   }

   GetInAnimation() {
      return this.in_animation;
   }

   SetInAnimation(val) {
      this.in_animation = val;
   }
}




export function Board_rotations(x = 0, y = 0, root_widget = 0x0, controls_create = true) {

   let total_height = 20;

   const scale_down = .5;
   const feather = 2;
   const rcorners = 10;

   let controls_section = null;


   const pad = 10;
   const section_size = 200-15;
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [4, 4], [x + pad, y + total_height * 2, 0], [section_size, section_size], GREY[3]);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   section.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, rcorners);
   if (!PLATFORM.ANY_SMARTPHONE_DEVICE) section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.StateEnable(MESH_STATE.IS_RESIZEABLE);
   section.SetName('Elastic_collisions');



   const size = 40;
   const dim = [size, size]
   const pos = [10, 10, 1];
   let zpos = 1;
   for (let i = 0; i < 4*4; i++) {


      const mesh = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [pos[0], pos[1], zpos], dim, GREY[7], 'rect' + i, );
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);
      mesh.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
      // ball.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      // ball.EnableGfxUniforms({ fx: SID.FX.FS_GLOW_VEC3 }, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      section.AddItem(mesh);

      pos[0]+=size*2+pad

      if(pos[0] > section_size*2-size){
         pos[1] += size*2 +pad;
         pos[0] = pad
      }



      // const mesh = section.children.buffer[0]
      
      const time_step = 0.01, slope_const = .4, angle = 4;
      const slope_params_pointer = new Function_Slope(slope_const, time_step, angle);
   
      const params = {
         mesh: mesh,
         function_slope: slope_params_pointer,
      };
   
      // Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Run`);
      
      const event_clbk_params = {
         Clbk: (params_c)=>{
            if(params_c.o.in_animation === false)
               Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Run`);
         },
         clbk_params: {
            o:slope_params_pointer,
         },
     }
      mesh.CreateEventCallback(event_clbk_params)
   }



   /****************************************************************************************************************/
   // Render
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   return section
}




function Animation_rotate_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAngle();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   params.function_slope.SetInAnimation(true);

   const slope = Logarithmic_interpolation(timer, slope_constant);

   const rot = (slope * angle);
   // const rot = slope*.05;
   
   mesh.RotateZ(rot);
   // mesh.RotateY(rot);
   Gl_set_angle(mesh.gfx, rot);
   // mesh.RotateAddZ(rot);
   // Gl_add_angle(mesh.gfx, rot);

   // console.log(rot)
   
   
   // if (slope < 1.) return true;
   if (rot < Math.PI) return true;
   else {
      
      return false;
   }

}

function Animation_rotate_stop(params) {
   
   // Callback_animations_create(Animation_rotate_back_run, Animation_rotate_back_stop, params, `Stop`);
   params.function_slope.SetTimer(0);
   params.function_slope.SetInAnimation(false);

   return false;
}

function Animation_rotate_back_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAngle();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);
   
   const rot = ((1.-slope) * angle);
   
   mesh.RotateZ(rot);
   Gl_set_angle(mesh.gfx, rot);
   rotation = rot;

   if (slope < 1.) return true;
   else return false
}

function Animation_rotate_back_stop(params) {
   
   Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Stop:`);
   params.function_slope.SetTimer(0);

   return false;
}


