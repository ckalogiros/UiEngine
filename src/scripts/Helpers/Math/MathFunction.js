"use strict";




// Logarithmic function

export function Slope_function_logarithmic(t, a){

   if(a+t === 0) return 0;
   // const res = Math.log((a*t) + t + 1) / Math.log(a + t + 1);
   const res = Math.log((a*t) + 1) / Math.log(a + 1);
   return res;
}