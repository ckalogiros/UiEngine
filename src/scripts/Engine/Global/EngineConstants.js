"use strict";


const PI = 3.14159;


let _CNT = 0x1;


const INT_NULL = -1; // For case like 0 index arrays, where the number 0 index cannot be used as null element for a buffer


const MAX_INT8 = 127;
const MIN_INT8 = -128;
const MAX_INT16 = 32767;
const MIN_INT16 = -32768;
const MAX_INT32 = 0x7FFFFFFF; // 2147483647;
const MIN_INT32 = -2147483648;
// const MAX_INT64 =  0x7FFFFFFFFFFFFFFF; // 9223372036854775807
// const MINX_INT64 = -9223372036854775808;
const MAX_UINT8 = 0xff; // 255
const MAX_UINT16 = 65535;
const MAX_UINT32 = 0xFFFFFFFF; // 4294967295;
const MAX_UINT64 = 0xFFFFFFFFFFFFFFFFn; // 18446744073709551615 ;

const MAX_BIT_MASK = 0xFFFFFFFFFFFFF;
const MAX_BIT_MASK_COMBINATIONS = 52;

const MILLISEC_TO_SEC 		= 0.001;
const MILLISEC_TO_MICROSEC = 1000;
const MILLISEC_TO_NANOSEC 	= 1000000;


const ALL = 0xffff;



const FAKE_LISTEN_EVENT = true;



const UNCHANGED = 0xffff; // Just a flag, used for checking if a value should change or remain the same.


const _ = undefined;


const NO_MESH_PARENT = INT_NULL; // Just a flag, as a way to check if the parent of a mesh is not null but is not part of the parent's children buffer either.


// For renderqueue
const FIRST = 1;
const LAST = 2;


const TEST_CLIP_TOP = -10000;
const TEST_CLIP_BOTTOM = 10000;
const TEST_CLIP_LEFT = 0;
const TEST_CLIP_RIGHT = 10000;

const RESERVED_MESH = true; // Just for check in Str_buffer. The Create_widget.. function reserves a _mesh_buffer element by setting it to 'true'. So instead of checking against blant  true value, we give it a meaning 


const OUT_OF_VIEW = 100000; // Out of screen view in pixels


const MAX_NAME_LENGTH = 13;







// Type Sizes in bytes
const INT8_BYTE_SIZE = 1; // 1 Bytes
const INT16_BYTE_SIZE = 2; // 2 Bytes
const INT32_BYTE_SIZE = 4; // 4 Bytes
const UINT8_BYTE_SIZE = 1; // 1 Bytes
const UINT16_BYTE_SIZE = 2; // 2 Bytes
const UINT32_BYTE_SIZE = 4; // 4 Bytes
const FLOAT32_BYTE_SIZE = 4; // 4 Bytes
const VEC2_BYTE_SIZE = 2 * FLOAT32_BYTE_SIZE; // 8 Bytes
const VEC3_BYTE_SIZE = 3 * FLOAT32_BYTE_SIZE; // 12 Bytes
const VEC4_BYTE_SIZE = 4 * FLOAT32_BYTE_SIZE; // 16 Bytes
const MAT2X2_BYTE_SIZE = 2 * VEC2_BYTE_SIZE; // 16 Bytes
const MAT4X4_BYTE_SIZE = 4 * VEC4_BYTE_SIZE; // 64 Bytes



