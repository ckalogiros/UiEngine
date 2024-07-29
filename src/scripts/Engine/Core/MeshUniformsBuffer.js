/**
 * A buffer to store uniform values per vertex buffer,
 * so that we bind a different uniform per vertex buffer
 * inside the Draw() function.
 */


"use strict";

import { Uniforms_buffer_set_uniform } from "../../Graphics/Buffers/UniformBuffers.js";
import { New_generic_buffer } from "./Buffers.js";
import { Mesh_buffer_get_mesh_byidx } from "./MeshBuffer.js";
import { Str_buffer_mesh_names_get_by_idx } from "./StringBuffer.js";



/*******************************************************************************************************************************************************************************/
// Screen World Position:
// The position of the screen, starting at top=0, left=0
// Used for screen scrolling
// All other positions draw from the screen position to calculate their position 
/*******************************************************************************************************************************************************************************/

const _screen_wpos = new Int16Array([0, 0]);

export function Screen_wpos_get() { return _screen_wpos; }


export function Screen_wpos_get_x() { return _screen_wpos[0]; }


export function Screen_wpos_get_y() { return _screen_wpos[1]; }


export function Screen_wpos_add_y(y) { _screen_wpos[1] += y; }


export function Screen_wpos_set_y(y) { _screen_wpos[1] = y; }















/*******************************************************************************************************************************************************************************/
// Widget Root Positions as uniforms per vertex buffer 
/*******************************************************************************************************************************************************************************/
const _per_vb_mesh_unif_wpos = New_generic_buffer(_, '_per_vb_mesh_unif_wpos');
const _per_vb_mesh_unif_wpos_ubidxs = New_generic_buffer(_, '_per_vb_mesh_unif_wpos_ubidxs');
const _debug_names_per_vb_mesh_unif_wpos = New_generic_buffer(_, '_debug_names_per_vb_mesh_unif_wpos');
const _debug_names_all_meshes_per_vb_unif = New_generic_buffer(_, '_debug_names_all_meshes_per_vb_unif');




export function Mesh_unif_wpos_get_count() { return _per_vb_mesh_unif_wpos.active_count; }
export function Mesh_unif_wpos_get_size() { return _per_vb_mesh_unif_wpos.size; }



