"use strict";

import { Vertex_buffer_info_get_sid } from "../../../Graphics/Buffers/VertexBuffers";
import { Widget_root_gfx_get_structured } from "../../Core/MeshBuffer";

const DBG = false;



/****************************************************************************************************************************************************/
// FIND FROM WIDGET ROOT BUFFER
/****************************************************************************************************************************************************/


export function Find_gfx_match_widget_root_impl(root_bufferidx, target_sid){

   const igfx = {
      idxs: [INT_NULL, INT_NULL],
      FLAGS: GFX_CTX_FLAGS.NEW, // If no matching vertex buffer found, mark so that new buffer will be created
   };

   if(root_bufferidx === INT_NULL){
      console.warn('FAILED TO Find_gfx_match, widget_root is NULL.');
      return igfx;
   }

   // Find match from SID
   const gfx_idxs = Widget_root_gfx_get_structured(root_bufferidx);
   const len = gfx_idxs.length;

   for( let i=0; i<len; i++){

      const gfx_sid = Vertex_buffer_info_get_sid(gfx_idxs[i].vbidx); // Get the sid of the current gfx from the vertex buffer.

      if (SID.CheckSidMatch(target_sid, gfx_sid)) {
         
         igfx.idxs[0] = gfx_idxs[i].progidx;
         igfx.idxs[1] = gfx_idxs[i].vbidx;
         igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC; // If no matching vertex buffer found, new buffer must be created
         break;
      }

   }

   return igfx;

}




/****************************************************************************************************************************************************/
// FIND FROM TREE PARENT-CHILE: [SLOW]
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
function Find_match_from_children(mesh, parent){

   let igfx = {
      idxs: [INT_NULL, INT_NULL],
      FLAGS: GFX_CTX_FLAGS.NEW, // If no matching vertex buffer found, new buffer must be created
   }

   let done = false;
   // console.log('2')

   for (let i = 0; i < parent.children.boundary; i++) {

      const child = parent.children.buffer[i];

      if (child && child.gfx) {

         if (SID.CheckSidMatch(mesh.sid, child.sid)) {

            igfx.idxs[0] = child.gfx.prog.idx;
            igfx.idxs[1] = child.gfx.vb.idx;
            igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
            done = true;
            return {igfx:igfx, done:done};
         }
         else if(child.text_mesh && child.text_mesh.gfx && SID.CheckSidMatch(mesh.sid, child.text_mesh.sid)){
            igfx.idxs[0] = child.text_mesh.gfx.prog.idx;
            igfx.idxs[1] = child.text_mesh.gfx.vb.idx;
            igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
            done = true;
            return {igfx:igfx, done:done};
         }

         // Search recursively down the children tree
         if (!done && child.children.boundary) {
            // igfx = Find_match_from_children(mesh, child);
            const res = Find_match_from_children(mesh, child);
            // IMPORTANT: Must return since gfx index is found, else is going to search furthemore and probably will populate the igfx with INT_NULL again.
            if(res.done) return {igfx:res.igfx, done:res.done}; 
         }
      }
   }

   return {igfx:igfx, done:done};
}



export function Find_match_gfx_from_parent(mesh, parent) {

   const igfx = {
      idxs: [INT_NULL, INT_NULL],
      FLAGS: GFX_CTX_FLAGS.NEW, // If no matching vertex buffer found, new buffer must be created
   }
   let done = false;

   if (!parent) return {igfx:igfx, done:true}

   if (SID.CheckSidMatch(mesh.sid, parent.sid)) {
      igfx.idxs[0] = parent.gfx.prog.idx;
      igfx.idxs[1] = parent.gfx.vb.idx;
      igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC; // If no matching vertex buffer found, new buffer must be created
      done = true;
   }
   // Check if the parent has a text_mesh
   else if(parent.text_mesh && SID.CheckSidMatch(mesh.sid, parent.text_mesh.sid)){
      igfx.idxs[0] = parent.text_mesh.gfx.prog.idx;
      igfx.idxs[1] = parent.text_mesh.gfx.vb.idx;
      igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC; // If no matching vertex buffer found, new buffer must be created
      done = true;
   }
   
   return {igfx:igfx, done:done};
}



