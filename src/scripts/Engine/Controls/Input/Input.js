
"use strict";


import { OnTouchStart, OnTouchEnd, OnTouchCancel, OnTouchMove, MouseResetDif, MouseResetWheel } from "../Input/Mouse.js";
import { OnMouseMove, OnMouseDown, OnMouseUp, OnMouseOut, OnMouseWheel } from "./Mouse.js";
import { OnKeyDown, OnKeyUp } from "./Keyboard.js";
import { Renderer_set_canvas_size } from "../../Renderers/Renderer.js";
import { Mesh_unif_update_sticky_pos } from "../../Core/MeshUniformsBuffer.js";



export function Input_reset() {  // HOT-PATH
  MouseResetDif(.5);
  MouseResetWheel();
}


function OnWindowResize(e) {

  On_window_resize();
}

export function On_window_resize() {

  
  DEVICE.width = window.innerWidth;
  DEVICE.height = window.innerHeight;
  
  // Store the difference of the cur and prev canvas dimentions
  const xdif = DEVICE.width - VIEWPORT.WIDTH; 
  const ydif = DEVICE.height - VIEWPORT.HEIGHT; 

  VIEWPORT.WIDTH = DEVICE.width;
  VIEWPORT.HEIGHT = DEVICE.height;

  VIEWPORT.LEFT = 0;
  VIEWPORT.RIGHT = DEVICE.width;
  VIEWPORT.TOP = 0;
  VIEWPORT.BOTTOM = DEVICE.height;
  VIEWPORT.centerX = VIEWPORT.LEFT + (VIEWPORT.WIDTH / 2);
  VIEWPORT.centerY = VIEWPORT.TOP + (VIEWPORT.HEIGHT / 2);

  DEVICE.ratio = VIEWPORT.WIDTH / VIEWPORT.HEIGHT;

  VIEWPORT.MARGIN.LEFT = (window.innerWidth - VIEWPORT.WIDTH) / 2;
  VIEWPORT.MARGIN.TOP = (window.innerHeight - VIEWPORT.HEIGHT) / 2

  POSITION_CENTER[0] = VIEWPORT.WIDTH / 2;
  POSITION_CENTER[1] = VIEWPORT.HEIGHT / 2;


  gfxCtx.gl.viewport(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);

  Renderer_set_canvas_size(DEVICE.width, DEVICE.height);
  // console.log('RESIZE CANVAS')


  // Move any meshes that suppose to be stick on the right hand side
  // The position update is happening through the update of the wpos uniform of the root parent  
  Mesh_unif_update_sticky_pos(xdif, ydif)
}

