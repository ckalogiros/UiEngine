"use strict";

import { Vertex_buffer_exists_from_index, Vertex_buffer_info_get_sid } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Program_program_exists_from_index } from "../../../Graphics/ShaderPrograms.js";
import { Widget_root_gfx_get_structured } from "../../Core/MeshBuffer.js";




const GFX_CONEXT_DEBUG = false;




/****************************************************************************************************************************************************/
// Graphicks Generation Function
/****************************************************************************************************************************************************/

/** Check buffers validity, or find buffers based on Flags */
// TODO: the flags are anecessary, just return [prog, vb, and maybe ib]
export function Generate_graphics_context(FLAGS, mesh, gfxidxs = null) {


   let igfx = [INT_NULL, INT_NULL];


   // If 'PRIVATE' then one of the folowing FLAGS shouuld be also present
   if (FLAGS & GFX_CTX_FLAGS.PRIVATE) {

      if (FLAGS & GFX_CTX_FLAGS.FROM_ROOT_WIDGET) {
         igfx = Find_gfx_match_widget_root_impl(mesh.root_bufferidx, mesh.sid);
      }
      else if (FLAGS & GFX_CTX_FLAGS.FROM_PARENT_ASC) {

         if (mesh.parent === INT_NULL) {
            if(GFX_CONEXT_DEBUG) console.warn('NO parent exists for mesh to generate gfx.\nRevert to generate from root buffer. mesh:', mesh.GetName(), mesh);

            // Case the mesh is a text mesh, and there is a gfx buffer to be found, then because we dont have access to any parent mesh we would rather call to find a match from the root buffer.   
            if (mesh.type & MESH_TYPE.WIDGET_TEXT || mesh.type & MESH_TYPE.TEXT_MESH) {
               igfx = Find_gfx_match_widget_root_impl(mesh.root_bufferidx, mesh.sid);
            }
         }
         else {

            igfx = Find_match_gfx_from_parent_ascending(mesh, mesh.parent);

            if (igfx[0] === INT_NULL) { // Fallback to search all ascending-descending until root is reached.
               igfx = Find_match_gfx_from_parent_ascending_search_all(mesh, mesh.parent);
            }
         }


      }
      else {
         console.error('NO CORRECT GenGfxCtx FLAG found for generating gfx.\nProbably forgot to pass one of the flags \'FROM_ROOT_WIDGET, FROM_PARENT_ASC, FROM_PARENT_CHLDREN_DESC, ...\'');
         alert('SEE console.error');
      }
   }
   else if (FLAGS & GFX_CTX_FLAGS.SPECIFIC) {

      /**
       * Case SPECIFIC is passed for 1 kind of mesh and not for all meshes of the widget.
       * Example: Widget_Label may have spesific gfxidxs for the rect area but not for the text.
       * We distinguish this case by having the gfxidxs param as being null,
       * and we re-call this function so that we search for any text gfx without the FLAG:SPECIFIC.
       */
      // Check the passed gfxidxs params if they are valid gfx indexes
      if (gfxidxs !== null) {
         if (gfxidxs[0] === INT_NULL || gfxidxs[1] === INT_NULL || SID.CheckSidMatch(mesh.sid, Vertex_buffer_info_get_sid(gfxidxs[1]))===false) {
            if(GFX_CONEXT_DEBUG) console.error('NO CORRECT gfxidxs passed for generating SPECIFIC gfx.\n_gfxidxs:', gfxidxs);
            igfx = Generate_graphics_context(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC, mesh, gfxidxs); // HACK: we explicitly pass FLAGS that are hard coded.
         }
         else {
            if (Program_program_exists_from_index(gfxidxs[0]) && Vertex_buffer_exists_from_index(gfxidxs[1])) {
               
               igfx[0] = gfxidxs[0];
               igfx[1] = gfxidxs[1];
            }
         }
      }
      else { // If for some reason fails, re-call recursive this to resolve
         // igfx = Generate_graphics_context(FLAGS, mesh, gfxidxs);
         // We need to pass different flags, to avoid infinite loop, since the gfxidxs are always null
         igfx = Generate_graphics_context(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC, mesh, gfxidxs); // HACK: we explicitly pass FLAGS that are hard coded.
      }
   }




   return igfx;
}







/****************************************************************************************************************************************************/
// FIND FROM WIDGET ROOT BUFFER
/****************************************************************************************************************************************************/


