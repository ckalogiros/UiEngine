"use strict";



/**************************************************************************************************************************************/
// Generic
const version                    = "#version 300 es";
const precision_medium           = "precision mediump float;";
const precision_high             = "precision highp float;";



/**************************************************************************************************************************************/
// Vertex Shader Shader 
const u_orthoProj_in             = 'uniform mat4 u_projection;';



/**************************************************************************************************************************************/
// Fragment Shader 
const out_frag_color     = 'out vec4 frag_color;';
const frag_u_sampler0    = 'uniform sampler2D u_sampler0;';



/**************************************************************************************************************************************/
// Generic Uniforms Includes
const u_generic_vec4 = 
`float control1 = u_generic_vec4.x;
float control2 = u_generic_vec4.y;
float control3 = u_generic_vec4.z;
float control4 = u_generic_vec4.w;`;
const u_generic_vec3 = 
`float control1 = u_generic_vec3.x;
float control2 = u_generic_vec3.y;
float control3 = u_generic_vec3.z;`;
const u_generic_vec2 = 
`    float control1 = u_generic_vec2.x;
    float control2 = u_generic_vec2.y;`;
const u_generic_float = 
`    float control1 = u_generic_float;`;
const u_time_float = 
`    float u_time = u_time_float;`;

const u_glow_params_vec3 = 
// `float outer = u_glow_params.x;
`float outer = u_glow_params.x + .4;
float inner  = u_glow_params.y;
float intensity  = u_glow_params.z;`;

const u_round_corners_params_vec3 = 
`float outer = u_rcorners.x + .4;
float inner  = u_rcorners.y;
float intensity  = u_rcorners.z;`;






/**************************************************************************************************************************************/
// Misc Shader Functions

const coordinate_system_functions = 
`// Coordinate System Functions
#define pixel_apply_world_position_offset_x(m_uv, wpos) ( (m_uv) -= (wpos) )
#define pixel_apply_reverse_y_coordinates(m_uv, resolution_height) ( (m_uv) = (resolution_height) - (m_uv) )
#define pixel_apply_world_position_offset_y(m_uv, wpos) ( (m_uv) -= (wpos) )
#define uv_map_coordinates_zero_one( m_uv, dimentions ) ( (m_uv) /= (dimentions) )
#define uv_map_coordinates_minusone_one( m_uv, dimentions ) ( (((m_uv) /= (dimentions)) * 2.0) - 1.0 )

void pixel_map_model_space_coordinates( inout vec2 m_uv, in vec2 screen_dimentions, in float wposx, in float wposy ) {
  
  pixel_apply_world_position_offset_x(m_uv.x, wposx); 
  pixel_apply_reverse_y_coordinates(m_uv.y, screen_dimentions.y); 
  pixel_apply_world_position_offset_y(m_uv.y, wposy); 
}

void pixel_map_screen_space_coordinates_zero_one( inout vec2 m_uv, in vec2 screen_dimentions, in float wposx, in float wposy ) {
  
  pixel_apply_world_position_offset_x(m_uv.x, wposx); 
  pixel_apply_reverse_y_coordinates(m_uv.y, screen_dimentions.y); 
  pixel_apply_world_position_offset_y(m_uv.y, wposy); 
  uv_map_coordinates_zero_one(m_uv, screen_dimentions);
}
void pixel_map_model_space_coordinates_zero_one( inout vec2 m_uv, in vec2 screen_dimentions, in float wposx, in float wposy, in vec2 model_dimentions ) {
   
  pixel_apply_world_position_offset_x(m_uv.x, wposx); 
  pixel_apply_reverse_y_coordinates(m_uv.y, screen_dimentions.y); 
  pixel_apply_world_position_offset_y(m_uv.y, wposy); 
  m_uv.x -= model_dimentions.x;
  m_uv.y -= -model_dimentions.y;
  uv_map_coordinates_zero_one(m_uv, model_dimentions);
}

void pixel_map_screen_space_coordinates_minusone_one( inout vec2 m_uv, in vec2 screen_dimentions, in float wposx, in float wposy, in vec2 model_dimentions ) {
   
  pixel_apply_world_position_offset_x(m_uv.x, wposx); 
  pixel_apply_reverse_y_coordinates(m_uv.y, screen_dimentions.y); 
  pixel_apply_world_position_offset_y(m_uv.y, wposy); 
  m_uv -= model_dimentions;
  uv_map_coordinates_minusone_one(m_uv, screen_dimentions);
}
void pixel_map_model_space_coordinates_minusone_one( inout vec2 m_uv, in vec2 screen_dimentions, in float wposx, in float wposy, in vec2 model_dimentions ) {
   
  pixel_apply_world_position_offset_x(m_uv.x, wposx); 
  pixel_apply_reverse_y_coordinates(m_uv.y, screen_dimentions.y); 
  pixel_apply_world_position_offset_y(m_uv.y, wposy); 
  m_uv -= model_dimentions;
  // uv_map_coordinates_minusone_one(m_uv, model_dimentions);
}`;

