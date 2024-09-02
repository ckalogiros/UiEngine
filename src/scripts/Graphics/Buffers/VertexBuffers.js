"use strict";


import { New_generic_buffer, New_int8_buffer } from "../../Engine/Core/Buffers.js";
import { Shader_attributes_enable, Shader_attributes_get_attribs, Shader_attributes_get_attribs_offset_size, Shader_attributes_get_attribs_per_vertex, Vertex_buffer_create_attribs_info_per_vb_instanced } from "../ShaderAttributes.js";
import { Progarm_get_program, Program_get_shader_attribute_attribs_per_vertex, Program_get_shader_attributes_index } from "../ShaderPrograms.js";
import { Typed_array_create_from_type } from "./TypedArrayBuffersInterface.js";
import { Gl_vertex_array_object_create, Gl_vertex_array_object_get_by_vaoidx } from "./VertexArrays.js";
import { Floor } from "../../Helpers/Math/MathOperations.js";
import { Index_buffer_info_check_has_enough_indices, Index_buffer_info_get_indices_per_face } from "./IndexBuffers.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../Engine/Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Uniforms_buffer_set_uniform_val_from_index, Uniforms_buffer_update_uniform } from "./UniformBuffers.js";
import { Gl_operation_add, Select_fnidx_to_fill_vertex_buffer } from "./VertexBufferFillOps.js";
import { Renderqueue_set_active } from "../../Engine/Renderers/Renderer/RenderQueue.js";
import { Mesh_buffer_get_mesh_byidx } from "../../Engine/Core/MeshBuffer.js";
import { Root_group_vbidx_view_view_get } from "../../Engine/Core/Views/RootView.js";
import { Screen_wpos_get, Screen_wpos_get_y } from "../../Engine/Core/MeshUniformsBuffer.js";






const NOTIFICATIONS_ON = true;


const DISABLE_DEBUG = true;





export function Vertex_buffer_create(sid, size = MAX_VERTEX_BUFFER_SIZE, progidx, IS_PRIVATE) {

    /***********************************************************************************************/
    // Create VAO

    let vaoidx = INT_NULL;

    if (vaoidx === INT_NULL) {
        vaoidx = Gl_vertex_array_object_create(sid);
    }

    const vao = Gl_vertex_array_object_get_by_vaoidx(vaoidx); // Get VAO
    gfxCtx.gl.bindVertexArray(vao.vao);


    const attribsidx = Program_get_shader_attributes_index(progidx);

    // Create vertex buffer group
    const vb_group = new Vertex_Buffer_Group(progidx, vaoidx, vao.vao, sid);
    vb_group.state.mask |= IS_PRIVATE;

    if (sid.inst) {

        const type = BUFFER_TYPE.FLOAT32;


        // Create vertex buffer data
        const vb_buffer = Typed_array_create_from_type(type, size);
        const vbo = gfxCtx.gl.createBuffer();
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vbo);
        gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb_buffer, gfxCtx.gl.STATIC_DRAW, 0);
        const vbidx = _vertex_buffers_data.Add(vb_buffer);


        // Create vertex buffer info
        const vbinfo = new Vertex_Buffer_Info(size, vbo, vbidx, type, sid.inst);
        vbinfo.SetAddFn(attribsidx, 0x0, sid.inst);
        // vbinfo.state.mask |= IS_PRIVATE;
        const vb_infoidx = _vertex_buffer_infos.Add(vbinfo);



        const attrib_divisor = 1; // run per instance
        // Calculate the attributes info specific for the attributes of this vertex buffer.
        const ret = Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid.inst, attrib_divisor);
        vbinfo.attribs_info = ret.attribs_info;
        vbinfo.attribs_indexing = ret.attribs_indexing;


        Shader_attributes_enable(attribsidx, attrib_divisor)

        // Store the vbidx to the group
        vb_group.vb_idxs.Add(vbidx);

        if (vbidx !== vb_infoidx) alert('vbidx !== vb_infoidx\nAt Vertex_buffer_create()\nAt VertexBuffers.js')

    }
    if (sid.attr) {

        const type = BUFFER_TYPE.FLOAT32;


        // Create vertex buffer data
        const vb_buffer = Typed_array_create_from_type(type, size);
        const vbo = gfxCtx.gl.createBuffer();
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vbo);
        gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb_buffer, gfxCtx.gl.STATIC_DRAW, 0);
        const vbidx = _vertex_buffers_data.Add(vb_buffer);


        // Create vertex buffer info
        const vbinfo = new Vertex_Buffer_Info(size, vbo, vbidx, type, sid.attr & ~sid.inst);
        vbinfo.SetAddFn(attribsidx, sid.attr & ~sid.inst, 0x0);
        // vbinfo.state.mask |= IS_PRIVATE;
        const vb_infoidx = _vertex_buffer_infos.Add(vbinfo);



        const attrib_divisor = 0; // run per instance
        // Calculate the attributes info specific for the attributes of this vertex buffer.
        const ret = Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid.attr & ~sid.inst, attrib_divisor);
        vbinfo.attribs_info = ret.attribs_info;
        vbinfo.attribs_indexing = ret.attribs_indexing;

        Shader_attributes_enable(attribsidx, attrib_divisor);

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
// Vertex Buffer Data
/****************************************************************************************************************************************************/


