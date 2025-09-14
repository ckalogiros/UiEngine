"use strict";
import { Abs, Clamp, ClampMax, Floor, FloorArr2, FloorArr3, InterpolateToRange, Lerp, Max, Max3, Min, Min3, Mult_arr3_scalar } from '../Helpers/Math/MathOperations.js';
import { Create_rect_mesh, Create_widget_button, Create_widget_dropdown, Create_widget_label, Create_widget_menubar, Create_widget_slider, Create_widget_slider_simple, Create_widget_switch_simple, Create_widget_text } from '../Engine/Drawables/Widgets/Helpers/CreateWidgetInterface.js';
import { View_activate_all_vbs_in_renderqueue, View_create_scissorbox, View_destroy_render_group_and_meshes, View_render_from_view_NEW, View_render_specific_render_group, View_render_whole_view_group_NEW, View_reset_rendering_buffer_whole_view_group } from '../Engine/Core/Views/MeshBufferViews.js';
import { Root_group_view_buffer_add_mesh, Root_group_view_buffer_get } from '../Engine/Core/Views/RootView.js';
import { GREY, BLUEL, YELLOW, YELLOWL, YELLOWR, GREEN, PURPLE, PURPLER, PURPLEB, REDL, BLACK, WHITE, ORANGE, Interpolate_rgb_to_01, COLOR_GRADIENT_VERTICAL, COLOR_GRADIENT_HORIZONTAL, RGB, RED, CYAN, BLUE, MAGENTA, ORANGER, Get_fasma_color, COLOR_THEME_BASIC, Color_hsv_to_rgb, Contrast_rgba, Luminance_rgb, Contrast_calibrated, Contrast_calibrated_rgba, Color_hsv_to_rgb_calibrated, ORANGEL } from '../Engine/Drawables/Material/Colors.js';
import { Dropdown_roots_set_root } from '../Engine/Drawables/Widgets/Widget_Dropdown.js';
import { GetSequencedColor } from '../Helpers/Helpers.js';
import { Test_alignment } from './Demo/DemoAlignNestedSections.js';
import { Widget_gfx_ready_enable, Style_button_default_properties, Style_dropdown_default_properties, Style_label_default_properties, Style_rect_default_properties, Style_slider_default_properties, Style_slider_simple_default_properties, Style_switch_default_properties, Style_text_default_properties } from '../Engine/Drawables/Widgets/Helpers/WidgetEnableProperties.js';
import { Widget_ready_label, Widget_ready_rect, Widget_ready_slider, Widget_ready_slider_simple, Widget_ready_switch } from '../Engine/Drawables/Widgets/Helpers/WidgetReadyWidgets.js';
import { Mesh_unif_connect_vb_root_wpos_with_scrollbar_root_wpos, Mesh_unif_set_vb_root_wposx } from '../Engine/Core/MeshUniformsBuffer.js';
import { Components_create_scroller_component, Components_get_scroller_component, Scoller_component_set_scrolled_section, Scoller_component_gengfx_and_render, Scoller_component_render, Scroller_component_calculate_handle_pos_dim } from '../Engine/Drawables/Widgets/ScrollerComponent.js';
import { Listeners_set_priority } from '../Engine/Events/EventListeners.js';
import { VBI_state_enable, Vertex_buffer_calculate_vertexbuffer_render_group_starts, Vertex_buffer_group_create_scissorbox, Vertex_buffer_group_get_render_groupidxs, Vertex_buffer_group_state_enable, } from '../Graphics/Buffers/VertexBuffers.js';
import { Slider_connect } from '../Engine/Drawables/Widgets/WidgetSlider.js';
import { Gl_set_angle, Gl_set_generic2, Gl_set_rgba, Gl_set_time, Gl_set_wpos_x, Gl_set_wpos_xy, Gl_set_wpos_y } from '../Graphics/Buffers/VertexBuffersOps.js';
import { Time_intervals_create } from '../Engine/Timers/TimeIntervals.js';
import { Timer_get_global_timer, Timer_get_global_timer_cosine } from '../Engine/Timers/Timers.js';
import { Create_menu_items_buttons, Demo_animations, Demo_animations_ready_button_anim, Demo_animations_ready_button_with_panel, Demo_animations_text, Demo_animations_with_slider_slope, Demo_clbk_animations_create_transition_slope, Demo_clbk_animations_text_counter, Demo_clbk_animations_text_create } from './Demo/DemoAnimations.js';
import { CALLBACK_ANIMATION_TYPE_FLAGS, CALLBACK_ANIMATION_TYPE_IDX, Callback_animations_create_specific } from '../Engine/Animations/CallbackAnimationsReadyAnimations.js';
import { Mesh_animations_create } from '../Engine/Animations/MeshAnimations.js';
import { Create_comet_particles, Create_explosion_particles, Create_glow_particles, Create_smoke_particles, Demo_glow_particles_sparkles_effect, Demo_glow_particles_explosion_shaders, Test_noise_shader } from './Demo/DemoParticles.js';
import { Debug_info_create_ui_mouse, Debug_info_ui, Debug_info_ui_fps_detailed, Debug_info_ui_static, Debug_info_ui_static_app_generic_buffers, Debug_info_ui_static_app_generic_buffers_container, Debug_info_ui_static_app_int16_buffers, Debug_info_ui_static_app_int8_buffers, Debug_info_ui_static_more_performance_timers } from '../Engine/Drawables/DebugInfo/DebugInfoUi.js';
import { Demo_complicated_widget_layout, Demo_widgets, Demo_widgets_colorpicker, Demo_widgets_colorpicker_demo_with_info, Demo_widgets_dropdown, Demo_widgets_explainer_info, Demo_widgets_msdf_text_rendering, Demo_widgets_scrolled_labels, Demo_widgets_sections } from './Demo/DemoWidgets.js';
import { Texture_metrics_get_line_height, Texture_metrics_get_sub_tex_height, Texture_metrics_get_sub_tex_width, Texture_metrics_get_texture_height } from '../Engine/Loaders/Textures/TextureUvMap.js';
import { Board_rotations } from './Demo/DemoBoardRotations.js';
import { Callback_animations_create } from '../Engine/Animations/CallbackAnimations.js';
import { App_reinitialize, App_reset } from './App.js';
import { Controls_create_slider_controls_from_shader_uniform_buffer, Controls_create_slider_controls_from_shader_uniform_buffer_with_panel } from '../Engine/Drawables/Widgets/Helpers/WidgetGenericControlsReady.js';
import { Arkanoid_initialize, Arkanoid_test_game_options } from './Demo/Games/Arkanoid/Arkanoid.js';
import { Mesh_add_and_copy_wpos_x, Mesh_add_and_copy_wpos_xy, Mesh_add_and_copy_wpos_y, Mesh_add_wpos_x, Mesh_add_wpos_xy, Mesh_get_real_pos_x, Mesh_get_real_pos_y, Mesh_rotate_z, Mesh_rotate_z_with_pivot, Mesh_set_color_rgba, Mesh_set_wpos_x, Mesh_set_wpos_xy, Mesh_set_wpos_y } from '../Engine/Drawables/Operations/MeshAttributesFunctions.js';
import { Mesh_event_callback_create, Mesh_get_name, Mesh_listener_create } from '../Engine/Drawables/Operations/MeshPropertiesFunctions.js';
import { Layout_basic_pre_render, Layout_expand_x_axis, Layout_grow_containers_pre_render, Layout_grow_containers_pre_render_with_item_reposition } from '../Engine/Drawables/Operations/AlignNestedSections.js';
import { Elastic_collisions, Sattelite_rotation } from './Demo/DemoPhysics.js';
import { Demo_page, Demos_welcome_menu } from './DemoPage.js';
import { Demo_chain_link } from './Demo/DemoChainLink.js';
import { Tetris } from './Demo/Games/Tetris/Tetris.js';
import { Game_snake } from './Demo/Games/Snake/Snake.js';
import { Scene_camera_scroll_set, Scene_store_window_resized_meshes } from '../Engine/Scenes.js';
import { Color_theme_dropdown_auto, Color_theme_label_auto, Color_theme_label_auto2, Color_theme_slider_auto, Color_theme_switch_auto } from '../Engine/Drawables/Material/Themes.js';
import { Renderqueue_set_active } from '../Engine/Renderers/Renderer/RenderQueue.js';
import { Test_find_match_from_parent_descending } from '../tests/TestsGfxContext.js';
import { Test_bitwise_from_book_run_all_tests } from '../Engine/Core/BitwiseOps_fromBookTests.js';
import { Widget_render } from '../Engine/Drawables/Widgets/Helpers/WidgetRender.js';
import { Mesh_buffer_get, Mesh_buffer_get_mesh_byidx } from '../Engine/Core/MeshBuffer.js';
import { New_int8_buffer, Test_queue_buffer } from '../Engine/Core/Buffers.js';
import { DEBUG_PRINT_KEYS } from '../Engine/Controls/Input/Keyboard.js';
import { Vertex_buffer_render_group_get_render_group } from '../Graphics/Buffers/RenderGroups.js';
import { Jump_physics } from './Demo/Games/PhysicsJump.js';
import { Spring_physics } from './Demo/Games/PhysicsSpring.js';
import { Physics2D_apply_force, Physics2D_Calculate_magnitude_local_space, Physics2D_calculate_position, Physics2D_create_object, Physics2D_test, Physics2D_update, Physics2D_update_pos_xy, Physics2D_update_pos_y, Physics_2D_get_velocity_xy_from_position } from '../Engine/Physics2D/Physics2D.js';
import { Jump_physics_2 } from './Demo/Games/PhysicsJump2.js';
import { Collision_detection_add_object, Collision_detection_create_group, Physics2D_collision_detection_all_with_all, Physics2D_collision_detection_all_with_all_with_obstructions, Physics2D_collision_detection_find_collider_from_group, Physics2D_collision_detection_one_with_all, PHYSICS2D_COLLISION_FLAGS } from '../Engine/Physics2D/CollissionDetection.js';
import { Mouse_get_pos_dif } from '../Engine/Controls/Input/Mouse.js';




const big_text = 
`Swelling, or edema, is a common reaction that follows an injury. 
It's our body's way of signaling that something's gone awry. 
When tissues get damaged, they release chemicals that trigger inflammation. 
This inflammation leads to an increase in blood flow and fluid accumulation in the affected area. 
The result? A noticeable puffiness around the injury site.

Understanding why this happens requires a peek into the biological mechanisms at play. 
When an injury occurs, whether it's a sprain, strain, or any other form of trauma, 
the body's immune system kicks into high gear. 
White blood cells rush to the site to fend off potential infections and begin the healing process. 
This influx of cells brings along fluid, which contributes to swelling. 
So, why does an injury swell? It's all about protection and healing


# The Role of Inflammation in Healing

Inflammation plays a crucial role in how injuries heal. 
It's not just about swelling; it's part of a larger process 
that involves various cellular activities aimed at repairing damaged tissues. 
After an injury, blood vessels become more permeable, 
allowing essential nutrients and immune cells to reach the affected area quickly. 
This increased permeability is what causes fluid to leak into surrounding tissues, 
leading to swelling.

The inflammatory response can be broken down into several stages. 
Initially, there's a vascular response where blood flow increases 
to deliver immune cells and nutrients. Following this is a cellular 
response where white blood cells migrate toward the injury site. 
These cells work tirelessly to clear out debris and pathogens 
while also releasing signals that further promote healing.

The visible swelling serves as a protective barrier against further damage. 
It helps immobilize the injured area, preventing unnecessary movement 
that could exacerbate the injury. So when pondering why does an injury swell? 
The answer lies in its multifaceted role in both protecting and facilitating healing.


Swelling, or edema, is a common reaction that follows an injury. 
It's our body's way of signaling that something's gone awry. 
When tissues get damaged, they release chemicals that trigger inflammation. 
This inflammation leads to an increase in blood flow and fluid accumulation in the affected area. 
The result? A noticeable puffiness around the injury site.

Understanding why this happens requires a peek into the biological mechanisms at play. 
When an injury occurs, whether it's a sprain, strain, or any other form of trauma, 
the body's immune system kicks into high gear. 
White blood cells rush to the site to fend off potential infections and begin the healing process. 
This influx of cells brings along fluid, which contributes to swelling. 
So, why does an injury swell? It's all about protection and healing


# The Role of Inflammation in Healing

Inflammation plays a crucial role in how injuries heal. 
It's not just about swelling; it's part of a larger process 
that involves various cellular activities aimed at repairing damaged tissues. 
After an injury, blood vessels become more permeable, 
allowing essential nutrients and immune cells to reach the affected area quickly. 
This increased permeability is what causes fluid to leak into surrounding tissues, 
leading to swelling.

The inflammatory response can be broken down into several stages. 
Initially, there's a vascular response where blood flow increases 
to deliver immune cells and nutrients. Following this is a cellular 
response where white blood cells migrate toward the injury site. 
These cells work tirelessly to clear out debris and pathogens 
while also releasing signals that further promote healing.

The visible swelling serves as a protective barrier against further damage. 
It helps immobilize the injured area, preventing unnecessary movement 
that could exacerbate the injury. So when pondering why does an injury swell? 
The answer lies in its multifaceted role in both protecting and facilitating healing.


Swelling, or edema, is a common reaction that follows an injury. 
It's our body's way of signaling that something's gone awry. 
When tissues get damaged, they release chemicals that trigger inflammation. 
This inflammation leads to an increase in blood flow and fluid accumulation in the affected area. 
The result? A noticeable puffiness around the injury site.

Understanding why this happens requires a peek into the biological mechanisms at play. 
When an injury occurs, whether it's a sprain, strain, or any other form of trauma, 
the body's immune system kicks into high gear. 
White blood cells rush to the site to fend off potential infections and begin the healing process. 
This influx of cells brings along fluid, which contributes to swelling. 
So, why does an injury swell? It's all about protection and healing


# The Role of Inflammation in Healing

Inflammation plays a crucial role in how injuries heal. 
It's not just about swelling; it's part of a larger process 
that involves various cellular activities aimed at repairing damaged tissues. 
After an injury, blood vessels become more permeable, 
allowing essential nutrients and immune cells to reach the affected area quickly. 
This increased permeability is what causes fluid to leak into surrounding tissues, 
leading to swelling.

The inflammatory response can be broken down into several stages. 
Initially, there's a vascular response where blood flow increases 
to deliver immune cells and nutrients. Following this is a cellular 
response where white blood cells migrate toward the injury site. 
These cells work tirelessly to clear out debris and pathogens 
while also releasing signals that further promote healing.

The visible swelling serves as a protective barrier against further damage. 
It helps immobilize the injured area, preventing unnecessary movement 
that could exacerbate the injury. So when pondering why does an injury swell? 
The answer lies in its multifaceted role in both protecting and facilitating healing.


Swelling, or edema, is a common reaction that follows an injury. 
It's our body's way of signaling that something's gone awry. 
When tissues get damaged, they release chemicals that trigger inflammation. 
This inflammation leads to an increase in blood flow and fluid accumulation in the affected area. 
The result? A noticeable puffiness around the injury site.

Understanding why this happens requires a peek into the biological mechanisms at play. 
When an injury occurs, whether it's a sprain, strain, or any other form of trauma, 
the body's immune system kicks into high gear. 
White blood cells rush to the site to fend off potential infections and begin the healing process. 
This influx of cells brings along fluid, which contributes to swelling. 
So, why does an injury swell? It's all about protection and healing


# The Role of Inflammation in Healing

Inflammation plays a crucial role in how injuries heal. 
It's not just about swelling; it's part of a larger process 
that involves various cellular activities aimed at repairing damaged tissues. 
After an injury, blood vessels become more permeable, 
allowing essential nutrients and immune cells to reach the affected area quickly. 
This increased permeability is what causes fluid to leak into surrounding tissues, 
leading to swelling.

The inflammatory response can be broken down into several stages. 
Initially, there's a vascular response where blood flow increases 
to deliver immune cells and nutrients. Following this is a cellular 
response where white blood cells migrate toward the injury site. 
These cells work tirelessly to clear out debris and pathogens 
while also releasing signals that further promote healing.

The visible swelling serves as a protective barrier against further damage. 
It helps immobilize the injured area, preventing unnecessary movement 
that could exacerbate the injury. So when pondering why does an injury swell? 
The answer lies in its multifaceted role in both protecting and facilitating healing.`;







