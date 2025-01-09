"use strict"



/**
 * Buffer for power ups
 * buffer for free pow ups
 * 
 * powup animate
 * 
 * powup check collision with player
 * create score mod
 * create hit impact effect
 * 
 * Activate powup
 * player enlarge | many balls | gun bullets | enlarge ball/power ball |  
 * create the animation of the powup activation
 * 
 * manage the timed power ups. (How to implement a real timer clock)
 */

'use strict';

import { New_generic_buffer, New_int8_buffer } from "../../../../Engine/Core/Buffers.js";
import { Create_widget_section } from "../../../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../../Engine/Core/MeshUniformsBuffer.js";
import { BLUEL, GREEN, PURPLEB, PURPLER, WHITE, YELLOW, YELLOWR } from "../../../../Engine/Drawables/Material/Base/Colors.js";
import { Renderqueue_set_active } from "../../../../Engine/Renderers/Renderer/RenderQueue.js";
import { Gl_set_rgba, Gl_set_wpos_xy, Gl_set_wpos_y } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { ARK_STATE } from "./ArkanoisConstants.js";
import { Ball_animation_scale, Ball_create2 } from "./Ball.js";
import { Gun_create_animation, Gun_enable } from "./BulletGun.js";
import { Player_create_animation_scale } from "./Player.js";



const POWUP_TEXTURES = {
   // POW_BALL:TEXTURES.COIN
};
_CNT = 0;
export const POWUP_TYPE_IDXS = {
   POW_BALL: _CNT++, 
   NEW_BALL: _CNT++, 
   SCALE_BALL: _CNT++,
   CREATE_BALL: _CNT++,
   SCALE_PLAYER: _CNT++,
   FIRE_BULLET: _CNT++,
}
const POWUP_TYPES = [
   { // POW_BALL: 
      ID: _CNT<<=0x1,
      COLOR:YELLOW[9],
   },
   { // SCALE_BALL: 
      ID: _CNT<<=0x1,
      COLOR:YELLOWR[9],
   },
   { // SCALE_BALL: 
      ID: _CNT<<=0x1,
      COLOR:BLUEL[9],
   },
   { // CREATE_BALL: 
      ID: _CNT<<=0x1,
      COLOR:GREEN[9],
   },
   { // SCALE_PLAYER: 
      ID: _CNT<<=0x1,
      COLOR:PURPLEB[9],
   },
   { // Fire Bullets: 
      ID: _CNT<<=0x1,
      COLOR:PURPLER[9],
   },
];
const POWUP_INIT_SIZE = 32;
const PRE_INITIALIZED_POWUP_MESHES = 12;

let powup_vb_groupidx = INT_NULL;
// const COIN_TEXT_COLOR = YELLOWR[9];



/**************************************************************************************************************************************/
//


class Powup {

   constructor(x=0, y=0, texture_id=INT_NULL, vb_groupidx=INT_NULL, type_idx=0x0) {

      // const mesh = Create_widget_section(_, _, [0, 0], [0, 0, 3], [POWUP_INIT_SIZE, POWUP_INIT_SIZE], TRANSPARENCY(WHITE, 1.), 'PowupMesh', _, _, texture_id, );
      const mesh = Create_widget_section(_, _, [0, 0], [0, 0, 3], [POWUP_INIT_SIZE, POWUP_INIT_SIZE], TRANSPARENCY(WHITE, 1.0), 'PowupMesh', _, _, _, );
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, 4);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, POWUP_INIT_SIZE);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS3 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.PASS_VPOS2);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.PASS_WPOS2);
      mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_DIM2);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      mesh.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
      // mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);
      mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 8);
      mesh.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      
      mesh.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL, vb_groupidx);
      // mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_TIME, .0);


      mesh.geom.pos[0] = x;
      mesh.geom.pos[1] = y;

      mesh.Render()
      
      mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx);
      // mesh.GfxUniformSetAndUpdate('u_generic_controls', [1, .04, .45]);

      if(powup_vb_groupidx===INT_NULL) powup_vb_groupidx = mesh.gfx.vb.groupidx;
         
            
      if(vb_groupidx.label===INT_NULL) {
         Renderqueue_set_active(mesh.gfx.vb.groupidx, true);
      }
      
      this.idx = _powup_buffer.Add(this);

      this.mesh = mesh;


      this.is_active = true;

      this.type_idx = type_idx;
   }

   UniformSetAndUpdate() {

      // this.mesh.GfxUniformSetAndUpdate('u_generic_controls', [.22, .24, .34]);
      this.mesh.GfxUniformSetAndUpdate('u_generic_controls', [.22, .24, .34, 1, 1, 1, 1, 1]);
   }
}




const _powup_buffer = New_generic_buffer(_, '_powup_buffer');
const _free_powup_idx_buffer = New_int8_buffer(PRE_INITIALIZED_POWUP_MESHES, '_free_powup_idx_buffer');


