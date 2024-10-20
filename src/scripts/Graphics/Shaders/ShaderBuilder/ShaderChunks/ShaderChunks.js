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
`float control1 = u_generic_vec2.x;
float control2 = u_generic_vec2.y;`;
const u_generic_float = 
`float control1 = u_generic_float`;

/**************************************************************************************************************************************/
// Misc Shader Functions
const smoothmin = `
#define SMOOTH_MIN 1
float smoothmin(float a, float b, float k) {
   if (k != 0.0) {
      float h = max(k - abs(a - b), 0.0) / k;
      return min(a, b) - h * h * h * k * (1.0 / 6.0);
   }
   else {
      return min(a, b);
   }
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

const blend_mode_add          = '      ( (a)+(b) )';
const blend_mode_subtract     = '      ( (a)-(b) )';
const blend_mode_multiply     = '      ( (a)*(b) )';
const blend_mode_devide       = '      ( (a)/(b) )';
const blend_mode_lighten      = '      max(a,b)';
const blend_mode_darken       = '      min(a,b)';
const blend_mode_color_burn   = '      ( 1.-(1.-(a))/(b) )';
const blend_mode_color_dodge  = '      ( (a)/(1.-(b)) )';
const blend_mode_screen       = '      ( 1.-(1.-(a))*(1.-(b)) )';
const blend_mode_overlay      = `      ( (a)<=0.5 ) ? ( (2.*(a))*(b) ) : ( 1.-(1.-2.*((a)-0.5))*(1.-(b)) )`;
const blend_mode_mix          = `      ( ((a)*(1.-(c))) + ((b)*(c)) )`;


const blend_mode_functions   = 
`
#define blm_multiply(a, b) \\
#include <blend_mode_multiply>
#define blm_lighten(a, b) \\
#include <blend_mode_lighten>
#define blm_devide(a, b) \\
#include <blend_mode_devide>
#define blm_overlay(a, b) \\
#include <blend_mode_overlay>
#define blm_add(a, b) \\
#include <blend_mode_add>
#define blm_subtract(a, b) \\
#include <blend_mode_subtract>
#define blm_darken(a, b) \\
#include <blend_mode_darken>
#define blm_color_burn(a, b) \\
#include <blend_mode_color_burn>
#define blm_color_dodge(a, b) \\
#include <blend_mode_color_dodge>
#define blm_screen(a, b) \\
#include <blend_mode_screen>
#define blm_mix(a, b, c) \\
#include <blend_mode_mix>`;


const blend_mode_directives   = 
`   #ifdef BLEND_MODE_MULTIPLY 
      #define blend_mode(a, b) blm_multiply(a,b)
   #elif defined(BLEND_MODE_LIGHTEN)
      #define blend_mode(a, b) blm_lighten(a, b)
   #elif defined(BLEND_MODE_DEVIDE)
      #define blend_mode(a, b) blm_devide(a, b)
   #elif defined(BLEND_MODE_OVERLAY)
      #define blend_mode(a, b) blm_overlay(a, b)
   #elif defined(BLEND_MODE_ADD)
      #define blend_mode(a, b) blm_add(a, b)
   #elif defined(BLEND_MODE_SUBTRACT)
      #define blend_mode(a, b) blm_subtract(a, b)
   #elif defined(BLEND_MODE_DARKEN)
      #define blend_mode(a, b) blm_darken(a, b)
   #elif defined(BLEND_MODE_COLOR_BURN)
      #define blend_mode(a, b) blm_color_burn(a, b)
   #elif defined(BLEND_MODE_COLOR_DODGE)
      #define blend_mode(a, b) blm_color_dodge(a, b)
   #elif defined(BLEND_MODE_SCREEN)
      #define blend_mode(a, b) blm_screen(a, b)
   #elif defined(BLEND_MODE_MIX)
      #define blend_mode(a, b) blm_mix(a, b)
   #else // Default
      #define blend_mode(a, b) blm_add(a, b)
   #endif
   vec3 blend_color(vec3 a, vec3 b) {
      return vec3(
         blend_mode(a.r, b.r),
         blend_mode(a.g, b.g),
         blend_mode(a.b, b.b)
      );
   }
   vec4 blend_color(vec4 a, vec4 b) {
      return vec4(
         blend_mode(a.r, b.r),
         blend_mode(a.g, b.g),
         blend_mode(a.b, b.b),
         blend_mode(a.a, b.a)
      );
   }`;

      /** SAVE-BLEND FUNCTIONS(NOT DEFINES) */
// const blend_mode_multiply = `
// #define BLEND_MODE_ADD 1
// float blend_mode_add(float a, float b) {
//    return a*b;
// }`;
// const blend_mode_multiply = '      ( (a)*(b) )';
// const blend_mode_add = `
// float blend_mode_add(float a, float b) {
//    return a+b;
// }`;
// const blend_mode_subtract = `
// float blend_mode_add(float a, float b) {
//    return a-b;
// }`;
// const blend_mode_devide = `
// float blend_mode_add(float a, float b) {
//    return a/b;
// }`;
// const blend_mode_lighten = `
// float blend_mode_add(float a, float b) {
//    return max(a,b);
// }`;
// const blend_mode_darken = `
// float blend_mode_add(float a, float b) {
//    return min(a,b);
// }`;
// const blend_mode_color_burn = `
// float blend_mode_add(float a, float b) {
//    return 1.-(1.-a)/b;
// }`;
// const blend_mode_color_dodge = `
// float blend_mode_add(float a, float b) {
//    return a/(1.-b);
// }`;
// const blend_mode_screen = `
// float blend_mode_add(float a, float b) {
//    return 1.-(1.-a)*(1.-b);
// }`;
// const blend_mode_overlay = `
// float blend_mode_add(float a, float b) {
//    if (a<=0.5) return (2.*a)*b; 
//    else return 1.-(1.-2.*(a-0.5))*(1.-b);
// }`;

/**
 * vec3 blend_mode_add(vec3 a, vec3 b) {
   return vec3(
      blend_mode_add(a.r, b.r),
      blend_mode_add(a.g, b.g),
      blend_mode_add(a.b, b.b)
   );
 */




export const shader_chunks = {
   version                 : version,
   precision_medium        : precision_medium,
   precision_high          : precision_high,
   u_orthoProj_in          : u_orthoProj_in,

   out_frag_color    : out_frag_color   ,
   frag_u_sampler0   : frag_u_sampler0  ,

   u_generic_vec4: u_generic_vec4,
   u_generic_vec3: u_generic_vec3,
   u_generic_vec2: u_generic_vec2,
   u_generic_float: u_generic_float,

   smoothmin  : smoothmin ,

   
   blend_mode_functions: blend_mode_functions, // Include all color blending modes to every fragment shader, to blend each subsequent color change of any different color functions.
   blend_mode_directives: blend_mode_directives, // Set conditionaly a blending function for use to blend the product color INTERNALY of a color function(NOT the src-new colors). 
   blend_mode_multiply: blend_mode_multiply,
   blend_mode_add: blend_mode_add,
   blend_mode_subtract: blend_mode_subtract,
   blend_mode_devide: blend_mode_devide,
   blend_mode_lighten: blend_mode_lighten,
   blend_mode_darken: blend_mode_darken,
   blend_mode_color_burn: blend_mode_color_burn,
   blend_mode_color_dodge: blend_mode_color_dodge,
   blend_mode_screen: blend_mode_screen,
   blend_mode_overlay: blend_mode_overlay,
   blend_mode_mix: blend_mode_mix,
};















