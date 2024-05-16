
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


export const frag_round_corners_call = '   color = Stylize();';
/** NEW SDF RECT IMPLEMENTYATION */

export const frag_round_corners = '\
vec2 pos = vec2(.0);                                              \n\
float ScreenH;                                                    \n\
float AA;                                                         \n\
float sdRoundBox( vec2 p, in vec4 r, vec2 dim ) {                   \n\
    vec2 q = abs(p) - abs(dim) + r.x;\n\
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;\n\
}\n\
\n\
\n\
\n\
vec4 Stylize()                                                    \n\
{                                                                 \n\
    // Radius(From 0.01 to 0.35 good values) for rounding corners   \n\
    float rCorners = v_rCorners;                                    \n\
    float feather = v_border_feather;                               \n\
    vec2 blur = vec2(0.0, feather * .001);                          \n\
    \n\
    \n\
    \n\
    vec2 res = u_screen_res;    \n\
    // vec2 res2 = u_screen_res;    \n\
    // float ratio =  min(res.x, res.y) / max(res.x, res.y);           \n\
    // // res2.x *= ratio;                                  \n\
    // if(res2.x < res2.y) {\n\
    //     // float ratio =  min(res2.x, res2.y) / max(res2.x, res2.y);           \n\
    //     res2.y *= ratio;                                  \n\
    // }\n\
    // else if(res2.x > res2.y){ \n\
    //     // float ratio =  max(res2.x, res2.y) / min(res2.x, res2.y);           \n\
    //     res2.x *= ratio;                                  \n\
    // }\n\
    vec2 uv = gl_FragCoord.xy/res;                                  \n\
    // uv -= vec2((v_wpos.x/res.x), 1.-(v_wpos.y/res.y));                \n\
    uv -= vec2((v_wpos.x/u_screen_res.x), 1.-(v_wpos.y/u_screen_res.y));                \n\
    pos = uv;                                                       \n\
    // vec2 dim = vec2(v_dim.x/res.x, v_dim.y/res.y);                  \n\
    vec2 dim = vec2(v_dim.x/u_screen_res.x, v_dim.y/u_screen_res.y);                  \n\
    vec4 ra = vec4(rCorners/u_screen_res.x, rCorners/u_screen_res.x, rCorners/u_screen_res.y, rCorners/u_screen_res.y);\n\
    \n\
    \n\
    \n\
    // vec4 ra = vec4(rCorners/res.x,rCorners/res.x,rCorners/res.y,rCorners/res.y);\n\
    ra = min(ra, min(dim.x, dim.y));\n\
    float d = sdRoundBox(pos, ra, dim);     \n\
    \n\
    \n\
    vec4 src = v_col;                                               \n\
    vec3 color = vec3(0.0);                                         \n\
    \n\
    \n\
    \n\
    // Calculate alpha (for rounding corners)                       \n\
    float dd = d - blur.x;                                          \n\
    float wa = 1.;                                                  \n\
    float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               \n\
    float alpha = src.a * (wa * wb);                                \n\
    //   color += color * (1.0 - alpha) + src.rgb * alpha;               \n\
    color += color + src.rgb * alpha;               \n\
    float s = min(dim.x, dim.y); // Whole screen res gives max value of:0.5\n\
    float wide = 4.; \n\
    float strength = 1.2; \n\
    color = mix( color, pow(color, vec3(strength)), 1.0-smoothstep(0.0, .05, abs(d)*wide) );                     \n\
    \n\
    \n\
    return vec4(color, alpha);                                       \n\
} \n\
';

