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



export const frag_glow_sphere_call = '   color = blend_color_multiply( color, frag_glow_sphere() );'
// export const frag_glow_sphere_call = '   color = blend_color_add( color, frag_glow_sphere() );'
// export const frag_glow_sphere_call = '   color = blend_mode_vec4( color, frag_glow_sphere() );'

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
#ifndef GAMMA_CORRECTION 
  #include <gamma_correction>
#endif

/*****************************************************/
// BLEND MODES FUNCTION DECLERATIONS: Include ONLY if this function needs to blend CONDITIONALY or DYNAMICALY any colors INTERNALY, else just use the global blending function calls directly 
#ifdef BLEND_MODE 
  #include <blend_mode_directives>
#endif






vec4 frag_glow_sphere()
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
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  
  
  
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
  
  vec3 color = vec3(c1);
  return vec4(color, 1.);
  // return vec4(color, src_color.rgb, src_color.a);
  // return vec4(color*src_color.rgb, src_color.a);
}
`;



/*************************************************************************************************************************/
/*************************************************************************************************************************/

export const frag_inner_shadow_rhomboid_call = `
  vec4 new_color = inner_shadow_rhomboid();
  color = blend_mode_vec4( color, new_color );
  // color = blend_color_mix( color, new_color, color.a );
`;

export const frag_inner_shadow_rhomboid = `

/********************************************************************************************/
// SHADER UNIT: inner_shadow_rhomboid
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
// BLEND MODES FUNCTION DECLERATIONS
#ifdef BLEND_MODE 
   #include <blend_mode_directives>
#endif


#ifndef GAMMA_CORRECTION 
  #include <gamma_correction>
#endif

#ifndef BRIGHTNESS_CONTRAST 
  #include <brightness_contrast>
#endif






vec4 inner_shadow_rhomboid()
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
  // vec2 local_res = vec2(v_dim2_x*2. / res.x, v_dim2_y*2./res.y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  
  
  #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
  #endif 
  
  uv.x += v_dim2_x;
  uv.y += v_dim2_y;
  uv_map_coordinates_zero_one( uv, local_res );
  

  float repeatx = 1.;
  float repeaty = 1.;
  
  float mn = min(local_res.x,local_res.y);
  float mx = max(local_res.x,local_res.y);

  float ratio_max = mx / mn;
  float ratio_min = mn / mx;
  float ratio_inv = 1.-ratio_min;


  
  float c_hor = abs((fract(uv.x*repeatx) - .5)* 2.);
  float c_vert = abs((fract(uv.y*repeaty) - .5)* 2.);

  if(local_res.x > local_res.y) {
    c_hor = smoothstep(1.+(.4*ratio_min), ratio_inv, c_hor);
    c_vert = smoothstep(1.4, 0., c_vert);
  }
  else { 
    c_hor = smoothstep(1.4, .0, c_hor);
    c_vert = smoothstep(1.+(.4*ratio_min), ratio_inv, c_vert);
  }
  

  // if(ratio_inv==.0) return RED;

  float c = smoothmin(c_vert, c_hor, control1);
  


  float to_min=0., to_max=1., from_min=0., from_max=(control2);
  float factor = (c - from_min) / (from_max - from_min);
  float result = to_min + factor * (to_max - to_min);

  result = clamp(result, 0., 1.);
  
  vec3 color = vec3(mix(c, result, .5));
  // vec3 color = vec3(max(c, result));

  // if(uv.x<.33*ratio_min) color.r = .2;
  // if(uv.y<.33 && uv.x<.5) color.b = .2;
  
  color = brightness_contrast(color, control3*.5, control3*2.);
  // color = gamma_correction(color);
  
  float alpha = min(color.r, min(color.b, color.g));

  return vec4(color*src_color.rgb, 1.);
  // return vec4(color*src_color.rgb, alpha);
    
}
`;



/*************************************************************************************************************************/
/*************************************************************************************************************************/

export const frag_explosion_circle_call = `
  // color = blend_mode_vec4( color, frag_explosion_circle() );
  color = frag_explosion_circle();
