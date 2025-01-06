"use strict";



/**************************************************************************************************************************************/
// Vertex Shader Shader 


/**************************************************************************************************************************************/
// Fragment Shader 

// Flare effect
const fs_op_flare     = `
/*** Operation Flare ***/

  
  uv = gl_FragCoord.xy / local_res;                   // Map pixel: from {0 -> dim} to {0 -> 1} 
  uv.y -= 1.;
  uv.x -= v_wpos3_x / local_res.x;                         // Invalidate any mesh world position, so that 'first' gl_FragCoord is always the meshes 'first' pixel
  uv.y -= (res.y - (v_wpos3_y+local_res.y)) / local_res.y; // Invalidate any mesh world position.


  vec3 flare_color = vec3(.0);
  { 
    vec2 point = vec2(.5, .6);
    // vec2 point = vec2(.0, .1);


    vec2 uv2 = uv;
    float d2 = length(uv);
    d2 = smoothstep(1., .9, d2);

    float f0 = 1.0/(length(uv2-point)*32.0+1.0);
    f0 *= d2;

    vec2 uvd = uv2*(length(uv2));

    float f2  = max(1.0/(1.0+32.0*pow(length(uvd+0.8*point),2.0)), .0)*0.25*(ctrl4*2.)*(d2);
    float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*point),2.0)),.0)*0.23*(ctrl4*2.)*(d2);
    float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*point),2.0)), .0)*0.21*(ctrl4*2.)*(d2);

    vec2 uvx = uv2;

    float f4  = max(0.01-pow(length(uvx+0.4*point),2.4), .0)*6.0;
    float f42 = max(0.01-pow(length(uvx+0.45*point),2.4),.0)*5.0;
    float f43 = max(0.01-pow(length(uvx+0.5*point),2.4), .0)*3.0;

    float f5  = max(0.01-pow(length(uvx+0.2*point),5.5),.0)*2.0;
    float f52 = max(0.01-pow(length(uvx+0.4*point),5.5),.0)*2.0;
    float f53 = max(0.01-pow(length(uvx+0.6*point),5.5),.0)*2.0;

    float f6 = max(0.01-pow(length(uvx-0.3*point),1.6),.0)*6.0;
    float f62 = max(0.01-pow(length(uvx-0.325*point),1.6),.0)*3.0;
    float f63 = max(0.01-pow(length(uvx-0.35*point),1.6),.0)*5.0;


    flare_color.r+=f2+f4+f5+f6; 
    flare_color.g+=f22+f42+f52+f62; 
    flare_color.b+=f23+f43+f53+f63;
    flare_color = flare_color*1.3 - vec3(length(uvd)*.05) ;
    flare_color+=vec3(f0*ctrl6);

    flare_color *= ctrl5;
  } 
/*** Operation Flare End ***/


`;



export const fs_op_bubble = `
/*** Operation Bubble ***/

  vec3 bubble_color = vec3(.0);
  {
    float dist = length(uv);
    float inner_feather = 25. * ctrl1;
    float outer_feather = .5*ctrl2;
    vec3 c = vec3(pow(dist, inner_feather) * smoothstep(1., 1. - outer_feather, dist));
    bubble_color = c*ctrl3*4.*src_color.rgb;
  } 
/*** Operation Bubble End ***/


`;


export const shader_operations = {
  fs_op_flare:fs_op_flare,
  fs_op_bubble:fs_op_bubble,
};















