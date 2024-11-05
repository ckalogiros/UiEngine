"use strict";

import { New_generic_buffer, New_int16_buffer, New_int8_buffer } from "./Buffers.js";
import { BLUEL, GREEN, GREY } from "../Drawables/Material/Base/Colors.js";
import { Create_widget_button, Create_widget_dropdown, Create_widget_section, Create_widget_text } from "./CreateWidget.js";
import { Dropdown_roots_set_root } from "../Drawables/Widgets/Widget_Dropdown.js";
import { Str_buffer_mesh_names_remove_by_idx } from "./StringBuffer.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../Drawables/DebugInfo/DebugInfoUiNotifications.js";
import { Root_group_view_buffer_get, Root_group_view_is_widget_root, Root_group_view_buffer_remove_element_byidx, Root_group_view_buffer_remove_root_byidx } from "./Views/RootView.js";







const NOTIFICATIONS_ON = true;


const _mesh_buffer = New_generic_buffer(_, 'Mesh Buffer');
export function Mesh_buffer_reset() { _mesh_buffer.ResetFull(); }
const _mesh_per_vertex_buffer = New_generic_buffer(_, 'Mesh per Vertex buffer');
export function Mesh_per_vb_reset() { _mesh_per_vertex_buffer.ResetFull(); }





/*******************************************************************************************************************************************************************************/
// Mesh buffer: Stores all meshes of the application
/*******************************************************************************************************************************************************************************/

_mesh_buffer.Init(16);


export function Mesh_buffer_get() { return _mesh_buffer; }
export function Mesh_buffer_get_count() { return _mesh_buffer.active_count; }
export function Mesh_buffer_get_size() { return _mesh_buffer.size; }


export function Mesh_buffer_get_mesh_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx]; }
export function Mesh_buffer_get_mesh_gfx_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].gfx; }
export function Mesh_buffer_get_mesh_name_byidx(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].GetName(); }


export function Mesh_buffer_get_mesh_pos(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].geom.pos; }
export function Mesh_buffer_get_mesh_dim(mesh_bufferidx) { return _mesh_buffer.buffer[mesh_bufferidx].geom.dim; }



export function Mesh_buffer_get_mesh_bounding_box(mesh_bufferidx) {

if(_mesh_buffer.buffer[mesh_bufferidx] === null || _mesh_buffer.buffer[mesh_bufferidx] === undefined)
   console.log()

   const hover_margin = _mesh_buffer.buffer[mesh_bufferidx].StylesGetHoverMargin();
   const pos = _mesh_buffer.buffer[mesh_bufferidx].GetPosXY();
   temp_no_allocation_buffer[0][0] = pos[0] - hover_margin[0];
   temp_no_allocation_buffer[0][1] = pos[0] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[0] * 2 * _mesh_buffer.buffer[mesh_bufferidx].geom.num_faces + hover_margin[0];
   temp_no_allocation_buffer[1][0] = pos[1] - hover_margin[1];
   // TODO: For meshes with more than 4 vertices we must multiply the dimention with the number of faces. So we need to know which coordinate the mesh has the extra vertices towards to, and then mult that coord with the num faces. Currently the only coord to expand is the x axis(for colorpicker HUE bar) 
   temp_no_allocation_buffer[1][1] = pos[1] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[1] * 2 + hover_margin[1];
   // temp_no_allocation_buffer[1][1] = pos[1] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[1] * 2 * _mesh_buffer.buffer[mesh_bufferidx].geom.num_faces + hover_margin[1];

   return temp_no_allocation_buffer;
}


const temp_no_allocation_buffer = []
temp_no_allocation_buffer[0] = [0, 0]
temp_no_allocation_buffer[1] = [0, 0]
export function Mesh_buffer_get_mesh_bounding_box_with_hover_margin(mesh_bufferidx) {
   if (_mesh_buffer.buffer[mesh_bufferidx] === null || _mesh_buffer.buffer[mesh_bufferidx] === _) {
      console.log('Meshbuffer: idx', mesh_bufferidx, _mesh_buffer.buffer);
      return false;
   }

   const pos = _mesh_buffer.buffer[mesh_bufferidx].GetPosXY();
   temp_no_allocation_buffer[0][0] = pos[0];
   temp_no_allocation_buffer[0][1] = pos[0] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[0] * 2 + _mesh_buffer.buffer[mesh_bufferidx].hover_margin[0];
   temp_no_allocation_buffer[1][0] = pos[1];
   temp_no_allocation_buffer[1][1] = pos[1] + _mesh_buffer.buffer[mesh_bufferidx].geom.dim[1] * 2 + _mesh_buffer.buffer[mesh_bufferidx].hover_margin[1];

   return temp_no_allocation_buffer;
}