const _vertex_buffers_data = New_generic_buffer(_, 'GFX Index Buffer');
_vertex_buffers_data.Init(1);


export function Vertex_buffer_reset_full() {
    Vertex_buffer_info_gl_destroy(gfxCtx.gl);
    _vertex_buffers_data.ResetFull();
}




export function Vertex_buffer_get_Active_count() { return _vertex_buffers_data.active_count; }



export function Vertex_buffer_get() { return _vertex_buffers_data; }



export function Vertex_buffer_get_by_vbidx(vbidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers_data, vbidx, new Error().lineNumber);
    return _vertex_buffers_data.buffer[vbidx];
}



export function Vertex_buffer_get_attrib_value_from_vb_byidx(vbidx, attr_idx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers_data, vbidx, new Error().lineNumber);
    return _vertex_buffers_data.buffer[vbidx][attr_idx];
}
























/****************************************************************************************************************************************************/
// Vertex Buffer Info
/****************************************************************************************************************************************************/
// Vb info describes a '_vertex_buffers_data'. One info for every '_vertex_buffers_data'.
const _vertex_buffer_infos = New_generic_buffer(_, 'GFX Vertex Buffer Infos');

export function Vertex_buffer_info_reset() {
    Gl_vertex_buffer_group_vbo_delete_all();
    _vertex_buffer_infos.ResetFull();
}



function Gl_vertex_buffer_group_vbo_delete(ibidx) {

    const vao = _vertex_buffer_infos.buffer[ibidx];
    gfxCtx.gl.deleteBuffer(vao);
}


function Gl_vertex_buffer_group_vbo_delete_all() {

    for (let i = 0; i <= _vertex_buffer_infos.boundary; i++) {

        const vbo = _vertex_buffer_infos.buffer[i].vbo;
        gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, null);
        gfxCtx.gl.deleteBuffer(vbo);
    }
}



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


    // TODOD: This must be moved to VertexBufferInfo class
    // EFFICIENCY: Can pass an aproximation of all the meshes count (extra_size) from the root caller where the widget is constructed
    Realloc(extra_size = 0) {

        this.size = this.#CalculateMemoryPaddedSize(this.size, extra_size);
        const new_data = Typed_array_create_from_type(this.type, this.size)

        const old_data = _vertex_buffers_data.buffer[this.vbidx];
        const size = old_data.length;
        for (let i = 0; i < size; i++) {
            new_data[i] = old_data[i];
        }
        _vertex_buffers_data.buffer[this.vbidx] = new_data;

        if (DEBUG.GFX.BUFFERS) console.warn('Resizing vertex buffer!')
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


}


export function VBI_get_byidx(vb_infoidx) {
    // TODO: Check for valid buffer element
    return _vertex_buffer_infos.buffer[vb_infoidx];
}



export function VBI_reset_full() {
    _vertex_buffer_infos.ResetFull()
}



export function VBI_get_whole_buffer() {
    // TODO: Check for valid buffer element
    return _vertex_buffer_infos;
}



