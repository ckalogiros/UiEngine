"use starict";

import { Free_generic_buffer, New_generic_buffer } from "../../Engine/Core/Buffers.js";
import { Vertex_buffer_group_get_attributes_per_face } from "./VertexBuffers.js";



/**
 * Render group 
 * 
 * A render group defines a set of render targets of the same vertex buffer that render a particular part of that vertex buffer.
 * 
 * This buffer is just a storage.
 * The handling is taking place on the Vertex buffer info data structure in VertexBuffers.js file.
 */









/** */
const _render_groups = New_generic_buffer(_, 'GFX Vertex Buffer Render Groups');


/******************************************************************************************************************************/
// Reset-Destroy
/** */
export function Vertex_buffer_render_group_reset_g_buffer() {

   _render_groups.ResetFull();
}



/** */
export function Vertex_buffer_render_group_remove(render_groupidx) {
   _render_groups.RemoveByIdx(render_groupidx);
}
/** */
export function Vertex_buffer_render_group_create(vb_data_idx=INT_NULL, num_faces=INT_NULL) {

   const render_groupidx = _render_groups.Add(
      {
         start:0, 
         count:0, 
         size:0, 
         num_faces:num_faces, 

         draw_count:0, 
         num_instances:0,
         // draw_hint:gfxCtx.gl.STATIC_DRAW,
         draw_hint:gfxCtx.gl.DYNAMIC_DRAW,
         index_offset:0,
         state:0x0,

         vb_data_idx:vb_data_idx,
      }
   );

   return render_groupidx;
}



// GETTERS
/** */
export function Vertex_buffer_render_group_get_all() { 
   return _render_groups.buffer;
}
/** */
export function Vertex_buffer_render_group_get_render_group(render_groupidx) { 
   return _render_groups.buffer[render_groupidx];
}
/** Get size to calculate the next rendergroup start attribute */
export function Vertex_buffer_render_group_get_size(render_groupidx) { 
   return _render_groups.buffer[render_groupidx].size;
}
/** Count is only for the used attributes of the rendergroup */
export function Vertex_buffer_render_group_get_count(render_groupidx) { 
   return _render_groups.buffer[render_groupidx].count;
}
/** */
export function Vertex_buffer_render_group_get_num_faces(render_groupidx) { 
   return _render_groups.buffer[render_groupidx].num_faces;
}

// SETTERS
/** */
export function Vertex_buffer_render_group_set_num_faces(render_groupidx, num_faces) { 
   _render_groups.buffer[render_groupidx].num_faces = num_faces;
}
/** */
export function Vertex_buffer_render_group_set_start(render_groupidx, start) { 
   _render_groups.buffer[render_groupidx].start = start;
}
/** */
export function Vertex_buffer_render_group_reset_draw_count(render_groupidx) { 
   _render_groups.buffer[render_groupidx].draw_count = 0;
   _render_groups.buffer[render_groupidx].count = 0;
}
export function Vertex_buffer_render_group_reset(render_groupidx) { 
   _render_groups.buffer[render_groupidx].start = 0;
   _render_groups.buffer[render_groupidx].count = 0;
   _render_groups.buffer[render_groupidx].num_faces = 0;
   _render_groups.buffer[render_groupidx].draw_count = 0;
   _render_groups.buffer[render_groupidx].num_instances = 1;
   _render_groups.buffer[render_groupidx].draw_hint = 0;
   _render_groups.buffer[render_groupidx].index_offset = 0;
   _render_groups.buffer[render_groupidx].state = 0x0;
}
/** */
export function Vertex_buffer_render_group_set_draw_count_from_num_faces(render_groupidx, num_faces) { 
   // _render_groups.buffer[render_groupidx].draw_count = num_faces * INDICES_PER_RECT;
}
/** */
export function Vertex_buffer_render_group_add_instance(render_groupidx) { 
   _render_groups.buffer[render_groupidx].num_instances++;
}
/** */
export function Vertex_buffer_render_group_remove_instance(render_groupidx) { 
   _render_groups.buffer[render_groupidx].num_instances--;
}
/** */
// export function Vertex_buffer_render_group_set_draw_instance_count_from_num_faces(render_groupidx, num_faces) { 
//    _render_groups.buffer[render_groupidx].num_instances = num_faces;
// }
/** */
export function Vertex_buffer_render_group_set_count_from_num_faces(render_groupidx, num_faces) { 
   const vb_data_idx = _render_groups.buffer[render_groupidx].vb_data_idx;
   const attributes_per_face = Vertex_buffer_group_get_attributes_per_face(vb_data_idx); // WRONG INDEX: Should be vb_groupidx instead of vb_info_idx/vb_data_idx
   _render_groups.buffer[render_groupidx].count = num_faces * attributes_per_face;
}
/** */
export function Vertex_buffer_render_group_set_state(render_groupidx, STATE_FLAG) {
   _render_groups.buffer[render_groupidx].state |= STATE_FLAG;
}

















/** DEBUG */
export function Vertex_buffer_render_group_print_loop() {

   console.log( '----- Vertex Buffer Render Groups -----');
   for(let i=0; i <= _render_groups.boundary; i++) {
      
      const g = _render_groups.buffer[i];
      
      console.log( 
         'vbidx', g.vb_data_idx,
         'rgidx', i,
         'start:', g.start,
         'count:', g.count,
         'size:', g.size,
         'draw_count:', g.draw_count,
         'num_instances:', g.num_instances,
         'index_offset:', g.index_offset,
         'num_faces:', g.num_faces,
         // 'attribs_per_face:', g.attribs_per_face,
      );
   }
   console.log(_render_groups);
}
export function Vertex_buffer_render_group_print_render_group(render_groupidx) {
   
   const g = _render_groups.buffer[render_groupidx];
   console.log(
      '----- Vertex Buffer Render Group -----\n',
      'vbidx', g.vb_data_idx,
      'rgidx', render_groupidx,
      'start:', g.start,
      'count:', g.count,
      'size:', g.size,
      'draw_count:', g.draw_count,
      'num_instances:', g.num_instances,
      'index_offset:', g.index_offset,
      'num_faces:', g.num_faces,
      // 'attribs_per_face:', g.attribs_per_face,
   );
}