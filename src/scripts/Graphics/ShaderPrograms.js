"use strict";
import { Shaders_load } from './GlShaders.js';
import { Uniforms_block_create_shared_uniform, Uniforms_buffer_set_uniform } from './Buffers/UniformBuffers.js';
import { New_generic_buffer, New_int8_buffer } from '../Engine/Core/Buffers.js';
import { Shader_attributes_get_attrib_offset_by_nameid, Shader_attributes_get_attribs, Shader_attributes_get_attribs_per_vertex } from './ShaderAttributes.js';
import { Sid_check_match } from '../GlobalFunctions.js';






const DISABLE_DEBUG = true;



const _programs = New_generic_buffer(_, 'Shader Programs');
export function Program_reset() {
	_programs.ResetFull();
}








/***************************************************************************************************************************************************/
// Shader Programs
/***************************************************************************************************************************************************/



export function Program_get_programs() { return _programs; }



export function Progarm_get_program(progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber)
	return _programs.buffer[progidx];
}



export function Progarm_get_webgl_program_object(progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber)
	return _programs.buffer[progidx].shader_program;
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



export function Program_get_shader_attribs_indexing(progidx) {
	if (!DISABLE_DEBUG) DEBUG_PRINT(_programs, progidx, new Error().lineNumber);
	return _programs.buffer[progidx].attribs_indexing;
}





/***************************************************************************************************************************************************/
//
/***************************************************************************************************************************************************/




/** Returns 'INT_NULL': if program does NOT exist AND 'progidx':if program exists. */
export function Program_program_exists_from_sid(sid) {

	if (ERROR_NULL(_programs) || ERROR_NULL(_programs.buffer)) return INT_NULL
	for (let i = 0; i <= _programs.boundary; i++)
		if (Sid_check_match(sid, _programs.buffer[i].sid)) return i;

	return INT_NULL;
}



export function Program_program_exists_from_index(progidx) {

	if (_programs.buffer[progidx] === null || _programs.buffer[progidx] === undefined)
		return false;

	return true;
}





function Create_program(sid, uniforms, shader_ops_idxs) {

	/***************************************************************************************************/
	// Create Shader Program
	const prog = new Gl_Program(gfxCtx.gl, sid, uniforms, shader_ops_idxs);
	const progidx = _programs.Add(prog);
	prog.idx = progidx; // Store the programs index to self

	
	
	// /****************************************************************************************************/
	// Shared-Block uniforms
	const ubb_idx = Uniforms_block_create_shared_uniform(sid.unif, prog.shader_program, uniforms);
	
	// Program_create_shared_uniform(prog.shader_program);
	
	
	// console.log('Program:', progidx, '_shader_operations index:', prog.shader_ops)
	return progidx;

}



export function Program_create_program(sid, uniforms, shader_ops_idxs) {

	const progidx = Create_program(sid, uniforms, shader_ops_idxs);
	const prog = _programs.buffer[progidx];


	// Bind shader program's uniforms
	gfxCtx.gl.useProgram(prog.shader_program);
	GL_STATE.BOUND_PROG_IDX = progidx;
	GL_STATE.BOUND_PROG = prog.shader_program;

	return progidx;
}

function Program_create_shared_uniform(shader_program,) {

	// Uniforms_block_create_shared_uniform(sid.unif, prog.shader_program, uniforms);
	const uniforms = [
		{
			name:'u_projection',
			type:UNIF_TYPE.MAT4,
			shader:UNIFORM.IS_SHARED,
		},
		{
			name:'u_screen_res',
			type:UNIF_TYPE.FVEC2,
			shader:UNIFORM.IS_SHARED,
		},
	];

	const sid_unif = SID.UNIF.PROJECTION_MATRIX | SID.UNIF.SCREEN_RESOLUTION;

	Uniforms_block_create_shared_uniform(sid_unif, shader_program, uniforms);
}





class Gl_Program {

