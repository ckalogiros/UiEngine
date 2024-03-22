"use strict";

import { Vertexbuffer_reset_to_index } from "../../Graphics/Buffers/VertexBuffers.js";
import { Gl_remove_geometry_params } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { Index_buffer_reset_to_index } from "../../Graphics/Buffers/IndexBuffers.js";
import { Program_get_shader_attribute_attribs_per_vertex } from "../../Graphics/ShaderPrograms.js";
import { MouseGetPosDif } from "../Controls/Input/Mouse.js";
import { TimeIntervalsDestroyByIdx } from "../Timers/TimeIntervals.js";
import { Int16Buffer, Int8Buffer, M_Buffer } from "./Buffers.js";
import { BLUEL, GREEN, GREY } from "../Drawables/Material/Base/Colors.js";
import { Create_widget_button, Create_widget_dropdown, Create_widget_section, Create_widget_text } from "./CreateWidget.js";
import { Dropdown_roots_set_root } from "../Drawables/Widgets/Widget_Dropdown.js";
import { Batch_store } from "../Batch/Batch.js";


/**
 * DECISSION:
 * 1. On widget root element remove: Should we sort the buffers?????
 */


// TODO: Temporary for num_faces of meshidxs in per vb buffer 
let temp_accum = [];
temp_accum[0] = 0;
temp_accum[1] = 0;
temp_accum[2] = 0;
temp_accum[3] = 0;
export function TEMP_PRINT_ACCUM(){console.error(temp_accum);}


// TODO: Temporary for vb starts of meshidxs in per vb buffer 
let temp_start = [];
temp_start[0] = 0xffff;
temp_start[1] = 0xffff;
temp_start[2] = 0xffff;
temp_start[3] = 0xffff;
export function TEMP_PRINT_START(){console.error(temp_start);}


const _mesh_buffer = new M_Buffer();
const _gfx_buffer = new M_Buffer();


const _widget_root_buffer = new M_Buffer();
const _root_batch_buffer = [];
const _widget_root_gfx = new M_Buffer();

const _widget_groups_buffer = new M_Buffer();




/*******************************************************************************************************************************************************************************/
// Mesh buffer: Stores all meshes of the application
/*******************************************************************************************************************************************************************************/


/**
 * Widget root: [Widgets]
 */

_mesh_buffer.Init(16);


export function Mesh_buffer_get() { return _mesh_buffer; }



export function Mesh_buffer_get_mesh_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx]; }



export function Mesh_buffer_remove_mesh_byidx(mesh_bufferidx) {

   const mesh = _mesh_buffer.buffer[mesh_bufferidx];
   if (!mesh || mesh === _) {
      console.error('Mesh is NULL.\n@ Mesh_buffer_remove_mesh_byidx(). mesh_bufferidx:',
         mesh_bufferidx, _mesh_buffer,
         '_widget_root_buffer', _widget_root_buffer,
      );

      return;
      alert('Mesh is NULL.\n@ Mesh_buffer_remove_mesh_byidx()\nSEE console error');
   }

   if(mesh.state.mask & MESH_STATE.ACTIVE){

      temp_accum[mesh.gfx.vb.idx] += mesh.geom.num_faces;
      if(temp_start[mesh.gfx.vb.idx] > mesh.gfx.vb.start)  
         temp_start[mesh.gfx.vb.idx] = mesh.gfx.vb.start;
   }

   
   Gfx_buffer_remove_mesh_by_vbidx(mesh.gfx.vb.idx, mesh.gfx_bufferidx);

   // TODO: Remove the whole root is WRONG, we have to destroy all meshes, which we do not do
   // If the mesh is the root, destroy the whole root buffer, gfx_buffer, batch buffer and if any group buffer.
   if (Widget_root_is_widget_root(mesh.root_bufferidx, mesh_bufferidx)) {

      Widget_root_remove_root_byidx(mesh.root_bufferidx);
      mesh.root_bufferidx = INT_NULL;
   }
   else { // ...remove element, BUT the removed mesh may be root of a batch-vb or group-groupdata-vb

      Widget_root_remove_element_byidx(mesh.root_bufferidx, mesh.batch_buffer_vbidx, mesh_bufferidx, mesh.geom.num_faces);


      /*********************************************************************************************************************************/
      // Group Remove num_faces

      const group_idx = mesh.group_bufferidxs[0];
      const group_data_idx = mesh.group_bufferidxs[1];

      if (group_idx !== INT_NULL && group_data_idx !== INT_NULL) { // TODO: I think checking only the [1] is enough

         if (mesh.state.mask & MESH_STATE.ACTIVE) { // Decrement num_faces only if ACTIVE, else the num_faces for the mesh aren't added.

            const is_group_data_empty = Widget_group_update_decrement(mesh.group_bufferidxs, mesh.geom.num_faces);

            const group_data = _widget_groups_buffer.buffer[group_idx].group_data[group_data_idx];

            // If group has 0 num_faces, disconnect the destroyed mesh's idx from the batch.
            if (is_group_data_empty) {

               Widget_group_destroy_group_data(mesh.group_bufferidxs)
               console.warn('EMPTY root_group:', _widget_groups_buffer.buffer[group_idx]);
            }


            /**
             * Replace the meshidx of the group-data(which is the root mesh for this spesific group-data[]),
             * if it is the mesh to be removed, with any other available meshidx from the same group-data
             * and the same  gfx_idxs: [progidx, vbidx].
             */
            
            // If the removed mesh is root to the group and the group is not empty, MUST replace it with the next apropriate mesh's idx
            // Apropriate meshes must have the same gfx_idxs with the removed mesh
            else if (group_data.meshidx === mesh_bufferidx) {

               // Unfortunately we have no other option but to search the meshes through widget_root_buffer

               const len = _widget_root_buffer.buffer[mesh.root_bufferidx].boundary;
               for (let i = 0; i < len; i++) {

                  const m = _mesh_buffer.buffer[_widget_root_buffer.buffer[mesh.root_bufferidx].buffer[i]]; // Get meshes through wigdet_root_buffer
                  // console.log(m.GetName())

                  // Make sure: The fetched mesh in the loop is not the removed mesh, and the fetched mesh belongs to removed mesh's batch-vb.
                  if (m.mesh_bufferidx !== mesh_bufferidx && // If is not the same mesh
                     m.group_bufferidxs[0] === group_idx && // If belongs to same group
                     m.group_bufferidxs[1] === group_data_idx  // If belongs to same gfx 
                  ) {

                     // ... replace
                     _widget_groups_buffer.buffer[group_idx].group_data[group_data_idx].meshidx = m.mesh_bufferidx
                     _widget_groups_buffer.buffer[group_idx].group_data[group_data_idx].start = m.gfx.vb.start;
                     _widget_groups_buffer.buffer[group_idx].group_data[group_data_idx].ib_start = m.gfx.ib.start;
                     break;
                  }
               }
            }
         }
      }
   }

   _mesh_buffer.RemoveByIdx(mesh_bufferidx);
}

