"use strict"

import { Callback_animations_create } from "../../Engine/Animations/CallbackAnimations.js";
import { Mesh_animations_create } from "../../Engine/Animations/MeshAnimations.js";
import { Create_rect_mesh } from "../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Mesh_unif_set_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { BLUE, GREEN, GREY, RED, YELLOW } from "../../Engine/Drawables/Material/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Events/EventFunctions.js";
import { Gl_set_angle } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Logarithmic_interpolation } from "../../Helpers/Math/MathFunctions.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties } from "../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Mesh_rotate_z } from "../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_event_callback_create } from "../../Engine/Drawables/Operations/MeshPropertiesFunctions.js";
import { Layout_basic_pre_render } from "../../Engine/Drawables/Operations/AlignNestedSections.js";
import { View_render_from_view_NEW } from "../../Engine/Core/Views/MeshBufferViews.js";
import { Vertex_buffer_calculate_vertexbuffer_render_group_starts } from "../../Graphics/Buffers/VertexBuffers.js";







let rotation = 0;



export function Board_rotations(x = 0, y = 0, root_widget = 0x0, transparency = 1, rows=12, columns=5, rect_size=25, controls_create = true) {

   let total_height = 10;

   const size = rect_size;
   const scale_down = .5;
   const rcorners = size/2;
   // const transparency = .06;

   let controls_section = null;
   

   const pad = 10;
   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [20, 20], pos: [x + pad, y + total_height * 2, 0], col: TRANSPARENCY(GREY[1], transparency*.0), name:'BoardRotationsPanel' }));
   Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, listener:{type:LISTEN_EVENT_TYPES.MOVE} })
   section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);


   const dim = [size, size]
   let color_arr = [TRANSPARENCY(RED[8], transparency), TRANSPARENCY(BLUE[9], transparency), TRANSPARENCY(YELLOW[7], transparency), TRANSPARENCY(GREEN[6], transparency),];
   const color = [color_arr[0], color_arr[1], color_arr[2], color_arr[3],]
   let k = 0;
   const inner_pad = [size/8, size/16];
   let align = LAYOUT.HORIZONTAL
   for (let i = 0; i < columns * rows; i++) {

      k += 1; if (k >= 4) k = 0;
      color[0] = color_arr[k++]; if (k >= 4) k = 0;
      color[1] = color_arr[k++]; if (k >= 4) k = 0;
      color[2] = color_arr[k++]; if (k >= 4) k = 0;
      color[3] = color_arr[k++]; if (k >= 4) k = 0;
      // color[3] = 1.; k++; if (k >= 4) k = 0;

      if (i % columns === 0) inner_pad[0] = 0
      else inner_pad[0] = size/3;

      
      const mesh = Create_rect_mesh(Style_rect_default_properties({ pad: inner_pad, dim: dim, col: color }));
      Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: rcorners, enable_attr_angle: true, enable_col_per_vertex: color, listener:{type:LISTEN_EVENT_TYPES.HOVER} });
      mesh.align.flags = (i % columns === 0) ? LAYOUT.VERTICAL : align;
      section.AddItem(mesh);

      const equalize = 4;
      const time_step = 0.01/equalize, slope_const = .2, angle = 4;
      const slope_params_pointer = new Function_Slope(slope_const, time_step, angle);

      const params = {
         mesh: mesh,
         function_slope: slope_params_pointer,
         max_rotations: Math.PI*angle,
         equalize: equalize,
      };


      const Clbk = (params_c) => {
            if (params_c.o.in_animation === false)
               Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Run`);
         }
      const clbk_params = { o: slope_params_pointer, };
      Mesh_event_callback_create(mesh, Clbk, clbk_params);

   }



   /****************************************************************************************************************/
   // Render
   section.GenGfxCtx();
   
   Layout_basic_pre_render(section);

   Vertex_buffer_calculate_vertexbuffer_render_group_starts();
   View_render_from_view_NEW(section.group_bufferidxs[0]);


   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);

   // Set the unif wpos back to 0, because it akes the initial 10 px position
   Mesh_unif_set_vb_root_wpos(section.children.buffer[0].root_posidx, 0, 0);


   for (let i = 0; i <= section.children.boundary; i++) { // Color animations

      const mesh = section.children.buffer[i];
      Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, mesh, (i+1)*.1*.0005, .35, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, mesh, (i+1)*.1*.0002, .35, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, mesh, (i+1)*.1*.0003, .35, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, mesh, (i+1)*.1*.0006, .35, .85, 0.0, .3, true);

      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, mesh, (i+1)*.1*.0002, .1, .85, 0.0, .2, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, mesh, (i+1)*.1*.001, .1, .85, 0.0, .2, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, mesh, (i+1)*.1*.00101, .1, .85, 0.0, .2, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, mesh, (i+1)*.1*.00102, .1, .85, 0.0, .2, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, mesh, (i+1)*.1*.0004, .9, 1., 0.0, .2, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, mesh, (i+1)*.1*.0005, .9, 1., 0.0, .2, true);
      
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, mesh, (i+1)*.1*.005, .1, .85, 0.0, .2, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, mesh, (i+1)*.1*.005, .1, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, mesh, (i+1)*.1*.004, .1, .85, 0.0, .3, true);
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, mesh, (i+1)*.1*.003, .1, .85, 0.0, .3, true);

      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, collectable, .01, .35, .75, _, .35, false)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RG, collectable, .01, .35, .75, _, .35, false)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, collectable, .01, .35, .75, _, .35, false)
      // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RB, collectable, .01, .35, .75, _, .35, true)
      // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.X, mesh, 5., -15., 15., 0);
      // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, mesh, .1, -1., 1., 0);
      // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.ROT, mesh, .01, -1., 1., 0);
   }

   return section
}




function Animation_rotate_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();
   params.function_slope.SetInAnimation(true);

   const slope = Logarithmic_interpolation(timer, slope_constant);

   const rot = (slope * params.equalize * angle);

   Mesh_rotate_z(mesh, rot);
   Gl_set_angle(mesh.gfx, rot);


   if (rot < params.max_rotations) return true;
   else {

      return false;
   }

}
// function Animation_rotate_run(params) {

//    const mesh = params.mesh;
//    const slope_constant = params.function_slope.GetSlope();
//    const angle = params.function_slope.GetAmmount();
//    params.function_slope.IncrementTimer();
//    const timer = params.function_slope.GetTimer();
//    params.function_slope.SetInAnimation(true);

//    const slope = Logarithmic_interpolation(timer, slope_constant);

//    const rot = (slope * angle);

//    mesh.RotateZ(rot);
//    Gl_set_angle(mesh.gfx, rot);


//    if (rot < Math.PI/2) return true;
//    else {

//       return false;
//    }

// }

function Animation_rotate_stop(params) {

   // Callback_animations_create(Animation_rotate_back_run, Animation_rotate_back_stop, params, `Stop`);
   params.function_slope.SetTimer(0);
   params.function_slope.SetInAnimation(false);

   return false;
}

function Animation_rotate_back_run(params) {

   const mesh = params.mesh;
   const slope_constant = params.function_slope.GetSlope();
   const angle = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();
   const timer = params.function_slope.GetTimer();

   const slope = Logarithmic_interpolation(timer, slope_constant);

   const rot = ((1. - slope) * angle);

   Mesh_rotate_z(mesh, rot);
   Gl_set_angle(mesh.gfx, rot);
   // rotation = rot;

   if (slope < 1.) return true;
   else return false
}

function Animation_rotate_back_stop(params) {

   Callback_animations_create(Animation_rotate_run, Animation_rotate_stop, params, `Stop:`);
   params.function_slope.SetTimer(0);

   return false;
}


