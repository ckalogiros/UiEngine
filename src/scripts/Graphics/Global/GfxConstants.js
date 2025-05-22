"use strict";

/*******************************************************************************************************************************************************/
// Graphics Globals


const gfxCtx = {
    gl: null,
    extentions_string: '', 
    ext: null,
};








const GL_STATE = {
    BOUND_PROG_IDX: INT_NULL, // The current bound gl program index
    BOUND_PROG: INT_NULL, // The current bound gl program 
    BOUND_VAO: INT_NULL, // The current bound vertex array  
    BOUND_VBO: INT_NULL, // The current bound vertex buffer 
    BOUND_VBIDX: INT_NULL, // The current bound vertex buffer index
    BOUND_IBO: INT_NULL, // The current bound vertex buffer 
    BOUND_IBIDX: INT_NULL, // The current bound vertex buffer index
    BOUND_TEXTURE_IDX: INT_NULL, // The current bound texture index 
    // BOUND_TEXTURE_UNIT_ID: INT_NULL, // The current bound texture 

    Reset(){
        this.BOUND_PROG_IDX = INT_NULL;
        this.BOUND_PROG = INT_NULL;
        this.BOUND_VAO = INT_NULL;
        this.BOUND_VBO = INT_NULL;
        this.BOUND_VBIDX = INT_NULL;
        this.BOUND_IBO = INT_NULL;
        this.BOUND_IBIDX = INT_NULL;
        this.BOUND_TEXTURE_IDX = INT_NULL;
    }
};


/** This is a special character used in shader code, to denote that a (uniform) variable is to be 'collected' so that the application can use the uniform's name  */
const u = '_';











/**
 * SID: Shader Type ID, for creating different _glPrograms with 
 * different vertex and fragment shaders bbbased uppon the input attribbutes, input uniforms and other properties.
 * Shader creation flags 
 */

