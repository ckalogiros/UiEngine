"use strict";

import { Mesh_buffer_get_mesh_byidx } from "../../Core/MeshBuffer.js";
import { View_get_view_byidx } from "../../Core/MeshBufferViews.js";









export function Clampx_from_group(group_bufferidx=null, clip_left=null, clip_right=null) {

   let changes_hapened = false;
   const limit = (clip_right) ? { left: clip_left, right: clip_right, } : { left: TEST_CLIP_LEFT, right: TEST_CLIP_RIGHT, }

   const group = View_get_view_byidx(group_bufferidx);

   for(let i=0; i<=group.vb.boundary; i++){
   
      const meshshes_idx = group.vb.buffer[i].data;
      const exept_on_resize_meshidx = 1;
      for(let j=0; j <= meshshes_idx.boundary; j++){
         
         const mesh = Mesh_buffer_get_mesh_byidx(meshshes_idx.buffer[j]);
         
         // We run for all meshes of the group so that on scoll every mesh is clipped

         // Case for text meshes
         if(mesh.type & MESH_TYPE.TEXT_MESH){

            mesh.ClipX(limit.right-10)
         }
         else{
            
            const right  = mesh.GetPosX() + mesh.geom.defDim[0]*2;
            const reduce = (right) - limit.right;
            alert('CORRECT THIS:\nmesh.geom.pos[0] + mesh.geom.defDim[0]\n At Clip.js')
            // TODO: Also check all 'mesh.geom.pos'
            const def_right   = mesh.geom.pos[0] + mesh.geom.defDim[0];


            if(right > limit.right){
               
               mesh.geom.dim[0] -= reduce/2;
               mesh.geom.pos[0] -= reduce/2;
               
               mesh.state.mask |= MESH_STATE.CLIPED_X;

               changes_hapened = true;
   
            }
            else if(right < def_right){ // if mesh right < mesh default dim

               mesh.geom.dim[0] -= reduce/2;
               mesh.geom.pos[0] -= reduce/2;
               
               // Case we surpass the default width.
               if(mesh.geom.dim[0] > mesh.geom.defDim[0]){

                  mesh.geom.pos[0] -= mesh.geom.dim[0] - mesh.geom.defDim[0];
                  mesh.geom.dim[0] = mesh.geom.defDim[0];
               }

               mesh.state.mask &= ~MESH_STATE.CLIPED_X;
               changes_hapened = true;
            }
         }
      }
   }


   return changes_hapened;
}



export function Clipx_from_group(group_bufferidx=null, clip_left=null, clip_right=null) {

   let changes_hapened = false;
   const limit = (clip_left && clip_right) ? { left: clip_left, right: clip_right, } : { left: TEST_CLIP_TOP, right: TEST_CLIP_BOTTOM, }

   const group = View_get_view_byidx(group_bufferidx);

   for(let i=0; i <= group.vb.boundary; i++){
   
      const meshshes_idx = group.vb.buffer[i].data;
      for(let j=0; j<=meshshes_idx.boundary; j++){
         
         const mesh    = Mesh_buffer_get_mesh_byidx(meshshes_idx.buffer[j]);
         const left    = mesh.GetPosX();
         const right   = left + mesh.geom.dim[0]*2;
   
         if(right < limit.left){

            if(mesh.state.mask & MESH_STATE.ACTIVE && (mesh.state.mask & MESH_STATE.CLIPED_X)===0){

               mesh.state.mask &= ~MESH_STATE.ACTIVE;
               mesh.state.mask |= MESH_STATE.CLIPED_X;
               changes_hapened = true;
            }
         }
         else{
            
            if(mesh.state.mask & MESH_STATE.CLIPED_X){
            
               mesh.state.mask |= MESH_STATE.ACTIVE;
               mesh.state.mask &= ~MESH_STATE.CLIPED_X;
               changes_hapened = true;
            }
         }
      }
   }


   return changes_hapened;
}



