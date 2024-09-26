// https://computergraphics.stackexchange.com/questions/100/sharing-code-between-multiple-glsl-shaders


import { vertex_shader_chunks, fragment_shader_chunks } from './ShaderChunks/ShaderChunks.js'
import { frag_feather, frag_feather_call, frag_round_corners, frag_round_corners_call, frag_style_call, frag_style_corners } from './Functions/fragment.roundcorners.js'
import { frag_msdf, frag_msdf_call, frag_sdf, frag_sdf_call, frag_tex } from './Functions/fragment.texture.js'
import { frag_glow, frag_glow_call } from './Functions/fragment.glow.js';
import { frag_noise, frag_noise_call } from './Functions/fragment.noise.js';
import { frag_smoke, frag_smoke_call } from './Functions/fragment.smoke.js';
import { frag_test1 } from './Functions/fragment.tests.js';
import { Attributes_indexing, Shader_attributes_create } from '../../ShaderAttributes.js';





// Resolve Includes to build the correct shaders
const pattern_includes = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Vertex_shader_includes_replace(matchPattern, key) {
   const string = vertex_shader_chunks[key];
   if (string === undefined) { throw new Error('Can not resolve #include <' + key + '> in Vertex Shader'); }
   return Vertex_shader_includes_resolve(string);
}



function Vertex_shader_includes_resolve(string) {
   return string.replace(pattern_includes, Vertex_shader_includes_replace);
}



function Fragment_shader_includes_replace(matchPattern, key) {
   const string = fragment_shader_chunks[key];
   if (string === undefined) { throw new Error('Can not resolve #include <' + key + '> in Fragment Shader'); }
   return Fragment_shader_includes_resolve(string);
}



function Fragment_shader_includes_resolve(string) {
   return string.replace(pattern_includes, Fragment_shader_includes_replace);
}



function Generate_defines(defines) {

   const chunks = [];
   for (const name in defines) {
      const value = defines[name];
      if (value === false) continue;
      chunks.push('#define ' + name + ' ' + value);
   }
   return chunks.join('\n');
}



function filterEmptyLine(string) {
   return string !== '';
}



/*
   // TODO!!!: The shader constants, for buffer sizes etc, must be calculated at run time.
   That requires that the app collects all the data from all the meshes, 
   without creating any gl program and its shaders.
   MUST BE IMPLEMENTED.
*/
export const SHADER_CONSTANTS = {
   UNIFORM_BUFFER_COUNT: 5,
};



export const UNIFORM_BLOCK_SHARED_NAME = 'Uniform_block_generic';


/**
 * ERRORS:
 * 
 * . The 'Gfx_generate_context()' call, does not pass a 'uniform' param. 
 */

function Resolve_uniforms_from_sid(_uniforms_info, which_shader) {

   let uniforms_code = '';
   let block_created = false;

   const len = _uniforms_info.length;

   for (let i = 0; i < len; i++) {
      if (_uniforms_info[i].shader & UNIFORM.IS_SHARED) {

         // Create Uniforms Block
         if (!block_created) {
            uniforms_code += `layout(std140) uniform Uniform_block_generic {\n`;
            block_created = true;
         }

         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += ` ${type} ${_uniforms_info[i].name};\n`;
      }

   }

   // End uniforms block
   if (block_created) uniforms_code += '};\n';


   uniforms_code += '\n// Uniforms\n';
   for (let i = 0; i < len; i++) {
      if ((_uniforms_info[i].shader & UNIFORM.IN_VS && (which_shader & UNIFORM.IN_VS))) {

         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name};\n`;
         console.log('<<<<<<<<<<<<<<< VERTEX SHADER UNIFORM ENABLE:', _uniforms_info[i].name)
      }
      else if ((_uniforms_info[i].shader & UNIFORM.IN_FS) && (which_shader & UNIFORM.IN_FS)) {

         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name};\n`;
         console.log('<<<<<<<<<<<<<<< FRAGMENT SHADER UNIFORM ENABLE:', _uniforms_info[i].name)
      }
   }

   return uniforms_code;

   // Extension: For lights
}




