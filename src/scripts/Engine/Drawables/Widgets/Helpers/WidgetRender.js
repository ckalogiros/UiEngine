"use strict";

import { Vertex_buffer_calculate_render_group_starts } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Mesh_unif_get_vb_root_wpos } from "../../../Core/MeshUniformsBuffer.js";
import { View_render_from_view_NEW } from "../../../Core/Views/MeshBufferViews.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../../Core/Views/RootView.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../../Events/EventFunctions.js";

export function Widget_render(mesh) {
    
    Vertex_buffer_calculate_render_group_starts();
    View_render_from_view_NEW(mesh.group_bufferidxs[0]);

    Root_group_activate_all_vbs_in_renderqueue(mesh.root_bufferidx);

    mesh.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, mesh.gfx.vb.groupidx)

    Construct_listen_events_from_mesh_tree(mesh)
    Construct_listen_events_relations_from_mesh_tree(mesh);
}