"use strict";

import { Str_buffer_store, Str_buffer_get_by_idx, Str_buffer_destroy } from "../Core/StringBuffer.js";
import { Time_get } from "./Time.js";




/*
 * Interval Timers.

 * Runs every 'interval' time.
 * If param  @repeat is set, then the destruction of the timer will happen when it repeats x number of times.
 * 
 * @interval The time interval (in miliseconds) to which the timer will reset and start over. 
 * @clbk The callback to call every time the timer updates.
 * @clbkParams The callback to call every time the timer updates.
 * @idx Self reference index.The index of 'this' object inside the buffer that is stored to. 
 * @name A name for debugging 
 * @repeat How many times the timer will repeat before destruction. If set to 0, repeates forever.
 */

let _time = null; // Store a local refference of the App's timer
export function Time_intervals_init_time(){
   _time = Time_get();
}


/** */
class Interval {

   /** */
   constructor(interval, clbk, idx, name='Time intervalsUNAMED', repeat) {

      this.t = 0; // In miliseconds
      this.interval = interval;
      this.clbk = clbk; // Callback to call upon time interval 
      this.clbkParams = null; // Parameters for the callback funtion(if needed).
      this.repeat = repeat; // If = 0, executes indefinitely. Set a maximum number of times the callback will execute before the timer has finished
      this.isActive = false;
      this.idx = idx; // Self refference index
      this.nameidx = Str_buffer_store(name);

   }
   /** */
   Create(interval, idx, name, repeat, clbk, params) { // Params may be null

      this.t = 0;
      this.interval = interval;
      this.clbk = clbk;
      this.clbkParams = params;
      this.repeat = repeat;
      this.isActive = true;
      this.idx = idx;
      this.nameidx = Str_buffer_store(name);
   }
   /** */
   Update() {  // HOT-PATH

      this.t += _time.delta;
      
      if (this.repeat > 0){ // Case repeat certain number of times

         if (this.t >= this.interval) {
            // TODO: set break point and look for performance timers debug ui. All the callbacks are stored to a buffer, but there are duplicate function pointers. See if we can optimize by storing unique functions only
            if (this.clbk) this.clbk(this.clbkParams); // Call the callback, if exists.
            this.t = 0; // Reset interval timer
            this.repeat--;
            return true; 
         }
      }
      else{ // Destroy the interval timer

         Time_intervals_destroy_byidx(this.idx);
         return false;
      }

   }
   /** Case we only want to check (if time interval has passed) and not update */
   Check() {

      if (this.t >= this.interval) {
         this.t = 0;
         return true;
      }
      return false;
   }
   /** */
   ResetTime(){ this.t = 0; }
   /** */
   GetName(){
      return Str_buffer_get_by_idx(this.nameidx)
   }

};




const MAX_TIME_INTERVALS_COUNT = 32;

/** Create a class that manages all applications intervals(in an array) */
class TimeIntervals {

   ti;
   count;
   size;

   /** */
   constructor() {

      this.ti = [];
      this.count = 0;
      this.boundary = INT_NULL;
      this.size = 0;

   }
   /** */
   Init() {

      this.size = MAX_TIME_INTERVALS_COUNT;
      for (let i = 0; i < this.size; i++) {
         this.ti[i] = new Interval(INT_NULL, null, i, `TimeInterval:${i}`, 0);
      }
   }
   /** */
   Create(interval, name, repeat, clbk, params) {

      const freeIdx = this.GetNextFree();
      const parameters = {
         time_interval_idx: freeIdx,
         params: params,
      }; 
      this.ti[freeIdx].Create(interval, freeIdx, name, repeat, clbk, parameters);
      this.count++;

      return freeIdx;
   }
   /** */
   GetNextFree() {

      for (let i = 0; i < this.size; i++) {
         if (!this.ti[i].isActive) {
            // Increment boundary only if the free element is after the last stored element in the buffer.
            if (i > this.boundary) this.boundary = i;
            return i;
         }
      }
      alert('Not enough space in buffer:TimeIntervals\nAt TimeIntervals.js\nGetNextFree()')
      return null;
   }
   /** */
   Update() {

      for (let i = this.boundary; i >= 0; i--) {

         if(this.ti[i].isActive)
            this.ti[i].Update(); // Update and calls a callback if the time interval has completed a cycle
      }
   }
   /** */
   DestroyByIdx(idx) {

      /** // TODO
       * Because of the dynamic text widget, 
       * we share intervals between different dynamic text 
       * but also between different widgets.
       * So on widget destroy we call this many times to destroy the same interval.
       * A quick fix is to check if the interval exists.
       * TODO: Find more efficient way
       */

      if(this.ti[idx].isActive){

         this.#Destroy(idx);
         this.count--;
         // Check if previous elements are empty, and reduce boundary to the last active.
         while(this.boundary > INT_NULL && this.ti[this.boundary].isActive === false) {
            this.boundary--;
         }
         if(this.count < 0) {
            console.error('Time intervals: count out of bounds\nidx:', this.count, this);
            alert('554413099897765413.\nTime intervals: count out of bounds');
         }
      }
   }
   /** */
   #Destroy(idx){

      this.ti[idx].t = 0;
      this.ti[idx].interval = INT_NULL;
      this.ti[idx].clbk = null;
      this.ti[idx].clbkParams = null;
      this.ti[idx].repeat = INT_NULL;
      this.ti[idx].isActive = false;
      this.ti[idx].idx = INT_NULL;
      Str_buffer_destroy(this.ti[idx].nameidx);
   }
   /** */
   Exists(idx){

      if(this.ti[idx].isActive)
         return true;
      return false;
   }
   /* DEBUG-PRINT */
   Print() {

      console.log('Num Interval timers: ', this.count);
      for (let i = 0; i < this.size; i++) {
         if(this.ti[i].isActive)
            console.log(`${this.ti[i].idx}: name:${Str_buffer_get_by_idx(this.ti[i].nameidx)} | interval:${this.ti[i].interval/1000}s  | t:${this.ti[i].t}`);
      }
      
   }

};



/** */
const intervalTimers = new TimeIntervals;

/** */
export function Time_intervals_initialize(){
   // TODO: Make sure its initialized ONCE 
   intervalTimers.Init();
}
/** */
export function Time_intervals_destroy_all() {
   for (let i = 0; i < intervalTimers.size; i++) {
      intervalTimers.DestroyByIdx(i);
   }
}
/** */
export function Time_intervals_reset_byidx(idx) {
   intervalTimers.ti[idx].ResetTime();
}
/** */
export function Time_intervals_update() {
   intervalTimers.Update();
}
/** Returns the timeInterval index */
export function Time_intervals_create(interval, name, repeat, clbk, params) {
   return intervalTimers.Create(interval, name, repeat, clbk, params);
}
/** */
export function Time_intervals_get_byidx(idx) {
   return intervalTimers.ti[idx];
}
/** */
export function Time_intervals_destroy_byidx(idx) {
   intervalTimers.DestroyByIdx(idx);
}
/** DEBUG */
export function Time_intervals_print() {
   intervalTimers.Print();
   console.log('Interval timer struct: ', intervalTimers);
}


