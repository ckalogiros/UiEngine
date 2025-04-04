"use strict";

import { Create_rect_mesh } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLUE, BLUEL, GREEN, GREY, ORANGE, REDL, ORANGER, PURPLE, PURPLEB, PURPLER, RED, YELLOWR, CYAN, TRANSPARENT, BLACK } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Style_rect_default_properties } from "../../Engine/Drawables/Widgets/WidgetReadyStyles.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Gl_set_angle, Gl_set_attr_round_corners, Gl_set_dim_xy, Gl_set_wpos_xy } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Widget_gfx_ready_enable } from "../Widgets/WidgetGfxReady.js";
import { Widget_ready_label, Widget_ready_slider } from "../Widgets/WidgetReadyWidgets.js";




export function Test_alignment() {

   let mesh = null;
   let x = 100, y = 600;

   mesh = Test_alignment_nested_2(50, y); y += mesh.geom.dim[1] * 2 + 20;

   // Create_triangle_structure();

   // mesh = Test_alignment_slider_vert_hor_with_expand(400, y); y += mesh.geom.dim[1] * 2 + 20

   // mesh = Test_alignment_slider_vert_23(30, 60); y += mesh.geom.dim[1] * 2 + 20;

   // Test_align_float_right(40, 100);

   // Test_slider_control_pad(30, 70);
}





/** Finds the 'left most' mesh positioned at the right side of the parent, if any, else returns null */
/** Finds the position of the last mesh, that has '.FLOAT_RIGHT', if any, else calculate the position from the left parent's side. Pads included */
function Find_last_right_aligned_child_from_parent(cur_pos_x = 0, parent = null, cur_mesh = null, cur_pad_x = 0, parent_pad_x = 0,) {
   if (!parent) alert('432543654765');

   let last_right_mesh = null;
   for (let i = 0; i <= parent.children.boundary; i++) {

      const child = parent.children.buffer[i];
      /** Prerequisites: 
       * 1. Have 'FLOAT_RIGHT' flag. 
       * 2. Avoid same mesh. 
       * 3. The found last mesh must have been already aligned.
       * 4. Include meshes only if they belong to the same 'row_counter'. Avoids extending the float right on meshes with different rows(VERTICAL laignment)
       * // TODO: See if we can optimize by less Prerequisites
       */
      if ((child.align.flags & LAYOUT.FLOAT_RIGHT) && child.mesh_bufferidx !== cur_mesh.mesh_bufferidx && child.geom.pos[0] > 0 && child.align.row === cur_mesh.align.row) {
         last_right_mesh = child;
      }
   }


   let pos_x = 0;
   if (last_right_mesh) {
      const pad_x = cur_pad_x * 2; // Pad MUST be twice, because the same pad is going to be added later on in Align_pre_simple()
      // pos_x = last_right_mesh.geom.pos[0] - (cur_mesh.geom.dim[0]*2 + pad_x + last_right_mesh.geom.dim[0]*2); // Float mesh to the parent's right side, pads included
      pos_x = last_right_mesh.geom.pos[0] - (cur_mesh.geom.dim[0] * 2 + pad_x); // Float mesh to the parent's right side, pads included
   }
   else {

      // pos_x = parent_pos_x + parent.geom.dim[0]*2 - (cur_mesh.geom.dim[0]*2); // Float mesh to the parent's right side, pads included
      pos_x = parent.geom.pos[0] + parent.geom.dim[0] * 2 + parent_pad_x - (cur_mesh.geom.dim[0] * 2); // Float mesh to the parent's right side, pads included
      console.log('0 -', cur_mesh.GetName())
   }

   return pos_x;
}

