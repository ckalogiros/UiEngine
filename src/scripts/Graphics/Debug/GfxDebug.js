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



export function GetShaderTypeId(sid) {

    let str = 'Shader Attributes: ';

    if (sid.shad) str += 'Shader General Properties:'
    if (sid.shad & SID.SHAD.INDEXED) str += 'Indexed Geometry.'
    if (sid.shad & SID.SHAD.PRE_MULTIPLIED_ALPHA) str += 'Premultiplied Alpha.'
    if (sid.shad) str += '\n'

    if (sid.attr) str += 'Attribs:'
    if (sid.attr & SID.ATTR.COL4) str += 'col4, '
    if (sid.attr & SID.ATTR.POS2) str += 'pos2, '
    if (sid.attr & SID.ATTR.SCALE2) str += 'scale2, '
    if (sid.attr & SID.ATTR.TEX2) str += 'tex2, '
    if (sid.attr & SID.ATTR.WPOS_TIME4) str += 'wpos3, time1, '
    if (sid.attr & SID.ATTR.WPOS_TIME4) str += 'wposTime4, '
    if (sid.attr & SID.ATTR.TIME) str += 'time, '
    if (sid.attr & SID.ATTR.SDF) str += 'Sdf, '
    if (sid.attr & (SID.ATTR.BORDER & SID.ATTR.FEATHER & SID.ATTR.R_CORNERS)) str += 'round corners, border width, border feather, '
    if (sid.attr) str += '\n'

    if (sid.unif) str += 'Uniforms:'
    if (sid.unif & SID.UNIF.PROJECTION) str += 'Projection Matrix, '
    if (sid.unif) str += '\n'

    if (sid.pass) str += 'Passes:'
    if (sid.pass & SID.PASS.COL4) str += 'col4, '
    if (sid.pass & SID.PASS.DIM2) str += 'dim2, '
    if (sid.pass & SID.PASS.RES2) str += 'res2, '
    if (sid.pass & SID.PASS.TEX2) str += 'tex2, '
    if (sid.pass & SID.PASS.TIME1) str += 'time1, '
    if (sid.pass & SID.PASS.WPOS2) str += 'wpos2, '
    if (sid.pass & SID.PASS) str += 'Passes:'
    if (sid.pass) str += '\n'

    return str;
}

/**
 * 
 * @param {*} gl 
 * @param {*} prog 
 * @returns 
 */
export function PrintAttributes() {
    if (!GL_DEBUG_ATTRIBUTES) return;


    const gfx_group = Program_get_groups();

    for (let i = 0; i < gfx_group.count; i++) {

        const prog = gfx_group.buffer[i];
        console.log('\n-[GL Enabled Attributes]-\nFor Shader Program: ', GetShaderTypeId(prog.sid))
        const attribsPerVertex = prog.shaderinfo.attribsPerVertex;

        // For Uniforms
        if (prog.shaderinfo.attributes.loc.col >= 0) {
            console.log('   COLOR: loc:', prog.shaderinfo.attributes.loc.col,
                ' count:', V_COL_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.col)
        }
        if (prog.shaderinfo.attributes.loc.wposTime >= 0) {
            console.log('   WPOS_TIME: loc:', prog.shaderinfo.attributes.loc.wposTime,
                ' count:', V_WPOS_TIME_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.wposTime)
        }
        if (prog.shaderinfo.attributes.loc.pos >= 0) {
            console.log('   POS: loc:', prog.shaderinfo.attributes.loc.pos,
                ' count:', V_POS_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.pos)
        }
        if (prog.shaderinfo.attributes.loc.tex >= 0) {
            console.log('   TEX: loc:', prog.shaderinfo.attributes.loc.tex,
                ' count:', V_TEX_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.tex)
        }
        if (prog.shaderinfo.attributes.loc.params1 >= 0) {
            console.log('   PARAMS1: loc:', prog.shaderinfo.attributes.loc.params1,
                ' count:', V_PARAMS1_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.params1)
        }
        if (prog.shaderinfo.attributes.loc.sdf >= 0) {
            console.log('   Sdf: loc:', prog.shaderinfo.attributes.loc.sdf,
                ' count:', V_SDF_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.sdf)
        }
        if (prog.shaderinfo.attributes.loc.style >= 0) {
            console.log('   RADIUS: loc:', prog.shaderinfo.attributes.roundLoc,
                ' count:', V_STYLE_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.style)
        }
        if (prog.shaderinfo.attributes.loc.time >= 0) {
            console.log('   TIME: loc:', prog.shaderinfo.attributes.loc.time,
                ' count:', V_TIME_COUNT, ' stride:', attribsPerVertex,
                ' offset:', prog.shaderinfo.attributes.offset.time)
        }

        console.log('\n')
        console.log('\nGL Enable Uniforms:')

        if (prog.shaderinfo.uniforms.projection) {
            console.log('   Orthographic Projection: ', prog.shaderinfo.uniforms.projection)
        }
        if (prog.shaderinfo.uniforms.sampler) {
            console.log('   Texture Sampler: ', prog.shaderinfo.uniforms.sampler)
        }
        if (prog.shaderinfo.uniforms.uniformsBufferLoc) {
            console.log('   Sdf Font Params: ', prog.shaderinfo.uniforms.uniformsBufferLoc)
        }

    }

    console.log('\n\n')
}

/**
 * 
 * @param {*} prog 
 * @param {*} idx 
 */
export function PrintProgram(prog, idx) {
    if (!GL_DEBUG_PROGRAM) return;
    console.log('-[Gl Program]-\nProgram index:', idx, ' program:', prog, ' sid:', GetShaderTypeId(prog.info.sid))
}


/**
 * 
 * @param {*} prog 
 * @param {*} idx 
 */
export function PrintShaderInfo(prog) {
    if (!GL_DEBUG_SHADER_INFO) return;
    console.log('-[Gl Shader Info]-\n', prog.shaderinfo, ' sid:', GetShaderTypeId(prog.info.sid))
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