/** // NOTE:
 * The insertion of meshes to the _mesh_buffer 
 * happens at CreateWidgets.js, directly accessing the _mesh_buffer buffer
 */





















/*******************************************************************************************************************************************************************************/
// Gfx buffer: All mesh indexes by vertex buffer
/*******************************************************************************************************************************************************************************/

const GFX_VIEW_MESH_DEFAULT_COUNT = 16;
_gfx_buffer.Init(4); // For 4 vertex buffers


export function Gfx_buffer_get() { return _gfx_buffer; }



export function Gfx_buffer_get_vb_by_vbidx(vbidx) { return _gfx_buffer.buffer[vbidx]; }



export function Gfx_buffer_get_mesh_by_vbidx(vbidx, gfx_bufferidx) { return _gfx_buffer.buffer[vbidx][gfx_bufferidx]; }



export function Gfx_buffer_create_vb(vbidx) { _gfx_buffer.AddAtIndex(vbidx, new Int16Buffer(GFX_VIEW_MESH_DEFAULT_COUNT)); }



export function Gfx_buffer_remove_mesh_by_vbidx(vbidx, gfx_bufferidx) { 

   if(gfx_bufferidx === INT_NULL) return; // Avoid created but not active meshes(like deactivated)


   _gfx_buffer.buffer[vbidx].RemoveByIdx(gfx_bufferidx); 

   // Update the gfx_bufferidx of the mesh that repalaced the removed mesh
   const mesh = _mesh_buffer.buffer[_gfx_buffer.buffer[vbidx].buffer[gfx_bufferidx]];


   
   if(mesh && (mesh.state.mask & MESH_STATE.ACTIVE)) { // Case the removed mesh is last in the _gfx_buffer, then there is no replacement and no need for setting the 'mesh.gfx_bufferidx'

      mesh.gfx_bufferidx = gfx_bufferidx;
   }

}



export function Gfx_buffer_store(vbidx, mesh_bufferidx) { return _gfx_buffer.buffer[vbidx].Add(mesh_bufferidx); }



export function Gfx_buffer_update_start(root_bufferidx) {

   const gfx = Widget_root_gfx_get_structured(root_bufferidx);

   const len = gfx.length;
   for (let i = 0; i < len; i++) {
      
      const vbidx = gfx[i].vbidx;
      if(temp_accum[vbidx] === 0) {
         
         // EFFICIENCY: We should loop through all mesh idxs in gfx_buffer only if there is an accumulated value to be updated to
         for (let j = 0; j <= _gfx_buffer.buffer[vbidx].boundary; j++) {

            const mesh = _mesh_buffer.buffer[_gfx_buffer.buffer[vbidx].buffer[j]];
            if(mesh && mesh.gfx.vb.start >= temp_start[vbidx]){

               mesh.gfx.vb.start -= temp_accum[vbidx] * mesh.gfx.attribsPerVertex * mesh.gfx.vertsPerRect;
            }
         }
      }
      
   }

   // TODO: Integrate these to the ??_gfx_buffers?? Because each element represents a vertex buffer.
   temp_accum[0] = 0; temp_accum[1] = 0; temp_accum[2] = 0; temp_accum[3] = 0;
   temp_start[0] = 0xffff; temp_start[1] = 0xffff; temp_start[2] = 0xffff; temp_start[3] = 0xffff;
}






















/*******************************************************************************************************************************************************************************/
// Widget root buffer: Stores all root meshes of a scene
/*******************************************************************************************************************************************************************************/


/**
 * Widget root: [Int16]
 */


_widget_root_buffer.Init(8);


export function Widget_root_buffer_get() { return _widget_root_buffer; }



export function Widget_root_buffer_get_byidx(idx) { return _widget_root_buffer.buffer[idx]; }



export function Widget_root_create_root(mesh_bufferidx) {

   const root_idx = _widget_root_buffer.Add(new Int16Buffer(6));
   // _widget_root_buffer.buffer[root_idx].Init(INT_NULL);

   _widget_root_buffer.buffer[root_idx].Add(mesh_bufferidx);

   Widget_root_gfx_create(root_idx);

   Widget_root_batch_create_root(root_idx, mesh_bufferidx)

   return root_idx;
}


// DANGER!!! if the root is removed, the whole root buffer should be invalid and destroyed
function Widget_root_remove_root_byidx(root_bufferidx) {
   if (_widget_root_buffer.buffer[root_bufferidx] !== INT_NULL) {

      Widget_root_batch_remove_byidx(root_bufferidx);
      Widget_root_gfx_remove_byidx(root_bufferidx)
      console.warn('Removing widget root:', root_bufferidx, _widget_root_buffer.buffer[root_bufferidx]);
      _widget_root_buffer.RemoveByIdx(root_bufferidx);
   }
}



