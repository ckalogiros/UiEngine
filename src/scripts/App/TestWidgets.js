"use strict";
import { Widget_Button, Widget_Switch } from '../Engine/Drawables/Widgets/WidgetButton.js';
import { Widget_Text } from '../Engine/Drawables/Widgets/WidgetText.js';
// import { CubeGeometry } from '../Engine/Drawables/Geometry/Geometry3DCube.js';
import { TimeIntervalsCreate } from '../Engine/Timers/TimeIntervals.js';
import { Mesh } from '../Engine/Drawables/Meshes/Base/Mesh.js';
import { Widget_Menu_Bar, Widget_Minimize } from '../Engine/Drawables/Widgets/WidgetMenu.js';
import { Geometry2D } from '../Engine/Drawables/Geometry/Base/Geometry.js';
import { FloorArr2, FloorArr3 } from '../Helpers/Math/MathOperations.js';
import { Material } from '../Engine/Drawables/Material/Base/Material.js';


import { DEBUG_PRINT_KEYS } from '../Engine/Controls/Input/Keys.js';
import { GetShaderTypeId } from '../Graphics/Debug/GfxDebug.js';

import { Dropdown_roots_set_root, Widget_Dropdown } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Debug_info_ui_performance } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { Scroller_clampy_and_render, Widget_Scroller } from '../Engine/Drawables/Widgets/WidgetScroller.js';
import { GetRandomColor, GetSequencedColor } from '../Helpers/Helpers.js';
import { Gl_framebuffer_render, Gl_framebuffer_render_mesh } from '../Graphics/Buffers/FrameBuffers.js';
import { Textured_Mesh } from '../Engine/Drawables/Meshes/Textured_Mesh.js';
import { FontGetUvCoords } from '../Engine/Loaders/Font/Font.js';
import { Font_get_char_uv_coords } from '../Engine/Loaders/Font/ChlumskyFontMetricsLoader.js';
import { PerformanceTimersGetFps, PerformanceTimersGetWorstFps, Performance_timers_get_avg_1sec_reset, _pt_loop, _pt_mesh_info_tip, _pt_test_misc_1, _pt_test_misc_2 } from '../Engine/Timers/PerformanceTimers.js';
import { Create_widget_button, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_minimize_btn, Create_widget_multi_text, Create_widget_scroller, Create_widget_section, Create_widget_slider, Create_widget_switch, Create_widget_text } from '../Engine/Core/CreateWidget.js';
import { Mesh_buffer_get_mesh_byidx, Widget_group_create, Widget_group_get, Widget_group_update_start, Widget_root_buffer_get_byidx, Widgetroot_buffer_print_w1, Widgetroot_gfx_print_w3 } from '../Engine/Core/MeshBuffer.js';
import { Clamp_y_remove_children_FIRST_TIME_CLAMP } from '../Engine/Drawables/Operations/Clip.js';
import { Calculate_positions_recursive } from '../Engine/Drawables/Meshes/Section.js';
import { BLUEL, BLUE_10_120_220, GREEN, GREY, ORANGE_240_160_10, PURPLE, PURPLER, REDL, WHITE, YELLOWR } from '../Engine/Drawables/Material/Base/Colors.js';


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
    //     console.log(Performance_timers_get_avg_1sec_reset(_pt_loop), PerformanceTimersGetFps(_pt_loop.timer), 'worst', PerformanceTimersGetWorstFps(_pt_loop.timer));
    //     // console.log(Performance_timers_get_avg_1sec_reset(_pt_test_misc_1), PerformanceTimersGetFps(_pt_test_misc_1.timer), 'worst', PerformanceTimersGetWorstFps(_pt_test_misc_1.timer));
    //     console.log(Performance_timers_get_avg_1sec_reset(_pt_test_misc_2), PerformanceTimersGetFps(_pt_test_misc_2.timer), 'worst', PerformanceTimersGetWorstFps(_pt_test_misc_2.timer));
    //     console.log('--------------');
    // }, 1000)






    // Listeners_debug_info_create(scene);

    const uidbg = Debug_info_ui_performance(scene);
    // uidbg.RotateZ(5.5);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, uidbg);
    // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, uidbg);




    /** Lines */
    SdfLine(BLUE_10_120_220, [500, 200, 5], [800, 10]);
    // SdfLine(GREEN[7], [500, 600, 5], [800, 10]);
    // SdfLine(PURPLER[7], [500, 400, 5], [800, 10]);

    // const fb = Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
    { // Draw multiple lines to multiple framebuffers
        // TODO: The idea is to then draw all separate framebuffer textures to one final framebuffer 
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, fb.render_area);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, line);
    }

    /** Misc widgets */

    // const label = CreateLabel('LABEL');
    // CreateLabel('Label2');
    // DEBUG_INFO.UI_MESH.IDX = label.idx;
    // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, label);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, label);

    // CreateManyTextInSection()

    // const button = CreateButton(); 
    // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, button);

    // const switch1 = CreateSwitch();

    // CreateSlider();

    // CreateMenu(scene)

    // CreateDropdown(scene, [160, 200, 0], 0);
    // CreateDropdown2(scene, [160, 200, 0], 0);
    // CreateDropdown3(scene, [160, 200, 0], 0);
    // CreateLargeDropdown();

    // CreateScroller(scene);
    // CreateScrollerClampAlphaTest(scene)
    // CreateScrollerWithWidgets(scene);


    // CLAMPING TESTS
    {
        // CreateClampWidgets()
    }


    
    // SdfLine([500, TEST_CLIP_TOP, 10], [800, 10]);
    // SdfLine([500, TEST_CLIP_TOP, 10], [800, 10]);
    // SdfLine([500, TEST_CLIP_TOP, 10], [800, 10]);
    // SdfLine([500, TEST_CLIP_TOP, 10], [800, 10]);
    // SdfLine([500, TEST_CLIP_TOP, 10], [800, 10]);
    // SdfLine([500, TEST_CLIP_BOTTOM, 10], [800, 1]);

    /** Section Synthesizes */
    {
        // CreateSectioned_LabelSliderButtonSwitchDynemicText();

        // WIDGET DROPDOWN MENU
        // CreateDropDownWithDropdownsInside(scene)
        // CreateDropDownWidgetWithWidgetsInside(scene)

        // WIDGET MENU
        // CreateDropDownWidgetWithWidgetsInsideWithMenu(scene)
        // CreateSliderWithMenuBar(scene);
        // CreateSectionedMixWidgetsWithMenu(scene)
        // CreateMenuSectioned(scene)

        // PLENTY SECTIONS
        // const s = CreateSectionsSimple(scene);
        // const s = CreateManySections(scene);
        // CreateManySectionsWithLabelsAndMinimizer(scene);
        { // 
            // const fb = Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, s);
            // Rotate framebuffer mesh
            // setInterval(()=>{GlRotateZ2D(fb.render_area.gfx, fb.render_area.geom.dim, TimerGetGlobalTimer()*TimerGetGlobalTimer()*.55)}, 16);
        }
        // const s = CreateManySectionsWithMenu(scene)
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, s);

        // MENU WITH SLIDERS
        // CreateSectionedMenuBarsWithNestedSliders(scene);
        // const m1 = CreateSectionedMenuBarsWithNestedSliders2(scene);
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, m1);
        // CreateSectionedMenuBarsWithNestedWidgets(scene);

        // SCROLLER
        // CreateManySectionsWithScroller(scene)
    }

    // const helpui = Help(scene);
    // Help2(scene);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, helpui);

    // const meshinfo_mesh = MeshInfo(scene)
    // TimeIntervalsCreate(64, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, MeshInfoUpdate, { mesh: meshinfo_mesh });
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, meshinfo_mesh);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, meshinfo_mesh.children.buffer[0]);

    // Meshbuffer_print()

    // const gfxinfo = GfxInfo(scene)
    // TimeIntervalsCreate(100, 'Gfx info tip', TIME_INTERVAL_REPEAT_ALWAYS, GfxInfoUpdate, { gfxinfo: gfxinfo });

    // Scenes_debug_info_create(scene);

    // Renderqueue_set_priority_by_program(FIRST, 1, 1)
    // Renderqueue_set_priority_by_program(FIRST, 0, 1)

    { // Tests
        // Create_read_write_test();
    }


    
}








/**************************************************************************************************************************************/
// Widget Creation Functions

const fontsize = 12;



let labelCount = 1;
function CreateLabel(name = 'Label ') {

    const pos = [20, 310 + (labelCount * 35), 2];
    // const pos = [80, 600, 2];
    // const label = Create_widget_label(_, name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, pos, 10, GREY[1], WHITE, [6, 4], .5);
    const label = Create_widget_label(_, name, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, pos, fontsize, GREY[2], WHITE, [5, 5], .5);
    label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    label.ConstructListeners();

    label.sid.unif |= SID.UNIF.SCREEN_RESOLUTION;
    // label.text_mesh.sid.unif |= SID.UNIF.BLOCK | SID.UNIF.GENERIC;
    // label.text_mesh.sid.unif |= SID.UNIF.BLOCK | SID.UNIF.GENERIC2;

    // const pos = [halfw, VIEWPORT.HEIGHT-halfh, 0];

    label.Activate();
    // label.GenGfxCtx(GFX_CTX_FLAGS.NEW);
    label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    // label.GenGfxCtx(GFX_CTX_FLAGS.ANY);
    label.Render()

    // label.ClampX(30);
    // label.text_mesh.SetColorRGB(REDL);
    // label.text_mesh.UpdateText('REDL');

    // label.Align(ALIGN.BOTTOM | ALIGN.LEFT, [0, 0]);
    // label.Align(ALIGN.BOTTOM | ALIGN.RIGHT, [0, 0]);
    // label.Align(ALIGN.TOP | ALIGN.LEFT, [0, 0]);
    // label.Align(ALIGN.TOP | ALIGN.RIGHT, [0, 0]);


    labelCount++;
    return label;
}

function CreateButton() {

    let ypos = 400
    const btn = Create_widget_button(_, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [20, ypos, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    btn.ConstructListeners();
    btn.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [0, 4, 2] })
    btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    btn.Render();
    btn.text_mesh.SetColorRGB(BLUE_10_120_220);

    // btn.Align(ALIGN.LEFT | ALIGN.TOP, [0, 0]);
    btn.Align(ALIGN.RIGHT | ALIGN.BOTTOM, [15, 5]);

    return btn;
}

function CreateSwitch() {

    let ypos = 450
    const switch1 = Create_widget_switch(_, 'switch on', 'switch off', [20, ypos, 0], fontsize, GREY[1], BLUE_10_120_220, [5, 5], .5);
    switch1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // switch1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    switch1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [0, 4, 2] })
    switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
    switch1.ConstructListeners();

    switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    switch1.Render();
    switch1.text_mesh.SetColorRGB(PURPLER[7], 4);
    ypos += switch1.geom.dim[1] * 2 + 5;


    return switch1;
}

