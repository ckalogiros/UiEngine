"use strict";

import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { New_generic_buffer } from "../../Core/Buffers.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { Mesh_unif_add_vb_root_wposy, Mesh_unif_get_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from "../../Core/Views/RootView.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { GREY } from "../Material/Base/Colors.js";
import { Clipy_from_group } from "../Operations/Clip.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Operations/Recursions.js";










const _scrollers_buffer = New_generic_buffer(_, 'Scrollers Buffer');









export function Components_create_scroller_component(width = 12, height=100, mesh=null, abs_ypos=0, col_bar=GREY[0], col_handle=GREY[4]){

   const pos = [0,0,0];


   const bar = Create_rect_mesh(_, pos, [width, height], col_bar, )
   bar.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, mesh.style);
   bar.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
   bar.type |= MESH_TYPE.WIDGET_SCROLLER_BAR;
   bar.SetName('ScrollBar');

   bar.OnClick = Scroller_component_onClick;

   bar.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   bar.ListenEventConstruct = Scroller_component_listen_event_construct;

   bar.GfxUniformsSetClbk = Scroller_component_gfx_uniforms_set_clbk;
   
   bar.ListenEventConstruct();
   
   
   const handle_pad = [3, 3];
   // const handle_pad = [0, 0];
   const handle_width = bar.geom.dim[0] - handle_pad[0];
   const handle_height = bar.geom.dim[1] - handle_pad[1];
   const handle_pos = [handle_pad[0], handle_pad[1], pos[2]+1]
   const handle = Create_rect_mesh(_, handle_pos, [handle_width, handle_height], col_handle, )
   handle.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, mesh.style);
   handle.SetName('Handle');
   handle.StylesSetPad(handle_pad);

   
   // HACK: We replace the scrollers uniform wposition (of the vb all the scrollers are inserted to) with the meshes unif wpos, what ever that is(maybe the mesh has a root widget from which it takes its unif wpos). 
   bar.root_posidx = mesh.root_posidx; 


   bar.AddChild(handle);
   bar.scrolled_section = mesh;
   
   const idx = _scrollers_buffer.Add(bar);
   mesh.scroller_comp_idx = idx;
   
   mesh.scroller_comp = bar;
   mesh.components |= COMPONENTS.SCROLLER;
   
   return bar;

}



export function Scoller_component_destroy(bar, ){
   const handle = bar.children.buffer[0];
   handle.Destroy();
   bar.Destroy();
}



export function Scoller_component_gengfx_and_render(bar, mesh, gfx_flags=0x0, parent, ){
   
   // Create absolute position on canvas scrolling
   if(gfx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION){

      bar.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.SCROLLER_VB;
      bar.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION|GFX_CTX_FLAGS.SCROLLER_VB, bar.mesh_bufferidx);
   }


   bar.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC|GFX_CTX_FLAGS.SCROLLER_VB);

   // Set positions after 'GenGfxCtx' so that the bar's
   /** Set bar pos */
   bar.geom.pos[0] = mesh.GetPosX()+mesh.geom.dim[0]*2
   bar.geom.pos[1] = mesh.GetPosY();
   
   /** Set handle pos */
   const handle = bar.children.buffer[0];
   const handle_pad = handle.StylesGetPad();
   handle.geom.pos[0] = bar.geom.pos[0] + handle_pad[0];
   handle.geom.pos[1] = bar.geom.pos[1] + handle_pad[1];
   
   /** Set scrolled section's pos */
   Scroller_component_update_scrolled_section_pos_from_handle(mesh, bar);

   bar.Render();

   Construct_listen_events_from_mesh_tree(bar);
   Construct_listen_events_relations_from_mesh_tree(bar, parent);

   bar.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, bar.gfx.vb.groupidx);
   
}



export function Scroller_component_set_pos(bar, widget_root,  difx, dify){

   const handle = bar.children.buffer[0];

   bar.geom.pos[0] += difx
   bar.geom.pos[1] += dify
   bar.geom.UpdateSetWposXY(bar.gfx);
   
   
   handle.geom.pos[0] += difx;
   handle.geom.pos[1] += dify;
   
   handle.geom.UpdateSetWposXY(handle.gfx);

}



