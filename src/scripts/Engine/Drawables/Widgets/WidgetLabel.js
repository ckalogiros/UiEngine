"use strict";

import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { Time_intervals_create, Time_intervals_destroy_byidx } from "../../Timers/TimeIntervals.js";
import { Rect_Mesh } from "../Meshes/Rect_Mesh.js";
import { Align_self_get_dif, Align_text_in_rect_parent } from "../Operations/Alignment.js";
import { Gl_set_vpos_xy, Gl_set_wpos_xy } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Create_text_mesh, Create_text_mesh_msdf } from "../../Core/CreateWidget.js";
import { Mesh_per_vb_remove_mesh } from "../../Core/MeshBuffer.js";
import { GREY, WHITE } from "../Material/Base/Colors.js";
import { Mesh_unif_add_vb_root_wpos, Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Set_color_a } from "../Operations/MeshAttributesFunctions.js";
import { Root_group_view_buffer_add_mesh, Root_group_view_buffer_create_root } from "../../Core/Views/RootView.js";







// export class Widget_Label extends Rect {
export class Widget_Label extends Rect_Mesh {

    constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, _text = 'null', Align = (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), _pos = [0, 0, 0], fontSize = 10, col = GREY[1], text_col = WHITE, pad = [10, 5], bold = .4, style = {rcorners:4, feather:2, border:0}, font = TEXTURES.DEFAULT_FONT, is_debug_mesh) {

        const sdfouter = CalculateSdfOuterFromDim(fontSize);
        if (sdfouter + bold > 1) bold = 1 - sdfouter;
        _pos[2] += 1; // Text in front of the label's area.

        const text = _text;

        // Create the text, to calculate its dimensions, then createthe label
        let text_mesh = null;
        let dim = [0,0];

        if((font === TEXTURES.MSDF_COMIC_1024) || (font === TEXTURES.MSDF_CONSOLAS_1024)) {
            text_mesh = Create_text_mesh_msdf(text, [0, 0, _pos[2]], fontSize, text_col, _, font, is_debug_mesh);
        }
        else {
            text_mesh = Create_text_mesh(text, [0, 0, _pos[2]], fontSize, text_col, _, font, is_debug_mesh);
        }
        
        _pos[2] -= 1; // Set z for area 'behind' this.text_mesh
        
        const dimentions = text_mesh.CalculateTextWidth();
        dim = [
            dimentions.w + (pad[0] * 2),
            // dimentions.h/2 + (pad[1] * 2),
            dimentions.h + (pad[1] * 2),
        ];


        super(mesh_bufferidx, ROOT_WIDGET_FLAGS, _pos, dim, col, _, style, pad, 1, is_debug_mesh);
        this.type |= MESH_TYPE.WIDGET_LABEL | this.geom.type | this.mat.type;
        this.StylesSetPad(pad);
        this.SetStyle(style)
        this.SetName(_text)

        this.text_mesh = text_mesh;

        const text_pos = ((ROOT_WIDGET_FLAGS&ROOT_WIDGETS.CREATE_ROOT)===0) ? [_pos[0], _pos[1]] : [0, 0]; // If label is NOT root, add the position offset to its text
        Align_text_in_rect_parent(Align, this, text_pos)


        text_mesh.sceneidx = this.sceneidx;


        this.mesh_bufferidx = mesh_bufferidx;

        // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
        this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


        // this.text_mesh.parent = NO_MESH_PARENT; // Use a special case for text meshes that are part of a widget without being in children's buffer.
        this.text_mesh.parent = this; // Use a special case for text meshes that are part of a widget without being in children's buffer.



        if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT && this) {
            this.root_bufferidx = Root_group_view_buffer_create_root(this.mesh_bufferidx);
            this.text_mesh.root_bufferidx = this.root_bufferidx;
            Root_group_view_buffer_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);
        }

    }



    /****************************************************************************************************************************************************/
    /****************************************************************************************************************************************************/
    // INHERITED METHODS
    /****************************************************************************************************************************************************/

    Activate() {

        this.state.mask |= MESH_STATE.ACTIVE;
        this.text_mesh.state.mask |= MESH_STATE.ACTIVE;
    }


    Deactivate() {

        this.state.mask &= ~MESH_STATE.ACTIVE;
        this.text_mesh.state.mask &= ~MESH_STATE.ACTIVE;
    }


    StateEnable(MASK = 0x0) {

        this.state.mask |= MASK;
        this.text_mesh.state.mask |= MASK;
    }


    StateDisable(MASK = 0x0) {

        this.state.mask &= ~MASK;
        this.text_mesh.state.mask &= ~MASK;
    }


    SetTypeDebug() {
        this.type |= MESH_TYPE.DEBUG_MESH;
        this.text_mesh.type |= MESH_TYPE.DEBUG_MESH;
    }


    StateEnable(bit) { this.state.mask |= bit; this.text_mesh.state.mask |= bit; }


    StateDisable(bit) { this.state.mask &= ~bit; this.text_mesh.state.mask &= ~bit; }



    Destroy() {

        this.text_mesh.Destroy();
        this.text_mesh = null;
        return super.Destroy();
    }


    AddToWidgetRootBuffer(root_bufferidx) {

        this.root_bufferidx = root_bufferidx;
        Root_group_view_buffer_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
        this.text_mesh.root_bufferidx = root_bufferidx;
        Root_group_view_buffer_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);
    }


    SetGfxEnableAttributes(which, params) {
        alert('777\nSetGfxEnableAttributes\nWidgetLabel')
    }


    /** Must run for every mesh */
    GfxUniformsEnable(flags, name, type, shader_flags) {

        super.EnableGfxUniforms(flags, name, type, shader_flags);
        this.text_mesh.EnableGfxUniforms(flags, name, type, shader_flags);

    }


    GfxUniformsSetClbk(unif_name, Clbk, clbk_params) {

        // NOTE: The call must happen once per vb, so it is sufficient to make the call for every mesh of the widget that belongs to a different vb group
        this.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
        this.text_mesh.SetClbkGfxUniforms(unif_name, Clbk, clbk_params);
    }


    GfxCtxSetFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {

        if (this.gfx_ctx_parent === INT_NULL) {

            this.gfx_ctx_flags = FLAGS;
            this.gfx_ctx_parent = gfx_ctx_parent;
            this.text_mesh.gfx_ctx_flags = FLAGS;
            this.text_mesh.gfx_ctx_parent = gfx_ctx_parent;
        }
    }


    GfxCtxAddFlag(FLAGS, gfx_ctx_parent=INT_NULL, recurse=false) {

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
    GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, area_specific_vb_groupidx = INT_NULL, text_specific_vb_groupidx = INT_NULL) {

        if (this.gfx_ctx_flags) FLAGS = this.gfx_ctx_flags; // Use user specific gfx flags, if user have enabled/assign any.

        this.gfx = Gfx_generate_context(FLAGS, this, area_specific_vb_groupidx);
        
        if (this.text_mesh.gfx_ctx_flags) 
            this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.gfx_ctx_flags, this.text_mesh);
        else if (text_specific_vb_groupidx !== INT_NULL){
            this.text_mesh.gfx = Gfx_generate_context(FLAGS, this.text_mesh, text_specific_vb_groupidx);
        }
        else {
            this.text_mesh.gfx = Gfx_generate_context(FLAGS, this.text_mesh);
        }

        return this.gfx;
    }


    Render() {
        if (this.gfx.is_gfx_inserted) console.error('Already gfx inserted!!!');
        if (!this.is_gfx_inserted && (this.state.mask & MESH_STATE.ACTIVE)) { this.AddToGfx(); }
        if (!this.text_mesh.is_gfx_inserted && (this.text_mesh.state.mask & MESH_STATE.ACTIVE)) { this.text_mesh.AddToGfx(); }
    }


    Rerender() {

        this.AddToGfxFromReset();
        this.text_mesh.AddToGfxFromReset();
    }


    DeactivateGfx() {

        // Deactivate label's area
        super.DeactivateGfx();

        // Deactivate for label's text 
        this.text_mesh.DeactivateGfx();
    }





    /*******************************************************************************************************************************************************/
    // Setters-Getters
    /*******************************************************************************************************************************************************/


    SetUpdateFrameBuffer() {
        if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
    }


    SetFrameBufferIdx(fbidx) {
        this.isFramebufferRendered = fbidx;
        this.text_mesh.isFramebufferRendered = fbidx;
    }




    /*******************************************************************************************************************************************************/
    // Alignment
    /*******************************************************************************************************************************************************/

    Align(flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

        const move_dif = Align_self_get_dif(flags, this.geom, this.text_mesh.geom, pad, this.text_mesh.geom.num_faces, this.StylesGetPad());

        // Update vertex buffers
        if (this.is_gfx_inserted) {
            /** If the alignment happens after the widgets insertion to 
             * the vertex buffers, we must update the vertex buffers too.
             */
            this.text_mesh.geom.AddWposXY(this.text_mesh.gfx, move_dif[0], move_dif[1]);
        }
        else {
            this.text_mesh.geom.pos[0] += move_dif[0];
            this.text_mesh.geom.pos[1] += move_dif[0];
        }

    }


    /*******************************************************************************************************************************************************/
    // Transformations

    Move(x, y) {
        alert('14321009465 \n USE THE AddWposXY() instead ')
        console.error('UNUSED FUNC, CHECK IT')

        if (x === 0 && y === 0) return;
        this.geom.AddWposXY(this.gfx, x, y, );
        this.text_mesh.geom.AddWposXY(this.text_mesh.gfx, x, y);

    }


    AddWposXY(x, y) {

        this.geom.AddWposXY(this.gfx, x, y,);
        this.text_mesh.geom.AddWposXY(this.text_mesh.gfx, x, y,);
    }


    AddWposX(x) {

        this.geom.AddWposX(this.gfx, x, );
        this.text_mesh.AddWposX(x);
    }


    AddWposY(y) {

        this.geom.pos[1] += y;
        this.geom.AddWposY(this.gfx, y, );
        this.text_mesh.geom.pos[1] += y;
        this.text_mesh.geom.AddWposY(this.text_mesh.gfx, y, );
        // if(this.state.mask & MESH_STATE.ACTIVE) {
        //     this.geom.AddWposY(this.gfx, y, );
        // }
        // this.text_mesh.geom.pos[1] += y;
        // if(this.text_mesh.state.mask & MESH_STATE.ACTIVE) {
        //     this.text_mesh.geom.AddWposY(this.text_mesh.gfx, y, );
        // }
    }


    MoveNoGfxUpdate(x, y) {

        this.geom.pos[0] += x;
        this.geom.pos[1] += y;
        this.text_mesh.geom.pos[0] += x;
        this.text_mesh.geom.pos[1] += y;
    }


    TEMP_recalc(x, y) {

        const dx = this.text_mesh.geom.pos[0] - this.geom.pos[0];
        const dy = this.text_mesh.geom.pos[1] - this.geom.pos[1];
        this.geom.pos[0] = x;
        this.geom.pos[1] = y;
        this.text_mesh.geom.pos[0] = x + dx;
        this.text_mesh.geom.pos[1] = y + dy;
    }


    TEMP_recalc_x(x) {

        const dx = this.text_mesh.geom.pos[0] - this.geom.pos[0];
        this.geom.pos[0] = x;
        this.text_mesh.geom.pos[0] = x + dx;
    }


    MoveYNoGfxUpdate(y) {

        this.geom.pos[1] += y;
        this.text_mesh.geom.pos[1] += y;

    }


    MoveXNoGfxUpdate(x) {

        this.geom.pos[0] += x;
        this.text_mesh.geom.pos[0] += x;

    }


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


    SetPosZNoGfxUpdate(z) {
        this.geom.pos[2] = z;
        this.text_mesh.geom.pos[2] = z + 1;
    }


    SetWposXY(x, y) {
        // const xx = x-this.geom.dim[0];
        // const yy = y-this.geom.dim[1];
        // super.SetWposXY(xx, yy);
        super.SetWposXY(x, y);
        this.text_mesh.AddWposXY(x, y);
    }
    
    
    SetWposX(x) {
        super.SetWposX(x);
        this.text_mesh.AddWposX(x);
    }
    
    
    SetWposY(y) {
        super.SetWposY(y);
        this.text_mesh.AddWposY(y);
    }


    SetGfxInserted(flag) {

        if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
        if (this.text_mesh.is_gfx_inserted !== flag) this.text_mesh.is_gfx_inserted = flag;
    }


    SetColorAlpha(btn_alpha = 1, text_alpha = 1) {

        // super.SetColorAlpha(btn_alpha);
        // this.text_mesh.SetColorAlpha(text_alpha);
        Set_color_a(this, btn_alpha);
        Set_color_a(this.text_mesh, text_alpha);
    }


    SetPosY(posy) {

        super.SetPosY(posy);
        this.text_mesh.SetPosY(posy);
    }






    /*******************************************************************************************************************************************************/
    // Core-Buffers
    /*******************************************************************************************************************************************************/


    // RemoveFromMeshPerVbBuffer() {
    //     Mesh_per_vb_remove_mesh(this.gfx.vb.groupidx, this.per_vb_bufferidx);
    //     Mesh_per_vb_remove_mesh(this.text_mesh.gfx.vb.groupidx, this.text_mesh.per_vb_bufferidx);
    // }





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
    }


    OnClick(params) {

        const mesh = params.evt_params.target_mesh;



        STATE.mesh.SetClicked(mesh);
        STATE.mesh.SetFocused(mesh);

        // IMPORTANT: We use the 'INTERVALS.MOVE' index for the 'timeIntervalsIdxBuffer' element, to store the interval for the move OR the resize event, since resize and move (intervals) cannot co-exist.
        if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

            /**
             * Create Move event.
             * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
             * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
            */

            let is_resizesed = false;

            // Check for Resize
            if (mesh.StateCheck(MESH_STATE.IS_RESIZEABLE)) {

                const point = MouseGetPos();

                const right = mesh.geom.pos[0] + mesh.geom.dim[0];
                const bottom = mesh.geom.pos[1] + mesh.geom.dim[1];
                if (point[0] > right - TEMP_RESIZE_MARGIN[0] || point[1] > bottom - TEMP_RESIZE_MARGIN[1]) {

                    // We have Resize

                    if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize
                        // console.log('X Y RESIZE');

                        const OnResizeFn = mesh.OnResize;
                        const idx = Time_intervals_create(10, 'ResizeXY Widget_Label', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, mesh);
                        mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
                    }
                    else if (point[0] > right - TEMP_RESIZE_MARGIN[0]) { // Its a width resize
                        // console.log('X RESIZE');
                    }
                    else { // Its a height resize
                        // console.log('Y RESIZE');
                    }

                    mesh.StateEnable(MESH_STATE.IN_RESIZE);
                    is_resizesed = true;
                }
            }


            if (!is_resizesed) { // implement move 
                // const OnMoveFn = mesh.OnMove;
                const OnMoveFn = Label_on_move_clbk;
                const idx = Time_intervals_create(10, 'Move Widget_Label', TIME_INTERVAL_REPEAT_ALWAYS, OnMoveFn, mesh);
                mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }


            if (mesh.StateCheck(MESH_STATE.IS_GRABABLE)) {

                STATE.mesh.SetGrabed(mesh);
                mesh.StateEnable(MESH_STATE.IN_GRAB);
            }

        }
        return true;
    }


    OnResize(params) {

        const mesh = params.params;

        if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

            const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
            Time_intervals_destroy_byidx(intervalIdx);
            mesh.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

            return;
        }

        // console.log('RESIZING ', mesh.GetName());
        const mouse_pos = MouseGetPosDif();

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

    if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

        const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
        Time_intervals_destroy_byidx(intervalIdx);
        mesh.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(INTERVALS.MOVE);

        return;
    }


    const mouse_dif = MouseGetPosDif();
    if (mouse_dif.x === 0 && mouse_dif.y === 0) return;

    if (Mesh_unif_is_vb_root_wpos(mesh.root_posidx, mesh.mesh_bufferidx)) { // If this pos is the 'root wpos', must update the root wpos buffer.
        Mesh_unif_add_vb_root_wpos(mesh.root_posidx, mouse_dif.x, -mouse_dif.y);
    }
    else { // Else update the label alone 

        mesh.geom.AddWposXY( mesh.gfx, mouse_dif.x, -mouse_dif.y);
        mesh.text_mesh.geom.AddWposXY(mesh.text_mesh.gfx, mouse_dif.x, -mouse_dif.y);
    }


    // mesh.SetUpdateFrameBuffer();
}

