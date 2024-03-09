"use strict";

/*******************************************************************************************************************************************************/
// Graphics Globals


const gfxCtx = {
    gl: null,
    ext: null,
};








const GL = {
    BOUND_PROG_IDX: INT_NULL, // The current bound gl program index
    BOUND_PROG: INT_NULL, // The current bound gl program 
    BOUND_VAO: INT_NULL, // The current bound vertex array  
    BOUND_VBO: INT_NULL, // The current bound vertex buffer 
    BOUND_VBIDX: INT_NULL, // The current bound vertex buffer index
    BOUND_IBO: INT_NULL, // The current bound vertex buffer 
    BOUND_IBIDX: INT_NULL, // The current bound vertex buffer index
    BOUND_TEXTURE_IDX: INT_NULL, // The current bound texture index 
    // BOUND_TEXTURE_UNIT_ID: INT_NULL, // The current bound texture 
};








_CNT = 0x1;
/** Grouping shader programs. Example: group for debug user interface meshes, default group meshes */
const PROGRAMS_GROUPS = {

    DEBUG: {
        IDX: INT_NULL, // The index of the group of programs dedicated for displaing debug info. 
        MASK: _CNT,
    },

    DEFAULT: {
        IDX: INT_NULL, // The default group stores shader programs for 
        MASK: _CNT <<= 0x1,
    },

    // SIZE: 2,

    GetIdxByMask(mask) {
        if (mask & this.DEFAULT.MASK) return this.DEFAULT.IDX;
        else if (mask & this.DEBUG.MASK) return this.DEBUG.IDX;
    },

    /**DEBUG */ GetName(idx) {
        if (this.DEBUG.IDX === idx) return 'DEBUG progs group'
        else if (this.DEFAULT.IDX === idx) return 'DEFAULT progs group'
        else return `UNKOWN progs group index. index:${idx}`
    },
}








/**
 * SID: Shader Type ID, for creating different _glPrograms with 
 * different vertex and fragment shaders bbbased uppon the input attribbutes, input uniforms and other properties.
 * Shader creation flags 
 */

let BIT1 = 0x1, BIT2 = 0x1, BIT3 = 0x1, BIT4 = 0x1, BIT5 = 0x1;
const SID = {

    SHAD: {
        INDEXED: BIT1,
        TEXT_SDF: BIT1 <<= 1,
        PRE_MULTIPLIED_ALPHA: BIT1 <<= 1,
    },

    ATTR: {
        COL4: BIT2,
        POS2: BIT2 <<= 1,
        SCALE2: BIT2 <<= 1,
        TEX2: BIT2 <<= 1,
        WPOS_TIME4: BIT2 <<= 1,
        TIME: BIT2 <<= 1,
        SDF: BIT2 <<= 1,
        MSDF: BIT2 <<= 1,
        PARAMS1: BIT2 <<= 1,
        STYLE: BIT2 <<= 1,
        BORDER: BIT2 <<= 1,
        R_CORNERS: BIT2 <<= 1,
        FEATHER: BIT2 <<= 1,
        POS3: BIT2 <<= 1,
        SCALE3: BIT2 <<= 1,
        COL4_PER_VERTEX: BIT2 <<= 1,
        EMPTY: BIT2 <<= 1,
        PLAY_ARROUND1: BIT2 <<= 1,
    },

    UNIF: {

        PROJECTION_MATRIX: BIT5,
        SCREEN_RESOLUTION: BIT5 <<= 0x1,
        TIME: BIT5 <<= 0x1,

        ANY_SHARED: BIT5 <<= 0x1,

        // Extension:
        // IS_PROJECTION_MATRIX_BUFFERED: BIT5 <<= 0x1,
        // IS_SCREEN_RESOLUTION_BUFFERED: BIT5 <<= 0x1,
    },

    UNIF_EXTRA:{

        
        PROJECTION_MATRIX: {
            IS_SHARED: 0x1,
            IN_VS: 0x2,
            IN_FS: 0x4,
        },
        SCREEN_RESOLUTION: {
            IS_SHARED: 0x1,
            IN_VS: 0x2,
            IN_FS: 0x4,
        },
        TIME: {
            IS_SHARED: 0x1,
            IN_VS: 0x2,
            IN_FS: 0x4,
        },
    },
    
    PASS: {
        COL4: BIT4,
        POS2: BIT4 <<= 1,
        DIM2: BIT4 <<= 1,
        TEX2: BIT4 <<= 1,
        WPOS2: BIT4 <<= 1,
        TIME1: BIT4 <<= 1,
        RES2: BIT4 <<= 1,
        STYLE3: BIT4 <<= 1,
        SDF2: BIT4 <<= 1,
        PARAMS1: BIT4 <<= 1,
    },

    // FX
    FX: {
        FS_PARTICLES: BIT3,
        FS_FIRE: BIT3 <<= 1,
        FS_EXPLOSION_CIRCLE: BIT3 <<= 1,
        FS_EXPLOSION_SIMPLE: BIT3 <<= 1,
        FS_VORONOI_EXPLOSION: BIT3 <<= 1,
        FS_GRADIENT: BIT3 <<= 1,
        FS_HIGH_TECH: BIT3 <<= 1,
        FS_CRAMBLE: BIT3 <<= 1,
        FS_NOISE: BIT3 <<= 1,
        FS_V2DGFX: BIT3 <<= 1,
        FS_GLOW: BIT3 <<= 1,
        FS_TWIST: BIT3 <<= 1,
        FS_VORTEX: BIT3 <<= 1,
        FS_VOLUMETRIC_EXPLOSION: BIT3 <<= 1,
        FS_SHADOW: BIT3 <<= 1,
    },


    DEBUG: false,


    CheckSidMatch(sid1, sid2) {

        if (
            sid1.shad === sid2.shad &&
            sid1.attr === sid2.attr &&
            sid1.unif === sid2.unif &&
            sid1.pass === sid2.pass &&
            sid1.progs_group === sid2.progs_group
        ) {
            return true;
        }

        return false;
    },

};

