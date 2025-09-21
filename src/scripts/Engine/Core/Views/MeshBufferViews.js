"use strict";

import { Sid_check_match } from "../../../GlobalFunctions.js";
import { Index_buffer_reset } from "../../../Graphics/Buffers/IndexBuffers.js";
import { Vertex_buffer_render_group_create, Vertex_buffer_render_group_get_size, Vertex_buffer_render_group_remove, Vertex_buffer_render_group_reset_draw_count, Vertex_buffer_render_group_set_draw_count_from_num_faces, Vertex_buffer_render_group_set_num_faces } from "../../../Graphics/Buffers/RenderGroups.js";
import { Vertex_buffer_calculate_starts_per_render_group, Vertex_buffer_calculate_vertexbuffer_render_group_starts, Vertex_buffer_group_create_scissorbox, Vertex_buffer_group_get, Vertex_buffer_group_get_byidx, Vertex_buffer_group_get_ibidx, Vertex_buffer_group_get_texidx, Vertex_buffer_group_remove_render_groupidx, Vertex_buffer_group_store_render_groupidx, Vertex_buffer_group_update_scissorbox, Vertex_buffer_reset_to_index_NEW } from "../../../Graphics/Buffers/VertexBuffers.js";import { Mesh_get_name } from "../../Drawables/Operations/MeshPropertiesFunctions.js";
import { Renderqueue_set_active } from "../../Renderers/Renderer/RenderQueue.js";
import { Free_generic_buffer, Free_int16_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../Buffers.js";
import { Mesh_buffer_get_mesh_byidx } from "../MeshBuffer.js";
import { Mesh_unif_create_rg_root_wpos, Mesh_unif_get_vb_root_wpos, Mesh_unif_set_from_existing_vb_root_wpos } from "../MeshUniformsBuffer.js";
import { Root_group_view_is_widget_root } from "./RootView.js";


/** DO NOT DELETE: Implementation of rendering sub-groups of a group */
   // // Render any sub groups // TODO:implement
   // for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {
   //    const sub_groupidx = view.sub_groups_idxs.buffer[i];
   //    View_render_from_view_NEW(sub_groupidx)
   // }

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
   // console.error('@ View_group_create().', 'mesh', Mesh_get_name(mesh));

   const mesh_idx = mesh.mesh_bufferidx;
   const view = {
      state:VIEW_GROUP_STATE_FLAGS.ACTIVE,
      rootidx: mesh_idx,
      vb: New_generic_buffer(_, 'MeshViewGroup-VBbuffer'), // Array of arrays of per vertex buffer mesh indexes,
      sub_groups_idxs: New_int8_buffer(_, 'MeshViewGroup-SubGroupsBuffer'), // Any grouup may have many sub-groups of the same object type (this)
   };

   // const groupidx = _view_buffer.Add(view);
   const free_elem_idx = _view_buffer.GetNextFree();
   const groupidx = _view_buffer.AddAtIndex(free_elem_idx, view);

   return groupidx;

}



/******************************************************************************************************************************/
// Reset-Destroy

/** */
export function View_buffer_reset_g_buffer() {

   for (let i = 0; i <= _view_buffer.boundary; i++) {

      if(_view_buffer.buffer[i]){

         const vb = _view_buffer.buffer[i].vb;
         for (let j = 0; j <= vb.boundary; j++) {
            Free_int16_buffer(vb.buffer[j].meshidxs);
         }
         Free_generic_buffer(vb);
      }
   }
   _view_buffer.ResetFull();
}
/** */
export function View_buffer_remove_group(groupidx) {

   _view_buffer.RemoveByIdx(groupidx);
}



/******************************************************************************************************************************/
// Getters
/** */
export function View_get_group(groupidx) { return _view_buffer.buffer[groupidx]; }
/** */
export function View_get_count() { return _view_buffer.active_count; }
/** */
export function View_get_group_root_meshidx(groupidx) { return _view_buffer.buffer[groupidx].rootidx; }
/** */
export function View_get_view_vb_root_meshidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].rootidx;
}





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
/** */
export function View_is_render_group_rendered(groupidx, view_vbidx, view_rgidx) {
   if(_view_buffer.buffer[groupidx].vb.buffer[view_vbidx].rg.buffer[view_rgidx].state & VIEW_GROUP_STATE_FLAGS.IS_RENDERED)
      return true;
   return false;
}
/** */
export function View_is_mesh_root(group_bufferidxs, mesh_bufferidx) {
   // TODO: Buffer Error Check
   // The root mesh of the group 'sits' at inde
   const rootidx = _view_buffer.buffer[group_bufferidxs[0]].rootidx;
   if (rootidx === mesh_bufferidx) return true;
   return false;
}







