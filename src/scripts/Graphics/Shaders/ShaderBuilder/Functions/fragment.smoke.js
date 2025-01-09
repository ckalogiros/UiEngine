
export const frag_smoke_call = `

   vec4 shader_col = Smoke(scale_down);
   final_color = shader_col;
`;

export const frag_smoke = `


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


#define PowVec3(c, P) vec3(pow(c.r, P), pow(c.g, P), pow(c.b, P))
#define MIN(a,b) ((a)<(b)?(a):(b))
#define MinVec3F(a, f)  vec3(MIN(a.x, f), MIN(a.y, f), MIN(a.z, f))

vec4 Smoke(float scale_down)
{
    #ifdef U_SMOKE_PARAMS_VEC3
        vec3 controls = u_smoke_params;
    #else
        vec intensity = vec3(1., 1., 1.);
    #endif

    float scale_up = 1./scale_down;
    float rand = controls.x*2.;
    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y);  
    vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);  

    #ifndef UV_READY
        #define UV_READY 1
        
        uv = (gl_FragCoord.xy-(res*.5));
        uv.x += (res.x*.5); // Center mesh to screen
        uv.y -= (res.y*.5); // Center mesh to screen
        
        // To move with mesh position
        uv.x -= v_wpos3_x;
        uv.y += v_wpos3_y;
        
        // Subtract constant dimention
        uv.x -= dim.x*scale_up; 
        uv.y -= -dim.y*scale_up;
    #endif 

    // #ifndef UV_READY
    //     #define UV_READY 1
    //     uv = gl_FragCoord.xy;
    //     pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);
    // #endif  


    float t  = v_time;
    float revT  = 1.-t; // Reverse t to be from 1 to 0

        
    float r = scale_down;
    float wide = controls.y;
    float start = 1. - wide; // 1.is the max time
    float d2 = 1.- smoothstep(0., dim.y*r*(t*wide+start+.1), length(uv));
    // float shape = d2 ;
    // shape *= revT;
        
        

    float complexity = 6. * controls.z;
    float ratio = 0.002; // A value to sustitute the screen space for the shader space(-1,+1), for producing the noise
    // float noise = fbm(complexity * uv * ratio + sin(t+rand));
    float noise = fbm(complexity * uv * ratio + (sin(t)+rand));
    // float noise = fbm(complexity * uv * ratio);

    

    float n1 = noise*noise*noise*noise*6.*d2; // +1 for non negative values
    // float n2 = noise*noise*noise*noise*6.*d2; // +1 for non negative values

    
    
    // float mixer = shape-n1;
    // return vec4((mixer));
    // return vec4((mixer-n1));



    /**************************************************************/

    // return vec4(1.);

    // vec4 s2 = vec4(mixer);
    // return s2;
    
    vec4 s3 = vec4(n1);
    // return s3;

    // vec4 s4 = vec4(n2);
    // return s4;


    // Final Color
    vec4 c = s3*revT;
    // vec4 c = s4*revT;
    // vec4 c = mix(s3, s2, t)*revT;

    c*=src_color;
    return c;

}
`;