"use strict";

import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Create_rect_mesh } from "../../Core/CreateWidget.js";
import { Mesh_unif_add_vb_root_wposy, Mesh_unif_get_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { GREEN, GREY, YELLOW, YELLOWL } from "../Material/Base/Colors.js";
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from "../Operations/Recursions.js";














/**
 * 
 * @param {*} mesh 
 * @param {*} height 
 * @param {*} gfx_flags Example: Pass 'GFX_CTX_FLAGS.ABSOLUTE_POSITION' for setting scroller not been scrolled by the mouse wheel 
 * @returns 
 */
export function Components_create_scroller_component(mesh, height){

   const pad = mesh.StylesGetPad()
   const width = 12;
   // const pos = [mesh.geom.dim[0]*2 +pad[0]*2 , 0, mesh.geom.pos[2]+1];
   const pos = [0,0,0];
   


   const bar = Create_rect_mesh(_, pos, [width, height], GREY[0], )
   bar.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   bar.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, mesh.style);
   bar.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
   bar.type |= MESH_TYPE.WIDGET_SCROLLER_BAR
   bar.SetName('ScrollBar');

   bar.OnClick = Scroller_component_onClick;

   bar.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
   bar.ListenEventConstruct = Scroller_component_listen_event_construct;

   bar.GfxUniformsSetClbk = Scroller_component_gfx_uniforms_set_clbk;
   
   bar.ListenEventConstruct();
   
   
   const handle_pad = [3, 3];
   const handle_width = bar.geom.dim[0] - handle_pad[0];
   const handle_height = bar.geom.dim[1] - handle_pad[1];
   const handle_pos = [handle_pad[0], handle_pad[1], pos[2]+1]
   const handle = Create_rect_mesh(_, handle_pos, [handle_width, handle_height], TRANSPARENCY(GREY[4], 1.), )
   handle.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
   handle.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, mesh.style);
   handle.SetName('Handle');
   handle.StylesSetPad(handle_pad);

   
   bar.AddChild(handle);
   bar.scrolled_section = mesh;
   
   // mesh.AddItem(bar);
   mesh.scroller_comp = bar;
   mesh.components |= COMPONENTS.SCROLLER;

   // Create sticky x position on canvas resize
   // bar.state.mask |= MESH_STATE.STICKY_POSX;

   // // Create absolute position on canvas scrolling
   // if(gfx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION){

   //    bar.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
   //    bar.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, bar.mesh_bufferidx);
   // }

   // bar.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);

   return bar;
  

}


export function Scoller_component_gengfx_and_render(bar, mesh, gfx_flags=0x0, parent, ){
   
   // Create absolute position on canvas scrolling
   if(gfx_flags & GFX_CTX_FLAGS.ABSOLUTE_POSITION){

      bar.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
      bar.GfxCtxAddFlag(GFX_CTX_FLAGS.ABSOLUTE_POSITION, bar.mesh_bufferidx);
   }


   bar.geom.pos[0] = mesh.GetPosX()+mesh.geom.dim[0]*2
   bar.geom.pos[1] = mesh.GetPosY();

   const handle = bar.children.buffer[0];
   const handle_pad = handle.StylesGetPad();
   // handle.geom.pos[0] = bar.geom.pos[0] + handle_pad[0];
   // handle.geom.pos[1] = bar.geom.pos[1] + handle_pad[1];


   bar.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);

   // Scroller_component_calculate_handle_pos_dim(mesh, bar);
   // {
   //    const clean_bar_height = bar.geom.dim[1]
      
   //    const clean_size = bar.geom.dim[1];
   //    const a = (clean_size * clean_size) / mesh.geom.dim[1];
   //    if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad[1];
   //    else handle.geom.dim[1] = clean_bar_height - handle_pad[1];
   
   
   //    if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad[1];
   //    else handle.geom.dim[1] = clean_bar_height - handle_pad[1];
   
   
   //    const handle_bot = handle.geom.pos[1] + handle.geom.dim[1] * 2
   
   //    // Set handles position
   //    if (handle.geom.pos[1] <= bar.geom.pos[1] + handle_pad[1]) {
   //       handle.geom.pos[1] = mesh.geom.pos[1] + handle_pad[1];
   //    }
   //    else if (handle_bot >= bar.geom.pos[1] + bar.geom.dim[1] * 2 - handle_pad[1]) {
   //       handle.geom.pos[1] = (mesh.geom.pos[1] + (bar.geom.dim[1] * 2)) - (handle.geom.dim[1]*2 + handle_pad[1]);
   //       // console.log(handle.geom.pos[1], handle.GetPosY(),mesh.geom.pos[1])
   //    }
   
   //    // handle.geom.UpdateSetDimY(handle.gfx);
   //    // handle.geom.UpdateSetWposY(handle.gfx);
   // }

   bar.Render();

   Construct_listen_events_from_mesh_tree(bar);
   Construct_listen_events_relations_from_mesh_tree(bar, parent);



   bar.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, bar.gfx.vb.groupidx);
   
}





