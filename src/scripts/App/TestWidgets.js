"use strict";
import { FloorArr2, FloorArr3, Mult_arr3_scalar } from '../Helpers/Math/MathOperations.js';


import { DEBUG_PRINT_KEYS } from '../Engine/Controls/Input/Keyboard.js';

import { Dropdown_roots_set_root } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { Debug_info_create_ui_focused, Debug_info_create_ui_mouse, Debug_info_ui, Debug_info_ui_static, Debug_info_ui_static_app_generic_buffers_container, Debug_info_ui_static_app_generic_buffers, Debug_info_ui_static_app_int16_buffers, Debug_info_ui_static_app_int8_buffers, Debug_info_ui_static_more_performance_timers } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { GetRandomColor, GetRandomInt, GetRandomPos, GetSequencedColor } from '../Helpers/Helpers.js';
import { Create_rect_mesh, Create_text_mesh, Create_widget_button, Create_widget_close_btn, Create_widget_color_picker, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_minimize_btn, Create_widget_multi_text, Create_widget_scroller, Create_widget_slider, Create_widget_slider_simple, Create_widget_switch_button, Create_widget_switch_simple, Create_widget_text } from '../Engine/Core/CreateWidget.js';
import { Clipy_from_group } from '../Engine/Drawables/Operations/Clip.js';
import { BLACK, BLUE, BLUEL, BLUER, BLUE_10_120_220, COLOR_GRADIENT_HORIZONTAL, COLOR_GRADIENT_VERTICAL, CYAN, GREEN, GREENL, GREENR, GREY, Get_fasma_color, Interpolate_rgb_to_01, MAGENTA, ORANGE, ORANGEL, ORANGER, ORANGE_240_160_10, PURPLE, PURPLEB, PURPLER, RED, REDL, RGB, TRANSPARENT, WHITE, YELLOW, YELLOWL, YELLOWR } from '../Engine/Drawables/Material/Base/Colors.js';
import { View_build_group_from_root_mesh, View_set_view_vb_start } from '../Engine/Core/Views/MeshBufferViews.js';

import { Mouse_get_pos } from '../Engine/Controls/Input/Mouse.js';
import { REL_POS, Relative_pos_comp_create_new_comp } from '../Engine/Drawables/Operations/RelativePosComponent.js';
import { Mesh_animations_create } from '../Engine/Animations/MeshAnimations.js';
import { Set_color_rgb } from '../Engine/Drawables/Operations/MeshAttributesFunctions.js';
import { Mesh_unif_add_vb_root_wposx, Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from '../Engine/Core/MeshUniformsBuffer.js';

import { Timer_get_global_timer_cycle, Timer_get_global_timer, Timer_get_global_timer_0_1 } from '../Engine/Timers/Timers.js';
import { VBI_get_byidx, Vertex_buffer_get_by_vbidx, Vertex_buffer_group_create_scissorbox, Vertex_buffer_group_update_scissorbox_all_vb, Vertex_buffer_set_and_update_uniform } from '../Graphics/Buffers/VertexBuffers.js';
import { Slider_connect, Slider_get_slider_val } from '../Engine/Drawables/Widgets/WidgetSlider.js';
import { Switch_simple_time_interval_callback } from '../Engine/Drawables/Widgets/WidgetSwitch.js';
import { Gl_set_rgba, Gl_rotate_z_2d, Gl_set_attr_round_corners, Gl_set_angle, Gl_set_dim_xy, Gl_add_vpos_xy, Gl_set_vpos_xy, Gl_set_wpos_xy, Gl_set_time, Gl_set_generic2 } from '../Graphics/Buffers/VertexBuffersOps.js';
import { Callback_animations_create } from '../Engine/Animations/CallbackAnimations.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree, Find_parent_listen_event } from '../Engine/Drawables/Operations/Recursions.js';
import { Create_comet_particles, Create_explosion_particles, Create_glow_particles, Create_smoke_particles, Demo_glow_particles_sparkles_effect, Demo_glow_particles_test_dif_shaders } from './Demo/DemoParticles.js';
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scroller_component_calculate_handle_pos_dim } from '../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Listeners_set_priority } from '../Engine/Events/EventListeners.js';
import { Elastic_collisions, Sattelite_rotation } from './Demo/DemoPhysics.js';
import { Demo_page, Demos_welcome_menu } from './DemoPage.js';
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs } from '../Engine/Core/Views/RootView.js';
import { Demo_clbk_animations_create_transition_slope, Demo_clbk_animations_text_counter, Demo_clbk_animations_text_create, Demo_animations, Demo_animations_with_slider_slope, Demo_animations_text, Demo_animations_ready_button_anim } from './Demo/DemoAnimations.js';
import { Demo_chain_link } from './Demo/DemoChainLink.js';
import { Game_snake } from './Demo/Games/Tetris/Snake.js';
import { Mesh_get_uniform_ubidx_from_name, Mesh_set_root_in_focus } from '../Engine/Drawables/Operations/MeshHelperFunctions.js';
import { Digitize, Function_Slope, Linear_interpolation, Logarithmic_interpolation, Quadratic_interpolation } from '../Helpers/Math/MathFunctions.js';
import { App_reinitialize, App_reset } from './App.js';
import { Time_intervals_create } from '../Engine/Timers/TimeIntervals.js';
import { Demo_complicated_widget_layout, Demo_widgets, Demo_widgets_colorpicker, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_dropdown, Demo_widgets_explainer_info, Demo_widgets_msdf_text_rendering, Demo_widgets_scrolled_labels, Demo_widgets_sections } from './Demo/DemoWidgets.js';
import { Board_rotations } from './Demo/DemoBoardRotations.js';
// import { Texture_metrics_get_sub_tex_width, Texture_metrics_get_face_advancex, Texture_metrics_get_line_height } from '../Engine/Loaders/Font/Font.js';
// import { Tetris } from './Demo/Games/Snake/Tetris.js';
import { Bitwise_operations_run_test } from '../Engine/Core/BitwiseOps.js';
import { Arkanoid_initialize, Arkanoid_test_game_options } from './Demo/Games/Arkanoid/Arkanoid.js';
import { Widget_ready_label, Widget_ready_rect, Widget_ready_slider, Widget_ready_slider_simple, Widget_ready_switch, Widget_ready_switch_button } from './Widgets/WidgetReadyWidgets.js';
import { Effects_create_explosion_circle, Effect_explosion_circle_get_mesh_byidx } from '../Engine/Drawables/Effects/Effects.js';
import { Widget_gfx_ready_enable, Widget_gfx_ready_enable_default } from './Widgets/WidgetGfxReady.js';
import { CALLBACK_ANIMATION_TYPE_IDX, Callback_animations_create_specific } from '../Engine/Animations/CallbackAnimationsReadyAnimations.js';
import { Align_expand, Align_pre_simple, Test_alignment } from './Tests/TestAlignNestedSections.js';
import { Performance_timer_start, Performance_timer_stop, PerformanceTimersGetFps, PerformanceTimersGetMilisec } from '../Engine/Timers/PerformanceTimers.js';
import { Texture_metrics_get_sub_tex_width, Texture_metrics_get_line_height } from '../Engine/Loaders/Textures/TextureUvMap.js';
import { Style_button_default_properties, Style_dropdown_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_section_default_properties, Style_slider_default_properties, Style_slider_simple_default_properties, Style_switch_button_default_properties, Style_switch_default_properties } from '../Engine/Drawables/Widgets/WidgetReadyStyles.js';
import { Controls_create_slider_controls_from_shader_uniform_buffer, Controls_create_slider_controls_from_shader_uniform_buffer_with_panel } from './Widgets/WidgetGenericControlsReady.js';
import { LAYOUT, LISTEN_EVENT_TYPES, MESH_STATE, ROOT_WIDGETS, SECTION } from '../Engine/Global/EngineConstants.js';
import { GFX_CTX_FLAGS } from '../Graphics/Global/GfxConstants.js';


