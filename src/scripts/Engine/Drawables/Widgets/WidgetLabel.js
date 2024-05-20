"use strict";

import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Rect } from "../Meshes/Rect_Mesh.js";
import { Align_self_get_dif, Align_text_in_rect_parent } from "../Operations/Alignment.js";
import { Gl_set_dim_XY, Gl_set_wpos_XY } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Create_text_mesh } from "../../Core/CreateWidget.js";
import { Mesh_per_vb_remove_mesh, Mesh_buffer_get_mesh_byidx, Widget_root_add_mesh, Widget_root_create_root } from "../../Core/MeshBuffer.js";
import { GREY, WHITE } from "../Material/Base/Colors.js";
import { Mesh_unif_is_vb_root_wpos, Mesh_unif_set_vb_root_wpos, Mesh_unif_set_vb_root_wposx, Mesh_unif_set_vb_root_wposy } from "../../Core/MeshUniformsBuffer.js";
import { Set_color_a } from "../Operations/MeshAttributesFunctions.js";







export class Widget_Label extends Rect {

    text_mesh;
    // pad = [0, 0];

    constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, _text = 'null', Align = (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), _pos = [0, 0, 0], fontSize = 10, col = GREY[1], text_col = WHITE, pad = [10, 5], bold = .4, style = [0, 4, 2], font = TEXTURES.MSDF_CONSOLAS_1024, is_debug_mesh) {
        // constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, _text = 'null', Align = (ALIGN.HOR_CENTER | ALIGN.BOTTOM), _pos = [0, 0, 0], fontSize = 10, col = GREY[1], text_col = WHITE, pad = [10, 5], bold = .4, style = [0, 4, 2], font = TEXTURES.MSDF_CONSOLAS_1024, is_debug_mesh) {

        const sdfouter = CalculateSdfOuterFromDim(fontSize);
        if (sdfouter + bold > 1) bold = 1 - sdfouter;
        _pos[2] += 1; // Text in front of the label's area.

        const text = _text;

        // Create the text, to calculate its dimensions, then createthe label
        const text_mesh = Create_text_mesh(text, [0, 0, _pos[2]], fontSize, text_col, _, _, is_debug_mesh);

        _pos[2] -= 1; // Set z for area 'behind' this.text_mesh

        const dim = [
            text_mesh.GetMaxWidth() + pad[0] * 2,
            text_mesh.geom.dim[1] + pad[1] * 2,
        ];


        super(_pos, dim, col);
        this.type |= MESH_TYPE.WIDGET_LABEL | this.geom.type | this.mat.type;
        this.SetName(`[${this.mesh_bufferidx}]{${text}}-LABEL`);
        this.StylesSetPad(pad);

        this.text_mesh = text_mesh;

        Align_text_in_rect_parent(Align, this)


        text_mesh.sceneidx = this.sceneidx;


        this.mesh_bufferidx = mesh_bufferidx;

        // this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);

        // this.SetStyle(style);

        // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
        this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);


        // this.text_mesh.parent = NO_MESH_PARENT; // Use a special case for text meshes that are part of a widget without being in children's buffer.
        this.text_mesh.parent = this; // Use a special case for text meshes that are part of a widget without being in children's buffer.



        if (ROOT_WIDGET_FLAGS & ROOT_WIDGETS.CREATE_ROOT && this) {
            this.root_bufferidx = Widget_root_create_root(this.mesh_bufferidx);
            this.text_mesh.root_bufferidx = this.root_bufferidx;
            Widget_root_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);
        }

    }


    Destroy() {

        // Label's text destruction
        this.text_mesh.Destroy();
        this.text_mesh = null;

        // Label's rect_area destruction
        return super.Destroy();
    }


    AddToWidgetRootBuffer(root_bufferidx) {

        this.root_bufferidx = root_bufferidx;
        Widget_root_add_mesh(this.root_bufferidx, this.mesh_bufferidx);
        this.text_mesh.root_bufferidx = root_bufferidx;
        Widget_root_add_mesh(this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx);
    }


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


    /*******************************************************************************************************************************************************/
    // Graphics
    /*******************************************************************************************************************************************************/

    // GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, area_gfx_specific = [INT_NULL, INT_NULL], text_gfx_specific = [INT_NULL, INT_NULL]) {
    GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, area_gfx_specific = [INT_NULL, INT_NULL], text_gfx_specific = null) {

        this.gfx = Gfx_generate_context(FLAGS, this, area_gfx_specific);
        if (!text_gfx_specific)
            this.text_mesh.gfx = Gfx_generate_context(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, this.text_mesh, text_gfx_specific);
        else
            this.text_mesh.gfx = Gfx_generate_context(FLAGS, this.text_mesh, text_gfx_specific);

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
    // State
    /*******************************************************************************************************************************************************/

    StateEnable(bit) { this.state.mask |= bit; this.text_mesh.state.mask |= bit; }


    StateDisable(bit) { this.state.mask &= ~bit; this.text_mesh.state.mask &= ~bit; }



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

        const move_dif = Align_self_get_dif(flags, this.geom, this.text_mesh.geom, _, this.text_mesh.geom.num_faces, this.StylesGetPad());

        // Update vertex buffers
        if (this.is_gfx_inserted) {
            /** If the alignment happens after the widgets insertion to 
             * the vertex buffers, we must update the vertex buffers too.
             */
            this.text_mesh.geom.MoveXY(move_dif[0], move_dif[1], this.text_mesh.gfx);
        }
        else {
            this.text_mesh.geom.pos[0] += move_dif[0];
            this.text_mesh.geom.pos[1] += move_dif[0];
        }

    }


    /*******************************************************************************************************************************************************/
    // Transformations

    Move(x, y) {
        console.error('UNUSED FUNC, CHECK IT')

        if (x === 0 && y === 0) return;
        this.geom.MoveXY(x, y, this.gfx);
        this.text_mesh.geom.MoveXY(x, y, this.text_mesh.gfx);

    }


    MoveY(y) {

        this.geom.MoveY(y, this.gfx);
        this.text_mesh.geom.MoveY(y, this.text_mesh.gfx);
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
        else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 

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
        else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
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
        else{ // Else if the root pos is in another higher level mesh, then we have an offset in both 'this' and this.children, and must update all offsets 
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


    SetPosX(x) {

        super.SetPosX(x);
        this.text_mesh.SetPosX(x);
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


    RemoveFromGfxBuffer() {
        Mesh_per_vb_remove_mesh(this.gfx.vb.idx, this.per_vb_bufferidx);
        Mesh_per_vb_remove_mesh(this.text_mesh.gfx.vb.idx, this.text_mesh.per_vb_bufferidx);
    }



    /*******************************************************************************************************************************************************/
    // Events Handling
    /*******************************************************************************************************************************************************/

    // SEE ### Construct Listeners
    ConstructListeners(parent_listeners = null) {

        const mesh = this; // If in recursion, use as the current mesh the passed param. 

        if (mesh.listeners) {
            for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

                const evt = mesh.listeners.buffer[etypeidx];
                if (evt) { // If event is not null
                    const evt_params = {
                        EventClbk: null,
                        targetBindingFunctions: null,
                        target_mesh: mesh,
                        params: null,
                    }
                    if (parent_listeners === null) { // If no parent event is passed, initialize variable 'parent_listeners'
                        parent_listeners = [null, null];
                    }
                    mesh.AddListenEvent(etypeidx, mesh.OnClick, evt_params, parent_listeners[etypeidx]);
                }
            }
        }
    }


    OnClick(params) {

        const mesh = params.evt_params.target_mesh;



        STATE.mesh.SetClicked(mesh);
        // STATE.mesh.SetFocused(mesh);
        // console.log('Clicked:', mesh.GetName())

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
                        const idx = TimeIntervalsCreate(10, 'ResizeXY Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, mesh);
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
                const OnMoveFn = Section_on_move_clbk;
                const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnMoveFn, mesh);
                mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }


            if (mesh.StateCheck(MESH_STATE.IS_GRABABLE)) {

                STATE.mesh.SetGrabed(mesh);
                mesh.StateEnable(MESH_STATE.IN_GRAB);
                // STATE.mesh.SetFocused(mesh);
                // mesh.StateEnable(MESH_STATE.IN_GRAB | MESH_STATE.IN_FOCUS);
                // Widget_root_set_in_focus(mesh.root_bufferidx);
            }

        }
        return true;
    }


    OnResize(params) {

        const mesh = params.params;

        if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

            const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
            TimeIntervalsDestroyByIdx(intervalIdx);
            mesh.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

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


            Gl_set_dim_XY(mesh.gfx, mesh.geom.dim, mesh.geom.num_faces)
            Gl_set_wpos_XY(mesh.gfx, mesh.geom.pos[0] + mesh.geom.dim[0], mesh.geom.pos[1] + mesh.geom.dim[1], mesh.geom.num_faces)


            // // TODO: Align text
            // const text_mesh = mesh.text_mesh;

        }

    }

}


