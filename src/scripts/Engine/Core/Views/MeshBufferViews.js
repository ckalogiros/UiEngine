"use strict";

import { Vertex_buffer_render_group_create, Vertex_buffer_render_group_set_num_faces } from "../../../Graphics/Buffers/RenderGroups.js";
import { Vertex_buffer_group_store_render_groupidx, Vertex_buffer_reset_to_index_NEW } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Shader_attributes_get_attribs_per_vertex } from "../../../Graphics/ShaderAttributes.js";
import { Mesh_get_name } from "../../Drawables/Operations/MeshPropertiesFunctions.js";
import { Renderqueue_set_active } from "../../Renderers/Renderer/RenderQueue.js";
import { Free_generic_buffer, Free_int16_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../Buffers.js";
import { Mesh_buffer_get_mesh_byidx, Mesh_per_vb_remove_mesh } from "../MeshBuffer.js";





_CNT = 0;
export const VIEW_INFO = {
   VB_GROUP_IDX: _CNT++,
   RENDER_GROUP_IDX: _CNT++,

   START: _CNT++,
   NUM_FACES: _CNT++,

   SIZE: _CNT,
};



/******************************************************************************************************************************/
/******************************************************************************************************************************/
/******************************************************************************************************************************/
/**
 *  CLEAN UP UNUSE FUNCTIONS
*/
/******************************************************************************************************************************/
/******************************************************************************************************************************/
/******************************************************************************************************************************/





const _view_buffer = New_generic_buffer(_, 'Mesh buffer Views');
/** */
export function View_buffer_reset() {

   for (let i = 0; i <= _view_buffer.boundary; i++) {
      const vb = _view_buffer.buffer[i].vb;
      for (let j = 0; j <= vb.boundary; j++) {

         Free_int16_buffer(vb.buffer[j].meshidxs);
      }
      Free_generic_buffer(vb);
   }
   _view_buffer.ResetFull();
}


/** */
export function View_get_count() { return _view_buffer.active_count; }
/** */
export function View_get_by_viewidx(group_bufferidx) { return _view_buffer.buffer[group_bufferidx]; }





/** */
function View_vb_exists(groupidx, vbidx) {

   const view = _view_buffer.buffer[groupidx];

   for (let i = 0; i <= view.vb.boundary; i++) {

      if (view.vb.buffer[i].vb_groupidx === vbidx)
         return i;
   }

   return INT_NULL;
}
/** */
function View_render_group_exists(groupidx, view_vbidx, render_groupidx) {

   const rg = _view_buffer.buffer[groupidx].vb.buffer[view_vbidx].rg;

   for (let i = 0; i <= rg.boundary; i++) {

      if (rg.buffer[i].render_groupidx !== INT_NULL && rg.buffer[i].render_groupidx === render_groupidx)
         return i;
   }

   return INT_NULL;
}
/** */
/* TODO: We must check with flags if mesh is on its own rg 
 * Running the loop backwards will find match from last registered meshes->closer to the mesh-tree structure
*/
function View_render_group_find_match(groupidx, view_vbidx) {

   // const vb = _view_buffer.buffer[groupidx].vb;
   const rg = _view_buffer.buffer[groupidx].vb.buffer[view_vbidx].rg;

   // for (let i = 0; i <= rg.boundary; i++) {
   for (let i = rg.boundary; i >= 0 ; i++) {

      if (rg.buffer[i].render_groupidx !== INT_NULL)
         return i;
   }

   return INT_NULL;
}
/** */
function View_render_group_find_match_from_parent_recursive(new_mesh, parent) {

   if(parent)  {

      if(parent.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
         // return parent.gfx.vb.render_groupidx;
         console.log(
            'FOUND:MESH',
            'mesh name', new_mesh.name,
            'parent name', parent.name,
            'view_rgidx', parent.group_bufferidxs[2],
         )
         return parent.group_bufferidxs[2];
      }
      // Avoid null parent, avoid same new_mesh and parent being the same mesh
      else if(parent.text_mesh && parent.text_mesh.mesh_bufferidx !== new_mesh.mesh_bufferidx
         && parent.text_mesh.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
         // return parent.text_mesh.gfx.vb.render_groupidx;
         console.log(
            'FOUND:TEXT_MESH',
            'mesh name', new_mesh.name,
            'parent name', parent.name,
            'view_rgidx', parent.text_mesh.group_bufferidxs[2],
         )
         return parent.text_mesh.group_bufferidxs[2];
      }
      else if(parent.children.boundary > INT_NULL) {

         for(let i=0; i <= parent.children.boundary; i++)   {

            const child = parent.children.buffer[i];
            if(child.mesh_bufferidx !== new_mesh.mesh_bufferidx) {
               if(child.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
                  // return parent.gfx.vb.render_groupidx;
                  console.log('FOUND:MESH','mesh name', new_mesh.name,'child name', child.name,'view_rgidx', child.group_bufferidxs[2],)
                  return parent.group_bufferidxs[2];
               }
               // Avoid null parent, avoid same new_mesh and parent being the same mesh
               else if(child.text_mesh && child.text_mesh.mesh_bufferidx !== new_mesh.mesh_bufferidx
                  && child.text_mesh.gfx.vb.groupidx === new_mesh.gfx.vb.groupidx) {
                  console.log('FOUND:TEXT_MESH','mesh name', new_mesh.name,'child name', child.name,'view_rgidx', child.text_mesh.group_bufferidxs[2],)
                  return child.text_mesh.group_bufferidxs[2];
               }
            }
         }
      }
      // TODO: Must run for any parent-children too

      const found_render_groupidx = View_render_group_find_match_from_parent_recursive(new_mesh, parent.parent);
      return found_render_groupidx;
   }


   return INT_NULL;
}
/** */
function View_group_add_subgroup_to_group(groupidx, sub_group_idx) {
   const view = _view_buffer.buffer[groupidx];
   view.sub_groups_idxs.Add(sub_group_idx)
}


/** */
export function View_build_group_from_root_mesh(mesh) {

   alert('DEPRECATED: View_build_group_from_root_mesh()\n Instaed use View_build_NEW_IMPLEMENTATION()')
   if (mesh.group_bufferidxs[0] !== INT_NULL) 
      alert('@ View_build_group_from_root_mesh(). mesh is alredy in a group')

   const view = new View(mesh.mesh_bufferidx);
   const groupidx = _view_buffer.Add(view);

   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx);
}
/** */
export function View_build_NEW_IMPLEMENTATION(mesh) {

   if (mesh.group_bufferidxs[0] !== INT_NULL) alert('@ View_build_group_from_root_mesh(). mesh is alredy in a group')

   let groupidx = mesh.group_bufferidxs[0];

   if (groupidx === INT_NULL) groupidx = View_group_create(mesh);

   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx);
}
/** */
export function View_group_create(mesh) {

   if (mesh.group_bufferidxs[0] !== INT_NULL) {
      console.error('@ View_group_create(). mesh is alredy in a group', 'mesh', mesh.name)
      alert('@ View_group_create(). mesh is alredy in a group')
   }

   const mesh_idx = mesh.mesh_bufferidx;
   const view = {
      rootidx: mesh_idx,
      vb: New_generic_buffer(_, 'MeshViewGroup-VBbuffer'), // Array of arrays of per vertex buffer mesh indexes,
      sub_groups_idxs: New_int8_buffer(_, 'MeshViewGroup-SubGroupsBuffer'), // Any grouup may have many sub-groups of the same object type (this)
   };

   const groupidx = _view_buffer.Add(view);

   return groupidx;

}
/** */
export function View_group_create_sub_group(mesh, parent_groupidx) {

   const mesh_idx = mesh.mesh_bufferidx;
   const new_group = {
      rootidx: mesh_idx,
      vb: New_generic_buffer(_, 'MeshViewGroup-VBbuffer'), // Array of arrays of per vertex buffer mesh indexes,
      sub_groups_idxs: New_int8_buffer(_, 'MeshViewGroup-SubGroupsBuffer'), // Any grouup may have many sub-groups of the same object type (this)
   };

   const new_groupidx = _view_buffer.buffer[parent_groupidx].sub_groups_idxs.Add(new_group);

   return new_groupidx;

}