const BITWISE = {
   x1:  0x1n  ,
   x2:  0x3n  ,
   x3:  0x7n  ,
   x4:  0xfn  ,
   x5:  0x1fn ,
   x6:  0x3fn ,
   x7:  0x7fn ,
   x8:  0xffn ,
   x9:  0x1ffn  ,
   x10: 0x3ffn  ,
   x11: 0x7ffn  ,
   x12: 0xfffn  ,
   x13: 0x1fffn ,
   x14: 0x3fffn ,
   x15: 0x7fffn ,
   x16: 0xffffn,
   x17: 0x1ffffn  ,
   x18: 0x3ffffn  ,
   x19: 0x7ffffn  ,
   x20: 0xfffffn  ,
   x21: 0x1fffffn ,
   x22: 0x3fffffn ,
   x23: 0x7fffffn ,
   x24: 0xffffffn,
   x25: 0x1ffffffn  ,
   x26: 0x3ffffffn  ,
   x27: 0x7ffffffn  ,
   x28: 0xfffffffn  ,
   x29: 0x1fffffffn ,
   x30: 0x3fffffffn ,
   x31: 0x7fffffffn ,
   x32: 0xffffffffn,
   x33: 0x1ffffffffn  ,
   x34: 0x3ffffffffn  ,
   x35: 0x7ffffffffn  ,
   x36: 0xfffffffffn  ,
   x37: 0x1fffffffffn ,
   x38: 0x3fffffffffn ,
   x39: 0x7fffffffffn ,
   x40: 0xffffffffffn,
   x41: 0x1ffffffffffn  ,
   x42: 0x3ffffffffffn  ,
   x43: 0x7ffffffffffn  ,
   x44: 0xfffffffffffn  ,
   x45: 0x1fffffffffffn ,
   x46: 0x3fffffffffffn ,
   x47: 0x7fffffffffffn ,
   x48: 0xfffffffffffffn,
   x49: 0x1ffffffffffffn  ,
   x50: 0x3ffffffffffffn  ,
   x51: 0x7ffffffffffffn  ,
   x52: 0xfffffffffffffn  ,
   x53: 0x1fffffffffffffn ,
   x54: 0x3fffffffffffffn ,
   x55: 0x7fffffffffffffn ,
   x56: 0xffffffffffffffn,
   x57: 0x1ffffffffffffffn  ,
   x58: 0x3ffffffffffffffn  ,
   x59: 0x7ffffffffffffffn  ,
   x60: 0xfffffffffffffffn  ,
   x61: 0x1fffffffffffffffn ,
   x62: 0x3fffffffffffffffn ,
   x63: 0x7fffffffffffffffn ,
   x64: 0xffffffffffffffffn,
};
// const BITWISE = {
//    x1:  { mask:0x1n, 					pos: 0, },
//    x2:  { mask:0x3n, 					pos: 1, },
//    x3:  { mask:0x7n, 					pos: 2, },
//    x4:  { mask:0xfn, 					pos: 3, },
//    x5:  { mask:0x1fn, 					pos: 4, },
//    x6:  { mask:0x3fn, 					pos: 5, },
//    x7:  { mask:0x7fn, 					pos: 6, },
//    x8:  { mask:0xffn, 					pos: 7, },
//    x9:  { mask:0x1ffn, 					pos: 8, },
//    x10: { mask:0x3ffn, 					pos: 9, },
//    x11: { mask:0x7ffn, 					pos: 10, },
//    x12: { mask:0xfffn, 					pos: 11, },
//    x13: { mask:0x1fffn, 				pos: 12, },
//    x14: { mask:0x3fffn, 				pos: 13, },
//    x15: { mask:0x7fffn, 				pos: 14, },
//    x16: { mask:0xffffn, 				pos: 15, },
//    x17: { mask:0x1ffffn, 				pos: 16, },
//    x18: { mask:0x3ffffn, 				pos: 17, },
//    x19: { mask:0x7ffffn, 				pos: 18, },
//    x20: { mask:0xfffffn, 				pos: 19, },
//    x21: { mask:0x1fffffn, 				pos: 20, },
//    x22: { mask:0x3fffffn, 				pos: 21, },
//    x23: { mask:0x7fffffn, 				pos: 22, },
//    x24: { mask:0xffffffn, 				pos: 23, },
//    x25: { mask:0x1ffffffn, 			pos: 24, },
//    x26: { mask:0x3ffffffn, 			pos: 25, },
//    x27: { mask:0x7ffffffn, 			pos: 26, },
//    x28: { mask:0xfffffffn, 			pos: 27, },
//    x29: { mask:0x1fffffffn, 			pos: 28, },
//    x30: { mask:0x3fffffffn, 			pos: 29, },
//    x31: { mask:0x7fffffffn, 			pos: 30, },
//    x32: { mask:0xffffffffn, 			pos: 31, },
//    x33: { mask:0x1ffffffffn, 			pos: 32, },
//    x34: { mask:0x3ffffffffn, 			pos: 33, },
//    x35: { mask:0x7ffffffffn, 			pos: 34, },
//    x36: { mask:0xfffffffffn, 			pos: 35, },
//    x37: { mask:0x1fffffffffn, 		pos: 36, },
//    x38: { mask:0x3fffffffffn, 		pos: 37, },
//    x39: { mask:0x7fffffffffn, 		pos: 38, },
//    x40: { mask:0xffffffffffn, 		pos: 39, },
//    x41: { mask:0x1ffffffffffn, 		pos: 40, },
//    x42: { mask:0x3ffffffffffn, 		pos: 41, },
//    x43: { mask:0x7ffffffffffn, 		pos: 42, },
//    x44: { mask:0xfffffffffffn, 		pos: 43, },
//    x45: { mask:0x1fffffffffffn, 		pos: 44, },
//    x46: { mask:0x3fffffffffffn, 		pos: 45, },
//    x47: { mask:0x7fffffffffffn, 		pos: 46, },
//    x48: { mask:0xfffffffffffffn,		pos: 47, },
//    x49: { mask:0x1ffffffffffffn, 	pos: 48, },
//    x50: { mask:0x3ffffffffffffn, 	pos: 49, },
//    x51: { mask:0x7ffffffffffffn, 	pos: 50, },
//    x52: { mask:0xfffffffffffffn, 	pos: 51, },
//    x53: { mask:0x1fffffffffffffn, 	pos: 52, },
//    x54: { mask:0x3fffffffffffffn, 	pos: 53, },
//    x55: { mask:0x7fffffffffffffn, 	pos: 54, },
//    x56: { mask:0xffffffffffffffn, 	pos: 55, },
//    x57: { mask:0x1ffffffffffffffn, 	pos: 56, },
//    x58: { mask:0x3ffffffffffffffn, 	pos: 57, },
//    x59: { mask:0x7ffffffffffffffn, 	pos: 58, },
//    x60: { mask:0xfffffffffffffffn, 	pos: 59, },
//    x61: { mask:0x1fffffffffffffffn, pos: 60, },
//    x62: { mask:0x3fffffffffffffffn, pos: 61, },
//    x63: { mask:0x7fffffffffffffffn, pos: 62, },
//    x64: { mask:0xffffffffffffffffn, pos: 63, },
// };