/**********************************************************************************************************************************************/
/**********************************************************************************************************************************************/
// Shader Attributes Builder 



const attribs_xyzw = ['.x', '.y', '.z', '.w'];
let locations = null;
let attributes_in_code = '';
let attributes_out_code = '';
let attributes_assign_code = '';
let fs_attribs_in_code = '';



/**************************************************************************/
const max_val_in_loc = 4;
class Mesh_attribute { // Attributes info struct

   constructor(loc = INT_NULL, offset = INT_NULL, size = 0, type = 0, name = '') {

      this.loc = loc;
      this.offset = offset;
      this.size = size;
      this.type = type;
      this.name = name;
      this.nameid = 0x0;
   }
};

var mesh_attributes = []; // Store all attributes info in a buffer
const attribs_info = { mesh_attribs: [], attribs_loc: [] };
/**************************************************************************/





function Create_new_attrib_location(loc, loc_idx) {

   if (loc_idx >= 0 && loc[loc_idx].is_active) {

      attributes_in_code += `in vec4 a_generic_${loc_idx};\n`;
   }

   loc_idx++;
   // attributes_in_code += `in vec4 a_generic_${loc_idx};\n`;
   loc[loc_idx].name = `a_generic_${loc_idx}`;
   loc[loc_idx].is_active = true;


   return loc_idx;
}



function Create_attribute(name, location_name, attr_idx, pass_to_fs = 0x0) {

   let extra = '';
   if (pass_to_fs & (SID.PASS.WPOS3 | SID.PASS.WPOS2)) {
      // For every WPOS passing, create the code of the uniform wposition 
      extra = ` + u_wposxy${attribs_xyzw[attr_idx]}`;
   }

   return {
      is_occupied: true,
      is_passing: pass_to_fs, // Is this attrib passing to the fragment shader 
      name: name,
      out_name: `v_${name}`,
      in_name: `${location_name}${attribs_xyzw[attr_idx]}`,
      extra: extra,
   };
}



