"use strict";

import { New_generic_buffer  } from "../Engine/Core/Buffers.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Engine/Core/StringBuffer.js";
import { _, DEBUG, INT_NULL } from "../Engine/Global/EngineConstants.js";
import { SID } from "./Global/GfxConstants.js";
import { Shader_Attributes } from "./ShaderBitFlags.js";



const DISABLE_DEBUG = true;
const DEBUG_INFO = false;







const _shader_attribs_buffer = New_generic_buffer(_, '_shader_attribs_buffer');
export function Shader_attributes_reset() { _shader_attribs_buffer.ResetFull(); }



export function Shader_attributes_get_attribs(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs;
}



export function Shader_attributes_get_attribs_per_vertex(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex;
}



export function Shader_attributes_get_attrib_offset_by_nameid(attribsidx, attrib_flag) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, attrib_flag);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx];
}



export function Shader_attributes_get_attribs_size(attribsidx, attrib_flag) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, attrib_flag);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.sizes[attrib_idx];
}



export function Shader_attributes_get_attribs_offset_size(attribsidx, attrib_flag) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, attrib_flag);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx],
      size: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.sizes[attrib_idx],
   };
}



export function Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, attrib_flag) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, attrib_flag);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx],
      attribs_per_vertex: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex,
   };
}



export function Shader_attributes_get_attribs_attribs_per_vertex(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex;
}



export function Shader_attributes_get_attribs_offset_size_attribs_per_vertex(attribsidx, attrib_flag) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, attrib_flag);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx],
      size: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.sizes[attrib_idx],
      attribs_per_vertex: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex,
   };
}



export function Shader_attributes_get_attrib_idx_by_nameid(attribsidx, attrib_flag) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attribs = _shader_attribs_buffer.buffer[attribsidx].mesh_attribs;

   const len = attribs.locs.length;
   for (let i = 0; i < len; i++) {

      if (attribs.attribute_flag[i] === attrib_flag)
         return i;
   }

   console.error('Attribute with name id:', attrib_flag, ' from ids:', SID.ATTR, ' was not found in program attris:', attribs)
   alert('NO ATTRIBUTE FOUND\n SEE CONSOLE ERROR')
}



