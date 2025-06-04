"use strict";

import { Sid_check_match } from "../../../GlobalFunctions.js";
import { Vertex_buffer_render_group_create, Vertex_buffer_render_group_reset_draw_count, Vertex_buffer_render_group_set_draw_count_from_num_faces, Vertex_buffer_render_group_set_num_faces } from "../../../Graphics/Buffers/RenderGroups.js";
import { Vertex_buffer_calculate_starts_per_render_group, Vertex_buffer_calculate_vertexbuffer_render_group_starts, Vertex_buffer_group_get_texidx, Vertex_buffer_group_store_render_groupidx, Vertex_buffer_reset_to_index_NEW } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Mesh_get_name } from "../../Drawables/Operations/MeshPropertiesFunctions.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Renderqueue_set_active } from "../../Renderers/Renderer/RenderQueue.js";
import { Free_generic_buffer, Free_int16_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../Buffers.js";
import { Mesh_buffer_get_mesh_byidx, Mesh_per_vb_remove_mesh } from "../MeshBuffer.js";
import { Mesh_unif_create_rg_root_wpos, Mesh_unif_get_vb_root_wpos } from "../MeshUniformsBuffer.js";





_CNT = 0;
export const VIEW_INFO = {
   VB_GROUP_IDX: _CNT++,
   RENDER_GROUP_IDX: _CNT++,

   START: _CNT++,
   NUM_FACES: _CNT++,

   SIZE: _CNT,
};



/******************************************************************************************************************************/
/******************************************************************************************************************************/
/******************************************************************************************************************************/
/**
 *  CLEAN UP UNUSE FUNCTIONS
 */
/******************************************************************************************************************************/
/******************************************************************************************************************************/
/******************************************************************************************************************************/





const _view_buffer = New_generic_buffer(_, 'Mesh buffer Views');

/******************************************************************************************************************************/
// Create
/** */
export function View_create_new_group(mesh) {

   const groupidx = View_group_create(mesh);
   return groupidx;
}
/** */
function View_group_create(mesh) {

   if (mesh.group_bufferidxs[0] !== INT_NULL) {
      console.error('@ View_group_create(). mesh is alredy in a group', 'mesh', mesh.name)
      alert('@ View_group_create(). mesh is alredy in a group')
   }

   const mesh_idx = mesh.mesh_bufferidx;
   const view = {
      rootidx: mesh_idx,
      vb: New_generic_buffer(_, 'MeshViewGroup-VBbuffer'), // Array of arrays of per vertex buffer mesh indexes,
      sub_groups_idxs: New_int8_buffer(_, 'MeshViewGroup-SubGroupsBuffer'), // Any grouup may have many sub-groups of the same object type (this)
   };

   const groupidx = _view_buffer.Add(view);

   return groupidx;

}



/******************************************************************************************************************************/
// Reset-Destroy
/** */
export function View_buffer_reset_g_buffer() {

   for (let i = 0; i <= _view_buffer.boundary; i++) {
      const vb = _view_buffer.buffer[i].vb;
      for (let j = 0; j <= vb.boundary; j++) {

         Free_int16_buffer(vb.buffer[j].meshidxs);
      }
      Free_generic_buffer(vb);
   }
   _view_buffer.ResetFull();
}



/******************************************************************************************************************************/
// Getters
/** */
export function View_get_group(groupidx) { return _view_buffer.buffer[groupidx]; }
/** */
export function View_get_count() { return _view_buffer.active_count; }
/** */
export function View_get_by_viewidx(group_bufferidx) { return _view_buffer.buffer[group_bufferidx]; }





/** */
function View_vb_exists(groupidx, vbidx, mesh_for_debug) {

   // Catch error
   if(groupidx < 0 || groupidx > _view_buffer.boundary) {
      console.error('Mesh:', mesh_for_debug.name, ' has no view group. Please assign the mesh to an existing view group or create a new group for the mesh.\ngroupidx:', groupidx, 'vbidx:', vbidx);
      alert('Mesh has no view group. Please assign the mesh to an existing view group or create a new group for the mesh.');
   }

   const view = _view_buffer.buffer[groupidx];

   for (let i = 0; i <= view.vb.boundary; i++) {

      if (view.vb.buffer[i].vb_groupidx === vbidx)
         return i;
   }

   return INT_NULL;
}
/** */
function View_render_group_exists(groupidx, view_vbidx, render_groupidx) {

   const rg = _view_buffer.buffer[groupidx].vb.buffer[view_vbidx].rg;

   for (let i = 0; i <= rg.boundary; i++) {

      if (rg.buffer[i].render_groupidx !== INT_NULL && rg.buffer[i].render_groupidx === render_groupidx)
         return i;
   }

   return INT_NULL;
}








/******************************************************************************************************************************/
// Find Match
/******************************************************************************************************************************/
/** */
function Find_match_from_children(mesh, parent) {

   let view_rgidx = INT_NULL;
   let done = false;

   for (let i = 0; i <= parent.children.boundary; i++) {

      const child = parent.children.buffer[i];
      if (child ) { // Avoid finding a none yet processed sibling(denoted from '.group_bufferidxs[2] = INT_NULL)
         
         if(child.mesh_bufferidx !== mesh.mesh_bufferidx 
            && (Sid_check_match(mesh.sid, child.sid) 
            && child.group_bufferidxs[2] !== INT_NULL)) {
            
            const texidx = Vertex_buffer_group_get_texidx(child.gfx.vb.groupidx);
            if(texidx === mesh.mat.texidx){
               view_rgidx = child.group_bufferidxs[2];
               done = true;
               return { view_rgidx: view_rgidx, done: done };
            }
         }
         else if (child.text_mesh){

            if (child.text_mesh 
                     && child.text_mesh.mesh_bufferidx !== mesh.mesh_bufferidx 
                     && Sid_check_match(mesh.sid, child.text_mesh.sid)
                     && child.text_mesh.group_bufferidxs[2] !== INT_NULL ) { // For Text meshes
               
               const texidx = Vertex_buffer_group_get_texidx(child.text_mesh.gfx.vb.groupidx);
               if(texidx === mesh.mat.texidx){
                  view_rgidx = child.text_mesh.group_bufferidxs[2];
                  done = true;
                  return { view_rgidx: view_rgidx, done: done };
               }
            }
         }
         // Search recursively down the children tree
         if (!done && child.children.boundary !== INT_NULL) {
            const res = Find_match_from_children(mesh, child);
            // IMPORTANT: Must return since gfx index is found, else is going to search furthemore and probably will populate the view_rgidx with INT_NULL again.
            if (res.done) return { view_rgidx: res.view_rgidx, done: res.done };
         }
      }

   }

   return { view_rgidx: view_rgidx, done: done };
}
function Find_match_gfx_from_parent(mesh, parent) {

   let view_rgidx = INT_NULL;
   let done = false;

   if (!parent) return { view_rgidx: view_rgidx, done: true }

   
   if(Sid_check_match(mesh.sid, parent.sid)) {
      
      const texidx = Vertex_buffer_group_get_texidx(parent.gfx.vb.groupidx);
      if(texidx === mesh.mat.texidx){
         view_rgidx = parent.group_bufferidxs[2];
         done = true;
      } 
   }
   // Check if the parent has a text_mesh
   // Below we avoid a cyclical dependecy: If the mesh is a text mesh, the the parent.text_mesh is the mesh its self, so maybe this couuld cause problems 
   else if (parent.text_mesh && parent !== mesh.parent && Sid_check_match(mesh.sid, parent.text_mesh.sid)) {
      
      const texidx = Vertex_buffer_group_get_texidx(parent.text_mesh.gfx.vb.groupidx);
      if(texidx === mesh.mat.texidx){
         view_rgidx = parent.text_mesh.group_bufferidxs[2];
         done = true;
      }
   }


   return { view_rgidx: view_rgidx, done: done };
}
function Find_match_gfx_from_parent_ascending_search_all(mesh, parent) {

   let ret = Find_match_gfx_from_parent(mesh, parent)

   if (!ret.done) {

      ret = Find_match_from_children(mesh, parent)

      if (!ret.done && parent.parent) { // Run recursively 
         if ((parent.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_NEW)===0 &&
              mesh.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW) { // Avoid searches from parent up if parent is in a NEW_GROUP
               ret.view_rgidx = Find_match_gfx_from_parent_ascending_search_all(mesh, parent.parent)
            }
      }
   }

   return ret.view_rgidx;
}
















/******************************************************************************************************************************/
/******************************************************************************************************************************/
/** */
// function View_group_add_subgroup_to_group(groupidx, sub_group_idx) {
//    const view = _view_buffer.buffer[groupidx];
//    view.sub_groups_idxs.Add(sub_group_idx)
// }
/** */
// export function View_group_create_sub_group(mesh, parent_groupidx) {

//    const mesh_idx = mesh.mesh_bufferidx;
//    const new_group = {
//       rootidx: mesh_idx,
//       vb: New_generic_buffer(_, 'MeshViewGroup-VBbuffer'), // Array of arrays of per vertex buffer mesh indexes,
//       sub_groups_idxs: New_int8_buffer(_, 'MeshViewGroup-SubGroupsBuffer'), // Any grouup may have many sub-groups of the same object type (this)
//    };

//    const new_groupidx = _view_buffer.buffer[parent_groupidx].sub_groups_idxs.Add(new_group);

//    return new_groupidx;

// }


/** DEPRECATED */
/** DEPRECATED */
/** DEPRECATED */
/** DEPRECATED */
/** DEPRECATED */
/** DEPRECATED */
export function View_build_group_from_root_mesh(mesh) {

   if (mesh.group_bufferidxs[0] !== INT_NULL) alert('@ View_build_group_from_root_mesh(). mesh is alredy in a group')

   let groupidx = mesh.group_bufferidxs[0];

   if (groupidx === INT_NULL) groupidx = View_group_create(mesh);

   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx);
}



