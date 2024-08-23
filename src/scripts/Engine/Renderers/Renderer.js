"use strict";

import { Gl_draw } from "../../Graphics/GlDraw.js";
import { TimeSample, TimeUpdate } from "../Timers/Time.js";
import { TimersUpdateGlobalTimer, Timers_update } from "../Timers/Timers.js";
import { Time_intervals_update } from "../Timers/TimeIntervals.js";
import { Framebuffer_update_draw } from "../../Graphics/Buffers/FrameBuffers.js";
import { Uniforms_block_update_uniform } from "../../Graphics/Buffers/UniformBuffers.js";
import { Notifications_update } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Performance_timer_start, Performance_timer_stop, Performance_timers_update_tick } from "../Timers/PerformanceTimers.js";
import { Command_buffer_run } from "../Core/Commandbuffer.js";
import { Scene_set_projection_matrix, Scene_set_screen_res_uniform } from "../Scenes.js";
import { Input_reset } from "../Controls/Input/Input.js";
import { Mesh_animations_run } from "../Animations/MeshAnimations.js";
import { Particle_system_update } from "../ParticlesSystem/ParticlesSystem.js";
import { Callback_animations_run } from "../Animations/CallbackAnimations.js";







var _renderer = null;

export function Renderer_create_renderer(scene, camera) {

   _renderer = new Renderer(scene, camera);
   return _renderer;
}




export function Renderer_create_gl_context(){
   _renderer.CreateGlContext();
}


export class Renderer {

   // scene
   // camera
   // canvas 
   // gfxctx: Graphics Platform Context
   // extensions: Graphics Platform Extensions
   // Draw: Function pointer to Graphics Platform specific draw function

   constructor(scene, camera) {

      this.canvas = document.getElementById("canvas");

      this.canvas.width = VIEWPORT.WIDTH;
      this.canvas.height = VIEWPORT.HEIGHT;

      const ctx = Renderer_create_webgl_context(this.canvas);
      this.gfxctx = ctx.gfxctx;
      this.extensions = ctx.extensions;

      this.scene = scene;

      scene.SetCamera(camera);
      camera.Init(VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
      this.camera = camera;

   }

   SetCanvasSize(width, height) {

      this.canvas.width = width;
      this.canvas.height = height;
   }

   CreateGlContext(){

      this.canvas = document.getElementById("canvas");

      this.canvas.width = VIEWPORT.WIDTH;
      this.canvas.height = VIEWPORT.HEIGHT;

      const ctx = Renderer_create_webgl_context(this.canvas);
      this.gfxctx = ctx.gfxctx;
      this.extensions = ctx.extensions;
   }


   Render() {

      if (STATE.loop.paused === false) {

         TimeUpdate();

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.GameLoop);

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AllTimersUpdate)
         Time_intervals_update(); // Update and run callbacks for each interval timer that has been set.
         TimersUpdateGlobalTimer(); // This is a globbal timer, going only forward
         Timers_update();
         // Step_timers_update();
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AllTimersUpdate);

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Animations);
         Mesh_animations_run();
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Animations);

         Callback_animations_run();

         Framebuffer_update_draw();
         this.scene.OnUpdate();

         Notifications_update();

         Command_buffer_run()

         Uniforms_block_update_uniform();

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Particles)
         Particle_system_update()
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Particles)


         // Uniforms_buffer_update_uniforms_all();

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.GlDraw)
         Gl_draw(this.gfxctx); // REIMPLEMENT: Draw should be independed of graphics platform
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.GlDraw)

         Input_reset();


         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.GameLoop);

         Performance_timers_update_tick();

         TimeSample();

         // PerformanceTimersTick();
      }

      // if(!STATE.loop.paused) STATE.loop.paused = true;


   }


}



export function Renderer_set_canvas_size(width, height) {

   _renderer.SetCanvasSize(width, height);
   _renderer.camera.Set(width, height); // Set the new camera projection matrix
   Scene_set_projection_matrix(_renderer.scene.sceneidx); // update camera's projection matrix
   Scene_set_screen_res_uniform(); // Update screen dimentions uniform
   gfxCtx.gl.viewport(0, 0, width, height);

}