export function Input_create_user_input_listeners() {

  const canvas = document.getElementById('canvas');



  if (PLATFORM.ANDROID_IMPL) {

    // Firefox
    if (canvas.mozRequestFullScreen) canvas.mozRequestFullScreen();
    // Chrome, Safari, and Opera
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    // IE/Edge
    else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();

    // Touch screen events
    canvas.addEventListener("touchstart", OnTouchStart, { passive: false });
    canvas.addEventListener("touchend", OnTouchEnd, { passive: false });
    canvas.addEventListener("touchcancel", OnTouchCancel, { passive: false });
    canvas.addEventListener("touchmove", OnTouchMove, { passive: false });

    canvas.addEventListener('gesturestart', function (event) {
      event.preventDefault();
      console.warn('Android Listener: gesturestart. ', event)
    }, { passive: false });

    canvas.addEventListener('gesturechange', function (event) {
      event.preventDefault();
      console.warn('Android Listener: gesturechange. ', event)
    }, { passive: false });

    canvas.addEventListener('gestureend', function (event) {
      event.preventDefault();
      console.warn('Android Listener: gestureend. ', event)
    }, { passive: false });


    if (canvas.requestFullscreen) canvas.requestFullscreen();

    DEVICE.device_scale = .8;
  }
  else {

    canvas.addEventListener('mousemove', OnMouseMove, false);
    canvas.addEventListener('mouseout', OnMouseOut, false);
    canvas.addEventListener('wheel', OnMouseWheel, false);

  }

  window.addEventListener('mousedown', OnMouseDown, false);
  window.addEventListener('mouseup', OnMouseUp, false);
  window.addEventListener("resize", OnWindowResize, false);

  // Disabling the context menu on long taps on Android. 
  canvas.oncontextmenu = function (event) {

    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  document.addEventListener('keydown', OnKeyDown, false);
  document.addEventListener('keyup', OnKeyUp, false);

}


export function Device_set_up() {

  // const canvas = document.getElementById("canvas");
  DEVICE.width = window.innerWidth;
  DEVICE.height = window.innerHeight + document.documentElement.offsetHeight*2;
  console.log('DEVICE width: ', DEVICE.width, ' height: ', DEVICE.height)
  // console.log('WINDOW: ', window)

  if (DEVICE.width > DEVICE.MAX_WIDTH) {
    VIEWPORT.WIDTH = DEVICE.MAX_WIDTH;
    VIEWPORT.HEIGHT = DEVICE.height;
  }
  else {
    VIEWPORT.WIDTH = DEVICE.width;
    VIEWPORT.HEIGHT = DEVICE.height;
  }
  // Update (global) VIEWPORT object
  console.log('VIEWPORT.WIDTH: ', VIEWPORT.WIDTH, ' VIEWPORT.HEIGHT: ', VIEWPORT.HEIGHT)

  DEVICE.ratio = VIEWPORT.WIDTH / VIEWPORT.HEIGHT;

  VIEWPORT.LEFT = 0;
  VIEWPORT.RIGHT = VIEWPORT.WIDTH;
  VIEWPORT.TOP = 0;
  VIEWPORT.BOTTOM = VIEWPORT.HEIGHT;
  VIEWPORT.centerX = VIEWPORT.LEFT + (VIEWPORT.WIDTH / 2);
  VIEWPORT.centerY = VIEWPORT.TOP + (VIEWPORT.HEIGHT / 2);

  VIEWPORT.MARGIN.LEFT = (window.innerWidth - VIEWPORT.WIDTH) / 2;
  VIEWPORT.MARGIN.TOP = (window.innerHeight - VIEWPORT.HEIGHT) / 2

  POSITION_CENTER[0] = VIEWPORT.WIDTH / 2;
  POSITION_CENTER[1] = VIEWPORT.HEIGHT / 2;
  
  DEVICE.info = {
    inner_width:window.innerWidth,
    inner_height:window.innerHeight,
    outer_width:window.outerWidth,
    outer_height:window.outerHeight,
    
    page_xoffset:window.pageXOffset,
    page_yoffset:window.pageYOffset,
    
    gpu:window.navigator.gpu,
    
    virtual_keyboard:window.navigator.virtualKeyboard,

    offsetHeight:   document.documentElement.offsetHeight,
    offsetLeft:   document.documentElement.offsetLeft,
    offsetParent:   document.documentElement.offsetParent,
    offsetTop:   document.documentElement.offsetTop,
    offsetWidth:   document.documentElement.offsetWidth,
    clientHeight:   document.documentElement.clientHeight,
    clientLeft:   document.documentElement.clientLeft,
    clientTop:   document.documentElement.clientTop,
    clientWidth:   document.documentElement.clientWidth,
  };
  

  console.log('DEVICE.info', DEVICE.info)
  console.log('WINDOW', window)
  console.log('DOCUMENT', document);
  console.log('VIEWPORT', VIEWPORT);
  console.log('DEVICE', DEVICE);
  
  /**
    offsetHeight: 1032
    offsetLeft: 0
    offsetParent: null
    offsetTop: 0
    offsetWidth: 799

    clientHeight: 899
    clientLeft: 0
    clientTop: 0
    clientWidth: 799
   */
  console.log('document.documentElement', document.documentElement);
  console.log('document.documentElement.clientWidth', document.documentElement.clientWidth);
}

export function Detect_host_platform() {

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