// IMPORTANT! The index of a root wpos is the same as the vb_groupidx and same as mesh.root_posidx
// Each element(world position uniform) has the same index as the index of the vertex buffer. Cause each vertex buuffer has a 'u_wpos'. 
export function Mesh_unif_create_vb_root_wpos(mesh_bufferidx, mesh_pos, mesh_type, mesh_nameidx, mesh_parent=null, debug_vb_groupidx, ubidx, has_absolute_pos=0x0, HAS_STICKY_POS=0x0) {


   // Decide if the mesh has a 'root wpos' position to anothers mesh 'root wpos' position. If yes, set the new wpos's parent field with the index of the parent wpos 
   let meshidx = mesh_bufferidx;
   let parent_posidx = INT_NULL
   /**DEBUG*/ let parent_meshidx = INT_NULL; // For debugging
   const wpos = [0, 0];

   wpos[0] = mesh_pos[0];
   wpos[1] = mesh_pos[1];


   // if (mesh_parent !== null && mesh_parent.type & MESH_TYPE.SECTION_MESH) { // Only Section classes are allowed to have offset 'root wpos' to another 'root wpos'
   if (mesh_parent !== null){


      parent_meshidx = mesh_parent.mesh_bufferidx;
      parent_posidx = mesh_parent.root_posidx;

   }

   // If the mesh is a text mesh, we want to connect it(take its wpos offset) from any 'root wpos' that the parent of the text mesh takes its offset position.
   // See code below for explanation
   if (mesh_parent !== null && mesh_type & MESH_TYPE.TEXT_MESH) {

      const root_posidx = mesh_parent.root_posidx;

      // Here we want to get the 'root wpos' of the 'root wpos' that the text mesh's parent its connected to.
      let parent_root_wpos = _per_vb_mesh_unif_wpos.buffer[root_posidx]; // Get the text's parent's 'root wpos'{text->lebel->label-parent}

      /**
       * For Example: there are 3 meshes:{rect, label and label text}. 
       * What we want for the label text is to have as a parent 'root wpos' the parent 'root wpos' of the label. 
       * That is the rect's 'root wpos' in this example.  
       * Other wise the text will draw its offset pos from label, which in its turn will draw its offset pos from the rect.
       * The correct is both label and text have offset positions to rect.
       */
      // if (parent_root_wpos.parent_posidx !== INT_NULL) { // If parents 'root wpos' has a parent wpos, use it instead.
      //    parent_root_wpos = _per_vb_mesh_unif_wpos.buffer[parent_root_wpos.parent_posidx];
      // }
      
      // Now, because we are gonna need the 'mesh_bufferidx' of the 'root wpos', we need to get the mesh from the mesh buffer.
      const mesh_that_has_the_root_wpos = Mesh_buffer_get_mesh_byidx(parent_root_wpos.meshidx);
      // const mesh_that_has_the_root_wpos = _mesh_buffer.buffer[parent_root_wpos.meshidx];
      parent_meshidx = mesh_that_has_the_root_wpos.mesh_bufferidx;
      parent_posidx = mesh_that_has_the_root_wpos.root_posidx;

      // If wpos is text(seperate vb), we don't want the wpos offset to store the first text's pos as the offset of all texts that draw from the wpos
      wpos[0] = 0;
      wpos[1] = 0;
   }
   else{

      mesh_pos[0] = 0;
      mesh_pos[1] = 0;
   }

   const entry = {
      wpos: [0, 0],
      meshidx: meshidx, // Is needed to have a ref to the mesh from inside the '_per_vb_mesh_unif_wpos' buffer
      parent_posidx: parent_posidx,
      debug_vb_groupidx:debug_vb_groupidx,
      has_absolute_pos: has_absolute_pos,
      sticky_pos: HAS_STICKY_POS,
      scroll_bar: INT_NULL, // unif_wpos index for any scrollbar. Use: Move the scrollbar with the root mesh move (seperately), because the scrollbars aren't children of any root unif
   }

   entry.wpos[0] += wpos[0];
   entry.wpos[1] += wpos[1];

   _debug_names_per_vb_mesh_unif_wpos.Add({ nameidx: mesh_nameidx, parent_meshidx: parent_meshidx, vbidx:debug_vb_groupidx });

   const idx = _per_vb_mesh_unif_wpos.Add(entry);
   // _debug_names_all_meshes_per_vb_unif.Add()


   // Store the uniform's index, for updating the uuniforms on position change
   const wpos_ubidx_idx = _per_vb_mesh_unif_wpos_ubidxs.Add(ubidx);
   if(wpos_ubidx_idx !== idx) alert('unif wpos idx does not match the ubidx wpos idx');


   return idx;
}