let BIT1 = 0x1, BIT2 = 0x1, BIT3 = 0x1, BIT4 = 0x1, BIT5 = 0x1, BIT6 = 0x1, BIT7 = 0x1, BIT8 = 0x1, BITTEST = 0x1;
const SID = {

    SHAD: {
        INDEXED: BIT1,
        INDEXED_PATT_CONNECTED_FACES_X: BIT1 <<= 1,
        INDEXED_PATT_DISCONTINUE_4: BIT1 <<= 1, // Break vertex indices
        INDEXED_PATT_DISCONTINUE_6: BIT1 <<= 1, // Break vertex indices
        PRE_MULTIPLIED_ALPHA: BIT1 <<= 1,
        ENABLE_SRC_COLOR_IN_FRAG_MAIN: BIT1 <<= 1,

        // Shader Color Manipulation Functions
        FN_NOISE: BIT1 <<= 1,
        FN_NOISE2: BIT1 <<= 1,
        FN_GLOW: BIT1 <<= 1,
        FN_INNER_SHADOW: BIT1 <<= 1,
        FN_EXPLOSION_CIRCLE: BIT1 <<= 1,
        FN_EXPLOSION_GLOW: BIT1 <<= 1,
        FN_GLOW_SPHERE: BIT1 <<= 1,
        FN_NOISE_WORLEY_1: BIT1 <<= 1,
        FN_NOISE_WORLEY_2: BIT1 <<= 1,
        FN_NOISE_WORLEY_3_TYPES: BIT1 <<= 1,
        FN_NOISE_WORLEY_3D: BIT1 <<= 1,
        FN_NOISE_VORONOI_1: BIT1 <<= 1,
        FN_NOISE_VORONOI_2: BIT1 <<= 1,
        

        // Test Shaders
        FS_TEST1: BIT1 <<= 1,
        FS_TEST2: BIT1 <<= 1,
        FS_TEST3: BIT1 <<= 1,
        FS_TEST4: BIT1 <<= 1,
        FS_TEST5: BIT1 <<= 1,
    },
    
    SHADER_OPERATIONS: {
        DIST_RECT_FILLED: BIT8 <<= 1,
        SIMPLE_GLOW: BIT8 <<= 1,
        SIMPLE_GLOW2: BIT8 <<= 1,
        SIMPLE_GLOW2_RECT: BIT8 <<= 1,
        BUBBLE: BIT8 <<= 1,
        FLARE: BIT8 <<= 1,
        INNER_SHADOW_CIRCLE: BIT8 <<= 1,
        INNER_SPECULAR_CIRCLE: BIT8 <<= 1,
        
        SDF_RECT: BIT8 <<= 1,
        OUTER_GLOW_RECT: BIT8 <<= 1,
        INNER_SHADOW_RECT: BIT8 <<= 1,
        OUTER_SHADOW_RECT: BIT8 <<= 1,
        INNER_SHADOW_RECT2: BIT8 <<= 1,
        
        // Test Copies
        SDF_RECT_TEST_WITH_GENERIC_SLIDERS: BIT8 <<= 1,


        GROUP_SDF_RECT:0x0,
    },

    ATTR: {},

    INST:{
        COL4: BIT3,
        VPOS2: BIT3 <<= 1,
        TEX2: BIT3 <<= 1,
        WPOS3: BIT3 <<= 1,
        TIME: BIT3 <<= 1,
        SDF: BIT3 <<= 1,
        MSDF: BIT3 <<= 1,
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
        COL4: BIT5 <<= 0x1,         // u_col4
        DIM2: BIT5 <<= 0x1,         // u_dim2
        U_SCALE_VEC2: BIT5 <<= 0x1,       // u_scale2
        BLEND_MODE: BIT5 <<= 0x1,       // u_scale2
        ROOT_WPOS2: BIT5 <<= 0x1,   // u_wposxy
        FS_TIME_FLOAT: BIT5 <<= 0x1,         // u_time
        FS_RCORNERS_FLOAT: BIT5<<=0x1,
        FS_RCORNERS_VEC2: BIT5<<=0x1,
        FS_RCORNERS_VEC3: BIT5<<=0x1,
        FS_GLOW_VEC3: BIT5<<=0x1,
        // Generic Uniforms
        FS_GENERIC_CONTROLS: BIT5<<=0x1,


    },

    BLEND_OPTIONS: {
        // BLEND_MODE_ACTIVE: BIT7 <<= 0x1, 
        BLEND_MODE_ADD: BIT7 <<= 0x1, 
        BLEND_MODE_LIGHTEN: BIT7 <<= 0x1, 
        BLEND_MODE_MULTIPLY: BIT7 <<= 0x1, 
        BLEND_MODE_DIVIDE: BIT7 <<= 0x1, 
        BLEND_MODE_SUBTRACT: BIT7 <<= 0x1, 
        BLEND_MODE_DARKEN: BIT7 <<= 0x1, 
        BLEND_MODE_COLOR_BURN: BIT7 <<= 0x1, 
        BLEND_MODE_COLOR_DODGE: BIT7 <<= 0x1, 
        BLEND_MODE_SCREEN: BIT7 <<= 0x1, 
        BLEND_MODE_OVERLAY: BIT7 <<= 0x1, 
        BLEND_MODE_MIX: BIT7 <<= 0x1, 
        BLEND_MODE_MASK: BIT7 <<= 0x1, 
        BLEND_MODE_ALPHA: BIT7 <<= 0x1, 

        BLEND_MODE_REMOVE_B_FROM_A: BIT7 <<= 0x1, 
    },



};






// TODO: Create a smaller buffer that ca resize its self
const MAX_VERTEX_BUFFER_SIZE = 100000;
const MAX_INDEX_BUFFER_SIZE = 10000;
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
const V_GENERIC2_COUNT = 2;

// The style's buffer attribute strides(buffer indexes) 
const V_ROUND_CORNER_STRIDE = 0;
const V_BORDER_WIDTH_STRIDE = 1;
const V_BORDER_FEATHER_STRIDE = 2;







