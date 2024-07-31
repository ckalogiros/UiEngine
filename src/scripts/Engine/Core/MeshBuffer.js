"use strict";

import { Vertex_buffer_reset } from "../../Graphics/Buffers/VertexBuffers.js";
import { Free_int8_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "./Buffers.js";
import { BLUEL, GREEN, GREY } from "../Drawables/Material/Base/Colors.js";
import { Create_widget_button, Create_widget_dropdown, Create_widget_section, Create_widget_text } from "./CreateWidget.js";
import { Dropdown_roots_set_root } from "../Drawables/Widgets/Widget_Dropdown.js";
import { Str_buffer_mesh_names_remove_by_idx } from "./StringBuffer.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Renderqueue_set_active, Renderqueue_set_flags, Renderqueue_set_priority_by_vb } from "../Renderers/Renderer/RenderQueue.js";
import { REL_POS, Relative_pos_comp_move_right_buffer } from "../Drawables/Operations/RelativePosComponent.js";
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_get_vb_root_wpos } from "./MeshUniformsBuffer.js";
import { Index_buffer_reset } from "../../Graphics/Buffers/IndexBuffers.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Drawables/Operations/Recursions.js";







const NOTIFICATIONS_ON = true;


const _mesh_buffer = New_generic_buffer(_, 'Mesh Buffer');
export function Mesh_buffer_reset() { _mesh_buffer.ResetFull(); }
const _mesh_per_vertex_buffer = New_generic_buffer(_, 'Mesh per Vertex buffer');
export function Mesh_per_vb_reset() { _mesh_per_vertex_buffer.ResetFull(); }


const _widget_root_buffer = New_generic_buffer(_, 'Widget root');
export function Root_group_buffer_reset() { _widget_root_buffer.ResetFull(); }
const _root_batch_buffer = New_generic_buffer(_, 'Root batch');
export function Root_group_batch_buffer_reset() { _root_batch_buffer.ResetFull(); }
const _widget_root_gfx = New_generic_buffer(_, 'Root gfx');
export function Root_group_gfx_buffer_reset() { _widget_root_gfx.ResetFull(); }




/*******************************************************************************************************************************************************************************/
// Mesh buffer: Stores all meshes of the application
/*******************************************************************************************************************************************************************************/

_mesh_buffer.Init(16);


export function Mesh_buffer_get() { return _mesh_buffer; }
export function Mesh_buffer_get_count() { return _mesh_buffer.active_count; }
export function Mesh_buffer_get_size() { return _mesh_buffer.size; }


export function Mesh_buffer_get_mesh_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx]; }
export function Mesh_buffer_get_mesh_gfx_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].gfx; }
export function Mesh_buffer_get_mesh_name_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].GetName(); }


export function Mesh_buffer_get_mesh_pos(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].geom.pos; }
export function Mesh_buffer_get_mesh_dim(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].geom.dim; }



export function Mesh_buffer_get_mesh_bounding_box(mesh_bufferidx) {

   const hover_margin = _mesh_buffer.buffer[mesh_bufferidx].StylesGetHoverMargin();
   const pos = _mesh_buffer.buffer[mesh_bufferidx].GetPosXY();
   temp_no_allocation_buffer[0][0] = pos[0] - hover_margin[0];
   temp_no_allocation_buffer[0][1] = pos[0] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[0] * 2 * _mesh_buffer.buffer[mesh_bufferidx].geom.num_faces + hover_margin[0];
   temp_no_allocation_buffer[1][0] = pos[1] - hover_margin[1];
   // TODO: For meshes with more than 4 vertices we must multiply the dimention with the number of faces. So we need to know which coordinate the mesh has the extra vertices towards to, and then mult that coord with the num faces. Currently the only coord to expand is the x axis(for colorpicker HUE bar) 
   temp_no_allocation_buffer[1][1] = pos[1] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[1] * 2 + hover_margin[1];
   // temp_no_allocation_buffer[1][1] = pos[1] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[1] * 2 * _mesh_buffer.buffer[mesh_bufferidx].geom.num_faces + hover_margin[1];

   return temp_no_allocation_buffer;
}


const temp_no_allocation_buffer = []
temp_no_allocation_buffer[0] = [0, 0]
temp_no_allocation_buffer[1] = [0, 0]
export function Mesh_buffer_get_mesh_bounding_box_with_hover_margin(mesh_bufferidx) {
   if (_mesh_buffer.buffer[mesh_bufferidx] === null || _mesh_buffer.buffer[mesh_bufferidx] === _) {
      console.log('Meshbuffer: idx', mesh_bufferidx, _mesh_buffer.buffer);
      return false;
   }

   const pos = _mesh_buffer.buffer[mesh_bufferidx].GetPosXY();
   temp_no_allocation_buffer[0][0] = pos[0];
   temp_no_allocation_buffer[0][1] = pos[0] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[0] * 2 + _mesh_buffer.buffer[mesh_bufferidx].hover_margin[0];
   temp_no_allocation_buffer[1][0] = pos[1];
   temp_no_allocation_buffer[1][1] = pos[1] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[1] * 2 + _mesh_buffer.buffer[mesh_bufferidx].hover_margin[1];

   return temp_no_allocation_buffer;
}


