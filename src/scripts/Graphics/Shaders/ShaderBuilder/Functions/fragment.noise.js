export const frag_noise_call = `
   color = Noise_procedural(scale_down);
`;
export const frag_noise = `\


#define MAX_SPEED 19.

#ifndef UV_READY
  vec2 uv = vec2(0,0);
#endif


#ifndef HASH_FUNCTION 
  #include <hash_function>
#endif
#ifndef NOISE_HASH 
  #include <noise_hash>
#endif
#ifndef NOISE_FBM 
  #include <noise_fbm>
#endif



vec4 Noise_procedural(float scale_down)
{

    #ifdef U_NOISE_PARAMS
        vec3 controls = u_noise_params;
    #else
        vec3 controls = vec2(1.);
    #endif
        

    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
    vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
    float time  = v_time;
    float revT  = 1.-time; // Reverse time to be from 1 to 0
    
    // #ifndef UV_READY
      #define UV_READY 1
      uv = gl_FragCoord.xy;
      pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);
    // #endif  
    
    vec2 uv2 = (gl_FragCoord.xy-(res*.5))/res;
    float res_ratio = res.y/res.x;
    uv2.y *= res_ratio;
   
   
   
    float d2 = 1.- smoothstep(0.0, dim.y, length(uv));
    float shape = d2 ;
    shape *= revT * (MAX_SPEED) * .1;
    
    
    float complexity = 2.;
    vec2 ratio = vec2(dim.y,dim.x*2.)*controls.z*.25; 
    // float noise1 = fbm(complexity * uv2 * vec2(2., 2.));
    // float noise2 = fbm(5. * uv2 * vec2(2., 2.)*ratio);
    float noise1 = fbm(complexity * uv2 * vec2(2.* ratio.x, 2.* ratio.x)) ;
    float noise2 = fbm(5. * uv2 * vec2(2.* ratio.x, 2.* ratio.x));
    float n1 = noise1*revT*d2; // +1 for non negative values
    float n2 = noise2*revT*d2; // +1 for non negative values

    
    float alpha = revT*d2;


    float sum = 1.-((src_color.r + src_color.g + src_color.b)/3.); // Make equal src_color intensity for all rgb combinations
    n1 *= sum * 2.0;

    vec3 col = src_color.rgb;

    
    float F = pow(noise2, 3.) *2.; // Characterizes the noize into the src_color.
    // F *= d2 + (controls*.000000000001);
    F *= d2;

    
    // TODO: Create controls for: [pow(.., X1), F*X2, X3*(time+.4))]
    // float mixer = pow((shape-n1)*F*4.5, 3.);
    // float mixer = (shape-n1)*F*4.5;
    // float mixer = pow((shape-n1)*F*4.5, 4.*(time+.4));
    float mixer = pow((shape-n1)*F*2.5, 2.*(time+.4));
    float mixer2 = pow((shape-n1)*F*2., 6.*(time+.4));
    // return vec4(mixer);
    


    /*
        We want 0 alpha for the outer src_color(s1), and use 'F' for the alpha of the highlights(s2)
    */


    // Color 1 
    // vec4 s1 = vec4(vec3(n1*n1*col), F);
    vec4 s1 = vec4(vec3(n1*n1*col), 0.);
    // return s1;
    
    
    // Color 2. Very Nice smoke like effect
    vec4 s2 = vec4(vec3(col*pow((n1)*F*4.5, 2.)), mixer); 
    // vec4 s2 = vec4(vec3(col*pow((n1)*F*4.5, 2.)), F); 
    // return s2;
    
    // vec4 s4 = vec4(vec3(col*n1), F); 
    
    
    // Final Color
    // vec4 c = mix(s1, s2, alpha);
    // vec4 c = mix(s1, s2, F);
    // vec4 c = mix(s1, s2, mixer);
    // vec4 c = mix(s1, s2, mixer2);
    
    
    vec4 c = mix(s1, s2, mixer);
    
    
    
    /** CHOOSE ONE OF THE BELLOW: bright2 is good for purple src_color, bright 1 is good for a very bright fire ball */
    vec4 bright2 = mix(s1, vec4(vec3(mixer2), 1.-F*2.6), mixer); // EFFECT VERY BRIGHT
    // c += bright2*.5;
    // c += bright2;
    
    c += mix(c, bright2, controls.x);
    
    vec4 bright1 = mix(s1, vec4(vec3(mixer), F), mixer); // EFFECT VERY BRIGHT
    // c += bright1*.3;
    // c += bright1;
    c += bright1*revT*revT*revT*revT*revT*revT*revT*revT*6.*controls.y;
    
    // c += bright1*revT*revT*revT*revT;
    // c += bright1*revT*revT*revT*revT*revT*revT*revT*revT;
    

    
    // return vec4(noise1);
    // return vec4(vec3(noise1), .0);
    return c;
    // return RED;

}
`;



/****************************************************************************************************************************/
export const frag_worley_noise_call = '   color = blend_color_multiply( color, frag_worley_noise() );'

export const frag_worley_noise = `

/********************************************************************************************/
// SHADER UNIT: frag_worley_noise
/********************************************************************************************/

/*****************************************************/
// GENERIC GLOBAL VARIABLES DECLERATIONS
#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif


/*****************************************************/
// FUNCTION DECLERATIONS


/*****************************************************/
// BLEND MODES FUNCTION DECLERATIONS
#ifdef BLEND_MODE 
   #include <blend_mode_directives>
#endif



vec4 permute ( vec4 x) {
  return mod ((34.0 * x + 1.0) * x, 289.0) ;
}


vec2 cellular2x2(vec2 P, float ctrl1, float ctrl2) {
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



vec4 frag_worley_noise()
{

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
  
  
  

  #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);
    uv_map_coordinates_zero_one(uv, dim);
  #endif  
  
  vec2 st = uv; // Texture coordinates
  vec2 F = cellular2x2(st*5., control1, control2);
  float n = 1.0 - 1.5 * F.x * control1;
  // float n = 1.0 - F.x * F.x * control1;
  
  vec3 color = vec3(n, n, n);
  return vec4(color, 1.0);

}
`;