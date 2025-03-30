"use strict";



/**************************************************************************************************************************************/
// Vertex Shader Shader 


/**************************************************************************************************************************************/
// Fragment Shader 

// Flare effect


// const fs_op_sdf_rect = `
// /*** Operation sdf_rect ***/
// vec4 sdf_rect_color = vec4(.0);
// {

//   vec2 rCorners = vec2(v_rcorners) * scale_down;
//   // vec2 rCorners = vec2(v_rcorners*u_generic_controls[u_gen_ctrl_map_cnt++]) * scale_down;
//   // vec2 rCorners = vec2(u_generic_controls[u_gen_ctrl_map_cnt++]*v_dim2_x);
//   vec2 vpos = vec2(v_pos2_x, v_pos2_y);

//   #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
//     #define UV_READY_MODEL_SPACE_0_1
//     uv = gl_FragCoord.xy;
//     uv.x -= v_wpos3_x;
//     uv.y = u_screen_res.y - uv.y;
//     uv.y -= v_wpos3_y;
//     uv /= local_res;
//   #endif

//   vec2 frag_pos = abs(vpos);

//   rCorners.x = min( rCorners.x, min(dim.x, dim.y) );

//   float scale = .5;

//   float d = 1. - (length( max((frag_pos - dim*scale) + rCorners.x*scale, 0.0)) - rCorners.x*scale+.1);
//   // float d = 1. - (length( max((frag_pos - dim * u_generic_controls[u_gen_ctrl_map_cnt++]) + rCorners.x, 0.0)) - rCorners.x+.1);
//   float c = clamp(d/3., 0.0, 1.0);
//   // float c = clamp(d/(100.* u_generic_controls[u_gen_ctrl_map_cnt++]), 0.0, 1.0);

//   // c = smoothstep(1.0, 0.*u_generic_controls[u_gen_ctrl_map_cnt++], c);

//   vec3 color = vec3(c);


//   // // sdf_rect_color = vec4(color, c);
//   // // sdf_rect_color = vec4(color, c*src_color.a);
//   // sdf_rect_color = vec4(color, c) * src_color;
//   // // sdf_rect_color = vec4(color, 1.);





//   ///////////////////////////////////////////////////
//   // float dd = 1. - (length( max((frag_pos - dim) + rCorners.x, 0.0)) - rCorners.x+.1) ;
//   // // float cc = clamp(dd/(dim.x* u_generic_controls[u_gen_ctrl_map_cnt++]), 0.0, 1.0);
//   // float cc = dd/(dim.x* u_generic_controls[u_gen_ctrl_map_cnt++]);
//   // // cc = smoothstep(1.0, 0.*u_generic_controls[u_gen_ctrl_map_cnt++], c);
//   // // color = vec3(cc+cc+cc);
//   // // color = vec3( .4 - exp(-1.0*u_generic_controls[u_gen_ctrl_map_cnt++]*abs(d)));
//   // // color+= vec3(cc+cc+cc);
//   // // color = max(color, vec3(cc+cc+cc));
//   ///////////////////////////////////////////////////

//   ///////////////////////////////////////////////////
//   float cc = 1.-u_generic_controls[u_gen_ctrl_map_cnt++]*abs(d);
//   // float cc = 1.- abs(d)*.1;
//   color = mix( vec3(cc+cc), color, c);
//   // color = color + vec3(cc);
//   // color = vec3(cc);
//   ///////////////////////////////////////////////////




//   // color = vec3(cc);
//   sdf_rect_color = vec4(color, 0.) * src_color;
//   // sdf_rect_color = vec4(color, 1.) * src_color;
//   // sdf_rect_color = vec4(color, cc) * src_color;
//   // sdf_rect_color = vec4(color, c) * src_color;

// }
// /*** Operation sdf_rect End ***/


// `;


