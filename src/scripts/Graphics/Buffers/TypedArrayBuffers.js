"use strict";

/**
 * gl type: float=5126 // SEE GL_CONSTANTS_SAMPLE.js file
 * type byte size: float=4 
 * unique id: BIT MASK for switch and conditional statements
 */


export function Create_buffer_from_type(type, size){
   switch(type){

      case BUFFER_TYPE.FLOAT32:{ return Create_buffer_float32(size); }
      case BUFFER_TYPE.UINT16:{ return Create_buffer_uint16(size); }
   }
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
function Create_buffer_float32(size){ return new Float32Array(size); /** -3.4e38 to 3.4e38 */ }
function Create_buffer_float64(size){ return new Float64Array(size); /** -1.8e308 to 1.8e308 */ }

function Create_buffer_int8(size){ return new Int8Array(size);    /** -128 to 127 */ }
function Create_buffer_int16(size){ return new Int16Array(size);   /** -32768 to 32767 */ }
function Create_buffer_int32(size){ return new Int32Array(size);   /**  */ }
function Create_buffer_int64(size){ return new BigInt64Array(size); /** -263 to 263 - 1 */ }

function Create_buffer_uint8(size){ return new Uint8Array(size);   /** 0 to 255 */  } 
function Create_buffer_uint16(size){ return new Uint16Array(size);  /** 0 to 65535 */ }
function Create_buffer_uint32(size){ return new Uint32Array(size);  /** 0 to 4294967295 */ }
function Create_buffer_uint64(size){ return new BigUint64Array(size); /** 0 to 264 - 1 */ }