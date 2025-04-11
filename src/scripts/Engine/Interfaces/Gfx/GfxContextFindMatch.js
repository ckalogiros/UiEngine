"use strict";

import { Sid_check_match } from "../../../GlobalFunctions.js";
import { Vertex_buffer_group_get_sid, Vertex_buffer_group_get_texidx } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer.js";
import { Mesh_unif_get_vb_root_wpos_has_absolute_pos } from "../../Core/MeshUniformsBuffer.js";
import { Root_group_vbidx_view_get } from "../../Core/Views/RootView.js";
import { Mesh_get_name } from "../../Drawables/Operations/MeshPropertiesFunctions.js";




const GFX_CONEXT_DEBUG = false;




/****************************************************************************************************************************************************/
// Graphics Generation Function
/****************************************************************************************************************************************************/

export function Find_gfx_match_from_mesh_tree(FLAGS, mesh, _vb_groupidx = null) {


   let vb_groupidx = INT_NULL;

   // If a parent is set, use gfx_ctx_parent as parent
   const parent = (mesh.gfx_ctx_parent !== INT_NULL) ? Mesh_buffer_get_mesh_byidx(mesh.gfx_ctx_parent) : mesh.parent;

   if(mesh.gfx_ctx_parent === null) alert('11111111111111111')


   // If 'PRIVATE' then one of the folowing FLAGS shouuld be also present
   if (FLAGS & GFX_CTX_FLAGS.PRIVATE) {

      if (FLAGS & GFX_CTX_FLAGS.FROM_ROOT_WIDGET) {
         vb_groupidx = Find_gfx_match_widget_root_impl(mesh.root_bufferidx, mesh.sid, mesh.mat.texidx, FLAGS&GFX_CTX_FLAGS.ABSOLUTE_POSITION);
      }
      else if (FLAGS & GFX_CTX_FLAGS.FROM_PARENT_ASC) {

         if (parent === null) {

            if (GFX_CONEXT_DEBUG) console.warn('NO parent exists for mesh to generate gfx.\nRevert to generate from root buffer. mesh:', Mesh_get_name(mesh), mesh);

            // Case the mesh is a text mesh, and there is a gfx buffer to be found, then because we dont have access to any parent mesh we would rather call to find a match from the root buffer.   
            if (mesh.type & MESH_TYPE.WIDGET_TEXT || mesh.type & MESH_TYPE.TEXT_MESH) {
               vb_groupidx = Find_gfx_match_widget_root_impl(mesh.root_bufferidx, mesh.sid, mesh.mat.texidx, FLAGS&GFX_CTX_FLAGS.ABSOLUTE_POSITION);
            }
         }
         else {
            vb_groupidx = Find_match_gfx_from_parent_ascending(mesh, mesh.parent);
         }
      }
      else if(FLAGS & GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL) {

         // The difference of 'FROM_PARENT_ASC_SEARCH_ALL' with 'FROM_ROOT_WIDGET' 
         // is that the search is from lower tree nodes to root.  

         if (vb_groupidx === INT_NULL) { // search all ascending-descending(children) until root is reached.
            vb_groupidx = Find_match_gfx_from_parent_ascending_search_all(mesh, mesh.parent);
         }
      }
      else if (FLAGS & GFX_CTX_FLAGS.FROM_PARENT_DSC) {
         if(parent) vb_groupidx = Find_match_gfx_from_parent_descending_search_all(mesh, parent)
      }
      else {
         console.error(
            'NO CORRECT GenGfxCtx FLAG found for generating gfx.\nProbably forgot to pass one of the flags \'FROM_ROOT_WIDGET, FROM_PARENT_ASC, FROM_PARENT_CHILDREN_DESC, ...\'',
            'mesh', Mesh_get_name(mesh), 'parent',
            // 'mesh', mesh.GetName(), 'parent', parent.GetName(),
         );
      }
   }
   else if (FLAGS & GFX_CTX_FLAGS.SPECIFIC) {

      /**
       * Case SPECIFIC is passed for 1 kind of mesh and not for all meshes of the widget.
       * Example: Widget_Label may have spesific _vb_groupidx for the rect area but not for the text.
       * We distinguish this case by having the _vb_groupidx param as being null,
       * and we re-call this function so that we search for any text gfx without the FLAG:SPECIFIC.
       */
      // Check the passed _vb_groupidx params if they are valid gfx indexes
      if (_vb_groupidx !== null) {
         
            // We need to have knowledge if the meshes of the vb stored, have absolute position or not
            // const has_vb_absolute_pos = Mesh_unif_get_vb_root_wpos_has_absolute_pos(i);

            if(_vb_groupidx !== INT_NULL && Sid_check_match(mesh.sid, Vertex_buffer_group_get_sid(_vb_groupidx) === true)) {
               if (GFX_CONEXT_DEBUG) console.error('INCORRECT _vb_groupidx passed for generating SPECIFIC gfx.\n_gfxidxs:', _vb_groupidx);

               // Check also if mesh has texture and the texidx matches the vb group's texidx
               const texidx = Vertex_buffer_group_get_texidx(_vb_groupidx);
               if(texidx === mesh.mat.texidx){
                  vb_groupidx = _vb_groupidx;
            }
         }
         else {
            // For text meshes, find any match from the root.   
            if (mesh.type & MESH_TYPE.WIDGET_TEXT || mesh.type & MESH_TYPE.TEXT_MESH) {
               vb_groupidx = Find_gfx_match_widget_root_impl(mesh.root_bufferidx, mesh.sid, mesh.mat.texidx, FLAGS&GFX_CTX_FLAGS.ABSOLUTE_POSITION);
            }
            else vb_groupidx = Find_gfx_match_from_mesh_tree(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, mesh, _vb_groupidx); // HACK: we explicitly pass FLAGS that are hard coded.
         }
      }
      else { // If for some reason fails, re-call recursively this function to resolve
         // We need to pass different flags, to avoid infinite loop, since the _vb_groupidx are always null
         vb_groupidx = Find_gfx_match_from_mesh_tree(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, mesh, _vb_groupidx); // HACK: we explicitly pass FLAGS that are hard coded.
      }
   }


   return vb_groupidx;
}







