"use strict"

import { Create_widget_label, Create_widget_slider } from "../../Engine/Core/CreateWidget.js"
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { BLUEL, GREY, WHITE } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Slider_connect } from "../../Engine/Drawables/Widgets/WidgetSlider.js";
import { Font_metrics_get_row_height } from "../../Engine/Loaders/Font/Font.js";
import { VBI_get_byidx, Vertex_buffer_get_by_vbidx, Vertex_buffer_state_enable } from "../../Graphics/Buffers/VertexBuffers.js";
import { Linear_interpolation } from "../../Helpers/Math/MathFunctions.js";


const R=0;
const G=1;
const B=2;
const A=3;
const wx=4;
const wy=5;
const wz=6;
const vx=7;
const vy=8;
const dx=9;
const dy=10;
const rcorners=11;
const feather=12;

/**
 * Rectangle Vertices Structure
 
      * v1     * v3
      
       
      * v2     * v4 
 */

let counter = 0;

export function Demo_text_number_animation() {

   // Create the label to animate the text's vertex position
   const l1 = Create_widget_label(ROOT_WIDGETS.CREATE_ROOT, '3', _, [100, 60, 0], _, BLUEL[9], WHITE, [10, 6], _, _, TEXTURES.CONSOLAS_32px);
   l1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   l1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   l1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   l1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

   l1.GenGfxCtx();
   l1.Render()
   l1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, l1.gfx.vb.groupidx)
   Construct_listen_events_from_mesh_tree(l1)
   Construct_listen_events_relations_from_mesh_tree(l1);
   Root_group_activate_all_vbs_in_renderqueue(l1.root_bufferidx);

   // Create the slider for controling the vertex position of the label's text
   const pos = [30, 300, 0]
   const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, pos, [250, 10], _, _, 'slider');
   slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
   slider.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
   slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
   slider.SetInitialValue(.5);



   slider.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
   slider.Render();
   Root_group_activate_all_vbs_in_renderqueue(slider.root_bufferidx);
   slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)

   Construct_listen_events_from_mesh_tree(slider)
   Construct_listen_events_relations_from_mesh_tree(slider);


   // Create animations, via the slider

   const params = {
      label: l1,
      text: l1.text_mesh,
   };

   TEST_all(slider, params);
   // TEST_animation_down_and_reset(slider, params);
   // TEST_LEFT_HERE(slider, params);
}


function TEST_all(slider, params){

   // Connect sliders to gfx program uniforms 
   Slider_connect(slider, (params, slider_val) => {

      const label = params.clbk_params.label;
      const target = params.clbk_params.text;

      // const default_val = 
      const val = Linear_interpolation(-1, 1, slider_val);
      const limit = Font_metrics_get_row_height(target.mat.fontidx) / 2;
      // console.log(val)

      // Scale_x(target, val)

      // move_y(target, val)
      // twist_y(target, val)

      // move_y_top_and_bottom_vertices(target, val, limit)
      // move_y_bottom_vertices_up(target, val, -limit)
      // move_y_upper_vertices_down(target, val, limit);
      
      // testing(target, val, -100, 100)
      
      // squeeze_y_to_bottom_vertices_move_to_bottom(target, val)
      squeeze_y_to_top_vertices_move_to_top(target, val, limit)

   }, params,
   );
}

function TEST_animation_down_and_reset(slider, params){

   // Connect sliders to gfx program uniforms 
   Slider_connect(slider, (params, slider_val) => {

      const label = params.clbk_params.label;
      const target = params.clbk_params.text;

      const val = Linear_interpolation(-1, 1, slider_val);
      const limit = 15;

      // Squeeze text down to a limit
      const a = squeeze_y_to_bottom_vertices_move_to_bottom(target, val, limit)

      // and then reset position and vertex position and render the new text
      if(a===false) {

         vertex_y_set_default(target);
         pos_y_set_default(target);

         target.RenderTextFromNumber(counter++);

         STATE.loop.paused = true
         setTimeout(()=>{STATE.loop.paused = false}, 300)
      }

   }, params,
   );
}

// function TEST_LEFT_HERE(slider, params){

//    // Connect sliders to gfx program uniforms 
//    Slider_connect(slider, (params, slider_val) => {

//       const label = params.clbk_params.label;
//       const target = params.clbk_params.text;

//       // const default_val = 
//       const val = Linear_interpolation(-1, 1, slider_val);
//       const limit = 15;
//       // console.log(val)

//       // Scale_x(target, val)

//       // move_y(target, val)
//       // twist_y(target, val)

//       // move_y_top_and_bottom_vertices(target, val, limit)
//       // const a = move_y_bottom_vertices_up(target, val, -limit)
//       // const a = move_y_upper_vertices_down(target, val, limit);
//       const a = squeeze_y_to_bottom_vertices_move_to_bottom(target, val, limit)
//       if(a===false) {

//          vertex_y_set_default(target);
//          pos_y_set_default(target);

//          target.RenderTextFromNumber(counter++);

//          STATE.loop.paused = true
//          setTimeout(()=>{STATE.loop.paused = false}, 300)
//       }
      
      
//       // testing(target, val, -100, 100)
      
//       // squeeze_y_to_bottom_vertices_move_to_bottom(target, val)

//    }, params,
//    );
// }


function testing(target, val, min=0, max=10) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = wy+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;
   vb_data[index] += val; index+=stride;

   // const val = Linear_interpolation(min, max, slider_val);
   // const data_v1 = vb_data[index];
   // vb_data[index] += (-data_v1) + val; index+=stride;
   // const data_v2 = vb_data[index];
   // vb_data[index] +=  (-data_v2) + val; index+=stride;
   // const data_v3 = vb_data[index];
   // vb_data[index] +=  (-data_v3) + val; index+=stride;
   // const data_v4 = vb_data[index];
   // vb_data[index] +=  (-data_v4) + val; index+=stride;


   // index = vy;
   // vb_data[index] = val; 
   // index+=stride;
   // vb_data[index] = val; 
   // index+=stride;
   // vb_data[index] = val; 
   // index+=stride;
   // vb_data[index] = val; 
   // index+=stride;
   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}



function Scale_x(target, slider_val, min=0, max=10) {

   
   const vbidx = target.gfx.vb.which_vb.wpos_buf;
   const vb_info = VBI_get_byidx(target.gfx.vb.idxs.buffer[vbidx]);
   const vb_data = Vertex_buffer_get_by_vbidx(target.gfx.vb.idxs.buffer[vbidx]);
   
   let index = vx+target.gfx.vb.starts.buffer[0];
   let stride = vb_info.attribs_info.count;
   
   const val = Linear_interpolation(min, max, slider_val);
   vb_data[index] = val; 
   index+=stride;
   vb_data[index] = val; 
   index+=stride;
   vb_data[index] = -val; 
   index+=stride;
   vb_data[index] = -val; 
   index+=stride;
   Vertex_buffer_state_enable(target.gfx.vb.groupidx, target.gfx.vb.idxs.buffer[vbidx], BUFFER_STATE.NEEDS_UPDATE);
}

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

   if(vb_data[index] > limit) 
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