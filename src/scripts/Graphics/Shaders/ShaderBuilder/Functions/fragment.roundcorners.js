
/** Analytical Smooth Lines:  https://www.shadertoy.com/view/tsyfDm
 
#define COLOR_RED   		vec3(1.0, 0.0, 0.0)
#define COLOR_GREEN 		vec3(0.0, 1.0, 0.0)
#define COLOR_BLUE  		vec3(0.0, 0.0, 1.0)
#define LINE_THICKNESS_MIN 	1.5
#define LINE_THICKNESS_MAX 	50.0
#define M_PI				3.141592654

float DistanceToLine(vec2 a, vec2 b, vec2 p)
{
    vec2 pos = p - a;
    vec2 dir = b - a;
    float len = length(dir);
    dir /= len;
    float f = dot(dir, pos);
    if (f < 0.0)
        return distance(a, p);
          else if (f > len)
        return distance(b, p);
    else
        return distance(a + dir * f, p);
}

void DrawSmoothLine(inout vec3 fragColor, vec2 fragCoord, vec2 a, vec2 b, float thickness, vec3 color)
{
    float d = DistanceToLine(a, b, fragCoord);
    float t = clamp(thickness, LINE_THICKNESS_MIN, LINE_THICKNESS_MAX);
    float e = 1.0 + (t - LINE_THICKNESS_MIN) / (LINE_THICKNESS_MAX - LINE_THICKNESS_MIN) * (LINE_THICKNESS_MAX * 10.0);
    float s = pow(smoothstep(0.0, t, d), e);
    fragColor += color * (1.0 - s);
}

#define SMOOTH_LINE(A, B, THICKNESS, COL) \
    DrawSmoothLine(col, fragCoord, (A), (B), (THICKNESS), (COL))

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec3 col = vec3(0);
    float anim = 0.5 + 0.5 * clamp(cos(iTime + M_PI)*1.1, -1.0, +1.0);
    float thickness = mix(LINE_THICKNESS_MIN, LINE_THICKNESS_MAX, anim);
    
    SMOOTH_LINE(
        iResolution.xy/2.0 + vec2(-150.0, -150.0),
        iResolution.xy/2.0 + vec2(   0.0, +150.0),
        thickness,
        COLOR_RED
          );
    SMOOTH_LINE(
        iResolution.xy/2.0 + vec2(   0.0, +150.0),
        iResolution.xy/2.0 + vec2(+150.0, -150.0),
        thickness,
        COLOR_GREEN
          );
    SMOOTH_LINE(
        iResolution.xy/2.0 + vec2(-150.0, -150.0),
        iResolution.xy/2.0 + vec2(+150.0, -150.0),
        thickness,
        COLOR_BLUE
          );
    
    fragColor = vec4(col, 1.0);
}
 */










export const frag_round_corners_call = '  color = Round_corners(scale_down);';
export const frag_round_corners = `


#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif

vec4 Round_corners(float scale_down)
{

    #ifdef U_RCORNERS_FLOAT
        float slider = u_rcorners_1f;
    #else
        float slider = .3;
    #endif

    float scale_up = 1./scale_down;
    vec2 rCorners = vec2(v_rcorners) * scale_down;
    float feather = v_feather;
    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
    vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);
    

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
    
    
    vec2 q = (abs(uv) - dim) + rCorners.x; // Again Subtract constant dimention
    float d = length(max(q, 0.0)) - rCorners.x;
    
    
    float wb = clamp(-d / feather, 0.0, 1.0);
    float alpha = src_color.a * wb;
    vec3 color = src_color.rgb * alpha;


    float min_dim = (dim.x < dim.y) ? dim.x : dim.y;
    // float strength = 2.2 * ((1. + 1.8*.5) - ((slider+1.)*.5));   /* Creates a lighter shadow on full slider */
    float strength = 2.2 * (((slider+1.)*.5));                      /* Creates a stronger shadow on full slider */
    // float strength = 2.2;
    
    /* The greater the power, the bigger the distance of the effect. pow:min=0.0, max=1.0*/
    float ratio = pow(min_dim, .6) * .46;                           /* More in large lengths and less in small */
    // float ratio = pow(min_dim, .36) * 1.;                        /* More in small lengths and less in large */
    float depth = rCorners.x * ratio * slider;

    /* Shadow effect depth */
    float shad_len = length(max((abs(uv) - dim) + depth, 0.0));

    float g = smoothstep(.0, min_dim, shad_len);


    // if(g>=1.) color = vec3(1.);
    // else if(g<=0.) color = vec3(.0, 1., 1.);
    color = mix( color, pow(color, vec3(strength)), g );
    // color = mix( color, pow(color, vec3(strength)), 0. );
    
    return vec4(color, alpha);
}
`;

// export const frag_round_corners = `


// #ifndef UV_READY
//     vec2 uv = vec2(0,0);
// #endif

// vec4 Round_corners(float scale_down)
// {

//     #ifdef U_RCORNERS_FLOAT
//         float distance = u_rcorners_1f*.1;
//     #else
//         float distance = .3;
//     #endif

//     float scale_up = 1./scale_down;
//     vec2 rCorners = vec2(v_rcorners) * scale_down;
//     float feather = v_feather;
//     vec2 res = u_screen_res;
//     vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
//     vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);
    

//     #ifndef UV_READY
//         #define UV_READY 1
        
//         uv = (gl_FragCoord.xy-(res*.5));
//         uv.x += (res.x*.5); // Center mesh to screen
//         uv.y -= (res.y*.5); // Center mesh to screen
        
//         // To move with mesh position
//         uv.x -= v_wpos3_x;
//         uv.y += v_wpos3_y;
        
