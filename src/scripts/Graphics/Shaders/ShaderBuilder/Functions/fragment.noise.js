// export const frag_noise_call = `   color = blend_mode_vec4( color, Noise_procedural(scale_down) );`;
export const frag_noise_call = `   color = Noise_procedural(scale_down);`;
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
      // uv_map_coordinates_zero_one(uv, dim);
    // #endif
    
    vec2 uv2 = (gl_FragCoord.xy-(res*.5))/res;
    float res_ratio = res.y/res.x;
    uv2.y *= res_ratio;
   
   
   
    float d2 = 1.- smoothstep(0.0, dim.y, length(uv));
    float shape = d2 ;
    shape *= revT * (MAX_SPEED) * .1;
    
    
    float complexity = 2.;
    vec2 ratio = vec2(dim.y,dim.x*2.)*controls.z*.25; 
    float noise1 = fbm(complexity * uv2 * vec2(2.* ratio.x, 2.* ratio.x)) ;
    float noise2 = fbm(5. * uv2 * vec2(2.* ratio.x, 2.* ratio.x));
    float n1 = noise1*revT*d2; // +1 for non negative values
    



    // float sum = 1.-((src_color.r + src_color.g + src_color.b)/3.); // Make equal src_color intensity for all rgb combinations
    // n1 *= sum * 2.0;
    n1 *= .66;



    vec3 col = src_color.rgb;

    
    float F = pow(noise2, 3.) *2.; // Characterizes the noise into the src_color.
    F *= d2;

    
    // TODO: Create controls for: [pow(.., X1), F*X2, X3*(time+.4))]
    float mixer = pow((shape-n1)*F*2.5, 2.*(time+.4));
    float mixer2 = pow((shape-n1)*F*2., 6.*(time+.4));
    

    // We want 0 alpha for the outer src_color(s1), and use 'F' for the alpha of the highlights(s2)
    
    // Color 1 
    vec4 s1 = vec4(vec3(n1*n1*col), 0.);
    
    
    // Color 2. Very Nice smoke like effect
    vec4 s2 = vec4(vec3(col*pow((n1)*F*4.5, 2.)), mixer); 
    
    
    // Final Color
    // vec4 c = mix(s1, s2, F);
    vec4 c = mix(s1, s2, mixer);
    
    
    // // Brightness effect
    vec4 bright2 = mix(s1, vec4(vec3(mixer2), 1.-F*3.3), mixer); 
    // vec4 bright2 = mix(s1, vec4(vec3(mixer2), F*6.3), mixer); 
    c += mix(c, bright2, controls.x);

    
    // vec4 bright1 = mix(s1, vec4(vec3(mixer), F), mixer); // EFFECT VERY BRIGHT
    vec4 bright1 = mix(s1, vec4(vec3(mixer), F), F); // EFFECT VERY BRIGHT
    c += bright1*revT*revT*revT*revT*revT*revT*revT*revT*6.*controls.y;
    
    return c;
}
`;


// NOTE: This is still a test noise shader function and it is not used
// export const frag_noise_call = `   color = blend_mode_vec4( color, Noise_procedural(scale_down) );`;
export const frag_noise_2_call = `   color = Noise_procedural_2(scale_down);`;
export const frag_noise_2 = `\


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

float snoise(vec3 uv, float res)
{
	const vec3 s = vec3(1e0, 1e2, 1e3);
	
	uv *= res;
	
	vec3 uv0 = floor(mod(uv, res))*s;
	vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
	
	vec3 f = fract(uv); f = f*f*(3.0-2.0*f);

	vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);

	vec4 r = fract(sin(v*1e-1)*1e3);
	float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
	float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	return mix(r0, r1, f.z)*2.-1.;
}

vec4 Noise_procedural_2(float scale_down)
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
    
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);
    uv_map_coordinates_zero_one(uv, dim);
    
    // vec2 uv2 = gl_FragCoord.xy;
    // vec2 uv2 = (gl_FragCoord.xy-(res*.5))/res;
    // float res_ratio = res.y/res.x;
    // uv2.y *= res_ratio;
    vec2 uv2 = uv;
   
   
   
    // float d2 = 1.- smoothstep(0.0, dim.y, length(uv));
    // float shape = d2 ;
    // shape *= revT * (MAX_SPEED) * .1;
    
    
    float complexity = .6;
    vec2 ratio = vec2(dim.y,dim.x*2.)*controls.z*.25; 
    float noise1 = fbm(complexity * uv2 * vec2(2.* ratio.x, 2.* ratio.x)) ;
    // float n1 = noise1*d2; // +1 for non negative values
    
    // noise1 *= noise1*noise1*noise1*noise1*noise1*3.;
    // noise1 = noise1*noise1*noise1;
    float intensity = 2.;
    // noise1 = max(pow(noise1, 9.)*25., .0);
    // noise1 = min(pow(noise1, 9.)*25., .8);
    noise1 = pow(noise1, 9.)*25.;
    vec3 c = src_color.rgb*vec3(noise1);
    return vec4(c, .0);

}
`;

