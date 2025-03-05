"use strict";

import { Index_buffer_reset } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Vertex_buffer_reset_to_index } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Vertex_buffer_create_attribs_info_per_vb_instanced } from "../../../Graphics/ShaderAttributes.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Drawables/Operations/Recursions.js";
import { Relative_pos_comp_move_right_buffer } from "../../Drawables/Operations/RelativePosComponent.js";
import { Renderqueue_set_active, Renderqueue_set_flags, Renderqueue_set_priority_by_vb } from "../../Renderers/Renderer/RenderQueue.js";
import { Free_int16_buffer, Free_int8_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../Buffers.js";
import { Mesh_buffer_get_mesh_byidx, Mesh_buffer_get_mesh_gfx_byidx, Mesh_per_vb_remove_all_from_index, Mesh_per_vb_reset_buffer } from "../MeshBuffer.js";
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_get_vb_root_wpos } from "../MeshUniformsBuffer.js";

















const root_group_view_buffer = New_generic_buffer(_, 'Root group view');
export function Root_group_buffer_reset() { root_group_view_buffer.ResetFull(); }
const _root_vbidx_buffer = New_generic_buffer(_, 'Root vbidx view');
export function Root_group_gfx_buffer_reset() { _root_vbidx_buffer.ResetFull(); }
const _root_per_vb_meshidx_buffer = New_generic_buffer(_, 'Root pervb view');
export function Root_group_batch_buffer_reset() { _root_per_vb_meshidx_buffer.ResetFull(); }

export function Root_group_buffer_reset_dealocate() {

   for (let i = 0; i <= root_group_view_buffer.boundary; i++) {
      const group = root_group_view_buffer.buffer[i];
      if(group) Free_int16_buffer(group);
   }
   root_group_view_buffer.ResetFull();
}

export function Root_group_gfx_buffer_reset_dealocate() {

   for (let i = 0; i <= _root_vbidx_buffer.boundary; i++) {
      const group = _root_vbidx_buffer.buffer[i];
      if(group) Free_int8_buffer(group);
   }
   _root_vbidx_buffer.ResetFull();
}


















/*******************************************************************************************************************************************************************************/
// Widget root buffer: Stores all root meshes of a scene
/*******************************************************************************************************************************************************************************/


/**
 * Widget root: [Int16]
 * Structure:
 * root_group_view
 * root_group_vbidx_view
 * root_group_per_vb_meshidx_vie
 */


root_group_view_buffer.Init(8);



export function Root_group_view_buffer_get() { return root_group_view_buffer; }



export function Root_group_view_buffer_get_byidx(idx) { return root_group_view_buffer.buffer[idx]; }



export function Root_group_view_buffer_get_count() { return root_group_view_buffer.active_count; }



export function Root_group_view_buffer_get_root_meshidx(idx) { return root_group_view_buffer.buffer[idx].buffer[0]; }



export function Root_group_view_is_widget_root(root_bufferidx, mesh_bufferidx) {

   // The widget root buffer store the root mesh at index 0, which is an index to the _mesh_buffer.
   // So if the index 'mesh_bufferidx' is the same as the 0-th element of the widget_buffer[root_bufferidx],
   // then this widget_root element is a root mesh
   if (root_bufferidx !== INT_NULL && root_group_view_buffer.buffer[root_bufferidx].buffer[0] === mesh_bufferidx) // If the mesh 
      return true;
   return false;
}



export function Root_group_view_buffer_get_root_pos(idx) { return Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[idx].buffer[0]).geom.pos; }



export function Root_group_view_buffer_get_root_unif_wpos(idx) {
   const root_mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[idx].buffer[0]);
   if (root_mesh.root_posidx === INT_NULL) alert('No root was constructed yet\nWidget_root_buffer_get_root_unif_wpos()')
   const wpos = Mesh_unif_get_vb_root_wpos(root_mesh.root_posidx);
   return wpos;
}



export function Root_group_view_buffer_get_mesh_by_rootidx(idx) {

   const mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[idx].buffer[0]);
   return mesh;
}