function CreateSlider() {

    const slider = Create_widget_slider(_, [200, 300, 0], [150, 10]);
    // slider.CreateSliderHandleEvent();
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    slider.ConstructListeners();

    slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    slider.Activate();
    slider.Render(GFX_CTX_FLAGS.PRIVATE);

}

function SdfLine(col, pos, dim) {


    const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(col, 1));
    line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    
    // const line1 = Create_widget_section(_, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(GREEN[7], 1.5));
    // line1.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    // line.AddItem(line1)
    
    // line.sid.unif |= SID.UNIF.SCREEN_RESOLUTION;
    // line.sid.unif |=  SID.UNIF.UNIFORM_BLOCK | SID.UNIF.PROJECTION_MATRIX;
    
    line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    line.Activate();
    line.Render();
    // line.Calc();
    line.ConstructListeners();

    // setInterval(()=>{GlRotateZ2D(mesh.gfx, mesh.geom.dim, TimerGetGlobalTimer()*.55)}, 16)
    // GlRotateZ2D(mesh.gfx, mesh.geom.dim, 1.23)

    // gfx_idxs[0] = mesh.gfx.prog.idx;
    // gfx_idxs[1] = mesh.gfx.vb.idx;
    // mesh.Move(-mesh.geom.pos[0]+mesh.geom.dim[0], VIEWPORT.HEIGHT - mesh.geom.pos[1]-mesh.geom.dim[1]);
    // mesh.RotateZ(5.5);

    return line;
}


function CreateDropdown(scene, pos, id) {

    // const pad = [10, 2.5]
    const pad = [4, 2]
    const margin = [8, 8]
    // const dp = Create_widget_dropdown(`DP${id}`, pos, GREY2, BLUE_10_120_220, WHITE, pad);
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `${id}`, pos, GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
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

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    dp.Render(dp.group_bufferidxs[0])
    dp.Calc();
    dp.ConstructListeners();

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    dp.group_bufferidxs = Widget_group_create(dp.mesh_bufferidx, dp.gfx)
    dp.AddToWidgetGroupBuffer(dp.group_bufferidxs[0]);

}


function CreateDropdown3(scene, pos, dim) {

    const pad = [4, 2]
    const margin = [8, 8]
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `0`, pos, GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
    dp.CreateMoveEvent();
    dp.CreateClickEvent();


    const sub_dp1_count = 2;
    const sub_dp2_count = 5;

    const col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const dpsub1 = Create_widget_dropdown(_, `0${i}`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col, WHITE, pad, _, _, _, margin);
        dpsub1.CreateHoverEvent();
        dpsub1.CreateClickEvent();
        dp.AddToMenu(dpsub1);

        for (let j = 0; j < sub_dp2_count; j++) {
            const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[7], 1.5), `0${i}${j}`)
            dpsub1.AddToMenu(s);
        }
        for (let j = 0; j < sub_dp2_count; j++) {
            const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], pos, [20, 10], TRANSPARENCY(GREEN[7], 1.5), `0${i}${j}`)
            dpsub1.AddToMenu(s);
        }
    }

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    dp.Render()
    dp.Calc();
    dp.ConstructListeners();

    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    dp.group_bufferidxs = Widget_group_create(dp.mesh_bufferidx, dp.gfx)
    dp.AddToWidgetGroupBuffer(dp.group_bufferidxs[0]);

}


function CreateDropdown2(scene, pos, id) {

    // const pad = [10, 2.5]
    const pad = [2, 1]
    const margin = [7, 7]
    // const dp = Create_widget_dropdown(`DP${id}`, pos, GREY2, BLUE_10_120_220, WHITE, pad);
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, `${id}`, pos, GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
    dp.CreateMoveEvent();
    dp.CreateClickEvent();


    const sub_dp1_count = 1;
    const sub_dp2_count = 1;

    const col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const col1 = GetSequencedColor()
        const dpsub2 = Create_widget_dropdown(_, `${i}0`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col1, WHITE, pad, _, _, _, margin);
        dp.AddToMenu(dpsub2);

        const col2 = GetSequencedColor()
        {
            const dpsub3 = Create_widget_dropdown(_, `${i}00`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
            dpsub2.AddToMenu(dpsub3);
            {
                const dpsub5 = Create_widget_dropdown(_, `${i}000`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                dpsub3.AddToMenu(dpsub5);
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0000`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0001`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
            }
            {
                const dpsub5 = Create_widget_dropdown(_, `${i}001`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                dpsub3.AddToMenu(dpsub5);
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0010`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0011`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
            }
        }
        {
            const dpsub3 = Create_widget_dropdown(_, `${i}01`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
            dpsub2.AddToMenu(dpsub3);
            {
                const dpsub5 = Create_widget_dropdown(_, `${i}010`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                dpsub3.AddToMenu(dpsub5);
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0100`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0101`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
            }
            {
                const dpsub5 = Create_widget_dropdown(_, `${i}011`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                dpsub3.AddToMenu(dpsub5);
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0110`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
                {
                    const dpsub4 = Create_widget_dropdown(_, `${i}0111`, [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], col2, WHITE, pad, _, _, _, margin);
                    dpsub5.AddToMenu(dpsub4);
                }
            }
        }

    }

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    dp.Render()
    dp.Calc();
    dp.ConstructListeners();


    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    dp.group_bufferidxs = Widget_group_create(dp.mesh_bufferidx, dp.gfx)
    dp.AddToWidgetGroupBuffer(dp.group_bufferidxs[0]);

    // const group = Widget_group_get(dp.group_bufferidxs[0]);
    // const root = Widget_root_buffer_get_byidx(dp.root_bufferidx);
    // for (let i = 0; i < root.boundary; i++) {
    //     const mesh = Mesh_buffer_get_mesh_byidx(root.buffer[i]);
    //     if (mesh.type & MESH_TYPE.WIDGET_BUTTON)
    //         console.log(mesh.text_mesh.mat.text)
    // }

    return dp;

}

function CreateSectioned_LabelSliderButtonSwitchDynemicText() {

    const fontsize = 14;
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [193, 212, 0], [0, 0], TRANSPARENCY(GREY[1], 1.5))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);


    const pos = [0, 0, 0];
    let id = 1;
    {
        const label = Create_widget_label(_, `sssdsdsdsdsLabel ${id++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, pos, fontsize, GREY[1], WHITE, [14, 4], .5);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        section.AddItem(label);
    }
    {
        const label = Create_widget_label(_, `Label ${id++}`, ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, pos, fontsize, GREY[1], WHITE, [14, 4], .5);
        // label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); 
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        section.AddItem(label);
    }

    // With sliders
    {
        const slider = Create_widget_slider(_, [0, 0, 0], [100, 10], TRANSPARENCY(BLUE_10_120_220, .7), [2, 4]);
        section.AddItem(slider);
    }
    {
        const slider = Create_widget_slider(_, [0, 0, 0], [100, 10], TRANSPARENCY(BLUE_10_120_220, .7), [2, 4]);
        section.AddItem(slider);
    }
    {
        const slider = Create_widget_slider(_, [0, 0, 0], [100, 10], TRANSPARENCY(BLUE_10_120_220, .7), [2, 4]);
        section.AddItem(slider);
    }

    // With buttons
    {
        const btn = Create_widget_button(_, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5);
        section.AddItem(btn);
    }

    // With switch
    {
        const switch1 = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5);
        switch1.StateEnable(MESH_STATE.IS_HOVER_COLORABLE)
        switch1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [6, 6, 3] })
        switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
        section.AddItem(switch1);
    }

    // With dynamic text
    {
        const dt = Create_widget_multi_text(_, 'HORIZONTAL Alignment', ALIGN.HORIZONTAL, [0, 500, 0], 8, BLACK, _, [0, 0]);
        dt.CreateNewText('Pad 0', 8, ORANGE_240_160_10, [0, 0]);
        dt.CreateNewText('Pad 10', 8, YELLOWR[7], [10, 0]);
        dt.CreateNewText('Pad 20', 8, ORANGE_240_160_10, [20, 0]);
        dt.CreateNewText('Pad 5', 8, BLUEL[7], [5, 0]);
        section.AddItem(dt);
    }
    {
        const dt = Create_widget_multi_text(_, 'VERTICAL: Align LEFT', ALIGN.VERTICAL | ALIGN.LEFT, [0, 500, 0], fontsize, BLACK, _, [0, 0]);
        dt.CreateNewText('OOOO', fontsize, ORANGE_240_160_10, [20, 0]);
        dt.CreateNewText('OOO', fontsize, YELLOWR[7], [0, 0]);
        dt.CreateNewText('OO', fontsize, ORANGE_240_160_10, [20, 0]);
        dt.CreateNewText('O', fontsize, BLUEL[7], [20, 0]);
        section.AddItem(dt);
    }
    {
        const dt = Create_widget_multi_text(_, 'VERTICAL: Align RIGHT', ALIGN.VERTICAL | ALIGN.RIGHT, [0, 500, 0], fontsize, BLACK, _, [0, 0]);
        dt.CreateNewText('OOOO', fontsize, ORANGE_240_160_10, [20, 0]);
        dt.CreateNewText('OOO', fontsize, YELLOWR[7], [0, 0]);
        dt.CreateNewText('OO', fontsize, ORANGE_240_160_10, [20, 0]);
        dt.CreateNewText('O', fontsize, BLUEL[7], [20, 0]);
        section.AddItem(dt);
    }
    {
        const dt = Create_widget_multi_text(_, 'Dynamic text', ALIGN.VERTICAL | ALIGN.RIGHT, [0, 0, 0], fontsize, BLACK, [0, 0]);
        dt.CreateNewText('Text 2', fontsize, PURPLER[7], [2, 2]);
        dt.CreateNewText('Text 3', fontsize, PURPLER[7], [2, 2]);
        dt.CreateNewText('Text', fontsize, PURPLE_HOT4, [2, 2]);
        dt.CreateNewText('Text 5', fontsize, YELLOWR[7], [2, 2]);

        section.AddItem(dt);
    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.ActivateAndChildrenRecursive()
    section.Render();
    section.Calc(SECTION.EXPAND | SECTION.INHERIT | SECTION.VERTICAL | SECTION.TOP_DOWN);
    section.ConstructListeners();

}

function CreateDropDownWithDropdownsInside(scene) {

    const pad = [10, 2.5]
    const drop_down = Create_widget_dropdown(_, 'DP1', [260, 200, 0], [60, 20], REDL, BLUE_10_120_220, WHITE, pad);
    drop_down.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    drop_down.CreateClickEvent();
    drop_down.CreateMoveEvent();
    drop_down.SetClamp(200, 0)

    { // Add another dropdown in dropdown
        const drop_down3 = Create_widget_dropdown(_, 'DP2', [OUT_OF_VIEW, OUT_OF_VIEW, 0], [60, 20], GREY[1], YELLOWR[7], WHITE, pad);
        drop_down3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        drop_down3.CreateClickEvent();
        drop_down.AddToMenu(drop_down3);
        {
            const drop_down4 = Create_widget_dropdown(_, 'DP3', [OUT_OF_VIEW, OUT_OF_VIEW, 0], [60, 20], GREY[1], GREEN[7], WHITE, pad);
            drop_down4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            drop_down4.CreateClickEvent();
            drop_down3.AddToMenu(drop_down4);

            {
                const drop_down5 = Create_widget_dropdown(_, 'DP4', [OUT_OF_VIEW, OUT_OF_VIEW, 0], [60, 20], GREY[1], PURPLER[7], WHITE, pad);
                drop_down5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                drop_down5.CreateClickEvent();
                drop_down4.AddToMenu(drop_down5);

                {
                    const drop_down6 = Create_widget_dropdown(_, 'DP5', [OUT_OF_VIEW, OUT_OF_VIEW, 0], [60, 20], GREY[1], REDL[7], WHITE, pad);
                    drop_down6.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    drop_down6.CreateClickEvent();
                    drop_down5.AddToMenu(drop_down6);

                    {
                        const text = Create_widget_text(_, 'DP5->Widget_Text', [OUT_OF_VIEW, OUT_OF_VIEW, 0], fontsize, WHITE);
                        drop_down6.AddToMenu(text);
                    }
                }
            }
        }
    }

    // const margin = Get_all_margins_recursive_bottom_up(drop_down);
    drop_down.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    drop_down.Calc();
    drop_down.Render();
    drop_down.ConstructListeners();
    // drop_down.ClampX(80, 0)


}

function CreateLargeDropdown() {

    const s = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [593, 262, 0], [0, 0], TRANSPARENCY(GREY[3], 1.5));

    const pad = [2, 1];
    const margin = [8, 8];
    {
        const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
        dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.CreateClickEvent();
        dp.CreateMoveEvent();
        dp.SetClamp(200, 0);
        s.AddItem(dp)
        Dropdown_roots_set_root(dp, dp);

        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
    }
    {
        const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
        dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.CreateClickEvent();
        dp.CreateMoveEvent();
        dp.SetClamp(200, 0);
        s.AddItem(dp)
        Dropdown_roots_set_root(dp, dp);

        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
    }
    {
        const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
        dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.CreateClickEvent();
        dp.CreateMoveEvent();
        dp.SetClamp(200, 0);
        s.AddItem(dp)
        Dropdown_roots_set_root(dp, dp);

        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
    }
    {
        const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
        dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.CreateClickEvent();
        dp.CreateMoveEvent();
        dp.SetClamp(200, 0);
        s.AddItem(dp)
        Dropdown_roots_set_root(dp, dp);

        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
    }
    {
        const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
        dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.CreateClickEvent();
        dp.CreateMoveEvent();
        dp.SetClamp(200, 0);
        s.AddItem(dp)
        Dropdown_roots_set_root(dp, dp);

        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
    }
    {
        const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
        dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.CreateClickEvent();
        dp.CreateMoveEvent();
        dp.SetClamp(200, 0);
        s.AddItem(dp)
        Dropdown_roots_set_root(dp, dp);

        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
    }
    {
        const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], GREY2, BLUE_10_120_220, WHITE, pad, _, _, _, margin);
        dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        dp.CreateClickEvent();
        dp.CreateMoveEvent();
        dp.SetClamp(200, 0);
        s.AddItem(dp)
        Dropdown_roots_set_root(dp, dp);

        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
        { const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], 6, GREY[1], WHITE, [5, 5], .5); dp.AddToMenu(l); }
    }

    // {
    //     const pad = [10, 2.5]
    //     const dp = Create_widget_dropdown(_, 'DP1', [260, 200, 0], [60, 20], GREY2, BLUE_10_120_220, WHITE, pad);
    //     dp.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     dp.CreateClickEvent();
    //     dp.CreateMoveEvent();
    //     dp.SetClamp(200, 0);
    //     s.AddItem(dp)

    //     { // Add another dropdown in dropdown
    //         const dp3 = Create_widget_dropdown(_, 'DP2', [OUT_OF_VIEW, OUT_OF_VIEW, 0], [60, 20], GREY[1], YELLOWR[7], WHITE, pad);
    //         dp3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //         dp3.CreateClickEvent();
    //         dp.AddToMenu(dp3);
    //         {
    //             const dp4 = Create_widget_dropdown(_, 'DP3', [OUT_OF_VIEW, OUT_OF_VIEW, 0], [60, 20], GREY[1], GREEN[7], WHITE, pad);
    //             dp4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //             dp4.CreateClickEvent();
    //             dp3.AddToMenu(dp4);
    //         }
    //     }
    // }

    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, s, [100, 150]);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    scroller.ActivateAndChildrenRecursive();

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE)

    Scroller_clampy_and_render(scroller, 100, 650);
}

