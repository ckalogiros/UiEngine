


// function CLAMPY_CHILDREN_REBUILD(mesh, limit, renderables){

//    const children = mesh.children;
//    let changes_hapened = false;
//    // console.log('root', mesh.root_bufferidx)

//    const first = children.buffer[renderables.first];
//    const top = first.geom.pos[1] - first.geom.dim[1];
//    const bottom = first.geom.pos[1] + first.geom.dim[1];
//    const last = children.buffer[renderables.last-1];
//    const ltop = last.geom.pos[1] - last.geom.dim[1];
//    const lbottom = last.geom.pos[1] + last.geom.dim[1];

//    if(top < limit[0]){
//       // console.log('top', top, 'limit', limit[0], first.id, first.name)
//       // renderables.first+=7;

//       let cnt = renderables.first;
//       while(cnt < children.boundary-1){
//          const m = children.buffer[cnt++];
//          if(m.geom.pos[1]-m.geom.dim[1] < limit[0]){

//             renderables.first++;

//             if(renderables.last_all < mesh.children_all.boundary){
//                renderables.last_all++;
//                renderables.last++;
//             }
//          }
//          else break;
//       }

//       changes_hapened = true;
//    }
//    else if(lbottom > limit[1]){
//       // console.log('bottom', bottom, 'limit', limit[0], first.id, first.name);

//       let cnt = renderables.last-1;
//       while(cnt > 0){
//          const m = children.buffer[cnt--];
//          if(m.geom.pos[1]+m.geom.dim[1] > limit[1]){

//             renderables.last--;

//             if(renderables.first_all > 0){
//                renderables.first--;
//             }
//          }
//          else break;
//       }

//       changes_hapened = true;
//    }


//    if (changes_hapened) {
//       TEMP_CONCATE_(mesh, renderables);
//    }
// }
export function CLAMPY_CHILDREN_REBUILD(mesh, limit, renderables, dir) {

   let changes_hapened = false;

   const center = Mesh_buffer_get_mesh_byidx(mesh.children_all.buffer[renderables.center]);
   if (center === _) console.error('renderables', renderables, 'buffer:', mesh.children_all.buffer, mesh.name)
   
   const ctop = center.geom.pos[1] - center.geom.dim[1];
   const cbottom = center.geom.pos[1] + center.geom.dim[1];
   const halfsize = renderables.size / 2;
   
   if (dir < 0 && ctop <= limit[0]) {
      // console.warn(dir)

      if (ctop < limit[0] - 100) { // TODO: Who sets the threshold(in pixels) to which the center is assumed too far of from the limit???? 
         // Case the scroll center has passed the upper limit and is located far from it.
         // console.error("TOO FAR AWAY")

         // Run in all children's buffer from index of center until the mesh close to the limit 
         let cnt = renderables.center;
         let p = cbottom;
         // Stop when we find a mesh below the upper limit AND avoid going surpassing the buffer length (the .last_all is going to add 'halfsize' from cnt(center))
         while (p < limit[0] && cnt < (mesh.children_all.boundary) - halfsize) {
            // console.log(cnt)
            const m = Mesh_buffer_get_mesh_byidx(mesh.children_all.buffer[cnt++]);
            p = m.geom.pos[1] + m.geom.dim[1];
         }

         // cnt now has the child at the upper limit
         renderables.center = cnt;
         renderables.first_all = renderables.center - halfsize;
         renderables.last_all = renderables.center + halfsize;
         // console.log(renderables)
      }
      else if (renderables.last_all + renderables.size < mesh.children_all.boundary - 1) {

         renderables.first_all += halfsize;
         renderables.last_all = renderables.first_all + renderables.size;
         renderables.center += halfsize;
      }
      else {
         renderables.first_all = (mesh.children_all.boundary) - renderables.size;
         renderables.last_all = (mesh.children_all.boundary);
         renderables.center = renderables.last_all - halfsize;
         // console.error('ELSE')
      }

      // console.log('center', center.idx, 'pos', center.geom.pos[1], 'renderables', renderables);
      changes_hapened = true;
   }
   else if (dir > 0 && cbottom > limit[1]) {

      if (cbottom > limit[1] + 100) { // + 100 in pixels
         // Case the scroll center has passed the lower limit and is located far from it.
         // console.error("TOO FAR AWAY")

         // Run in all children's buffer from index of center until the mesh close to the limit 
         let cnt = renderables.center;
         let p = ctop;
         // Stop when we find a mesh above the lower limit AND avoid going negative index (the .first_all is going to subtract 'halfsize' from cnt(center))
         while (p > limit[1] && cnt > halfsize) {
            // console.log(cnt)
            const m = Mesh_buffer_get_mesh_byidx(mesh.children_all.buffer[cnt--]);
            p = m.geom.pos[1] + m.geom.dim[1];
         }

         // cnt now has the child at the lower limit
         renderables.center = cnt;
         renderables.first_all = renderables.center - halfsize;
         renderables.last_all = renderables.center + halfsize;
         // console.log(renderables)
      }
      else if (renderables.first_all - renderables.size > 0) {

         renderables.last_all -= halfsize;
         renderables.first_all = renderables.last_all - renderables.size;
         renderables.center -= halfsize;
      }
      else {
         renderables.first_all = 0;
         // renderables.first_all += halfsize
         renderables.last_all = renderables.size;
         renderables.center = halfsize;
         // console.error('ELSE')
      }

      // console.log('center', center.idx, 'pos', center.geom.pos[1], 'renderables', renderables);
      changes_hapened = true;
   }

   if (changes_hapened) {
      // TEMP_CONCATE_(mesh, renderables);
      TEMP_CONCATE_NO_ALLOCATION(mesh, renderables);
   }

   return changes_hapened;
}



// function CLAMPY_CHILDREN_REBUILD(mesh, limit, renderables, dir){

//    const children = mesh.children;
//    let changes_hapened = false;
//    // console.log('root', mesh.root_bufferidx)

//    const first = children.buffer[renderables.first];
//    const ftop = first.geom.pos[1] - first.geom.dim[1];
//    const fbottom = first.geom.pos[1] + first.geom.dim[1];
//    const last = children.buffer[renderables.last-1];
//    const ltop = last.geom.pos[1] - last.geom.dim[1];
//    const lbottom = last.geom.pos[1] + last.geom.dim[1];

//    console.log('-------------');


//    // if (dir > 0){

//    //    if(fbottom > limit[0]){
//    //       // console.log('bottom', bottom, 'limit', limit[0], first.id, first.name);

//    //       const buffer = Widget_root_buffer_get(mesh.root_bufferidx);
//    //       let cnt = renderables.first_all;
//    //       while(cnt > 0){

//    //          const m = buffer.buffer[cnt--];
//    //          const top = m.geom.pos[1]-m.geom.dim[1];
//    //          // if(top < limit[1] && fbottom < limit[0]){ // Check both bottom limit or first below upper limit
//    //          // console.log('1', renderables, ' mesh', m.geom.pos[1], m.id)
//    //          if(top < limit[0]+300){ // Check both bottom limit or first below upper limit

//    //             renderables.first--;
//    //             renderables.first_all--;
//    //             // console.log('1', renderables, ' mesh', m.geom.pos[1], m.id)

//    //             changes_hapened = true;
//    //          }
//    //          else break;
//    //       }
//    //    }
//    //    if(lbottom > limit[1]+200){
//    //       // console.log('bottom', bottom, 'limit', limit[0], first.id, first.name);

//    //       // Load from last until first pos > limit[0], OR if implemented meshes to be added < size(size is a maximum rendered meshes set by the user)
//    //       const children = mesh.children;

//    //       let cnt = renderables.last;
//    //       while(cnt > 0){

//    //          const m = children.buffer[cnt--];
//    //          const bottom = m.geom.pos[1]+m.geom.dim[1];
//    //          // if(top < limit[1] && fbottom < limit[0]){ // Check both bottom limit or first below upper limit
//    //          if(bottom > limit[1]){ // Check both bottom limit or first below upper limit

