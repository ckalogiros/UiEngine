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


/**
 * DECISSION:
 * 1. On widget root element remove: Should we short the buffers?????
 */




/*******************************************************************************************************************************************************************************/
// Mesh buffer: Stores all meshes of the application
/*******************************************************************************************************************************************************************************/


/**
 * Widget root: [Widgets]
 */

const _mesh_buffer = new M_Buffer();
_mesh_buffer.Init(16);


export function Mesh_buffer_get() { return _mesh_buffer; }



export function Mesh_buffer_get_mesh_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx]; }



export function Mesh_buffer_remove_mesh_byidx(mesh_bufferidx) {

   const mesh = _mesh_buffer.buffer[mesh_bufferidx];
   if (!mesh || mesh === _) alert('Mesh is NULL.\n@ Mesh_buffer_remove_mesh_byidx().');

   if (Widget_root_is_widget_root(mesh.root_bufferidx, mesh_bufferidx)) {

      Widget_root_remove_root_byidx(mesh.root_bufferidx);
      mesh.root_bufferidx = INT_NULL;
   }
   else {

      Widget_root_remove_element_byidx(mesh.root_bufferidx, mesh.batch_buffer_vbidx, mesh_bufferidx, mesh.geom.num_faces);


      /*********************************************************************************************************************************/
      // Group Remove num_faces
      if (mesh.group_bufferidxs[0] !== INT_NULL && mesh.group_bufferidxs[1] !== INT_NULL) { // TODO: I think checking only the [1] is enough

         if (mesh.state.mask & MESH_STATE.ACTIVE) { // Decrement num_faces only if ACTIVE, else the num_faces for the mesh aren't added.

            const is_group_data_empty = Widget_group_update_decrement(mesh.group_bufferidxs, mesh.geom.num_faces);

            // When we destroy a mesh and remove from batch, if batch has 0 num_faces, disconnect the destroyed mesh's idx from the batch.
            if (is_group_data_empty) {

               // Widget_group_destroy_group(mesh.group_bufferidxs);
               Widget_group_destroy_group_data(mesh.group_bufferidxs)
               console.log('EMPTY root_group:', _widget_groups_buffer.buffer[mesh.group_bufferidxs[0]]);
            }
         }

      }
   }


   // console.warn('Removing mesh from mesh_buffer:', mesh_bufferidx, mesh);
   _mesh_buffer.RemoveByIdx(mesh_bufferidx);
}

/** // NOTE:
 * The insertion of meshes to the _mesh_buffer 
 * happens at CreateWidgets.js, directly accessing the _mesh_buffer buffer
 */

























/*******************************************************************************************************************************************************************************/
// Widget root buffer: Stores all root meshes of a scene
/*******************************************************************************************************************************************************************************/


/**
 * Widget root: [Int16]
 */

const _widget_root_buffer = new M_Buffer();
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

         // When we destroy a mesh and remove from batch, if batch has 0 num_faces, disconnect the destroyed mesh's idx from the batch.
         if (is_batch_vb_empty) {

            _root_batch_buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx = INT_NULL;
            console.log('EMPTY root_batch:', _root_batch_buffer[root_bufferidx])
         }


         /*********************************************************************************************************************************/
         // Batch Remove
         _widget_root_buffer.buffer[root_bufferidx].RemoveByIdx(elem_found);
         // console.log(_widget_root_buffer.buffer[root_bufferidx])

         // console.warn('rem', root_bufferidx, ' element idx:', elem_found, 'mesh_bufferidx', mesh_bufferidx);


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
const _root_batch_buffer = [];



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
   // _root_batch_buffer[rootidx] = root_batch_vb;
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