export function Mesh_buffer_remove_mesh_byidx(mesh_bufferidx, root_bufferidx) {

   const mesh = _mesh_buffer.buffer[mesh_bufferidx];
   if (!mesh || mesh === _) {
      console.error('Mesh is NULL.\n@ Mesh_buffer_remove_mesh_byidx(). mesh_bufferidx:',
         mesh_bufferidx, _mesh_buffer,
         'elem', _mesh_buffer.buffer[mesh_bufferidx],
         'root_bufferidx', root_bufferidx,
         'root_group_view_buffer', Root_group_view_buffer_get(),
      );

      return;
      alert('Mesh is NULL.\n@ Mesh_buffer_remove_mesh_byidx()\nSEE console error');
   }


   // TODO: Remove the whole root is WRONG, we have to destroy all meshes, which we do not do
   // If the mesh is the root, destroy the whole root buffer, gfx_buffer, batch buffer.
   if (Root_group_view_is_widget_root(mesh.root_bufferidx, mesh_bufferidx)) {

      Root_group_view_buffer_remove_root_byidx(mesh.root_bufferidx);
      mesh.root_bufferidx = INT_NULL;
   }
   else { // ...remove element, BUT the removed mesh may be root of a batch-vb or group-groupdata-vb

      // Root_group_view_buffer_remove_element_byidx(mesh.root_bufferidx, mesh_bufferidx);
      // if (mesh.batch_buffer_vbidx !== INT_NULL)
      Root_group_view_buffer_remove_element_byidx(mesh.root_bufferidx, mesh.batch_buffer_vbidx, mesh_bufferidx, mesh.geom.num_faces);

   }

   if (mesh.nameidx !== INT_NULL) Str_buffer_mesh_names_remove_by_idx(mesh.nameidx);
   _mesh_buffer.RemoveByIdx(mesh_bufferidx);


}





/****************************************************/
// Batch Destroy

const _batch_destroy_storage = New_int16_buffer(_, 'WidgetRootBatch-destroy_storage-NOT_USED PROBABLY');




export function Mesh_buffer_batch_destroy_store(idx) {
   // TODOD: DEBUG the idx if exists and in boundaries
   _batch_destroy_storage.Add(idx);
   console.log(idx)
}




export function Mesh_buffer_batch_destroy_run() {
   // TODOD: DEBUG the idx if exists and in boundaries

   for (let i = 0; i <= _batch_destroy_storage.boundary; i++) {

      const idx = _batch_destroy_storage.buffer[i];

      Mesh_buffer_remove_mesh_byidx(idx);

   }

   _batch_destroy_storage.Reset();
}
/** // NOTE:
 * The insertion of meshes to the _mesh_buffer 
 * happens at CreateWidgets.js, directly accessing the _mesh_buffer buffer
 */








































/*******************************************************************************************************************************************************************************/
// Gfx buffer: All mesh indexes by vertex buffer
/*******************************************************************************************************************************************************************************/


const GFX_VIEW_MESH_DEFAULT_COUNT = 16;
_mesh_per_vertex_buffer.Init(4); // For 4 vertex buffers


export function Mesh_per_vb_get() { return _mesh_per_vertex_buffer; }
export function Mesh_per_vb_get_count() { return _mesh_per_vertex_buffer.active_count; }
export function Mesh_per_vb_get_size() { return _mesh_per_vertex_buffer.size; }



export function Mesh_per_vb_get_vb_byidx(vb_groupidx) { return _mesh_per_vertex_buffer.buffer[vb_groupidx]; }



export function Mesh_per_vb_get_mesh(vb_groupidx, per_vb_bufferidx) { return _mesh_per_vertex_buffer.buffer[vb_groupidx][per_vb_bufferidx]; }



