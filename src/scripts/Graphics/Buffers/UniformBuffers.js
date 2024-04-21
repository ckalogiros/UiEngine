"use strict";

import { New_generic_buffer } from "../../Engine/Core/Buffers.js";
import { Program_use_program } from "../ShaderPrograms.js";
import { UNIFORM_BLOCK_SHARED_NAME } from "../Shaders/ShaderBuilder/ShaderBuilder.js";



const DISABLE_DEBUG = true;



/*************************************************************************************************************************************/
// 
/*************************************************************************************************************************************/

// Array of scalars
// function SetValueV1f(gl, loc, val) { gl.uniform1fv(loc, val); }
function SetValueV1f(gl, loc, val) { gl.uniform1f(loc, val); }

// Array of vectors (from flat array or array of THREE.VectorN)
function SetValueV2f(gl, loc, val) { gl.uniform2fv(loc, val); }
function SetValueV3f(gl, loc, val) { gl.uniform3fv(loc, val); }
function SetValueV4f(gl, loc, val) { gl.uniform4fv(loc, val); }

// Array of matrices (from flat array or array of THREE.MatrixN)
function SetValueM2(gl, loc, val) { gl.uniformMatrix2fv(loc, false, val); }
function SetValueM3(gl, loc, val) { gl.uniformMatrix3fv(loc, false, val); }
function SetValueM4(gl, loc, val) { gl.uniformMatrix4fv(loc, false, val); }

// Array of integer / boolean
function SetValueV1i(gl, loc, val) { gl.uniform1iv(loc, val); }

// Array of integer / boolean vectors (from flat array)
function SetValueV2i(gl, loc, val) { gl.uniform2iv(loc, val); }
function SetValueV3i(gl, loc, val) { gl.uniform3iv(loc, val); }
function SetValueV4i(gl, loc, val) { gl.uniform4iv(loc, val); }

// Array of unsigned integer
function SetValueV1ui(gl, loc, val) { gl.uniform1uiv(loc, val); }

// Array of unsigned integer vectors (from flat array)
function SetValueV2ui(gl, loc, val) { gl.uniform2uiv(loc, val); }
function SetValueV3ui(gl, loc, val) { gl.uniform3uiv(loc, val); }
function SetValueV4ui(gl, loc, val) { gl.uniform4uiv(loc, val); }




// gl.getActiveUniform(this.shader_program, idx)
// gl.getActiveUniforms(this.shader_program, indices, TYPE_TO_RETRACT);
// TYPE_TO_RETRACT TYPES
// gl.UNIFORM_TYPE            Returns an Array of GLenum indicating the types of the uniforms.
// gl.UNIFORM_SIZE            Returns an Array of GLuint indicating the sizes of the uniforms.
// gl.UNIFORM_BLOCK_INDEX     Returns an Array of GLint indicating the block indices of the uniforms.
// gl.UNIFORM_OFFSET          Returns an Array of GLint indicating the uniform buffer offsets.
// gl.UNIFORM_ARRAY_STRIDE    Returns an Array of GLint indicating the strides between the elements.
// gl.UNIFORM_MATRIX_STRIDE   Returns an Array of GLint indicating the strides between columns of a column-major matrix or a row-major matrix.
// gl.UNIFORM_IS_ROW_MAJOR    Returns an Array of GLboolean indicating whether each of the uniforms is a row-major matrix or not.

class Uniform {


