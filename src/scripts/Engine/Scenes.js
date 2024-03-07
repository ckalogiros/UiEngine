"use strict";
import { Uniform_update_projection_matrix } from '../Graphics/ShaderPrograms.js';
import { AnimationsGet } from './Animations/Animations.js';
import { M_Buffer } from './Core/Buffers.js';
import { Widget_Dropdown } from './Drawables/Widgets/Widget_Dropdown.js';
import { Widget_Text } from './Drawables/Widgets/WidgetText.js';
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

        this.gfx = new M_Buffer(1);
        this.root_meshes = new M_Buffer();

    }


    OnUpdate() {  // HOT-PATH

        // const animations = AnimationsGet();

        // UpdaterRun();

        /** Run Animations */
        // animations.Run();

        /** Handle Events */
        HandleEvents();
    }



    // RemoveMeshFromGfx(groupidx, progidx, vbidx, scene_mesh_in_gfx_idx){

    //     if(scene_mesh_in_gfx_idx === undefined || scene_mesh_in_gfx_idx === INT_NULL){
    //         console.error('UNDEFINED scene_mesh_in_gfx_idx. returning witout removing mesh from buffer. scene_mesh_in_gfx_idx:', scene_mesh_in_gfx_idx);
    //         return true;
    //     }
    //     { /**DEBUG */
    //         const mesh = this.gfx.buffer[groupidx].buffer[progidx].buffer[vbidx].buffer[scene_mesh_in_gfx_idx];
    //         if(DEBUG.REMOVE_MESH) console.log(`Removing mesh: group:${groupidx} prog:${progidx} vb:${vbidx} idx:${scene_mesh_in_gfx_idx}`)
    //     }
    //     this.gfx.buffer[groupidx].buffer[progidx].buffer[vbidx].RemoveByIdx(scene_mesh_in_gfx_idx);
    //     return false;
    // }



    /*******************************************************************************************************************************************************/
    // Camera
    // Store a reference to the camera object
    SetCamera(camera) {
        if (this.camera) alert('Camera already exists for scene:', this.sceneidx)
        this.camera = camera;
    }
    


    /*******************************************************************************************************************************************************/
    /** DEBUG PRINT */
    Print() {
        ScenesPrintRootMeshes(this.children, 0)
    }


    PrintMeshInGfx() {
        console.log('PrintMeshInGfx:')
        for (let i = 0; i < this.mesh_in_gfx.length; i++) {

            console.log('prog, vb:', this.gfxBuffer[i], 'meshes:', this.mesh_in_gfx[i].boundary);
            for (let j = 0; j < this.mesh_in_gfx[i].boundary; j++) {
                console.log(
                    j, 'name:', this.mesh_in_gfx[i].buffer[j].name
                );
            }
        }
    }


    PrintGfxStorageBuffer() {
        // console.log(this.gfx)
        let count_meshes = 0;
        for (let groupidx = 0; groupidx < this.gfx.boundary; groupidx++){
            for (let i = 0; i < this.gfx.buffer[groupidx].boundary; i++){

                console.log('progidx:', i);
                for (let j = 0; j < this.gfx.buffer[groupidx].buffer[i].boundary; j++){
                    
                    console.log('  vbidx:', j);
                    for (let k = 0; k < this.gfx.buffer[groupidx].buffer[i].buffer[j].boundary; k++) { 
                        if(this.gfx.buffer[groupidx].buffer[i].buffer[j].buffer[k]){
                            
                            const mesh = this.gfx.buffer[groupidx].buffer[i].buffer[j].buffer[k];
                            console.log(`    ${k} name:${mesh.name}, gfxmesh: ${mesh.gfx.scene_mesh_in_gfx_idx} mesh: ${mesh.idx} root: ${mesh.scene_rootidx}`)
                            count_meshes++;
                        } 
                    }
                }
            }
        }
        console.log('MESH COUNT:', count_meshes);
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




export function Scenes_bind_camera_to_uniform_projection(sceneidx, groupidx, progidx) { 

    // _scenes.buffer[sceneidx].camera.UpdateProjectionUniform(gfxCtx.gl, progidx, groupidx);
    Uniform_update_projection_matrix(gfxCtx.gl, groupidx, progidx, _scenes.buffer[sceneidx].camera.matrix);
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



/**
 * Debug
 */
export function ScenesPrintRootMeshes(array) {

    let total_count = 0;

    for (let i = 0; i < array.boundary; i++) {

        const mesh = array.buffer[i];
        if (mesh) {

            console.log(i, mesh.name, mesh.geom.pos)
            total_count++;
        }

    }

    return total_count;
}



export function ScenesPrintAllMeshes(children, count) {

    let total_count = 0;

    for (let i = 0; i < children.boundary; i++) {

        const child = children.buffer[i];

        if (child) {

            let r = ' ';
            let s = ' ';

            for (let j = 0; j < count; j++) r += '->';
            for (let j = 0; j < 6-count; j++) s += '  ';

            // console.log(`${i} ${r} ${child.name} idx:${child.idx} pos:[${child.geom.pos[0]},${child.geom.pos[1]} dim:[${child.geom.dim[0]},${child.geom.dim[1]}] gfx:{prog:${child.gfx.prog.idx}, vb:${child.gfx.vb.idx}, start${child.gfx.vb.start}}`);
            console.log(`id:${child.id} ${r}${s} idx:${child.idx} pos:[${child.geom.pos[0]},${child.geom.pos[1]},${child.geom.pos[2]}] dim:[${child.geom.dim[0]},${child.geom.dim[1]}] gfx:{${child.gfx.prog.groupidx},${child.gfx.prog.idx},${child.gfx.vb.idx}, start:${child.gfx.vb.start}} ${child.constructor.name}`);
            total_count++;

            if (child.children.boundary) {
                count++;
                total_count += ScenesPrintAllMeshes(child.children, count);
                count--;
            }
        }
    }

    return total_count;

}



/**************************************************************************************************************************/
// Debug Info Drop Down
// TODO!!: Maybe implement the debug info and its creation functions in another file and use a standardized 
// info-mesh input, like the standard M_Buffer class, to insert all info meshes to the debug info dropdown menu.
const temp_transparency = 0.4;
const pad = [20, 2.5]


function Gather_mesh_children_names(mesh) {

    let buffer = '';
    for (let i = 0; i < mesh.children.boundary; i++) {
        const child = mesh.children.buffer[i];
        if (child) {
            buffer += `${i}: ${child.name} | `;
        }
    }

    return buffer
}



function Scenes_debug_info_create_recursive(scene, dropdown_root, mesh_children, parent_discription) {

    // if children events exist, put them in a new drop down.
    // const dropdown = new Widget_Dropdown(`${parent_discription}`, [200, 400, 0], [60, 20], GREY1, TRANSPARENCY(GetRandomColor(), temp_transparency), WHITE, pad);
    const dropdown = new Widget_Dropdown(`${parent_discription}`, [200, 400, 0], TRANSPARENCY(BLUE_10_120_220, .7), TRANSPARENCY(GREY1, .8), WHITE, pad);


    for (let j = 0; j < mesh_children.boundary; j++) {

        const mesh = mesh_children.buffer[j];

        const type = Listeners_get_event_type_string(mesh.type);
        const info = `mesh: ${mesh.name}`;
        
        const text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, BLUE_10_120_220);
        text.info_id = [type, j]
        text.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;
        dropdown.AddToMenu(text)

        { // Mesh's Gfx info
            const gfx = mesh.gfx;
            const dp_info = `prog:${gfx.prog.idx} | vb:${gfx.vb.idx}, start:${gfx.vb.start}, count:${gfx.vb.boundary}`;
            const dp_gfx = new Widget_Dropdown(`Gfx: ${dp_info}`, [200, 400, 0], GREY6, TRANSPARENCY(RED, .05), WHITE, pad);


            const info = `prog:${gfx.prog.idx} | vb:${gfx.vb.idx}, start:${gfx.vb.start}, count:${gfx.vb.boundary}`;
            const gfx_text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, TRANSPARENCY(GREEN_140_240_10, 1));
            gfx_text.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;
            dropdown.AddToMenu(gfx_text)
        }
        { // Geometry info
            const dp_info = `geom: pos:${mesh.geom.pos} dim:${mesh.geom.dim}`;
            const dp = new Widget_Dropdown(dp_info, [200, 400, 0], GREY1, TRANSPARENCY(GREY1, 1), WHITE, pad);

            const info = `defPos:${mesh.geom.defPos} | defDim:${mesh.geom.defDim}, numFaces:${mesh.geom.num_face}`;
            const gfx_text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, TRANSPARENCY(GREEN_140_240_10, 1));
            gfx_text.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;
            dp.AddToMenu(gfx_text)
            dropdown.AddToMenu(dp)
        }
        { // Miscelaneus info
            const dp = new Widget_Dropdown('Misc', [200, 400, 0], GREY1, TRANSPARENCY(GREY1, 1), WHITE, pad);

            {// Children buffer
                // const info = `children:${mesh.children.buffer}`;
                const info = Gather_mesh_children_names(mesh);
                const gfx_text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, WHITE);
                dp.AddToMenu(gfx_text)
            }
            {// Event Callbacks
                const info = `eventCallbacks:${mesh.eventCallbacks.buffer}`;
                const gfx_text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, WHITE);
                dp.AddToMenu(gfx_text)
            }
            { // Listeners
                const info = `listeners:${mesh.listeners.buffer}`;
                const gfx_text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, WHITE);
                dp.AddToMenu(gfx_text)
            }
            dropdown.AddToMenu(dp)
        }

        if (mesh.children.active_count) // Pass as new root for the recursion the current dropdown menu
            Scenes_debug_info_create_recursive(scene, dropdown, mesh.children, mesh.name);

    }

    dropdown_root.AddToMenu(dropdown);
}