function Widget_root_remove_element_byidx(root_bufferidx, batch_buffer_vbidx, mesh_bufferidx, num_faces) {

   if (_widget_root_buffer.buffer[root_bufferidx] !== INT_NULL) {

      const elem_found = Widget_root_find_element_byidx(root_bufferidx, mesh_bufferidx);

      if (elem_found !== INT_NULL) {


         /*********************************************************************************************************************************/
         // Batch Remove num_faces

         // For widget_root, actove or inactive, the num_faces must be decrement, compare to widget_groups.
         const is_batch_vb_empty = Widget_root_batch_update_decrement_accumulator(root_bufferidx, batch_buffer_vbidx, num_faces);

         // If batch-vb has 0 num_faces, set the batch-vb-meshidx to null.
         if (is_batch_vb_empty) {

            _root_batch_buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx = INT_NULL;
            console.log('EMPTY root_batch:', _root_batch_buffer[root_bufferidx])
         }


         /**
          * Replace the meshidx of the batch-vb(which is the root mesh for the spesific batch-vb[]),
          * if it is the mesh to be removed, with any other available meshidx from the same batch-vb 
          */
         
         // If the removed mesh happens to be root of any of the batch-vbs, we MUST replace it with the FIRST, same SID, mesh_bufferidx.
         else if (_root_batch_buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx === mesh_bufferidx) {

            // Unfortunately we have no other option but to search the meshes through widget_root_buffer

            const len = _widget_root_buffer.buffer[root_bufferidx].boundary;
            let new_root_meshidx = INT_NULL;
            let min_start = 0xffff;
            for (let i = 0; i < len; i++) {
               
               // for (let j = 0; j < _mesh_buffer.boundary; j++) {
               // }
               
               const mesh = _mesh_buffer.buffer[_widget_root_buffer.buffer[root_bufferidx].buffer[i]]; // Get meshes through wigdet_root_buffer
               if (mesh.mesh_bufferidx !== mesh_bufferidx && 
                  mesh.batch_buffer_vbidx === batch_buffer_vbidx && 
                  mesh.gfx.vb.start < min_start ) {

                     min_start = mesh.gfx.vb.start;
                     new_root_meshidx = mesh.mesh_bufferidx;
               }

               // const mesh = _mesh_buffer.buffer[_widget_root_buffer.buffer[root_bufferidx].buffer[i]]; // Get meshes through wigdet_root_buffer

               // // Make sure: The fetched mesh in the loop is not the removed mesh, and the fetched mesh belongs to removed mesh's batch-vb.
               // if (mesh.mesh_bufferidx !== mesh_bufferidx && 
               //    mesh.batch_buffer_vbidx === batch_buffer_vbidx && 
               //    mesh.gfx.vb.start < min_start ) {

               //       min_start = mesh.gfx.vb.start;
               //       new_root_meshidx = mesh.mesh_bufferidx;
               //    // Set the first found mesh as the root of this batch-vb
               //    // _root_batch_buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx = mesh.mesh_bufferidx;
               //    // break;
               // }
            }

            _root_batch_buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx = new_root_meshidx;
         }


         /*********************************************************************************************************************************/
         // Batch Remove
         _widget_root_buffer.buffer[root_bufferidx].RemoveByIdx(elem_found);

      }
      else console.error('Widget root FAILED to remove element. root idx:', root_bufferidx, 'mesh_bufferidx', mesh_bufferidx, ' element idx:', elem_found,);

   }
}



function Widget_root_find_element_byidx(root_bufferidx, mesh_bufferidx) {

   const root = _widget_root_buffer.buffer[root_bufferidx];

   // Avoid checking the root element
   for (let i = 1; i <= root.boundary; i++) {

      if (root.buffer[i] === mesh_bufferidx) {
         return i;
      }
   }

   console.error('failed to find root idx for remove')

   return INT_NULL;
}



export function Widget_root_add_mesh(root_bufferidx, mesh_bufferidx) {

   _widget_root_buffer.buffer[root_bufferidx].Add(mesh_bufferidx);
}



function Widget_root_is_widget_root(root_bufferidx, mesh_bufferidx) {

   // The widget root buffer store the root mesh at index 0, which is an index to the _mesh_buffer.
   // So if the index 'mesh_bufferidx' is the same as the 0-th element of the widget_buffer[root_bufferidx],
   // then this widget_root element is a root mesh
   if (root_bufferidx !== INT_NULL && _widget_root_buffer.buffer[root_bufferidx].buffer[0] === mesh_bufferidx) // If the mesh 
      return true;
   return false;
}


























/*******************************************************************************************************************************************************************************/
// ## widget root batch buffer
/*******************************************************************************************************************************************************************************/


/**
 * The difference of this Widget Root Batch Buffer with the Batch buffer in Batch.js is:
 * This buffer is categorizing a batch group, based on a root widget or a widget group
 * into an array of 1 element per unique vertex buffer of the group/root,
 * and for each vertex buffer element in that array stores:
 *    the mesh_buffer idx of the first (root) mesh index,
 *    the start index of that mesh in it's vertex buffer
 *    as well as the number of faces of all the meshes in the batch (1 face = 4 vertices).
 * 
 * Now that we have a root mesh for each of the vertex buffers of the whole group of widgets,
 * we can call Batch_Store() for each different vertex buffer, passing the start index
 * and the number of faces, we can update all meshes of that vertex buffer linearly
 * with one call.
 */

/* Another buffer to store, for every widget root, 
 * all the vertex buffer's starts (the start in the actual gl vertex buffer)
 * and the number of faces count, that the whole vertex buffer has as attributes of meshes,
 * in order to create a batch update and with one call to Gl_update we can
 * update the buffer from start until num_faces*verticesPerRect*attribsPerVertex.
 */




export function Widget_root_batch_get(root_bufferidx) {
   return _root_batch_buffer[root_bufferidx];
}



export function Widget_root_batch_remove_byidx(root_bufferidx) {
   console.warn('widget root batch removing root batch by splice. IMPLEMENT correct: removing by .Removeidx()', _root_batch_buffer[root_bufferidx]);
   _root_batch_buffer.splice(root_bufferidx, 1)
}



function Widget_root_batch_create_root(root_bufferidx, mesh_bufferidx) {

   const root_batch_vb = {
      rootidx: root_bufferidx,
      meshidx: mesh_bufferidx,
      vb: [], // To store the mesh_bufferidx of the first mesh of the batch, as well as the number of faces of all the meshes in one batch(1 face = 4 vertices)
   };

   const idx = _root_batch_buffer.push(root_batch_vb);

   if (root_bufferidx !== idx - 1) alert('Widget root batch buffer not the same with the Widget root buffer');
}



export function Widget_root_batch_create_vb(root_bufferidx, mesh_bufferidx) {

   if (root_bufferidx === INT_NULL) return; // Case there is no widget root creation.

   const root_batch = _root_batch_buffer[root_bufferidx];
   const vb_dataidx = root_batch.vb.push({
      num_faces: 0,
      meshidx: mesh_bufferidx,
   });

   return vb_dataidx - 1;
}



export function Widget_root_batch_assign_and_accum_to_vb(root_bufferidx, mesh_bufferidx, progidx, vbidx, num_faces) {

   if (root_bufferidx === INT_NULL) return;

   const gfxidxs = Widget_root_gfx_get_structured(root_bufferidx);
   const len = gfxidxs.length;

   let stored = false;
   for (let i = 0; i < len; i++) {

      if (gfxidxs[i].progidx === progidx && gfxidxs[i].vbidx === vbidx) {

         if (_root_batch_buffer[root_bufferidx].vb[i].meshidx === mesh_bufferidx && _root_batch_buffer[root_bufferidx].vb[i].num_faces > 0) {

         }
         else {

            if (_root_batch_buffer[root_bufferidx].vb[i].meshidx === INT_NULL) {
               _root_batch_buffer[root_bufferidx].vb[i].meshidx = mesh_bufferidx;
            }

            _root_batch_buffer[root_bufferidx].vb[i].num_faces += num_faces;
            const mesh = _mesh_buffer.buffer[mesh_bufferidx];

            // if(_root_batch_buffer[root_bufferidx].vb[i].meshidx === mesh.mesh_bufferidx)

            mesh.batch_buffer_vbidx = i;
         }

         stored = true;
         break;
      }

   }


   // Case the GFX buffers(WebGL) are already created, and in the 'Gfx_generate_context()' 
   // there is no call to this 'Widget_root_gfx_add()', // we must create the vb data.
   if (!stored)
      Widget_root_gfx_add(root_bufferidx, mesh_bufferidx, progidx, vbidx);

}



