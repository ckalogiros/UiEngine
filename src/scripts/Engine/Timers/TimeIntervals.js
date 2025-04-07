"use strict";

import { Str_buffer_store, Str_buffer_get_by_idx, Str_buffer_destroy } from "../Core/StringBuffer.js";
import { INT_NULL } from "../Global/EngineConstants.js";
import { TimeGet } from "./Time.js";




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
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
   _time = TimeGet();
}



class Interval {
   t;
   interval; // In miliseconds
   clbk; // Callback to call upon time interval  
   clbkParams; // Parameters for the callback funtion(if needed).
   repeat; // If = 0, executes indefinitely. Set a maximum number of times the callback will execute before the timer has finished  
   isActive;
   idx; // A way of removing a specific Interval object from the buffer of class TimeIntervals.
   // Debug
   nameidx;

   constructor(interval, clbk, idx, name='Time intervalsUNAMED', repeat) {

      this.t = 0;
      this.interval = interval;
      this.clbk = clbk;
      this.clbkParams = null;
      this.repeat = repeat;
      this.isActive = false;
      this.idx = idx;
      this.nameidx = Str_buffer_store(name);

   }


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


   Update() {  // HOT-PATH

      this.t += _time.delta;
      
      if (this.repeat > 0){ // Case repeat certain number of times

         if (this.t >= this.interval) {

            // HERE // TODO: set break point and look for performance timers debug ui. All the callbacks are stored to a buffer, but there are duplicate function pointers. See if we cal optimize by storing unique functions only
            if (this.clbk) this.clbk(this.clbkParams); // Call the callback, if exists.
            // console.log(this.GetName())
            this.t = 0; // Reset interval timer
            this.repeat--;
            return true; // Case we only need if the interval time has passed(no callback)
         }
      }
      else{ // Destroy the interval timer

         this.#Destroy();
         return false;
      }

   }


   // Case we only want to check (if time interval has passed) and not update
   Check() {

      if (this.t >= this.interval) {
         this.t = 0;
         return true;
      }
      return false;
   }


   #Destroy() {

