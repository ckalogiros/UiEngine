export const frag_noise_worley_3_types_call = '   final_color = blend_mode_vec4( final_color, frag_noise_worley_3_types() );'
// export const frag_noise_worley_3_types_call = '   final_color = frag_noise_worley_3_types();'

/**WorleyNoise 3 Types - FROM: https://www.shadertoy.com/view/McyBRd */
export const frag_noise_worley_3_types = `

/********************************************************************************************/
// SHADER UNIT: frag_noise_worley_3_types
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
// From: FROM: https://www.shadertoy.com/view/McyBRd
// The MIT License
// Copyright © 2019 J. M.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Demonstrating an experimental 3D Worley noise implementation.
// A little bit of something old, something new, and something borrowed.

// XY range of the display.

#define DISP_SCALE 6.0 

// rescaling functions

float rescale(float x, vec2 range)
{
  float a = range.x, b = range.y;
  return (x - a)/(b - a);
}

float rescale(float x, vec2 r1, vec2 r2)
{
	  float a = r1.x, b = r1.y;
      float c = r2.x, d = r2.y;
      return c + (d - c) * ((x - a)/(b - a));
}

// custom colormap

vec3 lake( float t )
{
  return vec3((2.0 * t + 1.0)/3.0, min(4.0 * t, 2.0 * t + 1.0)/3.0, min(0.8 * t + 0.5, 1.0 - 0.1 * t));
}

// simple LCG

#define LCG(k) k = (65 * k) % 1021
#define lr(k) float(k)/1021.

// permutation polynomial

int permp (int i1, int i2)
{
  int t = (i1 + i2) & 255;
  return ((112 * t + 153) * t + 151) & 255;
}

// return the two closest distances for 3D Worley noise
// type controls the type of metric used

vec2 worley(int type, vec3 p)
{
    vec2 dl = vec2(20.0);
    ivec3 iv = ivec3(floor(p));
    vec3 fv = fract(p);
    
    int j = 0; // initialization for Knuth's "algorithm L"
    ivec3 di = ivec3(1), ki = -di;
    ivec4 fi = ivec4(0, 1, 2, 3);
    
    // instead of writing a triply nested loop (!!)
    // generate the indices for the neighbors in Gray order (Knuth's "algorithm L")
    // see section 7.2.1.1 of TAOCP, Volume 4A or https://doi.org/10.1145/360336.360343
    
	  for (int k = 0; k < 27; k++) // loop through all neighbors
    { 
		  // seeding
      int s = permp(permp(permp(0, iv.z + ki.z), iv.y + ki.y), iv.x + ki.x); LCG(s);
            
      for (int m = 0; m < 2; m++) // two points per cell
      {
        // generate feature points within the cell
        LCG(s); float sz = lr(s);
        LCG(s); float sy = lr(s);
        LCG(s); float sx = lr(s);
        
        vec3 tp = vec3(ki) + vec3(sx, sy, sz) - fv;
        float c = 0.0;
        c = dot(tp, tp); // Euclidean metric
        //c = abs(tp.x) + abs(tp.y) + abs(tp.z); // Manhattan metric
        //c = max(abs(tp.x), max(abs(tp.y), abs(tp.z))); // Chebyshev metric
        
        float m1 = min(c, dl.x); // ranked distances
        dl = vec2(min(m1, dl.y), max(m1, min(max(c, dl.x), dl.y)));
      }
        
      // updating steps for Knuth's "algorithm L"
      j = fi[0]; fi[0] = 0; ki[2 - j] += di[j];
      if ((ki[2 - j] & 1) == 1) {
        di[j] = -di[j];
        fi[j] = fi[j + 1]; fi[j + 1] = j + 1;
      }
	}
    
  if (type == 1) dl = sqrt(dl); // don't forget to root at the end for Euclidean distance
      
  return dl;
}



vec4 frag_noise_worley_3_types()
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
  float time = control1*10.;
  
  
  

  #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
    uv_map_coordinates_zero_one(uv, dim);
  #endif  
  
  
  // vec2 aspect = iResolution.xy / iResolution.y;
  // vec2 uv = ( fragCoord.xy / iResolution.y ) - 0.5 * aspect;
  uv *= DISP_SCALE;
  // uv += time;

  //vec2 w = worley(int(0.05 * time) % 3 + 1, vec3(uv, -0.2 * time));
  vec2 w = worley(int(0.05) % 3 + 1, vec3(uv, -0.2 * time));

  // split image adapted from Inigo Quilez; https://www.shadertoy.com/view/ll2GD3
  float ry = uv.y / res.y;
  vec3 col_type1 = lake(rescale(w.x, vec2(0.0, 1.0)));
  vec3 col_type2 = lake(rescale(length(w.xy)/(w.y + w.x) - w.x, vec2(0.0, 1.4)));
  vec3 col_type3 = lake(rescale((2.0 * w.y * w.x)/(w.y + w.x) - w.x, vec2(0.0, 0.3)));
  
  // if ( ry > (1.0/3.0) ) col = lake(rescale(length(w.xy)/(w.y + w.x) - w.x, vec2(0.0, 1.4)));
  // if ( ry > (2.0/3.0) ) col = lake(rescale((2.0 * w.y * w.x)/(w.y + w.x) - w.x, vec2(0.0, 0.3)));

  // borders
  // col *= smoothstep( 0.5, 0.48, abs(fract(3.0 * ry) - 0.5) );


  vec4 color = vec4( mix(mix(col_type1, col_type2, control2), col_type3, control3), 1.);
  return color;

}

`;








