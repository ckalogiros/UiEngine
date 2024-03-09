"use strict";

import { M_Buffer } from "../../Engine/Core/Buffers";
import { Str_buffer_store } from "../../Engine/Core/StringBuffer";
import { GetRandomColor } from "../../Helpers/Helpers";
import { Program_use_program } from "../ShaderPrograms";
import { UNIFORM_BLOCK_SHARED_NAME } from "../Shaders/ShaderBuilder/ShaderBuilder";


// Array of scalars
function SetValueV1f(gl, loc, val) { gl.uniform1fv(loc, val); }


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




export class Uniform {


   constructor(val = null, loc = null, type = null) {

      this.val = val;// Uniform value
      this.loc = loc; // Uniform Location
      this.needsUpdate = false;
      this.UpdateUniform = null; // Function

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

         default: { console.error('The type of the uniform\'s value is unknown'); break; }

      }
   }


   Set(val) {
      this.val = val;
      this.needsUpdate = true;
   }


   Update(gl) {
      this.UpdateUniform(gl, this.loc, this.val);
      this.needsUpdate = false;
   }
}



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






const ERROR_UBS = `
1. Is the SID.UNIF.XXX enabled in meshes sid.unif?
2. Is the UBS.XXX_LOC index set?
3. Check the ShaderBuilder.
4. Check all parameters an offsets passed to .AddLayout().`







let _uniform_blocks = new M_Buffer();






// const CreatedUniforms = [];
function CheckUniformBlockExists(sid){

   for( let i=0; i<_uniform_blocks.boundary; i++){

      if(_uniform_blocks.buffer[i].unif_sid & sid){ // Means that the block exists
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

      const size = TYPES.GetSizeInBytes(type, typeid) / FLOAT32_BYTE_SIZE;

      // Every uniform starts at the end of the prevoius unoform end
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



export function UBO_create(sid, program, progrm_ub_ixs) {

   const gl = gfxCtx.gl;

   let ub_idx = INT_NULL;

   // Create the shared block, if it is not yet created
   // if (!_uniform_blocks.boundary) {
   if (!CheckUniformBlockExists(sid)) {

      const ub = new UniformsBlock(gl, program, UNIFORM_BLOCK_SHARED_NAME, sid);
      ub_idx = _uniform_blocks.Add(ub);

   }
   
   if (sid & SID.UNIF.PROJECTION_MATRIX && UBS.PROJECTION_LOC === INT_NULL) {
      UBS.PROJECTION_LOC = _uniform_blocks.buffer[0].AddLayout(gl, TYPES.MAT4X4, TYPES.ID, 'UBS Projection');
   };
   if (sid & SID.UNIF.SCREEN_RESOLUTION && UBS.RESOLUTION_LOC === INT_NULL) {
      UBS.RESOLUTION_LOC = _uniform_blocks.buffer[0].AddLayout(gl, TYPES.VEC2, TYPES.ID, 'UBS screen Resolution');
   }

   console.log('---- Uniform Shared Block ----\n', _uniform_blocks)

   return ub_idx;

   // NOTE
   // Combine 2 Uniform Blocks in to one buffer
   // gl.bindBufferRange( BINDING_INDEX, glbuffer, offset, size, )
}




export function UBO_SetUniform(uniform_locidx, val) {
   _uniform_blocks.buffer[0].SetVal(uniform_locidx, val);
   _uniform_blocks.buffer[0].needsUpdate = true;
}



export function UBO_update() { // HOT-PATH

   if (!_uniform_blocks.buffer[0].needsUpdate) return; 


   const gl = gfxCtx.gl;

   gl.bindBufferBase(gl.UNIFORM_BUFFER, _uniform_blocks.buffer[0].binding_index, _uniform_blocks.buffer[0].glbuffer);
   
   const offset = 0; // The offset of the starting index from which to replace the data
   gl.bufferSubData(gl.UNIFORM_BUFFER, 0, _uniform_blocks.buffer[0].buffer, offset, 0);
   // gl.bufferData(gl.UNIFORM_BUFFER, Block, gl.DYNAMIC_DRAW);

   _uniform_blocks.buffer[0].needsUpdate = false;

}

