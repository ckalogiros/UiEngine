"use strict";


import { New_generic_buffer, New_int8_buffer } from "../../Engine/Core/Buffers.js";
import { Shader_attributes_enable, Shader_attributes_get_attribs_per_vertex, Vertex_buffer_create_attribs_info_per_vb_instanced } from "../ShaderAttributes.js";
import { Progarm_get_program, Program_get_shader_attributes_index, Program_use_program2 } from "../ShaderPrograms.js";
import { Typed_array_create_from_type } from "./TypedArrayBuffersInterface.js";
import { Gl_vertex_array_object_create, Gl_vertex_array_object_get_by_vaoidx } from "./VertexArrays.js";
import { Floor } from "../../Helpers/Math/MathOperations.js";
import { Index_buffer_add_indices_from_render_group, Index_buffer_build_indices_from_render_group, Index_buffer_info_check_has_enough_indices, Index_buffer_info_get_indices_per_face } from "./IndexBuffers.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../Engine/Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Uniforms_buffer_set_uniform_val_from_index, Uniforms_buffer_update_uniform } from "./UniformBuffers.js";
import { Gl_operation_add, Select_fnidx_to_fill_vertex_buffer } from "./VertexBufferFillOps.js";
import { Renderqueue_set_active } from "../../Engine/Renderers/Renderer/RenderQueue.js";
import { Mesh_buffer_get_mesh_byidx, Mesh_buffer_get_mesh_num_faces } from "../../Engine/Core/MeshBuffer.js";
import { Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Mesh_get_real_pos_x, Mesh_get_real_pos_y } from "../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Vertex_buffer_render_group_get_render_group } from "./RenderGroups.js";






const NOTIFICATIONS_ON = true;


const DISABLE_DEBUG = true;


const MAX_RENDER_GROUP_PER_VB = 8;




// TODO: The VAO must be created per Program and not per Vertex buffer
/** */
export function Vertex_buffer_create(sid, size = MAX_VERTEX_BUFFER_SIZE, progidx, IS_PRIVATE) {

    /***********************************************************************************************/
    // Create VAO

    let vaoidx = INT_NULL;

    // vaoidx = Gl_vertex_array_object_find_compatible(sid);
    if (vaoidx === INT_NULL) {
        vaoidx = Gl_vertex_array_object_create(sid);
    }

    const vao = Gl_vertex_array_object_get_by_vaoidx(vaoidx); // Get VAO
    gfxCtx.gl.bindVertexArray(vao.vao);


    const attribsidx = Program_get_shader_attributes_index(progidx);
    
    let attrib_divisor = 0;
    let ret = null;

    if (sid.inst) {
        attrib_divisor = 1;
        ret = Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid.inst, attrib_divisor, progidx);
    }
    if (sid.attr) {
        attrib_divisor = 0;
        ret = Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid.attr & ~sid.inst, attrib_divisor, progidx);
    }

    const calibrated_size = Floor(size / ret.attribs_info.count) * ret.attribs_info.count;

    // Create vertex buffer group
    const vb_group = new Vertex_Buffer_Group(progidx, vaoidx, vao.vao, sid, calibrated_size);
    vb_group.state.mask |= IS_PRIVATE;

    if (sid.inst) {

        const type = BUFFER_TYPE.FLOAT32;

        // Create vertex buffer data
        const vb_buffer = Typed_array_create_from_type(type, calibrated_size);
        const vbo = gfxCtx.gl.createBuffer();
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vbo);
        gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb_buffer, gfxCtx.gl.STATIC_DRAW, 0);
        const vbidx = _vertex_buffers_data.Add(vb_buffer);

        // Create vertex buffer info
        const vbinfo = new Vertex_Buffer_Info(calibrated_size, vbo, vbidx, type, sid.inst);
        vbinfo.SetAddFn(attribsidx, 0x0, sid.inst);
        const vb_infoidx = _vertex_buffer_infos.Add(vbinfo);

        // Calculate the attributes info specific for the attributes of this vertex buffer.
        vbinfo.attribs_info = ret.attribs_info;
        vbinfo.attribs_indexing = ret.attribs_indexing;


        Shader_attributes_enable(attribsidx, attrib_divisor, vbinfo.attribs_info, vbidx)

        // Store the vbidx to the group
        vb_group.vb_idxs.Add(vbidx);

        if (vbidx !== vb_infoidx) alert('vbidx !== vb_infoidx\nAt Vertex_buffer_create()\nAt VertexBuffers.js')

    }
    if (sid.attr) {

        const type = BUFFER_TYPE.FLOAT32;


        // Create vertex buffer data
        const vb_buffer = Typed_array_create_from_type(type, calibrated_size);
        const vbo = gfxCtx.gl.createBuffer();
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vbo);
        gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb_buffer, gfxCtx.gl.STATIC_DRAW, 0);
        const vbidx = _vertex_buffers_data.Add(vb_buffer);

        // Create vertex buffer info
        const vbinfo = new Vertex_Buffer_Info(calibrated_size, vbo, vbidx, type, sid.attr & ~sid.inst);
        vbinfo.SetAddFn(attribsidx, sid.attr & ~sid.inst, 0x0);
        const vb_infoidx = _vertex_buffer_infos.Add(vbinfo);

        // Calculate the attributes info specific for the attributes of this vertex buffer.
        vbinfo.attribs_info = ret.attribs_info;
        vbinfo.attribs_indexing = ret.attribs_indexing;

        Shader_attributes_enable(attribsidx, attrib_divisor, vbinfo.attribs_info, vbidx);

        // Store the vbidx to the group
        vb_group.vb_idxs.Add(vbidx);

        if (vbidx !== vb_infoidx) alert('vbidx !== vb_infoidx\nAt Vertex_buffer_create()\nAt VertexBuffers.js')

    }



    const vb_groupidx = _vertex_buffer_groups.Add(vb_group);
    vb_group.idx = vb_groupidx;


    if (NOTIFICATIONS_ON)
        Notifications_send(NOTIFICATION_TYPE.VERTEX_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, vb_groupidx);


    return vb_group;
}


















