/******************************************************************************************************************************/
// Find Rendergroup Match
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
/** */
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
   // Check if the parent has a text_mesh. Avoid matching self
   else if (parent.text_mesh && mesh !== parent.text_mesh && Sid_check_match(mesh.sid, parent.text_mesh.sid)) {
      
      const texidx = Vertex_buffer_group_get_texidx(parent.text_mesh.gfx.vb.groupidx);
      if(texidx === mesh.mat.texidx){
         view_rgidx = parent.text_mesh.group_bufferidxs[2];
         done = true;
      }
   }


   return { view_rgidx: view_rgidx, done: done };
}
/** */
function Find_match_gfx_from_parent_ascending_search_all(mesh, parent) {

   let ret = Find_match_gfx_from_parent(mesh, parent)

   if (!ret.done) {

      ret = Find_match_from_children(mesh, parent);
      
      if (!ret.done && parent.parent) { // Run recursively 
         if ((parent.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_NEW)===0 && mesh.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW) { // Avoid searches from parent up if parent is in a NEW_GROUP
            ret.view_rgidx = Find_match_gfx_from_parent_ascending_search_all(mesh, parent.parent)
         }
         else { // Since the we have parent.parent and is the root (RENDER_GROUP_NEW or RENDER_GROUP_FROM_NEW), we want  to search all its children
            ret = Find_match_from_children(mesh, parent.parent);
         }
      }
   }

   return ret.view_rgidx;
}

/** */
function Find_match_gfx_from_view_group(mesh, view_groupidx) {

   let done = false;
   let view_rgidx = INT_NULL;
   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      const view_vbidx = i;
      for (let j = 0; j <= view.vb.buffer[view_vbidx].rg.boundary; j++) { // 
            
         const rg = view.vb.buffer[view_vbidx].rg.buffer[j];

         for (let k = 0; k <= rg.meshidxs.boundary; k++) { 

            const midx = rg.meshidxs.buffer[k];
            const m = Mesh_buffer_get_mesh_byidx(midx);
            if(Sid_check_match(mesh.sid, m.sid)) {
               
               const texidx = Vertex_buffer_group_get_texidx(m.gfx.vb.groupidx);
               if(texidx === mesh.mat.texidx){
                  view_rgidx = m.group_bufferidxs[2];
                  done = true;
               } 
            }
            // Check if the m has a text_mesh. Avoid matching self
            else if (m.text_mesh && mesh !== m.text_mesh && Sid_check_match(mesh.sid, m.text_mesh.sid)) {
               
               const texidx = Vertex_buffer_group_get_texidx(m.text_mesh.gfx.vb.groupidx);
               if(texidx === mesh.mat.texidx){
                  view_rgidx = m.text_mesh.group_bufferidxs[2];
                  done = true;
                  break;
               }
            }
         }
      }
   }

   return view_rgidx;
}
/** */
function Find_match_gfx_from_view_vb(mesh, view_groupidx, view_vbidx) {

   let done = false;
   let view_rgidx = INT_NULL;
   
   const view = _view_buffer.buffer[view_groupidx];
   for (let j = 0; j <= view.vb.buffer[view_vbidx].rg.boundary; j++) {  
         
      const rg = view.vb.buffer[view_vbidx].rg.buffer[j];

      for (let k = 0; k <= rg.meshidxs.boundary; k++) { 

         const midx = rg.meshidxs.buffer[k];
         const m = Mesh_buffer_get_mesh_byidx(midx);
         if(Sid_check_match(mesh.sid, m.sid)) {
            
            const texidx = Vertex_buffer_group_get_texidx(m.gfx.vb.groupidx);
            if(texidx === mesh.mat.texidx){
               view_rgidx = m.group_bufferidxs[2];
               done = true;
            } 
         }
         // Check if the m has a text_mesh. Avoid matching self
         else if (m.text_mesh && mesh !== m.text_mesh && Sid_check_match(mesh.sid, m.text_mesh.sid)) {
            
            const texidx = Vertex_buffer_group_get_texidx(m.text_mesh.gfx.vb.groupidx);
            if(texidx === mesh.mat.texidx){
               view_rgidx = m.text_mesh.group_bufferidxs[2];
               done = true;
               break;
            }
         }
      }
   }

   return view_rgidx;
}















