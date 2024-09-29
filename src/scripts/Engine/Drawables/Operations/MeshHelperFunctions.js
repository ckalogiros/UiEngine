"use strict";

import { Vertex_buffer_group_update_scissorbox_all_vb } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Root_group_vbidx_view_view_get } from "../../Core/Views/RootView.js";


export function Mesh_find_unif_idx_from_unif_name(mesh_unif_buffer, unif_name) {

    const len = mesh_unif_buffer.length;
    for (let i = 0; i < len; i++) {
       if (mesh_unif_buffer[i].name === unif_name) {
          return i;
       }
    }
 
    alert('Find_mesh_ubidx_from_unif_name(ubidx, unif_name)\nNo uniform found with name:', unif_name, mesh_unif_buffer)
 }

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



export function Mesh_get_uniform_ubidx_from_name(uniforms_buffer, unif_name) {

   const len = uniforms_buffer.length;
   for (let i = 0; i < len; i++) {
       if (uniforms_buffer[i].name === unif_name) {
           return uniforms_buffer[i].ubidx;
       }
   }

   alert('Mesh_get_uniform_ubidx_from_name()\nNo mesh with uniform found.')
}



export function Mesh_set_scissorbox(root_bufferidx, meshidx_x, meshidx_y, meshidx_w, meshidx_h) {

    const root_vb_groupidxs = Root_group_vbidx_view_view_get(root_bufferidx);

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
        Vertex_buffer_group_update_scissorbox_all_vb(root_vb_groupidxs.buffer[i], meshidx_x, meshidx_y, meshidx_w, meshidx_h)
        Vertex_buffer_group_update_scissorbox_all_vb(root_vb_groupidxs.buffer[i], meshidx_x, meshidx_y, meshidx_w, meshidx_h)
    }
}



// export function Mesh_set_scissorbox(root_bufferidx, x, y, w, h) {

//     const root_vb_groupidxs = Root_group_vbidx_view_view_get(root_bufferidx);

//     // Run for all vertex buffer groups that belong to the root widget
//     for (let i = 0; i <= root_vb_groupidxs.boundary; i++) {

//         // Set scissor box
//         Vertex_buffer_group_update_scissorbox_all_vb(root_vb_groupidxs.buffer[i], x, y, w, h)
//         Vertex_buffer_group_update_scissorbox_all_vb(root_vb_groupidxs.buffer[i], x, y, w, h)
//     }
// }




export function Mesh_calc_pos_dif(mesh1, mesh2) {

    const m1_posx = mesh1.geom.pos[0] + mesh1.geom.dim[0];
    const m1_posy = mesh1.geom.pos[1] + mesh1.geom.dim[1];
    const m2_posx = mesh2.geom.pos[0] + mesh2.geom.dim[0];
    const m2_posy = mesh2.geom.pos[1] + mesh2.geom.dim[1];
    return [
        m1_posx - m2_posx,
        m1_posy - m2_posy,
    ];
}
