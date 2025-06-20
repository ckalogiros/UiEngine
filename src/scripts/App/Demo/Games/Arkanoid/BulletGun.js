"use strict";

import { Callback_animations_create, Callback_animations_get_byidx } from "../../../../Engine/Animations/CallbackAnimations.js";
import { Free_generic_buffer, Free_int8_buffer, New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_rect_mesh } from "../../../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_hack_parent_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { WHITE, YELLOWR } from "../../../../Engine/Drawables/Material/Colors.js";
import { Mesh_set_dim_y } from "../../../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Gl_add_wpos_y, Gl_set_alpha, Gl_set_dim_y, Gl_set_wpos_x, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Function_Slope, Logarithmic_interpolation } from "../../../../Helpers/Math/MathFunctions.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties } from "../../../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { ARK_STATE } from "./ArkanoidConstants.js";
import { Bricks_check_collision_column_only } from "./Bricks.js";
import { Player_get } from "./Player.js";






/**************************************************************************************************************************************/
// Fire Bullet power up
/** */
const _gun = {

   timer: 0,
   timer_limit: 0,
   timer_step: 0,

   mesh: null,
   mesh2: null,
   x: 0,
   y: 0,
   w: 15,
   h: 8,

   is_active: false,
   in_scale_animation: false,
   in_push_back_animation: false,

   push_back_anim_clbk_idx: INT_NULL,

   Reset() {

      this.is_active = false;
      this.in_scale_animation = false;
      this.in_push_back_animation = false;
   }
};

/** */
export function Arkanoid_bulletgun_reset() {

   _gun.Reset();

   _bullet_mesh_buffer.ResetFull();
   _free_bullet_idx_buffer.Reset();
}
/** */
export function Arkanoid_bulletgun_destroy() {

   Free_generic_buffer(_bullet_mesh_buffer);
   Free_int8_buffer(_free_bullet_idx_buffer);
}
/** */
function Gun_enable() {

   if (_gun.is_active) return;

   _gun.is_active = true;

   Gl_set_alpha(_gun.mesh.gfx, 1);

   // Set guns pos to the player's center position
   const player = Player_get();
   const y = player.mesh.geom.pos[1] - _gun.mesh.geom.dim[0];
   _gun.mesh.geom.pos[1] = y;
   Gl_set_wpos_y(_gun.mesh.gfx, _gun.mesh.geom.pos[1] + _gun.mesh.geom.dim[1]);

   // For gun mesh part 2
   _gun.mesh2.geom.pos[1] = _gun.mesh.geom.pos[1] - _gun.mesh2.geom.dim[1] * 2;
   Gl_set_wpos_y(_gun.mesh2.gfx, _gun.mesh2.geom.pos[1] + _gun.mesh2.geom.dim[1]);

   // By enabling the 'GUN_ENABLED', the x position of the gun will update each frame to the player's x position with 'Gun_update_pos_x'
   ARK_STATE.ADD(ARK_STATE.GUN_ENABLED);
}
/** */
export function Gun_disable() {

   if (_gun.is_active) {

      Gl_set_alpha(_gun.mesh.gfx, 0);
      Gl_set_alpha(_gun.mesh2.gfx, 0);
      _gun.Reset();

      ARK_STATE.REMOVE(ARK_STATE.GUN_ENABLED);
      ARK_STATE.REMOVE(ARK_STATE.FIRE_BULLET_ENABLED);

   }

   // Remove bullets
   for (let i = 0; i <= _bullet_mesh_buffer.boundary; i++) {

      const bullet = _bullet_mesh_buffer.buffer[i];
      if (bullet.is_active) {

         Bullet_remove_byidx(bullet.idx);
      }
   }
}
/** */
function Gun_create(x, y, vb_groupidx) {

   _gun.timer = 0;
   _gun.timer_limit = 0;
   _gun.timer_step = 0;

   const mesh = Create_rect_mesh(Style_rect_default_properties({pos:[x, y, 10], dim:[_gun.w, _gun.h], col:YELLOWR[9], name:'Bullet', }));
   Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:BULLET_INIT_DIM_X, });

   // Render
   // mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
   mesh.GenGfxCtx();

   Vertex_buffer_calculate_vertexbuffer_render_group_starts();
   View_render_from_view_NEW(mesh.group_bufferidxs[0]);
   
   mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);


   Gl_set_alpha(mesh.gfx, 0);
   vb_groupidx = mesh.gfx.vb.groupidx;

   _gun.mesh = mesh;

   // Create gun's mesh part 2
   y -= _gun.h + _gun.h * .7;
   const mesh2 = Create_rect_mesh(Style_rect_default_properties({pos:[x, y, 10], dim:[_gun.w * .5, _gun.h * .7], col:YELLOWR[9], name:'GunMeshn2', }));
   Widget_gfx_ready_enable({mesh:mesh2, enable_sdf_rect:BULLET_INIT_DIM_X, });

   // Render
   // mesh2.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
   mesh2.GenGfxCtx();

   Vertex_buffer_calculate_vertexbuffer_render_group_starts();
   View_render_from_view_NEW(mesh2.group_bufferidxs[0]);
   
   mesh2.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh2.gfx.vb.groupidx);
   Gl_set_alpha(mesh2.gfx, 0);

   _gun.mesh2 = mesh2;

   return _gun;
}
/** */
export function Gun_update_pos_x(x) {
   _gun.mesh.geom.pos[0] = x - _gun.mesh.geom.dim[0];
   Gl_set_wpos_x(_gun.mesh.gfx, _gun.mesh.geom.pos[0] + _gun.mesh.geom.dim[0],);
   _gun.mesh2.geom.pos[0] = _gun.mesh.geom.pos[0] + _gun.mesh.geom.dim[0] - _gun.mesh2.geom.dim[0];
   Gl_set_wpos_x(_gun.mesh2.gfx, _gun.mesh2.geom.pos[0] + _gun.mesh2.geom.dim[0],);
}