function CreateManyTextInSection() {

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [350, 400, 0], [0, 0], GREY[0]);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    const count = 10;
    for (let i = 0; i < count; i++) {
        const text = Create_widget_text(_, `Text ${i}`, [0, 0, 1], 12, WHITE);
        section.AddItem(text);
    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Calc();
    section.Render();

    section.ConstructListeners();
}

function DestroyMeshTest(scene, widget) {

    const customCallback = function (params) {

        if (widget) {
            console.log('Destroy Text mesh test:', widget.GetName());
            widget.Destroy();
            widget = null;
        }
        else console.log('Widget does not exist')
    }
    const btn1 = Create_widget_button(_, 'Destroy', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [160, 240, 0], 5, GREY[1], WHITE, [4, 4], .5);
    btn1.CreateListenEvent(LISTEN_EVENT_TYPES.CLICK_UP)
    btn1.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.CLICK, customCallback)
    btn1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    btn1.AddListenEvent(LISTEN_EVENT_TYPES_INDEX.HOVER)
    btn1.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
    btn1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [6, 6, 3] })
    btn1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE, gfx_idxs);
    btn1.Render();
    btn1.text_mesh.SetColorRGB(YELLOWR[7]);
}


function CreateMenu(scene) {

    const menu = Create_widget_menubar(ROOT_WIDGETS.CREATE_ROOT, 'Widget Menu bar', ALIGN.LEFT, [200, 500, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
    menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    menu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    menu.AddCloseButton(_, menu, 'x');


    menu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    menu.Render();
    menu.ConstructListeners();
}


function CreateDropDownWidgetWithWidgetsInside(scene) {

    const pad = [10, 2.5]
    const dp = Create_widget_dropdown(ROOT_WIDGETS.CREATE_ROOT, 'DP1', [260, 300, 0], GREY[1], ORANGE_240_160_10, WHITE, pad);
    dp.CreateClickEvent();
    dp.CreateMoveEvent();

    { // Add another dropdown in dropdown
        const drop_down2 = Create_widget_dropdown(_, 'DP2', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], BLUE_10_120_220, WHITE, pad);
        drop_down2.CreateClickEvent();
        dp.AddToMenu(drop_down2);

        { // Add text 
            // {
            //     const text = Create_widget_text(_, 'DP2 TEXT ->', [OUT_OF_VIEW, OUT_OF_VIEW, 0], 10, WHITE);
            //     drop_down2.AddToMenu(text);
            // }
            // { 
            //     const text = Create_widget_text(_, 'DP2 TEXT ->', [OUT_OF_VIEW, OUT_OF_VIEW, 0], 10, WHITE);
            //     drop_down2.AddToMenu(text);
            // }
        }
        {// Scroller

            const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [OUT_OF_VIEW, OUT_OF_VIEW, 0], [20, 10], TRANSPARENCY(GREY2, .5));
            for (let i = 0; i < 10; i++) {

                // const label = Create_widget_label(_, `Label ${i}`, _, [OUT_OF_VIEW, OUT_OF_VIEW, 0], [10, 10], 10, WHITE, BLACK);
                // const label = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0,0,0], 6, GREY[1], WHITE, [5, 5], .5);
                const label = Create_widget_text(_, 'DP2 TEXT ->', [0, 0, 4], 10, WHITE);
                s.AddItem(label)
            }

            const scroller = Create_widget_scroller(_, s, [100, 150]);
            drop_down2.AddToMenu(scroller)
        }

        // // Add label to DP2
        // const label = Create_widget_label(_, 'Labe 1', ALIGN.RIGHT);
        // label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        // label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        // // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
        // // label.CreateClickEvent();
        // drop_down2.AddToMenu(label)
        // // Add button to DP2
        // const btn = Create_widget_button(_, 'Button 1', ALIGN.RIGHT);
        // btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        // drop_down2.AddToMenu(btn)
        // // Add button to DP2
        // const slider = Create_widget_slider(_, [0, 0, 0], [80, 10]);
        // drop_down2.AddToMenu(slider)


        // {
        //     const drop_down3 = Create_widget_dropdown(_, 'DP3 DP1', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], YELLOWR[7], WHITE, pad);
        //     drop_down3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); 
        //     drop_down3.CreateClickEvent();
        //     drop_down2.AddToMenu(drop_down3);
        //     {
        //         const drop_down4 = Create_widget_dropdown(_, 'DP4 DP1', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], GREEN[7], WHITE, pad);
        //         drop_down4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //         drop_down4.CreateClickEvent();
        //         drop_down3.AddToMenu(drop_down4);

        //         {
        //             const drop_down5 = Create_widget_dropdown(_, 'DP5 DP1', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], PURPLER[7], WHITE, pad);
        //             drop_down5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //             drop_down5.CreateClickEvent();
        //             drop_down4.AddToMenu(drop_down5);

        //             {
        //                 const drop_down6 = Create_widget_dropdown(_, 'DP6 DP1', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], REDL[7], WHITE, pad);
        //                 drop_down6.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); 
        //                 drop_down6.CreateClickEvent();
        //                 drop_down5.AddToMenu(drop_down6);

        //                 {
        //                     const text = Create_widget_text(_, 'DP5 -->', [OUT_OF_VIEW, OUT_OF_VIEW, 0], 10, WHITE);
        //                     drop_down6.AddToMenu(text);
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    dp.ActivateAndChildrenRecursive();
    dp.Render();
    // dp.Calc(SECTION.INHERIT|SECTION.TOP_DOWN|SECTION.EXPAND);
    dp.Calc(SECTION.INHERIT);
    dp.ConstructListeners();


    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    dp.group_bufferidxs = Widget_group_create(dp.mesh_bufferidx, dp.gfx)
    dp.AddToWidgetGroupBuffer(dp.group_bufferidxs[0]);

}

// TODO: Is a widget dropdown implementable with a menu bar? If yes, we need to recalc windows section on dp's expansion-contraction
function CreateDropDownWidgetWithWidgetsInsideWithMenu(scene) {

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [250, 400, 0], [0, 0], TRANSPARENCY(GREY[3], .5))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    // {
    //     const menu = Create_widget_menubar(_, 'Widget Menu bar', (ALIGN.HOR_CENTER|ALIGN.VERT_CENTER), [60, 200, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
    //     menu.AddCloseButton(_, section, 'x');
    //     menu.AddMinimizeButton(section);
    //     menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    //     section.AddItem(menu)
    // }

    const pad = [10, 2.5]
    const drop_down = Create_widget_dropdown(_, 'DP1', [260, 300, 0], GREY[1], ORANGE_240_160_10, WHITE, pad);
    // drop_down.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // drop_down.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    drop_down.CreateHoverEvent();
    drop_down.CreateClickEvent();
    // drop_down.CreateMoveEvent();

    { // Add another dropdown in dropdown
        const drop_down2 = Create_widget_dropdown(_, 'DP2', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], BLUE_10_120_220, WHITE, pad);
        drop_down2.CreateHoverEvent();
        drop_down2.CreateClickEvent();
        // drop_down2.CreateMoveEvent();
        drop_down.AddToMenu(drop_down2);

        { // Add text to DP2's menu
            const text = Create_widget_text(_, 'DP2 TEXT ->', [OUT_OF_VIEW, OUT_OF_VIEW, 0], 10, WHITE);
            drop_down2.AddToMenu(text);
        }
        { // Add text to DP2's menu
            const text = Create_widget_text(_, 'DP2 TEXT ->', [OUT_OF_VIEW, OUT_OF_VIEW, 0], 10, WHITE);
            drop_down2.AddToMenu(text);
        }

        // Add label to DP2
        const label = Create_widget_label(_, 'Labe 1', ALIGN.RIGHT);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
        // // label.CreateClickEvent();
        drop_down2.AddToMenu(label)
        // Add button to DP2
        const btn = Create_widget_button(_, 'Button 1', ALIGN.RIGHT);
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        drop_down2.AddToMenu(btn)
        // Add button to DP2
        const slider = Create_widget_slider(_, [0, 0, 0], [80, 10]);
        drop_down2.AddToMenu(slider)


        {
            const drop_down3 = Create_widget_dropdown(_, 'DP3', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], YELLOWR[7], WHITE, pad);
            // drop_down3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); 
            // drop_down3.CreateHoverEvent();
            // drop_down3.CreateClickEvent();
            drop_down2.AddToMenu(drop_down3);
            {
                const drop_down4 = Create_widget_dropdown(_, 'DP4', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], GREEN[7], WHITE, pad);
                // drop_down4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                // drop_down4.CreateHoverEvent();
                // drop_down4.CreateClickEvent();
                drop_down3.AddToMenu(drop_down4);

                {
                    const drop_down5 = Create_widget_dropdown(_, 'DP5', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], PURPLER[7], WHITE, pad);
                    // drop_down5.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                    // drop_down5.CreateHoverEvent();
                    // drop_down5.CreateClickEvent();
                    drop_down4.AddToMenu(drop_down5);

                    {
                        const drop_down6 = Create_widget_dropdown(_, 'DP6', [OUT_OF_VIEW, OUT_OF_VIEW, 0], GREY[1], REDL[7], WHITE, pad);
                        // drop_down6.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); 
                        // drop_down6.CreateHoverEvent();
                        // drop_down6.CreateClickEvent();
                        drop_down5.AddToMenu(drop_down6);

                        {
                            const text = Create_widget_text(_, 'DP6 -->', [OUT_OF_VIEW, OUT_OF_VIEW, 0], 10, WHITE);
                            drop_down6.AddToMenu(text);
                        }
                    }
                }
            }
        }
    }

    section.AddItem(drop_down);

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Render();
    section.Calc();
    section.ConstructListeners();


    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    drop_down.group_bufferidxs = Widget_group_create(drop_down.mesh_bufferidx, drop_down.gfx)
    drop_down.AddToWidgetGroupBuffer(drop_down.group_bufferidxs[0]);

}