export function Mesh_buffer_remove_mesh_byidx(mesh_bufferidx, root_bufferidx) {

   const mesh = _mesh_buffer.buffer[mesh_bufferidx];
   if (!mesh || mesh === _) {
      console.error('Mesh is NULL.\n@ Mesh_buffer_remove_mesh_byidx(). mesh_bufferidx:',
         mesh_bufferidx, _mesh_buffer,
         'elem', _mesh_buffer.buffer[mesh_bufferidx],
         'root_bufferidx', root_bufferidx,
         '_widget_root_buffer', _widget_root_buffer,
      );

      return;
      alert('Mesh is NULL.\n@ Mesh_buffer_remove_mesh_byidx()\nSEE console error');
   }


   // TODO: Remove the whole root is WRONG, we have to destroy all meshes, which we do not do
   // If the mesh is the root, destroy the whole root buffer, gfx_buffer, batch buffer.
   if (Widget_root_is_widget_root(mesh.root_bufferidx, mesh_bufferidx)) {

      Widget_root_remove_root_byidx(mesh.root_bufferidx);
      mesh.root_bufferidx = INT_NULL;
   }
   else { // ...remove element, BUT the removed mesh may be root of a batch-vb or group-groupdata-vb

      // Widget_root_remove_element_byidx(mesh.root_bufferidx, mesh_bufferidx);
      // if (mesh.batch_buffer_vbidx !== INT_NULL)
         Widget_root_remove_element_byidx(mesh.root_bufferidx, mesh.batch_buffer_vbidx, mesh_bufferidx, mesh.geom.num_faces);

   }

   if (mesh.nameidx !== INT_NULL) Str_buffer_mesh_names_remove_by_idx(mesh.nameidx);
   _mesh_buffer.RemoveByIdx(mesh_bufferidx);
}





/****************************************************/
// Batch Destroy

const _batch_destroy_storage = New_int16_buffer(_, 'WidgetRootBatch-destroy_storage-NOT_USED PROBABLY');




export function Mesh_buffer_batch_destroy_store(idx) {
   // TODOD: DEBUG the idx if exists and in boundaries
   _batch_destroy_storage.Add(idx);
   console.log(idx)
}




export function Mesh_buffer_batch_destroy_run() {
   // TODOD: DEBUG the idx if exists and in boundaries

   for (let i = 0; i <= _batch_destroy_storage.boundary; i++) {

      const idx = _batch_destroy_storage.buffer[i];

      Mesh_buffer_remove_mesh_byidx(idx);

   }

   _batch_destroy_storage.Reset();
}
/** // NOTE:
 * The insertion of meshes to the _mesh_buffer 
 * happens at CreateWidgets.js, directly accessing the _mesh_buffer buffer
 */








































/*******************************************************************************************************************************************************************************/
// Gfx buffer: All mesh indexes by vertex buffer
/*******************************************************************************************************************************************************************************/


const GFX_VIEW_MESH_DEFAULT_COUNT = 16;
_mesh_per_vertex_buffer.Init(4); // For 4 vertex buffers


export function Mesh_per_vb_get() { return _mesh_per_vertex_buffer; }
export function Mesh_per_vb_get_count() { return _mesh_per_vertex_buffer.active_count; }
export function Mesh_per_vb_get_size() { return _mesh_per_vertex_buffer.size; }



export function Mesh_per_vb_get_vb_byidx(vb_groupidx) { return _mesh_per_vertex_buffer.buffer[vb_groupidx]; }



export function Mesh_per_vb_get_mesh(vb_groupidx, per_vb_bufferidx) { return _mesh_per_vertex_buffer.buffer[vb_groupidx][per_vb_bufferidx]; }



export function Mesh_per_vb_create_vb(vb_groupidx) {

   _mesh_per_vertex_buffer.AddAtIndex(vb_groupidx, New_int16_buffer(GFX_VIEW_MESH_DEFAULT_COUNT, 'MeshPerVB buffer'));

   if (NOTIFICATIONS_ON)
      Notifications_send(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, vb_groupidx);
}



export function Mesh_per_vb_store_mesh(vb_groupidx, mesh_bufferidx) {
   return _mesh_per_vertex_buffer.buffer[vb_groupidx].Add(mesh_bufferidx);
}



export function Mesh_per_vb_reset_buffer(vb_groupidx) {

   return _mesh_per_vertex_buffer.buffer[vb_groupidx].Reset();
}



export function Mesh_per_vb_remove_mesh(vb_groupidx, per_vb_bufferidx) {

   if (per_vb_bufferidx === INT_NULL) return; // Avoid created but not active meshes(like deactivated)

   // Update the per_vb_bufferidx of the swaped mesh that repalaced the removed mesh
   const mesh = _mesh_buffer.buffer[_mesh_per_vertex_buffer.buffer[vb_groupidx].buffer[per_vb_bufferidx]];

   const meshidx = mesh ? mesh.mesh_bufferidx : -1
   _mesh_per_vertex_buffer.buffer[vb_groupidx].RemoveByIdxSortedVersion(per_vb_bufferidx, meshidx, 'Mesh_per_vb_remove_mesh');


   if (mesh && (mesh.state.mask & MESH_STATE.ACTIVE)) { // Case the removed mesh is last in the _mesh_per_vertex_buffer, then there is no replacement and no need for setting the 'mesh.per_vb_bufferidx'

      mesh.per_vb_bufferidx = per_vb_bufferidx;
   }


   if(NOTIFICATIONS_ON) 
      Notifications_send(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.DESTROY, vb_groupidx);

}



