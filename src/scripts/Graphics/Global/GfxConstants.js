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
const TEMPORARY_INDEX_BUFFER_RECOGNITION_PATTERN = {
	rect_123_234: _CNT,
};








_CNT = 0x1;
/** Grouping shader programs. Example: group for debug user interface meshes, default group meshes */
const GFX_GROUPS = {

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

let BIT1 = 0x1, BIT2 = 0x1, BIT3 = 0x1, BIT4 = 0x1, BIT5 = 0x1, BIT6 = 0x1;
const SID = {

    SHAD: {
        INDEXED: BIT1,
        INDEXED_PATT_CONNECTED_FACES_X: BIT1 <<= 1,
        INDEXED_PATT_DISCONTINUE_4: BIT1 <<= 1, // Break vertex indices
        INDEXED_PATT_DISCONTINUE_6: BIT1 <<= 1, // Break vertex indices
        PRE_MULTIPLIED_ALPHA: BIT1 <<= 1,
    },

    ATTR: {
        COL4: BIT2,
        POS2: BIT2 <<= 1,
        DIM2: BIT2 <<= 1,
        SCALE2: BIT2 <<= 1,
        TEX2: BIT2 <<= 1,
        WPOS_TIME4: BIT2 <<= 1,
        TIME: BIT2 <<= 1,
        SDF: BIT2 <<= 1,
        MSDF: BIT2 <<= 1,
        GENERIC_ATTR1_VEC4: BIT2 <<= 1,
        STYLE: BIT2 <<= 1,
        BORDER: BIT2 <<= 1,
        R_CORNERS: BIT2 <<= 1,
        FEATHER: BIT2 <<= 1,
        COL4_PER_VERTEX: BIT2 <<= 1,
        EMPTY: BIT2 <<= 1,
        TEST_MULTI_VERTEX: BIT2 <<= 1,
    },

    INST:{
        COL4: BIT3,
        POS2: BIT3 <<= 1,
        TEX2: BIT3 <<= 1,
        WPOS_TIME4: BIT3 <<= 1,
        TIME: BIT3 <<= 1,
        SDF: BIT3 <<= 1,
        MSDF: BIT3 <<= 1,
        GENERIC_ATTR1_VEC4: BIT3 <<= 1,
        STYLE: BIT3 <<= 1,
        POS3: BIT3 <<= 1,
        COL4_PER_VERTEX: BIT3 <<= 1,
        EMPTY: BIT3 <<= 1,
    },

    UNIF: {

        // Block Uniforms
        PROJECTION_MATRIX: BIT5,
        SCREEN_RESOLUTION: BIT5 <<= 0x1,

        // Individual Uniforms
        TIME: BIT5 <<= 0x1,
        DIM2: BIT5 <<= 0x1,
        // WPOS4: BIT5 <<= 0x1,
        SCALE2: BIT5 <<= 0x1,
        ROOT_WPOS2: BIT5 <<= 0x1,
        // UNIF_GLOW2: BIT5 <<= 0x1,
        // UNIF_NOISE2: BIT5 <<= 0x1,
        // UNIF_SMOKE2: BIT5 <<= 0x1,
        UNIF_SPEED: BIT5 <<= 0x1,
        COL4: BIT5 <<= 0x1,

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
        GENERIC_ATTR1_VEC4: BIT4 <<= 1,
    },

    // FX
    FX: {
        FS_GLOW: BIT6,
        FS_NOISE: BIT6<<=0x1,
        FS_SMOKE: BIT6<<=0x1,
    },
    // FX: {
    //     FS_PARTICLES: BIT3,
    //     FS_FIRE: BIT3 <<= 1,
    //     FS_EXPLOSION_CIRCLE: BIT3 <<= 1,
    //     FS_EXPLOSION_SIMPLE: BIT3 <<= 1,
    //     FS_VORONOI_EXPLOSION: BIT3 <<= 1,
    //     FS_GRADIENT: BIT3 <<= 1,
    //     FS_HIGH_TECH: BIT3 <<= 1,
    //     FS_CRAMBLE: BIT3 <<= 1,
    //     FS_NOISE: BIT3 <<= 1,
    //     FS_V2DGFX: BIT3 <<= 1,
    //     FS_GLOW: BIT3 <<= 1,
    //     FS_TWIST: BIT3 <<= 1,
    //     FS_VORTEX: BIT3 <<= 1,
    //     FS_VOLUMETRIC_EXPLOSION: BIT3 <<= 1,
    //     FS_SHADOW: BIT3 <<= 1,
    // },


    // DEBUG: false,


    // This function is used only to be able to reason of which mesh inherits from which mesh
    // InheritUniform(target, src){
    //     target.unif |= src.unif;
    // },


    CheckSidMatch(sid1, sid2) {

        // Remove all Block Uniforms flags. Better to reuse a program than to create a duplicate only because some meshes dont use Blocked Uniforms. 
        // For individual uniforms we must include for the match, since a Program's shaders may be compiled before the creation of other meshes with the same sid except an extra uniform
        const  unif1 = sid1.unif & ~(this.UNIF.PROJECTION_MATRIX|this.UNIF.SCREEN_RESOLUTION)
        const  unif2 = sid2.unif & ~(this.UNIF.PROJECTION_MATRIX|this.UNIF.SCREEN_RESOLUTION)
        const  attr1 = sid1.attr & ~(this.ATTR.TEST_MULTI_VERTEX|this.ATTR.COL4_PER_VERTEX)
        const  attr2 = sid2.attr & ~(this.ATTR.TEST_MULTI_VERTEX|this.ATTR.COL4_PER_VERTEX)
        /**
         * // TODO:
         * I have deactivated the 'gfx_group' check.
         * Also for the uniforms i exclude the projection matrix and resolution uniforms
         */
        if (
            sid1.shad === sid2.shad &&
            attr1 === attr2 &&
            unif1 === unif2 && 
            sid1.pass === sid2.pass &&
            sid1.fx === sid2.fx
        ) {
            return true;
        }

        return false;
    },

    Copy(dst, src){
        dst.shad = 0x0;        dst.shad |= src.shad;
        dst.attr = 0x0;        dst.attr |= src.attr;
        dst.attr = 0x0;        dst.attr |= src.attr;
        dst.unif = 0x0;        dst.unif |= src.unif;
        dst.pass = 0x0;        dst.pass |= src.pass;
        dst.gfx_group = 0x0;
    },

    ToString(sid){
        return `shad:${sid.shad} attr:${sid.attr} unif:${sid.unif} pass:${sid.pass}`
    },

    GetTypeToString(sid){

        let str = ['','','',''];
        let k = 0;

        if (sid.shad) str[k] += 'ShaderProperties:'
        if (sid.shad & SID.SHAD.INDEXED) str[k] += 'IndexedGeometry, '
        if (sid.shad & SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X) str[k] += 'ConectedFaces, '
        if (sid.shad & SID.SHAD.INDEXED_PATT_DISCONTINUE_4) str[k] += 'VertexBreak-4, '
        if (sid.shad & SID.SHAD.INDEXED_PATT_DISCONTINUE_6) str[k] += 'VertexBreak-, '
        if (sid.shad & SID.SHAD.PRE_MULTIPLIED_ALPHA) str[k] += 'Premultiplied Alpha, '
        // if (sid.shad) str[k] += '\n'
    
        k++;
        if (sid.attr) str[k] += 'Attribs:'
        if (sid.attr & SID.ATTR.COL4) str[k] += 'col4, '
        if (sid.attr & SID.ATTR.COL4_PER_VERTEX) str[k] += 'col4_per_vertex, '
        if (sid.attr & SID.ATTR.POS2) str[k] += 'pos2, '
        if (sid.attr & SID.ATTR.DIM2) str[k] += 'dim2, '
        if (sid.attr & SID.ATTR.SCALE2) str[k] += 'scale2, '
        if (sid.attr & SID.ATTR.TEX2) str[k] += 'tex2, '
        if (sid.attr & SID.ATTR.WPOS_TIME4) str[k] += 'wpos4, '
        if (sid.attr & SID.ATTR.TIME) str[k] += 'time, '
        if (sid.attr & SID.ATTR.SDF) str[k] += 'Sdf, '
        if (sid.attr & SID.ATTR.MSDF) str[k] += 'Msdf, '
        if (sid.attr & SID.ATTR.GENERIC_ATTR1_VEC4) {
            str[k] += 'generir_attribs1, ';
            if (sid.attr & (SID.ATTR.STYLE)) str[k] += 'style, ';
            if (sid.attr & (SID.ATTR.BORDER & SID.ATTR.FEATHER & SID.ATTR.R_CORNERS)) str[k] += '[round corners, border width, border feather], ';
            if (sid.attr & (SID.ATTR.EMPTY)) str[k] += 'empty, ';
        }
        // if (sid.attr) str[k] += '\n'
    
        k++;
        if (sid.inst) str[k] += 'InstancedGeometry:'
        if (sid.inst & SID.INST.COL4) str[k] += 'cal4, '
        if (sid.inst & SID.INST.POS2) str[k] += 'pos2, '
        if (sid.inst & SID.INST.TEX2) str[k] += 'tex2, '
        if (sid.inst & SID.INST.WPOS_TIME4) str[k] += 'wpos4, '
        if (sid.inst & SID.INST.TIME) str[k] += 'time, '
        if (sid.inst & SID.INST.SDF) str[k] += 'sdf, '
        if (sid.inst & SID.INST.MSDF) str[k] += 'msdf, '
        if (sid.inst & SID.INST.GENERIC_ATTR1_VEC4) {
            str[k] += 'generir_attribs1, ';
            if (sid.attr & (SID.ATTR.STYLE)) str[k] += 'style, ';
            if (sid.attr & (SID.ATTR.BORDER & SID.ATTR.FEATHER & SID.ATTR.R_CORNERS)) str[k] += '[round corners, border width, border feather], ';
            if (sid.attr & (SID.ATTR.EMPTY)) str[k] += 'empty, ';
        }
        if (sid.inst & SID.INST.POS3) str[k] += 'pos3, '
        if (sid.inst & SID.INST.COL4_PER_VERTEX) str[k] += 'col4_per_vertex, '
        if (sid.inst & SID.INST.EMPTY) str[k] += 'empty, '
        // if (sid.inst) str[k] += '\n'

        k++;
        if (sid.unif) str[k] += 'Uniforms:'
        if (sid.unif & SID.UNIF.PROJECTION) str[k] += 'projection_matrix, '
        if (sid.unif & SID.UNIF.SCREEN_RESOLUTION) str[k] += 'screen_resolution, '
        if (sid.unif & SID.UNIF.ROOT_WPOS2) str[k] += 'ROOT_WPOS2, '
        if (sid.unif & SID.UNIF.TIME) str[k] += 'time, '
        if (sid.unif & SID.UNIF.COL4) str[k] += 'col4, '
        // if (sid.unif) str[k] += '\n'
    
        k++;
        if (sid.pass) str[k] += 'Passes:'
        if (sid.pass & SID.PASS.COL4) str[k] += 'col4, '
        if (sid.pass & SID.PASS.POS2) str[k] += 'pos2, '
        if (sid.pass & SID.PASS.DIM2) str[k] += 'dim2, '
        if (sid.pass & SID.PASS.WPOS2) str[k] += 'wpos2, '
        if (sid.pass & SID.PASS.TEX2) str[k] += 'tex2, '
        if (sid.pass & SID.PASS.TIME1) str[k] += 'time1, '
        if (sid.pass & SID.PASS.style3) str[k] += 'style3, '
        if (sid.pass & SID.PASS.SDF2) str[k] += 'sdf2'
        if (sid.pass & SID.PASS.GENERIC_ATTR1_VEC4) str[k] += 'generir_attribs1'
        // if (sid.pass) str[k] += '\n'
    
        return str;
    }

};

if(SID.ATTR > MAX_BIT_MASK) console.error('SID ATTR exceeding javascript\'s max number value');
if(SID.UNIF > MAX_BIT_MASK) console.error('SID UNIF exceeding javascript\'s max number value');
if(SID.PASS > MAX_BIT_MASK) console.error('SID PASS exceeding javascript\'s max number value');









// Create a copy of the SID.ATTR, so we can compare with 'sid'
const SHADER_ATTRIBUTES = SID.ATTR;





const GRAPHICS_LAYOUT = {
    ONE_ATTR_SIZE: 1,
    ATTR_SIZES: {
        COL4: 4,
        WPOS4: 4,
        GENERIC_ATTR1_VEC4: 4,
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
const MAX_VERTEX_BUFFER_SIZE = 64;
const MAX_INDEX_BUFFER_SIZE = 64;
const INDICES_PER_RECT = 6;
const VERTS_PER_RECT = 6;
const VERTS_PER_RECT_INDEXED = 4;
// const INDEX_BUFFER_TRIANGLE_INDICES = 4;

const V_COL_COUNT = 4; // Number of floats for vertex buffer's attribute
const V_POS_COUNT = 2;
const V_SCALE_COUNT = 2;
const V_TEX_COUNT = 2;
const V_WPOS_COUNT = 3;
const V_WPOS_TIME_COUNT = 4; // Use the 4th element for the time attribute 
const V_STYLE_COUNT = 3;
const V_BORDER_WIDTH = 1, V_BORDER_FEATHER = 1, V_ROUND_CORNERS = 1;
const V_TIME_COUNT = 1;
const V_GENERIC_ATTR1_VEC4_COUNT = 4;
const V_SDF_COUNT = 2;

// The style's buffer attribute strides(buffer indexes) 
const V_ROUND_CORNER_STRIDE = 0;
const V_BORDER_WIDTH_STRIDE = 1;
const V_BORDER_FEATHER_STRIDE = 2;








_CNT = 0x1;
const MESH_ENABLE = {

    GFX: {

        UNIF_RESOLUTION: 1,
        UNIFORM: _CNT <<= 1,
        UNIF_TIMER: _CNT <<= 1,
        ATTR_DIM2: _CNT <<= 1,
        ATTR_TIME: _CNT <<= 1,
        ATTR_STYLE: _CNT <<= 1,
        ATTR_COL4_PER_VERTEX: _CNT <<= 1,
        
        FX_GLOW: _CNT <<= 1,
        FX_NOISE: _CNT <<= 1,
        FX_SMOKE: _CNT <<= 1,

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

    
    /** If any of the options fail to find match, then new vertex buffer is created */
    
    ANY: _CNT <<= 0x1, // Match any vertex buffer.
    NEW: _CNT <<= 0x1, // Create a new vertex buffer.
    SPECIFIC: _CNT <<= 0x1, // Use specific indexes for vertex buffer and program. // TODO: program maybe no longer required, vb has a sid
    
    PRIVATE: _CNT <<= 0x1, // Private will initiate the 'find buffer from...' functionality 
    // So 'Private' is used along with one of the bellow: 
    FROM_ROOT_WIDGET: _CNT <<= 0x1, // Check from root descending
    FROM_PARENT_ASC: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent tree ascending.
    FROM_PARENT_DSC: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent tree descending.
    FROM_PARENT_CHLDREN_DESC: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent children

    // UNUSED
    // These are prioritized over all other above options.
    STATIC: _CNT <<= 0x1, // Choose a buffer that is going to be updated rarely
    DYNAMIC: _CNT <<= 0x1, // Choose a buffer that is going to be updated every frame

   
};








_CNT = 0x1;
const BUFFER_STATE = {

    // SHOW: _CNT,
    NEEDS_UPDATE: _CNT,
    // IS_PRIVATE: _CNT <<= 0x1,
    IS_ACTIVE: _CNT <<= 0x1,
};








_CNT = 0x1;
const GFX_POOL_REQUESTS = {

    ANY: _CNT,
    // FIRST_SMALL: _CNT <<= 0x1,
    // FIRST_LARGE: _CNT <<= 0x1,
    SMALLEST: _CNT <<= 0x1,
    LARGEST: _CNT <<= 0x1,
};








_CNT = 0x1;
const BUFFER_TYPE = {

    FLOAT32: _CNT,
    UINT16: _CNT <<= 0x1,

    ToString(mask) {

        let str = '';
        if (mask & this.FLOAT32) str += '{FLOAT32}'
        if (mask & this.UINT16) str += '{UINT16}'

        return str;
    },
}








_CNT = 0x1;
const PROGRAM_STATE = {
    ACTIVE: _CNT, // UNNECESSARY: Possibly has no usefuleness
    UNIFORMS_NEED_UPDATE: _CNT <<= 0x1,
    // NEEDS_UPDATE: _CNT <<= 0x1,

    ToString(mask) {

        let str = '';
        if (mask & this.ACTIVE) str += '{ACTIVE}'
        if (mask & this.UNIFORMS_NEED_UPDATE) str += '{UNIFORMS_NEED_UPDATE}'

        return str;
    },
};








/*************************************************************************************************/
// UNIFORMS

_CNT = 0x1;
const UNIFORM = {
    NULL: 0x0,
    IN_VS: _CNT,
    IN_FS: _CNT<<=0x1,
    IS_SHARED: _CNT<<=0x1,
}



// const TEMP_UNIFORM_BUFFER_INDEXES = {
//     U_WPOS: INT_NULL, // Stores the index of the wpos uniform of theWill be set by the Program, wwhen the uniform
// }



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

    ID:'UNIF_TYPE',

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


	GetSizeInBytes(type, id) {

		if (id === undefined || id !== this.ID) alert('type not match');

		let size = 0;
		if (type === this.FLOAT) size += FLOAT32_BYTE_SIZE;
		// else if (type & this.INT8 || type & this.UINT8) size += INT8_BYTE_SIZE;
		// else if (type & this.INT16 || type & this.UINT16) size += INT16_BYTE_SIZE;
		else if (type === this.INT || type === this.UINT) size += INT32_BYTE_SIZE;
		else if (type === this.FVEC2) size += VEC2_BYTE_SIZE;
		else if (type === this.FVEC3) size += VEC3_BYTE_SIZE;
		else if (type === this.FVEC4) size += VEC4_BYTE_SIZE;
		else if (type === this.MAT2) size += MAT2X2_BYTE_SIZE;
		else if (type === this.MAT4) size += MAT4X4_BYTE_SIZE;

		return size;
	},


    GetStr(type){
        switch(type){
            case this.FLOAT:  return 'float';
            case this.FVEC2:  return 'vec2';
            case this.FVEC3:  return 'vec3';
            case this.FVEC4:  return 'vec4';
            case this.MAT2:  return 'mat2';
            case this.MAT3:  return 'mat3';
            case this.MAT4:  return 'mat4';
            case this.INT:  return 'int';
            case this.BOOL:  return 'int';
            case this.IVEC2:  return 'vec2';
            case this.IVEC3:  return 'vec3';
            case this.UIVEC4: return 'vec4'; 
            case this.UINT:  return 'int';
            case this.UIVEC2: return 'vec2'; 
            case this.UIVEC3: return 'vec3'; 
            case this.UIVEC4: return 'vec4';
            default: alert('Wrong type. See UNIF_TYPE .GetStr()') 
        }
    }
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