function Vertex_shader_resolve_attributes_in(sid) {

   attributes_in_code += ''

   const loc = [
      {
         is_active: false,
         name: '',
         attr: [{}, {}, {}, {},],
      },
      {
         is_active: false,
         name: '',
         attr: [
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
         ],
      },
      {
         is_active: false,
         name: '',
         attr: [
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
         ],
      },
      {
         is_active: false,
         name: '',
         attr: [
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
            { is_occupied: false, name: '', in_name: '', },
         ],
      },
   ];


   const attribs_indexing = new Attributes_indexing();
   let attribs_idx = 0;

   let loc_idx = -1;
   let vec_idx = 0;

   loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0;

   if (sid.attr & SID.ATTR.COL4) {

      const pass_to_fs = sid.pass & SID.PASS.COL4;

      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.loc = loc_idx;
      mesh_attribute.name = 'col4';
      mesh_attribute.nameid |= SID.ATTR.COL4;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC4;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);

      // if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('col4_r', loc[loc_idx].name, vec_idx, pass_to_fs,);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('col4_g', loc[loc_idx].name, vec_idx, pass_to_fs,);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('col4_b', loc[loc_idx].name, vec_idx, pass_to_fs,);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('col4_a', loc[loc_idx].name, vec_idx, pass_to_fs,);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.COL4 = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.WPOS3) {

      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'wpos3';
      mesh_attribute.nameid |= SID.ATTR.WPOS3;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC3;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);

      loc[loc_idx].attr[vec_idx] = Create_attribute('wpos3_x', loc[loc_idx].name, vec_idx, sid.pass & (SID.PASS.WPOS3 | SID.PASS.WPOS2),);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('wpos3_y', loc[loc_idx].name, vec_idx, sid.pass & (SID.PASS.WPOS3 | SID.PASS.WPOS2),);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('wpos3_z', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.WPOS3,);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.WPOS3 = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.TIME) {

      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'time';
      mesh_attribute.nameid |= SID.ATTR.TIME;
      mesh_attribute.type = GL_TYPES.FLOAT;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('time', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.TIME,);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.TIME = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.POS2) {

      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'pos2';
      mesh_attribute.nameid |= SID.ATTR.POS2;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC2;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('pos2_x', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.POS2,);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('pos2_y', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.POS2,);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.POS2 = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.DIM2) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'dim2';
      mesh_attribute.nameid |= SID.ATTR.DIM2;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC2;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('dim2_x', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.DIM2,);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('dim2_y', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.DIM2);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.DIM2 = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.R_CORNERS) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'rcorners';
      mesh_attribute.nameid |= SID.ATTR.R_CORNERS;
      mesh_attribute.type = GL_TYPES.FLOAT;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('rcorners', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.R_CORNERS,);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.R_CORNERS = attribs_idx++;

   }

   if (sid.attr & SID.ATTR.BORDER) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'border';
      mesh_attribute.nameid |= SID.ATTR.BORDER;
      mesh_attribute.type = GL_TYPES.FLOAT;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('border', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.BORDER,);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.BORDER = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.FEATHER) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'feather';
      mesh_attribute.nameid |= SID.ATTR.FEATHER;
      mesh_attribute.type = GL_TYPES.FLOAT;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('feather', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.FEATHER,);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.FEATHER = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.TEX2) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'tex2';
      mesh_attribute.nameid |= SID.ATTR.TEX2;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC2;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('tex2_u', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.TEX2);
      vec_idx++;
      mesh_attribute.size++;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('tex2_v', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.TEX2);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.TEX2 = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.GLOW_INTENSITY) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'glow_intensity';
      mesh_attribute.nameid |= SID.ATTR.GLOW_INTENSITY;
      mesh_attribute.type = GL_TYPES.FLOAT;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('glow_intensity', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.GLOW_INTENSITY);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.GLOW_INTENSITY = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.SDF) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'sdf';
      mesh_attribute.nameid |= SID.ATTR.SDF;
      mesh_attribute.type = GL_TYPES.FLOAT;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('sdf', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.SDF);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.SDF = attribs_idx++;
   }

   if (sid.attr & SID.ATTR.MSDF) {


      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'msdf';
      mesh_attribute.nameid |= SID.ATTR.MSDF;
      mesh_attribute.type = GL_TYPES.FLOAT;

      if (vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location

      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


      loc[loc_idx].attr[vec_idx] = Create_attribute('msdf', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.MSDF);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);

      attribs_indexing.MSDF = attribs_idx++;
   }


   locations = loc;





   /**
    * 
    */

   if (vec_idx === 1) {
      attributes_in_code += `in float a_generic_${loc_idx};\n`;
      loc[loc_idx].attr[0].in_name = `${loc[loc_idx].name}`
   }
   else attributes_in_code += `in vec${vec_idx} a_generic_${loc_idx};\n`;

   /** 
    *  
    */
   // attribs_info.mesh_attribs.push(mesh_attribute);
   let offset = 0;
   let size = 0;
   for (let i = 0; i < locations.length; i++) {

      if (locations[i].is_active) {

         let location = i;
         offset += size;
         size = 0;

         for (let j = 0; j < locations[i].attr.length; j++) {
            if (locations[i].attr[j].is_occupied) size++;
         }

         attribs_info.attribs_loc.push({
            locs: i,
            sizes: size,
            offsets: offset,
         });
      }
   }



   // DEBUG-PRINT
   for (let i = 0; i < mesh_attributes.length; i++) console.log('names:', mesh_attributes[i].name);


   return {
      attribs_info:attribs_info,
      attribs_indexing:attribs_indexing,
   }
}



function Vertex_shader_resolve_attributes_out() {

   for (let i = 0; i < locations.length; i++) {

      for (let j = 0; j < locations[i].attr.length; j++) {

         const attrib = locations[i].attr[j];
         if (attrib.is_passing) {
            attributes_out_code += `out float ${attrib.out_name};\n`;
         }
      }
   }


   // console.log('-------------------------------------------------------\nResolver: Attributes Out:\n', attributes_out_code);
}



