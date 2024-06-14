"use strict";
import { Widget_Switch } from '../Engine/Drawables/Widgets/WidgetButton.js';
import { Widget_Text } from '../Engine/Drawables/Widgets/WidgetText.js';
import { TimeIntervalsCreate } from '../Engine/Timers/TimeIntervals.js';
import { Mesh } from '../Engine/Drawables/Meshes/Base/Mesh.js';
import { Widget_Menu_Bar, Widget_Minimize } from '../Engine/Drawables/Widgets/WidgetMenu.js';
import { FloorArr2, FloorArr3 } from '../Helpers/Math/MathOperations.js';


import { DEBUG_PRINT_KEYS } from '../Engine/Controls/Input/Keyboard.js';
import { GetShaderTypeId } from '../Graphics/Debug/GfxDebug.js';

import { Dropdown_roots_set_root, Widget_Dropdown } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Debug_info_ui } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { Widget_Scroller } from '../Engine/Drawables/Widgets/WidgetScroller.js';
import { GetRandomColor, GetSequencedColor } from '../Helpers/Helpers.js';
import { Textured_Mesh } from '../Engine/Drawables/Meshes/Textured_Mesh.js';
import { Create_widget_button, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_minimize_btn, Create_widget_multi_text, Create_widget_scroller, Create_widget_section, Create_widget_slider, Create_widget_switch, Create_widget_switch_simple, Create_widget_text } from '../Engine/Core/CreateWidget.js';
import { Mesh_buffer_get_mesh_byidx } from '../Engine/Core/MeshBuffer.js';
import { Clipy_from_group } from '../Engine/Drawables/Operations/Clip.js';
import { BLACK, BLUEL, BLUE_10_120_220, GREEN, GREY, ORANGE, ORANGEL, ORANGER, ORANGE_240_160_10, PURPLE, PURPLEB, PURPLER, REDL, WHITE, YELLOW, YELLOWL, YELLOWR } from '../Engine/Drawables/Material/Base/Colors.js';
import { View_build_group_from_root_mesh, View_set_view_vb_start } from '../Engine/Core/MeshBufferViews.js';
import { Index_buffer_info_create } from '../Graphics/Buffers/IndexBuffers.js';
// import { getFile } from '../Engine/Core/FileSystem.js';
import { New_generic_buffer } from '../Engine/Core/Buffers.js';
import { MouseGetPos } from '../Engine/Controls/Input/Mouse.js';
import { Listener_set_root_mesh_priority } from '../Engine/Events/EventListeners.js';
import { REL_POS, Relative_pos_comp_add_child_to_comp, Relative_pos_comp_create_new_comp, Relative_pos_comp_recalc_all } from '../Engine/Drawables/Operations/RelativePosComponent.js';
import { Particle_system_create_emitter, Particle_system_emitt } from '../Engine/ParticlesSystem/NewParticlesSystem.js';
import { Set_color_rgb } from '../Engine/Drawables/Operations/MeshAttributesFunctions.js';

// var osu = require('node-os-utils')
// import {osu} from 'node-os-utils'
// import {osu} from '../node-os-utils/index.js'
// import * as os from "../node-os-utils/index.js"

// import { Buffer } from 'buffer';

// import fs from 'fs';
// import * as fs from 'node:fs';

// const data = { name: 'John', age: 30, city: 'New York' };
// const jsonData = JSON.stringify(data);

// fs.writeFile('data.json', jsonData, (err) => {
//     if (err) throw err;
//     console.log('Data has been written to data.json');
// });

/**
 * // TODO: IMPLEMENT:
 * 1. Every widget should have a bit-field as to how the renderer will choose the vertex buffers for that mesh(PRIVATE, ANY, ...)
 * 
 * 3. Because we want to have a 'clean' 'GenerateGfxContext()', passing specific index for generating buffers,
 *      the only place to analyze the GFX_CTX_FLAGS is the GenGfxCtx method of each widget.
 * 
 * 4. Implement the switch's widget click listener to b automatic from the class.  
 *
 * reorganize the functions in GlVuffers.js 
 */

const _fontsize = 10;

const temp_buffer = New_generic_buffer(_, 'For UserCreateRect sdf lines');
const p = 0;
const dim = [50, 10];
const pos = [750, dim[1] + p, 5];
function UserCreateRect() {

    let ypos = 60
    const s = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [600, ypos, 0], [80, 40], GREY[2], 'Section');
    s.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    s.SetName('Create Rect');


    const btn = Create_widget_button(_, 'Create Rect', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [20, ypos, 1], fontsize, GREEN[7], WHITE, [5, 5], .5);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [0, 4, 2] })
    s.AddItem(btn);
    btn.Bind(UserCreateRectCreate, null, { parent: s })


    const s1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [80, 40], GetRandomColor(), 'S1');
    // s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    s1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    s1.SetName('S1');
    s.AddItem(s1);


    s.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    s.options = SECTION.VERTICAL | SECTION.EXPAND | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT
    // s.options = SECTION.VERTICAL|SECTION.EXPAND|SECTION.TOP_DOWN
    s.Calc_no_gfx_update();
    s.Render();
    s.ConstructListeners();

}

function UserCreateRectCreate(params) {

    const btn = params.target_mesh
    const parent = params.params.parent;
    const section = parent.children.buffer[1]

    const line = Create_widget_section(_, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(GetRandomColor(), 1), 'sdf linem2');
    line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
    line.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
    line.OnClick = UserCreateRectOnClick;
    line.AddToWidgetRootBuffer(parent.root_bufferidx);
    line.SetName('line');
    section.AddItem(line)

    line.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, parent.gfx.vb.groupidx);

    // section.Recalc_no_gfx_update()
    line.Render();
    parent.Recalc()

    line.ConstructListeners();

    line.StateEnable(MESH_STATE.IS_RESIZEABLE);

    pos[1] += dim[1] * 2 + p
}

function UserCreateRectOnClick(params) {

    const section = params.evt_params.target_mesh;

    STATE.mesh.SetClicked(section);

    const mouse_click = params.trigger_params;
    if (mouse_click === MOUSE.BTN_ID.RIGHT) {

        const mesh = Mesh_buffer_get_mesh_byidx(params.meshidx);
        mesh.Destroy();
        pos[1] -= dim[1] * 2 + p
        return true;

    }

    if (section.timeIntervalsIdxBuffer.buffer[INTERVALS.MOVE] === INT_NULL) {

        const right = section.geom.pos[0] + section.geom.dim[0];
        const bottom = section.geom.pos[1] + section.geom.dim[1];

        const point = MouseGetPos();
        if (point[0] > right - TEMP_RESIZE_MARGIN[0] || point[1] > bottom - TEMP_RESIZE_MARGIN[1]) {

            if (point[0] > right - TEMP_RESIZE_MARGIN[0] && point[1] > bottom - TEMP_RESIZE_MARGIN[1]) { // Its a width&height resize

                const OnResizeFn = section.OnResize;
                const idx = TimeIntervalsCreate(10, 'ResizeXY Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, OnResizeFn, section);
                section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);
            }


            section.state.mask |= MESH_STATE.IN_RESIZE | MESH_STATE.IN_GRAB;
            STATE.mesh.SetGrabed(section);

            return true;
        }


        /** Create Move event.
         * The Move event runs only when the mesh is GRABED. That means that the timeInterval 
         * is created and destroyed upon 'onClickDown' and 'onClickUp' respectively.
         */
        const idx = TimeIntervalsCreate(10, 'Move Widget_Text', TIME_INTERVAL_REPEAT_ALWAYS, Section_on_move_clbk, section);
        section.timeIntervalsIdxBuffer.AddAtIndex(INTERVALS.MOVE, idx);

        if (section.StateCheck(MESH_STATE.IS_GRABABLE)) {

            STATE.mesh.SetGrabed(section);
            section.StateEnable(MESH_STATE.IN_GRAB);
        }

    }

    return true;

}