export function Find_match_gfx_from_parent_ascending(mesh, parent) {
   
   const res = Find_match_gfx_from_parent(mesh, parent)
   // console.log('1')

   if(!res.done && parent.parent) // Run recursively up the parent tree
      Find_match_gfx_from_parent_ascending(mesh, parent.parent)

   return res.igfx;
}



export function Find_match_gfx_from_parent_ascending_search_all(mesh, parent) {

   // console.log(mesh.id)
   let res = Find_match_gfx_from_parent(mesh, parent)
   
   if(!res.done) {
      
      res = Find_match_from_children(mesh, parent)

      if(!res.done && parent.parent) { // Run recursively 
         res.igfx = Find_match_gfx_from_parent_ascending_search_all(mesh, parent.parent)
      }
   }

   return res.igfx;
}



/*********************************************************************************************************************/
// OLDER

const RECT_FOUND = 0x1;
const TEXT_FOUND = 0x2;

export function Find_text_gfx_from_parent_ascending(FLAGS, mesh, parent) {

   if (!parent) return { progidx: INT_NULL, vbidx: INT_NULL };
   // Check if the parent has the same shader id, if not then there is no purpose ascend up the parent tree.
   if (!SID.CheckSidMatch(mesh.sid, parent.sid)) return { progidx: INT_NULL, vbidx: INT_NULL };

   /**
      If parent has text_mesh, use this gfxidx
      Else
      If has children
         If child has text_mesh
      Else
         If parent has parent, run recursively ascending
         
      If no gfxidx found, create NEW
    */

   let done = false;
   const igfx = { progidx: INT_NULL, vbidx: INT_NULL };

   if (parent.text_mesh) {
      /**DEBUG */ if (!parent.text_mesh.gfx) { console.error('parent.text_mesh.gfx is NULL.'); return null; }
      igfx.progidx = parent.text_mesh.gfx.prog.idx;
      igfx.progidx = parent.text_mesh.gfx.vb.idx;
      done = true;
      if (DEBUG.CONTEXT_FIND) console.log('$$ Parent has text_mesh', parent.GetName())
   }
   else {
      if (parent.children.boundary) {

         for (let i = 0; i < parent.children.boundary; i++) {

            const child = parent.children.buffer[i];
            if (DEBUG.CONTEXT_FIND) console.log('$$ Searching in children:', child.GetName())
            if (child && child.text) {

               /**DEBUG */ if (!child.text_mesh.gfx) { console.error('parent child.text_mesh.gfx is NULL.'); return null; }
               console.log('$$ child has text_mesh:', child.GetName())
               igfx.progidx = child.text_mesh.gfx.prog.idx;
               igfx.progidx = child.text_mesh.gfx.vb.idx;
               done = true;
            }
         }
      }
      else {
      }
   }

   if (!done && parent.parent) {
      if (DEBUG.CONTEXT_FIND) console.log('--- $$ Run recursive ascending:', parent.parent.GetName(), parent.parent.children)
      Find_text_gfx_from_parent_ascending(FLAGS, mesh, parent.parent)
   }

   return igfx
}



