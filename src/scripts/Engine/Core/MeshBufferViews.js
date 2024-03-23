"use strict";

import { Index_buffer_reset_to_index } from "../../Graphics/Buffers/IndexBuffers";
import { Vertex_buffer_state_enable, Vertexbuffer_reset_to_index } from "../../Graphics/Buffers/VertexBuffers";
import { Int16Buffer, M_Buffer } from "./Buffers";
import { Mesh_buffer_get, Mesh_buffer_get_mesh_byidx, Widget_root_buffer_get_byidx, Widget_root_gfx_get, Widget_root_gfx_get_structured } from "./MeshBuffer";


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




const _view_buffer = new M_Buffer();

export function View_get_view_byidx(view_bufferidx) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[view_bufferidx];
}



export function View_get_view_vb_byidx(group_buffersidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_buffersidxs[0]].vb.buffer[group_buffersidxs[1]];
}



export function View_get_view_meshidx_byidx(group_buffersidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_buffersidxs[0]].vb.buffer[group_buffersidxs[1]].data.buffer[group_buffersidxs[2]];
}



export function View_get_view_vb_root_meshidx(group_buffersidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_buffersidxs[0]].vb.buffer[group_buffersidxs[1]].data.buffer[0];
}


// EXAMPLE for per gfx 
// Loop from root_gfxs root 
// check each mesh's prog and vb indexes and add the to the apropriate buffers
// accumulate the num faces for each buffer


class View {

   constructor(rootidx) {

      this.rootidx = rootidx;
      this.vb = new M_Buffer(); // Array of arrays of per vertex buffer mesh indexes


      /**
       * The info is part of the data
       * Also data have a buffer for mesh indexes
       * OR store the info at the end of the buffer
       */
      // this.data = [INT_NULL, INT_NULL, INT_NULL]; // VIEW_INFO:{ VBIDX, START, NUM_FACES }
      // this.info[VIEW_INFO.NUM_FACES] = 0;

   }

}



/** Pass a root_meshidx, as the root for the construction of the view. All of its tree-children will be included to the view */
// TODO: Pass a flag for specific gfx buffer view data creation
export function View_create_per_gfx_view(root_bufferidx, mesh_bufferidx) {


   // Run a precalculation for Int16Buffer size
   // Build the buffers and then create the vie buffers out of them
   const VB = 2;
   const pre_data = [];
   const gfxidxs = [];
   const gfxs = Widget_root_gfx_get_structured(root_bufferidx);
   const len = gfxs.length;
   for (let i = 0; i < len; i++) {
      pre_data[i] = [];
      gfxidxs[i] = [i, gfxs[i].progidx, gfxs[i].vbidx];
   }

   console.warn('pre_data', pre_data, 'gfxidxs', gfxidxs);


   const root_buffer = Widget_root_buffer_get_byidx(root_bufferidx);
   const num_faces = []; // create that many elements for num faces
   for (let i = 0; i < len; i++) { num_faces[i] = 0; } // Init to 0


   // Build the view buffer by storing all view's mesh's indexes in a regular array first
   for (let i = 0; i <= root_buffer.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(root_buffer.buffer[i]);

      for (let j = 0; j < len; j++) {

         if (mesh.gfx.vb.idx === gfxidxs[j][VB]) {

            pre_data[j].push(mesh.mesh_bufferidx);
            num_faces[j] += mesh.geom.num_faces;
            break;
         }
      }
   }

   console.warn('pre_data', pre_data, 'num_faces', num_faces);


   // Store the num_faces as the last array element of pre_data
   for (let i = 0; i < len; i++) {
      pre_data[i].push(num_faces[i]);
   }



   // Finally build the typed array view
   const view = new View(mesh_bufferidx);
   for (let i = 0; i < len; i++) {

      const data = new Int16Array(pre_data[i]);
      view.data.Add(data);
   }

   const viewidx = _view_buffer.Add(view);
   console.warn('view', view);

   return viewidx;
}





/******************************************************************************************************************************/
// Functionality
/*****************************************************************************************************************************/

export function View_reset_from_view_all_buffers(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];

   for(let i=0; i<=view.vb.boundary; i++){
   
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
   // Vertex_buffer_state_enable(mesh.gfx.vb.idx, BUFFER_STATE.NEEDS_UPDATE);



   // for(let i=0; i<=view.vb.boundary; i++){

   //    // Get the root mesh
   //    const mesh = Mesh_buffer_get_mesh_byidx(view.vb.buffer[i].data.buffer[0]);
   //    // mesh.AddToGfxFromReset();
   //    console.log(mesh.GetName(), mesh.geom.pos)
   //    mesh.AddToGfx();
   // }

   // const mesh = Mesh_buffer_get_mesh_byidx(view.data.buffer[1][0])
   // Vertex_buffer_state_enable(mesh.gfx.vb.idx, BUFFER_STATE.NEEDS_UPDATE);

}






















/*******************************************************************************************************************************************************************************/
// NEW IMPLEMENTATION
/*******************************************************************************************************************************************************************************/

_CNT = 0;
export const VIEW_INFO = {
   VBIDX: _CNT++,
   PROGIDX: _CNT++,
   START: _CNT++,
   NUM_FACES: _CNT++,
};



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
function View_add_mesh(groupidx, mesh_bufferidx, num_faces, start, vbidx, progidx) {


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
         info: new Int16Array(4),
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
   const info = View_add_mesh(groupidx, mesh.mesh_bufferidx, mesh.geom.num_faces, mesh.gfx.vb.start, mesh.gfx.vb.idx, mesh.gfx.prog.idx);
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



export function View_build_group_from_root_mesh(mesh) {

   if (mesh.group_bufferidxs[0] !== INT_NULL) alert('@ View_build_group_from_root_mesh(). mesh is alredy in a group')

   const view = new View(mesh.mesh_bufferidx);
   const groupidx = _view_buffer.Add(view);

   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx);
}



/** Bulds from existing view, recurvively for all mesh's children */
export function View_add_to_group_from_root_mesh(mesh, groupidx){

// TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists

   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx)
}

























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/


// Buffer of all meshes of the application.
export function View_buffer_print() {
   console.log('_view_buffer:', _view_buffer);
}