export function Scroller_component_calculate_handle_pos_dim(scrolled_section, bar) {



   /* Set bar position */
   bar.geom.pos[0] = scrolled_section.GetPosX()+scrolled_section.geom.dim[0]*2
   bar.geom.UpdateSetWposX(bar.gfx);

   const handle = bar.children.buffer[0];
   const handle_pad = handle.StylesGetPad()
   const clean_bar_height = bar.geom.dim[1]
   
   /* Set handle size */
   const clean_size = bar.geom.dim[1];
   const a = (clean_size * clean_size) / scrolled_section.geom.dim[1];
   if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad[1];
   else handle.geom.dim[1] = clean_bar_height - handle_pad[1];

   const handle_bot = handle.geom.pos[1] + handle.geom.dim[1] * 2


   /* Set handle position */
   if (handle.geom.pos[1] <= bar.geom.pos[1] + handle_pad[1]) handle.geom.pos[1] = bar.geom.pos[1] + handle_pad[1];
   else if (handle_bot >= bar.geom.pos[1] + bar.geom.dim[1] * 2 - handle_pad[1]) handle.geom.pos[1] = (bar.geom.pos[1] + (bar.geom.dim[1] * 2)) - (handle.geom.dim[1]*2 + handle_pad[1]);

   handle.geom.pos[0] = bar.geom.pos[0] + handle_pad[0];

   handle.geom.UpdateSetDimY(handle.gfx);
   handle.geom.UpdateSetWposXY(handle.gfx);


   Scroller_component_update_handle_pos_from_scrolled_section(scrolled_section, bar);

   // Update the scrolled mesh position
   Scroller_component_update_scrolled_section_pos_from_handle(scrolled_section, bar);


   Scroller_clip_scrolled_section(scrolled_section, bar.GetPosY(), bar.geom.dim[1]);


} 



function Scroller_component_update_handle_pos_from_scrolled_section(scrolled_section, bar) {


   const scroller_top = bar.GetPosY();
   const scrolled_top = scrolled_section.GetPosY();
   const handle = bar.children.buffer[0];
   const handle_pad = handle.StylesGetPad(STYLES.AXIS.Y);

   // Avoid setting handle if there is no larger scrolled section OR the size dif is 0(division by 0)
   if((scrolled_section.geom.dim[1] * 2) - (bar.geom.dim[1] * 2) <= 0){
      return;
   }

   // Calculate the ratio of the scrolled section height to that of the scrollers
   const c_size = ((scrolled_section.geom.dim[1] * 2) - ((bar.geom.dim[1] * 2)));
   const clean_size = c_size;
   const dif = scroller_top - scrolled_top;
   const ratio = dif/clean_size;

   // Avoid setting handle bellow the bar bottom (on closing a dp)
   const res = ratio>1?1:(ratio<0)?0:ratio;
   
   
   // We need the size of the bar without the size of the handle
   const bar_clean_size = bar.geom.dim[1]*2-handle.geom.dim[1]*2 ;
   handle.geom.pos[1] = bar.geom.pos[1] + bar_clean_size*res;

   const pos_dim_ratio = Scroller_component_calculate_handle_position_ratio(bar, handle); // Calculate handles's ratio based on the handles position in the scrollbar and the dimention of the handle.
   const pad_ratio = (pos_dim_ratio * 2 - 1);
   handle.geom.pos[1] += handle_pad*-pad_ratio; // We need to contribute the analogue percentage value of the handle's pad, according to the handles position
   handle.geom.UpdateSetWposY(handle.gfx)

}



function Scroller_component_listen_event_construct() {

   const bar = this;


   /****************************************************************************/
   if (bar.state.mask & MESH_STATE.ACTIVE) {

      // Construct for bar
      if (bar.listeners && bar.listeners.buffer[E.H] === INT_NULL) {
         bar.AddListenEvent(E.H, null, null);
      }
      // Construct CLICK_UP/MOVE event
      if (bar.listeners && bar.listeners.buffer[E.C] === INT_NULL) {
         const evt_params = { target_mesh: bar, };
         bar.AddListenEvent(E.C, bar.OnClick, evt_params);
      }

   }

} 