export function Mesh_per_vb_create_vb(vb_groupidx) {

   _mesh_per_vertex_buffer.AddAtIndex(vb_groupidx, New_int16_buffer(GFX_VIEW_MESH_DEFAULT_COUNT, 'MeshPerVB buffer'));

   if (NOTIFICATIONS_ON)
      Notifications_send(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.CREATE, vb_groupidx);
}



export function Mesh_per_vb_store_mesh(vb_groupidx, mesh_bufferidx) {
   const idx = _mesh_per_vertex_buffer.buffer[vb_groupidx].Add(mesh_bufferidx);
   
   // /*only for debug*/const mesh_buffer = Mesh_buffer_get(); 
   // /*only for debug*/const mesh = Mesh_buffer_get_mesh_byidx(mesh_bufferidx)
   // console.log('Store', mesh.GetName(), mesh_bufferidx, idx)
   
   return idx;
}



export function Mesh_per_vb_reset_buffer(vb_groupidx) {

   return _mesh_per_vertex_buffer.buffer[vb_groupidx].Reset();
}




// export function Mesh_per_vb_remove_mesh(vb_groupidx, per_vb_bufferidx) {

//    console.log('REMOVING MESH FROM PER_VB_BUFFER', 'vb_group', vb_groupidx, 'meshidx', _mesh_per_vertex_buffer.buffer[vb_groupidx].buffer[per_vb_bufferidx]  )
//    _mesh_per_vertex_buffer.buffer[vb_groupidx].RemoveByIdx(per_vb_bufferidx, _, 'Mesh_per_vb_remove_mesh');


//    // if (NOTIFICATIONS_ON)
//    //    Notifications_send(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.DESTROY, vb_groupidx);

// }

/**
 * Can remove meshidx from the '_mesh_per_vertex_buffer' OneByOne, 
 * via the meshe's .per_vb_bufferidx, which is the index of that mesh in the '_mesh_per_vertex_buffer'.
 */
// export function Mesh_per_vb_remove_mesh_sorted(vb_groupidx, per_vb_bufferidx) {
export function Mesh_per_vb_remove_mesh(vb_groupidx, per_vb_bufferidx) {

   if (per_vb_bufferidx === INT_NULL || per_vb_bufferidx === null) {

      console.error('556188772354 \n per_vb_bufferidx is null'); 
      // alert('556188772354'); 
      return;
   }
   
   _mesh_per_vertex_buffer.buffer[vb_groupidx].RemoveByIdx(per_vb_bufferidx);
   
   // // Remove the mesh from the buffer, and sort by swaping with the last mesh
   // _mesh_per_vertex_buffer.buffer[vb_groupidx].RemoveByIdxSortedVersion(per_vb_bufferidx, _, 'Mesh_per_vb_remove_mesh');
   
   
   // // Get the mesh (from the mesh_buffer), that is the last element of the '_mesh_per_vertex_buffer'.
   // const last_elem_idx = _mesh_per_vertex_buffer.buffer[vb_groupidx].boundary;
   // const swaped_mesh = _mesh_buffer.buffer[_mesh_per_vertex_buffer.buffer[vb_groupidx].buffer[last_elem_idx]];
   // // Case the vb buffer is empty
   // if(swaped_mesh === _ || swaped_mesh===null){
   //    // console.log('last_elem_idx', last_elem_idx, 'per_vb_bufferidx', per_vb_bufferidx)
   //    // console.log('buuffer', _mesh_per_vertex_buffer.buffer[vb_groupidx].buffer)
      
   //    // console.log('mesh to be removed', mesh.GetName())
   //    _mesh_per_vertex_buffer.buffer[vb_groupidx].buffer[per_vb_bufferidx] = INT_NULL;
   //    _mesh_per_vertex_buffer.buffer[vb_groupidx].RemoveByIdxSortedVersion(per_vb_bufferidx, _, 'Mesh_per_vb_remove_mesh');

   //    // const mesh
   //    // if(_mesh_buffer.buffer[_mesh_per_vertex_buffer.buffer[vb_groupidx].buffer[per_vb_bufferidx]])


   //    return;
   // }

   // // Update the swaped mesh's .per_vb_bufferidx value to point to it's new place
   // if(last_elem_idx !== per_vb_bufferidx) 
   //    swaped_mesh.per_vb_bufferidx = per_vb_bufferidx; // Case the removed mesh is last in the _mesh_per_vertex_buffer, then there is no replacement and no need for setting the 'mesh.per_vb_bufferidx'


   // if (NOTIFICATIONS_ON)
   //    Notifications_send(NOTIFICATION_TYPE.MESH_PER_VB_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.DESTROY, vb_groupidx);

}



