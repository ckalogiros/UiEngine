"use strict";









/*************************************************************************************************************************/
/*************************************************************************************************************************/

// export const frag_test1_call = '   color = frag_test1();'
// export const frag_test1_call = '   color = blend_color_multiply( color, frag_test1() );'
// export const frag_test1_call = '   color = max( color, frag_test1() );'
// export const frag_test1_call = '   color = blend_color_add( color, frag_test1() );'
// export const frag_test1_call = '   color = blend_color_darken( color, frag_test1() );'
// export const frag_test1_call = '   color = blend_color_mix( color, frag_test1(), .5 );'
export const frag_test1_call = `
  vec4 new_color = frag_test1();
  color = blend_color_mix( color, new_color, color.a );
`;

export const frag_test1 = `

/********************************************************************************************/
// SHADER UNIT: frag_test1
/********************************************************************************************/


/*****************************************************/
// GENERIC GLOBAL VARIABLES DECLERATIONS
#ifndef UV_READY
  vec2 uv = vec2(0,0);
#endif


/*****************************************************/
// FUNCTION DECLERATIONS
#ifndef SMOOTH_MIN 
  #include <smoothmin>
#endif


/*****************************************************/
// BLEND MODES FUNCTION DECLERATIONS
#ifdef BLEND_MODE 
   #include <blend_mode_directives>
#endif


#ifndef GAMMA_CORRECTION 
  #include <gamma_correction>
#endif

#ifndef BRIGHTNESS_CONTRAST 
  #include <brightness_contrast>
#endif






vec4 frag_test1()
{

#ifdef U_GENERIC_VEC3
  #include <u_generic_vec3>
#elif defined(U_GENERIC_VEC2)
  #include <u_generic_vec2>
#elif defined(U_GENERIC_FLOAT)
  #include <u_generic_float>
#endif


  vec2 res = u_screen_res;
  vec2 local_res = vec2(v_dim2_x*2., v_dim2_y*2.);
  vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);
  
  
  // #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, local_res);
  // #endif 
  
  // vec2 uv = uv;
  uv_map_coordinates_zero_one( uv, local_res );
  

  // if(uv.x > 10.1) return YELLOW;

  float repeatx = 4.;
  float repeaty = 4.;

  
  float c_vert = abs((fract(uv.x*repeatx) - .5)* 2.);
  c_vert = smoothstep(0., 1.3, c_vert);
  c_vert = 1.-c_vert;
  
  float c_hor = abs((fract(uv.y*repeaty) - .5)* 2.);
  c_hor = smoothstep(0., 1.3, c_hor);
  c_hor = 1.-c_hor;
  

  
  float c = smoothmin(c_vert, c_hor, control1);
  


  float to_min=0., to_max=1., from_min=0., from_max=(control2);
  // float to_min=0., to_max=2., from_min=control2, from_max=control2+.3; // !!Intresting!!
  float factor = (c - from_min) / (from_max - from_min);
  float result = to_min + factor * (to_max - to_min);
  // float result = smoothstep(control3, 2.*control3, to_min + factor * (to_max - to_min));

  result = clamp(result, 0., 1.);
  
  vec3 color = vec3(mix(c, result, .5));
  // vec3 color = vec3(max(c, result));
  
  color = brightness_contrast(color, control3*.5, control3*2.);
  // color = gamma_correction(color);
  
  float alpha = min(color.r, min(color.b, color.g));

  // return vec4(color*src_color.rgb, src_color.a);
  // return vec4(color, src_color.a);
  // return vec4(color, alpha);
  return vec4(color*alpha, alpha);
    
}
`;





/*************************************************************************************************************************/
/*************************************************************************************************************************/
// export const frag_test2_call = '   color = blend_color_multiply( color, frag_test2() );'
// export const frag_test2_call = '   color = blend_color_mix( color, frag_test2(), .5 );'
// export const frag_test2_call = '   color = blend_color_add( color, frag_test2() );'
// export const frag_test2_call = '   color = max( color, frag_test2() );'
export const frag_test2_call = '   color = frag_test2();'