export function Vertex_buffer_info_gl_destroy(gl) {
    for (let i = 0; i <= _vertex_buffer_infos.boundary; i++) {
        gl.deleteBuffer(_vertex_buffer_infos.buffer[i].vbo);
    }
}



















/****************************************************************************************************************************************************/
// Vertex Buffer Group
/****************************************************************************************************************************************************/


// A group defines a set of vertex buffers that render a particular mesh/meshes (vb's are separated by attributes of that mesh)
const _vertex_buffer_groups = New_generic_buffer(_, 'GFX Vertex Buffer Groups');

export function Vertex_buffer_group_reset() {
    Gl_vertex_buffer_group_vbo_delete_all()
    _vertex_buffer_groups.ResetFull();
}





class Vertex_Buffer_Group {

    constructor(progidx, vaoidx, vao, sid) {

        this.sid = sid;             // Bit field: Shader ID
        this.state = { mask: BUFFER_STATE.IS_ACTIVE };
        this.progidx = progidx;     // Just for debuging.
        this.vao = vao;             // WebGl vertex array object.
        this.vaoidx = vaoidx;       // Index to the array of stored VAO's
        this.texidx = INT_NULL;     // index to the array all textures are stored.
        this.ibidx = INT_NULL;      // index ref to index buffer this vb uses.
        this.draw_count = 0;
        this.vertices_per_face = 4; // HACK: How vertex buffer should conclude the vertices per face ????????????????
        this.idx = INT_NULL;        // Self index to the '_vertex_buffer_groups' buffer
        this.needs_any_update = false; // 

        this.has_scissorbox = false;
        this.scissorbox = [0, 0, 0, 0];
        this.scissorbox_meshidx = [INT_NULL, INT_NULL, INT_NULL, INT_NULL]; // Store the mesh index for retrieving scissorbox values


        this.render_queueidx = INT_NULL; // index to the Render queue buffer of the current vb 

        this.vb_idxs = New_int8_buffer(_, 'NEW VertexBufferGroup-VBIDXS');

        // TODO: We probably need only the unif name and ubidx, not the whole uniforms. BUT if doing so, then on any uniform changes, we need to uupdate here too.
        // this.uniforms = uniforms; // A refference to the mesh uniforms(stores from the first mesh to create the vertex buffer)


        // TODO: Create a more apropriate struct for uniform callbacks
        this.Unif_set_val_clbk = []; // Function to call for getting the uniform value.
        this.unif_set_val_clbk_params = []; // The params of the above function callback.
        this.unif_ubidxs = []; // The params of the above function callback.
        this.unif_names = []; // Uniforms names. Helper, to locate which element is what uniform
    }

    CreateScissorBox(mx, my, mw, mh) {
        this.scissorbox_meshidx[0] = mx;
        this.scissorbox_meshidx[1] = my;
        this.scissorbox_meshidx[2] = mw;
        this.scissorbox_meshidx[3] = mh;
        this.has_scissorbox = true;
    }

    SetScissorBox(x, y, w, h) {
        this.scissorbox[0] = x;
        this.scissorbox[1] = y;
        this.scissorbox[2] = w;
        this.scissorbox[3] = h;

    }
}

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



export function Vertex_buffer_group_get_progidx(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].progidx;
}



export function Gl_vertex_group_buffer_get_vao(vb_groupidx) {
    return {
        vao: _vertex_buffer_groups.buffer[vb_groupidx].vao,
        vaoidx: _vertex_buffer_groups.buffer[vb_groupidx].vaoidx,
    };
}



export function Vertex_buffer_group_get_render_queueidx(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].render_queueidx;
}



export function Vertex_buffer_group_get_sid(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].sid
}



export function Vertex_buffer_group_set_texidx(vb_groupidx, texidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].texidx = texidx;
}



export function Vertex_buffer_group_get_texidx(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].texidx;
}



export function Vertex_buffer_group_set_ibidx(vb_groupidx, ibidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].ibidx = ibidx;
}



export function Vertex_buffer_group_set_render_queueidx(vb_groupidx, render_queueidx) {
    _vertex_buffer_groups.buffer[vb_groupidx].render_queueidx = render_queueidx;
}



