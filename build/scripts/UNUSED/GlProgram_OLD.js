// "use strict";
// import { PrintShaderInfo } from './Debug/GfxDebug.js';
// import { LoadShaderProgram } from './GlShaders.js';
// import { GlUseProgram } from './Buffers/GlBuffers.js';
// import { Uniform, UniformsBuffer } from './Buffers/GlUniformBuffer.js';
// import { SHADER_CONSTANTS } from './Shaders/ShaderBuilder/ShaderBuilder.js';
// import { Renderqueue_set_active } from '../Engine/Renderers/Renderer/RenderQueue.js';
// import { Gfx_create_group_buffer, Gfx_create_program_buffer } from '../Engine/Interfaces/Gfx/GfxContextCreate.js';
// import { Gl_vertex_buffer_info_get_by_vbidx } from './Buffers/GL/Program_get_group_bygroupidxVertexBuffer.js';
// import { Int16Buffer, Int8Buffer } from '../Engine/Core/Buffers.js';




// export function Gl_create_shader_program(sid) {

// 	const gfx_idxs = Gl_create_program(sid);
// 	const groupidx = gfx_idxs.groupidx;
// 	const progidx = gfx_idxs.progidx;
// 	// const progs = Program_get_group(groupidx);
// 	const prog = Gl_progs_get_prog_byidx(groupidx, progidx);


// 	/**********************************************************************/
// 	// Bind shader program's uniforms
// 	GlUseProgram(prog.shader_program, progidx);

// 	// Enable screen resolution uniform (vec2)  
// 	if (sid.unif & SID.UNIF.BUFFER_RES) {
// 		const unifBufferResIdx = prog.UniformsBufferCreateScreenRes();
// 		prog.UniformsSetBufferUniform(VIEWPORT.WIDTH, unifBufferResIdx.resXidx);
// 		prog.UniformsSetBufferUniform(VIEWPORT.HEIGHT, unifBufferResIdx.resYidx);
// 	}

// 	// Enable global timer uniform (float)
// 	if (sid.unif & SID.UNIF.BUFFER_RES) {
// 		const step = 0.1;
// 		prog.UniformsCreateTimer(step);
// 	}

// 	return gfx_idxs;
// }





// /**
//  * Enabling Attribute locations for a program
//  * and
//  * Setting the attribute's offsets, types and sizes. 
//  * Cannot be implemented in Gl_Program class because it needs vao-vbo binding first.
//  * 
//  * @param {*} gl : Gl context
//  * @param {*} prog : The program to which we set enable the attribute locations
//  */
// export function GlEnableAttribsLocations(gl, prog) {

// 	const attribsPerVertex = prog.shaderinfo.attribsPerVertex;
// 	const loc = prog.shaderinfo.attributes.loc;
// 	const size = prog.shaderinfo.attributes.size;
// 	const offset = prog.shaderinfo.attributes.offset;


// 	// For Uniforms
// 	if (loc.col >= 0) {
// 		// https://www.khronos.org/opengl/wiki/Vertex_Specification#:~:text=A%20Vertex%20Array%20Object%20(VAO,providing%20the%20vertex%20data%20arrays.
// 		// NOTE: Acts on VAO's, so a VAO must be bound
// 		console.log(gl)
// 		gl.enableVertexAttribArray(loc.col);
// 		// NOTE: Acts on VBO's, so a VBO must be bound
// 		gl.vertexAttribPointer(loc.col, size.col, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.col * FLOAT);
// 	}
// 	if (loc.pos >= 0) {
// 		gl.enableVertexAttribArray(loc.pos);
// 		gl.vertexAttribPointer(loc.pos, size.pos, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.pos * FLOAT);
// 	}
// 	if (loc.tex >= 0) {
// 		gl.enableVertexAttribArray(loc.tex);
// 		gl.vertexAttribPointer(loc.tex, size.tex, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.tex * FLOAT);
// 	}
// 	if (loc.wposTime >= 0) {
// 		gl.enableVertexAttribArray(loc.wposTime);
// 		gl.vertexAttribPointer(loc.wposTime, size.wposTime, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.wposTime * FLOAT);
// 	}
// 	if (loc.params1 >= 0) {
// 		gl.enableVertexAttribArray(loc.params1);
// 		gl.vertexAttribPointer(loc.params1, size.params1, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.params1 * FLOAT);
// 	}
// 	if (loc.style >= 0) {
// 		gl.enableVertexAttribArray(loc.style);
// 		gl.vertexAttribPointer(loc.style, size.style, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.style * FLOAT);
// 	}
// 	if (loc.time >= 0) {
// 		gl.enableVertexAttribArray(loc.time);
// 		gl.vertexAttribPointer(loc.time, size.time, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.time * FLOAT);
// 	}
// 	if (loc.sdf >= 0) {
// 		gl.enableVertexAttribArray(loc.sdf);
// 		gl.vertexAttribPointer(loc.sdf, size.sdf, gl.FLOAT, false, attribsPerVertex * FLOAT, offset.sdf * FLOAT);
// 	}
// }


