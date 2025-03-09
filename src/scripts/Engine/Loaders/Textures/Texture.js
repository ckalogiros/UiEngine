/**
 * texture_file_id: The id that is used to denote what texture we want to use for loading (Name of the texture file)
 * tex_idx: The index of the loaded texture that exists in the _texture_buffer
 * tex_unit_id: The webGl texture id, used for binding a specific texture to the gpu
 * 
 */


"use strict";

import { Gl_texture_unit_create } from "../../../Graphics/GlTextureUnit.js";
import { Str_buffer_store } from "../../Core/StringBuffer.js";
import { ImageLoader } from "../ImageLoader.js";

import { comic_sans_cz } from '../../../../../resources/fonts/comic_sans_ms/comicz.js';
import { CONSOLAS_40Hpx } from '../../../../../resources/fonts/consolas_10/metrics/consolas_10.js';
import { CONSOLAS_49Hpx } from '../../../../../resources/fonts/consolas_12/metrics/consolas_12.js';
import { CONSOLAS_58Hpx } from '../../../../../resources/fonts/consolas_14/metrics/consolas_14.js';
import { CONSOLAS_66Hpx } from '../../../../../resources/fonts/consolas_16/metrics/consolas_16.js';
import { CONSOLAS_116Hpx } from '../../../../../resources/fonts/consolas_28/metrics/consolas_28.js';
import { CONSOLAS_12Hpx } from '../../../../../resources/fonts/consolas_3/metrics/consolas_3.js';
import { CONSOLAS_157Hpx } from '../../../../../resources/fonts/consolas_38/metrics/consolas_38.js';
import { CONSOLAS_16Hpx } from '../../../../../resources/fonts/consolas_4/metrics/consolas_4.js';
import { CONSOLAS_20Hpx } from '../../../../../resources/fonts/consolas_5/metrics/consolas_5.js';
import { CONSOLAS_24Hpx } from '../../../../../resources/fonts/consolas_6/metrics/consolas_6.js';
import { CONSOLAS_28Hpx } from '../../../../../resources/fonts/consolas_7/metrics/consolas_7.js';
import { CONSOLAS_32Hpx } from '../../../../../resources/fonts/consolas_8/metrics/consolas_8.js';
import { consola_msdf_test_1024_metrics } from '../../../../../resources/fonts/consolas_sdf/metrics/consola_msdf_test_1024_metrics.js';
import { arrow_left } from '../../../../../resources/fonts/symbol_fonts/test_symbol_fonts/arrow_left_256x256.js';
import { Uv_load_uvs, Uv_retrieve_uvmap_idx } from "./TextureUvMap.js";

// TODO: Make texture buffer from New_generic_buffer();
// TODO: Rename all font words with atlas, since an atlas texture consists of subtextures and has uv coordinates from a metrics file
// TODO: Instead of loading all metrics files (large data), get the file needed by function call. That means we need to create a new .js file where we load all metrics. At least they will be loaded if Get_metrics_file function is called
// TODO: Metrics_file id duplicated, 1 inside Texture class and 2 in metrics buffer

class Texture {

    
	constructor(texture_file_id, texture_unit, img_path='', img_name=INT_NULL, img_type='', metrics_file=null) {

		this.texture_file_id = texture_file_id;

		this.texture_unit = texture_unit; // The graphics API texture unit (webGl texture)

		this.img_path = img_path,
		this.img_name = img_name,
		this.img_type = img_type;

		this.metrics_file = metrics_file;
		// The index to the metrics data in the metrics buffer
		this.metrics_idx = INT_NULL; // metrics_idx and uvmap_idx are 1 to 1  sepsrate buffers

	}

	SetTextureUnit(texture_unit){
		this.texture_unit = texture_unit;
	}

	SetMetricsIndex(metrics_idx){
		this.metrics_idx = metrics_idx;
	}

};

// HERE: We need to store the Texture and not just the texture_unit in the _textureBuffer. Also we must update all accesses of the _textureBuffer to match the new implementation
const FONTS_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT;
const TEXTURES_MAX_COUNT = 16;
var _textureBuffer = [];
let _textureBufferCount = 0;
var _font_active_textures_buffer = new Int8Array(FONTS_MAX_COUNT); // Indexed via texture_file_id (SEE: TEXTURES global object)