// In order to update the correct uniform of a uniform block, we store the index to the block'a uniform location.
const UBS = {
	PROJECTION_LOC: INT_NULL,
	RESOLUTION_LOC: INT_NULL,
	TIME_LOC: INT_NULL,
};








let _idx = 0;
/*************************************************************************************************/
// Application Constants 
const PLATFORM = {
	WIN_NT_IMPL: false,
	WIN_PHONE_IMPL: false,
	ANDROID_IMPL: false,
	I_PHONE_IMPL: false,
	BLACK_BERRY_IMPL: false,
	ANY_SMARTPHONE_DEVICE: false,
}








/*************************************************************************************************/
// Engine Constants
const DEVICE = {
	MAX_WIDTH: 1600,
	MAX_HEIGHT: 800,
	width: 0,
	height: 0,
	ratio: 1, // Create same proportions throughout any device. It measures the ratio of the game's build device width and the current device width
	device_scale:1, // Scale fonts depending on the device platform
	info:{},
}








const VIEWPORT = {
	WIDTH: 0,
	HEIGHT: 0,
	LEFT: 0,
	RIGHT: 0,
	TOP: 0,
	BOTTOM: 0,
	ratio: 0,
	MARGIN: {
		LEFT: 0,
		RIGHT: 0,
		TOP: 0,
		BOTTOM: 0,
	},
};








const STATE = {

	scene: {
		active: null,
		active_idx: null,
		scroll_enable: true,
	},

	loop: {
		paused: false,
	},

	mesh: {
		hovered: null,
		hoveredIdx: INT_NULL,

		clicked: null,
		clickedIdx: INT_NULL,

		grabed: null,
		grabedIdx: INT_NULL,

		focused: null,
		focusedIdx: INT_NULL,

		click_hold: null,
		click_holdidx: INT_NULL,

	},

	mouse: {

		activeClickedButtonId: INT_NULL,
	},


};








_CNT = 0x1;
const MESH_STATE_FLAGS = {

	ACTIVE: _CNT,
	CLIPED_Y: _CNT <<= 1,
	CLIPED_X: _CNT <<= 1,

	IN_FOCUS: _CNT <<= 1,
	IN_HOVER: _CNT <<= 1,
	IN_MOVE: _CNT <<= 1,
	IN_RESIZE: _CNT <<= 1,
	IN_GRAB: _CNT <<= 1,
	IN_HOVER_COLOR: _CNT <<= 1,
	IN_HOLD_CLICK: _CNT <<= 1,
	IN_KEY_PRESS: _CNT <<= 1,
	
	IS_HOVERABLE: _CNT <<= 1,
	IS_CLICKABLE: _CNT <<= 1,
	IS_RESIZEABLE: _CNT <<= 1,
	IS_MOVABLE: _CNT <<= 1,
	IS_GRABABLE: _CNT <<= 1,
	IS_FAKE_EVENT: _CNT <<= 1,
	IS_FAKE_HOVERABLE: _CNT <<= 1,
	IS_FAKE_CLICKABLE: _CNT <<= 1,
	IS_HOVER_COLORABLE: _CNT <<= 1,
	IS_HOLD_CLICK: _CNT <<= 1,
	IS_KEY_PRESSABLE: _CNT <<= 1,

	IN_SCALE: _CNT <<= 1,
	HAS_POPUP: _CNT <<= 1,
	HAS_CLIP: _CNT <<= 1,

	// Masks for denoting a vertex buffer's uniform wpos as 'sticky, so it will be uupdated accordingly on canvas resize and scroll 
	STICKY_POSX: _CNT <<= 0x1, 
	STICKY_POSY: _CNT <<= 0x1,

};