function CreateMenuSectioned(scene) {

    const section = Create_widget_section(_, SECTION.VERTICAL, ALIGN.LEFT, [10, 10], [250, 500, 0], [0, 0], TRANSPARENCY(GREY[1], .5))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    {
        const menu = Create_widget_menubar('Widget Menu bar', [60, 200, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
        section.AddItem(menu)
        menu.AddCloseButton(_, section, 'x');
        menu.AddMinimizeButton(section);
        menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        menu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    }
    // {
    //     const lb = Create_widget_label(_, 'Label', ALIGN.BOTTOM, [0, 0, 0], 10, BLUE_10_120_220);
    //     lb.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     lb.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
    //     section.AddItem(lb);
    // }
    // {
    //     const dt = Create_widget_multi_text(_, '0000000', ALIGN.VERTICAL, [0, 0, 0], 10, BLUE_10_120_220, PURPLER[7]);
    //     dt.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     dt.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
    //     section.AddItem(dt);
    // }
    // {
    //     const slider = Create_widget_slider(_, [0, 0, 0], [160, 10], PURPLER[7], [2, 4]);
    //     slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     slider.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
    //     section.AddItem(slider);
    // }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Render();
    section.Calc();
    section.ConstructListeners();

    // Create_root_widget_buffer(section);
    // Create_widget_tree_from_root(section);
    // Widget_root_batch_create_from_root_children(section.root_bufferidx);
}

function CreateSectionedMixWidgetsWithMenu(scene) {

    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 400, 0], [0, 0], TRANSPARENCY(GREY[1], .5))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    {
        // Add Menu bar
        // const menu = Create_widget_menubar (_, 'Widget Menu bar', ALIGN.LEFT, [60, 200, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
        // menu.AddCloseButton(section, 'x');
        // menu.AddMinimizeButton(section);
        // menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
        // section.AddItem(menu)

        // Add Minimizer
        const minimizer = new Widget_Minimize(section, section.geom.pos, 10);
        minimizer.SetName('minimizer')
        minimizer.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        section.AddItem(minimizer)

        // Add close button
        // const close = new Close_Button(section, 'x', section.geom.pos, 10);
        // close.SetName('close')
        // close.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        // section.AddItem(close)
    }
    {
        const lb = Create_widget_label(_, 'Label', ALIGN.BOTTOM, [0, 0, 0], 10, BLUE_10_120_220);
        section.AddItem(lb);
    }
    {
        const dt = Create_widget_multi_text(_, 'Dynamic text', '0000000', ALIGN.VERTICAL, [0, 0, 0], 10, BLUE_10_120_220, PURPLER[7]);
        section.AddItem(dt);
    }
    {
        const slider = Create_widget_slider(_, [0, 0, 0], [60, 10], PURPLER[7], [2, 4]);
        section.AddItem(slider);
    }
    {
        const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(ORANGE_240_160_10, .5))
        s2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

        const menu = Create_widget_menubar(_, 'Widget Menu bar', ALIGN.LEFT, [0, 0, 0], TRANSPARENCY(ORANGE_240_160_10, .5), WHITE, [10, 6]);
        menu.AddCloseButton(_, s2, 'x');
        menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
        s2.AddItem(menu);

        const slider = Create_widget_slider(_, [0, 0, 0], [80, 10], BLUEL[7]);
        s2.AddItem(slider);

        {
            const s3 = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREEN[7], .5))
            s3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

            const menu = Create_widget_menubar(_, 'Widget Menu bar', ALIGN.LEFT, [0, 0, 0], TRANSPARENCY(GREEN[7], .5), WHITE, [10, 6]);
            menu.AddCloseButton(_, s3, 'x');
            menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
            s3.AddItem(menu);

            const slider = Create_widget_slider(_, [0, 0, 0], [80, 10], GREEN[7]);
            s3.AddItem(slider);
            s2.AddItem(s3);
        }

        section.AddItem(s2);
    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Calc();
    section.Render();
    section.ConstructListeners();
}

function CreateManySectionsWithMenu(scene) {


    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [250, 400, 0], [0, 0], TRANSPARENCY(GREY[1], .5))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    { // Create menu bar
        const menu = Create_widget_menubar(_, 'Widget Menu bar', ALIGN.LEFT, [60, 200, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
        menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        menu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        menu.AddCloseButton(_, section, 'x');
        menu.AddMinimizeButton(_, section);
        section.AddItem(menu)
    }

    { // Create sections

        const tr = 1.;
        const flags = (SECTION.ITEM_FIT | SECTION.EXPAND);

        const blu = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [350, 500, 0], [10, 0], TRANSPARENCY(BLUEL[7], tr));
        blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

        const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
        const gre = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        const yel = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        // const ora = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
        // const cie = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
        // const bla = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));


        { // Construct sub-sections
            var bla_1 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
            var pin_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
            var blu_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[7], tr));
            var pur_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE, tr));
            var red_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
            var yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
            var yel_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr));
            var red_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
            var yel_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
            var gre_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
            var red_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
            var yel_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
            var gre_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
            var ora_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
            var gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
            var gry1_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[5], tr));
            var gry1_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[7], tr));
            var gry2_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
            var gry2_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
            var gry2_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
            var gry2_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
            var vert_0 = Create_widget_section(_, SECTION.VERTICAL, [20, 20], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));

        }

        // Construct widgets
        // const label = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);
        // label.SetName('Sectioned btn1')
        // label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        // const btn = Create_widget_button(_, 'btnl', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);
        // btn.SetName('Sectioned btn1')
        // btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        // btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


        // { // Set naming and listeners
        //     red.SetName('red');
        //     gre.SetName('gre');
        //     yel.SetName('yel');
        //     ora.SetName('ora');
        //     cie.SetName('cie');
        //     bla.SetName('bla');
        //     bla_1.SetName('bla_1');
        //     pin_1.SetName('pin_1');
        //     blu_1.SetName('blu_1');
        //     pur_1.SetName('pur_1');
        //     red_1.SetName('red_1');
        //     yel_1.SetName('yel_1');
        //     yel_2.SetName('yel_2');
        //     red_3.SetName('red_3');
        //     yel_3.SetName('yel_3');
        //     gre_3.SetName('gre_3');
        //     red_4.SetName('red_4');
        //     yel_4.SetName('yel_4');
        //     gre_4.SetName('gre_4');
        //     ora_4.SetName('ora_4');
        //     gry1_1.SetName('gry1_1');
        //     gry1_2.SetName('gry1_2');
        //     gry1_3.SetName('gry1_3');
        //     gry2_1.SetName('gry2_1');
        //     gry2_2.SetName('gry2_2');
        //     gry2_3.SetName('gry2_3');
        //     gry2_4.SetName('gry2_4');
        //     vert_0.SetName('vert_0');
        // }

        // { // Set listeners
        //     red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gre.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     yel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     ora.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     cie.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     bla.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     bla_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     pur_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     red_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     red_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     yel_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gre_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gre_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gry1_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gry1_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        //     vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        // }

        // { // Set hierarchy
        //     pin_1.AddItem(gry2_1, flags); pin_1.AddItem(gry2_2, flags);
        //     blu_1.AddItem(gry2_3, flags); blu_1.AddItem(gry2_4, flags);
        //     bla_1.AddItem(pin_1, flags); bla_1.AddItem(blu_1, flags);
        //     red.AddItem(bla_1); red.AddItem(yel, flags); red.AddItem(ora, flags); red.AddItem(cie, flags);
        //     yel.AddItem(gre_4, flags); yel.AddItem(pur_1, flags); yel.AddItem(red_3, flags);
        //     ora.AddItem(yel_4, flags); ora.AddItem(red_4, flags); ora.AddItem(yel_2, flags); ora.AddItem(ora_4, flags);
        //     cie.AddItem(gre_3, flags); cie.AddItem(yel_3, flags); cie.AddItem(bla, flags);
        //     bla.AddItem(gry1_1, flags); bla.AddItem(gry1_2, flags); bla.AddItem(gry1_3, flags);
        //     gry1_1.AddItem(label, flags); gry1_1.AddItem(btn, flags); gry1_1.AddItem(vert_0, flags);
        //     gre.AddItem(yel_1, flags); gre.AddItem(red_1, flags);
        // }

        // const minimizer = Create_widget_minimize_btn(_, blu, blu.geom.pos);
        // minimizer.SetName('minimizer')
        // minimizer.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        // blu.AddItem(minimizer);


        // yel.AddItem(gre, flags);
        // blu.AddItem(red, flags);
        // section.AddItem(blu)
    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Render();
    section.Calc();

    section.ConstructListeners();
    return section;
}


