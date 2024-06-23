
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
/** NEW SDF RECT IMPLEMENTATION */

export const frag_round_corners = `

vec2 pos = vec2(.0);
float ScreenH;
float AA;

#ifndef UV_READY
vec2 uv = vec2(0,0);
#endif

vec4 Stylize()
{
    // Radius(From 0.01 to 0.35 good values) for rounding corners
    float border_width = v_border_width;
    // float scale_down = .25;
    // float scale_down = .5;
#ifdef U_SCALE
    float scale_down = u_scale2.x;
#else
    float scale_down = 1.;
#endif
    float scale_up = 1./scale_down;
    vec2 rCorners = vec2(v_rCorners) * scale_down;
    float feather = v_border_feather;
    vec2 blur = vec2(0.0, feather);
    vec2 res = u_screen_res;
    // vec2 uv = (gl_FragCoord.xy-(res*.5));
    vec2 dim = v_dim * scale_down; // v_dim is the abs(a_pos), and is an interpolated value for every fragment in the span of min-a_pos to max-a_pos
    
    float clarity = 40.4;
    ScreenH = min(res.x, res.y)*clarity;
    AA = ScreenH*0.5;

#ifndef UV_READY
    #define UV_READY 1
    uv = (gl_FragCoord.xy-(res*.5));
    uv.x += (res.x*.5); // Center mesh to screen
    uv.y -= (res.y*.5); // Center mesh to screen
    
    vec2 wpos = v_wpos;
    uv.x -= wpos.x; // To move with mesh position
    uv.y += wpos.y; // To move with mesh position
    
    uv.x -= dim.x*scale_up; // Subtract constant dimention
    uv.y -= -dim.y*scale_up; // Subtract constant dimention
#endif    
    
    
    // vec2 q = (abs(uv) - dim) + scale_down + rCorners.x; // Again Subtract constant dimention //THIS!!! 
    vec2 q = (abs(uv) - dim) + rCorners.x; // Again Subtract constant dimention
    float d = length(max(q, 0.0)) - rCorners.x;
    // float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rCorners.x;
    
    
    vec4 src = v_col;
    vec3 color = vec3(0.0);
    
    
    float dd = d - blur.x;
    float wa = 1.;
    float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);
    float alpha = src.a * (wa * wb);
    // color += color + src.rgb * alpha;
    color += color + src.rgb * alpha;
    
    // float wide = rCorners.x; 
    // float strength = 1.8; 
    // color = mix( color, pow(color, vec3(strength)), 1.0-smoothstep(0.0, 5., abs(d)) );
    // color = mix( color, pow(color, vec3(strength)), 1.0-smoothstep(0.0, 20., abs(d)*wide) );
    
    //   Border Width. It is 0.001 for every pixel
    // float borderWidth = border_width;
    // float bd = (abs(d)-borderWidth) - blur.x;
    // wa = clamp(-bd * AA, 0.0, 1.0);
    // wb = clamp(-bd / (blur.x+blur.y), 0.0, 1.0);
    // color += color * vec3(abs(wa * wb));
    // color +=  color * pow(vec3(abs(wa * wb)), vec3(4.4));
    return vec4(color, alpha);
}
`;
/** */
// export const frag_round_corners = '\
// vec2 pos = vec2(.0);                                              
// float ScreenH;                                                    
// float AA;                                                         
// 
// float sdRoundBox( vec2 p, in vec2 dist, vec2 dim) {                   
//     
//     // vec2 q = (abs(p) - (dim)) + dist.x;
//     // // vec2 q = ((p) - (dim)) + dist.x;
//     // float d = length(max(q, 0.0)) - dist.x;
//     // // float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rr;
//     // return d;
//     
//     
//     vec2 q = (abs(p) - dim) + dist.x;
//     float d = length(max(q, 0.0)) - dist.x;
//     return d;
//     
// }
// 
// vec4 Stylize()                                                    
// {                                                                 
//     // Radius(From 0.01 to 0.35 good values) for rounding corners   
//     float y = u_projection[3].y;                                    
//     float border_width = v_border_width;                                    
//     vec2 rCorners = vec2(v_rCorners);                                    
//     float feather = v_border_feather;                               
//     vec2 blur = vec2(0.0, feather);                          
//     vec2 res = u_screen_res;    
//     
//     
//     
//     vec2 uv = gl_FragCoord.xy;                                  
//     // INFO: v_dim gets values from 0-dim
//     vec2 dim = v_dim;
//     if(uv.x > 10.) return vec4(1.,0.,0.,1.);
//     uv -= dim *.5;
//     // if(dim.x > -40.) return vec4(1.,0.,0.,1.);
//     vec2 wpos = v_wpos;
//     y *= res.y;
//     uv.y += (res.y-y)/2.;
//     uv -= wpos;
//     // if(uv.x > 20.) return vec4(1.,0.,0.,1.);
//     wpos.y = res.y - v_wpos.y; // correct height from bottom 0 to top 0
//     
//     // INFO: After the wpos subtraction, the uv spans from 0-dim, both x-y coords
//     
//     float d = sdRoundBox(uv, rCorners, dim);     
//     
//     
//     vec4 src = v_col;                                               
//     vec3 color = vec3(0.0);                                         
//     
//     
//     float dd = d - blur.x;                                          
//     float wa = 1.;                                                  
//     float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               
//     float alpha = src.a * (wa * wb);                                
//     // float alpha = d > .0 ? d : 0.;                                
//     // float alpha = d;                                
//     color += color + src.rgb;               
//     // color += (color + src.rgb) * alpha;               
//     float strength = 1.4; 
//     // float s = clamp(min(dim.x, dim.y)*.005, 1., 2.); 
//     color = mix( pow(color, vec3(strength)), color, smoothstep(0.0, border_width, abs(d)) ); 
//     return vec4(color, alpha);                                       
// } 
// ';
/**SAVE needs uncomment correction */
// export const frag_round_corners = '\
// vec2 pos = vec2(.0);                                              
// float ScreenH;                                                    
// float AA;                                                         
// 
// float sdRoundBox( vec2 p, in vec2 dist, vec2 dim, vec2 wpos) {                   
//     
//     // vec2 q = (abs(p) - (dim)) + dist.x;
//     // // vec2 q = ((p) - (dim)) + dist.x;
//     // float d = length(max(q, 0.0)) - dist.x;
//     // // float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rr;
//     // return d;
// 
// 
//     vec2 q = (abs(p) - (dim)) + dist.x;
//     // vec2 q = (abs(p) - 100.) + dist.x;
//     float d = length(max(q, 0.0)) - dist.x;
//     return d;
//     
// }
// 
// vec4 Stylize()                                                    
// {                                                                 
//     // Radius(From 0.01 to 0.35 good values) for rounding corners   
//     float y = u_projection[3].y;                                    
//     float border_width = v_border_width;                                    
//     vec2 rCorners = vec2(v_rCorners);                                    
//     float feather = v_border_feather;                               
//     vec2 blur = vec2(0.0, feather);                          
//     vec2 res = u_screen_res;    
//     
//     
//     
//     vec2 uv = gl_FragCoord.xy;                                  
//     // INFO: v_dim gets values from 0-dim
//     vec2 dim = v_dim;
//     // dim *= .5;
//     // uv -= dim;
//     // uv *= .5;
//     uv -= dim *.5;
//     if(uv.x > 121.) return vec4(1.,0.,0.,1.);
//     vec2 wpos = v_wpos;
//     uv -= wpos;
//     wpos.y = res.y - v_wpos.y; // correct height from bottom 0 to top 0
//     
//     // INFO: After the wpos subtraction, the uv spans from 0-dim, both x-y coords
//     y *= res.y;
//     uv.y += (res.y-y)/2.;
//     
//     float d = sdRoundBox(uv, rCorners, dim, wpos);     
//     
//     
//     vec4 src = v_col;                                               
//     // vec3 color = vec3(0.0, .03, .06);                                         
//     vec3 color = vec3(0.0);                                         
//     // return vec4(src.rgb, 1.);
//     
//     
//     float dd = d - blur.x;                                          
//     float wa = 1.;                                                  
//     float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               
//     float alpha = src.a * (wa * wb);                                
//     // float alpha = d > .0 ? d : 0.;                                
//     // float alpha = d;                                
//     // color += color + src.rgb;               
//     color += (color + src.rgb) * alpha;               
//     float strength = 1.4; 
//     // float s = clamp(min(dim.x, dim.y)*.005, 1., 2.); 
//     color = mix( pow(color, vec3(strength)), color, smoothstep(0.0, border_width, abs(d)) ); 
//     return vec4(color, alpha);                                       
// } 
// ';
/**SAVE */
// export const frag_round_corners = '\
// vec2 pos = vec2(.0);                                              
// float ScreenH;                                                    
// float AA;                                                         
// float sdRoundBox( vec2 p, in vec2 r, vec2 dim, float y, float ratio) {                   
//     p.y += (1.-y)/2.;    // Add any move from the projection matrix
//     float rr = .01;
//     vec2 q = (abs(p) - (dim)) + rr;
//     return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rr;
//     // return (length(vec2(q.x, q.y)) - rr);
//     // return (length(vec2(q.x/ratio, q.y/ratio)) - rr/ratio);
//     // return (length(vec2(q.x, q.y)) - rr/ratio);
//     // return (length(vec2(q.x, q.y)) - rr);
// }
// 
// 
// vec4 Stylize()                                                    
// {                                                                 
//     // Radius(From 0.01 to 0.35 good values) for rounding corners   
//     float y = u_projection[3].y;                                    
//     // float y = 0.;                                    
//     float rCorners = v_rCorners;                                    
//     float feather = v_border_feather;                               
//     vec2 blur = vec2(0.0, feather * .001);                          
//     vec2 res = u_screen_res;    
//     
//     
//     vec2 uv2 = gl_FragCoord.xy/res;                                  
//     vec2 uv = gl_FragCoord.xy/res;                                  
//     uv -= vec2((v_wpos.x/res.x), 1.-(v_wpos.y/res.y));                
//     vec2 dim = v_dim;                  
//     
//     
//     float rr = .04;
//     // vec4 rad = vec4(rr);
//     vec2 rad = vec2(rr);
//     // vec2 rad = vec2(rCorners/res.y, rCorners/res.y);
//     float ratio = res.x / res.y;
//     // float d = sdRoundBox(uv, rad, dim/res, y, ratio)/ ratio;     
//     float d = sdRoundBox(uv, rad, dim/res, y, ratio);     
//     
//     
//     vec4 src = v_col;                                               
//     vec3 color = vec3(0.0, .03, .06);                                         
//     // vec3 color = vec3(.0);                                         
//     
//     
//     //////////////////////////// New Test: Circle FX
//     // float t = .03;
//     // // float t = .0001;
//     // // float len = length(uv);
//     // // float len = length(gl_FragCoord.xy-20.5)-800.;
//     // // float len = length(gl_FragCoord.xy/res)*80.-60.;
//     // float len = length(uv)*100.-11.;
//     // float ringDiameter = 80.2; // The scale_down the value, the scale_down the explosion ring.
//     // float ring = abs(len * 1.- (t*ringDiameter));
//     // float centerFlash = 1.1; // The Smaller the value, the greater the flash in the center ring
//     // float ex = abs(len * fract(t) * centerFlash); // GOOD!
//     // vec3 c = vec3(.4) / min(ring*.1, ex*1.5);
//     // color.rgb *= c;
//     
//     
//     
//     
//     // Calculate alpha (for rounding corners)                       
//     float dd = d - blur.x;                                          
//     // float dd = d;                                          
//     float wa = 1.;                                                  
//     float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               
//     float alpha = src.a * (wa * wb);                                
//     // float alpha = d;                                
//     //   color += color * (1.0 - alpha) + src.rgb * alpha;               
//     color += color + src.rgb * alpha;               
//     // float s = min(dim.x, dim.y); // Whole screen res gives max value of:0.5
//     float wide = 4.5; 
//     float strength = 1.4; 
//     // color = mix( color, pow(color, vec3(strength)), 1.0-smoothstep(0.0, .05, abs(d)*wide) );                     
//     // color = mix( color, pow(color, vec3(strength)), 1.0-smoothstep(0.0, .5, c) );                     
//     // color = mix( color, pow(c, vec3(strength)), 1.0-smoothstep(0.0, .9, c));                     
//     // color = pow(color, vec3(1.4));                     
//     
//     
//     return vec4(color, alpha);                                       
// } 
// `;

