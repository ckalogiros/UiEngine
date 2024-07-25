"use strict";

import { Texture_create_renderbuffer_texture, Texture_set_texture_name } from "../../Engine/Loaders/Textures/Texture.js";
import { Gl_draw_specific } from "../GlDraw.js";
import { Create_mesh_for_framebuffer } from "../../Engine/Drawables/Meshes/FramebufferMesh.js";
import { Str_buffer_change } from "../../Engine/Core/StringBuffer.js";

// SEE: ## Framebuffer VS Renderbuffer


/**
 * Logic: Framebuffer
      Have an array of framebuffers[]. Each frambuffer coresponds to a drawing 'Gl_draw()' command.
      Example: If we want to draw a widget to a framebuffer, we need to construct a framebuffer and do all the bellow.
  
 *    Each framebuffers has:
         1. fbo: webgl id.          gl.createFramebuffer()
         2.
            * texture: webgl texture to draw to.
            * OR
            * renderbuffer.
 *    We can create both texture(for color attachment) and renderbuffer(for depth or stencil), under a frame buffer object.
      Example: 
          1. Create framebuffer.                                        FBO = gl.createFramebuffer();
          2. Bind framebuffer.                                          gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);
          3.   0. Create texture                                        Engine.Gl_texture_unit_create()
               1. Create texture attachment (SEE ## ATACHMENTS).        framebufferTexture2D()
          4.   0. Create renderbuffer                                   Engine.Gl_renderbuffer_create(gl, format, width, height, name) 
               2. Create renderbuffer attachment(SEE ## ATACHMENTS).    framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer)
          5. Check if the framebuffer is complete without errors.       gl.checkFramebufferStatus()
          6. Unbind.                                                    gl.bindFramebuffer(gl.FRAMEBUFFER, 0);

 *    Create an attachment to a framebuffer:       SEE: ## GL attachments
         For texture attachments use:      
            framebufferTexture2D(target, attachment, textarget, texture, level)
         For renderbuffer attachments use:      
            framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer)
  
 *    For the texture: Gl_texture_unit_create().
 *    For the renderbuffer: Gl_renderbuffer_create().      
         On renderbuffer creation it is needed: 
            gl.createRenderbuffer();
            renderbufferStorage(target, internalFormat, width, height);
  
 *    Rendering to a framebuffer.
 *    After we have succesfuly set up a framebuffer we can render existing vertexbuffers to it with the Gl_draw() command like:
         
         gl.bindRenderbuffer(gl.RENDERBUFFER, FBO);
         glEnable(GL_DEPTH_TEST); // enable depth testing (is disabled for rendering screen-space quad)
         glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
         glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

         Draw the geometry to the framebuffer.
         Use the existing method of drawing to the screen:
            gl.drawElements(gl.TRIANGLES, ib.count, gl.UNSIGNED_SHORT, 0);

         Unbind: gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
*/


class Framebuffer {

   fbo; // Gl frame buffer object pointer.
   fbidx; // The index of the current fb in the local _fb_buffer.
   render_target; // The texture or the renderbuffer.
   texture;
   render_area; // A rectangle to draw the framebuffer to. Like any geometry, needs a vertex buffer etc. 
   render_widget; // The mesh (with children) to be rendered to the renderbuffer.
   gfx_queue; // A buffer to store all gfx indexes of struct: [{progidx,vbidx},{...},...].
   needs_update; // A bool to denote if the framebuffer needs to redraw all of the meshes.
   nameidx; // Index to an array of names. Instead of storing the string name, we have a separate array to store all framebuffers names.

   constructor(name = 'NO_NAME') {
      this.fbo = null;
      this.fbidx = INT_NULL;
      this.render_target = null;
      this.texture = null;
      this.render_area = null;
      this.render_widget = null;
      this.gfx_queue = [];
      this.needs_update = false;
      this.nameidx = this.#SetName(name);
   }


   Destroy(gl) {
      gl.deleteFramebuffer(this.fbo);

      // TODO: Dontr forget to Destroy the time interval too
   }


