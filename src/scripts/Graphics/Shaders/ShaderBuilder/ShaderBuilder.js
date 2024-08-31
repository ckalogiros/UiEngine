// https://computergraphics.stackexchange.com/questions/100/sharing-code-between-multiple-glsl-shaders


import { vertex_shader_chunks, fragment_shader_chunks } from './ShaderChunks/ShaderChunks.js'
import { frag_round_corners_call, frag_round_corners } from './Functions/fragment.roundcorners.js'
import { frag_msdf, frag_msdf_call, frag_sdf, frag_sdf_call, frag_tex } from './Functions/fragment.texture.js'
import { frag_glow, frag_glow_call } from './Functions/fragment.glow.js';
import { frag_noise, frag_noise_call } from './Functions/fragment.noise.js';
import { frag_smoke, frag_smoke_call } from './Functions/fragment.smoke.js';
import { frag_test1, frag_test1_call } from './Functions/fragment.tests.js';
import { New_generic_buffer } from '../../../Engine/Core/Buffers.js';





// Resolve Includes to build the correct shaders
const pattern_includes = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Vertex_shader_includes_replace( matchPattern, key ) {
   const string = vertex_shader_chunks[ key ];
   if ( string === undefined ) { throw new Error( 'Can not resolve #include <' + key + '> in Vertex Shader' ); }
   return Vertex_shader_includes_resolve( string );
}



function Vertex_shader_includes_resolve( string ) {
   return string.replace( pattern_includes, Vertex_shader_includes_replace );
}



function Fragment_shader_includes_replace( matchPattern, key ) {
   const string = fragment_shader_chunks[ key ];
   if ( string === undefined ) { throw new Error( 'Can not resolve #include <' + key + '> in Fragment Shader' ); }
   return Fragment_shader_includes_resolve( string );
}



function Fragment_shader_includes_resolve( string ) {
	return string.replace( pattern_includes, Fragment_shader_includes_replace );
}



function Generate_defines( defines ) {

   const chunks = [];
	for ( const name in defines ) {
		const value = defines[ name ];
		if ( value === false ) continue;
		chunks.push( '#define ' + name + ' ' + value );
	}
	return chunks.join( '\n' );
}



