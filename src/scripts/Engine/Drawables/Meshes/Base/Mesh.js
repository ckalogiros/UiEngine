"use strict";
import { Time_intervals_destroy_byidx } from "../../../Timers/TimeIntervals.js";
import { Free_generic_buffer, Free_generic_char_buffer, Free_int16_buffer, Free_int8_buffer, New_generic_buffer, New_int16_buffer, New_int8_buffer } from "../../../Core/Buffers.js";
import { Gl_rotate_add_z_2d, Gl_rotate_y_2d, Gl_rotate_z_2d } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Listener_change_child_event, Listener_create_child_event, Listener_remove_event_by_idx } from "../../../Events/EventListeners.js";
import { Mesh_buffer_remove_mesh_byidx, Mesh_per_vb_remove_mesh } from "../../../Core/MeshBuffer.js";
import { Str_buffer_mesh_names_get_by_idx, Str_buffer_mesh_names_store } from "../../../Core/StringBuffer.js";
import { Gfx_pool_remove_geometry } from "../../../Interfaces/Gfx/GfxPool.js";
import { Styles_create, Styles_remove_byidx, Styles_hover_margin_get, Styles_hover_margin_set, Styles_margin_get, Styles_margin_set, Styles_pad_get, Styles_pad_set, Styles_pad_x_set, Styles_pad_y_set } from "../../../Styles.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../DebugInfo/DebugInfoUiNotifications.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_get_vb_root_wposx, Mesh_unif_get_vb_root_wposy } from "../../../Core/MeshUniformsBuffer.js";
import { Vertex_buffer_set_uniform_value_callback, Vertex_buffer_set_and_update_uniform, Vertex_buffer_group_remove_scissorbox } from "../../../../Graphics/Buffers/VertexBuffers.js";
import { Uniforms_buffer_find_ubidx_from_name } from "../../../../Graphics/Buffers/UniformBuffers.js";
import { Scoller_component_destroy } from "../../Widgets/ScrollerComponent.js";
import { View_remove_view } from "../../../Core/Views/MeshBufferViews.js";
import { CopyMat4 } from "../../../../Helpers/Math/MathOperations.js";
import { Program_store_shader_operations } from "../../../../Graphics/ShaderPrograms.js";
import { Sid_check_unif_match_sids, State_mesh_reset } from "../../../../GlobalFunctions.js";
import { Mesh_get_name } from "../../Operations/MeshPropertiesFunctions.js";



const NOTIFICATIONS_ON = true;

/** SAMPLE
 class BitMask {
 
    mask;
    constructor() { this.mask = 1 | 0; }
    set(channel) { this.mask = (1 << channel | 0) >>> 0; }
    enable(channel) { this.mask |= 1 << channel | 0; }
    enableAll() { this.mask = 0xffffffff | 0; }
    toggle(channel) { this.mask ^= 1 << channel | 0; }
    disable(channel) { this.mask &= ~(1 << channel | 0); }
    disableAll() { this.mask = 0; }
    test(layers) { return (this.mask & layers.mask) !== 0; }
    isEnabled(channel) { return (this.mask & (1 << channel | 0)) !== 0; }
}
*/




export class Mesh {

    /**
     * // TODO: Organize all function callbacks to an object
     * // TODO: Organize all buffers to an object
     */


    // Bit masks and single values
    sid;        // BitField: Shader Program Unique Identifier
    type;       // BitField: All different class types of this mesh. 
    state;      // BitField: Mesh state. 
    event_flags;// Bitfield: Event flags
    gfx_pool_request;  // BitField: 

    gfx_ctx_flags;     // BitField: Help on choosing the gfx buffers conditionaly 
    gfx_ctx_parent;     // Value: The index of the parent from which to start search mesh tree for finding gfx context 

    align;           // Struct: Variables to define mesh's alignment


    // IMPORTANT: If the mesh is a root mesh: direct child of the scene, then the idx is a refference to the scene's mesh buffer. Else if mesh has parent another mesh, then the idx is the index of the parent's children buffer
    idx;        // Value: This is the index of the mesh in the parents's children buffer.
    sceneidx;   // Value: An index to the scene that the mesh belongs to(index only).
    fbidx;      // Value: The framebuffer index that this mesh is reb=ndered to. If INT_NULL the mesh is rendered to the default gl output buffer. 
    root_bufferidx; // Value: This is the index of the mesh in the Widget_root_buffer storage.
    per_vb_bufferidx;  // Value. Index of the msh inside the Gfx Buffer.
    mesh_bufferidx; // Value: This is the index of the mesh in the Mesh_Buffer storage.
    batch_buffer_vbidx; // Value: This is the index of the mesh in the Widget_root_batch_buffer storage.
    group_bufferidxs; // Array[3]: The [0] is the index of the group in the group buffer. The [1] is the index to the elem of the array representing the vertex buffer of this mesh, and [2] is the index of the buffer this mesh's index is stored to. 

