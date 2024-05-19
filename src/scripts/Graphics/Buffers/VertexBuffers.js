"use strict";


import { New_generic_buffer, New_int8_buffer } from "../../Engine/Core/Buffers.js";
import { Shader_attributes_enable, Shader_attributes_get_attribs, Shader_attributes_get_attribs_offset_size, Shader_attributes_get_attribs_per_vertex, Vertex_buffer_create_attribs_info_per_vb_instanced } from "../ShaderAttributes.js";
import { Progarm_get_program, Program_get_shader_attribute_attribs_per_vertex, Program_get_shader_attributes_index } from "../ShaderPrograms.js";
import { Typed_array_create_from_type } from "./TypedArrayBuffers.js";
import { Gl_operation_add, Select_fnidx_to_fill_vertex_buffer } from "./VertexBuffersOps.js";
import { Gl_vertex_array_object_create, Gl_vertex_array_object_get_by_vaoidx } from "./VertexArrays.js";
import { Floor } from "../../Helpers/Math/MathOperations.js";
import { Index_buffer_info_check_has_enough_indices, Index_buffer_info_get_indices_per_face } from "./IndexBuffers.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../Engine/Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Engine/Timers/PerformanceTimers.js";






const NOTIFICATIONS_ON = true;


const DISABLE_DEBUG = true;


/****************************************************************************************************************************************************/
// Vertex Buffer Data Array
/****************************************************************************************************************************************************/


const _vertex_buffers = New_generic_buffer(_, 'GFX Index Buffer');
_vertex_buffers.Init(1);



export function Vertex_buffer_get_Active_count() { return _vertex_buffers.active_count; }



export function Vertex_buffer_get() { return _vertex_buffers; }



export function Vertex_buffer_get_by_vbidx(vbidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers, vbidx, new Error().lineNumber);
    return _vertex_buffers.buffer[vbidx];
}



export function Vertex_buffer_get_attrib_value_from_vb_byidx(vbidx, attr_idx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers, vbidx, new Error().lineNumber);
    return _vertex_buffers.buffer[vbidx][attr_idx];
}



/** Returns struct: { vbidx:INT, vbo:OBJ } */
function Vertex_buffer_create(type, size) {

    const ret = {
        vbidx: INT_NULL,
        vbo: INT_NULL, // VBO is stored directly to the vertex buffer class object.
    };

    const vb = Typed_array_create_from_type(type, size);
    ret.vbidx = _vertex_buffers.Add(vb);
    ret.vbo = gfxCtx.gl.createBuffer();
    gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, ret.vbo);
    gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb, gfxCtx.gl.STATIC_DRAW, 0);


    return ret;
}






















/****************************************************************************************************************************************************/
// Vertex Buffer Info Array
/****************************************************************************************************************************************************/


const _vertex_buffer_groups = New_generic_buffer(_, 'GFX Index Buffer Info');


/****************************************************************************************************************************************************/
// GETTERS-SETTERS 
/****************************************************************************************************************************************************/

export function Vertex_buffer_group_get() { return _vertex_buffer_groups; }



export function Vertex_buffer_group_get_count() {
    return _vertex_buffer_groups.active_count;
}



export function Vertex_buffer_group_get_size() {
    return _vertex_buffer_groups.size;
}



export function Vertex_buffer_group_get_byidx(vb_groupidx) {
    if (!DISABLE_DEBUG) (_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    return _vertex_buffer_groups.buffer[vb_groupidx];
}



export function Gl_vertex_group_buffer_get_vao(vbidx) {
    return {
        vao: _vertex_buffer_groups.buffer[vbidx].vao,
        vaoidx: _vertex_buffer_groups.buffer[vbidx].vaoidx,
    };
}



export function Vertex_buffer_group_get_render_queueidx(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].render_queueidx;
}



export function Vertex_buffer_group_get_sid(vb_groupidx){
    return _vertex_buffer_groups.buffer[vb_groupidx].sid
}