`;

export const frag_explosion_circle = `

/********************************************************************************************/
// SHADER UNIT: frag_explosion_circle
/********************************************************************************************/


/*****************************************************/
// GENERIC GLOBAL VARIABLES DECLERATIONS
#ifndef UV_READY
  vec2 uv = vec2(0,0);
#endif



/*****************************************************/
// BLEND MODES FUNCTION DECLERATIONS
#ifdef BLEND_MODE 
   #include <blend_mode_directives>
#endif



vec4 frag_explosion_circle()
{
  #ifdef A_TIME
    float a_time = v_time;
  #endif

  #ifdef U_TIME_FLOAT
    float u_time = u_time_float;
  #endif

  #ifdef U_GENERIC_VEC3
    #include <u_generic_vec3>
  #elif defined(U_GENERIC_VEC2)
    #include <u_generic_vec2>
  #elif defined(U_GENERIC_FLOAT)
    #include <u_generic_float>
  #endif


  vec2 res = u_screen_res;
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);

  float time = a_time;

  
  
  #define UV_READY 1
  uv = gl_FragCoord.xy;
  pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);

  vec3 color = vec3(.0);

  
  float d = length(uv/dim);

  float c = 1.-smoothstep(.0, control1, d);

  // Normalize time from [0.0, 1.0] to [0.1, 0.3]
  float nt = time*.55 + .1; // To [0.1, 0.75] 
  
  float ringDiameter = 1.5*control2; // The smaller the value, the smaller the explosion ring.
  float tt = time*.8 + .2; // To [0.3, 1.] 
  float ring = smoothstep(0.0, tt, abs(d * 1.- (time*ringDiameter)));
  // return vec4(vec3(ring), 0.);

  float centerFlash = .6*nt; // The Smaller the value, the greater the flash in the center ring
  // float ex = abs(d * fract(time) * centerFlash); 
  float ex = abs(d * time * centerFlash); 
  // return vec4(vec3(ex), 0.);
  
  
  // float a = time*.85 + .2; // To [0.3, 1.] 
  // color = vec3(control3*a) / min(ring*.5, ex*1.5);
  color = vec3(control3) / min(ring*.5, ex*1.5);
  
  
  
  // color = mix(color * time, src_color.rgb, 1.-(time*.2));
  color = mix(color, src_color.rgb, 1.-(time*.2));
  

  float rev_t = 1.-time;
  // float a = (time*.8) + .2; // To [0.3, 1.] 
  // vec4 final = vec4(color*c*a*(rev_t), c*(rev_t));

  // vec4 final = vec4(color*c*(rev_t), c*(rev_t));
  vec4 final = vec4((src_color.rgb * ((rev_t*time)+.2) * c) + color*c*rev_t, c*rev_t);
  // vec4 final = vec4((src_color.rgb * ((rev_t*.5)+.3) * c) + color*c*rev_t, c*rev_t);
  // vec4 final = vec4((src_color.rgb * time*.5 * c) + color*c*rev_t, c*rev_t);
  // vec4 final = (src_color * time*.5 * c) + vec4(color*c*rev_t, c*rev_t);
  
  // final.a = .3;
  return final; 
}
`;
/**SAVE_NEW */
  // // float ringDiameter = .6*control2; // The smaller the value, the smaller the explosion ring.
  // float ringDiameter = 1.6*control2; // The smaller the value, the smaller the explosion ring.
  // // float ring = abs(c * (1.*control3)- (time*ringDiameter));
  // // float ring = abs(c*1.3 * (1.)- (time*ringDiameter));
  // // float ring = abs(c*1.3 * (time*ringDiameter));
  // float ring = abs(c*1.3 * (1.)- ((1.-time)*ringDiameter));
  // // return vec4(ring)*src_color;

  // float centerFlash = 2.6*control3; // The Smaller the value, the greater the flash in the center ring
  // // float ex = 1.-abs(c * fract(time) * centerFlash); // GOOD!
  // float ex = c-abs(c * fract(time) * centerFlash); // GOOD!
  // // float ex = 1.-abs(c * fract(time* centerFlash) ); // GOOD!
  // // float ex = .2;
  // // float ex = abs(c*1. * fract(1.-time*1.) * centerFlash)*1.; // GOOD!
  // // return vec4(ex)*src_color;
  
  
  // // color = vec3(1.) * mix(ring*1., ex*1.1, control3);
  // // color = vec3(1.) * mix(ring*1., ex*1.1, .5);
  // // color = vec3(1.) * blm_color_dodge(ring, ex);
  // color = vec3(1.) * (ring / ex);
  // return vec4(color, 0.)*src_color;

  // color = vec3(.2) / min(ring*.5, ex*1.5);
  // // color = vec3(.1) / min(ring*1.5, ex*.5);
  
  // color = mix(color, src_color.rgb, (time*.09));
  // // color = mix(color, src_color.rgb, 1.-(time*.2));

  // return vec4(color, 0.);
/** SAVE-ONLY THE FUNCTION
 *   vec3 color = vec3(.0);

  // if(uv.x > -100.) return RED;
  // if(gl_FragCoord.xy.x > 200.1) return RED;
  
  float d = length(uv)/v_dim2_x;
  // if(uv.x > -100.) return RED;
  // if(d > 1.*control1) return smoothstep(0.2, control1, RED);
  // return vec4(d*control1);
  // return vec4(d);
  float c = 1.-smoothstep(.0, .9, d);
  // return vec4(c);
  
  float ringDiameter = 1.6; // The smaller the value, the smaller the explosion ring.
  float ring = abs(c * 1.- (time*ringDiameter));
  // return vec4(ring);

  float centerFlash = .6; // The Smaller the value, the greater the flash in the center ring
  float ex = abs(c * fract(time) * centerFlash); // GOOD!
  
  // color = vec3(.2) / min(ring*.5, ex*1.5);
  color = vec3(.1) / min(ring*1.5, ex*.5);
  return vec4(1.-color, 0.5);
  
  color = mix(color, src_color.rgb, (time*.09));
  // color = mix(color, src_color.rgb, 1.-(time*.2));

  return vec4(color, 0.);
 */


  
export const FS_GLOW = `#version 300 es

