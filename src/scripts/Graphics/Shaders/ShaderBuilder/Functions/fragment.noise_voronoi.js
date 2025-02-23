// export const frag_noise_voronoi_1_call = '   final_color = blend_mode_vec4( final_color, frag_noise_voronoi_1() );'
// export const frag_noise_voronoi_1_call = '   final_color = blend_color_multiply( final_color, frag_noise_voronoi_1() );'
export const frag_noise_voronoi_1_call = '   final_color = frag_noise_voronoi_1();'

/**WorleyNoise 2 - Works with mesh world pos move */
export const frag_noise_voronoi_1 = `

/********************************************************************************************/
// SHADER UNIT: frag_noise_voronoi_1
/********************************************************************************************/

/*****************************************************/
// GENERIC GLOBAL VARIABLES DECLERATIONS
#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif


/*****************************************************/
// FUNCTION DECLERATIONS


/*****************************************************/
// BLEND MODES FUNCTION DECLERATIONS
#ifdef BLEND_MODE 
   #include <blend_mode_directives>
#endif



////////////////////////////////////////////////////////////////////////////////////

// From https://www.shadertoy.com/view/MtlyR8
#define N 3   // tested neighborhood. Make it odd > 3 if R is high 
#define R .5  // jittering radius. .5 = anywhere in the tile. could be < or >

// rand 1D, rand 2D, signed rand
#define rnd(p)	fract(sin( dot(p, vec2(12.9898, 78.233) )       ) * 43758.5453 )
// #define srnd2(p, ctrl) ( 2.* (fract(sin( (p) * mat2(127.1,311.7, 269.5,183.3) ) * 43758.5453 )) -1. )
#define srnd2(p, ctrl) ( 2.* fract( 4567.89 * sin(4567.8*(p)* mat2(1,-13.17,377.1,-78.7) )*(ctrl*.0003+.9) ) - 1. )
// #define srnd2(p, ctrl) ( 2.* fract( 4567.89 * sin(4567.8*(p)* mat2(1,-13.17,377.1,-78.7) ) ) - 1. )
#define srnd(p)  ( 2.*rnd(p) -1. )




vec4 frag_noise_voronoi_1()
{

  #ifdef U_GENERIC_VEC3
    #include <u_generic_vec3>
  #elif defined(U_GENERIC_VEC2)
    #include <u_generic_vec2>
  #elif defined(U_GENERIC_FLOAT)
    #include <u_generic_float>
  #endif


  vec2 res = u_screen_res;
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  float time = control3*10.;
  
  
  
  // #ifndef UV_READY
  #define UV_READY 1
  uv = gl_FragCoord.xy;
  pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
  uv_map_coordinates_zero_one(uv, dim);
  // #endif
  

  vec4 color = vec4(1.);

  // uv /= 100.;
  uv *= 1.;
  float m=1e9,m2, c=1e2, v,w;
    
  // --- visit 3x3 neighbor tiles ------------------
  for (int k=0; k<N*N; k++) 
  {          
    vec2 iuv = floor(uv) + .5;                                                    // tile center 
    vec2 g = iuv + vec2(k%N, k/N) - 1.;                                           // neighbor cell
    vec2 p =  g+ srnd2(g, control1) * R -uv                                       // vector to jittered cell node
              +.1 * sin(time + vec2(1.6,0) + PI * srnd2(g, control1));             // time jittering
    vec2 q = p * mat2(1, -1, 1, 1) * .707;                                             // pi/4 rotation
    c = min(c,length(p));            // L2 distance to node (to display node)
      
    p = abs(p); v = max(p.x,p.y);    // infinity distance ( = Manhattan = taxicab distance)
    // q = abs(q); w = max(q.x,q.y);    // rotated version
    v = max(v, w);                   // octogonal distance
    if (v < m) m2 = m, m = v;        // keep 1st and 2nd min distances to node
    else if (v < m2) m2 = v;        
  }
  

  v = m2-m;                            // distance to voronoi diagram

  int t = int(2.+time/2.)%7;         // --- coloring scheme ------------------


  // color = vec4(0,m2,m,0);                 // display 1st and 2nd min distances
  // color = vec4(sin(30.*v)) ;              // iso-lines
  // color = vec4( 1.-v );                   // raw distance
  // color = vec4(.025,.05,.1,0)/v;          // Voronoi diagram + chromatic effect
  color = vec4(smoothstep(0., 4., 100.*v*control1)); // Voronoi contours
  // color = vec4(sin(30.*m));               // cell iso-lines
  // color = vec4( 1.-m );                   // cell raw distance

  // color = vec4(smoothstep(0., 2.,100.*v*control1));
  // color = vec4(smoothstep(0.2, 1., 100.*v*control1));

  
  // color.a = 0.;
  // vec4 color = vec4(n*n);
  // return color;
  return 1.-color;

}

`;