// export function Mesh_per_vb_remove_all_from_index(vbidx, per_vb_bufferidx) {
export function Mesh_per_vb_remove_all_from_index(vb_groupidx, meshidx) {

   const mesh = _mesh_buffer.buffer[meshidx];

   if (mesh.per_vb_bufferidx === INT_NULL) return; // Avoid created but not active meshes(like deactivated)

   for (let i = _mesh_per_vertex_buffer.buffer[vb_groupidx].boundary; i >= mesh.per_vb_bufferidx; i--) {

      _mesh_per_vertex_buffer.buffer[vb_groupidx].RemoveByIdxSortedVersion(mesh.per_vb_bufferidx, meshidx, 'Mesh_per_vb_remove_all_from_index');
   }
}



export function Mesh_per_vb_update_mesh_gfx_start(vb_groupidx, start, num_faces) {


   // EFFICIENCY: We should loop through all mesh idxs in gfx_buffer only if there is an accumulated value to be updated to
   for (let j = 0; j <= _mesh_per_vertex_buffer.buffer[vb_groupidx].boundary; j++) {

      const mesh = _mesh_buffer.buffer[_mesh_per_vertex_buffer.buffer[vb_groupidx].buffer[j]];
      if (mesh && mesh.gfx.vb.start >= start) {

         mesh.gfx.vb.start -= num_faces * mesh.gfx.attribsPerVertex * mesh.gfx.vertsPerRect;
      }
   }
}


/***********************************************************************************************************************/
// Debug Info Getters
export function Mesh_per_vb_get_mesh_count(vb_groupidx) { return _mesh_per_vertex_buffer.buffer[vb_groupidx].active_count; }



















/*******************************************************************************************************************************************************************************/
// Widget root buffer: Stores all root meshes of a scene
/*******************************************************************************************************************************************************************************/


/**
 * Widget root: [Int16]
 */


_widget_root_buffer.Init(8);


export function Widget_root_is_widget_root(root_bufferidx, mesh_bufferidx) {

   // The widget root buffer store the root mesh at index 0, which is an index to the _mesh_buffer.
   // So if the index 'mesh_bufferidx' is the same as the 0-th element of the widget_buffer[root_bufferidx],
   // then this widget_root element is a root mesh
   if (root_bufferidx !== INT_NULL && _widget_root_buffer.buffer[root_bufferidx].buffer[0] === mesh_bufferidx) // If the mesh 
      return true;
   return false;
}



export function Widget_root_buffer_get() { return _widget_root_buffer; }



export function Widget_root_buffer_get_root_pos(idx) { return _mesh_buffer.buffer[_widget_root_buffer.buffer[idx].buffer[0]].geom.pos; }



export function Widget_root_buffer_get_root_unif_wpos(idx) {
   const root_mesh = _mesh_buffer.buffer[_widget_root_buffer.buffer[idx].buffer[0]];
   if (root_mesh.root_posidx === INT_NULL) alert('No root was constructed yet\nWidget_root_buffer_get_root_unif_wpos()')
   const wpos = Mesh_unif_get_vb_root_wpos(root_mesh.root_posidx);
   return wpos;
}



export function Widget_root_buffer_get_byidx(idx) { return _widget_root_buffer.buffer[idx]; }



export function Widget_root_buffer_get_count() { return _widget_root_buffer.active_count; }



export function Widget_root_buffer_get_root_meshidx(idx) { return _widget_root_buffer.buffer[idx].buffer[0]; }



export function Widget_root_buffer_get_mesh_by_rootidx(idx) {

   const mesh = Mesh_buffer_get_mesh_byidx(_widget_root_buffer.buffer[idx].buffer[0]);
   return mesh;
}



export function Widget_root_create_root(mesh_bufferidx) {

   const root_idx = _widget_root_buffer.Add(New_int16_buffer(6, 'WidgetRoot buffer'));

   _widget_root_buffer.buffer[root_idx].Add(mesh_bufferidx);

   Widget_root_gfx_create(root_idx);

   Widget_root_batch_create_root(root_idx, mesh_bufferidx);

   return root_idx;
}


// POTENTIAL_BUG!!! if the root is removed, the whole root buffer should be invalid and destroyed
function Widget_root_remove_root_byidx(root_bufferidx) {
   if (_widget_root_buffer.buffer[root_bufferidx] !== INT_NULL) {

      Widget_root_batch_remove_byidx(root_bufferidx);
      Widget_root_gfx_remove_byidx(root_bufferidx)
      // console.error('Removing widget root:', root_bufferidx, _widget_root_buffer.buffer[root_bufferidx]);
      _widget_root_buffer.RemoveByIdx(root_bufferidx);
   }
}