/*************************************************************************************************************************************************************/

export const frag_noise_worley_1_call = '   final_color = blend_mode_vec4( final_color, frag_noise_worley_1() );'
// export const frag_noise_worley_1_call = '   final_color = blend_color_multiply( final_color, frag_noise_worley_1() );'

/**WorleyNoise 2 - FROM: https://www.shadertoy.com/view/MstGRl */
export const frag_noise_worley_1 = `

/********************************************************************************************/
// SHADER UNIT: frag_noise_worley_1
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
// From: FROM: https://www.shadertoy.com/view/MstGRl
#define NUM_CELLS 12.0

// Arbitrary random, can be replaced with a function of your choice
float rand(vec2 co, float ctrl2)
{
  // return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453*(ctrl2*.0001)); // GOOD for lava like shaders when animating ctrl2
  return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

// Returns the point in a given cell
vec2 get_cell_point(ivec2 cell, float ctrl2) 
{
	vec2 cell_base = vec2(cell) / NUM_CELLS;
	float noise_x = rand(vec2(cell), ctrl2);
  float noise_y = rand(vec2(cell.yx), ctrl2);
  // return cell_base + (0.5 + 1.5 * vec2(noise_x, noise_y)) / NUM_CELLS;
  return cell_base + (0.5 + 1.5 * vec2(noise_x*ctrl2, noise_y*ctrl2)) / NUM_CELLS;
}

// Performs worley noise by checking all adjacent cells and comparing the distance to their points
float worley(vec2 coord, float ctrl1, float ctrl2) 
{
  ivec2 cell = ivec2(coord * NUM_CELLS);
  float dist = 1.0;
  
  // Search in the surrounding 5x5 cell block
  for (int x = 0; x < 5; x++) 
  { 
    for (int y = 0; y < 5; y++) 
    {
      vec2 cell_point = get_cell_point(cell + ivec2(x-2, y-2), ctrl2);
      dist = min(dist, distance(cell_point, coord));

    }
  }
  
  dist /= length(vec2(1.0 / NUM_CELLS))*ctrl1;
  dist = 1.0 - dist;
  return dist;
}



vec4 frag_noise_worley_1()
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
  
  
  

  #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    // pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
    // pixel_apply_world_position_offset_x(uv.x, v_wpos3_x); 
    // pixel_apply_reverse_y_coordinates(uv.y, dim.y); 
    // pixel_apply_world_position_offset_y(uv.y, v_wpos3_y); 
    uv_map_coordinates_zero_one(uv, dim);
  #endif  
  
  
  float n = worley(uv, control1, control2);
  vec4 color = vec4(n*n);
  return color;

}

`;
/**Worley 1 - No for loop - FAST*/
// export const frag_noise_worley_1 = `

// /********************************************************************************************/
// // SHADER UNIT: frag_noise_worley_1
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



// vec4 permute ( vec4 x) {
//   return mod ((34.0 * x + 1.0) * x, 289.0) ;
// }


// vec2 cellular2x2(vec2 P, float ctrl1, float ctrl2) {
//   const float K = 1.0/7.0;
//   const float K2 = 0.5/7.0;
//   const float jitter = 0.8; // jitter 1.0 makes F1 wrong more often
//   // float jitter = ctrl2*2.; // jitter 1.0 makes F1 wrong more often
//   vec2 Pi = mod( floor (P), 289.0) ;
//   vec2 Pf = fract (P);
//   vec4 Pfx = Pf.x + vec4 ( -0.5 , -1.5 , -0.5 , -1.5) ;
//   vec4 Pfy = Pf.y + vec4 ( -0.5 , -0.5 , -1.5 , -1.5) ;
//   vec4 p = permute (Pi.x + vec4 (0.0 , 1.0 , 0.0 , 1.0) );
//   p = permute (p + Pi.y + vec4 (0.0 , 0.0 , 1.0 , 1.0) );
//   vec4 ox = mod(p, 7.0) * K + K2;
//   // vec4 ox = mod(p, 7.0*ctrl2) * K + K2;
//   vec4 oy = mod( floor (p * K) ,7.0) * K + K2;
//   vec4 dx = Pfx + jitter * ox ;
//   vec4 dy = Pfy + jitter * oy ;
//   vec4 d = dx * dx + dy * dy; // distances squared
//   // Cheat and pick only F1 for the return value
//   d.xy = min(d.xy , d.zw);
//   d.x = min(d.x, d.y);
//   return d.xx; // F1 duplicated , F2 not computed
// }



