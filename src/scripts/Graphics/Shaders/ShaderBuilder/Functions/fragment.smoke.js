/*TEST-NOISES*/
// export const frag_smoke_call = `\

//    vec4 shader_col = Smoke();
//    color = shader_col;
// `;



// export const frag_smoke = `


// #ifndef UV_READY
//     vec2 uv = vec2(0,0);
// #endif



// // procedural Noise from IQ
// // vec2 hash(vec2 p)
// // {
// //     p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
// //     return -1.0 + 2.0*fract(sin(p)*43758.5453123);
// // }


// // float Noise(in vec2 p)
// // {
// //     const float K1 = 0.366025404; // (sqrt(3)-1)/2;
// //     const float K2 = 0.211324861; // (3-sqrt(3))/6;
    
// //     vec2 i = floor( p + (p.x+p.y)*K1 );
// //     vec2 a = p - i + (i.x+i.y)*K2;
// //     vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
// //     vec2 b = a - o + K2;
// //     vec2 c = a - 1.0 + 2.0*K2;
    
// //     vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    
// //     vec3 n = h*h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
// //     return dot( n, vec3(100.0) );
// // }


// // float fbm(vec2 uv)
// // {
// //     float f; float n = 1.4; float a = 0.1;
// //     mat2 m = mat2( n, -n, n,  n );
// //     f  = 0.5000 * Noise(uv); uv = m*uv; f += 0.2500 * Noise(uv); uv = m*uv; f += 0.1250 * Noise(uv); uv = m*uv; f += 0.0625 * Noise(uv); uv = m*uv; f = 0.55 + 0.5*f; 
// //     return f;
// // }




// vec2 hash( vec2 p ) {  						
// 	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
// 	return -1. + 2.*fract(sin(p+20.)*53758.5453123);
// }
// float Noise( in vec2 p ) {
//     vec2 i = floor(p), f = fract(p);
// 	vec2 u = f*f*(3.-2.*f);
//     return mix( mix( dot( hash( i + vec2(0.,0.) ), f - vec2(0.,0.) ), 
//                      dot( hash( i + vec2(1.,0.) ), f - vec2(1.,0.) ), u.x),
//                 mix( dot( hash( i + vec2(0.,1.) ), f - vec2(0.,1.) ), 
//                      dot( hash( i + vec2(1.,1.) ), f - vec2(1.,1.) ), u.x), u.y);
// }



// #define PowVec3(c, P) vec3(pow(c.r, P), pow(c.g, P), pow(c.b, P))
// #define MIN(a,b) ((a)<(b)?(a):(b))
// #define MinVec3F(a, f)  vec3(MIN(a.x, f), MIN(a.y, f), MIN(a.z, f))

// vec4 Smoke()
// {
//     float rand = u_smoke_params.x;
//     vec2 res = u_screen_res;
//     vec2 dim = v_dim; // v_dim is the abs(a_pos), and is an interpolated value fro every fragment in the span of min-a_pos to max-a_pos
    
// #ifndef UV_READY
//    #define UV_READY 1
//    uv = (gl_FragCoord.xy-(res*.5));
//    uv.x += (res.x*.5); // Center mesh to screen
//    uv.y -= (res.y*.5); // Center mesh to screen
   
//    vec2 wpos = v_wpos;
//    uv.x -= wpos.x; // To move with mesh position
//    uv.y += wpos.y; // To move with mesh position
   
//    uv.x -= dim.x; // Subtract constant dimention
//    uv.y -= -dim.y; // Subtract constant dimention
// #endif


//    float t  = v_time;
// //    float t  = 0.9;
//    float revT  = 1.-t; // Reverse t to be from 1 to 0


//    float wide = .7;
//    float start = 1. - wide; // 1.is the max time
// //    float d2 = 1.- smoothstep(0., dim.y*(t*wide+start+.1), length(uv));
//    float d2 = 1.- smoothstep(0., dim.y*2., length(uv));
//    float shape = d2 ;
//    shape *= revT;
      
      

//    float complexity = 3.;
//    float ratio = 0.002; // A value to sustitute the screen space for the shader space(-1,+1), for producing the noise
// //    float noise = fbm(complexity * uv * ratio + sin(t+rand));
// //    float noise = Noise(complexity * uv * ratio + sin(rand));
//    float noise = Noise(uv*t*rand*.04);

//    return vec4(noise);
   

//    float n1 = noise*noise*noise*noise*6.*d2; // +1 for non negative values
//    float n2 = noise*noise*noise*noise*d2; // +1 for non negative values

   
   
//    float mixer = shape-n1;
//    // return vec4((mixer));
//    // return vec4((mixer-n1));



//    /**************************************************************/

//    // return vec4(1.);

//    vec4 s2 = vec4(mixer);
//    // return s2;
   
//    vec4 s3 = vec4(n1);
//    // return s3;

//    vec4 s4 = vec4(n2);
//    // return s4;


//    // Final Color
// //    vec4 c = s3*revT;
//    vec4 c = s3;
//    // vec4 c = mix(s3, s2, t)*revT;

//    c*=v_col;
//    return c;

// }
// `;
/**SAVE */
export const frag_smoke_call = `\

   vec4 shader_col = Smoke();
   color = shader_col;
`;

export const frag_smoke = `


#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif



// procedural Noise from IQ
vec2 hash(vec2 p)
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}


float Noise(in vec2 p)
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
    f  = 0.5000 * Noise(uv); uv = m*uv; f += 0.2500 * Noise(uv); uv = m*uv; f += 0.1250 * Noise(uv); uv = m*uv; f += 0.0625 * Noise(uv); uv = m*uv; f = 0.55 + 0.5*f; 
    return f;
}


#define PowVec3(c, P) vec3(pow(c.r, P), pow(c.g, P), pow(c.b, P))
#define MIN(a,b) ((a)<(b)?(a):(b))
#define MinVec3F(a, f)  vec3(MIN(a.x, f), MIN(a.y, f), MIN(a.z, f))

vec4 Smoke()
{
    float rand = u_smoke_params.x*2.;
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


    float t  = v_time;
    float revT  = 1.-t; // Reverse t to be from 1 to 0

        
    float r = u_scale2.x;
    float wide = u_smoke_params.y;
    float start = 1. - wide; // 1.is the max time
    float d2 = 1.- smoothstep(0., dim.y*r*(t*wide+start+.1), length(uv));
    // float shape = d2 ;
    // shape *= revT;
        
        

    float complexity = 6. * u_smoke_params.z;
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

    c*=v_col;
    return c;

}
`;