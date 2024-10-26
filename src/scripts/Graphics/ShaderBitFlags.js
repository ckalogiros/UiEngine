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


_CNT = 0;
// This structure declares applications ALL shader attributes as bit flags(sequence of object fields DOES matter)
export class Shader_Attributes {

   constructor(initialize_for_indexing=false, init_val={}){

      // this.SIZE = 0;

      const default_values = {
         COL4: BIT_FLAGS[_CNT++],
         WPOS3: BIT_FLAGS[_CNT++],
         // WPOS2: BIT_FLAGS[_CNT++],
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
         COL4_PER_VERTEX: BIT_FLAGS[_CNT++],
      };


      // Initialize with bit flags or for indexing the attrib location for Program nad vertex buffer specific attributes
      if(typeof init_val === 'object' && init_val !== null) {

         for (let [key, value] of Object.entries(default_values)) {
            this[key] = (initialize_for_indexing) ? init_val[key] : value;
         }
      }
      else {

         for (let [key, value] of Object.entries(default_values)) {
            this[key] = (initialize_for_indexing) ? init_val : value;
         }
      }

   }


   // SetAttributeLocIdx(key_, value_) {

   //    for (let [key, value] of Object.entries(this)) {
         
   //       if(key === key_){
   //          this[key] = value_;
   //       }
   //    }
   // }
   SetAttributeLocIdx(attr_flag, attribs_loc_idx) {

      for (let [key, value] of Object.entries(this)) {
         
         const sample = Shader_bit_flags_get_attr_info_from_flag(attr_flag)
         if(key === sample.KEY_NAME){
            this[key] = attribs_loc_idx;
            // return attribs_loc_idx + 1; // Increment indexing to point to the next attribute location.
         }
      }
   }
   // SetAttributeLocIdx(attr_flag, attribs_loc_idx) {

   //    for (let [key, value] of Object.entries(this)) {
         
   //       const sample = Shader_bit_flags_get_attr_info_from_flag(attr_flag)
   //       if(value === attr_flag){
   //          this[key] = attribs_loc_idx;
   //          return attribs_loc_idx + 1; // Increment indexing to point to the next attribute location.
   //       }
   //    }
   // }
} 
const SID_ATTR = new Shader_Attributes();
const SID_ATTR_SIZE = _CNT;
export function Shader_bit_flags_build_SID_ATTR(){ return SID_ATTR; }
export function Shader_bit_flags_get_attr_size() { return SID_ATTR_SIZE; }



// To add/remove attributes, both (SID_ATTR and ATTRIBUTES) structures must be updated manually

