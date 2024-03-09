"use strict";
import { Shaders_load } from './GlShaders.js';
import { UBO_create, UBO_update, Uniform, UniformsBuffer } from './Buffers/UniformBuffers.js';
import { SHADER_CONSTANTS } from './Shaders/ShaderBuilder/ShaderBuilder.js';
import { Gfx_create_group_buffer } from '../Engine/Interfaces/Gfx/MeshGfxContext.js';
import { Int8Buffer, M_Buffer } from '../Engine/Core/Buffers.js';
import { Shader_attributes_create, Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs, Shader_attributes_get_attribs_per_vertex } from './ShaderAttributes.js';
import { Select_fnidx_to_fill_vertex_buffer } from './Buffers/VertexBuffersOps.js';





const DISABLE_DEBUG = true;



const _program_groups = new M_Buffer();


/***************************************************************************************************************************************************/
// GETTERS
/***************************************************************************************************************************************************/

export function Program_get_groups(){ return _program_groups; }



export function Program_get_group(groupidx){
	if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber)
	return _program_groups.buffer[groupidx];
}



export function Progarm_get_program(groupidx, progidx){
	if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber)
	if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber)
	return _program_groups.buffer[groupidx].buffer[progidx];
}



export function Program_get_shader_attributes_index(groupidx, progidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
   return _program_groups.buffer[groupidx].buffer[progidx].attribsidx;
}



export function Program_get_shader_attributes(groupidx, progidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	const attribsidx = _program_groups.buffer[groupidx].buffer[progidx].attribsidx;
   return Shader_attributes_get_attribs(attribsidx);
}



export function Program_get_shader_attribute_offset_by_nameid(groupidx, progidx, attrib_nameid) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	const attribsidx = _program_groups.buffer[groupidx].buffer[progidx].attribsidx;
	return Shader_attributes_get_attrib_offset_by_nameid(attribsidx, attrib_nameid);
}



export function Program_get_shader_attribute_attribs_per_vertex(groupidx, progidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	return _program_groups.buffer[groupidx].buffer[progidx].attribs_per_vertex;
}





/***************************************************************************************************************************************************/
//
/***************************************************************************************************************************************************/

export function Program_group_exists(groupidx){
	if(groupidx < 0 || groupidx > _program_groups.boundary || _program_groups.buffer[groupidx] == undefined)
		return INT_NULL;
	return _program_groups.buffer[groupidx];
}



/** Returns 'INT_NULL': if program does NOT exist AND 'progidx':if program exists. */
export function Program_program_exists(sid) {

	const groupidx = PROGRAMS_GROUPS.GetIdxByMask(sid.progs_group)

	const progs = Program_group_exists(groupidx);

	if (ERROR_NULL(progs) || ERROR_NULL(progs.buffer)) return INT_NULL
	for (let i = 0; i < progs.boundary; i++)
		 if (SID.CheckSidMatch(sid, progs.buffer[i].sid)) return i;

	return INT_NULL;
}



function Create_group() {

	const groupidx = _program_groups.Add(new M_Buffer());

	Gfx_create_group_buffer(groupidx);

	return groupidx; // Return the index of the newly created group buffer.
}



function Create_program(sid) {

	/***************************************************************************************************/
	// Create Program Group if it doesn't exist
	let groupidx = PROGRAMS_GROUPS.GetIdxByMask(sid.progs_group);
	if (groupidx === INT_NULL || _program_groups[groupidx] === null) {

		groupidx = Create_group();

		// IMPORTANT! Here we set globaly the index of the program group.
		if (sid.progs_group & PROGRAMS_GROUPS.DEBUG.MASK) PROGRAMS_GROUPS.DEBUG.IDX = groupidx;
		else if (sid.progs_group & PROGRAMS_GROUPS.DEFAULT.MASK) PROGRAMS_GROUPS.DEFAULT.IDX = groupidx;

	}


	/***************************************************************************************************/
	// Create Shader Program
	const prog = new Gl_Program(gfxCtx.gl, sid);
	const progidx = _program_groups.buffer[groupidx].Add(prog);
	prog.idx = progidx; // Store the programs index to self

	return { groupidx: groupidx, progidx: progidx };
	
}