	constructor(gl, sid, uniforms, shader_ops_idxs = null) {

		this.sid = sid; // Shader Type ID (E.g. ATTR_COL4 | ATTR_POS2 | INDEXED)
		this.state = { mask: 0x0 };


		this.idx = INT_NULL; // Self index to the Programs buffer

		this.shader_ops = null; // Init the array
		if (shader_ops_idxs !== null) {
			this.AddShaderOperation(shader_ops_idxs); // Build the array
		}


		const ret = Shaders_load(gfxCtx.gl, sid, uniforms, this.shader_ops);

		this.shader_program = ret.shader_program;
		this.attribsidx = ret.attribsidx;
		this.attribs_indexing = ret.attribs_indexing;

		this.vb_group = New_int8_buffer(1, 'NEW GlProgram-VBGROUP'); // Array of indexes to all vertex buffers in '_vertex_buffer_groups' buffer. 
		this.ib = New_int8_buffer(1, 'NEW GlProgram-ib'); // Array of indexes to all index buffers in '_index_buffers_info' buffer. 
		this.vao = null;
		this.vaoidx = INT_NULL;
		this.ubidxs = New_generic_buffer(_, 'Program ubidxs');
		this.attribs_per_vertex = Shader_attributes_get_attribs_per_vertex(this.attribsidx);

		/*******************************************************************************************************/
		// Blend mode ubidx. Store the uniforms index for blending mode to have quick access for updating the uniform imidiately 
		this.blend_mode_ubidx = INT_NULL;

		// this.uniforms = uniforms;
		this.uniforms = [];
		for (let i = 0; i < uniforms.length; i++) {

			this.uniforms.push({
				name: uniforms[i].name,
				shader: uniforms[i].shader, // Some shader flags(IN_FS, IN_VS, ...)
				type: uniforms[i].type, // UNIF_TYPE.FARR,
				ubidx: uniforms[i].ubidx, // Index
				arr_size: uniforms[i].arr_size, // If this uniform is a uniform buffer 
				shader_variables_unif_names: null// A collection of all names and types of the variable written inside the shader program code
			});

			// if(uniforms[i].arr_size > 0 && ret.vars_using_uniform_buffer.length > 0) {
			if(uniforms[i].arr_size > 0) {

				this.uniforms[i].shader_variables_unif_names = [];
				// If uniform is a uniform buffer, store each unif name and type
				for (let j = 0; j < ret.vars_using_uniform_buffer[i].length; j++) {
					this.uniforms[i].shader_variables_unif_names[j] = {
	
						name: ret.vars_using_uniform_buffer[i][j].name,
						type: ret.vars_using_uniform_buffer[i][j].type,
					};
				}
			}
			
		}
		// console.log('Program::Uniforms', this.uniforms);


		/****************************************************************************************************/
		// Sampler uniforms. // TODO: Move this to the .uniforms field
		this.shaderinfo = {
			uniforms: {
				sampler: gl.getUniformLocation(this.shader_program, 'u_sampler0'),	// Sampler for texture units 	
			},

		};


	}


	// Check id sid matches with the program's sid.
	CheckSidMatch(sid) {
		return Sid_check_match(sid, this.sid);
	}


	// Build an array of shader function operations, so the shader builder can resolve the necessary shader code for the shader program.
	// -The sequence matters-
	AddShaderOperation(shader_operations_idxs) {

		if (shader_operations_idxs.active_count > 0) {

			this.shader_ops = [];

			for (let i = 0; i <= shader_operations_idxs.boundary; i++) {

				if (shader_operations_idxs.buffer[i] !== INT_NULL) {

					this.shader_ops[i] = Program_get_stored_shader_operation_byidx(shader_operations_idxs.buffer[i]);

					// console.log('Program:', this.idx, '_shader_operations index:', this.shader_ops[i])
				}
			}

			Program_reset_stored_shader_operation();
		}
	}


};



