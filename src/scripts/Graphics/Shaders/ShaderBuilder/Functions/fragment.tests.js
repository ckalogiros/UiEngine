"use strict";









/*************************************************************************************************************************/
/*************************************************************************************************************************/
export const frag_test1_call = '   color = blend_color( color, frag_test1() );'

export const frag_test1 = `

/********************************************************************************************/
// SHADER UNIT: frag_test1
/********************************************************************************************/

#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif

// #define abs(a) (a) 


float smoothmin(float a, float b, float k)
{
  if (k != 0.0) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
  }
  else {
    return min(a, b);
  }
}

float gamma_correction(float c)
{
  if (c < 0.04045f) {
    return (c < 0.0f) ? 0.0f : c * (1.0f / 12.92f);
  }

  return pow((c + 0.055f) * (1.0f / 1.055f), 2.4f);
}

vec3 gamma_correction(vec3 c)
{
  float r = gamma_correction(c.r);
  float g = gamma_correction(c.g);
  float b = gamma_correction(c.b);

  return vec3(r, g, b);
}

vec3 brightness_contrast(vec3 color, float brightness, float contrast)
{
  float a = 1.0 + contrast;
  float b = brightness - contrast * 0.5f;

  color.x = max(a * color.x + b, 0.0f);
  color.y = max(a * color.y + b, 0.0f);
  color.z = max(a * color.z + b, 0.0f);

  return color;
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
  vec2 uv1 = (gl_FragCoord.xy / local_res); // Map pixel: from {0 -> dim} to {0 -> 1} 
  vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);

  
  uv1.x -= v_wpos3_x / local_res.x; // Invalidate any mesh world position, so that 'first' gl_FragCoord is always the meshes 'first' pixel
  uv1.y -= (res.y - (v_wpos3_y+local_res.y)) / local_res.y; // Invalidate any mesh world position.
  

  float repeatx = 4.;
  float repeaty = 4.;

  
  float c_vert = abs((fract(uv1.x*repeatx) - .5)* 2.);
  // c_vert = smoothstep(0., 1.3, c_vert);
  c_vert = smoothstep(0., 1.3, c_vert);
  c_vert = 1.-c_vert;
  
  float c_hor = abs((fract(uv1.y*repeaty) - .5)* 2.);
  // c_hor = smoothstep(0., 1.3, c_hor);
  c_hor = smoothstep(0., 1.3, c_hor);
  c_hor = 1.-c_hor;
  

  // return vec4(vec3(c_vert), 1.);
  
  float c = smoothmin(c_vert, c_hor, control1);
  
  // return vec4(vec3(c), 1.);


  float to_min=0., to_max=1., from_min=0., from_max=(control2);
  // float to_min=0., to_max=2., from_min=control2, from_max=control2+.3; // !!Intresting!!
  float factor = (c - from_min) / (from_max - from_min);
  float result = to_min + factor * (to_max - to_min);
  // float result = smoothstep(control3, 2.*control3, to_min + factor * (to_max - to_min));

  // result = clamp(result, 0., 1.3*(1.-control3));
  result = clamp(result, 0., 1.);
  // result = pow(result, 4.*control3);
  
  // c = result;
  // c *= result;
  // c = gamma_correction(result);
  // c = result*result*result;
  // c = clamp(result, 0., 1.);
  
  
  
  // vec3 color = vec3(mix(c, result, control3));
  vec3 color = vec3(mix(c, result, .5));
  // vec3 color = vec3(max(c, result));
  // vec3 color = vec3(c);
  // vec3 color = vec3(result);
  
  color = brightness_contrast(color, control3*.5, control3*2.);
  // color = gamma_correction(color);
  
  // if(uv1.y > .9) return vec4(.0, .0, 1., 1.);
  // if(uv1.x > .9) return vec4(1., 0., 0., 1.);

  return vec4(color*src_color.rgb, src_color.a);
    
}
`;





/*************************************************************************************************************************/
/*************************************************************************************************************************/
export const frag_test2_call = '   color = blend_color( color, frag_test1() );'

