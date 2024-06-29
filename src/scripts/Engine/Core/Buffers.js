"use strict";



// TODO: Implement all Realloc() functions growing algorithm. NOT doubling but just big enough

// TODO: Correct the Init logic of 'Buffer_Interface' and 'M_Buffer'. Currently if object is passed and elements are initialized, the boundary remains 0. 








/**********************************************************************************************************************************************/
// Array Buffers
/**********************************************************************************************************************************************/

let dubg = 0;
export class ArrayBufferInterface {


   constructor() {

      this.buffer = null;
      this.boundary = INT_NULL;
      this.active_count = 0;
      this.size = INT_NULL;
      this.freeidx = this.freeidx;
      this.reserveidx = INT_NULL;

      /** ONLY FOR DEBUGING INFO */
      this.debug_name = null;

   }

   Add(elem) {

      if (this.freeidx !== INT_NULL) {

         this.buffer[this.freeidx] = elem;
         this.active_count++;
         if (this.freeidx > this.boundary) this.boundary = this.freeidx;
         const idx = this.freeidx;
         this.freeidx = INT_NULL;
         return idx;
      }


      const idx = this.GetNextFree();
      this.buffer[idx] = elem;
      this.active_count++;
      return idx;
   }


   AddAtIndex(idx, elem) {

      if (idx < 0) console.error('SEVERE_ERROR.\nWRONG Index. Adding item at: ', idx);

      // Realloc
      if (idx >= this.size) {
         this.Realloc(); // buffer is full.
         this.boundary = idx; // Assuming after the realloc, the max-used elem is the 'idx' we just used to store
         this.active_count++;
      }
      else if (idx > this.boundary) {
         this.boundary = idx;
         this.active_count++;
      }

      this.buffer[idx] = elem; // We need to add At index

      return idx;
   }


   GetNextFree() {

      if (this.active_count >= this.size) {
         const idx = this.Realloc(); // buffer is full.
         this.boundary = idx;

         return idx;
      }

      for (let i = 0; i < this.size; i++) {

         if (this.buffer[i] === INT_NULL) {

            // Increment boundary only if the free element is after the last stored element in the buffer.
            if (i > this.boundary) this.boundary = i;

            return i;
         }
      }
   }

   Reset() {
      // INFO: Size is responsible for reallocation, so it shouldn't be reseted
      DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE -= this.size-1;
      this.boundary = -1;
      this.active_count = 0;
      this.buffer[0] = INT_NULL;
      this.freeidx = 0;
      this.reserveidx = INT_NULL;
   }



   CopyFromBufferToStart(oldData) {

      const size = oldData.length;
      for (let i = 0; i < size; i++) {
         this.buffer[i] = oldData[i];
      }

   }



}







































/**********************************************************************************************************************************************/
// Int8
/**********************************************************************************************************************************************/
// TODO: Instead use Uint8 and set the NULL value with uin8_max: 255-0xff
export class Int8Buffer extends ArrayBufferInterface {


   constructor(size = 1, debug_name) {

      super();
      this.size = size;
      this.buffer = new Int8Array(this.size);
      this.boundary = INT_NULL;
      this.freeidx = 0;
      for (let i = 0; i < this.size; i++)
         this.buffer[i] = INT_NULL;

      this.debug_name = debug_name;
   }

   Realloc() {

      DEBUG_INFO_STRUCTS.BUFFER.INT8.TOTAL_BUFFER_SIZE -= this.size;
      const old_size = this.size;
      this.size *= 2;
      DEBUG_INFO_STRUCTS.BUFFER.INT8.TOTAL_BUFFER_SIZE += this.size;

      const oldData = this.buffer;
      this.buffer = new Int8Array(this.size);

      if (oldData) this.CopyFromBufferToStart(oldData)

      // Initialize the rest of buffer.
      for (let i = old_size; i < this.size; i++) {
         this.buffer[i] = INT_NULL;
      }

      return old_size; // The new empty index.
   }


