// https://computergraphics.stackexchange.com/questions/100/sharing-code-between-multiple-glsl-shaders


import { shader_chunks } from './ShaderChunks/ShaderChunks.js'
import { frag_round_corners, frag_round_corners_call, frag_style_call, frag_style_corners } from './Functions/fragment.roundcorners.js'
import { frag_msdf, frag_msdf_call, frag_sdf, frag_sdf_call, frag_tex } from './Functions/fragment.texture.js'
import { frag_glow, frag_glow_call } from './Functions/fragment.glow.js';
import { frag_noise, frag_noise_2, frag_noise_2_call, frag_noise_call } from './Functions/fragment.noise.js';
import { frag_smoke, frag_smoke_call } from './Functions/fragment.smoke.js';
import { frag_test1, frag_test1_call, frag_test2, frag_test2_call, frag_test3, frag_test3_call, frag_test4, frag_test4_call, frag_test5_bubble, frag_test5_bubble_call } from './Functions/fragment.tests.js';
import { Shader_attributes_create } from '../../ShaderAttributes.js';
import { frag_explosion_circle, frag_explosion_circle_call, frag_explosion_glow, frag_explosion_glow_call, frag_glow_sphere, frag_glow_sphere_call, frag_inner_shadow_rhomboid, frag_inner_shadow_rhomboid_call } from './Functions/fragment.misc.js';
import { Attribute_get_type_extension, Shader_Attributes, Shader_bit_flags_get_attr_info_from_index, Shader_bit_flags_get_attr_key_name_from_flag, Shader_bit_flags_get_attr_size } from '../../ShaderBitFlags.js';
import { frag_noise_voronoi_1, frag_noise_voronoi_1_call, frag_noise_voronoi_2, frag_noise_voronoi_2_call } from './Functions/fragment.noise_voronoi.js';
import { frag_noise_worley_1, frag_noise_worley_1_call, frag_noise_worley_2, frag_noise_worley_2_call, frag_noise_worley_3_types, frag_noise_worley_3_types_call, frag_noise_worley_3D, frag_noise_worley_3D_call } from './Functions/fragment.noise_worley.js';
import { shader_operations } from './ShaderChunks/ShaderOperations.js';





let ID = 0;


// Resolve Includes to build the correct shaders
const pattern_includes = /^[ \t]*#include +<([\w\d./]+)>/gm;


function Shader_includes_replace(matchPattern, key) {
   const string = shader_chunks[key];
   if (string === undefined) { throw new Error('Can not resolve #include <' + key + '> in Vertex Shader'); }
   return Shader_includes_resolve(string);
}



function Shader_includes_resolve(string) {
   return string.replace(pattern_includes, Shader_includes_replace);
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


   // uniforms_code += '\n// ---------- UNIFORMS ----------\n';
   for (let i = 0; i < len; i++) {
      if ((_uniforms_info[i].shader & UNIFORM.IN_VS && (which_shader & UNIFORM.IN_VS))) {

         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name};\n`;
         if(DEBUG.SHADERS) console.log('<<<<<<<<<<<<<<< VERTEX SHADER UNIFORM ENABLE:', _uniforms_info[i].name)
      }
      else if ((_uniforms_info[i].shader & UNIFORM.IN_FS) && (which_shader & UNIFORM.IN_FS)) {

         // if(_uniforms_info[i].name === 'u_generic_controls') continue;
         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         const arr_extra = (_uniforms_info[i].type === UNIF_TYPE.FARR) ? `[${_uniforms_info[i].arr_size}]` : '';
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name}${arr_extra};\n`;
         if(DEBUG.SHADERS) console.log('<<<<<<<<<<<<<<< FRAGMENT SHADER UNIFORM ENABLE:', _uniforms_info[i].name)
      }
   }

   return uniforms_code;

   // Extension: For lights
}

/**
 * Construct a function with a switch that resolves the blendin function name
 * 
 */
