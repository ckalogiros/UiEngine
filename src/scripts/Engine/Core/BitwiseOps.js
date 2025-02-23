"use strict";


/**
 * 7 bits: 127 7F
 * 9 bits: 511 1FF
 * 
 * idx 0 to low_byte    111 1111 bits (127)
 * idx 0 to high_byte  1 1111 1111 bits (511)
 */

const BIT_MASKS = {
   X4: 0xf,
   X5: 0x1f,
   X6: 0x3f,
   X7: 0x7f,
   X8: 0xff,
   X9: 0x1ff,
   X16: 0xffffffff,
};


export function Bitwise_opps_store_low_7bits(val){
   if(val > BIT_MASKS.X7) alert('914443121 \n VALUE EXCEEDS BIT MASK LIMIT')
   const ret_val = val;
   return ret_val;
}
export function Bitwise_opps_store_high_9bits(val){
   if(val > BIT_MASKS.X9) alert('914443122 \n VALUE EXCEEDS BIT MASK LIMIT')
   const ret_val = (val << 0x7) ;
   return ret_val;
}
export function Bitwise_opps_retrieve_low_7bits(val){
   // const ret_val = ((val >> 0x7) & BIT_MASKS.X7);
   const ret_val = val & BIT_MASKS.X7;
   return ret_val;
}
export function Bitwise_opps_retrieve_high_9bits(val){
   // const ret_val = ((val >> BIT_MASKS.X7) & BIT_MASKS.r9);
   const ret_val = ((val >> 0x7) & BIT_MASKS.X9);
   // const ret_val = ((val >> 0x7) & 0x1ff);
   return ret_val;
}
















export function Bitwise_operations_run_test() {

   let lowval = 127; 
   let highval = 511;
   
   const res = Bitwise_opps_store_low_7bits(lowval);
   console.log(res);
   
   const res2 = Bitwise_opps_store_high_9bits(highval);
   console.log(res2);
   
   const combined_val = res|res2;
   console.log('combined_val', combined_val);

   const lowval_test_passed = (Bitwise_opps_retrieve_low_7bits(combined_val)===lowval) ? 'Lowval: TEST PASSED!!' : 'Lowval: TEST FAILED';
   const highval_test_passed = (Bitwise_opps_retrieve_high_9bits(combined_val)===highval) ? 'Lowval: TEST PASSED!!' : 'Lowval: TEST FAILED';

   console.log(
      'Retrieve low val:', Bitwise_opps_retrieve_low_7bits(combined_val), lowval_test_passed,
      '\nRetrieve high val:', Bitwise_opps_retrieve_high_9bits(combined_val), highval_test_passed,
   );



}

















// Calculate index from flag
export function Bitwise_calc_bit_length_from_flag(flag) {

   if (flag === 0) return 0; // Edge case: 0 has no bits set

   // Count the number of leading zeros and subtract from 32 (for 32-bit integers)
   // return (32 - Math.clz32(flag));
   return (32 - Math.clz32(flag));
}

// Calculate index from flag starting from a base(subtracting all previous indexes and start from 0-th index at base)
export function Bitwise_calc_bit_length_from_flag_base(flag, base) {

   if (flag === 0) return 0; // Edge case: 0 has no bits set

   // Count the number of leading zeros and subtract from 32 (for 32-bit integers)
   const  index = 32 - Math.clz32(flag);
   const  base_index = 32 - Math.clz32(base);
   return index-base_index;
}