function Renderer_create_webgl_context(canvas) {

   console.log('Initializing Graphics.')

   /** Create Graphics Context */
   // https://registry.khronos.org/webgl/specs/1.0/#WEBGLCONTEXTATTRIBUTES
   const gfxctx = canvas.getContext("webgl2", {
      alpha: true, //If the value is true, the drawing buffer has an alpha channel for the purposes of performing OpenGL destination alpha operations and compositing with the page. If the value is false, no alpha buffer is available. 
      premultipliedAlpha: true, // If the value is true the page compositor will assume the drawing buffer contains colors with premultiplied alpha.
      antialias: false,
      // colorSpace: 'srgb',
      // alpha: true,
      // preserveDrawingBuffer: true,
   });
   if (!gfxctx) alert('Unable to initialize WebGL.');

   console.log('WebGl version: ', gfxctx.getParameter(gfxctx.SHADING_LANGUAGE_VERSION));
   console.log('WebGl renderer info: ', gfxctx.getParameter(gfxctx.RENDERER));

   console.log('Suported line widths:', gfxctx.getParameter(gfxctx.ALIASED_LINE_WIDTH_RANGE))

   const extensions = gfxctx.getSupportedExtensions();
   // gfxctx.getExtension('OES_standard_derivatives');
   // gfxctx.getExtension('EXT_shader_texture_lod');

   // gfxctx.enable(gfxctx.DEPTH_TEST);
   // gfxctx.depthFunc(gfxctx.LEQUAL)
   // gfxctx.depthFunc(gfxctx.GEQUAL)
   // gfxctx.depthMask(true);

   /**
    gl.ZERO 	                        Multiplies all colors by 0.
    gl.ONE 	                        Multiplies all colors by 1.
    gl.SRC_COLOR 	                  Multiplies all colors by the source colors.
    gl.ONE_MINUS_SRC_COLOR 	         Multiplies all colors by 1 minus each source color.
    gl.DST_COLOR 	                  Multiplies all colors by the destination color.
    gl.ONE_MINUS_DST_COLOR 	         Multiplies all colors by 1 minus each destination color.
    gl.SRC_ALPHA 	                  Multiplies all colors by the source alpha value.
    gl.ONE_MINUS_SRC_ALPHA 	         Multiplies all colors by 1 minus the source alpha value.
    gl.DST_ALPHA 	                  Multiplies all colors by the destination alpha value.
    gl.ONE_MINUS_DST_ALPHA 	         Multiplies all colors by 1 minus the destination alpha value.
    gl.CONSTANT_COLOR 	            Multiplies all colors by a constant color.
    gl.ONE_MINUS_CONSTANT_COLOR 	   Multiplies all colors by 1 minus a constant color.
    gl.CONSTANT_ALPHA 	            Multiplies all colors by a constant alpha value.
    gl.ONE_MINUS_CONSTANT_ALPHA 	   Multiplies all colors by 1 minus a constant alpha value.
    gl.SRC_ALPHA_SATURATE 	         Multiplies the RGB colors by the smaller of either the source alpha value or the value of 1 minus the destination alpha value. The alpha value is multiplied by 1. 
    */
   gfxctx.enable(gfxctx.BLEND);
   gfxctx.blendFunc(gfxctx.DST_ALPHA, gfxctx.ONE_MINUS_SRC_ALPHA);
   // gfxctx.blendFunc(gfxctx.SRC_ALPHA, gfxctx.ONE_MINUS_SRC_ALPHA);

   {
      // gfxctx.blendFunc(gfxctx.SRC_ALPHA, gfxctx.ONE_MINUS_SRC_ALPHA);
      // gfxctx.blendFunc(gfxctx.SRC_ALPHA, gfxctx.ONE_MINUS_DST_ALPHA);
      // gfxctx.blendFunc(gfxctx.DST_ALPHA, gfxctx.ONE_MINUS_DST_ALPHA);

      // gfxctx.blendFunc(gfxctx.ONE_MINUS_SRC_ALPHA, gfxctx.DST_ALPHA);
      // gfxctx.blendFunc(gfxctx.ONE_MINUS_DST_ALPHA, gfxctx.DST_ALPHA);
      // gfxctx.blendFunc(gfxctx.ONE_MINUS_SRC_ALPHA, gfxctx.SRC_ALPHA);
      // gfxctx.blendFunc(gfxctx.ONE_MINUS_DST_ALPHA,gfxctx.SRC_ALPHA) ;


      // gfxctx.enable(gfxctx.SAMPLE_COVERAGE);
      // gfxctx.sampleCoverage(2.2, false);
   }



   // Measure GPU time. Not working in all browsers
   const ext_gpu_timer_query = gfxctx.getExtension('EXT_disjoint_timer_query');
   if (!ext_gpu_timer_query) {
      
      // const ext_gpu_timer_query2 = gfxctx.getExtension('disjoint_timer_query_webgl2');
      // if (!ext_gpu_timer_query2) {
         
      //    console.error('EXT_disjoint_timer_query 2 is not supported');
      //    return
      // }
      console.error('EXT_disjoint_timer_query is not supported');
   }








   console.error(gfxctx.isContextLost());

   canvas.addEventListener('webglcontextlost', function (event) {
      event.preventDefault();
      // Handle context loss
      console.error("WebGL context lost");
   });

   canvas.addEventListener('webglcontextrestored', function (event) {
      // Reinitialize your WebGL resources here
      console.error("WebGL context restored");
   });


   gfxCtx.gl = gfxctx;
   gfxCtx.ext = extensions;

   // NOTE: Gets the maximum allowed attributes count
   // const MAX_VERTEX_ATTRIBS = gfxCtx.gl.getParameter(gfxCtx.gl.MAX_VERTEX_ATTRIBS); // Get the max available attributes for a shader.


   // Print some gl info
   var maxTextureSize = gfxctx.getParameter(gfxctx.MAX_TEXTURE_SIZE);
   console.log("Maximum Texture Size: " + maxTextureSize);

   return { gfxctx: gfxctx, extensions: extensions };
}





