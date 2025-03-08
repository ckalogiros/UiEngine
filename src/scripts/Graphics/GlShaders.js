"use strict";
import * as dbg from './Debug/GfxDebug.js'
import { Shaders_build_vertex_shader, Shaders_build_fragment_shader } from './Shaders/ShaderBuilder/ShaderBuilder.js';




/** 
 * How to add an attribute to a program
 * OLD IMPLEMENTATION
 * // TODO: Update with the new implementation
 * 
 * 	. Set the SID.attribute in GfxConstants
 * 	. Set the V_ attribute length in floats in GfxConstants
 * 
 * 	. Add a loc and offset variables in I_GlProgram object
 * 
 * 	. Add the attribute to the vertex shader
 * 	. Get the attribut location in GlCreateShaderInfo(), also add the loc to the shaderinfo variable of the same function
 * 	. Enable the attribute location with GlEnableAttribsLocations()
 * 
 */



// Store shader code for debug-print only
const _vertex_shader_buffer = [];
const _fragment_shader_buffer = [];


function filterEmptyLine(string) {
   return string !== '';
}



export function Shaders_load(gl, sid, uniforms_info, shader_ops) {

	const vShader = Shaders_build_vertex_shader(sid, uniforms_info);
	const fShader = Shaders_build_fragment_shader(sid, uniforms_info, shader_ops);

	// _vertex_shader_buffer.push({vShader:vShader});
	// _fragment_shader_buffer.push({fShader:fShader});
	_vertex_shader_buffer.push(vShader.vs);
	_fragment_shader_buffer.push(fShader.fs);
	// _vertex_shader_buffer.push(vShader.code);
	// _fragment_shader_buffer.push(fShader.code);

	const shader_program = Load_shaders(gl, vShader.vs, fShader.fs, sid);
	if (shader_program) {
		if (dbg.GL_DEBUG_SHADERS) console.log('Shader Program Created Successfully!\nShader Type ID: ', SID.GetTypeToString(sid));
	} 
	else {
		alert('Unable to CREATE shader program: ' + gl.getProgramInfoLog(shader_program));
	}

	return {
		shader_program:shader_program, 
		attribsidx:vShader.attribsidx, 
		attribs_indexing:vShader.attribs_indexing,
	};
}


// Not used anymore. The predetermine attribute locations are in the ShaderBitFlags.js file
function Bind_attributes_at_specific_locations_based_on_sid(gl, shader_program, sid){

	let loc = 0;

	if(sid.attr & (SID.ATTR.COL4)){ 
		gl.bindAttribLocation(shader_program, loc, 'a_col');
		loc++;
	}
	if(sid.attr & SID.ATTR.WPOS3){
		gl.bindAttribLocation(shader_program, loc, 'a_wpos_time');
		loc++;
	}
	if(sid.attr & SID.ATTR.STYLE){
		gl.bindAttribLocation(shader_program, loc, 'a_generic_1');
		loc++;
	}
	if(sid.attr & SID.ATTR.VPOS2){
		gl.bindAttribLocation(shader_program, loc, 'a_pos');
		loc++;
	}
	if(sid.attr & SID.ATTR.DIM2){
		gl.bindAttribLocation(shader_program, loc, 'a_dim');
		loc++;
	}
	if(sid.attr & SID.ATTR.TEX2){
		gl.bindAttribLocation(shader_program, loc, 'a_tex');
		loc++;
	}
}



function Load_shaders(gl, vertex_shader, fragment_shader, sid) {


	const vShader = Load_shader(gl, gl.VERTEX_SHADER, vertex_shader, 'Vertex');
	const fShader = Load_shader(gl, gl.FRAGMENT_SHADER, fragment_shader, 'Fragment');

	const shader_program = gl.createProgram();

	gl.attachShader(shader_program, vShader);
	gl.attachShader(shader_program, fShader);

	const success = gl.validateProgram(shader_program);
	const msg = (success === undefined) ? 'Success!' : success;
	if(DEBUG.SHADERS) console.log('Validate program', msg);
	
	// Bind attribute locations before linking the program
	// Bind_attributes_at_specific_locations_based_on_sid(gl, shader_program, sid);
	// console.error('881766293 Bind_attributes_at_specific_locations_based_on_sid() has been deactivated \nThe new implementation of predetermine attribute locations are in the ShaderBitFlags.js file')

	gl.linkProgram(shader_program);

	const status = gl.getProgramParameter(shader_program, gl.LINK_STATUS);
	if (!status) {
		if(DEBUG.SHADERS) console.error('Unable to LINK the shader program: ' + gl.getProgramInfoLog(shader_program));
		gl.deleteProgram(shader_program);
		shader_program = null;
		return null;
	} 
	else {
		if(DEBUG.SHADERS) console.log('Shaders Linked Successfully!\n status:', msg);
	}

	return shader_program;
}



function Load_shader(gl, shaderType, source, type) {

	const shader = gl.createShader(shaderType);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (!status) {
		alert(`An error occurred COMPILING shader: ${type} \n ${gl.getShaderInfoLog(shader)}`);
		gl.deleteShader(shader);
		return null;
	} 
	else if(DEBUG.SHADERS) console.log('Shader Compiled Successfully!');

	return shader;
}









/*********************************************************************************************************************************************/
// DEBUG
/*********************************************************************************************************************************************/
export function Shaders_print_loop() {

	for(let i=0; i<_vertex_shader_buffer.length; i++) {

		console.log(
			'vbidx', i,
			'Vertex shader', _vertex_shader_buffer[i].vShader,
			'Fragment shader', _fragment_shader_buffer[i].fShader,
		);

	}
	// console.log( '----- Shader Code -----',
	// 	'\nVertex shader', _vertex_shader_buffer,
	// 	'\nFragment shader', _fragment_shader_buffer,
	// );
}