export function TestWidgetsGeneric(scene) {

    // setInterval(()=>{
    //     if(STATE.mesh.hovered){
    //         console.log('State hovered:', STATE.mesh.hovered.GetName())
    //     }
    //     else{
    //         console.log('State hovered: null')
    //     }
    // }, 500)

    // setInterval(()=>{
    //     // console.log(Performance_timers_get_avg_1sec_reset(_pt_loop), PerformanceTimersGetFps(_pt_loop.timer), 'worst', PerformanceTimersGetWorstFps(_pt_loop.timer));
    //     console.log(Performance_timers_get_avg_1sec_reset(_pt_test_misc_1), PerformanceTimersGetFps(_pt_test_misc_1.timer), 'worst', PerformanceTimersGetWorstFps(_pt_test_misc_1.timer));
    //     // console.log(Performance_timers_get_avg_1sec_reset(_pt_test_misc_2), PerformanceTimersGetFps(_pt_test_misc_2.timer), 'worst', PerformanceTimersGetWorstFps(_pt_test_misc_2.timer));
    //     console.log('--------------');
    // }, 1000)




    let ypos = 500

    // getFile()


    // GLOBAL_TEST.index_buffer_info = Index_buffer_info_create(_, 100*INDICES_PER_RECT, TEMPORARY_INDEX_BUFFER_RECOGNITION_PATTERN.rect_123_234);
    // GLOBAL_TEST.index_buffer_info.Add(100);
    // Program_store_index_buffer_idx(progidx, ibidx); // Store the indexbuffer index to the programs ib array


    // Listeners_debug_info_create(scene);

    // const dbg_dp = Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT)
    // UserCreateRect()

    // uidbg.RotateZ(5.5);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, uidbg);
    // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, uidbg);





    // { // TESTING u_time
    //     const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], [500, 200, 5], [800, 10], PURPLER[7]);
    //     {
    //         line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)

    //         line.EnableGfxUniforms(SID.UNIF.PROJECTION_MATRIX, 'u_projection', UNIF_TYPE.MAT4, UNIFORM.IS_SHARED);
    //         line.EnableGfxUniforms(SID.UNIF.TIME, 'u_screen_res', UNIF_TYPE.FVEC2, UNIFORM.IS_SHARED);
    //         // line.EnableGfxUniforms(SID.UNIF.TIME, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    //         line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    //         line.Activate();
    //         line.Render();
    //         line.ConstructListeners();
    //     }
    // }




    /** Lines */
    // // Get the uniform by the program
    // const obj = {
    //     Set: null,
    //     Update:null,
    // };
    // Program_uniform_bind(line.gfx.prog.groupidx, line.gfx.prog.idx, obj, 'u_time');
    // obj.Set(4.2);
    // obj.Update();


    // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);
    { // Test sdf lines
        // {
        //     const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], [100, 200, 0], [100, 20], TRANSPARENCY(GREEN[2], .1), 'sdf linem2');
        //     line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
        //     line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        
        //     // line.sid.unif |= SID.UNIF.TIME;
        //     // line.EnableGfxUniforms(SID.UNIF.COL4, 'u_col4', UNIF_TYPE.FVEC4, UNIFORM.IN_VS);
        //     // line.sid.attr &= ~SID.ATTR.COL4;
        
        //     line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        //     line.Render();
        //     line.ConstructListeners();
        // }
        // {
        //     const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], [100, 270, 0], [100, 20], TRANSPARENCY(YELLOWR[7], 1), 'sdf linem2');
        //     line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
        //     line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        
        //     // line.sid.unif |= SID.UNIF.TIME;
        //     // line.EnableGfxUniforms(SID.UNIF.COL4, 'u_col4', UNIF_TYPE.FVEC4, UNIFORM.IN_VS);
        //     // line.sid.attr &= ~SID.ATTR.COL4;
        
        //     line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        //     line.Render();
        //     line.ConstructListeners();
        // }
    }


    // let ms = 2000;
    // setTimeout(()=>{SdfLine(PURPLER[7], [500, 800, 5], [800, 10]);}, ms); ms+=1000;
    {
        // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);
        // const mesh_data = {
        //     vbidx: line.gfx.vb.idx,
        //     start: line.gfx.vb.start,
        //     attribs_per_vertex: line.gfx.attribsPerVertex,
        //     attribsidx: line.gfx.prog.attribsidx,
        //     values: line.mat.col,
        // };
        // Animations_create(ANIMATIONS.TYPE.COLOR, mesh_data, .1, )
    }

    // const fb = Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
    { // Draw multiple lines to multiple framebuffers
        // TODO: The idea is to then draw all separate framebuffer textures to one final framebuffer 
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, fb.render_area);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);
    }

    /** Misc widgets */

    // Test_widgets(ypos);

    // const label = CreateLabel('ABCDEFGHIJKLM');
    // CreateLabel('\\/+0');
    // const label = CreateLabel('CreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line););CreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, lineCreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, lineCreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line');
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, label, .03, 0., 1.)


    // CreateLabel('Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);');
    // CreateLabel('Gl._framebuffer:-{render}|[mesh](FB.agqtpQji,TYPE.DIMENTION!,@23#scene,(label);');
    // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, label);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, label);


    // const button = CreateButton(); 
    // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, button);

    // CreateSwitchSimple([0, ypos, 0]);
    // const switch1 = CreateSwitch();

    // CreateSlider();
    // CreateChangeMeshColorFromSliders(ROOT_WIDGETS.CREATE_ROOT);


    // CreateWindowWithMenu();
    // CreateSceneMenuBar();


    // CreateDropdown([0,0, 0])
    // CreateDropdown2([0, ypos+=40, 0], 0);
    // CreateDropdown2InSection([0, ypos+=40, 0], 0);
    // CreateDropdown3([0, ypos+=40, 0], 0);
    
    // CreateScroller(scene);
    // CreateScrollerClampAlphaTest()
    // CreateScrollerDp(scene)
    // CreateScrollerWithWidgets(scene);



    // SdfLine([500, TEST_CLIP_TOP, 10], [800, 10]);


    // PARTICLES
    {
        // // const particle_system_idx5 = Particle_system_create_emitter(ORANGEL[9], [10,140,10], [16,16], .1, 2, 'Test Particle System3');
        // // const particle_system_idx4 = Particle_system_create_emitter(GREEN[9], [10,110,10], [16,16], .1, 2, 'Test Particle System3');
        // // const particle_system_idx3 = Particle_system_create_emitter(PURPLER[9], [10,90,10], [14,14], .1, 2, 'Test Particle System3');
        // // const particle_system_idx2 = Particle_system_create_emitter(BLUEL[9], [10,60,10], [12,12], .1, 2, 'Test Particle System2');
        const particle_system_idx = Particle_system_create_emitter(YELLOWR[9], [10,40,10], [10,10], .1, 2, 'T1st Particle System');
     
        // // const particle_system_idx5 = Particle_system_create_emitter(ORANGEL[9], [10,120,10], [10,10], .1, 2, 'Test Particle System3');
        // // const particle_system_idx4 = Particle_system_create_emitter(GREEN[9], [10,100,10], [10,10], .1, 2, 'Test Particle System3');
        // // const particle_system_idx3 = Particle_system_create_emitter(PURPLER[9], [10,80,10], [10,10], .1, 2, 'Test Particle System3');
        // // const particle_system_idx2 = Particle_system_create_emitter(BLUEL[9], [10,60,10], [10,10], .1, 2, 'Test Particle System2');
        // // const particle_system_idx = Particle_system_create_emitter(YELLOWR[9], [10,40,10], [10,10], .1, 2, 'T1st Particle System');
        
        
        
        const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Emitt', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [10, 260, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

        // btn.Bind(Particle_system_emitt, _, { target_params: [particle_system_idx, particle_system_idx2, particle_system_idx3, particle_system_idx4, particle_system_idx5] }, MESH_STATE.IS_HOLD_CLICK)
        btn.Bind(Particle_system_emitt, _, { target_params: [particle_system_idx] }, MESH_STATE.IS_HOLD_CLICK)
        
        btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        btn.Render();
        btn.ConstructListeners();
    }


    /** Section Synthesizes */
    {
        // TestSections1();


        // WIDGET DROPDOWN MENU

        // WIDGET MENU


        // PLENTY SECTIONS
        // CreateManySections(scene);

        { // 
            // const fb = Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, s);
            // Rotate framebuffer mesh
            // setInterval(()=>{GlRotateZ2D(fb.render_area.gfx, fb.render_area.geom.dim, Timer_get_global_timer()*Timer_get_global_timer()*.55)}, 16);
        }
    }

    // const helpui = Help(scene);


    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, helpui);

    // const meshinfo_mesh = MeshInfo(scene)
    // TimeIntervalsCreate(64, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, MeshInfoUpdate, { mesh: meshinfo_mesh });
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, meshinfo_mesh);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, meshinfo_mesh.children.buffer[0]);



    // Renderqueue_set_priority_by_program(FIRST, 1, 1)
    // Renderqueue_set_priority_by_program(FIRST, 0, 1)



    // UNNECESSARY: the order should be set for the listeners and not for the renderqueue
    // Listener_set_root_mesh_priority()


}





/**************************************************************************************************************************************/
// Widget Section Tests

