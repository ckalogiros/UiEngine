"use strict";

import { Mesh_buffer_get_mesh_byidx, Widget_group_update_decrement, Widget_group_update_increment, Widget_root_buffer_get_byidx } from "../../Core/MeshBuffer";






/**
 * //TODOS
 * 
 * DONE! Implement correctly the clamp value as well as the threshold value
 * 
 * DONE! Where to store the first and last renderable meshes????
 * 
 * DONE! Who sets the clamp values for the scroller???
 * 
 * DONE! Fix the move of the scroller
 * 
 * DONE! Implement for more complex widgets. Needs recursion for children
 * DONE! Implement for more text 
 * 
 * Implement the move of the deactivated meshes once when they are active again 
 * 
 * What about none sroller meshes??? Do they need a different aproach???
 * 
 */


export function Clipy_from_widget_root(root_bufferidx) {

   let changes_hapened = false;
   const limit = { up: TEST_CLIP_TOP, down: TEST_CLIP_BOTTOM, }

   const root = Widget_root_buffer_get_byidx(root_bufferidx);
   for(let i=0; i<root.boundary; i++){

      const mesh     = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
      const top      = mesh.geom.pos[1] - mesh.geom.dim[1];
      const bottom   = mesh.geom.pos[1] + mesh.geom.dim[1];

      if(bottom < limit.up || top > limit.down){
         // if(mesh.state.mask & (MESH_STATE.ACTIVE | (~MESH_STATE.CLIPED_Y))){
         if(mesh.state.mask & MESH_STATE.ACTIVE && (mesh.state.mask & MESH_STATE.CLIPED_Y)===0){
            mesh.state.mask &= ~MESH_STATE.ACTIVE;
            mesh.state.mask |= MESH_STATE.CLIPED_Y;
            Widget_group_update_decrement(mesh.group_bufferidxs, mesh.geom.num_faces, mesh);
            // mesh.is_gfx_inserted = false
            changes_hapened = true;
            // console.log('Deactivate', mesh.GetName())
         }
      }
      else{
         if(mesh.state.mask & MESH_STATE.CLIPED_Y){
            // console.log('Activate', mesh.GetName())
            mesh.state.mask |= MESH_STATE.ACTIVE;
            mesh.state.mask &= ~MESH_STATE.CLIPED_Y;
            Widget_group_update_increment(mesh.group_bufferidxs, mesh.geom.num_faces, mesh);
            changes_hapened = true;
         }
      }
   }

   return changes_hapened;
}



