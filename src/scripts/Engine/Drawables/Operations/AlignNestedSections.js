"use strict";


/** */
export function Align_nested_sections_pre(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const x = mesh.geom.pos[0], y = mesh.geom.pos[1];
   const ret = Align_pre_simple___(mesh, x, y, pad);
   // const ret = Align_pre_simple___(mesh, pos_x, pos_y, pad);
   // const ret = Align_pre_simple___with_scroller(mesh, pos_x, pos_y, pad);

   if (mesh.align.flags & LAYOUT.RESIZE_SELF) {

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


         const ret = Align_pre_simple___(cur_mesh, cur_pos_x, cur_pos_y, pad);

         if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;

         if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
            total_size_y += ret.dim_y + cur_pad_y;
            accum_row_size_x = 0;
         }
         else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {   
            if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
         }

         accum_row_size_x += ret.dim_x + cur_pad_x;

         cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
         if(cur_mesh.align.flags & LAYOUT.FIXED_HEIGHT) cur_mesh.geom.dim[1] = ret.dim_y;
         else cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;


         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               // console.error('cur_mesh:', cur_mesh.name, 'next_mesh:', next_mesh.name, );
               cur_pos_x = mesh.geom.pos[0] + pad_x;
               cur_pos_y += row_max_size_y;
               max_size_y += row_max_size_y / 2
               row_max_size_y = 0; // Reset current row max size
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
               cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
            }
            accum_row_size_x += cur_pad_x/2;
         }
         else { // If this is the last child
            max_size_y += row_max_size_y / 2;
         }
      }
      else {

         // if(cur_mesh.type & MESH_TYPE.WIDGET_SCROLLER_BAR)
         //    console.log()
         
         const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);
         // console.log('::::::::::::::::::LAYOUT:::::::::::::::::::::::\n', cur_mesh.name, ret.dim_x, ret.dim_y)
         
         if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) {
            row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;
         }
         
         // Update the total size accumulator according to widget's align flags
         if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {
            if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
         }
         else if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
            total_size_y += ret.dim_y;
            accum_row_size_x = 0;
         }
         
         // Calculate the next position, based on the next mesh's align flags
         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {

               cur_pos_x = mesh.geom.pos[0] + pad_x;

               if (row_max_size_y > ret.dim_y) cur_pos_y += row_max_size_y;
               else cur_pos_y += ret.dim_y * 2;
               max_size_y += row_max_size_y / 2
               row_max_size_y = 0; // Reset current row max size
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
         }
         else { // If this is the last child
            max_size_y += row_max_size_y / 2;
            // console.error('cur_mesh:', cur_mesh.name, );
         }

         accum_row_size_x += ret.dim_x + (cur_pad_x / 2);

      }

      if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x;


   }

   const size_x = (mesh.align.flags & LAYOUT.FIXED_WIDTH) ? mesh.geom.dim[0] : accum_row_max_size_x;
   const size_y = (mesh.align.flags & LAYOUT.FIXED_HEIGHT) ? mesh.geom.dim[1] : max_size_y > total_size_y ? max_size_y : total_size_y;

   return {
      dim_x: size_x,
      dim_y: size_y,
   }

}
/** */
// TODO: We need a GROW_SELF that will grow based on its children size and an GROW for sharing with other sections
export function Align_pre_simple___with_grow_containers(mesh, pos_x = 0, pos_y = 0) {

   const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
   const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);

   // TODO: Pad for RESIZE_SELF should resize for children, margin should set self outside padding

   let cur_pos_x = pos_x;
   let cur_pos_y = pos_y;

   cur_pos_x += pad_x;
   cur_pos_y += pad_y;

   let total_size_x = 0;
   let total_size_y = 0;

   let accum_row_size_x = 0
   let max_size_x = 0
   let accum_row_size_y = 0
   let max_size_y = 0


   for (let i = 0; i <= mesh.children.boundary; i++) {

      const cur_mesh = mesh.children.buffer[i];

      const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
      const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

      if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

         cur_mesh.geom.pos[0] = cur_pos_x + cur_pad_x;
         cur_mesh.geom.pos[1] = cur_pos_y + cur_pad_y;

         if (cur_mesh.align.flags & LAYOUT.GROW_HORIZONTAL) {
            cur_mesh.geom.dim[0] = (((mesh.geom.dim[0] - accum_row_size_x) / cur_mesh.align.hor_grow_count) * cur_mesh.align.proportion.x);
            cur_mesh.geom.dim[0] -= cur_pad_x;
         }
         if (cur_mesh.align.flags & LAYOUT.GROW_VERTICAL) {
            cur_mesh.geom.dim[1] = (((mesh.geom.dim[1] - max_size_y) / cur_mesh.align.vert_grow_count) * cur_mesh.align.proportion.y);
            cur_mesh.geom.dim[1] -= cur_pad_y;
         }
         // console.error(Mesh_get_name(cur_mesh), 'dim[0]', cur_mesh.geom.dim[0], 'accum_x', accum_row_size_x, 'hor', cur_mesh.align.hor_grow_count, 'dim[1]', cur_mesh.geom.dim[1], 'accum_y', max_size_y, 'vert', cur_mesh.align.vert_grow_count)



         accum_row_size_x += cur_mesh.geom.dim[0] + cur_pad_x;
         if (accum_row_size_y < cur_mesh.geom.dim[1] + cur_pad_y) {
            accum_row_size_y = cur_mesh.geom.dim[1] + cur_pad_y;
         }

         const ret = Align_pre_simple___with_grow_containers(cur_mesh, cur_pos_x, cur_pos_y);

         // if (cur_mesh.align.flags & LAYOUT.VERTICAL && (cur_mesh.align.flags & LAYOUT.GROW_VERTICAL)===0) {
         //    // total_size_y += ret.dim_y + cur_pad_y;
         //    accum_row_size_y += ret.dim_y + cur_pad_y;
         //    accum_row_size_x = 0;
         // }
         // else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {
         //    total_size_x += ret.dim_x;
         //    if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
         // }

         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {

               cur_pos_x = mesh.geom.pos[0];

               if (accum_row_size_y > ret.dim_y * 2 + cur_pad_y * 2) cur_pos_y += accum_row_size_y * 2;
               else cur_pos_y += cur_mesh.geom.dim[1] * 2 + cur_pad_y * 2;
               // cur_pos_y += cur_mesh.geom.dim[1] * 2 + cur_pad_y * 2;
               max_size_y += accum_row_size_y;
               accum_row_size_x = 0;
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x * 2;
         }
         else { // If this is the last child
            max_size_y += accum_row_size_y;
         }
      }
      else {

         const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

         if (accum_row_size_y < ret.dim_y * 2 + cur_pad_y * 2) {
            accum_row_size_y = ret.dim_y * 2 + cur_pad_y * 2;
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
               if (accum_row_size_y > ret.dim_y) cur_pos_y += accum_row_size_y;
               else cur_pos_y += ret.dim_y * 2;
               cur_pos_x = mesh.geom.pos[0];
               max_size_y += accum_row_size_y / 2
               accum_row_size_y = 0; // Reset current row max size
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
         }
         else { // If this is the last child
            max_size_y += accum_row_size_y / 2;
         }
         accum_row_size_x += ret.dim_x + (cur_pad_x / 2);
         // accum_row_size_x += ret.dim_x ;

      }

      if (max_size_x < accum_row_size_x) max_size_x = accum_row_size_x

   }


   const size_x = (mesh.align.flags & LAYOUT.FIXED_WIDTH) ? mesh.geom.dim[0] : max_size_x;
   const size_y = (mesh.align.flags & LAYOUT.FIXED_HEIGHT) ? mesh.geom.dim[1] : max_size_y > total_size_y ? max_size_y : total_size_y;

   return {
      dim_x: size_x,
      dim_y: size_y,
   }


}