const BULLET_SPEED = 14;
const BULLET_INIT_DIM_X = 4;
const BULLET_INIT_DIM_Y = 10;
const PRE_INITIALIZED_BULLET_MESHES = 20;



const _bullet_mesh_buffer = New_generic_buffer(_, '_bullet_mesh_buffer');
const _free_bullet_idx_buffer = New_int8_buffer(PRE_INITIALIZED_BULLET_MESHES, '_free_bullet_idx_buffer');

/** */
export class Bullet {

   constructor(x = 0, y = 0, w = BULLET_INIT_DIM_X, h = BULLET_INIT_DIM_Y, color = WHITE, vb_groupidx = INT_NULL) {

      this.timer = 0;
      this.timer_limit = 0;
      this.timer_step = 0;

      // const mesh = Create_rect_mesh(_, [x, y, 1], [w, h], YELLOWR[9], 'Bullet',);
      const mesh = Create_rect_mesh(Style_rect_default_properties({pos:[x, y, 10], dim:[w, h], col:YELLOWR[9], name:'Bullet', }));
      Widget_gfx_ready_enable({mesh:mesh, enable_sdf_rect:BULLET_INIT_DIM_X, });

      // Render
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);

      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;

      Vertex_buffer_calculate_vertexbuffer_render_group_starts();
      View_render_from_view_NEW(mesh.group_bufferidxs[0]);
   

      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);

      // Initialize generic uniforms, only once(first mesh initialization)
      if (vb_groupidx === INT_NULL) {
         Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      }


      // If new mesh is created, add it to the effects buffer
      this.idx = _bullet_mesh_buffer.Add(this);

      this.mesh = mesh;


      this.is_active = true;
   }
}



/** */
export function Bullet_get_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bullet_mesh_buffer.buffer[idx] === undefined) alert('1231231231231 Wrong index for _bullet_mesh_buffer')
   return _bullet_mesh_buffer.buffer[idx];
}
/** Removes the bullet mesh from the storage buffer and from rendering, but mesh still remains in the application */
export function Bullet_remove_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bullet_mesh_buffer.buffer[idx] === undefined) alert('1231231231232 Wrong index for _bullet_mesh_buffer')

   const mesh = _bullet_mesh_buffer.buffer[idx].mesh;

   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);

   _bullet_mesh_buffer.buffer[idx].is_active = false;
   _free_bullet_idx_buffer.Add(idx);

}
/** Removes the bullet mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application) */
export function Bullet_destroy_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _bullet_mesh_buffer.buffer[idx] === undefined) alert('1231231231233 Wrong index for _bullet_mesh_buffer')
   const mesh = _bullet_mesh_buffer.buffer[idx].mesh;
   _bullet_mesh_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}
