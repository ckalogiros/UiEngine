"use strict"

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { Mesh_animations_create } from "../../Engine/Animations/MeshAnimations.js";
import { Create_widget_section } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_set_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLUE, GREEN, GREY, RED, YELLOW } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Gl_set_angle } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";







let rotation = 0;


// let ID = 0;
// function Get_ID() { return ID++; }



// class Function_Slope {
//    constructor(slope_constant = 1.0, time_step = 0.1, scale = 100, name = ID) {

//       this.slope_constant = slope_constant;
//       this.time_step = time_step;
//       this.timer = 0.0;
//       this.scale = scale;
//       this.in_animation = false;

//       if (name) this.name = name;
//       else name = Get_ID();
//    }

//    GetSlope() {
//       return this.slope_constant;
//    }

//    SetSlope(val) {
//       this.slope_constant = val;
//    }

//    GetTimer() {
//       return this.timer;
//    }

//    SetTimer(val) {
//       this.timer = val;
//    }

//    IncrementTimer() {
//       this.timer += this.time_step;
//    }

//    GetValueChange() {
//       return this.scale;
//    }

//    SetValueChange(val) {
//       this.scale = val;
//    }

//    GetInAnimation() {
//       return this.in_animation;
//    }

//    SetInAnimation(val) {
//       this.in_animation = val;
//    }
// }




export function Board_rotations(x = 0, y = 0, root_widget = 0x0, controls_create = true) {

   let total_height = 10;

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
   let color_arr = [RED[9], BLUE[9], YELLOW[9], GREEN[9], ];
   const color = [color_arr[0], color_arr[1], color_arr[2], color_arr[3], ]
   let k = 0;
   for (let i = 0; i < 4*4; i++) {

      k+=1; if(k>=4) k=0;
      color[0] = color_arr[k++]; if(k>=4) k=0;
      color[1] = color_arr[k++]; if(k>=4) k=0;
      color[2] = color_arr[k++]; if(k>=4) k=0;
      color[3] = color_arr[k++]; if(k>=4) k=0;

      // const mesh = Create_widget_section(_, SECTION.VERTICAL|SECTION.RESIZE_PARENT, [0, 0], [pos[0], pos[1], zpos], dim, GREY[7], 'rect' + i, );
      const mesh = Create_widget_section(_, SECTION.VERTICAL|SECTION.RESIZE_PARENT, [0, 0], [pos[0], pos[1], zpos], dim, color, 'rect' + i, );
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_ANGLE);
      mesh.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX)
      // ball.EnableGfxUniforms({ unif: SID.UNIF.SCALE2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
      // ball.EnableGfxUniforms({ fx: SID.FX.FS_GLOW_VEC3 }, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      section.AddItem(mesh);


      // mesh.geom.pos[0] += 10
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
      mesh.CreateEventCallback(event_clbk_params);



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

   // Set the unif wpos back to 0, because it akes the initial 10 px position
   Mesh_unif_set_vb_root_wpos(section.children.buffer[0].root_posidx, 0, 0);


   for (let i = 0; i <= section.children.boundary; i++) { // Color animations
      
      // const mesh = section.children.buffer[i];
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, mesh, (i+1)*.1*.005, .1, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, mesh, (i+1)*.1*.005, .1, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, mesh, (i+1)*.1*.004, .1, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, mesh, (i+1)*.1*.003, .1, .85, 0.0, .3, true);
      
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, collectable, .01, .35, .75, _, .35, false)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RG, collectable, .01, .35, .75, _, .35, false)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, collectable, .01, .35, .75, _, .35, false)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RB, collectable, .01, .35, .75, _, .35, true)
      // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, collectable, .1, -1., 1., 0);
      // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.ROT, collectable, .5, -5., 5., 0);
   }

   return section
}




function Animation_rotate_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetValueChange();
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
   const angle = params.function_slope.GetValueChange();
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