function Vertex_shader_resolve_attributes_out_assignment() {

   for (let i = 0; i < locations.length; i++) {

      for (let j = 0; j < locations[i].attr.length; j++) {

         const attrib = locations[i].attr[j];

         if (attrib.is_occupied) {
            if (attrib.is_passing) {
               attributes_assign_code += `  ${attrib.out_name} = ${attrib.in_name} ${attrib.extra};\n`;
            }
            else {
               attributes_assign_code += `  float ${attrib.out_name} = ${attrib.in_name};\n`;
            }
         }
      }
   }


   // console.log('-------------------------------------------------------\nResolver: Attributes Assign:\n', attributes_assign_code);
}



/**
 * Set 'DEFINES_xxxx' and then find and replace the 'DEFINES_xxxx' with code from a function
 */
export function Shaders_build_vertex_shader(sid, uniforms_info) {


   const ret = Vertex_shader_resolve_attributes_in(sid);
   Vertex_shader_resolve_attributes_out();
   Vertex_shader_resolve_attributes_out_assignment();

   const vs_chunks = [

      '#version 300 es   /*** Vertex Shader ***/\n',

      '#include <precision_medium>\n',

      /********************************************************************************************************/
      // Defines
      /********************************************************************************************************/
      '\n// Defines',
      ((sid.unif & SID.UNIF.SCALE2) && (uniforms_info & UNIFORM.IN_VS)) ? '#define U_SCALE 1' : '',



      /********************************************************************************************************/
      // UNIFORMS
      /********************************************************************************************************/
      '\n// Uniforms Block',
      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_VS),



      /********************************************************************************************************/
      // Attributes In
      /********************************************************************************************************/
      '\n// Input Attributes',
      attributes_in_code,



      /********************************************************************************************************/
      // OUTS
      /********************************************************************************************************/
      '\n// Out variables',
      attributes_out_code,






      /********************************************************************************************************/
      // Main Function
      /********************************************************************************************************/
      'void main(void) ',
      '{',



      /********************************************************************************************************/
      // Assignments
      '   // Assignments',
      attributes_assign_code,



      /********************************************************************************************************/
      // Scale in Vertex Shader
      (sid.shad & SID.SHAD.VS_TEST1) ? '   // HI FROM VS_TEST1' : '',



      /********************************************************************************************************/
      // Calculate vertex position-rotation-scale
      '   // Vertex Shader Logic',

      /**
       * Current vertex: gl_VertexID.
       * Use to set the vertex position.
       * Use #directives to enable vertex pos by the vertex id we are currently on.
       * Example:
       *    Vertex pos: V1:[0,y], V2:[0,0], V3:[x,y], V4:[x,0]
       * That way we can pass 2 attributes as the mesh dimention
       * and create the vertex position from them. No need to pass 8 values
       * for vertex pos and another 2 for dimention
       */



      // 'float v1pos = 0.;',
      // 'if(gl_VertexID==0) v1pos = v_pos2_x;',
      
      // 'float vposx = v_pos2_x + float(gl_VertexID)*float(gl_VertexID);',
      // 'float vposy = v_pos2_y + float(gl_VertexID)*float(gl_VertexID);',
      // (sid.unif & SID.UNIF.PROJECTION_MATRIX) // TODO: See if we can set the code for 'u_projection' with a flag from the 'Resolve_uniforms_from_sid()' and not have to set the SID.UNIF.PROJECTION_MATRIX manualy
      //    ? '  gl_Position = u_projection * vec4(vposx + v_wpos3_x, vposy + v_wpos3_y, v_wpos3_z, 1.0);'
      //    : '  gl_Position = vec4(v_pos2_x + v_wpos3_x, v_pos2_y + v_wpos3_y, v_wpos3_z, 1.0);',


      (sid.unif & SID.UNIF.PROJECTION_MATRIX) // TODO: See if we can set the code for 'u_projection' with a flag from the 'Resolve_uniforms_from_sid()' and not have to set the SID.UNIF.PROJECTION_MATRIX manualy
         ? '   gl_Position = u_projection * vec4(v_pos2_x + v_wpos3_x, v_pos2_y + v_wpos3_y, v_wpos3_z, 1.0);'
         : '   gl_Position = vec4(v_pos2_x + v_wpos3_x, v_pos2_y + v_wpos3_y, v_wpos3_z, 1.0);',


      '}',

   ];

   const vertex_shader = vs_chunks.filter(filterEmptyLine).join('\n')

   const vs = Vertex_shader_includes_resolve(vertex_shader);

   const attribsidx = Shader_attributes_create(ret.attribs_info);

   if (DEBUG.SHADERS) console.info(vs)
   return {
      vs: vs,
      attribsidx: attribsidx,
      attribs_indexing:ret.attribs_indexing,
   };
}

