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

import { metrics_comicsanscz_mtsdf_1024 } from '../../../../../resources/fonts/comic_sans_ms/metrics/metrics_comicsanscz_mtsdf_1024.js';
// import { CONSOLAS_40Hpx } from '../../../../../resources/fonts/consolas_10/metrics/consolas_10.js';
// import { CONSOLAS_49Hpx } from '../../../../../resources/fonts/consolas_12/metrics/consolas_12.js';
// import { CONSOLAS_58Hpx } from '../../../../../resources/fonts/consolas_14/metrics/consolas_14.js';
// import { CONSOLAS_66Hpx } from '../../../../../resources/fonts/consolas_16/metrics/consolas_16.js';
// import { CONSOLAS_116Hpx } from '../../../../../resources/fonts/consolas_28/metrics/consolas_28.js';
// import { CONSOLAS_12Hpx } from '../../../../../resources/fonts/consolas_3/metrics/consolas_3.js';
// import { CONSOLAS_157Hpx } from '../../../../../resources/fonts/consolas_38/metrics/consolas_38.js';
// import { CONSOLAS_16Hpx } from '../../../../../resources/fonts/consolas_4/metrics/consolas_4.js';
// import { CONSOLAS_20Hpx } from '../../../../../resources/fonts/consolas_5/metrics/consolas_5.js';
// import { CONSOLAS_24Hpx } from '../../../../../resources/fonts/consolas_6/metrics/consolas_6.js';
// import { CONSOLAS_28Hpx } from '../../../../../resources/fonts/consolas_7/metrics/consolas_7.js';
// import { CONSOLAS_32Hpx } from '../../../../../resources/fonts/consolas_8/metrics/consolas_8.js';
import { metrics_consolas_mtsdf_1024 } from '../../../../../resources/fonts/consolas_mtsdf/metrics/metrics_consolas_mtsdf_1024.js';
import { Texture_metrics_create_uvmap, Uv_texture_init_buffers, Uvmaps_print } from "./TextureUvMap.js";
import { test_arial_msdf } from "../../../../../resources/fonts/TEST/test_arial_msdf.js";
import { symbols } from "../../../../../resources/fonts/symbols/metrics/symbols.js";
import { atlas_variants_consola_1024x1024_8px_scale12_extended_ascii } from "../../../../../resources/fonts/atlas_variants/consola/atlas_variants_consola_1024x1024_8px_scale12_extended_ascii.js";

// TODO: Make texture buffer from New_generic_buffer();
// TODO: Rename all font words with atlas, since an atlas texture consists of subtextures and has uv coordinates from a metrics file
// TODO: Instead of loading all metrics files (large data), get the file needed by function call. That means we need to create a new .js file where we load all metrics. At least they will be loaded if Get_metrics_file function is called
// TODO: Metrics_file id duplicated, 1 inside Texture class and 2 in metrics buffer



const MAX_VARIANTS_IN_ATLAS_TEXTURE = 16;




// HERE: We need to store the Texture and not just the texture_unit in the _textureBuffer. Also we must update all accesses of the _textureBuffer to match the new implementation
const TEXTURES_MAX_COUNT = 16;
var _textureBuffer = [];
let _textureBufferCount = 0;

