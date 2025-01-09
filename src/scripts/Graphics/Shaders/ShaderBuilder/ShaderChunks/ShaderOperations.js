"use strict";



/**************************************************************************************************************************************/
// Vertex Shader Shader 


/**************************************************************************************************************************************/
// Fragment Shader 

// Flare effect
const fs_op_flare     = `
/*** Operation Flare ***/
  
  uv = gl_FragCoord.xy / local_res;                         // Map pixel: from {0 -> dim} to {0 -> 1} 
  uv.y -= 1.;
  uv.x -= v_wpos3_x / local_res.x;                          // Invalidate any mesh world position, so that 'first' gl_FragCoord is always the meshes 'first' pixel
  uv.y -= (res.y - (v_wpos3_y+local_res.y)) / local_res.y;  // Invalidate any mesh world position.

  vec4 flare_color = vec4(.0);
  { 
    vec2 point = vec2(.5, .6);
    // vec2 point = vec2(.0, .1);


    vec2 uv2 = uv;
    float d2 = length(uv);
    d2 = smoothstep(1., .9, d2);

    float f0 = 1.0/(length(uv2-point)*32.0+1.0);
    f0 *= d2;

    vec2 uvd = uv2*(length(uv2));

    float f2  = max(1.0/(1.0+32.0*pow(length(uvd+0.8*point),2.0)), .0)*0.25*(u_generic_controls[u_gen_ctrl_map_cnt++]*2.)*(d2);
    float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*point),2.0)),.0)*0.23*(u_generic_controls[u_gen_ctrl_map_cnt++]*2.)*(d2);
    float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*point),2.0)), .0)*0.21*(u_generic_controls[u_gen_ctrl_map_cnt++]*2.)*(d2);

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
    flare_color.rgb = flare_color.rgb*1.3 - vec3(length(uvd)*.05) ;
    flare_color.rgb+=vec3(f0*u_generic_controls[u_gen_ctrl_map_cnt++]);

    flare_color *= u_generic_controls[u_gen_ctrl_map_cnt++];

    // flare_color *= src_color*2.;
  } 
/*** Operation Flare End ***/


`;



export const fs_op_bubble = `
/*** Operation Bubble ***/
  
  uv = gl_FragCoord.xy / local_res;                         // Map pixel: from {0 -> dim} to {0 -> 1} 
  uv.y -= 1.;
  uv.x -= v_wpos3_x / local_res.x;                          // Invalidate any mesh world position, so that 'first' gl_FragCoord is always the meshes 'first' pixel
  uv.y -= (res.y - (v_wpos3_y+local_res.y)) / local_res.y;  // Invalidate any mesh world position.

  vec3 bubble_color = vec3(.0);
  {
    float dist = length(uv);
    float inner_feather = 25. * u_generic_controls[u_gen_ctrl_map_cnt++];
    float outer_feather = .5*u_generic_controls[u_gen_ctrl_map_cnt++];
    vec3 c = vec3(pow(dist, inner_feather) * smoothstep(1., 1. - outer_feather, dist));
    bubble_color = src_color.rgb * c * u_generic_controls[u_gen_ctrl_map_cnt++]*4.;
  } 
/*** Operation Bubble End ***/


`;


export const fs_op_simple_glow = `
/*** Operation simple-glow End ***/

vec4 simple_glow_color = vec4(.0);
  {
    float time = .4;
    // float time = v_time;
    float rev_time = 1. - time;
    
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
    uv_map_coordinates_zero_one( uv, local_res );
    
    /*
      Animate the ctrl1 from high to low
      Animate the ctrl2(smoothstep inner) from low to high
    */
    float d = .7 - length(uv)*2.*u_generic_controls[u_gen_ctrl_map_cnt++]+(rev_time*.5);
    float c = d * smoothstep(u_generic_controls[u_gen_ctrl_map_cnt++], 1.*rev_time, (d));
    
    c *=c;

    simple_glow_color = vec4(c*rev_time*rev_time);

    // return vec4(c*rev_time*rev_time);
      
  }
/*** Operation simple-glow End ***/


`;


