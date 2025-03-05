"use strict";

import { Create_widget_section } from "../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../Engine/Core/Views/RootView.js";
import { BLUE, BLUEL, GREEN, GREY, ORANGE, REDL, ORANGER, PURPLE, PURPLEB, PURPLER, RED, YELLOWR, CYAN } from "../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../Engine/Drawables/Widgets/WidgetSlider.js";
import { Gl_set_angle, Gl_set_attr_round_corners, Gl_set_dim_xy, Gl_set_wpos_xy } from "../Graphics/Buffers/VertexBuffersOps.js";
import { Widget_ready_label, Widget_ready_slider } from "./Widgets/ReadyWidgets.js";




export function Test_alignment() {

   let mesh = null;
   let x = 100, y = 100;


   // mesh = Test_alignment_test(600, y); y += mesh.geom.dim[1] * 2 + 20;

   // mesh = Test_alignment_nested_11(600, y); y+=mesh.geom.dim[1]*2+20;
   // mesh = Test_alignment_nested_vert_22(50, 40); y += mesh.geom.dim[1] * 2 + 20;
   // mesh = Test_alignment_nested_hor_22(50, 50); y += mesh.geom.dim[1] * 2 + 20;

   // mesh = Test_alignment_nested_32(x, y);y+=mesh.geom.dim[1]*2+20;
   // mesh = Test_alignment_nested_hor_vert_11(x, y); y += mesh.geom.dim[1] * 2 + 20;
   // mesh = Test_alignment_nested_vert_hor_33(x, y); y += mesh.geom.dim[1] * 2 + 20;
   // mesh = Test_alignment_nested_vert_hor_33(50, 100); 


   // mesh = Test_alignment_slider_hor_1(x, y); y+=mesh.geom.dim[1]*2+20;
   // mesh = Test_alignment_slider_hor_3(x, y); y+=mesh.geom.dim[1]*2+20;
   // mesh = Test_alignment_slider_vert_3(x, 200); y += mesh.geom.dim[1] * 2 + 20;
   // mesh = Test_alignment_slider_vert_hor_23(400, y); y += mesh.geom.dim[1] * 2 + 20
   // mesh = Test_alignment_slider_vert_23(760, 300); y += mesh.geom.dim[1] * 2 + 20;

   Test_slider_control_pad(100, 100);
}




/** */
// export function Align_position_pre(mesh, prev_pos = [0, 0], row_max_size_x = 0, start_pos_x = 0, start_pos_y = 0, prev_dim = [0, 0]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    const cur_pos = [prev_pos[0], prev_pos[1]];
//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    let total_size_x = 0
//    let total_size_y = 0
//    let row_max_size_xxxxxx = 0


//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);



//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {


//          start_pos_x += cur_pad_x;
//          start_pos_y += cur_pad_y;

//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];

//          const ret = Align_position_pre(cur_mesh, cur_pos, row_max_size_x, start_pos_x, start_pos_y, prev_dim);
//          start_pos_x -= cur_pad_x;
//          start_pos_y -= cur_pad_y;

//          {
//             if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//                // if (total_size_x < ret.dim_x + cur_pad_x) {
//                //    total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
//                // }
//                total_size_y += ret.dim_y + cur_pad_y;

//             }
//             else if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {
//                if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//             }
//             if (row_max_size_xxxxxx < ret.dim_y * 2 + cur_pad_y * 2)
//                row_max_size_xxxxxx = ret.dim_y * 2 + cur_pad_y * 2;
//          }


//          const next_mesh = mesh.children.buffer[i + 1];
//          if (next_mesh) {

//             if (next_mesh.align_flags & ALIGN_2.VERTICAL) {
//                // cur_pos[0] = start_pos_x+mesh.geom.pos[0]-pad_x;
//                cur_pos[0] = mesh.geom.pos[0] + pad_x;
//                if (row_max_size_xxxxxx > ret.dim_y * 2 + cur_pad_y * 2) {
//                   cur_pos[1] += row_max_size_xxxxxx;
//                }
//                else cur_pos[1] += cur_mesh.geom.dim[1] * 2;
//                row_max_size_xxxxxx = 0; // MUST: Reset row_max_size_y for every new row of meshes
//             }
//             else if (next_mesh.align_flags & ALIGN_2.HORIZONTAL) {
//                cur_pos[0] += cur_mesh.geom.dim[0] * 2;
//             }

//          }
//       }
//       // else {

//       //    // start_pos_x += cur_pad_x;
//       //    const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);
//       //    // start_pos_x -= cur_pad_x;

//       //    // row_dim_x += ret.dim_x

//       //    cur_mesh.geom.pos[0] = cur_pos[0]
//       //    cur_mesh.geom.pos[1] = cur_pos[1]

//       //    if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//       //       total_size_x += ret.dim_x;
//       //       total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//       //       cur_pos[0] += ret.dim_x * 2;

//       //       // if (i !== 0) accum_row_size_x = 0;
//       //    }
//       //    else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//       //       total_size_y += ret.dim_y; // Accumulate in y-dimention
//       //       if (total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis

//       //       cur_pos[1] += ret.dim_y * 2;
//       //       cur_pos[0] = start_pos_x;
//       //       // cur_pos[0] = 0;
//       //    }
//       // }
//    }


//    // row_max_size_xxxxxx = 0
//    return {
//       row_max_size_xxxxxx: row_max_size_xxxxxx,
//       dim: [total_size_x, total_size_y],
//       prev_dim: [prev_dim[0], prev_dim[1]],
//    }

// }

function Intermidiate_fn_styles_get_pad_1(mesh) {

   const pad = mesh.StylesGetPad(STYLES.AXIS.ALL)
   return {
      pad_x: pad[0],
      pad_y: pad[1],
      // pad_x:mesh.StylesGetPad(STYLES.AXIS.Y),
   }
}
function Intermidiate_fn_styles_get_pad_2() {

}


/** */
export function Align_pre_simple(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
   const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);
   // const pad_x = pad[0];
   // const pad_y = pad[1];
   // const pad_y = 20;
   // mesh.StylesSetPad([pad[0],pad[1]]);


   let cur_pos_x = pos_x;
   let cur_pos_y = pos_y;
   cur_pos_x += pad_x;
   cur_pos_y += pad_y;

   let total_size_x = 0;
   let total_size_y = 0;

   let row_max_size_y = 0

   let accum_row_size_x = 0
   let accum_row_max_size_x = 0
   let accum_row_size_y = 0
   let row = 0
   // let max = 0;
   // let cur_mesh = mesh;


   for (let i = 0; i <= mesh.children.boundary; i++) {

      const cur_mesh = mesh.children.buffer[i];

      const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
      const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);
      // const cur_pad_x = pad[0];
      // const cur_pad_y = pad[1];
      // cur_mesh.StylesSetPad([cur_pad_x,cur_pad_y]);

      if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {

         cur_mesh.geom.pos[0] = cur_pos_x;
         cur_mesh.geom.pos[1] = cur_pos_y;

         const ret = Align_pre_simple(cur_mesh, cur_pos_x, cur_pos_y, pad);


         if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

            // if (total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
            total_size_y += ret.dim_y + cur_pad_y;
            if (i !== 0) accum_row_size_x = 0; row++;
         }
         else if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

            // total_size_x += ret.dim_x + cur_pad_x; // Set in x-axis
            if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
            if (i !== 0) accum_row_size_y = 0;
         }

         accum_row_size_x += ret.dim_x + cur_pad_x;
         if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

         if (accum_row_size_y < ret.dim_y + cur_pad_y) {
            accum_row_size_y = ret.dim_y + cur_pad_y;
         }
         if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) {
            row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;
         }


         cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
         cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;


         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align_flags & ALIGN_2.VERTICAL) {
               cur_pos_x = mesh.geom.pos[0] + pad_x;
               if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) {
                  cur_pos_y += row_max_size_y;
               }
               else cur_pos_y += cur_mesh.geom.dim[1] * 2;
               row_max_size_y = 0;
            }
            else if (next_mesh.align_flags & ALIGN_2.HORIZONTAL) {
               cur_pos_x += cur_mesh.geom.dim[0] * 2;
            }
         }
      }
      else {

         const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

         if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

            total_size_x += ret.dim_x;
            total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis
            if (i !== 0) accum_row_size_x = 0;
         }
         else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
            total_size_y += ret.dim_y; // Accumulate in y-dimention
            // if (total_size_x < ret.dim_x) 
            total_size_x = ret.dim_x; // Set in x-axis
         }

         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align_flags & ALIGN_2.HORIZONTAL) {
               cur_pos_x += ret.dim_x * 2;
            }
            else if (next_mesh.align_flags & ALIGN_2.VERTICAL) {
               cur_pos_y += ret.dim_y * 2;
               cur_pos_x = mesh.geom.pos[0] + pad_x;
            }
         }

         // accum_row_size_x += ret.dim_x + cur_pad_x;
         if (accum_row_size_x < total_size_x) accum_row_size_x = total_size_x;
         if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

      }

      if (cur_mesh.gfx) {
         // if(cur_mesh.mesh_bufferidx===25) 
         {

            // Gl_set_wpos_xy(cur_mesh.gfx, cur_mesh.geom.pos[0]+cur_mesh.geom.dim[0], cur_mesh.geom.pos[1]+cur_mesh.geom.dim[0])
            // // Gl_set_wpos_xy(cur_mesh.gfx, cur_mesh.geom.pos[0], cur_mesh.geom.pos[1])
            // // cur_mesh.geom.UpdateSetWposXY(cur_mesh.gfx);
            // // cur_mesh.geom.UpdateSetDimXY(cur_mesh.gfx);
            // cur_mesh.geom.SetDim([cur_mesh.geom.dim[0], cur_mesh.geom.dim[1]], cur_mesh.gfx);
            // Gl_set_dim_xy(cur_mesh.gfx, cur_mesh.geom.dim[0], cur_mesh.geom.dim[1]);
            // // Gl_set_attr_round_corners();
            // // if(cur_mesh.mesh_bufferidx===24) console.log(cur_mesh.geom.dim)
         }
      }
   }

   if (mesh.gfx) {
      Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+mesh.geom.dim[0], mesh.geom.pos[1]+mesh.geom.dim[1])
      // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0], mesh.geom.pos[1]);
      // mesh.geom.UpdateSetWposXY(mesh.gfx);
      mesh.geom.SetDim([mesh.geom.dim[0], mesh.geom.dim[1]], mesh.gfx);
      Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);
   }
   // console.log(mesh.GetName())

   const size_x = accum_row_max_size_x;
   const size_y = total_size_y;
   return {
      dim: [accum_row_max_size_x, size_y],
      dim_x: size_x,
      dim_y: size_y,
      // accum_row_max_size_x: accum_row_max_size_x,
   }


}
/** */
// export function Align_pre_simple(mesh, some = [0, 0], row_max_size_y = 0, row_max_size_x = 0, start_pos_x = 0, start_pos_y = 0, prev_dim = [0, 0]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    const cur_pos = [some[0], some[1]];
//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    let total_size_x = 0;
//    let total_size_y = 0;