export function Vertex_buffer_group_set_texidx(vbidx, texidx) {
    _vertex_buffer_groups.buffer[vbidx].texidx = texidx;
}



export function Vertex_buffer_group_set_ibidx(vb_groupidx, ibidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].ibidx = ibidx;
}



export function Vertex_buffer_group_set_render_queueidx(vb_groupidx, render_queueidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].render_queueidx = render_queueidx;
}


/*************************************************************************************************************************/
export function Vertex_buffer_group_get_vbs(vb_groupidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    return _vertex_buffer_groups.buffer[vb_groupidx].vbs;
}
export function Vertex_buffer_group_get_vb(vb_groupidx, vbidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    return _vertex_buffer_groups.buffer[vb_groupidx].vbs[vbidx];
}
export function Vertex_buffer_group_copy_vbs(vb_groupidx, buffer) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    const len = _vertex_buffer_groups.buffer[vb_groupidx].vbs.length;
    for(let i=0; i < len; i++){
        buffer[i] = _vertex_buffer_groups.buffer[vb_groupidx].vbs[i];
    }
    return buffer;
}
export function Vertex_buffer_group_get_vbidxs(vb_groupidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);

    const buffer = [];
    const len = _vertex_buffer_groups.buffer[vb_groupidx].vbs.length;
    for(let i=0; i < len; i++){
        buffer[i] = _vertex_buffer_groups.buffer[vb_groupidx].vbs[i].vbidx;
    }
    return buffer;
}



class Vertex_Buffer_Info {

    constructor(size, vbo, vbidx, type, sid){

        this.sid = sid;     // Bit field: Shader ID. Specific to this buffer
        this.state = { mask: BUFFER_STATE.IS_ACTIVE }; // SEE: 'BUFFER_STATE'. Gather the state of the vertex buffer info into a bit field
        this.size = size;   // Total size of the typed array buffer (in elements).
        this.count = 0;	    // Current size oof the typed array buffer (in elements)
        this.vCount = 0;    // Number of vertices
        this.vbo = vbo;     // WebGl vertex buffer object.
        this.vbidx = vbidx; // index to the array of stored vertex buffers.
        this.type = type;   // The type of the typed array buffer

        this.attribs_info = {
            count: 0,
            offsets: New_int8_buffer(),
        }

        this.add_to_vb_fnidx = null; // Function pointer. Each vertex buffer has a function that knows how to add attributes to the buffer
    }

    SetAddFn(attribsidx, attr, inst){
        this.add_to_vb_fnidx = Select_fnidx_to_fill_vertex_buffer(attribsidx, attr, inst);
    }

}

class Vertex_Buffer_Group {
    
    constructor(progidx, vaoidx, vao, sid) {
        
        this.sid = sid;             // Bit field: Shader ID
        this.progidx = progidx;     // Just for debuging.
        this.vao = vao;             // WebGl vertex array object.
        this.vaoidx = vaoidx;       // Index to the array of stored VAO's
        this.texidx = INT_NULL;     // index to the array all textures are stored.
        this.ibidx = INT_NULL;      // index ref to index buffer this vb uses.
        this.draw_count = 0;
        this.vertices_per_face = 4; // HACK: How vertex buffer should conclude the vertices per face ????????????????
        this.idx = INT_NULL;        // Self index to the '_vertex_buffer_groups' buffer
        this.needs_any_update = false; // 
        
        this.render_queueidx = INT_NULL; // index to the Render queue buffer of the current vb 

        this.vbs = [];
    }


    CreateBuffer(size, vbo, vbidx, type, sid){
        
        const vb = new Vertex_Buffer_Info(size, vbo, vbidx, type, sid);
        const idx = this.vbs.push(vb);
        this.count++;

        return idx-1;
    }


    SetAddFnForVb(attribsidx, idx, attr, inst){
        this.vbs[idx].SetAddFn(attribsidx, attr, inst);
    }