function TestSections1(){

    const marg = [10,10];

    // const pos = [VIEWPORT.WIDTH/2, VIEWPORT.HEIGHT/2, 0];
    const pos = [0, 0, 0];
    
    const root = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, marg, pos, [0, 0], TRANSPARENCY(BLUEL[5], 1));
    root.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    root.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    root.SetName('root_blue');
    
    { // Test 1
        const s1 = Sections4(_, SECTION.HORIZONTAL, pos);
        root.AddItem(s1);
        const s2 = Sections4(_, SECTION.HORIZONTAL, pos);
        root.AddItem(s2);
    }
    
    { // Test 2
        const s1 = Sections2(_, SECTION.VERTICAL, pos); root.AddItem(s1);

        // { // Test: one into another recursive 
        //     const s2 = Sections2(_, SECTION.HORIZONTAL, pos); s1.AddItem(s2);
        //     const s3 = Sections2(_, SECTION.VERTICAL, pos); s2.AddItem(s3);
        //     const s4 = Sections2(_, SECTION.HORIZONTAL, pos); s3.AddItem(s4);
        // }
        
        // { const s2 = Sections2(_, SECTION.HORIZONTAL, pos); s1.AddItem(s2); }
        // { const s2 = Sections2(_, SECTION.HORIZONTAL, pos); s1.AddItem(s2); }
        
        // const s2 = Sections2(_, SECTION.VERTICAL, pos); root.AddItem(s2);
        // const s3 = Sections2(_, SECTION.HORIZONTAL, pos); root.AddItem(s3);
        
        // const s4 = Sections2(_, SECTION.HORIZONTAL, pos); root.AddItem(s4);
    }
    
    { // Test 3
        // {
        //     const s = Create_widget_section(_, SECTION.HORIZONTAL, marg, [0,0,0], [10, 100], TRANSPARENCY(REDL[7], .6));
        //     s.SetName('red1');
        //     root.AddItem(s)
            
        //     { 
        //         const s1 = Sections2(_, SECTION.VERTICAL); s.AddItem(s1); 
        //         // const s2 = Sections2(_, SECTION.HORIZONTAL); s.AddItem(s2);
        //     }
        //     {
                
        //         const sr = Create_widget_section(_, SECTION.VERTICAL, marg, [0,0,0], [10, 10], TRANSPARENCY(REDL[7], .6));
        //         sr.SetName('red2');
        //         root.AddItem(sr)
        //         const s1 = Sections2(_, SECTION.VERTICAL); sr.AddItem(s1); 
        //         const s2 = Sections2(_, SECTION.HORIZONTAL); sr.AddItem(s2);
        //     }
        //     { 
        //         const s1 = Sections2(_, SECTION.VERTICAL); s.AddItem(s1); 
        //         const s2 = Sections2(_, SECTION.HORIZONTAL); s.AddItem(s2);
        //     }
        // }
        // {
        //     const s = Create_widget_section(_, SECTION.HORIZONTAL, marg, [0,0,0], [10, 100], TRANSPARENCY(REDL[7], .6));
        //     s.SetName('red3');
        //     root.AddItem(s)
            
        //     { 
        //         const s1 = Sections2(_, SECTION.VERTICAL); s.AddItem(s1); 
        //         // const s2 = Sections2(_, SECTION.HORIZONTAL); s.AddItem(s2);
        //     }
        //     {
                
        //         const sr = Create_widget_section(_, SECTION.VERTICAL, marg, [0,0,0], [10, 10], TRANSPARENCY(REDL[7], .6));
        //         sr.SetName('red4');
        //         root.AddItem(sr)
        //         const s1 = Sections2(_, SECTION.VERTICAL); sr.AddItem(s1); 
        //         const s2 = Sections2(_, SECTION.HORIZONTAL); sr.AddItem(s2);
        //     }
        //     { 
        //         const s1 = Sections2(_, SECTION.VERTICAL); s.AddItem(s1); 
        //         const s2 = Sections2(_, SECTION.HORIZONTAL); s.AddItem(s2);
        //     }
        // }

    }
    
    


    root.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    
    root.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    root.Calc_no_gfx_update();

    root.Render();

    root.ConstructListeners();
}
let grey_cnt = 0;
let green_cnt = 0;
let orange_cnt = 0;
function Sections2(is_root, align) {

    const tr = .7;
    const marg = [10, 10];
    const dim = [10, 10];

    const grey = Create_widget_section(is_root, align, marg, [0, 0, 0], dim, TRANSPARENCY(GREY[0], tr));
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    grey.SetName(`grey${grey_cnt++}`);

    const green = Create_widget_section(_, SECTION.VERTICAL, marg, [0, 0, 0], dim, TRANSPARENCY(GREEN[3], tr));
    green.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    green.SetName(`green${green_cnt++}`);
    grey.AddItem(green);

    const orange = Create_widget_section(_, SECTION.VERTICAL, marg, [0, 0, 0], dim, TRANSPARENCY(ORANGER[7], tr));
    orange.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    orange.SetName(`orange${orange_cnt++}`);
    green.AddItem(orange);

    return grey;
}

function Sections4(is_root, align) {

    const tr = 1.;

    const blu = Create_widget_section(is_root, align, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu.SetName('grey');

    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.SetName('red');
    blu.AddItem(red);
    const green = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREEN[6], tr));
    green.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    green.SetName('green');
    blu.AddItem(green);
    // const purple = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
    // purple.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // purple.SetName('purple');
    // blu.AddItem(purple);
    // const orange = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGER[7], tr));
    // orange.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // orange.SetName('orange');
    // blu.AddItem(orange);



    return blu;
}


function Test_widgets(ypos){
    // CreateWindowWithMenu();
    CreateDropdown2([0, ypos+=40, 0], 0);
    CreateDropdown2InSection([0, ypos+=40, 0], 0);
    CreateDropdown3([0, ypos+=40, 0], 0);
    CreateScrollerClampAlphaTest()
}



/**************************************************************************************************************************************/
// Widget Creation Functions

const fontsize = 12;



function Test_uniforms_uTime() {
    { // TESTING u_time
        const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [500, 200, 5], [800, 10], PURPLER[7]);
        {
            line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)

            // line.EnableGfxUniforms(SID.UNIF.TIME, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS|UNIFORM.IN_FS);
            line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
            line.Activate();
            line.Render();
            // line.Calc();
            line.ConstructListeners();
        }
    }
}




let labelCount = 1;
function CreateLabel(name = 'Label ') {

    const pos = [100, 310 + (labelCount * 35), 2];
    // const label = Create_widget_label(ROOT_WIDGETS.CREATE_ROOT, name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, pos, fontsize, PURPLER[6], WHITE, [5, 5], .5);
    // const label = Create_widget_label(ROOT_WIDGETS.CREATE_ROOT, name, ALIGN.RIGHT | ALIGN.VERT_CENTER, pos, fontsize, PURPLER[6], WHITE, [5, 5], .5);
    // const label = Create_widget_label(ROOT_WIDGETS.CREATE_ROOT, name, ALIGN.HOR_CENTER | ALIGN.BOTTOM, pos, fontsize, PURPLER[6], WHITE, [5, 5], .5);
    const label = Create_widget_label(ROOT_WIDGETS.CREATE_ROOT, name, _, pos, fontsize, PURPLER[6], WHITE, [5, 5], .5);
    label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);

    // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4);
    // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4);
    
    label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    label.Render()
    label.ConstructListeners();

    // label.text_mesh.SetColorRGB(REDL);
    // label.text_mesh.RenderTextFromString('REDL');

    // label.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
    // label.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
    // label.Align(ALIGN.TOP | ALIGN.LEFT, [0, 0]);
    // label.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);


    labelCount++;
    return label;
}

function CreateButton() {

    let ypos = 400
    const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [20, ypos, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    btn.Render();
    btn.ConstructListeners();

    // btn.text_mesh.SetColorRGB(BLUE_10_120_220);

    // btn.Align(ALIGN.LEFT | ALIGN.TOP, [0, 0]);
    // btn.Align(ALIGN.RIGHT | ALIGN.BOTTOM, [15, 5]);

    return btn;
}

function CreateSwitchSimple(pos, root_widget=ROOT_WIDGETS.CREATE_ROOT) {

    let ypos = 450
       
    const switch1 = Create_widget_switch_simple(root_widget, pos, 14, _, _, 4);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
    
    if(root_widget & ROOT_WIDGETS.CREATE_ROOT){

        switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        switch1.Render();
        
        switch1.ConstructListeners();
    }

    return switch1;
}

function CreateSwitch() {

    let ypos = 500
    const switch1 = Create_widget_switch(ROOT_WIDGETS.CREATE_ROOT, 'switch on', 'switch off', [100, ypos, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    switch1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [0, 4, 2] })
    switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
    switch1.ConstructListeners();

    switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    switch1.Render();
    // switch1.text_mesh.SetColorRGB(PURPLER[7], 4);
    Set_color_rgb(switch1, PURPLER[7]);
    // ypos += switch1.geom.dim[1] * 2 + 5;

    return switch1;
}

function CreateSlider() {

    const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 300, 0], [150, 10]);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
    // slider.CreateSliderHandleEvent();
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    slider.Render();
    slider.ConstructListeners();

}

