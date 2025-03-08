* Re think the root group, view group.
* Implement a Gl_add and _set function, that runs once per vb and updates all consecutive meshes in the buffer for N meshes.
   The point being reduce the Gl calls to the number of vertex buffers, but the meshes must belong in a group.


* IMMIDIATELY: 
   Remove Javascript allocations : STACK
      Mesh_unif_get_vb_root_wpos_recursive [http://localhost:6001/scripts/Engine/Core/MeshUniformsBuffer.js:293:46]
      Mesh_unif_get_vb_root_wpos [http://localhost:6001/scripts/Engine/Core/MeshUniformsBuffer.js:283:43]
      GetPosXY [http://localhost:6001/scripts/Engine/Drawables/Meshes/Base/Mesh.js:637:13]
      Mesh_buffer_get_mesh_bounding_box [http://localhost:6001/scripts/Engine/Core/MeshBuffer.js:57:50]
      Check_hover_recursive [http://localhost:6001/scripts/Engine/Events/EventListeners.js:503:31]
      Listener_dispatch_check_hover_event [http://localhost:6001/scripts/Engine/Events/EventListeners.js:403:52]
      HandleEvents [http://localhost:6001/scripts/Engine/Events/Events.js:23:29]
      OnUpdate [http://localhost:6001/scripts/Engine/Scenes.js:30:13]
      Render [http://localhost:6001/scripts/Engine/Renderers/Renderer.js:87:10]
      Application_loop [http://localhost:6001/scripts/App/App.js:106:33]
      FrameRequestCallback
      RefreshDriver tick

* Remove the pad-margin as buffers. Implement as variables in Mesh

* See all "class ..." to be named correctly.
   Class Name Structure: Capital letters words seperated by '_'
   Also rename .._Mesh (Rect_mesh etc) to Mesh_Rect
   Also all widget classes should be checked for unused functions and maybe re-think the basic architecture