/**
 * This sets all vb face accumulator of a root widget batch. 
 * Usualy to re-run the  'Widget_root_batch_create_from_root_children()' 
 * in the case new meshes have been added to the root widget during run time.
 */
export function Widget_root_batch_reset_accumulator(root_bufferidx) {

   const root_batch = _root_batch_buffer[root_bufferidx];

   const len = root_batch.vb.length;
   for (let i = 0; i < len; i++) {

      // Get the first mesh, just to extract the num_faces
      const mesh = Mesh_buffer_get_mesh_byidx(root_batch.vb[i].meshidx);
      root_batch.vb[i].num_faces = mesh.geom.num_faces; // Leave the faces count for the first mesh of all vbs 
   }

}



export function Widget_root_batch_update_increment_accumulator(root_bufferidx, batch_buffer_vbidx, num_faces) {

   _root_batch_buffer[root_bufferidx].vb[batch_buffer_vbidx].num_faces += num_faces;
}



export function Widget_root_batch_update_decrement_accumulator(root_bufferidx, batch_buffer_vbidx, num_faces) {

   const batch_vb = _root_batch_buffer[root_bufferidx].vb[batch_buffer_vbidx];

   if (batch_vb === _ || !batch_vb)
      console.error('batch_vb NULL', 'root_bufferidx', root_bufferidx, 'batch_buffer_vbidx', batch_buffer_vbidx, '_root_batch_buffer', _root_batch_buffer)

   batch_vb.num_faces -= num_faces;

   if (batch_vb.num_faces < 0) {
      console.error('Root Batch num_faces negative. root_bufferidx:', root_bufferidx, 'batchidx', batch_buffer_vbidx, 'num_faces', batch_vb.num_faces);
   }

   if (batch_vb.num_faces === 0) return true

   return false;
}

























/*******************************************************************************************************************************************************************************/
// Widget Root All Gfx Indexes
// Widgets all gfx indexes. Store in a buffer(per root widget) all of the childrens (recursive) gfx indexes (one index per gfx buffer) to have fast access to all gfx buffers
// The buffer is separated from _widget_root_buffer for efficiency
/*******************************************************************************************************************************************************************************/

_widget_root_gfx.Init(1);



// Returns an array [progidx:INT, vbidx:INT, ...]
export function Widget_root_gfx_get(root_bufferidx) {
   return _widget_root_gfx.buffer[root_bufferidx];
}



export function Widget_root_gfx_remove_byidx(root_bufferidx) {
   console.warn('Removing widget root:', _widget_root_gfx.buffer[root_bufferidx]);
   return _widget_root_gfx.RemoveByIdx(root_bufferidx);
}



// Create a stuctured representation of all widget root gfx buffers istead of the int8 array of triads of plain integers.
export function Widget_root_gfx_get_structured(root_bufferidx) {

   const gfx_idxs = _widget_root_gfx.buffer[root_bufferidx];
   let structured = [];

   for (let i = 0; i <= gfx_idxs.boundary; i += GFX.SIZE) {

      const s = {
         progidx: gfx_idxs.buffer[i + GFX.PROG_IDX],
         vbidx: gfx_idxs.buffer[i + GFX.VB_IDX],
      };
      structured.push(s);
   }
   return structured;
}



function Widget_root_gfx_create(root_bufferidx) {

   const idx = _widget_root_gfx.Add(new Int8Buffer(2)); // 2 elements is enough for 1 gfx indexes (0:progidx, 1:vbidx) 

   if (root_bufferidx !== idx) alert('Widget root gfx buffer not the same with the Widget root buffer');
}



export function Widget_root_gfx_add(root_bufferidx, mesh_bufferidx, progidx, vbidx) {

   if (root_bufferidx === INT_NULL) return; // Case there is no widget root creation.

   _widget_root_gfx.buffer[root_bufferidx].Add(progidx);
   _widget_root_gfx.buffer[root_bufferidx].Add(vbidx);

   const vb_dataidx = Widget_root_batch_create_vb(root_bufferidx, mesh_bufferidx);

   // This is the easiest way to store the 'vb_dataidx' to the mesh's batch_buffer_vbidx variable.
   const mesh = _mesh_buffer.buffer[mesh_bufferidx]; // Get the mesh from MeshBuffer
   mesh.batch_buffer_vbidx = vb_dataidx; // Assign the 'batch_buffer_vbidx'

}

























/*******************************************************************************************************************************************************************************/
// Widget Group Buffer: Organize portions of root widgets to smaller groups in order to store some info handle some processes
/*******************************************************************************************************************************************************************************/

/**
 * group = {
 *    meshidx: mesh_bufferidx, // The group's root mesh index
 *    group_data: [], // Store data for each different(one for each vertex buffer) vertex buffer of the meshes of the group
 * }
 *  
 *    group_data: {
 *       meshidx: mesh_bufferidx,
 *       start: start, // The start of the first element of the group in this specific vertex buffer
 *       num_faces: 0, // The number of total faces of all meshes of the vertex buffer belonging to the group. 
 *       gfx_idxs: [progidx, vbidx],
 *   }
 */


_widget_groups_buffer.Init(1)



export function Widget_group_get(group_bufferidx) {
   return _widget_groups_buffer.buffer[group_bufferidx];
}



export function Widget_group_get_rootidx(group_bufferidx) {
   return _widget_groups_buffer.buffer[group_bufferidx].meshidx;
}



export function Widget_group_remove_byidx(group_bufferidx) {
   _widget_groups_buffer.RemoveByIdx(group_bufferidx);
}