//    if (row_max_size_y === 0) row_max_size_y = mesh.geom.pos[1] + pad_y;


//    let accum_row_size_x = 0
//    let accum_row_max_size_x = 0
//    let row = 0
//    let max = 0;
//    let accum_row_max_y = 0;
//    let prev_row_max_y = 0
//    let max_y = 0
//    let cur_mesh = mesh;

//    // console.log('---- new ')

//    for (let i = 0; i <= mesh.children.boundary; i++) {
//       // total_size_y = 0;

//       cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//       if(cur_mesh.mesh_bufferidx === 16) {
//          // console.log(
//          //    '1 #########', 
//          //    '\n   total_size_y', total_size_y,
//          //    '\n   max_y', max_y,
//          //    '\n   cur_mesh.geom.dim[1]', cur_mesh.geom.dim[1],
//          // )
//       }


//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {

//          const ret = Align_pre_simple(cur_mesh, cur_pos, row_max_size_y, row_max_size_x, start_pos_x, start_pos_y, prev_dim);

//          if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             if(cur_mesh.mesh_bufferidx === 16) {
//             //    console.log(
//             //       '2 #########', 
//             //       '\n   total_size_y', total_size_y,
//             //       '\n   ret.dim_y', ret.dim_y,
//             //       '\n   max_y', max_y,
//             //       '\n   cur_mesh.geom.dim[1]', cur_mesh.geom.dim[1],
//             //    )
//             }

//             if (total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
//             total_size_y += ret.dim_y + cur_pad_y;
//             if (i !== 0) 
//                accum_row_size_x = 0; row++;

//          }
//          else if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             total_size_x += ret.dim_x + cur_pad_x; // Set in x-axis
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//             // if (total_size_y < ret.dim_y + cur_pad_y) total_size_y += ret.dim_y + cur_pad_y;

//          }

//          accum_row_size_x += ret.dim_x + cur_pad_x;
//          if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;

//          if (max < ret.dim_y + cur_pad_y) {
//             max = ret.dim_y + cur_pad_y;
//          }



//          const next_mesh = mesh.children.buffer[i+1];
//          if(next_mesh) {

//             if (next_mesh.align_flags & ALIGN_2.VERTICAL) {

//                if(cur_mesh.children.boundary > INT_NULL) {

//                   // accum_row_max_y += cur_mesh.geom.dim[1];
//                   accum_row_max_y += ret.dim_y + cur_pad_y;
//                   // console.log('    accum_row_max_y', accum_row_max_y, 'total_size_y', total_size_y,  cur_mesh.GetName())
//                   console.log('    --- += ', ret.dim_y + cur_pad_y, cur_mesh.GetName())
//                   // total_size_y += accum_row_max_y
//                }

//             }
//          }
//          console.log('    accum_row_max_y', accum_row_max_y, 'max', max, 'total_size_y', total_size_y,  cur_mesh.GetName())

//       }
//       // else {

//       //    // start_pos_x += cur_pad_x;
//       //    const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);
//       //    // start_pos_x -= cur_pad_x;

//       //    // row_dim_x += ret.dim_x

//       //    if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//       //       total_size_x += ret.dim_x;
//       //       total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//       //       cur_pos[0] += ret.dim_x * 2;

//       //       if (i !== 0) accum_row_size_x = 0;
//       //    }
//       //    else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//       //       total_size_y += ret.dim_y; // Accumulate in y-dimention
//       //       if (total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis

//       //       cur_pos[1] += ret.dim_y * 2;
//       //       y += ret.dim_y * 2;
//       //       // cur_pos[0] = start_pos_x;
//       //       // cur_pos[0] = 0;

//       //    }

//       //    accum_row_size_x += ret.dim_x + cur_pad_x;
//       //    if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

//       // }

//    }

//    // const yy = (max_y > total_size_y) ? max_y : total_size_y
//    // const yy = total_size_y+accum_row_max_y;
//    // if(accum_row_max_y) accum_row_max_y += pad_y
//    // const yy = total_size_y + accum_row_max_y;
//    const yy = total_size_y ;
//    // const yy = max ;
//    // accum_row_max_y = 0
//    return {
//       dim: [accum_row_max_size_x, yy],
//       prev_mesh:cur_mesh,
//       // dim: [accum_row_max_size_x, max_y],
//       // prev_dim: [cur_dim[0], cur_dim[1]],
//       // max_dim: [max_dim[0], max_dim[1]],
//       accum_row_max_size_x: accum_row_max_size_x,
//    }


// }
/** */
// export function Align_pre_simple(mesh, some = [0, 0], row_max_size_y = 0, row_max_size_x=0, start_pos_x = 0, start_pos_y = 0, prev_dim = [0,0]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    const cur_pos = [some[0], some[1]];
//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    let row_dim_x = 0;
//    let total_size_x = 0;
//    let total_size_y = 0;

//    let max_dim = [0, 0];
//    let cur_dim = [0, 0];


//    if (row_max_size_y === 0) row_max_size_y = mesh.geom.pos[1] + pad_y;


//    let accum_row_size_x = 0
//    let accum_row_max_size_x = 0
//    let row = 0
//    let max_y = 0
//    let add_max_y = false;

//    // console.log('---- new ')

//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//       // console.log(cur_mesh.GetName())
//       // if(cur_mesh.mesh_bufferidx===16)
//       //    console.log


//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {


//          if(cur_mesh.mesh_bufferidx===24)
//             console.log('------------')

//          const ret = Align_pre_simple(cur_mesh, cur_pos, row_max_size_y, row_max_size_x, start_pos_x, start_pos_y, prev_dim);

//          if(cur_mesh.mesh_bufferidx===24)
//             console.log('------------')


//          if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {


//             if (total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
//             total_size_y += ret.dim_y + cur_pad_y;
//             // console.log('    ', cur_mesh.GetName(), 'total_size_y', total_size_y*2, 'max_dim[1]', max_dim[1])
//             if(max_dim[0] < total_size_x) {
//                max_dim[0] = total_size_x;
//             }
//             if (max_dim[1] < ret.dim_y) max_dim[1] += ret.dim_y;
//             // console.log('cur_mesh.geom.dim[1]', cur_mesh.geom.dim[1], cur_mesh.GetName())
//             // console.log('    total_size_y', total_size_y, 'max_dim[1]', max_dim[1])
//             row++;
//             if(i!==0) accum_row_size_x = 0;
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL){

//             total_size_x += ret.dim_x + cur_pad_x; // Set in x-axis
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//          }

//          // if (max_dim[1] < total_size_y) max_dim[1] = total_size_y; 

//          accum_row_size_x += ret.dim_x + cur_pad_x;
//          if(accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x


//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;
//          // cur_mesh.geom.dim[1] = ret.max_y + cur_pad_y;

//          // row_dim_x += ret.dim_x + cur_pad_x;
//          // if(row_max_size_y < ret.dim_y*2 + cur_pad_y*2) 
//          //    row_max_size_y = ret.dim_y*2 + cur_pad_y*2;

//          // if(row_max_size_x < ret.dim_x*2 + cur_pad_x*2) 
//          //    row_max_size_x = ret.dim_x*2 + cur_pad_x*2;

//          if(max_y < total_size_y && (cur_mesh.align_flags & ALIGN_2.VERTICAL)) {
//             max_y += total_size_y;
//             console.log('    max_y', max_y, cur_mesh.GetName())
//          }


//          const next_mesh = mesh.children.buffer[i+1];
//          if(next_mesh) {

//             if(next_mesh.align_flags & ALIGN_2.HORIZONTAL) cur_pos[0] += ret.dim_x * 2 + cur_pad_x * 2;
//             if (next_mesh.align_flags & ALIGN_2.VERTICAL) {

//                if (max_dim[1] < ret.dim_y) max_dim[1] += ret.dim_y;
//                // console.log('    total_size_y', total_size_y, 'max_dim[1]', max_dim[1], cur_mesh.GetName())

//                // cur_pos[0] += start_pos_x+pad_x;
//                // cur_pos[0] += start_pos_x;
//                // cur_pos[0] = start_pos_x+cur_mesh.geom.pos[0];
//                // cur_pos[0] = cur_mesh.geom.pos[0];
//                // cur_pos[0] = mesh.geom.pos[0]+pad_x+start_pos_x;
//                // if(row_max_size_y > ret.dim_y*2 + cur_pad_y*2) {
//                //    cur_pos[1] += row_max_size_y;
//                // }
//                // if(row_max_size_xxxxxx > ret.dim_y*2 + cur_pad_y*2) {
//                //    cur_pos[1] += row_max_size_xxxxxx;
//                // }
//                // else {
//                //    cur_pos[1] += ret.dim_y*2 + cur_pad_y*2;
//                // }
//                // row_max_size_y = 0; // MUST: Reset row_max_size_y for every new row of meshes
//                // cur_mesh.geom.dim[0] -= ret.dim_x + cur_pad_x;
//                // row_dim_x = 0;
//             }
//          }

//       }
//       // else {

//       //    start_pos_x += cur_pad_x;
//       //    const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);
//       //    start_pos_x -= cur_pad_x;

//       //    row_dim_x += ret.dim_x

//       //    if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//       //       total_size_x += ret.dim_x;
//       //       // if (total_size_x <= ret.dim_x) total_size_x += ret.dim_x;
//       //       total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//       //       cur_pos[0] += ret.dim_x * 2;
//       //    }
//       //    else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//       //       total_size_y += ret.dim_y; // Accumulate in y-dimention
//       //       if (total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis

//       //       cur_pos[1] += ret.dim_y * 2;
//       //       y += ret.dim_y * 2;
//       //       cur_pos[0] = start_pos_x;

//       //    }


//       //    prev_dim[0] = ret.dim_x;
//       //    prev_dim[1] = ret.dim_y;

//       //    // if (max_dim[0] < total_size_x) max_dim[0] = total_size_x;
//       //    // if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;
//       // }
//       // if (max_dim[0] < total_size_x) max_dim[0] = row_dim_x;
//       // if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;

//    }


//    // const yy = (max_y > total_size_y) ? max_y : total_size_y
//    const yy = total_size_y;
//    return {
//       // dim: [accum_row_max_size_x, total_size_y],
//       dim: [accum_row_max_size_x, yy],
//       // dim: [accum_row_max_size_x,  max_dim[1]],
//       prev_dim: [cur_dim[0], cur_dim[1]],
//       // row_dim_x: row_dim_x,
//       max_dim: [max_dim[0], max_dim[1]],
//       max_y: max_y,
//       accum_row_max_size_x:accum_row_max_size_x,
//    }


// }
/** WITH CALC POSITION */
// export function Align_pre_simple(mesh, some = [0, 0], row_max_size_y = 0, row_max_size_x=0, start_pos_x = 0, start_pos_y = 0, prev_dim = [0,0]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    const cur_pos = [some[0], some[1]];
//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    let row_dim_x = 0;
//    let total_size_x = 0;
//    let total_size_y = 0;

//    let max_dim = [0, 0];
//    let cur_dim = [0, 0];


//    if (row_max_size_y === 0) row_max_size_y = mesh.geom.pos[1] + pad_y;


//    let accum_row_size_x = 0
//    let accum_row_max_size_x = 0
//    let row = 0

//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);



//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {


//          start_pos_x += cur_pad_x;
//          start_pos_y += cur_pad_y;
//          const ret = Align_pre_simple(cur_mesh, cur_pos, row_max_size_y, row_max_size_x, start_pos_x, start_pos_y, prev_dim);
//          start_pos_x -= cur_pad_x;
//          start_pos_y -= cur_pad_y;

//          // accum_row_max_size_x = ret.accum_row_max_size_x

//          // console.log('MEsh', cur_mesh.GetName(), 'total size', total_size_x*2)

//          if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             if (total_size_x < ret.dim_x + cur_pad_x) {
//                total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
//             }
//             total_size_y += ret.dim_y + cur_pad_y;

//             if(max_dim[0] < total_size_x) {
//                max_dim[0] = total_size_x;
//             }

//             if(row_max_size_x < total_size_x)  row_max_size_x=total_size_x
//             row++;
//             if(i!==0) 
//                accum_row_size_x = 0;
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL){
//             total_size_x += ret.dim_x + cur_pad_x; // Set in x-axis
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//             // console.log('row:', row, 'accum_row_size_x', accum_row_size_x)

//          }
//          // if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL)row_dim_x += ret.dim_x + cur_pad_x;

//          if(cur_mesh.mesh_bufferidx===16)
//             console.log

//          accum_row_size_x += ret.dim_x + cur_pad_x;
//          // console.log('    accum_row_max_size_x:', accum_row_max_size_x,'MEsh', cur_mesh.GetName())
//          // console.log('    accum_row_size_x:', accum_row_size_x, 'row', row, )//'MEsh', cur_mesh.GetName())
//          if(accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

//          // cur_mesh.geom.pos[0] = cur_pos[0];
//          // cur_mesh.geom.pos[1] = cur_pos[1];

//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;

//          // cur_dim[0] = cur_mesh.geom.dim[0]
//          // cur_dim[1] = cur_mesh.geom.dim[1]


//          // prev_dim[0] = ret.dim_x;
//          // prev_dim[1] = ret.dim_y;
//          // max_dim[0] = ret.max_dim[0];
//          // max_dim[1] = ret.max_dim[1];

//          row_dim_x += ret.dim_x + cur_pad_x;
//          if(row_max_size_y < ret.dim_y*2 + cur_pad_y*2) 
//             row_max_size_y = ret.dim_y*2 + cur_pad_y*2;

//          if(row_max_size_x < ret.dim_x*2 + cur_pad_x*2) 
//             row_max_size_x = ret.dim_x*2 + cur_pad_x*2;


//          const next_mesh = mesh.children.buffer[i+1];
//          if(next_mesh) {

//             if(next_mesh.align_flags & ALIGN_2.HORIZONTAL) cur_pos[0] += ret.dim_x * 2 + cur_pad_x * 2;
//             if (next_mesh.align_flags & ALIGN_2.VERTICAL) {
//                // cur_pos[0] += start_pos_x+pad_x;
//                // cur_pos[0] += start_pos_x;
//                // cur_pos[0] = start_pos_x+cur_mesh.geom.pos[0];
//                // cur_pos[0] = cur_mesh.geom.pos[0];
//                cur_pos[0] = mesh.geom.pos[0]+pad_x+start_pos_x;
//                if(row_max_size_y > ret.dim_y*2 + cur_pad_y*2) {
//                   cur_pos[1] += row_max_size_y;
//                }
//                // if(row_max_size_xxxxxx > ret.dim_y*2 + cur_pad_y*2) {
//                //    cur_pos[1] += row_max_size_xxxxxx;
//                // }
//                else {
//                   cur_pos[1] += ret.dim_y*2 + cur_pad_y*2;
//                }
//                row_max_size_y = 0; // MUST: Reset row_max_size_y for every new row of meshes
//                // cur_mesh.geom.dim[0] -= ret.dim_x + cur_pad_x;
//                row_dim_x = 0;
//             }
//          }

//       }
//       else {

//          start_pos_x += cur_pad_x;
//          const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);
//          start_pos_x -= cur_pad_x;

//          row_dim_x += ret.dim_x

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             total_size_x += ret.dim_x;
//             // if (total_size_x <= ret.dim_x) total_size_x += ret.dim_x;
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//             cur_pos[0] += ret.dim_x * 2;
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             if (total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis

//             cur_pos[1] += ret.dim_y * 2;
//             y += ret.dim_y * 2;
//             cur_pos[0] = start_pos_x;

//          }


//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;

//          // if (max_dim[0] < total_size_x) max_dim[0] = total_size_x;
//          // if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;
//       }
//       if (max_dim[0] < total_size_x) max_dim[0] = row_dim_x;
//       if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;

//    }


//    return {
//       dim: [accum_row_max_size_x, total_size_y],
//       prev_dim: [cur_dim[0], cur_dim[1]],
//       row_dim_x: row_dim_x,
//       max_dim: [max_dim[0], max_dim[1]],
//       accum_row_max_size_x:accum_row_max_size_x,
//    }


// }
/** */
// export function Align_pre_simple(mesh, some = [0, 0], row_max_size_y = 0, row_max_size_x=0, start_pos_x = 0, start_pos_y = 0, prev_dim = [0,0]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    const cur_pos = [some[0], some[1]];
//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    let row_dim_x = 0;
//    let total_size_x = 0;
//    let total_size_y = 0;


//    let max_dim = [0, 0];
//    let cur_dim = [0, 0];


//    if (row_max_size_y === 0) row_max_size_y = mesh.geom.pos[1] + pad_y;


//    let accum_row_size_x = 0
//    let accum_row_max_size_x = 0
//    let row = 0

//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);



//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {


//          start_pos_x += cur_pad_x;
//          start_pos_y += cur_pad_y;

//          // const ret = Align_pre_simple(cur_mesh, cur_pos, row_max_size_y, row_max_size_x, accum_row_max_size_x, start_pos_x, start_pos_y, prev_dim);
//          const ret = Align_pre_simple(cur_mesh, cur_pos, row_max_size_y, row_max_size_x, start_pos_x, start_pos_y, prev_dim);
//          start_pos_x -= cur_pad_x;
//          start_pos_y -= cur_pad_y;

//          accum_row_max_size_x += ret.accum_row_max_size_x

//          // console.log('MEsh', cur_mesh.GetName(), 'total size', total_size_x*2)

//          if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             if (total_size_x < ret.dim_x + cur_pad_x) {
//                total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
//             }
//             total_size_y += ret.dim_y + cur_pad_y;

//             if(max_dim[0] < total_size_x) {
//                max_dim[0] = total_size_x;
//             }

//             if(row_max_size_x < total_size_x)  row_max_size_x=total_size_x
//             // if(row_max_size_x < accum_row_size_x)  row_max_size_x=accum_row_size_x

//             // if(accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x
//             // console.log('    accum_row_max_size_x:', accum_row_max_size_x,'MEsh', cur_mesh.GetName())
//             row++;
//             accum_row_size_x = 0;
//             // accum_row_size_x += ret.dim_x + cur_pad_x;
//             // console.log('--row:', row,)
//             // console.log('--row:', row, 'accum_row_size_x', accum_row_size_x)
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL){
//             total_size_x += ret.dim_x + cur_pad_x; // Set in x-axis
//             // console.log('    Adding', (ret.dim_x + cur_pad_x)*2)
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;

//             // accum_row_size_x += ret.dim_x + cur_pad_x;
//             // console.log('MEsh', cur_mesh.GetName(), 'row:', row, 'accum_row_size_x', accum_row_size_x)
//             // console.log('row:', row, 'accum_row_size_x', accum_row_size_x)

//          }
//          // if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL)row_dim_x += ret.dim_x + cur_pad_x;

//          // if(cur_mesh.mesh_bufferidx===16)
//          //    console.log

//          accum_row_size_x += ret.dim_x + cur_pad_x;
//          // console.log('    accum_row_max_size_x:', accum_row_max_size_x,'MEsh', cur_mesh.GetName())
//          // console.log('    accum_row_size_x:', accum_row_size_x, 'row', row, )//'MEsh', cur_mesh.GetName())
//          if(accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x
//          // console.log('    accum_row_max_size_x:', accum_row_max_size_x, 'row', row, 'MEsh', cur_mesh.GetName())

//          // console.log('    total_size', total_size_x*2, 'max_dim', max_dim[0]*2, 'row_dim_x', row_dim_x*2)
//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];

//          // cur_mesh.geom.dim[0] = row_max_size_x;
//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;

//          cur_dim[0] = cur_mesh.geom.dim[0]
//          cur_dim[1] = cur_mesh.geom.dim[1]


//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;
//          max_dim[0] = ret.max_dim[0];
//          max_dim[1] = ret.max_dim[1];

//          row_dim_x += ret.dim_x + cur_pad_x;
//          if(row_max_size_y < cur_mesh.geom.dim[1]*2) 
//             row_max_size_y = cur_mesh.geom.dim[1]*2;
//          if(row_max_size_x < cur_mesh.geom.dim[0]*2) 
//             row_max_size_x = total_size_x;
//          // console.log('    row_max_size_x', row_max_size_x, )


//          const next_mesh = mesh.children.buffer[i+1];
//          if(next_mesh) {

//             if(next_mesh.align_flags & ALIGN_2.HORIZONTAL) cur_pos[0] += ret.dim_x * 2 + cur_pad_x * 2;
//             if (next_mesh.align_flags & ALIGN_2.VERTICAL) {
//                cur_pos[0] = start_pos_x+pad_x;
//                if(row_max_size_y > ret.dim_y*2 + cur_pad_y*2) {
//                   cur_pos[1] += row_max_size_y;
//                }
//                else {
//                   cur_pos[1] += ret.dim_y*2 + cur_pad_y*2;
//                }
//                row_max_size_y = 0; // MUST: Reset row_max_size_y for every new row of meshes
//                // cur_mesh.geom.dim[0] -= ret.dim_x + cur_pad_x;
//                row_dim_x = 0;
//             }
//          }
//          // else if(!next_mesh){
//          //    // cur_mesh.geom.dim[0] -= ret.dim_x + cur_pad_x;
//          //    // row_dim_x = 0;
//          //    if(row_max_size_y > ret.dim_y*2 + cur_pad_y*2) {
//          //       cur_mesh.geom.dim[0] = row_max_size_x
//          //    }
//          // }
//       }
//       else {

//          start_pos_x += cur_pad_x;
//          const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);
//          start_pos_x -= cur_pad_x;

//          row_dim_x += ret.dim_x

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             total_size_x += ret.dim_x;
//             // if (total_size_x <= ret.dim_x) total_size_x += ret.dim_x;
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//             cur_pos[0] += ret.dim_x * 2;
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             if (total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis

//             cur_pos[1] += ret.dim_y * 2;
//             y += ret.dim_y * 2;
//             cur_pos[0] = start_pos_x;

//          }


//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;

//          // if (max_dim[0] < total_size_x) max_dim[0] = total_size_x;
//          // if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;
//       }
//       if (max_dim[0] < total_size_x) max_dim[0] = row_dim_x;
//       if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;

//    }



//    // total_size_x -= prev_dim[0]
//    // console.log('    -------', mesh.GetName(), 'total size', total_size_x*2, 'row_dim_x', row_dim_x*2)
//    return {
//       // dim: [row_dim_x, total_size_y],
//       dim: [accum_row_max_size_x, total_size_y],
//       prev_dim: [cur_dim[0], cur_dim[1]],
//       row_dim_x: row_dim_x,
//       max_dim: [max_dim[0], max_dim[1]],
//       accum_row_max_size_x:accum_row_max_size_x,
//    }


// }
/** */
// export function Align_pre_simple(mesh, cur_pos = [0, 0], accum_pad = [0, 0], accum_dim = [0, 0], pos_pointer = [0, 0], row_max_size_y = 0, start_pos_x=0, cur_pos_x=0, cur_pos_y=0) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;
//    cur_pos_y = pad_y;

//    pos_pointer[0] = mesh.geom.pos[0]+pad_x;
//    pos_pointer[1] = mesh.geom.pos[1]+pad_y;

//    accum_pad[0] += pad_x;
//    accum_pad[1] += pad_y;
//    let total_size_x = 0;
//    let total_size_y = 0;
//    let last_pad_x = 0;
//    let last_pad_y = 0;

//    let max_dim = [0, 0];
//    let prev_dim = [0, 0];

//    // start_pos_x += pad_x;


//    if(row_max_size_y===0) row_max_size_y = mesh.geom.pos[1]+pad_y;

//    let y = cur_pos[1];


//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);


//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {

//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];
//          // cur_mesh.geom.pos[1] = cur_pos_y;

//          start_pos_x += cur_pad_x;
//          const ret = Align_pre_simple(cur_mesh, cur_pos, accum_pad, accum_dim, pos_pointer, row_max_size_y, start_pos_x, cur_pos_x, cur_pos_y);
//          start_pos_x -= cur_pad_x;
//          // cur_pos[1] -= ret.dim_y*2 + cur_pad_y*2



//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;


//          if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//             total_size_y += ret.dim_y + cur_pad_y; // Accumulate in y-dimention
//             if(total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis

//             cur_pos[0] = start_pos_x; 
//             // cur_pos[1] += cur_mesh.geom.dim[1]*2; 
//             cur_pos[1] += ret.dim_y*2 + cur_pad_y*2; 
//             cur_pos_y += ret.dim_y*2 + cur_pad_y*2; 
//             // cur_pos[1] = ret.dim_y*2 + cur_pad_y*2; 
//          }
//          else {
//             if (total_size_x < max_dim[0]) total_size_x += max_dim[0];
//             if (total_size_y < ret.max_dim[1] + cur_pad_y) total_size_y = ret.max_dim[1] + cur_pad_y;

//             // cur_pos[0] += ret.dim_x*2;
//             cur_pos[0] += ret.dim_x*2 + cur_pad_x*2;
//             // cur_pos[0] = ret.dim_x*2 + cur_pad_x*2;
//          }

//          cur_pos[0] += cur_pad_x; // For each next section !!!
//          cur_pos[1] -= cur_pad_y;// !!!
//          cur_pos_y -= cur_pad_y;// !!!


//          prev_dim[0] = ret.dim_x + cur_pad_x;
//          prev_dim[1] = ret.dim_y + cur_pad_y; // NOTE: Here the size is of that of the sumury of any prev section with lots of widgets in VERTICAL alignment


//       }
//       else {


//          start_pos_x += cur_pad_x;
//          // const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);
//          const ret = cur_mesh.AlignNEW(cur_pos[0], y);
//          // const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos_y);
//          start_pos_x -= cur_pad_x;

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             if (total_size_x <= max_dim[0]) total_size_x += ret.dim_x;
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//             cur_pos[0] += ret.dim_x*2; 
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             if(total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis

//             cur_pos[1] += ret.dim_y*2; 
//             y += ret.dim_y*2; 
//             cur_pos_y += ret.dim_y*2; 
//             cur_pos[0] = start_pos_x; 
//          }


//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;

//          if (max_dim[0] < total_size_x) max_dim[0] = total_size_x;
//          if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;
//       }


//    }

//    // cur_pos[1] += prev_dim[1]*2 + pad_y*2; 
//    // start_pos_x -= pad_x;

//    return {
//       dim: [total_size_x, total_size_y],
//       max_dim: [max_dim[0], max_dim[1]],
//       pad: [last_pad_x, last_pad_y],
//       pos: [mesh.geom.pos[0], mesh.geom.pos[1]],
//    }


// }
/** */
// export function Align_pre_simple(mesh, cur_pos = [0, 0], accum_pad = [0, 0], accum_dim = [0, 0], pos_pointer = [0, 0], row_max_size_y = 0) {

//    console.log('##############################################################################')
//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    // if (mesh.align_flags & ALIGN_2.HORIZONTAL) {

//    //    pos_pointer[0] = mesh.geom.pos[0]+pad_x;
//    //    pos_pointer[1] = mesh.geom.pos[1]+pad_y;
//    // }
//    // if (mesh.align_flags & ALIGN_2.VERTICAL) {

//    //    pos_pointer[0] = mesh.geom.pos[0]+pad_x;
//    //    pos_pointer[1] = mesh.geom.pos[1]+pad_y;
//    // }
//    pos_pointer[0] = mesh.geom.pos[0]+pad_x;
//    pos_pointer[1] = mesh.geom.pos[1]+pad_y;

//    accum_pad[0] += pad_x;
//    accum_pad[1] += pad_y;
//    let total_size_x = 0;
//    let total_size_y = 0;
//    let last_pad_x = 0;
//    let last_pad_y = 0;

//    let max_dim = [0, 0];
//    let prev_dim = [0, 0];


//    if(row_max_size_y===0) row_max_size_y = mesh.geom.pos[1]+pad_y;



//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//       // pos_pointer[0] = mesh.geom.pos[0]+mesh.geom.dim[0]+pad_x;
//       // pos_pointer[1] = mesh.geom.pos[0]+mesh.geom.dim[1]+pad_y;
//       // cur_pos[0] = pos_pointer[0];
//       // cur_pos[1] = pos_pointer[1];



//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {


//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             cur_pos[0] += prev_dim[0] * 2;
//             // cur_pos[0] = pos_pointer[0];
//             // cur_pos[1] = pos_pointer[1];
//             // Avoid max_dim[0] = 0, so that  'if (total_size_x <= max_dim[0])' fails to accumulate size 
//             // max_dim[0] = cur_pos[0] / 2; // TODO: Is it valid? Or there is another way of initializing max_dim???
//             if(max_dim[0]===0) max_dim[0] = cur_pos[0] / 2;

//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             cur_pos[0] = accum_pad[0];
//             // cur_pos[1] = prev_dim[1] * 2;
//             // cur_pos[1] = pos_pointer[1];
//             console.log('ALIGN_2. mesh:', cur_mesh.GetName(), 'cur_pos', cur_pos, 'accum_pad', accum_pad,'max_dim', max_dim,)

//             // row_max_size_y = cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]*2+pad_y*2;
//          }

//          // if(cur_pos[1] < row_max_size_y) cur_pos[1] = row_max_size_y
//          // cur_pos[1] = row_max_size_y
//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];

//          const ret = Align_pre_simple(cur_mesh, cur_pos, accum_pad, accum_dim, pos_pointer, row_max_size_y);

//          // if(row_max_size_y < cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]+pad_y) row_max_size_y = cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]+pad_y;
//          // if(row_max_size_y < cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]) 
//          //    row_max_size_y = cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1];
//          // if(row_max_size_y < accum_dim[1]) 
//          //    row_max_size_y = accum_dim[1]*2;
//          if(row_max_size_y < total_size_y*2+cur_pad_y) 
//             row_max_size_y = total_size_y*2+cur_pad_y;
//          // if(row_max_size_y < cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]+pad_y) 
//          //    row_max_size_y = cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]+pad_y;


//          // pos_pointer[1] -= cur_pos[1];
//          // pos_pointer[1] -= cur_mesh.geom.dim[1];
//          // pos_pointer[0] = cur_mesh.geom.pos[0]+cur_pad_x;
//          // pos_pointer[1] = cur_mesh.geom.pos[1]+cur_pad_y + ret.dim_y;
//          // pos_pointer[1] = cur_mesh.geom.pos[1] + ret.dim_y;
//          // pos_pointer[1] = ret.dim_y*2;

//          // if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL)
//          //    pos_pointer[0] = ret.dim_x*2;
//          // if (cur_mesh.align_flags & ALIGN_2.VERTICAL)
//          //    pos_pointer[1] = ret.dim_y*2;
//          // pos_pointer[0] = mesh.geom.pos[0]+mesh.geom.dim[0]+pad_x;
//          // pos_pointer[1] = mesh.geom.pos[0]+mesh.geom.dim[1]+pad_y;


//          max_dim[0] += ret.max_dim[0];
//          max_dim[1] += ret.max_dim[1];
//          accum_dim[0] += ret.dim_x; // For horizontal alignment, accum the x-axis size
//          accum_dim[1] += ret.dim_y;
//          accum_pad[0] -= cur_pad_x;
//          accum_pad[1] -= cur_pad_y;


//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;
//          // TODO: Use max_dim instead
//          // cur_mesh.geom.dim[0] = ret.max_dim[0] + cur_pad_x;
//          // cur_mesh.geom.dim[1] = ret.max_dim[1] + cur_pad_y;

//          if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             // total_size_y += ret.dim_y ; // Accumulate in y-dimention
//             total_size_y += ret.dim_y + cur_pad_y; // Accumulate in y-dimention
//             // if(total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis
//             if(total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis

//             // if(row_max_size_y < cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]*2+pad_y*2) row_max_size_y = cur_mesh.geom.pos[0]+cur_mesh.geom.dim[1]*2+pad_y*2;
//             // if(row_max_size_y < cur_mesh.geom.pos[0]) row_max_size_y = cur_mesh.geom.pos[0];
//             // row_max_size_y += cur_mesh.geom.dim[1]*2;

//          }
//          else {

//             // total_size_x += cur_mesh.geom.dim[0]; // At this point, we have returned from an inner section , so we need the accumulated size to be returned to the parent section 
//             // if (total_size_x < max_dim[0]) total_size_x += ret.dim_x;
//             if (total_size_x < max_dim[0]) total_size_x += max_dim[0];
//             // if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//             if (total_size_y < ret.max_dim[1] + cur_pad_y) total_size_y = ret.max_dim[1] + cur_pad_y;
//             // total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//             // if(row_max_size_y < total_size_y*2) row_max_size_y = total_size_y*2;
//             // if(row_max_size_y < max_dim[1]) row_max_size_y = max_dim[1];
//             // if(row_max_size_y < cur_pos[1]) row_max_size_y = cur_pos[1];
//          }

//          cur_pos[0] += cur_pad_x; // For each next section !!!
//          cur_pos[1] -= cur_pad_y;// !!!


//          prev_dim[0] = ret.dim_x + cur_pad_x;
//          prev_dim[1] = ret.dim_y + cur_pad_y; // NOTE: Here the size is of that of the sumury of any prev section with lots of widgets in VERTICAL alignment


//       }
//       else {

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             cur_pos[0] += prev_dim[0] * 2;
//             // Avoid max_dim[0] = 0, so that  'if (total_size_x <= max_dim[0])' fails to accumulate size 
//             max_dim[0] = cur_pos[0] / 2; // TODO: Is it valid? Or there is another way of initializing max_dim???
//             // cur_pos[1] = pos_pointer[1];
//             // if(max_dim[0]===0) max_dim[0] = cur_pos[0] / 2;

//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             // cur_pos[0] = pad_x;
//             // cur_pos[0] = accum_pad[0];
//             cur_pos[0] = pos_pointer[0];
//             // cur_pos[0] += accum_pad[0];
//             cur_pos[1] += prev_dim[1] * 2;
//             console.log('ALIGN_2. mesh:', cur_mesh.GetName(), 'cur_pos', cur_pos)

//          }


//          const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             // Avoid accumulating extra size. Happens on alternating HORIZONTAL/VERTICAL alignments.
//             // Accumulate size in x-dimention, only if the max size is less than the total size
//             if (total_size_x <= max_dim[0]) total_size_x += ret.dim_x;
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis
//             // total_size_y = (total_size_y < ret.dim_y + cur_pad_y) ? ret.dim_y + cur_pad_y : total_size_y; // Applies Only to sections

//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             // total_size_x = (total_size_x < ret.dim_x) ? ret.dim_x : total_size_x; // Set in x-axis
//             if(total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis

//          }
//          else {
//             alert('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected');
//             console.error('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected.\nMesh:', cur_mesh.GetName());
//          }


//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;
//          console.log('------------- prev_dim', prev_dim[1])

//          if (max_dim[0] < total_size_x) max_dim[0] = total_size_x;
//          if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;
//       }


//    }

//    // cur_pos[1] += prev_dim[1]*2 + pad_y*2; !!!


//    return {
//       dim: [total_size_x, total_size_y],
//       max_dim: [max_dim[0], max_dim[1]],
//       pad: [last_pad_x, last_pad_y],
//       pos: [mesh.geom.pos[0], mesh.geom.pos[1]],
//    }


// }
/** SAVE 4 */
// export function Align_pre_simple(mesh, cur_pos = [0, 0], accum_pad = [0, 0], accum_dim = [0, 0], pos_pointer = [0, 0], row_max_size_y = 0) {

//    console.log('##############################################################################')
//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    pos_pointer[0] = mesh.geom.pos[0]+pad_x;
//    pos_pointer[1] = mesh.geom.pos[1]+pad_y;

//    accum_pad[0] += pad_x;
//    accum_pad[1] += pad_y;
//    let total_size_x = 0;
//    let total_size_y = 0;
//    let last_pad_x = 0;
//    let last_pad_y = 0;

//    let max_dim = [0, 0];
//    let prev_dim = [0, 0];


//    if(row_max_size_y===0) row_max_size_y = mesh.geom.pos[1]+pad_y;



//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);


//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {


//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             cur_pos[0] += prev_dim[0] * 1;
//             // cur_pos[0] = accum_dim[0];
//             cur_pos[1] = pos_pointer[1]-pad_y;
//             // Avoid max_dim[0] = 0, so that  'if (total_size_x <= max_dim[0])' fails to accumulate size 
//             // max_dim[0] = cur_pos[0] / 2; // TODO: Is it valid? Or there is another way of initializing max_dim???
//             // if(max_dim[0]===0) max_dim[0] = cur_pos[0] / 2;

//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             cur_pos[0] = accum_pad[0];
//             // cur_pos[1] = prev_dim[1] * 2;
//             // cur_pos[1] = pos_pointer[1];
//             console.log('ALIGN_2. mesh:', cur_mesh.GetName(), 'cur_pos', cur_pos, 'accum_pad', accum_pad,'max_dim', max_dim,)
//          }

//          // cur_pos[1] = row_max_size_y




//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];
//          const ret = Align_pre_simple(cur_mesh, cur_pos, accum_pad, accum_dim, pos_pointer, row_max_size_y);

//          if(row_max_size_y < total_size_y*2) row_max_size_y = total_size_y*2;


//          max_dim[0] += ret.max_dim[0];
//          max_dim[1] += ret.max_dim[1];
//          accum_dim[0] += ret.dim_x; // For horizontal alignment, accum the x-axis size
//          accum_dim[1] += ret.dim_y;

//          accum_pad[0] -= cur_pad_x;
//          accum_pad[1] -= cur_pad_y;


//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;


//          if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//             total_size_y += ret.dim_y + cur_pad_y; // Accumulate in y-dimention
//             if(total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
//          }
//          else {
//             if (total_size_x < max_dim[0]) total_size_x += max_dim[0];
//             if (total_size_y < ret.max_dim[1] + cur_pad_y) total_size_y = ret.max_dim[1] + cur_pad_y;
//          }

//          cur_pos[0] += cur_pad_x; // For each next section !!!
//          // cur_pos[1] -= cur_pad_y; 


//          prev_dim[0] = ret.dim_x + cur_pad_x;
//          prev_dim[1] = ret.dim_y + cur_pad_y; // NOTE: Here the size is of that of the sumury of any prev section with lots of widgets in VERTICAL alignment


//       }
//       else {

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {
//             cur_pos[0] += prev_dim[0] * 2;
//             max_dim[0] = cur_pos[0] / 2; 
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//             cur_pos[0] = pos_pointer[0];
//             cur_pos[1] += prev_dim[1] * 2;
//          }


//          const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {
//             // Avoid accumulating extra size. Happens on alternating HORIZONTAL/VERTICAL alignments.
//             if (total_size_x <= max_dim[0]) total_size_x += ret.dim_x;
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis
//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {
//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             if(total_size_x < ret.dim_x) total_size_x = ret.dim_x; // Set in x-axis
//          }
//          else {
//             alert('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected');
//             console.error('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected.\nMesh:', cur_mesh.GetName());
//          }


//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;

//          if (max_dim[0] < total_size_x) max_dim[0] = total_size_x;
//          if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;
//       }


//    }

//    cur_pos[1] += prev_dim[1]*2 + pad_y*2;

//    // if(row_max_size_y < total_size_y*2) row_max_size_y = total_size_y*2;


//    return {
//       dim: [total_size_x, total_size_y],
//       max_dim: [max_dim[0], max_dim[1]],
//       pad: [last_pad_x, last_pad_y],
//       pos: [mesh.geom.pos[0], mesh.geom.pos[1]],
//    }


// }
/* Save 3* */
// export function Align_pre_simple(mesh, cur_pos = [0, 0], accum_pad = [0, 0], accum_dim = [0, 0]) {

//    console.log('##############################################################################')
//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);

//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    accum_pad[0] += pad_x;
//    accum_pad[1] += pad_y;
//    let total_size_x = 0;
//    let total_size_y = 0;
//    let last_pad_x = 0;
//    let last_pad_y = 0;

//    let max_dim = [0, 0];
//    let prev_dim = [0, 0];



//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//       if (cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {

//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];
//          const ret = Align_pre_simple(cur_mesh, cur_pos, accum_pad);
//          accum_dim[0] += ret.dim_x; // For horizontal alignment, accum the x-axis size

//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;
//          // TODO: Use max_dim instead
//          // cur_mesh.geom.dim[0] = ret.max_dim[0] + cur_pad_x;
//          // cur_mesh.geom.dim[1] = ret.max_dim[1] + cur_pad_y;

//          total_size_x += cur_mesh.geom.dim[0]; // At this point, we have returned from an inner section , so we need the accumulated size to be returned to the parent section 
//          total_size_y = (total_size_y < ret.dim_y + cur_pad_y) ? ret.dim_y + cur_pad_y : total_size_y; // Applies Only to sections

//          cur_pos[0] += cur_pad_x; // For each next section
//          cur_pos[1] -= cur_pad_y;

//       }
//       else {

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             cur_pos[0] += prev_dim[0] * 2;
//             // Avoid max_dim[0] = 00, so that  'if (total_size_x <= max_dim[0])' fails to accumulate size 
//             max_dim[0] = cur_pos[0] / 2; // TODO: Is it valid? Or there is another way of initializing max_dim???

//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             // cur_pos[0] = pad_x;
//             // cur_pos[0] = pad_x + cur_pad_x;
//             cur_pos[0] = accum_pad[0];
//             // cur_pos[0] = cur_pad_x;
//             cur_pos[1] += prev_dim[1] * 2;

//          }
//          const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);

//          if (cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             // Avoid accumulating extra size. Happens on alternating HORIZONTAL/VERTICAL alignments.
//             // Accumulate size in x-dimention, only if the max size is less than the total size
//             if (total_size_x <= max_dim[0]) total_size_x += ret.dim_x;
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis

//          }
//          else if (cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             // total_size_x = (total_size_x < ret.dim_x) ? ret.dim_x : total_size_x; // Set in x-axis

//          }
//          else {
//             alert('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected');
//             console.error('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected.\nMesh:', cur_mesh.GetName());
//          }

//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;

//          if (max_dim[0] < total_size_x) max_dim[0] = total_size_x;
//          if (max_dim[1] < total_size_y) max_dim[1] = total_size_y;

//       }

//    }


//    return {
//       dim: [total_size_x, total_size_y],
//       max_dim: [max_dim[0], max_dim[1]],
//       pad: [last_pad_x, last_pad_y],
//       pos: [mesh.geom.pos[0], mesh.geom.pos[1]],
//    }


// }
/** SAVE 2 */
// export function Align_pre_simple(mesh, cur_pos=[0,0], accum_pad=[0,0], accum_dim=[0,0]) {

//    console.log('##############################################################################')
//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);

//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    accum_pad[0] += pad_x;
//    accum_pad[1] += pad_y;
//    let total_size_x = 0;
//    let total_size_y = 0;
//    let last_pad_x = 0;
//    let last_pad_y = 0;


//    let prev_dim = [0,0];
//    let prev_pos = [0,0];
//    let prev_align_flags = 0x0;

//    for(let i=0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//       if(cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {

//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];
//          const ret = Align_pre_simple(cur_mesh, cur_pos, accum_pad);
//          accum_dim[0] += ret.dim_x; // For horizontal alignment, accum the x-axis size
//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;

//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;

//          total_size_x += cur_mesh.geom.dim[0]; // At this point, we have returned from an inner section , so we need the accumulated size to be returned to the parent section 
//          total_size_y = (total_size_y < ret.dim_y+ cur_pad_y) ? ret.dim_y+ cur_pad_y : total_size_y; // Applies Only to sections

//          cur_pos[0] += cur_pad_x; // For each next section
//          cur_pos[1] -= cur_pad_y;

//       }
//       else {

//          if(cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             cur_pos[0] += prev_dim[0]*2;
//             // cur_pos[1] = prev_pos[1] + prev_dim[1];
//             // cur_pos[1] = pad_y;

//          }
//          else if(cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             // total_size_x -= prev_dim[0];
//             cur_pos[0] = pad_x;
//             cur_pos[1] += prev_dim[1]*2;

//          }
//          const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);

//          if(cur_mesh.align_flags & ALIGN_2.HORIZONTAL) {

//             if(prev_align_flags & ALIGN_2.HORIZONTAL) {
//                total_size_x += ret.dim_x; // Accumulate in x-dimention
//             }
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis
//             // cur_pos[0] += ret.dim_x*2; // Advance in x-axis

//          }
//          else if(cur_mesh.align_flags & ALIGN_2.VERTICAL) {

//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             total_size_x = (total_size_x < ret.dim_x) ? ret.dim_x : total_size_x; // Set in x-axis
//             // cur_pos[1] += ret.dim_y*2; // Advance in y-axis

//          }
//          else {
//             alert('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected');
//             console.error('44132889875: Align_pre_simple() - No align flag HORIZONTL/VERTICAL is selected.\nMesh:', cur_mesh.GetName());
//          }

//          // const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);
//          prev_dim[0] = ret.dim_x;
//          prev_dim[1] = ret.dim_y;

//          prev_pos[0] = cur_pos[0];
//          prev_pos[1] = cur_pos[1];

//          prev_align_flags = cur_mesh.align_flags;

//       }

//    }


//    return {
//       dim:[total_size_x, total_size_y],
//       pad:[last_pad_x, last_pad_y],
//       pos:[mesh.geom.pos[0], mesh.geom.pos[1]],
//    }


// }
/** SAVE */
// export function Align_pre_simple(mesh, cur_pos=[0,0], accum_pad=[0,0], accum_dim=[0,0]) {

//    console.log('##############################################################################')
//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);

//    cur_pos[0] += pad_x;
//    cur_pos[1] += pad_y;

//    accum_pad[0] += pad_x;
//    accum_pad[1] += pad_y;
//    let total_size_x = 0;
//    let total_size_y = 0;
//    let last_pad_x = 0;
//    let last_pad_y = 0;



//    for(let i=0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       /**
//        * HERE:
//        * The return of the first YELLOW, the cur_pos[1] is 64, minus 10 from yellow pad = 54 which is wron. It should be 40, as in 10(PARENT)+10(GREEN)+20(PURPLE)
//        */

//       if(cur_mesh.align_flags & ALIGN_2.RESIZE_SELF) {

//          const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//          const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//          cur_mesh.geom.pos[0] = cur_pos[0];
//          cur_mesh.geom.pos[1] = cur_pos[1];
//          const ret = Align_pre_simple(cur_mesh, cur_pos, accum_pad);
//          accum_dim[0] += ret.dim_x; // For horizontal alignment, accum the x-axis size
//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          // cur_mesh.geom.dim[0] = accum_dim[0] + pad_x;
//          // cur_mesh.geom.dim[1] += ret.dim_y;

//          // cur_mesh.geom.dim[1] = ret.dim_y + pad_y;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;

//          total_size_x += cur_mesh.geom.dim[0]; // At this point, we have returned from an inner section , so we need the accumulated size to be returned to the parent section 
//          // total_size_y = (total_size_y < ret.dim_y+ pad_y) ? ret.dim_y+ pad_y : total_size_y; // Applies Only to sections
//          total_size_y = (total_size_y < ret.dim_y+ cur_pad_y) ? ret.dim_y+ cur_pad_y : total_size_y; // Applies Only to sections

//          // cur_pos[0] += pad_x; // For each next section
//          cur_pos[0] += cur_pad_x; // For each next section
//          // cur_pos[1] -= pad_y;
//          cur_pos[1] -= cur_pad_y;
//          console.warn(mesh.GetName(), 'total_size_y', total_size_y, ' ret.dim_y',  ret.dim_y, 'accum_pad', accum_pad)

//          // last_pad_x = cur_pad_x;
//          // last_pad_y = cur_pad_y;

//       }
//       else {

//          const ret = cur_mesh.AlignNEW(cur_pos[0], cur_pos[1]);

//          total_size_x += ret.dim_x;
//          cur_pos[0] += ret.dim_x*2;
//          total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y;
//          console.error(mesh.GetName(), 'total_size_x', total_size_x, 'accum_pad', accum_pad);

//       }

//    }


//    return {
//       dim:[total_size_x, total_size_y],
//       max_dim:[total_size_x, total_size_y],
//       pad:[last_pad_x, last_pad_y],
//       pos:[mesh.geom.pos[0], mesh.geom.pos[1]],
//    }


// }


/** */





/** */
function Test_alignment_test(x, y) {

   const pos = [x, y, 0];
   const slider_size = 120;

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [20, 20], TRANSPARENCY(GREY[0], 1.), 'MAIN_SECTION');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[0], 1.), 'MAIN_SECTION');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.StylesSetMargin([0, 0]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let yellow_cnt = 1;
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }

      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];




   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}



/** */
export function Test_alignment_nested_vert_22(x = 50, y = 50) {

   const pos = [x, y, 0];
   const slider_size = 120;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[0], 1.), 'MAIN_SECTION');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.StylesSetMargin([0, 0]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let grey_cnt = 1;
      let purple_cnt = 1;
      let red_cnt = 1;
      let yellow_cnt = 1;
      let cyan_cnt = 1;

      const ss = Create_section(section, GREY[3], `GREY[3]`, ALIGN_2.VERTICAL, pad);

      /** With Widgets */
      /** */
      {
         const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
         {
            const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);;
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               // { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
            }
            { // HERE: Activating another section in horizontal, breaks the y-axis alignment 
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               // { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
         }
      }
      /** */
      // {
      //    const s2 = Create_section(ss, PURPLEB[3], `Y${purple_cnt++}`, ALIGN_2.VERTICAL, pad)
      //    {
      //       const s = Create_section(s2, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //    }
      //    {
      //       const s = Create_section(s2, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad)
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //    }
      //    {
      //       const s = Create_section(s2, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad)
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //       { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
      //    }

      // }
      /** */
      // {
      //    const s2 = Create_section(ss, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      //    {
      //       const s = Create_section(s2, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      //       {
      //          const s3 = Create_section(s, PURPLER[3], `Y${purple_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //       }
      //       {
      //          const s3 = Create_section(s, PURPLER[3], `Y${purple_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s3.AddItem(label); }
      //       }
      //       {
      //          const s3 = Create_section(s, PURPLER[3], `Y${purple_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //       }
      //       {
      //          const s3 = Create_section(s, PURPLER[3], `Y${purple_cnt++}`, ALIGN_2.VERTICAL, pad)
      //          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //       }
      //       {
      //          const s3 = Create_section(s, PURPLER[3], `Y${purple_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //          { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s3.AddItem(label); }
      //       }

      //    }

      // }

      /** No Widgets - nested 1 */
      // {
      //    {
      //       const s1 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //    }
      //    {
      //       const s1 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //    }
      //    {
      //       const s1 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //    }
      //    {
      //       const s1 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //    }
      //    {
      //       const s1 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //    }
      //    {
      //       const s1 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //          { const s = Create_section(s1, YELLOWR[3], `Y2${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); }
      //    }
      // }

      /**  No Widgets - nested 2 */
      /** */
      // {
      //    const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      // }
      /** */
      // {
      //    const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      // }
      /** UP */
      // {
      //    const pad = [7, 7]
      //    {
      //       const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad)
      //          const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]);
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //       }
      //    }

      //    {
      //       const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad)
      //          const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]);
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_section(s2, GREY[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, ALIGN_2.HORIZONTAL, pad, [0, 0]); }
      //       }
      //    }

      // }
      /** */
      // {
      // const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      // }
      /** */
      // {
      // const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }


      // }
      /** */
      // {
      // const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
      //    {

      //       const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`);
      //       s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      //       s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      //       s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      //       s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      //       s3.StylesSetPad([10, 10]);
      //       s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL;
      //       s2.AddItem(s3)
      //       { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    // {

      //    //    const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`);
      //    //    s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      //    //    s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      //    //    s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      //    //    s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      //    //    s3.StylesSetPad([10, 10]);
      //    //    s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL;
      //    //    s2.AddItem(s3)
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    // }
      //    // {

      //    //    const s3 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`);
      //    //    s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      //    //    s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      //    //    s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      //    //    s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      //    //    s3.StylesSetPad([10, 10]);
      //    //    s3.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL;
      //    //    s2.AddItem(s3)
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    // }
      // }

   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;

   // const ret2 = Align_position_pre(section)

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];




   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}

