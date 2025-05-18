"use strict";
import { FloorArr2, FloorArr3, Max, Max3, Min, Min3, Mult_arr3_scalar } from '../Helpers/Math/MathOperations.js';
import { Create_rect_mesh, Create_widget_button, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_slider, Create_widget_slider_simple, Create_widget_switch_simple, Create_widget_text } from '../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js';
import { View_build_group_from_root_mesh, View_render_from_view_NEW, View_render_from_view_specific_render_group_NEW, View_reset_to_index_from_view_group_NEW } from '../Engine/Core/Views/MeshBufferViews.js';
import { Root_group_activate_all_vbs_in_renderqueue, Root_group_rerender_from_root_reconstruct_listeners, Root_group_reset_gfxs, Root_group_resize_and_rerender } from '../Engine/Core/Views/RootView.js';
import { GREY, BLUEL, YELLOW, YELLOWL, YELLOWR, GREEN, PURPLE, PURPLER, PURPLEB, REDL, BLACK, WHITE, ORANGE, Interpolate_rgb_to_01, COLOR_GRADIENT_VERTICAL, COLOR_GRADIENT_HORIZONTAL, RGB, RED, CYAN, BLUE, MAGENTA, ORANGER, Get_fasma_color, COLOR_THEME_BASIC, Color_hsv_to_rgb, Contrast_rgba, Luminance_rgb, Contrast_calibrated, Contrast_calibrated_rgba, Color_hsv_to_rgb_calibrated } from '../Engine/Drawables/Material/Colors.js';
import { Construct_listen_events_from_mesh_tree, Construct_listen_events_relations_from_mesh_tree } from '../Engine/Events/EventFunctions.js';
import { Dropdown_roots_set_root } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { GetSequencedColor } from '../Helpers/Helpers.js';
import { Test_alignment } from './Demo/DemoAlignNestedSections.js';
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_dropdown_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties, Style_slider_simple_default_properties, Style_switch_default_properties } from '../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js';
import { Widget_ready_label, Widget_ready_rect, Widget_ready_slider, Widget_ready_switch } from '../Engine/Drawables/Widgets/Helpers/WidgetReadyWidgets.js';
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_get_vb_root_wpos } from '../Engine/Core/MeshUniformsBuffer.js';
import { Components_create_scroller_component, Scoller_component_gengfx_and_render, Scoller_component_render, Scroller_component_calculate_handle_pos_dim } from '../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Listeners_set_priority } from '../Engine/Events/EventListeners.js';
import { Vertex_buffer_build_index_buffer_all, Vertex_buffer_calculate_render_group_starts, Vertex_buffer_group_create_scissorbox, } from '../Graphics/Buffers/VertexBuffers.js';
import { Slider_connect } from '../Engine/Drawables/Widgets/WidgetSlider.js';
import { Gl_set_angle, Gl_set_generic2, Gl_set_rgba, Gl_set_time } from '../Graphics/Buffers/VertexBuffersOps.js';
import { Time_intervals_create } from '../Engine/Timers/TimeIntervals.js';
import { Timer_get_global_timer } from '../Engine/Timers/Timers.js';
import { Demo_animations, Demo_animations_ready_button_anim, Demo_animations_ready_button_with_panel, Demo_animations_text, Demo_animations_with_slider_slope, Demo_clbk_animations_create_transition_slope, Demo_clbk_animations_text_counter, Demo_clbk_animations_text_create } from './Demo/DemoAnimations.js';
import { CALLBACK_ANIMATION_TYPE_FLAGS, CALLBACK_ANIMATION_TYPE_IDX, Callback_animations_create_specific } from '../Engine/Animations/CallbackAnimationsReadyAnimations.js';
import { Mesh_animations_create } from '../Engine/Animations/MeshAnimations.js';
import { Create_comet_particles, Create_explosion_particles, Create_glow_particles, Create_smoke_particles, Demo_glow_particles_sparkles_effect, Demo_glow_particles_explosion_shaders } from './Demo/DemoParticles.js';
import { Debug_info_create_ui_mouse, Debug_info_ui, Debug_info_ui_fps_detailed, Debug_info_ui_static, Debug_info_ui_static_app_generic_buffers, Debug_info_ui_static_app_generic_buffers_container, Debug_info_ui_static_app_int16_buffers, Debug_info_ui_static_app_int8_buffers, Debug_info_ui_static_more_performance_timers } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { Demo_complicated_widget_layout, Demo_widgets, Demo_widgets_colorpicker, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_dropdown, Demo_widgets_explainer_info, Demo_widgets_msdf_text_rendering, Demo_widgets_scrolled_labels, Demo_widgets_sections } from './Demo/DemoWidgets.js';
import { Texture_metrics_get_line_height, Texture_metrics_get_sub_tex_height, Texture_metrics_get_sub_tex_width, Texture_metrics_get_texture_height } from '../Engine/Loaders/Textures/TextureUvMap.js';
import { Board_rotations } from './Demo/DemoBoardRotations.js';
import { Callback_animations_create } from '../Engine/Animations/CallbackAnimations.js';
import { App_reinitialize, App_reset } from './App.js';
import { Controls_create_slider_controls_from_shader_uniform_buffer, Controls_create_slider_controls_from_shader_uniform_buffer_with_panel } from '../Engine/Drawables/Widgets/Helpers/WidgetGenericControlsReady.js';
import { Effect_explosion_circle_get_mesh_byidx, Effects_create_explosion_circle } from '../Engine/Drawables/Effects/Effects.js';
import { Linear_interpolation } from '../Helpers/Math/MathFunctions.js';
import { Arkanoid_initialize, Arkanoid_test_game_options } from './Demo/Games/Arkanoid/Arkanoid.js';
import { Mesh_get_real_pos_y, Mesh_rotate_z, Mesh_set_color_rgba } from '../Engine/Drawables/Operations/MeshAttributesFunctions.js';
import { Mesh_get_name, Mesh_listener_create } from '../Engine/Drawables/Operations/MeshPropertiesFunctions.js';
import { Align_nested_sections_pre, Align_expand, Align_pre_simple___with_grow_containers } from '../Engine/Drawables/Operations/AlignNestedSections.js';
import { Elastic_collisions, Sattelite_rotation } from './Demo/DemoPhysics.js';
import { Demo_page } from './DemoPage.js';
import { Demo_chain_link } from './Demo/DemoChainLink.js';
import { Tetris } from './Demo/Games/Tetris/Tetris.js';
import { Game_snake } from './Demo/Games/Snake/Snake.js';
import { Scene_store_window_resized_meshes } from '../Engine/Scenes.js';
import { Color_theme_label_auto, Color_theme_slider_1, Color_theme_slider_auto, Color_theme_switch_auto } from '../Engine/Drawables/Material/Themes.js';
import { Renderqueue_set_active } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { Test_find_match_from_parent_descending } from '../tests/TestsGfxContext.js';
import { Test_bitwise_from_book_run_all_tests } from '../Engine/Core/BitwiseOps_fromBookTests.js';
import { Widget_render } from '../Engine/Drawables/Widgets/Helpers/WidgetRender.js';












export function TestWidgetsGeneric() {


    let ypos = 0
    let xpos = 10


    // Test: Measure performance of the 2 kinds of section auto-alignment
    // Test_performance_align_functions() // DEPRECATED


    { // Statistics
        let yy = 0, pp = 23;
        // const d0 = Debug_info_ui_static(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d0.geom.dim[1] * 2
        // const d1 = Debug_info_ui_fps_detailed(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d1.geom.dim[1] * 2
        // const d2 = Debug_info_ui_static_more_performance_timers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d2.geom.dim[1]*2
        // const d4 = Debug_info_create_ui_mouse(_, _, yy); yy += d4.geom.dim[1] * 2
        // const d5 = Debug_info_ui_static_app_generic_buffers_container(ROOT_WIDGETS.CREATE_ROOT, 0, yy);yy += d5.geom.dim[1]*2
        // const d6 = Debug_info_ui_static_app_generic_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d6.geom.dim[1]*2
        // const d7 = Debug_info_ui_static_app_int16_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d7.geom.dim[1]*2
        // const d8 = Debug_info_ui_static_app_int8_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d8.geom.dim[1]*2
        // const d3 = Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d3.geom.dim[1]*2
    }


    /*************************************************************************************************************************/
    // Test: New implementation -> VB render groups
    // {
    //     const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [100, 200, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'ROOT' }));
    //     Widget_gfx_ready_enable({
    //         mesh: section, enable_sdf_rect: 15,
    //         listener: { type: LISTEN_EVENT_TYPES.MOVE },
    //     });

    //     let cnt = 1;
    //     const font_size = 20;

    //     {
    //         const red = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 20], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(1., .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`red 1` }));
    //         Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: 15 }); 
    //         // red.RenderToNewRenderGroup();
    //         section.AddItem(red);

    //         {
    //             const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
    //             Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
    //             red.AddItem(s1); 
    //             // s1.RenderToNewRenderGroup();
    //             {
    //                 // {
    //                 //     const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
    //                 //     Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
    //                 // }
    //                 // {
    //                 //     const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
    //                 //     Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
    //                 // }
    //                 // {
    //                 //     const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
    //                 //     Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
    //                 // }

    //                 const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
    //                 Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    //                 s1.AddItem(l);

    //                 const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
    //                 Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    //                 s1.AddItem(sw);

    //                 const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
    //                 Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
    //                 s1.AddItem(sl);
    //             }
    //         }
    //         {
    //             const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
    //             Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
    //             red.AddItem(s1); 
    //             s1.RenderToNewRenderGroup();
    //             {
    //                 const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
    //                 Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    //                 const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
    //                 Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    //                 s2.AddItem(l);

    //                 const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
    //                 Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    //                 s1.AddItem(sw);

    //                 const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
    //                 Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
    //                 s1.AddItem(sl);
    //             }
    //         }
    //         {
    //             const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
    //             Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
    //             red.AddItem(s1); 
    //             s1.RenderToNewRenderGroup();
    //             {
    //                 const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
    //                 Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

    //                 const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
    //                 Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    //                 s2.AddItem(l);

    //                 const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
    //                 Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    //                 s1.AddItem(sw);

    //                 const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
    //                 Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
    //                 s1.AddItem(sl);
    //             }
    //         }

    //     }


    //     { // Render
    //         // section.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
    //         section.GenGfxCtx();


    //         // View_build_all_group_from_root_mesh(section);
    //         Vertex_buffer_calculate_render_group_starts();
    //         Align_nested_sections_pre(section);
    //         View_render_from_view_NEW(section.group_bufferidxs[0]);

    //         Root_group_activate_all_vbs_in_renderqueue(section.root_bufferidx);
    //         section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section.gfx.vb.groupidx);
    //         Construct_listen_events_from_mesh_tree(section)
    //         Construct_listen_events_relations_from_mesh_tree(section);
    //     }



    //     // TEST if the gfx buffers are set properly
    //     // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section, .03, 0., 1.,)
    //     // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section.children.buffer[0], .015, 0., 1.,)
    //     // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section.children.buffer[0].children.buffer[0], .031, 0., 1.,)
    //     // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section.children.buffer[0].children.buffer[1], .03, 0., 1.,)
    //     // // Mesh_set_color_rgba(section.children.buffer[0], BLUEL[9])
    //     // // Mesh_set_color_rgba(section.children.buffer[0].children.buffer[0], BLUEL[9])
    //     // // Mesh_set_color_rgba(section.children.buffer[0].children.buffer[1], BLUEL[9])


    //     // // View_reset_to_index_from_view_group_NEW(1);
    //     // // View_render_from_view_specific_render_group_NEW(1)


    //     // // View_reset_to_index_from_view_group_NEW(1);
    //     // // View_render_from_view_specific_render_group_NEW(1)

    //     // // View_render_from_view_specific_render_group_NEW(section.group_bufferidxs[0], 2)
    // }




    // Demo_page();
    // Demos_welcome_menu();

    { // Games
        // Arkanoid_initialize();
        // Arkanoid_test_game_options();

        // Tetris(ROOT_WIDGETS.CREATE_ROOT, 20, 132);
        // Game_snake(45, true);
    }

    { // Quick widget enable
        // CreateSimpleWidgetText(120, 280)
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, _, _, _, 18);
        // CreateSliderSimple();
        // Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 100, 100, _, 'Ready Slider', _,)
        // CreateDropdownTree([100, 200, 0])
        // CreateScrollerClampAlphaTest(_, 100, 400, 10, 12)
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 500, 140, _, _, _, _, _, _, 0x0);
        // Test_rotate_section_with_round_corners();
    }

    // Window_menu_2();


    /*************************************************************************************************************************/
    // Test: Alignment
    {
        // Test_alignment();
        // TestAlignNew([0, 200, 0])
        // Test_align_many_sliders();

        // Test_resize_fill_space_layout();
        // Test_resize_fill_space_layout_nested(_, 0);
        // Test_resize_fill_space_layout_nested_with_widgets();
    }


    /*************************************************************************************************************************/
    // Test Widgets
    { // widget plain text
        // CreateSimpleWidgetText()
        // CreateTextInSectionWithNewLine();
    }

    { // Widget: Label-buttons

        // CreateLabel(_, '0', TEXTURES.MTSDF_CONSOLAS_1024, _, 5, 400,_,_,_, 65);
        // CreateLabel(_, 'Qr|\`\'0123456789', TEXTURES.MTSDF_CONSOLAS_1024, _, 5, 400,_,_,_, 65);
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700,_,_,_,398);
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_COMIC_1024, _, 300, 700,_,_,_,18);
        // CreateLabel(_, '| Initializing Graphics.', TEXTURES.CONSOLA_VARIANT_FONT, ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S10_0, 300, 50,_,_,_,75,);
        // CreateLabel(_, 'Widget_Label\n12345\nppao918827', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 50,_,_,_);
        // CreateLabel(_, 'Widget_Label\n12345\nppao918827', TEXTURES.CONSOLA_VARIANT_FONT, ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S1_5, 300, 150, _, _, _);
        // Widget_ready_label(ROOT_WIDGETS.CREATE_ROOT, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, 300, 100,18,_,_,_);

        // Render font symbols atlas texture
        // Render_font_symbols_atlas_texture(30, 50);    

        // Test: Set Focused
        // CreateSectionedButtons([100, 20, 0], 'Section 1')
        // CreateSectionedButtons([100, 170, 0], 'Section 2')


        { // MSDF with scale slider
            // Demo_widgets_msdf_text_rendering(10, 100);
        }

        { // With framebuffer. // TODO: re-implement

            // CreateLabel(_, 'Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, line);');
            // CreateLabel('Gl._framebuffer:-{render}|[mesh](FB.agqtpQji,TYPE.DIMENTION!,@23#scene,(label);');
            // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, label);
            // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, label);

            // const button = CreateButton(); 
            // Gl_framebuffer_render_mesh(FB.NEW, FRAMEBUFFER_TYPE.PORTION_DIMENTION, button);
        }


    }

    { // Widget: Slider-switch

        // CreateSliderSimple();
        // Widget_ready_slider_simple(ROOT_WIDGETS.CREATE_ROOT, 20, 20)
        // CreateSlider(_, 400, 600);
        // Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 20, 20, _, 'Ready Slider', _, )

        // CreateSwitchSimple([0, ypos, 0]);
        // Widget_ready_switch(ROOT_WIDGETS.CREATE_ROOT, 100, 100)
        // const switch1 = CreateSwitch();
        // Widget_ready_switch_button(ROOT_WIDGETS.CREATE_ROOT, );
    }

    { // Textured Meshes
        // TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [256/2, 256/2], WHITE, [0,0], TEXTURES.SMOKE_1);
        // TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [32/2, 32/2], WHITE, [0,0], TEXTURES.COIN);
        // TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 30, 30, [64/2, 73/2], WHITE, [0,0], TEXTURES.TEST_APPLE);
    }

    { // Test sdf lines
        // SdfLine(YELLOW[7], [50, 60, 1], [200, 1]);
        // SdfLine(YELLOW[7], [50, 80, 1], [200, 2]);
        // SdfLine(YELLOW[7], [50, 100, 1], [200, 3]);
        // SdfLine(YELLOW[7], [50, 120, 1], [200, 4]);
        // SdfLine(YELLOW[7], [50, 140, 1], [200, 5]);
        // SdfLine(YELLOW[7], [50, 160, 1], [200, 6]);
    }

    { // Section Synthesizes 

        // SectionResizable([50, 50, 0])

        // CreateManySections();

        CreateUniformPositionPerRenderGroups();

        // Rotatable_section_with_rcorners_via_attribute_rotation();
        // Rotatable_section_with_rcorners_via_uniform_rotation();
    }

    { // Widget: Dropdown

        // CreateDropdownTree([30, 50, 0])

        // CreateDropdownTreeHorizontalLayout();

        // Demo_complicated_widget_layout(0, 200)
    }

    { // Widget: Scroller

        // const scroller = CreateScrollerClampAlphaTest(_, 30, 100, 10, 16)

        // TestNewScrollerWithDropdown();

        // TestNewScrollerWithLabel();
    }

    { // Widget: Colorpicker

        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 100, 100, _, _, _, _, _, _, 0x0);

        /* Test change color of a mesh using the colorpicker */
        // {
        //     const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: [10, 380, 0], dim: [200, 80], col: TRANSPARENCY(GREEN[2], 1.), name: 'ColorPicker' }));
        //     Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:15,});
        //     rect.GenGfxCtx();
        //     rect.Render();
        //     Root_group_activate_all_vbs_in_renderqueue(rect.root_bufferidx);
        //     rect.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, rect.gfx.vb.groupidx)
        //     Construct_listen_events_from_mesh_tree(rect)
        //     Construct_listen_events_relations_from_mesh_tree(rect);


        //     const color_picker = Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 10, 100, _, _, _, _, _, _, 0x0,)

        //     const params = {
        //         mnemonics: { transparency: 0.5, hue: 0.5, color: null },
        //     };
        //     color_picker.AssignTargetMeshClbk(
        //         (params) => {
        //             const color = params;
        //             Mult_arr3_scalar(color, color[3]);
        //             Gl_set_rgba(rect.gfx, color);
        //         },
        //         params,
        //     );
        // }

        /** Colorpicker Instanced Geometry*/
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, SID.ATTR.WPOS3|SID.ATTR.DIM2)
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, SID.ATTR.DIM2)

    }

    { // Window menu
        // TODO:UN_IMPLEMENTED -> The symbol texture is not a part of root window menu
        // Window_menu();
    }

    { // Annimations

        { // Rotation: Rotate sdf line. Dont forget to disable the 'style' attribute
            // Test_rotate_section_with_round_corners();
        }

        {
            // Demo_clbk_animations_text_counter(ROOT_WIDGETS.CREATE_ROOT, true, );
        }

        { // Callback Animations
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 0, 20, CALLBACK_ANIMATION_TYPE_FLAGS.SCALE);
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 0, 220, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY);
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 0, 420, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_X);
            // Demo_animations_ready_button_anim(ROOT_WIDGETS.CREATE_ROOT, 0, 420, CALLBACK_ANIMATION_TYPE_FLAGS.MOVE_XY|CALLBACK_ANIMATION_TYPE_FLAGS.SCALE);
        }

        { // Mesh Animations

            // const label = Widget_ready_label(ROOT_WIDGETS.CREATE_ROOT, '[ HELLO ] !!!', TEXTURES.MTSDF_COMIC_1024, 300, 50, 20, _, _, _, _, _);
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, label, .03, 0., 1.,)

            // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10], SID.ATTR.COL4|SID.ATTR.WPOS3);
            // // const line = SdfLine(GREEN[7], [300, 300, 5], [200, 10]);
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .01, .1, 1., _, .5, false)
            // // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.XY, line, .5, -5., 5., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.X, line, .1, -3., 3., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.WPOS|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.POS.Y, line, .1*.75, -3., 3., 0)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, line, .004, .4, .8, _, .8, true)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .05, .4, 1.,)
            // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, line, .005, .2, .5, .2)
            // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .0025, .2, .8, .2)
            // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RG, line, .01, .2, .8, _, .2, false)
            // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, line, .001, .2, 1.4, _, .4, true)
            // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, line, .001, .2, 1.4, _, .4, true)

        }
    }

    { // DEMOS

        { // Demo Particles 

            // Create_glow_particles(VIEWPORT.RIGHT-270, 0, ROOT_WIDGETS.CREATE_ROOT, true, 1);

            // Demo_glow_particles_explosion_shaders(VIEWPORT.RIGHT-270, 0, ROOT_WIDGETS.CREATE_ROOT, _, true, 1);

            // Demo_glow_particles_sparkles_effect(VIEWPORT.RIGHT-270, 0, ROOT_WIDGETS.CREATE_ROOT, _, true, 1);

            // Create_explosion_particles(0, 0, ROOT_WIDGETS.CREATE_ROOT, true, 64)

            // Create_smoke_particles();

            // Create_comet_particles(_, _, 300, 300, 1, ROOT_WIDGETS.CREATE_ROOT, true, 28, );

        }

        { // Demos Physics

            // const total_height = Elastic_collisions(100, 200, ROOT_WIDGETS.CREATE_ROOT, true, true);

            // Sattelite_rotation([0, 100]);

            // Demo_chain_link();

        }

        { // Demos Widgets

            let y = 0;
            const pad = 50;

            // const sections = Demo_widgets_sections(_, [0, 100]);
            // y += sections.geom.dim[1]*2 + pad;

            // const info = Demo_widgets_explainer_info([100,100])
            // y += info.geom.dim[1]*2 + pad;

            // const btn = Demo_widgets(_, [0, y]);
            // y += btn.geom.dim[1]*2 + pad;

            // const scroller = Demo_widgets_scrolled_labels(_, [0, y]);
            // y += scroller.geom.dim[1]*2 + pad;

            // const dp = Demo_widgets_dropdown(_, [0, y], )
            // y += dp.geom.dim[1]*2 + pad;

            // const colorpicker = Demo_widgets_colorpicker_demo_with_info(_, 0);

            // /* Coloring per vertex */

            // /* Resizable widgets */


            // { // Create the button for going to the top

            //     const btn = Create_widget_button(ROOT_WIDGETS.CREATE_ROOT, 'Up', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [VIEWPORT.RIGHT - 100, VIEWPORT.BOTTOM - 80, 0], _, GREY[10], TRANSPARENCY(BLUEL[7], 1.), [5, 5], .5, [0, 24, 1.8], TEXTURES.CONSOLAS_32px);
            //     btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

            //     btn.Bind(
            //         (params) => {

            //             Callback_animations_create( // Scroll Up
            //                 (params) => { // Run Animation

            //                     const unif_wpos = Screen_wpos_get_y();
            //                     if (unif_wpos < 0) {

            //                         const ypos = unif_wpos/2;
            //                         Screen_wpos_set_y(ypos);
            //                         console.log('ypos', ypos, 'unif_wpos', unif_wpos)
            //                         return true;
            //                     }

            //                     return false;
            //                 },
            //                 () => { // Stop Animation
            //                     return false;
            //                 },
            //             );
            //         },
            //         _, _, _,
            //     );


            //     btn.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
            //     btn.GenGfxCtx();
            //     btn.Render()
            //     Root_group_activate_all_vbs_in_renderqueue(btn.root_bufferidx);

            //     btn.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, btn.gfx.vb.groupidx)

            //     Construct_listen_events_from_mesh_tree(btn)
            //     Construct_listen_events_relations_from_mesh_tree(btn);

            // }

        }

        { // Demo Animations

            {
                // Demo_animations();
                // Demo_animations_with_slider_slope();
                // Demo_animations_text(_, _, _, 40 );
                // Demo_animations_ready_button_with_panel(ROOT_WIDGETS.CREATE_ROOT);


                { // Text Animations Testing
                    { // All
                        // Test_text_clbk_animations_with_counter(100, 100, 20, 6, 65, CLBK_ANIMATIONS.TEXT_SQUEEZE_X, 40, .1);
                        // Test_text_clbk_animations_with_counter(220, 100, 20, 6, 65, CLBK_ANIMATIONS.TEXT_SQUEEZE_Y, 40, .1);
                        // Test_text_clbk_animations_with_counter(100, 270, 20, 6, 65, CLBK_ANIMATIONS.TEXT_TRANSLATE_X, 40, .1);
                        // Test_text_clbk_animations_with_counter(220, 270, 20, 6, 65, CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, 40, .1);
                    }
                    { // Counter with 2 text labels
                        // Test_text_clbk_animations_counter_2_text_meshes(100, 100, 10, 10, CLBK_ANIMATIONS.TEXT_SQUEEZE_X, );
                        // Test_text_clbk_animations_counter_2_text_meshes(100, 260, 10, 10, CLBK_ANIMATIONS.TEXT_TRANSLATE_X);
                        // Test_text_clbk_animations_counter_2_text_meshes(300, 100, 10, 10, CLBK_ANIMATIONS.TEXT_SQUEEZE_Y);
                        // Test_text_clbk_animations_counter_2_text_meshes(300, 260, 10, 10, CLBK_ANIMATIONS.TEXT_TRANSLATE_Y);
                    }
                }
            }

            { // Demo Rotating Rectangles on mouse hover
                // Board_rotations(0, 0, ROOT_WIDGETS.CREATE_ROOT, true);
            }
        }
    }

    { // Reload
        // Test_reload_app();
    }

    { // Coloring

        // Test_hsv_color_sequence_from_integer_input();
        // Theme_color_hsv_sample();
        // Theme_color_hsv_sample_widget_slider();
        // Theme_color_hsv_sample_widget_slider_auto();
        // Theme_testing();
        // Theme_color_correction();

        {

            {
                // // const HUE_COLOR = [ RED[9], RED[9], YELLOW[9], YELLOW[9],GREEN[9], GREEN[9],CYAN[9], CYAN[9],BLUE[9], BLUE[9],MAGENTA, MAGENTA,BLACK, BLACK,WHITE, WHITE,BLACK, BLACK,WHITE, WHITE,];
                // const HUE_COLOR = [ BLUE[9], BLUE[9],CYAN[9], CYAN[9]];
                // Multi_color_multi_vertex_mesh(HUE_COLOR)
            }
            { // Contrast (GOOD)

                // const contrast = .8;
                // const hue_preservation = .3;
                // const red       = Contrast_calibrated_rgba(RED[9],   contrast, hue_preservation);
                // const yel       = Contrast_calibrated_rgba(YELLOW[9],contrast, hue_preservation);
                // const green     = Contrast_calibrated_rgba(GREEN[9], contrast, hue_preservation);
                // const cyan      = Contrast_calibrated_rgba(CYAN[9],  contrast, hue_preservation);
                // const blue      = Contrast_calibrated_rgba(BLUE[9],  contrast, hue_preservation);
                // const magenta   = Contrast_calibrated_rgba(MAGENTA,  contrast, hue_preservation);
                // const black     = Contrast_calibrated_rgba(BLACK,    contrast, hue_preservation);
                // const white     = Contrast_calibrated_rgba(WHITE,    contrast, hue_preservation);
                // // const HUE_COLOR = [ red, red, yel, yel, green, green, cyan, cyan, blue, blue, magenta, magenta, black, black, white, white, black, black, white, white, ];
                // const HUE_COLOR = [ blue, blue, cyan, cyan];
                // // const HUE_COLOR = [ magenta, magenta, cyan, cyan];
                // Multi_color_multi_vertex_mesh(HUE_COLOR, 0, 190)
            }
            {
                // const contrast = .9;
                // const red = Contrast_rgba(RED[9], contrast);
                // const yel = Contrast_rgba(YELLOW[9], contrast);
                // const green = Contrast_rgba(GREEN[9], contrast);
                // const cyan = Contrast_rgba(CYAN[9], contrast);
                // const blue = Contrast_rgba(BLUE[9], contrast);
                // const magenta = Contrast_rgba(MAGENTA, contrast);
                // const black = Contrast_rgba(BLACK, contrast);
                // const white = Contrast_rgba(WHITE, contrast);
                // const HUE_COLOR = [
                //     red, red, 
                //     yel, yel,
                //     green, green, 
                //     cyan, cyan,
                //     blue, blue,
                //     magenta, magenta,

                //     black, black, 
                //     white, white, 
                //     black, black, 
                //     white, white, 

                //     // BLUE[9], BLUE[9],   // v5-v6
                //     // GREEN[9], GREEN[9],   // v3-v4
                //     // RED[9], RED[9],
                //     // BLACK, BLACK,
                //     // WHITE, WHITE,
                //     // BLACK, BLACK,
                //     // WHITE, WHITE,
                // ];
                // Multi_color_multi_vertex_mesh(HUE_COLOR, 0, 200)
            }
            {
                // const contrast = .8;
                // const red = Contrast_rgba(RED[9], contrast);
                // const yel = Contrast_rgba(YELLOW[9], contrast);
                // const green = Contrast_rgba(GREEN[9], contrast);
                // const cyan = Contrast_rgba(CYAN[9], contrast);
                // const blue = Contrast_rgba(BLUE[9], contrast);
                // const magenta = Contrast_rgba(MAGENTA, contrast);
                // const black = Contrast_rgba(BLACK, contrast);
                // const white = Contrast_rgba(WHITE, contrast);
                // const HUE_COLOR = [
                //     red, red, 
                //     yel, yel,
                //     green, green, 
                //     cyan, cyan,
                //     blue, blue,
                //     magenta, magenta,

                //     black, black, 
                //     white, white, 
                //     black, black, 
                //     white, white, 
                // ];
                // Multi_color_multi_vertex_mesh(HUE_COLOR, 0, 400)
            }
            { // Luminance

                // const contrast = 1.8;
                // const red = Luminance_rgb(RED[9], contrast);
                // const yel = Luminance_rgb(YELLOW[9], contrast);
                // const green = Luminance_rgb(GREEN[9], contrast);
                // const cyan = Luminance_rgb(CYAN[9], contrast);
                // const blue = Luminance_rgb(BLUE[9], contrast);
                // const magenta = Luminance_rgb(MAGENTA, contrast);
                // const black = Luminance_rgb(BLACK, contrast);
                // const white = Luminance_rgb(WHITE, contrast);
                // const HUE_COLOR = [
                //     red, red, 
                //     yel, yel,
                //     green, green, 
                //     cyan, cyan,
                //     blue, blue,
                //     magenta, magenta,

                //     black, black, 
                //     white, white, 
                //     black, black, 
                //     white, white, 
                // ];
                // Multi_color_multi_vertex_mesh(HUE_COLOR, 0, 600)
            }

        }

    }

    { // Shader Operations

        // Test_shader_operations_all_with_uncomment()

        // Test_shaders_operations_inner_shadow_rect();
        // Test_shaders_inner_shadow_rhomboid_effect_MANY_BLENDINGS();
        // Test_shaders_Shadow_specular();
        // Test_shaders_bubble_flare();

        // Shader_color_functions_glow_sphere();
        // Shader_color_functions_worley_1_noise();
        // Shader_color_functions_worley_2_noise();
        // Shader_color_functions_worley_3_types_noise();
        // Shader_color_functions_worley_3D();

        // Shader_color_functions_voronoi_1_noise();
        // Shader_color_functions_voronoi_2_noise();

        // Shader_color_functions_blend_simple_noise_with_voronoi();

        // Shader_color_functions_noise_test();

        // TODO: Create particles with explosion circle and animate the timer
        // Shader_color_functions_explosion_circle(_, _);
        // Shader_color_functions_explosion_glow(_, _);
        // Shader_color_functions_simple_glow(_, _);
        // Shader_color_functions_glow_sphere(_, _);

    }


    // NOT YET TESTED AND CORRECTED WITH NEW WIDGET CREATION STYLE

    { // Shaders Tests
        // Test_shaders_test1();
        // Test_shaders_test2();
        // Test_shaders_test3();
        // Test_shaders_test4();
    }
    // TODO: NEEDS REIMPLEMENTION
    { // Framebuffer

        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, helpui);

        // const meshinfo_mesh = MeshInfo()
        // Time_intervals_create(64, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, MeshInfoUpdate, { mesh: meshinfo_mesh });
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, meshinfo_mesh);
        // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, meshinfo_mesh.children.buffer[0]);


        { // 
            // const fb = Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, s);
            // Rotate framebuffer mesh
            // setInterval(()=>{Gl_rotate_z_2d(fb.render_area.gfx, fb.render_area.geom.dim, Timer_get_global_timer()*Timer_get_global_timer()*.55)}, 16);
        }
    }

    // TODO: Group all first letters directives to dropdowns and add button animation (SEE Demo_animations_ready_button_anim())    
    // // const helpui = Help();

    // // Test Quadratic_interpolation
    // console.log('Quadratic_interpolation');
    // const max=40, min=30;
    // console.log('val:0', Quadratic_interpolation(min, max, min));
    // console.log('val:1', Quadratic_interpolation(min, max, min+((max-min)/2)));
    // console.log('val:2', Quadratic_interpolation(min, max, max));

    // Tests
    {
        // Test_find_match_from_parent_descending();
    }



    // Bitwise_operations_run_test();
    // Test_bitwise_from_book_run_all_tests();


    // Vertex_buffer_build_index_buffer_all();
}



