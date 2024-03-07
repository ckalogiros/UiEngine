"use strict";



/**
 * Global Timer.
 * Updates on every start and end of every frame.
 * 
 */

class Time {

   cur;
   prev;
   delta;
   deltaAvg;
   cnt;

   constructor() {

      this.cur = 0.00000001;
      this.prev = 0;
      this.delta = 0;
      this.deltaAvg = 0;
      this.cnt = 0;
   }

   Update() {

      this.prev = this.cur;
      this.cur = window.performance.now(); // In miliseconds
      this.delta = (this.cur - this.prev);
      this.cnt++;
   }


   Sample(){

      this.deltaAvg += window.performance.now() - this.cur;      
   }


   GetDelta() { return this.delta; }


   GetDelta2() { return this.deltaAvg; }


   GetTimer() { return this.cur; }

};




const _g_timer = new Time();

export function TimeGet() { return _g_timer; }



export function TimeUpdate() { _g_timer.Update(); }  // HOT-PATH



export function TimeSample() { _g_timer.Sample(); }  // HOT-PATH

