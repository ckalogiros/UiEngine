"use strict";

import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Geometry2D } from "../Geometry/Base/Geometry.js";
import { Material, Material_Atlas_Texture, Material_Texture } from "../Material/Base/Material.js";
import { Mesh } from "./Base/Mesh.js";
import { Mesh_per_vb_store_mesh } from "../../Core/MeshBuffer.js";
import { Vertex_buffer_add_vertices, Vertex_buffer_add_vertices_from_reset, Vertex_buffer_update_vertices } from "../../../Graphics/Buffers/VertexBuffers.js";
import { Performance_timer_start, Performance_timer_stop } from "../../Timers/PerformanceTimers.js";
import { Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy, Mesh_unif_is_vb_root_wpos } from "../../Core/MeshUniformsBuffer.js";
import { Root_group_reset_gfxs, Root_group_resize_and_rerender, Root_group_vbidx_view_reset_mesh_per_vb_buffer, Root_group_view_buffer_add_mesh, Root_group_view_buffer_create_root } from "../../Core/Views/RootView.js";
import { Info_listener_dispatch_event } from "../DebugInfo/InfoListeners.js";
import { Mesh_set_root_in_focus } from "../Operations/MeshHelperFunctions.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Mouse_get_pos, Mouse_get_pos_dif } from "../../Controls/Input/Mouse.js";
import { Calculate_positions_no_gfx_update_recursive, Calculate_sizes_recursive, Section_on_move_clbk } from "./Section.js";
import { Clipy_from_tree_recursive } from "../Operations/Clip.js";


// export class Rect extends Mesh {

//    constructor(pos = POSITION_CENTER, dim = [10, 10], col, num_faces, is_debug_mesh = 0x0) {

//       // num_faces = 1
//       const geom = new Geometry2D(pos, dim, _, num_faces);
//       const mat = new Material(col);

//       super(geom, mat);

//       this.type |= MESH_TYPE.RECT_MESH | is_debug_mesh;

//    }





//    /****************************************************************************************************************************************************/
//    /****************************************************************************************************************************************************/
//    // OVERIDEN METHODS
//    /****************************************************************************************************************************************************/
//    Activate() {

//       this.state.mask |= MESH_STATE.ACTIVE;
//    }


//    Deactivate() {

//       this.state.mask &= ~MESH_STATE.ACTIVE;
//    }


//    StateEnable(MASK = 0x0) {

//       this.state.mask |= MASK;
//    }


//    StateDisable(MASK = 0x0) {

//       this.state.mask &= ~MASK;
//    }


//    SetTypeDebug() {
//       this.type |= MESH_TYPE.DEBUG_MESH;
//    }


//    AddToWidgetRootBuffer(root_bufferidx) {

//       this.root_bufferidx = root_bufferidx;
//       Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

//    }


//    AddChild(mesh) {

//       mesh.idx = this.children.Add(mesh);

//       mesh.parent = this;

//       return mesh.idx;
//    }



//    // RemoveFromMeshPerVbBuffer() {
//    //    Mesh_per_vb_remove_mesh(this.gfx.vb.groupidx, this.per_vb_bufferidx);
//    // }





//    /*******************************************************************************************************************************************************/
//    // Graphics
//    /*******************************************************************************************************************************************************/

//    GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

//       if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

//       this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

//       return this.gfx;
//    }


//    AddToGfx() {

//       Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
//       this.is_gfx_inserted = true;

//       // Add entry to Gfx Buffer
//       this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

//       // return this.gfx.vb.starts;
//    }


//    AddToGfxFromReset() {

//       Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
//       Vertex_buffer_add_vertices_from_reset(this.gfx, this.geom, this.mat, _, this.GetName())

//       Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
//       this.is_gfx_inserted = true;

//       // Add entry to Gfx Buffer
//       this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

//    }


//    // TODO: Use it
//    UpdateGfx() {

//       if (this.is_gfx_inserted)
//          Vertex_buffer_update_vertices(this.gfx, this.geom, this.mat, this.GetName())
//       else {
//          Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
//          this.is_gfx_inserted = true;
//       }

