"use strict";

import { Vertex_buffer_reset_to_index } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Renderqueue_set_active } from "../../Renderers/Renderer/RenderQueue.js";
import { Free_generic_buffer, Free_int16_buffer, New_generic_buffer, New_int16_buffer } from "../Buffers.js";
import { Mesh_buffer_get_mesh_byidx, Mesh_per_vb_remove_mesh } from "../MeshBuffer.js";


/**
 * IDEAS:
 * 
 * structure:
 * 
   view:{
      meshidx,
      numfaces,
      data:[
         Int16_Buffer:[], the last element will be an accumulator of num faces
         Int16_Buffer:[], the last element will be an accumulator of num faces
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
   VB_GROUP_IDX: _CNT++,
   START: _CNT++,
   NUM_FACES: _CNT++,
   // PROGIDX: _CNT++,
   // IBIDX: _CNT++,

   SIZE: _CNT,
};




/**
 * View Group struct 
 *  
 *  view:[]
 *     .buffer[i]:       {vb:[]GenericBuffer} Stores all vb_groupidxs that the meshes of the group belong.
 *        .vb.buffer[i]: {info:[]Int16Array, data:[]Int16_Buffer}
 *           .info:      {num_faces:int, starts:[]},
 *           .mesh_data: [meshidx, meshidx, ...]
 *
 */

class View {

   constructor(rootidx) {

      this.rootidx = rootidx;
      this.vb = New_generic_buffer(_, 'Mesh buffer Views VB buffer'); // Array of arrays of per vertex buffer mesh indexes
   }

}



const _view_buffer = New_generic_buffer(_, 'Mesh buffer Views');
export function View_buffer_reset() {

   for (let i = 0; i <= _view_buffer.boundary; i++) {
      const vb = _view_buffer.buffer[i].vb;
      for (let j = 0; j <= vb.boundary; j++) {

         Free_int16_buffer(vb.buffer[j].data);
      }
      Free_generic_buffer(vb);
   }
   _view_buffer.ResetFull();
}



export function View_destroy_vb_from_view() { /*// TODO: IMPLEMENT: Destroy the M_Buffer */ }
export function View_destroy_view() { /*// TODO: IMPLEMENT: Destroy the M_Buffer */ }


export function View_get_count() { return _view_buffer.active_count; }
export function View_get_by_viewidx(group_bufferidx) { return _view_buffer.buffer[group_bufferidx]; }



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
   const rootidx = _view_buffer.buffer[group_bufferidxs[0]].rootidx;
   if (rootidx === mesh_bufferidx) return true;
   return false;
}



export function View_get_view_vb_mesh_meshidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].data.buffer[group_bufferidxs[2]];
}



export function View_remove_view(group_bufferidxs) {
   // TODO: Buffer Error Check
   _view_buffer.RemoveByIdx(group_bufferidxs[0]);
}



export function View_set_view_vb_start(group_bufferidxs, start) {
   // TODO: Buffer Error Check
   _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].info[VIEW_INFO.START] = start;
}



export function View_get_view_vbidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].info[VIEW_INFO.VB_GROUP_IDX];
}








/*******************************************************************************************************************************************************************************/
// NEW IMPLEMENTATION
/*******************************************************************************************************************************************************************************/




function View_vb_exists(groupidx, vbidx) {

   const view = _view_buffer.buffer[groupidx];

   for (let i = 0; i <= view.vb.boundary; i++) {

      if (view.vb.buffer[i].info[VIEW_INFO.VB_GROUP_IDX] === vbidx)
         return i;
   }

   return INT_NULL;
}



function View_add_mesh(groupidx, mesh) {

   const mesh_bufferidx = mesh.mesh_bufferidx;
   const num_faces = mesh.geom.num_faces;
   const start = mesh.gfx.vb.start;
   const vb_groupidx = mesh.gfx.vb.groupidx;

   const view = _view_buffer.buffer[groupidx];
   // TODO: Check for errors


   // Find data for vertex buffer, if exists
   const view_vbidx = View_vb_exists(groupidx, vb_groupidx);

   if (view_vbidx !== INT_NULL) { // Vb buffer found

      const view_vb_buffer = view.vb.buffer[view_vbidx];

      if (view_vb_buffer.data.active_count !== view_vb_buffer.data.boundary + 1)
         console.error('551144314152')

      const mesh_groupidx = view_vb_buffer.data.Add(mesh_bufferidx);


      // update num_faces
      view_vb_buffer.info[VIEW_INFO.NUM_FACES] += num_faces;

      // Update start if it is less than the stored
      const group_start = view_vb_buffer.info[VIEW_INFO.START]
      if (start < group_start && start !== INT_NULL)
         view_vb_buffer.info[VIEW_INFO.START] = start;

      return [groupidx, view_vbidx, mesh_groupidx]; // return the indexes

   }
   else { // Else if not found, create new View.

      const mesh_data = {
         info: new Int16Array(VIEW_INFO.SIZE),
         // TODO: widget root gfx already knows the number of meshes, so maybe have an aproximation of the mesh count(per vb buffer)
         data: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
      };

      const vb_bufferidx = view.vb.Add(mesh_data);
      const mesh_groupidx = view.vb.buffer[vb_bufferidx].data.Add(mesh_bufferidx);

      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.VB_GROUP_IDX] = vb_groupidx;
      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.START] = start;
      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.NUM_FACES] = num_faces;

      return [groupidx, vb_bufferidx, mesh_groupidx]; // return the indexes
   }

}



function Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx) {



   // Connect the mesh with the View via indexes
   const info = View_add_mesh(groupidx, mesh);
   mesh.group_bufferidxs[0] = info[0]; // Groups buffer index.
   mesh.group_bufferidxs[1] = info[1]; // VB buffers index, which vb buffer the mesh belongs.
   mesh.group_bufferidxs[2] = info[2]; // Mesh's index in the group buffer  .

   if (mesh.text_mesh) {

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


function View_consolidate_buffer(groupidx, group_vbidx) {


   const buffer = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].data
   let leftidx = 0, rightidx = 0;
   let consolidation_happened = false;

   for (let i = 0; i <= buffer.boundary; i++) {

      if (buffer.buffer[leftidx] === INT_NULL) {

         rightidx++;
         while (buffer.buffer[rightidx] === INT_NULL && rightidx <= buffer.boundary) {

            rightidx++;
         }

         const right_mesh = Mesh_buffer_get_mesh_byidx(buffer.buffer[rightidx]);
         right_mesh.group_bufferidxs[2] = leftidx;


         // Move not null elem(right) to null elem(left) 
         buffer.buffer[leftidx] = buffer.buffer[rightidx];
         buffer.buffer[rightidx] = INT_NULL;

         consolidation_happened = true;

         if (rightidx >= buffer.boundary) break;

         leftidx++;
      }
      else {

         leftidx++;
         rightidx++;
      }
   }

   if (consolidation_happened) {

      buffer.boundary = leftidx;
      buffer.active_count = buffer.boundary + 1; // Since the buffer is consolidated, the active_count is guaranted to be boundary+1
   }

   // TODO: When freeidx has been implemented in Buffers.js
   // IMPORTANT: After consolidation, the buffer's freeidx is not valid
   // buffer.freeidx = buffer.boundary < buffer.size-1 ? buffer.boundary+1 : INT_NULL;
   // buffer.freeidx = INT_NULL;
}



function Remove_vb_data_from_view_recursive(mesh) {

   // TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists


   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {
         Remove_vb_data_from_view_recursive(child)
      }
   }


   const groupidx = mesh.group_bufferidxs[0];
   const group_vbidx = mesh.group_bufferidxs[1];
   const group_meshidx = mesh.group_bufferidxs[2];

   const buffer = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].data;

   /**DEBUG*/ if (groupidx === INT_NULL || group_vbidx === INT_NULL || group_meshidx === INT_NULL) console.error('MESH HAS NULL GROUP:', mesh.GetName(), ' mesh group idxs', mesh.group_bufferidxs)

   buffer.RemoveByIdx(group_meshidx);

   // Update group's num_faces.
   _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].info[VIEW_INFO.NUM_FACES] -= mesh.geom.num_faces;


   // Set null indexes to mesh
   mesh.group_bufferidxs[0] = INT_NULL;
   mesh.group_bufferidxs[1] = INT_NULL;
   mesh.group_bufferidxs[2] = INT_NULL;

   if (mesh.text_mesh) {

      const text_groupidx = mesh.text_mesh.group_bufferidxs[0];
      const text_group_vbidx = mesh.text_mesh.group_bufferidxs[1];
      const text_group_meshidx = mesh.text_mesh.group_bufferidxs[2];

      /**DEBUG*/ if (text_groupidx === INT_NULL || text_group_vbidx === INT_NULL || text_group_meshidx === INT_NULL) console.error('MESH HAS NULL GROUP:', mesh.text_mesh.GetName(), ' mesh group idxs', mesh.text_mesh.group_bufferidxs)

      _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].data.RemoveByIdx(text_group_meshidx);

      // Update group's num_faces.
      _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].info[VIEW_INFO.NUM_FACES] -= mesh.text_mesh.geom.num_faces;


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

   const groupidx = mesh.group_bufferidxs[0];
   // const group_vbidx = mesh.group_bufferidxs[1];
   // const group_meshidx = mesh.group_bufferidxs[2];

   Remove_vb_data_from_view_recursive(mesh);

   for (let i = 0; i <= _view_buffer.buffer[groupidx].vb.boundary; i++) {

      const vbidx = _view_buffer.buffer[groupidx].vb.buffer[i].info[0]
      View_consolidate_buffer(groupidx, i);
      // console.log('Consolidating View buffer vb:', vbidx)
   }

}