/** PARAMS: {empty or undefined} */
function CreateChangeMeshColorFromSliders(root_widget=ROOT_WIDGETS.CREATE_ROOT) {

    const section = Create_widget_section(root_widget, SECTION.VERTICAL, [6, 6], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[0], .9))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // section.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);

    const slider_size = [70, 10]

    {
        const slider = Create_widget_slider(_, [0, 0, 0], slider_size);
        section.AddItem(slider)
    }
    {
        const slider = Create_widget_slider(_, [0, 0, 0], slider_size);
        section.AddItem(slider)
    }
    {
        const slider = Create_widget_slider(_, [0, 0, 0], slider_size);
        section.AddItem(slider)
    }
    {
        const slider = Create_widget_slider(_, [0, 0, 0], slider_size);
        section.AddItem(slider)
    }

    if(root_widget & ROOT_WIDGETS.CREATE_ROOT)
    {
        section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    
        section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
        // section.options = SECTION.TOP_DOWN | SECTION.VERTICAL ;
        section.Calc_no_gfx_update();
        
        section.Render();
        
        section.ConstructListeners();
    }

    return section

}

function SdfLine(col, pos, dim) {


    const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(col, 1), 'sdf linem2');
    line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

    // const line1 = Create_widget_section(_, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(GREEN[7], 1.5));
    // line1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    // line.AddItem(line1)

    // line.sid.unif |= SID.UNIF.TIME;

    // line.EnableGfxUniforms(SID.UNIF.COL4, 'u_col4', UNIF_TYPE.FVEC4, UNIFORM.IN_VS);
    // line.sid.attr &= ~SID.ATTR.COL4;

    // const params = null;
    // const timer = TimersCreateTimer(0.01, 10, .1, 'T1', TEMP_TIMER_CLBK, params);

    line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    line.Render();
    line.ConstructListeners();


    // const line2 = Create_widget_section(_, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(col, 1), 'sdf linem2');
    // line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    // line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

    // // line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    // line.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, [line.gfx.prog.idx, line.gfx.vb.idx]);
    // line.Render();
    // line.ConstructListeners();


    // setInterval(()=>{GlRotateZ2D(mesh.gfx, mesh.geom.dim, Timer_get_global_timer()*.55)}, 16)
    // GlRotateZ2D(mesh.gfx, mesh.geom.dim, 1.23)

    // gfx_idxs[0] = mesh.gfx.prog.idx;
    // gfx_idxs[1] = mesh.gfx.vb.idx;
    // mesh.Move(-mesh.geom.pos[0]+mesh.geom.dim[0], VIEWPORT.HEIGHT - mesh.geom.pos[1]-mesh.geom.dim[1]);
    // mesh.RotateZ(5.5);

    return line;
}



function CreateDropdown(pos, id) {

    // const pad = [10, 2.5]
    const pad = [4, 2]
    const margin = [8, 8]
    // const dp = Create_widget_dropdown(`DP${id}`, pos, GREY[2], BLUE_10_120_220, WHITE, pad);
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `${id}`, pos, GREY[2], BLUE_10_120_220, WHITE, pad, _, _, _, margin);
    // dp.CreateHoverEvent();
    dp.CreateMoveEvent();
    dp.CreateClickEvent();


    const sub_dp1_count = 1;
    const sub_dp2_count = 1;

    const col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const dpsub1 = Create_widget_dropdown(_, `${id}-${i}`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
        dpsub1.CreateHoverEvent();
        dpsub1.CreateClickEvent();
        dp.AddToMenu(dpsub1);

        // const label = Create_widget_label(_, 'l1', ALIGN.LEFT, [0,0,2], 10, REDL)
        // dp.AddToMenu(label);

        const col1 = GetSequencedColor()
        for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(_, `${id}-${i}-${j}`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col1, WHITE, pad, _, _, _, margin);
            dpsub1.AddToMenu(dpsub2);

            const col2 = GetSequencedColor()
            for (let k = 0; k < sub_dp2_count; k++) {

                const dpsub3 = Create_widget_dropdown(_, `DP${id}-${i}${j}${k}`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                dpsub2.AddToMenu(dpsub3);
            }
        }
        for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(_, `${id}-${i}-${j}`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col1, WHITE, pad, _, _, _, margin);
            dpsub1.AddToMenu(dpsub2);

            const col2 = GetSequencedColor()
            for (let k = 0; k < sub_dp2_count; k++) {

                const dpsub3 = Create_widget_dropdown(_, `DP${id}-${i}${j}${k}`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                dpsub2.AddToMenu(dpsub3);
            }
        }
    }

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

    dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    dp.Calc_no_gfx_update();
    
    dp.Render()
    
    dp.ConstructListeners();

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    View_build_group_from_root_mesh(dp);

    return dp;
}


function CreateDropdown3(pos, dim) {

    const pad = [4, 2]
    const margin = [8, 8]
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `0`, pos, GREY[2], BLUE_10_120_220, WHITE, pad, _, _, _, margin);
    // dp.CreateMoveEvent();
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // dp.CreateClickEvent();
    
    
    const sub_dp1_count = 2;
    const sub_dp2_count = 5;
    
    const col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {
        
        const dpsub1 = Create_widget_dropdown(_, `0${i}`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
        dpsub1.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);

        dp.AddToMenu(dpsub1);

        for (let j = 0; j < sub_dp2_count; j++) {
            const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[7], 1.5), `0${i}${j}`)
            s.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
            dpsub1.AddToMenu(s);
        }
        // for (let j = 0; j < sub_dp2_count; j++) {
        //     const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[7], 1.5), `0${i}${j}`)
        //     dpsub1.AddToMenu(s);
        // }
    }

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT
    dp.Calc_no_gfx_update();
    dp.Render()
    dp.ConstructListeners();

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    View_build_group_from_root_mesh(dp)

}