/******************************************************************************************************************************/
/******************************************************************************************************************************/
//

/** Create uniforms from rendergroups */
function View_create_uniforms_for_render_group(mesh, COPY_WPOS_TO_UNIFWPOS) {

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
            
            console.log('##########', mesh.name, mesh.geom.pos)
            // Create a position for each render group to update the uniform position (for each render group draw call) of a vertex buffer
            mesh.root_posidx = Mesh_unif_create_rg_root_wpos(mesh, ubidx, HAS_ABSOLUTE_POS, HAS_STICKY_POS, COPY_WPOS_TO_UNIFWPOS);
            // Set the update callback function, along with the position index to be used for the uniform update
            mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.render_groupidx)
   
         }
      }
   }
}
/** Create uniforms from rendergroups on a re-used vb */
function View_create_uniforms_for_reused_render_group(mesh) {

   const uniforms = mesh.uniforms;
   const flags = mesh.gfx_ctx_flags;
   
   /*******************************************************************************************************************/
   // Set up the uniform positioning per render group system
   for (let i = 0; i < uniforms.length; i++) {
   
      if ((uniforms[i].shader & UNIFORM.IS_SHARED) === 0) { // Create ONLY for non-block uniforms
   
         if (uniforms[i].name === 'u_wposxy') {
            
            const HAS_ABSOLUTE_POS = flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION;
            const HAS_STICKY_POS = (mesh.state.mask & MESH_STATE_FLAGS.STICKY_POSX) | mesh.state.mask & MESH_STATE_FLAGS.STICKY_POSY;
            const IS_VB_ROOT = Root_group_view_is_widget_root(mesh.root_bufferidx, mesh.mesh_bufferidx);
            
            // Create a position for each render group to update the uniform position (for each render group draw call) of a vertex buffer
            // mesh.root_posidx = Mesh_unif_create_rg_root_wpos(mesh, ubidx, HAS_ABSOLUTE_POS, HAS_STICKY_POS, COPY_WPOS_TO_UNIFWPOS);
            // Set the update callback function, along with the position index to be used for the uniform update
            mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.render_groupidx)
            mesh.root_posidx = Mesh_unif_set_from_existing_vb_root_wpos(mesh, HAS_ABSOLUTE_POS, HAS_STICKY_POS, IS_VB_ROOT);
         
         }
      }
   }

}





