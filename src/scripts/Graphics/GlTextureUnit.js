"use strict";




export class Gl_Texture {

    
    /** The Graphic's texture unit object. */
    TO = null; 
	tex_unit_id = -1; // Graphic's unique 'unsigned integer' id. 
    texidx = INT_NULL; // Self refference index to the texture buffer.
    texid = INT_NULL; // The texture id from the 'TEXTURES.' global contant
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



export function Gl_texture_unit_create(gl, textureid, idx, img, width=0, height=0) {

    const texture = new Gl_Texture();
    texture.tex_unit_id = gl.TEXTURE0 + idx; // Advance the texture ID to the next. // TODO: Should check for GL_MAX_ALLOWED_TEXTURE_UNITS.
    texture.texidx = idx; // Advance the texture ID to the next. // TODO: Should check for GL_MAX_ALLOWED_TEXTURE_UNITS.
    texture.texid = textureid; // Advance the texture ID to the next. // TODO: Should check for GL_MAX_ALLOWED_TEXTURE_UNITS.
    texture.level = 0;
    texture.internalFormat = gl.RGBA;
    texture.srcFormat = gl.RGBA;
    texture.srcType = gl.UNSIGNED_BYTE;
    
    gl.activeTexture(texture.tex_unit_id);
    texture.TO = gl.createTexture();
    
    if (!texture.TO) alert('Could not create Texture');

    texture.img = img; // Load the font image

    if(DEBUG.TEXTURE) console.log('texture:', texture)

    if(texture.img){

        if(DEBUG.TEXTURE) console.log('texture:', texture)
        Gl_texture_unit_load(gl, texture);
    }
    else{ // Must set the width and height

        // gl.bindTexture(gl.TEXTURE_2D, texture.TO);
        Gl_texture_unit_bind(gl, texture);
        gl.texImage2D(gl.TEXTURE_2D, texture.level, texture.internalFormat, width, 
                                height, 0, texture.srcFormat, texture.srcType, null);
        
        /**
         * CLAMP_TO_EDGE
         * GL_CLAMP_TO_BORDER
         * GL_REPEAT
         * GL_MIRRORED_REPEAT
         */
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.GL_CLAMP_TO_BORDER);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.GL_CLAMP_TO_BORDER);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        texture.width = width;
        texture.height = height;
    }

    return texture;
}



function Gl_texture_unit_load(gl, texture) {

    texture.img.onload = function(){
        
        Gl_texture_unit_bind(gl, texture);
        gl.texImage2D(gl.TEXTURE_2D, texture.level, texture.internalFormat, texture.img.width, 
                        texture.img.height, 0, texture.srcFormat, texture.srcType, texture.img);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        texture.width = texture.img.width;
        texture.height = texture.img.height;
    }
}



export function Gl_texture_unit_bind(gl, texture) {

    gl.activeTexture(texture.tex_unit_id);
    gl.bindTexture(gl.TEXTURE_2D, texture.TO);

    GL.BOUND_TEXTURE_IDX = texture.texidx;
    Texture.boundTexture = texture.texidx; // Update the global Texture constant object
}