/** SAVE-DO NOT DELETE-remove widget_root with bach removal */
function Widget_root_remove_element_byidx(root_bufferidx, batch_buffer_vbidx, mesh_bufferidx, num_faces) {

   const HACK_INDEX = 0; // HACK: This is used only for none instanced geometries, wher the vb and the start index of a mesh is the 0th element.
   // TODO: To correct this, we must provide the vb responsible for the provided starts (of the attributes). 

   if (_widget_root_buffer.buffer[root_bufferidx] !== INT_NULL) {

      const elem_found = Widget_root_find_element_byidx(root_bufferidx, mesh_bufferidx);

      if (elem_found !== INT_NULL) {


         /*********************************************************************************************************************************/
         // Batch Remove num_faces

         // For widget_root, actove or inactive, the num_faces must be decrement, compare to widget_groups.
         // const is_batch_vb_empty = Widget_root_batch_update_decrement_accumulator(root_bufferidx, batch_buffer_vbidx, num_faces);
         // // If batch-vb has 0 num_faces, set the batch-vb-meshidx to null.
         // if (is_batch_vb_empty) _root_batch_buffer.buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx = INT_NULL;


         /**
          * Replace the meshidx of the batch-vb(which is the root mesh for the spesific batch-vb[]),
          * if it is the mesh to be removed, with any other available meshidx from the same batch-vb 
          */

         // If the removed mesh happens to be root of any of the batch-vbs, we MUST replace it with the FIRST, same SID, mesh_bufferidx.
         // else 

         if (_root_batch_buffer.buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx === mesh_bufferidx) {

            // Unfortunately we have no other option but to search the meshes through widget_root_buffer

            const len = _widget_root_buffer.buffer[root_bufferidx].boundary;
            let new_root_meshidx = INT_NULL;
            let min_start = 0xffff;
            for (let i = 0; i < len; i++) {
               const mesh = _mesh_buffer.buffer[_widget_root_buffer.buffer[root_bufferidx].buffer[i]]; // Get meshes through wigdet_root_buffer


               // if (mesh && mesh.mesh_bufferidx !== mesh_bufferidx &&
               if (mesh &&
                  mesh.batch_buffer_vbidx === batch_buffer_vbidx &&
                  mesh.gfx.vb.starts[HACK_INDEX] < min_start) {

                  min_start = mesh.gfx.vb.starts[HACK_INDEX];
                  new_root_meshidx = mesh.mesh_bufferidx;
               }

            }

            // _root_batch_buffer.buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx = new_root_meshidx;
         }


         /*********************************************************************************************************************************/
         // Batch Remove
         _widget_root_buffer.buffer[root_bufferidx].RemoveByIdxSortedVevbrsion(elem_found, root_bufferidx, 'Widget_root_remove_element_byidx');

      }
      else console.error('Widget root FAILED to remove element. root idx:', root_bufferidx, 'mesh_bufferidx', mesh_bufferidx, ' element idx:', elem_found,);

   }
}



