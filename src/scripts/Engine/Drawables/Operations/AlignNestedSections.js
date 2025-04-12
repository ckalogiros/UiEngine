"use strict";

// import { Gl_set_dim_xy, Gl_set_wpos_xy } from "../../../Graphics/Buffers/VertexBuffersOps.js";
// import { Mesh_set_dim_x } from "./MeshAttributesFunctions.js";



/** */
export function Align_nested_sections_pre(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const ret = Align_pre_simple___(mesh, pos_x, pos_y, pad);
   if(mesh.align.flags & LAYOUT.RESIZE_SELF) {

      const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);
      mesh.geom.dim[0] = ret.dim_x + pad_x;
      mesh.geom.dim[1] = ret.dim_y + pad_y;
   }

   return ret;

}
/** Align nested sections in Horizontal/Vertical manner, without updating vertex buffers. */
function Align_pre_simple___(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
   const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


   let cur_pos_x = pos_x;
   let cur_pos_y = pos_y;
   cur_pos_x += pad_x;
   cur_pos_y += pad_y;

   let total_size_x = 0;
   let total_size_y = 0;

   let accum_row_size_x = 0
   let accum_row_max_size_x = 0
   let row_max_size_y = 0
   let max_size_y = 0




   for (let i = 0; i <= mesh.children.boundary; i++) {

      const cur_mesh = mesh.children.buffer[i];

      const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
      const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);


      if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

         cur_mesh.geom.pos[0] = cur_pos_x;
         cur_mesh.geom.pos[1] = cur_pos_y;


         const ret = Align_pre_simple___(cur_mesh, cur_pos_x, cur_pos_y, pad, max_size_y);

         if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;

         if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
            total_size_y += ret.dim_y + cur_pad_y;
            accum_row_size_x = 0;
         }
         else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {
            total_size_x += ret.dim_x;
            if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
         }

         accum_row_size_x += ret.dim_x + cur_pad_x;

         cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
         cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;


         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               cur_pos_x = mesh.geom.pos[0] + pad_x;
               if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) cur_pos_y += row_max_size_y;
               else cur_pos_y += cur_mesh.geom.dim[1] * 2;
               max_size_y += row_max_size_y / 2
               row_max_size_y = 0; // Reset current row max size
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2;
         }
         else { // If this is the last child
            max_size_y += row_max_size_y / 2;
         }
      }
      else {

         const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

         if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) {
            row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;
         }

         // Update the total size accumulator according to widget's align flags
         if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {
            total_size_x += ret.dim_x;
            if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
         }
         else if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
            total_size_y += ret.dim_y;
            total_size_x = ret.dim_x;
            accum_row_size_x = 0;
         }

         // Calculate the next position, based on the next mesh's align flags
         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               if (row_max_size_y > ret.dim_y) cur_pos_y += row_max_size_y;
               else cur_pos_y += ret.dim_y * 2;
               cur_pos_x = mesh.geom.pos[0] + pad_x;
               max_size_y += row_max_size_y / 2
               row_max_size_y = 0; // Reset current row max size
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2+cur_pad_x;
         }
         else { // If this is the last child
            max_size_y += row_max_size_y / 2;
         }
         accum_row_size_x += ret.dim_x + (cur_pad_x/2);
         // accum_row_size_x += ret.dim_x ;
         
      }

      if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

   }

   const size_x = (mesh.align.flags & LAYOUT.FIXED_WIDTH) ? mesh.geom.dim[0] : accum_row_max_size_x;
   const size_y = (mesh.align.flags & LAYOUT.FIXED_HEIGHT) ? mesh.geom.dim[1] : max_size_y > total_size_y ? max_size_y : total_size_y;

   return {
      dim_x: size_x,
      dim_y: size_y,
   }


}


// TODO - Implement Align_nested_sections_post
/** Align nested sections in Horizontal/Vertical manner, with vertex buffers update. */
// export function Align_nested_sections_post(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);

//    let cur_pos_x = pos_x;
//    let cur_pos_y = pos_y;
//    cur_pos_x += pad_x;
//    cur_pos_y += pad_y;

//    let total_size_x = 0;
//    let total_size_y = 0;

//    let row_max_size_y = 0

//    let accum_row_size_x = 0
//    let accum_row_max_size_x = 0
//    let accum_row_size_y = 0
//    let row = 0


//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//       if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

//          cur_mesh.geom.pos[0] = cur_pos_x;
//          cur_mesh.geom.pos[1] = cur_pos_y;

//          const ret = Align_nested_sections_post(cur_mesh, cur_pos_x, cur_pos_y, pad);


//          if (cur_mesh.align.flags & LAYOUT.VERTICAL) {

//             // if (total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
//             total_size_y += ret.dim_y + cur_pad_y;
//             if (i !== 0) accum_row_size_x = 0; row++;
//          }
//          else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {

//             // total_size_x += ret.dim_x + cur_pad_x; // Set in x-axis
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//             if (i !== 0) accum_row_size_y = 0;
//          }