/****************************************************************************************************************************************************/
/****************************************************************************************************************************************************/
/********************************************************** Vertex Buffer Data  *********************************************************************/
/****************************************************************************************************************************************************/
/****************************************************************************************************************************************************/

/** */
const _vertex_buffers_data = New_generic_buffer(_, 'GFX Index Buffer');


/** */
export function Vertex_buffer_reset_full() {
    Vertex_buffer_info_gl_destroy(gfxCtx.gl);
    _vertex_buffers_data.ResetFull();
}
/** */
export function Vertex_buffer_get_Active_count() { return _vertex_buffers_data.active_count; }
/** */
export function Vertex_buffer_get() { return _vertex_buffers_data; }
/** */
export function Vertex_buffer_get_by_vbidx(vbidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers_data, vbidx, new Error().lineNumber);
    return _vertex_buffers_data.buffer[vbidx];
}











































/****************************************************************************************************************************************************/
/****************************************************************************************************************************************************/
/********************************************************** Vertex Buffer Info  *********************************************************************/
/****************************************************************************************************************************************************/
/****************************************************************************************************************************************************/

// Vb info describes a '_vertex_buffers_data'. One info for every '_vertex_buffers_data'.

/** */
class Vertex_Buffer_Info {

    constructor(size, vbo, vbidx, type, sid) {

        this.sid = sid;     // Bit field: Shader ID. Specific to this buffer
        this.state = { mask: BUFFER_STATE.IS_ACTIVE }; // SEE: 'BUFFER_STATE'. Gather the state of the vertex buffer info into a bit field
        this.size = size;   // Total size of the typed array buffer (in elements).
        this.count = 0;	    // Current size of the typed array buffer (in elements)
        this.vCount = 0;    // Number of vertices
        this.vbo = vbo;     // WebGl vertex buffer object.
        this.vbidx = vbidx; // index to the array of stored vertex buffers.
        this.type = type;   // The type of the typed array buffer

        this.attribs_info = null; // TODO: create a local object, instead of a refference
        this.attribs_indexing = null;

        this.add_to_vb_fnidx = null; // Function pointer. Each vertex buffer has a function that knows how to add attributes to the buffer

    }

    SetAddFn(attribsidx, attr, inst) {
        this.add_to_vb_fnidx = Select_fnidx_to_fill_vertex_buffer(attribsidx, attr, inst);
        // alert(`${this.add_to_vb_fnidx} \n0000`)
    }


    Realloc(extra_size = 0) {

        const new_size = this.#CalculateMemoryPaddedSize(this.count, extra_size);
        // const size_dif = new_size - this.size;
        this.size = new_size + this.size;

        const new_data = Typed_array_create_from_type(this.type, this.size);

        const old_data = _vertex_buffers_data.buffer[this.vbidx];
        new_data.set(old_data, 0);
        // const size = old_data.length;
        // for (let i = 0; i < size; i++) {
        //     new_data[i] = old_data[i];
        //     // console.log(
        //     //     'i', i,
        //     //     'new_data[i]', new_data[i],
        //     // )
        // }
        _vertex_buffers_data.buffer[this.vbidx] = new_data;

        if (DEBUG.GFX.BUFFERS) console.warn('Resizing vertex buffer!');
        // return size_dif;
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

        // if (new_size % 64) console.error('NOT DIVISIBLE BY 64:', new_size, new_size % 64, stride)

        new_size += stride; // Make it greater than the target_size
        return new_size;
    }


}

const _vertex_buffer_infos = New_generic_buffer(_, 'GFX Vertex Buffer Infos');

/** */
export function Vertex_buffer_info_reset() {
    Gl_vertex_buffer_group_vbo_delete_all();
    _vertex_buffer_infos.ResetFull();
}

// TODO: Abstarct to a file VertexBufferObject.js
/** */
function Gl_vertex_buffer_group_vbo_delete_all() {

    for (let i = 0; i <= _vertex_buffer_infos.boundary; i++) {

        const vbo = _vertex_buffer_infos.buffer[i].vbo;
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, null);
        gfxCtx.gl.deleteBuffer(vbo);
    }
}
/** */
export function VBI_get_vbo(vb_info_idx) {
    return _vertex_buffer_infos.buffer[vb_info_idx].vbo;
}

