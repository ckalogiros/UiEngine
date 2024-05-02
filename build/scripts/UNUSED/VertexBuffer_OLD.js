// "use strict";


// import { Gfx_pool_create_vb_buffer } from '../../Engine/Interfaces/Gfx/GfxContextCreate.js';
// // For Debuging
// import * as dbg from '../Debug/GfxDebug.js'
// import { GlEnableAttribsLocations } from '../GlProgram.js';





// export function Gl_create_vertex_buffer(sid, sceneidx, prog, groupidx){

//     const vbidx = prog.vertexBufferCount++;
//     prog.vb[vbidx] = new VertexBuffer(sid, sceneidx, vbidx, gfxCtx.gl);
//     const vb = prog.vb[vbidx];

//     // Scenes_create_vertex_buffer_buffer(sceneidx, groupidx, prog.idx, vbidx); // For storing meshes by its gfx
//     Gfx_pool_create_vb_buffer(groupidx, prog.idx, vbidx);

//     gfxCtx.gl.bindVertexArray(vb.vao);
//     gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.webgl_buffer);

//     // Initialize attribute locations of the shader program's new vertex buffer.
//     GlEnableAttribsLocations(gfxCtx.gl, prog);

//     if (dbg.GL_DEBUG_BUFFERS_ALL) console.log('===== VertexBuffer =====\nvbidx:', vbidx, 'progidx:', prog.idx);

//     // Create Index buffer
//     if (sid.shad & SID.SHAD.INDEXED) {

//         prog.CreateIndexBuffer(sid, sceneidx, gfxCtx.gl, INDICES_PER_RECT, vb.vao);

//         if (dbg.GL_DEBUG_BUFFERS_ALL) console.log('----- VertexBuffer -----\nibidx:', ibidx, 'progidx:', prog.idx)
//     }


//     return vb;
// }

// export class VertexBuffer {

//     sceneidx = INT_NULL;

//     webgl_buffer = null;
//     data = [];

//     idx = INT_NULL;	    // The vertex buffer (float*) idx that this Mesh is stored to.
//     count = 0;			// Current size of the attributes in data buffer (in floats)
//     size = 0;			// Total   size of the float buffer (in floats)
//     vCount = 0;			// Number of vertices

//     vao = null;		    // Vertex Array 
//     // vboId = INT_NULL;	// Vertex Buffer Gl-Id
//     // tboId = INT_NULL;	// Texture Buffer Gl-Id
//     texidx = INT_NULL;	// Stores the index of the texture's location in the texture array

//     type = 0; // Some flags to interpet the type of the vertex buffer(Example: type:INFO_UI_GFX)

//     //    /*NOT_USED*/scissorbox = [];
//     //    /*NOT_USED*/free_vertex_buffer;

//     show = false;
//     needsUpdate = false;
//     hasChanged = false;
//     hasScissorBox = false;
//     isPrivate = false; // SEE ## PRIVATE_BUFFERS

//    // Debug
// //    debug = { meshesNames: [], sidName: '' };
//    /**DEBUG*/meshesNames = [];
//    /**DEBUG*/sidName = '';

//     constructor(sid, sceneidx, idx, gl) {

//         this.sidName = dbg.GetShaderTypeId(sid);
//         this.sceneidx = sceneidx;
//         this.idx = idx;

//         this.vao = gl.createVertexArray();
//         gl.bindVertexArray(this.vao);
//         this.webgl_buffer = gl.createBuffer();
//         this.size = MAX_VERTEX_BUFFER_SIZE;
//         this.data = new Float32Array(this.size);

//         //    this.free_vertex_buffer = new M_Buffer();

//     }


//     /** 
//      * Remove geometry fast version. 
//      * We just set the alpha color value to 0.
//      * And we keep the dimention of the mesh in the vertex buffer
//      * in a separate buffer, so we can reuse when possible
//      */
//     Remove_geometry_fast(gfx, num_faces) {

//         GlOps.GlSetColor(gfx, [0, 0, 0, 1], num_faces);

//         //    if (!this.free_vertex_buffer.count) this.free_vertex_buffer.Init(1);

