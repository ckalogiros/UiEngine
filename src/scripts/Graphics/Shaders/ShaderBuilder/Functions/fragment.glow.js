
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

    vec4 glowcol = Glow(color.a);
    // Removes any previous functions calculations. Must be combined with:'color = glowcol'
    // glowcol.rgb *= (1.-alpha); 
    color.rgb += glowcol.rgb; // Adds the glow to the any previous function calculations
`;

export const frag_glow = `

#ifndef UV_READY
   vec2 uv = vec2(0,0);
#endif

vec4 Glow(float alpha)
{

    #ifdef U_GLOW_PARAMS_VEC3
        vec3 controls = u_glow_params;
        float outer = controls.x+.4;
        float inner = controls.y;
        float intensity = controls.z;
    #elif defined(U_GLOW_PARAMS_VEC2)
        vec2 controls = u_glow_params;
        float outer = controls.x+.4;
        float inner = controls.y;
        #ifdef A_GLOW_INTENSITY_FLOAT
            float intensity = v_glow_intensity;
        #else
            float intensity = .5;
        #endif
    #else
        float outer = .5;
        float inner = 1.0;
        float intensity = .5;
    #endif

   vec2 res = u_screen_res;
   vec2 dim = v_dim; // v_dim is the abs(a_pos), and is an interpolated value fro every fragment in the span of min-a_pos to max-a_pos
   
    #ifndef UV_READY
        #define UV_READY 1
        uv = (gl_FragCoord.xy-(res*.5));
        uv.x += (res.x*.5); // Center mesh to screen
        uv.y -= (res.y*.5); // Center mesh to screen
        
        vec2 wpos = v_wpos;
        uv.x -= wpos.x; // To move with mesh position
        uv.y += wpos.y; // To move with mesh position
        
        uv.x -= dim.x; // Subtract constant dimention
        uv.y -= -dim.y; // Subtract constant dimention
    #endif
   
   
   
    float r = dim.y*u_scale2.x;
    // float r = dim.y;
    // float d = smoothstep(dim.y, r,  length(uv));
    float d = smoothstep(dim.y*outer, r*inner,  length(uv));

    vec3 color = v_col.rgb*d*intensity;
    // color.rgb *= d;
    // color.rgb *= original_a;
    // alpha *= original_a;
    // vec3 color = vec3(d*intensity);
    // color = min(v_col.rgb, d*intensity); // WEIRD NICE EFFECT!!!
    // color = max(v_col.rgb, d*intensity); // WEIRD NICE EFFECT!!!
   
   
    // return vec4(color, alpha);
    return vec4(color, d);
}
`;
