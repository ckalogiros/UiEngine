
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










// export const frag_round_corners_call = '  color = blend_color_multiply( color, Round_corners(scale_down) );';
export const frag_round_corners_call = '  color = Round_corners(scale_down);';
export const frag_round_corners = `

/********************************************************************************************/
// SHADER UNIT: frag_round_corners
/********************************************************************************************/


#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif




vec4 Round_corners(float scale_down)
{
    #ifdef U_GENERIC_VEC3
        include <u_generic_vec3>
    #elif defined(U_GENERIC_VEC2)
        #include <u_generic_vec2>
    #elif defined(U_GENERIC_FLOAT)
        #include <u_generic_float>
    #else
        float control1 = 0.;
    #endif

    #ifdef A_ANGLE
        control1 = v_angle;
    #endif

    float scale_up = 1./scale_down;
    vec2 rCorners = vec2(v_rcorners) * scale_down;
    // vec2 rCorners = vec2(v_rcorners) ;
    float feather = v_feather;
    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
    vec2 vpos = vec2(v_pos2_x, v_pos2_y);
    vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
    

    #ifndef UV_READY
        #define UV_READY 1
        uv = gl_FragCoord.xy;
        pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim*scale_up);
        // pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);
    #endif   

    vec2 localPos;

    // Re-create the rotation matrix
    float angle = control1;
    // float angle = 1.2;
    float c = 0.0;
    float s = 0.0;
    if(angle > 0.) {
        float c = cos(angle);
        float s = sin(angle);
        mat2 rot = mat2(s, -c, c, s);
        localPos = abs(vpos.yx*rot);
    }
    else localPos = abs(vpos);

    // Invert the rotation, to correctly calculate the distance on rotated objects
    // mat2 inv_rot = transpose(rot);

    // Invert the rotation for every pixel
    // localPos = abs(vpos.yx*rot);
    // vec2 localPos = abs(vpos.yx*inv_rot);
    
    
    // Create the render distance limit 
    float d = length(max((localPos - dim) + rCorners.x, 0.0)) - rCorners.x;
    
    float alpha = clamp(-d / feather, 0.0, 1.0);
    src_color.a *= alpha;
    vec3 color = src_color.rgb * alpha * src_color.a;

    // return vec4(src_color);
    return vec4(color, alpha * src_color.a);
    // return vec4(color, src_color.a);
}
`;
/**SAVE: WITH SHADE IMPLEMENTATION*/
// export const frag_round_corners = `

// /********************************************************************************************/
// // SHADER UNIT: frag_round_corners
// /********************************************************************************************/


// #ifndef UV_READY
//     vec2 uv = vec2(0,0);
// #endif

// #define PI 3.14159
// #define PI4 (PI)/(4.)


// vec4 Round_corners(float scale_down)
// {
    // #ifdef U_RCORNERS_VEC3
    //     float slider = u_rcorners.x;
    //     float smoothness = u_rcorners.y;
    //     float power = u_rcorners.z;
    // #elif defined(U_RCORNERS_VEC2)
    //     float slider = u_rcorners.x;
    //     float smoothness = u_rcorners.y;
    //     float power = 1.;
    // #elif defined(U_RCORNERS_FLOAT)
    //     float slider = u_rcorners;
    //     float smoothness = .5;
    //     float power = 1.;
    // #else
    //     float slider = .2;
    //     float smoothness = .5;
    //     float power = 1.;
    // #endif


//     float scale_up = 1./scale_down;
//     vec2 rCorners = vec2(v_rcorners) * scale_down;
//     float feather = v_feather;
//     vec2 res = u_screen_res;
//     vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
//     vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
    

//     #ifndef UV_READY
//         #define UV_READY 1
//         uv = gl_FragCoord.xy;
//         pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim*scale_up);
//     #endif   

//     vec2 abs_uv = abs(uv);
//     // vec2 abs_uv = abs(uv);
//     // vec2 abs_uv = uv;

//     vec2 vpos = abs(dim);
//     vec2 vdim = vec2(200.);

//     // pixel_apply_world_position_offset_x(vpos.x, v_wpos3_x); 
//     // pixel_apply_reverse_y_coordinates(vpos.y, res.y); 
//     // pixel_apply_world_position_offset_y(vpos.y, v_wpos3_y); 
//     // vpos -= vdim;

//     // float angle = 0.786;
//     // float angle = 0.64;
//     float angle = PI4;
//     // float angle = 1.5;
//     float c = cos(angle);
// 	float s = sin(angle);
//     mat2 rot = mat2(s, -c, c, s);
//     mat2 inv_rot = transpose(rot);

//     vec2 localPos = abs(vpos*inv_rot);

    
//     // pixel_apply_world_position_offset_x(localPos.x, v_wpos3_x); 
//     // pixel_apply_reverse_y_coordinates(localPos.y, res.y); 
//     // pixel_apply_world_position_offset_y(localPos.y, v_wpos3_y); 
//     // localPos -= vdim;