/** */
function Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx) {

   // Connect the mesh with the View via indexes
   const info = View_add_mesh(groupidx, mesh);
   mesh.group_bufferidxs[0] = info[0]; // Groups buffer index.
   mesh.group_bufferidxs[1] = info[1]; // VB buffers index, which vb buffer the mesh belongs.
   mesh.group_bufferidxs[2] = info[2]; // Render groups  .
   mesh.group_bufferidxs[3] = info[3]; // Mesh's index in the group buffer  .

   if (mesh.text_mesh) {

      const text_info = View_add_mesh(groupidx, mesh.text_mesh);
      mesh.text_mesh.group_bufferidxs[0] = text_info[0]; // Groups buffer index.
      mesh.text_mesh.group_bufferidxs[1] = text_info[1]; // VB buffers index, which vb buffer the mesh belongs.
      mesh.text_mesh.group_bufferidxs[2] = text_info[2]; // Render groups  .
      mesh.text_mesh.group_bufferidxs[3] = text_info[3]; // Mesh's index in the group buffer  .
   }

   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {

         // if (child.gfx_ctx_flags & GFX_CTX_FLAGS.NEW_RENDER_GROUP) {

         //    const sub_group_idx = View_group_create(child);
         //    View_group_add_subgroup_to_group(groupidx, sub_group_idx);
         //    Build_per_gfx_view_group_from_root_mesh_recursive(child, sub_group_idx);

         // }
         // else {

            // Store the render_groupidx to the mesh if the vertex buffer index between the two matches
            if (mesh.gfx.vb.groupidx === child.gfx.vb.groupidx) {
               child.gfx.vb.render_groupidx = mesh.gfx.vb.render_groupidx;
               // console.log('1111111111111111111', 'mesh', mesh.name, 'child', child.name)
            }
            else {
               // TODO: if a text mesh is a child(NOT as text_mesh), we need to find its equivalent render group idx
               console.log('2222222222222222222', 'mesh', mesh.name, 'child', child.name)
            }
            Build_per_gfx_view_group_from_root_mesh_recursive(child, groupidx)
         // }

      }
   }

}
/** Add mesh to view-group. Create vertex buffer render-group */
function View_add_mesh(groupidx, mesh) {
// TODO: Comment logic
   const mesh_bufferidx = mesh.mesh_bufferidx;
   const num_faces = mesh.geom.num_faces;
   const vb_groupidx = mesh.gfx.vb.groupidx;
   const render_groupidx = mesh.gfx.vb.render_groupidx;

   const view = _view_buffer.buffer[groupidx];

   // console.log(mesh.name, mesh.gfx.vb)


   // Find meshidxs for vertex buffer, if exists
   let view_vbidx = View_vb_exists(groupidx, vb_groupidx);

   if (view_vbidx !== INT_NULL) { // Vb buffer found

      let view_rgidx = View_render_group_find_match_from_parent_recursive(mesh, mesh.parent);
      
      if(view_rgidx === INT_NULL) {

         view_rgidx = View_render_group_exists(groupidx, view_vbidx, render_groupidx);
      }

      if (mesh.gfx_ctx_flags & GFX_CTX_FLAGS.NEW_RENDER_GROUP) {

         const new_render_groupidx = Vertex_buffer_render_group_create(num_faces);
         Vertex_buffer_group_store_render_groupidx(vb_groupidx, new_render_groupidx);

         view_rgidx = view.vb.buffer[view_vbidx].rg.Add({
            render_groupidx: new_render_groupidx,
            start: 0,
            num_faces: num_faces,
            meshidxs: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
         });

         mesh.gfx.vb.render_groupidx = new_render_groupidx;

      }
      else if (view_rgidx === INT_NULL) {

         const found_match = View_render_group_find_match(groupidx, view_vbidx);
         if (found_match !== INT_NULL) {
            view_rgidx = found_match;
            mesh.gfx.vb.render_groupidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx;
            view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces += num_faces;
            Vertex_buffer_render_group_set_num_faces(view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx, view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces)
         }
         else {

            const new_render_groupidx = Vertex_buffer_render_group_create(num_faces);
            Vertex_buffer_group_store_render_groupidx(vb_groupidx, new_render_groupidx);

            view_rgidx = view.vb.buffer[view_vbidx].rg.Add({
               render_groupidx: new_render_groupidx,
               start: 0,
               num_faces: num_faces,
               meshidxs: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
            });

            mesh.gfx.vb.render_groupidx = new_render_groupidx;

         }



      }
      else { // Else use mesh's stored .gfx.vb.render_groupidx
         // console.log('USE EXISTING', mesh.name, view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx)
         mesh.gfx.vb.render_groupidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx;
         view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces += num_faces;
         Vertex_buffer_render_group_set_num_faces(view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].render_groupidx, view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].num_faces)
      }

      const view_meshidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].meshidxs.Add(mesh_bufferidx);
      return [groupidx, view_vbidx, view_rgidx, view_meshidx]; // return the indexes

   }
   else { // Else if not found, create new View.

      const render_groups = New_generic_buffer(_, 'MeshViewGroup-RenderGroupBuffer');

      const new_render_groupidx = Vertex_buffer_render_group_create(num_faces);
      Vertex_buffer_group_store_render_groupidx(vb_groupidx, new_render_groupidx);

      const view_rgidx = render_groups.Add({
         render_groupidx: new_render_groupidx,
         start: 0,
         num_faces: num_faces,
         meshidxs: New_int16_buffer(_, 'MeshBufferViews-mesh_data'),
      });


      view_vbidx = view.vb.Add({
         vb_groupidx: vb_groupidx,
         rg: render_groups,
      });

      const view_meshidx = view.vb.buffer[view_vbidx].rg.buffer[view_rgidx].meshidxs.Add(mesh_bufferidx);

      mesh.gfx.vb.render_groupidx = new_render_groupidx;

      return [groupidx, view_vbidx, view_rgidx, view_meshidx]; // return the indexes

   }

}










