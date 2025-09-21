"use strict";


import { New_generic_buffer } from '../../Engine/Core/Buffers.js';
import { Typed_array_create_from_type } from './TypedArrayBuffersInterface.js';





const DISABLE_DEBUG = true;


/****************************************************************************************************************************************************/
// Index Buffer Data 
/****************************************************************************************************************************************************/


/** */
const _index_buffers = New_generic_buffer(_, 'GFX Index Buffer');
/** */
export function Index_buffer_reset_buffer() { _index_buffers.ResetFull(); }
/** */
export function Index_buffer_get() { return _index_buffers; }
/** */
export function Index_buffer_get_by_ibidx(ibidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_index_buffers, ibidx, new Error().lineNumber)
   return _index_buffers.buffer[ibidx];
}
/** Check if the analogous index buffer exists, in the case of one to one vertex and index buffers */
function Index_buffer_get_by_vertex_buffer_index(ibidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_index_buffers, ibidx, new Error().lineNumber);

   if ((ibidx < 0 || ibidx > _index_buffers.boundary) || (_index_buffers.buffer[ibidx] === null)) {
      console.error('NO INDEX BUFFER FOUND THAT CORESPONDS TO THE EWUIVALENT VERTEX BUFFER INDEX.');
      alert('SEE CONOLE ERROR\nIndexBuffers.js');
   }
   return ibidx;
}
/** */
function Index_buffer_set_ib_data(gl, buffer) {

   const ib = Index_buffer_get_by_ibidx(buffer.ibidx);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.ibo);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib, gl.STATIC_DRAW, 0);


   buffer.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

   GL_STATE.BOUND_IBO = buffer.ibo;
   GL_STATE.BOUND_IBIDX = buffer.ibidx;

   console.log('----------------- INDEX BUFFER:BINDING AND SETTING DATA. ')
   console.log(' ibidx:', buffer.ibidx, 'count:', buffer.count, 'vCount:', buffer.vCount)
   if(DEBUG_GL) GL_GET_ERROR(new Error().lineNumber)
   // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
/** Returns struct: { ibidx:INT, ibo:OBJ } */
function Index_buffer_create(type, size) {

   const ret = {
      ibidx: INT_NULL,
      ibo: INT_NULL, // VBO is stored directly to the vertex buffer class object.
   };

   const ib = Typed_array_create_from_type(type, size);

   ret.ibidx = _index_buffers.Add(ib);
   ret.ibo = gfxCtx.gl.createBuffer();
   // gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ret.ibo);


   return ret;
}






/****************************************************************************************************************************************************/
// Index Buffer Info 
/****************************************************************************************************************************************************/


/** */
const _index_buffers_info = New_generic_buffer(_, 'GFX Index Buffer Info');
/** */
export function Index_buffer_info_reset_buffer() {
   Gl_index_buffer_info_ibo_delete_all();
   _index_buffers_info.ResetFull();
}
/** */
export function Gl_index_buffer_info_ibo_delete(ibidx) {

   const ibo = _index_buffers_info.buffer[ibidx].ibo;
   gfxCtx.gl.deleteBuffer(ibo);
}
/** */
function Gl_index_buffer_info_ibo_delete_all() {

   for (let i = 0; i <= _index_buffers_info.boundary; i++) {

      const ibo = _index_buffers_info.buffer[i].ibo;
      gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, null);
      gfxCtx.gl.deleteBuffer(ibo);
   }
}
/** */
export function Index_buffer_info_get() { return _index_buffers_info; }
/** */
export function Index_buffer_info_get_by_ibidx(ibidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_index_buffers_info, ibidx, new Error().lineNumber)
   return _index_buffers_info.buffer[ibidx];
}
/** */
export function Index_buffer_state_enable(ibidx, STATE_FLAG) {
   _index_buffers_info.buffer[ibidx].state.mask |= STATE_FLAG;
}
/** */
export function Index_buffer_state_disable(ibidx, STATE_FLAG) {
   _index_buffers_info.buffer[ibidx].state.mask &= ~STATE_FLAG;
}





/** */
class Index_Buffer_Info {

   constructor(size, sid, ibidx, ibo, type) {

      this.size = size;
      this.count = 0;
      this.vCount = 0;

      this.ibo = ibo;
      this.ibidx = ibidx;

      this.type = type; // The type of the typed array buffer

      this.state = { mask: 0x0 }; // Gather the state of the vertex buffer info into a bit field
      this.sid = sid;             // Bit field: Shader ID

      this.discontinue_offset = 0; // An offset where the break of the indices happen. Used for connected vertices
      if (sid.shad & SID.SHAD.INDEXED_PATT_DISCONTINUE_4) this.discontinue_offset = 4; // Break vertex connection every 4 vertices, for a type of geometry with 4 vertices per face
      else if (sid.shad & SID.SHAD.INDEXED_PATT_DISCONTINUE_6) this.discontinue_offset = 6; // Break vertex connection every 6 vertices, for a type of geometry with 6 vertices per face

      this.connect_offset = 0; // An offset of the vertex index at which the next face will be connected to
      if (sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X)
         this.connect_offset = 2 // Connect to the second previous index 

      this.indices_per_face = INDICES_PER_RECT; // HACK: In the future this must be set acording to vertex buffer architecture (???????)

   }