/** Expand width of all children meshes to the widest width dimention */
export function Align_expand(parent, min_width = 0) {

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

         Align_expand(cur_mesh)
      }
   }

   return width
}




/** SAVES: DO NOT DELETE */
// function Align_pre_simple___(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    let cur_pos_x = pos_x;
//    let cur_pos_y = pos_y;
//    cur_pos_x += pad_x;
//    cur_pos_y += pad_y;


//    let total_size_y = 0;

//    let accum_row_size_x = 0
//    let accum_row_max_size_x = 0
//    let row_max_size_y = 0
//    let max_size_y = 0


//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);


//       if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

//          cur_mesh.geom.pos[0] = cur_pos_x;
//          cur_mesh.geom.pos[1] = cur_pos_y;


//          const ret = Align_pre_simple___(cur_mesh, cur_pos_x, cur_pos_y, pad);

//          if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;

//          if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
//             total_size_y += ret.dim_y + cur_pad_y;
//             accum_row_size_x = 0;
//          }
//          else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {   
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//          }

//          accum_row_size_x += ret.dim_x + cur_pad_x;

//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          if(cur_mesh.align.flags & LAYOUT.FIXED_HEIGHT) cur_mesh.geom.dim[1] = ret.dim_y;
//          else cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;


//          const next_mesh = mesh.children.buffer[i + 1];
//          if (next_mesh) {
//             if (next_mesh.align.flags & LAYOUT.VERTICAL) {
//                cur_pos_x = mesh.geom.pos[0] + cur_pad_x;
//                cur_pos_y += row_max_size_y;
//                /**DO NOT DELETE: The above line works fine, but keep the code below,  */
//                // if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) 
//                //    cur_pos_y += row_max_size_y;
//                // else {
//                //    cur_pos_y += cur_mesh.geom.dim[1] * 2;
//                //    console.error('===============================================\ncur_mesh:', cur_mesh.name, 'next_mesh:', next_mesh.name, '\nrow_max_size_y', row_max_size_y, 'cur_mesh.dim', cur_mesh.geom.dim[1] * 2);
//                // }
//                max_size_y += row_max_size_y / 2
//                row_max_size_y = 0; // Reset current row max size
//             }
//             else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
//                cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
//             }
//             accum_row_size_x += cur_pad_x/2;
//          }
//          else { // If this is the last child
//             max_size_y += row_max_size_y / 2;
//          }
//       }
//       else {