_CNT = 0x1;
const VIEW_GROUP_STATE_FLAGS = {

	ACTIVE: _CNT, 
	IS_VB_ACTIVATED: _CNT <<= 0x1, // Has the vertex buffer been added to the renderqueue for rendering?
	// IS_USED:_CNT,
	IS_RENDERED: _CNT <<= 1,

	// IN_: _CNT <<= 1,

	// HAS_: _CNT <<= 1,

};






// TODO: Deprecated
_CNT = 0x1;
const SECTION = {

	VERTICAL: _CNT,
	HORIZONTAL: _CNT <<= 0x1,
	INHERIT: _CNT <<= 0x1,

	HORIZONTAL_CENTER: _CNT <<= 0x1,
	// VERTICAL_CENTER: _CNT <<= 0x1,

	RESIZE_PARENT: _CNT <<= 0x1,
	RESIZE_PARENTX: _CNT <<= 0x1,
	RESIZE_PARENTY: _CNT <<= 0x1,

	EXPAND: _CNT <<= 0x1,
	ITEM_FIT: _CNT <<= 0x1,
	ITEM_RESTRICT: _CNT <<= 0x1,

	FIXED_W: _CNT <<= 0x1,
	FIXED_H: _CNT <<= 0x1,

	NO_ITEMS_CALC: _CNT <<= 0x1,
	TOP_DOWN: _CNT <<= 0x1,
	LEFT_RIGHT: _CNT <<= 0x1,
	// STICK_TO_BOTTOM: _CNT <<= 0x1,

	INDEPENDENT: _CNT <<= 0x1,

};









_CNT = 0x1;
const COMPONENTS = {
	SCROLLER: _CNT,
}










_CNT = 0x1;
const TEXT_ALIGN = {

	LEFT: _CNT,
	RIGHT: _CNT <<= 0x1,
	TOP: _CNT <<= 0x1,
	BOTTOM: _CNT <<= 0x1,
	VERT_CENTER: _CNT <<= 0x1,
	HOR_CENTER: _CNT <<= 0x1,

	VERTICAL: _CNT <<= 0x1,
	HORIZONTAL: _CNT <<= 0x1,
}








_CNT = 0x1;
const LAYOUT = {

	HORIZONTAL: _CNT = 0x1,
	VERTICAL: _CNT <<= 0x1,
	RESIZE_SELF: _CNT <<= 0x1,
	FIXED_WIDTH: _CNT <<= 0x1,
	FIXED_HEIGHT: _CNT <<= 0x1,
	FLOAT_RIGHT: _CNT <<= 0x1,
	EXPAND: _CNT <<= 0x1,
	// PRESERVE_SELF_POS: _CNT <<= 0x1,

	// These flags take effect in the "grow" function
	GROW_HORIZONTAL: _CNT <<= 0x1, // Takes up any space from parent's fixed width
	GROW_VERTICAL: _CNT <<= 0x1, // Takes up any space from parent's fixed height
	
	// These flags are set on parent/root meshes, to denote that have children with "GROW_HORIZONTAL,GROW_VERTICAL" flags
	TYPE_GROW_CONTAINER: _CNT <<= 0x1, 
}








const POSITION_CENTER = [0, 0, 0];
const TEMP_RESIZE_MARGIN = [15, 15];




const POSSITIVE = 0;
const NEGATIVE = 0;








// SEE ## THRESHOLD
const DEFAULT_CLAMP_THRESHOLD = 200; // in pixels. Suppose to be added/sutracted to the clamp value to form an upper/lower limit
const CLAMP = {
	Y: 1, 		// The index of the value 'clampy' of the array 'clamp' of class Mesh
	Y_UP: 0, 	// Sub-Index to the value 'y upp' of the array 'clamp' of class Mesh
	Y_DOWN: 1,  // Sub-Index of the value 'y down' of the array 'clamp' of class Mesh
	X: 1, 		// The index of the value 'clampy' of the array 'clamp' of class Mesh
	X_UP: 0, 	// Sub-Index to the value 'y upp' of the array 'clamp' of class Mesh
	X_DOWN: 1,  // Sub-Index of the value 'y down' of the array 'clamp' of class Mesh

	THRESHOLD: 2, // Sub-Index (for both clampx and clampy) of the value 'threshold' of the array 'clamp' of class Mesh
}