/****************************************************************************************************************************************************/
// FIND FROM WIDGET ROOT BUFFER
/****************************************************************************************************************************************************/


function Find_gfx_match_widget_root_impl(root_bufferidx, target_sid, mesh_texidx, mesh_has_absolute_pos=0x0) {

   let found_vb_groupidx = INT_NULL;

   if (root_bufferidx === INT_NULL) {
      if (GFX_CONEXT_DEBUG) console.warn('FAILED TO Find_gfx_match, widget_root is NULL.');
      return INT_NULL;
   }

   // Find match from SID
   const gfx_idxs = Root_group_vbidx_view_get(root_bufferidx);

   for (let i = 0; i <= gfx_idxs.boundary; i++) {

      const vb_groupidx = gfx_idxs.buffer[i];
      const gfx_sid = Vertex_buffer_group_get_sid(vb_groupidx); // Get the sid of the current gfx from the vertex buffer.


               
      // We need to have knowledge if the meshes of the vb stored, have absolute position or not
      const has_vb_absolute_pos = Mesh_unif_get_vb_root_wpos_has_absolute_pos(i);

      if((mesh_has_absolute_pos === has_vb_absolute_pos) && Sid_check_match(target_sid, gfx_sid)) {

         // Check also if mesh has texture and the texidx matches the vb group's texidx
         const texidx = Vertex_buffer_group_get_texidx(vb_groupidx);
         if(texidx === mesh_texidx){
            found_vb_groupidx = vb_groupidx;
            break;
         }         
      }

   }

   return found_vb_groupidx;

}






/****************************************************************************************************************************************************/
// FIND FROM TREE PARENT-CHILD: [SLOW]
/****************************************************************************************************************************************************/

/**
 * // IMPORTANT: Implement search of parents children children.
 * Case: 
 *    1. section -> has section -> has label. This text mesh alocates a new vertex buffer 
 *    2. section -> has section -> has label. This text must use the text gfx buffer of the previous sections label widget
 *    So instead of only searching parent's children, we must:
 *    After searching all parent's children,
 *    going up all the parens tree, if still no buffer found,
 *    we must search each parent's children down the tree (very inefficient)
 * 
 *    Another much faster way could be:
 *    Find any vertex matching vertex buffer that is inUse, and check if any of the meshes
 *    belonging to the vertex buffer, have common ancestor with the mesh we want to generate the gfx context for.
 */