export function Clipy_from_group(group_bufferidx=null, clip_top=null, clip_bottom=null) {

   let changes_hapened = false;
   const limit = (clip_top!==null && clip_bottom!==null) ? { up: clip_top, down: clip_bottom, } : { up: TEST_CLIP_TOP, down: TEST_CLIP_BOTTOM, }

   const group = View_get_view_byidx(group_bufferidx);
   
   for(let i=0; i <= group.vb.boundary; i++){
      
      const meshshes_idx = group.vb.buffer[i].data;
      const root_group_mesh     = Mesh_buffer_get_mesh_byidx(meshshes_idx.buffer[0]);
      const root_wposy = root_group_mesh.GetPosY(); // Get the root wpos from each vb root mesh, no need to get the root wpos for every group mesh.
   
      for(let j=0; j <= meshshes_idx.boundary; j++){
         
         const mesh     = Mesh_buffer_get_mesh_byidx(meshshes_idx.buffer[j]);
         const top      = root_wposy + mesh.geom.pos[1];
         const bottom   = top + mesh.geom.dim[1]*2;
         
   
         if(bottom < limit.up || top > limit.down){

            // if(mesh.state.mask & MESH_STATE.ACTIVE && (mesh.state.mask & MESH_STATE.CLIPED_Y)===0){
            if(mesh.state.mask & MESH_STATE.ACTIVE){

               mesh.state.mask &= ~MESH_STATE.ACTIVE;
               mesh.state.mask |= MESH_STATE.CLIPED_Y;
               changes_hapened = true;
            }
         }
         else{
            
            if(mesh.state.mask & MESH_STATE.CLIPED_Y)
            {
            
               mesh.state.mask |= MESH_STATE.ACTIVE;
               mesh.state.mask &= ~MESH_STATE.CLIPED_Y;
               changes_hapened = true;
            }
         }

      }

   }


   return changes_hapened;
}



export function Clipy_from_tree_recursive(mesh=null, clip_top=null, clip_bottom=null) {

   if(mesh.options && (mesh.options & SECTION.INDEPENDENT)) return;

   let changes_hapened = false;
   const limit = (clip_top!==null && clip_bottom!==null) ? { up: clip_top, down: clip_bottom, } : { up: TEST_CLIP_TOP, down: TEST_CLIP_BOTTOM, }



   const top      = mesh.GetPosY();
   const bottom   = top + mesh.geom.dim[1]*2;

   if((bottom <= limit.down && bottom > limit.up) || (top >= limit.up && top < limit.down)){
      // Clip for any children. Only if this mesh is active, else skip
      for(let i=0; i <= mesh.children.boundary; i++){
         const child = mesh.children.buffer[i];
         Clipy_from_tree_recursive(child, clip_top, clip_bottom);
      }
   }

   if(bottom < limit.up || top > limit.down){
      
      if(mesh.state.mask & MESH_STATE.ACTIVE){
   
         mesh.StateDisable(MESH_STATE.ACTIVE);
         mesh.StateEnable(MESH_STATE.CLIPED_Y);
         changes_hapened = true;
      }
   }
   else{
      
      if(mesh.state.mask & MESH_STATE.CLIPED_Y)
      {
         mesh.StateEnable(MESH_STATE.ACTIVE);
         mesh.StateDisable(MESH_STATE.CLIPED_Y);
         changes_hapened = true;
      }
   }

   return changes_hapened;
}



export function Clampy_from_group(group_bufferidx=null, clip_top=null, clip_bottom=null) {


   let changes_hapened = false;
   const limit = (clip_bottom) ? { top: clip_top, bottom: clip_bottom, } : { top: TEST_CLIP_LEFT, bottom: TEST_CLIP_RIGHT, }

   const group = View_get_view_byidx(group_bufferidx);

   for(let i=0; i<=group.vb.boundary; i++){
   
      const meshshes_idx = group.vb.buffer[i].data;
      for(let j=0; j <= meshshes_idx.boundary; j++){
         
         const mesh    = Mesh_buffer_get_mesh_byidx(meshshes_idx.buffer[j]);
         
         // We run for all meshes of the group so that on scoll every mesh is clipped
            alert('clip.js')
         const bottom   = mesh.geom.pos[1] + mesh.geom.dim[1];
         const def_bottom   = mesh.geom.pos[1] + mesh.geom.defDim[1];

         if(bottom > limit.bottom){
            
            const reduce = (bottom) - limit.bottom;
            mesh.geom.dim[1] -= reduce/2;
            mesh.geom.pos[1] -= reduce/2;
            
            mesh.state.mask |= MESH_STATE.CLIPED_X;

            changes_hapened = true;

         }
         else if(bottom < def_bottom){ // if mesh bottom < mesh default dim

            const reduce = (bottom) - limit.bottom;
            mesh.geom.dim[1] -= reduce/2;
            mesh.geom.pos[1] -= reduce/2;
            
            mesh.state.mask |= MESH_STATE.CLIPED_X;
            changes_hapened = true;
         }
      }
   }


   return changes_hapened;
}



