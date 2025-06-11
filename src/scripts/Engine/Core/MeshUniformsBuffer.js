/**
 * A buffer to store uniform values per vertex buffer,
 * so that we bind a different uniform per vertex buffer
 * inside the Draw() function.
 */


"use strict";

import { Vertex_buffer_group_get, Vertex_buffer_group_has_scissorbox, Vertex_buffer_group_update_scissorbox } from "../../Graphics/Buffers/VertexBuffers.js";
import { Floor } from "../../Helpers/Math/MathOperations.js";
import { Mesh_set_and_update_wpos_uniform } from "../Drawables/Operations/MeshHelperFunctions.js";
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

/** */
export function Screen_wpos_get() { return _screen_wpos; }
/** */
export function Screen_wpos_get_x() { return _screen_wpos[0]; }
/** */
export function Screen_wpos_get_y() { return _screen_wpos[1]; }
/** */
export function Screen_wpos_add_x(x) { _screen_wpos[0] += x; }
/** */
export function Screen_wpos_add_y(y) { _screen_wpos[1] += y; }
/** */
export function Screen_wpos_set_x(x) { _screen_wpos[0] = x; }
/** */
export function Screen_wpos_set_y(y) { _screen_wpos[1] = y; }















/*******************************************************************************************************************************************************************************/
// Widget Root Positions as uniforms per vertex buffer 
/*******************************************************************************************************************************************************************************/
/** */
const _per_vb_mesh_unif_wpos = New_generic_buffer(_, '_per_vb_mesh_unif_wpos');
/** */
const _per_vb_mesh_unif_wpos_ubidxs = New_generic_buffer(_, '_per_vb_mesh_unif_wpos_ubidxs');
/** */
const _debug_names_per_vb_mesh_unif_wpos = New_generic_buffer(_, '_debug_names_per_vb_mesh_unif_wpos');


/** */
export function Mesh_unif_wpos_reset() { _per_vb_mesh_unif_wpos.ResetFull(); }
/** */
export function Mesh_unif_wpos_ubidxs_reset(){ _per_vb_mesh_unif_wpos_ubidxs.ResetFull(); }
/** */
export function Mesh_unif_wpos_debug_names_reset(){ _debug_names_per_vb_mesh_unif_wpos.ResetFull(); }



/** */
export function Mesh_unif_wpos_get_debug() { return _per_vb_mesh_unif_wpos.buffer; }
/** */
export function Mesh_unif_wpos_get_count() { return _per_vb_mesh_unif_wpos.active_count; }
/** */
export function Mesh_unif_wpos_get_size() { return _per_vb_mesh_unif_wpos.size; }




