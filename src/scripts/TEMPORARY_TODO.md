TODO

* The 'Gl_set_dim_xy' maybe should be abstracted to Mesh_update_attr_dimentions
Also instead of dim for vpos we should use vpos

* Remove functions from {geom, mat}, {mesh} and if possible create functions and not methods
   Also reduce the memory footprint of Mesh etc.

* Re-implement 'current_event_callback_idx' and 'event_clbks_resolve_fn' for many callbacks in a Mesh

* Align_NEW rename to align or layout and remove Align() if it is unused(check to see)

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



* Render dp with scrolller

* Currently we render a 4 color vertex buffers support.
   So it is free to create color gradiants for all meshes.
   IS MULTICOLOR VERTEX BUFFER USE SAME VB OPERATIONS AS THE 1 COLOR????????
   IF NOT, I THINK WE SHOULD MAKE THE IMPLEMENTATION
   ANYWAY, CHECK IT!!! 
   Implement a check on evvery widget/Mesh class for setting any children with gradient:
   if(this col === gradiant) then children meshes color is gradiant too EVEN IF IS 

* Rename the align var in the button-label class.
Also see if the align for text in buttons-labels is needed

* Set the .align.flags in classes: 
Example
   const infomesh = Create_widget_multi_text({
      align:TEXT_ALIGN.HORIZONTAL, // DOES NOT STORE THE TEXT_ALIGN IN THE CONSTRUCTOR
   });
   infomesh.align.flags = LAYOUT.HORIZONTAL;


* Implement NEW positioning architecture based on root widgets.
   All children should have their position relative to the parent mesh

* Currently we combined the msdf with regular texture font for text rendering
and we use geom.font_size for a consice size. See if we can draw the size from the dim or implement correctly

* REMOVE UNECESSARY:
   export function Create_widget_multi_text({{{ROOT_WIDGET_FLAGS}}}} = 0x0,

* RenderText() needs clean up
   Needs // TODO: For efficiency, create a dedicated Gl_ function to update all values
   Needs // TODO: Render_text. Move it to mat or geom or Mesh?

* DEEP CLEANUP: Use debug to look into classes objects and remove any anecessary fiels

* The char_buffer should be implemented as an Int8Array of code points

* Remove all words 'font' and replace them with the word texture_id
   All font loadings happen in the same procedure as any texture loading

* Correct the parameters:style in widgets-meshes constructor
   Re-think the style set architecture