   RemoveByIdxSortedVersion(idx, debug_id, debug_name) {

      if (this.buffer[idx] !== INT_NULL) {

         this.buffer[idx] = INT_NULL;
         this.active_count--;

         const replacer_data = this.#ShortReplaceWithLast(idx);

         if (this.active_count <= INT_NULL){
            console.error(idx, debug_id, debug_name, this)
            alert('SEVERE_ERROR.\nRemoveByIdxSortedVersion().\nInt8Buffer active_count <= -1');
         }

         return replacer_data;

      }

      return INT_NULL
   }


   /**Returns -1 if there was no replacment(the removed element happens to be last) */
   #ShortReplaceWithLast(removed_idx) {

      if (removed_idx !== this.boundary) { // Handle removing any elements except the last

         // REPLACE WITH LAST ELEM
         this.buffer[removed_idx] = this.buffer[this.boundary];
         // REMOVE LAST
         this.buffer[this.boundary] = INT_NULL;

         this.boundary--;
         const replacer_data = this.buffer[removed_idx];
         return replacer_data;
      }
      else { // Remove last does not need sorting
         this.boundary--;
         return INT_NULL; // Shows that there was no element move
      }
   }

}



export function New_int8_buffer(size=1, debug_name='INT8 DEBUB UNAMED') {

   DEBUG_INFO_STRUCTS.BUFFER.INT8.BUFFER_COUNT++;
   DEBUG_INFO_STRUCTS.BUFFER.INT8.TOTAL_BUFFER_SIZE+=size;
   // console.log('MemAlloc idx', debug_name, 'size', size)
   return new Int8Buffer(size, debug_name);
}


export function Free_int8_buffer(buffer){

   DEBUG_INFO_STRUCTS.BUFFER.INT8.TOTAL_BUFFER_SIZE -= buffer.size;
   DEBUG_INFO_STRUCTS.BUFFER.INT8.BUFFER_COUNT--;
   // DEBUG_INFO_STRUCTS.BUFFER.INT8.BUFFER_COUNT = 0;
   // console.log('Mem-DE-Alloc', buffer.debug_name, 'size', buffer.size)
   buffer = null;
}














































/**********************************************************************************************************************************************/
// Int16
/**********************************************************************************************************************************************/
export class Int16Buffer extends ArrayBufferInterface {


   constructor(size = 1, debug_name) {

      super();
      this.size = size;
      this.buffer = new Int16Array(this.size);
      this.boundary = INT_NULL;
      this.freeidx = 0;
      for (let i = 0; i < this.size; i++)
         this.buffer[i] = INT_NULL;

      this.debug_name = debug_name;
   }


   Realloc() {

      DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE -= this.size;
      const old_size = this.size;

      if (this.size < 2) this.size *= 2 + 1;
      else this.size *= 2;
      DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE += this.size;
      // console.log('0000', DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE, this.size)

      const oldData = this.buffer;
      this.buffer = new Int16Array(this.size);

      this.CopyFromBufferToStart(oldData);

      // Initialize the rest of buffer.
      for (let i = old_size; i < this.size; i++) {
         this.buffer[i] = INT_NULL;
      }

      return old_size; // The new empty index. 
   }



   RemoveByIdx(idx) {

      if (this.buffer[idx] !== INT_NULL) {

         this.buffer[idx] = INT_NULL;
         this.active_count--;
         if (idx === this.boundary) this.boundary--; // Case the we removed the last element in existance


         // Check if previous elements are empty, and reduce boundary to the last active.
         const boundary = this.boundary;
         for (let i = boundary; i > 0; i--) {

            if (this.buffer[this.boundary] !== null) break;
            this.boundary--;
         }
         if (this.boundary < INT_NULL) alert('M_Buffer boundary = -1')
         ERROR_NULL(this.active_count);

         if (this.active_count === 0) this.boundary = INT_NULL

         // Set freeidx
         this.freeidx = idx;
      }
   }


   /** Fast Remove Last Item. Caller is responsible of making sure at least one element exists. No check happens */
   RemoveByIdxSortedVersionLastElemGuarantee() {

      this.buffer[this.boundary] = INT_NULL;
      this.boundary--;
      this.active_count--;
      /**Debug */ if(this.boundary < INT_NULL) alert('0-Boundary is out of bounds\nBoundary <= -2');
   }


