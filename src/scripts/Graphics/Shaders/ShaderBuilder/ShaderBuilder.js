// https://computergraphics.stackexchange.com/questions/100/sharing-code-between-multiple-glsl-shaders


import { vertex_shader_chunks, fragment_shader_chunks } from './ShaderChunks/ShaderChunks.js'
import { frag_round_corners_call, frag_round_corners } from './Functions/fragment.roundcorners.js'
import { frag_msdf, frag_msdf_call, frag_sdf, frag_sdf_call, frag_tex } from './Functions/fragment.texture.js'





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




function Resolve_uniforms_from_sid_vs(sid, _uniforms_info){

   let uniforms_code = '';
   const uniforms_info = [];
   let is_block = false;


   if(sid.unif & SID.UNIF.ANY_SHARED) { // Create uniforms block.

         uniforms_code += `layout(std140) uniform Uniform_block_generic {\n`;
      is_block = true;
   }

   if(sid.unif & SID.UNIF.PROJECTION_MATRIX) { // Create projection in block if it is shared else as a separate uniform input
      if(sid.unif_extra.proj & SID.UNIF_EXTRA.PROJECTION_MATRIX.IS_SHARED) {

         uniforms_code += ' mat4 u_projection;\n'; 
         uniforms_info.push({
            name:'u_projection',
            is_block:true,
            type:UNIF_TYPE.MAT4, // UNNECESSARY: The Uniforms class can retrieve this info.
         });
      }
   }
   
   if(sid.unif & SID.UNIF.SCREEN_RESOLUTION) {
      if(sid.unif_extra.res & SID.UNIF_EXTRA.SCREEN_RESOLUTION.IS_SHARED) {

         uniforms_code += ' vec2 u_screen_res;\n'; // If uniform is in block(shared), does not matter if the shader uses it, it must be declared.
         uniforms_info.push({
            name:'u_screen_res',
            is_block:true,
            type:UNIF_TYPE.FVEC2,
         });
      }
   }
   
   if(sid.unif & SID.UNIF.TIME) {
      if(sid.unif_extra.time & SID.UNIF_EXTRA.TIME.IS_SHARED) {
         
         uniforms_code += ' float u_time;\n'; 
         uniforms_info.push({
            name:'u_time',
            type:UNIF_TYPE.FLOAT,
         });
      }
   }
   
   if(is_block) uniforms_code += '};\n\n'
   
   
   if(sid.unif & SID.UNIF.PROJECTION_MATRIX && 
      sid.unif_extra.proj & SID.UNIF_EXTRA.PROJECTION_MATRIX.IN_VS && 
      (sid.unif_extra.proj & SID.UNIF_EXTRA.PROJECTION_MATRIX.IS_SHARED) === 0
      ) {
         uniforms_code += 'uniform mat4 u_projection;\n'; 
         uniforms_info.push({
            name:'u_projection',
            is_block:true,
            type:UNIF_TYPE.MAT4,
         });

      }

   if(sid.unif & SID.UNIF.SCREEN_RESOLUTION && sid.unif_extra.res & SID.UNIF_EXTRA.SCREEN_RESOLUTION.IN_VS && 
      (sid.unif_extra.res & SID.UNIF_EXTRA.SCREEN_RESOLUTION.IS_SHARED) === 0
      ) {
         uniforms_code += 'uniform vec2 u_screen_res;\n'; 
         uniforms_info.push({
            name:'u_screen_res',
            is_block:false,
            type:UNIF_TYPE.FVEC2,
         });
      }


   
   const len = _uniforms_info.length;
   for(let i=0; i< len; i++){
      if(_uniforms_info[i].shader & UNIFORM.IN_VS){

         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name};\n`; 
      }
   }

   return uniforms_code;

   // Extension: For lights
}


function Resolve_uniforms_from_sid_fs(sid, _uniforms_info){

   let uniforms_code = '';
   const uniforms_info = [];
   let is_block = false;

   // TODO: If block was created for the vertex buffer, must check if at least one of the block uniforms is used by fs, and recreate the whole block in fs too. Otherwise skip declaring the block.

   if(sid.unif & SID.UNIF.ANY_SHARED) { // Create uniforms block.

         uniforms_code += `layout(std140) uniform Uniform_block_generic {\n`;
      is_block = true;
   }

   if(sid.unif & SID.UNIF.PROJECTION_MATRIX) { // Create projection in block if it is shared else as a separate uniform input
      if(sid.unif_extra.proj & SID.UNIF_EXTRA.PROJECTION_MATRIX.IS_SHARED) uniforms_code += ' mat4 u_projection;\n'; 
   }
   
   if(sid.unif & SID.UNIF.SCREEN_RESOLUTION) {
      if(sid.unif_extra.res & SID.UNIF_EXTRA.SCREEN_RESOLUTION.IS_SHARED) uniforms_code += ' vec2 u_screen_res;\n'; // If uniform is in block(shared), does not matter if the shader uses it, it must be declared.
   }
   
   if(sid.unif & SID.UNIF.TIME) {
      if(sid.unif_extra.time & SID.UNIF_EXTRA.TIME.IS_SHARED) uniforms_code += ' float u_time;\n'; 
   }
   
   if(is_block) uniforms_code += '};\n\n'
   
   
   if(sid.unif & SID.UNIF.PROJECTION_MATRIX && sid.unif_extra.proj & SID.UNIF_EXTRA.PROJECTION_MATRIX.IN_FS && 
      (sid.unif_extra.proj & SID.UNIF_EXTRA.PROJECTION_MATRIX.IS_SHARED) === 0
      ) {
         uniforms_code += 'uniform mat4 u_projection;\n'; 
         uniforms_info.push({
            name:'u_projection',
            is_block:true,
            type:UNIF_TYPE.MAT4,
         });

      }

   if(sid.unif & SID.UNIF.SCREEN_RESOLUTION && sid.unif_extra.res & SID.UNIF_EXTRA.SCREEN_RESOLUTION.IN_FS && 
      (sid.unif_extra.res & SID.UNIF_EXTRA.SCREEN_RESOLUTION.IS_SHARED) === 0
      ) {
         uniforms_code += 'uniform vec2 u_screen_res;\n'; 
         uniforms_info.push({
            name:'u_screen_res',
            is_block:false,
            type:UNIF_TYPE.FVEC2,
         });
      }


   const len = _uniforms_info.length;
   for(let i=0; i< len; i++){
      if(_uniforms_info[i].shader & UNIFORM.IN_FS){

         const type = UNIF_TYPE.GetStr(_uniforms_info[i].type);
         uniforms_code += `uniform ${type} ${_uniforms_info[i].name};\n`; 
      }
   }
      
   // UNIFORMS_TEMP_INFO.fs = uniforms_info;
   
   return uniforms_code;

   // Extension: For lights
}

/**
 * // TODO:
 * We can have a sid 'CONDITIONS' for some decisions.
 * the 'CONDITIONS' is set to 0x0 on every new shader program code (in Shaders_build_vertex_shader)
 * 
 * Example:
 * Lets say create uinform screen res stand alone.
 * In  'Resolve_uniforms_from_sid_vs()' we set 'CONDITIONS' to have a flag that creates:
 *    Vertex Shader
 *       'out vec2 v_screen_res;'
 *       'v_screen_res = u_screen_res;'
 *    Fragmet Shader
 *       'in vec2 v_screen_res;'
 *    In the function that gets the screen res
 *       By ifndef block of code????
 * 
 * !!!!!!!!!!!!
 * QUESTION: Should the ATTR.STYLE be responsible for creating the code for screen res???
 * So in Mesh class, on sid creation we should also implement: If ATTR.STYLE then ADD 'UNIF.SCREEN_RES'  
 * 
 * 
 * Set 'DEFINES_xxxx' and then find the and replace the 'DEFINES_xxxx' with code from a function
 */


export function Shaders_build_vertex_shader(sid, uniforms_info){

   const vs_chunks = [

      '#version 300 es',
      '// Vertex Shader',
      '#include <precision_medium>', // TODO: Let the app decide the precision

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // DEFINES
      '\n',

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // INS
      (sid.attr & SID.ATTR.COL4) ? 'in vec4 a_col;' : '',
      (sid.attr & SID.ATTR.WPOS_TIME4) ? 'in vec4 a_wpos_time;' : '',
      (sid.attr & (SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER)) ? '#include <in_a_vec4_params1>' : '',
      (sid.attr & SID.ATTR.POS2) ? 'in vec2 a_pos;' : '',
      (sid.attr & SID.ATTR.TEX2) ? 'in vec2 a_tex;' : '',
      (sid.attr & SID.ATTR.SDF) ? '#include <in_attr_sdf2>' : '',
      (sid.attr & SID.ATTR.POS3) ? 'in vec3 a_pos;' : '',
      '\n',
      

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // UNIFORMS
      Resolve_uniforms_from_sid_vs(sid, uniforms_info),
      '\n',
      

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // OUTS
      (sid.pass & SID.PASS.COL4) ? 'out vec4 v_col; ' : '',
      (sid.pass & SID.PASS.DIM2) ? 'out vec2 v_dim;' : '',
      (sid.pass & SID.PASS.WPOS2) ? 'out vec2 v_wpos;' : '',
      (sid.attr & SID.ATTR.TEX2) ? 'out vec2 v_tex_coord;' : '',
      (sid.attr & SID.ATTR.SDF) ? '#include <out_attr_sdf2>' : '',
      (sid.attr & SID.ATTR.BORDER) ? '#include <out_border_width>' : '',
      (sid.attr & SID.ATTR.R_CORNERS) ? '#include <out_rCorners>' : '',
      (sid.attr & SID.ATTR.FEATHER) ? '#include <out_border_feather>' : '',
      (sid.pass & SID.PASS.TIME1) ? '#include <out_vtime1>' : '',
      (sid.pass & SID.PASS.RES2) ? '#include <out_vres2>' : '',
      // (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? 'out vec2 v_screen_res;' : '',
      '\n',
      

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      'void main(void) ',
      '{',
      (sid.unif & SID.UNIF.PROJECTION_MATRIX) 
         ? '  gl_Position = u_projection * vec4(a_pos.x + a_wpos_time.x, a_pos.y + a_wpos_time.y, a_wpos_time.z, 1.0);' 
         : '  gl_Position = vec4(a_pos.x + a_wpos_time.x, a_pos.y + a_wpos_time.y, a_wpos_time.z, 1.0);',


      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // ASSIGNMENTS
      (sid.pass & SID.PASS.COL4) ? '  v_col = a_col;' : '', 
      (sid.pass & SID.PASS.DIM2) ? '  v_dim = abs(a_pos);' : '',
      (sid.pass & SID.PASS.WPOS2) ? '  v_wpos = a_wpos_time.xy;' : '',
      (sid.attr & SID.ATTR.TEX2) ? '  v_tex_coord = a_tex;' : '',
      (sid.attr & SID.ATTR.SDF) ? '  v_sdf = a_sdf;' : '',
      (sid.attr & SID.ATTR.BORDER) ? '  v_border_width = a_params1.x;' : '',
      (sid.attr & SID.ATTR.R_CORNERS) ? '  v_rCorners = a_params1.y;' : '',
      (sid.attr & SID.ATTR.FEATHER) ? '  v_border_feather = a_params1.z;' : '',
      // (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? '  v_screen_res = u_screen_res;' : '',
      // (true) ? '   gl_PointSize = 10.0;' : '',
      '}',

   ];

   const vertex_shader = vs_chunks.filter( filterEmptyLine ).join( '\n' )

   const vs = Vertex_shader_includes_resolve(vertex_shader);

   if(DEBUG.SHADERS) console.info(vs)
   return vs;
}


export function Shaders_build_fragment_shader(sid, uniforms_info){

   const fs_chunks = [

      (true) ? '#version 300 es' : '',
      '// Fragment Shader',

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // DEFINES
      '\n',
      true ? '#include <precision_medium>' : '',
      true ? '#include <out_frag_color>' : '',

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      // (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? 'in vec2 v_screen_res;' : '',
      // (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? 'uniform  vec2 u_screen_res;' : '',
      // (sid.unif & SID.UNIF.SCREEN_RESOLUTION) ? 'vec2 v_screen_res = u_screen_res;' : '',
      
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // UNIFORMS
      '\n',
      Resolve_uniforms_from_sid_fs(sid, uniforms_info),
      (sid.attr & SID.ATTR.TEX2) ? '#include <frag_u_sampler0>' : '',
      
      
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Function definitions
      '\n',
      (sid.attr & SID.ATTR.BORDER) ? frag_round_corners : '',
      (sid.attr & SID.ATTR.SDF) ? frag_sdf : '',
      (sid.attr & SID.ATTR.MSDF) ? frag_msdf : '',

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Main
      true ? 'void main(void) ' : '',
      true ? '{' : '',
      true ? '#include <frag_color_create>' : '',
      // (sid.attr & SID.ATTR.TEX2) ? Fragment_shader_includes_resolve(frag_tex) : '',
      (sid.attr & SID.ATTR.BORDER) ? frag_round_corners_call : '',
      // (sid.attr & SID.ATTR.BORDER) ? Fragment_shader_includes_resolve(frag_round_corners_call) : '',
      (sid.attr & SID.ATTR.TEX2 ) 
         ? (sid.attr & SID.ATTR.SDF) ? frag_sdf_call // If TEX2 and SDF, build for sdf
            : (sid.attr & SID.ATTR.MSDF) ? frag_msdf_call  // ELSE If TEX2 and MSDF, build for msdf
         : frag_tex // ELSE If only TEX2, build for simple texture
      : '', // ELSE null
      
      
      
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Color fragment
      true ? '  frag_color = color;' : '',
      (sid.shad & SID.SHAD.PRE_MULTIPLIED_ALPHA) ? '  frag_color.rgb *= v_col.a; ' : '',
      // true ? '  frag_color.rgb *= color.a;' : '',

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // TESTS
      true ? '  frag_color.xyz *= u_time;' : '',
      
      true ? '}' : '',
      
   ];

   const fragment_shader = fs_chunks.filter( filterEmptyLine ).join( '\n' )

   const fs = Fragment_shader_includes_resolve(fragment_shader);

   if(DEBUG.SHADERS) console.info(fs)
   return fs;
}


