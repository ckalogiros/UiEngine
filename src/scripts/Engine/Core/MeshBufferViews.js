"use strict";

import { Index_buffer_reset_to_index } from "../../Graphics/Buffers/IndexBuffers";
import { Vertexbuffer_reset_to_index } from "../../Graphics/Buffers/VertexBuffers";
import { Int16Buffer, M_Buffer } from "./Buffers";
import { Mesh_buffer_get_mesh_byidx, Widget_root_buffer_get_byidx, Widget_root_gfx_get_structured } from "./MeshBuffer";


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
   VBIDX: _CNT++,
   PROGIDX: _CNT++,
   START: _CNT++,
   NUM_FACES: _CNT++,

   SIZE: _CNT,
};




class View {

   constructor(rootidx) {

      this.rootidx = rootidx;
      this.vb = new M_Buffer(); // Array of arrays of per vertex buffer mesh indexes
   }

}



const _view_buffer = new M_Buffer();



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
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].data.buffer[0];
}



export function View_destroy_view(group_bufferidxs) {
   // TODO: Buffer Error Check
   _view_buffer.RemoveByIdx(group_bufferidxs[0]);
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
         data: new Int16Buffer(), // TODOD: widget root gfx already knows the number of meshes, so maybe have an aproximation of the mesh count(per vb buffer)
      };

      const vb_bufferidx = view.vb.Add(data);
      const mesh_groupidx = view.vb.buffer[vb_bufferidx].data.Add(mesh_bufferidx);

      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.VBIDX] = vbidx;
      view.vb.buffer[vb_bufferidx].info[VIEW_INFO.PROGIDX] = progidx;
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

   // console.log(mesh.group_bufferidxs, mesh.GetName())

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {
         Build_per_gfx_view_group_from_root_mesh_recursive(child, groupidx)
      }
      if (child.text_mesh) {
         Build_per_gfx_view_group_from_root_mesh_recursive(child.text_mesh, groupidx)
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
      if (child.text_mesh) {
         Remove_tree_mesh_from_view_recursive(child.text_mesh)
      }
   }


   const groupidx = mesh.group_bufferidxs[0];
   const group_vbidx = mesh.group_bufferidxs[1];
   const group_meshidx = mesh.group_bufferidxs[2];


   // If the last element is removed from .data buffer, the sort_happened is -1, meaning there was no element swap (sorting)
   const sort_happend = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].data.RemoveByIdx(group_meshidx);
   // console.log(mesh.GetName(), 'meshidx:', mesh.mesh_bufferidx, 'sort_happend', sort_happend, 'mesh.group_bufferidxs', mesh.group_bufferidxs,  'last', _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].data.boundary)
   
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

      // Get the fist mesh of the vb group buffer
      const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[0]);
      // console.log('Reseting vertex buffer from view root mesh:', mesh.GetName())

      const progidx = view.vb.buffer[i].info[VIEW_INFO.PROGIDX];
      const vbidx = view.vb.buffer[i].info[VIEW_INFO.VBIDX];

      const vb_start = view.vb.buffer[i].info[VIEW_INFO.START]; // We want the start of the root mesh of the group, not the start of the root widget
      Vertexbuffer_reset_to_index(progidx, vbidx, vb_start);

      // TODO: What about the index buffer. Does it need to be stored to the groups info as well?????? (so we dont get the messh at all) 
      const ib_start = mesh.gfx.ib.start; // We want the start of the root mesh of the group, not the start of the root widget
      Index_buffer_reset_to_index(vbidx, ib_start);

   }

}



/**
 * // TODO:
 * We have 2 options:
 *    1. let the tree mesh handle the Render()
 *    2. Do it here for all meshes from group. GetMesh() -> mesh.Render()
 */

export function View_rerender_from_view_all_buffers(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];

   const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
   mesh.Rerender();

}



/** Remove all view's meshes from Gfx buffer */
export function View_remove_mesh_from_gfx_buffer_by_view_all_vb(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];

   for (let i = 0; i <= view.vb.boundary; i++) {


      // Get the fist mesh of the vb group buffer
      const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[0]);

      Gfx_buffer_remove_mesh_by_vbidx(mesh.gfx.vb.idx, mesh.gfx_bufferidx);

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

      const view = _view_buffer.buffer[i];
      for (let j = 0; j <= view.vb.boundary; j++) {

         console.log(j,
            'progidx', view.vb.buffer[j].info[VIEW_INFO.PROGIDX],
            'vbidx', view.vb.buffer[j].info[VIEW_INFO.VBIDX],
            'num_faces', view.vb.buffer[j].info[VIEW_INFO.NUM_FACES],
            'start', view.vb.buffer[j].info[VIEW_INFO.START],
            '\nbuffer: count', view.vb.buffer[j].data.active_count,
            'boundary', view.vb.buffer[j].data.boundary,
            'size', view.vb.buffer[j].data.size,
            '\nmeshidxs', view.vb.buffer[j].data.buffer,
         );
         // for(let k=0; k <= view.vb.buffer[j].data.boundary; k++){

         //    const mesh_idx = view.vb.buffer[j].data.buffer[k];
         //    console.log(j, 'meshidx', mesh_idx);
         // }
      }
   }
}