export function TestWidgetsGeneric() {


    let ypos = 0
    let xpos = 10


    /** Some testing */
    // Test_queue_buffer();


    // const section = Test_adding_mesh_to_a_view_group_after_has_been_rendered();

    // Test_on_hover_show_info(200, 300);
    
    // const a = .8
    // const menu = Test_colored_labels_with_hsv(0, 10, 20, .2, a);
    // const w = menu.geom.dim[0]*2;
    // Test_colored_labels_with_hsv((w*1), 10, 20, .3, a);
    // Test_colored_labels_with_hsv((w*2), 10, 20, .4, a);
    // Test_colored_labels_with_hsv((w*3), 10, 20, .5, a);
    // Test_colored_labels_with_hsv((w*4), 10, 20, .6, a);
    // Test_colored_labels_with_hsv((w*5), 10, 20, .7, a);
    // Test_colored_labels_with_hsv((w*6), 10, 20, .8, a);
    // Test_colored_labels_with_hsv((w*7), 10, 20, .9, a);
    // Test_colored_labels_with_hsv((w*8), 10, 20, 1., a);

    // Test_colored_labels_with_hsv((w*9), 10, 20, .1, .1);
    // Test_colored_labels_with_hsv((w*10), 10, 20, .2, .2);
    // Test_colored_labels_with_hsv((w*11), 10, 20, .3, .3);
    // Test_colored_labels_with_hsv((w*12), 10, 20, .4, .4);
    // Test_colored_labels_with_hsv((w*13), 10, 20, .5, .5);
    // Test_colored_labels_with_hsv((w*14), 10, 20, .6, .6);
    // Test_colored_labels_with_hsv((w*15), 10, 20, .7, .7);
    // Test_colored_labels_with_hsv((w*16), 10, 20, .8, .8);
    // Test_colored_labels_with_hsv((w*17), 10, 20, .9, .9);



    let yy = 0, pp = 23;
    { // Statistics
        const d0 = Debug_info_ui_static(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d0.geom.dim[1] * 2
        // const d1 = Debug_info_ui_fps_detailed(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d1.geom.dim[1] * 2
        // const d2 = Debug_info_ui_static_more_performance_timers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d2.geom.dim[1]*2
        // const d4 = Debug_info_create_ui_mouse(_, _, yy); yy += d4.geom.dim[1] * 2
        // const d5 = Debug_info_ui_static_app_generic_buffers_container(ROOT_WIDGETS.CREATE_ROOT, 0, yy);yy += d5.geom.dim[1]*2
        // const d6 = Debug_info_ui_static_app_generic_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d6.geom.dim[1]*2
        // const d7 = Debug_info_ui_static_app_int16_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d7.geom.dim[1]*2
        // const d8 = Debug_info_ui_static_app_int8_buffers(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d8.geom.dim[1]*2
        // const d3 = Debug_info_ui(ROOT_WIDGETS.CREATE_ROOT, 0, yy); yy += d3.geom.dim[1]*2
    }


    // Test: New implementation -> VB render groups PLUS reset (by group) and rerender (by rendergroup) 
    // Test_create_render_groups_resize_and_rerender();
    // Test_create_remove_render_groups();





    // Demo_page();
    // Demos_welcome_menu();

    { // Games
        // Arkanoid_initialize(0);
        // Arkanoid_test_game_options();

        // Tetris(ROOT_WIDGETS.CREATE_ROOT, 20, 132);
        // Game_snake(45, true, true);
    }

    { // Quick widget enable
        // CreateSimpleWidgetText(120, 280)
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 100, _, _, _, 18);
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 100, _, _, _, 18);
        // CreateLabel(_, '||||||\n|||||||||||||||||||||||||||||||\n|||||||', TEXTURES.MTSDF_CONSOLAS_1024, _, 20, 300, _, _, _, 60);
        // CreateLabel(_, '||||||||||||||||||||||||||||', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 100, _, _, _, 30);
        // CreateLabel(_, '||||||||||||||||||||||||||||', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 100, _, _, _, 10);
        // CreateLabel(_, 'AAAA', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 180, _, _, _, 18);
        // CreateLabel(_, 'AAAAAAAAAAAA\nAAAAAAAAAAAA', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 100, _, _, _, 18);
        // const label = CreateLabel(_, 'QPKJDHBSIUIJDKJKDJKDUDJ<', TEXTURES.MTSDF_COMIC_1024, _, 300, 100, _, _, _, 18);
        // CreateSliderSimple();
        // Widget_ready_slider(ROOT_WIDGETS.CREATE_ROOT, 100, 100, _, 'Ready Slider', _,)
        // CreateDropdownTree([100, 200, 0])
        // CreateScrollerClampAlphaTest(_, 100, 400, 1000, 12)
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 500, 140, _, _, _, _, _, _, 0x0);
        // const line = Test_rotate_section_with_round_corners();
 
    }

    { // Test many render groups
        // const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [100, 200, 0], dim: [100, 100], col: TRANSPARENCY(GREY[1], 1), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
        // Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })

        // const label = CreateLabel(0x0, '|',  TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 100, _, _, _, 30);
        // section.AddItem(label);
        
        // const dp = CreateDropdownTree([100, 200, 0], 0x0);
        // section.AddItem(dp);

        // section.GenGfxCtx();
        // Layout_basic_pre_render(section);
        // Widget_render(section);
    }

    { // Test: Tool-tip info
        // const info_panel = Create_info_panel_tool_tip(10, 600);
        // // const event_clbk_params = {
        // //     Clbk: (params) => {
        // //         // ISN"T CALLED IF A RESOLVE FUNCTION IS PASSED IN:Mesh_event_callback_create()
        // //     },
        // //     clbk_params: {
        // //         info_panel: info_panel,
        // //     },
        // // }
        // const Clbk = (params) => {
        //         // ISN"T CALLED IF A RESOLVE FUNCTION IS PASSED IN:Mesh_event_callback_create()
        //     };
        // const clbk_params = {
        //         info_panel: info_panel,
        //     };
        
        // let k = 0, y=50;
        // { 
        //     const section = Create_rect_mesh(Style_rect_default_properties({ 
        //         is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10,10], 
        //         pos: [200,300,0], dim: [0,0], col: GREY[2], 
        //         name: 'InfoPanel', layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF,
        //     }));
        //     Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })

        //     for(let i=0; i<13; i++){
        //         const label = Create_widget_label(Style_label_default_properties({
        //             pos: [200, 300, 0], col: Color_hsv_to_rgb_calibrated(.73, 1, 1, 1, .4, 0), text_pad: [12, 8], text: `label${k++}`,
        //             texture_id: TEXTURES.MTSDF_COMIC_1024, font_size: 10, layout: LAYOUT.VERTICAL, 
        //         }));
        //         Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 4, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        //         section.AddItem(label);
        //         Mesh_event_callback_create(label, Clbk, clbk_params, Resolve_mesh_info_tool_tip);
        //     }

        //     section.GenGfxCtx();
        //     Layout_basic_pre_render(section);
        //     Widget_render(section);

        // }

    }

    { // Physics2D Engine

        // Test_physics2D_collision_detection_many_rects();
        // Test_physics2D_collision_detection_obstract_collider();
        // Test_physics2D_collision_detection_2_rects_sweptAABB_with_debug();
        
        // Jump_physics();
        // Spring_physics();
        // Jump_physics_2();
    }


    /*************************************************************************************************************************/
    // Test: Layout
    {
        // Test_alignment();
        // TestAlignNew([0, 200, 0])
        // Test_align_many_sliders();

        // Test_resize_fill_space_layout();
        // Test_resize_fill_space_layout_nested(_, 0);
        // Test_resize_fill_space_layout_nested_with_widgets();

        // Test_resize_layout_grow_containers_1();
        // Test_resize_layout_grow_containers_2();
        // Test_resize_layout_grow_containers_3();
        // Test_resize_layout_grow_containers_4();
        // Test_resize_layout_grow_containers_5();
        // Test_resize_layout_grow_containers_many();
        // Test_resize_layout_grow_containers_many_compound();
    }


    /*************************************************************************************************************************/
    // Test Widgets
    { // widget plain text
        // CreateSimpleWidgetText(200, 200)
        // CreateTextInSectionWithNewLine();
        // CreateTextInSection(big_text, 5)
    }

    { // Widget: Label-buttons

        // const w = 45 
        // CreateLabel(_, '0', TEXTURES.MTSDF_CONSOLAS_1024, _, w, 100,_,_,_, 25);
        // CreateLabel(_, '0\n1\n2', TEXTURES.MTSDF_CONSOLAS_1024, _, w*2, 100,_,_,_, 25);
        // CreateLabel(_, '0\n1\n2\n3', TEXTURES.MTSDF_CONSOLAS_1024, _, w*3, 100,_,_,_, 25);
        // CreateLabel(_, '0\n1\n2\n3\n4', TEXTURES.MTSDF_CONSOLAS_1024, _, w*4, 100,_,_,_, 25);
        // CreateLabel(_, '0\n1\n2\n3\n4\n5', TEXTURES.MTSDF_CONSOLAS_1024, _, w*5, 100,_,_,_, 25);
        // CreateLabel(_, '0\n1\n2\n3\n4\n5\n6', TEXTURES.MTSDF_CONSOLAS_1024, _, w*6, 100,_,_,_, 25);
        // CreateLabel(_, '0\n1\n2\n3\n4\n5\n6\n7', TEXTURES.MTSDF_CONSOLAS_1024, _, w*7, 100,_,_,_, 25);
        // CreateLabel(_, 'Qr|\`\'0123456789', TEXTURES.MTSDF_CONSOLAS_1024, _, 5, 400,_,_,_, 65);
        // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n|_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700,_,_,_,38);
        // CreateLabel(_, '|_A\n|_a', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 700,_,_,_,38);
        // // CreateLabel(_, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_COMIC_1024, _, 300, 700,_,_,_,18);
        // // CreateLabel(_, '| Initializing Graphics.', TEXTURES.CONSOLA_VARIANT_FONT, ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S10_0, 300, 50,_,_,_,75,);
        // CreateLabel(_, 'Widget_Label\n12345\nppao918827', TEXTURES.MTSDF_CONSOLAS_1024, _, 300, 50,_,_,_);
        // CreateLabel(_, 'Widget_Label\n12345\nppao918827', TEXTURES.CONSOLA_VARIANT_FONT, ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S1_5, 300, 190, _, _, _);
        // Widget_ready_label(ROOT_WIDGETS.CREATE_ROOT, '|_A_B_C_D_E_F_G_H_J_T_Y_U\n_a_b_c_d_e_f_g_h_i_t_r', TEXTURES.MTSDF_CONSOLAS_1024, 300, 100,18,_,_,_);

        // Render font symbols atlas texture
        // Render_font_symbols_atlas_texture(30, 50);    
        // { const s = TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 750, 100, [40, 40], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_clockwise); s.align.flags = LAYOUT.VERTICAL; }
        // { const s = TexturedRect(ROOT_WIDGETS.CREATE_ROOT, _, 750, 100, [40, 40], WHITE, [0, 0], TEXTURES.MTSDF_SYMBOLS, ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.arrow_anti_clockwise); s.align.flags = LAYOUT.VERTICAL; }

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

        // CreateUniformPositionPerRenderGroups();

    }

    { // Widget: Dropdown

        // CreateDropdownTree([30, 50, 0])
        // Create_dropdown_hsv_coloring([30, 50, 0]);
        
        // CreateDropdownTreeHorizontalLayout();
        
        // Demo_complicated_widget_layout(0, 200)
    }

    { // Widget: Scroller

        // const scroller = CreateScrollerClampAlphaTest(_, 30, 100, 10, 16);
        // CreateScrollerManyWidgets(_, 30, 100, 10, 16);
        // CreateScrollerDeepNested(_, 30, 100, 10, 16);
        // CreateDropdownWithScroller(_, 30, 100, 10, 16);
        // const widget = CreateDropdownWithScrollerManyDps(_, 30, 100, 10, 10);
        
        // Create_mesh_info_ui(_, 230, 100, 10, 10, widget.group_bufferidxs[0]);

    }

    { // Widget: Colorpicker

        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 100, 100, _, _, _, _, _, _, 0x0);

        /** Colorpicker Instanced Geometry*/
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, SID.ATTR.WPOS3|SID.ATTR.DIM2)
        // Demo_widgets_colorpicker(ROOT_WIDGETS.CREATE_ROOT, 0, 100, _, _, _, _, _, _, SID.ATTR.DIM2)

    }

    { // Window menu
        // Window_menu_2();
    }
    
    { // Instanced Geometry

        // Instanced_geometry(GREEN[7], [100, 100, 5], [300, 300], );
    }

    { // Annimations

        { // Rotation: Rotate sdf line. Dont forget to disable the 'style' attribute
            // Test_rotate_section_with_round_corners();
            
            // Rotatable_section_with_rcorners_via_attribute_rotation();
            // Rotatable_section_adjustable_pivotal_rotation();
            // Rotatable_section_with_rcorners_via_uniform_rotation();

            // Pivotal_rotation_horizontal_2mesh_rigging();
            // Pivotal_rotation_vertical_2mesh_rigging();
            // Pivotal_robot_rigging(100, 100);
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

            Demo_glow_particles_explosion_shaders(VIEWPORT.RIGHT-270, 0, ROOT_WIDGETS.CREATE_ROOT, _, true, 80,);

            // Demo_glow_particles_sparkles_effect(VIEWPORT.RIGHT-270, 0, ROOT_WIDGETS.CREATE_ROOT, _, true, 1);

            // Create_explosion_particles(0, 0, ROOT_WIDGETS.CREATE_ROOT, true, 64)

            // Create_smoke_particles();

            // Create_comet_particles(100, 100, 300, 300, 1, ROOT_WIDGETS.CREATE_ROOT, true, 28, );
            // Create_comet_particles(100, 100, 300, 300, 1, ROOT_WIDGETS.CREATE_ROOT, false, 28, );

            // Test_noise_shader(); // NOT IMPLEMENTED

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
                // Board_rotations(0, 0, ROOT_WIDGETS.CREATE_ROOT, .05, 12, 14, 35, true, );
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
                // const HUE_COLOR = [ RED[9], RED[9], YELLOW[9], YELLOW[9],GREEN[9], GREEN[9],CYAN[9], CYAN[9],BLUE[9], BLUE[9],MAGENTA, MAGENTA,BLACK, BLACK,WHITE, WHITE,BLACK, BLACK,];
                // // const HUE_COLOR = [ BLUE[9], BLUE[9], CYAN[9], CYAN[9], ];
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

    //////////////////////////////////////////////////////////////////////////////////
    // NOT YET TESTED AND CORRECTED WITH NEW WIDGET CREATION STYLE
    //////////////////////////////////////////////////////////////////////////////////

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
    // const helpui = Help();

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

/* Test collision detection: 2 rects with mouse move. Collision detection: sweptAABB */
function Test_physics2D_collision_detection_2_rects_sweptAABB_with_debug() { 

    const panel_width = 500, panel_height = 400;
    const panel_x = 50, panel_y = 60;
    const panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [panel_x, panel_y, 0], dim: [panel_width, panel_height], col: GREY[1],  }));
    Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: 10, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP}});
    
    
    const coll_group_idx = Collision_detection_create_group('test');

    const debug_info = {
        near_dx  : null, far_dx   : null, near_dy  : null, far_dy   : null,
        near_xt  : null, far_xt   : null, near_yt  : null, far_yt   : null,
        near_t  : null, far_t   : null,

        penet_x: null, penet_y: null,

        x1    : null,
        x2    : null,
        y1    : null,
        y2    : null,
        axis  : 'o',
    };

    let mesh1 = null, mesh2 = null;


    const size = 40;
    let hue = .12;

    // Colliding Meshes
    {
        const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [100, 100], dim: [50,50], col: Color_hsv_to_rgb(hue,1,1,1,.7,0),  name:'mesh1'}));
        Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 5, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}});
        panel.AddItem(mesh);
        mesh.physics.idx = Physics2D_create_object(mesh.geom.pos[0], mesh.geom.pos[1]);
        mesh.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, mesh, mesh.physics.idx, PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE);
        mesh1 = mesh;
    }
    {
        // const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [panel_x+panel_width/2-size, panel_y+panel_height/2+size], dim: [size, size], col: Color_hsv_to_rgb(hue,1,1,1,.7,0),  name:'mesh2'}));
        // const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [panel_x+panel_width/2, panel_y+panel_height/2], dim: [size, size], col: Color_hsv_to_rgb(.25,1,1,1,.7,0),  name:'mesh2'}));
        const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [panel_x+panel_width/2, panel_y+panel_height/2], dim: [10, 100], col: Color_hsv_to_rgb(.25,1,1,1,.7,0),  name:'mesh2'}));
        Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 5, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}});
        panel.AddItem(mesh);
        mesh.physics.idx = Physics2D_create_object(mesh.geom.pos[0], mesh.geom.pos[1]);
        mesh.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, mesh, mesh.physics.idx, PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE);
        mesh2 = mesh;
    }


 

    { // Text Info Display
        let w = 220, h = 30;
        const tex_id = TEXTURES.MTSDF_COMIC_1024;
        // Distance
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*0, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'neardx    0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_dx = text_info;  }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*0, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'fardx     0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_dx = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*1, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'neardy    0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_dy = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*1, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'fardy     0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_dy = text_info; }
    
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*2, h*0, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'penet_x  0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.penet_x = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*2, h*1, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'penet_y  0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.penet_y = text_info; }
    
        // Time
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*2, 0], col: YELLOW[9], texture_id: tex_id, font_size: 8, text: 'near_xt  0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_xt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*2, 0], col: YELLOW[9], texture_id: tex_id, font_size: 8, text: 'far_xt   0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_xt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*3, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'near_yt 0.000000000',})); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_yt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*3, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'far_yt  0.000000000',})); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_yt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*4, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'NT:     0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_t = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*4, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'FT      0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_t = text_info; }
    
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*5, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'Axis -0000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.axis = text_info; }
    
    
        // Rect Posiotions
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [0, 750, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'rect1 x  0000.00', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.x1 = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [180, 750, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'y: 0000.00',     })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.x2 = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [0, 780, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'rect2 x  0000.00', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.y1 = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [180, 780, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'y  0000.00',     })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.y2 = text_info; }
    }

    panel.GenGfxCtx();
    Widget_render(panel);

    


    const params = {
        collision_group_idx:coll_group_idx,
        debug_info_struct:debug_info,
        mesh1:mesh1,
        mesh2:mesh2,
    };
    Time_intervals_create(16, 'Test physics2D', TIME_INTERVAL_REPEAT_ALWAYS, (params)=>{

        const collision_group_idx = params.params.collision_group_idx;

        /** For the collision detection we assume all meshes have their velocity reseted on each frame
         * So to find the mesh that is moved (by the user), we check which mesh has a none zero velocity(either x or y)
         */

        const grabbed_mesh_idx = Physics2D_collision_detection_find_collider_from_group(collision_group_idx);
        if(grabbed_mesh_idx !== INT_NULL) var debug_info = Physics2D_collision_detection_all_with_all(collision_group_idx, grabbed_mesh_idx);
        // if(grabbed_mesh_idx !== INT_NULL) Physics2D_collision_detection_all_with_all_with_obstructions(collision_group_idx, grabbed_mesh_idx);

        if(debug_info) {
            params.params.debug_info_struct.near_dx.RenderTextFromString(`neardx   ${debug_info.near_dx.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_dx.RenderTextFromString( `fardx    ${debug_info.far_dx.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.near_dy.RenderTextFromString(`neardy   ${debug_info.near_dy.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_dy.RenderTextFromString( `fardy    ${debug_info.far_dy.toFixed(2)}`, true); // Change the text to the new info

            params.params.debug_info_struct.penet_x.RenderTextFromString(`penet_x   ${debug_info.penetration_depth_y.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.penet_y.RenderTextFromString(`penet_y    ${debug_info.penetration_depth_x.toFixed(2)}`, true); // Change the text to the new info

            params.params.debug_info_struct.near_xt.RenderTextFromString( `Ntimex  ${(debug_info.near_xt.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_xt.RenderTextFromString(  `Ftimex  ${(debug_info.far_xt.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.near_yt.RenderTextFromString( `Ntimey  ${(debug_info.near_yt.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_yt.RenderTextFromString(  `Ftimey  ${(debug_info.far_yt.toFixed(2))}`, true); // Change the text to the new info

            params.params.debug_info_struct.near_t.RenderTextFromString(  `NT  ${(debug_info.near_t.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_t.RenderTextFromString(   `FT  ${(debug_info.far_t.toFixed(2))}`, true); // Change the text to the new info

            params.params.debug_info_struct.axis.RenderTextFromString(   `Axis  ${debug_info.axis}`, true); // Change the text to the new info

        }
        
        const x1 = params.params.mesh1.geom.pos[0];
        const y1 = params.params.mesh1.geom.pos[1];
        const x2 = params.params.mesh2.geom.pos[0];
        const y2 = params.params.mesh2.geom.pos[1];
        params.params.debug_info_struct.x1.RenderTextFromString( `rect1 x: ${x1.toFixed(2)}`, true); // Change the text to the new info
        params.params.debug_info_struct.x2.RenderTextFromString( `y: ${y1.toFixed(2)}`, true); // Change the text to the new info
        params.params.debug_info_struct.y1.RenderTextFromString( `rect2 x: ${x2.toFixed(2)}`, true); // Change the text to the new info
        params.params.debug_info_struct.y2.RenderTextFromString( `y: ${y2.toFixed(2)}`, true); // Change the text to the new info


    }, params);

}
function Test_physics2D_collision_detection_many_rects() { 

    const panel_width = 300, panel_height = 400;
    const panel_x = 60, panel_y = 60;
    const panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [panel_x, panel_y, 0], dim: [panel_width, panel_height], col: GREY[1],  }));
    Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: 10, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP}});
    
    
    const coll_group_idx = Collision_detection_create_group('test');

    const debug_info = {
        near_dx  : null, far_dx   : null, near_dy  : null, far_dy   : null,
        near_xt  : null, far_xt   : null, near_yt  : null, far_yt   : null,
        near_t  : null, far_t   : null,

        penet_x: null, penet_y: null,

        x1    : null,
        x2    : null,
        y1    : null,
        y2    : null,
        axis  : '-0',
    };

    const debug_meshes = [];
    
    
    // const num_meshes = 80; 
    // const size = 20;
    const num_meshes = 20; 
    const size = 50;
    let x = 200, y = 140;
    let hue = .12;
    let v_size = size;
    for(let i = 0; i < num_meshes; i++) {

        if(i===0) v_size = 0
        else v_size = size

        // const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [x, y], dim: [v_size, 20], col: Color_hsv_to_rgb(hue,1,1,1,.7,0),  name:`${i}`}));
        const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [x, y+10], dim: [v_size, v_size], col: Color_hsv_to_rgb(hue,1,1,1,.7,0),  name:`${i}`}));
        Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 5, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}});
        panel.AddItem(mesh);
        mesh.physics.idx = Physics2D_create_object(mesh.geom.pos[0], mesh.geom.pos[1]);
        mesh.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, mesh, mesh.physics.idx, PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE);

        debug_meshes.push(mesh);

        hue += .2; // Change color
        y += v_size*2+10
        if(y>600){
            x += v_size*2+20;
            y = 20
        }
    }

    {
    //     const barier_width = 10;
    //     /** */
    //     const left_barier = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0], dim: [barier_width, panel_height-barier_width], col: Color_hsv_to_rgb(0,0,1,.18,0,0),  name:'left_barier'}));
    //     Widget_gfx_ready_enable({ mesh: left_barier, enable_sdf_rect: 5, });
    //     panel.AddItem(left_barier);
    //     left_barier.physics.idx = Physics2D_create_object(left_barier.geom.pos[0], left_barier.geom.pos[1]);
    //     left_barier.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, left_barier, left_barier.physics.idx);
    //     /** */
    //     const top_barier = Create_rect_mesh(Style_rect_default_properties({ pos: [barier_width*2, 0], dim: [panel_width-barier_width, barier_width], col: Color_hsv_to_rgb(0,0,1,.18,0,0),  name:'top_barier'}));
    //     Widget_gfx_ready_enable({ mesh: top_barier, enable_sdf_rect: 5, });
    //     panel.AddItem(top_barier);
    //     top_barier.physics.idx = Physics2D_create_object(top_barier.geom.pos[0], top_barier.geom.pos[1]);
    //     top_barier.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, top_barier, top_barier.physics.idx);
    //     /** */
    //     const right_barier = Create_rect_mesh(Style_rect_default_properties({ pos: [panel_width*2-barier_width*2, barier_width*2], dim: [barier_width, panel_height-barier_width], col: Color_hsv_to_rgb(0,0,1,.18,0,0),  name:'right_barier'}));
    //     Widget_gfx_ready_enable({ mesh: right_barier, enable_sdf_rect: 5});
    //     panel.AddItem(right_barier);
    //     right_barier.physics.idx = Physics2D_create_object(right_barier.geom.pos[0], right_barier.geom.pos[1]);
    //     right_barier.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, right_barier, right_barier.physics.idx);
    //     /** */
    //     const bottom_barier = Create_rect_mesh(Style_rect_default_properties({ pos: [0, panel_height*2-barier_width*2], dim: [panel_width-barier_width, barier_width], col: Color_hsv_to_rgb(0,0,1,.18,0,0),  name:'bottom_barier'}));
    //     Widget_gfx_ready_enable({ mesh: bottom_barier, enable_sdf_rect: 5});
    //     panel.AddItem(bottom_barier);
    //     bottom_barier.physics.idx = Physics2D_create_object(bottom_barier.geom.pos[0], bottom_barier.geom.pos[1]);
    //     bottom_barier.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, bottom_barier, bottom_barier.physics.idx);
    }


    { // Text Info Display
        let w = 220, h = 30;
        const tex_id = TEXTURES.MTSDF_COMIC_1024;
        // Distance
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*0, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'neardx    0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_dx = text_info;  }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*0, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'fardx     0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_dx = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*1, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'neardy    0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_dy = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*1, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'fardy     0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_dy = text_info; }
    
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*2, h*0, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'penet_x  0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.penet_x = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*2, h*1, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'penet_y  0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.penet_y = text_info; }
    
        // Time
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*2, 0], col: YELLOW[9], texture_id: tex_id, font_size: 8, text: 'near_xt  0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_xt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*2, 0], col: YELLOW[9], texture_id: tex_id, font_size: 8, text: 'far_xt   0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_xt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*3, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'near_yt 0.000000000',})); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_yt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*3, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'far_yt  0.000000000',})); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_yt = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*4, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'NT:     0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.near_t = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*1, h*4, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'FT      0.000000000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.far_t = text_info; }
    
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [w*0, h*5, 0], col: ORANGER[9], texture_id: tex_id, font_size: 8, text: 'Axis -0000', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.axis = text_info; }
    
    
        // Rect Posiotions
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [0, 750, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'rect1 x  0000.00', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.x1 = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [180, 750, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'y: 0000.00',     })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.x2 = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [0, 780, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'rect2 x  0000.00', })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.y1 = text_info; }
        { const text_info = Create_widget_text(Style_text_default_properties({ pos: [180, 780, 0], col: GREEN[9], texture_id: tex_id, font_size: 8, text: 'y  0000.00',     })); Widget_gfx_ready_enable({ mesh: text_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); panel.AddItem(text_info); debug_info.y2 = text_info; }
    }


    panel.GenGfxCtx();
    Widget_render(panel);

    


    const params = {
        collision_group_idx:coll_group_idx,
        debug_info_struct:debug_info,
        debug_meshes:debug_meshes,
    };
    Time_intervals_create(16, 'Test physics2D', TIME_INTERVAL_REPEAT_ALWAYS, (params)=>{

        const collision_group_idx = params.params.collision_group_idx;

        /** For the collision detection we assume all meshes have their velocity reseted on each frame
         * So to find the mesh that is moved (by the user), we check which mesh has a none zero velocity(either x or y)
         */

        const grabbed_mesh_idx = Physics2D_collision_detection_find_collider_from_group(collision_group_idx);
        if(grabbed_mesh_idx !== INT_NULL) var debug_info = Physics2D_collision_detection_all_with_all(collision_group_idx, grabbed_mesh_idx);
        // if(grabbed_mesh_idx !== INT_NULL) var debug_info = Physics2D_collision_detection_one_with_all(collision_group_idx, grabbed_mesh_idx);
        // if(grabbed_mesh_idx !== INT_NULL) Physics2D_collision_detection_all_with_all_with_obstructions(collision_group_idx, grabbed_mesh_idx);
        if(debug_info) {
            params.params.debug_info_struct.near_dx.RenderTextFromString(`neardx   ${debug_info.near_dx.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_dx.RenderTextFromString( `fardx    ${debug_info.far_dx.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.near_dy.RenderTextFromString(`neardy   ${debug_info.near_dy.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_dy.RenderTextFromString( `fardy    ${debug_info.far_dy.toFixed(2)}`, true); // Change the text to the new info

            params.params.debug_info_struct.penet_x.RenderTextFromString(`penet_x   ${debug_info.penetration_depth_y.toFixed(2)}`, true); // Change the text to the new info
            params.params.debug_info_struct.penet_y.RenderTextFromString(`penet_y    ${debug_info.penetration_depth_x.toFixed(2)}`, true); // Change the text to the new info

            // params.params.debug_info_struct.near_xt.RenderTextFromString( `Ntimex  ${Floor(debug_info.near_xt)}`, true); // Change the text to the new info
            // params.params.debug_info_struct.far_xt.RenderTextFromString(  `Ftimex  ${Floor(debug_info.far_xt)}`, true); // Change the text to the new info
            // params.params.debug_info_struct.near_yt.RenderTextFromString( `Ntimey  ${Floor(debug_info.near_yt)}`, true); // Change the text to the new info
            // params.params.debug_info_struct.far_yt.RenderTextFromString(  `Ftimey  ${Floor(debug_info.far_yt)}`, true); // Change the text to the new info
            params.params.debug_info_struct.near_xt.RenderTextFromString( `Ntimex  ${(debug_info.near_xt.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_xt.RenderTextFromString(  `Ftimex  ${(debug_info.far_xt.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.near_yt.RenderTextFromString( `Ntimey  ${(debug_info.near_yt.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_yt.RenderTextFromString(  `Ftimey  ${(debug_info.far_yt.toFixed(2))}`, true); // Change the text to the new info
            // params.params.debug_info_struct.near_t.RenderTextFromString(  `NT  ${Floor(debug_info.near_t)}`, true); // Change the text to the new info
            // params.params.debug_info_struct.far_t.RenderTextFromString(   `FT  ${Floor(debug_info.far_t)}`, true); // Change the text to the new info
            params.params.debug_info_struct.near_t.RenderTextFromString(  `NT  ${(debug_info.near_t.toFixed(2))}`, true); // Change the text to the new info
            params.params.debug_info_struct.far_t.RenderTextFromString(   `FT  ${(debug_info.far_t.toFixed(2))}`, true); // Change the text to the new info

            params.params.debug_info_struct.axis.RenderTextFromString(   `Axis  ${debug_info.axis}`, true); // Change the text to the new info

        }
        
        const x1 = params.params.debug_meshes[0].geom.pos[0];
        const y1 = params.params.debug_meshes[0].geom.pos[1];
        const x2 = params.params.debug_meshes[1].geom.pos[0];
        const y2 = params.params.debug_meshes[1].geom.pos[1];
        params.params.debug_info_struct.x1.RenderTextFromString( `rect1 x: ${x1.toFixed(2)}`, true); // Change the text to the new info
        params.params.debug_info_struct.x2.RenderTextFromString( `y: ${x2.toFixed(2)}`, true); // Change the text to the new info
        params.params.debug_info_struct.y1.RenderTextFromString( `rect2 x: ${y1.toFixed(2)}`, true); // Change the text to the new info
        params.params.debug_info_struct.y2.RenderTextFromString( `y: ${y2.toFixed(2)}`, true); // Change the text to the new info

    }, params);

}
/* Test collision detection: many rects with mouse move. Resolve: obstarct collider object */
function Test_physics2D_collision_detection_obstract_collider() { 

    const size = 40;
    const panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [60, 60, 0], dim: [300, 400], col: GREY[1],  }));
    Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: 10, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP}});
    
    
    const coll_group_idx = Collision_detection_create_group('test');
    
    
    const num_meshes = 10; 
    let hue = .12;
    let v_size = size;
    let i = 0;

    {
        const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [200, 100], dim: [v_size, v_size], col: Color_hsv_to_rgb(hue,1,1,1,.7,0),  name:`${i}`}));
        Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 5, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}});
        panel.AddItem(mesh);
        mesh.physics.idx = Physics2D_create_object(mesh.geom.pos[0], mesh.geom.pos[1]);
        mesh.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, mesh, mesh.physics.idx, PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE);
        i++;
    }
    {
        const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [10, 10], dim: [200, 30], col: Color_hsv_to_rgb(.78,1,1,1,.7,0),  name:`${i}`}));
        Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 5, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}});
        panel.AddItem(mesh);
        mesh.physics.idx = Physics2D_create_object(mesh.geom.pos[0], mesh.geom.pos[1]);
        mesh.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, mesh, mesh.physics.idx, PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE);
        i++; hue+=.2;
    }
    {
        const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [400, 100], dim: [30, 100], col: Color_hsv_to_rgb(hue,1,1,1,.7,0),  name:`${i}`}));
        Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 5, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}});
        panel.AddItem(mesh);
        mesh.physics.idx = Physics2D_create_object(mesh.geom.pos[0], mesh.geom.pos[1]);
        mesh.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, mesh, mesh.physics.idx, PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE);
        i++; hue+=.2;
    }
    {
        const mesh = Create_rect_mesh(Style_rect_default_properties({ pos: [100, 100], dim: [20, 60], col: Color_hsv_to_rgb(hue,1,1,1,.7,0),  name:`${i}`}));
        Widget_gfx_ready_enable({ mesh: mesh, enable_sdf_rect: 5, listener:{type:LISTEN_EVENT_TYPES.HOVER|LISTEN_EVENT_TYPES.MOVE}});
        panel.AddItem(mesh);
        mesh.physics.idx = Physics2D_create_object(mesh.geom.pos[0], mesh.geom.pos[1]);
        mesh.physics.collision.collision_idx = Collision_detection_add_object(coll_group_idx, mesh, mesh.physics.idx, PHYSICS2D_COLLISION_FLAGS.IS_MOVABLE);
        i++; hue+=.2;
    }


    panel.GenGfxCtx();
    Widget_render(panel);


    const params = {
        collision_group_idx:coll_group_idx,
    };
    Time_intervals_create(16, 'Test physics2D', TIME_INTERVAL_REPEAT_ALWAYS, (params)=>{

        const collision_group_idx = params.params.collision_group_idx;

        /** For the collision detection we assume all meshes have their velocity reseted on each frame
         * So to find the mesh that is moved (by the user), we check which mesh has a none zero velocity(either x or y)
         */

        const grabbed_mesh_idx = Physics2D_collision_detection_find_collider_from_group(collision_group_idx);
        // if(grabbed_mesh_idx !== INT_NULL) Physics2D_collision_detection_one_with_all(collision_group_idx, grabbed_mesh_idx);
        if(grabbed_mesh_idx !== INT_NULL) Physics2D_collision_detection_all_with_all_with_obstructions(collision_group_idx, grabbed_mesh_idx);


    }, params);

}