// class Gl_Programs {

// 	constructor() {
// 		this.buffer = []; // Buffer for gl shader programs
// 		this.count = 0;
// 	}


// 	CreateProgram(gl, sid) {
// 		const progidx = this.count++;
// 		this.buffer[progidx] = new Gl_Program(gl, sid, progidx);
// 		return progidx;
// 	}
// }

// export class Gl_Program {

// 	constructor(gl, sid, idx) {

// 		this.sid = sid; // Shader Type ID (E.g. ATTR_COL4 | ATTR_POS2 | INDEXED)
// 		this.idx = idx; // Refference to this programs index in the 'Gl_Programs' buffer.

// 		this.shader_program = null;
// 		this.isActive = false;

// 		this.uniformsNeedUpdate = false;

// 		this.vb = new Int8Buffer(1);
// 		this.vb.Init(-1)
// 		// this.vertexBufferCount = 0;

// 		this.ib = new Int8Buffer(1);
// 		this.ib.Init(-1)
// 		// this.indexBufferCount = 0;

// 		this.shader_program = LoadShaderProgram(gfxCtx.gl, sid);

// 		PrintShaderInfo(this);

// 		this.shaderinfo = {

// 			attributes: {

// 				size: this.#PrivateCalculateAttributesSize(this.sid),

// 				loc: {

// 					col: gl.getAttribLocation(this.shader_program, 'a_col'), // Color	
// 					wposTime: gl.getAttribLocation(this.shader_program, 'a_wpos_time'), // World Position + Time attrib	 		
// 					pos: gl.getAttribLocation(this.shader_program, 'a_pos'),	// Vertex Position	 
// 					tex: gl.getAttribLocation(this.shader_program, 'a_tex'), // texture Coords	 		 		
// 					params1: gl.getAttribLocation(this.shader_program, 'a_params1'), // A 4 component vector to pass any parameter to a vertex as an attribute 	 		
// 					sdf: gl.getAttribLocation(this.shader_program, 'a_sdf'),	// For Sdf's  	 		 		
// 				},

// 				offset: {

// 					col: INT_NULL,
// 					wposTime: INT_NULL,
// 					pos: INT_NULL,
// 					tex: INT_NULL,
// 					params1: INT_NULL,
// 					sdf: INT_NULL,
// 				},
// 			},

// 			// Create uniforms buffer. // TODO: Create a dynamic buffer Float32Array, by knowing the num of uniforms meshes will create.
// 			uniforms: {

// 				// Static uniforms
// 				projection: new Uniform(

// 					/* value */ 	0,
// 					/* Location */ gl.getUniformLocation(this.shader_program, 'u_projection'),
// 					/* type */		UNIF_TYPE.MAT4,
// 				),
// 				sampler: gl.getUniformLocation(this.shader_program, 'u_sampler0'),	// Sampler for texture units 	

// 				// Uniforms buffer. Stores any uniform as an array of values.
// 				buffer: new UniformsBuffer(gfxCtx.gl, this, SHADER_CONSTANTS.UNIFORM_BUFFER_COUNT),
// 			},

// 			attribsPerVertex: 0,
// 			verticesPerRect: 0,
// 		};

// 		this.timer = {
// 			val: 0., // A uniform variable to time counter
// 			step: 0.,
// 			index: INT_NULL,
// 			isActive: false,
// 		};

// 		this.#PrivateCreateAttribsOffsets();
// 	}


// 	// Check id sid matches with the program's sid.
// 	CheckSidMatch(sid) {
// 		return SID.CheckSidMatch(sid, this.sid);
// 	}


// 	#PrivateCalculateAttributesSize(sid) {
// 		return {
// 			col: (sid.attr & SID.ATTR.COL4) ? 4 : (0),
// 			wpos: (sid.attr & SID.ATTR.WPOS_TIME4) ? 3 : (0), // BUG: There should be a '.wpos' but there is not, and it should be 'SID.ATTR.WPOS3'
// 			wposTime: (sid.attr & SID.ATTR.WPOS_TIME4) ? 4 : (0),
// 			pos: (sid.attr & SID.ATTR.POS2) ? 2 : (sid.attr & SID.ATTR.POS3) ? 3 : (0),
// 			tex: (sid.attr & SID.ATTR.TEX2) ? 2 : (0),
// 			params1: (sid.attr & SID.ATTR.PARAMS1) ? 4 : (0),
// 			time: ((sid.attr & SID.ATTR.TIME) || (sid.attr & SID.ATTR.WPOS_TIME4)) ? 1 : (0),
// 			sdf: (sid.attr & SID.ATTR.SDF) ? 2 : (0),
// 		}
// 	}


// 	#PrivateCreateAttribsOffsets() {

