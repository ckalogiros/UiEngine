"use strict";

import { New_generic_buffer  } from "../Engine/Core/Buffers.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Engine/Core/StringBuffer.js";



const DISABLE_DEBUG = true;


const _shader_attribs_buffer = New_generic_buffer(_, '_shader_attribs_buffer');
export function Shader_attributes_reset() { 
   _shader_attribs_buffer.ResetFull(); }



export function Shader_attributes_get_attribs(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx];
}



export function Shader_attributes_get_attribs_per_vertex(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx].attribs_per_vertex;
}



export function Shader_attributes_get_attrib_offset_by_nameid(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return _shader_attribs_buffer.buffer[attribsidx].offsets[attrib_idx];
}



export function Shader_attributes_get_attribs_size(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return _shader_attribs_buffer.buffer[attribsidx].sizes[attrib_idx];
}



export function Shader_attributes_get_attribs_offset_size(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].offsets[attrib_idx],
      size: _shader_attribs_buffer.buffer[attribsidx].sizes[attrib_idx],
   };
}



export function Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].offsets[attrib_idx],
      attribs_per_vertex: _shader_attribs_buffer.buffer[attribsidx].attribs_per_vertex,
   };
}



export function Shader_attributes_get_attribs_attribs_per_vertex(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   return _shader_attribs_buffer.buffer[attribsidx].attribs_per_vertex;
}



export function Shader_attributes_get_attribs_offset_size_attribs_per_vertex(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].offsets[attrib_idx],
      size: _shader_attribs_buffer.buffer[attribsidx].sizes[attrib_idx],
      attribs_per_vertex: _shader_attribs_buffer.buffer[attribsidx].attribs_per_vertex,
   };
}



export function Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const shader_attribs = _shader_attribs_buffer.buffer[attribsidx];

   const len = shader_attribs.locs.length;
   for (let i = 0; i < len; i++) {

      if (shader_attribs.nameids[i] === nameid)
         return i;
   }

   console.error('Attribute with name id:', nameid, ' from ids:', SHADER_ATTRIBUTES, ' was not found in program attris:', shader_attribs)
   alert('NO ATTRIBUTE FOUND\n SEE CONSOLE ERROR')
}


function Calc_size_in_bytes_from_attribs_type(type) { // TODO: This should go GLOBAL???

   switch (type) {

      case GL_TYPES.FLOAT_32_UNSIGNED_INT_24_8_REV: return 1; // 36269:
      case GL_TYPES.FLOAT_VEC2: return 2; // 35664:
      case GL_TYPES.FLOAT_VEC3: return 3; // 35665:
      case GL_TYPES.FLOAT_VEC4: return 4; // 35666:
      case GL_TYPES.FLOAT_MAT2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35674:
      case GL_TYPES.FLOAT_MAT2x3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35685:
      case GL_TYPES.FLOAT_MAT2x4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35686:
      case GL_TYPES.FLOAT_MAT3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35675:
      case GL_TYPES.FLOAT_MAT3x2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35687:
      case GL_TYPES.FLOAT_MAT3x4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35688:
      case GL_TYPES.FLOAT_MAT4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35676:
      case GL_TYPES.FLOAT_MAT4x2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35689:
      case GL_TYPES.FLOAT_MAT4x3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35690:
   }
}