/** */
export function Align_pre_simple(mesh, pos_x = 0, pos_y = 0, pad = [10, 10]) {

   const ret = Align_pre_simple___(mesh, pos_x, pos_y, pad);
   if(mesh.align.flags & LAYOUT.RESIZE_SELF) {

      const pad_x = mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = mesh.StylesGetPad(STYLES.AXIS.Y);
      mesh.geom.dim[0] = ret.dim_x + pad_x;
      mesh.geom.dim[1] = ret.dim_y + pad_y;
   }

   return ret;

}
/** */
function Align_pre_simple___(mesh, pos_x = 0, pos_y = 0, pad = [10, 10],) {

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

   // console.log('  total_size_y', total_size_y, 'row_max_size_y', row_max_size_y, mesh.GetName())

   const size_x = (mesh.align.flags & LAYOUT.FIXED_WIDTH) ? mesh.geom.dim[0] : accum_row_max_size_x;
   const size_y = (mesh.align.flags & LAYOUT.FIXED_HEIGHT) ? mesh.geom.dim[1] : max_size_y > total_size_y ? max_size_y : total_size_y;

   return {
      dim_x: size_x,
      dim_y: size_y,
   }


}
/** */
function Align_pre_simple___with_float_right(mesh, pos_x = 0, pos_y = 0, pad = [10, 10],) {

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
   let row_mesh = 0



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

         var ret;
         // Must calc the mesh's row before call to align FLOAT_RIGHT
         if (cur_mesh.align.flags & LAYOUT.VERTICAL) row_mesh++;
         cur_mesh.align.row = row_mesh;

         if ((cur_mesh.align.flags & LAYOUT.FLOAT_RIGHT) && mesh.align.flags & LAYOUT.FIXED_WIDTH) {

            const pos_x = Find_last_right_aligned_child_from_parent(cur_pos_x, mesh, cur_mesh, cur_pad_x, pad_x);
            ret = cur_mesh.AlignNEW(pos_x, cur_pos_y);
         }
         else
            ret = cur_mesh.AlignNEW(cur_pos_x, cur_pos_y);

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
         
      }

      if (accum_row_max_size_x < accum_row_size_x) accum_row_max_size_x = accum_row_size_x

   }

   // console.log('  total_size_y', total_size_y, 'row_max_size_y', row_max_size_y, mesh.GetName())

   const size_x = (mesh.align.flags & LAYOUT.FIXED_WIDTH) ? mesh.geom.dim[0] : accum_row_max_size_x;
   const size_y = (mesh.align.flags & LAYOUT.FIXED_HEIGHT) ? mesh.geom.dim[1] : max_size_y > total_size_y ? max_size_y : total_size_y;

   return {
      dim_x: size_x,
      dim_y: size_y,
   }


}
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