export function Root_group_view_buffer_create_root(mesh_bufferidx) {

   const root_idx = root_group_view_buffer.Add(New_int16_buffer(6, 'WidgetRoot buffer'));

   root_group_view_buffer.buffer[root_idx].Add(mesh_bufferidx);

   Root_group_vbidx_view_create(root_idx);

   Root_group_per_vb_meshidx_view_create_root(root_idx, mesh_bufferidx);

   return root_idx;
}


// POTENTIAL_BUG!!! if the root is removed, the whole root buffer should be invalid and destroyed
export function Root_group_view_buffer_remove_root_byidx(root_bufferidx) {
   if (root_group_view_buffer.buffer[root_bufferidx] !== INT_NULL) {

      Root_group_per_vb_meshidx_view_remove_byidx(root_bufferidx);
      Root_group_vbidx_view_remove_byidx(root_bufferidx)
      root_group_view_buffer.RemoveByIdx(root_bufferidx);
   }
}



/** SAVE-DO NOT DELETE-remove widget_root with bach removal */
export function Root_group_view_buffer_remove_element_byidx(root_bufferidx, batch_buffer_vbidx, mesh_bufferidx, num_faces) {

   const HACK_INDEX = 0; // HACK: This is used only for none instanced geometries, where the vb and the start index of a mesh is the 0th element.
   // TODO: To correct this, we must provide the vb responsible for the provided starts (of the attributes). 

   if (root_group_view_buffer.buffer[root_bufferidx] !== INT_NULL) {

      const elem_found = Root_group_view_buffer_find_element_byidx(root_bufferidx, mesh_bufferidx);

      if (elem_found !== INT_NULL) {


         /*********************************************************************************************************************************/
         // Batch Remove num_faces

         // For widget_root, active or inactive, the num_faces must be decrement, compare to widget_groups.
         // const is_batch_vb_empty = Widget_root_batch_update_decrement_accumulator(root_bufferidx, batch_buffer_vbidx, num_faces);
         // // If batch-vb has 0 num_faces, set the batch-vb-meshidx to null.
         // if (is_batch_vb_empty) _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx = INT_NULL;


         /**
          * Replace the meshidx of the batch-vb(which is the root mesh for the spesific batch-vb[]),
          * if it is the mesh to be removed, with any other available meshidx from the same batch-vb 
          */

         // If the removed mesh happens to be root of any of the batch-vbs, we MUST replace it with the FIRST, same SID, mesh_bufferidx.
         // else 

         if (_root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[batch_buffer_vbidx].meshidx === mesh_bufferidx) {

            // Unfortunately we have no other option but to search the meshes through widget_root_buffer

            const len = root_group_view_buffer.buffer[root_bufferidx].boundary;
            let new_root_meshidx = INT_NULL;
            let min_start = 0xffff;
            for (let i = 0; i < len; i++) {
               const mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[root_bufferidx].buffer[i]); // Get meshes through wigdet_root_buffer


               if (mesh &&
                  mesh.batch_buffer_vbidx === batch_buffer_vbidx &&
                  mesh.gfx.vb.starts[HACK_INDEX] < min_start) {

                  min_start = mesh.gfx.vb.starts[HACK_INDEX];
                  new_root_meshidx = mesh.mesh_bufferidx;
               }

            }

         }


         /*********************************************************************************************************************************/
         // Batch Remove
         root_group_view_buffer.buffer[root_bufferidx].RemoveByIdxNoGapsVersion(elem_found, root_bufferidx, 'Root_group_view_buffer_remove_element_byidx');

      }
      else
         console.error('Widget root FAILED to remove element. root idx:', root_bufferidx, 'mesh_bufferidx', mesh_bufferidx, ' element idx:', elem_found,);

   }
}



function Root_group_view_buffer_find_element_byidx(root_bufferidx, mesh_bufferidx) {

   const root = root_group_view_buffer.buffer[root_bufferidx];

   if (root_bufferidx === INT_NULL) return INT_NULL;

   // Avoid checking the root element
   for (let i = 1; i <= root.boundary; i++) {

      if (root.buffer[i] === mesh_bufferidx) {
         return i;
      }
   }

   console.error('failed to find root idx for remove')

   return INT_NULL;
}