function CreateDropdown2(pos, id, root_widget=ROOT_WIDGETS.CREATE_ROOT) {

    const pad = [3, 1]
    const margin = [10, 7]
    let col = GetSequencedColor()
    const dp = Create_widget_dropdown(root_widget, `${id}`, pos, col, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    dp.CreateClickEvent();
    // dp.CreateMoveEvent();


    const sub_dp1_count = 1;
    const sub_dp2_count = 1;
    
    col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        col = GetRandomColor()
        const dpsub2 = Create_widget_dropdown(_, `${i}0`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
        dp.AddToMenu(dpsub2);

        {
            col = GetRandomColor()
            const dpsub3 = Create_widget_dropdown(_, `${i}00`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
            dpsub2.AddToMenu(dpsub3);
            {
                col = GetRandomColor()
                const dpsub4 = Create_widget_dropdown(_, `${i}000`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
                dpsub3.AddToMenu(dpsub4);
                {
                    col = GetRandomColor()
                    const dpsub5 = Create_widget_dropdown(_, `${i}0000`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
                    dpsub4.AddToMenu(dpsub5);
                }
            }

        }


    }

    if(root_widget & ROOT_WIDGETS.CREATE_ROOT){

        dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
        dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT
        dp.Calc_no_gfx_update();
        dp.Render()
        dp.ConstructListeners();
        
        // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
        View_build_group_from_root_mesh(dp)
    }



    return dp;

}

function CreateDropdown2InSection(pos, id) {

    const pad = [2, 1]
    const margin = [7, 7]


    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[2], 1.5), 'S')
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    const dp = Create_widget_dropdown(_, `0`, [0,0,pos[2]], GREY[2], BLUE_10_120_220, WHITE, pad, _, _, _, margin);
    dp.CreateClickEvent();
    dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    Dropdown_roots_set_root(dp, dp);
    
    section.AddItem(dp)
    
    
    const sub_dp1_count = 3;
    const sub_dp2_count = 1;
    
    const col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {
        
        
        const label = Create_widget_label(_, `sssdsdsdsdsLabel ${id++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0,0,pos[2]], fontsize, GREY[1], WHITE, [14, 4], .5);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.AddToMenu(label);
        
        const col1 = GetSequencedColor()
        const dpsub2 = Create_widget_dropdown(_, `${i}0`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col1, WHITE, pad, _, _, _, margin);
        dpsub2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.AddToMenu(dpsub2);

        // const col2 = GetSequencedColor()
        // {
        //     const dpsub3 = Create_widget_dropdown(_, `${i}00`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //     dpsub2.AddToMenu(dpsub3);
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}000`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0000`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0001`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}001`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0010`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0011`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        // }
        // {
        //     const dpsub3 = Create_widget_dropdown(_, `${i}01`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //     dpsub2.AddToMenu(dpsub3);
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}010`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0100`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0101`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        //     {
        //         const dpsub5 = Create_widget_dropdown(_, `${i}011`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //         dpsub3.AddToMenu(dpsub5);
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0110`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //         {
        //             const dpsub4 = Create_widget_dropdown(_, `${i}0111`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
        //             dpsub5.AddToMenu(dpsub4);
        //         }
        //     }
        // }

    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

    section.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    section.Calc_no_gfx_update();


    section.Render()

    View_build_group_from_root_mesh(section)

    // section.ConstructListeners();
    section.ConstructListeners();


    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes

    return dp;

}


// function CreateSceneMenuBar(item) {

//     const pos = [VIEWPORT.WIDTH/2, 25, 0]

//     const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6, 6], pos, [VIEWPORT.WIDTH/2, 20], TRANSPARENCY(GREY[0], .9))
//     // const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6, 6], pos, [100, 20], TRANSPARENCY(GREY[0], .9))
//     section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//     // section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
//     // section.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);

//     section.rel_comp = Relative_pos_comp_create_new_comp();


//     // const menu = Create_widget_menubar(_, pos, TRANSPARENCY(GREY[1], .6), WHITE, 'Widget', [10, 6]);
//     // // menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
//     // // menu.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP);
//     // // menu.CreateListenEEvent(LISTEN_EVENT_TYPES.HOVER);
//     // menu.AddCloseButton(_, section, 'x');
//     // menu.AddMinimizeButton(_, section);
//     // menu.options = SECTION.HORIZONTAL | SECTION.INHERIT;
//     // section.AddItem(menu);
    
//     // Create items for the section
//     section.AddItem(item);
//     // Command_buffer_store(Relative_pos_comp_recalc_all, item);
//     // Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, section, item.idx);
//     // Command_buffer_store(Relative_pos_comp_recalc_all, section);
    
    
    
//     section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    
    
//     section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENTY | SECTION.FIXED_W;
//     // section.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENTY;
//     section.Calc_no_gfx_update();

//     Relative_pos_comp_add_child_to_comp(REL_POS.RIGHT, section, item.idx);
//     Command_buffer_store(Relative_pos_comp_recalc_all, section);
    
//     section.Render();


//     section.ConstructListeners();

//     // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
//     View_build_group_from_root_mesh(section);
//     // View_set_view_vb_start(section.group_bufferidxs, section.gfx.vb.start);
// }




function CreateSceneMenuBar() {

    const pos = [0, 0, 0]
    const margin = [6,6];

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6,6], pos, [VIEWPORT.WIDTH/2 - margin[0], 100], TRANSPARENCY(GREY[1], .4))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.SetName('Main Window')
    section.StateEnable(MESH_STATE.IS_RESIZEABLE);
    section.type |= MESH_TYPE.WIDGET_WINDOW;
    
    const menu = Create_widget_menubar(_, [0,0,pos[2]+1], _, TRANSPARENCY(GREY[1], .4), WHITE, 'Menu Bar', [10, 6]);
    section.AddItem(menu);
    

    // Create statistics menu
    const statistics = Debug_info_ui();
    // statistics.menu.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
    // statistics.options = SECTION.VERTICAL;
    menu.AddToMenuBar(statistics, REL_POS.LEFT);

    menu.AddCloseButton(_, section, 'x');
    menu.AddMinimizeButton(_, section);
    
    
    
    // menu.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.EXPAND;
    menu.options = SECTION.HORIZONTAL | SECTION.EXPAND;


    // Create a dropdown in the windows area
    {
        const dp = Create_widget_dropdown(_, 'Dp', [0, 0, 0], YELLOWR[4], GREY[2], _, _, _, _, _, _);
        dp.CreateClickEvent();
        dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
        Dropdown_roots_set_root(dp, dp);
        section.AddItem(dp);
    
        {
        const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
        dp.AddToMenu(switch1);
        }
        {
        const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
        dp.AddToMenu(switch1);
        }
        {
        const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
        dp.AddToMenu(switch1);
        }
    }
    // Create Second dropdown in the windows area
    {
        const dp = Create_widget_dropdown(_, 'Dp', [0, 0, 0], YELLOWR[4], GREY[2], _, _, _, _, _, _);
        dp.CreateClickEvent();
        dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
        Dropdown_roots_set_root(dp, dp);
        section.AddItem(dp);
    
        {
        const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
        dp.AddToMenu(switch1);
        }
        {
        const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
        dp.AddToMenu(switch1);
        }
        {
        const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
        dp.AddToMenu(switch1);
        }
    }


    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.FIXED_W;
    section.Calc_no_gfx_update();
    section.options &= ~SECTION.RESIZE_PARENT;
    
    section.Render();
    
    section.ConstructListeners();
    
    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    View_build_group_from_root_mesh(section);
    // View_set_view_vb_start(section.group_bufferidxs, section.gfx.vb.start);


    /** Create Test Animations */
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, dp, .03, 0., 1.)
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, statistics, .01, 0., .4)
    // const btn = statistics.children.buffer[0]
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, btn.text_mesh, .01, 0.1, .9)
}


function  CreateWindowWithMenu() {

    const pos = [200, 200, 0]

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6, 6], pos, [0, 0], TRANSPARENCY(GREEN[2], .9))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.SetName('ROOT')
    section.StateEnable(MESH_STATE.IS_RESIZEABLE);
    section.type |= MESH_TYPE.WIDGET_WINDOW;
    
    const menu = Create_widget_menubar(_, [0,0,pos[2]], _, TRANSPARENCY(GREY[1], .4), WHITE, 'Menu Bar', [10, 6]);
    section.AddItem(menu);
    

    const l1 = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(GREY[1], 1.0), WHITE);
    menu.AddToMenuBar(l1);
    const l2 = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(PURPLER[5],1.0), WHITE);
    menu.AddToMenuBar(l2);
    // Create dropdown menu
    const dp = Create_widget_dropdown(_, 'Options', [0, 0, 0], GREY[1], TRANSPARENCY(YELLOWL[8], .3), WHITE, _, _, _, _, [2,2]);
    Dropdown_roots_set_root(dp, dp);
    dp.menu.options = SECTION.VERTICAL | SECTION.RESIZE_PARENT | SECTION.EXPAND;
    dp.options = SECTION.VERTICAL;
    // menu.AddToMenuBar(dp, REL_POS.LEFT);
    
    
    // Add a switch to the menu's dropdown
    const switch1 = CreateSwitchSimple([0,0,pos[2]], 0);
    dp.AddToMenu(switch1);
    
    // Add a dp to the menu's dropdown
    const dp_menu = CreateDropdown2([0,0,pos[2]], 0, null)
    dp.AddToMenu(dp_menu);
    
    {
        const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
        dp.AddToMenu(label);
    }
    {
        const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
        dp.AddToMenu(label);
    }
    {
        const label = Create_widget_label(_, 'Hi', _, _, 8, TRANSPARENCY(BLUEL[9], .9), WHITE);
        dp.AddToMenu(label);
    }
    menu.AddToMenuBar(dp, REL_POS.LEFT);

    menu.AddCloseButton(_, section, 'x');
    menu.AddMinimizeButton(_, section);
    
    
    


    // menu.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.EXPAND;
    menu.options = SECTION.HORIZONTAL | SECTION.EXPAND;

    // Create items for the section
    
        {
            // const s = Create_widget_section(_, SECTION.VERTICAL, [6, 6], pos, [0, 0], TRANSPARENCY(PURPLEB[2], .9))
            // s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            // s.SetName('Window Section')
            // section.AddItem(s)
            // {
            //     const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
            //     label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            //     s.AddItem(label)
            // }
            // {
            //     const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
            //     label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            //     s.AddItem(label)
            // }
            // {
            //     const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
            //     label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            //     s.AddItem(label)
            // }
            {
                const dp = Create_widget_dropdown(_, 'Dp', [0, 0, 0], YELLOWR[4], GREY[2], _, _, _, _, _, _);
                dp.CreateClickEvent();
                dp.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT;
                Dropdown_roots_set_root(dp, dp);
                section.AddItem(dp);
        
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
                {
                    const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    dp.AddToMenu(label)
                }
            }
            {
                const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                section.AddItem(label)
            }
            {
                const label = Create_widget_label(_, 'label', _, [0, 0, 0], 10, PURPLEB[3]);
                label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                section.AddItem(label)
            }
        }
    // Sliders
    const sliders = CreateChangeMeshColorFromSliders(ROOT_WIDGETS.NULL);
    section.AddItem(sliders);



    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);

    section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    section.Calc_no_gfx_update();
    section.options &= ~SECTION.RESIZE_PARENT;
    
    section.Render();
    
    section.ConstructListeners();
    
    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    View_build_group_from_root_mesh(section);
    // View_set_view_vb_start(section.group_bufferidxs, section.gfx.vb.start);
}




function CreateManySections(scene) {

    const tr = .7;

    const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    // blu.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [0, 4, 2] })
    // blu.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4)
    
    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.EXPAND;
    // red.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL;
    blu.AddItem(red);

    
    const black1 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(BLACK, tr));
    black1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.AddItem(black1);


    const black2 = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(BLACK, tr));
    black2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.AddItem(black2);

    const black3 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(BLACK, tr));
    black3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.AddItem(black3);


    const black4 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    black4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    red.AddItem(black4);


    const grey11 = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[4], tr));
    grey11.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black1.AddItem(grey11);
        const red111 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
        red111.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        grey11.AddItem(red111);
        const yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr));
        yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        grey11.AddItem(yel_1);
    const purp12 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
    purp12.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black1.AddItem(purp12);
    const blue13 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[5], tr));
    blue13.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black1.AddItem(blue13);
    const green14 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREEN[5], tr));
    green14.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black1.AddItem(green14);


    const bla = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[0], tr));
    bla.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black3.AddItem(bla);
    const pin_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
    pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black4.AddItem(pin_1);
    const blu_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[7], tr));
    blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black4.AddItem(blu_1);
    const yel_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr));
    yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black2.AddItem(yel_2);
    const yel_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    yel_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black3.AddItem(yel_3);
    const gre_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    gre_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black3.AddItem(gre_3);
    const red_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
    red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black2.AddItem(red_4);
    const yel_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
    yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black2.AddItem(yel_4);
    const ora_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    black2.AddItem(ora_4);
    const gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    bla.AddItem(gry1_1);
    const gry1_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[5], tr));
    gry1_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    bla.AddItem(gry1_2);
    const gry1_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[7], tr));
    gry1_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    bla.AddItem(gry1_3);
    const gry2_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    pin_1.AddItem(gry2_1);
    const gry2_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    pin_1.AddItem(gry2_2);
    const gry2_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu_1.AddItem(gry2_3);
    const gry2_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu_1.AddItem(gry2_4);
    const vert_0 = Create_widget_section(_, SECTION.VERTICAL, [20, 20], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    gry1_1.AddItem(vert_0);

    { // Set naming and listeners
        red.SetName('red');
        grey11.SetName('grey11');
        black1.SetName('black1');
        black2.SetName('black2');
        black3.SetName('black3');
        bla.SetName('bla');
        black4.SetName('black4');
        pin_1.SetName('pin_1');
        blu_1.SetName('blu_1');
        purp12.SetName('purp12');
        red111.SetName('red111');
        yel_1.SetName('yel_1');
        yel_2.SetName('yel_2');
        blue13.SetName('blue13');
        yel_3.SetName('yel_3');
        gre_3.SetName('gre_3');
        red_4.SetName('red_4');
        yel_4.SetName('yel_4');
        green14.SetName('green14');
        ora_4.SetName('ora_4');
        gry1_1.SetName('gry1_1');
        gry1_2.SetName('gry1_2');
        gry1_3.SetName('gry1_3');
        gry2_1.SetName('gry2_1');
        gry2_2.SetName('gry2_2');
        gry2_3.SetName('gry2_3');
        gry2_4.SetName('gry2_4');
        vert_0.SetName('vert_0');
    }



    blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    // blu.options = SECTION.INHERIT | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    blu.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.RESIZE_PARENT;
    blu.Calc_no_gfx_update();
    blu.Render();
    blu.ConstructListeners();

    return blu;
}



function CreateScroller(scene) {

    const fontsize = 8;
    const tr = .3;

    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [260, 350, 0], [20, 20], TRANSPARENCY(GREY[1], 1.));
    const colors = REDL;
    const count = colors.length;

    for (let i = 0; i < 100; i++) {

        const chunk = i;
        let row = 0;
        const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [50, 20], TRANSPARENCY(GetRandomColor(), .3), `chunk:${chunk}`);
        section.AddItem(s);

        for (let j = 0; j < 4; j++) {

            let rowobj = 0;
            const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [5, 5], [280, 650, 0], [50, 20], TRANSPARENCY(GREY[1], .9), `chunk:${chunk} row:${j}`);
            s.AddItem(s1);

            for (let k = 0; k < 7; k++) {
                const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6), `chunk:${chunk} row:${j} ${k}`);
                s1.AddItem(s2);

                { // Some labels and a slider
                    // const l = Create_widget_label(_, `Label text ${i}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0], 8, GetRandomColor(), WHITE);
                    // s.AddItem(l);
                    // const ss = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [50, 20], TRANSPARENCY(GetRandomColor(), tr));
                    // s.AddItem(ss);
                    // const ll = Create_widget_label(_, `Sub Label text${i}1`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0], 8, GetRandomColor(), WHITE);
                    // ss.AddItem(ll);
                    // const sl = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                    // s.AddItem(sl);
                    // { // Many Sliders
                    //     const sss = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [50, 20], TRANSPARENCY(GetRandomColor(), tr));
                    //     ss.AddItem(sss);
                    //     {
                    //         const sl2 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                    //         sss.AddItem(sl2);
                    //     }
                    //     {
                    //         const sl2 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                    //         sss.AddItem(sl2);
                    //     }
                    //     {
                    //         const sl2 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                    //         sss.AddItem(sl2);
                    //     }
                    //     {
                    //         const sl2 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                    //         sss.AddItem(sl2);
                    //     }
                    //     {
                    //         const sl2 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                    //         sss.AddItem(sl2);
                    //     }
                    //     {
                    //         const sl2 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                    //         sss.AddItem(sl2);
                    //     }
                    // }
                }
                { // Large text
                    // {
                    //     const l = Create_widget_label(_, `Some large Label text  ${i} 0000000000000000000`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0], 8, GetRandomColor(), WHITE);
                    //     s.AddItem(l);
                    // }
                    // {
                    //     const l = Create_widget_label(_, `Some large Label text  ${i} 0000000000000000000`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0], 8, GetRandomColor(), WHITE);
                    //     s.AddItem(l);
                    // }
                    // {
                    //     const l = Create_widget_label(_, `Some large Label text  ${i} 0000000000000000000`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0], 8, GetRandomColor(), WHITE);
                    //     s.AddItem(l);
                    // }
                    // {
                    //     const l = Create_widget_label(_, `Some large Label text  ${i} 0000000000000000000`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0], 8, GetRandomColor(), WHITE);
                    //     s.AddItem(l);
                    // }
                }
                { // Large text
                    // {
                    // const dt = Create_widget_multi_text(_, 'Dynamic text', 'value', ALIGN.VERTICAL, [100, 300, 0], 6, BLUE_10_120_220, PURPLER[7]);
                    // dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    // dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    // dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    //     dt.CreateNewText('1234567890jhsdhansdiojjsodioksdlkaslkdopklxcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', _fontsize, WHITE, [2, 2]);
                    // dt.Align_pre(dt, ALIGN.VERTICAL);
                    // s.AddItem(dt);
                    // }
                }
            }
            row++;
        }
    }

    // Create scroller for the ui-mesh info widget
    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 140]);
    scroller.StateEnable(MESH_STATE.ACTIVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    scroller.options = SECTION.VERTICAL | SECTION.INHERIT;
    scroller.scrolled_section.options = SECTION.VERTICAL | SECTION.INHERIT;
    
    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    
    scroller.ScrollerAlign();
    
    View_build_group_from_root_mesh(scroller.scrolled_section);

    const clip_top = scroller.geom.pos[1];
    const clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]*2;
    Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);

    scroller.Render();

    View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);

    scroller.ConstructListeners();

    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, section);

    // { // Add more items to the scroller's scrolled section, to debug the correct behavior of the scroller's re-size and reposition.
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, [], []);
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }

    return scroller;
}

