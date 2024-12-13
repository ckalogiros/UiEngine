"use strict";
import { Scene_set_projection_matrix, Scenes_create_scene } from '../Engine/Scenes.js'
import { Renderqueue_init, Renderqueue_reset } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { Renderer_create_renderer, Renderer_webgl_check_query_results } from '../Engine/Renderers/Renderer.js';
import { CameraOrthographic } from '../Engine/Renderers/Renderer/Camera.js';
import { Texture_init_texture_storage_buffer } from '../Engine/Loaders/Textures/Texture.js';

import { Detect_host_platform, Device_set_up, Input_create_user_input_listeners } from '../Engine/Controls/Input/Input.js';
import { TestWidgetsGeneric } from './TestWidgets.js';
import { Time_intervals_init_time, Time_intervals_destroy, Time_intervals_initialize, Time_intervals_create } from '../Engine/Timers/TimeIntervals.js';
import { Dbg_ui_info_all_reset, Debug_info_ui_performance_set_initial_position_screen_right } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { Performance_timers_init_all } from '../Engine/Timers/PerformanceTimers.js';
import { Listener_init_event_storage_buffers, Listener_reset_event_storage_buffers } from '../Engine/Events/EventListeners.js';
import { Notifications_initialize, Notifications_reset } from '../Engine/Drawables/DebugInfo/DebugInfoUiNotifications.js';
import { Callback_animations_destroy, Callback_animations_initialize } from '../Engine/Animations/CallbackAnimations.js';
import { Gfx_pool_vb_reset } from '../Engine/Interfaces/Gfx/GfxPool.js';
import { Mesh_unif_wpos_debug_names_reset, Mesh_unif_wpos_reset, Mesh_unif_wpos_ubidxs_reset } from '../Engine/Core/MeshUniformsBuffer.js';
import { Mesh_animations_reset } from '../Engine/Animations/MeshAnimations.js';
import { Mesh_buffer_reset, Mesh_per_vb_reset } from '../Engine/Core/MeshBuffer.js';
import { Str_buffer_mesh_names_index_buffer_reset, Str_buffer_mesh_names_reset, Str_buffer_reset } from '../Engine/Core/StringBuffer.js';
import { View_buffer_reset } from '../Engine/Core/Views/MeshBufferViews.js';
import { Dropdown_roots_reset } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Particles_system_reset } from '../Engine/ParticlesSystem/ParticlesSystem.js';
import { Styles_hover_margin_reset, Styles_margin_reset, Styles_pad_reset } from '../Engine/Styles.js';
import { Generic_buffers_container_reset } from '../Engine/Core/Buffers.js';
import { Root_group_batch_buffer_reset, Root_group_buffer_reset, Root_group_gfx_buffer_reset } from '../Engine/Core/Views/RootView.js';
import { Shader_bit_flags_build_SID_ATTR } from '../Graphics/ShaderBitFlags.js';
import { Font_texture_init_buffers, Font_texture_reset_buffers } from '../Engine/Loaders/Font/Font.js';


// var osu = require('node-os-utils')
// import {osu} from 'node-os-utils'
// import {osu} from '../node-os-utils/index.js'
// import * as os from "../node-os-utils/index.js"

// window.location.reload(true)

let renderer = null;

export function AppInit() {

    SID.ATTR = Shader_bit_flags_build_SID_ATTR();
    SID.PASS = Shader_bit_flags_build_SID_ATTR();


    Time_intervals_init_time();

    // Create and initialize the buffers that will be storing texture-font-uv data. 
    Texture_init_texture_storage_buffer();
    Font_texture_init_buffers();

    

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
    Time_intervals_initialize();                // Time_intervals_destroy()
    Listener_init_event_storage_buffers();      // Listener_reset_event_storage_buffers()
    Notifications_initialize();                 // Notifications_reset()
    Callback_animations_initialize();           // Callback_animations_destroy()


    
    if(PLATFORM.ANY_SMARTPHONE_DEVICE) TEXTURES.DEFAULT_FONT = TEXTURES.CONSOLAS_12px;
    
    TestWidgetsGeneric(scene);
    
    // Renderer_set_canvas_size(VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
    Scene_set_projection_matrix(renderer.scene.sceneidx); // update camera's projection matrix

    Debug_info_ui_performance_set_initial_position_screen_right()

    Time_intervals_create(100, 'GPU performance timer query', TIME_INTERVAL_REPEAT_ALWAYS, Renderer_webgl_check_query_results, _);

    // If camera is static, update projection matrix uniform only once
    // camera.UpdateProjectionUniformAll(renderer.gl);

}

export function Application_loop() {
    
    // Update Timers
    // Process Input
    // Update Engine
    // Render
    renderer.Render();


    requestAnimationFrame(Application_loop);
}


export function App_reset(){

    
    /** RESET
     * 
     *  Time_intervals_destroy()
     *  Listener_reset_event_storage_buffers()
     *  Notifications_reset()
     *  Callback_animations_destroy()
     * 
     * Reset the: 
     * string buffer
     * mesh buffer
     * 
     * OR
     * 
     * Reset all buffers from _generic_buffers_container
     * but we need to create containers for charBuuffer, Int16 and Int8 buuffers
     * 
     * 
    */
   
    Time_intervals_destroy();
    Listener_reset_event_storage_buffers();
    Notifications_reset();
    Renderqueue_reset();
    
    Gfx_pool_vb_reset();

    Font_texture_reset_buffers();
    
    Mesh_unif_wpos_reset();
    Mesh_unif_wpos_ubidxs_reset();
    Mesh_unif_wpos_debug_names_reset();
    
    
    Callback_animations_destroy();
    Mesh_animations_reset();

    Str_buffer_reset();
    Str_buffer_mesh_names_reset();
    Str_buffer_mesh_names_index_buffer_reset();

    Mesh_buffer_reset();
    Mesh_per_vb_reset();

    Root_group_buffer_reset();
    Root_group_batch_buffer_reset();
    Root_group_gfx_buffer_reset();

    View_buffer_reset();

    Dropdown_roots_reset();

    Particles_system_reset();

    Styles_margin_reset();
    Styles_pad_reset();
    Styles_hover_margin_reset();

    Dbg_ui_info_all_reset();

    STATE.Reset();
    GL_STATE.Reset();
    GFX_VBIDX_RENAME_ME.Reset();

    Generic_buffers_container_reset();

}


export function App_reinitialize(){

    Time_intervals_create(100, 'GPU performance timer query', TIME_INTERVAL_REPEAT_ALWAYS, Renderer_webgl_check_query_results, _);

    Font_texture_init_buffers();

}