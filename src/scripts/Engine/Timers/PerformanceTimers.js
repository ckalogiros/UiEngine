"use strict";

// import { Floor } from '../../Helpers/Math/MathOperations.js';
import { New_generic_buffer } from '../Core/Buffers.js';
import { Str_buffer_store } from '../Core/StringBuffer.js';



const DEBUG_PERFORMANCE_TIMERS = true;
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

   constructor(name, fnidx) {

      this.accum = 0.0;
      this.cnt = 0;
      this.worst = 0.001;
      this.best = 512.001;
      this.called = 0;
      this.fnidx = fnidx;
      this.nameidx = Str_buffer_store(name);

   }
}
class Performance_Timer {

   constructor() {

      this.t = window.performance.now();
      this.group = New_generic_buffer(_, 'Group Performance_Timer');
   }
}

function Performance_timer_contruct(TYPE = INT_NULL, name) {

   if (TYPE & PERFORMANCE_TIMER.BASE) return new Timer_Base_Fast(PERFORMANCE_TIMER.BASE_FN_IDX);
   if (TYPE & PERFORMANCE_TIMER.DETAILED) return new Timer_Base_Detailed(name, PERFORMANCE_TIMER.DETAILED_FN_IDX);

   console.error('SEVERE_ERROR\nNot known TYPE for performance timer\nTYPE: ', TYPE)
}


const _performance_timers_buffer = New_generic_buffer(_, 'Performance_Timer');

// TYPE: SEE->PERFORMANCE_TIMER
function Performance_timer_create(TYPE, name) {

   const pt = Performance_timer_contruct(TYPE, name);

   const pt_group = new Performance_Timer();
   pt_group.group.Add(pt);

   const pt_groupidx = _performance_timers_buffer.Add(pt_group)

   return pt_groupidx;
}


export function Performance_timer_create_secondary_timer(TYPE, timer_groupidx = INT_NULL) {
   /**DEBUG */ if (_performance_timers_buffer.buffer[timer_groupidx] === undefined) console.error('SEVERE_ERROR\nNULL timer is passed as param');

   const pt = Performance_timer_contruct(TYPE);

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
   timer.accum = 0.0;
   timer.cnt = 0;
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
      const idx = Performance_timer_create(PERFORMANCE_TIMER.DETAILED, 'MiscTest2');
      PERFORMANCE_TIMERS_IDXS.MiscTest2 = idx;
   }
}















// class Timer_Performance {

//    t;
//    accum;
//    delta;
//    cnt;

//    // Misc
//    worst; // Gets the worst delta(one sample), of the duration the interval that calls the PerformanceTimersGetWorstFps() was set.
//    best; // Gets the best delta(one sample), of the duration the interval that calls the PerformanceTimersGetBestFps() was set.

//    /** Debug */
//    nameidx;

//    constructor(name='Performance timer UNAMED') {

//       this.t = 0.000000001;
//       this.accum = 0.000000001;
//       this.cnt = 0;
//       this.worst = 0.001;
//       this.best = 512.001;
//       this.nameidx = Str_buffer_store(name);

//       this.called = 0;
//    }


//    Start() {
//       this.t = window.performance.now();
//    }


//    Stop() {

//       const new_t = window.performance.now(); // In miliseconds
//       const delta = new_t - this.t;
//       this.accum += delta;

//       if (this.worst < delta) {
//          this.worst = delta;
//       }
//       if (this.best > delta && delta > 0.0) {
//          this.best = delta;
//       }

//       this.called++;
//    }


//    Reset() {
//       this.t = 0.000000001;
//       this.accum = 0.000000001;
//       this.cnt = 0;
//       this.worst = 0.001;
//       this.best = 512.001;
//    }

// }



// class PerformanceTimers extends M_Buffer {

//    Create(name) {
//       const t = new Timer_Performance(name);
//       return this.Add(t);
//    }
// }



// const _perf_timers_buffer = new PerformanceTimers();
// _perf_timers_buffer.Init(32);



// /**
//  * Global Functions
//  */

// export function Performance_timers_create_timer(name = '') {

//    const idx = _perf_timers_buffer.Create(name);
//    return _perf_timers_buffer.buffer[idx];
// }



// export function PerformanceTimersTick() { // HOT-PATH
//    /**
//     * This updates the tick count uppon every frame.
//     * Enables a timer to  Start and Stop more than 1 times during a frame.
//     * The reason is: if the count would update on every Start() call, then the
//     * mesurement would be false, providing greater speed for mesurements
//     * that are calle may times per frame.
//     */
//    for (let i = 0; i <= _perf_timers_buffer.boundary; i++) {

//       _perf_timers_buffer.buffer[i].cnt++;

//    }
// }



// // IMPORTANT: The functions below use: accum, cnt and delta variables. Example: _pt_loop.avg_1sec_reset has all 3 of them.
// export function PerformanceTimersGetFps(timer) {
//    return Floor(1 / (timer.accum * MILISEC_TO_SEC / timer.cnt));
// }



// export function PerformanceTimersGetMilisec(timer) {
//    return (timer.accum / timer.cnt).toFixed(4);
// }