export function Program_create_program(sid) {

	const indexes = Create_program(sid);
	const groupidx = indexes.groupidx;
	const progidx = indexes.progidx;


	const prog = _program_groups.buffer[groupidx].buffer[progidx];


	/**********************************************************************/
	// Bind shader program's uniforms
	gfxCtx.gl.useProgram(prog.shader_program);
	GL.BOUND_PROG_IDX = progidx;
	GL.BOUND_PROG = prog.shader_program;

	// Enable screen resolution uniform (vec2)  
	// if (sid.unif & SID.UNIF.BUFFER_RES) {
	// 	const unifBufferResIdx = prog.UniformsBufferCreateScreenRes();
	// 	prog.UniformsSetBufferUniform(VIEWPORT.WIDTH, unifBufferResIdx.resXidx);
	// 	prog.UniformsSetBufferUniform(VIEWPORT.HEIGHT, unifBufferResIdx.resYidx);
	// }

	// Enable Uniform Shared Block
	if(sid.unif & SID.UNIF.SHARED_BLOCK){
		UBO_create(prog.shader_program, sid.unif)
	}

	// Enable global timer uniform (float)
	// if (sid.unif & SID.UNIF.BUFFER_RES) {
	// 	const step = 0.1;
	// 	prog.UniformsCreateTimer(step);
	// }

	return indexes;
}




class Gl_Program {

	constructor(gl, sid) {

		this.sid = sid; // Shader Type ID (E.g. ATTR_COL4 | ATTR_POS2 | INDEXED)
		this.state = { mask:0x0 };

		this.idx = INT_NULL; // Self index to the Programs buffer

		this.shader_program = Shaders_load(gfxCtx.gl, sid);

		this.vb = new Int8Buffer(1);
		this.vb.Init(-1)

		this.ib = new Int8Buffer(1);
		this.ib.Init(-1)

		this.vao = null;
		this.vaoidx = INT_NULL;

		this.attribsidx = Shader_attributes_create(sid, this.shader_program);
		this.attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(this.attribsidx);

		// Store the function's index that is responsible of been used to add mesh data to apropriately to a vertex buffer
		this.add_to_vb_fnidx = Select_fnidx_to_fill_vertex_buffer(this.attribsidx);


		this.shaderinfo = {
			uniforms: {

				sampler: gl.getUniformLocation(this.shader_program, 'u_sampler0'),	// Sampler for texture units 	

				// Uniforms buffer. Stores any uniform as an array of values.
				// buffer: new UniformsBuffer(gfxCtx.gl, this, SHADER_CONSTANTS.UNIFORM_BUFFER_COUNT),
			},

		};

		this.timer = {
			val: 0., // A uniform variable to time counter
			step: 0.,
			index: INT_NULL,
			isActive: false,
		};


	}


	// Check id sid matches with the program's sid.
	CheckSidMatch(sid) {
		return SID.CheckSidMatch(sid, this.sid);
	}


	/**
	 * Uniforms Buffer
	 */
	// UniformsCreateBufferUniform(name) {
	// 	this.shaderinfo.uniforms.buffer.CreateUniform(name);
	// }


	// UniformsSetBufferUniform(val, index) {
	// 	this.shaderinfo.uniforms.buffer.Set(val, index);
		
	// 	console.warn('Program :: Uniforms :: Set :: generic buffer')
	// 	this.UniformsUpdateBufferUniforms(gfxCtx.gl); // HACK: Leave it for the re-implentation of the UniformBuffer system
	// }


	// UniformsCreateSetBufferUniform(name, val) {
	// 	const idx = this.shaderinfo.uniforms.buffer.CreateUniform(name);
	// 	this.shaderinfo.uniforms.buffer.Set(val, idx);
	// 	console.warn('Program :: Uniforms :: Create&Set :: generic buffer')
	// }