const smoothmin = `
#define SMOOTH_MIN 1
float smoothmin(in float a, in float b, in float k) {
  // TODO: Remove condition
  if (k != 0.0) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
  }
  else {
    return min(a, b);
  }
}`;
const brightness_contrast = `
#define BRIGHTNESS_CONTRAST 1
vec3 brightness_contrast(vec3 color, float brightness, float contrast) {
  float a = 1.0 + contrast;
  float b = brightness - contrast * 0.5f;
  color.x = max(a * color.x + b, 0.0f);
  color.y = max(a * color.y + b, 0.0f);
  color.z = max(a * color.z + b, 0.0f);
  return color;
}`;
const gamma_correction = `
#define GAMMA_CORRECTION 1
float gamma_correction(float c1) {
   if (c1 < 0.04045f)
      return (c1 < 0.0f) ? 0.0f : c1 * (1.0f / 12.92f);
   return pow((c1 + 0.055f) * (1.0f / 1.055f), 2.4f);
}
vec3 gamma_correction(vec3 c) {
  float r = gamma_correction(c.r);
  float g = gamma_correction(c.g);
  float b = gamma_correction(c.b);
  return vec3(r, g, b);
}`;
const hash_function = `
#define HASH_FUNCTION 1
// procedural Noise from IQ
vec2 hash_function(vec2 p) {
   p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
   return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}`;
const noise_hash = `
#define NOISE_HASH 1
float noise_hash(in vec2 p) {
  const float K1 = 0.366025404; // (sqrt(3)-1)/2;
  const float K2 = 0.211324861; // (3-sqrt(3))/6;
  vec2 i = floor( p + (p.x+p.y)*K1 );
  vec2 a = p - i + (i.x+i.y)*K2;
  vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0*K2;
  vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
  vec3 n = h*h*h*h*h*vec3( dot(a,hash_function(i+0.0)), dot(b,hash_function(i+o)), dot(c,hash_function(i+1.0)));
  return dot( n, vec3(100.0) );
}`;
const noise_fbm = `
#define NOISE_FBM 1
float fbm(vec2 p){
  float f; float n = 1.4; float a = 0.1;
  mat2 m = mat2( n, -n, n,  n );
  f  = 0.5000 * noise_hash(p); p = m*p; f += 0.2500 * noise_hash(p); p = m*p; f += 0.1250 * noise_hash(p); p = m*p; f += 0.0625 * noise_hash(p); p = m*p; f = 0.55 + 0.5*f; 
  return f;
}`;

/**************************************************************************************************************************************
 * Blend Mode Functions
 * 
 * multiply:    ab
 * add:         a+b
 * screen:      1-(1-a)(1-b)
 * darken:      min(a,b)
 * color burn:  1-(1-a)/b
 * subtract:    a-b
 * divide:      a/b
 * lighten:     max(a,b)
 * color dodge: a/(1-b)
 * overlay:     if a<=0.5: (2*a)*b 
 *              else 1-(1-2(a-0.5))*(1-b)
 * Edit: changed the color dodge formula to match what wikipedia 1 says about it.
 */