function Theme_color_hsv_sample() {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [960 / 2, 200 / 2], pad: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [10, 10];
    let cnt = 0;

    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    let meshes = [];
    let meshes2 = [];

    {
        {
            const purple = .74;
            {
                const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_vert, name: 'rect' + cnt }));
                Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
                section.AddItem(s1);

                { const m = Create_widget_label(Style_label_default_properties({ text: 'Label test: Color_hsv_to_rgb(purple, .65, .85),', pad: [10, 10], text_pad: [24, 16], col: Color_hsv_to_rgb(purple, .45, .85), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 16, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes.push(m); }
            }
            {
                const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_vert, name: 'rect' + cnt }));
                Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
                section.AddItem(s1);

                const font_size = 10;

                { const m = Create_widget_label(Style_label_default_properties({ text: `h:0 `, pad: [10, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.0, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .0; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:6 `, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.06, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .06; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:10`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.10, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .10; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:16`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.16, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .16; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:20`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.20, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .20; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:30`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.30, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .30; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:40`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.40, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .40; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:46`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.46, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .46; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:50`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.50, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .50; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:56`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.56, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .56; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:60`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.60, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .60; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:66`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.66, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .66; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:70`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.70, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .70; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:76`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.76, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .76; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:80`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.80, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .80; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:86`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.86, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .86; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:90`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.90, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .90; }
                { const m = Create_widget_label(Style_label_default_properties({ text: `h:96`, pad: [0, 10], text_pad: [8, 10], col: Color_hsv_to_rgb(.96, .9, .9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m); m.mat.hsv[0] = .96; }
            }

        }
    }


    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();

    Widget_render(section);










    /***********************************************************************************************************************************************/
    // HSV color slider controls
    const hsv = new Float32Array([1, 1, 1, 1]);
    // Look GOOD parameters
    const contrast = .75;
    const hue_preservation = .3;
    // Look GOOD parameters
    // const contrast = .8;
    const parameters = [hsv[0], hsv[1], hsv[2], contrast, hue_preservation];

    {

        const params = {
            hsv: hsv,
            parameters: parameters,
            target_meshes: meshes,
            target_meshes2: meshes2,
        };

        const Render_color = (params) => {

            const parameters = params.clbk_params.parameters;
            const target_meshes = params.clbk_params.target_meshes;
            const target_meshes2 = params.clbk_params.target_meshes2;
            const hsv = params.clbk_params.hsv;

            const color = Color_hsv_to_rgb(
                hsv[0] * parameters[0],
                hsv[1] * parameters[1],
                hsv[2] * parameters[2],
            );

            const final_color = new Float32Array([
                Contrast_calibrated(color[0], parameters[3], parameters[4]),
                Contrast_calibrated(color[1], parameters[3], parameters[4]),
                Contrast_calibrated(color[2], parameters[3], parameters[4]),
                1,
            ]);


            for (let i = 0; i < target_meshes.length; i++) { const mesh = target_meshes[i]; Gl_set_rgba(mesh.gfx, final_color); }

            for (let i = 0; i < target_meshes2.length; i++) {

                const mesh = target_meshes2[i];
                const no_hue_color = Color_hsv_to_rgb(
                    mesh.mat.hsv[0],
                    hsv[1] * parameters[1],
                    hsv[2] * parameters[2],
                );


                Gl_set_rgba(mesh.gfx, Contrast_calibrated_rgba(no_hue_color, parameters[3], parameters[4]));
            }

        }
        const slider_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, section.geom.dim[1] * 2 + 6, 0], dim: [400, 300], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
        Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

        cnt = 0;
        const slider_dim = [300, 10], color = COLOR_THEME_BASIC.GREY_DARK_LIGHT, rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_10;
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Hue', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                const parameters = params.clbk_params.parameters;
                parameters[0] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Saturation
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Saturation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(1);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[1] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Brightness
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Brightness', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(1);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[2] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'contrast', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(contrast);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[3] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'hue_preservation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(hue_preservation);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[4] = slider_val;
                Render_color(params);
            }, params,
            );
        }





        slider_section.GenGfxCtx();
        Align_nested_sections_pre(slider_section);

    Widget_render(slider_section);

    }
}
function Theme_color_hsv_sample_widget_slider() {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [960 / 2, 200 / 2], pad: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [10, 10];
    let cnt = 0;

    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    let slider = null;
    let bar = null;
    let handle = null;
    let name_text = null;
    let value_text = null;

    const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_vert, name: 'rect' + cnt }));
    Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
    section.AddItem(s1);

    const font_size = 14;

    const slider_mesh = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 20], col: GREY[3], name: 'Sample Slider', layout: LAYOUT.VERTICAL, font_size: font_size, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 }));
    Widget_gfx_ready_enable({ mesh: slider_mesh, enable_sdf_rect: 10, })
    slider_mesh.SetInitialValue(0.5);
    s1.AddItem(slider_mesh);

    const slider_meshes = slider_mesh.GetMeshes();

    slider = slider_meshes.slider;
    bar = slider_meshes.bar;
    handle = slider_meshes.handle;
    name_text = slider_meshes.name_text;
    value_text = slider_meshes.value_text;


    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();

    Widget_render(section);










    /***********************************************************************************************************************************************/
    // Generic HSV color slider controls
    const Create_sliders_per_mesh = (mesh, layout) => {

        const hsv = new Float32Array([1, 1, 1, 1]);
        const contrast = .75;
        const hue_preservation = .3;
        const parameters = [hsv[0], hsv[1], hsv[2], contrast, hue_preservation];

        const params = {
            hsv: hsv,
            parameters: parameters,
            mesh: mesh,
        };

        // Callback function: render color to mesh from slider values
        const Render_color = (params) => {

            const parameters = params.clbk_params.parameters;
            const mesh = params.clbk_params.mesh;
            const hsv = params.clbk_params.hsv;

            const color = Color_hsv_to_rgb_calibrated(
                hsv[0] * parameters[0],
                hsv[1] * parameters[1],
                hsv[2] * parameters[2],
                1,
                parameters[3],
                parameters[4],
            );

            Gl_set_rgba(mesh.gfx, Contrast_calibrated_rgba(color, parameters[3], parameters[4]), mesh.geom.num_faces);

        }


        const slider_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, section.geom.dim[1] * 2 + 6, 0], dim: [400, 300], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: layout | LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
        Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

        cnt = 0;
        const slider_dim = [120, 10], color = COLOR_THEME_BASIC.GREY_DARK_LIGHT, rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_10;
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Hue', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                const parameters = params.clbk_params.parameters;
                parameters[0] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Saturation
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Saturation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(1);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[1] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Brightness
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Brightness', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(1);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[2] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'contrast', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(contrast);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[3] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'hue_preservation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(hue_preservation);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[4] = slider_val;
                Render_color(params);
            }, params,
            );
        }

        return slider_section;

    }

    const slider_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, section.geom.dim[1] * 2 + 6, 0], dim: [400, 300], col: COLOR_THEME_BASIC.GREY_DARK_MID, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
    Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

    slider_section.AddItem(Create_sliders_per_mesh(slider, LAYOUT.HORIZONTAL));
    slider_section.AddItem(Create_sliders_per_mesh(bar, LAYOUT.HORIZONTAL));
    slider_section.AddItem(Create_sliders_per_mesh(handle, LAYOUT.HORIZONTAL));
    slider_section.AddItem(Create_sliders_per_mesh(name_text, LAYOUT.VERTICAL));
    slider_section.AddItem(Create_sliders_per_mesh(value_text, LAYOUT.HORIZONTAL));


    slider_section.GenGfxCtx();
    Align_nested_sections_pre(slider_section);
    Widget_render(slider_section);

}
function Theme_color_hsv_sample_widget_slider_auto() {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [960 / 2, 200 / 2], pad: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [10, 10];
    let cnt = 0;

    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    let slider = null;
    let bar = null;
    let handle = null;
    let name_text = null;
    let value_text = null;

    const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_vert, name: 'rect' + cnt }));
    Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
    section.AddItem(s1);

    const font_size = 14;

    const slider_mesh = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.19, .2), pos: [0, 0, 0], dim: [200, 20], col: GREY[3], name: 'Sample Slider', layout: LAYOUT.VERTICAL, font_size: font_size, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 }));
    Widget_gfx_ready_enable({ mesh: slider_mesh, enable_sdf_rect: 10, })
    slider_mesh.SetInitialValue(0.5);
    s1.AddItem(slider_mesh);

    const slider_meshes = slider_mesh.GetMeshes();

    slider = slider_meshes.slider;
    bar = slider_meshes.bar;
    handle = slider_meshes.handle;
    name_text = slider_meshes.name_text;
    value_text = slider_meshes.value_text;

    let present1 = null;
    let present2 = null;
    let present3 = null;
    let present4 = null;
    {
        const text_pad = [20, 12];
        const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_hor, name: 'rect' + cnt }));
        Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 10 });
        section.AddItem(s2);

        { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[5], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); present1 = m; }
        { const m = Create_widget_label(Style_label_default_properties({ text: 'Slider lum', text_pad: text_pad, col: GREY[3], layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); }
        { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[7], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); present2 = m; }
        { const m = Create_widget_label(Style_label_default_properties({ text: 'Text lum', text_pad: text_pad, col: GREY[3], layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); }
        { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[7], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); present3 = m; }
        { const m = Create_widget_label(Style_label_default_properties({ text: 'Handle lum', text_pad: text_pad, col: GREY[3], layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); }
        { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[7], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); present4 = m; }
        { const m = Create_widget_label(Style_label_default_properties({ text: 'Calibrated contrast_lum', text_pad: text_pad, col: GREY[3], layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); }

    }


    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();
    Widget_render(section);










    /***********************************************************************************************************************************************/
    // Generic HSV color slider controls
    const Create_sliders_per_mesh = (layout) => {

        const hsv = new Float32Array([.12, .8, 1]);
        const contrast = .18;
        const hue_preservation = .0;
        const parameters = [hsv[0], hsv[1], hsv[2], contrast, hue_preservation];

        const params = {
            parameters: parameters,
            slider_meshes: slider_meshes,
            present1: present1,
            present2: present2,
            present3: present3,
            present4: present4,
        };


        // Callback function: render color to mesh from slider values
        const Render_color = (params) => {

            const parameters = params.clbk_params.parameters;
            const slider_meshes = params.clbk_params.slider_meshes;

            const color = Color_theme_slider_auto(parameters[0], parameters[1], parameters[3], parameters[4]);

            // slider_meshes.slider.mat.col = color.col;
            // slider_meshes.bar.mat.col = color.bar_col;
            // slider_meshes.handle.mat.col = color.handle_col;
            // slider_meshes.name_text.mat.col = color.name_text_col;
            // slider_meshes.value_text.mat.col = color.value_text_col;

            // slider_meshes.slider.mat.defCol = color.col;
            // slider_meshes.bar.mat.defCol = color.bar_col;
            // slider_meshes.handle.mat.defCol = color.handle_col;
            // slider_meshes.name_text.mat.defCol = color.name_text_col;
            // slider_meshes.value_text.mat.defCol = color.value_text_col;

            Gl_set_rgba(slider_meshes.slider.gfx, color.col, slider_meshes.slider.geom.num_faces);
            Gl_set_rgba(slider_meshes.bar.gfx, color.bar_col, slider_meshes.bar.geom.num_faces);
            Gl_set_rgba(slider_meshes.handle.gfx, color.handle_col, slider_meshes.handle.geom.num_faces);
            Gl_set_rgba(slider_meshes.name_text.gfx, color.name_text_col, slider_meshes.name_text.geom.num_faces);
            Gl_set_rgba(slider_meshes.value_text.gfx, color.value_text_col, slider_meshes.value_text.geom.num_faces);


            // Test luminance
            params.clbk_params.present1.text_mesh.RenderTextFromNumber(color.test_slider_lum);
            params.clbk_params.present2.text_mesh.RenderTextFromNumber(color.test_text_lum);
            params.clbk_params.present3.text_mesh.RenderTextFromNumber(color.test_handle_lum);
            params.clbk_params.present4.text_mesh.RenderTextFromNumber(color.test_contrast_cal);

        }


        const slider_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, section.geom.dim[1] * 2 + 6, 0], dim: [400, 300], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: layout | LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
        Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

        cnt = 0;
        const slider_dim = [220, 10], color = COLOR_THEME_BASIC.GREY_DARK_LIGHT, rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_10;
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Hue', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(parameters[0]);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                const parameters = params.clbk_params.parameters;
                parameters[0] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Saturation
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Saturation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(parameters[1]);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[1] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Brightness
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Brightness', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(parameters[2]);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[2] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'contrast', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(parameters[3]);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[3] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'hue_preservation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(parameters[4]);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[4] = slider_val;
                Render_color(params);
            }, params,
            );
        }

        return slider_section;

    }

    const slider_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, section.geom.dim[1] * 2 + 6, 0], dim: [400, 300], col: COLOR_THEME_BASIC.GREY_DARK_MID, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
    Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

    slider_section.AddItem(Create_sliders_per_mesh(LAYOUT.HORIZONTAL));


    slider_section.GenGfxCtx();
    Align_nested_sections_pre(slider_section);

    Widget_render(slider_section);

}
function Theme_testing() {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [800 / 2, 600 / 2], pad: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [10, 10];
    let cnt = 0;

    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    let meshes = [];
    let meshes2 = [];


    {
        const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_MID, layout: layout_hor, name: 'rect' + cnt }));
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
        section.AddItem(s1);

        { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: COLOR_THEME_BASIC.BLUE_LIGHT, layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
        { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: COLOR_THEME_BASIC.BLUE_MID, layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
        { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: COLOR_THEME_BASIC.BLUE_DARK, layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
    }
    {
        const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_hor, name: 'rect' + cnt }));
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
        section.AddItem(s1);

        { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: COLOR_THEME_BASIC.BLUE_LIGHT, layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
        { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: COLOR_THEME_BASIC.BLUE_MID, layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
        { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: COLOR_THEME_BASIC.BLUE_DARK, layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
    }
    /** */
    {
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_vert, name: 'rect' + cnt }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
            section.AddItem(s1);

            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .45, .85), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .45, .55), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .45, .35), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
        }
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_hor, name: 'rect' + cnt }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
            section.AddItem(s1);

            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .55, .85), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .55, .55), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .55, .35), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
        }
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_hor, name: 'rect' + cnt }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
            section.AddItem(s1);

            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .65, .85), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .65, .55), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(.5722, .65, .35), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
        }
    }



    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();
    Widget_render(section);

}
function Theme_color_correction() {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [1000 / 2, 500 / 2], pad: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [10, 10];
    let cnt = 0;
    const font_size = 14, text_pad = [24, 16];

    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    let meshes1 = [];
    let meshes2 = [];
    let meshes3 = [];
    let meshes4 = [];
    let present1 = null;
    let present2 = null;
    let present3 = null;
    let present4 = null;



    {
        const color = .08;
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_vert, name: 'rect' + cnt }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
            section.AddItem(s1);

            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(color, .45, .85), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes1.push(m) }
            // { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: Color_hsv_to_rgb(color, .45, .55), layout: layout_vert , name: 'rect' + cnt }));  Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes2.push(m)}
            // { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: Color_hsv_to_rgb(color, .45, .35), layout: layout_vert , name: 'rect' + cnt }));  Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes3.push(m)}
            { const m = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: Color_hsv_to_rgb(color, .45, .35), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); meshes4.push(m) }
        }
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_hor, name: 'rect' + cnt }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
            section.AddItem(s1);

            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: layout_vert, name: 'rect' + cnt }));
                Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 10 });
                s1.AddItem(s2);
                { const m = Create_widget_label(Style_label_default_properties({ text: 'Test Hsv to Rgb', text_pad: text_pad, col: Color_hsv_to_rgb(color, .55, .85), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); meshes1.push(m) }
                // { const m = Create_widget_label(Style_label_default_properties({ text:'Test Hsv to Rgb', text_pad: text_pad, col: Color_hsv_to_rgb(color, .55, .85), layout: LAYOUT.VERTICAL, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:font_size, }));  Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); meshes2.push(m)}
                // { const m = Create_widget_label(Style_label_default_properties({ text:'Test Hsv to Rgb', text_pad: text_pad, col: Color_hsv_to_rgb(color, .55, .85), layout: LAYOUT.VERTICAL, texture_id:TEXTURES.MTSDF_CONSOLAS_1024, font_size:font_size, }));  Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); meshes3.push(m)}
                { const m = Create_widget_label(Style_label_default_properties({ text: 'Test Hsv to Rgb', text_pad: text_pad, col: Color_hsv_to_rgb(color, .55, .85), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s2.AddItem(m); meshes4.push(m) }
            }

        }
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [14, 14], dim: [0, 0], col: COLOR_THEME_BASIC.GREY_DARK_LIGHT, layout: layout_hor, name: 'rect' + cnt }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 10 });
            section.AddItem(s1);

            { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[5], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); present1 = m; }
            { const m = Create_widget_label(Style_label_default_properties({ text: 'Init col', text_pad: text_pad, col: GREY[3], layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[7], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); present2 = m; }
            { const m = Create_widget_label(Style_label_default_properties({ text: 'Final col', text_pad: text_pad, col: GREY[3], layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }
            { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[7], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); present3 = m; }
            { const m = Create_widget_label(Style_label_default_properties({ text: '00000', text_pad: text_pad, col: BLUEL[7], layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); present4 = m; }
            { const m = Create_widget_label(Style_label_default_properties({ text: 'Contast', text_pad: text_pad, col: GREY[3], layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: font_size, })); Widget_gfx_ready_enable({ mesh: m, enable_sdf_rect: 10 }); s1.AddItem(m); }

        }

    }




    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();
    Widget_render(section);











    /***********************************************************************************************************************************************/
    // HSV color slider controls
    const hsv = new Float32Array([1, 1, 1, 1]);
    const contrast = .8;
    const hue_preservation = .3;
    const parameters = [hsv[0], hsv[1], hsv[2], contrast, hue_preservation];

    {

        const params = {
            hsv: hsv,
            parameters: parameters,
            target_meshes: meshes1,
            target_meshes2: meshes2,
            target_meshes3: meshes3,
            target_meshes4: meshes4,
            present1: present1,
            present2: present2,
            present3: present3,
            present4: present4,
        };

        const Render_color = (params) => {

            const present1 = params.clbk_params.present1;
            const present2 = params.clbk_params.present2;
            const present3 = params.clbk_params.present3;
            const present4 = params.clbk_params.present4;
            const parameters = params.clbk_params.parameters;
            const target_meshes = params.clbk_params.target_meshes;
            const target_meshes2 = params.clbk_params.target_meshes2;
            const target_meshes3 = params.clbk_params.target_meshes3;
            const target_meshes4 = params.clbk_params.target_meshes4;
            const hsv = params.clbk_params.hsv;



            const init_color = Color_hsv_to_rgb(hsv[0] * parameters[0], hsv[1], hsv[2]);


            const color = Color_hsv_to_rgb(
                hsv[0] * parameters[0],
                hsv[1] * parameters[1],
                hsv[2] * parameters[2],
            );


            const final_color = new Float32Array([
                Contrast_calibrated(color[0], parameters[3], parameters[4]),
                Contrast_calibrated(color[1], parameters[3], parameters[4]),
                Contrast_calibrated(color[2], parameters[3], parameters[4]),
                1,
            ])



            // for(let i=0; i<target_meshes.length; i++)  { const mesh = target_meshes[i]; Gl_set_rgba(mesh.gfx, init_color); }
            // for(let i=0; i<target_meshes2.length; i++) { const mesh = target_meshes2[i]; Gl_set_rgba(mesh.gfx, color2); }
            // for(let i=0; i<target_meshes3.length; i++) { const mesh = target_meshes3[i]; Gl_set_rgba(mesh.gfx, color3); }
            for (let i = 0; i < target_meshes4.length; i++) { const mesh = target_meshes4[i]; Gl_set_rgba(mesh.gfx, final_color); }


            { const Y = 0.2126 * init_color[0] + 0.7152 * init_color[1] + 0.0722 * init_color[2]; present1.text_mesh.RenderTextFromNumber(Y); }
            { const Y = 0.2126 * final_color[0] + 0.7152 * final_color[1] + 0.0722 * final_color[2]; present2.text_mesh.RenderTextFromNumber(Y); }
            { const Y = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]; present3.text_mesh.RenderTextFromNumber(Y); }
            { present4.text_mesh.RenderTextFromNumber(parameters[4]); }
        }
        const slider_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, section.geom.dim[1] * 2 + 6, 0], dim: [400, 300], col: COLOR_THEME_BASIC.GREY_DARK_BASE, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
        Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

        cnt = 0;
        const slider_dim = [300, 10], color = COLOR_THEME_BASIC.GREY_DARK_LIGHT, rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_10;
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Hue', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(0);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                const parameters = params.clbk_params.parameters;
                parameters[0] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Saturation
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Saturation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(1);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[1] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        { // Set Brightness
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'Brightness', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(1);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[2] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'contrast', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(contrast);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[3] = slider_val;
                Render_color(params);
            }, params,
            );
        }
        {
            const slider = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: slider_dim, col: color, name: 'hue_preservation', layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(hue_preservation);
            slider_section.AddItem(slider);
            Slider_connect(slider, (params, slider_val) => {
                parameters[4] = slider_val;
                Render_color(params);
            }, params,
            );
        }





        slider_section.GenGfxCtx();
        Align_nested_sections_pre(slider_section);
    Widget_render(slider_section);


        // OLD
        {
            // const color = Color_hsv_to_rgb(hsv[0], hsv[1], hsv[2]);
            // const present1 = params.clbk_params.present1;
            // const present2 = params.clbk_params.present2;
            // const present3 = params.clbk_params.present3;
            // const present4 = params.clbk_params.present4;


            // // BRIGHTNESS = 0.2126 * R + 0.7152 * G + 0.0722 * B
            // const Y = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
            // present1.text_mesh.RenderTextFromNumber(Y)


            // {
            //     // {
            //     //     const targetY = .2
            //     //     // const scale = targetY / Math.max(Y, 0.001); // avoid divide by zero
            //     //     const scale = targetY / Y
            //     //     const newV = Math.min(hsv[2] * scale, 1.0);      // clamp to max 1.0
            //     //     hsv[2] = newV;
            //     // }
            //     // if(Y > threshold){
            //     //     const dif = 1 + (Y - threshold);
            //     //     hsv[2] *= compres_ratio*dif;
            //     // }
            // }


            // { // reduce V by the difference of Y and reduce S by the  reciprocal of 1-Y
            //     // const dif = (1-Y);
            //     // const new_V = Min(hsv[2]/2 + (dif * .75), 1);
            //     // present2.text_mesh.RenderTextFromNumber(new_V);

            //     // const new_S = hsv[1] - ((1-Y)*.25)

            //     // const new_color = Color_hsv_to_rgb(hsv[0], new_S, new_V);
            //     // present3.text_mesh.RenderTextFromNumber(new_S);

            //     // const calculate_brightness2 = 0.2126 * new_color[0] + 0.7152 * new_color[1] + 0.0722 * new_color[2];
            // }


            // const dif = (1-Y);
            // // var new_V = Min(hsv[2]/2 + (dif * .75), 1);
            // var new_V = Min(hsv[2]/2 + (dif * .45), 1);
            // // var new_V = Min(hsv[2]/2 + (dif * .15), 1);
            // // present2.text_mesh.RenderTextFromNumber(new_V);


            // var new_S = hsv[1] - ((1-Y)*.18)
            // // var new_S = Min(hsv[2]/2 + (dif * .25), 1);
            // // var new_S = hsv[1] - ((1-Y)*.1)
            // // present3.text_mesh.RenderTextFromNumber(new_S);

            // const color2 = Color_hsv_to_rgb(hsv[0], hsv[1], new_V);
            // const Y2 = 0.2126 * color2[0] + 0.7152 * color2[1] + 0.0722 * color2[2];
            // present2.text_mesh.RenderTextFromNumber(Y2)

            // // const color3 = Color_hsv_to_rgb(hsv[0], new_S, new_V);
            // // const color3 = Color_hsv_to_rgb(hsv[0], hsv[1], new_V);
            // const color3 = Color_hsv_to_rgb(hsv[0], new_S, hsv[2]);
            // const Y3 = 0.2126 * color3[0] + 0.7152 * color3[1] + 0.0722 * color3[2];
            // present3.text_mesh.RenderTextFromNumber(Y3)

            // // 
            // /**Gamma */
            // // const colorgamma = [
            // //     Math.pow(color[0], 1 / 5.5),
            // //     Math.pow(color[1], 1 / 5.5),
            // //     Math.pow(color[2], 1 / 5.5),
            // //     1.,
            // // ];
            // /**Contrast */
            // const colorgamma = [
            //     Contrast_calibrated(color[0], .9, parameters[3]),
            //     Contrast_calibrated(color[1], .9, parameters[3]),
            //     Contrast_calibrated(color[2], .9, parameters[3]),
            //     1.,
            // ];

            // /**Luminance 1 */
            // // const colorgamma = [
            // //     color3[0] + Math.sqrt(color3[0] * 0.241),
            // //     color3[1] + Math.sqrt(color3[1] * 0.691),
            // //     color3[2] + Math.sqrt(color3[2] * 0.068),
            // //     1.,
            // // ];
            // /**Luminance 2 */
            // // const mx = Max3(color[0], color[1], color[2]);
            // // const mn = Min3(color[0], color[1], color[2]);
            // // const balance = ( (mx-mn) / mx );
            // // const avg = ((color[0]*0.901)+(color[1]*0.513)+(color[2]*0.906)) / 3.0;
            // // const make_up = (1.-avg)*2.;
            // // const colorgamma = [
            // //     Min(0.901*color[0]*make_up, 1.) * balance,
            // //     Min(0.513*color[1]*make_up, 1.) * balance,
            // //     Min(0.906*color[2]*make_up, 1.) * balance,
            // //     1.,
            // // ];
        }

    }
}