   RemoveByIdxSortedVersion(idx, debug_id, debug_name) {

      if (this.buffer[idx] !== INT_NULL) {

         this.buffer[idx] = INT_NULL;
         this.active_count--;

         const replacer_data = this.#ShortReplaceWithLast(idx);

         if (this.active_count <= INT_NULL){
            console.error(idx, debug_id, debug_name, this)
            alert('SEVERE_ERROR.\nRemoveByIdxSortedVersion().\nInt16Buffer active_count <= -1');
         }

         return replacer_data;

      }

      return INT_NULL
   }


   /**Returns -1 if there was no replacment(the removed element happens to be last) */
   #ShortReplaceWithLast(removed_idx) {

      if (removed_idx !== this.boundary) { // Handle removing any elements except the last

         // REPLACE WITH LAST ELEM
         this.buffer[removed_idx] = this.buffer[this.boundary];
         // REMOVE LAST
         this.buffer[this.boundary] = INT_NULL;

         this.boundary--;
         const replacer_data = this.buffer[removed_idx];
         return replacer_data;
      }
      else { // Remove last does not need sorting
         this.boundary--;
         return INT_NULL; // Shows that there was no element move
      }
   }
}



export function New_int16_buffer(size=1, debug_name='INT16 DEBUB UNAMED') {

   DEBUG_INFO_STRUCTS.BUFFER.INT16.BUFFER_COUNT++;
   DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE += size;
   // console.log('MemAlloc idx', debug_name, 'size', size)
   // console.error('ppppppppppppppppppp', debug_name)
   return new Int16Buffer(size, debug_name);
}



export function Free_int16_buffer(buffer){
   
   DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE -= buffer.size;
   DEBUG_INFO_STRUCTS.BUFFER.INT16.BUFFER_COUNT--;
   // console.warn('ppppppppppppppppppp', buffer.debug_name)
   // console.log('Mem-DE-Alloc', buffer.debug_name, 'size', buffer.size)
   buffer = null;
}







/**********************************************************************************************************************************************/
// Int8 2D
/**********************************************************************************************************************************************/
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





















































/**********************************************************************************************************************************************/
// Generic Array
/**********************************************************************************************************************************************/

// IMPORTANT: DO NOT USE M_BUFFER CLASS AS AN ARRAY OF INTEGERS, UNTIL CORRECT IMPLEMENTATION. SEE BUG AT 'Buffer_Interface, GetNextFree()'.
export class M_Buffer {

   buffer;
   boundary;      // Points to the last active element.. (Some elements in between could be null)
   active_count;  // The total active elements.
   size;          // Buffer size.
   reserveidx;    // An int value to store a reserved element for later use.


   constructor(m_buffer = null, plus) {

      this.buffer = [];
      this.buffer[0] = null;
      this.boundary = -1;
      this.active_count = 0;
      this.size = 1;
      this.reserveidx = INT_NULL;
      
      this.free_buffer = New_int16_buffer(8, 'M_Buffer-free_buffer+++'+plus); // Buffer to store the in between freed elements. (NOT free from last element to buffer size)
      for(let i=0; i<8; i++){
         this.free_buffer.buffer[i] = INT_NULL;
      }

      /**DEBUG*/this.buffer_container_idx = INT_NULL; // Store 'this' index of the container buffer. Only for debug 

      if (m_buffer)
         return this.Copy(m_buffer);

      
      this.TEMP_ID = dubg++;
   }


   Init(size, struct = null) {

      this.size = size;
      this.buffer = new Array(size);

      for (let i = 0; i < size; i++) {
         this.buffer[i] = struct;
         DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT++; //console.error('Init')
      }

      DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE += this.size;
   }


   Add(elem) {

      const idx = this.GetNextFree();
      this.buffer[idx] = elem;
      this.active_count++;
      DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT++;  //console.error('Add')
      return idx;
   }


   GetNextFree() {

      // Case the free buffer has a free index to the buffer
      if(this.free_buffer.boundary > INT_NULL &&
         this.free_buffer.buffer[this.free_buffer.boundary] !== INT_NULL){

         const idx = this.free_buffer.buffer[this.free_buffer.boundary];
         this.free_buffer.RemoveByIdxSortedVersionLastElemGuarantee();
         
         if(idx > this.boundary) this.boundary = idx;
         return idx;
      }

      // Case there is an element beyond .boundary, which denotes the last used element.
      if(this.boundary+1 < this.size){
         this.boundary++;
         return this.boundary;
      }
      else if(this.boundary+1 >= this.size){ // No free space left, Realloc
         const idx = this.Realloc(); // Returns the first free elem index
         this.boundary = idx;
         return idx;
      }

      alert('Buffers.js, GetNextFree(). New element not found')
   }


