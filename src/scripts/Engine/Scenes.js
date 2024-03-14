"use strict";
import { Uniforms_block_set_uniform, Uniforms_block_bind_uniform_layout } from '../Graphics/Buffers/UniformBuffers.js';
import { M_Buffer } from './Core/Buffers.js';
import { HandleEvents } from './Events/Events.js';



export class Scene {

    sceneidx = 0; // Scene ID (of type: SCENE const structure).
    camera; // Cameras buffer used by the scene
    name;

    constructor(idx) {

        this.sceneidx = idx;
        this.camera = null;
        this.type |= MESH_TYPE.SCENE;
        this.name = 'scene, idx:' + this.idx;

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

        // this.boundary++;
        // this.active_count++;
        const scene = new Scene(this.boundary+1);
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

    const unifidx = Uniforms_block_bind_uniform_layout('u_projection');
    Uniforms_block_set_uniform(unifidx, _scenes.buffer[sceneidx].camera.matrix);
}