    parent;     // Pointer: to the parent mesh.
    children;   // Buffer: of pointers to children mesh.

    geom;   // Class: Geometry: position, dimentions, ...
    mat;    // Class: Material: color, texture coordinates, ...
    gfx;    // Class: Graphics: start index, attributes count, vertexbuffer, shader program, ...

    is_gfx_inserted; // Bool: A way to tell if the mesh has been inserted to the graphics buffers.
    isFramebufferRendered; // Value: Stores the index of the framebuffer the mesh is rendered to. Else INT_NULL for no framebuffer rendering for this mesh.

    uniforms;   // Array: Uniform info: {name, type, flags}. It is set only for mesh that is the first mesh for a Program to be created
    shader_ops_idxs; // Array: An array to store indexes. These indexes are part of a Shader's Program.shader_ops array. 

    listeners;      // Buffer: Indexes to the EventListeners class.
    event_clbks; // Buffer: A buffer to store all callbacks, for any event enabled for the mesh.
    current_event_callback_idx; // Index: A way to choose between different event callback functions.
    timeIntervalsIdxBuffer; // Buffer: This buffer stores indexes of the timeIntervals this mesh is using.

    rel_comp; // A component to position this mesh's children relative to the position of one of 'LEFT-CENTER-RIGHT' and relative all other children's position
    root_posidx; // An index to the root position buffer. 

    scroller_comp;  // Pointer to scroller mesh.
    scroller_comp_idx;  // An index to scroller buffer.
    children_scrollers_buffer; // A buffer to store all scrollers this mesh is the root for. (For Move() functionality etc) 
    has_children_scrollers; // A quick way to check if any children scroller exists
    components;     // BitField: Type of 'COMPONENTS'. // TODO: Later implement more components other than scrollers.

    debug_info;         // Struct: Debug_info_ui.
    minimized;          // Pointer: to a minimized version of the mesh.
    menu_options;       // Struct: A callback and an index. Constructs the options popup menu for the mesh
    menu_options_idx;   // Value: An index to the menu options handler's buffer

    name; // String:
    nameidx; // Index to Str buffer:


