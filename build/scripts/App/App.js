"use strict";
import { Scenes_create_scene } from '../Engine/Scenes.js'
import { Renderqueue_init } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { WebGlRenderer } from '../Engine/Renderers/WebGlRenderer.js';
import { CAMERA_CONTROLS, CameraOrthographic, CameraPerspective } from '../Engine/Renderers/Renderer/Camera.js';
import { Texture_init_texture_storage_buffer } from '../Engine/Loaders/Textures/Texture.js';

import { Input_create_user_input_listeners } from '../Engine/Controls/Input/Input.js';
import { TestWidgetsGeneric } from './TestWidgets.js';
import { TimeIntervalsInit } from '../Engine/Timers/TimeIntervals.js';
import { Debug_info_ui_performance_set_initial_position_screen_right } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';


// var osu = require('node-os-utils')
// import {osu} from 'node-os-utils'
// import {osu} from '../node-os-utils/index.js'
// import * as os from "../node-os-utils/index.js"


let renderer = null;

export function AppInit() {

    TimeIntervalsInit();

    // Create and initialize the buffers that will be storing texture-font-uv data. 
    Texture_init_texture_storage_buffer();


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

    renderer = new WebGlRenderer(scene, camera);

    Input_create_user_input_listeners();
    Renderqueue_init();

    // Initializer_popup_initialization();


    TestWidgetsGeneric(scene);


    Debug_info_ui_performance_set_initial_position_screen_right()

    // If camera is static, update projection matrix uniform only once
    // camera.UpdateProjectionUniformAll(renderer.gl);


    // TimeIntervalsCreate(500, 'RenderQueue set program 1 priority', TIME_INTERVAL_REPEAT_ALWAYS, function(){

    //     Renderqueue_get().SetPriorityProgram(LAST, 1);
    //     Renderqueue_get().UpdateActiveQueue();
    // });

    { // PERFORMANCE OBJECTS
        // var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
        // console.log('PERFORMANCE:', performance)
        // const mem = window.performance.memory;
        // console.error(mem)
        // console.error(mem)

        // const r =window.ServiceWorker
        // console.log(r)
        // console.log(window)

        // if ((new Date()).getDay() == 6) { }
        // else {

        //     const work = new Worker("data:text/javascript,setInterval(` dl=Date.now();for(itr=1;itr<1000;itr++){};dl=Date.now()-dl;postMessage(dl);`,1000);");

        //     work.onmessage = (evt) => {
        //         console.log(evt.data)
        //         console.log(12 - evt.data + (' point' + ((new Intl.PluralRules(navigator.language)).select(12 - evt.data) == 'one' ? '' : 's')))
        //     };
        // }

        // setInterval(()=>{console.log('hardwareConcurrency:', navigator.hardwareConcurrency);}, 1000)
    }

    if (DEBUG.SET_HOVER_TO_ALL_MESHES) {

        for (let i = 0; i < scene.children.count; i++) {

            const mesh = scene.children.buffer[i];
            if (mesh) SetHoverToAllMeshesRecursive(scene.children.buffer[i]);
        }
    }
}

export function AppRender() {
    requestAnimationFrame(AppRender);
    renderer.Render();
}
