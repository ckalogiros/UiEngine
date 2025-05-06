"use starict";

import { New_generic_buffer } from "../../Engine/Core/Buffers.js";



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




/** */
// export function Vertex_buffer_render_group_create(start=0, count=0, size=0, draw_count=0, index_offset= 0,debug_vbidx=-1,) {
export function Vertex_buffer_render_group_create(num_faces=INT_NULL) {

   const render_groupidx = _render_groups.Add(
      {
         start:0, 
         count:0, 
         size:0, 
         num_faces:num_faces, 
         draw_count:0, 
         index_offset:0,
         
         debug_vbidx:INT_NULL,
         debug_is_reseted:true,

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
/** */
export function Vertex_buffer_render_group_get_size(render_groupidx) { 
   return _render_groups.buffer[render_groupidx].size;
}

// SETTERS

/** */
export function Vertex_buffer_render_group_set_num_faces(render_groupidx, num_faces) { 
   _render_groups.buffer[render_groupidx].num_faces = num_faces;
}
/** */
export function Vertex_buffer_render_group_set_debug_is_reseted(render_groupidx, debug_is_reseted) { 
   _render_groups.buffer[render_groupidx].debug_is_reseted = debug_is_reseted;
}
/** */
// export function Vertex_buffer_render_group_set_start(render_groupidx, start) { 
//    _render_groups.buffer[render_groupidx].start = start;
// }
/** */
// export function Vertex_buffer_render_group_set_draw_count(render_groupidx, draw_count) { 
//    _render_groups.buffer[render_groupidx].draw_count = draw_count;
// }
/** */
// export function Vertex_buffer_render_group_set_size(render_groupidx, size) { 
//    _render_groups.buffer[render_groupidx].size = size;
// }

















/** DEBUG */
export function Vertex_buffer_render_group_print_loop() {

   console.log( '----- Vertex Buffer Render Groups -----');
   for(let i=0; i <= _render_groups.boundary; i++) {
      
      const g = _render_groups.buffer[i];
      
      console.log( 
         'vbidx', g.debug_vbidx,
         'rgidx', i,
         'start:', g.start,
         'count:', g.count,
         'size:', g.size,
         'draw_count:', g.draw_count,
         'index_offset:', g.index_offset,
         'num_faces:', g.num_faces,
      );
   }
}
export function Vertex_buffer_render_group_print_render_group(render_groupidx) {
   
   const g = _render_groups.buffer[render_groupidx];
   console.log(
      '----- Vertex Buffer Render Group -----\n',
      'vbidx', g.debug_vbidx,
      'rgidx', render_groupidx,
      'start:', g.start,
      'count:', g.count,
      'size:', g.size,
      'draw_count:', g.draw_count,
      'index_offset:', g.index_offset,
      'num_faces:', g.num_faces,
   );
}