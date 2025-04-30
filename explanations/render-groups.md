# Render groups


* A render group is limited on:
   If a new render group is created for a VB, then all of the children of that mesh have 3 options, 
   as to where they are gonna be rendered:
   1. Rendered to the parent's render group
      Explicitly or implicitly a flag of type FIND_FROM_PARENT_DESCENDING must be enabled.
   2. Rendered to the default render group of the VB
   3. Rendered on a NEW_RENDER_GROUP, if explicitly set  for any child mesh.
   4. Rendered to a specific render group.

   For case 2, we need to answer:
   1. Is there a default render group per VB? 
      Is it always the first render group?
   2. If no defauuult render group is used, then we must check any of the render groups of the VB
      if any is NOT PRIVATE. If none is found, then we set NEW_RENDER_GROUP so a new none privat render group will be created.
   So in case of rendering a mesh the above means that:
      If a NEW_RENDER_GROUP is set for that mesh, then the render group is flaged as private.
      If another mesh is to be added to the same VB, that is not child of that mesh, then the Finder() muust not find a 'default'
      render group and must set  NEW_RENDER_GROUP and NOT PRIVATE, for the VB


   For case 4, we need to answer:
   1. Before calling MeshGfxCtx() there is no render_group_idx for any mesh to know any SPECIFIC render group.
      So do we use flags to do it ???