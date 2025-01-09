
/**
 * Must decide:
 * Do we multiply the color with the functions Glow() return color
 * Or we add it?
 * 
 * In the case of addition, the return color must be 0 where the previous color must not be changed
 * and only add the new created color from Glow() color calculation.
 * 
 * I think the only option is the addition
 * In the multiplication we need to return 1 for color we do not want to change
 * and a 
 */

export const frag_glow_call = `
  vec4 glowcol = Glow(final_color.a, scale_down);
  final_color.rgb += glowcol.rgb; // Adds the glow to the any previous function calculations
  // final_color.rgb *= glowcol.rgb; // Adds the glow to the any previous function calculations
  // final_color = blend_color_multiply( final_color, glowcol ); 
  // final_color = blend_color_add( final_color, glowcol ); 
`;

export const frag_glow = `

#ifndef UV_READY
  vec2 uv = vec2(0,0);
#endif

vec4 Glow(float alpha, float scale_down)
{
  #ifdef U_GLOW_PARAMS_VEC3
    #include <u_glow_params_vec3>
  #endif
  
  #ifdef U_GENERIC_VEC3
    include <u_generic_vec3>
  #elif defined(U_GENERIC_VEC2)
    #include <u_generic_vec2>
  #elif defined(U_GENERIC_FLOAT)
    #include <u_generic_float>
  #endif
  
  
  #ifdef A_TIME
    float time = v_time;
  #else
    float time = 0.;
  #endif
  
  
  vec2 res = u_screen_res;
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  
  
  #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);
  #endif  
  
  
  float r = dim.y*scale_down;
  float d = smoothstep(dim.y*outer, r*inner,  length(uv));
  
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  vec3 color = src_color.rgb*d*intensity*(1. - time);
  // vec3 color = src_color.rgb*intensity*(1. - time);
  
  
  // color = min(src_color.rgb, d*intensity); // WEIRD NICE EFFECT!!!
  
  // d = 1.0;
  // return RED*d;
  return vec4(color, d);
  // return vec4(color, 1.);
}
`;