precision mediump float;

in mediump vec4  v_Col;
in mediump vec2  v_Dim;
in mediump vec2  v_Wpos;
in mediump float v_Size;
in mediump float v_Time;

in mediump vec2  u_Res;


out vec4 FragColor;

void main()
{
  #ifdef A_TIME
    float a_time = v_time;
  #endif

  #ifdef U_TIME_FLOAT
    float u_time = u_time_float;
  #endif

  #ifdef U_GENERIC_VEC3
    #include <u_generic_vec3>
  #elif defined(U_GENERIC_VEC2)
    #include <u_generic_vec2>
  #elif defined(U_GENERIC_FLOAT)
    #include <u_generic_float>
  #endif


  vec2 res = u_screen_res;
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);

  float time = a_time;



  // vec2 res = u_Res;
  // // float t = v_Time;
  // float t = .5;
  // float size = v_Size;
  // vec2 uv = v_Dim/res.x;

  vec3 color = vec3(.0);

  float len = length(uv);
  float reduced = t*size; // 0.0 to .25
  // float reduced = size; // 0.0 to .25
  float d = 1.-smoothstep(.0, reduced, len);
  
  float diffuse = 1.8; // The Smaller the value, the greater the flash in the center ring
  // float diffuse = .8; // The Smaller the value, the greater the flash in the center ring
  // float ex = abs(len * fract(t) * diffuse); // GOOD!
  float ex = abs(len  * diffuse); // GOOD!
  
  color = vec3(.2) / (ex);
  // color = mix(color, v_Col.rgb, 1.-t);
  color = mix(color, v_Col.rgb, t);
	
	FragColor = vec4(color*d*(1.-t), color*d*(1.-t));
}
`;