export const frag_test2 = `

/********************************************************************************************/
// SHADER UNIT: frag_test2
/********************************************************************************************/

/*****************************************************/
// GENERIC GLOBAL VARIABLES DECLERATIONS
#ifndef UV_READY
    vec2 uv = vec2(0,0);
#endif


/*****************************************************/
// FUNCTION DECLERATIONS
#ifndef SMOOTH_MIN 
  #include <smoothmin>
#endif


//looks best with around 25 rays
#define NUM_RAYS 10.

#define VOLUMETRIC_STEPS 19

#define MAX_ITER 5
#define FAR 6.

// #define time control1*1.1


#ifndef HASH_FUNCTION 
  #include <hash_function>
#endif
#ifndef NOISE_HASH 
  #include <noise_hash>
#endif
#ifndef NOISE_FBM 
  #include <noise_fbm>
#endif


mat2 mm2(float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}
// float noise2( float x, vec3 p ){
float noise2( float x ){
  // return textureLod(iChannel0, vec2(x*.01,1.),0.0).x;
  return fbm(vec2(x));
}

float hash_function( float n ){return fract(sin(n)*43758.5453);}

float noise2(vec3 p)
{
	vec3 ip = floor(p);
  vec3 fp = fract(p);
	fp = fp*fp*(3.0-2.0*fp);
	
	vec2 tap = (ip.xy+vec2(37.0,17.0)*ip.z) + fp.xy;

	// vec2 rg = textureLod( iChannel0, (tap + 0.5)/256.0, 0.0 ).yx;
	vec2 rg = vec2(fbm(p.xy));
	return mix(rg.x, rg.y, fp.z);
}

mat3 m3 = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );


//See: https://www.shadertoy.com/view/XdfXRj
float flow(vec3 p, float t, float time)
{
	float z=2.;
	float rz = 0.;
	vec3 bp = p;
	for (float i= 1.;i < 5.;i++ )
	{
		p += time*.1;
		rz+= (sin(noise2(p+t*0.8)*6.)*0.5+0.5) /z;
		p = mix(bp,p,0.6);
		z *= 2.;
		p *= 2.01;
        p*= m3;
	}
	return rz;	
}

//could be improved
float sins(float x, float time)
{
 	float rz = 0.;
    float z = 2.;
    for (float i= 0.;i < 3.;i++ )
	{
        rz += abs(fract(x*1.4)-0.5)/z;
        x *= 1.3;
        z *= 1.15;
        x -= time*.65*z;
    }
    return rz;
}

float segm( vec3 p, vec3 a, vec3 b)
{
    vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1. );	
	return length( pa - ba*h )*.5;
}

vec3 path(float i, float d, float time)
{
    vec3 en = vec3(0.,0.,1.);
    float sns2 = sins(d+i*0.5, time)*0.22;
    float sns = sins(d+i*.6, time)*0.21;
    en.xz *= mm2((hash_function(i*10.569)-.5)*6.2+sns2);
    en.xy *= mm2((hash_function(i*4.732)-.5)*6.2+sns);
    return en;
}

vec2 map(vec3 p, float i, float time)
{
	float lp = length(p);
    vec3 bg = vec3(0.);   
    vec3 en = path(i,lp, time);
    
    float ins = smoothstep(0.11,.46,lp);
    float outs = .15+smoothstep(.0,.15,abs(lp-1.));
    p *= ins*outs;
    float id = ins*outs;
    
    float rz = segm(p, bg, en)-0.011;
    return vec2(rz,id);
}

float march(vec3 ro, vec3 rd, float startf, float maxd, float j, float time)
{
	float precis = 0.001;
    float h=0.5;
    float d = startf;
    for( int i=0; i<MAX_ITER; i++ ) {

      if( abs(h)<precis||d>maxd ) break;
      d += h*1.2;
	    float res = map(ro+rd*d, j, time).x;
      h = res;
    }

	return d;
}

//volumetric marching
vec3 vmarch(vec3 ro, vec3 rd, float j, vec3 orig, float time)
{   
    vec3 p = ro;
    vec2 r = vec2(0.);
    vec3 sum = vec3(0);
    float w = 0.;
    for( int i=0; i<VOLUMETRIC_STEPS; i++ )
    {
        r = map(p,j, time);
        p += rd*.03;
        float lp = length(p);
        
        vec3 col = sin(vec3(1.05,2.5,1.52)*3.94+r.y)*.85+0.4;
        col.rgb *= smoothstep(.0,.015,-r.x);
        col *= smoothstep(0.04,.2,abs(lp-1.1));
        col *= smoothstep(0.1,.34,lp);
        sum += abs(col)*5. * (1.2-noise2(lp*2.+j*13.+time*5.)*1.1) / (log(distance(p,orig)-2.)+.75);
    }
    return sum;
}

//returns both collision dists of unit sphere
vec2 iSphere2(vec3 ro, vec3 rd)
{
    vec3 oc = ro;
    float b = dot(oc, rd);
    float c = dot(oc,oc) - 1.;
    float h = b*b - c;
    if(h <0.0) return vec2(-1.);
    else return vec2((-b - sqrt(h)), (-b + sqrt(h)));
}


#define CAMERA_SCALE 0.7


vec4 frag_test2()
{

#ifdef U_GENERIC_VEC3
   #include <u_generic_vec3>
#elif defined(U_GENERIC_VEC2)
   #include <u_generic_vec2>
#elif defined(U_GENERIC_FLOAT)
   #include <u_generic_float>
#endif


  vec2 res = u_screen_res;
  vec2 local_res = vec2(v_dim2_x*2., v_dim2_y*2.);
  vec2 dim = vec2(v_dim2_x, v_dim2_y);
  vec4 src_color = vec4(v_col4_r, v_col4_g, v_col4_b, v_col4_a);
  
  vec2 iMouse = vec2(100., 150.);
  float time = control1*4.;
  

  // #ifndef UV_READY
    #define UV_READY 1
    uv = gl_FragCoord.xy;
    pixel_map_model_space_coordinates(uv, res, v_wpos3_x, v_wpos3_y, dim);
  // #endif 

  vec2 uv1 = vec2(uv);
  uv_map_coordinates_zero_one(uv1, local_res);


  // uv = gl_FragCoord.xy;
  // pixel_apply_world_position_offset_x(uv.x, v_wpos3_x);
  // pixel_apply_reverse_y_coordinates(uv.y, res.y);
  // pixel_apply_world_position_offset_y(uv.y, v_wpos3_y);
  // uv -= dim;
  // uv_map_coordinates_zero_one( uv, local_res );
  
  
  
  
  



	vec2 p = gl_FragCoord.xy/u_screen_res.xy-0.5;
	p.x*=u_screen_res.x/u_screen_res.y;
	vec2 um = iMouse.xy / u_screen_res.xy-.5;
    
  p = uv1;

	//camera
	vec3 ro = vec3(0., 0. ,5.);
  vec3 rd = normalize( vec3(p * CAMERA_SCALE, -1.5) );
  mat2 mx = mm2(time + um.x);
  mat2 my = mm2(time + um.y); 
  ro.xz *= mx;
  rd.xz *= mx;
  ro.xy *= my;
  rd.xy *= my;
  
  vec3 bro = ro;
  vec3 brd = rd;

  vec3 col = vec3(0.0125,0.,0.025);
#if 1
  for (float j=1.; j<NUM_RAYS+1.; j++)
  {
    ro = bro;
    rd = brd;
    mat2 mm = mm2( (time*0.1 + ((j+1.) * 5.1)) * j * 0.25 );
    ro.xy *= mm;
    rd.xy *= mm;
    ro.xz *= mm;
    rd.xz *= mm;
    float rz = march(ro, rd, 2.5, FAR, j, time);
    if ( rz >= FAR) continue;
    // vec3 pos = ro + rz*rd;
    vec3 pos = ro + rz*rd;
    col = max( col, vmarch(pos, rd, j, bro, time) );
  }
#endif

  vec3 color = vec3(col*1.3);
  return vec4(color, 1.0);
    
  ro = bro;
  rd = brd;
  vec2 sph = iSphere2(ro,rd);
    
  if (sph.x > 0.)
  {
    vec3 pos = ro+rd*sph.x;
    vec3 pos2 = ro+rd*sph.y;
    vec3 rf = reflect( rd, pos );
    vec3 rf2 = reflect( rd, pos2 );
    float nz = (-log(abs(flow(rf*1.2,time, time)-.01)));
    float nz2 = (-log(abs(flow(rf2*1.2,-time, time)-.01)));
    col += (0.1*nz*nz* vec3(0.12,0.12,.5) + 0.05*nz2*nz2*vec3(0.55,0.2,.55))*0.8;
  }
    
	// fragColor = vec4(col*1.3, 1.0);
  
  float alpha = min(color.r, min(color.b, color.g));
  
  // return vec4(color, alpha);
  // return vec4(color, 1.0);
  // return vec4(color*alpha, alpha);
  return vec4(color, alpha);



  // float repeatx = 1.;
  // float repeaty = 1.;

  // float dd = 1.-length( vec2( abs((fract(uv1.x*repeatx) - .5)* 2.), abs((fract(uv1.y*repeaty) - .5)* 2.) ));
  // dd = smoothstep(0., control1, dd);
  
  // float c = dd;

  // /**********************************************/
  // // Color 1
  // c = pow(c, .4);
  // // c *= pow(c, .2);
  // c += dd*control2*2.;
  
  // /**********************************************/
  // // Color 2
  // float c2 = 1.;
  // c2 = (dd+dd) * control3 * 5.;
  // // c2 = pow(c2, control3*4.) * c2;
  
  // /**********************************************/
  // // Mix Colors 2
  // c = blend_mode(c, c2);
  // // c = mix(c, c2, control3);

  // vec3 color = vec3(c);
  // return vec4(blm_multiply(color, src_color.rgb), src_color.a);
  // // return vec4(color*src_color.rgb, src_color.a);
}
`;

