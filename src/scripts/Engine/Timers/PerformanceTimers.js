"use strict";

import { New_generic_buffer } from '../Core/Buffers.js';
import { Str_buffer_get_by_idx, Str_buffer_store } from '../Core/StringBuffer.js';
import { _, INT_NULL, PERFORMANCE_TIMER, PERFORMANCE_TIMERS_IDXS } from '../Global/EngineConstants.js';



const VERY_SMALL_FLOAT = 0.000001;


/**
 * Accumulates some time.
 * Counts the number of times it has accumulated.
 */

class Timer_Base_Fast {

   constructor(fnidx) {

      this.accum = 0;
      this.cnt = 0;
      this.fnidx = fnidx;
   }
}
class Timer_Base_Detailed {

   constructor(name=null, fnidx) {

      this.accum = 0.0;
      this.cnt = 0;
      this.worst = 0.001;
      this.best = 512.001;
      this.called = 0;
      this.fnidx = fnidx;
      // if(name)
      this.nameidx = Str_buffer_store(name);

   }
}
class Performance_Timer {

   constructor() {

      this.t = window.performance.now();
      this.group = New_generic_buffer(_, 'Group Performance_Timer');
   }
}

function Performance_timer_construct(TYPE = INT_NULL, name) {

   if (TYPE & PERFORMANCE_TIMER.BASE) return new Timer_Base_Fast(PERFORMANCE_TIMER.BASE_FN_IDX);
   if (TYPE & PERFORMANCE_TIMER.DETAILED) return new Timer_Base_Detailed(name, PERFORMANCE_TIMER.DETAILED_FN_IDX);

   console.error('SEVERE_ERROR\nNot known TYPE for performance timer\nTYPE: ', TYPE)
}


const _performance_timers_buffer = New_generic_buffer(_, 'Performance_Timer');

// TYPE: SEE->PERFORMANCE_TIMER
function Performance_timer_create(TYPE, name) {

   const pt = Performance_timer_construct(TYPE, name);

   const pt_group = new Performance_Timer();
   pt_group.group.Add(pt);

   const pt_groupidx = _performance_timers_buffer.Add(pt_group)

   return pt_groupidx;
}


export function Performance_timer_create_secondary_timer(TYPE, timer_groupidx = INT_NULL) {
   /**DEBUG */ if (_performance_timers_buffer.buffer[timer_groupidx] === undefined) console.error('SEVERE_ERROR\nNULL timer is passed as param');

   const pt = Performance_timer_construct(TYPE);

   const timeridx = _performance_timers_buffer.buffer[timer_groupidx].group.Add(pt);

   return timeridx;
}


export function Performance_timer_start(timer_groupidx) {
   /**DEBUG */ if (_performance_timers_buffer.buffer[timer_groupidx] === undefined) console.error('SEVERE_ERROR\nNULL timer is passed as param');

   const pt_group = _performance_timers_buffer.buffer[timer_groupidx];
   pt_group.t = window.performance.now(); // In miliseconds

}


function Performance_timer_base_stop_(timer, delta){
   timer.accum += delta;
   // timer.cnt++;
}

function Performance_timer_detailed_stop_(timer, delta){
   timer.accum += delta;
   if (timer.worst < delta) timer.worst = delta;
   if (timer.best > delta && delta > 0.0) timer.best = delta;
   timer.called++;
   // timer.cnt++;
}

const fn_table = [
   Performance_timer_base_stop_, 
   Performance_timer_detailed_stop_,
];

export function Performance_timer_stop(timer_groupidx){

   const timer_group = _performance_timers_buffer.buffer[timer_groupidx];

   const new_t = window.performance.now() + VERY_SMALL_FLOAT; // In miliseconds
   const delta = new_t - timer_group.t;

   for (let i = 0; i <= timer_group.group.boundary; i++) {

      fn_table[timer_group.group.buffer[i].fnidx](timer_group.group.buffer[i], delta);
   }

   timer_group.t = 0;

   
   /**DEBUG*/return delta
}