/** */
export function Mesh_unif_create_rg_root_wpos(mesh, ubidx, HAS_ABSOLUTE_POS=0x0, HAS_STICKY_POS=0x0, IS_VB_ROOT, COPY_MESH_POS) {

   const mesh_bufferidx = mesh.mesh_bufferidx, 
         mesh_pos = mesh.geom.pos, 
         mesh_type = mesh.type, 
         mesh_nameidx = mesh.nameidx, 
         mesh_parent = mesh.parent, 
         progidx = mesh.gfx.prog.idx, 
         rgidx = mesh.gfx.vb.render_groupidx, 
         debug_vb_groupidx = mesh.gfx.vb.groupidx;

   // Decide if the mesh has a 'root wpos' position to anothers mesh 'root wpos' position. If yes, set the new wpos's parent field with the index of the parent wpos 
   let meshidx = mesh_bufferidx;
   let parent_posidx = INT_NULL
   /**DEBUG*/ let parent_meshidx = INT_NULL; // For debugging
   const wpos = [0, 0];
   // console.log(mesh.name, 'pos', mesh_pos)
   // wpos[0] = mesh_pos[0];
   // wpos[1] = mesh_pos[1];
   if(IS_VB_ROOT){
      wpos[0] = mesh_pos[0];
      wpos[1] = mesh_pos[1];
      mesh_pos[0] = 0;
      mesh_pos[1] = 0;
      
   }
   
   
   if (mesh_parent !== null){
      
      parent_meshidx = mesh_parent.mesh_bufferidx;
      // parent_posidx = mesh_parent.root_posidx;
      parent_posidx = mesh_parent.gfx.vb.render_groupidx;
         
         // if (mesh_type & MESH_TYPE.TEXT_MESH) {
            
         //    // If wpos is text(seperate vb), we don't want the wpos offset to store the first text's pos as the offset of all texts that draw from the wpos
         //    wpos[0] = 0;
         //    wpos[1] = 0;
         // }
      }
   //    else if(IS_VB_ROOT){
   //       mesh_pos[0] = 0;
   //       mesh_pos[1] = 0;
   //    }
      // console.log(mesh.name, 'pos', mesh_pos)
   
   
   
   const entry = {
      wpos: [wpos[0], wpos[1]],
      meshidx: meshidx, // Is needed to have a ref to the mesh from inside the '_per_vb_mesh_unif_wpos' buffer
      parent_posidx: parent_posidx,
      debug_vb_groupidx:debug_vb_groupidx,
      has_absolute_pos: HAS_ABSOLUTE_POS,
      sticky_pos: HAS_STICKY_POS,
      scroll_bar: INT_NULL, // unif_wpos index for any scrollbar. Use: Move the scrollbar with the root mesh move (seperately), because the scrollbars aren't children of any root unif
   }
   
   _debug_names_per_vb_mesh_unif_wpos.Add({ nameidx: mesh_nameidx, parent_meshidx: parent_meshidx, vbidx:debug_vb_groupidx });
   
   const idx = _per_vb_mesh_unif_wpos.Add(entry);
   
   
   // Store the uniform's index, for updating the uniforms on position change
   const wpos_ubidx_idx = _per_vb_mesh_unif_wpos_ubidxs.Add(ubidx);
   if(wpos_ubidx_idx !== idx) alert('unif wpos idx does not match the ubidx wpos idx');
   
   // Mesh_set_and_update_wpos_uniform(progidx, debug_vb_groupidx, root_wpos, null)


   return idx;
}
/** DEPRECATED: Use only with RG */
// export function Mesh_unif_create_vb_root_wpos(mesh_bufferidx, mesh_pos, mesh_type, mesh_nameidx, mesh_parent, progidx, debug_vb_groupidx, ubidx, HAS_ABSOLUTE_POS=0x0, HAS_STICKY_POS=0x0, IS_VB_ROOT, COPY_MESH_POS) {

//    // Decide if the mesh has a 'root wpos' position to anothers mesh 'root wpos' position. If yes, set the new wpos's parent field with the index of the parent wpos 
//    let meshidx = mesh_bufferidx;
//    let parent_posidx = INT_NULL
//    /**DEBUG*/ let parent_meshidx = INT_NULL; // For debugging
//    const wpos = [0, 0];

//    if(IS_VB_ROOT){
//       wpos[0] = mesh_pos[0];
//       wpos[1] = mesh_pos[1];
      
//    }
   

//    let root_wpos = [wpos[0], wpos[1]];
//    if (mesh_parent !== null){
      
//       // CopyArr2(root_wpos, Mesh_unif_get_vb_root_wpos(mesh_parent.root_posidx));  console.log('2', root_wpos);
      
//       parent_meshidx = mesh_parent.mesh_bufferidx;
//       parent_posidx = mesh_parent.root_posidx;
      
//       if (mesh_type & MESH_TYPE.TEXT_MESH) {
         
//          // If wpos is text(seperate vb), we don't want the wpos offset to store the first text's pos as the offset of all texts that draw from the wpos
//          wpos[0] = 0;
//          wpos[1] = 0;
//       }
//    }
//    else if(IS_VB_ROOT){
//       mesh_pos[0] = 0;
//       mesh_pos[1] = 0;
//    }
   
   
   
//    const entry = {
//       wpos: [wpos[0], wpos[1]],
//       meshidx: meshidx, // Is needed to have a ref to the mesh from inside the '_per_vb_mesh_unif_wpos' buffer
//       parent_posidx: parent_posidx,
//       debug_vb_groupidx:debug_vb_groupidx,
//       has_absolute_pos: HAS_ABSOLUTE_POS,
//       sticky_pos: HAS_STICKY_POS,
//       scroll_bar: INT_NULL, // unif_wpos index for any scrollbar. Use: Move the scrollbar with the root mesh move (seperately), because the scrollbars aren't children of any root unif
//    }
   
//    _debug_names_per_vb_mesh_unif_wpos.Add({ nameidx: mesh_nameidx, parent_meshidx: parent_meshidx, vbidx:debug_vb_groupidx });
   