/** Add mesh to view-group. Create vertex buffer render-group */
export function View_add_mesh(groupidx, mesh, is_root_widget_on_reused_vb=false) {
// TODO: Comment logic
   const mesh_bufferidx = mesh.mesh_bufferidx;
   const num_faces = mesh.geom.num_faces;
   const vb_groupidx = mesh.gfx.vb.groupidx;
   const view = _view_buffer.buffer[groupidx];


   // Enable copying the mesh's wpos if it is the view group root or if it is a root by it's self(added afterwards to the group)
   const is_root_group = (view.rootidx === mesh.mesh_bufferidx) ? true : (Root_group_view_is_widget_root(mesh.root_bufferidx, mesh_bufferidx)) ? true : false ;  // Set u_wpos on the root mesh, from which all root's meshes position will draw from

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

         View_create_uniforms_for_render_group(mesh, is_root_group);
         
      }
      else {
         
         let rgidx_found_match = INT_NULL;

         if((mesh.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_MATCH_FROM_RENDER_GROUP)) {
            rgidx_found_match = Find_match_gfx_from_view_vb(mesh, groupidx, view_vbidx);
         }
         else if((mesh.gfx_ctx_flags & GFX_CTX_FLAGS.RENDER_GROUP_MATCH_FROM_GROUP)) {
            rgidx_found_match = Find_match_gfx_from_view_group(mesh, groupidx);
         }
         else {
            rgidx_found_match = Find_match_gfx_from_parent_ascending_search_all(mesh, mesh.parent);
         }
         
         if (rgidx_found_match !== INT_NULL) {
            view_rgidx = rgidx_found_match;
            mesh.gfx.vb.render_groupidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx;
            view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces += num_faces;
            Vertex_buffer_render_group_set_num_faces(view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx, view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces);

            // if(mesh.gfx.is_root_widget_on_reused_vb) {

            //    View_create_uniforms_for_reused_render_group(mesh, mesh.gfx.is_root_widget_on_reused_vb)
            // }
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

            View_create_uniforms_for_render_group(mesh, is_root_group);
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
         state: 0x0, // SEE: VIEW_GROUP_STATE_FLAGS
         render_groupidx: new_render_groupidx,
         start: 0,
         num_faces: num_faces,
         meshidxs: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
      });
      
      
      view_vbidx = view.vb.Add({
         state: 0x0, // SEE: VIEW_GROUP_STATE_FLAGS
         vb_groupidx: vb_groupidx,
         rg: render_groups,
      });
      
      view_meshidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].meshidxs.Add(mesh_bufferidx);
      
      mesh.gfx.vb.render_groupidx = new_render_groupidx;

      
      if(is_root_widget_on_reused_vb) {
         // View_create_uniforms_for_reused_render_group(mesh, mesh.gfx.is_root_widget_on_reused_vb)
         View_create_uniforms_for_reused_render_group(mesh, is_root_widget_on_reused_vb)
      }
      else {
         View_create_uniforms_for_render_group(mesh, is_root_group);
      }
      
   }
   
   mesh.group_bufferidxs[0] = groupidx; // Groups buffer index.
   mesh.group_bufferidxs[1] = view_vbidx; // VB buffers index, which vb buffer the mesh belongs.
   mesh.group_bufferidxs[2] = view_rgidx; // Render group.
   mesh.group_bufferidxs[3] = view_meshidx; // Mesh's index in the  view group buffer.
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
export function View_destroy_render_group_and_meshes(groupidx, view_vbidx, view_rgidx) {

   
   const view = _view_buffer.buffer[groupidx];
   const rg = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx];

   // for (let k = 0; k <= rg.meshidxs.boundary; k++) { // Vertex Attribute Buffering.
   for (let k = rg.meshidxs.boundary; k >= 0 ; k--) { // Vertex Attribute Buffering.
    
      const meshidx = rg.meshidxs.buffer[k];
      if (meshidx !== INT_NULL) {

         const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
         if ((mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) && mesh.is_gfx_inserted) {
            console.warn('DESTROY MESH ->>>>>>>>>>', mesh.name, 'meshidx', meshidx);
            mesh.Destroy();
         }
      }
   }

   Vertex_buffer_render_group_remove(rg.render_groupidx); // Remove render group storage 

   view.vb.buffer[view_vbidx].rg.RemoveByIdx(view_rgidx);


}
/** */
export function View_destroy_view_group_and_meshes(groupidx) {


   const view = _view_buffer.buffer[groupidx];
   for (let i = view.vb.boundary; i >= 0; i--) { // All vertex buffer groups

      const view_vbidx = i;
      console.warn('REMOVE VB', i);
      
      for (let j = view.vb.buffer[view_vbidx].rg.boundary; j >= 0; j--) { // Vertex Attribute Buffering.
         
         console.warn('REMOVE RG', j);
         const view_rgidx = j;
         const rg = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx];
         for (let k = rg.meshidxs.boundary; k >= 0 ; k--) { // Vertex Attribute Buffering.
 
            const meshidx = rg.meshidxs.buffer[k];
            if (meshidx !== INT_NULL) {

               const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
               if ((mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) && mesh.is_gfx_inserted) {
                  console.warn(i,j,k,'DESTROY MESH ->>>>>>>>>>', mesh.name, 'meshidx', meshidx);
                  mesh.Destroy();
               }
            }
         }
         
         Vertex_buffer_render_group_remove(rg.render_groupidx); // Remove render group storage 
         view.vb.buffer[view_vbidx].rg.RemoveByIdx(view_rgidx);
         
      }
      
      Vertex_buffer_group_remove_render_groupidx(view.vb.buffer[view_vbidx].vb_groupidx)
      const ibidx = Vertex_buffer_group_get_ibidx(view.vb.buffer[view_vbidx].vb_groupidx);
      Index_buffer_reset(ibidx)
   }

   View_buffer_remove_group(groupidx);
}