/******************************************************************************************************************************/
// Functionality
/*****************************************************************************************************************************/


/** */
export function View_render_from_view_NEW(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

         for (let k = 0; k <= view.vb.buffer[i].rg.buffer[j].meshidxs.boundary; k++) { // Vertex Attribute Buffering.

            const meshidx = view.vb.buffer[i].rg.buffer[j].meshidxs.buffer[k];
            if (meshidx !== INT_NULL) {

               const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
               if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {
                  mesh.AddToGfx();
               }
            }
         }
      }
   }

   // Render any sub groups
   for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {
      const sub_groupidx = view.sub_groups_idxs.buffer[i];
      View_render_from_view_NEW(sub_groupidx)
   }

}
/** Render all meshes of a specific render group to vertex buffer */
export function View_render_from_view_specific_render_group_NEW(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.
         
         const rg = view.vb.buffer[i].rg.buffer[j];
         for (let k = 0; k <= rg.meshidxs.boundary; k++) { // Vertex Attribute Buffering.
            
            // Vertex_buffer_render_group_set_debug_is_reseted(rg.render_groupidx, true);
            const meshidx = rg.meshidxs.buffer[k];
            if (meshidx !== INT_NULL) {

               const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
               if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {
                  if (!mesh.is_gfx_inserted) mesh.AddToGfx();
                  else mesh.AddToGfxFromReset();
                  // console.log(mesh.name)
               }
            }
         }
      }
   }

   
   // Render any sub groups
   for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {
      const sub_groupidx = view.sub_groups_idxs.buffer[i];
      View_render_from_view_NEW(sub_groupidx)
   }
}




























