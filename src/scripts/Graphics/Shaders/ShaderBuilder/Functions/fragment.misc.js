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



// export const frag_glow_sphere_call = '   final_color = blend_color_multiply( final_color, frag_glow_sphere() );'
export const frag_glow_sphere_call = '   final_color = blend_decider( final_color, frag_glow_sphere(), u_blend_mode );'
// export const frag_glow_sphere_call = '   final_color = blend_color_add( final_color, frag_glow_sphere() );'
// export const frag_glow_sphere_call = '   final_color = blend_mode_vec4( final_color, frag_glow_sphere() );'

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

  // #ifdef U_GENERIC_CONTROLS
    float ${u}distance = u_generic_controls[0];
    float ${u}intensity1 = u_generic_controls[1];
    float ${u}intensity2 = u_generic_controls[2];
  // #endif
  
  
  
  vec2 res = u_screen_res;
  vec2 local_res = vec2(v_dim2_x, v_dim2_y);
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  
  vec2 uv1 = gl_FragCoord.xy / local_res;                   // Map pixel: from {0 -> dim} to {0 -> 1} 
  uv1.x -= v_wpos3_x / local_res.x;                         // Invalidate any mesh world position, so that 'first' gl_FragCoord is always the meshes 'first' pixel
  uv1.y -= (res.y - (v_wpos3_y+local_res.y)) / local_res.y; // Invalidate any mesh world position.
  uv1.y -= 1.;


  /**********************************************/
  // Distance
  float dd = 1.-length( vec2(uv1.x, uv1.y ));
  // float dd = 1.-length( vec2( abs((uv1.x - .5)* 2.), abs(uv1.y - .5)* 2. ));
  dd = smoothstep(0., ${u}distance, dd);
  
  
  /**********************************************/
  // Color 1
  float c1 = dd;
  c1 = pow(c1, .4);
  c1 += dd*${u}intensity1*2.;
  
  /**********************************************/
  // Color 2
  float c2 = 1.;
  // c2 = clamp(0., 1., (dd+dd) * ${u}intensity2 * 5.);
  c2 = (dd+dd) * ${u}intensity2 * 5.;
  // c2 = pow(c2, ${u}intensity2*4.) * c2;
  
  /**********************************************/
  // Mix Colors
  // c1 = blend_mode(c1, c2);
  c1 += c2;
  
  vec3 color = vec3(c1);
  // return vec4(color, 1.);
  return vec4(color, .0);
  // return vec4(color, src_color.rgb, src_color.a);
  // return vec4(color*src_color.rgb, src_color.a);
}
`;



/*************************************************************************************************************************/
/*************************************************************************************************************************/

// export const frag_inner_shadow_rhomboid_call = `
//   // vec4 new_color = inner_shadow_rhomboid(scale_down, u_gen_ctrl_map_cnt);
//   // final_color = blend_mode_vec4( final_color, new_color );
//   inner_shadow_rhomboid(scale_down, u_gen_ctrl_map_cnt)\\`;

// export const frag_inner_shadow_rhomboid_call = '    inner_shadow_rhomboid(scale_down, u_gen_ctrl_map_cnt)';

// blend_decider(in vec4 c1, in vec4 c2, in int mode)
export const frag_inner_shadow_rhomboid_call = '  final_color = blend_decider( final_color, inner_shadow_rhomboid(scale_down, u_gen_ctrl_map_cnt), u_blend_mode );';

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






vec4 inner_shadow_rhomboid(in float scale_down, inout int u_gen_ctrl_map_cnt)
{

  // #ifdef U_GENERIC_VEC3
  //   #include <u_generic_vec3>
  // #elif defined(U_GENERIC_VEC2)
  //   #include <u_generic_vec2>
  // #elif defined(U_GENERIC_FLOAT)
  //   #include <u_generic_float>
  // #endif

  // int u_gen_ctrl_map_cnt = 0;

  float ${u}control1 = u_generic_controls[u_gen_ctrl_map_cnt++];
  float ${u}control2 = u_generic_controls[u_gen_ctrl_map_cnt++];
  float ${u}control3 = u_generic_controls[u_gen_ctrl_map_cnt++];


  vec2 res = u_screen_res;
  vec2 local_res = vec2(v_dim2_x*2., v_dim2_y*2.);
  // vec2 local_res = vec2(v_dim2_x*2. / res.x, v_dim2_y*2./res.y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  
  
  // #ifndef UV_READY
  //   #define UV_READY 1
  //   uv = gl_FragCoord.xy;
  //   pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
  //   uv *= scale_down; // HACK: For cases that the object is scaled down
  //   // pixel_apply_world_position_offset_x(m_uv, wpos) ( (m_uv) -= (wpos) )
  //   // pixel_apply_reverse_y_coordinates(m_uv, resolution_height) ( (m_uv) = (resolution_height) - (m_uv) )
  //   // pixel_apply_world_position_offset_y(m_uv, wpos) ( (m_uv) -= (wpos) )
  // #endif 
    
  uv = gl_FragCoord.xy;
  uv.x -= v_wpos3_x;
  uv.y = u_screen_res.y - uv.y;
  uv.y -= v_wpos3_y;
  // float ratio = local_res.x / local_res.y;
  // uv /= local_res; 
  // uv.x *= ratio;
  // uv.y *= -1.; // Reverse y coord. bottom:-1 up:1
  uv *= scale_down; // HACK: For cases that the object is scaled down
  
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

  // TODO: Remove condition
  if(local_res.x > local_res.y) {
    c_hor = smoothstep(1.+(.4*ratio_min), ratio_inv, c_hor);
    c_vert = smoothstep(1.4, 0., c_vert);
  }
  else { 
    c_hor = smoothstep(1.4, .0, c_hor);
    c_vert = smoothstep(1.+(.4*ratio_min), ratio_inv, c_vert);
  }
  

  float c = smoothmin(c_vert, c_hor, ${u}control1);


  float to_min=0., to_max=1., from_min=0., from_max=(${u}control2);
  float factor = (c - from_min) / (from_max - from_min);
  float result = to_min + factor * (to_max - to_min);

  result = clamp(result, 0., 1.);
  
  vec3 color = vec3(mix(c, result, .5));
  color = brightness_contrast(color, ${u}control3*.5, ${u}control3*2.);
  float alpha = min(color.r, min(color.b, color.g));

  return vec4(color*src_color.rgb, 1.);
    
}
`;



/*************************************************************************************************************************/
/*************************************************************************************************************************/

// export const frag_explosion_circle_call = `
//   // final_color = blend_color_add( final_color, frag_explosion_circle(scale_down, u_gen_ctrl_map_cnt) );
//   final_color = blend_color_add( final_color, frag_explosion_circle(scale_down) );
// `;
export const frag_explosion_circle_call = '  final_color = blend_decider( final_color, frag_explosion_circle(scale_down), u_blend_mode );';

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



