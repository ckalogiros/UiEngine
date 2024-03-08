"use strict";

import { Program_use_program } from "../ShaderPrograms";


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