/** Create uniforms from rendergroups */
function View_group_create_uniforms_for_render_group(mesh) {

   const uniforms = mesh.uniforms;
   const flags = mesh.gfx_ctx_flags;
   
   /*******************************************************************************************************************/
   // Set up the uniform positioning per render group system
   for (let i = 0; i < uniforms.length; i++) {
   
      if ((uniforms[i].shader & UNIFORM.IS_SHARED) === 0) { // Create ONLY for non-block uniforms
   
         const ubidx = uniforms[i].ubidx;

         if (uniforms[i].name === 'u_wposxy') {
   
            const HAS_ABSOLUTE_POS = flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION;
            // const HAS_STICKY_POS = temp_is_particle_system===false ? (mesh.state.mask & MESH_STATE_FLAGS.STICKY_POSX) | mesh.state.mask & MESH_STATE_FLAGS.STICKY_POSY : 0x0;
            const HAS_STICKY_POS = 0x0;
            
            let COPY_MESH_POS = false;
            /**
             * if:
             * mesh has parent
             * parent is on different vb
             */
   
            // Create a position for each render group to update the uniform position (for each render group draw call) of a vertex buffer
            mesh.root_posidx = Mesh_unif_create_rg_root_wpos(mesh, ubidx, HAS_ABSOLUTE_POS, HAS_STICKY_POS, COPY_MESH_POS);
            // Set the update callback function, along with the position index to be used for the uniform update
            mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.render_groupidx)
   
         }
      }
   }
}