// 		// Sort the attributes by their location in the shader
// 		const obj = this.shaderinfo.attributes.loc;
// 		const sortedAttribLocations = Object.entries(obj)
// 			.sort(([, v1], [, v2]) => v1 - v2)
// 			.reduce((obj, [k, v]) => ({
// 				...obj,
// 				[k]: v
// 			}), {});

// 		// Store back the sorted version
// 		this.shaderinfo.attributes.loc = sortedAttribLocations;


// 		/**
// 		 * Calculate attribute's offsets (it's byte offset in the vertex buffer)
// 		 * !IMPORTANT!: For any new attributes added in any vertex shader, include it as shown below 
// 		 */
// 		let attribsOffset = 0;
// 		for (let prop in sortedAttribLocations) {

// 			if (sortedAttribLocations[prop] > INT_NULL) {

// 				if (prop === 'col') {
// 					this.shaderinfo.attributes.offset.col = attribsOffset;
// 					attribsOffset += this.shaderinfo.attributes.size.col;
// 				}
// 				else if (prop === 'pos') {
// 					this.shaderinfo.attributes.offset.pos = attribsOffset;
// 					attribsOffset += this.shaderinfo.attributes.size.pos;
// 				}
// 				else if (prop === 'wposTime') {
// 					this.shaderinfo.attributes.offset.wposTime = attribsOffset;
// 					attribsOffset += this.shaderinfo.attributes.size.wposTime - 1;
// 					// HACK. // TODO, correct
// 					this.shaderinfo.attributes.offset.time = attribsOffset;
// 					attribsOffset += 1;
// 				}
// 				else if (prop === 'tex') {
// 					this.shaderinfo.attributes.offset.tex = attribsOffset;
// 					attribsOffset += this.shaderinfo.attributes.size.tex;
// 				}
// 				else if (prop === 'params1') {
// 					this.shaderinfo.attributes.offset.params1 = attribsOffset;
// 					attribsOffset += this.shaderinfo.attributes.size.params1;
// 				}
// 				// else if (prop === 'style') {
// 				// 	this.shaderinfo.attributes.offset.style = attribsOffset;
// 				// 	attribsOffset += this.shaderinfo.attributes.size.style;
// 				// }
// 				else if (prop === 'sdf') {
// 					this.shaderinfo.attributes.offset.sdf = attribsOffset;
// 					attribsOffset += this.shaderinfo.attributes.size.sdf;
// 				}
// 			}
// 		}

// 		// Store the total attributes count
// 		this.shaderinfo.attribsPerVertex = attribsOffset;

// 		// Store the total vertices per rectangle mesh based on Indexed geometry or not
// 		if (this.sid.shad & SID.SHAD.INDEXED) {
// 			this.shaderinfo.verticesPerRect = VERTS_PER_RECT_INDEXED;
// 		}
// 		else {
// 			this.shaderinfo.verticesPerRect = VERTS_PER_RECT;
// 		}

// 		if (DEBUG.SHADER_INFO) console.log('ShaderInfo:', this.shaderinfo)

// 	}


// 	/** Update all program's Uniforms */
// 	UpdateUniforms(gl) {

// 		if (this.timer.isActive) this, UniformsUpdateTimer();
// 		if (this.shaderinfo.uniforms.buffer.needsUpdate) {
// 			this.UniformsUpdateBufferUniforms(gl);
// 		}
// 	}


// 	/**
// 	 * Uniforms Buffer
// 	 */
// 	UniformsCreateBufferUniform(name) {
// 		this.shaderinfo.uniforms.buffer.CreateUniform(name);
// 	}


// 	UniformsSetBufferUniform(val, index) {
// 		this.shaderinfo.uniforms.buffer.Set(val, index);
// 	}


// 	UniformsCreateSetBufferUniform(name, val) {
// 		const idx = this.shaderinfo.uniforms.buffer.CreateUniform(name);
// 		this.shaderinfo.uniforms.buffer.Set(val, idx);
// 	}


// 	UniformsUpdateBufferUniforms(gl) {
// 		this.shaderinfo.uniforms.buffer.Update(gl);
// 	}


// 	UniformsSetUpdateBufferUniform(gl, val, index) {
// 		this.shaderinfo.uniforms.buffer.Set(val, index);
// 		this.shaderinfo.uniforms.buffer.Update(gl);
// 	}


// 	/**
// 	 * Unique Uniforms.
// 	 * New uniforms that are set by the client and are created as a seperate uniforms in the shaders.
// 	 */
// 	UniformsCreateTimer(step) {

// 		// 'Activates' 1 array element of the uniforms buffer array.
// 		this.timer.isActive = true;
// 		this.timer.step = step;
// 		this.timer.index = this.shaderinfo.uniforms.buffer.CreateUniform('Timer');
// 	}


// 	UniformsUpdateTimer() {

// 		this.shaderinfo.uniforms.buffer.Set(this.timer.val, this.timer.index);
// 		this.uniformsNeedUpdate = true;
// 		this.timer.val += this.timer.step;
// 	}


