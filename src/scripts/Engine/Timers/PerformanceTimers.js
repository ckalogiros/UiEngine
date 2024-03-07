"use strict";

import { Floor } from '../../Helpers/Math/MathOperations.js';
import { M_Buffer } from '../Core/Buffers.js';
import { Str_buffer_store } from '../Core/StringBuffer.js';


class PerformanceTimer {

   cur;
   prev;
   accum;
   delta;
   cnt;

   // Misc
   worst; // Gets the worst delta(one sample), of the duration the interval that calls the PerformanceTimersGetWorstFps() was set.
   best; // Gets the best delta(one sample), of the duration the interval that calls the PerformanceTimersGetBestFps() was set.

   /** Debug */
   // name;
   nameidx;

   constructor(name) {

      this.cur = 0.000000001;
      this.prev = 0.000000001;
      this.accum = 0.000000001;
      this.delta = 0.000000001;
      this.cnt = 0;
      this.worst = 0.001;
      this.best =  512.001;
      // this.name = name;
      this.nameidx = Str_buffer_store(name);

      this.called = 0;
   }
   

   Start() { 
      this.prev = window.performance.now(); 
   }

   
   Stop() {
      
      this.cur = window.performance.now(); // In miliseconds
      this.delta = this.cur - this.prev;
      this.accum += this.delta;

      if(this.worst < this.delta) {
         this.worst = this.delta;
      }
      if(this.best > this.delta && this.delta > 0.0) {
         this.best = this.delta;
      }
      
      // console.log(this.GetName(), this.cur)
      this.called++;
   }


   Reset(){
      this.cur = 0.000000001;
      this.prev = 0.000000001;
      this.accum = 0.000000001;
      this.delta = 0.000000001;
      this.cnt = 0;
      this.worst = 0.001;
      this.best =  512.001;
   }

}



class PerformanceTimers extends M_Buffer {

   Create(name) { return this.Add(new PerformanceTimer(name)); }
}



const _timeMeasures = new PerformanceTimers();
_timeMeasures.Init(32);



/**
 * Global Functions
 */

export function PerformanceTimerCreate(name = '') {

   const idx = _timeMeasures.Create(name);
   return _timeMeasures.buffer[idx];
}



export function PerformanceTimersTick(){ // HOT-PATH
   /**
    * This updates the tick count uppon every frame.
    * Enables a timer to  Start and Stop more than 1 times during a frame.
    * The reason is: if the count would update on every Start() call, then the 
    * mesurement would be false, providing greater speed for mesurements 
    * that are calle may times per frame.  
    */
   for(let i=0; i<_timeMeasures.boundary; i++){

      _timeMeasures.buffer[i].cnt++;

      // if(_timeMeasures.buffer[i].worst < _timeMeasures.buffer[i].delta) {
      //    _timeMeasures.buffer[i].worst = _timeMeasures.buffer[i].delta;
      // }
      // if(_timeMeasures.buffer[i].best > _timeMeasures.buffer[i].delta && _timeMeasures.buffer[i].delta > 0) {
      //    _timeMeasures.buffer[i].best = _timeMeasures.buffer[i].delta;
      //    // console.log(this.delta)
      // }
   }
}



// IMPORTANT: The functions below use: accum, cnt and delta variables. Example: _pt_loop.avg_1sec_reset has all 3 of them.
export function PerformanceTimersGetFps(timer){
   return Floor( 1 / (timer.accum * MILISEC / timer.cnt));
}



export function PerformanceTimersGetMilisec(timer){
   return (timer.accum / timer.cnt).toFixed(4); 
}



export function PerformanceTimersGetNanosec(timer){
   return (timer.accum / NANOSEC / timer.cnt).toFixed(1);
}



export function Performance_timers_get_avg_1sec_reset(timer){

   // const cnt = timer.timer.cnt - timer.avg_1sec_reset.cnt; // Get the count from the time passed since last .
   // const accum = timer.timer.accum - timer.avg_1sec_reset.accum; // Get the accumulated time from the timer.
   timer.avg_1sec_reset.cnt = timer.timer.cnt - timer.avg_1sec_reset.cnt; // Get the count from the time passed since last .
   timer.avg_1sec_reset.accum = timer.timer.accum - timer.avg_1sec_reset.accum; // Get the accumulated time from the timer.
   timer.avg_1sec_reset.delta_avg = (1 / ((timer.avg_1sec_reset.accum * MILISEC) / timer.avg_1sec_reset.cnt));
   
   // Store current so we can calc the dif in the next call.
   timer.avg_1sec_reset.cnt = timer.timer.cnt; 
   timer.avg_1sec_reset.accum = timer.timer.accum; // Get the accumulated time from the timer.
   return  Floor(timer.avg_1sec_reset.delta_avg);
   // return  Floor(accum);
}