   ChangeName(new_name) {
      this.nameidx = Str_buffer_change(this.nameidx, new_name);
   }


   AddGfxidx(gfxidx) {
alert('IMPLEMENT:\n a function that checs if a vbidx exists in the framebuffer queue')
      // check if the vbidx already exists in the framebuffer gfx queue.
      for (let i = 0; i < gfxidx.length; i++) {

         // If the vbidx is not in the queue, add it
         if (!GfxExists_rename_me(this.gfx_queue, gfxidx[i])) { // If gfx is not already stored, store it
            this.gfx_queue.push(gfxidx[i]);
         }
      }
   }


   #SetName(str_name='FramebufferUNAMED') {
      return Str_buffer_store(str_name);
   }


   #GetName(nameidx) {
      return Framebuffer_get_name(nameidx);
   }

}



const _fb_buffer = []; // A buffer to store all of the scenes framebuffers.

export function Gl_framebuffer_render_mesh(FBID = FB.NEW, FB_TYPE = FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene = null, mesh = null) {

   const gl = gfxCtx.gl

   const dim = (FB_TYPE & FRAMEBUFFER_TYPE.PORTION_DIMENTION) ? [mesh.geom.dim[0], mesh.geom.dim[1]] : [VIEWPORT.WIDTH / 2, VIEWPORT.HEIGHT / 2];
   const pos = (FB_TYPE & FRAMEBUFFER_TYPE.PORTION_DIMENTION) ? [mesh.geom.pos[0], mesh.geom.pos[1], mesh.geom.pos[2]]+1 : [VIEWPORT.WIDTH / 2, VIEWPORT.HEIGHT / 2, mesh.geom.pos[2]+1];

   const TEMP_WHICH_RENDER_TARGET = _;
   const ATTACHMENT = _;
   let fb = null
   let rect = null


   // Render to static framebuffer
   if (FBID & FB.STATIC.ID) {
      if (FB.STATIC.idx === INT_NULL) {
         const new_fb = Gl_framebuffer_create(gl, TEMP_WHICH_RENDER_TARGET, ATTACHMENT, dim[0] * 2, dim[1] * 2, FBID);
         FB.STATIC.idx = new_fb.fbidx; // Store the dynamic framebuffer index to the global storage.
         rect = Create_mesh_for_framebuffer(mesh, new_fb, pos, dim);
      }
      fb = _fb_buffer[FB.STATIC.idx];
   }
   // Render to dynamic framebuffer
   else if (FBID & FB.DYNAMIC.ID) {
      if (FB.DYNAMIC.idx === INT_NULL) {
         const new_fb = Gl_framebuffer_create(gl, TEMP_WHICH_RENDER_TARGET, ATTACHMENT, dim[0] * 2, dim[1] * 2, FBID);
         FB.DYNAMIC.idx = new_fb.fbidx; // Store the dynamic framebuffer index to the global storage.
         rect = Create_mesh_for_framebuffer(mesh, new_fb, pos, dim);
      }
      fb = _fb_buffer[FB.DYNAMIC.idx];
   }
   // Create new framebuffer
   else if (FBID & FB.NEW) {
      fb = Gl_framebuffer_create(gl, TEMP_WHICH_RENDER_TARGET, ATTACHMENT, dim[0] * 2, dim[1] * 2, FBID)
      rect = Create_mesh_for_framebuffer(mesh, fb, pos, dim);
   }


   // Store the framebuffer's index to the meshe.
   mesh.SetFrameBufferIdx(fb.fbidx)
   
   // Must set mesh pos at origin ([0,0] left-bottom), before rendering to the renderbuffer.
   // mesh.Move(-mesh.geom.pos[0]+mesh.geom.dim[0], VIEWPORT.HEIGHT - mesh.geom.pos[1]-mesh.geom.dim[1]);

   alert('Call Widget gfx get all gfx indexes for the mesh')
   // const gfx_queue = Temp_Create_child_gfx_rename_me(mesh); // Gather all unique gfx buffer indexes to an array. 
   // fb.AddGfxidx(gfx_queue); // Check if any gfxidx is not rendered by the framebuffer and add it.
   fb.needs_update = true; // Inform the framebuffer that it needs to be redrawn. The bool is checked somewhere in the App Loop.
   console.log('{{{{fb.gfx_queue}}}} ', fb.gfx_queue)
   // TODO: Implement a Callback event for the Gl_framebuffer_render() to run if 

   // setTimeout(() => { Gl_framebuffer_render(gfxCtx.gl, fb, fb.gfx_queue) }, 1000);

   // setInterval(() => {
   //    for (let i = 0; i < gfx_queue.length; i++) {
   //       Renderqueue_set_active(gfx_queue[i].vbidx, false)
   //    }
   // }, 100)

   return fb;
}