// 	UniformsBufferCreateScreenRes() {
// 		/**
// 		 * 'Activates' 2 array elements of the uniforms buffer array, and returns the 2 indexes
// 		 *  so the caller can 'Set' the uniforms value at it's site.
// 		 */
// 		const resXidx = this.shaderinfo.uniforms.buffer.CreateUniform('ScreenResX');
// 		const resYidx = this.shaderinfo.uniforms.buffer.CreateUniform('ScreenResY');

// 		return {
// 			resXidx: resXidx,
// 			resYidx: resYidx,
// 		};
// 	}


// 	/**
// 	 * Static Uniforms
// 	 * Uniforms that are used in every new program.
// 	 */
// 	UniformsSetProjectionMatrix(val) {
// 		this.shaderinfo.uniforms.projection.Set(val);
// 	}


// 	UniformsUpdateProjectionMatrix(gl) {
// 		this.shaderinfo.uniforms.projection.Update(gl);
// 	}


// 	UniformsSetUpdateProjectionMatrix(gl, val) {
// 		this.shaderinfo.uniforms.projection.Set(val);
// 		this.shaderinfo.uniforms.projection.Update(gl);
// 	}


// 	/**
// 	 * Update all uniforms of glProgram.
// 	 * Not neccesary cause it needs a lot of conditional statements
// 	 */
// 	UniformsUpdate(gl) {
// 		if (this.shaderinfo.uniforms.buffer.needsUpdate) {
// 			this.shaderinfo.uniforms.buffer.Update(gl);
// 		}
// 		if (this.shaderinfo.uniforms.projection.needsUpdate) {
// 			this.shaderinfo.uniforms.projection.Update(gl, val);
// 		}
// 		this.uniformsNeedUpdate = false;
// 	}

// };

// // export class Gl_Program {

// // 	constructor(gl, sid, idx) {

// // 		this.sid = sid; // Shader Type ID (E.g. ATTR_COL4 | ATTR_POS2 | INDEXED)
// // 		this.idx = idx; // Refference to this programs index in the 'Gl_Programs' buffer.

// // 		this.shader_program = null;
// // 		this.isActive = false;

// // 		this.uniformsNeedUpdate = false;

// // 		this.vb = [];
// // 		this.vertexBufferCount = 0;

// // 		this.ib = [];
// // 		this.indexBufferCount = 0;

// // 		this.shader_program = LoadShaderProgram(gfxCtx.gl, sid);

// // 		PrintShaderInfo(this);

// // 		this.shaderinfo = {

// // 			attributes: {

// // 				size: this.#PrivateCalculateAttributesSize(this.sid),

// // 				loc: {

// // 					col: gl.getAttribLocation(this.shader_program, 'a_col'), // Color	
// // 					wposTime: gl.getAttribLocation(this.shader_program, 'a_wpos_time'), // World Position + Time attrib	 		
// // 					pos: gl.getAttribLocation(this.shader_program, 'a_pos'),	// Vertex Position	 
// // 					tex: gl.getAttribLocation(this.shader_program, 'a_tex'), // texture Coords	 		 		
// // 					params1: gl.getAttribLocation(this.shader_program, 'a_params1'), // A 4 component vector to pass any parameter to a vertex as an attribute 	 		
// // 					sdf: gl.getAttribLocation(this.shader_program, 'a_sdf'),	// For Sdf's  	 		 		
// // 				},

// // 				offset: {

// // 					col: INT_NULL,
// // 					wposTime: INT_NULL,
// // 					pos: INT_NULL,
// // 					tex: INT_NULL,
// // 					params1: INT_NULL,
// // 					sdf: INT_NULL,
// // 				},
// // 			},

// // 			// Create uniforms buffer. // TODO: Create a dynamic buffer Float32Array, by knowing the num of uniforms meshes will create.
// // 			uniforms: {

// // 				// Static uniforms
// // 				projection: new Uniform(

// // 					/* value */ 	0,
// // 					/* Location */ gl.getUniformLocation(this.shader_program, 'u_projection'),
// // 					/* type */		UNIF_TYPE.MAT4,
// // 				),
// // 				sampler: gl.getUniformLocation(this.shader_program, 'u_sampler0'),	// Sampler for texture units 	

// // 				// Uniforms buffer. Stores any uniform as an array of values.
// // 				buffer: new UniformsBuffer(gfxCtx.gl, this, SHADER_CONSTANTS.UNIFORM_BUFFER_COUNT),
// // 			},

// // 			attribsPerVertex: 0,
// // 			verticesPerRect: 0,
// // 		};

// // 		this.timer = {
// // 			val: 0., // A uniform variable to time counter
// // 			step: 0.,
// // 			index: INT_NULL,
// // 			isActive: false,
// // 		};

// // 		this.#PrivateCreateAttribsOffsets();
// // 	}


