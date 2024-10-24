"use strict";

import { New_generic_buffer  } from "../Engine/Core/Buffers.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Engine/Core/StringBuffer.js";
import { Program_get_shader_attribs_indexing, Program_get_shader_attributes_index } from "./ShaderPrograms.js";



const DISABLE_DEBUG = true;




export class Attributes_indexing { // Attributes indexing based on attribute type (color, position, etc)

   constructor() {

      this.COL4 = INT_NULL;
      this.WPOS3 = INT_NULL;
      this.VPOS2 = INT_NULL;
      this.DIM2 = INT_NULL;
      this.BORDER = INT_NULL;
      this.R_CORNERS = INT_NULL;
      this.FEATHER = INT_NULL;
      this.SCALE2 = INT_NULL;
      this.TEX2 = INT_NULL;
      this.TIME = INT_NULL;
      this.SDF = INT_NULL;
      this.MSDF = INT_NULL;
      this.GLOW_INTENSITY = INT_NULL;
      this.COL4_PER_VERTEX = INT_NULL;
   }

   FindByNameAndStoreIndex(attrib_nameid, attributes_index){

      if (attrib_nameid & SID.ATTR.COL4) {
         this.COL4 = attributes_index.COL4;
      }
      
      else if (attrib_nameid & SID.ATTR.WPOS3) {
         this.WPOS3 = attributes_index.WPOS3;
      }
      
      else if (attrib_nameid & SID.ATTR.TIME) {
         this.TIME = attributes_index.TIME;
      }
      
      else if (attrib_nameid & SID.ATTR.VPOS2) {
         this.VPOS2 = attributes_index.VPOS2;
      }
      
      else if (attrib_nameid & SID.ATTR.DIM2) {
         this.DIM2 = attributes_index.DIM2;
      }
      
      else if (attrib_nameid & SID.ATTR.R_CORNERS) {
         this.R_CORNERS = attributes_index.R_CORNERS;
      }
      
      else if (attrib_nameid & SID.ATTR.BORDER) {
         this.BORDER = attributes_index.BORDER;
      }
      
      else if (attrib_nameid & SID.ATTR.FEATHER) {
         this.FEATHER = attributes_index.FEATHER;
      }
      
      else if (attrib_nameid & SID.ATTR.TEX2) {
         this.TEX2 = attributes_index.TEX2;
      }
      
      else if (attrib_nameid & SID.ATTR.GLOW_INTENSITY) {
         this.GLOW_INTENSITY = attributes_index.GLOW_INTENSITY;
      }
      
      else if (attrib_nameid & SID.ATTR.SDF) {
         this.SDF = attributes_index.SDF;
      }
      
      else if (attrib_nameid & SID.ATTR.MSDF) {
         this.MSDF = attributes_index.MSDF;
      }
   }
}






const _shader_attribs_buffer = New_generic_buffer(_, '_shader_attribs_buffer');
export function Shader_attributes_reset() { 
   _shader_attribs_buffer.ResetFull(); }



export function Shader_attributes_get_attribs(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs;
}



export function Shader_attributes_get_attribs_per_vertex(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex;
}



export function Shader_attributes_get_attrib_offset_by_nameid(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx];
}



export function Shader_attributes_get_attribs_size(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.sizes[attrib_idx];
}



// export function Shader_attributes_get_attribs_offset_size(attribsidx, nameid) {
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

//    const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
//    return {
//       offset: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx],
//       size: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.sizes[attrib_idx],
//    };
// }



export function Shader_attributes_get_attribs_offset_size(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx],
      size: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.sizes[attrib_idx],
   };
}



export function Shader_attributes_get_attribs_offset_attribs_per_vertex(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx],
      attribs_per_vertex: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex,
   };
}



export function Shader_attributes_get_attribs_attribs_per_vertex(attribsidx) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   return _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex;
}