{
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
}








export function TestWidgetsGeneric() {

    SectionResizable([50, 0, 0])
    CreateManySections();
}



function SectionResizable(pos) {

    const tr = 1.;
    const marg = [10, 10];
    const dim = [200, 200];
    // const dim = [400, VIEWPORT.HEIGHT / 2];

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: _, pad: marg, pos: pos, dim: dim, col: TRANSPARENCY(BLUEL[5], tr), }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, })
    section.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE);
    section.StateEnable(MESH_STATE.IS_RESIZEABLE);
    section.SetName('section');


    section.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    section.Render();

    section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx)

    Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    Construct_listen_events_from_mesh_tree(section);
    Construct_listen_events_relations_from_mesh_tree(section);

    return section;
}


function CreateManySections(scene) {

    const tr = 1.;
    const rcorners1 = 10;

    const blu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [0, 400, 0], dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({mesh:blu, enable_sdf_rect:rcorners1, })
    blu.CreateListenEvent(LISTEN_EVENT_TYPES.MOVE); blu.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);

    
    const red = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[7], tr), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({mesh:red, enable_sdf_rect:rcorners1, })
    red.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
    blu.AddItem(red);
    
    
    {
        const black = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 1], dim: [20, 20], col: TRANSPARENCY(BLACK, tr), layout:LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF}));
        Widget_gfx_ready_enable({mesh:black, enable_sdf_rect:rcorners1, })
        black.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
        black.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF
        red.AddItem(black);

        {
            const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({mesh:grey_1, enable_sdf_rect:rcorners1, })
            grey_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            black.AddItem(grey_1);

            {
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
            }
            {
                const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[2], tr), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({mesh:s, enable_sdf_rect:rcorners1, })
                s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                grey_1.AddItem(s);
    
                {
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 30], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [40, 10], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                }
            }
        }
        {
            const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({mesh:grey_1, enable_sdf_rect:rcorners1, })
            grey_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            black.AddItem(grey_1);

            {
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
            }
            {
                const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[2], tr), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({mesh:s, enable_sdf_rect:rcorners1, })
                s.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
                grey_1.AddItem(s);
    
                {
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 30], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [40, 10], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [50, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                    {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [30, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); s.AddItem(s1);}
                }
            }
        }

        {
            const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout:LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({mesh:grey_1, enable_sdf_rect:rcorners1, })
            grey_1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER);
            black.AddItem(grey_1);

            {
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.VERTICAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
                {const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout:LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({mesh:s1, enable_sdf_rect:rcorners1, }); s1.CreateListenEvent(LISTEN_EVENT_TYPES.HOVER); grey_1.AddItem(s1);}
            }
        }

    }
   
    // {





    Align_pre_simple(blu);

    blu.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC);
    blu.Render();
    Root_group_activate_all_vbs_in_renderqueue(blu.root_bufferidx);
    blu.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, blu.gfx.vb.groupidx);

    Construct_listen_events_from_mesh_tree(blu)
    Construct_listen_events_relations_from_mesh_tree(blu)

    return blu;
}