function Multi_color_multi_vertex_mesh(color_buffer, x = 0, y = 0,) { // TEST MULTI VERTEX MESH

    const dim = [VIEWPORT.WIDTH / 2 - 4, VIEWPORT.HEIGHT / 9]
    const vertices_count = (color_buffer.length / 2) - 1;
    const slider_hue = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: [x, y, 2], dim: dim, col: color_buffer, num_faces: vertices_count, name: 'Slider Hue' }));
    Widget_gfx_ready_enable({ mesh: slider_hue, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    // Widget_gfx_ready_enable({mesh:slider_hue, listener:{type:LISTEN_EVENT_TYPES.MOVE}});

    slider_hue.sid.shad |= SID.SHAD.INDEXED_PATT_CONNECTED_FACES_X;

    slider_hue.GenGfxCtx();
    Widget_render(slider_hue);


    return slider_hue
}

function TEMP_Calculate_layout_grow_count(root) {

    let hor_count = 1;
    let vert_count = 1;

    // Calculate 
    for (let i = root.children.boundary; i >= 0; i--) {


        const child = root.children.buffer[i];

        if (child.children.boundary >= 0) {
            TEMP_Calculate_layout_grow_count(child);
        }

        if (child.align.flags & LAYOUT.HORIZONTAL) {

            child.align.hor_grow_count = hor_count;
            hor_count++;
            child.align.vert_grow_count = vert_count;
        }
        else if (child.align.flags & LAYOUT.VERTICAL) {

            child.align.vert_grow_count = vert_count;
            vert_count++;
            child.align.hor_grow_count = hor_count;
            hor_count = 1;
        }

        console.log(Mesh_get_name(child), child.align.hor_grow_count, child.align.vert_grow_count)

    }

}

function Test_resize_fill_space_layout() {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, dim: [3 * 100, 300 / 2], pad: [0, 0], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [10, 10];
    let cnt = 0;

    let target_meshes = []; // Testing proportion controls

    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    // { // HORIZONATLS
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    // }
    // { // VERTICALS
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    //     { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0,0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    // }
    { // MIX
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    }






    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();
    Widget_render(section);



    // /***********************************************************************************************************************************************/
    // // Proportions slider controls
    // const start_proportion = 1;
    // {
    //     const slider_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [0, 600, 0], dim: [400, 300], col: GREY[7], layout: LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
    //     Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

    //     cnt = 0;
    //     const slider_dim = [300, 10], color = YELLOW[4], rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_10;
    //     {
    //         // Slider: unif 1
    //         const slider = Create_widget_slider(Style_slider_default_properties({ pos:[0,0,0], dim: slider_dim, col: color, name: 'Proportions', layout: LAYOUT.VERTICAL, texture_id: default_font }));
    //         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
    //         slider.SetInitialValue(start_proportion);
    //         slider_section.AddItem(slider);

    //         const params = {
    //             root_mesh: section,
    //             target_mesh: target_meshes[cnt++],
    //         };

    //         // Connect sliders to gfx program uniforms 
    //         Slider_connect(slider, (params, slider_val) => {

    //             const root_mesh = params.clbk_params.root_mesh;
    //             const target_mesh = params.clbk_params.target_mesh;
    //             target_mesh.align.proportion.x = slider_val;

    //             Root_group_reset_gfxs(root_mesh.root_bufferidx);
    //             Align_pre_simple___with_grow_containers(root_mesh);
    //             Root_group_resize_and_rerender(root_mesh.root_bufferidx);

    //         }, params,
    //         );
    //     }
    //     {

    //         // Slider: unif 1
    //         const slider = Create_widget_slider(Style_slider_default_properties({ pos:[0,0,0], dim: slider_dim, col: color, name: 'Proportions', layout: LAYOUT.VERTICAL, texture_id: default_font }));
    //         Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
    //         slider.SetInitialValue(start_proportion);
    //         slider_section.AddItem(slider);

    //         const params = {
    //             root_mesh: section,
    //             target_mesh: target_meshes[cnt++],
    //         };

    //         // Connect sliders to gfx program uniforms 
    //         Slider_connect(slider, (params, slider_val) => {

    //             const root_mesh = params.clbk_params.root_mesh;
    //             const target_mesh = params.clbk_params.target_mesh;
    //             target_mesh.align.proportion.x = slider_val;

    //             Root_group_reset_gfxs(root_mesh.root_bufferidx);
    //             Align_pre_simple___with_grow_containers(root_mesh);
    //             Root_group_resize_and_rerender(root_mesh.root_bufferidx);

    //         }, params,
    //         );
    //     }



    //     Align_nested_sections_pre(slider_section);

    //     slider_section.GenGfxCtx();
    //     slider_section.Render();
    //     Root_group_activate_all_vbs_in_renderqueue(slider_section.root_bufferidx);
    //     Construct_listen_events_from_mesh_tree(slider_section)
    //     Construct_listen_events_relations_from_mesh_tree(slider_section);

    //     slider_section.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, slider_section.gfx.vb.groupidx);
    // }



}
function Test_resize_fill_space_layout_nested(x = 0, y = 0) {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [20, 10];
    let rect_cnt = 0;
    let parent_cnt = 0;


    // {// HORIZONTALS
    //     const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    //     { 
    //         parent_cnt++;
    //         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1); 
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //     }
    //     { 
    //         parent_cnt++;
    //         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1); 
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //     }
    //     { 
    //         parent_cnt++;
    //         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1); 
    //     }
    //     { 
    //         parent_cnt++;
    //         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1); 
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //     }
    // }
    // {// VERTICALS
    //     const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    //     { 
    //         parent_cnt++;
    //         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1); 
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //     }
    //     { 
    //         parent_cnt++;
    //         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1); 
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //     }
    //     { 
    //         parent_cnt++;
    //         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1); 
    //         { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
    //     }
    // }
    {// MIX
        const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
        const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                parent_cnt++;
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        }
    }





    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();
    Widget_render(section);
}
function Test_resize_fill_space_layout_nested_with_widgets(x = 0, y = 0) {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [20, 10];
    let rect_cnt = 0;
    let parent_cnt = 0;


    {// HORIZONTALS
        const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
        const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [150, 150], pad: [10, 10], col: GREY[7], layout: fixed_layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [120, 200], pad: [10, 10], col: GREY[7], layout: fixed_layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const layout = LAYOUT.HORIZONTAL;
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [0, 0], dim: [40, 40], col: GetSequencedColor(9), layout: layout, name: `rect${rect_cnt++} s${parent_cnt}`, texture_id: TEXTURES.MTSDF_SYMBOLS, sub_texture_id: ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_3 })); Widget_gfx_ready_enable({ mesh: r2 }); s2.AddItem(r2); }
                // { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [40, 40], col: GetSequencedColor(9), layout: layout, name: `TEXTURE s${parent_cnt}`, texture_id:TEXTURES.SMOKE_1 })); Widget_gfx_ready_enable({ mesh: r2}); s2.AddItem(r2); }
                // { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [40, 40], col: GetSequencedColor(9), layout: layout, name: `TEXTURE s${parent_cnt}`, texture_id:TEXTURES.SMOKE_1 })); Widget_gfx_ready_enable({ mesh: r2}); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }

    }



    TEMP_Calculate_layout_grow_count(section);
    Align_pre_simple___with_grow_containers(section);

    section.GenGfxCtx();
    Widget_render(section);
}