function CreateSectionedMenuBarsWithNestedSliders(scene) {

    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREY[1], .6))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)

    const menu = Create_widget_menubar(_, 'Widget Menu bar 0', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .6), WHITE, [10, 6]);
    menu.AddCloseButton(_, section, 'x');
    section.AddItem(menu);

    const slider = Create_widget_slider(_, [200, 100, 0], [150, 10]);
    section.AddItem(slider);

    {

        const s = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREEN[7], .9))

        const m = Create_widget_menubar(_, 'Widget Menu bar 1', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
        m.AddCloseButton(_, s, 'x');
        s.AddItem(m);

        const sl = Create_widget_slider(_, [200, 100, 0], [150, 10]);
        s.AddItem(sl);
        section.AddItem(s);

        {
            const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(YELLOWR[7], .9))

            const m2 = Create_widget_menubar(_, 'Widget Menu bar 2', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
            m2.AddCloseButton(_, s2, 'x');
            s2.AddItem(m2);

            const sl = Create_widget_slider(_, [200, 100, 0], [150, 10]);
            s2.AddItem(sl);
            s.AddItem(s2);


        }
    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Calc();
    section.ConstructListeners();
    section.Render();


    console.log('section:', section)
}

function CreateSectionedMenuBarsWithNestedSliders2(scene) {

    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREY[1], .9))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    const menu = Create_widget_menubar(_, 'Widget Menu bar 0', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
    menu.AddCloseButton(_, section, 'x');
    section.AddItem(menu);

    const slider = Create_widget_slider(_, [200, 100, 0], [150, 10]);
    section.AddItem(slider);

    {

        const s = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREEN[7], .9))

        const m = Create_widget_menubar(_, 'Widget Menu bar 1', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
        m.AddCloseButton(_, s, 'x');
        s.AddItem(m);

        const sl = Create_widget_slider(_, [200, 100, 0], [150, 10]);
        s.AddItem(sl);

        section.AddItem(s);

        {
            const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(YELLOWR[7], .9))

            const m2 = Create_widget_menubar(_, 'Widget Menu bar 2', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
            m2.AddCloseButton(_, s2, 'x');
            s2.AddItem(m2);

            const sl1 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
            s2.AddItem(sl1);

            s.AddItem(s2);
            {
                const s3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(YELLOWR[7], .9))

                const m3 = Create_widget_menubar(_, 'Widget Menu bar 3', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
                m3.AddCloseButton(_, s3, 'x');
                s3.AddItem(m3);

                const sl3 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                s3.AddItem(sl3);

                s2.AddItem(s3);
            }
        }
    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Calc();
    section.Render();
    section.ConstructListeners();

    return section;
}

function CreateSectionedMenuBarsWithNestedWidgets(scene) {

    let cnt = 1;

    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREY[1], .5))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)

    const menu = Create_widget_menubar(_, 'Widget Menu bar 0', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .5), WHITE, [10, 6]);
    menu.AddCloseButton(_, section, 'x');
    menu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    menu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.AddItem(menu);

    const slider = Create_widget_slider(_, [200, 100, 0], [150, 10]);
    section.AddItem(slider);

    {
        const s = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREY[6], .5))

        const m = Create_widget_menubar(_, 'Widget Menu bar 1', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .9), WHITE, [10, 6]);
        m.AddCloseButton(_, s, 'x');
        m.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        s.AddItem(m);

        const sl = Create_widget_slider(_, [200, 100, 0], [150, 10]);
        sl.SetName(`Slider 10`)
        s.AddItem(sl);

        section.AddItem(s);

        {
            const s2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREY[6], .5))

            const m2 = Create_widget_menubar(_, 'Widget Menu bar 2', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .5), WHITE, [10, 6]);
            m2.AddCloseButton(_, s2, 'x');
            s2.AddItem(m2);

            const sl1 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
            s2.AddItem(sl1);

            s.AddItem(s2);
            {
                const s3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [250, 600, 0], [0, 0], TRANSPARENCY(GREY[6], .5))

                const m3 = Create_widget_menubar(_, 'Widget Menu bar 3', ALIGN.LEFT, [200, 400, 0], TRANSPARENCY(GREY[1], .5), WHITE, [10, 6]);
                m3.AddCloseButton(_, s3, 'x');
                s3.AddItem(m3);

                const sl3 = Create_widget_slider(_, [200, 100, 0], [150, 10]);
                s3.AddItem(sl3);

                // With buttons
                const btn = Create_widget_button(_, 'Button', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [0, 0, 0], _fontsize, GREY[1], WHITE, [4, 4], .5);
                s3.AddItem(btn);

                // With switch
                const switch1 = new Widget_Switch('switch on', 'switch off', [0, 0, 0], _fontsize, GREY[1], WHITE, [4, 4], .5);
                switch1.StateEnable(MESH_STATE.IS_HOVER_COLORABLE)
                switch1.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE, { style: [6, 6, 3] })
                switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
                s3.AddItem(switch1);

                // With dynamic text
                const dt = Create_widget_multi_text(_, 'Dynamic text', 'value', ALIGN.VERTICAL, [100, 300, 0], _fontsize, BLUE_10_120_220, PURPLER[7]);
                dt.CreateNewText('Text 2', _fontsize, PURPLE, [2, 2]);
                dt.CreateNewText('Text 3', _fontsize, GREEN[7], [2, 2]);
                dt.CreateNewText('Text 4 very long text', _fontsize, WHITE, [2, 2]);
                dt.Align_pre(dt, ALIGN.VERTICAL);
                s3.AddItem(dt);

                s2.AddItem(s3);
            }
        }
    }

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Calc();
    section.Render();
    section.ConstructListeners();
}

function CreateMenuBarSectioned(count) {

    const h = 40;
    let cnt = 1;
    let posy = VIEWPORT.BOTTOM - h, fontSize = 10;

    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [10, 10], ORANGE);

    for (let i = 0; i < count; i++) {
        const menu_bar = Create_widget_menubar(_, `Menu ${cnt}`, ALIGN.LEFT, [120, posy, 0], [60, 20], BLUE_10_120_220, WHITE, [2, 2], .3);
        menu_bar.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        menu_bar.SetName(`Menu ${cnt}`)
        menu_bar.AddCloseButton(_, menu_bar, 'x', [120, posy, 0], 6, GREY[1], WHITE, [6, 4], .8, _, [1, 4, 2]);
        section.AddItem(menu_bar)
        posy -= h; cnt++;
    }

    return section;
}

function CreateSectionsSimple(scene) {

    const tr = 1.;

    const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [200, 200, 0], [10, 100], TRANSPARENCY(BLUEL[7], tr));
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(RED3, tr));
    red.SetName('red');
    blu.AddItem(red);
    
    const green = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREEN3, tr));
    green.SetName('green');
    blu.AddItem(green);


    blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    blu.ActivateAndChildrenRecursive()
    blu.Render();
    // blu.Calc(SECTION.INHERIT|SECTION.TOP_DOWN| SECTION.EXPAND);
    blu.Calc(SECTION.INHERIT|SECTION.TOP_DOWN);
    // blu.Calc();
    blu.ConstructListeners();
    return blu;
}

function CreateManySections(scene) {

    const tr = 1.;
    const flags = (SECTION.ITEM_FIT | SECTION.EXPAND);

    const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    // blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    
    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    blu.AddItem(red);
    const yel = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    red.AddItem(yel); 
    const gre = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    yel.AddItem(gre);
    const ora = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    red.AddItem(ora); 
    const cie = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[7], tr));
    red.AddItem(cie);
    const bla = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    cie.AddItem(bla);
    const bla_1 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    red.AddItem(bla_1); 
    const pin_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
    bla_1.AddItem(pin_1); 
    const blu_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[7], tr));
    bla_1.AddItem(blu_1);
    const pur_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
    yel.AddItem(pur_1); 
    const red_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    gre.AddItem(red_1);
    const yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr));
    gre.AddItem(yel_1); 
    const yel_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr));
    ora.AddItem(yel_2); 
    const red_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    yel.AddItem(red_3);
    const yel_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    cie.AddItem(yel_3); 
    const gre_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    cie.AddItem(gre_3); 
    const red_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
    ora.AddItem(red_4); 
    const yel_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
    ora.AddItem(yel_4); 
    const gre_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    yel.AddItem(gre_4); 
    const ora_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    ora.AddItem(ora_4);
    const gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    bla.AddItem(gry1_1); 
    const gry1_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[5], tr));
    bla.AddItem(gry1_2); 
    const gry1_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[7], tr));
    bla.AddItem(gry1_3);
    const gry2_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    pin_1.AddItem(gry2_1); 
    const gry2_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    pin_1.AddItem(gry2_2);
    const gry2_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    blu_1.AddItem(gry2_3); 
    const gry2_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    blu_1.AddItem(gry2_4);
    const vert_0 = Create_widget_section(_, SECTION.VERTICAL, [20, 20], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
    gry1_1.AddItem(vert_0);


    // Construct widgets
    // const label = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);
    // label.SetName('Sectioned btn1')
    // label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
    // blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    
    // const btn = Create_widget_button(_, 'btnl', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);
    // btn.SetName('Sectioned btn1')
    // btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
    // btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    { // Set naming and listeners
        red.SetName('red');
        gre.SetName('gre');
        yel.SetName('yel');
        ora.SetName('ora');
        cie.SetName('cie');
        bla.SetName('bla');
        bla_1.SetName('bla_1');
        pin_1.SetName('pin_1');
        blu_1.SetName('blu_1');
        pur_1.SetName('pur_1');
        red_1.SetName('red_1');
        yel_1.SetName('yel_1');
        yel_2.SetName('yel_2');
        red_3.SetName('red_3');
        yel_3.SetName('yel_3');
        gre_3.SetName('gre_3');
        red_4.SetName('red_4');
        yel_4.SetName('yel_4');
        gre_4.SetName('gre_4');
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

    { // Set listeners
        red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        ora.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        cie.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        bla.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        bla_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        pur_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    }

    // { // Set hierarchy
    //     pin_1.AddItem(gry2_1, flags); pin_1.AddItem(gry2_2, flags);
    //     blu_1.AddItem(gry2_3, flags); blu_1.AddItem(gry2_4, flags);
    //     bla_1.AddItem(pin_1, flags); bla_1.AddItem(blu_1, flags);
    //     red.AddItem(bla_1); red.AddItem(yel, flags); red.AddItem(ora, flags); red.AddItem(cie, flags);
    //     yel.AddItem(gre_4, flags); yel.AddItem(pur_1, flags); yel.AddItem(red_3, flags);
    //     ora.AddItem(yel_4, flags); ora.AddItem(red_4, flags); ora.AddItem(yel_2, flags); ora.AddItem(ora_4, flags);
    //     cie.AddItem(gre_3, flags); cie.AddItem(yel_3, flags); cie.AddItem(bla, flags);
    //     bla.AddItem(gry1_1, flags); bla.AddItem(gry1_2, flags); bla.AddItem(gry1_3, flags);
    //     /* gry1_1.AddItem(label, flags);  gry1_1.AddItem(btn, flags);*/ gry1_1.AddItem(vert_0, flags);
    //     gre.AddItem(yel_1, flags); gre.AddItem(red_1, flags);
    //     yel.AddItem(gre, flags);
    //     blu.AddItem(red, flags);
    // }

    // const minimizer = Create_widget_minimize_btn(_, blu, blu.geom.pos, 10);
    // minimizer.SetName('minimizer 000')
    // minimizer.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // blu.AddItem(minimizer);



    Widgetroot_buffer_print_w1();
    Widgetroot_gfx_print_w3()
    
    blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    blu.ActivateAndChildrenRecursive()
    blu.Render();
    // blu.Calc(SECTION.INHERIT|SECTION.TOP_DOWN);
    // blu.Calc(SECTION.INHERIT| SECTION.EXPAND);
    // blu.Calc(SECTION.INHERIT);
    blu.Calc();
    blu.ConstructListeners();
    return blu;
}

