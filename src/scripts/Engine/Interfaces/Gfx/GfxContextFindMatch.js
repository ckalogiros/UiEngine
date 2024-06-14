"use strict";

import { Vertex_buffer_exists_from_index, Vertex_buffer_group_get_sid } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Widget_root_gfx_get_all_vb_groupidx } from "../../Core/MeshBuffer.js";




const GFX_CONEXT_DEBUG = false;




/****************************************************************************************************************************************************/
// Graphicks Generation Function
/****************************************************************************************************************************************************/

/** Check buffers validity, or find buffers based on Flags */
// TODO: the flags are anecessary, just return [prog, vb, and maybe ib]
export function Find_gfx_match_from_mesh_tree(FLAGS, mesh, _vb_groupidx = null) {


   let vb_groupidx = INT_NULL;

   // If a parent is set, use gfx_ctx_parent as parent
   const parent = (mesh.gfx_ctx_parent) ? mesh.gfx_ctx_parent : mesh.parent;


   // If 'PRIVATE' then one of the folowing FLAGS shouuld be also present
   if (FLAGS & GFX_CTX_FLAGS.PRIVATE) {

      if (FLAGS & GFX_CTX_FLAGS.FROM_ROOT_WIDGET) {
         vb_groupidx = Find_gfx_match_widget_root_impl(mesh.root_bufferidx, mesh.sid);
      }
      else if (FLAGS & GFX_CTX_FLAGS.FROM_PARENT_ASC) {

         if (parent === null) {
            console.warn(parent)
            if(GFX_CONEXT_DEBUG) console.warn('NO parent exists for mesh to generate gfx.\nRevert to generate from root buffer. mesh:', mesh.GetName(), mesh);
         
            // Case the mesh is a text mesh, and there is a gfx buffer to be found, then because we dont have access to any parent mesh we would rather call to find a match from the root buffer.   
            if (mesh.type & MESH_TYPE.WIDGET_TEXT || mesh.type & MESH_TYPE.TEXT_MESH) {
               vb_groupidx = Find_gfx_match_widget_root_impl(mesh.root_bufferidx, mesh.sid);
            }
         }
         else {
            
            vb_groupidx = Find_match_gfx_from_parent_ascending(mesh, mesh.parent);
            
            if (vb_groupidx === INT_NULL) { // Fallback to search all ascending-descending until root is reached.
               vb_groupidx = Find_match_gfx_from_parent_ascending_search_all(mesh, mesh.parent);
            }
         }
      }
      else if (FLAGS & GFX_CTX_FLAGS.FROM_PARENT_DSC) {
         vb_groupidx = Find_match_gfx_from_parent_descending_search_all(mesh, parent)
      }
      else {
         // console.warn(mesh.parent.GetName())
         console.error('NO CORRECT GenGfxCtx FLAG found for generating gfx.\nProbably forgot to pass one of the flags \'FROM_ROOT_WIDGET, FROM_PARENT_ASC, FROM_PARENT_CHLDREN_DESC, ...\'');
         alert('SEE console.error');
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
         // if (_vb_groupidx === INT_NULL || SID.CheckSidMatch(mesh.sid, Vertex_buffer_group_get_sid(_vb_groupidx)===false)) {
         if (_vb_groupidx !== INT_NULL && SID.CheckSidMatch(mesh.sid, Vertex_buffer_group_get_sid(_vb_groupidx)===true)) {
            if(GFX_CONEXT_DEBUG) console.error('NO CORRECT _vb_groupidx passed for generating SPECIFIC gfx.\n_gfxidxs:', _vb_groupidx);
            vb_groupidx = _vb_groupidx;
         }
         else {
            // if (Program_program_exists_from_index(_vb_groupidx) && Vertex_buffer_exists_from_index(_vb_groupidx)) {
               vb_groupidx = Find_gfx_match_from_mesh_tree(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC, mesh, _vb_groupidx); // HACK: we explicitly pass FLAGS that are hard coded.
            if (Vertex_buffer_exists_from_index(_vb_groupidx)) {
                  
            }
         }
      }
      else { // If for some reason fails, re-call recursive this to resolve
         // igfx = Find_gfx_match_from_mesh_tree(FLAGS, mesh, _vb_groupidx);
         // We need to pass different flags, to avoid infinite loop, since the _vb_groupidx are always null
         vb_groupidx = Find_gfx_match_from_mesh_tree(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC, mesh, _vb_groupidx); // HACK: we explicitly pass FLAGS that are hard coded.
      }
   }




   return vb_groupidx;
}