   Realloc() {

      DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE -= this.size;
      const idx = this.size;
      this.size *= 2;
      DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE += this.size;

      let oldData = this.buffer;
      this.buffer = new Array(this.size);

      if (oldData) this.CopyFromBufferToStart(oldData);


      if (idx < 1) alert('Buffers.js, Realloc()');
      oldData = null
      return idx;

   }


   ResetFull() {

      // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT -= this.active_count;

      this.boundary = -1;
      this.active_count = 0;
      this.buffer = [];
      this.buffer[0] = null;
      this.reserveidx = INT_NULL;
      this.free_buffer.Reset();

   }


   Reset() {

      // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT -= this.active_count;
      
      this.boundary = -1;
      this.active_count = 0;
      this.reserveidx = INT_NULL;
      this.free_buffer.Reset();
   }


   Copy(m_buffer) {

      this.size = m_buffer.size;
      this.buffer = new Array(this.size);

      if (m_buffer instanceof M_Buffer) {

         for (let i = 0; i <= m_buffer.boundary; i++) {

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
         return;
      }

      if (this.buffer[idx] !== null) {
         
         // Add the free elements to the free buffer
         if(idx <= this.boundary){
            this.free_buffer.Add(idx);
         }

         this.buffer[idx] = null;
         this.active_count--;
         if (idx === this.boundary) this.boundary--; // Case the we removed the last element in existance


         // Check if previous elements are empty, and reduce boundary to the last active.
         const boundary = this.boundary;
         for (let i = boundary; i > 0; i--) {

            if (this.buffer[this.boundary] !== null) break;
            this.boundary--;
         }
         if (this.boundary < INT_NULL) alert('M_Buffer boundary = -1')
         ERROR_NULL(this.active_count);

         if (this.active_count === 0) this.boundary = INT_NULL


         DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT--; //console.warn('RemoveByIdx')

      }
   }


   Reserve() {

      const idx = this.GetNextFree();
      this.reserveidx = idx;
      this.buffer[idx] = true;
      this.active_count++;
      return this.reserveidx;

   }


   AddAtReservedIndex(idx, elem) {

      this.buffer[idx] = elem;
      this.reserveidx = INT_NULL;
      DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT++; //console.error('AddAtReservedIndex')
      
      return idx;
   }


   AddAtIndex(idx, elem) {
      if (idx < 0) console.error('SEVERE_ERROR.\nWRONG Index. Adding item at: ', idx);

      // Realloc
      if (idx >= this.size) {

         const new_idx = this.Realloc(); // buffer is full.
         this.buffer[new_idx] = elem;
         this.boundary = new_idx;
         this.active_count++;
         return new_idx;
      }

      this.buffer[idx] = elem;
      this.active_count++;
      if (idx > this.boundary) this.boundary = idx;

      DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT++; //console.error('AddAtIndex')

      return idx;
   }


   CopyFromBufferToStart(oldData) {

      const size = oldData.length;
      for (let i = 0; i < size; i++) {
         this.buffer[i] = oldData[i];
      }
      for (let i = size; i < this.size; i++) {
         this.buffer[i] = null;
      }
   }


   // TODO: APPLIES ONLY FOR MESH TYPE ELEMENTS. Call this on every Destroy, to have all M_Buffer elements not sparsed
   ShiftElementOnDestroy(destroyed_idx) {

      if (destroyed_idx < this.boundary) {

         this.buffer[destroyed_idx] = this.buffer[this.boundary];
         this.buffer[this.boundary] = null;
         this.boundary--;

         this.buffer[destroyed_idx].idx = destroyed_idx; // IMPORTANT: Must update the mesh's idx to point to the new child element index 

         // If we replace the remove, then we need to remove that 'free' index from the free_buffer
         if(this.free_buffer.buffer[destroyed_idx] !== INT_NULL)
            this.free_buffer.buffer[destroyed_idx] = INT_NULL

         return true;
      }

      return false;
   }




   /*********************************************************************************************************************/
   // TEMP-TEST
   /*********************************************************************************************************************/
   RemoveByIdxSortedVersion(idx, debug_id, debug_name) {

      if (this.buffer[idx] !== null) {

         this.buffer[idx] = null;
         this.active_count--;
         this.#ShortReplaceWithLast(idx);

         if (this.active_count <= INT_NULL){
            console.error(idx, debug_id, debug_name, this)
            alert('SEVERE_ERROR.\nRemoveByIdxSortedVersion().\nM_Buffer active_count <= -1');
         }

         DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT--; //console.warn('RemoveByIdxSortedVersion')

         return true;

      }

      return false;
   }


   /**Returns -1 if there was no replacment(the removed element happens to be last) */
   #ShortReplaceWithLast(removed_idx) {

      if (removed_idx !== this.boundary) { // Handle removing any elements except the last

         // REPLACE WITH LAST ELEM
         this.buffer[removed_idx] = this.buffer[this.boundary];
         // REMOVE LAST
         this.buffer[this.boundary] = null;

         this.boundary--;
      }
      else { // Remove last does not need sorting
         this.boundary--;
      }
   }

   