export function Performance_timers_update_tick(){
   for (let i = 0; i <= _performance_timers_buffer.boundary; i++){

      const timer_group = _performance_timers_buffer.buffer[i];
      for (let j = 0; j <= timer_group.group.boundary; j++){
         timer_group.group.buffer[j].cnt++
      }
   }
}








export function PerformanceTimersGetFps(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   return ~~(1000 / (timer.accum / timer.cnt));
}
export function PerformanceTimersGetMilisec(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   const ret = (timer.accum / timer.cnt);
   // timer.accum = 0.0;
   // timer.cnt = 0;
   return ret;
   // return (timer.accum / timer.cnt).toFixed(4);
}
export function PerformanceTimersGetNanosec(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   return (timer.accum / NANOSEC / timer.cnt).toFixed(1);
}
export function Performance_timers_get_avg_1sec_reset(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   const avg = (1000 / (timer.accum / timer.cnt));
   // { // Debug
   //    const called = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]].called;
   //    const cnt = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]].cnt;
   //    console.log(timer_idxs, 'called', called, 'cnt', cnt, 'name', PERFORMANCE_TIMERS_IDXS.GetStrName(timer_idxs[0]))
   // }
   timer.cnt = 0;
   timer.accum = 0; // Get the accumulated time from the timer.
   return ~~(avg);
}
export function Performance_timers_get_ms_1sec_reset(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   const ms = (timer.accum / timer.cnt).toFixed(4);
   timer.cnt = 0;
   timer.accum = 0; // Get the accumulated time from the timer.
   return ms;
}
export function PerformanceTimersGetWorstFps(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   const fps = ~~(1000 / timer.worst);
   // timer.worst = 0.001;
   return fps;
}
export function PerformanceTimersGetBestFps(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   const fps = ~~(1000 / timer.best);
   return fps;
}
export function PerformanceTimersGetCurTime(timer_idxs) {
   const timer = _performance_timers_buffer.buffer[timer_idxs[0]].group.buffer[timer_idxs[1]];
   return (timer.cur);
}








/**
 * Global Variables for mesuring code.
 * Must be declared somewhere globally because they are gonna be used mainly in Render loop
 * so we need some global declaration to access them. 
 * Also its better for callbacks to be functions rather than class methods,
 * which they dont have any object state through the callback.
 */

export function Performance_timers_init_all() {

   // const idx = Performance_timers_create_timer('GameLoop');
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'GameLoop');
      PERFORMANCE_TIMERS_IDXS.GameLoop = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'GlDraw');
      PERFORMANCE_TIMERS_IDXS.GlDraw = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'Batch');
      PERFORMANCE_TIMERS_IDXS.Batch = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'SceneUpdate');
      PERFORMANCE_TIMERS_IDXS.SceneUpdate = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'HoverListener');
      PERFORMANCE_TIMERS_IDXS.HoverListener = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'EventListener');
      PERFORMANCE_TIMERS_IDXS.EventListener = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'FramebufferRendering');
      PERFORMANCE_TIMERS_IDXS.FramebufferRendering = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'AllTimersUpdate');
      PERFORMANCE_TIMERS_IDXS.AllTimersUpdate = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'Batch2');
      PERFORMANCE_TIMERS_IDXS.Batch2 = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'MeshInfoTip');
      PERFORMANCE_TIMERS_IDXS.MeshInfoTip = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'AddToGfxRect');
      PERFORMANCE_TIMERS_IDXS.AddToGfxRect = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'AddToGfxText');
      PERFORMANCE_TIMERS_IDXS.AddToGfxText = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'Animations');
      PERFORMANCE_TIMERS_IDXS.Animations = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'Particles');
      PERFORMANCE_TIMERS_IDXS.Particles = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'Particles2');
      PERFORMANCE_TIMERS_IDXS.Particles2 = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'MiscTest1');
      PERFORMANCE_TIMERS_IDXS.MiscTest1 = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'MiscTest2');
      PERFORMANCE_TIMERS_IDXS.MiscTest2 = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'MiscTest3');
      PERFORMANCE_TIMERS_IDXS.MiscTest3 = idx;
   }
   {
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'MiscTest4');
      PERFORMANCE_TIMERS_IDXS.MiscTest4 = idx;
   }
}

