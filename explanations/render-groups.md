# Render groups




# With render groups we are able to un-draw re-draw  and manipulate differently portions of a vb.
   We must have an 'active' variable to check against(in the main loop!!)
   OR create a an abstraction struct of only active render groups
   OR unify Renderqueue with active render groups 




# Decision: Where the render group idx is stored in the mesh's .render_grouidx 
   -> MeshBufferViews.js
   -> In many places inside the function View_add_mesh().

# Decision: Child inherits parent's render group
   -> MeshBufferViews.js
   -> Build_per_gfx_view_group_from_root_mesh_recursive()
   -> if(mesh.gfx.vb.groupidx === child.gfx.vb.groupidx) {
        child.gfx.vb.render_groupidx = mesh.gfx.vb.render_groupidx;
      }

# Decision: Where new render group is created from flags set by the user
   -> MeshBufferViews.js
   -> View_add_mesh()
   -> if (view_rgidx === INT_NULL || mesh.gfx_ctx_flags & GFX_CTX_FLAGS.NEW_RENDER_GROUP)

# Decision: Where the first render group (default) is created
   * There is an else if render group does not exist
   -> MeshBufferViews.js
   -> View_add_mesh()
   ->    else { // Else if not found, create new View.
               const render_groups = New_generic_buffer(_, 'MeshViewGroup-RenderGroupBuffer');
               const new_render_groupidx = Vertex_buffer_render_group_create(0, 0);

# Decision: Where the render group 'start' and 'size' are calculated
   -> It is calculated in the VertexBuffers.js file
      by Vertex_buffer_calculate_render_group_starts() function
      where we run for each vertexbuffer->for each rendergroup

# Decision: Where the render group 'num_faces'is calculated
   -> In MeshBufferViews.js
      By View_add_mesh() in many places.
      The num_faces accumulates the number of faces for each mesh.



# Decision: Where the render group 'count' index is calculated
   -> It is calculated in the VertexBuffer.js file
      By Vertex_buffer_add_vertices_from_render_group()
      when individual meshes are inserted in the vertex buffer
      'render_group.count += total_attribs'

# Decision: Where the index buffer is build
   * Via the MeshBufferViews.js
   There is a specific function that builds the index buffer for all vertexbuffers of the current view group 
   ISSUE: With Current implementation the same vertex buffers CANNOT be shared via render groups across root widgets. A new group will be created and the find-match algo will create new vb
      If the same vb is to be created then the index buffer will be populated without advancing the index count, rather it will reset to 0 index for the second root widget 








# What if a mesh needs to be drawn on runtime? (Like dropdown menus and items)
   For now the impl of dropdown menus is a quick fixand is as follows:
   The menu gets activated along with its items.
   For the first time init of the menu:
      the menu must be inserted in a view render group
      and the starts and sizes of the render group are calculated.
      But the mesh hasn't been added to the vb and the start attrib index is not stored in the meshes.
   Finally we call render from group, where for each mesh we check if it is already 'is_gfx_inserted'
   and call accordingly.

