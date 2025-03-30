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
]);

const BIT_FLAGS_SIZE = BIT_FLAGS.length;
if(BIT_FLAGS[BIT_FLAGS_SIZE] > MAX_BIT_MASK || BIT_FLAGS[BIT_FLAGS_SIZE] <= 0 ) alert('BIT_FLAGS exceeding javascript\'s max number value');


let _counter = 0;

// Contructs a table off all App's attributes as indexes OR bit flags accordingly
export class Shader_Attributes {

   
   constructor(initialize_for_indexing=false, init_val={}){

      const default_values = {
         COL4: BIT_FLAGS[_counter++],
         COL4_PER_VERTEX: BIT_FLAGS[_counter++],
         WPOS3: BIT_FLAGS[_counter++],
         WPOS2: BIT_FLAGS[_counter++],
         VPOS2: BIT_FLAGS[_counter++],
         DIM2: BIT_FLAGS[_counter++],
         TEX2: BIT_FLAGS[_counter++],
         R_CORNERS: BIT_FLAGS[_counter++],
         FEATHER: BIT_FLAGS[_counter++],
         TIME: BIT_FLAGS[_counter++],
         ANGLE: BIT_FLAGS[_counter++],
         SCALE2: BIT_FLAGS[_counter++],
         BORDER: BIT_FLAGS[_counter++],
         SDF: BIT_FLAGS[_counter++],
         MSDF: BIT_FLAGS[_counter++],
         GENERIC2: BIT_FLAGS[_counter++],
      };

      /**
       * 4 Initialization Combinations.
       * Initialize table as:
       *    1. Indexes (values drawn from 'init_val' parameter as fields of object OR a single value). 
       *    2. Bit flags(values drawn from 'default_values' constant variable);
       */

      // Initialize bit flags table.
      if(typeof init_val === 'object' && init_val !== null) {

         for (let [key, value] of Object.entries(default_values)) {
            this[key] = (initialize_for_indexing) ? init_val[key] : value;
         }
      }
      // Initialize indexes table
      else {
         for (let [key, value] of Object.entries(default_values)) {
            this[key] = init_val;
         }
      }

   }
   // If this table is used as indexe: Set the Shader's attribute's location index from a predetermine table 
   SetAttributeLocIdx(attr_flag, attribs_loc_idx) {

      for (let [key, value] of Object.entries(this)) {
         
         const sample = Shader_bit_flags_get_attr_info_from_flag(attr_flag)
         if(key === sample.KEY_NAME){
            this[key] = attribs_loc_idx;
         }
      }
   }
   // Debug-Print
   PrintEnabled(info=null) {
      if(info) console.log(info);
   }

} 

// This is the shader attributes bit flags table, from wich the global SID.ATTR constant draws its values from 
const SID_ATTR = new Shader_Attributes();
const SID_ATTR_SIZE = _counter;
export function Shader_bit_flags_build_SID_ATTR(){ return SID_ATTR; }
export function Shader_bit_flags_get_attr_size() { return SID_ATTR_SIZE; }



// To add/remove attributes, both (SID_ATTR and ATTRIBUTES) structures must be updated manually

