"use strict";

import { CalculateSdfOuterFromDim } from "../../../Helpers/Helpers.js";
import { AddArr2, Floor } from "../../../Helpers/Math/MathOperations.js";
import { Check_intersection_point_rect } from "../Operations/Collisions.js";
import { MouseGetPos, MouseGetPosDif } from "../../Controls/Input/Mouse.js";
import { Gfx_generate_context } from "../../Interfaces/Gfx/MeshGfxContext.js";
import { TimeIntervalsCreate, TimeIntervalsDestroyByIdx } from "../../Timers/TimeIntervals.js";
import { Rect } from "../Meshes/Rect_Mesh.js";
import { Align_self } from "../Operations/Alignment.js";
import { Font_get_font_advancex } from "../../Loaders/Font/ChlumskyFontMetricsLoader.js";
import { Gl_set_alpha_from_offset, Gl_set_dim_X, Gl_set_wpos_X } from "../../../Graphics/Buffers/VertexBuffersOps.js";
import { FramebufferSetUpdate } from "../../../Graphics/Buffers/FrameBuffers.js";
import { Create_text_mesh } from "../../Core/CreateWidget.js";
import { Batch_store } from "../../Batch/Batch.js";
import { Gfx_buffer_remove_mesh_by_vbidx, Gfx_buffer_store, Widget_root_add_mesh } from "../../Core/MeshBuffer.js";
import { Generate_graphics_context } from "../../Interfaces/Gfx/GfxContextFindMatch.js";
import { GREY, WHITE } from "../Material/Base/Colors.js";



function CalculateArea(text, _dim, pos, pad = [0, 0]) {

    const numchars = text.length;
    const dim = [_dim[0] * numchars, _dim[1]];

    const areaWpos = [pos[0], pos[1], pos[2]];

    dim[0] += pad[0] * 2; // Add padding to the total area's width
    dim[1] += pad[1] * 2; // Add padding to the total area's height

    areaWpos[0] += dim[0] - _dim[0]; // center the area's x pos.
    areaWpos[0] -= pad[0] * 2; // center the area's x pos including the padding.
    // Area's y pos is already centered

    return {
        dim: dim,
        pos: areaWpos,
    };
}



export class Widget_Label extends Rect {

    text_mesh;
    pad = [0, 0];

    constructor(mesh_bufferidx, ROOT_WIDGET_FLAGS, text = 'null', Align = (ALIGN.HOR_CENTER | ALIGN.VERT_CENTER), pos = [200, 300, 0], fontSize = 10, col = GREY[1], text_col = WHITE, pad = [10, 5], bold = .4, style = [0, 4, 2], font = TEXTURES.MSDF_CONSOLAS_1024) {

        const sdfouter = CalculateSdfOuterFromDim(fontSize);
        if (sdfouter + bold > 1) bold = 1 - sdfouter;
        pos[2] += 1; // Text in front of the label's area.

        /** Label tex mesh */
        const text_mesh = Create_text_mesh(text, pos, fontSize, text_col);

        pos[2] -= 1; // Set z for area 'behind' this.text_mesh

        /** Label area mesh */
        const dim = [
            (text_mesh.fontsize * 2 * Font_get_font_advancex(text_mesh.mat.texidx)) / 2,
            text_mesh.geom.dim[1]
        ];
        const areaMetrics = CalculateArea(text, dim, pos, pad)
        super(areaMetrics.pos, areaMetrics.dim, col);

        // Must call super() before using the 'this', that is why we write the code here.
        text_mesh.SetSceneIdx(this.sceneidx);


        this.mesh_bufferidx = mesh_bufferidx;

        this.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
        this.SetStyle(style);
        // If mesh has 'style' in shaders, 'u_screen_res' must be enabled.
        this.EnableGfxUniforms(SID.UNIF.SCREEN_RESOLUTION, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);

        this.type |= MESH_TYPE.WIDGET_TEXT_LABEL | this.geom.type | this.mat.type;
        this.SetName(`[${this.mesh_bufferidx}]{${text}}-LABEL`);
        this.pad = pad;

        this.text_mesh = text_mesh;
        this.text_mesh.parent = NO_MESH_PARENT; // Use a special case for text meshes that are part of a widget without being in children's buffer.

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

    GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, area_gfx_specific = null, text_gfx_specific = null) {

        const rect_igfx = Generate_graphics_context(FLAGS, this, area_gfx_specific);
        this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, rect_igfx.FLAGS, rect_igfx.idxs, this.root_bufferidx, this.mesh_bufferidx, this.uniforms);