//          accum_row_size_x += ret.dim_x + cur_pad_x;
//          if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

//          if (accum_row_size_y < ret.dim_y + cur_pad_y) {
//             accum_row_size_y = ret.dim_y + cur_pad_y;
//          }
//          if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) {
//             row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;
//          }


//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;


//          const next_mesh = mesh.children.buffer[i + 1];
//          if (next_mesh) {
//             if (next_mesh.align.flags & LAYOUT.VERTICAL) {
//                cur_pos_x = mesh.geom.pos[0] + pad_x;
//                if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) {
//                   cur_pos_y += row_max_size_y;
//                }
//                else cur_pos_y += cur_mesh.geom.dim[1] * 2;
//                row_max_size_y = 0;
//             }
//             else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
//                cur_pos_x += cur_mesh.geom.dim[0] * 2;
//             }
//          }
//       }
//       else {

//          const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

//          if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {

//             total_size_x += ret.dim_x;
//             total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis
//             if (i !== 0) accum_row_size_x = 0;
//          }
//          else if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
//             total_size_y += ret.dim_y; // Accumulate in y-dimention
//             // if (total_size_x < ret.dim_x) 
//             total_size_x = ret.dim_x; // Set in x-axis
//          }

//          const next_mesh = mesh.children.buffer[i + 1];
//          if (next_mesh) {
//             if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
//                cur_pos_x += ret.dim_x * 2;
//             }
//             else if (next_mesh.align.flags & LAYOUT.VERTICAL) {
//                cur_pos_y += ret.dim_y * 2;
//                cur_pos_x = mesh.geom.pos[0] + pad_x;
//             }
//          }

//          // accum_row_size_x += ret.dim_x + cur_pad_x;
//          if (accum_row_size_x < total_size_x) accum_row_size_x = total_size_x;
//          if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

//       }

//    }

//    if (mesh.gfx) {
//       Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+mesh.geom.dim[0], mesh.geom.pos[1]+mesh.geom.dim[1])
//       Mesh_set_dim_x(mesh);
//       Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);
//    }
//    const size_x = accum_row_max_size_x;
//    const size_y = total_size_y;
//    return {
//       dim: [accum_row_max_size_x, size_y],
//       dim_x: size_x,
//       dim_y: size_y,
//    }


// }




/**
 * ONLY FOR ALIGN2.SELF_RESIZE sectionS for now.
 * // TODO: Add support for widgets
 * @param {*} parent 
 * @param {*} align.flags 
 * @param {*} min_width 
 * @returns 
 */
export function Align_expand(parent, align_flags, min_width = 0) {

   let width = parent.geom.dim[0] - parent.StylesGetPad(STYLES.AXIS.X);
   if (width < min_width) width = min_width;

   for (let i = 0; i <= parent.children.boundary; i++) {

      const cur_mesh = parent.children.buffer[i];

      if (cur_mesh) {

         const pad = cur_mesh.StylesGetPad();

         if (cur_mesh.align.flags & LAYOUT.EXPAND) {
            cur_mesh.geom.dim[0] = width;
            cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         }
         if (cur_mesh.align.flags & LAYOUT.FLOAT_RIGHT) {

         }

         // if (align.flags & LAYOUT.INHERIT) opt = parent.align.flags;

         // if (cur_mesh.type & MESH_TYPE.WIDGET_LABEL) {
         //    // // For other than section widgets, the parent should control cur_mesh expansion 
         //    if (align.flags & LAYOUT.EXPAND) {
         //       cur_mesh.geom.dim[0] = width;
         //       cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //    }
         // }
         // else if (cur_mesh.type & MESH_TYPE.SECTION_MESH) {
         //    // For section widgets, the cur_mesh's align.flags should control cur_mesh expansion 

         //    // if (opt & LAYOUT.VERTICAL) {
         //       if (cur_mesh.align.flags & LAYOUT.EXPAND) {
         //          cur_mesh.geom.dim[0] = width;
         //          cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //       }
         //    // }
         //    // else if (opt & LAYOUT.HORIZONTAL) {
         //       if (cur_mesh.align.flags & LAYOUT.EXPAND) {
         //          cur_mesh.geom.dim[0] = width;
         //          cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //       }
         //    // }

         //    // Align_expand(cur_mesh, opt, width);
         //    width = Align_expand(cur_mesh, opt, width);
         //    // if(width < min_width) width = min_width;
         // }
         // else {

         //    if (opt & LAYOUT.VERTICAL) {
         //       if (cur_mesh.align.flags & LAYOUT.EXPAND) {
         //          cur_mesh.geom.dim[0] = width;
         //          cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //       }
         //    }
         //    else if (opt & LAYOUT.HORIZONTAL) {
         //       // width -= cur_mesh.geom.dim[0] *2
         //       // cur_mesh.geom.dim[0] = width;
         //       // cur_mesh.geom.defDim[0] = cur_mesh.geom.dim[0] + pad[0];
         //    }
         // }

         Align_expand(cur_mesh)
      }
   }

   return width
}