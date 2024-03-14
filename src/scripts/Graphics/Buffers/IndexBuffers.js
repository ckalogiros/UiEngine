"use strict";


import { M_Buffer } from '../../Engine/Core/Buffers.js';
import { Create_buffer_from_type } from './TypedArrayBuffers.js';





const DISABLE_DEBUG = true;


/****************************************************************************************************************************************************/
// Index Buffer Data 
/****************************************************************************************************************************************************/


const _index_buffers = new M_Buffer();



export function Index_buffer_get() { return _index_buffers; }



export function Index_buffer_get_by_ibidx(ibidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_index_buffers, ibidx, new Error().lineNumber)
   return _index_buffers.buffer[ibidx];
}


/** Check if the analogous index buffer exists, in the case of one to one vertex and index buffers */
export function Index_buffer_get_by_vertex_buffer_index(ibidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_index_buffers, ibidx, new Error().lineNumber);

   if((ibidx < 0 || ibidx > _index_buffers.boundary) || (_index_buffers.buffer[ibidx] === null)){
      console.error('NO INDEX BUFFER FOUND THAT CORESPONDS TO THE EWUIVALENT VERTEX BUFFER INDEX.');
      alert('SEE CONOLE ERROR\nIndexBuffers.js');
   }
   return ibidx;
}



export function Index_buffer_set_ib_data(gl, buffer) {

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
export function Index_buffer_create(type, size) {

   const ret = {
      ibidx: INT_NULL,
      ibo: INT_NULL, // VBO is stored directly to the vertex buffer class object.
   };

   const ib = Create_buffer_from_type(type, size);
   ret.ibidx = _index_buffers.Add(ib);
   ret.ibo = gfxCtx.gl.createBuffer();
   gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ret.ibo);


   return ret;
}

/****************************************************************************************************************************************************/

// export function Gl_ib_create_indexbuffer(sid, gl, vao, indices_per_rect) {
//    _index_buffers[_count] = new IndexBuffer(sid, gl, indices_per_rect, vao, _count);
//    _count++;
//    return _count - 1;
// }



// export function Gl_ib_get_byidx(idx) {
//    if (idx < 0 || idx >= _count) alert('Index for getting indexbuffer is out of bounds. @ IndexBuffer.js.');
//    return _index_buffers[idx];
// }



// export function Gl_ib_get_byidx_in_prog(idx) {
//    if (_index_buffers[idx])
//       return _index_buffers[idx];
//    else
//       alert('ERROR: NO INDEX BUFFER EXISTS.  @ IndexBuffer.js.')
// }



// export function Gl_ib_set_idx_in_prog(ibidx, idx_in_prog) {
//    _index_buffers[ibidx].idx_in_prog = idx_in_prog;
// }



// export function Gl_ib_set_show(ibidx, flag){
//    _index_buffers[ibidx].show = flag;
// }



// export function Gl_ib_exists(ibIdx) {

//    if (_index_buffers[ibIdx])
//       return _index_buffers[ibIdx];

//    return -1;
// }






/****************************************************************************************************************************************************/
// Index Buffer Info 
/****************************************************************************************************************************************************/


const _index_buffers_info = new M_Buffer();


export function Index_buffer_info_get() { return _index_buffers_info; }



export function Index_buffer_info_get_by_ibidx(ibidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_index_buffers_info, ibidx, new Error().lineNumber)
   return _index_buffers_info.buffer[ibidx];
}



export function Index_buffer_state_enable(ibidx, STATE_FLAG) {
   _index_buffers_info.buffer[ibidx].state.mask |= STATE_FLAG;
}



export function Index_buffer_state_disable(ibidx, STATE_FLAG) {
   _index_buffers_info.buffer[ibidx].state.mask &= ~STATE_FLAG;
}




// export function Index_buffer_info_create(sid, size = MAX_INDEX_BUFFER_SIZE) {
export function Index_buffer_info_create(sid, vao, vaoidx, size = 6) {

   /***********************************************************************************************/
   // Create index buffer

   // gfxCtx.gl.bindVertexArray(vao);

   const type = BUFFER_TYPE.UINT16; // TODO: Who decides the type???

   const ret = Index_buffer_create(type, size, sid);

   const ib_info = new Index_Buffer_Info(size, sid, ret.ibidx, ret.ibo, type, vao, vaoidx);

   _index_buffers_info.Add(ib_info);

   // VAO must be bound before enabling attribute locations for the created VAO
   // Bind VAO in case the VAO exists, otherwise if VAO was created it is already bound.  
   //  gfxCtx.gl.bindVertexArray(vao.vao);
   gfxCtx.gl.bindBuffer(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ret.ibo);
   const ib = _index_buffers.buffer[ret.ibidx];
   gfxCtx.gl.bufferData(gfxCtx.gl.ELEMENT_ARRAY_BUFFER, ib, gfxCtx.gl.STATIC_DRAW, 0);

   return ib_info;
}


