"use strict";
import * as dbg from './Debug/GfxDebug.js'
import { Shaders_build_vertex_shader, Shaders_build_fragment_shader } from './Shaders/ShaderBuilder/ShaderBuilder.js';




/**
 * How to add an attribute to a program
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

export function Shaders_load(gl, sid, uniforms_info) {

	// const shader = {
	// 	vShader: Shaders_build_vertex_shader(sid, uniforms_info),
	// 	fShader: Shaders_build_fragment_shader(sid, uniforms_info),
	// };
	
	const vShader = Shaders_build_vertex_shader(sid, uniforms_info);
	const fShader = Shaders_build_fragment_shader(sid, uniforms_info);



	const shader_program = Load_shaders(gl, vShader.vs, fShader, sid);
	if (shader_program) {
		if (dbg.GL_DEBUG_SHADERS) console.log('Shader Program Created Successfully!\nShader Type ID: ', SID.GetTypeToString(sid));
	} 
	else {
		alert('Unable to CREATE shader program: ' + gl.getProgramInfoLog(shader_program));
	}

	// return shader_program;
	return {
		shader_program:shader_program, 
		attribs_info:vShader.attribs_info, 
	};
}



function Bind_attributes_at_specific_locations_based_on_sid(gl, shader_program, sid){

	let loc = 0;

	if(sid.attr & (SID.ATTR.COL4)){ 
		gl.bindAttribLocation(shader_program, loc, 'a_col');
		loc++;
	}
	if(sid.attr & SID.ATTR.WPOS_TIME4){
		gl.bindAttribLocation(shader_program, loc, 'a_wpos_time');
		loc++;
	}
	if(sid.attr & SID.ATTR.GENERIC_ATTR1_VEC4){
		gl.bindAttribLocation(shader_program, loc, 'a_generic_1');
		loc++;
	}
	if(sid.attr & SID.ATTR.POS2){
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
	console.log('Validate program', msg);
	
	// Bind attribute locations before linking the program
	Bind_attributes_at_specific_locations_based_on_sid(gl, shader_program, sid);

	gl.linkProgram(shader_program);

	const status = gl.getProgramParameter(shader_program, gl.LINK_STATUS);
	if (!status) {
		console.error('Unable to LINK the shader program: ' + gl.getProgramInfoLog(shader_program));
		gl.deleteProgram(shader_program);
		shader_program = 0;
		return null;
	} 
	else {
		console.log('Shaders Linked Successfully!\n status:', msg);
	}

	return shader_program;
}



function Load_shader(gl, shaderType, source, type) {

	const shader = gl.createShader(shaderType);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	// console.log('Load_shader', source)

	const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
	if (!status) {
		alert(`An error occurred COMPILING shader: ${type} \n ${gl.getShaderInfoLog(shader)}`);
		gl.deleteShader(shader);
		return null;
	} 
	else console.log('Shader Compiled Successfully!');

	return shader;
}









/*********************************************************************************************************************************************/
// DEBUG
/*********************************************************************************************************************************************/