// export function PerformanceTimersGetNanosec(timer) {
//    return (timer.accum / NANOSEC / timer.cnt).toFixed(1);
// }



// export function Performance_timers_get_avg_1sec_reset(timer) {

//    // const cnt = timer.timer.cnt - timer.avg_1sec_reset.cnt; // Get the count from the time passed since last .
//    // const accum = timer.timer.accum - timer.avg_1sec_reset.accum; // Get the accumulated time from the timer.
//    timer.avg_1sec_reset.cnt = timer.timer.cnt - timer.avg_1sec_reset.cnt; // Get the count from the time passed since last .
//    timer.avg_1sec_reset.accum = timer.timer.accum - timer.avg_1sec_reset.accum; // Get the accumulated time from the timer.
//    timer.avg_1sec_reset.delta_avg = (1 / ((timer.avg_1sec_reset.accum * MILISEC_TO_SEC) / timer.avg_1sec_reset.cnt));

//    // Store current so we can calc the dif in the next call.
//    timer.avg_1sec_reset.cnt = timer.timer.cnt;
//    timer.avg_1sec_reset.accum = timer.timer.accum; // Get the accumulated time from the timer.
//    return Floor(timer.avg_1sec_reset.delta_avg);
//    // return  Floor(accum);
// }



// // IMPORTANT: Performance_timers_get_avg_1sec_reset AND ... are competing with each other by both reseting the .cnt and .accum
// export function Performance_timers_get_ms_1sec_reset(timer) {

//    timer.avg_1sec_reset.cnt = timer.timer.cnt - timer.avg_1sec_reset.cnt; // Get the count from the time passed since last .
//    timer.avg_1sec_reset.accum = timer.timer.accum - timer.avg_1sec_reset.accum; // Get the accumulated time from the timer.
//    timer.avg_1sec_reset.delta_avg = (1 / ((timer.avg_1sec_reset.accum * MILISEC_TO_SEC) / timer.avg_1sec_reset.cnt));

//    const ms = (timer.avg_1sec_reset.accum / timer.avg_1sec_reset.cnt).toFixed(4);

//    // Store current so we can calc the dif in the next call.
//    timer.avg_1sec_reset.cnt = timer.timer.cnt;
//    timer.avg_1sec_reset.accum = timer.timer.accum; // Get the accumulated time from the timer.

//    return ms;
//    // return (timer.timer.accum / timer.timer.cnt).toFixed(4);
// }



// // IMPORTANT: The functions below can be called only with param of class type "Timer_Performance". They use class variables that belong to the class.
// export function PerformanceTimersGetWorstFps(timer) {
//    // NOTE: The max value of the time.worst can take, ceils at 10000 fps because of the performance.now accuracy.
//    // NOTE: Because the .worst is only on sample(not many accumulated and devided), is limiited by the performance.now resolution(0.0001-9...)..
//    const fps = Floor(1 / (timer.worst * MILISEC_TO_SEC));
//    timer.worst = 0.001;
//    return fps;
// }



// export function PerformanceTimersGetBestFps(timer) {
//    // NOTE: The max value of the time.best can take, ceils at 10000 fps because of the performance.now accuracy.
//    // NOTE: Because the .best is only on sample(not many accumulated and devided), is limiited by the performance.now resolution(0.0001-9...).
//    const fps = Floor(1 / (timer.best * MILISEC_TO_SEC));
//    // console.log(timer.GetName(), timer.called)
//    // timer.called = 0;
//    // timer.best = 512.001;
//    return fps;
// }



// export function PerformanceTimersGetCurTime(timer) {
//    return (timer.cur);
// }



// export const _pt_loop = {
//    timer: new Performance_timers_create_timer('GameLoop'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_gl_draw = {
//    timer: new Performance_timers_create_timer('GlDraw'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_all_timers = {
//    timer: new Performance_timers_create_timer('AllTimersUpdate'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_batch_update = {
//    timer: new Performance_timers_create_timer('Batch'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_batch2_update = {
//    timer: new Performance_timers_create_timer('Batch2'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_scene_update = {
//    timer: new Performance_timers_create_timer('SceneUpdate'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_event_listener = {
//    timer: new Performance_timers_create_timer('EventListener'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_hover_listener = {
//    timer: new Performance_timers_create_timer('HoverListener'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_mesh_info_tip = { // A section of useful mesh data showing on mouse hover
//    timer: new Performance_timers_create_timer('MeshInfoTip'),  // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_framebuffer_rendering = {
//    timer: new Performance_timers_create_timer('FramebufferRendering'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };


// export const _pt_test_misc_1 = {
//    timer: new Performance_timers_create_timer('MiscTest1'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_test_misc_2 = {
//    timer: new Performance_timers_create_timer('MiscTest2'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_test_misc_3 = {
//    timer: new Performance_timers_create_timer('MiscTest3'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };

// export const _pt_test_misc_4 = {
//    timer: new Performance_timers_create_timer('MiscTest4'), // The Average accumulated time
//    avg_1sec_reset: { accum: 0, cnt: 0, delta_avg: 0 }, // The Average accumulated time every 1 second
// };


