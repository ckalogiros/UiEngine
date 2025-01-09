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
import { Renderqueue_set_active } from "../../Renderers/Renderer/RenderQueue.js";
import { BLUEL, GREY, WHITE } from "../Material/Base/Colors.js";






const PRE_INITIALIZED_EXPLOSION_MESHES = 12;



_CNT = 0;
export const EFFECTS_TYPES = {
   EXPLOSION_CIRCLE: {
      ID:_CNT++,
      VB_GROUP_IDX:INT_NULL,
   },
   EXPLOSION_GLOW: {
      ID:_CNT++,
      VB_GROUP_IDX:INT_NULL,
   },
};








/*************************************************************************************************************************************************************************/
// Effects Meshes - Explosion Circle

// HERE: replace the uniform with 'u_generic_controls'
class Effect_Mesh_Explosion_Circle {

   constructor(x=0, y=0, w=75, h=75, color=BLUEL[9], vb_groupidx=INT_NULL) {

      this.timer = 0;
      this.timer_limit = 0;
      this.timer_step = 0;

      const mesh = Create_rect_mesh(_, [0, 0, 1], [w, h], color, 'ExplosionMeshCircle',);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.FN_EXPLOSION_CIRCLE);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME, .0);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
      
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
      
      // Render
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      
      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;
      
      
      mesh.Render();
      
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);
      
      // Initialize generic uniforms, only once(first mesh initialization)
      if(vb_groupidx===INT_NULL) {
         // mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1, .4, .06]);
         // mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1, 1., .06]);
         mesh.GfxUniformSetAndUpdate('u_generic_vec3', [1, .5, .2]);
         Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      }
      
      
      // console.log('idx', freeidx, 'vb start', mesh.gfx.vb.starts.buffer[0])
      // If new mesh is created, add it to the effects buffer
      this.idx = _effect_explosion_circle_mesh_buffer.Add(this);

      this.mesh = mesh;


      this.is_active = true;
      
   }
}


const _effect_explosion_circle_mesh_buffer = New_generic_buffer(_, '_effect_explosion_circle_mesh_buffer');
const _free_effect_explosion_circle_idx_buffer = New_int8_buffer(PRE_INITIALIZED_EXPLOSION_MESHES, '_free_effect_explosion_circle_idx_buffer');




export function Effect_explosion_circle_get_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effect_explosion_circle_mesh_buffer.buffer[idx] === undefined) alert('090909091 Wrong index for _effect_explosion_circle_mesh_buffer')
   return _effect_explosion_circle_mesh_buffer.buffer[idx];
}
// Removes the effect mesh from the storage buffer and from rendering, but mesh still remains in the application
export function Effect_explosion_circle_remove_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effect_explosion_circle_mesh_buffer.buffer[idx] === undefined) alert('090909092 Wrong index for _effect_explosion_circle_mesh_buffer')
   
   const mesh = _effect_explosion_circle_mesh_buffer.buffer[idx].mesh;
   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);

   _effect_explosion_circle_mesh_buffer.buffer[idx].is_active = false;
   _free_effect_explosion_circle_idx_buffer.Add(idx);
   
}
// Removes the effect mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application)
export function Effect_explosion_circle_destroy_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effect_explosion_circle_mesh_buffer.buffer[idx] === undefined) alert('090909093 Wrong index for _effect_explosion_circle_mesh_buffer')
      _effect_explosion_circle_mesh_buffer.RemoveByIdx(idx);
   const mesh = _effect_explosion_circle_mesh_buffer.buffer[idx].mesh;
   mesh.Destroy();
}


export function Effects_explosion_circle_init_buffer(num_effect_meshes=PRE_INITIALIZED_EXPLOSION_MESHES, w, h,  vb_grouidx=INT_NULL) {

   for(let i=0; i<num_effect_meshes; i++) {
      const effect = new Effect_Mesh_Explosion_Circle(_, _, w, h, _, vb_grouidx); 
      vb_grouidx = effect.mesh.gfx.vb.groupidx;
      Effect_explosion_circle_remove_mesh_byidx(effect.idx);
   }
   EFFECTS_TYPES.EXPLOSION_CIRCLE.VB_GROUP_IDX = vb_grouidx;

   return vb_grouidx;

}


