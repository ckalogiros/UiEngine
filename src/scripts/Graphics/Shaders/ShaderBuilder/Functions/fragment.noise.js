export const frag_noise_call = `
   color = Noise();
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


vec4 Noise(void)
{

#ifdef U_NOISE_PARAMS
    vec2 controls = u_noise_params;
#else
    vec2 controls = vec2(1.);
#endif
    
vec4 color = v_col;
    float time  = v_time;
    float revT  = 1.-time; // Reverse time to be from 1 to 0

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
    
    vec2 uv2 = (gl_FragCoord.xy-(res*.5))/res;
    // float res_ratio = res.x/res.y;
    // uv.x /= res_ratio;
   
   
   
    float d2 = 1.- smoothstep(0.0, dim.y, length(uv));
    float shape = d2 ;
    // float shape = d2 * min(2.9, controls*.5);
    // shape *= revT * (MAX_SPEED-controls) * .1;
    shape *= revT * (MAX_SPEED) * .1;
    
    
    float complexity = 2.;
    float ratio = 3.; 
    float noise1 = fbm(complexity * uv2 * vec2(2., 2.)*ratio);
    float noise2 = fbm(5. * uv2 * vec2(2., 2.)*ratio);
    float n1 = noise1*revT*d2; // +1 for non negative values
    float n2 = noise2*revT*d2; // +1 for non negative values
    
    float alpha = revT*d2;


    float sum = 1.-((color.r + color.g + color.b)/3.); // Make equal color intensity for all rgb combinations
    n1 *= sum * 2.0;

    vec3 col = color.rgb;

    
    float F = pow(noise2, 3.) *2.; // Characterizes the noize into the color.
    // F *= d2 + (controls*.000000000001);
    F *= d2;

    
    // 
    // float mixer = pow((shape-n1)*F*4.5, 3.);
    // float mixer = (shape-n1)*F*4.5;
    // float mixer = pow((shape-n1)*F*4.5, 4.*(time+.4));
    // float mixer = pow((shape-n1)*F*2.5, 2.*(time+.4));
    float mixer = pow((shape-n1)*F*2.5, 2.*(time+.4));
    float mixer2 = pow((shape-n1)*F*2., 6.*(time+.4));
    // return vec4(mixer);
    


    /*
        We want 0 alpha for the outer color(s1), and use 'F' for the alpha of the highlights(s2)
    */


    // Color 1 
    // vec4 s1 = vec4(vec3(n1*n1*col), F);
    vec4 s1 = vec4(vec3(n1*n1*col), 0.);
    // return s1;
    
    
    // Color 2 
    float color_intensity = 2.;
    // float color_intensity = (controls.x+1.)*5.;
    // vec4 s2 = vec4(vec3(n2*n2*col*color_intensity), alpha);
    // vec4 s2 = vec4(vec3(n2*n2*col*color_intensity), F);
    // vec4 s2 = vec4(vec3(n2*n2*col*color_intensity), 0.);

    // Keep the darker cloud noise at the start, but remove it as time goes by.
    vec4 s2 = mix(vec4(vec3(n2*n2*col*color_intensity), F), vec4(vec3(n2*n2*col*color_intensity), 0.), time);
    // return s2;
    



    // Color 3. Very Nice smoke like effect
    vec4 s3 = vec4(vec3(col*pow((n1)*F*4.5, 2.)), mixer); 
    // vec4 s3 = vec4(vec3(col*pow((n1)*F*4.5, 2.)), F); 
    // return s3;
    
    // vec4 s4 = vec4(vec3(col*n1), F); 
    
    
    // Final Color
    // vec4 c = mix(s1, s3, alpha);
    // vec4 c = mix(s1, s3, F);
    // vec4 c = mix(s1, s3, mixer);
    // vec4 c = mix(s1, s3, mixer2);
    
    
    // vec4 c = mix(s1, s2, mixer);
    vec4 c = mix(s1, s3, mixer);
    
    
    
    /** CHOOSE ONE OF THE BELLOW: bright2 is good for purple color, bright 1 is good for a very bright fire ball */
    vec4 bright2 = mix(s1, vec4(vec3(mixer2), 1.-F*2.6), mixer); // EFFECT VERY BRIGHT
    // vec4 bright2 = mix(s1, vec4(vec3(mixer2*col*1.3), 1.-F*2.6), mixer); // EFFECT VERY BRIGHT
    // vec4 bright2 = mix(s1, vec4(mixer2*col*1., F*4.6), mixer); // EFFECT VERY BRIGHT
    // vec4 bright2 = mix(s1, vec4(vec3(mixer2), 1.-F*6.6), mixer); // EFFECT VERY BRIGHT
    // c += bright2*.5;
    // c += bright2;
    
    c += mix(c, bright2, controls.x);
    
    vec4 bright1 = mix(s1, vec4(vec3(mixer), F), mixer); // EFFECT VERY BRIGHT
    // c += bright1*.3;
    // c += bright1;
    c += bright1*revT*revT*revT*revT*revT*revT*revT*revT*6.*controls.y;
    
    // c += bright1*revT*revT*revT*revT;
    // c += bright1*revT*revT*revT*revT*revT*revT*revT*revT;
    

    
    return c;
    // return vec4(1.,1.,1.,.1);

}
`;
