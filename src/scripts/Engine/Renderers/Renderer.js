"use strict";

import { Gl_draw } from "../../Graphics/GlDraw.js";
import { TimeSample, TimeUpdate } from "../Timers/Time.js";
import { TimersUpdateGlobalTimer, Timers_update } from "../Timers/Timers.js";
import { Time_intervals_update } from "../Timers/TimeIntervals.js";
import { Framebuffer_update_draw } from "../../Graphics/Buffers/FrameBuffers.js";
import { Uniforms_block_update_uniform } from "../../Graphics/Buffers/UniformBuffers.js";
import { Notifications_update } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Performance_timer_start, Performance_timer_stop, Performance_timers_update_tick, PerformanceTimersGetFps, PerformanceTimersGetMilisec } from "../Timers/PerformanceTimers.js";
import { Command_buffer_run } from "../Core/Commandbuffer.js";
import { Scene_set_projection_matrix, Scene_set_screen_res_uniform } from "../Scenes.js";
import { Input_reset } from "../Controls/Input/Input.js";
import { Mesh_animations_run } from "../Animations/MeshAnimations.js";
import { Particle_system_update } from "../ParticlesSystem/ParticlesSystem.js";
import { Callback_animations_run } from "../Animations/CallbackAnimations.js";



const WEB_GL_PERFORMANCE_MEASURE_ENABLED = false;



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

         
         // Test_log2_performance();


         Performance_timers_update_tick();

         TimeSample();

         // PerformanceTimersTick();
      }

      // if(!STATE.loop.paused) STATE.loop.paused = true;


   }


}

// function log2(val){
//    return Math.log2(val);
// }
// function sqrt(val){
//    return Math.sqrt(val);
// }

// function Test_log2_performance(){

//    const len = BIT_FLAGS_SIZE;
//    let moc = 0;
//    Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest1);


//    for(let i=0; i<len; i++){

//       const res = log2(BIT_FLAGS[i]);
//       moc += res;
//       // const res2 = sqrt(BIT_FLAGS[i]);
//       // moc += res2;
//       // const res3 = Hash(i);
//       // moc += res3;
//       // console.log(res)
//    }


//    Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest1);


//    // const fps = PerformanceTimersGetFps([PERFORMANCE_TIMERS_IDXS.MiscTest1, 0])
//    // const fps = PerformanceTimersGetMilisec([PERFORMANCE_TIMERS_IDXS.MiscTest1, 0])

//    return moc

// }



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
   // gl.enable(gl.DEPTH_TEST);
   // gl.depthFunc(gl.ALWAYS)
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



   // Measure GPU time. Not working in all browsers
   const ext_gpu_timer_query = gl.getExtension('EXT_disjoint_timer_query');
   let gl_timer_query_obj = null;
   // const ext_gpu_timer_query = gl.getExtension('EXT_disjoint_timer_query_webgl2');
   if (!ext_gpu_timer_query) {
      
      // const ext_gpu_timer_query2 = gl.getExtension('disjoint_timer_query_webgl2');
      // if (!ext_gpu_timer_query2) {
      //    console.error('EXT_disjoint_timer_query 2 is not supported');
      //    return
      // }
      console.error('EXT_disjoint_timer_query is not supported');
      
   }
   else {

      console.error('ext_gpu_timer_query', ext_gpu_timer_query);
      
      if(WEB_GL_PERFORMANCE_MEASURE_ENABLED){
   
         gl_timer_query_obj = ext_gpu_timer_query.createQueryEXT();
      }
   }







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
   gfxCtx.ext = {
      ext_gpu_timer_query: ext_gpu_timer_query,
      timer_query_obj:gl_timer_query_obj, 
      elapsed:0,
      accum_timer:0,
      counter:0,
   };

   
   // if(WEB_GL_PERFORMANCE_MEASURE_ENABLED) setInterval(()=>{Renderer_get_performance_timer_query_avaraged(gfxCtx);}, 100)
   // if(WEB_GL_PERFORMANCE_MEASURE_ENABLED) setInterval(()=>{Renderer_get_performance_timer_query_avaraged(gfxCtx);}, 100)
   // if(WEB_GL_PERFORMANCE_MEASURE_ENABLED) setInterval(()=>{Renderer_webgl_check_query_results(gfxCtx);}, 20)

   // NOTE: Gets the maximum allowed attributes count
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


export function Renderer_webgl_check_query_results() {

   if(WEB_GL_PERFORMANCE_MEASURE_ENABLED) {
      
      const ext_gpu_timer_query = gfxCtx.ext.ext_gpu_timer_query;
      const timer_query = gfxCtx.ext.timer_query_obj;
      const gl = gfxCtx.gl;

      const available = ext_gpu_timer_query.getQueryObjectEXT(timer_query, ext_gpu_timer_query.QUERY_RESULT_AVAILABLE_EXT);
      const disjoint = gl.getParameter(ext_gpu_timer_query.GPU_DISJOINT_EXT);
   
      if (available && !disjoint) 
      {
         // Retrieve the result (in nanoseconds)
         const timeElapsed = ext_gpu_timer_query.getQueryObjectEXT(timer_query, ext_gpu_timer_query.QUERY_RESULT_EXT);
         gfxCtx.ext.elapsed = timeElapsed;
         gfxCtx.ext.accum_timer += timeElapsed;
         gfxCtx.ext.counter++;
         // console.log("Time elapsed: " + (timeElapsed / 1000000.0) + " ms");
         // console.log("Time elapsed: " + (timeElapsed / 1000000.0) + " ms", 'avarage', (avarage / 1000000.0) + " ms", 'accum_timer', gfxctx.ext.accum_timer/ 1000000.0, 'counter', gfxctx.ext.counter);
      } 

   }

}

export function Renderer_get_performance_timer_query_avaraged(gfxctx) {

   const avarage_time = gfxctx.ext.accum_timer / gfxctx.ext.counter;
   gfxctx.ext.accum_timer = 0; 
   gfxctx.ext.counter = 0;
   return avarage_time * NANOSEC;

}

export function Renderer_get_performance_timer_query(gfxctx) {

   return gfxctx.ext.elapsed;
}


export function Renderer_webgl_begin_timer_query(gfxctx) {

   const ext_gpu_timer_query = gfxctx.ext.ext_gpu_timer_query;
   if(WEB_GL_PERFORMANCE_MEASURE_ENABLED && ext_gpu_timer_query) {
      const timer_query = gfxctx.ext.timer_query_obj;
      ext_gpu_timer_query.beginQueryEXT(ext_gpu_timer_query.TIME_ELAPSED_EXT, timer_query);
   }
   
}


export function Renderer_webgl_end_timer_query(gfxctx) {
   
   const ext_gpu_timer_query = gfxctx.ext.ext_gpu_timer_query;
   if(WEB_GL_PERFORMANCE_MEASURE_ENABLED && ext_gpu_timer_query) {
      ext_gpu_timer_query.endQueryEXT(ext_gpu_timer_query.TIME_ELAPSED_EXT);
      // gfxctx.ext.counter++;
   }


}





