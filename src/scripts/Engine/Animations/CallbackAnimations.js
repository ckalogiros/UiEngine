"use strict";

import { New_generic_buffer } from "../Core/Buffers.js";
import { Str_buffer_get_by_idx, Str_buffer_store } from "../Core/StringBuffer.js";




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



export function Callback_animations_destroy() {
   for (let i = 0; i <= _clbk_animations_buffer.boundary; i++) {
      
      const anim = _clbk_animations_buffer.buffer[i];

      if (anim.is_active) {
         
         anim.Stop();
         
      }
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
         'name', Str_buffer_get_by_idx(anim.nameidxa4),
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

