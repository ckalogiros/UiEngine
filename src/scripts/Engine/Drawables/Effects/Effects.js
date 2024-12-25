/**
 * Effects.js is a file for managing meshes that carry effect shaders.
 * all effects meshes are stored in a local storage buffer.
 * Note that these meshes do not belong to a root widget structure,
 * so there is no root mesh for structuring effect meshes. (Every effect should be independend)
 * To handle the vertex buffers for the effects rendering,
 * we simply use the same vertex buffer group index(vb_grouidx), from any existant effect mesh.
 * That means it is the user's responsibility to manage and pass a vb_grouidx,
 * other wise there will be a new vertex buffer created for each effect mesh(BAD!!!)
 */


"use strict";

import { Gl_set_dim_xy, Gl_set_rgba, Gl_set_time, Gl_set_vpos_xy, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { New_generic_buffer, New_int8_buffer } from "../../Core/Buffers.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Renderqueue_set_active, Renderqueue_update_active_queue } from "../../Renderers/Renderer/RenderQueue.js";
import { BLUEL, PURPLER, TRANSPARENT } from "../Material/Base/Colors.js";






const PRE_INITIALIZED_EXPLOSION_MESHES = 1;



_CNT = 0x1;
export const EFFECTS_TYPES = {
   EXPLOSION_CIRCLE: {
      ID:_CNT,
      VB_GROUP_IDX:INT_NULL,
   },
   // XXX:_CNT<<=0x1,
};








// /**************************************************************************************************************************************/
// // Groups: Custom grouping of effect meshes to update if any shader animation is needed

// const _effects_groups = New_generic_buffer(_, '_effects_groups');

// class Effect_Groups {

//    constructor() {

//       this.fx_mesh_idxs_buffer = New_int8_buffer(16, `effects_group id:${_effects_groups.boundary + 1}`);
//       // rest fx variables
//       this.vb_groupidx = INT_NULL;

//       this.fx_groupidx = _effects_groups.Add(this.fx_mesh_idxs_buffer);
//    }
// }


// export function Effects_groups_update() {

//    for (let i = 0; i <= _effects_groups.boundary; i++) {

//       const explosion_mesh_idx = _effects_groups.buffer[i];
//       const explosion_mesh = _effects_mesh_buffer.buffer[explosion_mesh_idx];
//       const time = Timer_get_global_timer_0_1();
//       Gl_set_time(explosion_mesh.gfx, time); // Update attribute time
//    }
// }








/**************************************************************************************************************************************/
// Effects Meshes

let ID = 0;

class Effect_Mesh {

   constructor(x=0, y=0, w=75, h=75, color=BLUEL[9], vb_groupidx=INT_NULL) {

      this.id = ID++;
      
      // mesh = Create_rect_mesh(_, [pos[0], pos[0], 1], [w, h], color, 'ExplosionMesh',);
      const mesh = Create_rect_mesh(_, [0, 0, 1], [w, h], color, 'ExplosionMesh',);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME, .0);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
      
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      
      // Render
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      
      // HACK: set the pos after the gfx generation to avoid wpos_unif to double the ammount
      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;
      
      
      mesh.Render();
      
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);
      
      // Initialize generic uniforms, only once(first mesh initialization)
      if(vb_groupidx===INT_NULL) {
         // mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1, .4, .06]);
         // mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1, 1., .06]);
         mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1, .5, .2]);
      }
      
      Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      
      // console.log('idx', freeidx, 'vb start', mesh.gfx.vb.starts.buffer[0])
      // If new mesh is created, add it to the effects buffer
      this.idx = _effects_mesh_buffer.Add(this);

      this.mesh = mesh;


      this.is_active = true;
   }
}


const _effects_mesh_buffer = New_generic_buffer(_, '_effects_mesh_buffer');
const _free_effects_idx_buffer = New_int8_buffer(PRE_INITIALIZED_EXPLOSION_MESHES, '_free_effects_idx_buffer');