export function Shader_attributes_get_attribs_offset_size_attribs_per_vertex(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attrib_idx = Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid);
   return {
      offset: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.offsets[attrib_idx],
      size: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.sizes[attrib_idx],
      attribs_per_vertex: _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex,
   };
}



export function Shader_attributes_get_attrib_idx_by_nameid(attribsidx, nameid) {
   if (!DISABLE_DEBUG) DEBUG_PRINT(_shader_attribs_buffer, attribsidx, new Error().lineNumber);

   const attribs = _shader_attribs_buffer.buffer[attribsidx].mesh_attribs;

   const len = attribs.locs.length;
   for (let i = 0; i < len; i++) {

      if (attribs.nameids[i] === nameid)
         return i;
   }

   console.error('Attribute with name id:', nameid, ' from ids:', SHADER_ATTRIBUTES, ' was not found in program attris:', attribs)
   alert('NO ATTRIBUTE FOUND\n SEE CONSOLE ERROR')
}


// function Calc_size_in_bytes_from_attribs_type(type) { // TODO: This should go GLOBAL???

//    switch (type) {

//       case GL_TYPES.FLOAT_32_UNSIGNED_INT_24_8_REV: return 1; // 36269:
//       case GL_TYPES.FLOAT_VEC2: return 2; // 35664:
//       case GL_TYPES.FLOAT_VEC3: return 3; // 35665:
//       case GL_TYPES.FLOAT_VEC4: return 4; // 35666:
//       case GL_TYPES.FLOAT_MAT2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35674:
//       case GL_TYPES.FLOAT_MAT2x3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35685:
//       case GL_TYPES.FLOAT_MAT2x4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35686:
//       case GL_TYPES.FLOAT_MAT3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35675:
//       case GL_TYPES.FLOAT_MAT3x2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35687:
//       case GL_TYPES.FLOAT_MAT3x4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35688:
//       case GL_TYPES.FLOAT_MAT4: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35676:
//       case GL_TYPES.FLOAT_MAT4x2: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35689:
//       case GL_TYPES.FLOAT_MAT4x3: alert(' @ShaderAttributes.js, Calc_size_in_bytes'); // 35690:
//    }
// }