// Group meshes together. Store the start and num_faces of a bunch of meshes belonging to the same vertex buffer. 
// Makes it easy to remove meshes from a vertex buffer by using the start and the num_faces index, so the elements to the right of the removed chunk can be shifted to replace the chunks gap.
// Create a new group. Params: pass the root mesh mesh_bufferidx and the start of the mesh in the vertex buffer as well as the number of faces of the mesh
export function Widget_group_create(mesh_bufferidx, gfx) {

   const progidx = gfx.prog.idx, vbidx = gfx.vb.idx, vb_start = gfx.vb.start, ib_start = gfx.ib.start;

   // Uppon creation, initialize with the root mesh of the new group. 
   const group = {
      meshidx: mesh_bufferidx, // The group's root mesh index
      group_data: [], // Store data for each different(one for each vertex buffer) vertex buffer of the meshes of the group
   };

   const group_bufferidx = _widget_groups_buffer.Add(group);

   const data = {
      meshidx: mesh_bufferidx,
      start: vb_start, // The start vertex buffer index, of the first element of this group
      ib_start: ib_start,  // The start index buffer index, of the first element of this group
      num_faces: 0, // The number of total faces of all meshes of the vertex buffer belonging to the group. 
      gfx_idxs: [progidx, vbidx],
   }

   const vb_data_idx = _widget_groups_buffer.buffer[group_bufferidx].group_data.push(data);
   const group_buffer_vbidx = vb_data_idx - 1;


   // The group's root mesh back in caller site, must store the group's index for refferencing to the group.
   return [group_bufferidx, group_buffer_vbidx];
}



// Case mesh is added on run time, create or use group_data
export function Widget_group_add(group_bufferidx, gfx, num_faces = _, mesh_bufferidx) {

   /**DEBUG */ if (num_faces === _) console.error('Forget to pass param: num_faces. @ Widget_group_add()');


   const progidx = gfx.prog.idx, vbidx = gfx.vb.idx, start = gfx.vb.start, ib_start = gfx.ib.start;
   const group = _widget_groups_buffer.buffer[group_bufferidx];

   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      if (group.group_data[i].gfx_idxs[GFX.PROG_IDX] === progidx && group.group_data[i].gfx_idxs[GFX.VB_IDX] === vbidx) {

         group.group_data[i].num_faces += num_faces;

         // Case the mesh inserted to the group is rendered first in the vertex buffer. 
         if (group.group_data[i].start > start) {
            group.group_data[i].start = start;
         }
         if (group.group_data[i].ib_start > ib_start) {
            group.group_data[i].ib_start = ib_start;
         }

         // for (let j = 0; j < group.group_data.length; j++) console.log('group_data:', group.group_data[j].num_faces, )
         return i; // vb found, no need to create. Return the index to the mesh for refference.
      }

   }

   // Else if group_data NOT {found and returned}, create group_data for the vertex buffer the mesh belongs to. 
   const vb_data_idx = _widget_groups_buffer.buffer[group_bufferidx].group_data.push({
      meshidx: mesh_bufferidx,
      start: start, // The start of the first element of the group in this specific vertex buffer
      ib_start: ib_start, // The start of the first element of the group in this specific vertex buffer
      num_faces: num_faces, // The number of total faces of all meshes of the vertex buffer belonging to the group. 
      gfx_idxs: [progidx, vbidx],
   });


   // The group's root mesh back in caller site, must store the group's index for refferencing to the group.
   return vb_data_idx - 1;
}



// Case mesh is added on run time, create or use group_data
export function Widget_group_find_but_not_insert(group_bufferidx, gfx) {

   const progidx = gfx.prog.idx, vbidx = gfx.vb.idx;
   const group = _widget_groups_buffer.buffer[group_bufferidx];

   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      if (group.group_data[i].gfx_idxs[GFX.PROG_IDX] === progidx && group.group_data[i].gfx_idxs[GFX.VB_IDX] === vbidx) {
         return [group_bufferidx, i];
      }

   }

   // Else if group_data NOT {found and returned}, create group_data for the vertex buffer the mesh belongs to. 
   console.error('Trying to find a group_data for a mesh, but the mesh\'s gfx hasn\'t been initialized for this group.group_data');
   console.warn('IMPLEMENT HERE the creation of a new group_data apropriate to the mesh\'s gfx buffers');

   return 1;
}



/**
 * // TODO: 
 * Remove the init all meshes for batch buffer in debugInfoUi,
 * create instead a Create batch buffer functio,
 * increment and decrement with the group buffer
 * 
 */
export function Widget_group_update_increment(group_bufferidxs, num_faces) {

   _widget_groups_buffer.buffer[group_bufferidxs[0]].group_data[group_bufferidxs[1]].num_faces += num_faces;
}



export function Widget_group_update_decrement(group_bufferidxs, num_faces, debug_mesh = null) {


   const group_data = _widget_groups_buffer.buffer[group_bufferidxs[0]].group_data[group_bufferidxs[1]];
   group_data.num_faces -= num_faces;

   if (group_data.num_faces < 0) {
      console.error('Group Widget num_faces negative. group_bufferidxs:', group_bufferidxs, 'group_data.num_faces', group_data.num_faces);
   }

   if (group_data.num_faces === 0) {

      return true
   }

   return false;
}



export function Widget_group_destroy_group(group_bufferidxs) {

   _widget_groups_buffer.RemoveByIdx(group_bufferidxs[0]);

}



function Widget_group_destroy_group_data(group_bufferidxs) {

   const group = _widget_groups_buffer.buffer[group_bufferidxs[0]];

   group.group_data.splice(group_bufferidxs[1], 1);


}



// Updates the start index of each mesh in the same vertex buffer. In case that the start has changed from the group's creation.
// NOT to be confused with the updating of the starts of meshes after a Vertex buffer Reset() and Rerender().
export function Widget_group_update_start(group_bufferidx) {

   const group = _widget_groups_buffer.buffer[group_bufferidx];

   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(group.group_data[i].meshidx);
      group.group_data[i].start = mesh.gfx.vb.start;
      group.group_data[i].ib_start = mesh.gfx.ib.start;

   }
}



// TODO: We must implement a very acurate num_faces increment-decrement system
/** Uses the widget_group buffer to remove that manu "num_faces" from the vertex buffers, which the vb indexes are taken of the widget_root_gfx buffer */
export function Widget_group_reset_partially_gfx_buffers(root_dp) {

   const group = Widget_group_get(root_dp.group_bufferidxs[0]);
   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      const progidx = group.group_data[i].gfx_idxs[GFX.PROG_IDX];
      const vbidx = group.group_data[i].gfx_idxs[GFX.VB_IDX];

      if (progidx === INT_NULL || vbidx === INT_NULL) {
         console.error('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes', 'progidx', progidx, 'vbidx', vbidx)
         alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')
      }

      const start = group.group_data[i].start;
      const num_faces = group.group_data[i].num_faces;

      const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK
      const attribs_per_vertex = Program_get_shader_attribute_attribs_per_vertex(progidx);

      //TODO: Pass ibidx for good implementation
      Gl_remove_geometry_params(vbidx, num_faces, start, attribs_per_vertex, vertices_per_rect);
   }
}