//    //             renderables.last--;
//    //             renderables.last_all;
//    //             // console.log('2', renderables, ' mesh', m.geom.pos[1], m.id)

//    //             changes_hapened = true;
//    //          }
//    //          else break;
//    //       }
//    //    } 
//    // }
//    // else
//    if (dir < 0 && renderables.last < mesh.children_all.boundary-1){

//       if(ftop < limit[0]-300){
//          // console.log('bottom', bottom, 'limit', limit[0], first.id, first.name);

//          let cnt = renderables.first;
//          while(cnt < children.boundary){

//             const m = children.buffer[cnt++];
//             const bottom = m.geom.pos[1]+m.geom.dim[1];
//             // if(top < limit[1] && fbottom < limit[0]){ // Check both bottom limit or first below upper limit
//             // console.log('1', renderables, ' mesh', m.geom.pos[1], m.id)
//             if(bottom < limit[0]){ // Check both bottom limit or first below upper limit

//                renderables.first++;
//                renderables.first_all++;
//                // console.log('1', renderables, ' mesh', m.geom.pos[1], m.id)

//                changes_hapened = true;
//             }
//             else break;
//          }
//       }
//       if(ltop < limit[1]){
//          // console.log('bottom', bottom, 'limit', limit[0], first.id, first.name);

//          // Load from last until first pos > limit[0], OR if implemented meshes to be added < size(size is a maximum rendered meshes set by the user)
//          const buffer = Widget_root_buffer_get(mesh.root_bufferidx);

//          let cnt = renderables.last-1;
//          while(cnt < mesh.children_all.boundary-1){

//             const m = Mesh_buffer_get_mesh_byidx(buffer.buffer[cnt++]);
//             const top = m.geom.pos[1]-m.geom.dim[1];
//             // if(top < limit[1] && fbottom < limit[0]){ // Check both bottom limit or first below upper limit
//             if(top < limit[1]+200){ // Check both bottom limit or first below upper limit

//                renderables.last++;
//                renderables.last_all++;
//                // console.log('2', renderables, ' mesh', m.geom.pos[1], m.id)

//                changes_hapened = true;
//             }
//             else break;
//          }
//       } 
//    }


//    if (changes_hapened) {
//       TEMP_CONCATE_(mesh, renderables);
//    }
// }
export function TEMP_CONCATE_(root, renderables) {

   // console.log(renderables)

   const new_children_buffer = new M_Buffer();

   // for (let i = renderables.first_all; i < renderables.last_all; i++) {
   // for (let i = renderables.first; i < renderables.last; i++) {
   for (let i = renderables.first_all; i < renderables.last_all; i++) {
      const mesh = Mesh_buffer_get_mesh_byidx(root.children_all.buffer[i]);
      const idx = new_children_buffer.Add(mesh);
   }

   renderables.first = 0;
   renderables.last = new_children_buffer.boundary - 1;
   root.children = new_children_buffer;
}



// NOTE: MUCH FASTER than TEMP_CONCATE_() that allocates new M_Buffer
export function TEMP_CONCATE_NO_ALLOCATION(root, renderables) {

   // console.log(renderables)

   // const new_children_buffer = new M_Buffer();
   const new_children_buffer = root.children;
   let cnt = 0;

   for (let i = renderables.first_all; i < renderables.last_all; i++) {
      const mesh = Mesh_buffer_get_mesh_byidx(root.children_all.buffer[i]);
      if (cnt >= root.children.boundary) alert("TEMP_CONCATE_NO_ALLOCATION()", root.children.boundary, cnt);
            /**DEBUG*/if (mesh === _)
         console.error('TEMP_RERENDER', mesh.children.buffer, i)
      new_children_buffer.AddAtIndex(cnt++, mesh);
   }

   renderables.first = 0;
   renderables.last = new_children_buffer.boundary - 1;
   // root.children = new_children_buffer;
}




/*********************************************************************************************************************************************************************************** */
/*********************************************************************************************************************************************************************************** */
/*********************************************************************************************************************************************************************************** */
// FROM WIDGET DROPDOWN



// loop through a dp and all menus and their items recursively, and deactivate any above and below renderable ara
export function TEMP2(dp, clampy, stored_meshes_buffer = null) {

   for (let i = dp.menu.children.boundary - 1; i >= 0; i--) {

      const child = dp.menu.children.buffer[i];

      console.log('---- ', child.mesh_bufferidx, child.geom.pos, child.name)
      const child_top = child.geom.pos[1] - child.geom.dim[1];
      const child_bot = child.geom.pos[1] + child.geom.dim[1];
      if ((child_top > clampy[1] || (child_bot < clampy[0]))) {
         // console.log('---- outside', child.mesh_bufferidx, child.geom.pos, child.name)
         console.log('---- outside', child.name)
         // console.log(child.mesh_bufferidx, 'child_top', child_top, 'child_bot', child_bot, clampy, child.name)
         child.state.mask &= ~MESH_STATE.ACTIVE;
      }
      else if (child.state.mask & MESH_STATE.ACTIVE) {
         // console.log('++++ inside', child.mesh_bufferidx, child.geom.pos, child.name)
         console.log('++++ inside', child.name)
         child.state.mask |= MESH_STATE.ACTIVE;

      }
      else {
         console.log('--- Deactivated', child.name)

      }
      if (child.type & MESH_TYPES_DBG.WIDGET_DROP_DOWN) {
         TEMP2(child, clampy, stored_meshes_buffer);
      }
   }
}



export function TEMP(dp, clampy, stored_meshes_buffer) {

   for (let i = dp.menu.children.boundary - 1; i >= 0; i--) {

      const child = dp.menu.children.buffer[i];
      // console.log(child.mesh_bufferidx, child.children_all.buffer, child.name)

      const child_top = child.geom.pos[1] - child.geom.dim[1];
      const child_bot = child.geom.pos[1] + child.geom.dim[1];
      if (child.gfx && (child_top > clampy[1] || (child_bot < clampy[0]))) {

         // console.log(child.mesh_bufferidx, '---- outside', child.geom.pos[1], child.name)
         child.FakeRemoveFromGfxAlpha(0);
      }
      else if (child.mat.col[3] === 0) {
         // console.log(child.mesh_bufferidx, 'inside', child.geom.pos[1], child.name)
         child.FakeAddFromGfxAlpha(1)

      }
      if (child.type & MESH_TYPES_DBG.WIDGET_DROP_DOWN) {
         // console.log(child.mesh_bufferidx, child.name, child.children_all.buffer)
         TEMP(child, clampy, stored_meshes_buffer);
      }
   }
}



export function Dropdown_clampy_renameme(dp, clampy, stored_meshes_buffer) {
   // if(dp.isOn & DP_MENU_STATE.ON){

   const dp_top = dp.geom.pos[1] - dp.geom.dim[1];
   const dp_bot = dp.geom.pos[1] + dp.geom.dim[1];

   if (dp_bot >= clampy[1]) {

      const menu_top = dp.menu.geom.pos[1] - dp.menu.geom.dim[1];
      const menu_bot = dp.menu.geom.pos[1] + dp.menu.geom.dim[1];
      if (menu_top >= clampy[1]) {
         console.log('1111', dp.menu.mesh_bufferidx, dp.menu.constructor.name, dp.menu.name, menu_top, clampy);
         // Deactivate the whole menu
         if (dp.menu.geom.pos[1] < OUT_OF_VIEW - 100) // Avoid adding meshes that aren't initialised yet (y pos = OUT_OF_VIEW = 100000) 
            stored_meshes_buffer.push(dp.menu.mesh_bufferidx);
      }
      else {
         // Check all children items from bottom to top and deactivate if below clampy[1]

         let outside = false;
         // If menu bottom is greater: check its items
         for (let i = dp.menu.children.boundary - 1; i >= 0; i--) {

            const child = dp.menu.children.buffer[i];
            const child_top = child.geom.pos[1] - child.geom.dim[1];
            const child_bot = child.geom.pos[1] + child.geom.dim[1];

            if (child_top >= clampy[1]) {

               console.log('2222', child.mesh_bufferidx, child.constructor.name, child.name, child_top, clampy);
               // child.FakeRemoveFromGfxPosy(OUT_OF_VIEW);
               if (child.geom.pos[1] < OUT_OF_VIEW - 100) // Avoid adding meshes that aren't initialised yet (y pos = OUT_OF_VIEW = 100000) 
                  stored_meshes_buffer.push(child.mesh_bufferidx);
               outside = true;
            }

            if (child.type & MESH_TYPES_DBG.WIDGET_DROP_DOWN) {
               Dropdown_clampy_renameme(child, clampy, stored_meshes_buffer);
            }
         }
      }
   }
}
















