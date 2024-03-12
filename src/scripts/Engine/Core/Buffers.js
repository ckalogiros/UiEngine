"use strict";

class Buffer_Interface {

   buffer;
   boundary; // Counts how many elements from start until last element. (Some elements in between could be null)
   active_count; // Counts how many elements are not null
   size;
   reserveidx; // An int value to store a reserved element for later use.

   constructor(m_buffer = null) {

      this.buffer = null;
      this.boundary = 0;
      this.active_count = 0;
      this.size = INT_NULL;
      this.reserveidx = INT_NULL;

      if (m_buffer)
         return this.Copy(m_buffer);
   }


   Add(elem) {

      const idx = this.#GetNextFree();
      this.buffer[idx] = elem;
      this.active_count++;
      return idx;
   }


   Reset() {

      this.size = INT_NULL;
      this.boundary = 0;
      this.active_count = 0;
      this.buffer = [];
   }


   Copy(m_buffer) {

      this.size = m_buffer.size;
      this.buffer = new Array(this.size);

      if (m_buffer instanceof Buffer_Interface) {

         for (let i = 0; i < m_buffer.boundary; i++) {

            this.buffer[i] = m_buffer.buffer[i];
            this.boundary++;
            this.active_count++;
         }

         return this;
      }
      return null;
   }


   RemoveByIdx(idx) {

      /**DEBUG ERROR*/ if (idx < 0 || idx > this.size - 1) {

         console.error('Index Out of bounds. @ M_Buffer.RemoveByIdx().\n idx:', idx, 'size', this.size)
         // alert('Index Out of bounds. @ M_Buffer.RemoveByIdx().')
         return;
      }

      if (this.buffer[idx] !== null) {

         /**
          * In this implementation of buffer, we run 
          * the loops until boundary and not until size. 
          * For this to work, we can only decrement boundary
          * if all next elements are not used.
          * All we are doing is 
          * to have the boundary at the last used element of the buffer.
          */

         this.buffer[idx] = null;
         this.active_count--;

         if (this.boundary === 1) {
            this.boundary = 0;
            return;
         }

         else {
            const boundary = this.boundary + 1;
            for (let i = boundary; i > 0; i--) {

               if (this.buffer[this.boundary - 1] || this.boundary === 0) break;
               this.boundary--;
            }
         }

         if (this.boundary === INT_NULL) alert('M_Buffer boundary = -1')
         ERROR_NULL(this.active_count);
      }
   }


   #GetNextFree() {

      if (this.boundary >= this.size) {

         this.Realloc(); // buffer is full.
         const freeIdx = this.boundary++;
         return freeIdx;
      }

      // We run until boundary and not size (the whole buffer) 
      // since boundary does not decrement (on remove) below the last element's index.
      // Sample buffer: [null, null, null, elem, 'empty', empty], count=1, boundary=4, size=6
      for (let i = 0; i <= this.boundary; i++) {

         if (!this.buffer[i]) { // BUG: What if the buffer[i] is an index with value 0 ????????????

            // Increment boundary only if the free element is after the last stored element in the buffer.
            if (i >= this.boundary) this.boundary++; {
               return i;
            }
         }
      }
   }


   Reserve() {

      if (this.boundary >= this.size) {

         this.Realloc(); // buffer is full.
         const freeIdx = this.boundary++;
         this.reserveidx = freeIdx;
      }
      else{
         for (let i = 0; i <= this.boundary; i++) {
   
            if (!this.buffer[i]) { // BUG: What if the buffer[i] is an index with value 0 ????????????
               // Increment boundary only if the free element is after the last stored element in the buffer.
               if (i >= this.boundary) this.boundary++; {
                  this.reserveidx = i;
                  break;
               }
            }
         }
      }


      this.buffer[this.reserveidx] = true;
      this.active_count++;

      return this.reserveidx;
   }


   AddAtReservedIndex(idx, elem) {

      this.buffer[idx] = elem;
      return idx;
   }


   CopyBufferElements(oldData) {

      const size = oldData.length;
      for (let i = 0; i < size; i++) {
         this.buffer[i] = oldData[i];
      }
   }


   /** Debug */
   Print() {
      console.log('Count: ', this.boundary)
      console.log(this.buffer)
   }
}






