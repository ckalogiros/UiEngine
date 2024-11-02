"use strict";

import { GlSetAttrSdfParamsOuter, Gl_set_wpos_x, Gl_set_vpos_xy, Gl_set_rgba } from "../../Graphics/Buffers/VertexBuffersOps.js";
import { CalculateSdfOuterFromDim } from "../../Helpers/Helpers.js";
import { GfxInfoMesh } from "../Interfaces/Gfx/MeshGfxContext.js";
import { Mesh_animations_get } from "./MeshAnimations.js";




// Temporary store. 
const _gfx = new GfxInfoMesh();


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Scale Up-Down Animation Functions
 */
export function Animations_create_scale_up_down(params) {

   // if (!params.state.inHover && !params.state.inScale) {
   // if (!params.state.inScale) {
   if (!(params.state.mask & MESH_STATE.IN_SCALE)) {
      const animations = Mesh_animations_get();
      animations.Create(Animations_run_scale_up_start, Animations_run_scale_up_stop, params, 'button_scale_up_animation');
      params.state.inScale = true;
      params.StateEnable(MESH_STATE.IN_SCALE);
   }
}



function Animations_run_scale_up_start(mesh) {

   const scaleFactor = 1.05, maxScale = 220;

   // if (mesh.state.inHover && mesh.geom.dim[0] > maxScale) {
   if (mesh.StateCheck(MESH_STATE.IN_HOVER) && mesh.geom.dim[0] > maxScale) {
      return true;
   }
   // else if (!mesh.state.inHover && mesh.geom.dim[0] > maxScale) {
   else if (mesh.StateCheck(MESH_STATE.IN_HOVER) === 0 && mesh.geom.dim[0] > maxScale) {
      return false;
   }

   mesh.geom.dim[0] *= scaleFactor; // Update button's text dimentions x
   mesh.geom.dim[1] *= scaleFactor; // Update button's text dimentions y
   let posx = mesh.geom.pos[0];

   Gl_set_wpos_x(mesh.gfx, posx);
   mesh.UpdateDim();

   if (mesh.children.boundary) {

      if(mesh.children.buffer[0].type & MESH_TYPE.TEXT_MESH){
         
         Helper_scale_text(mesh, scaleFactor, 0);
      }
      else{
         
         Helper_scale_rect(mesh, scaleFactor);
      }
   }

   return true;
}



function Animations_run_scale_up_stop(mesh) {

   Animations_create_scale_down_start(mesh);
}



function Animations_create_scale_down_start(params) {

   const animations = Mesh_animations_get();
   animations.Create(Animations_run_scale_down_start, Animations_run_scale_down_stop, params, 'button_scale_down_animation');
}



function Animations_run_scale_down_start(mesh) {

   if (mesh.geom.dim[0] <= mesh.geom.defDim[0]) {
      return false;
   }

   const scaleFactor = .95;

   mesh.geom.dim[0] *= scaleFactor; // Update button's text dimentions x
   mesh.geom.dim[1] *= scaleFactor; // Update button's text dimentions y

   let posx = mesh.geom.pos[0];

   Gl_set_wpos_x(mesh.gfx, posx);
   mesh.UpdateDim();

   if (mesh.children.boundary) {
      
      if(mesh.children.buffer[0].type & MESH_TYPE.TEXT_MESH){
         
         Helper_scale_text(mesh, scaleFactor, 1);
      }
      else{
         
         Helper_scale_rect(mesh, scaleFactor);
      }

   }

   return true;
}



function Animations_run_scale_down_stop(mesh) {

   // console.log('Button Scale Up Animation stop')

   // Set buttons area to default scale
   mesh.geom.dim[0] = mesh.geom.defDim[0];   // Reset button's area dimentions x
   mesh.geom.dim[1] = mesh.geom.defDim[1];   // Reset button's area dimentions y
   mesh.UpdateDim();

   if (mesh.children.boundary) {

      const scaleFactor = 1; // Must pass param scaleFactor

      // console.log('MESH TYPE: ', Get_name_from_mesh_type(mesh.children.buffer[0].type))
      if(mesh.children.buffer[0].type & MESH_TYPE.TEXT_MESH){

         Helper_scale_text(mesh, scaleFactor, 2);
      }
      else{
         
         Helper_scale_rect(mesh, scaleFactor);
      }

   }

   mesh.state.inScale = false;
   mesh.StateDisable(MESH_STATE.IN_SCALE);
}



/**
 * Helper Functions for scale animation
 * 
 * // TODO: Abtruct better in another file???
 */