    // EFFICIENCY: Can pass an aproximation of all the meshes count (extra_size) from the root caller where the widget is constructed
    Realloc(extra_size = 0) {

        this.size = this.#CalculateMemoryPaddedSize(this.size, extra_size);
        const new_data = Typed_array_create_from_type(this.type, this.size)

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






export function Vertex_buffer_state_enable(vb_grouidx, vbidx, STATE_FLAG) {
    _vertex_buffer_groups.buffer[vb_grouidx].vbs[vbidx].state.mask |= STATE_FLAG;
    _vertex_buffer_groups.buffer[vb_grouidx].needs_any_update = true; // Set the groups needs update, so we don't have to check all vertex buffers if none needs update
}




export function Vertex_buffer_group_state_enable(vb_grouidx, STATE_FLAG) {

    const len = _vertex_buffer_groups.buffer[vb_grouidx].vbs.length;
    for(let i=0; i < len; i++){
        _vertex_buffer_groups.buffer[vb_grouidx].vbs[i].state.mask |= STATE_FLAG;
        _vertex_buffer_groups.buffer[vb_grouidx].needs_any_update = true; // Set the groups needs update, so we don't have to check all vertex buffers if none needs update
    }
}




export function Vertex_buffer_state_disable(vb_grouidx, STATE_FLAG) {
    const len = _vertex_buffer_groups.buffer[vb_grouidx].vbs.length;
    for(let i=0; i < len; i++){
        _vertex_buffer_groups.buffer[vb_grouidx].vbs[i].state.mask &= ~STATE_FLAG;
        _vertex_buffer_groups.buffer[vb_grouidx].needs_any_update = true; // Set the groups needs update, so we don't have to check all vertex buffers if none needs update
    }
}



export function Vertex_buffer_set_vb_sub_data(gl, buffer, src_offset, dst_offset, byte_length) {

    // gl.bindVertexArray(buffer.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vbo);
    // bufferSubData(target, dstByteOffset, srcData, srcOffset, length)
    gl.bufferSubData(gl.ARRAY_BUFFER, dst_offset, buffer.data, src_offset, byte_length)

    buffer.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;
}



export function Vertex_buffer_group_create(sid, size = MAX_VERTEX_BUFFER_SIZE, progidx) {

    /***********************************************************************************************/
    // Create VAO

    let vaoidx = INT_NULL;

    if (vaoidx === INT_NULL) {
        vaoidx = Gl_vertex_array_object_create(sid);
    }

    const vao = Gl_vertex_array_object_get_by_vaoidx(vaoidx); // Get VAO
    gfxCtx.gl.bindVertexArray(vao.vao);



    /***********************************************************************************************/
    // Create vertex buffer
    
    // HERE: we muust create all vertex buffers for all dif kind of attribute combinations: Instanced/PerVertex 
    
    
    
    const vb_group = new Vertex_Buffer_Group(progidx, vaoidx, vao.vao, sid);
    
    const attribsidx = Program_get_shader_attributes_index(progidx);
    if(sid.inst){
        
        const type = BUFFER_TYPE.FLOAT32;
        const ret = Vertex_buffer_create(type, size);
        const vbinfoidx = vb_group.CreateBuffer(size, ret.vbo, ret.vbidx, ret.type, sid.inst);

        // Set the add function for the vertex buffer
        vb_group.SetAddFnForVb(attribsidx, vbinfoidx, 0x0, sid.inst);
        
        const attrib_divisor = 1; // run per instance
        // Calculate the attributes info for the attributes this vertex buffer represents
        vb_group.vbs[vbinfoidx].attribs_info = Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid.inst, attrib_divisor);
        
        const vb = _vertex_buffers.buffer[ret.vbidx];
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, ret.vbo);
        gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb, gfxCtx.gl.STATIC_DRAW, 0);
        