// IMPORTANT: DO NOT USE M_BUFFER CLASS AS AN ARRAY OF INTEGERS, UNTIL CORRECT IMPLEMENTATION. SEE BUG AT 'Buffer_Interface, GetNextFree()'.
export class M_Buffer extends Buffer_Interface {

   constructor(m_buffer) {

      super(m_buffer);
   }

   Init(size, struct = null) {

      this.size = size;
      this.buffer = new Array(size);

      for (let i = 0; i < size; i++) {
         this.buffer[i] = struct;
      }
   }


   Realloc() {

      if (this.size <= 0) {
         this.size = 1;
      }
      else this.size *= 2;

      const oldData = this.buffer;
      this.buffer = new Array(this.size);

      if (oldData) this.CopyBufferElements(oldData)
      // console.warn('Resizing M_Buffer!', this.size)
   }


   AddAtIndex(idx, elem) {
      if (idx < 0 || idx >= this.size) console.error('WRONG Index. Adding item at: ', idx, ' with size:', this.size)

      this.buffer[idx] = elem;
      this.active_count++;
      if (idx >= this.boundary) this.boundary = idx + 1;

      return idx;
   }

}







export class ArrayBufferInterface {

   buffer;
   boundary; // Counts how many elements from start until last element. (Some elements in between could be null)
   active_count; // Counts how many elements are not null
   size;
   reserveidx; // An int value to store a reserved element for later use.

   constructor(size=0) {

      this.buffer = null;
      this.boundary = 0;
      this.active_count = 0;
      this.size = size;
      this.reserveidx = INT_NULL;

   }


   Add(int) {

      const idx = this.GetNextFree();
      this.buffer[idx] = int;
      this.active_count++;
      return idx;
   }


   GetNextFree() {

      if (this.boundary >= this.size) {

         this.Realloc(); // buffer is full.
         const freeIdx = this.boundary++;
         return freeIdx;
      }

      // We run until boundary and not size (the whole buffer) 
      // since boundary does not decrement (on remove) below the last element's index.
      // Sample buffer: [null, null, null, elem, 'empty', empty], count=1, boundary=4, size=6
      for (let i = 0; i <= this.boundary; i++) {
         if (this.buffer[i] === INT_NULL) {
            // Increment boundary only if the free element is after the last stored element in the buffer.
            if (i >= this.boundary) this.boundary++;
            return i;
         }
      }
   }


   Reset() {

      this.size = INT_NULL;
      this.boundary = 0;
      this.active_count = 0;
      this.buffer = null;
   }


   RemoveByIdx(idx) {

      if (this.buffer[idx] !== INT_NULL) {

         this.buffer[idx] = INT_NULL;
         this.active_count--;
         this.ShortReplaceWithLast(idx)

         if (this.boundary <= INT_NULL) alert('M_Buffer boundary <= -1');
         if (this.active_count <= INT_NULL) alert('M_Buffer active_count <= -1');

      }
   }


   ShortReplaceWithLast(removed_idx){
      
      let cur = removed_idx;
      let last = this.boundary-1;
      // REPLACE
      this.buffer[cur] = this.buffer[last];
      // REMOVE LAST
      this.buffer[last] = INT_NULL;
      this.boundary--;
   }

   
   ShortShiftOne(removed_idx){

      // SHIFT
      let cur = removed_idx;
      let next = cur+1;
      for (next = removed_idx+1; next<this.boundary; next++, cur++) {

         this.buffer[cur] = this.buffer[next];
      }
      // this.active_count--;
      this.boundary--;
      console.log('Short:', this.boundary, this.active_count)

      // REMOVE LAST
      this.buffer[next-1] = INT_NULL;
   }

