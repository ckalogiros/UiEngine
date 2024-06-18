
/**
 * Must decide:
 * Do we multiply the color with the functions Glow() return color
 * Or we add it?
 * 
 * In the case of addition, the retuurn color must be 0 where the previous color must not be changed
 * and only add the new created color from Glow() color calculation.
 * 
 * I think the only option is the addition
 * In the multiplication we need to return 1 for color we do not want to change
 * and a 
 */

export const frag_glow_call = `\
   // color += Glow(alpha);\n\
   vec4 glowcol = Glow(alpha);\n\
   glowcol.rgb *= (1.-alpha); // Disable the particle color. For mixing the two colors(particle and glow) producing a light bulb effect\n\
   color.rgb += glowcol.rgb;\n\
   // color.rgb = min(color.rgb, glowcol.rgb);\n\
   // color.rgb = max(color.rgb, glowcol.rgb);\n\
   // color.rgb = mix(color.rgb, glowcol.rgb, .6);\n\
   \n\
   // color.rgb *= color.rgb; // Reduce the particle color effect\n\
   \n\
   color.a = glowcol.a;\n\
   // color.a = 1.;\n\
   // color.a = max(color.a, glowcol.a);\n\
   color = clamp(color, 0., 1.);\n\
`;

export const frag_glow = '\
\n\
vec4 Glow(float alpha)\n\
{\n\
   float strength1 = v_glow_params.x;\n\
   float strength2 = v_glow_params.y;\n\
   float a = alpha;\n\
   vec2 res = u_screen_res;\n\
   vec2 uv = (gl_FragCoord.xy-(res*.5));\n\
   vec2 dim = v_dim; // v_dim is the abs(a_pos), and is an interpolated value fro every fragment in the span of min-a_pos to max-a_pos\n\
   \n\
   vec2 wpos = v_wpos;\n\
   uv.x += (res.x*.5); // Center mesh to screen\n\
   uv.y -= (res.y*.5); // Center mesh to screen\n\
   uv.x -= wpos.x; // To move with mesh position\n\
   uv.y += wpos.y; // To move with mesh position\n\
   \n\
   uv.x -= dim.x; // Subtract constant dimention\n\
   uv.y -= -dim.y; // Subtract constant dimention\n\
   \n\
   // float r = dim.y+dim.y*.1;\n\
   float r = dim.y;\n\
   // float strength = 1.1;\n\
   float strength = strength1;\n\
   float d = smoothstep(r, r-(r*strength), length(uv));\n\
   // float d = smoothstep(r+(r*.2), r-(r*.5), length(uv));\n\
   // float d = smoothstep(r+(r*.2), r-(r*.9), length(uv));\n\
   \n\
   // vec3 color = vec3(d);\n\
   vec3 color = v_col.rgb*d;\n\
   // vec3 color = max(v_col.rgb, v_col.rgb*d);\n\
   // vec3 color = max(v_col.rgb, d); // WEIRD NICE EFFECT!!!\n\
   \n\
   \n\
   // Create strong based on distance\n\
   // Based on mult color\n\
   float reverse_dist = d;\n\
   // float stren = 2. * reverse_dist;\n\
   float stren = strength2 * reverse_dist;\n\
   color.rgb *= stren;\n\
   // Based on pow function\n\
   // float reverse_dist = 1.-d;\n\
   // float stren = 2.8 * reverse_dist;\n\
   // color.rgb = pow(color.rgb, vec3(stren));\n\
   \n\
   // if(d>.5) d = smoothstep(1., .0, d); // Remove any color from a boundary to center, with smoothstep\n\
   // vec3 color = v_col.rgb*d*(1.-alpha); // 1.0-alpha: Removes any alpha from the previous stage(function)\n\
   \n\
   return vec4(color, alpha);\n\
   // return vec4(color, d*(1.-alpha));\n\
   // return u_col4;\n\
}\n\
';
