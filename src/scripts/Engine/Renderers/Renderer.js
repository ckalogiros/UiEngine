"use strict";

import { Gl_draw } from "../../Graphics/GlDraw.js";
import { Time_sample, Time_update } from "../Timers/Time.js";
import { Timers_update_global_timer, Timers_update } from "../Timers/Timers.js";
import { Time_intervals_update } from "../Timers/TimeIntervals.js";
import { Framebuffer_update_draw } from "../../Graphics/Buffers/FrameBuffers.js";
import { Uniforms_block_update_uniform } from "../../Graphics/Buffers/UniformBuffers.js";
import { Notifications_update } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Performance_timer_start, Performance_timer_stop, Performance_timers_update_tick } from "../Timers/PerformanceTimers.js";
import { Scene_set_projection_matrix, Scene_set_screen_res_uniform } from "../Scenes.js";
import { Input_reset } from "../Controls/Input/Input.js";
import { Mesh_animations_run } from "../Animations/MeshAnimations.js";
import { Particle_system_update } from "../ParticlesSystem/ParticlesSystem.js";
import { Callback_animations_run } from "../Animations/CallbackAnimations.js";
import { Physics2D_update } from "../Physics2D/Physics2D.js";



const WEB_GL_PERFORMANCE_MEASURE_ENABLED = false;