const blend_mode_add          = '( (a)+(b) )';
const blend_mode_subtract     = '( (a)-(b) )';
const blend_mode_multiply     = '( (a)*(b) )';
const blend_mode_divide       = '( (a)/(b) )';
const blend_mode_lighten      = 'max(a,b)';
const blend_mode_darken       = 'min(a,b)';
const blend_mode_color_burn   = '( 1.-(1.-(a))/(b) )';
const blend_mode_color_dodge  = '( (a)/(1.-(b)) )';
const blend_mode_screen       = '( 1.-(1.-(a))*(1.-(b)) )';
const blend_mode_overlay      = `( (a)<=0.5 ) ? ( (2.*(a))*(b) ) : ( 1.-(1.-2.*((a)-0.5))*(1.-(b)) )`;
const blend_mode_mix          = `( ((a)*(1.-(c))) + ((b)*(c)) )`;
// const blend_mode_remove_b_from_a       = `( ((a)*(b/a)) )`;
const blend_mode_remove_b_from_a       = `( ( (a) > (0.0) ) ? (a) : (b) )`;
// const blend_mode_remove_b_from_a       = `( ((b) * (1.-a)) + (a*a) )`;
// const blend_mode_remove_b_from_a       = `( ((a)*(1.-(a))) + ((b)*(b)) )`;



const blend_mode_functions   = 
`
#define blm_add(a, b)         ${blend_mode_add}
#define blm_subtract(a, b)    ${blend_mode_subtract}
#define blm_multiply(a, b)    ${blend_mode_multiply}
#define blm_divide(a, b)      ${blend_mode_divide}
#define blm_lighten(a, b)     ${blend_mode_lighten}
#define blm_darken(a, b)      ${blend_mode_darken}
#define blm_color_burn(a, b)  ${blend_mode_color_burn}
#define blm_color_dodge(a, b) ${blend_mode_color_dodge}
#define blm_screen(a, b)      ${blend_mode_screen}
#define blm_overlay(a, b)     ${blend_mode_overlay}
#define blm_remove_b_from_a(a, b)     ${blend_mode_remove_b_from_a}
#define blm_mix(a, b, c)      ${blend_mode_remove_b_from_a}`;