/*************************************************************************************************/
// Widgets's Constants 
const DP_MENU_STATE = {
	ON: 0x1,   // Exists in the gfx buffer.
	OFF: 0x2,  // Not in the gfx buffer.
	OFF_FAKE: 0x4,   // Exists in the gfx but is not displayed on screen(fake removed).
};








/*************************************************************************************************/
// Loaders's Constants 
const CHAR_ARRAY_START_OFFSET = ' '.charCodeAt(0);
const CHAR_ARRAY_LETTERS_START_OFFSET = 'A'.charCodeAt(0);








/*************************************************************************************************/
// Timer's Constants 
const TIME_INTERVAL_REPEAT_ALWAYS = 9999999999; // Repeat always a time interval clbk function.

// Performance Timers indexes. WRITABLE 
const PERFORMANCE_TIMERS_IDXS = {

	GameLoop: INT_NULL,
	GlDraw: INT_NULL,
	AllTimersUpdate: INT_NULL,
	Batch: INT_NULL,
	Batch2: INT_NULL,
	SceneUpdate: INT_NULL,
	EventListener: INT_NULL,
	HoverListener: INT_NULL,
	MeshInfoTip: INT_NULL,
	FramebufferRendering: INT_NULL,
	AddToGfxRect: INT_NULL,
	AddToGfxText: INT_NULL,
	Animations: INT_NULL,
	Particles: INT_NULL,
	StaticParticles: INT_NULL,
	Particles2: INT_NULL,
	MiscTest1: INT_NULL,
	MiscTest2: INT_NULL,
	MiscTest3: INT_NULL,
	MiscTest4: INT_NULL,
}

_CNT = 0x1;
const PERFORMANCE_TIMER = {
	BASE: _CNT,
	DETAILED: _CNT <<= 0x1,
	BASE_FN_IDX: 0,
	DETAILED_FN_IDX: 1,
}







/*************************************************************************************************/
// 
_CNT = 0x1;
const ROOT_WIDGETS = {
	NULL: 0x0,
	CREATE_ROOT: _CNT,
}










function TRANSPARENCY(col, transparency) {

	// Muust make a copy, else it stores the transparency to the Global Color 
	return new Float32Array([
		col[0],
		col[1],
		col[2],
		transparency,
	]);
}








/*************************************************************************************************/
const RESOURCES_PATH = '/resources';
let g_cnt = 0;
const TEXTURE_TYPE = {
	TYPE_FONT: 0x1,
	TYPE_VARIANT_FONT: 0x1,
	TYPE_FONT_SYMBOL: 0x2,
	TYPE_TEXTURE: 0x4,
};








// Font textures
const FONT_CONSOLAS_MTSDF_1024 = 'consolas_mtsdf_1024';
const FONT_COMIC_MTSDF_1024 = 'comicz';
// Textures Atlases
const TEXTURE_ATLAS_MSDF_SYMBOLS = 'symbols';
// Textures
const TEXTURE_SMOKE1 = 'smoke_1_256';
const TEXTURE_COIN = 'Coin_1_32';
const TEXTURE_TEST_APPLE = 'apple_1_64x73';
// const TEXTURE_SNAKE_BG = 'snake_bg_ai2_1024x1024';
const TEXTURE_SNAKE_BG = 'snake_bg_cartoon2_474x474';
// Textures Atlases with variant font sizes
const ATLAS_TEXTURE_VARIANT_FONT_CONSOLA = 'atlas_variants_consola_1024x1024_8px_scale12_extended_ascii';



// Atlas Textures Variant Scales <names>
const ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES = {
	S1_0:0, 
	S1_5:1, 
	S2_0:2, 
	S2_5:3, 
	S3_0:4, 
	S3_5:5, 
	S4_0:6, 
	S5_0:7, 
	S6_0:8, 
	S7_0:9, 
	S8_0:10, 
	S9_0:11, 
	S10_0:12, 
	S12_0:13, 
};













/**
 * // TODO: Have the TEXTURES as a global var, and abstract the inner workings of texture paths, texture names, pairings and creation.
 * Also set an Init function to resolve the index of each texture name below
 */
g_cnt = 0;
const TEXTURES = {

	MTSDF_CONSOLAS_1024: g_cnt++, // index:[12]
	MTSDF_COMIC_1024: g_cnt++,
	CONSOLA_VARIANT_FONT: g_cnt++,

	TEXTURE_FONTS_COUNT: g_cnt,
	
	MTSDF_SYMBOLS:g_cnt++, // index[16]

	TEXTURE_ATLASES_COUNT: g_cnt,
	
	DEFAULT_FONT: 0x0, 
	
	// Image Textures
	SMOKE_1:g_cnt++, // g_cnt must be the index of the element in 'TEXTURE_PATHS'. // TODO: Either create the 'TEXTURE_PATHS' element at g_cnt OR set the g_cnt equual to the index this texture represents
	COIN:g_cnt++, 
	TEST_APPLE:g_cnt++, 
	SNAKE_BG:g_cnt++, 
	
	COUNT: g_cnt,
}