/** */
const fs_op_sdf_rect_test_with_generic_sliders = `
/*** Operation sdf_rect ***/
vec4 sdf_rect_color = vec4(.0);
{

  #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = u_screen_res.y - uv.y;
    uv.y -= v_wpos3_y;
    float ratio = local_res.x / local_res.y;
    uv /= local_res; 
    uv.x *= ratio;
    uv.y *= -1.; // Reverse y coord. bottom:-1 up:1
  #endif
    
  dim /= local_res; 
  dim.x *= ratio;

  vec2 abs_uv = abs(uv);

  
  float scale = u_generic_controls[u_gen_ctrl_map_cnt++];
  float r = 1.;
  r *= u_generic_controls[u_gen_ctrl_map_cnt++];
  
  float d = (length( max((abs_uv - dim*scale) + r*scale + .0, 0.0) ) - r*scale);

  // Sdf rectangle
  float c = -d;
  c = smoothstep(.0, .03, c);
  
  ///////////////////////////////////////////////////////////
  // Glow around rect
  float a = u_generic_controls[u_gen_ctrl_map_cnt++];
  float c2 = a-d;
  c2 = smoothstep(-.0, 1.*u_generic_controls[u_gen_ctrl_map_cnt++], c2);
  // c2 = smoothstep(-.3, 1.*u_generic_controls[u_gen_ctrl_map_cnt++], c2);
  c2 = c2+c2+c2;
  
  
  // c = mix(c, c2, u_generic_controls[u_gen_ctrl_map_cnt++]);
  c += c2;
  ///////////////////////////////////////////////////////////
  
  
  ///////////////////////////////////////////////////////////
  // // Inner Shadow
  // // float c_hor = abs((fract(uv.x) - .5)* 2.);
  // // float c_vert = abs((fract(uv.y) - .5)* 2.);
  // // float c_hor = (1.-d);
  // // float c_vert = (1.-d);
  // // float c_hor = d;
  // // float c_vert = d;
  // float c_hor = -d;
  // float c_vert = -d;
  
  // // float distance = 4.*u_generic_controls[u_gen_ctrl_map_cnt++];
  // // float c_hor = abs(distance-d);
  // // float c_vert = abs(distance-d);
  
  
  // // float s = 1.-smoothmin(c_vert, c_hor, u_generic_controls[u_gen_ctrl_map_cnt++]);
  // float s = smoothmin(c_vert, c_hor, u_generic_controls[u_gen_ctrl_map_cnt++]);
  
  // float to_min=0., to_max=1., from_min=0., from_max=(u_generic_controls[u_gen_ctrl_map_cnt++]);
  // float factor = (s - from_min) / (from_max - from_min);
  // float result = to_min + factor * (to_max - to_min);
  
  // s+=result;
  
  // // c = mix(c, s, u_generic_controls[u_gen_ctrl_map_cnt++]);
  // c += s;
  // // c = s;
  // // c = result;
  
  // // color = brightness_contrast(color, control3*.5, control3*2.);
  ///////////////////////////////////////////////////////////
  
  
  
  vec3 color = vec3(c);

  sdf_rect_color = vec4(color, 1.) * src_color;
}
/*** Operation sdf_rect End ***/


`;
/** */
const fs_op_sdf_rect = `
/*** Operation sdf_rect ***/
vec4 sdf_rect_color = vec4(.0);
float c = 0.0;
float d = 0.0;
{

  float angle = 0.0;
  #ifdef A_ANGLE
    angle = v_angle;
  #endif

  // FOR TESTING
  float ctrl1 = 1.0;
  float ctrl2 = 1.0;
  // float ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
  // float ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];
  scale_down *= ctrl1;
  // FOR TESTING
  
  local_res *= scale_down;
  // vec2 rCorners = vec2(v_rcorners) * scale_down;
  vec2 rCorners = vec2(v_rcorners-2.) * scale_down;
  rCorners = min(rCorners, local_res); // Avoid rounding corners below side length
  
  /** Calculate distance for round corners (and feather) **/
  vec2 vpos = vec2(v_pos2_x, v_pos2_y);

  // Re-create the rotation matrix
  float c = 0.0, s = 0.0;
  if(angle > 0.) {
    c = cos(angle);
    s = sin(angle);
    mat2 rot = mat2(s, -c, c, s);
    vpos = abs(vpos.yx*rot);
  }
  else vpos = abs(vpos);
  
  float feather = 2.0;
  
  vec2 dimentions = local_res-feather;
  d = (length( max((vpos - (dimentions )) + rCorners.x*ctrl2, 0.0) ) - rCorners.x*ctrl2);
  
  /** Smooth outline **/
  c = d;
  c = smoothstep(0., feather, c);
  c = 1.-c; // Reverse. We dont do it inside smoothstep, because [0] values for feather produce no [c] color
  
  /** Produce color and alpha **/
  vec3 color = vec3(c) * src_color.a;
  sdf_rect_color = vec4(color, c) * src_color;


  /***********************************************/
  // TEST: border lines
  // vec2 uv_test = gl_FragCoord.xy;
  // uv_test.x -= v_wpos3_x;
  // uv_test.y = u_screen_res.y - uv_test.y;
  // uv_test.y -= v_wpos3_y;
  // uv_test /= dim;
  // uv_test.y *= -1.; // Reverse y coord. bottom:-1 up:1
  // if(abs(uv_test.x) > .98) sdf_rect_color = RED;
  // if(abs(uv_test.y) > .98) sdf_rect_color = BLUE;
}
/*** Operation sdf_rect End ***/


`;
/** */
const fs_op_outer_glow_rect = `
/*** Operation outer_glow_rect ***/
#ifndef INTERNAL_OUTER_GLOW_RECT // Use this effect many times over with different blending modes
  #define INTERNAL_OUTER_GLOW_RECT
  vec4 outer_glow_rect_color = vec4(.0);
#endif
{
  float ${u}glow_radius = u_generic_controls[u_gen_ctrl_map_cnt++];
  float cog = ${u}glow_radius - d;
  float ${u}glow_intensity = u_generic_controls[u_gen_ctrl_map_cnt++] * 16.;
  // cog = cog*abs(cog) * ${u}glow_intensity*5.;
  cog = (cog*5.) * (abs(cog) * ${u}glow_intensity)*(1.-c)*(1.-c);
  
  // cog = mix(cog, c, c);
  
  // final_color = vec4(0.0); // Must reset the final color since we used it in the above mix functio

  // outer_glow_rect_color = vec4(vec3(cog), 1.)* src_color;
  outer_glow_rect_color = vec4(vec3(cog), cog)* src_color;
}
/*** Operation outer_glow_rect End ***/


`;
/**DO NOT DELETE! Rect Sdf with glow */
// const fs_op_sdf_rect = `
// /*** Operation sdf_rect ***/
// vec4 sdf_rect_color = vec4(.0);
// {