export function Mesh_unif_set_from_existing_vb_root_wpos(mesh_bufferidx, mesh_pos, mesh_type, mesh_nameidx, mesh_parent=null, vb_groupidx, has_absolute_pos=0x0, HAS_STICKY_POS=0x0) {
   // TODO: check NULL object

   // Decide if the mesh has a 'root wpos' position to anothers mesh 'root wpos' position. If yes, set the new wpos's parent field with the index of the parent wpos 
   let meshidx = mesh_bufferidx;
   let parent_posidx = INT_NULL
   /**DEBUG*/ let parent_meshidx = INT_NULL; // For debugging
   const wpos = [0, 0];

   wpos[0] = mesh_pos[0];
   wpos[1] = mesh_pos[1];
 

   if (mesh_parent !== null && mesh_parent.type & MESH_TYPE.SECTION_MESH) { // Only Section classes are allowed to have offset 'root wpos' to another 'root wpos'


      parent_meshidx = mesh_parent.mesh_bufferidx;
      parent_posidx = mesh_parent.root_posidx;

   }

   // If the mesh is a text mesh, we want to connect it(take its wpos offset) from any 'root wpos' that the parent of the text mesh takes its offset position.
   // See code below for explanation
   if (mesh_parent !== null && mesh_type & MESH_TYPE.TEXT_MESH) {

      const root_posidx = mesh_parent.root_posidx;
      // console.log('/////////////////////////////////////////////////////////', root_posidx)

      // Here we want to get the 'root wpos' of the 'root wpos' that the text mesh's parent its connected to.
      let parent_root_wpos = _per_vb_mesh_unif_wpos.buffer[root_posidx]; // Get the text's parent's 'root wpos'{text->lebel->label-parent}
      // if (parent_root_wpos.parent_posidx !== INT_NULL) { // If parents 'root wpos' has a parent wpos, use it instead.
      //    parent_root_wpos = _per_vb_mesh_unif_wpos.buffer[parent_root_wpos.parent_posidx];
      // }
      
      // Now, because we are gonna need the 'mesh_bufferidx' of the 'root wpos', we need to get the mesh from the mesh buffer.
      const mesh_that_has_the_root_wpos = Mesh_buffer_get_mesh_byidx(parent_root_wpos.meshidx);
      // const mesh_that_has_the_root_wpos = _mesh_buffer.buffer[parent_root_wpos.meshidx];
      parent_meshidx = mesh_that_has_the_root_wpos.mesh_bufferidx;
      parent_posidx = mesh_that_has_the_root_wpos.root_posidx;

      // If wpos is text(seperate vb), we don't want the wpos offset to store the first text's pos as the offset of all texts that draw from the wpos
      wpos[0] = 0;
      wpos[1] = 0;
   }
   else{

      mesh_pos[0] = 0;
      mesh_pos[1] = 0;
   }

   const unif_wpos = _per_vb_mesh_unif_wpos.buffer[vb_groupidx];
   unif_wpos.wpos[0] = wpos[0];
   unif_wpos.wpos[1] = wpos[1];
   unif_wpos.meshidx = meshidx;
   unif_wpos.parent_posidx = parent_posidx;
   unif_wpos.debug_vb_groupidx = vb_groupidx;
   unif_wpos.has_absolute_pos = has_absolute_pos;
   unif_wpos.sticky_pos = HAS_STICKY_POS;
   unif_wpos.scroll_bar = INT_NULL;


   const dbg_for_unifwpos = _debug_names_per_vb_mesh_unif_wpos.buffer[vb_groupidx];
   dbg_for_unifwpos.nameidx = mesh_nameidx;
   dbg_for_unifwpos.parent_meshidx = parent_meshidx;
   dbg_for_unifwpos.vbidx = vb_groupidx;
   // _debug_names_per_vb_mesh_unif_wpos.Add({ nameidx: mesh_nameidx, parent_meshidx: parent_meshidx, vbidx:debug_vb_groupidx });

   return vb_groupidx; // Return this unif wpos index(which matches the vb_groupidx)
}



export function Mesh_unif_store_vb_root_wpos(root_posidx, x, y) {
   // TODO: check NULL object

   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] = x;
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] = y;
}



export function Mesh_unif_is_vb_root_wpos(root_posidx, meshidx) {
   if(_per_vb_mesh_unif_wpos.buffer[root_posidx] === undefined) return false;
   if(_per_vb_mesh_unif_wpos.buffer[root_posidx].meshidx === meshidx) return true;
   return false;
}





/*********************************************************************************************************/
// GETTERS
// Can take vbidx as the 'idx' to return the wpos for all meshes of a vertex buffer
export function Mesh_unif_get_vb_root_wpos_meshidx(root_posidx) {
   return _per_vb_mesh_unif_wpos.buffer[root_posidx].meshidx;
}