/*********************************************************************************************************************************************************************************** */
/*********************************************************************************************************************************************************************************** */
/*********************************************************************************************************************************************************************************** */
// FROM SCENE




    /*******************************************************************************************************************************************************/
    // Graphics


   //  RemoveRootMesh(widget) {

   //      ERROR_NULL(widget.scene_rootidx);
   //      if(widget.scene_rootidx !== INT_NULL)
   //          this.root_meshes.RemoveByIdx(widget.scene_rootidx);
   //  }


    

    /*******************************************************************************************************************************************************/
    // 
    
   //  CreateProgramsGroupBuffer(groupidx){ 
   //      const idx = this.gfx.Add(new M_Buffer()); 
   //      /**DEBUG */ if(idx !== groupidx) 
   //          alert('ERROR: the index created for the Scenes programs group is not as the index of the program group that was created')
   //  }


   //  CreateProgramsBuffer(groupidx, progidx){ 
   //      const idx = this.gfx.buffer[groupidx].Add(new M_Buffer()); 
   //      /**DEBUG */ if(idx !== progidx) 
   //      alert('ERROR: the index created for the Scenes program is not as the index of the shader program that was created')

   //      this.camera.UpdateProjectionUniform(gfxCtx.gl, progidx, groupidx);// Bind camera's uniform matrix to the new shader program.

   //  }


   //  CreateVertexBufferBuffer(groupidx, progidx, vbidx){ 
   //      const idx = this.gfx.buffer[groupidx].buffer[progidx].Add(new M_Buffer()); 
   //      /**DEBUG */ if(idx !== vbidx) 
   //          alert('ERROR: the index created for the Scenes vertex buffer is not as the index of the vertex buffer that was created')
   //  }


   //  CreateMeshInGfxBuffer(groupidx, progidx, vbidx){ 
   //      this.gfx.buffer[groupidx].buffer[progidx].buffer[vbidx].Add(new M_Buffer()); 
   //  }


   //  StoreMeshInGfxBuffer(mesh){

   //      const groupidx = mesh.gfx.prog.groupidx;
   //      const progidx = mesh.gfx.prog.idx;
   //      const vbidx = mesh.gfx.vb.idx;

   //      mesh.gfx.scene_mesh_in_gfx_idx = this.gfx.buffer[groupidx].buffer[progidx].buffer[vbidx].Add(mesh);

   //      // Store the mesh if it is a root, that means if the parent of the mesh is the scene (parent=null)
   //      if(!mesh.parent && mesh.scene_rootidx === INT_NULL){
   //          this.StoreRootMesh(mesh);
   //      }
   //  }


   //  StoreRootMesh(widget) {
   //      widget.scene_rootidx = this.root_meshes.Add(widget);
   //      widget.idx = widget.scene_rootidx;

   //  }
    

   //  GetRootMeshes() {
   //      return this.root_meshes;
   //  }



   //  GetRootMeshByIdx(rootidx) {
   //      return this.root_meshes.buffer[rootidx];
   //  }


   //  FindMeshById(id) {
   //      for (let i = 0; i < this.children.boundary; i++) {
   //          if (this.children.buffer && this.children.buffer[i].id === id)
   //              return this.children.buffer[i];
   //          return null;
   //      }
   //  }



   //  GetAllSceneMeshes(){

   //      const meshes = [];
   //      // this.gfx.buffer[groupidx].progs.buffer[progidx].vb.buffer[vbidx].mesh.Add(mesh);
   //      for(let i=0; i<this.gfx.boundary; i++){ // For programs groups

   //          const vbs = this.gfx.buffer[i].buffer;
   //          for(let j=0; j<vbs.boundary; j++){ // For programs
                
   //              for(let k=0; k<vbs.buffer[j].boundary; k++){ // For vertex buffers
                    
   //                  const mesh = vbs.buffer[j].buffer[k];
   //                  if(mesh) meshes.push(mesh);
   //              }

   //          }
   //      }

   //      return meshes;
   //  }



    /**
     * @returns type of M_Buffer, not just an array[]
     */
    // GetRootMeshes(sceneidx) {
    //     return this.buffer[sceneidx].GetRootMeshes();
    // }

    // GetRootMeshByIdx(sceneidx, rootidx) {
    //     return this.buffer[sceneidx].GetRootMeshByIdx(rootidx);
    // }

    // GetAllSceneMeshes(sceneidx){
    //     return this.buffer[sceneidx].GetAllSceneMeshes();
    // }






    


// export function Scenes_get_root_meshes(sceneidx) { return _scenes.GetRootMeshes(sceneidx); }



// export function Scenes_get_root_mesh_by_idx(sceneidx, rootidx) { return _scenes.GetRootMeshByIdx(sceneidx, rootidx); }



// export function Scenes_get_all_scene_meshes(sceneidx) { return _scenes.GetAllSceneMeshes(sceneidx); }





// export function Scenes_create_programs_group_buffer(sceneidx, groupidx) {
//     _scenes.buffer[sceneidx].CreateProgramsGroupBuffer(groupidx);
// }



// export function Scenes_create_programs_buffer(sceneidx, groupidx, progidx) {
//     _scenes.buffer[sceneidx].CreateProgramsBuffer(groupidx, progidx);
// }



// export function Scenes_create_vertex_buffer_buffer(sceneidx, groupidx, progidx, vbidx) {
//     _scenes.buffer[sceneidx].CreateVertexBufferBuffer(groupidx, progidx, vbidx);
// }



// export function Scenes_create_mesh_in_gfx_buffer(sceneidx, groupidx, progidx, vbidx) {
//     _scenes.buffer[sceneidx].CreateMeshInGfxBuffer(groupidx, progidx, vbidx);
// }



// export function Scenes_store_mesh_in_gfx(sceneidx, mesh) {
//     _scenes.buffer[sceneidx].StoreMeshInGfxBuffer(mesh);
// }



// export function Scenes_remove_mesh_from_gfx(sceneidx, groupidx, progidx, vbidx, scene_mesh_in_gfx_idx) { 
//     return _scenes.buffer[sceneidx].RemoveMeshFromGfx(groupidx, progidx, vbidx, scene_mesh_in_gfx_idx);
// }


/*****************************************************************************************************************************************************************/
// Test Build and draw 
/*****************************************************************************************************************************************************************/


// var prog = null;
// const vb = new Float32Array(56);
// const ib = new Uint16Array(6);
// var vbo = null;
// var ibo = null;
// export function TEMP_CREATE_GEOMETRY(){
    
//     const sid = {
        
