
"use strict";


import { OnMouseMove_Android, OnTouchStart, OnTouchEnd, OnTouchCancel, OnTouchMove, MouseResetDif, MouseResetWheel } from "../Input/Mouse.js";
import { OnMouseMove, OnMouseDown, OnMouseUp, OnMouseOut, OnMouseWheel } from "./Mouse.js";
import { OnKeyDown, OnKeyUp } from "./Keyboard.js";
import { Renderer_set_canvas_size } from "../../Renderers/Renderer.js";



export function Input_reset(){  // HOT-PATH
    MouseResetDif(.5);
    MouseResetWheel();
 }


function OnWindowResize(e) {
    
    On_window_resize();
}

export function On_window_resize() {

    Device.width = window.innerWidth;
    Device.height = window.innerHeight;
 
    VIEWPORT.WIDTH  = Device.width;
    VIEWPORT.HEIGHT = Device.height;
 
    VIEWPORT.LEFT = 0;
    VIEWPORT.RIGHT = Device.width;
    VIEWPORT.TOP = 0;
    VIEWPORT.BOTTOM = Device.height;
    VIEWPORT.centerX = VIEWPORT.LEFT + (VIEWPORT.WIDTH / 2);
    VIEWPORT.centerY = VIEWPORT.TOP + (VIEWPORT.HEIGHT / 2);
 
    VIEWPORT.MARGIN.LEFT = (window.innerWidth - VIEWPORT.WIDTH) / 2;
    VIEWPORT.MARGIN.TOP = (window.innerHeight - VIEWPORT.HEIGHT) / 2
 
    POSITION_CENTER[0] = VIEWPORT.WIDTH / 2;
    POSITION_CENTER[1] = VIEWPORT.HEIGHT / 2;
 
 
    gfxCtx.gl.viewport(0, 0, VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
     
    Renderer_set_canvas_size(Device.width, Device.height);
    console.log('RESIZE CANVAS')
} 

export function Input_create_user_input_listeners() {

    if (PLATFORM.ANDROID_IMPL) {

        // document.addEventListener('mousemove', OnMouseMove_Android, false);
        // Touch screen events
        document.addEventListener("touchstart", OnTouchStart, false);
        document.addEventListener("touchend", OnTouchEnd);
        document.addEventListener("touchcancel", OnTouchCancel);
        // document.addEventListener("touchmove", OnTouchMove,  {passive:false});
        document.addEventListener("touchmove", OnTouchMove, false);
    }
    else {

        document.addEventListener('mousemove', OnMouseMove, false);
        document.addEventListener('mouseout', OnMouseOut, false);
        document.addEventListener('wheel', OnMouseWheel, false);
    }

    document.addEventListener('mousedown', OnMouseDown, false);
    document.addEventListener('mouseup', OnMouseUp, false);
    window.addEventListener("resize", OnWindowResize, false);
    //    document.addEventListener("resize", OnWindowResize);

    // Disabling the context menu on long taps on Android. 
    document.oncontextmenu = function (event) {

        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    document.addEventListener('keydown', OnKeyDown, false);
    document.addEventListener('keyup', OnKeyUp, false);

}


export function Device_set_up() {

    // const canvas = document.getElementById("canvas");
    Device.width = window.innerWidth;
    Device.height = window.innerHeight;
    console.log('Device width: ', Device.width, ' height: ', Device.height)
    // console.log('WINDOW: ', window)
 
    if (Device.width > Device.MAX_WIDTH) {
       VIEWPORT.WIDTH = Device.MAX_WIDTH;
       VIEWPORT.HEIGHT = Device.height;
    }
    else {
       VIEWPORT.WIDTH = Device.width;
       VIEWPORT.HEIGHT = Device.height;
 
       // Calculate the correct proportions for all renderables compare to current device
       Device.ratio = Device.width / Device.MAX_WIDTH;
    }
    // Update (global) VIEWPORT object
    console.log('VIEWPORT.WIDTH: ', VIEWPORT.WIDTH, ' VIEWPORT.HEIGHT: ', VIEWPORT.HEIGHT)
 
    VIEWPORT.LEFT = 0;
    VIEWPORT.RIGHT = VIEWPORT.WIDTH;
    VIEWPORT.TOP = 0;
    VIEWPORT.BOTTOM = VIEWPORT.HEIGHT;
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