    constructor(geom = null, mat = null) {

        this.geom = geom;
        this.mat = mat;


        this.sid = {
            shad: SID.SHAD.INDEXED | (this.geom.sid.shad | this.mat.sid.shad),
            attr: (this.geom.sid.attr | this.mat.sid.attr),
            inst: (this.geom.sid.inst | this.mat.sid.inst),
            unif: this.mat.sid.unif,
            pass: (this.geom.sid.pass | this.mat.sid.pass | SID.ATTR.COL4),
            shad_ops: 0x0,
            fx: 0x0,
            blend_options: 0x0,
        };


        this.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        this.gfx_ctx_parent = INT_NULL;


        this.shader_ops_idxs = New_int8_buffer(8, 'Mesh.shader_ops_idxs');
        this.uniforms = [];
        


        this.type = MESH_TYPE.MESH;
        this.state = { mask: MESH_STATE_FLAGS.ACTIVE }; // Unfortunately js cannot create a pointer for integers, so we have to wrap the mask to a class;
        this.gfx_pool_request = GFX_POOL_REQUESTS.ANY;


        this.gfx = null;
        this.is_gfx_inserted = false;
        this.isFramebufferRendered = INT_NULL;

        this.idx = INT_NULL;
        this.sceneidx = STATE.scene.active_idx;
        this.fbidx = INT_NULL; // This should render the current mesh to the default gl framebuffer. 
        this.mesh_bufferidx = INT_NULL;
        this.root_bufferidx = INT_NULL;
        this.per_vb_bufferidx = INT_NULL;
        this.group_bufferidxs = [INT_NULL, INT_NULL, INT_NULL];
        this.nameidx = INT_NULL;

        this.align = {
            flags: LAYOUT.HORIZONTAL, // SEE: LAYOUT constant
            pad_x: 0,
            pad_y: 0,
            margin_x: 0,
            margin_y: 0,
            margin_y: 0,
            row: 0, // Value of the current meshe's row. Set by Align_ functions, based on mesh's .VERTICAL align flag.
        };

        this.parent = null;

        this.listeners = null;

        this.event_clbks = null;
        this.event_clbks_resolve_fn = null;
        this.current_event_callback_idx = INT_NULL;
        this.children = New_generic_buffer(_, 'Mesh children');
        this.timeIntervalsIdxBuffer = New_int8_buffer(INTERVALS.SIZE, 'Mesh time_intervals');

        this.rel_pos = [0, 0];

        this.rel_comp = null;
        this.root_posidx = INT_NULL;
        this.scroller_comp = null;
        this.scroller_comp_idx = INT_NULL;
        this.children_scrollers_buffer = New_int16_buffer(_, 'Mesh children_scrollers_buffer');
        this.has_children_scrollers = false;


        this.styles = Styles_create();
        this.clamp = [0, [0, 10000, DEFAULT_CLAMP_THRESHOLD]]; // TODO: do the same for the clamx too

        this.EnableGfxUniforms({ unif: SID.UNIF.PROJECTION_MATRIX }, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);
        this.EnableGfxUniforms({ unif: SID.UNIF.SCREEN_RESOLUTION }, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
        


        // IMIDIATELY: the .data is used only 3 times by DebugInfoUi.js. Same with .evtidx field. So maybe those 2 are separated to the DebugInfoUi.js file
        this.debug_info = {
            type: 0x0, // Bit mask for distinguish the infoListener listening to that event type
            data: null, // Some storage for any kind of data
            evtidx: INT_NULL, // Stores the index of the events in the Info_Listeners buffer.
        };

    }

    /** */
    RemoveChildByIdx(idx) {

        this.children.RemoveByIdx(idx);
        const ret = this.children.ShiftElementOnDestroy(idx);

        let msg = `remove index: ${idx}. empty children:`;
        let print_res = false;
        for (let i = 0; i < this.children.boundary; i++) {
            if (this.children.buffer[i] === null) {
                msg += `${i},`
                print_res = true
            }
        }

        if (print_res) console.log(msg)
        return ret
    }
    /** */
    Destroy() {
        // console.log('DSTROY-Mesh class:', this.GetName())

        /*************************************************************************************/
        // Remove event listeners
        if (this.listeners) {
            this.RemoveAllListenEvents();
            Free_generic_buffer(this.listeners);
            // this.listeners = null;
        }




        /*************************************************************************************/
        // Remove time intervals
        if (this.timeIntervalsIdxBuffer.active_count) {
            for (let i = 0; i <= this.timeIntervalsIdxBuffer.boundary; i++) {
                const intervalIdx = this.timeIntervalsIdxBuffer.buffer[i];
                if (intervalIdx !== INT_NULL) {
                    Time_intervals_destroy_byidx(intervalIdx);
                    this.timeIntervalsIdxBuffer.RemoveByIdxNoGapsVersion(i);
                }
            }
        }




        // Styles_batch_destroy_store(this.styles);
        // BUG: There seems to be a bug in the removal of the styles from the M_Buffer, so as to the '.active_count' isn't incremented/Decremented correctly
        if (NOTIFICATIONS_ON && (this.type & MESH_TYPE.DEBUG_MESH) === 0)
            Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.DESTROY, this.mesh_bufferidx);




        /*************************************************************************************/
        // Destroy any scrollers
        if (this.scroller_comp) {

            Scoller_component_destroy(this.scroller_comp);
            Vertex_buffer_group_remove_scissorbox(this.gfx.vb.groupidx);
            this.scroller_comp = null;

            // In order 'this' will be removed from the mesh_buffer, needs to have no scrollers enebled
            this.components = 0x0;
        }




        /*************************************************************************************/
        // Remove from any View
        if (this.group_bufferidxs[0] !== INT_NULL) {

            View_remove_view(this.group_bufferidxs);
            this.group_bufferidxs[0] = INT_NULL;
            this.group_bufferidxs[1] = INT_NULL;
            this.group_bufferidxs[2] = INT_NULL;

        }



        // console.log('{{{MESH DESTROY}}}',this.mesh_bufferidx,  this.GetName())

        /*************************************************************************************/
        // Remove from gfx buffers.

        // A mesh maybe active buut not inserted in vertex buffer
        if (this.is_gfx_inserted && this.state.mask & MESH_STATE_FLAGS.ACTIVE) {


            /* DO NOT DELETE: dealing with text meshes */
            // if (this.type & (MESH_TYPE.WIDGET_TEXT | MESH_TYPE.WIDGET_TEXT_DYNAMIC | MESH_TYPE.TEXT_MESH)) { // Case it is a text mesh, for destroy we must pass the whole string length, not just the renderable
            //     // Gfx_pool_remove_geometry(this.gfx, this.mat.temp_max_chars_inserted_in_gfx, _, this);
            //     Gfx_pool_remove_geometry(this.gfx, this.geom.num_faces, _, this);
            // }
            // else {
            //     Gfx_pool_remove_geometry(this.gfx, this.geom.num_faces, _, this);
            // }

            Gfx_pool_remove_geometry(this.gfx, this.geom.num_faces, _, this);

        }

        Mesh_per_vb_remove_mesh(this.gfx.vb.groupidx, this.per_vb_bufferidx)



        /**
         * Case 'this' is a child, remove it from parent's children buffer.
         * Because this function probably is called by the parent's 'Destroy()' function, 
         * if we remove the 'this' in here, then we must notify parent so as not to reduce it's children count.
         */
        let shift_children = false; // The caller will reduce the i from the loop by 1.
        if (this.parent && this.parent !== NO_MESH_PARENT && this.idx !== INT_NULL) {
            shift_children = this.parent.RemoveChildByIdx(this.idx); // Remove the current mesh from the parent
        }




        /*************************************************************************************/
        // Remove from widget root buffer.
        if ((this.components & COMPONENTS.SCROLLER) === 0) Mesh_buffer_remove_mesh_byidx(this.mesh_bufferidx, this.root_bufferidx);
        else alert()

        // Destroy Generic Buffers
        if (this.event_clbks) Free_generic_buffer(this.event_clbks);
        Free_generic_buffer(this.children);
        Free_int8_buffer(this.timeIntervalsIdxBuffer);
        Styles_remove_byidx(this.styles);
        this.gfx.Destroy();
        if (this.rel_comp) this.rel_comp.Destroy();

        if (this.mat.char_buffer) Free_generic_char_buffer(this.mat.char_buffer)




        /*************************************************************************************/
        // Remove mesh from STATE.
        State_mesh_reset(this);


        return shift_children;
    }
    /** Destoys only alocated buffers by the Mesh */
    DestroyAlocatedBuffers() {

        /*************************************************************************************/
        if (this.listeners) this.listeners = Free_generic_buffer(this.listeners);
        if (this.event_clbks) this.event_clbks = Free_generic_buffer(this.event_clbks);
        if (this.mat.char_buffer) this.mat.char_buffer = Free_generic_char_buffer(this.mat.char_buffer)
        if (this.children) this.children = Free_generic_buffer(this.children);


        // IMPORTANT!!! Why the timeIntervalsIdxBuffer is undefined???? Where does timeIntervalsIdxBuffer gets undefined??? 
        if (this.timeIntervalsIdxBuffer !== undefined) this.timeIntervalsIdxBuffer = Free_int8_buffer(this.timeIntervalsIdxBuffer);
        // IMPORTANT! Same happens with children_scrollers_buffer
        if (this.children_scrollers_buffer !== undefined) this.children_scrollers_buffer = Free_int16_buffer(this.children_scrollers_buffer);

        this.gfx.Destroy();
        Free_int8_buffer(this.shader_ops_idxs);
        // if (this.rel_comp) this.rel_comp.Destroy();

    }