/** */
export function VBI_get_byidx(vb_info_idx) {
    // TODO: Check for valid buffer element
    return _vertex_buffer_infos.buffer[vb_info_idx];
}
/** */
function Vertex_buffer_info_gl_destroy(gl) {
    for (let i = 0; i <= _vertex_buffer_infos.boundary; i++) {
        gl.deleteBuffer(_vertex_buffer_infos.buffer[i].vbo);
    }
}



















/****************************************************************************************************************************************************/
/****************************************************************************************************************************************************/
/********************************************************  Vertex Buffer Group  *********************************************************************/
/****************************************************************************************************************************************************/
/****************************************************************************************************************************************************/

// A group defines a set of vertex buffers that render a particular mesh/meshes (vb's are separated by attributes of that mesh)


/** */
class Vertex_Buffer_Group {

    constructor(progidx, vaoidx, vao, sid, size) {

        this.state = { mask: BUFFER_STATE.IS_ACTIVE };
        this.sid = sid;             // Bit field: Shader ID
        this.progidx = progidx;     // Just for debuging.
        this.vao = vao;             // WebGl vertex array object.
        this.vaoidx = vaoidx;       // Index to the array of stored VAO's
        this.texidx = INT_NULL;     // webGl texture index.
        this.ibidx = INT_NULL;      // index ref to index buffer this vb uses.
        // this.draw_count = 0;
        this.vertices_per_face = (sid.shad & SID.SHAD.INDEXED) ? VERTS_PER_RECT_INDEXED : VERTS_PER_RECT;
        this.idx = INT_NULL;        // Self index to the '_vertex_buffer_groups' buffer
        this.needs_any_update = false; // 

        this.has_scissorbox = false;
        this.scissorbox = [0, 0, 0, 0];
        this.scissorbox_meshidx = new Int16Array([INT_NULL, INT_NULL, INT_NULL, INT_NULL]); // Store the mesh index for retrieving scissorbox values

        this.render_queueidx = INT_NULL; // index to the Render queue buffer of the current vb 

        this.vb_idxs = New_int8_buffer(_, 'NEW VertexBufferGroup-VBIDXS');

        this.uniform_bindings = New_generic_buffer(_, 'uniform_bindings');

        // NOTE: If this VB group has instanced geometry, so more than 1 vertex buffers are allocated, then the render_groups that are active are valid for all instanced vertex buffers. In other words a render buffer must run for each instanced buffer
        this.render_groupidxs = New_int8_buffer(MAX_RENDER_GROUP_PER_VB, 'vertex_buffer_group::render_groupidxs');


    }

    CreateScissorBoxByMeshIdx(mx, my, mw, mh) {
        this.scissorbox_meshidx[0] = mx;
        this.scissorbox_meshidx[1] = my;
        this.scissorbox_meshidx[2] = mw;
        this.scissorbox_meshidx[3] = mh;
        this.has_scissorbox = true;
    }
    
    SetScissorBox(x=null, y=null, w=null, h=null) {
        if(x !== null) this.scissorbox[0] = x;
        if(x !== null) this.scissorbox[1] = y;
        if(x !== null) this.scissorbox[2] = w;
        if(x !== null) this.scissorbox[3] = h;
        this.has_scissorbox = true;
    }
    
    ResetScissorBox() {
        this.scissorbox[0] = 0;
        this.scissorbox[1] = 0;
        this.scissorbox[2] = 0;
        this.scissorbox[3] = 0;
        this.scissorbox_meshidx[0] = INT_NULL;
        this.scissorbox_meshidx[1] = INT_NULL;
        this.scissorbox_meshidx[2] = INT_NULL;
        this.scissorbox_meshidx[3] = INT_NULL;
        this.has_scissorbox = false;
    }
}

/** */
const _vertex_buffer_groups = New_generic_buffer(_, 'GFX Vertex Buffer Groups');

/** */
export function Vertex_buffer_group_reset() {
    Gl_vertex_buffer_group_vbo_delete_all()
    _vertex_buffer_groups.ResetFull();
}
/** */
export function Vertex_buffer_group_get_shader_attributes_index(vb_groupidx) {
    const progidx = _vertex_buffer_groups.buffer[vb_groupidx].progidx;
    const attribsidx = Program_get_shader_attributes_index(progidx);
    return attribsidx;
}
/** */
export function Vertex_buffer_group_store_render_groupidx(vb_groupidx, render_groupidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].render_groupidxs.Add(render_groupidx);
    // console.log('VB ASSIGN RG', render_groupidx, _vertex_buffer_groups.buffer[vb_groupidx].render_groupidxs.buffer)
}