if(SID.ATTR > MAX_BIT_MASK) console.error('SID ATTR exceeding javascript\'s max number value');
if(SID.UNIF > MAX_BIT_MASK) console.error('SID UNIF exceeding javascript\'s max number value');
if(SID.PASS > MAX_BIT_MASK) console.error('SID PASS exceeding javascript\'s max number value');






const GRAPHICS_LAYOUT = {
    ONE_ATTR_SIZE: 1,
    ATTR_SIZES: {
        COL4: 4,
        WPOS4: 4,
        PARAMS1: 4,
        POS2: 2,
        TEX2: 2,
        XY: 2,
        XYZ: 3,
    },
    ATTR_SELF_OFFSETS: {
        ALPHA: 3, // the third float in a col4
        WPOS_Y: 1, // The second attribute in a WPOS-X
        DIM_Y: 1, // The second attribute in a DIM2
        WPOS_Z: 2, // The second attribute in a WPOS-X
        WPOS4_TIME: 3, // The second attribute in a WPOS-X
    },
};








// TODO: Create a smaller buffer that ca resize its self
const MAX_VERTEX_BUFFER_SIZE = 256;
const MAX_INDEX_BUFFER_SIZE = 64;
const INDICES_PER_RECT = 6;
const VERTS_PER_RECT = 6;
const VERTS_PER_RECT_INDEXED = 4;

const V_COL_COUNT = 4; // Number of floats for vertex buffer's attribute
const V_POS_COUNT = 2;
const V_SCALE_COUNT = 2;
const V_TEX_COUNT = 2;
const V_WPOS_COUNT = 3;
const V_WPOS_TIME_COUNT = 4; // Use the 4th element for the time attribute 
const V_STYLE_COUNT = 3;
const V_BORDER_WIDTH = 1, V_BORDER_FEATHER = 1, V_ROUND_CORNERS = 1;
const V_TIME_COUNT = 1;
const V_PARAMS1_COUNT = 4;
const V_SDF_COUNT = 2;

// The style's buffer attribute strides(buffer indexes) 
const V_ROUND_CORNER_STRIDE = 0;
const V_BORDER_WIDTH_STRIDE = 1;
const V_BORDER_FEATHER_STRIDE = 2;








_CNT = 0x1;
const MESH_ENABLE = {

    GFX: {

        UNIF_RESOLUTION: 1,
        UNIF_TIMER: _CNT <<= 1,
        ATTR_TIME: _CNT <<= 1,
        ATTR_STYLE: _CNT <<= 1,

        // Pass from vertex to fragment shader
        PASS_COL4: _CNT <<= 1,
        PASS_WPOS2: _CNT <<= 1,
        PASS_DIM2: _CNT <<= 1,
        PASS_TIME1: _CNT <<= 1,
        PASS_RES2: _CNT <<= 1,


        NONE: 0,
    },
}








_CNT = 0x1;
const GFX_CTX_FLAGS = {

    // Let the application decide a vertex buffer with the same shader id(sid)
    ANY: _CNT <<= 0x1, // SID exists, it will use it, else it will create a new one.
    NEW: _CNT <<= 0x1, // Create a new vertexBuffer.
    SPECIFIC: _CNT <<= 0x1, // Use specific index of a vertex buffer.
    // Use private vertex buffer. If a private and inactive buffer exists it will use that, ...
    PRIVATE: _CNT <<= 0x1, // ... else it will create a new buffer and render it as private

    CHILDEN: _CNT <<= 0x1, // Choose the first match (sid match) from mesh'a children.
    SIBLINGS: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's siblings.
    PARENT: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent.
    PARENT_ASC: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent tree ascending.

    STATIC: _CNT <<= 0x1, // Choose a buffer that is going to be updated rarely
    DYNAMIC: _CNT <<= 0x1, // Choose a buffer that is going to be updated every frame
};








