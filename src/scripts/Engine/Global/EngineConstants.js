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
// const MAX_UINT64 = 0xFFFFFFFFFFFFFFFF; // 18446744073709551615 ;

const MAX_BIT_MASK = 0xFFFFFFFFFFFFF;
const MAX_BIT_MASK_COMBINATIONS = 52;

const MILISEC_TO_SEC = 0.001;
const NANOSEC = 0.000001;


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



const APP = {
	ENABLE_SHADER_PROJECTION_MATRIX: true, // The block uniform 'u_projection_matrix' must be enabled for all app's shader programs.
	ENABLE_SHADER_WPOS_UNIFORM: true, // The block uniform 'u_projection_matrix' must be enabled for all app's shader programs.
}




//
const TYPES = {

	ID: 'TYPES',

	BOOL: _CNT,
	INT8: _CNT <<= 0x1,
	INT16: _CNT <<= 0x1,
	INT32: _CNT <<= 0x1,
	UINT8: _CNT <<= 0x1,
	UINT16: _CNT <<= 0x1,
	UINT32: _CNT <<= 0x1,
	FLOAT32: _CNT <<= 0x1,
	VEC2: _CNT <<= 0x1,
	VEC3: _CNT <<= 0x1,
	VEC4: _CNT <<= 0x1,
	MAT2X2: _CNT <<= 0x1,
	MAT4X4: _CNT <<= 0x1,

	GetSizeInBytes(type, id) {

		if (id === undefined || id !== this.ID) alert('type not match');

		let size = 0;
		if (type & this.FLOAT32) size += FLOAT32_BYTE_SIZE;
		else if (type & this.INT8 || type & this.UINT8) size += INT8_BYTE_SIZE;
		else if (type & this.INT16 || type & this.UINT16) size += INT16_BYTE_SIZE;
		else if (type & this.INT32 || type & this.UINT32) size += INT32_BYTE_SIZE;
		else if (type & this.VEC2) size += VEC2_BYTE_SIZE;
		else if (type & this.VEC3) size += VEC3_BYTE_SIZE;
		else if (type & this.VEC4) size += VEC4_BYTE_SIZE;
		else if (type & this.MAT2X2) size += MAT2X2_BYTE_SIZE;
		else if (type & this.MAT4X4) size += MAT4X4_BYTE_SIZE;

		return size;
	}
}








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

		SetHovered(mesh) {
			this.hovered = mesh;
			if (!mesh) {
				this.hoveredIdx = INT_NULL;
			}
			else {
				this.hoveredIdx = mesh.mesh_bufferidx;
			}
		},
		SetGrabed(mesh) {
			this.grabed = mesh;
			if (!mesh) {
				this.grabedIdx = INT_NULL;
			}
			else {
				this.grabedIdx = mesh.mesh_bufferidx;
			}
		},
		SetClicked(mesh) {
			this.clicked = mesh;
			if (!mesh) {
				this.clickedIdx = INT_NULL;
			}
			else {
				this.clickedIdx = mesh.mesh_bufferidx;
			}
		},
		SetFocused(mesh) {

			this.focused = mesh;
			if (!mesh) {
				this.focusedIdx = INT_NULL;
			}
			else {
				this.focusedIdx = mesh.mesh_bufferidx;
			}
		},
		SetClickHold(mesh) {

			this.click_hold = mesh;
			if (!mesh) {
				this.click_holdidx = INT_NULL;
			}
			else {
				this.click_holdidx = mesh.mesh_bufferidx;
			}
		},
		CheckAllAndRemove(mesh) {
			if (mesh === this.hovered) {
				this.hovered = null;
				this.hoveredIdx = INT_NULL;
			}
			if (mesh === this.clicked) {
				this.clicked = null;
				this.grabedIdx = INT_NULL;
			}
			if (mesh === this.grabed) {
				this.grabed = null;
				this.clickedIdx = INT_NULL;
			}
			if (mesh === this.focused) {
				this.focused = null;
				this.focusedIdx = INT_NULL;
			}
		}

	},

	mouse: {

		activeClickedButtonId: INT_NULL,
	},

	Reset(){

		// this.scene.active = null;
		// this.scene.active_idx = null;
	
		this.loop.paused = false;
	
		this.mesh.hovered = null;
		this.mesh.hoveredIdx = INT_NULL;
		
		this.mesh.clicked = null;
		this.mesh.clickedIdx = INT_NULL;
		
		this.mesh.grabed = null;
		this.mesh.grabedIdx = INT_NULL;
		
		this.mesh.focused = null;
		this.mesh.focusedIdx = INT_NULL;
		
		this.mesh.click_hold = null;
		this.mesh.click_holdidx = INT_NULL;

		this.mouse.activeClickedButtonId
	}
};








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
const MESH_STATE = {

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

	IN_SCALE: _CNT <<= 1,
	HAS_POPUP: _CNT <<= 1,
	HAS_CLIP: _CNT <<= 1,

	// Masks for denoting a vertex buffer's uniform wpos as 'sticky, so it will be uupdated accordingly on canvas resize and scroll 
	STICKY_POSX: _CNT <<= 0x1, 
	STICKY_POSY: _CNT <<= 0x1,


	Print(mask) {
		console.info(this.ToString(mask))
	}

};








