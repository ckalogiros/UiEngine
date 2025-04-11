"use strict";

import { Mesh_set_dim_xy } from "./MeshAttributesFunctions";


/** Align nested sections in Horizontal/Vertical manner, without updating vertex buffers. */
export function Align_nested_sections_pre(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
   const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);

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


   for (let i = 0; i <= mesh.children.boundary; i++) {

      const cur_mesh = mesh.children.buffer[i];

      const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
      const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

      if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

         cur_mesh.geom.pos[0] = cur_pos_x;
         cur_mesh.geom.pos[1] = cur_pos_y;

         const ret = Align_pre_simple(cur_mesh, cur_pos_x, cur_pos_y, pad);


         if (cur_mesh.align.flags & LAYOUT.VERTICAL) {

            // if (total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
            total_size_y += ret.dim_y + cur_pad_y;
            if (i !== 0) accum_row_size_x = 0; row++;
         }
         else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {

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
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               cur_pos_x = mesh.geom.pos[0] + pad_x;
               if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) {
                  cur_pos_y += row_max_size_y;
               }
               else cur_pos_y += cur_mesh.geom.dim[1] * 2;
               row_max_size_y = 0;
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
               cur_pos_x += cur_mesh.geom.dim[0] * 2;
            }
         }
      }
      else {

         const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

         if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {

            total_size_x += ret.dim_x;
            total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis
            if (i !== 0) accum_row_size_x = 0;
         }
         else if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
            total_size_y += ret.dim_y; // Accumulate in y-dimention
            // if (total_size_x < ret.dim_x) 
            total_size_x = ret.dim_x; // Set in x-axis
         }

         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
               cur_pos_x += ret.dim_x * 2;
            }
            else if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               cur_pos_y += ret.dim_y * 2;
               cur_pos_x = mesh.geom.pos[0] + pad_x;
            }
         }

         if (accum_row_size_x < total_size_x) accum_row_size_x = total_size_x;
         if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

      }

   }

   const size_x = accum_row_max_size_x;
   const size_y = total_size_y;
   return {
      dim: [accum_row_max_size_x, size_y],
      dim_x: size_x,
      dim_y: size_y,
   }


}
/** Align nested sections in Horizontal/Vertical manner, with vertex buffers update. */
export function Align_nested_sections_post(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
   const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);

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


   for (let i = 0; i <= mesh.children.boundary; i++) {

      const cur_mesh = mesh.children.buffer[i];

      const cur_pad_x = cur_mesh.StylesGetPad(STYLES.AXIS.X);
      const cur_pad_y = cur_mesh.StylesGetPad(STYLES.AXIS.Y);

      if (cur_mesh.align.flags & LAYOUT.RESIZE_SELF) {

         cur_mesh.geom.pos[0] = cur_pos_x;
         cur_mesh.geom.pos[1] = cur_pos_y;

         const ret = Align_pre_simple(cur_mesh, cur_pos_x, cur_pos_y, pad);


         if (cur_mesh.align.flags & LAYOUT.VERTICAL) {

            // if (total_size_x < ret.dim_x + cur_pad_x) total_size_x = ret.dim_x + cur_pad_x; // Set in x-axis
            total_size_y += ret.dim_y + cur_pad_y;
            if (i !== 0) accum_row_size_x = 0; row++;
         }
         else if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {

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
            if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               cur_pos_x = mesh.geom.pos[0] + pad_x;
               if (row_max_size_y > ret.dim_y * 2 + cur_pad_y * 2) {
                  cur_pos_y += row_max_size_y;
               }
               else cur_pos_y += cur_mesh.geom.dim[1] * 2;
               row_max_size_y = 0;
            }
            else if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
               cur_pos_x += cur_mesh.geom.dim[0] * 2;
            }
         }
      }
      else {

         const ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

         if (cur_mesh.align.flags & LAYOUT.HORIZONTAL) {

            total_size_x += ret.dim_x;
            total_size_y = (total_size_y < ret.dim_y) ? ret.dim_y : total_size_y; // Set in y-axis
            if (i !== 0) accum_row_size_x = 0;
         }
         else if (cur_mesh.align.flags & LAYOUT.VERTICAL) {
            total_size_y += ret.dim_y; // Accumulate in y-dimention
            // if (total_size_x < ret.dim_x) 
            total_size_x = ret.dim_x; // Set in x-axis
         }

         const next_mesh = mesh.children.buffer[i + 1];
         if (next_mesh) {
            if (next_mesh.align.flags & LAYOUT.HORIZONTAL) {
               cur_pos_x += ret.dim_x * 2;
            }
            else if (next_mesh.align.flags & LAYOUT.VERTICAL) {
               cur_pos_y += ret.dim_y * 2;
               cur_pos_x = mesh.geom.pos[0] + pad_x;
            }
         }

         // accum_row_size_x += ret.dim_x + cur_pad_x;
         if (accum_row_size_x < total_size_x) accum_row_size_x = total_size_x;
         if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

      }

   }

   if (mesh.gfx) {
      Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0]+mesh.geom.dim[0], mesh.geom.pos[1]+mesh.geom.dim[1])
      // Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0], mesh.geom.pos[1]);
      // mesh.geom.UpdateSetWposXY(mesh.gfx);
      Mesh_set_dim_xy(mesh);
      Gl_set_dim_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);
   }
   // console.log(mesh.GetName())
   const size_x = accum_row_max_size_x;
   const size_y = total_size_y;
   return {
      dim: [accum_row_max_size_x, size_y],
      dim_x: size_x,
      dim_y: size_y,
   }


}