export const fs_op_simple_glow2 = `
/*** Operation simple-glow-2 End ***/

vec4 simple_glow2_color = vec4(.0);
{
  vec2 uv1 = gl_FragCoord.xy / local_res;                   // Map pixel: from {0 -> dim} to {0 -> 1} 
  uv1.x -= v_wpos3_x / local_res.x;                         // Invalidate any mesh world position, so that 'first' gl_FragCoord is always the meshes 'first' pixel
  uv1.y -= (res.y - (v_wpos3_y+local_res.y)) / local_res.y; // Invalidate any mesh world position.
  uv1.y -= 1.;

  // Distance
  float dd = 1.-length( vec2(uv1.x, uv1.y ));
  dd = smoothstep(0., u_generic_controls[u_gen_ctrl_map_cnt++], dd);
  
  
  // Color 1
  float c1 = dd;
  c1 = pow(c1, .4);
  c1 += dd*u_generic_controls[u_gen_ctrl_map_cnt++]*2.;
  
  // Color 2
  float c2 = 1.;
  c2 = (dd+dd) * u_generic_controls[u_gen_ctrl_map_cnt++] * 5.;
  
  // Mix Colors
  c1 += c2;
  
  simple_glow2_color = vec4(vec3(c1), 0.0);
  simple_glow2_color *= src_color;
}
/*** Operation simple-glow-2 End ***/


`;


export const fs_op_inner_shadow_circle = `
/*** Operation inner-shadow-circle ***/

vec4 inner_shadow_circle_color = vec4(.0);
{
  #ifndef UV_READY_CIRCLE_INNER // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_CIRCLE_INNER
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
    uv_map_coordinates_zero_one( uv, local_res );
  #endif
 
  float d = length(uv);
  float c = smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], d);
  
  vec3 color = vec3(c);
  
  // Shadow
  // float radius = sqrt(d);
  float radius = d;
  float f = smoothstep(1.*u_generic_controls[u_gen_ctrl_map_cnt++], 1., radius);
  color = mix(color, color * u_generic_controls[u_gen_ctrl_map_cnt++], f);
  
  // color *= src_color.rgb; // 

  inner_shadow_circle_color = vec4(color, c);
}
/*** Operation inner-shadow-circle End ***/


`;


export const fs_op_inner_specular_circle = `
/*** Operation inner-specular-circle ***/

vec4 inner_specular_circle_color = vec4(.0);
{
  #ifndef UV_READY_CIRCLE_INNER // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_CIRCLE_INNER
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
    uv_map_coordinates_zero_one( uv, local_res );
  #endif
 
  

  float d = length(uv);
  float c = smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], d);
  vec3 color = vec3(c);
  
  // Specular
  // vec3 spec_color = vec3(1.0, 1.0, 1.0); // Specular color
  vec3 spec_color = vec3(1.-src_color.r, 1.0-src_color.g, 1.0-src_color.b); // Specular complementary color to source color
  vec2 spec_pos = vec2(.5, -.5); // Specuular location
  float spec_shine = 5.*u_generic_controls[u_gen_ctrl_map_cnt++]; // Specular intensity
  float f = 1.0 - smoothstep(-2.*u_generic_controls[u_gen_ctrl_map_cnt++], 1.5*u_generic_controls[u_gen_ctrl_map_cnt++], length(uv - spec_pos));
  color = f * spec_shine * spec_color * c;
  // color *= src_color.rgb; // Color the Specular with the source color 

  inner_specular_circle_color = vec4(color, c);
}
/*** Operation inner-specular-circle End ***/


`;


export const fs_op_inner_shadow_rect_filled = `
/*** Operation inner-shadow-rect-filled ***/

vec4 inner_shadow_rect_filled_color = vec4(.0);
{
  #ifndef UV_READY_CIRCLE_INNER // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_CIRCLE_INNER
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
    uv_map_coordinates_zero_one( uv, local_res );
  #endif
 
  float d = max(abs(uv.x), abs(uv.y));
  // float c = d;
  float c = smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], d);
  // float c = 1.-smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], d);
  // float c = smoothstep(.98*ctu_generic_controls[u_gen_ctrl_map_cnt++]rl1, 1., -d);
  
  vec3 color = vec3(c);
  
  // Shadow
  float radius = d;
  float f = smoothstep(1.*u_generic_controls[u_gen_ctrl_map_cnt++], 1., radius);
  color = mix(color, color * u_generic_controls[u_gen_ctrl_map_cnt++], f);
  
  color *= src_color.rgb; // 

  inner_shadow_rect_filled_color = vec4(color, c);
  // inner_shadow_rect_filled_color = vec4(color, 1.);
}
/*** Operation inner-shadow-rect-filled End ***/


`;


