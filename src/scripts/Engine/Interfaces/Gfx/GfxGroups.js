"use strict";


import { M_Buffer } from "../../Core/Buffers.js";




const DISABLE_DEBUG = false;



const _gfx_groups = new M_Buffer();



export function Gfx_groups_get(){ return _gfx_groups; }



export function Gfx_groups_get_group_byidx(groupidx){ 
   if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups, groupidx, new Error().lineNumber);
   return _gfx_groups.buffer[groupidx]; 
}



export function Gfx_groups_create_group(){ 
   
   // First elment for program index, second element for vertex buffer index
   const group = new M_Buffer();

   const groupidx = _gfx_groups.Add(group); 

   return groupidx;
}



export function Gfx_groups_add_to_group(groupidx, progidx, vbidx){ 
   if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups, groupidx, new Error().lineNumber);
   
   // First elment for program index, second element for vertex buffer index
   const entry = [progidx, vbidx];

   const entryidx = _gfx_groups.buffer[groupidx].Add(new_register); 

   return entryidx; // UNNECESSARY: the group is used mainly to act on vertex buffers, so this index is not going to be used.
}










/****************************************************************************************************************************************************/
// DEBUG
/****************************************************************************************************************************************************/

function DEBUG_PRINT(buffer, index, line) {
   if (index < 0 || index > buffer.boundary) {
       console.error('Index is out of bounds. @GfxGroups.js.\nLine:', line, 'index:', index, buffer);
       alert('Index is out of bounds. @GfxGroups.js');
   }
   if (buffer.buffer[index] === null) {
       console.error('Buffer at index is NULL. @GfxGroups.js\nLine:', line, 'index:', index, buffer);
       alert('Buffer at index is NULL. @GfxGroups.js.');
   }
}



export function Gfx_groups_print() {
   console.log('GfxGroups:', _vertex_buffers)
}