// Set default font texture
TEXTURES.DEFAULT_FONT = TEXTURES.CONSOLA_VARIANT_FONT;

const ATLASES_SUB_TEXTURES = { // 58 total
	MTSDF_SYMBOLS: {
		original 	: 0,
		close_1 		: 1,
		arrow_left 	: 2,
		arrow_up 	: 3,
		arrow_right : 4,
		arrow_down 	: 5,
		arrow_lr 	: 6,
		arrow_ud 	: 7,
		arrow_lu 	: 8,
		arrow_ru		: 9,
		arrow_clockwise_2		: 11,
		arrow_clockwise		: 12,
		arrow_anti_clockwise	: 13,
		arrow_thick_left		: 14,
		arrow_thick_up			: 15,
		arrow_thick_right		: 16,
		arrow_thick_down		: 17,
		circle_1					: 18,
		circle_2					: 19,
		circle_3					: 20,
		circle_4					: 21,
		tie						: 22,
		under_tie				: 23,
		close_boxed				: 24,
		diagonal_r	: 25,
		diagonal_l	: 26,
		close_2	: 27,
		_8	: 28,
		_9	: 29,
		_10: 30,
		_11: 31,
		_12: 32,
		_13: 33,
		_14: 34,
		_15: 35,
		_16: 36,
		_17: 37,
		_18: 38,
		_19: 39,
		_20: 40,
		_21: 41,
		_22: 42,
		_23: 43,
		_24: 44,
		_25: 45,
		_26: 46,
		_27: 47,
		_28: 48,
		_29: 49,
		_30: 50,
		_31: 51,
		_32: 52,
		_33: 53,
		arrow2_left : 54,
		arrow2_up 	: 55,
		arrow2_right: 56,
		arrow2_down : 57,
	}
}


function FONT_IS_MSDF(texture_file_id) {
	if(
		texture_file_id === TEXTURES.MTSDF_COMIC_1024 ||
		texture_file_id === TEXTURES.MTSDF_CONSOLAS_1024 ||
		texture_file_id === TEXTURES.MTSDF_SYMBOLS
	) return true;

	return false;
}
function FONT_IS_VARIANT(texture_file_id) {
	if(
		texture_file_id === TEXTURES.CONSOLA_VARIANT_FONT
	) return true;

	return false;
}
function TEXTURE_IS_FONT(texture_file_id) {
	if(
		texture_file_id === TEXTURES.MTSDF_COMIC_1024 ||
		texture_file_id === TEXTURES.MTSDF_CONSOLAS_1024 ||
		texture_file_id === TEXTURES.CONSOLA_VARIANT_FONT 
	) return true;

	return false;
}













/*************************************************************************************************/
// Framebuffers

_CNT = 0x0;
const FRAMEBUFFER_TYPE = {
	SCREEN_DIMENTION: 0x1, // Framebuffer's dimentions at canvas dimentions
	PORTION_DIMENTION: 0x2, // Framebuffer's dimentions are specific 
};








/*************************************************************************************************/
// Animations

_CNT = 0x1;
// let idx = 0;
let cnt2 = 0x1;
let cnt3 = 0x1;
// let cnt4 = 0x1;
const ANIMATIONS = {
	TYPE: {
		COLOR: _CNT,
		WPOS: _CNT<<=0x1,

		CYCLICAL: _CNT<<=0x1,
	},
	INDEX: {
		COLOR: INT_NULL,
		WPOS: INT_NULL,
	},
	DATA: {
		COLOR: {
			R: cnt2,
			G: cnt2 <<= 0x1,
			B: cnt2 <<= 0x1,
			A: cnt2 <<= 0x1,
			RG: cnt2 <<= 0x1,
			RB: cnt2 <<= 0x1,
			RA: cnt2 <<= 0x1,
			GB: cnt2 <<= 0x1,
			GA: cnt2 <<= 0x1,
			BA: cnt2 <<= 0x1,
			RGB: cnt2 <<= 0x1,
			RGA: cnt2 <<= 0x1,
			RBA: cnt2 <<= 0x1,
			GBA: cnt2 <<= 0x1,
			RGBA: cnt2 <<= 0x1,
		},
		POS: {
			ROT: cnt3,
			XY: cnt3 <<= 0x1,
			X: cnt3 <<= 0x1,
			Y: cnt3 <<= 0x1,
		},
	},
	Reset(){
		this.INDEX.COLOR = INT_NULL;
		this.INDEX.WPOS = INT_NULL;
	},
};