function Widget_root_find_element_byidx(root_bufferidx, mesh_bufferidx) {

   const root = _widget_root_buffer.buffer[root_bufferidx];

   if(root_bufferidx===INT_NULL) return INT_NULL;

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





export function Widget_root_destroy_all_meshes(root_bufferidx, mesh_bufferidx) {
   //TODO: IMPLEMENT
   // Run for all meshes in root
   // 
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
   return _root_batch_buffer.buffer[root_bufferidx];
}



export function Widget_root_batch_get_all_roots_by_vertex_buffer(root_bufferidx) {

   let roots = [];
   const len = _root_batch_buffer.buffer[root_bufferidx].vb.length;

   for (let i = 0; i < len; i++) {
      roots[i] = _root_batch_buffer.buffer[root_bufferidx].vb[i].meshidx;
   }
   return roots;
}



export function Widget_root_batch_remove_byidx(root_bufferidx) {
   console.warn('widget root batch removing root batch by splice. IMPLEMENT correct: removing by .Removeidx()', _root_batch_buffer.buffer[root_bufferidx]);
   _root_batch_buffer.RemoveByIdx(root_bufferidx);
}



function Widget_root_batch_create_root(root_bufferidx, mesh_bufferidx) {

   const root_batch_vb = {
      rootidx: root_bufferidx,
      meshidx: mesh_bufferidx,
      vb: [], // To store the mesh_bufferidx of the first mesh of the batch, as well as the number of faces of all the meshes in one batch(1 face = 4 vertices)
   };

   const idx = _root_batch_buffer.Add(root_batch_vb);

   if (root_bufferidx !== idx) alert('Widget root batch buffer not the same with the Widget root buffer');
}



function Widget_root_batch_create_vb(root_bufferidx, mesh_bufferidx) {

   if (root_bufferidx === INT_NULL) return; // Case there is no widget root creation.

   const root_batch = _root_batch_buffer.buffer[root_bufferidx];
   const vb_dataidx = root_batch.vb.push({
      num_faces: 0,
      meshidx: mesh_bufferidx,
   });

   return vb_dataidx - 1;
}



export function Widget_root_batch_assign_and_accum_to_vb(root_bufferidx, mesh_bufferidx, progidx, vbidx, num_faces) {

   if (root_bufferidx === INT_NULL) return;

   const gfxidxs = Widget_root_gfx_get(root_bufferidx);

   let stored = false;
   for (let i = 0; i <=  gfxidxs.boundary; i++) {

      if (gfxidxs.buffer[i] === vbidx) {

         const mesh = _mesh_buffer.buffer[mesh_bufferidx];
         if (_root_batch_buffer.buffer[root_bufferidx].vb[i].meshidx === mesh_bufferidx && _root_batch_buffer.buffer[root_bufferidx].vb[i].num_faces > 0) {
            // Just assign the batch index to the mesh
            mesh.batch_buffer_vbidx = i;
         }
         else {

            // Assignt the mesh's idx 
            if (_root_batch_buffer.buffer[root_bufferidx].vb[i].meshidx === INT_NULL) {
               _root_batch_buffer.buffer[root_bufferidx].vb[i].meshidx = mesh_bufferidx;
            }

            _root_batch_buffer.buffer[root_bufferidx].vb[i].num_faces += num_faces;
            mesh.batch_buffer_vbidx = i;
         }

         stored = true; // The current vertex buffer index is found in the 'if' statement, so we do not have to add it to the 'Widget_root_gfx'.
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
// export function Widget_root_batch_reset_accumulator(root_bufferidx) {

//    const root_batch = _root_batch_buffer.buffer[root_bufferidx];

//    const len = root_batch.vb.length;
//    for (let i = 0; i < len; i++) {

//       // Get the first mesh, just to extract the num_faces
//       const mesh = Mesh_buffer_get_mesh_byidx(root_batch.vb[i].meshidx);
//       root_batch.vb[i].num_faces = mesh.geom.num_faces; // Leave the faces count for the first mesh of all vbs 
//    }

// }



// export function Widget_root_batch_update_increment_accumulator(root_bufferidx, batch_buffer_vbidx, num_faces) {

//    _root_batch_buffer.buffer[root_bufferidx].vb[batch_buffer_vbidx].num_faces += num_faces;
// }



// export function Widget_root_batch_update_decrement_accumulator(root_bufferidx, batch_buffer_vbidx, num_faces) {

//    if (root_bufferidx === INT_NULL)
//       alert('55555')
//    const batch_vb = _root_batch_buffer.buffer[root_bufferidx].vb[batch_buffer_vbidx];
//    if (batch_vb === _ || !batch_vb)
//       console.error('batch_vb NULL', 'root_bufferidx', root_bufferidx, 'batch_buffer_vbidx', batch_buffer_vbidx, '_root_batch_buffer', _root_batch_buffer)

//    batch_vb.num_faces -= num_faces;

//    if (batch_vb.num_faces < 0) {
//       console.error('Root Batch num_faces negative. root_bufferidx:', root_bufferidx, 'batchidx', batch_buffer_vbidx, 'num_faces', batch_vb.num_faces);
//    }

//    if (batch_vb.num_faces === 0) return true

//    return false;
// }


























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
   Free_int8_buffer(_widget_root_gfx.buffer[root_bufferidx]);
   return _widget_root_gfx.RemoveByIdx(root_bufferidx);
}



function Widget_root_gfx_create(root_bufferidx) {

   const idx = _widget_root_gfx.Add(New_int8_buffer(_, 'NEW _widget_root_gfx')); 

   if (root_bufferidx !== idx) 
      alert('Widget root gfx buffer not the same with the Widget root buffer');
}



// TODO: remove uneccessary params
export function Widget_root_gfx_add(root_bufferidx, mesh_bufferidx, progidx, vb_groupidx, vbidxs) {

   if (root_bufferidx === INT_NULL) return; // Case there is no widget root creation.

   _widget_root_gfx.buffer[root_bufferidx].Add(vb_groupidx);

   const vb_dataidx = Widget_root_batch_create_vb(root_bufferidx, mesh_bufferidx);

   // This is the easiest way to store the 'vb_dataidx' to the mesh's batch_buffer_vbidx variable.
   const mesh = _mesh_buffer.buffer[mesh_bufferidx]; // Get the mesh from MeshBuffer
   mesh.batch_buffer_vbidx = vb_dataidx; // Assign the 'batch_buffer_vbidx'

}



// /** Run through all vbs of the widget root, and set all root_pos's to the widget root pos */
// export function Widget_root_gfx_set_unif_wpos_per_vb(root_bufferidx) {

//    const root_mesh = _mesh_buffer.buffer[_widget_root_buffer.buffer[root_bufferidx].buffer[0]];
//    const pos = Mesh_unif_get_vb_root_wpos(root_mesh.root_posidx);
//    for (let j = 0; j <= _widget_root_gfx.buffer[root_bufferidx].boundary; j += 2) {
//       const vbidx = _widget_root_gfx.buffer[root_bufferidx].buffer[j + 1];
//       if (vbidx !== root_mesh.gfx.vb.idx) Mesh_unif_set_vb_root_wpos(vbidx, pos[0], pos[1]);
//    }

// }



/** Run through all vbs of the widget wpos root, and set all root_pos's to the widget root pos */
export function Widget_root_gfx_add_unif_wpos_per_vb(root_bufferidx, dif) {

   const root_mesh = _mesh_buffer.buffer[_widget_root_buffer.buffer[root_bufferidx].buffer[0]];

   const root_vb_groupidxs = _widget_root_gfx.buffer[root_bufferidx];

   // Run for all vertex buffer groups that belong to the root widget
   for (let i = 0; i <= root_vb_groupidxs.boundary; i++) {

      const vb_groupidx = root_vb_groupidxs.buffer[i];
      // TODO: A way of not change the root's wpos, but all its children. FIX it. (For scroller maybe we should call a View function that updates the unif pos of the scrolled meshes only) 
      if (vb_groupidx !== root_mesh.gfx.vb.groupidx) {
         Mesh_unif_add_vb_root_wpos(vb_groupidx, dif[0], dif[1]); 
      }
   }
   
}




/** Run through all vbs of the widget root, and resets the vb buffers of the '_mesh_per_vertex_buffer' struct */
export function Widget_root_gfx_reset_mesh_per_vb_buffer(root_bufferidx) {
   
   const root_vb_groupidxs = _widget_root_gfx.buffer[root_bufferidx];
   
   for (let i = 0; i <= root_vb_groupidxs.boundary; i++) {

      Mesh_per_vb_reset_buffer(root_vb_groupidxs.buffer[i]);
   }

}


































/*******************************************************************************************************************************************************************************/
// Global Update Functions
/*******************************************************************************************************************************************************************************/



/** Reset all gfx buffers, from start index 0, for the widget_root buffer, via it's widget_root_gfx buffer */
export function Widget_root_reset_gfx(root_bufferidx) {

   const rootgfx = Widget_root_gfx_get(root_bufferidx);
   
   for (let i = 0; i <= rootgfx.boundary; i++) {
      
      const root_mesh_per_vb_idx = _root_batch_buffer.buffer[root_bufferidx].vb[i].meshidx; // IMPORTANT: // TODO: Maybe we store the start to the batch buffer: batch_buffer.vb[i].start={meshidx, num_faces, start}
      const mesh = _mesh_buffer.buffer[root_mesh_per_vb_idx];
      // console.log('root_mesh_per_vb_idx', root_mesh_per_vb_idx)

      // TODO: We call 'Vertex_buffer_reset_to_index' because there is no vb reset to 0. Create that function
      // Vertex_buffer_reset_to_index(rootgfx.buffer[i], mesh.gfx.vb.starts.buffer); 
      Vertex_buffer_reset(rootgfx.buffer[i], mesh.gfx.vb.starts.buffer); 

      Index_buffer_reset(mesh.gfx.ib.idx); // BUG: The vertex buffer is getting reset to specific index, although the index buffer is reset to 0
   }
}



/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function Widget_root_rerender_from_root_reconstruct_listeners(root_bufferidx, do_reconstruct_listeners = true) {

   const root = _widget_root_buffer.buffer[root_bufferidx];

   for (let i = 0; i <= root.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
      if (mesh.state.mask & MESH_STATE.ACTIVE) {

         // mesh.AddToGfxFromReset();
         mesh.AddToGfx();
         // console.log('Add mesh from reset', mesh.GetName(), mesh.gfx.vb.starts.buffer[0])
      }
      // else console.log('INACTIVE', mesh.GetName())
   }

   // Reconstruct all listeners(from root, recursive(SLOW))
   if (do_reconstruct_listeners) {

      // Get the root mesh
      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[0]);
      // const parent_events = mesh.parent ? [mesh.parent.listeners.buffer[0], mesh.parent.listeners.buffer[1]] : [null, null];
      // mesh.ConstructListeners(parent_events);

      /********************************************************************************************************************/
      // Re-create listen events 
      Construct_listen_events_from_mesh_tree(mesh)
      Construct_listen_events_relations_from_mesh_tree(mesh);
   }

}



export function Widget_root_rerender(root_bufferidx) {

   const root = _widget_root_buffer.buffer[root_bufferidx];

   // Do for root
   // Resize: Only to Section meshes that have the option:EXPAND
   const root_mesh = Mesh_buffer_get_mesh_byidx(root.buffer[0]);

   // Rerender
   root_mesh.AddToGfxFromReset();

   // Do children
   for (let i = 1; i <= root.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
      if (mesh.state.mask & MESH_STATE.ACTIVE) {

         // // Do: meshes with rel_comp. Move the children positioned relative right
         // if (mesh.rel_comp) {
         //    Relative_pos_comp_move_right_buffer(REL_POS.RIGHT, mesh, x * 2)
         // }

         // Rerender
         mesh.AddToGfxFromReset();
         // console.log(mesh.GetName())
      }
   }
}


/**
 * // EFFICIENCY
 * VERY INEFICIENT:
 * If the root has 1000 meshes, and only 1 or 2 are to be resized,
 * we run 1000 times for no reason
 */

// Faster than calling for resize and rerender seperately 
/** Resize (x,y) dimentions and re-render for all meshes in widget root  */
export function Widget_root_resize_and_rerender(root_bufferidx, x, y, do_reconstruct_listeners = true) {

   const root = _widget_root_buffer.buffer[root_bufferidx];

   // Do for root
   // Resize: Only to Section meshes that have the option:EXPAND
   const root_mesh = Mesh_buffer_get_mesh_byidx(root.buffer[0]);

   // Rerender
   root_mesh.AddToGfxFromReset();

   // Do children
   for (let i = 1; i <= root.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
      if (mesh.state.mask & MESH_STATE.ACTIVE) {

         // Resize: Only to Menu_Bar meshes that have the option:EXPAND
         if (mesh.type & MESH_TYPE.WIDGET_MENU_BAR && mesh.options & SECTION.EXPAND) {
            mesh.geom.dim[0] += x;
         }

         // Do: meshes with rel_comp. Move the children positioned relative right
         if (mesh.rel_comp) {
            Relative_pos_comp_move_right_buffer(REL_POS.RIGHT, mesh, x * 2)
         }

         // Rerender
         mesh.AddToGfxFromReset();
      }
   }
}





export function Widget_root_set_in_focus(root_bufferidx) {


   const vb_mesh_roots = Widget_root_batch_get_all_roots_by_vertex_buffer(root_bufferidx);
   const len = vb_mesh_roots.length;

   for (let i = 0; i < len; i++) {

      const gfx = Mesh_buffer_get_mesh_gfx_byidx(vb_mesh_roots[i]);
      // Renderqueue_set_priority_by_vb(LAST, gfx.vb.groupidx);
      console.error('Implement: Widget_root_set_in_focus()')
   }

}




/** A function to call 'SetClbkGfxUniforms()@Mesh class', only once per vertex buffer, using the root mesh of each vb that belongs to this widget root */
export function Widget_root_set_uniform_callback_per_gfx_root_mesh(root_bufferidx, unif_name, Clbk, clbk_params) {

   // IMPORTANT : If a slider, which we want to cascade set the unif clbk belongs to a mesh that is the widget root, 
   // then it is not only the slider that are going to be effected rather all the meshes that belong to the widget root.

   // SEE: # UNIF PARAMS UPDATE ISSUE
   
   // Call for each root mesh in every vertex buffer
   const root_meshes= Widget_root_batch_get_all_roots_by_vertex_buffer(root_bufferidx);
   return root_meshes;
}



export function Widget_root_set_render_queue_flags(root_bufferidx, flags) {


   const vb_mesh_roots = Widget_root_batch_get_all_roots_by_vertex_buffer(root_bufferidx);
   const len = vb_mesh_roots.length;

   for (let i = 0; i < len; i++) {
      
      const gfx = Mesh_buffer_get_mesh_gfx_byidx(vb_mesh_roots[i]);
      Renderqueue_set_flags(gfx.vb.groupidx, flags)
   }

}



export function Widget_root_set_render_queue_priority(root_bufferidx) {


   const vb_mesh_roots = Widget_root_batch_get_all_roots_by_vertex_buffer(root_bufferidx);
   const len = vb_mesh_roots.length;

   for (let i = len-1; i >= 0; i--) {
      
      const gfx = Mesh_buffer_get_mesh_gfx_byidx(vb_mesh_roots[i]);
      Renderqueue_set_priority_by_vb(FIRST, gfx.vb.groupidx);
   }

}



// Activate render queue vertex buffers.
export function Widget_root_activate_all_vbs_in_renderqueue(root_bufferidx){
   /**DEBUG */ if(root_bufferidx===INT_NULL) 
      alert('560199235 \nroot_bufferidx is INT_NULL');


   // Get all vbs of the the root mesh and all its children
   const rootgfxs = Widget_root_gfx_get(root_bufferidx);
   
   for (let i = 0; i <= rootgfxs.boundary; i++) {

      // Get the root mesh from each vb
      const root_mesh_per_vb_idx = _root_batch_buffer.buffer[root_bufferidx].vb[i].meshidx;
      const mesh = _mesh_buffer.buffer[root_mesh_per_vb_idx];

      // Activate the vb, once per root mesh per vb
      Renderqueue_set_active(mesh.gfx.vb.groupidx, true) 
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
            'mbidx:', _mesh_buffer.buffer[i].mesh_bufferidx,
            'rbidx:', _mesh_buffer.buffer[i].root_bufferidx,
            'per_vb_idx', _mesh_buffer.buffer[i].per_vb_bufferidx,
            // 'gfxidx', _widget_root_gfx.buffer[_mesh_buffer.buffer[i].root_bufferidx],
            'batchidx:', _mesh_buffer.buffer[i].batch_buffer_vbidx,
            'groupidx:', _mesh_buffer.buffer[i].group_bufferidxs[0], _mesh_buffer.buffer[i].group_bufferidxs[1], _mesh_buffer.buffer[i].group_bufferidxs[2],
            'child idx:', _mesh_buffer.buffer[i].idx,
            'is active:', _mesh_buffer.buffer[i].state.mask & MESH_STATE.ACTIVE,
            'nameidx:', _mesh_buffer.buffer[i].nameidx,
            'pos:', _mesh_buffer.buffer[i].geom.pos,
            'name:', _mesh_buffer.buffer[i].GetName(),
         );
      }
      else console.log(i, 'NULL')
   }
}