_counter = 0;
// This structure is for retrieving info like type, name etc
// This is a structure of shader attributes with more information (type, byte size, name, etc)
// IMPORTANT: sequence of array elements matters and MUST match the Shader_Attributes 'default_values' 
const ATTRIBUTES = [
   {FLAG:SID_ATTR.COL4,               IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC4,   TYPE_SIZE:4,    KEY_NAME:'COL4',            ATTR_NAME:'col4'},
   {FLAG:SID_ATTR.COL4_PER_VERTEX,    IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC4,   TYPE_SIZE:4,    KEY_NAME:'COL4_PER_VERTEX', ATTR_NAME:'col4'},
   {FLAG:SID_ATTR.WPOS3,              IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC3,   TYPE_SIZE:3,    KEY_NAME:'WPOS3',           ATTR_NAME:'wpos3'},
   {FLAG:SID_ATTR.WPOS2,              IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'WPOS2',           ATTR_NAME:'wpos2'},
   {FLAG:SID_ATTR.VPOS2,              IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'VPOS2',           ATTR_NAME:'pos2'},
   {FLAG:SID_ATTR.DIM2,               IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'DIM2',            ATTR_NAME:'dim2'},
   {FLAG:SID_ATTR.TEX2,               IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'TEX2',            ATTR_NAME:'tex2'},
   {FLAG:SID_ATTR.R_CORNERS,          IDX:_counter++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'R_CORNERS',       ATTR_NAME:'rcorners'},
   {FLAG:SID_ATTR.FEATHER,            IDX:_counter++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'FEATHER',         ATTR_NAME:'feather'},
   {FLAG:SID_ATTR.TIME,               IDX:_counter++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'TIME',            ATTR_NAME:'time'},
   {FLAG:SID_ATTR.ANGLE,              IDX:_counter++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'ANGLE',           ATTR_NAME:'angle'},
   {FLAG:SID_ATTR.SCALE2,             IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'SCALE2',          ATTR_NAME:'scale2'},
   {FLAG:SID_ATTR.BORDER,             IDX:_counter++,    TYPE:GL_TYPES.FLOAT,        TYPE_SIZE:1,    KEY_NAME:'BORDER',          ATTR_NAME:'border'},
   {FLAG:SID_ATTR.SDF,                IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'SDF',             ATTR_NAME:'sdf'},
   {FLAG:SID_ATTR.MSDF,               IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'MSDF',            ATTR_NAME:'msdf'},
   {FLAG:SID_ATTR.GENERIC2,           IDX:_counter++,    TYPE:GL_TYPES.FLOAT_VEC2,   TYPE_SIZE:2,    KEY_NAME:'GENERIC2',        ATTR_NAME:'generic2'},
];

const ATTRIBUTES_SIZE = ATTRIBUTES.length;

export function Shader_bit_flags_get_attr_info_from_index(idx){
   if(DEBUG.DEFENSIVE) if(idx < 0 || idx >= ATTRIBUTES_SIZE || idx === null || idx === undefined) 
      alert('55133219772 \n ATTRIBUTES: BAD array indexing')
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

// Debug-Print
export function Shader_bit_flags_print_enabled_attributes(attr_flags, info){
   
   console.log(info);
   // for(let i=0; i<SID_ATTR_SIZE;  i++) {
   for(let i=0; i<SID_ATTR_SIZE;  i++) {

      if(attr_flags & ATTRIBUTES[i].FLAG)
         console.log(ATTRIBUTES[i].KEY_NAME);
   }
   console.log('-------------------------------------------------------------');
}








/************************************************************************************************************/
// Check for the to structures to match
// TODO: Check if the attributes sequence is matching too, not only the number of attributes
if(SID_ATTR_SIZE !== ATTRIBUTES_SIZE) alert('55133219770 \n SID_ATTR_SIZE and ATTRIBUTES_SIZE size mismatch');
/************************************************************************************************************/



// Transform bit flag to index
function MASKS_GET_INDEX_FROM_FLAG(MASK){
   return Math.log2(MASK);
}

// These ar the type sizes of a shader location. (Shader code example: in float, in vec2, in vec3, in vec4
const ATTR_TYPES = [1, 2, 3, 4];
export function Attribute_get_type_size(sid_attr_bit_flag){
   if(DEBUG.DEFENSIVE) if(sid_attr_bit_flag < 0 || sid_attr_bit_flag > ATTRIBUTES[sid_attr_bit_flag].FLAG) alert('55133219774 \n ATTR_TYPE: index out of bounds');
   return ATTRIBUTES[sid_attr_bit_flag].TYPE_SIZE;
}

// These are the fields for a complete vec4 attribute location
const ATTR_TYPES_EXTENSION = ['x', 'y', 'z', 'w'];
export function Attribute_get_type_extension(idx){
   const len = ATTR_TYPES.length-1;
   if(DEBUG.DEFENSIVE) if(idx < 0 || idx > len) alert('55133219775 \n ATTR_TYPES_EXTENSION: index out of bounds')
   return ATTR_TYPES_EXTENSION[idx];
}