/** */
function Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx) {

   mesh.gfx = Gfx_generate_context(mesh.gfx_ctx_flags, mesh, _);
   
   
   // Connect the mesh with the View via indexes
   const info = View_add_mesh(groupidx, mesh);
   mesh.group_bufferidxs[0] = info[0]; // Groups buffer index.
   mesh.group_bufferidxs[1] = info[1]; // VB buffers index, which vb buffer the mesh belongs.
   mesh.group_bufferidxs[2] = info[2]; // Render groups  .
   mesh.group_bufferidxs[3] = info[3]; // Mesh's index in the group buffer  .
   
   if (mesh.text_mesh) {
      
      mesh.text_mesh.gfx = Gfx_generate_context(mesh.gfx_ctx_flags, mesh, _);
      const text_info = View_add_mesh(groupidx, mesh.text_mesh);
      mesh.text_mesh.group_bufferidxs[0] = text_info[0]; // Groups buffer index.
      mesh.text_mesh.group_bufferidxs[1] = text_info[1]; // VB buffers index, which vb buffer the mesh belongs.
      mesh.text_mesh.group_bufferidxs[2] = text_info[2]; // Render groups  .
      mesh.text_mesh.group_bufferidxs[3] = text_info[3]; // Mesh's index in the group buffer  .
   }

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {

         Build_per_gfx_view_group_from_root_mesh_recursive(child, groupidx)

      }
   }

}
/** Add mesh to view-group. Create vertex buffer render-group */
export function View_add_mesh(groupidx, mesh) {
// TODO: Comment logic
   const mesh_bufferidx = mesh.mesh_bufferidx;
   const num_faces = mesh.geom.num_faces;
   const vb_groupidx = mesh.gfx.vb.groupidx;
   const view = _view_buffer.buffer[groupidx];

   // Find meshidxs for vertex buffer, if exists
   let view_vbidx = View_vb_exists(groupidx, vb_groupidx, mesh);
   let view_rgidx = INT_NULL;
   let view_meshidx = INT_NULL;

   if (view_vbidx !== INT_NULL) { // Vb buffer found

      if (mesh.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_NEW) {

         const new_render_groupidx = Vertex_buffer_render_group_create(vb_groupidx, num_faces);
         Vertex_buffer_group_store_render_groupidx(vb_groupidx, new_render_groupidx);
         
         view_rgidx = view.vb.buffer[view_vbidx].rg.Add({
            render_groupidx: new_render_groupidx,
            start: 0,
            num_faces: num_faces,
            meshidxs: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
         });
         
         mesh.gfx.vb.render_groupidx = new_render_groupidx;

         View_group_create_uniforms_for_render_group(mesh, new_render_groupidx);
         
      }
      else {
         
         // TODO: Create insertions here, matched based on other flags,
         const found_match = Find_match_gfx_from_parent_ascending_search_all(mesh, mesh.parent);
         if (found_match !== INT_NULL) {
            view_rgidx = found_match;
            mesh.gfx.vb.render_groupidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx;
            view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces += num_faces;
            Vertex_buffer_render_group_set_num_faces(view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx, view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces)
         }
         else {

            const new_render_groupidx = Vertex_buffer_render_group_create(vb_groupidx, num_faces);
            Vertex_buffer_group_store_render_groupidx(vb_groupidx, new_render_groupidx);

            view_rgidx = view.vb.buffer[view_vbidx].rg.Add({
               render_groupidx: new_render_groupidx,
               start: 0,
               num_faces: num_faces,
               meshidxs: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
            });
            
            mesh.gfx.vb.render_groupidx = new_render_groupidx;

            View_group_create_uniforms_for_render_group(mesh, new_render_groupidx);
         }
         
      }

      view_meshidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].meshidxs.Add(mesh_bufferidx);
      // return [groupidx, view_vbidx, view_rgidx, view_meshidx]; // return the indexes
      
   }
   else { // Else if not found, create new View vb.

      const render_groups = New_generic_buffer(_, 'MeshViewGroup-RenderGroupBuffer');

      const new_render_groupidx = Vertex_buffer_render_group_create(vb_groupidx, num_faces);
      Vertex_buffer_group_store_render_groupidx(vb_groupidx, new_render_groupidx);

      view_rgidx = render_groups.Add({
         render_groupidx: new_render_groupidx,
         start: 0,
         num_faces: num_faces,
         meshidxs: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
      });
      
      
      view_vbidx = view.vb.Add({
         vb_groupidx: vb_groupidx,
         rg: render_groups,
      });
      
      view_meshidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].meshidxs.Add(mesh_bufferidx);
      
      mesh.gfx.vb.render_groupidx = new_render_groupidx;

      View_group_create_uniforms_for_render_group(mesh, new_render_groupidx);
      
      // return [groupidx, view_vbidx, view_rgidx, view_meshidx]; // return the indexes
      
   }
   
   mesh.group_bufferidxs[0] = groupidx; // Groups buffer index.
   mesh.group_bufferidxs[1] = view_vbidx; // VB buffers index, which vb buffer the mesh belongs.
   mesh.group_bufferidxs[2] = view_rgidx; // Render group.
   mesh.group_bufferidxs[3] = view_meshidx; // Mesh's index in the  view group buffer.
   return [groupidx, view_vbidx, view_rgidx, view_meshidx]; // return the indexes
}
/** */
export function View_remove_mesh(group_bufferidxs, num_faces) {

   const groupidx = group_bufferidxs[0];
   const view_vbidx = group_bufferidxs[1];
   const view_rgidx = group_bufferidxs[2];
   const view_meshidx = group_bufferidxs[3];

   const view = _view_buffer.buffer[groupidx];

   view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces -= num_faces;
   view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].meshidxs.RemoveByIdx(view_meshidx);
}






