"use strict";


/** */
export function Layout_basic_pre_render(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const x = mesh.geom.pos[0], y = mesh.geom.pos[1];
   const ret = Layout_basic_pre(mesh, x, y, pad);
   // const ret = Layout_basic_pre(mesh, pos_x, pos_y, pad);
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
function Layout_basic_pre(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

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
      
      if(cur_mesh.mesh_bufferidx === 23)
         console.log()

      const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
      const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

      if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

         cur_mesh.geom.pos[0] = cur_pos_x;
         cur_mesh.geom.pos[1] = cur_pos_y;


         const ret = Layout_basic_pre(cur_mesh, cur_pos_x, cur_pos_y, pad);

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
               // cur_pos_x = mesh.geom.pos[0];
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

         const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);
         
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
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
               cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
            }
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
// TODO: We need a GROW_SELF that will grow based on its children size and a GROW_XXX for sharing with other sections
export function Layout_grow_containers_pre_render(mesh, pos_x = 0, pos_y = 0) {

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
   let accum_row_max_size_x = 0
   let row_max_size_y = 0
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


         accum_row_size_x += cur_mesh.geom.dim[0] + cur_pad_x;
         if (row_max_size_y < cur_mesh.geom.dim[1] + cur_pad_y) {
            row_max_size_y = cur_mesh.geom.dim[1] + cur_pad_y;
         }

         const ret = Layout_grow_containers_pre_render(cur_mesh, cur_pos_x, cur_pos_y);

         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {

               cur_pos_x = mesh.geom.pos[0];
               if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) cur_pos_y += row_max_size_y * 2;
               else cur_pos_y += cur_mesh.geom.dim[1] * 2 + cur_pad_y * 2;
               max_size_y += row_max_size_y;
               accum_row_size_x = 0;
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x * 2;
         }
         else { // If this is the last child
            max_size_y += row_max_size_y;
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
               cur_pos_x = mesh.geom.pos[0];
               max_size_y += row_max_size_y / 2
               row_max_size_y = 0; // Reset current row max size
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) 
               cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
         }
         else { // If this is the last child
            max_size_y += row_max_size_y / 2;
         }
         accum_row_size_x += ret.dim_x + (cur_pad_x / 2);

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
/** */
export function Layout_grow_containers_pre_render_with_item_reposition(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const x = mesh.geom.pos[0], y = mesh.geom.pos[1];
   // const ret = Layout_grow_containers_pre_with_item_reposition(mesh, x, y, pad);
   const ret = Layout_grow_containers_pre_with_item_reposition(mesh);

   // if (mesh.align.flags & LAYOUT.RESIZE_SELF) {

   //    const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
   //    const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);
      // mesh.geom.dim[0] = ret.dim_x + pad_x;
      // mesh.geom.dim[1] = ret.dim_y + pad_y;
   // }

   return ret;

}
/** */
function Layout_grow_containers_pre_with_item_reposition(mesh, pos_x = 0, pos_y = 0) {

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

         cur_mesh.geom.pos[0] = cur_pos_x + cur_pad_x;
         cur_mesh.geom.pos[1] = cur_pos_y + cur_pad_y;

         // const ret = Layout_grow_containers_pre_with_item_reposition(cur_mesh, cur_pos_x, cur_pos_y);

         if((cur_mesh.align.flags & LAYOUT.GROW_HORIZONTAL) || (cur_mesh.align.flags & LAYOUT.GROW_VERTICAL)) {

            if (cur_mesh.align.flags & LAYOUT.GROW_HORIZONTAL) {
               cur_mesh.geom.dim[0] = (((mesh.geom.dim[0] - accum_row_size_x) / cur_mesh.align.hor_grow_count) * cur_mesh.align.proportion.x);
               // console.log(cur_mesh.name, cur_mesh.align.hor_grow_count, cur_mesh.align.proportion.x, mesh.geom.dim[0],cur_mesh.geom.dim[0] ,accum_row_size_x )
               cur_mesh.geom.dim[0] -= cur_pad_x;
            }
            if (cur_mesh.align.flags & LAYOUT.GROW_VERTICAL) {
               cur_mesh.geom.dim[1] = (((mesh.geom.dim[1] - max_size_y) / cur_mesh.align.vert_grow_count) * cur_mesh.align.proportion.y);
               cur_mesh.geom.dim[1] -= cur_pad_y;
            }
   
            accum_row_size_x += cur_mesh.geom.dim[0] + cur_pad_x;
            if (row_max_size_y < cur_mesh.geom.dim[1] + cur_pad_y) {
               row_max_size_y = cur_mesh.geom.dim[1] + cur_pad_y;
            }
         }


         const ret = Layout_grow_containers_pre_with_item_reposition(cur_mesh, cur_pos_x, cur_pos_y);


         if(cur_mesh.type & MESH_TYPE.WIDGET_DROP_DOWN || cur_mesh.type & MESH_TYPE.DROP_DOWN_MENU) {
            if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
               total_size_y += ret.dim_y + cur_pad_y;
               accum_row_size_x = 0;
            }
            else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {   
               if (total_size_y < ret.dim_y + cur_pad_y) total_size_y = ret.dim_y + cur_pad_y;
            }

            accum_row_size_x += ret.dim_x + cur_pad_x;
         
            // cur_mesh.geom.dim[0] = ret.dim_x + cur_pad_x;
            cur_mesh.geom.dim[0] = ret.dim_x;
            if(cur_mesh.align.flags & LAYOUT.FIXED_HEIGHT) cur_mesh.geom.dim[1] = ret.dim_y;
            // else cur_mesh.geom.dim[1] = ret.dim_y + cur_pad_y;
            else cur_mesh.geom.dim[1] = ret.dim_y;
         }
         
         
         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {

            
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {

               cur_pos_x = mesh.geom.pos[0];
               if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) cur_pos_y += row_max_size_y * 2;
               else cur_pos_y += cur_mesh.geom.dim[1] * 2 + cur_pad_y * 2;
               max_size_y += row_max_size_y;
               accum_row_size_x = 0;
               // console.log(cur_mesh.name, 'new row')
               row_max_size_y = 0; // restarts the new row size counter, otherwise the row max size will continue to rows that have their own max height
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
               // console.log(cur_mesh.name, 'new col')
               cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x * 2;
            }
         }
         else { // If this is the last child
            max_size_y += row_max_size_y;
         }

         if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x;
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
            // total_size_x = ret.dim_x;
            accum_row_size_x = 0;
         }

         accum_row_size_x += ret.dim_x + (cur_pad_x / 2);


         // Calculate the next position, based on the next mesh's align flags
         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               
               cur_pos_x = mesh.geom.pos[0];

               if (row_max_size_y > ret.dim_y) cur_pos_y += row_max_size_y;
               else cur_pos_y += ret.dim_y * 2;
               max_size_y += row_max_size_y / 2;
               row_max_size_y = 0; // Reset current row max size
               accum_row_size_x = 0;
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {

               cur_pos_x += cur_mesh.geom.dim[0] * 2 + cur_pad_x;
               
               // Wrap around widgets
               if(cur_pos_x + next_mesh.geom.dim[0]*2 + cur_pad_x >= mesh.geom.pos[0] + mesh.geom.dim[0]*2) {

                  cur_pos_x = mesh.geom.pos[0];
                  cur_pos_y += row_max_size_y;

               }
            }
         }
         else { // If this is the last child
            max_size_y += row_max_size_y / 2;
         }

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
/** Expand width of all children meshes to the widest width dimention */
export function Layout_expand_x_axis(parent, min_width = 0) {

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

         Layout_expand_x_axis(cur_mesh)
      }
   }

   return width
}


