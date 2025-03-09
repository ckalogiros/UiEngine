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
import { Uv_load_uvs } from "./TextureUvMap.js";

// TODO: Make texture buffer from New_generic_buffer();
// TODO: Rename all font words with atlas, since an atlas texture consists of subtextures and has uv coordinates from a metrics file
// TODO: Instead of loading all metrics files (large data), get the file needed by function call. That means we need to create a new .js file where we load all metrics. At least they will be loaded if Get_metrics_file function is called
// TODO: Metrics_file id duplicated, 1 inside Texture class and 2 in metrics buffer

class Texture {

    
	constructor(textureid, texture_unit, imgPath='', imgName=INT_NULL, imgType='', metrics_file=null) {

		this.textureid = textureid;

		this.texture_unit = texture_unit; // The graphics API texture unit (webGl texture)

		this.imgPath = imgPath,
		this.imgName = imgName,
		this.imgType = imgType;

		// TODO: rename to metrics_file
		this.metrics_file = metrics_file;
		// this.metrics = null;
		// this.metrics_idx = INT_NULL; // The index to the metrics data in the metrics buffer

	}

	SetTextureUnit(texture_unit){
		this.texture_unit = texture_unit;
	}

};


const FONTS_MAX_COUNT = TEXTURES.TEXTURE_ATLASES_COUNT;
const TEXTURES_MAX_COUNT = 16;
var _textureBuffer = [];
let _textureBufferCount = 0;
var _font_active_textures_buffer = new Int8Array(FONTS_MAX_COUNT); // Indexed via textureid (SEE: TEXTURES global object)

