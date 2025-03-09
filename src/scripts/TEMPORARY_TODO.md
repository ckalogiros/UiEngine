TODO

* Remove all words 'font' and replace them with the word texture_id
   All font loadings happen in the same procedure as any texture loading

* Implement the connection of the Symbol Atlas texture with the sub_tex_idx for each Symbol[Symbol]
      The user must provide both the texture_id as well as the sub_tex_id: TEXTURES.symbols and ATLAS_SYMBOLS.MSDF_SYMBOLS
      Now should the ATLAS_SYMBOLS.MSDF_SYMBOLS be an index at the same time??????? 