export function Shader_attributes_create(attribs_info) {


   const shader_attribs = {
      locs: [],
      sizes: [],
      offsets: [],
      types: [],
      attribs_per_vertex: 0,
      nameids: [],
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
      nameids: new Uint16Array(len), // Needs to be Uint16 because its a bitfield
      names: new Uint16Array(len),
      attribs_per_vertex: 0,
   }

   for (let i = 0; i < len; i++) {

      shader_attribs_typed_arrays.locs[i]    = mesh_attribs[i].loc;
      shader_attribs_typed_arrays.sizes[i]   = mesh_attribs[i].size;
      shader_attribs_typed_arrays.offsets[i] = mesh_attribs[i].offset;
      shader_attribs_typed_arrays.types[i]   = mesh_attribs[i].type;
      shader_attribs_typed_arrays.nameids[i] = mesh_attribs[i].nameid;
      shader_attribs_typed_arrays.names[i]   = Str_buffer_store(mesh_attribs[i].name); /** For debug only */

      shader_attribs_typed_arrays.attribs_per_vertex += mesh_attribs[i].size;

      /**DEBUG */ // IMPORTANT: Use the right Uint array size type for the attributes info. Checking is we overflow any type
      if (shader_attribs.locs[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -locs- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.sizes[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -sizes- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.offsets[i] > MAX_UINT8) alert('Not enough bit depth of array to store a large int value. -offsets- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.types[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -types- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.nameids[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -nameids- @ShaderAttributes.js, Shader_attributes_create().')
      if (shader_attribs.names[i] > MAX_UINT16) alert('Not enough bit depth of array to store a large int value. -names- @ShaderAttributes.js, Shader_attributes_create().')
   }


   const idx = _shader_attribs_buffer.Add({
      mesh_attribs:shader_attribs_typed_arrays,
      attribs_loc:attribs_info.attribs_loc,
   });

   console.log('--- Shader Attributes ---', _shader_attribs_buffer.buffer[idx])

   return idx;

}




/**WITH PARAM attribs_info from create vertex buffer*/
// export function Shader_attributes_enable(attribsidx, attribs_divisor, attribs_info, vbidx) {

//    console.log('-------------------------------------------------------------------------')
//    console.log('VERTEX ATTRIBUTES ENABLE')
//    const gl_type = gfxCtx.gl.FLOAT; // TODO: store the gl.type inside the shaderinfo???

//    // let stride = _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex;
//    const vb_attribs = _shader_attribs_buffer.buffer[attribsidx].attribs_loc;
   
//    const len = attribs_info.locs.length;
//    let stride = 0;
//    for (let i = 0; i < len; i++) {
//       stride += attribs_info.sizes[i];
//    }

//    /** THE LOCATIONS ARE THE ISSUE !!! */
   
//    for (let i = 0; i < len; i++) {

//       /** The attrib divisor denotes the frequency at wich the different meshes will be drawn out of the vertex buffer.
//        * For example: An intanced vb has 4 wpos. If we set divisor to 1, then each instanced geometry will use 1 wpos.
//        * If the divisor is set to 2, then 2 instanced geometries will use 1 wpos.
//        * So if we draw 8 instances of a mesh and we need lets say 4 wpos, 
//        * then we set the divisor to 2, so that 2 meshes will consume 1 wpos => 8/4=2(divisor)
//        */

//       gfxCtx.gl.enableVertexAttribArray(attribs_info.locs[i]);
//       gfxCtx.gl.vertexAttribPointer(attribs_info.locs[i], attribs_info.sizes[i], gl_type, false, stride * FLOAT32_BYTE_SIZE, attribs_info.offsets[i] * FLOAT32_BYTE_SIZE);
//       gfxCtx.gl.vertexAttribDivisor(attribs_info.locs[i], attribs_divisor);
//       // gfxCtx.gl.enableVertexAttribArray(locat[loc_i]);
//       // gfxCtx.gl.vertexAttribPointer(locat[loc_i], attribs_info.sizes[i], gl_type, false, stride * FLOAT32_BYTE_SIZE, attribs_info.offsets[i] * FLOAT32_BYTE_SIZE);
//       // gfxCtx.gl.vertexAttribDivisor(locat[loc_i], attribs_divisor);
//       // loc_i++;

//       console.log(
//          'loc', attribs_info.locs[i],
//          // 'loc', locat,
//          'size', attribs_info.sizes[i],
//          'offset', attribs_info.offsets[i],
//          'vbidx', vbidx,
//          'stride', stride,
//          'divisor', attribs_divisor,
//       );

//    }
//    // VERTEX ATTRIBUTES ENABLE 
//    // loc 0 size 4 offset 0 vbidx 0 stride 7 divisor 1 
//    // loc 1 size 3 offset 4 vbidx 0 stride 7 divisor 1 
//    // ------------------------------------------------------------------------- 
//    // VERTEX ATTRIBUTES ENABLE 
//    // loc 1 size 2 offset 0 vbidx 1 stride 2 divisor 0 
// }

let len1 = 2, cnt1=0, stride1=8, offset1=[0,4], loc1=[0,1], size1=[4,4]
let len2 = 1, cnt2 = 2, stride2=4, offset2=[0], loc2=[2], size2=[4]
let bool = true


// export function Shader_attributes_enable(attribsidx, attribs_divisor, attribs_info, vbidx) {

//    console.log('-------------------------------------------------------------------------')
//    console.log('VERTEX ATTRIBUTES ENABLE')
//    const gl_type = gfxCtx.gl.FLOAT; // TODO: store the gl.type inside the shaderinfo???

   
//    // const len = vb_attribs.length;
//    let len = len1, cnt = cnt1, offset=offset1, stride=stride1, loc=loc1, size=size1;
//    if(bool) bool = false
//    else len = len2, cnt = cnt2, offset=offset2, stride=stride2, loc=loc2, size=size2

//    /** THE LOCATIONS ARE THE ISSUE !!! */
   
//    for (let i = 0; i < len; i++) {


//       gfxCtx.gl.enableVertexAttribArray(loc[i]);
//       gfxCtx.gl.vertexAttribPointer(loc[i], size[i], gl_type, false, stride * FLOAT32_BYTE_SIZE, offset[i] * FLOAT32_BYTE_SIZE);
//       gfxCtx.gl.vertexAttribDivisor(loc[i], attribs_divisor);
//       // gfxCtx.gl.enableVertexAttribArray(vb_attribs[cnt].locs);
//       // gfxCtx.gl.vertexAttribPointer(vb_attribs[cnt].locs, vb_attribs[cnt].sizes, gl_type, false, stride * FLOAT32_BYTE_SIZE, vb_attribs[cnt].offsets * FLOAT32_BYTE_SIZE);
//       // gfxCtx.gl.vertexAttribDivisor(vb_attribs[cnt].locs, attribs_divisor);
      
//       console.log(
//          'loc', loc[i],
//          'size', size[i],
//          'offset', offset[i],
//          'stride', stride,
//          'vbidx', vbidx,
//          'divisor', attribs_divisor,
//       );
//       cnt++;
      
//    }
//    console.log('attribs_info', attribs_info)

// }
/*SAVE ORIGINAL*/
export function Shader_attributes_enable(attribsidx, attribs_divisor, attribs_info, vbidx) {

   console.log('-------------------------------------------------------------------------')
   console.log('VERTEX ATTRIBUTES ENABLE')
   const gl_type = gfxCtx.gl.FLOAT; // TODO: store the gl.type inside the shaderinfo???

   let stride = _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex;
   const vb_attribs = _shader_attribs_buffer.buffer[attribsidx].attribs_loc;
   
   const len = vb_attribs.length;
   // let stride = 0;
   // for (let i = 0; i < len; i++) {
   //    stride += attribs_info.sizes[i];
   // }

   /** THE LOCATIONS ARE THE ISSUE !!! */
   
   for (let i = 0; i < len; i++) {

      /** The attrib divisor denotes the frequency at wich the different meshes will be drawn out of the vertex buffer.
       * For example: An intanced vb has 4 wpos. If we set divisor to 1, then each instanced geometry will use 1 wpos.
       * If the divisor is set to 2, then 2 instanced geometries will use 1 wpos.
       * So if we draw 8 instances of a mesh and we need lets say 4 wpos, 
       * then we set the divisor to 2, so that 2 meshes will consume 1 wpos => 8/4=2(divisor)
       */

      // gfxCtx.gl.enableVertexAttribArray(attribs_info.locs[i]);
      // gfxCtx.gl.vertexAttribPointer(attribs_info.locs[i], attribs_info.sizes[i], gl_type, false, stride * FLOAT32_BYTE_SIZE, attribs_info.offsets[i] * FLOAT32_BYTE_SIZE);
      // gfxCtx.gl.vertexAttribDivisor(attribs_info.locs[i], attribs_divisor);
      gfxCtx.gl.enableVertexAttribArray(vb_attribs[i].locs);
      gfxCtx.gl.vertexAttribPointer(vb_attribs[i].locs, vb_attribs[i].sizes, gl_type, false, stride * FLOAT32_BYTE_SIZE, vb_attribs[i].offsets * FLOAT32_BYTE_SIZE);
      gfxCtx.gl.vertexAttribDivisor(vb_attribs[i].locs, attribs_divisor);
      // gfxCtx.gl.enableVertexAttribArray(locat[loc_i]);
      // gfxCtx.gl.vertexAttribPointer(locat[loc_i], attribs_info.sizes[i], gl_type, false, stride * FLOAT32_BYTE_SIZE, attribs_info.offsets[i] * FLOAT32_BYTE_SIZE);
      // gfxCtx.gl.vertexAttribDivisor(locat[loc_i], attribs_divisor);
      // loc_i++;

      console.log(
         'loc', vb_attribs[i].locs,
         'size', vb_attribs[i].sizes,
         'offset', vb_attribs[i].offsets,
         'stride', stride,
         'vbidx', vbidx,
         'divisor', attribs_divisor,
      );

   }
   // VERTEX ATTRIBUTES ENABLE 
   // loc 0 size 4 offset 0 vbidx 0 stride 7 divisor 1 
   // loc 1 size 3 offset 4 vbidx 0 stride 7 divisor 1 
   // ------------------------------------------------------------------------- 
   // VERTEX ATTRIBUTES ENABLE 
   // loc 1 size 2 offset 0 vbidx 1 stride 2 divisor 0 
}

/** */
// export function Shader_attributes_enable(attribsidx, attribs_divisor, attribs_info, vbidx) {

//    console.log('-------------------------------------------------------------------------')
//    console.log('VERTEX ATTRIBUTES ENABLE')
//    const gl_type = gfxCtx.gl.FLOAT; // TODO: store the gl.type inside the shaderinfo???

//    // const stride = _shader_attribs_buffer.buffer[attribsidx].mesh_attribs.attribs_per_vertex;
//    const vb_attribs = _shader_attribs_buffer.buffer[attribsidx].attribs_loc;
//    const len = vb_attribs.length;

//    let stride = 0;
//    for (let i = 0; i < len; i++) {
//       stride += attribs_info.sizes[i];
//    }
//    for (let i = 0; i < len; i++) {

//       /** The attrib divisor denotes the frequency at wich the different meshes will be drawn out of the vertex buffer.
//        * For example: An intanced vb has 4 wpos. If we set divisor to 1, then each instanced geometry will use 1 wpos.
//        * If the divisor is set to 2, then 2 instanced geometries will use 1 wpos.
//        * So if we draw 8 instances of a mesh and we need lets say 4 wpos, 
//        * then we set the divisor to 2, so that 2 meshes will consume 1 wpos => 8/4=2(divisor)
//        */

//       gfxCtx.gl.enableVertexAttribArray(vb_attribs[i].locs);
//       gfxCtx.gl.vertexAttribPointer(vb_attribs[i].locs, vb_attribs[i].sizes, gl_type, false, stride * FLOAT32_BYTE_SIZE, vb_attribs[i].offsets * FLOAT32_BYTE_SIZE);
//       gfxCtx.gl.vertexAttribDivisor(vb_attribs[i].locs, attribs_divisor);

//       console.log(
//          'loc', vb_attribs[i].locs,
//          'size', vb_attribs[i].sizes,
//          'offset', vb_attribs[i].offsets,
//          'vbidx', vbidx,
//          'stride', stride,
//          'divisor', attribs_divisor,
//       );

//    }
// }





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
      nameids: [],
      // types: [],
   }

   const attribs_indexing = new Attributes_indexing();

   let offset = 0;

   const attributes_index = Program_get_shader_attribs_indexing(progidx);

   // Select and build the info from the attributes that the vertex buffer has
   const len = shader_attribs.nameids.length;
   for (let i=0; i<len; i++){

      if(sid & shader_attribs.nameids[i])
      {

         attribs_info.count += shader_attribs.sizes[i];

         attribs_info.locs.push(shader_attribs.locs[i]);
         attribs_info.sizes.push(shader_attribs.sizes[i]);
         // attribs_info.types.push(shader_attribs.types[i]);
         attribs_info.offsets.push(offset);
         offset += shader_attribs.sizes[i];

         // attribs_indexing.FindByNameAndStoreIndex(shader_attribs.nameids[i], i)
         attribs_indexing.FindByNameAndStoreIndex(shader_attribs.nameids[i], attributes_index)
      }

   }


   return {
      attribs_info:attribs_info, 
      attribs_indexing:attribs_indexing
   };

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