/** Reset the vgfx buffers from an index till the end. Fast, it does not remove from gfx buffers. Works only if there is no other group for that gfx buffers. */
export function Widget_group_reset_from_group_to_vb_end(group_bufferidxs) {

   // const group = Widget_group_get(root_dp.group_bufferidxs[0]);
   const group = Widget_group_get(group_bufferidxs[0]);
   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      const progidx = group.group_data[i].gfx_idxs[GFX.PROG_IDX];
      const vbidx = group.group_data[i].gfx_idxs[GFX.VB_IDX];

      if (progidx === INT_NULL || vbidx === INT_NULL) {
         console.error('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes', 'progidx', progidx, 'vbidx', vbidx)
         alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')
      }

      const vb_start = group.group_data[i].start; // We want the start of the root mesh of the group, not the start of the root widget
      Vertexbuffer_reset_to_index(progidx, vbidx, vb_start);

      const ib_start = group.group_data[i].ib_start; // We want the start of the root mesh of the group, not the start of the root widget
      Index_buffer_reset_to_index(vbidx, ib_start);

   }
}



/** Reset the vgfx buffers from an index till the end. Fast, it does not remove from gfx buffers. Works only if there is no other group for that gfx buffers. */
export function Widget_group_reset_from_group_to_vb_end_specific_vbidx(group_bufferidx, vb_bufferidx) {

   // const group = Widget_group_get(root_dp.group_bufferidxs[0]);
   const group = Widget_group_get(group_bufferidx);

   const progidx = group.group_data[vb_bufferidx].gfx_idxs[GFX.PROG_IDX];
   const vbidx = group.group_data[vb_bufferidx].gfx_idxs[GFX.VB_IDX];

   if (progidx === INT_NULL || vbidx === INT_NULL) {
      console.error('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes', 'progidx', progidx, 'vbidx', vbidx)
      alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')
   }

   const vb_start = group.group_data[vb_bufferidx].start; // We want the start of the root mesh of the group, not the start of the root widget
   Vertexbuffer_reset_to_index(progidx, vbidx, vb_start);

   const ib_start = group.group_data[vb_bufferidx].ib_start; // We want the start of the root mesh of the group, not the start of the root widget
   Index_buffer_reset_to_index(vbidx, ib_start);
}



/** Rerenders from root through mesh tree calls to Rerender(Slow)  */
export function Widget_group_rerender_tree_mesh_recursive(group_bufferidx) {

   const rootidx = _widget_groups_buffer.buffer[group_bufferidx].meshidx;
   const mesh = _mesh_buffer.buffer[rootidx];
   mesh.Rerender();
}



/** Rerenders from root through loop calls to Rerender(Fast) */
export function Widget_group_rerender_from_group(group_bufferidx) {

   /**
    * IMPLEMENT:
    * Unfortunately the widget_group does not have all of its meshes indexes 
    */
   alert('IMPLEMENT ME. Widget_group_rerender_from_group');

   const rootidx = _widget_groups_buffer.buffer[group_bufferidx].meshidx;

   // for (let i=0; i<; i++){

   //    const meshidx = 
   //    const mesh = _mesh_buffer.buffer[rootidx];

   //    mesh.Rerender();
   // }
}





























/*******************************************************************************************************************************************************************************/
// Global Update Functions
/*******************************************************************************************************************************************************************************/


export function Widget_movexy(params) {

   const root = params.params;

   // Destroy the time interval calling this function if the mesh is not grabed.
   if (root.StateCheck(MESH_STATE.IN_GRAB) === 0 && root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      root.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.MOVE);
      return;
   }

   // Move the mesh
   const rootidx = root.root_bufferidx;
   const widget_buffer = _widget_root_buffer.buffer[rootidx];

   if (!widget_buffer) return

   const pos = MouseGetPosDif();

   if (pos.x === 0 && pos.y === 0) return;

   for (let i = 0; i <= widget_buffer.boundary; i++) {

      const mesh = _mesh_buffer.buffer[widget_buffer.buffer[i]];
      if (mesh.state.mask & MESH_STATE.ACTIVE) {
         mesh.geom.MoveXY(pos.x, -pos.y, mesh.gfx)
      }

   }
}



export function Widget_root_batch_move_from_batch_buffer(root_bufferidx, x, y) {

   for (let i = 0; i <= _widget_root_buffer.buffer[root_bufferidx].boundary; i++) {
      // Increment each mesh, that is part of this widget_root
      _mesh_buffer.buffer[_widget_root_buffer.buffer[root_bufferidx].buffer[i]].geom.pos[0] += x;
      _mesh_buffer.buffer[_widget_root_buffer.buffer[root_bufferidx].buffer[i]].geom.pos[1] += y;
   }

   const len = _root_batch_buffer[root_bufferidx].vb.length
   for (let i = 0; i < len; i++) {

      // Get the batch's root mesh for each vb gfx buffers
      const mesh = _mesh_buffer.buffer[_root_batch_buffer[root_bufferidx].vb[i].meshidx];

      if (mesh) {

         mesh.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;

         const update_data = {
            sizes: [2],
            data: [x, y],
         };

         // The batch_store needs the number of meshes to update as well as the move value
         Batch_store(mesh,
            SHADER_ATTRIBUTES.WPOS4,
            update_data,
            _root_batch_buffer[root_bufferidx].vb[i].num_faces);
      }

   }

}



export function TEMP_REMOVE_CHILDREN(root, firstidx, lastidx) {

   let toidx = 0;
   let start = 0;
   const len = root.children.boundary;

   if (lastidx >= len - 1) {
      start = 0;
      toidx = firstidx
      last = firstidx
   }
   else {
      start = lastidx
      toidx =
         first = lastidx;
   }

   console.log(`root:${root.GetName()} firstidx:${firstidx} lastidx:${lastidx} first:${first} last:${last} toidx:${toidx}`)

   const new_children_buffer = new M_Buffer();
   new_children_buffer.Init(firstidx);


   if (!(firstidx > 0 && lastidx < len)) {
      for (let i = start; i < toidx; i++) {
         new_children_buffer.Add(root.children.buffer[i]);
      }
   }
   for (let i = 0; i < len; i++) {

      if (i < firstidx || i > lastidx) {
         new_children_buffer.Add(root.children.buffer[i]);
      }
   }

   root.children = new_children_buffer;

}



export function TEMP_REMOVE_CHILDREN_CENTER(root, firstidx, lastidx) {

   console.log(`root:${root.GetName()} firstidx:${firstidx} lastidx:${lastidx} first:${first} last:${last} toidx:${toidx}`)

   const new_children_buffer = new M_Buffer();
   new_children_buffer.Init(firstidx);
   for (let i = 0; i <= root.children.boundary; i++) {

      if (i < firstidx || i > lastidx) {
         new_children_buffer.Add(root.children.buffer[i]);
      }
   }

   root.children = new_children_buffer;

}



