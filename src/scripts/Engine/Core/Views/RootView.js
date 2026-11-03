"use strict";

import { Free_int16_buffer, New_generic_buffer, New_int16_buffer } from "../Buffers.js";
import { Mesh_buffer_get_mesh_byidx } from "../MeshBuffer.js";
import { Mesh_get_real_pos_x, Mesh_get_real_pos_y } from "../../Drawables/Operations/MeshAttributesFunctions.js";
import { Mesh_get_name } from "../../Drawables/Operations/MeshPropertiesFunctions.js";
import { Floor } from "../../../Helpers/Math/MathOperations.js";

















const root_group_view_buffer = New_generic_buffer(_, 'Root group view');
/** */
export function Root_group_buffer_reset() { root_group_view_buffer.ResetFull(); }
/** */
export function Root_group_buffer_reset_dealocate() {

   for (let i = 0; i <= root_group_view_buffer.boundary; i++) {
      const group = root_group_view_buffer.buffer[i];
      if(group) Free_int16_buffer(group);
   }
   root_group_view_buffer.ResetFull();
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

/******************************************************************************************************************************/
// Getters
/** */
export function Root_group_view_buffer_get() { return root_group_view_buffer; }
/** */
export function Root_group_view_buffer_get_byidx(idx) { return root_group_view_buffer.buffer[idx]; }
/** */
export function Root_group_view_buffer_get_count() { return root_group_view_buffer.active_count; }
/** */
export function Root_group_view_buffer_get_root_meshidx(idx) { return root_group_view_buffer.buffer[idx].buffer[0]; }
/** */
export function Root_group_view_buffer_get_root_pos(idx) { return Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[idx].buffer[0]).geom.pos; }
/** */
export function Root_group_view_buffer_get_mesh_by_rootidx(idx) {

   const mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[idx].buffer[0]);
   return mesh;
}


/******************************************************************************************************************************/
// Creation-Addition

/** */
export function Root_group_view_buffer_create_root(mesh_bufferidx) {

   const root_idx = root_group_view_buffer.Add(New_int16_buffer(6, 'WidgetRoot buffer'));

   root_group_view_buffer.buffer[root_idx].Add(mesh_bufferidx);

   // Root_group_vbidx_view_create(root_idx);

   // Root_group_per_vb_meshidx_view_create_root(root_idx, mesh_bufferidx);

   return root_idx;
}
/** */
export function Root_group_view_buffer_add_mesh(root_bufferidx, mesh_bufferidx) {

   root_group_view_buffer.buffer[root_bufferidx].Add(mesh_bufferidx);
}

/******************************************************************************************************************************/
// Destruction-removal
// POTENTIAL_BUG!!! if the root is removed, the whole root buffer should be invalid and destroyed
/** */
export function Root_group_view_buffer_remove_root_byidx(root_bufferidx) {
   if (root_group_view_buffer.buffer[root_bufferidx] !== INT_NULL) {

      // Root_group_per_vb_meshidx_view_remove_byidx(root_bufferidx);
      // Root_group_vbidx_view_remove_byidx(root_bufferidx)
      root_group_view_buffer.RemoveByIdx(root_bufferidx);
   }
}
/** */
export function Root_group_view_buffer_destroy_all_meshes(root_bufferidx, mesh_bufferidx) {
   //TODO: IMPLEMENT
   // Run for all meshes in root
   // 
}
/** */
export function Root_group_view_is_widget_root(root_bufferidx, mesh_bufferidx) {

   // The widget root buffer store the root mesh at index 0, which is an index to the _mesh_buffer.
   // So if the index 'mesh_bufferidx' is the same as the 0-th element of the widget_buffer[root_bufferidx],
   // then this widget_root element is a root mesh
   if (root_bufferidx !== INT_NULL && root_group_view_buffer.buffer[root_bufferidx].buffer[0] === mesh_bufferidx) // If the mesh 
      return true;
   return false;
}















/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/

// Print the widget root buffer (1)
export function Root_group_buffer_print_w1() {
   for (let i = 0; i <= root_group_view_buffer.boundary; i++) {

      if (root_group_view_buffer.buffer[i]) {

         const root_mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[i].buffer[0]); // 0-th element in each widget root buffer is the root mesh

         let root_name = Mesh_get_name(root_mesh);
         if(root_name.length > MAX_NAME_LENGTH) 
            root_name = root_name.slice(0, MAX_NAME_LENGTH);
            console.log('root:', root_name,
               'size:', root_group_view_buffer.buffer[i].size,
               'boun:', root_group_view_buffer.buffer[i].boundary,
               'coun:', root_group_view_buffer.buffer[i].active_count,
            );

         for (let j = 0; j <= root_group_view_buffer.buffer[i].boundary; j++) {

            if (root_group_view_buffer.buffer[i].buffer[j] !== INT_NULL) {
               const mesh = Mesh_buffer_get_mesh_byidx(root_group_view_buffer.buffer[i].buffer[j]);

               let name = Mesh_get_name(mesh);
               if(name.length > MAX_NAME_LENGTH) 
                  name = name.slice(0, MAX_NAME_LENGTH);

               if (!mesh.gfx) {
                  console.warn('   ', j,
                     'ridx:', root_group_view_buffer.buffer[i].buffer[j],
                     'gfxidx', mesh.per_vb_bufferidx,
                     'msbidx', mesh.mesh_bufferidx,
                     'state', mesh.state.mask,
                     'GFX NOT CREATED', 'isActive', mesh.state.mask & MESH_STATE_FLAGS.ACTIVE,
                     'root_pos', mesh.root_posidx,
                     'pos', Floor(mesh.geom.pos[0]), Floor(mesh.geom.pos[1]), 
                     'name', name 
                  );
                  // 'ubidxs', mesh.uniforms, mesh.GetName());
               }
               else {
                  console.log('   ', j,
                     'mbidx', mesh.mesh_bufferidx,
                     'ridx:', mesh.root_bufferidx,
                     // 'gfxidx', mesh.per_vb_bufferidx,
                     'gfx', mesh.gfx.prog.idx, mesh.gfx.vb.groupidx, 'isActive', mesh.state.mask & MESH_STATE_FLAGS.ACTIVE,
                     'rposidx', mesh.root_posidx,
                     // 'state', mesh.state.mask,
                     'fixedHeigght', mesh.align.flags&LAYOUT.FIXED_HEIGHT,
                     'start', mesh.gfx.vb.starts.buffer[0],
                     'realpos', Floor(Mesh_get_real_pos_x(mesh)), Floor(Mesh_get_real_pos_y(mesh)),
                     'pos', Floor(mesh.geom.pos[0]), Floor(mesh.geom.pos[1]),
                     'name', name,
                  );
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

         console.log('mesh_bufferidx:', root_group_view_buffer.buffer[i].buffer[0], 'name:', Mesh_get_name(root_mesh),
            'size:', root_group_view_buffer.buffer[i].size,
            'boun:', root_group_view_buffer.buffer[i].boundary,
            'coun:', root_group_view_buffer.buffer[i].active_count,
         );
      }
   }
}

