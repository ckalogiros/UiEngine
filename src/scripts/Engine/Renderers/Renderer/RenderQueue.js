"use strict";

import { Vertex_buffer_info_get_render_queueidx, Vertex_buffer_info_set_render_queueidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../Drawables/DebugInfo/DebugInfoUiNotifications.js";






const MAX_DRAWQUEUE_COUNT = 64; // Number of vertex buffers for the queue  
const NOTIFICATIONS_ON = true;



class RenderQueueData {

   progidx;
   vbidx;
   ibidx;
   queueIdx;
   // isActive;
   flags;

   constructor() {
      this.Reset();
   }


   Set(elem) {
      this.progidx = elem.progidx;
      this.vbidx = elem.vbidx;
      this.ibidx = elem.ibidx;
      this.queueIdx = elem.queueIdx;
      // this.isActive = elem.isActive;
      if (elem.isActive) this.flags |= RENDER_QUEUE_FLAGS.IS_ACTIVE;
   }


   Reset() {
      this.progidx = INT_NULL;
      this.vbidx = INT_NULL;
      this.queueIdx = INT_NULL;
      // this.isActive = false;
      this.flags = 0x0;
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


   Deactivate(vbidx) {

      const idx = Vertex_buffer_info_get_render_queueidx(vbidx);

      if (idx !== INT_NULL && idx < this.count - 1) {

         this.buffer[idx].flags &= ~RENDER_QUEUE_FLAGS.IS_ACTIVE;
         this.RebuildActiveQueue();

         Vertex_buffer_info_set_render_queueidx(vbidx, INT_NULL);
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
   }


   UpdateActiveQueueByIdx(idx) { // Recreates an array of all active vertex buffers from the draw queue on every Frame.
      this.active[this.activeCount++] = this.buffer[idx];
   }


   Add(progidx, vbidx, ibidx, isActive) {

      const obj = {
         progidx: progidx,
         vbidx: vbidx,
         ibidx: ibidx,
         queueIdx: this.count,
         isActive: isActive,
      }

      this.buffer[this.count].Set(obj);
      if (isActive === true) this.buffer[this.count].flags |= RENDER_QUEUE_FLAGS.IS_ACTIVE;
      this.count++;

      Vertex_buffer_info_set_render_queueidx(vbidx, obj.queueIdx);


      if (NOTIFICATIONS_ON)
         Notifications_send(NOTIFICATION_TYPE.RENDER_QUEUE_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, obj.queueIdx);

      // DEBUG
      if (this.count > this.size) alert('ERROR - RenderQueue buffer is FULL')
   }


   Find(progidx, vbidx) {

      if (!this.count) return INT_NULL; // Case RenderQueue hasn't been initialized
      for (let i = 0; i < this.size; i++) {
         if (this.buffer[i].vbidx === vbidx &&
            this.buffer[i].progidx === progidx) {
            return i;
         }
      }
      return INT_NULL;
   }


   FindAllBuffersFromProgram(progidx) {

      if (!this.count) return INT_NULL; // Case RenderQueue hasn't been initialized
      let idxs = [];
      for (let i = 0; i < this.size; i++) {
         if (this.buffer[i].progidx === progidx) {
            idxs.push(i);
         }
      }
      return idxs;
   }


   Swap(obj1, obj2) {

      const temp = new RenderQueueData;
      temp.Set(obj1);
      obj1.Set(obj2);
      obj2.Set(temp);
   }


   SetPriorityAll(flag, progidx, vbidx = ALL) {
      // TODO: IMPLEMENT

      const idxs = this.FindAllBuffersFromProgram(progidx);
      // const idxs = Vertex_buffer_info_get_render_queueidx(vbidx);

      for (let k = 0; k < idxs.length; k++) {

         // if((this.buffer[i].flags & RENDER_QUEUE_FLAGS.SKIP_PRIORITY)===0 && )

         if (flag === FIRST && idxs[k] > 0) {

            // Move all elements to the right
            for (let i = idxs[k]; i > 0; i--) {
               this.buffer[i].Set(this.buffer[i - 1]);
            }
            // Store back prioritized element
            this.buffer[0].Set(temp);
         }
         else if (flag === LAST && idxs[k] < this.count - 1) {

            // Move all elements to the left
            for (let i = idxs[k]; i < this.count; i++) {

               this.buffer[i].Set(this.buffer[i + 1]);
               Vertex_buffer_info_set_render_queueidx(this.buffer[i].vbidx, i + 1);
            }

            // Store back prioritized element
            this.buffer[this.count - 1].Set(temp);
            Vertex_buffer_info_set_render_queueidx(this.buffer[this.count - 1].vbidx, this.count - 1);
         }
      }

   }


   SetPriority(flag, vbidx) {

      const idx = Vertex_buffer_info_get_render_queueidx(vbidx);

      if (idx === INT_NULL) { alert('Wrong render queue index, coming from vertex buffer queueidx\nSEE console.error'); console.error('Wrong render queue index, coming from vertex buffer queueidx'); }

      const temp = new RenderQueueData;
      temp.Set(this.buffer[idx]); // Temporary store the prioritized element

      if (flag === FIRST && idx > 0) {

         // Move all elements to the right
         for (let i = idx; i > 0; i--) {

            if((this.buffer[i].flags & RENDER_QUEUE_FLAGS.SKIP_PRIORITY)===0) {

               this.buffer[i].Set(this.buffer[i - 1]);
               Vertex_buffer_info_set_render_queueidx(this.buffer[i].vbidx, i);
            }
         }

         // Store back prioritized element
         this.buffer[0].Set(temp);
         Vertex_buffer_info_set_render_queueidx(this.buffer[0].vbidx, 0);

      }
      else if (flag === LAST && idx < this.count - 1) {

         // Shift all elements to the left
         for (let i = idx; i < this.count - 1; i++) { // Leave the last element for outside the loop assignment

            this.buffer[i].Set(this.buffer[i + 1]);
            Vertex_buffer_info_set_render_queueidx(this.buffer[i].vbidx, i); // If next elem goes left, pass current index as the new vb queueidx
         }

         // Store back prioritized element
         this.buffer[this.count - 1].Set(temp);
         Vertex_buffer_info_set_render_queueidx(this.buffer[this.count - 1].vbidx, this.count - 1);
      }
   }


   SetPrioritySwap(vbIdx1, vbIdx2) {

      const idx1 = Vertex_buffer_info_get_render_queueidx(vbIdx1);
      const idx2 = Vertex_buffer_info_get_render_queueidx(vbIdx2);

      if (idx1 !== INT_NULL && idx2 !== INT_NULL) {
         const temp = new RenderQueueData;
         temp.Set(this.buffer[idx1]); // Temporary store the prioritized element
         this.buffer[idx1].Set(this.buffer[idx2]);
         this.buffer[idx2].Set(temp);
      }
   }


   // Debug
   PrintAll() {
      console.log('--- RenderQueue All');
      for (let i = 0; i < this.count; i++) {
         if (this.buffer[i]) console.log(this.buffer[i]);
      }
   }


   PrintActive() {
      console.log('--- RenderQueue Active');
      console.log(this.active);
      for (let i = 0; i < this.activeCount; i++) {
         if (this.active[i]) console.log(this.active[i]);
      }
   }

}



const _render_queue = new RenderQueue;

export function Renderqueue_get() { return _render_queue; }



export function Renderqueue_get_byidx(idx) { return _render_queue.buffer[idx]; }



export function Renderqueue_get_count() { return _render_queue.count; }



export function Renderqueue_get_size() { return _render_queue.size; }



export function Renderqueue_get_active() { return _render_queue.active; }



export function Renderqueue_active_get_count() { return _render_queue.activeCount; }



export function Renderqueue_set_priority_by_program(flag, progidx) {
   _render_queue.SetPriorityProgram(flag, progidx);
}



export function Renderqueue_set_priority_by_vb(flag, vbidx) {
   _render_queue.SetPriority(flag, vbidx);
}



// Update the active queue, when new gfx buffers have been created
export function Renderqueue_update_active_queue() { _render_queue.RebuildActiveQueue(); }



/**
 * Enable and Disable programs and vertex buffers from the draw queue.
 * It is called from the GfxVbRender function. If a vertex buffer has 
 * changed(enabled or disabled for drawing), we must add or remove
 * these programs-vertex buffers from the draw queue.
 */
export function Renderqueue_set_active(vbidx, isActive) {

   const idx = Vertex_buffer_info_get_render_queueidx(vbidx);
   if (idx !== INT_NULL) {

      if (isActive === true) _render_queue.buffer[idx].flags |= isActive;
      else if (isActive === false) _render_queue.buffer[idx].flags &= ~isActive;

      // IMPORTANT: Rebuild the queue once, if this function is called at least once
      _render_queue.RebuildActiveQueue(); // Create a new active buffer from the updated queue
   }
}



export function Renderqueue_Add(progidx, vbidx, ibidx, isActive) {
   _render_queue.Add(progidx, vbidx, ibidx, isActive);
}



export function Renderqueue_set_flags(progidx, vbidx, flags) {

   // const idx = _render_queue.(progidx, vbidx);
   const idx = Vertex_buffer_info_get_render_queueidx(vbidx);
   _render_queue.buffer[idx].flags |= flags;
}




export function Renderqueue_init() {
   _render_queue.Init(); // One time initialization(creates an empty buffer...)
}