    /*******************************************************************************************************************************************************/
    // Listeners
    /*******************************************************************************************************************************************************/

    /** */
    // TODO: Just replace all '.CreateListenEvent()' calls or implement the new way via 'Widget_gfx_
    CreateListenEvent(etype, is_fake_event = false) {

        if (!this.listeners) {
            this.listeners = New_generic_buffer(_, 'Mesh-Listeners');
            this.listeners.Init(LISTEN_EVENT_TYPES_INDEX.SIZE);
        }

        if (etype & LISTEN_EVENT_TYPES.HOVER) {

            this.listeners.AddAtIndex(E.H, INT_NULL);

            this.state.mask |= (MESH_STATE_FLAGS.IS_HOVERABLE | MESH_STATE_FLAGS.IS_HOVER_COLORABLE);
            this.event_flags |= LISTEN_EVENT_TYPES.HOVER;

            if (is_fake_event) this.state.mask |= (MESH_STATE_FLAGS.IS_FAKE_EVENT | MESH_STATE_FLAGS.IS_FAKE_HOVERABLE);

        }
        if (etype & LISTEN_EVENT_TYPES.CLICK_UP) {

            this.listeners.AddAtIndex(E.C, INT_NULL)

            this.state.mask |= (MESH_STATE_FLAGS.IS_CLICKABLE);
            this.event_flags |= LISTEN_EVENT_TYPES.CLICK_UP;

            if (is_fake_event) this.state.mask |= (MESH_STATE_FLAGS.IS_FAKE_EVENT | MESH_STATE_FLAGS.IS_FAKE_CLICKABLE);

        }
        if (etype & LISTEN_EVENT_TYPES.MOVE) {

            this.listeners.AddAtIndex(E.C, INT_NULL);

            this.state.mask |= (MESH_STATE_FLAGS.IS_GRABABLE | MESH_STATE_FLAGS.IS_MOVABLE | MESH_STATE_FLAGS.IS_CLICKABLE);
            this.event_flags |= LISTEN_EVENT_TYPES.MOVE;

            if (is_fake_event) this.state.mask |= (MESH_STATE_FLAGS.IS_FAKE_EVENT | MESH_STATE_FLAGS.IS_FAKE_CLICKABLE);

        }

    }
    // Either the 'parent_event' is legit if we pass it or null, so just check if is NOT INT_NULL
    /** */
    // AddListenEvent(etypeidx, Clbk = null, params = null) {

