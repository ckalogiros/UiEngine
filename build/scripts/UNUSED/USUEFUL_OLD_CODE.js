

// SHADER ATTRIBUTE LOCATIONS
let locidx = gfxCtx.gl.getAttribLocation(shader_program, 'a_col');
if (locidx !== INT_NULL) {
   shader_attribs.locs[locidx] = locidx; // Seems redundant because the index and its value are the same, but that does not happen with sizes and offsets.
   shader_attribs.sizes[locidx] = (sid.attr & SID.ATTR.COL4) ? 4 : (0); // TODO: May extend for .COL3 or any other case
   shader_attribs.names[locidx] = Str_buffer_store('a_cola_wpos_time');
}

locidx = gfxCtx.gl.getAttribLocation(shader_program, 'a_wpos_time');
if (locidx !== INT_NULL) {
   shader_attribs.locs[locidx] = locidx;
   shader_attribs.sizes[locidx] = (sid.attr & SID.ATTR.WPOS_TIME4) ? 4 : (0); // TODO: May extend for .WPOS3 etc.
   shader_attribs.names[locidx] = Str_buffer_store('a_wpos_time');
}

locidx = gfxCtx.gl.getAttribLocation(shader_program, 'a_pos');
if (locidx !== INT_NULL) {
   shader_attribs.locs[locidx] = locidx;
   shader_attribs.sizes[locidx] = (sid.attr & SID.ATTR.POS2) ? 2 : (sid.attr & SID.ATTR.POS3) ? 3 : (0);
   shader_attribs.names[locidx] = Str_buffer_store('a_pos');
}

locidx = gfxCtx.gl.getAttribLocation(shader_program, 'a_tex');
if (locidx !== INT_NULL) {
   shader_attribs.locs[locidx] = locidx;
   shader_attribs.sizes[locidx] = (sid.attr & SID.ATTR.TEX2) ? 2 : (0);
   shader_attribs.names[locidx] = Str_buffer_store('a_tex');
}

locidx = gfxCtx.gl.getAttribLocation(shader_program, 'a_params1');
if (locidx !== INT_NULL) {
   shader_attribs.locs[locidx] = locidx;
   shader_attribs.sizes[locidx] = (sid.attr & SID.ATTR.PARAMS1) ? 4 : (0);
   shader_attribs.names[locidx] = Str_buffer_store('a_params1');
}

locidx = gfxCtx.gl.getAttribLocation(shader_program, 'a_sdf');
if (locidx !== INT_NULL) {
   shader_attribs.locs[locidx] = locidx;
   shader_attribs.sizes[locidx] = (sid.attr & SID.ATTR.SDF) ? 2 : (0);
   shader_attribs.names[locidx] = Str_buffer_store('a_sdf');
}



/*******************************************************************************************************************************************************************************/
/*******************************************************************************************************************************************************************************/
/*******************************************************************************************************************************************************************************/
export function Program_get_group_bygroupidxGL_PROGRAM_GET_SHADER_INFO_TEMP(groupidx, progidx) {
   alert('368 Program_get_group_bygroupidxGlProgram.js')
      const prog = _program_groups.buffer[groupidx].buffer[progidx];
   
      const attribsPerVertex = prog.shaderinfo.attribsPerVertex;
      const loc = prog.shaderinfo.attributes.loc;
      const size = prog.shaderinfo.attributes.size;
      const offset = prog.shaderinfo.attributes.offset;
   
      const shader_info = {
         locations: new Int8Array(8),
         sizes: new Int8Array(8),
         offsets: new Int8Array(8),
         attribsPerVertex: attribsPerVertex,
      }
   
      for (let i = 0; i < 8; i++) {
         shader_info.locations[i] = -1;
         shader_info.sizes[i] = -1;
         shader_info.offsets[i] = -1;
      }
   
      // For Uniforms
      if (loc.col >= 0) {
         shader_info.locations[loc.col] = loc.col;
         shader_info.sizes[loc.col] = size.col;
         shader_info.offsets[loc.col] = offset.col;
      }
      if (loc.pos >= 0) {
         shader_info.locations[loc.pos] = loc.pos;
         shader_info.sizes[loc.pos] = size.pos;
         shader_info.offsets[loc.pos] = offset.pos;
      }
      if (loc.tex >= 0) {
         shader_info.locations[loc.tex] = loc.tex;
         shader_info.sizes[loc.col] = size.tex;
         shader_info.offsets[loc.tex] = offset.tex;
      }
      if (loc.wposTime >= 0) {
         shader_info.locations[loc.wposTime] = loc.wposTime;
         shader_info.sizes[loc.wposTime] = size.wposTime;
         shader_info.offsets[loc.wposTime] = offset.wposTime;
      }
      if (loc.params1 >= 0) {
         shader_info.locations[loc.params1] = loc.params1;
         shader_info.sizes[loc.params1] = size.params1;
         shader_info.offsets[loc.params1] = offset.params1;
      }
      if (loc.style >= 0) {
         shader_info.locations[loc.style] = loc.style;
         shader_info.sizes[loc.style] = size.style;
         shader_info.offsets[loc.style] = offset.style;
      }
      if (loc.time >= 0) {
         shader_info.locations[loc.time] = loc.time;
         shader_info.sizes[loc.time] = size.time;
         shader_info.offsets[loc.time] = offset.time;
      }
      if (loc.sdf >= 0) {
         shader_info.locations[loc.sdf] = loc.sdf;
         shader_info.sizes[loc.sdf] = size.sdf;
         shader_info.offsets[loc.sdf] = offset.sdf;
      }
   
      return shader_info;
   }












/*******************************************************************************************************************************************************************************/
/*******************************************************************************************************************************************************************************/
/*******************************************************************************************************************************************************************************/


