"use strict";

import { Vertex_buffer_reset_to_index } from "../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";
import { Int16Buffer, M_Buffer, New_generic_buffer, New_int16_buffer } from "./Buffers.js";
import { Mesh_buffer_get_mesh_byidx, Mesh_per_vb_remove_all_from_index } from "./MeshBuffer.js";


/**
 * IDEAS:
 * 
 * structure:
 * 
   view:{
      meshidx,
      numfaces,
      data:[
         Int16Buffer:[], the last element will be an accumulator of num faces
         Int16Buffer:[], the last element will be an accumulator of num faces
         ...
      ],
   }
   
   View Types: 
      . Groups:         somehow set by the user. 
      . Per gfx buffer: set by the vertex buffers of the root widget


   Fields:
      . num faces
      . progidx, vbidx
      . buffer arrays of mesh indexes


   Functions: All run in loop from buffer with meshidxs 
      Reset gfx buffers ()
      Destroy ()


   There is a local file scoped buffer for all Views.
   An index is returned for view refference
 */


_CNT = 0;
export const VIEW_INFO = {
   PROGIDX: _CNT++,
   VBIDX: _CNT++,
   IBIDX: _CNT++,
   START: _CNT++,
   NUM_FACES: _CNT++,

   SIZE: _CNT,
};




/**
   view:[]
      .buffer[i]:       {vb:[]GenericBuffer}
         .vb.buffer[i]: {info:[]Int16Array, data:[]Int16Buffer}
            .info:      [PROGIDX, VBIDX, IBIDX, START, NUM_FACES],
            .data:      meshidx
 */

class View {

   constructor(rootidx) {

      this.rootidx = rootidx;
      this.vb = New_generic_buffer(_, 'Mesh buffer Views VB buffer'); // Array of arrays of per vertex buffer mesh indexes
   }

}



const _view_buffer = New_generic_buffer(_, 'Mesh buffer Views');



export function View_get_view_byidx(view_bufferidx) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[view_bufferidx];
}



export function View_get_view_vb_byidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]];
}



export function View_get_view_meshidx_byidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].data.buffer[group_bufferidxs[2]];
}



export function View_get_view_vb_root_meshidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].rootidx;
}



export function View_is_group_root(group_bufferidxs, mesh_bufferidx) {
   // TODO: Buffer Error Check
   // The root mesh of the group 'sits' at inde
   const rootidx =  _view_buffer.buffer[group_bufferidxs[0]].rootidx;
   if(rootidx === mesh_bufferidx) return true; 
   return false;
}



export function View_get_view_vb_mesh_meshidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].data.buffer[group_bufferidxs[2]];
}



export function View_destroy_view(group_bufferidxs) {
   // TODO: Buffer Error Check
   _view_buffer.RemoveByIdx(group_bufferidxs[0]);
}



export function View_set_view_start_vb_index(group_bufferidxs, start) {
   // TODO: Buffer Error Check
   _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].info[VIEW_INFO.START] = start;
}








/*******************************************************************************************************************************************************************************/
// NEW IMPLEMENTATION
/*******************************************************************************************************************************************************************************/




function View_vb_exists(groupidx, vbidx) {

   const view = _view_buffer.buffer[groupidx];

   for (let i = 0; i <= view.vb.boundary; i++) {

      if (view.vb.buffer[i].info[VIEW_INFO.VBIDX] === vbidx)
         return i;
   }

   return INT_NULL;
}


/** group.buffer[group_bufferidx].vb.buffer[group_vbidx].data.buffer[group_meshidx] */
/** group.buffer[group_bufferidx].vb.buffer[group_vbidx].info.buffer[3] */
function View_add_mesh(groupidx, mesh) {

   const mesh_bufferidx = mesh.mesh_bufferidx;
   const num_faces = mesh.geom.num_faces;
   const start = mesh.gfx.vb.start;
   const vbidx = mesh.gfx.vb.idx;
   const ibidx = mesh.gfx.ib.idx;
   const progidx = mesh.gfx.prog.idx;

   const view = _view_buffer.buffer[groupidx];
   // TODO: Check for errors


   // Find data for vertex buffer exists
   const view_vbidx = View_vb_exists(groupidx, vbidx);

   if (view_vbidx !== INT_NULL) { // Vb buffer found

      const view_vb_buffer = view.vb.buffer[view_vbidx];

      const mesh_groupidx = view_vb_buffer.data.Add(mesh_bufferidx);

      // update num_faces
      view_vb_buffer.info[VIEW_INFO.NUM_FACES] += num_faces;

      // Update start if it is less than the stored
      const group_start = view_vb_buffer.info.buffer[VIEW_INFO.START]
      if (start < group_start && start !== INT_NULL)
         view_vb_buffer.info.buffer[VIEW_INFO.START] = start;

      return [groupidx, view_vbidx, mesh_groupidx]; // return the indexes

   }
   else { // Not found, create new

      const data = {
         info: new Int16Array(VIEW_INFO.SIZE),
         data: New_int16_buffer(), // TODOD: widget root gfx already knows the number of meshes, so maybe have an aproximation of the mesh count(per vb buffer)
      };

      const vb_bufferidx = view.vb.Add(data);
      const mesh_groupidx = view.vb.buffer[vb_bufferidx].data.Add(mesh_bufferidx);

      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.PROGIDX] = progidx;
      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.VBIDX] = vbidx;
      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.IBIDX] = ibidx;
      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.START] = start;
      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.NUM_FACES] = num_faces;

      return [groupidx, vb_bufferidx, mesh_groupidx]; // return the indexes
   }

}





function Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx) {

   // 
   const info = View_add_mesh(groupidx, mesh);
   mesh.group_bufferidxs[0] = info[0]; // Groups buffer index.
   mesh.group_bufferidxs[1] = info[1]; // VB buffers index, which vb buffer the mesh belongs.
   mesh.group_bufferidxs[2] = info[2]; // Mesh's index in the group buffer  .

   if(mesh.text_mesh){

      const text_info = View_add_mesh(groupidx, mesh.text_mesh);
      mesh.text_mesh.group_bufferidxs[0] = text_info[0]; // Groups buffer index.
      mesh.text_mesh.group_bufferidxs[1] = text_info[1]; // VB buffers index, which vb buffer the mesh belongs.
      mesh.text_mesh.group_bufferidxs[2] = text_info[2]; // Mesh's index in the group buffer  .
   }

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {
         Build_per_gfx_view_group_from_root_mesh_recursive(child, groupidx)
      }
   }

}




function Remove_tree_mesh_from_view_recursive(mesh) {

   // TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists


   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {
         Remove_tree_mesh_from_view_recursive(child)
      }
   }


   const groupidx = mesh.group_bufferidxs[0];
   const group_vbidx = mesh.group_bufferidxs[1];
   const group_meshidx = mesh.group_bufferidxs[2];

   /**DEBUG*/ if(groupidx===INT_NULL || group_vbidx===INT_NULL || group_meshidx===INT_NULL) console.error('MESH HAS NULL GROUP:', mesh.GetName(), ' mesh group idxs',  mesh.group_bufferidxs)

   // If the last element is removed from .data buffer, the sort_happened is -1, meaning there was no element swap (sorting)
   const sort_happend = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].data.RemoveByIdxSortedVersion(group_meshidx);
   
   // Update group's num_faces.
   _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].info[VIEW_INFO.NUM_FACES] -= mesh.geom.num_faces;

   // Update the swaped(with the removed mesh) mesh's index. 
   if(sort_happend !== INT_NULL){

      // CAUTION: Because in the Int16Buffer the .RemoveByyIdx sorts the buffer by replacing the deleted element with the last active,
      // we must update the mesh's index to the view's new elment location
      const replacer_idx = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].data.buffer[group_meshidx];
      const replacer_mesh = Mesh_buffer_get_mesh_byidx(replacer_idx);
      replacer_mesh.group_bufferidxs[2] = group_meshidx; // Update the mesh's group meshidx with the current removed mesh's group meshidx.
   }


   // Set null indexes to mesh
   mesh.group_bufferidxs[0] = INT_NULL;
   mesh.group_bufferidxs[1] = INT_NULL;
   mesh.group_bufferidxs[2] = INT_NULL;

   if(mesh.text_mesh){

      const text_groupidx = mesh.text_mesh.group_bufferidxs[0];
      const text_group_vbidx = mesh.text_mesh.group_bufferidxs[1];
      const text_group_meshidx = mesh.text_mesh.group_bufferidxs[2];
   
      /**DEBUG*/ if(text_groupidx===INT_NULL || text_group_vbidx===INT_NULL || text_group_meshidx===INT_NULL) console.error('MESH HAS NULL GROUP:', mesh.text_mesh.GetName(), ' mesh group idxs',  mesh.text_mesh.group_bufferidxs)
     
      // If the last element is removed from .data buffer, the sort_happened is -1, meaning there was no element swap (sorting)
      const sort_happend = _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].data.RemoveByIdxSortedVersion(text_group_meshidx);
      
      // Update group's num_faces.
      _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].info[VIEW_INFO.NUM_FACES] -= mesh.text_mesh.geom.num_faces;
      
      // Update the swaped(with the removed mesh) mesh's index. 
      if(sort_happend !== INT_NULL){
   
         // CAUTION: Because in the Int16Buffer the .RemoveByyIdx sorts the buffer by replacing the deleted element with the last active,
         // we must update the mesh's index to the view's new elment location
         const replacer_idx = _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].data.buffer[text_group_meshidx];
         const replacer_mesh = Mesh_buffer_get_mesh_byidx(replacer_idx);
         replacer_mesh.group_bufferidxs[2] = text_group_meshidx; // Update the mesh's group meshidx with the current removed mesh's group meshidx.
      }

      mesh.text_mesh.group_bufferidxs[0] = INT_NULL; 
      mesh.text_mesh.group_bufferidxs[1] = INT_NULL; 
      mesh.text_mesh.group_bufferidxs[2] = INT_NULL; 
   }
}