//    const idx = _per_vb_mesh_unif_wpos.Add(entry);
   
   
//    // Store the uniform's index, for updating the uniforms on position change
//    const wpos_ubidx_idx = _per_vb_mesh_unif_wpos_ubidxs.Add(ubidx);
//    if(wpos_ubidx_idx !== idx) alert('unif wpos idx does not match the ubidx wpos idx');
   
//    // Mesh_set_and_update_wpos_uniform(progidx, debug_vb_groupidx, root_wpos, null)


//    return idx;
// }
/** */
export function Mesh_unif_set_from_existing_vb_root_wpos(mesh_bufferidx, mesh_pos, mesh_type, mesh_nameidx, mesh_parent=null, 
                                                progidx, vb_groupidx, HAS_ABSOLUTE_POS=0x0, HAS_STICKY_POS=0x0, IS_VB_ROOT, IS_VB_USED) {
   // TODO: check NULL object


   // Decide if the mesh has a 'root wpos' position to anothers mesh 'root wpos' position. If yes, set the new wpos's parent field with the index of the parent wpos 
   let meshidx = mesh_bufferidx;
   let parent_posidx = INT_NULL
   /**DEBUG*/ let parent_meshidx = INT_NULL; // For debugging
   const wpos = [0, 0];

   // wpos[0] = mesh_pos[0];
   // wpos[1] = mesh_pos[1];
 
   if(IS_VB_ROOT){
      wpos[0] = mesh_pos[0];
      wpos[1] = mesh_pos[1];
   }

   
   // Set the parent pos from which to draw this vb unif position (if this vb is not an root unif position)
   if (mesh_parent !== null && vb_groupidx !== mesh_parent.root_posidx) {
         
      if(vb_groupidx === mesh_parent.gfx.vb.groupidx && IS_VB_ROOT) {
   
         alert('47119181716 \nroot wpos ERROR. mesh is root and are on the same VB parent')
      }
      parent_meshidx = mesh_parent.mesh_bufferidx;
      parent_posidx = mesh_parent.root_posidx;

      if (mesh_type & MESH_TYPE.TEXT_MESH) {

         // If wpos is text(seperate vb), we don't want the wpos offset to store the first text's pos as the offset of all texts that draw from the wpos
         wpos[0] = 0;
         wpos[1] = 0;
      }
   }
   else if(IS_VB_ROOT){
      mesh_pos[0] = 0;
      mesh_pos[1] = 0;
   }



   // If it is the case the vertex buffer is not created but is re-used, then we need to re-initialize the unif_wpos 
   const unif_wpos = _per_vb_mesh_unif_wpos.buffer[vb_groupidx];

   if(IS_VB_ROOT || IS_VB_USED){

      unif_wpos.wpos[0] = wpos[0];
      unif_wpos.wpos[1] = wpos[1];
      unif_wpos.meshidx = meshidx;
      unif_wpos.parent_posidx = parent_posidx;
      unif_wpos.debug_vb_groupidx = vb_groupidx;
      unif_wpos.has_absolute_pos = HAS_ABSOLUTE_POS;
      unif_wpos.sticky_pos = HAS_STICKY_POS;
      unif_wpos.scroll_bar = INT_NULL;

   }


   const dbg_for_unifwpos = _debug_names_per_vb_mesh_unif_wpos.buffer[vb_groupidx];
   dbg_for_unifwpos.nameidx = mesh_nameidx;
   dbg_for_unifwpos.parent_meshidx = parent_meshidx;
   dbg_for_unifwpos.vbidx = vb_groupidx;
   // _debug_names_per_vb_mesh_unif_wpos.Add({ nameidx: mesh_nameidx, parent_meshidx: parent_meshidx, vbidx:debug_vb_groupidx });


   // Mesh_set_and_update_wpos_uniform(progidx, vb_groupidx, unif_wpos.wpos, null)

   return vb_groupidx; // Return this unif wpos index(which matches the vb_groupidx)
}
/** */
export function Mesh_unif_is_vb_root_wpos(root_posidx, meshidx) {
   if(_per_vb_mesh_unif_wpos.buffer[root_posidx] === undefined || _per_vb_mesh_unif_wpos.buffer[root_posidx] === null) return false;
   if(_per_vb_mesh_unif_wpos.buffer[root_posidx].meshidx === meshidx) return true;
   return false;
}
/** */
export function Mesh_unif_remove_root_wpos(root_posidx) {
   _per_vb_mesh_unif_wpos.buffer.RemoveByIdx(root_posidx);
}
/** */
// HACK: Manually add a parent from which to draw the uniform wpos
export function Mesh_unif_hack_parent_root_wpos(root_posidx, parent_root_posidx, parent_mesh_bufferidx) {

   const root_wpos = _per_vb_mesh_unif_wpos.buffer[root_posidx];
   root_wpos.parent_posidx = parent_root_posidx;

   // const parent_root_wpos = _per_vb_mesh_unif_wpos.buffer[parent_root_posidx];
   // root_wpos.wpos[0] += parent_root_wpos.wpos[0];
   // root_wpos.wpos[1] += parent_root_wpos.wpos[1];

   // Update the debugging info buffer
   _debug_names_per_vb_mesh_unif_wpos.buffer[root_posidx].parent_meshidx = parent_mesh_bufferidx;
}