      this.t = 0;
      this.interval = INT_NULL;
      this.clbk = null;
      this.clbkParams = null;
      this.repeat = INT_NULL;
      this.isActive = false;
      this.idx = INT_NULL;
      this.nameidx = INT_NULL;
   }


   ResetTime(){ this.t = 0; }

   
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

   constructor() {

      this.ti = [];
      this.count = 0;
      this.size = 0;

   }


   Init() {

      this.size = MAX_TIME_INTERVALS_COUNT;
      for (let i = 0; i < this.size; i++) {
         this.ti[i] = new Interval(INT_NULL, null, i, `TimeInterval:${i}`, 0);
      }
   }


   Create(interval, name, repeat, clbk, params) {

      const freeIdx = this.GetNextFree();
      const parameters = {
         time_interval_idx: freeIdx,
         params: params,
      }; 
      this.ti[freeIdx].Create(interval, this.count, name, repeat, clbk, parameters);
      this.count++;

      return freeIdx;
   }


   Update() {

      for (let i = 0; i < this.count; i++) {
         this.ti[i].Update(); // Update and calls a callback if the time interval has completed a cycle
         // const is_running = this.ti[i].Update();
         // if(!is_running) this.DestroyByIdx(i);
      }
   }


   DestroyByIdx(idx) {

      /**
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
         if(this.count < 0) 
            console.error('Time interval index is:', this.count, this)
      }
   }


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


   Exists(idx){

      if(this.ti[idx].isActive)
         return true;
      return false;
   }


   GetNextFree() {

      for (let i = 0; i < this.size; i++) {
         if (!this.ti[i].isActive) {
            return i;
         }
      }
      alert('Not enough space in buffer:TimeIntervals\nAt TimeIntervals.js\nGetNextFree()')
      return null;
   }


   // DEBUG
   Print() {

      console.log('Num Interval timers: ', this.count);
      for (let i = 0; i < this.count; i++) {
         console.log(`${this.ti[i].idx}: name:${this.ti[i].GetName()} | interval:${this.ti[i].interval}  | t:${this.ti[i].t}`);
      }
   }

};



const intervalTimers = new TimeIntervals;

export function Time_intervals_initialize(){
   // TODO: Make sure its initialized ONCE 
   intervalTimers.Init();
}

export function Time_intervals_destroy() {
   for (let i = 0; i < intervalTimers.size; i++) {
      intervalTimers.DestroyByIdx(i);
   }
}




export function Time_intervals_reset_byidx(idx) {
   intervalTimers.ti[idx].ResetTime();
}



export function Time_intervals_update() {
   intervalTimers.Update();
}



//  Returns the timeInterval index
export function Time_intervals_create(interval, name, repeat, clbk, params) {
   // console.log('INTERVAL create', name)
   return intervalTimers.Create(interval, name, repeat, clbk, params);
}



export function Time_intervals_get_byidx(idx) {
   return intervalTimers.ti[idx];
}



export function Time_intervals_destroy_byidx(idx) {
   intervalTimers.DestroyByIdx(idx);
}



// DEBUG
export function Time_intervals_print() {
   intervalTimers.Print();
}




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Step Timers.
 */

const MAX_STEP_TIMERS_LEN = 10;
class StepTimer {

   t; // The running step timer
   duration; // In miliseconds
   step; // If = 0, executes indefinitely. Set a maximum number of times the callback will execute before the timer has finished  
   clbk; // Callback to call upon time interval  
   stopClbk; // Callback to call upon timer completion  
   clbkParams; // The parameters for the Stop mestod callback
   idx;
   isActive;

   constructor() {

      this.t = 0;
      this.duration = 0;
      this.step = 0;
      this.clbk = null;
      this.stopClbk = null;
      this.clbkParams = null;
      this.idx = INT_NULL;
      this.isActive = false;
   }


   Set(duration, step, idx, clbk, stopClbk, params) {

      this.duration = duration;
      this.clbk = clbk;
      this.stopClbk = stopClbk;
      this.clbkParams = params;
      this.step = step;
      this.idx = idx;
      this.isActive = true;
   }


   Clear() {

      this.t = 0;
      this.duration = 0;
      this.step = 0;
      this.clbk = null;
      this.stopClbk = null;
      this.clbkParams = null;
      this.idx = INT_NULL;
      this.isActive = false;
   }

};




// TODO: Implement like the PerformanceTimer class, that is by extending from M_Buffer class
/** Create a class that manages all applications intervals(in an array) */
class StepTimers {

   buffer = [];
   size;
   count = 0;

   constructor() {

      this.size = MAX_STEP_TIMERS_LEN;
      this.count = 0;
      this.buffer = new Array(this.size);

      for (let i = 0; i < this.size; i++) {
         this.buffer[i] = new StepTimer;
      }
   }


   Create(duration, step, clbk, stopClbk, params) {

      const idx = this.GetNextFreeIdx(); // Get the first not active timer 
      this.buffer[idx].Set(duration, step, idx, clbk, stopClbk, params);
      this.count++;

      // Catch buffer overflow
      if (this.count >= this.size) {
         console.log(`Max Size:${this.size}  current count:${this.count}`);
         alert('ERROR. Buffer overflow in StepTimers');
      }

      return this.buffer[idx];
   }


   Clear(idx) {

      this.buffer[idx].Clear();
      this.count--;
   }


   GetNextFreeIdx() {

      for (let i = 0; i < this.size; i++) {
         if (this.buffer[i].isActive === false) {
            return i;
         }
      }
      alert('No Space for new Timer. Timer.js');
   }

};




const stepTimers = new StepTimers;

export function Step_timers_create(duration, step, clbk, stopClbk, params) {
   stepTimers.Create(duration, step, clbk, stopClbk, params);
}



export function Step_timers_update() {

   for (let i = 0; i < stepTimers.size; i++) {
      const t = stepTimers.buffer[i]; // Cash
      if (t.isActive) {
         if (t.t >= t.duration) {
            t.stopClbk(t.clbkParams);
            stepTimers.Clear(i);
            return;
         }
         t.t += t.step;
         t.clbk();
      }
   }
}

