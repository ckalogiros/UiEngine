"use strict";
import { TimeIntervalsCreate, Time_intervals_initialize } from '../Engine/Timers/TimeIntervals.js';
import { FloorArr2, FloorArr3 } from '../Helpers/Math/MathOperations.js';


import { DEBUG_PRINT_KEYS } from '../Engine/Controls/Input/Keyboard.js';
import { GetShaderTypeId } from '../Graphics/Debug/GfxDebug.js';

import { Dropdown_roots_set_root } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Debug_info_create_ui_focused, Debug_info_ui } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { GetRandomColor, GetRandomInt, GetRandomPos, GetSequencedColor, GetSign } from '../Helpers/Helpers.js';
import { Create_rect_mesh, Create_widget_button, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_minimize_btn, Create_widget_multi_text, Create_widget_scroller, Create_widget_section, Create_widget_slider, Create_widget_slider_simple, Create_widget_switch, Create_widget_switch_simple, Create_widget_text } from '../Engine/Core/CreateWidget.js';
import { Clipy_from_group } from '../Engine/Drawables/Operations/Clip.js';
import { BLACK, BLUEL, BLUER, BLUE_10_120_220, GREEN, GREY, ORANGE, ORANGEL, ORANGER, ORANGE_240_160_10, PURPLE, PURPLEB, PURPLER, RED, REDL, WHITE, YELLOW, YELLOWL, YELLOWR } from '../Engine/Drawables/Material/Base/Colors.js';
import { View_build_group_from_root_mesh, View_set_view_vb_start } from '../Engine/Core/MeshBufferViews.js';

import { MouseGetPos } from '../Engine/Controls/Input/Mouse.js';
import { REL_POS } from '../Engine/Drawables/Operations/RelativePosComponent.js';
import { Animations_create } from '../Engine/Animations/Animations.js';
import { Particle_system_create_emitter, Particle_system_emitt, Particles_get_particle_system, Particles_gfx_uniforms_set_clbk, TEMP_PARTICLES_GEN_GFX, TEMP_PARTICLES_UNIF_CLBK } from '../Engine/ParticlesSystem/NewParticlesSystem.js';
import { Set_color_rgb } from '../Engine/Drawables/Operations/MeshAttributesFunctions.js';
import { Mesh_unif_get_vb_root_wpos } from '../Engine/Core/MeshUniformsBuffer.js';

import { TimerGetGlobalTimerCycle, Timer_get_global_timer, Timer_update_global_timer_cycle } from '../Engine/Timers/Timers.js';
import { VBI_get_byidx, Vertex_buffer_get_by_vbidx } from '../Graphics/Buffers/VertexBuffers.js';
import { Slider_connect, Slider_get_slider_val } from '../Engine/Drawables/Widgets/WidgetSlider.js';
import { Uniforms_buffer_find_ubidx_from_name, Uniforms_buffer_set_uniform_value_from_callback, Uniforms_buffer_set_value_callback } from '../Graphics/Buffers/UniformBuffers.js';

// import { getFile } from '../Engine/Core/FileSystem.js';
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








export function CLBK_TIMER(){
    return Timer_get_global_timer();
    // return .5;
}
function CLBK_TIMER_CYCLE(){
    return TimerGetGlobalTimerCycle();
    // return .5;
}





export function TestWidgetsGeneric(scene) {


    let ypos = 500



    { // Widget: Debug Info 

        // const dbg_dp = Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT);
        // const dbg_dp = Debug_info_ui();


        /* Widget: Show info panel on focused mesh */
        // Debug_info_create_ui_focused();

    }
    
    
    { // Rotation: Rotate sdf line. Dont forget to disable the 'style' attribu\te

        // const line1 = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);
        // TimeIntervalsCreate(16, 'TEST ROTATION', TIME_INTERVAL_REPEAT_ALWAYS, function TEST_ROTATE_FUNC(params){
        //     const mesh = params.params
        //     // const t = (TimerGetGlobalTimerCycle()-.5)*10;
        //     const t = (Timer_get_global_timer())*1;
        //     mesh.RotateZ(t);
        // }, line1)
    }
    
    
    { // Widget: Window with Menubar
        // const panel = CreatePanel(_);
        // const panel2 = CreatePanel(_);
        // CreateSceneMenuBar([panel]);
        // CreateSceneMenuBar([panel, panel2]);


        // CreateSceneMenuBar();



        // CreateWindowWithMenu();

    }
    

    { // Scroller Widgets
        // Create and pass scrollers in 'CreateScrollerInScroller()' 
        // const scroller = CreateScrollerClampAlphaTest(10, 0x0)
        // const scroller2 = CreateScrollerClampAlphaTest(10, 0x0)
        // CreateScrollerInScroller([scroller, scroller2]);
        
        
        // CreateScrollerInScroller();
        
    }

    
    { // Animations
        // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10], SID.ATTR.COL4|SID.ATTR.WPOS_TIME4);
        // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .01, .1, 1., _, .5, false)
        
        // Animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, line, .5, -5., 5., 0)
        
        // Animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.X, line, .5, -5., 5., 0)
        // Animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.Y, line, .5, -5., 5., 0)
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .1, .0, 1.,)
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, line, .005, .2, .5, .2)
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .0025, .2, .8, .2)
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RG, line, .01, .2, .8, _, .2, false)
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, line, .01, .1, .1, _, .5, true)
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .001, .2, 1.4, _, .4, true)
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .001, .2, 1.4, _, .4, true)
    }


    { // Test sdf lines
        // const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], [100, 100, 0], [400, 400], TRANSPARENCY(GREEN[2], 1.), 'sdf linem2');
        // line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
        // line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

        // // // // // line.sid.attr &= ~SID.ATTR.GENERIC_ATTR1_VEC4;
        // // // // // line.sid.attr &= ~SID.ATTR.COL4;
        // line.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        // line.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        // line.GfxUniformsEnable({unif:SID.UNIF.TIME}, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
        // line.sid.fx |= SID.FX.FS_NOISE;
        // // // line.EnableGfxUniforms({unif:SID.UNIF.TIME}, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

        // line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        // line.Render();
        // line.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, line.gfx.vb.groupidx);
        // line.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, line.gfx.vb.groupidx);
        // line.GfxUniformsSetClbk('u_time', CLBK_TIMER, line.gfx.vb.groupidx);
        // // // line.GfxUniformsSetClbk('u_time', CLBK_TIMER, _)
        // line.ConstructListeners();

        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .01, .2, 1.4, _, .4, true);
        // Animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, line, .5, -5., 5., 0);

    }


    
    { // Widget: Colorpicker
        // CreateColorPicker(SID.ATTR.WPOS_TIME4|SID.ATTR.DIM2)
        // CreateColorPicker(SID.ATTR.DIM2)
        // TODO: Enable multi vertex color in 'Widget_Slider_Simple' constructor
        // CreateColorPicker();
    }
    
    
    { // Widget: Slider-switch

        // CreateSliderSimple();
        // CreateSlider();
        // CreateChangeMeshColorFromSliders(ROOT_WIDGETS.CREATE_ROOT);
        
        // CreateSwitchSimple([0, ypos, 0]);
        // const switch1 = CreateSwitch();
    }


    { // Widget: Label-buttons

        // const label = CreateLabel('ABCDEFGHIJKLM');
        // // CreateLabel('\\/+0');
        // const label = CreateLabel('CreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line););CreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, lineCreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, lineCreateLabel(Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line');
        // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, label, .03, 0., 1.)
        
        // CreateLabel('Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);');
        // CreateLabel('Gl._framebuffer:-{render}|[mesh](FB.agqtpQji,TYPE.DIMENTION!,@23#scene,(label);');
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, label);
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, label);
        
        // const button = CreateButton(); 
        // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, button);
    }


    { // Widget: Dropdown

        // CreateDropdown([0,0, 0])
        // CreateDropdown2([0, ypos+=40, 0], 0);
        // CreateDropdown2InSection([0, ypos+=40, 0], 0);
        // CreateDropdown3([0, ypos+=40, 0], 0);
    }


    { // Widget: Scroller
    
        // CreateScroller(scene);
        // const scroller = CreateScrollerClampAlphaTest()
        
    }


    { // PARTICLES
        /**************************/
        // CreateGlowParticles();

        // CreateBallTailParticles(PURPLEB[3]);
        
        CreateSmokeParticles();




    }

    /** Section Synthesizes */
    {
        // SectionResizable([300, 300, 0])
        // SectionResizable([350, 350, 0])

        // TestSections1();

        // CreateManySections(scene);

        // const helpui = Help(scene);




        { // 
            // const fb = Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, s);
            // Rotate framebuffer mesh
            // setInterval(()=>{GlRotateZ2D(fb.render_area.gfx, fb.render_area.geom.dim, Timer_get_global_timer()*Timer_get_global_timer()*.55)}, 16);
        }
    }

    
    { // Misc
        
        // Test_widgets(ypos);
        
        
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, helpui);
    
        // const meshinfo_mesh = MeshInfo(scene)
        // TimeIntervalsCreate(64, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, MeshInfoUpdate, { mesh: meshinfo_mesh });
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, meshinfo_mesh);
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, meshinfo_mesh.children.buffer[0]);
    }
    
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
    root.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, root.gfx.vb.groupidx)

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