/** */
export function View_activate_rg(group_bufferidxs) {

   const groupidx = group_bufferidxs[0];
   const view_vbidx = group_bufferidxs[1];
   const view_rgidx = group_bufferidxs[2];
   
   const view = _view_buffer.buffer[groupidx];
   const render_groupidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx;
   const num_faces = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces;
   Vertex_buffer_render_group_set_draw_count_from_num_faces(render_groupidx, num_faces);
   
}
/** */
export function View_deactivate_rg(render_groupidx) {
   
   Vertex_buffer_render_group_reset_draw_count(render_groupidx, 0);
   
}











/******************************************************************************************************************************/
// Functionality
/*****************************************************************************************************************************/


/** */
export function View_render_from_view_NEW(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

         for (let k = 0; k <= view.vb.buffer[i].rg.buffer[j].meshidxs.boundary; k++) { // Vertex Attribute Buffering.

            const meshidx = view.vb.buffer[i].rg.buffer[j].meshidxs.buffer[k];
            if (meshidx !== INT_NULL) {

               const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
               if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

                  mesh.AddToGfx();
                  if (mesh.scroller_comp) {

                     // Scroller_component_calculate_handle_pos_dim(mesh.scroller_comp);

                     // if(0) { // TODO: Scroller component should store if it has scissor box enabled
                     //    // Set scissor box
                     //    const mx = this.mesh_bufferidx;
                     //    const my = this.scroller_comp.mesh_bufferidx;
                     //    const mw = this.mesh_bufferidx;
                     //    const mh = this.scroller_comp.mesh_bufferidx;
                     //    Vertex_buffer_group_create_scissorbox(this.gfx.vb.groupidx, mx, my, mw, mh);
                     // }
                  }
               }
               else { // DEBUG
                  // console.log('DEBUG->Insert->Mesh INACTIVE', mesh.name, 'rgidx', mesh.gfx.vb.render_groupidx)
               }
            }
         }
      }
   }

   // Render any sub groups
   for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {
      const sub_groupidx = view.sub_groups_idxs.buffer[i];
      View_render_from_view_NEW(sub_groupidx)
   }

}
/** */
export function View_calculate_view_group_starts(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      const vb_groupidx = view.vb.buffer[i].vb_groupidx;
      for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

         const rg_groupidx = view.vb.buffer[i].rg.buffer[j].render_groupidx;
         Vertex_buffer_calculate_vertexbuffer_render_group_starts(vb_groupidx, rg_groupidx);

      }
   }

}
/** */
export function View_calculate_render_group_starts(vb_groupidx, rg_groupidx) {

   // Vertex_buffer_calculate_vertexbuffer_render_group_starts(vb_groupidx, rg_groupidx);
   Vertex_buffer_calculate_starts_per_render_group(vb_groupidx, rg_groupidx)

}
/** Render all meshes of a specific render group to vertex buffer */
export function View_render_from_view_specific_render_group_NEW(group_bufferidxs) {

   const groupidx = group_bufferidxs[0];
   const view_vbidx = group_bufferidxs[1];
   const view_rgidx = group_bufferidxs[2];
   
   const view = _view_buffer.buffer[groupidx];
   const rg = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx];

   for (let k = 0; k <= rg.meshidxs.boundary; k++) { // Vertex Attribute Buffering.
      const meshidx = rg.meshidxs.buffer[k];
      if (meshidx !== INT_NULL) {

         const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
         if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {
            if (!mesh.is_gfx_inserted) mesh.AddToGfx();
            else mesh.AddToGfxFromReset();
         }
      }
   }
   
   // // Render any sub groups
   // for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {
   //    const sub_groupidx = view.sub_groups_idxs.buffer[i];
   //    View_render_from_view_NEW(sub_groupidx)
   // }
}
/** Activate view group's render queue's vertex buffers */
export function View_activate_all_vbs_in_renderqueue(group_bufferidxs) {

   const groupidx = group_bufferidxs[0];
   const view = _view_buffer.buffer[groupidx];
   
   for (let i = 0; i <= view.vb.boundary; i++) { // Vertex Attribute Buffering.
      
      const vb_groupidx = view.vb.buffer[i].vb_groupidx;
      Renderqueue_set_active(vb_groupidx, true);
   }
}
/** */
export function View_buffer_get_all_root_mehes() {
   
   const roots = [];
   for (let i = 0; i <= _view_buffer.boundary; i++) {
      
      const groupidx = i;
      const view = _view_buffer.buffer[groupidx];
      roots[i] = view.rootidx;
   }
   return roots;
}




























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/