export const frag_test2 = `

/********************************************************************************************/
// SHADER UNIT: frag_test1
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




// float gamma_correction(float c) {

//   if (c < 0.04045f) {
//     return (c < 0.0f) ? 0.0f : c * (1.0f / 12.92f);
//   }

//   return pow((c + 0.055f) * (1.0f / 1.055f), 2.4f);
// }

vec4 permute ( vec4 x)
{
  return mod ((34.0 * x + 1.0) * x, 289.0) ;
}
vec2 cellular2x2(vec2 P, float ctrl1, float ctrl2)
{
  const float K = 1.0/7.0;
  const float K2 = 0.5/7.0;
  const float jitter = 0.8; // jitter 1.0 makes F1 wrong more often
  vec2 Pi = mod( floor (P), 289.0) ;
  vec2 Pf = fract (P);
  vec4 Pfx = Pf.x + vec4 ( -0.5 , -1.5 , -0.5 , -1.5) ;
  vec4 Pfy = Pf.y + vec4 ( -0.5 , -0.5 , -1.5 , -1.5) ;
  vec4 p = permute (Pi.x + vec4 (0.0 , 1.0 , 0.0 , 1.0) );
  p = permute (p + Pi.y + vec4 (0.0 , 0.0 , 1.0 , 1.0) );
  vec4 ox = mod(p, 7.0) * K + K2;
  vec4 oy = mod( floor (p * K) ,7.0) * K + K2;
  vec4 dx = Pfx + jitter * ox ;
  vec4 dy = Pfy + jitter * oy ;
  vec4 d = dx * dx + dy * dy; // distances squared
  // Cheat and pick only F1 for the return value
  d.xy = min(d.xy , d.zw);
  d.x = min(d.x, d.y);
  return d.xx; // F1 duplicated , F2 not computed
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

  
  vec2 st = uv1; // Texture coordinates
  vec2 F = cellular2x2(st*10., control1, control2);
  float n = 1.0 - 1.5 * F.x * control1;
  // float n = 1.0 - F.x * F.x * control1;
  
  vec3 color = vec3(n, n, n);
  return vec4(color, 1.0);



  // float repeatx = 1.;
  // float repeaty = 1.;

  // float dd = 1.-length( vec2( abs((fract(uv1.x*repeatx) - .5)* 2.), abs((fract(uv1.y*repeaty) - .5)* 2.) ));
  // dd = smoothstep(0., control1, dd);
  
  // float c = dd;

  // /**********************************************/
  // // Color 1
  // c = pow(c, .4);
  // // c *= pow(c, .2);
  // c += dd*control2*2.;
  
  // /**********************************************/
  // // Color 2
  // float c2 = 1.;
  // c2 = (dd+dd) * control3 * 5.;
  // // c2 = pow(c2, control3*4.) * c2;
  
  // /**********************************************/
  // // Mix Colors 2
  // c = blend_mode(c, c2);
  // // c = mix(c, c2, control3);

  // vec3 color = vec3(c);
  // return vec4(blm_multiply(color, src_color.rgb), src_color.a);
  // // return vec4(color*src_color.rgb, src_color.a);
}
`;

/** 
 * Cellular noise (" Worley noise ") in 2D in GLSL , simplified version .
// Copyright (c) Stefan Gustavson 2011 -04 -19. All rights reserved .
// This code is released under the conditions of the MIT license .
// See LICENSE file for details .
vec4 permute ( vec4 x)
{
  return mod ((34.0 * x + 1.0) * x, 289.0) ;
}
vec2 cellular2x2( vec2 P)
{
  const float K = 1.0/7.0;
  const float K2 = 0.5/7.0;
  const float jitter = 0.8; // jitter 1.0 makes F1 wrong more often
  vec2 Pi = mod( floor (P), 289.0) ;
  vec2 Pf = fract (P);
  vec4 Pfx = Pf.x + vec4 ( -0.5 , -1.5 , -0.5 , -1.5) ;
  vec4 Pfy = Pf.y + vec4 ( -0.5 , -0.5 , -1.5 , -1.5) ;
  vec4 p = permute (Pi.x + vec4 (0.0 , 1.0 , 0.0 , 1.0) );
  p = permute (p + Pi.y + vec4 (0.0 , 0.0 , 1.0 , 1.0) );
  vec4 ox = mod(p, 7.0) * K + K2;
  vec4 oy = mod( floor (p * K) ,7.0) * K + K2;
  vec4 dx = Pfx + jitter * ox ;
  vec4 dy = Pfy + jitter * oy ;
  vec4 d = dx * dx + dy * dy; // distances squared
  // Cheat and pick only F1 for the return value
  d.xy = min(d.xy , d.zw);
  d.x = min(d.x, d.y);
  return d.xx; // F1 duplicated , F2 not computed
  }
  varying vec2 st; // Texture coordinates
  void main (void ) {
  vec2 F = cellular2x2(st);
  float n = 1.0 - 1.5 * F.x;
  gl_FragColor = vec4(n.xxx , 1.0) ;
} */