function CreateScrollerClampAlphaTest(scene) {

    const colors = [
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8],
    ];
    const fontsize = 14;
    
    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
    
    
    // const count = colors.length;
    const count = 16;
    for (let i = 0; i < count; i++) {
        const label = Create_widget_label(_, `${i}`, _, [0, 0, 2], fontsize, TRANSPARENCY(colors[i], 1.7), WHITE, [6,4])

        label.SetName(`${label.id}`);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        section.AddItem(label);
    }


    // Create scroller for the ui-mesh info widget
    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 90]);
    scroller.StateEnable(MESH_STATE.ACTIVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    
    scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
    scroller.scrolled_section.options = SECTION.VERTICAL;
    
    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    
    scroller.ScrollerAlign();

    scroller.SetPosYNoGfxUpdate(200)
    scroller.SetPosXNoGfxUpdate(100)

    View_build_group_from_root_mesh(scroller.scrolled_section);

    const clip_top = scroller.GetPosY();
    const clip_bottom = clip_top + scroller.geom.dim[1]*2;
    // const clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1];
    Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);

    scroller.Render();

    View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);

    scroller.ConstructListeners();


    // TESTING new impl of Relative positions
    // Mesh_unif_get_vb_root_wposy(scroller.scrolled_section.root_posidx)



    // TEST CLAMP children buffer
    {
        // scroller.renderables.size = 10;
        // scroller.renderables.center = scroller.renderables.size/2;
        // scroller.renderables.first_all = 0;
        // scroller.renderables.last_all = scroller.renderables.size ;
        // TEMP_CONCATE_(scroller.scrolled_section, scroller.renderables);
    }
    // TEST CLAMP ONLY GFX
    {
        // scroller.scrolled_section.SetClampY(scroller.geom.pos[1], scroller.geom.dim[1], 300);
        // Clipy_chunks_impl(scroller.scrolled_section, scroller.scrolled_section.clamp[CLAMP.Y], scroller.renderables);
    }

    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);


    // { // Add more items to the scroller's scrolled section, to debug the correct behavior of the scroller's re-size and reposition.
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, [], []);
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }

    return scroller;
}

