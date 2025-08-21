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

import { ARK_STATE } from "../../../App/Demo/Games/Arkanoid/ArkanoidConstants.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties } from "../Widgets/Helpers/WidgetEnableProperties.js";
import { Gl_set_dim_xy, Gl_set_generic2, Gl_set_time, Gl_set_vpos_xy, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { New_generic_buffer, New_int8_buffer } from "../../Core/Buffers.js";
import { Create_rect_mesh } from "../Widgets/Helpers/CreateWidgetInterface.js";
import { Renderqueue_set_active } from "../../Renderers/Renderer/RenderQueue.js";
import { BLUEL, GREY } from "../Material/Colors.js";
import { Mesh_set_color_rgba } from "../Operations/MeshAttributesFunctions.js";
import { View_render_specific_render_group } from "../../Core/Views/MeshBufferViews.js";






const PRE_INITIALIZED_EXPLOSION_MESHES = 32;



_CNT = 0;
export const EFFECTS_TYPES = {
   EXPLOSION_CIRCLE: {
      ID:_CNT++,
      VB_GROUP_IDX:INT_NULL,
      VIEW_GROUP_IDX:INT_NULL,
      PARENT:null,
   },
   EXPLOSION_GLOW: {
      ID:_CNT++,
      VB_GROUP_IDX:INT_NULL,
      VIEW_GROUP_IDX:INT_NULL,
      PARENT:null,
   },
};





// TODO: Widget_gfx_ready_enable( enable_pass_vpos:true, enable_pass_wpos:true ARE NOT NEEDED, REMOVE THEM


/*************************************************************************************************************************************************************************/
// Effects Meshes - Explosion Circle

class Effect_Mesh_Explosion_Circle {

   constructor(x=0, y=0, w=75, h=75, color=BLUEL[9], groupidx = INT_NULL, parent, ring_diameter, intensity) {

      this.timer = 0;
      this.timer_limit = 1;
      this.timer_step = 0.01;
      this.is_active = true;
      this.needs_auto_update = false;

      const mesh = Create_rect_mesh(Style_rect_default_properties({pos:[0, 0, 1], dim:[w, h], col:color, name:'ExplosionMeshCircle',}));
      Widget_gfx_ready_enable({mesh:mesh, enable_src_color_in_main:false, });

      mesh.GfxEnableFn(SID.SHAD.FN_EXPLOSION_CIRCLE, {time:0, generic:{a:.01, b:0}});
      
      // Must be set before GenGfxCtx call
      mesh.parent = parent;
      
      mesh.SetViewGroupIndex(groupidx);
      mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET|GFX_CTX_FLAGS.RENDER_GROUP_MATCH_FROM_RENDER_GROUP);
      mesh.GenGfxCtx();
      View_render_specific_render_group(mesh.group_bufferidxs[0], mesh.group_bufferidxs[1], mesh.group_bufferidxs[2], true);

      // If new mesh is created, add it to the effects buffer
      this.idx = _effect_explosion_circle_mesh_buffer.Add(this);
      this.mesh = mesh;
      
   }


}


const _effect_explosion_circle_mesh_buffer = New_generic_buffer(_, '_effect_explosion_circle_mesh_buffer');
const _free_effect_explosion_circle_idx_buffer = New_int8_buffer(PRE_INITIALIZED_EXPLOSION_MESHES, '_free_effect_explosion_circle_idx_buffer');


export function Effect_explosion_circle_set_update_uniform(val, unif_idx) {
   _effect_explosion_circle_mesh_buffer.buffer[0].mesh.GfxUniformSetAndUpdate('u_generic_vec3', val, unif_idx);
}

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