// Blend functions oveloads
const blend_color_add_vec4    = `vec4( blm_add(a.r, b.r), blm_add(a.g, b.g), blm_add(a.b, b.b), blm_add(a.a, b.a) )`;
const blend_color_add_vec3    = `vec3( blm_add(a.r, b.r), blm_add(a.g, b.g), blm_add(a.b, b.b) )`;
const blend_color_add_vec4_3  = `vec4( blm_add(a.r, b.r), blm_add(a.g, b.g), blm_add(a.b, b.b), a.a )`;
const blend_color_subtract_vec4    = `vec4( blm_subtract(a.r, b.r), blm_subtract(a.g, b.g), blm_subtract(a.b, b.b), blm_subtract(a.a, b.a) )`;
const blend_color_subtract_vec3    = `vec3( blm_subtract(a.r, b.r), blm_subtract(a.g, b.g), blm_subtract(a.b, b.b) )`;
const blend_color_subtract_vec4_3  = `vec4( blm_subtract(a.r, b.r), blm_subtract(a.g, b.g), blm_subtract(a.b, b.b), a.a )`;
const blend_color_multiply_vec4    = `vec4( blm_multiply(a.r, b.r), blm_multiply(a.g, b.g), blm_multiply(a.b, b.b), blm_multiply(a.a, b.a) )`;
const blend_color_multiply_vec3    = `vec3( blm_multiply(a.r, b.r), blm_multiply(a.g, b.g), blm_multiply(a.b, b.b) )`;
const blend_color_multiply_vec4_3  = `vec4( blm_multiply(a.r, b.r), blm_multiply(a.g, b.g), blm_multiply(a.b, b.b), a.a )`;
const blend_color_divide_vec4    = `vec4( blm_divide(a.r, b.r), blm_divide(a.g, b.g), blm_divide(a.b, b.b), blm_divide(a.a, b.a) )`;
const blend_color_divide_vec3    = `vec3( blm_divide(a.r, b.r), blm_divide(a.g, b.g), blm_divide(a.b, b.b) )`;
const blend_color_divide_vec4_3  = `vec4( blm_divide(a.r, b.r), blm_divide(a.g, b.g), blm_divide(a.b, b.b), a.a )`;
const blend_color_lighten_vec4    = `vec4( blm_lighten(a.r, b.r), blm_lighten(a.g, b.g), blm_lighten(a.b, b.b), blm_lighten(a.a, b.a) )`;
const blend_color_lighten_vec3    = `vec3( blm_lighten(a.r, b.r), blm_lighten(a.g, b.g), blm_lighten(a.b, b.b) )`;
const blend_color_lighten_vec4_3  = `vec4( blm_lighten(a.r, b.r), blm_lighten(a.g, b.g), blm_lighten(a.b, b.b), a.a )`;
const blend_color_darken_vec4    = `vec4( blm_darken(a.r, b.r), blm_darken(a.g, b.g), blm_darken(a.b, b.b), blm_darken(a.a, b.a) )`;
const blend_color_darken_vec3    = `vec3( blm_darken(a.r, b.r), blm_darken(a.g, b.g), blm_darken(a.b, b.b) )`;
const blend_color_darken_vec4_3  = `vec4( blm_darken(a.r, b.r), blm_darken(a.g, b.g), blm_darken(a.b, b.b), a.a )`;
const blend_color_burn_vec4     = `vec4( blm_color_burn(a.r, b.r),  blm_color_burn(a.g, b.g),  blm_color_burn(a.b, b.b), blm_color_burn(a.a, b.a) )`;
const blend_color_burn_vec3     = `vec3( blm_color_burn(a.r, b.r),  blm_color_burn(a.g, b.g),  blm_color_burn(a.b, b.b) )`;
const blend_color_burn_vec4_3   = `vec4( blm_color_burn(a.r, b.r),  blm_color_burn(a.g, b.g),  blm_color_burn(a.b, b.b), a.a )`;
const blend_color_dodge_vec4    = `vec4( blm_color_dodge(a.r, b.r), blm_color_dodge(a.g, b.g), blm_color_dodge(a.b, b.b), blm_color_dodge(a.a, b.a) )`;
const blend_color_dodge_vec3    = `vec3( blm_color_dodge(a.r, b.r), blm_color_dodge(a.g, b.g), blm_color_dodge(a.b, b.b) )`;
const blend_color_dodge_vec4_3  = `vec4( blm_color_dodge(a.r, b.r), blm_color_dodge(a.g, b.g), blm_color_dodge(a.b, b.b), a.a )`;
const blend_color_mix_vec4    = `vec4( blm_mix(a.r, b.r, c), blm_mix(a.g, b.g, c), blm_mix(a.b, b.b, c), blm_mix(a.a, b.a, c) )`;
const blend_color_mix_vec3    = `vec3( blm_mix(a.r, b.r, c), blm_mix(a.g, b.g, c), blm_mix(a.b, b.b, c) )`;
const blend_color_mix_vec4_3  = `vec4( blm_mix(a.r, b.r, c), blm_mix(a.g, b.g, c), blm_mix(a.b, b.b, c), a.a )`;
const blend_color_screen_vec4    = `vec4( blm_screen(a.r, b.r), blm_screen(a.g, b.g), blm_screen(a.b, b.b), blm_screen(a.a, b.a) )`;
const blend_color_screen_vec3    = `vec3( blm_screen(a.r, b.r), blm_screen(a.g, b.g), blm_screen(a.b, b.b) )`;
const blend_color_screen_vec4_3  = `vec4( blm_screen(a.r, b.r), blm_screen(a.g, b.g), blm_screen(a.b, b.b), a.a )`;
const blend_color_overlay_vec4    = `vec4( blm_overlay(a.r, b.r), blm_overlay(a.g, b.g), blm_overlay(a.b, b.b), blm_overlay(a.a, b.a) )`;
const blend_color_overlay_vec3    = `vec3( blm_overlay(a.r, b.r), blm_overlay(a.g, b.g), blm_overlay(a.b, b.b) )`;
const blend_color_overlay_vec4_3  = `vec4( blm_overlay(a.r, b.r), blm_overlay(a.g, b.g), blm_overlay(a.b, b.b), a.a )`;