/*******************************************************************************************************************************************************************************/
// DEBUG-PRINT
/*******************************************************************************************************************************************************************************/


/* Buffer of all meshes of the application. */
export function View_buffer_print() {
   console.log('_view_buffer:', _view_buffer);
}
/* Buffer of all meshes of the application. */
export function View_buffer_print_loop() {

   for (let i = 0; i <= _view_buffer.boundary; i++) {

      console.log('group:', i);
      const view = _view_buffer.buffer[i];
      for (let j = 0; j <= view.vb.boundary; j++) {

         console.log(
            `  vbidx:${view.vb.buffer[j].vb_groupidx}`,
         );

         for (let k = 0; k <= view.vb.buffer[j].rg.boundary; k++) {

            console.log(
               `    rgidx:${view.vb.buffer[j].rg.buffer[k].render_groupidx}`,
               `    start:${view.vb.buffer[j].rg.buffer[k].start}`,
               `    num_faces:${view.vb.buffer[j].rg.buffer[k].num_faces}`,
               '\n    meshidxs', view.vb.buffer[j].rg.buffer[k].meshidxs.buffer,
            );
         }

      }
   }
}








/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NEED RE_IMPLEMENTATION



export function View_get_view_byidx(view_groupidx) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[view_groupidx];
}



export function View_get_view_vb_byidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]];
}