export function Widget_root_batch_assign_and_accum_to_vb(root_bufferidx, mesh_bufferidx, groupidx, progidx, vbidx, num_faces) {

   if (root_bufferidx === INT_NULL) return;

   const gfxidxs = Widget_root_gfx_get_structured(root_bufferidx);
   const len = gfxidxs.length;

   let stored = false;
   for (let i = 0; i < len; i++) {

      if (gfxidxs[i].groupidx === groupidx && gfxidxs[i].progidx === progidx && gfxidxs[i].vbidx === vbidx) {

         if(_root_batch_buffer[root_bufferidx].vb[i].meshidx === mesh_bufferidx && _root_batch_buffer[root_bufferidx].vb[i].num_faces > 0){

         }
         else{

            if(_root_batch_buffer[root_bufferidx].vb[i].meshidx === INT_NULL){
               _root_batch_buffer[root_bufferidx].vb[i].meshidx = mesh_bufferidx;
            }
   
            _root_batch_buffer[root_bufferidx].vb[i].num_faces += num_faces;
            const mesh = _mesh_buffer.buffer[mesh_bufferidx];
   
            // if(_root_batch_buffer[root_bufferidx].vb[i].meshidx === mesh.mesh_bufferidx)
   
            mesh.batch_buffer_vbidx = i;
         }

         stored = true;
      }

   }
   

   // Case the GFX buffers(WebGL) are already created, and in the 'Gfx_generate_context()' 
   // there is no call to this 'Widget_root_gfx_add()', // we must create the vb data.
   if (!stored)
      Widget_root_gfx_add(root_bufferidx, mesh_bufferidx, groupidx, progidx, vbidx);

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

const _widget_root_gfx = new M_Buffer();
_widget_root_gfx.Init(1);



// Returns an array [groupidx:INT, progidx:INT, vbidx:INT, ...]
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

   for (let i = 0; i <= gfx_idxs.boundary; i += 3) {

      const s = {
         groupidx: gfx_idxs.buffer[i + GFX.GROUP_IDX],
         progidx: gfx_idxs.buffer[i + GFX.PROG_IDX],
         vbidx: gfx_idxs.buffer[i + GFX.VB_IDX],
      };
      structured.push(s);
   }
   return structured;
}



function Widget_root_gfx_create(root_bufferidx) {

   const idx = _widget_root_gfx.Add(new Int8Buffer(6)); // 3 elements is enough for 1 gfx indexes (0:groupidx, 1:progidx, 2:vbidx) 

   if (root_bufferidx !== idx) alert('Widget root gfx buffer not the same with the Widget root buffer');

   // _widget_root_gfx.buffer[idx].Init(INT_NULL);
}



export function Widget_root_gfx_add(root_bufferidx, mesh_bufferidx, groupidx, progidx, vbidx) {

   if (root_bufferidx === INT_NULL) return; // Case there is no widget root creation.

   _widget_root_gfx.buffer[root_bufferidx].Add(groupidx);
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
 *       gfx_idxs: [groupidx, progidx, vbidx],
 *   }
 */

const _widget_groups_buffer = new M_Buffer();
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
// export function Widget_group_create(mesh_bufferidx, groupidx, progidx, vbidx, start, num_faces) {
export function Widget_group_create(mesh_bufferidx, gfx) {

   const groupidx = gfx.prog.groupidx, progidx = gfx.prog.idx, vbidx = gfx.vb.idx, vb_start = gfx.vb.start, ib_start = gfx.ib.start;

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
      gfx_idxs: [groupidx, progidx, vbidx],
   }

   const vb_data_idx = _widget_groups_buffer.buffer[group_bufferidx].group_data.push(data);
   const group_buffer_vbidx = vb_data_idx - 1;


   // The group's root mesh back in caller site, must store the group's index for refferencing to the group.
   return [group_bufferidx, group_buffer_vbidx];
}



// Case mesh is added on run time, create or use group_data
export function Widget_group_add(group_bufferidx, gfx, num_faces = _, mesh_bufferidx) {

   /**DEBUG */ if (num_faces === _) console.error('Forget to pass param: num_faces. @ Widget_group_add()');


   const groupidx = gfx.prog.groupidx, progidx = gfx.prog.idx, vbidx = gfx.vb.idx, start = gfx.vb.start, ib_start = gfx.ib.start;
   const group = _widget_groups_buffer.buffer[group_bufferidx];
   // console.log('ADDING MESH TO GROUP:', group_bufferidx, 'gfx',groupidx, progidx, vbidx, 'faces', num_faces)
   // console.log('ADDING MESH TO GROUP: mesh_bufferidx', id)

   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      if (group.group_data[i].gfx_idxs[GFX.GROUP_IDX] === groupidx && group.group_data[i].gfx_idxs[GFX.PROG_IDX] === progidx && group.group_data[i].gfx_idxs[GFX.VB_IDX] === vbidx) {

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
      gfx_idxs: [groupidx, progidx, vbidx],
   });


   // The group's root mesh back in caller site, must store the group's index for refferencing to the group.
   return vb_data_idx - 1;
}



