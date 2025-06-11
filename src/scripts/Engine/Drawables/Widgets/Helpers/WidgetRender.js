"use strict";

import { VBI_state_enable } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { View_activate_all_vbs_in_renderqueue, View_calculate_render_group_starts, View_is_render_group_rendered, View_render_specific_render_group, View_render_whole_view_group_NEW } from "../../../Core/Views/MeshBufferViews.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../Events/EventFunctions.js";

/**
 * If group has already been rendered, then the mesh must be added to the vertex buffer without:
 * 1. View_calculate_view_group_starts: Only calculate starts for this rendergroup
 * 2. View_render_from_view_NEW: Render this specific rendergroup
 * 
 * TODO: If we decide to add meshes in already rendered rgs, then we need to check for the rg_is_rendered. To be Implement
 */

export function Widget_render(mesh) {

    const view_groupidx = mesh.group_bufferidxs[0];
    const view_vbidx = mesh.group_bufferidxs[1];
    const view_rgidx = mesh.group_bufferidxs[2];

    View_render_whole_view_group_NEW(view_groupidx);

    // const is_rendergroup_alredy_rendered = View_is_render_group_rendered(view_groupidx, view_vbidx, view_rgidx);
    // if(!is_rendergroup_alredy_rendered) {

    //     View_calculate_render_group_starts(view_groupidx, view_vbidx, view_rgidx);
    //     View_render_specific_render_group(view_groupidx, view_vbidx, view_rgidx);
    
    //     View_activate_all_vbs_in_renderqueue(mesh.group_bufferidxs);

    //     if(mesh.text_mesh) {

    //         const txt_view_vbidx = mesh.text_mesh.group_bufferidxs[1];
    //         const txt_view_rgidx = mesh.text_mesh.group_bufferidxs[2];

    //         // calculate render group starts
    //         View_calculate_render_group_starts(view_groupidx, txt_view_vbidx, txt_view_rgidx);
    
    //         // Render the whole specific render group
    //         View_render_specific_render_group(view_groupidx, txt_view_vbidx, txt_view_rgidx, );
    //     }

    //     if(mesh.children.boundary !== INT_NULL) {

    //         for(let i = 0; i <= mesh.children.boundary; i++) {

    //             const child = mesh.children.buffer[i];

    //             const ch_view_vbidx = child.group_bufferidxs[1];
    //             const ch_view_rgidx = child.group_bufferidxs[2];

    //             const is_rg_rendered = View_is_render_group_rendered(view_groupidx, ch_view_vbidx, ch_view_rgidx);
    //             if(!is_rg_rendered) {

    //                 // calculate render group starts
    //                 View_calculate_render_group_starts(view_groupidx, ch_view_vbidx, ch_view_rgidx);
            
    //                 // Render the whole specific render group
    //                 View_render_specific_render_group(view_groupidx, ch_view_vbidx, ch_view_rgidx, );

    //                 if(child.text_mesh) {

    //                     const txt_view_vbidx = child.text_mesh.group_bufferidxs[1];
    //                     const txt_view_rgidx = child.text_mesh.group_bufferidxs[2];

    //                     // calculate render group starts
    //                     View_calculate_render_group_starts(view_groupidx, txt_view_vbidx, txt_view_rgidx);
                
    //                     // Render the whole specific render group
    //                     View_render_specific_render_group(view_groupidx, txt_view_vbidx, txt_view_rgidx, );
    //                 }
    //             }

    //         }
    //     }
    // }
    // else {

    //     // TODO: Implement mesh addition to rendered rendergroup
    // }

    View_activate_all_vbs_in_renderqueue(mesh.group_bufferidxs);

       
    Construct_listen_events_from_mesh_tree(mesh);
    Construct_listen_events_relations_from_mesh_tree(mesh);
    
}