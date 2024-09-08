export const frag_noise_call = `
   color = Noise(scale_down);
`;
export const frag_noise = `\


#define MAX_SPEED 19.

#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif


// procedural FS_NOISE from IQ
vec2 hash(vec2 p)
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}


float FS_NOISE(in vec2 p)
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324861; // (3-sqrt(3))/6;
    
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    
    vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(100.0) );
}


float fbm(vec2 uv)
{
    float f; float n = 1.4; float a = 0.1;
    mat2 m = mat2( n, -n, n,  n );
    f  = 0.5000 * FS_NOISE(uv); uv = m*uv; f += 0.2500 * FS_NOISE(uv); uv = m*uv; f += 0.1250 * FS_NOISE(uv); uv = m*uv; f += 0.0625 * FS_NOISE(uv); uv = m*uv; f = 0.55 + 0.5*f; 
    return f;
}


#define PowVec3(c, P) vec3(pow(c.r, P), pow(c.g, P), pow(c.b, P))
#define MIN(a,b) ((a)<(b)?(a):(b))
#define MinVec3F(a, f)  vec3(MIN(a.x, f), MIN(a.y, f), MIN(a.z, f))


vec4 Noise(float scale_down)
{

    #ifdef U_NOISE_PARAMS
        vec3 controls = u_noise_params;
    #else
        vec3 controls = vec2(1.);
    #endif
        

    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
    vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);
    float time  = v_time;
    float revT  = 1.-time; // Reverse time to be from 1 to 0
    
   
    #ifndef UV_READY
        #define UV_READY 1
        uv = (gl_FragCoord.xy-(res*.5));
        uv.x += (res.x*.5); // Center mesh to screen
        uv.y -= (res.y*.5); // Center mesh to screen
        
        uv.x -= v_wpos3_x; // To move with mesh position
        uv.y += v_wpos3_y; // To move with mesh position
        
        uv.x -= dim.x; // Subtract constant dimention
        uv.y -= -dim.y; // Subtract constant dimention
    #endif
    
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
    // return vec4(1.,1.,1.,.0);

}
`;