/** */
function Test_colored_labels_with_hsv(x=100, y=10, num_colors=20, contrast=.28, saturation=.8) { // Coloring Labels

    const menu_panel = Create_rect_mesh(Style_rect_default_properties({
        is_root:ROOT_WIDGETS.CREATE_ROOT, pad:[5, 10], 
        pos:[x, y, 0],
        col:Color_hsv_to_rgb_calibrated(.0, .0, 1., 1., .08, .0), 
        name:'MenuLoadPanel', 
        layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF,
    }));
    Widget_gfx_ready_enable({mesh:menu_panel, enable_sdf_rect: 10, listener:{type:LISTEN_EVENT_TYPES.MOVE}}); 
    
    let col = 0;
    const grad = 1/num_colors;

    for (let i = 0; i < num_colors; i++) { 
        const button = Create_widget_button(Style_button_default_properties({ 
            theme: Color_theme_label_auto(col, saturation, contrast, .0), 
            // text:'Neuro',pos:[0, 0, 0], text_pad:[15, 8], font_size:11, 
            text:'Neuro',pos:[0, 0, 0], text_pad:[8, 6], font_size:11, 
            texture_id:TEXTURES.MTSDF_CONSOLAS_1024, 
            layout:LAYOUT.VERTICAL
        }));
        Widget_gfx_ready_enable({mesh:button, enable_sdf_rect: 12, listener:{type:LISTEN_EVENT_TYPES.HOVER}}); // , enable_col_per_vertex:COLOR_GRADIENT_HORIZONTAL(BLUEL[8], BLUEL[3])});
        menu_panel.AddItem(button); 
        col += grad
    }
    menu_panel.GenGfxCtx();

    Layout_basic_pre_render(menu_panel);
    // Layout_expand_x_axis(menu_panel);

    Widget_render(menu_panel);

    return menu_panel;
}
/** Test: New implementation -> VB render groups PLUS reset (by whole group or by render group) and rerender (by whole group or by render group) */
function Test_create_render_groups_resize_and_rerender() {

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [100, 300, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'ROOT' }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
    });

    let cnt = 1;
    const font_size = 20;

    // Store parent meshes that are gonna be rendered in their own render group(for testing)
    const new_render_group_mesh_0 = section;
    let new_render_group_mesh_1 = INT_NULL;
    let new_render_group_mesh_2 = INT_NULL;
    let new_render_group_text_0 = INT_NULL;
    let new_render_group_text_1 = INT_NULL;
    let new_render_group_text_2 = INT_NULL;

    // let test_info = null;

    {
        const red = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 20], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(1., .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`red 1` }));
        Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: 15 }); 
        // red.RenderToNewRenderGroup();
        section.AddItem(red);

        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            red.AddItem(s1); 
            // s1.RenderToNewRenderGroup();
            {
                const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);

                const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                s1.AddItem(sl);

                // Any text will do..
                new_render_group_text_0 = l.text_mesh;
            }
        }
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            red.AddItem(s1); 
            s1.RenderToNewRenderGroup();
            new_render_group_mesh_1 = s1;
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

                const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s2.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);

                const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                s1.AddItem(sl);

                new_render_group_text_1 = l.text_mesh;
            }
        }
        {
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            red.AddItem(s1); 
            s1.RenderToNewRenderGroup();
            new_render_group_mesh_2 = s1;
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

                const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s2.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);

                const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                s1.AddItem(sl);
                
                new_render_group_text_2 = l.text_mesh;
            }
        }

        // const test_info_text = 'qwertyuioqwertyuioqwertyuioqwertyuioqwertyuioasdfghjkl\n;qwertyuio\nqwertyuiozxcvbnm\n,qwertyuioqwertyuioqwertyuioqwertyuioqwertyuioasdfghjkl\n;qwertyuioqwertyuiozxcvbnm';
        // const test_info = Create_widget_text({ is_root: _, pos: [0, 0, 0], col: GREEN[9], texture_id: TEXTURES.CONSOLA_VARIANT_FONT, font_size: 10, text: test_info_text, variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S2_0, pad: [10, 6], layout:LAYOUT.VERTICAL});
        // Widget_gfx_ready_enable({ mesh: test_info, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
        // red.AddItem(test_info);
    }


    { // Render
        // section.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
        section.GenGfxCtx();
        Layout_basic_pre_render(section);
        Widget_render(section);
    }



    /***********************************************************************************************************************************/
    // TEST if the gfx buffers are set properly
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section, .03, 0., 1.,)
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section.children.buffer[0], .015, 0., 1.,)
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section.children.buffer[0].children.buffer[0], .031, 0., 1.,)
    // Mesh_animations_create(ANIMATIONS.TYPE.COLOR|ANIMATIONS.TYPE.CYCLICAL, ANIMATIONS.DATA.COLOR.G, section.children.buffer[0].children.buffer[1], .03, 0., 1.,)
    // Mesh_set_color_rgba(section.children.buffer[0], BLUEL[9])
    // Mesh_set_color_rgba(section.children.buffer[0].children.buffer[0], BLUEL[9])
    // Mesh_set_color_rgba(section.children.buffer[0].children.buffer[1], BLUEL[9])



    /***********************************************************************************************************************************/
    // Test: reset and rerender via rendergroups
    /**
     * There are total 3 meshes that are instructed to be rendered in new render groups
     * and 3 text meshes on their own render group(because the text needs different vb-program to be rendered)
     * 
     * Render group 0: is the root panel section with the first child
     * Render group 1: is the second child
     * Render group 3: is the third child
     * 
     * child: a section panel with 1:label, 2:switch, 3:slider
     * 
     * Labels and sliders do have text meshes, so there are 3 more render groups to handle the text rendering
     * 
     * Total:
     *  1 view group
     *      6 render groups, of which the 3 (text meshes belong to the first 3 parent render groups)
     * 
     * 
     * // TODO: Implement it as a test, to test any mesh if test is passed
     */


    const info_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [100, 10, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), layout:LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name:'InfoPanel' }));
    Widget_gfx_ready_enable({
        mesh: info_section, enable_sdf_rect: 15,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
    });
    // Text must be large enough for the info
    let test_info_text = '87817267267627361565265162561526516287239839362;87817267267627361565265162561526516287239839362;\n87817267267627361565265162561526516287239839362;87817267267627361565265162561526516287239839362;\n87817267267627361565265162561526516287239839362;87817267267627361565265162561526516287239839362;\n87817267267627361565265162561526516287239839362;87817267267627361565265162561526516287239839362;\n87817267267627361565265162561526516287239839362;87817267267627361565265162561526516287239839362;';
    // let test_info_text = '878172672676273615652651625615265162;\n878172672676273615652651625615265162;\n878172672676273615652651625615265162;\n878172672676273615652651625615265162;\n878172672676273615652651625615265162;\n878172672676273615652651625615265162;\n878172672676273615652651625615265162;';
    // let test_info_text = '878172672676273615652651625615265162;\n878172672676273615652651625615265162;';
    // let test_info_text = '1\n2\n3\n4';
    const test_info = Create_widget_text({ 
        pos: [0, 0, 0], col: GREEN[9], 
        texture_id: TEXTURES.MTSDF_COMIC_1024, 
        font_size: 8, text: test_info_text, 
        pad: [10, 6], layout:LAYOUT.VERTICAL
    });
    Widget_gfx_ready_enable({ mesh: test_info, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    info_section.AddItem(test_info);

    info_section.GenGfxCtx();
    Layout_basic_pre_render(info_section);
    Widget_render(info_section);

    test_info_text = ''; // Reset tex



    const rg_idxs = Vertex_buffer_group_get_render_groupidxs(new_render_group_mesh_0.gfx.vb.groupidx);
    const Update_info = (rg_idxs, test_name, test_info_text)=>{
        
        test_info_text += `${test_name}`;
        
        for(let i=0; i<=rg_idxs.boundary; i++) {
            const rg = Vertex_buffer_render_group_get_render_group(rg_idxs.buffer[i]);
            test_info_text += `\n  Render group: ${rg_idxs.buffer[i]} , vb: ${rg.vb_data_idx} , attributes count: ${rg.count} , draw count: ${rg.draw_count}`;
        }
        
        return test_info_text;
    }

    
    // Test 1: reset and rerender the whole view group
    {
        test_info_text += 'Test 1: Reset and rerender the whole view group';

        View_reset_rendering_buffer_whole_view_group(new_render_group_mesh_0.group_bufferidxs[0]); // Reset the testing mesh
        View_reset_rendering_buffer_whole_view_group(test_info.group_bufferidxs[0]); // Reset info panel and info text

        test_info_text = Update_info(rg_idxs, '\n* Reset', test_info_text); // Store test's info after reseting test mesh

        View_render_whole_view_group_NEW(new_render_group_mesh_0.group_bufferidxs[0]); // rerender test mesh
        
        test_info_text = Update_info(rg_idxs, '\n* Rerender', test_info_text); // Store test's info after rerendering test mesh
        test_info.SetText(test_info_text, true); // Change the text to the new info 
        Layout_basic_pre_render(info_section); // Set layout after text ingo update
        View_render_whole_view_group_NEW(info_section.group_bufferidxs[0]); // Rerender info panel and info text
        
    }

    // // Test 2: reset and rerender specific rendergroups
    // // Rg 0
    // View_reset_rendering_buffer_specific_render_group(new_render_group_mesh_0.group_bufferidxs); // Reset rg 0
    // View_reset_rendering_buffer_specific_render_group(new_render_group_text_0.group_bufferidxs); // Reset rg 0 text
    // View_render_specific_render_group(new_render_group_mesh_0.group_bufferidxs[0], new_render_group_mesh_0.group_bufferidxs[1], new_render_group_mesh_0.group_bufferidxs[2],); // Re-render rg 0
    // View_render_specific_render_group(new_render_group_mesh_0.group_bufferidxs[0], new_render_group_mesh_0.group_bufferidxs[1], new_render_group_mesh_0.group_bufferidxs[2],); // Re-render rg 0 text
    // // Rg 1
    // View_reset_rendering_buffer_specific_render_group(new_render_group_mesh_1.group_bufferidxs); // Reset rg 1
    // View_reset_rendering_buffer_specific_render_group(new_render_group_text_1.group_bufferidxs); // Reset rg 1 text
    // View_render_specific_render_group(new_render_group_mesh_0.group_bufferidxs[0], new_render_group_mesh_0.group_bufferidxs[1], new_render_group_mesh_0.group_bufferidxs[2],); // Re-render rg 1
    // View_render_specific_render_group(new_render_group_mesh_0.group_bufferidxs[0], new_render_group_mesh_0.group_bufferidxs[1], new_render_group_mesh_0.group_bufferidxs[2],); // Re-render rg 1 text
    // // Rg 2
    // View_reset_rendering_buffer_specific_render_group(new_render_group_mesh_2.group_bufferidxs); // Reset rg 2
    // View_reset_rendering_buffer_specific_render_group(new_render_group_text_2.group_bufferidxs); // Reset rg 2 text
    // View_render_specific_render_group(new_render_group_mesh_0.group_bufferidxs[0], new_render_group_mesh_0.group_bufferidxs[1], new_render_group_mesh_0.group_bufferidxs[2],); // Re-render rg 2
    // View_render_specific_render_group(new_render_group_mesh_0.group_bufferidxs[0], new_render_group_mesh_0.group_bufferidxs[1], new_render_group_mesh_0.group_bufferidxs[2],); // Re-render rg 2 text

}
/** Test: Remove meshes */
function Test_create_remove_render_groups() {

    // Store parent meshes that are gonna be rendered in their own render group(for testing)
    let new_render_group_mesh_0 = null;
    let new_render_group_text_0 = null;
    
    {
        const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [100, 300, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'ROOT' }));
        Widget_gfx_ready_enable({
            mesh: section, enable_sdf_rect: 15,
            listener: { type: LISTEN_EVENT_TYPES.MOVE },
        });
        
        let cnt = 1;
        const font_size = 20;
        
        new_render_group_mesh_0 = section;
    
        {
            const red = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 20], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(1., .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`red 1` }));
            Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: 15 }); 
            // red.RenderToNewRenderGroup();
            section.AddItem(red);
    
            {
                const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
                red.AddItem(s1); 
                // s1.RenderToNewRenderGroup();
                {
                    const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    s1.AddItem(l);
    
                    const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
                    Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    s1.AddItem(sw);
    
                    const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                    Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                    s1.AddItem(sl);
    
                    // Any text will do..
                    new_render_group_text_0 = l.text_mesh;
                }
            }
        }
    
    
        // Render
        section.GenGfxCtx();
        Layout_basic_pre_render(section);
        Widget_render(section);
        
    }    

    // /*************************************************************************************************************************************************************************/
    // // Remove all meshes and view render groups
    // View_destroy_render_group_and_meshes(new_render_group_text_0.group_bufferidxs[0], new_render_group_text_0.group_bufferidxs[1], new_render_group_text_0.group_bufferidxs[2],);
    // View_destroy_render_group_and_meshes(new_render_group_mesh_0.group_bufferidxs[0], new_render_group_mesh_0.group_bufferidxs[1], new_render_group_mesh_0.group_bufferidxs[2],);
    
    // // Remove from App reset all
    // App_reset(); // Reset all 
    // Scene_camera_scroll_set(_, 0);
    // App_reinitialize();

    {

        const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [100, 300, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), layout:LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'ROOT' }));
        Widget_gfx_ready_enable({
            mesh: section, enable_sdf_rect: 15,
            listener: { type: LISTEN_EVENT_TYPES.MOVE },
        });
    
        let cnt = 1;
        const font_size = 20;

        {
            const red = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 20], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(1., .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`red 1` }));
            Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: 15 }); 
            // red.RenderToNewRenderGroup();
            section.AddItem(red);
    
            {
                const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
                red.AddItem(s1); 
                // s1.RenderToNewRenderGroup();
                {
                    const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.VERTICAL, name:`l${cnt++}` }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    s1.AddItem(l);
    
                    const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.VERTICAL, }));
                    Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    s1.AddItem(sw);
    
                    const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                    Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                    s1.AddItem(sl);
    
                    // Any text will do..
                    new_render_group_text_0 = l.text_mesh;
                }
            }
        }
        
        // Render
        section.GenGfxCtx();
        Layout_basic_pre_render(section);
        Widget_render(section);
        
    } 

}