//         shad: SID.SHAD.INDEXED ,
//         attr: (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4|SID.ATTR.POS2|SID.ATTR.PARAMS1),
//         unif: SID.UNIF.PROJECTION, // Assuming we always have  a projection camera and a uniforms buffer. 
//         pass: SID.PASS.COL4,
//         progs_group: PROGRAMS_GROUPS.DEFAULT.MASK, // To denote if the curent mesh is used for dubug, so it uses specific gfx buffers for debug ui rendering.
//     }
//     Program_get_group(sid);
    
    
//     let i = 0;
//     // V2
//     vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;
//     vb[i++] = 200;vb[i++] = 200;vb[i++] = 2;vb[i++]=1;
//     vb[i++] = -100;vb[i++] = 100;
//     vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;
//     // V2
//     vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;
//     vb[i++] = 200;vb[i++] = 200;vb[i++] = 2;vb[i++]=1;
//     vb[i++] = -100;vb[i++] = -100;
//     vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;
//     // V3
//     vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;
//     vb[i++] = 200;vb[i++] = 200;vb[i++] = 2;vb[i++]=1;
//     vb[i++] = 100;vb[i++] = 100;
//     vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;
//     // V4
//     vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;vb[i++] = 1;
//     vb[i++] = 200;vb[i++] = 200;vb[i++] = 2;vb[i++]=1;
//     vb[i++] =  100;vb[i++] = -100;
//     vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;vb[i++] = 0;

//     const gl = gfxCtx.gl;
//     vbo = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
//     gl.bufferData(gl.ARRAY_BUFFER, vb, gl.STATIC_DRAW);
//     // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    
        
//     ib[0]=0;ib[1]=1;ib[2]=2;
//     ib[3]=1;ib[4]=2;ib[5]=3;
//     ibo = gl.createBuffer();
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ib, gl.STATIC_DRAW);
//     // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// }

/**************************************************************************************************************************************/
// Test Draw
// export function Gl_draw(gl) {

    
//     const progs_group = Program_get_groups();
//     // const drawQueue = Renderqueue_get_active();
//     // const drawQueueCount = Renderqueue_active_get_count();


//     gl.clearColor(0.18, 0.18, 0.18, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     // const groupidx = drawQueue[0].groupidx;
//     // const progidx = drawQueue[0].progidx;
//     // const vbidx = drawQueue[0].vbidx;

//     const progs = progs_group.buffer[0];

//     // // if (GL.BOUND_PROG_IDX !== progidx)
//     // Program_use_program(progs.buffer[progidx].shader_program, progidx)

//     // Update all program uniforms
//     // progs.buffer[progidx].UniformsUpdate(gl);


//     gl.useProgram(progs.buffer[0].shader_program);
//     Scenes_bind_camera_to_uniform_projection(0, 0, 0)

    
//     const vb_info = Vertex_buffer_info_get_by_vbidx(0);
//     const vb = Vertex_buffer_get(0);
//     const ib_info = Index_buffer_info_get_by_ibidx(0);
//     const ib = Index_buffer_get(0);

//     gl.bindVertexArray(vb_info.vao);
//     gl.bindBuffer(gl.ARRAY_BUFFER, vb_info.vbo);
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib_info.ibo);
    
//     // gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
//     // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
//     // gl.enableVertexAttribArray(0);
//     // gl.enableVertexAttribArray(1);
//     // gl.enableVertexAttribArray(2);
//     // gl.enableVertexAttribArray(3);
//     // gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 14*FLOAT, 0*FLOAT);
//     // gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 14*FLOAT, 4*FLOAT);
//     // gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 14*FLOAT, 8*FLOAT);
//     // gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 14*FLOAT, 10*FLOAT);

//     // // if (GL.BOUND_VAO !== vb.vao)
//     //     GlBindVAO(vb.vao)
//     //     // GlBindVBO(vb.vbo)


//     // gfxCtx.gl.bindBuffer(gl.ARRAY_BUFFER, vb.vbo);
//     if (ib_info.state.mask & BUFFER_STATE.NEEDS_UPDATE)
//         Index_buffer_set_ib_data(gl, ib_info)
//     if (vb_info.state.mask & BUFFER_STATE.NEEDS_UPDATE) 
//         Vertex_buffer_set_vb_data(gl, vb_info);

    
//     // gl.drawElements(gl.TRIANGLES, 64, gl.UNSIGNED_SHORT, 0);
//     // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
//     gl.drawElements(gl.TRIANGLES, ib_info.count, gl.UNSIGNED_SHORT, 0);
//     // gl.drawArrays(gl.TRIANGLES, 0, 56);

// }





/*********************************************************************************************************************************************************************************/
// ADD TO VERTEX BUFFER
/*********************************************************************************************************************************************************************************/

// export function VbSetAttribColPerVertex(vb, start, count, stride, col, num_faces) {

//     if (!Array.isArray(col[0])) {
//         console.error('col should be an array of vec4 colors. @ GlBufferOps.js')
//     }

//     let index = start;
//     const end = start + (count * num_faces);
//     // let k = 0;

//     // while (index < end) {
//     //     vb_data[index++] = col[k][0];
//     //     vb_data[index++] = col[k][1];
//     //     vb_data[index++] = col[k][2];
//     //     vb_data[index++] = col[k][3];

//     //     index += stride;
//     //     vb.count += V_COL_COUNT;
//     //     k++;
//     //     if (k >= 4) k = 0;
//     // }
//     let k = 1;

//     while (index < end) {
//         vb_data[index++] = col[k][0];
//         vb_data[index++] = col[k][1];
//         vb_data[index++] = col[k][1];
//         vb_data[index++] = col[k][0];

//         index += stride;
//         vb.count += V_COL_COUNT;
//         k++;
//         if (k >= 3) k = 2;
//     }
// }



// // export function VbSetAttribCol(vb, start, count, stride, col, num_faces) {

// //     let index = start;
// //     const end = start + (count * num_faces);

// //     while (index < end) {

// //         vb_data[index++] = col[0];
// //         vb_data[index++] = col[1];
// //         vb_data[index++] = col[2];
// //         vb_data[index++] = col[3];

// //         index += stride;
// //         vb.count += V_COL_COUNT;
// //     }
// // }



// export function VbSetAttribPos(vb, start, count, stride, dim, num_faces) {
//     if (dim[0] === NaN || dim[1] === NaN) console.log('NaN value')

//     let index = start;
//     const end = start + (count * num_faces);

//     while (index < end) {

//         vb_data[index++] = -dim[0];
//         vb_data[index++] = dim[1];
//         index += stride;

//         vb_data[index++] = -dim[0];
//         vb_data[index++] = -dim[1];
//         index += stride;

//         vb_data[index++] = dim[0];
//         vb_data[index++] = dim[1];
//         index += stride;

//         vb_data[index++] = dim[0];
//         vb_data[index++] = -dim[1];
//         index += stride;

//         vb.count += V_POS_COUNT * VERTS_PER_RECT_INDEXED;
//     }
// }



// export function VbSetAttribTex(vb, start, count, stride, tex, num_faces) {

//     let index = start;
//     const end = start + (count * num_faces);

//     while (index < end) {

//         vb_data[index++] = tex[0];
//         vb_data[index++] = tex[3];
//         index += stride;

//         vb_data[index++] = tex[0];
//         vb_data[index++] = tex[2];
//         index += stride;

//         vb_data[index++] = tex[1];
//         vb_data[index++] = tex[3];
//         index += stride;

//         vb_data[index++] = tex[1];
//         vb_data[index++] = tex[2];
//         index += stride;

//         vb.count += V_TEX_COUNT * VERTS_PER_RECT_INDEXED;
//     }
// }



// export function VbSetAttribWpos(vb, start, count, stride, pos, num_faces) {
//     if (pos[0] === NaN || pos[1] === NaN || pos[2] === NaN)
//         console.log('NaN value')
//     let index = start;
//     const end = start + (count * num_faces);

//     // console.log('VERTEX BUFFER WPOS. start', start, 'vb', vb[index+1], 'wposy', pos[1])

//     while (index < end) {

//         vb_data[index++] = pos[0];
//         vb_data[index++] = pos[1];
//         vb_data[index++] = pos[2];

//         index += stride;
//         vb.count += V_WPOS_TIME_COUNT;
//     }
// }



// export function VbSetAttrSdf(vb, start, count, stride, sdf_params) {

//     let index = start;
//     const end = start + count;

//     while (index < end) {

//         vb_data[index++] = sdf_params[0];
//         vb_data[index++] = sdf_params[1];