export function Shader_attributes_create(sid, shader_program) {


   const shader_attribs = {
      locs: [],
      sizes: [],
      offsets: [],
      types: [],
      attribs_per_vertex: 0,
      nameids: [],
      /**DEBUG*/names: [],
   };


   
   const ACTIVE_ATTRIBUTES_COUNT = gfxCtx.gl.getProgramParameter(shader_program, gfxCtx.gl.ACTIVE_ATTRIBUTES); // Get the active attributes count for a shader.

   for (let i = 0; i < ACTIVE_ATTRIBUTES_COUNT; i++) {

      // console.log('ACTIVE_ATTRIBUTES_COUNT', ACTIVE_ATTRIBUTES_COUNT)

      const attrib_info = gfxCtx.gl.getActiveAttrib(shader_program, i);
      if (!attrib_info) break;


      const loc = gfxCtx.gl.getAttribLocation(shader_program, attrib_info.name);

      shader_attribs.names[loc] = Str_buffer_store(attrib_info.name);
      shader_attribs.types[loc] = attrib_info.type; // SEE: GL_TYPES

      console.log('gl.getActiveAttrib:attrib_info', attrib_info)
      /** DO NOT DELETE */ // const attr_size = a.size; // This probably computes the size of array attributes, because for vec4 and vec2 the size is 1.

      shader_attribs.locs[loc] = loc; // Seems redundant because the index and its value are the same, but that does not happen with sizes and offsets.
      shader_attribs.sizes[loc] = Calc_size_in_bytes_from_attribs_type(shader_attribs.types[loc]); // TODO: May extend for .COL3 or any other case

      if (attrib_info.name === 'a_col') shader_attribs.nameids[loc] = SHADER_ATTRIBUTES.COL4;
      else if (attrib_info.name === 'a_wpos_time') shader_attribs.nameids[loc] = SHADER_ATTRIBUTES.WPOS_TIME4;
      else if (attrib_info.name === 'a_pos') shader_attribs.nameids[loc] = SHADER_ATTRIBUTES.POS2;
      else if (attrib_info.name === 'a_dim') shader_attribs.nameids[loc] = SHADER_ATTRIBUTES.DIM2;
      else if (attrib_info.name === 'a_generic1') shader_attribs.nameids[loc] = SHADER_ATTRIBUTES.GENERIC_ATTR1_VEC4;
      else if (attrib_info.name === 'a_tex') shader_attribs.nameids[loc] = SHADER_ATTRIBUTES.TEX2;

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
      nameids: new Uint16Array(attributes_count), // Needs to be Uint16 because its a bitfield
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

      /**DEBUG */ // IMPORTANT: Use the right Uint array size type for the attributes info. Checking is we overflow any type
      if (shader_attribs.locs[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -locs- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.sizes[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -sizes- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.offsets[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -offsets- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.types[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -types- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.nameids[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -nameids- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.names[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -names- @ShaderAttributes.js, Shader_attributes_create().')
   }


   const idx = _shader_attribs_buffer.Add(shader_attribs_typed_arrays);

   console.log('--- Shader Attributes ---', _shader_attribs_buffer.buffer[idx])
   // Shader_attributes_print();

   return idx;

}




export function Shader_attributes_enable(attribsidx, vb_attribs) {

   const gl_type = gfxCtx.gl.FLOAT; // TODO: store the gl.type inside the shaderinfo???

   const len = vb_attribs.locs.length;
   for (let i = 0; i < len; i++) {

      /** The attrib divisor is denotes the frequency at wich the different meshes will be drawn out of the vertex buffer.
       * For example: An intanced vb has 4 wpos. If we set divisor to 1, then each instanced geometry will use 1 wpos.
       * If the divisor is set to 2, then 2 instanced geometries will use 1 wpos.
       * So if we draw 8 instances of a mesh and we need lets sy 4 wpos, 
       * then we set the divisor to 2, so that 2 meshes will consume 1 wpo => 8/4=2(divisor)
       */

      gfxCtx.gl.enableVertexAttribArray(vb_attribs.locs[i]);
      gfxCtx.gl.vertexAttribPointer(vb_attribs.locs[i], vb_attribs.sizes[i], gl_type, false, vb_attribs.count * FLOAT32_BYTE_SIZE, vb_attribs.offsets[i] * FLOAT32_BYTE_SIZE);
      gfxCtx.gl.vertexAttribDivisor(vb_attribs.locs[i], vb_attribs.attrib_divisor);
      // if(i===0) 
      //    gfxCtx.gl.vertexAttribDivisor(vb_attribs.locs[i], 1);
      // else gfxCtx.gl.vertexAttribDivisor(vb_attribs.locs[i], 0);

   }
}





/** Calculate the attributes info for a vb that consumes some of the total Program's attributes */
export function Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid, attrib_divisor) {

   // Get the Programs already created attributes info
   const shader_attribs = Shader_attributes_get_attribs(attribsidx);

   const attribs_info = {
      attrib_divisor: attrib_divisor,
      count: 0,
      locs: [],
      offsets: [],
      sizes: [],
      nameids: [],
      // types: [],
   }

   let offset = 0;

   // Select and build the info from the attributes that the vertex buffer has
   const len = shader_attribs.nameids.length;
   for (let i=0; i<len; i++){

      if(sid & shader_attribs.nameids[i]){

         attribs_info.count += shader_attribs.sizes[i];

         attribs_info.locs.push(shader_attribs.locs[i]);
         attribs_info.sizes.push(shader_attribs.sizes[i]);
         // attribs_info.types.push(shader_attribs.types[i]);
         attribs_info.offsets.push(offset);
         offset += shader_attribs.sizes[i]
      }

   }

   return attribs_info;

}









/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/


function DEBUG_PRINT(buffer, index, line) {
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
   for (let i = 0; i <= _shader_attribs_buffer.boundary; i++) {

      const attribs = _shader_attribs_buffer.buffer[i];
      for (let k = 0; k < attribs.names.length; k++) {

         console.log('loc', attribs.locs[k], 'size', attribs.sizes[k], 'offsets', attribs.offsets[k], Str_buffer_get_by_idx(attribs.names[k]),)
      }
   }
}