   CopyBufferElements(oldData) {

      const size = oldData.length;
      for (let i = 0; i < size; i++) {
         this.buffer[i] = oldData[i];
      }
   }

}



// TODO: Instead use Uint8 and set the NULL value with uin8_max: 255-0xff
export class Int8Buffer extends ArrayBufferInterface {

   constructor(size = 0) {

      super();
      this.size = size;
   }


   Init(val) {

      if (!this.buffer) this.buffer = new Int8Array(this.size)
      for (let i = 0; i < this.size; i++) {
         this.buffer[i] = val;

      }
   }


   Add(int) {

      const idx = this.GetNextFree();
      this.buffer[idx] = int;
      this.active_count++;
      return idx;
   }


   GetNextFree() {

      if (this.boundary >= this.size) {

         this.Realloc(); // buffer is full.
         const freeIdx = this.boundary++;
         return freeIdx;
      }

      // We run until boundary and not size (the whole buffer) 
      // since boundary does not decrement (on remove) below the last element's index.
      // Sample buffer: [null, null, null, elem, 'empty', empty], count=1, boundary=4, size=6
      for (let i = 0; i <= this.boundary; i++) {
         if (this.buffer[i] === INT_NULL) {
            // Increment boundary only if the free element is after the last stored element in the buffer.
            if (i >= this.boundary) this.boundary++;
            return i;
         }
      }

      console.error('GetNextFree() DID NOT FIND A FREE ELEMENT TO INSERT TO. @ class Int8Buffer')
   }


   // TODO: Maybe implement growing algorithm to be NOT doubling but just big enough
   Realloc() {

      const old_size = this.size;

      if (this.size <= 0) {
         this.size = 1;
      }
      else this.size *= 2;

      const oldData = this.buffer;
      this.buffer = new Int8Array(this.size);

      if (oldData) this.CopyBufferElements(oldData)

      // Initialize the rest of buffer.
      for (let i = old_size; i < this.size; i++) {
         this.buffer[i] = INT_NULL;
      }
      // console.warn('Resizing Int8Buffer!')
   }


   Reset() {

      this.size = INT_NULL;
      this.boundary = 0;
      this.active_count = 0;
      this.buffer = null;
   }

   
   AddAtIndex(idx, elem) {
      if (idx < 0 || idx >= this.size) 
      console.error('WRONG Index. Adding item at: ', idx, ' with size:', this.size)

      this.buffer[idx] = elem;
      this.active_count++;
      if (idx >= this.boundary) this.boundary = idx + 1;

      return idx;
   }


   RemoveByIdx(idx) {

      if (this.buffer[idx] !== INT_NULL) {

         this.buffer[idx] = INT_NULL;
         this.active_count--;

         if (this.boundary === 1) {
            this.boundary = 0;
            return;
         }
         else {
            const boundary = this.boundary + 1;
            for (let i = boundary; i > 0; i--) {

               if (this.buffer[this.boundary - 1] !== INT_NULL || this.boundary === 0) break;
               this.boundary--;
            }
         }

         if (this.boundary === INT_NULL) alert('M_Buffer boundary = -1')
         ERROR_NULL(this.active_count);
      }
   }

}



export class Uint8Buffer extends Buffer_Interface {

   constructor(size = 0) {

      super();
      this.size = size;
   }


   Init(val) {

      if (!this.buffer) this.buffer = new Uint8Array(this.size)
      for (let i = 0; i < this.size; i++) {
         this.buffer[i] = val;

      }
   }


   Add(int) {

      const idx = this.GetNextFree();
      this.buffer[idx] = int;
      this.active_count++;
      return idx;
   }