export function Scroller_component_calculate_scroller_component(scrolled_section, bar){

   const handle = bar.children.buffer[0];

   // bar.geom.pos[0] = scrolled_section.GetPosX()+scrolled_section.geom.dim[0]*2;
   // bar.geom.pos[0] = scrolled_section.geom.pos[0]+scrolled_section.geom.dim[0]*2;
   bar.geom.pos[0] = scrolled_section.geom.pos[0];
   bar.geom.pos[1] = scrolled_section.geom.pos[1];
   
   const handle_pad = handle.StylesGetPad();
   handle.geom.dim[0] = bar.geom.dim[0] - handle_pad[0];
   handle.geom.dim[1] = bar.geom.dim[1] - handle_pad[1];
   handle.geom.pos[0] = bar.geom.pos[0] + handle_pad[0];
   handle.geom.pos[1] = bar.geom.pos[1] + handle_pad[1];

}



export function Scroller_component_set_pos(bar, widget_root,  x, y){

   const handle = bar.children.buffer[0];
   // const xpos = (widget_root.geom.pos[0] + widget_root.geom.dim[0]*2 > x) ? widget_root.geom.pos[0] + widget_root.geom.dim[0] : x;
   // bar.geom.pos[0] = xpos;
   // bar.geom.pos[0] = x;
   // bar.geom.pos[1] = y;
   bar.geom.pos[0] = x;
   // bar.geom.pos[1] = widget_root.geom.pos[1];
   bar.geom.pos[0] = widget_root.GetPosX();
   bar.geom.pos[1] = widget_root.GetPosY();
   bar.geom.UpdateSetWposXY(bar.gfx);
   
   console.log(
      '\n widget_root pos', widget_root.geom.pos ,
      '\n widget_root dim', widget_root.geom.dim,
      '\n x', x, 'y', y, 
      // '\n xpos', xpos,
      '\n bar.geom.pos[0]', bar.geom.pos,
   );

   const handle_pad = handle.StylesGetPad();
   // handle.geom.dim[0] = bar.geom.dim[0] - handle_pad[0];
   // handle.geom.dim[1] = bar.geom.dim[1] - handle_pad[1];
   handle.geom.pos[0] = bar.geom.pos[0] + handle_pad[0];
   handle.geom.pos[1] = bar.geom.pos[1] + handle_pad[1];
   handle.geom.UpdateSetWposXY(handle.gfx);

   // Mesh_unif_set_vb_root_wposx(bar.root_posidx, x);

}


export function Scroller_component_calculate_handle_pos_dim(scrolled_section, bar) {

   const handle = bar.children.buffer[0];

   const handle_pad = handle.StylesGetPad()
   const clean_bar_height = bar.geom.dim[1]
   
   /* Set handles size */
   const clean_size = bar.geom.dim[1];
   const a = (clean_size * clean_size) / scrolled_section.geom.dim[1];
   if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad[1];
   else handle.geom.dim[1] = clean_bar_height - handle_pad[1];

   const handle_bot = handle.geom.pos[1] + handle.geom.dim[1] * 2

   // console.log(
   //    'scroller unif+pos', scrolled_section.GetPosY(), 
   //    '\nscroller pos', scrolled_section.geom.pos[1], 
   //    '\nbar unif+posy', bar.GetPosY(), 
   //    '\nbar posy', bar.geom.pos[1], 
   // )

   /* Set handles position */
   if (handle.geom.pos[1] <= bar.geom.pos[1] + handle_pad[1]) {
      // handle.geom.pos[1] = scrolled_section.geom.pos[1] + handle_pad[1];
      handle.geom.pos[1] = bar.geom.pos[1] + handle_pad[1];
   }
   else if (handle_bot >= bar.geom.pos[1] + bar.geom.dim[1] * 2 - handle_pad[1]) {
      // handle.geom.pos[1] = (scrolled_section.geom.pos[1] + (bar.geom.dim[1] * 2)) - (handle.geom.dim[1]*2 + handle_pad[1]);
      handle.geom.pos[1] = (bar.geom.pos[1] + (bar.geom.dim[1] * 2)) - (handle.geom.dim[1]*2 + handle_pad[1]);
      // console.log(handle.geom.pos[1], handle.GetPosY(),scrolled_section.geom.pos[1])
   }

   handle.geom.UpdateSetDimY(handle.gfx);
   handle.geom.UpdateSetWposY(handle.gfx);
   
   const x = scrolled_section.GetPosX()+scrolled_section.geom.dim[0]*2;
   const y = scrolled_section.GetPosY();
   // const x = scrolled_section.GetPosX();
   // const x = scrolled_section.geom.pos[0];
   // const x = scrolled_section.geom.pos[0]+scrolled_section.geom.dim[0]*2;
   // console.log(x)
   
   // bar.geom.pos[0] = x;
   // bar.geom.UpdateSetWposX(bar.gfx);
   // handle.geom.pos[0] = x + handle_pad[0];
   // handle.geom.UpdateSetWposX(handle.gfx);
   Mesh_unif_set_vb_root_wposx(bar.root_posidx, x);
   // Mesh_unif_set_vb_root_wpos(bar.root_posidx, x, y);


   // Update the scrolled mesh position
   Scroller_component_update_scrolled_section_pos_by_uniform(scrolled_section, bar);
   

} 