/**
 * Must be called:
 *    1. On VB reset
 *    2. On VB destroy
 *    3. On a root group that is certain a .PRIVATE vb, 
 *       so no other meshes except the root group can be stored to the group's vertex buffers 
 */
export function Mesh_per_vb_remove_all_from_index(vb_groupidx) {
   
   _mesh_per_vertex_buffer.buffer[vb_groupidx].Reset();

   // const mesh = _mesh_buffer.buffer[meshidx];
   // if (mesh.per_vb_bufferidx === INT_NULL) return; // Avoid created but not active meshes(like deactivated)

   // for (let i = _mesh_per_vertex_buffer.buffer[vb_groupidx].boundary; i >= mesh.per_vb_bufferidx; i--) {
   //    _mesh_per_vertex_buffer.buffer[vb_groupidx].RemoveByIdxSortedVersion(mesh.per_vb_bufferidx, meshidx, 'Mesh_per_vb_remove_all_from_index');
   // }
}



export function Mesh_per_vb_update_mesh_gfx_start(vb_groupidx, start, num_faces) {


   // EFFICIENCY: We should loop through all mesh idxs in gfx_buffer only if there is an accumulated value to be updated to
   for (let j = 0; j <= _mesh_per_vertex_buffer.buffer[vb_groupidx].boundary; j++) {

      const mesh = _mesh_buffer.buffer[_mesh_per_vertex_buffer.buffer[vb_groupidx].buffer[j]];
      if (mesh && mesh.gfx.vb.start >= start) {

         mesh.gfx.vb.start -= num_faces * mesh.gfx.attribsPerVertex * mesh.gfx.vertsPerRect;
      }
   }
}


/***********************************************************************************************************************/
// Debug Info Getters
export function Mesh_per_vb_get_mesh_count(vb_groupidx) { return _mesh_per_vertex_buffer.buffer[vb_groupidx].active_count; }




















/****************************************************************************************************************************************************/
// DEBUG Info - Create text for render
/****************************************************************************************************************************************************/


export function Widget_root_create_text_info() {

   const col_menu = GREY[3], col_dp = GREY[1];

   const s = Create_widget_section(_, SECTION.VERTICAL, [6, 6], [400, 400, 0], [0, 0], TRANSPARENCY(BLUEL[9], .3), 'Wigdet Root Buffers Info');

   const destroy = Create_widget_button(_, 'Destroy', _, _, _, TRANSPARENCY(GREEN[7], .3), _, _, _, _, _);
   // destroy.Bind(TEMP, _, s);
   s.AddItem(destroy);

   // s.Calc()

   const margin = [4, 4];
   const style = {rcorners:3, feather:1, border:0};
   const gr = _widget_groups_buffer;

   const grw = Create_widget_dropdown(_, 'Widget Groups', [100, 100, 0], col_dp, col_menu, _, _, _, _, _, margin);
   grw.CreateClickEvent();
   Dropdown_roots_set_root(grw, grw)
   s.AddItem(grw)

   const group_info = Create_widget_text(_, `count:${gr.active_count} size:${gr.size}`);
   grw.AddToMenu(group_info);

   for (let i = 0; i <= gr.boundary; i++) {


      const group = gr.buffer[i];


      const groupw = Create_widget_dropdown(_, 'Group', [100, 100, 0], col_dp, col_menu, _, [2, 2], _, _, style, margin);
      groupw.CreateClickEvent();
      grw.AddToMenu(groupw)

      const group_info = Create_widget_text(_, `count:${group.active_count} size:${group.size}`);
      groupw.AddToMenu(group_info);

      const len = group.group_data.length;
      for (let i2 = 0; i2 < len; i2++) {

         const group_data = group.group_data[i2];

         const group_dataw = Create_widget_dropdown(_, 'group data', [100, 100, 0], col_dp, col_menu, _, [2, 2], _, _, style, margin);
         group_dataw.CreateClickEvent();
         groupw.AddToMenu(group_dataw)


         { const info = Create_widget_text(_, `meshidx:${group_data.meshidx} num_faces:${group_data.num_faces}`); group_dataw.AddToMenu(info); }
         { const info = Create_widget_text(_, `start:${group_data.start} ib_start:${group_data.ib_start}`); group_dataw.AddToMenu(info); }
         // { const info = Create_widget_text(_, `ib_start:${group_data.ib_start}`); group_dataw.AddToMenu(info); }

         /****************************************************************************************************************************/
      }
   }


   s.Calc()
   return s;
}
























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/