/** */
const TEXTURE_PATHS = [

	// { // 0
	// 	img_path: 'fonts/consolas_3',
	// 	img_name: FONT_CONSOLAS_12px,
	// 	img_type: 'bmp',
		
	// },
	// { // 1
	// 	img_path: 'fonts/consolas_4',
	// 	img_name: FONT_CONSOLAS_16px,
	// 	img_type: 'bmp',
		
	// },
	// { // 2
	// 	img_path: 'fonts/consolas_5',
	// 	img_name: FONT_CONSOLAS_20px,
	// 	img_type: 'bmp',
		
	// },
	// { // 3
	// 	img_path: 'fonts/consolas_6',
	// 	img_name: FONT_CONSOLAS_24px,
	// 	img_type: 'bmp',
		
	// },
	// { // 4
	// 	img_path: 'fonts/consolas_7',
	// 	img_name: FONT_CONSOLAS_28px,
	// 	img_type: 'bmp',
		
	// },
	// { // 5
	// 	img_path: 'fonts/consolas_8',
	// 	img_name: FONT_CONSOLAS_32px,
	// 	img_type: 'bmp',
		
	// },
	// { // 6
	// 	img_path: 'fonts/consolas_10',
	// 	img_name: FONT_CONSOLAS_40px,
	// 	img_type: 'bmp',
		
	// },
	// { // 7
	// 	img_path: 'fonts/consolas_12',
	// 	img_name: FONT_CONSOLAS_49px,
	// 	img_type: 'bmp',
		
	// },
	// { // 8
	// 	img_path: 'fonts/consolas_14',
	// 	img_name: FONT_CONSOLAS_58px,
	// 	img_type: 'bmp',
		
	// },
	// { // 9
	// 	img_path: 'fonts/consolas_16',
	// 	img_name: FONT_CONSOLAS_66px,
	// 	img_type: 'bmp',
		
	// },
	// { // 10
	// 	img_path: 'fonts/consolas_28',
	// 	img_name: FONT_CONSOLAS_116px,
	// 	img_type: 'bmp',
		
	// },
	// { // 11
	// 	img_path: 'fonts/consolas_38',
	// 	img_name: FONT_CONSOLAS_157px,
	// 	img_type: 'bmp',
		
	// },
	{ // 0
		img_path: 'fonts/consolas_mtsdf',
		img_name: FONT_CONSOLAS_MTSDF_1024,
		img_type: 'png',
		
	},
	{ // 1
		img_path: 'fonts/comic_sans_ms',
		img_name: FONT_MSDF_COMIC,
		img_type: 'png',
		// We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	{ // 2
		img_path: 'fonts/TEST',
		img_name: TEST_FONT_MSDF_ARIAL,
		img_type: 'png',
		// We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	{ // 3
		img_path: 'fonts/atlas_variants/consola',
		img_name: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA,
		img_type: 'png',
		// We cannot import the metrics file here, so we must set the metrics file in an 'init' function
	},
	/***************************************************************************************************/
	// Atlas textures variant font sizes
	{ // 4
		img_path: 'fonts/symbols',
		img_name: TEXTURE_ATLAS_MSDF_SYMBOLS,
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
/** */
class Texture {

    
	constructor(texture_file_id, texture_unit, img_path='', img_name=INT_NULL, img_type='', metrics_file=null) {

		this.texture_file_id = texture_file_id;

		this.texture_unit = texture_unit; // The graphics API texture unit (webGl texture)

		this.img_path = img_path,
		this.img_name = img_name,
		this.img_type = img_type;

		this.metrics_file = metrics_file;
		// The index to the metrics data in the metrics buffer
		this.metrics_idxs = new Int8Array(MAX_VARIANTS_IN_ATLAS_TEXTURE); // mbuffer to store textures metrics index or if a variant font texture store the all metrics indexes
		for(let i=0; i<MAX_VARIANTS_IN_ATLAS_TEXTURE; i++) this.metrics_idxs[i] = INT_NULL; // Initialize
		this.variants_cnt = 0; // An index counter
	}

	SetTextureUnit(texture_unit){
		this.texture_unit = texture_unit;
	}

	SetMetricsIndex(metrics_idx, variant_idx){
		// this.metrics_idxs = metrics_idx;
		// this.metrics_idxs[this.variants_cnt++] = metrics_idx;
		this.metrics_idxs[variant_idx] = metrics_idx;
	}

	IsMetricsLoaded(variant_idx){
		if(this.metrics_idxs[variant_idx] === INT_NULL) return false;
		return true;
	}

};
/** */
function Texture_pair_texture_to_metrics_file(img_name) {

	switch(img_name) {
		// case FONT_CONSOLAS_12px: { return CONSOLAS_12Hpx; }	
		// case FONT_CONSOLAS_16px: { return CONSOLAS_16Hpx; }	
		// case FONT_CONSOLAS_20px: { return CONSOLAS_20Hpx; }	
		// case FONT_CONSOLAS_24px: { return CONSOLAS_24Hpx; }	
		// case FONT_CONSOLAS_28px: { return CONSOLAS_28Hpx; }	
		// case FONT_CONSOLAS_32px: { return CONSOLAS_32Hpx; }	
		// case FONT_CONSOLAS_40px: { return CONSOLAS_40Hpx; }	
		// case FONT_CONSOLAS_49px: { return CONSOLAS_49Hpx; }	
		// case FONT_CONSOLAS_58px: { return CONSOLAS_58Hpx; }	
		// case FONT_CONSOLAS_66px: { return CONSOLAS_66Hpx; }	
		// case FONT_CONSOLAS_116px: { return CONSOLAS_116Hpx; }	
		// case FONT_CONSOLAS_157px: { return CONSOLAS_157Hpx; }	
		case FONT_CONSOLAS_MTSDF_1024: { return metrics_consolas_mtsdf_1024; }	
		case FONT_MSDF_COMIC: { return metrics_comicsanscz_mtsdf_1024; }	
		case TEST_FONT_MSDF_ARIAL: { return test_arial_msdf; }	
		case ATLAS_TEXTURE_VARIANT_FONT_CONSOLA: { return atlas_variants_consola_1024x1024_8px_scale12_extended_ascii; }	
		case TEXTURE_ATLAS_MSDF_SYMBOLS: { return symbols; }	
		default: console.error('01928374655637.  Texture_pair_texture_to_metrics_file() failed to find metrics for texture:', img_name)

	}
}
/** */
// export function Texture_load_texture_byid(texture_file_id, TEX_TYPE, sub_tex_idx=INT_NULL) {
// export function Texture_load_texture_byid(texture_params, TEX_TYPE, ) {
export function Texture_load_texture_byid(TEX_TYPE, texture_file_id=INT_NULL, variant_idx=0, sub_tex_idx=INT_NULL,) {

	let tex_idx = INT_NULL; 	// The index of the texture, that is stored(upon texture creation) in a buffer.
	let metrics_idx = INT_NULL; 		// The index of the uv coordinates. All coordinates for all , 

	const texture_idx = Texture_is_loaded(texture_file_id);

	if (texture_idx === INT_NULL) {

		// NOTE: If the texture is not an ATLAS texture, then the metrics_file is null
		const metrics_file = Texture_pair_texture_to_metrics_file(TEXTURE_PATHS[texture_file_id].img_name);
		
		const texture = new Texture(texture_file_id, null, TEXTURE_PATHS[texture_file_id].img_path, TEXTURE_PATHS[texture_file_id].img_name, TEXTURE_PATHS[texture_file_id].img_type, metrics_file);
		
		const img = ImageLoader.Load(texture.img_path, texture.img_name, texture.img_type);
		
		tex_idx = Get_next_free_index();
		const texture_unit = Texture_create_texture_unit(gfxCtx.gl, texture.texture_file_id, img, tex_idx);
		
		texture.SetTextureUnit(texture_unit);
		
		_textureBuffer[tex_idx] = texture;
		
		// Load metrics if the texture is an atlas having sub-textures.
		if ((TEX_TYPE & TEXTURE_TYPE.TYPE_FONT) || (TEX_TYPE & TEXTURE_TYPE.TYPE_VARIANT_FONT) || (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT_SYMBOL)) {
			metrics_idx = Texture_metrics_create_uvmap(texture.texture_file_id, variant_idx, sub_tex_idx, texture.metrics_file);
			texture.SetMetricsIndex(metrics_idx, variant_idx);
		}
	}
	else {
		/**
		 * HERE:
		 * If we deal with texture variant, one texture atlas has many font sizes,
		 * and if the texture is loaded, we need to check if the asked font variant is loaded.
		 * If it is not, we need to create the metrics and uvmap of the variant,
		 * else if it is loaded simplyreturn the metrics index for the metrics and uvmap 
		 * 
		 * Solution for one texture many metrics_idxs, is to have a buffer of metrics indexes.
		 * Check if the texture is of type VARIANT_FONT, and make use of the variant_idx 
		 * passed as param from caller function to return the correct metrics_idx.
		 * In case of none variant textures, simply return either .metrics_idxs[0] element or .metrics_idxs,
		 * depending on the implementation
		 */

		const is_metrics_loaded = _textureBuffer[texture_idx].IsMetricsLoaded(variant_idx);
		if(!is_metrics_loaded) { // Load the metrics for the variant

			metrics_idx = Texture_metrics_create_uvmap(_textureBuffer[texture_idx].texture_file_id, variant_idx, sub_tex_idx, _textureBuffer[texture_idx].metrics_file);
			_textureBuffer[texture_idx].SetMetricsIndex(metrics_idx, variant_idx);
		}

		tex_idx = texture_idx;
		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT){

			metrics_idx = _textureBuffer[texture_idx].metrics_idxs[variant_idx];
			// metrics_idx = Uv_retrieve_uvmap_idx(texture_file_id);// the index for the texture metrics in the font metrics buffer
			// _textureBuffer[texture_idx].SetMetricsIndex(metrics_idx);
		}
	}

	return { tex_idx: tex_idx, metrics_idx: _textureBuffer[tex_idx].metrics_idxs[variant_idx] };
}
/** */
export function Texture_buffer_reset() {
	// Implement the deletion only for the .texture_unit field????
	// alert('Texture_buffer_reset(), 77165524310987')
	console.log(_textureBuffer)
	Gl_texture_unit_delete_all();
	_textureBuffer = [];
	_textureBufferCount = 0;
}
/** */
function Gl_texture_unit_delete(tex_idx) {

	const tbo = _textureBuffer[tex_idx].texture_unit;
	gfxCtx.gl.deleteTexture(tbo);
}
/** */
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
/** */
function Get_next_free_index() {

	const idx = _textureBufferCount++;

	if (idx >= TEXTURES_MAX_COUNT) {
		alert('Texture buffer overflow. @ Texture.js')
	}
	return idx;
}
/** */
function Texture_create_texture_unit(gl, texture_file_id, img, tex_idx) {

	const texture_unit = Gl_texture_unit_create(gl, texture_file_id, tex_idx, img);
	return texture_unit;
}
/** */
export function Texture_init_texture_storage_buffer() { // Initialize a buffer to store all the application's textures.

	for (let i = 0; i < TEXTURES_MAX_COUNT; i++) {
		_textureBuffer[i] = null;
	}
	Uv_texture_init_buffers();
}
/** */
export function Texture_get_texture_unit_byidx(idx) {
	return _textureBuffer[idx].texture_unit;
}
/** */
function Texture_is_loaded(texture_file_id) {
	for (let i = 0; i < _textureBufferCount; i++) {
		if (_textureBuffer[i]  && _textureBuffer[i].texture_file_id!== INT_NULL && _textureBuffer[i].texture_file_id === texture_file_id)
			return i

	}
	return INT_NULL;
}
/** */
export function Texture_create_renderbuffer_texture(gl, texture_file_id, width, height, name = 'Renderbuffer UNAMED') {
alert('10092877899287653')
// Do we need to create a full Texture class object and store it in the _textures_buffer OR just create the weGl texture_unit???? 
	const idx = Get_next_free_index();
	_textureBuffer[idx] = Gl_texture_unit_create(gl, texture_file_id, idx, null, width, height);
	_textureBuffer[idx].nameidx = Str_buffer_store(name);

	return _textureBuffer[idx];
}
/** */
export function Texture_set_texture_name(idx, name = 'UNAMED') {

	_textureBuffer[idx].nameidx = Str_buffer_store(name);
}














// Debug Print
export function Texture_buffer_print(){
	console.log(_textureBuffer);

	Uvmaps_print();
}