	// UniformsUpdateBufferUniforms(gl) {
	// 	this.shaderinfo.uniforms.buffer.Update(gl);
	// 	console.warn('Program :: Uniforms :: Update :: generic buffer')
	// }


	// UniformsSetUpdateBufferUniform(gl, val, index) {
	// 	this.shaderinfo.uniforms.buffer.Set(val, index);
	// 	this.shaderinfo.uniforms.buffer.Update(gl);
	// 	console.warn('Program :: Uniforms :: Set&Update :: generic buffer')
	// }


	/**
	 * Unique Uniforms.
	 * New uniforms that are set by the client and are created as a seperate uniforms in the shaders.
	 */
	// UniformsCreateTimer(step) {

	// 	// 'Activates' 1 array element of the uniforms buffer array.
	// 	this.timer.isActive = true;
	// 	this.timer.step = step;
	// 	this.timer.index = this.shaderinfo.uniforms.buffer.CreateUniform('Timer');
	// }


	// UniformsUpdateTimer() {

	// 	this.shaderinfo.uniforms.buffer.Set(this.timer.val, this.timer.index);
	// 	this.state.mask |= PROGRAM_STATE.UNIFORMS_NEED_UPDATE;
	// 	this.timer.val += this.timer.step;
	// 	console.warn('Program :: Uniforms :: Update :: timer')
	// }


	// UniformsBufferCreateScreenRes() {
	// 	/**
	// 	 * 'Activates' 2 array elements of the uniforms buffer array, and returns the 2 indexes
	// 	 *  so the caller can 'Set' the uniforms value at it's site.
	// 	 */
	// 	const resXidx = this.shaderinfo.uniforms.buffer.CreateUniform('ScreenResX');
	// 	const resYidx = this.shaderinfo.uniforms.buffer.CreateUniform('ScreenResY');

	// 	return {
	// 		resXidx: resXidx,
	// 		resYidx: resYidx,
	// 	};
	// }

};



export function Program_store_vertex_buffer_idx(groupidx, progidx, vbidx, vao, vaoidx) {
	const progvbidx = _program_groups.buffer[groupidx].buffer[progidx].vb.Add(vbidx);
	_program_groups.buffer[groupidx].buffer[progidx].vao = vao;
	_program_groups.buffer[groupidx].buffer[progidx].vaoidx = vaoidx;
	return progvbidx;
}



export function Program_store_index_buffer_idx(groupidx, progidx, ibidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
   if(!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	const progibidx = _program_groups.buffer[groupidx].buffer[progidx].ib.Add(ibidx);
	return progibidx;
}



export function Program_use_program(shader_program, progidx) {
	gfxCtx.gl.useProgram(shader_program);
	GL.BOUND_PROG_IDX = progidx;
	GL.BOUND_PROG = shader_program;
}













/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/

function DEBUG_PRINT (buffer, index, line) {
	if (index < 0 || index > buffer.boundary) {
		 console.error('Index is out of bounds. @GlProgram.js.\nLine:', line, 'index:', index, buffer);
		  alert('Index is out of bounds. @GlProgram.js');
	}
	if (buffer.buffer[index] === null) {
		 console.error('Buffer at index is NULL. @GlProgram.js\nLine:', line, 'index:', index, buffer);
		 alert('Buffer at index is NULL. @GlProgram.js.');
	}
}
// function DEBUG_PRINT2(buffer, index, line) {
// 	if (index < 0 || index > buffer.boundary) {
// 		 console.error('Index is out of bounds. @GlProgram.js.\nLine:', line, 'index:', index, buffer);
// 		  alert('Index is out of bounds. @GlProgram.js');
// 	}
// 	if (buffer.buffer[index] === null) {
// 		 console.error('Buffer at index is NULL. @GlProgram.js\nLine:', line, 'index:', index, buffer);
// 		 alert('Buffer at index is NULL. @GlProgram.js.');
// 	}
// }


export function Gl_program_print(){
	console.log('Program Groups', _program_groups)
}