/** This ois the callback for the scrolling fuunction */
function Scroller_component_on_update_handle(_params) {

   const bar = _params.params;
   const handle = bar.children.buffer[0];

   if (bar.StateCheck(MESH_STATE.IN_GRAB) === 0 && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

      // If bar out of hover, delete the timeInterval for moving the handle
      const intervalIdx = bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      Time_intervals_destroy_byidx(intervalIdx);
      bar.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);

      handle.state.mask &= ~MESH_STATE.IN_GRAB;

      return;
   }

   const scrolled_section = bar.scrolled_section;
   Scroller_component_move_handle(bar, handle);
   Scroller_component_update_scrolled_section_pos_from_handle(scrolled_section, bar);

   Scroller_clip_scrolled_section(scrolled_section, bar.GetPosY(), bar.geom.dim[1]);

   // Construct_listen_events_from_mesh_tree(scrolled_section);
   // Construct_listen_events_relations_from_mesh_tree(scrolled_section);

   Root_group_reset_gfxs(scrolled_section.root_bufferidx)
   Root_group_rerender_from_root_reconstruct_listeners(scrolled_section.root_bufferidx);
   
}



function Scroller_component_move_handle(bar, handle) {

   // Dont include handle pad to align scrolled section top and bot to scrollbars top and bot
   const handle_pad = handle.StylesGetPad(STYLES.AXIS.Y);
   // const handle_pad = 0; 

   const y = -MouseGetPosDif().y;
   if (y === 0) return;


   const bar_length = bar.geom.dim[1] * 2 * bar.geom.num_faces;

   if (handle.geom.pos[1] + y >= bar.geom.pos[1] + handle_pad &&
      handle.geom.pos[1] + handle.geom.dim[1] * 2 + y <= bar.geom.pos[1] + bar_length - handle_pad) {
      handle.geom.pos[1] += y;
      handle.geom.AddWposY(handle.gfx, y, );
   }
}



function Scroller_component_calculate_handle_position_ratio(bar, handle) {

   const handle_pad = handle.StylesGetPad(STYLES.AXIS.Y);
   const handletop = handle.geom.pos[1]-handle_pad; // Must add the pad for correct align of top-scroller with top-scrolled
   const handledim = handle.geom.dim[1]*2+handle_pad*2; // Must add the pad for correct align of top-scroller with top-scrolled
   const bartop = bar.geom.pos[1];
   const dim_dif = (bar.geom.dim[1]*2) - handledim;
   const pos_dif = handletop - bartop;

   // Interpolate to a 0-1 value.
   const pos_dim_ratio = (pos_dif <= 0) ? 0 : (pos_dif / dim_dif < 1) ? pos_dif / dim_dif : 1;
   return pos_dim_ratio;
}



/**************************************************************************************************************/
// 
function Scroller_component_gfx_uniforms_set_clbk(unif_name, Clbk, clbk_params) {

   // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
   this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
   for (let i = 0; i <= this.children.boundary; i++) {
      const child = this.children.buffer[i];
      if (child) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
   }
}