const blend_color_blend_mode_remove_b_from_a_vec4    = `vec4( blm_remove_b_from_a(a.r, b.r), blm_remove_b_from_a(a.g, b.g), blm_remove_b_from_a(a.b, b.b), blm_remove_b_from_a(a.a, b.a) )`;
const blend_color_blend_mode_remove_b_from_a_vec3    = `vec3( blm_remove_b_from_a(a.r, b.r), blm_remove_b_from_a(a.g, b.g), blm_remove_b_from_a(a.b, b.b) )`;
const blend_color_blend_mode_remove_b_from_a_vec4_3  = `vec4( blm_remove_b_from_a(a.r, b.r), blm_remove_b_from_a(a.g, b.g), blm_remove_b_from_a(a.b, b.b), a.a )`;



// To be called from fragment shader functions, not the fragment shader builder
const blend_mode_directives   = 
`   
#ifdef BLEND_MODE_ADD
  #define blend_mode(a, b) blm_add(a, b)
  #define blend_mode_vec4(a, b) blend_color_add(a, b)

#elif defined(BLEND_MODE_SUBTRACT)
  #define blend_mode(a, b) blm_subtract(a, b)
  #define blend_mode_vec4(a, b) blend_color_subtract(a, b)

#elif defined (BLEND_MODE_MULTIPLY) 
  #define blend_mode(a, b) blm_multiply(a,b)
  #define blend_mode_vec4(a, b) blend_color_multiply(a, b)

#elif defined(BLEND_MODE_DIVIDE)
  #define blend_mode(a, b) blm_divide(a, b)
  #define blend_mode_vec4(a, b) blend_color_divide(a, b)

#elif defined(BLEND_MODE_LIGHTEN)
  #define blend_mode(a, b) blm_lighten(a, b)
  #define blend_mode_vec4(a, b) blend_color_lighten(a, b)

#elif defined(BLEND_MODE_DARKEN)
  #define blend_mode(a, b) blm_darken(a, b)
  #define blend_mode_vec4(a, b) blend_color_darken(a, b)

#elif defined(BLEND_MODE_COLOR_BURN)
  #define blend_mode(a, b) blm_color_burn(a, b)
  #define blend_mode_vec4(a, b) blend_color_burn(a, b)

#elif defined(BLEND_MODE_COLOR_DODGE)
  #define blend_mode(a, b) blm_color_dodge(a, b)
  #define blend_mode_vec4(a, b) blend_color_dodge(a, b)

#elif defined(BLEND_MODE_SCREEN)
  #define blend_mode(a, b) blm_screen(a, b)
  #define blend_mode_vec4(a, b) blend_color_screen(a, b)

#elif defined(BLEND_MODE_OVERLAY)
  #define blend_mode(a, b) blm_overlay(a, b)
  #define blend_mode_vec4(a, b) blend_color_overlay(a, b)

#elif defined(BLEND_MODE_REMOVE_B_FROM_A)
  #define blend_mode(a, b) blm_remove_b_from_a(a, b)
  #define blend_mode_vec4(a, b) blend_color_remove_b_from_a(a, b)

#elif defined(BLEND_MODE_MIX)
#define blend_mode(a, b) blm_mix(a, b)

#elif defined(BLEND_MODE_MASK)
#define blend_mode_vec4(a, b) blend_color_mask(a, b)

#elif defined(BLEND_MODE_ALPHA)
#define blend_mode_vec4(a, b) blend_color_alpha(a, b)

#else // Default
#define blend_mode(a, b) blm_add(a, b)
#define blend_mode_vec4(a, b) blend_color_multiply(a, b)
#endif
`;