function CreateManySectionsWithLabelsAndMinimizer(scene) {

    const tr = 1.;
    const flags = (SECTION.ITEM_FIT | SECTION.EXPAND);

    const blu = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [865, 600, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));

    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
    const gre = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    const yel = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    const ora = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
    const cie = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    const bla = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));


    { // Construct sub-sections
        var bla_1 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var pin_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
        var blu_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[7], tr));
        var pur_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE, tr));
        var red_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
        var yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
        var yel_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr));
        var red_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
        var yel_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var gre_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var red_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
        var yel_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
        var gre_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var ora_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var gry1_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[5], tr));
        var gry1_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[7], tr));
        var gry2_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var gry2_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var gry2_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var gry2_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var vert_0 = Create_widget_section(_, SECTION.VERTICAL, [20, 20], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));

    }

    // Construct widgets
    const label = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);
    label.SetName('Sectioned btn1')
    label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    
    const btn = Create_widget_button(_, 'btnl', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);
    btn.SetName('Sectioned btn1')
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    { // Set naming and listeners
        red.SetName('red');
        gre.SetName('gre');
        yel.SetName('yel');
        ora.SetName('ora');
        cie.SetName('cie');
        bla.SetName('bla');
        bla_1.SetName('bla_1');
        pin_1.SetName('pin_1');
        blu_1.SetName('blu_1');
        pur_1.SetName('pur_1');
        red_1.SetName('red_1');
        yel_1.SetName('yel_1');
        yel_2.SetName('yel_2');
        red_3.SetName('red_3');
        yel_3.SetName('yel_3');
        gre_3.SetName('gre_3');
        red_4.SetName('red_4');
        yel_4.SetName('yel_4');
        gre_4.SetName('gre_4');
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

    { // Set listeners
        red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        ora.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        cie.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        bla.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        bla_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        pur_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    }

    { // Set hierarchy
        pin_1.AddItem(gry2_1, flags); pin_1.AddItem(gry2_2, flags);
        blu_1.AddItem(gry2_3, flags); blu_1.AddItem(gry2_4, flags);
        bla_1.AddItem(pin_1, flags); bla_1.AddItem(blu_1, flags);
        red.AddItem(bla_1); red.AddItem(yel, flags); red.AddItem(ora, flags); red.AddItem(cie, flags);
        yel.AddItem(gre_4, flags); yel.AddItem(pur_1, flags); yel.AddItem(red_3, flags);
        ora.AddItem(yel_4, flags); ora.AddItem(red_4, flags); ora.AddItem(yel_2, flags); ora.AddItem(ora_4, flags);
        cie.AddItem(gre_3, flags); cie.AddItem(yel_3, flags); cie.AddItem(bla, flags);
        bla.AddItem(gry1_1, flags); bla.AddItem(gry1_2, flags); bla.AddItem(gry1_3, flags);
        gry1_1.AddItem(label, flags);  gry1_1.AddItem(btn, flags); gry1_1.AddItem(vert_0, flags);
        gre.AddItem(yel_1, flags); gre.AddItem(red_1, flags);
    }

    const minimizer = Create_widget_minimize_btn(_, blu, blu.geom.pos, 10);
    minimizer.SetName('minimizer 000')
    minimizer.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu.AddItem(minimizer);

    yel.AddItem(gre, flags);
    blu.AddItem(red, flags);

    Widgetroot_buffer_print_w1();
    Widgetroot_gfx_print_w3()

    blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    blu.ActivateAndChildrenRecursive()
    blu.Render();
    blu.Calc();
    blu.ConstructListeners();
    return blu;
}

function CreateManySectionsWithScroller(scene) {

    const tr = 1.;
    const flags = (SECTION.ITEM_FIT | SECTION.EXPAND);

    const blu = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [350, 500, 0], [10, 0], TRANSPARENCY(BLUEL[7], tr));

    const red = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
    const gre = Create_widget_section(_, SECTION.VERTICAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    const yel = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
    const ora = Create_widget_section(_, SECTION.HORIZONTAL, [12, 12], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
    const cie = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
    const bla = Create_widget_section(_, SECTION.VERTICAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));


    { // Construct sub-sections
        var bla_1 = Create_widget_section(_, SECTION.HORIZONTAL, [15, 15], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var pin_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
        var blu_1 = Create_widget_section(_, SECTION.VERTICAL, [25, 10], [0, 0, 0], [20, 20], TRANSPARENCY(BLUEL[7], tr));
        var pur_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE, tr));
        var red_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
        var yel_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLER[7], tr));
        var yel_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(YELLOWR[7], tr));
        var red_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(REDL[7], tr));
        var yel_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var gre_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var red_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
        var yel_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(PURPLE[7], tr));
        var gre_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var ora_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var gry1_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(ORANGE_240_160_10, tr));
        var gry1_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[5], tr));
        var gry1_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[7], tr));
        var gry2_1 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var gry2_2 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var gry2_3 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var gry2_4 = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));
        var vert_0 = Create_widget_section(_, SECTION.VERTICAL, [20, 20], [0, 0, 0], [20, 20], TRANSPARENCY(GREY[1], tr));

    }

    // Construct widgets
    const label = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);
    const btn = Create_widget_button(_, 'btnl', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0]);

    { // Set widgets parameters
        label.SetName('Sectioned btn1')
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        btn.SetName('Sectioned btn1')
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    }

    { // Set naming and listeners
        red.SetName('red');
        gre.SetName('gre');
        yel.SetName('yel');
        ora.SetName('ora');
        cie.SetName('cie');
        bla.SetName('bla');
        bla_1.SetName('bla_1');
        pin_1.SetName('pin_1');
        blu_1.SetName('blu_1');
        pur_1.SetName('pur_1');
        red_1.SetName('red_1');
        yel_1.SetName('yel_1');
        yel_2.SetName('yel_2');
        red_3.SetName('red_3');
        yel_3.SetName('yel_3');
        gre_3.SetName('gre_3');
        red_4.SetName('red_4');
        yel_4.SetName('yel_4');
        gre_4.SetName('gre_4');
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

    { // Set listeners
        red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        ora.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        cie.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        bla.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        bla_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        pin_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        blu_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        pur_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        red_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        yel_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gre_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        ora_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry1_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_3.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        gry2_4.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        vert_0.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    }

    { // Set hierarchy
        pin_1.AddItem(gry2_1, flags); pin_1.AddItem(gry2_2, flags);
        blu_1.AddItem(gry2_3, flags); blu_1.AddItem(gry2_4, flags);
        bla_1.AddItem(pin_1, flags); bla_1.AddItem(blu_1, flags);
        red.AddItem(bla_1); red.AddItem(yel, flags); red.AddItem(ora, flags); red.AddItem(cie, flags);
        yel.AddItem(gre_4, flags); yel.AddItem(pur_1, flags); yel.AddItem(red_3, flags);
        ora.AddItem(yel_4, flags); ora.AddItem(red_4, flags); ora.AddItem(yel_2, flags); ora.AddItem(ora_4, flags);
        cie.AddItem(gre_3, flags); cie.AddItem(yel_3, flags); cie.AddItem(bla, flags);
        bla.AddItem(gry1_1, flags); bla.AddItem(gry1_2, flags); bla.AddItem(gry1_3, flags);
        gry1_1.AddItem(label, flags); gry1_1.AddItem(btn, flags); gry1_1.AddItem(vert_0, flags);
        gre.AddItem(yel_1, flags); gre.AddItem(red_1, flags);
    }

    yel.AddItem(gre, flags);

    const minimizer = Create_widget_minimize_btn(_, blu, blu.geom.pos, 10);
    minimizer.SetName('minimizer')
    minimizer.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    blu.AddItem(minimizer);

    // Add close button
    // const close = new Close_Button(blu, 'x', blu.geom.pos, 10);
    // close.SetName('close')
    // close.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // blu.AddItem(close)

    blu.AddItem(red, flags);
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    // blu.ConstructListeners();

    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, blu, [100, 100]);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    scroller.Render();
    scroller.Calc();
    scroller.ConstructListeners();
}

function CreateScroller(scene) {

    const fontsize = 8;
    const tr = .3;

    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [260, 350, 0], [20, 20], TRANSPARENCY(GREY[1], 1.));
    const colors = [RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,];
    const count = colors.length;

    for (let i = 0; i < 50; i++) {

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

    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 100]);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);


    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);

    // scroller.ActivateAndChildren();
    scroller.ActivateAndChildrenRecursive();

    Scroller_clampy_and_render(scroller, TEST_CLIP_TOP, TEST_CLIP_BOTTOM);

    // scroller.scrolled_section.SetClampY(scroller.geom.pos[1], scroller.geom.dim[1], 300);
    // Clipy_chunks_impl(scroller.scrolled_section, scroller.scrolled_section.clamp[CLAMP.Y], scroller.renderables);
    // scroller.scrolled_section.group_bufferidxs = Widget_group_create(scroller.scrolled_section.mesh_bufferidx, scroller.scrolled_section.gfx)
    // scroller.scrolled_section.AddToWidgetGroupBuffer(scroller.scrolled_section.group_bufferidxs[0], 4);
    // // // TODO: We have to update the "starts" of all group.vb[] arrays after the render.

    // scroller.Render(scroller.scrolled_section.group_bufferidxs[0]);
    // scroller.Calc();
    // scroller.ConstructListeners();






    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, section);

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

