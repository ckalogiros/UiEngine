"use strict";
import { Scene_reset_window_resized_meshes, Scene_set_projection_matrix, Scenes_create_scene } from '../Engine/Scenes.js'
import { Renderqueue_init, Renderqueue_reset } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { Renderer_create_renderer } from '../Engine/Renderers/Renderer.js';
import { CameraOrthographic } from '../Engine/Renderers/Renderer/Camera.js';
import { Texture_init_texture_storage_buffer } from '../Engine/Loaders/Textures/Texture.js';

import { Detect_host_platform, Device_set_up, Input_create_user_input_listeners } from '../Engine/Controls/Input/Input.js';
import { TestWidgetsGeneric } from './TestWidgets.js';
import { Time_intervals_destroy_all, Time_intervals_init_time, Time_intervals_initialize } from '../Engine/Timers/TimeIntervals.js';
import { Dbg_ui_info_all_reset } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { Performance_timers_init_all } from '../Engine/Timers/PerformanceTimers.js';
import { Listener_init_event_storage_buffers, Listener_reset_event_storage_buffers_dealocate } from '../Engine/Events/EventListeners.js';
import { Notifications_initialize, Notifications_reset } from '../Engine/Drawables/DebugInfo/DebugInfoUiNotifications.js';
import { Callback_animations_destroy, Callback_animations_initialize } from '../Engine/Animations/CallbackAnimations.js';
import { Gfx_pool_vb_reset } from '../Engine/Interfaces/Gfx/GfxPool.js';
import { Mesh_unif_wpos_debug_names_reset, Mesh_unif_wpos_reset, Mesh_unif_wpos_ubidxs_reset } from '../Engine/Core/MeshUniformsBuffer.js';
import { Mesh_animations_reset } from '../Engine/Animations/MeshAnimations.js';
import { Mesh_buffer_reset, Mesh_per_vb_reset_dealocate } from '../Engine/Core/MeshBuffer.js';
import { Str_buffer_mesh_names_index_buffer_reset, Str_buffer_mesh_names_reset, Str_buffer_reset } from '../Engine/Core/StringBuffer.js';
import { View_buffer_reset_g_buffer } from '../Engine/Core/Views/MeshBufferViews.js';
import { Dropdown_roots_reset } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Particles_system_reset } from '../Engine/ParticlesSystem/ParticlesSystem.js';
import { Styles_hover_margin_reset, Styles_margin_reset, Styles_pad_reset } from '../Engine/Styles.js';
import { Generic_buffers_container_reset } from '../Engine/Core/Buffers.js';
import { Root_group_batch_buffer_reset, Root_group_buffer_reset_dealocate, Root_group_destroy_meshes_buffer_alocations, Root_group_gfx_buffer_reset_dealocate } from '../Engine/Core/Views/RootView.js';
import { Shader_bit_flags_build_SID_ATTR } from '../Graphics/ShaderBitFlags.js';
import { Uv_texture_reset_buffers } from '../Engine/Loaders/Textures/TextureUvMap.js';
import { State_reset } from '../GlobalFunctions.js';




let renderer = null;

export function AppInit() {

    SID.ATTR = Shader_bit_flags_build_SID_ATTR();
    SID.ATTR = Shader_bit_flags_build_SID_ATTR();
    // SID.Init();


    Time_intervals_init_time();

    // Create and initialize the buffers that will be storing texture-font-uv data. 
    Texture_init_texture_storage_buffer();

    

    // Device_set_up()
    Detect_host_platform();
    Device_set_up();
    Input_create_user_input_listeners();

    /* Create Renderer and Scene */
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
    
    Performance_timers_init_all();
    Time_intervals_initialize();                // Time_intervals_destroy_all()
    Listener_init_event_storage_buffers();      // Listener_reset_event_storage_buffers()
    Notifications_initialize();                 // Notifications_reset()
    Callback_animations_initialize();           // Callback_animations_destroy()


    // if(PLATFORM.ANY_SMARTPHONE_DEVICE) TEXTURES.DEFAULT_FONT = TEXTURES.CONSOLAS_12px;
    
    TestWidgetsGeneric(scene);

    
    // Renderer_set_canvas_size(VIEWPORT.WIDTH, VIEWPORT.HEIGHT);
    Scene_set_projection_matrix(renderer.scene.sceneidx); // update camera's projection matrix

    // Debug_info_ui_performance_set_initial_position_screen_right()

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
     *  Time_intervals_destroy_all()
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

    Root_group_destroy_meshes_buffer_alocations();
   
    Time_intervals_destroy_all();
    // Listener_reset_event_storage_buffers();
    Listener_reset_event_storage_buffers_dealocate();
    Notifications_reset();
    Renderqueue_reset();
    
    Gfx_pool_vb_reset();

    Uv_texture_reset_buffers();
    
    Mesh_unif_wpos_reset();
    Mesh_unif_wpos_ubidxs_reset();
    Mesh_unif_wpos_debug_names_reset();
    
    
    Callback_animations_destroy();
    // Callback_animations_free();
    Mesh_animations_reset();

    Str_buffer_reset();
    Str_buffer_mesh_names_reset();
    Str_buffer_mesh_names_index_buffer_reset();

    Mesh_buffer_reset();
    // Mesh_per_vb_reset();
    Mesh_per_vb_reset_dealocate()

    // Root_group_buffer_reset();
    Root_group_buffer_reset_dealocate();
    // Root_group_gfx_buffer_reset();
    Root_group_gfx_buffer_reset_dealocate();
    Root_group_batch_buffer_reset();

    View_buffer_reset_g_buffer();

    Dropdown_roots_reset(); // Move to unload-free-destroy phase

    Particles_system_reset();

    Styles_margin_reset();
    Styles_pad_reset();
    Styles_hover_margin_reset();

    Dbg_ui_info_all_reset();

    State_reset();
    GL_STATE.Reset();
    GFX_VBIDX_RENAME_ME.Reset();

    Generic_buffers_container_reset();

    Scene_reset_window_resized_meshes();

}


export function App_reinitialize(){
    Texture_init_texture_storage_buffer();
}