// Buffer of all meshes of the application.
export function Mesh_buffer_print() {
   console.log('_mesh_buffer:', _mesh_buffer);
}



export function Mesh_buffer_print_loop() {

   console.log('size:', _mesh_buffer.size, 'boundary:', _mesh_buffer.boundary, 'count:', _mesh_buffer.active_count,);
   for (let i = 0; i <= _mesh_buffer.boundary; i++) {

      if (_mesh_buffer.buffer[i]) {

         console.log(i,
            'mbidx:', _mesh_buffer.buffer[i].mesh_bufferidx,
            'rbidx:', _mesh_buffer.buffer[i].root_bufferidx,
            'vbgroupidx:', _mesh_buffer.buffer[i].gfx.vb.groupidx,
            'per_vb_idx', _mesh_buffer.buffer[i].per_vb_bufferidx,
            // 'gfxidx', _widget_root_gfx.buffer[_mesh_buffer.buffer[i].root_bufferidx],
            'batchidx:', _mesh_buffer.buffer[i].batch_buffer_vbidx,
            'groupidx:', _mesh_buffer.buffer[i].group_bufferidxs[0], _mesh_buffer.buffer[i].group_bufferidxs[1], _mesh_buffer.buffer[i].group_bufferidxs[2],
            'child idx:', _mesh_buffer.buffer[i].idx,
            'is active:', _mesh_buffer.buffer[i].state.mask & MESH_STATE.ACTIVE,
            'nameidx:', _mesh_buffer.buffer[i].nameidx,
            'pos:', _mesh_buffer.buffer[i].geom.pos,
            'name:', _mesh_buffer.buffer[i].GetName(),
         );
      }
      else console.log(i, 'NULL')
   }
}



export function Mesh_per_vb_print() {

   console.log('size:', _mesh_per_vertex_buffer.size, 'boundary:', _mesh_per_vertex_buffer.boundary, 'count:', _mesh_per_vertex_buffer.active_count,);
   for (let i = 0; i <= _mesh_per_vertex_buffer.boundary; i++) {

      if (_mesh_per_vertex_buffer.buffer[i]) {

         console.log('vb', i,
            '\n size:', _mesh_per_vertex_buffer.buffer[i].size, 'boundary:', _mesh_per_vertex_buffer.buffer[i].boundary, 'count:', _mesh_per_vertex_buffer.buffer[i].active_count,
            '\n ', _mesh_per_vertex_buffer.buffer[i].buffer);
      }
      else console.log(i, 'NULL')
   }
}



export function Mesh_per_vb_print_loop() {

   console.log('size:', _mesh_per_vertex_buffer.size, 'boundary:', _mesh_per_vertex_buffer.boundary, 'count:', _mesh_per_vertex_buffer.active_count,);
   for (let i = 0; i <= _mesh_per_vertex_buffer.boundary; i++) {

      if (_mesh_per_vertex_buffer.buffer[i]) {

         console.log('vb', i,);
         for (let j = 0; j <= _mesh_per_vertex_buffer.buffer[i].boundary; j++) {

            const mesh = _mesh_buffer.buffer[_mesh_per_vertex_buffer.buffer[i].buffer[j]];
            if(mesh && mesh !== undefined)
            console.log(j,
               ' mbidx:', mesh.mesh_bufferidx,
               'start:', mesh.gfx.vb.starts.buffer,
               'name:', mesh.GetName(),
            );
            else console.log(mesh)
         }
      }
      else console.log(i, 'NULL')
   }
}




























