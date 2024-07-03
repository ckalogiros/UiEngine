


















/*******************************************************************************************************************************************************************************/
// Widget Group Buffer: Organize portions of root widgets to smaller groups in order to store some info handle some processes
/*******************************************************************************************************************************************************************************/

/**
 * group = {
 *    meshidx: mesh_bufferidx, // The group's root mesh index
 *    group_data: [], // Store data for each different(one for each vertex buffer) vertex buffer of the meshes of the group
 * }
 *  
 *    group_data: {
 *       meshidx: mesh_bufferidx,
 *       start: start, // The start of the first element of the group in this specific vertex buffer
 *       num_faces: 0, // The number of total faces of all meshes of the vertex buffer belonging to the group. 
 *       gfx_idxs: [progidx, vbidx],
 *   }
 */


// _widget_groups_buffer.Init(1)



// export function Widget_group_get(group_bufferidx) {
//    return _widget_groups_buffer.buffer[group_bufferidx];
// }



// export function Widget_group_get_rootidx(group_bufferidx) {
//    return _widget_groups_buffer.buffer[group_bufferidx].meshidx;
// }



// export function Widget_group_remove_byidx(group_bufferidx) {
//    _widget_groups_buffer.RemoveByIdx(group_bufferidx);
// }



// // Group meshes together. Store the start and num_faces of a bunch of meshes belonging to the same vertex buffer. 
// // Makes it easy to remove meshes from a vertex buffer by using the start and the num_faces index, so the elements to the right of the removed chunk can be shifted to replace the chunks gap.
// // Create a new group. Params: pass the root mesh mesh_bufferidx and the start of the mesh in the vertex buffer as well as the number of faces of the mesh
// export function Widget_group_create(mesh_bufferidx, gfx) {

//    const progidx = gfx.prog.idx, vbidx = gfx.vb.idx, vb_start = gfx.vb.start, ib_start = gfx.ib.start;

//    // Uppon creation, initialize with the root mesh of the new group. 
//    const group = {
//       meshidx: mesh_bufferidx, // The group's root mesh index
//       group_data: [], // Store data for each different(one for each vertex buffer) vertex buffer of the meshes of the group
//    };

//    const group_bufferidx = _widget_groups_buffer.Add(group);

//    const data = {
//       meshidx: mesh_bufferidx,
//       start: vb_start, // The start vertex buffer index, of the first element of this group
//       ib_start: ib_start,  // The start index buffer index, of the first element of this group
//       num_faces: 0, // The number of total faces of all meshes of the vertex buffer belonging to the group. 
//       gfx_idxs: [progidx, vbidx],
//    }

//    const vb_data_idx = _widget_groups_buffer.buffer[group_bufferidx].group_data.push(data);
//    const group_buffer_vbidx = vb_data_idx - 1;


//    // The group's root mesh back in caller site, must store the group's index for refferencing to the group.
//    return [group_bufferidx, group_buffer_vbidx];
// }



// // Case mesh is added on run time, create or use group_data
// export function Widget_group_add(group_bufferidx, gfx, num_faces = _, mesh_bufferidx) {

//    /**DEBUG */ if (num_faces === _) console.error('Forget to pass param: num_faces. @ Widget_group_add()');


//    const progidx = gfx.prog.idx, vbidx = gfx.vb.idx, start = gfx.vb.start, ib_start = gfx.ib.start;
//    const group = _widget_groups_buffer.buffer[group_bufferidx];

//    const len = group.group_data.length;
//    for (let i = 0; i < len; i++) {

//       // if (group.group_data[i].gfx_idxs[GFX.PROG_IDX] === progidx && group.group_data[i].gfx_idxs[GFX.VB_IDX] === vbidx) {
//       if (group.group_data[i].gfx_idxs[GFX.VB_IDX] === vbidx) { // vbidx is enough

//          group.group_data[i].num_faces += num_faces;

//          // Case the mesh inserted to the group is rendered first in the vertex buffer. 
//          // if (group.group_data[i].start > start) {
//          //    group.group_data[i].start = start;
//          // }
//          // if (group.group_data[i].ib_start > ib_start) {
//          //    group.group_data[i].ib_start = ib_start;
//          // }

//          // for (let j = 0; j < group.group_data.length; j++) console.log('group_data:', group.group_data[j].num_faces, )
//          return i; // vb found, no need to create. Return the index to the mesh for refference.
//       }

