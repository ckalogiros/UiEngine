"use strict";

import { Gl_texture_unit_create } from "../../../Graphics/GlTextureUnit.js";
import { Str_buffer_store } from "../../Core/StringBuffer.js";
// import { Font_create_uvmap } from "../Font/ChlumskyFontMetricsLoader.js";
import { Font_load_uvs, Font_create_uvmap, Font_retrieve_fontidx, Font_texture_images_init_metrics_files } from "../Font/Font.js";
import { ImageLoader } from "../ImageLoader.js";



// TODO: Make texture buffer from New_generic_buffer();




const TEXTURES_MAX_COUNT = 16;
var _textureBuffer = [];
let _textureBufferCount = 0;


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

	Font_texture_images_init_metrics_files();
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
		const img = ImageLoader.Load(TEXTURE_PATHS[textureid].imgPath, TEXTURE_PATHS[textureid].imgName, TEXTURE_PATHS[textureid].imgType);

		// Create webGl texture
		webGl_texture_idx = Texture_create_texture(gfxCtx.gl, textureid, img, TEXTURE_PATHS[textureid].imgName);

		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT || TEX_TYPE & TEXTURE_TYPE.TYPE_FONT_SYMBOL) {
			fontidx = Font_load_uvs(textureid);
		}
	}
	else {
		webGl_texture_idx = texture_idx;
		if (TEX_TYPE & TEXTURE_TYPE.TYPE_FONT)
			fontidx = Font_retrieve_fontidx(textureid);// the index for the texture metrics in the font metrics buffer
			// uvmap_idx = Font_retrieve_fontidx(webGl_texture_idx);// the index for the texture metrics in the font metrics buffer
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