/*************************************************************************** */
// Create a right hand side panel
function CreatePanel(is_root_widget=undefined){

    const style = [0, 10, 2]
    const scrolled = Create_widget_section(_, SECTION.VERTICAL, [10,10], [0, 0, 0], [30,0], REDL[7], 'RightPanelScrolledSection', style, _, 1);
    
    
    // Add to scrolled mesh
    for (let j = 0; j < 2; j++) {
        // for(let i=0; i<1; i++){
        //     const label = Create_widget_label(_, '!', _, [0,0,0], 8, GREY[1], WHITE);
        //     scrolled.AddItem(label);
        //     // label.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled);
        // }
        
        
        const scrolled2 = Create_widget_section(_, SECTION.VERTICAL, [10,10], [0, 0, 0], [30,0], REDL[7], 'RightPanelScrolledSection', style, _, 1);
        for(let i=0; i<4; i++){
            const label = Create_widget_label(_, '!', _, [0,0,0], 8, GREY[1], WHITE);
            scrolled2.AddItem(label);
            label.SetName(`${j}-${i}`);
            // label.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scrolled);
        }
        const scroller2 = Create_widget_scroller(is_root_widget, scrolled2, [80,60], BLUEL[8], _, _);
        scrolled.AddItem(scroller2);
        scroller2.StateEnable(MESH_STATE.ACTIVE);
        scroller2.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        scroller2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        scroller2.options = SECTION.HORIZONTAL | SECTION.INHERIT;
        scroller2.scrolled_section.options = SECTION.VERTICAL;
        scroller2.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller2.scrolled_section);
        scroller2.SetName(`SCOLLER-${j}`);
    }


    const scroller = Create_widget_scroller(is_root_widget, scrolled, [140,140], BLUEL[8], _, _);

    scroller.StateEnable(MESH_STATE.ACTIVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    
    scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
    scroller.scrolled_section.options = SECTION.VERTICAL;
    
    scroller.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section);
    // scroller.scrolled_section.children.buffer[0].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[0]);
    // scroller.scrolled_section.children.buffer[1].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[1]);
    // scroller.scrolled_section.children.buffer[2].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[2]);
    // scroller.scrolled_section.children.buffer[3].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[3]);
    // scroller.scrolled_section.children.buffer[1].GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section.children.buffer[1]);
    // scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

    if(is_root_widget !== undefined){

        scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
        
        scroller.ScrollerAlign();
    
        // scroller.SetPosYNoGfxUpdate(200)
        scroller.SetPosXNoGfxUpdate(100)
    
        View_build_group_from_root_mesh(scroller.scrolled_section);
        
        const clip_top = scroller.GetPosY();
        const clip_bottom = clip_top + scroller.geom.dim[1]*2;
        Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
        
        scroller.Render();
        
        scroller.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scroller.gfx.vb.groupidx);
        
        View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);
        // View_build_group_from_root_mesh(scroller.scrolled_section);
    
        scroller.ConstructListeners();
    }

    return scroller
}



function SectionResizable(pos) {

    const tr = 1.;
    const marg = [10, 10];
    // const dim = [VIEWPORT.WIDTH, VIEWPORT.HEIGHT];
    const dim = [200, 200];

    // const grey = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, marg, [0, 500, 0], dim, TRANSPARENCY(BLUEL[5], tr), _, [40, 40, 2]);
    const grey = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, marg, pos, dim, TRANSPARENCY(BLUEL[5], tr), _, [40, dim[1], 2]);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    grey.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    grey.StateEnable(MESH_STATE.IS_RESIZEABLE);
    grey.SetName(`grey${grey_cnt++}`);
    grey.EnableGfxAttributes(MESH_ENABLE.GFX.FX_GLOW)

    grey.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    grey.EnableGfxUniforms({unif:SID.UNIF.TIME}, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_VS);
    

    // grey.geom.dim[0] *= sin;
    // grey.geom.dim[1] *= cos;


    grey.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
    // grey.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE);
    grey.Render();
    // grey.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, grey.gfx.vb.groupidx)
    // grey.GfxUniformsSetClbk('u_time', Timer_get_global_timer, _)
    grey.ConstructListeners();

    return grey;
}