//   vec2 rCorners = vec2(v_rcorners) * scale_down;
//   // vec2 rCorners = vec2(v_rcorners*u_generic_controls[u_gen_ctrl_map_cnt++]) * scale_down;
//   // vec2 rCorners = vec2(u_generic_controls[u_gen_ctrl_map_cnt++]*v_dim2_x);
//   vec2 vpos = vec2(v_pos2_x, v_pos2_y);

//   #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
//     #define UV_READY_MODEL_SPACE_0_1
//     uv = gl_FragCoord.xy;
//     uv.x -= v_wpos3_x;
//     uv.y = u_screen_res.y - uv.y;
//     uv.y -= v_wpos3_y;
//     uv /= local_res;
//   #endif

//   vec2 frag_pos = abs(vpos);

//   rCorners.x = min( rCorners.x, min(dim.x, dim.y) );

//   float scale = .5;

//   float d = 1. - (length( max((frag_pos - dim*scale) + rCorners.x*scale, 0.0)) - rCorners.x*scale+.1);
//   // float d = 1. - (length( max((frag_pos - dim * u_generic_controls[u_gen_ctrl_map_cnt++]) + rCorners.x, 0.0)) - rCorners.x+.1);
//   float c = clamp(d/3., 0.0, 1.0);
//   // float c = clamp(d/(100.* u_generic_controls[u_gen_ctrl_map_cnt++]), 0.0, 1.0);

//   // c = smoothstep(1.0, 0.*u_generic_controls[u_gen_ctrl_map_cnt++], c);

//   vec3 color = vec3(c);


//   // // sdf_rect_color = vec4(color, c);
//   // // sdf_rect_color = vec4(color, c*src_color.a);
//   // sdf_rect_color = vec4(color, c) * src_color;
//   // // sdf_rect_color = vec4(color, 1.);