    //     if (this.listeners.buffer[etypeidx] !== INT_NULL) return;
    //     if ((this.state.mask & MESH_STATE_FLAGS.ACTIVE) === 0x0) {
    //         // console.error('0198815 \nMesh is INACTIVE to add a listen event \n', this.GetName());
    //         return;
    //     }


    //     const is_fake = (this.state.mask & MESH_STATE_FLAGS.IS_FAKE_EVENT) ? true : false;
    //     this.listeners.buffer[etypeidx] = Listener_create_child_event(etypeidx, this.mesh_bufferidx, Clbk, params, is_fake);
    // }
    // Either the 'parent_event' is legit if we pass it or null, so just check if is NOT INT_NULL
    /** */
    // ChangeListenEvent(etypeidx, Clbk = null, params = null) {

    //     if (this.state.mask & MESH_STATE_FLAGS.ACTIVE) { // HERE: see if can remove check

    //         Listener_change_child_event(etypeidx, this.listeners.buffer[etypeidx], Clbk, params);
    //     }
    // }
    // /** */
    // RemoveAllListenEvents() {

    //     if (!this.listeners) return;

    //     for (let i = 0; i <= this.listeners.boundary; i++) {

    //         if (this.listeners.buffer[i] !== null && this.listeners.buffer[i] !== INT_NULL) {
    //             Listener_remove_event_by_idx(i, this.listeners.buffer[i]);
    //             this.listeners.buffer[i] = INT_NULL;
    //         }
    //     }
    // }
    /** */
    // CreateEventCallback(params = null, event_clbks_resolve_fn = null) {

    //     if (!params) alert('CreateEventCallback(params = null). @ Mesh.js')
    //     if (this.event_clbks === null) this.event_clbks = New_generic_buffer(_, 'Mesh event_clbks');

    //     // Automaticaly enable event callback if the first event callback is activated. 
    //     // For the rest of the callback events, the user is responsible to set the current active by setting current_event_callback_idx
    //     const evt_clbk_idx = this.event_clbks.Add(params);
    //     if (evt_clbk_idx === 0) this.current_event_callback_idx = evt_clbk_idx;

    //     // User created function to resolve the event callback
    //     if (event_clbks_resolve_fn) this.event_clbks_resolve_fn = event_clbks_resolve_fn;
    //     return evt_clbk_idx;
    // }







    /*******************************************************************************************************************************************************/
    // Transformations   Setters-Getters
    /*******************************************************************************************************************************************************/

    /** */
    SetColorRGB(col) { this.SetUpdateFrameBuffer(); this.mat.SetColorRGB(col, this.gfx, this.geom.num_faces); }
    /** */
    SetColorAllRGB(col) { this.SetUpdateFrameBuffer(); this.mat.SetColorAllRGB(col, this.gfx, this.geom.num_faces); }
    /** */
    SetColorRGBA(col) { this.SetUpdateFrameBuffer(); this.mat.SetColorRGBA(col, this.gfx, this.geom.num_faces); }




    /** */
    StylesGetMargin(axis = STYLES.AXIS.ALL) { return Styles_margin_get(axis, this.styles); }
    /** */
    StylesGetHoverMargin(axis = STYLES.AXIS.ALL) { return Styles_hover_margin_get(axis, this.styles); }
    /** */
    StylesGetPad(axis = STYLES.AXIS.ALL) { return Styles_pad_get(axis, this.styles); }
    /** */
    StylesSetMargin(margin) { Styles_margin_set(this.styles, margin); }
    /** */
    StylesSetHoverMargin(margin) { Styles_hover_margin_set(this.styles, margin); }
    /** */
    StylesSetPad(pad) { Styles_pad_set(this.styles, pad); }
    /** */
    StylesSetPadX(pad_x) { Styles_pad_x_set(this.styles, pad_x); }
    /** */
    StylesSetPadY(pad_y) { Styles_pad_y_set(this.styles, pad_y); }