/**************************************************************************************************************************************/
// Widget Creation Functions
function Test_reload_app() {

    const reload_btn = Create_widget_button(Style_button_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, text: 'Reload', pos: [VIEWPORT.RIGHT - 140, 10, 0], text_col: GREY[10], col: TRANSPARENCY(BLUEL[7], 1.), text_pad: [5, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10 }));
    Widget_gfx_ready_enable({ mesh: reload_btn, enable_sdf_rect: 10, });

    reload_btn.Bind(
        (params) => {

            Callback_animations_create( // Scroll Up
                (params) => { // Run Animation

                    App_reset();
                    App_reinitialize();
                    Debug_info_ui_static();

                    TestWidgetsGeneric();

                    return false;
                },
                () => { // Stop Animation
                    return false;
                },
            );
        },
        _, _, _,
    );


    reload_btn.gfx_ctx_flags |= GFX_CTX_FLAGS.ABSOLUTE_POSITION;
    reload_btn.GenGfxCtx();
    Widget_render(reload_btn);
}

function Test_rotate_section_with_round_corners() {

    const line1 = SdfLine(GREEN[7], [300, 300, 5], [200, 10], _, true);
    Time_intervals_create(16, 'TEST ROTATION', TIME_INTERVAL_REPEAT_ALWAYS, (params) => {
        const mesh = params.params
        // const t = (Timer_get_global_timer_cycle()-.5)*10;
        const rot = (Timer_get_global_timer()) * 1;
        Mesh_rotate_z(mesh, rot);
        // Gl_set_angle(mesh.gfx, rot);

    }, line1)

}

const fontsize = 12;

function Test_hsv_color_sequence_from_integer_input() {
    const text = 'FPS:11999 Meshes:19 Active:14?'
    const fonst_size = 10;
    const col_width = 10;

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[3], name: 'Section', style: [0, 10, 2], layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, });


    let y = 10, x = 0, i = 2;
    // const label = CreateLabel(ROOT_WIDGETS.CREATE_ROOT, text, TEXTURES.MTSDF_CONSOLAS_1024, _, 30, y, RGB(i, col_width), _, _, fonst_size); y += label.geom.dim[1] * 2; i++;
    y -= 10;
    // const vb_groupidx = label.gfx.vb.groupidx, text_vb_groupidx = label.text_mesh.gfx.vb.groupidx;
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }
    { const label = CreateLabel(0x0, text, TEXTURES.MTSDF_CONSOLAS_1024, _, x, y, RGB(i, col_width), _, _, fonst_size); i++; section.AddItem(label); }


    // Render
    section.GenGfxCtx();

    Align_nested_sections_pre(section);
    Widget_render(section);

}

function Test_text_clbk_animations_with_counter(x, y, text_pad_x = 10, text_pad_y = 6, font_size = 20, clbk_anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, speed = 10, slope = .1) {

    const mesh = Create_widget_label(Style_label_default_properties({
        is_root: ROOT_WIDGETS.CREATE_ROOT,
        text: 'W', pos: [x, y, 0], col: BLUEL[9],
        text_pad: [text_pad_x, text_pad_y],
        texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
        font_size: font_size,
    }));
    // Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 10, enable_col_per_vertex: COLOR_GRADIENT_VERTICAL(BLUEL[3], BLUEL[9]), layout:LAYOUT.HORIZONTAL })
    Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 10, layout: LAYOUT.HORIZONTAL, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    mesh.GenGfxCtx();
    Widget_render(mesh);

    /**************************************************************************************************************************/
    // Set scissor box
    const mx = mesh.mesh_bufferidx;
    const my = mesh.mesh_bufferidx;
    const mw = mesh.mesh_bufferidx;
    const mh = mesh.mesh_bufferidx;
    Vertex_buffer_group_create_scissorbox(mesh.text_mesh.gfx.vb.groupidx, mx, my, mw, mh);

    const slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, slope, speed);

    let cnt = 0;

    { // One time call

        if (cnt > 9) cnt = 0;
        const text_substitution = `${cnt++}`;

        let limit = 0;
        if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Texture_metrics_get_sub_tex_width(mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;
        else if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_Y) limit = Texture_metrics_get_sub_tex_height(mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;
        else if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_Y) limit = Texture_metrics_get_line_height(mesh.text_mesh.mat.metrics_idx) * mesh.text_mesh.geom.dim[0];

        const times_to_run = -1;
        const wait_time = 500; // In miliseconds

        Demo_clbk_animations_text_create(mesh, slope_params_pointer, limit, clbk_anim_flag, font_size, times_to_run, cnt, wait_time, text_substitution, 'TESTETESTTEST',);
    }

    // const params = {
    //     target_mesh:mesh,
    //     clbk_anim_flag:clbk_anim_flag,
    //     slope_params_pointer:slope_params_pointer,
    //     counter:cnt,
    //     font_size:font_size,
    // };

    // Time_intervals_create(2000, 'TEST_text_animation', TIME_INTERVAL_REPEAT_ALWAYS,
    // // Time_intervals_create(3000, 'TEST_text_animation', TIME_INTERVAL_REPEAT_ALWAYS,
    // // Time_intervals_create(3000, 'TEST_text_animation', 1,
    //     (params) => {

    //         const target_mesh = params.params.target_mesh;
    //         const clbk_anim_flag = params.params.clbk_anim_flag;
    //         const slope_params_pointer = params.params.slope_params_pointer;
    //         const font_size = params.params.font_size;
    //         let limit = 0;

    //         if (params.params.counter > 9) params.params.counter = 0;
    //         const text_substitution = `${params.params.counter++}`;

    //         if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Texture_metrics_get_sub_tex_width(target_mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;
    //         else if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_SQUEEZE_Y) limit = Texture_metrics_get_sub_tex_height(target_mesh.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) * font_size;
    //         else if (clbk_anim_flag & CLBK_ANIMATIONS.TEXT_TRANSLATE_Y) limit = Texture_metrics_get_line_height(target_mesh.text_mesh.mat.metrics_idx) * target_mesh.text_mesh.geom.dim[0];


    //         Demo_clbk_animations_text_create(target_mesh, slope_params_pointer, limit, 'TESTETESTTEST', clbk_anim_flag, text_substitution);

    //     }, params,
    // )
}
function Test_text_clbk_animations_counter_2_text_meshes(x, y, text_pad_x = 10, text_pad_y = 6, clbk_anim_flag = CLBK_ANIMATIONS.TEXT_TRANSLATE_Y, speed = 10, slope = .04) {

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 0], col: GREY[1] }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, enable_col_per_vertex: COLOR_GRADIENT_HORIZONTAL(GREY[1], GREY[4]) });
    section.align.flags = (LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF);


    const mesh2 = Widget_ready_label(_, '_', _, _, _, 10, _, _, _, false);
    Widget_gfx_ready_enable({ mesh: mesh2, enable_sdf_rect: 10, enable_col_per_vertex: COLOR_GRADIENT_HORIZONTAL(GREEN[2], GREEN[7]) });
    mesh2.align.flags = LAYOUT.HORIZONTAL
    section.AddItem(mesh2)

    const mesh1 = Widget_ready_label(_, '.', _, _, _, 10, _, _, _, false);
    Widget_gfx_ready_enable({ mesh: mesh1, enable_sdf_rect: 10, enable_col_per_vertex: COLOR_GRADIENT_HORIZONTAL(YELLOWR[2], YELLOWR[7]) });
    mesh1.align.flags = LAYOUT.HORIZONTAL
    section.AddItem(mesh1)



    section.GenGfxCtx();
    Align_nested_sections_pre(section);
    Widget_render(section);



    const slope_params_pointer = Demo_clbk_animations_create_transition_slope(_, slope, speed);

    const params = {
        counter1: 0,
        counter2: 1,
    };
    Time_intervals_create(700, 'TEST_text_animation', TIME_INTERVAL_REPEAT_ALWAYS,
        (params) => {

            if (params.params.counter1 > 9) {
                params.params.counter1 = 0;
                let limit_ = 0;
                const text_substitution_ = `${params.params.counter2++}`
                if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit_ = Texture_metrics_get_sub_tex_width(mesh1.text_mesh.mat.metrics_idx, text_substitution_.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) / 2;
                else if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit_ = Texture_metrics_get_line_height(mesh1.text_mesh.mat.metrics_idx) / 2;
                Demo_clbk_animations_text_create(mesh2, slope_params_pointer, limit_, 'TEST_text_animation_2', clbk_anim_flag, text_substitution_);
            }
            if (params.params.counter2 > 9) { params.params.counter2 = 0; }

            const text_substitution = `${params.params.counter1++}`

            let limit = 0;
            if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_X | CLBK_ANIMATIONS.TEXT_TRANSLATE_X)) limit = Texture_metrics_get_sub_tex_width(mesh1.text_mesh.mat.metrics_idx, text_substitution.charCodeAt(0) - CHAR_ARRAY_START_OFFSET) / 2;
            else if (clbk_anim_flag & (CLBK_ANIMATIONS.TEXT_SQUEEZE_Y | CLBK_ANIMATIONS.TEXT_TRANSLATE_Y)) limit = Texture_metrics_get_line_height(mesh1.text_mesh.mat.metrics_idx) / 2;

            Demo_clbk_animations_text_create(mesh1, slope_params_pointer, limit, 'TEST_text_animation_1', clbk_anim_flag, text_substitution);
        },
        params,
    );

}


function CreateSimpleWidgetText(x, y) {

    const widget_text = Create_widget_text({
        is_root: ROOT_WIDGETS.CREATE_ROOT,
        pos: [x, y, 0],
        col: ORANGER[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: 10,
        text: `|Widget_Text inside a Section\n| This is a new line @#-$%`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S8_0,
        pad: [10, 6],
    });
    Widget_gfx_ready_enable({ mesh: widget_text, enable_attr_dim: false });

    /********************************************************************************************************************************************************/
    // Render
    widget_text.GenGfxCtx();

    Widget_render(widget_text);

    // Vertex_buffer_calculate_render_group_starts();
    // View_render_from_view_NEW(widget_text.group_bufferidxs[0]);

    // Root_group_activate_all_vbs_in_renderqueue(widget_text.root_bufferidx);
    // widget_text.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, widget_text.gfx.vb.groupidx);
}
function CreateTextInSectionWithNewLine() { // GOOD!! render text from widget text directly to a section or stand alone. ABLE TO create layout with VERTICAL alignment via the new implementation

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: SECTION.VERTICAL, pos: [50, 250, 0], col: TRANSPARENCY(GREY[7], .5) }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 1 });


    const info1 = Create_widget_text({
        is_root: _,
        pos: [0, 0, 0],
        col: ORANGER[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: 10,
        text: `|Widget_Text inside a Section\n| This is a new line @#-$%`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S8_0,
        pad: [10, 6],
        layout: LAYOUT.HORIZONTAL,
    });
    Widget_gfx_ready_enable({ mesh: info1, enable_attr_dim: false });
    section.AddItem(info1);
    info1.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 2);


    const info2 = Create_widget_text({
        is_root: _,
        pos: [0, 0, 0],
        col: GREEN[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: 10,
        text: `|This is a new widget_text,\naligned verticaly inside the section`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S5_0,
        pad: [10, 6],
        layout: LAYOUT.VERTICAL,
    });
    Widget_gfx_ready_enable({ mesh: info2, enable_attr_dim: false });
    section.AddItem(info2);
    info2.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 2);




    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx();
    Align_nested_sections_pre(section);
    Widget_render(section);
    info1.GfxUniformSetAndUpdate('u_generic_controls', [.2, 1.]);

}
function CreateTextInSectionWithNewLineWithControls() { // GOOD!! render text from widget text directly to a section or stand alone. ABLE TO create layout with VERTICAL alignment via the new implementation
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: SECTION.VERTICAL, pos: [50, 250, 0], col: TRANSPARENCY(GREY[7], .5) }));
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    section.align.flags = LAYOUT.RESIZE_SELF;



    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


    const info1 = Create_widget_text({
        is_root: _,
        pos: [0, 0, 0],
        col: ORANGER[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        text: `|Widget_Text inside a Section\n| This is a new line @#-$%`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S8_0,
        // sub_texture_id, 
        pad: [10, 6],
    });
    info1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.AddItem(info1);
    info1.align.flags = LAYOUT.HORIZONTAL;

    info1.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 2);

    const info2 = Create_widget_text({
        is_root: _,
        pos: [0, 0, 0],
        col: GREEN[9],
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: 10,
        text: `|This is a new widget_text,\naligned verticaly inside the section`,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_0,
        pad: [10, 6],
    });
    info2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.AddItem(info2);
    info2.align.flags = LAYOUT.VERTICAL;
    info2.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 2);





    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx();
    Align_nested_sections_pre(section);
    Widget_render(section);


    info1.GfxUniformSetAndUpdate('u_generic_controls', [.2, 1.]);


    { // Create contols
        const ctrl_panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [0, 50, 0], col: GREY[7], pad: [20, 20], layout: LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL }));
        Widget_gfx_ready_enable({ mesh: ctrl_panel, enable_sdf_rect: 10, })

        const ctrl = Controls_create_slider_controls_from_shader_uniform_buffer(info1, [120, 20], [.2, 1.], 'u_generic_controls');
        for (let i = 0; i < ctrl.length; i++) {
            ctrl_panel.AddItem(ctrl[i]);
        }



        /********************************************************************************************************************************************************/
        // Render
        ctrl_panel.GenGfxCtx();
        Align_nested_sections_pre(ctrl_panel);
    Widget_render(ctrl_panel);
    }
}



function TexturedRect(is_root = 0x0, name = 'TexturedRect', x = 0, y = 0, dim = [32 / 2, 32 / 2], color = WHITE, pad = [0, 0], texture_id = TEXTURES.COIN, sub_texture_id = INT_NULL) {

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: is_root, pad: pad, pos: [x, y, 0], dim: dim, col: color, texture_id: texture_id, sub_texture_id: sub_texture_id }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);
    // section.sid.inst = (SID.ATTR.WPOS3|SID.ATTR.DIM2|SID.ATTR.R_CORNERS|SID.ATTR.FEATHER);

    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {


        section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC;
        section.GenGfxCtx();
    Widget_render(section);
    }

    return section;
}