        Shader_attributes_enable(attribsidx, vb_group.vbs[vbinfoidx].attribs_info)
        // if (NOTIFICATIONS_ON)
            // Notifications_send(NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, ret.vbidx);
        
    }
    
    if(sid.attr){
        
        const type = BUFFER_TYPE.FLOAT32;
        const ret = Vertex_buffer_create(type, size);
        const vbinfoidx = vb_group.CreateBuffer(size, ret.vbo, ret.vbidx, ret.type, sid.attr & ~sid.inst);

        // Set the add function for the vertex buffer
        vb_group.SetAddFnForVb(attribsidx, vbinfoidx, sid.attr & ~sid.inst, 0x0);

        const attrib_divisor = 0; // run per instance
        // Calculate the attributes info for the attributes this vertex buffer represents
        vb_group.vbs[vbinfoidx].attribs_info = Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid.attr & ~sid.inst, attrib_divisor);
        
        const vb = _vertex_buffers.buffer[ret.vbidx];
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, ret.vbo);
        gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb, gfxCtx.gl.STATIC_DRAW, 0);
        
        Shader_attributes_enable(attribsidx, vb_group.vbs[vbinfoidx].attribs_info)
        // if (NOTIFICATIONS_ON)
        //     Notifications_send(NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, ret.vbidx);
    }




    const vbgroupidx = _vertex_buffer_groups.Add(vb_group);
    vb_group.idx = vbgroupidx;




    return vb_group;
}



/** Returns true/false */
export function Vertex_buffer_exists_from_index(vbidx) {

    if (_vertex_buffers.buffer[vbidx] === undefined || _vertex_buffers.buffer[vbidx] === null)
        return false

    return true;
}



export function Vertex_buffer_reset_to_index(progidx, vbidx, start) {
    if (!DISABLE_DEBUG) (_vertex_buffer_groups, progidx, new Error().lineNumber);

    const vb_info = _vertex_buffer_groups.buffer[vbidx];
    if (start < 0 || start > vb_info.count) console.error('Start should be less than vertex buffer count. @VertexBuffers.js, ');

    const attribsidx = Program_get_shader_attributes_index(progidx);
    const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);

    const vCount = start ? start / attribs_per_vertex : 0;
    vb_info.count = start;
    vb_info.vCount = vCount;
    vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

    const indices_per_face = Index_buffer_info_get_indices_per_face(vb_info.ibidx);
    const num_faces = vb_info.count / (vb_info.vertices_per_face * attribs_per_vertex);
    vb_info.draw_count = num_faces * indices_per_face;

    vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

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



/**
 * // TODO:
 * The index buffer pattern ({123, 234} or fan{12,13,14,15})
 * probably will be dectating the vertex buffer build function,
 * as to how the attributes of a mesh(pos, dim, ...)
 * are gonna be stored inside the veertex buffer.
 */