function Helper_scale_rect(_mesh, scaleFactor) {

   const children = _mesh.children;
   const count = children.boundary;

   for (let i = 0; i < count; i++) {
      
      const mesh = children.buffer[i];

      if(mesh.children.boundary){ // Recursive
         Helper_scale_rect(mesh, scaleFactor);
      }

      _gfx.Copy(mesh.gfx);

      mesh.geom.dim[0] *= scaleFactor; 
      mesh.geom.dim[1] *= scaleFactor; 

      Gl_set_vpos_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1]);
   }
}



function Helper_scale_text(mesh, scaleFactor, flag) {

   /** Scale button's text meshes */
   let accumTextWidth = 0;
   let posx = mesh.geom.pos[0];
   const textMesh = mesh.children.buffer[0];
   let faceHalfWidth = textMesh.geom.dim[0];

   if(flag !== 2){ // HACK: For scale down stop mesh gets the default dimentions.
      textMesh.geom.dim[0] *= scaleFactor; // Update button's text dimentions x
      textMesh.geom.dim[1] *= scaleFactor; // Update button's text dimentions y
   }
   else{
      textMesh.geom.dim[0] = textMesh.geom.defDim[0]; // Update button's text dimentions x
      textMesh.geom.dim[1] = textMesh.geom.defDim[1]; // Update button's text dimentions y
   }
   
   if(flag === 1) // HACK: For scale down faceHalfWidth must be set after scaling down.
      faceHalfWidth = textMesh.geom.dim[0];

   const extraWidth = (mesh.pad[0] * 2) + faceHalfWidth;
   const advance = textMesh.geom.dim[0] * 2;

   _gfx.Copy(textMesh.gfx);
   for (let i = 0; i < textMesh.mat.char_buffer.boundary; i++) {

      posx = (mesh.geom.pos[0] - mesh.geom.dim[0]) + extraWidth + accumTextWidth;
      Gl_set_wpos_x(_gfx, posx);
      accumTextWidth += advance;
      Gl_set_vpos_xy(_gfx, textMesh.geom.dim[0], textMesh.geom.dim[1])

      const sdfOuter = CalculateSdfOuterFromDim(textMesh.geom.dim[0]);
      GlSetAttrSdfParamsOuter(_gfx, sdfOuter);

      _gfx.vb.start += _gfx.vb.count; // Update gfx info to point to the next text's face
   }
}


















/**********************************************************************************************************************************************/
// Change Color Animation Functions
/**********************************************************************************************************************************************/

export function Animations_create_dim_color_rgb(mesh) {

   mesh.state.inDimColor = true;

   let col = [
      mesh.mat.col[0],
      mesh.mat.col[1],
      mesh.mat.col[2],
      mesh.mat.col[3]
   ];
   // CopyArr4(defCol, mesh.mat.col)

   const params = {
      defCol: col,
      state: mesh.state,
      state2: mesh.state2,
      col: col,
      gfx: mesh.gfx,
      maxcolidx: mesh.mat.col[0] > mesh.mat.col[1] ? 0 : (mesh.mat.col[1] > mesh.mat.col[2] ? 1 : 2),
      maxcol: 0,
   };
   params.maxcol = mesh.mat.col[params.maxcolidx];

   const animations = Mesh_animations_get();
   animations.Create(
      Animations_run_dim_color_rgb_start,
      Animations_run_dim_color_rgb_stop,
      params,
      'Animations_create_dim_color_rgb'
   );
}



function Animations_run_dim_color_rgb_start(params) {

   const gfx = params.gfx;
   const col = params.col;
   const maxcolidx = params.maxcolidx;
   const amt = .8;
   const dimfloor = params.maxcol * .5;

   if (col[maxcolidx] <= dimfloor) return false;

   col[0] *= amt; col[1] *= amt; col[2] *= amt;
   Gl_set_rgba(gfx, col);

   return true;
}



function Animations_run_dim_color_rgb_stop(params) {

   Animations_create_bright_color_rgb(params);
}



export function Animations_create_bright_color_rgb(params) {

   const animations = Mesh_animations_get();
   animations.Create(
      Animations_run_bright_color_rgb_start,
      Animations_run_bright_color_rgb_stop,
      params,
      'Animations_create_bright_color_rgb'
   );
   params.state.inDimColor = false;
   params.state.inBrightColor = true;
}



function Animations_run_bright_color_rgb_start(params) {

   // if (params.state.inHover) return true;
   if (params.state.mask & MESH_STATE.IN_HOVER) return true;

   const gfx = params.gfx;
   const col = params.col;
   const maxcolidx = params.maxcolidx;
   const maxcol = params.maxcol;
   const amt = 1.2;

   if (col[maxcolidx] >= maxcol) return false;

   col[0] *= amt; col[1] *= amt; col[2] *= amt;
   Gl_set_rgba(gfx, col);

   return true;
}



function Animations_run_bright_color_rgb_stop(params) {

   // console.log('Animations_run_bright_color_rgb_stop')
}