const blend_color_functions_overloads = 
`
vec4 blend_color_add(vec4 a, vec4 b) { return ${blend_color_add_vec4  }; }
vec4 blend_color_add(vec4 a, vec3 b) { return ${blend_color_add_vec4_3}; }
vec3 blend_color_add(vec3 a, vec3 b) { return ${blend_color_add_vec3  }; }
vec4 blend_color_subtract(vec4 a, vec4 b) { return ${blend_color_subtract_vec4  }; }
vec4 blend_color_subtract(vec4 a, vec3 b) { return ${blend_color_subtract_vec4_3}; }
vec3 blend_color_subtract(vec3 a, vec3 b) { return ${blend_color_subtract_vec3  }; }
vec4 blend_color_multiply(vec4 a, vec4 b) { return ${blend_color_multiply_vec4  }; }
vec4 blend_color_multiply(vec4 a, vec3 b) { return ${blend_color_multiply_vec4_3}; }
vec3 blend_color_multiply(vec3 a, vec3 b) { return ${blend_color_multiply_vec3  }; }
vec4 blend_color_divide(vec4 a, vec4 b) { return ${blend_color_divide_vec4   }; }
vec4 blend_color_divide(vec4 a, vec3 b) { return ${blend_color_divide_vec4_3 }; }
vec3 blend_color_divide(vec3 a, vec3 b) { return ${blend_color_divide_vec3   }; }
vec4 blend_color_lighten(vec4 a, vec4 b) { return ${blend_color_lighten_vec4  }; }
vec4 blend_color_lighten(vec4 a, vec3 b) { return ${blend_color_lighten_vec4_3}; }
vec3 blend_color_lighten(vec3 a, vec3 b) { return ${blend_color_lighten_vec3  }; }
vec4 blend_color_darken(vec4 a, vec4 b) { return ${blend_color_darken_vec4  }; }
vec4 blend_color_darken(vec4 a, vec3 b) { return ${blend_color_darken_vec4_3}; }
vec3 blend_color_darken(vec3 a, vec3 b) { return ${blend_color_darken_vec3  }; }
vec4 blend_color_burn(vec4 a, vec4 b)  { return ${blend_color_burn_vec4  }; }
vec4 blend_color_burn(vec4 a, vec3 b)  { return ${blend_color_burn_vec4_3}; }
vec3 blend_color_burn(vec3 a, vec3 b)  { return ${blend_color_burn_vec3  }; }
vec4 blend_color_dodge(vec4 a, vec4 b) { return ${blend_color_dodge_vec4  }; }
vec4 blend_color_dodge(vec4 a, vec3 b) { return ${blend_color_dodge_vec4_3}; }
vec3 blend_color_dodge(vec3 a, vec3 b) { return ${blend_color_dodge_vec3  }; }
vec4 blend_color_mix(vec4 a, vec4 b, float c) { return ${blend_color_mix_vec4   }; }
vec4 blend_color_mix(vec4 a, vec3 b, float c) { return ${blend_color_mix_vec4_3 }; }
vec3 blend_color_mix(vec3 a, vec3 b, float c) { return ${blend_color_mix_vec3   }; }
vec4 blend_color_screen(vec4 a, vec4 b) { return ${blend_color_screen_vec4   }; }
vec4 blend_color_screen(vec4 a, vec3 b) { return ${blend_color_screen_vec4_3 }; }
vec3 blend_color_screen(vec3 a, vec3 b) { return ${blend_color_screen_vec3   }; }
vec4 blend_color_overlay(vec4 a, vec4 b) { return ${blend_color_overlay_vec4   }; }
vec4 blend_color_overlay(vec4 a, vec3 b) { return ${blend_color_overlay_vec4_3 }; }
vec3 blend_color_overlay(vec3 a, vec3 b) { return ${blend_color_overlay_vec3   }; }
vec4 blend_color_mask(vec4 a, vec4 b) { float m = median(a.r, a.g, a.b); return b*m; }
vec3 blend_color_mask(vec4 a, vec3 b) { float m = median(a.r, a.g, a.b); return b*m; }
vec4 blend_color_alpha(vec4 a, vec4 b) { float alpha = a.r*a.g*a.b; return vec4(b.rgb*alpha*6., alpha); }
// vec3 blend_color_alpha(vec4 a, vec3 b) { float alpha = a.r*a.g*a.b; return vec4(b.rgb*alpha*6., alpha); }

vec4 blend_color_remove_b_from_a(vec4 a, vec4 b) { return ${blend_color_blend_mode_remove_b_from_a_vec4  }; }
vec4 blend_color_remove_b_from_a(vec4 a, vec3 b) { return ${blend_color_blend_mode_remove_b_from_a_vec4_3}; }
vec3 blend_color_remove_b_from_a(vec3 a, vec3 b) { return ${blend_color_blend_mode_remove_b_from_a_vec3  }; }
`;