// export function Gfx_buffer_print_loop() {
export function Mesh_per_vb_print() {

   console.log('size:', _mesh_per_vertex_buffer.size, 'boundary:', _mesh_per_vertex_buffer.boundary, 'count:', _mesh_per_vertex_buffer.active_count,);
   for (let i = 0; i <= _mesh_per_vertex_buffer.boundary; i++) {

      if (_mesh_per_vertex_buffer.buffer[i]) {

         console.log('vb', i,
            '\n size:', _mesh_per_vertex_buffer.buffer[i].size, 'boundary:', _mesh_per_vertex_buffer.buffer[i].boundary, 'count:', _mesh_per_vertex_buffer.buffer[i].active_count,
            '\n ', _mesh_per_vertex_buffer.buffer[i].buffer);
      }
      else console.log(i, 'NULL')
   }
}



export function Gfx_buffer_print_loop() {

   console.log('size:', _mesh_per_vertex_buffer.size, 'boundary:', _mesh_per_vertex_buffer.boundary, 'count:', _mesh_per_vertex_buffer.active_count,);
   for (let i = 0; i <= _mesh_per_vertex_buffer.boundary; i++) {

      if (_mesh_per_vertex_buffer.buffer[i]) {

         console.log('vb', i,);
         for (let j = 0; j <= _mesh_per_vertex_buffer.buffer[i].boundary; j++) {

            const mesh = _mesh_buffer.buffer[_mesh_per_vertex_buffer.buffer[i].buffer[j]];
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

      if(_widget_root_buffer.buffer[i]){

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
                     'batchidx', mesh.batch_buffer_vbidx,
                     'gfxidx', mesh.per_vb_bufferidx,
                     'msbidx', mesh.mesh_bufferidx,
                     'state', mesh.state.mask,
                     'GFX NOT CREATED', 'isActive', mesh.state.mask & MESH_STATE.ACTIVE,
                     'root_pos', mesh.root_posidx,
                     'name', mesh.geom.pos, mesh.GetName());
                     // 'ubidxs', mesh.uniforms, mesh.GetName());
                  }
                  else {
                     console.log('   ', j,
                        'msbidx', mesh.mesh_bufferidx,
                        'ridx:', mesh.root_bufferidx,
                        // 'is_gfx_inserted:', mesh.is_gfx_inserted,
                        // 'batchidx', mesh.batch_buffer_vbidx,
                        // 'gfxidx', mesh.per_vb_bufferidx,
                        'gfx', mesh.gfx.prog.idx, mesh.gfx.vb.groupidx, 'isActive', mesh.state.mask & MESH_STATE.ACTIVE,
                        'root_pos', mesh.root_posidx,
                        // 'INDEPENDENT', (mesh.options && (mesh.options & SECTION.INDEPENDENT)) ? 'YES' : 'NO',
                        // 'state', mesh.state.mask,
                        'start', mesh.gfx.vb.starts.buffer[0],
                        'upos', mesh.GetPosX(), mesh.GetPosY(),
                        'pos', mesh.geom.pos,
                        // 'dim', mesh.geom.dim,
                        // 'rel pos', mesh.geom.pos, 
                        mesh.GetName(),
                  );
                  // 'ubidxs', mesh.uniforms, mesh.GetName());
               }
            }
         }
      }
   }
}