function Resolve_blending_mode(blend_mode) {

   /**
      blend_color_add
      blend_color_subtract
      blend_color_multiply
      blend_color_divide
      blend_color_lighten
      blend_color_darken
      blend_color_burn
      blend_color_dodge
      blend_color_mix
      blend_color_screen
      blend_color_overlay
      blend_color_mask
      blend_color_alpha 
   */

   switch(blend_mode) {
      case SID.BLEND_OPTIONS.BLEND_MODE_ADD: { return 'blend_color_add'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_LIGHTEN: { return 'blend_color_lighten'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY: { return 'blend_color_multiply'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_DIVIDE: { return 'blend_color_divide'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT: { return 'blend_color_subtract'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_DARKEN: { return 'blend_color_darken'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_COLOR_BURN: { return 'blend_color_burn'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_COLOR_DODGE: { return 'blend_color_dodge'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_SCREEN: { return 'blend_color_screen'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_OVERLAY: { return 'blend_color_overlay'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_MIX: { return 'blend_color_mix'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_MASK: { return 'blend_color_mask'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_ALPHA: { return 'blend_color_alpha'; };
      case SID.BLEND_OPTIONS.BLEND_MODE_REMOVE_B_FROM_A: { return 'blend_color_remove_b_from_a'; };
   }
}


// TODO: Abstarct function to another file
function Find_field_by_name(file, word, at_line=0, start_from=0) {

	const wordpos = { start: -1, end: -1, len: 0, line: -1 };
	const wordlen = word.length;
	
	let line = at_line;
	let i = start_from;
	
	const filelen = file.length;
	while (i <= filelen) {

		let k = 0;
		if (file[i] == '\n') line++;

		if (file[i] == word[k]) {

			wordpos.start = i;
			wordpos.len = 0;
			i++; k++;

			while (file[i] == word[k]) {

				wordpos.len++;
				if (k >= wordlen - 1) {
					wordpos.line = line;
					wordpos.len++;
					wordpos.end = i + 1;
					return wordpos;
				}
				i++; k++;
			}
		}
		i++;
	}
	return wordpos;
}



// Uniform names are passed by the Program class constructor
function Resolve_generic_uniforms_names(shader_code, uniform_name) {

   
   const buffer = [];
   
   const word = uniform_name;
   const filelen = shader_code.length;
   
   let i = 0;
   
   let wordpos = { start: -1, end: -1, len: 0, line: -1 };
   
   
   // let i = word_position.start;
   while(i < filelen) {
      
      let skip = false;
      wordpos = Find_field_by_name(shader_code, word, wordpos.line, wordpos.start);
      const from_where_it_left_off = wordpos.end;

      if(from_where_it_left_off === -1) break;

      i = wordpos.start;

      /**
       * SAMPLE code
       * 1. uniform float u_generic_controls[3];
       * 2. float ${u}glow_smoothstep_inner = u_generic_controls[u_gen_ctrl_map_cnt++];
       */
      // If word found, go to start of the line
      while((shader_code[i] !== '\n' && shader_code[i] !== ';') && i > 0) i--;
      

      if(i > 0) i++; // Skip the '\n' || ';' characters. Also includes the edge case of the uniform being the first line of code in the shader and has no '\n': 'float glow = u_generic_controls' 
      
      // If word found, go to start of the line
      while(shader_code[i] === ' ' || shader_code[i] === '\n' && i < filelen) i++; // Skip any number of spaces till the next word
      if(shader_code[i] === '/') skip = true; // Avoid any commented code
      
      if(!skip) {

         const struct = { type: '', name: '', };
         
         // Get the type of the uniform
         while (shader_code[i] !== ' ' && i < filelen) {
            struct.type += shader_code[i];
            i++;
         }
         
         // Get the name of the uniform
         while(shader_code[i] === ' ' && i < filelen) i++; // Skip any number of spaces till the next word
         
         // Here we check for the special character that is ought to precede uniform variables that need to be collected
         // This way we collect only the uniform variables of the uniform buffer elements and not for example the line of code that declares the uniform buffer.
         if(shader_code[i] !== u) {
            skip = true;
         }

         // Skip special character. We rather not name a slider with the special character
         i++;

         while (shader_code[i] !== ' ' && i < filelen) {
            struct.name += shader_code[i];
            i++;
         }
      
         if(!skip) buffer.push(struct);
      }

      wordpos.start = from_where_it_left_off;

   }

  
   if(DEBUG.SHADERS) console.log('uniform names in shader', buffer);
   return buffer;

}

function Resolve_generic_uniforms_count(shader_code) {

   /**
    * // TODO: In search also include:
    * The name for the uniform
    * Store the name of the shader operation
    * Extract an initial value for the uniform(AN INIT VAL MUST BE SET IN THE SHADER CODE)
    * 
    * // IMPORTANT: These operation must happen before shader-load, so that the uniform-enable can pass the count of the total generic uniforms
    */

   const word = 'u_generic_controls';
   let uniform_count = 0;


   // const file_size = shader_code.length;
   let word_position = Find_field_by_name(shader_code, word, 0, 0);
   
   if(DEBUG.SHADERS) console.log(word_position);
   if(DEBUG.SHADERS) for(let i=word_position.start; i<word_position.start+word_position.len; i++) console.log(shader_code[i]);
   
   
   
   let file_completed = word_position.len; // Break if the returned word len is 0
   while(file_completed) {
      
      uniform_count++;
      word_position = Find_field_by_name(shader_code, word, word_position.line, word_position.end );
      if(DEBUG.SHADERS) console.log(word_position);
      if(DEBUG.SHADERS) for(let i=word_position.start; i<word_position.start+word_position.len; i++) console.log(shader_code[i]);

      file_completed = word_position.len; // Break if the returned word len is 0
   }

   if(DEBUG.SHADERS) console.log('uniform_count', uniform_count);

   return uniform_count;
}

function Resolve_function_operations_called_from_main(shader_ops=null) {
   
   /*
   Be aware the first operation in the main function of the fragment,
   since the blend function will be used to assign to the 'color' variable 
   */
  
  let shader_ops_code = '';

   if(shader_ops === null) return shader_ops_code;

   const len = shader_ops.length;

   for (let i = 0; i < len; i++) {

      const fn_op = shader_ops[i].fn_op;
      const blend_mode = shader_ops[i].blend_mode;


      if(fn_op & SID.SHADER_OPERATIONS.SIMPLE_GLOW){

         shader_ops_code += shader_operations.fs_op_simple_glow;
         if(i===0) shader_ops_code += `   final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, simple_glow_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, simple_glow_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.DIST_RECT_FILLED){

         shader_ops_code += shader_operations.fs_op_distance_rect_filled;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, distance_rect_filled_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, distance_rect_filled_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.SIMPLE_GLOW2){

         shader_ops_code += shader_operations.fs_op_simple_glow2;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, simple_glow2_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, simple_glow2_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT){

         shader_ops_code += shader_operations.fs_op_simple_glow2_rect;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, simple_glow2_rect_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, simple_glow2_rect_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.BUBBLE){

         shader_ops_code += shader_operations.fs_op_bubble;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, bubble_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, bubble_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.FLARE){

         shader_ops_code += shader_operations.fs_op_flare;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, flare_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, flare_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE){
         
         shader_ops_code += shader_operations.fs_op_inner_shadow_circle;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, inner_shadow_circle_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, inner_shadow_circle_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE){
         
         shader_ops_code += shader_operations.fs_op_inner_specular_circle;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, inner_specular_circle_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, inner_specular_circle_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2){

         shader_ops_code += shader_operations.fs_op_inner_shadow_rect_filled;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, inner_shadow_rect_filled_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, inner_shadow_rect_filled_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT){

         shader_ops_code += shader_operations.fs_op_outer_shadow_rect;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, sdf_rect_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, sdf_rect_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.SDF_RECT){

         shader_ops_code += shader_operations.fs_op_sdf_rect;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, sdf_rect_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, sdf_rect_color );`;
      }
      else if(fn_op & SID.SHADER_OPERATIONS.OUTER_GLOW_RECT){

         shader_ops_code += shader_operations.fs_op_outer_glow_rect;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, outer_glow_rect_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, outer_glow_rect_color );`;
         // Resolve_generic_uniforms_count(shader_operations.fs_op_outer_glow_rect);
      }
      else if(fn_op & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT){

         shader_ops_code += shader_operations.fs_op_inner_shadow_rect;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, inner_shadow_rect_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, inner_shadow_rect_color );`;
      }
      // Test Copies
      else if(fn_op & SID.SHADER_OPERATIONS.SDF_RECT_TEST_WITH_GENERIC_SLIDERS){

         shader_ops_code += shader_operations.fs_op_sdf_rect_test_with_generic_sliders;
         if(i===0) shader_ops_code += `  final_color = ${Resolve_blending_mode(SID.BLEND_OPTIONS.BLEND_MODE_ADD)}( final_color, sdf_rect_color );`;
         else shader_ops_code += `  final_color = ${Resolve_blending_mode(blend_mode)}( final_color, sdf_rect_color );`;
      }

   }

   return shader_ops_code;

}




/**********************************************************************************************************************************************/
/**********************************************************************************************************************************************/
// Shader Attributes Builder 



const attribs_xyzw = ['x', 'y', 'z', 'w'];
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
      this.attrib_flag = 0x0;
   }
};

const attribs_info = { mesh_attribs: [], attribs_loc: [] };
/**************************************************************************/





function Create_new_attrib_location(loc, loc_idx) {

   if (loc_idx > 4)
      console.error('8144325 \nloc_idx excceding max')

   if (loc_idx >= 0 && loc[loc_idx].is_active) {
      attributes_in_code += `in vec4 a_generic_${loc_idx};\n`;
   }

   loc_idx++;
   loc[loc_idx].name = `a_generic_${loc_idx}`;
   loc[loc_idx].is_active = true;

   return loc_idx;
}



function Create_attribute(name, extension, location_name, attr_idx, sid = 0x0, attrib_flag=0x0) {

   const pass_to_fs = sid.pass & attrib_flag;

   const o = {
      is_occupied: true,
      is_passing: pass_to_fs, // Is this attrib passing to the fragment shader 
      name: name,
      out_name: `v_${name}${extension}`,
      in_name: `${location_name}.${attribs_xyzw[attr_idx]}`,
      // extra: '',
   };

   return o;
}



export function Shader_builder_create_attribs_info(sid) {

   const assign_new_loc = (loc, loc_idx)=>   {
      if (loc_idx > 4)
         console.error('8144325 \nloc_idx excceding max')
   
      loc_idx++;
      loc[loc_idx].name = `a_generic_${loc_idx}`;
      loc[loc_idx].is_active = true;
   
      return loc_idx;
   }

   const create_attribute = (name, extension, location_name, attr_idx, sid = 0x0, attrib_flag=0x0)=> {

      const pass_to_fs = sid.pass & attrib_flag;
   
      const a = {
         is_occupied: true,
         is_passing: pass_to_fs, // Is this attrib passing to the fragment shader 
         name: name,
         out_name: `v_${name}${extension}`,
         in_name: `${location_name}.${attribs_xyzw[attr_idx]}`,
         // extra: '',
      };
   
      return a;
   }

   const loc = [
      {
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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


   const attribs_info_m = { mesh_attribs: [], attribs_loc: [] };


   const prog_attribs_indexing = new Shader_Attributes(true, INT_NULL); // Specific to gl Program. Store the connection of shader attrib location to the SID flag(E.x. .COL4:loc=2)
   let attribs_idx = 0;
   let loc_idx = -1;
   let vec_idx = 0;

   
   loc_idx = assign_new_loc(loc, loc_idx, sid.inst); vec_idx = 0;

   
   loc[loc_idx].attrib_data_on_different_vb = false;
   loc[loc_idx].is_instanced_buffer = true;


   //
   const attributes_len = Shader_bit_flags_get_attr_size();
   for (let i = 0; i < attributes_len; i++) {

      const attr_info = Shader_bit_flags_get_attr_info_from_index(i);
      if ((sid.attr & attr_info.FLAG && (sid.inst & attr_info.FLAG)) && (attr_info.FLAG & SID.ATTR.MSDF)===0) {

         const attr_flag = attr_info.FLAG;
         const attr_name = attr_info.ATTR_NAME;
         const attr_type = attr_info.TYPE;
         const attr_type_size = attr_info.TYPE_SIZE;


         // TODO: Look if the attrib_flag or any other info is already accessible from the ShaderBitFlags file for efficiency
         const mesh_attribute = new Mesh_attribute();
         mesh_attribute.name = attr_name;
         mesh_attribute.attrib_flag |= attr_flag;
         mesh_attribute.type = attr_type;
         mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc)
         
         // Run for type size
         for (let j = 0; j < attr_type_size; j++) {
            const ext = (attr_type_size > 1) ? `_${Attribute_get_type_extension(j)}` : ''; // Get the extension [.x, .y, .z, .w]
            
            const vshader_attr_name = attr_name
            
            if (vec_idx >= max_val_in_loc) {
               loc_idx = Create_new_attrib_location(loc, loc_idx, sid.inst); vec_idx = 0;
               loc[loc_idx].is_instanced_buffer = true;
            }

            
            // HACK: TODO: Should the pass attributes be set by the user on root mesh creation? 
            loc[loc_idx].attr[vec_idx] = create_attribute(vshader_attr_name, ext, loc[loc_idx].name, vec_idx, sid, attr_flag);
            
            vec_idx++;
            mesh_attribute.size++;
            
         }
         
         mesh_attribute.loc = loc_idx;
         attribs_info_m.mesh_attribs.push(mesh_attribute);

         // Enable attribute in the Program's attrib_indexing, by setting to the attribute key it's shader location index. E.x. prog_attribs_indexing.COL4 = 0 (loc)
         const obj_key = Shader_bit_flags_get_attr_key_name_from_flag(attr_flag);
         prog_attribs_indexing[obj_key] = attribs_idx++;

      }
   }

   // Case there is no Instanced buffer, we have already created the first attribute location 
   if (loc_idx !== 0) {
      loc_idx = assign_new_loc(loc, loc_idx, false);
      vec_idx = 0;
   }
   loc[loc_idx].attrib_data_on_different_vb = true;
   loc[loc_idx].is_instanced_buffer = false;



   for (let i = 0; i < attributes_len; i++) {

      const attr_info = Shader_bit_flags_get_attr_info_from_index(i);
      
      // if (sid.attr & attr_info.FLAG && (sid.inst & attr_info.FLAG) === 0 && (attr_info.FLAG & SID.ATTR.COL4_PER_VERTEX)===0) {
      if (sid.attr & attr_info.FLAG && (sid.inst & attr_info.FLAG) === 0 
         && (attr_info.FLAG & SID.ATTR.COL4_PER_VERTEX)===0
         && (attr_info.FLAG & SID.ATTR.MSDF)===0
      ) {

         const attr_flag = attr_info.FLAG;
         const attr_name = attr_info.ATTR_NAME;
         const attr_type = attr_info.TYPE;
         const attr_type_size = attr_info.TYPE_SIZE;

         // TODO: Look if the attrib_flag or any other info is already accessible from the ShaderBitFlags file for efficiency
         const mesh_attribute = new Mesh_attribute();
         mesh_attribute.name = attr_name; // console.log(attr_name)
         mesh_attribute.attrib_flag |= attr_flag;
         mesh_attribute.type = attr_type;
         mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


         // Run for type size
         for (let j = 0; j < attr_type_size; j++) {

            const ext = (attr_type_size > 1) ? `_${Attribute_get_type_extension(j)}` : ''; // Get the extension [.x, .y, .z, .w]

            const vshader_attr_name = attr_name;

            // Check for full attrib location
            if (vec_idx >= max_val_in_loc) {
               loc_idx = assign_new_loc(loc, loc_idx, sid.inst); vec_idx = 0;
               loc[loc_idx].is_instanced_buffer = false;
            }

            // HACK: TODO: Should the pass attributes be set by the user on root mesh creation? 
            loc[loc_idx].attr[vec_idx] = loc[loc_idx].attr[vec_idx] = create_attribute(vshader_attr_name, ext, loc[loc_idx].name, vec_idx, sid, attr_flag);

            
            vec_idx++;
            mesh_attribute.size++;
            
         }
         
         mesh_attribute.loc = loc_idx;
         attribs_info_m.mesh_attribs.push(mesh_attribute);
         
         // Enable attribute in the Program's attrib_indexing, by setting to the attribute key it's shader location index. E.x. prog_attribs_indexing.COL4 = 0 (loc)
         const obj_key = Shader_bit_flags_get_attr_key_name_from_flag(attr_flag);
         prog_attribs_indexing[obj_key] = attribs_idx++;
         
      }
   }

   // console.log('{{{{{{{{{{ PROGRAMS LOC INDEXING }}}}}}}}}}\n  prog_attribs_indexing', prog_attribs_indexing);

   locations = loc;

   if (vec_idx === 1) {
      loc[loc_idx].attr[0].in_name = `${loc[loc_idx].name}`
   }


   // Create the generic attribute locations info
   let offset = 0;
   let devisor = 0;
   let size = 0;
   for (let i = 0; i < locations.length; i++) {

      if (locations[i].is_active) {

         offset += size;
         size = 0;

         // FIX HERE: For the generic location where the instanced buffer begins, we need to reset the offset to 0.
         for (let j = 0; j < locations[i].attr.length; j++) {
            if (locations[i].attr[j].is_occupied) size++;
         }

         if (loc[i].is_instanced_buffer === true) devisor = 1;
         else devisor = 0;
         if (loc[i].attrib_data_on_different_vb === true)
            offset = 0;

         attribs_info_m.attribs_loc.push({
            locs: i,
            sizes: size,
            offsets: offset,
            devisor: devisor,
         });
      }
   }



   // DEBUG-PRINT
   if(DEBUG.SHADERS) console.log('{{{{{{{{{{ PROGRAMS ATTRIBUTES }}}}}}}}}}', '\n attribs_info_m', attribs_info_m, '\n attribs_indexing', prog_attribs_indexing.PrintEnabled())
   // console.log('{{{{{{{{{{ PROGRAMS LOC INDEXING }}}}}}}}}}\n  prog_attribs_indexing', prog_attribs_indexing);

   return {
      attribs_info_m: attribs_info_m,
      attribs_indexing: prog_attribs_indexing,
   }


}
function Vertex_shader_resolve_attributes_in(sid) {

   attributes_in_code += ''

   const loc = [
      {
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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
         attrib_data_on_different_vb: false,
         is_instanced_buffer: false,
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


   const prog_attribs_indexing = new Shader_Attributes(true, INT_NULL); // Specific to gl Program. Store the connection of shader attrib location to the SID flag(E.x. .COL4:loc=2)
   let attribs_idx = 0;
   let loc_idx = -1;
   let vec_idx = 0;


   loc_idx = Create_new_attrib_location(loc, loc_idx, sid.inst); vec_idx = 0;
   loc[loc_idx].attrib_data_on_different_vb = false;
   loc[loc_idx].is_instanced_buffer = true;

   if(DEBUG.SHADERS) console.log('----------------------------------------------------------------------------------------------------------------------------------------------')

   // TODO: Create separate for for constructing the pass attribute in_name and out_name
   /**
    * ISSUE: We need to pass the x and y fields of the the wpos3 attribute,
    *  but the code gets complicated, so it will be nice to have a separate loop for the passes,
    * so that we can get the  attr_info for pass attributes specificaly 
    * if (sid.pass & attr_info.FLAG)
   */

   //
   const attributes_len = Shader_bit_flags_get_attr_size();
   for (let i = 0; i < attributes_len; i++) {

      const attr_info = Shader_bit_flags_get_attr_info_from_index(i);
      if ((sid.attr & attr_info.FLAG && (sid.inst & attr_info.FLAG)) && (attr_info.FLAG & SID.ATTR.MSDF)===0) {

         const attr_flag = attr_info.FLAG;
         const attr_name = attr_info.ATTR_NAME;
         const attr_type = attr_info.TYPE;
         const attr_type_size = attr_info.TYPE_SIZE;


         // TODO: Look if the attrib_flag or any other info is already accessible from the ShaderBitFlags file for efficiency
         const mesh_attribute = new Mesh_attribute();
         mesh_attribute.name = attr_name;
         mesh_attribute.attrib_flag |= attr_flag;
         mesh_attribute.type = attr_type;
         mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc)
         
         // Run for type size
         for (let j = 0; j < attr_type_size; j++) {
            const ext = (attr_type_size > 1) ? `_${Attribute_get_type_extension(j)}` : ''; // Get the extension [.x, .y, .z, .w]
            
            const vshader_attr_name = attr_name
            
            if (vec_idx >= max_val_in_loc) {
               loc_idx = Create_new_attrib_location(loc, loc_idx, sid.inst); vec_idx = 0;
               loc[loc_idx].is_instanced_buffer = true;
            }

            
            // HACK: TODO: Should the pass attributes be set by the user on root mesh creation? 
            loc[loc_idx].attr[vec_idx] = Create_attribute(vshader_attr_name, ext, loc[loc_idx].name, vec_idx, sid, attr_flag);
            
            vec_idx++;
            mesh_attribute.size++;
            
         }
         
         mesh_attribute.loc = loc_idx;
         attribs_info.mesh_attribs.push(mesh_attribute);

         // Enable attribute in the Program's attrib_indexing, by setting to the attribute key it's shader location index. E.x. prog_attribs_indexing.COL4 = 0 (loc)
         const obj_key = Shader_bit_flags_get_attr_key_name_from_flag(attr_flag);
         prog_attribs_indexing[obj_key] = attribs_idx++;

      }
   }

   // Case there is no Instanced buffer, we have already created the first attribute location 
   if (loc_idx !== 0) {
      loc_idx = Create_new_attrib_location(loc, loc_idx, false);
      vec_idx = 0;
   }
   loc[loc_idx].attrib_data_on_different_vb = true;
   loc[loc_idx].is_instanced_buffer = false;



   for (let i = 0; i < attributes_len; i++) {

      const attr_info = Shader_bit_flags_get_attr_info_from_index(i);
      
      // if (sid.attr & attr_info.FLAG && (sid.inst & attr_info.FLAG) === 0 && (attr_info.FLAG & SID.ATTR.COL4_PER_VERTEX)===0) {
      if (sid.attr & attr_info.FLAG && (sid.inst & attr_info.FLAG) === 0 
         && (attr_info.FLAG & SID.ATTR.COL4_PER_VERTEX)===0
         && (attr_info.FLAG & SID.ATTR.MSDF)===0
      ) {

         const attr_flag = attr_info.FLAG;
         const attr_name = attr_info.ATTR_NAME;
         const attr_type = attr_info.TYPE;
         const attr_type_size = attr_info.TYPE_SIZE;

         // TODO: Look if the attrib_flag or any other info is already accessible from the ShaderBitFlags file for efficiency
         const mesh_attribute = new Mesh_attribute();
         mesh_attribute.name = attr_name; // console.log(attr_name)
         mesh_attribute.attrib_flag |= attr_flag;
         mesh_attribute.type = attr_type;
         mesh_attribute.offset = vec_idx + (loc_idx * max_val_in_loc);


         // Run for type size
         for (let j = 0; j < attr_type_size; j++) {

            const ext = (attr_type_size > 1) ? `_${Attribute_get_type_extension(j)}` : ''; // Get the extension [.x, .y, .z, .w]

            const vshader_attr_name = attr_name;

            // Check for full attrib location
            if (vec_idx >= max_val_in_loc) {
               loc_idx = Create_new_attrib_location(loc, loc_idx, sid.inst); vec_idx = 0;
               loc[loc_idx].is_instanced_buffer = false;
            }

            // HACK: TODO: Should the pass attributes be set by the user on root mesh creation? 
            loc[loc_idx].attr[vec_idx] = loc[loc_idx].attr[vec_idx] = Create_attribute(vshader_attr_name, ext, loc[loc_idx].name, vec_idx, sid, attr_flag);

            
            vec_idx++;
            mesh_attribute.size++;
            
         }
         
         mesh_attribute.loc = loc_idx;
         attribs_info.mesh_attribs.push(mesh_attribute);
         
         // Enable attribute in the Program's attrib_indexing, by setting to the attribute key it's shader location index. E.x. prog_attribs_indexing.COL4 = 0 (loc)
         const obj_key = Shader_bit_flags_get_attr_key_name_from_flag(attr_flag);
         prog_attribs_indexing[obj_key] = attribs_idx++;
         
      }
   }

   // console.log('{{{{{{{{{{ PROGRAMS LOC INDEXING }}}}}}}}}}\n  prog_attribs_indexing', prog_attribs_indexing);

   locations = loc;

   if (vec_idx === 1) {
      attributes_in_code += `in float a_generic_${loc_idx};\n`;
      loc[loc_idx].attr[0].in_name = `${loc[loc_idx].name}`
   }
   else attributes_in_code += `in vec${vec_idx} a_generic_${loc_idx};\n`;


   // Create the generic attribute locations info
   let offset = 0;
   let devisor = 0;
   let size = 0;
   for (let i = 0; i < locations.length; i++) {

      if (locations[i].is_active) {

         offset += size;
         size = 0;

         // FIX HERE: For the generic location where the instanced buffer begins, we need to reset the offset to 0.
         for (let j = 0; j < locations[i].attr.length; j++) {
            if (locations[i].attr[j].is_occupied) size++;
         }

         if (loc[i].is_instanced_buffer === true) devisor = 1;
         else devisor = 0;
         if (loc[i].attrib_data_on_different_vb === true)
            offset = 0;

         attribs_info.attribs_loc.push({
            locs: i,
            sizes: size,
            offsets: offset,
            devisor: devisor,
         });
      }
   }



   // DEBUG-PRINT
   if(DEBUG.SHADERS) console.log('{{{{{{{{{{ PROGRAMS ATTRIBUTES }}}}}}}}}}', '\n attribs_info', attribs_info, '\n attribs_indexing', prog_attribs_indexing.PrintEnabled())
   // console.log('{{{{{{{{{{ PROGRAMS LOC INDEXING }}}}}}}}}}\n  prog_attribs_indexing', prog_attribs_indexing);

   return {
      attribs_info: attribs_info,
      attribs_indexing: prog_attribs_indexing,
   }


}



function Vertex_shader_resolve_attributes_out() {

   for (let i = 0; i < locations.length; i++) {

      for (let j = 0; j < locations[i].attr.length; j++) {

         const attrib = locations[i].attr[j];
         if (attrib.is_passing) {
            attributes_out_code += `out float ${attrib.out_name};\n`;

            // console.log('Vertex Shader outs: ', attrib.out_name)
         }
      }
   }

}



function Vertex_shader_resolve_attributes_out_assignment() {

   for (let i = 0; i < locations.length; i++) {

      for (let j = 0; j < locations[i].attr.length; j++) {

         const attrib = locations[i].attr[j];

         if (attrib.is_occupied) {
            if (attrib.is_passing) { // Case the attribute is passing the the next shader, has already been declared.
               // attributes_assign_code += `  ${attrib.out_name} = ${attrib.in_name} ${attrib.extra};\n`;
               attributes_assign_code += `  ${attrib.out_name} = ${attrib.in_name};\n`;
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
      '#version 300 es',
      
      '/********************************************************************************************/',
      '/********************************************************************************************/',
      `// VERTEX SHADER {{ PROGRAM:${ID} }}`,
      '/********************************************************************************************/',
      '/********************************************************************************************/',

      '#include <precision_high>\n',

      /********************************************************************************************************/
      // Defines
      '\n// DIRECTIVES',
      '#define PI 3.14159',
      ((sid.unif & SID.UNIF.U_SCALE_VEC2) && (uniforms_info & UNIFORM.IN_VS)) ? '#define U_SCALE_VEC2 1' : '',
      (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? '#define U_SCREEN_RESOLUTION 1' : '',



      /********************************************************************************************************/
      // UNIFORMS
      '\n// UNIFORMS',
      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_VS),



      /********************************************************************************************************/
      // Attributes In
      /********************************************************************************************************/
      '\n// INPUT',
      attributes_in_code,



      /********************************************************************************************************/
      // OUTS
      /********************************************************************************************************/
      '\n// OUTPUT',
      attributes_out_code,




      /********************************************************************************************************/
      // Main Function
      /********************************************************************************************************/
      'void main(void) ',
      '{',



      /********************************************************************************************************/
      // Assignments
      '  // Assignments',
      attributes_assign_code,
      (sid.unif & SID.UNIF.ROOT_WPOS2) ? 
      `  v_wpos3_x += u_wposxy.x;
  v_wpos3_y += u_wposxy.y;
  
` : '',



      /********************************************************************************************************/
      // Scale in Vertex Shader



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

      
      '   vec4 position = u_projection * vec4(v_pos2_x + v_wpos3_x, v_pos2_y + v_wpos3_y, v_wpos3_z, 1.0);',
      // (sid.unif & SID.UNIF.PROJECTION_MATRIX) // TODO: See if we can set the code for 'u_projection' with a flag from the 'Resolve_uniforms_from_sid()' and not have to set the SID.UNIF.PROJECTION_MATRIX manualy
      //    ? '   vec4 position = u_projection * vec4(v_pos2_x + v_wpos3_x, v_pos2_y + v_wpos3_y, v_wpos3_z, 1.0);'
      //    : '   vec4 position = vec4(v_pos2_x + v_wpos3_x, v_pos2_y + v_wpos3_y, v_wpos3_z, 1.0);',

      '   gl_Position = position;',

      '}',

   ];

   const vertex_shader = vs_chunks.filter(filterEmptyLine).join('\n')

   const vs = Shader_includes_resolve(vertex_shader);

   const attribsidx = Shader_attributes_create(ret.attribs_info);

   console.info(vs)
   return {
      vs: vs,
      attribsidx: attribsidx,
      attribs_indexing: ret.attribs_indexing,
      code:vs_chunks,
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

export function Shaders_build_fragment_shader(sid, uniforms_info, shader_ops=null) {

   Fragment_shader_resolve_attributes_in();

   const fs_chunks = [
      '#version 300 es',
      
      '/********************************************************************************************/',
      '/********************************************************************************************/',
      `// FRAGMENT SHADER {{ PROGRAM:${ID} }}`,
      '/********************************************************************************************/',
      '/********************************************************************************************/',


      '#define PI 3.14159',
      (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? '#define U_SCREEN_RESOLUTION 1' : '',



      /********************************************************************************************************/
      // DEFINES
      '\n// ---------- DIRECTIVES ----------',
      '#include <precision_high>',

      // TODO: REMOVE  U_SMOKE_PARAMS_VEC3 U_NOISE_PARAMS and replace with generic buffer
      (sid.attr & SID.ATTR.TEX2) ? '#define A_TEX_COORD 1' : '',
      (sid.attr & SID.ATTR.TIME) ? '#define A_TIME 1' : '',
      (sid.attr & SID.ATTR.ANGLE) ? '#define A_ANGLE 1' : '',
      (sid.attr & SID.ATTR.GLOW_INTENSITY) ? '#define A_GLOW_INTENSITY_FLOAT' : '',
      
      // Include Funcions Defines
      (sid.blend_options) ? '#define BLEND_MODE 1' : '#define BLEND_MODE 1\n#define BLEND_MODE_MULTIPLY 1',  // If any 'blend_options', enable, else enable default blend 'multiply'
      (sid.blend_options) ? '#define BLEND_MODE 1' : '',  // If any 'blend_options', enable, 
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_ADD) ? '#define BLEND_MODE_ADD 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_LIGHTEN) ? '#define BLEND_MODE_LIGHTEN 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY) ? '#define BLEND_MODE_MULTIPLY 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_DIVIDE) ? '#define BLEND_MODE_DIVIDE 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT) ? '#define BLEND_MODE_SUBTRACT 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_DARKEN) ? '#define BLEND_MODE_DARKEN 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_COLOR_BURN) ? '#define BLEND_MODE_COLOR_BURN 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_COLOR_DODGE) ? '#define BLEND_MODE_COLOR_DODGE 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_SCREEN) ? '#define BLEND_MODE_SCREEN 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_OVERLAY) ? '#define BLEND_MODE_OVERLAY 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_MIX) ? '#define BLEND_MODE_MIX 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_MASK) ? '#define BLEND_MODE_MASK 1' : '',
      (sid.blend_options & SID.BLEND_OPTIONS.BLEND_MODE_ALPHA) ? '#define BLEND_MODE_ALPHA 1' : '',
      







      /********************************************************************************************************/
      // In
      '\n// ---------- INPUTS ----------',
      fs_attribs_in_code,






      /********************************************************************************************************/
      // Out
      '\n// ---------- OUTPUTS ----------',
      '#include <out_frag_color>',







      /********************************************************************************************************/
      // UNIFORMS
      '\n// ---------- UNIFORMS ----------',

      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_FS),
      (sid.attr & SID.ATTR.TEX2) ? '#include <frag_u_sampler0>' : '',

      // Generic Uniforms
      (sid.unif & SID.UNIF.U_SCALE_VEC2) ? '#define U_SCALE_VEC2 1' : '',
      (sid.unif & SID.UNIF.FS_TIME_FLOAT) ? '#define U_TIME_FLOAT 1' : '',
      (sid.unif & SID.UNIF.FS_GENERIC_CONTROLS) ? '#define U_GENERIC_CONTROLS 1' : '',







      /********************************************************************************************************/
      // Misc Functions
      '\n// ---------- FUNCTION DECLERATIONS ----------',

      '#define RED vec4(1.0, 0.0, 0.0, 1.0)',
      '#define GREEN vec4(0.0, 1.0, 0.0, 1.0)',
      '#define YELLOW vec4(1.0, 1.0, 0.0, 1.0)',
      '#define BLUE vec4(0.0, 0.0, 1.0, 1.0)',
      '#define CYAN vec4(0.0, 0.5, 1.0, 1.0)',

      'float median(float r, float g, float b) { return max(min(r, g), min(max(r, g), b)); }',
      'float median(vec3 c) { return max(min(c.r, c.g), min(max(c.r, c.g), c.b)); }',
      'float avarage(float r, float g, float b) { return (r+g+b)/3.0; }',
      'float avarage(vec3 c) { return (c.r+c.g+c.b)/3.0; }',

      '#include <coordinate_system_functions>',

      '#include <blend_mode_functions>',

      '\n#include <blend_color_functions_overloads>',

      '\n#include <blend_mode_decider>',


      '\n#include <smoothmin>',
      '\n#include <brightness_contrast>',

      // FIXME: Remove any unecessary
      ((sid.attr & SID.ATTR.BORDER) && (sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_style_corners :
         ((sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_round_corners : '',
      (sid.attr & SID.ATTR.SDF) ? frag_sdf : '',
      (sid.attr & SID.ATTR.MSDF) ? frag_msdf : '',


      /********************************************************************************************************/
      // Fx shader functions
      // (sid.fx & (SID.FX.FS_GLOW_VEC3 | SID.FX.FS_GLOW_VEC2)) ? frag_glow : '',
      // (sid.fx & SID.SHAD.FN_NOISE) ? frag_noise : '',
      // (sid.fx & SID.SHAD.FN_NOISE2) ? frag_noise_2 : '',
      // (sid.fx & SID.FX.FS_SMOKE_VEC3) ? frag_smoke : '',
      
      
      /********************************************************************************************************/
      // Shader Functions
      (sid.shad & SID.SHAD.FN_NOISE) ? frag_noise : '',
      (sid.shad & SID.SHAD.FN_NOISE2) ? frag_noise_2 : '',
      (sid.shad & SID.SHAD.FN_GLOW) ? frag_glow : '',
      (sid.shad & SID.SHAD.FN_INNER_SHADOW) ? frag_inner_shadow_rhomboid : '',
      (sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) ? frag_explosion_circle : '',
      (sid.shad & SID.SHAD.FN_EXPLOSION_GLOW) ? frag_explosion_glow : '',
      (sid.shad & SID.SHAD.FN_GLOW_SPHERE) ? frag_glow_sphere : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_1) ? frag_noise_worley_1 : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_2) ? frag_noise_worley_2 : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_3_TYPES) ? frag_noise_worley_3_types : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_3D) ? frag_noise_worley_3D : '',
      (sid.shad & SID.SHAD.FN_NOISE_VORONOI_1) ? frag_noise_voronoi_1 : '',
      (sid.shad & SID.SHAD.FN_NOISE_VORONOI_2) ? frag_noise_voronoi_2 : '',
      
      // (sid.fx & SID.SHAD.FN_NOISE) ? frag_noise : '',

      /********************************************************** **********************************************/
      // Test shader functions
      (sid.shad & SID.SHAD.FS_TEST1) ? frag_test1 : '',
      (sid.shad & SID.SHAD.FS_TEST2) ? frag_test2 : '',
      (sid.shad & SID.SHAD.FS_TEST3) ? frag_test3 : '',
      (sid.shad & SID.SHAD.FS_TEST4) ? frag_test4 : '',
      // (sid.shad & SID.SHAD.FS_TEST5) ? frag_test5_bubble : '',






      /********************************************************************************************************/
      // Main
      /**
       * Fragment Shader often used variables:
       * vec2 uv
       * vec2 res
       * vec2 dim
       */
      '\n/********************************************************************************************/\n// FRAGMENT: MAIN()\n/********************************************************************************************/',

      true ? 'void main(void) ' : '',
      '{',
      // Include uniforms-controls
      `
  #ifdef U_GENERIC_CONTROLS
    int u_gen_ctrl_map_cnt = 0; // Indexing: u_generic_controls[] buffer
  #endif
  #ifdef U_SCALE_VEC2
     float scale_down = u_scale2.x;
  #else 
     float scale_down = 1.0; 
  #endif
  #ifdef U_TIME_FLOAT
    float time = u_time;
  #else
    float time = 1.;
  #endif
  `,
      (sid.pass & SID.ATTR.DIM2) ? `  vec2 dim = vec2(v_dim2_x, v_dim2_y);\n  vec2 local_res = vec2(dim.x, dim.y);` : '',

      (sid.attr & SID.ATTR.TEX2) ? '  vec2 v_tex_coord = vec2(v_tex2_x, v_tex2_y);' : '', // Initialize texture coordinates variable
      (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? '  vec2 res = u_screen_res;' : '', // Initialize screen resolution variable
      
      (sid.pass & SID.ATTR.VPOS2) ? '  vec2 vpos = vec2(v_pos2_x, v_pos2_y);' : '', // Initialize pixel coordinates variable
      '  vec2 uv = vec2(0.0, 0.0);', // Initialize pixel coordinates variable
      '  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);', // The users color
      '  vec4 final_color = vec4(0.0);', // The final output color
      // '  vec4 final_color = vec4(1.0);', // The final output color
      // '  final_color = src_color;', // The final output color



      Resolve_function_operations_called_from_main(shader_ops),



      ((sid.attr & SID.ATTR.BORDER) && (sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_style_call :
         ((sid.attr & SID.ATTR.R_CORNERS) && (sid.attr & SID.ATTR.FEATHER)) ? frag_round_corners_call :

      (sid.attr & SID.ATTR.TEX2) ? (sid.attr & SID.ATTR.SDF) ? frag_sdf_call : (sid.attr & SID.ATTR.MSDF) ? frag_msdf_call : frag_tex : '',

      
      // `  final_color = ${Resolve_blending_mode(sid.blend_options)}( final_color,\ `, 
      
      // Shader Color Functions
      (sid.shad & SID.SHAD.FN_NOISE) ? frag_noise_call : '',
      (sid.shad & SID.SHAD.FN_NOISE2) ? frag_noise_2_call : '',
      (sid.shad & SID.SHAD.FN_GLOW) ? frag_glow_call : '',
      (sid.shad & SID.SHAD.FN_INNER_SHADOW) ? frag_inner_shadow_rhomboid_call : '',
      (sid.shad & SID.SHAD.FN_EXPLOSION_CIRCLE) ? frag_explosion_circle_call : '',
      (sid.shad & SID.SHAD.FN_EXPLOSION_GLOW) ? frag_explosion_glow_call : '',
      (sid.shad & SID.SHAD.FN_GLOW_SPHERE) ? frag_glow_sphere_call : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_1) ? frag_noise_worley_1_call : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_2) ? frag_noise_worley_2_call : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_3_TYPES) ? frag_noise_worley_3_types_call : '',
      (sid.shad & SID.SHAD.FN_NOISE_WORLEY_3D) ? frag_noise_worley_3D_call : '',
      (sid.shad & SID.SHAD.FN_NOISE_VORONOI_1) ? frag_noise_voronoi_1_call : '',
      (sid.shad & SID.SHAD.FN_NOISE_VORONOI_2) ? frag_noise_voronoi_2_call : '',
      
      // Test Shaders
      (sid.shad & SID.SHAD.FS_TEST2) ? frag_test2_call : '',
      (sid.shad & SID.SHAD.FS_TEST1) ? frag_test1_call : '',
      (sid.shad & SID.SHAD.FS_TEST3) ? frag_test3_call : '',
      (sid.shad & SID.SHAD.FS_TEST4) ? frag_test4_call : '',
      // (sid.shad & SID.SHAD.FS_TEST5) ? frag_test5_bubble_call : '',
      
      

      /********************************************************************************************************/
      // Color fragment
      (sid.shad & SID.SHAD.PRE_MULTIPLIED_ALPHA) ? '   final_color.rgb *= final_color.a; ' : '',

      /**
       * Human Perception Luminance Formulas
       * 1. (0.2126*R + 0.7152*G + 0.0722*B)
       * 2. (0.299*R + 0.587*G + 0.114*B)
       * 3. sqrt( 0.241*R^2 + 0.691*G^2 + 0.068*B^2 ) 
       *    sqrt( 0.299*R^2 + 0.587*G^2 + 0.114*B^2 )
       */

      // '   float mx = max(color.r,max(color.g,color.b));',
      // '   float mn = min(color.r,min(color.g,color.b));',
      // '   float balance = ( (mx-mn) / mx );',
      // '   float avg = ((color.r*0.901)+(color.g*0.513)+(color.b*0.906)) / 3.0;',
      
      // '   float make_up = (1.-avg)*2.;',

      // // '   vec4 final_with_lum = vec4(1.*color.r*make_up, 1.*color.g*make_up,  1.*color.b*make_up, color.a);',
      // // '   vec4 final_with_lum = vec4(0.701*color.r*make_up, 0.413*color.g*make_up,  0.996*color.b*make_up, color.a);',
      // // '   vec4 final_with_lum = vec4(0.759*color.r*make_up, 0.413*color.g*make_up,  0.996*color.b*make_up, color.a);',
      // // '   vec4 final_with_lum = vec4(0.901*color.r*make_up, 0.513*color.g*make_up,  0.906*color.b*make_up, color.a);',
      // // '   vec4 final_with_lum = vec4(min(0.513*color.r*make_up, 1.), min(0.513*color.g*make_up, 1.),  min(0.513*color.b*make_up, 1.), color.a);',
      // // '   vec4 final_with_lum = vec4(min(0.701*color.r*make_up, 1.), min(0.613*color.g*make_up, 1.),  min(0.786*color.b*make_up, 1.), color.a);',
      // '   vec4 final_with_lum = vec4(min(0.901*color.r*make_up, 1.), min(0.513*color.g*make_up, 1.),  min(0.906*color.b*make_up, 1.), color.a);',

      // '   frag_color = mix(color, final_with_lum, balance);',
      // // '   frag_color = mix(color, final_with_lum, smoothstep(0., 1., balance));',
      // // '   frag_color = final_with_lum;',
      // // '   color.rgb *= color.a; ',
      
      // // '   color.a = 1.-median(color.rgb);',
      // // '   color.a = median(color.rgb);',
      // '   color.a = 1.;',
      // // '   color.rgb = max(1.-color.rgb, .7);',
      // '   color.rgb = 1.-color.rgb;',
      // '   color.rgb *= vec3(v_col4_x, v_col4_y, v_col4_z);',
      
      // '  frag_color = src_color;',
      // '  frag_color = final_color * src_color;',
      // '   frag_color = 1.- final_color;',
      // '   frag_color.rgb = 1.- final_color.rgb;',

      // '  frag_color = final_color;',
      // '  frag_color = final_color * src_color;',
      (sid.shad & SID.SHAD.ENABLE_SRC_COLOR_IN_FRAG_MAIN) ? '  frag_color = final_color * src_color;' : '  frag_color = final_color;',
      // '  frag_color = src_color;',






      /********************************************************************************************************/
      // HACK: prevent optimizer from removing unused uuniforms
      (sid.unif & SID.UNIF.TIME) ? '  if(u_time == 0.) ;' : '',
      (sid.unif & SID.UNIF.FS_GENERIC_FLOAT) ? '  if(u_generic_float == 0.) ;' : '',
      (sid.unif & SID.UNIF.FS_GENERIC_VEC2) ? '  if(u_generic_vec2.x == 0.) ;' : '',
      (sid.unif & SID.UNIF.FS_GENERIC_VEC3) ? '  if(u_generic_vec3.x == 0.) ;' : '',
      (sid.unif & SID.UNIF.FS_GENERIC_VEC4) ? '  if(u_generic_vec4.x == 0.) ;' : '',
      '  if(u_blend_mode == 0) final_color *= 1.0;',

      true ? '}' : '',

   ];

   const fragment_shader = fs_chunks.filter(filterEmptyLine).join('\n')

   // const fs = Fragment_shader_includes_resolve(fragment_shader);
   const fs = Shader_includes_resolve(fragment_shader);


   // Reset for the next Shader Program build
   locations = null;
   attributes_in_code = '';
   attributes_out_code = '';
   attributes_assign_code = '';
   fs_attribs_in_code = '';
   attribs_info.mesh_attribs = [];
   attribs_info.attribs_loc = [];

   ID++;

   const buffer = [];
   for(let i=0; i<uniforms_info.length; i++) {
      
      // Collect all uniform names from a shader only if the current uniform is of type uniform buffer 
      // if(uniforms_info[i].arr_size > 0) {

         const vars_using_uniform_buffer = Resolve_generic_uniforms_names(fragment_shader, uniforms_info[i].name);
         buffer.push(vars_using_uniform_buffer);
      // }
   }
   // console.log(buffer)

   console.info(fs);
   return {
      fs:fs,
      code:fs_chunks,
      vars_using_uniform_buffer:buffer,
   };
}


// function Resolve_uniform_generic_contols_map(uniforms_info) {

//    // let code = '';
//    // let u_generic_controls = null;
//    // const unif_len = uniforms_info.length;
//    // for(let i=0; i<unif_len; i++) {
//    //    if(uniforms_info[i].name === 'u_generic_controls')
//    //       u_generic_controls = uniforms_info[i];
//    // }
//    // for(let i=0; i<u_generic_controls.arr_size; i++) {
//    //    code += `float ctrl${cnt}`;
//    // }
// }