/*********************************************************************************************************/
// GETTERS
// Can take vbidx as the 'idx' to return the wpos for all meshes of a vertex buffer
/** */
export function Mesh_unif_get_vb_root_wpos_meshidx(root_posidx) {
   return _per_vb_mesh_unif_wpos.buffer[root_posidx].meshidx;
}
/** */
export function Mesh_unif_get_vb_root_wpos_has_absolute_pos(root_posidx) {
   return _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos;
}

/** */
export function Mesh_unif_get_vb_root_wpos(root_posidx, rgidx) {

   // HACK: uniform wpos sends the rgidx alse 
   if(rgidx!==undefined) root_posidx = rgidx;

   let cur = _per_vb_mesh_unif_wpos.buffer[root_posidx];
   if(cur===undefined) console.error('root_posidx', root_posidx);
   let pos = {x:0, y:0};

   let idx = cur.parent_posidx;
   while( cur!==undefined && cur!==null ) {
      
      idx = cur.parent_posidx
      pos.x += cur.wpos[0];
      pos.y += cur.wpos[1];
      cur = _per_vb_mesh_unif_wpos.buffer[idx];

   }

   if( _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos === 0){
      pos.x += _screen_wpos[0];
      pos.y += _screen_wpos[1];
   }
   return [pos.x, pos.y];
   // return pos;
}
/** The same with the above except that it returns an object instead of array*/
export function Mesh_unif_get_vb_root_wpos_obj_t(root_posidx, rgidx) {

   // HACK: uniform wpos sends the rgidx alse 
   if(rgidx!==undefined) root_posidx = rgidx;

   let cur = _per_vb_mesh_unif_wpos.buffer[root_posidx];
   if(cur===undefined) console.error('root_posidx', root_posidx);
   let pos = {x:0, y:0};

   let idx = cur.parent_posidx;
   while( cur!==undefined && cur!==null ) {
      
      idx = cur.parent_posidx
      pos.x += cur.wpos[0];
      pos.y += cur.wpos[1];
      cur = _per_vb_mesh_unif_wpos.buffer[idx];

   }

   if( _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos === 0){
      pos.x += _screen_wpos[0];
      pos.y += _screen_wpos[1];
   }
   return pos;
}


/** */
export function Mesh_unif_get_vb_root_wposx(root_posidx) {

   let pos = Mesh_unif_get_vb_root_wposx_recursive(root_posidx);

   if( _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos === 0){
      pos += _screen_wpos[0];
   }
   return pos;
}
/** */
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

/** */
export function Mesh_unif_get_vb_root_wposy(root_posidx) {
   
   let pos = Mesh_unif_get_vb_root_wposy_recursive(root_posidx);

   if( _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos === 0){
      pos += _screen_wpos[1];
   }
   return pos;
}
/** */
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
/** */
export function Mesh_unif_set_vb_root_wpos(root_posidx, x, y) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] = x;
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] = y;
   
}
/** */
export function Mesh_unif_set_vb_root_wposx(root_posidx, x) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] = x;
   
}
/** */
export function Mesh_unif_set_vb_root_wposy(root_posidx, y) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] = y;
   
}


