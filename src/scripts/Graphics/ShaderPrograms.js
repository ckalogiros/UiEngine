"use strict";
import { Shaders_load } from './GlShaders.js';
import { Uniforms_block_buffer_create, Uniforms_buffer_create_uniform, Uniforms_buffer_set_uniform, Uniforms_buffer_update_uniform, Uniforms_buffer_bind_uniform_functions, Uniforms_block_bind_uniform_layout } from './Buffers/UniformBuffers.js';
import { Gfx_create_group_buffer } from '../Engine/Interfaces/Gfx/MeshGfxContext.js';
import { Int8Buffer, M_Buffer } from '../Engine/Core/Buffers.js';
import { Shader_attributes_create, Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs, Shader_attributes_get_attribs_per_vertex } from './ShaderAttributes.js';
import { Select_fnidx_to_fill_vertex_buffer } from './Buffers/VertexBuffersOps.js';






const DISABLE_DEBUG = true;



const _program_groups = new M_Buffer();


/***************************************************************************************************************************************************/
// GETTERS
/***************************************************************************************************************************************************/

export function Program_get_groups() { return _program_groups; }



export function Program_get_group(groupidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber)
	return _program_groups.buffer[groupidx];
}



export function Progarm_get_program(groupidx, progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber)
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber)
	return _program_groups.buffer[groupidx].buffer[progidx];
}



export function Program_get_shader_attributes_index(groupidx, progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	return _program_groups.buffer[groupidx].buffer[progidx].attribsidx;
}



export function Program_get_shader_attributes(groupidx, progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	const attribsidx = _program_groups.buffer[groupidx].buffer[progidx].attribsidx;
	return Shader_attributes_get_attribs(attribsidx);
}



export function Program_get_shader_attribute_offset_by_nameid(groupidx, progidx, attrib_nameid) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	const attribsidx = _program_groups.buffer[groupidx].buffer[progidx].attribsidx;
	return Shader_attributes_get_attrib_offset_by_nameid(attribsidx, attrib_nameid);
}



export function Program_get_shader_attribute_attribs_per_vertex(groupidx, progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	return _program_groups.buffer[groupidx].buffer[progidx].attribs_per_vertex;
}





/***************************************************************************************************************************************************/
//
/***************************************************************************************************************************************************/

export function Program_group_exists(groupidx) {
	if (groupidx < 0 || groupidx > _program_groups.boundary || _program_groups.buffer[groupidx] == undefined)
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

		
	const u_info = TEMP_UNIFORMS_STORAGE_BUFFER[progidx];
	/****************************************************************************************************/
	// Shared-Block uniforms
	
	const ub_idx = Uniforms_block_buffer_create(sid.unif, prog.shader_program, u_info);
	// prog.ubb.Add(ub_idx);

	/****************************************************************************************************/
	// Individual uniforms
	
	const len = u_info.length;
	for (let i = 0; i < len; i++) {
		if((u_info[i].shader & UNIFORM.IS_SHARED) === 0)
		Uniforms_buffer_create_uniform(gfxCtx.gl, prog.shader_program, u_info[i].type, u_info[i].name);
	}



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

	return indexes;
}







const TEMP_UNIFORMS_STORAGE_BUFFER = [];


export function Program_enable_uniforms_for_creation(params){

	const ub = TEMP_UNIFORMS_STORAGE_BUFFER; // Cash

	let same_progidx = INT_NULL;
	const len = ub.length;
	// If program (same sid) exists, store the uniform info to the same buffer, else create new array buffer (different sid/program)
	for (let i=0; i<len; i++){
		
		// If TEMP_UNIFORMS_STORAGE_BUFFER[i] exists, it means that at least on uniform has been stored for that i (same_progidx).
		// Because all uniforms of every [i] have the same sid, checking [i][0] is enough.
		if(ub[i][0]){

			// In order to store a uniform for creation, 
			// 1. we must match the same sid, that means that the all uniforms of the same program will be created in the same shader,
			// if(SID.CheckSidMatch(ub[i][0].sid, params.sid)){
			if(ub[i][0].sid.shad === params.sid.shad &&
            ub[i][0].sid.attr === params.sid.attr &&
            ub[i][0].sid.unif === params.sid.unif &&
            ub[i][0].sid.pass === params.sid.pass &&
            ub[i][0].sid.progs_group === params.sid.progs_group){
				
				same_progidx = i;
				// console.log( params.sid)
				// console.log('YES', ub[i][0].sid)
				break;
			}
			// else console.log('NO', ub[i][0].sid)
		}
	}
	
	let abort = false;

	// Create buffer for new program uniforms
	if(same_progidx === INT_NULL){
		same_progidx = TEMP_UNIFORMS_STORAGE_BUFFER.push(new Array) -1;
	}
	else{

		// 2. and we do not want duplicate uniforms. Checked by name.
		const len2 = ub[same_progidx].length;
		for (let j=0; j<len2; j++){
			if(ub[same_progidx][j].name === params.name){
				abort = true;
				break;
			}
		}
	}
		

	// Store the uniform info and the mesh sid
	if(!abort) {
		
		const sid_copy = {};
		SID.Copy(sid_copy, params.sid)
		console.log(sid_copy)
		
		TEMP_UNIFORMS_STORAGE_BUFFER[same_progidx].push({
		name:params.name,
		type:params.type,
		shader:params.shader,
		sid:params.sid, // NOTE: The sid probably is tored by refference and not copied
	});
	}
}