/** Pass the mesh.bufferidx index of the meshes that the scissor box will draw values from. [posx, posy, width, height] */
export function Vertex_buffer_group_create_scissorbox(vb_groupidx, mx, my, mw, mh) {
    _vertex_buffer_groups.buffer[vb_groupidx].CreateScissorBox(mx, my, mw, mh);
    Vertex_buffer_group_update_scissorbox(vb_groupidx);
}



// export function Vertex_buffer_group_update_scissorbox_all_vb(vb_groupidx) {

//     /**
//      * 1. Get the meshes for scissor box x, y, width and height values.
//      * 2. Extract these values
//      * 3. Run a loop for all vertex buffers that belong to the same root widget
//      * 4. Update the scissor box values of the group   
//      */

//     const vb_group = _vertex_buffer_groups.buffer[vb_groupidx];

   
//     const mx = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[0]);
//     const my = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[1]);
//     const mw = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[2]);
//     const mh = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[3]);
    
//     const x = mx.GetPosX();
//     const y = my.GetPosY();
//     const w = mw.geom.dim[0] * 2;
//     const h = mh.geom.dim[1] * 2;
    
//     const root_vb_groupidxs = Root_group_vbidx_view_view_get(mx.root_bufferidx);
    
//     // Run for all vertex buffer groups that belong to the root widget
//     const H = VIEWPORT.HEIGHT;
//     for (let i = 0; i <= root_vb_groupidxs.boundary; i++) {

//         const vb_group_ = _vertex_buffer_groups.buffer[root_vb_groupidxs.buffer[i]];
//         if (vb_group_.has_scissorbox)
//             vb_group_.SetScissorBox(x, (H - y) - h, w, h);
//     }
// }



export function Vertex_buffer_group_update_scissorbox_all_vb() {
    
    // Run for all vertex buffer groups that belong to the root widget
    for (let i = 0; i <= _vertex_buffer_groups.boundary; i++) {
        
        const vb_group = _vertex_buffer_groups.buffer[i];
        if(vb_group.has_scissorbox){
    
            Vertex_buffer_group_update_scissorbox(i)
        }
    }
}



export function Vertex_buffer_group_update_scissorbox(vb_groupidx) {
    
    /**
     * 1. Get the meshes for scissor box x, y, width and height values.
     * 2. Extract these values
     * 3. Run a loop for all vertex buffers that belong to the same root widget
     * 4. Update the scissor box values of the group   
    */
   
   const vb_group = _vertex_buffer_groups.buffer[vb_groupidx];

   
    const mx = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[0]);
    const my = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[1]);
    const mw = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[2]);
    const mh = Mesh_buffer_get_mesh_byidx(vb_group.scissorbox_meshidx[3]);
    
    const x = mx.GetPosX();
    const y = my.GetPosY();
    const w = mw.geom.dim[0] * 2;
    const h = mh.geom.dim[1] * 2;
    const H = VIEWPORT.HEIGHT;

    vb_group.SetScissorBox(x, (H - y) - h, w, h);
    
}



export function Vertex_buffer_group_has_scissorbox(vb_groupidx) {
    return _vertex_buffer_groups.buffer[vb_groupidx].has_scissorbox;
}


/*************************************************************************************************************************/
// Uniforms

export function Vertex_buffer_set_uniform_value_callback(vb_groupidx, Clbk, params, ubidx, unif_name) {

    // Avoid adding callbacks if they have already been added for this vertex buffer
    // const len = _vertex_buffer_groups.buffer[vb_groupidx].unif_ubidxs.length;
    // for(let i=0; i < len; i++){
    //     const ubidx1 = _vertex_buffer_groups.buffer[vb_groupidx].unif_ubidxs[i];
    //     // if(ubidx === ubidx1) 
    //     // console.error('Duplicate functions for ubidx:', ubidx, 'vb_groupidx', vb_groupidx, 
    //     // '\nFound at ubidx:', i, '\nValue set at uniform index:', params.val_idx, 'Found uniform value index:', _vertex_buffer_groups.buffer[vb_groupidx].unif_set_val_clbk_params[i])
    //     return;
    // }

    _vertex_buffer_groups.buffer[vb_groupidx].Unif_set_val_clbk.push(Clbk);
    _vertex_buffer_groups.buffer[vb_groupidx].unif_set_val_clbk_params.push(params);
    _vertex_buffer_groups.buffer[vb_groupidx].unif_ubidxs.push(ubidx);
    _vertex_buffer_groups.buffer[vb_groupidx].unif_names.push(unif_name);

}



