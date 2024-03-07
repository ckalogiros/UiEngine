/**************************************************************************************************
 * SDF Text Rendering Shader
 */
export const frag_sdf_call = '  color *= Sdf(v_sdf.x, v_sdf.y);';
// export const frag_sdf_call = '  vec4 c = Sdf(v_sdf.x, v_sdf.y); color.a *= c.r;';
export const frag_sdf = '\n\
vec4 Sdf(float inner, float outer){\n\
  float b = max(texture(u_sampler0, v_tex_coord).r, max(texture(u_sampler0, v_tex_coord).g, texture(u_sampler0, v_tex_coord).b));\n\
  float pixelDist = 1. - b;\n\
  // float alpha = 1. - smoothstep(.3, .7, pixelDist);\n\
  float alpha = 1. - smoothstep(inner, inner + outer, pixelDist);\n\
  // inner = .01;\n\
  // float alpha = 1. - smoothstep(inner, inner+.15, pixelDist);\n\
  return vec4(alpha);\n\
  // return vec4(.7);\n\
}\n\
';

/**************************************************************************************************
 * MSDF Text Rendering Shader
*/
export const frag_msdf_call = '  color *= Msdf();';
export const frag_msdf = '\n\
// set to distance fields pixel range\n\
// uniform float pxRange;\n\
// float pxRange = 22.5;\n\
float pxRange = 15.5;\n\
// float pxRange = 6.5; // minimum\n\
\n\
float median(float r, float g, float b) {\n\
  return max(min(r, g), min(max(r, g), b));\n\
}\n\
float screenPxRange() {\n\
  vec2 unitRange = vec2(pxRange)/vec2(textureSize(u_sampler0, 0));\n\
  // vec2 unitRange = vec2(pxRange);\n\
  vec2 screenTexSize = vec2(1.0)/fwidth(v_tex_coord);\n\
  return max(0.5*dot(unitRange, screenTexSize), 1.0);\n\
}\n\
\n\
\n\
// VERY SIMPLE BLUR FOR GLOWING EFFECT.\n\
float Glow()\n\
{\n\
  float dist2 = 0.001;\n\
  float blur = texture(u_sampler0, v_tex_coord + vec2(dist2, 0.0)).a +\n\
               texture(u_sampler0, v_tex_coord - vec2(dist2, 0.0)).a +\n\
               texture(u_sampler0, v_tex_coord + vec2(0.0, dist2)).a +\n\
               texture(u_sampler0, v_tex_coord - vec2(0.0, dist2)).a;\n\
  \n\
  return blur /= 8.0;\n\
}\n\
vec4 Msdf() {\n\
  vec4 texel = texture(u_sampler0, v_tex_coord);\n\
  float dist = median(texel.r, texel.g, texel.b);\n\
  float pxDist = screenPxRange() * (dist - 0.5);\n\
  float opacity = clamp(pxDist + 0.5, 0.0, 1.0);\n\
  // opacity += Glow() * 2.4; // Combine the original texture with the blurred alpha\n\
  vec4 alpha = vec4(opacity+.0); \n\
  return alpha; \n\
}\n\
';
// export const frag_msdf = '\n\
// \n\
// float median(float r, float g, float b) { \n\
//   return max(min(r, g), min(max(r, g), b)); \n\
// }\n\
// \n\
// //uniform float pxRange; // set to distance field\'s pixel range \n\
// float pxRange = .00001; // set to distance field\'s pixel range \n\
// \n\
// float screenPxRange() {\n\
//   vec2 unitRange = vec2(pxRange)/vec2(textureSize(u_sampler0, 0));\n\
//   vec2 screenTexSize = vec2(1.0)/fwidth(v_tex_coord);\n\
//   return max(0.5*dot(unitRange, screenTexSize), 1.0);\n\
// }\n\
// \n\
// vec4 Msdf() { \n\
//   vec3 msd = texture(u_sampler0, v_tex_coord).rgb; \n\
//   float sd = median(msd.r, msd.g, msd.b); \n\
//   float screenPxDistance = screenPxRange()*(sd - 0.5); \n\
//   float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0); \n\
// //   vec4 bgColor = vec4(.0, .0, 0., .0);\n\
// //   vec4 fgColor = vec4(1.0, 1., 1., 1.);\n\
//   vec4 alpha = vec4(opacity); \n\
//   return alpha; \n\
// } \n\
// ';

/**************************************************************************************************
 * Simple Texture Rendering Shader
*/

/**
 * The transparency is controlled by the clearColor() as the background color of the framebuffer texture
 * So we compare if the rgb color is = to the transparent color, we set the alha to 0.
 * Because of the floating point error, we check above and below the transparent color.
 */
export const frag_tex = '\n\
  float min = .1097;\n\
  float max = .1113;\n\
  color.rgb *= texture( u_sampler0, v_tex_coord).rgb;\n\
  if((color.r >= min && color.r <= max) && (color.g >= min && color.g <= max) && (color.b >= min && color.b <= max)) color.a = 0.0;\n\
  // if((color.r >= min && color.r <= max)) color.a = 0.0;\n\
  color.rgb *= color.a;\n\
';