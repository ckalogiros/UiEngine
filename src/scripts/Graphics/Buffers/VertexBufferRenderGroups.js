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
const _vertex_buffer_render_groups = New_generic_buffer(_, 'GFX Vertex Buffer Render Groups');




/** */
export function Vertex_buffer_render_group_create(start, size) {

   const render_group_idx = _vertex_buffer_render_groups.Add(
      {
         start:start, 
         count:0, 
         size:size, 
         draw_count:0, 
      }
   );

   return render_group_idx;
}

// GETTERS-SETTERS
/** */
export function Vertex_buffer_render_group_get_render_group(render_group_idx) { 
   return _vertex_buffer_render_groups.buffer[render_group_idx];
}
/** */
export function Vertex_buffer_render_group_set(render_group_idx, start, draw_count) { 
   _vertex_buffer_render_groups.buffer[render_group_idx].start = start;
   _vertex_buffer_render_groups.buffer[render_group_idx].draw_count = draw_count;
}
/** */
export function Vertex_buffer_render_group_set_start(render_group_idx, start) { 
   _vertex_buffer_render_groups.buffer[render_group_idx].start = start;
}
/** */
export function Vertex_buffer_render_group_set_draw_count(render_group_idx, draw_count) { 
   _vertex_buffer_render_groups.buffer[render_group_idx].draw_count = draw_count;
}
/** */
export function Vertex_buffer_render_group_set_size(render_group_idx, size) { 
   _vertex_buffer_render_groups.buffer[render_group_idx].size = size;
}

















/** DEBUG */
export function Vertex_buffer_render_group_print_loop() {

   console.log( '----- Vertex Buffer Render Groups -----');
   for(let i=0; i <= _vertex_buffer_render_groups.boundary; i++) {
      
      const g = _vertex_buffer_render_groups.buffer[i];
      
      console.log( i, 
         'start:', g.start,
         'draw_count:', g.draw_count,
      );
   }
}
export function Vertex_buffer_render_group_print_render_group(render_group_idx) {
   
   const g = _vertex_buffer_render_groups.buffer[render_group_idx];
   console.log(
      '----- Vertex Buffer Render Group -----\n',
      'render_group_idx', render_group_idx,
      'start:', g.start,
      'count:', g.count,
      'size:', g.size,
      'draw_count:', g.draw_count,
   );
}