export function View_get_view_meshidx_byidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].meshidxs.buffer[group_bufferidxs[2]];
}



export function View_get_view_vb_root_meshidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].rootidx;
}



export function View_is_group_root(group_bufferidxs, mesh_bufferidx) {
   // TODO: Buffer Error Check
   // The root mesh of the group 'sits' at inde
   const rootidx = _view_buffer.buffer[group_bufferidxs[0]].rootidx;
   if (rootidx === mesh_bufferidx) return true;
   return false;
}



export function View_get_view_vb_mesh_meshidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].meshidxs.buffer[group_bufferidxs[2]];
}



export function View_remove_view(group_bufferidxs) {
   // TODO: Buffer Error Check
   _view_buffer.RemoveByIdx(group_bufferidxs[0]);
}



export function View_set_view_vb_start(group_bufferidxs, start) {
   // TODO: Buffer Error Check
   _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].info[VIEW_INFO.START] = start;
}



export function View_get_view_vbidx(group_bufferidxs) {
   // TODO: Buffer Error Check
   return _view_buffer.buffer[group_bufferidxs[0]].vb.buffer[group_bufferidxs[1]].info[VIEW_INFO.VB_GROUP_IDX];
}
/** Adds mesh to existing view, recurvively for all mesh's children */
export function View_add_to_group(mesh, groupidx) {
   // alert('88482634\nOLD VIEW GROUP IMPLEMENTAION.');
   Build_per_gfx_view_group_from_root_mesh_recursive(mesh, groupidx);
}
/** Removes mesh and all mesh's children recursively */
export function View_remove_from_group(mesh) {

   // TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists

   const groupidx = mesh.group_bufferidxs[0];
   // const group_vbidx = mesh.group_bufferidxs[1];
   // const group_meshidx = mesh.group_bufferidxs[2];

   Remove_vb_data_from_view_recursive(mesh);

   for (let i = 0; i <= _view_buffer.buffer[groupidx].vb.boundary; i++) {

      const vbidx = _view_buffer.buffer[groupidx].vb.buffer[i].info[0]
      View_consolidate_buffer(groupidx, i);
      // console.log('Consolidating View buffer vb:', vbidx)
   }

}
// HERE: must add multi vbidx for the Views
/** THIS FUNCTION MAY NOT REMOVEE ANY 'mesh_per_vb', because of the 'Dropdown' removal by inactive item */
export function View_reset_from_view_all_buffers(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   alert('001985543125\nOUT OF SYNC. RE IMPLEMENT')

   for (let i = 0; i <= view.vb.boundary; i++) {

      const vb_groupidx = view.vb.buffer[i].info[VIEW_INFO.VB_GROUP_IDX];

      const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
      const starts = mesh.gfx.vb.starts.buffer;
      // Vertex_buffer_reset_to_index(vb_groupidx, starts);

      // Remove each mesh from @mesh_per_vb storage buffer
      for (let j = 0; j <= view.vb.buffer[i].meshidxs.boundary; j++) {

         const meshidx = view.vb.buffer[i].meshidxs.buffer[j];

         if (meshidx !== INT_NULL) {

            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
            if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE)
               Mesh_per_vb_remove_mesh(vb_groupidx, mesh.per_vb_bufferidx)
         }
      }
   }

   // const view = _view_buffer.buffer[view_groupidx];

   // for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

   //    for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

   //       const vb_groupidx = view.vb.buffer[i].vb_groupidx;

   //       for (let k = 0; k <= view.vb.buffer[i].rg.buffer[j].meshidxs.boundary; k++) { // Vertex Attribute Buffering.
   //          // Vertex_buffer_reset_to_index(vb_groupidx, starts);

   //          const meshidx = view.vb.buffer[i].rg.buffer[j].meshidxs.buffer[k];
   //          if (meshidx !== INT_NULL) {

   //             const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
   //             if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

   //                mesh.AddToGfx();
   //             }
   //          }
   //       }
   //    }

   // }

}
/** */
function View_consolidate_buffer(groupidx, group_vbidx) {


   const buffer = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].meshidxs
   let leftidx = 0, rightidx = 0;
   let consolidation_happened = false;

   for (let i = 0; i <= buffer.boundary; i++) {

      if (buffer.buffer[leftidx] === INT_NULL) {

         rightidx++;
         while (buffer.buffer[rightidx] === INT_NULL && rightidx <= buffer.boundary) {

            rightidx++;
         }

         const right_mesh = Mesh_buffer_get_mesh_byidx(buffer.buffer[rightidx]);
         right_mesh.group_bufferidxs[2] = leftidx;


         // Move not null elem(right) to null elem(left) 
         buffer.buffer[leftidx] = buffer.buffer[rightidx];
         buffer.buffer[rightidx] = INT_NULL;

         consolidation_happened = true;

         if (rightidx >= buffer.boundary) break;

         leftidx++;
      }
      else {

         leftidx++;
         rightidx++;
      }
   }

   if (consolidation_happened) {

      buffer.boundary = leftidx;
      buffer.active_count = buffer.boundary + 1; // Since the buffer is consolidated, the active_count is guaranted to be boundary+1
   }

   // TODO: When freeidx has been implemented in Buffers.js
   // IMPORTANT: After consolidation, the buffer's freeidx is not valid
   // buffer.freeidx = buffer.boundary < buffer.size-1 ? buffer.boundary+1 : INT_NULL;
   // buffer.freeidx = INT_NULL;
}
/** */
function Remove_vb_data_from_view_recursive(mesh) {

   // TODO: check error for wrong 'group_bufferidxs[0]' index. Make sure the group exists


   for (let i = 0; i <= mesh.children.boundary; i++) {

      const child = mesh.children.buffer[i];
      if (child) {
         Remove_vb_data_from_view_recursive(child)
      }
   }


   const groupidx = mesh.group_bufferidxs[0];
   const group_vbidx = mesh.group_bufferidxs[1];
   const group_meshidx = mesh.group_bufferidxs[2];

   const buffer = _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].meshidxs;

   /**DEBUG*/ if (groupidx === INT_NULL || group_vbidx === INT_NULL || group_meshidx === INT_NULL) console.error('MESH HAS NULL GROUP:', Mesh_get_name(mesh), ' mesh group idxs', mesh.group_bufferidxs)

   buffer.RemoveByIdx(group_meshidx);

   // Update group's num_faces.
   _view_buffer.buffer[groupidx].vb.buffer[group_vbidx].info[VIEW_INFO.NUM_FACES] -= mesh.geom.num_faces;


   // Set null indexes to mesh
   mesh.group_bufferidxs[0] = INT_NULL;
   mesh.group_bufferidxs[1] = INT_NULL;
   mesh.group_bufferidxs[2] = INT_NULL;

   if (mesh.text_mesh) {

      const text_groupidx = mesh.text_mesh.group_bufferidxs[0];
      const text_group_vbidx = mesh.text_mesh.group_bufferidxs[1];
      const text_group_meshidx = mesh.text_mesh.group_bufferidxs[2];

      /**DEBUG*/ if (text_groupidx === INT_NULL || text_group_vbidx === INT_NULL || text_group_meshidx === INT_NULL) console.error('MESH HAS NULL GROUP:', Mesh_get_name(mesh.text_mesh), ' mesh group idxs', mesh.text_mesh.group_bufferidxs)

      _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].meshidxs.RemoveByIdx(text_group_meshidx);

      // Update group's num_faces.
      _view_buffer.buffer[text_groupidx].vb.buffer[text_group_vbidx].info[VIEW_INFO.NUM_FACES] -= mesh.text_mesh.geom.num_faces;


      mesh.text_mesh.group_bufferidxs[0] = INT_NULL;
      mesh.text_mesh.group_bufferidxs[1] = INT_NULL;
      mesh.text_mesh.group_bufferidxs[2] = INT_NULL;
   }
}


