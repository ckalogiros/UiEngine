
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
  // vec4 glowcol = Glow(final_color.a, scale_down, u_gen_ctrl_map_cnt);
  // final_color.rgb += glowcol.rgb; // Adds the glow to the any previous function calculations
  final_color = blend_decider( final_color, Glow(final_color.a, scale_down, u_gen_ctrl_map_cnt).rgb, u_blend_mode );
  // final_color = blend_color_add( final_color, Glow(final_color.a, scale_down, u_gen_ctrl_map_cnt).rgb);
`;



export const frag_glow = `

#ifndef UV_READY
  vec2 uv = vec2(0,0);
#endif

vec4 Glow(in float alpha, in float scale_down, inout int u_gen_ctrl_map_cnt)
{
  #ifdef A_TIME
    float time = v_time;
  #else
    float time = 0.;
  #endif

  // Create uniform controls
  float ${u}glow_fade = u_generic_controls[u_gen_ctrl_map_cnt++];
  float ${u}glow_distance = u_generic_controls[u_gen_ctrl_map_cnt++];
  float ${u}glow_intensity = u_generic_controls[u_gen_ctrl_map_cnt++];
  
  vec2 res = u_screen_res;
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  
  
  #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
  #endif  
  
  
  float r = dim.y * scale_down;
  // float d = smoothstep(${u}glow_fade * dim.y, ${u}glow_distance * r,  length(uv));
  float d = smoothstep(${u}glow_distance * dim.y, ${u}glow_fade * dim.y,  length(uv));
  // float d = smoothstep(${u}glow_distance * r, ${u}glow_fade * r,  length(uv));
  
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  vec3 color = src_color.rgb*d*${u}glow_intensity*(1. - time);
  
  
  // WEIRD NICE EFFECT!!!
  // vec3 color = min(src_color.rgb, d*glow_intensity);
  
  return vec4(color, d);
}
`;