/****************************************************************************************************************************************************/
// GETTERS-SETTERS 
/****************************************************************************************************************************************************/
/** */
export function Vertex_buffer_group_get() { return _vertex_buffer_groups; }
/** */
export function Vertex_buffer_group_get_count() {
    return _vertex_buffer_groups.active_count;
}
/** */
export function Vertex_buffer_group_get_size() {
    return _vertex_buffer_groups.size;
}
/** */
export function Vertex_buffer_group_get_vertices_per_face(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].vertices_per_face;
}
/** */
export function Vertex_buffer_group_get_attributes_per_vertex(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].attribs_info.count;
}
/** */
export function Vertex_buffer_group_get_attributes_per_face(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].vertices_per_face * _vertex_buffer_infos.buffer[vb_groupidx].attribs_info.count;
}
/** */
export function Vertex_buffer_group_get_render_groupidxs(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].render_groupidxs;
}
/** */
export function Vertex_buffer_set_name_for_debuging(vb_groupidx, name) {
    if (!DISABLE_DEBUG) (_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    _vertex_buffer_groups.buffer[vb_groupidx].name = name;
}
/** */
export function Vertex_buffer_group_get_byidx(vb_groupidx) {
    if (!DISABLE_DEBUG) (_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    return _vertex_buffer_groups.buffer[vb_groupidx];
}
/** */
export function Vertex_buffer_group_get_progidx(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].progidx;
}
/** */
export function Vertex_buffer_group_get_render_queueidx(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].render_queueidx;
}
/** */
export function Vertex_buffer_group_get_sid(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].sid
}
/** */
export function Vertex_buffer_group_set_texidx(vb_groupidx, texidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].texidx = texidx;
}
/** */
export function Vertex_buffer_group_set_mesh_debug_name(vb_groupidx, name) {
    _vertex_buffer_groups.buffer[vb_groupidx].name = name;
}
/** */
export function Vertex_buffer_group_get_texidx(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].texidx;
}
/** */
export function Vertex_buffer_group_set_ibidx(vb_groupidx, ibidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].ibidx = ibidx;
}
/** */
export function Vertex_buffer_group_set_render_queueidx(vb_groupidx, render_queueidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].render_queueidx = render_queueidx;
}
/** */
export function Vertex_buffer_group_get_vbidxs(vb_groupidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);

    return _vertex_buffer_groups.buffer[vb_groupidx].vb_idxs;
}
/** */
export function Vertex_buffer_state_enable(vb_groupidx, vbidx, STATE_FLAG) {
    // alert()
    _vertex_buffer_infos.buffer[vbidx].state.mask |= STATE_FLAG;
    _vertex_buffer_groups.buffer[vb_groupidx].needs_any_update = true; // Set the groups needs update, so we don't have to check all vertex buffers if none needs update
}
/** */
export function Vertex_buffer_group_state_enable(vb_groupidx, STATE_FLAG) {

    _vertex_buffer_groups.buffer[vb_groupidx].state.mask |= STATE_FLAG;
    if (STATE_FLAG & BUFFER_STATE.NEEDS_UPDATE)
        _vertex_buffer_groups.buffer[vb_groupidx].needs_any_update = true; // Set the groups needs update, so we don't have to check all vertex buffers if none needs update

}






/*************************************************************************************************************************/
// Scissor Box
/** Pass the mesh.bufferidx index of the meshes that the scissor box will draw values from. [posx, posy, width, height] */
export function Vertex_buffer_group_create_scissorbox(vb_groupidx, mx, my, mw, mh) {
    _vertex_buffer_groups.buffer[vb_groupidx].CreateScissorBoxByMeshIdx(mx, my, mw, mh);
    Vertex_buffer_group_update_scissorbox(vb_groupidx);
}
/**
 * 
 * @param {index} vb_groupidx 
 * @param {index} mx : start x pos 
 * @param {index} my : start y pos
 * @param {index} mw : width 
 * @param {index} mh : height
 */
export function Vertex_buffer_group_set_scissorbox(vb_groupidx, mx, my, mw, mh) {
    _vertex_buffer_groups.buffer[vb_groupidx].SetScissorBox(mx, my, mw, mh);
}
/** */
export function Vertex_buffer_group_update_scissorbox_all_vb() {

    // Run for all vertex buffer groups that belong to the root widget
    for (let i = 0; i <= _vertex_buffer_groups.boundary; i++) {

        const vb_group = _vertex_buffer_groups.buffer[i];
        if (vb_group.has_scissorbox) {

            Vertex_buffer_group_update_scissorbox(i)
        }
    }
}
/** */
export function Vertex_buffer_group_update_scissorbox(vb_groupidx) {

    /**
     * 1. Get the meshes for scissor box x, y, width and height values.
     * 2. Extract these values
     * 3. Run a loop for all vertex buffers that belong to the same root widget
     * 4. Update the scissor box values of the group   
    */

    const vb_group = _vertex_buffer_groups.buffer[vb_groupidx];

    if((vb_group.state.mask & BUFFER_STATE.IS_ACTIVE)===0) return;


    const mx = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[0]);
    const my = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[1]);
    const mw = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[2]);
    const mh = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[3]);

    const pad_offset = 4;

    // const x = Mesh_get_real_pos_x(mx)-pad_offset;
    // const y = Mesh_get_real_pos_y(my)-pad_offset;
    const x = Mesh_get_real_pos_x(mx);
    const y = Mesh_get_real_pos_y(my);
    const w = mw.geom.dim[0] * 2-pad_offset;
    const h = mh.geom.dim[1] * 2-pad_offset;
    const H = VIEWPORT.HEIGHT;

    vb_group.SetScissorBox(x, (H - y) - h, w, h);

}
/** */
export function Vertex_buffer_group_has_scissorbox(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].has_scissorbox;
}
/** */
export function Vertex_buffer_group_remove_scissorbox(vb_groupidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].ResetScissorBox();
    // _vertex_buffer_groups.buffer[vb_groupidx].has_scissorbox = false;
}