export function Vertex_buffer_set_and_update_uniform(vb_groupidx) {

    const len = _vertex_buffer_groups.buffer[vb_groupidx].Unif_set_val_clbk.length;
    for (let i = 0; i < len; i++) {

        // 'params' is an index to the '_per_vb_mesh_unif_wpos' buffer, that holds all root unif wpositions
        const params = _vertex_buffer_groups.buffer[vb_groupidx].unif_set_val_clbk_params[i];
        const val = _vertex_buffer_groups.buffer[vb_groupidx].Unif_set_val_clbk[i](params);
        const ubidx = _vertex_buffer_groups.buffer[vb_groupidx].unif_ubidxs[i];

        const val_idx = (params.val_idx !== undefined) ? params.val_idx : null;

        // Uniforms_buffer_set_uniform(ubidx, val, val_idx)
        Uniforms_buffer_set_uniform_val_from_index(ubidx, val, val_idx);
        Uniforms_buffer_update_uniform(ubidx);

    } ``
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














/*************************************************************************************************************************/

export function Vertex_buffer_group_get_vb(vb_groupidx, vbidx) {
    alert()
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    return _vertex_buffer_groups.buffer[vb_groupidx].vbs[vbidx];
}
export function Vertex_buffer_group_copy_vbs(vb_groupidx, buffer) {
    alert()
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);
    const len = _vertex_buffer_groups.buffer[vb_groupidx].vbs.length;
    for (let i = 0; i < len; i++) {
        buffer[i] = _vertex_buffer_groups.buffer[vb_groupidx].vbs[i];
    }
    return buffer;
}
export function Vertex_buffer_group_get_vbidxs(vb_groupidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffer_groups, vb_groupidx, new Error().lineNumber);

    return _vertex_buffer_groups.buffer[vb_groupidx].vb_idxs;
}







export function Vertex_buffer_state_enable(vb_grouidx, vbidx, STATE_FLAG) {
    // alert()
    _vertex_buffer_infos.buffer[vbidx].state.mask |= STATE_FLAG;
    _vertex_buffer_groups.buffer[vb_grouidx].needs_any_update = true; // Set the groups needs update, so we don't have to check all vertex buffers if none needs update
}



export function Vertex_buffer_group_state_enable(vb_grouidx, STATE_FLAG) {

    _vertex_buffer_groups.buffer[vb_grouidx].state.mask |= STATE_FLAG;
    if (STATE_FLAG & BUFFER_STATE.NEEDS_UPDATE)
        _vertex_buffer_groups.buffer[vb_grouidx].needs_any_update = true; // Set the groups needs update, so we don't have to check all vertex buffers if none needs update
}



