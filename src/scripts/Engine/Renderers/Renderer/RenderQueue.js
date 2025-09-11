"use strict";

import { Vertex_buffer_group_get_render_queueidx, Vertex_buffer_group_set_render_queueidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../Drawables/DebugInfo/DebugInfoUiNotifications.js";






const MAX_DRAWQUEUE_COUNT = 64; // Number of vertex buffers for the queue  
const NOTIFICATIONS_ON = true;



let _cnt = 0x1;
export const RENDER_QUEUE_FLAGS = {
	IS_ACTIVE: _cnt,
	SKIP_PRIORITY: _cnt <<= 0x1,
	NEEDS_UPDATE: _cnt <<= 0x1,
}


class RenderQueueData {

   constructor() {
      this.Reset();

   }


   Set(elem) {
      this.progidx = elem.progidx;
      this.vb_groupidx = elem.vb_groupidx,
      this.ibidx = elem.ibidx;
      this.queueIdx = elem.queueIdx;
      this.flags = elem.flags;
      if (elem.isActive) this.flags |= RENDER_QUEUE_FLAGS.IS_ACTIVE;
   }


   Reset() {
      this.progidx = INT_NULL;
      this.vb_groupidx = INT_NULL;
      this.ibidx = INT_NULL;
      this.queueIdx = INT_NULL;
      this.flags = 0x0;
   }

}



class RenderQueue {

   
   buffer = [];
   count = 0;
   size = 0;
   active = [];
   activeCount = 0;
   needs_update = false; 
   
   constructor() {
      this.size = MAX_DRAWQUEUE_COUNT;
      // this.buffer = [];
      // this.count = 0;
      // this.size = 0;
      // this.active = [];
      // this.activeCount = 0;
      // this.needs_update = false; 
   }

   
   Reset(){
      this.buffer = [];
      this.count = 0;
      this.size = MAX_DRAWQUEUE_COUNT;
      this.active = [];
      this.activeCount = 0;
      this.needs_update = false; 
   }


   Init() {

      for (let i = 0; i < this.size; i++) {
         this.buffer[i] = new RenderQueueData;
      }
   }


   RebuildActiveQueue() { // Recreates an array of all active vertex buffers from the draw queue on every Frame.

      this.activeCount = 0;
      this.active = []; // Reset curent active queue buffer

      for (let i = 0; i < this.size; i++) {

         if (this.buffer[i].flags & RENDER_QUEUE_FLAGS.IS_ACTIVE) { // recreate the active queue buffer from the renderqueue buffer 
            this.active[this.activeCount++] = this.buffer[i];
         }
      }

      // Active queuuue is updated, remove the needs update flag
      _render_queue.needs_update = false;
   }



   Add(progidx, vb_groupidx, ibidx, isActive) {

      if(this.count >= MAX_DRAWQUEUE_COUNT) alert('5412231432 \nRenderqueue buffer overflow')

      const obj = {
         progidx: progidx,
         vb_groupidx: vb_groupidx,
         ibidx: ibidx,
         queueIdx: this.count,
         // isActive: isActive,
      }

      this.buffer[this.count].Set(obj);
      if (isActive === true) this.buffer[this.count].flags |= RENDER_QUEUE_FLAGS.IS_ACTIVE;
      this.count++;

      Vertex_buffer_group_set_render_queueidx(vb_groupidx, obj.queueIdx);


      if (NOTIFICATIONS_ON)
         Notifications_send(NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, obj.queueIdx);

      // DEBUG
      if (this.count > this.size) alert('ERROR - RenderQueue buffer is FULL')

      return obj.queueIdx
   }


   Swap(obj1, obj2) {

      const temp = new RenderQueueData;
      temp.Set(obj1);
      obj1.Set(obj2);
      obj2.Set(temp);
   }


   SetPriority(flag, vb_groupidx) {

      const idx = Vertex_buffer_group_get_render_queueidx(vb_groupidx);

      if (idx === INT_NULL) { alert('Wrong render queue index, coming from vertex buffer queueidx\nSEE console.error'); console.error('Wrong render queue index, coming from vertex buffer queueidx'); }

      const temp = new RenderQueueData;
      temp.Set(this.buffer[idx]); // Temporary store the prioritized element

      if (flag === FIRST && idx > 0) {

         // Move all elements to the right
         for (let i = idx; i > 0; i--) {

            if((this.buffer[i].flags & RENDER_QUEUE_FLAGS.SKIP_PRIORITY)===0) {

               this.buffer[i].Set(this.buffer[i - 1]);
               Vertex_buffer_group_set_render_queueidx(this.buffer[i].vb_groupidx, i);
            }
         }

         // Store back prioritized element
         this.buffer[0].Set(temp);
         Vertex_buffer_group_set_render_queueidx(this.buffer[0].vb_groupidx, 0);

         // Enable renderqueue's self-update the active queue
         _render_queue.needs_update = true;
         // this.RebuildActiveQueue(); // EFFICIENCY: The rebuild should happen maximum once per frame OR via callback 
      }
      else if (flag === LAST && idx < this.count - 1) {

         // Shift all elements to the left
         for (let i = idx; i < this.count - 1; i++) { // Leave the last element for outside the loop assignment

            this.buffer[i].Set(this.buffer[i + 1]);
            Vertex_buffer_group_set_render_queueidx(this.buffer[i].vb_groupidx, i); // If next elem goes left, pass current index as the new vb queueidx
         }

         // Store back prioritized element
         this.buffer[this.count - 1].Set(temp);
         Vertex_buffer_group_set_render_queueidx(this.buffer[this.count - 1].vb_groupidx, this.count - 1);

         // Enable renderqueue's self-update the active queue
         _render_queue.needs_update = true;
         // this.RebuildActiveQueue(); // EFFICIENCY: The rebuild should happen maximum once per frame OR via callback 
      }
   }


   SetPrioritySwap(vbIdx1, vbIdx2) {

      const idx1 = Vertex_buffer_group_get_render_queueidx(vbIdx1);
      const idx2 = Vertex_buffer_group_get_render_queueidx(vbIdx2);

      if (idx1 !== INT_NULL && idx2 !== INT_NULL) {
         const temp = new RenderQueueData;
         temp.Set(this.buffer[idx1]); // Temporary store the prioritized element
         this.buffer[idx1].Set(this.buffer[idx2]);
         this.buffer[idx2].Set(temp);
      }
   }

}


/** */
const _render_queue = new RenderQueue;

/** */
export function Renderqueue_init() {
   _render_queue.Init(); // One time initialization(creates an empty buffer...)
}
/** */
export function Renderqueue_reset() {
   _render_queue.Reset();
   _render_queue.Init(); // One time initialization(creates an empty buffer...)
}
/** */
export function Renderqueue_Add(progidx, vb_groupidx, ibidx, isActive) {
   _render_queue.Add(progidx, vb_groupidx, ibidx, isActive);
}
/** */
export function Renderqueue_get() { return _render_queue; }
/** */
export function Renderqueue_get_count() { return _render_queue.activeCount; }
/** */
export function Renderqueue_get_size() { return _render_queue.size; }
/** */
export function Renderqueue_active_get_count() { return _render_queue.activeCount; }
/** */
export function Renderqueue_set_flags(vb_groupidx, flags) {

   const idx = Vertex_buffer_group_get_render_queueidx(vb_groupidx);
   _render_queue.buffer[idx].flags |= flags;
}
/** */
export function Renderqueue_get_byidx(idx) { return _render_queue.buffer[idx]; }
/** */
export function Renderqueue_get_active() { 

   if(_render_queue.needs_update) _render_queue.RebuildActiveQueue(); // Create a new active buffer from the renderqueue
   return _render_queue.active; 
}
/** */
export function Renderqueue_is_vb_active(vb_groupidx) { 

   const idx = Vertex_buffer_group_get_render_queueidx(vb_groupidx);
   if (idx !== INT_NULL) {
      return (_render_queue.buffer[idx].flags & RENDER_QUEUE_FLAGS.IS_ACTIVE);
   }
}
/** */
export function Renderqueue_set_priority_by_program(flag, progidx) {
   _render_queue.SetPriorityProgram(flag, progidx);
}
/** */
export function Renderqueue_set_priority_by_vb(flag, vb_groupidx) {
   _render_queue.SetPriority(flag, vb_groupidx);
}
/** */
// Update the active queue, when new gfx buffers have been created
export function Renderqueue_update_active_queue() { _render_queue.RebuildActiveQueue(); }
/**
 * Enable and Disable programs and vertex buffers from the draw queue.
 * It is called from the GfxVbRender function. If a vertex buffer has 
 * changed(enabled or disabled for drawing), we must add or remove
 * these programs-vertex buffers from the draw queue.
 */
export function Renderqueue_set_active(vb_groupidx, isActive) {

   const idx = Vertex_buffer_group_get_render_queueidx(vb_groupidx);
   if (idx !== INT_NULL) {

      if (isActive === true) _render_queue.buffer[idx].flags |= RENDER_QUEUE_FLAGS.IS_ACTIVE;
      else if (isActive === false) _render_queue.buffer[idx].flags &= ~RENDER_QUEUE_FLAGS.IS_ACTIVE;

      // Enable renderqueue's self-update the active queue
      _render_queue.needs_update = true;

   }

}
















/************************************************************************************************************/
// DEBUG-PRINT

/** */
export function Renderqueue_print_all(){

   console.log('--- RenderQueue All');

   const queue = _render_queue;
   for (let i = 0; i < queue.count; i++) {
      if (queue.buffer[i]) console.log(queue.buffer[i]);
   }
}
/** */
export function Renderqueue_print_active(){
   
   console.log('--- RenderQueue Active');

   const queue = _render_queue;
   for (let i = 0; i < queue.activeCount; i++) {
      if (queue.active[i]) console.log(queue.active[i]);
   }
}