//   ///////////////////////////////////////////////////
//   // float dd = 1. - (length( max((frag_pos - dim) + rCorners.x, 0.0)) - rCorners.x+.1) ;
//   // // float cc = clamp(dd/(dim.x* u_generic_controls[u_gen_ctrl_map_cnt++]), 0.0, 1.0);
//   // float cc = dd/(dim.x* u_generic_controls[u_gen_ctrl_map_cnt++]);
//   // // cc = smoothstep(1.0, 0.*u_generic_controls[u_gen_ctrl_map_cnt++], c);
//   // // color = vec3(cc+cc+cc);
//   // // color = vec3( .4 - exp(-1.0*u_generic_controls[u_gen_ctrl_map_cnt++]*abs(d)));
//   // // color+= vec3(cc+cc+cc);
//   // // color = max(color, vec3(cc+cc+cc));
//   ///////////////////////////////////////////////////

//   ///////////////////////////////////////////////////
//   float cc = 1.-u_generic_controls[u_gen_ctrl_map_cnt++]*abs(d);
//   // float cc = 1.- abs(d)*.1;
//   color = mix( vec3(cc+cc), color, c);
//   // color = color + vec3(cc);
//   // color = vec3(cc);
//   ///////////////////////////////////////////////////




//   // color = vec3(cc);
//   sdf_rect_color = vec4(color, 0.) * src_color;
//   // sdf_rect_color = vec4(color, 1.) * src_color;
//   // sdf_rect_color = vec4(color, cc) * src_color;
//   // sdf_rect_color = vec4(color, c) * src_color;

// }
// /*** Operation sdf_rect End ***/