// export function Program_sinitialize_blend_mode_ubidx(progidx, blend_mode) {
// 	const prog = _programs.buffer[progidx];
// 	if(prog.blend_mode_ubidx === INT_NULL) alert('Trying to update blend_mode uniform, but the uniform hasn\'t been initialized in the program');
// 	Uniforms_buffer_set_uniform(prog.blend_mode_ubidx, blend_mode);
// }
// export function Program_set_and_update_blend_mode_uniform(progidx, blend_mode) {
// 	const prog = _programs.buffer[progidx];
// 	if(prog.blend_mode_ubidx === INT_NULL) alert('Trying to update blend_mode uniform, but the uniform hasn\'t been initialized in the program');
// 	Uniforms_buffer_set_uniform(prog.blend_mode_ubidx, blend_mode);
// }
/** Needed to store the ubidx of the uniform 'u_blend_mode' for quick access throug Program */
export function Program_stgore_blend_mode_ubidx(progidx, ubidx) {
	const prog = _programs.buffer[progidx];
	prog.blend_mode_ubidx = ubidx;
}



export function Program_store_vertex_buffer_group_idx(progidx, vb_groupidx, vao, vaoidx) {
	const progvbidx = _programs.buffer[progidx].vb_group.Add(vb_groupidx);
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
	GL_STATE.BOUND_PROG_IDX = progidx;
	GL_STATE.BOUND_PROG = shader_program;
}



export function Program_use_program2(progidx) {
	const prog = _programs.buffer[progidx];
	gfxCtx.gl.useProgram(prog.shader_program);
	GL_STATE.BOUND_PROG_IDX = progidx;
	GL_STATE.BOUND_PROG = prog.shader_program;
}






















/****************************************************************************************************************************************************/
// Uniforms
/****************************************************************************************************************************************************/



export function Program_find_uniform_ubidx_from_name(progidx, unif_name) {

	const program_uniforms = _programs.buffer[progidx].uniforms;
	const len = program_uniforms.length;
	for (let i = 0; i < len; i++) {
		if (program_uniforms[i].name === unif_name) {
			return program_uniforms[i].ubidx;
		}
	}

	console.error('Program_find_uniform_ubidx_from_name() \nNo uniform found with name:', unif_name, 'progidx:', progidx, 'programs buffer:', _programs,)
	alert('Program_find_uniform_ubidx_from_name() \nNo uniform found.')
}

/** */
export function Program_get_uniforms(progidx) {
	return _programs.buffer[progidx].uniforms;
}
/** */
export function Program_get_uniform_from_name(progidx, unif_name) {

	const program_uniforms = _programs.buffer[progidx].uniforms;
	const len = program_uniforms.length;
	for (let i = 0; i < len; i++) {
		if (program_uniforms[i].name === unif_name) {
			return program_uniforms[i];
		}
	}
	// return _programs.buffer[progidx].uniforms;
}
















/****************************************************************************************************************************************************/
// Pre-Shader Program Init Storages 
/****************************************************************************************************************************************************/

const _shader_operations = New_generic_buffer(_, 'Program shader_ops storage buffer');

export function Program_store_shader_operations(function_operation, blend_mode) {
	
	
	if(!Program_shader_operation_exists(function_operation)) { // Avoid storing multiples of the same shader operation per Program

		// 'fn_op' Type of: 'SID.SHADER_OPERATIONS.'
		// 'blend_mode' Type of: 'SID.BLEND_OPTIONS.'
		const idx = _shader_operations.Add({ fn_op: function_operation, blend_mode: blend_mode });
		console.log('_shader_operations:', idx, 'fn_op:', function_operation)
		return idx; // Caller must store the index and send it back from MeshGfxContext.js to provide all necessary shader function operations for the shader program
	}
}



export function Program_shader_operation_exists(function_operation) {

	for(let i=0; i<=_shader_operations.boundary; i++) {

		if (_shader_operations.buffer[i].fn_op === function_operation) return true;
	}
	return false;
}

export function Program_full_reset_stored_shader_operation() {
	_shader_operations.ResetFull();
}

export function Program_reset_stored_shader_operation() {
	_shader_operations.Reset();
}



function Program_get_stored_shader_operation_byidx(shader_op_idx) {
	if (_shader_operations.buffer[shader_op_idx] === _)
		console.error('551443122133144, _shader_operations')
	return _shader_operations.buffer[shader_op_idx];
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
