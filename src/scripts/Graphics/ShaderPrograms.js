"use strict";
import { Shaders_load } from './GlShaders.js';
import { Uniforms_block_buffer_create, Uniforms_buffer_create_uniform, Uniforms_buffer_bind_uniform_functions } from './Buffers/UniformBuffers.js';
import { Int8Buffer, M_Buffer, New_generic_buffer, New_int8_buffer } from '../Engine/Core/Buffers.js';
import { Shader_attributes_create, Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs, Shader_attributes_get_attribs_per_vertex } from './ShaderAttributes.js';
import { Select_fnidx_to_fill_vertex_buffer } from './Buffers/VertexBuffersOps.js';






const DISABLE_DEBUG = true;



const _programs = New_generic_buffer();


/***************************************************************************************************************************************************/
// Groups
/***************************************************************************************************************************************************/

// export function Program_get_groups() { return _programs; }



// export function Program_get_group(groupidx) {
// 	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, groupidx, new Error().lineNumber)
// 	return _programs.buffer[groupidx];
// }



// export function Program_group_exists(groupidx) {
// 	if (groupidx < 0 || groupidx > _programs.boundary || _programs.buffer[groupidx] == undefined)
// 		return INT_NULL;
// 	return _programs.buffer[groupidx];
// }



// function Create_group() {

// 	const groupidx = _programs.Add(New_generic_buffer());

// 	Gfx_create_group_buffer(groupidx);

// 	return groupidx; // Return the index of the newly created group buffer.
// }







/***************************************************************************************************************************************************/
// Shader Programs
/***************************************************************************************************************************************************/



export function Program_get_programs() { return _programs; }



export function Progarm_get_program(progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber)
	return _programs.buffer[progidx];
}



/** Find the programs group index by the group's index */
export function Progarm_get_prog_groupidx(progidx, groupidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber)

	const groupidxs = _programs.buffer[progidx].prog_groupidxs;
	for (let i = 0; i <= groupidxs.boundary; i++) {

		if (groupidxs.buffer[i] === groupidx)
			return i;

	}

	alert('NO apropriate prog_groupidx was found in program')
	return INT_NULL;
}



export function Program_get_shader_attributes_index(progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber);
	return _programs.buffer[progidx].attribsidx;
}



export function Program_get_shader_attributes(progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber);
	const attribsidx = _programs.buffer[progidx].attribsidx;
	return Shader_attributes_get_attribs(attribsidx);
}



export function Program_get_shader_attribute_offset_by_nameid(progidx, attrib_nameid) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber);
	const attribsidx = _programs.buffer[progidx].attribsidx;
	return Shader_attributes_get_attrib_offset_by_nameid(attribsidx, attrib_nameid);
}



export function Program_get_shader_attribute_attribs_per_vertex(progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber);
	return _programs.buffer[progidx].attribs_per_vertex;
}





/***************************************************************************************************************************************************/
//
/***************************************************************************************************************************************************/




/** Returns 'INT_NULL': if program does NOT exist AND 'progidx':if program exists. */
export function Program_program_exists_from_sid(sid) {

	if (ERROR_NULL(_programs) || ERROR_NULL(_programs.buffer)) return INT_NULL
	for (let i = 0; i <= _programs.boundary; i++)
		if (SID.CheckSidMatch(sid, _programs.buffer[i].sid)) return i;

	return INT_NULL;
}



export function Program_program_exists_from_index(progidx) {

	if (_programs.buffer[progidx] === null || _programs.buffer[progidx] === undefined) 
		return false;
	
	return true;
}




function Create_program(sid, uniforms) {

	/***************************************************************************************************/
	// Create Program Group if it doesn't exist
	// let groupidx = GFX_GROUPS.GetIdxByMask(sid.gfx_group);
	// if (groupidx === INT_NULL || _programs[groupidx] === null) {

	// 	groupidx = Gfx_groups_create_group();

	// 	// IMPORTANT! Here we set globaly the index of the program group.
	// 	if (sid.gfx_group & GFX_GROUPS.DEBUG.MASK) GFX_GROUPS.DEBUG.IDX = groupidx;
	// 	else if (sid.gfx_group & GFX_GROUPS.DEFAULT.MASK) GFX_GROUPS.DEFAULT.IDX = groupidx;

	// }


	/***************************************************************************************************/
	// Create Shader Program
	const prog = new Gl_Program(gfxCtx.gl, sid, uniforms);
	const progidx = _programs.Add(prog);
	prog.idx = progidx; // Store the programs index to self

	// Add to Gfx Groups
	// const prog_groupidx = Gfx_groups_store_program(groupidx, progidx);
	// prog.prog_groupidxs.Add(prog_groupidx);


	/****************************************************************************************************/
	// Shared-Block uniforms
	const ub_idx = Uniforms_block_buffer_create(sid.unif, prog.shader_program, uniforms);
	// prog.ubb.Add(ub_idx);


	/****************************************************************************************************/
	// Individual uniforms
	const len = uniforms.length;
	for (let i = 0; i < len; i++) {
		if ((uniforms[i].shader & UNIFORM.IS_SHARED) === 0)
			Uniforms_buffer_create_uniform(gfxCtx.gl, prog.shader_program, uniforms[i].type, uniforms[i].name);
	}



	return progidx;

}