export function Vertex_buffer_state_disable(vb_grouidx, STATE_FLAG) {
    alert()
    const len = _vertex_buffer_groups.buffer[vb_grouidx].vbs.length;
    for (let i = 0; i < len; i++) {
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



/** Returns true/false */
export function Vertex_buffer_exists_from_index(vbidx) {

    if (_vertex_buffers_data.buffer[vbidx] === undefined || _vertex_buffers_data.buffer[vbidx] === null)
        return false

    return true;
}









/***************************************************************************************************************************************************/
/***************************************************************************************************************************************************/
// Insert-Remove-Reset From Vertex Buffer
/***************************************************************************************************************************************************/

/** Reset Vertex Buffer to specific mesh start index */
export function Vertex_buffer_reset_to_index(vb_groupidx, starts) {
    // if (!DISABLE_DEBUG) (_vertex_buffer_groups, progidx, new Error().lineNumber);


    const vb_group = _vertex_buffer_groups.buffer[vb_groupidx];

    let num_faces = 0;

    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {
        /**
         * // TODO: Check If the view has meshes to its right inside the current vertexbuffer,
         * If num_faces + start is less than vertex buffers count, the it has, so we need to remove the attributes from the vertex buffer  
         */

        const vbidx = vb_group.vb_idxs.buffer[i]

        const vb_info = _vertex_buffer_infos.buffer[vbidx];
        if (starts[i] < 0 || starts[i] > vb_info.count) console.error('Start should be less than vertex buffer count. @VertexBuffers.js \nstart index:', starts[i], 'vb count', vb_info.count);

        const attribsidx = Program_get_shader_attributes_index(vb_group.progidx);
        const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);

        vb_info.count = starts[i];

        const vCount = starts[i] ? starts[i] / attribs_per_vertex : 0;
        vb_info.vCount = vCount;
        vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

        num_faces += vb_info.count / (vb_group.vertices_per_face * attribs_per_vertex);
        vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
    }


    const indices_per_face = Index_buffer_info_get_indices_per_face(vb_group.ibidx);
    vb_group.draw_count = num_faces * indices_per_face;

    vb_group.needs_any_update = true;

}


/** Reset Vertex Buffer to 0 */
export function Vertex_buffer_reset(vb_groupidx, starts) {
    // if (!DISABLE_DEBUG) (_vertex_buffer_groups, progidx, new Error().lineNumber);


    const vb_group = _vertex_buffer_groups.buffer[vb_groupidx];

    let num_faces = 0;

    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {
        /**
         * // TODO: Check If the view has meshes to its right inside the current vertexbuffer,
         * If num_faces + start is less than vertex buffers count, the it has, so we need to remove the attributes from the vertex buffer  
         */

        const vbidx = vb_group.vb_idxs.buffer[i]

        const vb_info = _vertex_buffer_infos.buffer[vbidx];
        if (starts[i] < 0 || starts[i] > vb_info.count)
            console.error('Start should be less than vertex buffer count. @VertexBuffers.js \nstart index:', starts[i], 'vb count', vb_info.count);

        const attribsidx = Program_get_shader_attributes_index(vb_group.progidx);
        const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);

        vb_info.count = 0;
        vb_info.vCount = 0;
        vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

        // num_faces += vb_info.count / (vb_group.vertices_per_face * attribs_per_vertex);
        vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
    }


    const indices_per_face = Index_buffer_info_get_indices_per_face(vb_group.ibidx);
    // vb_group.draw_count = num_faces * indices_per_face;
    vb_group.draw_count = 0;

    vb_group.needs_any_update = true;

}



/**
 * // TODO:
 * The index buffer pattern ({123, 234} or fan{12,13,14,15})
 * probably will be dectating the vertex buffer build function,
 * as to how the attributes of a mesh(pos, dim, ...)
 * are gonna be stored inside the veertex buffer.
 */
export function Vertex_buffer_add_vertices(gfx, geom, mat, _num_faces = 0, dbg_mesh_name) {


    const progidx = gfx.prog.idx;
    const vb_groupidx = gfx.vb.groupidx;
    const prog = Progarm_get_program(progidx);
    const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);
    const attribs_info = Shader_attributes_get_attribs(prog.attribsidx);

    // const num_faces = 1; // Even for text rendering, the loop for all text faces is the caller, so no need to have num_faces. num_faces currently are working for vertex buffer updates 
    const num_faces = (_num_faces) ? _num_faces : gfx.num_faces;

    // Run for every vertex buffer of the group.
    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {

        const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[i])

        const start = vb_info.count;
        gfx.vb.starts.buffer[i] = start;

        // Reallocate vertex buffer if it has no more space
        const verts_per_rect = (gfx.vb.is_per_vertex.buffer[i]) ? vb_group.vertices_per_face : 1
        const meshSize = vb_info.attribs_info.count * verts_per_rect * num_faces; // BUG: Mesh attrib size is not for intanced geom. Better use the gfx.vb.counts 
        if (vb_info.count + meshSize >= vb_info.size) vb_info.Realloc(meshSize);

        const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);

        // const vertex_count = (gfx.sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X) ? attribs_per_vertex * ((2 * num_faces) +2) : verts_per_rect * num_faces;
        const attribs_count = vb_info.attribs_info.count * verts_per_rect * num_faces;
        // vb_info.count += Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, stride, attribs_info);
        Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, attribs_count, attribs_info);
        vb_info.count += attribs_count;
        vb_info.vCount = vb_info.count / vb_info.attribs_info.count;
        // if (vb_groupidx>=2) console.log(vb_groupidx, vb_info.count)
        // vb_info.attribs_info.attrib_divisor++;

        prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
        vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
        vb_group.needs_any_update = true;


        // Store the texture index in the vertex
        vb_info.texidx = mat.textureid;
        gfx.vb.counts.buffer[i] = verts_per_rect * vb_info.attribs_info.count;

        // gfx.vb.counts.buffer[i] = vb_info.count;

    }

    // Update the draw count
    // let draw_count = vb_group.vCount; // This is seting draw_count without 'INDEXED' vertex shader 
    let indices_count = 0; // This is seting draw_count without 'INDEXED' vertex shader 
    if (vb_group.sid.shad & SID.SHAD.INDEXED) { // If vertex shader is 'INDEXED', then re-assign the draw_count

        indices_count = num_faces * INDICES_PER_RECT; // HACK: Later the 'INDICES_PER_RECT' must be abstracted in the vertex buffer OR the program.

        // Check if index buffer has enough indices to cover the max of any vertex buffer that it represents.
        Index_buffer_info_check_has_enough_indices(gfx.ib.idx, vb_group.draw_count, num_faces);
    }

    vb_group.draw_count += indices_count;

    // console.log(vb_groupidx, vb_group.draw_count)
    // return start;
}



