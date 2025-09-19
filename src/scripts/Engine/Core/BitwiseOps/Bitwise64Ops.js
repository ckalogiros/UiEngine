"use strict";





const BIT_LEN = 64n;

export function Bitwise_opps_get_bitpos_from_bitmask(bit_mask) {

   if(bit_mask < 0xffffffffn){ // < 32bits
      if(bit_mask < 0xffffn){ // < 16bits
         if(bit_mask < 0xffn){ // < 8bits
            if(bit_mask & BITWISE.x1) return 0n;
            if(bit_mask & BITWISE.x2) return 1n;
            if(bit_mask & BITWISE.x3) return 2n;
            if(bit_mask & BITWISE.x4) return 3n;
            if(bit_mask & BITWISE.x5) return 4n;
            if(bit_mask & BITWISE.x6) return 5n;
            if(bit_mask & BITWISE.x7) return 6n;
         }
         else { // >= 8bits
            if(bit_mask & BITWISE.x8)  return 7n;
            if(bit_mask & BITWISE.x9)  return 8n;
            if(bit_mask & BITWISE.x10) return 9n;
            if(bit_mask & BITWISE.x11) return 10n;
            if(bit_mask & BITWISE.x12) return 11n;
            if(bit_mask & BITWISE.x13) return 12n;
            if(bit_mask & BITWISE.x14) return 13n;
            if(bit_mask & BITWISE.x15) return 14n;
         }
      }
      else{ // >= 16bits
         if(bit_mask < 0xffffffn){ // < 24bits
            if(bit_mask & BITWISE.x16) return 15n;
            if(bit_mask & BITWISE.x17) return 16n;
            if(bit_mask & BITWISE.x18) return 17n;
            if(bit_mask & BITWISE.x19) return 18n;
            if(bit_mask & BITWISE.x20) return 19n;
            if(bit_mask & BITWISE.x21) return 20n;
            if(bit_mask & BITWISE.x22) return 21n;
            if(bit_mask & BITWISE.x23) return 22n;
         }
         else { // >= 24bits
            if(bit_mask & BITWISE.x24) return 23n;
            if(bit_mask & BITWISE.x25) return 24n;
            if(bit_mask & BITWISE.x26) return 25n;
            if(bit_mask & BITWISE.x27) return 26n;
            if(bit_mask & BITWISE.x28) return 27n;
            if(bit_mask & BITWISE.x29) return 28n;
            if(bit_mask & BITWISE.x30) return 29n;
            if(bit_mask & BITWISE.x31) return 30n;
         }
      }
   }
   else { // >= 32bits
      if(bit_mask < 0xffffffffffffn){ // < 48bits
         if(bit_mask < 0xffffffffffn){ // < 40bits
            if(bit_mask & BITWISE.x32) return 31n;
            if(bit_mask & BITWISE.x33) return 32n;
            if(bit_mask & BITWISE.x34) return 33n;
            if(bit_mask & BITWISE.x35) return 34n;
            if(bit_mask & BITWISE.x36) return 35n;
            if(bit_mask & BITWISE.x37) return 36n;
            if(bit_mask & BITWISE.x38) return 37n;
            if(bit_mask & BITWISE.x39) return 38n;
         }
         else { // >= 40bits
            if(bit_mask & BITWISE.x40) return 39n;
            if(bit_mask & BITWISE.x41) return 40n;
            if(bit_mask & BITWISE.x42) return 41n;
            if(bit_mask & BITWISE.x43) return 42n;
            if(bit_mask & BITWISE.x44) return 43n;
            if(bit_mask & BITWISE.x45) return 44n;
            if(bit_mask & BITWISE.x46) return 45n;
            if(bit_mask & BITWISE.x47) return 46n;
         }
      }
      else{ // >= 48 bits
         if(bit_mask < 0xffffffffffffffn){ // < 56bits
            if(bit_mask & BITWISE.x48) return 47n;
            if(bit_mask & BITWISE.x49) return 48n;
            if(bit_mask & BITWISE.x50) return 49n;
            if(bit_mask & BITWISE.x51) return 50n;
            if(bit_mask & BITWISE.x52) return 51n;
            if(bit_mask & BITWISE.x53) return 52n;
            if(bit_mask & BITWISE.x54) return 53n;
            if(bit_mask & BITWISE.x55) return 54n;
         }
         else { // >= 56bits
            if(bit_mask & BITWISE.x56) return 55n;
            if(bit_mask & BITWISE.x57) return 56n;
            if(bit_mask & BITWISE.x58) return 57n;
            if(bit_mask & BITWISE.x59) return 58n;
            if(bit_mask & BITWISE.x60) return 59n;
            if(bit_mask & BITWISE.x61) return 60n;
            if(bit_mask & BITWISE.x62) return 61n;
            if(bit_mask & BITWISE.x63) return 62n;
            if(bit_mask & BITWISE.x64) return 63n;
         }
      }
   }
}