export function Clipy_chunks_impl(mesh, clampY, renderables) {

   const DBG = false
   if (!mesh.StateCheck(MESH_STATE.HAS_CLIP) || !mesh.children.boundary) return;


   let changes_hapened = false;

   // UPPER CLAMP
   const first = mesh.children.buffer[renderables.first];
   const upper_deactivated = mesh.children.buffer[first.idx - 1]; // Get the mesh right before the first renderable
   const first_top = first.geom.pos[1] - first.geom.dim[1];

   // If the threshold from clmp value to limit is not big enough to fit the mesh, grow the threshold by mesh height + some padding 
   // const threshold = ((first.geom.dim[1]*2)>clampY[CLAMP.THRESHOLD]) ?  (first.geom.dim[1]*2)+100 : clampY[CLAMP.THRESHOLD];
   const threshold = clampY[CLAMP.THRESHOLD];
   const limit = {
      up: clampY[CLAMP.Y_UP] - threshold,
      down: clampY[CLAMP.Y_DOWN] + threshold,
      // up: TEST_CLIP_TOP - threshold,
      // down: TEST_CLIP_BOTTOM + threshold,
   }
   
   // DEACTIVATE: Handles the upper clamp value. ### Clamp 
   if (first_top < limit.up) { // NOTE: Avoid checking all meshes. Check only for the upper most mesh that is rendered.
      
      // Check only the first/upper mesh. If it's upper side is greater than the upper limit(clampy+threshold), deactivate all meshes between upper limit and clampy 
      if (first.state.mask & MESH_STATE.ACTIVE) {
         
         // console.log(threshold, limit, first_top)
         // Deactivate any mesh between the upper limit and clampy
         for (let i = first.idx; i < mesh.children.boundary; i++) {
            
            const child = mesh.children.buffer[i];
            const c_top = child.geom.pos[1] + child.geom.dim[1];
            
            if (c_top < clampY[CLAMP.Y_UP]) {  // Enable all meshes that are lower than the upper limit 
               // console.log('000000000000000000000000000000000')
               child.state.mask &= ~MESH_STATE.ACTIVE;
               // Widget_group_update_decrement(child.group_bufferidxs, child.geom.num_faces);
               if((child.state.mask & MESH_STATE.ACTIVE)) child.UpdateWidgetGroupDecrementNumFaces();
               if(DBG) console.log('REMOVE', child.mesh_bufferidx, child.GetName())
               child.gfx.vb.start = INT_NULL;
               changes_hapened = true;

               if (child.children.boundary) { // Run for all children widgets recursively
                  // Recurse_mesh_set_active(child, false); // Disable recursively
                  child.StateDisable(MESH_STATE.ACTIVE);
               }
            }
            else {
               // The next time this function will run to calculate the clamp, we need the upper most active mesh to check for upper limit or clamp up, 
               renderables.first = child.idx;  // The first child that hasn't been deactivated, set it as the new 'first' for the next call to this function.
               if(renderables.last<=renderables.first) renderables.last = renderables.first-1;  // To avoid the last mesh is higher that the first rendered mesh
               break;
            }
         }
      }
   }
   // ACTIVATE: Handles the upper limit. SEE ### Clamp
   else if (upper_deactivated && (upper_deactivated.state.mask & MESH_STATE.ACTIVE) === 0) {
      // Activate any deactivated mesh if it's position is greater than the clampy

      // If mesh's bottom side greater than clamp y up
      if (upper_deactivated.geom.pos[1] + upper_deactivated.geom.dim[1] > clampY[CLAMP.Y_UP]) {
         for (let i = upper_deactivated.idx; i >= 0; i--) {

            const child = mesh.children.buffer[i];
            const c_top = child.geom.pos[1] - child.geom.dim[1];
            if (c_top > limit.up) {  // Enable all meshes that are below the upper limit 
               child.state.mask |= MESH_STATE.ACTIVE;
               if((child.state.mask & MESH_STATE.ACTIVE)===0) child.UpdateWidgetGroupIncrementNumFaces();
               if(DBG)console.log('ADD', child.mesh_bufferidx, child.GetName())
               changes_hapened = true;

               if (child.children.active_count) { // Run for all children widgets recursively
                  // Recurse_mesh_set_active(child, true); // Disable recursively
                  child.StateEnable(MESH_STATE.ACTIVE);
               }

               renderables.first = child.idx;
               if(renderables.last<=renderables.first)renderables.last = renderables.first+1; // To avoid the last mesh is higher that the first rendered mesh
            }
         }
      }
   }
   /////////////////////////////////////////////////////////////
   // LOWER SCROLLED SECTION CLAMP 
   // There is a case where a widget has a large height and the first is deactivated the last is't at the point where it should be rendered,
   // so the first deactivates and advances to the next mesh but the last stays the same. If it happened to be: last = first, 
   // then the first points to a mesh that is lower than the last. On the next call to this function tha first is last.idx+1 resulting in not drawing the last mesh.
   if(renderables.last < renderables.first) renderables.last = renderables.first; // If the fisrt mesh is lower than the last, 
   const last = mesh.children.buffer[renderables.last];
   var lower_deactivated = mesh.children.buffer[last.idx]; // Get the last renderable
   const last_bottom = last.geom.pos[1] + last.geom.dim[1];

   // DEACTIVATE: Handles the lower clamp value. SEE ### Clamp
   if (last_bottom > limit.down) { // NOTE: Avoid checking all meshes. Check only for the lower most mesh that is rendered.

      if (last.state.mask & MESH_STATE.ACTIVE) 
      {

         /**DEBUG*/ if (last.idx === last.root_idx) console.error('The last meshs idx references the scenes mesh buffer and not the parents children buffer')

         // Deactivate any mesh between the upper limit and clampy
         for (let i = last.idx; i >= 0; i--) {

            const child = mesh.children.buffer[i];
            const c_top = child.geom.pos[1] - child.geom.dim[1];
            // const c_bottom = child.geom.pos[1] + child.geom.dim[1];
            if (c_top > clampY[CLAMP.Y_DOWN]) {  // Disable all meshes that are higher than the lower limit 
               child.state.mask &= ~MESH_STATE.ACTIVE;
               // Widget_group_update_decrement(child.group_bufferidxs, child.geom.num_faces)
               if((child.state.mask & MESH_STATE.ACTIVE)) child.UpdateWidgetGroupDecrementNumFaces();
               if(DBG)console.log('REMOVE', child.mesh_bufferidx, child.GetName())
               child.gfx.vb.start = INT_NULL;
               changes_hapened = true;

               if (child.children.active_count) { // Run for all children widgets recursively
                  // Recurse_mesh_set_active(child, false); // Disable recursively
                  child.StateDisable(MESH_STATE.ACTIVE);
               }
            }
            else {
               // The next time this function will run to calculate the clamp, we need the lower most active mesh to check for lower limit or clamp down, 
               renderables.last = child.idx; // The first child that hasn't been deactivated, set it as the new 'last' for the next call to this function.
               break;
            }
         }
      }
   }
   // ACTIVATE: Handles the lower limit. SEE ### Clamp
   // else if (lower_deactivated && (lower_deactivated.state.mask & MESH_STATE.ACTIVE) === 0) {
   else if (lower_deactivated) {
      // Activate any deactivated mesh if it's position is greater than the clampy
      const lower_bottom = lower_deactivated.geom.pos[1] + lower_deactivated.geom.dim[1]; 

      // If mesh's bottom side is above the clamp y down, activate all childrem from last to limit.down
      if (lower_bottom < clampY[CLAMP.Y_DOWN]) {
         for (let i = lower_deactivated.idx; i < mesh.children.boundary; i++) {

            const child = mesh.children.buffer[i];
            const c_bottom = child.geom.pos[1] + child.geom.dim[1];

               if (c_bottom < limit.down){ // Enable all meshes that are higher than the lower limit 
               child.state.mask |= MESH_STATE.ACTIVE;
               if((child.state.mask & MESH_STATE.ACTIVE)===0) child.UpdateWidgetGroupIncrementNumFaces();
               if(DBG)console.log('ADD', child.mesh_bufferidx, child.GetName())
               changes_hapened = true;

               // Run for all children widgets recursively
               if (child.children.active_count) {
                  // Disable recursively
                  // Recurse_mesh_set_active(child, true);
                  child.StateEnable(MESH_STATE.ACTIVE);
               }

               renderables.last = child.idx;
            }
         }
      }
   }

   // TEMP_TEST_PERFORMANE_COUNTERS.MISC = `total:${total_count}, removed:${count1}, added:${count2}`;

   return changes_hapened;
}