export function Powup_get_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _powup_buffer.buffer[idx] === undefined) alert('1231231231231 Wrong index for _powup_buffer')
   return _powup_buffer.buffer[idx];
}
// Removes the powup mesh from the storage buffer and from rendering, but mesh still remains in the application
export function Powup_remove_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _powup_buffer.buffer[idx] === undefined) alert('1231231231232 Wrong index for _powup_buffer')
   
   const mesh = _powup_buffer.buffer[idx].mesh;
   
   Gl_set_wpos_y(mesh.gfx, OUT_OF_VIEW);

   _powup_buffer.buffer[idx].is_active = false;
   _free_powup_idx_buffer.Add(idx);
   
}
// Removes the powup mesh from the storage buffer and from rendering, plus destroys the mesh (complete mesh removal from the application)
export function Powup_destroy_byidx(idx = INT_NULL) {
   /**DEBUG */ if (idx === INT_NULL || _powup_buffer.buffer[idx] === undefined) alert('1231231231233 Wrong index for _powup_buffer')
   const mesh = _powup_buffer.buffer[idx].mesh;
   _powup_buffer.RemoveByIdx(idx);
   mesh.Destroy();
}

export function Powup_init_buffer(num_effect_meshes=PRE_INITIALIZED_POWUP_MESHES) {

   let vb_groupidx = INT_NULL;

   for(let i=0; i<num_effect_meshes; i++) {
      const powup = new Powup(_, _, _, vb_groupidx); 
      vb_groupidx = powup.mesh.gfx.vb.groupidx;
      Powup_remove_byidx(powup.idx);
   }

   _powup_buffer.buffer[0].UniformSetAndUpdate();

   return vb_groupidx;
}


export function Powup_create(x, y, w, h, w_src=0, h_src=0, type_idx) {

   let idx = INT_NULL;

   const freeidx = _free_powup_idx_buffer.boundary;
   
   w=POWUP_INIT_SIZE;
   h=POWUP_INIT_SIZE;
   
   if (freeidx >= 0) {

      idx = _free_powup_idx_buffer.buffer[freeidx];
      const powup = _powup_buffer.buffer[idx].mesh;
      
      powup.geom.pos[0] = x-w+w_src;
      powup.geom.pos[1] = y-h+h_src;
      Gl_set_wpos_xy(powup.gfx, powup.geom.pos[0]+w, powup.geom.pos[1]+h);

      powup.geom.dim[0] = w;
      powup.geom.dim[1] = h;
      
      powup.geom.SetDimXY(powup.gfx, w, h);
      // Gl_set_dim_xy(powup.gfx, w, h);

      const color = POWUP_TYPES[type_idx].COLOR;
      powup.mat.col = color;
      Gl_set_rgba(powup.gfx, color)
      
      _powup_buffer.buffer[idx].is_active = true;
      
      _powup_buffer.buffer[idx].type_idx = type_idx;
      

      // Remove from the free idxs buffer
      _free_powup_idx_buffer.RemoveByIdx(freeidx);
   }
   else { // If no apropriate free mesh was found, create new mesh

      // alert('1231231231234 IMPLEMENT ME')

      // TODO: How to find the vb idx if a new text needs to be created in the already created vb?

      // const powup = new Powup(x-POWUP_INIT_SIZE+w_src,  y-POWUP_INIT_SIZE+h_src, _, powup_vb_groupidx);
      const powup = new Powup(x-w+w_src,  y-h+h_src, _, powup_vb_groupidx, type_idx);
      idx = powup.idx;
   }


   return idx;

}

// POW_BALL
// NEW_BALL
// SCALE_BALL
// CREATE_BALL
// SCALE_PLAYER
// FIRE_BULLET
export function Powup_resolve_hit(powup_idx, powup_typeidx) {

   if(powup_typeidx === POWUP_TYPE_IDXS.SCALE_PLAYER){
      Player_create_animation_scale();
   }
   else if(powup_typeidx === POWUP_TYPE_IDXS.SCALE_BALL){
      Ball_animation_scale();
   }
   else if(powup_typeidx === POWUP_TYPE_IDXS.NEW_BALL){
      const powup = _powup_buffer.buffer[powup_idx];
      Ball_create2(powup.mesh.geom.pos[0]+powup.mesh.geom.dim[0], powup.mesh.geom.pos[1]+powup.mesh.geom.dim[1], POWUP_TYPES[powup_typeidx].COLOR);
   }
   else if(powup_typeidx === POWUP_TYPE_IDXS.FIRE_BULLET){
      // const powup = _powup_buffer.buffer[powup_idx];
      // ARK_STATE.ADD(ARK_STATE.FIRE_BULLET_ENABLED);
      // Gun_enable();
      Gun_create_animation();
      
   }
}
// @ C:\Users\ckalo\BakedUp\Projects\VsCode\WebGL\UIEngine\UiEngine\src\scripts\App\Demo\Games\Arkanoid\Ball.js:168