var _renderer = null;
/** */
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
         
         Time_update();
         
         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.GameLoop);
         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AllTimersUpdate)
         Time_intervals_update(); // Update and run callbacks for each interval timer that has been set.
         Timers_update_global_timer(); // This is a globbal timer, going only forward
         Timers_update();
         // // Step_timers_update();
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AllTimersUpdate);

         Physics2D_update();
         
         

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.Animations);
         Mesh_animations_run();
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.Animations);

         Callback_animations_run();

         // Framebuffer_update_draw();
         this.scene.OnUpdate();
         
         Notifications_update();
         
         Uniforms_block_update_uniform();
         
         Particle_system_update()
         
         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.GlDraw)
         Gl_draw(this.gfxctx); // REIMPLEMENT: Draw should be independed of graphics platform
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.GlDraw)

         Input_reset();

         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.GameLoop);
         
         Performance_timers_update_tick();

         Time_sample();
         
      }

   }


}
/** */
export function Renderer_create_renderer(scene, camera) {

   _renderer = new Renderer(scene, camera);
   return _renderer;
}
/** */
export function Renderer_create_gl_context(){
   _renderer.CreateGlContext();
}
/** */
export function Renderer_set_canvas_size(width, height) {

   _renderer.SetCanvasSize(width, height);
   _renderer.camera.Set(width, height); // Set the new camera projection matrix
   Scene_set_projection_matrix(_renderer.scene.sceneidx); // update camera's projection matrix
   Scene_set_screen_res_uniform(); // Update screen dimentions uniform
   gfxCtx.gl.viewport(0, 0, width, height);

}
/** */
function Renderer_create_webgl_context(canvas) {

   console.log('Initializing Graphics.')

   /** Create Graphics Context */
   // https://registry.khronos.org/webgl/specs/1.0/#WEBGLCONTEXTATTRIBUTES
   const gl = canvas.getContext("webgl2", {
      alpha: true, //If the value is true, the drawing buffer has an alpha channel for the purposes of performing OpenGL destination alpha operations and compositing with the page. If the value is false, no alpha buffer is available. 
      premultipliedAlpha: true, // If the value is true the page compositor will assume the drawing buffer contains colors with premultiplied alpha.
      // premultipliedAlpha: false, // If the value is true the page compositor will assume the drawing buffer contains colors with premultiplied alpha.
      antialias: false,
      // colorSpace: 'srgb',
      // alpha: true,
      // preserveDrawingBuffer: true,
   });
   if (!gl) alert('Unable to initialize WebGL.');

   console.log('WebGl version: ', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
   console.log('WebGl renderer info: ', gl.getParameter(gl.RENDERER));

   console.log('Suported line widths:', gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE));
   console.log('Max vertex attributes:', gl.getParameter(gl.MAX_VERTEX_ATTRIBS));

   const extensions = gl.getSupportedExtensions();
   // gl.getExtension('OES_standard_derivatives');
   // gl.getExtension('EXT_shader_texture_lod');

   /**
       gl.NEVER (never pass)
      gl.LESS (pass if the incoming value is less than the depth buffer value)
      gl.EQUAL (pass if the incoming value equals the depth buffer value)
      gl.LEQUAL (pass if the incoming value is less than or equal to the depth buffer value)
      gl.GREATER (pass if the incoming value is greater than the depth buffer value)
      gl.NOTEQUAL (pass if the incoming value is not equal to the depth buffer value)
      gl.GEQUAL (pass if the incoming value is greater than or equal to the depth buffer value)
      gl.ALWAYS (always pass)
    */
   gl.enable(gl.DEPTH_TEST);
   gl.depthFunc(gl.ALWAYS)
   // gl.depthFunc(gl.GREATER)
   // gl.depthFunc(gl.LEQUAL)
   // gl.depthFunc(gl.GEQUAL)
   // gl.depthMask(true);

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
   gl.enable(gl.BLEND);
   gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
   // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
   // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

   {
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA);
      // gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);
      // gl.blendFunc(gl.DST_ALPHA, gl.SRC_ALPHA);
      // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA);
      // gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA);
      // gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.ONE);
      
      // gl.blendFunc(gl.ONE, gl.ONE);
      // gl.blendFunc(gl.ONE, gl.SRC_ALPHA);
      // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      // gl.blendFunc(gl.ONE, gl.DST_ALPHA);
      // gl.blendFunc(gl.ONE, gl.ONE_MINUS_DST_ALPHA);

      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      // gl.blendFunc(gl.SRC_ALPHA, gl.SRC_ALPHA);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
      // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA);

      // gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.ONE);
      // gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA);
      // gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // INTRESTING
      // gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.DST_ALPHA);
      // gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_DST_ALPHA);

      // gl.blendFunc(gl.DST_ALPHA, gl.ONE);
      // gl.blendFunc(gl.DST_ALPHA, gl.SRC_ALPHA);
      // gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // DEFAULT
      // gl.blendFunc(gl.DST_ALPHA, gl.DST_ALPHA);
      // gl.blendFunc(gl.DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);

      // gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE);
      // gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA);
      // gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      // gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA);
      // gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_DST_ALPHA);



      // gl.enable(gl.SAMPLE_COVERAGE);
      // gl.sampleCoverage(2.2, false);
   }



   // // Measure GPU time. Not working in all browsers
   // const ext_gpu_timer_query = gl.getExtension('EXT_disjoint_timer_query');
   // let gl_timer_query_obj = null;
   // // const ext_gpu_timer_query = gl.getExtension('EXT_disjoint_timer_query_webgl2');
   // if (!ext_gpu_timer_query) {
      
   //    // const ext_gpu_timer_query2 = gl.getExtension('disjoint_timer_query_webgl2');
   //    // if (!ext_gpu_timer_query2) {
   //    //    console.error('EXT_disjoint_timer_query 2 is not supported');
   //    //    return
   //    // }
   //    console.error('EXT_disjoint_timer_query is not supported');
      
   // }
   // else {

   //    console.error('ext_gpu_timer_query', ext_gpu_timer_query);
      
   //    if(WEB_GL_PERFORMANCE_MEASURE_ENABLED){
   
   //       gl_timer_query_obj = ext_gpu_timer_query.createQueryEXT();
   //    }
   // }







   // console.error(gl.isContextLost());

   canvas.addEventListener('webglcontextlost', function (event) {
      event.preventDefault();
      // Handle context loss
      console.error("WebGL context lost");
   });

   canvas.addEventListener('webglcontextrestored', function (event) {
      // Reinitialize your WebGL resources here
      console.error("WebGL context restored");
   });


   gfxCtx.gl = gl;
   gfxCtx.extentions_string = extensions;
   // gfxCtx.ext = {
   //    ext_gpu_timer_query: ext_gpu_timer_query,
   //    timer_query_obj:gl_timer_query_obj, 
   //    elapsed:0,
   //    accum_timer:0,
   //    counter:0,
   // };

   // Get the maximum allowed attributes count for webgl vertex shader
   // const MAX_VERTEX_ATTRIBS = gfxCtx.gl.getParameter(gfxCtx.gl.MAX_VERTEX_ATTRIBS); // Get the max available attributes for a shader.


   // Print some gl info
   var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
   console.log("Maximum Texture Size: " + maxTextureSize);
   console.log("Extensions: ",  extensions);


   return { 
      gfxctx: gl, 
      extentions_string: extensions, 
      ext:gfxCtx.ext,
   };
}