//       return this.gfx.vb.start;
//    }





//    /*******************************************************************************************************************************************************/
//    // Setters-Getters
//    /*******************************************************************************************************************************************************/

//    GetMaxWidth() { return this.geom.dim[0]; }


//    GetMaxHeight() { return this.geom.dim[1]; }


//    SetIsGfxInserted(flag) {
//       if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
//    }


//    SetPosX(x) {
//       super.SetPosX(x);
//    }


//    SetFrameBufferIdx(fbidx) {
//       this.isFramebufferRendered = fbidx;
//    }


//    SetPosXNoGfxUpdate(x) {
//       if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
//          Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
//       }
//       else this.geom.pos[0] = x;
//    }


//    SetPosYNoGfxUpdate(y) {
//       if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
//          Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
//       }
//       else this.geom.pos[1] = y;
//    }


//    SetPosZNoGfxUpdate(val) {
//       this.geom.pos[2] = val;
//    }


//    SetPosXYNoGfxUpdate(x, y) {
//       if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
//          Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
//       }
//       else {
//          this.geom.pos[0] = x;
//          this.geom.pos[1] = y;
//       }
//    }


//    MoveNoGfxUpdate(x, y) {

//       this.geom.pos[0] += x;
//       this.geom.pos[1] += y;
//    }


//    MoveYNoGfxUpdate(y) {

//       this.geom.pos[1] += y;
//    }


//    MoveXNoGfxUpdate(x) {

//       this.geom.pos[0] += x;
//    }


//    SetDimNoGfxUpdate(x, y) {

//       this.geom.dim[0] = x;
//       this.geom.pos[1] = y;
//    }


//    SetDimYNoGfxUpdate(y) {

//       this.geom.dim[1] = y;
//    }


//    SetDimXNoGfxUpdate(x) {

//       this.geom.dim[0] = x;
//    }


//    TEMP_recalc(x, y) {
//       this.geom.pos[0] = x;
//       this.geom.pos[1] = y;
//    }


//    // SetMargin() {
//    //    this.geom.dim[0] += this.StylesGetMargin(STYLES.AXIS.X);
//    //    this.geom.dim[1] += this.StylesGetMargin(STYLES.AXIS.Y);
//    // }



// }





// TODOS: 
/**
 * Remove class Rect
 * Deal with the AddItem() and AddChild methods
 * What about the variable 'options'?
 */
// export class Rect_Mesh extends Rect {
export class Rect_Mesh extends Mesh {

   /**
    * @param {*} properties { is_root, pos, dim, col, num_faces, pad, style, is_debug_mesh, } 
    */
   constructor(mesh_bufferidx, properties) {

      const geom = new Geometry2D(properties.pos, properties.dim, _, properties.num_faces);

      // Create texture if the user has passed a texture id of type:TEXTURES.
      const mat = (properties.texture_id === undefined) ? new Material(properties.col) : 
      (properties.sub_texture_id !== INT_NULL && properties.sub_texture_id !== undefined) ? new Material_Atlas_Texture(properties.col, properties.texture_id, properties.sub_texture_id, _) : new Material_Texture(properties.col, properties.texture_id);


      super(geom, mat);

      this.sid.unif |= SID.UNIF.ROOT_WPOS2;

      this.mesh_bufferidx = mesh_bufferidx;

      this.StylesSetPad(properties.pad);
      this.SetName(`${properties.name}`);

      this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

      if (properties.is_root & ROOT_WIDGETS.CREATE_ROOT) {
         this.root_bufferidx = Root_group_view_buffer_create_root(this.mesh_bufferidx);
      }

      this.type |= MESH_TYPE.RECT_MESH | properties.is_debug_mesh;

      this.SetLayout(properties.layout)
   }

   SetLayout(align_flags) {

      this.align.flags = align_flags;
   }

   AddLayout(align_flags) {

      this.align.flags |= align_flags;
   }


   