// // 	// Check id sid matches with the program's sid.
// // 	CheckSidMatch(sid) {
// // 		return SID.CheckSidMatch(sid, this.sid);
// // 	}


// // 	#PrivateCalculateAttributesSize(sid) {
// // 		return {
// // 			col: (sid.attr & SID.ATTR.COL4) ? 4 : (0),
// // 			wpos: (sid.attr & SID.ATTR.WPOS_TIME4) ? 3 : (0), // BUG: There should be a '.wpos' but there is not, and it should be 'SID.ATTR.WPOS3'
// // 			wposTime: (sid.attr & SID.ATTR.WPOS_TIME4) ? 4 : (0),
// // 			pos: (sid.attr & SID.ATTR.POS2) ? 2 : (sid.attr & SID.ATTR.POS3) ? 3 : (0),
// // 			tex: (sid.attr & SID.ATTR.TEX2) ? 2 : (0),
// // 			params1: (sid.attr & SID.ATTR.PARAMS1) ? 4 : (0),
// // 			time: ((sid.attr & SID.ATTR.TIME) || (sid.attr & SID.ATTR.WPOS_TIME4)) ? 1 : (0),
// // 			sdf: (sid.attr & SID.ATTR.SDF) ? 2 : (0),
// // 		}
// // 	}


// // 	#PrivateCreateAttribsOffsets() {
// // 		{
// // 			// Sort the attributes by their location in the shader
// // 			const obj = this.shaderinfo.attributes.loc;
// // 			const sortedAttribLocations = Object.entries(obj)
// // 				.sort(([, v1], [, v2]) => v1 - v2)
// // 				.reduce((obj, [k, v]) => ({
// // 					...obj,
// // 					[k]: v
// // 				}), {});

// // 			// Store back the sorted version
// // 			this.shaderinfo.attributes.loc = sortedAttribLocations;


// // 			/**
// // 			 * Calculate attribute's offsets (it's byte offset in the vertex buffer)
// // 			 * !IMPORTANT!: For any new attributes added in any vertex shader, include it as shown below 
// // 			 */
// // 			let attribsOffset = 0;
// // 			for (let prop in sortedAttribLocations) {

// // 				if (sortedAttribLocations[prop] > INT_NULL) {

// // 					if (prop === 'col') {
// // 						this.shaderinfo.attributes.offset.col = attribsOffset;
// // 						attribsOffset += this.shaderinfo.attributes.size.col;
// // 					}
// // 					else if (prop === 'pos') {
// // 						this.shaderinfo.attributes.offset.pos = attribsOffset;
// // 						attribsOffset += this.shaderinfo.attributes.size.pos;
// // 					}
// // 					else if (prop === 'wposTime') {
// // 						this.shaderinfo.attributes.offset.wposTime = attribsOffset;
// // 						attribsOffset += this.shaderinfo.attributes.size.wposTime - 1;
// // 						// HACK. // TODO, correct
// // 						this.shaderinfo.attributes.offset.time = attribsOffset;
// // 						attribsOffset += 1;
// // 					}
// // 					else if (prop === 'tex') {
// // 						this.shaderinfo.attributes.offset.tex = attribsOffset;
// // 						attribsOffset += this.shaderinfo.attributes.size.tex;
// // 					}
// // 					else if (prop === 'params1') {
// // 						this.shaderinfo.attributes.offset.params1 = attribsOffset;
// // 						attribsOffset += this.shaderinfo.attributes.size.params1;
// // 					}
// // 					// else if (prop === 'style') {
// // 					// 	this.shaderinfo.attributes.offset.style = attribsOffset;
// // 					// 	attribsOffset += this.shaderinfo.attributes.size.style;
// // 					// }
// // 					else if (prop === 'sdf') {
// // 						this.shaderinfo.attributes.offset.sdf = attribsOffset;
// // 						attribsOffset += this.shaderinfo.attributes.size.sdf;
// // 					}
// // 				}
// // 			}

// // 			// Store the total attributes count
// // 			this.shaderinfo.attribsPerVertex = attribsOffset;

// // 			// Store the total vertices per rectangle mesh based on Indexed geometry or not
// // 			if (this.sid.shad & SID.SHAD.INDEXED) {
// // 				this.shaderinfo.verticesPerRect = VERTS_PER_RECT_INDEXED;
// // 			}
// // 			else {
// // 				this.shaderinfo.verticesPerRect = VERTS_PER_RECT;
// // 			}

// // 			if (DEBUG.SHADER_INFO) console.log('ShaderInfo:', this.shaderinfo)

// // 		}
// // 	}


// // 	/** Update all program's Uniforms */
// // 	UpdateUniforms(gl) {

// // 		if (this.timer.isActive) this, UniformsUpdateTimer();
// // 		if (this.shaderinfo.uniforms.buffer.needsUpdate) {
// // 			this.UniformsUpdateBufferUniforms(gl);
// // 		}
// // 	}