function Find_match_from_children(mesh, parent) {

   let vb_groupidx = INT_NULL;

   let done = false;

   for (let i = 0; i <= parent.children.boundary; i++) {

      const child = parent.children.buffer[i];

      
      if (child && child.gfx) {

         
         if((Sid_check_match(mesh.sid, child.sid))) {
            
            const absolute_pos_match = (mesh.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION) === (child.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION)
            // Check also if mesh has texture and the texidx matches the vb group's texidx
            const texidx = Vertex_buffer_group_get_texidx(child.gfx.vb.groupidx);
            if(texidx === mesh.mat.texidx && absolute_pos_match!==0){
               vb_groupidx = child.gfx.vb.groupidx;
               done = true;
               return { vb_groupidx: vb_groupidx, done: done };
            }
            
         }
         else if (child.text_mesh && child.text_mesh.gfx && Sid_check_match(mesh.sid, child.text_mesh.sid)) {
            
            const absolute_pos_match = (mesh.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION) === (child.text_mesh.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION)
            // Check also if mesh has texture and the texidx matches the vb group's texidx
            const texidx = Vertex_buffer_group_get_texidx(child.text_mesh.gfx.vb.groupidx);
            if(texidx === mesh.mat.texidx && absolute_pos_match!==0){
               vb_groupidx = child.text_mesh.gfx.vb.groupidx;
               done = true;
               return { vb_groupidx: vb_groupidx, done: done };
            }
         }
         // Search recursively down the children tree
         if (!done && child.children.boundary !== INT_NULL) {
            const res = Find_match_from_children(mesh, child);
            // IMPORTANT: Must return since gfx index is found, else is going to search furthemore and probably will populate the vb_groupidx with INT_NULL again.
            if (res.done) return { vb_groupidx: res.vb_groupidx, done: res.done };
         }
      }

   }

   return { vb_groupidx: vb_groupidx, done: done };
}



function Find_match_gfx_from_parent(mesh, parent) {

   let vb_groupidx = INT_NULL;
   let done = false;

   if (!parent || !parent.gfx) return { vb_groupidx: vb_groupidx, done: true }

   
   if(Sid_check_match(mesh.sid, parent.sid)) {
      
      const absolute_pos_match = (mesh.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION) === (parent.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION);   
      // Check also if mesh has texture and the texidx matches the vb group's texidx
      const texidx = Vertex_buffer_group_get_texidx(parent.gfx.vb.groupidx);
      if(texidx === mesh.mat.texidx && absolute_pos_match!==0){
         vb_groupidx = parent.gfx.vb.groupidx;
         done = true;
      } 
   }
   // Check if the parent has a text_mesh
   // Below we avoid a cyclical dependecy: If the mesh is a text mesh, the the parent.text_mesh is the mesh its self, so maybe this couuld cause problems 
   else if (parent.text_mesh && parent !== mesh.parent && Sid_check_match(mesh.sid, parent.text_mesh.sid)) {
      
      const absolute_pos_match = (mesh.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION) === (parent.text_mesh.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION);   
      // Check also if mesh has texture and the texidx matches the vb group's texidx
      const texidx = Vertex_buffer_group_get_texidx(parent.text_mesh.gfx.vb.groupidx);
      if(texidx === mesh.mat.texidx && absolute_pos_match!==0){
         vb_groupidx = parent.text_mesh.gfx.vb.groupidx;
         done = true;
      }
   }


   return { vb_groupidx: vb_groupidx, done: done };
}



function Find_match_gfx_from_parent_ascending(mesh, parent) {

   const ret = Find_match_gfx_from_parent(mesh, parent)

   if (!ret.done && parent.parent) // Run recursively up the parent tree
      Find_match_gfx_from_parent_ascending(mesh, parent.parent)

   return ret.vb_groupidx;
}



function Find_match_gfx_from_parent_ascending_search_all(mesh, parent) {

   let ret = Find_match_gfx_from_parent(mesh, parent)

   if (!ret.done) {

      ret = Find_match_from_children(mesh, parent)

      if (!ret.done && parent.parent) { // Run recursively 
         ret.vb_groupidx = Find_match_gfx_from_parent_ascending_search_all(mesh, parent.parent)
      }
   }

   return ret.vb_groupidx;
}



function Find_match_gfx_from_parent_descending_search_all(mesh, parent) {

   
   // If the mesh match the parent sid, use parent's gfx buffer
   if (Sid_check_match(mesh.sid, parent.sid)) {

      // In case mesh is the parent mesh, obviously we haven't created yet any gfx, so return -1 in order to create new vertex buffer
      if (mesh === parent) return INT_NULL;

      const absolute_pos_match = (mesh.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION) === (parent.gfx_ctx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION);   

      // Check also if mesh has texture and the texidx matches the vb group's texidx
      const texidx = Vertex_buffer_group_get_texidx(parent.gfx.vb.groupidx);
      if(texidx === mesh.mat.texidx && absolute_pos_match){
         let vb_groupidx = parent.gfx.vb.groupidx;
         return vb_groupidx;
      }

   }

   // Else search in parent's children recursively
   let ret = Find_match_from_children(mesh, parent);
   return ret.vb_groupidx;
}