export const fs_op_distance_rect_filled = `
/*** Operation distance-rect-filled ***/

vec4 distance_rect_filled_color = vec4(.0);
{
  #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
    uv_map_coordinates_zero_one( uv, local_res );
  #endif
    

  float rCorners = .96*(u_generic_controls[u_gen_ctrl_map_cnt++]+.04);
  float d = length(max( (abs(uv) - (1.*u_generic_controls[u_gen_ctrl_map_cnt++])) + rCorners, 0.0) ) - rCorners;
  
  
  // Feather
  d = smoothstep(0.0, 1.*u_generic_controls[u_gen_ctrl_map_cnt++], -d);
  // d = smoothstep(0.0, 20.*u_generic_controls[u_gen_ctrl_map_cnt++], -d);
  
  // d = d*20.;
  // d = clamp(d, 0.0, 1.0);
  
  float c = d;
  
  vec3 color = vec3(c);
  // vec3 color = vec3(1.);
  
  
  // // Shadow
  // float dd = max(abs(uv.x), abs(uv.y));
  // // float cc = 1.-smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], dd);
  // float cc = smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], -dd);
  
  // color *= cc;
  
  // float radius = dd;
  // // float f = smoothstep(1.*u_generic_controls[u_gen_ctrl_map_cnt++], 1., radius)*d;
  // float f = smoothstep(1.*u_generic_controls[u_gen_ctrl_map_cnt++], 1., radius);
  
  // // color *= cc;
  // color = mix(color, color * u_generic_controls[u_gen_ctrl_map_cnt++], f);

  distance_rect_filled_color = vec4(color, 0.) * src_color;

  // distance_rect_filled_color = vec4(c) * src_color;
  
}
/*** Operation distance-rect-filled End ***/


`;
// export const fs_op_distance_rect_filled = `
// /*** Operation distance-rect-filled ***/

// vec4 distance_rect_filled_color = vec4(.0);
// {
//   #ifndef UV_READY_CIRCLE_INNER // A way to neglect any unecessary pixel coord calculations
//     #define UV_READY_CIRCLE_INNER
//     uv = gl_FragCoord.xy;
//     pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
//     uv_map_coordinates_zero_one( uv, local_res );
//   #endif
    
//   float rCorners = 1.*ctrl1;
//   // float d = length( max( (vpos - dim) + rCorners, 0.0 ) ) - rCorners;
//   // float d = length( max( (vpos - dim) + rCorners, 0.0 ) ) - rCorners;
  
//   float d = length(max( (abs(uv) - (1.*ctrl3)) + rCorners, ctrl2) ) - rCorners;
//   // float d = 1.-(length(max(abs(uv) - .9 + rCorners, 0.0)) - rCorners);
//   // float d = 1.-(length(max((abs(uv) - .9) + 1.9*ctrl1, 0.0)) - 1.9*ctrl2);
//   // float d = 1.-length(max(abs(uv) - .9 + rCorners, 1.*ctrl2)) - rCorners;
//   // float d = 1.-length(max(abs(uv) + rCorners, 0.0)) - rCorners;
//   // float d = max(abs(uv.x), abs(uv.y));

//   float alpha = clamp(-d / 1., 0.0, 1.0);
//   // vec3 color = src_color.rgb * alpha * src_color.a;
//   vec3 color = src_color.rgb * d * src_color.a;
  
  
//   float c = d;
//   // float c = smoothstep(1., .98*ctrl1, d);
//   // float c = 1.-smoothstep(1., .98*ctrl1, d);
//   // float c = smoothstep(.98*ctrl1, 1., d);
  
//   // vec3 color = vec3(c);
  
//   // if(d > .5) color = vec3(1., 0., 0.); 
//   // if(uv.x > -.5) color = vec3(1., 0., 0.); 
//   // if(dim.x/local_res.x > 1.) color = vec3(1., 0., 0.); 
//   // if(dim.x > 79.) color = vec3(1., 0., 0.); 

//   distance_rect_filled_color = vec4(color, 0.) * src_color;
//   // distance_rect_filled_color = vec4(color, c);
//   // distance_rect_filled_color = vec4(c) * src_color;
// }
// /*** Operation distance-rect-filled End ***/