// TODO: Deprecated
_CNT = 1;
const MESH_ENABLE = {

    GFX: {

    //     // ATTR_VPOS2: _CNT++,
    //     ATTR_DIM2: _CNT++,
    //     ATTR_TEX2: _CNT++,
    //     ATTR_TIME: _CNT++,
    //     ATTR_ANGLE: _CNT++,
    //     ATTR_R_CORNERS: _CNT++,
    //     ATTR_FEATHER: _CNT++,
    //     ATTR_BORDER: _CNT++,
    //     ATTR_GLOW_INTENSITY: _CNT++,
    //     ATTR_COL4_PER_VERTEX: _CNT++,
    //     ATTR_GENERIC_VEC2: _CNT++,
        
    //     UNIF_RESOLUTION: _CNT++,
    //     UNIFORM: _CNT++, // TODO: NOT NEEDED????
    //     UNIF_TIME: _CNT++,
        
    //     // FX_GLOW: _CNT++,
    //     FN_NOISE: _CNT++,
    //     FX_SMOKE: _CNT++,
        
    //     // Pass from vertex to fragment shader
    //     PASS_COL4: _CNT++,
    //     PASS_WPOS3: _CNT++,
    //     PASS_WPOS2: _CNT++,
    //     PASS_VPOS2: _CNT++,
    //     PASS_DIM2: _CNT++,
    //     PASS_TIME1: _CNT++,
    //     PASS_RES2: _CNT++,

    //     // Enable blending function for blending colors in fragment shader 
    //     BLEND_OPTIONS: _CNT++, 

    //     // Shader Color Functions
    //     FN_GLOW: _CNT++,
    //     FN_EXPLOSION_CIRCLE: _CNT++,
    //     FN_EXPLOSION_GLOW: _CNT++,
    //     FN_INNER_SHADOW: _CNT++,
    //     FN_GLOW_SPHERE: _CNT++,
    //     FN_NOISE_WORLEY: _CNT++,
    //     FN_NOISE_VORONOI: _CNT++,

    //     TEST_SHADERS_1: _CNT++,
    //     TEST_SHADERS_2: _CNT++,
    //     TEST_SHADERS_3: _CNT++,
    //     TEST_SHADERS_4: _CNT++,
    //     TEST_SHADERS_5: _CNT++,

    //     NONE: 0,
    },
}



// This is a global storage of vertex buffer indexes concerning specific types of meshes been drawn together(like scrollers)
// TODO: Remove and render scrollers ordinarely
const GFX_VBIDX_RENAME_ME = {
    SCROLLER_VB_IDX: INT_NULL,


    Reset(){
        this.SCROLLER_VB_IDX = INT_NULL;
    }
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
    FROM_PARENT_ASC_SEARCH_ALL: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent tree ascending.
    FROM_PARENT_DSC: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent tree descending.
    FROM_PARENT_CHILDREN_DESC: _CNT <<= 0x1, // Choose the first match (sid match) from mesh's parent children

    ABSOLUTE_POSITION: _CNT <<= 0x1, // Any vertex buffer with a unif wposition will not draw from the scenen's position 


    // For vertex buffers to be used for meshes at the scene level(NO private OR private for specific meshes)
    SCROLLER_VB: _CNT <<= 0x1, // TODO: The index of the scroller meshes must be stored globaly?????


    // Render groups
    NEW_RENDER_GROUP: _CNT<<=0x1,
    PRIVATE_RENDER_GROUP: _CNT<<=0x1, // Enable the explicit usage of the current render group


    // UNUSED
    // These are prioritized over all other above options.
    STATIC: _CNT <<= 0x1, // Choose a buffer that is going to be updated rarely
    DYNAMIC: _CNT <<= 0x1, // Choose a buffer that is going to be updated every frame

   
};








_CNT = 0x1;
const BUFFER_STATE = {

    // SHOW: _CNT,
    NEEDS_UPDATE: _CNT,
    NEEDS_UPDATE_FROM_REALLOC: _CNT,
    // IS_PRIVATE: _CNT <<= 0x1,
    IS_ACTIVE: _CNT <<= 0x1,
    IS_PRIVATE: _CNT <<= 0x1,
};