   constructor(gl = null, shader_program = null, type = INT_NULL, name = '') {

      // const uniformInfo = gfxCtx.gl.getActiveUniform(this.shader_program, idx);
      const loc = gl.getUniformLocation(shader_program, name);
      /**DEBUG */if (loc > 0xffff) alert('invalid uniform loc. name does not exist OR uniform is not enabled in the shader.');
      // const type = gl.getActiveUniform(shader_program, 0)


      this.val = 0;// Uniform value
      this.loc = loc; // Uniform location
      this.name = name; // Uniform name
      this.needsUpdate = false;
      this.UpdateUniform = null; // Gl specific type function for updating the uniform.

      this.is_set_bound = false;
      this.is_update_bound = false;


      switch (type) {
         // From THREE.js
         case UNIF_TYPE.FLOAT: { this.UpdateUniform = SetValueV1f; break; } // FLOAT
         case UNIF_TYPE.FVEC2: { this.UpdateUniform = SetValueV2f; break; } // F_VEC2
         case UNIF_TYPE.FVEC3: { this.UpdateUniform = SetValueV3f; break; } // F_VEC3
         case UNIF_TYPE.FVEC4: { this.UpdateUniform = SetValueV4f; break; } // F_VEC4

         case UNIF_TYPE.MAT2: { this.UpdateUniform = SetValueM2; break; } // F_MAT2
         case UNIF_TYPE.MAT3: { this.UpdateUniform = SetValueM3; break; } // F_MAT3
         case UNIF_TYPE.MAT4: { this.UpdateUniform = SetValueM4; break; } // F_MAT4

         case UNIF_TYPE.INT: { this.UpdateUniform = SetValueV1i; break; } // INT, BOOL
         case UNIF_TYPE.BOOL: { this.UpdateUniform = SetValueV1i; break; } // INT, BOOL
         case UNIF_TYPE.IVEC2: { this.UpdateUniform = SetValueV2i; break; } // I_VEC2
         case UNIF_TYPE.IVEC3: { this.UpdateUniform = SetValueV3i; break; } // I_VEC3
         case UNIF_TYPE.UIVEC4: { this.UpdateUniform = SetValueV4i; break; } // I_VEC4

         case UNIF_TYPE.UINT: { this.UpdateUniform = SetValueV1ui; break; } // UINT
         case UNIF_TYPE.UIVEC2: { this.UpdateUniform = SetValueV2ui; break; } // UI_VEC2
         case UNIF_TYPE.UIVEC3: { this.UpdateUniform = SetValueV3ui; break; } // UI_VEC3
         case UNIF_TYPE.UIVEC4: { this.UpdateUniform = SetValueV4ui; break; } // UI_VEC4

         default: { console.error('The type of the uniform\'s value is unknown.\nType:', type); alert('SEE console error.\nUniform Type Not Found.'); break; }

      }

   }


   Set(val) {
      this.val = val;
      this.needsUpdate = true;
   }


   Update() {
      this.UpdateUniform(gfxCtx.gl, this.loc, this.val);
      this.needsUpdate = false;
   }
}


const _uniforms_buffer = New_generic_buffer(_, 'GFX Uniforms');



export function Uniforms_buffer_create_uniform(gl, shader_program, type, name) {

   const uniform = new Uniform(gl, shader_program, type, name);
   const idx = _uniforms_buffer.Add(uniform); // Add new unifor to local buffer
   console.warn('1111111 Uniform Created at index:', idx, _uniforms_buffer)
   // return uniform
}



export function Uniforms_buffer_get_uniform_byidx(ubidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   return _uniforms_buffer[ubidx];
}



export function Uniforms_buffer_set_uniform(ubidx, val) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   _uniforms_buffer[ubidx].Set(val);
}



export function Uniforms_buffer_update_uniform(ubidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   _uniforms_buffer[ubidx].Update();
}



/** 'functions' MUST HAVE .Set and .Update fields, so they can be bound to the uniforms Set() and Update(). */
export function Uniforms_buffer_bind_uniform_functions(functions, unif_name = '') {

   // Find uniform by name
   for (let i = 0; i <= _uniforms_buffer.boundary; i++) {

      const unif = _uniforms_buffer.buffer[i];
      /**DEBUG*/if (unif.is_set_bound) alert('Uniform function \'Set\' is already bound.\nSee Uniforms_buffer_bind_uniform_functions().');
      /**DEBUG*/if (unif.is_update_bound) alert('Uniform function \'Update\' is already bound.\nSee Uniforms_buffer_bind_uniform_functions().');

      if (unif.name === unif_name) {

         // Set the 'Set' and 'Update' 
         if (!unif.is_set_bound) {

            functions.Set = unif.Set.bind(unif);
            unif.is_set_bound = true;
         }
         if (!unif.is_update_bound) {

            functions.Update = unif.Update.bind(unif);
            unif.is_update_bound = true;
         }
      }
   }


   // TODO: 
   // Create an 'export function Uniforms_invalidate_uniform_bind()', for the caller to voluntarily unbind from the uniform
   // What happens if the uniform gets invalidated by deleting the program????
   // Solutions: 
   //    1. Pass a third function callback, to call uppon invalidation and unbind the 'Set' and 'Update' function at caller site 
   //       That means to have a buffer of invalidation callback functions.

}





