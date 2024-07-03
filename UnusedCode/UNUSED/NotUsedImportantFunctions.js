

/*************************************************************************************************************************************************************************************************/
// FROM GlBuffers.js
/*************************************************************************************************************************************************************************************************/

  
  
  export function Gl_add_geom_mat_to_vb_at_meshindex(sid, gfx, geom, mat, mesh_name) {
  
      // console.log(meshidx, mesh_name)
      /**DEBUG ERROR*/ if (geom.pos[0] === undefined) { console.error('Pos is UNDEFINED. mesh:', mesh_name) }
      /**DEBUG ERROR*/ if (geom.dim[0] === undefined) { console.error('Dim is UNDEFINED. mesh:', mesh_name) }
      /**DEBUG ERROR*/ if (mat.col[0] === undefined) { console.error('Col is UNDEFINED. mesh:', mesh_name) }
      /**DEBUG ERROR*/ if (mat.style[0] === undefined) { console.error('Style is UNDEFINED. mesh:', mesh_name) }
      /**DEBUG ERROR*/ temp_check_nan_rename_me(geom.pos); temp_check_nan_rename_me(geom.dim); temp_check_nan_rename_me(mat.col); temp_check_nan_rename_me(mat.style);
      // /**DEBUG ERROR*/ if(meshidx === undefined){ console.error('Mesh index is not passed as a param. mesh:', mesh_name)}
  
      const groupidx = gfx.prog.groupidx;
      const progidx = gfx.prog.idx;
      const vbidx = gfx.vb.idx;
      const ibidx = gfx.ib.idx;
      const prog = Progarm_get_program(groupidx, progidx);
      const vb = Gl_vertex_buffer_info_get_by_vbidx(vbidx);
      const ib = Gl_index_buffer_info_get_by_ibidx(ibidx)
      const num_faces = 1;
      const start = gfx.vb.start;
      const count = gfx.vb.count;
  
      alert('664 GlBuffres.js prog.shaderinfo USE')
      const meshSize = gfx.attribsPerVertex * gfx.vertsPerRect * num_faces;
      if ((start + meshSize) > vb.count) {
          vb.vCount += prog.shaderinfo.verticesPerRect * gfx.num_faces;
          // Reallocate vertex buffer if it has no more space
          if (vb.count + meshSize >= vb.size) vb.Realloc(meshSize);
      }
  
  
      if (GL.BOUND_PROG_IDX !== progidx) {
          Program_use_program(prog.shader_program, progidx);
          GL.BOUND_PROG_IDX = progidx;
          gfxCtx.gl.bindVertexArray(vb.vao);
          gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.vbo);
          GL.BOUND_VBIDX = vbidx;
      }
      if (GL.BOUND_VBIDX !== vbidx) {
          gfxCtx.gl.bindVertexArray(vb.vao);
          gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.vbo);
          GL.BOUND_VBIDX = vbidx;
      }
  
  
      /**********************************************************************************************************************/
      { // Add Geometry
          if (sid.attr & SID.ATTR.POS2) { // Add Position, if the program has such an attribute 
              GlOps.VbSetAttribPos(vb, start + prog.shaderinfo.attributes.offset.pos,
                  count, prog.shaderinfo.attribsPerVertex - prog.shaderinfo.attributes.size.pos, geom.dim, num_faces);
          }
          if (sid.attr & SID.ATTR.WPOS_TIME4) { // Add World Position, if the program has such an attribute 
              if (sid.attr & SID.ATTR.POS3) {
                  GlOps.VbSetAttribWpos(vb, start + prog.shaderinfo.attributes.offset.wposTime,
                      count, prog.shaderinfo.attribsPerVertex - 3, geom.pos, 2);
              }
              else {
                  GlOps.VbSetAttribWpos(vb, start + prog.shaderinfo.attributes.offset.wposTime,
                      count, prog.shaderinfo.attribsPerVertex - prog.shaderinfo.attributes.size.wpos, geom.pos, num_faces);
              }
          }
          if (sid.attr & SID.ATTR.TIME) { // Per Vertex Timer (meant to be per mesh, 4 vertices) 
              GlOps.VbSetAttrTime(vb, start + prog.shaderinfo.attributes.offset.time,
                  count, prog.shaderinfo.attribsPerVertex - prog.shaderinfo.attributes.size.wpos, geom.time, num_faces);
          }
      }
  
      /**********************************************************************************************************************/
      { // Add Material
          if (sid.attr & SID.ATTR.COL4 && mat.col) { // Add Color, if the program has such an attribute
  
              if (!mat.col && DEBUG.WEB_GL) console.error('Style hasn\'t being set. @AddMaterial(), GlBuffers.js')
  
              // 4 color vertex
              if (sid.attr & SID.ATTR.COL4_PER_VERTEX) {
                  GlOps.VbSetAttribColPerVertex(vb, start + prog.shaderinfo.attributes.offset.col,
                      count, prog.shaderinfo.attribsPerVertex - prog.shaderinfo.attributes.size.col, mat.col, num_faces);
              }
              else { // Regular color. 1 color for all vertices
                  GlOps.VbSetAttribCol(vb, start + prog.shaderinfo.attributes.offset.col,
                      count, prog.shaderinfo.attribsPerVertex - prog.shaderinfo.attributes.size.col, mat.col, num_faces);
              }
          }
          if (sid.attr & SID.ATTR.TEX2 && mat.uv) { // Add Texture, if the program has such an attribute 
              if (!mat.uv && DEBUG.WEB_GL) console.error('Style hasn\'t being set. @AddMaterial(), GlBuffers.js')
              GlOps.VbSetAttribTex(vb, start + prog.shaderinfo.attributes.offset.tex,
                  count, prog.shaderinfo.attribsPerVertex - prog.shaderinfo.attributes.size.tex, mat.uv, num_faces);
          }
          if (sid.attr & SID.ATTR.SDF && mat.sdf_params) { // Add Texture, if the program has such an attribute 
              if (!mat.sdf_params && DEBUG.WEB_GL) console.error('Sdf hasn\'t being set. @AddMaterial(), GlBuffers.js')
              // (vb, start, count, stride, sdf_params)
              GlOps.VbSetAttrSdf(vb, start + prog.shaderinfo.attributes.offset.sdf,
                  count, prog.shaderinfo.attribsPerVertex - prog.shaderinfo.attributes.size.sdf, mat.sdf_params, num_faces);
          }
  
          let params1Index = 0; //  Handles any unused attributes of the vec4 params1 shader attribute.  
          if (sid.attr & SID.ATTR.BORDER) {
              if (!mat.style && DEBUG.WEB_GL) console.error('Style.border hasn\'t being set. @AddMaterial(), GlBuffers.js')
              else {
                  GlOps.VbSetAttrBorderWidth(vb, start + prog.shaderinfo.attributes.offset.params1 + params1Index,
                      count, prog.shaderinfo.attribsPerVertex - V_BORDER_WIDTH, mat.style[STYLE.BORDER], num_faces)
                  params1Index++;
              }
          }
          if (sid.attr & SID.ATTR.R_CORNERS) {
              if (!mat.style && DEBUG.WEB_GL) console.error('Style.rCorners hasn\'t being set. @AddMaterial(), GlBuffers.js')
              else {
                  GlOps.VbSetAttrRoundCorner(vb, start + prog.shaderinfo.attributes.offset.params1 + params1Index,
                      count, prog.shaderinfo.attribsPerVertex - V_ROUND_CORNERS, mat.style[STYLE.R_CORNERS], num_faces)
                  params1Index++;
              }
          }
          if (sid.attr & SID.ATTR.FEATHER) {
              if (!mat.style && DEBUG.WEB_GL) console.error('Style.feather hasn\'t being set. @AddMaterial(), GlBuffers.js')
              else {
                  GlOps.VbSetAttrBorderFeather(vb, start + prog.shaderinfo.attributes.offset.params1 + params1Index,
                      count, prog.shaderinfo.attribsPerVertex - V_BORDER_FEATHER, mat.style[STYLE.FEATHER], num_faces)
                  params1Index++;
              }
          }
          /** IMPORTANT! The stayle attributes(counts 3 attributes) use the attrParams vector4 to be passed.
           * Therefore, in order to count the totaol attributes we must take into consideration the empty attribute
           */
          if (sid.attr & SID.ATTR.EMPTY) { // Increment vertex count for unused vector elements
              vb.count += prog.shaderinfo.verticesPerRect * num_faces;
          }
      }
  
      /**********************************************************************************************************************/
      // Create indices
      if (sid.shad & SID.SHAD.INDEXED) {
  
          // Check for buffer realloc
          if (ib.count + num_faces * INDICES_PER_RECT > ib.size) {
              ib.Realloc();
          }
  
          gfx.ib.start = ib.count;
          ib.Add(num_faces)
          gfx.ib.count = ib.count;
      }
  
  
      prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
      vb.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
  
      // if ((vb.state.mask & BUFFER_STATE.SHOW) === 0)
          // Gl_vertex_buffer_set_show(this.gfx.prog.groupidx, this.gfx.prog.idx, this.gfx.vb.idx, flag);
          // TODO: DONT FORGET TO UPDATE THE RENDERQUE OR SET AN UPDATE IF RENDERQUEUE CHNGED TO AVOID THE OVERHEAD    }
  
      // Store the texture index in the vertex
      vb.texidx = mat.texidx;
  
      /**DEBUG */CreateUniqueMesh(vb.meshesNames, `${mesh_name} start:${start}`);
  
      return start;
  }
  
  
  
  export function Gl_shift_right_geometry(gfx, num_faces = 1, new_num_faces = null) {
  
      const vb = Gl_vertex_buffer_info_get_by_vbidx(gfx.prog.groupidx, gfx.prog.idx, gfx.vb.idx);
  
      const ret = {
          counts: [0, 0],
          last: (gfx.vb.start + gfx.vb.count * num_faces >= vb.count) ? true : false,
          start: gfx.vb.start
      };
  
      if (DEBUG.GFX.REMOVE_MESH) console.log('idx:', gfx.prog.idx, gfx.vb.idx, 'vb count:', vb.count, ' attributes from start:', gfx.vb.start, ' to:', gfx.vb.start + gfx.vb.count * num_faces)
      ret.counts[0] = vb.Shift_geometry(gfx, num_faces, new_num_faces);
      if (DEBUG.GFX.REMOVE_MESH) console.log('vb count:', vb.count, ' remove:', ret.counts[0], ' attributes from start:', gfx.vb.start)
      // TODO!: Implement shift for the index buffer, in case we use non-rected faces for meshes
  
      return ret;
  }
  
  
  
  export function GlHandlerAddGeometryBuffer(sid, gfx, meshName, posBuffer, dimBuffer) {
      alert('GlBuffres.js prog.shaderinfo USE')
      const groupidx = gfx.prog.groupidx;
      const progidx = gfx.prog.idx;
      const vbidx = gfx.vb.idx;
      const ibidx = gfx.ib.idx;
      const prog = Progarm_get_program(groupidx, progidx);
      const vb = Gl_vertex_buffer_info_get_by_vbidx(vbidx);
      const ib = Gl_progs_get_ib_byidx(gfx.prog.groupidx, gfx.prog.idx, gfx.ib.idx);
      // const ib = Gl_progs_get_ib_byidx(groupidx, progidx, ibidx);
  
      if (GL.BOUND_PROG_IDX !== progidx) {
          Program_use_program(prog.shader_program, progidx);
          GL.BOUND_PROG_IDX = progidx;
      }
      if (GL.BOUND_VBIDX !== vbidx) {
          gfxCtx.gl.bindVertexArray(vb.vao)
          gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.vbo);
          GL.BOUND_VBIDX = vbidx;
      }
  
      CreateUniqueMesh(vb.meshesNames, meshName);
  
      // Reallocate vertex buffer if it has no more space
      const meshSize = gfx.attribsPerVertex * gfx.vertsPerRect * gfx.num_faces;
      if (vb.vCount * gfx.attribsPerVertex + meshSize >= vb.size) {
          vb.Realloc(meshSize);
      }
  
      const stride = prog.shaderinfo.attribsPerVertex;
      let start = gfx.vb.start + prog.shaderinfo.attributes.offset.pos;
      const vbAttrCount = (prog.shaderinfo.attribsPerVertex * prog.shaderinfo.verticesPerRect) * gfx.num_faces;
      GlOps.VbSetAttribBuffer(vb, start, vbAttrCount, stride, dimBuffer, prog.shaderinfo.attributes.size.pos);
      start = gfx.vb.start + prog.shaderinfo.attributes.offset.wposTime;
      GlOps.VbSetAttribBuffer(vb, start, vbAttrCount, stride, posBuffer, prog.shaderinfo.attributes.size.pos); // Repeat the wpos for every vertex(vb.count)
      if (sid.attr & SID.ATTR.WPOS_TIME4) {
          start = gfx.vb.start + prog.shaderinfo.attributes.offset.time;
          const time = [1,];
          GlOps.VbSetAttribBuffer(vb, start, vbAttrCount, stride, time, prog.shaderinfo.attributes.size.time); // Repeat the wpos for every vertex(vb.count)
      }
  
      prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
      vb.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
      vb.vCount += prog.shaderinfo.verticesPerRect * gfx.num_faces;
  
      /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       * Add Mesh to Index Buffer
       */
      if (sid.shad & SID.SHAD.INDEXED) {
  
          // Check for buffer realloc
          if (ib.count + gfx.num_faces * INDICES_PER_RECT > ib.size) {
              ib.Realloc();
          }
  
          gfx.ib.start = ib.count;
          ib.Add(gfx.num_faces)
          gfx.ib.count = ib.count;
      }
  }
  
  
  
  export function GlHandlerAddMaterialBuffer(sid, gfx, colBuffer, texBuffer) {
  
      const groupidx = gfx.prog.groupidx;
      const progidx = gfx.prog.idx;
      const vbidx = gfx.vb.idx;
      const prog = Progarm_get_program(groupidx, progidx);
      const vb = Gl_vertex_buffer_info_get_by_vbidx(vbidx);
  
      if (GL.BOUND_PROG_IDX !== progidx) {
          Program_use_program(prog.shader_program, progidx);
          GL.BOUND_PROG_IDX = progidx;
      }
      if (GL.BOUND_VBIDX !== vbidx) {
          gfxCtx.gl.bindVertexArray(vb.vao)
          gfxCtx.gl.bindBuffer(gfxCtx.gl.ARRAY_BUFFER, vb.vbo);
          GL.BOUND_VBIDX = vbidx;
      }
  
      const attribSize = prog.shaderinfo.attributes.size.col;
      const stride = prog.shaderinfo.attribsPerVertex;
      let start = gfx.vb.start + prog.shaderinfo.attributes.offset.col;
      const vbCount = (prog.shaderinfo.attribsPerVertex * prog.shaderinfo.verticesPerRect) * gfx.num_faces;
      GlOps.VbSetAttribBuffer(vb, start, vbCount, stride, colBuffer, attribSize); // Repeat the col for every vertex(vb.count)
      prog.state.mask |= PROGRAM_STATE.ACTIVE; // Sets a program to 'active', only if there are meshes in the program's vb
      vb.state.mask |= BUFFER_STATE.NEEDS_UPDATE;
  
  }
  
  
  
  export function GlHandlerAddIndicesBuffer3D(gfx, buffer) {
  
      const groupidx = gfx.prog.groupidx;
      const progidx = gfx.prog.idx;
      const vbidx = gfx.vb.idx;
      const ibidx = gfx.ib.idx;
      const prog = Progarm_get_program(groupidx, progidx);
      // const ib = Gl_progs_get_ib_byidx(groupidx, progidx, ibidx);
      const ib = Gl_progs_get_ib_byidx(gfx.prog.groupidx, gfx.prog.idx, gfx.ib.idx);
  
      if (GL.BOUND_PROG_IDX !== progidx) {
          Program_use_program(prog.shader_program, progidx);
          GL.BOUND_PROG_IDX = progidx;
      }
      if (GL.BOUND_VBIDX !== vbidx) {
          console.error('Fix the buffer binding for index buffer insertion. @ GlBuffers.js')
      }
  
      // gfx.ib.start = ib.count;
      IndicesCreateFromBuffer(ib, buffer);
      gfx.ib.count = ib.count;
      console.log('ib:', ib)
  }
  
  