function Resolve_mesh_info_tool_tip(hovered_mesh, clbk_params, tool_tip_params) {

    // TODO: There is great inefficiency in reseting and rerender all the different vertex buffers

    // console.log('CREATE!!!', hovered_mesh, clbk_params, tool_tip_params);

    const info_panel = tool_tip_params.info_panel;

    const info_text_mesh_debug = info_panel.children.buffer[0];
    const char_buffer_size = (info_text_mesh_debug) ? `${info_text_mesh_debug.mat.char_buffer.size}` : 'null';
    const text_len = (info_text_mesh_debug) ? `${info_text_mesh_debug.mat.text.length}` : 'null';
    
    const msg = [
        Mesh_get_name(hovered_mesh),
        `x:${hovered_mesh.geom.pos[0]}, y:${hovered_mesh.geom.pos[1]}`,
        // `x:${Mesh_get_real_pos_x(hovered_mesh)}, y:${Mesh_get_real_pos_y(hovered_mesh)}`,
        `w:${hovered_mesh.geom.dim[0]}, h:${hovered_mesh.geom.dim[1]}`,
        `groupidx:${hovered_mesh.group_bufferidxs[0]}, vbidx:${hovered_mesh.group_bufferidxs[1]}, rgidx:${hovered_mesh.group_bufferidxs[2]}, meshidx:${hovered_mesh.group_bufferidxs[3]}}`,
        `TextName{charBufferSize${char_buffer_size}, textLen:${text_len}}`,
    ];
    
    let widget_text = null;
    for(let i = 0; i < msg.length; i++) {
        
        View_reset_rendering_buffer_whole_view_group(info_panel.group_bufferidxs[0]);
        widget_text = info_panel.children.buffer[i];
        
        // Use existing info text meshes
        if(widget_text !== null && widget_text !== undefined) {
            widget_text.SetText(msg[i]);
        }
        else { // Create new text

            widget_text = Create_widget_text({
                pad: [6, 2], pos: [0, 0, 0], col: ORANGER[9],
                font_size: 10, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, 
                text: msg[i],
                layout:LAYOUT.VERTICAL,
            });
            Widget_gfx_ready_enable({ mesh: widget_text, enable_attr_dim: false });
            widget_text.SetViewGroupIndex(info_panel.group_bufferidxs[0]);
            info_panel.AddItem(widget_text);
            widget_text.GenGfxCtx();
            // Widget_render(widget_text);
            View_activate_all_vbs_in_renderqueue(widget_text.group_bufferidxs);
        }
        
    }
    
    Layout_basic_pre_render(info_panel);
    View_render_specific_render_group(widget_text.group_bufferidxs[0], widget_text.group_bufferidxs[1], widget_text.group_bufferidxs[2]);
    View_render_specific_render_group(info_panel.group_bufferidxs[0], info_panel.group_bufferidxs[1], info_panel.group_bufferidxs[2]);
    // Widget_render(widget_text);
    // View_render_from_view_NEW(info_panel.group_bufferidxs[0]);

    // VBI_state_enable(widget_text.gfx.vb.groupidx, BUFFER_STATE.NEEDS_UPDATE);


}
function Create_info_panel_tool_tip(x=0, y=0) {

    const tr = 1.;
    const pad = [10, 10];
    const dim = [200, 200];

    const info_panel = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: ROOT_WIDGETS.CREATE_ROOT, pad: pad, 
        pos: [x,y,0], dim: dim, col: TRANSPARENCY(BLUEL[5], tr), 
        name: 'InfoPanel', layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF,
    }));
    Widget_gfx_ready_enable({ mesh: info_panel, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })
    // info_panel.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    info_panel.GenGfxCtx();
    Layout_basic_pre_render(info_panel);
    Widget_render(info_panel);

    return info_panel;
}

function Test_on_hover_show_info(x=0, y=0) {

    const Info_tool_create = (hovered_mesh, clbk_params)=>{
        console.log('CREATE!!!', hovered_mesh, clbk_params);

        const info_panel = clbk_params.info_panel;

        View_reset_rendering_buffer_whole_view_group(info_panel.group_bufferidxs[0]);

        const msg = [
            hovered_mesh.name,
        ];

        // for(let i = 0; i <= info_panel.children.boundary; i++) {
        for(let i = 0; i < msg.length; i++) {

            let widget_text = info_panel.children.buffer[i];

            // Use existing info text meshes
            if(widget_text !== null && widget_text !== undefined) {

                // widget_text.RenderTextFromString(Mesh_get_name(hovered_mesh));
                widget_text.SetText(Mesh_get_name(hovered_mesh));
            }
            else { // Create new text

                widget_text = Create_widget_text({
                    // is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 6], pos: [0, 0, 0], col: ORANGER[9],
                    pad: [10, 6], pos: [0, 0, 0], col: ORANGER[9],
                    font_size: 5.8, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, 
                    text: Mesh_get_name(hovered_mesh),
                    layout:LAYOUT.VERTICAL,
                });
                Widget_gfx_ready_enable({ mesh: widget_text, enable_attr_dim: false });
                widget_text.SetViewGroupIndex(info_panel.group_bufferidxs[0]);
                info_panel.AddItem(widget_text);
                console.error('[][][][]][][]')
                widget_text.GenGfxCtx();
                Widget_render(widget_text);
            }
            
        }

        Layout_basic_pre_render(info_panel);
        View_render_from_view_NEW(info_panel.group_bufferidxs[0]);

    } 
    const Info_tool_destroy = (hovered_mesh, clbk_params)=>{
        console.log('DESTROY!!!', hovered_mesh, clbk_params)
    } 
    const resolve_clbks = (hovered_mesh, mouse_event_type, clbk_params)=>{ // Called from Events.js, OnHover
        console.log('--------------------------------------------------------------------------------------');
        // console.log('RESOLVE', hovered_mesh, 'mouse_event_type', mouse_event_type, clbk_params);

        if(mouse_event_type & EVENT_HANDLER_TYPE.MOUSE_HOVER) {
            Info_tool_create(hovered_mesh, clbk_params);
        }
        else if(mouse_event_type & EVENT_HANDLER_TYPE.MOUSE_UNHOVER) {
            Info_tool_destroy(hovered_mesh, clbk_params);
        }
    }


    const tr = 1.;
    const pad = [10, 10];
    const dim = [200, 200];

    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: ROOT_WIDGETS.CREATE_ROOT, pad: pad, 
        pos: [x,y,0], dim: dim, col: TRANSPARENCY(BLUEL[5], tr), 
        name: 'InfoPanel', layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF,
    }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);


    /******************************************************************************************************/
    // Create message ingo
    // const msg = [
    //     'Info 1',
    //     'Info 2',
    //     'Info 3',
    // ];
    // for(let i = 0; i < msg.length; i++) {

    //     {
    //         const widget_text = Create_widget_text({
    //             is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 6], pos: [0, 0, 0], col: ORANGER[9],
    //             font_size: 5.8, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, 
    //             text: msg[i],
    //             layout:LAYOUT.VERTICAL,
    //         });
    //         Widget_gfx_ready_enable({ mesh: widget_text, enable_attr_dim: false });
    //         section.AddItem(widget_text);
    //     }
    //     // {
    //     //     const widget_text = Create_widget_text({
    //     //         is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 6], pos: [0, 0, 0], col: ORANGER[9],
    //     //         font_size: 10, texture_id: TEXTURES.CONSOLA_VARIANT_FONT, text: `Another text`, 
    //     //         variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S1_5, layout:LAYOUT.VERTICAL,
    //     //     });
    //     //     section.AddItem(widget_text);
    //     //     Widget_gfx_ready_enable({ mesh: widget_text, enable_attr_dim: false });
    //     // }
    // }

    section.GenGfxCtx();
    Layout_basic_pre_render(section);
    Widget_render(section);

    /******************************************************************************************************/
    // Create message ingo
    // const msg = [
    //     'Info 1',
    //     'Info 1',
    // ];
    // for(let i = 0; i < msg.length; i++) {

    //     const widget_text = Create_widget_text({
    //         is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 6], pos: [0, 0, 0], col: ORANGER[9],
    //         font_size: 5.8, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, 
    //         text: msg[i],
    //         layout:LAYOUT.VERTICAL,
    //     });
    //     Widget_gfx_ready_enable({ mesh: widget_text, enable_attr_dim: false });
    //     section.AddItem(widget_text);
    //     widget_text.SetViewGroupIndex(section.group_bufferidxs[0]);
        
    //     widget_text.GenGfxCtx();
    //     // Widget_render(widget_text);
        
    //     Layout_basic_pre_render(section);
    //     View_reset_rendering_buffer_whole_view_group(section.group_bufferidxs[0]);
    //     View_render_from_view_NEW(section.group_bufferidxs[0]);
    // }



    const Clbk = (params) => {
        // ISN"T CALLED IF A RESOLVE FUNCTION IS PASSED IN:Mesh_event_callback_create()
    };
    const clbk_params = {
        info_panel: section,
        resolve_clbk: {create:'create',destroy:'destroy'},
    };

    Mesh_event_callback_create(label, Clbk, clbk_params, resolve_clbks);
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
    Layout_grow_containers_pre_render(section);

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
        Layout_basic_pre_render(slider_section);

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
    Layout_grow_containers_pre_render(section);

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
    Layout_basic_pre_render(slider_section);
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

    // const slider_mesh = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.19, .2), pos: [0, 0, 0], dim: [200, 20], col: GREY[3], name: 'Sample Slider', layout: LAYOUT.VERTICAL, font_size: font_size, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 }));
    const slider_mesh = Create_widget_slider(Style_slider_default_properties({ theme: Color_theme_slider_auto(.19, .2, .18, 0), pos: [0, 0, 0], dim: [200, 20], col: GREY[3], name: 'Sample Slider', layout: LAYOUT.VERTICAL, font_size: font_size, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 }));
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
    Layout_grow_containers_pre_render(section);

    section.GenGfxCtx();
    Widget_render(section);










    /***********************************************************************************************************************************************/
    // Generic HSV color slider controls
    const Create_sliders_per_mesh = (layout) => {

        const hsv = new Float32Array([.12, .8, 1]);
        const contrast = .18;
        const hue_preservation = .0;
        const parameters = [hsv[0], hsv[1], hsv[2], contrast, hue_preservation];
        // const parameters = [hsv[0], hsv[1], hsv[2], 0, hue_preservation];

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
    Layout_basic_pre_render(slider_section);

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
    Layout_grow_containers_pre_render(section);

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
    Layout_grow_containers_pre_render(section);

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
        Layout_basic_pre_render(slider_section);
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

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
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
        // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); target_meshes.push(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); target_meshes.push(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); target_meshes.push(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); target_meshes.push(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); target_meshes.push(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); target_meshes.push(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); target_meshes.push(rect2); }
        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }

        { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: pad, dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' + cnt })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); section.AddItem(rect2); }
    }


    TEMP_Calculate_layout_grow_count(section);
    // Layout_grow_containers_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);

    section.GenGfxCtx();
    Widget_render(section);



    /***********************************************************************************************************************************************/
    // Proportions slider controls
    const start_proportion = 1;
    {
        const slider_section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad:[10,10], pos: [0, 600, 0], dim: [400, 300], col: GREY[2], layout: LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name: 'SliderControls' }));
        Widget_gfx_ready_enable({ mesh: slider_section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

        cnt = 0;
        // Sliders: first row meshes
        {
            // Slider: first row meshes
            const slider_dim = [300, 10], color = YELLOW[4], rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_10;
            const slider = Create_widget_slider(Style_slider_default_properties({ pos:[0,0,0], dim: slider_dim, col: color, name: `Mesh ${cnt}`, layout: LAYOUT.VERTICAL, texture_id: default_font }));
            Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
            slider.SetInitialValue(start_proportion);
            slider_section.AddItem(slider);

            const params = {
                root_mesh: section,
                target_mesh: target_meshes[cnt++],
            };
            
            // Connect sliders to gfx program uniforms 
            Slider_connect(slider, (params, slider_val) => {
                
                const root_mesh = params.clbk_params.root_mesh;
                
                const target_mesh = params.clbk_params.target_mesh;
                target_mesh.align.proportion.x = slider_val;
                
                View_reset_rendering_buffer_whole_view_group(root_mesh.group_bufferidxs[0]);
                Layout_grow_containers_pre_render(root_mesh);
                View_render_from_view_NEW(root_mesh.group_bufferidxs[0]);
                
            }, params,
            );
        }
        // Sliders: second row meshes
        {
            const slider_dim = [300/3, 10], color = YELLOW[4], rcorners = 10, default_font = TEXTURES.MTSDF_CONSOLAS_10;
            {
                // Slider: mesh 1
                const slider = Create_widget_slider(Style_slider_default_properties({ pos:[0,0,0], dim: slider_dim, col: color, name: `Mesh ${cnt}`, layout: LAYOUT.VERTICAL, texture_id: default_font }));
                Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
                slider.SetInitialValue(start_proportion);
                slider_section.AddItem(slider);
    
                const params = {
                    root_mesh: section,
                    target_mesh: target_meshes[cnt++],
                };
    
                // Connect sliders to gfx program uniforms 
                Slider_connect(slider, (params, slider_val) => {
    
                    const root_mesh = params.clbk_params.root_mesh;
                    const target_mesh = params.clbk_params.target_mesh;
                    target_mesh.align.proportion.x = slider_val;
    
                    View_reset_rendering_buffer_whole_view_group(root_mesh.group_bufferidxs[0]);
                    Layout_grow_containers_pre_render(root_mesh);
                    View_render_from_view_NEW(root_mesh.group_bufferidxs[0]);
    
                }, params,
                );
            }
            {
                // Slider: mesh 2
                const slider = Create_widget_slider(Style_slider_default_properties({ pos:[0,0,0], dim: slider_dim, col: color, name: `Mesh ${cnt}`, layout: LAYOUT.HORIZONTAL, texture_id: default_font }));
                Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
                slider.SetInitialValue(start_proportion);
                slider_section.AddItem(slider);
    
                const params = {
                    root_mesh: section,
                    target_mesh: target_meshes[cnt++],
                };
    
                // Connect sliders to gfx program uniforms 
                Slider_connect(slider, (params, slider_val) => {
    
                    const root_mesh = params.clbk_params.root_mesh;
                    const target_mesh = params.clbk_params.target_mesh;
                    target_mesh.align.proportion.x = slider_val;
    
                    View_reset_rendering_buffer_whole_view_group(root_mesh.group_bufferidxs[0]);
                    Layout_grow_containers_pre_render(root_mesh);
                    View_render_from_view_NEW(root_mesh.group_bufferidxs[0]);
    
                }, params,
                );
            }
            {
                // Slider: mesh 3
                const slider = Create_widget_slider(Style_slider_default_properties({ pos:[0,0,0], dim: slider_dim, col: color, name: `Mesh ${cnt}`, layout: LAYOUT.HORIZONTAL, texture_id: default_font }));
                Widget_gfx_ready_enable({ mesh: slider, enable_sdf_rect: rcorners, })
                slider.SetInitialValue(start_proportion);
                slider_section.AddItem(slider);
    
                const params = {
                    root_mesh: section,
                    target_mesh: target_meshes[cnt++],
                };
    
                // Connect sliders to gfx program uniforms 
                Slider_connect(slider, (params, slider_val) => {
    
                    const root_mesh = params.clbk_params.root_mesh;
                    const target_mesh = params.clbk_params.target_mesh;
                    target_mesh.align.proportion.x = slider_val;
    
                    View_reset_rendering_buffer_whole_view_group(root_mesh.group_bufferidxs[0]);
                    Layout_grow_containers_pre_render(root_mesh);
                    View_render_from_view_NEW(root_mesh.group_bufferidxs[0]);
    
                }, params,
                );
            }

        }


        
        slider_section.GenGfxCtx();
        Layout_basic_pre_render(slider_section);
        Widget_render(slider_section);
    }



}
function Test_resize_fill_space_layout_nested(x = 0, y = 0) {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    const pad = [20, 10];
    let rect_cnt = 0;
    let parent_cnt = 0;

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

    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_fill_space_layout_nested_with_widgets(x = 0, y = 0) {

    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor | LAYOUT.TYPE_GROW_CONTAINER, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    {// HORIZONTALS
        const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
        const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
        {
            parent_cnt++;
            // const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [150, 150], pad: [10, 10], col: GREY[7], layout: fixed_layout_hor, name: `H1` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [150, 150], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `H1` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `a1` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `a${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `a${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `a${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `a${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `a${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `a2` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `b${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `b${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `b${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `b${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `b${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `b${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `b${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `H2` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `b1` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `b2` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `b3` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `b4` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [120, 200], pad: [10, 10], col: GREY[7], layout: layout_vert, name: `H3` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `c${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Lc1', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Lc2', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Lc3', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Lc4', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Lc5', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Lc6', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Lc7', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }
        {
            parent_cnt++;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `H4` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `d1` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Ld1', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_hor, name: `d2` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `rect${rect_cnt++} s${parent_cnt}`, name:'Ld2', pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
            {
                const layout = LAYOUT.HORIZONTAL;
                const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[2], layout: layout_vert, name: `d3` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [0, 0], dim: [40, 40], col: GetSequencedColor(9), layout: layout, name: `rect${rect_cnt++} s${parent_cnt}`, texture_id: TEXTURES.MTSDF_SYMBOLS, sub_texture_id: ATLASES_SUB_TEXTURES.MTSDF_SYMBOLS.circle_3 })); Widget_gfx_ready_enable({ mesh: r2 }); s2.AddItem(r2); }
                // { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [40, 40], col: GetSequencedColor(9), layout: layout, name: `TEXTURE s${parent_cnt}`, texture_id:TEXTURES.SMOKE_1 })); Widget_gfx_ready_enable({ mesh: r2}); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [40, 40], col: Color_hsv_to_rgb_calibrated(0.56,1,1,1,1,0), layout: layout, name: `TEXTURE s${parent_cnt}`, texture_id:TEXTURES.SMOKE_1 })); Widget_gfx_ready_enable({ mesh: r2}); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [40, 40], col: Color_hsv_to_rgb_calibrated(0.86,1,1,1,1,0), layout: layout, name: `TEXTURE s${parent_cnt}`, texture_id:TEXTURES.SMOKE_1 })); Widget_gfx_ready_enable({ mesh: r2}); s2.AddItem(r2); }
                { const r2 = Create_rect_mesh(Style_rect_default_properties({ pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: `rect${rect_cnt++} s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
            }
        }

    }



    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_layout_grow_containers_1(x = 0, y = 0) {

    // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    parent_cnt++;
    const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
    {
        const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
    }


    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    // Layout_basic_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);
    // Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_layout_grow_containers_2(x = 0, y = 0) {

    // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;


    parent_cnt++;
    const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); section.AddItem(s1);
    {
        const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
        { const r2 = Create_widget_slider(Style_slider_default_properties({ theme:Color_theme_slider_auto(0.56,0.7,.24,0), pos:[0,0,0], dim: [80,10], name: `Slider${rect_cnt++}`, layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s2.AddItem(r2); }
                                
    }



    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    // Layout_basic_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);
    // Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_layout_grow_containers_3(x = 0, y = 0) {

    // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
   

    parent_cnt++;
    const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); 
    Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); 
    section.AddItem(s1);
    {
        // // const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
        {
            const text_pad = [12, 6];
            const pad = [6, 6];
            const font_size = 8;
            const dp_rcorners = 7;


            // const dp = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dp`, theme:Color_theme_dropdown_auto(.1, .7, .18, 0), pos:[0,0,0], dim:[100,100], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
            const dp = Create_widget_dropdown(Style_dropdown_default_properties({ 
                text: `Dp`, name:'Dp',
                theme:Color_theme_dropdown_auto(.1, .7, .18, 0), 
                pos:[0,0,0], dim:[100,100], text_col: WHITE, pad: pad, 
                text_pad: text_pad, font_size: font_size, 
                // layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
                // layout: layout_hor
            }));
            Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.HOVER}})
            s1.AddItem(dp);
            Dropdown_roots_set_root(dp, dp);

            // HACK
            // dp.menu.align.flags = layout_hor

            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
            
            
            {

                const dp1 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `dp1`, name:'dp1', theme:Color_theme_dropdown_auto(.1, .7, .18, 0),  pos:[0,0,0], dim:[100,100], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({ mesh: dp1, enable_sdf_rect: dp_rcorners, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.HOVER}})
                dp.AddToMenu(dp1);
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
            }
            
        }
        
    }




    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    // Layout_basic_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);
    // Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_layout_grow_containers_4(x = 0, y = 0) {

    // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

  

    { // With dropdown widget
        parent_cnt++;
        const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); 
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); 
        section.AddItem(s1);
        {
            // // const s2 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[4], layout: layout_vert, name: `s${parent_cnt}` })); Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 5, }); s1.AddItem(s2);
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            {
                const text_pad = [12, 6];
                const pad = [6, 6];
                const font_size = 8;
                const dp_rcorners = 7;


                // const dp = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Dp`, theme:Color_theme_dropdown_auto(.1, .7, .18, 0), pos:[0,0,0], dim:[100,100], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                const dp = Create_widget_dropdown(Style_dropdown_default_properties({ 
                    text: `Dp`, name:'Dp',
                    theme:Color_theme_dropdown_auto(.1, .7, .18, 0), 
                    pos:[0,0,0], dim:[100,100], text_col: WHITE, pad: pad, 
                    text_pad: text_pad, font_size: font_size, 
                    // layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
                    // layout: layout_hor
                }));
                Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.HOVER}})
                s1.AddItem(dp);
                Dropdown_roots_set_root(dp, dp);

                // HACK
                // dp.menu.align.flags = layout_hor

                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.VERTICAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp.AddToMenu(r2); }
                
                {

                    const dp1 = Create_widget_dropdown(Style_dropdown_default_properties({ text: `dp1`, name:'dp1', theme:Color_theme_dropdown_auto(.1, .7, .18, 0),  pos:[0,0,0], dim:[100,100], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                    Widget_gfx_ready_enable({ mesh: dp1, enable_sdf_rect: dp_rcorners, listener:{type:LISTEN_EVENT_TYPES.CLICK_UP|LISTEN_EVENT_TYPES.HOVER}})
                    dp.AddToMenu(dp1);
                    { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                    { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                    { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                    { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                    { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); dp1.AddToMenu(r2); }
                }
                
            }

            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 

                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
        }

    }




    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    // Layout_basic_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);
    // Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_layout_grow_containers_5(x = 0, y = 0) {

    // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

  

    { // With dropdown widget
        parent_cnt++;
        const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); 
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); 
        section.AddItem(s1);
        {
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }


            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 

                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                // { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
        }

    }




    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    // Layout_basic_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);
    // Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_layout_grow_containers_many(x = 0, y = 0) {

    // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    const bright1=.24, bright2=.26, bright3=.5;
  

    { // With dropdown widget
        parent_cnt++;
        const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); 
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); 
        section.AddItem(s1);

        let hue = -0.05;
        
        {
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }


            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(0,1,.8,1,.8), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 

                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.56,1,1,1,.8), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.13,1,1.,1,.8), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.22,1,.9,1,.8), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
            // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
        }

    }




    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    // Layout_basic_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);
    // Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