export function Movey_from_widget_root_buffer(mesh, ydif) {

   const widget_root_buffer = Widget_root_buffer_get_byidx(mesh.root_bufferidx);
   // console.log('----------------------')
   for (let i = 3; i <= widget_root_buffer.boundary; i++) {

      // EFFICIENCY: Maybe its better to access the _mesh_buffer directly from the MeshBuffer.js file. Also later we use 'Widget_root_batch_get'
      const mesh = Mesh_buffer_get_mesh_byidx(widget_root_buffer.buffer[i]);
      mesh.geom.pos[1] += ydif;
      // mesh.geom.MoveY(ydif, mesh.gfx);
   }
}



export function Movey_from_widget_root_buffer_and_batch_update(mesh, ydif) {

   const widget_root_buffer = Widget_root_buffer_get_byidx(mesh.root_bufferidx);
   // console.log('----------------------')
   for (let i = 3; i <= widget_root_buffer.boundary; i++) {

      // EFFICIENCY: Maybe its better to access the _mesh_buffer directly from the MeshBuffer.js file. Also later we use 'Widget_root_batch_get'
      const mesh = Mesh_buffer_get_mesh_byidx(widget_root_buffer.buffer[i]);
      mesh.geom.pos[1] += ydif;
      // mesh.geom.MoveY(ydif, mesh.gfx);
   }

   /** UPDATE VIA GROUPS BUFFER */
   const group_batch_buffer = Widget_group_get(mesh.group_bufferidxs[0]);

   const len = group_batch_buffer.group_data.length
   for (let i = 0; i < len; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(group_batch_buffer.group_data[i].meshidx);

      mesh.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;
      const update_data = {
         sizes: [2],
         data: [0, ydif],
      };
      Batch_store(mesh, SHADER_ATTRIBUTES.WPOS4, update_data, group_batch_buffer.group_data[i].num_faces, group_batch_buffer.group_data[i].start); // The batch_store needs the number of meshes to update as well as the move value
   }
}



/** Reset all gfx buffers, from start index 0, for the widget_root buffer, via it's widget_root_gfx buffer */
export function Widget_root_reset_gfx(root_bufferidx) {

   const rootgfx = _widget_root_gfx.buffer[root_bufferidx];
   for (let i = 0; i <= rootgfx.boundary; i += GFX.SIZE) {

      if (rootgfx.buffer[i + GFX.PROG_IDX] === INT_NULL || rootgfx.buffer[i + GFX.VB_IDX] === INT_NULL)
         alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')

      // Add to vertexbuffer
      Vertexbuffer_reset_to_index(rootgfx.buffer[i + GFX.PROG_IDX], rootgfx.buffer[i + GFX.VB_IDX], 0);
      Index_buffer_reset_to_index(rootgfx.buffer[i + GFX.VB_IDX], 0);
   }
}






















/****************************************************************************************************************************************************/
// DEBUG Info - Create text for render
/****************************************************************************************************************************************************/


export function Widget_root_create_text_info() {

   const col_menu = GREY[3], col_dp = GREY[1];

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 6], [400, 400, 0], [0, 0], TRANSPARENCY(BLUEL[9], .3), 'Wigdet Root Buffers Info');

   const destroy = Create_widget_button(_, 'Destroy', _, _, _, TRANSPARENCY(GREEN[7], .3), _, _, _, _, _);
   // destroy.Bind(TEMP, _, s);
   s.AddItem(destroy);

   // s.Calc()

   const margin = [4, 4];
   const style = [0, 3, 1];;
   const gr = _widget_groups_buffer;

   const grw = Create_widget_dropdown(_, 'Widget Groups', [100, 100, 0], col_dp, col_menu, _, _, _, _, _, margin);
   grw.CreateClickEvent();
   Dropdown_roots_set_root(grw, grw)
   s.AddItem(grw)

   const group_info = Create_widget_text(_, `count:${gr.active_count} size:${gr.size}`);
   grw.AddToMenu(group_info);

   for (let i = 0; i <= gr.boundary; i++) {


      const group = gr.buffer[i];


      const groupw = Create_widget_dropdown(_, 'Group', [100, 100, 0], col_dp, col_menu, _, [2, 2], _, _, style, margin);
      groupw.CreateClickEvent();
      grw.AddToMenu(groupw)

      const group_info = Create_widget_text(_, `count:${group.active_count} size:${group.size}`);
      groupw.AddToMenu(group_info);

      const len = group.group_data.length;
      for (let i2 = 0; i2 < len; i2++) {

         const group_data = group.group_data[i2];

         const group_dataw = Create_widget_dropdown(_, 'group data', [100, 100, 0], col_dp, col_menu, _, [2, 2], _, _, style, margin);
         group_dataw.CreateClickEvent();
         groupw.AddToMenu(group_dataw)


         { const info = Create_widget_text(_, `meshidx:${group_data.meshidx} num_faces:${group_data.num_faces}`); group_dataw.AddToMenu(info); }
         { const info = Create_widget_text(_, `start:${group_data.start} ib_start:${group_data.ib_start}`); group_dataw.AddToMenu(info); }
         // { const info = Create_widget_text(_, `ib_start:${group_data.ib_start}`); group_dataw.AddToMenu(info); }

         /****************************************************************************************************************************/
      }
   }


   s.Calc()
   return s;
}
























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/


// Buffer of all meshes of the application.
export function Mesh_buffer_print() {
   console.log('_mesh_buffer:', _mesh_buffer);
}



export function Mesh_buffer_print_loop() {

   console.log('size:', _mesh_buffer.size, 'boundary:', _mesh_buffer.boundary, 'count:', _mesh_buffer.active_count,);
   for (let i = 0; i <= _mesh_buffer.boundary; i++) {

      if (_mesh_buffer.buffer[i]) {

         console.log(i,
            // 'id:', _mesh_buffer.buffer[i].id,
            'mbidx:', _mesh_buffer.buffer[i].mesh_bufferidx,
            'rbidx:', _mesh_buffer.buffer[i].root_bufferidx,
            'gfxidx', _mesh_buffer.buffer[i].gfx_bufferidx,
            'batchidx:', _mesh_buffer.buffer[i].batch_buffer_vbidx,
            'groupidx:', _mesh_buffer.buffer[i].group_bufferidxs[0], _mesh_buffer.buffer[i].group_bufferidxs[1],
            'child idx:', _mesh_buffer.buffer[i].idx,
            'name:', _mesh_buffer.buffer[i].GetName(),
         );
      }
      else console.log(i, 'NULL')
   }
}



