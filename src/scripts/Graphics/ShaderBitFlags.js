"use strict"


// Generic Bit Flags array. 
let BIT = 0x1;
const BIT_FLAGS = new Int32Array([
    BIT,       // 1
    BIT<<=0x1, // 2
    BIT<<=0x1, // 3
    BIT<<=0x1, // 4
    BIT<<=0x1, // 5
    BIT<<=0x1, // 6
    BIT<<=0x1, // 7
    BIT<<=0x1, // 8
    BIT<<=0x1, // 9
    BIT<<=0x1, // 10
    BIT<<=0x1, // 11
    BIT<<=0x1, // 12
    BIT<<=0x1, // 13
    BIT<<=0x1, // 14
    BIT<<=0x1, // 15
    BIT<<=0x1, // 16
    BIT<<=0x1, // 17
    BIT<<=0x1, // 18
    BIT<<=0x1, // 19
    BIT<<=0x1, // 20
    BIT<<=0x1, // 21
    BIT<<=0x1, // 22
    BIT<<=0x1, // 23
    BIT<<=0x1, // 24
    BIT<<=0x1, // 25
    BIT<<=0x1, // 26
    BIT<<=0x1, // 27
    BIT<<=0x1, // 28
    BIT<<=0x1, // 29
    BIT<<=0x1, // 30
    BIT<<=0x1, // 31
// ];
]);
const BIT_FLAGS_SIZE = BIT_FLAGS.length;
console.log(BIT_FLAGS_SIZE);
if(BIT_FLAGS[BIT_FLAGS_SIZE] > MAX_BIT_MASK || BIT_FLAGS[BIT_FLAGS_SIZE] <= 0 ) alert('BIT_FLAGS exceeding javascript\'s max number value');




// This structure is for the hierarchy of the shader attributes bit flags(sequence of object fields DOES matter)
_CNT = 0;
const SID_ATTR = {
   COL4: BIT_FLAGS[_CNT++], 
   WPOS3: BIT_FLAGS[_CNT++],
   VPOS2: BIT_FLAGS[_CNT++],
   DIM2: BIT_FLAGS[_CNT++],
   TIME: BIT_FLAGS[_CNT++],
   R_CORNERS: BIT_FLAGS[_CNT++],
   BORDER: BIT_FLAGS[_CNT++],
   FEATHER: BIT_FLAGS[_CNT++],
   GLOW_INTENSITY: BIT_FLAGS[_CNT++],
   TEX2: BIT_FLAGS[_CNT++],
   SCALE2: BIT_FLAGS[_CNT++],
   SDF: BIT_FLAGS[_CNT++],
   MSDF: BIT_FLAGS[_CNT++],
   STYLE: BIT_FLAGS[_CNT++],
   COL4_PER_VERTEX: BIT_FLAGS[_CNT++],
   EMPTY: BIT_FLAGS[_CNT++],
   TEST_MULTI_VERTEX: BIT_FLAGS[_CNT++],
};
const SID_ATTR_SIZE = _CNT; 
export function Shader_bit_flags_get_attr_size() { return SID_ATTR_SIZE; }


// To add/remove attributes, both (SID_ATTR and ATTRIBUTES) structures must be updated manually


// This structure is for retrieving info like type, name etc(sequence of array elements does NOT matter)
const ATTRIBUTES = [
   {FLAG:SID_ATTR.COL4,               TYPE:GL_TYPES.FLOAT_VEC4,  TYPE_SIZE:4,     NAME:'col4'},
   {FLAG:SID_ATTR.WPOS3,              TYPE:GL_TYPES.FLOAT_VEC3,  TYPE_SIZE:3,     NAME:'wpos3'},
   {FLAG:SID_ATTR.VPOS2,              TYPE:GL_TYPES.FLOAT_VEC2,  TYPE_SIZE:2,     NAME:'vpos2'},
   {FLAG:SID_ATTR.DIM2,               TYPE:GL_TYPES.FLOAT_VEC2,  TYPE_SIZE:2,     NAME:'dim2'},
   {FLAG:SID_ATTR.TIME,               TYPE:GL_TYPES.FLOAT,       TYPE_SIZE:1,     NAME:'time'},
   {FLAG:SID_ATTR.R_CORNERS,          TYPE:GL_TYPES.FLOAT,       TYPE_SIZE:1,     NAME:'r_corners'},
   {FLAG:SID_ATTR.BORDER,             TYPE:GL_TYPES.FLOAT,       TYPE_SIZE:1,     NAME:'border'},
   {FLAG:SID_ATTR.FEATHER,            TYPE:GL_TYPES.FLOAT,       TYPE_SIZE:1,     NAME:'feather'},
   {FLAG:SID_ATTR.GLOW_INTENSITY,     TYPE:GL_TYPES.FLOAT,       TYPE_SIZE:1,     NAME:'glow_intensity'},
   {FLAG:SID_ATTR.TEX2,               TYPE:GL_TYPES.FLOAT_VEC2,  TYPE_SIZE:2,     NAME:'tex2'},
   {FLAG:SID_ATTR.SCALE2,             TYPE:GL_TYPES.FLOAT_VEC2,  TYPE_SIZE:2,     NAME:'scale2'},
   {FLAG:SID_ATTR.SDF,                TYPE:GL_TYPES.FLOAT_VEC2,  TYPE_SIZE:2,     NAME:'sdf'},
   {FLAG:SID_ATTR.MSDF,               TYPE:GL_TYPES.FLOAT_VEC2,  TYPE_SIZE:2,     NAME:'msdf'},
   {FLAG:SID_ATTR.STYLE,              TYPE:GL_TYPES.FLOAT_VEC3,  TYPE_SIZE:3,     NAME:'style'},
   {FLAG:SID_ATTR.COL4_PER_VERTEX,    TYPE:GL_TYPES.FLOAT_VEC4,  TYPE_SIZE:4,     NAME:'col4'},
   {FLAG:SID_ATTR.TEST_MULTI_VERTEX,  TYPE:GL_TYPES.FLOAT_VEC4,  TYPE_SIZE:4,     NAME:'___'},
   {FLAG:SID_ATTR.EMPTY,              TYPE:GL_TYPES.FLOAT_VEC4,  TYPE_SIZE:4,     NAME:'___'},
];
const ATTRIBUTES_SIZE = ATTRIBUTES.length;
console.log('$$$ ATTRIBUTES', ATTRIBUTES);
export function Shader_bit_flags_get_attr_info_from_index(idx){
   if(DEBUG.DEFENSIVE) if(idx < 0 || idx >= ATTRIBUTES_SIZE || idx === null || idx === undefined) alert('55133219772 \n ATTRIBUTES: BAD array indexing')
   return ATTRIBUTES[idx]; 
}
export function Shader_bit_flags_get_attr_info_from_flag(attr_flag){

   const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);
   return ATTRIBUTES[idx];
}