// gl, gl_target, ATACHMENT, render_target,  
function Gl_framebuffer_create(gl = null, TEMP_WHICH_RENDER_TARGET = null, ATTACHMENT = INT_NULL, width = VIEWPORT.WIDTH, height = VIEWPORT.HEIGHT) {

   // Create framebuffer
   const framebuffer = new Framebuffer();
   framebuffer.fbo = gl.createFramebuffer();
   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.fbo);

   const texture = Texture_create_renderbuffer_texture(gl, INT_NULL, width, height);

   gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.TO, texture.level); // SEE: ## framebufferTexture2D
   framebuffer.texture = texture;

   // Store the new framebuffer to the local _fb_buffer
   framebuffer.fbidx = _fb_buffer.push(framebuffer) - 1;

   const name = `Framebuffer:${framebuffer.fbidx} Texidx:${texture.textureid}`;
   Texture_set_texture_name(texture.textureid, name)
   framebuffer.ChangeName(name);

   // TODO: The TEMP_WHICH_RENDER_TARGET should be used in an if statement to chose between texture or renderbuffer creation
   // Draw via renderbuffer
   {
      // const format = gl.DEPTH_COMPONENT16; // TODO: Who decides the type of format? Is it conditionaly chosen OR the caller must pass it as param?
      // // const renderbuffer = Gl_renderbuffer_create(gl, format, width, height, `Renderbuffer: Framebuffer:${framebuffer.nameid}`);
      // const renderbuffer = Gl_renderbuffer_create(gl, format, w, h, `Renderbuffer: Framebuffer:${framebuffer.nameid}`);

      // // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer.rbo); // SEE: ## framebufferRenderbuffer
      // gl.framebufferRenderbuffer(gl.READ_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer.rbo); // SEE: ## framebufferRenderbuffer
      // framebuffer.render_target = renderbuffer;
   }

   // Unbind
   gl.bindFramebuffer(gl.FRAMEBUFFER, null);

   // Debug
   let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER, null);
   if (e !== gl.FRAMEBUFFER_COMPLETE) { alert('FrameBbuffer is not Complete') }

   return framebuffer;
}



export function Framebuffer_get(fbidx) {
   // IMPORTANT: Check for error fbidx !exists
   return _fb_buffer[fbidx];
}



export function FramebufferSetUpdate(fbidx) {
   /**DEBUG */ if (!_fb_buffer[fbidx]) {
      console.error('Not valid Framebuffer index. @ function FramebufferSetUpdate(fbidx)', fbidx);
      return;
   }
   // _pt_framebuffer_rendering.timer.Start();
   _fb_buffer[fbidx].needs_update = true;
   // _pt_framebuffer_rendering.timer.Stop();
   TEMP_TEST_PERFORMANE_COUNTERS.FRAMEBUFFER++;
}



