"use strict";



import { MouseGetPos } from "../../Engine/Controls/Input/Mouse.js";
import { Create_widget_section } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { Get_fasma_color, WHITE } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { Magnitude } from "../../Helpers/Math/MathOperations.js";











const size = 15;
const feather = 2.;
const count = 24*2;



/**************************************************************************************************************************************************************/
// Create a head mesh and make it movable by the user. Then create body meshes each one linked to the previous mesh and move them like a chain. 


export function Demo_chain_link(x=0, y=0) {

   const style = [size, 0, 1.8];
   const color = WHITE;
   const tr = .9;
   
   let next_posx = 300;
   
   const head = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0, 0], [next_posx, y, 1], [size,size], TRANSPARENCY(color,tr), 'head', _);
   head.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   head.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   head.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   head.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, size);
   head.SetName('head');
   
   head.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   head.options = SECTION.INHERIT|SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
   

   
   for(let i=0; i < count; i++){
      
      next_posx -= size*2 + next_posx;
      
      const c = Get_fasma_color(i, count, 2);
      const body_child = Create_widget_section(_, _, [0,0], [next_posx, 0, 1], [size,size], TRANSPARENCY(c,tr), 'head', style);
      body_child.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      body_child.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      body_child.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, size);
      body_child.SetName(`body${i}`);
      
      head.AddItem(body_child);
   }
   
   
   head.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   head.GenGfxCtx();
   head.Render();
   
   Root_group_activate_all_vbs_in_renderqueue(head.root_bufferidx);
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

   const mouse_pos = MouseGetPos();

   // Abort if mouse outside canvas
   if(mouse_pos[0] <= 0 || mouse_pos[1] <= 0) return;


   const axis = [
      mouse_pos[0] - head.GetPosX(),
      mouse_pos[1] - head.GetPosY(),
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
      head.geom.AddWposXY(head.gfx, x, y);

      let prev_mesh = head;
      
      for(let i=0; i <= head.children.boundary; i++){
         
         const next_mesh = head.children.buffer[i];

         const axis2 = [
            prev_mesh.GetPosX() - next_mesh.GetPosX() ,
            prev_mesh.GetPosY() - next_mesh.GetPosY() 
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
            next_mesh.geom.AddWposXY(next_mesh.gfx, x2, y2);
            
         }

         prev_mesh = next_mesh;
      }
   }


}