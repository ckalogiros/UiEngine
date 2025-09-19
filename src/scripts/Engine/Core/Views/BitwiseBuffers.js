"use strict";

import { Bitwise64_opps_clear_bit, Bitwise64_opps_retrieve_bit, Bitwise64_opps_set_bit } from "../BitwiseOps/Bitwise64Ops.js";


const i64 = 64;

class Uint64_Buffer {


   constructor(size = 1, debug_name) {

      this.size = ~~(size/i64) + 1;
      this.bitsize = size;


      this.buffer = new BigUint64Array(this.size);
      this.boundary = INT_NULL;
      this.active_count = 0;
      this.freeidx = 0;
      this.reserveidx = INT_NULL;
      for (let i = 0; i < this.size; i++)
         this.buffer[i] = 0n;


      /** ONLY FOR DEBUGING INFO */
      this.debug_name = `UINT64 buffer:${debug_name}`;

   }

   AddAtIndex(index) {

      const idx = ~~(index/i64); // Buffer index
      const sub_idx = index%i64; // 64bit index position

      // Store 1bit value to bit 'sub_idx' position
      // this.buffer[idx] = Bitwise64_opps_set_bit(this.buffer[idx], BigInt(sub_idx)+1n);
      this.buffer[idx] = Bitwise64_opps_set_bit(this.buffer[idx], BigInt(sub_idx));

      
      // console.log('UINT64 ADD', 
      //    'index', index, 
      //    'idx', idx, 
      //    'sub_idx', sub_idx,
      //    'bin', this.buffer[idx].toString(2),
      // )

   }
   Remove(index) {
      
      
      const idx = ~~(index/i64); // Buffer index
      const sub_idx = index%i64; // 64bit index position
      
      // Store 1bit value to bit 'sub_idx' position
      this.buffer[idx] = Bitwise64_opps_clear_bit(this.buffer[idx], BigInt(sub_idx));
      
      // console.log('UINT64 REMOVE', 
      //    'index', index, 
      //    'idx', idx, 
      //    'sub_idx', sub_idx,
      //    'bin', this.buffer[idx].toString(2),
      // )
   }

   Retrieve(index) {

      const idx = ~~(index/i64); // Buffer index
      const sub_idx = index%i64; // 64bit index position
      
      // Store 1bit value to bit 'sub_idx' position
      return Bitwise64_opps_retrieve_bit(this.buffer[idx], BigInt(sub_idx));
   }


}


/** */
export function New_uint64_buffer(size=1, debug_name='INT64 DEBUB UNAMED') {
   return new Uint64_Buffer(size, debug_name);
}
/** */
export function Free_uint64_buffer(buffer){
   if(!buffer || buffer===_) {
      console.error('7155431200918770. Free buffer:Buffer is null ');
      return;
   }
   buffer = null;
}
