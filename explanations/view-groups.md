# View groups is the idea of grouping meshes together
# A view group may contain meshes that are rendered on different gfx Programs, different vertex buffers and different render groups(See render-groups.md)
# Currently the structure is as follows:
   1. A view group struct has vertex buffers
   2. A vertex buffer struct has render groups(unique to that vb)
   3. A render group struct has meshes, the number of faces and the start index of the render group in the vertex buffer.
   All the above are stored via indexes and not by pointers.
   Ex.   The vertex buffers are stored by their index in an int8-int16 array inside the group struct.
   Ex.   The render groups are stored by their index in an int8-int16 array inside the vertex buffer struct.
   view_group {
      .vb: {
         .rg: {
            .num_faces
            .start
            .mesh_idxs: []
         }
      }
   }
# A view group must be created after graphics initialization(function call: GenGfxCtx()), 
   that is: first a program and a vertex buffer must be decided 
   for a mesh, so that the view group have access to that vertex buffer via its index.

* A new view group is created by a parent or root mesh.
   The info is also stored in each mesh's "group_bufferidxs" variable (See bellow: "# Group_bufferidxs")
* The creation of new vertex buffer structs and new render group structs inside a view group is automatic in the cases that the meshes are "conected"
   via a parent-child relationship (Mesh Tree Structure). Essentialy a recursion on the root mesh and its children checks and creates what is necessary.
* There is a manual way of "adding" "un-related" meshes to an existing view group.
   These conditions must be met.
      1. The group must exist
      2. The mesh to be added must "know" the "groupidx" before calling its "GenGfxCtx()" to create graphics context for its self.
      3. The mesh to be added must not be a root widget its self("ROOT_WIDGETS.CREATE_ROOT")






# Group_bufferidxs: mesh.group_bufferidxs=[ , , , ]
Is an array of 4 index values the mesh belongs to:
1. The view group index (of the view group)
2. the vb index (of the vertex buffer in the view group)
3. the rg index (of the render group of the vertex buffer group of the view group)
4. the mesh index (...), that is the index in the mesh indexes buffer this mesh is stored by the ViewGroup 