const TEXTURE_PATHS = [

	{ // 0
		img_path: 'fonts/consolas_3',
		img_name: FONT_CONSOLAS_12px,
		img_type: 'bmp',
		
	},
	{ // 1
		img_path: 'fonts/consolas_4',
		img_name: FONT_CONSOLAS_16px,
		img_type: 'bmp',
		
	},
	{ // 2
		img_path: 'fonts/consolas_5',
		img_name: FONT_CONSOLAS_20px,
		img_type: 'bmp',
		
	},
	{ // 3
		img_path: 'fonts/consolas_6',
		img_name: FONT_CONSOLAS_24px,
		img_type: 'bmp',
		
	},
	{ // 4
		img_path: 'fonts/consolas_7',
		img_name: FONT_CONSOLAS_28px,
		img_type: 'bmp',
		
	},
	{ // 5
		img_path: 'fonts/consolas_8',
		img_name: FONT_CONSOLAS_32px,
		img_type: 'bmp',
		
	},
	{ // 6
		img_path: 'fonts/consolas_10',
		img_name: FONT_CONSOLAS_40px,
		img_type: 'bmp',
		
	},
	{ // 7
		img_path: 'fonts/consolas_12',
		img_name: FONT_CONSOLAS_49px,
		img_type: 'bmp',
		
	},
	{ // 8
		img_path: 'fonts/consolas_14',
		img_name: FONT_CONSOLAS_58px,
		img_type: 'bmp',
		
	},
	{ // 9
		img_path: 'fonts/consolas_16',
		img_name: FONT_CONSOLAS_66px,
		img_type: 'bmp',
		
	},
	{ // 10
		img_path: 'fonts/consolas_28',
		img_name: FONT_CONSOLAS_116px,
		img_type: 'bmp',
		
	},
	{ // 11
		img_path: 'fonts/consolas_38',
		img_name: FONT_CONSOLAS_157px,
		img_type: 'bmp',
		
	},
	{ // 12
		img_path: 'fonts/consolas_sdf',
		img_name: TEST_MTSDF_FONT_TEST_1024DIM,
		img_type: 'png',
		// We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	{ // 13
		img_path: 'fonts/comic_sans_ms',
		img_name: FONT_MSDF_COMIC,
		img_type: 'png',
		// We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	{ // 14
		img_path: 'fonts/symbol_fonts/test_symbol_fonts',
		img_name: TEXTURE_LEFT_ARROW,
		img_type: 'png',
		// We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	/***************************************************************************************************/
	// Textures
	{
		img_path: 'textures',
		img_name: TEXTURE_SMOKE1,
		img_type: 'png',
		
	},
	{
		img_path: 'textures',
		img_name: TEXTURE_COIN,
		img_type: 'png',
		
	},
	{
		img_path: 'textures',
		img_name: TEXTURE_TEST_APPLE,
		img_type: 'png',
		
	},

];



function Texture_pair_metrics_file_to_texture(img_name) {

	switch(img_name) {
		case FONT_CONSOLAS_12px: { return CONSOLAS_12Hpx; }	
		case FONT_CONSOLAS_16px: { return CONSOLAS_16Hpx; }	
		case FONT_CONSOLAS_20px: { return CONSOLAS_20Hpx; }	
		case FONT_CONSOLAS_24px: { return CONSOLAS_24Hpx; }	
		case FONT_CONSOLAS_28px: { return CONSOLAS_28Hpx; }	
		case FONT_CONSOLAS_32px: { return CONSOLAS_32Hpx; }	
		case FONT_CONSOLAS_40px: { return CONSOLAS_40Hpx; }	
		case FONT_CONSOLAS_49px: { return CONSOLAS_49Hpx; }	
		case FONT_CONSOLAS_58px: { return CONSOLAS_58Hpx; }	
		case FONT_CONSOLAS_66px: { return CONSOLAS_66Hpx; }	
		case FONT_CONSOLAS_116px: { return CONSOLAS_116Hpx; }	
		case FONT_CONSOLAS_157px: { return CONSOLAS_157Hpx; }	
		case TEST_MTSDF_FONT_TEST_1024DIM: { return consola_msdf_test_1024_metrics; }	
		case FONT_MSDF_COMIC: { return ; comic_sans_cz}	
		case TEXTURE_LEFT_ARROW: { return ; arrow_left}	
		default: alert('01928374655637.  Texture_pair_metrics_file_to_texture()')

	}
}






export function Texture_is_texture_loaded(texture_file_id) {
	if (_font_active_textures_buffer[texture_file_id] === INT_NULL) return false;
	return true;
}


export function Texture_buffer_reset() {
	Gl_texture_unit_delete_all();
	_textureBuffer = [];
	_textureBufferCount = 0;
}

function Gl_texture_unit_delete(NAME_ME) {

	const tbo = _textureBuffer[NAME_ME];
	gfxCtx.gl.deleteTexture(tbo);
}


function Gl_texture_unit_delete_all() {

	for (let i = 0; i < _textureBuffer.length; i++) {

		if(_textureBuffer[i] !== null){
			
			const tbo = _textureBuffer[i].tbo;
			gfxCtx.gl.activeTexture(_textureBuffer[i].tex_unit_id);
			gfxCtx.gl.bindTexture(gfxCtx.gl.TEXTURE_2D, null);
			gfxCtx.gl.deleteTexture(tbo);
		}
	}
}


function Get_next_free_index() {

	const idx = _textureBufferCount++;

	if (idx >= TEXTURES_MAX_COUNT) {
		alert('Texture buffer overflow. @ Texture.js')
	}
	return idx;
}



function Texture_create_texture(gl, texture_file_id, img, name = 'Texture UNAMED') {

	const idx = Get_next_free_index();
	_textureBuffer[idx] = Gl_texture_unit_create(gl, texture_file_id, idx, img);
	_textureBuffer[idx].nameidx = Str_buffer_store(name);

	return idx;
}



export function Texture_init_texture_storage_buffer() { // Initialize a buffer to store all the application's textures.

	for (let i = 0; i < TEXTURES_MAX_COUNT; i++) {
		_textureBuffer[i] = null;
	}

	// Texture_metrics_resolve_metric_files_pairing();
}



export function Texture_get_texture_byidx(idx) {
	return _textureBuffer[idx];
}




function Texture_is_loaded(texture_file_id, TEX_TYPE) {
	// TODO: Code below always returns i despite the TEX_TYPE
	for (let i = 0; i < _textureBufferCount; i++) {
		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT) {
			if (_textureBuffer[i] && _textureBuffer[i].texture_file_id === texture_file_id)
				return i
		}
		else if (TEX_TYPE & TEXTURE_TYPE.TYPE_TEXTURE) {
			if (_textureBuffer[i] && _textureBuffer[i].texture_file_id === texture_file_id)
				return i

		}
	}
	return INT_NULL;
}



