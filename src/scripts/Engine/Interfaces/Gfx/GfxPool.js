"use strict";


/**
 * Application: Reusability of Vertex Buffers
 * 
 * . Finds between private/nto private of Vertex Buffers
 * . Finds between different sizes of Vertex Buffers
 * . Activation/deactivation of Vertex Buffers
 * . On Vertex Buffer reallocation, decides if another fitting buffer exists
 * . Dynamic checking for best fit
 */







export function Gfx_pool_find_notActive_and_notPrivate_vb(groupidx, progidx) {

   const vbcount = _gfx_pool.buffer[groupidx].buffer[progidx].boundary;
   for (let i = 0; i < vbcount; i++) {
      const data = _gfx_pool.buffer[groupidx].buffer[progidx].buffer[i];
      if (!data.inUse && !data.isPrivate) return data;
   }
   return null;
}