/** // https://www.khronos.org/opengl/wiki/Fragment_Shader
 * Fragment Shaders have the following built-in input variables.

   in vec4 gl_FragCoord;
   in bool gl_FrontFacing;
   in vec2 gl_PointCoord;

 */




function Fragment_shader_resolve_attributes_in() {

   for (let i = 0; i < locations.length; i++) {

      for (let j = 0; j < locations[i].attr.length; j++) {

         const attrib = locations[i].attr[j];
         if (attrib.is_passing) {
            fs_attribs_in_code += `in float ${attrib.out_name};\n`;
         }
      }
   }


   // console.log('-------------------------------------------------------\nResolver: Fragment Shader Inputs:\n', fs_attribs_in_code);
}

export function Shaders_build_fragment_shader(sid, uniforms_info) {

   Fragment_shader_resolve_attributes_in();

   const fs_chunks = [

      '#version 300 es   /*** Fragment Shader ***/\n',






      /********************************************************************************************************/
      // DEFINES
      '\n',
      '#include <precision_medium>',
      '#include <out_frag_color>',
      (sid.unif & SID.UNIF.SCALE2) ? '#define U_SCALE 1' : '',
      (sid.unif & SID.UNIF.FS_RCORNERS_FLOAT) ? '#define U_RCORNERS_FLOAT 1' : '', // NOTE: It is easier for uniforms specific to a shader not have a specific unif name for each uniform, rather use the sid.fx to #define all uniforms for that shader
      (sid.fx & SID.FX.FS_GLOW_VEC3) ? '#define U_GLOW_PARAMS_VEC3 1' : '', 
      (sid.fx & SID.FX.FS_GLOW_VEC2) ? '#define U_GLOW_PARAMS_VEC2 1' : '', 
      (sid.fx & SID.FX.FS_SMOKE_VEC3) ? '#define U_SMOKE_PARAMS_VEC3 1' : '', 
      (sid.fx & SID.FX.FS_SMOKE_VEC2) ? '#define U_SMOKE_PARAMS_VEC2 1' : '', 
      (sid.fx & SID.FX.FS_NOISE) ? '#define U_NOISE_PARAMS 1' : '',
      (sid.attr & SID.ATTR.TEX2) ? '#define A_TEX_COORD 1' : '',
      (sid.attr & SID.ATTR.TIME) ? '#define A_TIME 1' : '',
      (sid.attr & SID.ATTR.GLOW_INTENSITY) ? '#define A_GLOW_INTENSITY_FLOAT' : '',
 





      /********************************************************************************************************/
      // In
      '\n',
      fs_attribs_in_code,
      
      
      
      
      
      
      /********************************************************************************************************/
      // UNIFORMS
      '\n',
      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_FS),
      (sid.attr & SID.ATTR.TEX2) ? '#include <frag_u_sampler0>' : '',






      /********************************************************************************************************/
      // Defines
      // '#ifdef U_SCALE\n  float scale_down = u_scale2.x;\n#else\n  float scale_down = 1.;\n#endif\n',
      // '#ifdef U_SCALE\n  float scale_down = 1.;\n  \n#else\n  float scale_down = 1.;\n#endif\n',






      /********************************************************************************************************/
      // Function definitions
      '\n',
      ((sid.attr & SID.ATTR.BORDER) && (sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_style_corners : 
                                       ((sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_round_corners : 
                                       (sid.attr & SID.ATTR.FEATHER) ? frag_feather : '',
      (sid.attr & SID.ATTR.SDF) ? frag_sdf : '',
      (sid.attr & SID.ATTR.MSDF) ? frag_msdf : '',
      // (sid.attr & (SID.ATTR.GLOW_INTENSITY)) ? frag_glow : '',






      /********************************************************************************************************/
      // Fx shader functions
      (sid.fx & (SID.FX.FS_GLOW_VEC3 | SID.FX.FS_GLOW_VEC2)) ? frag_glow : '',
      (sid.fx & SID.FX.FS_NOISE) ? frag_noise : '',
      (sid.fx & SID.FX.FS_SMOKE_VEC3) ? frag_smoke : '',






      /********************************************************************************************************/
      // Test shader functions
      (sid.shad & SID.SHAD.FS_TEST1) ? frag_test1 : '',






      /********************************************************************************************************/
      // Main
      true ? 'void main(void) ' : '',
      '{',

      '   #ifdef U_SCALE\n     float scale_down = u_scale2.x;\n   #else\n      float scale_down = 1.;\n   #endif\n',
      '   #ifdef A_TEX_COORD\n      vec2 v_tex_coord = vec2(v_tex2_u, v_tex2_v);\n   #endif\n',



      '   vec4 color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);',
      
      ((sid.attr & SID.ATTR.BORDER) && (sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_style_call : 
                                       ((sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_round_corners_call :
                                       (sid.attr & SID.ATTR.FEATHER) ? frag_feather_call : '',
      // (sid.attr & (SID.ATTR.GLOW_INTENSITY)) ? frag_glow_call : '',
      
      (sid.fx & (SID.FX.FS_GLOW_VEC3 | SID.FX.FS_GLOW_VEC2)) ? '   float alpha = color.a;' : '',
      (sid.fx & (SID.FX.FS_GLOW_VEC3 | SID.FX.FS_GLOW_VEC2)) ? frag_glow_call : '',
      (sid.fx & SID.FX.FS_NOISE) ? frag_noise_call : '',
      (sid.fx & SID.FX.FS_SMOKE_VEC3) ? frag_smoke_call : '',
      (sid.attr & SID.ATTR.TEX2) ? (sid.attr & SID.ATTR.SDF) ? frag_sdf_call : (sid.attr & SID.ATTR.MSDF) ? frag_msdf_call : frag_tex : '',






      /********************************************************************************************************/
      // Color fragment
      '   frag_color = color;',
      (sid.shad & SID.SHAD.PRE_MULTIPLIED_ALPHA) ? '   frag_color.rgb *= v_col.a; ' : '',
      // true ? '  frag_color.rgb *= color.a;' : '',






      /********************************************************************************************************/
      // TESTS
      // (sid.unif & SID.UNIF.SCALE2) ? '  if(u_scale2.x == 0.) ;' : '', // HACK: prevent optimizer from removing the uniform u_scale2
      (sid.unif & SID.UNIF.TIME) ? '   if(u_time == 0.) ;' : '',
      // (sid.unif & SID.UNIF.TIME) ? '  frag_color.xyz *= u_time;' : '',
      // (sid.unif & SID.UNIF.SCALE2) ? '  frag_color.xyz *= u_scale2.x;' : '',
      // true ? 'frag_color = vec4(1.);' : '',

      true ? '}' : '',

   ];

   const fragment_shader = fs_chunks.filter(filterEmptyLine).join('\n')

   const fs = Fragment_shader_includes_resolve(fragment_shader);


   // Reset for the next Shader Program build
   locations = null;
   attributes_in_code = '';
   attributes_out_code = '';
   attributes_assign_code = '';
   fs_attribs_in_code = '';
   mesh_attributes = [];
   attribs_info.mesh_attribs = [];
   attribs_info.attribs_loc = [];


   if (DEBUG.SHADERS) console.info(fs);
   return fs;
}


