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
//

// const _attribs_generic_decider_buffer = New_generic_buffer(_, _attribs_generic_decider_buffer);

// const _attribs_generic1_vec4 = {
//    attr1: {is_occupied:false, code:'', },
//    attr2: {is_occupied:false, code:'', },
//    attr3: {is_occupied:false, code:'', },
//    attr4: {is_occupied:false, code:'', },
// };

// function Resolve_generic_attributes(sid, progidx){

//    // _attribs_generic_decider_buffer.Add(New_generic_buffer(_, ));

//    const 

//    if((sid.attr & SID.ATTR.BORDER)){ 

//       if()

//    }
// }



/**
 * Set 'DEFINES_xxxx' and then find and replace the 'DEFINES_xxxx' with code from a function
 */
export function Shaders_build_vertex_shader(sid, uniforms_info){

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
      (sid.attr & SID.ATTR.COL4) ? 'in vec4 a_col;' : '',
      (sid.attr & SID.ATTR.WPOS_TIME4) ? 'in vec4 a_wpos_time;' : '',
      (sid.attr & (SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) ? '#include <in_attr_generic_vec4>' : '',
      // (sid.attr & SID.ATTR.GLOW_INTENSITY) ? 'out float v_glow_intensity;' : '',
      (sid.attr & SID.ATTR.POS2) ? 'in vec2 a_pos;' : '',
      (sid.attr & SID.ATTR.DIM2) ? 'in vec2 a_dim;' : '',
      (sid.attr & SID.ATTR.TEX2) ? 'in vec2 a_tex;' : '',
      (sid.attr & SID.ATTR.SDF) ? '#include <in_attr_sdf2>' : '',
      // (_attribs_generic1_vec4.attr1.is_occupied) ? : '',
      '\n',






      /********************************************************************************************************/
      // UNIFORMS
      /********************************************************************************************************/
      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_VS),
      '\n',






      /********************************************************************************************************/
      // OUTS
      /********************************************************************************************************/
      (sid.pass & SID.PASS.COL4) ? 'out vec4 v_col; ' : '',
      (sid.pass & SID.PASS.DIM2) ? 'out vec2 v_dim;' : (sid.pass & SID.ATTR.DIM2) ? 'out vec2 v_dim;' :'',
      (sid.pass & SID.PASS.WPOS2) ? 'out vec2 v_wpos;' : '',
      (sid.pass & SID.PASS.TIME1) ? '#include <out_vtime1>' : '',
      (sid.pass & SID.PASS.RES2) ? '#include <out_vres2>' : '',
      (sid.attr & SID.ATTR.TEX2) ? 'out vec2 v_tex_coord;' : '',
      (sid.attr & SID.ATTR.SDF) ? '#include <out_attr_sdf2>' : '',
      (sid.attr & SID.ATTR.BORDER) ? '#include <out_border_width>' : '',
      (sid.attr & SID.ATTR.R_CORNERS) ? '#include <out_rCorners>' : '',
      (sid.attr & SID.ATTR.FEATHER) ? '#include <out_border_feather>' : '',
      (sid.attr & SID.ATTR.TIME) ? 'out float v_time;' : '',
      (sid.attr & SID.ATTR.GLOW_INTENSITY) ? 'out float v_glow_intensity;' : '',
      '\n',






      /********************************************************************************************************/
      // Main Function
      /********************************************************************************************************/
      'void main(void) ',
      '{',






      /********************************************************************************************************/
      // Scale in Vertex Shader
      (sid.shad & SID.SHAD.VS_TEST1) ? '// HI FROM VS_TEST1' : '',






      /********************************************************************************************************/
      // Calculate vertex position-rotation-scale
      
      '  vec2 vpos = a_pos;',
      ((sid.unif & SID.UNIF.SCALE2) && (uniforms_info & UNIFORM.IN_VS)) ? '  vpos *= u_scale2;' : '',
      (sid.pass & SID.PASS.WPOS2) ? '  vec2 wpos = vec2(a_wpos_time.x+ u_wposxy.x, a_wpos_time.y+u_wposxy.y);' : '  vec2 wpos = vec2(0.0, 0.0);',
      (sid.unif & SID.UNIF.PROJECTION_MATRIX) // TODO: See if we can set the code for 'u_projection' with a flag from the 'Resolve_uniforms_from_sid()' and not have to set the SID.UNIF.PROJECTION_MATRIX manualy
      ? '  gl_Position = u_projection * vec4(vpos.x + wpos.x, vpos.y + wpos.y, a_wpos_time.z, 1.0);' 
      : '  gl_Position = vec4(vpos.x + a_wpos_time.x, vpos.y + a_wpos_time.y, a_wpos_time.z, 1.0);',






      /********************************************************************************************************/
      // ASSIGNMENTS
      (sid.pass & SID.PASS.COL4) ? (sid.attr & SID.ATTR.COL4 ? '  v_col = a_col;' : (sid.unif & SID.UNIF.COL4) ? '  v_col = u_col4;' : '') : '', 
      (sid.pass & SID.PASS.DIM2) ? '  v_dim = a_dim;' : (sid.pass & SID.ATTR.DIM2) ? '  v_dim = a_dim;' : '', // TODO: If we have created an attribute a_dim, we have to use it, else the attribs buffering is gonna be wrong
      (sid.pass & (SID.PASS.WPOS2|SID.UNIF.ROOT_WPOS2)) ? '  v_wpos = vec2(wpos.x,wpos.y);' : (sid.pass & SID.PASS.WPOS2) ? '  v_wpos = a_wpos_time.xy;' : '',
      (sid.attr & SID.ATTR.TEX2) ? '  v_tex_coord = a_tex;' : '',
      (sid.attr & SID.ATTR.SDF) ? '  v_sdf = a_sdf;' : '',
      (sid.attr & SID.ATTR.BORDER) ? '  v_border_width = a_generic1.x;' : '',
      (sid.attr & SID.ATTR.R_CORNERS) ? '  v_rCorners = a_generic1.y;' : '',
      (sid.attr & SID.ATTR.FEATHER) ? '  v_border_feather = a_generic1.z;' : '',
      (sid.attr & SID.ATTR.GLOW_INTENSITY) ? '  v_glow_intensity = a_generic1.w;' : '', // HACK: We assume the glow intensity attrib is together with the style attributes. Need to separate style with glow shaders, so if no style is active then the glow_intensity will be allocated at a_generic1.x
      (sid.attr & SID.ATTR.TIME) ? '  v_time = a_wpos_time.w;' : '',
      (true) ? '  gl_PointSize = 10.0;' : '',
      '}',

   ];

   const vertex_shader = vs_chunks.filter( filterEmptyLine ).join( '\n' )

   const vs = Vertex_shader_includes_resolve(vertex_shader);

   if(DEBUG.SHADERS) console.info(vs)
   return vs;
}

