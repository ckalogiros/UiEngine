"use strict";

import { New_generic_buffer } from "./Core/Buffers.js";



//TODO: Make 'New_int16_buffer'
// ALSO: Do we give the smae index to a mesh for all three buffers????? 1to1 ratio buffers


const _margin_buffer = New_generic_buffer();
const _pad_buffer = New_generic_buffer();
const _hover_margin_buffer = New_generic_buffer();










/*******************************************************************************************************************************************/
// CREATE

export function Styles_margin_create(margin=[0,0]){ return _margin_buffer.Add(margin); }




export function Styles_hover_margin_create(margin=[0,0]){ return _hover_margin_buffer.Add(margin); }




export function Styles_pad_create(pad=[0,0]){ return _pad_buffer.Add(pad); }







/*******************************************************************************************************************************************/
// GET

function Margin_get(idx){ return _margin_buffer.buffer[idx]; }
function Margin_get_x(idx){ return _margin_buffer.buffer[idx][0]; }
function Margin_get_y(idx){ return _margin_buffer.buffer[idx][1]; }
const margin_fn_table = [ Margin_get, Margin_get_x, Margin_get_y, ];
export function Styles_margin_get(axis=0, idx){ return margin_fn_table[axis](idx); }




function Hover_margin_get(idx){ return _hover_margin_buffer.buffer[idx]; }
function Hover_margin_get_x(idx){ return _hover_margin_buffer.buffer[idx][0]; }
function Hover_margin_get_y(idx){ return _hover_margin_buffer.buffer[idx][1]; }
const hover_margin_fn_table = [ Hover_margin_get, Hover_margin_get_x, Hover_margin_get_y, ];
export function Styles_hover_margin_get(axis=0, idx){ return hover_margin_fn_table[axis](idx); }




function Pad_get(idx){ return _pad_buffer.buffer[idx]; }
function Pad_get_x(idx){ return _pad_buffer.buffer[idx][0]; }
function Pad_get_y(idx){ return _pad_buffer.buffer[idx][1]; }
const pad_fn_table = [ Pad_get, Pad_get_x, Pad_get_y, ];
export function Styles_pad_get(axis=0, idx){ return pad_fn_table[axis](idx); }












/*******************************************************************************************************************************************/
// SET

export function Styles_margin_set(idx, margin){
   // TODOD: DEBUG the idx if exists and in boundaries
   _margin_buffer.buffer[idx][0] = margin[0];
   _margin_buffer.buffer[idx][1] = margin[1];
}




export function Styles_hover_margin_set(idx, margin){
   // TODOD: DEBUG the idx if exists and in boundaries
   _hover_margin_buffer.buffer[idx][0] = margin[0];
   _hover_margin_buffer.buffer[idx][1] = margin[1];
}




export function Styles_pad_set(idx, pad){
   // TODOD: DEBUG the idx if exists and in boundaries
   _pad_buffer.buffer[idx][0] = pad[0];
   _pad_buffer.buffer[idx][1] = pad[1];
}












/*******************************************************************************************************************************************/
// DESTROY

export function Styles_margin_destroy(idx){
   // TODOD: DEBUG the idx if exists and in boundaries
   _margin_buffer.RemoveByIdx(idx);
}




export function Styles_hover_margin_destroy(idx){
   // TODOD: DEBUG the idx if exists and in boundaries
   _hover_margin_buffer.RemoveByIdx(idx);
}




export function Styles_pad_destroy(idx){
   // TODOD: DEBUG the idx if exists and in boundaries
   _pad_buffer.RemoveByIdx(idx);
}























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/

_margin_buffer
_pad_buffer
_hover_margin_buffer
export function Styles_margin_print() { console.log('_margin_buffer:', _margin_buffer); }
export function Styles_hover_margin_print() { console.log('_margin_buffer:', _hover_margin_buffer); }
export function Styles_pad_buffer_print() { console.log('_pad_buffer:', _pad_buffer); }

export function Styles_margin_print_loop() { 

   for (let i = 0; i <= _margin_buffer.boundary; i++) {

      const marg = _margin_buffer.buffer[i];
      console.log(' ', j, `marg:${marg[i]}`);
   }
}

export function Styles_hover_margin_print_loop() { 

   for (let i = 0; i <= _hover_margin_buffer.boundary; i++) {

      const hover_marg = _hover_margin_buffer.buffer[i];
      console.log(' ', j, `hover marg:${hover_marg[i]}`);
   }
}

export function Styles_pad_buffer_print_loop() { 

   for (let i = 0; i <= _pad_buffer.boundary; i++) {

      const pad = _pad_buffer.buffer[i];
      console.log(' ', j, `marg x:${pad[i]}`);
   }
}

