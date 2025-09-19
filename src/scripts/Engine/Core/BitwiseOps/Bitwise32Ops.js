"use strict";

import { Bitwise_opps_get_bitpos_from_bitmask } from "./Bitwise64Ops.js";


/**********************************************************************************************************************/
// Storing, clearing and retrieving single bits
/**
 * 
 * @param {*} bit_val The 32bit value in which the result will be stored
 * @param {*} bit_mask Which bit to store the bit_val
 * @returns 
 */
export function Bitwise32_opps_set_bit(bit_val, bit_pos){
   let ret_val = bit_val;
   ret_val |= bit_pos;
   return ret_val;
}
export function Bitwise32_opps_clear_bit(bit_val, bit_pos){
   let ret_val = bit_val;
   ret_val &= ~bit_pos;
   return ret_val;
}


/** 0x0 < bit_mask < 0xffff ffff */
export function Bitwise32_opps_retrieve_bit(val, bit_pos){
   const ret_val = ((val >> bit_pos) & 0x1);
   return ret_val;
}






/**********************************************************************************************************************/
// Storing, clearing and retrieving many bits
/**
 * @param {*} bit_val The value to opperate
 * @param {*} bit_pos From which bit position to start
 * @param {*} bit_mask How many bits to set
 */
export function Bitwise32_opps_set_bits(bit_val, bit_pos, bit_mask){
   let ret_val = ((bit_val >> bit_pos) | bit_mask) << bit_pos;
   return ret_val;
}
/**
 * @param {*} bit_val The value to opperate
 * @param {*} bit_pos From which bit position to start
 * @param {*} bit_mask How many bits to clear
 */
export function Bitwise32_opps_clear_bits(bit_val, bit_pos, bit_mask){
   let ret_val = bit_val & ~(bit_mask << bit_pos);
   return ret_val;
}
/**
 * @param {*} bit_val The value to opperate
 * @param {*} bit_pos From which bit position to start
 * @param {*} bit_mask How many bits to retrieve
 */