//          const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);
//          console.log(cur_mesh.name, ret.dim_x, ret.dim_y)

//          if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) {
//             row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;
//          }

//          // Update the total size accumulator according to widget's align flags
//          if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//          }
//          else if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
//             total_size_y += ret.dim_y;
//             accum_row_size_x = 0;
//          }

//          // Calculate the next position, based on the next mesh's align flags
//          const next_mesh = mesh.children.buffer[i + 1];
//          if (next_mesh) {
//             if (next_mesh.align.flags & LAYOUT.VERTICAL) {
//                if (row_max_size_y > ret.dim_y) cur_pos_y += row_max_size_y;
//                else cur_pos_y += ret.dim_y * 2;
//                cur_pos_x = mesh.geom.pos[0] + pad_x;
//                max_size_y += row_max_size_y / 2
//                // row_max_size_y = 0; // Reset current row max size
//             }
//             else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
//          }
//          else { // If this is the last child
//             max_size_y += row_max_size_y / 2;
//          }
         
//          accum_row_size_x += ret.dim_x + (cur_pad_x / 2);

//       }

//       if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x;

//    }

//    const size_x = (mesh.align.flags & LAYOUT.FIXED_WIDTH) ? mesh.geom.dim[0] : accum_row_max_size_x;
//    const size_y = (mesh.align.flags & LAYOUT.FIXED_HEIGHT) ? mesh.geom.dim[1] : max_size_y > total_size_y ? max_size_y : total_size_y;

//    return {
//       dim_x: size_x,
//       dim_y: size_y,
//    }

// }


/** Unused */
/** Align nested sections in Horizontal/Vertical manner, without updating vertex buffers. */
// export function Layout_calculate_grow_children_count_layout(root) {

//    let hor_count = 1;
//    let vert_count = 1;

//    // Calculate 
//    for (let i = root.children.boundary; i >= 0; i--) {


//       const child = root.children.buffer[i];

//       if (child.children.boundary >= 0) {
//          Layout_calculate_grow_children_count_layout(child);
//       }

//       if (child.align.flags & LAYOUT.HORIZONTAL) {

//          child.align.hor_grow_count = hor_count;
//          hor_count++;
//          child.align.vert_grow_count = vert_count;
//       }
//       else if (child.align.flags & LAYOUT.VERTICAL) {

//          child.align.vert_grow_count = vert_count;
//          vert_count++;
//          child.align.hor_grow_count = hor_count;
//          hor_count = 1;
//       }

//       //  console.log(Mesh_get_name(child), child.align.hor_grow_count, child.align.vert_grow_count)

//    }