_CNT = 0x1;
const COMPONENTS = {
	SCROLLER: _CNT,
}




























_CNT = 0x1;
const ALIGN = {

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

	HORIZONTAL: _CNT <<= 0x1,
	VERTICAL: _CNT <<= 0x1,
	RESIZE_SELF: _CNT <<= 0x1,
	FIXED_WIDTH: _CNT <<= 0x1,
	FIXED_HEIGHT: _CNT <<= 0x1,
	FLOAT_RIGHT: _CNT <<= 0x1,
	EXPAND: _CNT <<= 0x1,
	PRESERVE_SELF_POS: _CNT <<= 0x1,
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
	/**
		GameLoop
		GlDraw
		AllTimersUpdate
		Batch
		Batch2
		SceneUpdate
		EventListener
		HoverListener
		MeshInfoTip
		FramebufferRendering
		MiscTest1
		MiscTest2
		MiscTest3
		MiscTest4
	 */
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
	Particles2: INT_NULL,
	MiscTest1: INT_NULL,
	MiscTest2: INT_NULL,
	MiscTest3: INT_NULL,
	MiscTest4: INT_NULL,

	GetStrName(idx){
		switch(idx){
			case this.GameLoop: return 'GameLoop';
			case this.GlDraw: return 'GlDraw';
			case this.AllTimersUpdate: return 'AllTimersUpdate';
			case this.Batch: return 'Batch';
			case this.Batch2: return 'Batch2';
			case this.SceneUpdate: return 'SceneUpdate';
			case this.EventListener: return 'EventListener';
			case this.HoverListener: return 'HoverListener';
			case this.MeshInfoTip: return 'MeshInfoTip';
			case this.FramebufferRendering: return 'FramebufferRendering';
			case this.AddToGfxRect: return 'AddToGfxRect';
			case this.AddToGfxText: return 'AddToGfxText';
			case this.Animations: return 'Animations';
			case this.Particles: return 'Particles';
			case this.Particles: return 'Particles2';
			case this.MiscTest1: return 'MiscTest1';
			case this.MiscTest2: return 'MiscTest2';
			case this.MiscTest3: return 'MiscTest3';
			case this.MiscTest4: return 'MiscTest4';
		}
	}
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
	// CREATE_BATCH: _CNT <<= 0x1,
}








/*************************************************************************************************/
//  
const GFX = {
	PROG_IDX: 0, 
	VB_GROUP_IDX: 1,
	VB_IDX_START: 2,

	SIZE: 2,
};








/*************************************************************************************************/
// Commands

