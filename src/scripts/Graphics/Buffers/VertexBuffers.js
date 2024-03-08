"use strict";


import { M_Buffer } from "../../Engine/Core/Buffers";
import { Shader_attributes_enable, Shader_attributes_get_attribs, Shader_attributes_get_attribs_per_vertex } from "../ShaderAttributes";
import { Progarm_get_program, Program_get_shader_attributes_index } from "../ShaderPrograms";
import { Create_buffer_from_type } from "./TypedArrayBuffers";
import { Gl_operation_add } from "./VertexBuffersOps";
import { Gl_vertex_array_object_create, Gl_vertex_array_object_get_by_vaoidx } from "./VertexArrays";




const DISABLE_DEBUG = true;


/****************************************************************************************************************************************************/
// Vertex Buffer Data 
/****************************************************************************************************************************************************/


const _vertex_buffers = new M_Buffer();
_vertex_buffers.Init(1);



export function Vertex_buffer_get() { return _vertex_buffers; }



export function Vertex_buffer_get_by_vbidx(vbidx) {
    if(!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers, vbidx, new Error().lineNumber);
    return _vertex_buffers.buffer[vbidx];
}



export function Vertex_buffer_get_attrib_value_from_vb_byidx(vbidx, attr_idx) {
    if(!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers, vbidx, new Error().lineNumber);
    return _vertex_buffers.buffer[vbidx][attr_idx];
}



/** Returns struct: { vbidx:INT, vbo:OBJ } */
export function Vertex_buffer_create(type, size) {

    const ret = {
        vbidx: INT_NULL,
        vbo: INT_NULL, // VBO is stored directly to the vertex buffer class object.
    };

    const vb = Create_buffer_from_type(type, size);
    ret.vbidx = _vertex_buffers.Add(vb);
    ret.vbo = gfxCtx.gl.createBuffer();
    gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, ret.vbo);
    gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb, gfxCtx.gl.STATIC_DRAW, 0);


    return ret;
}




/****************************************************************************************************************************************************/
// Vertex Buffer Info 
/****************************************************************************************************************************************************/


const _vertex_buffers_info = new M_Buffer();



export function Vertex_buffer_info_get() { return _vertex_buffers_info; }



export function Vertex_buffer_info_get_by_vbidx(vbidx) {
    if(!DISABLE_DEBUG) (_vertex_buffers_info, vbidx, new Error().lineNumber);
    return _vertex_buffers_info.buffer[vbidx];
}



export function Gl_vertex_buffer_get_vao(vbidx) {
    return {
        vao:_vertex_buffers_info.buffer[vbidx].vao, 
        vaoidx:_vertex_buffers_info.buffer[vbidx].vaoidx,
    };
}


export function Vertex_buffer_info_create(sid, size = MAX_VERTEX_BUFFER_SIZE, groupidx, progidx) {

    /***********************************************************************************************/
    // Create VAO

    let vaoidx = INT_NULL;

    let new_vao_created = false;
    if (vaoidx === INT_NULL) {
        // Create VAO
        vaoidx = Gl_vertex_array_object_create(sid);
        new_vao_created = true;
        console.warn('################ New VAO created. vaoidx:', vaoidx)
    }
    
    const vao = Gl_vertex_array_object_get_by_vaoidx(vaoidx); // Get VAO
    gfxCtx.gl.bindVertexArray(vao.vao);
    console.log('BIND VAO:', vao)

    

    /***********************************************************************************************/
    // Create vertex buffer

    // const type = vao.type
    const type = BUFFER_TYPE.FLOAT32
    const ret = Vertex_buffer_create(type, size, sid);
    const vb_info = new Vertex_Buffer_Info(size, sid, ret.vbidx, ret.vbo, vaoidx, vao.vao, vao.type);

    _vertex_buffers_info.Add(vb_info);
   
    const vb = _vertex_buffers.buffer[ret.vbidx];
    gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, ret.vbo);
    gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb, gfxCtx.gl.STATIC_DRAW, 0);
    
    const attribsidx = Program_get_shader_attributes_index(groupidx, progidx);
    Shader_attributes_enable(attribsidx)
    console.warn('Create Shader Attributes:')
   
    return vb_info;
}




class Vertex_Buffer_Info {

    constructor(size, sid, vbidx, vbo, vaoidx, vao, type) {

        this.size = size;   // Total size of the typed array buffer (in elements).
        this.count = 0;	    // Current size oof the typed array buffer (in elements)
        this.vCount = 0;    // Number of vertices

        this.vbo = vbo;         // WebGl vertex buffer object.
        this.vbidx = vbidx;     // index to the array of stored vertex buffers.
        this.vao = vao;         // WebGl vertex array object.
        this.vaoidx = vaoidx;   // Index to the array of stored VAO's
        this.texidx = INT_NULL; // index to the array all textures are stored.
        this.ibidx = INT_NULL; // index ref to index buffer this vb uses.
        /*DO NOT DELETE*///this.ib_count = 0;      // Case that the index buffer is shared between vertex buffers, each vb needs to know how many indices the Draw function should access

        this.type = type; // The type of the typed array buffer

        this.state = { mask: 0x0 }; // Gather the state of the vertex buffer info into a bit field
        this.sid = sid;             // Bit field: Shader ID
    }



