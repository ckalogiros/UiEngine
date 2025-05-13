"use strict";

const bin_a_32 = new Int8Array(32);


function binary_32_to_string(val, byte_len=8) {

    let bin_str = '';
    const len = (byte_len > 32) ? 32 : byte_len;

    for(let i=len-1; i>=0; i--) {
        bin_a_32[i] = (val >> i) & 0x1;
        bin_str += bin_a_32[i];
        if(i % 4 === 0) bin_str += ' ';
    }

    return bin_str;

}

/**
 * This can be used to determine if an unsigned integer is a power of 2 or is 0: 
 * apply the formula followed by a 0-test on the result
 */
function op_turn_off_right_most_bit(val)  { return val & (val-1); }
function op_isolate_right_most_bit(val)  { return val & (-val); }
/**
 * These can be used to determine if a nonnegative integer is of the form {2^j 2^k} for some {j>=k>=0} 
 * apply the formula followed by a 0-test on the result
 */
function op_turn_off_right_most_contiguous_bits(val)  { return ((val & (-val)) + val) & val; }



export function Test_bitwise_from_book_run_all_tests() {

    {
        const x = 18, byte_len = 8;
        const x_bin_str = binary_32_to_string(x, byte_len);
        const x_op_bin_str = binary_32_to_string(op_turn_off_right_most_bit(x), byte_len);
        console.log(
            'op_turn_off_right_most_bit',
            '\n  val:', x, 'op:val & (val-1)',
            '\n  ', x_bin_str,
            '\n  ', x_op_bin_str,
        );
    }
    {
        const x = 50, byte_len = 8;
        const x_bin_str = binary_32_to_string(x, byte_len);
        const x_op_bin_str = binary_32_to_string(op_isolate_right_most_bit(x), byte_len);
        console.log(
            'op_isolate_right_most_bit',
            '\n  val:', x, 'op:val & (-val)',
            '\n  ', x_bin_str,
            '\n  ', x_op_bin_str,
        );
    }
    {
        // const x = 79;
        const x = 1151, byte_len = 12;
        const x_bin_str = binary_32_to_string(x, byte_len);
        const x_op_bin_str = binary_32_to_string(op_turn_off_right_most_contiguous_bits(x), byte_len);
        console.log(
            'op_turn_off_right_most_contiguous_bits',
            '\n  val:', x, 'op:((val & (-val)) + val) & val',
            '\n  ', x_bin_str,
            '\n  ', x_op_bin_str,
        );
    }
}