function Find_gfx_match_widget_root_impl(root_bufferidx, target_sid) {

   let igfx = [INT_NULL, INT_NULL];

   if (root_bufferidx === INT_NULL) {
      if(GFX_CONEXT_DEBUG) console.warn('FAILED TO Find_gfx_match, widget_root is NULL.');
      return igfx;
   }

   // Find match from SID
   const gfx_idxs = Widget_root_gfx_get_structured(root_bufferidx);
   const len = gfx_idxs.length;

   for (let i = 0; i < len; i++) {

      const gfx_sid = Vertex_buffer_info_get_sid(gfx_idxs[i].vbidx); // Get the sid of the current gfx from the vertex buffer.

      if (SID.CheckSidMatch(target_sid, gfx_sid)) {

         igfx[0] = gfx_idxs[i].progidx;
         igfx[1] = gfx_idxs[i].vbidx;
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
function Find_match_from_children(mesh, parent) {

   let igfx = [INT_NULL, INT_NULL];

   let done = false;

   for (let i = 0; i <= parent.children.boundary; i++) {

      const child = parent.children.buffer[i];

      if (child && child.gfx) {

         if (SID.CheckSidMatch(mesh.sid, child.sid)) {

            igfx[0] = child.gfx.prog.idx;
            igfx[1] = child.gfx.vb.idx;
            done = true;
            return { igfx: igfx, done: done };
         }
         else if (child.text_mesh && child.text_mesh.gfx && SID.CheckSidMatch(mesh.sid, child.text_mesh.sid)) {
            igfx[0] = child.text_mesh.gfx.prog.idx;
            igfx[1] = child.text_mesh.gfx.vb.idx;
            done = true;
            return { igfx: igfx, done: done };
         }

         // Search recursively down the children tree
         if (!done && child.children.boundary) {
            const res = Find_match_from_children(mesh, child);
            // IMPORTANT: Must return since gfx index is found, else is going to search furthemore and probably will populate the igfx with INT_NULL again.
            if (res.done) return { igfx: res.igfx, done: res.done };
         }
      }
   }

   return { igfx: igfx, done: done };
}



function Find_match_gfx_from_parent(mesh, parent) {

   let igfx = [INT_NULL, INT_NULL];
   let done = false;

   if (!parent || !parent.gfx) return { igfx: igfx, done: true }

   if (SID.CheckSidMatch(mesh.sid, parent.sid)) {
      igfx[0] = parent.gfx.prog.idx;
      igfx[1] = parent.gfx.vb.idx;
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
      igfx[0] = parent.text_mesh.gfx.prog.idx;
      igfx[1] = parent.text_mesh.gfx.vb.idx;
      done = true;
   }

   return { igfx: igfx, done: done };
}



function Find_match_gfx_from_parent_ascending(mesh, parent) {

   const res = Find_match_gfx_from_parent(mesh, parent)

   if (!res.done && parent.parent) // Run recursively up the parent tree
      Find_match_gfx_from_parent_ascending(mesh, parent.parent)

   return res.igfx;
}



function Find_match_gfx_from_parent_ascending_search_all(mesh, parent) {

   let res = Find_match_gfx_from_parent(mesh, parent)

   if (!res.done) {

      res = Find_match_from_children(mesh, parent)

      if (!res.done && parent.parent) { // Run recursively 
         res.igfx = Find_match_gfx_from_parent_ascending_search_all(mesh, parent.parent)
      }
   }

   return res.igfx;
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
//       igfx[1] = parent.text_mesh.gfx.vb.idx;
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
//                igfx[1] = child.text_mesh.gfx.vb.idx;
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
//          igfx.rect.idxs[1] = parent.gfx.vb.idx;
//          igfx.rect.FLAGS = GFX_CTX_FLAGS.SPECIFIC;
//          done |= RECT_FOUND;

//          if (!(done & TEXT_FOUND) && mesh.text_mesh && parent.text_mesh) { // Case the parent has a text mesh, use that gfx buffers
//             igfx.text.idxs[0] = parent.text_mesh.gfx.prog.idx;
//             igfx.text.idxs[1] = parent.text_mesh.gfx.vb.idx;
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
//                igfx.rect.idxs[1] = child.gfx.vb.idx;
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
//             igfx.rect.idxs[1] = child.gfx.vb.idx;
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
//          igfx[1] = child.gfx.vb.idx;
//          // igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

//          igfx.isMesh_text_mesh = true; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect)

//          if (DBG) console.log('1. ----------- | mesh:child', mesh.GetName(), child.GetName())
//       }
//    }
//    else if (mesh.text_mesh && (child.type & MESH_TYPE.TEXT_MESH) && (!(mesh.type & MESH_TYPE.TEXT_MESH) && !(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC))) {

//       if (SID.CheckSidMatch(mesh.text_mesh.sid, child.sid)) {
//          igfx[0] = child.gfx.prog.idx;
//          igfx[1] = child.gfx.vb.idx;
//          // igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

//          if (DBG) console.log('2. ----------- | mesh:child', mesh.GetName(), child.GetName())
//       }
//    }
//    else if (child.text_mesh && !(child.type & MESH_TYPE.TEXT_MESH) && ((mesh.type & MESH_TYPE.TEXT_MESH) || (mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC))) {

//       if (SID.CheckSidMatch(mesh.sid, child.text_mesh.sid)) {
//          igfx[0] = child.text_mesh.gfx.prog.idx;
//          igfx[1] = child.text_mesh.gfx.vb.idx;
//          // igfx.FLAGS = GFX_CTX_FLAGS.SPECIFIC;

//          igfx.isMesh_text_mesh = true; // NOTE: To avoid the non breaking of the for loop keep searching for the .rect buffers, if the mesh is only text(with no rect)

//          if (DBG) console.log('3. ----------- | mesh:child', mesh.GetName(), child.GetName())
//       }
//    }
//    else if (!(child.type & MESH_TYPE.TEXT_MESH) && (!(mesh.type & MESH_TYPE.TEXT_MESH) && !(mesh.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC))) {

//       if (mesh.text_mesh && child.text_mesh) { // Make sure both meshes have text_mesh variable(may be just a rect mesh like 'section' mesh)

//          if (SID.CheckSidMatch(mesh.text_mesh.sid, child.text_mesh.sid)) {
//             igfx[0] = child.text_mesh.gfx.prog.idx;
//             igfx[1] = child.text_mesh.gfx.vb.idx;
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