   GetNextFree() {

      if (this.boundary >= this.size) {

         this.Realloc(); // buffer is full.
         const freeIdx = this.boundary++;
         return freeIdx;
      }

      // We run until boundary and not size (the whole buffer) 
      // since boundary does not decrement (on remove) below the last element's index.
      // Sample buffer: [null, null, null, elem, 'empty', empty], count=1, boundary=4, size=6
      for (let i = 0; i <= this.boundary; i++) {
         if (this.buffer[i] === INT_NULL) {
            // Increment boundary only if the free element is after the last stored element in the buffer.
            if (i >= this.boundary) this.boundary++;
            return i;
         }
      }

      console.error('GetNextFree() DID NOT FIND A FREE ELEMENT TO INSERT TO. @ class Int8Buffer')
   }


   // TODO: Maybe implement growing algorithm to be NOT doubling but just big enough
   Realloc() {

      const old_size = this.size;

      if (this.size <= 0) {
         this.size = 1;
      }
      else this.size *= 2;

      const oldData = this.buffer;
      this.buffer = new Uint8Array(this.size);

      if (oldData) this.CopyBufferElements(oldData)

      // Initialize the rest of buffer.
      for (let i = old_size; i < this.size; i++) {
         this.buffer[i] = INT_NULL;
      }
      // console.warn('Resizing Int8Buffer!')
   }


   Reset() {

      this.size = INT_NULL;
      this.boundary = 0;
      this.active_count = 0;
      this.buffer = null;
   }

   
   AddAtIndex(idx, elem) {
      if (idx < 0 || idx >= this.size) 
      console.error('WRONG Index. Adding item at: ', idx, ' with size:', this.size)

      this.buffer[idx] = elem;
      this.active_count++;
      if (idx >= this.boundary) this.boundary = idx + 1;

      return idx;
   }


   RemoveByIdx(idx) {

      if (this.buffer[idx] !== INT_NULL) {

         this.buffer[idx] = INT_NULL;
         this.active_count--;

         if (this.boundary === 1) {
            this.boundary = 0;
            return;
         }
         else {
            const boundary = this.boundary + 1;
            for (let i = boundary; i > 0; i--) {

               if (this.buffer[this.boundary - 1] !== INT_NULL || this.boundary === 0) break;
               this.boundary--;
            }
         }

         if (this.boundary === INT_NULL) alert('M_Buffer boundary = -1')
         ERROR_NULL(this.active_count);
      }
   }


}



export class Int16Buffer extends ArrayBufferInterface {

   constructor(size = 0) {

      super();
      this.size = size;
   }


   Init(val) {

      if (!this.buffer) this.buffer = new Int16Array(this.size)
      for (let i = 0; i < this.size; i++)
         this.buffer[i] = val;
   }


   // Add(int) {

   //    const idx = this.GetNextFree();
   //    this.buffer[idx] = int;
   //    this.active_count++;
   //    return idx;
   // }


   // GetNextFree() {

   //    if (this.boundary >= this.size) {

   //       this.Realloc(); // buffer is full.
   //       const freeIdx = this.boundary++;
   //       return freeIdx;
   //    }

   //    // We run until boundary and not size (the whole buffer) 
   //    // since boundary does not decrement (on remove) below the last element's index.
   //    // Sample buffer: [null, null, null, elem, 'empty', empty], count=1, boundary=4, size=6
   //    for (let i = 0; i <= this.boundary; i++) {
   //       if (this.buffer[i] === INT_NULL) {
   //          // Increment boundary only if the free element is after the last stored element in the buffer.
   //          if (i >= this.boundary) this.boundary++;
   //          return i;
   //       }
   //    }
   // }


   // TODO: Maybe implement growing algorithm to be NOT doubling but just big enough
   Realloc() {

      const old_size = this.size;

      if (this.size <= 0) {
         this.size = 1;
      }
      else this.size *= 2;

      const oldData = this.buffer;
      this.buffer = new Int16Array(this.size);

      if (oldData) { // Copy any old data
         this.CopyBufferElements(oldData);
      }

      // Initialize the rest of buffer.
      for (let i = old_size; i < this.size; i++) {
         this.buffer[i] = INT_NULL;
      }
      // console.warn('Resizing Int8Buffer!')
   }


   // Reset() {

   //    this.size = INT_NULL;
   //    this.boundary = 0;
   //    this.active_count = 0;
   //    this.buffer = null;
   // }