// }
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
/** NOT IMPLEMENTED */
// /** Align nested sections in Horizontal/Vertical manner, without updating vertex buffers. */
// function Align_pre_simple___with_scroller(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

//    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
//    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);


//    let cur_pos_x = pos_x;
//    let cur_pos_y = pos_y;
//    cur_pos_x += pad_x;
//    cur_pos_y += pad_y;

//    let total_size_y = 0;

//    let accum_row_size_x = 0
//    let accum_row_max_size_x = 0
//    let row_max_size_y = 0
//    let max_size_y = 0

//    let skip = false;




//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const cur_mesh = mesh.children.buffer[i];

//       const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
//       const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

//       if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

//          cur_mesh.geom.pos[0] = cur_pos_x;
//          cur_mesh.geom.pos[1] = cur_pos_y;

//          const ret = Align_pre_simple___with_scroller(cur_mesh, cur_pos_x, cur_pos_y, pad);

//          /** Scroller resize based on scrolled section height or scollers max_height */
//          if (cur_mesh.scroller_comp) {
//             // Scroller_component_set_pos_xy(cur_mesh.scroller_comp, cur_pos_x-cur_pad_x, cur_pos_y-cur_pad_y);

//             total_size_y += cur_mesh.scroller_comp.geom.dim[1];

//             if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
//                cur_pos_y += cur_mesh.scroller_comp.geom.dim[1] * 2;

//                accum_row_size_x = 0;
//                // accum_row_size_x += cur_mesh.scroller_comp.geom.dim[0] + cur_pad_x; // Add scroller's width to the total size
//                accum_row_size_x += cur_mesh.scroller_comp.geom.dim[0]; // Add scroller's width to the total size
//             }

//             skip = true;

//          }


//          if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;

//          if (!skip) {
//             if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
//                total_size_y += ret.dim_y + cur_pad_y;
//                accum_row_size_x = 0;
//             }
//             else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {
//                if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//             }

//          }


//          accum_row_size_x += ret.dim_x + cur_pad_x;

//          cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
//          cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;




//          if (!skip) {
//             const next_mesh = mesh.children.buffer[i + 1];
//             if (next_mesh) {
//                if (next_mesh.align.flags & LAYOUT.VERTICAL) {
//                   cur_pos_x = mesh.geom.pos[0] + pad_x;
//                   if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) cur_pos_y += row_max_size_y;
//                   else cur_pos_y += cur_mesh.geom.dim[1] * 2;
//                   max_size_y += row_max_size_y / 2
//                   row_max_size_y = 0; // Reset current row max size
//                }
//                else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2;
//             }
//             else { // If this is the last child
//                max_size_y += row_max_size_y / 2;
//             }
//          }


//       }
//       else {

//          const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

//          if (row_max_size_y < ret.dim_y * 2 + cur_pad_y * 2) {
//             row_max_size_y = ret.dim_y * 2 + cur_pad_y * 2;
//          }

//          // Update the total size accumulator according to widget's align flags
//          if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {
//             if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
//          }
//          else if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
//             total_size_y += ret.dim_y;
//             accum_row_size_x = 0;
//          }

//          // Calculate the next position, based on the next mesh's align flags
//          const next_mesh = mesh.children.buffer[i + 1];
//          if (next_mesh) {
//             if (next_mesh.align.flags & LAYOUT.VERTICAL) {
//                if (row_max_size_y > ret.dim_y) cur_pos_y += row_max_size_y;
//                else cur_pos_y += ret.dim_y * 2;
//                cur_pos_x = mesh.geom.pos[0] + pad_x;
//                max_size_y += row_max_size_y / 2;
//                row_max_size_y = 0; // Reset current row max size
//             }
//             else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
//          }
//          else { // If this is the last child
//             max_size_y += row_max_size_y / 2;
//          }
//          accum_row_size_x += ret.dim_x + (cur_pad_x / 2);

//       }

//       if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

//    }

//    const size_x = (mesh.align.flags & LAYOUT.FIXED_WIDTH) ? mesh.geom.dim[0] : accum_row_max_size_x;
//    const size_y = (mesh.align.flags & LAYOUT.FIXED_HEIGHT) ? mesh.geom.dim[1] : max_size_y > total_size_y ? max_size_y : total_size_y;

//    return {
//       dim_x: size_x,
//       dim_y: size_y,
//    }


// }