   AddItem(mesh, options = 0x0) {

      this.options |= options;

      const idx = this.children.Add(mesh);
      mesh.idx = idx;
      mesh.parent = this;


      if (this.root_bufferidx !== INT_NULL && mesh.root_bufferidx === INT_NULL) {
         mesh.AddToWidgetRootBuffer(this.root_bufferidx)
      }

      mesh.StateEnable(this.state.mask & MESH_STATE.ACTIVE);

      return idx;
   }

   

   AddChild(mesh) {

      mesh.idx = this.children.Add(mesh);

      mesh.parent = this;

      return mesh.idx;
   }




   /****************************************************************************************************************************************************/
   /****************************************************************************************************************************************************/
   // OVERIDEN METHODS
   /****************************************************************************************************************************************************/


   Destroy() {

      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Destroy();
      }
      return super.Destroy();
   }


   Activate() {

      this.state.mask |= MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Activate();
      }
   }


   Deactivate() {

      this.state.mask &= ~MESH_STATE.ACTIVE;
      for (let i = 0; i <= this.children.boundary; i++) {
         if (this.children.buffer[i]) this.children.buffer[i].Deactivate();
      }
   }


   StateEnable(MASK = 0x0) {

      this.state.mask |= MASK;
   }


   StateDisable(MASK = 0x0) {

      this.state.mask &= ~MASK;
   }


   SetTypeDebug() {
      this.type |= MESH_TYPE.DEBUG_MESH;
   }


   AddToWidgetRootBuffer(root_bufferidx) {

      this.root_bufferidx = root_bufferidx;
      Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child) child.AddToWidgetRootBuffer(root_bufferidx);
      }

   }


   // TODO: This is wrong, cause we assume the children are NOT widgets with more children/meshes in them
   GfxCtxSetFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {

      if(this.gfx_ctx_parent === INT_NULL) {
         
         this.gfx_ctx_flags = FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;
   
         if(recurse){
            for (let i = 0; i <= this.children.boundary; i++) {
               if (this.children.buffer[i]) {
                  this.children.buffer[i].gfx_ctx_flags = FLAGS;
                  this.children.buffer[i].gfx_ctx_parent = gfx_ctx_parent;
               }
            }
         }
      }
   }
   
   
   GfxCtxAddFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {
      
      if(this.gfx_ctx_parent === INT_NULL) {
         
         this.gfx_ctx_flags |= FLAGS;
         this.gfx_ctx_parent = gfx_ctx_parent;
         
         if(recurse){
            for (let i = 0; i <= this.children.boundary; i++) {
               if (this.children.buffer[i]) this.children.buffer[i].gfx_ctx_flags |= FLAGS;
               this.children.buffer[i].gfx_ctx_parent = gfx_ctx_parent;
            }
         }
      }
   }


   // GfxUniformsEnable(flags, name, type, shader_flags) {

   //    super.EnableGfxUniforms(flags, name, type, shader_flags);
   //    for (let i = 0; i <= this.children.boundary; i++) {
   //       const child = this.children.buffer[i];
   //       if (child) child.GfxUniformsEnable(flags, name, type, shader_flags);
   //       // if (child) child.EnableGfxUniforms(flags, name, type, shader_flags);
   //    }

   // }


   GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

      // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
      this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) child.GfxUniformsSetClbk(unif_name, Clbk, clbk_params);
      }
   }


   SetIsGfxInserted(flag) {
      if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
   }



   /*******************************************************************************************************************************************************/
   // Graphics
   /*******************************************************************************************************************************************************/

   // GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

   //    // if(this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

   //    const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx);
   //    for (let i = 0; i <= this.children.boundary; i++) {
   //       const child = this.children.buffer[i];
   //       if (child) child.GenGfxCtx(FLAGS, specific_vb_groupidx);
   //    }
   //    return gfx;
   // }



   GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, specific_vb_groupidx = INT_NULL) {

      if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

      // const gfx = super.GenGfxCtx(FLAGS, specific_vb_groupidx);
      this.gfx = Gfx_generate_context(FLAGS, this, specific_vb_groupidx);

      for (let i = 0; i <= this.children.boundary; i++) {

         const child = this.children.buffer[i];
         if (child.gfx_ctx_flags) FLAGS = child.gfx_ctx_flags;
         child.GenGfxCtx(FLAGS, specific_vb_groupidx);
      }

   }

   Render(run_for_children = true) {

      if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) {
         this.AddToGfx();
      }

      if (run_for_children) {
         for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child) child.Render();
            // console.log('2', child.GetName())
         }
      }

   }
   AddToGfx() {

      Vertex_buffer_add_vertices(this.gfx, this.geom, this.mat, _, this.GetName());
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

      return this.gfx.vb.start;
   }

   AddToGfxFromReset() {

      Performance_timer_start(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      Vertex_buffer_add_vertices_from_reset(this.gfx, this.geom, this.mat, _, this.GetName())

      Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.AddToGfxRect)
      this.is_gfx_inserted = true;

      // Add entry to Gfx Buffer
      this.per_vb_bufferidx = Mesh_per_vb_store_mesh(this.gfx.vb.groupidx, this.mesh_bufferidx);

   }



   /*******************************************************************************************************************************************************/
   // Alignment
   /*******************************************************************************************************************************************************/

   AlignNEW(pos_x, pos_y) {

      const pad_x = this.StylesGetPad(STYLES.AXIS.X);
      const pad_y = this.StylesGetPad(STYLES.AXIS.Y);
      this.geom.pos[0] = pos_x + pad_x;
      this.geom.pos[1] = pos_y + pad_y;

      return {
         dim_x: this.geom.dim[0],
         dim_y: this.geom.dim[1],
         pad_x: pad_x / 2,
         pad_y: pad_y / 2,
      };
   }




   /*******************************************************************************************************************************************************/
   // Listeners
   /*******************************************************************************************************************************************************/


   /**
    * Constructs all listen events enabled for this classs widget.
    * 
    * The listener will be constructed only if:
    *    1. the mesh is ACTIVE
    *    2. the event index is INT_NULL. 
    *       That is so we skip the construction of an already created listener, if the .listeners[etype] is a number [0..n] indexing the listener in the EventListeners System buffer
    *       and it does not create a listener if the .listeners[etype] is null, if there is no listener assigned to be created
    * 
    *  This fuction must be called through 'Construct_listen_events_from_mesh_tree()', because it does not check if 'mesh.listeners' is null buffer
    */
   ListenEventConstruct() {

      const mesh = this;

      if (mesh.state.mask & MESH_STATE.ACTIVE) {
         
         // Construct HOVER event
         if (mesh.listeners && mesh.listeners.buffer[E.H] === INT_NULL) {
            mesh.AddListenEvent(E.H, null, null);
         }
         // Construct CLICK_UP/MOVE event
         if (mesh.listeners && mesh.listeners.buffer[E.C] === INT_NULL) {
            const evt_params = { target_mesh: mesh, };
            mesh.AddListenEvent(E.C, mesh.OnClick, evt_params);
         }
      }

      return true;
   }

   
   
   OnClick(params) {

      const section = params.evt_params.target_mesh;

      STATE.mesh.SetClicked(section);

      // This is to bind a click event to a section.
      if (section.evt_params && section.evt_params.EventClbk) {

         // Create time interval to continuosly press the button
         if (section.StateCheck(MESH_STATE.IS_HOLD_CLICK)) {

            const EventClbk = section.evt_params.EventClbk;
            const target_params = section.evt_params.params.target_params
            const idx = Time_intervals_create(16, 'Button Click Hold', TIME_INTERVAL_REPEAT_ALWAYS, EventClbk, { target_params: target_params });
            section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.UPDATE, idx);

            STATE.mesh.SetClickHold(section);
         }
         else {

            const EventClbk = section.evt_params.EventClbk;
            EventClbk(section.evt_params);
         }
      }
      // This is for move and/or resize events
      else if (section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

         const pos = section.GetPosXY();
         const right = pos[0] + section.geom.dim[0] * 2;
         const bottom = pos[1] + section.geom.dim[1] * 2;

         const point = Mouse_get_pos();
         if (section.state.mask & MESH_STATE.IS_RESIZEABLE && (point[0] > right - TEMP_RESIZE_MARGIN[0] || point[1] > bottom - TEMP_RESIZE_MARGIN[1])) {

            // We have Resize
            if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
               // console.log('X Y RESIZE');

               const OnResizeFn = section.OnResize;
               const idx = Time_intervals_create(10, 'ResizeXY Section', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, section);
               section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }
            else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
               // console.log('X RESIZE');
            }
            else { // Its a height resize
               // console.log('Y RESIZE');
            }

            section.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS;
            STATE.mesh.SetGrabed(section);
            // STATE.mesh.SetFocused(section);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            Mesh_set_root_in_focus(section.root_bufferidx);

            return true;
         }


         /** Create Move event.
          * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
          * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
          */
         const idx = Time_intervals_create(10, 'Move Section', TIME_INTERVAL_REPEAT_ALWAYS, Section_on_move_clbk, section);
         section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

         if (section.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(section);
            STATE.mesh.SetFocused(section);
            Info_listener_dispatch_event(INFO_LISTEN_EVENT_TYPE.UI_INFO_FOCUSED, { focused: this })
            section.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
            // Root_group_set_in_focus(section.root_bufferidx);
            // Mesh_set_root_in_focus(section.root_bufferidx);

         }

      }


      return true;

   }


   OnResize(params) {

      const root = params.params;

      // NOTE: We use the same element of the mesh's interval buffer for the resize event as the move event, they cannot both exist at the same time. 
      if (root.StateCheck(MESH_STATE.IN_GRAB) === 0 && root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

         const intervalIdx = root.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
         Time_intervals_destroy_byidx(intervalIdx);
         root.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

         return;
      }

      const mouse_pos = Mouse_get_pos();


      // Set min dimentions. // TODO: Who decides for the minimum dimentions??????
      const pos = root.GetPosXY();
      const min_sizex = pos[0] + 80;
      const min_sizey = pos[1] + 80;
      let changes_hapened = false;



      if (mouse_pos[0] > min_sizex) {

         const sizex = mouse_pos[0] - pos[0];
         root.geom.dim[0] = sizex / 2;
         changes_hapened = true;
      }

      if (mouse_pos[1] > min_sizey) {

         const sizey = mouse_pos[1] - pos[1];
         root.geom.dim[1] = sizey / 2;
         changes_hapened = true;
      }



      if (changes_hapened) {


         Root_group_reset_gfxs(root.root_bufferidx)

         const root_pos = root.GetPosXY();
         const clip_top = root_pos[1];
         const clip_bottom = root_pos[1] + root.geom.dim[1] * 2;
         const clip_right = root_pos[0] + root.geom.dim[0] * 2;

         // Clipy_from_group(root.group_bufferidxs[0], clip_top, clip_bottom);
         for (let i = 0; i <= root.children.boundary; i++) {

            Clipy_from_tree_recursive(root.children.buffer[i], clip_top, clip_bottom);
         }
         // Clipx_from_group(root.group_bufferidxs[0], 0, clip_right);

         // First reset the buffer that holds all meshes(per vertex buffer), because the 'AddFromGfx' is gonna populate the buuffer with the added mesh
         Root_group_vbidx_view_reset_mesh_per_vb_buffer(root.root_bufferidx);


         const mouse_dif = Mouse_get_pos_dif()
         const dif = { x: mouse_dif.x / 2, y: -mouse_dif.y / 2 };
         // const dif = {x:mouse_dif.x, y: -mouse_dif.y};  
         Root_group_resize_and_rerender(root.root_bufferidx, dif.x, dif.y);
         // Root_group_resize_and_rerender(root.root_bufferidx, root.geom.dim[0], root.geom.dim[1]);
      }
   }

   RotateZ(angle) {

      super.RotateZ(angle);
      for (let i = 0; i <= this.children.boundary; i++) {
         const child = this.children.buffer[i];
         if (child) Section_rotatez_children_recursive(child, angle);
      }
   }

}