export function Root_group_view_buffer_add_mesh(root_bufferidx, mesh_bufferidx) {

   root_group_view_buffer.buffer[root_bufferidx].Add(mesh_bufferidx);
}



export function Root_group_view_buffer_destroy_all_meshes(root_bufferidx, mesh_bufferidx) {
   //TODO: IMPLEMENT
   // Run for all meshes in root
   // 
}


























/*******************************************************************************************************************************************************************************/
// Widget Root All Gfx Indexes
// Widgets all gfx indexes. Store in a buffer(per root widget) all of the childrens (recursive) gfx indexes (one index per gfx buffer) to have fast access to all gfx buffers
// The buffer is separated from root_group_view_buffer for efficiency
/*******************************************************************************************************************************************************************************/

_root_vbidx_buffer.Init(1);



// Returns an array [progidx:INT, vbidx:INT, ...]
export function Root_group_vbidx_view_get(root_bufferidx) {
   return _root_vbidx_buffer.buffer[root_bufferidx];
}



export function Root_group_vbidx_view_remove_byidx(root_bufferidx) {
   console.warn('Removing widget root:', _root_vbidx_buffer.buffer[root_bufferidx]);
   Free_int8_buffer(_root_vbidx_buffer.buffer[root_bufferidx]);
   return _root_vbidx_buffer.RemoveByIdx(root_bufferidx);
}



function Root_group_vbidx_view_create(root_bufferidx) {

   const idx = _root_vbidx_buffer.Add(New_int8_buffer(_, 'NEW _root_vbidx_buffer'));

   if (root_bufferidx !== idx)
      alert('Widget root gfx buffer not the same with the Widget root buffer');
}



// TODO: remove uneccessary params
export function Root_group_vbidx_view_add(root_bufferidx, mesh_bufferidx, progidx, vb_groupidx, vbidxs) {

   if (root_bufferidx === INT_NULL) return; // Case there is no widget root creation.

   _root_vbidx_buffer.buffer[root_bufferidx].Add(vb_groupidx);

   const vb_dataidx = Root_group_per_vb_meshidx_view_create_vb(root_bufferidx, mesh_bufferidx);

   // This is the easiest way to store the 'vb_dataidx' to the mesh's batch_buffer_vbidx variable.
   const mesh = Mesh_buffer_get_mesh_byidx(mesh_bufferidx); // Get the mesh from MeshBuffer
   mesh.batch_buffer_vbidx = vb_dataidx; // Assign the 'batch_buffer_vbidx'

}



/** Run through all vbs of the widget wpos root, and set all root_pos's to the widget root pos */
export function Root_group_vbidx_view_add_unif_wpos_per_vb(root_bufferidx, dif) {

   const root_mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[root_bufferidx].buffer[0]);

   const root_vb_groupidxs = _root_vbidx_buffer.buffer[root_bufferidx];

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
export function Root_group_vbidx_view_reset_mesh_per_vb_buffer(root_bufferidx) {

   const root_vb_groupidxs = _root_vbidx_buffer.buffer[root_bufferidx];

   for (let i = 0; i <= root_vb_groupidxs.boundary; i++) {

      Mesh_per_vb_reset_buffer(root_vb_groupidxs.buffer[i]);
   }

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




export function Root_group_per_vb_meshidx_view_view(root_bufferidx) {
   return _root_per_vb_meshidx_buffer.buffer[root_bufferidx];
}



export function Root_group_per_vb_meshidx_view_get_all_roots(root_bufferidx) {

   let roots = [];
   const len = _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb.length;

   for (let i = 0; i < len; i++) {
      roots[i] = _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].meshidx;
   }
   return roots;
}



export function Root_group_per_vb_meshidx_view_remove_byidx(root_bufferidx) {
   _root_per_vb_meshidx_buffer.RemoveByIdx(root_bufferidx);
}