export function Bitwise_opps_get_bitpos_from_bitmask_looped(bit_mask) {
  if (bit_mask === 0n) return 64;
  
  let count = 0n;
  let mask = 1n << 63n; // start with the top bit
  while ((bit_mask & mask) === 0n) {
    count++;
    mask >>= 1n;
  }
  return count;
}




/**********************************************************************************************************************/
// Storing, clearing and retrieving single bits
/**
 * 
 * @param {*} bit_val The 32bit value in which the result will be stored
 * @param {*} bit_mask Which bit to store the bit_val
 * @returns 
 */
export function Bitwise64_opps_set_bit(bit_val, bit_pos){
   // let ret_val = ((bit_val >> bit_pos) | 0x1n) << bit_pos;
   let ret_val = bit_val | (0x1n << bit_pos);
   return ret_val;
}
export function Bitwise64_opps_clear_bit(bit_val, bit_pos){
   let ret_val = bit_val & ~(0x1n << bit_pos);
   return ret_val;
}


/** 0x0 < bit_mask < 0xffff ffff */
export function Bitwise64_opps_retrieve_bit(val, bit_pos){
   const ret_val = ((val >> bit_pos) & 0x1n);
   return ret_val;
}






/**********************************************************************************************************************/
// Storing, clearing and retrieving many bits
/**
 * @param {*} bit_val The value to opperate
 * @param {*} bit_pos From which bit position to start
 * @param {*} bit_mask How many bits to set
 */
export function Bitwise64_opps_set_bits(bit_val, bit_pos, bit_mask){
   let ret_val = ((bit_val >> bit_pos) | bit_mask) << bit_pos;
   return ret_val;
}
/**
 * @param {*} bit_val The value to opperate
 * @param {*} bit_pos From which bit position to start
 * @param {*} bit_mask How many bits to clear
 */
export function Bitwise64_opps_clear_bits(bit_val, bit_pos, bit_mask){
   let ret_val = bit_val & ~(bit_mask << bit_pos);
   return ret_val;
}
/**
 * @param {*} bit_val The value to opperate
 * @param {*} bit_pos From which bit position to start
 * @param {*} bit_mask How many bits to retrieve
 */
export function Bitwise64_opps_retrieve_bits(bit_val, bit_pos, bit_mask){
   const ret_val = ((bit_val >> bit_pos) & bit_mask);
   return ret_val;
}





/**********************************************************************************************************************/
// Storing and retrieving values



/** Extract the position (index) from a bit_mask 
 * Example:
 * bit_mask:0x0  = 0th pos,   0000 0001
 * bit_mask:0x1  = 1th pos,   0000 0010
 * bit_mask:0x3  = 2th pos,   0000 0100
 * bit_mask:0x7  = 3th pos,   0000 1000
 * bit_mask:0xf  = 4th pos,   0000 0000
 * bit_mask:0x1f = 5th pos,   0010 0000
 * bit_mask:0x3f = 6th pos,   0100 0000
 * bit_mask:0x7f = 7th pos,   1000 0000
 * bit_mask:0xff = 8th pos, 1 0000 0000
*/
function Bitwise64_opps_get_bitpos_from_bitmask(bit_mask) {
   // const bit_pos = Bitwise_opps_get_bitpos_from_bitmask(bit_mask);
   const bit_pos = Bitwise_opps_get_bitpos_from_bitmask_looped(bit_mask);
   return bit_pos;
}
/** Interleaved data buffers. 
 * Extract bits from bit position taking into consideration a stride of interleaved values stored in the same buffer
 * In case of Arkanoid game, we store color and powerUps in a 32bit int, and we retrieve an index denoting wether is a color attribute or powerUp attribute 
 * */
export function Bitwise64_opps_get_bitlen_from_bitpos(bit_mask, bit_pos) {

   if (bit_mask === 0) return 0n; // Edge case: 0 has no bits set

   // Count the number of leading zeros and subtract from 32 (for 32-bit integers)
   const  index = BIT_LEN - Math.clz32(bit_mask);
   const  base_index = BIT_LEN - Math.clz32(bit_pos);
   return index-base_index;
}