        const text_igfx = Generate_graphics_context(FLAGS, this.text_mesh, text_gfx_specific);
        this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.sid, this.text_mesh.sceneidx, this.text_mesh.geom.num_faces, text_igfx.FLAGS, text_igfx.idxs, this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx, this.text_mesh.uniforms);


        return this.gfx;
    }
    /**SAVE */
    // GenGfxCtx(FLAGS = GFX_CTX_FLAGS.ANY, area_gfx_specific = null, text_gfx_specific = null) {


    //     if (FLAGS & GFX_CTX_FLAGS.PRIVATE) {

    //         // const rect_igfx = Find_gfx_match_widget_root_impl(this.root_bufferidx, this.sid);
    //         // FLAGS |= rect_igfx.FLAGS;

    //         // this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, rect_igfx.FLAGS, rect_igfx.idxs, this.root_bufferidx, this.mesh_bufferidx, this.uniforms);

    //         // const text_igfx = Find_gfx_match_widget_root_impl(this.text_mesh.root_bufferidx, this.text_mesh.sid);
    //         // FLAGS |= text_igfx.FLAGS;


    //         let rect_igfx = null;
    //         let text_igfx = null;

    //         if(FLAGS & GFX_CTX_FLAGS.FROM_ROOT_WIDGET){

    //             rect_igfx = Find_gfx_match_widget_root_impl(this.root_bufferidx, this.sid);
    //             text_igfx = Find_gfx_match_widget_root_impl(this.text_mesh.root_bufferidx, this.sid);
    //         }
    //         // else if(FLAGS & GFX_CTX_FLAGS.FROM_GROUP){

    //         //     rect_igfx = Find_gfx_match_widget_group_impl(this.root_bufferidx, this.sid);
    //         //     text_igfx = Find_gfx_match_widget_group_impl(this.text_mesh.root_bufferidx, this.sid);
    //         // }
    //         else if(FLAGS & GFX_CTX_FLAGS.FROM_PARENT_ASC){
    //             rect_igfx = Find_match_gfx_from_parent_ascending(this, this.parent);
    //             text_igfx = Find_match_gfx_from_parent_ascending_search_all(this.text_mesh, this.parent);
    //         }
    //         else{
    //             console.error('NO CORRECT GenGfxCtx FLAG found, searching for vb index to store');
    //             alert('SEE console.error');
    //         }

    //         FLAGS |= rect_igfx.FLAGS;
    //         this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, rect_igfx.FLAGS, rect_igfx.idxs, this.root_bufferidx, this.mesh_bufferidx, this.uniforms);

    //         FLAGS |= text_igfx.FLAGS;
    //         this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.sid, this.text_mesh.sceneidx, this.text_mesh.geom.num_faces, text_igfx.FLAGS, text_igfx.idxs, this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx, this.text_mesh.uniforms);
    //     }
    //     else if(FLAGS & GFX_CTX_FLAGS.SPECIFIC){

    //         this.gfx = Gfx_generate_context(this.sid, this.sceneidx, this.geom.num_faces, FLAGS, area_gfx_specific, this.root_bufferidx, this.mesh_bufferidx, this.uniforms);


    //         if (!text_gfx_specific) {


    //             let text_igfx = null;

    //             if(FLAGS & GFX_CTX_FLAGS.FROM_ROOT_WIDGET){

    //                 text_igfx = Find_gfx_match_widget_root_impl(this.text_mesh.root_bufferidx, this.text_mesh.sid);
    //             }
    //             // else if(FLAGS & GFX_CTX_FLAGS.FROM_GROUP){

    //             //     text_igfx = Find_gfx_match_widget_group_impl(this.text_mesh.root_bufferidx, this.text_mesh.sid);
    //             // }
    //             else if(FLAGS & GFX_CTX_FLAGS.FROM_PARENT_ASC){
    //                 text_igfx = Find_match_gfx_from_parent_ascending(this.text_mesh, this.parent);
    //             }
    //             else{
    //                 console.error('NO CORRECT GenGfxCtx FLAG found, searching for vb index to store');
    //                 alert('SEE console.error');
    //             }
    //             // const text_igfx = Find_gfx_match_widget_root_impl(this.text_mesh.root_bufferidx, this.sid);
    //             FLAGS |= text_igfx.FLAGS;

    //             this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.sid, this.text_mesh.sceneidx, this.text_mesh.geom.num_faces, FLAGS, text_igfx.idxs, this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx, this.uniforms);
    //         }
    //         else {
    //             this.text_mesh.gfx = Gfx_generate_context(this.text_mesh.sid, this.text_mesh.sceneidx, this.text_mesh.geom.num_faces, FLAGS, text_gfx_specific, this.text_mesh.root_bufferidx, this.text_mesh.mesh_bufferidx, this.text_mesh.uniforms);
    //         }
    //     }
    //     else{
    //         console.error('NO CORRECT FLAGS passed in GenGfxCtx');
    //         alert('NO CORRECT FLAGS passed in GenGfxCtx.\nSEEE console.error');
    //     }

    //     return this.gfx;
    // }


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

    /** Return type: Array. Returns an array of all widgets meshes */
    GetAllMeshes(parent_meshes_buf) {

        const all_meshes = parent_meshes_buf ? parent_meshes_buf : [];
        all_meshes.push(this);
        all_meshes.push(this.text_mesh);
        return all_meshes;
    }


    SetZPos(z) {
        this.geom.pos[2] = z;
        this.text_mesh.geom.pos[2] = z + 1;
    }


    SetUpdateFrameBuffer() {
        if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
    }


    SetFrameBufferIdx(fbidx) {
        this.isFramebufferRendered = fbidx;
        this.text_mesh.isFramebufferRendered = fbidx;
    }


    SetPosXNoGfxUpdate(x) {
        this.geom.pos[0] = x;
        this.text_mesh.geom.pos[0] = x;
    }


    SetPosYNoGfxUpdate(y) {
        this.geom.pos[1] = y;
        this.text_mesh.geom.pos[1] = y;
    }


    SetPosXYNoGfxUpdate(x, y) {
        this.geom.pos[0] = x;
        this.text_mesh.geom.pos[0] = x;
        this.geom.pos[1] = y;
        this.text_mesh.geom.pos[1] = y;
    }



    /*******************************************************************************************************************************************************/
    // Alignment
    /*******************************************************************************************************************************************************/

    Align(flags, pad = [0, 0]) { // Align pre-added to the vertexBuffers

        const move_dif = Align_self(flags, this.geom, this.text_mesh.geom, _, this.text_mesh.geom.num_faces, this.pad);

        // Update vertex buffers
        if (this.is_gfx_inserted) {
            /** If the alignment happens after the widgets insertion to 
             * the vertex buffers, we must update the vertex buffers too.
             */
            this.text_mesh.geom.MoveXY(move_dif[0], move_dif[1], this.text_mesh.gfx);
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


    MoveYNoGfxUpdate(y) {

        this.geom.pos[1] += y;
        this.text_mesh.geom.pos[1] += y;

    }


    MoveXNoGfxUpdate(x) {

        this.geom.pos[0] += x;
        this.text_mesh.geom.pos[0] += x;

    }


    Reposition_post(pos_dif) { // Update the widget's position, after it is added to the gfx buffers

        this.geom.MoveXY(pos_dif[0], pos_dif[1], this.gfx);
        this.text_mesh.geom.MoveXY(pos_dif[0], pos_dif[1], this.text_mesh.gfx);
    }


    Reposition_pre(pos_dif) { // Update the widget's position, after it is added to the gfx buffers

        AddArr2(this.geom.pos, pos_dif);
        // AddArr2(this.geom.pos_dif, pos_dif);

        if (this.batch_fnidx === INT_NULL)
            this.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;

        const update_data = {
            sizes: [2],
            data: [pos_dif[0], pos_dif[1]],
        };
        Batch_store(this, SHADER_ATTRIBUTES.WPOS4, update_data);

        AddArr2(this.text_mesh.geom.pos, pos_dif);
        // AddArr2(this.text_mesh.geom.pos_dif, pos_dif);

        // if (this.text_mesh.batch_fnidx === INT_NULL)
        this.text_mesh.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;

        Batch_store(this.text_mesh, SHADER_ATTRIBUTES.WPOS4, update_data);

        // Batch_store(this.text_mesh, _, { pos: this.text_mesh.geom.pos_dif }, _);
    }


    UpdatePosXYZ() {
        this.geom.UpdatePosXYZ(this.gfx);
        this.text_mesh.geom.UpdatePosXYZ(this.gfx);
    }


    SetGfxInserted(flag) {

        if (this.is_gfx_inserted !== flag) this.is_gfx_inserted = flag; // If true then set false
        if (this.text_mesh.is_gfx_inserted !== flag) this.text_mesh.is_gfx_inserted = flag;
    }


    SetColorAlpha(btn_alpha = 1, text_alpha = 1) {

        super.SetColorAlpha(btn_alpha);
        this.text_mesh.SetColorAlpha(text_alpha);
    }


    SetPosY(posy) {

        super.SetPosY(posy);
        this.text_mesh.SetPosY(posy);
    }


    // IMIDIATELY: Call SetPos from .geom directly
    FakeRemoveFromGfxPosy(posy) {

        this.geom.defPos[1] = this.geom.pos[1]; // Copy the current position to the mesh's default pos, so it can be retrieved.
        super.SetPosY(posy);

        this.text_mesh.geom.defPos[1] = this.text_mesh.geom.pos[1];
        this.text_mesh.SetPosY(posy);
    }


    FakeAddFromGfxPosy(posy) {

        this.geom.pos[1] = this.geom.defPos[1]; // Copy the current position to the mesh's default pos, so it can be retrieved.
        super.SetPosY(posy);

        this.text_mesh.geom.pos[1] = this.text_mesh.geom.defPos[1];
        this.text_mesh.SetPosY(posy);
    }


    FakeRemoveFromGfxAlpha(alpha) {

        this.mat.defCol[3] = this.mat.col[3]; // Copy the current position to the mesh's default pos, so it can be retrieved.
        this.mat.SetColorAlpha(alpha, this.gfx);

        this.text_mesh.mat.defCol[3] = this.text_mesh.mat.col[3];
        this.text_mesh.mat.SetColorAlpha(alpha, this.text_mesh.gfx);
    }


    FakeAddFromGfxAlpha(alpha) {

        this.mat.col[3] = this.mat.defCol[3]; // Copy the current position to the mesh's default pos, so it can be retrieved.
        this.mat.SetColorAlpha(alpha, this.gfx);

        this.text_mesh.mat.col[3] = this.text_mesh.mat.defCol[3];
        this.text_mesh.mat.SetColorAlpha(alpha, this.text_mesh.gfx);
    }


    Resize() {

        console.log('\n==== Resizing:', this.GetName())
        console.log()
        // this.SetColorRGB([1,1,0]);
    }


    ClampX(x, margin = 0) { // UNNECESSARY ???

        const clamp = x - margin - this.pad[0];

        // Do not clamp if mesh already smaller
        if (this.geom.dim[0] * 2 < clamp) return;

        this.geom.pos[0] -= this.geom.dim[0]; // Center meshe's position at left .
        this.geom.dim[0] = clamp / 2; // Subtract the clamped value from the labels area dimention.
        this.geom.pos[0] += clamp / 2; // Move mesh by half the new width.

        const label_area_w = this.geom.dim[0] - (this.pad[0] * 2); // Need to include only the left pad

        const char_width = Floor(this.text_mesh.fontsize * Font_get_font_advancex(this.text_mesh.mat.texidx));
        let text_width = char_width;
        let k = 0; // Will store the number of characters need to be clamped.
        // Calculate how many characters we must ommit.
        while (text_width < label_area_w) {
            text_width += char_width;
            k++;
        }
        // this.text_mesh.geom.num_faces -= k;
        if (k + 1 < this.text_mesh.geom.num_faces) // Avoid +1 if k===num_faces
            this.text_mesh.geom.num_faces = k + 1;

        // Update the gfx buffers, if the mesh is already inserted.
        if (this.is_gfx_inserted) {
            // TODO: Here we decide if we rebuild the vertex buffer or just not draw the ommited text
            Gl_set_dim_X(this.gfx, this.geom.dim[0]); // Update dim in vertex buffer
            Gl_set_wpos_X(this.gfx, this.geom.pos[0]); // Update pos in vertex buffer
            const ommited_chars = this.text_mesh.mat.text.length - (k + 1);
            Gl_set_alpha_from_offset(this.text_mesh.gfx, 0, this.text_mesh.geom.num_faces, ommited_chars); // Update alpha in text vertex buffer
        }
    }



    /*******************************************************************************************************************************************************/
    // Core-Buffers
    /*******************************************************************************************************************************************************/


    AddToGfxBuffer() {
        this.gfx_bufferidx = Gfx_buffer_store(this.gfx.vb.idx, this.mesh_bufferidx);
        this.text_mesh.gfx_bufferidx = Gfx_buffer_store(this.text_mesh.gfx.vb.idx, this.text_mesh.mesh_bufferidx);
    }


    RemoveFromGfxBuffer() {
        Gfx_buffer_remove_mesh_by_vbidx(this.gfx.vb.idx, this.gfx_bufferidx);
        Gfx_buffer_remove_mesh_by_vbidx(this.text_mesh.gfx.vb.idx, this.text_mesh.gfx_bufferidx);
    }



    /*******************************************************************************************************************************************************/
    // Events Handling
    /*******************************************************************************************************************************************************/

    // SEE ### Construct Listeners
    ConstructListeners(_root = null) {

        const mesh = this; // If in recursion, use as the current mesh the passed param. 
        const root = (_root) ? _root : this; // If in recursion, use as the current mesh the passed param. 

        const root_evt = root.listeners.buffer;

        for (let etypeidx = 0; etypeidx <= mesh.listeners.boundary; etypeidx++) {

            const evt = mesh.listeners.buffer[etypeidx];
            if (evt) { // If event is not null
                const target_params = {
                    EventClbk: null,
                    targetBindingFunctions: null,
                    target_mesh: mesh,
                    params: null,
                }
                mesh.AddListenEvent(etypeidx, mesh.OnClick, target_params, root_evt);
            }
        }
    }


    OnClick(params) {

        const mesh = params.target_params.target_mesh;
        const OnMoveFn = mesh.OnMove;

        const point = MouseGetPos();
        const g = mesh.geom;
        if (Check_intersection_point_rect(g.pos, g.dim, point, [0, 8])) {

            STATE.mesh.SetClicked(mesh);
            // STATE.mesh.SetFocused(mesh);
            console.log('Clicked:', mesh.GetName())

            if (mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

                /**
                 * Create Move event.
                 * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
                 * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
                */
                const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnMoveFn, mesh);
                mesh.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

                if (mesh.StateCheck(MESH_STATE.IS_GRABABLE)) {

                    STATE.mesh.SetGrabed(mesh);
                    mesh.StateEnable(MESH_STATE.IN_GRAB);
                }

            }
            return true;
        }
        return false;
    }


    // SEE ### OnMove Events Implementation Logic
    OnMove(params) {

        // The 'OnMove' function is called by the timeInterval.
        // The timeInterval has been set by the 'OnClick' event.
        const mesh = params.params;
        const text_mesh = mesh.text_mesh;


        // Destroy the time interval and the Move operation, if the mesh is not grabed
        // MESH_STATE.IN_GRAB is deactivated upon mouse 'click up' in Events.js.
        if (mesh.StateCheck(MESH_STATE.IN_GRAB) === 0 && mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] !== INT_NULL) {

            const intervalIdx = mesh.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE];
            TimeIntervalsDestroyByIdx(intervalIdx);
            mesh.timeIntervalsIdxBuffer.RemoveByIdx(INTERVALS.MOVE);

            return;
        }

        // Move 
        const mouse_pos = MouseGetPosDif();

        if (mouse_pos.x !== 0 || mouse_pos.y !== 0) {

            mesh.geom.pos[0] += mouse_pos.x;
            mesh.geom.pos[1] += -mouse_pos.y;
            mesh.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;
            const update_data = {
                sizes: [2],
                data: [mouse_pos.x, -mouse_pos.y],
            };
            Batch_store(mesh, SHADER_ATTRIBUTES.WPOS4, update_data);

            text_mesh.geom.pos[0] += mouse_pos.x;
            text_mesh.geom.pos[1] += -mouse_pos.y;
            text_mesh.batch_fnidx = BATCH_FN_IDX.ADD_WPOS4;
            Batch_store(text_mesh, SHADER_ATTRIBUTES.WPOS4, update_data);
        }

        mesh.SetUpdateFrameBuffer();

    }

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

        const mesh = params.source_params;
        const point = MouseGetPos();
        const m = mesh.geom;

        // console.log('click')
        if (Check_intersection_point_rect(m.pos, m.dim, point, [0, 0])) {

            console.log('Button Clicked! ', mesh.GetName())
            STATE.mesh.SetClicked(mesh);

            /** For popup menu options and slider connections.
             *  If the option is clicked, then we must call the slider connect function
             */
            if (params.target_params) {

                const target_params = {

                    targetBindingFunctions: params.target_params.targetBindingFunctions,
                    self_mesh: params.target_params.clicked_mesh,
                    target_mesh: params.target_params.target_mesh,
                    event_type: params.event_type,
                    /*FOR DEBUG*/clicked_mesh: mesh,
                }
                const EventClbk = params.target_params.EventClbk;
                console.log('OnClick callback IN. meshId ', mesh.id)
                EventClbk(target_params);
                console.log('OnClick callback OUT. meshId ', mesh.id)
            }

            return true;
        }

        return false;
    }


}