/*************************************************************************************************************************/
// Uniforms

/** */
export function Vertex_buffer_set_uniform_value_callback(vb_groupidx, Clbk, params, ubidx, unif_name) {

    // Avoid adding callbacks if they have already been created for this vertex buffer
    const uniform_bindings = _vertex_buffer_groups.buffer[vb_groupidx].uniform_bindings;
    for (let i = 0; i <= uniform_bindings.boundary; i++) {

        if (uniform_bindings.buffer[i].unif_name === unif_name) {
            return;
        }
        // Check all uniforms of this vertex buffer group, if any mathces found, skip adding and update the found 
        else if (uniform_bindings.buffer[i].ubidx === ubidx) {
            uniform_bindings.buffer[i].Clbk = Clbk;
            uniform_bindings.buffer[i].params = params;

            return;
        }
    }

    // Else register the uniform
    uniform_bindings.Add({
        Clbk: Clbk,
        params: params,
        ubidx: ubidx,
        unif_name: unif_name,
    });

    console.log(
        'UNIFORM BINDINGS CREATE:',
        '  Clbk,:', Clbk,
        '  params,:', params,
        '  ubidx,:', ubidx,
        '  unif_name,:', unif_name,
    )

}
/** */
function Vertex_buffer_remove_uniforms(vb_groupidx) {


    const uniform_bindings = _vertex_buffer_groups.buffer[vb_groupidx].uniform_bindings;
    for (let i = 0; i < uniform_bindings.boundary; i++) {
        uniform_bindings.buffer[i].Clbk = null;
        uniform_bindings.buffer[i].params = null;
    }

}
/** */
export function Vertex_buffer_set_and_update_uniforms_no_vao_binding(vb_groupidx, debug_progid, rgidx) {

    const uniform_bindings = _vertex_buffer_groups.buffer[vb_groupidx].uniform_bindings;
    for (let i = 0; i <= uniform_bindings.boundary; i++) {

        const params = uniform_bindings.buffer[i].params;
        const val = uniform_bindings.buffer[i].Clbk(params, rgidx);
        const ubidx = uniform_bindings.buffer[i].ubidx;
        if(uniform_bindings.buffer[i].unif_name === 'u_wposxy') 
        // console.log(
        //     'vb:', vb_groupidx,
        //     'val:', val[1], 
        //     'rg:', rgidx
        // )
        // console.log(rgidx)

        Uniforms_buffer_set_uniform_val_from_index(ubidx, val, params.val_idx);
        Uniforms_buffer_update_uniform(ubidx);
    }

}
/** */
export function Vertex_buffer_set_and_update_uniform(vb_groupidx, ubidx, unif_val, unif_val_idx=null) {

    Program_use_program2(_vertex_buffer_groups.buffer[vb_groupidx].progidx);
    
    const vao = _vertex_buffer_groups.buffer[vb_groupidx].vao;
    if (GL_STATE.BOUND_VAO !== vao){
        gfxCtx.gl.bindVertexArray(vao);
        GL_STATE.BOUND_VAO = vao;
    }

    Uniforms_buffer_set_uniform_val_from_index(ubidx, unif_val, unif_val_idx);
    Uniforms_buffer_update_uniform(ubidx);
}
/** If a vb is re-used, then the unif_wpos index is gonna be different and needs update.
 * The 'clbk_params' OR else unif_wpos index, is the index of the '_per_vb_mesh_unif_wpos' buffer,
 * from where the VertexBufferGroup should draw the root position for the vb uniform.
 * If a mesh (in vb 1) has a parent mesh (in vb2), then the unif wpos will 
 * run recursively in the '_per_vb_mesh_unif_wpos' and collect all vb's root wpositions,
 * so the  '.clbk_params' should have the index value of:{0} because it needs to
 * access the top root parent uunif_wpos in the '_per_vb_mesh_unif_wpos' buffer.
 */
export function Vertex_buffer_change_uniform_value_clbk_params(vb_groupidx, unif_name, unif_wpos_idx) {

    let foundidx = INT_NULL;
    const len = _vertex_buffer_groups.buffer[vb_groupidx].unif_names.length;

    for (let i = 0; i < len; i++) {

        const unif = _vertex_buffer_groups.buffer[vb_groupidx].unif_names[i];
        if (unif === unif_name) {
            foundidx = i;
            break;
        }

        alert('6178823');
        // No uniform with the neme:unif_name is found
    }
    // Replace the index of the '_per_vb_mesh_unif_wpos' buffer
    _vertex_buffer_groups.buffer[vb_groupidx].unif_set_val_clbk_params[foundidx] = unif_wpos_idx
}










/***************************************************************************************************************************************************/
/***************************************************************************************************************************************************/
// Insert-Remove-Reset From Vertex Buffer
/***************************************************************************************************************************************************/

