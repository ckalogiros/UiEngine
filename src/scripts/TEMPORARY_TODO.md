TODO


* export class Geometry2D_Text extends Geometry2D {

   constructor(pos=[0,0,0], fontSize=4, scale=[0,0], text='', texture_file_id = INT_NULL, uvmap_idx) {
      fontsize and texture_file_id are not used

* export class Geometry2D_msdf_text extends Geometry2D {

   constructor(pos=[0,0,0], fontsize=4, scale=[0,0], text='', texture_file_id = INT_NULL, uvmap_idx) {

* Create an index for each text character for its uv map indexing

* Implement the connection of the Symbol Atlas texture with the sub_tex_idx for each Symbol[Symbol]
      The user must provide both the texture_id as well as the sub_tex_id: TEXTURES.symbols and ATLAS_SYMBOLS.ARROW_LEFT
      Now should the ATLAS_SYMBOLS.ARROW_LEFT be an index at the same time??????? 