export function Shader_attributes_create(attribs_info) {


   const shader_attribs = {
      locs: [],
      sizes: [],
      offsets: [],
      types: [],
      attribs_per_vertex: 0,
      attribute_flag: [],
      /**DEBUG*/names: [],
   };

   const mesh_attribs = attribs_info.mesh_attribs;
   
   
   /*************************************************************************************/
   // Convert to Typed Arrays
   const len = mesh_attribs.length;
   const shader_attribs_typed_arrays = {
      locs: new Uint8Array(len),
      sizes: new Uint8Array(len),
      offsets: new Uint8Array(len),
      types: new Uint16Array(len),
      attribute_flag: new Uint16Array(len), // Needs to be Uint16 because its a bitfield
      names: new Uint16Array(len),
      attribs_per_vertex: 0,
   }

   for (let i = 0; i < len; i++) {

      shader_attribs_typed_arrays.locs[i]    = mesh_attribs[i].loc;
      shader_attribs_typed_arrays.sizes[i]   = mesh_attribs[i].size;
      shader_attribs_typed_arrays.offsets[i] = mesh_attribs[i].offset;
      shader_attribs_typed_arrays.types[i]   = mesh_attribs[i].type;
      shader_attribs_typed_arrays.attribute_flag[i] = mesh_attribs[i].attrib_flag;
      shader_attribs_typed_arrays.names[i]   = Str_buffer_store(mesh_attribs[i].name); /** For debug only */

      shader_attribs_typed_arrays.attribs_per_vertex += mesh_attribs[i].size;

      /**DEBUG */ // IMPORTANT: Use the right Uint array size type for the attributes info. Checking is for any overflows of any type
      if (shader_attribs.locs[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -locs- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.sizes[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -sizes- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.offsets[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -offsets- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.types[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -types- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.attribute_flag[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -attribute_flag- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.names[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -names- @ShaderAttributes.js, Shader_attributes_create().')
   }


   const idx = _shader_attribs_buffer.Add({
      mesh_attribs:shader_attribs_typed_arrays,
      attribs_loc:attribs_info.attribs_loc,
   });

   if(DEBUG.SHADERS) console.log('--- Shader Attributes ---', _shader_attribs_buffer.buffer[idx])

   return idx;

}



/** Calculate the attributes info for a vb that consumes some of the total Program's attributes */
export function Vertex_buffer_create_attribs_info_per_vb_instanced(attribsidx, sid, attrib_divisor, progidx) {

   // Get the Programs already created attributes info
   const shader_attribs = Shader_attributes_get_attribs(attribsidx);

   const attribs_info = {
      attrib_divisor: attrib_divisor,
      count: 0,
      locs: [],
      offsets: [],
      sizes: [],
      attribute_flag: [],
   }

   const vb_attribs_indexing = new Shader_Attributes(true, INT_NULL);
   
   let offset = 0;
   
   // Select and build the info from the attributes that the vertex buffer has
   let loc_idx_counter = 0;
   const len = shader_attribs.attribute_flag.length;
   for (let i=0; i<len; i++){

      if(sid & shader_attribs.attribute_flag[i])
      {

         attribs_info.count += shader_attribs.sizes[i];

         attribs_info.locs.push(shader_attribs.locs[i]);
         attribs_info.sizes.push(shader_attribs.sizes[i]);
         attribs_info.offsets.push(offset);
         offset += shader_attribs.sizes[i];

         vb_attribs_indexing.SetAttributeLocIdx(shader_attribs.attribute_flag[i], loc_idx_counter++)
      }


   }


   return {
      attribs_info:attribs_info, 
      attribs_indexing:vb_attribs_indexing
   };

}



/**WITH PARAM attribs_info from create vertex buffer*/
export function Shader_attributes_enable(attribsidx, attribs_divisor, attribs_info, vbidx) {

   if(DEBUG_INFO) console.log('-------------------------------------------------------------------------')
      if(DEBUG_INFO) console.log('VERTEX ATTRIBUTES ENABLE')
   
   const gl_type = gfxCtx.gl.FLOAT; // TODO: store the gl.type inside the shaderinfo???

   const vb_attribs = _shader_attribs_buffer.buffer[attribsidx].attribs_loc;
   
   const stride = attribs_info.count;
   
   const start_loc = attribs_info.locs[0];
   const stop_loc = attribs_info.locs[attribs_info.locs.length-1]+1;
      
   // for (let i = 0; i < len2; i++) {
   for (let i = start_loc; i < stop_loc; i++) {

      /** The attrib divisor denotes the frequency at which the different meshes will be drawn out of the vertex buffer.
       * For example: An intanced vb has 4 wpos. If we set divisor to 1, then each instanced geometry will use 1 wpos.
       * If the divisor is set to 2, then 2 instanced geometries will use 1 wpos.
       * So if we draw 8 instances of a mesh and we need lets say 4 wpos, 
       * then we set the divisor to 2, so that 2 meshes will consume 1 wpos => 8/4=2(divisor)
       */

      const location = vb_attribs[i].locs;
      const size = vb_attribs[i].sizes;
      const offset = vb_attribs[i].offsets;

      gfxCtx.gl.enableVertexAttribArray(location);
      gfxCtx.gl.vertexAttribPointer(location, size, gl_type, false, stride * FLOAT32_BYTE_SIZE, offset * FLOAT32_BYTE_SIZE);
      gfxCtx.gl.vertexAttribDivisor(location, attribs_divisor);

      if(DEBUG_INFO) console.log(
         'loc', location,
         'size', size,
         'offset', offset,
         'stride', stride,
         'divisor', attribs_divisor,
         'vbidx', vbidx,
      );

   }

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
      
      console.log(`-- Program ${i}--`);

      // Mesh Attributes
      console.log(`-Mesh Attributes-`);
      const mesh_attribs = _shader_attribs_buffer.buffer[i].mesh_attribs;
      console.log('Attributes per vertex:', mesh_attribs.attribs_per_vertex);
      for (let k = 0; k < mesh_attribs.names.length; k++) {
         
         console.log('loc', mesh_attribs.locs[k], 'size', mesh_attribs.sizes[k], 'offsets', mesh_attribs.offsets[k], Str_buffer_get_by_idx(mesh_attribs.names[k]),)
      }

      // Attributes Locations
      console.log(`-Attributes Locations-`);
      const attribs_loc = _shader_attribs_buffer.buffer[i].attribs_loc;
      for (let k = 0; k < attribs_loc.length; k++) {
         
         console.log('loc', attribs_loc[k].locs, 'size', attribs_loc[k].sizes, 'offsets', attribs_loc[k].offsets,)
      }
   
   }
}