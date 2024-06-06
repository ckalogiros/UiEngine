
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
vec2 pos = vec2(.0);\n\
float ScreenH;\n\
float AA;\n\
vec4 c1 = vec4(.6, .4, .1, 1.);\n\
vec3 c2 = vec3(.6, .4, .1);\n\
\n\
vec4 Stylize()\n\
{\n\
    // Radius(From 0.01 to 0.35 good values) for rounding corners\n\
    float border_width = v_border_width;\n\
    vec2 rCorners = vec2(v_rCorners);\n\
    float feather = v_border_feather;\n\
    vec2 blur = vec2(0.0, feather);\n\
    vec2 res = u_screen_res;\n\
    vec2 uv = (gl_FragCoord.xy-(res*.5));\n\
    vec2 dim = v_dim; // v_dim is the abs(a_pos), and is an interpolated value fro every fragment in the span of min-a_pos to max-a_pos\n\
    \n\
    vec2 wpos = v_wpos;\n\
    uv.x += (res.x*.5); // Center mesh to screen\n\
    uv.y -= (res.y*.5); // Center mesh to screen\n\
    uv.x -= wpos.x; // To move with mesh position\n\
    uv.y += wpos.y; // To move with mesh position\n\
    // if(dim.y > 10.) return vec4(c1);\n\
    // return vec4(c1);\n\
    \n\
    uv.x -= dim.x; // Subtract constant dimention\n\
    uv.y -= -dim.y; // Subtract constant dimention\n\
    // uv.y += dim.y; // Subtract constant dimention\n\
    \n\
    vec2 q = (abs(uv) - dim) + rCorners.x; // Again Subtract constant dimention\n\
    float d = length(max(q, 0.0)) - rCorners.x;\n\
    // float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - dist.x;\n\
    \n\
    vec4 src = v_col;\n\
    vec3 color = vec3(0.0);\n\
    // return vec4(src.rgb, 1.);\n\
    \n\
    float dd = d - blur.x;\n\
    float wa = 1.;\n\
    float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);\n\
    float alpha = src.a * (wa * wb);\n\
    color += color + src.rgb * alpha;\n\
    return vec4(color, alpha);\n\
}\n\
';
/** */
// export const frag_round_corners = '\
// vec2 pos = vec2(.0);                                              \n\
// float ScreenH;                                                    \n\
// float AA;                                                         \n\
// \n\
// float sdRoundBox( vec2 p, in vec2 dist, vec2 dim) {                   \n\
//     \n\
//     // vec2 q = (abs(p) - (dim)) + dist.x;\n\
//     // // vec2 q = ((p) - (dim)) + dist.x;\n\
//     // float d = length(max(q, 0.0)) - dist.x;\n\
//     // // float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rr;\n\
//     // return d;\n\
//     \n\
//     \n\
//     vec2 q = (abs(p) - dim) + dist.x;\n\
//     float d = length(max(q, 0.0)) - dist.x;\n\
//     return d;\n\
//     \n\
// }\n\
// \n\
// vec4 Stylize()                                                    \n\
// {                                                                 \n\
//     // Radius(From 0.01 to 0.35 good values) for rounding corners   \n\
//     float y = u_projection[3].y;                                    \n\
//     float border_width = v_border_width;                                    \n\
//     vec2 rCorners = vec2(v_rCorners);                                    \n\
//     float feather = v_border_feather;                               \n\
//     vec2 blur = vec2(0.0, feather);                          \n\
//     vec2 res = u_screen_res;    \n\
//     \n\
//     \n\
//     \n\
//     vec2 uv = gl_FragCoord.xy;                                  \n\
//     // INFO: v_dim gets values from 0-dim\n\
//     vec2 dim = v_dim;\n\
//     if(uv.x > 10.) return vec4(1.,0.,0.,1.);\n\
//     uv -= dim *.5;\n\
//     // if(dim.x > -40.) return vec4(1.,0.,0.,1.);\n\
//     vec2 wpos = v_wpos;\n\
//     y *= res.y;\n\
//     uv.y += (res.y-y)/2.;\n\
//     uv -= wpos;\n\
//     // if(uv.x > 20.) return vec4(1.,0.,0.,1.);\n\
//     wpos.y = res.y - v_wpos.y; // correct height from bottom 0 to top 0\n\
//     \n\
//     // INFO: After the wpos subtraction, the uv spans from 0-dim, both x-y coords\n\
//     \n\
//     float d = sdRoundBox(uv, rCorners, dim);     \n\
//     \n\
//     \n\
//     vec4 src = v_col;                                               \n\
//     vec3 color = vec3(0.0);                                         \n\
//     \n\
//     \n\
//     float dd = d - blur.x;                                          \n\
//     float wa = 1.;                                                  \n\
//     float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               \n\
//     float alpha = src.a * (wa * wb);                                \n\
//     // float alpha = d > .0 ? d : 0.;                                \n\
//     // float alpha = d;                                \n\
//     color += color + src.rgb;               \n\
//     // color += (color + src.rgb) * alpha;               \n\
//     float strength = 1.4; \n\
//     // float s = clamp(min(dim.x, dim.y)*.005, 1., 2.); \n\
//     color = mix( pow(color, vec3(strength)), color, smoothstep(0.0, border_width, abs(d)) ); \n\
//     return vec4(color, alpha);                                       \n\
// } \n\
// ';
/**SAVE needs uncomment correction */
// export const frag_round_corners = '\
// vec2 pos = vec2(.0);                                              \n\
// float ScreenH;                                                    \n\
// float AA;                                                         \n\
// \n\
// float sdRoundBox( vec2 p, in vec2 dist, vec2 dim, vec2 wpos) {                   \n\
//     \n\
//     // vec2 q = (abs(p) - (dim)) + dist.x;\n\
//     // // vec2 q = ((p) - (dim)) + dist.x;\n\
//     // float d = length(max(q, 0.0)) - dist.x;\n\
//     // // float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rr;\n\
//     // return d;\n\
// \n\
// \n\
//     vec2 q = (abs(p) - (dim)) + dist.x;\n\
//     // vec2 q = (abs(p) - 100.) + dist.x;\n\
//     float d = length(max(q, 0.0)) - dist.x;\n\
//     return d;\n\
//     \n\
// }\n\
// \n\
// vec4 Stylize()                                                    \n\
// {                                                                 \n\
//     // Radius(From 0.01 to 0.35 good values) for rounding corners   \n\
//     float y = u_projection[3].y;                                    \n\
//     float border_width = v_border_width;                                    \n\
//     vec2 rCorners = vec2(v_rCorners);                                    \n\
//     float feather = v_border_feather;                               \n\
//     vec2 blur = vec2(0.0, feather);                          \n\
//     vec2 res = u_screen_res;    \n\
//     \n\
//     \n\
//     \n\
//     vec2 uv = gl_FragCoord.xy;                                  \n\
//     // INFO: v_dim gets values from 0-dim\n\
//     vec2 dim = v_dim;\n\
//     // dim *= .5;\n\
//     // uv -= dim;\n\
//     // uv *= .5;\n\
//     uv -= dim *.5;\n\
//     if(uv.x > 121.) return vec4(1.,0.,0.,1.);\n\
//     vec2 wpos = v_wpos;\n\
//     uv -= wpos;\n\
//     wpos.y = res.y - v_wpos.y; // correct height from bottom 0 to top 0\n\
//     \n\
//     // INFO: After the wpos subtraction, the uv spans from 0-dim, both x-y coords\n\
//     y *= res.y;\n\
//     uv.y += (res.y-y)/2.;\n\
//     \n\
//     float d = sdRoundBox(uv, rCorners, dim, wpos);     \n\
//     \n\
//     \n\
//     vec4 src = v_col;                                               \n\
//     // vec3 color = vec3(0.0, .03, .06);                                         \n\
//     vec3 color = vec3(0.0);                                         \n\
//     // return vec4(src.rgb, 1.);\n\
//     \n\
//     \n\
//     float dd = d - blur.x;                                          \n\
//     float wa = 1.;                                                  \n\
//     float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               \n\
//     float alpha = src.a * (wa * wb);                                \n\
//     // float alpha = d > .0 ? d : 0.;                                \n\
//     // float alpha = d;                                \n\
//     // color += color + src.rgb;               \n\
//     color += (color + src.rgb) * alpha;               \n\
//     float strength = 1.4; \n\
//     // float s = clamp(min(dim.x, dim.y)*.005, 1., 2.); \n\
//     color = mix( pow(color, vec3(strength)), color, smoothstep(0.0, border_width, abs(d)) ); \n\
//     return vec4(color, alpha);                                       \n\
// } \n\
// ';
/**SAVE */
// export const frag_round_corners = '\
// vec2 pos = vec2(.0);                                              \n\
// float ScreenH;                                                    \n\
// float AA;                                                         \n\
// float sdRoundBox( vec2 p, in vec2 r, vec2 dim, float y, float ratio) {                   \n\
//     p.y += (1.-y)/2.;    // Add any move from the projection matrix\n\
//     float rr = .01;\n\
//     vec2 q = (abs(p) - (dim)) + rr;\n\
//     return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rr;\n\
//     // return (length(vec2(q.x, q.y)) - rr);\n\
//     // return (length(vec2(q.x/ratio, q.y/ratio)) - rr/ratio);\n\
//     // return (length(vec2(q.x, q.y)) - rr/ratio);\n\
//     // return (length(vec2(q.x, q.y)) - rr);\n\
// }\n\
// \n\
// \n\
// vec4 Stylize()                                                    \n\
// {                                                                 \n\
//     // Radius(From 0.01 to 0.35 good values) for rounding corners   \n\
//     float y = u_projection[3].y;                                    \n\
//     // float y = 0.;                                    \n\
//     float rCorners = v_rCorners;                                    \n\
//     float feather = v_border_feather;                               \n\
//     vec2 blur = vec2(0.0, feather * .001);                          \n\
//     vec2 res = u_screen_res;    \n\
//     \n\
//     \n\
//     vec2 uv2 = gl_FragCoord.xy/res;                                  \n\
//     vec2 uv = gl_FragCoord.xy/res;                                  \n\
//     uv -= vec2((v_wpos.x/res.x), 1.-(v_wpos.y/res.y));                \n\
//     vec2 dim = v_dim;                  \n\
//     \n\
//     \n\
//     float rr = .04;\n\
//     // vec4 rad = vec4(rr);\n\
//     vec2 rad = vec2(rr);\n\
//     // vec2 rad = vec2(rCorners/res.y, rCorners/res.y);\n\
//     float ratio = res.x / res.y;\n\
//     // float d = sdRoundBox(uv, rad, dim/res, y, ratio)/ ratio;     \n\
//     float d = sdRoundBox(uv, rad, dim/res, y, ratio);     \n\
//     \n\
//     \n\
//     vec4 src = v_col;                                               \n\
//     vec3 color = vec3(0.0, .03, .06);                                         \n\
//     // vec3 color = vec3(.0);                                         \n\
//     \n\
//     \n\
//     //////////////////////////// New Test: Circle FX\n\
//     // float t = .03;\n\
//     // // float t = .0001;\n\
//     // // float len = length(uv);\n\
//     // // float len = length(gl_FragCoord.xy-20.5)-800.;\n\
//     // // float len = length(gl_FragCoord.xy/res)*80.-60.;\n\
//     // float len = length(uv)*100.-11.;\n\
//     // float ringDiameter = 80.2; // The smaller the value, the smaller the explosion ring.\n\
//     // float ring = abs(len * 1.- (t*ringDiameter));\n\
//     // float centerFlash = 1.1; // The Smaller the value, the greater the flash in the center ring\n\
//     // float ex = abs(len * fract(t) * centerFlash); // GOOD!\n\
//     // vec3 c = vec3(.4) / min(ring*.1, ex*1.5);\n\
//     // color.rgb *= c;\n\
//     \n\
//     \n\
//     \n\
//     \n\
//     // Calculate alpha (for rounding corners)                       \n\
//     float dd = d - blur.x;                                          \n\
//     // float dd = d;                                          \n\
//     float wa = 1.;                                                  \n\
//     float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               \n\
//     float alpha = src.a * (wa * wb);                                \n\
//     // float alpha = d;                                \n\
//     //   color += color * (1.0 - alpha) + src.rgb * alpha;               \n\
//     color += color + src.rgb * alpha;               \n\
//     // float s = min(dim.x, dim.y); // Whole screen res gives max value of:0.5\n\
//     float wide = 4.5; \n\
//     float strength = 1.4; \n\
//     // color = mix( color, pow(color, vec3(strength)), 1.0-smoothstep(0.0, .05, abs(d)*wide) );                     \n\
//     // color = mix( color, pow(color, vec3(strength)), 1.0-smoothstep(0.0, .5, c) );                     \n\
//     // color = mix( color, pow(c, vec3(strength)), 1.0-smoothstep(0.0, .9, c));                     \n\
//     // color = pow(color, vec3(1.4));                     \n\
//     \n\
//     \n\
//     return vec4(color, alpha);                                       \n\
// } \n\
// ';

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