//    }

//    // Else if group_data NOT {found and returned}, create group_data for the vertex buffer the mesh belongs to. 
//    const vb_data_idx = _widget_groups_buffer.buffer[group_bufferidx].group_data.push({
//       meshidx: mesh_bufferidx,
//       start: start, // The start of the first element of the group in this specific vertex buffer
//       ib_start: ib_start, // The start of the first element of the group in this specific vertex buffer
//       num_faces: num_faces, // The number of total faces of all meshes of the vertex buffer belonging to the group. 
//       gfx_idxs: [progidx, vbidx],
//    });


//    // The group's root mesh back in caller site, must store the group's index for refferencing to the group.
//    return vb_data_idx - 1;
// }



// // Case mesh is added on run time, create or use group_data
// export function Widget_group_find_but_not_insert(group_bufferidx, gfx) {

//    const progidx = gfx.prog.idx, vbidx = gfx.vb.idx;
//    const group = _widget_groups_buffer.buffer[group_bufferidx];

//    const len = group.group_data.length;
//    for (let i = 0; i < len; i++) {

//       if (group.group_data[i].gfx_idxs[GFX.PROG_IDX] === progidx && group.group_data[i].gfx_idxs[GFX.VB_IDX] === vbidx) {
//          return [group_bufferidx, i];
//       }

//    }

//    // Else if group_data NOT {found and returned}, create group_data for the vertex buffer the mesh belongs to. 
//    console.error('Trying to find a group_data for a mesh, but the mesh\'s gfx hasn\'t been initialized for this group.group_data');
//    console.warn('IMPLEMENT HERE the creation of a new group_data apropriate to the mesh\'s gfx buffers');

//    return 1;
// }



// /**
//  * // TODO: 
//  * Remove the init all meshes for batch buffer in debugInfoUi,
//  * create instead a Create batch buffer functio,
//  * increment and decrement with the group buffer
//  * 
//  */
// export function Widget_group_update_increment(group_bufferidxs, num_faces) {

//    _widget_groups_buffer.buffer[group_bufferidxs[0]].group_data[group_bufferidxs[1]].num_faces += num_faces;
// }



// export function Widget_group_update_decrement(group_bufferidxs, num_faces, debug_mesh = null) {


//    const group_data = _widget_groups_buffer.buffer[group_bufferidxs[0]].group_data[group_bufferidxs[1]];
//    group_data.num_faces -= num_faces;

//    if (group_data.num_faces < 0) {
//       console.error('Group Widget num_faces negative. group_bufferidxs:', group_bufferidxs, 'group_data.num_faces', group_data.num_faces);
//    }

//    if (group_data.num_faces === 0) {

//       return true
//    }

//    return false;
// }



// export function Widget_group_destroy_group(group_bufferidxs) {

//    _widget_groups_buffer.RemoveByIdx(group_bufferidxs[0]);

// }



// function Widget_group_destroy_group_data(group_bufferidxs) {

//    const group = _widget_groups_buffer.buffer[group_bufferidxs[0]];

//    group.group_data.splice(group_bufferidxs[1], 1);


// }



// // Updates the start index of each mesh in the same vertex buffer. In case that the start has changed from the group's creation.
// // NOT to be confused with the updating of the starts of meshes after a Vertex buffer Reset() and Rerender().
// export function Widget_group_update_start(group_bufferidx) {

//    const group = _widget_groups_buffer.buffer[group_bufferidx];

//    const len = group.group_data.length;
//    for (let i = 0; i < len; i++) {

//       const mesh = Mesh_buffer_get_mesh_byidx(group.group_data[i].meshidx);
//       group.group_data[i].start = mesh.gfx.vb.start;
//       group.group_data[i].ib_start = mesh.gfx.ib.start;

//    }
// }



// // TODO: We must implement a very acurate num_faces increment-decrement system
// /** Uses the widget_group buffer to remove that manu "num_faces" from the vertex buffers, which the vb indexes are taken of the widget_root_gfx buffer */
// export function Widget_group_reset_partially_gfx_buffers(root_dp) {

//    const group = Widget_group_get(root_dp.group_bufferidxs[0]);
//    const len = group.group_data.length;
//    for (let i = 0; i < len; i++) {