_CNT = 0x4;
const COMMANDS = {

	ID: {
		MESH_BUFFER_BATCH_DESTROY: _CNT,
		LISTENERS_BATCH_DESTROY: _CNT <<= 0x1,
		STYLE_BATCH_DESTROY: _CNT <<= 0x1,
	}
};









/*************************************************************************************************/
// 
const OUT_OF_VIEW = 100000; // Out of screen view in pixels








/*************************************************************************************************/
// 

const MAT_ENABLE = {
	ATTR_VERTEX_COLOR: _CNT++,
	ATTR_VERTEX_GRADIENT_HORIZONTAL: _CNT++,
	ATTR_VERTEX_GRADIENT_VERTICAL: _CNT++,

	NONE: 0,
	LEN: _CNT,
}








/*************************************************************************************************/
//  








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
const FONT_CONSOLAS_12px = 'consolas_3';
const FONT_CONSOLAS_16px = 'consolas_4';
const FONT_CONSOLAS_20px = 'consolas_5';
const FONT_CONSOLAS_24px = 'consolas_6';
const FONT_CONSOLAS_28px = 'consolas_7';
const FONT_CONSOLAS_32px = 'consolas_8';
const FONT_CONSOLAS_40px = 'consolas_10';
const FONT_CONSOLAS_49px = 'consolas_12';
const FONT_CONSOLAS_58px = 'consolas_14';
const FONT_CONSOLAS_66px = 'consolas_16';
const FONT_CONSOLAS_116px = 'consolas_28';
const FONT_CONSOLAS_157px = 'consolas_38';
const FONT_CONSOLAS_MTSDF_1024 = 'consolas_mtsdf_1024';
const FONT_MSDF_COMIC = 'comicz';
const TEST_FONT_MSDF_ARIAL = 'test_arial_msdf';
// Textures Atlases
const TEXTURE_ATLAS_MSDF_SYMBOLS = 'symbols';
// Textures
const TEXTURE_SMOKE1 = 'smoke_1_256';
const TEXTURE_COIN = 'Coin_1_32';
const TEXTURE_TEST_APPLE = 'apple_1_64x73';
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







// const TEXTURE_PATHS = [

// 	{ // 0
// 		img_path: 'fonts/consolas_3',
// 		img_name: FONT_CONSOLAS_12px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 1
// 		img_path: 'fonts/consolas_4',
// 		img_name: FONT_CONSOLAS_16px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 2
// 		img_path: 'fonts/consolas_5',
// 		img_name: FONT_CONSOLAS_20px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 3
// 		img_path: 'fonts/consolas_6',
// 		img_name: FONT_CONSOLAS_24px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 4
// 		img_path: 'fonts/consolas_7',
// 		img_name: FONT_CONSOLAS_28px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 5
// 		img_path: 'fonts/consolas_8',
// 		img_name: FONT_CONSOLAS_32px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 6
// 		img_path: 'fonts/consolas_10',
// 		img_name: FONT_CONSOLAS_40px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 7
// 		img_path: 'fonts/consolas_12',
// 		img_name: FONT_CONSOLAS_49px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 8
// 		img_path: 'fonts/consolas_14',
// 		img_name: FONT_CONSOLAS_58px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 9
// 		img_path: 'fonts/consolas_16',
// 		img_name: FONT_CONSOLAS_66px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 10
// 		img_path: 'fonts/consolas_28',
// 		img_name: FONT_CONSOLAS_116px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 11
// 		img_path: 'fonts/consolas_38',
// 		img_name: FONT_CONSOLAS_157px,
// 		img_type: 'bmp',
// 		metrics: null, 
// 	},
// 	{ // 12
// 		img_path: 'fonts/consolas_mtsdf',
// 		img_name: FONT_CONSOLAS_MTSDF_1024,
// 		img_type: 'png',
// 		metrics: null, // We cannot import the metrics file here, so we must set the metrics file in an 'init' function
// 	},
// 	{ // 13
// 		img_path: 'fonts/comic_sans_ms',
// 		img_name: FONT_MSDF_COMIC,
// 		img_type: 'png',
// 		metrics: null, // We cannot import the metrics file here, so we must set the metrics file in an 'init' function
// 	},
// 	{ // 14
// 		img_path: 'fonts/symbol_fonts/test_symbol_fonts',
// 		img_name: TEXTURE_ATLAS_MSDF_SYMBOLS,
// 		img_type: 'png',
// 		metrics: null, // We cannot import the metrics file here, so we must set the metrics file in an 'init' function
// 	},
// 	/***************************************************************************************************/
// 	// Textures
// 	{
// 		img_path: 'textures',
// 		img_name: TEXTURE_SMOKE1,
// 		img_type: 'png',
// 		metrics: null, 
// 	},
// 	{
// 		img_path: 'textures',
// 		img_name: TEXTURE_COIN,
// 		img_type: 'png',
// 		metrics: null, 
// 	},
// 	{
// 		img_path: 'textures',
// 		img_name: TEXTURE_TEST_APPLE,
// 		img_type: 'png',
// 		metrics: null, 
// 	},
// 	// {
// 	// 	img_path: 'textures',
// 	// 	img_name: TEXTURE_ATLAS_MSDF_SYMBOLS,
// 	// 	img_type: 'png',
// 	// 	metrics: null, 
// 	// },
// ];