const TEXTURE_PATHS = [

	{ // 0
		imgPath: 'fonts/consolas_3',
		imgName: FONT_CONSOLAS_12px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 1
		imgPath: 'fonts/consolas_4',
		imgName: FONT_CONSOLAS_16px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 2
		imgPath: 'fonts/consolas_5',
		imgName: FONT_CONSOLAS_20px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 3
		imgPath: 'fonts/consolas_6',
		imgName: FONT_CONSOLAS_24px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 4
		imgPath: 'fonts/consolas_7',
		imgName: FONT_CONSOLAS_28px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 5
		imgPath: 'fonts/consolas_8',
		imgName: FONT_CONSOLAS_32px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 6
		imgPath: 'fonts/consolas_10',
		imgName: FONT_CONSOLAS_40px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 7
		imgPath: 'fonts/consolas_12',
		imgName: FONT_CONSOLAS_49px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 8
		imgPath: 'fonts/consolas_14',
		imgName: FONT_CONSOLAS_58px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 9
		imgPath: 'fonts/consolas_16',
		imgName: FONT_CONSOLAS_66px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 10
		imgPath: 'fonts/consolas_28',
		imgName: FONT_CONSOLAS_116px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 11
		imgPath: 'fonts/consolas_38',
		imgName: FONT_CONSOLAS_157px,
		imgType: 'bmp',
		metrics: null, 
	},
	{ // 12
		imgPath: 'fonts/consolas_sdf',
		imgName: TEST_MTSDF_FONT_TEST_1024DIM,
		imgType: 'png',
		metrics: null, // We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	{ // 13
		imgPath: 'fonts/comic_sans_ms',
		imgName: FONT_MSDF_COMIC,
		imgType: 'png',
		metrics: null, // We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	{ // 14
		imgPath: 'fonts/symbol_fonts/test_symbol_fonts',
		imgName: TEXTURE_LEFT_ARROW,
		imgType: 'png',
		metrics: null, // We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	/***************************************************************************************************/
	// Textures
	{
		imgPath: 'textures',
		imgName: TEXTURE_SMOKE1,
		imgType: 'png',
		metrics: null, 
	},
	{
		imgPath: 'textures',
		imgName: TEXTURE_COIN,
		imgType: 'png',
		metrics: null, 
	},
	{
		imgPath: 'textures',
		imgName: TEXTURE_TEST_APPLE,
		imgType: 'png',
		metrics: null, 
	},

];

let cnt = 0;
function Texture_metrics_resolve_metric_files_pairing() {

   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_12Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_16Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_20Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_24Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_28Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_32Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_40Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_49Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_58Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_66Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_116Hpx;
   TEXTURE_PATHS[cnt++].metrics = CONSOLAS_157Hpx;
   TEXTURE_PATHS[cnt++].metrics = consola_msdf_test_1024_metrics;
   TEXTURE_PATHS[cnt++].metrics = comic_sans_cz;
   TEXTURE_PATHS[cnt++].metrics = arrow_left;

}

function Texture_pair_metrics_file_to_texture(imgName) {

	switch(imgName) {
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
		// case TEST_MSDF_FONT_1: { return ; }	
		default: alert('01928374655637.  Texture_pair_metrics_file_to_texture()')


		// case TEXTURE_SMOKE1: { return ; }	
		// case TEXTURE_COIN: { return ; }	
		// case TEXTURE_TEST_APPLE: { return ; }	
		// case TEXTURE_LEFT_ARROW: { return ; }	
	}
}






export function Texture_is_texture_loaded(textureid) {
	if (_font_active_textures_buffer[textureid] === INT_NULL) return false;
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



function Texture_create_texture(gl, textureid, img, name = 'Texture UNAMED') {

	const idx = Get_next_free_index();
	_textureBuffer[idx] = Gl_texture_unit_create(gl, textureid, idx, img);
	_textureBuffer[idx].nameidx = Str_buffer_store(name);

	return idx;
}



export function Texture_init_texture_storage_buffer() { // Initialize a buffer to store all the application's textures.

	for (let i = 0; i < TEXTURES_MAX_COUNT; i++) {
		_textureBuffer[i] = null;
	}

	Texture_metrics_resolve_metric_files_pairing();
}



export function Texture_get_texture_byidx(idx) {
	return _textureBuffer[idx];
}




function Texture_is_loaded(textureid, TEX_TYPE) {
	// TODO: Code below always returns i despite the TEX_TYPE
	for (let i = 0; i < _textureBufferCount; i++) {
		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT) {
			if (_textureBuffer[i] && _textureBuffer[i].textureid === textureid)
				return i
		}
		else if (TEX_TYPE & TEXTURE_TYPE.TYPE_TEXTURE) {
			if (_textureBuffer[i] && _textureBuffer[i].textureid === textureid)
				return i

		}
	}
	return INT_NULL;
}



export function Texture_load_texture_byid(textureid, TEX_TYPE) {

	let webGl_texture_idx = INT_NULL; 	// The index of the texture, that is stored(upon texture creation) in a buffer.
	let fontidx = INT_NULL; 		// The index of the uv coordinates. All coordinates for all , 

	const texture_idx = Texture_is_loaded(textureid, TEX_TYPE);

	if (texture_idx === INT_NULL) {

		// Load the texture image
		
		const metrics_file = Texture_pair_metrics_file_to_texture(TEXTURE_PATHS[textureid].imgName);
		
		// Create webGl texture
		const texture = new Texture(textureid, null, TEXTURE_PATHS[textureid].imgPath, TEXTURE_PATHS[textureid].imgName, TEXTURE_PATHS[textureid].imgType, metrics_file);
		
		const img = ImageLoader.Load(texture.imgPath, texture.imgName, texture.imgType);
		webGl_texture_idx = Texture_create_texture(gfxCtx.gl, texture.textureid, img, texture.imgName);
		
		const texture_unit = Gl_texture_unit_create(gfxCtx.gl, textureid, textureid, img);
		texture.SetTextureUnit(texture_unit);

		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT || TEX_TYPE & TEXTURE_TYPE.TYPE_FONT_SYMBOL) {
			// fontidx = Font_load_uvs(textureid);
			// fontidx = Uv_load_uvs(texture.textureid, TEXTURE_PATHS[textureid].metrics);
			fontidx = Uv_load_uvs(texture.textureid, texture.metrics_file);
		}
	}
	else {
		webGl_texture_idx = texture_idx;
		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT)
			// fontidx = Font_retrieve_fontidx(textureid);// the index for the texture metrics in the font metrics buffer
			uvidx = Uvs_retrieve_uvidx(textureid);// the index for the texture metrics in the font metrics buffer
	}

	return { webGl_texture_idx: webGl_texture_idx, fontidx: fontidx };
}



export function Texture_create_renderbuffer_texture(gl, textureid, width, height, name = 'Renderbuffer UNAMED') {

	const idx = Get_next_free_index();
	_textureBuffer[idx] = Gl_texture_unit_create(gl, textureid, idx, null, width, height);
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
