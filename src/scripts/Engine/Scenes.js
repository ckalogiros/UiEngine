"use strict";
import { Uniforms_block_set_uniform, Uniforms_block_get_uniform_by_name } from '../Graphics/Buffers/UniformBuffers.js';
import { Vertex_buffer_group_update_scissorbox_all_vb } from '../Graphics/Buffers/VertexBuffers.js';
import { M_Buffer } from './Core/Buffers.js';
import { Screen_wpos_add_y, Screen_wpos_set_y } from './Core/MeshUniformsBuffer.js';
import { HandleEvents } from './Events/Events.js';
import { MESH_TYPE, STATE, VIEWPORT } from './Global/EngineConstants.js';



class Scene {

    // sceneidx: Scene ID (of type: SCENE const structure).
    // camera: Cameras buffer used by the scene
    // name:

    constructor(idx) {

        this.sceneidx = idx;
        this.camera = null;
        this.type |= MESH_TYPE.SCENE;
        this.name = 'scene, idx:' + this.idx;


        STATE.scene.active = this;
        STATE.scene.active_idx = this.sceneidx;

    }


    OnUpdate() {  // HOT-PATH
        HandleEvents();
    }



    /*******************************************************************************************************************************************************/
    // Camera
    // Store a reference to the camera object
    SetCamera(camera) {
        if (this.camera) alert('Camera already exists for scene:', this.sceneidx)
        this.camera = camera;
    }

};



class Scenes extends M_Buffer {

    constructor() {

        super();
    }

    Create() {

        const scene = new Scene(this.boundary + 1);
        this.Add(scene);
        return scene;
    }


}



const _scenes = new Scenes();
_scenes.Init(1);



export function Scenes_get_scene_by_idx(sceneidx) { return _scenes.buffer[sceneidx]; }



export function Scenes_create_scene() { return _scenes.Create(); }




export function Scenes_get_count() { return _scenes.active_count; }



export function Scene_set_projection_matrix(sceneidx) {

    const unifidx = Uniforms_block_get_uniform_by_name('u_projection');
    Uniforms_block_set_uniform(unifidx, _scenes.buffer[sceneidx].camera.matrix);
}



export function Scene_set_screen_res_uniform() {

    const unifidx = Uniforms_block_get_uniform_by_name('u_screen_res');
    Uniforms_block_set_uniform(unifidx, [VIEWPORT.WIDTH, VIEWPORT.HEIGHT]);
}


export function Scene_camera_zoom(sceneidx, value) {

    _scenes.buffer[sceneidx].camera.Zoom(value);

    const unifidx = Uniforms_block_get_uniform_by_name('u_projection');
    Uniforms_block_set_uniform(unifidx, _scenes.buffer[sceneidx].camera.matrix);
}



export function Scene_camera_scroll_set(sceneidx, value) {

    // Set the screen wpos
    Screen_wpos_set_y(value);

    Vertex_buffer_group_update_scissorbox_all_vb();
}



export function Scene_camera_scroll_add(sceneidx, value) {

    // Set the screen wpos
    Screen_wpos_add_y(value);

    Vertex_buffer_group_update_scissorbox_all_vb();
}