class Index_Buffer_Info {

   constructor(size, sid, ibidx, ibo, type, vao, vaoidx) {

      this.size = size;
      this.count = 0;
      this.vCount = 0;

      this.ibo = ibo;
      this.ibidx = ibidx;
      this.vao = vao;
      this.vaoidx = vaoidx;

      this.type = type; // The type of the typed array buffer

      this.state = { mask: 0x0 }; // Gather the state of the vertex buffer info into a bit field
      this.sid = sid;             // Bit field: Shader ID

   }


   Add(num_faces) {

      /**
       * // UNNECESSARY work
       * On remove or reset, the buffer elements are intact, only the count changes.
       * But yet on adding we calculate and adding new index elements.
       * So we could use the length of the Uint16 array buffer to tell
       * up at which point are the indices calculated, and if it is enough 
       * we just change the count
       */
      const offset = VERTS_PER_RECT_INDEXED;

      const data = _index_buffers.buffer[this.ibidx];

      if((this.vCount % 1) !== 0)
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
      if((this.vCount % 1) !== 0)
      console.error('index buffer count mismatch')

      this.state.mask |= BUFFER_STATE.NEEDS_UPDATE; // Make sure that we update GL bufferData 
   }



   Realloc(extra_size = 0) {

      this.size = this.#CalculateMemoryPaddedSize(this.size, extra_size)
      const new_data = Create_buffer_from_type(this.type, this.size);

      const old_data = _index_buffers.buffer[this.ibidx];
      const size = old_data.length;
      for (let i = 0; i < size; i++) {
         new_data[i] = old_data[i];
      }
      _index_buffers.buffer[this.ibidx] = new_data;

      if (DEBUG.GFX.BUFFERS) console.warn('Resizing index buffer!')

   }



   ResetToIndex(index, vertices_per_rect) {

      const new_vCount = ((this.count - index) / INDICES_PER_RECT) * vertices_per_rect;
      this.vCount -= new_vCount;
      if((this.vCount % 1) !== 0)
      console.error('index buffer count mismatch')
      this.count = index;
      this.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
   }


   Remove_geometry(num_faces) {

      const attr_count = INDICES_PER_RECT * num_faces; // Meshes total attributes count.
      this.count -= attr_count;
      const vCount = (attr_count / INDICES_PER_RECT) * VERTS_PER_RECT_INDEXED;
      this.vCount -= vCount;
      this.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

      return attr_count;
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




export function Index_buffer_reset(ibidx) {
   _index_buffers_info.buffer[ibidx].count = 0;
   _index_buffers_info.buffer[ibidx].vCount = 0;
   _index_buffers_info.buffer[ibidx].state.mask |= BUFFER_STATE.NEEDS_UPDATE;
}



export function Index_buffer_reset_to_index(ibidx, start) {

   const ib_info = _index_buffers_info.buffer[ibidx];
   if (start < 0 || start > ib_info.count) console.error('Start should be less than vertex buffer count. @IndexBuffers.js, ');
   const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK

   const vCount = start ? (start / INDICES_PER_RECT) * vertices_per_rect  : 0;
   ib_info.count = start;
   ib_info.vCount = vCount;
   ib_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;


}



export function Index_buffer_add_indices(ib_gfx, dbg_mesh_name) {

   const ibidx = ib_gfx.idx;
   const ib_info = Index_buffer_info_get_by_ibidx(ibidx);
   const num_faces = 1;

   // Check for buffer realloc
   if (ib_info.count + num_faces * INDICES_PER_RECT > ib_info.size) {
       ib_info.Realloc();
   }

   const start = ib_info.count;
   ib_gfx.start = start;
   ib_info.Add(num_faces)
   ib_gfx.count = ib_info.count;

   
   ib_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

   return start;
}



export function Index_buffer_add_indices_from_non_existant_mesh(ib_gfx, dbg_mesh_name) {

   const ibidx = ib_gfx.idx;
   const ib_info = Index_buffer_info_get_by_ibidx(ibidx);
   const num_faces = 1;

   // Check for buffer realloc
   if (ib_info.count + num_faces * INDICES_PER_RECT > ib_info.size) {
       ib_info.Realloc();
   }

   const start = ib_info.count;
   ib_info.Add(num_faces)

   
   ib_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

   return start;
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



export function Gl_index_buffer_print(){
   console.log('IndexBuffer:', _index_buffers)
   console.log('IndexBufferInfo', _index_buffers_info)
}