export function Effects_create_explosion_circle(x, y, w, h, w_src=0, h_src=0, color) {

   let idx = INT_NULL;

   const freeidx = _free_effect_explosion_circle_idx_buffer.boundary;
   
   
   if (freeidx >= 0) {
      
      idx = _free_effect_explosion_circle_idx_buffer.buffer[freeidx];
      const effect = _effect_explosion_circle_mesh_buffer.buffer[idx];

      effect.timer = 0;
      effect.timer_limit = 1;
      effect.timer_step = 0.01;
      effect.is_active = true;

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
      _free_effect_explosion_circle_idx_buffer.RemoveByIdx(freeidx);

   }
   else { // If no apropriate free effect was found, create new effect
      
      // alert('0090090095')
      const vb_groupidx = EFFECTS_TYPES.EXPLOSION_CIRCLE.VB_GROUP_IDX;
      const new_effect = new Effect_Mesh_Explosion_Circle(x-w+w_src, y-h+h_src, w, h, color, vb_groupidx); 
      idx = new_effect.idx;

      new_effect.mesh.timer = 0.01;
      Gl_set_time(new_effect.mesh.gfx, 0.01); // Reset attribute time
      
      // new_effect.timer = 0;
      // new_effect.timer_limit = 1;
      // new_effect.timer_step = 0.01;
      // new_effect.is_active = true;
      // console.log('idx', freeidx, 'vb start', new_effect.mesh.gfx.vb.starts.buffer[0])
   }


   return idx;
}


export function Effects_explosion_circle_update() {
   
   // for(let i=0; i <= _effect_explosion_circle_mesh_buffer.boundary; i++) {

   //    const ex = _effect_explosion_circle_mesh_buffer.buffer[i];

   //    if(ex.is_active) {

   //       // Stop exlposion animation if time limit is reached   
   //       if (ex.timer >= ex.timer_limit + ex.timer_step) {
   //          Effect_explosion_circle_remove_mesh_byidx(ex.idx);
   //       }
         
   //       ex.timer += ex.timer_step;
         
   //       // Update  time(attribute) for explosion animation
   //       Gl_set_time(ex.mesh.gfx, ex.timer); // Update attribute time
   //    }
   // }
   
}

















/*************************************************************************************************************************************************************************/
// Effects Meshes - Explosion Glow

const _effect_explosion_glow_mesh_buffer = New_generic_buffer(_, '_effect_explosion_glow_mesh_buffer');
const _free_effect_explosion_glow_idx_buffer = New_int8_buffer(PRE_INITIALIZED_EXPLOSION_MESHES, '_free_effect_explosion_glow_idx_buffer');

class Effect_Mesh_Explosion_Glow {

   constructor(x=0, y=0, w=35, h=35, color=WHITE, vb_groupidx=INT_NULL) {

      this.timer = 0;
      this.timer_limit = 0;
      this.timer_step = 0;
      
      const mesh = Create_rect_mesh(_, [0, 0, 1], [w, h], color, 'ExplosionMeshGlow',);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3, }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.FN_EXPLOSION_GLOW);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME, .0);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
      
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 5);
      
      // Render
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      
      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;
      
      
      mesh.Render();
      
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);
      
      // Initialize generic uniforms, only once(first mesh initialization)
      if(vb_groupidx===INT_NULL) {
         mesh.GfxUniformSetAndUpdate('u_generic_controls', [.8, 0, 1, 1, 1]);
      }
      
      Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      
      // If new mesh is created, add it to the effects buffer
      this.idx = _effect_explosion_glow_mesh_buffer.Add(this);

      this.mesh = mesh;


      this.is_active = true;
   }
}




export function Effects_explosion_glow_get_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effect_explosion_glow_mesh_buffer.buffer[idx] === undefined) alert('090909091 Wrong index for _effect_explosion_glow_mesh_buffer')
   return _effect_explosion_glow_mesh_buffer.buffer[idx];
}
// Removes the effect mesh from the storage buffer and from rendering, but mesh still remains in the application
export function Effects_explosion_glow_remove_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effect_explosion_glow_mesh_buffer.buffer[idx] === undefined) alert('090909092 Wrong index for _effect_explosion_glow_mesh_buffer')
   
   const mesh = _effect_explosion_glow_mesh_buffer.buffer[idx].mesh;
   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);

   _effect_explosion_glow_mesh_buffer.buffer[idx].is_active = false;
   _free_effect_explosion_glow_idx_buffer.Add(idx);
   
}
// Removes the effect mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application)
export function Effects_explosion_glow_destroy_mesh_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _effect_explosion_glow_mesh_buffer.buffer[idx] === undefined) alert('090909093 Wrong index for _effect_explosion_glow_mesh_buffer')
      _effect_explosion_glow_mesh_buffer.RemoveByIdx(idx);
   const mesh = _effect_explosion_glow_mesh_buffer.buffer[idx].mesh;
   mesh.Destroy();
}