// `;
/** */
const fs_op_inner_shadow_rect = `
/*** Operation inner_shadow_rect ***/
  vec4 inner_shadow_rect_color = vec4(.0);
  {
    float ${u}control1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}control2 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}control3 = u_generic_controls[u_gen_ctrl_map_cnt++];

    vec2 res = u_screen_res;
    vec2 local_res = vec2(v_dim2_x*2., v_dim2_y*2.);
    vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);

    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = u_screen_res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv *= scale_down; // Case that the object is scaled down

    uv.x += v_dim2_x;
    uv.y += v_dim2_y;
    uv /= local_res; 
    

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


  float cis = smoothmin(c_vert, c_hor, ${u}control1);

  
  float to_min=0., to_max=1., from_min=0., from_max=(${u}control2);
  float factor = (cis - from_min) / (from_max - from_min);
  float result = to_min + factor * (to_max - to_min);
  
  // result *= c;

  vec3 color = vec3(result);
  color = brightness_contrast(color, ${u}control3*.5, ${u}control3*2.);
  
  color += .2; // HACK: just so it does not black the edges

  // inner_shadow_rect_color = vec4(color*src_color.rgb, 1.-result);
  // inner_shadow_rect_color = vec4(color*src_color.rgb, 1.);
  inner_shadow_rect_color = vec4(color*src_color.rgb, final_color.a);


  }
/*** Operation inner_shadow_rect End ***/


`;
/** */
const fs_op_flare = `
/*** Operation Flare ***/
  // dim = vec2(v_dim2_x, v_dim2_y);
  /* ISSUE: Because of the SDF_RECT operation's resolution normalization of x and y axis via ratio, the uv must be reseted and recalculated  */
  // #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
  //   #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /= local_res;
    uv /=  scale_down; 
  // #endif

  vec4 flare_color = vec4(.0);
  { 
    vec2 point = vec2(.5, -.6);

    float intensify = 1.8;
    float ${u}flare = u_generic_controls[u_gen_ctrl_map_cnt++]*intensify;
    float ${u}reflection = u_generic_controls[u_gen_ctrl_map_cnt++]*intensify;
    float ${u}intensity = u_generic_controls[u_gen_ctrl_map_cnt++]*intensify;
    // float ${u}test1 = u_generic_controls[u_gen_ctrl_map_cnt++]*10.;
    // float ${u}test2 = u_generic_controls[u_gen_ctrl_map_cnt++]*10.;
    // float ${u}test3 = u_generic_controls[u_gen_ctrl_map_cnt++]*10.;

    vec2 uv2 = uv;
    float d2 = length(uv);
    d2 = smoothstep(1., .9, d2);

    float f0 = 1.0/(length(uv2-point)*32.0+1.0);
    f0 *= d2;

    vec2 uvd = uv2*(length(uv2));

    float f2  = max(1.0/(1.0+32.0*pow(length(uvd+0.8*point),2.0)), .0)*0.25*(2.)*(d2);
    float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*point),2.0)),.0)*0.23*(2.)*(d2);
    float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*point),2.0)), .0)*0.21*(2.)*(d2);

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
    flare_color.rgb = flare_color.rgb*1.3*${u}reflection - vec3(length(uvd)*.05);
    flare_color.rgb+=vec3(f0*${u}flare);

    flare_color *= ${u}intensity;

    // flare_color *= src_color*2.;
  } 
/*** Operation Flare End ***/


`;
/** */
const fs_op_bubble = `
/*** Operation Bubble ***/
  // #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
    // #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /=  scale_down; 
    uv /= local_res;
  // #endif

  vec3 bubble_color = vec3(.0);
  {
    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl3 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float dist = length(uv);
    float inner_feather = 25. * ${u}ctrl1;
    float outer_feather = .5*${u}ctrl2;
    vec3 c = vec3(pow(dist, inner_feather) * smoothstep(1., 1. - outer_feather, dist));
    bubble_color = src_color.rgb * c * ${u}ctrl3*4.;
  } 
/*** Operation Bubble End ***/


`;
/** */
const fs_op_simple_glow = `
/*** Operation simple-glow End ***/
  // #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
  //   #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /= local_res;
    uv /=  scale_down; 
  // #endif

  vec4 simple_glow_color = vec4(.0);
  {
    float time = .4;
    // float time = v_time;
    float rev_time = 1. - time;

    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];

    /*
      Animate the ctrl1 from high to low
      Animate the ctrl2(smoothstep inner) from low to high
    */
    float d = .7 - length(uv)*2.*${u}ctrl1+(rev_time*.5);
    float c = d * smoothstep(${u}ctrl2, 1.*rev_time, (d));
    
    c *=c;

    simple_glow_color = vec4(c*rev_time*rev_time);

    // return vec4(c*rev_time*rev_time);
      
  }
/*** Operation simple-glow End ***/


`;
/** */
const fs_op_simple_glow2 = `
/*** Operation simple-glow-2 End ***/
  // #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
  //   #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = u_screen_res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /= local_res;
    uv /=  scale_down; 
  // #endif

  vec4 simple_glow2_color = vec4(.0);
  {

    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];

    uv *= .7;

    // Distance
    float c= 1.-length( vec2(uv.x, uv.y ));
    // c = smoothstep(0., ${u}ctrl1, c);
    c = smoothstep(0.0, 1.0, c);
    
    // Color 1
    float c1 = c;
    c1 = pow(c1, .4);
    c1 += c*${u}ctrl1*2.;
    
    // Color 2
    float c2 = 1.;
    c2 = (c+c) * ${u}ctrl2 * 5.;
    
    // Mix Colors
    c1 += c2;
    
    simple_glow2_color = vec4(vec3(c1), 0.0);
    // simple_glow2_color *= src_color;
  }
/*** Operation simple-glow-2 End ***/


`;
/** */
const fs_op_simple_glow2_rect = `
/*** Operation simple-glow-2-rect End ***/
// #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
// #define UV_READY_MODEL_SPACE_0_1
  uv = gl_FragCoord.xy;
  uv.x -= v_wpos3_x;
  uv.y = res.y - uv.y;
  uv.y -= v_wpos3_y;
  uv /= local_res;
  uv /=  scale_down; 
// #endif

vec4 simple_glow2_rect_color = vec4(.0);
{
  float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
  float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];

  // NEW
  // float mn = min(local_res.x,local_res.y);
  // float mx = max(local_res.x,local_res.y);
  
  // float ratio_max = mx / mn;
  // float ratio_min = mn / mx;
  // float ratio_inv = 1.-ratio_min;
  
  // // float c_hor = abs(((uv.x) - .5)* 2.);
  // // float c_vert = abs(((uv.y) - .5)* 2.);
  // float c_hor = abs(uv.x- 1.)*1.;
  // // float c_vert = abs(uv.y- 1.)*1.;
  // float c_vert = (uv.y+ 1.)*1.;
  // // float c_hor = abs(uv.x);
  // // float c_vert = abs(uv.y);
  
  // float c = smoothmin(c_vert, c_hor, u_generic_controls[u_gen_ctrl_map_cnt++]);


  // OLD
  float c = 1.-length(uv);
  
  // Color 1
  float c1 = c;
  c1 = pow(c1, .4);
  c1 += c*${u}ctrl1*2.;
  
  // Color 2
  float c2 = 1.;
  c2 = (c+c) * ${u}ctrl2 * 5.;
  
  // Mix Colors
  c1 += c2;
  
  simple_glow2_rect_color = vec4(vec3(c1), 0.0);
  simple_glow2_rect_color *= src_color;
}
/*** Operation simple-glow-2-rect End ***/


`;
/** */
const fs_op_inner_shadow_circle = `
/*** Operation inner-shadow-circle ***/
  // #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
  //   #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /= local_res;
    uv /=  scale_down; 
  // #endif
  
  vec4 inner_shadow_circle_color = vec4(.0);
  {
    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl3 = u_generic_controls[u_gen_ctrl_map_cnt++];
  
    float d = length(uv);
    float c = smoothstep(1., .98*${u}ctrl1, d);
    
    vec3 color = vec3(c);
    
    // Shadow
    // float radius = sqrt(d);
    float radius = d;
    float f = smoothstep(1.*${u}ctrl2, 1., radius);
    color = mix(color, color * ${u}ctrl3, f);
    
    // color *= src_color.rgb; // 

    inner_shadow_circle_color = vec4(color, c);
  }
/*** Operation inner-shadow-circle End ***/


`;
/** */
const fs_op_inner_specular_circle = `
/*** Operation inner-specular-circle ***/
  // #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
    // #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /= local_res;
    uv /=  scale_down; 
  // #endif
  
  vec4 inner_specular_circle_color = vec4(.0);
  {
    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl3 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl4 = u_generic_controls[u_gen_ctrl_map_cnt++];

    float d = length(uv);
    float c = smoothstep(1., .98*${u}ctrl1, d);
    vec3 color = vec3(c);
    
    // Specular
    vec3 spec_color = vec3(1.0, 1.0, 1.0); // Specular color
    // vec3 spec_color = vec3(1.-src_color.r, 1.0-src_color.g, 1.0-src_color.b); // Specular complementary color to source color
    vec2 spec_pos = vec2(.5, -.5); // Specuular location
    float spec_shine = 5.*${u}ctrl2; // Specular intensity
    float f = 1.0 - smoothstep(-2.*${u}ctrl3, 1.5*${u}ctrl4, length(uv - spec_pos));
    color = f * spec_shine * spec_color * c;
    // color *= src_color.rgb; // Color the Specular with the source color 

    inner_specular_circle_color = vec4(color, c);
  }
/*** Operation inner-specular-circle End ***/


`;
/** */
const fs_op_outer_shadow_rect = `
/*** Operation inner-shadow-rect-filled ***/

  {
    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float radius = 1.*${u}ctrl1-d;
    float f = smoothstep(1.*${u}ctrl2, 1., radius);
    float c_shadow = f;

    sdf_rect_color = vec4(vec3(0.), c_shadow);
  }
/*** Operation inner-shadow-rect-filled End ***/


`;
// const fs_op_inner_shadow_rect_filled = `
// /*** Operation inner-shadow-rect-filled ***/
//   #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
//     #define UV_READY_MODEL_SPACE_0_1
//     uv = gl_FragCoord.xy;
//     uv.x -= v_wpos3_x;
//     uv.y = res.y - uv.y;
//     uv.y -= v_wpos3_y;
//     uv /= local_res;
//   #endif

