"use strict";
import { Timer_get_global_timer } from "../../../Timers/Timers.js";
import { TimeIntervalsDestroyByIdx } from "../../../Timers/TimeIntervals.js";
import { Free_generic_buffer, Free_generic_char_buffer, New_generic_buffer, New_int8_buffer } from "../../../Core/Buffers.js";
import { Gl_set_wpos_time } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Listener_create_child_event, Listener_remove_event_by_idx } from "../../../Events/EventListeners.js";
import { Mesh_buffer_remove_mesh_byidx } from "../../../Core/MeshBuffer.js";
import { Str_buffer_mesh_names_get_by_idx, Str_buffer_mesh_names_store } from "../../../Core/StringBuffer.js";
import { Gfx_pool_remove_geometry } from "../../../Interfaces/Gfx/GfxPool.js";
import { Styles_create, Styles_destroy, Styles_hover_margin_get, Styles_hover_margin_set, Styles_margin_get, Styles_margin_set, Styles_pad_get, Styles_pad_set } from "../../../Styles.js";
import { NOTIFICATION_TYPE, Notifications_send } from "../../DebugInfo/DebugInfoUiNotifications.js";
import { Mesh_unif_get_vb_root_wpos, Mesh_unif_get_vb_root_wposx, Mesh_unif_get_vb_root_wposy } from "../../../Core/MeshUniformsBuffer.js";
import { Vertex_buffer_set_uniform_value_callback } from "../../../../Graphics/Buffers/VertexBuffers.js";



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