// Case mesh is added on run time, create or use group_data
export function Widget_group_find_but_not_insert(group_bufferidx, gfx) {

   const groupidx = gfx.prog.groupidx, progidx = gfx.prog.idx, vbidx = gfx.vb.idx, start = gfx.vb.start;
   const group = _widget_groups_buffer.buffer[group_bufferidx];

   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      if (group.group_data[i].gfx_idxs[GFX.GROUP_IDX] === groupidx && group.group_data[i].gfx_idxs[GFX.PROG_IDX] === progidx && group.group_data[i].gfx_idxs[GFX.VB_IDX] === vbidx) {

         // console.log('ADDING MESH TO GROUP:', group_bufferidx, i,  'gfx',groupidx, progidx, vbidx)
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



function Widget_group_destroy_group(group_bufferidxs) {

   _widget_groups_buffer.buffer[group_bufferidxs[0]].group_data[group_bufferidxs[1]].meshidx = INT_NULL;
   // TODO: Do we need to destroy all fields??? {start, ib_start, num_faces, gfx_idxs:[int,int,int]}
   // _widget_groups_buffer.buffer[group_bufferidxs[0]].group_data[group_bufferidxs[1]].start = INT_NULL;


   // Check all group_data vbs, if all have num_faces=0, remove the whole group from the  _widget_groups_buffer, else destroy index refferences to meshes

   // const group = _widget_groups_buffer.buffer[group_bufferidxs[0]].group_data;
   // let empty_group = true;
   // const len = group.length;
   // for (let i = 0; i < len; i++) {

   //    if (group[i].num_faces !== 0) {
   //       empty_group = false;
   //       break;
   //    }
   // }

   // if (empty_group) {
   //    Widget_group_remove_byidx(group_bufferidxs[0])
   // }
}



function Widget_group_destroy_group_data(group_bufferidxs) {
   
   const group = _widget_groups_buffer.buffer[group_bufferidxs[0]];

   group.group_data.splice(group_bufferidxs[1], 1);


}



// Updates the start index of each vertex buffer. In case that the start has changed from the group's creation.
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

      const groupidx = group.group_data[i].gfx_idxs[GFX.GROUP_IDX];
      const progidx = group.group_data[i].gfx_idxs[GFX.PROG_IDX];
      const vbidx = group.group_data[i].gfx_idxs[GFX.VB_IDX];

      if (groupidx === INT_NULL || progidx === INT_NULL || vbidx === INT_NULL)
         alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')

      // const start = root_dp.gfx.vb.start;
      const start = group.group_data[i].start;
      const num_faces = group.group_data[i].num_faces;
      // console.log('RESET:' , groupidx, progidx, vbidx, 'num faces', 'start', group.group_data[i].start, 'num_faces', group.group_data[i].num_faces)

      const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK
      const attribs_per_vertex = Program_get_shader_attribute_attribs_per_vertex(groupidx, progidx);

      Gl_remove_geometry_params(groupidx, progidx, vbidx, num_faces, start, attribs_per_vertex, vertices_per_rect);

      // console.log('RESET GFX:', rootgfx.buffer[i+GFX.GROUP_IDX], rootgfx.buffer[i+GFX.PROG_IDX], rootgfx.buffer[i+GFX.VB_IDX])
   }
}


/** Reset the vgfx buffers from an index till the end. Fast, it does not remove from gfx buffers. Works only if there is no other group for that gfx buffers. */
export function Widget_group_reset_from_group_to_vb_end(root_dp) {

   const group = Widget_group_get(root_dp.group_bufferidxs[0]);
   const len = group.group_data.length;
   for (let i = 0; i < len; i++) {

      const groupidx = group.group_data[i].gfx_idxs[GFX.GROUP_IDX];
      const progidx = group.group_data[i].gfx_idxs[GFX.PROG_IDX];
      const vbidx = group.group_data[i].gfx_idxs[GFX.VB_IDX];

      if (groupidx === INT_NULL || progidx === INT_NULL || vbidx === INT_NULL)
         alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')


      const vb_start = group.group_data[i].start; // We want the start of the root mesh of the group, not the start of the root widget
      Vertexbuffer_reset_to_index(groupidx, progidx, vbidx, vb_start);

      const ib_start = group.group_data[i].ib_start; // We want the start of the root mesh of the group, not the start of the root widget
      Index_buffer_reset_to_index(vbidx, ib_start);

   }
}



/** Run ".Rerender()" on the root mesh of this widget_root_buffer */
export function Widget_group_rerender(group_bufferidx) {

   const rootidx = _widget_groups_buffer.buffer[group_bufferidx].meshidx;
   const mesh = _mesh_buffer.buffer[rootidx];
   mesh.Rerender();
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
   for (let i = 0; i <= rootgfx.boundary; i += 3) {

      if (rootgfx.buffer[i + GFX.GROUP_IDX] === INT_NULL || rootgfx.buffer[i + GFX.PROG_IDX] === INT_NULL || rootgfx.buffer[i + GFX.VB_IDX] === INT_NULL)
         alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')

      // Add to vertexbuffer
      Vertexbuffer_reset_to_index(rootgfx.buffer[i + GFX.GROUP_IDX], rootgfx.buffer[i + GFX.PROG_IDX], rootgfx.buffer[i + GFX.VB_IDX], 0);
      Index_buffer_reset_to_index(rootgfx.buffer[i + GFX.VB_IDX], 0);
   }
}



