// export function Gfx_buffer_print_loop() {
export function Gfx_buffer_print() {

   console.log('size:', _gfx_buffer.size, 'boundary:', _gfx_buffer.boundary, 'count:', _gfx_buffer.active_count,);
   for (let i = 0; i <= _gfx_buffer.boundary; i++) {
      
      if (_gfx_buffer.buffer[i]) {
         
         console.log('vb', i, 
         '\n size:', _gfx_buffer.buffer[i].size, 'boundary:', _gfx_buffer.buffer[i].boundary, 'count:', _gfx_buffer.buffer[i].active_count,
         '\n ', _gfx_buffer.buffer[i].buffer);
      }
      else console.log(i, 'NULL')
   }
}



export function Gfx_buffer_print_loop() {

   console.log('size:', _gfx_buffer.size, 'boundary:', _gfx_buffer.boundary, 'count:', _gfx_buffer.active_count,);
   for (let i = 0; i <= _gfx_buffer.boundary; i++) {
      
      if (_gfx_buffer.buffer[i]) {

         console.log('vb', i, );
         for (let j = 0; j <= _gfx_buffer.buffer[i].boundary; j++) {
            
            const mesh = _mesh_buffer.buffer[_gfx_buffer.buffer[i].buffer[j]];
            console.log(j,
               ' mbidx:', mesh.mesh_bufferidx,
               'start:', mesh.gfx.vb.start,
            );
         }
      }
      else console.log(i, 'NULL')
   }
}



// Print the widget root buffer (1)
export function Widgetroot_buffer_print_w1() {
   for (let i = 0; i <= _widget_root_buffer.boundary; i++) {

      const root_mesh = Mesh_buffer_get_mesh_byidx(_widget_root_buffer.buffer[i].buffer[0]); // 0-th element in each widget root buffer is the root mesh

      console.log('root:', root_mesh.GetName(),
         'size:', _widget_root_buffer.buffer[i].size,
         'boun:', _widget_root_buffer.buffer[i].boundary,
         'coun:', _widget_root_buffer.buffer[i].active_count,
      );

      for (let j = 0; j <= _widget_root_buffer.buffer[i].boundary; j++) {


         if (_widget_root_buffer.buffer[i].buffer[j] !== INT_NULL) {
            const mesh = _mesh_buffer.buffer[_widget_root_buffer.buffer[i].buffer[j]];

            if (!mesh.gfx) {
               console.warn('   ', j,
                  'ridx:', _widget_root_buffer.buffer[i].buffer[j],
                  'gfxidx', mesh.gfx_bufferidx,
                  'msbidx', mesh.mesh_bufferidx,
                  'state', mesh.state.mask,
                  'GFX NOT CREATED', 'isActive', mesh.state.mask & MESH_STATE.ACTIVE, mesh.GetName());
            }
            else {
               console.log('   ', j,
                  'ridx:', _widget_root_buffer.buffer[i].buffer[j],
                  'gfxidx', mesh.gfx_bufferidx,
                  'msbidx', mesh.mesh_bufferidx,
                  'gfx', mesh.gfx.prog.idx, mesh.gfx.vb.idx, 'isActive', mesh.state.mask & MESH_STATE.ACTIVE,
                  'state', mesh.state.mask,
                  'start', mesh.gfx.vb.start, mesh.GetName());
            }
         }
      }
   }
}



// Print the widget root buffer (2)
export function Widgetroot_buffer_print_w6() {
   for (let i = 0; i <= _widget_root_buffer.boundary; i++) {

      const root_mesh = Mesh_buffer_get_mesh_byidx(_widget_root_buffer.buffer[i].buffer[0]); // 0-th element in each widget root buffer is the root mesh

      console.log('mesh_bufferidx:', _widget_root_buffer.buffer[i].buffer[0], 'name:', root_mesh.GetName(),
         'size:', _widget_root_buffer.buffer[i].size,
         'boun:', _widget_root_buffer.buffer[i].boundary,
         'coun:', _widget_root_buffer.buffer[i].active_count,
      );
   }
}



// Print the widget root gfx buffer (1)
export function Widgetroot_gfx_print_loop_w2() {

   for (let i = 0; i <= _widget_root_buffer.boundary; i++) {

      console.log('root idx:', _widget_root_buffer.buffer[i].buffer[0]);

      const widget = _widget_root_gfx.buffer[i];
      for (let j = 0; j <= widget.boundary; j += GFX.SIZE) {
         console.log(
            ' progidx:', widget.buffer[j + GFX.PROG_IDX],
            ' vbidx:', widget.buffer[j + GFX.VB_IDX],
         );
      }
   }
}



// Print the widget root gfx buffer (2)
export function Widgetroot_gfx_print_w3() {
   console.log('_widget_root_gfx:', _widget_root_gfx);
}



// Print the widget batch buffer
export function Widget_root_batch_print_w4() {

   const len = _root_batch_buffer.length;
   for (let i = 0; i < len; i++) {

      if (!_root_batch_buffer[i]) { console.log('EMPTY'); return };

      const mesh = Mesh_buffer_get_mesh_byidx(_root_batch_buffer[i].meshidx)
      console.log('mesh_bufferidx:', _root_batch_buffer[i].meshidx, 'root_bufferidx:', _root_batch_buffer[i].rootidx, 'mesh name', mesh.GetName())
      for (let j = 0; j < _root_batch_buffer[i].vb.length; j++) {
         console.log('  vb:', j,
            'num_faces:', _root_batch_buffer[i].vb[j].num_faces,
            'meshidx:', _root_batch_buffer[i].vb[j].meshidx,
         );
      }
   }
}



// Print the widget groups buffer
export function Widget_group_buffer_print_w5() {

   console.log('Wole Group Buffer:', _widget_groups_buffer)
   for (let i = 0; i <= _widget_groups_buffer.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(_widget_groups_buffer.buffer[i].meshidx)
      console.log('mesh_bufferidx:', _widget_groups_buffer.buffer[i].meshidx, ' mesh name:', mesh.GetName())
      for (let j = 0; j < _widget_groups_buffer.buffer[i].group_data.length; j++) {
         console.log('  vb:', j,
            'vb_start:', _widget_groups_buffer.buffer[i].group_data[j].start,
            'ib_start:', _widget_groups_buffer.buffer[i].group_data[j].ib_start,
            'first mesh:', _widget_groups_buffer.buffer[i].group_data[j].meshidx,
            'num_faces:', _widget_groups_buffer.buffer[i].group_data[j].num_faces,
            'gfx:', _widget_groups_buffer.buffer[i].group_data[j].gfx_idxs,
         );
      }
   }
}