function CreateGlowParticles(){ // 3 control Sliders 

    const scale_down = .2;
    
    const emitter_idx1 = Particle_system_create_emitter(BLUEL[9], [300,300,10], [40,40], .6, 1, 'T1st Particle System');
    const emitter = Particles_get_particle_system(emitter_idx1);
    emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
    
    // emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);
    
    TEMP_PARTICLES_GEN_GFX(emitter);
    emitter.GfxUniformsSetClbk('u_scale2', function(){return [scale_down,1]}, emitter.gfx.vb.groupidx);
    

    emitter.SetConeOfDirection(-1, 1, -.2, .2);
    
    
    
    // Second Particle Emitter
    const emitter_idx2 = Particle_system_create_emitter(PURPLER[5], [300,300,10], [40,40], .6, 1, 'Test Particle System2');
    const emitter2 = Particles_get_particle_system(emitter_idx2);
    emitter2.flags |= PARTICLES.HAS_START_POS_VARIATION;
    
    // emitter2.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);
    
    TEMP_PARTICLES_GEN_GFX(emitter2);
    emitter2.GfxUniformsSetClbk('u_scale2', function(){return [scale_down,1]}, emitter2.gfx.vb.groupidx);
    
    // emitter2.SetDir(1,1); // Enable emitters direction. By default is [0,0].
    emitter2.SetConeOfDirection(-.2, .2, -1, 1);


    
    /*************************************************************************************************************** */
    const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Emitt', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [10, 160, 0], 20, BLUEL[6], WHITE, [5, 5], .5);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    btn.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    btn.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
    btn.EnableGfxUniforms({unif:SID.UNIF.UNIF_GLOW2, fx:SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
    
    btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idx1, emitter_idx2] }, MESH_STATE.IS_HOLD_CLICK)
    
    
    btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    btn.Render();
    btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx);
    btn.GfxUniformsSetClbk('u_scale2', function(){return [1.,1]}, btn.gfx.vb.groupidx);
    btn.SetClbkGfxUniforms('u_glow_params', function(){return [.9, .0, 1.3]}, btn.gfx.vb.groupidx);
    btn.ConstructListeners();




    /*************************************************************************************************************** */
    // Create Sliders for manipulating variables of particles

    {
        const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 400, 0], [250, 10], _, _, 'Distance');
        slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        
        const flags = {
            unif: SID.UNIF.ROOT_WPOS2,
            pass: SID.PASS.WPOS2,
        }
        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        slider.Render();
        slider.ConstructListeners();
        
        slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx);
        slider.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider.gfx.vb.groupidx);

        Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 0)
        Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 0)
    }
    {
        const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 450, 0], [250, 10], _, _, 'Brighter');
        slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        slider.SetName('slider2 Inner');
    
        const flags = {
            unif: SID.UNIF.ROOT_WPOS2,
            pass: SID.PASS.WPOS2,
        }
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        // slider.GfxUniformsEnable({unif:SID.UNIF.TIME}, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
        
        slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        slider.Render();
        slider.ConstructListeners();
        
        slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx);
        slider.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider.gfx.vb.groupidx);
        // slider.GfxUniformsSetClbk('u_time', Slider_get_slider_val, slider);
        
        Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 1)
        Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 1)
    }
    {
        const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 500, 0], [250, 10], _, _, 'Intensity');
        slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        slider.SetName('slider3 Intensity')
        
        const flags = {
            unif: SID.UNIF.ROOT_WPOS2,
            pass: SID.PASS.WPOS2,
        }
        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        slider.Render();
        slider.ConstructListeners();
        
        slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx);
        slider.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider.gfx.vb.groupidx);

        Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 2)
        Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 2)
    }
}

