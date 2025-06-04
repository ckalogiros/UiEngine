"use strict";



import { Mouse_get_pos } from "../../Engine/Controls/Input/Mouse.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Get_fasma_color, WHITE } from "../../Engine/Drawables/Material/Colors.js";
import { Mesh_add_wpos_xy, Mesh_get_real_pos_x, Mesh_get_real_pos_y } from "../../Engine/Drawables/Operations/MeshAttributesFunctions.js";
import { Create_rect_mesh } from "../../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js";
import { Style_rect_default_properties, Widget_gfx_ready_enable } from "../../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Events/EventFunctions.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { Magnitude } from "../../Helpers/Math/MathOperations.js";











const size = 10;
const num_colors = 4;
const count = 48*num_colors;



/**************************************************************************************************************************************************************/
// Create a head mesh and make it movable by the user. Then create body meshes each one linked to the previous mesh and move them like a chain. 


export function Demo_chain_link(x=0, y=0) {

   const color = WHITE;
   const tr = .9;
   
   let next_posx = 300;
   
   const head = Create_rect_mesh(Style_rect_default_properties({is_root:ROOT_WIDGETS.CREATE_ROOT, pos:[next_posx, y, 1], dim:[size,size], col:TRANSPARENCY(color,tr), name:'head',}));
   Widget_gfx_ready_enable({mesh:head, enable_sdf_rect:size, listener:{type:LISTEN_EVENT_TYPES.MOVE}});
   
   head.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;
   
   
   
   for(let i=0; i < count; i++){
      
      next_posx -= size*2 + next_posx;
      
      const c = Get_fasma_color(i, count, num_colors);
      const body_child = Create_rect_mesh(Style_rect_default_properties({pos:[next_posx, 0, 1], dim:[size,size], col:TRANSPARENCY(c,tr), name:'body',}));
      Widget_gfx_ready_enable({mesh:body_child, enable_sdf_rect:size, });
      head.AddItem(body_child);
   }
   
   
   head.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   head.GenGfxCtx();
   head.Render();
   
   Construct_listen_events_from_mesh_tree(head);
   Construct_listen_events_relations_from_mesh_tree(head);
   head.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, head.gfx.vb.groupidx);


   





   /*************************************************************************************************/
   // Create move

   const params = {
      head: head,
      // body: body,
   }


   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_chain_link, params);


   return head;
}







function Animate_chain_link(params) {

   const head = params.params.head;
   const size = head.geom.dim[0];

   const mouse_pos = Mouse_get_pos();

   // Abort if mouse outside canvas
   if(mouse_pos[0] <= 0 || mouse_pos[1] <= 0) return;


   const axis = [
      mouse_pos[0] - Mesh_get_real_pos_x(head),
      mouse_pos[1] - Mesh_get_real_pos_y(head),
   ];

   const dist = Magnitude(axis[0], axis[1]);

   const n = [
      axis[0] / dist,
      axis[1] / dist,
   ];
   
   const delta = dist - size*2;
   
   
   /** Instant Follow */
   // const x = n[0] * delta;
   // const y = n[1] * delta;
   /** Body Follows mouse with speed acceleration based on distance  */
   const x = n[0]*(dist*.1);
   const y = n[1]*(dist*.1);
   
   
   // Move the ball
   if(dist > head.geom.dim[0]*2 ){
      // console.log('dist', dist, 'n', n);
      
      // console.log('dist', dist, 'n', n);
      head.geom.pos[0] += x;
      head.geom.pos[1] += y;
      Mesh_add_wpos_xy(head, x, y);

      let prev_mesh = head;
      
      for(let i=0; i <= head.children.boundary; i++){
         
         const next_mesh = head.children.buffer[i];

         const axis2 = [
            Mesh_get_real_pos_x(prev_mesh) - Mesh_get_real_pos_x(next_mesh) ,
            Mesh_get_real_pos_y(prev_mesh) - Mesh_get_real_pos_y(next_mesh) 
         ];

         const dist2 = Magnitude(axis2[0], axis2[1]);
         
         /** Body Follows head instantly */
         const n2 = [
            axis2[0] / dist2,
            axis2[1] / dist2,
         ];
         
         const delta2 = dist2 - size*2;
         const x2 = n2[0] * delta2;
         const y2 = n2[1] * delta2;
         
         
         if(dist2 > prev_mesh.geom.dim[0]*2 ){
            
            next_mesh.geom.pos[0] += x2;
            next_mesh.geom.pos[1] += y2;
            Mesh_add_wpos_xy(next_mesh, x2, y2);
            
         }

         prev_mesh = next_mesh;
      }
   }


}