function CreateScrollerDp(scene) {

    const colors = [
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
        REDL[0], REDL[1], REDL[2], REDL[3], REDL[3], REDL[4], REDL[5], REDL[6], REDL[7], REDL[8], BLUEL[0], BLUEL[1], BLUEL[2], BLUEL[3], BLUEL[4], BLUEL[5], BLUEL[6], BLUEL[7], BLUEL[8], BLUEL[9],
    ];
    const count = colors.length;
    const fontsize = 14;
    const col_menu = TRANSPARENCY(PURPLEB[1], .9), col_dp = TRANSPARENCY(ORANGER[5], 1.);
    const margin = [4, 4]; const style = [0, 3, 1];

    // const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [270, 350, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
    const section = Create_widget_dropdown(_, 'Dp', [100, 100, 0], col_dp, col_menu, _, _, _, _, style, margin);
    Dropdown_roots_set_root(section, section);

    // const count = 100;
    for (let i = 0; i < count; i++) {
        // const label = Create_widget_section(_, _, _, [400, 300, 0], [20,20], TRANSPARENCY(colors[i], .7), `Section${i + 1}`)
        // const label = Create_widget_text(_, `${i}`, [100, 100, 2], fontsize, TRANSPARENCY(colors[i], .7), WHITE)
        const label = Create_widget_label(_, `${i} THIS IS A LARGE TEXT FOR TESTING`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(colors[i], 1.7), WHITE)

        label.SetName(`${label.id}`);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        // section.AddItem(label);
        section.AddToMenu(label);
    }

    // Create scroller for the ui-mesh info widget
    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 140]);
    scroller.StateEnable(MESH_STATE.ACTIVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // scroller.scrolled_section.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.EXPAND | SECTION.VERTICAL;
    scroller.scrolled_section.options =  SECTION.HORIZONTAL | SECTION.TOP_DOWN | SECTION.INHERIT;

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
    scroller.Calc_no_gfx_update();

    View_build_group_from_root_mesh(scroller.scrolled_section);

    const clip_top = scroller.geom.pos[1];
    const clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]*2;
    Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
    // Clampx_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);

    scroller.Render();

    View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);

    scroller.ConstructListeners();



    // TEST CLAMP children buffer
    {
        // scroller.renderables.size = 10;
        // scroller.renderables.center = scroller.renderables.size/2;
        // scroller.renderables.first_all = 0;
        // scroller.renderables.last_all = scroller.renderables.size ;
        // TEMP_CONCATE_(scroller.scrolled_section, scroller.renderables);
    }
    // TEST CLAMP ONLY GFX
    {
        // scroller.scrolled_section.SetClampY(scroller.geom.pos[1], scroller.geom.dim[1], 300);
        // Clipy_chunks_impl(scroller.scrolled_section, scroller.scrolled_section.clamp[CLAMP.Y], scroller.renderables);
    }

    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);


    // { // Add more items to the scroller's scrolled section, to debug the correct behavior of the scroller's re-size and reposition.
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, [], []);
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }

    return scroller;
}


function CreateScrollerWithWidgets(scene) {

    const fontsize = 8;

    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [120, 450, 0], [20, 20], TRANSPARENCY(GREEN[7], 1.6));
    section.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.EXPAND | SECTION.VERTICAL;
    const colors = [REDL[0], REDL[7], REDL[7], REDL[3], REDL[7], REDL[5], REDL[6], REDL[7], REDL[8], REDL[9],];
    let cnt = 0;

    // {
    //     const s = Create_widget_label(_, `Label ${cnt++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], fontsize, TRANSPARENCY(GetRandomColor(), .7), WHITE, [7, 6], .5, undefined, [0, 4, 3])
    //     section.AddItem(s);
    // }
    // {
    //     const s = Create_widget_label(_, `Label ${cnt++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], fontsize, TRANSPARENCY(GetRandomColor(), .7), WHITE, [7, 6], .5, undefined, [0, 4, 3])
    //     section.AddItem(s);
    // }
    // {
    //     const s = Create_widget_slider(_, [200, 100, 0], [150, 10])
    //     section.AddItem(s);
    // }
    // {
    //     const s = Create_widget_slider(_, [200, 100, 0], [150, 10])
    //     section.AddItem(s);
    // }
    {
        const s = Create_widget_dropdown(_, 'DropDown 1', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], REDL[7], WHITE);
        // // s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); 
        s.CreateClickEvent();
        // Dropdown_roots_set_root(s, s); // If dropdown does not  

        {
            const s1 = Create_widget_label(_, `Label ${cnt++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], fontsize, TRANSPARENCY(GetRandomColor(), .7), WHITE, [7, 6], .5, undefined, [0, 4, 3])
            // const s1 = Create_widget_label(_, name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, pos, fontsize, PURPLER[6], WHITE, [5, 5], .5)
            s.AddToMenu(s1);
        }
        {
            const s1 = Create_widget_dropdown(_, 'DropDown 1', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], REDL[7], WHITE);
            s.AddToMenu(s1);
            {
                const s2 = Create_widget_slider(_, [200, 100, 0], [150, 10])
                s1.AddToMenu(s2);
            }
            {
                const s2 = Create_widget_label(_, `Label ${cnt++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 10], fontsize, TRANSPARENCY(GetRandomColor(), .7), WHITE, [7, 6], .5, undefined, [0, 4, 3])
                s1.AddToMenu(s2);
            }
        }
        section.AddItem(s);
    }

    // Create scroller for the ui-mesh info widget
    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 140]);
    scroller.StateEnable(MESH_STATE.ACTIVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    scroller.scrolled_section.options = SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.EXPAND | SECTION.VERTICAL;

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET, _, false);

    scroller.options = SECTION.TOP_DOWN | SECTION.VERTICAL;
    scroller.Calc_no_gfx_update();

    scroller.Render();

    View_build_group_from_root_mesh(scroller.scrolled_section);

    scroller.ConstructListeners();




    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, section);

    return scroller;
}


function Help(scene) {


    const flags = (SECTION.ITEM_FIT);

    //options, margin, pos, dim, col, name
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [200, 100, 0], [100, 100], TRANSPARENCY(GREY[1], .8));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName('Help section')

    // scene.StoreMesh(section)
    const s1 = Create_widget_section(_, SECTION.VERTICAL, [15, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .6));
    s1.SetName('Help section 2')
    s1.options = SECTION.EXPAND | SECTION.VERTICAL;

    let msgs = [];
    for (let i = 0; i < DEBUG_PRINT_KEYS.length; i++) {

        msgs[i] = '\"' + DEBUG_PRINT_KEYS[i].key + '\": ' + DEBUG_PRINT_KEYS[i].discr

        const label = Create_widget_label(_, msgs[i], ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 7, TRANSPARENCY(GREY[1], .4), WHITE, [7, 3], .5, [0, 4, 3])
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        s1.AddItem(label)
    }


    const minimizer = Create_widget_minimize_btn(_, section, section.geom.pos, 12);
    minimizer.SetName('minimi')

    section.AddItem(minimizer);
    section.AddItem(s1)


    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

    section.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT
    section.Calc_no_gfx_update();


    section.Render()

    
    View_build_group_from_root_mesh(section)
    section.ConstructListeners();
    

    // Create_root_widget_buffer(section);
    // Create_widget_tree_from_root(section);
    // Widget_root_batch_create_from_root_children(section.root_bufferidx)

    return section;
}