function Test_resize_layout_grow_containers_many_compound(x = 0, y = 0) {

    // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
    const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

    let rect_cnt = 0;
    let parent_cnt = 0;


    const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
    const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

    const bright1=.24, bright2=.26, bright3=.5;
  

    { // With dropdown widget
        parent_cnt++;
        const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); 
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); 
        section.AddItem(s1);

        let hue = -0.05;
        
        {
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }


            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(0,1,.8,1,.8), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 

                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.56,1,1,1,.8), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.13,1,1.,1,.8), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.22,1,.9,1,.8), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            
        }

    }
    { // With dropdown widget
        parent_cnt++;
        const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); 
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); 
        section.AddItem(s1);

        let hue = -0.05;
        
        {
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
            { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }


            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(0,1,.8,1,.8), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 

                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.56,1,1,1,.8), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.13,1,1.,1,.8), layout: layout_hor, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            { 
                const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.22,1,.9,1,.8), layout: layout_vert, name: 'rect' })); 
                Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
                s1.AddItem(rect2); 
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
            }
            
        }

    }




    
    section.GenGfxCtx();
    TEMP_Calculate_layout_grow_count(section);
    // Layout_basic_pre_render(section);
    Layout_grow_containers_pre_render_with_item_reposition(section);
    // Layout_grow_containers_pre_render(section);
    Widget_render(section);
}
// function Test_resize_layout_grow_containers_many(x = 0, y = 0) {

//     // const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
//     const fixed_layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH | LAYOUT.TYPE_GROW_CONTAINER;
//     const fixed_layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT | LAYOUT.FIXED_WIDTH;
//     const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 0], dim: [4 * 100, 4 * 100], col: GREY[4], layout: fixed_layout_hor, name: 'Parent' }));
//     Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 5, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
//     section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);

//     let rect_cnt = 0;
//     let parent_cnt = 0;


//     const layout_hor = LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;
//     const layout_vert = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.GROW_VERTICAL | LAYOUT.GROW_HORIZONTAL;

//     const bright1=.24, bright2=.26, bright3=.5;
  

//     { // With dropdown widget
//         parent_cnt++;
//         const s1 = Create_rect_mesh(Style_rect_default_properties({ dim: [0, 0], pad: [10, 10], col: GREY[7], layout: layout_hor, name: `s${parent_cnt}` })); 
//         Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 5, }); 
//         section.AddItem(s1);

//         let hue = -0.05;
        
//         {
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }
//             { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); s1.AddItem(r2); }


//             { 
//                 const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(0,1,.8,1,.8), layout: layout_vert, name: 'rect' })); 
//                 Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
//                 s1.AddItem(rect2); 

//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
                
//             }
//             { 
//                 const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.56,1,1,1,.8), layout: layout_hor, name: 'rect' })); 
//                 Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
//                 s1.AddItem(rect2); 
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//             }
//             { 
//                 const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.13,1,1.,1,.8), layout: layout_hor, name: 'rect' })); 
//                 Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
//                 s1.AddItem(rect2); 
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//             }
//             { 
//                 const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: Color_hsv_to_rgb_calibrated(.22,1,.9,1,.8), layout: layout_vert, name: 'rect' })); 
//                 Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); 
//                 s1.AddItem(rect2); 
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//                 { const r2 = Create_widget_label(Style_label_default_properties({ text: `${rect_cnt++}`, pos: [0, 0, 1], pad: [5, 5], dim: [0, 0], theme: Color_theme_label_auto(hue+=0.05, .6, bright1, 1), layout: LAYOUT.HORIZONTAL, texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12 })); Widget_gfx_ready_enable({ mesh: r2, enable_sdf_rect: 10 }); rect2.AddItem(r2); }
//             }
            
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_hor, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//             // { const rect2 = Create_rect_mesh(Style_rect_default_properties({ pad: [5, 5], dim: [0, 0], col: GetSequencedColor(9), layout: layout_vert, name: 'rect' })); Widget_gfx_ready_enable({ mesh: rect2, enable_sdf_rect: 10 }); s1.AddItem(rect2); }
//         }

//     }




    
//     section.GenGfxCtx();
//     TEMP_Calculate_layout_grow_count(section);
//     // Layout_basic_pre_render(section);
//     Layout_grow_containers_pre_render_with_item_reposition(section);
//     // Layout_grow_containers_pre_render(section);
//     Widget_render(section);
// }




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
        const rot = (Timer_get_global_timer()) * 1;
        Mesh_rotate_z(mesh, rot);

    }, line1)

    return line1;
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

    Layout_basic_pre_render(section);
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
    Layout_basic_pre_render(section);
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
        // texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
        font_size: 40,
        // text: `1234567890`,
        text: `12`,
        is_debug_mesh: 0x0,
        // variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S8_0,
        pad: [10, 6],
    });
    Widget_gfx_ready_enable({ mesh: widget_text, enable_attr_dim: false, listener: { type: LISTEN_EVENT_TYPES.MOVE } });

    // widget_text.sid.inst = (SID.ATTR.COL4);
    widget_text.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3);
    // widget_text.sid.inst = (SID.ATTR.COL4|SID.ATTR.WPOS3|SID.ATTR.VPOS2);

    /********************************************************************************************************************************************************/
    // Render
    widget_text.GenGfxCtx();
    Widget_render(widget_text);

    // Vertex_buffer_calculate_vertexbuffer_render_group_starts();
    // View_render_from_view_NEW(widget_text.group_bufferidxs[0]);

}
function CreateTextInSectionWithNewLine() { // GOOD!! render text from widget text directly to a section or stand alone. ABLE TO create layout with VERTICAL alignment via the new implementation

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [50, 250, 0], col: TRANSPARENCY(GREY[7], .5) }));
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
    Layout_basic_pre_render(section);
    Widget_render(section);
    info1.GfxUniformSetAndUpdate('u_generic_controls', [.2, 1.]);

}
function CreateTextInSectionWithNewLineWithControls() { // GOOD!! render text from widget text directly to a section or stand alone. ABLE TO create layout with VERTICAL alignment via the new implementation
    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [50, 250, 0], col: TRANSPARENCY(GREY[7], .5) }));
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
    Layout_basic_pre_render(section);
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
        Layout_basic_pre_render(ctrl_panel);
    Widget_render(ctrl_panel);
    }
}
function CreateTextInSection(text, font_size) { // GOOD!! render text from widget text directly to a section or stand alone. ABLE TO create layout with VERTICAL alignment via the new implementation

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [50, 250, 0], col: TRANSPARENCY(GREY[7], .5) }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 1, listener:{type:LISTEN_EVENT_TYPES.MOVE}});


    const text_mesh = Create_widget_text({
        is_root: _,
        pos: [0, 0, 0],
        // col: Color_hsv_to_rgb_calibrated(.1, .8, 1, 1, 1., .0),
        col: Color_hsv_to_rgb_calibrated(.0, .0, 1, 1, 1., .0),
        // texture_id: TEXTURES.MTSDF_COMIC_1024,
        texture_id: TEXTURES.MTSDF_CONSOLAS_1024,
        texture_id: TEXTURES.CONSOLA_VARIANT_FONT,
        font_size: font_size,
        text: text,
        is_debug_mesh: 0x0,
        variant_idx: ATLAS_TEXTURE_VARIANT_FONT_CONSOLA_SCALES.S1_5,
        pad: [10, 6],
        layout: LAYOUT.HORIZONTAL,
    });
    Widget_gfx_ready_enable({ mesh: text_mesh, enable_attr_dim: false });
    section.AddItem(text_mesh);
    // text_mesh.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, 2);


    /********************************************************************************************************************************************************/
    // Render
    section.GenGfxCtx();
    Layout_basic_pre_render(section);
    Widget_render(section);
    // text_mesh.GfxUniformSetAndUpdate('u_generic_controls', [.2, 1.]);
    // text_mesh.GfxUniformSetAndUpdate('u_generic_controls', [.5, .4]);

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
    Layout_basic_pre_render(section);
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
    Layout_basic_pre_render(section);
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
function Pivotal_rotation_horizontal_2mesh_rigging(x=300, y=300) {

    const marg = [20, 20];
    const dim = [120, 20];


    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: [x,y,0], dim: dim, col: BLUEL[5], name: 'section', layout:LAYOUT.HORIZONTAL }));
    // Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect:10, enable_attr_angle:true});
    Widget_gfx_ready_enable({ mesh: section, });
    section.GenGfxCtx();
    Layout_basic_pre_render(section);
    Widget_render(section);
    
    const section2 = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: [x+dim[0]*2,y,0], dim: dim, col: Color_hsv_to_rgb_calibrated(.28,1,1,.5,.7,0), name: 'section2', layout:LAYOUT.HORIZONTAL }));
    // Widget_gfx_ready_enable({ mesh: section2, enable_sdf_rect:10, enable_attr_angle:true, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    Widget_gfx_ready_enable({ mesh: section2, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    section2.GenGfxCtx();
    Layout_basic_pre_render(section2);
    Widget_render(section2);


    const origin = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: [x-10,y+10,0], dim: [10,10], col: Color_hsv_to_rgb_calibrated(.12,1,1,.5,.7,0), name: 'section2', layout:LAYOUT.HORIZONTAL }));
    // Widget_gfx_ready_enable({ mesh: origin, enable_sdf_rect:10, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    Widget_gfx_ready_enable({ mesh: origin, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    origin.GenGfxCtx();
    Widget_render(origin);

    {
        const slider = CreateSlider(_, 10, 10, 0., 'Smooth', 340);

        const params = {
            target_mesh: section,
            follow_mesh: section2,
        };

        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            const rot = slider_val * (Math.PI * 4);
            
            const vertex_positions = Mesh_rotate_z_with_pivot(target_mesh, rot, -target_mesh.geom.dim[0], 0);

            const follow_mesh = params.clbk_params.follow_mesh;

            const new_vposx = (vertex_positions[0]+vertex_positions[2]+vertex_positions[4]+vertex_positions[6])/2;
            const new_vposy = (vertex_positions[1]+vertex_positions[3]+vertex_positions[5]+vertex_positions[7])/2;


            const x = follow_mesh.geom.pos[0] + new_vposx;
            const y = follow_mesh.geom.pos[1] + new_vposy;

            Gl_set_wpos_x(follow_mesh.gfx, x+follow_mesh.geom.dim[0],);
            Gl_set_wpos_y(follow_mesh.gfx, y+follow_mesh.geom.dim[1],);
        }, params,
        );

    }

    return section;
}
function Pivotal_rotation_vertical_2mesh_rigging(x=300, y=300) {

    const marg = [20, 20];
    const dim = [20, 120];


    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: [x,y,0], dim: dim, col: BLUEL[5], name: 'section', layout:LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: section, });
    section.GenGfxCtx();
    Layout_basic_pre_render(section);
    Widget_render(section);
    
    const section2 = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: [x,y+dim[1]*2,0], dim: dim, col: Color_hsv_to_rgb_calibrated(.28,1,1,.5,.7,0), name: 'section2', layout:LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: section2, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    section2.GenGfxCtx();
    Layout_basic_pre_render(section2);
    Widget_render(section2);


    const origin = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: [x+10,y-10,0], dim: [10,10], col: Color_hsv_to_rgb_calibrated(.12,1,1,.5,.7,0), name: 'section2', layout:LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: origin, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    origin.GenGfxCtx();
    Widget_render(origin);


    {
        const slider = CreateSlider(_, 10, 10, 0., 'Smooth', 340);

        const params = {
            target_mesh: section,
            follow_mesh: section2,
        };

        Slider_connect(slider, (params, slider_val) => {

            const target_mesh = params.clbk_params.target_mesh;
            const rot = slider_val * (Math.PI * 4);
            
            const vertex_positions = Mesh_rotate_z_with_pivot(target_mesh, rot, 0, -target_mesh.geom.dim[1]);

            const follow_mesh = params.clbk_params.follow_mesh;

            const new_vposx = (vertex_positions[0]+vertex_positions[2]+vertex_positions[4]+vertex_positions[6])/2;
            const new_vposy = (vertex_positions[1]+vertex_positions[3]+vertex_positions[5]+vertex_positions[7])/2;


            const x = follow_mesh.geom.pos[0] + new_vposx;
            const y = follow_mesh.geom.pos[1] + new_vposy;

            Gl_set_wpos_x(follow_mesh.gfx, x+follow_mesh.geom.dim[0],);
            Gl_set_wpos_y(follow_mesh.gfx, y+follow_mesh.geom.dim[1],);
        }, params,
        );
    }

    return section;
}
function Pivotal_robot_rigging(x=300, y=300) {

    const create_robot = function (player, player_dim_x, player_dim_y, player_pos_x, player_pos_y){
    
        // const ratios = {
        //     head_x:.5, head_y:.26,
        //     body_x:.8,  body_y:.19,
        //     arms_x:.28, arms_y:.4,
        //     legs_x:.34, legs_y:.34,
        // };
        const ratios = {
            head_x:.4, head_y:.26,
            body_x:.7,  body_y:.18,
            arms_x:.24, arms_y:.45,
            legs_x:.30, legs_y:.38,
        };
        const a = 1.0;
        const bright = 1.0;

        const head_dim_x = player_dim_x*ratios.head_x;
        const head_dim_y = player_dim_y*ratios.head_y;
        const head_pos_x = player_pos_x + player_dim_x - head_dim_x;
        const head_pos_y = (player_pos_y);

        const head = Create_rect_mesh(Style_rect_default_properties({pos:[head_pos_x, head_pos_y, 0], dim:[head_dim_x, head_dim_y],col:Color_hsv_to_rgb_calibrated(.11, 1., 1., 1., 1., .0), name:'Player-Head', }));
        Widget_gfx_ready_enable({mesh:head, }); 
        player.AddItem(head);

        const body_dim_x = player_dim_x*ratios.body_x;
        const body_dim_y = player_dim_y*ratios.body_y;
        const body_pos_x = head.geom.pos[0] + head.geom.dim[0] - body_dim_x;
        const body_pos_y = (head.geom.pos[1] + head_dim_y*2);

        const arm_dim_x = player_dim_x*ratios.arms_x;
        const arm_dim_y = player_dim_y*ratios.arms_y;
        const arm_pos_x = body_pos_x ;
        const arm_pos_y = body_pos_y;

        const leg_dim_x = player_dim_x*ratios.legs_x;
        const leg_dim_y = player_dim_y*ratios.legs_y;
        const leg_pos_x = body_pos_x;
        const leg_pos_y = (body_pos_y + body_dim_y*2*2);

        const arm_lt = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.10, 1., 1., a, bright, .0), name:'Player-arm-left-top', }));
        Widget_gfx_ready_enable({mesh:arm_lt,  }); 
        player.AddItem(arm_lt);
        const arm_lb = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y+arm_dim_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.21, 1., 1, a, bright, .0), name:'Player-arm-left-bot', }));
        Widget_gfx_ready_enable({mesh:arm_lb}); 
        player.AddItem(arm_lb);

        const leg_lt = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.73, 1., 1., a, .8, .0), name:'Player-leg-left-top', }));
        Widget_gfx_ready_enable({mesh:leg_lt,  }); 
        player.AddItem(leg_lt);
        const leg_lb = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y+leg_dim_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.86, 1., 1., a, bright, .0), name:'Player-leg-left-bot', }));
        Widget_gfx_ready_enable({mesh:leg_lb,  }); 
        player.AddItem(leg_lb);


        const body = Create_rect_mesh(Style_rect_default_properties({pos:[body_pos_x, body_pos_y, 0], dim:[body_dim_x, body_dim_y],col:Color_hsv_to_rgb_calibrated(.48, 1., 1., a, bright, .0), name:'Player-Body1', }));
        Widget_gfx_ready_enable({mesh:body,  }); 
        player.AddItem(body);
        const body2 = Create_rect_mesh(Style_rect_default_properties({is_root:0x0, pos:[body_pos_x, body_pos_y+body_dim_y*2, 0], dim:[body_dim_x, body_dim_y],col:Color_hsv_to_rgb_calibrated(.57, 1., 1., a, bright, .0), name:'Player-Body2', }));
        Widget_gfx_ready_enable({mesh:body2,  }); 
        player.AddItem(body2);


        // Legs
        const leg_rt = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.9, 1., 1., a, bright, .0), name:'Player-leg-right-top', }));
        Widget_gfx_ready_enable({mesh:leg_rt,  }); 
        player.AddItem(leg_rt);
        const leg_rb = Create_rect_mesh(Style_rect_default_properties({pos:[leg_pos_x+body_dim_x-leg_dim_x, leg_pos_y+leg_dim_y, 0], dim:[leg_dim_x, leg_dim_y/2],col:Color_hsv_to_rgb_calibrated(.34, 1., 1, a, bright, .0), name:'Player-leg-right-bot', }));
        Widget_gfx_ready_enable({mesh:leg_rb,  }); 
        player.AddItem(leg_rb);

        // Right Arm
        const arm_rt = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.29, 1., 1., a, bright, .0), name:'Player-arm-right-top', }));
        Widget_gfx_ready_enable({mesh:arm_rt,  }); 
        player.AddItem(arm_rt);
        const arm_rb = Create_rect_mesh(Style_rect_default_properties({pos:[arm_pos_x+body_dim_x-arm_dim_x, arm_pos_y+arm_dim_y, 0], dim:[arm_dim_x, arm_dim_y/2],col:Color_hsv_to_rgb_calibrated(.43, 1., 1, a, bright, .0), name:'Player-arm-right-bot', }));
        Widget_gfx_ready_enable({mesh:arm_rb,  }); 
        player.AddItem(arm_rb);

    }

    const marg = [20, 20];
    const dim = [200, 300];


    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: [x,y,0], dim: dim, col: Color_hsv_to_rgb_calibrated(.16, 0., 1., 1., .25, .0), name: 'section', layout:LAYOUT.HORIZONTAL }));
    Widget_gfx_ready_enable({ mesh: section, listener:{type:LISTEN_EVENT_TYPES.MOVE}});

    create_robot(section, dim[0], dim[0]*1.66, x, y)
    
    section.GenGfxCtx();
    Widget_render(section);
    

    let sliders_ypos = 10;

    // {
    //     const slider = CreateSlider(_, 10, 10, 0., 'Smooth', 340);

    //     const child = section.children.buffer;
    //     const params = {
    //         target_mesh: section,
    //         head:child[0],
    //         body:{top:child[3], bottom:child[4],},
    //         arms:{left_t:child[1], left_b:child[2],right_t:child[9],right_b:child[10],},
    //         legs:{left_t:child[5], left_b:child[6],right_t:child[7],right_b:child[8],},
    //     };

    //     Slider_connect(slider, (params, slider_val) => {

    //         const target_mesh = params.clbk_params.target_mesh;
    //         const   head = params.clbk_params.head,
    //                 body_t = params.clbk_params.body.top,
    //                 body_b = params.clbk_params.body.bottom,
    //                 arm_lt = params.clbk_params.arms.left_t,
    //                 arm_lb = params.clbk_params.arms.left_b,
    //                 arm_rt = params.clbk_params.arms.right_t,
    //                 arm_rb = params.clbk_params.arms.right_b,
    //                 leg_lt = params.clbk_params.legs.left_t,
    //                 leg_lb = params.clbk_params.legs.left_b,
    //                 leg_rt = params.clbk_params.legs.right_t,
    //                 leg_rb = params.clbk_params.legs.right_b;

            
    //         const rot = slider_val * (Math.PI * 4);
            
    //         const vertex_positions = Mesh_rotate_z_with_pivot(leg_rt, rot, 0, -leg_rt.geom.dim[1]);

    //         const follow_mesh = leg_rb;

    //         const new_vposx = (vertex_positions[0]+vertex_positions[2]+vertex_positions[4]+vertex_positions[6])/2;
    //         const new_vposy = (vertex_positions[1]+vertex_positions[3]+vertex_positions[5]+vertex_positions[7])/2;


    //         const x = follow_mesh.geom.pos[0] + new_vposx;
    //         const y = follow_mesh.geom.pos[1] + new_vposy;

    //         Gl_set_wpos_x(follow_mesh.gfx, x+follow_mesh.geom.dim[0],);
    //         Gl_set_wpos_y(follow_mesh.gfx, y+follow_mesh.geom.dim[1],);
    //     }, params,
    //     );
    // }
    {
        const slider = CreateSlider(_, 10, sliders_ypos, 0., 'right arm', 340);
        sliders_ypos+=50
        const child = section.children.buffer;
        const params = {
            target_mesh: section,
            arms:{left_t:child[1], left_b:child[2],right_t:child[9],right_b:child[10],},
        };

        Slider_connect(slider, (params, slider_val) => {

            const   target_mesh = params.clbk_params.arms.left_t,
                    follow_mesh = params.clbk_params.arms.left_b;

            
            const rot = slider_val * (Math.PI * 4);
            
            const vertex_positions = Mesh_rotate_z_with_pivot(target_mesh, rot, 0, -target_mesh.geom.dim[1]);

            const new_vposx = (vertex_positions[0]+vertex_positions[2]+vertex_positions[4]+vertex_positions[6])/2;
            const new_vposy = (vertex_positions[1]+vertex_positions[3]+vertex_positions[5]+vertex_positions[7])/2;


            const x = follow_mesh.geom.pos[0] + new_vposx;
            const y = follow_mesh.geom.pos[1] + new_vposy;

            Gl_set_wpos_x(follow_mesh.gfx, x+follow_mesh.geom.dim[0],);
            Gl_set_wpos_y(follow_mesh.gfx, y+follow_mesh.geom.dim[1],);
        }, params,
        );
    }
    {
        const slider = CreateSlider(_, 10, sliders_ypos, 0., 'left arm', 340);
        sliders_ypos+=50

        const child = section.children.buffer;
        const params = {
            arms:{left_t:child[1], left_b:child[2],right_t:child[9],right_b:child[10],},
        };

        Slider_connect(slider, (params, slider_val) => {

            const   target_mesh = params.clbk_params.arms.right_t,
                    follow_mesh = params.clbk_params.arms.right_b;

            
            const rot = slider_val * (Math.PI * 4);
            
            const vertex_positions = Mesh_rotate_z_with_pivot(target_mesh, rot, 0, -target_mesh.geom.dim[1]);

            const new_vposx = (vertex_positions[0]+vertex_positions[2]+vertex_positions[4]+vertex_positions[6])/2;
            const new_vposy = (vertex_positions[1]+vertex_positions[3]+vertex_positions[5]+vertex_positions[7])/2;


            const x = follow_mesh.geom.pos[0] + new_vposx;
            const y = follow_mesh.geom.pos[1] + new_vposy;

            Gl_set_wpos_x(follow_mesh.gfx, x+follow_mesh.geom.dim[0],);
            Gl_set_wpos_y(follow_mesh.gfx, y+follow_mesh.geom.dim[1],);
        }, params,
        );
    }
    {
        const slider = CreateSlider(_, 10, sliders_ypos, 0., 'right leg', 340);
        sliders_ypos+=50

        const child = section.children.buffer;
        const params = {
            legs:{left_t:child[3], left_b:child[4],right_t:child[7],right_b:child[8],},
        };

        Slider_connect(slider, (params, slider_val) => {

            const   target_mesh = params.clbk_params.legs.right_t,
                    follow_mesh = params.clbk_params.legs.right_b;

            
            const rot = slider_val * (Math.PI * 4);
            
            const vertex_positions = Mesh_rotate_z_with_pivot(target_mesh, rot, 0, -target_mesh.geom.dim[1]);

            const new_vposx = (vertex_positions[0]+vertex_positions[2]+vertex_positions[4]+vertex_positions[6])/2;
            const new_vposy = (vertex_positions[1]+vertex_positions[3]+vertex_positions[5]+vertex_positions[7])/2;


            const x = follow_mesh.geom.pos[0] + new_vposx;
            const y = follow_mesh.geom.pos[1] + new_vposy;

            Gl_set_wpos_x(follow_mesh.gfx, x+follow_mesh.geom.dim[0],);
            Gl_set_wpos_y(follow_mesh.gfx, y+follow_mesh.geom.dim[1],);
        }, params,
        );
    }
    {
        const slider = CreateSlider(_, 10, sliders_ypos, 0., 'left leg', 340);
        sliders_ypos+=50

        const child = section.children.buffer;
        const params = {
            legs:{left_t:child[3], left_b:child[4],right_t:child[7],right_b:child[8],},
        };

        Slider_connect(slider, (params, slider_val) => {

            const   target_mesh = params.clbk_params.legs.left_t,
                    follow_mesh = params.clbk_params.legs.left_b;

            
            const rot = slider_val * (Math.PI * 4);
            
            const vertex_positions = Mesh_rotate_z_with_pivot(target_mesh, rot, 0, -target_mesh.geom.dim[1]);

            const new_vposx = (vertex_positions[0]+vertex_positions[2]+vertex_positions[4]+vertex_positions[6])/2;
            const new_vposy = (vertex_positions[1]+vertex_positions[3]+vertex_positions[5]+vertex_positions[7])/2;


            const x = follow_mesh.geom.pos[0] + new_vposx;
            const y = follow_mesh.geom.pos[1] + new_vposy;

            Gl_set_wpos_x(follow_mesh.gfx, x+follow_mesh.geom.dim[0],);
            Gl_set_wpos_y(follow_mesh.gfx, y+follow_mesh.geom.dim[1],);
        }, params,
        );
    }

    return section;
}