/****************************************************************************************************************************************************/
// DEBUG Info - Create text for render
/****************************************************************************************************************************************************/


export function Widget_root_create_text_info(){

	const col_menu = GREY[3], col_dp = GREY[1];

	const s = Create_widget_section(_, SECTION.VERTICAL, [6, 6], [400,400,0], [0, 0], TRANSPARENCY(BLUEL[9], .3), 'Wigdet Root Buffers Info');

	const destroy = Create_widget_button(_, 'Destroy', _, _, _, TRANSPARENCY(GREEN[7], .3), _, _, _, _, _);
	// destroy.Bind(TEMP, _, s);
	s.AddItem(destroy);

	// s.Calc()

	const margin = [4,4];
	const style = [0, 3, 1];;
	const gr = _widget_groups_buffer;

      const grw = Create_widget_dropdown(_, 'Widget Groups', [100, 100, 0], col_dp, col_menu, _, _, _, _, _, margin);
      grw.CreateClickEvent();
      Dropdown_roots_set_root(grw, grw)
      s.AddItem(grw)

      const group_info = Create_widget_text(_, `count:${gr.active_count} size:${gr.size}`);
      grw.AddToMenu(group_info);

	for(let i=0; i<=gr.boundary; i++){
      
      
      const group = gr.buffer[i];

      
      const groupw = Create_widget_dropdown(_, 'Group', [100, 100, 0], col_dp, col_menu, _, [2,2], _, _, style, margin);
      groupw.CreateClickEvent();
      grw.AddToMenu(groupw)
      
      const group_info = Create_widget_text(_, `count:${group.active_count} size:${group.size}`);
      groupw.AddToMenu(group_info);
      
      const len = group.group_data.length;
      for(let i2=0; i2<len; i2++){
         
         const group_data = group.group_data[i2];

         const group_dataw = Create_widget_dropdown(_, 'group data', [100, 100, 0], col_dp, col_menu, _, [2,2], _, _, style, margin);
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
export function Meshbuffer_print() {
   console.log('_mesh_buffer:', _mesh_buffer);
}



export function Meshbuffer_print_loop() {
   
   console.log('size:', _mesh_buffer.size, 'boundary:', _mesh_buffer.boundary, 'count:', _mesh_buffer.active_count, );
   for (let i = 0; i <= _mesh_buffer.boundary; i++) {

      if (_mesh_buffer.buffer[i]) {

         console.log('i:', i,
            'id:', _mesh_buffer.buffer[i].id,
            'idx:', _mesh_buffer.buffer[i].idx,
            'mbidx:', _mesh_buffer.buffer[i].mesh_bufferidx,
            'rbidx:', _mesh_buffer.buffer[i].root_bufferidx,
            'batchidx:', _mesh_buffer.buffer[i].batch_buffer_vbidx,
            'name:', _mesh_buffer.buffer[i].GetName(),
         );
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
               console.warn('   j:', j, 'idx:', _widget_root_buffer.buffer[i].buffer[j],
                  'msbidx', mesh.mesh_bufferidx,
                  'state', mesh.state.mask,
                  'GFX NOT CREATED', 'isActive', mesh.state.mask & MESH_STATE.ACTIVE, mesh.GetName());
            }
            else {
               console.log('   j:', j, 'idx:', _widget_root_buffer.buffer[i].buffer[j],
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

      const mesh = Mesh_buffer_get_mesh_byidx(_widget_root_buffer.buffer[i].buffer[0]); // 0-th element in each widget root buffer is the root mesh
      console.log('root idx:', _widget_root_buffer.buffer[i].buffer[0]);

      const widget = _widget_root_gfx.buffer[i];
      for (let j = 0; j <= widget.boundary; j += 3) {
         console.log(
            ' groupidx:', widget.buffer[j + GFX.GROUP_IDX],
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

      const mesh = Mesh_buffer_get_mesh_byidx(_root_batch_buffer[i].rootidx)
      console.log('mesh_bufferidx:', _root_batch_buffer[i].rootidx, 'root_bufferidx:', _root_batch_buffer[i].rootidx, 'mesh name', mesh.GetName())
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
