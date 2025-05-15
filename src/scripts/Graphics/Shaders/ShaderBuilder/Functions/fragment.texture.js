/**************************************************************************************************
 * SDF Text Rendering Shader
 */
export const frag_sdf_call = '   final_color = Sdf(v_sdf.x, v_sdf.y) * src_color;';
export const frag_sdf = `
vec4 Sdf(float inner, float outer){

  float b = max(texture(u_sampler0, v_tex_coord).r, max(texture(u_sampler0, v_tex_coord).g, texture(u_sampler0, v_tex_coord).b));
  float pixelDist = 1. - b;

  float alpha = 1. - smoothstep(inner, inner + outer, pixelDist);
  return vec4(alpha);
}
`;






/**************************************************************************************************
 * MSDF Text Rendering Shader
*/
export const frag_msdf_call = '   final_color = Msdf(v_tex_coord) * src_color;';
// export const frag_msdf_call = '  final_color = blend_decider( final_color, Msdf(v_tex_coord), u_blend_mode ) * src_color;';
// export const frag_msdf_call = '   final_color = Msdf(v_tex_coord) ;';
export const frag_msdf = `

// set to distance fields pixel range
// float pxRange = 16.5;
// float pxRange = .5;
float pxRange = 15.5;


float screenPxRange(vec2 v_tex_coord) {
  vec2 unitRange = vec2(pxRange)/vec2(textureSize(u_sampler0, 0));
  // vec2 unitRange = vec2(pxRange);
  vec2 screenTexSize = vec2(1.0)/fwidth(v_tex_coord);
  return max(0.5*dot(unitRange, screenTexSize), 1.0);
}


// VERY SIMPLE BLUR FOR GLOWING EFFECT.
// float Glow()
// {
//   float dist2 = 0.001;
//   float blur =  texture(u_sampler0, v_tex_coord + vec2(dist2, 0.0)).a +
//                 texture(u_sampler0, v_tex_coord - vec2(dist2, 0.0)).a +
//                 texture(u_sampler0, v_tex_coord + vec2(0.0, dist2)).a +
//                 texture(u_sampler0, v_tex_coord - vec2(0.0, dist2)).a;
  
//   return blur /= 8.0;
// }

vec4 Glow(float D, float alpha) {

  // float inside = 1.  - smoothstep(-1., 1., D);
  // float glow = 1.  - smoothstep(0., 10.1, D);
  float inside = smoothstep(-2., 2., D);
  float glow = smoothstep(-1., 1., D);
  vec3 inside_color = vec3(1., 1., 0.);
  vec3 glow_col = vec3(1., .3, 0.);
  vec3 frag_color = mix(glow * glow_col, inside_color, inside);

  return vec4(frag_color, 1.);

}


vec4 Msdf(vec2 v_tex_coord) {

  vec4 texel = texture(u_sampler0, v_tex_coord);
  float dist = median(texel.r, texel.g, texel.b);
  // float bold = .5;
  float bold = .5; // Bolder
  float pxDist = screenPxRange(v_tex_coord) * (dist - bold);
  // float opacity = clamp(pxDist + 0.5, 0.0, 1.0);
  float opacity = clamp(pxDist + .5, 0.0, 1.0);
  // opacity += Glow() * 2.4; // Combine the original texture with the blured alpha

  // float threshold = .5;
  // float afwidth = 0.7 * length(vec2(dFdx(dist), dFdy(dist)));
  // float c = smoothstep(threshold - afwidth, threshold + afwidth, dist);
  // return vec4(c); 

  // return Glow(dist, opacity);
  
  vec4 alpha = vec4((opacity+.0) * v_col4_w); 
  // float tex_alpha = texel.a * (2.0 - texel.a);
  // vec4 alpha = vec4((opacity+.9) * tex_alpha * v_col4_w); // Play with the opacity
  return alpha; 
}
`;




/**************************************************************************************************
 * Simple Texture Rendering Shader
*/

/**
 * The transparency is controlled by the clearColor() as the background color of the framebuffer texture
 * So we compare if the rgb color is = to the transparent color, we set the alha to 0.
 * Because of the floating point error, we check above and below the transparent color.
 */