// TODO: 
// EFFICIENCY: Pass a buffer to store the positions. Too much 'heat' of the js GarbageColector

export function Mesh_unif_get_vb_root_wpos(root_posidx) {
   const pos = Mesh_unif_get_vb_root_wpos_recursive(root_posidx);

   if( _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos === 0){
      pos[0] += _screen_wpos[0];
      pos[1] += _screen_wpos[1];
   }
   return pos;
}
function Mesh_unif_get_vb_root_wpos_recursive(root_posidx) {

   const _this = _per_vb_mesh_unif_wpos.buffer[root_posidx];
   let pos = [_this.wpos[0], _this.wpos[1]];

   // If this relative position has a parent position, add it
   if (_this.parent_posidx !== INT_NULL) {
      const p = Mesh_unif_get_vb_root_wpos_recursive(_this.parent_posidx);
      pos[0] += p[0];
      pos[1] += p[1];
   }

   return pos;
}



export function Mesh_unif_get_vb_root_wposx(root_posidx) {
   const pos = Mesh_unif_get_vb_root_wposx_recursive(root_posidx);
   return pos + _screen_wpos[0];
}
function Mesh_unif_get_vb_root_wposx_recursive(root_posidx) {

   const _this = _per_vb_mesh_unif_wpos.buffer[root_posidx];
   let pos = _this.wpos[0];

   // If this relative position has a parent position, add it
   if (_this.parent_posidx !== INT_NULL) {
      const p = Mesh_unif_get_vb_root_wposx_recursive(_this.parent_posidx);
      pos += p;
   }

   return pos;
}



export function Mesh_unif_get_vb_root_wposy(root_posidx) {
   const pos = Mesh_unif_get_vb_root_wposy_recursive(root_posidx);
   return pos;
}
function Mesh_unif_get_vb_root_wposy_recursive(root_posidx) {

   const _this = _per_vb_mesh_unif_wpos.buffer[root_posidx];
   let pos = _this.wpos[1];

   // If this relative position has a parent position, add it
   if (_this.parent_posidx !== INT_NULL) {
      const p = Mesh_unif_get_vb_root_wposy_recursive(_this.parent_posidx);
      pos += p;
   }

   return pos;
}





/*********************************************************************************************************/
// SETTERS

export function Mesh_unif_set_vb_root_wpos_all_siblings(root_posidx, x, y){

   const parent_rootidx = _per_vb_mesh_unif_wpos.buffer[root_posidx].parent_posidx;
   // Run from parent root_posidx to the end of buffer, and add the pos to any elem that is a sibling(same parent)
   // BUG: Assuming the parent always is before any children, which probably it is not the case when root wpos's are removed and new are replacing existing elements
   for(let i=parent_rootidx+1; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
      const elem = _per_vb_mesh_unif_wpos.buffer[i];
      if(elem.parent_posidx === parent_rootidx){
         _per_vb_mesh_unif_wpos.buffer[i].wpos[0] = x;
         _per_vb_mesh_unif_wpos.buffer[i].wpos[1] = y;
      }
   }
}


export function Mesh_unif_set_vb_root_wpos(root_posidx, x, y) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] = x;
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] = y;
}



export function Mesh_unif_set_vb_root_wposx(root_posidx, x) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] = x;
}



/** Set wpos for all roots with the same parent */
export function Mesh_unif_set_vb_root_wposx_all_siblings(root_posidx, x) {
   
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] = x;
   
   const parent_rootidx = _per_vb_mesh_unif_wpos.buffer[root_posidx].parent_posidx;
   if(parent_rootidx === INT_NULL) return;

   
   // Run from parent root_posidx to the end of buffer, and add the pos to any elem that is a sibling(same parent)
   // BUG: Assuming the parent always is before any children, which probably it is not the case when root wpos's are removed and new are replacing existing elements
   for(let i=parent_rootidx+1; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
      const elem = _per_vb_mesh_unif_wpos.buffer[i];
      if(elem.parent_posidx === parent_rootidx){
         _per_vb_mesh_unif_wpos.buffer[i].wpos[0] = x;
      }
   }
}



