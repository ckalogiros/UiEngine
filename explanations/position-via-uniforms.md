# Lets assume we have created the following meshes:

1. A root mesh to hold all others
2. Labels inside the root

The root is a rect mesh, so are the labels.
The graphics context generation will create 2 vertex buffers,
one for rendering the root and the labels VB0 and a second one for rendering the text of the labels VB1.

* Now each vertex buffer (by default) has a uniform position. 
That uniform gets updated every frame by the main loop,
and in the vertex shader that uniform is added to all the vertices of the vertex buffer.

* That is very efficient, because we can move all meshes of the same vertex buffer with one uniform update.

* But what about the text meshes, since they belong to a separate vertex buffer (VB1)?
The solution would be to update texts vertex buffer position uniform to that of the root's (VB0).
So we need a system with a data structure that handles the relationships of the vertex buffers 
with meshes that belong to a root mesh.
That is what MeshUniformBuffer.js file is for.

* Calling an update uniforms function from the applications main loop before each vertex buffer
gets uploaded to the GPU.
The function runs recursively up the 'tree' of 'parent' uniform positions 
that belong to separate vertex buffers but have  a relationship.
A position variable accumulates all positions of every 'parent' uniform,
and sets the current vertex buffer's uniform to the sum of all its 'parent' vertex buffers.  

# Hacking the root_wpos.
    In order to upadate each u_wpos for each rendergroup, we send the rgidx from Draw() to Vertex_buffer_set_and_update_uniforms_no_vao_binding() and from there we pass it as param to
    the Clbk() which is the Mesh_unif_get_vb_root_wpos().
    In Mesh_unif_get_vb_root_wpos we set the previously used vb_groupidx to rgidx,
    by checking if rgidx is not called from any other function (undefined)

# More questions to explain
* 