function Test_alignment_nested_hor_22(x, y) {

   const pos = [x, y, 0];
   const slider_size = 120;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[0], 1.), 'MAIN_SECTION');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let grey_cnt = 1;
      let purple_cnt = 1;
      let red_cnt = 1;
      let yellow_cnt = 1;
      let cyan_cnt = 1;

      const s2 = Create_section(section, GREY[3], `Y${grey_cnt++}`, ALIGN_2.HORIZONTAL, pad);
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }

      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, [20, 20]);
         {
            const s = Create_section(s1, GREY[0], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            {
               const s4 = Create_section(s, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s4.AddItem(label); }
               { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s4.AddItem(label); }
            }
            {
               const s4 = Create_section(s, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s4.AddItem(label); }
            }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([10, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 10]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 10]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 10]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 10]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
         }
      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, [20, 20]);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 10]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
         {
            const s = Create_section(s1, GREY[0], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            {
               const s4 = Create_section(s, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s4.AddItem(label); }
            }
            {
               const s4 = Create_section(s, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad);
               { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s4.AddItem(label); }
            }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([20, 20]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s1 = Create_section(s2, REDL[3], `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_section(s1, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }

   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];




   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
function Test_alignment_nested_32(x, y) {

   const pos = [x, y, 0];
   const slider_size = 120;

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[0], 1.), 'MAIN_SECTION');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.StylesSetMargin([0, 0]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let yellow_cnt = 1;
      const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(GREEN[6], .2), `GREEN${yellow_cnt++}`);
      s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      s1.StylesSetPad([10, 10]);
      s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL;
      section.AddItem(s1)
      {
         const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
         {
            const s = Create_section(s2, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 100]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([10, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`);
            s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
            s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            s.StylesSetPad([10, 10]);
            s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL;
            s2.AddItem(s)
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
         {
            const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `section${yellow_cnt++}`);
            s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
            s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            s.StylesSetPad([10, 10]);
            s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL;
            s2.AddItem(s)
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([10, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `section${yellow_cnt++}`);
            s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
            s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            s.StylesSetPad([10, 30]);
            s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL;
            s2.AddItem(s)
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
      {
         const s2 = Create_section(ss, GREY[2], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
         {
            const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `section${yellow_cnt++}`);
            s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
            s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            s.StylesSetPad([10, 10]);
            s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL;
            s2.AddItem(s)
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([10, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `section${yellow_cnt++}`);
            s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
            s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
            s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
            s.StylesSetPad([10, 10]);
            s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL;
            s2.AddItem(s)
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
         }
      }
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];




   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
function Test_alignment_nested_hor_vert_11(x, y) {

   const pos = [x, y, 0];
   const slider_size = 120;

   /********************************************************************************************************************************************************/
   // Create
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[0], 1.), 'MAIN_SECTION');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.StylesSetMargin([0, 0]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let yellow_cnt = 1;
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }

      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
      { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; section.AddItem(label); }
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;


   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];



   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
function Test_alignment_nested_vert_hor_33(x, y) {



   const pos = [x, y, 0];
   const slider_size = 60;

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [0, 0], TRANSPARENCY(GREEN[3], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL;


   let yellow_cnt = 1;
   /********************************************************************************************************************************************************/
   {
      const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[3], 1.), `section${yellow_cnt++}`);
      s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      s.StylesSetPad([10, 10]);
      s.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL | ALIGN_2.EXPAND;
      section.AddItem(s)

      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         // s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         s.AddItem(s1)

         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(BLUE[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         // s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(BLUE[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(GREEN[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         // s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(GREEN[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(PURPLE[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         // s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(PURPLE[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(ORANGER[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         // s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }
      {
         const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(ORANGER[6], .2), `section${yellow_cnt++}`);
         s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
         s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
         s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
         s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
         s1.StylesSetPad([10, 10]);
         s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND;
         s.AddItem(s1)

         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         { const label = Widget_ready_label(_, `C`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
         // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

      }






   }






   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;
   Expand(section,)

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];


   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
// function Test_alignment_nested_vert_hor_33(x, y) {



//    const pos = [x, y, 0];
//    const slider_size = 60;

//    /********************************************************************************************************************************************************/
//    // Create
//    // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
//    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [0, 0], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
//    // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [0, 0], TRANSPARENCY(GREEN[3], .8), 'Test_alignment');
//    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
//    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

//    section.StylesSetPad([10, 10]);
//    section.align_flags |= ALIGN_2.RESIZE_SELF;


//    let yellow_cnt = 1;
//    /********************************************************************************************************************************************************/
//    { 
//       const s = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(GREY[6], .3), `section${yellow_cnt++}`);
//       s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//       s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//       s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//       s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//       s.StylesSetPad([10, 10]);
//       s.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
//       section.AddItem(s)

//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL|ALIGN_2.EXPAND;
//          // s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }
//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }
//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }
//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }
//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
//          // s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }
//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }
//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.VERTICAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }
//       { 
//          const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
//          s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
//          s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//          s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
//          s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
//          s1.StylesSetPad([10, 10]);
//          s1.align_flags |= ALIGN_2.RESIZE_SELF|ALIGN_2.HORIZONTAL|ALIGN_2.EXPAND;
//          s.AddItem(s1)

//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }
//          // { const label = Widget_ready_label(_, `B`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s1.AddItem(label); }

//       }


//    }






//    /********************************************************************************************************************************************************/
//    // Align
//    const ret = Align_pre_simple(section);
//    const pad_x = section.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
//    section.geom.dim[0] = ret.dim_x + pad_x;
//    section.geom.dim[1] = ret.dim_y + pad_y;
//    Expand(section, )

//    // Calculate from pos=[0,0], and then add the user's pos
//    section.geom.pos[0] = pos[0];
//    section.geom.pos[1] = pos[1];


//    /********************************************************************************************************************************************************/
//    // Render
//    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


//    section.Render();
//    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
//    Construct_listen_events_from_mesh_tree(section)
//    Construct_listen_events_relations_from_mesh_tree(section);
//    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

//    return section;

// }



/** */
function Test_alignment_slider_hor_1(x, y) {



   const pos = [x, y, 0];
   const slider_size = 120;

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREEN[3], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let yellow_cnt = 1;
      {
         const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size);
         slider.StylesSetPad([0, 0]);
         slider.AlignAddFlags(ALIGN_2.HORIZONTAL);
         section.AddItem(slider)
      }
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;


   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];



   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
function Test_alignment_slider_hor_3(x, y) {



   const pos = [x, y, 0];
   const slider_size = 120;

   /********************************************************************************************************************************************************/
   // Create
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREEN[3], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let yellow_cnt = 1;
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];




   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
function Test_alignment_slider_vert_3(x, y) {



   const pos = [x, y, 0];
   const slider_size = 120;

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREEN[3], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let yellow_cnt = 1;
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); section.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); section.AddItem(slider); }
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;


   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];



   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