function Get_uniforms_for_program(sid){

	for (let i=0; i<TEMP_UNIFORMS_STORAGE_BUFFER.length; i++){
		
		if(SID.CheckSidMatch(TEMP_UNIFORMS_STORAGE_BUFFER[i][0].sid, sid)){
			
			return TEMP_UNIFORMS_STORAGE_BUFFER[i];
		}
	}

	if(!TEMP_UNIFORMS_STORAGE_BUFFER.length) return 1;
	return null;
}




class Gl_Program {

	constructor(gl, sid) {

		this.sid = sid; // Shader Type ID (E.g. ATTR_COL4 | ATTR_POS2 | INDEXED)
		this.state = { mask: 0x0 };

		this.idx = INT_NULL; // Self index to the Programs buffer

		console.log('------------------------------------------------\nTEMP_UNIFORMS_STORAGE_BUFFER:\n', TEMP_UNIFORMS_STORAGE_BUFFER, '\n\n')
		const uniforms = Get_uniforms_for_program(sid);
		if(!uniforms){
			console.error('Uniform by sid not found. U Buffer:', TEMP_UNIFORMS_STORAGE_BUFFER);
			alert('SEE console error.');
		} 
		this.shader_program = Shaders_load(gfxCtx.gl, sid, uniforms);

		this.vb = new Int8Buffer(1); // Array of indexes to all vertex buffers in '_vertex_buffers_info' buffer. 
		this.vb.Init(-1);

		this.ib = new Int8Buffer(1); // Array of indexes to all index buffers in '_index_buffers_info' buffer. 
		this.ib.Init(-1);

		// this.ubb = new Int8Buffer(1); // Array of indexes to all uniforms in '_uniform_blocks' buffer. 
		// this.ubb.Init(-1);

		// this.ub = new Int8Buffer(1); // Array of indexes to all uniforms in '_uniforms_buffer' buffer. 
		// this.ub.Init(-1);

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
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);
	const progibidx = _program_groups.buffer[groupidx].buffer[progidx].ib.Add(ibidx);
	return progibidx;
}



export function Program_use_program(shader_program, progidx) {
	gfxCtx.gl.useProgram(shader_program);
	GL.BOUND_PROG_IDX = progidx;
	GL.BOUND_PROG = shader_program;
}



// /** 'functions' MUST HAVE .Set and .Update fields, so they can be bound to the uniforms Set() and Update(). */
// export function Program_block_bind_uniform_layout(unif_name){
// 	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
// 	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);

// 	Uniforms_block_bind_uniform_layout(unif_name);

// }



// IMPORTANT:
// Update individual uniforms via the Program function, so that there is no confusion as to under what program a uniform is boumd. 
// Because the uniform update uses only a 'loc', this might lead to unwilingly updating same loc of another progrm'a uniform. 
/** 'functions' MUST HAVE .Set and .Update fields, so they can be bound to the uniforms Set() and Update(). */
export function Program_uniform_bind(groupidx, progidx, functions_obj, unif_name) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);

	Uniforms_buffer_bind_uniform_functions(functions_obj, unif_name);

}



// export function Program_uniforms_set(groupidx, progidx, ubidx, val) {
// 	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
// 	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);

// 	const uniform_idx = _program_groups.buffer[groupidx].buffer[progidx].ub[ubidx];
// 	Uniforms_buffer_set_uniform(uniform_idx, val);
// }



// export function Program_uniforms_update(groupidx, progidx, ubidx) {
// 	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups, groupidx, new Error().lineNumber);
// 	if (!DISABLE_DEBUG) DEBUG_PRINT(_program_groups.buffer[groupidx], progidx, new Error().lineNumber);

// 	const uniform_idx = _program_groups.buffer[groupidx].buffer[progidx].ub[ubidx];
// 	Uniforms_buffer_update_uniform(uniform_idx);
// }












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
	console.log('Program Groups', _program_groups)
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