//         const removedVerticesInfo = {
//             progidx: gfx.prog.idx,
//             vbIdx: gfx.vb.idx,
//             vbStart: gfx.vb.start,
//             vbCount: gfx.vb.count,
//             ibIdx: gfx.vb.idx,
//             ibStart: gfx.ib.start,
//             ibCount: gfx.ib.count,
//         };

//         const meshTotalAttrCount = gfx.vb.count * num_faces;
//         const count = vb.count - (vb.count - meshTotalAttrCount);
//         const vCount = meshTotalAttrCount / gfx.attribsPerVertex;
//         this.count -= count;
//         this.vCount -= vCount;
//         this.needsUpdate = true;

//         //    this.free_vertex_buffer.Add(removedVerticesInfo);

//     }


//     Remove_geometry_params(num_faces, start_index, attribsPerVertex, verticesPerRect) {

//         const attribs_per_face = attribsPerVertex * verticesPerRect;
//         const start = start_index + (attribs_per_face * num_faces);
//         const end = this.count
//         let k = start_index;

//         // Shift all attributes left to fil the gap of the removed attributes. 
//         for (let i = start; i < end; i++) {
//             this.data[k++] = this.data[i]
//         }

//         const meshTotalAttrCount = attribs_per_face * num_faces;
//         const vCount = meshTotalAttrCount / attribsPerVertex;
//         this.count -= meshTotalAttrCount;
//         this.vCount -= vCount;

//         if (this.count < 0)
//             console.error('[[[[[[[[[[[[[[[[[ Count < 0. vb:', this.count, 'vbidx:', this.idx)
//         // console.log('------------- Removing Num_faces from buffer:', num_faces, ' prog:', gfx.prog.idx, ' vb:', gfx.vb.idx)
//         this.needsUpdate = true;

//         //    this.free_vertex_buffer.Add(removedVerticesInfo);

//         return meshTotalAttrCount;

//     }


//     Remove_geometry(gfx, num_faces, start_index) {

//         const removedVerticesInfo = {
//             progidx: gfx.prog.idx,
//             vbIdx: gfx.vb.idx,
//             vbStart: gfx.vb.start,
//             vbCount: gfx.vb.count,
//             ibIdx: gfx.vb.idx,
//             ibStart: gfx.ib.start,
//             ibCount: gfx.ib.count,
//         };

//         const start = start_index + (gfx.vb.count * num_faces);
//         const end = this.count
//         let k = start_index;

//         // Shift all attributes left to fil the gap of the removed attributes. 
//         for (let i = start; i < end; i++) {
//             this.data[k++] = this.data[i]
//         }

//         const meshTotalAttrCount = gfx.vb.count * num_faces;
//         // const count = this.count - (this.count - meshTotalAttrCount);
//         const vCount = meshTotalAttrCount / gfx.attribsPerVertex;
//         this.count -= meshTotalAttrCount;
//         this.vCount -= vCount;

//         if (this.count < 0)
//             console.error('[[[[[[[[[[[[[[[[[ Count < 0. vb:', this.idx)
//         // console.log('------------- Removing Num_faces from buffer:', num_faces, ' prog:', gfx.prog.idx, ' vb:', gfx.vb.idx)
//         this.needsUpdate = true;

//         //    this.free_vertex_buffer.Add(removedVerticesInfo);

//         return meshTotalAttrCount;

//     }


//     // NOTE: Seeems not to be working. 
//     // UNNECESSARY
//     Shift_geometry(gfx, num_faces, new_num_faces) {

//         const total_new_attribs_count = gfx.attribsPerVertex * gfx.vertsPerRect * new_num_faces;
//         if (this.count + total_new_attribs_count >= this.size) this.Realloc(total_new_attribs_count);
//         const start = gfx.vb.start + (gfx.vb.count * (num_faces + new_num_faces));
//         const end = this.count + total_new_attribs_count;