// `;
/**SAVE */
// export const fs_op_distance_rect_filled = `
// /*** Operation distance-rect-filled ***/

// vec4 distance_rect_filled_color = vec4(.0);
// {
//   #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
//     #define UV_READY_MODEL_SPACE_0_1
//     uv = gl_FragCoord.xy;
//     pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
//     uv_map_coordinates_zero_one( uv, local_res );
//   #endif
    
//   float d = max(abs(uv.x), abs(uv.y));
  
//   float c = smoothstep(1., .98*ctrl1, d);
//   // float c = 1.-smoothstep(1., .98*ctrl1, d);
//   // float c = smoothstep(.98*ctrl1, 1., d);
  
//   vec3 color = vec3(c);
  
//   distance_rect_filled_color = vec4(c) * src_color;
// }
// /*** Operation distance-rect-filled End ***/


// `;


export const fs_op_distance_box = `
/*** Operation distance-rect-filled ***/

vec4 distance_rect_filled_color = vec4(.0);
{
  #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
    uv_map_coordinates_zero_one( uv, local_res );
  #endif
    

  float rCorners = .96*(u_generic_controls[u_gen_ctrl_map_cnt++]+.04);
  // float d = length(max( (abs(uv) - (1.*u_generic_controls[u_gen_ctrl_map_cnt++])) + rCorners, u_generic_controls[u_gen_ctrl_map_cnt++]) ) - rCorners;
  float d = length(max( (abs(uv) - (1.*u_generic_controls[u_gen_ctrl_map_cnt++])) + rCorners, -0.2) ) - rCorners;
  // float d = length(max( min( (abs(uv) - (1.*u_generic_controls[u_gen_ctrl_map_cnt++])) + rCorners, (abs(uv) - (rCorners))), .0) ) - rCorners;
  // float d = length(max( (abs(uv) ) - rCorners, 0.) ) ;
  // float d = length(max( (abs(uv) -u_generic_controls[u_gen_ctrl_map_cnt++]) + u_generic_controls[u_gen_ctrl_map_cnt++], 0.) ) -u_generic_controls[u_gen_ctrl_map_cnt++];
  
  // d = clamp(-d, 0.0, 1.0);
  d = -d*4.;
  
  // d = smoothstep(0.0, 1.*u_generic_controls[u_gen_ctrl_map_cnt++], d);
  // d = smoothstep(1.0*u_generic_controls[u_gen_ctrl_map_cnt++], 1.*u_generic_controls[u_gen_ctrl_map_cnt++], d);
  
  
  // float c = -d*u_generic_controls[u_gen_ctrl_map_cnt++];
  float c = d;
  vec3 color = vec3(c);
  
  distance_rect_filled_color = vec4(color, 1.) * src_color;
}
/*** Operation distance-rect-filled End ***/


`;

/**
 * What is the point of increasing the money supply by issuing new loans when at the same time every expence is rizing?
 * It seems to me wealth redistribution.
 * In math.
 * If 1 is created, 1 is owned and 1 is given away.
 * If 10 is created, 10 is owned and 10 is given away.
 * Is that what you are saying?
 * 
 * Looks great if we pass the '1' through a compicated machine that does a tremendous ammount of μετατροπες,
 * just to have tha same result.
 * 2 is created, 2 is given away.
 * 
 * Elon is not stupid. He is just preparing the people for more austerity, based on the fear he claims.
 * 
 * All that should work in a closed economic system, by the means of that everithing that is consumed, is produced inside the system.
 * What happens if yoy depend on othe economic system's goods?
 * What happens if the other guys dont apreciate your value of your currency?
 */



export const shader_operations = {
  fs_op_distance_rect_filled:fs_op_distance_rect_filled,
  fs_op_flare:fs_op_flare,
  fs_op_bubble:fs_op_bubble,
  fs_op_simple_glow:fs_op_simple_glow,
  fs_op_simple_glow2:fs_op_simple_glow2,
  fs_op_inner_shadow_circle:fs_op_inner_shadow_circle,
  fs_op_inner_specular_circle:fs_op_inner_specular_circle,
  fs_op_inner_shadow_rect_filled:fs_op_inner_shadow_rect_filled,
};















