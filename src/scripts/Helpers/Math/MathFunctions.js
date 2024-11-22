"use strict";

import { Floor } from "./MathOperations.js";






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

// Analyze a number into discrete digits
export function Digitize(n, base=10){

   // Analyze a decimal number to its digit components
   if(n===0) return [0];

   const arr = [];

   while(n > 0){
      
      const d = n%base;
      arr.push(d);

      n = Floor(n/base); 
   }
   return arr;

   // Reverse order
   const result = [];
   const len = arr.length;
   let k = len-1;

   for(let i=0; i<len; i++){
      
      result[i] = arr[k--];
 
   }
   return result;

}



/***************************************************************************************************************************************/
let ID = 0;
function Get_ID() { return ID++; }


// TODO: Maybe have a buffer of 'Function_Slope' objects, and recycle through unused

export class Function_Slope {
   constructor(slope_constant = 1.0, time_step = 0.1, value_change = 100, name = ID) {

      this.slope_constant = slope_constant;
      this.time_step = time_step;
      this.timer = 0.0;
      this.value_change = value_change;
      this.in_animation = false;

      if (name) this.name = name;
      else name = Get_ID();
   }

   GetSlope() {
      return this.slope_constant;
   }

   SetSlope(val) {
      this.slope_constant = val;
   }

   GetTimer() {
      return this.timer;
   }

   SetTimer(val) {
      this.timer = val;
   }

   IncrementTimer() {
      this.timer += this.time_step;
   }

   GetValueChange() {
      return this.value_change;
   }

   SetValueChange(val) {
      this.value_change = val;
   }
   
   GetInAnimation() {
      return this.in_animation;
   }

   SetInAnimation(val) {
      this.in_animation = val;
   }
}