/**SAVE-Initial for loop */
// export const frag_noise_voronoi_1 = `

// /********************************************************************************************/
// // SHADER UNIT: frag_noise_voronoi_1
// /********************************************************************************************/

// /*****************************************************/
// // GENERIC GLOBAL VARIABLES DECLERATIONS
// #ifndef UV_READY
//     vec2 uv = vec2(0,0);
// #endif


// /*****************************************************/
// // FUNCTION DECLERATIONS


// /*****************************************************/
// // BLEND MODES FUNCTION DECLERATIONS
// #ifdef BLEND_MODE 
//    #include <blend_mode_directives>
// #endif



// ////////////////////////////////////////////////////////////////////////////////////

// // From https://www.shadertoy.com/view/MtlyR8
// #define N 3   // tested neighborhood. Make it odd > 3 if R is high 
// #define R .5  // jittering radius. .5 = anywhere in the tile. could be < or >

// // rand 1D, rand 2D, signed rand
// #define rnd(p)	fract(sin( dot(p, vec2(12.9898, 78.233) )       ) * 43758.5453 )
// // #define srnd2(p, ctrl) ( 2.* (fract(sin( (p) * mat2(127.1,311.7, 269.5,183.3) ) * 43758.5453 )) -1. )
// // #define srnd2(p, ctrl) ( 2.* fract( 4567.89 * sin(4567.8*(p)* mat2(1,-13.17,377.1,-78.7) )*(ctrl*.0003+.9) ) - 1. )
// #define srnd2(p, ctrl) ( 2.* fract( 4567.89 * sin(4567.8*(p)* mat2(1,-13.17,377.1,-78.7) ) ) - 1. )
// #define srnd(p)  ( 2.*rnd(p) -1. )




// vec4 frag_noise_voronoi_1()
// {

//   #ifdef U_GENERIC_VEC3
//     #include <u_generic_vec3>
//   #elif defined(U_GENERIC_VEC2)
//     #include <u_generic_vec2>
//   #elif defined(U_GENERIC_FLOAT)
//     #include <u_generic_float>
//   #endif


//   vec2 res = u_screen_res;
//   vec2 dim = vec2(v_dim2_x, v_dim2_y);
//   vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
//   float time = control3*10.;
  
  
  
//   #ifndef UV_READY
//   #define UV_READY 1
//   uv = gl_FragCoord.xy;
//   pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
//   uv_map_coordinates_zero_one(uv, dim);
//   #endif
  

//   vec4 color = vec4(1.);

//   // uv /= 100.;
//   uv *= 4.;
//   float m=1e9,m2, c=1e2, v,w;
    