// export const frag_tex = `

//   vec4 texel = texture( u_sampler0, v_tex_coord);

//   // color *= texel;
//   // color.rgb *= color.a;



//   float pxRange = 50.01;
//   float dist = max(min(color.r, color.g), min(max(color.r, color.g), color.b));

//   vec2 unitRange = vec2(pxRange) / vec2( textureSize( u_sampler0, 0 ) );
//   vec2 screenTexSize = vec2(1.0) / fwidth(v_tex_coord);

//   float pxDist = max(0.5*dot(unitRange, screenTexSize), 1.0) * (dist - 0.5);
//   float opacity = clamp(pxDist + .5, 0.0, 1.0);

//   color = vec4(1.0, 1.0, 1.0, opacity);
//   // color.a = opacity;

// `;


export const frag_tex = `

  // Create uniform controls
  #ifdef U_GENERIC_CONTROLS
    float ${u}ctrl1 = u_generic_controls[u_gen_ctrl_map_cnt++]*20.;
    float ${u}ctrl2 = u_generic_controls[u_gen_ctrl_map_cnt++]*5.;
  #else
    float ${u}ctrl1 = 1.0;
    float ${u}ctrl2 = 1.0;
  #endif


  vec4 texel = texture( u_sampler0, v_tex_coord);

  
  // Premutiply alpha destination
  texel.rgb *= texel.a; // Remove rgb final_color with the alpha channel

  final_color = texel * src_color;
  // final_color.rgb *= final_color.a; // Include alpha from user input final_color
  
  
  // float distance = max(texel.r, max(texel.g, texel.b));
  float distance = max(texel.r, max(texel.g, texel.b))*(${u}ctrl1);


  // TODO: Add to the final color to create thickness
  // final_color.rgb += distance;

  final_color *= src_color.a; // Allow alpha from attribute color
  
  // final_color.rgb *= distance; // Remove all black final_color from the rgb channels
  // final_color.a *= distance*${u}ctrl2; // Remove all black final_color from the rgb channels
  // final_color.a *= pow(distance, ${u}ctrl2*5.); // Remove all black final_color from the rgb channels
  final_color.a *= pow(distance, ${u}ctrl2); // Remove all black final_color from the rgb channels
  
  
  // final_color.a = .4;
  


  
  // float b = max(texture(u_sampler0, v_tex_coord).r, max(texture(u_sampler0, v_tex_coord).g, texture(u_sampler0, v_tex_coord).b));
  // float pixelDist = 1. - b;
  // float inner = ${u}ctrl1;
  // float outer = ${u}ctrl2;
  // // float alpha = 1. - smoothstep(inner, inner + outer, pixelDist);
  // float alpha = 1. - smoothstep(inner, outer, pixelDist);
  // final_color.a = alpha;
  // final_color.rgb = src_color.rgb;
  // final_color *= alpha;

`;
/**SAVE */
// export const frag_tex = `

//   vec4 texel = texture( u_sampler0, v_tex_coord);

  
//   // Premutiply alpha destination
//   texel.rgb *= texel.a; // Remove rgb final_color with the alpha channel

//   final_color = texel * src_color;
//   // final_color.rgb *= final_color.a; // Include alpha from user input final_color
  
//   // TODO: mult the resulted median color to get a border. 
//   // float distance = max(texel.r, max(texel.g, texel.b))*10.;
  
//   float distance = max(texel.r, max(texel.g, texel.b));
//   // float distance = max(texel.r, max(texel.g, texel.b))*10.;


//   // distance *= distance*distance*distance;
//   // distance *= distance;

//   // TODO: Add to the final color to create thickness
//   // final_color.rgb += distance;

//   final_color *= src_color.a; // Allow alpha from attribute color
  
//   // final_color.rgb *= distance*.3; // Remove all black final_color from the rgb channels
//   final_color.a *= distance; // Remove all black final_color from the rgb channels
  
  
//   // final_color.a = .4;


// `;