/****************************************************************************************************************************************************/
// FIND FROM WIDGET ROOT BUFFER
/****************************************************************************************************************************************************/


function Find_gfx_match_widget_root_impl(root_bufferidx, target_sid) {

   let found_vb_groupidx = INT_NULL;

   if (root_bufferidx === INT_NULL) {
      if(GFX_CONEXT_DEBUG) console.warn('FAILED TO Find_gfx_match, widget_root is NULL.');
      return INT_NULL;
   }

   // Find match from SID
   const gfx_idxs = Widget_root_gfx_get_all_vb_groupidx(root_bufferidx);
   
   for (let i = 0; i <= gfx_idxs.boundary; i++) {
      
      const vb_groupidx = gfx_idxs.buffer[i];
      const gfx_sid = Vertex_buffer_group_get_sid(vb_groupidx); // Get the sid of the current gfx from the vertex buffer.

      if (SID.CheckSidMatch(target_sid, gfx_sid)) {

         found_vb_groupidx = vb_groupidx;
         break;
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

         if (SID.CheckSidMatch(mesh.sid, child.sid)) {

            // igfx[0] = child.gfx.prog.idx;
            vb_groupidx = child.gfx.vb.groupidx;
            done = true;
            return { vb_groupidx: vb_groupidx, done: done };
         }
         else if (child.text_mesh && child.text_mesh.gfx && SID.CheckSidMatch(mesh.sid, child.text_mesh.sid)) {
            // igfx[0] = child.text_mesh.gfx.prog.idx;
            vb_groupidx = child.text_mesh.gfx.vb.groupidx;
            done = true;
            return { vb_groupidx: vb_groupidx, done: done };
         }

         // Search recursively down the children tree
         if (!done && child.children.boundary) {
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

   if (SID.CheckSidMatch(mesh.sid, parent.sid)) {
      // igfx[0] = parent.gfx.prog.idx;
      vb_groupidx = parent.gfx.vb.groupidx;
      done = true;
   }
   // Check if the parent has a text_mesh
   // CAUTION
   // BUG: We changed the text meshes to have a parent. 
   // Below we avoid a cyclical dependecy: If the mesh is a text mesh, the the parent.text_mesh is the mesh its self,
   // so maybe this couuld cause problems 
   else if (parent.text_mesh && parent !== mesh.parent && SID.CheckSidMatch(mesh.sid, parent.text_mesh.sid)) {
      if(parent.text_mesh.gfx===null)
         console.log()
      // igfx[0] = parent.text_mesh.gfx.prog.idx;
      vb_groupidx = parent.text_mesh.gfx.vb.groupidx;
      done = true;
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
   if (SID.CheckSidMatch(mesh.sid, parent.sid)) {

      // In case mesh is the parent mesh, obviusly we haven't created yet any gfx, so return -1 in order to create new vertex buffer
      if(mesh === parent) return INT_NULL;

      let vb_groupidx = parent.gfx.vb.groupidx;
      return vb_groupidx;
   }

   // Else search in parent's children recursively
   let ret = Find_match_from_children(mesh, parent);
   return ret.vb_groupidx;
}



/*********************************************************************************************************************/
// OLDER - DO NOT DELETE YET

// const RECT_FOUND = 0x1;
// const TEXT_FOUND = 0x2;

// function Find_text_gfx_from_parent_ascending(FLAGS, mesh, parent) {

//    if (!parent) return { progidx: INT_NULL, vbidx: INT_NULL };
//    // Check if the parent has the same shader id, if not then there is no purpose ascend up the parent tree.
//    if (!SID.CheckSidMatch(mesh.sid, parent.sid)) return { progidx: INT_NULL, vbidx: INT_NULL };

//    /**
//       If parent has text_mesh, use this gfxidx
//       Else
//       If has children
//          If child has text_mesh
//       Else
//          If parent has parent, run recursively ascending
         
//       If no gfxidx found, create NEW
//     */

//    let done = false;
//    let igfx = [INT_NULL, INT_NULL];

//    if (parent.text_mesh) {
//       /**DEBUG */ if (!parent.text_mesh.gfx) { console.error('parent.text_mesh.gfx is NULL.'); return null; }
//       igfx[0] = parent.text_mesh.gfx.prog.idx;
//       igfx[1] = parent.text_mesh.gfx.vb.groupidx;
//       done = true;
//       if (DEBUG.CONTEXT_FIND) console.log('$$ Parent has text_mesh', parent.GetName())
//    }
//    else {
//       if (parent.children.boundary) {

//          for (let i = 0; i <= parent.children.boundary; i++) {

//             const child = parent.children.buffer[i];
//             if (DEBUG.CONTEXT_FIND) console.log('$$ Searching in children:', child.GetName())
//             if (child && child.text) {

//                /**DEBUG */ if (!child.text_mesh.gfx) { console.error('parent child.text_mesh.gfx is NULL.'); return null; }
//                console.log('$$ child has text_mesh:', child.GetName())
//                igfx[0] = child.text_mesh.gfx.prog.idx;
//                igfx[1] = child.text_mesh.gfx.vb.groupidx;
//                done = true;
//             }
//          }
//       }
//       else {
//       }
//    }

//    if (!done && parent.parent) {
//       if (DEBUG.CONTEXT_FIND) console.log('--- $$ Run recursive ascending:', parent.parent.GetName(), parent.parent.children)
//       Find_text_gfx_from_parent_ascending(FLAGS, mesh, parent.parent)
//    }

//    return igfx
// }


/** */
// function Find_gfx_from_parent_ascend_descend(mesh, parent, _igfx = null, temp) {

//    if (DBG && !temp) console.log('\n\n-- NEW FUNCTION CALL --')

//    let igfx = [INT_NULL, INT_NULL];

//    let done = 0x0;

//    // Carry any already found matches.
//    if (_igfx && _igfx.rect.idxs[0] !== INT_NULL) {
//       igfx.rect = _igfx.rect;
//       done |= RECT_FOUND;
//    }
//    if (_igfx && _igfx.text.idxs[0] !== INT_NULL) {
//       igfx.text = _igfx.text;
//       done |= TEXT_FOUND;
//    }

//    if (parent) {

//       // First check if parent sid matches the mesh's sid. 
//       // NOTE: To avoid: the first child always create a new vertex buffer, although it could use the parent's vertex buffer. 
//       if (!(done & RECT_FOUND) && SID.CheckSidMatch(mesh.sid, parent.sid)) {

//          igfx.rect.idxs[0] = parent.gfx.prog.idx;
//          igfx.rect.idxs[1] = parent.gfx.vb.groupidx;
//          igfx.rect.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
//          done |= RECT_FOUND;

//          if (!(done & TEXT_FOUND) && mesh.text_mesh && parent.text_mesh) { // Case the parent has a text mesh, use that gfx buffers
//             igfx.text.idxs[0] = parent.text_mesh.gfx.prog.idx;
//             igfx.text.idxs[1] = parent.text_mesh.gfx.vb.groupidx;
//             igfx.text.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
//             done |= TEXT_FOUND;
//          }

//          if (done & RECT_FOUND && done & TEXT_FOUND) return igfx;
//          if (DBG) console.log('123456 . ----------- | mesh:parent', mesh.GetName(), parent.GetName())
//       }

//       // Search all parent's children for matching gfx
//       for (let i = 0; i <= parent.children.boundary; i++) {

//          const child = parent.children.buffer[i];

//          if (child && child.gfx) {

//             // Check for rect gfx
//             if (!(done & RECT_FOUND) && SID.CheckSidMatch(mesh.sid, child.sid)) {

//                igfx.rect.idxs[0] = child.gfx.prog.idx;
//                igfx.rect.idxs[1] = child.gfx.vb.groupidx;
//                igfx.rect.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
//                done |= RECT_FOUND;
//                if (DBG) console.log('0. ----------- | mesh:child', mesh.GetName(), child.GetName())
//             }

//             // Check for text gfx also
//             const ret = Check_for_textgfx_in_mesh_combinatory(mesh, child);
//             igfx.text = ret;

//             if (ret.idxs[0] !== INT_NULL) {
//                done |= TEXT_FOUND;
//                if (ret.isMesh_text_mesh) done |= RECT_FOUND; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect))
//                if (DBG) console.log(' *** FOUND BUFFERS FOR TEXT:', ret.idxs, '\nmesh:child', mesh.GetName(), child.GetName())
//             }
//          }

//          // Run depth recursion for any children of child
//          if (child.children.boundary) {
//             igfx = Find_gfx_from_children_descending(mesh, child, igfx, done);
//             if (igfx.text.idxs[0] !== INT_NULL) done |= TEXT_FOUND
//          }

//          if (done & RECT_FOUND && done & TEXT_FOUND)
//             break; // If both gfxs are set, no need to continue the loop. 

//          // Else continue until all children are checked
//       }

//       /**
//        * If no gfx buffers found in parent OR among parent children, run recursively up the parent tree
//        * // NOTE: For menu bar widgets works perfectly fine to store each menu bar in its own buffers. So the recursion up the tree is not necessary.
//        */
//       if (!(done & RECT_FOUND && done & TEXT_FOUND) && parent.parent) {
//          if (DBG) console.log('-- RECURSIVE -- ')
//          igfx = Find_gfx_from_parent_ascend_descend(mesh, parent.parent, igfx, true)
//          if (DBG) console.log('-- RETURN RECURSIVE -- \n\n')
//       }

//    }

//    /**DEBUG */ if (DBG && igfx.text.idxs[0] === INT_NULL) console.log('NO TEXT BUFFER FOUND. ----------- | mesh:parent', mesh.GetName(), parent.GetName());
//    if (DBG) console.log()

//    return igfx;
// }


/** */
// function Find_gfx_from_children_descending(mesh, parent, igfx, done) {

//    for (let i = 0; i <= parent.children.boundary; i++) {

//       const child = parent.children.buffer[i];

//       if (child && child.gfx) {

//          // Check for rect gfx
//          if (!(done & RECT_FOUND) && SID.CheckSidMatch(mesh.sid, child.sid)) {

//             igfx.rect.idxs[0] = child.gfx.prog.idx;
//             igfx.rect.idxs[1] = child.gfx.vb.groupidx;
//             igfx.rect.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
//             done |= RECT_FOUND;
//             if (DBG) console.log('DESCENDING FOUND RECT GFX ----------- | mesh:child', mesh.GetName(), child.GetName())
//          }

//          // Check for text gfx also
//          const ret = Check_for_textgfx_in_mesh_combinatory(mesh, child);

//          if (ret.idxs[0] !== INT_NULL) {
//             igfx.text = ret;
//             done |= TEXT_FOUND;
//             if (ret.isMesh_text_mesh) done |= RECT_FOUND; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect))
//             if (DBG) console.log(' *** FOUND BUFFERS FOR TEXT:', ret.idxs, ' mesh:child', mesh.GetName(), child.GetName());
//             break;
//          }
//          if (child.children.boundary) {
//             igfx = Find_gfx_from_children_descending(mesh, child, igfx, done);
//          }
//       }
//    }

//    return igfx;

// }



/**
 * Searches only for text gfx matching.
 * The combinatory nature comes from the fact that: 
 *    some meshes have text mesh as a variable directly in to their class,
 *    and some meshes have text mesh as child in the childrens buffer.
 * So all 4 combinations are checked.
 */
// function Check_for_textgfx_in_mesh_combinatory(mesh, child) {

//    let igfx = [INT_NULL, INT_NULL];

//    // Else check combinations
//    if ((child.type & MESH_TYPE.TEXT_MESH) && ((mesh.type & MESH_TYPE.TEXT_MESH) || (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC))) {

//       if (SID.CheckSidMatch(mesh.sid, child.sid)) {
//          igfx[0] = child.gfx.prog.idx;
//          igfx[1] = child.gfx.vb.groupidx;
//          // igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

//          igfx.isMesh_text_mesh = true; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect)

//          if (DBG) console.log('1. ----------- | mesh:child', mesh.GetName(), child.GetName())
//       }
//    }
//    else if (mesh.text_mesh && (child.type & MESH_TYPE.TEXT_MESH) && (!(mesh.type & MESH_TYPE.TEXT_MESH) && !(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC))) {

//       if (SID.CheckSidMatch(mesh.text_mesh.sid, child.sid)) {
//          igfx[0] = child.gfx.prog.idx;
//          igfx[1] = child.gfx.vb.groupidx;
//          // igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

//          if (DBG) console.log('2. ----------- | mesh:child', mesh.GetName(), child.GetName())
//       }
//    }
//    else if (child.text_mesh && !(child.type & MESH_TYPE.TEXT_MESH) && ((mesh.type & MESH_TYPE.TEXT_MESH) || (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC))) {

//       if (SID.CheckSidMatch(mesh.sid, child.text_mesh.sid)) {
//          igfx[0] = child.text_mesh.gfx.prog.idx;
//          igfx[1] = child.text_mesh.gfx.vb.groupidx;
//          // igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

//          igfx.isMesh_text_mesh = true; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect)

//          if (DBG) console.log('3. ----------- | mesh:child', mesh.GetName(), child.GetName())
//       }
//    }
//    else if (!(child.type & MESH_TYPE.TEXT_MESH) && (!(mesh.type & MESH_TYPE.TEXT_MESH) && !(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC))) {

//       if (mesh.text_mesh && child.text_mesh) { // Make sure both meshes have text_mesh variable(may be just a rect mesh like 'section' mesh)

//          if (SID.CheckSidMatch(mesh.text_mesh.sid, child.text_mesh.sid)) {
//             igfx[0] = child.text_mesh.gfx.prog.idx;
//             igfx[1] = child.text_mesh.gfx.vb.groupidx;
//             // igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

//             if (DBG) console.log('4. ----------- | mesh:child', mesh.GetName(), child.GetName())
//          }
//       }
//    }

//    return igfx;
// }



/*************************************************************************************************/

// function Find_textgfx_from_parent_descending(parent) {

//    const mesh = parent;
//    for (let i = 0; i <= mesh.children.boundary; i++) {

//       const child = mesh.children.buffer[i];
//       if (child && child.gfx) {

//          if (child.type & MESH_TYPE.WIDGET_TEXT) {
//             return child.gfx;
//          }
//          else if (child.text_mesh) {
//             return child.text_mesh.gfx;
//          }
//       }

//       // If no text gfx found in current child, run recursive descending.
//       if (child.children.boundary) {
//          const gfx = Find_textgfx_from_parent_descending(child);
//          if (gfx) return gfx;
//       }
//    }

//    return null;
// }