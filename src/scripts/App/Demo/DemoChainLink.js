"use strict";



import { Create_widget_section } from "../../Engine/Core/CreateWidget.js";
import { Mesh_unif_get_vb_root_wpos } from "../../Engine/Core/MeshUniformsBuffer.js";
import { Root_group_activate_all_vbs_in_renderqueue } from "../../Engine/Core/Views/RootView.js";
import { Debug_info_ui_static } from "../../Engine/Drawables/DebugInfo/DebugInfoUi.js";
import { Get_fasma_color, GREY, WHITE, YELLOW } from "../../Engine/Drawables/Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../../Engine/Drawables/Operations/Recursions.js";
import { Time_intervals_create } from "../../Engine/Timers/TimeIntervals.js";
import { GetSequencedColor } from "../../Helpers/Helpers.js";
import { Abs, Magnitude } from "../../Helpers/Math/MathOperations.js";











const size = 15;
const feather = 2.8;
const count = 24*2;



/**************************************************************************************************************************************************************/
// Create a head mesh and make it movable by the user. Then create body meshes each one linked to the previous mesh and move them like a chain. 


export function Demo_chain_link() {


   Debug_info_ui_static();


   const style = [size, 0, 1.8];
   // const color = GetSequencedColor(9);
   const color = WHITE;
   const tr = .9;
   
   let next_posx = 300;
   
   // const head = Create_widget_section(_, _, [0,0], [next_posx, 20, 1], [size,size], ORANGEL[9], 'head', [0, size, 2]);
   const head = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [next_posx, 100, 1], [size,size], TRANSPARENCY(color,tr), 'head', _);
   head.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
   head.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   head.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   head.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, size);
   head.SetName('head');
   
   head.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   head.GenGfxCtx();
   head.options = SECTION.INHERIT|SECTION.HORIZONTAL|SECTION.RESIZE_PARENT;
   // section.Calc_no_gfx_update();
   head.Render();
   
   
   Root_group_activate_all_vbs_in_renderqueue(head.root_bufferidx);
   Construct_listen_events_from_mesh_tree(head);
   Construct_listen_events_relations_from_mesh_tree(head);
   head.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, head.gfx.vb.groupidx);
   
   
   // Body mesh (parent for all other body meshes)
   next_posx -= size*2;
   
   const body = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [next_posx, 100, 1], [size,size], GREY[4], 'head', style);
   // const body = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [next_posx, 100, 1], [size,size], TRANSPARENCY(GetSequencedColor(9),tr), 'head', style);
   body.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   body.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
   body.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, size);
   body.SetName('body');
   
   for(let i=0; i < count; i++){
      
      next_posx -= size*2 + next_posx;
      // next_posx = body.geom.pos[0];
      
      const c = Get_fasma_color(i, count);
      // const body_child = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [next_posx, 0, 1], [size,size], TRANSPARENCY(YELLOW[9],tr), 'head', style);
      // const body_child = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [next_posx, 0, 1], [size,size], TRANSPARENCY(GetSequencedColor(9),tr), 'head', style);
      const body_child = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [0,0], [next_posx, 0, 1], [size,size], TRANSPARENCY(c,tr), 'head', style);
      body_child.GfxUniformsEnable({unif: SID.UNIF.ROOT_WPOS2, pass: SID.PASS.WPOS2,}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
      body_child.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_FEATHER, feather);
      body_child.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_R_CORNERS, size);
      body_child.SetName('body_child 2');
      
      body.AddItem(body_child);
   }
   
   
   body.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC;
   body.GenGfxCtx();
   body.Render();
   
   Root_group_activate_all_vbs_in_renderqueue(body.root_bufferidx);
   Construct_listen_events_from_mesh_tree(body);
   Construct_listen_events_relations_from_mesh_tree(body);
   body.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, body.gfx.vb.groupidx);


   





   /*************************************************************************************************/
   // Create move

   const params = {
      head: head,
      body: body,
   }


   Time_intervals_create(16, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, Animate_chain_link, params);


   return head;
}







function Animate_chain_link(params) {

   const head = params.params.head;
   const body = params.params.body;

   const size = head.geom.dim[0];


   const axis = [
      head.GetPosX() - body.GetPosX(),
      head.GetPosY() - body.GetPosY(),
   ];

   const dist = Magnitude(axis[0], axis[1]);

   /** Body Follows head with almost in stantly */
   const n = [
      axis[0] / dist,
      axis[1] / dist,
   ];
   
   const delta = dist - size*2;
   
   
   const x = n[0] * delta;
   const y = n[1] * delta;
   
   /** Body Follows head with speed acceleration based on distance  */
   // const n = [
   //    (axis[0]),
   //    (axis[1]),
   // ];
   // const x = n[0]*(dist*.001);
   // const y = n[1]*(dist*.001);
   
   // Move the ball
   if(dist > head.geom.dim[0]*2 ){
      
      // console.log('dist', dist, 'n', n);
      body.geom.pos[0] += x;
      body.geom.pos[1] += y;
      body.geom.AddWposXY(body.gfx, x, y);

      let prev_mesh = body;
      
      for(let i=0; i <= body.children.boundary; i++){
         
         const body_mesh = body.children.buffer[i];

         const axis2 = [
            prev_mesh.GetPosX() - body_mesh.GetPosX() ,
            prev_mesh.GetPosY() - body_mesh.GetPosY() 
         ];

         const dist2 = Magnitude(axis2[0], axis2[1]);
         
         /** Body Follows head with almost in stantly */
         const n2 = [
            axis2[0] / dist2,
            axis2[1] / dist2,
         ];
         
         const delta2 = dist2 - size*2;
         const x2 = n2[0] * delta2;
         const y2 = n2[1] * delta2;
         
         
         if(dist2 > prev_mesh.geom.dim[0]*2 ){
            
            body_mesh.geom.pos[0] += x2;
            body_mesh.geom.pos[1] += y2;
            body_mesh.geom.AddWposXY(body_mesh.gfx, x2, y2);
            
         }

         prev_mesh = body_mesh;
      }
   }

}