    // EFFICIENCY: Can pass an aproximation of all the meshes count (extra_size) from the root caller where the widget is constructed
    Realloc(extra_size = 0) {

        this.size = this.#CalculateMemoryPaddedSize(this.size, extra_size);
        const new_data = Create_buffer_from_type(this.type, this.size)

        const old_data = _vertex_buffers.buffer[this.vbidx];
        const size = old_data.length;
        for (let i = 0; i < size; i++) {
            new_data[i] = old_data[i];
        }
        _vertex_buffers.buffer[this.vbidx] = new_data;

        if (DEBUG.GFX.BUFFERS) console.warn('Resizing vertex buffer!')
        if (this.size > 35000) { console.error(this.size, '-------------------------'); }
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
        
        if (new_size % 64) console.error('NOT DIVISIBLE BY 64:', new_size, new_size % 64, stride)

        new_size += stride; // Make it greater than the target_size
        return new_size;
    }

};





/****************************************************************************************************************************************************/
// GETTERS-SETTERS 
/****************************************************************************************************************************************************/


export function Vertex_buffer_set_texidx(vbidx, texidx) {
    _vertex_buffers_info.buffer[vbidx].texidx = texidx;
}



export function Vertex_buffer_set_ibidx(vbidx, ibidx) {
    _vertex_buffers_info.buffer[vbidx].ibidx = ibidx;
}

export function Vertex_buffer_info_get_sid(vbidx){
    if(!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers_info, vbidx, new Error().lineNumber);
    return _vertex_buffers_info.buffer[vbidx].sid;
}



export function Vertex_buffer_state_enable(vbidx, STATE_FLAG) {
    _vertex_buffers_info.buffer[vbidx].state.mask |= STATE_FLAG;
}



export function Vertex_buffer_state_disable(vbidx, STATE_FLAG) {
    _vertex_buffers_info.buffer[vbidx].state.mask &= ~STATE_FLAG;
}



// export function Vertex_buffer_set_vb_data(gl, buffer, attribsidx) {

//     const vb = Vertex_buffer_get_by_vbidx(buffer.vbidx);
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vbo)
//     gl.bufferData(gl.ARRAY_BUFFER, vb, gl.STATIC_DRAW, 0);
//     // gl.bufferData(gl.ARRAY_BUFFER, Vertex_buffer_get_by_vbidx(buffer.vbidx), gl.STATIC_DRAW, 0);
//     Shader_attributes_enable(attribsidx);
    
//     buffer.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

//     GL.BOUND_VBO = buffer.vbo;
//     GL.BOUND_VBIDX = buffer.vbidx;

//     // GL_GET_ERROR(new Error().lineNumber)
// }



// export function Vertex_buffer_set_vb_data(gl, buffer) {

//     const vb = Vertex_buffer_get_by_vbidx(buffer.vbidx);

//     // gl.bindVertexArray(buffer.vao);
//     // gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vbo);
//     // gl.bufferData(gl.ARRAY_BUFFER, vb, gl.STATIC_DRAW, 0);

//     buffer.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

//     GL.BOUND_VBO = buffer.vbo;
//     GL.BOUND_VBIDX = buffer.vbidx;

//     // GL_GET_ERROR(new Error().lineNumber)
// }



export function Vertex_buffer_set_vb_sub_data(gl, buffer, src_offset, dst_offset, byte_length) {

    // gl.bindVertexArray(buffer.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vbo);
    // bufferSubData(target, dstByteOffset, srcData, srcOffset, length)
    gl.bufferSubData(gl.ARRAY_BUFFER, dst_offset, buffer.data, src_offset, byte_length)
    
    buffer.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;
}

/** Returns true/false */
export function Vertex_buffer_exists(vbidx) {

    if(_vertex_buffers.buffer[vbidx] === undefined || _vertex_buffers.buffer[vbidx] === null)
        return false

	return true;
}