/**SAVE */
export function Test_alignment_nested_2(x = 50, y = 50) {

   const pos = [x, y, 0];
   const slider_size = 120;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [0, 0], pos: [0, 0, 0], pad: [20, 20], col: TRANSPARENCY(GREY[0], 1.), name: 'MAIN_SECTION' }));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:2, enable_blend_mode:SID.BLEND_OPTIONS.BLEND_MODE_ADD});
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   section.StylesSetPad([10, 10]);
   section.StylesSetMargin([0, 0]);
   section.align.flags = LAYOUT.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   { // Create items
      let grey_cnt = 1;
      let purple_cnt = 1;
      let red_cnt = 1;
      let yellow_cnt = 1;
      let cyan_cnt = 1;

      const tex_id = TEXTURES.MTSDF_CONSOLAS_1024
      const fonst_size = 8;

      const ss = Create_rect_t1(section, GREY[3], `GREY[3]`, LAYOUT.HORIZONTAL, pad);

      /** With Widgets */
      /** */
      {
         const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, BLUEL[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);;
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, GREEN[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
      }
      /** */
      {
         const s2 = Create_rect_t1(ss, PURPLEB[3], `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad)
         {
            const s = Create_rect_t1(s2, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_rect_t1(s2, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad)
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
         }
         {
            const s = Create_rect_t1(s2, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad)
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
         }

      }
      /** */
      {
         const s2 = Create_rect_t1(ss, REDL[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad);
         {
            const s = Create_rect_t1(s2, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
            {
               const s3 = Create_rect_t1(s, PURPLER[3], `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad)
               { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
            }
            {
               const s3 = Create_rect_t1(s, PURPLER[3], `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad)
               { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s3.AddItem(label); }
            }
            {
               const s3 = Create_rect_t1(s, PURPLER[3], `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad)
               { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
            }
            {
               const s3 = Create_rect_t1(s, PURPLER[3], `Y${purple_cnt++}`, LAYOUT.VERTICAL, pad)
               { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
            }
            {
               const s3 = Create_rect_t1(s, PURPLER[3], `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad)
               { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
               { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s3.AddItem(label); }
            }

         }

      }

      /** No Widgets - nested 1 */
      /** */
      {
         {
            const s1 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
         }
         {
            const s1 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
         }
         {
            const s1 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
         }
         {
            const s1 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
         }
         {
            const s1 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
         }
         {
            const s1 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.VERTICAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
            { const s = Create_rect_t1(s1, YELLOWR[3], `Y2${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); }
         }
      }
      /** */
      {
         const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
      }
      /** */
      {
         const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);

         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);;
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               // { const label =Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, REDL[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad);
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
            {
               const s = Create_rect_t1(s1, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad);
               { const label = Widget_ready_label(_, `1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }

      }
      /**  No Widgets - nested 2 */
      /** */
      // {
      //    const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
      //    { const s3 = Create_rect_t1(s2, TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      // }
      /** */
      // {
      //    const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }

      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      // }
      /** UP */
      // {
      //    const pad = [7, 7]
      //    {
      //       const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad)
      //          const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]);
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //       }
      //    }

      //    {
      //       const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad)
      //          const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]);
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
      //       }
      //       {
      //          const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
      //          { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
      //       }
      //    }

      // }
      /** */
      // {
      // const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      // }
      /** */
      // {
      // const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    { const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`); s3.StylesSetPad([10, 10]); s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s2.AddItem(s3) 
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }


      // }
      /** */
      // {
      // const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
      //    {

      //       const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`);
      //       s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      //       s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      //       s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      //       s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      //       s3.StylesSetPad([10, 10]);
      //       s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
      //       s2.AddItem(s3)
      //       { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //       // { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    }
      //    // {

      //    //    const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`);
      //    //    s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      //    //    s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      //    //    s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      //    //    s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      //    //    s3.StylesSetPad([10, 10]);
      //    //    s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
      //    //    s2.AddItem(s3)
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    // }
      //    // {

      //    //    const s3 = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(REDL[6], .4), `R${red_cnt++}`);
      //    //    s3.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      //    //    s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
      //    //    s3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2);
      //    //    s3.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      //    //    s3.StylesSetPad([10, 10]);
      //    //    s3.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL;
      //    //    s2.AddItem(s3)
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    //    { const s = Create_rect_t1(_, _, [0, 0], [0, 0, 1], [20, 20], TRANSPARENCY(YELLOWR[6], .3), `Y${yellow_cnt++}`); s.StylesSetPad([10, 10]); s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL; s.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS); s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 2); s.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD); s3.AddItem(s) }
      //    // }
      // }

   }




   /********************************************************************************************************************************************************/
   // Align
   Align_pre_simple(section);

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
function Test_alignment_slider_vert_hor_with_expand(x, y) {

   const pos = [x, y, 0];
   const slider_size = 60;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, LAYOUT.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[0, 0, 0], dim:[0, 0], col:TRANSPARENCY(GREY[1], .8), name:'Test_alignment'}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   section.StylesSetPad([10, 10]);
   section.align.flags = LAYOUT.RESIZE_SELF;

   const info_text = 'Align sliders, with \'expand\' flag on their (yellow) panel.\nThe expand flag expands a mesh of type section,\nto the widest of the sections of the same level '
   const info_label = Widget_ready_label(_, info_text, _, 0, 0, 14, TRANSPARENT, _, _);
   info_label.StylesSetPad([0, 0]);
   info_label.align.flags = LAYOUT.HORIZONTAL;
   section.AddItem(info_label);

   let yellow_cnt = 1;
   /********************************************************************************************************************************************************/
   { // Create items
      const ss = Create_rect_t1(section, GREY[3], `GREY[3]`, LAYOUT.VERTICAL, pad);
      {
         const s = Create_rect_t1(ss, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL | LAYOUT.EXPAND, pad);
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL);  s.AddItem(slider); }

      }
      {
         const s = Create_rect_t1(ss, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL | LAYOUT.EXPAND, pad)
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL);  s.AddItem(slider); }
         // { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL);  s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.VERTICAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.VERTICAL); s.AddItem(slider); }

      }
      {
         const s = Create_rect_t1(ss, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL | LAYOUT.EXPAND, pad)
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.HORIZONTAL); s.AddItem(slider); }
         { const slider = Widget_ready_slider(_, 0, 0, .5, 'slider', slider_size); slider.StylesSetPad([0, 0]); slider.AlignAddFlags(LAYOUT.VERTICAL); s.AddItem(slider); }

      }
   }




   /********************************************************************************************************************************************************/
   // Align
   Align_pre_simple(section);
   Align_expand(section, section.align.flags,)

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
 * ISSUE:
 * For the FLOAT_RIGHT meshes, on the same row, have to be the last children of the parent,
 * because the Align function stores the current x position and advances
 */
