"use strict";

import { Mouse_get_pos, Mouse_get_pos_dif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Rect_Mesh } from "../Meshes/Rect_Mesh.js";
import { Align_self_get_dif } from "../Operations/Alignment.js";
import { Gl_set_vpos_xy, Gl_set_wpos_xy } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Create_text_mesh } from "./Helpers/CreateWidgetInterface.js";
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Mesh_add_and_copy_wpos_xy, Mesh_add_wpos_x, Mesh_add_wpos_xy, Mesh_add_wpos_y, Mesh_set_wpos_relative_x, Mesh_set_wpos_relative_xy, Mesh_set_wpos_relative_y, Mesh_set_wpos_y, Mesh_update_set_wpos_x, Mesh_update_set_wpos_xy, Mesh_update_set_wpos_y, Set_color_a } from "../Operations/MeshAttributesFunctions.js";
import { Root_group_view_buffer_add_mesh, Root_group_view_buffer_create_root } from "../../Core/Views/RootView.js";
import { Widget_gfx_ready_enable, Style_rect_default_properties } from "./Helpers/WidgetEnableProperties.js";
import { State_mesh_set_clicked, State_mesh_set_focused, State_mesh_set_grabed } from "../../../GlobalFunctions.js";
import { Mesh_listener_add, Mesh_set_name, Mesh_state_check } from "../Operations/MeshPropertiesFunctions.js";
import { View_add_mesh, View_create_new_group, View_remove_mesh } from "../../Core/Views/MeshBufferViews.js";





// TODO: In case the button is not a root and it is in the same vb as the root, the text MUST take the buttons position 

export class Widget_Label extends Rect_Mesh {

