"use strict";

import { Vertex_buffer_get } from "../Buffers/VertexBuffers.js";


/**
 * Enable-Disable Debuging
 */
const GL_DEBUG_ATTRIBUTES = true;
const GL_DEBUG_PROGRAM = false;
const GL_DEBUG_SHADERS = false;
const GL_DEBUG_SHADER_INFO = false;
const GL_DEBUG_VERTEX_BUFFER = true;
const GL_DEBUG_INDEX_BUFFER = true;
const GL_DEBUG_BUFFERS_ALL = true;





/**
 * 
 * @param {*} prog 
 * @param {*} idx 
 */
export function PrintProgram(prog, idx) {
    if (!GL_DEBUG_PROGRAM) return;
    console.log('-[Gl Program]-\nProgram index:', idx, ' program:', prog, ' sid:', SID.GetTypeToString(prog.info.sid))
}


/**
 * 
 * @param {*} prog 
 * @param {*} idx 
 */
export function PrintShaderInfo(prog) {
    if (!GL_DEBUG_SHADER_INFO) return;
    console.log('-[Gl Shader Info]-\n', prog.shaderinfo, ' sid:', SID.GetTypeToString(prog.info.sid))
}
export function PrintVertexBuffer(vb) {
    if (!GL_DEBUG_VERTEX_BUFFER) return;
    console.log('-[Gl Vertex Buffer]-\n', vb)
}
export function PrintVertexBufferDataAndNames() {
    if (!GL_DEBUG_VERTEX_BUFFER) return;

    const gfx_group = Program_get_groups();
    console.log('-[Gl Vertex Buffer]')
    for (let k = 0; k < gfx_group.count; k++) {
        for (let i = 0; i < gfx_group.buffer[k].count; i++) {
            console.log('prog:', i)
            for (let j = 0; j < gfx_group.buffer[k].buffer[i].vb.length; j++) {
                console.log(
                    'vbidx: ', j,
                    'meshes: ', gfx_group.buffer[k].buffer[i].vb[j].meshesNames,
                    'data: ', gfx_group.buffer[k].buffer[i].vb[j].data,
                );
            }
        }
    }
}
export function PrintVertexDataAll() {
    if (!GL_DEBUG_VERTEX_BUFFER) return;

    // const gfx_group = Program_get_groups();
    // console.log('-[Gl Vertex Buffer]-')
    // for (let k = 0; k < gfx_group.count; k++) {
    //     const progs_group_name = GFX_GROUPS.GetName(k);
    //     console.log(`---[${progs_group_name}]-: idx=`, k)
    //     for (let i = 0; i < gfx_group.buffer[k].count; i++) {
    //         console.log(' progidx:', i)
    //         console.log('vb:', gfx_group.buffer[k].buffer[i].vb);
    //     }
    // }

    const vbs = Vertex_buffer_get();
    for (let i = 0; i <= vbs.boundary; i++) {
        console.log(' progidx:', i)
        console.log('vb:', vbs.buffer[i]);
    }
}

export function PrintVertexBufferAllPretty() {
    if (!GL_DEBUG_VERTEX_BUFFER) return;

    const gfx_group = Program_get_groups();
    for (let i = 0; i < gfx_group.count; i++) {
        console.log('-[Gl Vertex Buffer]-')
        for (let j = 0; j < gfx_group.buffer[i].vertexBufferCount; j++) {
            for (let k = 0; k < gfx_group.buffer[i].vb[j].count; k++) {
                console.log('vertex', k);
                console.log('color:')
                console.log(gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++])
                console.log('wpos:')
                console.log(gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++])
                console.log('vpos:', gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++], gfx_group.buffer[i].vb[j].data[k++])
                console.log(gfx_group.buffer[i].vb[j].data[k++])
            }
        }
    }
}
export function PrintIndexBuffer(ib) {
    if (!GL_DEBUG_INDEX_BUFFER) return;

    const gfx_group = Program_get_groups();
    console.log('-[Gl Index Buffer]-\n', ib)
    for (let k = 0; k < gfx_group.count; k++) {
        for (let i = 0; i < gfx_group.buffer[k].count; i++) {
            console.log('prog:', i)
            console.log('Index buffers:', gfx_group.buffer[k].buffer[i].ib)
        }
    }
}
export function PrintIndexBufferAll() {
    if (!GL_DEBUG_INDEX_BUFFER) return;

    const gfx_group = Program_get_groups();
    console.log('-[Gl Index Buffer All]')
    for (let k = 0; k < gfx_group.count; k++) {
        for (let i = 0; i < gfx_group.buffer[k].count; i++) {
            console.log('prog:', i)
            for (let j = 0; j < gfx_group.buffer[k].buffer[i].ib.length; j++) {
                const ib = Index_buffer_info_get_by_ibidx(gfx_group.buffer[k].buffer[i].ib[j]);
                console.log(
                    'ibidx: ', j,
                    'count: ', ib.count,
                    'idx: ', ib.idx,
                    'needs Update: ', ib.needs_update,
                    'show: ', ib.show,
                    'vCount: ', ib.vCount,
                );
            }
        }
    }
}
export function PrintBuffersAll() {
    if (!GL_DEBUG_BUFFERS_ALL) return;

    console.log('-[Gl Print All GL Buffers]-')
    const gfx_group = Program_get_groups();
    for (let i = 0; i < gfx_group.count; i++) {

        for (let j = 0; j < gfx_group.buffer[i].vb.length; j++) {
            console.log('   progidx:', i, ' vbIdx:', j, ': ', gfx_group.buffer[i].vb[j])
            console.log('   progidx:', i, ' ibIdx:', j, ': ', gfx_group.buffer[i].ib[j])
        }
    }
}

export function PrintBuffersMeshesNames() {
    if (!GL_DEBUG_BUFFERS_ALL) return;

    console.log('-[Gl Print All GL Buffers Meshes Names]-')
    const gfx_group = Program_get_groups();
    for (let i = 0; i < gfx_group.count; i++) {
        console.log('progidx:', i, ': ')
        for (let j = 0; j < gfx_group.buffer[i].vb.length; j++) {
            for (let k = 0; k < gfx_group.buffer[i].vb[j].meshesNames.length; k++) {
                console.log('   ', j, gfx_group.buffer[i].vb[j].meshesNames[k])
            }
        }
    }
}
export function PrintBuffersAttribsCount() {
    if (!GL_DEBUG_BUFFERS_ALL) return;

    console.log('-[Gl Print All GL Buffers Attribs Count]-')
    const gfx_group = Program_get_groups();
    for (let i = 0; i < gfx_group.count; i++) {
        for (let j = 0; j < gfx_group.buffer[i].vb.length; j++) {
            console.log('prog:', i, ' vb:', j, ' count:', gfx_group.buffer[i].vb[j].count, ' size:', gfx_group.buffer[i].vb[j].size)
            console.log('Index Buffer count:', gfx_group.buffer[i].ib[j].count, ' size:', gfx_group.buffer[i].ib[j].size)
        }
    }
}