// TODO: Remove export.
export function Gl_framebuffer_render(gl, framebuffer, gfx_queue) { // Renders geometry(from gfx buffers) to a spesific framebuffer target(to texture or to renderbuffer)
   // _pt_framebuffer_rendering.timer.Start();
   // Testing Rotation
   // setInterval(()=>{GlRotateZ2D(mesh.gfx, mesh.geom.dim, Timer_get_global_timer()*.55)}, 10)
   // if(framebuffer.name === 0) GlRotateZ2D(framebuffer.render_area.gfx, framebuffer.render_area.geom.dim, Timer_get_global_timer()*Timer_get_global_timer()*.55)
   // GlRotateZ2D(framebuffer.render_area.gfx, framebuffer.render_area.geom.dim, Timer_get_global_timer()*502.65)
   // GlRotateZ2D(framebuffer.render_area.gfx, framebuffer.render_area.geom.dim, 1.2)
   // GlRotateZ2D(framebuffer.render_area.gfx, framebuffer.render_area.geom.dim, Timer_get_global_timer()*Timer_get_global_timer())

   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.fbo);
   Gl_draw_specific(gl, gfx_queue); // Render to framebuffer

   // const width = framebuffer.texture.width;
   // const height = framebuffer.texture.height;

   // const x = framebuffer.render_area.geom.pos[0] - framebuffer.render_area.geom.dim[0];
   // const y = framebuffer.render_area.geom.pos[1] - framebuffer.render_area.geom.dim[1];
   // const w = framebuffer.render_area.geom.dim[0] *2;
   // const h = framebuffer.render_area.geom.dim[1] *2;

   // // const buffer = new Uint16Array(w * h * 4);
   // // gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_INT, buffer)
   // // const buffer = new Uint8Array(w * h * 4);
   // // gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE , buffer)
   // const buffer = new Uint8Array(VIEWPORT.WIDTH * VIEWPORT.HEIGHT * 4);
   // gl.readPixels(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE , buffer)
   // // gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_SHORT, buffer)

   // for(let i=0; i<buffer.length; i++){
   //    if(buffer[i] > 0)
   //       if(buffer[i] !== 46 && buffer[i] !== 255)
   //          console.log(i, buffer[i])
   // }

   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
   // _pt_framebuffer_rendering.timer.Stop();
}



// This draws or updates the framebuffer texture 
export function Framebuffer_update_draw() { // HOT-PATH

   const count = _fb_buffer.length;

   for (let i = 0; i < count; i++) {

      const fb = _fb_buffer[i];
      if (fb.needs_update) {
         Gl_framebuffer_render(gfxCtx.gl, fb, fb.gfx_queue);
         fb.needs_update = false;
      }
   }
}



/*************************************************************************************************/
// Helpers

const _framebuffer_names = [];

function Framebuffer_store_name(str_name) {
   const idx = _framebuffer_names.push(str_name);
   return idx - 1;
}



function Framebuffer_change_name(idx, new_name) {
   _framebuffer_names[idx] = new_name;
}



function Framebuffer_get_name(idx) {
   return _framebuffer_names[idx];
}



/*************************************************************************************************/
// Debug-Print
export function FramebufferPrintBuffer(){
   const count = _fb_buffer.length;
   for(let i=0; i<count; i++){
      console.log(_fb_buffer[i]);
   }
   console.log(_fb_buffer[i]);
}



export function FramebufferPrintBufferAll(){
   console.log(_fb_buffer);
}



/** MULTI-RENDERING to a renderbuffer
 * 
 * ChatGpt
 * // Create FBO
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

      // Create a large texture
      var textureWidth = 2048; // adjust as needed
      var textureHeight = 2048; // adjust as needed

      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      // Check FBO completeness
      var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
         console.error('Framebuffer is incomplete: ' + status.toString(16));
      }

      // Clear FBO
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Render the first object to a portion of the texture
      var viewportWidth1 = textureWidth / 2; // adjust as needed
      var viewportHeight1 = textureHeight / 2; // adjust as needed

      // [x,y]: bottom-left corner
      gl.viewport(0, 0, viewportWidth1, viewportHeight1);
      // Set other rendering parameters, shaders, etc.
      // Render your first object here

      // Render the second object to a different portion of the texture
      var viewportWidth2 = textureWidth / 2; // adjust as needed
      var viewportHeight2 = textureHeight / 2; // adjust as needed

      gl.viewport(viewportWidth1, 0, viewportWidth2, viewportHeight2);
      // Set other rendering parameters, shaders, etc.
      // Render your second object here

      // Unbind FBO
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      // Use the texture in your main rendering loop or elsewhere
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Render the texture on a quad or use it in shaders, etc.

 * 
 */