//   vec4 inner_shadow_rect_filled_color = vec4(.0);
//   {
//     // float d = max(abs(uv.x), abs(uv.y));
//     // float c_shadow = smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], 1.-d);
//     // float c_shadow = smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], -d);
//     // float c_shadow = -d*u_generic_controls[u_gen_ctrl_map_cnt++];
//     // float c_shadow = smoothstep(.0, 1.*u_generic_controls[u_gen_ctrl_map_cnt++], -d);

//     // float a = -(d+.1);
//     // float a = (c);
//     float a = (d);

//     float c_shadow = smoothstep(.0, 1.*u_generic_controls[u_gen_ctrl_map_cnt++], a);
//     // c_shadow = 1.-c_shadow;

//   	// c_shadow*=c_shadow*c_shadow*c_shadow;

//     vec3 color_shadow = vec3(c_shadow);

//     // Shadow
//     // float radius = 1.-c;
//     float radius = 1.-d;
//     // float radius = d;
//     float f = smoothstep(1.*u_generic_controls[u_gen_ctrl_map_cnt++], 1., radius);
//     // color_shadow = mix(color_shadow, color_shadow * u_generic_controls[u_gen_ctrl_map_cnt++], f);

//     color_shadow -= f;
//     // c_shadow -= 1.-f;
//     // // c_shadow -= 1.;
//     // color_shadow*=c_shadow;
//     color_shadow -= 1.* u_generic_controls[u_gen_ctrl_map_cnt++];