export function Scenes_debug_info_create(scene) {

    // const dropdown = new Widget_Dropdown('Scene Meshes Dropdown Section Panel', [600, 20, 0], GREY1, TRANSPARENCY(GREY7, temp_transparency), WHITE, pad);
    // dropdown.CreateClickEvent();
    // dropdown.CreateMoveEvent();
    // Dropdown_roots_set_root(dropdown, dropdown);

    // for (let i = 0; i < _scenes.boundary; i++) {

    //     const scene = _scenes.buffer[i];
    //     //    const type = Listeners_get_event_type_string(i);

    //     // const drop_down_mesh = new Widget_Dropdown(`${scene.name}`, [200, 400, 0], [60, 20], GREY1, TRANSPARENCY(GetRandomColor(), temp_transparency), WHITE, pad);
    //     const drop_down_mesh = new Widget_Dropdown(`${scene.name}`, [200, 400, 0], GREY1, TRANSPARENCY(BLUE, temp_transparency), WHITE, pad);
    //     drop_down_mesh.CreateClickEvent();

    //     const meshes_buffer = scene.root_meshes;

    //     for (let j = 0; j < meshes_buffer.boundary; j++) {

    //         const mesh = meshes_buffer.buffer[j];

    //         const info = `mesh: ${mesh.name}`;
    //         const text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, WHITE);
    //         text.info_id = [mesh.id]
    //         text.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;
    //         drop_down_mesh.AddToMenu(text)

    //         if (mesh.children)
    //             Scenes_debug_info_create_recursive(scene, drop_down_mesh, mesh.children, mesh.name);

    //     }

    //     dropdown.AddToMenu(drop_down_mesh)
    // }

    // dropdown.Calc();
    // dropdown.ConstructListeners();
}



export function Scenes_debug_info_update(params) {

    const dropdown_root = params.source_params;

    const evt = params.target_params;

    for (let i = 0; i < dropdown_root.children.boundary; i++) {

        const dropdown_child = dropdown_root.children.buffer[i];
        if (dropdown_child.val[0] === evt.type) {

            const type = Listeners_get_event_type_string(evt.type);
            const info = `type: ${type} | name:${evt.source_params.name}`;
            const text = new Widget_Text(info, [OUT_OF_VIEW, OUT_OF_VIEW, 0], 4, WHITE);
            text.info_id = [evt.type, 0]
            text.debug_info.type |= INFO_LISTEN_EVENT_TYPE.LISTENERS;
            dropdown_child.AddToMenu(text);
        }
    }
} 