_CNT = 0;
// This structure is for retrieving info like type, name etc(sequence of array elements does NOT matter)
const ATTRIBUTES = [
   {FLAG:SID_ATTR.COL4,               IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC4,   TYPE_SIZE:4,    KEY_NAME:'COL4',            ATTR_NAME:'col4'},
   // {FLAG:SID_ATTR.WPOS3,           IDX:_CNT++,       TYPE:GL_TYPES.FLOAT_VEC3,   TYPE_SIZE:3,    KEY_NAME:'WPOS3',           ATTR_NAME:'wpos3', PASS:{FIELD:[0,0,0], Enabled:Pass_enabled}, pass_fn_set:pass3_fn_set, pass_fn_get:pass3_fn_get, },
   // {FLAG:SID_ATTR.WPOS3,              IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC3,   TYPE_SIZE:3,    KEY_NAME:'WPOS3',           ATTR_NAME:'wpos3', PASS:{FIELD:[0,0,0], Enabled:Pass_is_enabled}},
   {FLAG:SID_ATTR.WPOS3,           IDX:_CNT++,       TYPE:GL_TYPES.FLOAT_VEC3,   TYPE_SIZE:3,    KEY_NAME:'WPOS3',           ATTR_NAME:'wpos3'},
   // {FLAG:SID_ATTR.WPOS2,              IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'WPOS2',           ATTR_NAME:'wpos2'},
   {FLAG:SID_ATTR.VPOS2,              IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'VPOS2',           ATTR_NAME:'pos2'},
   {FLAG:SID_ATTR.DIM2,               IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'DIM2',            ATTR_NAME:'dim2'},
   {FLAG:SID_ATTR.TIME,               IDX:_CNT++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'TIME',            ATTR_NAME:'time'},
   {FLAG:SID_ATTR.R_CORNERS,          IDX:_CNT++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'R_CORNERS',       ATTR_NAME:'rcorners'},
   {FLAG:SID_ATTR.BORDER,             IDX:_CNT++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'BORDER',          ATTR_NAME:'border'},
   {FLAG:SID_ATTR.FEATHER,            IDX:_CNT++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'FEATHER',         ATTR_NAME:'feather'},
   {FLAG:SID_ATTR.GLOW_INTENSITY,     IDX:_CNT++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'GLOW_INTENSITY',  ATTR_NAME:'glow_intensity'},
   {FLAG:SID_ATTR.TEX2,               IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'TEX2',            ATTR_NAME:'tex2'},
   {FLAG:SID_ATTR.SCALE2,             IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'SCALE2',          ATTR_NAME:'scale2'},
   {FLAG:SID_ATTR.SDF,                IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'SDF',             ATTR_NAME:'sdf'},
   {FLAG:SID_ATTR.MSDF,               IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'MSDF',            ATTR_NAME:'msdf'},
   {FLAG:SID_ATTR.COL4_PER_VERTEX,    IDX:_CNT++,    TYPE:GL_TYPES.FLOAT_VEC4,   TYPE_SIZE:4,    KEY_NAME:'COL4_PER_VERTEX', ATTR_NAME:'col4'},
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
export function Shader_bit_flags_get_attr_key_name_from_flag(attr_flag){
   
   const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);
   return ATTRIBUTES[idx].KEY_NAME;
}



// export function Shader_bit_flags_set_attr_pass(attr_flag, x=0, y=0, z=0, w=0){
   
//    const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);

//    // const len = ATTRIBUTES[idx].PASS.FIELD;
//    // for(let i=0; i<len; i++){

//    //    ATTRIBUTES[idx].PASS.FIELD[i] = x;
//    // }
//    ATTRIBUTES[idx].PASS.FIELD[0] = x;
//    ATTRIBUTES[idx].PASS.FIELD[1] = y;
//    ATTRIBUTES[idx].PASS.FIELD[2] = z;
//    ATTRIBUTES[idx].PASS.FIELD[3] = w;
// }


// function pass3_fn_set(attrib_idx, x=0, y=0, z=0, w=0){
//    ATTRIBUTES[attrib_idx].PASS.X = x;
//    ATTRIBUTES[attrib_idx].PASS.Y = y;
//    ATTRIBUTES[attrib_idx].PASS.Z = z;
// }

// function pass3_fn_get(attr_flag){
   
//    const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);
//    return ATTRIBUTES[idx].PASS.X;
// }

// function Pass_is_enabled(idx, field_idx){
   
//    // const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);
//    return ATTRIBUTES[idx].PASS.FIELD[field_idx];
// }





/************************************************************************************************************/
if(SID_ATTR_SIZE !== ATTRIBUTES_SIZE) alert('55133219770 \n SID_ATTR_SIZE and ATTRIBUTES_SIZE size mismatch');
/************************************************************************************************************/




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