//         index += stride;
//         vb.count += V_SDF_COUNT;
//     }
// }



// export function VbSetAttrStyle(vb, start, count, stride, style) {

//     let index = start;
//     const end = start + count;

//     while (index < end) {

//         vb_data[index++] = style[0];
//         vb_data[index++] = style[1];
//         vb_data[index++] = style[2];

//         index += stride;
//         vb.count += V_STYLE_COUNT;
//     }
// }



// export function VbSetAttrRoundCorner(vb, start, count, stride, radius, num_faces) {

//     let index = start;
//     const end = start + (count * num_faces);

//     while (index < end) {

//         vb_data[index++] = radius;

//         index += stride;
//         vb.count++; // for the rest style attributes
//     }
// }



// export function VbSetAttrBorderWidth(vb, start, count, stride, border, num_faces) {

//     let index = start;
//     const end = start + (count * num_faces);

//     while (index < end) {

//         vb_data[index++] = border;

//         index += stride;
//         vb.count++; // for the rest style attributes
//     }
// }



// export function VbSetAttrBorderFeather(vb, start, count, stride, feather, num_faces) {

//     let index = start;
//     const end = start + (count * num_faces);

//     while (index < end) {

//         vb_data[index++] = feather;

//         index += stride;
//         vb.count++; // for the rest style attributes
//     }
// }



// export function VbSetAttrTime(vb, start, count, stride, time, num_faces) {

//     let index = start;
//     const end = start + (count * num_faces);

//     while (index < end) {

//         vb_data[index++] = time;

//         index += stride;
//         // The vb.count has already be incremented in VbSetAttribWpos() with WPOS_TIME4_COUNT 
//         // vb.count += V_TIME_COUNT;
//     }
// }





/*****************************************************************************************************************************************************************/
/*****************************************************************************************************************************************************************/




// export function Scroller_clampy_and_render(scroller, upper_threshold = 0, lower_thresold = 0) {

//    // First run a calc to update the dimensions and positions of all meshes, so that we can clamp correctly
//    scroller.Calc_no_gfx_update();

//    // Remove all children that are not inside limits
//    const ret = Clamp_y_remove_children_FIRST_TIME_CLAMP(scroller.scrolled_section, upper_threshold, lower_thresold);
//    scroller.renderables.first = ret.firstupper;
//    scroller.renderables.first_all = ret.firstupper;
//    scroller.renderables.last = ret.firstlower - 1;
//    scroller.renderables.last_all = ret.firstlower;
//    console.log('scroller.renderables', scroller.renderables, 'ret', ret);


//    // Build the group out of the clamped scrolled section
//    scroller.scrolled_section.group_bufferidxs = Widget_group_create(scroller.scrolled_section.mesh_bufferidx, scroller.scrolled_section.gfx)
//    scroller.scrolled_section.AddToWidgetGroupBuffer(scroller.scrolled_section.group_bufferidxs[0]);
//    // Render the clamped scroller
//    scroller.Render();
//    // This way we do not resize the scrolled section to the clamped height(keeps it at original height for all items)
//    scroller.ConstructListeners();

//    // NOTE: We have to update the "starts" of all group.vb[] arrays after the render, because the group was created before the render, the start indexes to the vertex buffers are set wrong.
//    Widget_group_update_start(scroller.scrolled_section.group_bufferidxs[0]);

//    // IMPORTANT: Do not trust a mesh that has a valid .group_bufferidxs, that it is actively in the group at any time.
//    /**
//     * In order for all scrolled meshes to be able to be rendered correctly, we need them to 
//     * have a reference to the group buffer via their .group_bufferidxs variable.
//     * That is because at any given time, a Batch update will update X number of faces in the vertex buffers,
//     * but the number of scrolled items may change depending on the clamp of the scroller.
//     * So we need to dynamicaly update the number of faces of the group when changes happen on the clamp procedure.
//     * The only way to acomplish this is to store the group in to all items regardless if they are actively in the group or not.  
//     */
//    // Assign to all scrolled items the scroller's group
//    // TEMPORARY: Design how and where to implement.
//    const widget_root = Widget_root_buffer_get_byidx(scroller.root_bufferidx);
//    const group_bufferidx = scroller.scrolled_section.group_bufferidxs[0]; // The roots group idx
//    for (let i = 0; i <= widget_root.boundary; i++) {

//       const mesh = Mesh_buffer_get_mesh_byidx(widget_root.buffer[i])
//       if (mesh.gfx && mesh.group_bufferidxs[1] === INT_NULL) {
//          mesh.group_bufferidxs = Widget_group_find_but_not_insert(group_bufferidx, mesh.gfx);
//       }
//    }


// }









   // AddToWidgetGroupBuffer(group_bufferidx) {

   //    if(group_bufferidx === INT_NULL)
   //       console.error('Catch group_bufferidx === -1. this:', this.GetName(), this)

   //    if (this.state.mask & MESH_STATE.ACTIVE) {
   //       /**DEBUG */ if (!this.gfx) console.error('ADDING TO WIDGET GROUP BUFFER FAILED: NO GFX FOR MESH:', this.mesh_bufferidx, this.GetName());
   //       /**DEBUG */ if (this.group_bufferidxs[1] !== INT_NULL) console.error('ADDING TO WIDGET GROUP BUFFER WARNING: MESH ALREADY IS IN A WIDGET GROUP:', this.mesh_bufferidx, this.GetName(), 'group:', this.group_bufferidxs, 'start', this.gfx.vb.start);

   //       this.group_bufferidxs[0] = group_bufferidx;
   //       this.group_bufferidxs[1] = Widget_group_add(group_bufferidx, this.gfx, this.geom.num_faces, this.mesh_bufferidx);

   //       const bar = this.children.buffer[SLIDER_BAR_IDX];
   //       bar.group_bufferidxs[0] = group_bufferidx;
   //       bar.group_bufferidxs[1] = Widget_group_add(group_bufferidx, bar.gfx, bar.geom.num_faces, bar.mesh_bufferidx);

   //       const name_text = this.text_mesh;
   //       name_text.group_bufferidxs[0] = group_bufferidx;
   //       name_text.group_bufferidxs[1] = Widget_group_add(group_bufferidx, name_text.gfx, name_text.geom.num_faces, name_text.mesh_bufferidx);

   //       const handle = bar.children.buffer[0];
   //       handle.group_bufferidxs[0] = group_bufferidx;
   //       handle.group_bufferidxs[1] = Widget_group_add(group_bufferidx, handle.gfx, handle.geom.num_faces, handle.mesh_bufferidx);

   //       const value_text = bar.children.buffer[1];
   //       value_text.group_bufferidxs[0] = group_bufferidx;
   //       value_text.group_bufferidxs[1] = Widget_group_add(group_bufferidx, value_text.gfx, value_text.geom.num_faces, value_text.mesh_bufferidx);
   //    }
   // }





















/*****************************************************************************************************************************************************************/
// Index Buffer

// ResetToIndex(index, vertices_per_rect) {

//    const new_vCount = ((this.count - index) / INDICES_PER_RECT) * vertices_per_rect;
//    this.vCount -= new_vCount;
//    if ((this.vCount % 1) !== 0)
//       console.error('index buffer count mismatch')
//    this.count = index;
//    this.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
// }

/**DO NOT DELETE */
// Remove_geometry(num_faces) {

//    const attr_count = INDICES_PER_RECT * num_faces; // Meshes total attributes count.
//    this.count -= attr_count;
//    const vCount = (attr_count / INDICES_PER_RECT) * VERTS_PER_RECT_INDEXED;
//    this.vCount -= vCount;

//    if (this.count === 0) this.state.mask &= ~BUFFER_STATE.IS_ACTIVE;
//    else this.state.mask |= BUFFER_STATE.NEEDS_UPDATE;

//    // POTENTIAL_BUG: If the buffer is empty MUST be updated!!!
//    // TODO: If The buffer is not used, then we need to update the render queue

