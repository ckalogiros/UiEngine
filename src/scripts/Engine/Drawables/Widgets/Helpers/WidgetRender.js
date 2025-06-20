"use strict";

import { View_render_whole_view_group_NEW } from "../../../Core/Views/MeshBufferViews.js";
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
    View_render_whole_view_group_NEW(view_groupidx);
    Construct_listen_events_from_mesh_tree(mesh);
    Construct_listen_events_relations_from_mesh_tree(mesh);
    
}