_CNT = 0x1;
const CLBK_ANIMATIONS = {

	TEXT_TRANSLATE_X:_CNT,
	TEXT_TRANSLATE_Y:_CNT<<=0x1,
	TEXT_SQUEEZE_X:_CNT<<=0x1,
	TEXT_SQUEEZE_Y:_CNT<<=0x1,
};








/*************************************************************************************************/
// Meshes  

// MESH_TYPE: A bitmask to check if a mesh is of a specific type
_CNT = 0x1n;
// MAX cnt is 31 times shifted and the 32nd is valid but a negative number
// IDEA: Maybe we implement a negative bitfield for another 31 values ???
// TODO: Not enough space for all types. Re-organize and re-implement
const MESH_TYPE = {

	DEBUG_MESH: _CNT,

	GEOMETRY2D: _CNT <<= 1n,
	GEOMETRY_LINE: _CNT <<= 1n,
	TEXT_GEOMETRY2D: _CNT <<= 1n,
	GEOMETRY3D: _CNT <<= 1n,
	CUBE_GEOMETRY: _CNT <<= 1n,

	MATERIAL: _CNT <<= 1n,
	FONT_MATERIAL: _CNT <<= 1n,
	ATLAS_TEXTURE_MATERIAL: _CNT <<= 1n,
	TEXTURE_MATERIAL: _CNT <<= 1n,

	MESH: _CNT <<= 1n,
	TEXT_MESH: _CNT <<= 1n,
	RECT_MESH: _CNT <<= 1n,
	SECTION_MESH: _CNT <<= 1n,
	SECTION_MESH_ONLY: _CNT <<= 1n,

	WIDGET_LABEL: _CNT <<= 1n,
	WIDGET_BUTTON: _CNT <<= 1n,
	WIDGET_TEXT: _CNT <<= 1n,
	WIDGET_TEXT_DYNAMIC: _CNT <<= 1n,

	WIDGET_SWITCH: _CNT <<= 1n,
	WIDGET_SWITCH_HANDLE: _CNT <<= 1n,

	WIDGET_SLIDER: _CNT <<= 1n,
	WIDGET_SLIDER_BAR: _CNT <<= 1n,
	WIDGET_SLIDER_HANDLE: _CNT <<= 1n,

	WIDGET_SCROLLER: _CNT <<= 1n,
	WIDGET_SCROLLER_BAR: _CNT <<= 1n,
	WIDGET_SCROLLER_HANDLE: _CNT <<= 1n,

	SCROLLED_SECTION: _CNT <<= 1n,
	
	WIDGET_DROP_DOWN: _CNT <<= 1n,
	DROP_DOWN_MENU: _CNT <<= 1n,
	
	PARTICLES: _CNT <<= 1n,

	RENAME_ME: _CNT <<= 1n,
	
	
		// WIDGET_POP_UP: _CNT <<= 1n,
		// WIDGET_MENU_BAR: _CNT <<= 1n,
	// WIDGET_WINDOW: _CNT <<= 1n,


	// SCENE: _CNT <<= 1n,
	// WIDGET_LABEL_TEXT_MESH_MENU_OPTIONS: _CNT <<= 1n,
	// WIDGET_LABEL_TEXT_MESH_MENU_OPTIONS: _CNT <<= 1n,

	MAX_BIT:_CNT,
};

console.log('{{{{{{{{{{{{{{{{{{{{{{{{{{{ MESH_TYPE }}}}}}}}}}}}}}}}}}}}}}}}}}}', MESH_TYPE);
if(MESH_TYPE.MAX_BIT===0n) console.error('MESH_TYPE BIT FLAGS OVERFLOW\nValue exceeded int 64');








/*************************************************************************************************/
//  Particle System  

_CNT = 0x1;
const PARTICLES = {
   HAS_START_POS_VARIATION: _CNT,
   HAS_RANDOM_POLAR_COORD: _CNT<<=0x1,
   HAS_JIGGLE: _CNT<<=0x1,
   HAS_ROTATION: _CNT<<=0x1,
   HAS_SCALE: _CNT<<=0x1,
   HAS_FADE: _CNT<<=0x1,

}









_CNT = 0x1;
const LISTEN_EVENT_TYPES = {
	HOVER: _CNT <<= 1,
	CLICK_UP: _CNT <<= 1,
	MOVE: _CNT <<= 1, // MOVE event registers with the CLICK event, no need to create new event in the ListenEvents buffer
	KEY_PRESS: _CNT <<= 1,

	NULL: _CNT <<= 1,

};









