"use strict";
import { TimerGetGlobalTimer } from "../../../Timers/Timers.js";
import { TimeIntervalsDestroyByIdx } from "../../../Timers/TimeIntervals.js";
import { New_generic_buffer, New_int8_buffer } from "../../../Core/Buffers.js";
import { Gl_set_wpos_time } from "../../../../Graphics/Buffers/VertexBuffersOps.js";
import { Listener_create_child_event, Listener_create_event, Listener_remove_child_event_from_parent, Listener_remove_event_by_idx } from "../../../Events/EventListeners.js";
import { Scenes_get_count } from "../../../Scenes.js";
import { Mesh_buffer_get_mesh_byidx, Mesh_buffer_remove_mesh_byidx, Mesh_per_vb_remove_mesh, Mesh_per_vb_update_mesh_gfx_start } from "../../../Core/MeshBuffer.js";
import { Str_buffer_mesh_names_get_by_idx, Str_buffer_mesh_names_store } from "../../../Core/StringBuffer.js";
import { Gfx_pool_remove_geometry } from "../../../Interfaces/Gfx/GfxPool.js";
import { Styles_hover_margin_create, Styles_hover_margin_destroy, Styles_hover_margin_get, Styles_hover_margin_set, Styles_margin_create, Styles_margin_destroy, Styles_margin_get, Styles_margin_set, Styles_pad_create, Styles_pad_destroy, Styles_pad_get, Styles_pad_set } from "../../../Styles.js";
import { NOTIFICATION_TYPE_IDX, Notifications_send } from "../../DebugInfo/DebugInfoUiNotifications.js";


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
            unif: this.mat.sid.unif,
            pass: (this.geom.sid.pass | this.mat.sid.pass | SID.PASS.COL4),
            gfx_group: GFX_GROUPS.DEFAULT.MASK, // To denote if the curent mesh is used for debug, so it uses specific gfx buffers for debug ui rendering.
        };



        this.uniforms = [];
        if (APP.ENABLE_SHADER_PROJECTION_MATRIX)
            this.EnableGfxUniforms(SID.UNIF.PROJECTION_MATRIX, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);


        this.type = MESH_TYPE.MESH;
        this.state = { mask: MESH_STATE.ACTIVE }; // Unfortunately js cannot create a pointer for integers, so we have to wrap the mask to a class;
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

        this.listeners = New_generic_buffer();
        this.listeners.Init(LISTEN_EVENT_TYPES_INDEX.SIZE);

        this.eventCallbacks = New_generic_buffer();
        this.timedEvents = New_generic_buffer();
        this.children = New_generic_buffer();
        this.timeIntervalsIdxBuffer = New_int8_buffer(INTERVALS.SIZE);
        
        this.rel_comp = null;


        this.hover_margin = [0, 0];
        this.styles = [0,0,0];
        this.styles[STYLES.MARG] = Styles_margin_create([0,0])
        this.styles[STYLES.HOVER_MARG] = Styles_hover_margin_create([0,0])
        this.styles[STYLES.PAD] = Styles_pad_create([0,0])
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


    SetSceneIdx(scene_idx) {

        if (scene_idx === INT_NULL || scene_idx >= Scenes_get_count()) alert('ERROR scene index.');
        this.sceneidx = scene_idx;
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
        this.RemoveAllListenEvents();


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

        Styles_margin_destroy(this.styles[STYLES.MARG]);
        Styles_hover_margin_destroy(this.styles[STYLES.HOVER_MARG]);
        Styles_pad_destroy(this.styles[STYLES.PAD]);

        if(NOTIFICATIONS_ON && (this.type & MESH_TYPE.DEBUG_MESH)===0) 
            Notifications_send(NOTIFICATION_TYPE_IDX.MESH_BUFFER, NOTIFICATION_TYPE_IDX.FLAGS.DESTROY, this.mesh_bufferidx);


        /*************************************************************************************/
        // Remove from gfx buffers.
        // Bacause of clipping we must check if current mesh exists in vertex buffer(rendered and not clipped)
        if (this.state.mask & MESH_STATE.ACTIVE) {
            
            const ret = Gfx_pool_remove_geometry(this.gfx, this.geom.num_faces);
            
            if(!ret.is_last) Mesh_per_vb_update_mesh_gfx_start(this.gfx.vb.idx, ret.start, this.geom.num_faces)
            Mesh_per_vb_remove_mesh(this.gfx.vb.idx, this.per_vb_bufferidx);
            
            console.log('GFX vbidx', this.gfx.vb.idx, 'start', this.gfx.vb.start);
            // this.gfx.vb.start = INT_NULL;
        }
        
        let shift_children = false; // A way to store and return if this was removed from paren's children so that the caller will reduce the i from the loop by 1.
        // Remove from parent's children buffer
        if (this.parent && this.parent !== NO_MESH_PARENT && this.idx !== INT_NULL) {
            
            shift_children = this.parent.RemoveChildByIdx(this.idx); // Remove the current mesh from the parent
            // if (this.state.mask & MESH_STATE.ACTIVE) console.log('-{1} Removing:', this.GetName(), 'idx:', this.idx, 'parent name', 'start', this.gfx.vb.start, this.parent.GetName())
        }
        // else if (this.state.mask & MESH_STATE.ACTIVE) console.log('-{1-NO-PARENT} Removing:', 'start', this.gfx.vb.start, this.GetName(), 'idx:', this.idx)
        
        /*************************************************************************************/
        // Remove from widget root buffer.
        Mesh_buffer_remove_mesh_byidx(this.mesh_bufferidx);

        

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
    /* Mesh State.
    /*******************************************************************************************************************************************************/

    StateToggle(bit) { this.state.mask ^= bit; }


    StateCheck(bit) { return this.state.mask & bit; }




    /*******************************************************************************************************************************************************/
    // Listeners
    /*******************************************************************************************************************************************************/

    CreateListenEvent(etype, is_fake_event = false) {

        if (is_fake_event)
            this.state.mask |= (MESH_STATE.IS_FAKE_EVENT | MESH_STATE.IS_FAKE_HOVERABLE);

        if (etype & LISTEN_EVENT_TYPES.HOVER) {

            this.listeners.AddAtIndex(E.H, {
                evt: null,
                is_child_event: false,
            });

            this.state.mask |= (MESH_STATE.IS_HOVERABLE | MESH_STATE.IS_HOVER_COLORABLE);

            if (is_fake_event) this.state.mask |= (MESH_STATE.IS_FAKE_EVENT | MESH_STATE.IS_FAKE_HOVERABLE);

        }
        else if (etype & LISTEN_EVENT_TYPES.CLICK_UP) {

            this.listeners.AddAtIndex(E.C, {
                evt: null,
                is_child_event: false,
            });

            this.state.mask |= (MESH_STATE.IS_CLICKABLE);

            if (is_fake_event) this.state.mask |= (MESH_STATE.IS_FAKE_EVENT | MESH_STATE.IS_FAKE_CLICKABLE);

        }
        else if (etype & LISTEN_EVENT_TYPES.MOVE) {

            this.listeners.AddAtIndex(E.C, {
                evt: null,
                is_child_event: false,
            });

            this.state.mask |= (MESH_STATE.IS_GRABABLE | MESH_STATE.IS_MOVABLE | MESH_STATE.IS_CLICKABLE);

            if (is_fake_event) this.state.mask |= (MESH_STATE.IS_FAKE_EVENT | MESH_STATE.IS_FAKE_CLICKABLE);

        }

    }


    AddListenEvent(etypeidx, Clbk = null, params = null, parent_event = null) {

        if (!this.listeners.buffer[etypeidx])
            console.error('NO LISTENER IN this.listeners.buffer[etypeidx]')

        if(this.state.mask & MESH_STATE.ACTIVE){

            if (parent_event && parent_event[etypeidx] && parent_event[etypeidx].evt) {
                this.listeners.buffer[etypeidx].evt = Listener_create_child_event(etypeidx, this.mesh_bufferidx, Clbk, params, parent_event[etypeidx].evt);
                this.listeners.buffer[etypeidx].is_child_event = true;
            }
            else {
                this.listeners.buffer[etypeidx].evt = Listener_create_event(etypeidx, this.mesh_bufferidx, Clbk, params);
            }
        }
    }


    RemoveAllListenEvents() {
        // TODO The if's maybe better implemented in EventListeners class RemoveEvent()???

        for (let etype = 0; etype <= this.listeners.boundary; etype++) {

            if (this.listeners.buffer[etype] && this.listeners.buffer[etype].evt) {

                if (!this.listeners.buffer[etype].is_child_event)
                    Listener_remove_event_by_idx(etype, this.listeners.buffer[etype].evt);
                else
                    Listener_remove_child_event_from_parent(etype, this.listeners.buffer[etype].evt);
            }
        }
    }


    CreateEventCallback(params = null) {

        if (!params) alert('CreateEventCallback(params = null). @ Mesh.js')
        const eventIdx = this.eventCallbacks.Add(params);
        return eventIdx;
    }



    /*******************************************************************************************************************************************************/
    // Transformations   
    /*******************************************************************************************************************************************************/

    SetHoverColor() { this.SetUpdateFrameBuffer(); this.mat.SetHoverColor(this.gfx); }


    SetHoverColorDefault() { this.SetUpdateFrameBuffer(); this.mat.SetHoverColorDefault(this.gfx); }


    SetColor(col) { this.SetUpdateFrameBuffer(); this.mat.SetColor(col, this.gfx); }


    SetColorRGB(col) { this.SetUpdateFrameBuffer(); this.mat.SetColorRGB(col, this.gfx, this.geom.num_faces); }


    SetColorAlpha(alpha) { this.SetUpdateFrameBuffer(); this.mat.SetColorAlpha(alpha, this.gfx, this.geom.num_faces); }


    SetDefaultColor() { this.SetUpdateFrameBuffer(); this.mat.SetDefaultColor(this.gfx, this.geom.num_faces); }


    SetStyle(style) { this.SetUpdateFrameBuffer(); this.mat.SetStyle(style); }


    SetDefaultPosXY() { this.SetUpdateFrameBuffer(); this.geom.SetDefaultPosXY(this.gfx); }


    SetPosXYZ(pos) { this.SetUpdateFrameBuffer(); this.geom.SetPosXYZ(pos, this.gfx); }


    SetPosXY(pos) { this.SetUpdateFrameBuffer(); this.geom.SetPosXY(pos, this.gfx); }


    SetPosX(x) { this.SetUpdateFrameBuffer(); this.geom.SetPosX(x, this.gfx, this.geom.num_faces); }


    SetPosY(y) { this.SetUpdateFrameBuffer(); this.geom.SetPosY(y, this.gfx); }


    SetDim(dim) { this.SetUpdateFrameBuffer(); this.geom.SetDim(dim, this.gfx); }


    GetName() { return Str_buffer_mesh_names_get_by_idx(this.nameidx); }


    UpdatePosXY() { this.SetUpdateFrameBuffer(); this.geom.UpdatePosXY(this.gfx); }


    UpdatePosXYZ() { this.SetUpdateFrameBuffer(); this.geom.UpdatePosXYZ(this.gfx); }


    UpdateDim() { this.SetUpdateFrameBuffer(); this.geom.UpdateDim(this.gfx); }


    UpdateZindex(z) { this.SetUpdateFrameBuffer(); this.geom.UpdatePosZ(z, this.gfx); }


    MoveXY(x, y) {
        this.SetUpdateFrameBuffer();
        this.geom.MoveXY(x, y, this.gfx, _, this.state.mask & MESH_STATE.ACTIVE); // console.log('Mesh MoveXY')
    }


    MoveXYZ(pos) {
        this.SetUpdateFrameBuffer();
        this.geom.MoveXYZ(pos, this.gfx, _, this.state.mask & MESH_STATE.ACTIVE); // console.log('Mesh MoveXYZ')
    }


    SetAttrTime() {
        if (this.sid.attr & SID.ATTR.TIME) {
            this.geom.timer = TimerGetGlobalTimer();
            Gl_set_wpos_time(this.gfx, this.geom.timer);
        }
    }


    RotateZ(angle) { GlRotateZ2D(this.gfx, this.geom.dim, angle); }
    
    StylesGetMargin(axis=STYLES.AXIS.ALL){ return Styles_margin_get(axis, this.styles[STYLES.MARG]); }


    StylesGetHoverMargin(axis=STYLES.AXIS.ALL){  return Styles_hover_margin_get(axis, this.styles[STYLES.HOVER_MARG]); } 


    StylesGetPad(axis=STYLES.AXIS.ALL){ return Styles_pad_get(axis, this.styles[STYLES.PAD]); }


    StylesSetMargin(margin){ Styles_margin_set(this.styles[STYLES.MARG], margin); }


    StylesSetHoverMargin(margin){ Styles_hover_margin_set(this.styles[STYLES.MARG], margin); }


    StylesSetPad(margin){ Styles_pad_set(this.styles[STYLES.MARG], margin); }





    /*******************************************************************************************************************************************************/
    // Setters-Getters    
    /*******************************************************************************************************************************************************/

    SetUpdateFrameBuffer() {
        if (this.isFramebufferRendered !== INT_NULL) FramebufferSetUpdate(this.isFramebufferRendered);
    }


    SetName(name = null) {
        if (name !== '' && name) this.nameidx = Str_buffer_mesh_names_store(name, this.mesh_bufferidx);
        /**DEBUG*/this.name = name
    }


    FindIdInChildren(id) {

        for (let i = 0; i <= this.children.boundary; i++) {
            const child = this.children.buffer[i];
            if (child && id === child.id && child.StateCheck(MESH_STATE.IS_HOVERABLE)) {
                return true;
            }
        }
        return false;
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
         * 1. Call this, with uniform name and a glg:SID.UNIF. the type of uniform to enable.
         *      This means that the user is responsiblee to add any new uniform type in SID global object.
         *      That is so we can check and enable code in the shader builder. 
         * 2. We need to bind the 'Set' and 'Update' functions for the uniforms to be usefull.
         *      . For the block uniforms, we only need to 'Set' the value via 
         *      'Uniforms_block_set_uniform()' function, the Update happens by gl.bindBuffer.
         *      . For individual uniforms, both 'Set' and 'Update' must be bound via 'Program_uniform_bind()' function.
         *          Use the 'Program_uniform_bind' and not 'Uniforms_bind...' Because the uniform update uses only a 'loc', 
         *          this might lead to unwilingly updating same loc of another progrm'a uniform. 
         */

        this.sid.unif |= flags;

        // Avoid duplicates
        const len = this.uniforms.length;
        let skip = false;
        for (let i = 0; i < len; i++) {
            if (this.uniforms[i].name === name)
                skip = true;
        }

        if (!skip)
            this.uniforms.push({
                name: name,
                type: type,
                shader: shader_flags,
            });

    }


    OnFakeClick() { console.log('FAKE CLICK! : ', Mesh_buffer_get_mesh_byidx(this.meshidx.GetName())); }
}