function Rotatable_section_with_rcorners_via_uniform_rotation(pos) {

    console.error(
        `Fix: We pass float uniform as an angle for ratation with u_generic_controls, but u_generic_controls must be captured in shaders to rotate the objects.
Also the sdf rect shader operation uses the folowng code for rotations:
    float angle = 0.0;
    #ifdef A_ANGLE
      angle = v_angle;
    #endif
`
    );

    const marg = [10, 10];
    const dim = [70, 40];


    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: pos, dim: dim, col: BLUEL[5], name: 'section' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, enable_attr_angle: true, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })
    section.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 1);


    {
        const s = Create_rect_mesh(Style_rect_default_properties({ pad: [40, 20], pos: pos, dim: [0, 0], col: GREEN[8], }));
        Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: 10, enable_attr_angle: true, })
        section.AddItem(s);
    }
    {
        const s = Create_rect_mesh(Style_rect_default_properties({ pad: [40, 20], pos: pos, dim: [0, 0], col: GREEN[8], }));
        Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: 10, enable_attr_angle: true, })
        section.AddItem(s);
    }



    section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;
    section.GenGfxCtx();
    Align_nested_sections_pre(section);
    Widget_render(section);
    section.GfxUniformSetAndUpdate('u_generic_controls', 0);

    {
        const slider = CreateSlider(_, 10, 20, 0., 'Smooth');

        const params = {
            target_mesh: section,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const rot = slider_val * (Math.PI * 2 + Math.PI / 2);

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_float', rot, _);

            for (let i = 0; i <= target_mesh.children.boundary; i++) {

                const child = target_mesh.children.buffer[i];
                child.GfxUniformSetAndUpdate('u_generic_controls', rot, 0);
                Mesh_rotate_z(child, rot);
            }

        }, params,
        );
    }

    return section;
}
function Rotatable_section_with_rcorners_via_attribute_rotation(pos) {

    const marg = [20, 20];
    const dim = [70, 40];


    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: pos, dim: dim, col: BLUEL[5], name: 'section' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, enable_attr_angle: true, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })


    {
        const s = Create_rect_mesh(Style_rect_default_properties({ pad: [40, 20], pos: pos, dim: [0, 0], col: PURPLER[9], }));
        Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: 10, enable_attr_angle: true, })
        // s.EnableGfx(MESH_ENABLE.GFX.ATTR_COL4_PER_VERTEX, [YELLOW[9], REDL[9], GREENR[9], BLUEL[9]]);
        section.AddItem(s);
    }
    {
        const s = Create_rect_mesh(Style_rect_default_properties({ pad: [40, 20], pos: pos, dim: [0, 0], col: GREEN[8], }));
        Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: 10, enable_attr_angle: true, })
        section.AddItem(s);
    }




    section.gfx_ctx_flags = GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;
    section.GenGfxCtx();
    Align_nested_sections_pre(section);
    Widget_render(section);

    {
        const slider = CreateSlider(_, 10, 20, 0., 'Smooth');

        const params = {
            target_mesh: section,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const rot = slider_val * (Math.PI * 2 + Math.PI / 2);

            const target_mesh = params.clbk_params.target_mesh;
            // target_mesh.GfxUniformSetAndUpdate('u_generic_float', rot, _);
            // target_mesh.RotateZ(rot);

            for (let i = 0; i <= target_mesh.children.boundary; i++) {

                const child = target_mesh.children.buffer[i];
                // child.GfxUniformSetAndUpdate('u_generic_float', rot, _);
                Mesh_rotate_z(child, rot);
                Gl_set_angle(child.gfx, rot)
            }

        }, params,
        );
    }

    return section;
}
function SectionResizable(pos) {

    const tr = 1.;
    const marg = [10, 10];
    const dim = [200, 200];
    // const dim = [400, VIEWPORT.HEIGHT / 2];

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: _, pad: marg, pos: pos, dim: dim, col: TRANSPARENCY(BLUEL[5], tr), name: `section${grey_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } })
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);


    section.GenGfxCtx();
    Widget_render(section);

    return section;
}
function CreateSectionedButtons(pos, name = 'NO NAME') {

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, options: SECTION.VERTICAL, pad: [10, 10], pos: pos, dim: [0, 0], col: GREY[1], name: name, }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


    // Add widgets
    {
        const btn = Create_widget_button(Style_button_default_properties({
            is_root: 0x0,
            pos: [0, 0, 1],
            theme: Color_theme_label_auto(.57, .8, .28, .0),
            // col: GREENL[6],
            text_pad: [12, 7],
            text: 'Button',
            texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
            font_size: 10,
            text_col: WHITE,
            is_debug_mesh: false,
            style: [10, 10, 0],
            layout: LAYOUT.VERTICAL,
            is_debug_mesh: false,
        }));
        Widget_gfx_ready_enable({ mesh: btn, enable_sdf_rect: 10, })
        section.AddItem(btn);
    }
    {
        const btn = Create_widget_button(Style_button_default_properties({
            is_root: 0x0,
            pos: [0, 0, 1],
            col: ORANGE[8],
            text_pad: [12, 7],
            text: 'Button',
            texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
            font_size: 10,
            text_col: WHITE,
            is_debug_mesh: false,
            style: [10, 10, 0],
            layout: LAYOUT.VERTICAL,
            is_debug_mesh: false,
        }));
        Widget_gfx_ready_enable({ mesh: btn, enable_sdf_rect: 10, })
        section.AddItem(btn);
    }
    {
        const btn = Create_widget_button(Style_button_default_properties({
            is_root: 0x0,
            pos: [0, 0, 1],
            col: BLUEL[8],
            text_pad: [12, 7],
            text: 'Button',
            texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
            font_size: 10,
            text_col: WHITE,
            is_debug_mesh: false,
            style: [10, 10, 0],
            layout: LAYOUT.VERTICAL,
            is_debug_mesh: false,
        }));
        Widget_gfx_ready_enable({ mesh: btn, enable_sdf_rect: 10, })
        section.AddItem(btn);
    }



    // Render
    section.GenGfxCtx();
    Align_nested_sections_pre(section);
    Widget_render(section);
    return section;
}
function CreateLabel(is_root = ROOT_WIDGETS.CREATE_ROOT, name = 'Label', font, variant_idx, x = 0, y = 0, color = BLUEL[5], vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL, font_size = 20) {

    const label = Create_widget_label(Style_label_default_properties({
        is_root: is_root,
        pos: [x, y, 0],
        col: color,
        text_pad: [20, 6],
        text: name,
        texture_id: font,
        variant_idx: variant_idx,
        font_size: font_size,
        text_col: _,
        layout: LAYOUT.VERTICAL,
        is_debug_mesh: false,
    }));
    Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 4, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } });


    // label.StateEnable(MESH_STATE_FLAGS.IS_HOVER_COLORABLE | MESH_STATE_FLAGS.IS_RESIZEABLE);
    // label.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // label.text_mesh.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);


    if (is_root === ROOT_WIDGETS.CREATE_ROOT) {

        if (vb_groupidx !== INT_NULL) label.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, vb_groupidx, text_vb_groupidx);
        else label.GenGfxCtx();

        Widget_render(label);


        // label.text_mesh.SetColorRGB(REDL);
        // label.text_mesh.RenderTextFromString('REDL');

        // label.Align(TEXT_ALIGN.BOTTOM | TEXT_ALIGN.LEFT, [0, 0]);
        // label.Align(TEXT_ALIGN.BOTTOM | TEXT_ALIGN.RIGHT, [0, 0]);
        // label.Align(TEXT_ALIGN.TOP | TEXT_ALIGN.LEFT, [0, 0]);
        // label.Align(TEXT_ALIGN.TOP | TEXT_ALIGN.RIGHT, [0, 0]);
    }


    return label;
}


/** */
function CreateButton(x = 20, y = 400, is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const btn = Create_widget_button(is_root, 'Button', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [x, y, 0], fontsize, GREY[1], WHITE, [5, 5], .5);

    // btn.Bind(()=>{console.log('HI')}, )

    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        btn.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        btn.GenGfxCtx();
    Widget_render(btn);
    }

    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.R, btn, .001, 0.6, .6, 0)
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .002, 0.4, .8, .4)
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, btn, .003, 0.2, .8, .8)

    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.B, btn, .01, 0.6, 1.)
    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGBA, btn, .01, 0.4, 1.)
    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.RGB, btn, .01, 0.0, 1., 0)
    // // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.A, btn, .01, .0, 1., .0)

    // // btn.text_mesh.SetColorRGB(BLUE_10_120_220);

    // // btn.Align(TEXT_ALIGN.LEFT | TEXT_ALIGN.TOP, [0, 0]);
    // // btn.Align(TEXT_ALIGN.RIGHT | TEXT_ALIGN.BOTTOM, [15, 5]);

    return btn;
}
/** */
function CreateSwitchSimple(pos, is_root = ROOT_WIDGETS.CREATE_ROOT) {

    let ypos = 450

    const switch1 = Create_widget_switch_simple(Style_switch_default_properties({ is_root: is_root, pos: pos, size: 20, col: _, handle_col: _, hover_margin: 8, }));
    Widget_gfx_ready_enable({ mesh: switch1, enable_sdf_rect: switch1.geom.dim[1] });

    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        switch1.GenGfxCtx();
    Widget_render(switch1);
    }

    return switch1;
}
/** */
function CreateSwitch() {

    let ypos = 500
    // const switch1 = Create_widget_switch_button(ROOT_WIDGETS.CREATE_ROOT, 'switch on', 'switch off', [100, ypos, 0], fontsize, GREY[1], WHITE, [5, 5], .5);
    const switch1 = Create_widget_switch_button(Style_switch_button_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, text_on: 'switch on', text_off: 'switch off', pos: [100, ypos, 0], font_size: fontsize, col: GREY[1], text_col: WHITE, text_pad: [5, 5], }));
    Widget_gfx_ready_enable({ mesh: switch1, enable_sdf_rect: switch1.geom.dim[1] });

    switch1.Bind(function () { console.log('CALLBACK FROM USER !!!!!!!!!!!!!!!!!!!!!!!!!!!') })

    switch1.GenGfxCtx();
    Widget_render(switch1);
    // switch1.text_mesh.SetColorRGB(PURPLEB[7], 4);
    Set_color_rgb(switch1, PURPLER[7]);

    return switch1;
}
/** */
function CreateSliderSimple(is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const slider = Create_widget_slider_simple(Style_slider_simple_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [100, 100, 0], col: GREY[5], dim: [100, 4], pad: [10, 10], }));
    Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 4, listener: { type: LISTEN_EVENT_TYPES.MOVE } });


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        slider.GenGfxCtx();
        Widget_render(slider);
    }

    return slider;
}
/** */
function CreateSlider(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, initial_val = .5, name = 'S') {

    const pos = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? [x, y, 0] : [0, 0, 0]


    const slider = Create_widget_slider(Style_slider_default_properties({
        is_root: ROOT_WIDGETS.CREATE_ROOT,
        pos: pos,
        dim: [120, 15],
        // name: 'Slider Sample',
        name: 'SSS',
        col: GREY[5],
        theme: Color_theme_slider_auto(.0, .8, .18, 0),
    }));
    // Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 4, listener:{type:LISTEN_EVENT_TYPES.MOVE}});
    Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 4, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

    slider.SetInitialValue(initial_val);


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        slider.GenGfxCtx();
    Widget_render(slider);
    }

    return slider

}
/** */
function SdfLine(col, pos, dim, render_instanced_flags = 0x0, enable_angle = false) {


    const line = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: pos, dim: dim, col: TRANSPARENCY(col, 1), name: 'sdf linem2', style: [0, 10, 1.8] }));
    Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: dim[1], enable_attr_angle: 2, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })

    // line.sid.inst = (SID.ATTR.COL4 | SID.ATTR.WPOS3);
    line.GenGfxCtx();
    Widget_render(line);

    return line;
}
/** */
function CreateDropdownTree(pos = [0, 0, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const text_pad = [12, 6];
    const pad = [6, 6];
    const font_size = 8;
    const dp_rcorners = 7;
    const menu_rcorners = 7;
    const btn_rcorners = 7;
    const dp_col = GREY[4];
    const menu_col = GREY[2];


    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: dp_col, menu_col: menu_col, btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })
    dp.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
    // dp.menu.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.RENDER_GROUP_NEW);


    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;


    zpos++
    { // Many dps

        const sub_dp1_count = 1;
        const sub_dp2_count = 1;

        const col = YELLOWR[7];
        for (let i = 0; i < sub_dp1_count; i++) {

            // { // Label
            //     const count = 1; const brightness_increments = 1/count; let brightness =  0;
            //     for (let i = 0; i < count; i++) {
            //         const l = Create_widget_label(Style_label_default_properties({ text: `${i}123`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:'label' }));
            //         Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
            //         dp.AddToMenu(l);
            //         l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            //         brightness += brightness_increments;
            //     }
            // }

            // { // Rects nested
            //     let cnt = 0;
            //     const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`Rect ${cnt++}` }));
            //     Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            //     dp.AddToMenu(s1); 
            //     s1.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC);
            //     s1.gfx_ctx_flags = (GFX_CTX_FLAGS.RENDER_GROUP_NEW);
            //     {
            //         const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL , name:`Rect ${cnt++}` }));
            //         Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            //         s1.AddItem(s2); 
            //         s2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            //     }

            // }

            const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp2' }));
            Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            dpsub1.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
            // dpsub1.gfx_ctx_flags = (GFX_CTX_FLAGS.RENDER_GROUP_NEW);
            // dpsub1.RenderToNewRenderGroup();
            dp.AddToMenu(dpsub1);

            const col1 = TRANSPARENCY(PURPLEB[6], 1.);
            for (let j = 0; j < sub_dp1_count; j++) {

                const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp3' }));
                Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                dpsub2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                dpsub1.AddToMenu(dpsub2);

                const col2 = TRANSPARENCY(GREEN[6], 1.)

                for (let k = 0; k < sub_dp2_count; k++) {

                    const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
                    Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                    dpsub3.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                    // dpsub3.RenderToNewRenderGroup();
                    dpsub2.AddToMenu(dpsub3);

                    { // Label

                        const d = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
                        Widget_gfx_ready_enable({ mesh: d, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                        d.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                        // d.RenderToNewRenderGroup();
                        dpsub3.AddToMenu(d);

                        const l = Create_widget_label(Style_label_default_properties({ text: `${i}123`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout: LAYOUT.VERTICAL, name: 'label' }));
                        Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                        d.AddToMenu(l);
                        l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);

                        { // Label
                            const count = 4; const brightness_increments = 1 / count; let brightness = 0;
                            for (let i = 0; i < count; i++) {
                                const l = Create_widget_label(Style_label_default_properties({ text: `${i}123`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout: LAYOUT.VERTICAL, name: 'label' }));
                                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                                dpsub3.AddToMenu(l);
                                l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                                brightness += brightness_increments;
                            }
                        }
                    }

                    // const col3 = TRANSPARENCY(YELLOW[6], 1.)
                    // for (let n = 0; n < sub_dp2_count; n++) {

                    //     const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col3, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
                    //     Widget_gfx_ready_enable({ mesh: dpsub4, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                    //     dpsub4.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                    //     dpsub3.AddToMenu(dpsub4);

                    //     const col4 = TRANSPARENCY(PURPLER[6], 1.)
                    //     for (let m = 0; m < 10; m++) {

                    //         const dpsub5 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}${m}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col4, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
                    //         Widget_gfx_ready_enable({ mesh: dpsub5, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                    //         dpsub5.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                    //         dpsub4.AddToMenu(dpsub5);

                    //     }
                    // }
                }
                for (let k = 0; k < sub_dp2_count; k++) {

                    const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
                    Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                    dpsub3.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                    // dpsub3.RenderToNewRenderGroup();
                    dpsub2.AddToMenu(dpsub3);

                    { // Label
                        const count = 4; const brightness_increments = 1 / count; let brightness = 0;
                        for (let i = 0; i < count; i++) {
                            const l = Create_widget_label(Style_label_default_properties({ text: `${i}123`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout: LAYOUT.VERTICAL, name: 'label' }));
                            Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                            dpsub3.AddToMenu(l);
                            l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                            brightness += brightness_increments;
                        }
                    }
                }
            }
        }
    }


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {


        dp.GenGfxCtx();
        Align_nested_sections_pre(dp);

        Widget_render(dp);

        // Create group, to control the vertex buffer rendering by adding removing activated/deactivated dropdown meshes
        // View_build_group_from_root_mesh(dp);
    }

    return dp;
}
/** */
function CreateDropdownTreeHorizontalLayout(pos = [0, 0, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const text_pad = [12, 4];
    const pad = [0, 0];
    const font_size = 8;
    const dp_rcorners = 7;
    const menu_rcorners = 7;
    const btn_rcorners = 7;
    const col = ORANGE[3];

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: YELLOWL[3], menu_col: GREEN[4], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;


    zpos++
    { // Many dps

        const sub_dp1_count = 2;
        const sub_dp2_count = 2;

        const col = GetSequencedColor()
        for (let i = 0; i < sub_dp1_count; i++) {

            const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            dp.AddToMenu(dpsub1);

            {
                const l = Widget_ready_label();
                Widget_gfx_ready_enable({ mesh: l, font_size: 10 });
                l.SetLayout(LAYOUT.VERTICAL)
                dpsub1.AddToMenu(l);
            }
            {
                const l = Create_widget_label(Style_label_default_properties({ text: 'Hi There!', font_size: 10 }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 6 });
                l.SetLayout(LAYOUT.VERTICAL)
                dpsub1.AddToMenu(l);
            }
            {
                const slider = Widget_ready_slider();
                Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 6 });
                slider.SetLayout(LAYOUT.HORIZONTAL)
                dpsub1.AddToMenu(slider);
            }
            {
                const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `DP1`, pos: [0, 0, zpos + 1], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                dpsub1.AddToMenu(dpsub2);
                {
                    const l = Create_widget_label(Style_label_default_properties({ text: 'Inner Label!', font_size: 10 }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 6 });
                    l.SetLayout(LAYOUT.VERTICAL)
                    dpsub2.AddToMenu(l);

                    {
                        const slider = Widget_ready_slider();
                        Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 6 });
                        slider.SetLayout(LAYOUT.HORIZONTAL)
                        dpsub2.AddToMenu(slider);
                    }
                }
                {
                    const l = Create_widget_label(Style_label_default_properties({ text: 'Inner Label!', font_size: 10 }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 6 });
                    l.SetLayout(LAYOUT.VERTICAL)
                    dpsub2.AddToMenu(l);
                }

            }
            {
                const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `DP1`, pos: [0, 0, zpos + 1], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                dpsub1.AddToMenu(dpsub2);
                {
                    const l = Create_widget_label(Style_label_default_properties({ text: 'Inner Label!', font_size: 10 }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 6 });
                    l.SetLayout(LAYOUT.VERTICAL)
                    dpsub2.AddToMenu(l);

                    {
                        const slider = Widget_ready_slider();
                        Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: 6 });
                        slider.SetLayout(LAYOUT.HORIZONTAL)
                        dpsub2.AddToMenu(slider);
                    }
                }
                {
                    const l = Create_widget_label(Style_label_default_properties({ text: 'Inner Label!', font_size: 10 }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 6 });
                    l.SetLayout(LAYOUT.VERTICAL)
                    dpsub2.AddToMenu(l);
                }

            }




        }
    }


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {


        dp.GenGfxCtx();
        Align_nested_sections_pre(dp);

        Widget_render(dp);
    }

    return dp;
}



/** */
function TestAlignNew(pos = [0, 0, 0]) {

    const widgets_construct = () => {

        const s = Widget_ready_rect();
        s.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL

        {
            {
                const l = CreateLabel(0x0, 'Hi', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12);
                s.AddItem(l);
                Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.HORIZONTAL;
            }
            { const l = CreateLabel(0x0, 'This is', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); s.AddItem(l); Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.HORIZONTAL; }
            { const l = CreateLabel(0x0, 'a sample', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); s.AddItem(l); Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.VERTICAL; }
            { const l = CreateLabel(0x0, 'of labels', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); s.AddItem(l); Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.VERTICAL; }
        }
        /** Test: Many section */

        /** Test: Sliders */
        {
            const slider = Widget_ready_slider(_, _,);
            slider.align.flags = LAYOUT.VERTICAL;
            s.AddItem(slider);
        }
        /** Test: Switches */
        {

            // {const switch1 = Widget_ready_switch(); switch1.align.flags=LAYOUT.HORIZONTAL; s.AddItem(switch1);}
            { const switch1 = Widget_ready_switch(); switch1.align.flags = LAYOUT.VERTICAL; s.AddItem(switch1); }
            { const switch1 = Widget_ready_switch(); switch1.align.flags = LAYOUT.VERTICAL; s.AddItem(switch1); }
            { const switch1 = Widget_ready_switch(); switch1.SetLayout(LAYOUT.VERTICAL); s.AddItem(switch1); }
        }
        /** Test: Scroller */
        // { 
        //     const scroller = CreateScrollerClampAlphaTest(0x0, );
        //     scroller.align.flags=LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF;
        //     s.AddItem(scroller);
        // }
        // { 
        //     const scroller = CreateScrollerClampAlphaTest(0x0, );
        //     scroller.align.flags=LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF;
        //     s.AddItem(scroller);
        // }
        // { 
        //     const scroller = CreateScrollerClampAlphaTest(0x0, );
        //     scroller.align.flags=LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF;
        //     s.AddItem(scroller);
        // }

        return s;
    }

    const text_pad = [12, 4];
    const pad = [0, 0];
    const font_size = 8;


    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, text: `ROOT`, pos: pos, col: YELLOWL[3], menu_col: GREEN[4], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    // dp.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
    dp.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;


    Dropdown_roots_set_root(dp, dp);


    // const w = widgets_construct();
    // dp.AddToMenu(w);


    const sub_dp1_count = 1;
    const sub_dp2_count = 1;
    let zpos = 1


    let col = GetSequencedColor()
    for (let i = 0; i < sub_dp1_count; i++) {

        const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos++], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
        Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        // dpsub1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
        dp.AddToMenu(dpsub1);

        { // Test: Labels
            const l = Widget_ready_label(_, 'HI!',);
            dpsub1.AddToMenu(l);
            Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER);
        }

        col = GetSequencedColor(6)
        for (let j = 0; j < sub_dp2_count; j++) {

            const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos++], col: col, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
            Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            dpsub1.AddToMenu(dpsub2);


            const col2 = GetSequencedColor(6)
            for (let k = 0; k < sub_dp2_count; k++) {

                const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}${k}`, pos: [0, 0, zpos++], col: col2, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                // dpsub3.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                dpsub3.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF
                dpsub2.AddToMenu(dpsub3);


                const w2 = widgets_construct();
                dpsub3.AddToMenu(w2);

                const col3 = GetSequencedColor(6)
                for (let n = 0; n < sub_dp2_count; n++) {
                    const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}${k}${n}`, pos: [0, 0, zpos++], col: col3, menu_col: GREY[1], text_col: WHITE, text_pad: text_pad, pad: pad, font_size: font_size }));
                    Widget_gfx_ready_enable({ mesh: dpsub4, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                    // dpsub4.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, dp_rcorners, menu_rcorners, btn_rcorners);
                    dpsub4.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF
                    dpsub3.AddToMenu(dpsub4);

                    const s = Widget_ready_label(_, 'sk1');
                    dpsub4.AddToMenu(s)


                    const w2 = widgets_construct();
                    dpsub4.AddToMenu(w2);

                }
            }
        }
    }


    /** Many Labels */
    {
        { const l = CreateLabel(0x0, 'Hi', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.HORIZONTAL; }
        { const l = CreateLabel(0x0, 'This is', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.HORIZONTAL; }
        { const l = CreateLabel(0x0, 'a sample', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.VERTICAL; }
        { const l = CreateLabel(0x0, 'of labels', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700, GREY[4], _, _, 12); dp.AddToMenu(l); Mesh_listener_create(l, LISTEN_EVENT_TYPES.HOVER); l.align.flags = LAYOUT.VERTICAL; }
    }
    /** Test: Many section */
    /** Test: Sliders */
    {
        const slider = Widget_ready_slider(_, _,);
        slider.align.flags = LAYOUT.VERTICAL;
        dp.AddToMenu(slider);
    }
    /** Test: Switches */
    {

        // {const switch1 = Widget_ready_switch(); switch1.align.flags=LAYOUT.HORIZONTAL; dp.AddToMenu(switch1);}
        { const switch1 = Widget_ready_switch(); switch1.align.flags = LAYOUT.VERTICAL; dp.AddToMenu(switch1); }
        { const switch1 = Widget_ready_switch(); switch1.align.flags = LAYOUT.VERTICAL; dp.AddToMenu(switch1); }
        { const switch1 = Widget_ready_switch(); switch1.SetLayout(LAYOUT.VERTICAL); dp.AddToMenu(switch1); }
    }
    // /** Test: Scroller */
    // {
    //     const scroller = CreateScrollerClampAlphaTest(0x0,);
    //     scroller.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
    //     dp.AddToMenu(scroller);
    // }
    // {
    //     const scroller = CreateScrollerClampAlphaTest(0x0,);
    //     scroller.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
    //     dp.AddToMenu(scroller);
    // }
    // {
    //     const scroller = CreateScrollerClampAlphaTest(0x0,);
    //     scroller.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
    //     dp.AddToMenu(scroller);
    // }



    dp.GenGfxCtx();
    Align_nested_sections_pre(dp)

    Widget_render(dp);


    return dp;
}
function Render_font_symbols_atlas_texture(x, y) {

    const section = Create_rect_mesh(Style_rect_default_properties({
        is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: [0, 0, 0], dim: [100, 100], col: TRANSPARENCY(GREY[1], .8), name: 'Test symbols font rendering',
    }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })

    section.StylesSetPad([10, 10]);

    let size = 40;
    // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.original); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.original); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_1); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_left); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_up); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_right); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_down); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_lr); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_ud); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_lu); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_ru); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_clockwise_2); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_clockwise); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_anti_clockwise); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_left); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_up); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_right); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_down); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_1); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_2); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_3); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_4); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.tie); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.under_tie); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_boxed); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.diagonal_r); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.diagonal_l); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_2); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._8); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._9); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._10); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._11); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._12); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._13); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._14); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._15); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._16); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._17); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._18); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._19); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._20); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._21); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._22); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._23); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._24); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._25); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._26); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._27); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._28); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._29); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._30); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._31); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._32); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._33); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow2_left); s.align.flags = LAYOUT.VERTICAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow2_up); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow2_right); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }
    { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow2_down); s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s); }

    { /// SAVE
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.original);            s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_1);             s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_left);          s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_up);            s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_right);         s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_down);          s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_lr);            s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_ud);            s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_lu);            s.align.flags = LAYOUT.VERTICAL; section.AddItem(s);}
        // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_ru);            s.align.flags = LAYOUT.HORIZONTAL; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_clockwise_2);    y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_clockwise);      y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_anti_clockwise); y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_left);     y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_up);       y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_right);    y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_thick_down);     y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_1);             y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_2);             y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_3);             y = 0;  x += 150;      s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_4);             y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.tie);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.under_tie);            y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_boxed);          y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.diagonal_r);           y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.diagonal_l);           y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_2);             y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._8);                   y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._9);                   y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._10);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._11);                  y = 0;  x += 150;      s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._12);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._13);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._14);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._15);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._16);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._17);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._18);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._19);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._20);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._21);                  y = 0;  x += 150;      s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._22);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._23);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._24);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._25);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._26);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._27);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._28);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._29);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._30);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._31);                  y = 0;  x += 150;      s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._32);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._33);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._34);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._35);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._36);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
        // // { const s = TexturedRect(0x0, _, x, y, [size, size], WHITE, [0,0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._37);                  y += s.geom.dim[1]*2;  s.align.flags = LAYOUT.VERTICAL|LAYOUT.PRESERVE_SELF_POS|LAYOUT.RESIZE_SELF; section.AddItem(s);}
    }





    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx();
    Align_nested_sections_pre(section);

    Widget_render(section);

}
/** */
function CreateManySections(scene) {

    const tr = 1.;
    const rcorners1 = 10;

    const blu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [0, 400, 0], dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: blu, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })


    const red = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    blu.AddItem(red);


    {
        const black = Create_rect_mesh(Style_rect_default_properties({ options: SECTION.HORIZONTAL, pad: [15, 15], pos: [0, 0, 1], dim: [20, 20], col: TRANSPARENCY(BLACK, tr), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
        Widget_gfx_ready_enable({ mesh: black, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
        black.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF
        red.AddItem(black);

        {
            const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({ mesh: grey_1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            black.AddItem(grey_1);

            {
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            }
            {
                const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                grey_1.AddItem(s);

                {
                    const s1 = Sections2(_, LAYOUT.VERTICAL); grey_1.AddItem(s1);
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL); s1.AddItem(s2); }

                }

                {
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 30], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [40, 10], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                }
            }
        }
        {
            const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({ mesh: grey_1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            black.AddItem(grey_1);

            {
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            }
            {
                const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                grey_1.AddItem(s);

                {
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 30], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [40, 10], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [50, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                    { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [30, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                }
            }
        }

        {
            const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({ mesh: grey_1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            black.AddItem(grey_1);

            {
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
                { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            }
        }

    }




    blu.GenGfxCtx();
    Align_nested_sections_pre(blu);

    Widget_render(blu);

    return blu;
}
function Test_align_many_sliders() {

    const pos = [0, 0, 0];
    const tex_id = TEXTURES.MTSDF_CONSOLAS_1024
    const fonst_size = 8

    const root = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: pos, dim: [20, 20], col: TRANSPARENCY(BLUEL[5], 1) }));
    Widget_gfx_ready_enable({ mesh: root, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    root.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
    root.StylesSetPad([10, 10])


    { // Test 2 Sliders
        const r1 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(YELLOWL[5], 1) }));
        Widget_gfx_ready_enable({ mesh: r1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        r1.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
        r1.StylesSetPad([10, 10])
        root.AddItem(r1)

        {
            const r2 = Create_widget_slider_simple(Style_slider_simple_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
            Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
            r2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            r2.align.flags = LAYOUT.VERTICAL;
            r1.AddItem(r2)
        }
        {
            const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
            Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
            r2.align.flags = LAYOUT.VERTICAL;
            r1.AddItem(r2)
        }
        {
            const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
            Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
            r2.align.flags = LAYOUT.HORIZONTAL;
            r1.AddItem(r2)
        }
        {
            const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
            Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
            r2.align.flags = LAYOUT.VERTICAL;
            r1.AddItem(r2)
        }
        {
            const r2 = Create_widget_slider_simple(Style_slider_simple_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
            Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
            r2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            r2.align.flags = LAYOUT.VERTICAL;
            r1.AddItem(r2)
        }

    }


    {
        /** */
        { // Test 1
            const r1 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(YELLOWL[5], 1) }));
            Widget_gfx_ready_enable({ mesh: r1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            r1.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
            r1.StylesSetPad([10, 10])
            root.AddItem(r1)
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });

                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });

                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }

        }
        /** */
        // { // Test 1
        //     const r1 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(ORANGER[5], 1)}));
        //     r1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     r1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //     r1.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //     // r1.align.flags = LAYOUT.HORIZONTAL;
        //     r1.align.flags = LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF;
        //     // r1.align.flags = LAYOUT.RESIZE_SELF;
        //     r1.SetName('ORANGER')
        //     r1.StylesSetPad([10,10])
        //     root.AddItem(r1)
        //     // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.HORIZONTAL; r1.AddItem(label); }
        //     // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.VERTICAL; r1.AddItem(label); }

        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(GREY[3], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.align.flags = LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF;
        //         r2.SetName('ORANGER-1')
        //         r2.StylesSetPad([25,25])
        //         r1.AddItem(r2)
        //         { const label = Widget_ready_label(_, `B1`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B2`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B3`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B4`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.HORIZONTAL; r2.AddItem(label); }
        //         { const label = Widget_ready_label(_, `B5`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.HORIZONTAL; r2.AddItem(label); }
        //         // { const label = Widget_ready_label(_, `B`, tex_id, 0, 0, fonst_size, TRANSPARENCY(BLUEL[6], .7), _, _); label.StylesSetPad([0, 0]); label.align.flags |= LAYOUT.VERTICAL; r2.AddItem(label); }
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.align.flags = LAYOUT.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.align.flags = LAYOUT.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.align.flags = LAYOUT.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }
        //     { 
        //         const r2 = Create_rect_mesh(Style_rect_default_properties({pos:pos, dim:[20, 20], col:TRANSPARENCY(PURPLE[5], 1)}));
        //         r2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //         r2.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
        //         r2.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        //         r2.align.flags = LAYOUT.VERTICAL;
        //         r2.SetName('ORANGER-1')
        //         r1.AddItem(r2)
        //     }

        // }        
        /** */
        {
            const r1 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(YELLOWL[5], 1) }));
            Widget_gfx_ready_enable({ mesh: r1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });

            r1.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
            r1.StylesSetPad([10, 10])
            root.AddItem(r1)

            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.HORIZONTAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.HORIZONTAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.HORIZONTAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.HORIZONTAL;
                r1.AddItem(r2)
            }
        }
        /** */
        {
            const r1 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(YELLOWL[5], 1) }));
            Widget_gfx_ready_enable({ mesh: r1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            // r1.align.flags = LAYOUT.HORIZONTAL;
            r1.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF;
            r1.StylesSetPad([10, 10])
            root.AddItem(r1)
            {
                const r2 = Create_widget_slider_simple(Style_slider_simple_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
                r2.align.flags = LAYOUT.VERTICAL;
                r2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                r1.AddItem(r2)
            }
            {
                const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_widget_slider(Style_slider_default_properties({ pos: pos, dim: [120, 10], col: PURPLE[5] }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }

        }
        /** */
        {
            const r1 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(GREEN[5], 1) }));
            Widget_gfx_ready_enable({ mesh: r1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            r1.align.flags = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF;
            r1.StylesSetPad([10, 10])
            root.AddItem(r1)

            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.HORIZONTAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
            {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.HORIZONTAL;
                r1.AddItem(r2)
            } {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.HORIZONTAL;
                r1.AddItem(r2)
            } {
                const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(PURPLE[5], 1) }));
                Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                r2.align.flags = LAYOUT.VERTICAL;
                r1.AddItem(r2)
            }
        }
        /** */
        {
            const r1 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(ORANGE[5], 1) }));
            Widget_gfx_ready_enable({ mesh: r1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            r1.align.flags = LAYOUT.VERTICAL;
            root.AddItem(r1)
        }
        /** */
        { // Test 1
            const r1 = Create_rect_mesh(Style_rect_default_properties({ pos: pos, dim: [20, 20], col: TRANSPARENCY(YELLOW[5], 1) }));
            Widget_gfx_ready_enable({ mesh: r1, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            r1.align.flags = LAYOUT.HORIZONTAL;
            root.AddItem(r1)
        }
    }



    /********************************************************************************************************************************************************/
    // Align
    Align_nested_sections_pre(root);

    root.GenGfxCtx();
    Widget_render(root);
}
/** */
function Test_performance_align_functions() {

    // TODO: this supposed to be the Section mesh class for comparison
    const num = 15
    const section1 = Test_performance_align_functions_1(20, 100, num);
    // Widget_gfx_ready_enable({ mesh: section1, enable_sdf_rect: 10, });
    {
        const fps_label = Create_widget_label(Style_label_default_properties({ text: '0000000', pos: [0, 0, 1], fontsize: fontsize, col: BLUEL[1], text_pad: [20, 10], }));
        Widget_gfx_ready_enable({ mesh: fps_label, enable_sdf_rect: 10, });
        section1.AddItem(fps_label);


        section1.GenGfxCtx();
        /********************************************************************************************************************************************************/
        Align
        const update = function (params) {
            Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest3)
            const section = params.params.mesh;
            section.Calc_no_gfx_update();
            Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest3)

            const fps = PerformanceTimersGetFps([PERFORMANCE_TIMERS_IDXS.MiscTest3, 0])
            params.params.fps_label.text_mesh.RenderTextFromNumber(Math.trunc(fps));
            // const ms = PerformanceTimersGetMilisec([PERFORMANCE_TIMERS_IDXS.MiscTest3, 0])
            // params.params.fps_label.text_mesh.RenderTextFromNumber(ms);
        }
        update({ params: { mesh: section1, fps_label: fps_label } })
        Time_intervals_create(1, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, update, { mesh: section1, fps_label: fps_label });


        // update({params:{ mesh: section1 }})
        // Time_intervals_create(1, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, update, { mesh: section1 });
        Widget_render(section1);
    }
    // const section2 = Test_performance_align_functions_2(220, 100, num);
    // // const section2 = Test_alignment_nested_2(220, 100);

    // {


    //     const fps_label = Create_widget_label(_, '0000000', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 1], fontsize, PURPLER[1], WHITE, [20, 10], .5,);
    //     Widget_gfx_ready_enable({ mesh: fps_label, enable_sdf_rect: 10, });
    //     {
    //         section2.AddItem(fps_label);
    //         // fps_label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    //         // fps_label.GenGfxCtx();
    //         // fps_label.Render();
    //         // fps_label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, fps_label.gfx.vb.groupidx);
    //         // Construct_listen_events_from_mesh_tree(fps_label)
    //         // Construct_listen_events_relations_from_mesh_tree(fps_label)
    //     }

    //     /********************************************************************************************************************************************************/
    //     // Align
    //     const update = function (params) {
    //         Performance_timer_start(PERFORMANCE_TIMERS_IDXS.MiscTest4)
    //         const section = params.params.mesh;
    //         const ret = Align_nested_sections_pre(section);
    //         const pad_x = section.StylesGetPad(STYLES.AXIS.X);
    //         const pad_y = section.StylesGetPad(STYLES.AXIS.Y);
    //         section.geom.dim[0] = ret.dim_x + pad_x;
    //         section.geom.dim[1] = ret.dim_y + pad_y;
    //         // Align_position_pre(section);
    //         Performance_timer_stop(PERFORMANCE_TIMERS_IDXS.MiscTest4)

    //         const fps = PerformanceTimersGetFps([PERFORMANCE_TIMERS_IDXS.MiscTest4, 0])
    //         params.params.fps_label.text_mesh.RenderTextFromNumber(Math.trunc(fps));
    //         // const ms = PerformanceTimersGetMilisec([PERFORMANCE_TIMERS_IDXS.MiscTest4, 0])
    //         // params.params.fps_label.text_mesh.RenderTextFromNumber(ms);
    //     }
    //     update({ params: { mesh: section2, fps_label: fps_label } })
    //     Time_intervals_create(1, 'Mesh info tip', TIME_INTERVAL_REPEAT_ALWAYS, update, { mesh: section2, fps_label: fps_label });

    //     section2.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    //     section2.GenGfxCtx();

    //     section2.Render();
    //     // Root_group_activate_all_vbs_in_renderqueue(section2.root_bufferidx);
    //     section2.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, section2.gfx.vb.groupidx);

    //     Construct_listen_events_from_mesh_tree(section2)
    //     Construct_listen_events_relations_from_mesh_tree(section2)
    // }


}
/** */
function Test_performance_align_functions_1(x, y, num = 10) {

    const tr = 1.;
    const rcorners = 10;

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [x, y, 0], dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr) }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });

    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

    const s0 = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[7], tr) }));
    Widget_gfx_ready_enable({ mesh: s0, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    section.AddItem(s0);


    {
        const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [12, 12], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(BLACK, tr) }));
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        s0.AddItem(s1);
        for (let i = 0; i < num; i++) {
            {
                const s3 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: PURPLEB[7] })); Widget_gfx_ready_enable({ mesh: s3, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s1.AddItem(s3);

                {
                    const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: GREEN[5] })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s3.AddItem(s2);

                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                }
                {
                    const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: GREEN[5] })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s3.AddItem(s2);

                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                }
                {
                    const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: GREEN[5] })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s3.AddItem(s2);

                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); s2.AddItem(s); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); }
                }

            }
        }

    }

    return section;
}
/** */
function Test_performance_align_functions_2(x, y, num = 10) {

    const tr = 1.;
    const rcorners = 10;

    // const section = Create_rect_mesh(Style_rect_default_properties({(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 15], [365, 400, 0], [100, 100], TRANSPARENCY(BLUEL[7], tr));
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [x, y, 0], dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr), layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });

    // section.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3)

    const s0 = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[7], tr) }));
    Widget_gfx_ready_enable({ mesh: s0, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    s0.align.flags |= LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL
    section.AddItem(s0);


    {
        const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [12, 12], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(BLACK, tr) }));
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        s1.align.flags |= LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL
        s0.AddItem(s1);

        for (let i = 0; i < num; i++) {

            {
                const s3 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: PURPLEB[7], layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL })); s1.AddItem(s3);
                Widget_gfx_ready_enable({ mesh: s3, enable_sdf_rect: rcorners });
                {
                    const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: GREEN[5], layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL })); s3.AddItem(s2);
                    Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: rcorners });
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                }
                {
                    Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: rcorners });
                    const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: GREEN[5], layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL })); s3.AddItem(s2);
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                }
                {
                    Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: rcorners });
                    const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [0, 0], col: GREEN[5], layout: LAYOUT.RESIZE_SELF | LAYOUT.VERTICAL })); s3.AddItem(s2);
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                    { const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 3], dim: [0, 0], col: GREY[4] })); Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners }); s2.AddItem(s); }
                }
            }

        }

    }



    return section;
}