/******************************************************************************************************************************/
// Functionality
/*****************************************************************************************************************************/
// HERE: must add multi vbidx for the Views
/** THIS FUNCTION MAY NOT REMOVEE ANY 'mesh_per_vb', because of the 'Dropdown' removal by inactive item */
export function View_reset_from_view_all_buffers(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];


   for (let i = 0; i <= view.vb.boundary; i++) {

      const vb_groupidx = view.vb.buffer[i].info[VIEW_INFO.VB_GROUP_IDX];

      const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
      const starts = mesh.gfx.vb.starts.buffer;
      Vertex_buffer_reset_to_index(vb_groupidx, starts);

      // Loop for all meshidxs for this vb
      for (let j = 0; j <= view.vb.buffer[i].data.boundary; j++) {

         const meshidx = view.vb.buffer[i].data.buffer[j];

         if (meshidx !== INT_NULL) {

            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
            if (mesh.state.mask & MESH_STATE.ACTIVE)
               Mesh_per_vb_remove_mesh(vb_groupidx, mesh.per_vb_bufferidx)
         }
      }
   }

}




/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function View_render_from_view_all_buffers(view_bufferidx, do_reconstruct_listeners = true) {
   // console.log('===========================================================================================================')
   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      // console.log('view', i, view.vb.buffer[i].info, view.vb.buffer[i].data)
      for (let j = 0; j <= view.vb.buffer[i].data.boundary; j++) { // Vertex Attribute Buffering.

         const meshidx = view.vb.buffer[i].data.buffer[j];
         if (meshidx !== INT_NULL) {

            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
            if (mesh.state.mask & MESH_STATE.ACTIVE) {

               mesh.AddToGfx();
            }
         }
      }
   }

   // Get the root mesh
   // const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
   // const parent_events = mesh.parent ? [mesh.parent.listeners.buffer[0], mesh.parent.listeners.buffer[1]] : [null, null];
   // Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest2)
   // if(do_reconstruct_listeners) 
   // mesh.ConstructListeners(parent_events); 
   // const delta = Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest2)

}




/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function View_rerender_from_view_all_buffers(view_bufferidx, do_reconstruct_listeners = true) {

   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      for (let j = 0; j <= view.vb.buffer[i].data.boundary; j++) { // Vertex Attribute Buffering.

         const meshidx = view.vb.buffer[i].data.buffer[j];
         if (meshidx !== INT_NULL) {

            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
            if (mesh.state.mask & MESH_STATE.ACTIVE) {

               mesh.AddToGfxFromReset();
            }
         }
      }
   }

   // Get the root mesh
   const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
   const parent_events = mesh.parent ? [mesh.parent.listeners.buffer[0], mesh.parent.listeners.buffer[1]] : [null, null];
   // Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest2)
   // if(do_reconstruct_listeners) 
   // mesh.ConstructListeners(parent_events); 
   // const delta = Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest2)
   // if(do_reconstruct_listeners) mesh.ConstructListeners(); 

}




/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function View_activate_all_vbs(group_bufferidxs, activate_flag) {

   const view = _view_buffer.buffer[group_bufferidxs[0]];

   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      const info = view.vb.buffer[i].info;
      const vb_groupidx = info[VIEW_INFO.VB_GROUP_IDX];
      Renderqueue_set_active(vb_groupidx, activate_flag)
   }
}



// /** Remove all view's meshes from Gfx buffer */
// export function View_remove_mesh_from_gfx_buffer_by_view_all_vb(view_bufferidx) {

//    const view = _view_buffer.buffer[view_bufferidx];

//    for (let i = 0; i <= view.vb.boundary; i++) {

//       // Get the fist mesh of the vb group buffer
//       const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[0]);

//       Mesh_per_vb_remove_mesh(mesh.gfx.vb.groupidx, mesh.per_vb_bufferidx);

//    }

// }




export function View_movey_group(view_bufferidx, ydif) {

   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++) {

      for (let j = 0; j <= view.vb.buffer[i].data.boundary; j++) {

         const meshidx = view.vb.buffer[i].data.buffer[j];

         if (meshidx !== INT_NULL) {
            const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[j]);
            mesh.geom.pos[1] += ydif;
         }
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
            // `   progidx:${view.vb.buffer[j].info[VIEW_INFO.PROGIDX]}`,
            `   vbidx:${view.vb.buffer[j].info[VIEW_INFO.VB_GROUP_IDX]}`,
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
