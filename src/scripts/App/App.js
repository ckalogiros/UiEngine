"use strict";
import { Scene_set_projection_matrix, Scenes_create_scene } from '../Engine/Scenes.js'
import { Renderqueue_init } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { Renderer_create_renderer } from '../Engine/Renderers/Renderer.js';
import { CameraOrthographic } from '../Engine/Renderers/Renderer/Camera.js';
import { Texture_init_texture_storage_buffer } from '../Engine/Loaders/Textures/Texture.js';

import { Detect_host_platform, Device_set_up, Input_create_user_input_listeners } from '../Engine/Controls/Input/Input.js';
import { TestWidgetsGeneric } from './TestWidgets.js';
import { TimeIntervalsInit, Time_intervals_initialize } from '../Engine/Timers/TimeIntervals.js';
import { Debug_info_ui_performance_set_initial_position_screen_right } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { Performance_timers_init_all } from '../Engine/Timers/PerformanceTimers.js';
import { Listener_init_event_storage_buffers } from '../Engine/Events/EventListeners.js';
import { Notifications_initialize } from '../Engine/Drawables/DebugInfo/DebugInfoUiNotifications.js';
import { Callback_animations_initialize } from '../Engine/Animations/CallbackAnimations.js';


// var osu = require('node-os-utils')
// import {osu} from 'node-os-utils'
// import {osu} from '../node-os-utils/index.js'
// import * as os from "../node-os-utils/index.js"


let renderer = null;

export function AppInit() {

    TimeIntervalsInit();

    // Create and initialize the buffers that will be storing texture-font-uv data. 
    Texture_init_texture_storage_buffer();

    

    // Device_set_up()
    Detect_host_platform();
    Device_set_up();
    Input_create_user_input_listeners();

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Create Renderer and Scene
    */
    const scene = Scenes_create_scene();
    const camera = new CameraOrthographic();
    // const camera = new CameraPerspective();
    {
        // camera.SetControls(CAMERA_CONTROLS.PAN);
        // camera.SetControls(CAMERA_CONTROLS.ZOOM);
        // camera.SetControls(CAMERA_CONTROLS.ROTATE);
        // camera.Translate(280, 80, 20)
        // STATE.scene.active = scene;
        // STATE.scene.active_idx = scene.sceneidx;
    }

    renderer = Renderer_create_renderer(scene, camera);
     
    
    Renderqueue_init();
    
    // Initializer_popup_initialization();
    
    Performance_timers_init_all();
    Time_intervals_initialize();
    Listener_init_event_storage_buffers();
    Notifications_initialize();
    Callback_animations_initialize();
    
    
    TestWidgetsGeneric(scene);
    
    // Renderer_set_canvas_size(VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
    Scene_set_projection_matrix(renderer.scene.sceneidx); // update camera's projection matrix

    Debug_info_ui_performance_set_initial_position_screen_right()

    // If camera is static, update projection matrix uniform only once
    // camera.UpdateProjectionUniformAll(renderer.gl);

    // Test cursor
    // document.elm.style.border = "3px solid #FF0000";
    // document.activeElement.style.cursor = url("https://img.icons8.com/doodle/48/000000/cancel-2.png"), auto;

    /** Default mouse pointers */
    document.activeElement.style.cursor = "alias";
    // document.activeElement.style.cursor = "all-scroll";
    // document.activeElement.style.cursor = "auto";
    // document.activeElement.style.cursor = "cell";
    // document.activeElement.style.cursor = "col-resize";
    // document.activeElement.style.cursor = "context-menu";
    // document.activeElement.style.cursor = "copy";
    // document.activeElement.style.cursor = "crosshair";
    // document.activeElement.style.cursor = "default";
    // document.activeElement.style.cursor = "e-resize";
    // document.activeElement.style.cursor = "ew-resize";
    // document.activeElement.style.cursor = "grab";
    // document.activeElement.style.cursor = "grabbing";
    // document.activeElement.style.cursor = "help";
    // document.activeElement.style.cursor = "move";
    // document.activeElement.style.cursor = "n-resize";
    // document.activeElement.style.cursor = "ne-resize";
    // document.activeElement.style.cursor = "nesw-resize";
    // document.activeElement.style.cursor = "ns-resize";
    // document.activeElement.style.cursor = "nw-resize";
    // document.activeElement.style.cursor = "nwse-resize";
    // document.activeElement.style.cursor = "no-drop";
    // document.activeElement.style.cursor = "none";
    // document.activeElement.style.cursor = "not-allowed";
    // document.activeElement.style.cursor = "pointer";
    // document.activeElement.style.cursor = "progress";
    // document.activeElement.style.cursor = "row-resize";
    // document.activeElement.style.cursor = "s-resize";
    // document.activeElement.style.cursor = "se-resize";
    // document.activeElement.style.cursor = "sw-resize";
    // document.activeElement.style.cursor = "text";
    // document.activeElement.style.cursor = "w-resize";
    // document.activeElement.style.cursor = "wait";
    // document.activeElement.style.cursor = "zoom-in";
    // document.activeElement.style.cursor = "zoom-out";
    
    /**Custom  mouse pointers */
    // document.activeElement.style.cursor =  new URL("App/move.cur");
    // document.activeElement.style.cursor = 'url("../resources/icons/cursor/move.cur"), auto';
    // document.activeElement.style.cursor = 'url("../resources/icons/cursor/ubuntu/rinux_real_nswe-resize.cur"), auto';
    document.activeElement.style.cursor = 'url("../resources/icons/cursor/small-windows/move.cur"), auto';
    
    // const url = new URL("../App/move.cur", document.baseURI);
    // const url = new URL("../App/move.cur", document.baseURI);
    // console.log(url.hostname); 
    // console.log(url.pathname); 
    // document.activeElement.style.cursor =  url;


/**
alias
all-scroll
auto
cell
col-resize
context-menu
copy
crosshair
default
e-resize
ew-resize
grab
grabbing
help
move
n-resize
ne-resize
nesw-resize
ns-resize
nw-resize
nwse-resize
no-drop
none
not-allowed
pointer
progress
row-resize
s-resize
se-resize
sw-resize
text
w-resize
wait
zoom-in
zoom-out
myBall.cur
 */
}

export function Application_loop() {
    
    // Update Timers
    // Process Input
    // Update Engine
    // Render
    renderer.Render();


    requestAnimationFrame(Application_loop);
}