/** */
export function View_calculate_rendergroup_draw_count(group_bufferidxs) {

   const groupidx = group_bufferidxs[0];
   const view_vbidx = group_bufferidxs[1];
   const view_rgidx = group_bufferidxs[2];
   
   const view = _view_buffer.buffer[groupidx];
   const render_groupidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx;
   const num_faces = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces;
   Vertex_buffer_render_group_set_draw_count_from_num_faces(render_groupidx, num_faces);
   
}
/** */
export function View_reset_rendergroup_draw_count(render_groupidx) {
   
   Vertex_buffer_render_group_reset_draw_count(render_groupidx, 0);
   
}











/******************************************************************************************************************************/
// Functionality
/*****************************************************************************************************************************/

/** */
function View_calculate_view_group_starts(view_groupidx) {

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
function View_calculate_render_group_starts(groupidx, view_vbidx, view_rgidx) {

   const view = _view_buffer.buffer[groupidx];
   let rg_start_attribute = 0; 
   
   rg_start_attribute = 0; 
   const rg = view.vb.buffer[view_vbidx].rg;
   const len = (view_rgidx < rg.active_count) ? view_rgidx : rg.active_count;
   for(let j = 0; j < len; j++) { // Run only for all previous rendergroups to sum the total size(AKA. find the attribute start index)

      const rendergroup_size = Vertex_buffer_render_group_get_size(rg.buffer[j].render_groupidx)
      rg_start_attribute += rendergroup_size;
      // console.log('\noooooooooooooooooooooooooooooooooooooo\nrg.buffer[j].render_groupidx', rg.buffer[j].render_groupidx, 'rendergroup_size', rendergroup_size, 'rg_start_attribute', rg_start_attribute)
   }

   const vb_groupidx = view.vb.buffer[view_vbidx].vb_groupidx;
   const rg_idx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx;
   Vertex_buffer_calculate_starts_per_render_group(vb_groupidx, rg_idx, rg_start_attribute);

}
/** Activate view group's render queue's vertex buffers */
export function View_activate_all_vbs_in_renderqueue(group_bufferidxs) {

   const groupidx = group_bufferidxs[0];
   const view = _view_buffer.buffer[groupidx];
   
   // console.error('###########################################\nActivate vbs:');
   for (let i = 0; i <= view.vb.boundary; i++) { // Vertex Attribute Buffering.
      
      const vb_groupidx = view.vb.buffer[i].vb_groupidx;
      Renderqueue_set_active(vb_groupidx, true);
      console.error(vb_groupidx)
   }
}
/** Deactivate view group's render queue's vertex buffers */
export function View_deactivate_all_vbs_in_renderqueue(group_bufferidxs) {
   
   const groupidx = group_bufferidxs[0];
   const view = _view_buffer.buffer[groupidx];
   
   // console.error('###########################################\nDeactivate vbs:');
   for (let i = 0; i <= view.vb.boundary; i++) { // Vertex Attribute Buffering.
      
      const vb_groupidx = view.vb.buffer[i].vb_groupidx;
      Renderqueue_set_active(vb_groupidx, false);
      console.error(vb_groupidx)
   }
}
/** Activate by render group */
export function View_activate_vb_in_renderqueue_from_rendergroup(groupidx, view_vbidx) {

   const view = _view_buffer.buffer[groupidx];
   const vb_groupidx = view.vb.buffer[view_vbidx].vb_groupidx;
   Renderqueue_set_active(vb_groupidx, true);
   view.vb.buffer[view_vbidx].state |= VIEW_GROUP_STATE_FLAGS.IS_VB_ACTIVATED;
   // console.error('###### ACTIVATE VB IN RENDERQUEUE', vb_groupidx)
   
}
/** Deactivate by render group */
export function View_deactivate_vb_in_renderqueue_from_rendergroup(groupidx, view_vbidx) {
   
   const view = _view_buffer.buffer[groupidx];
   const vb_groupidx = view.vb.buffer[view_vbidx].vb_groupidx;
   Renderqueue_set_active(vb_groupidx, false);
   view.vb.buffer[view_vbidx].state &= ~VIEW_GROUP_STATE_FLAGS.IS_VB_ACTIVATED;
   console.error('###### DEACTIVATE VB IN RENDERQUEUE', vb_groupidx)
   
}
/** */
export function View_get_all_root_mehes() {
   
   const roots = [];
   for (let i = 0; i <= _view_buffer.boundary; i++) {
      
      const groupidx = i;
      const view = _view_buffer.buffer[groupidx];
      roots[i] = view.rootidx;
   }
   return roots;
}


/******************************************************************************************************************************/
// Reset-Render-Rerender
/** */
export function View_render_from_view_NEW(view_groupidx) {

   View_render_whole_view_group_NEW(view_groupidx);
   _view_buffer.buffer[view_groupidx].state |= VIEW_GROUP_STATE_FLAGS.IS_RENDERED;

}
/** Render all meshes of the whole view group to vertex buffer */
export function View_render_whole_view_group_NEW(view_groupidx) {
// console.log('======-=-=-===-=-=-=-=-=-=-=-=-=-=-=-=-');
   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      const view_vbidx = i;

      if((view.vb.buffer[view_vbidx].state & VIEW_GROUP_STATE_FLAGS.IS_VB_ACTIVATED)===0){
         View_activate_vb_in_renderqueue_from_rendergroup(view_groupidx, view_vbidx);
      }
          
      for (let j = 0; j <= view.vb.buffer[view_vbidx].rg.boundary; j++) { // 
            
         const view_rgidx = j;
         const rg = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx];

         
         const is_rendergroup_alredy_rendered = View_is_render_group_rendered(view_groupidx, view_vbidx, view_rgidx);
         if(!is_rendergroup_alredy_rendered) {

            // calculate render group starts
            View_calculate_render_group_starts(view_groupidx, view_vbidx, view_rgidx);
            // console.log('CALCULATE STARTS\n', 'view_groupidx', view_groupidx, 'view_vbidx', view_vbidx, 'view_rgidx', view_rgidx);
            
            for (let k = 0; k <= rg.meshidxs.boundary; k++) { 
               const meshidx = rg.meshidxs.buffer[k];
               if (meshidx !== INT_NULL) {
   
                  const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
                  if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {
                     mesh.AddToGfx();
                  }
               }
            }
       
         }

         rg.state |= VIEW_GROUP_STATE_FLAGS.IS_RENDERED; // Set state to 'Rendered'

      }
   }
   // Render any sub groups
   for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {
      const sub_groupidx = view.sub_groups_idxs.buffer[i];
      View_render_from_view_NEW(sub_groupidx)
   }
}
/** Render all meshes of a specific render group to vertex buffer */
export function View_render_specific_render_group(groupidx, view_vbidx, view_rgidx, add_in_already_rendered_group=false) {

   const view = _view_buffer.buffer[groupidx];
   const rg = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx];

   const is_rendergroup_alredy_rendered = View_is_render_group_rendered(groupidx, view_vbidx, view_rgidx);
   if(!is_rendergroup_alredy_rendered || add_in_already_rendered_group) {

      // calculate render group starts
      View_calculate_render_group_starts(groupidx, view_vbidx, view_rgidx);

   }
   
   for (let k = 0; k <= rg.meshidxs.boundary; k++) { // Vertex Attribute Buffering.
      
      const meshidx = rg.meshidxs.buffer[k];
      if (meshidx !== INT_NULL) {

         const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
         if ((mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) && !mesh.is_gfx_inserted) {
            mesh.AddToGfx();
            // console.log('->>>>>>>>>>', mesh.name, 'meshidx', meshidx);
         }
      }
   }

   rg.state |= VIEW_GROUP_STATE_FLAGS.IS_RENDERED; // Set state to 'Rendered'
   
   // // Render any sub groups // TODO:implement
   // for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {
   //    const sub_groupidx = view.sub_groups_idxs.buffer[i];
   //    View_render_from_view_NEW(sub_groupidx)
   // }
}
/** */
export function View_create_scissorbox(groupidx, mx, my, mw, mh) {

   const view = _view_buffer.buffer[groupidx];
   for (let k = 0; k <= view.vb.boundary; k++) { // Vertex Attribute Buffering.
      
      const vb_groupidx = view.vb.buffer[k].vb_groupidx;
      Vertex_buffer_group_create_scissorbox(vb_groupidx, mx, my, mw, mh);
   }

}
/** */
export function View_update_scissorbox(groupidx) {

   const view = _view_buffer.buffer[groupidx];
   for (let k = 0; k <= view.vb.boundary; k++) { // Vertex Attribute Buffering.
      
      const vb_groupidx = view.vb.buffer[k].vb_groupidx;
      Vertex_buffer_group_update_scissorbox(vb_groupidx);
   }

}