export function Effects_get_fx_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effects_mesh_buffer.buffer[idx] === undefined) alert('090909091 Wrong index for _effects_mesh_buffer')
   return _effects_mesh_buffer.buffer[idx];
}
// Removes the effect mesh from the storage buffer and from rendering, but mesh still remains in the application
export function Effects_remove_fx_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effects_mesh_buffer.buffer[idx] === undefined) alert('090909092 Wrong index for _effects_mesh_buffer')
   
   const mesh = _effects_mesh_buffer.buffer[idx].mesh;
   // Gfx_pool_remove_geometry(mesh.gfx, mesh.geom.num_faces, _, mesh);
   // Gl_set_alpha(mesh.gfx, 0)
   // Gl_set_rgba(mesh.gfx, TRANSPARENT);
   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);

   // _effects_mesh_buffer.RemoveByIdx(idx);
   _effects_mesh_buffer.buffer[idx].is_active = false;
   _free_effects_idx_buffer.Add(idx);
   
}
// Removes the effect mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application)
export function Effects_destroy_fx_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effects_mesh_buffer.buffer[idx] === undefined) alert('090909093 Wrong index for _effects_mesh_buffer')
      _effects_mesh_buffer.RemoveByIdx(idx);
   const mesh = _effects_mesh_buffer.buffer[idx].mesh;
   mesh.Destroy();
}


export function Effects_init_buffer(TYPE, num_effect_meshes=PRE_INITIALIZED_EXPLOSION_MESHES, w, h,  vb_grouidx=INT_NULL) {

   switch (TYPE.ID) {
      case EFFECTS_TYPES.EXPLOSION_CIRCLE.ID: {
         for(let i=0; i<num_effect_meshes; i++) {
            const effect = new Effect_Mesh(_, _, w, h, _, vb_grouidx); 
            vb_grouidx = effect.mesh.gfx.vb.groupidx;
            Effects_remove_fx_mesh_byidx(effect.idx);
         }
         EFFECTS_TYPES.EXPLOSION_CIRCLE.VB_GROUP_IDX = vb_grouidx;
         break;
      }
      default: { alert('0090090094 Effect type not recognised. Pass a valid EFFECTS_TYPES'); }

   }

   return vb_grouidx;

}


export function Effects_create(TYPE, x, y, w, h, w_src=0, h_src=0, color) {

   switch (TYPE.ID) {

      case EFFECTS_TYPES.EXPLOSION_CIRCLE.ID: {
         return Effects_create_explosion_circle(x, y, w, h, w_src, h_src, color, EFFECTS_TYPES.EXPLOSION_CIRCLE.VB_GROUP_IDX);
      }
      default: { alert('0090090095 Effect type not recognised. Pass a valid EFFECTS_TYPES'); }
   }

}



function Effects_create_explosion_circle(x = 0, y = 0, w = 100, h = 100, w_src=0, h_src=0, color = BLUEL[9], vb_groupidx) {

   let idx = INT_NULL;

   const freeidx = _free_effects_idx_buffer.boundary;
   
   
   if (freeidx >= 0) {
      
      idx = _free_effects_idx_buffer.buffer[freeidx];
      const effect = _effects_mesh_buffer.buffer[idx];

      // TODO: Create a Gl_ function to update all attributes in one go


      effect.mesh.geom.dim[0] = w;
      effect.mesh.geom.dim[1] = h;
      Gl_set_dim_xy(effect.mesh.gfx, w, h);
      Gl_set_vpos_xy(effect.mesh.gfx, w, h);

      effect.mesh.geom.pos[0] = x-w+w_src; 
      effect.mesh.geom.pos[1] = y-h+h_src; 
      Gl_set_wpos_xy(effect.mesh.gfx, effect.mesh.geom.pos[0]+w, effect.mesh.geom.pos[1]+h);


      effect.mesh.mat.col = color;
      Gl_set_rgba(effect.mesh.gfx, color)
      
      effect.mesh.timer = 0.01;
      Gl_set_time(effect.mesh.gfx, 0.01); // Reset attribute time


      // Remove from the free idxs buffer
      _free_effects_idx_buffer.RemoveByIdx(freeidx);

   }
   else { // If no apropriate free effect was found, create new effect
      
      // alert('0090090095')

      const new_effect = new Effect_Mesh(x-w+w_src, y-h+h_src, w, h, color, vb_groupidx); 
      idx = new_effect.idx;
      
      // console.log('idx', freeidx, 'vb start', new_effect.mesh.gfx.vb.starts.buffer[0])
   }


   return idx;

}