// export function GlRemoveFromEndOfVertexBuffer(vb, gfx, num_faces) {

//     // const vb = Gl_vertex_buffer_info_get_by_vbidx(gfx.prog.idx, gfx.vb.idx);
//     const meshTotalAttrCount = gfx.vb.count * num_faces;
//     const count = vb.count - (vb.count - meshTotalAttrCount);
//     const vCount = meshTotalAttrCount / gfx.attribsPerVertex;
//     vb.count -= count;
//     vb.vCount -= vCount;
//     vb.needsUpdate = true;
// }






/** // TODO: The name 'VertexBufferExists' should not check for 'isPrivate'. Change the name or create another function like 'VertexBufferMatch' */
/** // CAUTION: The function does not check for sid match. The only thing that makes the function work is that the programs sid is checked erlier */
// export function VertexBufferExists(sceneidx, prog) {

//     for (let i = 0; i < prog.vb.boundary; i++) {
//         if ((prog.vb[i].state.mask & BUFFER_STATE.IS_PRIVATE === 0)) {
//             return i;
//         }
//     }
//     return -1;
// }



// function IndexBufferExists(ibidx, sceneidx, prog) {

//     for (let i = 0; i < prog.ib.boundary; i++) {
//         if (ibidx === prog.ib[i].ibidx && sceneidx === prog.ib[i].sceneidx) {
//             return i;
//         }
//     }
//     return -1;
// }



// export function GlCheckContext(sid, sceneidx) {

//     // const progs = Program_get_group(sid.progs_group);
//     const progidx = Program_program_exists(sid);

//     if (progidx !== INT_NULL) {

//         const vbidx = VertexBufferExists(sceneidx, progs.buffer[progidx]);
//         if (vbidx !== INT_NULL) return [progidx, vbidx];
//     }

//     return [INT_NULL, INT_NULL];
// }




// export function Gl_get_next_start_from_vb_count(groupidx, progidx, vbidx) {

//     const vb = Gl_vertex_buffer_info_get_by_vbidx(vbidx)
//     return vb.count;
// }





/*************************************************************************************************************************************************************************************************/
// 
/*************************************************************************************************************************************************************************************************/