export function Mesh_unif_set_vb_root_wposy(root_posidx, y) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] = y;
}



/*************************************************************************************************************/
export function Mesh_unif_add_vb_root_wpos(root_posidx, x, y) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] += x;
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] += y;

   /**
    * Move any scroll bars that belong to any unif_wpos below current unif_wpos(in the tree structure, children-tree)
    */
   for(let i=0; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
      const elem = _per_vb_mesh_unif_wpos.buffer[i];

      // console.log(i)
      if(elem.scroll_bar !== INT_NULL && 
         ( _per_vb_mesh_unif_wpos.buffer[i].parent_posidx === root_posidx || //Meaning the unif that has a scrollbar(i) must be child of the current moved unif (root_posidx)
         i === root_posidx ) // Or the current i is the one that has the scrollbar 
      ){

         // _per_vb_mesh_unif_wpos.buffer[elem.scroll_bar].wpos[0] += x;
         // _per_vb_mesh_unif_wpos.buffer[elem.scroll_bar].wpos[1] += y;

         /** MOVE THE SCROLLBAR MESH INSTEAD OF IT'S UNIF WPOS. This impl is for storing scrollbars in the same vertex buffer */
         // TODO: It is not correct to set the mesh pos here, but is the easiest way to have access to all scrollbars.
         const scrollbaridx = _per_vb_mesh_unif_wpos.buffer[elem.scroll_bar].meshidx;
         const scrollbar = Mesh_buffer_get_mesh_byidx(scrollbaridx);

         const handle = scrollbar.children.buffer[0];
         scrollbar.geom.pos[0] += x;
         scrollbar.geom.pos[1] += y;
         scrollbar.geom.AddWposXY(scrollbar.gfx, x, y);
         handle.geom.pos[0] += x;
         handle.geom.pos[1] += y;
         handle.geom.AddWposXY(handle.gfx, x, y);
         // console.log(scrollbar)
      }
   }
}



export function Mesh_unif_add_vb_root_wposx(root_posidx, x) {

   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] += x;
   
   // /**
   //  * Move any scroll bars that belong to any unif_wpos below current unif_wpos(in the tree structure, children-tree)
   //  */
   // for(let i=0; i <= _per_vb_mesh_unif_wpos.boundary; i++){
   //    const elem = _per_vb_mesh_unif_wpos.buffer[i];
      
   //    // console.log(i)
   //    if(elem.scroll_bar !== INT_NULL && 
   //       ( _per_vb_mesh_unif_wpos.buffer[i].parent_posidx === root_posidx || //Meaning the unif that has a scrollbar(i) must be child of the current moved unif (root_posidx)
   //       i === root_posidx ) // Or the current i is the one that has the scrollbar 
   //    ){
            
   //       _per_vb_mesh_unif_wpos.buffer[elem.scroll_bar].wpos[0] += x;

   //       /** MOVE THE SCROLLBAR MESH INSTEAD OF IT'S UNIF WPOS. This impl is for storing scrollbars in the same vertex buffer */
   //       // TODO: It is not correct to set the mesh pos here, but is the easiest way to have access to all scrollbars.
   //       const scrollbaridx = _per_vb_mesh_unif_wpos.buffer[elem.scroll_bar].meshidx;
   //       const scrollbar = Mesh_buffer_get_mesh_byidx(scrollbaridx);

   //       const handle = scrollbar.children.buffer[0];
   //       scrollbar.geom.pos[0] += x;
   //       scrollbar.geom.AddWposX(scrollbar.gfx, x);
   //       handle.geom.pos[0] += x;
   //       handle.geom.AddWposX(handle.gfx, x);
   //    }
   // }
}