_CNT = 0x1;
const BUFFER_STATE = {
    SHOW: _CNT,
    NEEDS_UPDATE: _CNT <<= 0x1,
    IS_PRIVATE: _CNT <<= 0x1,
    // show = false;
    // needsUpdate = false;
    // hasChanged = false;
    // hasScissorBox = false;
    // isPrivate = false; // SEE ## PRIVATE_BUFFERS
};








_CNT = 0x1;
const BUFFER_TYPE = {

    FLOAT32: _CNT,
    UINT16: _CNT <<= 0x1,

}








_CNT = 0x1;
const PROGRAM_STATE = {
    ACTIVE: _CNT, // UNNECESSARY: Possibly has no usefuleness
    UNIFORMS_NEED_UPDATE: _CNT <<= 0x1,
    // NEEDS_UPDATE: _CNT <<= 0x1,
};








/*************************************************************************************************/
// UNIFORMS



// Store key-value pairs of texture name - texture index(for the global texture array. See GlTextures.js)
// TODO: Create buffers of fonts and farmebuffers
const Texture = {
    atlas: INT_NULL,
    font: INT_NULL,
    frameBufferTexture0: INT_NULL,

    // Current Bound Texture's index(in the texture array. See GlTextures.js). 
    // Only one bound texture is allowed at any time by webGl, so this is a global access
    // to which texture is bound.
    boundTexture: -1,
};








const UNIF_TYPE = {
    FLOAT: 0x1406, // FLOAT
    FVEC2: 0x8b50, // _VEC2
    FVEC3: 0x8b51, // _VEC3
    FVEC4: 0x8b52, // _VEC4
    MAT2: 0x8b5a, // _MAT2
    MAT3: 0x8b5b, // _MAT3
    MAT4: 0x8b5c, // _MAT4
    INT: 0x8b56, // INT, 
    BOOL: 0x8b53, // BOOL 
    IVEC2: 0x8b57, // _VEC2
    IVEC3: 0x8b58, // _VEC3
    UIVEC4: 0x8b59, // _VEC4

    UINT: 0x1405, // UINT
    UIVEC2: 0x8dc6, // _VEC2
    UIVEC3: 0x8dc7, // _VEC3
    UIVEC4: 0x8dc8, // _VEC4
};








/*************************************************************************************************/
// Graphics Constants

const TRIG = {
    COS: 0,
    SIN: 0,

};








/*************************************************************************************************/
// Framebuffer
_CNT = 0x1;
const FB = {
    NEW: _CNT <<= 0x1, // represents the creation of new farmebuffer
    STATIC: {
        ID: _CNT <<= 0x1,
        idx: INT_NULL, // The index of the static frambuffer in the "_fb_buffer" at GlFramebuffer.js file. Should be set manualy.
    },
    DYNAMIC: {
        ID: _CNT <<= 0x1,
        idx: INT_NULL, // The index of the dynamic frambuffer in the "_fb_buffer" at GlFramebuffer.js file. Should be set manualy.
    },
}








/** Rotation Matrices */
class ROTATION3D {
    RX = [
        1, 0, 0,
        0, TRIG.COS, -TRIG.SIN,
        0, TRIG.SIN, TRIG.COS,
    ];
    RY = [
        TRIG.COS, 0, TRIG.SIN,
        0, 1, 0,
        -TRIG.SIN, 0, TRIG.COS,
    ];
    RZ = [
        TRIG.COS, -TRIG.SIN, 0,
        TRIG.SIN, TRIG.COS, 0,
        0, 0, 1,
    ];

    Set(cos, sin) {

        this.RX[4] = cos;
        this.RX[5] = -sin;
        this.RX[7] = sin;
        this.RX[8] = cos;

        this.RY[0] = cos;
        this.RY[2] = -sin;
        this.RY[6] = sin;
        this.RY[8] = cos;

        this.RZ[0] = cos;
        this.RZ[1] = -sin;
        this.RZ[3] = sin;
        this.RZ[4] = cos;
    }

    SetRX(cos, sin) {
        this.RX[4] = cos;
        this.RX[5] = -sin;
        this.RX[7] = sin;
        this.RX[8] = cos;
    }
    SetRY(cos, sin) {
        this.RY[0] = cos;
        this.RY[2] = -sin;
        this.RY[6] = sin;
        this.RY[8] = cos;
    }
    SetRZ(cos, sin) {
        this.RZ[0] = cos;
        this.RZ[1] = -sin;
        this.RZ[3] = sin;
        this.RZ[4] = cos;
    }
}








const ROT3D = new ROTATION3D();

const RX3D = [
    1, 0, 0,
    0, TRIG.COS, -TRIG.SIN,
    0, TRIG.SIN, TRIG.COS,
];







const RY3D = [
    TRIG.COS, 0, TRIG.SIN,
    0, 1, 0,
    -TRIG.SIN, 0, TRIG.COS,
];








const RZ3D = [
    TRIG.COS, -TRIG.SIN, 0,
    TRIG.SIN, TRIG.COS, 0,
    0, 0, 1,
];