function CreateBallTailParticles(color, num_balls=4){ // Particles Bouncing Ball Tail

    let balls_buffer = [];
    let dirs_buffer = [];
    let particles_system_buffer = [];
    let particle_system_idxs_buffer = [];
    let particles_system_buffer2 = [];

            
    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, _, [100, 0], [0, 0, 0], [300, 300], TRANSPARENCY(GREY[3], .0), 'Particles Bouncing Ball Tail',)
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    
    section.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
    
    // let x=0, y=0;  
    let swap_dir = 1; // Create direction variation in case of rendering many balls 
    for(let i=0; i<num_balls; i++){
        
        const dim = [10,10]
        // const rand = GetRandomInt(10,20)
        // const dim = [rand, rand]
        
        const pos = GetRandomPos([0,0], [section.geom.dim[0], section.geom.dim[1]])
        
        // const pos = [300,0]

        const ball = Create_rect_mesh(_, [pos[0], pos[1], 2], dim, WHITE, 'Ball', [0, dim[0], 2]);
        ball.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
        ball.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        ball.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        ball.EnableGfxAttributes(MESH_ENABLE.GFX.ATTR_STYLE);
        section.AddItem(ball);

        balls_buffer[i] = ball

        const color = GetSequencedColor()

        const scale = 2.;
        const particles_dim = [dim[0]*scale, dim[1]*scale]
        const particle_system_idx = Particle_system_create_emitter(color, [0, 0, 1], particles_dim, .7, 1, 'ParticleBallTail');
        
        const particle_system = Particles_get_particle_system(particle_system_idx);
        
        particle_system.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);
        particle_system.EnableGfxUniforms({unif:SID.UNIF.UNIF_SPEED}, 'u_speed', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
        




        /**************************************************************************************************************************************/
        // Scondary particles
        const scale_down = .04;
        
        const emitter_idx1 = Particle_system_create_emitter(color, [0,0,3], [40,40], 1, 1, 'T1st Particle System' );
        const emitter = Particles_get_particle_system(emitter_idx1);
        emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
        
        // emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);
        
        TEMP_PARTICLES_GEN_GFX(emitter);
        // TODO: Create SetScale callback from within the particles calss, so we can moderate the scale with uniforms
        emitter.GfxUniformsSetClbk('u_scale2', function(){return [scale_down,1]}, emitter.gfx.vb.groupidx);
        emitter.SetDir(-1, -1);
        emitter.SetConeOfDirection(-.1, .1, -.1, .1);
        particles_system_buffer2[i] = emitter;
        
        
        

        /**************************************************************************************************************************************/
        // Render Ball tail particles on top of the glow particles
        TEMP_PARTICLES_GEN_GFX(particle_system);

        particle_system.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, particle_system.gfx.vb.groupidx);
        // particle_system.GfxUniformsSetClbk('u_speed', function(){return 0;}, particle_system.gfx.vb.groupidx);
        
        particle_system.SetDir(1, 1*swap_dir);


        particles_system_buffer[i] = particle_system;
        particle_system_idxs_buffer[i] = particle_system_idx;
        dirs_buffer[i] = [1,1*swap_dir]

        swap_dir *= -1;


    }


    /***************************************************************************************************************/
    // Render 
    
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
    
    section.Render();
    
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    section.GfxUniformsSetClbk('u_scale2', ()=>{return [1,1];}, section.gfx.vb.groupidx);
    
    section.ConstructListeners();






    /*************************************************************************************************************** */
    // Create Sliders for manipulating variables of particles

    const slider_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10,10], [200, 600, 1], [0,0], GREEN[2], 'SliderSection', [0,10,2], );
    slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
           
    const flags = {
        unif: SID.UNIF.ROOT_WPOS2,
        pass: SID.PASS.WPOS2,
    }
    slider_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    slider_section.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

    { // Slider 1 contol
        const slider = Create_widget_slider(_, [0, 0, 0], [250, 10], _, _,  'sliderControl 1');
        slider.SetInitialValue(0);
        
        slider_section.AddItem(slider);

        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        const len = particles_system_buffer.length;
        for(let i=0; i < len; i++){
            Particles_gfx_uniforms_set_clbk(particles_system_buffer[i].idx, 'u_speed', Slider_get_slider_val, slider, 0)
        }
        // Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 0)

        Slider_connect(slider, ()=>{

            const slider_val = Slider_get_slider_val({slider:slider, start_val:0, max:1});

            const len = particles_system_buffer.length;
            for(let i=0; i < len; i++){

                const tail = particles_system_buffer[i];
                /**
                 * The logic is to create a small value for time_step on max slider value and larger value when the slider is at min val,
                 * so that the particles life time gets smaller with small slider values and bigger with larger slider values
                 * The "(1-slider_val)" reverses the slider val to [1..0].
                 * The "rev_slider_val+min)" creates the min result value, which is a smaller time step resulting in more prolonged tail
                 * The "((max-slider_val)*(slider_val))" widens the min to max result. 
                 *  The first part creates the maximum: Whatever the max value is set to, it gets up to +1+min(if max=1 => max=0+1+min)
                 *  So for example, if max=-1 then max becomes -1+1+min
                 *  The second part: if the slider val is 0 it cancels these 2 parts and the result is the minimum possible value.
                 *                  if the slider val is > 0 then it creates the maximum value
                 */
                
                let min = .8; // The min value gives the prolonged tail
                let max = 1.; // Calculate that the max value will be +1+min
                const rev_slider_val = 1-slider_val;
                tail.t_step = rev_slider_val+min + ((max-slider_val)*(rev_slider_val)); 

                // tail.speed = (slider_val+1)*4.5;
                tail.speed = (slider_val+1)*3;
                
                
                
                // // Secondary particles
                // min = .5; // The min value gives the prolonged tail
                // max = .5; // Calculate that the max value will be 1+min
                // const particles = particles_system_buffer2[i];
                // particles.t_step = rev_slider_val+min + ((max-slider_val)*(rev_slider_val)); 
                // particles.speed = (slider_val+1)*8;
                // // console.log(particles.t_step)
            }
        }, _);

    }
    { // Slider 1 contol
        const slider = Create_widget_slider(_, [0, 0, 0], [250, 10], _, _,  'sliderControl 2');
        slider.SetInitialValue(0);

        slider_section.AddItem(slider);
        
        const flags = {
            unif: SID.UNIF.ROOT_WPOS2,
            pass: SID.PASS.WPOS2,
        }
        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        const len = particles_system_buffer.length;
        for(let i=0; i < len; i++){
            Particles_gfx_uniforms_set_clbk(particles_system_buffer[i].idx, 'u_speed', Slider_get_slider_val, slider, 1)
        }
        // Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 0)

        // Slider_connect(slider, ()=>{

        //     const slider_val = Slider_get_slider_val({slider:slider});

        //     const len = particles_system_buffer.length;
        //     for(let i=0; i < len; i++){

        //         const tail = particles_system_buffer[i];
        //         /**
        //          * The logic is to create a small value for time_step on max slider value and larger value when the slider is at min val,
        //          * so that the particles life time gets smaller with small slider values and bigger with larger slider values
        //          * The "(1-slider_val)" reverses the slider val to [1..0].
        //          * The "rev_slider_val+min)" creates the min result value, which is a smaller time step resulting in more prolonged tail
        //          * The "((max-slider_val)*(slider_val))" widens the min to max result. 
        //          *  The first part creates the maximum: Whatever the max value is set to, it gets up to +1+min(if max=1 => max=0+1+min)
        //          *  So for example, if max=-1 then max becomes -1+1+min
        //          *  The second part: if the slider val is 0 it cancels these 2 parts and the result is the minimum possible value.
        //          *                  if the slider val is > 0 then it creates the maximum value
        //          */
        //         // let min = 0; // The min value gives the prolonged tail
        //         // let max = 0; // Calculate that the max value will be +1+min
        //         // const rev_slider_val = 1-slider_val;
        //         // // tail.t_step = rev_slider_val+1 + ((max-slider_val)*(rev_slider_val)); 
        //         // // tail.speed = (slider_val+1)*3;
        //         // // // console.log(tail.t_step)
                
                
                
        //         // // // Secondary particles
        //         // min = .5; // The min value gives the prolonged tail
        //         // max = .5; // Calculate that the max value will be 1+min
        //         // const particles = particles_system_buffer2[i];
        //         // particles.t_step = rev_slider_val+min + ((max-slider_val)*(rev_slider_val)); 
        //         // particles.speed = (slider_val+1)*8;
        //         // // console.log(particles.t_step)
        //     }
        // }, _);

    }
    { // Slider 2 contol
        const slider = Create_widget_slider(_, [0, 0, 0], [250, 10], _, _, 'sliderControl 3');
        slider.SetInitialValue(0);

        slider_section.AddItem(slider);
        
        const flags = {
            unif: SID.UNIF.ROOT_WPOS2,
            pass: SID.PASS.WPOS2,
        }
        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        // slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        // slider.Render();
        // slider.ConstructListeners();
        
        // slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx);
        // slider.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider.gfx.vb.groupidx);

        const len = particles_system_buffer.length;
        for(let i=0; i < len; i++){
            Particles_gfx_uniforms_set_clbk(particles_system_buffer[i].idx, 'u_speed', Slider_get_slider_val, slider, 2)
            Particles_gfx_uniforms_set_clbk(particles_system_buffer2[i].idx, 'u_glow_params', Slider_get_slider_val, slider, 0, .1, .9)
        }
        // Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 0)

        Slider_connect(slider, (params)=>{

            const slider_val = Slider_get_slider_val({slider:slider, start_val:0, max:1});

            const len = particles_system_buffer.length;
            for(let i=0; i < len; i++){

                const tail = particles_system_buffer[i];

                let min = .9; // The min value gives the prolonged tail
                let max = -.5; // Calculate that the max value will be +1+min
                const rev_slider_val = 1-slider_val;
                // tail.t_step = rev_slider_val+min + ((max-slider_val)*(rev_slider_val)); 
                // tail.speed = (slider_val+1)*4.5;
                
                
                
                // // Secondary particles
                // min = .5; // The min value gives the prolonged tail
                // max = 1; // Calculate that the max value will be 1+min
                const particles = particles_system_buffer2[i];
                
                // particles.t_step = rev_slider_val
                // if(particles.t_step > max) particles.t_step = max-.01;
                // else if(particles.t_step < min) particles.t_step = min+.01;
                // particles.t_step = rev_slider_val+min + ((max-slider_val)*(rev_slider_val)); 
                particles.speed = (slider_val+1)*8;
                // console.log(particles.t_step, rev_slider_val)
            }
        }, _);

    }
    slider_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    slider_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
    slider_section.Calc_no_gfx_update();
    slider_section.Render();
    slider_section.ConstructListeners();

    slider_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_section.gfx.vb.groupidx);
    slider_section.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider_section.gfx.vb.groupidx);





  


    const AnimateBall = function(params){

        
        const section = params.params.section;

    
        const top_bound = 0;
        const bot_bound = section.geom.dim[1]*2;
        const left_bound = 0;
        const right_bound = section.geom.dim[0]*2;

        const len = params.params.ball.length;
        for(let i=0; i<len; i++){

            const ball = params.params.ball[i];
            const particle_system = params.params.particles_system_buffer[i];
            const particle_system_idx = params.params.particle_system_idxs_buffer[i];
            const dir = params.params.dir[i];
            
            // Secondary Particles
            const small_particles = params.params.small_particles[i];
    


            // console.log(particle_system)
            
            // Move the ball
            
            const speed = 3;
            const variation = TimerGetGlobalTimerCycle()*.3 + .5;
            const x = 1 * dir[0] * particle_system.speed * variation * .5;
            // const x = 0;
            const y = 1 * dir[1] * particle_system.speed * .5;
            // const y = 0;
            
            ball.geom.MoveXY(x, y, ball.gfx);
            // ball.MoveXY(x, y);
            ball.geom.pos[0] += x;
            ball.geom.pos[1] += y;
    
            const pos = ball.GetPosXY();
            particle_system.pos[0] = pos[0]+ball.geom.dim[0]-particle_system.dim[0]; 
            particle_system.pos[1] = pos[1]+ball.geom.dim[1]-particle_system.dim[1]; 
    
    
            // Check boundaries

            
            const ball_top = ball.geom.pos[1] + y;
            const ball_bot = ball.geom.pos[1] + ball.geom.dim[1]*2 + y;
            const ball_left = ball.geom.pos[0] + x;
            const ball_right = ball.geom.pos[0] + ball.geom.dim[0]*2 + x;
    
    
    
            if(ball_bot > bot_bound){
                dir[1] *= -1;
                particle_system.SetDir(0, dir[1])
                small_particles.dir[1] = 1;
            }
            else if(ball_top < top_bound){
                dir[1] *= -1;
                particle_system.SetDir(0, dir[1])
                small_particles.dir[1] = -1;
            }
            if(ball_right > right_bound){
                dir[0] *= -1;
                particle_system.SetDir(dir[0], 0)
                small_particles.dir[0] = 1;
            }
            else if(ball_left < left_bound){
                dir[0] *= -1;
                particle_system.SetDir(dir[0], 0)
                small_particles.dir[0] = -1; 
            }
    
    
    
            const particles_params = {
                params: {
                    target_params:[particle_system_idx],
                }
            }
            Particle_system_emitt(particles_params);

            

            /*********************************************************************************************************/
            // Secondary Particles
            small_particles.pos[0] = pos[0]+ball.geom.dim[0]-small_particles.dim[0]; 
            small_particles.pos[1] = pos[1]+ball.geom.dim[0]-small_particles.dim[1]; 

            Particle_system_emitt({ params: { target_params:[small_particles.idx], }});
        }


        // console.log(params.params.cnt);
        // params.params.cnt++

    }   



    const params = {
        section:section,
        ball:balls_buffer,
        dir: dirs_buffer,
        particle_system_idxs_buffer:particle_system_idxs_buffer,
        particles_system_buffer:particles_system_buffer,
        small_particles: particles_system_buffer2,
    }

    TimeIntervalsCreate(1, 'ParticlesBallTail', TIME_INTERVAL_REPEAT_ALWAYS, AnimateBall, params);



    // let x = 0, y = 0;
    // const slider_dim = [250,10];
    // {
    //     const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [x, y, 0], slider_dim,);
    //     slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    //     slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     slider.SetName('slider1 Outer');
    //     slider.SetInitialValue(27);
        
    //     y+=slider_dim[1]*4 +10;

    //     const flags = {
    //         unif: SID.UNIF.ROOT_WPOS2,
    //         pass: SID.PASS.WPOS2,
    //     }
        
    //     slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    //     slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
    //     slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    //     slider.Render();
    //     slider.ConstructListeners();
        
    //     slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx);
    //     slider.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider.gfx.vb.groupidx);

    //     Particles_gfx_uniforms_set_clbk(particle_system_idx, 'u_glow_params', Slider_get_slider_val, slider, 0)
    // }
    // {
    //     const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [x, y, 0], slider_dim,);
    //     slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    //     slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     slider.SetName('slider2 Inner');
    //     slider.SetInitialValue(8);
                    
    //     y+=slider_dim[1]*4 +10;

    //     const flags = {
    //         unif: SID.UNIF.ROOT_WPOS2,
    //         pass: SID.PASS.WPOS2,
    //     }
    //     slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    //     slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
    //     // slider.GfxUniformsEnable({unif:SID.UNIF.TIME}, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);
        
    //     slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    //     slider.Render();
    //     slider.ConstructListeners();
        
    //     slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx);
    //     slider.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider.gfx.vb.groupidx);
    //     // slider.GfxUniformsSetClbk('u_time', Slider_get_slider_val, slider);
        
    //     Particles_gfx_uniforms_set_clbk(particle_system_idx, 'u_glow_params', Slider_get_slider_val, slider, 1)
    // }
    // {
    //     const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [x, y, 0], slider_dim,);
    //     slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    //     slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    //     slider.SetName('slider3 Intensity');
    //     slider.SetInitialValue(20);
                        
    //     y+=slider_dim[1]*4 +10;

    //     const flags = {
    //         unif: SID.UNIF.ROOT_WPOS2,
    //         pass: SID.PASS.WPOS2,
    //     }
        
    //     slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    //     slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
    //     slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    //     slider.Render();
    //     slider.ConstructListeners();
        
    //     slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx);
    //     slider.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider.gfx.vb.groupidx);

    //     Particles_gfx_uniforms_set_clbk(particle_system_idx, 'u_glow_params', Slider_get_slider_val, slider, 2)
    // }

}