   // RemoveByIdx(idx) {

   //    if (this.buffer[idx] !== INT_NULL) {

   //       this.buffer[idx] = INT_NULL;
   //       this.active_count--;
   //       this.ShortReplaceWithLast(idx)

   //       // if (this.boundary === 1) {
   //       //    this.boundary = 0;
   //       //    return;
   //       // }
   //       // else {
   //       //    const boundary = this.boundary;
   //       //    for (let i = boundary; i > 0; i--) {

   //       //       if (this.buffer[this.boundary - 1] !== INT_NULL || this.boundary === 0) break;
   //       //       this.boundary--;
   //       //    }
   //       // }

   //       // console.log('Remove:', this.boundary, this.active_count)

   //       if (this.boundary === INT_NULL) alert('M_Buffer boundary = -1')
   //       ERROR_NULL(this.active_count);
   //    }
   // }

   // ShortReplaceWithLast(removed_idx){
      
   //    let cur = removed_idx;
   //    let last = this.boundary-1;
   //    // REPLACE
   //    this.buffer[cur] = this.buffer[last];
   //    // REMOVE LAST
   //    this.buffer[last] = INT_NULL;
   //    this.boundary--;
   // }

   // ShortShiftOne(removed_idx){

   //    // SHIFT
   //    let cur = removed_idx;
   //    let next = cur+1;
   //    for (next = removed_idx+1; next<this.boundary; next++, cur++) {

   //       this.buffer[cur] = this.buffer[next];
   //    }
   //    // this.active_count--;
   //    this.boundary--;
   //    console.log('Short:', this.boundary, this.active_count)

   //    // REMOVE LAST
   //    this.buffer[next-1] = INT_NULL;
   // }

}



// export class Int8_2DBuffer {

//    buffer;
//    boundary; // CAUTION! Do not rely on the boundary variable. Its use is only for counting how many alements are in use(1 boundary for both rows and columns).
//    size;
//    numcols;

//    constructor(numrows = 0, numcols = 0) {

//       this.size = numcols * numrows;
//       this.numcols = numcols;
//       if (ERROR_NULL(this.size)) alert('Must initialize Int8_2dBuffer with a size > 1');

//       this.buffer = new Int8Array(this.size);
//       this.boundary = 0;

//       this.Init(INT_NULL);
//    }


//    Init(val) {
//       for (let i = 0; i < this.size; i++) {
//          this.buffer[i] = val;
//       }
//    }


//    Add(rowidx, val) {

//       const idx = this.GetNextFree(rowidx);
//       if (idx !== INT_NULL) {
//          this.buffer[idx] = val;
//          this.boundary++;
//       }
//    }


//    GetElem(rowidx, colidx) {
//       return this.buffer[this.numcols * rowidx + colidx];
//    }


//    GetRow(rowidx) {
//       const row = [];
//       for (let i = 0; i < this.numcols; i++) {

//          const idx = this.numcols * rowidx + i;

//          if (this.buffer[idx] !== INT_NULL)
//             row[i] = this.buffer[idx];
//       }
//       return row;
//    }


//    GetNextFree(rowidx) {

//       for (let i = 0; i <= this.size; i++) {

//          const idx = this.numcols * rowidx + i;
//          if (this.buffer[idx] === INT_NULL) {
//             return idx;
//          }
//       }
//       return INT_NULL;
//    }


//    RemoveByIdx(rowidx, i) {

//       const idx = this.numcols * rowidx + i;

//       if (idx > INT_NULL && idx < this.size) {
//          this.buffer[idx] = INT_NULL;
//          this.boundary--;
//       }
//    }


//    RemoveAll() {

//       for (let i = 0; i <= this.size; i++)
//          this.buffer[i] = INT_NULL
//       this.boundary = 0;
//    }


//    /** Debug */
//    Print() {
//       console.log('Count: ', this.boundary)
//       console.log(this.buffer)
//    }

// }


