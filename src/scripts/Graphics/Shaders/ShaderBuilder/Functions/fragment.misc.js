"use strict";

/**
 * Where to do the Blending?????
 * 
 * 1. In the fragment's shader main(), that is in the _call function?
 * 
 * 2. In each function. We use the src_color to blend inside each color function.
 * This way we can use different blend functions for each different color function
 * but we need the "BLEND MODES FUNCTION DECLERATIONS" directives to include the correct
 * blending function.
 */



export const frag_glow_sphere_call = '   color = blm_multiply( color, frag_test1() );'

export const frag_glow_sphere = `

/********************************************************************************************/
// SHADER UNIT: frag_glow_sphere
/********************************************************************************************/

/*****************************************************/
// GENERIC GLOBAL VARIABLES DECLERATIONS
#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif


/*****************************************************/
// FUNCTION DECLERATIONS
#ifndef SMOOTH_MIN 
  #include <smoothmin>
#endif

/*****************************************************/
// BLEND MODES FUNCTION DECLERATIONS: Include ONLY if this function needs to blend CONDITIONALY or DYNAMICALY any colors INTERNALY, else just use the global blending function calls directly 
#ifdef BLEND_MODE 
   #include <blend_mode_directives>
#endif


float gamma_correction(float c1) {

  if (c1 < 0.04045f) {
    return (c1 < 0.0f) ? 0.0f : c1 * (1.0f / 12.92f);
  }

  return pow((c1 + 0.055f) * (1.0f / 1.055f), 2.4f);
}




vec4 frag_test1()
{

#ifdef U_GENERIC_VEC3
   #include <u_generic_vec3>
#elif defined(U_GENERIC_VEC2)
   #include <u_generic_vec2>
#elif defined(U_GENERIC_FLOAT)
   #include <u_generic_float>
#endif



   vec2 res = u_screen_res;
   vec2 local_res = vec2(v_dim2_x*2., v_dim2_y*2.);
   vec2 dim = vec2(v_dim2_x, v_dim2_y);
   vec2 uv1 = (gl_FragCoord.xy / local_res);               // Map pixel: from {0 -> dim} to {0 -> 1} 
   vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);



   uv1.x -= v_wpos3_x / local_res.x;             // Invalidate any mesh world position, so that 'first' gl_FragCoord is always the meshes 'first' pixel
   uv1.y -= (res.y - (v_wpos3_y+local_res.y)) / local_res.y; // Invalidate any mesh world position.
   float repeatx = 1.;
   float repeaty = 1.;

   /**********************************************/
   // Distance
   float dd = 1.-length( vec2( abs((fract(uv1.x*repeatx) - .5)* 2.), abs((fract(uv1.y*repeaty) - .5)* 2.) ));
   dd = smoothstep(0., control1, dd);

   
   /**********************************************/
   // Color 1
   float c1 = dd;
   c1 = pow(c1, .4);
   c1 += dd*control2*2.;

   /**********************************************/
   // Color 2
   float c2 = 1.;
   // c2 = clamp(0., 1., (dd+dd) * control3 * 5.);
   c2 = (dd+dd) * control3 * 5.;
   // c2 = pow(c2, control3*4.) * c2;

   /**********************************************/
   // Mix Colors
   c1 = blend_mode(c1, c2);
   // c1 = mix(c1, c2, control3);

   vec3 color = vec3(c1);
   return vec4(color, 1.);
   // return vec4(color, src_color.rgb, src_color.a);
   // return vec4(color*src_color.rgb, src_color.a);
}
`;