export function Program_create_program(sid, uniforms) {

	const progidx = Create_program(sid, uniforms);
	const prog = _programs.buffer[progidx];


	/**********************************************************************/
	// Bind shader program's uniforms
	gfxCtx.gl.useProgram(prog.shader_program);
	GL.BOUND_PROG_IDX = progidx;
	GL.BOUND_PROG = prog.shader_program;

	return progidx;
}






class Gl_Program {

	constructor(gl, sid, uniforms) {

		this.sid = sid; // Shader Type ID (E.g. ATTR_COL4 | ATTR_POS2 | INDEXED)
		this.state = { mask: 0x0 };

		this.idx = INT_NULL; // Self index to the Programs buffer


		this.shader_program = Shaders_load(gfxCtx.gl, sid, uniforms);

		this.vb = New_int8_buffer(1); // Array of indexes to all vertex buffers in '_vertex_buffers_info' buffer. 

		this.ib = New_int8_buffer(1); // Array of indexes to all index buffers in '_index_buffers_info' buffer. 

		this.vao = null;
		this.vaoidx = INT_NULL;



		this.attribsidx = Shader_attributes_create(sid, this.shader_program);
		this.attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(this.attribsidx);


		// Store the function's index that is responsible of been used to add mesh data to apropriately to a vertex buffer
		this.add_to_vb_fnidx = Select_fnidx_to_fill_vertex_buffer(this.attribsidx);




		/****************************************************************************************************/
		// Sampler uniforms
		this.shaderinfo = {
			uniforms: {
				sampler: gl.getUniformLocation(this.shader_program, 'u_sampler0'),	// Sampler for texture units 	
			},

		};

	}


	// Check id sid matches with the program's sid.
	CheckSidMatch(sid) {
		return SID.CheckSidMatch(sid, this.sid);
	}


};



export function Program_store_vertex_buffer_idx(progidx, vbidx, vao, vaoidx) {
	const progvbidx = _programs.buffer[progidx].vb.Add(vbidx);
	_programs.buffer[progidx].vao = vao;
	_programs.buffer[progidx].vaoidx = vaoidx;
	return progvbidx;
}



export function Program_store_index_buffer_idx(progidx, ibidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber);
	const progibidx = _programs.buffer[progidx].ib.Add(ibidx);
	return progibidx;
}



export function Program_use_program(shader_program, progidx) {
	gfxCtx.gl.useProgram(shader_program);
	GL.BOUND_PROG_IDX = progidx;
	GL.BOUND_PROG = shader_program;
}




// IMPORTANT:
// Update individual uniforms via the Program function, so that there is no confusion as to under what program a uniform is boumd. 
// Because the uniform update uses only a 'loc', this might lead to unwilingly updating same loc of another progrm'a uniform. 
/** 'functions' MUST HAVE .Set and .Update fields, so they can be bound to the uniforms Set() and Update(). */
export function Program_uniform_bind(progidx, functions_obj, unif_name) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber);

	Uniforms_buffer_bind_uniform_functions(functions_obj, unif_name);

}

















/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/

function DEBUG_PRINT(buffer, index, line) {
	if (index < 0 || index > buffer.boundary) {
		console.error('Index is out of bounds. @GlProgram.js.\nLine:', line, 'index:', index, buffer);
		alert('Index is out of bounds. @GlProgram.js');
	}
	if (buffer.buffer[index] === null) {
		console.error('Buffer at index is NULL. @GlProgram.js\nLine:', line, 'index:', index, buffer);
		alert('Buffer at index is NULL. @GlProgram.js.');
	}
}



export function Gl_program_print() {
	console.log('Program Groups', _programs)
}




/** Gather all program's uniforms */

// const numUniforms = gl.getProgramParameter(this.shader_program, gl.ACTIVE_UNIFORMS);
// const indices = [...Array(numUniforms).keys()];
// const blockIndices = gl.getActiveUniforms(this.shader_program, indices, gl.UNIFORM_BLOCK_INDEX);
// const offsets = gl.getActiveUniforms(this.shader_program, indices, gl.UNIFORM_OFFSET);

// const uniforms = [];
// for (let ii = 0; ii < numUniforms; ++ii) {
//   const uniformInfo = gl.getActiveUniform(this.shader_program, ii);
// //   if (isBuiltIn(uniformInfo)) {
// // 		continue;
// //   }
//   uniforms.push(uniformInfo);
//   const {name, type, size} = uniformInfo;
//   const blockIndex = blockIndices[ii];
//   const offset = offsets[ii];
// //   console.log(
// // 	  name, size, glEnumToString(gl, type),
// // 	  blockIndex, offset);
// console.log(uniformInfo, blockIndex, offset)
// }