// Print the widget root buffer (2)
export function Widgetroot_buffer_print_w6() {
   for (let i = 0; i <= _widget_root_buffer.boundary; i++) {

      if(_widget_root_buffer.buffer[i]){
         const root_mesh = Mesh_buffer_get_mesh_byidx(_widget_root_buffer.buffer[i].buffer[0]); // 0-th element in each widget root buffer is the root mesh
   
         console.log('mesh_bufferidx:', _widget_root_buffer.buffer[i].buffer[0], 'name:', root_mesh.GetName(),
            'size:', _widget_root_buffer.buffer[i].size,
            'boun:', _widget_root_buffer.buffer[i].boundary,
            'coun:', _widget_root_buffer.buffer[i].active_count,
         );
      }
   }
}



// Print the widget root gfx buffer (1)
export function Widgetroot_gfx_print_loop_w2() {

   for (let i = 0; i <= _widget_root_buffer.boundary; i++) {

      
      if(_widget_root_buffer.buffer[i]){
         console.log('root idx:', _widget_root_buffer.buffer[i].buffer[0]);
   
         const widget = _widget_root_gfx.buffer[i];
         for (let j = 0; j <= widget.boundary; j++) {
            console.log(
               ' vb_group_idx:', widget.buffer[j],
            );
         }
      }
   }
}



