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
export function Vertex_buffer_render_group_create() {

   const render_groupidx = _render_groups.Add(
      {
         start:0, 
         count:0, 
         size:0, 
         draw_count:0, 
         index_offset: 0,
         // view_vb_groupidx:view_vb_groupidx,
         // vb_groupidx:vb_groupidx,
         // vb_groupidx:INT_NULL,
         // vertex_offset: 0,
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
export function Vertex_buffer_render_group_set_all(render_groupidx, start, count, size, draw_count, index_offset) { 
   _render_groups.buffer[render_groupidx].start = start;
   _render_groups.buffer[render_groupidx].count = count;
   _render_groups.buffer[render_groupidx].size = size;
   _render_groups.buffer[render_groupidx].draw_count = draw_count;
   _render_groups.buffer[render_groupidx].index_offset = index_offset;
   console.log('Vertex_buffer_render_group_set_all\n render_groupidx:', render_groupidx,  _render_groups.buffer[render_groupidx])
}
/** */
export function Vertex_buffer_render_group_set(render_groupidx, start, draw_count) { 
   _render_groups.buffer[render_groupidx].start = start;
   _render_groups.buffer[render_groupidx].draw_count = draw_count;
}
/** */
export function Vertex_buffer_render_group_set_start(render_groupidx, start) { 
   _render_groups.buffer[render_groupidx].start = start;
}
/** */
export function Vertex_buffer_render_group_set_draw_count(render_groupidx, draw_count) { 
   _render_groups.buffer[render_groupidx].draw_count = draw_count;
}
/** */
export function Vertex_buffer_render_group_set_size(render_groupidx, size) { 
   _render_groups.buffer[render_groupidx].size = size;
}
// /** */
// export function Vertex_buffer_render_group_set_view_vb(render_groupidx, view_vb_groupidx) { 
//    _render_groups.buffer[render_groupidx].view_vb_groupidx = view_vb_groupidx;
// }

















/** DEBUG */
export function Vertex_buffer_render_group_print_loop() {

   console.log( '----- Vertex Buffer Render Groups -----');
   for(let i=0; i <= _render_groups.boundary; i++) {
      
      const g = _render_groups.buffer[i];
      
      console.log( 
         'rgidx', i,
         'start:', g.start,
         'count:', g.count,
         'size:', g.size,
         'draw_count:', g.draw_count,
         'index_offset:', g.index_offset,
         // 'view_vb_groupidx:', g.view_vb_groupidx,
         // 'offset:', g.offset,
         // 'vertex_offset:', g.vertex_offset,
      );
   }
}
export function Vertex_buffer_render_group_print_render_group(render_groupidx) {
   
   const g = _render_groups.buffer[render_groupidx];
   console.log(
      '----- Vertex Buffer Render Group -----\n',
      'rgidx', render_groupidx,
      'start:', g.start,
      'count:', g.count,
      'size:', g.size,
      'draw_count:', g.draw_count,
      'index_offset:', g.index_offset,
      // 'view_vb_groupidx:', g.view_vb_groupidx,
      // 'offset:', g.offset,
      // 'vertex_offset:', g.vertex_offset,
   );
}