if(SID_ATTR_SIZE !== ATTRIBUTES_SIZE) alert('55133219773 \n SID_ATTR_SIZE and ATTRIBUTES_SIZE size mismatch');

export function Shader_bit_flags_build_SID_ATTR(){

   return SID_ATTR;
}

// _CNT = 0;
// const SID_ATTR_MASK = [
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
//    BIT_FLAGS[_CNT++],
// ];
// const SID_ATTR_MASK_SIZE = _CNT-1;

function MASKS_GET_INDEX_FROM_FLAG(MASK){
   return Math.log2(MASK);
}

const ATTR_TYPES = [1, 2, 3, 4];
export function Attribute_get_type_size(sid_attr_bit_flag){
   if(DEBUG.DEFENSIVE) if(sid_attr_bit_flag < 0 || sid_attr_bit_flag > ATTRIBUTES[sid_attr_bit_flag].FLAG) alert('55133219774 \n ATTR_TYPE: index out of bounds');

   return ATTRIBUTES[sid_attr_bit_flag].TYPE_SIZE;
}

const ATTR_TYPES_EXTENSION = ['x', 'y', 'z', 'w'];
export function Attribute_get_type_extension(idx){
   const len = ATTR_TYPES.length-1;
   if(DEBUG.DEFENSIVE) if(idx < 0 || idx > len) alert('55133219775 \n ATTR_TYPES_EXTENSION: index out of bounds')
   return ATTR_TYPES_EXTENSION[idx];
}




// Debug-Print
// {
//    console.log('SID_ATTR_NAMES', SID_ATTR_NAMES)
//    console.log('SID_ATTR_MASK', SID_ATTR_MASK)
//    console.log('SID_ATTR', SID_ATTR)
//    console.log('COL4', MASKS_GET_INDEX(SID_ATTR.COL4))
//    console.log('WPOS3', MASKS_GET_INDEX(SID_ATTR.WPOS3))
//    console.log('VPOS2', MASKS_GET_INDEX(SID_ATTR.VPOS2))
//    console.log('DIM2', MASKS_GET_INDEX(SID_ATTR.DIM2))
//    console.log('COL4', SID_ATTR_NAMES[MASKS_GET_INDEX(SID_ATTR.COL4)])
//    console.log('WPOS3', SID_ATTR_NAMES[MASKS_GET_INDEX(SID_ATTR.WPOS3)])
//    console.log('VPOS2', SID_ATTR_NAMES[MASKS_GET_INDEX(SID_ATTR.VPOS2)])
//    console.log('DIM2 MASK VALUE', SID_ATTR_NAMES[MASKS_GET_INDEX(SID_ATTR.DIM2)])
//    console.log('COL4 MASK VALUE', SID_ATTR_MASK[MASKS_GET_INDEX(SID_ATTR.COL4)])
//    console.log('WPOS3 MASK VALUE', SID_ATTR_MASK[MASKS_GET_INDEX(SID_ATTR.WPOS3)])
//    console.log('VPOS2 MASK VALUE', SID_ATTR_MASK[MASKS_GET_INDEX(SID_ATTR.VPOS2)])
//    console.log('DIM2 MASK VALUE', SID_ATTR_MASK[MASKS_GET_INDEX(SID_ATTR.DIM2)])
// }