    /** */
    SetUpdateFrameBuffer() {
        if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
    }


    /**
     * Enable shader properties.
     * In order for a mesh to be drawn in a certain way, specific shaders must be build.
     * Allow the shader constructor to combine different shaders by enabling meshes 'sid' bit field. 
    */
    EnableGfxOperations(function_operation, blend_mode = SID.BLEND_OPTIONS.BLEND_MODE_ADD) {

        this.sid.shad_ops |= function_operation;
        // console.log(this.shader_ops_idxs)
        // console.log(function_operation)
        this.shader_ops_idxs.Add(Program_store_shader_operations(function_operation, blend_mode));

        if ((function_operation & SID.SHADER_OPERATIONS.GROUP_SDF_RECT) && (this.sid.shad_ops & SID.SHADER_OPERATIONS.SDF_RECT) === 0) {
            console.error('Shader Operation detected: Need SDF_RECT to function.');
            alert('Shader Operation detected: Need SDF_RECT to function.');
        }

        if (function_operation & SID.SHADER_OPERATIONS.DIST_RECT_FILLED) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
        }
        if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
        }
        if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW2) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
        }
        if (function_operation & SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
        }
        if (function_operation & SID.SHADER_OPERATIONS.BUBBLE) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
        }
        if (function_operation & SID.SHADER_OPERATIONS.FLARE) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
        }
        if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
        }
        if (function_operation & SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
        }
        if (function_operation & SID.SHADER_OPERATIONS.OUTER_GLOW_RECT) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
        }
        if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2);
            // this.GfxEnableAttr(SID.ATTR.DIM2); // Enable attribute and store attribs value to cuurrent mesh
            // this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.VPOS2 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
        }
        if (function_operation & SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
        }
        if (function_operation & SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2) {
            this.GfxEnableAttr(SID.ATTR.DIM2);
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2)
        }

    }
    /** */
    GfxEnableAttr(flags, params) {

        if (flags & SID.ATTR.DIM2) { this.sid.attr |= SID.ATTR.DIM2; }
        if (flags & SID.ATTR.TEX2) { this.sid.attr |= SID.ATTR.TEX2; }
        if (flags & SID.ATTR.ANGLE) { this.sid.attr |= SID.ATTR.ANGLE; }
        if (flags & SID.ATTR.TIME) { this.sid.attr |= SID.ATTR.TIME; }
        if (flags & SID.ATTR.GENERIC2) { this.sid.attr |= SID.ATTR.GENERIC2; }
        if (flags & SID.ATTR.R_CORNERS) { this.sid.attr |= SID.ATTR.R_CORNERS; }
        if (flags & SID.ATTR.COL4_PER_VERTEX) this.sid.attr |= SID.ATTR.COL4_PER_VERTEX;

        if (params) {

            if (params.time) { this.geom.time = params.time; }
            if (params.generic) { this.geom.generic = params.generic; }
            if (params.rcorners) this.mat.style.rcorners = params.rcorners;
            if (params.col4_per_vertex) { this.mat.col = params.col4_per_vertex; }
        }

    }
    /** */
    GfxPassAttr(flags) {

        if (flags & SID.ATTR.VPOS2) this.sid.pass |= SID.ATTR.VPOS2;
        if (flags & SID.ATTR.DIM2) { this.sid.pass |= SID.ATTR.DIM2; }
        if (flags & SID.ATTR.WPOS2) this.sid.pass |= SID.ATTR.WPOS2;
        if (flags & SID.ATTR.WPOS3) this.sid.pass |= SID.ATTR.WPOS3;
        if (flags & SID.ATTR.TEX2) { this.sid.pass |= SID.ATTR.TEX2; }
        if (flags & SID.ATTR.RES2) this.sid.pass |= SID.ATTR.RES2;
        if (flags & SID.ATTR.TIME) { this.sid.pass |= SID.ATTR.TIME; }
        if (flags & SID.ATTR.ANGLE) { this.sid.pass |= SID.ATTR.ANGLE; }
        if (flags & SID.ATTR.R_CORNERS) { this.sid.pass |= SID.ATTR.R_CORNERS; }
        if (flags & SID.ATTR.GENERIC2) { this.sid.pass |= SID.ATTR.GENERIC2; }
        if (flags & SID.ATTR.COL4_PER_VERTEX) { this.sid.pass |= SID.ATTR.COL4_PER_VERTEX; }

    }
    /**
     * 
     * @param {SEE global var: SID:{BLEND_OPTIONS}} blend_flags 
     */
    GfxEnableBlend(blend_flags) {
        this.sid.blend_options |= blend_flags;
    }
    /** */
    GfxEnableFn(flags, params) {

        // Enable shader function calls (from shader main())
        if (flags === SID.SHAD.FN_GLOW) {
            const param = { // Create default attribs values
                time: params.time !== undefined ? params.time : 0,
            };
            this.sid.shad |= SID.SHAD.FN_GLOW;
            this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
            this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
        }
        // TODO: See if attr enable and passes are required, It seems NOT
        if (flags === SID.SHAD.FN_INNER_SHADOW) {
            this.sid.shad |= SID.SHAD.FN_INNER_SHADOW;
            this.GfxEnableAttr(SID.ATTR.DIM2,); // Enable attribute and store attribs value to cuurrent mesh
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
        }
        if (flags === SID.SHAD.FN_EXPLOSION_CIRCLE) {
            const param = { // Create default attribs values
                time: params.time !== undefined ? params.time : 0,
                generic: params.generic !== undefined ? params.generic : { a: 1, b: 1 },
            };
            this.sid.shad |= SID.SHAD.FN_EXPLOSION_CIRCLE;
            this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2, param); // Enable attribute and store attribs value to cuurrent mesh
            this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.GENERIC2 | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
        }
        if (flags === SID.SHAD.FN_EXPLOSION_GLOW) {
            const param = { // Create default attribs values
                time: params.time !== undefined ? params.time : 0,
                generic: params.generic !== undefined ? params.generic : { a: 1, b: 1 },
            };
            this.sid.shad |= SID.SHAD.FN_EXPLOSION_GLOW;
            this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME | SID.ATTR.GENERIC2, param); // Enable attribute and store attribs value to cuurrent mesh
            this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.GENERIC2 | SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
        }
        if (flags === MESH_ENABLE.GFX.FN_GLOW_SPHERE) {
            this.sid.shad |= SID.SHAD.FN_GLOW_SPHERE;
            this.GfxEnableAttr(SID.ATTR.DIM2,); // Enable attribute and store attribs value to cuurrent mesh
            this.GfxPassAttr(SID.ATTR.WPOS3 | SID.ATTR.DIM2,); // Enable pass of the attributes to fragment shader
        }
        if (flags === SID.SHAD.FN_NOISE) {
            const param = { // Create default attribs values
                time: params.time !== undefined ? params.time : 0,
            };
            this.sid.shad |= SID.SHAD.FN_NOISE;
            this.GfxEnableAttr(SID.ATTR.DIM2 | SID.ATTR.TIME, param); // Enable attribute and store attribs value to cuurrent mesh
            this.GfxPassAttr(SID.ATTR.TIME | SID.ATTR.DIM2 | SID.ATTR.WPOS3,); // Enable pass of the attributes to fragment shader
        }
        if (flags === SID.SHAD.FN_NOISE_WORLEY_1) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_1; }
        if (flags === SID.SHAD.FN_NOISE_WORLEY_2) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_2; }
        if (flags === SID.SHAD.FN_NOISE_WORLEY_3_TYPES) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_3_TYPES; }
        if (flags === SID.SHAD.FN_NOISE_WORLEY_3D) { this.sid.shad |= SID.SHAD.FN_NOISE_WORLEY_3D; }
        if (flags === SID.SHAD.FN_NOISE_VORONOI_1) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_1; }
        if (flags === SID.SHAD.FN_NOISE_VORONOI_2) { this.sid.shad |= SID.SHAD.FN_NOISE_VORONOI_2; }

        if (params !== undefined) {
            if (params.blend_mode !== undefined) {
                this.sid.blend_options |= params.blend_mode;
            }
        }

        // TODO
        // case MESH_ENABLE.GFX.BLEND_OPTIONS: { if (params === null) alert('BLEND_OPTIONS MUST be passed in the params'); this.sid.blend_options |= params; break; }
        // case MESH_ENABLE.GFX.TEST_SHADERS_1: { this.sid.shad |= SID.SHAD.FS_TEST1; this.sid.shad |= SID.SHAD.FS_TEST1; break; }
        // case MESH_ENABLE.GFX.TEST_SHADERS_2: { this.sid.shad |= SID.SHAD.FS_TEST2; this.sid.shad |= SID.SHAD.FS_TEST2; break; }
        // case MESH_ENABLE.GFX.TEST_SHADERS_3: { this.sid.shad |= SID.SHAD.FS_TEST3; this.sid.shad |= SID.SHAD.FS_TEST3; break; }
        // case MESH_ENABLE.GFX.TEST_SHADERS_4: { this.sid.shad |= SID.SHAD.FS_TEST4; this.sid.shad |= SID.SHAD.FS_TEST4; break; }
    }
    /** */
    EnableGfxUniforms(flags = 0x0, name, type, shader_flags, arr_size = 0) {


        /**
         * How to set up a uniform:
         * 1. Call this, with uniform name and a gl:SID.UNIF. the type of uniform to enable.
         *      This means that the user is responsible to add any new uniform type in 'SID' global object.
         *      That is so we can check and enable code in the shader builder. 
         * 2. We need to bind the 'Set' and 'Update' functions for the uniforms to be usefull.
         *      . For the block uniforms, we only need to 'Set' the value via 'Uniforms_block_set_uniform()' 
         *          function, the Update happens by gl.bindBuffer.
         *      . For individual uniforms, both 'Set' and 'Update' must be bound via 'Program_uniform_bind()' function.
         *          Use the 'Program_uniform_bind' and not 'Uniforms_bind...' Because the uniform update uses only a 'loc', 
         *          this might lead to unwilingly updating same loc of another program's uniform. 
         */

        if (flags) {

            if (flags.unif) this.sid.unif |= flags.unif;
            if (flags.pass) this.sid.pass |= flags.pass;
            // if (flags.fx) this.sid.fx |= flags.fx;
        }

        // Avoid duplicates
        const len = this.uniforms.length;
        let skip = false;
        for (let i = 0; i < len; i++) {
            if (this.uniforms[i].name === name)
                skip = true;
        }

        if (!skip) {
            this.uniforms.push({
                name: name,
                type: type,
                ubidx: INT_NULL, // Should be set by the Gl Program creation. So the first mesh that will push to create the program will have the ubidx
                shader: shader_flags,
                arr_size: arr_size,
            });
        }

    }
    /** */
    SetClbkGfxUniforms(unif_name, Clbk, clbk_params) {

        // Find uniform
        const len = this.uniforms.length;
        let found_idx = INT_NULL;
        for (let i = 0; i < len; i++) {
            if (this.uniforms[i].name === unif_name) {
                found_idx = i;
                break;
            }
        }

        if (found_idx !== INT_NULL) {

            if (this.uniforms[found_idx].ubidx === INT_NULL) {

                // console.error('ubidx is INT_NULL. SEE if the uniform of this mesh has already been initialized for the vertex buffer.');

                this.uniforms[found_idx].ubidx = Uniforms_buffer_find_ubidx_from_name(this.uniforms[found_idx].name, this.gfx.vb.groupidx)

                if (this.uniforms[found_idx].ubidx === INT_NULL) {
                    // alert('51998712223 \nUniform Not Found')
                    return;
                }
            }

            // this.uniforms[found_idx].vertex_buffer_store_idx = Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx);
            Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx, this.uniforms[found_idx].name);
            return;
        }


        // Alert if the current mesh system does not have the uniform enabled.
        console.error('No Uniform ', unif_name, ' found for mesh:', Mesh_get_name(this));
        if (Sid_check_unif_match_sids(this.sid.unif, unif_name) === true) {

            alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js\nSEE ERROR')
        }


    }
    /** */
    GfxUniformSetAndUpdate(unif_name, value, value_idx = null) {

        /**ERROR */ if (this.gfx === null) alert('Try to update uniform before mesh has gfx.')

        const len = this.uniforms.length;
        for (let i = 0; i < len; i++) {
            if (this.uniforms[i].name === unif_name) {
                const ubidx = this.uniforms[i].ubidx;
                if (ubidx === INT_NULL) {


                    console.error('334334334334 ubidx is null.',
                        '\nPossible error: mesh is not the root mesh of the vertex buffer, and there is no ubidx store that is why ubidx is null',
                        '\nuniform name', unif_name,
                        '\nubidx', ubidx,
                        '\nmesh all uniforms', this.uniforms,

                    )
                    alert('334334334334 ubidx is null. Check if mesh is the root mesh of the vertex buffer')
                }
                Vertex_buffer_set_and_update_uniform(this.gfx.vb.groupidx, ubidx, value, value_idx);
                break;
            }
        }
    }

    /** */
    AddChildScrollerIdx(scroller_comp_idx) {
        /**
         * In order for a root widget to have access to all scrollers of any of it's children meshes,
         * we need a storage buffer to store all scrollers indexes.
         * The use is for example moving the root, then all scrollers must move.
         */
        this.children_scrollers_buffer.Add(scroller_comp_idx);
        this.has_children_scrollers = true;
    }

}