//    return attr_count;
// }




// export function Index_buffer_reset(ibidx) {
//    // _index_buffers_info.buffer[ibidx].count = 0;
//    // _index_buffers_info.buffer[ibidx].vCount = 0;
//    console.error('REMINDER: the index buffer on reseting is not setting .count to 0. It just lets ib keep the indices.')
//    // _index_buffers_info.buffer[ibidx].state.mask |= BUFFER_STATE.NEEDS_UPDATE;
// }



// export function Index_buffer_reset_to_index(ibidx, start) {

//    const ib_info = _index_buffers_info.buffer[ibidx];
//    if (start < 0 || start > ib_info.count) console.error('Start should be less than vertex buffer count. @IndexBuffers.js, ');
//    const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK

//    const vCount = start ? (start / INDICES_PER_RECT) * vertices_per_rect : 0;
//    ib_info.count = start;
//    ib_info.vCount = vCount;
//    ib_info.state.mask &= ~BUFFER_STATE.NEEDS_UPDATE;


// }
/*****************************************************************************************************************************************************************/















/*****************************************************************************************************************************************************************/
   /** */
   // UpdateText(_text) {

   //    if (!this.gfx) return; // Case replace text before insert to gfx buffers;

   //    let text = (typeof (_text) === 'number') ? `${_text}` : _text; // Takes arithmetic values or just a char.

   //    const gfx_copy = {
   //       vb: { idx: this.gfx.vb.idx, start: this.gfx.vb.start, count: this.gfx.vb.count },
   //       prog: { attribsidx: this.gfx.prog.attribsidx },
   //       vertsPerRect: this.gfx.vertsPerRect,
   //       attribsPerVertex: this.gfx.attribsPerVertex,
   //    }

   //    const geom_copy = { // Copy first character's mesh geometry, so we can make changes to it on calculating the rest of the characters position and dimentions.
   //       pos: [this.geom.pos[0], this.geom.pos[1], this.geom.pos[2]],
   //       dim: [this.geom.dim[0], this.geom.dim[1]],
   //    }


   //    const advancex = Font_get_font_advancex(this.mat.texidx);

   //    const numchars = text.length;
   //    // NOTE: We want to run for max chars to reset any extra from the current text
   //    const len = (this.geom.num_faces > numchars) ? this.geom.num_faces :
   //       (numchars > this.geom.num_faces ? this.geom.num_faces : numchars);

   //    // let len = 0;
   //    // if (numchars > this.last_charidx) {
   //    //    len = numchars < this.geom.num_faces ? numchars : this.geom.num_faces;
   //    //    this.last_charidx = len
   //    // }
   //    // else {
   //    //    len = this.last_charidx;
   //    //    this.last_charidx = numchars
   //    // }


   //    const attr = Shader_attributes_get_attribs_offset_size(gfx_copy.prog.attribsidx, SHADER_ATTRIBUTES.TEX2);

   //    // Update text faces
   //    for (let i = 0; i < len; i++) {

   //       let uvs = [0, 0, 0, 0]; // Set uvs to ' ' space char, to replace any extra previous text's characters

   //       if (text[i] !== undefined) // If char=' ' space, just render [0,0] uv coordinates.
   //       {
   //          // Set character dimentions.
   //          const plane_bounds = Font_get_char_plane_bounds(this.mat.uvIdx, text[i]);
   //          geom_copy.dim[0] *= plane_bounds.width;
   //          geom_copy.dim[1] *= plane_bounds.height;
   //          Gl_set_dim_XY(gfx_copy, geom_copy.dim);

   //          // // Set character y position and advance.
   //          geom_copy.pos[1] += plane_bounds.yoffset * this.fontsize;
   //          Gl_set_wpos_XY(gfx_copy, geom_copy.pos);
   //          geom_copy.pos[0] += Floor(this.fontsize * 2 * advancex);

   //          // Get the correct uv coordinates.
   //          uvs = Font_get_char_uv_coords(this.mat.uvIdx, text[i]);

   //          geom_copy.dim[0] = this.geom.dim[0]; geom_copy.dim[1] = this.geom.dim[1]; geom_copy.pos[1] = this.geom.pos[1]; // Reset 
   //       }

   //       Gl_set_uv2(gfx_copy.vb.idx, uvs, gfx_copy.vb.start, attr.offset, attr.size, gfx_copy.attribsPerVertex)

   //       gfx_copy.vb.start += gfx_copy.vb.count
   //    }

   //    Vertex_buffer_state_enable(gfx_copy.vb.idx, BUFFER_STATE.NEEDS_UPDATE);
   // }
/*****************************************************************************************************************************************************************/















/*****************************************************************************************************************************************************************/
// Widget Menu Bar

/**SAVE */
// export class Widget_Menu_Bar extends Widget_Label {

//    close_btn_idx;
//    minimize_btn_idx;

//    // UNUSED: The align param is unused from the Widget_Label class
//    constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, align, pos, col = GREY[3], text_col = WHITE, pad = [14, 6], bold = .4, style = [2, 5, 2], font = TEXTURES.MSDF_CONSOLAS_1024) {

//       super(mesh_bufferidx, ROOT_WIDGET_FLAGS, text, align, pos, _fontsize, col, text_col, pad, bold, font, style);

//       if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT) {
//          this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);
//       }

//       this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
//       this.SetStyle(style);
//       // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
//       this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


//       this.SetName('Widget_Menu_Bar');
//       this.type |= MESH_TYPE.WIDGET_MENU_BAR;

//       this.close_btn_idx = INT_NULL;
//       this.minimize_btn_idx = INT_NULL;

//    }


//    AddCloseButton(ROOT_WIDGET_FLAGS, root, text, fontsize = 0, col = GREY[3], text_col = WHITE, pad = [4, 2], bold = .4, style = [6, 5, 3], font = TEXTURES.MSDF_CONSOLAS_1024) {

//       if (!fontsize) fontsize = this.text_mesh.geom.dim[0];

//       const pos = [0, 0, 0];
//       CopyArr3(pos, this.geom.pos)
//       pos[2] += 1; // Put close button in front of the parent widget.
//       // pos[0] += this.geom.dim[0] - ; // Align right

//       const close_btn = Create_widget_close_btn(ROOT_WIDGET_FLAGS, root, text, pos, fontsize, col, text_col, pad, bold, style, font);
//       close_btn.geom.pos[0] += this.geom.dim[0] - close_btn.geom.dim[0]; // Align right
//       close_btn.text_mesh.geom.pos[0] += this.geom.dim[0] - close_btn.geom.dim[0]; // Align right
//       close_btn.SetName('close_btn');

//       // this.geom.dim[0] += close_btn.geom.dim[0]; // Widen the menu rect area by the width of the close button
//       this.geom.dim[0] += close_btn.geom.dim[0] * 2;
//       this.geom.dim[1] = (this.geom.dim[1] < close_btn.geom.dim[1]) ? close_btn.geom.dim[1] + this.pad[1] : this.geom.dim[1];

//       this.close_btn_idx = this.AddChild(close_btn);

//       // Realign menu's children
//       this.ReAlign();
//    }


//    AddMinimizeButton(ROOT_WIDGET_FLAGS, root, fontsize = 0, col = GREY[3], text_col = WHITE, pad = [4, 2], bold = .4, font = TEXTURES.MSDF_CONSOLAS_1024, style = [6, 5, 3]) {

//       if (!fontsize) fontsize = this.text_mesh.geom.dim[0];
//       let pos = [100, 200, 0]
//       pos[2] += 1; // Put close button in front of the parent widget.

//       const minimize_btn = Create_widget_minimize_btn(ROOT_WIDGET_FLAGS, root, pos, fontsize, col, text_col, pad, bold, style);
//       minimize_btn.text_mesh.geom.pos[0] += this.geom.dim[0] - minimize_btn.geom.dim[0]; // Align right
//       minimize_btn.SetName('minimize_btn')

