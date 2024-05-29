


// TODO: Component choosing. Color, Pos, Dim, etc
// TODO: Interleaved/NotInterleaved Instanced/PerVertex choosing. 

// FIXME

// UNUSED

Choosing implementation for color attribute 
1. if col is per vertex
2. if col is per instance
3. if col is per vb
Choosing implementation for wpos attribute 
1. if wpos is per vertex
2. if wpos is per instance
3. if wpos is per vb
Choosing implementation for dim attribute 
1. if dim is per vertex
2. if dim is per instance
3. if dim is per vb

col=2
wpos=2
dim=1

7 combinations to choose from
if(col==pos==dim) Set one vertex buffer
if(col==pos) Set 2 vertex buffer
if(col==dim) Set 2 vertex buffer
if(pos==dim) Set 2 vertex buffer
if(col!=pos!=dim) Set 3 vertex buffer

// FIXME: In Draw() there is no need to bind each buuffer separately, only if they need update()

Since we have different vertex buffers for a mesh, we need to have access from:
a single value?
OR
mesh has all vb indexes?

Do we use the attribute to store the vb it belongs to?
col vbidx = 1
wpos vbidx = 1
dim vbidx = 2

const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], [100, 200, 0], [100, 20], TRANSPARENCY(GREEN[7], .1), 'sdf linem2');
{
   EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE)
   EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
   SetStyle(style);
   Widget_root_create_root(this.mesh_bufferidx)
}

line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)


line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
{
   super.GenGfxCtx(FLAGS, gfxidx, params)
   {
      Gfx_generate_context(FLAGS, this, gfxidxs);
      {
         Find_gfx_match_from_mesh_tree(FLAGS, mesh, spesific_gfx_idxs);
         {
            // Program creation
            Program_create_program(sid, uniforms)
            {
               Shaders_load(gfxCtx.gl, sid, uniforms)
               Shader_attributes_create(sid, this.shader_program) // NOTE: Correctly we create here the attributes sceme, by reading the programs attribuute names
               Select_fnidx_to_fill_vertex_buffer(this.attribsidx)
               Uniforms_buffer_create_uniform(gfxCtx.gl, prog.shader_program, uniforms[i].type, uniforms[i].name, progidx)
               Mesh_set_uniform_ubidx_from_name(uniforms, ubidx, uniforms[i].name);
               Uniforms_buffer_set_uniform(ubidx, [mesh.geom.pos[0], mesh.geom.pos[1]]); // FIXME: Needs mesh position data
               Uniforms_buffer_update_uniform(ubidx);
            }
            Scene_set_projection_matrix(sceneidx)
            Uniforms_block_get_uniform_by_name('u_screen_res')
            Uniforms_block_set_uniform(unifidx, [VIEWPORT.WIDTH, VIEWPORT.HEIGHT])
            // Vertex buffer
            Vertex_buffer_create(sid, _, progidx)
            {
               Vertex_buffer_data_create(type, size)
               {
                  Typed_array_create_from_type(type, size)
                  // TODO: Here we decide if we need interleaved buffer or instanced buffer and create that number of vertex buffers?
               }
               Shader_attributes_enable(attribsidx)
            }
            Mesh_per_vb_create_vb(vbidx)
            // Index buffer
            index_buffer_info_create(sid, _, TEMPORARY_INDEX_BUFFER_RECOGNITION_PATTERN.rect_123_234)
            // Render queue
            Renderqueue_Add(progidx, vbidx, ibidx, true);
            Renderqueue_set_active(vbidx, true); // Update the draw buffer
            Vertex_buffer_group_set_ibidx(vbidx, ibidx); // Create a refference of ib to vb
            Widget_root_gfx_add(root_bufferidx, mesh_bufferidx, progidx, vbidx);
            Widget_root_batch_assign_and_accum_to_vb(root_bufferidx, mesh_bufferidx, progidx, vbidx, mesh_count)
            // Create root wpos for vertex buffer uniform 
            Mesh_unif_create_vb_root_wpos(mesh.mesh_bufferidx, mesh.geom.pos, mesh.type, mesh.nameidx, mesh.parent, vbidx) // FIXME: Needs mesh position data
         }
      }
   }
   for (let i = 0; i <= this.children.boundary; i++) 
      if (child) child.GenGfxCtx(FLAGS, gfxidx, params);
}



line.Render();
{
   super.AddToGfx()
   {
      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, this.GetName(), this.idx)
      Mesh_per_vb_store_mesh(this.gfx.vb.idx, this.mesh_bufferidx)
      Gl_operation_add(prog.add_to_vb_fnidx, vb_data, geom, mat, start, num_faces, shader_attribs.attribs_per_vertex)
   }

   for (let i = 0; i <= this.children.boundary; i++)
      child.Render();
}



line.ConstructListeners();




Assuming the following:
A text to be rendered. The Text is '1234'. So we need to draw 4 rectangles, or 4*4=16 vertices in an indexed geometry context.
We want the folowing attributes: col: color rgba, dim: dimention xy, pos: world position xyz 
That is:
   For color: We need same color for all text faces, that is 4 floats.
   For dim: We need xy for each vertex, that is 2 floats * 4 vertices = 8 floats.
   For pos: We need xyz for each face, that is 3 floats * 4 faces = 12 floats
The question is: Can I use the same vertex buffer (interleved data) for any of the above requirements? Or it is necessary to create 3 separate vertex buffers?