function CreateSmokeParticles(){
    const scale_down = .2;
    
    const emitter_idx1 = Particle_system_create_emitter(BLUEL[9], [300,300,10], [40,40], .6, 1, 'T1st Particle System');
    const emitter = Particles_get_particle_system(emitter_idx1);
    emitter.flags |= PARTICLES.HAS_START_POS_VARIATION;
    
    // emitter.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);
    
    TEMP_PARTICLES_GEN_GFX(emitter);
    emitter.GfxUniformsSetClbk('u_scale2', function(){return [scale_down,1]}, emitter.gfx.vb.groupidx);
    

    emitter.SetConeOfDirection(-1, 1, -.2, .2);
    
    
    
    // Second Particle Emitter
    const emitter_idx2 = Particle_system_create_emitter(PURPLER[5], [300,300,10], [40,40], .6, 1, 'Test Particle System2');
    const emitter2 = Particles_get_particle_system(emitter_idx2);
    emitter2.flags |= PARTICLES.HAS_START_POS_VARIATION;
    
    // emitter2.EnableGfxAttributes(MESH_ENABLE.GFX.FX_NOISE);
    
    TEMP_PARTICLES_GEN_GFX(emitter2);
    emitter2.GfxUniformsSetClbk('u_scale2', function(){return [scale_down,1]}, emitter2.gfx.vb.groupidx);
    
    // emitter2.SetDir(1,1); // Enable emitters direction. By default is [0,0].
    emitter2.SetConeOfDirection(-.2, .2, -1, 1);


    
    /*************************************************************************************************************** */
    const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Emitt', ALIGN.HOR_CENTER | ALIGN.VERT_CENTER, [10, 160, 0], 20, BLUEL[6], WHITE, [5, 5], .5);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    btn.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    btn.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    btn.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
    btn.EnableGfxUniforms({unif:SID.UNIF.UNIF_GLOW2, fx:SID.FX.FS_GLOW,}, 'u_glow_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
    
    btn.Bind(Particle_system_emitt, _, { target_params: [emitter_idx1, emitter_idx2] }, MESH_STATE.IS_HOLD_CLICK)
    
    
    btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    btn.Render();
    btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx);
    btn.GfxUniformsSetClbk('u_scale2', function(){return [1.,1]}, btn.gfx.vb.groupidx);
    btn.SetClbkGfxUniforms('u_glow_params', function(){return [.9, .0, 1.3]}, btn.gfx.vb.groupidx);
    btn.ConstructListeners();




    /*************************************************************************************************************** */
    // Create Sliders for manipulating variables of particles

    const slider_section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10,10], [200, 600, 1], [0,0], GREY[0], 'SliderSection', [0,10,2], );
    slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    slider_section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
           
    const flags = {
        unif: SID.UNIF.ROOT_WPOS2,
        pass: SID.PASS.WPOS2,
    }
    slider_section.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    slider_section.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

    {
        const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 400, 0], [250, 10], BLUEL[5], _, 'Distance');
        slider_section.AddItem(slider);
        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 0)
        Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 0)
    }
    {
        const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 450, 0], [250, 10], BLUEL[5], _, 'Brighter');
        slider_section.AddItem(slider);
        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 1)
        Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 1)
    }
    {
        const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 500, 0], [250, 10], BLUEL[5], _, 'Intensity');
        slider_section.AddItem(slider);
        
        slider.GfxUniformsEnable(flags, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        slider.GfxUniformsEnable({unif:SID.UNIF.SCALE2}, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        
        Particles_gfx_uniforms_set_clbk(emitter_idx1, 'u_glow_params', Slider_get_slider_val, slider, 2)
        Particles_gfx_uniforms_set_clbk(emitter_idx2, 'u_glow_params', Slider_get_slider_val, slider, 2)
    }

    slider_section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    slider_section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
    slider_section.Calc_no_gfx_update();
    slider_section.Render();
    slider_section.ConstructListeners();

    slider_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_section.gfx.vb.groupidx);
    slider_section.GfxUniformsSetClbk('u_scale2', function(){return [1,1]}, slider_section.gfx.vb.groupidx);
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
    label.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // label.StateEnable(MESH_STATE.IS_HOVER_COLORABLE | MESH_STATE.IS_RESIZEABLE);

    // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4);
    // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS_TIME4);
    
    label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    label.Render()
    label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx)
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

    btn.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    // btn.sid.inst |= SID.ATTR.COL4|SID.ATTR.WPOS_TIME4

    btn.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    btn.Render();
    btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx)
    btn.ConstructListeners();

    Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, btn, .001, 0.6, .6, 0)
    Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .002, 0.4, .8, .4)
    Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, btn, .003, 0.2, .8, .8)
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .01, 0.6, 1.)
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGBA, btn, .01, 0.4, 1.)
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, btn, .01, 0.0, 1., 0)
    // Animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.A, btn, .01, .0, 1., .0)

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
    switch1.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })
    
    if(root_widget & ROOT_WIDGETS.CREATE_ROOT){

        switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
        switch1.Render();

        switch1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, switch1.gfx.vb.groupidx)
        
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
    switch1.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    switch1.ConstructListeners();

    switch1.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    switch1.Render();

    switch1.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, switch1.gfx.vb.groupidx)
    // switch1.text_mesh.SetColorRGB(PURPLER[7], 4);
    Set_color_rgb(switch1, PURPLER[7]);
    // ypos += switch1.geom.dim[1] * 2 + 5;

    return switch1;
}