/** */
function CreateUniformPositionPerRenderGroups() {

    const tr = 1.;
    const rcorners1 = 10;

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [0, 400, 0], dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })


    // const red = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    // Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    // section.AddItem(red);


    // {
    //     const black = Create_rect_mesh(Style_rect_default_properties({ options: SECTION.HORIZONTAL, pad: [15, 15], pos: [0, 0, 1], dim: [20, 20], col: TRANSPARENCY(BLACK, tr), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    //     Widget_gfx_ready_enable({ mesh: black, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //     black.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF
    //     red.AddItem(black);

    //     {
    //         const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    //         Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //         black.AddItem(s);

            {
                { const s2 = Sections2(_, LAYOUT.HORIZONTAL); section.AddItem(s2); }
                { const s2 = Sections2(_, LAYOUT.HORIZONTAL); section.AddItem(s2); s2.RenderToNewRenderGroup();}
            }
    //     }
    // }




    section.GenGfxCtx();
    Align_nested_sections_pre(section);

    Widget_render(section);

    return section;
}




function CreateScrollerClampAlphaTest(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, num_items = 1, font_size = 8) {

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

    const _is_root = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? is_root : _;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: is_root, pad: [10, 10], pos: [x, y, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
        scroller: { width: 10, max_height: 100, },
    });

    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);



    // const count = colors.length;
    const count = num_items;
    let label = null;
    const brightness_increments = 1 / count;
    let brightness = 0;
    for (let i = 0; i < count; i++) {

        const l = Create_widget_label(Style_label_default_properties({ text: `${i}`, pos: [0, 0, 1], font_size: fontsize, col: Color_hsv_to_rgb_calibrated(0.7, 1., .8, 1, brightness, .0), text_pad: [6, 4], layout: LAYOUT.VERTICAL }))
        // const l = Create_widget_label(Style_label_default_properties({ text: `${i}`, pos: [0, 0, 1], font_size: fontsize, col: colors[i], text_pad: [6, 4], layout:LAYOUT.VERTICAL }))
        Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        section.AddItem(l);

        brightness += brightness_increments;
        label = l;
    }



    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GenGfxCtx();
        Align_nested_sections_pre(section)
        Widget_render(section);
    }



    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.PORTION_DIMENTION, scroller.scrolled_section);
    // Gl_framebuffer_render_mesh(FB.STATIC.ID, FRAMEBUFFER_TYPE.SCREEN_DIMENTION, scroller.scrolled_section);


    // { // Add more items to the scroller's scrolled section, to debug the correct behavior of the scroller's re-size and reposition.
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx(GFX_CTX_FLAGS.SPECIFIC, [], []);
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }
    // {
    //     const l = Create_widget_label(_, 'Label 123 DDSDSDSfsdsdsdsds', TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [400, 300, 0], 4, TRANSPARENCY(ORANGE_240_160_10, .7), WHITE, [7, 6], .5, undefined, [0, 4, 3]);
    //     l.GenGfxCtx();
    //     scroller.AddItemToScrolledSection(l);
    // }

    return section;
}
// function TestNewScrollerWithDropdown(pos = [250, 100, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

//     const text_pad = [12, 6];
//     const pad = [6, 6];
//     const font_size = 8;
//     const dp_rcorners = 7;
//     const dp_col = GREY[4];
//     const menu_col = GREY[2];


//     const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: dp_col, menu_col: menu_col, btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
//     Widget_gfx_ready_enable({
//         mesh: dp, enable_sdf_rect: dp_rcorners,
//         listener: { type: LISTEN_EVENT_TYPES.MOVE },
//         scroller: { width: 10, max_height: 100,  },
//     })


//     Dropdown_roots_set_root(dp, dp);

//     let zpos = 0;

//     zpos++

//     { // Many dps
//         const col = YELLOWR[7];

//         const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `scrolled section`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
//         Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
//         dp.AddToMenu(dpsub1);

//         const col1 = TRANSPARENCY(PURPLEB[6], 1.);
//         for (let j = 0; j < 2; j++) {

//             const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
//             Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
//             dpsub1.AddToMenu(dpsub2);

//             const col4 = TRANSPARENCY(PURPLER[6], 1.)
//             for (let m = 0; m < 10; m++) {

//                 const dpsub5 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${m}sdkaslkdalsdjaksjdkjksjdkjskd`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col4, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
//                 Widget_gfx_ready_enable({ mesh: dpsub5, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
//                 dpsub2.AddToMenu(dpsub5);

//             }
//         }
//     }



//     if (is_root & ROOT_WIDGETS.CREATE_ROOT) {


//         dp.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, _, true)
//         // dp.GenGfxCtx();
//         // dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC);
//         dp.GenGfxCtx();
//         Align_nested_sections_pre(dp)
//         dp.Render()
//         Root_group_activate_all_vbs_in_renderqueue(dp.root_bufferidx);

//         dp.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, dp.gfx.vb.groupidx)

//         Construct_listen_events_from_mesh_tree(dp)
//         Construct_listen_events_relations_from_mesh_tree(dp);

//     }


//     return dp;
// }
function TestNewScrollerWithDropdown(pos = [250, 100, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const text_pad = [12, 6];
    const pad = [6, 6];
    const font_size = 8;
    const dp_rcorners = 7;
    const dp_col = GREY[4];
    const menu_col = GREY[2];


    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: dp_col, menu_col: menu_col, btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({
        mesh: dp, enable_sdf_rect: dp_rcorners,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
        // scroller: { width: 10, max_height: 100,  },
    })


    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;

    zpos++

    { // Many dps
        const col = YELLOWR[7];

        const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `scrolled section`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
        // Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
        Widget_gfx_ready_enable({
            mesh: dpsub1, enable_sdf_rect: dp_rcorners,
            listener: { type: LISTEN_EVENT_TYPES.hover },
            scroller: { width: 10, max_height: 100, },
        })
        dp.AddToMenu(dpsub1);

        if (dpsub1.menu.scroller_comp) {
            const scrolled_section = dpsub1.menu;
            // Scoller_component_render(scrolled_section.scroller_comp)
            // Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(dpsub1.root_posidx, scrolled_section.scroller_comp.root_posidx)
            scrolled_section.AddChildScrollerIdx(scrolled_section.scroller_comp_idx);

        }

        const col1 = TRANSPARENCY(PURPLEB[6], 1.);
        for (let j = 0; j < 2; j++) {

            const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            dpsub1.AddToMenu(dpsub2);

            const col4 = TRANSPARENCY(PURPLER[6], 1.)
            for (let m = 0; m < 10; m++) {

                const dpsub5 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${m}sdkaslkdalsdjaksjdkjksjdkjskd`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col4, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({ mesh: dpsub5, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                dpsub2.AddToMenu(dpsub5);

            }
        }
    }
    // { // Many dps
    //     const col = PURPLEB[7];

    //     const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `scrolled section`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    //     // Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //     Widget_gfx_ready_enable({
    //         mesh: dpsub1, enable_sdf_rect: dp_rcorners,
    //         listener: { type: LISTEN_EVENT_TYPES.hover },
    //         scroller: { width: 10, max_height: 100,  },
    //     })
    //     dp.AddToMenu(dpsub1);

    //     if(dpsub1.menu.scroller_comp) {
    //         const scrolled_section = dpsub1.menu;
    //         // Scoller_component_render(scrolled_section.scroller_comp)
    //         // Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(dpsub1.root_posidx, scrolled_section.scroller_comp.root_posidx)
    //         scrolled_section.AddChildScrollerIdx(scrolled_section.scroller_comp_idx);

    //     }

    //     const col1 = TRANSPARENCY(PURPLEB[6], 1.);
    //     for (let j = 0; j < 2; j++) {

    //         const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    //         Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //         dpsub1.AddToMenu(dpsub2);

    //         const col4 = TRANSPARENCY(PURPLER[6], 1.)
    //         for (let m = 0; m < 10; m++) {

    //             const dpsub5 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${m}sdkaslkdalsdjaksjdkjksjdkjskd`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col4, text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    //             Widget_gfx_ready_enable({ mesh: dpsub5, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //             dpsub2.AddToMenu(dpsub5);

    //         }
    //     }
    // }



    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {


        dp.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC, _, true)
        // dp.GenGfxCtx();
        // dp.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_DSC);
        dp.GenGfxCtx();
        Align_nested_sections_pre(dp)
        Widget_render(dp);

    }


    return dp;
}
function TestNewScrollerWithLabel(pos = [20, 300, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const tr = 1.;
    const rcorners1 = 10;

    const section = Create_rect_mesh(Style_rect_default_properties({
        is_root: ROOT_WIDGETS.CREATE_ROOT, name: 'Root', pad: [10, 10], pos: pos, dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr),
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF
    }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE }, })


    const s2 = Create_rect_mesh(Style_rect_default_properties({
        pad: [10, 10], pos: [0, 0, 0], dim: [10, 10], col: TRANSPARENCY(REDL[7], tr), name: 's2',
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF
    }));
    Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    section.AddItem(s2);


    {
        const s3 = Create_rect_mesh(Style_rect_default_properties({
            pad: [15, 15], pos: [0, 0, 1], dim: [20, 20], col: TRANSPARENCY(BLACK, tr), name: 'scrolled 1',
            layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF,
            listener: { type: LISTEN_EVENT_TYPES.HOVER },
        }));
        Widget_gfx_ready_enable({ mesh: s3, enable_sdf_rect: rcorners1, scroller: { enable: true, width: 12, max_height: 50 }, })
        s2.AddItem(s3);


        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }

    }
    {
        const s3 = Create_rect_mesh(Style_rect_default_properties({
            pad: [15, 15], pos: [0, 0, 1], dim: [20, 20], col: TRANSPARENCY(BLACK, tr), name: 'scrolled 2',
            layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF,
            listener: { type: LISTEN_EVENT_TYPES.HOVER },
        }));
        Widget_gfx_ready_enable({ mesh: s3, enable_sdf_rect: rcorners1, scroller: { enable: true, }, })
        s2.AddItem(s3);

        s3.gfx_ctx_flags &= ~GFX_CTX_FLAGS.PRIVATE;
        s3.gfx_ctx_flags |= GFX_CTX_FLAGS.NEW;

        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }
        { const l = Create_widget_label(Style_label_default_properties({ text: 'label', col: YELLOWL[6], text_pad: [15, 5], texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 10, name: 'l2', listener: { type: LISTEN_EVENT_TYPES.HOVER }, layout: LAYOUT.VERTICAL, })); Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: rcorners1, }); s3.AddItem(l); }


    }





    section.GenGfxCtx();
    Align_nested_sections_pre(section);
    Widget_render(section);

    return section;
}