function Root_group_per_vb_meshidx_view_create_root(root_bufferidx, mesh_bufferidx) {

   const root_batch_vb = {
      rootidx: root_bufferidx,
      meshidx: mesh_bufferidx,
      vb: [], // To store the mesh_bufferidx of the first mesh of the batch, as well as the number of faces of all the meshes in one batch(1 face = 4 vertices)
   };

   const idx = _root_per_vb_meshidx_buffer.Add(root_batch_vb);

   if (root_bufferidx !== idx)
      alert('Widget root batch buffer not the same with the Widget root buffer');
}



function Root_group_per_vb_meshidx_view_create_vb(root_bufferidx, mesh_bufferidx) {

   if (root_bufferidx === INT_NULL) return; // Case there is no widget root creation.

   const root_batch = _root_per_vb_meshidx_buffer.buffer[root_bufferidx];
   const vb_dataidx = root_batch.vb.push({
      num_faces: 0,
      meshidx: mesh_bufferidx,
   });

   return vb_dataidx - 1;
}



export function Root_group_per_vb_meshidx_view_assign_and_accum_to_vb(root_bufferidx, mesh_bufferidx, progidx, vbidx, num_faces) {

   if (root_bufferidx === INT_NULL) return;

   const gfxidxs = Root_group_vbidx_view_get(root_bufferidx);

   let stored = false;
   for (let i = 0; i <= gfxidxs.boundary; i++) {

      if (gfxidxs.buffer[i] === vbidx) {

         const mesh = Mesh_buffer_get_mesh_byidx(mesh_bufferidx);
         if (_root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].meshidx === mesh_bufferidx && _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].num_faces > 0) {
            // Just assign the batch index to the mesh
            mesh.batch_buffer_vbidx = i;
         }
         else {

            // Assignt the mesh's idx 
            if (_root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].meshidx === INT_NULL) {
               _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].meshidx = mesh_bufferidx;
            }

            _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].num_faces += num_faces;
            mesh.batch_buffer_vbidx = i;
         }

         stored = true; // The current vertex buffer index is found in the 'if' statement, so we do not have to add it to the 'Widget_root_gfx'.
         break;
      }

   }


   // Case the GFX buffers(WebGL) are already created, and in the 'Gfx_generate_context()' 
   // there is no call to this 'Root_group_vbidx_view_add()', // we must create the vb data.
   if (!stored)
      Root_group_vbidx_view_add(root_bufferidx, mesh_bufferidx, progidx, vbidx);

}




































/*******************************************************************************************************************************************************************************/
// Global Mesh Update Operations
// Operate on meshes through the root view's mesh indexes
/*******************************************************************************************************************************************************************************/



/** Reset all gfx buffers, from start index 0, for the widget_root buffer, via it's widget_root_gfx buffer */
export function Root_group_reset_gfxs(root_bufferidx) {

   const rootgfx = Root_group_vbidx_view_get(root_bufferidx);

   for (let i = 0; i <= rootgfx.boundary; i++) {

      const root_mesh_per_vb_idx = _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].meshidx; // IMPORTANT: // TODO: Maybe we store the start to the batch buffer: batch_buffer.vb[i].start={meshidx, num_faces, start}
      const mesh = Mesh_buffer_get_mesh_byidx(root_mesh_per_vb_idx);
      // console.log('root_mesh_per_vb_idx', root_mesh_per_vb_idx)

      // TODO: We call 'Vertex_buffer_reset_to_index' because there is no vb reset to 0. Create that function
      Vertex_buffer_reset_to_index(rootgfx.buffer[i], mesh.gfx.vb.starts.buffer);
      Vertex_buffer_create_attribs_info_per_vb_instanced(mesh.gfx.prog.attribsidx, mesh.gfx.vb.starts.buffer);

      Index_buffer_reset(mesh.gfx.ib.idx); // BUG: The vertex buffer is getting reset to specific index, although the index buffer is reset to 0

      // Reset the mesh per vb buffer of each vb
      Mesh_per_vb_remove_all_from_index(mesh.gfx.vb.groupidx);
   }

}