function CreateSliderSimple() {


    const slider = Create_widget_slider_simple(ROOT_WIDGETS.CREATE_ROOT, [200, 500, 0], [150, 2]);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

    slider.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    slider.Render();
    slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)
    slider.ConstructListeners();


}



function CreateSlider() {

    const slider = Create_widget_slider(ROOT_WIDGETS.CREATE_ROOT, [200, 450, 0], [250, 10]);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    slider.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)

    slider.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    slider.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    slider.Render();
    slider.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider.gfx.vb.groupidx)
    slider.ConstructListeners();


}



/** PARAMS: {empty or undefined} */
function CreateChangeMeshColorFromSliders(root_widget=ROOT_WIDGETS.CREATE_ROOT) {

    const section = Create_widget_section(root_widget, SECTION.VERTICAL, [6, 6], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[0], .9))
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

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

    section.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    if(root_widget & ROOT_WIDGETS.CREATE_ROOT)
    {
        section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    
        section.options = SECTION.TOP_DOWN | SECTION.VERTICAL | SECTION.INHERIT | SECTION.RESIZE_PARENT;
        // section.options = SECTION.TOP_DOWN | SECTION.VERTICAL ;
        section.Calc_no_gfx_update();
        
        section.Render();
        
        section.ConstructListeners();

        section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
    }

    return section

}



