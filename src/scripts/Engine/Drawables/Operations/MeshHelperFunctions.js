"use strict";

import { Vertex_buffer_group_set_scissorbox } from "../../../Graphics/Buffers/VertexBuffers";
import { Mesh_buffer_get_mesh_byidx, Widget_root_gfx_get } from "../../Core/MeshBuffer";



export function Mesh_set_uniform_ubidx_from_name(uniforms, ubidx, unif_name) {

   const len = uniforms.length;
   for (let i = 0; i < len; i++) {
       if (uniforms[i].name === unif_name) {
           uniforms[i].ubidx = ubidx;
           return;
       }
   }

   alert('Mesh_set_uniform_ubidx_from_name()\nNo mesh with uniform found.')
}



export function Mesh_get_uniform_ubidx_from_name(uniforms, unif_name) {

   const len = uniforms.length;
   for (let i = 0; i < len; i++) {
       if (uniforms[i].name === unif_name) {
           return uniforms[i].ubidx;
       }
   }

   alert('Mesh_get_uniform_ubidx_from_name()\nNo mesh with uniform found.')
}



export function Mesh_set_scissorbox(root_bufferidx, meshidx_x, meshidx_y, meshidx_w, meshidx_h) {

    const root_vb_groupidxs = Widget_root_gfx_get(root_bufferidx);

    // const mx = Mesh_buffer_get_mesh_byidx(meshidx_x);
    // const my = Mesh_buffer_get_mesh_byidx(meshidx_y);
    // const mw = Mesh_buffer_get_mesh_byidx(meshidx_w);
    // const mh = Mesh_buffer_get_mesh_byidx(meshidx_h);

    // const x = mx.GetPosX();
    // const y = my.GetPosY();
    // const w = mw.geom.dim[0]*2;
    // const h = mh.geom.dim[1]*2;

    // Run for all vertex buffer groups that belong to the root widget
    for (let i = 0; i <= root_vb_groupidxs.boundary; i++) {


        // Set scissor box
        Vertex_buffer_group_set_scissorbox(root_vb_groupidxs.buffer[i], meshidx_x, meshidx_y, meshidx_w, meshidx_h)
        Vertex_buffer_group_set_scissorbox(root_vb_groupidxs.buffer[i], meshidx_x, meshidx_y, meshidx_w, meshidx_h)
    }
}



// export function Mesh_set_scissorbox(root_bufferidx, x, y, w, h) {

//     const root_vb_groupidxs = Widget_root_gfx_get(root_bufferidx);

//     // Run for all vertex buffer groups that belong to the root widget
//     for (let i = 0; i <= root_vb_groupidxs.boundary; i++) {

//         // Set scissor box
//         Vertex_buffer_group_set_scissorbox(root_vb_groupidxs.buffer[i], x, y, w, h)
//         Vertex_buffer_group_set_scissorbox(root_vb_groupidxs.buffer[i], x, y, w, h)
//     }
// }