export function Vertex_buffer_add_vertices_from_reset(gfx, geom, mat, _num_faces = 0) {


    const progidx = gfx.prog.idx;
    const vb_groupidx = gfx.vb.groupidx;
    const prog = Progarm_get_program(progidx);
    const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);

    const num_faces = (_num_faces) ? _num_faces : gfx.num_faces;


    let start = 0;

    // Run for every vertex buffer of the group.
    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {

        const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[i])

        start = vb_info.count;
        // gfx.vb.starts.buffer[i] = start;
        vb_info.vCount += VERTS_PER_RECT_INDEXED * num_faces;

        // Reallocate vertex buffer if it has no more space
        const verts_per_rect = (gfx.vb.is_per_vertex.buffer[i]) ? vb_group.vertices_per_face : 1
        const meshSize = vb_info.attribs_info.count * verts_per_rect * num_faces;
        if (vb_info.count + meshSize >= vb_info.size) vb_info.Realloc(meshSize);

        const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);

        // const stride = vb_info.attribs_info.count * verts_per_rect;
        const stride = vb_info.attribs_info.count;
        // Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, stride);
        vb_info.count += Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, stride);


        prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
        vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
        vb_group.needs_any_update = true;


        // Store the texture index in the vertex
        vb_info.texidx = mat.textureid;
        gfx.vb.counts.buffer[i] = VERTS_PER_RECT_INDEXED * vb_info.attribs_info.count;


    }

    // Update the draw count
    let draw_count = vb_group.vCount; // This is seting draw_count without 'INDEXED' vertex shader 
    if (vb_group.sid.shad & SID.SHAD.INDEXED) { // If vertex shader is 'INDEXED', then re-assign the draw_count

        draw_count = num_faces * INDICES_PER_RECT; // HACK: Later the 'INDICES_PER_RECT' must be abstracted in the vertex buffer OR the program.

        // Check if index buffer has enough indices to cover the max of any vertex buffer that it represents.
        Index_buffer_info_check_has_enough_indices(gfx.ib.idx, vb_group.draw_count, num_faces);
    }
    vb_group.draw_count += draw_count;

    // console.log(vb_groupidx, vb_group.draw_count)

    return start
}



