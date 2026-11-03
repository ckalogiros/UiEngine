TODO

All games that use an interval for their game loop should be replaced by:
We already have an app loop. Construct a mechanism that uses that loop 

#BUG: If a text begins with a new line character, then any change to the text is aborted
   SetTextFromString() etc...

# SEE ChatGPT to implement ArrayBuffers for different types in a tightly packed array

# Scroller: 
   2. Try to implement scroller as auto as possible


# "Debug_info_ui()"
   See the architecture for removing meshes from rendering

# Layout_expand_x_axis() doubles the expansion in "function Test_alignment_slider_vert_hor_with_expand(x, y)"

# Should we unite gfx context creation with render groups creation???
   Since both run for each mesh

# Implement uniforms and u_wpos for each render group 

# IMIDIATELY:  Fix Resize rect function
# IMIDIATLY:  Remove all the crap for buffer data full update from the Draw loop
      1. Use  of a command buffer
      2. HACK: use one time_interval
      3. In Draw, vb updates happen only for NEEDS_UPDATE_FROM_REALLOC, and once on vb construction

# Render groups
 * implement resize-realloc


# Resizable containers
   1. Must be set as resizable OR resize self
   2. Ισος καταμερισμος χωρου
   3. Fixed width/height
   4. Proportional %
   5. Has minimum, according to its items(The use scrolled area)


* The 'Gl_set_dim_xy' maybe should be abstracted to Mesh_update_attr_dimentions
Also instead of dim for vpos we should use vpos

* Re-implement 'current_event_callback_idx' and 'event_clbks_resolve_fn' for many callbacks in a Mesh

* IMMIDIATELY: Separate font-symbols and texture rendering shaders

* Deal with the SetStyle function, It is not used with the sdf_rect implementation
   OR implement at LAST! a style configurator to set:
   pads, margins, hover margins, LOCALLY in the Mesh object
   etc...


* IMMIDIATELY:
   Use only generic uniform buffer for creating uniforms of kind: Create smoke slider 'U_SMOKE_PARAMS_VEC3' and noise 'U_NOISE_PARAMS'
   1. When enabling u_generic_controls for many meshes of the same program, we need to 'remember' all the sizes to add them up. this is happening in the Mesh.js EnableGfx
      Actually, we need to give arr_size equivalent to the number of controls the shader needs. So it would be great to 'know' the size in advance of the u_generic creation
      The 'Resolve_uniforms_from_sid()' in ShaderBuilder is using the .arr_size to set the size in the shader code. THIS HAPPENS IN VERTEX SHADER
   2. Then on the shader side we already have a counter to pass through different functions, so we are OK in the shaders



* Currently we render a 4 color vertex buffers support.
   So it is free to create color gradiants for all meshes.
   IS MULTICOLOR VERTEX BUFFER USE SAME VB OPERATIONS AS THE 1 COLOR????????
   IF NOT, I THINK WE SHOULD MAKE THE IMPLEMENTATION
   ANYWAY, CHECK IT!!! 
   Implement a check on evvery widget/Mesh class for setting any children with gradient:
   if(this col === gradiant) then children meshes color is gradiant too EVEN IF IS 

* Rename the align var in the button-label class.
Also see if the align for text in buttons-labels is needed


* Implement NEW positioning architecture based on root widgets.
   All children should have their position relative to the parent mesh

* Currently we combined the msdf with regular texture font for text rendering
and we use geom.font_size for a consice size. See if we can draw the size from the dim or implement correctly

* RenderText() needs clean up
   Needs // TODO: For efficiency, create a dedicated Gl_ function to update all values
   Needs // TODO: Render_text. Move it to mat or geom or Mesh?

* DEEP CLEANUP: Use debug to look into classes objects and remove any anecessary fiels

* The char_buffer should be implemented as an Int8Array of code points

* Correct the parameters:style in widgets-meshes constructor
   Re-think the style set architecture