// Attributes Pass to Fragment shader
// TODO: DUPLICATE. Try to implement differently so we don't have to have SID_ATT_PASS
_CNT = 0;
const SID_ATTR_PASS = new Int32Array([
   BIT_FLAGS[_CNT++], // COL4:
   BIT_FLAGS[_CNT++], // WPOS2:
   BIT_FLAGS[_CNT++], // VPOS2:
   BIT_FLAGS[_CNT++], // DIM2:
   BIT_FLAGS[_CNT++], // TIME:
   BIT_FLAGS[_CNT++], // R_CORNERS:
   BIT_FLAGS[_CNT++], // BORDER:
   BIT_FLAGS[_CNT++], // FEATHER:
   BIT_FLAGS[_CNT++], // GLOW_INTENSITY:
   BIT_FLAGS[_CNT++], // TEX2:
   // BIT_FLAGS[_CNT++], // SCALE2:
   // BIT_FLAGS[_CNT++], // SDF:
   // BIT_FLAGS[_CNT++], // MSDF:
   // BIT_FLAGS[_CNT++], // COL4_PER_VERTEX:
]);
const SID_ATTR_PASS_SIZE = _CNT;
export function Shader_bit_flags_build_SID_ATTR_PASS(){ return SID_ATTR_PASS; }
export function Shader_bit_flags_get_attr_pass_size() { return SID_ATTR_PASS_SIZE; }
// This structure is for retrieving info like type, name etc(sequence of array elements does NOT matter)
const ATTRIBUTES_PASS = [
   {FLAG:SID_ATTR_PASS.COL4,               TYPE:GL_TYPES.FLOAT_VEC4,   TYPE_SIZE:4,    KEY_NAME:'COL4',            ATTR_NAME:'col4'},
   {FLAG:SID_ATTR_PASS.WPOS3,              TYPE:GL_TYPES.FLOAT_VEC3,   TYPE_SIZE:3,    KEY_NAME:'WPOS3',           ATTR_NAME:'wpos3'},
   {FLAG:SID_ATTR_PASS.WPOS2,              TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'WPOS2',           ATTR_NAME:'wpos2'},
   {FLAG:SID_ATTR_PASS.VPOS2,              TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'VPOS2',           ATTR_NAME:'pos2'},
   {FLAG:SID_ATTR_PASS.DIM2,               TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'DIM2',            ATTR_NAME:'dim2'},
   {FLAG:SID_ATTR_PASS.TIME,               TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'TIME',            ATTR_NAME:'time'},
   {FLAG:SID_ATTR_PASS.R_CORNERS,          TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'R_CORNERS',       ATTR_NAME:'rcorners'},
   {FLAG:SID_ATTR_PASS.BORDER,             TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'BORDER',          ATTR_NAME:'border'},
   {FLAG:SID_ATTR_PASS.FEATHER,            TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'FEATHER',         ATTR_NAME:'feather'},
   {FLAG:SID_ATTR_PASS.GLOW_INTENSITY,     TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'GLOW_INTENSITY',  ATTR_NAME:'glow_intensity'},
   {FLAG:SID_ATTR_PASS.TEX2,               TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'TEX2',            ATTR_NAME:'tex2'},
   // {FLAG:SID_ATTR.SCALE2,             TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'SCALE2',          ATTR_NAME:'scale2'},
   // {FLAG:SID_ATTR.SDF,                TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'SDF',             ATTR_NAME:'sdf'},
   // {FLAG:SID_ATTR.MSDF,               TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'MSDF',            ATTR_NAME:'msdf'},
];
const ATTRIBUTES_PASS_SIZE = ATTRIBUTES_PASS.length;
console.log('$$$ ATTRIBUTES_PASS', ATTRIBUTES_PASS);
export function Shader_bit_flags_get_attr_pass_info_from_index(idx){
   if(DEBUG.DEFENSIVE) if(idx < 0 || idx >= ATTRIBUTES_PASS_SIZE || idx === null || idx === undefined) alert('55133219772 \n ATTRIBUTES_PASS: BAD array indexing')
      return ATTRIBUTES_PASS[idx]; 
}
export function Shader_bit_flags_get_attr_pass_flag_from_flag(attr_flag){
   const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);
   return ATTRIBUTES_PASS[idx].FLAG;
}
export function Shader_bit_flags_get_attr_pass_info_from_flag(attr_flag){
   const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);
   return ATTRIBUTES_PASS[idx];
}
export function Shader_bit_flags_get_attr_pass_key_name_from_flag(attr_flag){
   const idx = MASKS_GET_INDEX_FROM_FLAG(attr_flag);
   return ATTRIBUTES_PASS[idx].KEY_NAME;
}