export function Clipy_one_mesh(mesh=null, clip_top=null, clip_bottom=null){

   const limit = (clip_top && clip_bottom) ? { up: clip_top, down: clip_bottom, } : { up: TEST_CLIP_TOP, down: TEST_CLIP_BOTTOM, }

   
   const top      = mesh.geom.pos[1] - mesh.geom.dim[1];
   const bottom   = mesh.geom.pos[1] + mesh.geom.dim[1];
   

   if(bottom < limit.up || top > limit.down){

      if(mesh.state.mask & MESH_STATE.ACTIVE){

         // Because we dont run from group or root buffer, we need to deactivate any meshe's children (from class).
         // BUG: We need a class method for setting 'CLIPED_Y', else the children meshes will no be activated on a clipy(this or any other clipy function)
         mesh.Deactivate();
         mesh.state.mask |= MESH_STATE.CLIPED_Y;
         // console.log(mesh.mesh_bufferidx, mesh.state.mask & MESH_STATE.ACTIVE)
      }
   }
   else{
      
      if(mesh.state.mask & MESH_STATE.CLIPED_Y)
      {
         
         mesh.Activate();
         mesh.state.mask &= ~MESH_STATE.CLIPED_Y;
      }
   }
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
   }
   
   // DEACTIVATE: Handles the upper clamp value. ### Clamp 
   if (first_top < limit.up) { // NOTE: Avoid checking all meshes. Check only for the upper most mesh that is rendered.
      
      // Check only the first/upper mesh. If it's upper side is greater than the upper limit(clampy+threshold), deactivate all meshes between upper limit and clampy 
      if (first.state.mask & MESH_STATE.ACTIVE) {
         
         // Deactivate any mesh between the upper limit and clampy
         for (let i = first.idx; i <= mesh.children.boundary; i++) {
            
            const child = mesh.children.buffer[i];
            const c_top = child.geom.pos[1] + child.geom.dim[1];
            
            if (c_top < clampY[CLAMP.Y_UP]) {  // Enable all meshes that are lower than the upper limit 

               child.state.mask &= ~MESH_STATE.ACTIVE;
               // Widget_group_update_decrement(child.group_bufferidxs, child.geom.num_faces);
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
      if (lower_bottom <= clampY[CLAMP.Y_DOWN]) {
         for (let i = lower_deactivated.idx; i <= mesh.children.boundary; i++) {

            const child = mesh.children.buffer[i];
            const c_bottom = child.geom.pos[1] + child.geom.dim[1];

               if (c_bottom < limit.down){ // Enable all meshes that are higher than the lower limit 
               child.state.mask |= MESH_STATE.ACTIVE;

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

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {

         if (flag_activate) {
            child.state.mask |= MESH_STATE.ACTIVE;
         }
         else {
            child.state.mask &= ~MESH_STATE.ACTIVE;
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
export function Clamp_y_remove_children_FIRST_TIME_CLAMP(section, clip_top=null, clip_bottom=null) {

   if(!clip_top)
      clip_top =  TEST_CLIP_TOP; 
   if(!clip_bottom)
      clip_bottom = TEST_CLIP_BOTTOM;

   // The first and last meshes of scrolled section after been clamped.
   let firstupper = 0, lastupper = INT_NULL, firstlower = INT_NULL, lastlower = INT_NULL;

   for (let i = 0; i <= section.children.boundary; i++) {

      const child = section.children.buffer[i];
      const top = child.geom.pos[1] - child.geom.dim[1];
      const bottom = child.geom.pos[1] + child.geom.dim[1];

      if (bottom <= clip_top) {

         // child.Deactivate();
         // child.state.mask |= MESH_STATE.CLIPED_Y
         // child.StateDisable(MESH_STATE.ACTIVE|MESH_STATE.CLIPED_Y)
         child.StateDisable(MESH_STATE.ACTIVE)
         child.StateEnable(MESH_STATE.CLIPED_Y)
         
         if (firstupper === INT_NULL) firstupper = i;
      }
      else if (top >= clip_bottom) {
         
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
//    for (let i = 0; i <= section.children.boundary; i++) {

//       const child = section.children.buffer[i];
//       const top = child.geom.pos[1] - child.geom.dim[1];
//       const bottom = child.geom.pos[1] + child.geom.dim[1];

//       if (bottom <= clampy.clip_top) {

//          clamped_buffer[cnt++] = child; // Store children to a temp buffer, in order to restore them back after .Render().
//          // section.children.RemoveByIdx(i);
//          child.state.mask &= ~MESH_STATE.ACTIVE;
         
//          if (firstupper === INT_NULL) firstupper = i;
//       }
//       else if (top >= clampy.clip_bottom) {
         
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