export function Vertex_buffer_add_vertices(gfx, geom, mat, dbg_mesh_name) {


    // console.log(meshidx, dbg_mesh_name)
    // /**DEBUG ERROR*/ if (geom.pos[0] === undefined) { console.error('Pos is UNDEFINED. mesh:', dbg_mesh_name) }
    // /**DEBUG ERROR*/ if (geom.dim[0] === undefined) { console.error('Dim is UNDEFINED. mesh:', dbg_mesh_name) }
    // /**DEBUG ERROR*/ if (mat.col[0] === undefined) { console.error('Col is UNDEFINED. mesh:', dbg_mesh_name) }
    // /**DEBUG ERROR*/ if (mat.style[0] === undefined) { console.error('Style is UNDEFINED. mesh:', dbg_mesh_name) }
    // /**DEBUG ERROR*/ temp_check_nan_rename_me(geom.pos); temp_check_nan_rename_me(geom.dim); temp_check_nan_rename_me(mat.col); temp_check_nan_rename_me(mat.style);
    // /**DEBUG ERROR*/ if(meshidx === undefined){ console.error('Mesh index is not passed as a param. mesh:', dbg_mesh_name)}

    const progidx = gfx.prog.idx;
    const vb_groupidx = gfx.vb.groupidx;
    const prog = Progarm_get_program(progidx);
    const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);
    
    const num_faces = 1;
    
    // Run for every vertex buffer of the group.
    const len = vb_group.vbs.length;
    for(let i=0; i < len; i++){
        
        const vb_info = vb_group.vbs[i];

        const start = vb_info.count;
        gfx.vb.starts.buffer[i] = start;
        const count = gfx.vb.counts.buffer[i];
        // gfx.vb.end = (start + count) * num_faces;
        vb_info.vCount += VERTS_PER_RECT_INDEXED * num_faces;
    
        if ((vb_info.vCount % 1) !== 0)
            console.error('index buffer count mismatch')
    
    
        // Reallocate vertex buffer if it has no more space
        const meshSize = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;
        if (vb_info.count + meshSize >= vb_info.size) vb_info.Realloc(meshSize);
    
        const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
        const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);
        
        vb_info.count += Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, shader_attribs.attribs_per_vertex);

    
        prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
        vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
        vb_group.needs_any_update = true;
    
    
        // Store the texture index in the vertex
        vb_info.texidx = mat.texidx;
    

    
    }
    
    // Update the draw count
    let draw_count = vb_group.vCount; // This is seting draw_count without 'INDEXED' vertex shader 
    if (vb_group.sid.shad & SID.SHAD.INDEXED) { // If vertex shader is 'INDEXED', then re-assign the draw_count
        
        draw_count = num_faces * INDICES_PER_RECT; // HACK: Later the 'INDICES_PER_RECT' must be abstracted in the vertex buffer OR the program.
        
        // Check if index buffer has enough indices to cover the max of any vertex buffer that it represents.
        Index_buffer_info_check_has_enough_indices(gfx.ib.idx, vb_group.draw_count, num_faces);
    }
    vb_group.draw_count += draw_count;


    // return start;
}



// The differce from 'Vertex_buffer_add_vertices' is that it doesn't update the vb.start of the param gfx 
export function Vertex_buffer_add_vertices_from_non_existant_mesh(gfx, geom, mat, dbg_mesh_name) {


    const progidx = gfx.prog.idx;
    const vbidx = gfx.vb.idx;
    const prog = Progarm_get_program(progidx);
    const vb_info = Vertex_buffer_group_get_byidx(vbidx);

    const num_faces = 1;
    const start = vb_info.count;
    vb_info.vCount += VERTS_PER_RECT_INDEXED * num_faces;


    // Reallocate vertex buffer if it has no more space
    const meshSize = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;
    if (vb_info.count + meshSize >= vb_info.size) vb_info.Realloc(meshSize);

    const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
    const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);

    // Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest3)
    vb_info.count += Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, shader_attribs.attribs_per_vertex);
    // Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest3)

    prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
    vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;


    // Store the texture index in the vertex
    vb_info.texidx = mat.texidx;

    // Update the draw count
    let draw_count = vb_info.vCount; // This is seting draw_count without 'INDEXED' vertex shader 
    if (vb_info.sid.shad & SID.SHAD.INDEXED) { // If vertex shader is 'INDEXED', then re-assign the draw_count

        draw_count = num_faces * INDICES_PER_RECT; // HACK: Later the 'INDICES_PER_RECT' must be abstracted in the vertex buffer OR the program.

        // Check if index buffer has enough indices to cover the max of any vertex buffer that it represents.
        Index_buffer_info_check_has_enough_indices(gfx.ib.idx, vb_info.draw_count, num_faces);
    }

    vb_info.draw_count += draw_count;

    return start;
}