   Add(num_faces) {

      const data = _index_buffers.buffer[this.ibidx];

      if ((this.vCount % 1) !== 0) console.error('index buffer count mismatch')

      let k = this.vCount;
      for (let i = 0; i < num_faces; ++i) {

         for (let j = 0; j < 2; j++) {

            data[this.count++] = k + j;
            data[this.count++] = k + j + 1;
            data[this.count++] = k + j + 2;
         }

         k += this.discontinue_offset;
         this.vCount += this.discontinue_offset;

         k -= this.connect_offset;
         this.vCount -= this.connect_offset;
      }

      k += this.connect_offset;
      this.vCount += this.connect_offset;

      // rg.index_offset = offset;

      // total_attribs_size += rg.size;
      // offset += num_faces * INDICES_PER_RECT;
      // k = total_attribs_size / attribs_per_vertex;

      if ((this.vCount % 1) !== 0) console.error('index buffer count mismatch')

      this.state.mask |= BUFFER_STATE.NEEDS_UPDATE; // Make sure that we update GL bufferData 

   }


   Realloc(new_size = 0) {

      this.size = this.#CalculateMemoryPaddedSize(this.size, new_size)
      const new_data = Typed_array_create_from_type(this.type, this.size);

      const old_data = _index_buffers.buffer[this.ibidx];
      new_data.set(old_data, 0);
      _index_buffers.buffer[this.ibidx] = new_data;

      if (DEBUG.GFX.BUFFERS) console.warn('Resizing index buffer!')

   }


   #CalculateMemoryPaddedSize(cur_size, new_size) {

      return new_size;

      if (new_size <= 6) { return 6; }

      console.log(new_size)
      
      let stride = 6;
      const dif = new_size - cur_size;
      if(dif < 60) stride = 6;
      if(dif < 60*10) stride = 24;
      else stride = 48;

      let size = cur_size;
      const target_size = new_size;
      while (size < target_size) {
         size += stride;
      }

      return size;
   }

};
/** */
export function Index_buffer_info_get_indices_per_face(ibidx) {
   //TODO: check buffer error

   return _index_buffers_info.buffer[ibidx].indices_per_face;
}
/** */
export function Index_buffer_info_create(sid = 0, size = 6) {

   /***********************************************************************************************/
   // Create index buffer

   const type = BUFFER_TYPE.UINT16; // TODO: Who decides the type???

   const ret = Index_buffer_create(type, size, sid);

   const ib_info = new Index_Buffer_Info(size, sid, ret.ibidx, ret.ibo, type);

   _index_buffers_info.Add(ib_info);

   gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ret.ibo);
   const ib = _index_buffers.buffer[ret.ibidx];
   gfxCtx.gl.bufferData(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ib, gfxCtx.gl.STATIC_DRAW, 0);

   ib_info.state.mask |= BUFFER_STATE.IS_ACTIVE;

   return ib_info;
}
/** */
export function Index_buffer_info_check_has_enough_indices(ibidx, vertices_count, num_faces_to_insert) {

   const ib_info = _index_buffers_info.buffer[ibidx];

   const total_draw_count = ((vertices_count/4) + num_faces_to_insert) * ib_info.indices_per_face;
   // console.warn(vertices_count,num_faces_to_insert)


   if (total_draw_count > ib_info.count) {
      Index_buffer_add_indices_from_render_group(ibidx, num_faces_to_insert)
   }
}
/** */
export function Index_buffer_add_indices_from_render_group(ibidx, num_faces) {

   const ib_info = _index_buffers_info.buffer[ibidx];
   let k = ib_info.vCount;

   // Check for buffer realloc
   const total_draw_count = (num_faces*INDICES_PER_RECT)+ib_info.count;
   if (total_draw_count >= ib_info.size) {
      ib_info.Realloc(total_draw_count);
   }
   
   const data = _index_buffers.buffer[ib_info.ibidx];
   
   for (let i = 0; i < num_faces; ++i) {
      
      for (let j = 0; j < 2; j++) {
         
         data[ib_info.count++] = k + j;
         data[ib_info.count++] = k + j + 1;
         data[ib_info.count++] = k + j + 2;
      }
      
      k += ib_info.discontinue_offset;
      ib_info.vCount += ib_info.discontinue_offset;
      
      k -= ib_info.connect_offset;
      ib_info.vCount -= ib_info.connect_offset;
   }

   
   ib_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
}
/** */
export function Index_buffer_reset(ibidx) {

   const ib_info = _index_buffers_info.buffer[ibidx];

   ib_info.count = 0;
   ib_info.vCount = 0;


}











/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/

/** */
function DEBUG_PRINT(buffer, index, line) {
   if (index < 0 || index > buffer.boundary) {
      console.error('Index is out of bounds. @GlVertexBuffer.js.\nLine:', line, 'index:', index, buffer);
      alert('Index is out of bounds. @GlVertexBuffer.js');
   }
   if (buffer.buffer[index] === null) {
      console.error('Buffer at index is NULL. @GlVertexBuffer.js\nLine:', line, 'index:', index, buffer);
      alert('Buffer at index is NULL. @GlVertexBuffer.js.');
   }
}
/** */
export function Gl_index_buffer_print() {
   console.log('IndexBuffer:', _index_buffers)
   console.log('IndexBufferInfo', _index_buffers_info)
}





















/** */
// export function Index_buffer_info_break_indices(ibidx, num_vertices) {

//    const ib_info = _index_buffers_info.buffer[ibidx];

//    // Check for buffer realloc
//    if (ib_info.count+num_vertices > ib_info.size) {
//       ib_info.Realloc(ib_info.count+num_vertices);
//    }

//    const data = _index_buffers.buffer[ibidx];

//    // if ((ib_info.vCount % 1) !== 0) console.error('index buffer count mismatch')

//    let k = ib_info.count;
//    for (let i = k; i < k+num_vertices; ++i) {
//       data[k] = 0;
//    }

//    ib_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
// }