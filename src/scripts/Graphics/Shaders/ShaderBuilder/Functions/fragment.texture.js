/**************************************************************************************************
 * SDF Text Rendering Shader
 */
export const frag_sdf_call = '  color *= Sdf(v_sdf.x, v_sdf.y);';
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
export const frag_msdf_call = '  color *= Msdf();';
export const frag_msdf = `

// set to distance fields pixel range
float pxRange = 16.5;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
  vec2 unitRange = vec2(pxRange)/vec2(textureSize(u_sampler0, 0));
  // vec2 unitRange = vec2(pxRange);
  vec2 screenTexSize = vec2(1.0)/fwidth(v_tex_coord);
  return max(0.5*dot(unitRange, screenTexSize), 1.0);
}


// VERY SIMPLE BLUR FOR GLOWING EFFECT.
float Glow()
{
  float dist2 = 0.001;
  float blur =  texture(u_sampler0, v_tex_coord + vec2(dist2, 0.0)).a +
                texture(u_sampler0, v_tex_coord - vec2(dist2, 0.0)).a +
                texture(u_sampler0, v_tex_coord + vec2(0.0, dist2)).a +
                texture(u_sampler0, v_tex_coord - vec2(0.0, dist2)).a;
  
  return blur /= 8.0;
}


vec4 Msdf() {

  vec4 texel = texture(u_sampler0, v_tex_coord);
  float dist = median(texel.r, texel.g, texel.b);
  // float pxDist = screenPxRange() * (dist - 0.5);
  float opacity = clamp(pxDist + 0.5, 0.0, 1.0);
  // opacity += Glow() * 2.4; // Combine the original texture with the blurred alpha
 
  vec4 alpha = vec4(opacity+.0); 
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

  vec4 texel = texture( u_sampler0, v_tex_coord);
  
  color *= texel;
  color.rgb *= color.a; // Include alpha from user input color
  
  float distance = max(texture(u_sampler0, v_tex_coord).r, max(texture(u_sampler0, v_tex_coord).g, texture(u_sampler0, v_tex_coord).b));
  
  // Remove all black color and render only the colored texture
  color.a *= distance;
  // color.a = distance;

  `;