// IMPORTANT: Performance_timers_get_avg_1sec_reset AND ... are competing with each other by both reseting the .cnt and .accum
export function Performance_timers_get_ms_1sec_reset(timer){

   timer.avg_1sec_reset.cnt = timer.timer.cnt - timer.avg_1sec_reset.cnt; // Get the count from the time passed since last .
   timer.avg_1sec_reset.accum = timer.timer.accum - timer.avg_1sec_reset.accum; // Get the accumulated time from the timer.
   timer.avg_1sec_reset.delta_avg = (1 / ((timer.avg_1sec_reset.accum * MILISEC) / timer.avg_1sec_reset.cnt));
   
   const ms = (timer.avg_1sec_reset.accum / timer.avg_1sec_reset.cnt).toFixed(4);
   
   // Store current so we can calc the dif in the next call.
   timer.avg_1sec_reset.cnt = timer.timer.cnt; 
   timer.avg_1sec_reset.accum = timer.timer.accum; // Get the accumulated time from the timer.

   return ms;
   // return (timer.timer.accum / timer.timer.cnt).toFixed(4); 
}



// IMPORTANT: The functions below can be called only with param of class type "PerformanceTimer". They use class variables that belong to the class.
export function PerformanceTimersGetWorstFps(timer){
   // NOTE: The max value of the time.worst can take, ceils at 10000 fps because of the performance.now accuracy.  
   // NOTE: Because the .worst is only on sample(not many accumulated and devided), is limiited by the performance.now resolution(0.0001-9...).. 
   const fps = Floor( 1 / (timer.worst * MILISEC));
   timer.worst = 0.001;
   return fps;
}



export function PerformanceTimersGetBestFps(timer){
   // NOTE: The max value of the time.best can take, ceils at 10000 fps because of the performance.now accuracy.  
   // NOTE: Because the .best is only on sample(not many accumulated and devided), is limiited by the performance.now resolution(0.0001-9...). 
   const fps = Floor( 1 / (timer.best * MILISEC));
   // console.log(timer.GetName(), timer.called)
   // timer.called = 0;
   // timer.best = 512.001;
   return fps;
}



export function PerformanceTimersGetCurTime(timer){
   return (timer.cur);
}



/**
 * Global Variables for mesuring code.
 * Must be declared somewhere globally because they are gonna be used mainly in Render loop
 * so we need some global declaration to access them. 
 * Also its better for callbacks to be functions rather than class methods,
 * which they dont have any object state through the callback.
 */
export const _pt_loop = {
   timer: new PerformanceTimerCreate('GameLoop'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_gl_draw = {
   timer: new PerformanceTimerCreate('GlDraw'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_all_timers = {
   timer: new PerformanceTimerCreate('AllTimersUpdate'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_batch_update = {
   timer: new PerformanceTimerCreate('Batch'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_batch2_update = {
   timer: new PerformanceTimerCreate('Batch2'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_scene_update = {
   timer: new PerformanceTimerCreate('SceneUpdate'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_event_listener = {
   timer: new PerformanceTimerCreate('EventListener'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_hover_listener = {
   timer: new PerformanceTimerCreate('HoverListener'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_mesh_info_tip = { // A section of useful mesh data showing on mouse hover
   timer: new PerformanceTimerCreate('MeshInfoTip'),  // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_framebuffer_rendering = {
   timer: new PerformanceTimerCreate('FramebufferRendering'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};


export const _pt_test_misc_1 = {
   timer: new PerformanceTimerCreate('MiscTest1'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_test_misc_2 = {
   timer: new PerformanceTimerCreate('MiscTest2'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_test_misc_3 = {
   timer: new PerformanceTimerCreate('MiscTest3'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};

export const _pt_test_misc_4 = {
   timer: new PerformanceTimerCreate('MiscTest4'), // The Average accumulated time
   avg_1sec_reset: {accum: 0, cnt: 0, delta_avg: 0}, // The Average accumulated time every 1 second
};