//   // --- visit 3x3 neighbor tiles ------------------
//   for (int k=0; k<N*N; k++) 
//   {          
//     vec2 iuv = floor(uv) + .5;                                                    // tile center 
//     vec2 g = iuv + vec2(k%N, k/N) - 1.;                                           // neighbor cell
//     vec2 p =  g+ srnd2(g, control1) * R -uv                                       // vector to jittered cell node
//               +.1 * sin(time + vec2(1.6,0) + PI * srnd2(g, contol1)),             // time jittering
//     q = p * mat2(1, -1, 1, 1) * .707;                                             // pi/4 rotation
//     // p *= 1.5 + 1. * srnd(g+.1);                                                // jittering scale
//     // q = p * mat2( sin( time + PI * srnd(g) + 1.57 * vec4(1, 2, 0, 1) ) );      // jittering rotation. NB don't compile if in declaration
//     c = min(c,length(p));            // L2 distance to node (to display node)
      
//     // v = length(p);                // L2 distance
//     // v = abs(p.x)+abs(p.y);        // L1 distance
//     p = abs(p); v = max(p.x,p.y);    // infinity distance ( = Manhattan = taxicab distance)
//     q = abs(q); w = max(q.x,q.y);    // rotated version
//     // v = w;
//     v = max(v, w);                   // octogonal distance
//     if (v < m) m2 = m, m = v;        // keep 1st and 2nd min distances to node
//     else if (v < m2) m2 = v;        
//   }
  

//   v = m2-m;                            // distance to voronoi diagram

//   int t = int(2.+time/2.)%7;         // --- coloring scheme ------------------


//   // color = vec4(0,m2,m,0);                 // display 1st and 2nd min distances
//   // color = vec4(sin(30.*v)) ;              // iso-lines
//   // color = vec4( 1.-v );                   // raw distance
//   // color = vec4(.025,.05,.1,0)/v;          // Voronoi diagram + chromatic effect
//   color = vec4(smoothstep(0., 4., 100.*v*control1)); // Voronoi contours
//   // color = vec4(sin(30.*m));               // cell iso-lines
//   // color = vec4( 1.-m );                   // cell raw distance

//   // color = vec4(smoothstep(0., 2.,100.*v*control1));
//   // color = vec4(smoothstep(0.2, 1., 100.*v*control1));

  
  
//   // vec4 color = vec4(n*n);
//   return color;

// }

// `;






/**********************************************************************************************************************************************************************************/
// export const frag_noise_voronoi_2_call = '   final_color = blend_color_multiply( final_color, frag_noise_voronoi_2() );'
export const frag_noise_voronoi_2_call = '   final_color = frag_noise_voronoi_2();'
// export const frag_noise_voronoi_2_call = '   final_color = blend_mode_vec4( final_color, frag_noise_voronoi_2() );'