/**************************************************************************************************************************************/
// Widget Section Tests


let grey_cnt = 0;
let green_cnt = 0;
let orange_cnt = 0;
function Sections2(is_root, layout) {

    const tr = .7;
    const marg = [10, 10];
    const dim = [10, 10];

    layout |= LAYOUT.RESIZE_SELF

    // const grey = Create_rect_mesh(is_root, layout, marg, [0, 0, 0], dim, TRANSPARENCY(GREY[0], tr));
    const grey = Create_rect_mesh(Style_rect_default_properties({ is_root: is_root, pad: marg, pos: [0, 0, 0], dim: dim, col: TRANSPARENCY(GREY[0], tr), layout: layout, name: `grey${grey_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: grey, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });

    const green = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: marg, pos: [0, 0, 0], dim: dim, col: TRANSPARENCY(GREEN[3], tr), layout: layout, name: `green${green_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: green, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    grey.AddItem(green);

    const orange = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: marg, pos: [0, 0, 0], dim: dim, col: TRANSPARENCY(ORANGE[7], tr), layout: layout, name: `orange${orange_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: orange, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    green.AddItem(orange);

    return grey;
}
function Sections4(is_root, layout) {

    const tr = 1.;
    layout |= LAYOUT.RESIZE_SELF

    const blu = Create_rect_mesh(Style_rect_default_properties({ is_root: is_root, pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(GREY[1], tr), layout: layout, }));
    Widget_gfx_ready_enable({ mesh: blu, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });

    const red = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[1], tr), layout: layout, }));
    Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    blu.AddItem(red);

    const green = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(GREEN[6], tr), layout: layout, }));
    Widget_gfx_ready_enable({ mesh: green, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    blu.AddItem(green);

    const p = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(PURPLE[6], tr), layout: layout, }));
    Widget_gfx_ready_enable({ mesh: p, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    blu.AddItem(p);
    ;



    return blu;
}


function Help() {


    const flags = (SECTION.ITEM_FIT);

    //options, margin, pos, dim, col, name
    const section = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, LAYOUT.VERTICAL, [20, 20], [200, 5, 0], [0, 0], TRANSPARENCY(GREY[1], .8));
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

    // scene.StoreMesh(section)
    const s1 = Create_rect_mesh(_, LAYOUT.VERTICAL, [10, 10], [0, 0, 0], [0, 0], TRANSPARENCY(GREY[3], .6));
    s1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    s1.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    s1.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);

    let msgs = [];
    for (let i = 0; i < DEBUG_PRINT_KEYS.length; i++) {

        msgs[i] = '\"' + DEBUG_PRINT_KEYS[i].key + '\": ' + DEBUG_PRINT_KEYS[i].discr

        const label = Create_widget_label(_, msgs[i], TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, [0, 0, 0], 7, TRANSPARENCY(YELLOWR[7], 1.), BLACK, [7, 3], .5, [0, 4, 3]);
        label.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
        label.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);

        s1.AddItem(label)

    }


    // const minimizer = Create_widget_minimize_btn(_, section, section.geom.pos, 12);
    // minimizer.SetName('minimi')
    // section.AddItem(minimizer);

    section.AddItem(s1)


    section.GenGfxCtx();



    section.Calc_no_gfx_update();
    Widget_render(section);


    // Create_root_widget_buffer(section);
    // Create_widget_tree_from_root(section);
    // Widget_root_batch_create_from_root_children(section.root_bufferidx)


    const scroller_component = Components_create_scroller_component(_, 400, s1, Mesh_get_real_pos_y(s1),);
    Scoller_component_gengfx_and_render(scroller_component, s1);
    Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos(s1.root_posidx, scroller_component.root_posidx)
    section.AddChildScrollerIdx(s1.scroller_comp_idx);
    Scroller_component_calculate_handle_pos_dim(scroller_component);
    Listeners_set_priority(E.C, scroller_component.listeners);
    // Set scissor box
    // const mx = section.mesh_bufferidx;
    // const my = scroller_component.mesh_bufferidx;
    // const mw = section.mesh_bufferidx;
    // const mh = scroller_component.mesh_bufferidx;
    // Vertex_buffer_group_create_scissorbox(section.gfx.vb.groupidx, mx, my, mw, mh);



    // Create label animations
    for (let i = 0; i < DEBUG_PRINT_KEYS.length; i++) {

        const label = s1.children.buffer[i];
        Callback_animations_create_specific(label, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 20 });
    }



    return section;
}



let first_text_child_idx = INT_NULL; // If minimizer is anabled, have a ref to the fist text child for the text updates
function MeshInfo() {

    const fontsize = 9;
    const pad = [4, 0];
    const pos = [80, 230, 0];

    /********************************************************************************************************************************************************/
    // Info UI
    const section = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 10], pos, [0, 0], TRANSPARENCY(GREY[1], .8), 'MeshInfoUiTip');
    // const section = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [15, 10], pos, [100, 100], GREY[1], 'MeshInfoUiTip');
    section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    // section.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    section.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 10);
    section.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

    /********************************************************************************************************************************************************/
    // Menu bar and Minimizer
    const menu = Create_widget_menubar(_, pos, _, TRANSPARENCY(GREEN[4], .7), WHITE, 'Info tip', [10, 6],);
    // const menu = Create_widget_menubar(_, [80, 200, 1], [30,10], GREEN[9], WHITE, 'Info tip', [10, 6],);
    menu.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    menu.AddMinimizeButton(_, section);
    section.AddItem(menu);

    // /********************************************************************************************************************************************************/
    // // All the info text                            _, 'Meshes:', align, [0, 0, DEBUG_INFO.UI_STATS.POS[2] + 1], fontsize, GREY[7], .5, pad1
    // const infomesh = Create_widget_multi_text(_, 'Mesh name 000000000000', TEXT_ALIGN.VERTICAL, [420, 15, 100], fontsize, GREEN[7], pad, .4);
    // first_text_child_idx = section.AddItem(infomesh);

    // // For mesh-parent-rect 
    // infomesh.CreateNewText('{meshidx:0000} {rootidx:00} {groupidx:[00] vb:[00]}', fontsize, BLUE_10_120_220, pad, .9);
    // infomesh.CreateNewText('pos: [0000,0000,0] dim:[0000,0000] defpos: [0000,0000,0] defdim:[0000,0000]', fontsize, ORANGE_240_160_10, pad, .9);
    // infomesh.CreateNewText('alpha:0.00, max-size:0000', fontsize, ORANGE_240_160_10, pad, .9);
    // infomesh.CreateNewText('gfx: prog:0, vb:00, start:00000 faces:0000', fontsize, BLUE_10_120_220, pad, .9);

    // // For text_mesh
    // infomesh.CreateNewText('Text: name of the text and id', fontsize, BLUE_10_120_220, pad, .9);
    // infomesh.CreateNewText('pos: 0000,0000,0, dim: 0000,0000, alpha: 0.00', fontsize, BLUE_10_120_220, pad, .9);
    // infomesh.CreateNewText('gfx: group:0, prog:0, vb:0, start:00000, faces:00000', fontsize, BLUE_10_120_220, pad, .9);
    // infomesh.SetName('Info Mesh 2');

    // // DEBUG COUNTERS 
    // section.geom.pos[0] = VIEWPORT.RIGHT - infomesh.GetMaxWidth() * 2 - 30;
    // section.geom.pos[1] = VIEWPORT.TOP;

    // infomesh.Align_pre(infomesh, TEXT_ALIGN.VERTICAL)


    section.GenGfxCtx();
    section.Calc_no_gfx_update();
    Widget_render(section);

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

        textMesh.RenderTextFromString(Mesh_get_name(infoMesh));

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

                msgs.push(`Plain Text:${Mesh_get_name(child)}, dim: ${child.mesh_bufferidx}`);
                msgs.push(`{pos:[${FloorArr3(child.geom.pos)}]} {dim:[${child.geom.dim}]}, {alpha:${child.mat.col[3]}}`);
                msgs.push(`1gfx: prog:${child.gfx.prog.idx}, vb:${child.gfx.vb.idx}, start:${child.gfx.vb.start}, faces:${text_num_faces}`);
            }
            else if (child.text_mesh) { // Text in label or any other mesh that has text_mesh
                msgs.push(`Text_mesh: id:${child.text_mesh.mesh_bufferidx}, name:${Mesh_get_name(child.text_mesh)},`);
                msgs.push(`{pos:[${FloorArr3(child.text_mesh.geom.pos)}]}, {dim: [${child.text_mesh.geom.dim}]}, {alpha:${child.text_mesh.mat.col[3]}}`);
                msgs.push(`2gfx: {prog:${child.text_mesh.gfx.prog.idx}}, {vb:${child.text_mesh.gfx.vb.idx}}, {start:${child.text_mesh.gfx.vb.start}}, {faces:${child.text_mesh.geom.num_faces}}`);
            }
        }
        else if (infoMesh.text_mesh) {
            msgs.push(`Text_mesh: id:${infoMesh.text_mesh.mesh_bufferidx}, name:${Mesh_get_name(infoMesh.text_mesh)},`);
            msgs.push(`pos:[${FloorArr3(infoMesh.text_mesh.geom.pos)}], dim: [${FloorArr2(infoMesh.text_mesh.geom.dim)}], alpha:${infoMesh.text_mesh.mat.col[3]}`);
            msgs.push(`3gfx: prog:${infoMesh.text_mesh.gfx.prog.idx}, vb:${infoMesh.text_mesh.gfx.vb.idx}, start:${infoMesh.text_mesh.gfx.vb.start}, faces:${infoMesh.text_mesh.geom.num_faces}`);
        }

        const mouse_pos = Mouse_get_pos();

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
            // mat.EnableGfx(MAT_ENABLE.ATTR_VERTEX_COLOR, {
            //     color: [
            //         0.9, 0.0, 0.0, .4,
            //         0.0, 0.9, 0.1, .4,
            //         0.0, 0.0, 0.9, .4,
            //         0.9, 0.0, 0.9, .4
            //     ]
            // });
            const cube = new Mesh(geom, mat);
            scene.AddMesh(cube);

            console.log('cube', SID.GetTypeToString(cube.sid), cube.sid)
            cube.type |= geom.type;
            cube.type |= mat.type;
        }
        {
            const geom = new CubeGeometry([240, 450, -1], [100, 100, 100], [1, 1, 1]);
            const mat = new Material_TEMP_fromBufferFor3D(WHITE);
            // mat.EnableGfx(MAT_ENABLE.ATTR_VERTEX_COLOR, {
            //     color: [
            //         1.0, 1.0, 0.0, .4,
            //         0.0, 0.7, 0.4, .4,
            //         0.0, 1.0, 0.0, .4,
            //         1.0, 0.0, 1.0, .4,
            //     ]
            // });
            const cube2 = new Mesh(geom, mat);
            scene.AddMesh(cube2);
            console.log('cube2:', SID.GetTypeToString(cube2.sid), cube2.sid)
            cube2.type |= geom.type;
            cube2.type |= mat.type;
        }
        {
            const geom = new CubeGeometry([400, 450, -1], [100, 100, 100], [1, 1, 1]);
            const mat = new Material_TEMP_fromBufferFor3D(WHITE);
            // mat.EnableGfx(MAT_ENABLE.ATTR_VERTEX_COLOR, {
            //     color: [
            //         0.9, 0.0, 0.0, .4,
            //         0.0, 0.9, 0.1, .4,
            //         0.0, 0.0, 0.9, .4,
            //         0.9, 0.0, 0.9, .4
            //     ]
            // });
            const cube3 = new Mesh(geom, mat);
            scene.AddMesh(cube3);
            console.log('cube3:', SID.GetTypeToString(cube3.sid), cube3.sid)
            cube3.type |= geom.type;
            cube3.type |= mat.type;
        }
    }
}



function Test_shaders_test1() { // Shaders Tests

    const dim = 200
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, VIEWPORT.HEIGHT - dim * 2, 0], dim: [75 * 1, 40 * 1], col: YELLOW[9], name: 'TEST-SHADERS', }));
    Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_1);
    // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();

    Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1, 1]);



    { // Slider: unif 1
        const slider = CreateSlider(_, 10, 20, .0, 'Smooth');

        const params = {
            target_mesh: rect,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', slider_val * 2, 0);

        }, params,
        );
    }
    { // Slider: unif 2
        const slider = CreateSlider(_, 20, 100, 1.0, 'Range');

        const params = {
            target_mesh: rect,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 1);

        }, params,
        );
    }
    { // Slider: unif 2
        const slider = CreateSlider(_, 30, 200, 1.0, 'Brightness/Contrast');

        const params = {
            target_mesh: rect,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 2);

        }, params,
        );
    }

}
function Test_shaders_test3() { // Shaders Tests

    const dim = 200
    const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT - dim * 2, 0], [dim, dim], BLACK, 'TEST-SHADERS',);
    // const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
    rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_3);
    // rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();

    Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1, 1]);



    { // Slider: unif 1
        const slider = CreateSlider(_, 10, 20, .02, 'Smooth');

        const params = {
            target_mesh: rect,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', slider_val * 2, 0);

        }, params,
        );
    }
    { // Slider: unif 2
        const slider = CreateSlider(_, 20, 100, .18, 'Range');

        const params = {
            target_mesh: rect,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 1);

        }, params,
        );
    }
    { // Slider: unif 2
        const slider = CreateSlider(_, 30, 200, .18, 'Brightness/Contrast');

        const params = {
            target_mesh: rect,
        };
        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            target_mesh.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 2);

        }, params,
        );
    }

}
function Test_shaders_test2() { // Shaders Tests

    let rect1 = null;
    {
        // const dim=300
        const dim = 180
        // const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [0, VIEWPORT.HEIGHT-dim*2, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        // const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], YELLOW[9], 'TEST-SHADERS',);
        const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[1], 'TEST-SHADERS',);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        rect1 = rect;

    }
    let rect2 = null;
    {
        // const dim=300
        const dim = 180
        const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 400, 0], [100, 70], PURPLE[1], 'TEST-SHADERS',);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_2);

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx();

        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_generic_vec3', [4, 1]);

        rect2 = rect;

    }

    const params = {
        target_mesh1: rect1,
        target_mesh2: rect2,
    };

    { // Slider: unif 1
        const slider = CreateSlider(_, 10, 20, .1, 'Smooth');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            const target_mesh2 = params.clbk_params.target_mesh2;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_vec3', slider_val * 2, 0);
            target_mesh2.GfxUniformSetAndUpdate('u_generic_vec3', slider_val * 2, 0);

        }, params,
        );
    }
    { // Slider: unif 2
        const slider = CreateSlider(_, 10, 60, .0, 'Range');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            const target_mesh2 = params.clbk_params.target_mesh2;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 1);
            target_mesh2.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 1);

        }, params,
        );
    }
    { // Slider: unif 3
        const slider = CreateSlider(_, 10, 100, 1., '...');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            const target_mesh2 = params.clbk_params.target_mesh2;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 2);
            target_mesh2.GfxUniformSetAndUpdate('u_generic_vec3', slider_val, 2);

        }, params,
        );
    }
}
function Test_shaders_test4() { // Shaders Tests

    let rect1 = null;
    {
        // const dim=300
        const dim = 180
        // const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[1], 'TEST-SHADERS',);
        // const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], PURPLE[9], 'TEST-SHADERS',);
        // const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 200, 0], [dim, dim], WHITE, 'TEST-SHADERS',);
        const rect = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, _, [10, 10], [100, 300, 0], [dim, dim], BLUEL[9], 'TEST-SHADERS',);
        rect.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

        // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_TIME);
        rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
        rect.EnableGfx(MESH_ENABLE.GFX.TEST_SHADERS_4);

        // Use u_time to quicly establish a uniform for the testing
        // rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_vec3', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);
        // rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FVEC4, UNIFORM.IN_FS);
        // rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FVEC6, UNIFORM.IN_FS);
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 6);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [1, 1, 1, 1, 1, 1]);

        rect1 = rect;

    }


    const params = {
        target_mesh1: rect1,
    };

    let ypos = 20;
    const height = 45;

    { // Slider: unif 1
        const slider = CreateSlider(_, 10, ypos, 1., 'Smooth');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 0);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 2
        const slider = CreateSlider(_, 10, ypos, .98, 'Range');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 1);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 3
        const slider = CreateSlider(_, 10, ypos, 1., '...');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 2);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 4
        const slider = CreateSlider(_, 10, ypos, 1., '...');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 3);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 5
        const slider = CreateSlider(_, 10, ypos, .54, '...');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 4);

        }, params,
        );
    } ypos += height;
    { // Slider: unif 6
        const slider = CreateSlider(_, 10, ypos, .44, 'Intensity');

        // Connect sliders to gfx program uniforms 
        Slider_connect(slider, (params, slider_val) => {

            const target_mesh1 = params.clbk_params.target_mesh1;
            target_mesh1.GfxUniformSetAndUpdate('u_generic_controls', slider_val, 5);

        }, params,
        );
    } ypos += height;
}


/*******************************************************************************************************************************************************/
// Test Shader InnerShadow-RhomboidEffect wit smoothin
function Test_shader_operations_all_with_uncomment() {

    let rect1 = null;

    const control_values = [.4, .67, .5, .5, 1, 1, 1];
    // const control_values = [1, 0, .21, 1, .82, .12, .2];
    {
        // const dim=300
        const dim = 80
        // const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [, VIEWPORT.HEIGHT - dim * 2, 0], dim: [dim, dim], col: BLUEL[9], name: 'Test_shaders_Shadow_specular', }));
        // Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 80, enable_unif_scale: true })
        const ratio = 75 / 40
        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [, VIEWPORT.HEIGHT - dim * 2, 0], dim: [20 * ratio, 20], col: BLUEL[9], name: 'Test_shaders_Shadow_specular', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 10, enable_unif_scale: true, enable_src_color_in_main: true, })

        // rect.sid.pass |= SID.ATTR.WPOS3;
        // rect.sid.pass |= SID.ATTR.VPOS2;
        // rect.sid.pass |= SID.ATTR.DIM2;
        // rect.sid.attr |= SID.ATTR.DIM2;
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.DIST_RECT_FILLED      , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW           , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2          , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.SIMPLE_GLOW2_RECT     , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE                , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE                 , SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_CIRCLE   , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_GLOW_RECT       , SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.OUTER_SHADOW_RECT     , SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        // rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT2, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);
        rect.GfxUniformsSetClbk('u_generic_controls', () => { return control_values; }, rect.gfx.vb.groupidx);

        rect1 = rect;

    }

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    const controls_panel = Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect1, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 0, 0);

}
/**Test the glow effect on an sdf rect many times over with different blending modes */
function Test_shaders_operations_inner_shadow_rect() { // Shaders Tests

    let rect1 = null;
    const control_values = [.1, .3, 1., 1, 1, 1, 1, 1];
    {
        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [10, 400, 0], dim: [200, 100], col: BLUEL[9], name: 'TEST-SHADERS', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 30, })

        rect.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_scale2', [2, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);

        rect1 = rect;


    }
    {
        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [420, 400, 0], dim: [200, 100], col: BLUEL[9], name: 'TEST-SHADERS', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 100, })

        rect.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SHADOW_RECT, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);

        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_scale2', [2, 1]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);

        rect1 = rect;
    }

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect1, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 0, 0);

}
/** */
function Test_shaders_inner_shadow_rhomboid_effect_MANY_BLENDINGS() { // Shaders Tests

    let one_of_the_rects = null;


    const blend_name = [
        'ADD',
        'SUB',
        'MUL',
        'DIV',
        'LIG',
        'DAR',
        'BUR',
        'DOG',
        'MIX',
        'SCR',
        'OVE',
        'MASK',
        'ALPHA',
        'REM',
    ];


    const dim = [75 * 1.4, 40 * 1.4];

    let x = 0, y = 0;
    let flag = 0;


    for (let i = 0; i < 12; i++) {

        const label = Create_widget_label(Style_label_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, text: blend_name[i], pos: [x, y, 0], font_size: 12, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 }));
        Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 10 });
        label.GenGfxCtx(GFX_CTX_FLAGS.PRIVATE) | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL;

        Vertex_buffer_calculate_render_group_starts();
        View_render_from_view_NEW(label.group_bufferidxs[0]);

        label.GfxUniformsSetClbk('u_wposxy', Mesh_unif_get_vb_root_wpos, label.gfx.vb.groupidx);

        y += label.geom.dim[1] * 2;

        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, y, 0], dim: dim, col: BLUEL[9], name: 'Test_shaders_inner_shadow_rhomboid_effect_MANY_BLENDINGS', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 3);

        rect.GfxEnableFn(SID.SHAD.FN_INNER_SHADOW, { blend_mode: flag++ });

        // Render
        rect.GenGfxCtx();

        Widget_render(rect);


        rect.GfxUniformSetAndUpdate('u_generic_controls', [4, 1, 1]);
        rect.GfxUniformsSetClbk('u_blend_mode', () => { return rect.sid.blend_options; }, rect.gfx.vb.groupidx);

        y -= label.geom.dim[1] * 2;

        x += rect.geom.dim[0] * 2 + 20;
        if (x + rect.geom.dim[0] * 2 + 20 > VIEWPORT.WIDTH) {
            x = 0;
            y += rect.geom.dim[1] * 2 + label.geom.dim[1] * 2 + 20;
        }

        one_of_the_rects = rect;

    }

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    const controls_panel = Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(one_of_the_rects, slider_dim, [1, 1, 1], 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, y);


}
/** */
function Test_shaders_Shadow_specular() { // Shaders Tests

    let rect1 = null;
    {
        const dim = 80
        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [, VIEWPORT.HEIGHT - dim * 2, 0], dim: [dim, dim], col: BLUEL[9], name: 'Test_shaders_Shadow_specular', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: dim, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.INNER_SPECULAR_CIRCLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);


        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 7);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_generic_controls', [1, 1, 1, 1, 1, 1, 1]);

        rect1 = rect;

    }

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    const controls_panel = Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect1, slider_dim, [1, 0, .21, 1, .82, .12, .2], 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 0, 0);

}
/** */
function Test_shaders_bubble_flare() { // Shaders Tests

    {
        const dim = [100, 100]
        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Test_shaders_Shadow_specular', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 100, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);

        const control_values = [1, 1, 1, 1, .02, .99];

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
        rect.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);


        rect.GfxUniformSetAndUpdate('u_scale2', [1, 1,]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);


        const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
        Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 0, 0);
    }
    {
        const x = 250
        const dim = [100, 100]
        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Test_shaders_Shadow_specular', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 100, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_SUBTRACT);
        rect.sid.pass |= (0x1 << 12); // Make engine to create a different shader program 

        const control_values = [1, 1, 1, .03, .12, .21]

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
        rect.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_scale2', [1, 1,]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);

        const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
        Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);
    }
    {
        const x = 500
        const dim = [100, 100]
        const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Test_shaders_Shadow_specular', }));
        Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 100, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.FLARE, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
        rect.EnableGfxOperations(SID.SHADER_OPERATIONS.BUBBLE, SID.BLEND_OPTIONS.BLEND_MODE_DIVIDE);
        rect.sid.pass |= (0x1 << 11); // Make engine to create a different shader program 

        const control_values = [1, 1, 1, .01, .19, .57]

        // Use u_time to quicly establish a uniform for the testing
        rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
        rect.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);

        // Render
        rect.GenGfxCtx();
        Widget_render(rect);
        rect.GfxUniformSetAndUpdate('u_scale2', [1, 1,]);
        rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);

        const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
        Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);
    }

}




/*******************************************************************************************************************************************************/
// Test Shader Noises
/** */
function Shader_color_functions_worley_1_noise() { // Shaders Tests

    const x = 10
    const dim = [400, 400]
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Shader_color_functions_worley_1_noise', }));
    Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 100, })
    rect.GfxEnableFn(SID.SHAD.FN_NOISE_WORLEY_1, { blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_MULTIPLY });

    const control_values = [.24, 0, 1, 1]

    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();
    Widget_render(rect);

    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);
    rect.GfxUniformsSetClbk('u_time', () => { return Timer_get_global_timer() + 1; }, rect.gfx.vb.groupidx);
    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
/** */
function Shader_color_functions_worley_2_noise() { // Shaders Tests

    const x = 10
    const dim = [400, 400]
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Shader_color_functions_worley_2_noise', }));
    Widget_gfx_ready_enable({ mesh: rect, enable_sdf_rect: 100, })
    rect.GfxEnableFn(SID.SHAD.FN_NOISE_WORLEY_2, { blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });

    const control_values = [1., .89, .13, 0.04, 0.02, 0]

    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
    // rect.EnableGfxUniforms({ unif: SID.UNIF.U_SCALE_VEC2 }, 'u_scale2', UNIF_TYPE.FVEC2, UNIFORM.IN_FS);
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();
    Widget_render(rect);

    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);
    rect.GfxUniformsSetClbk('u_time', () => { return Timer_get_global_timer() + 1; }, rect.gfx.vb.groupidx);
    // rect.GfxUniformSetAndUpdate('u_time', 1);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
/** */
function Shader_color_functions_worley_3_types_noise() { // Shaders Tests

    const x = 10
    const dim = [400, 400]
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Shader_color_functions_worley_3_types_noise', }));
    // Widget_gfx_ready_enable({mesh:rect, enable_unif_scale:true, enable_sdf_rect:100,})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:10, enable_unif_time:true})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:100,})
    Widget_gfx_ready_enable({ mesh: rect, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    rect.GfxEnableAttr(SID.ATTR.DIM2);
    rect.GfxPassAttr(SID.ATTR.DIM2);
    rect.GfxEnableFn(SID.SHAD.FN_NOISE_WORLEY_3_TYPES, { blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });

    const control_values = [1, 1, 0,]

    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();
Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);
    rect.GfxUniformsSetClbk('u_time', () => { return Timer_get_global_timer() + 1; }, rect.gfx.vb.groupidx);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
/** */
function Shader_color_functions_worley_3D() { // Shaders Tests

    const x = 10
    const dim = [400, 400]
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: WHITE, name: 'Shader_color_functions_worley_3D', }));
    // Widget_gfx_ready_enable({mesh:rect, enable_unif_scale:true, enable_sdf_rect:100,})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:10, enable_unif_time:true})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:100,})
    Widget_gfx_ready_enable({ mesh: rect, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    rect.GfxEnableAttr(SID.ATTR.DIM2);
    rect.GfxPassAttr(SID.ATTR.DIM2);
    rect.GfxEnableFn(SID.SHAD.FN_NOISE_WORLEY_3D, { blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });

    const control_values = [1, 1, .5, 1, 1, 1]

    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();
Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);
    rect.GfxUniformsSetClbk('u_time', () => { return Timer_get_global_timer() + 1; }, rect.gfx.vb.groupidx);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
/** */
function Shader_color_functions_voronoi_1_noise() { // Shaders Tests

    const x = 10
    const dim = [400, 400]
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Shader_color_functions_voronoi_1_noise', }));
    // Widget_gfx_ready_enable({mesh:rect, enable_unif_scale:true, enable_sdf_rect:100,})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:10, enable_unif_time:true})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:100,})
    Widget_gfx_ready_enable({ mesh: rect, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    rect.GfxEnableAttr(SID.ATTR.DIM2);
    rect.GfxPassAttr(SID.ATTR.DIM2);
    rect.GfxEnableFn(SID.SHAD.FN_NOISE_VORONOI_1, { blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });

    const control_values = [1, 1, 0,]

    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();
Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);
    rect.GfxUniformsSetClbk('u_time', () => { return Timer_get_global_timer() + 1; }, rect.gfx.vb.groupidx);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
/** */
function Shader_color_functions_voronoi_2_noise() { // Shaders Tests

    const x = 10
    const dim = [400, 400]
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [x, VIEWPORT.HEIGHT - dim[1] * 2, 0], dim: dim, col: BLUEL[9], name: 'Shader_color_functions_voronoi_2_noise', }));
    // Widget_gfx_ready_enable({mesh:rect, enable_unif_scale:true, enable_sdf_rect:100,})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:10, enable_unif_time:true})
    // Widget_gfx_ready_enable({mesh:rect, enable_sdf_rect:100,})
    Widget_gfx_ready_enable({ mesh: rect, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    rect.GfxEnableAttr(SID.ATTR.DIM2);
    rect.GfxPassAttr(SID.ATTR.DIM2);
    rect.GfxEnableFn(SID.SHAD.FN_NOISE_VORONOI_2, { blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });

    const control_values = [1, 1, 0,]

    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_TIME_FLOAT }, 'u_time', UNIF_TYPE.FLOAT, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();
Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);
    rect.GfxUniformsSetClbk('u_time', () => { return Timer_get_global_timer() + 1; }, rect.gfx.vb.groupidx);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
// Glow Shaders
function Shader_color_functions_explosion_circle(x = 20, y = 300, w = 200, h = 200, color = BLUEL[9]) {

    const mesh = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 1], dim: [w, h], col: color, name: 'ExplosionMeshCircle', }));
    // Widget_gfx_ready_enable({ mesh: mesh, enable_src_color_in_main: false, });
    const scale_down = 1.;
    Widget_gfx_ready_enable({ mesh: mesh, enable_unif_scale: [scale_down, 1], });

    mesh.GfxEnableFn(SID.SHAD.FN_EXPLOSION_CIRCLE, { time: .2, generic: { a: .0, b: .2 } });

    // Render
    mesh.GenGfxCtx();
Widget_render(mesh);
    mesh.GfxUniformSetAndUpdate('u_scale2', [scale_down, 1.0]);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(mesh, slider_dim, _, _, ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
function Shader_color_functions_explosion_glow(x = 20, y = 300, w = 200, h = 200, color = BLUEL[9]) {

    const mesh = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 1], dim: [w, h], col: color, name: 'ExplosionMeshCircle', }));
    Widget_gfx_ready_enable({ mesh: mesh, enable_src_color_in_main: false, });

    mesh.GfxEnableFn(SID.SHAD.FN_EXPLOSION_GLOW, { time: 0 });
    const generic_parameters = [.78, .6, .86];
    mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, generic_parameters.length);

    // Render
    mesh.GenGfxCtx();
Widget_render(mesh);
    mesh.GfxUniformSetAndUpdate('u_generic_controls', generic_parameters);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(mesh, slider_dim, generic_parameters, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
function Shader_color_functions_simple_glow(x = 20, y = 300, w = 200, h = 200, color = BLUEL[9]) {

    const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [x, y, 1], dim: [w, h], col: color, name: 'ExplosionMeshCircle', }));
    Widget_gfx_ready_enable({ mesh: mesh, });

    mesh.GfxEnableFn(SID.SHAD.FN_GLOW, { time: 0, });
    const generic_parameters = [1., 0, .15];
    mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, generic_parameters.length);

    // Render
    mesh.GenGfxCtx();
Widget_render(mesh);
    mesh.GfxUniformSetAndUpdate('u_generic_controls', generic_parameters);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(mesh, slider_dim, generic_parameters, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}
function Shader_color_functions_glow_sphere(x = 20, y = 300, w = 200, h = 200, color = BLUEL[9]) {

    const mesh = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 1], dim: [w, h], col: color, name: 'ExplosionMeshCircle', }));
    Widget_gfx_ready_enable({ mesh: mesh, });

    mesh.GfxEnableFn(SID.SHAD.FN_GLOW_SPHERE);
    const generic_parameters = [1., 0, .15];
    mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, generic_parameters.length);

    // Render
    mesh.GenGfxCtx();
    Widget_render(mesh);
    mesh.GfxUniformSetAndUpdate('u_generic_controls', generic_parameters);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(mesh, slider_dim, generic_parameters, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, x, 0);

}

// UN-REIMPLEMENTED
function Shader_color_functions_blend_simple_noise_with_voronoi() { // Shaders Tests

    const dim = 200
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [10, 200, 0], dim: [dim, dim], col: YELLOW[7], name: 'SHADER_FN:WORLEY-2-NOISE', }));
    Widget_gfx_ready_enable({ mesh: rect, enable_unif_time: true, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    rect.GfxEnableFn(SID.SHAD.FN_NOISE, { time: .3, blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
    rect.GfxEnableFn(SID.SHAD.FN_NOISE_VORONOI_2, { blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ALPHA });

    const control_values = [1, 1, 0, 1, 1, 1, 1]
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

    // Render
    rect.GenGfxCtx();
    Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);

    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 10, 0);
}
function Shader_color_functions_noise_test() { // Shaders Tests

    // const dim=300
    const dim = 200
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [10, 200, 0], dim: [dim, dim], col: YELLOW[7], name: 'SHADER_FN:WORLEY-2-NOISE', }));

    rect.EnableGfxUniforms({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);

    rect.GfxEnableAttr(SID.ATTR.DIM2);

    // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 1);
    // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 2);
    // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_WORLEY, 3);
    // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 1);
    // rect.EnableGfx(MESH_ENABLE.GFX.FN_NOISE_VORONOI, 2);

    rect.GfxEnableAttr(MESH_ENABLE.GFX.ATTR_TIME, 0);
    // rect.EnableGfx(MESH_ENABLE.GFX.ATTR_DIM2);
    rect.GfxEnableFn(SID.SHAD.FN_NOISE, { time: .3, blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });
    rect.EnableGfxUniforms({ fx: SID.SHAD.FN_NOISE, }, 'u_noise_params', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // rect.EnableGfx(MESH_ENABLE.GFX.BLEND_OPTIONS, SID.BLEND_OPTIONS.BLEND_MODE_MASK);


    // Use u_time to quicly establish a uniform for the testing
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_VEC3 }, 'u_generic_controls', UNIF_TYPE.FVEC3, UNIFORM.IN_FS);

    // Render
    rect.GenGfxCtx();
    Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_controls', [.0, .02, .1]);
    // rect.GfxUniformSetAndUpdate('u_noise_params', [.0, 1, .13, 1]);


    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 10, 0);

}



function Window_menu() {

    const pos = [100, 100, 0]

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: pos, dim: [0, 0], col: TRANSPARENCY(GREY[1], 1.), layout: LAYOUT.RESIZE_SELF | LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

    const menu = Create_widget_menubar(_, [0, 0, pos[2]], [250, 0], Interpolate_rgb_to_01(0, 100, 204, 1), WHITE, 'Menu Bar', [10, 10],);
    section.AddItem(menu);
    menu.align.flags = LAYOUT.RESIZE_SELF | LAYOUT.FIXED_WIDTH
    // section.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);


    // menu.AddCloseButton(_, section, 'close', 0, GREY[1], WHITE, [4, 2], _, _, TEXTURES.DEFAULT_FONT);
    // menu.AddCloseButton(_, section, 'close', 0, GREY[1], WHITE, [4, 2], _, _, TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_1);

    const size = menu.children.buffer[0].text_mesh.geom.dim[1] * 2 + 12 / 2
    // const size = 90
    {
        // const close_btn = Create_rect_mesh(0x0, _, [5, 5], [0, 0, 0], [size, size], WHITE, 'close btn', _, _, TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_1);
        const close_btn = Create_rect_mesh(Style_rect_default_properties({ is_root: 0x0, pad: [10, 10], pos: [0, 0, 3], dim: [size, size], col: TRANSPARENCY(GREY[9], .2), texture_id: TEXTURES.MTSDF_SYMBOLS, sub_texture_id: ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.close_1, name: 'CloseBtn' }));
        Widget_gfx_ready_enable({ mesh: close_btn, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        close_btn.align.flags = LAYOUT.HORIZONTAL | LAYOUT.FLOAT_RIGHT;

        // TODO: Add an add function for vbs with MSDF and ATTR_R_CORNERS-SDF_RECT
        // close_btn.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 3);
        // close_btn.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);



        // {
        //     const btn1 = Create_rect_mesh(0x0, _, [5,5], [0,0,0], [size, size], WHITE, 'circle_1',_, _, TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._28);
        //     btn1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     btn1.align.flags = LAYOUT.HORIZONTAL|LAYOUT.FLOAT_RIGHT; 
        //     menu.AddItem(btn1); 
        // }
        // {
        //     const btn1 = Create_rect_mesh(0x0, _, [5,5], [0,0,0], [size, size], WHITE, 'circle_1',_, _, TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS._25);
        //     btn1.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
        //     btn1.align.flags = LAYOUT.HORIZONTAL|LAYOUT.FLOAT_RIGHT; 
        //     menu.AddItem(btn1); 
        // }

    }

    // { // main window panel
    //     // const panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 100], TRANSPARENCY(RGB(0, 0, 4.5, .35), 1.))
    //     // const panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 100], RGB(0, 0, 4.5, .3))
    //     const panel = Create_rect_mesh(ROOT_WIDGETS.CREATE_ROOT, SECTION.VERTICAL, [10, 10], [0, 0, 0], [0, 100], Interpolate_rgb_to_01(10, 44, 129, 1))
    //     panel.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 1);
    //     panel.EnableGfxOperations(SID.SHADER_OPERATIONS.SDF_RECT, SID.BLEND_OPTIONS.BLEND_MODE_ADD);
    //     // section.align.flags = LAYOUT.RESIZE_SELF|LAYOUT.FIXED_WIDTH;
    //     panel.align.flags = LAYOUT.RESIZE_SELF|LAYOUT.VERTICAL|LAYOUT.EXPAND|LAYOUT.FIXED_HEIGHT;
    //     section.AddItem(panel);

    //     // const msg = 'aslpkpaosdksdk\nskdskdlklskd'
    //     // const msg = 'aslpkpaosdksdk'
    //     // const text = Create_widget_label(_, msg, _, [0, 0, 1], 20, TRANSPARENCY(BLUEL[7], .0), WHITE, [0,0], _, _, TEXTURES.MTSDF_COMIC_1024, );
    //     // text.GfxUniformsEnable({ unif: SID.UNIF.ROOT_WPOS2 }, 'u_wposxy', UNIF_TYPE.FVEC2, UNIFORM.IN_VS);
    //     // text.EnableGfx(MESH_ENABLE.GFX.ATTR_FEATHER, 2);
    //     // text.EnableGfx(MESH_ENABLE.GFX.ATTR_R_CORNERS, 8);
    //     // text.align.flags = LAYOUT.HORIZONTAL;
    //     // panel.AddItem(text)
    // }

    // const close = section.children.buffer[0].children.buffer[1];

    // HERE: We want the close to be positioned float_right.
    // The menu_bar doesn't have a fixed_width but has expand.
    // // by the time the Align_nested_sections_pre() is called, the menu_bar hasn't been expanded, so the close isn't positoned float_right to the expanded rather the current menu_bar width
    /**
     * SOLUTIONS:
     * 1. We could add re-position functionality (for float_right).
     *  And the Align_expand could be called once, at the creation, set up the dimentions 
     */



    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx();

    Align_nested_sections_pre(section);
    Align_expand(section, section.align.flags,)
    Widget_render(section);
}
function Window_menu_2() {

    const pad = [10, 10];
    const menu_layout = LAYOUT.FIXED_WIDTH | LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_HORIZONTAL;
    const window_menu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: pad, dim: [VIEWPORT.WIDTH / 2 - pad[1] - 1, 0], col: TRANSPARENCY(GREY[5], .94), layout: menu_layout, name: 'window_menu' }));
    Widget_gfx_ready_enable({ mesh: window_menu, enable_sdf_rect: 4, });
    Scene_store_window_resized_meshes(window_menu.mesh_bufferidx);


    const Load_menu_btn = Create_widget_button(Style_button_default_properties({ text: 'Demos', pos: [0, 0, 1], col: GREEN[7], text_pad: [18, 8], }));
    Widget_gfx_ready_enable({ mesh: Load_menu_btn, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    window_menu.AddItem(Load_menu_btn);


    const text_pad = [12, 6];
    const font_size = 8;
    const dp_rcorners = 7;
    const dp_col = GREY[6];
    const menu_col = GREY[3];

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Menu`, pos: [0, 0, 0], col: dp_col, menu_col: menu_col, btn_col: GREY[3], text_col: WHITE, pad: pad, text_pad: text_pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners })
    window_menu.AddItem(dp);
    Dropdown_roots_set_root(dp, dp);



    const buttons_panel = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], col: TRANSPARENCY(GREY[1], .9), name: 'buttons_panel', }));
    Widget_gfx_ready_enable({ mesh: buttons_panel, enable_sdf_rect: buttons_panel.geom.dim[0] / 10 });
    dp.AddToMenu(buttons_panel);
    {
        const rcorners = 10;
        const font = TEXTURES.MTSDF_COMIC_1024;
        const text_pad = [15, 8];
        let color_index = 3;
        const color_max_count = 14 * 2, num_colors = 2, brightness = 1., alpha = 1.;


        { const button = Create_widget_button(Style_button_default_properties({ text: 'Mathematics      ', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos: [0, 0, 0], col: Get_fasma_color(color_index, color_max_count, num_colors, brightness, alpha), text_pad: text_pad, font_size: font_size, texture_id: font, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: button, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); buttons_panel.AddItem(button); Callback_animations_create_specific(button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 }); }
        color_index += 1;
        { const button = Create_widget_button(Style_button_default_properties({ text: 'Molecular Biology', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos: [0, 0, 0], col: Get_fasma_color(color_index, color_max_count, num_colors, brightness, alpha), text_pad: text_pad, font_size: font_size, texture_id: font, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: button, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); Callback_animations_create_specific(button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 }); buttons_panel.AddItem(button); }
        color_index += 1;
        { const button = Create_widget_button(Style_button_default_properties({ text: 'Chemistry        ', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos: [0, 0, 0], col: Get_fasma_color(color_index, color_max_count, num_colors, brightness, alpha), text_pad: text_pad, font_size: font_size, texture_id: font, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: button, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); Callback_animations_create_specific(button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 }); buttons_panel.AddItem(button); }
        color_index += 1;
        { const button = Create_widget_button(Style_button_default_properties({ text: 'Neuroscience     ', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos: [0, 0, 0], col: Get_fasma_color(color_index, color_max_count, num_colors, brightness, alpha), text_pad: text_pad, font_size: font_size, texture_id: font, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: button, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); Callback_animations_create_specific(button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 }); buttons_panel.AddItem(button); }
        color_index += 1;
        { const button = Create_widget_button(Style_button_default_properties({ text: 'Physics          ', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos: [0, 0, 0], col: Get_fasma_color(color_index, color_max_count, num_colors, brightness, alpha), text_pad: text_pad, font_size: font_size, texture_id: font, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: button, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); Callback_animations_create_specific(button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 }); buttons_panel.AddItem(button); }
        color_index += 1;
        { const button = Create_widget_button(Style_button_default_properties({ text: 'Biochemistry     ', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos: [0, 0, 0], col: Get_fasma_color(color_index, color_max_count, num_colors, brightness, alpha), text_pad: text_pad, font_size: font_size, texture_id: font, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: button, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); Callback_animations_create_specific(button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 }); buttons_panel.AddItem(button); }
        color_index += 1;
        { const button = Create_widget_button(Style_button_default_properties({ text: 'Genetics         ', align: TEXT_ALIGN.HOR_CENTER | TEXT_ALIGN.VERT_CENTER, pos: [0, 0, 0], col: Get_fasma_color(color_index, color_max_count, num_colors, brightness, alpha), text_pad: text_pad, font_size: font_size, texture_id: font, layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: button, enable_sdf_rect: rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); Callback_animations_create_specific(button, CALLBACK_ANIMATION_TYPE_IDX.MOVE_X, { slope_constant: .3, time_step: 0.05, ammount: 40 }); buttons_panel.AddItem(button); }
        color_index += 1;

    }


    window_menu.GenGfxCtx();
    Align_nested_sections_pre(window_menu);

    Widget_render(window_menu);


}






