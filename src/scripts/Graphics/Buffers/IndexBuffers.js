"use strict";


import { New_generic_buffer } from '../../Engine/Core/Buffers.js';
import { Typed_array_create_from_type } from './TypedArrayBuffers.js';





const DISABLE_DEBUG = true;


/****************************************************************************************************************************************************/
// Index Buffer Data 
/****************************************************************************************************************************************************/


const _index_buffers = New_generic_buffer();



export function Index_buffer_get() { return _index_buffers; }



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



function Index_buffer_set_ib_data(gl, buffer) {

   const ib = Index_buffer_get_by_ibidx(buffer.ibidx);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.ibo);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib, gl.STATIC_DRAW, 0);


   buffer.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

   GL.BOUND_IBO = buffer.ibo;
   GL.BOUND_IBIDX = buffer.ibidx;

   console.log('----------------- INDEX BUFFER:BINDING AND SETTING DATA. ')
   console.log(' ibidx:', buffer.ibidx, 'count:', buffer.count, 'vCount:', buffer.vCount)
   // GL_GET_ERROR(new Error().lineNumber)
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
   gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ret.ibo);


   return ret;
}






/****************************************************************************************************************************************************/
// Index Buffer Info 
/****************************************************************************************************************************************************/


const _index_buffers_info = New_generic_buffer();



export function Index_buffer_info_get() { return _index_buffers_info; }



export function Index_buffer_info_get_by_ibidx(ibidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_index_buffers_info, ibidx, new Error().lineNumber)
   return _index_buffers_info.buffer[ibidx];
}



export function Index_buffer_state_enable(ibidx, STATE_FLAG) {
   _index_buffers_info.buffer[ibidx].state.mask |= STATE_FLAG;
}



export function Index_buffer_state_disable(ibidx, STATE_FLAG) {
   _index_buffers_info.buffer[ibidx].state.mask &= ~STATE_FLAG;
}





class Index_Buffer_Info {

   constructor(size, sid, ibidx, ibo, type, PATTERN) {

      this.size = size;
      this.count = 0;
      this.vCount = 0;

      this.ibo = ibo;
      this.ibidx = ibidx;

      this.type = type; // The type of the typed array buffer

      this.state = { mask: 0x0 }; // Gather the state of the vertex buffer info into a bit field
      this.sid = sid;             // Bit field: Shader ID

      this.temp_pattern = PATTERN; // Temporary identification of the this index buffer pattern type.

      this.indices_per_face = INDICES_PER_RECT; // HACK: In the future this must be set acording to vertex buffer architecture (???????)

   }


   Add(num_faces) {

      const offset = VERTS_PER_RECT_INDEXED;

      const data = _index_buffers.buffer[this.ibidx];

      if ((this.vCount % 1) !== 0)
         console.error('index buffer count mismatch')

      let k = this.vCount;
      for (let i = 0; i < num_faces; ++i) {

         for (let j = 0; j < 2; j++) {

            data[this.count++] = k + j;
            data[this.count++] = k + j + 1;
            data[this.count++] = k + j + 2;
         }

         k += offset;
         this.vCount += offset;
      }
      if ((this.vCount % 1) !== 0)
         console.error('index buffer count mismatch')

      this.state.mask |= BUFFER_STATE.NEEDS_UPDATE; // Make sure that we update GL bufferData 

   }



   Realloc(extra_size = 0) {

      this.size = this.#CalculateMemoryPaddedSize(this.size, extra_size)
      const new_data = Typed_array_create_from_type(this.type, this.size);

      const old_data = _index_buffers.buffer[this.ibidx];
      const size = old_data.length;
      for (let i = 0; i < size; i++) {
         new_data[i] = old_data[i];
      }
      _index_buffers.buffer[this.ibidx] = new_data;

      if (DEBUG.GFX.BUFFERS) console.warn('Resizing index buffer!')

   }


   #CalculateMemoryPaddedSize(cur_size, extra_size) {

      let stride = 64;

      if (cur_size + extra_size < 64) { return 64; }
      if (cur_size + extra_size < 128) { return 128; }
      if (cur_size + extra_size < 256) { return 256; }
      if (cur_size + extra_size < 512) { return 512; }
      else if (cur_size > 32768) { stride = 2048; }
      else if (cur_size > 16384) { stride = 1024; }
      else if (cur_size > 4096) { stride = 128; }


      let new_size = cur_size;
      const target_size = cur_size + extra_size;
      while (new_size < target_size) {
         new_size += stride;
      }
      // console.warn('stride:', stride, ' cursize:', cur_size, ' newsize:', new_size, ' extra_size:', extra_size)
      if (new_size % 64) console.error('NOT DIVISIBLE BY 64:', new_size, new_size % 64, stride)

      new_size += stride; // Make it greater than the target_size
      return new_size;
   }

};


export function Index_buffer_info_get_indices_per_face(ibidx) {
   //TODO: check buffer error

   return _index_buffers_info.buffer[ibidx].indices_per_face;
}



export function Index_buffer_info_create(sid = 0, size = 6, PATTERN=INT_NULL) {
   /**ERROR */ if(PATTERN===INT_NULL) alert('PATTERN should be passed as param from caller')

   /***********************************************************************************************/
   // Create index buffer

   const type = BUFFER_TYPE.UINT16; // TODO: Who decides the type???

   const ret = Index_buffer_create(type, size, sid);

   const ib_info = new Index_Buffer_Info(size, sid, ret.ibidx, ret.ibo, type, PATTERN);

   _index_buffers_info.Add(ib_info);

   gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ret.ibo);
   const ib = _index_buffers.buffer[ret.ibidx];
   gfxCtx.gl.bufferData(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ib, gfxCtx.gl.STATIC_DRAW, 0);

   ib_info.state.mask |= BUFFER_STATE.IS_ACTIVE;

   return ib_info;
}




function Index_buffer_add_indices(ibidx, num_faces) {

   const ib_info = _index_buffers_info.buffer[ibidx];  

   // Check for buffer realloc
   if (ib_info.count + num_faces * INDICES_PER_RECT > ib_info.size) {
      ib_info.Realloc();
   }

   // const start = ib_info.count;
   // ib_info.start = start;
   ib_info.Add(num_faces)
   ib_info.count = ib_info.count;


   ib_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

   // return start;
}



export function Index_buffer_info_check_has_enough_indices(ibidx, draw_count, num_faces_to_insert){

   const ib_info = _index_buffers_info.buffer[ibidx];  

   const total_draw_count = draw_count + (num_faces_to_insert * ib_info.indices_per_face);

   
   if(total_draw_count >= ib_info.count){

      // Check for buffer realloc
      if (total_draw_count > ib_info.size) {
         ib_info.Realloc();
      }

      Index_buffer_add_indices(ibidx, (num_faces_to_insert * ib_info.indices_per_face));
   }
}












/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/

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



export function Gl_index_buffer_print() {
   console.log('IndexBuffer:', _index_buffers)
   console.log('IndexBufferInfo', _index_buffers_info)
}