//     inner_shadow_rect_filled_color = vec4(color_shadow, c_shadow);
//     // sdf_rect_color = vec4(color_shadow, c_shadow);
//   }
// /*** Operation inner-shadow-rect-filled End ***/


// `;
/**Copy of SDF */
// export const fs_op_inner_shadow_rect_filled = `
// /*** Operation inner-shadow-rect-filled ***/
// vec4 inner_shadow_rect_filled_color = vec4(.0);
// {
//   uv = gl_FragCoord.xy;
//   uv.x -= v_wpos3_x;
//   uv.y = u_screen_res.y - uv.y;
//   uv.y -= v_wpos3_y;
//   float ratio = local_res.x / local_res.y;
//   uv /= local_res; 
//   uv.x *= ratio;
//   uv.y *= -1.; // Reverse y coord. bottom:-1 up:1

//   // float radius = (300. * scale_down)*u_generic_controls[u_gen_ctrl_map_cnt++];
//   float radius = u_generic_controls[u_gen_ctrl_map_cnt++];
//   // radius /= local_res;

//   // dim /= local_res; 
//   // dim.x *= ratio;

//   vec2 abs_uv = abs(uv);
//   float d_shadow = 0.0;

//   // d_shadow = (length( max((abs_uv - dim / scale_down) + radius, 0.0) ) - radius);
//   // d_shadow = (length( ((abs_uv - dim / scale_down) + 0.) ) - 0.);
//   d_shadow = (length( ((abs_uv - dim / scale_down) +  radius) ) -  radius);

//   // d_shadow = max( d_shadow, max(abs_uv.x, abs_uv.y) );

//   float c_shadow = d_shadow;
//   c_shadow = smoothstep(1.0*u_generic_controls[u_gen_ctrl_map_cnt++], 0., c_shadow);
//   // c_shadow = smoothstep(.0, 1., c_shadow);

//   c_shadow = 1.-c_shadow;

//   vec3 color = vec3(c_shadow);
//   // inner_shadow_rect_filled_color = vec4(color, 1.) * src_color;
//   inner_shadow_rect_filled_color = vec4(color, 1.) * vec4(1., .5, .2, 1.);

// }
// /*** Operation inner-shadow-rect-filled End ***/