/** */
export function View_reset_to_index_from_view_group_NEW(view_groupidx) {

   const view = _view_buffer.buffer[view_groupidx];
   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      for (let j = 0; j <= view.vb.buffer[i].rg.boundary; j++) { // Vertex Attribute Buffering.

         const vb_groupidx = view.vb.buffer[i].vb_groupidx;
         const rg = view.vb.buffer[i].rg.buffer[j];

         Vertex_buffer_reset_to_index_NEW(vb_groupidx, rg.render_groupidx)
      }
   }

}

/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function View_render_from_view_all_buffers(view_groupidx, do_reconstruct_listeners = true) {
   // console.log('===========================================================================================================')
   const view = _view_buffer.buffer[view_groupidx];

   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      // console.log('view', i, view.vb.buffer[i].info, view.vb.buffer[i].meshidxs)
      for (let j = 0; j <= view.vb.buffer[i].meshidxs.boundary; j++) { // Vertex Attribute Buffering.

         const meshidx = view.vb.buffer[i].meshidxs.buffer[j];
         if (meshidx !== INT_NULL) {

            const mesh = Mesh_buffer_get_mesh_byidx(meshidx);
            if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

               mesh.AddToGfx();
            }
         }
      }
   }

   // Get the root mesh
   // const mesh = Mesh_buffer_get_mesh_byidx(view.rootidx);
   // const parent_events = mesh.parent ? [mesh.parent.listeners.buffer[0], mesh.parent.listeners.buffer[1]] : [null, null];
   // Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest2)
   // if(do_reconstruct_listeners) 
   // mesh.ConstructListeners(parent_events); 
   // const delta = Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest2)

}