function Recurse_mesh_set_active(mesh, flag_activate) {

   for (let i = 0; i < mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {

         if (flag_activate) {
            child.state.mask |= MESH_STATE.ACTIVE;
            // child.StateEnable(MESH_STATE.ACTIVE);
            // child.UpdateWidgetGroupIncrementNumFaces();
         }
         else {
            // child.StateDisable(MESH_STATE.ACTIVE);
            child.state.mask &= ~MESH_STATE.ACTIVE;
            // child.StateDisable(MESH_STATE.ACTIVE);
            // child.UpdateWidgetGroupDecrementNumFaces();
         }
      }

      // Run recursive
      if (child.children.boundary) {
         Recurse_mesh_set_active(child, flag_activate)
      }
   }
}






/**
 * This function runs through children of mesh type:Section,
 * and removes children that are located above (upper clamped chunk)
 * and below (lower clamped chunk) positional (in pixels) limits.
 * Stores the removed meshes to a buffer, and also stores 
 * the first-last mesh indexes for the upper chunk as well as
 * for the lower chunk.
 * 
 * Returns the removed meshes buffer and the first-last
 *  mesh indexes for both the upper and lower chunks.
 */
export function Clamp_y_remove_children_FIRST_TIME_CLAMP(section, upper_limit, lower_limit) {

   // The first and last meshes of scrolled section after been clamped.
   let firstupper = 0, lastupper = INT_NULL, firstlower = INT_NULL, lastlower = INT_NULL;

   let cnt = 0;
   for (let i = 0; i < section.children.boundary; i++) {

      const child = section.children.buffer[i];
      const top = child.geom.pos[1] - child.geom.dim[1];
      const bottom = child.geom.pos[1] + child.geom.dim[1];

      if(child.mesh_bufferidx === 365)
      console.log()

      if (bottom <= upper_limit) {

         // child.Deactivate();
         // child.state.mask |= MESH_STATE.CLIPED_Y
         // child.StateDisable(MESH_STATE.ACTIVE|MESH_STATE.CLIPED_Y)
         child.StateDisable(MESH_STATE.ACTIVE)
         child.StateEnable(MESH_STATE.CLIPED_Y)
         
         if (firstupper === INT_NULL) firstupper = i;
      }
      else if (top >= lower_limit) {
         
         // child.Deactivate();
         // child.state.mask |= MESH_STATE.CLIPED_Y
         // child.StateDisable(MESH_STATE.ACTIVE|MESH_STATE.CLIPED_Y)
         child.StateDisable(MESH_STATE.ACTIVE)
         child.StateEnable(MESH_STATE.CLIPED_Y)
         
         if (firstlower === INT_NULL) {
            firstlower = i;
         }
      }
      else { // The mesh is inside limits
         
         // child.Activate();
         // child.state.mask &= ~MESH_STATE.CLIPED_Y
         // child.StateEnable(MESH_STATE.ACTIVE|MESH_STATE.CLIPED_Y)
         child.StateEnable(MESH_STATE.ACTIVE)
         child.StateDisable(MESH_STATE.CLIPED_Y)
         console.log(child.GetName(), child.state.mask)

         if (lastupper === INT_NULL) {
            lastupper = i;
         }
      }
   }

   return {
      firstupper: firstupper,
      lastupper: lastupper,
      firstlower: firstlower,
      lastlower: lastlower,
   };
}