/** */
export function Bullet_init_buffer(x, y, group_idx, parent_root_posidx, parent_mesh_bufferidx, num_effect_meshes = PRE_INITIALIZED_BULLET_MESHES) {

   let vb_groupidx = INT_NULL;

   const gun = Gun_create(x, y, vb_groupidx);
   vb_groupidx = gun.mesh.gfx.vb.groupidx;
   x = 0, y = 0; // Reset after the vb unif has been stored

   for (let i = 0; i < num_effect_meshes; i++) {

      const bullet = new Bullet(x, y, _, _, _, vb_groupidx);

      // Implement to draw wpos from a root uniform wpos 
      if (parent_root_posidx !== INT_NULL) Mesh_unif_hack_parent_root_wpos(bullet.mesh.gfx.vb.render_groupidx, parent_root_posidx, parent_mesh_bufferidx);

      Bullet_remove_byidx(bullet.idx);
   }


   return gun;
}



/** */
export function Bullet_create() {

   let idx = INT_NULL;

   const freeidx = _free_bullet_idx_buffer.boundary;


   const x = _gun.mesh.geom.pos[0] + _gun.mesh.geom.dim[0];
   const y = _gun.mesh.geom.pos[1] - _gun.mesh.geom.dim[1];

   if (freeidx >= 0) {

      idx = _free_bullet_idx_buffer.buffer[freeidx];
      const bullet = _bullet_mesh_buffer.buffer[idx].mesh;

      bullet.geom.pos[0] = x - bullet.geom.dim[0];
      bullet.geom.pos[1] = y;
      Gl_set_wpos_xy(bullet.gfx, bullet.geom.pos[0] + bullet.geom.dim[0], bullet.geom.pos[1] + bullet.geom.dim[1]);


      _bullet_mesh_buffer.buffer[idx].is_active = true;


      // Remove from the free idxs buffer
      _free_bullet_idx_buffer.RemoveByIdx(freeidx);

      // Create gun's push back animation
      Gun_create_push_back_animation()
   }



   return idx;

}
/** */
export function Bullet_update() {

   for (let i = 0; i <= _bullet_mesh_buffer.boundary; i++) {

      const bullet = _bullet_mesh_buffer.buffer[i];

      if (bullet.is_active) {

         const y = BULLET_SPEED;

         // Check bricks colission
         const posx = bullet.mesh.geom.pos[0],
            posy = bullet.mesh.geom.pos[1] - bullet.mesh.geom.dim[1],
            dimx = bullet.mesh.geom.dim[0],
            dimy = bullet.mesh.geom.dim[1],
            diry = -1;

         const colision = Bricks_check_collision_column_only(posx, posy, dimx, dimy, diry)

         if (colision || posy < 0) {
            Bullet_remove_byidx(bullet.idx);
            return;
         }

         bullet.mesh.geom.pos[1] -= y;
         Gl_add_wpos_y(bullet.mesh.gfx, -y);
      }
   }

}



/***************************************************************************************************************/
// Animations