/** */
export function Mesh_unif_add_vb_root_wpos(root_posidx, x, y) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] += x;
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] += y;
   

   /**
    * Move any scroll bars that belong to any unif_wpos below current unif_wpos(in the tree structure, children-tree)
    */
   for(let i=0; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
      /********************************************************************************************************************/
      // Set any scissor box
      // TODO: Where to update any scissor box??? 1. at the update functions(Move, resize, etc)? At the 'mesh uniform' file(for move)???
      // if(Vertex_buffer_group_has_scissorbox(i)){
      //    Vertex_buffer_group_update_scissorbox(i);
      // }

   }
}
/** */
export function Mesh_unif_add_vb_root_wposx(root_posidx, x) {
   
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] += x;
   
}
/** */
export function Mesh_unif_add_vb_root_wposy(root_posidx, y) {
   
   _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] += y;
}






/*********************************************************************************************************/
// MISC FUNCTIONS

/** */
export function Mesh_unif_update_sticky_pos(xdif, ydif){

   for(let i=0; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
      const unif_pos = _per_vb_mesh_unif_wpos.buffer[i];
      if(unif_pos.sticky_pos & MESH_STATE_FLAGS.STICKY_POSX){
         _per_vb_mesh_unif_wpos.buffer[i].wpos[0] += xdif;
      }
      if(unif_pos.sticky_pos & MESH_STATE_FLAGS.STICKY_POSY){
         _per_vb_mesh_unif_wpos.buffer[i].wpos[1] += ydif;
      }
   }
}
/**Get all vertex buffers from a root via the unif wpos struct */
export function Mesh_unif_get_all_root_wpos_indexes(root_posidx){

   // return _per_vb_mesh_unif_wpos.buffer[root_posidx];
   return _per_vb_mesh_unif_wpos.buffer;
}















/*******************************************************************************************************************************************************************************/
// Widget Root Colors as uniforms per vertex buffer 
/*******************************************************************************************************************************************************************************/

// per_vb_mesh_unif_#type

const _per_vb_mesh_unif_col = New_generic_buffer(_, '_per_vb_mesh_unif_col');
/** */
export function Mesh_unif_col_reset() {
   _per_vb_mesh_unif_col.ResetFull();
}
/** */
export function Mesh_unif_col_get_count() { return _per_vb_mesh_unif_col.active_count; }
/** */
export function Mesh_unif_col_get_size() { return _per_vb_mesh_unif_col.size; }
/** */
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
/** */
export function Mesh_unif_store_vb_root_col(idx, pos) {
   // TODO: check NULL object

   _per_vb_mesh_unif_col.buffer[idx].col[0] = pos[0];
   _per_vb_mesh_unif_col.buffer[idx].col[1] = pos[1];
   _per_vb_mesh_unif_col.buffer[idx].col[2] = pos[2];
   _per_vb_mesh_unif_col.buffer[idx].col[3] = pos[3];
}




/*********************************************************************************************************/
// SETTERS
/** */
export function Mesh_unif_set_vb_root_col(idx, rgba) {
   _per_vb_mesh_unif_col.buffer[idx].col[0] = rgba[0];
   _per_vb_mesh_unif_col.buffer[idx].col[1] = rgba[1];
   _per_vb_mesh_unif_col.buffer[idx].col[2] = rgba[2];
   _per_vb_mesh_unif_col.buffer[idx].col[3] = rgba[3];
}
/** */
export function Mesh_unif_add_vb_root_col(idx, rgba) {
   _per_vb_mesh_unif_col.buffer[idx].col[0] += rgba[0];
   _per_vb_mesh_unif_col.buffer[idx].col[1] += rgba[1];
   _per_vb_mesh_unif_col.buffer[idx].col[2] += rgba[2];
   _per_vb_mesh_unif_col.buffer[idx].col[3] += rgba[3];
}






























/*************************************************************************************************************/
// Connect scrollbars unif_wpos with their scrolled section unif_wpos
// Use: Move the scrollbar with the root mesh move (seperately), because the scrollbars aren't children of any root unif
/** */
export function Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(root_posidx, scrollbar_posidx) {
   _per_vb_mesh_unif_wpos.buffer[root_posidx].scroll_bar = scrollbar_posidx;
}


























/*********************************************************************************************************/
// DEBUG-PRINT