/**SAVE */
// export function Clamp_y_remove_children_FIRST_TIME_CLAMP(section, clampy) {

//    // The first and last meshes of scrolled section after been clamped.
//    let firstupper = INT_NULL, lastupper = INT_NULL, firstlower = INT_NULL, lastlower = INT_NULL;
//    const clamped_buffer = []; // Store the removed children


//    let cnt = 0;
//    for (let i = 0; i < section.children.boundary; i++) {

//       const child = section.children.buffer[i];
//       const top = child.geom.pos[1] - child.geom.dim[1];
//       const bottom = child.geom.pos[1] + child.geom.dim[1];

//       if (bottom <= clampy.upper_limit) {

//          clamped_buffer[cnt++] = child; // Store children to a temp buffer, in order to restore them back after .Render().
//          // section.children.RemoveByIdx(i);
//          child.state.mask &= ~MESH_STATE.ACTIVE;
         
//          if (firstupper === INT_NULL) firstupper = i;
//       }
//       else if (top >= clampy.lower_limit) {
         
//          clamped_buffer[cnt++] = child; // Store children to a temp buffer, in order to restore them back after .Render().
//          // section.children.RemoveByIdx(i);
//          child.state.mask &= ~MESH_STATE.ACTIVE;
         
//          if (firstlower === INT_NULL) {
//             firstlower = i;
//             // 1. This clamp is running on mesh initialization, so we need only one chunk, the upper one
//             // 2. Store the lower border of the renderable area chunk. This is when the first mesh outside the renderable chunk has been reached
//             clampy.upper_chunk.lower_border = bottom;
//             clampy.upper_chunk.lower_meshidx = i;
//          }
//       }
//       else { // The mesh is inside limits
//          child.state.mask |= MESH_STATE.ACTIVE;
//          if (lastupper === INT_NULL) {
//             lastupper = i;
//             // 1. Store the upper border of the renderable area chunk. This is when the first mesh inside the renderable chunk has been reached
//             clampy.upper_chunk.upper_border = top;
//             clampy.upper_chunk.upper_meshidx = i;
//          }
//       }
//    }

//    clampy.both_chunks_active = false;

//    return {
//       firstupper: firstupper,
//       lastupper: lastupper,
//       firstlower: firstlower,
//       lastlower: lastlower,
//       clamped_buffer: clamped_buffer
//    };
// }