/** Reset the vertex buffers of a whole view group */
export function View_reset_rendering_buffer_whole_view_group(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

         const vb_groupidx = view.vb.buffer[i].vb_groupidx;
         const rg = view.vb.buffer[i].rg.buffer[j];

         Vertex_buffer_reset_to_index_NEW(vb_groupidx, rg.render_groupidx);
         rg.state &= ~VIEW_GROUP_STATE_FLAGS.IS_RENDERED; 

      }
   }
}
/** Reset the vertex buffers of a specific render group */
export function View_reset_rendering_buffer_specific_render_group(group_bufferidxs) {

   const groupidx = group_bufferidxs[0];
   const view_vbidx = group_bufferidxs[1];
   const view_rgidx = group_bufferidxs[2];
   
   const view = _view_buffer.buffer[groupidx];
   const vb_groupidx = view.vb.buffer[view_vbidx].vb_groupidx;
   const rg = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx];

   Vertex_buffer_reset_to_index_NEW(vb_groupidx, rg.render_groupidx);
   rg.state &= ~VIEW_GROUP_STATE_FLAGS.IS_RENDERED; 

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

      const view = _view_buffer.buffer[i];

      if(view) {

         const root = Mesh_buffer_get_mesh_byidx(view.rootidx);
         const root_name = (root) ? Mesh_get_name(root) : 'null'; 
         console.log('group:', i, 'root:', view.rootidx, 'name:', root_name);
         for (let j = 0; j <= view.vb.boundary; j++) {
   
            console.log(
               `  vbidx:${view.vb.buffer[j].vb_groupidx}`,
            );
   
            for (let k = 0; k <= view.vb.buffer[j].rg.boundary; k++) {
   
               const rg_root = Mesh_buffer_get_mesh_byidx(view.vb.buffer[j].rg.buffer[k].meshidxs.buffer[0]);
               const rg_root_name = (rg_root) ? Mesh_get_name(rg_root) : 'null';
               console.log(
                  `    rgroot:${rg_root_name}\n`,
                  `    rgidx:${view.vb.buffer[j].rg.buffer[k].render_groupidx}`,
                  `    start:${view.vb.buffer[j].rg.buffer[k].start}`,
                  `    num_faces:${view.vb.buffer[j].rg.buffer[k].num_faces}`,
                  '    meshidxs', view.vb.buffer[j].rg.buffer[k].meshidxs.buffer,
               );
            }
   
         }
      }
   }
}
/** */
export function View_buffer_print_roots() {
   const roots = View_get_all_root_mehes();
   console.log(roots)
}









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NEED RE_IMPLEMENTATION


/** Removes mesh and all mesh's children recursively */
export function View_remove_mesh_from_group(mesh) {

   // TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists

   const groupidx = mesh.group_bufferidxs[0];

   Remove_vb_data_from_view_recursive(mesh);

   for (let i = 0; i <= _view_buffer.buffer[groupidx].vb.boundary; i++) {

      const vbidx = _view_buffer.buffer[groupidx].vb.buffer[i].info[0]
      View_consolidate_buffer(groupidx, i);
      // console.log('Consolidating View buffer vb:', vbidx)
   }

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







// UNUSED