function Test_alignment_slider_vert_23(x, y) {



   const pos = [x, y, 0];
   const slider_size = 120;

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0,0,0], [0, 0], TRANSPARENCY(GREEN[3], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   let yellow_cnt = 1;
   /********************************************************************************************************************************************************/
   { // Create items
      const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
      s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      s1.StylesSetPad([10, 10]);
      s1.align_flags |= ALIGN_2.RESIZE_SELF;
      section.AddItem(s1)

      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL);    s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL);    s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL);    s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }

   }
   {
      const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
      s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      s1.StylesSetPad([10, 10]);
      s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL;
      section.AddItem(s1)

      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }

   }
   {
      const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
      s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      s1.StylesSetPad([10, 10]);
      s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL;
      section.AddItem(s1)

      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }

   }
   {
      const s1 = Create_widget_section(_, _, [0, 0], [0, 0, 1], [0, 0], TRANSPARENCY(YELLOWR[6], .2), `section${yellow_cnt++}`);
      s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      s1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      s1.StylesSetPad([10, 10]);
      s1.align_flags |= ALIGN_2.RESIZE_SELF | ALIGN_2.VERTICAL;
      section.AddItem(s1)

      { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }
      // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([10, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s1.AddItem(slider); }

   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];



   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}
function Test_alignment_slider_vert_hor_23(x, y) {

   const pos = [x, y, 0];
   const slider_size = 60;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;


   let yellow_cnt = 1;
   /********************************************************************************************************************************************************/
   { // Create items
      const ss = Create_section(section, GREY[3], `GREY[3]`, ALIGN_2.VERTICAL, pad);
      {
         const s = Create_section(ss, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND, pad);
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s.AddItem(slider); }

      }
      {
         const s = Create_section(ss, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL | ALIGN_2.EXPAND, pad)
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s.AddItem(slider); }
         // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL);  s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider); }

      }
      {
         const s = Create_section(ss, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.VERTICAL | ALIGN_2.EXPAND, pad)
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider); }

      }
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;
   Expand(section, section.align_flags,)

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];


   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

   return section;

}