// // 	/**
// // 	 * Uniforms Buffer
// // 	 */
// // 	UniformsCreateBufferUniform(name) {
// // 		this.shaderinfo.uniforms.buffer.CreateUniform(name);
// // 	}


// // 	UniformsSetBufferUniform(val, index) {
// // 		this.shaderinfo.uniforms.buffer.Set(val, index);
// // 	}


// // 	UniformsCreateSetBufferUniform(name, val) {
// // 		const idx = this.shaderinfo.uniforms.buffer.CreateUniform(name);
// // 		this.shaderinfo.uniforms.buffer.Set(val, idx);
// // 	}


// // 	UniformsUpdateBufferUniforms(gl) {
// // 		this.shaderinfo.uniforms.buffer.Update(gl);
// // 	}


// // 	UniformsSetUpdateBufferUniform(gl, val, index) {
// // 		this.shaderinfo.uniforms.buffer.Set(val, index);
// // 		this.shaderinfo.uniforms.buffer.Update(gl);
// // 	}


// // 	/**
// // 	 * Unique Uniforms.
// // 	 * New uniforms that are set by the client and are created as a seperate uniforms in the shaders.
// // 	 */
// // 	UniformsCreateTimer(step) {

// // 		// 'Activates' 1 array element of the uniforms buffer array.
// // 		this.timer.isActive = true;
// // 		this.timer.step = step;
// // 		this.timer.index = this.shaderinfo.uniforms.buffer.CreateUniform('Timer');
// // 	}


// // 	UniformsUpdateTimer() {

// // 		this.shaderinfo.uniforms.buffer.Set(this.timer.val, this.timer.index);
// // 		this.uniformsNeedUpdate = true;
// // 		this.timer.val += this.timer.step;
// // 	}


// // 	UniformsBufferCreateScreenRes() {
// // 		/**
// // 		 * 'Activates' 2 array elements of the uniforms buffer array, and returns the 2 indexes
// // 		 *  so the caller can 'Set' the uniforms value at it's site.
// // 		 */
// // 		const resXidx = this.shaderinfo.uniforms.buffer.CreateUniform('ScreenResX');
// // 		const resYidx = this.shaderinfo.uniforms.buffer.CreateUniform('ScreenResY');

// // 		return {
// // 			resXidx: resXidx,
// // 			resYidx: resYidx,
// // 		};
// // 	}


// // 	/**
// // 	 * Static Uniforms
// // 	 * Uniforms that are used in every new program.
// // 	 */
// // 	UniformsSetProjectionMatrix(val) {
// // 		this.shaderinfo.uniforms.projection.Set(val);
// // 	}


// // 	UniformsUpdateProjectionMatrix(gl) {
// // 		this.shaderinfo.uniforms.projection.Update(gl);
// // 	}


// // 	UniformsSetUpdateProjectionMatrix(gl, val) {
// // 		this.shaderinfo.uniforms.projection.Set(val);
// // 		this.shaderinfo.uniforms.projection.Update(gl);
// // 	}


// // 	CreateIndexBuffer(sid, gl, vao, indices_per_rect) {

// // 		const ibidx = Gl_ib_create_indexbuffer(sid, gl, vao, indices_per_rect);
// // 		const ibidx_in_prog = this.ib.push(ibidx) - 1; // Store the ibidx...
// // 		Gl_ib_set_idx_in_prog(ibidx, ibidx_in_prog) // ...and send the programs indexbuffer index to the IndexBuffer.
// // 	}


// // 	/**
// // 	 * Update all uniforms of glProgram.
// // 	 * Not neccesary cause it needs a lot of conditional statements
// // 	 */
// // 	UniformsUpdate(gl) {
// // 		if (this.shaderinfo.uniforms.buffer.needsUpdate) {
// // 			this.shaderinfo.uniforms.buffer.Update(gl);
// // 		}
// // 		if (this.shaderinfo.uniforms.projection.needsUpdate) {
// // 			this.shaderinfo.uniforms.projection.Update(gl, val);
// // 		}
// // 		this.uniformsNeedUpdate = false;
// // 	}

// // };


// // Scoped global Gl Program object
// const _gl_programs_groups = {

// 	buffer: [],
// 	count: 0,

// 	CreateGroup(sceneidx) {
// 		const groupidx = this.count++;
// 		this.buffer[groupidx] = new Gl_Programs(); // Create new buffer to store gl shader programs

// 		// Scenes_create_programs_group_buffer(sceneidx, groupidx); // For storing meshes by its gfx
// 		Gfx_create_group_buffer(groupidx);

// 		return groupidx; // Return the index of the newly created group buffer.
// 	},


// 	CreateProgram(gl, sid) {

// 		let groupidx = INT_NULL;
// 		const sceneidx = 0;
// 		if (!this.GroupExists(PROGRAMS_GROUPS.GetIdxByMask(sid.progs_group))) { // If group does not exist, create it.