    constructor(mesh_bufferidx, properties) {

        const text = properties.text;

        const text_pos_x = (properties.is_root & ROOT_WIDGETS.CREATE_ROOT) ? 0 : properties.pos[0];
        const text_pos_y = (properties.is_root & ROOT_WIDGETS.CREATE_ROOT) ? 0 : properties.pos[1];
        const text_mesh = Create_text_mesh({ text: text, pos: [text_pos_x, text_pos_y, properties.pos[2] + 1], col: properties.text_col, pad: properties.text_pad, font_size: properties.font_size, texture_id: properties.texture_id, sub_texture_id: properties.sub_texture_id, variant_idx: properties.variant_idx, is_debug_mesh: properties.is_debug_mesh });
        Widget_gfx_ready_enable({ mesh: text_mesh, enable_attr_dim: false, });
        text_mesh.StylesSetPad(properties.text_pad);


        // Create equal x pad for the ratio dif of w/h
        // properties.text_pad[0] += text_mesh.geom.dim[0] * 1.1708984375/2

        // Align text to the center of the label
        text_mesh.geom.pos[0] += properties.text_pad[0];
        text_mesh.geom.pos[1] += properties.text_pad[1];


        super(mesh_bufferidx, Style_rect_default_properties({
            is_root: 0x0, // Avoid double setting as root, in this class and in Rect_Mesh class
            pos: properties.pos,
            dim: properties.dim,
            col: properties.col,
            pad: properties.pad,
            name: properties.text,
            num_faces: properties.num_faces,
            is_debug_mesh: properties.is_debug_mesh,
        }));
        this.type |= MESH_TYPE.WIDGET_LABEL | this.geom.type | this.mat.type;

        this.text_mesh = text_mesh;

        this.geom.dim[0] = text_mesh.text_width + properties.text_pad[0];
        this.geom.dim[1] = text_mesh.text_height + properties.text_pad[1];


        text_mesh.sceneidx = this.sceneidx;

        this.mesh_bufferidx = mesh_bufferidx;

        // this.text_mesh.parent = NO_MESH_PARENT; // Use a special case for text meshes that are part of a widget without being in children's buffer.
        this.text_mesh.parent = this;


        this.SetLayout(properties.layout);

        if (properties.is_root & ROOT_WIDGETS.CREATE_ROOT && this) {
            this.root_bufferidx = Root_group_view_buffer_create_root(this.mesh_bufferidx);
            this.text_mesh.root_bufferidx = this.root_bufferidx;
            Root_group_view_buffer_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);

            // Create view group
            this.group_bufferidxs[0] = View_create_new_group(this);
            text_mesh.group_bufferidxs[0] = this.group_bufferidxs[0];
        }

    }
    /** */
    SetLayout(align_flags) {

        this.align.flags = align_flags;
    }
    /** */
    AddLayout(align_flags) {

        this.align.flags |= align_flags;
    }

    /****************************************************************************************************************************************************/
    /****************************************************************************************************************************************************/
    // INHERITED METHODS
    /****************************************************************************************************************************************************/

    /** */
    Activate() {

        this.state.mask |= MESH_STATE_FLAGS.ACTIVE;
        
        this.text_mesh.state.mask |= MESH_STATE_FLAGS.ACTIVE;
        
    }
    /** */
    Deactivate() {
        
        this.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
        // View_remove_mesh(this.group_bufferidxs, this.geom.num_faces);

        this.text_mesh.state.mask &= ~MESH_STATE_FLAGS.ACTIVE;
        // View_remove_mesh(this.text_mesh.group_bufferidxs, this.text_mesh.geom.num_faces);
    }
    /** */
    StateEnable(MASK = 0x0) {

        this.state.mask |= MASK;
        this.text_mesh.state.mask |= MASK;
    }
    /** */
    StateDisable(MASK = 0x0) {

        this.state.mask &= ~MASK;
        this.text_mesh.state.mask &= ~MASK;
    }
    /** */
    SetTypeDebug() {
        this.type |= MESH_TYPE.DEBUG_MESH;
        this.text_mesh.type |= MESH_TYPE.DEBUG_MESH;
    }
    /** */
    StateEnable(bit) { this.state.mask |= bit; this.text_mesh.state.mask |= bit; }
    /** */
    StateDisable(bit) { this.state.mask &= ~bit; this.text_mesh.state.mask &= ~bit; }

    /** */

    AddToWidgetRootBuffer(root_bufferidx) {

        this.root_bufferidx = root_bufferidx;
        Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
        this.text_mesh.root_bufferidx = root_bufferidx;
        Root_group_view_buffer_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);
    }
    /** */
    SetViewGroupIndex(view_groupidx) {

        this.group_bufferidxs[0] = view_groupidx;
        this.text_mesh.group_bufferidxs[0] = view_groupidx;
    }
    /** */
    SetGfxEnable(which, params) {
        alert('777\nSetGfxEnableAttributes\nWidgetLabel')
    }
    /** */
    GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

        // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
        this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
        // this.text_mesh.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
    }
    /** */
    GfxCtxSetFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

        if (this.gfx_ctx_parent === INT_NULL) {
            
            if ((this.gfx_ctx_flags & GFX_CTX_FLAGS.NEW) === 0) {
                this.gfx_ctx_flags = FLAGS;
                this.gfx_ctx_parent = gfx_ctx_parent;
            }
            this.text_mesh.gfx_ctx_flags = FLAGS;
            this.text_mesh.gfx_ctx_parent = gfx_ctx_parent;
        }
    }
    /** */
    GfxCtxAddFlag(FLAGS, gfx_ctx_parent = INT_NULL, recurse = false) {

        if (this.gfx_ctx_parent === INT_NULL) { // Set for the first time, if gfx_ctx_parent=INT_NULL from initialization

            this.gfx_ctx_flags |= FLAGS;
            this.gfx_ctx_parent = gfx_ctx_parent;
            this.text_mesh.gfx_ctx_flags |= FLAGS;
            this.text_mesh.gfx_ctx_parent = gfx_ctx_parent;
        }
    }




    /*******************************************************************************************************************************************************/
    // Graphics
    /*******************************************************************************************************************************************************/
    
    /** */
    GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, area_specific_vb_groupidx = INT_NULL, text_specific_vb_groupidx = INT_NULL) {

        if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

        const ret = Gfx_generate_context(FLAGS, this, area_specific_vb_groupidx);
        this.gfx = ret.gfx;
        
        // Add to view group
        View_add_mesh(this.group_bufferidxs[0], this, ret.is_root_widget_on_reused_vb);
        
        
        const text_mesh_ret = Gfx_generate_context(this.text_mesh.gfx_ctx_flags, this.text_mesh, text_specific_vb_groupidx);
        this.text_mesh.gfx = text_mesh_ret.gfx;
        // Add to view group
        View_add_mesh(this.text_mesh.group_bufferidxs[0], this.text_mesh, text_mesh_ret.is_root_widget_on_reused_vb);

        // if (this.text_mesh.gfx_ctx_flags) {

        //     if (text_specific_vb_groupidx !== INT_NULL) {
        //         this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.gfx_ctx_flags, this.text_mesh, text_specific_vb_groupidx);
        //     }
        //     else {

        //         this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.gfx_ctx_flags, this.text_mesh);
        //     }
        // }
        // else {

        //     if (text_specific_vb_groupidx !== INT_NULL) {
        //         this.text_mesh.gfx = Gfx_generate_context(FLAGS, this.text_mesh, text_specific_vb_groupidx);
        //     }
        //     else this.text_mesh.gfx = Gfx_generate_context(FLAGS, this.text_mesh);
        // }
        
      

        return this.gfx;
    }
    /** */
    Render() {
        if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');
        if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE_FLAGS.ACTIVE)) { this.AddToGfx(); }
        if (!this.text_mesh.is_gfx_inserted && (this.text_mesh.state.mask & MESH_STATE_FLAGS.ACTIVE)) { this.text_mesh.AddToGfx(); }
    }
    /** */
    Rerender() {

        this.AddToGfxFromReset();
        this.text_mesh.AddToGfxFromReset();
    }





    /*******************************************************************************************************************************************************/
    // Setters-Getters
    /*******************************************************************************************************************************************************/

    /** */
    SetFrameBufferIdx(fbidx) {
        this.isFramebufferRendered = fbidx;
        this.text_mesh.isFramebufferRendered = fbidx;
    }




    /*******************************************************************************************************************************************************/
    // Alignment
    /*******************************************************************************************************************************************************/

    /** */
    Align(flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

        const move_dif = Align_self_get_dif(flags, this.geom, this.text_mesh.geom, pad, this.text_mesh.geom.num_faces, this.StylesGetPad());

        // Update vertex buffers
        if (this.is_gfx_inserted) {
            /** If the alignment happens after the widgets insertion to the vertex buffers, we must update the vertex buffers too. */
            Mesh_add_wpos_xy(this.text_mesh, move_dif[0], move_dif[1]);
        }
        else {
            this.text_mesh.geom.pos[0] += move_dif[0];
            this.text_mesh.geom.pos[1] += move_dif[0];
        }

    }
    /** */
    AlignNEW(pos_x, pos_y) {

        const pad_x = this.StylesGetPad(STYLES.AXIS.X);
        const pad_y = this.StylesGetPad(STYLES.AXIS.Y);
        this.geom.pos[0] = pos_x + pad_x;
        this.geom.pos[1] = pos_y + pad_y;

        const text_pad_x = this.text_mesh.StylesGetPad(STYLES.AXIS.X);
        const text_pad_y = this.text_mesh.StylesGetPad(STYLES.AXIS.Y);
        this.text_mesh.geom.pos[0] = pos_x + pad_x + text_pad_x;
        this.text_mesh.geom.pos[1] = pos_y + pad_y + text_pad_y;

        return {
            // dim_x: this.geom.dim[0] + pad_x / 2,
            // dim_y: this.geom.dim[1] + pad_y / 2,
            dim_x: this.geom.dim[0],
            dim_y: this.geom.dim[1],
            pad_x: pad_x / 2,
            pad_y: pad_y / 2,
        };
    }


    /*******************************************************************************************************************************************************/
    // Transformations

    /** */
    AddWposXY(x, y) {

        Mesh_add_and_copy_wpos_xy(this, x, y,);
        Mesh_add_and_copy_wpos_xy(this.text_mesh, x, y,);
    }
    /** */
    AddWposX(x) {

        this.geom.pos[0] += x;
        Mesh_add_wpos_x(this, x,);
        this.text_mesh.geom.pos[0] += x;
        Mesh_add_wpos_x(this.text_mesh, x);
    }
    /** */
    AddWposY(y) {

        this.geom.pos[1] += y;
        Mesh_add_wpos_y(this, y,);
        this.text_mesh.geom.pos[1] += y;
        Mesh_add_wpos_y(this.text_mesh, y,);
    }
    /** */
    SetWposXY(x, y) {
        this.geom.pos[0] = x;
        this.geom.pos[1] = y;
        Mesh_update_set_wpos_xy(this);
        Mesh_set_wpos_relative_xy(this.text_mesh, x, y);
    }
    /** */
    SetWposX(x) {
        this.geom.pos[0] = x;
        Mesh_update_set_wpos_x(this);
        Mesh_set_wpos_relative_x(this.text_mesh, x);
    }
    /** */
    SetWposY(y) {
        this.geom.pos[1] = y;
        Mesh_update_set_wpos_y(this);
        Mesh_set_wpos_relative_y(this.text_mesh, y);
    }
    /** */
    MoveNoGfxUpdate(x, y) {

        this.geom.pos[0] += x;
        this.geom.pos[1] += y;
        this.text_mesh.geom.pos[0] += x;
        this.text_mesh.geom.pos[1] += y;
    }
    /** */
    TEMP_recalc(x, y) {

        const dx = this.text_mesh.geom.pos[0] - this.geom.pos[0];
        const dy = this.text_mesh.geom.pos[1] - this.geom.pos[1];
        this.geom.pos[0] = x;
        this.geom.pos[1] = y;
        this.text_mesh.geom.pos[0] = x + dx;
        this.text_mesh.geom.pos[1] = y + dy;
    }
    /** */
    TEMP_recalc_x(x) {

        const dx = this.text_mesh.geom.pos[0] - this.geom.pos[0];
        this.geom.pos[0] = x;
        this.text_mesh.geom.pos[0] = x + dx;
    }
    /** */
    MoveYNoGfxUpdate(y) {

        this.geom.pos[1] += y;
        this.text_mesh.geom.pos[1] += y;

    }
    /** */
    MoveXNoGfxUpdate(x) {

        this.geom.pos[0] += x;
        this.text_mesh.geom.pos[0] += x;

    }
    /** */
    SetPosXYNoGfxUpdate(x, y) {

        if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
            Mesh_unif_set_vb_root_wpos(this.root_posidx, x, y);
        }
        else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 

            this.geom.pos[0] = x;
            this.geom.pos[1] = y;

            this.text_mesh.geom.pos[0] = x;
            this.text_mesh.geom.pos[1] = y;
        }
    }
    /** */
    SetPosXNoGfxUpdate(x) {

        this.geom.pos[0] = x;

        if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
            Mesh_unif_set_vb_root_wposx(this.root_posidx, x);
        }
        else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
            // if (this.text_mesh.root_posidx !== INT_NULL) { // Same for the text_mesh
            //     Mesh_unif_set_vb_root_wposx(this.text_mesh.root_posidx, x);
            // }
            // else 
            this.text_mesh.geom.pos[0] = x;
        }
    }
    /** */
    SetPosYNoGfxUpdate(y) {

        this.geom.pos[1] = y;

        if (Mesh_unif_is_vb_root_wpos(this.root_posidx, this.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
            Mesh_unif_set_vb_root_wposy(this.root_posidx, y);
        }
        else { // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
            // if (this.text_mesh.root_posidx !== INT_NULL) { // Same for the text_mesh
            //     Mesh_unif_set_vb_root_wposy(this.text_mesh.root_posidx, y);
            // }
            // else 
            this.text_mesh.geom.pos[1] = y;
        }
    }
    /** */
    SetPosZNoGfxUpdate(z) {
        this.geom.pos[2] = z;
        this.text_mesh.geom.pos[2] = z + 1;
    }
    /** */
    SetGfxInserted(flag) {

        if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
        if (this.text_mesh.is_gfx_inserted !== flag) this.text_mesh.is_gfx_inserted = flag;
    }
    /** */
    SetColorAlpha(btn_alpha = 1, text_alpha = 1) {

        // super.SetColorAlpha(btn_alpha);
        // this.text_mesh.SetColorAlpha(text_alpha);
        Set_color_a(this, btn_alpha);
        Set_color_a(this.text_mesh, text_alpha);
    }
    /** */
    SetPosY(posy) {

        super.SetPosY(posy);
        this.text_mesh.SetPosY(posy);
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

        if (mesh.state.mask & MESH_STATE_FLAGS.ACTIVE) {

            // Construct HOVER event
            if (mesh.listeners && mesh.listeners.buffer[E.H] === INT_NULL) {
                Mesh_listener_add(mesh, E.H, null, null);
            }
            // Construct CLICK_UP/MOVE event
            if (mesh.listeners && mesh.listeners.buffer[E.C] === INT_NULL) {
                const evt_params = { target_mesh: mesh, };
                Mesh_listener_add(mesh, E.C, mesh.OnClick, evt_params);
            }
        }
    }
    /** */
    OnClick(params) {

        const mesh = params.evt_params.target_mesh;



        State_mesh_set_clicked(mesh);
        State_mesh_set_focused(mesh);

        // IMPORTANT: We use the 'INTERVALS.MOVE' index for the 'timeIntervalsIdxBuffer' element, to store the interval for the move OR the resize event, since resize and move (intervals) cannot co-exist.
        if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            /**
             * Create Move event.
             * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
             * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
            */

            let is_resized = false;

            // Check for Resize
            if (Mesh_state_check(mesh, MESH_STATE_FLAGS.IS_RESIZEABLE)) {

                const point = Mouse_get_pos();

                const right = mesh.geom.pos[0] + mesh.geom.dim[0];
                const bottom = mesh.geom.pos[1] + mesh.geom.dim[1];
                if (point.x > right - TEMP_RESIZE_MARGIN[0] || point.y > bottom - TEMP_RESIZE_MARGIN[1]) {

                    // We have Resize

                    if (point.x > right - TEMP_RESIZE_MARGIN[0] && point.y > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
                        // console.log('X Y RESIZE');

                        const OnResizeFn = mesh.OnResize;
                        const idx = Time_intervals_create(10, 'ResizeXY Widget_Label', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, mesh);
                        mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
                    }
                    else if (point.x > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
                        // console.log('X RESIZE');
                    }
                    else { // Its a height resize
                        // console.log('Y RESIZE');
                    }

                    mesh.StateEnable(MESH_STATE_FLAGS.IN_RESIZE);
                    is_resized = true;
                }
            }


            if (!is_resized) { // implement move 
                // const OnMoveFn = mesh.OnMove;
                const OnMoveFn = Label_on_move_clbk;
                const idx = Time_intervals_create(10, 'Move Widget_Label', TIME_INTERVAL_REPEAT_ALWAYS, OnMoveFn, mesh);
                mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }


            if (Mesh_state_check(mesh, MESH_STATE_FLAGS.IS_GRABABLE)) {

                State_mesh_set_grabed(mesh);
                mesh.StateEnable(MESH_STATE_FLAGS.IN_GRAB);
            }

        }
        return true;
    }
    /** */
    OnResize(params) {

        const mesh = params.params;

        if (Mesh_state_check(mesh, MESH_STATE_FLAGS.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

            const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
            Time_intervals_destroy_byidx(intervalIdx);
            mesh.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

            return;
        }

        // console.log('RESIZING ', mesh.GetName());
        const mouse_pos = Mouse_get_pos_dif();

        if (mouse_pos.x !== 0 || mouse_pos.y !== 0) {

            const x = mouse_pos.x / 2;
            const y = -mouse_pos.y / 2;

            // Check for min dimentions. // TODO: Who decides for the minimum dimentions??????
            const min_width = 40;
            const min_height = 20;

            if (mesh.geom.dim[0] + x > min_width) {
                mesh.geom.dim[0] += x;
                mesh.geom.pos[0] += x;
            }
            if (mesh.geom.dim[1] + y > min_height) {
                mesh.geom.dim[1] += y;
                mesh.geom.pos[1] += y;
            }


            Gl_set_vpos_xy(mesh.gfx, mesh.geom.dim[0], mesh.geom.dim[1], mesh.geom.num_faces)
            Gl_set_wpos_xy(mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces)


            // // TODO: Align text
            // const text_mesh = mesh.text_mesh;

        }

    }

}


function Label_on_move_clbk(params) {

    /**
     * Because the label is guaranteed not to have any children,
     * the only reason to have a move function is for moving 
     * the label alone.
     * So there is no need to move the root widget via the uniform wposition 
     */
    const mesh = params.params;

    if (Mesh_state_check(mesh, MESH_STATE_FLAGS.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

        const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
        Time_intervals_destroy_byidx(intervalIdx);
        mesh.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

        return;
    }


    const mouse_dif = Mouse_get_pos_dif();
    if (mouse_dif.x === 0 && mouse_dif.y === 0) return;

    if (Mesh_unif_is_vb_root_wpos(mesh.root_posidx, mesh.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
        Mesh_unif_add_vb_root_wpos(mesh.root_posidx, mouse_dif.x, -mouse_dif.y);
    }
    else { // Else update the label alone 

        Mesh_add_wpos_xy(mesh, mouse_dif.x, -mouse_dif.y);
        Mesh_add_wpos_xy(mesh.text_mesh, mouse_dif.x, -mouse_dif.y);
    }

}