export function Mesh_unif_add_vb_root_wposy(root_posidx, y) {

   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] += y;
      
   // /**
   //  * Move any scroll bars that belong to any unif_wpos below current unif_wpos(in the tree structure, children-tree)
   //  */
   // for(let i=0; i <= _per_vb_mesh_unif_wpos.boundary; i++){
   //    const elem = _per_vb_mesh_unif_wpos.buffer[i];
      
   //    // console.log(i)
   //    if(elem.scroll_bar !== INT_NULL && 
   //       ( _per_vb_mesh_unif_wpos.buffer[i].parent_posidx === root_posidx || //Meaning the unif that has a scrollbar(i) must be child of the current moved unif (root_posidx)
   //       i === root_posidx ) // Or the current i is the one that has the scrollbar 
   //    ){
            
   //       _per_vb_mesh_unif_wpos.buffer[elem.scroll_bar].wpos[1] += y;

   //       /** MOVE THE SCROLLBAR MESH INSTEAD OF IT'S UNIF WPOS. This impl is for storing scrollbars in the same vertex buffer */
   //       // TODO: It is not correct to set the mesh pos here, but is the easiest way to have access to all scrollbars.
   //       const scrollbaridx = _per_vb_mesh_unif_wpos.buffer[elem.scroll_bar].meshidx;
   //       const scrollbar = Mesh_buffer_get_mesh_byidx(scrollbaridx);

   //       const handle = scrollbar.children.buffer[0];
   //       scrollbar.geom.pos[1] += y;
   //       scrollbar.geom.AddWposX(scrollbar.gfx, y);
   //       handle.geom.pos[1] += y;
   //       handle.geom.AddWposX(handle.gfx, y);
   //    }
   // }
}



export function Mesh_unif_add_vb_root_wpos_all_siblings(root_posidx, x, y){

   const parent_rootidx = _per_vb_mesh_unif_wpos.buffer[root_posidx].parent_posidx;
   
   // Run from parent root_posidx to the end of buffer, and add the pos to any elem that is a sibling(same parent)
   // BUG: Assuming the parent always is before any children, which probably it is not the case when root wpos's are removed and new are replacing existing elements
   
   for(let i=root_posidx; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
      const elem = _per_vb_mesh_unif_wpos.buffer[i];
      if(elem.parent_posidx === parent_rootidx){
         _per_vb_mesh_unif_wpos.buffer[i].wpos[0] += x;
         _per_vb_mesh_unif_wpos.buffer[i].wpos[1] += y;
      }
   }
}





/*********************************************************************************************************/
// MISC FUNCTIONS

export function Mesh_unif_update_sticky_pos(xdif, ydif){

   for(let i=0; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
      const unif_pos = _per_vb_mesh_unif_wpos.buffer[i];
      if(unif_pos.sticky_pos & MESH_STATE.STICKY_POSX){
         _per_vb_mesh_unif_wpos.buffer[i].wpos[0] += xdif;
      }
      if(unif_pos.sticky_pos & MESH_STATE.STICKY_POSY){
         _per_vb_mesh_unif_wpos.buffer[i].wpos[1] += ydif;
      }
   }
}















/*******************************************************************************************************************************************************************************/
// Widget Root Colors as uniforms per vertex buffer 
/*******************************************************************************************************************************************************************************/

// per_vb_mesh_unif_#type

const _per_vb_mesh_unif_col = New_generic_buffer(_, '_per_vb_mesh_unif_col');



export function Mesh_unif_col_get_count() { return _per_vb_mesh_unif_col.active_count; }
export function Mesh_unif_col_get_size() { return _per_vb_mesh_unif_col.size; }



// const _debug_names_per_vb_mesh_unif_col = New_generic_buffer(_, '_debug_names_per_vb_mesh_unif_col');