// Print the widget root gfx buffer (2)
export function Widgetroot_gfx_print_w3() {
   console.log('_widget_root_gfx:', _widget_root_gfx);
}



// Print the widget batch buffer
export function Widget_root_batch_print_w4() {

   for (let i = 0; i <= _root_batch_buffer.boundary; i++) {

      if(_widget_root_buffer.buffer[i]){
         if (!_root_batch_buffer.buffer[i]) { console.log('EMPTY'); return };
   
         const mesh = Mesh_buffer_get_mesh_byidx(_root_batch_buffer.buffer[i].meshidx)
         console.log('mesh_bufferidx:', _root_batch_buffer.buffer[i].meshidx, 'root_bufferidx:', _root_batch_buffer.buffer[i].rootidx, 'mesh name', mesh.GetName())
         for (let j = 0; j < _root_batch_buffer.buffer[i].vb.length; j++) {
            console.log('  vb:', j,
               'num_faces:', _root_batch_buffer.buffer[i].vb[j].num_faces,
               'meshidx:', _root_batch_buffer.buffer[i].vb[j].meshidx,
            );
         }
      }
   }
}



// Print the widget groups buffer
export function Widget_group_buffer_print_w5() {
alert('6655187 \nImplement me')
   // console.log('Wole Group Buffer:', _widget_groups_buffer)
   // for (let i = 0; i <= _widget_groups_buffer.boundary; i++) {

   //    const mesh = Mesh_buffer_get_mesh_byidx(_widget_groups_buffer.buffer[i].meshidx)
   //    console.log('mesh_bufferidx:', _widget_groups_buffer.buffer[i].meshidx, ' mesh name:', mesh.GetName())
   //    for (let j = 0; j < _widget_groups_buffer.buffer[i].group_data.length; j++) {
   //       console.log('  vb:', j,
   //          'vb_start:', _widget_groups_buffer.buffer[i].group_data[j].start,
   //          'ib_start:', _widget_groups_buffer.buffer[i].group_data[j].ib_start,
   //          'first mesh:', _widget_groups_buffer.buffer[i].group_data[j].meshidx,
   //          'num_faces:', _widget_groups_buffer.buffer[i].group_data[j].num_faces,
   //          'gfx:', _widget_groups_buffer.buffer[i].group_data[j].gfx_idxs,
   //       );
   //    }
   // }
}