/**
 * // TODO: Have the TEXTURES as a global var, and abstract the inner workings of texture paths, texture names, pairings and creation.
 * Also set an Init function to resolve the index of each texture name below
 */
g_cnt = 0;
const TEXTURES = {

	// POTENTIAL_BUG: 
	// IMPORTANT:Font textures MUST precede all other textures

	// Font Textures
	// CONSOLAS_12px: g_cnt++,
	// CONSOLAS_16px: g_cnt++,
	// CONSOLAS_20px: g_cnt++,
	// CONSOLAS_24px: g_cnt++,
	// CONSOLAS_28px: g_cnt++,
	// CONSOLAS_32px: g_cnt++,
	// CONSOLAS_40px: g_cnt++,
	// CONSOLAS_49px: g_cnt++,
	// CONSOLAS_58px: g_cnt++,
	// CONSOLAS_66px: g_cnt++,
	// CONSOLAS_116px: g_cnt++,
	// CONSOLAS_157px: g_cnt++,

	MTSDF_CONSOLAS_1024: g_cnt++, // index:[12]
	MTSDF_COMIC_1024: g_cnt++,
	TEST_MSDF_ARIAL: g_cnt++,
	CONSOLA_VARIANT_FONT: g_cnt++,

	TEXTURE_FONTS_COUNT: g_cnt,
	
	MSDF_SYMBOLS:g_cnt++, // index[16]

	TEXTURE_ATLASES_COUNT: g_cnt,
	
	DEFAULT_FONT: 0x0, 
	
	// Image Textures
	SMOKE_1:g_cnt++, // g_cnt must be the index of the element in 'TEXTURE_PATHS'. // TODO: Either create the 'TEXTURE_PATHS' element at g_cnt OR set the g_cnt equual to the index this texture represents
	COIN:g_cnt++, 
	TEST_APPLE:g_cnt++, 
	
	COUNT: g_cnt,
}

// Set default font texture
TEXTURES.DEFAULT_FONT = TEXTURES.CONSOLA_VARIANT_FONT;

const ATLASES_SUB_TEXTURES = { // 58 total
	MSDF_SYMBOLS: {
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
		_34: 54,
		_35: 55,
		_36: 56,
		_37: 57,
	}
}