/** Calculates all render group's start index on a per vertex buffer basis 
 * // TODO: We must implement the calcuuulation of the index_offsets for each render group, in the index buffer
*/
export function Vertex_buffer_calculate_render_group_starts() {

    for(let i=0; i<=_vertex_buffer_groups.boundary; i++) {

        const vb = _vertex_buffer_groups.buffer[i];
        let num_faces = 0;
        let num_attributes = 0;
        let start_attrib = 0; // Resets on each diffferent vertex buffer
        
        const vb_groupidx = i;
        const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);
        const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[0]);
        const attribs_per_vertex = vb_info.attribs_info.count;
        const vertices_per_face = vb_group.vertices_per_face;

        let total_size = 0;

        for(let j=0; j<=vb.render_groupidxs.boundary; j++) {

            const rgidx = vb.render_groupidxs.buffer[j];
            const rg = Vertex_buffer_render_group_get_render_group(rgidx); 

            
            rg.start = start_attrib; // Stores for every previous attributes size accumulation
            rg.size = rg.num_faces * vertices_per_face * attribs_per_vertex; 
            
            // Calculate index buffer's offset of this render group 
            rg.index_offset = rg.start / (vertices_per_face * attribs_per_vertex) * INDICES_PER_RECT;

            num_faces += rg.num_faces;
            num_attributes += rg.num_faces * vertices_per_face * attribs_per_vertex;

            start_attrib = num_faces * vertices_per_face * attribs_per_vertex;

            total_size += rg.size;
        }

        // Reallocate vb according to render groups total size
        if(total_size >  vb_info.size) {
            
            const extra_size = total_size - vb_info.size;
            const size_dif = vb_info.Realloc(extra_size);
            console.error('REALLOC',vb_info.size)
            vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE_FROM_REALLOC;
        }
    }
}
/** Creates indices for all vertex buffers. Called once at app intitialization (for now...) */
export function Vertex_buffer_build_index_buffer_all() {

    for(let i=0; i<=_vertex_buffer_groups.boundary; i++) {
        const vb_groupidx = i;
        const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);
        const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[0]);
        const attribs_per_vertex = vb_info.attribs_info.count;
        Index_buffer_build_indices_from_render_group(vb_group.ibidx, vb_group.render_groupidxs, attribs_per_vertex, vb_group.vertices_per_face);
    }
}
/** */
export function Vertex_buffer_add_vertices_from_render_group(gfx, geom, mat, _num_faces = 0, dbg_mesh_name, use_from_reset=false) {
    
    const progidx = gfx.prog.idx;
    const vb_groupidx = gfx.vb.groupidx;
    const prog = Progarm_get_program(progidx);
    const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);
    
    const num_faces = (_num_faces) ? _num_faces : gfx.num_faces;
    
    const render_groupidx = gfx.vb.render_groupidx;
    const render_group = Vertex_buffer_render_group_get_render_group(render_groupidx);

    // // Catch error: when this is called to add from a reset state.
    // if(use_from_reset===true && render_group.debug_is_reseted===false) { 
    //     console.error('sjdklhjshjdfjhsjdhjhj')
    //     alert('34503734049948972387\nRender group has not been reset.\nThe data in the vertex buffer will be duplicated'); 
    //     // throw new Error(); 
    // }
    // else if(render_group.debug_is_reseted) render_group.debug_is_reseted = true;

    
    // Run for every vertex buffer of the group.
    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {
        
        const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[i]);
        
        const attr_vpos_idx = vb_info.attribs_indexing.VPOS2;
        const a_vpos_offset = vb_info.attribs_info.offsets[attr_vpos_idx];
        const attr_uv_idx = vb_info.attribs_indexing.TEX2;
        const a_uv_offset = vb_info.attribs_info.offsets[attr_uv_idx];
        const attribs_per_vertex = vb_info.attribs_info.count;
        
        const verts_per_face = (gfx.sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X) ? 2 : vb_group.vertices_per_face;
        let total_attribs = 0;
        if(gfx.sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X) {
            total_attribs = vb_info.attribs_info.count * ((verts_per_face * num_faces) + 2); 
        }
        else total_attribs = attribs_per_vertex * verts_per_face * num_faces; // BUG: Mesh attrib size is not for instanced geom. Better use the gfx.vb.counts 
        
        const start_attribute_index = render_group.start + render_group.count;
        
        const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);
        Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start_attribute_index, num_faces, attribs_per_vertex, verts_per_face, a_vpos_offset, a_uv_offset);
        

        // Index_buffer_info_check_has_enough_indices(vb_group.ibidx, render_group.draw_count, num_faces);
        Index_buffer_add_indices_from_render_group(vb_group.ibidx, render_groupidx, attribs_per_vertex, verts_per_face, num_faces);

        render_group.count += total_attribs;
        vb_info.count = render_group.count;
        vb_info.vCount = vb_info.count / vb_info.attribs_info.count;
        
        prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
        vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
        vb_group.needs_any_update = true;
        render_group.state |= RENDER_GROUP_STATE.NEEDS_UPDATE;
        
        render_group.draw_count += num_faces * INDICES_PER_RECT;
        
        // Store the texture index in the vertex
        vb_info.texidx = mat.texidx;
        if(use_from_reset === false) {
            gfx.vb.counts.buffer[i] = total_attribs;
            gfx.vb.starts.buffer[i] = start_attribute_index;
        }
        
    }

    return 0;

}
/** Reset Vertex Buffer to specific mesh start index */
export function Vertex_buffer_reset_to_index_NEW(vb_groupidx, render_groupidx) {

    const render_group = Vertex_buffer_render_group_get_render_group(render_groupidx);
    render_group.count = 0;
    render_group.draw_count = 0;
    render_group.debug_is_reseted = true;
    
    _vertex_buffer_groups.buffer[vb_groupidx].needs_any_update = true;

}