// `;
/** */
/** */
const fs_op_inner_shadow_rect_filled = `
/*** Operation inner-shadow-rect-filled ***/
/*** Operation inner-shadow-rect-filled ***/
  #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /= local_res;
  #endif
vec4 inner_shadow_rect_filled_color = vec4(.0);
{
  float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
  float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];

  // float d_shadow = min(d, max(abs(uv.x), abs(uv.y)) );
  // float d_shadow = 1.-d;
  
  // float d_shadow = abs(d)-u_generic_controls[u_gen_ctrl_map_cnt++];
  // float d_shadow = (d)-u_generic_controls[u_gen_ctrl_map_cnt++];
  // d_shadow = smoothstep(.0, .06, d_shadow);
  // float c_shadow = 1.-d_shadow;
  
  // float d_shadow = abs(c)-u_generic_controls[u_gen_ctrl_map_cnt++];
  float d_shadow = d;
  
  float c_shadow = d_shadow;
  c_shadow = smoothstep(0., 1.*${u}ctrl1, length(abs(uv)));

  c_shadow = 1.-c_shadow;
  // c_shadow = min(c_shadow, min(abs(uv.x), abs(uv.y)) );
  // c_shadow = min(c_shadow, min(abs(uv.x)-d, abs(uv.y)-d) );


  // if(d <= -u_generic_controls[u_gen_ctrl_map_cnt++])
  // c_shadow = smoothstep(0., 1., length(uv)-d);

  // float c_shadow = smoothstep(1., .98*u_generic_controls[u_gen_ctrl_map_cnt++], d_shadow);
  // float c_shadow = smoothstep(.98*u_generic_controls[u_gen_ctrl_map_cnt++], .0, d_shadow);
  // float c_shadow = smoothstep(.0, .98*u_generic_controls[u_gen_ctrl_map_cnt++], d_shadow);
  // float c_shadow = smoothstep(.98*u_generic_controls[u_gen_ctrl_map_cnt++], 1.0, d_shadow);
  
  vec3 color = vec3(c_shadow);
  
  // Shadow
  float radius = d;
  float f = smoothstep(1.*${u}ctrl2, 1., radius);
  // color = mix(color, color * u_generic_controls[u_gen_ctrl_map_cnt++], f);
  
  color *= src_color.rgb; // 

  inner_shadow_rect_filled_color = vec4(color, c_shadow);
  // inner_shadow_rect_filled_color = vec4(color, 1.);
}
/*** Operation inner-shadow-rect-filled End ***/


`;
/** */
const fs_op_distance_rect_filled = `
/*** Operation distance-rect-filled ***/
  #ifndef UV_READY_MODEL_SPACE_0_1 // A way to neglect any unecessary pixel coord calculations
    #define UV_READY_MODEL_SPACE_0_1
    uv = gl_FragCoord.xy;
    uv.x -= v_wpos3_x;
    uv.y = res.y - uv.y;
    uv.y -= v_wpos3_y;
    uv /= local_res;
  #endif

  vec4 distance_rect_filled_color = vec4(.0);
  {
    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++];
    float rCorners = .96*(${u}ctrl1+.04);
    // float d = length(max( (abs(uv) - (1.*u_generic_controls[u_gen_ctrl_map_cnt++])) + rCorners, 0.0) ) - rCorners;
    
    
    // Feather
    d = smoothstep(0.0, 1.*${u}ctrl2, -d);
    // d = smoothstep(0.0, 20.*u_generic_controls[u_gen_ctrl_map_cnt++], -d);
    
    
    float c = d;
    
    vec3 color = vec3(c);
    
    
    // distance_rect_filled_color = vec4(color, 0.) * src_color;
    distance_rect_filled_color = vec4(color, 0.);
    
  }
/*** Operation distance-rect-filled End ***/


`;





export const shader_operations = {
  fs_op_sdf_rect: fs_op_sdf_rect,
  fs_op_outer_glow_rect: fs_op_outer_glow_rect,
  fs_op_inner_shadow_rect: fs_op_inner_shadow_rect,
  fs_op_distance_rect_filled: fs_op_distance_rect_filled,
  fs_op_flare: fs_op_flare,
  fs_op_bubble: fs_op_bubble,
  fs_op_simple_glow: fs_op_simple_glow,
  fs_op_simple_glow2: fs_op_simple_glow2,
  fs_op_simple_glow2_rect: fs_op_simple_glow2_rect,
  fs_op_inner_shadow_circle: fs_op_inner_shadow_circle,
  fs_op_inner_specular_circle: fs_op_inner_specular_circle,
  fs_op_inner_shadow_rect_filled: fs_op_inner_shadow_rect_filled,
  fs_op_outer_shadow_rect: fs_op_outer_shadow_rect,

  // Test Copies
  fs_op_sdf_rect_test_with_generic_sliders: fs_op_sdf_rect_test_with_generic_sliders,
};