/*************************************************************************************************************************************/
// 
/*************************************************************************************************************************************/

export class UniformsBuffer {

   ub;
   names; // A way to get a specific uniforms index.
   count;
   loc;
   needsUpdate;

   constructor(gl, prog, size) {

      this.needsUpdate = false;
      this.count = 0;

      Program_use_program(prog.shader_program, prog.idx)
      this.loc = gl.getUniformLocation(prog.shader_program, 'uniforms_buffer');
      if (!this.loc) {
         // console.error('Could not locate uniform: \'uniforms_buffer\'');
         this.ub = null;
         this.names = null;
      }
      else {
         this.ub = new Float32Array(size);
         this.names = [];
         console.log('Uniform: \'uniforms_buffer\' located successfully!')
      }
   }


   CreateUniform(name) {
      const idx = this.count++;
      this.names[idx] = name;
      return idx;
   }


   Set(value, index) {
      this.ub[index] = value;
      this.needsUpdate = true;
   }


   Update(gl) {
      gl.uniform1fv(this.loc, this.ub); // And the shader decides the number of elements to draw from the buffer
      this.needsUpdate = false;
   }

}




/*************************************************************************************************************************************/
// 
/*************************************************************************************************************************************/

const ERROR_UBS = `
1. Is the SID.UNIF.XXX enabled in meshes sid.unif?
2. Is the UBS.XXX_LOC index set?
3. Check the ShaderBuilder.
4. Check all parameters an offsets passed to .AddLayout().`




let _uniform_blocks = New_generic_buffer(_, 'GFX Uniforms Block');


// const CreatedUniforms = [];
function Uniform_block_exists(sid) {

   for (let i = 0; i <= _uniform_blocks.boundary; i++) {

      if (_uniform_blocks.buffer[i].unif_sid & sid) { // Means that the block exists
         return true
      }
   }

   return false;
}



let ubs_counter = 0;
class UniformsBlock {


   constructor(gl, program, uniform_block_name, sid) {

      this.binding_index = ubs_counter++;
      this.name = uniform_block_name;
      this.idx = INT_NULL;
      this.unif_sid = sid;

      this.loc = gl.getUniformBlockIndex(program, uniform_block_name);
      gl.uniformBlockBinding(program, this.loc, this.binding_index);

      this.glbuffer = gl.createBuffer();
      gl.bindBufferBase(gl.UNIFORM_BUFFER, this.binding_index, this.glbuffer);

      this.buffer = null;
      this.buffer_size = 0;
      this.layout = {
         locs: [],
         sizes: [],
         names: [],
      }

      this.needsUpdate = false;


   }


   AddLayout(gl, type, typeid, name) {

      const size = UNIF_TYPE.GetSizeInBytes(type, typeid) / FLOAT32_BYTE_SIZE;

      // Every uniform starts at the end of the prevoius uniform end
      const locidx = this.layout.locs.push(this.buffer_size) - 1;

      // Initialize
      if (!this.buffer) {
         this.buffer = new Float32Array(size);
         this.buffer_size += size;
      }
      else { // Resize buffer to the new size
         this.buffer_size += size;
         const old_buffer = this.buffer;
         this.buffer = new Float32Array(this.buffer_size);

         const old_len = old_buffer.length;
         for (let i = 0; i < old_len; i++) {
            this.buffer[i] = old_buffer[i];
         }
      }

      this.layout.sizes[locidx] = size;
      this.layout.names[locidx] = name;

      gl.bindBufferBase(gl.UNIFORM_BUFFER, this.binding_index, this.glbuffer);
      gl.bufferData(gl.UNIFORM_BUFFER, this.buffer, gl.DYNAMIC_DRAW);

      return locidx;
   }