//         // Subtract constant dimention
//         uv.x -= dim.x*scale_up; 
//         uv.y -= -dim.y*scale_up;
//     #endif    
    
    
//     vec2 q = (abs(uv) - dim) + rCorners.x; // Again Subtract constant dimention
//     float d = length(max(q, 0.0)) - rCorners.x;
    
    
//     float wb = clamp(-d / feather, 0.0, 1.0);
//     float alpha = src_color.a * wb;
    

//     vec3 color = src_color.rgb * alpha;
    
//     /*** Shaded Color ***/
//     // float wide = dim.x*.03; 
//     // float wide = dim.x*.4; 
//     // float wide = dim.x*.1; 
//     // float max_dist = 1.; 
//     // float strength = 3.8; 
//     // color = mix( color, pow(color, vec3(strength)), max_dist-smoothstep(0.0, dim.x, abs(d)*wide) );


//     float dist = (dim.x < dim.y) ? dim.x : dim.y;
//     float wide = 1.; 
//     // float wide = dist*.01; 
//     float strength = 14.2; 
//     // float g = 1.0 - clamp(smoothstep(0.0, distance, abs(d)*wide), 0.0, 1.0);
//     // float g = clamp(smoothstep(distance, 0.0, abs(d)*wide), 0., 1.9);
//     // float g = clamp(smoothstep(10., 0.0, abs(d))*distance, 0., 1.9);
//     // float g = smoothstep(1., .0, abs(d * (dim.x+dim.y))*distance);
//     float g = smoothstep(1., .0, abs(d)*distance);
    
//     float ddd = 15.;
//     float jjj = length(max((abs(uv) - dim)+ ddd, 0.0)) - ddd;
//     // float jjj = length((abs(uv) - dim) + dim);
//     // float jjj = length((abs(uv) - dim));
//     // float g = smoothstep(1., .0, abs(jjj)*distance); // + (dim.x*dim.y);
//     // float g = 1.-smoothstep(.0, 1.0, abs(jjj)*distance);
//     // float g = smoothstep(.0, 1.0, abs(jjj)*wide);
    
//     color = mix( color, pow(color, vec3(strength)), g+g );

    
//     return vec4(color, alpha);
// }
// `;


export const frag_feather_call = '  color *= Feather(scale_down);';
export const frag_feather = `


#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif

float Feather(float scale_down)
{
    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
    float feather = (v_feather <= 0.0) ? 0.00001 : v_feather;
    float scale_up = 1./scale_down;

    // #ifndef UV_READY
    //     #define UV_READY 1
        
    //     uv = (gl_FragCoord.xy-(res*.5));
    //     uv.x += (res.x*.5); // Center mesh to screen
    //     uv.y -= (res.y*.5); // Center mesh to screen
        
    //     // To move with mesh position
    //     uv.x -= v_wpos3_x;
    //     uv.y += v_wpos3_y;
        
    //     // Subtract constant dimention
    //     uv.x -= dim.x*scale_up; 
    //     uv.y -= -dim.y*scale_up;
    // #endif   

    float width = feather;
    vec2 q = (abs(uv) - dim) + width;
    float d = length(max(q, 0.0)) - width;
    float alpha = clamp(-d/feather, 0.0, 1.0);

    return alpha;
}
`;


export const frag_style_call = '  color = Stylize(scale_down);';
export const frag_style_corners = `

vec2 pos = vec2(.0);
float ScreenH;
float AA;

#ifndef UV_READY
vec2 uv = vec2(0,0);
#endif

vec4 Stylize(float scale_down)
{
    // Radius(From 0.01 to 0.35 good values) for rounding corners
    float border_width = v_border;
    float scale_up = 1./scale_down;
    vec2 rCorners = vec2(v_rcorners) * scale_down;
    float feather = v_feather;
    vec2 blur = vec2(0.0, feather);
    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down; // v_dim is the abs(a_pos), and is an interpolated value for every fragment in the span of min-a_pos to max-a_pos
    vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);
    
    float clarity = 40.4;
    ScreenH = min(res.x, res.y)*clarity;
    AA = ScreenH*0.5;

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
    
    
    vec2 q = (abs(uv) - dim) + rCorners.x; // Again Subtract constant dimention
    float d = length(max(q, 0.0)) - rCorners.x;
    
    
    float wb = clamp(-d / feather, 0.0, 1.0);
    float alpha = src_color.a * wb;
    

    vec3 color = src_color.rgb * alpha;
    
    /*** Shaded Color ***/
    float wide = dim.x*.03; 
    float max_dist = .6; 
    // color = mix( color, pow(color, vec3(max_dist)), 1.0-smoothstep(0.0, 5., abs(d)) );
    // color = mix( color, pow(color, vec3(max_dist)), 1.0-smoothstep(0.0, 5., abs(d)) );
    // color = mix( color, pow(color, vec3(max_dist)), 1.0-smoothstep(0.0, 20., abs(d)*wide) );
    // color = mix( color, pow(color, vec3(3.8)), max_dist-smoothstep(0.0, dim.x, abs(d)*wide) );
    color = mix( color, pow(color, vec3(max_dist)), smoothstep(0.0, 200., (d)*wide) );
    
    /*** Border ***/
    float borderWidth = border_width;
    float bd = (abs(d)-borderWidth);
    float wa = clamp(-bd * AA, 0.0, 1.0);
    wb = clamp(-bd / feather, 0.0, 1.0);
    color += color * vec3(abs(wa * wb));
    // color +=  color * pow(vec3(abs(wa * wb)), vec3(4.4));
    
    return vec4(color, alpha);
}
`;