export function Find_gfx_from_parent_ascend_descend(mesh, parent, _igfx = null, temp) {

   if (DBG && !temp) console.log('\n\n-- NEW FUNCTION CALL --')

   let igfx = {

      text: {
         idxs: [INT_NULL, INT_NULL],
         FLAGS: GFX_CTX_FLAGS.NEW, // If no matching vertex buffer found, new buffer must be created
      },
      rect: {
         idxs: [INT_NULL, INT_NULL],
         FLAGS: GFX_CTX_FLAGS.NEW, // If no matching vertex buffer found, new buffer must be created
      }
   }

   let done = 0x0;

   // Carry any already found matches.
   if (_igfx && _igfx.rect.idxs[0] !== INT_NULL) {
      igfx.rect = _igfx.rect;
      done |= RECT_FOUND;
   }
   if (_igfx && _igfx.text.idxs[0] !== INT_NULL) {
      igfx.text = _igfx.text;
      done |= TEXT_FOUND;
   }

   if (parent) {

      // First check if parent sid matches the mesh's sid. 
      // NOTE: To avoid: the first child always create a new vertex buffer, although it could use the parent's vertex buffer. 
      if (!(done & RECT_FOUND) && SID.CheckSidMatch(mesh.sid, parent.sid)) {

         igfx.rect.idxs[0] = parent.gfx.prog.idx;
         igfx.rect.idxs[1] = parent.gfx.vb.idx;
         igfx.rect.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
         done |= RECT_FOUND;

         if (!(done & TEXT_FOUND) && mesh.text_mesh && parent.text_mesh) { // Case the parent has a text mesh, use that gfx buffers
            igfx.text.idxs[0] = parent.text_mesh.gfx.prog.idx;
            igfx.text.idxs[1] = parent.text_mesh.gfx.vb.idx;
            igfx.text.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
            done |= TEXT_FOUND;
         }

         if (done & RECT_FOUND && done & TEXT_FOUND) return igfx;
         if (DBG) console.log('123456 . ----------- | mesh:parent', mesh.GetName(), parent.GetName())
      }

      // Search all parent's children for matching gfx
      for (let i = 0; i < parent.children.boundary; i++) {

         const child = parent.children.buffer[i];

         if (child && child.gfx) {

            // Check for rect gfx
            if (!(done & RECT_FOUND) && SID.CheckSidMatch(mesh.sid, child.sid)) {

               igfx.rect.idxs[0] = child.gfx.prog.idx;
               igfx.rect.idxs[1] = child.gfx.vb.idx;
               igfx.rect.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
               done |= RECT_FOUND;
               if (DBG) console.log('0. ----------- | mesh:child', mesh.GetName(), child.GetName())
            }

            // Check for text gfx also
            const ret = Check_for_textgfx_in_mesh_combinatory(mesh, child);
            igfx.text = ret;

            if (ret.idxs[0] !== INT_NULL) {
               done |= TEXT_FOUND;
               if (ret.isMesh_text_mesh) done |= RECT_FOUND; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect))
               if (DBG) console.log(' *** FOUND BUFFERS FOR TEXT:', ret.idxs, '\nmesh:child', mesh.GetName(), child.GetName())
            }
         }

         // Run depth recursion for any children of child
         if (child.children.boundary) {
            igfx = Find_gfx_from_children_descending(mesh, child, igfx, done);
            if (igfx.text.idxs[0] !== INT_NULL) done |= TEXT_FOUND
         }

         if (done & RECT_FOUND && done & TEXT_FOUND)
            break; // If both gfxs are set, no need to continue the loop. 

         // Else continue until all children are checked
      }

      /**
       * If no gfx buffers found in parent OR among parent children, run recursively up the parent tree
       * // NOTE: For menu bar widgets works perfectly fine to store each menu bar in its own buffers. So the recursion up the tree is not necessary.
       */
      if (!(done & RECT_FOUND && done & TEXT_FOUND) && parent.parent) {
         if (DBG) console.log('-- RECURSIVE -- ')
         igfx = Find_gfx_from_parent_ascend_descend(mesh, parent.parent, igfx, true)
         if (DBG) console.log('-- RETURN RECURSIVE -- \n\n')
      }

   }

   /**DEBUG */ if (DBG && igfx.text.idxs[0] === INT_NULL) console.log('NO TEXT BUFFER FOUND. ----------- | mesh:parent', mesh.GetName(), parent.GetName());
   if (DBG) console.log()

   return igfx;
}



function Find_gfx_from_children_descending(mesh, parent, igfx, done) {

   for (let i = 0; i < parent.children.boundary; i++) {

      const child = parent.children.buffer[i];

      if (child && child.gfx) {

         // Check for rect gfx
         if (!(done & RECT_FOUND) && SID.CheckSidMatch(mesh.sid, child.sid)) {

            igfx.rect.idxs[0] = child.gfx.prog.idx;
            igfx.rect.idxs[1] = child.gfx.vb.idx;
            igfx.rect.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
            done |= RECT_FOUND;
            if (DBG) console.log('DESCENDING FOUND RECT GFX ----------- | mesh:child', mesh.GetName(), child.GetName())
         }

         // Check for text gfx also
         const ret = Check_for_textgfx_in_mesh_combinatory(mesh, child);

         if (ret.idxs[0] !== INT_NULL) {
            igfx.text = ret;
            done |= TEXT_FOUND;
            if (ret.isMesh_text_mesh) done |= RECT_FOUND; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect))
            if (DBG) console.log(' *** FOUND BUFFERS FOR TEXT:', ret.idxs, ' mesh:child', mesh.GetName(), child.GetName());
            break;
         }
         if (child.children.boundary) {
            igfx = Find_gfx_from_children_descending(mesh, child, igfx, done);
         }
      }
   }

   return igfx;

}



