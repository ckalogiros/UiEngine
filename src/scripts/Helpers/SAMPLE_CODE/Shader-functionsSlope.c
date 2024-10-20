//todo: i have a better almostidentity()generalization context:
//todo,some of thesse oculd use sesaw framing

//https://www.shadertoy.com/view/lslBzS
//AD 2d hull curves(almost)Useful Little Functions

// https://iquilezles.org/articles/functions
// Reimplemented by starea @ shadertoy using Flyguy's Implicit Plotter https://www.shadertoy.com/view/4tB3WV
#define PI acos(-1.)



//Implicit/f(x)plotter thing.

//XY range of the display.
#define DISP_SCALE 2.0 

//Line thickness(in pixels).
#define LINE_SIZE 2.0

//Grid line & axis thickness(in pixels).
#define GRID_LINE_SIZE 1.0
#define GRID_AXIS_SIZE 2.0

//Number of grid lines per unit.
#define GRID_LINES 1.0

//Clip areas outside DISP_SCALE
//#define CLIP_EDGES

const vec2 GRAD_OFFS=vec2(0.001,0);

//4x multi sampling by defines is a special kind of lazy and inefficient
#define GRAD(f,p,m)(vec2(f(p,m)-f(p+GRAD_OFFS.xy,m),f(p,m)-f(p+GRAD_OFFS.yx,m))/GRAD_OFFS.xx)

//PLOT(Function,Color,Destination,Screen Position)
//remove the "abs" to fill negative space
#define PLOT(c,d,p,m,f)smoothstep((LINE_SIZE/iResolution.y*DISP_SCALE),0.,abs(f(p,m)/length(GRAD(f,p,m))))*(c-d)

#define sscc(a)(a)*(a)*(3.-2.*(a))

//if(x>m)linear;else()quadraticParabola.;input of(x*sign(x))is fun;also fun to multiply the result by almostIdentity(x*sign(x),m,n)*sign(x)
//acoid small values by jumping over them f'x()near 0 is nearly 0.
float almostIdentity(float x,float m,float n){if(x>m)return x
 ;float w=x/m//;return((2.*w-3.)*w*w+1.)*n+(1.-.5*w)*2.*x*w;//overly explicit,not worth it fwith ieeefloat,low precision
 ;return(2.*m-n*3.+(2.*n-m)*w)*w*w+n;}//by iq


float almostIdentityOld(float x,float m,float n){if(x>m)return x;float a=2.*n-m;float b=2.*m-3.*n;return(a*x/m+b)*x/m*x/m+n;}
float almostIdentity(float x,float m){if(x>m)return x;return(x*x/m+m)*.5;}//special case where n=.5
float almostIdentity(vec2 p){return p.y-almostIdentity(p.x,.5,.1);}//basic demo
float almostIdentity(vec2 p,vec2 m){return p.y-almostIdentity(p.x,m.x*.5,m.y*.1);}//basic demo

//grow fast and slowly decay,for triggering behaviours or making envelopes for music or animation,
float impulse(float k,float x){k=k*x;return k*exp(1.-k);}//by iq
float impulse(vec2 p){return p.y-impulse(p.x,5.);}//basic demo of a general parametric
float impulse(vec2 p,vec2 m){return .5*p.y/m.y-impulse(p.x,.5/m.x);}//basic demo of a general parametric

//instead of filtering features via smoothstep(c-w,c,x)-smoothstep(c,c+w,x)
//,this cubicPulse()is your friend. Also,why not,you can use it as a cheap replacement for a gaussian.
float cubicPulse(float x,float c,float w){x=abs(x-c);if(x>=w)return 0.;return 1.-sscc(x/w);}//by iq
float cubicPulse(vec2 p){return p.y-cubicPulse(p.x,.5,.2);}//basic demo of a general parametric
float cubicPulse(vec2 p,vec2 m){return p.y-cubicPulse(p.x,m.x*2.,abs(m.y));}//basic demo of a general parametric