/**
 * ONLY FOR ALIGN2.SELF_RESIZE sectionS for now.
 * // TODO: Add support for widgets
 * @param {*} parent 
 * @param {*} align_flags 
 * @param {*} min_width 
 * @returns 
 */
function Expand(parent, align_flags, min_width = 0) {

   let width = parent.geom.dim[0] - parent.StylesGetPad(STYLES.AXIS.X);
   if (width < min_width) width = min_width;

   for (let i = 0; i <= parent.children.boundary; i++) {

      const cur_mesh = parent.children.buffer[i];

      if (cur_mesh) {

         const pad = cur_mesh.StylesGetPad();

         if (cur_mesh.align_flags & ALIGN_2.EXPAND) {
            cur_mesh.geom.dim[0] = width;
            cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         }

         // if (align_flags & ALIGN_2.INHERIT) opt = parent.align_flags;

         // if (cur_mesh.type & MESH_TYPE.WIDGET_LABEL) {
         //    // // For other than section widgets, the parent should control cur_mesh expansion 
         //    if (align_flags & ALIGN_2.EXPAND) {
         //       cur_mesh.geom.dim[0] = width;
         //       cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //    }
         // }
         // else if (cur_mesh.type & MESH_TYPE.SECTION_MESH) {
         //    // For section widgets, the cur_mesh's align_flags should control cur_mesh expansion 

         //    // if (opt & ALIGN_2.VERTICAL) {
         //       if (cur_mesh.align_flags & ALIGN_2.EXPAND) {
         //          cur_mesh.geom.dim[0] = width;
         //          cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //       }
         //    // }
         //    // else if (opt & ALIGN_2.HORIZONTAL) {
         //       if (cur_mesh.align_flags & ALIGN_2.EXPAND) {
         //          cur_mesh.geom.dim[0] = width;
         //          cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //       }
         //    // }

         //    // Expand(cur_mesh, opt, width);
         //    width = Expand(cur_mesh, opt, width);
         //    // if(width < min_width) width = min_width;
         // }
         // else {

         //    if (opt & ALIGN_2.VERTICAL) {
         //       if (cur_mesh.align_flags & ALIGN_2.EXPAND) {
         //          cur_mesh.geom.dim[0] = width;
         //          cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //       }
         //    }
         //    else if (opt & ALIGN_2.HORIZONTAL) {
         //       // width -= cur_mesh.geom.dim[0] *2
         //       // cur_mesh.geom.dim[0] = width;
         //       // cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //    }
         // }

         Expand(cur_mesh)
      }
   }

   return width
}