// Each element(uniform color) has the same index as the index of the vertex buffer. Cause each vertex buuffer has a 'u_col'. 
export function Mesh_unif_create_vb_root_col(mesh_col) {

   const entry = {
      col: [0, 0, 0, 0],
      // meshidx: meshidx, // Is needed to have a ref to the mesh from inside the '_per_vb_mesh_unif_col' buffer
   }

   entry.col[0] += mesh_col[0];
   entry.col[1] += mesh_col[1];
   entry.col[2] += mesh_col[2];
   entry.col[3] += mesh_col[3];

   // _debug_names_per_vb_mesh_unif_col.Add({ nameidx: mesh_nameidx, parent_meshidx: parent_meshidx, vbidx:debug_vbidx });

   const idx = _per_vb_mesh_unif_col.Add(entry);
   // console.log('ROOT PER VB MESH UNIFORM COLOR BUFFER', _per_vb_mesh_unif_col.buffer, entry)
   return idx;
}



export function Mesh_unif_store_vb_root_col(idx, pos) {
   // TODO: check NULL object

   _per_vb_mesh_unif_col.buffer[idx].col[0] = pos[0];
   _per_vb_mesh_unif_col.buffer[idx].col[1] = pos[1];
   _per_vb_mesh_unif_col.buffer[idx].col[2] = pos[2];
   _per_vb_mesh_unif_col.buffer[idx].col[3] = pos[3];
}






/*********************************************************************************************************/
// GETTERS



/*********************************************************************************************************/
// SETTERS
export function Mesh_unif_set_vb_root_col(idx, rgba) {
   _per_vb_mesh_unif_col.buffer[idx].col[0] = rgba[0];
   _per_vb_mesh_unif_col.buffer[idx].col[1] = rgba[1];
   _per_vb_mesh_unif_col.buffer[idx].col[2] = rgba[2];
   _per_vb_mesh_unif_col.buffer[idx].col[3] = rgba[3];
}



export function Mesh_unif_add_vb_root_col(idx, rgba) {
   _per_vb_mesh_unif_col.buffer[idx].col[0] += rgba[0];
   _per_vb_mesh_unif_col.buffer[idx].col[1] += rgba[1];
   _per_vb_mesh_unif_col.buffer[idx].col[2] += rgba[2];
   _per_vb_mesh_unif_col.buffer[idx].col[3] += rgba[3];
}






























/*************************************************************************************************************/
// Connect scrollbars unif_wpos with their scrolled section unif_wpos
export function Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(root_posidx, scrollbar_posidx) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].scroll_bar = scrollbar_posidx;
}


























/*********************************************************************************************************/
// DEBUG-PRINT



// Print the widget groups buffer
export function Root_uniforms_for_wpos() {

   console.log('_per_vb_mesh_unif_wpos:')
   for (let i = 0; i <= _per_vb_mesh_unif_wpos.boundary; i++) {

      const parent = Mesh_buffer_get_mesh_byidx(_debug_names_per_vb_mesh_unif_wpos.buffer[i].parent_meshidx);
      const parent_name = (parent) ? Str_buffer_mesh_names_get_by_idx(parent.nameidx) : 'NULL'

      console.log(i,
         'ABSOLUTE_POSITION:', (_per_vb_mesh_unif_wpos.buffer[i].has_absolute_pos & GFX_CTX_FLAGS.ABSOLUTE_POSITION) ? true : false,
         'STICKY_POSX:', (_per_vb_mesh_unif_wpos.buffer[i].sticky_pos & MESH_STATE.STICKY_POSX) ? true : false,
         'pos:', _per_vb_mesh_unif_wpos.buffer[i].wpos,
         'name:', Str_buffer_mesh_names_get_by_idx(_debug_names_per_vb_mesh_unif_wpos.buffer[i].nameidx),
         '||| parent:', parent_name,
         'parent_posidx:', _per_vb_mesh_unif_wpos.buffer[i].parent_posidx,
         'vbidx:', _debug_names_per_vb_mesh_unif_wpos.buffer[i].vbidx,
         'scrollbar:', _per_vb_mesh_unif_wpos.buffer[i].scroll_bar,
      );
   }
}