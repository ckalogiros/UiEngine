"use strict";


import { M_Buffer } from "../../Engine/Core/Buffers";
import { Shader_attributes_enable, Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs, Shader_attributes_get_attribs_offset_size, Shader_attributes_get_attribs_per_vertex } from "../ShaderAttributes";
import { Progarm_get_program, Program_get_shader_attribute_attribs_per_vertex, Program_get_shader_attributes_index } from "../ShaderPrograms";
import { Create_buffer_from_type } from "./TypedArrayBuffers";
import { Gl_operation_add } from "./VertexBuffersOps";
import { Gl_vertex_array_object_create, Gl_vertex_array_object_get_by_vaoidx } from "./VertexArrays";
import { BLACK, BLUEL, GREEN, GREY, PURPLER, REDL, YELLOWL, YELLOWR } from "../../Engine/Drawables/Material/Base/Colors";
import { Create_widget_button, Create_widget_dropdown, Create_widget_section, Create_widget_text } from "../../Engine/Core/CreateWidget";
import { Dropdown_roots_set_root } from "../../Engine/Drawables/Widgets/Widget_Dropdown";
import { Floor } from "../../Helpers/Math/MathOperations";
import { Debug_ui_create_notification, NOTIFICATION_TYPE_IDX } from "../../Engine/Drawables/DebugInfo/DebugInfoUiNotifications";
import { Debug_info_update_clbk } from "../../Engine/Drawables/DebugInfo/DebugInfoUi";




const DISABLE_DEBUG = true;


/****************************************************************************************************************************************************/
// Vertex Buffer Data Array
/****************************************************************************************************************************************************/


const _vertex_buffers = new M_Buffer();
_vertex_buffers.Init(1);



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
// Vertex Buffer Info Array
/****************************************************************************************************************************************************/


const _vertex_buffers_info = new M_Buffer();



export function Vertex_buffer_info_get() { return _vertex_buffers_info; }



export function Vertex_buffer_info_get_by_vbidx(vbidx) {
    if (!DISABLE_DEBUG) (_vertex_buffers_info, vbidx, new Error().lineNumber);
    return _vertex_buffers_info.buffer[vbidx];
}



export function Gl_vertex_buffer_get_vao(vbidx) {
    return {
        vao: _vertex_buffers_info.buffer[vbidx].vao,
        vaoidx: _vertex_buffers_info.buffer[vbidx].vaoidx,
    };
}



export function Vertex_buffer_info_create(sid, size = MAX_VERTEX_BUFFER_SIZE, progidx) {

    /***********************************************************************************************/
    // Create VAO

    let vaoidx = INT_NULL;

    let new_vao_created = false;
    if (vaoidx === INT_NULL) {
        // Create VAO
        vaoidx = Gl_vertex_array_object_create(sid);
        new_vao_created = true;
        // console.warn('################ New VAO created. vaoidx:', vaoidx)
    }

    const vao = Gl_vertex_array_object_get_by_vaoidx(vaoidx); // Get VAO
    gfxCtx.gl.bindVertexArray(vao.vao);
    // console.log('BIND VAO:', vao)



    /***********************************************************************************************/
    // Create vertex buffer

    // const type = vao.type
    const type = BUFFER_TYPE.FLOAT32
    const ret = Vertex_buffer_create(type, size);
    const vb_info = new Vertex_Buffer_Info(size, sid, ret.vbidx, ret.vbo, vaoidx, vao.vao, vao.type, progidx);

    _vertex_buffers_info.Add(vb_info);

    const vb = _vertex_buffers.buffer[ret.vbidx];
    gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, ret.vbo);
    gfxCtx.gl.bufferData(gfxCtx.gl.ARRAY_BUFFER, vb, gfxCtx.gl.STATIC_DRAW, 0);

    const attribsidx = Program_get_shader_attributes_index(progidx);
    Shader_attributes_enable(attribsidx)
    // console.warn('Create Shader Attributes:')

    vb_info.state.mask |= BUFFER_STATE.IS_ACTIVE;

    return vb_info;
}




class Vertex_Buffer_Info {