/** Render all group's meshes from all vertex buffers via AddToGfxFromReset()  */
export function View_activate_all_vbs(group_bufferidxs, activate_flag) {

   const view = _view_buffer.buffer[group_bufferidxs[0]];

   for (let i = 0; i <= view.vb.boundary; i++) { // All vertex buffer groups

      const info = view.vb.buffer[i].info;
      const vb_groupidx = info[VIEW_INFO.VB_GROUP_IDX];
      Renderqueue_set_active(vb_groupidx, activate_flag)
   }
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OLD UNUSED
// /** */
// export function View_ASSIGN_TO_RENDER_GROUP(groupidx) {

//    const view = _view_buffer.buffer[groupidx];
//    for (let i = 0; i <= view.vb.boundary; i++) {

//       const vb = view.vb.buffer[i];

//       for (let k = 0; k <= vb.rg.boundary; k++) {

//          const rg = vb.rg.buffer[k];

//          let num_faces = 0;
//          for (let l = 0; l <= rg.meshidxs.boundary; l++) {
//             const mesh = Mesh_buffer_get_mesh_byidx(rg.meshidxs.buffer[l]);
//             num_faces += mesh.geom.num_faces;
//             mesh.gfx.vb.render_groupidx = rg.render_groupidx;
//          }
         
//          Vertex_buffer_group_store_render_groupidx(vb.vb_groupidx, rg.render_groupidx);
         
//       }

//    }

//    for (let i = 0; i <= view.sub_groups_idxs.boundary; i++) {

//       const sub_groupidx = view.sub_groups_idxs.buffer[i];
//       View_ASSIGN_TO_RENDER_GROUP(sub_groupidx);
//    }
// }