//         /**
//          * Replace attributes: 
//          *      At: end of the removed mesh
//          *      From: the vertex buffer end going backwards. 
//          * 
//          *      Until: the start of the removed mesh. For the size of the removed mesh
//          */
//         let k = this.count - 1;
//         for (let i = end - 1; i >= start; i--)
//             this.data[i] = this.data[k--]

//         // Remove the old data counts, the whole mesh is gonna be added again to the vertex buffers.
//         const vCount = (gfx.attribsPerVertex * gfx.vertsPerRect * num_faces) / gfx.attribsPerVertex;
//         this.count -= gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;
//         this.vCount -= vCount;
//         this.needsUpdate = true;

//         return total_new_attribs_count;
//     }


//     Realloc(extra_size = 0) {

//         // if (extra_size) this.size += extra_size;
//         // else this.size *= 2;

//         // EFFICIENCY: Can pass an aproximation of all the meshes count (extra_size) from the root caller where the widget is constructed

//         const size = this.#CalculateMemoryPaddedSize(this.size, extra_size)
//         this.size = size;

//         const oldData = this.data;
//         this.data = new Float32Array(this.size);
//         this.#CopyBuffer(oldData)
//         if (DEBUG.GFX.BUFFERS) console.log('Resizing vertex buffer!')
//         if (this.size > 35000) {
//             console.error(this.size, '-------------------------')
//         }
//     }


//     #CalculateMemoryPaddedSize(cur_size, extra_size){

//         let stride = 64;

//         if (cur_size + extra_size < 64 )   { return 64; }
//         if (cur_size + extra_size < 128)   { return 128; }
//         if (cur_size + extra_size < 256)   { return 256; }
//         if (cur_size + extra_size < 512)   { return 512; }
//         // else if (cur_size > 64536) {stride = 0xb;}
//         else if (cur_size > 32768) {stride = 2048;}
//         else if (cur_size > 16384) {stride = 1024;}
//         // else if (cur_size > 8192)  {stride = 2048;}
//         else if (cur_size > 4096)  {stride = 128;}
//         // else if (cur_size > 1024)  {stride = 512;}
//         // else if (cur_size > 512)   {stride = 64;} 
        

//         let new_size = cur_size;
//         const target_size = cur_size + extra_size;
//         while(new_size < target_size){
//             new_size += stride;
//         }
//         // console.warn('stride:', stride, ' cursize:', cur_size, ' newsize:', new_size, ' extra_size:', extra_size)
//         if(new_size % 64) console.error('NOT DIVISIBLE BY 64:', new_size, new_size % 64, stride)

//         new_size += stride; // Make it greater than the target_size
//         return new_size;
//     }


//     #CopyBuffer(oldData) {

//         const size = oldData.length;
//         for (let i = 0; i < size; i++) {
//             this.data[i] = oldData[i];
//         }
//     }


//     SetPrivate() { this.isPrivate = true; }


//     EnableScissorBox() { this.hasScissorBox = true; }


//     SetScissorBox(box = null) {

//         //    /**DEBUG */ if(box === null) alert('Scissor box dimentions should be passed as parameter, but null is passed instead.')
//         //    this.scissorbox[0] = box[0];
//         //    this.scissorbox[1] = VIEWPORT.HEIGHT - box[1];
//         //    this.scissorbox[2] = box[2];
//         //    this.scissorbox[3] = box[3];
//     }

    
//     // Resets (set to 0) the start and counts of the buffer 
//     Reset(start) {
//         // TODO: Implement the recduction of the buffer if it is too big.

//         this.count = 0;
//         this.vCount = 0;
//         this.needsUpdate = true;
//         this.meshesNames = [];
//         this.sidName = '';

//     }


//     ResetToIndex(index=0, verticesPerRect=null, attribsPerVertex=null) {
//         /**DEBUG */ if(verticesPerRect===null || attribsPerVertex===null) console.error('NULL PARAMS PASSED. @VertexBuffer.js, ResetToIndex().');

//         this.count = index;
//         const vcount = index / (verticesPerRect, attribsPerVertex);
//         this.vCount = vcount;
//         this.needsUpdate = true;
//         this.meshesNames = [];

//     }

// };