/********************************************************************************** */
// Contol padding with sliders test

function Test_slider_control_pad(x, y) {

   const pos = [x, y, 0];
   const slider_size = 100;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, ALIGN_2.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align_flags |= ALIGN_2.RESIZE_SELF;



   let grey_cnt = 1;
   let purple_cnt = 1;
   let red_cnt = 1;
   let yellow_cnt = 1;
   let cyan_cnt = 1;
   /********************************************************************************************************************************************************/
   // Create slider
   const s0 = Create_section(section, GREY[1], `GREY[1]`, ALIGN_2.VERTICAL, pad);
   const s = Create_section(s0, YELLOWR[3], `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL | ALIGN_2.EXPAND, pad);
   
   { const label = Widget_ready_label(_, 'Yellow pad', _, 0, 0, 14, TRANSPARENCY(GREY[2], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
   const slider_1 = Widget_ready_slider(_, 0, 0, .0, 'Yellow', slider_size); slider_1.StylesSetPad([0, 0]); slider_1.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider_1);
   { const label = Widget_ready_label(_, 'Purple pad', _, 0, 0, 14, TRANSPARENCY(GREY[2], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
   const slider_2 = Widget_ready_slider(_, 0, 0, .0, 'Purple', slider_size); slider_2.StylesSetPad([0, 0]); slider_2.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider_2);
   { const label = Widget_ready_label(_, 'Grey pad', _, 0, 0, 14, TRANSPARENCY(GREY[2], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
   const slider_3 = Widget_ready_slider(_, 0, 0, .0, 'Grey', slider_size); slider_3.StylesSetPad([0, 0]); slider_3.AlignAddFlags(ALIGN_2.VERTICAL); s.AddItem(slider_3);

   /********************************************************************************************************************************************************/
   // Create items

   const ss = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[2], .8), 'Test_alignment');
   ss.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   ss.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   ss.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   ss.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   ss.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   ss.StylesSetPad([10, 10]);
   ss.align_flags |= ALIGN_2.RESIZE_SELF;

   const group1_meshes = [];
   const group2_meshes = [];
   const group3_meshes = [];

   { /** With Widgets */
      {
         const s2 = Create_section(ss, GREY[1], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
         group3_meshes.push(s2);
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               // { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
               // { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.VERTICAL; s.AddItem(label); }
            }
   
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               // { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align_flags |= ALIGN_2.HORIZONTAL; s.AddItem(label); }
            }
         }
      }
      {
         const s2 = Create_section(ss, GREY[1], `G2${grey_cnt++}`, ALIGN_2.HORIZONTAL, pad);
         group3_meshes.push(s2);
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
            }
   
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
            }
         }
      }
      {
         const s2 = Create_section(ss, GREY[1], `G2${grey_cnt++}`, ALIGN_2.VERTICAL, pad);
         group3_meshes.push(s2);
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
            }
   
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
            }
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
            }
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
            }
            
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
            }
            
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
            }
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.VERTICAL, pad); group1_meshes.push(s); }
            }
   
         }
         {
            const s1 = Create_section(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${red_cnt++}`, ALIGN_2.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_section(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, ALIGN_2.HORIZONTAL, pad); group1_meshes.push(s); }
            }
         }
      }

      const ret = Align_pre_simple(ss);
      const pad_x = ss.StylesGetPad(STYLES.AXIS.X);
      const pad_y = ss.StylesGetPad(STYLES.AXIS.Y);
      ss.geom.dim[0] = ret.dim_x + pad_x;
      ss.geom.dim[1] = ret.dim_y + pad_y;
      // Expand(ss, ss.align_flags,)

      ss.geom.pos[0] = 200;
      ss.geom.pos[1] = 400;

      /********************************************************************************************************************************************************/
      // Render
      ss.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


      ss.Render();
      Root_group_activate_all_vbs_in_renderqueue(ss.root_bufferidx);
      Construct_listen_events_from_mesh_tree(ss)
      Construct_listen_events_relations_from_mesh_tree(ss);
      ss.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, ss.gfx.vb.groupidx);
   }




   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;
   // Expand(section, section.align_flags,)

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];


   /********************************************************************************************************************************************************/
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);




   /********************************************************************************************************************************************************/
   // Bind slider
   const params1 = {
      target_meshes: group1_meshes,
      root_mesh: ss,
   };
   // Connect sliders to gfx program uniforms 
   Slider_connect(slider_1, (params, slider_val) => {

         const root_mesh = params.clbk_params.root_mesh;
         const target_meshes = params.clbk_params.target_meshes;
         const val = slider_val * 20 + 10

         const len = target_meshes.length;
         for(let i=0; i<len; i++) {

            const mesh = target_meshes[i];
            mesh.StylesSetPad([val, 10]);
         }
         const ret = Align_pre_simple(root_mesh, _, _, );

         
         const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
         const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
         root_mesh.geom.dim[0] = ret.dim_x + pad_x;
         root_mesh.geom.dim[1] = ret.dim_y + pad_y;
         // target_mesh.geom.dim[0] = ret.dim_x + val;
         // target_mesh.geom.dim[1] = ret.dim_y + val;

      }, params1,
   );
   const params2 = {
      target_meshes: group2_meshes,
      root_mesh: ss,
   };
   Slider_connect(slider_2, (params, slider_val) => {

         const root_mesh = params.clbk_params.root_mesh;
         const target_meshes = params.clbk_params.target_meshes;
         const val = slider_val * 20 + 10

         const len = target_meshes.length;
         for(let i=0; i<len; i++) {

            const mesh = target_meshes[i];
            mesh.StylesSetPad([val, val]);
         }
         const ret = Align_pre_simple(root_mesh, _, _, );

         
         const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
         const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
         root_mesh.geom.dim[0] = ret.dim_x + pad_x;
         root_mesh.geom.dim[1] = ret.dim_y + pad_y;
         // target_mesh.geom.dim[0] = ret.dim_x + val;
         // target_mesh.geom.dim[1] = ret.dim_y + val;

         // Gl_set_wpos_xy(target_mesh.gfx, target_mesh.geom.pos[0]+target_mesh.geom.dim[0], target_mesh.geom.pos[1]+target_mesh.geom.dim[1])
         // // Gl_set_wpos_xy(target_mesh.gfx, target_mesh.geom.pos[0], target_mesh.geom.pos[1]);
         // target_mesh.geom.SetDim(target_mesh.geom.dim, target_mesh.gfx);
         // Gl_set_dim_xy(target_mesh.gfx, target_mesh.geom.dim[0], target_mesh.geom.dim[1]);

      }, params2,
   );

   const params3 = {
      target_meshes: group3_meshes,
      root_mesh: ss,
   };
   Slider_connect(slider_3, (params, slider_val) => {

         const root_mesh = params.clbk_params.root_mesh;
         const target_meshes = params.clbk_params.target_meshes;
         const val = slider_val * 20 + 10

         const len = target_meshes.length;
         for(let i=0; i<len; i++) {

            const mesh = target_meshes[i];
            mesh.StylesSetPad([val, val]);
         }
         const ret = Align_pre_simple(root_mesh, _, _, );

         
         const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
         const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
         root_mesh.geom.dim[0] = ret.dim_x + pad_x;
         root_mesh.geom.dim[1] = ret.dim_y + pad_y;

      }, params3,
   );



   return section;

}