export function View_build_group_from_root_mesh(mesh) {

   if (mesh.group_bufferidxs[0] !== INT_NULL) alert('@ View_build_group_from_root_mesh(). mesh is alredy in a group')

   const view = new View(mesh.mesh_bufferidx);
   const groupidx = _view_buffer.Add(view);

   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx);
}



/** Adds mesh to existing view, recurvively for all mesh's children */
export function View_add_to_group(mesh, groupidx) {

   // TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists

   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx);

}



/** Removes mesh and all mesh's children recursively */
export function View_remove_from_group(mesh) {

   // TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists

   Remove_tree_mesh_from_view_recursive(mesh);

}














/******************************************************************************************************************************/
// Functionality
/*****************************************************************************************************************************/

export function View_reset_from_view_all_buffers(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++) {

      const progidx = view.vb.buffer[i].info[VIEW_INFO.PROGIDX];
      const vbidx = view.vb.buffer[i].info[VIEW_INFO.VBIDX];

      const vb_start = view.vb.buffer[i].info[VIEW_INFO.START]; // We want the start of the root mesh of the group, not the start of the root widget
      Vertex_buffer_reset_to_index(progidx, vbidx, vb_start);

      Mesh_per_vb_remove_all_from_index(vbidx, view.vb.buffer[i].data.buffer[0]); // Pass the meshidx of the first mesh on the current accessed vb
   }

}




/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function View_rerender_from_view_all_buffers(view_bufferidx, do_reconstruct_listeners=true) {

   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++){
      
      for (let j = 0; j <= view.vb.buffer[i].data.boundary; j++){
         
         const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[j]);
         if (mesh.state.mask & MESH_STATE.ACTIVE) { 
            Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest1)
            mesh.AddToGfxFromReset(); 
            Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest1)
         }
      }
   }
   
   // Get the root mesh
   Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest2)
   const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
   const parent_events = mesh.parent ? [mesh.parent.listeners.buffer[0], mesh.parent.listeners.buffer[1]] : [null, null];
   if(do_reconstruct_listeners) mesh.ConstructListeners(parent_events); 
   Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest2)
   // if(do_reconstruct_listeners) mesh.ConstructListeners(); 

}




/** Remove all view's meshes from Gfx buffer */
export function View_remove_mesh_from_gfx_buffer_by_view_all_vb(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++) {

      // Get the fist mesh of the vb group buffer
      const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[0]);

      Mesh_per_vb_remove_mesh(mesh.gfx.vb.idx, mesh.per_vb_bufferidx);

   }

}




export function View_movey_group(view_bufferidx, ydif) {

   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++){

      for (let j = 0; j <= view.vb.buffer[i].data.boundary; j++){

         const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[j]);
         mesh.geom.pos[1] += ydif; 
      }
   }
}






















/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/


// Buffer of all meshes of the application.
export function View_buffer_print() {
   console.log('_view_buffer:', _view_buffer);
}



// Buffer of all meshes of the application.
export function View_buffer_print_loop() {

   for (let i = 0; i <= _view_buffer.boundary; i++) {

      console.log('group:', i);
      const view = _view_buffer.buffer[i];
      for (let j = 0; j <= view.vb.boundary; j++) {

         console.log(' ', j,
            `   progidx:${view.vb.buffer[j].info[VIEW_INFO.PROGIDX]}`,
            `   vbidx:${view.vb.buffer[j].info[VIEW_INFO.VBIDX]}`,
            `   num_faces:${view.vb.buffer[j].info[VIEW_INFO.NUM_FACES]}`,
            `   start:${view.vb.buffer[j].info[VIEW_INFO.START]}`,
            `   count:${view.vb.buffer[j].data.active_count}`,
            `   boundary:${view.vb.buffer[j].data.boundary}`,
            `   size:${view.vb.buffer[j].data.size}`,
            '\n  meshidxs', view.vb.buffer[j].data.buffer,
         );
      }
   }
}