function SectionResizable(pos, dim= [200, 200]) {

    const tr = 1.;
    const marg = [10, 10];

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: pos, dim: dim, col: TRANSPARENCY(BLUEL[5], tr), name: `section${grey_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } })
    section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);


    section.GenGfxCtx();
    Widget_render(section);

    return section;
}
function CreateRect(pos) {

    const tr = 1.;
    const marg = [10, 10];
    const dim = [200, 200];

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: marg, pos: pos, dim: dim, col: TRANSPARENCY(BLUEL[5], tr), name: `section${grey_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


    section.GenGfxCtx();
    Widget_render(section);

    return section;
}
function CreateSectionedButtons(pos, name = 'NO NAME') {

    const section = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: pos, dim: [0, 0], col: GREY[1], name: name, }));
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
    Layout_basic_pre_render(section);
    Widget_render(section);
    return section;
}
function CreateLabel(is_root = ROOT_WIDGETS.CREATE_ROOT, name = 'Label', font, variant_idx, x = 0, y = 0, color = BLUEL[5], vb_groupidx = INT_NULL, text_vb_groupidx = INT_NULL, font_size = 20) {

    const label = Create_widget_label(Style_label_default_properties({
        is_root: is_root,
        pos: [x, y, 0],
        // pos: [0, 0, 0],
        col: color,
        // text_pad: [20, 6],
        text_pad: [0, 0],
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
function CreateSlider(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, initial_val = .5, name = 'S', dimx=120) {

    const pos = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? [x, y, 0] : [0, 0, 0]


    const slider = Create_widget_slider(Style_slider_default_properties({
        is_root: ROOT_WIDGETS.CREATE_ROOT,
        pos: pos,
        dim: [dimx, 15],
        // name: 'Slider Sample',
        name: name,
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
    // Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: dim[1], enable_attr_angle: 2, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })
    Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: dim[1], listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })
    // Widget_gfx_ready_enable({ mesh: line, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })

    line.sid.inst = (SID.ATTR.COL4 | SID.ATTR.WPOS3);
    line.GenGfxCtx();
    Widget_render(line);

    return line;
}
/** */
function Instanced_geometry(col, pos, dim) {

    const panel = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [0, 0], pos: pos, dim: dim, col: Color_hsv_to_rgb_calibrated(0,0,1.,1.,.1,0), name: 'instanced geom panel', }));
    Widget_gfx_ready_enable({ mesh: panel, enable_sdf_rect: 10, })

    const w=200, h=2., d=1, r_corners = 1;
    let hue = .1;
    // const inst_attribs = (SID.ATTR.COL4 | SID.ATTR.WPOS3);
    // const inst_attribs = (SID.ATTR.COL4 | SID.ATTR.WPOS3 | SID.ATTR.DIM2);
    // const inst_attribs = (SID.ATTR.WPOS3 | SID.ATTR.DIM2);
    const inst_attribs = (SID.ATTR.WPOS3);
    // const inst_attribs = (SID.ATTR.COL4 | SID.ATTR.WPOS3);

    for(let i = 0; i < 10; i++) {

        const line = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [10,(d+h)*((i+1)*2),0], dim: [w,h], col: Color_hsv_to_rgb_calibrated(hue+=.01,1,1.,1.,1.,0), name: `line-inst ${i}`,  }));
        Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: r_corners, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })
        panel.AddItem(line);
        line.sid.inst = inst_attribs;

    }
    // {
    //     const line = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [10,(d+h)*2,0], dim: [w,h], col: Color_hsv_to_rgb_calibrated(.3,1,1.,1.,.4,0), name: 'line-inst 1',  }));
    //     Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: r_corners, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })
    //     panel.AddItem(line);
    //     line.sid.inst = inst_attribs;
    // }
    // {
    //     const line = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [10,(d+h)*4,0], dim: [w,h], col: Color_hsv_to_rgb_calibrated(.13,1,1.,1.,.4,0), name: 'line-inst 2',  }));
    //     Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: r_corners, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })
    //     panel.AddItem(line);
    //     line.sid.inst = inst_attribs;
    // }
    // {
    //     const line = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [10,(d+h)*6,0], dim: [w,h], col: Color_hsv_to_rgb_calibrated(.78,1,1.,1.,.5,0), name: 'line-inst 3',  }));
    //     Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: r_corners, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })
    //     panel.AddItem(line);
    //     line.sid.inst = inst_attribs;
    // }
    // {
    //     const line = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [10,(d+h)*8,0], dim: [w,h], col: Color_hsv_to_rgb_calibrated(.6,1,1.,1.,.5,0), name: 'line-inst 4',  }));
    //     Widget_gfx_ready_enable({ mesh: line, enable_sdf_rect: r_corners, listener: { type: LISTEN_EVENT_TYPES.MOVE | LISTEN_EVENT_TYPES.HOVER } })
    //     panel.AddItem(line);
    //     line.sid.inst = inst_attribs;
    // }

    panel.GenGfxCtx();
    Widget_render(panel);

    return panel;
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


    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: is_root, text: `ROOT`, pos: pos, col: dp_col, menu_col: menu_col, btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })
    // dp.menu.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.RENDER_GROUP_NEW);


    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;


    zpos++
    { // Many dps

        const sub_dp1_count = 2;
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

            const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp2' }));
            Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            // dpsub1.menu.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.RENDER_GROUP_NEW);
            // dpsub1.menu.gfx_ctx_flags = (GFX_CTX_FLAGS.RENDER_GROUP_NEW);
            dp.AddToMenu(dpsub1);
            
            const col1 = TRANSPARENCY(PURPLEB[6], 1.);
            for (let j = 0; j < sub_dp1_count; j++) {
                
                const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp3' }));
                Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                // dpsub2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.RENDER_GROUP_NEW);
                dpsub2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                dpsub1.AddToMenu(dpsub2);

                const col2 = TRANSPARENCY(GREEN[6], 1.)

                for (let k = 0; k < sub_dp2_count; k++) {

                    const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
                    Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                    dpsub3.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
                    // dpsub3.RenderToNewRenderGroup();
                    dpsub2.AddToMenu(dpsub3);

                    { // Label

                        const d = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
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

                    //     const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col3, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
                    //     Widget_gfx_ready_enable({ mesh: dpsub4, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                    //     dpsub4.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                    //     dpsub3.AddToMenu(dpsub4);

                    //     const col4 = TRANSPARENCY(PURPLER[6], 1.)
                    //     for (let m = 0; m < 10; m++) {

                    //         const dpsub5 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}${m}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col4, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
                    //         Widget_gfx_ready_enable({ mesh: dpsub5, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
                    //         dpsub5.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                    //         dpsub4.AddToMenu(dpsub5);

                    //     }
                    // }
                }
                for (let k = 0; k < sub_dp2_count; k++) {

                    const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
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
        Layout_basic_pre_render(dp);
        Widget_render(dp);

    }

    return dp;
}
/** */
function Create_dropdown_hsv_coloring(pos = [0, 0, 0], is_root = ROOT_WIDGETS.CREATE_ROOT) {

    const text_pad = [12, 6];
    const pad = [6, 6];
    const font_size = 8;
    const dp_rcorners = 7;
    const menu_rcorners = 7;
    const btn_rcorners = 7;
    const dp_col = GREY[4];
    const menu_col = GREY[2];


    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ 
        is_root: is_root, text: `Menu`, 
        // theme: Color_theme_dropdown_auto(.12, 1., .18, 1.),
        theme: Color_theme_dropdown_auto(.0, .0, .18, 1.0),
        pos: pos, col: dp_col, 
        pad: pad, text_pad: text_pad, font_size: font_size, 
        layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF 
    }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.MOVE } })
    // dp.menu.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.RENDER_GROUP_NEW);


    Dropdown_roots_set_root(dp, dp);

    let zpos = 0;


    zpos++
    { // Many dps

        const sub_dp1_count = 5;
        // const sub_dp2_count = 1;

        const increments = 1/sub_dp1_count; 
        let contrast =  .18, saturation = 0;
        for (let i = 0; i < sub_dp1_count; i++) {

            { // Label
                const count = 1; const brightness_increments = 1/count; let brightness =  0;
                for (let i = 0; i < count; i++) {
                    const l = Create_widget_label(Style_label_default_properties({ 
                        theme: Color_theme_label_auto(.12, saturation, .18, 0), 
                        text: `0123`, name:'label',
                        pos: [0, 0, 1], 
                        font_size: font_size, 
                        text_pad: [6, 4], 
                        layout:LAYOUT.VERTICAL, 
                    }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    dp.AddToMenu(l);
                    l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                    brightness += brightness_increments;
                }
            }

            { // Label
                const count = 1; const brightness_increments = 1/count; let brightness =  0;
                for (let i = 0; i < count; i++) {
                    const l = Create_widget_label(Style_label_default_properties({ 
                        theme: Color_theme_label_auto(.12, .6, contrast, 0), 
                        text: `0123`, name:'label',
                        pos: [0, 0, 1], 
                        font_size: font_size, 
                        text_pad: [6, 4], 
                        layout:LAYOUT.HORIZONTAL, 
                    }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    dp.AddToMenu(l);
                    l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
                    brightness += brightness_increments;
                }
            }

            // const dpsub1 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}`, pos: [0, 0, zpos + 1], col: dp_col, menu_col: menu_col, btn_col: col, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp2' }));
            // Widget_gfx_ready_enable({ mesh: dpsub1, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            // // dpsub1.menu.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.RENDER_GROUP_NEW);
            // // dpsub1.menu.gfx_ctx_flags = (GFX_CTX_FLAGS.RENDER_GROUP_NEW);
            // dp.AddToMenu(dpsub1);
            
            // const col1 = TRANSPARENCY(PURPLEB[6], 1.);
            // for (let j = 0; j < sub_dp1_count; j++) {
                
            //     const dpsub2 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${i}${j}`, pos: [0, 0, zpos + 2], col: dp_col, menu_col: menu_col, btn_col: col1, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp3' }));
            //     Widget_gfx_ready_enable({ mesh: dpsub2, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            //     // dpsub2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_CHILDREN_DESC|GFX_CTX_FLAGS.RENDER_GROUP_NEW);
            //     dpsub2.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
            //     dpsub1.AddToMenu(dpsub2);

            //     const col2 = TRANSPARENCY(GREEN[6], 1.)

            //     for (let k = 0; k < sub_dp2_count; k++) {

            //         const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
            //         Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            //         dpsub3.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
            //         // dpsub3.RenderToNewRenderGroup();
            //         dpsub2.AddToMenu(dpsub3);

            //         { // Label

            //             const d = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
            //             Widget_gfx_ready_enable({ mesh: d, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            //             d.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
            //             // d.RenderToNewRenderGroup();
            //             dpsub3.AddToMenu(d);

            //             const l = Create_widget_label(Style_label_default_properties({ text: `${i}123`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout: LAYOUT.VERTICAL, name: 'label' }));
            //             Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            //             d.AddToMenu(l);
            //             l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);

            //             { // Label
            //                 const count = 4; const brightness_increments = 1 / count; let brightness = 0;
            //                 for (let i = 0; i < count; i++) {
            //                     const l = Create_widget_label(Style_label_default_properties({ text: `${i}123`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout: LAYOUT.VERTICAL, name: 'label' }));
            //                     Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            //                     dpsub3.AddToMenu(l);
            //                     l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
            //                     brightness += brightness_increments;
            //                 }
            //             }
            //         }

            //         // const col3 = TRANSPARENCY(YELLOW[6], 1.)
            //         // for (let n = 0; n < sub_dp2_count; n++) {

            //         //     const dpsub4 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col3, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
            //         //     Widget_gfx_ready_enable({ mesh: dpsub4, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            //         //     dpsub4.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            //         //     dpsub3.AddToMenu(dpsub4);

            //         //     const col4 = TRANSPARENCY(PURPLER[6], 1.)
            //         //     for (let m = 0; m < 10; m++) {

            //         //         const dpsub5 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${k}${n}${m}`, pos: [0, 0, zpos + 4], col: dp_col, menu_col: menu_col, btn_col: col4, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
            //         //         Widget_gfx_ready_enable({ mesh: dpsub5, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            //         //         dpsub5.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);
            //         //         dpsub4.AddToMenu(dpsub5);

            //         //     }
            //         // }
            //     }
            //     for (let k = 0; k < sub_dp2_count; k++) {

            //         const dpsub3 = Create_widget_dropdown(Style_dropdown_default_properties({ is_root: 0x0, text: `${j}${k}`, pos: [0, 0, zpos + 3], col: dp_col, menu_col: menu_col, btn_col: col2, text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'dp4' }));
            //         Widget_gfx_ready_enable({ mesh: dpsub3, enable_sdf_rect: dp_rcorners, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
            //         dpsub3.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
            //         // dpsub3.RenderToNewRenderGroup();
            //         dpsub2.AddToMenu(dpsub3);

            //         { // Label
            //             const count = 4; const brightness_increments = 1 / count; let brightness = 0;
            //             for (let i = 0; i < count; i++) {
            //                 const l = Create_widget_label(Style_label_default_properties({ text: `${i}123`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout: LAYOUT.VERTICAL, name: 'label' }));
            //                 Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            //                 dpsub3.AddToMenu(l);
            //                 l.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL | GFX_CTX_FLAGS.RENDER_GROUP_FROM_NEW);
            //                 brightness += brightness_increments;
            //             }
            //         }
            //     }
            // }

            contrast += .05;
            saturation += increments;
        }
    }


    if (is_root & ROOT_WIDGETS.CREATE_ROOT) {

        dp.GenGfxCtx();
        Layout_basic_pre_render(dp);
        // Layout_expand_x_axis(dp);
        Widget_render(dp);

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
        Layout_basic_pre_render(dp);

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
    Layout_basic_pre_render(dp)
    Widget_render(dp);


    return dp;
}
/** */
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
    Layout_basic_pre_render(section);

    Widget_render(section);

}
/** */
function CreateManySections(scene) {

    const tr = 1.;
    const rcorners1 = 10;

    const blu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [0, 400, 0], dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ 
        mesh: blu, enable_sdf_rect: rcorners1, 
        set_state:MESH_STATE_FLAGS.IS_RESIZEABLE,
        listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE, }, 
        scroller: { width: 10, max_height: 300, }, 
    });


    const red = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    blu.AddItem(red);
    red.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently


    {
        const black = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 1], dim: [20, 20], col: TRANSPARENCY(BLACK, tr), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
        Widget_gfx_ready_enable({ mesh: black, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        black.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF
        red.AddItem(black);

        {
            const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
            Widget_gfx_ready_enable({ mesh: grey_1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
            black.AddItem(grey_1);

            // {
            //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
            // }
            {
                const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
                Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
                grey_1.AddItem(s);

                {
                    //   const s1 = Sections2(_, LAYOUT.VERTICAL);   grey_1.AddItem(s1);
                      const s1 = s;
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL);   s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL);   s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL);   s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.HORIZONTAL); s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL);   s1.AddItem(s2); }
                    { const s2 = Sections2(_, LAYOUT.VERTICAL);   s1.AddItem(s2); }

                }

                // {
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 30], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [40, 10], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
                // }
            }
        }

        // {
        //     const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
        //     Widget_gfx_ready_enable({ mesh: grey_1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
        //     black.AddItem(grey_1);

        //     {
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //     }
        //     {
        //         const s = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[2], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
        //         Widget_gfx_ready_enable({ mesh: s, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
        //         grey_1.AddItem(s);

        //         {
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [10, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 30], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [40, 10], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [50, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //             { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [30, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); s.AddItem(s1); }
        //         }
        //     }
        // }

        // {
        //     const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
        //     Widget_gfx_ready_enable({ mesh: grey_1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
        //     black.AddItem(grey_1);

        //     {
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.VERTICAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //         { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
        //     }
        // }

    }




    blu.GenGfxCtx();
    Layout_basic_pre_render(blu);
    Widget_render(blu);


    const scroller_comp = Components_get_scroller_component(blu.scroller_comp_idx);
    Scoller_component_set_scrolled_section(scroller_comp, red, blu.scroller_comp_idx);
    // Scroller_component_set_pos_from_scrolled_section(scroller_comp);
    Scroller_component_calculate_handle_pos_dim(scroller_comp);

    return blu;
}
/** */
function Test_adding_mesh_to_a_view_group_after_has_been_rendered() {

    const tr = 1.;
    const rcorners1 = 10;

    const blu = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [0, 100, 0], dim: [100, 100], col: TRANSPARENCY(BLUEL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'blu' }));
    Widget_gfx_ready_enable({ mesh: blu, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })


    const red = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(REDL[7], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'red' }));
    Widget_gfx_ready_enable({ mesh: red, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    blu.AddItem(red);

    // const label = CreateLabel(0x0, '|||||||||||', TEXTURES.MTSDF_CONSOLAS_1024, _, 0, 0, GREEN[5], _, _, 18);
    // blu.AddItem(label)

    // {
    //     const black = Create_rect_mesh(Style_rect_default_properties({ pad: [15, 15], pos: [0, 0, 1], dim: [20, 20], col: TRANSPARENCY(BLACK, tr), layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    //     Widget_gfx_ready_enable({ mesh: black, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //     black.align.flags = LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF
    //     red.AddItem(black);

    //     {
    //         // const grey_1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[4], tr), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    //         // Widget_gfx_ready_enable({ mesh: grey_1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //         // black.AddItem(grey_1);

    //         // {
    //         //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
    //         //     { const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [0, 0], pos: [0, 0, 2], dim: [20, 20], col: TRANSPARENCY(GREY[7], tr), layout: LAYOUT.HORIZONTAL })); Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); grey_1.AddItem(s1); }
    //         // }
       
    //     }


    // }


    blu.GenGfxCtx();
    Layout_basic_pre_render(blu);
    Widget_render(blu);


    /********************************************************************************************************************************************/
    // EXAMPLE: Add two simple rect meshes, one of which  has a child
    // { /** Add rect */
    //     const newmesh = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [300, 100, 0], dim: [20, 20], col: TRANSPARENCY(PURPLER[7], tr), layout: LAYOUT.HORIZONTAL, name:'newmesh' }));
    //     Widget_gfx_ready_enable({ mesh: newmesh, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } });
    //     newmesh.SetViewGroupIndex(blu.group_bufferidxs[0]);
    //     newmesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    //     newmesh.GenGfxCtx();
    //     Widget_render(newmesh);
    // }
    // { /** Add rect */
    //     const newmesh = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [15, 15], pos: [100, 100, 0], dim: [20, 20], col: TRANSPARENCY(PURPLER[7], tr), layout: LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:'newmesh' }));
    //     Widget_gfx_ready_enable({ mesh: newmesh, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER | LISTEN_EVENT_TYPES.MOVE } })
    //     const n = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: [0, 0], pos: [0, 0, 0], dim: [20, 20], col: TRANSPARENCY(GREEN[7], tr), layout: LAYOUT.HORIZONTAL, name:'newmesh' }));
    //     Widget_gfx_ready_enable({ mesh: n, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.HOVER } })
    //     newmesh.AddItem(n);

    //     newmesh.SetViewGroupIndex(blu.group_bufferidxs[0]);
    //     newmesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    //     newmesh.GenGfxCtx();
    //     Layout_basic_pre_render(newmesh);
    //     Widget_render(newmesh);
    // }
    

    /********************************************************************************************************************************************/
    // EXAMPLE: Add two simple label meshes
    let l_y_pos = 20;
    { /** Add label mesh */
        const newmesh = Create_widget_label(Style_label_default_properties({
            is_root: _, 
            // is_root: ROOT_WIDGETS.CREATE_ROOT,
            pos: [20,l_y_pos, 0], col: TRANSPARENCY(PURPLER[7], tr), text_pad: [0, 0], text: '1234',
            texture_id: TEXTURES.MTSDF_CONSOLAS_1024, font_size: 12, layout: LAYOUT.VERTICAL, is_debug_mesh: false,
        }));
        Widget_gfx_ready_enable({ mesh: newmesh, enable_sdf_rect: 4, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        
        // newmesh.parent = blu;
        // blu.AddItem(newmesh);
        newmesh.SetViewGroupIndex(blu.group_bufferidxs[0]);
        // View_buffer_remove_group(1);
        newmesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET|GFX_CTX_FLAGS.RENDER_GROUP_MATCH_FROM_RENDER_GROUP);
        // newmesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET|GFX_CTX_FLAGS.RENDER_GROUP_MATCH_FROM_GROUP);
        newmesh.GenGfxCtx();
        Widget_render(newmesh);
        l_y_pos += newmesh.geom.dim[1] * 2 + 3;
    }




    

    /********************************************************************************************************************************************/
    // EXAMPLE: Add two simple slider meshes
    // { /** Add slider mesh */
    //     const newmesh = Create_widget_slider(Style_slider_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [100,200,0], dim: [120, 10], col: PURPLE[5] }));
    //     // const newmesh = Create_widget_slider(Style_slider_default_properties({ is_root: _, pos: [100,0,0], dim: [120, 10], col: PURPLE[5] }));
    //     Widget_gfx_ready_enable({ mesh: newmesh, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.MOVE } });
        
    //     newmesh.SetViewGroupIndex(blu.group_bufferidxs[0]);
    //     newmesh.GfxCtxSetFlag(GFX_CTX_FLAGS.PRIVATE|GFX_CTX_FLAGS.FROM_ROOT_WIDGET);
    //     newmesh.GenGfxCtx();
    //     // Layout_basic_pre_render(newmesh);
    //     Widget_render(newmesh);
    // }



    View_reset_rendering_buffer_whole_view_group(blu.group_bufferidxs[0]); // Reset info panel and info text
    Layout_basic_pre_render(blu);
    View_render_whole_view_group_NEW(blu.group_bufferidxs[0]); // rerender test mesh

    return blu;
}
/** */
function Test_align_many_sliders(x=0, y=0) {

    const pos = [x, y, 0];
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
    // Render
    root.GenGfxCtx();
    Layout_basic_pre_render(root);
    Widget_render(root);
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
    Widget_gfx_ready_enable({ mesh: section, enable_sdf_rect: rcorners1, listener: { type: LISTEN_EVENT_TYPES.MOVE } })


    const s2 = Sections2(_, LAYOUT.HORIZONTAL); 
    section.AddItem(s2); 
    s2.RenderToNewRenderGroup();
    const s3 = Sections2(_, LAYOUT.HORIZONTAL); 
    section.AddItem(s3); 
    s3.RenderToNewRenderGroup();

    section.GenGfxCtx();
    Layout_basic_pre_render(section);

    Widget_render(section);

    let xpos = 0;
    Time_intervals_create(1000, 'TEST ROTATION', TIME_INTERVAL_REPEAT_ALWAYS, (params) => {
        const mesh = params.params;
        Mesh_unif_set_vb_root_wposx(mesh.gfx.vb.render_groupidx, xpos);
        xpos+=5;

    }, s2)

    return section;
}




function CreateScrollerClampAlphaTest(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, num_items = 1, font_size = 8) {

    const _is_root = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? is_root : _;
    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: is_root, pad: [10, 10], pos: [x, y, 0], dim: [20, 100], col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .3, 0), 
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT,
    }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        set_state:MESH_STATE_FLAGS.IS_RESIZEABLE,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
        scroller: { width: 10, max_height: 100, },

    });
    
    // section.StateEnable(MESH_STATE_FLAGS.IS_RESIZEABLE);


    // Create scrolled section.
    const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [x, y, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({
        mesh: scrolled_section, enable_sdf_rect: 15,
    });
    scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
    section.AddItem(scrolled_section);

    // Create scrolled section items
    const count = num_items;
    let label = null;
    const brightness_increments = 1 / count;
    let brightness = 0;
    for (let i = 0; i < count; i++) {
        
        const l = Create_widget_label(Style_label_default_properties({ text: `${i}`, pos: [0, 0, 1], font_size: fontsize, col: Color_hsv_to_rgb_calibrated(0.7, 1., .8, 1, brightness, .0), text_pad: [6, 4], layout: LAYOUT.VERTICAL }))
        Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
        scrolled_section.AddItem(l);

        brightness += brightness_increments;
        label = l;
    }


    // Render
    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GenGfxCtx();
        Layout_basic_pre_render(section)
        Widget_render(section);
    }
    
    const scroller_comp = Components_get_scroller_component(section.scroller_comp_idx);
    Scoller_component_set_scrolled_section(scroller_comp, scrolled_section, section.scroller_comp_idx);
    Scroller_component_calculate_handle_pos_dim(scroller_comp);

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
function CreateScrollerManyWidgets(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, num_items = 1, font_size = 8) {

    const section_height = 120;
    const _is_root = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? is_root : _;
    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: is_root, pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
        col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, 0), 
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT 
    }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        set_state:MESH_STATE_FLAGS.IS_RESIZEABLE,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
        scroller: { width: 10, max_height: section_height, },
    });

    // Create scrolled section.
    const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [x, y, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({
        mesh: scrolled_section, enable_sdf_rect: 15,
    });
    scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
    section.AddItem(scrolled_section);

    // Create scrolled section items
    const count = num_items;
    // const count = 1;
    const brightness_increments = 1 / count;
    let brightness = 0;
    for (let i = 0; i < count; i++) {
        
        let cnt = 0;
        const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
        Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
        scrolled_section.AddItem(s1); 
        // s1.RenderToNewRenderGroup();
        {
            // const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
            // Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

            // const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` }));
            // Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
            // s2.AddItem(l);

            const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'}));
            Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
            s1.AddItem(sw);

            const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
            Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
            s1.AddItem(sl);
        }

        brightness += brightness_increments;
    }


    // Render
    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GenGfxCtx();
        Layout_basic_pre_render(section)
        Widget_render(section);
        
        const scroller_comp = Components_get_scroller_component(section.scroller_comp_idx);
        Scoller_component_set_scrolled_section(scroller_comp, scrolled_section, section.scroller_comp_idx);
        Scroller_component_calculate_handle_pos_dim(scroller_comp);
    }

    return section;
}
function CreateScrollerDeepNested(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, num_items = 1, font_size = 8) {
    
    
    const _is_root = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? is_root : _;
    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: is_root, pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
        col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, .2), name: 'Root',
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
    }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
        // scroller: { width: 10, max_height: section_height, },
    });

    
    const count = num_items;
    // const count = 3;
    let scroller1 = null,
        scroller2 = null;
    // Scroll sample 1
    {
        // Scroller parent
        const section_height = 120;
        const s = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
            col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT 
        }));
        Widget_gfx_ready_enable({
            mesh: s, enable_sdf_rect: 15,
            listener: { type: LISTEN_EVENT_TYPES.MOVE },
            scroller: { width: 10, max_height: section_height, },
        });
        section.AddItem(s);
        scroller1 = s;
        
    
        // Create scrolled section.
        const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [x, y, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
        Widget_gfx_ready_enable({
            mesh: scrolled_section, enable_sdf_rect: 15,
        });
        scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
        s.AddItem(scrolled_section);
        Scoller_component_set_scrolled_section(s.scroller_comp, scrolled_section);
        
        // Create scrolled section items
        const brightness_increments = 1 / count;
        let brightness = 0;
        for (let i = 0; i < count; i++) {
            
            let cnt = 0;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            scrolled_section.AddItem(s1); 
            // s1.RenderToNewRenderGroup();
            {
                // const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
                // Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

                // const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` }));
                // Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                // s2.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'}));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);

                // const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                // Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                // s1.AddItem(sl);
            }
    
            brightness += brightness_increments;
        }
    }
    // Scroll sample 2
    {
        // Scroller parent
        const section_height = 160;
        const s = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
            col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT 
        }));
        Widget_gfx_ready_enable({
            mesh: s, enable_sdf_rect: 15,
            listener: { type: LISTEN_EVENT_TYPES.MOVE },
            scroller: { width: 10, max_height: section_height, },
        });
        section.AddItem(s);
        scroller2 = s;
    
    
        // Create scrolled section.
        const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [x, y, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
        Widget_gfx_ready_enable({
            mesh: scrolled_section, enable_sdf_rect: 15,
        });
        scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
        s.AddItem(scrolled_section);
        Scoller_component_set_scrolled_section(s.scroller_comp, scrolled_section);
        
        // Create scrolled section items
        const brightness_increments = 1 / count;
        let brightness = 0;
        for (let i = 0; i < count; i++) {
            
            let cnt = 0;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            scrolled_section.AddItem(s1); 
            {
                const s2 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.8, .8, 1, .8, .4, 0), layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:`${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: s2, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); s1.AddItem(s2); s2.gfx_ctx_flags = (GFX_CTX_FLAGS.PRIVATE | GFX_CTX_FLAGS.FROM_PARENT_ASC_SEARCH_ALL);

                const l = Create_widget_label(Style_label_default_properties({ text: `HI!`, pos: [0, 0, 1], font_size: font_size, col: BLUEL[7], text_pad: [6, 4], layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s2.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'}));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);

                const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                s1.AddItem(sl);
            }
    
            brightness += brightness_increments;
        }
    }



    // Render
    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GenGfxCtx();
        Layout_basic_pre_render(section)
        Widget_render(section);

        Scroller_component_calculate_handle_pos_dim(scroller1.scroller_comp);
        Scroller_component_calculate_handle_pos_dim(scroller2.scroller_comp);
    }
    
    return section;
}
function CreateDropdownWithScroller(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, num_items = 1, font_size = 8) {
    
    
    const _is_root = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? is_root : _;
    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: is_root, pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
        col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, .2), name: 'Root',
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
    }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
        // scroller: { width: 10, max_height: section_height, },
    });

    
    const text_pad = [12, 6],
          pad = [6, 6],
          dp_rcorners = 7,
          dp_col = GREY[4],
          menu_col = GREY[2];

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ text: `ROOT`, pos: [0,0,1], col: dp_col, menu_col: menu_col, btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, });
    Dropdown_roots_set_root(dp, dp);
    section.AddItem(dp);



    const count = num_items;
    let scroller1 = null,
        scroller2 = null,
        scroller3 = null,
        scroller4 = null;
    // Scroll sample 1
    {
        // Scroller parent
        const section_height = 110;
        const s = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
            col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT 
        }));
        Widget_gfx_ready_enable({
            mesh: s, enable_sdf_rect: 15,
            scroller: { width: 10, max_height: section_height, },
        });
        dp.AddToMenu(s);
        scroller1 = s;

        dp.menu.AddChildScrollerIdx(scroller1.scroller_comp_idx); // MUST add in order to call recalc on scroller from dp

        // Create scrolled section.
        const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [x, y, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
        Widget_gfx_ready_enable({
            mesh: scrolled_section, enable_sdf_rect: 15,
        });
        scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
        s.AddItem(scrolled_section);
        Scoller_component_set_scrolled_section(scroller1.scroller_comp, scrolled_section);
        
        // Create scrolled section items
        const brightness_increments = 1 / count;
        let brightness = 0;
        for (let i = 0; i < count; i++) {
            
            let cnt = 0;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ 
                pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: 
                Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), 
                layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` 
            }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            scrolled_section.AddItem(s1); 
            {
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `Switch ${i}`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: [6, 4], layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ 
                    pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), 
                    handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'
                }));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);

                // const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                // Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                // s1.AddItem(sl);
            }
    
            brightness += brightness_increments;
        }
    }
    // Scroll sample 2
    {
        // Scroller parent
        const section_height = 110;
        const s = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
            col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT 
        }));
        Widget_gfx_ready_enable({
            mesh: s, enable_sdf_rect: 15,
            scroller: { width: 10, max_height: section_height, },
        });
        dp.AddToMenu(s);
        scroller2 = s;

        dp.menu.AddChildScrollerIdx(scroller2.scroller_comp_idx); // MUST add in order to call recalc on scroller from dp

        // Create scrolled section.
        const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [x, y, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
        Widget_gfx_ready_enable({
            mesh: scrolled_section, enable_sdf_rect: 15,
        });
        scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
        s.AddItem(scrolled_section);
        Scoller_component_set_scrolled_section(scroller2.scroller_comp, scrolled_section);
        
        // Create scrolled section items
        const brightness_increments = 1 / count;
        let brightness = 0;
        for (let i = 0; i < count; i++) {
            
            let cnt = 0;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            scrolled_section.AddItem(s1); 
            
            const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'}));
            Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
            s1.AddItem(sw);
    
            brightness += brightness_increments;
        }
    }
    // Scroll sample 3
    {
        // Scroller parent
        const section_height = 110;
        const s = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
            col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
            layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT 
        }));
        Widget_gfx_ready_enable({
            mesh: s, enable_sdf_rect: 15,
            scroller: { width: 10, max_height: section_height, },
        });
        dp.AddToMenu(s);
        scroller3 = s;

        dp.menu.AddChildScrollerIdx(scroller3.scroller_comp_idx); // MUST add in order to call recalc on scroller from dp

        // Create scrolled section.
        const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
            col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
        }));
        Widget_gfx_ready_enable({
            mesh: scrolled_section, enable_sdf_rect: 15,
        });
        scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
        s.AddItem(scrolled_section);
        Scoller_component_set_scrolled_section(scroller3.scroller_comp, scrolled_section);
        
        // Create scrolled section items
        const brightness_increments = 1 / count;
        let brightness = 0;
        for (let i = 0; i < count; i++) {
            
            let cnt = 0;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ 
                pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: 
                Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), 
                layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` 
            }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            scrolled_section.AddItem(s1); 
            {
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `Switch ${i}`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: [6, 4], layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ 
                    pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), 
                    handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'
                }));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);
                
                const sl = Create_widget_slider(Style_slider_default_properties({ 
                    pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', 
                    theme: Color_theme_slider_auto(.57, .8, .18, 0), 
                    layout:LAYOUT.VERTICAL 
                }));
                Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                s1.AddItem(sl);
            }
    
            brightness += brightness_increments;
        }
    }
    // Scroll sample 4
    {
        // Scroller parent
        const section_height = 110;
        const s = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
            col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT 
        }));
        Widget_gfx_ready_enable({
            mesh: s, enable_sdf_rect: 15,
            scroller: { width: 10, max_height: section_height, },
        });
        dp.AddToMenu(s);
        scroller4 = s;

        dp.menu.AddChildScrollerIdx(scroller4.scroller_comp_idx); // MUST add in order to call recalc on scroller from dp

        // Create scrolled section.
        const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
            col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
        }));
        Widget_gfx_ready_enable({
            mesh: scrolled_section, enable_sdf_rect: 15,
        });
        scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
        s.AddItem(scrolled_section);
        Scoller_component_set_scrolled_section(scroller4.scroller_comp, scrolled_section);
        
        // Create scrolled section items
        const brightness_increments = 1 / count;
        let brightness = 0;
        for (let i = 0; i < count; i++) {
            
            let cnt = 0;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            scrolled_section.AddItem(s1); 
            
            const sw = Create_widget_switch_simple(Style_switch_default_properties({ pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'}));
            Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
            s1.AddItem(sw);
    
            brightness += brightness_increments;
        }
    }

    // Render
    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GenGfxCtx();
        Layout_basic_pre_render(section)
        Widget_render(section);

        Scroller_component_calculate_handle_pos_dim(scroller1.scroller_comp);
        Scroller_component_calculate_handle_pos_dim(scroller2.scroller_comp);
        Scroller_component_calculate_handle_pos_dim(scroller3.scroller_comp);
        Scroller_component_calculate_handle_pos_dim(scroller4.scroller_comp);
    }
    
    return section;
}
function CreateDropdownWithScrollerManyDps(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, num_items = 1, font_size = 8) {
    
    
    const _is_root = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? is_root : _;
    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: is_root, pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
        col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, .2), name: 'Root',
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
    }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
        // scroller: { width: 10, max_height: section_height, },
    });

    
    const text_pad = [12, 6],
          pad = [6, 6],
          dp_rcorners = 7,
          dp_col = GREY[4],
          menu_col = GREY[2];

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ text: `ROOT`, pos: [0,0,1], col: dp_col, menu_col: menu_col, btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, });
    Dropdown_roots_set_root(dp, dp);
    section.AddItem(dp);



    const num_scrollers = 5;
    const scrollers = [];
    // Scroll sample 1
    for (let dps = 0; dps < num_scrollers; dps++){

        const count = num_items;
        
        const dp_sub1 = Create_widget_dropdown(Style_dropdown_default_properties({ 
            is_root: 0x0, text: `dp_sub${dps}`, pos: [0,0,1], col: dp_col, menu_col: menu_col, 
            btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, 
            layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name:`dp_sub${dps}`
        }));
        Widget_gfx_ready_enable({ mesh: dp_sub1, enable_sdf_rect: dp_rcorners, });
        dp.AddToMenu(dp_sub1);

        // Scroller parent
        const section_height = 110;
        const s = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
            col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT, name:'FIXED'
        }));
        Widget_gfx_ready_enable({
            mesh: s, enable_sdf_rect: 15,
            scroller: { width: 10, max_height: section_height, },
        });
        dp_sub1.AddToMenu(s);
        scrollers.push(s);

        dp_sub1.menu.AddChildScrollerIdx(scrollers[dps].scroller_comp_idx); // MUST add in order to call recalc on scroller from dp

        // Create scrolled section.
        const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ 
            pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
            col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), 
            layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'ScrolledSection' 
        }));
        Widget_gfx_ready_enable({
            mesh: scrolled_section, enable_sdf_rect: 15,
        });
        scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
        s.AddItem(scrolled_section);
        Scoller_component_set_scrolled_section(scrollers[dps].scroller_comp, scrolled_section);
        
        // Create scrolled section items
        const brightness_increments = 1 / count;
        let brightness = 0;
        for (let i = 0; i < count; i++) {
            
            let cnt = 0;
            const s1 = Create_rect_mesh(Style_rect_default_properties({ 
                pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: 
                Color_hsv_to_rgb_calibrated(.13, 1, 1, .8, brightness, 0), 
                layout:LAYOUT.VERTICAL|LAYOUT.RESIZE_SELF , name:`${cnt++}` 
            }));
            Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER} }); 
            scrolled_section.AddItem(s1); 
            {
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `Switch ${i}`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: [6, 4], layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(l);

                const sw = Create_widget_switch_simple(Style_switch_default_properties({ 
                    pos: [0, 0, 1], size: 20, col: GREY[5], theme: Color_theme_switch_auto(.14), 
                    handle_col: _, hover_margin: 8, layout:LAYOUT.HORIZONTAL, name:'Switch'
                }));
                Widget_gfx_ready_enable({ mesh: sw, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                s1.AddItem(sw);

                const sl = Create_widget_slider(Style_slider_default_properties({ pos: [0, 0, 0], dim: [120, 15], name: 'Slider Sample', col: GREY[5], theme: Color_theme_slider_auto(.0, .8, .18, 0), layout:LAYOUT.VERTICAL }));
                Widget_gfx_ready_enable({ mesh: sl, enable_sdf_rect: 10, }); 
                s1.AddItem(sl);
            }
    
            brightness += brightness_increments;
        }
    }


    // Render
    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GenGfxCtx();
        Layout_basic_pre_render(section)
        Widget_render(section);

        for (let i = 0; i < num_scrollers; i++)
            Scroller_component_calculate_handle_pos_dim(scrollers[i].scroller_comp);
        // Scroller_component_calculate_handle_pos_dim(scroller2.scroller_comp);
        // Scroller_component_calculate_handle_pos_dim(scroller3.scroller_comp);
        // Scroller_component_calculate_handle_pos_dim(scroller4.scroller_comp);
    }
    
    return section;
}



/** */
function Create_mesh_info_ui(is_root = ROOT_WIDGETS.CREATE_ROOT, x = 0, y = 0, num_items = 1, font_size = 8, view_groupidx) {

        
    const _is_root = (is_root & ROOT_WIDGETS.CREATE_ROOT) ? is_root : _;
    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root: is_root, pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
        col: Color_hsv_to_rgb_calibrated(.6, .5, 1, 1, .1, .2), name: 'Root',
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF 
    }));
    Widget_gfx_ready_enable({
        mesh: section, enable_sdf_rect: 15,
        listener: { type: LISTEN_EVENT_TYPES.MOVE },
    });

    
    const text_pad = [12, 6],
          pad = [6, 6],
          dp_rcorners = 7,
          dp_col = GREY[2],
          menu_col = GREY[1];

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ 
        text: `Meshes`, pos: [0,0,1], col: dp_col, menu_col: menu_col, btn_col: GREY[7], 
        text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, 
        layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name: 'Meshes', 
    }));
    Widget_gfx_ready_enable({ mesh: dp, enable_sdf_rect: dp_rcorners, });
    Dropdown_roots_set_root(dp, dp);
    section.AddItem(dp);


    
    
    

    // const meshes = Mesh_buffer_get();
    const root_view = Root_group_view_buffer_get();
    const scrollers = [];
    
    const mesh_idxs = root_view.buffer[view_groupidx];
    const num_meshes = mesh_idxs.boundary;

    const dp_roots = Create_widget_dropdown(Style_dropdown_default_properties({ 
        is_root: 0x0, text: `root`, pos: [0,0,1], col: dp_col, menu_col: menu_col, 
        btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, 
        layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name:`root`
    }));
    Widget_gfx_ready_enable({ mesh: dp_roots, enable_sdf_rect: dp_rcorners, });
    dp.AddItem(dp_roots);
    
    // Scroller parent
    const section_height = 110;
    const s = Create_rect_mesh(Style_rect_default_properties({ 
        pad: [10, 10], pos: [x, y, 0], dim: [20, section_height], 
        col: Color_hsv_to_rgb_calibrated(.73, 1., 1, 1, .1, 2), 
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF | LAYOUT.FIXED_HEIGHT, name:'FIXED'
    }));
    Widget_gfx_ready_enable({
        mesh: s, enable_sdf_rect: 15,
        scroller: { width: 10, max_height: section_height, },
    });
    dp_roots.AddToMenu(s);
    scrollers.push(s);

    dp_roots.menu.AddChildScrollerIdx(scrollers[0].scroller_comp_idx); // MUST add in order to call recalc on scroller from dp

    // Create scrolled section.
    const scrolled_section = Create_rect_mesh(Style_rect_default_properties({ 
        pad: [10, 10], pos: [x, y, 0], dim: [20, 20], 
        col: Color_hsv_to_rgb_calibrated(.3, 1, 1, 1, .3, 0), 
        layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF, name:'ScrolledSection' 
    }));
    Widget_gfx_ready_enable({
        mesh: scrolled_section, enable_sdf_rect: 15,
    });
    scrolled_section.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
    s.AddItem(scrolled_section);
    Scoller_component_set_scrolled_section(scrollers[0].scroller_comp, scrolled_section);


    for (let j = 0; j <= num_meshes; j++){
        
        const meshidx = mesh_idxs.buffer[j];
        const mesh = Mesh_buffer_get_mesh_byidx(meshidx);

        const dp_mesh = Create_widget_dropdown(Style_dropdown_default_properties({ 
            is_root: 0x0, text: `${meshidx}: ${mesh.name}`, pos: [0,0,1], col: dp_col, menu_col: menu_col, 
            btn_col: GREY[7], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, 
            layout: LAYOUT.VERTICAL | LAYOUT.RESIZE_SELF, name:`${mesh.name}}`
        }));
        Widget_gfx_ready_enable({ mesh: dp_mesh, enable_sdf_rect: dp_rcorners, });
        scrolled_section.AddItem(dp_mesh);

        { // COLLECT MESH INFO
            let cnt = 0;
            const l_text_pad = [16, 8];
            {
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `IsActive: ${mesh.state.mask&MESH_STATE_FLAGS.ACTIVE}`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: l_text_pad, layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                // dp_mesh.AddToMenu(l);
                scrolled_section.AddItem(l);
            }
            {
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `VBidx: ${mesh.gfx.vb.groupidx}`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: l_text_pad, layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                // dp_mesh.AddToMenu(l);
                scrolled_section.AddItem(l);
            }
            {
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `RGidx: ${mesh.gfx.vb.render_groupidx}`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: l_text_pad, layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                // dp_mesh.AddToMenu(l);
                scrolled_section.AddItem(l);
            }
            {
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `Pos: [x:${mesh.geom.pos[0]}, y:${mesh.geom.pos[0]}]`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: l_text_pad, layout:LAYOUT.VERTICAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                // dp_mesh.AddToMenu(l);
                scrolled_section.AddItem(l);
            }
            { // LAYOUT
                const l = Create_widget_label(Style_label_default_properties({ 
                    theme: Color_theme_label_auto(.58, 1., .03, .0),
                    text: `Layout:`, pos: [0, 0, 1], font_size: font_size-2, 
                    text_pad: l_text_pad, layout:LAYOUT.VERTICAL, name:`l${cnt++}` 
                }));
                Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                // dp_mesh.AddToMenu(l);
                scrolled_section.AddItem(l);
                {
                    const l = Create_widget_label(Style_label_default_properties({ 
                        theme: Color_theme_label_auto(.58, 1., .03, .0),
                        text: `Resize-self: ${mesh.align.flags&LAYOUT.RESIZE_SELF}`, pos: [0, 0, 1], font_size: font_size-2, 
                        text_pad: l_text_pad, layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                    }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    // dp_mesh.AddToMenu(l);
                    scrolled_section.AddItem(l);
                }
                {
                    const l = Create_widget_label(Style_label_default_properties({ 
                        theme: Color_theme_label_auto(.58, 1., .03, .0),
                        text: `Fixed-height: ${mesh.align.flags&LAYOUT.FIXED_HEIGHT}`, pos: [0, 0, 1], font_size: font_size-2, 
                        text_pad: l_text_pad, layout:LAYOUT.HORIZONTAL, name:`l${cnt++}` 
                    }));
                    Widget_gfx_ready_enable({ mesh: l, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
                    // dp_mesh.AddToMenu(l);
                    scrolled_section.AddItem(l);
                }
            }

        }
    }


    // Render
    if (_is_root & ROOT_WIDGETS.CREATE_ROOT) {

        section.GenGfxCtx();
        Layout_basic_pre_render(section)
        Widget_render(section);

        // for (let i = 0; i < scrollers.length; i++)
        //     Scroller_component_calculate_handle_pos_dim(scrollers[i].scroller_comp);
    }
    
    return section;
}










/**************************************************************************************************************************************/
// Widget Section Tests


let grey_cnt = 0;
let green_cnt = 0;
let orange_cnt = 0;
/** */
function Sections2(is_root, layout) {

    const tr = .7;
    const marg = [5, 5];
    const dim = [15, 15];

    // const grey = Create_rect_mesh(is_root, layout, marg, [0, 0, 0], dim, TRANSPARENCY(GREY[0], tr));
    const grey = Create_rect_mesh(Style_rect_default_properties({ is_root: is_root, pad: marg, pos: [0, 0, 0], dim: [0,0], col: Color_hsv_to_rgb_calibrated(.74, 0, 1, .8, .1, 0), layout: layout|LAYOUT.RESIZE_SELF, name: `#grey${grey_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: grey, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });

    // const green = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: [5,5], pos: [0, 0, 0], dim: [0,0], col: Color_hsv_to_rgb_calibrated(.34, 1, tr, 1, .5, 0), layout: layout|LAYOUT.RESIZE_SELF, name: `green${green_cnt++}` }));
    const green = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: marg, pos: [0, 0, 0], dim: [0,0], col: Color_hsv_to_rgb_calibrated(.34, 1, tr, 1, .5, 0), layout: layout|LAYOUT.RESIZE_SELF, name: `green${green_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: green, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    grey.AddItem(green);

    const orange = Create_rect_mesh(Style_rect_default_properties({ is_root: _, pad: [0,0], pos: [0, 0, 0], dim: dim, col: Color_hsv_to_rgb_calibrated(.12, 1, tr, 1, .8, 0), layout: layout, name: `orange${orange_cnt++}` }));
    Widget_gfx_ready_enable({ mesh: orange, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } });
    green.AddItem(orange);

    return grey;
}
/** */
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
/** */
function Help() {

    const font_size = 10;
    const section = Create_rect_mesh(Style_rect_default_properties({ 
        is_root:ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], 
        pos: [0, 0, 0], dim: [20, 300], col: Color_hsv_to_rgb_calibrated(.0, .0, 1, .8, .05, 0), 
        layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF, name:'HelpSection' 
    }));
    Widget_gfx_ready_enable({ 
        mesh: section, enable_sdf_rect: 20, listener: { type: LISTEN_EVENT_TYPES.MOVE},
        scroller: { width: 10, max_height: 300, },
    }); 


    const s1 = Create_rect_mesh(Style_rect_default_properties({ 
        pad: [10, 10], pos: [0, 0, 0], dim: [20, 20], col: Color_hsv_to_rgb_calibrated(.0, .0, 1, 1., .15, 0), 
        layout:LAYOUT.HORIZONTAL|LAYOUT.RESIZE_SELF , name:'subSection' 
    }));
    Widget_gfx_ready_enable({ mesh: s1, enable_sdf_rect: 20,}); 
    s1.RenderToNewRenderGroup(); // MUST, in order for the scrolled section to be able to move independently
    section.AddItem(s1);

    const msg = 'Press the characters in quotes in sequence.\nE.x. "a1": press and hold \'a\', then press \'1\' ';
    const description = Create_widget_label(Style_label_default_properties({ 
        theme: Color_theme_label_auto(.1, 1., .08, .0),
        text: msg, pos: [0, 0, 1], font_size: font_size, 
        text_pad: [8, 6], layout:LAYOUT.VERTICAL|LAYOUT.EXPAND, name:msg,
    }));
    Widget_gfx_ready_enable({ mesh: description, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 
    s1.AddItem(description);

    let msgs = [];
    for (let i = 1; i < DEBUG_PRINT_KEYS.length; i++) {

        msgs[i] = '\"' + DEBUG_PRINT_KEYS[i].key + '\": ' + DEBUG_PRINT_KEYS[i].discr
        const label = Create_widget_label(Style_label_default_properties({ 
            theme: Color_theme_label_auto(.4, 1., .08, .0),
            text: msgs[i], pos: [0, 0, 1], font_size: font_size, 
            text_pad: [8, 6], layout:LAYOUT.VERTICAL|LAYOUT.EXPAND, name:`label${i++}` 
        }));
        Widget_gfx_ready_enable({ mesh: label, enable_sdf_rect: 10, listener: { type: LISTEN_EVENT_TYPES.HOVER } }); 

        s1.AddItem(label);

    }

    
    section.GenGfxCtx();
    Layout_basic_pre_render(section);
    Layout_expand_x_axis(section);
    Widget_render(section);


    const scroller_comp = Components_get_scroller_component(section.scroller_comp_idx);
    Scoller_component_set_scrolled_section(scroller_comp, s1, section.scroller_comp_idx);
    Scroller_component_calculate_handle_pos_dim(scroller_comp);

    // Set scissor box
    const mx = section.mesh_bufferidx;
    const my = scroller_comp.mesh_bufferidx;
    const mw = section.mesh_bufferidx;
    const mh = scroller_comp.mesh_bufferidx;
    View_create_scissorbox(section.group_bufferidxs[0], mx, my, mw, mh);


    // Create label animations
    for (let i = 1; i <= s1.children.boundary; i++) {

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

    const dp = Create_widget_dropdown(Style_dropdown_default_properties({ text: `Menu`, pos: [0, 0, 0], col: dp_col, menu_col: menu_col, btn_col: GREY[3], text_col: WHITE, pad: pad, text_pad: text_pad, font_size: font_size, layout: LAYOUT.HORIZONTAL | LAYOUT.RESIZE_SELF }));
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
    Layout_basic_pre_render(window_menu);

    Widget_render(window_menu);


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

        Vertex_buffer_calculate_vertexbuffer_render_group_starts();
        View_render_from_view_NEW(label.group_bufferidxs[0]);


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

    const mesh = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pos: [x, y, 1], dim: [w, h], col: color, name: 'ExplosionMeshCircle', }));
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
    const rect = Create_rect_mesh(Style_rect_default_properties({ is_root: ROOT_WIDGETS.CREATE_ROOT, pad: [10, 10], pos: [10, 200, 0], dim: [dim, dim], col: YELLOW[7], name: 'SHADER_FN:NOISE TEST', }));
    Widget_gfx_ready_enable({ mesh: rect, enable_unif_time: true, listener: { type: LISTEN_EVENT_TYPES.MOVE } })

    rect.GfxEnableAttr(SID.ATTR.DIM2);
    rect.GfxEnableFn(SID.SHAD.FN_NOISE, { time: .3, blend_mode: SID.BLEND_OPTIONS.BLEND_MODE_ADD });


    // Use u_time to quicly establish a uniform for the testing
    const control_values = [.0, .02, .1, 1];
    rect.EnableGfxUniforms({ unif: SID.UNIF.FS_GENERIC_CONTROLS }, 'u_generic_controls', UNIF_TYPE.FARR, UNIFORM.IN_FS, control_values.length);

    // Render
    rect.GenGfxCtx();
    Widget_render(rect);
    rect.GfxUniformSetAndUpdate('u_generic_controls', control_values);


    const slider_dim = [120 * DEVICE.device_scale, 10 * DEVICE.device_scale];
    Controls_create_slider_controls_from_shader_uniform_buffer_with_panel(rect, slider_dim, control_values, 'u_generic_controls', ROOT_WIDGETS.CREATE_ROOT, 10, 0);

}






