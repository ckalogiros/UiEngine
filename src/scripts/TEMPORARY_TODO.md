TODO

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