let first_text_child_idx = INT_NULL; // If minimizer is anabled, have a ref to the fist text child for the text updates
function MeshInfo(scene) {

    const fontsize = 9;
    const pad = [4, 0];
    const pos = [880, 130, 100];

    /********************************************************************************************************************************************************/
    // Info UI
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 10], pos, [0, 0], TRANSPARENCY(GREY[1], .8), 'MeshInfoUiTip');
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.ConstructListeners();

    /********************************************************************************************************************************************************/
    // Menu bar and Minimizer
    const menu = Create_widget_menubar(_, pos, _, TRANSPARENCY(GREY[4], .7), WHITE, 'Info tip', [10, 6]);
    menu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    menu.AddMinimizeButton(_, section);
    menu.options = SECTION.HORIZONTAL | SECTION.INHERIT;
    section.AddItem(menu);

    /********************************************************************************************************************************************************/
    // All the info text                            _, 'Meshes:', align, [0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], fontsize, GREY[7], .5, pad1
    const infomesh = Create_widget_multi_text(_, 'Mesh name 000000000000', ALIGN.VERTICAL, [420, 15, 100], fontsize, GREEN[7], pad, .4);
    first_text_child_idx = section.AddItem(infomesh);

    // For mesh-parent-rect 
    infomesh.CreateNewText('{meshidx:0000} {rootidx:00} {groupidx:[00] vb:[00]}', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('pos: [0000,0000,0] dim:[0000,0000] defpos: [0000,0000,0] defdim:[0000,0000]', fontsize, ORANGE_240_160_10, pad, .9);
    infomesh.CreateNewText('alpha:0.00, max-size:0000', fontsize, ORANGE_240_160_10, pad, .9);
    infomesh.CreateNewText('gfx: prog:0, vb:00, start:00000 faces:0000', fontsize, BLUE_10_120_220, pad, .9);

    // For text_mesh
    infomesh.CreateNewText('Text: name of the text and id', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('pos: 0000,0000,0, dim: 0000,0000, alpha: 0.00', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('gfx: group:0, prog:0, vb:0, start:00000, faces:00000', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.SetName('Info Mesh 2');

    // DEBUG COUNTERS 
    TEMP_TEST_PERFORMANE_COUNTERS.MISC_IDX = infomesh.CreateNewText('GENERIC DEBUG: 00000000000000000000', fontsize, BLUE_10_120_220, pad, .9);
    section.geom.pos[0] = VIEWPORT.RIGHT - infomesh.GetMaxWidth() * 2 - 30;
    section.geom.pos[1] = VIEWPORT.TOP;

    infomesh.Align_pre(infomesh, ALIGN.VERTICAL)


    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.EXPAND | SECTION.RESIZE_PARENT;
    section.Calc_no_gfx_update();
    section.Render();
    section.ConstructListeners();

    // View_build_group_from_root_mesh(section);
    // DEBUG_INFO.UI_MESH.IDX = section.idx;

    return section;
}

// TODO: The text updates the gfx buffers regardless of if any change has happened
let prev_infomesh = null; // A way to compare with prev update and skip updating if we are hovering the same mesh
function MeshInfoUpdate(params) {


    const minimize_btn = params.params.mesh.children.buffer[first_text_child_idx - 1].children.buffer[0];
    if (minimize_btn.toggle === true)
        return;

    // _pt_mesh_info_tip.timer.Start();

    // TODO: IMPLEMENT - Skip if nothing changed(from previous hover). The question is how to implement an easy and efficient change

    const textMesh = params.params.mesh.children.buffer[first_text_child_idx];
    const infoMesh = STATE.mesh.hovered;

    // if (infoMesh && infoMesh !== prev_infomesh) { // Avoid update if mesh is same with the mesh of previous update.
    if (infoMesh) {

        prev_infomesh = infoMesh;

        textMesh.RenderTextFromString(infoMesh.GetName());

        const gfx = (infoMesh.gfx !== null) ? `gfx: prog:${infoMesh.gfx.prog.idx}, vb:${infoMesh.gfx.vb.idx}, start:${infoMesh.gfx.vb.start} faces:${infoMesh.geom.num_faces}` : 'null'

        const max_size = infoMesh.max_size ? infoMesh.max_size : 'null';

        let msgs = [
            `{meshidx:${infoMesh.mesh_bufferidx}} {rootidx:${infoMesh.root_bufferidx}} {groupidx:[${infoMesh.group_bufferidxs[0]}] vb:[${infoMesh.group_bufferidxs[0]}]}`,
            `pos:[${FloorArr3(infoMesh.geom.pos)}] dim:[${FloorArr2(infoMesh.geom.dim)}] defpos:[${FloorArr3(infoMesh.geom.defPos)}] defdim:[${FloorArr2(infoMesh.geom.defDim)}]`,
            `alpha:${infoMesh.mat.col[3]} max-size:${max_size}`,
            gfx,
            // (STATE.mesh.hovered) ? `HOVERED: name:${STATE.mesh.hovered.GetName()}, id:${STATE.mesh.hoveredId}` : 'HOVERED: NULL',
            // (STATE.mesh.focused) ? `FOCUSED: name:${STATE.mesh.focused.GetName()}, id:${STATE.mesh.focusedId}` : 'FOCUSED: NULL',

        ];

        // Create info for any text gfx, if exists
        const child = (infoMesh.children.boundary && infoMesh.children.buffer[0]) ? infoMesh.children.buffer[0] : null;
        if (child) {
            if (child.type & MESH_TYPE.FONT_MATERIAL) { // Plain text

                const text_num_faces = (child.text_mesh) ? child.text_mesh.geom.num_faces : child.geom.num_faces; // If child is of type label and has 'text_mesh' else is plain text.

                msgs.push(`Plain Text:${child.GetName()}, dim: ${child.id}`);
                msgs.push(`{pos:[${FloorArr3(child.geom.pos)}]} {dim:[${child.geom.dim}]}, {alpha:${child.mat.col[3]}}`);
                msgs.push(`1gfx: prog:${child.gfx.prog.idx}, vb:${child.gfx.vb.idx}, start:${child.gfx.vb.start}, faces:${text_num_faces}`);
            }
            else if (child.text_mesh) { // Text in label or any other mesh that has text_mesh
                msgs.push(`Text_mesh: id:${child.text_mesh.id}, name:${child.text_mesh.GetName()},`);
                msgs.push(`{pos:[${FloorArr3(child.text_mesh.geom.pos)}]}, {dim: [${child.text_mesh.geom.dim}]}, {alpha:${child.text_mesh.mat.col[3]}}`);
                msgs.push(`2gfx: {prog:${child.text_mesh.gfx.prog.idx}}, {vb:${child.text_mesh.gfx.vb.idx}}, {start:${child.text_mesh.gfx.vb.start}}, {faces:${child.text_mesh.geom.num_faces}}`);
            }
        }
        else if (infoMesh.text_mesh) {
            msgs.push(`Text_mesh: id:${infoMesh.text_mesh.id}, name:${infoMesh.text_mesh.GetName()},`);
            msgs.push(`pos:[${FloorArr3(infoMesh.text_mesh.geom.pos)}], dim: [${FloorArr2(infoMesh.text_mesh.geom.dim)}], alpha:${infoMesh.text_mesh.mat.col[3]}`);
            msgs.push(`3gfx: prog:${infoMesh.text_mesh.gfx.prog.idx}, vb:${infoMesh.text_mesh.gfx.vb.idx}, start:${infoMesh.text_mesh.gfx.vb.start}, faces:${infoMesh.text_mesh.geom.num_faces}`);
        }

        // msgs.push(`Framebuffer counter:${TEMP_TEST_PERFORMANE_COUNTERS.FRAMEBUFFER}`);
        // msgs[TEMP_TEST_PERFORMANE_COUNTERS.MISC_IDX] = `MISC:${TEMP_TEST_PERFORMANE_COUNTERS.MISC}`;
        const mouse_pos = MouseGetPos();
        msgs[TEMP_TEST_PERFORMANE_COUNTERS.MISC_IDX] = `MISC:${mouse_pos[0]} ${mouse_pos[1]}`;

        // Update info text
        for (let i = 0; i <= textMesh.children.boundary; i++) {

            const childText = textMesh.children.buffer[i];

            if (msgs[i]) childText.RenderTextFromString(msgs[i]);
            else childText.RenderTextFromString('NULL')
        }
    }

    // _pt_mesh_info_tip.timer.Stop();
}

function Create3DCubes(scene) {

    { // Create cube
        {
            const geom = new CubeGeometry([80, 450, -1], [100, 100, 100], [1, 1, 1]);
            const mat = new Material_TEMP_fromBufferFor3D(WHITE)
            mat.EnableGfxAttributes(MAT_ENABLE.ATTR_VERTEX_COLOR, {
                color: [
                    0.9, 0.0, 0.0, .4,
                    0.0, 0.9, 0.1, .4,
                    0.0, 0.0, 0.9, .4,
                    0.9, 0.0, 0.9, .4
                ]
            });
            const cube = new Mesh(geom, mat);
            scene.AddMesh(cube);

            console.log('cube', GetShaderTypeId(cube.sid), cube.sid)
            cube.type |= geom.type;
            cube.type |= mat.type;
        }
        {
            const geom = new CubeGeometry([240, 450, -1], [100, 100, 100], [1, 1, 1]);
            const mat = new Material_TEMP_fromBufferFor3D(WHITE);
            mat.EnableGfxAttributes(MAT_ENABLE.ATTR_VERTEX_COLOR, {
                color: [
                    1.0, 1.0, 0.0, .4,
                    0.0, 0.7, 0.4, .4,
                    0.0, 1.0, 0.0, .4,
                    1.0, 0.0, 1.0, .4,
                ]
            });
            const cube2 = new Mesh(geom, mat);
            scene.AddMesh(cube2);
            console.log('cube2:', GetShaderTypeId(cube2.sid), cube2.sid)
            cube2.type |= geom.type;
            cube2.type |= mat.type;
        }
        {
            const geom = new CubeGeometry([400, 450, -1], [100, 100, 100], [1, 1, 1]);
            const mat = new Material_TEMP_fromBufferFor3D(WHITE);
            mat.EnableGfxAttributes(MAT_ENABLE.ATTR_VERTEX_COLOR, {
                color: [
                    0.9, 0.0, 0.0, .4,
                    0.0, 0.9, 0.1, .4,
                    0.0, 0.0, 0.9, .4,
                    0.9, 0.0, 0.9, .4
                ]
            });
            const cube3 = new Mesh(geom, mat);
            scene.AddMesh(cube3);
            console.log('cube3:', GetShaderTypeId(cube3.sid), cube3.sid)
            cube3.type |= geom.type;
            cube3.type |= mat.type;
        }
    }
}



/**

 */