export function Texture_load_texture_byid(texture_file_id, TEX_TYPE) {

	let tex_idx = INT_NULL; 	// The index of the texture, that is stored(upon texture creation) in a buffer.
	let metrics_idx = INT_NULL; 		// The index of the uv coordinates. All coordinates for all , 

	const texture_idx = Texture_is_loaded(texture_file_id, TEX_TYPE);

	if (texture_idx === INT_NULL) {

		// Load the texture image
		
		const metrics_file = Texture_pair_metrics_file_to_texture(TEXTURE_PATHS[texture_file_id].img_name);
		
		// Create webGl texture
		const texture = new Texture(texture_file_id, null, TEXTURE_PATHS[texture_file_id].img_path, TEXTURE_PATHS[texture_file_id].img_name, TEXTURE_PATHS[texture_file_id].img_type, metrics_file);
		
		const img = ImageLoader.Load(texture.img_path, texture.img_name, texture.img_type);
		tex_idx = Texture_create_texture(gfxCtx.gl, texture.texture_file_id, img, texture.img_name);
		
		// const texture_unit = Gl_texture_unit_create(gfxCtx.gl, texture_file_id, texture_file_id, img);
		const texture_unit = _textureBuffer[tex_idx];
		texture.SetTextureUnit(texture_unit);

		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT || TEX_TYPE & TEXTURE_TYPE.TYPE_FONT_SYMBOL) {
			// metrics_idx = Font_load_uvs(texture_file_id);
			// metrics_idx = Uv_load_uvs(texture.texture_file_id, TEXTURE_PATHS[texture_file_id].metrics);
			metrics_idx = Uv_load_uvs(texture.texture_file_id, texture.metrics_file);
		}
	}
	else {
		tex_idx = texture_idx;
		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT){

			metrics_idx = Uv_retrieve_uvmap_idx(texture_file_id);// the index for the texture metrics in the font metrics buffer
			// _textureBuffer[texture_idx].SetMetricsIndex(metrics_idx);
		}
	}

	return { tex_idx: tex_idx, metrics_idx: metrics_idx };
}



export function Texture_create_renderbuffer_texture(gl, texture_file_id, width, height, name = 'Renderbuffer UNAMED') {

	const idx = Get_next_free_index();
	_textureBuffer[idx] = Gl_texture_unit_create(gl, texture_file_id, idx, null, width, height);
	_textureBuffer[idx].nameidx = Str_buffer_store(name);

	return _textureBuffer[idx];
}



export function Texture_set_texture_name(idx, name = 'UNAMED') {

	_textureBuffer[idx].nameidx = Str_buffer_store(name);
}














// Debug Print
export function Texture_buffer_print(){
	console.log(_textureBuffer);
}