// Print the widget groups buffer
/** */
export function Root_print_loop_uniforms_for_wpos() {

   const vb_groups = Vertex_buffer_group_get();

   console.log('_per_vb_mesh_unif_wpos:');
   for (let i = 0; i <= _per_vb_mesh_unif_wpos.boundary; i++) {
      
      const unif_obj = _per_vb_mesh_unif_wpos.buffer[i];
      
      let mesh_posx = -1, mesh_posy = -1;
      if(unif_obj.meshidx != INT_NULL) {
         
         const mesh = Mesh_buffer_get_mesh_byidx(unif_obj.meshidx);
         if(!mesh) {
            console.error('554398709871928. Mesh is null. Check if any mesh has been deleted but not removed from the @_per_vb_mesh_unif_wpos.buffer')
            continue 
         }

            mesh_posx = mesh.geom.pos[0], mesh_posy = mesh.geom.pos[1]
      }
      
      let name = Str_buffer_mesh_names_get_by_idx(_debug_names_per_vb_mesh_unif_wpos.buffer[i].nameidx);
      if(name.length > MAX_NAME_LENGTH) 
         name = name.slice(0, MAX_NAME_LENGTH)
         
      const parent = Mesh_buffer_get_mesh_byidx(_debug_names_per_vb_mesh_unif_wpos.buffer[i].parent_meshidx);
      let parent_name = (parent) ? Str_buffer_mesh_names_get_by_idx(parent.nameidx) : 'NULL';
      if(parent_name.length > MAX_NAME_LENGTH) 
         parent_name = parent_name.slice(0, MAX_NAME_LENGTH)

      console.log(
         'meshi:', unif_obj.meshidx,
         'vbi:', _debug_names_per_vb_mesh_unif_wpos.buffer[i].vbidx,
         // 'drawcnt:', vb_groups.buffer[i].draw_count,
         // 'ABS:', (unif_obj.has_absolute_pos & GFX_CTX_FLAGS.ABSOLUTE_POSITION) ? true : false,
         // '| STICK:', (unif_obj.sticky_pos & MESH_STATE_FLAGS.STICKY_POSX) ? true : false,
         // '| scroll:', unif_obj.scroll_bar,
         'par_posi:', unif_obj.parent_posidx,
         'unifpos:', Floor(unif_obj.wpos[0]), Floor(unif_obj.wpos[1]),
         'wpos:', Floor(mesh_posx), Floor(mesh_posy),
         // 'vb_grp:', vb_groups.buffer[i].name,
         'parent:', parent_name,
         'name:', name,
      );
   }
}
export function Root_print_uniforms_for_wpos() {

   console.log('_per_vb_mesh_unif_wpos', _per_vb_mesh_unif_wpos);
   console.log('_debug_names_per_vb_mesh_unif_wpos', _debug_names_per_vb_mesh_unif_wpos);

}














/***********************************************************************************/
// UNUSED
/** */
// export function Mesh_unif_set_vb_root_wpos_all_siblings(root_posidx, x, y){

//    const parent_rootidx = _per_vb_mesh_unif_wpos.buffer[root_posidx].parent_posidx;
//    // Run from parent root_posidx to the end of buffer, and add the pos to any elem that is a sibling(same parent)
//    // BUG: Assuming the parent always is before any children, which probably it is not the case when root wpos's are removed and new are replacing existing elements
//    for(let i=parent_rootidx+1; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
//       const elem = _per_vb_mesh_unif_wpos.buffer[i];
//       if(elem.parent_posidx === parent_rootidx){
//          _per_vb_mesh_unif_wpos.buffer[i].wpos[0] = x;
//          _per_vb_mesh_unif_wpos.buffer[i].wpos[1] = y;
//       }

//    }
// }
/** Set wpos for all roots with the same parent */
// export function Mesh_unif_set_vb_root_wposx_all_siblings(root_posidx, x) {
   
//    _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[0] = x;
   
//    const parent_rootidx = _per_vb_mesh_unif_wpos.buffer[root_posidx].parent_posidx;
//    if(parent_rootidx === INT_NULL) return;
   
   
//    // Run from parent root_posidx to the end of buffer, and add the pos to any elem that is a sibling(same parent)
//    // BUG: Assuming the parent always is before any children, which probably it is not the case when root wpos's are removed and new are replacing existing elements
//    for(let i=parent_rootidx+1; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
//       const elem = _per_vb_mesh_unif_wpos.buffer[i];
//       if(elem.parent_posidx === parent_rootidx){
//          _per_vb_mesh_unif_wpos.buffer[i].wpos[0] = x;
//       }
//    }
// }
/** */
// export function Mesh_unif_add_vb_root_wpos_all_siblings(root_posidx, x, y){
   