function CreateScrollerManyMeshes(scene) {

    const fontsize = 8;

    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 450, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
    const colors = [RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,];
    const count = colors.length;

    for (let i = 0; i < 30; i++) {
        {
            const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [50, 20], TRANSPARENCY(GetRandomColor(), .6));
            section.AddItem(s);
            {
                const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [5, 5], [280, 650, 0], [50, 20], TRANSPARENCY(GetRandomColor(), .6));
                s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
                s.AddItem(s1);
                {
                    // const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [5, 5], [280, 650, 0], [50, 5], TRANSPARENCY(GetRandomColor(), .6));
                    // s.AddItem(s1);
                    {
                        const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                        s1.AddItem(s2);
                    }
                    {
                        const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                        s1.AddItem(s2);
                    }
                    {
                        const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                        s1.AddItem(s2);
                    }
                    {
                        const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                        s1.AddItem(s2);
                    }
                    {
                        const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                        s1.AddItem(s2);
                    }
                    {
                        const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                        s1.AddItem(s2);
                    }
                    {
                        const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                        s1.AddItem(s2);
                    }
                }
            }
            {
                const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [5, 5], [280, 650, 0], [50, 5], TRANSPARENCY(GetRandomColor(), .6));
                s.AddItem(s1);
                {
                    const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                    s1.AddItem(s2);
                }
                {
                    const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                    s1.AddItem(s2);
                }
                {
                    const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                    s1.AddItem(s2);
                }
                {
                    const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                    s1.AddItem(s2);
                }
                {
                    const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                    s1.AddItem(s2);
                }
                {
                    const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                    s1.AddItem(s2);
                }
                {
                    const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                    s1.AddItem(s2);
                }
            }
            {
                // const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [5, 5], [280, 650, 0], [50, 5], TRANSPARENCY(GetRandomColor(), .6));
                // s.AddItem(s1);
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
            }
            {
                // const s1 = Create_widget_section(_, SECTION.HORIZONTAL, [5, 5], [280, 650, 0], [50, 5], TRANSPARENCY(GetRandomColor(), .6));
                // s.AddItem(s1);
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
                // {
                //     const s2 = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [280, 650, 0], [5, 5], TRANSPARENCY(GetRandomColor(), 1.6));
                //     s1.AddItem(s2);
                // }
            }
            // const l = Create_widget_label(_, 'label', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [700, 100, 0], 8, GetRandomColor(), WHITE);
            // s.AddItem(l);
        }
    }

    const scroller = new Widget_Scroller(section, [100, 100]);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    scroller.Calc();

    // TEST CLAMP children buffer
    {
        scroller.renderables.size = 10;
        scroller.renderables.center = scroller.renderables.size / 2;
        scroller.renderables.first_all = 0;
        scroller.renderables.last_all = scroller.renderables.size;
        // TEMP_CONCATE_(scroller.scrolled_section, scroller.renderables);
    }

    scroller.Render();
    scroller.ConstructListeners();


    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, section);

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
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
        RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,
        BLUE0, BLUE1, BLUE2, BLUE3, BLUE4, BLUE5, BLUE6, BLUE7, BLUE8, BLUE9,
    ];
    const count = colors.length;
    const fontsize = 14;

    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [270, 350, 0], [20, 20], TRANSPARENCY(GREY[1], .6));

    // const count = 100;
    for (let i = 0; i < count; i++) {
        // const label = Create_widget_section(_, _, _, [400, 300, 0], [20,20], TRANSPARENCY(colors[i], .7), `Section${i + 1}`)
        // const label = Create_widget_text(_, `${i}`, [100, 100, 2], fontsize, TRANSPARENCY(colors[i], .7), WHITE)
        const label = Create_widget_label(_, `${i}`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(colors[i], .7), WHITE)

        label.SetName(`${label.id}`);
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)
        section.AddItem(label);
    }

    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 140]);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    // scroller.ActivateAndChildren();
    scroller.ActivateAndChildrenRecursive();

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    Scroller_clampy_and_render(scroller, 50, 50);
    // scroller.Render();
    // scroller.Calc();
    // scroller.ConstructListeners();
    // // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    // scroller.scrolled_section.group_bufferidxs = Widget_group_create(scroller.scrolled_section.mesh_bufferidx, scroller.scrolled_section.gfx)
    // scroller.scrolled_section.AddToWidgetGroupBuffer(scroller.scrolled_section.group_bufferidxs[0]);
    // console.log(scroller.renderables)
    // const group = Widget_group_get(scroller.scrolled_section.group_bufferidxs[0])
    // console.log(group.vb[0].num_faces)



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

    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, scroller.scrolled_section);


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


function CreateClampWidgets(scene) {

    const fontsize = 10;

    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [270, 350, 0], [20, 20], TRANSPARENCY(GREY[1], .6));

    {
        const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [270, 350, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
        section.AddItem(s);
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
    }

    {
        const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [270, 350, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
        section.AddItem(s);
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
    }

    {
        const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [270, 350, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
        section.AddItem(s);
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
    }

    {
        const s = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [270, 350, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
        section.AddItem(s);
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
        {
            const slider = Create_widget_slider(_, [200, 100, 0], [150, 10])
            s.AddItem(slider);
            const text = Create_widget_switch(_, 'switch on', 'switch off', [0, 0, 0], fontsize, GREY[1], WHITE, [4, 4], .5)
            s.AddItem(text);
            const label = Create_widget_label(_, `label`, ALIGN.HOR_CENTER, [100, 100, 2], fontsize, TRANSPARENCY(GREEN3, .7), WHITE)
            s.AddItem(label);
        }
    }



    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 140]);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    // scroller.ActivateAndChildren();
    scroller.ActivateAndChildrenRecursive();

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    Scroller_clampy_and_render(scroller, 300, 300);

    // scroller.Render();
    // scroller.Calc();
    // scroller.ConstructListeners();
    // // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
    // scroller.scrolled_section.group_bufferidxs = Widget_group_create(scroller.scrolled_section.mesh_bufferidx, scroller.scrolled_section.gfx)
    // scroller.scrolled_section.AddToWidgetGroupBuffer(scroller.scrolled_section.group_bufferidxs[0]);

    // console.log(scroller.renderables)
    // const group = Widget_group_get(scroller.scrolled_section.group_bufferidxs[0])
    // console.log(group.vb[0].num_faces)



    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scene, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, scroller.scrolled_section);


    return scroller;
}

function CreateScrollerWithWidgets(scene) {

    const fontsize = 8;

    const section = Create_widget_section(_, SECTION.VERTICAL, [5, 5], [120, 450, 0], [20, 20], TRANSPARENCY(GREY[1], .6));
    const colors = [RED0, REDL[7], REDL[7], RED3, REDL[7], RED5, RED6, RED7, RED8, RED9,];
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


    const scroller = Create_widget_scroller(ROOT_WIDGETS.CREATE_ROOT, section, [100, 100]);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);

    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);

    scroller.ActivateAndChildrenRecursive();

    Scroller_clampy_and_render(scroller, 200, 700)

    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scene, section);

    return scroller;
}


function Help(scene) {


    const flags = (SECTION.ITEM_FIT);

    //options, margin, pos, dim, col, name
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [VIEWPORT.RIGHT - 230, VIEWPORT.BOTTOM - 340, 0], [100, 100], TRANSPARENCY(GREY[1], .8));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName('Help section')

    // scene.StoreMesh(section)
    const s1 = Create_widget_section(_, SECTION.VERTICAL, [15, 10], [220, 400, 0], [0, 0], TRANSPARENCY(GREY[3], .6));
    s1.SetName('Help section 2')

    let msgs = [];
    for (let i = 0; i < DEBUG_PRINT_KEYS.length; i++) {

        msgs[i] = '\"' + DEBUG_PRINT_KEYS[i].key + '\": ' + DEBUG_PRINT_KEYS[i].discr

        const label = Create_widget_label(_, msgs[i], ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 10, TRANSPARENCY(GREY[1], .4), WHITE, [7, 3], .5, [0, 4, 3])
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        s1.AddItem(label)
    }

    // s1.Calc()

    const minimizer = Create_widget_minimize_btn(_, section, section.geom.pos, 12);
    minimizer.SetName('minimi')

    section.AddItem(minimizer);
    section.AddItem(s1)

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.ActivateAndChildrenRecursive()
    section.Render();
    section.Calc()
    //*Gfx_end_session(true);

    section.ConstructListeners();

    // Create_root_widget_buffer(section);
    // Create_widget_tree_from_root(section);
    // Widget_root_batch_create_from_root_children(section.root_bufferidx)

    return section;
}

function Help2(scene) {


    const flags = (SECTION.ITEM_FIT);

    //options, margin, pos, dim, col, name
    const section = Create_widget_section(_, SECTION.VERTICAL, [10, 10], [VIEWPORT.RIGHT - 230, VIEWPORT.BOTTOM - 340, 0], [100, 100], TRANSPARENCY(REDL, .2));
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.SetName('Help section')

    // scene.StoreMesh(section)
    const s1 = Create_widget_section(_, SECTION.VERTICAL, [15, 10], [220, 400, 0], [0, 0], TRANSPARENCY(GREY[1], .2));
    s1.SetName('Help section 2')

    let msgs = [];
    for (let i = 0; i < DEBUG_PRINT_KEYS.length; i++) {

        msgs[i] = '\"' + DEBUG_PRINT_KEYS[i].key + '\": ' + DEBUG_PRINT_KEYS[i].discr

        const label = Create_widget_label(_, msgs[i], ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 10, TRANSPARENCY(ORANGE_240_160_10, 1.0), WHITE, [7, 3], .5, [0, 4, 3])
        label.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        s1.AddItem(label)
    }

    // s1.Calc()

    const minimizer = Create_widget_minimize_btn(section, section.geom.pos, 10);
    minimizer.SetName('minimizer2')

    section.AddItem(minimizer);
    section.AddItem(s1)

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    section.Calc()
    section.Render();
    //*Gfx_end_session(true);

    section.ConstructListeners();

    // Create_root_widget_buffer(section);
    // Create_widget_tree_from_root(section);

    return section;
}