let _meshId = 0;
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
    alignment;  // BitField: Control this mesh's children alignment.
    gfx_pool_request;     // BitField: 


    hover_margin; // Value: A margin to be set for hovering. // TODO: Abstract to a struct.
    styles; // Array: Indexes to style_buffer, for margin, pdding, etc


    // IMPORTANT: If the mesh is a root mesh: direct child of the scene, then the idx is a refference to the scene's mesh buffer. Else if mesh has parent another mesh, then the idx is the index of the parent's children buffer
    idx;        // Value: This is the index of the mesh in the parents's children buffer.
    sceneidx;   // Value: An index to the scene that the mesh belongs to(index only).
    // scene_rootidx; // Value: An index that stores the mesh's location in a scene root_meshes[] buffer.
    fbidx;      // Value: The framebuffer index that this mesh is reb=ndered to. If INT_NULL the mesh is rendered to the default gl output buffer. 
    root_bufferidx; // Value: This is the index of the mesh in the Widget_root_buffer storage.
    per_vb_bufferidx;  // Value. Index of the msh inside the Gfx Buffer.
    batch_fnidx; // Value: An index to the batch buffer of function pointers
    mesh_bufferidx; // Value: This is the index of the mesh in the Mesh_Buffer storage.
    batch_buffer_vbidx; // Value: This is the index of the mesh in the Widget_root_batch_buffer storage.
    batchidx;   // Value: An index to the mesh refference in the batch buffer. 
    group_bufferidxs; // Array[3]: The [0] is the index of the group in the group buffer. The [1] is the index to the elem of the array representing the vertex buffer of this mesh, and [2] is the index of the buffer this mesh's index is stored to. 

    parent;     // Pointer: to the parent mesh.
    children;   // Buffer: of pointers to children mesh.
    // children_all; // Indexes of mesh's all children (active and inactive).. Indexes to MeshBuffer storage buffer. // TODO: Try not to use. If succeded, remove variable
    // children_removed; // Indexes of mesh's removed children. Indexes to MeshBuffer storage buffer. // TODO: Try not to use. If succeded, remove the variable

    geom;   // Class: Geometry: position, dimentions, ...
    mat;    // Class: Material: color, texture coordinates, ...
    gfx;    // Class: Graphics: start index, attributes count, vertexbuffer, shader program, ...

    // is_batched_temp; // Bool: A way to tell if the mesh has been set to update in the batch buffer.
    is_gfx_inserted; // Bool: A way to tell if the mesh has been inserted to the graphics buffers.
    isFramebufferRendered; // Value: Stores the index of the framebuffer the mesh is rendered to. Else INT_NULL for no framebuffer rendering for this mesh.

    // attrParams1; // Array: A vec4 array which a mesh can pass any values to the shaders.
    uniforms;   // Array: Uniform info: {name, type, flags}. It is set only for mesh that is the first mesh for a Program to be created

    listeners;      // Buffer: Indexes to the EventListeners class.
    eventCallbacks; // Buffer: A buffer to store all callbacks, for any event enabled for the mesh.
    timedEvents;    // Buffer: A buffer to set a one time event that is triggered by another event. E.x. When we need to set the mesh priority in the renderQueue and the mesh does not have a gfx yet. 
    timeIntervalsIdxBuffer; // Buffer: This buffer stores indexes of the timeIntervals this mesh is using.

    rel_comp; // A component to position this mesh's children relative to the position of one of 'LEFT-CENTER-RIGHT' and relative all other children's position
    root_posidx; // An index to the root position buffer. 

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
            pass: (this.geom.sid.pass | this.mat.sid.pass | SID.PASS.COL4),
            gfx_group: GFX_GROUPS.DEFAULT.MASK, // To denote if the curent mesh is used for debug, so it uses specific gfx buffers for debug ui rendering.
        };



        this.uniforms = [];
        if (APP.ENABLE_SHADER_PROJECTION_MATRIX)
            this.EnableGfxUniforms(SID.UNIF.PROJECTION_MATRIX, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);
        
        
        if (APP.ENABLE_SHADER_WPOS_UNIFORM)
            this.EnableGfxUniforms(SID.UNIF.WPOS4, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);




        this.type = MESH_TYPE.MESH;
        this.state = { mask: MESH_STATE.ACTIVE }; // Unfortunately js cannot create a pointer for integers, so we have to wrap the mask to a class;
        // this.state = { mask: 0x0 }; // Unfortunately js cannot create a pointer for integers, so we have to wrap the mask to a class;
        this.alignment = 0x0;
        this.gfx_pool_request = GFX_POOL_REQUESTS.ANY;


        this.gfx = null;
        this.is_gfx_inserted = false;
        this.isFramebufferRendered = INT_NULL;

        this.idx = INT_NULL;
        this.sceneidx = STATE.scene.active_idx;
        this.fbidx = INT_NULL; // This should render the current mesh to the default gl framebuffer. 
        this.batch_fnidx = INT_NULL;
        this.mesh_bufferidx = INT_NULL;
        this.root_bufferidx = INT_NULL;
        this.per_vb_bufferidx = INT_NULL;
        this.batch_buffer_vbidx = INT_NULL;
        this.batchidx = INT_NULL;
        this.group_bufferidxs = [INT_NULL, INT_NULL, INT_NULL];
        this.nameidx = INT_NULL;

        this.parent = null;

        this.listeners = null;
        this.parent_event_idx = INT_NULL; // An index to the Listeners Buffer Struct. In many cases the parent event is not the mesh's parent, to avoid any annecessary listen events creation.

        this.eventCallbacks = New_generic_buffer(_, 'Mesh eventCallbacks');
        this.timedEvents = New_generic_buffer(_, 'Mesh timedEvents');
        this.children = New_generic_buffer(_, 'Mesh children');
        this.timeIntervalsIdxBuffer = New_int8_buffer(INTERVALS.SIZE);

        this.rel_comp = null;

        this.root_posidx = INT_NULL;


        this.hover_margin = [0, 0];
        this.styles = Styles_create();
        this.clamp = [0, [0, 10000, DEFAULT_CLAMP_THRESHOLD]]; // TODO: do the same for the clamx too


        this.menu_options_idx = INT_NULL;
        this.menu_options = {
            Clbk: null,
            idx: INT_NULL,
        };
        this.minimized = null; // Pointer to store the minimized mesh version of 'this'. 

        // IMIDIATELY: the .data is used only 3 times by DebugInfoUi.js. Same with .evtidx field. So maybe those 2 are separated to the DebugInfoUi.js file
        this.debug_info = {
            type: 0x0, // Bit mask for distinguish the infoListener listening to that event type
            data: null, // Some storage for any kind of data
            evtidx: INT_NULL, // Stores the index of the events in the Info_Listeners buffer.
        };


        /** Debug  properties */
        if (DEBUG.MESH) {
            Object.defineProperty(this, 'id', { value: _meshId++ });
        }
    }


    RemoveChildren() {

        const count = this.children.boundary;
        for (let i = 0; i < count; i++) {

            this.children.RemoveByIdx(i);
        }
    }


    RemoveChildByIdx(idx) {

        this.children.RemoveByIdx(idx);
        return this.children.ShiftElementOnDestroy(idx);
    }


    Destroy() {


        /*************************************************************************************/
        // Remove event listeners
        if (this.listeners) {
            this.RemoveAllListenEvents();
            Free_generic_buffer(this.listeners)
        }




        /*************************************************************************************/
        // Remove time intervals
        if (this.timeIntervalsIdxBuffer.active_count) {

            for (let i = 0; i <= this.timeIntervalsIdxBuffer.boundary; i++) {

                const intervalIdx = this.timeIntervalsIdxBuffer.buffer[i];
                if (intervalIdx !== INT_NULL) {
                    TimeIntervalsDestroyByIdx(intervalIdx);
                    this.timeIntervalsIdxBuffer.RemoveByIdxSortedVersion(i);
                }
            }
        }

        // Styles_batch_destroy_store(this.styles);
        // BUG: There seems to be a bug in the removal of the styles from the M_Buffer, so as to the '.active_count' isn't incremented/Decremented correctly
        // Command_buffer_store(Styles_batch_destroy_run, null, COMMANDS.ID.STYLE_BATCH_DESTROY); // Store the 'destroy styles' as a command to be executed later(once per frame)

        if (NOTIFICATIONS_ON && (this.type & MESH_TYPE.DEBUG_MESH) === 0)
            Notifications_send(NOTIFICATION_TYPE.MESH_BUFFER_IDXS.NOTIF, NOTIFICATION_TYPE.FLAGS.DESTROY, this.mesh_bufferidx);




        /*************************************************************************************/
        // Remove from gfx buffers.

        // A mesh maybe active buut not inserted in vertex buffer
        if (this.is_gfx_inserted && this.state.mask & MESH_STATE.ACTIVE) {

            if (this.type & (MESH_TYPE.WIDGET_TEXT | MESH_TYPE.WIDGET_TEXT_DYNAMIC | MESH_TYPE.TEXT_MESH)) { // Case it is a text mesh, for destroy we must pass the whole string length, not just the renderable

                // console.log('Destroy1:', this.name, this.gfx.vb.groupidx, this.geom.num_faces, this.mat.temp_max_chars_inserted_in_gfx)
                const ret = Gfx_pool_remove_geometry(this.gfx, this.mat.temp_max_chars_inserted_in_gfx, _, this);
            }
            else {
                
                // console.log('Destroy:', this.name, this.gfx.vb.groupidx, this.geom.num_faces)
                const ret = Gfx_pool_remove_geometry(this.gfx, this.geom.num_faces, _, this);
            }

        }


        // Case 'this' is a child, remove it from parent's children buffer.
        /**
         * Because this function probably is called by the parent's 'Destroy()' function, 
         * if we remove the 'this' in here, the we must notify parent so as not to reduce it's children count.
         */
        let shift_children = false; // The caller will reduce the i from the loop by 1.
        if (this.parent && this.parent !== NO_MESH_PARENT && this.idx !== INT_NULL) {

            shift_children = this.parent.RemoveChildByIdx(this.idx); // Remove the current mesh from the parent
        }




        /*************************************************************************************/
        // Remove from widget root buffer.
        // Mesh_buffer_batch_destroy_store(this.mesh_bufferidx);
        // Command_buffer_store(Mesh_buffer_batch_destroy_run, null, COMMANDS.ID.LISTENERS_BATCH_DESTROY)
        Mesh_buffer_remove_mesh_byidx(this.mesh_bufferidx);

        // Destroy Generic Buffers
        Free_generic_buffer(this.eventCallbacks);
        Free_generic_buffer(this.timedEvents);
        Free_generic_buffer(this.children);
        Styles_destroy(this.styles);

        if(this.type & MESH_TYPE.FONT_MATERIAL) Free_generic_char_buffer(this.mat.char_buffer)



        /*************************************************************************************/
        // Remove mesh from STATE.
        STATE.mesh.CheckAllAndRemove(this)


        return shift_children;
    }


    ActivateAndChildren() {
        this.state.mask |= MESH_STATE.ACTIVE;
        for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            child.state.mask |= MESH_STATE.ACTIVE;
        }
    }


    ActivateAndChildrenRecursive() {
        this.state.mask |= MESH_STATE.ACTIVE;
        for (let i = 0; i <= this.children.boundary; i++) {

            const child = this.children.buffer[i];
            child.StateEnable(MESH_STATE.ACTIVE);
            // child.state.mask |= MESH_STATE.ACTIVE;

            if (child.children.boundary) {
                child.ActivateAndChildrenRecursive()
                if (child.text_mesh)
                    child.text_mesh.state.mask |= MESH_STATE.ACTIVE;
            }
        }
    }



    /*******************************************************************************************************************************************************/
    // Graphics
    /*******************************************************************************************************************************************************/







    /*******************************************************************************************************************************************************/
    // Mesh State.
    /*******************************************************************************************************************************************************/


    StateCheck(bit) { return this.state.mask & bit; }







    /*******************************************************************************************************************************************************/
    // Listeners
    /*******************************************************************************************************************************************************/

    CreateListenEvent(etype, is_fake_event = false) {

        if (etype & LISTEN_EVENT_TYPES.HOVER) {

            // HERE: The construction of the listeners is been set 3 times. Make it one time in one place
            if (!this.listeners) {
                this.listeners = New_generic_buffer(_, 'Mesh-Listeners buffer');
                this.listeners.Init(LISTEN_EVENT_TYPES_INDEX.SIZE);
            }

            this.listeners.AddAtIndex(E.H, INT_NULL);

            this.state.mask |= (MESH_STATE.IS_HOVERABLE | MESH_STATE.IS_HOVER_COLORABLE);
            this.event_flags |= LISTEN_EVENT_TYPES.HOVER;

            if (is_fake_event) this.state.mask |= (MESH_STATE.IS_FAKE_EVENT | MESH_STATE.IS_FAKE_HOVERABLE);

        }
        else if (etype & LISTEN_EVENT_TYPES.CLICK_UP) {

            if (!this.listeners) {
                this.listeners = New_generic_buffer(_, 'Mesh-Listeners buffer - Click');
                this.listeners.Init(LISTEN_EVENT_TYPES_INDEX.SIZE);
            }

            this.listeners.AddAtIndex(E.C, INT_NULL)

            this.state.mask |= (MESH_STATE.IS_CLICKABLE);
            this.event_flags |= LISTEN_EVENT_TYPES.CLICK_UP;

            if (is_fake_event) this.state.mask |= (MESH_STATE.IS_FAKE_EVENT | MESH_STATE.IS_FAKE_CLICKABLE);

        }
        else if (etype & LISTEN_EVENT_TYPES.MOVE) {

            if (!this.listeners) {
                this.listeners = New_generic_buffer(_, 'Mesh-Listeners buffer - Move');
                this.listeners.Init(LISTEN_EVENT_TYPES_INDEX.SIZE);
            }

            this.listeners.AddAtIndex(E.C, INT_NULL);

            this.state.mask |= (MESH_STATE.IS_GRABABLE | MESH_STATE.IS_MOVABLE | MESH_STATE.IS_CLICKABLE);
            this.event_flags |= LISTEN_EVENT_TYPES.MOVE;

            if (is_fake_event) this.state.mask |= (MESH_STATE.IS_FAKE_EVENT | MESH_STATE.IS_FAKE_CLICKABLE);

        }

    }


    // Either the 'parent_event' is legit if we pass it or null, so just check if is NOT INT_NULL
    AddListenEvent(etypeidx, Clbk = null, params = null, parent_event_idx = null) {

        if (this.state.mask & MESH_STATE.ACTIVE) { // HERE: see if can remove check
            this.listeners.buffer[etypeidx] = Listener_create_child_event(etypeidx, this.mesh_bufferidx, Clbk, params, parent_event_idx);
            this.parent_event_idx = (parent_event_idx) ? parent_event_idx : INT_NULL;
        }
        // else console.error('{{{{{{{{{{{{{{{{{{{{{{{{{{{')
    }


    RemoveAllListenEvents() {
        // TODO The if's maybe better implemented in EventListeners class RemoveEvent()???

        if (!this.listeners) return;

        // console.log('Removing listen events of', this.GetName())
        for (let i = 0; i <= this.listeners.boundary; i++) {

            if (this.listeners.buffer[i] !== null && this.listeners.buffer[i] !== INT_NULL) {
                Listener_remove_event_by_idx(i, this.listeners.buffer[i]);
                // Listener_batch_destroy_store(i, this.listeners.buffer[i]);
                this.listeners.buffer[i] = INT_NULL;
            }
        }

        // Command_buffer_store(Listener_batch_destroy_run, null, COMMANDS.ID.LISTENERS_BATCH_DESTROY)
    }


    /** Remove all mesh's listen events from the Listeners buffer struct, but keep the .listeners intact so that we may re-constuct the events for the mesh */
    RemoveAllListenEventsNotSelf_RenameMe() {

        if (!this.listeners) return;

        console.log('Removing listen events NotSelf of', this.GetName())
        for (let i = 0; i <= this.listeners.boundary; i++) {

            if (this.listeners.buffer[i] !== null && this.listeners.buffer[i] !== INT_NULL) {
                this.parent_event = Listener_remove_event_by_idx(i, this.listeners.buffer[i]);
                // this.listeners.buffer[i] = INT_NULL;
            }
        }
    }


    CreateEventCallback(params = null) {

        if (!params) alert('CreateEventCallback(params = null). @ Mesh.js')
        if (!this.eventCallbacks) New_generic_buffer(_, 'Mesh eventCallbacks');
        const eventIdx = this.eventCallbacks.Add(params);
        return eventIdx;
    }






    /*******************************************************************************************************************************************************/
    // Transformations   Setters-Getters
    /*******************************************************************************************************************************************************/


    SetColorRGB(col) { this.SetUpdateFrameBuffer(); this.mat.SetColorRGB(col, this.gfx, this.geom.num_faces); }


    // SetColorAlpha(alpha) { this.SetUpdateFrameBuffer(); Set_color_a(this, alpha); }


    // SetDefaultColor() { this.SetUpdateFrameBuffer(); Set_default_color_rgba(this) }


    SetStyle(style) { this.SetUpdateFrameBuffer(); this.mat.SetStyle(style); }


    SetDefaultPosXY() { this.SetUpdateFrameBuffer(); this.geom.SetDefaultPosXY(this.gfx); }


    SetPosXYZ(pos) { this.SetUpdateFrameBuffer(); this.geom.SetPosXYZ(pos, this.gfx); }


    SetPosXY(pos) { this.SetUpdateFrameBuffer(); this.geom.SetPosXY(pos, this.gfx); }


    SetPosX(x) { this.SetUpdateFrameBuffer(); this.geom.SetPosX(x, this.gfx, this.geom.num_faces); }


    SetPosY(y) { this.SetUpdateFrameBuffer(); this.geom.SetPosY(y, this.gfx); }


    SetDim(dim) { this.SetUpdateFrameBuffer(); this.geom.SetDim(dim, this.gfx); }


    GetName() { return Str_buffer_mesh_names_get_by_idx(this.nameidx); }


    GetPosXYZ() {

        const pos = [0, 0, this.geom.pos[2]];

        const p = this.GetPosXY();
        pos[0] += p[0];
        pos[1] += p[1];


        return pos;
    }


    GetPosXY() {

        const p = Mesh_unif_get_vb_root_wpos(this.root_posidx);
        let pos = [p[0], p[1], 0];

        pos[0] += this.geom.pos[0];
        pos[1] += this.geom.pos[1];
        return pos;
    }


    GetPosX() {

        let p = Mesh_unif_get_vb_root_wposx(this.root_posidx);

        return p + this.geom.pos[0];
    }


    GetPosY() {

        let p = Mesh_unif_get_vb_root_wposy(this.root_posidx);

        return p + this.geom.pos[1];
    }


    MoveXY(x, y) {
        this.SetUpdateFrameBuffer();
        this.geom.MoveXY(x, y, this.gfx, _, this.state.mask & MESH_STATE.ACTIVE); // console.log('Mesh MoveXY')
    }


    SetAttrTime() {
        if (this.sid.attr & SID.ATTR.TIME) {
            this.geom.timer = Timer_get_global_timer();
            Gl_set_wpos_time(this.gfx, this.geom.timer);
        }
    }


    RotateZ(angle) { GlRotateZ2D(this.gfx, this.geom.dim, angle); }


    StylesGetMargin(axis = STYLES.AXIS.ALL) { return Styles_margin_get(axis, this.styles); }


    StylesGetHoverMargin(axis = STYLES.AXIS.ALL) { return Styles_hover_margin_get(axis, this.styles); }


    StylesGetPad(axis = STYLES.AXIS.ALL) { return Styles_pad_get(axis, this.styles); }


    StylesSetMargin(margin) { Styles_margin_set(this.styles, margin); }


    StylesSetHoverMargin(margin) { Styles_hover_margin_set(this.styles, margin); }


    StylesSetPad(pad) { Styles_pad_set(this.styles, pad); }


    SetUpdateFrameBuffer() {
        if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
    }


    SetName(name = null) {
        if (name !== '' && name) this.nameidx = Str_buffer_mesh_names_store(name, this.mesh_bufferidx, this.type & MESH_TYPE.DEBUG_MESH);
        /**DEBUG*/this.name = name
    }


    /**
     * Enable shader properties.
     * In order for a mesh to be drawn in a certain way, specific shaders must be build.
     * Allow the shader constructor to combine different shaders by enabling meshes 'sid' bit field. 
     */
    EnableGfxAttributes(which, params) {

        if (this.alreadyAdded === true) {
            console.error(`You are trying to enable ${which} but the shaders have been already created. Try Enable() before inserting the mesh to a Scene().`);
            alert('SEE console error');
        }


        switch (which) {

            case MESH_ENABLE.GFX.ATTR_STYLE: {

                this.sid.attr |= (SID.ATTR.STYLE | SID.ATTR.BORDER | SID.ATTR.R_CORNERS | SID.ATTR.FEATHER) | SID.ATTR.PARAMS1 | SID.ATTR.EMPTY;
                this.sid.pass |= SID.PASS.WPOS2 | SID.PASS.DIM2;
                if (!(params === null || params === undefined)) {
                    this.mat.style = params.style;
                }
                break;
            }
            case MESH_ENABLE.GFX.ATTR_TIME: {

                this.sid.attr |= SID.ATTR.TIME;
                break;
            }

            case MESH_ENABLE.GFX.PASS_COL4: { this.sid.pass |= SID.PASS.COL4; break; }
            case MESH_ENABLE.GFX.PASS_WPOS2: { this.sid.pass |= SID.PASS.WPOS2; break; }
            case MESH_ENABLE.GFX.PASS_DIM2: { this.sid.pass |= SID.PASS.DIM2; break; }
            case MESH_ENABLE.GFX.PASS_RES2: { this.sid.pass |= SID.PASS.RES2; break; }
            case MESH_ENABLE.GFX.PASS_TIME1: { this.sid.pass |= SID.PASS.TIME1; break; }

            default: console.error('Enable material\'s shader param failed. @ Material.js');
        }
    }


    EnableGfxUniforms(flags, name, type, shader_flags) {

        if (this.alreadyAdded === true) {
            console.error(`You are trying to enable ${which} but the shaders have been already created. Try Enable() before inserting the mesh to a Scene().`);
            alert('SEE console error');
        }

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

        this.sid.unif |= flags;

        // Avoid duplicates
        const len = this.uniforms.length;
        let skip = false;
        for (let i = 0; i < len; i++) {
            if (this.uniforms[i].name === name)
                skip = true;
        }

        if (!skip) {

            const idx = this.uniforms.push({
                name: name,
                type: type,
                ubidx: INT_NULL, // Should be set by the Gl Program creation. So the first mesh that will push to create the program will have the ubidx
                shader: shader_flags,
            });

            this.temp_unif_wpos = idx - 1;

        }

    }


    GfxUniformsSetClbk(unif_name, Clbk, clbk_params){

        // Find uniform
        const len = this.uniforms.length;
        let found_idx = INT_NULL;
        for (let i = 0; i < len; i++) {
            if (this.uniforms[i].name === unif_name){
                found_idx = i;
                break;
            }
        }

        if(found_idx !== INT_NULL){
            // console.log('{}{}{}{} ubidx', this.uniforms[found_idx].ubidx, this.uniforms[found_idx].name, 'prog', this.gfx.prog.idx, 'vb', this.gfx.vb.groupidx)

            // HACK: We need different params for each vb group, but we only call once with one param. How to FIX???
            if(unif_name === 'u_wposxy'){
                
                clbk_params = this.gfx.vb.groupidx;
            }
            Vertex_buffer_set_uniform_value_callback(this.gfx.vb.groupidx, Clbk, clbk_params, this.uniforms[found_idx].ubidx);
            return;
        }

        alert('666 - No Uniform Found\nGfxUniformsSetClbk()\nMesh.js')

    }

}



