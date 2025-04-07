"use strict";

import { INT_NULL } from "../Engine/Global/EngineConstants.js";
import { GL_STATE } from "./Global/GfxConstants.js";








class Texture_unit {

    
    /** The Graphic's texture_unit unit object. */
    tbo = null; 
	tex_unit_id = -1; // Graphic's unique 'unsigned integer' id. 
    texture_file_id = INT_NULL; // The texture_unit id from the 'TEXTURES.' global contant
    texidx = INT_NULL; // Self refference index
	width = 0;
	height = 0;
	level = -1;
	internalFormat = -1;
	srcFormat = -1;
	srcType = -1;
	img = null;
	imgSrc = '';
	nameidx = INT_NULL;

};


export function Gl_texture_unit_create(gl, texture_file_id, idx, img, width=0, height=0) {
    /** gl.RGBA8
     gl.SRGB8_ALPHA8 (also available as an extension for WebGL 1, see below)
     gl.RGB10_A2
     gl.RGBA8UI
     gl.RGBA8I
     gl.RGB10_A2UI
     gl.RGBA16UI
     gl.RGBA16I
     gl.RGBA32I
     gl.RGBA32UI */
     const texture_unit = new Texture_unit();
     texture_unit.tex_unit_id = gl.TEXTURE0 + idx; // WebGl texture_unit id.Advance the texture_unit ID to the next. // TODO: Should check for GL_MAX_ALLOWED_TEXTURE_UNITS.
     texture_unit.texture_file_id = texture_file_id; // Id from TEXTURES global object
     texture_unit.texidx = idx; 
     texture_unit.level = 0;
     texture_unit.internalFormat = gl.RGBA;
     texture_unit.srcFormat = gl.RGBA;
     texture_unit.srcType = gl.UNSIGNED_BYTE;
     // TODO: is texture_file_id and tex_idx needed here too???
    
    gl.activeTexture(texture_unit.tex_unit_id);
    texture_unit.tbo = gl.createTexture();
    
    if (!texture_unit.tbo) alert('Could not create Texture');

    texture_unit.img = img; // Load the font image

    if(DEBUG.TEXTURE) console.log('texture_unit:', texture_unit)

    if(texture_unit.img){

        if(DEBUG.TEXTURE) console.log('texture_unit:', texture_unit)
        Gl_texture_unit_load(gl, texture_unit);
    }
    else{ // Must set the width and height

        // gl.bindTexture(gl.TEXTURE_2D, texture_unit.tbo);
        Gl_texture_unit_bind(gl, texture_unit);
        gl.texImage2D(gl.TEXTURE_2D, texture_unit.level, texture_unit.internalFormat, width, 
                                height, 0, texture_unit.srcFormat, texture_unit.srcType, null);
        
        // gl.generateMipmap(gl.TEXTURE_2D);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        /**
         * CLAMP_TO_EDGE
         * GL_CLAMP_TO_BORDER
         * GL_REPEAT
         * GL_MIRRORED_REPEAT
         */

        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.GL_CLAMP_TO_BORDER);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.GL_CLAMP_TO_BORDER);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.GL_CLAMP_TO_BORDER);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.GL_CLAMP_TO_BORDER);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.GL_CLAMP_TO_EDGE);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.GL_CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        
        texture_unit.width = width;
        texture_unit.height = height;
    }
    
    return texture_unit;
}



function Gl_texture_unit_load(gl, texture_unit) {
    
    texture_unit.img.onload = function(){
        
        Gl_texture_unit_bind(gl, texture_unit);
        gl.texImage2D(gl.TEXTURE_2D, texture_unit.level, texture_unit.internalFormat, texture_unit.img.width, 
            texture_unit.img.height, 0, texture_unit.srcFormat, texture_unit.srcType, texture_unit.img);
            
        // gl.generateMipmap(gl.TEXTURE_2D);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.GL_CLAMP_TO_BORDER);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.GL_CLAMP_TO_BORDER);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.GL_CLAMP_TO_BORDER);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.GL_CLAMP_TO_BORDER);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);



        texture_unit.width = texture_unit.img.width;
        texture_unit.height = texture_unit.img.height;
    }
}



export function Gl_texture_unit_bind(gl, texture_unit) {

    gl.activeTexture(texture_unit.tex_unit_id);
    gl.bindTexture(gl.TEXTURE_2D, texture_unit.tbo);

    GL_STATE.BOUND_TEXTURE_IDX = texture_unit.texidx;
    Bound_texture.texidx = texture_unit.texidx; // Update the global Texture constant object
}