function Section_on_move_clbk(params) {

    const mesh = params.params;

    if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

        const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
        TimeIntervalsDestroyByIdx(intervalIdx);
        mesh.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(INTERVALS.MOVE);

        return;
    }


    const mouse_pos = MouseGetPosDif();
    if (mouse_pos.x === 0 && mouse_pos.y === 0) return;

    // Widget_root_gfx_add_unif_wpos_per_vb(mesh.root_bufferidx, [mouse_pos.x, -mouse_pos.y]);

    mesh.SetUpdateFrameBuffer();
}


/** This is just to have a class named specific for menus text, like the popup menu,
 *  so that we only use this kind of class for all menus with text.
 */
export class Widget_Label_Text_Mesh_Menu_Options extends Widget_Label {

    constructor(text, Align, pos, fontSize, col, textCol, scale, pad, bold, font, style) {

        super(text, Align, pos, fontSize, col, textCol, scale, pad, bold, font, style)
        this.type |= MESH_TYPE.WIDGET_LABEL_TEXT_MESH_MENU_OPTIONS;
    }


    SetPos(pos) {
        super.SetPos(pos)
    }


    OnClick(params) {

        const mesh = Mesh_buffer_get_mesh_byidx(params.meshidx);
        const point = MouseGetPos();
        const m = mesh.geom;

        // console.log('click')
        if (Check_intersection_point_rect(m.pos, m.dim, point, [0, 0])) {

            console.log('Button Clicked! ', mesh.GetName())
            STATE.mesh.SetClicked(mesh);

            /** For popup menu options and slider connections.
             *  If the option is clicked, then we must call the slider connect function
             */
            if (params.evt_params) {

                const evt_params = {

                    targetBindingFunctions: params.evt_params.targetBindingFunctions,
                    self_mesh: params.evt_params.clicked_mesh,
                    target_mesh: params.evt_params.target_mesh,
                    event_type: params.event_type,
                    /*FOR DEBUG*/clicked_mesh: mesh,
                }
                const EventClbk = params.evt_params.EventClbk;
                console.log('OnClick callback IN. meshId ', mesh.id)
                EventClbk(evt_params);
                console.log('OnClick callback OUT. meshId ', mesh.id)
            }

            return true;
        }

        return false;
    }


}