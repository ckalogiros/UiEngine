"use strict";

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



export class BufferLayout {

   constructor() {

      this.buffer = null;
      this.layout = {
         locs: [],
         sizes: [],
         names: [],
      }
   }

   AddLayout(type, typeid, name) {

      const size = TYPES.GetSizeInBytes(type, typeid) / FLOAT32_BYTE_SIZE;

      // Initialize
      if (!this.buffer) {
         this.buffer = new Float32Array(size);
      }

      this.layout.sizes.push(size);
      this.layout.names.push(name);

      const len = this.layout.locs.length;
      if (len === 0) {
         const locidx = this.layout.locs.push(0) - 1;
         return locidx;
      }
      else {
         const start = this.layout.locs[len];
         const locidx = this.layout.locs.push(start) - 1;
         return locidx;
      }

   }


   SetVal(locidx, val) {

      // IMPORTANT: We must check if val is array 

      const start = this.layout.locs[locidx];
      const size = this.layout.sizes[locidx];

      const len = val.length;
      if (len !== size) { console.error('Size mismatch'); alert('SEE console error. Size mismatch'); }

      let cnt = start;
      for (let i = 0; i < len; i++) {
         this.buffer[cnt++] = val[i];
      }
   }

}




const _uniform_shared_block = {
   block: null,
   gl_layout: null,
   needsUpdate: false,
};

export function UBO_SetUniform(uniform_locidx, val) {
   _uniform_shared_block.block.SetVal(uniform_locidx, val);
   _uniform_shared_block.needsUpdate = true;
}



let ubs_counter = 0;


export class UniformsSharedBlock {

   constructor(gl, program, uniform_block_name, progidx) {

      this.binding_index = ubs_counter++;
      this.name = uniform_block_name;
      this.progidx = progidx;

      this.loc = gl.getUniformBlockIndex(program, uniform_block_name);
      gl.uniformBlockBinding(program, this.loc, this.binding_index);

      this.glbuffer = gl.createBuffer();
      gl.bindBufferBase(gl.UNIFORM_BUFFER, this.binding_index, this.glbuffer);

   }

}



export function UBO_create(program, sid, progidx) {

   const gl = gfxCtx.gl;

   
   // Create the shared block buffer if it is not yet created
   if (!_uniform_shared_block.block) {
      
      _uniform_shared_block.gl_layout = new UniformsSharedBlock(gl, program, UNIFORM_BLOCK_SHARED_NAME, progidx);
      const shared_buffer = new BufferLayout(FLOAT32_BYTE_SIZE)
      _uniform_shared_block.block = shared_buffer;
   }

   if (sid & SID.UNIF.PROJECTION_MATRIX) {
      UBS.PROJECTION_LOC = _uniform_shared_block.block.AddLayout(TYPES.MAT4X4, TYPES.ID, 'UBS Projection');
   };
   if (sid & SID.UNIF.SCREEN_RESOLUTION) {
      UBS.RESOLUTION_LOC = _uniform_shared_block.block.AddLayout(TYPES.VEC2, TYPES.ID, 'UBS screen Resolution');
   }

   // 
   gl.bindBufferBase(gl.UNIFORM_BUFFER, _uniform_shared_block.gl_layout.binding_index, _uniform_shared_block.gl_layout.glbuffer);
   gl.bufferData(gl.UNIFORM_BUFFER, _uniform_shared_block.block.buffer, gl.DYNAMIC_DRAW);

   console.log('---- Uniform Shared Block', _uniform_shared_block)
}




export function UBO_update() { // HOT-PATH

   if (!_uniform_shared_block.needsUpdate) {
      return;
   }


   const gl = gfxCtx.gl;

   gl.bindBufferBase(gl.UNIFORM_BUFFER, _uniform_shared_block.gl_layout.binding_index, _uniform_shared_block.gl_layout.glbuffer);
   // // gl.bufferData(gl.UNIFORM_BUFFER, Block, gl.DYNAMIC_DRAW);

   // // bufferSubData(target, dstByteOffset, srcData, srcOffset, length)
   gl.bufferSubData(gl.UNIFORM_BUFFER, 0, _uniform_shared_block.block.buffer, 0, 0);

   _uniform_shared_block.needsUpdate = false;

}



// export function UBO_change_val(){

//    const col = GetRandomColor();
//    Block[0] = col[0];
//    Block[1] = col[1];
//    Block[2] = col[2];
//    Block[3] = col[3];
//    const col2 = GetRandomColor();
//    Block[4] = col2[0];
//    Block[5] = col2[1];
//    Block[6] = col2[2];
//    Block[7] = col2[3];
// }


/** SAVE initial UB Block Test */
// export const UNIFORM_BLOCK_BINDING_POINT = 0;
// // export const Block = new Float32Array(RED);
// export const Block = new Float32Array([
//    1.0, 0.0, 0.0, 1.0,
//    1.0, 0.0, 1.0, 1.0,
// ]);

// const buffers = []

// export function UBO_create(program){

//    const gl = gfxCtx.gl;

//    const loc = gl.getUniformBlockIndex(program, 'Block');

//    gl.uniformBlockBinding(program, loc, UNIFORM_BLOCK_BINDING_POINT);

//    const buffer = gl.createBuffer();
//    buffers[0] = buffer;

//    gl.bindBufferBase(gl.UNIFORM_BUFFER, UNIFORM_BLOCK_BINDING_POINT, buffer);

//    gl.bufferData(gl.UNIFORM_BUFFER, Block, gl.DYNAMIC_DRAW);

// }

// export function UBO_change_val(){

//    const col = GetRandomColor();
//    Block[0] = col[0];
//    Block[1] = col[1];
//    Block[2] = col[2];
//    Block[3] = col[3];
//    const col2 = GetRandomColor();
//    Block[4] = col2[0];
//    Block[5] = col2[1];
//    Block[6] = col2[2];
//    Block[7] = col2[3];
// }

// let srcOffset = 0;
// const stride = 4;

// export function UBO_update(){

//    const gl = gfxCtx.gl;

//    gl.bindBufferBase(gl.UNIFORM_BUFFER, UNIFORM_BLOCK_BINDING_POINT, buffers[0]);
//    // gl.bufferData(gl.UNIFORM_BUFFER, Block, gl.DYNAMIC_DRAW);

//    // bufferSubData(target, dstByteOffset, srcData, srcOffset, length)
//    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, Block, 4, 0);

// }