   SetVal(locidx, val) {

      // IMPORTANT: We must check if val is array 

      const start = this.layout.locs[locidx];
      const size = this.layout.sizes[locidx];

      const len = val.length;
      if (len !== size) { console.error('Uniform Shared Block. location idx:', locidx, '\nERROR MSG:', ERROR_UBS); alert('SEE console error. Size mismatch'); }

      let cnt = start;
      for (let i = 0; i < len; i++) {
         this.buffer[cnt++] = val[i];
      }
   }

}



export function Uniforms_block_buffer_create(sid, program, uniforms) {

   const gl = gfxCtx.gl;

   let ub_idx = INT_NULL;

   // Create the shared block, if it is not yet created
   if (!Uniform_block_exists(sid)) {

      const ub = new UniformsBlock(gl, program, UNIFORM_BLOCK_SHARED_NAME, sid);
      ub_idx = _uniform_blocks.Add(ub);

   }

   let found = false;
   const len = uniforms.length;
   for (let i = 0; i < len; i++) {

      // Avoid duplicates, by checking for matched names
      for (let j = 0; j <= _uniform_blocks.boundary; j++) {

         const layout = _uniform_blocks.buffer[j].layout;
         for (let k = 0; k < len; k++) {

            if (layout.names[k] === uniforms[i].name) {
               found = true;
            }
         }
      }


      if (!found && uniforms[i].shader & UNIFORM.IS_SHARED)
         _uniform_blocks.buffer[0].AddLayout(gl, uniforms[i].type, UNIF_TYPE.ID, uniforms[i].name);
   }

   console.log('---- Uniform Shared Block ----\n', _uniform_blocks)

   return ub_idx;

   // NOTE
   // Combine 2 Uniform Blocks in to one buffer
   // gl.bindBufferRange( BINDING_INDEX, glbuffer, offset, size, )
}



/** The binding happens with an index to the uniform's layout of the '_uniform_blocks' buffer */
export function Uniforms_block_bind_uniform_layout(unif_name = '') {

   // Find matching uniform layout by uniform name
   for (let i = 0; i <= _uniform_blocks.boundary; i++) {

      const ubb = _uniform_blocks.buffer[i];
      const len = ubb.layout.names.length;
      for (let j = 0; j < len; j++) {
         if (ubb.layout.names[j] === unif_name) {
            return j;
         }
      }
   }

   console.error('No Block uniform with name:', unif_name, 'found to be bound. Blocks:', _uniform_blocks);
   alert('No Block uniform found to be bound.\n SEE console error');
}



export function Uniforms_block_set_uniform(uniform_locidx, val) {
   _uniform_blocks.buffer[0].SetVal(uniform_locidx, val);
   _uniform_blocks.buffer[0].needsUpdate = true;
}



export function Uniforms_block_update_uniform() { // HOT-PATH

   if (!_uniform_blocks.buffer[0] || !_uniform_blocks.buffer[0].needsUpdate) return;


   const gl = gfxCtx.gl;

   gl.bindBufferBase(gl.UNIFORM_BUFFER, _uniform_blocks.buffer[0].binding_index, _uniform_blocks.buffer[0].glbuffer);

   const offset = 0; // The offset of the starting index from which to replace the data
   // gl.bufferSubData(gl.UNIFORM_BUFFER, 0, _uniform_blocks.buffer[0].buffer, offset, 0);
   gl.bufferData(gl.UNIFORM_BUFFER, _uniform_blocks.buffer[0].buffer, gl.DYNAMIC_DRAW);

   _uniform_blocks.buffer[0].needsUpdate = false;

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












/* Extract all uniforms and uniform data (size, type, name) directly from shader */
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