export function Bitwise32_opps_retrieve_bits(bit_val, bit_pos, bit_mask){
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
function Bitwise32_opps_get_bitpos_from_bitmask(bit_mask) {

   const bit_pos = Bitwise_opps_get_bitpos_from_bitmask(bit_mask);
   return bit_pos;

   // if (bit_mask === 0) return 0; // Edge case: 0 has no bits set
   // // Count the number of leading zeros and subtract from 32bits to get the bit position
   // return (32 - Math.clz32(bit_mask));
}
/** Interleaved data buffers. 
 * Extract bits from bit position taking into consideration a stride of interleaved values stored in the same buffer
 * In case of Arkanoid game, we store color and powerUps in a 32bit int, and we retrieve an index denoting wether is a color attribute or powerUp attribute 
 * */
export function Bitwise32_get_bitlen_from_bitpos(bit_mask, bit_pos) {

   alert('6661554132219839043. Reimplement Me')

   // if (bit_mask === 0) return 0; // Edge case: 0 has no bits set
   // const bit_pos = Bitwise_opps_get_bitpos_from_bitmask(bit_mask);
   // const  index = 32 - Math.clz32(bit_mask);
   // const  base_index = 32 - Math.clz32(bit_pos);
   // return index-base_index;

   // OLD
   // // Count the number of leading zeros and subtract from 32 (for 32-bit integers)
   // const  index = 32 - Math.clz32(bit_mask);
   // const  base_index = 32 - Math.clz32(bit_pos);
   // return index-base_index;
}








/**********************************************************************************************************************/
// Tests
/** */
export function Bitwise32_operations_run_tests() {

   console.log('***************************************************************************************\nBitwise32_operations_run_tests', );


   Bitwise32_opps_test_set_bits(0x8000n, 2n, BITWISE.x3);
   Bitwise32_opps_test_retrieve(0x4038n, 2n, BITWISE.x3);


   {
      
      /**
       * Store 
       * val 1: 7 bits: 127 7F
       * val 2: 9 bits: 511 1FF
       * 
       * to a 32 bit integer
       * 
       * val 1 to low_byte      111 1111 bits (127)
       * val 2 to high_byte  1 1111 1111 bits (511)
       * result should be: [1111 1111 1][111 1111]
       */
      /** */

      console.log('-------------------------------------\nTest: Store 2 values in one 32bit value and then retrieve them', );
      
      let lowval = 127n; 
      let highval = 511n;
      console.log('value 1: ', lowval, 'bin:', lowval.toString(2));
      console.log('value 2:', highval, 'bin:', highval.toString(2));
      
      const res = Bitwise32_opps_set_bits(lowval, 0n, BITWISE.x7);
      console.log(`Store ${lowval} in low  7 bits: 0000 0000 0111 1111`);
      console.log(`Store ${highval} in high 9 bits: 1111 1111 1000 0000`);
      console.log('Bitwise_opps store to low 7bits. val:', lowval, 'Integer result:', res, 'bin:', res.toString(2));
      
      const res2 = Bitwise32_opps_set_bits(highval, Bitwise32_opps_get_bitpos_from_bitmask(BITWISE.x7), BITWISE.x9);
      console.log('Bitwise_opps store to high 9bits. val:', highval, 'Integer result:', res2, 'bin:', res2.toString(2));
      
      const combined_val = res|res2;
      console.log('result 1 | result 2 = ', combined_val, 'bin:', combined_val.toString(2));
      
      const lowval_test_passed = (Bitwise32_opps_retrieve_bits(combined_val, 0n, BITWISE.x7)===lowval) 
                                 ? 'Lowval: TEST PASSED!!' : 'Lowval: TEST FAILED';
      const highval_test_passed = (Bitwise32_opps_retrieve_bits(combined_val, Bitwise32_opps_get_bitpos_from_bitmask(BITWISE.x7), BITWISE.x9)===highval) 
                                    ? 'Lowval: TEST PASSED!!' : 'Lowval: TEST FAILED';
      
      console.log(
         'Retrieve low val:', Bitwise32_opps_retrieve_bits(combined_val, 0n, BITWISE.x7), lowval_test_passed,
         '\nRetrieve high val:', Bitwise32_opps_retrieve_bits(combined_val, Bitwise32_opps_get_bitpos_from_bitmask(BITWISE.x7), BITWISE.x9), highval_test_passed,
      );
      
      
      console.log('END Test: Store 2 values in one 32bit value and then retrieve them\n-------------------------------------', );
   }




   console.log('END:Bitwise32_operations_run_tests\n***************************************************************************************', );

}


/** Test: Set arbitrary bits to an int32 */
function Bitwise32_opps_test_set_bits(bit_val, bit_pos, bit_mask) {

   console.log(`-------------------------------------\n Set ${Bitwise32_opps_get_bitpos_from_bitmask(bit_mask)}bits from pos ${bit_pos}`, );
   console.log('bit_pos: ', bit_pos);
   console.log('bit_mask:', bit_mask.toString(2));
   console.log('bit_val: ', bit_val.toString(2));

   const res = Bitwise32_opps_set_bits(bit_val, bit_pos, bit_mask);
   console.log('Result:  ', res.toString(2));

   console.log('-------------------------------------', );

   return res;
}
/** Test: Retrieve arbitrary bits from an int32 */
function Bitwise32_opps_test_retrieve(bit_val, bit_pos, bit_mask) {

   console.log(`-------------------------------------\nTest: Retrieve ${Bitwise32_opps_get_bitpos_from_bitmask(bit_mask)}bits from pos ${bit_pos}`, );
   console.log('bit_val:', bit_val.toString(2));
   console.log('bit_pos:', bit_pos, 'bit_mask:', bit_mask.toString(2));
   
   console.log('Bit Retrieve...');
   const res = Bitwise32_opps_retrieve_bits(bit_val, bit_pos, bit_mask)
   console.log('Result:', res.toString(2));
   
   console.log('-------------------------------------', );
}