//    const parent_rootidx = _per_vb_mesh_unif_wpos.buffer[root_posidx].parent_posidx;
   
//    // Run from parent root_posidx to the end of buffer, and add the pos to any elem that is a sibling(same parent)
//    // BUG: Assuming the parent always is before any children, which probably it is not the case when root wpos's are removed and new are replacing existing elements
   
//    for(let i=root_posidx; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
//       const elem = _per_vb_mesh_unif_wpos.buffer[i];
//       if(elem.parent_posidx === parent_rootidx){
//          _per_vb_mesh_unif_wpos.buffer[i].wpos[0] += x;
//          _per_vb_mesh_unif_wpos.buffer[i].wpos[1] += y;
//       }
//    }
// }
/** */
// export function Mesh_unif_add_vb_root_wposy_with_children(root_posidx, y){
   
//    _per_vb_mesh_unif_wpos.buffer[root_posidx].wpos[1] += y;
//    const parent_rootidx = _per_vb_mesh_unif_wpos.buffer[root_posidx].parent_posidx;
   
//    // Run from parent root_posidx to the end of buffer, and add the pos to any elem that is a sibling(same parent)
//    // BUG: Assuming the parent always is before any children, which probably it is not the case when root wpos's are removed and new are replacing existing elements
   
//    for(let i=root_posidx; i <= _per_vb_mesh_unif_wpos.boundary; i++){
      
//       const elem = _per_vb_mesh_unif_wpos.buffer[i];
//       if(elem.parent_posidx === parent_rootidx){
//          _per_vb_mesh_unif_wpos.buffer[i].wpos[0] += x;
//          _per_vb_mesh_unif_wpos.buffer[i].wpos[1] += y;
//       }
//    }
// }
/** SAVE */
// export function Mesh_unif_get_vb_root_wpos(root_posidx, rgidx) {

//    // HACK: uniform wpos sends the rgidx alse 
//    if(rgidx!==undefined) root_posidx = rgidx;

//    const pos = Mesh_unif_get_vb_root_wpos_recursive(root_posidx);

//    if( _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos === 0){
//       pos[0] += _screen_wpos[0];
//       pos[1] += _screen_wpos[1];
//    }
//    return pos;
// }
// /** */
// function Mesh_unif_get_vb_root_wpos_recursive(root_posidx) {

//    const _this = _per_vb_mesh_unif_wpos.buffer[root_posidx];
//    if(_this===undefined) console.error('root_posidx', root_posidx)
//    let pos = [_this.wpos[0], _this.wpos[1]];

//    // If this relative position has a parent position, add it
//    if (_this.parent_posidx !== INT_NULL) {
//       const p = Mesh_unif_get_vb_root_wpos_recursive(_this.parent_posidx);
//       pos[0] += p[0];
//       pos[1] += p[1];
//    }

//    return pos;
// }



/** This calculates using array implementation and seems much slower than the object implementaion */
// export function Mesh_unif_get_vb_root_wpos(root_posidx, rgidx) {

//    // HACK: uniform wpos sends the rgidx alse 
//    if(rgidx!==undefined) root_posidx = rgidx;

//    const pos = Mesh_unif_get_vb_root_wpos_recursive(root_posidx);

//    if( _per_vb_mesh_unif_wpos.buffer[root_posidx].has_absolute_pos === 0){
//       pos[0] += _screen_wpos[0];
//       pos[1] += _screen_wpos[1];
//    }
//    return pos;
// }
// /** */
// function Mesh_unif_get_vb_root_wpos_recursive(root_posidx) {

//    let cur = _per_vb_mesh_unif_wpos.buffer[root_posidx];
//    if(cur===undefined) console.error('root_posidx', root_posidx);
//    let pos = [0, 0];

//    let idx = cur.parent_posidx;
//    while( cur!==undefined && cur!==null ) {
      
//       idx = cur.parent_posidx
//       pos[0] += cur.wpos[0];
//       pos[1] += cur.wpos[1];
//       cur = _per_vb_mesh_unif_wpos.buffer[idx];
//       // if(cur.parent_posidx <= INT_NULL) break;

//    }

//    return pos;
// }