const blend_mode_decider = `

#define u_blending_mode 0

#define ADD   0
#define SUB   1
#define MUL   2
#define DIV   3
#define LIG   4
#define DAR   5
#define BUR   6
#define DOG   7
#define MIX   8
#define SCR   9
#define OVE   10
#define MASK  11
#define ALPHA 12
#define REM   13

vec4 blend_decider(in vec4 c1, in vec4 c2, in int mode) {

  switch(mode) {
    case ADD   : return blend_color_add(c1,c2);
    case SUB   : return blend_color_subtract(c1, c2);
    case MUL   : return blend_color_multiply(c1, c2);
    case DIV   : return blend_color_divide(c1, c2);
    case LIG   : return blend_color_lighten(c1, c2);
    case DAR   : return blend_color_darken(c1, c2);
    case BUR   : return blend_color_burn(c1, c2);
    case DOG   : return blend_color_dodge(c1, c2);
    case MIX   : return blend_color_mix(c1, c2, 0.5);
    case SCR   : return blend_color_screen(c1, c2);
    case OVE   : return blend_color_overlay(c1, c2);
    case MASK  : return blend_color_mask(c1, c2);
    case ALPHA : return blend_color_alpha(c1, c2);
    case REM   : return blend_color_remove_b_from_a(c1, c2);
    default    : return blend_color_subtract(c1, c2);
  }

}

vec4 blend_decider(in vec4 c1, in vec3 c2, in int mode) {

  switch(mode) {
    case ADD   : return blend_color_add(c1,c2);
    case SUB   : return blend_color_subtract(c1, c2);
    case MUL   : return blend_color_multiply(c1, c2);
    case DIV   : return blend_color_divide(c1, c2);
    case LIG   : return blend_color_lighten(c1, c2);
    case DAR   : return blend_color_darken(c1, c2);
    case BUR   : return blend_color_burn(c1, c2);
    case DOG   : return blend_color_dodge(c1, c2);
    case MIX   : return blend_color_mix(c1, c2, 0.5);
    case SCR   : return blend_color_screen(c1, c2);
    case OVE   : return blend_color_overlay(c1, c2);
    // case MASK  : return blend_color_mask(c1, c2);
    // case ALPHA : return blend_color_alpha(c1, c2);
    case REM   : return blend_color_remove_b_from_a(c1, c2);
    default    : return blend_color_add(c1, c2);
  }

}`;





export const shader_chunks = {
  version                 : version,
  precision_medium        : precision_medium,
  precision_high          : precision_high,
  u_orthoProj_in          : u_orthoProj_in,

  out_frag_color    : out_frag_color  ,
  frag_u_sampler0   : frag_u_sampler0 ,

  u_generic_vec4: u_generic_vec4,
  u_generic_vec3: u_generic_vec3,
  u_generic_vec2: u_generic_vec2,
  u_generic_float: u_generic_float,
  u_time_float: u_time_float,
  // u_generic_default: u_generic_default,

  u_round_corners_params_vec3: u_round_corners_params_vec3,
  u_glow_params_vec3: u_glow_params_vec3,

  coordinate_system_functions  : coordinate_system_functions,
  blend_color_functions_overloads  : blend_color_functions_overloads,
  smoothmin  : smoothmin,
  brightness_contrast  : brightness_contrast,
  gamma_correction  : gamma_correction,
  hash_function  : hash_function,
  noise_hash  : noise_hash,
  noise_fbm  : noise_fbm,

  
  blend_mode_functions: blend_mode_functions, // Include all color blending modes to every fragment shader, to blend each subsequent color change of any different color functions.
  blend_mode_directives: blend_mode_directives, // Set conditionaly a blending function for use to blend the product color INTERNALY of a color function(NOT the src-new colors). 
  blend_mode_multiply: blend_mode_multiply,
  blend_mode_add: blend_mode_add,
  blend_mode_subtract: blend_mode_subtract,
  blend_mode_divide: blend_mode_divide,
  blend_mode_lighten: blend_mode_lighten,
  blend_mode_darken: blend_mode_darken,
  blend_mode_color_burn: blend_mode_color_burn,
  blend_mode_color_dodge: blend_mode_color_dodge,
  blend_mode_screen: blend_mode_screen,
  blend_mode_overlay: blend_mode_overlay,
  blend_mode_mix: blend_mode_mix,
  blend_mode_decider: blend_mode_decider,
};