//       const progidx = group.group_data[i].gfx_idxs[GFX.PROG_IDX];
//       const vbidx = group.group_data[i].gfx_idxs[GFX.VB_IDX];

//       if (progidx === INT_NULL || vbidx === INT_NULL) {
//          console.error('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes', 'progidx', progidx, 'vbidx', vbidx)
//          alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')
//       }

//       const start = group.group_data[i].start;
//       const num_faces = group.group_data[i].num_faces;

//       const vertices_per_rect = VERTS_PER_RECT_INDEXED; // HACK
//       const attribs_per_vertex = Program_get_shader_attribute_attribs_per_vertex(progidx);

//       //TODO: Pass ibidx for good implementation
//       Gl_remove_geometry_params(vbidx, num_faces, start, attribs_per_vertex, vertices_per_rect);
//    }
// }



// /** Reset the vgfx buffers from an index till the end. Fast, it does not remove from gfx buffers. Works only if there is no other group for that gfx buffers. */
// export function Widget_group_reset_from_group_to_vb_end(group_bufferidxs) {

//    // const group = Widget_group_get(root_dp.group_bufferidxs[0]);
//    const group = Widget_group_get(group_bufferidxs[0]);
//    const len = group.group_data.length;
//    for (let i = 0; i < len; i++) {

//       const progidx = group.group_data[i].gfx_idxs[GFX.PROG_IDX];
//       const vbidx = group.group_data[i].gfx_idxs[GFX.VB_IDX];

//       if (progidx === INT_NULL || vbidx === INT_NULL) {
//          console.error('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes', 'progidx', progidx, 'vbidx', vbidx)
//          alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')
//       }

//       const vb_start = group.group_data[i].start; // We want the start of the root mesh of the group, not the start of the root widget
//       Vertexbuffer_reset_to_index(progidx, vbidx, vb_start);

//       const ib_start = group.group_data[i].ib_start; // We want the start of the root mesh of the group, not the start of the root widget
//       Index_buffer_reset_to_index(vbidx, ib_start);

//    }
// }



// /** Reset the vgfx buffers from an index till the end. Fast, it does not remove from gfx buffers. Works only if there is no other group for that gfx buffers. */
// export function Widget_group_reset_from_group_to_vb_end_specific_vbidx(group_bufferidx, group_dataidx) {

//    // const group = Widget_group_get(root_dp.group_bufferidxs[0]);
//    const group = Widget_group_get(group_bufferidx);

//    const progidx = group.group_data[group_dataidx].gfx_idxs[GFX.PROG_IDX];
//    const vbidx = group.group_data[group_dataidx].gfx_idxs[GFX.VB_IDX];

//    if (progidx === INT_NULL || vbidx === INT_NULL) {
//       console.error('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes', 'progidx', progidx, 'vbidx', vbidx)
//       alert('Gfx indexes from the Int8Buffer array are initialized with -1. So the error here is because we hit -1 as an index of one of the 3 gfx indexes')
//    }

//    const vb_start = group.group_data[group_dataidx].start; // We want the start of the root mesh of the group, not the start of the root widget
//    Vertexbuffer_reset_to_index(progidx, vbidx, vb_start);

//    const ib_start = group.group_data[group_dataidx].ib_start; // We want the start of the root mesh of the group, not the start of the root widget
//    Index_buffer_reset_to_index(vbidx, ib_start);
// }



// /** Rerenders from root through mesh tree calls to Rerender(Slow)  */
// export function Widget_group_rerender_tree_mesh_recursive(group_bufferidx) {

//    const rootidx = _widget_groups_buffer.buffer[group_bufferidx].meshidx;
//    const mesh = _mesh_buffer.buffer[rootidx];
//    mesh.Rerender();
// }



// /** Rerenders from root through loop calls to Rerender(Fast) */
// export function Widget_group_rerender_from_group(group_bufferidx) {

//    /**
//     * IMPLEMENT:
//     * Unfortunately the widget_group does not have all of its meshes indexes 
//     */
//    alert('IMPLEMENT ME. Widget_group_rerender_from_group');

//    const rootidx = _widget_groups_buffer.buffer[group_bufferidx].meshidx;

//    // for (let i=0; i<; i++){

//    //    const meshidx = 
//    //    const mesh = _mesh_buffer.buffer[rootidx];

//    //    mesh.Rerender();
//    // }
// }









///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////