/** // https://www.khronos.org/opengl/wiki/Fragment_Shader
 * Fragment Shaders have the following built-in input variables.

   in vec4 gl_FragCoord;
   in bool gl_FrontFacing;
   in vec2 gl_PointCoord;

 */



export function Shaders_build_fragment_shader(sid, uniforms_info){

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
      (sid.pass & SID.PASS.COL4) ? '#include <in_frag_col4>' : '',
      (sid.pass & SID.PASS.DIM2) ? '#include <in_frag_dim2>'   : '',
      (sid.pass & SID.PASS.WPOS2) ? '#include <in_frag_wpos2>' : '',
      (sid.attr & SID.ATTR.TEX2) ? '#include <in_frag_tex2>' : '',
      (sid.attr & SID.ATTR.BORDER) ? '#include <in_frag_border_width>' : '',
      (sid.attr & SID.ATTR.R_CORNERS) ? '#include <in_frag_rCorners>' : '',
      (sid.attr & SID.ATTR.FEATHER) ? '#include <in_frag_border_feather>' : '',
      (sid.attr & SID.ATTR.SDF) ? '#include <in_frag_sdf2>' : '',
      (sid.attr & SID.ATTR.TIME) ? 'in float v_time;' : '',
      (sid.attr & SID.ATTR.GLOW_INTENSITY) ? 'in float v_glow_intensity;' : '',






      /********************************************************************************************************/
      // UNIFORMS
      '\n',
      Resolve_uniforms_from_sid(uniforms_info, UNIFORM.IN_FS),
      (sid.attr & SID.ATTR.TEX2) ? '#include <frag_u_sampler0>' : '',






      /********************************************************************************************************/
      // Function definitions
      '\n',
      (sid.attr & SID.ATTR.STYLE) ? frag_round_corners : '',
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
      true ? '{' : '',
      true ? '#include <frag_color_create>' : '', // Creates the variable 'color' of the fragment shader color output.
      (sid.attr & SID.ATTR.STYLE) ? frag_round_corners_call : '', // TODO: Check either for .STYLE or .BORDER|.FEATHER|.RCORNERS
      (sid.fx & (SID.FX.FS_GLOW_VEC3|SID.FX.FS_GLOW_VEC2)) ? '  float alpha = color.a;' : '',
      (sid.fx & (SID.FX.FS_GLOW_VEC3|SID.FX.FS_GLOW_VEC2)) ? frag_glow_call : '',
      (sid.fx & SID.FX.FS_NOISE) ? frag_noise_call : '',
      (sid.fx & SID.FX.FS_SMOKE) ? frag_smoke_call : '',
      (sid.attr & SID.ATTR.TEX2 ) ? (sid.attr & SID.ATTR.SDF) ? frag_sdf_call : (sid.attr & SID.ATTR.MSDF) ? frag_msdf_call : frag_tex : '', 
      (sid.shad & SID.SHAD.FS_TEST1) ? frag_test1_call : '',






      /********************************************************************************************************/
      // Color fragment
      true ? '  frag_color = color;' : '',
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

   if(DEBUG.SHADERS) console.info(fs)
   return fs;
}