/** SAVE */
// export const frag_round_corners = '\
// vec2 pos = vec2(.0);                                              \n\
// float ScreenH;                                                    \n\
// float AA;                                                         \n\
// vec2 length2(vec4 a) {                                            \n\
//   return vec2(length(a.xy), length(a.zw));                        \n\
// }  \n\
// float sdRoundBox( vec2 p, in vec4 r, vec2 b ) {                   \n\
//     r.xy = (p.x>0.0)?r.xy : r.zw;\n\
//     r.x  = (p.y>0.0)?r.x  : r.y;\n\
//     vec2 q = abs(p)-b+r.x;\n\
//     return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;\n\
// }\n\
// \n\
// vec4 Stylize()                                                    \n\
// {                                                                 \n\
//   // Radius(From 0.01 to 0.35 good values) for rounding corners   \n\
//   float rCorners = v_rCorners;                                    \n\
//   float feather = v_border_feather;                               \n\
//   \n\
//   vec2 res = u_screen_res;    \n\
//   vec2 uv = gl_FragCoord.xy/res;                                  \n\
//   uv -= vec2((v_wpos.x/res.x), 1.-(v_wpos.y/res.y));                \n\
//   pos = uv;                                                       \n\
//   vec2 dim = vec2(v_dim.x/res.x, v_dim.y/res.y);                  \n\
//   \n\
//   // From 0.3 to 1.2 good values                                  \n\
//   float clarity = 10.4;                                           \n\
//   //   ScreenH = min(res.x, res.y)*clarity;                            \n\
//   //   AA = ScreenH*1.5;                                                \n\
//   ScreenH = min(res.x, res.y);                            \n\
//   AA = ScreenH*0.5;                                                \n\
//   \n\
//   vec2 blur = vec2(0.0, feather * .001);                          \n\
//   // vec2 blur = vec2(0.0);                                       \n\
//   \n\
//   vec2 uv2 = dim.xy/res;                                   \n\
// //   vec4 ra = vec4(rCorners/res.x,rCorners/res.x,rCorners/res.y,rCorners/res.y);\n\
// //   vec4 ra = vec4(rCorners/uv.x,rCorners/uv.x,rCorners/uv.y,rCorners/uv.y);\n\
//   vec4 ra = vec4(rCorners/uv2.x, rCorners/uv2.x, rCorners/uv2.y, rCorners/uv2.y);\n\
// //   vec4 ra = vec4(rCorners);\n\
//   ra = min(ra, min(dim.x, dim.y));\n\
//   float d = sdRoundBox(pos, ra, dim);     \n\
//   \n\
//   vec4 src = v_col;                                               \n\
//   vec3 color = vec3(0.0);                                         \n\
//   \n\
//   // Calculate alpha (for rounding corners)                       \n\
//   float dd = d - blur.x;                                          \n\
//   float wa = 1.;                                                  \n\
//   float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               \n\
//   float alpha = src.a * (wa * wb);                                \n\
//   color += color * (1.0 - alpha) + src.rgb * alpha;               \n\
//   \n\
//   // // Border Width. It is 0.001 for every pixel                  \n\
//   // float borderWidth = v_border_width * 0.001;                   \n\
//   // float bd = (abs(d)-borderWidth) - blur.x;                     \n\
//   // wa = clamp(-bd * AA, 0.0, 1.0);                               \n\
//   // wb = clamp(-bd / (blur.x+blur.y), 0.0, 1.0);                  \n\
//   // color += color * vec3(abs(wa * wb));                          \n\
//   \n\
//   return vec4(color, alpha);                                       \n\
// } \n\
// ';
/** CLASSIC SDF RECT IMPLEMENTYATION */
// export const frag_round_corners = '\
// vec4 pos = vec4(.0, .0, .0, .0);                                  \n\
// float ScreenH;                                                    \n\
// float AA;                                                         \n\
// vec2 length2(vec4 a) {                                            \n\
//   return vec2(length(a.xy), length(a.zw));                        \n\
// }  \n\
// vec2 RoundedRectangle(vec2 dim, float r, float bw) {              \n\
//   dim -= bw +.0002; // Subtract the border                        \n\
//   r = min(r, min(dim.x, dim.y));                                  \n\
//   dim -= r; // Subtract the border-radius                         \n\
//   vec4 d = abs(pos) - dim.xyxy;                                   \n\
//   vec4 dmin = min(d, 0.0);                                        \n\
//   vec4 dmax = max(d, 0.0);                                        \n\
//   vec2 df = max(dmin.xz, dmin.yw) + length2(dmax);                \n\
//   return (df - r);                                                \n\
// }                                                                 \n\
// vec4 Stylize()                                                    \n\
// {                                                                 \n\
//   // Radius(From 0.01 to 0.35 good values) for rounding corners   \n\
//   float rCorners = v_rCorners * .008;                             \n\
//   float feather = v_border_feather;                               \n\
//   \n\
// //   vec2 res = v_screen_res;    \n\
//   vec2 res = u_screen_res;    \n\
//   vec2 uv = gl_FragCoord.xy/res;                                  \n\
//   uv -= vec2(v_wpos.x/res.x, 1.-(v_wpos.y/res.y));                \n\
//   pos.xy = uv;                                                    \n\
//   vec2 dim = vec2(v_dim.x/res.x, v_dim.y/res.y);                  \n\
//   \n\
//   // From 0.3 to 1.2 good values                                  \n\
//   float clarity = 10.4;                                           \n\
//   ScreenH = min(res.x, res.y)*clarity;                            \n\
//   AA = ScreenH*.5;                                                \n\
//   \n\
//   vec2 blur = vec2(0.0, feather * .001);                          \n\
//   \n\
//   vec2 d = RoundedRectangle(dim, mix(0.0, .2, rCorners), 0.);     \n\
//   \n\
//   vec4 src = v_col;                                               \n\
//   vec3 color = vec3(0.0);                                         \n\
//   \n\
//   // Calculate alpha (for rounding corners)                       \n\
//   float dd = d.x - blur.x;                                        \n\
//   float wa = 1.;                                                  \n\
//   float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               \n\
//   float alpha = src.a * (wa * wb);                                \n\
//   color += color * (1.0 - alpha) + src.rgb * alpha;               \n\
//   \n\
//   // Border Width. It is 0.001 for every pixel                    \n\
//   float borderWidth = v_border_width * 0.001;                     \n\
//   float bd = (abs(d.x)-borderWidth) - blur.x;                     \n\
//   wa = clamp(-bd * AA, 0.0, 1.0);                                 \n\
//   wb = clamp(-bd / (blur.x+blur.y), 0.0, 1.0);                    \n\
//   color += color * vec3(abs(wa * wb));                            \n\
//   \n\
//   return vec4(color, alpha);                                      \n\
// } \n\
// ';
