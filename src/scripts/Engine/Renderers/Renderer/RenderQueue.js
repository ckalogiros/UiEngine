"use strict";

const MAX_DRAWQUEUE_COUNT = 64; // Number of Gl programs for the queue  

class RenderQueueData {

   progidx;
   vbidx;
   ibidx;
   queueIdx;
   isActive;
   draw_count;

   constructor(){
      this.Reset();
   }


   Set(elem){
      this.progidx  = elem.progidx;
      this.vbidx    = elem.vbidx;
      this.ibidx    = elem.ibidx;
      this.queueIdx = elem.queueIdx;
      this.isActive = elem.isActive;
      this.draw_count = elem.draw_count;
   }

   
   Reset(){
      this.progidx  = INT_NULL;
      this.vbidx    = INT_NULL;
      this.queueIdx = INT_NULL;
      this.isActive = false;
      this.draw_count = 0;
   }

}



class RenderQueue {

   buffer = [];
   count = 0;
   size = 0;
   active = [];
   activeCount = 0;


   constructor() {
      this.size = MAX_DRAWQUEUE_COUNT;
   }


   Init() {
      
      for (let i = 0; i < this.size; i++) {
         this.buffer[i] = new RenderQueueData;
      }
   }


   Deactivate(progidx, vbidx){

      const foundIdx = this.Find(progidx, vbidx);
      if (foundIdx !== INT_NULL && foundIdx < this.count-1) {
         this.buffer[foundIdx].isActive = false;
         this.RebuildActiveQueue()
      }
   }


   RebuildActiveQueue(){ // Recreates an array of all active vertex buffers from the draw queue on every Frame.

      this.activeCount = 0;
      this.active = []; // Reset curent active queue buffer
      for (let i = 0; i < this.size; i++) {
         if(this.buffer[i].isActive){ // recreate the active queue buffer from the renderqueue buffer 
            this.active[this.activeCount++] = this.buffer[i];
         }
      }
   }


   UpdateActiveQueueByIdx(idx){ // Recreates an array of all active vertex buffers from the draw queue on every Frame.
      this.active[this.activeCount++] = this.buffer[idx];
   }


   Add(progidx, vbidx, ibidx, isActive) {

      // index = (i * (columns * depth)) + (j * depth) + k
      // index = (groupidx * (max_progs * max_vbs)) + (progidx * max_vbs) + vbidx
      const obj = {
         progidx: progidx,
         vbidx: vbidx,
         ibidx: ibidx,
         queueIdx: this.count,
         isActive: isActive,
         draw_count: 0,
      }
      this.buffer[this.count].Set(obj);
      this.count++;

      // DEBUG
      if(this.count > this.size) alert('ERROR - RenderQueue buffer is FULL')
   }


   Find(progidx, vbidx) {

      if(!this.count) return INT_NULL; // Case RenderQueue hasn't been initialized
      for (let i = 0; i < this.size; i++) {
         if (this.buffer[i].vbidx === vbidx &&
            this.buffer[i].progidx === progidx ) {
            return i;
         }
      }
      return INT_NULL;
   }
   

   FindAllBuffersFromProgram(progidx) {

      if(!this.count) return INT_NULL; // Case RenderQueue hasn't been initialized
      let idxs = [];
      for (let i = 0; i < this.size; i++) {
         if (this.buffer[i].progidx === progidx) {
            idxs.push(i);
         }
      }
      return idxs;
   }


   Swap(obj1, obj2){

      const temp = new RenderQueueData;
      temp.Set(obj1);
      obj1.Set(obj2);
      obj2.Set(temp);
   }