function Scroller_component_calculate_handle_pos_dim_no_gfx_update(bar, handle, scrolled_section) {

   const scroller_pad = scrolled_section.StylesGetPad(STYLES.AXIS.Y)
   const handle_pad = handle.StylesGetPad(STYLES.AXIS.Y)
   const clean_bar_height = bar.geom.dim[1]
   
   const clean_size = bar.geom.dim[1];
   const a = (clean_size * clean_size) / scrolled_section.geom.dim[1];
   if (a < bar.geom.dim[1]) handle.geom.dim[1] = a - handle_pad;
   else handle.geom.dim[1] = clean_bar_height - handle_pad;

   // handle.geom.SetDim(handle.geom.dim, handle.gfx);

   const handle_bot = handle.geom.pos[1] + handle.geom.dim[1] * 2

   // Set handles position
   // handle.geom.pos[0] = scroller.geom.pos[0] + scroller_pad + handle_pad;
   if (handle.geom.pos[1] <= bar.geom.pos[1] + handle_pad) {
      // handle.geom.pos[1] = scrolled_section.geom.pos[1] + handle_pad;
      handle.geom.pos[1] = handle_pad;
   }
   else if (handle_bot >= bar.geom.pos[1] + bar.geom.dim[1] * 2 - handle_pad) {
      handle.geom.pos[1] = (scrolled_section.geom.pos[1] + (bar.geom.dim[1] * 2)) - (handle.geom.dim[1]*2 + handle_pad);
   }

}



export function Scroller_component_update_scrolled_section_pos_by_uniform(scrolled_section, bar) {


   const scroller_top = bar.GetPosY();
   const scrolled_posy = scrolled_section.GetPosY();
   // const scroller_top = bar.geom.pos[1];
   // const scrolled_posy = scrolled_section.geom.pos[1];

   const handle = bar.children.buffer[0];

   // Calculate the ratio of the scrolled section height to that of the scrollers
   const size_dif = ((scrolled_section.geom.dim[1] * 2) - ((bar.geom.dim[1] * 2)));

   // if(size_dif < 0) { // If the scrolled section is smaller than the scrollbar, set the scrolled section at the top
   //    // Mesh_unif_set_vb_root_wposy(scrolled_section.root_posidx, bar.GetPosY());
   //    // Mesh_unif_set_vb_root_wposy(scrolled_section.root_posidx, 0);
   //    Mesh_unif_set_vb_root_wposy(scrolled_section.root_posidx, scroller_top);
   //    console.log(scroller_top)
   //    return;
   // }

   const pos_dim_ratio = Scroller_component_calculate_handle_position_ratio(bar, handle); // Calculate handles's ratio based on the handles position in the scrollbar and the dimention of the handle.

   // Calculate the absolute position for the scrolled mesh. (Can't use the scolled_section's pos because it changes).
   const posy = (size_dif * -pos_dim_ratio) + scroller_top;

   /**
    * This is a ratio  for -1 to 1, of the conttribution of the handle pad that has to be added. 
    * We want to add or subtract the handle pad from the scrolled position relative to the position of the scrolled section to the scrollbar.
    * We add the positive pad half way up by the ammount of 0 to 1
    * and we add(subtract) the pad half way down by the amount 0 to -1
    */
   const pad_ratio = (pos_dim_ratio * 2 - 1);
   const ydif = (posy - scrolled_posy) + handle.StylesGetPad(STYLES.AXIS.Y) * -pad_ratio;
   
   // const pad_ratio = handle.StylesGetPad(STYLES.AXIS.Y) * (pos_dim_ratio * 2 - 1);
   // const ydif = (posy - scrolled_posy) + pad_ratio;

   // console.log(scrolled_section.geom.dim[1] , bar.geom.dim[1], 'size_dif', size_dif, 'size_dif * -val', size_dif * -pos_dim_ratio)
   // console.log(
   //    'scroller unif+pos', scrolled_section.GetPosY(), 
   //    '\nscroller pos', scrolled_section.geom.pos[1], 
   //    '\nscrolled_posy', scrolled_posy, 
   //    '\nbar unif+posy', bar.GetPosY(), 
   //    '\nbar posy', bar.geom.pos[1], 
   //    '\nscrolled dim', scrolled_section.geom.dim[1] , 
   //    '\nbar dim', bar.geom.dim[1], 
   //    '\nscroller_top', scroller_top, 
   //    '\nsize_dif', size_dif, 
   //    '\nsize_dif * -val', size_dif * -pos_dim_ratio,
   //    '\nydif', ydif,
   // )

   // Add the move difference to all vb's root positions.
   Mesh_unif_add_vb_root_wposy(scrolled_section.root_posidx, ydif);

}



