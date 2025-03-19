TODO
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