   /** Debug */
   Print() {
      console.log('Count: ', this.boundary)
      console.log(this.buffer)
   }
}




const _generic_buffers_container = new M_Buffer();

export function Get_generic_buffers_container_get_total_allocations() { return _generic_buffers_container.active_count; }


export function New_generic_buffer(obj, name = 'UNAMED BUFFER') {
   
   const buffer = new M_Buffer(obj, name);
   buffer.buffer_container_idx = _generic_buffers_container.Add({
      buffer: buffer,
      name: name,
      type: 'Generic Buffer',
   });

   DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE += buffer.size;
   DEBUG_INFO_STRUCTS.BUFFER.GENERIC.BUFFER_COUNT++;

   return buffer;
}


export function Free_generic_buffer(buffer) {

   DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE -= buffer.size;
   DEBUG_INFO_STRUCTS.BUFFER.GENERIC.BUFFER_COUNT--;

   _generic_buffers_container.RemoveByIdx(buffer.buffer_container_idx);

   Free_int16_buffer(buffer.free_buffer);

   buffer = null;
}

















































// 
export class CharBuffer extends M_Buffer {

   constructor(char_buffer = null, name) {

      super(char_buffer, name);

      this.buffer[0] = '';
   }


   Init(size, text) {
      if (this.active_count > 0)
         alert('Initialization of char buffer struct should be for an empty buffer.')

      this.size = size;
      this.buffer = new Array(size);

      let i = 0;
      for (i = 0; i < size; i++) {
         this.buffer[i] = text[i];
         // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT++;
      }

      this.active_count = i;
      this.boundary = i - 1;
      
      // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE += this.size;
   }

   Add(elem) {

      const idx = super.GetNextFree();
      this.buffer[idx] = elem;
      this.active_count++;
      // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT++;
      return idx;
   }



   // #GetNextFree() {

   //    // Case the free buffer has a free index to the buffer
   //    if(this.free_buffer.boundary > INT_NULL &&

   //       this.free_buffer.buffer[this.free_buffer.boundary] !== INT_NULL){
   //       const idx = this.free_buffer.buffer[this.free_buffer.boundary];
   //       this.free_buffer.RemoveByIdxSortedVersionLastElemGuarantee();
         
   //       if(idx > this.boundary) this.boundary = idx;
   //       return idx;
   //    }

   //    // Case there is an element beyond .boundary, which denotes the last used element.
   //    if(this.boundary+1 < this.size){
   //       this.boundary++;
   //       return this.boundary;
   //    }
   //    else if(this.boundary+1 >= this.size){ // No free space left, Realloc
   //       const idx = this.Realloc(); // Returns the first free elem index
   //       this.boundary = idx;
   //       return idx;
   //    }

   //    alert('Buffers.js, GetNextFree(). New element not found')
   // }


   // Reset() {

   //    // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT -= this.active_count;

   //    this.boundary = -1;
   //    this.active_count = 0;
   //    this.buffer[0] = '';
   //    this.freeidx = 0;
   //    this.reserveidx = INT_NULL;