/* Buffer of all meshes of the application. */
export function View_buffer_print() {
   console.log('_view_buffer:', _view_buffer);
}
/* Buffer of all meshes of the application. */
export function View_buffer_print_loop() {

   for (let i = 0; i <= _view_buffer.boundary; i++) {

      console.log('group:', i);
      const view = _view_buffer.buffer[i];
      for (let j = 0; j <= view.vb.boundary; j++) {

         console.log(
            `  vbidx:${view.vb.buffer[j].vb_groupidx}`,
         );

         for (let k = 0; k <= view.vb.buffer[j].rg.boundary; k++) {

            console.log(
               `    rgidx:${view.vb.buffer[j].rg.buffer[k].render_groupidx}`,
               `    start:${view.vb.buffer[j].rg.buffer[k].start}`,
               `    num_faces:${view.vb.buffer[j].rg.buffer[k].num_faces}`,
               '\n    meshidxs', view.vb.buffer[j].rg.buffer[k].meshidxs.buffer,
            );
         }

      }
   }
}
/** */
export function View_buffer_print_roots() {
   const roots = View_buffer_get_all_root_mehes();
   console.log(roots)
}









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NEED RE_IMPLEMENTATION



export function View_get_view_byidx(view_groupidx) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[view_groupidx];
}