// 			groupidx = this.CreateGroup(sceneidx);

// 			// IMPORTANT! Here we set globaly the index of the program group.
// 			if (sid.progs_group & PROGRAMS_GROUPS.DEBUG.MASK) PROGRAMS_GROUPS.DEBUG.IDX = groupidx;
// 			else if (sid.progs_group & PROGRAMS_GROUPS.DEFAULT.MASK) PROGRAMS_GROUPS.DEFAULT.IDX = groupidx;
// 		}
// 		else groupidx = PROGRAMS_GROUPS.GetIdxByMask(sid.progs_group);

// 		const progidx = this.buffer[groupidx].CreateProgram(gl, sid); // Create the shader program

// 		// Scenes_create_programs_buffer(sceneidx, groupidx, progidx); // For storing meshes by its gfx, also binds the camera's uniform matrix to the shader program uniform
// 		Gfx_create_program_buffer(groupidx, progidx);

// 		// console.log('++++ Program shader group:', PROGRAMS_GROUPS.GetName(sid.progs_group), ' groupidx:', groupidx, ' progidx:', progidx)

// 		return { progidx: progidx, groupidx: groupidx };
// 	},


// 	GroupExists(prog_group_idx) {

// 		if (prog_group_idx !== INT_NULL && this.buffer[prog_group_idx]) return true;
// 		return false;
// 	},

// };

// export function GL_PROGRAM_STORE_VERTEX_BUFFER_INDEX_TEMP(groupidx, progidx, vbidx) {
// 	const progvbidx = _gl_programs_groups.buffer[groupidx].buffer[progidx].vb.Add(vbidx);
// 	return progvbidx ;
// }
// export function GL_PROGRAM_STORE_INDEX_BUFFER_INDEX_TEMP(groupidx, progidx, ibidx) {
// 	const progibidx = _gl_programs_groups.buffer[groupidx].buffer[progidx].ib.Add(ibidx);
// 	return progibidx;
// }
// export function GL_PROGRAM_GET_SHADER_INFO_TEMP(groupidx, progidx) {

// 	const prog = Gl_progs_get_prog_byidx(groupidx, progidx);

// 	const attribsPerVertex = prog.shaderinfo.attribsPerVertex;
// 	const loc = prog.shaderinfo.attributes.loc;
// 	const size = prog.shaderinfo.attributes.size;
// 	const offset = prog.shaderinfo.attributes.offset;

// 	const shader_info = {
// 		locations: new Int8Array(8),
// 		sizes: new Int8Array(8),
// 		offsets: new Int8Array(8),
// 		attribsPerVertex: attribsPerVertex,
// 	}

// 	for (let i = 0; i < 8; i++) {
// 		shader_info.locations[i] = -1;
// 		shader_info.sizes[i] = -1;
// 		shader_info.offsets[i] = -1;
// 	}

// 	// For Uniforms
// 	if (loc.col >= 0) {
// 		shader_info.locations[loc.col] = loc.col;
// 		shader_info.sizes[loc.col] = size.col;
// 		shader_info.offsets[loc.col] = offset.col;
// 	}
// 	if (loc.pos >= 0) {
// 		shader_info.locations[loc.pos] = loc.pos;
// 		shader_info.sizes[loc.pos] = size.pos;
// 		shader_info.offsets[loc.pos] = offset.pos;
// 	}
// 	if (loc.tex >= 0) {
// 		shader_info.locations[loc.tex] = loc.tex;
// 		shader_info.sizes[loc.col] = size.tex;
// 		shader_info.offsets[loc.tex] = offset.tex;
// 	}
// 	if (loc.wposTime >= 0) {
// 		shader_info.locations[loc.wposTime] = loc.wposTime;
// 		shader_info.sizes[loc.wposTime] = size.wposTime;
// 		shader_info.offsets[loc.wposTime] = offset.wposTime;
// 	}
// 	if (loc.params1 >= 0) {
// 		shader_info.locations[loc.params1] = loc.params1;
// 		shader_info.sizes[loc.params1] = size.params1;
// 		shader_info.offsets[loc.params1] = offset.params1;
// 	}
// 	if (loc.style >= 0) {
// 		shader_info.locations[loc.style] = loc.style;
// 		shader_info.sizes[loc.style] = size.style;
// 		shader_info.offsets[loc.style] = offset.style;
// 	}
// 	if (loc.time >= 0) {
// 		shader_info.locations[loc.time] = loc.time;
// 		shader_info.sizes[loc.time] = size.time;
// 		shader_info.offsets[loc.time] = offset.time;
// 	}
// 	if (loc.sdf >= 0) {
// 		shader_info.locations[loc.sdf] = loc.sdf;
// 		shader_info.sizes[loc.sdf] = size.sdf;
// 		shader_info.offsets[loc.sdf] = offset.sdf;
// 	}

// 	return shader_info;
// }