function Test_align_float_right(x = 0, y = 0) {

   const pos = [x, y, 0];
   const slider_size = 60;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   const section = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[10, 10], pos:[0, 0, 0], dim:[0, 0], col:TRANSPARENCY(GREY[1], .8), name:'Test_alignment'}));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:10,});
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   section.StylesSetPad([10, 10]);
   section.align.flags = LAYOUT.RESIZE_SELF;

   const info_text = `Use of 'FLOAT_RIGHT' flag on widgets.
Align widgets to the right side of their panel section,
with right to left order`;
   const info_label = Widget_ready_label(_, info_text, _, 0, 0, 14, TRANSPARENT, _, _);
   info_label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL;
   section.AddItem(info_label);

   const todo_text = `# Fix the float right on an expanded section`;
   const todo_label = Widget_ready_label(_, todo_text, _, 0, 0, 14, TRANSPARENT, _, _, _, REDL[9]);
   todo_label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL;
   section.AddItem(todo_label);




   let yellow_cnt = 1;
   /********************************************************************************************************************************************************/
   { // Create items
      const ss = Create_rect_t1(section, GREY[3], `GREY[3]`, LAYOUT.VERTICAL, pad);
      {
         const s = Create_rect_t1(ss, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL | LAYOUT.FIXED_WIDTH, pad, _, [120, 20]);
         { const label = Widget_ready_label(_, `A1`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }

         { const label = Widget_ready_label(_, `B1`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `B2`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([10, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `B3`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([20, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `B4`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }

         { const label = Widget_ready_label(_, `C1`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `C1`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `C1`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `C2`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `C3`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
         { const label = Widget_ready_label(_, `C4`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      }
      // {
      //    const s = Create_rect_t1(ss, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL | LAYOUT.FIXED_WIDTH, pad, _, [120, 20]);
      //    { const label = Widget_ready_label(_, `A1`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `A2`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }

      //    { const label = Widget_ready_label(_, `B1`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `B2`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `B3`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `B4`, _, 0, 0, 14, TRANSPARENCY(REDL[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }

      //    { const label = Widget_ready_label(_, `C1`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `C2`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `C3`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `C4`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      // }
      // {
      //    const s = Create_rect_t1(ss, YELLOWR[3], `Y${yellow_cnt++}`, LAYOUT.VERTICAL | LAYOUT.FIXED_WIDTH | LAYOUT.EXPAND, pad, _, [120, 20]);
      //    { const label = Widget_ready_label(_, `A1`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `A2`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `A3`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `A4`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `A5`, _, 0, 0, 14, TRANSPARENCY(ORANGE[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }

      //    { const label = Widget_ready_label(_, `C1`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `C2`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `C3`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `C4`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
      //    { const label = Widget_ready_label(_, `C5`, _, 0, 0, 14, TRANSPARENCY(GREEN[6], 1), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.HORIZONTAL; s.AddItem(label); }
      // }

   }




   /********************************************************************************************************************************************************/
   // Align
   // Align_pre_simple(section);
   Align_pre_simple___with_float_right(section);

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
function Create_triangle_structure(x = 50, y = 50) {

   const pos = [x, y, 0];
   const slider_size = 120;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [0, 0], pos: [0, 0, 0], pad: [20, 20], col: TRANSPARENCY(GREY[0], 1.), name: 'MAIN_SECTION' }));
   Widget_gfx_ready_enable({mesh:section, enable_sdf_rect:2, enable_blend_mode:SID.BLEND_OPTIONS.BLEND_MODE_ADD});
   section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

   section.StylesSetPad([10, 10]);
   section.StylesSetMargin([0, 0]);
   section.align.flags = LAYOUT.RESIZE_SELF;


   /********************************************************************************************************************************************************/
   let grey_cnt = 1;
   let purple_cnt = 1;
   let red_cnt = 1;
   let yellow_cnt = 1;
   let cyan_cnt = 1;

   const tex_id = TEXTURES.MTSDF_CONSOLAS_1024
   const fonst_size = 8;

   const ss = Create_rect_t1(section, GREY[3], `GREY[3]`, LAYOUT.HORIZONTAL, pad);
   {
      const pad = [7, 7]
      {
         const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad)
            const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]);
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
         }
      }

      {
         const s2 = Create_rect_t1(ss, GREY[2], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.VERTICAL, pad)
            const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]);
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.VERTICAL, pad, [0, 0]); }
         }
         {
            const s3 = Create_rect_t1(s2, GREY[3], `Y${red_cnt++}`, LAYOUT.HORIZONTAL, pad)
            { const tri1 = Create_triangle_height_3(s3, GREY[2], `P${red_cnt++}`, LAYOUT.HORIZONTAL, pad, [0, 0]); }
         }
      }

   }


   



   /********************************************************************************************************************************************************/
   // Align
   Align_pre_simple(section);

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












