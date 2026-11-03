# A root group is a collection of meshes, of which one of them is the root.
   All meshes are stored in a buffer as indexes, with the root mesh occupying the first element of the buffer.
   It is obligatory for a mesh to belong to a root-group, either be the root mesh of a group.

# What it offers;
   1. Fast access of all meshes of the group
   2. Creates a seperation layer for each root group that exists in a scene or the render area,
      which makes it fast and easy to access all root meshes (consequently with all the meshes of the group) 