export function Vertex_buffer_update_vertices(gfx, geom, mat, dbg_mesh_name) {

    const progidx = gfx.prog.idx;
    const vbidx = gfx.vb.idx;
    const prog = Progarm_get_program(progidx);
    const vb_info = Vertex_buffer_group_get_byidx(vbidx);

    const num_faces = 1;
    const start = gfx.vb.start;

    if ((vb_info.vCount % 1) !== 0)
        console.error('index buffer count mismatch')


    const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
    const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);


    Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, shader_attribs.attribs_per_vertex);

    vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

}



export function Vertex_buffer_update_vertices_Expicit_Params(progidx, vbidx, start, geom, mat) {

    const prog = Progarm_get_program(progidx);
    const vb_info = Vertex_buffer_group_get_byidx(vbidx);

    const num_faces = 1;

    if ((vb_info.vCount % 1) !== 0)
        console.error('index buffer count mismatch')


    const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
    const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);


    Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, shader_attribs.attribs_per_vertex);

    vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

}


export function Vertex_buffer_remove_geometry(gfx, num_faces, start_index, remove_and_shift, debug_mesh) {


    const vb_info = _vertex_buffer_groups.buffer[gfx.vb.idx];

    const removed_attribs = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;

    let start = start_index;
    const end = start + removed_attribs;


    // Shift all attributes left to fil the gap of the removed attributes. 
    const vb_data = _vertex_buffers.buffer[gfx.vb.idx];
    for (let i = end; i < vb_info.count; i++) {
        vb_data[start++] = vb_data[i]
    }

    vb_info.count -= removed_attribs;
    const vCount = removed_attribs / gfx.attribsPerVertex;
    vb_info.vCount -= vCount;

    if (vb_info.count < 0){

        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!',
               'vbidx', gfx.vb.idx,
               'mesh', debug_mesh.mesh_bufferidx,
               'num_faces', num_faces,
               'count', gfx.vb.count * num_faces,
               'vb: count', vb_info.count,
        );
    }
    // if (vb_info.count < 0) return true




    const indices_per_face = Index_buffer_info_get_indices_per_face(vb_info.ibidx);
    vb_info.draw_count -= num_faces * indices_per_face;

    // POTENTIAL_BUG: If the buffer is empty MUST be updated!!!
    // TODO: If The buffer is not used, by deactivating it below, then we need to update the render queue
    // Set inactive 
    if (vb_info.count === 0) {

        vb_info.state.mask &= ~BUFFER_STATE.IS_ACTIVE
    }
    else vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;




    return false
    return removed_attribs;
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



export function Gl_vertex_buffer_print() {
    console.log('VertexBuffer:', _vertex_buffers)
    console.log('VertexBufferInfo', _vertex_buffer_groups)
}






















_CNT = 0x1;
const VB_TO_STRING_FLAGS = {
    COLOR: _CNT,
    WPOS: _CNT <<= 0x1,
    DIM: _CNT <<= 0x1,
    TEX: _CNT <<= 0x1,
}

function Vertex_to_string(flags, progidx, vbidx, count) {

    const is_wpos = flags & VB_TO_STRING_FLAGS.WPOS;

    const attribsidx = Program_get_shader_attributes_index(progidx);
    const stride = Program_get_shader_attribute_attribs_per_vertex(progidx);
    const wpos_attr = Shader_attributes_get_attribs_offset_size(attribsidx, SHADER_ATTRIBUTES.WPOS_TIME4);

    const arr = [];
    const faces = count / (stride * 4);

    for (let i2 = 0; i2 < faces; i2++) {

        let i = wpos_attr.offset;
        let wpos = '';
        while (i < stride * 4) {

            if (is_wpos) {

                wpos += `${Floor(_vertex_buffers.buffer[vbidx][i++])}, `;
                wpos += `${Floor(_vertex_buffers.buffer[vbidx][i++])}, `;
            }

            i += stride - 2;
        }

        // const copy = Object.assign({}, wpos);
        const copy = JSON.parse(JSON.stringify(wpos));
        arr.push(copy);
        console.log(copy)
    }

    // console.log(arr)
    return arr;
}




