function filterEmptyLine( string ) {
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

function Resolve_uniforms_from_sid(_uniforms_info, which_shader){

   let uniforms_code = '';
   let block_created = false;
   
   const len = _uniforms_info.length;

   for(let i=0; i< len; i++){
      if(_uniforms_info[i].shader & UNIFORM.IS_SHARED){

         // Create Uniforms Block
         if(!block_created) {
            uniforms_code += `layout(std140) uniform Uniform_block_generic {\n`;
            block_created = true;
         }
         
         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += ` ${type} ${_uniforms_info[i].name};\n`; 
      }

   }

   // End uniforms block
   if(block_created) uniforms_code += '};\n';
   

   // TODO: For the time being despite the fact that a uniform is categorized as "IN_VS", the "uniforms_code += " will ad it to any shader called by this function. CORRECT IT.
   for(let i=0; i< len; i++){
      if((_uniforms_info[i].shader & UNIFORM.IN_VS && (which_shader & UNIFORM.IN_VS)) ){

         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name};\n`; 
         console.log('<<<<<<<<<<<<<<< VERTEX SHADER >>>>>>>>>>>>>>>\nUNIFORM ENABLE:', _uniforms_info[i].name)
      }
      else if((_uniforms_info[i].shader & UNIFORM.IN_FS) && (which_shader & UNIFORM.IN_FS)){
         
         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name};\n`; 
         console.log('<<<<<<<<<<<<<<< FRAGMENT SHADER >>>>>>>>>>>>>>>\nUNIFORM ENABLE:', _uniforms_info[i].name)
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
   
   constructor(loc=INT_NULL, offset=INT_NULL, size=0, type=0, name=''){

      this.loc = loc;
      this.offset = offset;
      this.size = size;
      this.type = type;
      this.name = name;
      this.nameid = 0x0;
   }
};

var mesh_attributes = []; // Store all attributes info in a buffer
const attribs_info = { mesh_attribs:[], attribs_loc:[] };
/**************************************************************************/




function Create_new_attrib_location(loc, loc_idx){
   
   if(loc_idx >= 0 && loc[loc_idx].is_active){

      attributes_in_code += `in vec4 a_generic_${loc_idx};\n`;
   }

   loc_idx++; 
   // attributes_in_code += `in vec4 a_generic_${loc_idx};\n`;
   loc[loc_idx].name =`a_generic_${loc_idx}`;
   loc[loc_idx].is_active = true;


   return loc_idx;
}



function Create_attribute(name, location_name, attr_idx, pass_to_fs=0x0) {

   return {
      is_occupied:true, 
      is_passing:pass_to_fs, // Is this attrib passing to the fragment shader 
      name:name,  
      out_name: `v_${name}`, 
      in_name:`${location_name}${attribs_xyzw[attr_idx]}`,
   };
}



function Vertex_shader_resolve_attributes_in(sid){

   const loc = [
      {
         is_active: false,
         name: '',
         attr: [ {}, {}, {}, {}, ],
      },
      {
         is_active: false,
         name: '',
         attr: [
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
         ],
      },
      {
         is_active: false,
         name: '',
         attr: [
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
         ],
      },
      {
         is_active: false,
         name: '',
         attr: [
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
            {is_occupied:false, name:'', in_name:'',},
         ],
      },
   ];


   let loc_idx = -1;
   let vec_idx = 0;

   loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; 

   if(sid.attr & SID.ATTR.COL4){
      
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
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('col4_g', loc[loc_idx].name, vec_idx, pass_to_fs,);
      vec_idx++;
      mesh_attribute.size++;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('col4_b', loc[loc_idx].name, vec_idx, pass_to_fs,);
      vec_idx++;
      mesh_attribute.size++;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('col4_a', loc[loc_idx].name, vec_idx, pass_to_fs,);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.WPOS_TIME4) {
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'wpos3';
      mesh_attribute.nameid |= SID.ATTR.WPOS_TIME4;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC3;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('wpos3_x', loc[loc_idx].name, vec_idx, sid.pass & (SID.PASS.WPOS3|SID.PASS.WPOS2),);
      vec_idx++;
      mesh_attribute.size++;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('wpos3_y', loc[loc_idx].name, vec_idx, sid.pass & (SID.PASS.WPOS3|SID.PASS.WPOS2),);
      vec_idx++;
      mesh_attribute.size++;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('wpos3_z', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.WPOS3,);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.TIME) {
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'time';
      mesh_attribute.nameid |= SID.ATTR.TIME;
      mesh_attribute.type = GL_TYPES.FLOAT;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('time', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.TIME,);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.POS2) {
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'pos2';
      mesh_attribute.nameid |= SID.ATTR.POS2;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC2;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('pos2_x', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.POS2,);
      vec_idx++;
      mesh_attribute.size++;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('pos2_y', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.POS2,);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.DIM2) {
      
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'dim';
      mesh_attribute.nameid |= SID.ATTR.DIM2;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC2;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('dim2_x', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.DIM2,);
      vec_idx++;
      mesh_attribute.size++;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('dim2_y', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.DIM2);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.R_CORNERS) {
      
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'rcorners';
      mesh_attribute.nameid |= SID.ATTR.R_CORNERS;
      mesh_attribute.type = GL_TYPES.FLOAT;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('rcorners', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.R_CORNERS,);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
      
   }
   
   if(sid.attr & SID.ATTR.BORDER) {
      
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'border';
      mesh_attribute.nameid |= SID.ATTR.BORDER;
      mesh_attribute.type = GL_TYPES.FLOAT;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('border', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.BORDER,);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.FEATHER) {
      
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'feather';
      mesh_attribute.nameid |= SID.ATTR.FEATHER;
      mesh_attribute.type = GL_TYPES.FLOAT;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('feather', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.FEATHER,);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.TEX2) {

      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'tex2';
      mesh_attribute.nameid |= SID.ATTR.TEX2;
      mesh_attribute.type = GL_TYPES.FLOAT_VEC2;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('tex2_u', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.TEX2);
      vec_idx++;
      mesh_attribute.size++;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      loc[loc_idx].attr[vec_idx] = Create_attribute('tex2_v', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.TEX2);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.GLOW_INTENSITY) {
      
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'glow_intensity';
      mesh_attribute.nameid |= SID.ATTR.GLOW_INTENSITY;
      mesh_attribute.type = GL_TYPES.FLOAT;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('glow_intensity', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.GLOW_INTENSITY);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.SDF) {
      
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'sdf';
      mesh_attribute.nameid |= SID.ATTR.SDF;
      mesh_attribute.type = GL_TYPES.FLOAT;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
      
      loc[loc_idx].attr[vec_idx] = Create_attribute('sdf', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.SDF);
      vec_idx++;
      mesh_attribute.size++;
      
      attribs_info.mesh_attribs.push(mesh_attribute);
   }
   
   if(sid.attr & SID.ATTR.MSDF) {
      
      
      const mesh_attribute = new Mesh_attribute();
      mesh_attribute.name = 'msdf';
      mesh_attribute.nameid |= SID.ATTR.MSDF;
      mesh_attribute.type = GL_TYPES.FLOAT;
      
      if(vec_idx >= max_val_in_loc) { loc_idx = Create_new_attrib_location(loc, loc_idx, attributes_in_code); vec_idx = 0; } // Check for full attrib location
      
      mesh_attribute.loc = loc_idx;
      mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);
      
     
      loc[loc_idx].attr[vec_idx] = Create_attribute('msdf', loc[loc_idx].name, vec_idx, sid.pass & SID.PASS.MSDF);
      vec_idx++;
      mesh_attribute.size++;

      attribs_info.mesh_attribs.push(mesh_attribute);
   }


   locations = loc;





   /**
    * 
    */

   if(vec_idx === 1)  {
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
   for(let i=0; i < locations.length; i++){

      if(locations[i].is_active){
         
         let location = i;
         offset += size;
         size = 0;
         
         for(let j=0; j < locations[i].attr.length; j++){
            if(locations[i].attr[j].is_occupied) size++;
         }
         
         attribs_info.attribs_loc.push({
            loc: i,
            size: size,
            offset: offset, 
         });
      }
   }



   // DEBUG-PRINT
   console.log('mesh_attributes:', mesh_attributes);
   for(let i=0; i<mesh_attributes.length; i++){

      console.log('names:', mesh_attributes[i].name);
   }


   // return mesh_attributes;
   return attribs_info;
}



function Vertex_shader_resolve_attributes_out(){

   for(let i=0; i<locations.length; i++){
      
      for(let j=0; j<locations[i].attr.length; j++){

         const attrib = locations[i].attr[j];
         if(attrib.is_passing){
            attributes_out_code += `out float ${attrib.out_name};\n`;
         }
      }
   }


   // console.log('-------------------------------------------------------\nResolver: Attributes Out:\n', attributes_out_code);
}



function Vertex_shader_resolve_attributes_out_assignment(){

   for(let i=0; i<locations.length; i++){
      
      for(let j=0; j<locations[i].attr.length; j++){

         const attrib = locations[i].attr[j];
         if(attrib.is_occupied && !attrib.is_passing){
            attributes_assign_code += `  float ${attrib.out_name} = ${attrib.in_name};\n`;
         }
         else if(attrib.is_passing){
            attributes_assign_code += `  ${attrib.out_name} = ${attrib.in_name};\n`;
         }
      }
   }


   // console.log('-------------------------------------------------------\nResolver: Attributes Assign:\n', attributes_assign_code);
}



/**
 * Set 'DEFINES_xxxx' and then find and replace the 'DEFINES_xxxx' with code from a function
 */
export function Shaders_build_vertex_shader(sid, uniforms_info){


   const attribs_info = Vertex_shader_resolve_attributes_in(sid);
   Vertex_shader_resolve_attributes_out();
   Vertex_shader_resolve_attributes_out_assignment();

   const vs_chunks = [

      '#version 300 es',
      '// Vertex Shader',
      '#include <precision_medium>', // TODO: Let the app decide the precision

      /********************************************************************************************************/
      // Defines
      /********************************************************************************************************/
      '\n',
      ((sid.unif & SID.UNIF.SCALE2) && (uniforms_info & UNIFORM.IN_VS)) ? '#define U_SCALE 1' : '',






      /********************************************************************************************************/
      // Attributes In
      /********************************************************************************************************/
      /**
       * // TODO: We should add a step where we analyzing  the attributes sid,
       * and creating a sid with vec4 generic buffers. Here we check only the attr_generic1_vec4/vec2, attr_generic2_vec4/vec2 etc 
       */
      // (sid.attr & SID.ATTR.COL4) ? 'in vec4 a_col;' : '',
      // (sid.attr & SID.ATTR.WPOS_TIME4) ? 'in vec4 a_wpos_time;' : '',
      // (sid.attr & (SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) ? '#include <in_attr_generic_vec4>' : '',
      // // (sid.attr & SID.ATTR.GLOW_INTENSITY) ? 'out float v_glow_intensity;' : '',
      // (sid.attr & SID.ATTR.POS2) ? 'in vec2 a_pos;' : '',
      // (sid.attr & SID.ATTR.DIM2) ? 'in vec2 a_dim;' : '',
      // (sid.attr & SID.ATTR.TEX2) ? 'in vec2 a_tex;' : '',
      // (sid.attr & SID.ATTR.SDF) ? '#include <in_attr_sdf2>' : '',
      // // (_attribs_generic1_vec4.attr1.is_occupied) ? : '',

      attributes_in_code,
      '\n',





      /********************************************************************************************************/
      // UNIFORMS
      /********************************************************************************************************/
      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_VS),
      '\n',






      /********************************************************************************************************/
      // OUTS
      /********************************************************************************************************/
      // (sid.pass & SID.PASS.COL4) ? 'out vec4 v_col; ' : '',
      // (sid.pass & SID.PASS.DIM2) ? 'out vec2 v_dim;' : (sid.pass & SID.ATTR.DIM2) ? 'out vec2 v_dim;' :'',
      // (sid.pass & SID.PASS.WPOS2) ? 'out vec2 v_wpos;' : '',
      // (sid.pass & SID.PASS.TIME) ? '#include <out_vtime1>' : '',
      // (sid.pass & SID.PASS.RES2) ? '#include <out_vres2>' : '',
      // (sid.attr & SID.ATTR.TEX2) ? 'out vec2 v_tex_coord;' : '',
      // (sid.attr & SID.ATTR.SDF) ? '#include <out_attr_sdf2>' : '',
      // (sid.attr & SID.ATTR.BORDER) ? '#include <out_border_width>' : '',
      // (sid.attr & SID.ATTR.R_CORNERS) ? '#include <out_rCorners>' : '',
      // (sid.attr & SID.ATTR.FEATHER) ? '#include <out_border_feather>' : '',
      // (sid.attr & SID.ATTR.TIME) ? 'out float v_time;' : '',
      // (sid.attr & SID.ATTR.GLOW_INTENSITY) ? 'out float v_glow_intensity;' : '',
      attributes_out_code,
      '\n',






      /********************************************************************************************************/
      // Main Function
      /********************************************************************************************************/
      'void main(void) ',
      '{',



      /********************************************************************************************************/
      // 
      attributes_assign_code,



      /********************************************************************************************************/
      // Scale in Vertex Shader
      (sid.shad & SID.SHAD.VS_TEST1) ? '// HI FROM VS_TEST1' : '',






      /********************************************************************************************************/
      // Calculate vertex position-rotation-scale
      
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

      // '  vec2 vpos = a_pos;',
      // ((sid.unif & SID.UNIF.SCALE2) && (uniforms_info & UNIFORM.IN_VS)) ? '  vpos *= u_scale2;' : '',
      // (sid.pass & SID.PASS.WPOS2) ? '  vec2 wpos = vec2(a_wpos_time.x+ u_wposxy.x, a_wpos_time.y+u_wposxy.y);' : '  vec2 wpos = vec2(0.0, 0.0);',
      // (sid.unif & SID.UNIF.PROJECTION_MATRIX) // TODO: See if we can set the code for 'u_projection' with a flag from the 'Resolve_uniforms_from_sid()' and not have to set the SID.UNIF.PROJECTION_MATRIX manualy
      // ? '  gl_Position = u_projection * vec4(vpos.x + wpos.x, vpos.y + wpos.y, a_wpos_time.z, 1.0);' 
      // : '  gl_Position = vec4(vpos.x + a_wpos_time.x, vpos.y + a_wpos_time.y, a_wpos_time.z, 1.0);',
      
      // 'v_empty_1 *= 0.;',
      // 'v_empty_2 *= 0.;',
      // 'v_empty_3 *= 0.;',

      // 'v_wpos3_x = 0.;',
      // 'v_wpos3_y = 0.;',
      // 'v_pos2_x *= 0.;',
      // 'v_pos2_y *= 0.;',
      // true ? '  vec2 wpos = vec2(v_wpos3_x + u_wposxy.x*0., v_wpos3_y + u_wposxy.y*0.);' : '  vec2 wpos = vec2(0.0, 0.0);',
      // true ? '  vec2 wpos = vec2(v_wpos3_x + u_wposxy.x + v_empty_1, v_wpos3_y + u_wposxy.y + v_empty_2+v_empty_3);' : '  vec2 wpos = vec2(0.0, 0.0);',
      true ? '  vec2 wpos = vec2(v_wpos3_x + u_wposxy.x, v_wpos3_y + u_wposxy.y);' : '  vec2 wpos = vec2(0.0, 0.0);',
      (sid.unif & SID.UNIF.PROJECTION_MATRIX) // TODO: See if we can set the code for 'u_projection' with a flag from the 'Resolve_uniforms_from_sid()' and not have to set the SID.UNIF.PROJECTION_MATRIX manualy
      ? '  gl_Position = u_projection * vec4(v_pos2_x + wpos.x, v_pos2_y + wpos.y, v_wpos3_z, 1.0);' 
      : '  gl_Position = vec4(v_pos2_x + v_wpos3_x, v_pos2_y + v_wpos3_y, v_wpos3_z, 1.0);',






      /********************************************************************************************************/
      // ASSIGNMENTS
      // (sid.pass & SID.PASS.COL4) ? (sid.attr & SID.ATTR.COL4 ? '  v_col = a_col;' : (sid.unif & SID.UNIF.COL4) ? '  v_col = u_col4;' : '') : '', 
      // (sid.pass & SID.PASS.DIM2) ? '  v_dim = a_dim;' : (sid.pass & SID.ATTR.DIM2) ? '  v_dim = a_dim;' : '', // TODO: If we have created an attribute a_dim, we have to use it, else the attribs buffering is gonna be wrong
      // (sid.pass & (SID.PASS.WPOS2|SID.UNIF.ROOT_WPOS2)) ? '  v_wpos = vec2(wpos.x,wpos.y);' : (sid.pass & SID.PASS.WPOS2) ? '  v_wpos = a_wpos_time.xy;' : '',
      // (sid.attr & SID.ATTR.TEX2) ? '  v_tex_coord = a_tex;' : '',
      // (sid.attr & SID.ATTR.SDF) ? '  v_sdf = a_sdf;' : '',
      // (sid.attr & SID.ATTR.BORDER) ? '  v_border = a_generic_1.x;' : '',
      // (sid.attr & SID.ATTR.R_CORNERS) ? '  v_rcorners = a_generic_1.y;' : '',
      // (sid.attr & SID.ATTR.FEATHER) ? '  v_feather = a_generic_1.z;' : '',
      // (sid.attr & SID.ATTR.GLOW_INTENSITY) ? '  v_glow_intensity = a_generic_1.w;' : '', // HACK: We assume the glow intensity attrib is together with the style attributes. Need to separate style with glow shaders, so if no style is active then the glow_intensity will be allocated at a_generic_1.x
      // (sid.attr & SID.ATTR.TIME) ? '  v_time = a_wpos_time.w;' : '',
      // (true) ? '  gl_PointSize = 10.0;' : '',
      '}',

   ];

   const vertex_shader = vs_chunks.filter( filterEmptyLine ).join( '\n' )

   const vs = Vertex_shader_includes_resolve(vertex_shader);

   if(DEBUG.SHADERS) console.info(vs)
   return {
      vs:vs, 
      attribs_info:attribs_info, 
   };
}

/** // https://www.khronos.org/opengl/wiki/Fragment_Shader
 * Fragment Shaders have the following built-in input variables.

   in vec4 gl_FragCoord;
   in bool gl_FrontFacing;
   in vec2 gl_PointCoord;

 */




function Fragment_shader_resolve_attributes_in(){

   for(let i=0; i<locations.length; i++){
      
      for(let j=0; j<locations[i].attr.length; j++){

         const attrib = locations[i].attr[j];
         if(attrib.is_passing){
            fs_attribs_in_code += `in float ${attrib.out_name};\n`;
         }
      }
   }


   // console.log('-------------------------------------------------------\nResolver: Fragment Shader Inputs:\n', fs_attribs_in_code);
}

export function Shaders_build_fragment_shader(sid, uniforms_info){

   Fragment_shader_resolve_attributes_in();

   const fs_chunks = [

      (true) ? '#version 300 es' : '',
      '// Fragment Shader',






      /********************************************************************************************************/
      // DEFINES
      '\n',
      // true ? 'layout(origin_upper_left) in vec4 frag_color;' : '',
      '#include <precision_medium>',
      '#include <out_frag_color>',
      // ((sid.unif & SID.UNIF.SCALE2) && (uniforms_info & UNIFORM.IN_FS)) ? '#define U_SCALE 1' : '',
      (sid.unif & SID.UNIF.SCALE2) ? '#define U_SCALE 1' : '',
      (sid.fx & SID.FX.FS_GLOW_VEC3) ? '#define U_GLOW_PARAMS_VEC3 1' : '', // NOTE: It is easier for uniforms specific to a shader not have a specific unif name for each uniform, rather use the sid.fx to #define all uniforms for that shader
      (sid.fx & SID.FX.FS_GLOW_VEC2) ? '#define U_GLOW_PARAMS_VEC2 1' : '', // NOTE: It is easier for uniforms specific to a shader not have a specific unif name for each uniform, rather use the sid.fx to #define all uniforms for that shader
      (sid.fx & SID.FX.FS_NOISE) ? '#define U_NOISE_PARAMS 1' : '', 
      (sid.attr & SID.ATTR.GLOW_INTENSITY) ? '#define A_GLOW_INTENSITY_FLOAT' : '',
      // (sid.unif & SID.UNIF.UNIF_SPEED) ? '#define U_SPEED 1' : '',






      /********************************************************************************************************/
      // In
      '\n',
      // (sid.pass & SID.PASS.COL4) ? '#include <in_frag_col4>' : '',
      // (sid.pass & SID.PASS.DIM2) ? '#include <in_frag_dim2>'   : '',
      // (sid.pass & SID.PASS.WPOS2) ? '#include <in_frag_wpos2>' : '',
      // (sid.attr & SID.ATTR.TEX2) ? '#include <in_frag_tex2>' : '',
      // (sid.attr & SID.ATTR.BORDER) ? '#include <in_frag_border_width>' : '',
      // (sid.attr & SID.ATTR.R_CORNERS) ? '#include <in_frag_rCorners>' : '',
      // (sid.attr & SID.ATTR.FEATHER) ? '#include <in_frag_border_feather>' : '',
      // (sid.attr & SID.ATTR.SDF) ? '#include <in_frag_sdf2>' : '',
      // (sid.attr & SID.ATTR.TIME) ? 'in float v_time;' : '',
      // (sid.attr & SID.ATTR.GLOW_INTENSITY) ? 'in float v_glow_intensity;' : '',
      fs_attribs_in_code,






      /********************************************************************************************************/
      // UNIFORMS
      '\n',
      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_FS),
      (sid.attr & SID.ATTR.TEX2) ? '#include <frag_u_sampler0>' : '',






      /********************************************************************************************************/
      // Function definitions
      '\n',
      (sid.attr & (SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) ? frag_round_corners : '',
      (sid.attr & SID.ATTR.SDF) ? frag_sdf : '',
      (sid.attr & SID.ATTR.MSDF) ? frag_msdf : '',






      /********************************************************************************************************/
      // Fx shader functions
      (sid.fx & (SID.FX.FS_GLOW_VEC3|SID.FX.FS_GLOW_VEC2)) ? frag_glow : '',
      (sid.fx & SID.FX.FS_NOISE) ? frag_noise : '',
      (sid.fx & SID.FX.FS_SMOKE) ? frag_smoke : '',






      /********************************************************************************************************/
      // Test shader functions
      (sid.shad & SID.SHAD.FS_TEST1) ? frag_test1 : '',






      /********************************************************************************************************/
      // Main
      true ? 'void main(void) ' : '',
      '{',
      // true ? '#include <frag_color_create>' : '', // Creates the variable 'color' of the fragment shader color output.
      '  vec4 color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);',
      // '  color = vec4(1.);',
      (sid.attr & (SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) ? frag_round_corners_call : '', // TODO: Check either for .STYLE or .BORDER|.FEATHER|.RCORNERS
      (sid.fx & (SID.FX.FS_GLOW_VEC3|SID.FX.FS_GLOW_VEC2)) ? '  float alpha = color.a;' : '',
      (sid.fx & (SID.FX.FS_GLOW_VEC3|SID.FX.FS_GLOW_VEC2)) ? frag_glow_call : '',
      (sid.fx & SID.FX.FS_NOISE) ? frag_noise_call : '',
      (sid.fx & SID.FX.FS_SMOKE) ? frag_smoke_call : '',
      (sid.attr & SID.ATTR.TEX2 ) ? (sid.attr & SID.ATTR.SDF) ? frag_sdf_call : (sid.attr & SID.ATTR.MSDF) ? frag_msdf_call : frag_tex : '', 
      // (sid.shad & SID.SHAD.FS_TEST1) ? frag_test1_call : '',






      /********************************************************************************************************/
      // Color fragment
      '  frag_color = color;',
      (sid.shad & SID.SHAD.PRE_MULTIPLIED_ALPHA) ? '  frag_color.rgb *= v_col.a; ' : '',
      // true ? '  frag_color.rgb *= color.a;' : '',






      /********************************************************************************************************/
      // TESTS
      // (sid.unif & SID.UNIF.SCALE2) ? '  if(u_scale2.x == 0.) ;' : '', // HACK: prevent optimizer from removing the uniform u_scale2
      (sid.unif & SID.UNIF.TIME) ? '  if(u_time == 0.) ;' : '',
      // (sid.unif & SID.UNIF.TIME) ? '  frag_color.xyz *= u_time;' : '',
      // (sid.unif & SID.UNIF.SCALE2) ? '  frag_color.xyz *= u_scale2.x;' : '',
      // true ? 'frag_color = vec4(1.);' : '',
      
      true ? '}' : '',
      
   ];

   const fragment_shader = fs_chunks.filter( filterEmptyLine ).join( '\n' )

   const fs = Fragment_shader_includes_resolve(fragment_shader);


   // Reset for the next Shader Program build
   locations = null;
   attributes_in_code = '';
   attributes_out_code = '';
   attributes_assign_code = '';
   fs_attribs_in_code = '';
   mesh_attributes = [];


   if(DEBUG.SHADERS) console.info(fs);
   return fs;
}