// A nice choice to remap the 0..1 interval into 0..1,such that the corners are remapped to 0. 
// Very useful to skew the shape one side or the other in order to make leaves,eyes,and many other interesting shapes
float pcurve(float x,float a,float b){float k=pow(a+b,a+b)/(pow(a,a)*pow(b,b));return k*pow(x,a)*pow(1.-x,b);}//by iq
float pcurve(vec2 p){ return p.y-pcurve(p.x,1.,2.);}
float pcurve(vec2 p,vec2 m){ return p.y-pcurve(p.x,m.y,m.x*2.);}

//natural attenuation is an exponential of a linearly decaying quantity
float expStep(float n,float x,float k){return exp(-k*pow(x,n));}//by iq
float expStep(vec2 p){return p.y-expStep(p.x,.00005,.005);}//basic demo of a general parametric
float expStep(vec2 p,vec2 m){return p.y-expStep(p.x,abs(m.y)*.00005,abs(m.x)*.005);}//basic demo of a general parametric

//f(0)=f(1)=0;f(.5)=1;f'(0)=f'(.5)=f'(1)=0 ;cheap estimate for a normal distribution
float parabola(float x,float k){return pow(4.*x*(1.-x),k);}//by iq
float parabola(vec2 p){ return p.y-parabola(p.x,5.);}//basic demo of a general parametric
float parabola(vec2 p,vec2 m){return p.y-parabola(p.x,m.x*.5);}//basic demo of a general parametric

#define sat(a)clamp(a,0.,1.)
#define u2(a)((a)*2.-1.)
#define u5(a)((a)*.5+.5)
#define kHer(a)(a)*(a)*(3.-2.*(a))
//iq.HSV.Smooth: https://www.shadertoy.com/view/MsS3Wc
vec3 khsv(float a){return sat(u2(abs(mod(a*3.+vec3(0,2,1),3.)-1.5)));}
// vec3 hsv2rgb(vec3 a){return a.z*mix(vec3(1),kHer(khsv(a.x)),a.y);}
vec3 hsv2rgb(vec2 a){return mix(vec3(1),kHer(khsv(a.x)),a.y);}
// vec3 hsv2rgb(float a){return vec3(kHer(khsv(a)));}

vec3 RGB(float a)
{
   //golden angle rainbow-hash(for natural numbers inputs)
   return hsv2rgb( vec2( fract(a*(u5(sqrt(5.)))), .5 ) );
}
 

float mav(vec2 a){return max(a.x,a.y);}
#define miv(a)-mav(-a)

float grid(vec2 p)
{
   vec2 uv=mod(p,1./GRID_LINES);float h=1./GRID_LINES/2.,ds=DISP_SCALE/iResolution.y;
   return min(
      smoothstep(0.,GRID_LINE_SIZE*ds,h-mav(abs(uv-h))),
      smoothstep(GRID_AXIS_SIZE*ds-.05,GRID_AXIS_SIZE*ds,miv(abs(p)))
   );
}

void mainImage(out vec4 fragColor,vec2 fragCoord
){vec2 aspect=iResolution.xy/iResolution.y
 ;vec2 u=(fragCoord.xy/iResolution.y)-aspect/2.
 ;u*=DISP_SCALE
 ;vec2 m=(iMouse.xy/iResolution.y)-aspect/2.
 ;vec3 c=vec3(grid(u)*0.25)
 ;//c+=PLOT(RGB(0.),c,u,m,almostIdentity)
 ;c+=PLOT(RGB(1.),c,u,m,impulse)
 ;//c+=PLOT(RGB(2.),c,u,m,cubicPulse)
 ;//c+=PLOT(RGB(3.),c,u,m,expStep)
 ;//c+=PLOT(RGB(4.),c,u,m,parabola)
 ;//c+=PLOT(RGB(5.),c,u,m,pcurve)
 #ifdef CLIP_EDGES 
 ;c*=1.-step(DISP_SCALE/2.0,abs(u.x))
 #endif
 ;fragColor=vec4(c,1);}
 