export function View_get_view_vb_byidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]];
}



export function View_get_view_meshidx_byidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].meshidxs.buffer[group_bufferidxs[2]];
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
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].meshidxs.buffer[group_bufferidxs[2]];
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
/** Adds mesh to existing view, recurvively for all mesh's children */
export function View_add_to_group(mesh, groupidx) {
   // alert('88482634\nOLD VIEW GROUP IMPLEMENTAION.');
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
// HERE: must add multi vbidx for the Views
/** THIS FUNCTION MAY NOT REMOVEE ANY 'mesh_per_vb', because of the 'Dropdown' removal by inactive item */
export function View_reset_from_view_all_buffers(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   alert('001985543125\nOUT OF SYNC. RE IMPLEMENT')

   for (let i = 0; i <= view.vb.boundary; i++) {

      const vb_groupidx = view.vb.buffer[i].info[VIEW_INFO.VB_GROUP_IDX];

      const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
      const starts = mesh.gfx.vb.starts.buffer;
      // Vertex_buffer_reset_to_index(vb_groupidx, starts);

      // Remove each mesh from @mesh_per_vb storage buffer
      for (let j = 0; j <= view.vb.buffer[i].meshidxs.boundary; j++) {

         const meshidx = view.vb.buffer[i].meshidxs.buffer[j];

         if (meshidx !== INT_NULL) {

            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
            if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE)
               Mesh_per_vb_remove_mesh(vb_groupidx, mesh.per_vb_bufferidx)
         }
      }
   }

   // const view = _view_buffer.buffer[view_groupidx];

   // for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

   //    for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

   //       const vb_groupidx = view.vb.buffer[i].vb_groupidx;

   //       for (let k = 0; k <= view.vb.buffer[i].rg.buffer[j].meshidxs.boundary; k++) { // Vertex Attribute Buffering.
   //          // Vertex_buffer_reset_to_index(vb_groupidx, starts);

   //          const meshidx = view.vb.buffer[i].rg.buffer[j].meshidxs.buffer[k];
   //          if (meshidx !== INT_NULL) {

   //             const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
   //             if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

   //                mesh.AddToGfx();
   //             }
   //          }
   //       }
   //    }

   // }

}
/** */
function View_consolidate_buffer(groupidx, group_vbidx) {


   const buffer = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].meshidxs
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
/** */
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

   const buffer = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].meshidxs;

   /**DEBUG*/ if (groupidx === INT_NULL || group_vbidx === INT_NULL || group_meshidx === INT_NULL) console.error('MESH HAS NULL GROUP:', Mesh_get_name(mesh), ' mesh group idxs', mesh.group_bufferidxs)

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

      /**DEBUG*/ if (text_groupidx === INT_NULL || text_group_vbidx === INT_NULL || text_group_meshidx === INT_NULL) console.error('MESH HAS NULL GROUP:', Mesh_get_name(mesh.text_mesh), ' mesh group idxs', mesh.text_mesh.group_bufferidxs)

      _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].meshidxs.RemoveByIdx(text_group_meshidx);

      // Update group's num_faces.
      _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].info[VIEW_INFO.NUM_FACES] -= mesh.text_mesh.geom.num_faces;


      mesh.text_mesh.group_bufferidxs[0] = INT_NULL;
      mesh.text_mesh.group_bufferidxs[1] = INT_NULL;
      mesh.text_mesh.group_bufferidxs[2] = INT_NULL;
   }
}


