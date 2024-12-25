"use strict";

import { New_generic_buffer } from "../Core/Buffers.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Core/StringBuffer.js";




const MAX_ANIMATIONS_SIZE = 80;




/**SAVE OLD CODE */

class Callback_Animation {

   constructor() {
      this.params = null;
      this.animationClbk = null;
      this.stopAnimationClbk = null;
      this.is_active = false;
      this.in_animation = false;
      this.nameidx = INT_NULL;
   }
      
   
   Create(animationClbk, stopAnimationClbk, params, name) {
      this.params = params;
      this.animationClbk = animationClbk;
      this.stopAnimationClbk = stopAnimationClbk;
      this.is_active = false;
      this.nameidx = Str_buffer_store(name);
   }


   Run() {
      this.in_animation = this.animationClbk(this.params);
   }


   Stop() {
      this.is_active = false;
      this.stopAnimationClbk(this.params);
      // this.in_animation = this.stopAnimationClbk(this.params);
      // this.Remove();
      // this.in_animation = false;
   }

   Remove(){
      this.params = null;
      this.animationClbk = null;
      this.stopAnimationClbk = null;
      this.is_active = false;
      this.in_animation = false;
      this.nameidx = INT_NULL;
   }

}





const _clbk_animations_buffer = New_generic_buffer(_, 'Callback Animations Buffer');



export function Callback_animations_get() { return _clbk_animations_buffer; }


export function Callback_animations_is_animation_active(anim_idx){
   if(anim_idx === INT_NULL) {
      console.error('887691443 \nAnimation index if INT_NULL');
      return false;
   }
   const anim = _clbk_animations_buffer.buffer[anim_idx];
   if(anim!==null && anim.is_active) return true;
   return false;
}
export function Callback_animations_is_animation_in_play(anim_idx){
   if(anim_idx === INT_NULL) {
      console.error('887691444 \nAnimation index if INT_NULL');
      return false;
   }
   const anim = _clbk_animations_buffer.buffer[anim_idx];
   if(anim!==null && anim.in_animation) return true;
   return false;
}


export function Callback_animations_initialize() {

   for (let i = 0; i < MAX_ANIMATIONS_SIZE; i++) {
      const anim = new Callback_Animation;
      _clbk_animations_buffer.Add(anim);
   }

}



export function Callback_animations_destroy() {
   for (let i = 0; i <= _clbk_animations_buffer.boundary; i++) {
      
      const anim = _clbk_animations_buffer.buffer[i];

      if (anim.is_active) {
         anim.Remove();
         // anim.Stop();
      }
   }
}



export function Callback_animations_destroy_byidx(anim_idx) {
   if(anim_idx === INT_NULL) {
      console.error('887691445 \nAnimation index if INT_NULL');
      return;
   }
   const anim = _clbk_animations_buffer.buffer[anim_idx];

   if (anim!==null && anim.is_active) {
      anim.Remove();
      // anim.Stop();
   }
}



function Get_next_free() {

   for (let i = 0; i <= _clbk_animations_buffer.boundary; i++) {

      const anim = _clbk_animations_buffer.buffer[i];
      if (anim.is_active === false) {
         // console.log(i, 'Animation:', anim.is_active)
         return i;
      }
   }
   console.error(_clbk_animations_buffer)
   alert('Not enough space for new Callback_Animation. At Callback_Animations.js:Callback_Animations.Create()')
   return INT_NULL;
}



export function Callback_animations_create(animationClbk, stopAnimationClbk, params, name) {


   const freeIdx = Get_next_free();

   if (freeIdx !== INT_NULL) {
      
      const anim = _clbk_animations_buffer.buffer[freeIdx]
      anim.Create(animationClbk, stopAnimationClbk, params, name);
      anim.in_animation = true;
      anim.is_active = true;
      return freeIdx;
   }
   alert('666555444');
}



export function Callback_animations_run() {


   for (let i = 0; i <= _clbk_animations_buffer.boundary; i++) {
      
      const anim = _clbk_animations_buffer.buffer[i];

      if (anim.is_active) {
      
         if (anim.in_animation) {
      
            anim.in_animation = anim.animationClbk(anim.params);
            // if(anim.in_animation===false)
            //    anim.Stop();
         }
         else { // Here do stuf if animation stops
      
            anim.Stop();
            // console.log('----- Animation STOP', i)
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
         'name', Str_buffer_get_by_idx(anim.nameidx),
         'active', anim.is_active,
         'inAnimation', anim.in_animation,
      );
   }
}



export function Callback_animations_print_size(){

   let count = 0;
   for(let i=0; i <= _clbk_animations_buffer.boundary; i++){

      const anim = _clbk_animations_buffer.buffer[i];
      if( anim.is_active) count++;
   }
   console.log(count);

}