_CNT = 0;
/** CAUTION: This is an enum for indexing the Listen_Events class buffer NOT the  Listener_Hover class buffer which is a separate class*/
const LISTEN_EVENT_TYPES_INDEX = {
	HOVER: _CNT++, // HOVER event belongs to another class, that is the Listener_Hover class.
	CLICK: _CNT++,
	KEY_PRESS: _CNT++,
	// MOVE event registers with the CLICK event, no need to create new event in the ListeEvents buffer.
	SIZE: _CNT,
};







const E = {
	H: LISTEN_EVENT_TYPES_INDEX.HOVER,
	C: LISTEN_EVENT_TYPES_INDEX.CLICK,
	K: LISTEN_EVENT_TYPES_INDEX.KEY_PRESS,
}









_CNT = 0x1;
const EVENT_HANDLER_TYPE = {
	MOUSE_MOVE: _CNT,
	MOUSE_CLICK_DOWN: _CNT <<= 0x1,
	MOUSE_CLICK_UP: _CNT <<= 0x1,
	MOUSE_HOVER: _CNT <<= 0x1, // MOVE event registers with the CLICK event, no need to create new event in the ListenEvents buffer
	MOUSE_UNHOVER: _CNT <<= 0x1, // MOVE event registers with the CLICK event, no need to create new event in the ListenEvents buffer

	KEY_PRESS: _CNT <<= 0x1, // Keyboard events

};







_CNT = 0x1;
const INFO_LISTEN_EVENT_TYPE = {

	UI_INFO_MESH: _CNT <<= 0x1,
	UI_INFO_GFX: _CNT <<= 0x1,
	UI_INFO_FOCUSED: _CNT <<= 0x1,

	LISTENERS: _CNT <<= 0x1,
	MOUSE: _CNT <<= 0x1,
	MOUSE: _CNT <<= 0x1,

}








_CNT = 0;
const INTERVALS = {

	MOVE: _CNT++,
	UPDATE: _CNT++,

	SIZE: _CNT,
};









/*************************************************************************************************/
// Debugging. Switching On/Off console.log() in the code.

const DEBUG = {

	DEFENSIVE: true, // For code that will slow down the app, but essential for critical errors
	CORE: {
		BUFFERS: {

			GENERIC_ALLOCATIONS: false,
			CHARACTER_ALLOCATIONS: false,
			INT32_ALLOCATIONS: false,
			INT16_ALLOCATIONS: false,
			INT8_ALLOCATIONS: false,
		}
	},
	MATERIAL: false,
	GEOMETRY: false,
	MESH: true,
	MESH_ALL_UVS: false,
	RECT: false,
	CAMERA: true,

	TEXTURE: false,
	UVS: false,

	// Graphics
	WEB_GL: false,
	SHADER_INFO: false,
	SHADERS: false,

	BINDING_FUNCTIONS: false,

	LISTENERS: false,

	SET_HOVER_TO_ALL_MESHES: false,
	REMOVE_MESH: false,

	GFX: {
		BUFFERS: false,
		ADD_MESH: false,
		REMOVE_MESH: false,
		CONTEXT_CREATE: false,
		CONTEXT_FIND: false,
	},

	EVENTS_LISTENERS: {
		WIDGET_DROP_DOWN: false,
	},

	WIGET_DROPDOWN: false,

	INFO_UI: false,
};
















function ERROR_NULL(obj) {
	if (obj === null || obj === undefined || obj === INT_NULL) {
		return true;
	}
}








/***********************************************************************************************************************************************/
// Styles



_CNT = 0;
const STYLES = { // Default access indices for style arrays
	AXIS: {
		ALL: 0,
		X: 1,
		Y: 2,
	},
};








/***********************************************************************************************************************************************/
// Some global values for debug info ui display information'









/***********************************************************************************************************************************************/
// INPUT - KEYBOARD
const INPUT_KEYCODE_SPACE_BAR = 32;
const INPUT_KEYCODE_LEFT = 37;
const INPUT_KEYCODE_UP = 38;
const INPUT_KEYCODE_RIGHT = 39;
const INPUT_KEYCODE_DOWN = 40;
const INPUT_KEYCODE_SPACE = 32;
const INPUT_KEYCODE_A = 65;
const INPUT_KEYCODE_D = 68;
const INPUT_KEYCODE_PAUSE = 80;










/***********************************************************************************************************************************************/
// GLOBAL-TEMP

const GLOB_TEMP = {
	visual_debug: null,
};