export function Vertex_buffer_update_vertices(gfx, geom, mat, dbg_mesh_name) {

    const vb_groupidx = gfx.vb.groupidx;
    const vb_group = Vertex_buffer_group_get_byidx(vb_groupidx);

    const num_faces = 1;

    // Run for every vertex buffer of the group.
    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {

        const vb_info = VBI_get_byidx(vb_group.vb_idxs.buffer[i])

        // const start = gfx.vb.starts.buffer[i];
        const start = gfx.vb.starts.buffer[i];
        vb_info.vCount += VERTS_PER_RECT_INDEXED * num_faces;


        // const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
        // Reallocate vertex buffer if it has no more space
        // const meshSize = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;
        // const meshSize = vb_info.attribs_info.count * verts_per_rect * num_faces;
        // if (vb_info.count + meshSize >= vb_info.size) vb_info.Realloc(meshSize);

        const vb_data = Vertex_buffer_get_by_vbidx(vb_info.vbidx);

        const verts_per_rect = (gfx.vb.is_per_vertex.buffer[i]) ? vb_group.vertices_per_face : 1
        const stride = vb_info.attribs_info.count * verts_per_rect;
        vb_info.count += Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, stride);


        vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
        // vb_group.needs_any_update = true;
        Vertex_buffer_state_enable(gfx.vb.groupidx, gfx.vb.idxs.buffer[0], BUFFER_STATE.NEEDS_UPDATE);

    }


}



export function Vertex_buffer_update_vertices_explicit_Params(vb_groupidx, start, geom, mat) {

    // const prog = Progarm_get_program(progidx);
    const vb_info = Vertex_buffer_group_get_byidx(vb_groupidx);

    const num_faces = 1;

    if ((vb_info.vCount % 1) !== 0)
        console.error('index buffer count mismatch')


    // const shader_attribs = Shader_attributes_get_attribs(prog.attribsidx);
    const vb_data = Vertex_buffer_get_by_vbidx(vb_info.groupidx);

    const verts_per_rect = (gfx.vb.is_per_vertex.buffer[i]) ? vb_group.vertices_per_face : 1
    const stride = vb_info.attribs_info.count * verts_per_rect;
    Gl_operation_add(vb_info.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, stride);

    vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

}


export function Vertex_buffer_remove_geometry(gfx, num_faces) {


    const vb_group = _vertex_buffer_groups.buffer[gfx.vb.groupidx];

    for (let i = 0; i <= vb_group.vb_idxs.boundary; i++) {

        // console.log('-----------------------------------------------------------------\ngfx.vb.counts.active_count', gfx.vb.counts.buffer[i], 'num_faces', num_faces)

        const vb_info = _vertex_buffer_infos.buffer[gfx.vb.groupidx];

        const attribsidx = Program_get_shader_attributes_index(vb_group.progidx);
        const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);

        const removed_attribs = (gfx.sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X)
            ? attribs_per_vertex * ((2 * num_faces) + 2) // For meshes with rects vertex conection
            : attribs_per_vertex * 4 * num_faces; // For meshes with separate rects 


        let start = gfx.vb.starts.buffer[i];
        const end = start + removed_attribs;

        // console.log('Remove:', gfx.vb.groupidx, 'removed_attribs', removed_attribs, 'counts', gfx.vb.counts.buffer[i], 'num_faces', num_faces, 'vbcount', vb_info.count)


        // Shift all attributes left to fil the gap of the removed attributes. 
        const vb_data = _vertex_buffers_data.buffer[gfx.vb.groupidx];
        for (let j = end; j < vb_info.count; j++) {
            vb_data[start++] = vb_data[j];
        }

        vb_info.count -= removed_attribs;
        const vCount = removed_attribs / gfx.vb.counts.buffer[i];
        vb_info.vCount -= vCount;

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

            Renderqueue_set_active(gfx.vb.groupidx, false);
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
    console.log('VertexBufferGroup', _vertex_buffer_groups)
    console.log('VertexBufferInfo', _vertex_buffer_infos)
    console.log('VertexBuffer:', _vertex_buffers_data)
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
    const wpos_attr = Shader_attributes_get_attribs_offset_size(attribsidx, SHADER_ATTRIBUTES.WPOS3);

    const arr = [];
    const faces = count / (stride * 4);

    for (let i2 = 0; i2 < faces; i2++) {

        let i = wpos_attr.offset;
        let wpos = '';
        while (i < stride * 4) {

            if (is_wpos) {

                wpos += `${Floor(_vertex_buffers_data.buffer[vbidx][i++])}, `;
                wpos += `${Floor(_vertex_buffers_data.buffer[vbidx][i++])}, `;
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




