/****************************************************************************************************************************************************/
// NEED RE-IMPLEMENTATION
/****************************************************************************************************************************************************/

/** */
export function Vertex_buffer_remove_geometry(gfx, num_faces, debug_mesh) {

    const vb_group = _vertex_buffer_groups.buffer[gfx.vb.groupidx];
    
    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {
        
        
        const vb_info = _vertex_buffer_infos.buffer[gfx.vb.groupidx];
        
        const attribsidx = Program_get_shader_attributes_index(vb_group.progidx);
        const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);
        
        // const removed_attribs = attribs_per_vertex * 4 * num_faces
        const removed_attribs = (gfx.sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X)
        ? attribs_per_vertex * ((2 * num_faces) + 2) // For meshes with rects vertex conection
        : attribs_per_vertex * 4 * num_faces; // For meshes with separate rects 
        
        let start = gfx.vb.starts.buffer[i];
        const end = start + removed_attribs;

        // if(end > vb_info.count)
        //     console.error('vbidx', gfx.vb.groupidx, 'end', end, 'vb_info.count', vb_info.count, 'num_faces', num_faces)

        
        // console.log('Remove:', gfx.vb.groupidx, 'removed_attribs', removed_attribs, 'counts', gfx.vb.counts.buffer[i], 'num_faces', num_faces, 'vbcount', vb_info.count)
        
        
        // Shift all attributes left to fil the gap of the removed attributes. 
        const vb_data = _vertex_buffers_data.buffer[gfx.vb.groupidx];
        for (let j = end; j < vb_info.count; j++) {
            vb_data[start++] = vb_data[j];
        }
        
        vb_info.count -= removed_attribs;
        // const vCount = removed_attribs / gfx.vb.counts.buffer[i];
        const vCount = removed_attribs / attribs_per_vertex;
        vb_info.vCount -= vCount;
        
        // if(gfx.vb.groupidx===12) console.log('    vb_info.count', vb_info.count, 'removed_attribs', removed_attribs)


        /**DEBUG*/ if (vb_info.count < 0) {
            console.error('!!!!!!!!!!!!!!!!!!!!!!!!!',
                'vbidx', gfx.vb.groupidx,
                // 'mesh', debug_mesh.mesh_bufferidx,
                'num_faces', num_faces,
                'count', gfx.vb.counts.buffer[i] * num_faces,
                'vb: count', vb_info.count,
            );
        }



        // Set inactive 
        if (vb_info.count === 0) {

            vb_info.state.mask &= ~BUFFER_STATE.IS_ACTIVE;
            vb_group.state.mask &= ~BUFFER_STATE.IS_ACTIVE;

            // Deactivate the vertex buffer rendering in the render queue
            Renderqueue_set_active(gfx.vb.groupidx, false);

            // Reset the wpos uniform in the wpos uniforms buffer
            Mesh_unif_set_vb_root_wposx(gfx.vb.groupidx, 0);
            Mesh_unif_set_vb_root_wposy(gfx.vb.groupidx, 0);

            // Remove any uniform callback functions
            Vertex_buffer_remove_uniforms(gfx.vb.groupidx);

            Vertex_buffer_group_remove_scissorbox(gfx.vb.groupidx)

        }
        else vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;


    }


    const indices_per_face = Index_buffer_info_get_indices_per_face(vb_group.ibidx);
    vb_group.draw_count -= num_faces * indices_per_face;

    vb_group.needs_any_update = true;

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
export function Vertex_buffer_print() {
    console.log('VertexBufferGroup', _vertex_buffer_groups)
    console.log('VertexBufferInfo', _vertex_buffer_infos)
    console.log('VertexBuffer:', _vertex_buffers_data)
}













////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DEPRECATED
/** Reset Vertex Buffer to specific mesh start index */
// export function Vertex_buffer_reset_to_index(vb_groupidx, starts) {
//     // if (!DISABLE_DEBUG) (_vertex_buffer_groups, progidx, new Error().lineNumber);


//     const vb_group = _vertex_buffer_groups.buffer[vb_groupidx];

//     let num_faces = 0;

//     for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {
//         /**
//          * // TODO: Check If the view has meshes to its right inside the current vertexbuffer,
//          * If num_faces + start is less than vertex buffers count, the it has, so we need to remove the attributes from the vertex buffer  
//          */

//         const vbidx = vb_group.vb_idxs.buffer[i]