export function Recursive_gfx_operations(_mesh, Clbk, params) {

    const children = _mesh.children;
    for (let i = 0; i <= children.boundary; i++) {

        const mesh = children.buffer[i];
        if (mesh.children.active_count)
            Recursive_gfx_operations(mesh, Clbk, params)

        Clbk(mesh, params);
    }
}



// Run recursively from a root mesh down to all children and gather all unique gfx indexes into a buffer
export function Temp_Create_child_gfx_rename_me(mesh) {

    const gfx_buffer_rename_me = [];
    gfx_buffer_rename_me.push({
        progidx: mesh.gfx.prog.idx,
        vbidx: mesh.gfx.vb.idx,
    });

    // Case the mesh is label and has a text mesh
    if (mesh.text_mesh) {
        gfx_buffer_rename_me.push({
            progidx: mesh.text_mesh.gfx.prog.idx,
            vbidx: mesh.text_mesh.gfx.vb.idx,
        });
    }

    Temp_Create_child_gfx_recursive_rename_me(mesh, gfx_buffer_rename_me);
    return gfx_buffer_rename_me;
}



export function Temp_Create_child_gfx_recursive_rename_me(mesh, gfx_buffer_rename_me) {

    const count = mesh.children.boundary;
    for (let i = 0; i < count; i++) {

        const child = mesh.children.buffer[i];

        if (child) {

            if (child.children.boundary) { // Run recursively
                Temp_Create_child_gfx_recursive_rename_me(child, gfx_buffer_rename_me);
            }

            const gfx_indexes = {
                progidx: child.gfx.prog.idx,
                vbidx: child.gfx.vb.idx,
            };
            if (!GfxExists_rename_me(gfx_buffer_rename_me, gfx_indexes)) { // If gfx is not already stored, store it
                gfx_buffer_rename_me.push(gfx_indexes);
            }
            // Case the mesh is label and has a text mesh
            if (child.text_mesh) {

                const text_gfx_indexes = {
                    progidx: child.text_mesh.gfx.prog.idx,
                    vbidx: child.text_mesh.gfx.vb.idx,
                };
                if (!GfxExists_rename_me(gfx_buffer_rename_me, text_gfx_indexes)) { // If gfx is not already stored, store it
                    gfx_buffer_rename_me.push(text_gfx_indexes);
                }
            }
        }

    }
}



export function GfxExists_rename_me(gfx_buffer, gfx_indexes) {

    const count = gfx_buffer.length;
    for (let i = 0; i < count; i++) {
        if (gfx_buffer[i].progidx === gfx_indexes.progidx &&
            gfx_buffer[i].vbidx === gfx_indexes.vbidx) {
            return true;
        }
    }

    return false;
}



/******************************************************************************************************************************************************/
// DEBUG PRINT

export function Mesh_print_all_mesh_listeners() {

    const children = Scenes_get_root_meshes(STATE.scene.active_idx);

    if (children) Mesh_print_all_mesh_listeners_recursive(children);
}



function Mesh_print_all_mesh_listeners_recursive(meshes) {

    for (let i = 0; i <= meshes.boundary; i++) {

        const mesh = meshes.buffer[i];
        if (mesh) {

            if (mesh.children)
                Mesh_print_all_mesh_listeners_recursive(mesh.children);

            if (mesh.listeners.buffer)
                console.log(`id:${mesh.id} name:${mesh.GetName()} boundary:${mesh.listeners.boundary}`, mesh.listeners.buffer);
        }
    }
}