function Scroller_component_on_move_clbk(params) {// Called by timeInterval as a callback function

   const scroller = params.params;

   // Destroy the time interval and the Move operation, if the scroller is not grabed
   // MESH_STATE.IN_GRAB is deactivated upon mouse click up in Events.js.
   if (scroller.StateCheck(MESH_STATE.IN_GRAB) === 0 && scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

      const intervalIdx = scroller.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      scroller.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

      return;
   }

   const mouse_pos = MouseGetPosDif();
   scroller.Move(mouse_pos.x, -mouse_pos.y);

}



export function Scroller_component_on_update_handle(_params) {

   const bar = _params.params;
   const handle = bar.children.buffer[0];

   if (bar.StateCheck(MESH_STATE.IN_GRAB) === 0 && bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE] !== INT_NULL) {

      // If bar out of hover, delete the timeInterval for moving the handle
      const intervalIdx = bar.timeIntervalsIdxBuffer.buffer[INTERVALS.UPDATE];
      TimeIntervalsDestroyByIdx(intervalIdx);
      bar.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.UPDATE);

      handle.state.mask &= ~MESH_STATE.IN_GRAB;

      return;
   }

   const scrolled_section = bar.scrolled_section;


   Scroller_component_move_handle(bar, handle);

   Scroller_component_update_scrolled_section_pos_by_uniform(scrolled_section, bar);

   // const scroller_top = bar.GetPosY();
   // const clip_top = scroller_top, clip_bottom = (scroller_top) + bar.geom.dim[1] * 2;
   // const changes_hapened = Clipy_from_tree_recursive(scrolled_section, clip_top, clip_bottom);


   // Widget_root_reset_gfx(scrolled_section.root_bufferidx);
   // Widget_root_rerender(scrolled_section.root_bufferidx);
   
   // View_reset_from_view_all_buffers(scrolled_section.group_bufferidxs[0]);
   // View_rerender_from_view_all_buffers(scrolled_section.group_bufferidxs[0], true);
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

   // const handletop = handle.geom.pos[1]-handle_pad*2; // Must add the pad for correct align of top-scroller with top-scrolled
   // const handledim = handle.geom.dim[1]*2+handle_pad*4; // Must add the pad for correct align of top-scroller with top-scrolled
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
   //       const idx = TimeIntervalsCreate(10, 'ResizeXY Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, { mesh: mesh, mouse_click: point });
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
   //    Widget_root_set_in_focus(mesh.root_bufferidx);
   
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

            const idx = TimeIntervalsCreate(16, 'Move Scroller Handle', TIME_INTERVAL_REPEAT_ALWAYS, Scroller_component_on_update_handle, bar);
            bar.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            STATE.mesh.SetGrabed(bar);
            // STATE.mesh.SetFocused(mesh);
            // mesh.state.mask |= MESH_STATE.IN_FOCUS;
            bar.StateEnable(MESH_STATE.IN_GRAB);
            // Widget_root_set_in_focus(mesh.root_bufferidx);
         }

         return true;
      }

   // }


}