//         const vb_info = _vertex_buffer_infos.buffer[vbidx];
//         if (starts[i] < 0 || starts[i] > vb_info.count) console.error('Start should be less than vertex buffer count. @VertexBuffers.js \nstart index:', starts[i], 'vb count', vb_info.count);

//         const attribsidx = Program_get_shader_attributes_index(vb_group.progidx);
//         const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);

//         vb_info.count = starts[i];
//         // const render_groupidx = gfx.vb.render_groupidx;
//         // const render_group = Vertex_buffer_render_group_get_render_group(render_groupidx);

//         const vCount = starts[i] ? starts[i] / attribs_per_vertex : 0;
//         vb_info.vCount = vCount;
//         vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

//         num_faces += vb_info.count / (vb_group.vertices_per_face * attribs_per_vertex);
//         vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
//     }


//     // const indices_per_face = Index_buffer_info_get_indices_per_face(vb_group.ibidx);
//     // vb_group.draw_count = num_faces * indices_per_face;
//     // // Vertex_buffer_render_group_reset_draw_count(num_faces * indices_per_face);


//     vb_group.needs_any_update = true;

// }

/** SAVE */
// export function Vertex_buffer_add_vertices(gfx, geom, mat, _num_faces = 0, dbg_mesh_name, use_from_reset=false) {
//     alert('01992877661545124342\nVertex_buffer_add_vertices is DEPRECATED')
//         // const progidx = gfx.prog.idx;
//         // const vb_groupidx = gfx.vb.groupidx;
//         // const prog = Progarm_get_program(progidx);
//         // const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);
    
//         // const num_faces = (_num_faces) ? _num_faces : gfx.num_faces;
        
//         // const render_groupidx = gfx.vb.render_groupidx;
//         // const render_group = Vertex_buffer_render_group_get_render_group(render_groupidx);
    
    
//         // // const start = vb_info.count;
//         // const start = render_group.start+render_group.count;
//         // // const start = render_group.start;
    
//         // // Run for every vertex buffer of the group.
//         // for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {
    
//         //     const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[i]);
            
//         //     const attr_vpos_idx = vb_info.attribs_indexing.VPOS2;
//         //     const a_vpos_offset = vb_info.attribs_info.offsets[attr_vpos_idx];
//         //     const attr_uv_idx = vb_info.attribs_indexing.TEX2;
//         //     const a_uv_offset = vb_info.attribs_info.offsets[attr_uv_idx];
//         //     const attribs_per_vertex = vb_info.attribs_info.count;
            
            
//         //     if(use_from_reset === false) // Skip updating mesh.gfx start if this is called from a 'add attr to an empty vb' context 
//         //         gfx.vb.starts.buffer[i] = render_group.start+render_group.count;
            
            
//         //     const verts_per_face = (gfx.sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X) ? 2 : vb_group.vertices_per_face;
//         //     let total_attribs = 0;
//         //     if(gfx.sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X) {
//         //         total_attribs = vb_info.attribs_info.count * ((verts_per_face * num_faces) + 2); 
//         //     }
//         //     else total_attribs = attribs_per_vertex * verts_per_face * num_faces; // BUG: Mesh attrib size is not for instanced geom. Better use the gfx.vb.counts 
            
            
//         //     if (render_group.start+render_group.count + total_attribs >= render_group.size) {
    
//         //         let start = 0;
//         //         for (let i = 0; i <= vb_group.render_groupidxs.boundary; i++) {
//         //             const rg = Vertex_buffer_render_group_get_render_group(vb_group.render_groupidxs.buffer[i]);
//         //             // Vertex_buffer_render_group_set_start(i, start)
//         //             start += rg.size;
//         //         }
    
//         //         if(render_group.count+total_attribs > render_group.size) { 
//         //             // Case a mesh being inserted outside render group's boundaries(getting in other render group area),
//         //             // we need to update the start and size of all next render grouups
//         //         }
    
//         //         if(0) {
                    
//         //             const new_size = vb_info.attribs_info.count * verts_per_face * num_faces;
//         //             const vb_prev_size = vb_info.size;
//         //             const size_dif = vb_info.Realloc(vb_info.size + new_size);
//         //             // console.log('vb_info.size AFTER ALLOC',vb_info.size)
//         //             vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE_FROM_REALLOC;
    
//         //             // const rg = Vertex_buffer_render_group_get_render_group(render_groupidx);
//         //             render_group.size = new_size;
//         //             render_group.start = vb_prev_size;
//         //         }
//         //     }
    
           
//         //     const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);
//         //     Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, render_group.start+render_group.count, num_faces, attribs_per_vertex, verts_per_face, a_vpos_offset, a_uv_offset);
    
//         //     vb_info.count += total_attribs;
//         //     render_group.count += total_attribs;
//         //     vb_info.vCount = vb_info.count / vb_info.attribs_info.count;
    
//         //     prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
//         //     vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
//         //     vb_group.needs_any_update = true;
    
    
    
//         //     // Store the texture index in the vertex
//         //     vb_info.texidx = mat.texidx;
//         //     if(use_from_reset === false) gfx.vb.counts.buffer[i] = total_attribs;
    
//         // }
    
//         // return start;
    
// }