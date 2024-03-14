// "use strict";


// import { M_Buffer } from "../../Core/Buffers.js";




// const DISABLE_DEBUG = false;



// const _gfx_groups = new M_Buffer();



// export function Gfx_groups_get() { return _gfx_groups; }



// export function Gfx_groups_get_groupidx(groupidx) {
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups, groupidx, new Error().lineNumber);
//    return _gfx_groups.buffer[groupidx];
// }



// export function Gfx_groups_get_progidx(groupidx, group_progidx) {
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups, groupidx, new Error().lineNumber);
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups.buffer[groupidx], group_progidx, new Error().lineNumber);
//    return _gfx_groups.buffer[groupidx].buffer[group_progidx];
// }



// export function Gfx_groups_create_group() {

//    // First elment for program index, second element for vertex buffer index
//    const group = new M_Buffer();

//    const groupidx = _gfx_groups.Add(group);

//    return groupidx;
// }



// export function Gfx_groups_store_program(groupidx, progidx) {
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups, groupidx, new Error().lineNumber);

//    // let found = INT_NULL;
//    // for (let i = 0; i <= _gfx_groups.boundary; i++) {
      
//    //    const group = _gfx_groups.buffer[i];
//    //    for (let j = 0; j <= group.boundary; j++) {
//    //       if(group){
//    //          found = j;
//    //          return j;
//    //       }
//    //    }
//    // }
   
//    // if (!_gfx_groups.buffer[i].buffer) {
//    //    // const group_progidx = _gfx_groups.buffer[groupidx].Add(progidx); 
//    //    const group_progidx = _gfx_groups.buffer[groupidx].Add(new M_Buffer());
//    //    return group_progidx;
//    // }

//    if(_gfx_groups.buffer[groupidx].buffer[progidx]){
//       return j;
//    }
   
//    if (!_gfx_groups.buffer[groupidx].buffer[progidx]) {
//       // const group_progidx = _gfx_groups.buffer[groupidx].Add(progidx); 
//       const group_progidx = _gfx_groups.buffer[groupidx].Add(new M_Buffer());
//       return group_progidx;
//    }

//    alert('No progidx found for group');
//    // return _gfx_groups[groupidx].buffer[found]

// }



// export function Gfx_groups_store_vertex_buffer(groupidx, progidx, vbidx) {
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups, groupidx, new Error().lineNumber);
//    if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups.buffer[groupidx], progidx, new Error().lineNumber);

//    let group_progidx = INT_NULL;
//    // Check if group_program exists
//    if(_gfx_groups.buffer[groupidx].buffer[progidx]){
//       group_progidx = progidx;
//    }
//    else{
//       group_progidx = _gfx_groups.buffer[groupidx].Add(new M_Buffer());
//    }
   

//    const group_vbidx = _gfx_groups.buffer[groupidx].buffer[progidx].Add(vbidx);

//    return group_vbidx;
// }



// // export function Gfx_groups_add_to_group(groupidx, progidx, vbidx){ 
// //    if (!DISABLE_DEBUG) DEBUG_PRINT(_gfx_groups, groupidx, new Error().lineNumber);

// //    // First elment for program index, second element for vertex buffer index
// //    const entry = [progidx, vbidx];

// //    const entryidx = _gfx_groups.buffer[groupidx].Add(new_register); 

// //    return entryidx; // UNNECESSARY: the group is used mainly to act on vertex buffers, so this index is not going to be used.
// // }




// export function Gfx_groups_exists(groupidx) {
//    if (groupidx < 0 || groupidx > _gfx_groups.boundary || _gfx_groups.buffer[groupidx] == undefined)
//       return INT_NULL;
//    return _gfx_groups.buffer[groupidx];
// }


















// /****************************************************************************************************************************************************/
// // DEBUG
// /****************************************************************************************************************************************************/

// function DEBUG_PRINT(buffer, index, line) {
//    if (index < 0 || index > buffer.boundary) {
//       console.error('Index is out of bounds. @GfxGroups.js.\nLine:', line, 'index:', index, buffer);
//       alert('Index is out of bounds. @GfxGroups.js');
//    }
//    if (buffer.buffer[index] === null) {
//       console.error('Buffer at index is NULL. @GfxGroups.js\nLine:', line, 'index:', index, buffer);
//       alert('Buffer at index is NULL. @GfxGroups.js.');
//    }
// }



// export function Gfx_groups_print() {
//    console.log('GfxGroups:', _vertex_buffers)
// }