/**WorleyNoise 2 - Works with mesh world pos move */
export const frag_noise_voronoi_2 = `

/********************************************************************************************/
// SHADER UNIT: frag_noise_voronoi_2
/********************************************************************************************/

/*****************************************************/
// GENERIC GLOBAL VARIABLES DECLERATIONS
#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif


/*****************************************************/
// FUNCTION DECLERATIONS


/*****************************************************/
// BLEND MODES FUNCTION DECLERATIONS
#ifdef BLEND_MODE 
   #include <blend_mode_directives>
#endif



////////////////////////////////////////////////////////////////////////////////////

// From https://www.shadertoy.com/view/ldl3W8
// The MIT License
// Copyright © 2013 Inigo Quilez
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// I've not seen anybody out there computing correct cell interior distances for Voronoi
// patterns yet. That's why they cannot shade the cell interior correctly, and why you've
// never seen cell boundaries rendered correctly. 
//
// However, here's how you do mathematically correct distances (note the equidistant and non
// degenerated grey isolines inside the cells) and hence edges (in yellow):
//
// https://iquilezles.org/articles/voronoilines
//
// More Voronoi shaders:
//
// Exact edges:  https://www.shadertoy.com/view/ldl3W8
// Hierarchical: https://www.shadertoy.com/view/Xll3zX
// Smooth:       https://www.shadertoy.com/view/ldB3zc
// Voronoise:    https://www.shadertoy.com/view/Xd23Dh

#define ANIMATE

vec2 hash2( vec2 p )
{
	// texture based white noise
	// return textureLod( iChannel0, (p+0.5)/256.0, 0.0 ).xy;
  // procedural white noise	
	return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec3 voronoi( in vec2 x, in float time)
{
  vec2 ip = floor(x);
  vec2 fp = fract(x);

  //----------------------------------
  // first pass: regular voronoi
  //----------------------------------
	vec2 mg, mr;

  float md = 8.0;
  for( int j=-1; j<=1; j++ )
  {
    for( int i=-1; i<=1; i++ )
    {
      vec2 g = vec2(float(i),float(j));
      vec2 o = hash2( ip + g );
      #ifdef ANIMATE
        o = 0.5 + 0.5*sin( time + 6.2831*o );
      #endif

      vec2 r = g + o - fp;
      float d = dot(r,r);

      if( d<md )
      {
        md = d;
        mr = r;
        mg = g;
      }
    }
  }

  //----------------------------------
  // second pass: distance to borders
  //----------------------------------
  md = 8.0;
  for( int j=-2; j<=2; j++ )
  {
    for( int i=-2; i<=2; i++ )
    {
      vec2 g = mg + vec2(float(i),float(j));
      vec2 o = hash2( ip + g );
      #ifdef ANIMATE
        o = 0.5 + 0.5*sin( time + 6.2831*o );
      #endif	
      vec2 r = g + o - fp;

      if( dot(mr-r,mr-r)>0.00001 )
      md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
    }
  }

  return vec3( md, mr );
}




vec4 frag_noise_voronoi_2()
{

  #ifdef U_GENERIC_VEC3
    #include <u_generic_vec3>
  #elif defined(U_GENERIC_VEC2)
    #include <u_generic_vec2>
  #elif defined(U_GENERIC_FLOAT)
    #include <u_generic_float>
  #endif


  vec2 res = u_screen_res;
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  vec4 src_color = vec4(v_col4_x, v_col4_y, v_col4_z, v_col4_w);
  float time = control3*10.;
  
  
  
  // #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
    uv_map_coordinates_zero_one(uv, dim);
  // #endif
  

  vec4 color = vec4(1.);

  vec2 p = uv;

  float scale = 2.0 * (control1+.5);
  // float scale = 2.0 * (control1+.1);
  vec3 c = voronoi(scale * p, time);
  
  vec3 col = vec3(.2);

	// isolines
  const float iso_lines = 128.0;
  const float intensity = 2.0;
  // col = c.x * (0.5 + 0.5 * sin(iso_lines * c.x * control2)) * vec3(1.0) * intensity;
  
  // borders	
	float dd = length( c.yz );
  // col = mix( vec3(1.,1.,1.), col, smoothstep( 0.03, 0.1, c.x ) );
  // col = mix( vec3(1.,1.,1.), col, smoothstep( 0.01, 0.03, c.x ) );
  // col = mix( vec3(1.0, 1., 1.), col, smoothstep( 0.01, 0.1, c.x ) );
  // col *= vec3(0.,6.,16.) * (1.-smoothstep( 0., 1., c.x ));
  // col *= (1.-smoothstep( 0.08, .3, c.x ))*6.;
  
  // col = 1.-vec3(smoothstep( 0.03, 0.1, c.x )); // Reverse Color. Apply alpha 0 to all except the border 
  // col = 1.-vec3(smoothstep( 0., .22, c.x )); // Reverse Color. Apply alpha 0 to all except the border 
  col = vec3(smoothstep( 0.22, .0, c.x )); // Reverse Color. Apply alpha 0 to all except the border 
  
  // feature points
	// col = mix( vec3(1.0,0.6,0.1), col, smoothstep( 0.0, 0.12, dd) );
	// col += vec3(1.0,0.6,0.1)*(1.0-smoothstep( 0.0, 0.04, dd));

  
  // float m = median(col.r, col.g, col.b);
  // color = vec4(col, m);
  color = vec4(col, 0.);
  // color = vec4(col, 1.);
  // color = vec4(1.-col, 1.); // Reverse colors
  return color;

}

`;