// vec4 frag_explosion_circle(in float scale_down, inout int u_gen_ctrl_map_cnt)
vec4 frag_explosion_circle(in float scale_down)
{
  #ifdef A_TIME
    float a_time = v_time;
  #endif

  #ifdef U_TIME_FLOAT
    float u_time = u_time_float;
  #endif


  // float smoothstep_outer = u_generic_controls[u_gen_ctrl_map_cnt++];
  // float ringDiameter = u_generic_controls[u_gen_ctrl_map_cnt++] * 1.5; // The smaller the value, the smaller the explosion ring.
  // float intensity = u_generic_controls[u_gen_ctrl_map_cnt++];
  // float center_glow_start = u_generic_controls[u_gen_ctrl_map_cnt++]; // start: between 0-1; If start=0.8, then 0.8-1.0 will give a smaller center glow
  float smoothstep_outer = 1.;
  float ringDiameter = 1.5*v_generic2_x; // The smaller the value, the smaller the explosion ring.
  float intensity = v_generic2_y;
  float center_glow_start = .9; // start: between 0-1; If start=0.8, then 0.8-1.0 will give a smaller center glow

  vec2 res = u_screen_res;
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);

  float time = a_time;

  
  
  #define UV_READY 1
  uv = gl_FragCoord.xy;
  pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);

  float mod = src_color.a;
  vec3 color = vec3(.0);
  
  float d = length(uv/dim) / scale_down;

  float c = 1.-smoothstep(.0, smoothstep_outer, d);

  // Normalize time from [0.0, 1.0] to [0.1, 0.3]
  float nt = time*.55 + .1; // To [0.1, 0.75] 
  
  float tt = time*.8 + .2; // To [0.3, 1.] 
  float ring = smoothstep(0.0, tt, abs(d * 1.- (time*ringDiameter)));
  
  
  
  float centerFlash = .2*nt; // The Smaller the value, the greater the flash in the center ring
  float cg = (time*(1.0-center_glow_start) + center_glow_start); // 'Delay' the center glow (smaller) 
  float ex = (d * cg * centerFlash); 
  
  float dim_down = 4.1;

  float ring_width = .5; // Small values, larger width
  // color = vec3(v_generic2_y) / min(ring*ring_width, ex);
  color = vec3(intensity) / min(ring*ring_width, ex);

  
  color = mix(color, src_color.rgb, 1.-(time*.2));
  
  
  
  // float rev_t = 1.-(time*.8+.1);
  float rev_t = 1.-(time*1.+.1);
  vec4 final = vec4((src_color.rgb * ((rev_t*time)+.2) * c) + color*c*rev_t, c*rev_t);
  // vec4 final = vec4(color*c*rev_t, c*rev_t);
  
  final *= src_color.a;
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



/*************************************************************************************************************************/
/*************************************************************************************************************************/

// export const frag_explosion_glow_call = `
//   vec4 new_color = frag_explosion_glow();
//   final_color = new_color;
// `;
export const frag_explosion_glow_call = '  final_color = blend_decider( final_color, frag_explosion_glow(), u_blend_mode );'

export const frag_explosion_glow = `

/********************************************************************************************/
// SHADER UNIT: frag_explosion_glow
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





vec4 frag_explosion_glow()
{
// TODO: Implement with u_generic_controls[counter++] from fragment main() 
  #ifdef U_GENERIC_CONTROLS
    int u_gen_ctrl_map_cnt = 0;
  #endif

  float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
  float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];

  vec2 res = u_screen_res;
  vec2 local_res = vec2(v_dim2_x*2., v_dim2_y*2.);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  float time = v_time;
  float rev_time = 1. - time;
  
  #define UV_READY 1
  uv = gl_FragCoord.xy;
  pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
  
  uv_map_coordinates_zero_one( uv, local_res );
  
  // ctrl1
  float d = .7 - length(uv)*2.*${u}ctrl1+(rev_time*.5);
  
  // ctrl2
  float c = d * smoothstep(${u}ctrl2, 1.*rev_time, (d));
  
  c *=c;

  /* Animate a control from high to low for the third parameters of the smoothmin function */
  // c = smoothmin(c,  2.*u_generic_controls[u_gen_ctrl_map_cnt++], c*u_generic_controls[u_gen_ctrl_map_cnt++]);


  return vec4(c*rev_time*rev_time) * src_color;
  // return vec4(c*rev_time*rev_time);
  // return vec4(c);
  // return RED;
  // return vec4(vec3(c), c*time*time);
    
}
`;