/**********************************************************************************************************************/
// Tests
/** */
export function Bitwise64_operations_run_tests() {

   console.log('***************************************************************************************\nBitwise64_operations_run_tests', );


   Bitwise64_opps_test_set_bits(0x8000n, 2n, BITWISE.x3);
   Bitwise64_opps_test_retrieve(0x4038n, 2n, BITWISE.x3);


   {
      console.log('-------------------------------------\nTest: Store 2 values in one 32bit value and then retrieve them', );
      
      let lowval = 127n; 
      let highval = 511n;
      console.log('value 1: ', lowval, 'bin:', lowval.toString(2));
      console.log('value 2:', highval, 'bin:', highval.toString(2));
      
      const res = Bitwise64_opps_set_bits(lowval, 0n, BITWISE.x7);
      console.log(`Store ${lowval} in low  7 bits: 0000 0000 0111 1111`);
      console.log(`Store ${highval} in high 9 bits: 1111 1111 1000 0000`);
      console.log('Bitwise_opps store to low 7bits. val:', lowval, 'Integer result:', res, 'bin:', res.toString(2));
      
      const res2 = Bitwise64_opps_set_bits(highval, Bitwise64_opps_get_bitpos_from_bitmask(BITWISE.x7), BITWISE.x9);
      console.log('Bitwise_opps store to high 9bits. val:', highval, 'Integer result:', res2, 'bin:', res2.toString(2));
      
      const combined_val = res|res2;
      console.log('result 1 | result 2 = ', combined_val, 'bin:', combined_val.toString(2));
      
      const lowval_test_passed = (Bitwise64_opps_retrieve_bits(combined_val, 0n, BITWISE.x7)===lowval) 
                                 ? 'Lowval: TEST PASSED!!' : 'Lowval: TEST FAILED';
      const highval_test_passed = (Bitwise64_opps_retrieve_bits(combined_val, Bitwise64_opps_get_bitpos_from_bitmask(BITWISE.x7), BITWISE.x9)===highval) 
                                    ? 'Lowval: TEST PASSED!!' : 'Lowval: TEST FAILED';
      
      console.log(
         'Retrieve low val:', Bitwise64_opps_retrieve_bits(combined_val, 0n, BITWISE.x7), lowval_test_passed,
         '\nRetrieve high val:', Bitwise64_opps_retrieve_bits(combined_val, Bitwise64_opps_get_bitpos_from_bitmask(BITWISE.x7), BITWISE.x9), highval_test_passed,
      );
      
      
      console.log('END Test: Store 2 values in one 32bit value and then retrieve them\n-------------------------------------', );
   }




   console.log('END:Bitwise64_operations_run_tests\n***************************************************************************************', );

}


/** Test: Set arbitrary bits to an int32 */
function Bitwise64_opps_test_set_bits(bit_val, bit_pos, bit_mask) {

   console.log(`-------------------------------------\n Set ${Bitwise64_opps_get_bitpos_from_bitmask(bit_mask)}bits from pos ${bit_pos}`, );
   console.log('bit_pos: ', bit_pos);
   console.log('bit_mask:', bit_mask.toString(2));
   console.log('bit_val: ', bit_val.toString(2));

   const res = Bitwise64_opps_set_bits(bit_val, bit_pos, bit_mask);
   console.log('Result:  ', res.toString(2));

   console.log('-------------------------------------', );

   return res;
}
/** Test: Retrieve arbitrary bits from an int32 */
function Bitwise64_opps_test_retrieve(bit_val, bit_pos, bit_mask) {

   console.log(`-------------------------------------\nTest: Retrieve ${Bitwise64_opps_get_bitpos_from_bitmask(bit_mask)}bits from pos ${bit_pos}`, );
   console.log('bit_val:', bit_val.toString(2));
   console.log('bit_pos:', bit_pos, 'bit_mask:', bit_mask.toString(2));
   
   console.log('Bit Retrieve...');
   const res = Bitwise64_opps_retrieve_bits(bit_val, bit_pos, bit_mask)
   console.log('Result:', res.toString(2));
   
   console.log('-------------------------------------', );
}


/** Test of javascript's BigUint64 typed array */
export function Test_js_bigUint64() {
   let arr64 = new BigUint64Array(1);
   arr64[0] = 0xaaaaaaaaaaaaaaaan;
   console.log(arr64[0].toString(2));

   for(let i = 0n; i < BIT_LEN; i++) {
      const res = ((arr64[0] >> i) & 0x1n);
      console.log(i, res.toString(2));
   }
}
