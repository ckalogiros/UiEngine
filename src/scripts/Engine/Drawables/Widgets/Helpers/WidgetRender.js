"use strict";

import { View_activate_all_vbs_in_renderqueue, View_calculate_view_group_starts, View_render_from_view_NEW } from "../../../Core/Views/MeshBufferViews.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../Events/EventFunctions.js";

export function Widget_render(mesh) {
    
    View_calculate_view_group_starts(mesh.group_bufferidxs[0]);
    View_render_from_view_NEW(mesh.group_bufferidxs[0]);

    View_activate_all_vbs_in_renderqueue(mesh.group_bufferidxs);

    Construct_listen_events_from_mesh_tree(mesh)
    Construct_listen_events_relations_from_mesh_tree(mesh);
}