function SdfLine(col, pos, dim, render_instanced_flags=0x0) {


    const line = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [0, 0], pos, dim, TRANSPARENCY(col, 1), 'sdf linem2', [0, 10, 1.8]);
    line.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    line.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER)


    line.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    line.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    line.Render();
    line.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, line.gfx.vb.groupidx)
    line.ConstructListeners();

    const vb_info = VBI_get_byidx(line.gfx.vb.groupidx)
    const vb_data = Vertex_buffer_get_by_vbidx(line.gfx.vb.idxs[0])


    // setInterval(()=>{GlRotateZ2D(line.gfx, line.geom.dim, Timer_get_global_timer()*.55)}, 16)
    // GlRotateZ2D(line.gfx, line.geom.dim, 1.23)

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

    dp.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

    dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    dp.Calc_no_gfx_update();
    
    dp.Render()

    dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)
    
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

    dp.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT
    dp.Calc_no_gfx_update();
    dp.Render()
    dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)
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

        dp.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
        dp.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT
        dp.Calc_no_gfx_update();
        dp.Render()
        dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)
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

    section.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);

    section.options = SECTION.EXPAND | SECTION.VERTICAL | SECTION.TOP_DOWN | SECTION.RESIZE_PARENT;
    section.Calc_no_gfx_update();


    section.Render()
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

    View_build_group_from_root_mesh(section)

    // section.ConstructListeners();
    section.ConstructListeners();


    // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes

    return dp;

}



function CreateColorPicker(render_instanced_flags=0x0){

    const picker = Create_widget_color_picker(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [20, 20], [0, 40, 0], [300, 200], GREY[3], _, [0, 35, 2]);
    // picker.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE)
    picker.StateEnable(MESH_STATE.IS_RESIZEABLE);

    picker.sid.inst = render_instanced_flags;

    picker.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // picker.EnableGfxUniforms({unif:SID.UNIF.DIM2}, 'u_dim', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    picker.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_PARENT_ASC);
    
    // picker.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN;
    picker.Calc_no_gfx_update();
    picker.Render();
    picker.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, picker.gfx.vb.groupidx)
    picker.ConstructListeners();

}



function CreateSceneMenuBar(items=null) {

    const pos = [0, 0, 0]
    const margin = [6,6];
    const style = [0,8,2];

    const dim =  [VIEWPORT.WIDTH/2 - margin[0], 100];

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6,6], pos, dim, TRANSPARENCY(GREY[1], 1.), _, style, )
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.SetName('Main Window')
    section.StateEnable(MESH_STATE.IS_RESIZEABLE);
    section.type |= MESH_TYPE.WIDGET_WINDOW;
    
    const menu = Create_widget_menubar(_, [0,0,pos[2]+1], dim, TRANSPARENCY(BLUEL[6], 1.), WHITE, 'Menu Bar', [10, 6], _, style);
    section.AddItem(menu);
    

    // Create statistics menu
    const statistics = Debug_info_ui(_, [0,0,0]);
    menu.AddToMenuBar(statistics, REL_POS.LEFT);

    menu.AddCloseButton(_, section, 'x', 8, TRANSPARENCY(BLUEL[6], 1.), BLUEL[1], _, 10, style);
    menu.AddMinimizeButton(_, section, 8, TRANSPARENCY(BLUEL[6], 1.), BLUEL[1], _, 10, _, style);
    
    
    
    // menu.options = SECTION.HORIZONTAL | SECTION.INHERIT | SECTION.EXPAND;
    menu.options = SECTION.HORIZONTAL | SECTION.EXPAND;


    // Create Window items
    if(items && Array.isArray(items)){

        for(let i=0; i<items.length; i++){
    
            section.AddItem(items[i]);
        }
    }
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

    
    section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC, section);
    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    
    section.options = SECTION.VERTICAL | SECTION.INHERIT | SECTION.TOP_DOWN | SECTION.FIXED_W;
    section.Calc_no_gfx_update();
    section.options &= ~SECTION.RESIZE_PARENT;
    
    if(items && Array.isArray(items)){
        const scroller = items[0] 
        View_build_group_from_root_mesh(scroller.scrolled_section);
        const clip_top = scroller.GetPosY();
        const clip_bottom = clip_top + scroller.geom.dim[1]*2;
        Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
    }
    section.Render();
    if(items && Array.isArray(items)){
        const scroller = items[0] 
        View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);
    }
    
    section.ConstructListeners();

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
    
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

    
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)
    
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
    blu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, blu.gfx.vb.groupidx);
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
    
    scroller.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    
    scroller.ScrollerAlign();
    
    View_build_group_from_root_mesh(scroller.scrolled_section);

    const clip_top = scroller.geom.pos[1];
    const clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1]*2;
    Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);

    scroller.Render();

    scroller.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scroller.gfx.vb.groupidx);

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



