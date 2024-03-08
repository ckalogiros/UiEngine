"use strict";

import { M_Buffer } from "../Engine/Core/Buffers";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Engine/Core/StringBuffer";



const DISABLE_DEBUG = true;


const _shader_attribs_buffer = new M_Buffer();



export function Shader_attributes_get_attribs(attribsidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx];
}



export function Shader_attributes_get_attribs_per_vertex(attribsidx) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx].attribs_per_vertex;
}



export function Shader_attributes_get_attrib_offset_by_nameid(attribsidx, nameid) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_by_nameid(attribsidx, nameid);
   return _shader_attribs_buffer.buffer[attribsidx].offsets[attrib_idx];
}



export function Shader_attributes_get_attribs_offset_size(attribsidx, nameid) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_by_nameid(attribsidx, nameid);
   const ret = {
      offset:_shader_attribs_buffer.buffer[attribsidx].offsets[attrib_idx],
      size:_shader_attribs_buffer.buffer[attribsidx].sizes[attrib_idx],
   };
   return ret;
}



export function Shader_attributes_get_attrib_by_nameid(attribsidx, nameid) {
   if(!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   
   const shader_attribs = _shader_attribs_buffer.buffer[attribsidx];

   const len = shader_attribs.locs.length;
   for (let i = 0; i < len; i++) {

      if(shader_attribs.nameids[i] === nameid)
         return i;
   }

   console.error('Attribute with name id:', nameid, ' from ids:', SHADER_ATTRIBUTES, ' was not found in program attris:', shader_attribs)
   alert('NO ATTRIBUTE FOUND\n SEE CONSOLE ERROR')
}


function Calc_size_in_bytes_from_attribs_type(type) { // TODO: This should go GLOBAL???

   switch (type) {

      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV: return 1; // 36269:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_VEC2: return 2; // 35664:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_VEC3: return 3; // 35665:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_VEC4: return 4; // 35666:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35674:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT2x3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35685:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT2x4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35686:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35675:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT3x2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35687:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT3x4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35688:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35676:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT4x2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35689:
      case SHADER_PROGAM_ATTRIBS_TYPE.FLOAT_MAT4x3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35690:
   }
}



export function Shader_attributes_create(sid, shader_program) {


   const shader_attribs = {
      locs: [],
      sizes: [],
      offsets: [],
      types: [],
      attribs_per_vertex: 0,
      nameids:[], 
      /**DEBUG*/names: [],
   };

   /*************************************************************************************/
   //
   // TODO: Maybe store it in canvas initialization 
   // const MAX_VERTEX_ATTRIBS = gfxCtx.gl.getParameter(gfxCtx.gl.MAX_VERTEX_ATTRIBS); // Get the max available attributes for a shader.
   const ACTIVE_ATTRIBUTES_COUNT = gfxCtx.gl.getProgramParameter(shader_program, gfxCtx.gl.ACTIVE_ATTRIBUTES ); // Get the active attributes count for a shader.
   
   for (let i = 0; i < ACTIVE_ATTRIBUTES_COUNT; i++) {
   
      console.log('ACTIVE_ATTRIBUTES_COUNT', ACTIVE_ATTRIBUTES_COUNT)
   
      const attrib_info = gfxCtx.gl.getActiveAttrib(shader_program, i);
      if (!attrib_info) break;
      shader_attribs.names[i] = Str_buffer_store(attrib_info.name);
      shader_attribs.types[i] = attrib_info.type; // SEE: SHADER_PROGAM_ATTRIBS_TYPE
      /** DO NOT DELETE */ // const attr_size = a.size; // This probably computes the size of array attributes, because for vec4 and vec2 the size is 1.

      shader_attribs.locs[i] = i; // Seems redundant because the index and its value are the same, but that does not happen with sizes and offsets.
      shader_attribs.sizes[i] = Calc_size_in_bytes_from_attribs_type(shader_attribs.types[i]); // TODO: May extend for .COL3 or any other case

      if(attrib_info.name === 'a_col') shader_attribs.nameids[i] = SHADER_ATTRIBUTES.COL4;
      else if(attrib_info.name === 'a_wpos_time') shader_attribs.nameids[i] = SHADER_ATTRIBUTES.WPOS4;
      else if(attrib_info.name === 'a_pos') shader_attribs.nameids[i] = SHADER_ATTRIBUTES.POS2;
      else if(attrib_info.name === 'a_params1') shader_attribs.nameids[i] = SHADER_ATTRIBUTES.PARAMS1;
      else if(attrib_info.name === 'a_tex') shader_attribs.nameids[i] = SHADER_ATTRIBUTES.TEX2;

   }



   /*************************************************************************************/
   // Calculate offsets
   let size = 0;
   let attributes_count = 0;
   const len = shader_attribs.locs.length;
   for (let i = 0; i < len; i++) {

      shader_attribs.offsets[i] = size;
      size += shader_attribs.sizes[i]; // Accumulate the size of each attribute for the next attribute's offset.

      attributes_count++;
   }


   /*************************************************************************************/
   // Convert to Typed Arrays
   const shader_attribs_typed_arrays = {
      locs: new Uint8Array(attributes_count),
      sizes: new Uint8Array(attributes_count),
      offsets: new Uint8Array(attributes_count),
      types: new Uint16Array(attributes_count),
      nameids: new Uint8Array(attributes_count),
      names: new Uint16Array(attributes_count),
      attribs_per_vertex: size,
   }

   for (let i = 0; i < attributes_count; i++) {

      shader_attribs_typed_arrays.locs[i] = shader_attribs.locs[i];
      shader_attribs_typed_arrays.sizes[i] = shader_attribs.sizes[i];
      shader_attribs_typed_arrays.offsets[i] = shader_attribs.offsets[i];
      shader_attribs_typed_arrays.names[i] = shader_attribs.names[i];
      shader_attribs_typed_arrays.types[i] = shader_attribs.types[i];
      shader_attribs_typed_arrays.nameids[i] = shader_attribs.nameids[i];

      /**DEBUG */ // IMPORTANT: If for some reason the typed arrays that we are checking below is changed, the we must compare to the new MAX_... max value
      if (shader_attribs.locs[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -locs- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.sizes[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -sizes- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.offsets[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -offsets- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.types[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -types- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.nameids[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -nameids- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.names[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -names- @ShaderAttributes.js, Shader_attributes_create().')
   }


   const idx = _shader_attribs_buffer.Add(shader_attribs_typed_arrays);

   console.log('Shader Attributes', _shader_attribs_buffer.buffer[idx])
   Shader_attributes_print();

   return idx;

}



export function Shader_attributes_enable(attribsidx){

   const buffer_type = FLOAT; // TODO: Who handles and owns the buffer type???
   const gl_type = gfxCtx.gl.FLOAT; // TODO: store the gl.type inside the shaderinfo???

   const shader_attribs = _shader_attribs_buffer.buffer[attribsidx];

   const len = shader_attribs.locs.length;
   for (let i = 0; i < len; i++) {
      gfxCtx.gl.vertexAttribPointer(shader_attribs.locs[i], shader_attribs.sizes[i], gl_type, false, shader_attribs.attribs_per_vertex * FLOAT, shader_attribs.offsets[i] * FLOAT);
      
      gfxCtx.gl.enableVertexAttribArray(shader_attribs.locs[i]);
   }
}










/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/


function DEBUG_PRINT (buffer, index, line) {
   if (index < 0 || index > buffer.boundary) {
      console.error('Index is out of bounds. @GlShaderAttributes.js.\nLine:', line, 'index:', index, buffer);
      alert('Index is out of bounds. @GlShaderAttributes.js');
   }
   if (buffer.buffer[index] === null) {
      console.error('Buffer at index is NULL. @GlShaderAttributes.js\nLine:', line, 'index:', index, buffer);
      alert('Buffer at index is NULL. @GlShaderAttributes.js.');
   }
}

export function Shader_attributes_print() {

   console.log('\n---------- Shader Attributes ----------');
   for (let i = 0; i < _shader_attribs_buffer.boundary; i++) {

      const attribs = _shader_attribs_buffer.buffer[i];
      for (let k = 0; k < attribs.names.length; k++) {

         console.log('loc', attribs.locs[k], 'size', attribs.sizes[k], 'offsets', attribs.offsets[k], Str_buffer_get_by_idx(attribs.names[k]), )
      }
   }
   console.log();
}