// Gun initialization animation
/** */
export function Gun_create_animation() {

   const gun = _gun;

   if (gun.in_scale_animation) return;

   Gun_enable();
   gun.in_scale_animation = true;

   const time_step = 0.03, slope_const = .1, scale = gun.mesh.geom.dim[1];
   const slope_params_pointer = new Function_Slope(slope_const, time_step, scale);


   const params_gun = {
      gun: gun,
      function_slope: slope_params_pointer,
      gun_initial_dimy: gun.mesh.geom.dim[1],
      timer: 0,
      timer_step: 0.01,
      timer_limit: 1,
   };

   Callback_animations_create(Gun_create_animation_run, Gun_create_animation_stop, params_gun,);
}
/** */
function Gun_create_animation_run(params) {

   const gun = params.gun.mesh;

   const slope_timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();


   const slope = Logarithmic_interpolation(slope_timer, slope_constant);
   const scale_factor = slope * scale;

   // Update gun x dir scale
   const sizey = scale_factor;

   const dify = gun.geom.dim[1] - sizey;
   gun.geom.dim[1] = sizey;
   Mesh_set_dim_y(gun, sizey,);
   Gl_set_dim_y(gun.gfx, sizey,);
   gun.geom.pos[1] += dify;
   Gl_add_wpos_y(gun.gfx, dify,)


   if (slope > .9) return false;

   return true;
}
/** */
function Gun_create_animation_stop(params) {

   params.function_slope.SetTimer(0);
   params.function_slope.SetAmmount(params.gun.mesh2.geom.dim[1]);

   // Zero the dimention of the second gun mesh part
   params.gun.mesh2.geom.pos[1] += params.gun.mesh2.geom.dim[1];
   Gl_add_wpos_y(params.gun.mesh2.gfx, params.gun.mesh2.geom.dim[1],)
   params.gun.mesh2.geom.dim[1] = 0;
   Mesh_set_dim_y(params.gun.mesh2, 0,);
   Gl_set_dim_y(params.gun.mesh2.gfx, 0,);
   Gl_set_alpha(params.gun.mesh2.gfx, 1);

   Callback_animations_create(Gun_create_animation_gun_scale_mesh2_run, Gun_create_animation_gun_scale_mesh2_stop, params,);
   return false;
}
/** */
function Gun_create_animation_gun_scale_mesh2_run(params) {

   const gun = params.gun.mesh2;

   const slope_timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const scale = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();

   const slope = Logarithmic_interpolation(slope_timer, slope_constant);
   const scale_factor = slope * scale;

   const sizey = scale_factor;

   const dify = gun.geom.dim[1] - sizey;
   gun.geom.dim[1] = sizey;
   Mesh_set_dim_y(gun, sizey,);
   Gl_set_dim_y(gun.gfx, sizey,);
   gun.geom.pos[1] += dify;
   Gl_add_wpos_y(gun.gfx, dify,)

   // if(timer) return false;
   if (slope > 1) return false;

   return true;
}
/** */
function Gun_create_animation_gun_scale_mesh2_stop() {

   ARK_STATE.ADD(ARK_STATE.FIRE_BULLET_ENABLED);
   return false;
}


// Gun initialization animation
/** */
export function Gun_create_push_back_animation() {

   const gun = _gun;

   if (gun.in_push_back_animation) {
      // Case there is a fire bullet event while in the middle of an existing fire bullet event,
      // we just set the slope function timer to 0, as to reset the animation 
      const callback = Callback_animations_get_byidx(gun.push_back_anim_clbk_idx);
      callback.params.reset_anim = true;
      return;
   }

   gun.in_push_back_animation = true;

   const time_step = 0.05, slope_const = .01, move = .1;
   const slope_params_pointer = new Function_Slope(slope_const, time_step, move);


   const params_gun = {
      gun: gun,
      function_slope: slope_params_pointer,
      reset_anim: false, // Reset the push back animation
   };

   gun.push_back_anim_clbk_idx = Callback_animations_create(Gun_create_animation_push_back_run, Gun_create_animation_push_back_stop, params_gun,);
}
/** */
function Gun_create_animation_push_back_run(params) {

   const part1 = params.gun.mesh;
   const part2 = params.gun.mesh2;

   if (params.reset_anim) { // Case there is a fire bullet event, we just reset the animation
      params.function_slope.SetTimer(0);
      Gl_set_wpos_y(part1.gfx, part1.geom.pos[1] + part1.geom.dim[1],);
      Gl_set_wpos_y(part2.gfx, part2.geom.pos[1] + part2.geom.dim[1],);
      params.reset_anim = false;
   }

   const slope_timer = params.function_slope.GetTimer();
   const slope_constant = params.function_slope.GetSlope();
   const move = params.function_slope.GetAmmount();
   params.function_slope.IncrementTimer();


   const slope = Logarithmic_interpolation(slope_timer, slope_constant);
   const factor = slope;


   const some_distance = 3;
   const d = some_distance - (factor * some_distance);

   Gl_add_wpos_y(part1.gfx, d,);
   Gl_add_wpos_y(part2.gfx, d,);

   if (slope > .9) return false;

   return true;
}
/** */
function Gun_create_animation_push_back_stop(params) {

   // console.log('END')
   Gl_set_wpos_y(params.gun.mesh.gfx, params.gun.mesh.geom.pos[1] + params.gun.mesh.geom.dim[1])
   Gl_set_wpos_y(params.gun.mesh2.gfx, params.gun.mesh2.geom.pos[1] + params.gun.mesh2.geom.dim[1])

   params.gun.in_push_back_animation = false;

   return false;
}