   // IMIDIATELY: SLOW 
   SetPriority(flag, progidx, vbidx = ALL){

      if(vbidx === ALL){

         const idxs = this.FindAllBuffersFromProgram(progidx);

         for(let k=0; k<idxs.length; k++){

            if(flag === FIRST && idxs[k] > 0){

               // Move all elements to the right
               for(let i = idxs[k]; i>0; i--){
                  this.buffer[i].Set(this.buffer[i-1]);
               }
               // Store back prioritized element
               this.buffer[0].Set(temp);
            }
            else if(flag === LAST && idxs[k] < this.count-1){
               // Move all elements to the left
               for(let i = idxs[k]; i<this.count; i++){
                  this.buffer[i].Set(this.buffer[i+1]);
               }
               // Store back prioritized element
               this.buffer[this.count-1].Set(temp); 
            }
         }

      }

      /**************************************************************************/

      const idx = this.Find(progidx, vbidx);
      if(idx !== INT_NULL){

         const temp = new RenderQueueData;
         temp.Set(this.buffer[idx]); // Temporary store the prioritized element

         if(flag === FIRST && idx > 0){
            // Move all elements to the right
            for(let i = idx; i>0; i--){
               this.buffer[i].Set(this.buffer[i-1]);
            }
            // Store back prioritized element
            this.buffer[0].Set(temp);
         }
         else if(flag === LAST && idx<this.count-1){
            // Move all elements to the left
            for(let i = idx; i<this.count; i++){
               this.buffer[i].Set(this.buffer[i+1]);
            }
            // Store back prioritized element
            this.buffer[this.count-1].Set(temp); 
         }
      }
   }


   /**
    * INEFFICIENT.
    * But we do not care for now.
    * // TODO: Implement correctly: using bubble sort? 
    */
   SetPriorityProgram(flag, progidx){

      if(!this.count) return; // Case RenderQueue hasn't been initialized

      for (let i = 0; i < this.count; i++) {
         
         if (this.buffer[i].progidx === progidx) {
            this.SetPriority(flag, progidx, this.buffer[i].vbidx)
         }
      }
   }


   SetPrioritySwap(progs_groupidx1, progIdx1, vbIdx1, progs_groupidx2, progIdx2, vbIdx2){

      const idx1 = this.Find(progs_groupidx1, progIdx1, vbIdx1);
      const idx2 = this.Find(progs_groupidx2, progIdx2, vbIdx2);
      if(idx1 !== INT_NULL && idx2 !== INT_NULL){
         const temp = new RenderQueueData;
         temp.Set(this.buffer[idx1]); // Temporary store the prioritized element
         this.buffer[idx1].Set(this.buffer[idx2]);
         this.buffer[idx2].Set(temp);
      }
   }


   // Debug
   PrintAll() {
      console.log('--- RenderQueue All');
      for(let i=0; i<this.count; i++){
         if(this.buffer[i]) console.log(this.buffer[i]);
      }
   }


   PrintActive() {
      console.log('--- RenderQueue Active');
      console.log(this.active);
      for(let i=0; i<this.activeCount; i++){
         if(this.active[i]) console.log(this.active[i]);
      }
   }

}



const _render_queue = new RenderQueue;

export function Renderqueue_get() { return _render_queue; }



export function Renderqueue_get_active() { return _render_queue.active; }



export function Renderqueue_active_get_count() { return _render_queue.activeCount; }




export function Renderqueue_set_priority_by_program(flag, progidx) { 
   _render_queue.SetPriorityProgram(flag, progidx); 
}



// Update the active queue, when new gfx buffers have been created
export function Renderqueue_update_active_queue() { _render_queue.RebuildActiveQueue(); }



/**
 * Enable and Disable programs and vertex buffers from the draw queue.
 * It is called from the GfxVbRender function. If a vertex buffer has 
 * changed(enabled or disabled for drawing), we must add or remove
 * these programs-vertex buffers from the draw queue.
 */
export function Renderqueue_set_active(progidx, vbidx, flag){ 

   const idx = _render_queue.Find(progidx, vbidx);
   if(idx !== INT_NULL){

      _render_queue.buffer[idx].isActive = flag;
      // _render_queue.UpdateActiveQueueByIdx(idx);
      // IMPORTANT: Rebuild the queue once, if this function is called at least once
      _render_queue.RebuildActiveQueue(); // Create a new active buffer from the updated queue
   }
}



export function Renderqueue_Add(progidx, vbidx, ibidx, isActive) {
   _render_queue.Add(progidx, vbidx, ibidx, isActive);
}




export function Renderqueue_init() {
   _render_queue.Init(); // One time initialization(creates an empty buffer...)
}




