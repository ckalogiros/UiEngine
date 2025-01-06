'use strict';

import { New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { WHITE } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Gl_set_dim_xy, Gl_set_time, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";



const COIN_TEXTURE = TEXTURES.COIN;
const COIN_SIZE = 16;
const PRE_INITIALIZED_COIN_MESHES = 12;

let coin_vb_groupidx = INT_NULL;
// const COIN_TEXT_COLOR = YELLOWR[9];



/**************************************************************************************************************************************/
// Effects Meshes

let ID = 0;

class Coin {

   constructor(x=0, y=0, texture_id=COIN_TEXTURE, vb_groupidx=INT_NULL) {

      this.id = ID++;
      
      
      const mesh = Create_widget_section(_, _, [0, 0], [0, 0, 3], [COIN_SIZE, COIN_SIZE], TRANSPARENCY(WHITE, 1.), 'CoinMesh', _, _, texture_id, );
      
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);


      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;

      mesh.Render()

      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx)

      if(coin_vb_groupidx===INT_NULL) coin_vb_groupidx = mesh.gfx.vb.groupidx;
         
            
      if(vb_groupidx.label===INT_NULL) {
         Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      }
      
      this.idx = _coin_buffer.Add(this);

      this.mesh = mesh;


      this.is_active = true;
   }
}




const _coin_buffer = New_generic_buffer(_, '_coin_buffer');
const _free_coin_idx_buffer = New_int8_buffer(PRE_INITIALIZED_COIN_MESHES, '_free_coin_idx_buffer');


export function Coin_get_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _coin_buffer.buffer[idx] === undefined) alert('1231231231231 Wrong index for _coin_buffer')
   return _coin_buffer.buffer[idx];
}
// Removes the coin mesh from the storage buffer and from rendering, but mesh still remains in the application
export function Coin_remove_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _coin_buffer.buffer[idx] === undefined) alert('1231231231232 Wrong index for _coin_buffer')
   
   const mesh = _coin_buffer.buffer[idx].mesh;
   
   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);

   _coin_buffer.buffer[idx].is_active = false;
   _free_coin_idx_buffer.Add(idx);
   
}
// Removes the coin mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application)
export function Coin_destroy_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _coin_buffer.buffer[idx] === undefined) alert('1231231231233 Wrong index for _coin_buffer')
   const mesh = _coin_buffer.buffer[idx].mesh;
   _coin_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}

export function Coin_init_buffer(num_effect_meshes=PRE_INITIALIZED_COIN_MESHES) {

   let vb_groupidx = INT_NULL;

   for(let i=0; i<num_effect_meshes; i++) {
      const coin = new Coin(_, _, _, vb_groupidx); 
      vb_groupidx = coin.mesh.gfx.vb.groupidx;
      Coin_remove_byidx(coin.idx);
   }

   return vb_groupidx;
}


export function Coin_create(x, y, w, h, w_src=0, h_src=0, ) {

   let idx = INT_NULL;

   const freeidx = _free_coin_idx_buffer.boundary;
   
   
   if (freeidx >= 0) {

      idx = _free_coin_idx_buffer.buffer[freeidx];
      const coin = _coin_buffer.buffer[idx].mesh;
      
      coin.geom.pos[0] = x-w+w_src;
      coin.geom.pos[1] = y-h+h_src;
      Gl_set_wpos_xy(coin.gfx, coin.geom.pos[0]+w, coin.geom.pos[1]+h);

      coin.geom.dim[0] = w;
      coin.geom.dim[1] = h;
      
      coin.geom.SetDimXY(coin.gfx, w, h);

      _coin_buffer.buffer[idx].is_active = true;


      // Remove from the free idxs buffer
      _free_coin_idx_buffer.RemoveByIdx(freeidx);
   }
   else { // If no apropriate free mesh was found, create new mesh

      // alert('1231231231234 IMPLEMENT ME')

      // TODO: How to find the vb idx if a new text needs to be created in the already created vb?

      // const coin = new Coin(x-COIN_SIZE+w_src,  y-COIN_SIZE+h_src, _, coin_vb_groupidx);
      const coin = new Coin(x-w+w_src,  y-h+h_src, _, coin_vb_groupidx);
      idx = coin.idx;
   }


   return idx;

}