function FONT_IS_MSDF(texture_file_id) {
	if(
		texture_file_id === TEXTURES.MTSDF_COMIC_1024 ||
		texture_file_id === TEXTURES.MTSDF_CONSOLAS_1024 ||
		// texture_file_id === TEXTURES.TEST_MSDF_ARIAL ||
		texture_file_id === TEXTURES.MSDF_SYMBOLS
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
_CNT = 0x1;
// MAX cnt is 31 times shifted and the 32nd is valid but a negative number
// IDEA: Maybe we implement a negative bitfield for another 31 values ???
// TODO: Not enough space for all types. Re-organize and re-implement
const MESH_TYPE = {

	DEBUG_MESH: _CNT,

	GEOMETRY2D: _CNT <<= 1,
	TEXT_GEOMETRY2D: _CNT <<= 1,
	GEOMETRY3D: _CNT <<= 1,
	CUBE_GEOMETRY: _CNT <<= 1,

	MATERIAL: _CNT <<= 1,
	FONT_MATERIAL: _CNT <<= 1,
	ATLAS_TEXTURE_MATERIAL: _CNT <<= 1,
	TEXTURE_MATERIAL: _CNT <<= 1,

	MESH: _CNT <<= 1,
	TEXT_MESH: _CNT <<= 1,
	RECT_MESH: _CNT <<= 1,
	SECTION_MESH: _CNT <<= 1,
	SECTION_MESH_ONLY: _CNT <<= 1,

	WIDGET_LABEL: _CNT <<= 1,
	WIDGET_BUTTON: _CNT <<= 1,
	WIDGET_SWITCH: _CNT <<= 1,
	WIDGET_TEXT: _CNT <<= 1,
	WIDGET_TEXT_DYNAMIC: _CNT <<= 1,

	WIDGET_SLIDER: _CNT <<= 1,
	WIDGET_SLIDER_BAR: _CNT <<= 1,
	WIDGET_SLIDER_HANDLE: _CNT <<= 1,

	WIDGET_SCROLLER: _CNT <<= 1,
	WIDGET_SCROLLER_BAR: _CNT <<= 1,
	WIDGET_SCROLLER_HANDLE: _CNT <<= 1,

	SCROLLED_SECTION: _CNT <<= 1,

	WIDGET_POP_UP: _CNT <<= 1,
	WIDGET_MENU_BAR: _CNT <<= 1,

	WIDGET_DROP_DOWN: _CNT <<= 1,
	DROP_DOWN_MENU: _CNT <<= 1,

	WIDGET_WINDOW: _CNT <<= 1,

	PARTICLES: _CNT <<= 1,

	SCENE: _CNT <<= 1,
	// WIDGET_LABEL_TEXT_MESH_MENU_OPTIONS: _CNT <<= 1,
	// WIDGET_LABEL_TEXT_MESH_MENU_OPTIONS: _CNT <<= 1,

};









_CNT = 0;
const BATCH_FN_IDX = {
	SET_WPOS4: _CNT++,
	ADD_WPOS4: _CNT++,
	SET_POS2: _CNT++,
	SET_WPOS4_POS2: _CNT++,
}









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

_CNT = 0;
const PARTICLES_DIRECTION_CLBK_FN_IDX = {
	EMISSION: _CNT++,
	EXPLOSION: _CNT++,
};








/*************************************************************************************************/
//  Events  
_CNT = 0x1;
const LISTENERS_FLAGS = {
	ANY_HOVER: _CNT <<= 0x1,
	ANY_CLICK: _CNT <<= 0x1,
	ANY: _CNT <<= 0x1,

	HOVER: _CNT <<= 0x1,
	CLICK: _CNT <<= 0x1,
	ALL: _CNT <<= 0x1,


	mask: 0x0, // the variable to sto
};








_CNT = 0x1;
const LISTEN_EVENT_TYPES = {
	HOVER: _CNT <<= 1,
	CLICK_UP: _CNT <<= 1,
	MOVE: _CNT <<= 1, // MOVE event registers with the CLICK event, no need to create new event in the ListenEvents buffer

	NULL: _CNT <<= 1,

	GetTypeFromIndex(idx) {
	}
};

function Listen_event_types_get_type_from_index(idx) {

	if (idx === LISTEN_EVENT_TYPES_INDEX.HOVER) return LISTEN_EVENT_TYPES.HOVER;
	if (idx === LISTEN_EVENT_TYPES_INDEX.CLICK) return LISTEN_EVENT_TYPES.CLICK_UP;
}

function Listen_event_get_idx_from_type(etype) {

	if (etype & LISTEN_EVENT_TYPES.HOVER) return LISTEN_EVENT_TYPES_INDEX.HOVER;
	if (etype & (LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.MOVE)) return LISTEN_EVENT_TYPES_INDEX.CLICK;
}







_CNT = 0;
/** CAUTION: This is an enum for indexing the Listen_Events class buffer NOT the  Listener_Hover class buffer which is a separate class*/
const LISTEN_EVENT_TYPES_INDEX = {
	HOVER: _CNT++, // HOVER event belongs to another class, that is the Listener_Hover class.
	CLICK: _CNT++,
	// MOVE event registers with the CLICK event, no need to create new event in the ListeEvents buffer.
	SIZE: _CNT,
};



const E = {
	H: LISTEN_EVENT_TYPES_INDEX.HOVER,
	C: LISTEN_EVENT_TYPES_INDEX.CLICK,
}




function Listeners_get_event_type_string(event_type_idx) {
	switch (event_type_idx) {
		case E.H: return 'Hover';
		case E.C: return 'Click';
	}
}








_CNT = 0x1;
const EVENT_HANDLER_TYPE = {
	MOUSE_MOVE: _CNT,
	MOUSE_CLICK_DOWN: _CNT <<= 0x1,
	MOUSE_CLICK_UP: _CNT <<= 0x1,
	MOUSE_HOVER: _CNT <<= 0x1, // MOVE event registers with the CLICK event, no need to create new event in the ListenEvents buffer
	MOUSE_UNHOVER: _CNT <<= 0x1, // MOVE event registers with the CLICK event, no need to create new event in the ListenEvents buffer

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








const DEBUG_INFO = {

	UI_STATS: {
		IS_ON: false,
		IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [0, 0, 10]
	},
	UI_TIMERS: {
		IS_ON: false,
		IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [0, 0, 10]
	},
	UI_MOUSE: {
		IS_ON: false,
		IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [0, 0, 10]
	},
	UI_GFX: {
		IS_ON: false,
		ROOT_IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [400, 300, 10]
	},
	UI_MESH: {
		IS_ON: false,
		ROOT_IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [530, 50, 10]
	},
	UI_FOCUSED: {
		IS_ON: false,
		ROOT_IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [530, 50, 10]
	},
	UI_BATCH: {
		IS_ON: false,
		IDX: INT_NULL,
		ROOT_IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [530, 50, 10]
	},
	UI_VB_2D: {
		IS_ON: false,
		ROOT_IDX: INT_NULL,
		MESH_BUFFER_IDX: INT_NULL,
		POS: [340, 100, 10]
	},

	Reset(){
		this.UI_STATS.IS_ON = false;
		this.UI_STATS.IDX = INT_NULL,
		this.UI_STATS.MESH_BUFFER_IDX = INT_NULL;
		this.UI_STATS.POS = [0, 0, 10];
		
		this.UI_TIMERS.IS_ON = false;
		this.UI_TIMERS.IDX = INT_NULL;
		this.UI_TIMERS.MESH_BUFFER_IDX = INT_NULL;
		this.UI_TIMERS.POS = [0, 0, 10];

		this.UI_MOUSE.IS_ON = false
		this.UI_MOUSE.IDX = INT_NULL
		this.UI_MOUSE.MESH_BUFFER_IDX = INT_NULL
		this.UI_MOUSE.POS = [0, 0, 10];

		this.UI_GFX.IS_ON = false
		this.UI_GFX.ROOT_IDX = INT_NULL
		this.UI_GFX.MESH_BUFFER_IDX = INT_NULL
		this.UI_GFX.POS = [400, 300, 10];
		
		this.UI_MESH.IS_ON = false
		this.UI_MESH.ROOT_IDX = INT_NULL
		this.UI_MESH.MESH_BUFFER_IDX = INT_NULL
		this.UI_MESH.POS = [530, 50, 10]
		
		this.UI_FOCUSED.IS_ON = false
		this.UI_FOCUSED.ROOT_IDX = INT_NULL
		this.UI_FOCUSED.MESH_BUFFER_IDX = INT_NULL
		this.UI_FOCUSED.POS = [530, 50, 10]
		
		this.UI_BATCH.IS_ON = false
		this.UI_BATCH.IDX = INT_NULL
		this.UI_BATCH.ROOT_IDX = INT_NULL
		this.UI_BATCH.MESH_BUFFER_IDX = INT_NULL
		this.UI_BATCH.POS = [530, 50, 10]
		
		this.UI_VB_2D.IS_ON = false
		this.UI_VB_2D.ROOT_IDX = INT_NULL
		this.UI_VB_2D.MESH_BUFFER_IDX = INT_NULL
		this.UI_VB_2D.POS = [340, 100, 10]
	}
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
	// MARG: _CNT++,
	// PAD: _CNT++,
	// HOVER_MARG: _CNT++,

	AXIS: {
		ALL: 0,
		X: 1,
		Y: 2,
	},
};








/***********************************************************************************************************************************************/
// Some global values for debug info ui display information'
const DEBUG_INFO_STRUCTS = {

	BUFFER: {
		GENERIC: {
			NUM_BUFFERS: 0, // Count how many instantiations of Generic_Buffer class (new M_Buffer operations)
			TOTAL_BUFFER_SIZE: 0, // The total ammount of all generic buffer's sizes. 
			TOTAL_ELEM_COUNT: 0, // The total ammount of active elements in all buffers of the application
		},
		CHARACTER: {
			NUM_BUFFERS: 0, // Count how many instantiations of Generic_Buffer class (new M_Buffer operations)
			TOTAL_BUFFER_SIZE: 0, // The total ammount of all generic buffer's sizes. 
			TOTAL_ELEM_COUNT: 0, // The total ammount of active elements in all buffers of the application
		},
		INT8: {
			NUM_BUFFERS: 0, // Count how many instantiations of Generic_Buffer class
			TOTAL_BUFFER_SIZE: 0,
			TOTAL_ELEM_COUNT: 0, // The total ammount of active elements in all buffers of the application
		},
		INT16: {
			NUM_BUFFERS: 0, // Count how many instantiations of Generic_Buffer class
			TOTAL_BUFFER_SIZE: 0,
			TOTAL_ELEM_COUNT: 0, // The total ammount of active elements in all buffers of the application
		},
		INT32: {
			NUM_BUFFERS: 0, // Count how many instantiations of Generic_Buffer class
			TOTAL_BUFFER_SIZE: 0,
			TOTAL_ELEM_COUNT: 0, // The total ammount of active elements in all buffers of the application
		},

	},
};








/***********************************************************************************************************************************************/
// INPUT - KEYBOARD
const INPUT_KEYCODE_LEFT = 37;
const INPUT_KEYCODE_UP = 38;
const INPUT_KEYCODE_RIGHT = 39;
const INPUT_KEYCODE_DOWN = 40;
const INPUT_KEYCODE_SPACE = 32;
const INPUT_KEYCODE_A = 65;
const INPUT_KEYCODE_D = 68;
const INPUT_KEYCODE_PAUSE = 80;







/***********************************************************************************************************************************************/
// TEMPORARY
const TEMP_TEST_PERFORMANE_COUNTERS = {

	MESH_INFO_UI: {
		COUNT: 0,
		MOVE: 0,
		BATCH_STORE: 0,
		BATCH_UPDATE: 0,
	},
	FRAMEBUFFER: 0,
	MISC: null,
	MISC_IDX: INT_NULL,
};