   // }


   RemoveByIdx(idx) {

      /**DEBUG ERROR*/ if (idx < 0 || idx > this.size - 1) {
         console.error('Index Out of bounds. @ CHAR_Buffer.RemoveByIdx().\n idx:', idx, 'size', this.size)
         return;
      }

      if (this.buffer[idx] !== '') {

         this.buffer[idx] = '';
         if (idx === this.boundary) this.boundary--; // Case the we removed the last element in existance
         this.active_count--;


         // Check if previous elements are empty, and reduce boundary to the last active.
         const boundary = this.boundary;
         for (let i = boundary; i > 0; i--) {

            if (this.buffer[this.boundary] !== '') break;
            this.boundary--;
         }

         if (this.boundary < INT_NULL) alert('M_Buffer boundary = -1')
         ERROR_NULL(this.active_count);

         // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_ELEM_COUNT--;
      }
   }




   // TODO: Call this on every Destroy, to have all M_Buffer elements not sparsed
   ShiftElementOnDestroy(destroyed_idx) {

      /**DEBUG*/ if (destroyed_idx > this.boundary && this.boundary >= 0) {
         console.error('destroyed_idx is out of bounds. @ ShiftElementOnDestroy(), Buffers.js.\destroyed_idx:', destroyed_idx, 'boundary:', this.boundary, '\nbuffer:');
      }

      if (destroyed_idx < this.boundary) {

         this.buffer[destroyed_idx] = this.buffer[this.boundary];
         this.buffer[this.boundary] = null;
         this.boundary--;

         this.buffer[destroyed_idx].idx = destroyed_idx; // IMPORTANT: Must update the mesh's idx to point to the new element index 

         return true;
      }

      return false;
   }

}



export function New_generic_char_buffer(obj, name = 'UNAMED BUFFER') {
   
   const buffer = new CharBuffer(obj, name);
   buffer.buffer_container_idx = _generic_buffers_container.Add({
      buffer: buffer,
      name: name,
      type: 'Char Buffer',
   });

   // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE += buffer.size;
   // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.BUFFER_COUNT++;

   return buffer;
}


export function Free_generic_char_buffer(buffer) {

   // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE -= buffer.size; // Remove from the total allocations size the size of the buffer that is destroyed
   // DEBUG_INFO_STRUCTS.BUFFER.GENERIC.BUFFER_COUNT--;

   _generic_buffers_container.RemoveByIdx(buffer.buffer_container_idx);

   Free_int16_buffer(buffer.free_buffer);

   buffer = null;
}

















/****************************************************************************************************************************************************/
// DEBUG-PRINT
/****************************************************************************************************************************************************/


export function DEBUG_INFO_BUFFERS_PRINT() {
   console.log(
      'GENERIC: number of buffers:', DEBUG_INFO_STRUCTS.BUFFER.GENERIC.BUFFER_COUNT, 'total elements count', DEBUG_INFO_STRUCTS.BUFFER.GENERIC.TOTAL_BUFFER_SIZE,
      '\nINT16: number of buffers:', DEBUG_INFO_STRUCTS.BUFFER.INT16.BUFFER_COUNT, 'total elements count', DEBUG_INFO_STRUCTS.BUFFER.INT16.TOTAL_BUFFER_SIZE,
      '\nINT8: number of buffers:', DEBUG_INFO_STRUCTS.BUFFER.INT8.BUFFER_COUNT, 'total elements count', DEBUG_INFO_STRUCTS.BUFFER.INT8.TOTAL_BUFFER_SIZE,
      '\n_generic_buffers_container: boundary', _generic_buffers_container.boundary, 'active', _generic_buffers_container.active_count, 'size', _generic_buffers_container.size,
   );

   let size = 0, actives = 0;
   for (let i = 0; i <= _generic_buffers_container.boundary; i++) {
      size += _generic_buffers_container.buffer[i].buffer.size;
      actives += _generic_buffers_container.buffer[i].buffer.active_count;
   }
   console.log(
      'From loop: Total sizes', size, 'Total actives', actives,
   );
}


export function DEBUG_INFO_BUFFERS_PRINT2() {
   console.log(
      _generic_buffers_container
   );
}