function Scroller_component_onClick(params) {


   
   const bar = params.evt_params.target_mesh;
   const point = MouseGetPos();
   
   
   
   // // Check for Resize
   // const right = mesh.GetPosX() + mesh.geom.dim[0] * 2;
   // const bottom = mesh.GetPosY() + mesh.geom.dim[1] * 2;
   
   // if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) {
      
   //    // We have Resize
   
   //    if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
   
   //       const OnResizeFn = mesh.OnResize;
   //       const idx = Time_intervals_create(10, 'ResizeXY Component_scroller', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, { mesh: mesh, mouse_click: point });
   //       mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
   //    }
   //    else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
   //       console.log('X RESIZE');
   //    }
   //    else { // Its a height resize
   //       console.log('Y RESIZE');
   //    }
   
   //    mesh.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS;
   //    STATE.mesh.SetGrabed(mesh);
   //    STATE.mesh.SetFocused(mesh);
   
   //    return true;
   // }
   // else { // Move the scroller handle
   
   
   // Check if the click happened on bar
   const bar_pos = bar.GetPosXY();
   if (point[0] > bar_pos[0] + bar.StylesGetHoverMargin(STYLES.AXIS.X)) { // Check only if click is on the right of the left side of the bar mesh
      console.log('CLICKED', 'point', point, 'bar_pos', bar_pos)
      
      if (point[1] < bar_pos[1] || point[1] > bar_pos[1] + bar.geom.dim[1] * 2) return
      

      STATE.mesh.SetClicked(bar);

      if ((bar.type & MESH_TYPE.WIDGET_SCROLLER_BAR) && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] === INT_NULL) {

         const idx = Time_intervals_create(16, 'Move Scroller Handle', TIME_INTERVAL_REPEAT_ALWAYS, Scroller_component_on_update_handle, bar);
         bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

         STATE.mesh.SetGrabed(bar);
         // STATE.mesh.SetFocused(mesh);
         // mesh.state.mask |= MESH_STATE.IN_FOCUS;
         bar.StateEnable(MESH_STATE.IN_GRAB);
      }

      return true;
   }



}



function Scroller_clip_scrolled_section(scrolled_section, clip_top, height) {

   // Clip scrolled mesh to the height of the scroller
   if(scrolled_section.group_bufferidxs[0] !== INT_NULL){

      // const clip_top = scrolled_section.GetPosY();
      const clip_bottom = clip_top + height * 2;
      Clipy_from_group(scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
   }
   else {
      console.error('SCROLLER ERROR \nThe current scrolled section does not have a \'group\'. create a grouup for the scrolled mesh so that the scroller can clip.');
      console.log(scrolled_section.scroller_comp.GetName(), scrolled_section.scroller_comp.mesh_bufferidx)
   }
}



function Scroller_component_update_scrolled_section_pos_from_handle(scrolled_section, bar) {


   const scroller_top = bar.GetPosY();
   const scrolled_posy = scrolled_section.GetPosY();
   const handle = bar.children.buffer[0];

   // Calculate the ratio of the scrolled section height to that of the scrollers
   const clean_size = ((scrolled_section.geom.dim[1] * 2) - ((bar.geom.dim[1] * 2)));
   const pos_dim_ratio = Scroller_component_calculate_handle_position_ratio(bar, handle); // Calculate handles's ratio based on the handles position in the scrollbar and the dimention of the handle.

   // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
   const posy = (clean_size * -pos_dim_ratio) + scroller_top;

   /**
    * This is a ratio  for -1 to 1, of the conttribution of the handle pad that has to be added. 
    * We want to add or subtract the handle pad from the scrolled position relative to the position of the scrolled section to the scrollbar.
    * We add the positive pad half way up by the ammount of 0 to 1
    * and we add(subtract) the pad half way down by the amount 0 to -1
    */
   const pad_ratio = (pos_dim_ratio * 2 - 1);
   const ydif = (posy - scrolled_posy) + handle.StylesGetPad(STYLES.AXIS.Y) * -pad_ratio;
 
   // Add the move difference to all vb's root positions.
   Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, ydif);

}























/******************************************************************************************************************************************************/
// 

export function Scroller_component_movexy(scroller_buffer_idxs, x, y){
   
   
   for(let i = 0; i <= scroller_buffer_idxs.boundary; i++){
      
      const scrolleridx = scroller_buffer_idxs.buffer[i];
      const bar = _scrollers_buffer.buffer[scrolleridx];
      
      // const rootpos = Mesh_unif_get_vb_root_wpos(bar.root_posidx);
      const rootpos = [0, 0];
      rootpos[0] += x;
      rootpos[1] += y;

      bar.geom.pos[0] += rootpos[0];
      bar.geom.pos[1] += rootpos[1];
      bar.geom.AddWposXY(bar.gfx, rootpos[0], rootpos[1]);
   
      const handle = bar.children.buffer[0];
      handle.geom.pos[0] += rootpos[0];
      handle.geom.pos[1] += rootpos[1];
      handle.geom.AddWposXY(handle.gfx, rootpos[0], rootpos[1]);
      // console.log(bar.mesh_bufferidx, bar.GetName())
   }

}