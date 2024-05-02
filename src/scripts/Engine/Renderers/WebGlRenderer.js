"use strict";

import { Gl_draw } from "../../Graphics/GlDraw.js";
import { MouseResetDif, MouseResetWheel } from "../Controls/Input/Mouse.js";
import { TimeSample, TimeUpdate } from "../Timers/Time.js";
import { TimersUpdateGlobalTimer, TimersUpdateTimers } from "../Timers/Timers.js";
import { TimeIntervalsUpdateAll } from "../Timers/TimeIntervals.js";
import { Framebuffer_update_draw } from "../../Graphics/Buffers/FrameBuffers.js";
import { Batch_update } from "../Batch/Batch.js";
import { Uniforms_block_update_uniform, Uniforms_buffer_update_uniform, Uniforms_buffer_update_uniforms_all } from "../../Graphics/Buffers/UniformBuffers.js";
import { Notifications_update } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Performance_timer_start, Performance_timer_stop } from "../Timers/PerformanceTimers.js";
import { Command_buffer_run } from "../Core/Commandbuffer.js";
import { Scene_set_projection_matrix } from "../Scenes.js";





// TODO: Make PLATFORM, Device and VIEWPORT private to Renderer???


var _renderer = null;

export function Renderer_create_renderer(scene, camera) {
   _renderer = new WebGlRenderer(scene, camera);
   return _renderer;
}



export class WebGlRenderer {

   scene;
   camera;
   canvas;
   gl;
   extensions;
   fpsTimer;

   constructor(scene, camera) {

      this.canvas = document.getElementById("glCanvas");
      this.DeviceSetUp();
      this.Init();

      this.scene = scene;
      
      
      scene.SetCamera(camera);
      camera.Init(VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
      this.camera = camera;



      STATE.scene.active = this.scene;
      STATE.scene.active_idx = this.scene.sceneidx;


      // this.fpsTimer = FpsGet();

   }


   Render() {

      if (STATE.loop.paused === false) {

         TimeUpdate();

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.GameLoop);

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AllTimersUpdate)
         TimeIntervalsUpdateAll(); // Update and run callbacks for each interval timer that has been set.
         TimersUpdateGlobalTimer(); // This is a globbal timer, going only forward
         TimersUpdateTimers();
         // TimersUpdateStepTimers();
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AllTimersUpdate)

         Framebuffer_update_draw();
         // _pt_scene_update.timer.Start(); 
         this.scene.OnUpdate();
         // _pt_scene_update.timer.Stop();

         Batch_update()
         
         Notifications_update();

         Command_buffer_run()

         Uniforms_block_update_uniform();


         // Uniforms_buffer_update_uniforms_all();

         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.GlDraw)
         Gl_draw(this.gl);
         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.GlDraw)


         MouseResetDif(.5);
         MouseResetWheel();

         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.GameLoop);


         TimeSample();

         // PerformanceTimersTick();
      }

      // if(!STATE.loop.paused) STATE.loop.paused = true;


   }


   Init() {
      console.log('Initializing Graphics.')

      /** Create Graphics Context */
      // https://registry.khronos.org/webgl/specs/1.0/#WEBGLCONTEXTATTRIBUTES
      this.gl = this.canvas.getContext("webgl2", {
         alpha: true, //If the value is true, the drawing buffer has an alpha channel for the purposes of performing OpenGL destination alpha operations and compositing with the page. If the value is false, no alpha buffer is available. 
         premultipliedAlpha: true, // If the value is true the page compositor will assume the drawing buffer contains colors with premultiplied alpha.
         antialias: false,
         // colorSpace: 'srgb',
         // alpha: true,
         // preserveDrawingBuffer: true,
      });
      if (!this.gl) alert('Unable to initialize WebGL.');

      console.log('WebGl version: ', this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION));
      console.log('WebGl renderer info: ', this.gl.getParameter(this.gl.RENDERER));


      this.extensions = this.gl.getSupportedExtensions();
      // this.gl.getExtension('OES_standard_derivatives');
      // this.gl.getExtension('EXT_shader_texture_lod');

      // this.gl.enable(this.gl.DEPTH_TEST);
      // this.gl.depthFunc(this.gl.LEQUAL)
      // // this.gl.depthFunc(this.gl.GEQUAL)
      // this.gl.depthMask(true);

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
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.DST_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_DST_ALPHA);
      // this.gl.blendFunc(this.gl.DST_ALPHA, this.gl.ONE_MINUS_DST_ALPHA);

      // this.gl.blendFunc(this.gl.ONE_MINUS_SRC_ALPHA, this.gl.DST_ALPHA);
      // this.gl.blendFunc(this.gl.ONE_MINUS_DST_ALPHA, this.gl.DST_ALPHA);
      // this.gl.blendFunc(this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA);
      // this.gl.blendFunc(this.gl.ONE_MINUS_DST_ALPHA,this.gl.SRC_ALPHA) ;


      // this.gl.enable(this.gl.SAMPLE_COVERAGE);
      // this.gl.sampleCoverage(2.2, false);


      DetectHostPlatform();

      gfxCtx.gl = this.gl;
      gfxCtx.ext = this.extensions;


      // Debug some gl info
      var maxTextureSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
      console.log("Maximum Texture Size: " + maxTextureSize);
   }


   DeviceSetUp() {

      // const canvas = document.getElementById("glCanvas");
      Device.width = window.innerWidth;
      Device.height = window.innerHeight;
      console.log('Device width: ', Device.width, ' height: ', Device.height)
      // console.log('WINDOW: ', window)

      if (Device.width > Device.MAX_WIDTH) {
         this.canvas.width = Device.MAX_WIDTH;
         this.canvas.height = Device.height;
      }
      else {
         this.canvas.width = Device.width;
         this.canvas.height = Device.height;

         // Calculate the correct proportions for all renderables compare to current device
         Device.ratio = Device.width / Device.MAX_WIDTH;
      }
      // Update (global) VIEWPORT object
      VIEWPORT.WIDTH = this.canvas.width;
      VIEWPORT.HEIGHT = this.canvas.height;
      console.log('VIEWPORT.WIDTH: ', VIEWPORT.WIDTH, ' VIEWPORT.HEIGHT: ', VIEWPORT.HEIGHT)

      VIEWPORT.LEFT = 0;
      VIEWPORT.RIGHT = this.canvas.width;
      VIEWPORT.TOP = 0;
      VIEWPORT.BOTTOM = this.canvas.height;
      VIEWPORT.centerX = VIEWPORT.LEFT + (VIEWPORT.WIDTH / 2);
      VIEWPORT.centerY = VIEWPORT.TOP + (VIEWPORT.HEIGHT / 2);

      VIEWPORT.MARGIN.LEFT = (window.innerWidth - VIEWPORT.WIDTH) / 2;
      VIEWPORT.MARGIN.TOP = (window.innerHeight - VIEWPORT.HEIGHT) / 2
      // VIEWPORT.MARGIN.LEFT = (window.outerWidth - (window.innerWidth - VIEWPORT.WIDTH))/2;
      // VIEWPORT.MARGIN.LEFT = ((window.innerWidth - VIEWPORT.WIDTH));
      // VIEWPORT.MARGIN.TOP = (window.innerHeight - VIEWPORT.HEIGHT)

      POSITION_CENTER[0] = VIEWPORT.WIDTH / 2;
      POSITION_CENTER[1] = VIEWPORT.HEIGHT / 2;

   }

}