//     // float d = length(max((abs_uv - dim) + rCorners.x, 0.0)) - rCorners.x;
//     // float d = length(max((abs_uv - abs(dim)) + rCorners.x, 0.0)) - rCorners.x;
//     // float d = length((abs_uv - abs(vpos)) + rCorners.x) - rCorners.x;
//     // float d = length((abs_uv - abs(dim)) + rCorners.x) - rCorners.x;
//     // float d = length((vpos - vdim) + rCorners.x) - rCorners.x;
//     // float d = length((vpos - vdim) + rCorners.x) - rCorners.x;
    
//     float d = length( max( (localPos - vdim) + rCorners.x, 0.0 )) - rCorners.x;
//     // float d = length( max( (localPos - vpos) + rCorners.x, 0.0 )) - rCorners.x;
//     // float d = length((localPos - vdim) + rCorners.x) - rCorners.x;

//     // vec2 distToEdges = vdim - vpos;
//     // // Example: create a color based on the edge distance
//     // float edgeDistance = min(distToEdges.x, distToEdges.y);
//     // return vec4(vec3(edgeDistance), 1.0);

//     // // float c = smoothmin(abs(uv.x), abs(uv.y), 30.01);
//     // // return vec4(vec3(c), 1.);

//     // float wb = clamp(-d / feather, 0.0, 1.0);
//     float wb = -d;
//     float alpha = src_color.a * wb;
//     // vec3 color = src_color.rgb * alpha;
//     vec3 color = src_color.rgb;

//     // if(abs(dim.x) > 0.) return YELLOW;
//     // if(d > 10.) return YELLOW;
//     // if(d < 1.) return RED;

//     return vec4(color, alpha);


//     // float min_dim = (dim.x < dim.y) ? dim.x : dim.y;
//     // // float strength = 2.2 * ((slider+1.)*.5);                        /* Creates a stronger shadow on full slider */
//     // float strength = 1.;
    
//     // power *= 2.;
//     // power += 1.;
    
//     // float balance_dim_ratio = max(min_dim, 1.);
//     // // float round_preserv = rCorners.x * .5;
//     // float round_preserv = rCorners.x - (1.-(smoothness))*4.;

//     // float depth = balance_dim_ratio * 1.; // Balance the shadow depth to the mesh dimentions
//     // // depth *= balance_dim_ratio * ((smoothness+1.)*4.*smoothness); // Balance the shadow depth to the mesh dimentions

//     // // depth *= slider / rCorners.x * 4.;
//     // // depth *= slider * round_preserv * 1.;
//     // depth *= slider;

//     // /* Shadow effect depth */
//     // // float shad_len = length(max((abs_uv - dim) + rCorners.x + depth, 0.0))  - rCorners.x;
//     // float shad_len = length(max((abs_uv - dim) + round_preserv + depth, 0.0))  - round_preserv;
    
    
//     // float g = smoothstep(.0, min_dim * smoothness, shad_len); // Always returns interpolated value {0, 1}


//     // // if(g > 0.5) return vec4(1., 0., 0., 1.);
//     // // if(shad_len > 10.) return vec4(1., 0., 0., 1.);


//     // // strength = power*min(balance_dim_ratio*.1, 1.);
//     // strength = power*blm_darken(balance_dim_ratio*.1, 1.);

//     // color = mix( color, pow(color, vec3(strength)), g );
    
//     // return vec4(color, alpha);
//     return vec4(color, alpha);
// }
// `;



export const frag_feather_call = '  color = blend_color_multiply( color, Feather(scale_down) );';
export const frag_feather = `

#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif

float Feather(float scale_down)
{
    vec2 res = u_screen_res;
    vec2 dim = vec2(v_dim2_x, v_dim2_y) * scale_down;
    // vec2 dim = DIM * scale_down;
    float feather = (v_feather <= 0.0) ? 0.00001 : v_feather;
    float scale_up = 1./scale_down;


    #ifndef UV_READY
        #define UV_READY 1
        uv = gl_FragCoord.xy;
        pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim*scale_up);
    #endif  



    float width = feather;
    vec2 q = (abs(uv) - dim) + width;
    float d = length(max(q, 0.0)) - width;
    float alpha = clamp(-d/feather, 0.0, 1.0);

    return alpha;
}
`;


export const frag_style_call = '  color = blend_color_multiply( color, Stylize(scale_down) );';
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
    vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
    
    float clarity = 40.4;
    ScreenH = min(res.x, res.y)*clarity;
    AA = ScreenH*0.5;
    
    #ifndef UV_READY
        #define UV_READY 1
        uv = gl_FragCoord.xy;
        pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim*scale_up);
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