export function Effects_explosion_circle_init_buffer(groupidx, parent, num_effect_meshes=PRE_INITIALIZED_EXPLOSION_MESHES, w, h) {

   let vb_groupidx = INT_NULL;
   let effect = null;
   
   for(let i=0; i<num_effect_meshes; i++) {

      effect = new Effect_Mesh_Explosion_Circle(_, _, w, h, _, groupidx, parent); 
      vb_groupidx = effect.mesh.gfx.vb.groupidx;

      EFFECTS_TYPES.EXPLOSION_CIRCLE.VIEW_GROUP_IDX = groupidx;
      EFFECTS_TYPES.EXPLOSION_CIRCLE.PARENT = parent;


      Effect_explosion_circle_remove_mesh_byidx(effect.idx);
   }
   EFFECTS_TYPES.EXPLOSION_CIRCLE.VB_GROUP_IDX = vb_groupidx;

   // return vb_groupidx;
   return effect;

}


export function Effects_create_explosion_circle(x, y, w, h, w_src=0, h_src=0, color, ring_diameter=.1, intensity=.02, needs_auto_update=true) {

   let idx = INT_NULL;

   const freeidx = _free_effect_explosion_circle_idx_buffer.boundary;
   
   
   if (freeidx >= 0) {
      
      idx = _free_effect_explosion_circle_idx_buffer.buffer[freeidx];
      const effect = _effect_explosion_circle_mesh_buffer.buffer[idx];

      effect.is_active = true; 
      effect.needs_auto_update = needs_auto_update; // Avoid updating effects. There might be cases of effects to be updated in a callback animation. 

      // TODO: Create a Gl_ function to update all attributes in one go

      effect.mesh.geom.dim[0] = w;
      effect.mesh.geom.dim[1] = h;
      Gl_set_dim_xy(effect.mesh.gfx, w, h);
      Gl_set_vpos_xy(effect.mesh.gfx, w, h);

      effect.mesh.geom.pos[0] = x-w+w_src; 
      effect.mesh.geom.pos[1] = y-h+h_src; 
      Gl_set_wpos_xy(effect.mesh.gfx, effect.mesh.geom.pos[0]+w, effect.mesh.geom.pos[1]+h);

      Mesh_set_color_rgba(effect.mesh, color);
      
      effect.timer = 0.0;
      Gl_set_time(effect.mesh.gfx, effect.timer); // Reset attribute time

      effect.mesh.geom.generic.a = ring_diameter;
      effect.mesh.geom.generic.b = intensity;
      Gl_set_generic2(effect.mesh.gfx, effect.mesh.geom,)


      // Remove from the free idxs buffer
      _free_effect_explosion_circle_idx_buffer.RemoveByIdx(freeidx);

   }
   else { // If no apropriate free effect was found, create new effect
      
      const new_effect = new Effect_Mesh_Explosion_Circle(x-w+w_src, y-h+h_src, w, h, color, EFFECTS_TYPES.EXPLOSION_CIRCLE.VIEW_GROUP_IDX, EFFECTS_TYPES.EXPLOSION_CIRCLE.PARENT, ring_diameter, intensity); 
      idx = new_effect.idx;

      new_effect.timer = 0.01;
      Gl_set_time(new_effect.mesh.gfx, new_effect.timer); // Reset attribute time
      
      // console.log('idx', freeidx, 'vb start', new_effect.mesh.gfx.vb.starts.buffer[0])
   }


   return idx;
}


export function Effects_explosion_circle_update() {
   
   for(let i=0; i <= _effect_explosion_circle_mesh_buffer.boundary; i++) {

      const ex = _effect_explosion_circle_mesh_buffer.buffer[i];

      if(ex.is_active && ex.needs_auto_update) {

         // Stop exlposion animation if time limit is reached   
         if (ex.timer >= ex.timer_limit + ex.timer_step) {
            Effect_explosion_circle_remove_mesh_byidx(ex.idx);
         }
         
         ex.timer += ex.timer_step;
         
         // Update  time(attribute) for explosion animation
         Gl_set_time(ex.mesh.gfx, ex.timer); // Update attribute time
      }
   }
   
}












// TODO: Widget_gfx_ready_enable( enable_pass_vpos:true, enable_pass_wpos:true ARE NOT NEEDED, REMOVE THEM




