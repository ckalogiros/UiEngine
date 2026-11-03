"use strict";
import { Uniforms_block_set_uniform, Uniforms_block_get_uniform_by_name } from '../Graphics/Buffers/UniformBuffers.js';
import { Vertex_buffer_group_update_scissorbox_all_vb } from '../Graphics/Buffers/VertexBuffers.js';
import { Gl_set_dim_x } from '../Graphics/Buffers/VertexBuffersOps.js';
import { M_Buffer, New_generic_buffer, New_int16_buffer } from './Core/Buffers.js';
import { Mesh_buffer_get_mesh_byidx } from './Core/MeshBuffer.js';
import { Screen_wpos_add_y, Screen_wpos_set_y } from './Core/MeshUniformsBuffer.js';
import { Layout_grow_containers_pre_render } from './Drawables/Operations/AlignNestedSections.js';
import { Mesh_add_wpos_x, Mesh_set_wpos_relative_x, Mesh_set_wpos_x, Mesh_update_set_dim_x, Mesh_update_set_dim_y } from './Drawables/Operations/MeshAttributesFunctions.js';
import { HandleEvents } from './Events/Events.js';


/** */
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
/** */
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
/** */
export function Scenes_get_scene_by_idx(sceneidx) { return _scenes.buffer[sceneidx]; }
/** */
export function Scenes_create_scene() { return _scenes.Create(); }
/** */
export function Scenes_get_count() { return _scenes.active_count; }
/** */
export function Scene_set_projection_matrix(sceneidx) {

    const unifidx = Uniforms_block_get_uniform_by_name('u_projection');
    Uniforms_block_set_uniform(unifidx, _scenes.buffer[sceneidx].camera.matrix);
}
/** */
export function Scene_set_screen_res_uniform() {

    const unifidx = Uniforms_block_get_uniform_by_name('u_screen_res');
    Uniforms_block_set_uniform(unifidx, [VIEWPORT.WIDTH, VIEWPORT.HEIGHT]);
}
/** */
export function Scene_camera_zoom(sceneidx, value) {

    _scenes.buffer[sceneidx].camera.Zoom(value);

    const unifidx = Uniforms_block_get_uniform_by_name('u_projection');
    Uniforms_block_set_uniform(unifidx, _scenes.buffer[sceneidx].camera.matrix);
}
/** */
export function Scene_camera_scroll_set(sceneidx, value) {

    // Set the screen wpos
    Screen_wpos_set_y(value);

    Vertex_buffer_group_update_scissorbox_all_vb();
}
/** */
export function Scene_camera_scroll_add(sceneidx, value) {

    // Set the screen wpos
    Screen_wpos_add_y(value);

    Vertex_buffer_group_update_scissorbox_all_vb();
}

const _on_window_resize_roots = New_int16_buffer(1, '_on_window_resize_roots');
/** */
export function Scene_store_window_resized_meshes(mesh_bufferidx) {
    _on_window_resize_roots.Add(mesh_bufferidx);
}
/** */
export function Scene_get_window_resized_meshes() {
    return _on_window_resize_roots;
}
/** */
export function Scene_reset_window_resized_meshes() {
    _on_window_resize_roots.Reset();
}
/** */
export function Scene_window_resized_meshes_calculate_layout() {

    for(let i=0; i<=_on_window_resize_roots.boundary; i++){

        const root_mesh = Mesh_buffer_get_mesh_byidx(_on_window_resize_roots.buffer[i]);

        if(root_mesh.align.flags & LAYOUT.GROW_HORIZONTAL) {
            
            const new_dim_x = VIEWPORT.WIDTH/2 - 1;
            const dif =  new_dim_x - root_mesh.geom.dim[0];

            Mesh_add_wpos_x(root_mesh, dif);
            
            root_mesh.geom.dim[0] = VIEWPORT.WIDTH/2 - 1;
            Mesh_update_set_dim_x(root_mesh);
            Gl_set_dim_x(root_mesh.gfx, root_mesh.geom.dim[0])
        }
        if(root_mesh.align.flags & LAYOUT.GROW_VERTICAL) root_mesh.geom.dim[1] = VIEWPORT.HEIGHT/2 - 1;

        Layout_grow_containers_pre_render(root_mesh);
    }
}