/********************************************************************************** */
// MOCK UPS
/** */
function Create_section(parent, color, name, align, pad = [10, 10]) {

   // const s = Create_widget_section(_, _, pad, [0, 0, 1], _, TRANSPARENCY(color, 1), name);
   const s = Create_widget_section(_, _, pad, [0, 0, 1], _, color, name);
   s.StylesSetPad(pad);
   s.align_flags |= ALIGN_2.RESIZE_SELF | align;
   s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   // s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, pad[0]); 
   s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 4);
   s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
   parent.AddItem(s);

   return s;
}
/** */
function Create_2_sections(parent, color, name, align, pad, color2, name2, align2, pad2 = [10, 10]) {

   const s = Create_section(parent, color, name, align, pad)
   {
      Create_section(s, color2, name, ALIGN_2.HORIZONTAL, pad2)
      Create_section(s, color2, name, align2, pad2)
   }

   return s;
}
/** */
function Create_triangle_height_3(parent, color, name, align, pad, dim, color2, name2, align2, pad2 = [10, 10]) {

   let cnt1 = 1;
   let cnt2 = 1;
   let cnt3 = 1;
   const s = Create_section(parent, color, name, align, pad, dim)
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad, dim);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      // Create_2_sections(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad, CYAN[6], `C${cnt3++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.VERTICAL, pad, dim);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }
   {
      const s3 = Create_section(s, GREY[5], `Y${cnt1++}`, ALIGN_2.HORIZONTAL, pad);
      Create_section(s3, GREY[9], `Y${cnt2++}`, ALIGN_2.VERTICAL, pad)
   }

   return s;
}
/********************************************************************************** */
// SAVES