export function Vertexbuffer_reset_to_index(groupidx, progidx, vbidx, start) {
    if(!DISABLE_DEBUG) (_vertex_buffers_info, progidx, new Error().lineNumber);

    const vb_info = _vertex_buffers_info.buffer[vbidx];
    if (start < 0 || start > vb_info.count) console.error('Start should be less than vertex buffer count. @VertexBuffers.js, ');
    const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK: Make responsibility for 'VERTS_PER_RECT_INDEXED' OR the program should store the a 'VERTS_PER_RECT_INDEXED'
    const attribsidx = Program_get_shader_attributes_index(groupidx, progidx);
    const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);

    const vCount = (vb_info.count-start) / (vertices_per_rect * attribs_per_vertex);
    vb_info.count = start;
    vb_info.vCount = vCount;
    vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

}




export function Vertex_buffer_reset(gfx) {
    console.error('IMPLEMENT ME');
    const vb = Vertex_buffer_info_get_by_vbidx(gfx.prog.groupidx, gfx.prog.idx, gfx.vb.idx);
    if (vb.count > 0) // If the vertex buffer has data(mainly for recursive functions that call reset even if the vb is already been reseted).
        vb.Reset();
}





function temp_check_nan_rename_me(arr) {
    if (arr.length === 2) {
        if (arr[0] === NaN || arr[1] === NaN) alert('NaN value to gfx buffers')
    }
    if (arr.length === 3) {
        if (arr[0] === NaN || arr[1] === NaN || arr[2] === NaN) alert('NaN value to gfx buffers')
    }
    if (arr.length === 3) {
        if (arr[0] === NaN || arr[1] === NaN || arr[2] === NaN || arr[3] === NaN) alert('NaN value to gfx buffers')
    }
 }



export function Vertex_buffer_add_vertices(gfx, geom, mat, dbg_mesh_name) {


    // console.log(meshidx, dbg_mesh_name)
    /**DEBUG ERROR*/ if (geom.pos[0] === undefined) { console.error('Pos is UNDEFINED. mesh:', dbg_mesh_name) }
    /**DEBUG ERROR*/ if (geom.dim[0] === undefined) { console.error('Dim is UNDEFINED. mesh:', dbg_mesh_name) }
    /**DEBUG ERROR*/ if (mat.col[0] === undefined) { console.error('Col is UNDEFINED. mesh:', dbg_mesh_name) }
    /**DEBUG ERROR*/ if (mat.style[0] === undefined) { console.error('Style is UNDEFINED. mesh:', dbg_mesh_name) }
    /**DEBUG ERROR*/ temp_check_nan_rename_me(geom.pos); temp_check_nan_rename_me(geom.dim); temp_check_nan_rename_me(mat.col); temp_check_nan_rename_me(mat.style);
    // /**DEBUG ERROR*/ if(meshidx === undefined){ console.error('Mesh index is not passed as a param. mesh:', dbg_mesh_name)}

    const groupidx = gfx.prog.groupidx;
    const progidx = gfx.prog.idx;
    const vbidx = gfx.vb.idx;
    const prog = Progarm_get_program(groupidx, progidx);
    const vb_info = Vertex_buffer_info_get_by_vbidx(vbidx);

    const num_faces = 1;
    const start = vb_info.count;
    gfx.vb.start = start;
    const count = gfx.vb.count;
    gfx.vb.end = (start + count) * num_faces;
    vb_info.vCount += VERTS_PER_RECT_INDEXED * num_faces;
    if((vb_info.vCount % 1) !== 0)
    console.error('index buffer count mismatch')


    // Reallocate vertex buffer if it has no more space
    const meshSize = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;
    if (vb_info.count + meshSize >= vb_info.size) vb_info.Realloc(meshSize);
    
    const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
    const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);
    vb_info.count += Gl_operation_add(prog.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, shader_attribs.attribs_per_vertex);

    prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
    vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;


    // Store the texture index in the vertex
    vb_info.texidx = mat.texidx;

    return start;
}



export function Vertex_buffer_add_vertices_from_non_existant_mesh(gfx, geom, mat, dbg_mesh_name) {

    const groupidx = gfx.prog.groupidx;
    const progidx = gfx.prog.idx;
    const vbidx = gfx.vb.idx;
    const prog = Progarm_get_program(groupidx, progidx);
    const vb_info = Vertex_buffer_info_get_by_vbidx(vbidx);

    const num_faces = 1;
    const start = vb_info.count;
    vb_info.vCount += VERTS_PER_RECT_INDEXED * num_faces;


    // Reallocate vertex buffer if it has no more space
    const meshSize = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;
    if (vb_info.count + meshSize >= vb_info.size) vb_info.Realloc(meshSize);
    
    const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
    const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);
    vb_info.count += Gl_operation_add(prog.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, shader_attribs.attribs_per_vertex);

    prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
    vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;


    // Store the texture index in the vertex
    vb_info.texidx = mat.texidx;

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



export function Gl_vertex_buffer_print(){
    console.log('VertexBuffer:', _vertex_buffers)
    console.log('VertexBufferInfo', _vertex_buffers_info)
}