export function Effects_explosion_glow_init_buffer(num_effect_meshes=PRE_INITIALIZED_EXPLOSION_MESHES, w, h,  vb_grouidx=INT_NULL) {

   for(let i=0; i<num_effect_meshes; i++) {
      const effect = new Effect_Mesh_Explosion_Glow(_, _, w, h, _, vb_grouidx); 
      vb_grouidx = effect.mesh.gfx.vb.groupidx;
      Effects_explosion_glow_remove_mesh_byidx(effect.idx);
   }
   EFFECTS_TYPES.EXPLOSION_GLOW.VB_GROUP_IDX = vb_grouidx;

   return vb_grouidx;

}


export function Effects_create_explosion_glow(x, y, w, h, w_src=0, h_src=0, color) {

   let idx = INT_NULL;

   const freeidx = _free_effect_explosion_glow_idx_buffer.boundary;
   
   
   if (freeidx >= 0) {
      
      idx = _free_effect_explosion_glow_idx_buffer.buffer[freeidx];
      const effect = _effect_explosion_glow_mesh_buffer.buffer[idx];

      effect.timer = 0;
      effect.timer_limit = 1;
      effect.timer_step = 0.01;
      effect.is_active = true;


      // TODO: Create a Gl_ function to update all attributes in one go


      effect.mesh.geom.dim[0] = w;
      effect.mesh.geom.dim[1] = h;
      Gl_set_dim_xy(effect.mesh.gfx, w, h);
      Gl_set_vpos_xy(effect.mesh.gfx, w, h);

      effect.mesh.geom.pos[0] = x-w+w_src; 
      effect.mesh.geom.pos[1] = y-h+h_src; 
      // effect.mesh.geom.pos[0] = x; 
      // effect.mesh.geom.pos[1] = y; 
      Gl_set_wpos_xy(effect.mesh.gfx, effect.mesh.geom.pos[0]+w, effect.mesh.geom.pos[1]+h);

      effect.mesh.mat.col = color;
      Gl_set_rgba(effect.mesh.gfx, color)
      
      effect.mesh.timer = 0.01;
      Gl_set_time(effect.mesh.gfx, 0.01); // Reset attribute time


      // Remove from the free idxs buffer
      _free_effect_explosion_glow_idx_buffer.RemoveByIdx(freeidx);

   }
   else { // If no apropriate free effect was found, create new effect
      
      // alert('0090090095')

      const vb_groupidx = EFFECTS_TYPES.EXPLOSION_GLOW.VB_GROUP_IDX;
      const new_effect = new Effect_Mesh_Explosion_Glow(x-w+w_src, y-h+h_src, w, h, color, vb_groupidx); 
      idx = new_effect.idx;
      new_effect.timer = 0;
      new_effect.timer_limit = 1;
      new_effect.timer_step = 0.01;
      
      // console.log('idx', freeidx, 'vb start', new_effect.mesh.gfx.vb.starts.buffer[0])
   }


   return idx;
}


export function Effects_explosion_glow_update() {
   
   for(let i=0; i <= _effect_explosion_glow_mesh_buffer.boundary; i++) {

      const ex = _effect_explosion_glow_mesh_buffer.buffer[i];

      if(ex.is_active) {

         // Stop exlposion animation if time limit is reached   
         if (ex.timer >= ex.timer_limit + ex.timer_step) {
            Effects_explosion_glow_remove_mesh_byidx(ex.idx);
         }
         
         ex.timer += ex.timer_step;
         
         // Update  time(attribute) for explosion animation
         Gl_set_time(ex.mesh.gfx, ex.timer); // Update attribute time
      }
   }
   
}