"use strict"

import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Font_metrics_get_row_height } from "../../Engine/Loaders/Font/Font.js";
import { VBI_get_byidx, Vertex_buffer_get_by_vbidx, Vertex_buffer_state_enable } from "../../Graphics/Buffers/VertexBuffers.js";
import { Linear_interpolation } from "../../Helpers/Math/MathFunctions.js";


// const R=0;
// const G=1;
// const B=2;
// const A=3;
const wx=4;
const wy=5;
// const wz=6;
const vx=7;
const vy=8;
// const dx=9;
// const dy=10;
// const rcorners=11;
// const feather=12;

/**
 * Rectangle Vertices Structure
 
      * v1     * v3
      
       
      * v2     * v4 
 */



export function vertex_y_set_default(target) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   const dim = target.geom.dim[1];

   vb_data[index] = -dim; index+=stride;
   vb_data[index] =  dim; index+=stride;
   vb_data[index] = -dim; index+=stride;
   vb_data[index] =  dim; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function vertex_y_set(target, dim) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   vb_data[index] = dim; index+=stride;
   vb_data[index] =  dim; index+=stride;
   vb_data[index] = dim; index+=stride;
   vb_data[index] =  dim; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function pos_y_set_default(target) {

   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   const pos = target.geom.pos[1]+target.geom.dim[1];

   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function pos_y_set(target, pos) {
   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}

export function move_y(target, val, limit) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;

   if(vb_data[index] > limit) return false;
   
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function twist_y(target, val) {

   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   index = wy;
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;
   vb_data[index] += -val; index+=stride;
   vb_data[index] += -val; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}

function move_y_top_and_bottom_vertices(target, val, limit) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   if(vb_data[index] > limit) return false;
   
   vb_data[index] += val; 
   index+=stride;
   vb_data[index] += -val; index+=stride;
   vb_data[index] += val; 
   index+=stride;
   vb_data[index] += -val; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);

   return true;
}
export function move_y_upper_vertices_down(target, val, limit) {
   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;

   if(vb_data[index] > limit) return false;
   
   vb_data[index] += val; 
   index+=stride;
   // vb_data[index] += val; 
   index+=stride;
   vb_data[index] += val; 
   index+=stride;
   // vb_data[index] += -val; 
   index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);

   return true;

}
export function move_y_bottom_vertices_up(target, val, limit) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   // vb_data[index] += val; 
   index+=stride;
   if(vb_data[index] > limit) return false;
   vb_data[index] += val; 
   index+=stride;
   // vb_data[index] += val; 
   index+=stride;
   vb_data[index] += val; 
   index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);

   return true;
}


/**
 * Scale text upper vertices down, with anchor the lower vertices 
 */
export function squeeze_y_to_bottom_vertices_move_to_bottom(target, val, limit) {

   const has_reached_limit = move_y_upper_vertices_down(target, val, limit)
   move_y(target, val*.5); // Move accordingly so that lower vertices are not moving
   return has_reached_limit;
}
export function squeeze_y_to_top_vertices_move_to_top(target, val, limit) {
   
   const has_reached_limit = move_y_bottom_vertices_up(target, val, limit)
   move_y(target, val*.5)
   return has_reached_limit;
}














/****************************************************************************************************************/
// X axis
/****************************************************************************************************************/
export function text_animation_gfx_vertex_set_vpos_x_by_value(target, dim) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   // const dim = target.geom.dim[0];

   vb_data[index] = -dim; index+=stride;
   vb_data[index] = -dim; index+=stride;
   vb_data[index] =  dim; index+=stride;
   vb_data[index] =  dim; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function text_animation_gfx_vertex_set_vpos_x_default(target) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   const dim = target.geom.dim[0];

   vb_data[index] = -dim; index+=stride;
   vb_data[index] = -dim; index+=stride;
   vb_data[index] =  dim; index+=stride;
   vb_data[index] =  dim; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function text_animation_gfx_vertex_set_sqeeze_x_axis(target, dim) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   vb_data[index] = dim; index+=stride;
   vb_data[index] = dim; index+=stride;
   vb_data[index] = dim; index+=stride;
   vb_data[index] = dim; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function pos_x_set_default(target) {

   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   const pos = target.geom.pos[0]+target.geom.dim[0];

   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}
export function pos_x_set(target, pos) {
   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;
   vb_data[index] = pos; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}



export function move_x(target, val, limit) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;

   if(vb_data[index]+val > limit) return false;
   
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}

export function move_x_left_vertices_right(target, val, limit) {
   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;

   if(vb_data[index] > limit) // If vertex pos reached limit, return
      return false;
   
   vb_data[index] += val; 
   index+=stride;
   vb_data[index] += val; 
   index+=stride;
   // vb_data[index] += val; 
   index+=stride;
   // vb_data[index] += -val; 
   index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);

   return true;

}
export function move_x_right_vertices_right(target, val, limit) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   // if(vb_data[index] > limit) return false;
   // vb_data[index] += val; 
   index+=stride;
   // vb_data[index] += val; 
   index+=stride;
   if(vb_data[index] > limit) 
      return false;
   vb_data[index] += val; 
   index+=stride;
   vb_data[index] += val; 
   index+=stride;

   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);

   return true;
}