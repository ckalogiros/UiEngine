"use strict";

import { New_generic_buffer } from "../Core/Buffers";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Core/StringBuffer";




const MAX_ANIMATIONS_SIZE = 20;




/**SAVE OLD CODE */

class Callback_Animation {

   constructor() {
      this.params = null;
      this.animationClbk = null;
      this.stopAnimationClbk = null;
      this.is_active = false;
      this.in_animation = false;
      this.nameidx = INT_NULL;
      // this.nameidx = Str_buffer_store(name);
   }
   
   
   
   Create(animationClbk, stopAnimationClbk, params, index=null, name) {
      this.params = params;
      this.animationClbk = animationClbk;
      this.stopAnimationClbk = stopAnimationClbk;
      this.index = index;
      this.is_active = false;
      // this.name = `CallbackAnimation:${name}`;
      this.nameidx = Str_buffer_store(name);
   }


   Run() {
      this.in_animation = this.animationClbk(this.params);
   }


   Stop() {
      this.is_active = false;
      this.stopAnimationClbk(this.params);
   }

}





const _clbk_animations_buffer = New_generic_buffer(_, 'Callback Animations Buffer');



export function Callback_animations_get() { return _clbk_animations_buffer; }



export function Callback_animations_initialize() {

   for (let i = 0; i < MAX_ANIMATIONS_SIZE; i++) {
      const anim = new Callback_Animation;
      _clbk_animations_buffer.Add(anim);
   }

}



function Get_next_free() {

   for (let i = 0; i <= _clbk_animations_buffer.boundary; i++) {

      const anim = _clbk_animations_buffer.buffer[i];
      if (!anim.is_active) {
         return i;
      }
   }

   alert('Not enough space for new Callback_Animation. At Callback_Animations.js:Callback_Animations.Create()')
   return INT_NULL;
}



export function Callback_animations_create(animationClbk, stopAnimationClbk, params, name) {

   _clbk_animations_buffer

   const freeIdx = Get_next_free();

   if (freeIdx !== INT_NULL) {
      
      const anim = _clbk_animations_buffer.buffer[freeIdx]
      anim.Create(animationClbk, stopAnimationClbk, params, null, name);
      anim.in_animation = true;
      anim.is_active = true;
   }
   return freeIdx;
}



export function Callback_animations_runs() {


   for (let i = 0; i <= _clbk_animations_buffer.boundary; i++) {
      
      const anim = _clbk_animations_buffer.buffer[i];

      if (anim.is_active) {
      
         if (anim.in_animation) {
      
            anim.in_animation = anim.animationClbk(anim.params);
         }
         else { // Here do stuf if animation stops
      
            anim.Stop();
         }
      }
   }
}



/**********************************************************************************************************************************/
// Debug-Print

export function Callback_animations_print(){

   for(let i=0; i <= _clbk_animations_buffer.boundary; i++){

      const anim = _clbk_animations_buffer.buffer[i];

      console.log(
         'name', Str_buffer_get_by_idx(anim.nameidxa4),
         'active', anim.is_active,
         'inAnimation', anim.in_animation,
      );
   }
}


























/**SAVE */
// class Callback_Animation {

//    constructor(animationClbk = null, stopAnimationClbk = null, params = null, name) {
//       this.params = null;
//       this.animationClbk = null;
//       this.stopAnimationClbk = stopAnimationClbk;
//       this.is_active = false;
//       this.in_animation = false;
//       this.name = name;
//       this.nameidx = Str_buffer_store(name);
//    }



//    Create(animationClbk, stopAnimationClbk, params, index, name) {
//       this.params = params;
//       this.animationClbk = animationClbk;
//       this.stopAnimationClbk = stopAnimationClbk;
//       this.index = index;
//       this.name = name;
//    }


//    Run() {
//       this.in_animation = this.animationClbk(this.params);
//    }


//    Stop() {
//       this.is_active = false;
//       this.stopAnimationClbk(this.params);
//    }

// }



// class Callback_Animations {

//    animations = [];
//    count = 0;
//    size = MAX_ANIMATIONS_SIZE;


//    constructor() {

//       // this.Init();
//       for (let i = 0; i < this.size; i++) {
//          this.animations[i] = new Callback_Animation;
//          this.animations[i].Create(null, null, null);
//       }
//    }


//    GetNextFree() {
//       for (let i = 0; i < this.size; i++) {
//          if (!this.animations[i].is_active) {
//             return i;
//          }
//       }
//       return INT_NULL;
//    }


//    Create(animationClbk, stopAnimationClbk, params, name) {

//       const freeIdx = this.GetNextFree();
//       if (freeIdx !== INT_NULL) {

//          const anim = this.animations[freeIdx]
//          anim.Create(animationClbk, stopAnimationClbk, params, this.count, name);
//          anim.in_animation = true;
//          anim.is_active = true;
//          this.count++;
//       }
//       else { alert('Not enough space for new Callback_Animation. At Callback_Animations.js:Callback_Animations.Create()') }
//       return freeIdx;
//    }


//    // Run() {
//    //    if (this.count) {
//    //       for (let i = 0; i < this.size; i++) {
//    //          if (this.animations[i].is_active) {
//    //             if (this.animations[i].in_animation) {
//    //                this.animations[i].Run();
//    //             }
//    //             else { // Here do stuf if animation stops
//    //                this.animations[i].Stop();
//    //                this.count--;
//    //             }
//    //          }
//    //       }
//    //    }
//    // }
// }



// // const _clbk_animations_buffer = New_generic_buffer();
// let _clbk_animations_buffer = null;



// // export function Callback_animations_get(idx) { return _clbk_animations_buffer.buffer[idx]; }
// export function Callback_animations_get() { return _clbk_animations_buffer; }



// export function Callback_animations_create() {

//    // const anim = new Callback_Animation(animationClbk, stopAnimationClbk, params, name);
//    const anim = new Callback_Animations();
//    // const idx = _clbk_animations_buffer.Add(anim);
//    _clbk_animations_buffer = anim;

//    // return idx;

// }



// export function Callback_animations_runs() {

//    // if (_clbk_animations_buffer.active_count === 0) return;

//    for (let i = 0; i <= _clbk_animations_buffer.size; i++) {
//       // console.log(_clbk_animations_buffer.buffer[i].is_active)
//       if (_clbk_animations_buffer.animations[i].is_active) {
//          if (_clbk_animations_buffer.animations[i].in_animation) {
//             _clbk_animations_buffer.animations[i].animation.Run();
//          }
//          else { // Here do stuf if animation stops
//             _clbk_animations_buffer[i].Stop();
//             this.count--;
//          }
//       }
//    }
// }
// // export function Callback_animations_runs() {

// //    if (_clbk_animations_buffer.active_count === 0) return;

// //    for (let i = 0; i <= _clbk_animations_buffer.boundary; i++) {
// //       console.log(_clbk_animations_buffer.buffer[i].is_active)
// //       if (_clbk_animations_buffer.buffer[i].is_active) {
// //          if (_clbk_animations_buffer.buffer[i].in_animation) {
// //             _clbk_animations_buffer.buffer.Run();
// //          }
// //          else { // Here do stuf if animation stops
// //             _clbk_animations_buffer.buffer[i].Stop();
// //             this.count--;
// //          }
// //       }
// //    }
// // }