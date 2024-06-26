"use strict";

import { New_generic_buffer } from "../../Engine/Core/Buffers.js";
import { Program_use_program } from "../ShaderPrograms.js";
import { UNIFORM_BLOCK_SHARED_NAME } from "../Shaders/ShaderBuilder/ShaderBuilder.js";



const DISABLE_DEBUG = true;






/*************************************************************************************************************************************/
// 
/*************************************************************************************************************************************/

/**
   uniform float v[10];

   Then you can set their values using glUniform{1,2,3,4}{f,i}v

   GLfloat v[10] = {...};
   glUniform1fv(glGetUniformLocation(program, "v"), 10, v);
   
 */

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


   constructor(gl = null, shader_program = null, type = INT_NULL, name = '', progidx=INT_NULL) {

      const loc = gl.getUniformLocation(shader_program, name);
      // const t = gl.getActiveUniform(shader_program, 1)
      /**DEBUG */if (loc > 0xffff || loc === null) {

         console.error('invalid uniform loc. name does not exist OR uniform is not enabled in the shader.\n', 'name', name, 'progidx', progidx);
         alert('invalid uniform loc. name does not exist OR uniform is not enabled in the shader.');
      }


      this.val = 0;// Uniform value
      this.loc = loc; // Uniform location
      this.progidx = progidx; // The index of the program
      this.name = name; // Uniform name
      this.needs_update = false;
      this.UpdateUniform = null; // Gl specific type function for updating the uniform.
      this.GetValClbk = null; // Function callback for getting the uniform value.
      this.clbk_params = null; // Params for the Get value callback

      this.is_bound = false;


      switch (type) {
         // From THREE.js
         // TODO: Initialize the rest of the Arrays
         case UNIF_TYPE.FLOAT: { this.UpdateUniform = SetValueV1f; this.val = 0; break; } // FLOAT
         case UNIF_TYPE.FVEC2: { this.UpdateUniform = SetValueV2f; this.val = new Array(1.1,2); break; } // F_VEC2
         case UNIF_TYPE.FVEC3: { this.UpdateUniform = SetValueV3f; this.val = new Array(0,0,0); break; } // F_VEC3
         case UNIF_TYPE.FVEC4: { this.UpdateUniform = SetValueV4f; this.val = new Array(0,0,0,0); break; } // F_VEC4

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


   SetFromIndex(val, idx=null) {

      if(idx !== null) 
         this.val[idx] = val;
      else this.val = val;
      this.needs_update = true;
      any_needs_update = true;
      // console.log('{$$$$$} UNIFORMS SET FROM INDEX', this.val, 'name:', this.name, 'progidx:', this.progidx)
   }


   Set(val) {
      this.val = val;
      this.needs_update = true;
      any_needs_update = true;
      // console.log('{$$$$$} UNIFORMS SET', this.val, 'name:', this.name, 'progidx:', this.progidx)
   }


   Update() {
      this.UpdateUniform(gfxCtx.gl, this.loc, this.val);
      this.needs_update = false;
      // console.log('{$$$$$} UNIFORMS UPDATE', this.val, 'name:', this.name, 'progidx:', this.progidx)
   }
}


const _uniforms_buffer = New_generic_buffer(_, 'GFX Uniforms');
let any_needs_update = false; // 


export function Uniforms_buffer_create_uniform(gl, shader_program, type, name, progidx) {

   const uniform = new Uniform(gl, shader_program, type, name, progidx);
   const ubidx = _uniforms_buffer.Add(uniform); // Add new unifor to local buffer
   console.info('UUUUUUUUUUUUUUUUUUUUUUUUUUUUU\nUniform Created at index:', ubidx, _uniforms_buffer);

   return ubidx;
}



export function Uniforms_buffer_get_uniform_byidx(ubidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   return _uniforms_buffer.buffer[ubidx];
}



export function Uniforms_buffer_set_uniform(ubidx, val) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   _uniforms_buffer.buffer[ubidx].Set(val);
}



/** Set one value form a uniform vector/array */
export function Uniforms_buffer_set_uniform_val_from_index(ubidx, val, idx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   _uniforms_buffer.buffer[ubidx].SetFromIndex(val, idx);
}



export function Uniforms_buffer_set_uniform_value_from_callback(ubidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   const clbk_params = _uniforms_buffer.buffer[ubidx].clbk_params;
   const val = _uniforms_buffer.buffer[ubidx].GetValClbk(clbk_params);
   _uniforms_buffer.buffer[ubidx].Set(val);
}




export function Uniforms_buffer_update_uniform(ubidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);
   _uniforms_buffer.buffer[ubidx].Update();
}



