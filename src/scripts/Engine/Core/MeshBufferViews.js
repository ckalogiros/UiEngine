"use strict";

import { Index_buffer_reset_to_index } from "../../Graphics/Buffers/IndexBuffers";
import { Vertex_buffer_state_enable, Vertexbuffer_reset_to_index } from "../../Graphics/Buffers/VertexBuffers";
import { M_Buffer } from "./Buffers";
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


// EXAMPLE for per gfx 
// Loop from root_gfxs root 
// check each mesh's prog and vb indexes and add the to the apropriate buffers
// accumulate the num faces for each buffer


class View {

   constructor(rootidx) {

      this.rootidx = rootidx;
      this.data = new M_Buffer();

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

         if(mesh.gfx.vb.idx === gfxidxs[j][VB]){

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

export function View_reset_from_view(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];

   const mesh = Mesh_buffer_get_mesh_byidx(view.data.buffer[1][0])
   console.log(mesh.GetName())
   
   const progidx = mesh.gfx.prog.idx;
   const vbidx = mesh.gfx.vb.idx;

   const vb_start = mesh.gfx.vb.start; // We want the start of the root mesh of the group, not the start of the root widget
   Vertexbuffer_reset_to_index(progidx, vbidx, vb_start);

   const ib_start = mesh.gfx.ib.start; // We want the start of the root mesh of the group, not the start of the root widget
   Index_buffer_reset_to_index(vbidx, ib_start);

}



export function View_rerender_from_view(view_bufferidx) {

   const view = _view_buffer.buffer[view_bufferidx];

   const len = view.data.buffer[1].length;
   for (let i = 0; i < len-1; i++) {
      
      const mesh = Mesh_buffer_get_mesh_byidx(view.data.buffer[1][i])
      // mesh.AddToGfxFromReset();
      console.log(mesh.GetName(), mesh.geom.pos)
      mesh.AddToGfx();
   }
   
   const mesh = Mesh_buffer_get_mesh_byidx(view.data.buffer[1][0])
   Vertex_buffer_state_enable(mesh.gfx.vb.idx, BUFFER_STATE.NEEDS_UPDATE);

}





























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/


// Buffer of all meshes of the application.
export function View_buffer_print() {
   console.log('_view_buffer:', _view_buffer);
}