// vec4 frag_noise_worley_1()
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
  
  
  

//   #ifndef UV_READY
//     #define UV_READY 1
//     uv = gl_FragCoord.xy;
//     pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
//     uv_map_coordinates_zero_one(uv, dim);
//   #endif  
  
//   vec2 st = uv; // Texture coordinates
//   vec2 F = cellular2x2(st*5., control1, control2);
//   float n = 1.0 - 1.5 * F.x * control1;
//   // float n = 1.0 - F.x * F.x * control1;
  
//   vec3 color = vec3(n, n, n);
//   return vec4(color, 1.0);

// }
// `;







/*************************************************************************************************************************************************************/

// export const frag_noise_worley_2_call = '   final_color = blend_mode_vec4( color, frag_noise_worley_2() );'
export const frag_noise_worley_2_call = '   final_color = frag_noise_worley_2();'
// export const frag_noise_worley_2_call = '   final_color = blend_color_multiply( final_color, frag_noise_worley_2() );'

/**WorleyNoise 2 - Works with mesh world position move */
export const frag_noise_worley_2 = `

/********************************************************************************************/
// SHADER UNIT: frag_noise_worley_2
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

// From https://www.shadertoy.com/view/ltjyRm
// inspired from simplified https://www.shadertoy.com/view/MtlyR8 (Voronoï with various metrics)
// + tilability, multiple seed per cell

#define CELL_SIZE 100.  // cell size
#define B  2.  // number of blob per cell. B=1 -> Poisson disk. Large or random B -> Poisson
#define R  .5  // jittering blob location. .5 = anywhere in the tile. could be < or >
#define dr .5  // blob radius fluctuates in [1-r,1+r]
#define N  3   // tested neighborhood. Make it odd > 3 if R is high 

#define srnd(p, ctrl)  ( 2.* fract(43758.5453*sin( dot(p, vec2(12.9898, 78.233))      ) ) - 1. )
// #define srnd(p, ctrl)  ( 2.* fract(43758.5453*sin( dot(p, vec2(12.9898, 78.233) *ctrl)      ) ) - 1. )
// #define srnd(p, ctrl)  ( 1.* fract(43758.5453*sin( dot(p, vec2(12.9898, 78.233)) *ctrl) ) - 1. )
#define srnd2(U, ctrl) ( 2.* fract( 4567.89 * sin(4567.8*(U)* mat2(1,-13.17,377.1,-78.7) )*ctrl ) - 1. )
// #define srnd2(U, ctrl) ( 2.* fract( 4567.89*ctrl * sin(4567.8*(U)* mat2(1,-13.17,377.1,-78.7) ) ) - 1. )
// #define srnd2(U, ctrl) ( 2.* fract(4567.89* sin(4567.8*(U)* mat2(1,-13.17,377.1,-78.7) ) ) - 1. )



vec4 frag_noise_worley_2()
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
  
  
  
  
  #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y);
    uv_map_coordinates_zero_one(uv, dim);
  #endif
  

  vec4 color = vec4(1.);

  float H = res.y;
  float size = round(res.y/(CELL_SIZE*control2));             // make number of cells integer for tilability

  // if (uv.x > 1.) { 
  //   color-=color; 
  //   return color; 
  // }   

  uv *= size; 
  float m=1e9, v, r, r0=1e2;
  
  // neihborhood
  for (int k=0; k<N*N; k++)                  
  {
    // B blobs per cell
    for (float i=0.; i<B; i++)  
    {                
      vec2 iuv = floor(uv);
      vec2 g = mod( iuv + vec2(k%N, k/N) - 1., size ); // cell location within neighborhood
      // vec2 p = g+.5 + R* srnd2(g+i*.1, (control3*.0000001+.8)) ;          // blob location
      vec2 p = g+.5 + R* srnd2(g+i*.1, ( (control3*.001) +.9) ) ;          // blob location
      
      p = mod( p - uv +size/2., size) - size/2.; // distance to blob center
      r =  1. + dr* srnd(g + i*.1 + .1, control3*.0000001+1.1);              // blob radius
      // v = length(p) / (r*control2);                          // distance in blob referential
      v = length(p) / (r);                          // distance in blob referential

      // if (v < 1. && r < r0 ) m = v,r0 = r;     // smallest blob win
      if (v < m) m = v;                           // nearest win
    }
  }
  
  // color =   vec4( 1.-(m*m) );
  // color =   vec4( 1.-m );
  // color =   vec4( 1.-(m*(m*control1)) );

  // color =   vec4( (m*m) );
  color =   vec4( (m*(m*control1)) );
  
  
  return color;

}

`;