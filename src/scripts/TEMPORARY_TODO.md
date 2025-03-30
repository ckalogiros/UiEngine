TODO

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


* Remove any anecessary vpos pass in Arkanoid
* Add 'u_scale' to Widget_gfx_enable
* Add 'attr_time' to Widget_gfx_enable
* Add 'ATTR_GENERIC_VEC2' to Widget_gfx_enable
* Implement 'blend color' to Widget_gfx_enable

* Demo comet:
   Use the new generic uniform collector to automaticaly set the slider controls
   Resolve the controls for glow particles. Implement a way to choose which controls to enable, from the comet function call
* Particles are not ROUND!!!

* Implement slider controls also for vb attributes (not only uniforms)

* DROPDOWN WIDGET
   * Create Style btn for the dp btn in the construction via Style_dropdown...
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
      align:ALIGN.HORIZONTAL, // DOES NOT STORE THE ALIGN IN THE CONSTRUCTOR
   });
   infomesh.align.flags = ALIGN_2.HORIZONTAL;

* Create_widget_multi_text,
   remove OLD Align:ALIGN.HORIZONTAL OR rename it to corespond a specific alignment for multi-text,

* What is the difference of 
GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
AND
GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
I tthink the pass.wpos3 is curently unused

* Are we gonna implement all widget parameters as structs, on widget creation??? 

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

* Finish the implementation of 'naming' the sliders from their uniforms names. I think the uniform names exist n the ShaderBuilder.js

* Re-implement widget creation parameters.

   from:
   mesh_bufferidx, ROOT_WIDGET_FLAGS, options = (SECTION.VERTICAL), pad = [4, 4], pos = [200, 400, 0], dim = [40, 40], col = TRANSPARENCY(BLUEL[6], .6), name = 'SECTION UNAMED', style = { rcorners: 4, feather: 2, border: 0 }, num_faces = 1, texture_id = INT_NULL, sub_texture_id = INT_NULL, is_debug_mesh

   to: 
   create_widget(mesh_bufferidx, 
      {


         .geom:{
            .pos:[], .dim:[]
         },
         .mat:{
            .col:[],
            .tex:{
               .texture_id: TEXTURE.,
               .sub_texture_id: TEXTURE.,
            },
         },
         .style: {
            .pad:[],
            .margin:,
            .rcorners:10,
         }

      }
   );