/*************************************************************************************************************************************************************************/
// Effects Meshes - Explosion Glow

const _effect_explosion_glow_mesh_buffer = New_generic_buffer(_, '_effect_explosion_glow_mesh_buffer');
const _free_effect_explosion_glow_idx_buffer = New_int8_buffer(PRE_INITIALIZED_EXPLOSION_MESHES, '_free_effect_explosion_glow_idx_buffer');
let eee = true;
class Effect_Mesh_Explosion_Glow {

   constructor(x=0, y=0, w=35, h=35, color=GREY[7], groupidx = INT_NULL, parent=null) {

      this.timer = 0;
      this.timer_limit = 0;
      this.timer_step = 0;
      
      // const mesh = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[0, 0, 1], dim:[w, h], col:color, name:'ExplosionMeshGlow',}));
      const mesh = Create_rect_mesh(Style_rect_default_properties({pos:[0, 0, 1], dim:[w, h], col:color, name:'ExplosionMeshGlow',}));
      Widget_gfx_ready_enable({mesh:mesh, enable_src_color_in_main:false});

      const generic_controls_parameters = [.8, .0, .7];
      mesh.GfxEnableFn(SID.SHAD.FN_EXPLOSION_GLOW, {time:0});
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, generic_controls_parameters.length);
      
      // Must be set before GenGfxCtx call
      mesh.parent = parent; 
      mesh.SetViewGroupIndex(groupidx);
      
      
      mesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET|GFX_CTX_FLAGS.RENDER_GROUP_MATCH_FROM_RENDER_GROUP);
      mesh.GenGfxCtx();
      // Widget_render(mesh);
      View_render_specific_render_group(mesh.group_bufferidxs[0], mesh.group_bufferidxs[1], mesh.group_bufferidxs[2], true);
      
      // Initialize generic uniforms, only once(first mesh initialization)
      if(eee) {
         mesh.GfxUniformSetAndUpdate('u_generic_controls', generic_controls_parameters);
         eee = false;
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

export function Effects_explosion_glow_init_buffer(groupidx, parent, num_effect_meshes=PRE_INITIALIZED_EXPLOSION_MESHES, w, h) {
      
   let vb_groupidx = INT_NULL;
   let effect = null;

   for(let i=0; i<num_effect_meshes; i++) {

      effect = new Effect_Mesh_Explosion_Glow(_, _, w, h, _, groupidx, parent); 
      vb_groupidx = effect.mesh.gfx.vb.groupidx;

      // Implement to draw wpos from a root uniform wpos 
      // if(parent!==null) Mesh_unif_hack_parent_root_wpos(effect.mesh.gfx.vb.render_groupidx, parent.root_posidx, parent.mesh_bufferidx);

      Effects_explosion_glow_remove_mesh_byidx(effect.idx);
   }
   EFFECTS_TYPES.EXPLOSION_GLOW.VB_GROUP_IDX = vb_groupidx;

   return effect;

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

      Mesh_set_color_rgba(effect.mesh, color);
      // effect.mesh.mat.col = color;
      // Gl_set_rgba(effect.mesh.gfx, color)
      
      effect.mesh.timer = 0.01;
      Gl_set_time(effect.mesh.gfx, 0.01); // Reset attribute time


      // Remove from the free idxs buffer
      _free_effect_explosion_glow_idx_buffer.RemoveByIdx(freeidx);

   }
   else { // If no apropriate free effect was found, create new effect
      
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
   
         if(ARK_STATE.IS(ARK_STATE.STAGE_COMPLETED_INITIATED)) {
            ex.timer = ex.timer_limit;
         }

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







/*******************************************************************************************************/
// Debug Print
export function Effects_print() {
   console.log(
      'Effects circle buffer', _effect_explosion_circle_mesh_buffer.buffer,
      'Effects glow buffer', _effect_explosion_glow_mesh_buffer.buffer,
   );
}