export function Uniforms_buffer_set_value_callback(ubidx, Clbk, clbk_params) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);

   if(_uniforms_buffer.buffer[ubidx].GetValClbk !== null) { 
      console.error('Set uniform value Callback already been set'); }

   const params = {
      ubidx:ubidx,
      params:clbk_params
   }

   _uniforms_buffer.buffer[ubidx].GetValClbk = Clbk;
   _uniforms_buffer.buffer[ubidx].clbk_params = params;
}



// export function Uniforms_buffer_set_and_update_uniform(ubidx) {
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_uniforms_buffer, ubidx, new Error().lineNumber);

//    if(_uniforms_buffer.buffer[ubidx].GetValClbk === null) { 
//       console.error('Forgot to set uniform value Callback?'); return; }

//    const params = _uniforms_buffer.buffer[ubidx].clbk_params;
//    const val = _uniforms_buffer.buffer[ubidx].GetValClbk(params);
//    _uniforms_buffer.buffer[ubidx].Set(val);
//    _uniforms_buffer.buffer[ubidx].Update();
// }



// export function Uniforms_buffer_update_uniforms_all() {

//    if(!any_needs_update) return;

//    for(let i=0; i <= _uniforms_buffer.boundary; i++){
//       // if(_uniforms_buffer.buffer[i].needs_update) 
//          _uniforms_buffer.buffer[i].Update();
//    }

//    // All uniforms have been updated
//    any_needs_update = false;
// }



export function Uniforms_buffer_find_ubidx_from_name(unif_name = '', progidx) {

   // Find uniform by name
   for (let i = 0; i <= _uniforms_buffer.boundary; i++) {

      const unif = _uniforms_buffer.buffer[i];

      if (unif.name === unif_name && unif.progidx === progidx){
         return i;
      }
   }

   console.error('NO uniform with name found\n', unif_name, 'in program:', progidx)
   return INT_NULL;

   alert('NO uniform with name found\nSEE CONSOLE ERROR\nMaybe forgot to Create the uniform with GfxUniformsEnable()')

}










































/*************************************************************************************************************************************/
// 
/*************************************************************************************************************************************/

export class UniformsBuffer {

   ub;
   names; // A way to get a specific uniforms index.
   count;
   loc;
   needs_update;

   constructor(gl, prog, size) {

      this.needs_update = false;
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
      this.needs_update = true;
   }


   Update(gl) {
      gl.uniform1fv(this.loc, this.ub); // And the shader decides the number of elements to draw from the buffer
      this.needs_update = false;
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

      this.needs_update = false;


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
export function Uniforms_block_get_uniform_by_name(unif_name = '') {

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
   _uniform_blocks.buffer[0].needs_update = true;
}



export function Uniforms_block_update_uniform() { // HOT-PATH

   if (!_uniform_blocks.buffer[0] || !_uniform_blocks.buffer[0].needs_update) return;


   const gl = gfxCtx.gl;

   gl.bindBufferBase(gl.UNIFORM_BUFFER, _uniform_blocks.buffer[0].binding_index, _uniform_blocks.buffer[0].glbuffer);

   const offset = 0; // The offset of the starting index from which to replace the data
   // gl.bufferSubData(gl.UNIFORM_BUFFER, 0, _uniform_blocks.buffer[0].buffer, offset, 0);
   gl.bufferData(gl.UNIFORM_BUFFER, _uniform_blocks.buffer[0].buffer, gl.DYNAMIC_DRAW);

   _uniform_blocks.buffer[0].needs_update = false;

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
























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/

export function Uniforms_buffer_block_print() {
   console.log('_uniform_blocks:', _uniform_blocks);
}

// this.val = 0;// Uniform value
// this.loc = loc; // Uniform location
// this.name = name; // Uniform name
// this.needs_update = false;
// this.UpdateUniform = null; // Gl specific type function for updating the uniform.
// this.is_bound = false;
// this.is_update_bound = false;

export function Uniforms_buffer_print() {
   console.log('_uniforms_buffer\ncount:', _uniforms_buffer.active_count,);
   for(let i=0; i <= _uniforms_buffer.boundary; i++){
      console.log(
         'ubidx', i,
         'name', _uniforms_buffer.buffer[i].name,
         'val', _uniforms_buffer.buffer[i].val,
         'progidx', _uniforms_buffer.buffer[i].progidx,
         'Clbk', _uniforms_buffer.buffer[i].GetValClbk,
         'clbk_params', _uniforms_buffer.buffer[i].clbk_params,
      );
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