/** SAVE */
// export const frag_round_corners = `\
// vec2 pos = vec2(.0);                                              
// float ScreenH;                                                    
// float AA;                                                         
// vec2 length2(vec4 a) {                                            
//   return vec2(length(a.xy), length(a.zw));                        
// }  
// float sdRoundBox( vec2 p, in vec4 r, vec2 b ) {                   
//     r.xy = (p.x>0.0)?r.xy : r.zw;
//     r.x  = (p.y>0.0)?r.x  : r.y;
//     vec2 q = abs(p)-b+r.x;
//     return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
// }
// 
// vec4 Stylize()                                                    
// {                                                                 
//   // Radius(From 0.01 to 0.35 good values) for rounding corners   
//   float rCorners = v_rCorners;                                    
//   float feather = v_border_feather;                               
//   
//   vec2 res = u_screen_res;    
//   vec2 uv = gl_FragCoord.xy/res;                                  
//   uv -= vec2((v_wpos.x/res.x), 1.-(v_wpos.y/res.y));                
//   pos = uv;                                                       
//   vec2 dim = vec2(v_dim.x/res.x, v_dim.y/res.y);                  
//   
//   // From 0.3 to 1.2 good values                                  
//   float clarity = 10.4;                                           
//   //   ScreenH = min(res.x, res.y)*clarity;                            
//   //   AA = ScreenH*1.5;                                                
//   ScreenH = min(res.x, res.y);                            
//   AA = ScreenH*0.5;                                                
//   
//   vec2 blur = vec2(0.0, feather * .001);                          
//   // vec2 blur = vec2(0.0);                                       
//   
//   vec2 uv2 = dim.xy/res;                                   
// //   vec4 ra = vec4(rCorners/res.x,rCorners/res.x,rCorners/res.y,rCorners/res.y);
// //   vec4 ra = vec4(rCorners/uv.x,rCorners/uv.x,rCorners/uv.y,rCorners/uv.y);
//   vec4 ra = vec4(rCorners/uv2.x, rCorners/uv2.x, rCorners/uv2.y, rCorners/uv2.y);
// //   vec4 ra = vec4(rCorners);
//   ra = min(ra, min(dim.x, dim.y));
//   float d = sdRoundBox(pos, ra, dim);     
//   
//   vec4 src = v_col;                                               
//   vec3 color = vec3(0.0);                                         
//   
//   // Calculate alpha (for rounding corners)                       
//   float dd = d - blur.x;                                          
//   float wa = 1.;                                                  
//   float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               
//   float alpha = src.a * (wa * wb);                                
//   color += color * (1.0 - alpha) + src.rgb * alpha;               
//   
//   // // Border Width. It is 0.001 for every pixel                  
//   // float borderWidth = v_border_width * 0.001;                   
//   // float bd = (abs(d)-borderWidth) - blur.x;                     
//   // wa = clamp(-bd * AA, 0.0, 1.0);                               
//   // wb = clamp(-bd / (blur.x+blur.y), 0.0, 1.0);                  
//   // color += color * vec3(abs(wa * wb));                          
//   
//   return vec4(color, alpha);                                       
// } 
// ';
/** CLASSIC SDF RECT IMPLEMENTYATION */
// export const frag_round_corners = '\
// vec4 pos = vec4(.0, .0, .0, .0);                                  
// float ScreenH;                                                    
// float AA;                                                         
// vec2 length2(vec4 a) {                                            
//   return vec2(length(a.xy), length(a.zw));                        
// }  
// vec2 RoundedRectangle(vec2 dim, float r, float bw) {              
//   dim -= bw +.0002; // Subtract the border                        
//   r = min(r, min(dim.x, dim.y));                                  
//   dim -= r; // Subtract the border-radius                         
//   vec4 d = abs(pos) - dim.xyxy;                                   
//   vec4 dmin = min(d, 0.0);                                        
//   vec4 dmax = max(d, 0.0);                                        
//   vec2 df = max(dmin.xz, dmin.yw) + length2(dmax);                
//   return (df - r);                                                
// }                                                                 
// vec4 Stylize()                                                    
// {                                                                 
//   // Radius(From 0.01 to 0.35 good values) for rounding corners   
//   float rCorners = v_rCorners * .008;                             
//   float feather = v_border_feather;                               
//   
// //   vec2 res = v_screen_res;    
//   vec2 res = u_screen_res;    
//   vec2 uv = gl_FragCoord.xy/res;                                  
//   uv -= vec2(v_wpos.x/res.x, 1.-(v_wpos.y/res.y));                
//   pos.xy = uv;                                                    
//   vec2 dim = vec2(v_dim.x/res.x, v_dim.y/res.y);                  
//   
//   // From 0.3 to 1.2 good values                                  
//   float clarity = 10.4;                                           
//   ScreenH = min(res.x, res.y)*clarity;                            
//   AA = ScreenH*.5;                                                
//   
//   vec2 blur = vec2(0.0, feather * .001);                          
//   
//   vec2 d = RoundedRectangle(dim, mix(0.0, .2, rCorners), 0.);     
//   
//   vec4 src = v_col;                                               
//   vec3 color = vec3(0.0);                                         
//   
//   // Calculate alpha (for rounding corners)                       
//   float dd = d.x - blur.x;                                        
//   float wa = 1.;                                                  
//   float wb = clamp(-dd / (blur.x+blur.y), 0.0, 1.);               
//   float alpha = src.a * (wa * wb);                                
//   color += color * (1.0 - alpha) + src.rgb * alpha;               
//   
//   // Border Width. It is 0.001 for every pixel                    
//   float borderWidth = v_border_width * 0.001;                     
//   float bd = (abs(d.x)-borderWidth) - blur.x;                     
//   wa = clamp(-bd * AA, 0.0, 1.0);                                 
//   wb = clamp(-bd / (blur.x+blur.y), 0.0, 1.0);                    
//   color += color * vec3(abs(wa * wb));                            
//   
//   return vec4(color, alpha);                                      
// } 
// `;