//       this.geom.dim[0] += minimize_btn.geom.dim[0];
//       this.geom.dim[1] = (this.geom.dim[1] < minimize_btn.geom.dim[1]) ? minimize_btn.geom.dim[1] + this.pad[1] : this.geom.dim[1];

//       this.minimize_btn_idx = this.AddChild(minimize_btn);

//       this.ReAlign();

//    }


//    Destroy(_this) {

//       // Menu's children(close/minimize etc) destruction
//       for (let i = 0; i <= _this.children.boundary; i++) {

//          const child = _this.children.buffer[i];
//          child.Destroy();
//       }

//       // Menus's destruction
//       return super.Destroy();
//    }


//    AddToWidgetRootBuffer(root_bufferidx) {

//       this.root_bufferidx = root_bufferidx;
//       Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

//       this.text_mesh.root_bufferidx = root_bufferidx;
//       Widget_root_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);

//       if (this.close_btn_idx !== INT_NULL) {

//          const close_btn = this.children.buffer[this.close_btn_idx];
//          close_btn.AddToWidgetRootBuffer(root_bufferidx)
//       }

//       if (this.minimize_btn_idx !== INT_NULL) {

//          const minimize_btn = this.children.buffer[this.minimize_btn_idx];
//          minimize_btn.AddToWidgetRootBuffer(root_bufferidx)
//       }
//    }


//    /*******************************************************************************************************************************************************/
//    // Graphics
//    GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, gfxidx) {

//       const gfx = super.GenGfxCtx(FLAGS, gfxidx); // For the menu meshes

//       for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes
//          const child = this.children.buffer[i];
//          child.GenGfxCtx(FLAGS, gfxidx)
//       }
//       return gfx;
//    }


//    Render() {

//       super.Render(); // For the menu meshes

//       for (let i = 0; i <= this.children.boundary; i++) { // For the children meshes

//          const child = this.children.buffer[i];
//          if (!child.is_gfx_inserted) { child.Render(); }
//          if (!child.text_mesh.is_gfx_inserted) { child.text_mesh.Render(); }
//       }
//    }



//    /*******************************************************************************************************************************************************/
//    // Setters-Getters

//    /** Return type: Array. Returns an array of all widgets meshes */
//    GetAllMeshes() {

//       let all_meshes = [this, this.text_mesh];
//       for (let i = 0; i <= this.children.boundary; i++) {
//          const child = this.children.buffer[i]
//          all_meshes = child.GetAllMeshes(all_meshes)
//       }
//       return all_meshes;
//    }



//    /*******************************************************************************************************************************************************/
//    // Events Handling

//    // SEE ### OnMove Events Implementation Logic
//    OnMove(params) {

//       // The 'OnMove' function is called by the timeInterval.
//       // The timeInterval has been set by the 'OnClick' event.
//       const menu = params.params;
//       const text_mesh = menu.text_mesh;

//       // Destroy the time interval and the Move operation, if the mesh is not grabed
//       // MESH_STATE.IN_GRAB is deactivated upon mouse click up in Events.js.
//       if (menu.StateCheck(MESH_STATE.IN_GRAB) === 0 && menu.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

//          const intervalIdx = menu.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
//          TimeIntervalsDestroyByIdx(intervalIdx);
//          menu.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

//          return;
//       }

//       // Move menu widget
//       const mouse_pos = MouseGetPosDif();
//       menu.geom.MoveXY(mouse_pos.x, -mouse_pos.y, menu.gfx);


//       // Move menu children widgets(close/minimize buttons)
//       for (let i = 0; i <= menu.children.boundary; i++) {

//          const widget_child = menu.children.buffer[i];
//          widget_child.geom.MoveXY(mouse_pos.x, -mouse_pos.y, widget_child.gfx)
//          widget_child.text_mesh.geom.MoveXY(mouse_pos.x, -mouse_pos.y, widget_child.text_mesh.gfx)
//       }

//    }


//    // SEE ### Construct Listeners
//    ConstructListeners(_root = null) {

//       // const mesh = (_mesh) ? _mesh : this; // If in recursion, use as the current mesh the passed param. 
//       const mesh = this; // If in recursion, use as the current mesh the passed param. 
//       const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
//       // console.log('****', mesh.GetName(), mesh.listeners.buffer)

//       const root_evt = root.listeners.buffer;

//       for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

//          if(mesh.listeners.buffer[i]){

//             mesh.AddListenEvent(etypeidx, child.OnClick, evt_params, root_evt);
//          }

//          for (let i = 0; i <= mesh.children.boundary; i++) {

//             const child = mesh.children.buffer[i];
//             if (child) {
//                const evt = child.listeners.buffer[etypeidx];
//                if (evt) { // If event is not null
//                   const evt_params = {
//                      EventClbk: null,
//                      targetBindingFunctions: null,
//                      target_mesh: child,
//                      params: null,
//                   }
//                   child.AddListenEvent(etypeidx, child.OnClick, evt_params, root_evt);
//                }
//             }
//          }
//       }
//    }
//    // ConstructListeners(_root = null) {

//    //    // const mesh = (_mesh) ? _mesh : this; // If in recursion, use as the current mesh the passed param. 
//    //    const mesh = this; // If in recursion, use as the current mesh the passed param. 
//    //    const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 
//    //    // console.log('****', mesh.GetName(), mesh.listeners.buffer)

//    //    const root_evt = root.listeners.buffer;

//    //    for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

//    //       for (let i = 0; i <= mesh.children.boundary; i++) {

//    //          const child = mesh.children.buffer[i];
//    //          if (child) {
//    //             const evt = child.listeners.buffer[etypeidx];
//    //             if (evt) { // If event is not null
//    //                const evt_params = {
//    //                   EventClbk: null,
//    //                   targetBindingFunctions: null,
//    //                   target_mesh: child,
//    //                   params: null,
//    //                }
//    //                child.AddListenEvent(etypeidx, child.OnClick, evt_params, root_evt);
//    //             }
//    //          }
//    //       }
//    //    }
//    // }



//    /*******************************************************************************************************************************************************/
//    // Alignment

//    ReAlign() {

//       // Realign menu's text
//       this.Align(ALIGN.LEFT, this.pad);

//       let pad = [this.pad[0], this.pad[1]];

//       for (let i = 0; i <= this.children.boundary; i++) {

//          const child = this.children.buffer[i];
//          Align_self_get_dif(ALIGN.RIGHT, this.geom, _, child.geom, pad); // Align the close/minimize buttons area_mesh to the menu area mesh.
//          child.Align(ALIGN.RIGHT, pad); // Also we need to update the close/minimize buttons text_mesh position(by aligning)
//          pad[0] += this.children.buffer[i].geom.dim[0] * 2; // Each child widget of the menu is positioned relative to the previous child.
//       }

//    }


//    Reposition_post(pos_dif) {

//       this.MoveXYZ(pos_dif);
//       this.text_mesh.MoveXYZ(pos_dif);

//       // Menu's children(close/minimize etc) destruction
//       for (let i = 0; i <= this.children.boundary; i++) {
//          const child = this.children.buffer[i];
//          child.Reposition_post(pos_dif);
//       }
//    }


//    Reposition_pre(pos_dif) {
//       console.error('NO BATCH CREATED')
//       AddArr2(this.geom.pos, pos_dif);
//       CopyArr2(this.geom.defPos, this.geom.pos);
//       this.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
//       // Batch_store(this, _, { pos: pos_dif }, _);

//       AddArr2(this.text_mesh.geom.pos, pos_dif);
//       CopyArr2(this.text_mesh.geom.defPos, this.text_mesh.geom.pos);
//       this.text_mesh.batch_fnidx = BATCH_FN_IDX.SET_WPOS4;
//       // Batch_store(this.text_mesh, _, { pos: pos_dif }, _);

//       // Menu's children(close/minimize etc) destruction
//       for (let i = 0; i <= this.children.boundary; i++) {

//          const child = this.children.buffer[i];
//          child.Reposition_pre(pos_dif);
//       }
//    }