/** */
export function View_reset_to_index_from_view_group_NEW(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

         const vb_groupidx = view.vb.buffer[i].vb_groupidx;
         const rg = view.vb.buffer[i].rg.buffer[j];

         Vertex_buffer_reset_to_index_NEW(vb_groupidx, rg.render_groupidx)
      }
   }

}

/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function View_build_all_group_from_root_mesh(view_groupidx, do_reconstruct_listeners = true) {
   // console.log('===========================================================================================================')
   const view = _view_buffer.buffer[view_groupidx];

   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      // console.log('view', i, view.vb.buffer[i].info, view.vb.buffer[i].meshidxs)
      for (let j = 0; j <= view.vb.buffer[i].meshidxs.boundary; j++) { // Vertex Attribute Buffering.

         const meshidx = view.vb.buffer[i].meshidxs.buffer[j];
         if (meshidx !== INT_NULL) {

            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
            if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

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
export function View_activate_all_vbs(group_bufferidxs, activate_flag) {

   const view = _view_buffer.buffer[group_bufferidxs[0]];

   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      const info = view.vb.buffer[i].info;
      const vb_groupidx = info[VIEW_INFO.VB_GROUP_IDX];
      Renderqueue_set_active(vb_groupidx, activate_flag)
   }
}





// UNUSED


/** */
// function View_render_group_find_match(groupidx, view_vbidx) {

//    // const vb = _view_buffer.buffer[groupidx].vb;
//    const rg = _view_buffer.buffer[groupidx].vb.buffer[view_vbidx].rg;

//    // for (let i = 0; i <= rg.boundary; i++) {
//    for (let i = rg.boundary; i >= 0 ; i++) {

//       if (rg.buffer[i].render_groupidx !== INT_NULL)
//          return i;
//    }

//    return INT_NULL;
// }
/** */
// function View_render_group_find_match_from_render_group(groupidx, view_vbidx) {

//    // const vb = _view_buffer.buffer[groupidx].vb;
//    const rg = _view_buffer.buffer[groupidx].vb.buffer[view_vbidx].rg;

//    // for (let i = 0; i <= rg.boundary; i++) {
//    for (let i = rg.boundary; i >= 0 ; i++) {

//       if (rg.buffer[i].render_groupidx !== INT_NULL)
//          return i;
//    }

//    return INT_NULL;
// }
/** */
// function View_render_group_find_match_from_parent_recursive(new_mesh, parent) {

//    if(parent)  {
      
//       // Case: parent matches vb
//       if(parent.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
//          // return parent.gfx.vb.render_groupidx;
//          console.log(
//             'FOUND:MESH',
//             'mesh name', new_mesh.name,
//             'parent name', parent.name,
//             'view_rgidx', parent.group_bufferidxs[2],
//          )
//          return parent.group_bufferidxs[2];
//       }
//       // Case: parent.text_mesh matches vb
//       else if(parent.text_mesh && parent.text_mesh.mesh_bufferidx !== new_mesh.mesh_bufferidx
//          && parent.text_mesh.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
//          // Avoid null parent, avoid same new_mesh and parent being the same mesh
//          console.log(
//             'FOUND:TEXT_MESH',
//             'mesh name', new_mesh.name,
//             'parent name', parent.name,
//             'view_rgidx', parent.text_mesh.group_bufferidxs[2],
//          )
//          return parent.text_mesh.group_bufferidxs[2];
//       }
//       // Case: parent is rendered on o NEW rg(and vbs do not match), child also need to be isolated from the root render group
//       // else if(parent.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_NEW) {
//       //    return INT_NULL;
//       // }
//       // else if(parent.children.boundary > INT_NULL && new_mesh.gfx_ctx_flags & GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC) {
//       else if(parent.children.boundary > INT_NULL 
//          && new_mesh.gfx_ctx_flags & (GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL)) {

//          for(let i=0; i <= parent.children.boundary; i++)   {

//             const child = parent.children.buffer[i];
//             if(child.mesh_bufferidx !== new_mesh.mesh_bufferidx) {
//                if(child.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
//                   // return parent.gfx.vb.render_groupidx;
//                   console.log('FOUND:MESH','mesh name', new_mesh.name,'child name', child.name,'view_rgidx', child.group_bufferidxs[2],)
//                   return child.group_bufferidxs[2];
//                }
//                // Avoid null parent, avoid same new_mesh and parent being the same mesh
//                else if(child.text_mesh && child.text_mesh.mesh_bufferidx !== new_mesh.mesh_bufferidx
//                   && child.text_mesh.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
//                   console.log('FOUND:TEXT_MESH','mesh name', new_mesh.name,'child name', child.name,'view_rgidx', child.text_mesh.group_bufferidxs[2],)
//                   return child.text_mesh.group_bufferidxs[2];
//                }
//                // TODO: Must continue down the tree of childrens(case a label is on its own container and deserves the rg for text of a sibling container with label and text )
//                // ? Is this aproach correct? I think yes  because to create new rg a node must be on its own new rg
//             }
//          }

//       }

//       if(parent.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_NEW) {
//          return INT_NULL;
//       }

//       const found_render_groupidx = View_render_group_find_match_from_parent_recursive(new_mesh, parent.parent);
//       return found_render_groupidx;
//    }


//    return INT_NULL;
// }