export function On_window_resize() {

   Device.width = window.innerWidth;
   Device.height = window.innerHeight;

   _renderer.canvas.width  = Device.width;
   _renderer.canvas.height = Device.height;

   VIEWPORT.WIDTH  = Device.width;
   VIEWPORT.HEIGHT = Device.height;

   VIEWPORT.LEFT = 0;
   VIEWPORT.RIGHT = _renderer.canvas.width;
   VIEWPORT.TOP = 0;
   VIEWPORT.BOTTOM = _renderer.canvas.height;
   VIEWPORT.centerX = VIEWPORT.LEFT + (VIEWPORT.WIDTH / 2);
   VIEWPORT.centerY = VIEWPORT.TOP + (VIEWPORT.HEIGHT / 2);

   VIEWPORT.MARGIN.LEFT = (window.innerWidth - VIEWPORT.WIDTH) / 2;
   VIEWPORT.MARGIN.TOP = (window.innerHeight - VIEWPORT.HEIGHT) / 2

   POSITION_CENTER[0] = VIEWPORT.WIDTH / 2;
   POSITION_CENTER[1] = VIEWPORT.HEIGHT / 2;


   gfxCtx.gl.viewport(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);

   _renderer.camera.Set(VIEWPORT.WIDTH, VIEWPORT.HEIGHT); // Set the new camera projection matrix
   Scene_set_projection_matrix(_renderer.scene.sceneidx); // update camera's projection matrix
   // console.log(window.innerWidth, VIEWPORT.WIDTH)
}



function DetectHostPlatform() {

   const wn = window.navigator;
   // console.debug(wn)

   /** Windows Smartphone
    * Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263
    */
   if (/IEMobile/i.test(wn.userAgent)) {
      PLATFORM.WIN_PHONE_IMPL = true;
      console.log('-- Windows Phone Platform --')
   }
   else if (/Android/i.test(wn.userAgent)) {
      PLATFORM.ANDROID_IMPL = true;
      console.log('-- Android Phone Platform --')
      // alert('-- Android Phone Platform --')
   }
   else if (/iPhone|iPad|iPod/i.test(wn.userAgent)) {
      PLATFORM.I_PHONE_IMPL = true;
      console.log('-- Iphone Phone Platform --')
   }
   /** Windows NT
    * Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0 
    */

   // Browser detection
   // https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
   /**
    * function getBrowserName(userAgent) {
     // The order matters here, and this may report false positives for unlisted browsers.
   
     if (userAgent.includes("Firefox")) {
       // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
       return "Mozilla Firefox";
     } else if (userAgent.includes("SamsungBrowser")) {
       // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
       return "Samsung Internet";
     } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
       // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
       return "Opera";
     } else if (userAgent.includes("Edge")) {
       // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
       return "Microsoft Edge (Legacy)";
     } else if (userAgent.includes("Edg")) {
       // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
       return "Microsoft Edge (Chromium)";
     } else if (userAgent.includes("Chrome")) {
       // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
       return "Google Chrome or Chromium";
     } else if (userAgent.includes("Safari")) {
       // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
       return "Apple Safari";
     } else {
       return "unknown";
     }
   }
    */
}