    constructor(size, sid, vbidx, vbo, vaoidx, vao, type, progidx) {

        this.size = size;   // Total size of the typed array buffer (in elements).
        this.count = 0;	    // Current size oof the typed array buffer (in elements)
        this.vCount = 0;    // Number of vertices

        this.progidx = progidx;   // Just for debuging.
        this.vbo = vbo;         // WebGl vertex buffer object.
        this.vbidx = vbidx;     // index to the array of stored vertex buffers.
        this.vao = vao;         // WebGl vertex array object.
        this.vaoidx = vaoidx;   // Index to the array of stored VAO's
        this.texidx = INT_NULL; // index to the array all textures are stored.
        this.ibidx = INT_NULL; // index ref to index buffer this vb uses.
        /*DO NOT DELETE*///this.ib_count = 0;      // Case that the index buffer is shared between vertex buffers, each vb needs to know how many indices the Draw function should access

        this.type = type; // The type of the typed array buffer

        this.state = { mask: 0x0 }; // SEE: 'BUFFER_STATE'. Gather the state of the vertex buffer info into a bit field
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



export function Vertex_buffer_info_get_sid(vbidx) {
    if (!DISABLE_DEBUG) DEBUG_PRINT(_vertex_buffers_info, vbidx, new Error().lineNumber);
    return _vertex_buffers_info.buffer[vbidx].sid;
}



export function Vertex_buffer_state_enable(vbidx, STATE_FLAG) {
    _vertex_buffers_info.buffer[vbidx].state.mask |= STATE_FLAG;
}




export function Vertex_buffer_state_disable(vbidx, STATE_FLAG) {
    _vertex_buffers_info.buffer[vbidx].state.mask &= ~STATE_FLAG;
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

    if (_vertex_buffers.buffer[vbidx] === undefined || _vertex_buffers.buffer[vbidx] === null)
        return false

    return true;
}



export function Vertexbuffer_reset_to_index(progidx, vbidx, start) {
    if (!DISABLE_DEBUG) (_vertex_buffers_info, progidx, new Error().lineNumber);

    const vb_info = _vertex_buffers_info.buffer[vbidx];
    if (start < 0 || start > vb_info.count) console.error('Start should be less than vertex buffer count. @VertexBuffers.js, ');

    const attribsidx = Program_get_shader_attributes_index(progidx);
    const attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(attribsidx);

    const vCount = start ? start/attribs_per_vertex :  0;
    vb_info.count = start;
    vb_info.vCount = vCount;
    vb_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;

}



export function Vertex_buffer_reset(gfx) {
    console.error('IMPLEMENT ME');
    const vb = Vertex_buffer_info_get_by_vbidx(gfx.vb.idx);
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

    const progidx = gfx.prog.idx;
    const vbidx = gfx.vb.idx;
    const prog = Progarm_get_program(progidx);
    const vb_info = Vertex_buffer_info_get_by_vbidx(vbidx);

    const num_faces = 1;
    const start = vb_info.count;
    gfx.vb.start = start;
    const count = gfx.vb.count;
    gfx.vb.end = (start + count) * num_faces;
    vb_info.vCount += VERTS_PER_RECT_INDEXED * num_faces;
    if ((vb_info.vCount % 1) !== 0)
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


    const progidx = gfx.prog.idx;
    const vbidx = gfx.vb.idx;
    const prog = Progarm_get_program(progidx);
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



export function Vertex_buffer_remove_geometry(gfx, num_faces, start_index) {


    const vb_info = _vertex_buffers_info.buffer[gfx.vb.idx];
    const vb_data = _vertex_buffers.buffer[gfx.vb.idx];

    const removed_attribs = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;

    let start = start_index;
    const end = start + removed_attribs;


    // Shift all attributes left to fil the gap of the removed attributes. 
    for (let i = end; i < vb_info.count; i++) {
        vb_data[start++] = vb_data[i]
    }

    vb_info.count -= removed_attribs;
    const vCount = removed_attribs / gfx.attribsPerVertex;
    vb_info.vCount -= vCount;

    if (vb_info.count < 0)
        console.error('!!!!!!!!!!!!!!!!!!!!!!!! Count < 0. vb:', vb_info.idx)

    
        
    // POTENTIAL_BUG: If the buffer is empty MUST be updated!!!
    // TODO: If The buffer is not used, by deactivating it below, then we need to update the render queue
    // Set inactive 
    if(vb_info.count === 0) 
        vb_info.state.mask &= ~BUFFER_STATE.IS_ACTIVE
    else vb_info.state.mask |= BUFFER_STATE.NEEDS_UPDATE;



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
    console.log('VertexBufferInfo', _vertex_buffers_info)
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
    const wpos_attr = Shader_attributes_get_attribs_offset_size(attribsidx, SHADER_ATTRIBUTES.WPOS4);

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
        const copy = JSON.parse( JSON.stringify(wpos) );
        arr.push(copy);
        console.log(copy)
    }
    
    // console.log(arr)
    return arr;
}






















/****************************************************************************************************************************************************/
// DEBUG Info - Create text for render
/****************************************************************************************************************************************************/

function TEMP(params) {

    const destroy_btn = params.target_mesh;
    const s = params.params;
    s.Destroy();

    const _params = {
        notification_type: NOTIFICATION_TYPE_IDX.GFX_VERTEX_BUFFER,
        parent_section: s.parent,
    }

    
	Debug_ui_create_notification(Debug_info_update_clbk, _params);
}



export function Vertex_buffer_create_text_info() {

    const col_menu = TRANSPARENCY(GREY[1], .9), col_dp = TRANSPARENCY(GREY[5], 1.);

    const s = Create_widget_section(_, SECTION.VERTICAL, [6, 6], [400, 400, 0], [0, 0], TRANSPARENCY(BLUEL[9], .5), 'Vertex Buffer Info BLUE');

    const destroy = Create_widget_button(_, 'Recalc', _, _, _, TRANSPARENCY(GREEN[7], .3), _, _, _, _, _);
    destroy.Bind(TEMP, _, s);
    s.AddItem(destroy);


    const margin = [4, 4];
    const style = [0, 3, 1];

    const vbiw = Create_widget_dropdown(_, 'Vertex Buffers', [100, 100, 0], col_dp, col_menu, _, _, _, _, style, margin);
    vbiw.CreateClickEvent();
    Dropdown_roots_set_root(vbiw, vbiw)
    s.AddItem(vbiw)
    vbiw.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
    
    const vbi = _vertex_buffers_info;
    const vb_buffer_info = Create_widget_text(_, `count:${vbi.active_count} size:${vbi.size}`);
    vbiw.AddToMenu(vb_buffer_info);
    
    for (let i = 0; i <= vbi.boundary; i++) {
        
        const vb = vbi.buffer[i];
        
        const vbw = Create_widget_dropdown(_, `Vb [${i}]`, [100, 100, 0], col_dp, col_menu, _, [2, 1], _, _, style, margin);
        vbw.options = SECTION.TOP_DOWN | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
        vbw.CreateClickEvent();
        vbiw.AddToMenu(vbw)

        {
            const type = BUFFER_TYPE.ToString(vb.type);
            const info = Create_widget_text(_, `count:${vb.count} size:${vb.size}  vCount:${vb.vCount}  type:${type}`);
            vbw.AddToMenu(info);
        }
        {
            const info = Create_widget_text(_, `vaoidx:${vb.vaoidx} vbidx:${vb.vbidx} ibidx:${vb.ibidx} texidx:${vb.texidx} progidx:${vb.progidx}`);
            vbw.AddToMenu(info);
        }
        {
            const sid = SID.ToString(vb.sid);
            const info = Create_widget_text(_, `sid:${sid}`);
            vbw.AddToMenu(info);
        }
        {
            const state = PROGRAM_STATE.ToString(vb.state.mask);
            const info = Create_widget_text(_, `state:${state}`);
            vbw.AddToMenu(info);
        }


        { // Vertex buffer array
            const vba = Create_widget_dropdown(_, `buffer`, [100, 100, 0], col_dp, col_menu, _, [2,1], _, _, style, margin);
            vba.CreateClickEvent();
            vbw.AddToMenu(vba)

            // const wpos = Vertex_to_string(VB_TO_STRING_FLAGS.WPOS, vb.progidx, vb.vbidx, vb.count);

            // const len = wpos.length;
            // for(let i2=0; i2<len; i2++){

            //     const info = Create_widget_text(_, `wpos:${wpos[i]}`);
            //     vba.AddToMenu(info);
            // }

        }

    }

    s.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT
    s.Calc()

    return s;
}