/**
 * Searches only for text gfx matching.
 * The combinatory nature comes from the fact that: 
 *    some meshes have text mesh as a variable directly in to their class,
 *    and some meshes have text mesh as child in the childrens buffer.
 * So all 4 combinations are checked.
 */
function Check_for_textgfx_in_mesh_combinatory(mesh, child) {

   const igfx = {
      idxs: [INT_NULL, INT_NULL],
      FLAGS: GFX_CTX_FLAGS.NEW, // If no matching vertex buffer found, new buffer must be created
      isMesh_text_mesh: false,
   }

   // Else check combinations
   if ((child.type & MESH_TYPES_DBG.TEXT_MESH) && ((mesh.type & MESH_TYPES_DBG.TEXT_MESH) || (mesh.type & MESH_TYPES_DBG.WIDGET_TEXT_DYNAMIC))) {

      if (SID.CheckSidMatch(mesh.sid, child.sid)) {
         igfx.idxs[0] = child.gfx.prog.idx;
         igfx.idxs[1] = child.gfx.vb.idx;
         igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

         igfx.isMesh_text_mesh = true; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect)

         if (DBG) console.log('1. ----------- | mesh:child', mesh.GetName(), child.GetName())
      }
   }
   else if (mesh.text_mesh && (child.type & MESH_TYPES_DBG.TEXT_MESH) && (!(mesh.type & MESH_TYPES_DBG.TEXT_MESH) && !(mesh.type & MESH_TYPES_DBG.WIDGET_TEXT_DYNAMIC))) {

      if (SID.CheckSidMatch(mesh.text_mesh.sid, child.sid)) {
         igfx.idxs[0] = child.gfx.prog.idx;
         igfx.idxs[1] = child.gfx.vb.idx;
         igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

         if (DBG) console.log('2. ----------- | mesh:child', mesh.GetName(), child.GetName())
      }
   }
   else if (child.text_mesh && !(child.type & MESH_TYPES_DBG.TEXT_MESH) && ((mesh.type & MESH_TYPES_DBG.TEXT_MESH) || (mesh.type & MESH_TYPES_DBG.WIDGET_TEXT_DYNAMIC))) {

      if (SID.CheckSidMatch(mesh.sid, child.text_mesh.sid)) {
         igfx.idxs[0] = child.text_mesh.gfx.prog.idx;
         igfx.idxs[1] = child.text_mesh.gfx.vb.idx;
         igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

         igfx.isMesh_text_mesh = true; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect)

         if (DBG) console.log('3. ----------- | mesh:child', mesh.GetName(), child.GetName())
      }
   }
   else if (!(child.type & MESH_TYPES_DBG.TEXT_MESH) && (!(mesh.type & MESH_TYPES_DBG.TEXT_MESH) && !(mesh.type & MESH_TYPES_DBG.WIDGET_TEXT_DYNAMIC))) {

      if (mesh.text_mesh && child.text_mesh) { // Make sure both meshes have text_mesh variable(may be just a rect mesh like 'section' mesh)

         if (SID.CheckSidMatch(mesh.text_mesh.sid, child.text_mesh.sid)) {
            igfx.idxs[0] = child.text_mesh.gfx.prog.idx;
            igfx.idxs[1] = child.text_mesh.gfx.vb.idx;
            igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

            if (DBG) console.log('4. ----------- | mesh:child', mesh.GetName(), child.GetName())
         }
      }
   }

   return igfx;
}



/*************************************************************************************************/

export function Find_textgfx_from_parent_descending(parent) {

   const mesh = parent;
   for (let i = 0; i < mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child && child.gfx) {

         if (child.type & MESH_TYPES_DBG.WIDGET_TEXT) {
            return child.gfx;
         }
         else if (child.text_mesh) {
            return child.text_mesh.gfx;
         }
      }

      // If no text gfx found in current child, run recursive descending.
      if (child.children.boundary) {
         const gfx = Find_textgfx_from_parent_descending(child);
         if (gfx) return gfx;
      }
   }

   return null;
}