_CNT = 0x1;
const GFX_POOL_REQUESTS = {

    ANY: _CNT,
    // FIRST_SMALL: _CNT <<= 0x1,
    // FIRST_LARGE: _CNT <<= 0x1,
    SMALLEST: _CNT <<= 0x1,
    LARGEST: _CNT <<= 0x1,
    BEST_FIT: _CNT <<= 0x1,
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
const BOUND_TEXTURE = {
    texidx: -1,
};







_CNT=0x1;
const UNIF_TYPE = {

    ID:'UNIF_TYPE',

    FLOAT: _CNT, // FLOAT
    FVEC1: _CNT<<=0x1, // _VEC1
    FVEC2: _CNT<<=0x1, // _VEC2
    FVEC3: _CNT<<=0x1, // _VEC3
    FVEC4: _CNT<<=0x1, // _VEC4
    FARR: _CNT<<=0x1, // FLOAT ARRAY
    MAT2: _CNT<<=0x1, // _MAT2
    MAT3: _CNT<<=0x1, // _MAT3
    MAT4: _CNT<<=0x1, // _MAT4
    INT: _CNT<<=0x1, // INT, 
    BOOL: _CNT<<=0x1, // BOOL 
    IVEC2: _CNT<<=0x1, // _VEC2
    IVEC3: _CNT<<=0x1, // _VEC3
    UIVEC4: _CNT<<=0x1, // _VEC4

    UINT: _CNT<<=0x1, // UINT
    UIVEC2: _CNT<<=0x1, // _VEC2
    UIVEC3: _CNT<<=0x1, // _VEC3
    UIVEC4: _CNT<<=0x1, // _VEC4
    
    // FLOAT: 0x1406, // FLOAT
    // FVEC2: 0x8b50, // _VEC2
    // FVEC3: 0x8b51, // _VEC3
    // FVEC4: 0x8b52, // _VEC4
    // FVEC6: 0x8b52, // _VEC5
    // MAT2: 0x8b5a, // _MAT2
    // MAT3: 0x8b5b, // _MAT3
    // MAT4: 0x8b5c, // _MAT4
    // INT: 0x8b56, // INT, 
    // BOOL: 0x8b53, // BOOL 
    // IVEC2: 0x8b57, // _VEC2
    // IVEC3: 0x8b58, // _VEC3
    // UIVEC4: 0x8b59, // _VEC4

    // UINT: 0x1405, // UINT
    // UIVEC2: 0x8dc6, // _VEC2
    // UIVEC3: 0x8dc7, // _VEC3
    // UIVEC4: 0x8dc8, // _VEC4


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
            case this.FARR:  return 'float';
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



function TEMP_Shader_operation_get_name_by_id(shader_op) {

    if(shader_op & SID.SHADER_OPERATIONS.SIMPLE_GLOW) return 'SIMPLE_GLOW';
    else if(shader_op & SID.SHADER_OPERATIONS.DIST_RECT_FILLED) return 'DIST_RECT_FILLED';
    else if(shader_op & SID.SHADER_OPERATIONS.SIMPLE_GLOW2) return 'SIMPLE_GLOW2';
    else if(shader_op & SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT) return 'SIMPLE_GLOW2_RECT';
    else if(shader_op & SID.SHADER_OPERATIONS.BUBBLE) return 'BUBBLE';
    else if(shader_op & SID.SHADER_OPERATIONS.FLARE) return 'FLARE';
    else if(shader_op & SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE) return 'INNER_SHADOW_CIRCLE';
    else if(shader_op & SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE) return 'INNER_SPECULAR_CIRCLE';
    else if(shader_op & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2) return 'INNER_SHADOW_RECT2';
    else if(shader_op & SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT) return 'OUTER_SHADOW_RECT';
    else if(shader_op & SID.SHADER_OPERATIONS.SDF_RECT) return 'SDF_RECT';
    else if(shader_op & SID.SHADER_OPERATIONS.OUTER_GLOW_RECT) return 'OUTER_GLOW_RECT';
    else if(shader_op & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT) return 'INNER_SHADOW_RECT';
    else return 'NULL';
}