function MeshInfo(scene) {

    const fontsize = 9;
    const pad = [4, 0];

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 10], [880, 130, 100], [0, 0], TRANSPARENCY(GREY[1], .9), 'MeshInfoUiTip');
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.ConstructListeners();

    // section.root_bufferidx = Widget_root_create_root(section.mesh_bufferidx);

    const infomesh = Create_widget_multi_text(_, 'Mesh name 000000000000', ALIGN.VERTICAL, [420, 15, 100], fontsize, GREEN[7], YELLOWR[7], pad, .4);
    section.AddItem(infomesh);
    infomesh.CreateNewText('id:000', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('pos: 0000,0000,0', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('dim: 0000,0000', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('idx: 0000, alpha: 0.00', fontsize, ORANGE_240_160_10, pad, .9);
    infomesh.CreateNewText('gfx: group: 0, prog:0, vb:0, start:00000', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('HOVERED: name: 123456789, id:12', fontsize, BLUE_10_120_220, pad, .9);
    infomesh.CreateNewText('FOCUSED: name: 123456789, id:12', fontsize, BLUE_10_120_220, pad, .9);

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


    section.GenGfxCtx(GFX_CTX_FLAGS.NEW);
    section.ActivateAndChildrenRecursive()
    section.Render();
    section.Calc(SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.EXPAND);
    // section.Calc();
    // section.Calc(SECTION.EXPAND);

    // Create_root_widget_buffer(section, ROOT_WIDGETS.CREATE_BATCH);
    // Create_widget_tree_from_root(section);
    // Widget_root_batch_create_from_root_children(section.root_bufferidx);

    // section.group_bufferidxs = Widget_group_create(section.mesh_bufferidx, section.gfx)
    // section.AddToWidgetGroupBuffer(section.group_bufferidxs[0]);

    // Create Group for this dropdown, to easily remove meshes from their vertex buffers and rebuild the vertex buffer
    // dp.group_bufferidxs = Widget_group_create(dp.mesh_bufferidx, dp.gfx)
    // Widget_groups_create_vb_data_for_all(dp.root_bufferidx, dp.group_bufferidxs[0]);
    // dp.UpdateWidgetGroupIncrementNumFaces();


    // DEBUG_INFO.UI_MESH.IDX = section.idx;

    return section;
}

// TODO: The text updates the gfx buffers regardless of if any change has happened
let prev_infomesh = null; // A way to compare with prev update and skip updating if we are hovering the same mesh
function MeshInfoUpdate(params) {
    _pt_mesh_info_tip.timer.Start();

    // TODO: Skip if nothing changed(from previous hover). The question is how to implement an easy and efficient change
    // const textMesh = params.params.mesh;
    const textMesh = params.params.mesh.children.buffer[0];
    const infoMesh = STATE.mesh.hovered;

    // if (infoMesh && infoMesh !== prev_infomesh) { // Avoid update if mesh is same with the mesh of previous update.
    if (infoMesh) {

        prev_infomesh = infoMesh;

        textMesh.UpdateText(infoMesh.GetName());

        const gfx = (infoMesh.gfx !== null) ? `gfx: group:${infoMesh.gfx.prog.groupidx}, prog:${infoMesh.gfx.prog.idx}, vb:${infoMesh.gfx.vb.idx}, start:${infoMesh.gfx.vb.start}` : 'null'

        let msgs = [
            `id:${infoMesh.id}`,
            `pos:${FloorArr3(infoMesh.geom.pos)}`,
            `dim: ${FloorArr2(infoMesh.geom.dim)}`,
            `idx: ${infoMesh.idx} | alpha:${infoMesh.mat.col[3]}`,
            gfx,
            (STATE.mesh.hovered) ? `HOVERED: name:${STATE.mesh.hovered.GetName()}, id:${STATE.mesh.hoveredId}` : 'HOVERED: NULL',
            (STATE.mesh.focused) ? `FOCUSED: name:${STATE.mesh.focused.GetName()}, id:${STATE.mesh.focusedId}` : 'FOCUSED: NULL',
            // `Text:`,
            // `Batch :${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.MOVE}`,
            // `Batch:${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.BATCH_MOVE}`,
            // `mesh: ${STATE.mesh.hovered.GetName()} counter${TEMP_TEST_PERFORMANE_COUNTERS.MESH_INFO_UI.COUNT}`,
        ];

        // Create info for any text gfx, if exists
        const child = (infoMesh.children.boundary && infoMesh.children.buffer[0]) ? infoMesh.children.buffer[0] : null;
        if (child) {
            if (child.type & MESH_TYPE.FONT_MATERIAL) { // Plain text

                const text_num_faces = (child.text_mesh) ? child.text_mesh.geom.num_faces : child.geom.num_faces; // If child is of type label and has 'text_mesh' else is plain text.

                msgs.push(`Plain Text:${child.GetName()}, dim: ${child.id}`);
                msgs.push(`pos:[${FloorArr3(child.geom.pos)}], dim:[${child.geom.dim}], alpha:${child.mat.col[3]}`);
                msgs.push(`gfx: group:${child.gfx.prog.groupidx}, prog:${child.gfx.prog.idx}, vb:${child.gfx.vb.idx}, start:${child.gfx.vb.start}, faces:${text_num_faces}`);
            }
            else if (child.text_mesh) { // Text in label or any other mesh that has text_mesh
                msgs.push(`Text_mesh: id:${child.text_mesh.id}, name:${child.text_mesh.GetName()},`);
                msgs.push(`pos:[${FloorArr3(child.text_mesh.geom.pos)}], dim: [${child.text_mesh.geom.dim}], alpha:${child.text_mesh.mat.col[3]}`);
                msgs.push(`gfx: group:${child.text_mesh.gfx.prog.groupidx}, prog:${child.text_mesh.gfx.prog.idx}, vb:${child.text_mesh.gfx.vb.idx}, start:${child.text_mesh.gfx.vb.start}, faces:${child.text_mesh.geom.num_faces}`);
            }
        }
        else if (infoMesh.text_mesh) {
            msgs.push(`Text_mesh: id:${infoMesh.text_mesh.id}, name:${infoMesh.text_mesh.GetName()},`);
            msgs.push(`pos:[${FloorArr3(infoMesh.text_mesh.geom.pos)}], dim: [${FloorArr2(infoMesh.text_mesh.geom.dim)}], alpha:${infoMesh.text_mesh.mat.col[3]}`);
            msgs.push(`gfx: group:${infoMesh.text_mesh.gfx.prog.groupidx}, prog:${infoMesh.text_mesh.gfx.prog.idx}, vb:${infoMesh.text_mesh.gfx.vb.idx}, start:${infoMesh.text_mesh.gfx.vb.start}, faces:${infoMesh.text_mesh.geom.num_faces}`);
        }

        // msgs.push(`Framebuffer counter:${TEMP_TEST_PERFORMANE_COUNTERS.FRAMEBUFFER}`);
        msgs[TEMP_TEST_PERFORMANE_COUNTERS.MISC_IDX] = `MISC:${TEMP_TEST_PERFORMANE_COUNTERS.MISC}`;

        // Update info text
        for (let i = 0; i < textMesh.children.boundary; i++) {

            const childText = textMesh.children.buffer[i];

            if (msgs[i]) childText.UpdateText(msgs[i]);
            else childText.UpdateText('NULL')
        }
    }

    _pt_mesh_info_tip.timer.Stop();
}



function Menu_labels_switches(scene) {

    const flags = (SECTION.ITEM_FIT);

    const section = Create_widget_section(_, SECTION.HORIZONTAL, [10, 10], [120, 300, 0], [0, 0], TRANSPARENCY(GREY[1], .2));
    const s1 = Create_widget_section(_, SECTION.VERTICAL, [15, 2], [220, 400, 0], [0, 0], TRANSPARENCY(GREY[1], .2));
    const s2 = Create_widget_section(_, SECTION.VERTICAL, [7, 2], [220, 400, 0], [0, 0], TRANSPARENCY(GREY[1], .3));

    const label1 = Create_widget_label(_, 'options 1', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(GREY[1], .0), WHITE, [1, 1], [7, 6], .5, undefined, [0, 4, 1])
    const label2 = Create_widget_label(_, 'options 2', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 700, 0], 4, TRANSPARENCY(GREY[1], .0), WHITE, [1, 1], [7, 6], .5, undefined, [0, 4, 1])
    const label3 = Create_widget_label(_, 'options 3', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 700, 0], 4, TRANSPARENCY(GREY[1], .0), WHITE, [1, 1], [7, 6], .5, undefined, [0, 4, 1])
    const label4 = Create_widget_label(_, 'options 4', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [400, 700, 0], 4, TRANSPARENCY(GREY[1], .0), WHITE, [1, 1], [7, 6], .5, undefined, [0, 4, 1])

    const switch1 = new Widget_Switch('on', 'off', [400, 700, 0], 4, TRANSPARENCY(GREY[1], .0), WHITE, [4, 6], .5, undefined, [2, 8, 1]);
    const switch2 = new Widget_Switch('on', 'off', [400, 700, 0], 4, TRANSPARENCY(GREY[1], .0), WHITE, [4, 6], .5, undefined, [2, 8, 1]);
    const switch3 = new Widget_Switch('on', 'off', [400, 700, 0], 4, TRANSPARENCY(GREY[1], .0), WHITE, [4, 6], .5, undefined, [2, 8, 1]);
    const switch4 = new Widget_Switch('on', 'off', [400, 700, 0], 4, TRANSPARENCY(BLUE_10_120_220, .2), WHITE, [4, 6], .5, undefined, [2, 4, 1]);

    s1.AddItem(label1, flags)
    s1.AddItem(label2, flags)
    s1.AddItem(label3, flags)
    s1.AddItem(label4, flags)

    s2.AddItem(switch1, flags)
    s2.AddItem(switch2, flags)
    s2.AddItem(switch3, flags)
    s2.AddItem(switch4, flags)

    section.AddItem(s1, flags)
    section.AddItem(s2, flags)

    section.Calc(flags)

    scene.AddMesh(section);

    scene.AddMesh(label1);
    scene.AddMesh(label2);
    scene.AddMesh(label3);
    scene.AddMesh(label4);

    scene.AddMesh(switch1);
    scene.AddMesh(switch2);
    scene.AddMesh(switch3);
    scene.AddMesh(switch4);

    section.UpdateGfx(section, scene.sceneidx);
    // section.UpdateGfxRecursive(section);
    console.log();
}

function CreateStyledRects(scene) {

    {
        const geom = new Geometry2D([100, 420, 0], [50, 50]);
        const mat = new Material(ORANGE_240_160_10);

        const mesh = new Mesh(geom, mat);
        mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
        mesh.SetStyle([8, 35, 3]);
        mesh.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
        scene.AddMesh(mesh);
        mesh.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    }
    {
        const geom = new Geometry2D([204, 420, 0], [50, 50]);
        const mat = new Material(PURPLER[7]);
        mat.col = PURPLER[7];
        const mesh = new Mesh(geom, mat);
        mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
        mesh.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
        mesh.SetStyle([20, 35, 3]);
        scene.AddMesh(mesh);
        mesh.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    }
    {
        const geom = new Geometry2D([308, 420, 0], [50, 50]);
        const mat = new Material(GREEN[7]);
        const mesh = new Mesh(geom, mat);
        mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
        mesh.SetStyle([10, 15, 3]);
        mesh.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
        mesh.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        scene.AddMesh(mesh);
        mesh.SetColor(WHITE);

    }
    {
        const geom = new Geometry2D([412, 420, 0], [50, 50]);
        const mat = new Material(BLUE_10_120_220);
        const mesh = new Mesh(geom, mat);
        mesh.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
        mesh.StateEnable(MESH_STATE.IS_HOVER_COLORABLE);
        mesh.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        mesh.SetStyle([25, 15, 3]);
        scene.AddMesh(mesh);
        mesh.SetColor(ORANGE_240_160_10);
    }
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