function CreateScrollerClampAlphaTest(num_items=10, root_widget=ROOT_WIDGETS.CREATE_ROOT) {

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
    const count = num_items;
    for (let i = 0; i < count; i++) {
        // const label = Create_widget_section(_, _, _, [0, 0, 0], [20,20], TRANSPARENCY(colors[i], .7), `Section${i + 1}`)
        // const label = Create_widget_text(_, `${i}`, [0, 0, 2], fontsize, TRANSPARENCY(colors[i], .7), WHITE)
        const label = Create_widget_label(_, `${i}`, _, [0, 0, 2], fontsize, TRANSPARENCY(colors[i], 1.7), WHITE, [6,4])

        label.SetName(`${i}`);
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
    
    scroller.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    scroller.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section);
    
    
    // scroller.SetPosYNoGfxUpdate(200)
    // scroller.SetPosXNoGfxUpdate(100)
    
    if(root_widget & ROOT_WIDGETS.CREATE_ROOT){
        
        scroller.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
        scroller.ScrollerAlign();
        
        View_build_group_from_root_mesh(scroller.scrolled_section);
        
        const clip_top = scroller.GetPosY();
        const clip_bottom = clip_top + scroller.geom.dim[1]*2;
        // const clip_bottom = scroller.geom.pos[1] + scroller.geom.dim[1];
        Clipy_from_group(scroller.scrolled_section.group_bufferidxs[0], clip_top, clip_bottom);
        
        scroller.Render();
        
        scroller.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, scroller.gfx.vb.groupidx);
        
        View_set_view_vb_start(scroller.scrolled_section.group_bufferidxs, scroller.scrolled_section.gfx.vb.start);
        // View_build_group_from_root_mesh(scroller.scrolled_section);
    
        scroller.ConstructListeners();
    }


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




function CreateScrollerInScroller(items=null){

    const pos = [0, 0, 0]
    const margin = [6,6];
    const style = [0,8,2];

    const section = Create_widget_section(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [6,6], pos, [200, 200], TRANSPARENCY(GREY[1], 1.), _, style, )
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    section.SetName('Main Section')
    section.StateEnable(MESH_STATE.IS_RESIZEABLE);
    section.type |= MESH_TYPE.WIDGET_WINDOW;

    const scrolled = Create_widget_section(_, SECTION.VERTICAL, [10,10], [0, 0, 0], [100,100], YELLOWL[7], 'RightPanelScrolledSection', style, _, 1);
    // Add to scrolled mesh
    if(items){
        for (let j = 0; j < items.length; j++) {
            scrolled.AddItem(items[j])
        }

    }
    else{

        for (let j = 0; j < 2; j++) 
        {
    
            
            const scrolled2 = Create_widget_section(_, SECTION.VERTICAL, [10,10], [0, 0, 0], [30,90], REDL[7], 'RightPanelScrolledSection', style, _, 1);
            for(let i=0; i<4; i++){
                const label = Create_widget_label(_, '!', _, [0,0,0], 8, GREY[1], WHITE);
                scrolled2.AddItem(label);
                label.SetName(`${i}`);
            }
            const scroller2 = Create_widget_scroller(_, scrolled2, [80,90], BLUEL[8], _, _);
            scrolled.AddItem(scroller2);
            scroller2.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            // scroller2.options = SECTION.VERTICAL | SECTION.INHERIT;
            scroller2.scrolled_section.options = SECTION.VERTICAL;
            scroller2.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller2.scrolled_section);
            scroller2.SetName(`SCOLLER-2`);
            
            // scroller2.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        }
    
    }
    const scroller = Create_widget_scroller(_, scrolled, [140,140], BLUEL[8], _, _);
    section.AddItem(scroller)
    // scroller.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    scroller.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    // scroller.options = SECTION.HORIZONTAL | SECTION.INHERIT;
    scroller.scrolled_section.options = SECTION.VERTICAL;
    scroller.SetName(`SCOLLER-1`);

    // scroller.ScrollerAlign();
    
    scroller.scrolled_section.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, scroller.scrolled_section);


    section.GfxUniformsEnable({unif:SID.UNIF.ROOT_WPOS2, pass:SID.PASS.WPOS2}, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
        
    scroller.ScrollerAlign();
    // section.Calc_no_gfx_update();

    // scroller.SetPosYNoGfxUpdate(200)
    // section.SetPosXNoGfxUpdate(100)

    View_build_group_from_root_mesh(section);
    
    const clip_top = section.GetPosY();
    const clip_bottom = clip_top + section.geom.dim[1]*2;
    Clipy_from_group(section.group_bufferidxs[0], clip_top, clip_bottom);
    
    section.Render();
    
    View_set_view_vb_start(section.group_bufferidxs, section.gfx.vb.start);
    
    section.ConstructListeners();

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);

    return section
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

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    

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
    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    
    // View_build_group_from_root_mesh(section);
    // DEBUG_INFO.UI_MESH.IDX = section.idx;

    return section;
}

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

                msgs.push(`Plain Text:${child.GetName()}, dim: ${child.mesh_bufferidx}`);
                msgs.push(`{pos:[${FloorArr3(child.geom.pos)}]} {dim:[${child.geom.dim}]}, {alpha:${child.mat.col[3]}}`);
                msgs.push(`1gfx: prog:${child.gfx.prog.idx}, vb:${child.gfx.vb.idx}, start:${child.gfx.vb.start}, faces:${text_num_faces}`);
            }
            else if (child.text_mesh) { // Text in label or any other mesh that has text_mesh
                msgs.push(`Text_mesh: id:${child.text_mesh.mesh_bufferidx}, name:${child.text_mesh.GetName()},`);
                msgs.push(`{pos:[${FloorArr3(child.text_mesh.geom.pos)}]}, {dim: [${child.text_mesh.geom.dim}]}, {alpha:${child.text_mesh.mat.col[3]}}`);
                msgs.push(`2gfx: {prog:${child.text_mesh.gfx.prog.idx}}, {vb:${child.text_mesh.gfx.vb.idx}}, {start:${child.text_mesh.gfx.vb.start}}, {faces:${child.text_mesh.geom.num_faces}}`);
            }
        }
        else if (infoMesh.text_mesh) {
            msgs.push(`Text_mesh: id:${infoMesh.text_mesh.mesh_bufferidx}, name:${infoMesh.text_mesh.GetName()},`);
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