// export function Progarm_get_program() {
// 	return _gl_programs_groups;
// }



// export function Program_get_group(groupidx = INT_NULL) {
// 	return _gl_programs_groups.buffer[groupidx];
// }



// export function Gl_progs_get_prog_byidx(groupidx = INT_NULL, progidx) {
// 	return _gl_programs_groups.buffer[groupidx].buffer[progidx];
// }



// export function Gl_vertex_buffer_get_old(groupidx = INT_NULL, progidx, vbIdx) {
// 	// return _gl_programs_groups.buffer[groupidx].buffer[progidx].vb[vbIdx];
// 	console.error('NO IMPLEMENTATION')
// }



// export function Gl_progs_get_ib_byidx(groupidx = INT_NULL, progidx, ibIdx) {
// 	// return Gl_ib_get_byidx(_gl_programs_groups.buffer[groupidx].buffer[progidx].ib[ibIdx]);
// 	console.error('NO IMPLEMENTATION')
// }



// export function Gl_progs_get_shaderinfo(groupidx = INT_NULL, progidx) {
// 	return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo;
// }



// export function Gl_progs_get_shaderinfo_uniforms(groupidx = INT_NULL, progidx) {
// 	return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.uniforms;
// }



// export function Gl_progs_set_vb_texidx_unused(groupidx = INT_NULL, progidx, vbIdx, texidx) {
// 	// _gl_programs_groups.buffer[groupidx].buffer[progidx].vb[vbIdx].texidx = texidx;
// 	const vb = Gl_vertex_buffer_info_get_by_vbidx(vbIdx);
// 	vb.texidx = texidx;
// }


// // Get program's shder info
// // Offsets
// export function Gl_progs_get_shaderinfo_wposTime_offset(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.offset.wposTime }

// export function Gl_progs_get_shaderinfo_col_offset(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.offset.col }

// export function Gl_progs_get_shaderinfo_dim_offset(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.offset.pos }

// export function Gl_progs_get_shaderinfo_tex_offset(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.offset.tex }

// export function Gl_progs_get_shaderinfo_params1_offset(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.offset.params1 }

// export function Gl_progs_get_shaderinfo_sdf_offset(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.offset.sdf }

// // Sizes
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.size.wposTime }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.size.col }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.size.pos }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.size.tex }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.size.params1 }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.size.sdf }
// // Locations
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.loc.wposTime }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.loc.col }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.loc.pos }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.loc.tex }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.loc.params1 }
// // export function Gl_progs_get_shaderinfo_wpos_offset(groupidx, progidx) { _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attributes.loc.sdf }



// export function Gl_progs_get_shaderinfo_vertices_per_rect(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.verticesPerRect }
// export function Gl_progs_get_shaderinfo_attribs_per_vertex(groupidx, progidx) { return _gl_programs_groups.buffer[groupidx].buffer[progidx].shaderinfo.attribsPerVertex }



// export function Gl_create_program(sid) {
// 	return _gl_programs_groups.CreateProgram(gfxCtx.gl, sid);
// }



// export function Gl_get_progam_group_count() {
// 	return _gl_programs_groups.count;
// }



// export function Gl_get_progams_count(groupidx = INT_NULL) {
// 	return _gl_programs_groups.buffer[groupidx].count;
// }



// export function Gl_set_vb_show(groupidx = INT_NULL, progidx, vbIdx, flag) {
// 	// _gl_programs_groups.buffer[groupidx].buffer[progidx].vb[vbIdx].show = flag;
// 	const vb = Gl_vertex_buffer_info_get_by_vbidx(vbIdx);
// 	if (flag === true) vb.state.mask |= BUFFER_STATE.SHOW;
// 	else vb.state.mask &= ~B_INFO_FLAGS.SHOW;
// 	// Gl_ib_set_show(_gl_programs_groups.buffer[groupidx].buffer[progidx].ib[vbIdx], flag)
// 	Renderqueue_set_active(groupidx, progidx, vbIdx, flag); // Update the draw buffer
// }




// export function GlProgramUpdateUniformProjectionMatrix(gl, groupidx = INT_NULL, progidx, mat4) {

// 	const prog = _gl_programs_groups.buffer[groupidx].buffer[progidx];
// 	GlUseProgram(prog.shader_program);
// 	prog.UniformsSetUpdateProjectionMatrix(gl, mat4);

// }



// export function GlCheckSid(sid, progidx) {

// 	const groupidx = PROGRAMS_GROUPS.GetIdxByMask(sid.progs_group);
// 	if (groupidx === INT_NULL) return false; // Case  programs group hasn't been created

// 	const progs_group = Program_get_group(groupidx);
// 	if (!progs_group.buffer[progidx]) return false;	// Case  program in programs group hasn't been created

// 	const prog = progs_group.buffer[progidx];

// 	if (SID.CheckSidMatch(sid, prog.sid)) return true;
// 	return false;
// }

