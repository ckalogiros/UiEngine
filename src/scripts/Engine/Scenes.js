"use strict";
import { UBO_SetUniform } from '../Graphics/Buffers/UniformBuffers.js';
import { M_Buffer } from './Core/Buffers.js';
import { HandleEvents } from './Events/Events.js';



export class Scene {

    sceneidx = 0; // Scene ID (of type: SCENE const structure).
    camera; // Cameras buffer used by the scene
    name;

    constructor(idx) {

        this.sceneidx = idx;
        this.camera = null;
        this.type |= MESH_TYPES_DBG.SCENE;
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

        const scene = new Scene(this.boundary);
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

    UBO_SetUniform(UBS.PROJECTION_LOC, _scenes.buffer[sceneidx].camera.matrix);
}




/**
 * Upon mesh's removal of the vertex buffers, 
 * we must update all the starts of the other meshes
 * that are located at the right of the removed mesh.
 * Otherwise the 'mesh.gfx.vb.start' will point to 
 * the original index, thus accesing deleted mesh attributes.
 */
// export function Scenes_update_all_gfx_starts(sceneidx, groupidx, progidx, vbidx, ret) {

//     const scene = _scenes.buffer[sceneidx];
//     const meshes = scene.gfx.buffer[groupidx].buffer[progidx].buffer[vbidx].buffer;
//     for (let k = 0; k < meshes.boundary; k++) { 
        
//         if(meshes.buffer[k]){ // Make sure for any removed meshes

//             const gfx = meshes.buffer[k].gfx;
//             // Decrement all meshes start indices (that belong to the same vertex buffer) 
//             // if they are 'positioned' after the removed mesh.
//             if (gfx.vb.start > ret.start &&
//                 gfx.prog.groupidx === groupidx && gfx.prog.idx === progidx && gfx.vb.idx === vbidx) {

//                 gfx.vb.start -= ret.counts[0];
//                 gfx.vb.end -= ret.counts[0];
//                 if (gfx.ib.start > 0) {
//                     gfx.ib.start -= ret.counts[1];
//                 }
//             }
//         } 
//     }
// }