/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function Root_group_rerender_from_root_reconstruct_listeners(root_bufferidx, do_reconstruct_listeners = true) {

   const root = root_group_view_buffer.buffer[root_bufferidx];

   for (let i = 0; i <= root.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
      if (mesh.state.mask & MESH_STATE.ACTIVE) {

         // mesh.AddToGfxFromReset();
         mesh.AddToGfx();
      }
   }

   // Reconstruct all listeners(from root, recursive(SLOW))
   if (do_reconstruct_listeners) {

      // Get the root mesh
      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[0]);

      /********************************************************************************************************************/
      // Re-create listen events 
      Construct_listen_events_from_mesh_tree(mesh)
      Construct_listen_events_relations_from_mesh_tree(mesh);
   }

}



export function Root_group_rerender(root_bufferidx) {

   const root = root_group_view_buffer.buffer[root_bufferidx];

   // Do for root
   // Resize: Only to Section meshes that have the option:EXPAND
   const root_mesh = Mesh_buffer_get_mesh_byidx(root.buffer[0]);

   // Rerender
   root_mesh.AddToGfxFromReset();

   // Do children
   for (let i = 1; i <= root.boundary; i++) {

      const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
      if (mesh.state.mask & MESH_STATE.ACTIVE) {

         // Rerender
         mesh.AddToGfxFromReset();
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
export function Root_group_resize_and_rerender(root_bufferidx, x, y, do_reconstruct_listeners = true) {

   const root = root_group_view_buffer.buffer[root_bufferidx];

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
/** */
export function Root_group_destroy_meshes_buffer_alocations() {


   // Do children
   for (let i = 0; i <= root_group_view_buffer.boundary; i++) {

      const root = root_group_view_buffer.buffer[i];

      if(root) {
         for (let i = 0; i <= root.boundary; i++) {
            const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
            if(mesh) mesh.DestroyAlocatedBuffers();
         }
      }
   }
}





export function Root_group_set_in_focus(root_bufferidx) {


   const vb_mesh_roots = Root_group_per_vb_meshidx_view_get_all_roots(root_bufferidx);
   const len = vb_mesh_roots.length;

   for (let i = 0; i < len; i++) {

      const gfx = Mesh_buffer_get_mesh_gfx_byidx(vb_mesh_roots[i]);
      // Renderqueue_set_priority_by_vb(LAST, gfx.vb.groupidx);
      console.error('Implement: Root_group_set_in_focus()')
      alert('Implement: Root_group_set_in_focus()')
   }

}




export function Root_group_set_render_queue_flags(root_bufferidx, flags) {


   const vb_mesh_roots = Root_group_per_vb_meshidx_view_get_all_roots(root_bufferidx);
   const len = vb_mesh_roots.length;

   for (let i = 0; i < len; i++) {

      const gfx = Mesh_buffer_get_mesh_gfx_byidx(vb_mesh_roots[i]);
      Renderqueue_set_flags(gfx.vb.groupidx, flags)
   }

}



// TODO: Implement fast-> Get the widget root gfx that only has the vb indexes of the root view
export function Root_group_set_render_queue_priority(root_bufferidx) {

   const vb_mesh_roots = Root_group_per_vb_meshidx_view_get_all_roots(root_bufferidx);
   const len = vb_mesh_roots.length;

   for (let i = len - 1; i >= 0; i--) {

      const gfx = Mesh_buffer_get_mesh_gfx_byidx(vb_mesh_roots[i]);
      Renderqueue_set_priority_by_vb(FIRST, gfx.vb.groupidx);
   }

}



// Activate render queue vertex buffers.
export function Root_group_activate_all_vbs_in_renderqueue(root_bufferidx) {
   /**DEBUG */ if (root_bufferidx === INT_NULL)
      alert('560199235 \nroot_bufferidx is INT_NULL');


   // Get all vbs of the the root mesh and all its children
   const rootgfxs = Root_group_vbidx_view_get(root_bufferidx);

   for (let i = 0; i <= rootgfxs.boundary; i++) {

      // Get the root mesh from each vb
      const root_mesh_per_vb_idx = _root_per_vb_meshidx_buffer.buffer[root_bufferidx].vb[i].meshidx;
      const mesh = Mesh_buffer_get_mesh_byidx(root_mesh_per_vb_idx);

      // Activate the vb, once per root mesh per vb
      Renderqueue_set_active(mesh.gfx.vb.groupidx, true)
   }
}








































































/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/





// Print the widget root buffer (1)
export function Root_group_buffer_print_w1() {
   for (let i = 0; i <= root_group_view_buffer.boundary; i++) {

      if (root_group_view_buffer.buffer[i]) {

         const root_mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[i].buffer[0]); // 0-th element in each widget root buffer is the root mesh

         console.log('root:', root_mesh.GetName(),
            'size:', root_group_view_buffer.buffer[i].size,
            'boun:', root_group_view_buffer.buffer[i].boundary,
            'coun:', root_group_view_buffer.buffer[i].active_count,
         );

         for (let j = 0; j <= root_group_view_buffer.buffer[i].boundary; j++) {


            if (root_group_view_buffer.buffer[i].buffer[j] !== INT_NULL) {
               const mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[i].buffer[j]);

               if (!mesh.gfx) {
                  console.warn('   ', j,
                     'ridx:', root_group_view_buffer.buffer[i].buffer[j],
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
                     'realpos', mesh.GetPosX(), mesh.GetPosY(),
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
export function Root_group_buffer_print_w6() {
   for (let i = 0; i <= root_group_view_buffer.boundary; i++) {

      if (root_group_view_buffer.buffer[i]) {
         const root_mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[i].buffer[0]); // 0-th element in each widget root buffer is the root mesh

         console.log('mesh_bufferidx:', root_group_view_buffer.buffer[i].buffer[0], 'name:', root_mesh.GetName(),
            'size:', root_group_view_buffer.buffer[i].size,
            'boun:', root_group_view_buffer.buffer[i].boundary,
            'coun:', root_group_view_buffer.buffer[i].active_count,
         );
      }
   }
}



// Print the widget root gfx buffer (1)
export function Root_group_vbidx_buffer_print_loop_w2() {

   for (let i = 0; i <= root_group_view_buffer.boundary; i++) {


      if (root_group_view_buffer.buffer[i]) {
         console.log('root idx:', root_group_view_buffer.buffer[i].buffer[0]);

         const widget = _root_vbidx_buffer.buffer[i];
         for (let j = 0; j <= widget.boundary; j++) {
            console.log(
               ' vb_group_idx:', widget.buffer[j],
            );
         }
      }
   }
}



// Print the widget root gfx buffer (2)
export function Root_group_vbidx_buffer_print_w3() {
   console.log('_root_vbidx_buffer:', _root_vbidx_buffer);
}



// Print the widget batch buffer
export function Widget_root_per_vb_meshidx_print_w4() {

   for (let i = 0; i <= _root_per_vb_meshidx_buffer.boundary; i++) {

      if (root_group_view_buffer.buffer[i]) {
         if (!_root_per_vb_meshidx_buffer.buffer[i]) { console.log('EMPTY'); return };

         const mesh = Mesh_buffer_get_mesh_byidx(_root_per_vb_meshidx_buffer.buffer[i].meshidx)
         console.log('mesh_bufferidx:', _root_per_vb_meshidx_buffer.buffer[i].meshidx, 'root_bufferidx:', _root_per_vb_meshidx_buffer.buffer[i].rootidx, 'mesh name', mesh.GetName())
         for (let j = 0; j < _root_per_vb_meshidx_buffer.buffer[i].vb.length; j++) {
            console.log('  vb:', j,
               'num_faces:', _root_per_vb_meshidx_buffer.buffer[i].vb[j].num_faces,
               'meshidx:', _root_per_vb_meshidx_buffer.buffer[i].vb[j].meshidx,
            );
         }
      }
   }
}