/********************************************************************************** */
// Contol padding with sliders test

function Test_slider_control_pad(x, y) {

   const pos = [x, y, 0];
   const slider_size = 100;
   const pad = [10, 10];

   /********************************************************************************************************************************************************/
   // Create
   // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, LAYOUT.VERTICAL, [15, 10], pos, [100, 100], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[1], .8), 'Test_alignment');
   section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   // section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   section.StylesSetPad([10, 10]);
   section.align.flags = LAYOUT.RESIZE_SELF;

   const info_text = `# ADD TITLE HERE #`;
   const info_label = Widget_ready_label(_, info_text, _, 0, 0, 14, TRANSPARENT, _, _, _,);
   info_label.align.flags = LAYOUT.FLOAT_RIGHT | LAYOUT.VERTICAL;
   section.AddItem(info_label);


   let grey_cnt = 1;
   let purple_cnt = 1;
   let yellow_cnt = 1;
   let cyan_cnt = 1;
   /********************************************************************************************************************************************************/
   // Create slider
   const s0 = Create_rect_t1(section, GREY[1], `GREY[1]`, LAYOUT.VERTICAL, pad);
   const s = Create_rect_t1(s0, GREY[5], `G5`, LAYOUT.HORIZONTAL | LAYOUT.EXPAND, pad, false);


   const ss1 = Create_rect_t1(s, YELLOWR[3], `Y3`, LAYOUT.HORIZONTAL | LAYOUT.EXPAND, pad, false);
   { const label = Widget_ready_label(_, 'Change Yellow meshes padding', _, 0, 0, 14, TRANSPARENT, _, _, [20, 16]); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; ss1.AddItem(label); }
   const slider_1 = Widget_ready_slider(_, 0, 0, .0, 'Yellow', slider_size); slider_1.StylesSetPad([0, 0]); slider_1.AlignAddFlags(LAYOUT.VERTICAL); ss1.AddItem(slider_1);
   const slider_1_lr = Widget_ready_slider(_, 0, 0, .0, 'Left-right', slider_size); slider_1_lr.StylesSetPad([0, 0]); slider_1_lr.AlignAddFlags(LAYOUT.HORIZONTAL); ss1.AddItem(slider_1_lr);
   const slider_1_tb = Widget_ready_slider(_, 0, 0, .0, 'Top-bottom', slider_size); slider_1_tb.StylesSetPad([0, 0]); slider_1_tb.AlignAddFlags(LAYOUT.HORIZONTAL); ss1.AddItem(slider_1_tb);

   const ss2 = Create_rect_t1(s, PURPLEB[3], `P3`, LAYOUT.VERTICAL | LAYOUT.EXPAND, pad, false);
   { const label = Widget_ready_label(_, 'Change Purple meshes padding', _, 0, 0, 14, TRANSPARENT, _, _, [20, 16]); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; ss2.AddItem(label); }
   const slider_2 = Widget_ready_slider(_, 0, 0, .0, 'Purple', slider_size); slider_2.StylesSetPad([0, 0]); slider_2.AlignAddFlags(LAYOUT.VERTICAL); ss2.AddItem(slider_2);
   const slider_2_lr = Widget_ready_slider(_, 0, 0, .0, 'Left-right', slider_size); slider_2_lr.StylesSetPad([0, 0]); slider_2_lr.AlignAddFlags(LAYOUT.HORIZONTAL); ss2.AddItem(slider_2_lr);
   const slider_2_tb = Widget_ready_slider(_, 0, 0, .0, 'Top-bottom', slider_size); slider_2_tb.StylesSetPad([0, 0]); slider_2_tb.AlignAddFlags(LAYOUT.HORIZONTAL); ss2.AddItem(slider_2_tb);

   const ss3 = Create_rect_t1(s, GREY[1], `G1`, LAYOUT.VERTICAL | LAYOUT.EXPAND, pad, false);
   { const label = Widget_ready_label(_, 'Change Grey meshes padding', _, 0, 0, 14, TRANSPARENT, _, _, [20, 16]); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.VERTICAL; ss3.AddItem(label); }
   const slider_3 = Widget_ready_slider(_, 0, 0, .0, 'Grey', slider_size); slider_3.StylesSetPad([0, 0]); slider_3.AlignAddFlags(LAYOUT.VERTICAL); ss3.AddItem(slider_3);
   const slider_3_lr = Widget_ready_slider(_, 0, 0, .0, 'Left-right', slider_size); slider_3_lr.StylesSetPad([0, 0]); slider_3_lr.AlignAddFlags(LAYOUT.HORIZONTAL); ss3.AddItem(slider_3_lr);
   const slider_3_tb = Widget_ready_slider(_, 0, 0, .0, 'Top-bottom', slider_size); slider_3_tb.StylesSetPad([0, 0]); slider_3_tb.AlignAddFlags(LAYOUT.HORIZONTAL); ss3.AddItem(slider_3_tb);


   /********************************************************************************************************************************************************/
   // Align
   const ret = Align_pre_simple(section);
   const pad_x = section.StylesGetPad(STYLES.AXIS.X);
   const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
   section.geom.dim[0] = ret.dim_x + pad_x;
   section.geom.dim[1] = ret.dim_y + pad_y;
   Align_expand(section, section.align.flags,)

   // Calculate from pos=[0,0], and then add the user's pos
   section.geom.pos[0] = pos[0];
   section.geom.pos[1] = pos[1];






   /********************************************************************************************************************************************************/
   // Create items

   const ss = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[2], .8), 'Test_alignment');
   ss.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.ATTR.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   ss.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   ss.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   ss.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   ss.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

   ss.StylesSetPad([10, 10]);
   ss.align.flags = LAYOUT.RESIZE_SELF;

   const group1_meshes = [];
   const group2_meshes = [];
   const group3_meshes = [];

   { /** With Widgets */
      {
         const s2 = Create_rect_t1(ss, GREY[1], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
         group3_meshes.push(s2);
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               {
                  const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s);
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.VERTICAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
               }
               {
                  const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s);
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
               }
               {
                  const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s);
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.VERTICAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
               }
               {
                  const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s);
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.VERTICAL, pad); /*group1_meshes.push(s_);*/ }
               }
               {
                  const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s);
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.VERTICAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.VERTICAL, pad); /*group1_meshes.push(s_);*/ }
               }
               {
                  const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s);
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.VERTICAL, pad); /*group1_meshes.push(s_);*/ }
                  { const s_ = Create_rect_t1(s, TRANSPARENCY(CYAN[3], .9), `Y${cyan_cnt++}`, LAYOUT.HORIZONTAL, pad); /*group1_meshes.push(s_);*/ }
               }
            }

         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               // { const label = Widget_ready_label(_, `1`, _, 0, 0, 14, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags = LAYOUT.HORIZONTAL; s.AddItem(label); }
            }
         }
      }
      {
         const s2 = Create_rect_t1(ss, GREY[1], `G2${grey_cnt++}`, LAYOUT.HORIZONTAL, pad);
         group3_meshes.push(s2);
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
            }

         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
            }
         }
      }
      {
         const s2 = Create_rect_t1(ss, GREY[1], `G2${grey_cnt++}`, LAYOUT.VERTICAL, pad);
         group3_meshes.push(s2);
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
            }

         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
            }

         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.VERTICAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
            }

         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
            }
         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.VERTICAL, pad); group1_meshes.push(s); }
            }

         }
         {
            const s1 = Create_rect_t1(s2, TRANSPARENCY(PURPLEB[3], .5), `Y${purple_cnt++}`, LAYOUT.HORIZONTAL, pad);
            group2_meshes.push(s1);
            {
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
               { const s = Create_rect_t1(s1, TRANSPARENCY(YELLOWR[3], .9), `Y${yellow_cnt++}`, LAYOUT.HORIZONTAL, pad); group1_meshes.push(s); }
            }
         }
      }

      const ret = Align_pre_simple(ss);
      const pad_x = ss.StylesGetPad(STYLES.AXIS.X);
      const pad_y = ss.StylesGetPad(STYLES.AXIS.Y);
      ss.geom.dim[0] = ret.dim_x + pad_x;
      ss.geom.dim[1] = ret.dim_y + pad_y;
      // Align_expand(ss, ss.align.flags,)



      ss.geom.pos[0] = x;
      ss.geom.pos[1] = section.geom.pos[1] + section.geom.dim[1] * 2 + 20;


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
   // Render
   section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);


   section.Render();
   Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
   Construct_listen_events_from_mesh_tree(section)
   Construct_listen_events_relations_from_mesh_tree(section);
   section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);




   /********************************************************************************************************************************************************/
   // Connect sliders to gfx program uniforms 

   /** Inner nested sections */
   const params1 = {
      target_meshes: group1_meshes,
      root_mesh: ss,
   };
   // Change left-right-top-bottom pad
   Slider_connect(slider_1, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPad([val, val]);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);

      const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
      root_mesh.geom.dim[0] = ret.dim_x + pad_x;
      root_mesh.geom.dim[1] = ret.dim_y + pad_y;

   }, params1,
   );
   // Change left-right pad
   Slider_connect(slider_1_lr, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPadX(val);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);

      const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
      root_mesh.geom.dim[0] = ret.dim_x + pad_x;
      root_mesh.geom.dim[1] = ret.dim_y + pad_y;

   }, params1,
   );
   // Change top-bottom pad
   Slider_connect(slider_1_tb, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPadY(val);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);

      const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
      root_mesh.geom.dim[0] = ret.dim_x + pad_x;
      root_mesh.geom.dim[1] = ret.dim_y + pad_y;

   }, params1,
   );

   /** Middle nested sections */
   const params2 = {
      target_meshes: group2_meshes,
      root_mesh: ss,
   };
   // Change left-right-top-bottom pad
   Slider_connect(slider_2, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPad([val, val]);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);


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
   // Change left-right pad
   Slider_connect(slider_2_lr, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPadX(val);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);


      const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
      root_mesh.geom.dim[0] = ret.dim_x + pad_x;
      root_mesh.geom.dim[1] = ret.dim_y + pad_y;

   }, params2,
   );
   // Change top-bottom pad
   Slider_connect(slider_2_tb, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPadY(val);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);


      const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
      root_mesh.geom.dim[0] = ret.dim_x + pad_x;
      root_mesh.geom.dim[1] = ret.dim_y + pad_y;

   }, params2,
   );

   /** Outer nested sections */
   const params3 = {
      target_meshes: group3_meshes,
      root_mesh: ss,
   };
   // Change left-right-top-bottom pad
   Slider_connect(slider_3, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPad([val, val]);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);


      const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
      root_mesh.geom.dim[0] = ret.dim_x + pad_x;
      root_mesh.geom.dim[1] = ret.dim_y + pad_y;

   }, params3,
   );
   // Change left-right-top-bottom pad
   Slider_connect(slider_3_lr, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPadX(val);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);


      const pad_x = root_mesh.StylesGetPad(STYLES.AXIS.X);
      const pad_y = root_mesh.StylesGetPad(STYLES.AXIS.Y);
      root_mesh.geom.dim[0] = ret.dim_x + pad_x;
      root_mesh.geom.dim[1] = ret.dim_y + pad_y;

   }, params3,
   );
   // Change left-right-top-bottom pad
   Slider_connect(slider_3_tb, (params, slider_val) => {

      const root_mesh = params.clbk_params.root_mesh;
      const target_meshes = params.clbk_params.target_meshes;
      const val = slider_val * 20 + 10

      const len = target_meshes.length;
      for (let i = 0; i < len; i++) {

         const mesh = target_meshes[i];
         mesh.StylesSetPadY(val);
      }
      const ret = Align_pre_simple(root_mesh, _, _,);


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
function Create_rect_t1(parent, color, name, align=0x0, pad = [10, 10], enable_hover = true, dim = [0, 0]) {

   const s = Create_rect_mesh(Style_rect_default_properties({ pad: pad, pos: [0, 0, 1], col: color, name: name, dim: dim, layout:LAYOUT.RESIZE_SELF|align}));
   Widget_gfx_ready_enable({mesh:s, enable_sdf_rect:2, enable_blend_mode:SID.BLEND_OPTIONS.BLEND_MODE_ADD})
   if (enable_hover) s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
   parent.AddItem(s);

   return s;
}

/** */
function Create_2_rect(parent, color, name, align, pad, color2, name2, align2, pad2 = [10, 10]) {

   const s = Create_rect_t1(parent, color, name, align, pad)
   {
      Create_rect_t1(s, color2, name, LAYOUT.HORIZONTAL, pad2)
      Create_rect_t1(s, color2, name, align2, pad2)
   }

   return s;
}

/** */
function Create_triangle_height_3(parent, color, name, align, pad, dim, color2, name2, align2, pad2 = [10, 10]) {

   let cnt1 = 1;
   let cnt2 = 1;
   let cnt3 = 1;
   const s = Create_rect_t1(parent, color, name, align, pad, dim)
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad, dim);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      // Create_2_sections(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad, CYAN[6], `C${cnt3++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.VERTICAL, pad, dim);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }
   {
      const s3 = Create_rect_t1(s, GREY[5], `Y${cnt1++}`, LAYOUT.HORIZONTAL, pad);
      Create_rect_t1(s3, GREY[9], `Y${cnt2++}`, LAYOUT.VERTICAL, pad)
   }

   return s;
}
/********************************************************************************** */
// SAVES
