* The passing of [vpos, dim, etc] is the same values for the shaders
   vpos=[-dim, +dim], v_dim=[-dim, +dim]
   Remove either 

* REMOPVE ANY ANNECESSARY DEFINES for importing code for controls
   Example: U_GENERIC_VEC2, U_GENERIC_VEC3 controls are not used any more
   So is u_glow controls 

* Implement:
   the geometry shader, so that we create vertices on an existing rect,
   that way we could create a shader to animate the vertices and create cloth effects etc