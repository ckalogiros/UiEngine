"use strict";




// Logarithmic function

export function Logarithmic_interpolation(t, a){

   if(a+t === 0) return 0;
   const res = Math.log((a*t) + t + 1) / Math.log(a + t + 1);
   // const res = Math.log((a*t) + 1) / Math.log(a + 1);
   return res;
}

export function Linear_interpolation(min, max, t) {
   return min + (t * (max-min));
}




/**
 * EASING FUNCTIONS
 * https://easings.net/
 * 
 
easeInSine
   function easeInSine(x: number): number 
     return 1 - Math.cos((x * Math.PI) / 2);
easeOutSine
   function easeOutSine(x: number): number 
      return Math.sin((x * Math.PI) / 2);
easeInOutSine
   function easeInOutSine(x: number): number 
      return -(Math.cos(Math.PI * x) - 1) / 2;
 */