//    /*******************************************************************************************************************************************************/
//    // Transformations

//    Move(x, y) {

//       if (x === 0 && y === 0) return;

//       // Move 'this' text
//       this.geom.MoveXY(x, y, this.gfx);
//       this.text_mesh.geom.MoveXY(x, y, this.text_mesh.gfx);

//       // Move menu children widgets(close/minimize buttons)
//       for (let i = 0; i <= this.children.boundary; i++) {

//          const child = this.children.buffer[i];
//          child.geom.MoveXY(x, y, child.gfx);
//          child.text_mesh.geom.MoveXY(x, y, child.text_mesh.gfx);
//       }
//    }

// }

/*****************************************************************************************************************************************************************/















/*****************************************************************************************************************************************************************/
/**SAVE Expand Function with recursive calculation of parent margins*/


// function Expand(parent, options, width, accum_margins) {

//    let opt = options
//    for (let i = 0; i <= parent.children.boundary; i++) {

//       const child = parent.children.buffer[i];
//       if (options & SECTION.INHERIT) opt = parent.options

//       if (child.type & MESH_TYPE.WIDGET_LABEL && child.type & MESH_TYPE.WIDGET_TEXT_DYNAMIC) {
//          // child.Resize(); // TODO: Implement
//          child.geom.dim[0] = width - (parent.StylesGetMargin(STYLES.AXIS.X) + accum_margins);
//          child.geom.defDim[0] = child.geom.dim[0];
//       }
//       else if (child.type & MESH_TYPE.SECTION_MESH) {

//          // child.Resize();
//          if (opt & SECTION.VERTICAL) {
//             child.geom.dim[0] = width - accum_margins;
//             child.geom.defDim[0] = child.geom.dim[0];
//          }
//          else if (opt & SECTION.HORIZONTAL) {

//          }

//          accum_margins += child.StylesGetMargin(STYLES.AXIS.X);
//          // HACK: Pass the parent's options so that if parent parent is vertical align for children, the children will expand. The option of the child counts for it's children expansion. 
//          Expand(child, opt, width, accum_margins);
//          accum_margins -= child.StylesGetMargin(STYLES.AXIS.X);
//       }
//    }

//    return accum_margins;
// }
/*****************************************************************************************************************************************************************/















/*****************************************************************************************************************************************************************/
// Old Section's calulate positions


// export function Calculate_positions_no_gfx_update_recursive(parent, options) {

//    const pad = [0, 0]
//    const cur_pos = [parent.geom.pos[0], parent.geom.pos[1]];

//    // TODO: Quick and Dirty-Implement Better. Here we check for any parent's that have text meshes 
//    if (parent.text_mesh) {
//       const c_x = cur_pos[0], c_y = cur_pos[1]; // curent position
//       const parent_dimx = parent.GetMaxWidth(), parent_dimy = parent.GetTotalHeight(); // parent mesh dimention
//       // const parent_margx = parent.margin[0], parent_margy = parent.margin[1]; // parent mesh margin

//       const parent_margx = parent.StylesGetMargin(STYLES.AXIS.X), parent_margy = parent.StylesGetMargin(STYLES.AXIS.Y); // parent mesh margin
//       const new_pos = [(c_x - parent_dimx) + parent.text_mesh.GetMaxWidth() + parent_margx, (c_y - parent_dimy) + parent.text_mesh.geom.dim[1] + parent_margy, parent.geom.pos[2] + 1,];
//       const pos_dif = [new_pos[0] - (parent.text_mesh.GetCenterPosX()), new_pos[1] - parent.text_mesh.GetCenterPosY(), new_pos[2] + 1];
//       parent.text_mesh.MoveNoGfxUpdate(pos_dif[0], pos_dif[1]);
//    }


//    for (let i = 0; i <= parent.children.boundary; i++) {

//       const mesh = parent.children.buffer[i];
//       let continue_recur = true;
//       let opt = options


//       if (options & SECTION.INHERIT) opt = parent.options

//       const mesh_max_width = mesh.GetMaxWidth();


//       if (parent.type & MESH_TYPE.SECTION_MESH) { // For meshes with a parent of type Section

//          let new_pos = [0,0,0];
//          CopyArr3(new_pos, mesh.geom.pos);
         
//          const c_x = cur_pos[0];
//          const c_y = cur_pos[1];

//          const parent_dimx = parent.GetMaxWidth(), parent_dimy = parent.GetTotalHeight(); // parent mesh dimention
//          const parent_margx = parent.StylesGetMargin(STYLES.AXIS.X), parent_margy = parent.StylesGetMargin(STYLES.AXIS.Y); // parent mesh margin

//          new_pos = [(c_x - parent_dimx) + mesh_max_width + parent_margx, (c_y - parent_dimy) + mesh.geom.dim[1] + parent_margy, parent.geom.pos[2] + 1,];
//          const pos_dif = [new_pos[0] - (mesh.GetCenterPosX()), new_pos[1] - mesh.GetCenterPosY(), new_pos[2] + 1];

//          // console.log('ooooooooooo', pos_dif, mesh.GetName())

//          if (pos_dif[0] || pos_dif[1]) {

//             if ((mesh.type & MESH_TYPE.SECTION_MESH) === 0) { // Case mesh not of type section, have it update it's new pos-dim on a later when it's gfx exists.


//                mesh.MoveNoGfxUpdate(pos_dif[0], pos_dif[1]);
//                // console.log('{===}', mesh.mesh_bufferidx, mesh.GetName())


//                // HACK: Because scrollers bar is a Rect_mesh, it does not handle any children, like: scrollers handle
//                if (mesh.type & MESH_TYPE.WIDGET_SCROLLER_BAR) {
//                   mesh.children.buffer[0].geom.pos[0] += pos_dif[0];
//                   mesh.children.buffer[0].geom.pos[1] += pos_dif[1] + mesh.children.buffer[0].geom.dim[1];
//                   CopyArr2(mesh.children.buffer[0].geom.defPos, mesh.children.buffer[0].geom.pos);
//                }

//                if (parent.rel_comp) { // Reposition any meshes that have relative position for their children
//                   Relative_pos_comp_recalc_all(parent)
//                }
//                // if (mesh.rel_comp) { // Reposition any meshes that have relative position for their children
//                //    Relative_pos_comp_recalc_all(mesh)
//                // }

//                continue_recur = false; // Stop recursion for mesh's children. Let the mesh deal with it's children positioning.
//             }
//             else { // Case  mesh is of type section  

//                CopyArr2(mesh.geom.pos, new_pos);
//                CopyArr2(mesh.geom.defPos, mesh.geom.pos);
//                if (parent.rel_comp) { // Reposition any meshes that have relative position for their children
//                   Relative_pos_comp_recalc_all(parent)
//                }
//             }
//          }
//          // else {
//          //    continue_recur = false;
//          // }


//       }


//       // if (parent.rel_comp) { // Reposition any meshes that have relative position for their children
//       //    Relative_pos_comp_recalc_all(parent)
//       // }
      
      
      
//       if (continue_recur) // Continue recursively, if the mesh does not handle any its children.
//          Calculate_positions_no_gfx_update_recursive(mesh, options)

//       const mesh_width = mesh_max_width;
//       const mesh_height = mesh.GetTotalHeight();


//       // Increment current postision tracker
//       if (opt & SECTION.VERTICAL) {
//          cur_pos[1] += (mesh_height * 2);
//       }
//       else if (opt & SECTION.HORIZONTAL) {
//          cur_pos[0] += mesh_width * 2;
//       }

            
//       // if (mesh.rel_comp) { // Reposition any meshes that have relative position for their children
//       //    Relative_pos_comp_recalc_all(mesh)
//       // }
//    }



// }



// export function Calculate_positions_no_gfx_update_recursive(parent, options, cur_pos) {


/*****************************************************************************************************************************************************************/















/*****************************************************************************************************************************************************************/
/*****************************************************************************************************************************************************************/


